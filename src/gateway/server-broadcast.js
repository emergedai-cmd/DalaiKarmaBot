"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGatewayBroadcaster = createGatewayBroadcaster;
var server_constants_js_1 = require("./server-constants.js");
var ws_log_js_1 = require("./ws-log.js");
var ADMIN_SCOPE = "operator.admin";
var APPROVALS_SCOPE = "operator.approvals";
var PAIRING_SCOPE = "operator.pairing";
var EVENT_SCOPE_GUARDS = {
    "exec.approval.requested": [APPROVALS_SCOPE],
    "exec.approval.resolved": [APPROVALS_SCOPE],
    "device.pair.requested": [PAIRING_SCOPE],
    "device.pair.resolved": [PAIRING_SCOPE],
    "node.pair.requested": [PAIRING_SCOPE],
    "node.pair.resolved": [PAIRING_SCOPE],
};
function hasEventScope(client, event) {
    var _a;
    var required = EVENT_SCOPE_GUARDS[event];
    if (!required) {
        return true;
    }
    var role = (_a = client.connect.role) !== null && _a !== void 0 ? _a : "operator";
    if (role !== "operator") {
        return false;
    }
    var scopes = Array.isArray(client.connect.scopes) ? client.connect.scopes : [];
    if (scopes.includes(ADMIN_SCOPE)) {
        return true;
    }
    return required.some(function (scope) { return scopes.includes(scope); });
}
function createGatewayBroadcaster(params) {
    var seq = 0;
    var broadcast = function (event, payload, opts) {
        var _a, _b;
        var eventSeq = ++seq;
        var frame = JSON.stringify({
            type: "event",
            event: event,
            payload: payload,
            seq: eventSeq,
            stateVersion: opts === null || opts === void 0 ? void 0 : opts.stateVersion,
        });
        var logMeta = {
            event: event,
            seq: eventSeq,
            clients: params.clients.size,
            dropIfSlow: opts === null || opts === void 0 ? void 0 : opts.dropIfSlow,
            presenceVersion: (_a = opts === null || opts === void 0 ? void 0 : opts.stateVersion) === null || _a === void 0 ? void 0 : _a.presence,
            healthVersion: (_b = opts === null || opts === void 0 ? void 0 : opts.stateVersion) === null || _b === void 0 ? void 0 : _b.health,
        };
        if (event === "agent") {
            Object.assign(logMeta, (0, ws_log_js_1.summarizeAgentEventForWsLog)(payload));
        }
        (0, ws_log_js_1.logWs)("out", "event", logMeta);
        for (var _i = 0, _c = params.clients; _i < _c.length; _i++) {
            var c = _c[_i];
            if (!hasEventScope(c, event)) {
                continue;
            }
            var slow = c.socket.bufferedAmount > server_constants_js_1.MAX_BUFFERED_BYTES;
            if (slow && (opts === null || opts === void 0 ? void 0 : opts.dropIfSlow)) {
                continue;
            }
            if (slow) {
                try {
                    c.socket.close(1008, "slow consumer");
                }
                catch (_d) {
                    /* ignore */
                }
                continue;
            }
            try {
                c.socket.send(frame);
            }
            catch (_e) {
                /* ignore */
            }
        }
    };
    return { broadcast: broadcast };
}
