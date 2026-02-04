"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGoogleChatRuntime = setGoogleChatRuntime;
exports.getGoogleChatRuntime = getGoogleChatRuntime;
var runtime = null;
function setGoogleChatRuntime(next) {
    runtime = next;
}
function getGoogleChatRuntime() {
    if (!runtime) {
        throw new Error("Google Chat runtime not initialized");
    }
    return runtime;
}
