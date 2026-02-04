"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMemoryVectorState = resolveMemoryVectorState;
exports.resolveMemoryFtsState = resolveMemoryFtsState;
exports.resolveMemoryCacheSummary = resolveMemoryCacheSummary;
exports.resolveMemoryCacheState = resolveMemoryCacheState;
function resolveMemoryVectorState(vector) {
    if (!vector.enabled) {
        return { tone: "muted", state: "disabled" };
    }
    if (vector.available === true) {
        return { tone: "ok", state: "ready" };
    }
    if (vector.available === false) {
        return { tone: "warn", state: "unavailable" };
    }
    return { tone: "muted", state: "unknown" };
}
function resolveMemoryFtsState(fts) {
    if (!fts.enabled) {
        return { tone: "muted", state: "disabled" };
    }
    return fts.available ? { tone: "ok", state: "ready" } : { tone: "warn", state: "unavailable" };
}
function resolveMemoryCacheSummary(cache) {
    if (!cache.enabled) {
        return { tone: "muted", text: "cache off" };
    }
    var suffix = typeof cache.entries === "number" ? " (".concat(cache.entries, ")") : "";
    return { tone: "ok", text: "cache on".concat(suffix) };
}
function resolveMemoryCacheState(cache) {
    return cache.enabled ? { tone: "ok", state: "enabled" } : { tone: "muted", state: "disabled" };
}
