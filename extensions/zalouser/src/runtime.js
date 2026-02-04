"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setZalouserRuntime = setZalouserRuntime;
exports.getZalouserRuntime = getZalouserRuntime;
var runtime = null;
function setZalouserRuntime(next) {
    runtime = next;
}
function getZalouserRuntime() {
    if (!runtime) {
        throw new Error("Zalouser runtime not initialized");
    }
    return runtime;
}
