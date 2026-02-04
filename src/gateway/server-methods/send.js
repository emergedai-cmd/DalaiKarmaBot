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
exports.sendHandlers = void 0;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var index_js_1 = require("../../channels/plugins/index.js");
var registry_js_1 = require("../../channels/registry.js");
var deps_js_1 = require("../../cli/deps.js");
var config_js_1 = require("../../config/config.js");
var deliver_js_1 = require("../../infra/outbound/deliver.js");
var outbound_session_js_1 = require("../../infra/outbound/outbound-session.js");
var payloads_js_1 = require("../../infra/outbound/payloads.js");
var targets_js_1 = require("../../infra/outbound/targets.js");
var polls_js_1 = require("../../polls.js");
var index_js_2 = require("../protocol/index.js");
var ws_log_js_1 = require("../ws-log.js");
var inflightByContext = new WeakMap();
var getInflightMap = function (context) {
    var inflight = inflightByContext.get(context);
    if (!inflight) {
        inflight = new Map();
        inflightByContext.set(context, inflight);
    }
    return inflight;
};
exports.sendHandlers = {
    send: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, request, idem, dedupeKey, cached, inflightMap, inflight, result, meta, to, message, mediaUrls, channelInput, normalizedChannel, channel, accountId, outboundChannel, plugin, work, result;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    p = params;
                    if (!(0, index_js_2.validateSendParams)(p)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid send params: ".concat((0, index_js_2.formatValidationErrors)(index_js_2.validateSendParams.errors))));
                        return [2 /*return*/];
                    }
                    request = p;
                    idem = request.idempotencyKey;
                    dedupeKey = "send:".concat(idem);
                    cached = context.dedupe.get(dedupeKey);
                    if (cached) {
                        respond(cached.ok, cached.payload, cached.error, {
                            cached: true,
                        });
                        return [2 /*return*/];
                    }
                    inflightMap = getInflightMap(context);
                    inflight = inflightMap.get(dedupeKey);
                    if (!inflight) return [3 /*break*/, 2];
                    return [4 /*yield*/, inflight];
                case 1:
                    result = _c.sent();
                    meta = result.meta ? __assign(__assign({}, result.meta), { cached: true }) : { cached: true };
                    respond(result.ok, result.payload, result.error, meta);
                    return [2 /*return*/];
                case 2:
                    to = request.to.trim();
                    message = request.message.trim();
                    mediaUrls = Array.isArray(request.mediaUrls) ? request.mediaUrls : undefined;
                    channelInput = typeof request.channel === "string" ? request.channel : undefined;
                    normalizedChannel = channelInput ? (0, index_js_1.normalizeChannelId)(channelInput) : null;
                    if (channelInput && !normalizedChannel) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "unsupported channel: ".concat(channelInput)));
                        return [2 /*return*/];
                    }
                    channel = normalizedChannel !== null && normalizedChannel !== void 0 ? normalizedChannel : registry_js_1.DEFAULT_CHAT_CHANNEL;
                    accountId = typeof request.accountId === "string" && request.accountId.trim().length
                        ? request.accountId.trim()
                        : undefined;
                    outboundChannel = channel;
                    plugin = (0, index_js_1.getChannelPlugin)(channel);
                    if (!plugin) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "unsupported channel: ".concat(channel)));
                        return [2 /*return*/];
                    }
                    work = (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var cfg, resolved, outboundDeps, mirrorPayloads, mirrorText, mirrorMediaUrls, providedSessionKey, derivedAgentId, derivedRoute, _a, results, result, payload, err_1, error;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 7, , 8]);
                                    cfg = (0, config_js_1.loadConfig)();
                                    resolved = (0, targets_js_1.resolveOutboundTarget)({
                                        channel: outboundChannel,
                                        to: to,
                                        cfg: cfg,
                                        accountId: accountId,
                                        mode: "explicit",
                                    });
                                    if (!resolved.ok) {
                                        return [2 /*return*/, {
                                                ok: false,
                                                error: (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, String(resolved.error)),
                                                meta: { channel: channel },
                                            }];
                                    }
                                    outboundDeps = context.deps ? (0, deps_js_1.createOutboundSendDeps)(context.deps) : undefined;
                                    mirrorPayloads = (0, payloads_js_1.normalizeReplyPayloadsForDelivery)([
                                        { text: message, mediaUrl: request.mediaUrl, mediaUrls: mediaUrls },
                                    ]);
                                    mirrorText = mirrorPayloads
                                        .map(function (payload) { return payload.text; })
                                        .filter(Boolean)
                                        .join("\n");
                                    mirrorMediaUrls = mirrorPayloads.flatMap(function (payload) { var _a; return (_a = payload.mediaUrls) !== null && _a !== void 0 ? _a : (payload.mediaUrl ? [payload.mediaUrl] : []); });
                                    providedSessionKey = typeof request.sessionKey === "string" && request.sessionKey.trim()
                                        ? request.sessionKey.trim().toLowerCase()
                                        : undefined;
                                    derivedAgentId = (0, agent_scope_js_1.resolveSessionAgentId)({ config: cfg });
                                    if (!!providedSessionKey) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, outbound_session_js_1.resolveOutboundSessionRoute)({
                                            cfg: cfg,
                                            channel: channel,
                                            agentId: derivedAgentId,
                                            accountId: accountId,
                                            target: resolved.to,
                                        })];
                                case 1:
                                    _a = _b.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    _a = null;
                                    _b.label = 3;
                                case 3:
                                    derivedRoute = _a;
                                    if (!derivedRoute) return [3 /*break*/, 5];
                                    return [4 /*yield*/, (0, outbound_session_js_1.ensureOutboundSessionEntry)({
                                            cfg: cfg,
                                            agentId: derivedAgentId,
                                            channel: channel,
                                            accountId: accountId,
                                            route: derivedRoute,
                                        })];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5: return [4 /*yield*/, (0, deliver_js_1.deliverOutboundPayloads)({
                                        cfg: cfg,
                                        channel: outboundChannel,
                                        to: resolved.to,
                                        accountId: accountId,
                                        payloads: [{ text: message, mediaUrl: request.mediaUrl, mediaUrls: mediaUrls }],
                                        gifPlayback: request.gifPlayback,
                                        deps: outboundDeps,
                                        mirror: providedSessionKey
                                            ? {
                                                sessionKey: providedSessionKey,
                                                agentId: (0, agent_scope_js_1.resolveSessionAgentId)({ sessionKey: providedSessionKey, config: cfg }),
                                                text: mirrorText || message,
                                                mediaUrls: mirrorMediaUrls.length > 0 ? mirrorMediaUrls : undefined,
                                            }
                                            : derivedRoute
                                                ? {
                                                    sessionKey: derivedRoute.sessionKey,
                                                    agentId: derivedAgentId,
                                                    text: mirrorText || message,
                                                    mediaUrls: mirrorMediaUrls.length > 0 ? mirrorMediaUrls : undefined,
                                                }
                                                : undefined,
                                    })];
                                case 6:
                                    results = _b.sent();
                                    result = results.at(-1);
                                    if (!result) {
                                        throw new Error("No delivery result");
                                    }
                                    payload = {
                                        runId: idem,
                                        messageId: result.messageId,
                                        channel: channel,
                                    };
                                    if ("chatId" in result) {
                                        payload.chatId = result.chatId;
                                    }
                                    if ("channelId" in result) {
                                        payload.channelId = result.channelId;
                                    }
                                    if ("toJid" in result) {
                                        payload.toJid = result.toJid;
                                    }
                                    if ("conversationId" in result) {
                                        payload.conversationId = result.conversationId;
                                    }
                                    context.dedupe.set(dedupeKey, {
                                        ts: Date.now(),
                                        ok: true,
                                        payload: payload,
                                    });
                                    return [2 /*return*/, {
                                            ok: true,
                                            payload: payload,
                                            meta: { channel: channel },
                                        }];
                                case 7:
                                    err_1 = _b.sent();
                                    error = (0, index_js_2.errorShape)(index_js_2.ErrorCodes.UNAVAILABLE, String(err_1));
                                    context.dedupe.set(dedupeKey, {
                                        ts: Date.now(),
                                        ok: false,
                                        error: error,
                                    });
                                    return [2 /*return*/, { ok: false, error: error, meta: { channel: channel, error: (0, ws_log_js_1.formatForLog)(err_1) } }];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); })();
                    inflightMap.set(dedupeKey, work);
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, , 5, 6]);
                    return [4 /*yield*/, work];
                case 4:
                    result = _c.sent();
                    respond(result.ok, result.payload, result.error, result.meta);
                    return [3 /*break*/, 6];
                case 5:
                    inflightMap.delete(dedupeKey);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    poll: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, request, idem, cached, to, channelInput, normalizedChannel, channel, poll, accountId, plugin, outbound, cfg, resolved, normalized, result, payload, err_2, error;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    p = params;
                    if (!(0, index_js_2.validatePollParams)(p)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid poll params: ".concat((0, index_js_2.formatValidationErrors)(index_js_2.validatePollParams.errors))));
                        return [2 /*return*/];
                    }
                    request = p;
                    idem = request.idempotencyKey;
                    cached = context.dedupe.get("poll:".concat(idem));
                    if (cached) {
                        respond(cached.ok, cached.payload, cached.error, {
                            cached: true,
                        });
                        return [2 /*return*/];
                    }
                    to = request.to.trim();
                    channelInput = typeof request.channel === "string" ? request.channel : undefined;
                    normalizedChannel = channelInput ? (0, index_js_1.normalizeChannelId)(channelInput) : null;
                    if (channelInput && !normalizedChannel) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "unsupported poll channel: ".concat(channelInput)));
                        return [2 /*return*/];
                    }
                    channel = normalizedChannel !== null && normalizedChannel !== void 0 ? normalizedChannel : registry_js_1.DEFAULT_CHAT_CHANNEL;
                    poll = {
                        question: request.question,
                        options: request.options,
                        maxSelections: request.maxSelections,
                        durationHours: request.durationHours,
                    };
                    accountId = typeof request.accountId === "string" && request.accountId.trim().length
                        ? request.accountId.trim()
                        : undefined;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    plugin = (0, index_js_1.getChannelPlugin)(channel);
                    outbound = plugin === null || plugin === void 0 ? void 0 : plugin.outbound;
                    if (!(outbound === null || outbound === void 0 ? void 0 : outbound.sendPoll)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "unsupported poll channel: ".concat(channel)));
                        return [2 /*return*/];
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    resolved = (0, targets_js_1.resolveOutboundTarget)({
                        channel: channel,
                        to: to,
                        cfg: cfg,
                        accountId: accountId,
                        mode: "explicit",
                    });
                    if (!resolved.ok) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, String(resolved.error)));
                        return [2 /*return*/];
                    }
                    normalized = outbound.pollMaxOptions
                        ? (0, polls_js_1.normalizePollInput)(poll, { maxOptions: outbound.pollMaxOptions })
                        : (0, polls_js_1.normalizePollInput)(poll);
                    return [4 /*yield*/, outbound.sendPoll({
                            cfg: cfg,
                            to: resolved.to,
                            poll: normalized,
                            accountId: accountId,
                        })];
                case 2:
                    result = _c.sent();
                    payload = {
                        runId: idem,
                        messageId: result.messageId,
                        channel: channel,
                    };
                    if (result.toJid) {
                        payload.toJid = result.toJid;
                    }
                    if (result.channelId) {
                        payload.channelId = result.channelId;
                    }
                    if (result.conversationId) {
                        payload.conversationId = result.conversationId;
                    }
                    if (result.pollId) {
                        payload.pollId = result.pollId;
                    }
                    context.dedupe.set("poll:".concat(idem), {
                        ts: Date.now(),
                        ok: true,
                        payload: payload,
                    });
                    respond(true, payload, undefined, { channel: channel });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _c.sent();
                    error = (0, index_js_2.errorShape)(index_js_2.ErrorCodes.UNAVAILABLE, String(err_2));
                    context.dedupe.set("poll:".concat(idem), {
                        ts: Date.now(),
                        ok: false,
                        error: error,
                    });
                    respond(false, undefined, error, {
                        channel: channel,
                        error: (0, ws_log_js_1.formatForLog)(err_2),
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
};
