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
exports.agentHandlers = void 0;
var node_crypto_1 = require("node:crypto");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var agent_js_1 = require("../../commands/agent.js");
var config_js_1 = require("../../config/config.js");
var sessions_js_1 = require("../../config/sessions.js");
var agent_events_js_1 = require("../../infra/agent-events.js");
var agent_delivery_js_1 = require("../../infra/outbound/agent-delivery.js");
var session_key_js_1 = require("../../routing/session-key.js");
var runtime_js_1 = require("../../runtime.js");
var send_policy_js_1 = require("../../sessions/send-policy.js");
var delivery_context_js_1 = require("../../utils/delivery-context.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var assistant_identity_js_1 = require("../assistant-identity.js");
var chat_attachments_js_1 = require("../chat-attachments.js");
var control_ui_shared_js_1 = require("../control-ui-shared.js");
var index_js_1 = require("../protocol/index.js");
var session_utils_js_1 = require("../session-utils.js");
var ws_log_js_1 = require("../ws-log.js");
var agent_job_js_1 = require("./agent-job.js");
var agent_timestamp_js_1 = require("./agent-timestamp.js");
exports.agentHandlers = {
    agent: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, request, cfg, idem, groupIdRaw, groupChannelRaw, groupSpaceRaw, resolvedGroupId, resolvedGroupChannel, resolvedGroupSpace, spawnedByValue, cached, normalizedAttachments, message, images, parsed, err_1, isKnownGatewayChannel, channelHints, _i, channelHints_1, rawChannel, normalized, agentIdRaw, agentId, knownAgents, requestedSessionKeyRaw, requestedSessionKey, sessionAgentId, resolvedSessionId, sessionEntry, bestEffortDeliver, cfgForAgent, _c, cfg_1, storePath, entry, canonicalKey, now, sessionId, labelValue, inheritedGroup, parentEntry, deliveryFields, nextEntry_1, sendPolicy, canonicalSessionKey_1, agentId_1, mainSessionKey, runId, wantsDelivery, explicitTo, explicitThreadId, deliveryPlan, resolvedChannel, deliveryTargetMode, resolvedAccountId, resolvedTo, cfgResolved, fallback, deliver, accepted, resolvedThreadId;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    p = params;
                    if (!(0, index_js_1.validateAgentParams)(p)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid agent params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateAgentParams.errors))));
                        return [2 /*return*/];
                    }
                    request = p;
                    cfg = (0, config_js_1.loadConfig)();
                    idem = request.idempotencyKey;
                    groupIdRaw = typeof request.groupId === "string" ? request.groupId.trim() : "";
                    groupChannelRaw = typeof request.groupChannel === "string" ? request.groupChannel.trim() : "";
                    groupSpaceRaw = typeof request.groupSpace === "string" ? request.groupSpace.trim() : "";
                    resolvedGroupId = groupIdRaw || undefined;
                    resolvedGroupChannel = groupChannelRaw || undefined;
                    resolvedGroupSpace = groupSpaceRaw || undefined;
                    spawnedByValue = typeof request.spawnedBy === "string" ? request.spawnedBy.trim() : undefined;
                    cached = context.dedupe.get("agent:".concat(idem));
                    if (cached) {
                        respond(cached.ok, cached.payload, cached.error, {
                            cached: true,
                        });
                        return [2 /*return*/];
                    }
                    normalizedAttachments = (_e = (_d = request.attachments) === null || _d === void 0 ? void 0 : _d.map(function (a) { return ({
                        type: typeof (a === null || a === void 0 ? void 0 : a.type) === "string" ? a.type : undefined,
                        mimeType: typeof (a === null || a === void 0 ? void 0 : a.mimeType) === "string" ? a.mimeType : undefined,
                        fileName: typeof (a === null || a === void 0 ? void 0 : a.fileName) === "string" ? a.fileName : undefined,
                        content: typeof (a === null || a === void 0 ? void 0 : a.content) === "string"
                            ? a.content
                            : ArrayBuffer.isView(a === null || a === void 0 ? void 0 : a.content)
                                ? Buffer.from(a.content.buffer, a.content.byteOffset, a.content.byteLength).toString("base64")
                                : undefined,
                    }); }).filter(function (a) { return a.content; })) !== null && _e !== void 0 ? _e : [];
                    message = request.message.trim();
                    images = [];
                    if (!(normalizedAttachments.length > 0)) return [3 /*break*/, 4];
                    _u.label = 1;
                case 1:
                    _u.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, chat_attachments_js_1.parseMessageWithAttachments)(message, normalizedAttachments, {
                            maxBytes: 5000000,
                            log: context.logGateway,
                        })];
                case 2:
                    parsed = _u.sent();
                    message = parsed.message.trim();
                    images = parsed.images;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _u.sent();
                    respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, String(err_1)));
                    return [2 /*return*/];
                case 4:
                    // Inject timestamp into messages that don't already have one.
                    // Channel messages (Discord, Telegram, etc.) get timestamps via envelope
                    // formatting in a separate code path — they never reach this handler.
                    // See: https://github.com/moltbot/moltbot/issues/3658
                    message = (0, agent_timestamp_js_1.injectTimestamp)(message, (0, agent_timestamp_js_1.timestampOptsFromConfig)(cfg));
                    isKnownGatewayChannel = function (value) { return (0, message_channel_js_1.isGatewayMessageChannel)(value); };
                    channelHints = [request.channel, request.replyChannel]
                        .filter(function (value) { return typeof value === "string"; })
                        .map(function (value) { return value.trim(); })
                        .filter(Boolean);
                    for (_i = 0, channelHints_1 = channelHints; _i < channelHints_1.length; _i++) {
                        rawChannel = channelHints_1[_i];
                        normalized = (0, message_channel_js_1.normalizeMessageChannel)(rawChannel);
                        if (normalized && normalized !== "last" && !isKnownGatewayChannel(normalized)) {
                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid agent params: unknown channel: ".concat(String(normalized))));
                            return [2 /*return*/];
                        }
                    }
                    agentIdRaw = typeof request.agentId === "string" ? request.agentId.trim() : "";
                    agentId = agentIdRaw ? (0, session_key_js_1.normalizeAgentId)(agentIdRaw) : undefined;
                    if (agentId) {
                        knownAgents = (0, agent_scope_js_1.listAgentIds)(cfg);
                        if (!knownAgents.includes(agentId)) {
                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid agent params: unknown agent id \"".concat(request.agentId, "\"")));
                            return [2 /*return*/];
                        }
                    }
                    requestedSessionKeyRaw = typeof request.sessionKey === "string" && request.sessionKey.trim()
                        ? request.sessionKey.trim()
                        : undefined;
                    requestedSessionKey = requestedSessionKeyRaw !== null && requestedSessionKeyRaw !== void 0 ? requestedSessionKeyRaw : (0, sessions_js_1.resolveExplicitAgentSessionKey)({
                        cfg: cfg,
                        agentId: agentId,
                    });
                    if (agentId && requestedSessionKeyRaw) {
                        sessionAgentId = (0, sessions_js_1.resolveAgentIdFromSessionKey)(requestedSessionKeyRaw);
                        if (sessionAgentId !== agentId) {
                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid agent params: agent \"".concat(request.agentId, "\" does not match session key agent \"").concat(sessionAgentId, "\"")));
                            return [2 /*return*/];
                        }
                    }
                    resolvedSessionId = ((_f = request.sessionId) === null || _f === void 0 ? void 0 : _f.trim()) || undefined;
                    bestEffortDeliver = false;
                    if (!requestedSessionKey) return [3 /*break*/, 7];
                    _c = (0, session_utils_js_1.loadSessionEntry)(requestedSessionKey), cfg_1 = _c.cfg, storePath = _c.storePath, entry = _c.entry, canonicalKey = _c.canonicalKey;
                    cfgForAgent = cfg_1;
                    now = Date.now();
                    sessionId = (_g = entry === null || entry === void 0 ? void 0 : entry.sessionId) !== null && _g !== void 0 ? _g : (0, node_crypto_1.randomUUID)();
                    labelValue = ((_h = request.label) === null || _h === void 0 ? void 0 : _h.trim()) || (entry === null || entry === void 0 ? void 0 : entry.label);
                    spawnedByValue = spawnedByValue || (entry === null || entry === void 0 ? void 0 : entry.spawnedBy);
                    inheritedGroup = void 0;
                    if (spawnedByValue && (!resolvedGroupId || !resolvedGroupChannel || !resolvedGroupSpace)) {
                        try {
                            parentEntry = (_j = (0, session_utils_js_1.loadSessionEntry)(spawnedByValue)) === null || _j === void 0 ? void 0 : _j.entry;
                            inheritedGroup = {
                                groupId: parentEntry === null || parentEntry === void 0 ? void 0 : parentEntry.groupId,
                                groupChannel: parentEntry === null || parentEntry === void 0 ? void 0 : parentEntry.groupChannel,
                                groupSpace: parentEntry === null || parentEntry === void 0 ? void 0 : parentEntry.space,
                            };
                        }
                        catch (_v) {
                            inheritedGroup = undefined;
                        }
                    }
                    resolvedGroupId = resolvedGroupId || (inheritedGroup === null || inheritedGroup === void 0 ? void 0 : inheritedGroup.groupId);
                    resolvedGroupChannel = resolvedGroupChannel || (inheritedGroup === null || inheritedGroup === void 0 ? void 0 : inheritedGroup.groupChannel);
                    resolvedGroupSpace = resolvedGroupSpace || (inheritedGroup === null || inheritedGroup === void 0 ? void 0 : inheritedGroup.groupSpace);
                    deliveryFields = (0, delivery_context_js_1.normalizeSessionDeliveryFields)(entry);
                    nextEntry_1 = {
                        sessionId: sessionId,
                        updatedAt: now,
                        thinkingLevel: entry === null || entry === void 0 ? void 0 : entry.thinkingLevel,
                        verboseLevel: entry === null || entry === void 0 ? void 0 : entry.verboseLevel,
                        reasoningLevel: entry === null || entry === void 0 ? void 0 : entry.reasoningLevel,
                        systemSent: entry === null || entry === void 0 ? void 0 : entry.systemSent,
                        sendPolicy: entry === null || entry === void 0 ? void 0 : entry.sendPolicy,
                        skillsSnapshot: entry === null || entry === void 0 ? void 0 : entry.skillsSnapshot,
                        deliveryContext: deliveryFields.deliveryContext,
                        lastChannel: (_k = deliveryFields.lastChannel) !== null && _k !== void 0 ? _k : entry === null || entry === void 0 ? void 0 : entry.lastChannel,
                        lastTo: (_l = deliveryFields.lastTo) !== null && _l !== void 0 ? _l : entry === null || entry === void 0 ? void 0 : entry.lastTo,
                        lastAccountId: (_m = deliveryFields.lastAccountId) !== null && _m !== void 0 ? _m : entry === null || entry === void 0 ? void 0 : entry.lastAccountId,
                        modelOverride: entry === null || entry === void 0 ? void 0 : entry.modelOverride,
                        providerOverride: entry === null || entry === void 0 ? void 0 : entry.providerOverride,
                        label: labelValue,
                        spawnedBy: spawnedByValue,
                        channel: (_o = entry === null || entry === void 0 ? void 0 : entry.channel) !== null && _o !== void 0 ? _o : (_p = request.channel) === null || _p === void 0 ? void 0 : _p.trim(),
                        groupId: resolvedGroupId !== null && resolvedGroupId !== void 0 ? resolvedGroupId : entry === null || entry === void 0 ? void 0 : entry.groupId,
                        groupChannel: resolvedGroupChannel !== null && resolvedGroupChannel !== void 0 ? resolvedGroupChannel : entry === null || entry === void 0 ? void 0 : entry.groupChannel,
                        space: resolvedGroupSpace !== null && resolvedGroupSpace !== void 0 ? resolvedGroupSpace : entry === null || entry === void 0 ? void 0 : entry.space,
                        cliSessionIds: entry === null || entry === void 0 ? void 0 : entry.cliSessionIds,
                        claudeCliSessionId: entry === null || entry === void 0 ? void 0 : entry.claudeCliSessionId,
                    };
                    sessionEntry = nextEntry_1;
                    sendPolicy = (0, send_policy_js_1.resolveSendPolicy)({
                        cfg: cfg_1,
                        entry: entry,
                        sessionKey: requestedSessionKey,
                        channel: entry === null || entry === void 0 ? void 0 : entry.channel,
                        chatType: entry === null || entry === void 0 ? void 0 : entry.chatType,
                    });
                    if (sendPolicy === "deny") {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "send blocked by session policy"));
                        return [2 /*return*/];
                    }
                    resolvedSessionId = sessionId;
                    canonicalSessionKey_1 = canonicalKey;
                    agentId_1 = (0, sessions_js_1.resolveAgentIdFromSessionKey)(canonicalSessionKey_1);
                    mainSessionKey = (0, sessions_js_1.resolveAgentMainSessionKey)({ cfg: cfg_1, agentId: agentId_1 });
                    if (!storePath) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            store[canonicalSessionKey_1] = nextEntry_1;
                        })];
                case 5:
                    _u.sent();
                    _u.label = 6;
                case 6:
                    if (canonicalSessionKey_1 === mainSessionKey || canonicalSessionKey_1 === "global") {
                        context.addChatRun(idem, {
                            sessionKey: requestedSessionKey,
                            clientRunId: idem,
                        });
                        bestEffortDeliver = true;
                    }
                    (0, agent_events_js_1.registerAgentRunContext)(idem, { sessionKey: requestedSessionKey });
                    _u.label = 7;
                case 7:
                    runId = idem;
                    wantsDelivery = request.deliver === true;
                    explicitTo = typeof request.replyTo === "string" && request.replyTo.trim()
                        ? request.replyTo.trim()
                        : typeof request.to === "string" && request.to.trim()
                            ? request.to.trim()
                            : undefined;
                    explicitThreadId = typeof request.threadId === "string" && request.threadId.trim()
                        ? request.threadId.trim()
                        : undefined;
                    deliveryPlan = (0, agent_delivery_js_1.resolveAgentDeliveryPlan)({
                        sessionEntry: sessionEntry,
                        requestedChannel: (_q = request.replyChannel) !== null && _q !== void 0 ? _q : request.channel,
                        explicitTo: explicitTo,
                        explicitThreadId: explicitThreadId,
                        accountId: (_r = request.replyAccountId) !== null && _r !== void 0 ? _r : request.accountId,
                        wantsDelivery: wantsDelivery,
                    });
                    resolvedChannel = deliveryPlan.resolvedChannel;
                    deliveryTargetMode = deliveryPlan.deliveryTargetMode;
                    resolvedAccountId = deliveryPlan.resolvedAccountId;
                    resolvedTo = deliveryPlan.resolvedTo;
                    if (!resolvedTo && (0, message_channel_js_1.isDeliverableMessageChannel)(resolvedChannel)) {
                        cfgResolved = cfgForAgent !== null && cfgForAgent !== void 0 ? cfgForAgent : cfg;
                        fallback = (0, agent_delivery_js_1.resolveAgentOutboundTarget)({
                            cfg: cfgResolved,
                            plan: deliveryPlan,
                            targetMode: "implicit",
                            validateExplicitTarget: false,
                        });
                        if ((_s = fallback.resolvedTarget) === null || _s === void 0 ? void 0 : _s.ok) {
                            resolvedTo = fallback.resolvedTo;
                        }
                    }
                    deliver = request.deliver === true && resolvedChannel !== message_channel_js_1.INTERNAL_MESSAGE_CHANNEL;
                    accepted = {
                        runId: runId,
                        status: "accepted",
                        acceptedAt: Date.now(),
                    };
                    // Store an in-flight ack so retries do not spawn a second run.
                    context.dedupe.set("agent:".concat(idem), {
                        ts: Date.now(),
                        ok: true,
                        payload: accepted,
                    });
                    respond(true, accepted, undefined, { runId: runId });
                    resolvedThreadId = explicitThreadId !== null && explicitThreadId !== void 0 ? explicitThreadId : deliveryPlan.resolvedThreadId;
                    void (0, agent_js_1.agentCommand)({
                        message: message,
                        images: images,
                        to: resolvedTo,
                        sessionId: resolvedSessionId,
                        sessionKey: requestedSessionKey,
                        thinking: request.thinking,
                        deliver: deliver,
                        deliveryTargetMode: deliveryTargetMode,
                        channel: resolvedChannel,
                        accountId: resolvedAccountId,
                        threadId: resolvedThreadId,
                        runContext: {
                            messageChannel: resolvedChannel,
                            accountId: resolvedAccountId,
                            groupId: resolvedGroupId,
                            groupChannel: resolvedGroupChannel,
                            groupSpace: resolvedGroupSpace,
                            currentThreadTs: resolvedThreadId != null ? String(resolvedThreadId) : undefined,
                        },
                        groupId: resolvedGroupId,
                        groupChannel: resolvedGroupChannel,
                        groupSpace: resolvedGroupSpace,
                        spawnedBy: spawnedByValue,
                        timeout: (_t = request.timeout) === null || _t === void 0 ? void 0 : _t.toString(),
                        bestEffortDeliver: bestEffortDeliver,
                        messageChannel: resolvedChannel,
                        runId: runId,
                        lane: request.lane,
                        extraSystemPrompt: request.extraSystemPrompt,
                    }, runtime_js_1.defaultRuntime, context.deps)
                        .then(function (result) {
                        var payload = {
                            runId: runId,
                            status: "ok",
                            summary: "completed",
                            result: result,
                        };
                        context.dedupe.set("agent:".concat(idem), {
                            ts: Date.now(),
                            ok: true,
                            payload: payload,
                        });
                        // Send a second res frame (same id) so TS clients with expectFinal can wait.
                        // Swift clients will typically treat the first res as the result and ignore this.
                        respond(true, payload, undefined, { runId: runId });
                    })
                        .catch(function (err) {
                        var error = (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, String(err));
                        var payload = {
                            runId: runId,
                            status: "error",
                            summary: String(err),
                        };
                        context.dedupe.set("agent:".concat(idem), {
                            ts: Date.now(),
                            ok: false,
                            payload: payload,
                            error: error,
                        });
                        respond(false, payload, error, {
                            runId: runId,
                            error: (0, ws_log_js_1.formatForLog)(err),
                        });
                    });
                    return [2 /*return*/];
            }
        });
    }); },
    "agent.identity.get": function (_a) {
        var _b, _c, _d;
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_1.validateAgentIdentityParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid agent.identity.get params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateAgentIdentityParams.errors))));
            return;
        }
        var p = params;
        var agentIdRaw = typeof p.agentId === "string" ? p.agentId.trim() : "";
        var sessionKeyRaw = typeof p.sessionKey === "string" ? p.sessionKey.trim() : "";
        var agentId = agentIdRaw ? (0, session_key_js_1.normalizeAgentId)(agentIdRaw) : undefined;
        if (sessionKeyRaw) {
            var resolved = (0, sessions_js_1.resolveAgentIdFromSessionKey)(sessionKeyRaw);
            if (agentId && resolved !== agentId) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid agent.identity.get params: agent \"".concat(agentIdRaw, "\" does not match session key agent \"").concat(resolved, "\"")));
                return;
            }
            agentId = resolved;
        }
        var cfg = (0, config_js_1.loadConfig)();
        var identity = (0, assistant_identity_js_1.resolveAssistantIdentity)({ cfg: cfg, agentId: agentId });
        var avatarValue = (_d = (0, control_ui_shared_js_1.resolveAssistantAvatarUrl)({
            avatar: identity.avatar,
            agentId: identity.agentId,
            basePath: (_c = (_b = cfg.gateway) === null || _b === void 0 ? void 0 : _b.controlUi) === null || _c === void 0 ? void 0 : _c.basePath,
        })) !== null && _d !== void 0 ? _d : identity.avatar;
        respond(true, __assign(__assign({}, identity), { avatar: avatarValue }), undefined);
    },
    "agent.wait": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, runId, timeoutMs, snapshot;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateAgentWaitParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid agent.wait params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateAgentWaitParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    runId = p.runId.trim();
                    timeoutMs = typeof p.timeoutMs === "number" && Number.isFinite(p.timeoutMs)
                        ? Math.max(0, Math.floor(p.timeoutMs))
                        : 30000;
                    return [4 /*yield*/, (0, agent_job_js_1.waitForAgentJob)({
                            runId: runId,
                            timeoutMs: timeoutMs,
                        })];
                case 1:
                    snapshot = _c.sent();
                    if (!snapshot) {
                        respond(true, {
                            runId: runId,
                            status: "timeout",
                        });
                        return [2 /*return*/];
                    }
                    respond(true, {
                        runId: runId,
                        status: snapshot.status,
                        startedAt: snapshot.startedAt,
                        endedAt: snapshot.endedAt,
                        error: snapshot.error,
                    });
                    return [2 /*return*/];
            }
        });
    }); },
};
