export function buildHeaders(h: Map<string, string>): string[] {
    const out = [];
    for (let [k, v] of h.entries()) {
        out.push(k, v);
    }
    return out;
}
