"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const event_1 = require("./proto/event");
const nats = require("nats");
const nats_1 = require("nats");
function buildHeaders(h) {
    const out = [];
    for (let [k, v] of h.entries()) {
        out.push(k, v);
    }
    return out;
}
class EventCtx {
    constructor(event, target) {
        this.event = event;
        this.reqHeaders = new Map();
        this.respHeaders = new Map();
        this.resp = {
            eventId: event.eventId,
            requestId: event.requestId,
            status: 200,
            body: null,
            contentType: null,
            bodyType: event_1.BodyType.Raw,
            headers: [],
            usedTime: 0,
            time: 0n,
            subject: target,
            retry: false
        };
        for (let i = 0; i < event.headers.length / 2; i++) {
            this.reqHeaders.set(event.headers[2 * i], event.headers[2 * i + 1]);
        }
    }
    getRequestHeader(key) {
        return this.reqHeaders.get(key);
    }
    setResponseHeader(key, value) {
        this.respHeaders.set(key, value);
    }
    response(status, body) {
        if (typeof body == "string") {
            this.resp.body = Buffer.from(body, 'utf8');
            this.setResponseHeader("content-type", "text/plain;charset=utf8");
        }
        else if (body instanceof ArrayBuffer) {
            this.resp.body = new Uint8Array(body);
        }
        else if (body instanceof Buffer) {
            this.resp.body = body;
        }
        else {
            this.resp.body = Buffer.from(JSON.stringify(body), 'utf8');
            this.setResponseHeader("content-type", "application/json");
        }
        this.resp.status = status;
        this.setResponseHeader("content-length", this.resp.body.byteLength);
        this.sender();
    }
    // error(status: number, err: any) {
    //     if (status < 200 || status > 599) {
    //         status = 500
    //     }
    //     this.response(status,err)
    // }
    getResponseBinary() {
        this.resp.headers = buildHeaders(this.respHeaders);
        return event_1.Response.toBinary(this.resp);
    }
    needRetry(reason) {
        this.retry(reason);
    }
}
async function init(handler) {
    const mode = process.env["MODE"];
    if (mode == "prod") {
        await prodInit(handler);
    }
    else if (mode == "test") {
        await testInit(handler);
    }
    else {
        await localInit(handler);
    }
}
exports.init = init;
function localInit(handler) {
}
const nuid = new nats_1.Nuid();
const clientId = nuid.next();
const startTime = Date.now();
async function prodInit(handler) {
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
            const opts = (0, nats_1.consumerOpts)();
            opts.durable(durable);
            opts.queue("dg." + stream);
            let iter = await js.subscribe(stream, opts);
            for await (const m of iter) {
                let event;
                const start = Date.now();
                try {
                    event = event_1.Event.fromBinary(m.data);
                }
                catch (e) {
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
                    }
                    catch (e) {
                        console.error(e);
                        m.term();
                    }
                };
                c.retry = (reason) => {
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
                }
                catch (e) {
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
    setTimeout(() => {
        nc.publish("sie-hearbeat", Buffer.from(JSON.stringify({
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
    }
    else {
        routine();
    }
}
function testInit(handler) {
}
