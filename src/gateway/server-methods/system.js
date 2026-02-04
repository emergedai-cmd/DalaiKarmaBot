"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemHandlers = void 0;
var sessions_js_1 = require("../../config/sessions.js");
var heartbeat_events_js_1 = require("../../infra/heartbeat-events.js");
var heartbeat_runner_js_1 = require("../../infra/heartbeat-runner.js");
var system_events_js_1 = require("../../infra/system-events.js");
var system_presence_js_1 = require("../../infra/system-presence.js");
var index_js_1 = require("../protocol/index.js");
exports.systemHandlers = {
    "last-heartbeat": function (_a) {
        var respond = _a.respond;
        respond(true, (0, heartbeat_events_js_1.getLastHeartbeatEvent)(), undefined);
    },
    "set-heartbeats": function (_a) {
        var params = _a.params, respond = _a.respond;
        var enabled = params.enabled;
        if (typeof enabled !== "boolean") {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid set-heartbeats params: enabled (boolean) required"));
            return;
        }
        (0, heartbeat_runner_js_1.setHeartbeatsEnabled)(enabled);
        respond(true, { ok: true, enabled: enabled }, undefined);
    },
    "system-presence": function (_a) {
        var respond = _a.respond;
        var presence = (0, system_presence_js_1.listSystemPresence)();
        respond(true, presence, undefined);
    },
    "system-event": function (_a) {
        var _b, _c, _d, _e, _f;
        var params = _a.params, respond = _a.respond, context = _a.context;
        var text = typeof params.text === "string" ? params.text.trim() : "";
        if (!text) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "text required"));
            return;
        }
        var sessionKey = (0, sessions_js_1.resolveMainSessionKeyFromConfig)();
        var deviceId = typeof params.deviceId === "string" ? params.deviceId : undefined;
        var instanceId = typeof params.instanceId === "string" ? params.instanceId : undefined;
        var host = typeof params.host === "string" ? params.host : undefined;
        var ip = typeof params.ip === "string" ? params.ip : undefined;
        var mode = typeof params.mode === "string" ? params.mode : undefined;
        var version = typeof params.version === "string" ? params.version : undefined;
        var platform = typeof params.platform === "string" ? params.platform : undefined;
        var deviceFamily = typeof params.deviceFamily === "string" ? params.deviceFamily : undefined;
        var modelIdentifier = typeof params.modelIdentifier === "string" ? params.modelIdentifier : undefined;
        var lastInputSeconds = typeof params.lastInputSeconds === "number" && Number.isFinite(params.lastInputSeconds)
            ? params.lastInputSeconds
            : undefined;
        var reason = typeof params.reason === "string" ? params.reason : undefined;
        var roles = Array.isArray(params.roles) && params.roles.every(function (t) { return typeof t === "string"; })
            ? params.roles
            : undefined;
        var scopes = Array.isArray(params.scopes) && params.scopes.every(function (t) { return typeof t === "string"; })
            ? params.scopes
            : undefined;
        var tags = Array.isArray(params.tags) && params.tags.every(function (t) { return typeof t === "string"; })
            ? params.tags
            : undefined;
        var presenceUpdate = (0, system_presence_js_1.updateSystemPresence)({
            text: text,
            deviceId: deviceId,
            instanceId: instanceId,
            host: host,
            ip: ip,
            mode: mode,
            version: version,
            platform: platform,
            deviceFamily: deviceFamily,
            modelIdentifier: modelIdentifier,
            lastInputSeconds: lastInputSeconds,
            reason: reason,
            roles: roles,
            scopes: scopes,
            tags: tags,
        });
        var isNodePresenceLine = text.startsWith("Node:");
        if (isNodePresenceLine) {
            var next = presenceUpdate.next;
            var changed = new Set(presenceUpdate.changedKeys);
            var reasonValue = (_b = next.reason) !== null && _b !== void 0 ? _b : reason;
            var normalizedReason = (reasonValue !== null && reasonValue !== void 0 ? reasonValue : "").toLowerCase();
            var ignoreReason = normalizedReason.startsWith("periodic") || normalizedReason === "heartbeat";
            var hostChanged = changed.has("host");
            var ipChanged = changed.has("ip");
            var versionChanged = changed.has("version");
            var modeChanged = changed.has("mode");
            var reasonChanged = changed.has("reason") && !ignoreReason;
            var hasChanges = hostChanged || ipChanged || versionChanged || modeChanged || reasonChanged;
            if (hasChanges) {
                var contextChanged = (0, system_events_js_1.isSystemEventContextChanged)(sessionKey, presenceUpdate.key);
                var parts = [];
                if (contextChanged || hostChanged || ipChanged) {
                    var hostLabel = ((_c = next.host) === null || _c === void 0 ? void 0 : _c.trim()) || "Unknown";
                    var ipLabel = (_d = next.ip) === null || _d === void 0 ? void 0 : _d.trim();
                    parts.push("Node: ".concat(hostLabel).concat(ipLabel ? " (".concat(ipLabel, ")") : ""));
                }
                if (versionChanged) {
                    parts.push("app ".concat(((_e = next.version) === null || _e === void 0 ? void 0 : _e.trim()) || "unknown"));
                }
                if (modeChanged) {
                    parts.push("mode ".concat(((_f = next.mode) === null || _f === void 0 ? void 0 : _f.trim()) || "unknown"));
                }
                if (reasonChanged) {
                    parts.push("reason ".concat((reasonValue === null || reasonValue === void 0 ? void 0 : reasonValue.trim()) || "event"));
                }
                var deltaText = parts.join(" · ");
                if (deltaText) {
                    (0, system_events_js_1.enqueueSystemEvent)(deltaText, {
                        sessionKey: sessionKey,
                        contextKey: presenceUpdate.key,
                    });
                }
            }
        }
        else {
            (0, system_events_js_1.enqueueSystemEvent)(text, { sessionKey: sessionKey });
        }
        var nextPresenceVersion = context.incrementPresenceVersion();
        context.broadcast("presence", { presence: (0, system_presence_js_1.listSystemPresence)() }, {
            dropIfSlow: true,
            stateVersion: {
                presence: nextPresenceVersion,
                health: context.getHealthVersion(),
            },
        });
        respond(true, { ok: true }, undefined);
    },
};
