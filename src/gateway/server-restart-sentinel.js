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
exports.scheduleRestartSentinelWake = scheduleRestartSentinelWake;
exports.shouldWakeFromRestartSentinel = shouldWakeFromRestartSentinel;
var sessions_send_helpers_js_1 = require("../agents/tools/sessions-send-helpers.js");
var index_js_1 = require("../channels/plugins/index.js");
var agent_js_1 = require("../commands/agent.js");
var sessions_js_1 = require("../config/sessions.js");
var targets_js_1 = require("../infra/outbound/targets.js");
var restart_sentinel_js_1 = require("../infra/restart-sentinel.js");
var system_events_js_1 = require("../infra/system-events.js");
var runtime_js_1 = require("../runtime.js");
var delivery_context_js_1 = require("../utils/delivery-context.js");
var session_utils_js_1 = require("./session-utils.js");
function scheduleRestartSentinelWake(params) {
    return __awaiter(this, void 0, void 0, function () {
        var sentinel, payload, sessionKey, message, summary, mainSessionKey, topicIndex, threadIndex, markerIndex, marker, baseSessionKey, threadIdRaw, sessionThreadId, _a, cfg, entry, parsedTarget, sentinelContext, sessionDeliveryContext, baseEntry, origin, channelRaw, channel, to, resolved, threadId, err_1;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, restart_sentinel_js_1.consumeRestartSentinel)()];
                case 1:
                    sentinel = _f.sent();
                    if (!sentinel) {
                        return [2 /*return*/];
                    }
                    payload = sentinel.payload;
                    sessionKey = (_b = payload.sessionKey) === null || _b === void 0 ? void 0 : _b.trim();
                    message = (0, restart_sentinel_js_1.formatRestartSentinelMessage)(payload);
                    summary = (0, restart_sentinel_js_1.summarizeRestartSentinel)(payload);
                    if (!sessionKey) {
                        mainSessionKey = (0, sessions_js_1.resolveMainSessionKeyFromConfig)();
                        (0, system_events_js_1.enqueueSystemEvent)(message, { sessionKey: mainSessionKey });
                        return [2 /*return*/];
                    }
                    topicIndex = sessionKey.lastIndexOf(":topic:");
                    threadIndex = sessionKey.lastIndexOf(":thread:");
                    markerIndex = Math.max(topicIndex, threadIndex);
                    marker = topicIndex > threadIndex ? ":topic:" : ":thread:";
                    baseSessionKey = markerIndex === -1 ? sessionKey : sessionKey.slice(0, markerIndex);
                    threadIdRaw = markerIndex === -1 ? undefined : sessionKey.slice(markerIndex + marker.length);
                    sessionThreadId = (threadIdRaw === null || threadIdRaw === void 0 ? void 0 : threadIdRaw.trim()) || undefined;
                    _a = (0, session_utils_js_1.loadSessionEntry)(sessionKey), cfg = _a.cfg, entry = _a.entry;
                    parsedTarget = (0, sessions_send_helpers_js_1.resolveAnnounceTargetFromKey)(baseSessionKey);
                    sentinelContext = payload.deliveryContext;
                    sessionDeliveryContext = (0, delivery_context_js_1.deliveryContextFromSession)(entry);
                    if (!sessionDeliveryContext && markerIndex !== -1 && baseSessionKey) {
                        baseEntry = (0, session_utils_js_1.loadSessionEntry)(baseSessionKey).entry;
                        sessionDeliveryContext = (0, delivery_context_js_1.deliveryContextFromSession)(baseEntry);
                    }
                    origin = (0, delivery_context_js_1.mergeDeliveryContext)(sentinelContext, (0, delivery_context_js_1.mergeDeliveryContext)(sessionDeliveryContext, parsedTarget !== null && parsedTarget !== void 0 ? parsedTarget : undefined));
                    channelRaw = origin === null || origin === void 0 ? void 0 : origin.channel;
                    channel = channelRaw ? (0, index_js_1.normalizeChannelId)(channelRaw) : null;
                    to = origin === null || origin === void 0 ? void 0 : origin.to;
                    if (!channel || !to) {
                        (0, system_events_js_1.enqueueSystemEvent)(message, { sessionKey: sessionKey });
                        return [2 /*return*/];
                    }
                    resolved = (0, targets_js_1.resolveOutboundTarget)({
                        channel: channel,
                        to: to,
                        cfg: cfg,
                        accountId: origin === null || origin === void 0 ? void 0 : origin.accountId,
                        mode: "implicit",
                    });
                    if (!resolved.ok) {
                        (0, system_events_js_1.enqueueSystemEvent)(message, { sessionKey: sessionKey });
                        return [2 /*return*/];
                    }
                    threadId = (_e = (_d = (_c = payload.threadId) !== null && _c !== void 0 ? _c : parsedTarget === null || parsedTarget === void 0 ? void 0 : parsedTarget.threadId) !== null && _d !== void 0 ? _d : sessionThreadId) !== null && _e !== void 0 ? _e : ((origin === null || origin === void 0 ? void 0 : origin.threadId) != null ? String(origin.threadId) : undefined);
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, agent_js_1.agentCommand)({
                            message: message,
                            sessionKey: sessionKey,
                            to: resolved.to,
                            channel: channel,
                            deliver: true,
                            bestEffortDeliver: true,
                            messageChannel: channel,
                            threadId: threadId,
                        }, runtime_js_1.defaultRuntime, params.deps)];
                case 3:
                    _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _f.sent();
                    (0, system_events_js_1.enqueueSystemEvent)("".concat(summary, "\n").concat(String(err_1)), { sessionKey: sessionKey });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function shouldWakeFromRestartSentinel() {
    return !process.env.VITEST && process.env.NODE_ENV !== "test";
}
