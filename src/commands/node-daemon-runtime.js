"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_DAEMON_RUNTIME_OPTIONS = exports.DEFAULT_NODE_DAEMON_RUNTIME = void 0;
exports.isNodeDaemonRuntime = isNodeDaemonRuntime;
var daemon_runtime_js_1 = require("./daemon-runtime.js");
exports.DEFAULT_NODE_DAEMON_RUNTIME = daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME;
exports.NODE_DAEMON_RUNTIME_OPTIONS = daemon_runtime_js_1.GATEWAY_DAEMON_RUNTIME_OPTIONS;
function isNodeDaemonRuntime(value) {
    return (0, daemon_runtime_js_1.isGatewayDaemonRuntime)(value);
}
