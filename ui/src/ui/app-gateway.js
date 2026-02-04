"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectGateway = connectGateway;
exports.handleGatewayEvent = handleGatewayEvent;
exports.applySnapshot = applySnapshot;
var app_chat_1 = require("./app-chat");
var app_settings_1 = require("./app-settings");
var app_tool_stream_1 = require("./app-tool-stream");
var agents_1 = require("./controllers/agents");
var assistant_identity_1 = require("./controllers/assistant-identity");
var chat_1 = require("./controllers/chat");
var chat_2 = require("./controllers/chat");
var devices_1 = require("./controllers/devices");
var exec_approval_1 = require("./controllers/exec-approval");
var nodes_1 = require("./controllers/nodes");
var sessions_1 = require("./controllers/sessions");
var gateway_1 = require("./gateway");
function normalizeSessionKeyForDefaults(value, defaults) {
    var _a, _b, _c;
    var raw = (value !== null && value !== void 0 ? value : "").trim();
    var mainSessionKey = (_a = defaults.mainSessionKey) === null || _a === void 0 ? void 0 : _a.trim();
    if (!mainSessionKey) {
        return raw;
    }
    if (!raw) {
        return mainSessionKey;
    }
    var mainKey = ((_b = defaults.mainKey) === null || _b === void 0 ? void 0 : _b.trim()) || "main";
    var defaultAgentId = (_c = defaults.defaultAgentId) === null || _c === void 0 ? void 0 : _c.trim();
    var isAlias = raw === "main" ||
        raw === mainKey ||
        (defaultAgentId &&
            (raw === "agent:".concat(defaultAgentId, ":main") || raw === "agent:".concat(defaultAgentId, ":").concat(mainKey)));
    return isAlias ? mainSessionKey : raw;
}
function applySessionDefaults(host, defaults) {
    if (!(defaults === null || defaults === void 0 ? void 0 : defaults.mainSessionKey)) {
        return;
    }
    var resolvedSessionKey = normalizeSessionKeyForDefaults(host.sessionKey, defaults);
    var resolvedSettingsSessionKey = normalizeSessionKeyForDefaults(host.settings.sessionKey, defaults);
    var resolvedLastActiveSessionKey = normalizeSessionKeyForDefaults(host.settings.lastActiveSessionKey, defaults);
    var nextSessionKey = resolvedSessionKey || resolvedSettingsSessionKey || host.sessionKey;
    var nextSettings = __assign(__assign({}, host.settings), { sessionKey: resolvedSettingsSessionKey || nextSessionKey, lastActiveSessionKey: resolvedLastActiveSessionKey || nextSessionKey });
    var shouldUpdateSettings = nextSettings.sessionKey !== host.settings.sessionKey ||
        nextSettings.lastActiveSessionKey !== host.settings.lastActiveSessionKey;
    if (nextSessionKey !== host.sessionKey) {
        host.sessionKey = nextSessionKey;
    }
    if (shouldUpdateSettings) {
        (0, app_settings_1.applySettings)(host, nextSettings);
    }
}
function connectGateway(host) {
    var _a;
    host.lastError = null;
    host.hello = null;
    host.connected = false;
    host.execApprovalQueue = [];
    host.execApprovalError = null;
    (_a = host.client) === null || _a === void 0 ? void 0 : _a.stop();
    host.client = new gateway_1.GatewayBrowserClient({
        url: host.settings.gatewayUrl,
        token: host.settings.token.trim() ? host.settings.token : undefined,
        password: host.password.trim() ? host.password : undefined,
        clientName: "openclaw-control-ui",
        mode: "webchat",
        onHello: function (hello) {
            host.connected = true;
            host.lastError = null;
            host.hello = hello;
            applySnapshot(host, hello);
            // Reset orphaned chat run state from before disconnect.
            // Any in-flight run's final event was lost during the disconnect window.
            host.chatRunId = null;
            host.chatStream = null;
            host.chatStreamStartedAt = null;
            (0, app_tool_stream_1.resetToolStream)(host);
            void (0, assistant_identity_1.loadAssistantIdentity)(host);
            void (0, agents_1.loadAgents)(host);
            void (0, nodes_1.loadNodes)(host, { quiet: true });
            void (0, devices_1.loadDevices)(host, { quiet: true });
            void (0, app_settings_1.refreshActiveTab)(host);
        },
        onClose: function (_a) {
            var code = _a.code, reason = _a.reason;
            host.connected = false;
            // Code 1012 = Service Restart (expected during config saves, don't show as error)
            if (code !== 1012) {
                host.lastError = "disconnected (".concat(code, "): ").concat(reason || "no reason");
            }
        },
        onEvent: function (evt) { return handleGatewayEvent(host, evt); },
        onGap: function (_a) {
            var expected = _a.expected, received = _a.received;
            host.lastError = "event gap detected (expected seq ".concat(expected, ", got ").concat(received, "); refresh recommended");
        },
    });
    host.client.start();
}
function handleGatewayEvent(host, evt) {
    try {
        handleGatewayEventUnsafe(host, evt);
    }
    catch (err) {
        console.error("[gateway] handleGatewayEvent error:", evt.event, err);
    }
}
function handleGatewayEventUnsafe(host, evt) {
    host.eventLogBuffer = __spreadArray([
        { ts: Date.now(), event: evt.event, payload: evt.payload }
    ], host.eventLogBuffer, true).slice(0, 250);
    if (host.tab === "debug") {
        host.eventLog = host.eventLogBuffer;
    }
    if (evt.event === "agent") {
        if (host.onboarding) {
            return;
        }
        (0, app_tool_stream_1.handleAgentEvent)(host, evt.payload);
        return;
    }
    if (evt.event === "chat") {
        var payload = evt.payload;
        if (payload === null || payload === void 0 ? void 0 : payload.sessionKey) {
            (0, app_settings_1.setLastActiveSessionKey)(host, payload.sessionKey);
        }
        var state = (0, chat_2.handleChatEvent)(host, payload);
        if (state === "final" || state === "error" || state === "aborted") {
            (0, app_tool_stream_1.resetToolStream)(host);
            void (0, app_chat_1.flushChatQueueForEvent)(host);
            var runId = payload === null || payload === void 0 ? void 0 : payload.runId;
            if (runId && host.refreshSessionsAfterChat.has(runId)) {
                host.refreshSessionsAfterChat.delete(runId);
                if (state === "final") {
                    void (0, sessions_1.loadSessions)(host, {
                        activeMinutes: app_chat_1.CHAT_SESSIONS_ACTIVE_MINUTES,
                    });
                }
            }
        }
        if (state === "final") {
            void (0, chat_1.loadChatHistory)(host);
        }
        return;
    }
    if (evt.event === "presence") {
        var payload = evt.payload;
        if ((payload === null || payload === void 0 ? void 0 : payload.presence) && Array.isArray(payload.presence)) {
            host.presenceEntries = payload.presence;
            host.presenceError = null;
            host.presenceStatus = null;
        }
        return;
    }
    if (evt.event === "cron" && host.tab === "cron") {
        void (0, app_settings_1.loadCron)(host);
    }
    if (evt.event === "device.pair.requested" || evt.event === "device.pair.resolved") {
        void (0, devices_1.loadDevices)(host, { quiet: true });
    }
    if (evt.event === "exec.approval.requested") {
        var entry_1 = (0, exec_approval_1.parseExecApprovalRequested)(evt.payload);
        if (entry_1) {
            host.execApprovalQueue = (0, exec_approval_1.addExecApproval)(host.execApprovalQueue, entry_1);
            host.execApprovalError = null;
            var delay = Math.max(0, entry_1.expiresAtMs - Date.now() + 500);
            window.setTimeout(function () {
                host.execApprovalQueue = (0, exec_approval_1.removeExecApproval)(host.execApprovalQueue, entry_1.id);
            }, delay);
        }
        return;
    }
    if (evt.event === "exec.approval.resolved") {
        var resolved = (0, exec_approval_1.parseExecApprovalResolved)(evt.payload);
        if (resolved) {
            host.execApprovalQueue = (0, exec_approval_1.removeExecApproval)(host.execApprovalQueue, resolved.id);
        }
    }
}
function applySnapshot(host, hello) {
    var snapshot = hello.snapshot;
    if ((snapshot === null || snapshot === void 0 ? void 0 : snapshot.presence) && Array.isArray(snapshot.presence)) {
        host.presenceEntries = snapshot.presence;
    }
    if (snapshot === null || snapshot === void 0 ? void 0 : snapshot.health) {
        host.debugHealth = snapshot.health;
    }
    if (snapshot === null || snapshot === void 0 ? void 0 : snapshot.sessionDefaults) {
        applySessionDefaults(host, snapshot.sessionDefaults);
    }
}
