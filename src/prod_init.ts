import { consumerOpts, Nuid } from "nats";
import { Event } from "../proto/event";
import { EventCtx } from "./event_ctx";
import * as nats from 'nats';

const nuid = new Nuid()
const clientId = nuid.next()
const startTime = Date.now()

export async function prodInit(handler: (event: EventCtx) => Promise<any>) {
    const target = process.env["FAAS_TARGET"];
    const natsUrl = process.env['NATS_URL'];
    const timeout = process.env['FAAS_TIMEOUT'];
    if (!target) {
        console.error("env FAAS_TARGET missing");
    }
    if (!natsUrl) {
        console.error("env NATS_URL missing");
    }
    const timeoutDuration = timeout ? +timeout : 120;
    const nc = await nats.connect({
        servers: natsUrl.split(",")
            .map(x => x.trim().replace(/^nats:\/\//, ''))
    });
    const stream = "faas.event." + target;
    const durable = stream.replace(/\./g, "_");
    const js = nc.jetstream();
    const routine = (async function () {
        while (true) {
            // const iter = await js.fetch("faas_event", durable, {batch: 1, expires: 10000});
            const opts = consumerOpts();
            opts.durable(durable);
            opts.queue("dg." + stream);
            let iter = await js.subscribe(stream, opts);
            for await (const m of iter) {
                let event: Event;
                const start = Date.now();
                try {
                    event = Event.fromBinary(m.data);
                } catch (e) {
                    console.error(e);
                    m.term();
                }
                const c = new EventCtx(event, target);
                let sent = false;
                c.sender = () => {
                    try {
                        sent = true;
                        const now = Date.now();
                        c.resp.time = BigInt(now);
                        c.resp.usedTime = now - start;
                        const d = c.getResponseBinary();
                        nc.publish("faas.response." + c.event.senderId, d);
                    } catch (e) {
                        console.error(e);
                        m.term();
                    }
                };
                c.retry = (reason: string) => {
                    c.resp.retry = true;
                    c.response(500, reason);
                    m.nak();
                    sent = true;
                };
                try {
                    const t = setTimeout(() => {
                        console.error("handler function not finish in timeout, exit");
                        process.exit(1);
                    });
                    const result = await handler(c);
                    clearTimeout(t);
                    if (!sent) {
                        c.response(200, result);
                    }
                    m.ack();
                } catch (e) {
                    console.error(e);
                    if (!sent) {
                        c.response(500, e.toString());
                        c.sender();
                    }
                    m.ack();
                }
            }
        }
    });
    setInterval(() => {
        nc.publish("sie-heartbeat", Buffer.from(JSON.stringify({
            Uptime: Math.round((Date.now() - startTime) / 1000),
            Name: target,
            Status: 'ok',
            Type: "function",
            ID: clientId,
        })));
    }, 10000);
    const parallel = process.env['FAAS_CONCURRENT'];
    if (parallel) {
        let p = +parallel;
        if (p > 1) {
            for (let i = 0; i < 10; i++) {
                routine();
            }
        }
    } else {
        routine();
    }
}
