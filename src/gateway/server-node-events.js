"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNodeEvent = void 0;
var node_crypto_1 = require("node:crypto");
var index_js_1 = require("../channels/plugins/index.js");
var agent_js_1 = require("../commands/agent.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var heartbeat_wake_js_1 = require("../infra/heartbeat-wake.js");
var system_events_js_1 = require("../infra/system-events.js");
var session_key_js_1 = require("../routing/session-key.js");
var runtime_js_1 = require("../runtime.js");
var session_utils_js_1 = require("./session-utils.js");
var ws_log_js_1 = require("./ws-log.js");
var handleNodeEvent = function (ctx, nodeId, evt) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, payload, obj, text, sessionKeyRaw, cfg, rawMainKey, sessionKey, _b, storePath, entry_1, canonicalKey_1, now_1, sessionId_1, link, message, channelRaw, channel, to, deliver, sessionKeyRaw, sessionKey, _c, storePath, entry_2, canonicalKey_2, now_2, sessionId_2, payload, obj, sessionKey, payload, obj, sessionKey, payload, obj, sessionKey, runId, command, exitCode, timedOut, output, reason, text, exitLabel;
    var _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = evt.event;
                switch (_a) {
                    case "voice.transcript": return [3 /*break*/, 1];
                    case "agent.request": return [3 /*break*/, 4];
                    case "chat.subscribe": return [3 /*break*/, 7];
                    case "chat.unsubscribe": return [3 /*break*/, 8];
                    case "exec.started": return [3 /*break*/, 9];
                    case "exec.finished": return [3 /*break*/, 9];
                    case "exec.denied": return [3 /*break*/, 9];
                }
                return [3 /*break*/, 10];
            case 1:
                if (!evt.payloadJSON) {
                    return [2 /*return*/];
                }
                payload = void 0;
                try {
                    payload = JSON.parse(evt.payloadJSON);
                }
                catch (_m) {
                    return [2 /*return*/];
                }
                obj = typeof payload === "object" && payload !== null ? payload : {};
                text = typeof obj.text === "string" ? obj.text.trim() : "";
                if (!text) {
                    return [2 /*return*/];
                }
                if (text.length > 20000) {
                    return [2 /*return*/];
                }
                sessionKeyRaw = typeof obj.sessionKey === "string" ? obj.sessionKey.trim() : "";
                cfg = (0, config_js_1.loadConfig)();
                rawMainKey = (0, session_key_js_1.normalizeMainKey)((_d = cfg.session) === null || _d === void 0 ? void 0 : _d.mainKey);
                sessionKey = sessionKeyRaw.length > 0 ? sessionKeyRaw : rawMainKey;
                _b = (0, session_utils_js_1.loadSessionEntry)(sessionKey), storePath = _b.storePath, entry_1 = _b.entry, canonicalKey_1 = _b.canonicalKey;
                now_1 = Date.now();
                sessionId_1 = (_e = entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.sessionId) !== null && _e !== void 0 ? _e : (0, node_crypto_1.randomUUID)();
                if (!storePath) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                        store[canonicalKey_1] = {
                            sessionId: sessionId_1,
                            updatedAt: now_1,
                            thinkingLevel: entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.thinkingLevel,
                            verboseLevel: entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.verboseLevel,
                            reasoningLevel: entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.reasoningLevel,
                            systemSent: entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.systemSent,
                            sendPolicy: entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.sendPolicy,
                            lastChannel: entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.lastChannel,
                            lastTo: entry_1 === null || entry_1 === void 0 ? void 0 : entry_1.lastTo,
                        };
                    })];
            case 2:
                _l.sent();
                _l.label = 3;
            case 3:
                // Ensure chat UI clients refresh when this run completes (even though it wasn't started via chat.send).
                // This maps agent bus events (keyed by sessionId) to chat events (keyed by clientRunId).
                ctx.addChatRun(sessionId_1, {
                    sessionKey: sessionKey,
                    clientRunId: "voice-".concat((0, node_crypto_1.randomUUID)()),
                });
                void (0, agent_js_1.agentCommand)({
                    message: text,
                    sessionId: sessionId_1,
                    sessionKey: sessionKey,
                    thinking: "low",
                    deliver: false,
                    messageChannel: "node",
                }, runtime_js_1.defaultRuntime, ctx.deps).catch(function (err) {
                    ctx.logGateway.warn("agent failed node=".concat(nodeId, ": ").concat((0, ws_log_js_1.formatForLog)(err)));
                });
                return [2 /*return*/];
            case 4:
                if (!evt.payloadJSON) {
                    return [2 /*return*/];
                }
                link = null;
                try {
                    link = JSON.parse(evt.payloadJSON);
                }
                catch (_o) {
                    return [2 /*return*/];
                }
                message = ((_f = link === null || link === void 0 ? void 0 : link.message) !== null && _f !== void 0 ? _f : "").trim();
                if (!message) {
                    return [2 /*return*/];
                }
                if (message.length > 20000) {
                    return [2 /*return*/];
                }
                channelRaw = typeof (link === null || link === void 0 ? void 0 : link.channel) === "string" ? link.channel.trim() : "";
                channel = (_g = (0, index_js_1.normalizeChannelId)(channelRaw)) !== null && _g !== void 0 ? _g : undefined;
                to = typeof (link === null || link === void 0 ? void 0 : link.to) === "string" && link.to.trim() ? link.to.trim() : undefined;
                deliver = Boolean(link === null || link === void 0 ? void 0 : link.deliver) && Boolean(channel);
                sessionKeyRaw = ((_h = link === null || link === void 0 ? void 0 : link.sessionKey) !== null && _h !== void 0 ? _h : "").trim();
                sessionKey = sessionKeyRaw.length > 0 ? sessionKeyRaw : "node-".concat(nodeId);
                _c = (0, session_utils_js_1.loadSessionEntry)(sessionKey), storePath = _c.storePath, entry_2 = _c.entry, canonicalKey_2 = _c.canonicalKey;
                now_2 = Date.now();
                sessionId_2 = (_j = entry_2 === null || entry_2 === void 0 ? void 0 : entry_2.sessionId) !== null && _j !== void 0 ? _j : (0, node_crypto_1.randomUUID)();
                if (!storePath) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                        store[canonicalKey_2] = {
                            sessionId: sessionId_2,
                            updatedAt: now_2,
                            thinkingLevel: entry_2 === null || entry_2 === void 0 ? void 0 : entry_2.thinkingLevel,
                            verboseLevel: entry_2 === null || entry_2 === void 0 ? void 0 : entry_2.verboseLevel,
                            reasoningLevel: entry_2 === null || entry_2 === void 0 ? void 0 : entry_2.reasoningLevel,
                            systemSent: entry_2 === null || entry_2 === void 0 ? void 0 : entry_2.systemSent,
                            sendPolicy: entry_2 === null || entry_2 === void 0 ? void 0 : entry_2.sendPolicy,
                            lastChannel: entry_2 === null || entry_2 === void 0 ? void 0 : entry_2.lastChannel,
                            lastTo: entry_2 === null || entry_2 === void 0 ? void 0 : entry_2.lastTo,
                        };
                    })];
            case 5:
                _l.sent();
                _l.label = 6;
            case 6:
                void (0, agent_js_1.agentCommand)({
                    message: message,
                    sessionId: sessionId_2,
                    sessionKey: sessionKey,
                    thinking: (_k = link === null || link === void 0 ? void 0 : link.thinking) !== null && _k !== void 0 ? _k : undefined,
                    deliver: deliver,
                    to: to,
                    channel: channel,
                    timeout: typeof (link === null || link === void 0 ? void 0 : link.timeoutSeconds) === "number" ? link.timeoutSeconds.toString() : undefined,
                    messageChannel: "node",
                }, runtime_js_1.defaultRuntime, ctx.deps).catch(function (err) {
                    ctx.logGateway.warn("agent failed node=".concat(nodeId, ": ").concat((0, ws_log_js_1.formatForLog)(err)));
                });
                return [2 /*return*/];
            case 7:
                {
                    if (!evt.payloadJSON) {
                        return [2 /*return*/];
                    }
                    payload = void 0;
                    try {
                        payload = JSON.parse(evt.payloadJSON);
                    }
                    catch (_p) {
                        return [2 /*return*/];
                    }
                    obj = typeof payload === "object" && payload !== null ? payload : {};
                    sessionKey = typeof obj.sessionKey === "string" ? obj.sessionKey.trim() : "";
                    if (!sessionKey) {
                        return [2 /*return*/];
                    }
                    ctx.nodeSubscribe(nodeId, sessionKey);
                    return [2 /*return*/];
                }
                _l.label = 8;
            case 8:
                {
                    if (!evt.payloadJSON) {
                        return [2 /*return*/];
                    }
                    payload = void 0;
                    try {
                        payload = JSON.parse(evt.payloadJSON);
                    }
                    catch (_q) {
                        return [2 /*return*/];
                    }
                    obj = typeof payload === "object" && payload !== null ? payload : {};
                    sessionKey = typeof obj.sessionKey === "string" ? obj.sessionKey.trim() : "";
                    if (!sessionKey) {
                        return [2 /*return*/];
                    }
                    ctx.nodeUnsubscribe(nodeId, sessionKey);
                    return [2 /*return*/];
                }
                _l.label = 9;
            case 9:
                {
                    if (!evt.payloadJSON) {
                        return [2 /*return*/];
                    }
                    payload = void 0;
                    try {
                        payload = JSON.parse(evt.payloadJSON);
                    }
                    catch (_r) {
                        return [2 /*return*/];
                    }
                    obj = typeof payload === "object" && payload !== null ? payload : {};
                    sessionKey = typeof obj.sessionKey === "string" ? obj.sessionKey.trim() : "node-".concat(nodeId);
                    if (!sessionKey) {
                        return [2 /*return*/];
                    }
                    runId = typeof obj.runId === "string" ? obj.runId.trim() : "";
                    command = typeof obj.command === "string" ? obj.command.trim() : "";
                    exitCode = typeof obj.exitCode === "number" && Number.isFinite(obj.exitCode)
                        ? obj.exitCode
                        : undefined;
                    timedOut = obj.timedOut === true;
                    output = typeof obj.output === "string" ? obj.output.trim() : "";
                    reason = typeof obj.reason === "string" ? obj.reason.trim() : "";
                    text = "";
                    if (evt.event === "exec.started") {
                        text = "Exec started (node=".concat(nodeId).concat(runId ? " id=".concat(runId) : "", ")");
                        if (command) {
                            text += ": ".concat(command);
                        }
                    }
                    else if (evt.event === "exec.finished") {
                        exitLabel = timedOut ? "timeout" : "code ".concat(exitCode !== null && exitCode !== void 0 ? exitCode : "?");
                        text = "Exec finished (node=".concat(nodeId).concat(runId ? " id=".concat(runId) : "", ", ").concat(exitLabel, ")");
                        if (output) {
                            text += "\n".concat(output);
                        }
                    }
                    else {
                        text = "Exec denied (node=".concat(nodeId).concat(runId ? " id=".concat(runId) : "").concat(reason ? ", ".concat(reason) : "", ")");
                        if (command) {
                            text += ": ".concat(command);
                        }
                    }
                    (0, system_events_js_1.enqueueSystemEvent)(text, { sessionKey: sessionKey, contextKey: runId ? "exec:".concat(runId) : "exec" });
                    (0, heartbeat_wake_js_1.requestHeartbeatNow)({ reason: "exec-event" });
                    return [2 /*return*/];
                }
                _l.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.handleNodeEvent = handleNodeEvent;
