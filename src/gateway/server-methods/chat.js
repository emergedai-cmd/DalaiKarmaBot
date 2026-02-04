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
exports.chatHandlers = void 0;
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var identity_js_1 = require("../../agents/identity.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var timeout_js_1 = require("../../agents/timeout.js");
var dispatch_js_1 = require("../../auto-reply/dispatch.js");
var reply_dispatcher_js_1 = require("../../auto-reply/reply/reply-dispatcher.js");
var response_prefix_template_js_1 = require("../../auto-reply/reply/response-prefix-template.js");
var send_policy_js_1 = require("../../sessions/send-policy.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var chat_abort_js_1 = require("../chat-abort.js");
var chat_attachments_js_1 = require("../chat-attachments.js");
var chat_sanitize_js_1 = require("../chat-sanitize.js");
var index_js_1 = require("../protocol/index.js");
var server_constants_js_1 = require("../server-constants.js");
var session_utils_js_1 = require("../session-utils.js");
var ws_log_js_1 = require("../ws-log.js");
var agent_timestamp_js_1 = require("./agent-timestamp.js");
function resolveTranscriptPath(params) {
    var sessionId = params.sessionId, storePath = params.storePath, sessionFile = params.sessionFile;
    if (sessionFile) {
        return sessionFile;
    }
    if (!storePath) {
        return null;
    }
    return node_path_1.default.join(node_path_1.default.dirname(storePath), "".concat(sessionId, ".jsonl"));
}
function ensureTranscriptFile(params) {
    if (node_fs_1.default.existsSync(params.transcriptPath)) {
        return { ok: true };
    }
    try {
        node_fs_1.default.mkdirSync(node_path_1.default.dirname(params.transcriptPath), { recursive: true });
        var header = {
            type: "session",
            version: pi_coding_agent_1.CURRENT_SESSION_VERSION,
            id: params.sessionId,
            timestamp: new Date().toISOString(),
            cwd: process.cwd(),
        };
        node_fs_1.default.writeFileSync(params.transcriptPath, "".concat(JSON.stringify(header), "\n"), "utf-8");
        return { ok: true };
    }
    catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
}
function appendAssistantTranscriptMessage(params) {
    var _a;
    var transcriptPath = resolveTranscriptPath({
        sessionId: params.sessionId,
        storePath: params.storePath,
        sessionFile: params.sessionFile,
    });
    if (!transcriptPath) {
        return { ok: false, error: "transcript path not resolved" };
    }
    if (!node_fs_1.default.existsSync(transcriptPath)) {
        if (!params.createIfMissing) {
            return { ok: false, error: "transcript file not found" };
        }
        var ensured = ensureTranscriptFile({
            transcriptPath: transcriptPath,
            sessionId: params.sessionId,
        });
        if (!ensured.ok) {
            return { ok: false, error: (_a = ensured.error) !== null && _a !== void 0 ? _a : "failed to create transcript file" };
        }
    }
    var now = Date.now();
    var messageId = (0, node_crypto_1.randomUUID)().slice(0, 8);
    var labelPrefix = params.label ? "[".concat(params.label, "]\n\n") : "";
    var messageBody = {
        role: "assistant",
        content: [{ type: "text", text: "".concat(labelPrefix).concat(params.message) }],
        timestamp: now,
        stopReason: "injected",
        usage: { input: 0, output: 0, totalTokens: 0 },
    };
    var transcriptEntry = {
        type: "message",
        id: messageId,
        timestamp: new Date(now).toISOString(),
        message: messageBody,
    };
    try {
        node_fs_1.default.appendFileSync(transcriptPath, "".concat(JSON.stringify(transcriptEntry), "\n"), "utf-8");
    }
    catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
    return { ok: true, messageId: messageId, message: transcriptEntry.message };
}
function nextChatSeq(context, runId) {
    var _a;
    var next = ((_a = context.agentRunSeq.get(runId)) !== null && _a !== void 0 ? _a : 0) + 1;
    context.agentRunSeq.set(runId, next);
    return next;
}
function broadcastChatFinal(params) {
    var seq = nextChatSeq({ agentRunSeq: params.context.agentRunSeq }, params.runId);
    var payload = {
        runId: params.runId,
        sessionKey: params.sessionKey,
        seq: seq,
        state: "final",
        message: params.message,
    };
    params.context.broadcast("chat", payload);
    params.context.nodeSendToSession(params.sessionKey, "chat", payload);
}
function broadcastChatError(params) {
    var seq = nextChatSeq({ agentRunSeq: params.context.agentRunSeq }, params.runId);
    var payload = {
        runId: params.runId,
        sessionKey: params.sessionKey,
        seq: seq,
        state: "error",
        errorMessage: params.errorMessage,
    };
    params.context.broadcast("chat", payload);
    params.context.nodeSendToSession(params.sessionKey, "chat", payload);
}
exports.chatHandlers = {
    "chat.history": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c, sessionKey, limit, _d, cfg, storePath, entry, sessionId, rawMessages, hardMax, defaultLimit, requested, max, sliced, sanitized, capped, thinkingLevel, configured, _e, provider, model, catalog;
        var _f, _g;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!(0, index_js_1.validateChatHistoryParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid chat.history params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateChatHistoryParams.errors))));
                        return [2 /*return*/];
                    }
                    _c = params, sessionKey = _c.sessionKey, limit = _c.limit;
                    _d = (0, session_utils_js_1.loadSessionEntry)(sessionKey), cfg = _d.cfg, storePath = _d.storePath, entry = _d.entry;
                    sessionId = entry === null || entry === void 0 ? void 0 : entry.sessionId;
                    rawMessages = sessionId && storePath ? (0, session_utils_js_1.readSessionMessages)(sessionId, storePath, entry === null || entry === void 0 ? void 0 : entry.sessionFile) : [];
                    hardMax = 1000;
                    defaultLimit = 200;
                    requested = typeof limit === "number" ? limit : defaultLimit;
                    max = Math.min(hardMax, requested);
                    sliced = rawMessages.length > max ? rawMessages.slice(-max) : rawMessages;
                    sanitized = (0, chat_sanitize_js_1.stripEnvelopeFromMessages)(sliced);
                    capped = (0, session_utils_js_1.capArrayByJsonBytes)(sanitized, (0, server_constants_js_1.getMaxChatHistoryMessagesBytes)()).items;
                    thinkingLevel = entry === null || entry === void 0 ? void 0 : entry.thinkingLevel;
                    if (!!thinkingLevel) return [3 /*break*/, 3];
                    configured = (_g = (_f = cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults) === null || _g === void 0 ? void 0 : _g.thinkingDefault;
                    if (!configured) return [3 /*break*/, 1];
                    thinkingLevel = configured;
                    return [3 /*break*/, 3];
                case 1:
                    _e = (0, session_utils_js_1.resolveSessionModelRef)(cfg, entry), provider = _e.provider, model = _e.model;
                    return [4 /*yield*/, context.loadGatewayModelCatalog()];
                case 2:
                    catalog = _h.sent();
                    thinkingLevel = (0, model_selection_js_1.resolveThinkingDefault)({
                        cfg: cfg,
                        provider: provider,
                        model: model,
                        catalog: catalog,
                    });
                    _h.label = 3;
                case 3:
                    respond(true, {
                        sessionKey: sessionKey,
                        sessionId: sessionId,
                        messages: capped,
                        thinkingLevel: thinkingLevel,
                    });
                    return [2 /*return*/];
            }
        });
    }); },
    "chat.abort": function (_a) {
        var params = _a.params, respond = _a.respond, context = _a.context;
        if (!(0, index_js_1.validateChatAbortParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid chat.abort params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateChatAbortParams.errors))));
            return;
        }
        var _b = params, sessionKey = _b.sessionKey, runId = _b.runId;
        var ops = {
            chatAbortControllers: context.chatAbortControllers,
            chatRunBuffers: context.chatRunBuffers,
            chatDeltaSentAt: context.chatDeltaSentAt,
            chatAbortedRuns: context.chatAbortedRuns,
            removeChatRun: context.removeChatRun,
            agentRunSeq: context.agentRunSeq,
            broadcast: context.broadcast,
            nodeSendToSession: context.nodeSendToSession,
        };
        if (!runId) {
            var res_1 = (0, chat_abort_js_1.abortChatRunsForSessionKey)(ops, {
                sessionKey: sessionKey,
                stopReason: "rpc",
            });
            respond(true, { ok: true, aborted: res_1.aborted, runIds: res_1.runIds });
            return;
        }
        var active = context.chatAbortControllers.get(runId);
        if (!active) {
            respond(true, { ok: true, aborted: false, runIds: [] });
            return;
        }
        if (active.sessionKey !== sessionKey) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "runId does not match sessionKey"));
            return;
        }
        var res = (0, chat_abort_js_1.abortChatRunById)(ops, {
            runId: runId,
            sessionKey: sessionKey,
            stopReason: "rpc",
        });
        respond(true, {
            ok: true,
            aborted: res.aborted,
            runIds: res.aborted ? [runId] : [],
        });
    },
    "chat.send": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, stopCommand, normalizedAttachments, rawMessage, parsedMessage, parsedImages, parsed, err_1, _c, cfg, entry, timeoutMs, now, clientRunId, sendPolicy, res, cached, activeExisting, abortController, ackPayload, trimmedMessage, injectThinking, commandBody, clientInfo, stampedMessage, ctx, agentId, prefixContext_1, finalReplyParts_1, dispatcher, agentRunStarted_1, error, payload;
        var _d, _e, _f, _g;
        var params = _b.params, respond = _b.respond, context = _b.context, client = _b.client;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!(0, index_js_1.validateChatSendParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid chat.send params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateChatSendParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    stopCommand = (0, chat_abort_js_1.isChatStopCommandText)(p.message);
                    normalizedAttachments = (_e = (_d = p.attachments) === null || _d === void 0 ? void 0 : _d.map(function (a) { return ({
                        type: typeof (a === null || a === void 0 ? void 0 : a.type) === "string" ? a.type : undefined,
                        mimeType: typeof (a === null || a === void 0 ? void 0 : a.mimeType) === "string" ? a.mimeType : undefined,
                        fileName: typeof (a === null || a === void 0 ? void 0 : a.fileName) === "string" ? a.fileName : undefined,
                        content: typeof (a === null || a === void 0 ? void 0 : a.content) === "string"
                            ? a.content
                            : ArrayBuffer.isView(a === null || a === void 0 ? void 0 : a.content)
                                ? Buffer.from(a.content.buffer, a.content.byteOffset, a.content.byteLength).toString("base64")
                                : undefined,
                    }); }).filter(function (a) { return a.content; })) !== null && _e !== void 0 ? _e : [];
                    rawMessage = p.message.trim();
                    if (!rawMessage && normalizedAttachments.length === 0) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "message or attachment required"));
                        return [2 /*return*/];
                    }
                    parsedMessage = p.message;
                    parsedImages = [];
                    if (!(normalizedAttachments.length > 0)) return [3 /*break*/, 4];
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, chat_attachments_js_1.parseMessageWithAttachments)(p.message, normalizedAttachments, {
                            maxBytes: 5000000,
                            log: context.logGateway,
                        })];
                case 2:
                    parsed = _h.sent();
                    parsedMessage = parsed.message;
                    parsedImages = parsed.images;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _h.sent();
                    respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, String(err_1)));
                    return [2 /*return*/];
                case 4:
                    _c = (0, session_utils_js_1.loadSessionEntry)(p.sessionKey), cfg = _c.cfg, entry = _c.entry;
                    timeoutMs = (0, timeout_js_1.resolveAgentTimeoutMs)({
                        cfg: cfg,
                        overrideMs: p.timeoutMs,
                    });
                    now = Date.now();
                    clientRunId = p.idempotencyKey;
                    sendPolicy = (0, send_policy_js_1.resolveSendPolicy)({
                        cfg: cfg,
                        entry: entry,
                        sessionKey: p.sessionKey,
                        channel: entry === null || entry === void 0 ? void 0 : entry.channel,
                        chatType: entry === null || entry === void 0 ? void 0 : entry.chatType,
                    });
                    if (sendPolicy === "deny") {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "send blocked by session policy"));
                        return [2 /*return*/];
                    }
                    if (stopCommand) {
                        res = (0, chat_abort_js_1.abortChatRunsForSessionKey)({
                            chatAbortControllers: context.chatAbortControllers,
                            chatRunBuffers: context.chatRunBuffers,
                            chatDeltaSentAt: context.chatDeltaSentAt,
                            chatAbortedRuns: context.chatAbortedRuns,
                            removeChatRun: context.removeChatRun,
                            agentRunSeq: context.agentRunSeq,
                            broadcast: context.broadcast,
                            nodeSendToSession: context.nodeSendToSession,
                        }, { sessionKey: p.sessionKey, stopReason: "stop" });
                        respond(true, { ok: true, aborted: res.aborted, runIds: res.runIds });
                        return [2 /*return*/];
                    }
                    cached = context.dedupe.get("chat:".concat(clientRunId));
                    if (cached) {
                        respond(cached.ok, cached.payload, cached.error, {
                            cached: true,
                        });
                        return [2 /*return*/];
                    }
                    activeExisting = context.chatAbortControllers.get(clientRunId);
                    if (activeExisting) {
                        respond(true, { runId: clientRunId, status: "in_flight" }, undefined, {
                            cached: true,
                            runId: clientRunId,
                        });
                        return [2 /*return*/];
                    }
                    try {
                        abortController = new AbortController();
                        context.chatAbortControllers.set(clientRunId, {
                            controller: abortController,
                            sessionId: (_f = entry === null || entry === void 0 ? void 0 : entry.sessionId) !== null && _f !== void 0 ? _f : clientRunId,
                            sessionKey: p.sessionKey,
                            startedAtMs: now,
                            expiresAtMs: (0, chat_abort_js_1.resolveChatRunExpiresAtMs)({ now: now, timeoutMs: timeoutMs }),
                        });
                        ackPayload = {
                            runId: clientRunId,
                            status: "started",
                        };
                        respond(true, ackPayload, undefined, { runId: clientRunId });
                        trimmedMessage = parsedMessage.trim();
                        injectThinking = Boolean(p.thinking && trimmedMessage && !trimmedMessage.startsWith("/"));
                        commandBody = injectThinking ? "/think ".concat(p.thinking, " ").concat(parsedMessage) : parsedMessage;
                        clientInfo = (_g = client === null || client === void 0 ? void 0 : client.connect) === null || _g === void 0 ? void 0 : _g.client;
                        stampedMessage = (0, agent_timestamp_js_1.injectTimestamp)(parsedMessage, (0, agent_timestamp_js_1.timestampOptsFromConfig)(cfg));
                        ctx = {
                            Body: parsedMessage,
                            BodyForAgent: stampedMessage,
                            BodyForCommands: commandBody,
                            RawBody: parsedMessage,
                            CommandBody: commandBody,
                            SessionKey: p.sessionKey,
                            Provider: message_channel_js_1.INTERNAL_MESSAGE_CHANNEL,
                            Surface: message_channel_js_1.INTERNAL_MESSAGE_CHANNEL,
                            OriginatingChannel: message_channel_js_1.INTERNAL_MESSAGE_CHANNEL,
                            ChatType: "direct",
                            CommandAuthorized: true,
                            MessageSid: clientRunId,
                            SenderId: clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.id,
                            SenderName: clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.displayName,
                            SenderUsername: clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.displayName,
                        };
                        agentId = (0, agent_scope_js_1.resolveSessionAgentId)({
                            sessionKey: p.sessionKey,
                            config: cfg,
                        });
                        prefixContext_1 = {
                            identityName: (0, identity_js_1.resolveIdentityName)(cfg, agentId),
                        };
                        finalReplyParts_1 = [];
                        dispatcher = (0, reply_dispatcher_js_1.createReplyDispatcher)({
                            responsePrefix: (0, identity_js_1.resolveEffectiveMessagesConfig)(cfg, agentId).responsePrefix,
                            responsePrefixContextProvider: function () { return prefixContext_1; },
                            onError: function (err) {
                                context.logGateway.warn("webchat dispatch failed: ".concat((0, ws_log_js_1.formatForLog)(err)));
                            },
                            deliver: function (payload, info) { return __awaiter(void 0, void 0, void 0, function () {
                                var text;
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    if (info.kind !== "final") {
                                        return [2 /*return*/];
                                    }
                                    text = (_b = (_a = payload.text) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
                                    if (!text) {
                                        return [2 /*return*/];
                                    }
                                    finalReplyParts_1.push(text);
                                    return [2 /*return*/];
                                });
                            }); },
                        });
                        agentRunStarted_1 = false;
                        void (0, dispatch_js_1.dispatchInboundMessage)({
                            ctx: ctx,
                            cfg: cfg,
                            dispatcher: dispatcher,
                            replyOptions: {
                                runId: clientRunId,
                                abortSignal: abortController.signal,
                                images: parsedImages.length > 0 ? parsedImages : undefined,
                                disableBlockStreaming: true,
                                onAgentRunStart: function () {
                                    agentRunStarted_1 = true;
                                },
                                onModelSelected: function (ctx) {
                                    var _a;
                                    prefixContext_1.provider = ctx.provider;
                                    prefixContext_1.model = (0, response_prefix_template_js_1.extractShortModelName)(ctx.model);
                                    prefixContext_1.modelFull = "".concat(ctx.provider, "/").concat(ctx.model);
                                    prefixContext_1.thinkingLevel = (_a = ctx.thinkLevel) !== null && _a !== void 0 ? _a : "off";
                                },
                            },
                        })
                            .then(function () {
                            var _a, _b, _c;
                            if (!agentRunStarted_1) {
                                var combinedReply = finalReplyParts_1
                                    .map(function (part) { return part.trim(); })
                                    .filter(Boolean)
                                    .join("\n\n")
                                    .trim();
                                var message = void 0;
                                if (combinedReply) {
                                    var _d = (0, session_utils_js_1.loadSessionEntry)(p.sessionKey), latestStorePath = _d.storePath, latestEntry = _d.entry;
                                    var sessionId = (_b = (_a = latestEntry === null || latestEntry === void 0 ? void 0 : latestEntry.sessionId) !== null && _a !== void 0 ? _a : entry === null || entry === void 0 ? void 0 : entry.sessionId) !== null && _b !== void 0 ? _b : clientRunId;
                                    var appended = appendAssistantTranscriptMessage({
                                        message: combinedReply,
                                        sessionId: sessionId,
                                        storePath: latestStorePath,
                                        sessionFile: latestEntry === null || latestEntry === void 0 ? void 0 : latestEntry.sessionFile,
                                        createIfMissing: true,
                                    });
                                    if (appended.ok) {
                                        message = appended.message;
                                    }
                                    else {
                                        context.logGateway.warn("webchat transcript append failed: ".concat((_c = appended.error) !== null && _c !== void 0 ? _c : "unknown error"));
                                        var now_1 = Date.now();
                                        message = {
                                            role: "assistant",
                                            content: [{ type: "text", text: combinedReply }],
                                            timestamp: now_1,
                                            stopReason: "injected",
                                            usage: { input: 0, output: 0, totalTokens: 0 },
                                        };
                                    }
                                }
                                broadcastChatFinal({
                                    context: context,
                                    runId: clientRunId,
                                    sessionKey: p.sessionKey,
                                    message: message,
                                });
                            }
                            context.dedupe.set("chat:".concat(clientRunId), {
                                ts: Date.now(),
                                ok: true,
                                payload: { runId: clientRunId, status: "ok" },
                            });
                        })
                            .catch(function (err) {
                            var error = (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, String(err));
                            context.dedupe.set("chat:".concat(clientRunId), {
                                ts: Date.now(),
                                ok: false,
                                payload: {
                                    runId: clientRunId,
                                    status: "error",
                                    summary: String(err),
                                },
                                error: error,
                            });
                            broadcastChatError({
                                context: context,
                                runId: clientRunId,
                                sessionKey: p.sessionKey,
                                errorMessage: String(err),
                            });
                        })
                            .finally(function () {
                            context.chatAbortControllers.delete(clientRunId);
                        });
                    }
                    catch (err) {
                        error = (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, String(err));
                        payload = {
                            runId: clientRunId,
                            status: "error",
                            summary: String(err),
                        };
                        context.dedupe.set("chat:".concat(clientRunId), {
                            ts: Date.now(),
                            ok: false,
                            payload: payload,
                            error: error,
                        });
                        respond(false, payload, error, {
                            runId: clientRunId,
                            error: (0, ws_log_js_1.formatForLog)(err),
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); },
    "chat.inject": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, _c, storePath, entry, sessionId, transcriptPath, now, messageId, labelPrefix, messageBody, transcriptEntry, errMessage, chatPayload;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            if (!(0, index_js_1.validateChatInjectParams)(params)) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid chat.inject params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateChatInjectParams.errors))));
                return [2 /*return*/];
            }
            p = params;
            _c = (0, session_utils_js_1.loadSessionEntry)(p.sessionKey), storePath = _c.storePath, entry = _c.entry;
            sessionId = entry === null || entry === void 0 ? void 0 : entry.sessionId;
            if (!sessionId || !storePath) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "session not found"));
                return [2 /*return*/];
            }
            transcriptPath = (entry === null || entry === void 0 ? void 0 : entry.sessionFile)
                ? entry.sessionFile
                : node_path_1.default.join(node_path_1.default.dirname(storePath), "".concat(sessionId, ".jsonl"));
            if (!node_fs_1.default.existsSync(transcriptPath)) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "transcript file not found"));
                return [2 /*return*/];
            }
            now = Date.now();
            messageId = (0, node_crypto_1.randomUUID)().slice(0, 8);
            labelPrefix = p.label ? "[".concat(p.label, "]\n\n") : "";
            messageBody = {
                role: "assistant",
                content: [{ type: "text", text: "".concat(labelPrefix).concat(p.message) }],
                timestamp: now,
                stopReason: "injected",
                usage: { input: 0, output: 0, totalTokens: 0 },
            };
            transcriptEntry = {
                type: "message",
                id: messageId,
                timestamp: new Date(now).toISOString(),
                message: messageBody,
            };
            // Append to transcript file
            try {
                node_fs_1.default.appendFileSync(transcriptPath, "".concat(JSON.stringify(transcriptEntry), "\n"), "utf-8");
            }
            catch (err) {
                errMessage = err instanceof Error ? err.message : String(err);
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, "failed to write transcript: ".concat(errMessage)));
                return [2 /*return*/];
            }
            chatPayload = {
                runId: "inject-".concat(messageId),
                sessionKey: p.sessionKey,
                seq: 0,
                state: "final",
                message: transcriptEntry.message,
            };
            context.broadcast("chat", chatPayload);
            context.nodeSendToSession(p.sessionKey, "chat", chatPayload);
            respond(true, { ok: true, messageId: messageId });
            return [2 /*return*/];
        });
    }); },
};
