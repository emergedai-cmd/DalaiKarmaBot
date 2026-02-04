"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMattermostRuntime = setMattermostRuntime;
exports.getMattermostRuntime = getMattermostRuntime;
var runtime = null;
function setMattermostRuntime(next) {
    runtime = next;
}
function getMattermostRuntime() {
    if (!runtime) {
        throw new Error("Mattermost runtime not initialized");
    }
    return runtime;
}
