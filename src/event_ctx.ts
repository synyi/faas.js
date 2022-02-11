import { BodyType, Event, Response } from "../proto/event";
import { buildHeaders } from "./utils";

export class EventCtx {
    private reqHeaders = new Map<string, string>();
    private respHeaders = new Map<string, string>();

    public resp: Response;
    public sender: () => void;
    public retry: (reason: string) => void;

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
            retry: false
        };
        for (let i = 0; i < event.headers.length / 2; i++) {
            this.reqHeaders.set(event.headers[2 * i], event.headers[2 * i + 1]);
        }
    }

    getRequestHeader(key: string): string {
        return this.reqHeaders.get(key);
    }

    setResponseHeader(key, value) {
        this.respHeaders.set(key, value);
    }

    response(status: number, body: any) {
        if (typeof body == "string") {
            this.resp.body = Buffer.from(body, 'utf8');
            this.setResponseHeader("content-type", "text/plain;charset=utf8");
        } else if (body instanceof ArrayBuffer) {
            this.resp.body = new Uint8Array(body);
        } else if (body instanceof Buffer) {
            this.resp.body = body;
        } else {
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

    getResponseBinary(): Uint8Array {
        this.resp.headers = buildHeaders(this.respHeaders);
        return Response.toBinary(this.resp);
    }

    needRetry(reason: string) {
        this.retry(reason);
    }
}
