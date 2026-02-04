"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMSTeamsRuntime = setMSTeamsRuntime;
exports.getMSTeamsRuntime = getMSTeamsRuntime;
var runtime = null;
function setMSTeamsRuntime(next) {
    runtime = next;
}
function getMSTeamsRuntime() {
    if (!runtime) {
        throw new Error("MSTeams runtime not initialized");
    }
    return runtime;
}
