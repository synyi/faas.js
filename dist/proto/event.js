"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.Event = exports.ListString = exports.BodyType = exports.EventType = void 0;
const runtime_1 = require("@protobuf-ts/runtime");
const runtime_2 = require("@protobuf-ts/runtime");
const runtime_3 = require("@protobuf-ts/runtime");
const runtime_4 = require("@protobuf-ts/runtime");
const runtime_5 = require("@protobuf-ts/runtime");
/**
 * @generated from protobuf enum proto.EventType
 */
var EventType;
(function (EventType) {
    /**
     * @generated from protobuf enum value: HTTP = 0;
     */
    EventType[EventType["HTTP"] = 0] = "HTTP";
})(EventType = exports.EventType || (exports.EventType = {}));
/**
 * @generated from protobuf enum proto.BodyType
 */
var BodyType;
(function (BodyType) {
    /**
     * @generated from protobuf enum value: Raw = 0;
     */
    BodyType[BodyType["Raw"] = 0] = "Raw";
    /**
     * @generated from protobuf enum value: LINK = 1;
     */
    BodyType[BodyType["LINK"] = 1] = "LINK";
})(BodyType = exports.BodyType || (exports.BodyType = {}));
// @generated message type with reflection information, may provide speed optimized methods
class ListString$Type extends runtime_5.MessageType {
    constructor() {
        super("proto.ListString", [
            { no: 1, name: "values", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = { values: [] };
        globalThis.Object.defineProperty(message, runtime_4.MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            (0, runtime_3.reflectionMergePartial)(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated string values */ 1:
                    message.values.push(reader.string());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? runtime_2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated string values = 1; */
        for (let i = 0; i < message.values.length; i++)
            writer.tag(1, runtime_1.WireType.LengthDelimited).string(message.values[i]);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? runtime_2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto.ListString
 */
exports.ListString = new ListString$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Event$Type extends runtime_5.MessageType {
    constructor() {
        super("proto.Event", [
            { no: 1, name: "EventId", kind: "scalar", jsonName: "EventId", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "SenderId", kind: "scalar", jsonName: "SenderId", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "Type", kind: "enum", jsonName: "Type", T: () => ["proto.EventType", EventType] },
            { no: 4, name: "Method", kind: "scalar", jsonName: "Method", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "Url", kind: "scalar", jsonName: "Url", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "Body", kind: "scalar", jsonName: "Body", T: 12 /*ScalarType.BYTES*/ },
            { no: 7, name: "BodyType", kind: "enum", jsonName: "BodyType", T: () => ["proto.BodyType", BodyType] },
            { no: 8, name: "ContentType", kind: "scalar", jsonName: "ContentType", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "Headers", kind: "scalar", jsonName: "Headers", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "source", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "ttl", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 12, name: "time", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 13, name: "Subject", kind: "scalar", jsonName: "Subject", T: 9 /*ScalarType.STRING*/ },
            { no: 14, name: "RequestId", kind: "scalar", jsonName: "RequestId", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = { eventId: "", senderId: "", type: 0, method: "", url: "", body: new Uint8Array(0), bodyType: 0, contentType: "", headers: [], source: "", ttl: 0, time: 0n, subject: "", requestId: "" };
        globalThis.Object.defineProperty(message, runtime_4.MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            (0, runtime_3.reflectionMergePartial)(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string EventId = 1 [json_name = "EventId"];*/ 1:
                    message.eventId = reader.string();
                    break;
                case /* string SenderId = 2 [json_name = "SenderId"];*/ 2:
                    message.senderId = reader.string();
                    break;
                case /* proto.EventType Type = 3 [json_name = "Type"];*/ 3:
                    message.type = reader.int32();
                    break;
                case /* string Method = 4 [json_name = "Method"];*/ 4:
                    message.method = reader.string();
                    break;
                case /* string Url = 5 [json_name = "Url"];*/ 5:
                    message.url = reader.string();
                    break;
                case /* bytes Body = 6 [json_name = "Body"];*/ 6:
                    message.body = reader.bytes();
                    break;
                case /* proto.BodyType BodyType = 7 [json_name = "BodyType"];*/ 7:
                    message.bodyType = reader.int32();
                    break;
                case /* string ContentType = 8 [json_name = "ContentType"];*/ 8:
                    message.contentType = reader.string();
                    break;
                case /* repeated string Headers = 9 [json_name = "Headers"];*/ 9:
                    message.headers.push(reader.string());
                    break;
                case /* string source */ 10:
                    message.source = reader.string();
                    break;
                case /* int32 ttl */ 11:
                    message.ttl = reader.int32();
                    break;
                case /* int64 time */ 12:
                    message.time = reader.int64().toBigInt();
                    break;
                case /* string Subject = 13 [json_name = "Subject"];*/ 13:
                    message.subject = reader.string();
                    break;
                case /* string RequestId = 14 [json_name = "RequestId"];*/ 14:
                    message.requestId = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? runtime_2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string EventId = 1 [json_name = "EventId"]; */
        if (message.eventId !== "")
            writer.tag(1, runtime_1.WireType.LengthDelimited).string(message.eventId);
        /* string SenderId = 2 [json_name = "SenderId"]; */
        if (message.senderId !== "")
            writer.tag(2, runtime_1.WireType.LengthDelimited).string(message.senderId);
        /* proto.EventType Type = 3 [json_name = "Type"]; */
        if (message.type !== 0)
            writer.tag(3, runtime_1.WireType.Varint).int32(message.type);
        /* string Method = 4 [json_name = "Method"]; */
        if (message.method !== "")
            writer.tag(4, runtime_1.WireType.LengthDelimited).string(message.method);
        /* string Url = 5 [json_name = "Url"]; */
        if (message.url !== "")
            writer.tag(5, runtime_1.WireType.LengthDelimited).string(message.url);
        /* bytes Body = 6 [json_name = "Body"]; */
        if (message.body.length)
            writer.tag(6, runtime_1.WireType.LengthDelimited).bytes(message.body);
        /* proto.BodyType BodyType = 7 [json_name = "BodyType"]; */
        if (message.bodyType !== 0)
            writer.tag(7, runtime_1.WireType.Varint).int32(message.bodyType);
        /* string ContentType = 8 [json_name = "ContentType"]; */
        if (message.contentType !== "")
            writer.tag(8, runtime_1.WireType.LengthDelimited).string(message.contentType);
        /* repeated string Headers = 9 [json_name = "Headers"]; */
        for (let i = 0; i < message.headers.length; i++)
            writer.tag(9, runtime_1.WireType.LengthDelimited).string(message.headers[i]);
        /* string source = 10; */
        if (message.source !== "")
            writer.tag(10, runtime_1.WireType.LengthDelimited).string(message.source);
        /* int32 ttl = 11; */
        if (message.ttl !== 0)
            writer.tag(11, runtime_1.WireType.Varint).int32(message.ttl);
        /* int64 time = 12; */
        if (message.time !== 0n)
            writer.tag(12, runtime_1.WireType.Varint).int64(message.time);
        /* string Subject = 13 [json_name = "Subject"]; */
        if (message.subject !== "")
            writer.tag(13, runtime_1.WireType.LengthDelimited).string(message.subject);
        /* string RequestId = 14 [json_name = "RequestId"]; */
        if (message.requestId !== "")
            writer.tag(14, runtime_1.WireType.LengthDelimited).string(message.requestId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? runtime_2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto.Event
 */
exports.Event = new Event$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Response$Type extends runtime_5.MessageType {
    constructor() {
        super("proto.Response", [
            { no: 1, name: "EventId", kind: "scalar", jsonName: "EventId", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "Body", kind: "scalar", jsonName: "Body", T: 12 /*ScalarType.BYTES*/ },
            { no: 3, name: "BodyType", kind: "enum", jsonName: "BodyType", T: () => ["proto.BodyType", BodyType] },
            { no: 4, name: "ContentType", kind: "scalar", jsonName: "ContentType", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "Headers", kind: "scalar", jsonName: "Headers", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "Status", kind: "scalar", jsonName: "Status", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "UsedTime", kind: "scalar", jsonName: "UsedTime", T: 13 /*ScalarType.UINT32*/ },
            { no: 8, name: "time", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 9, name: "Subject", kind: "scalar", jsonName: "Subject", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "RequestId", kind: "scalar", jsonName: "RequestId", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = { eventId: "", body: new Uint8Array(0), bodyType: 0, contentType: "", headers: [], status: 0, usedTime: 0, time: 0n, subject: "", requestId: "" };
        globalThis.Object.defineProperty(message, runtime_4.MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            (0, runtime_3.reflectionMergePartial)(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string EventId = 1 [json_name = "EventId"];*/ 1:
                    message.eventId = reader.string();
                    break;
                case /* bytes Body = 2 [json_name = "Body"];*/ 2:
                    message.body = reader.bytes();
                    break;
                case /* proto.BodyType BodyType = 3 [json_name = "BodyType"];*/ 3:
                    message.bodyType = reader.int32();
                    break;
                case /* string ContentType = 4 [json_name = "ContentType"];*/ 4:
                    message.contentType = reader.string();
                    break;
                case /* repeated string Headers = 5 [json_name = "Headers"];*/ 5:
                    message.headers.push(reader.string());
                    break;
                case /* int32 Status = 6 [json_name = "Status"];*/ 6:
                    message.status = reader.int32();
                    break;
                case /* uint32 UsedTime = 7 [json_name = "UsedTime"];*/ 7:
                    message.usedTime = reader.uint32();
                    break;
                case /* int64 time */ 8:
                    message.time = reader.int64().toBigInt();
                    break;
                case /* string Subject = 9 [json_name = "Subject"];*/ 9:
                    message.subject = reader.string();
                    break;
                case /* string RequestId = 10 [json_name = "RequestId"];*/ 10:
                    message.requestId = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? runtime_2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string EventId = 1 [json_name = "EventId"]; */
        if (message.eventId !== "")
            writer.tag(1, runtime_1.WireType.LengthDelimited).string(message.eventId);
        /* bytes Body = 2 [json_name = "Body"]; */
        if (message.body.length)
            writer.tag(2, runtime_1.WireType.LengthDelimited).bytes(message.body);
        /* proto.BodyType BodyType = 3 [json_name = "BodyType"]; */
        if (message.bodyType !== 0)
            writer.tag(3, runtime_1.WireType.Varint).int32(message.bodyType);
        /* string ContentType = 4 [json_name = "ContentType"]; */
        if (message.contentType !== "")
            writer.tag(4, runtime_1.WireType.LengthDelimited).string(message.contentType);
        /* repeated string Headers = 5 [json_name = "Headers"]; */
        for (let i = 0; i < message.headers.length; i++)
            writer.tag(5, runtime_1.WireType.LengthDelimited).string(message.headers[i]);
        /* int32 Status = 6 [json_name = "Status"]; */
        if (message.status !== 0)
            writer.tag(6, runtime_1.WireType.Varint).int32(message.status);
        /* uint32 UsedTime = 7 [json_name = "UsedTime"]; */
        if (message.usedTime !== 0)
            writer.tag(7, runtime_1.WireType.Varint).uint32(message.usedTime);
        /* int64 time = 8; */
        if (message.time !== 0n)
            writer.tag(8, runtime_1.WireType.Varint).int64(message.time);
        /* string Subject = 9 [json_name = "Subject"]; */
        if (message.subject !== "")
            writer.tag(9, runtime_1.WireType.LengthDelimited).string(message.subject);
        /* string RequestId = 10 [json_name = "RequestId"]; */
        if (message.requestId !== "")
            writer.tag(10, runtime_1.WireType.LengthDelimited).string(message.requestId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? runtime_2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto.Response
 */
exports.Response = new Response$Type();
