"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLineRuntime = setLineRuntime;
exports.getLineRuntime = getLineRuntime;
var runtime = null;
function setLineRuntime(r) {
    runtime = r;
}
function getLineRuntime() {
    if (!runtime) {
        throw new Error("LINE runtime not initialized - plugin not registered");
    }
    return runtime;
}
