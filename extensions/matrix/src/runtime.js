"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMatrixRuntime = setMatrixRuntime;
exports.getMatrixRuntime = getMatrixRuntime;
var runtime = null;
function setMatrixRuntime(next) {
    runtime = next;
}
function getMatrixRuntime() {
    if (!runtime) {
        throw new Error("Matrix runtime not initialized");
    }
    return runtime;
}
