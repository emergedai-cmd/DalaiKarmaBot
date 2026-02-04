"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSignalRuntime = setSignalRuntime;
exports.getSignalRuntime = getSignalRuntime;
var runtime = null;
function setSignalRuntime(next) {
    runtime = next;
}
function getSignalRuntime() {
    if (!runtime) {
        throw new Error("Signal runtime not initialized");
    }
    return runtime;
}
