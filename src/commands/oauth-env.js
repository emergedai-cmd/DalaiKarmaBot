"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRemoteEnvironment = isRemoteEnvironment;
var wsl_js_1 = require("../infra/wsl.js");
function isRemoteEnvironment() {
    if (process.env.SSH_CLIENT || process.env.SSH_TTY || process.env.SSH_CONNECTION) {
        return true;
    }
    if (process.env.REMOTE_CONTAINERS || process.env.CODESPACES) {
        return true;
    }
    if (process.platform === "linux" &&
        !process.env.DISPLAY &&
        !process.env.WAYLAND_DISPLAY &&
        !(0, wsl_js_1.isWSLEnv)()) {
        return true;
    }
    return false;
}
