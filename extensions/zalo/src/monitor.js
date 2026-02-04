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
exports.registerZaloWebhookTarget = registerZaloWebhookTarget;
exports.handleZaloWebhookRequest = handleZaloWebhookRequest;
exports.monitorZaloProvider = monitorZaloProvider;
var api_js_1 = require("./api.js");
var proxy_js_1 = require("./proxy.js");
var runtime_js_1 = require("./runtime.js");
var ZALO_TEXT_LIMIT = 2000;
var DEFAULT_MEDIA_MAX_MB = 5;
function logVerbose(core, runtime, message) {
    var _a;
    if (core.logging.shouldLogVerbose()) {
        (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[zalo] ".concat(message));
    }
}
function isSenderAllowed(senderId, allowFrom) {
    if (allowFrom.includes("*")) {
        return true;
    }
    var normalizedSenderId = senderId.toLowerCase();
    return allowFrom.some(function (entry) {
        var normalized = entry.toLowerCase().replace(/^(zalo|zl):/i, "");
        return normalized === normalizedSenderId;
    });
}
function readJsonBody(req, maxBytes) {
    return __awaiter(this, void 0, void 0, function () {
        var chunks, total;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chunks = [];
                    total = 0;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            req.on("data", function (chunk) {
                                total += chunk.length;
                                if (total > maxBytes) {
                                    resolve({ ok: false, error: "payload too large" });
                                    req.destroy();
                                    return;
                                }
                                chunks.push(chunk);
                            });
                            req.on("end", function () {
                                try {
                                    var raw = Buffer.concat(chunks).toString("utf8");
                                    if (!raw.trim()) {
                                        resolve({ ok: false, error: "empty payload" });
                                        return;
                                    }
                                    resolve({ ok: true, value: JSON.parse(raw) });
                                }
                                catch (err) {
                                    resolve({ ok: false, error: err instanceof Error ? err.message : String(err) });
                                }
                            });
                            req.on("error", function (err) {
                                resolve({ ok: false, error: err instanceof Error ? err.message : String(err) });
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var webhookTargets = new Map();
function normalizeWebhookPath(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return "/";
    }
    var withSlash = trimmed.startsWith("/") ? trimmed : "/".concat(trimmed);
    if (withSlash.length > 1 && withSlash.endsWith("/")) {
        return withSlash.slice(0, -1);
    }
    return withSlash;
}
function resolveWebhookPath(webhookPath, webhookUrl) {
    var trimmedPath = webhookPath === null || webhookPath === void 0 ? void 0 : webhookPath.trim();
    if (trimmedPath) {
        return normalizeWebhookPath(trimmedPath);
    }
    if (webhookUrl === null || webhookUrl === void 0 ? void 0 : webhookUrl.trim()) {
        try {
            var parsed = new URL(webhookUrl);
            return normalizeWebhookPath(parsed.pathname || "/");
        }
        catch (_a) {
            return null;
        }
    }
    return null;
}
function registerZaloWebhookTarget(target) {
    var _a;
    var key = normalizeWebhookPath(target.path);
    var normalizedTarget = __assign(__assign({}, target), { path: key });
    var existing = (_a = webhookTargets.get(key)) !== null && _a !== void 0 ? _a : [];
    var next = __spreadArray(__spreadArray([], existing, true), [normalizedTarget], false);
    webhookTargets.set(key, next);
    return function () {
        var _a;
        var updated = ((_a = webhookTargets.get(key)) !== null && _a !== void 0 ? _a : []).filter(function (entry) { return entry !== normalizedTarget; });
        if (updated.length > 0) {
            webhookTargets.set(key, updated);
        }
        else {
            webhookTargets.delete(key);
        }
    };
}
function handleZaloWebhookRequest(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, path, targets, headerToken, target, body, raw, record, update;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", "http://localhost");
                    path = normalizeWebhookPath(url.pathname);
                    targets = webhookTargets.get(path);
                    if (!targets || targets.length === 0) {
                        return [2 /*return*/, false];
                    }
                    if (req.method !== "POST") {
                        res.statusCode = 405;
                        res.setHeader("Allow", "POST");
                        res.end("Method Not Allowed");
                        return [2 /*return*/, true];
                    }
                    headerToken = String((_b = req.headers["x-bot-api-secret-token"]) !== null && _b !== void 0 ? _b : "");
                    target = targets.find(function (entry) { return entry.secret === headerToken; });
                    if (!target) {
                        res.statusCode = 401;
                        res.end("unauthorized");
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, readJsonBody(req, 1024 * 1024)];
                case 1:
                    body = _f.sent();
                    if (!body.ok) {
                        res.statusCode = body.error === "payload too large" ? 413 : 400;
                        res.end((_c = body.error) !== null && _c !== void 0 ? _c : "invalid payload");
                        return [2 /*return*/, true];
                    }
                    raw = body.value;
                    record = raw && typeof raw === "object" ? raw : null;
                    update = record && record.ok === true && record.result
                        ? record.result
                        : ((_d = record) !== null && _d !== void 0 ? _d : undefined);
                    if (!(update === null || update === void 0 ? void 0 : update.event_name)) {
                        res.statusCode = 400;
                        res.end("invalid payload");
                        return [2 /*return*/, true];
                    }
                    (_e = target.statusSink) === null || _e === void 0 ? void 0 : _e.call(target, { lastInboundAt: Date.now() });
                    processUpdate(update, target.token, target.account, target.config, target.runtime, target.core, target.mediaMaxMb, target.statusSink, target.fetcher).catch(function (err) {
                        var _a, _b;
                        (_b = (_a = target.runtime).error) === null || _b === void 0 ? void 0 : _b.call(_a, "[".concat(target.account.accountId, "] Zalo webhook failed: ").concat(String(err)));
                    });
                    res.statusCode = 200;
                    res.end("ok");
                    return [2 /*return*/, true];
            }
        });
    });
}
function startPollingLoop(params) {
    var _this = this;
    var token = params.token, account = params.account, config = params.config, runtime = params.runtime, core = params.core, abortSignal = params.abortSignal, isStopped = params.isStopped, mediaMaxMb = params.mediaMaxMb, statusSink = params.statusSink, fetcher = params.fetcher;
    var pollTimeout = 30;
    var poll = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isStopped() || abortSignal.aborted) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 9]);
                    return [4 /*yield*/, (0, api_js_1.getUpdates)(token, { timeout: pollTimeout }, fetcher)];
                case 2:
                    response = _a.sent();
                    if (!(response.ok && response.result)) return [3 /*break*/, 4];
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastInboundAt: Date.now() });
                    return [4 /*yield*/, processUpdate(response.result, token, account, config, runtime, core, mediaMaxMb, statusSink, fetcher)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 9];
                case 5:
                    err_1 = _a.sent();
                    if (!(err_1 instanceof api_js_1.ZaloApiError && err_1.isPollingTimeout)) return [3 /*break*/, 6];
                    return [3 /*break*/, 8];
                case 6:
                    if (!(!isStopped() && !abortSignal.aborted)) return [3 /*break*/, 8];
                    console.error("[".concat(account.accountId, "] Zalo polling error:"), err_1);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 9];
                case 9:
                    if (!isStopped() && !abortSignal.aborted) {
                        setImmediate(poll);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    void poll();
}
function processUpdate(update, token, account, config, runtime, core, mediaMaxMb, statusSink, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        var event_name, message, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    event_name = update.event_name, message = update.message;
                    if (!message) {
                        return [2 /*return*/];
                    }
                    _a = event_name;
                    switch (_a) {
                        case "message.text.received": return [3 /*break*/, 1];
                        case "message.image.received": return [3 /*break*/, 3];
                        case "message.sticker.received": return [3 /*break*/, 5];
                        case "message.unsupported.received": return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, handleTextMessage(message, token, account, config, runtime, core, statusSink, fetcher)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 3: return [4 /*yield*/, handleImageMessage(message, token, account, config, runtime, core, mediaMaxMb, statusSink, fetcher)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5:
                    console.log("[".concat(account.accountId, "] Received sticker from ").concat(message.from.id));
                    return [3 /*break*/, 7];
                case 6:
                    console.log("[".concat(account.accountId, "] Received unsupported message type from ").concat(message.from.id));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function handleTextMessage(message, token, account, config, runtime, core, statusSink, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        var text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    text = message.text;
                    if (!(text === null || text === void 0 ? void 0 : text.trim())) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, processMessageWithPipeline({
                            message: message,
                            token: token,
                            account: account,
                            config: config,
                            runtime: runtime,
                            core: core,
                            text: text,
                            mediaPath: undefined,
                            mediaType: undefined,
                            statusSink: statusSink,
                            fetcher: fetcher,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleImageMessage(message, token, account, config, runtime, core, mediaMaxMb, statusSink, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        var photo, caption, mediaPath, mediaType, maxBytes, fetched, saved, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    photo = message.photo, caption = message.caption;
                    if (!photo) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    maxBytes = mediaMaxMb * 1024 * 1024;
                    return [4 /*yield*/, core.channel.media.fetchRemoteMedia({ url: photo })];
                case 2:
                    fetched = _a.sent();
                    return [4 /*yield*/, core.channel.media.saveMediaBuffer(fetched.buffer, fetched.contentType, "inbound", maxBytes)];
                case 3:
                    saved = _a.sent();
                    mediaPath = saved.path;
                    mediaType = saved.contentType;
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    console.error("[".concat(account.accountId, "] Failed to download Zalo image:"), err_2);
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, processMessageWithPipeline({
                        message: message,
                        token: token,
                        account: account,
                        config: config,
                        runtime: runtime,
                        core: core,
                        text: caption,
                        mediaPath: mediaPath,
                        mediaType: mediaType,
                        statusSink: statusSink,
                        fetcher: fetcher,
                    })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function processMessageWithPipeline(params) {
    return __awaiter(this, void 0, void 0, function () {
        var message, token, account, config, runtime, core, text, mediaPath, mediaType, statusSink, fetcher, from, chat, message_id, date, isGroup, chatId, senderId, senderName, dmPolicy, configAllowFrom, rawBody, shouldComputeAuth, storeAllowFrom, _a, effectiveAllowFrom, useAccessGroups, senderAllowedForCommands, commandAuthorized, allowed, _b, code, created, err_3, route, fromLabel, storePath, envelopeOptions, previousTimestamp, body, ctxPayload, tableMode;
        var _this = this;
        var _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    message = params.message, token = params.token, account = params.account, config = params.config, runtime = params.runtime, core = params.core, text = params.text, mediaPath = params.mediaPath, mediaType = params.mediaType, statusSink = params.statusSink, fetcher = params.fetcher;
                    from = message.from, chat = message.chat, message_id = message.message_id, date = message.date;
                    isGroup = chat.chat_type === "GROUP";
                    chatId = chat.id;
                    senderId = from.id;
                    senderName = from.name;
                    dmPolicy = (_c = account.config.dmPolicy) !== null && _c !== void 0 ? _c : "pairing";
                    configAllowFrom = ((_d = account.config.allowFrom) !== null && _d !== void 0 ? _d : []).map(function (v) { return String(v); });
                    rawBody = (text === null || text === void 0 ? void 0 : text.trim()) || (mediaPath ? "<media:image>" : "");
                    shouldComputeAuth = core.channel.commands.shouldComputeCommandAuthorized(rawBody, config);
                    if (!(!isGroup && (dmPolicy !== "open" || shouldComputeAuth))) return [3 /*break*/, 2];
                    return [4 /*yield*/, core.channel.pairing.readAllowFromStore("zalo").catch(function () { return []; })];
                case 1:
                    _a = _h.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = [];
                    _h.label = 3;
                case 3:
                    storeAllowFrom = _a;
                    effectiveAllowFrom = __spreadArray(__spreadArray([], configAllowFrom, true), storeAllowFrom, true);
                    useAccessGroups = ((_e = config.commands) === null || _e === void 0 ? void 0 : _e.useAccessGroups) !== false;
                    senderAllowedForCommands = isSenderAllowed(senderId, effectiveAllowFrom);
                    commandAuthorized = shouldComputeAuth
                        ? core.channel.commands.resolveCommandAuthorizedFromAuthorizers({
                            useAccessGroups: useAccessGroups,
                            authorizers: [
                                { configured: effectiveAllowFrom.length > 0, allowed: senderAllowedForCommands },
                            ],
                        })
                        : undefined;
                    if (!!isGroup) return [3 /*break*/, 11];
                    if (dmPolicy === "disabled") {
                        logVerbose(core, runtime, "Blocked zalo DM from ".concat(senderId, " (dmPolicy=disabled)"));
                        return [2 /*return*/];
                    }
                    if (!(dmPolicy !== "open")) return [3 /*break*/, 11];
                    allowed = senderAllowedForCommands;
                    if (!!allowed) return [3 /*break*/, 11];
                    if (!(dmPolicy === "pairing")) return [3 /*break*/, 9];
                    return [4 /*yield*/, core.channel.pairing.upsertPairingRequest({
                            channel: "zalo",
                            id: senderId,
                            meta: { name: senderName !== null && senderName !== void 0 ? senderName : undefined },
                        })];
                case 4:
                    _b = _h.sent(), code = _b.code, created = _b.created;
                    if (!created) return [3 /*break*/, 8];
                    logVerbose(core, runtime, "zalo pairing request sender=".concat(senderId));
                    _h.label = 5;
                case 5:
                    _h.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, api_js_1.sendMessage)(token, {
                            chat_id: chatId,
                            text: core.channel.pairing.buildPairingReply({
                                channel: "zalo",
                                idLine: "Your Zalo user id: ".concat(senderId),
                                code: code,
                            }),
                        }, fetcher)];
                case 6:
                    _h.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 8];
                case 7:
                    err_3 = _h.sent();
                    logVerbose(core, runtime, "zalo pairing reply failed for ".concat(senderId, ": ").concat(String(err_3)));
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    logVerbose(core, runtime, "Blocked unauthorized zalo sender ".concat(senderId, " (dmPolicy=").concat(dmPolicy, ")"));
                    _h.label = 10;
                case 10: return [2 /*return*/];
                case 11:
                    route = core.channel.routing.resolveAgentRoute({
                        cfg: config,
                        channel: "zalo",
                        accountId: account.accountId,
                        peer: {
                            kind: isGroup ? "group" : "dm",
                            id: chatId,
                        },
                    });
                    if (isGroup &&
                        core.channel.commands.isControlCommandMessage(rawBody, config) &&
                        commandAuthorized !== true) {
                        logVerbose(core, runtime, "zalo: drop control command from unauthorized sender ".concat(senderId));
                        return [2 /*return*/];
                    }
                    fromLabel = isGroup ? "group:".concat(chatId) : senderName || "user:".concat(senderId);
                    storePath = core.channel.session.resolveStorePath((_f = config.session) === null || _f === void 0 ? void 0 : _f.store, {
                        agentId: route.agentId,
                    });
                    envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(config);
                    previousTimestamp = core.channel.session.readSessionUpdatedAt({
                        storePath: storePath,
                        sessionKey: route.sessionKey,
                    });
                    body = core.channel.reply.formatAgentEnvelope({
                        channel: "Zalo",
                        from: fromLabel,
                        timestamp: date ? date * 1000 : undefined,
                        previousTimestamp: previousTimestamp,
                        envelope: envelopeOptions,
                        body: rawBody,
                    });
                    ctxPayload = core.channel.reply.finalizeInboundContext({
                        Body: body,
                        RawBody: rawBody,
                        CommandBody: rawBody,
                        From: isGroup ? "zalo:group:".concat(chatId) : "zalo:".concat(senderId),
                        To: "zalo:".concat(chatId),
                        SessionKey: route.sessionKey,
                        AccountId: route.accountId,
                        ChatType: isGroup ? "group" : "direct",
                        ConversationLabel: fromLabel,
                        SenderName: senderName || undefined,
                        SenderId: senderId,
                        CommandAuthorized: commandAuthorized,
                        Provider: "zalo",
                        Surface: "zalo",
                        MessageSid: message_id,
                        MediaPath: mediaPath,
                        MediaType: mediaType,
                        MediaUrl: mediaPath,
                        OriginatingChannel: "zalo",
                        OriginatingTo: "zalo:".concat(chatId),
                    });
                    return [4 /*yield*/, core.channel.session.recordInboundSession({
                            storePath: storePath,
                            sessionKey: (_g = ctxPayload.SessionKey) !== null && _g !== void 0 ? _g : route.sessionKey,
                            ctx: ctxPayload,
                            onRecordError: function (err) {
                                var _a;
                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "zalo: failed updating session meta: ".concat(String(err)));
                            },
                        })];
                case 12:
                    _h.sent();
                    tableMode = core.channel.text.resolveMarkdownTableMode({
                        cfg: config,
                        channel: "zalo",
                        accountId: account.accountId,
                    });
                    return [4 /*yield*/, core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
                            ctx: ctxPayload,
                            cfg: config,
                            dispatcherOptions: {
                                deliver: function (payload) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, deliverZaloReply({
                                                    payload: payload,
                                                    token: token,
                                                    chatId: chatId,
                                                    runtime: runtime,
                                                    core: core,
                                                    config: config,
                                                    accountId: account.accountId,
                                                    statusSink: statusSink,
                                                    fetcher: fetcher,
                                                    tableMode: tableMode,
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                                onError: function (err, info) {
                                    var _a;
                                    (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[".concat(account.accountId, "] Zalo ").concat(info.kind, " reply failed: ").concat(String(err)));
                                },
                            },
                        })];
                case 13:
                    _h.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deliverZaloReply(params) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, token, chatId, runtime, core, config, accountId, statusSink, fetcher, tableMode, text, mediaList, first, _i, mediaList_1, mediaUrl, caption, err_4, chunkMode, chunks, _a, chunks_1, chunk, err_5;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    payload = params.payload, token = params.token, chatId = params.chatId, runtime = params.runtime, core = params.core, config = params.config, accountId = params.accountId, statusSink = params.statusSink, fetcher = params.fetcher;
                    tableMode = (_b = params.tableMode) !== null && _b !== void 0 ? _b : "code";
                    text = core.channel.text.convertMarkdownTables((_c = payload.text) !== null && _c !== void 0 ? _c : "", tableMode);
                    mediaList = ((_d = payload.mediaUrls) === null || _d === void 0 ? void 0 : _d.length)
                        ? payload.mediaUrls
                        : payload.mediaUrl
                            ? [payload.mediaUrl]
                            : [];
                    if (!(mediaList.length > 0)) return [3 /*break*/, 7];
                    first = true;
                    _i = 0, mediaList_1 = mediaList;
                    _g.label = 1;
                case 1:
                    if (!(_i < mediaList_1.length)) return [3 /*break*/, 6];
                    mediaUrl = mediaList_1[_i];
                    caption = first ? text : undefined;
                    first = false;
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, api_js_1.sendPhoto)(token, { chat_id: chatId, photo: mediaUrl, caption: caption }, fetcher)];
                case 3:
                    _g.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _g.sent();
                    (_e = runtime.error) === null || _e === void 0 ? void 0 : _e.call(runtime, "Zalo photo send failed: ".concat(String(err_4)));
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
                case 7:
                    if (!text) return [3 /*break*/, 13];
                    chunkMode = core.channel.text.resolveChunkMode(config, "zalo", accountId);
                    chunks = core.channel.text.chunkMarkdownTextWithMode(text, ZALO_TEXT_LIMIT, chunkMode);
                    _a = 0, chunks_1 = chunks;
                    _g.label = 8;
                case 8:
                    if (!(_a < chunks_1.length)) return [3 /*break*/, 13];
                    chunk = chunks_1[_a];
                    _g.label = 9;
                case 9:
                    _g.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, (0, api_js_1.sendMessage)(token, { chat_id: chatId, text: chunk }, fetcher)];
                case 10:
                    _g.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 12];
                case 11:
                    err_5 = _g.sent();
                    (_f = runtime.error) === null || _f === void 0 ? void 0 : _f.call(runtime, "Zalo message send failed: ".concat(String(err_5)));
                    return [3 /*break*/, 12];
                case 12:
                    _a++;
                    return [3 /*break*/, 8];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function monitorZaloProvider(options) {
    return __awaiter(this, void 0, void 0, function () {
        var token, account, config, runtime, abortSignal, useWebhook, webhookUrl, webhookSecret, webhookPath, statusSink, fetcherOverride, core, effectiveMediaMaxMb, fetcher, stopped, stopHandlers, stop, path, unregister, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    token = options.token, account = options.account, config = options.config, runtime = options.runtime, abortSignal = options.abortSignal, useWebhook = options.useWebhook, webhookUrl = options.webhookUrl, webhookSecret = options.webhookSecret, webhookPath = options.webhookPath, statusSink = options.statusSink, fetcherOverride = options.fetcher;
                    core = (0, runtime_js_1.getZaloRuntime)();
                    effectiveMediaMaxMb = (_b = account.config.mediaMaxMb) !== null && _b !== void 0 ? _b : DEFAULT_MEDIA_MAX_MB;
                    fetcher = fetcherOverride !== null && fetcherOverride !== void 0 ? fetcherOverride : (0, proxy_js_1.resolveZaloProxyFetch)(account.config.proxy);
                    stopped = false;
                    stopHandlers = [];
                    stop = function () {
                        stopped = true;
                        for (var _i = 0, stopHandlers_1 = stopHandlers; _i < stopHandlers_1.length; _i++) {
                            var handler = stopHandlers_1[_i];
                            handler();
                        }
                    };
                    if (!useWebhook) return [3 /*break*/, 2];
                    if (!webhookUrl || !webhookSecret) {
                        throw new Error("Zalo webhookUrl and webhookSecret are required for webhook mode");
                    }
                    if (!webhookUrl.startsWith("https://")) {
                        throw new Error("Zalo webhook URL must use HTTPS");
                    }
                    if (webhookSecret.length < 8 || webhookSecret.length > 256) {
                        throw new Error("Zalo webhook secret must be 8-256 characters");
                    }
                    path = resolveWebhookPath(webhookPath, webhookUrl);
                    if (!path) {
                        throw new Error("Zalo webhookPath could not be derived");
                    }
                    return [4 /*yield*/, (0, api_js_1.setWebhook)(token, { url: webhookUrl, secret_token: webhookSecret }, fetcher)];
                case 1:
                    _c.sent();
                    unregister = registerZaloWebhookTarget({
                        token: token,
                        account: account,
                        config: config,
                        runtime: runtime,
                        core: core,
                        path: path,
                        secret: webhookSecret,
                        statusSink: function (patch) { return statusSink === null || statusSink === void 0 ? void 0 : statusSink(patch); },
                        mediaMaxMb: effectiveMediaMaxMb,
                        fetcher: fetcher,
                    });
                    stopHandlers.push(unregister);
                    abortSignal.addEventListener("abort", function () {
                        void (0, api_js_1.deleteWebhook)(token, fetcher).catch(function () { });
                    }, { once: true });
                    return [2 /*return*/, { stop: stop }];
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, api_js_1.deleteWebhook)(token, fetcher)];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = _c.sent();
                    return [3 /*break*/, 5];
                case 5:
                    startPollingLoop({
                        token: token,
                        account: account,
                        config: config,
                        runtime: runtime,
                        core: core,
                        abortSignal: abortSignal,
                        isStopped: function () { return stopped; },
                        mediaMaxMb: effectiveMediaMaxMb,
                        statusSink: statusSink,
                        fetcher: fetcher,
                    });
                    return [2 /*return*/, { stop: stop }];
            }
        });
    });
}
