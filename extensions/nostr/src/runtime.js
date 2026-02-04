"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNostrRuntime = setNostrRuntime;
exports.getNostrRuntime = getNostrRuntime;
var runtime = null;
function setNostrRuntime(next) {
    runtime = next;
}
function getNostrRuntime() {
    if (!runtime) {
        throw new Error("Nostr runtime not initialized");
    }
    return runtime;
}
