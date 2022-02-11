import { EventCtx } from "./event_ctx";
import { localInit } from "./local_init";
import { prodInit } from "./prod_init";
import { testInit } from "./test_init";

export { localInit } from "./local_init";
export { prodInit } from "./prod_init";
export { testInit } from "./test_init";

export async function init(handler: (e: EventCtx) => Promise<any>) {
    const mode = process.env["MODE"];
    if (mode == "prod") {
        await prodInit(handler);
    } else if (mode == "test") {
        await testInit(handler);
    } else {
        await localInit(handler);
    }
}