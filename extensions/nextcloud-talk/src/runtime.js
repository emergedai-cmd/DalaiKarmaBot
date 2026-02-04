"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNextcloudTalkRuntime = setNextcloudTalkRuntime;
exports.getNextcloudTalkRuntime = getNextcloudTalkRuntime;
var runtime = null;
function setNextcloudTalkRuntime(next) {
    runtime = next;
}
function getNextcloudTalkRuntime() {
    if (!runtime) {
        throw new Error("Nextcloud Talk runtime not initialized");
    }
    return runtime;
}
