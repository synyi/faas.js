import {BodyType, Event, Response} from "./proto/event";
import * as nats from "nats"
import {consumerOpts, Nuid} from "nats"
import * as buffer from "buffer";


function buildHeaders(h: Map<string, string>): string[] {
    const out = []
    for (let [k, v] of h.entries()) {
        out.push(k, v)
    }
    return out;
}


class EventCtx {
    resp: Response
    private reqHeaders = new Map<string, string>()
    private respHeaders = new Map<string, string>()
    sender: () => void;
    retry: (reason) => void

    constructor(public event: Event, target: string) {
        this.resp = {
            eventId: event.eventId,
            requestId: event.requestId,
            status: 200,
            body: null,
            contentType: null,
            bodyType: BodyType.Raw,
            headers: [],
            usedTime: 0,
            time: 0n,
            subject: target,
            retry:false
        }
        for (let i = 0; i < event.headers.length / 2; i++) {
            this.reqHeaders.set(event.headers[2 * i], event.headers[2 * i + 1])
        }
    }

    getRequestHeader(key: string): string {
        return this.reqHeaders.get(key)
    }

    setResponseHeader(key, value) {
        this.respHeaders.set(key, value)
    }

    response(status: number, body: any) {
        if (typeof body == "string") {
            this.resp.body = Buffer.from(body, 'utf8');
            this.setResponseHeader("content-type", "text/plain;charset=utf8")
        } else if (body instanceof ArrayBuffer) {
            this.resp.body = new Uint8Array(body);
        } else if (body instanceof Buffer) {
            this.resp.body = body;
        } else {
            this.resp.body = Buffer.from(JSON.stringify(body), 'utf8');
            this.setResponseHeader("content-type", "application/json")
        }
        this.resp.status = status
        this.setResponseHeader("content-length", this.resp.body.byteLength)
        this.sender()
    }

    // error(status: number, err: any) {
    //     if (status < 200 || status > 599) {
    //         status = 500
    //     }
    //     this.response(status,err)
    // }

    getResponseBinary(): Uint8Array {
        this.resp.headers = buildHeaders(this.respHeaders)
        return Response.toBinary(this.resp)
    }

    needRetry(reason: string) {
        this.retry(reason)
    }
}

export async function init(handler: (EventCtx) => Promise<any>) {
    const mode = process.env["MODE"]
    if (mode == "prod") {
        await prodInit(handler)
    } else if (mode == "test") {
        await testInit(handler)
    } else {
        await localInit(handler)
    }

}

function localInit(handler: (event: EventCtx) => Promise<any>) {

}

const nuid = new Nuid()
const clientId = nuid.next()
const startTime = Date.now()

async function prodInit(handler: (event: EventCtx) => Promise<any>) {
    const target = process.env["FAAS_TARGET"]
    const natsUrl = process.env['NATS_URL']
    const timeout = process.env['FAAS_TIMEOUT']
    if (!target) {
        console.error("env FAAS_TARGET missing")
    }
    if (!natsUrl) {
        console.error("env NATS_URL missing")
    }
    const timeoutDuration = timeout ? +timeout : 120
    const nc = await nats.connect({
        servers: natsUrl.split(",")
            .map(x => x.trim().replace(/^nats:\/\//, ''))
    })
    const stream = "faas.event." + target
    const durable = stream.replace(/\./g, "_")
    const js = nc.jetstream()
    const routine = (async function () {
        while (true) {
            // const iter = await js.fetch("faas_event", durable, {batch: 1, expires: 10000});

            const opts = consumerOpts();
            opts.durable(durable);
            opts.queue("dg." + stream)
            let iter = await js.subscribe(stream, opts);
            for await (const m of iter) {
                let event: Event;
                const start = Date.now()
                try {
                    event = Event.fromBinary(m.data)
                } catch (e) {
                    console.error(e)
                    m.term()
                }
                const c = new EventCtx(event, target)
                let sent = false
                c.sender = () => {
                    try {
                        sent = true
                        const now = Date.now()
                        c.resp.time = BigInt(now)
                        c.resp.usedTime = now - start
                        const d = c.getResponseBinary()
                        nc.publish("faas.response." + c.event.senderId, d)
                    } catch (e) {
                        console.error(e);
                        m.term()
                    }
                }
                c.retry = (reason: string) => {
                    c.resp.retry = true
                    c.response(500, reason)
                    m.nak();
                    sent = true
                }
                try {
                    const t = setTimeout(() => {
                        console.error("handler function not finish in timeout, exit");
                        process.exit(1)
                    })
                    const result = await handler(c)
                    clearTimeout(t)
                    if (!sent) {
                        c.response(200, result)
                    }
                    m.ack()
                } catch (e) {
                    console.error(e);
                    if (!sent) {
                        c.response(500, e.toString())
                        c.sender()
                    }
                    m.ack()
                }
            }
        }
    })
    setInterval(() => {
        nc.publish("sie-heartbeat", Buffer.from(JSON.stringify({
            Uptime: Math.round((Date.now() - startTime) / 1000),
            Name: target,
            Status: 'ok',
            Type: "function",
            ID: clientId,
        })))
    }, 10000)
    const parallel = process.env['FAAS_CONCURRENT']
    if (parallel) {
        let p = +parallel
        if (p > 1) {
            for (let i = 0; i < 10; i++) {
                routine()
            }
        }
    } else {
        routine()
    }

}

function testInit(handler: (any) => Promise<any>) {

}