"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNodesPolling = startNodesPolling;
exports.stopNodesPolling = stopNodesPolling;
exports.startLogsPolling = startLogsPolling;
exports.stopLogsPolling = stopLogsPolling;
exports.startDebugPolling = startDebugPolling;
exports.stopDebugPolling = stopDebugPolling;
var debug_1 = require("./controllers/debug");
var logs_1 = require("./controllers/logs");
var nodes_1 = require("./controllers/nodes");
function startNodesPolling(host) {
    if (host.nodesPollInterval != null) {
        return;
    }
    host.nodesPollInterval = window.setInterval(function () { return void (0, nodes_1.loadNodes)(host, { quiet: true }); }, 5000);
}
function stopNodesPolling(host) {
    if (host.nodesPollInterval == null) {
        return;
    }
    clearInterval(host.nodesPollInterval);
    host.nodesPollInterval = null;
}
function startLogsPolling(host) {
    if (host.logsPollInterval != null) {
        return;
    }
    host.logsPollInterval = window.setInterval(function () {
        if (host.tab !== "logs") {
            return;
        }
        void (0, logs_1.loadLogs)(host, { quiet: true });
    }, 2000);
}
function stopLogsPolling(host) {
    if (host.logsPollInterval == null) {
        return;
    }
    clearInterval(host.logsPollInterval);
    host.logsPollInterval = null;
}
function startDebugPolling(host) {
    if (host.debugPollInterval != null) {
        return;
    }
    host.debugPollInterval = window.setInterval(function () {
        if (host.tab !== "debug") {
            return;
        }
        void (0, debug_1.loadDebug)(host);
    }, 3000);
}
function stopDebugPolling(host) {
    if (host.debugPollInterval == null) {
        return;
    }
    clearInterval(host.debugPollInterval);
    host.debugPollInterval = null;
}
