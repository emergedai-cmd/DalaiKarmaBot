"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBlueBubblesRuntime = setBlueBubblesRuntime;
exports.getBlueBubblesRuntime = getBlueBubblesRuntime;
var runtime = null;
function setBlueBubblesRuntime(next) {
    runtime = next;
}
function getBlueBubblesRuntime() {
    if (!runtime) {
        throw new Error("BlueBubbles runtime not initialized");
    }
    return runtime;
}
