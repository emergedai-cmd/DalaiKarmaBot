"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setZaloRuntime = setZaloRuntime;
exports.getZaloRuntime = getZaloRuntime;
var runtime = null;
function setZaloRuntime(next) {
    runtime = next;
}
function getZaloRuntime() {
    if (!runtime) {
        throw new Error("Zalo runtime not initialized");
    }
    return runtime;
}
