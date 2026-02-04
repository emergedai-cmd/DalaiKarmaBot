"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTwitchRuntime = setTwitchRuntime;
exports.getTwitchRuntime = getTwitchRuntime;
var runtime = null;
function setTwitchRuntime(next) {
    runtime = next;
}
function getTwitchRuntime() {
    if (!runtime) {
        throw new Error("Twitch runtime not initialized");
    }
    return runtime;
}
