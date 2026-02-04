"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTlonRuntime = setTlonRuntime;
exports.getTlonRuntime = getTlonRuntime;
var runtime = null;
function setTlonRuntime(next) {
    runtime = next;
}
function getTlonRuntime() {
    if (!runtime) {
        throw new Error("Tlon runtime not initialized");
    }
    return runtime;
}
