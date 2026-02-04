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
exports.buildConversationReference = buildConversationReference;
exports.renderReplyPayloadsToMessages = renderReplyPayloadsToMessages;
exports.sendMSTeamsMessages = sendMSTeamsMessages;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var errors_js_1 = require("./errors.js");
var file_consent_helpers_js_1 = require("./file-consent-helpers.js");
var graph_chat_js_1 = require("./graph-chat.js");
var graph_upload_js_1 = require("./graph-upload.js");
var media_helpers_js_1 = require("./media-helpers.js");
var runtime_js_1 = require("./runtime.js");
/**
 * MSTeams-specific media size limit (100MB).
 * Higher than the default because OneDrive upload handles large files well.
 */
var MSTEAMS_MAX_MEDIA_BYTES = 100 * 1024 * 1024;
/**
 * Threshold for large files that require FileConsentCard flow in personal chats.
 * Files >= 4MB use consent flow; smaller images can use inline base64.
 */
var FILE_CONSENT_THRESHOLD_BYTES = 4 * 1024 * 1024;
function normalizeConversationId(rawId) {
    var _a;
    return (_a = rawId.split(";")[0]) !== null && _a !== void 0 ? _a : rawId;
}
function buildConversationReference(ref) {
    var _a, _b, _c, _d, _e, _f, _g;
    var conversationId = (_b = (_a = ref.conversation) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.trim();
    if (!conversationId) {
        throw new Error("Invalid stored reference: missing conversation.id");
    }
    var agent = (_d = (_c = ref.agent) !== null && _c !== void 0 ? _c : ref.bot) !== null && _d !== void 0 ? _d : undefined;
    if (agent == null || !agent.id) {
        throw new Error("Invalid stored reference: missing agent.id");
    }
    var user = ref.user;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw new Error("Invalid stored reference: missing user.id");
    }
    return {
        activityId: ref.activityId,
        user: user,
        agent: agent,
        conversation: {
            id: normalizeConversationId(conversationId),
            conversationType: (_e = ref.conversation) === null || _e === void 0 ? void 0 : _e.conversationType,
            tenantId: (_f = ref.conversation) === null || _f === void 0 ? void 0 : _f.tenantId,
        },
        channelId: (_g = ref.channelId) !== null && _g !== void 0 ? _g : "msteams",
        serviceUrl: ref.serviceUrl,
        locale: ref.locale,
    };
}
function pushTextMessages(out, text, opts) {
    if (!text) {
        return;
    }
    if (opts.chunkText) {
        for (var _i = 0, _a = (0, runtime_js_1.getMSTeamsRuntime)().channel.text.chunkMarkdownTextWithMode(text, opts.chunkLimit, opts.chunkMode); _i < _a.length; _i++) {
            var chunk = _a[_i];
            var trimmed_1 = chunk.trim();
            if (!trimmed_1 || (0, plugin_sdk_1.isSilentReplyText)(trimmed_1, plugin_sdk_1.SILENT_REPLY_TOKEN)) {
                continue;
            }
            out.push({ text: trimmed_1 });
        }
        return;
    }
    var trimmed = text.trim();
    if (!trimmed || (0, plugin_sdk_1.isSilentReplyText)(trimmed, plugin_sdk_1.SILENT_REPLY_TOKEN)) {
        return;
    }
    out.push({ text: trimmed });
}
function clampMs(value, maxMs) {
    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }
    return Math.min(value, maxMs);
}
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function () {
        var delay;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    delay = Math.max(0, ms);
                    if (delay === 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) {
                            setTimeout(resolve, delay);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function resolveRetryOptions(retry) {
    var _a, _b, _c;
    if (!retry) {
        return { enabled: false, maxAttempts: 1, baseDelayMs: 0, maxDelayMs: 0 };
    }
    return {
        enabled: true,
        maxAttempts: Math.max(1, (_a = retry === null || retry === void 0 ? void 0 : retry.maxAttempts) !== null && _a !== void 0 ? _a : 3),
        baseDelayMs: Math.max(0, (_b = retry === null || retry === void 0 ? void 0 : retry.baseDelayMs) !== null && _b !== void 0 ? _b : 250),
        maxDelayMs: Math.max(0, (_c = retry === null || retry === void 0 ? void 0 : retry.maxDelayMs) !== null && _c !== void 0 ? _c : 10000),
    };
}
function computeRetryDelayMs(attempt, classification, opts) {
    if (classification.retryAfterMs != null) {
        return clampMs(classification.retryAfterMs, opts.maxDelayMs);
    }
    var exponential = opts.baseDelayMs * Math.pow(2, Math.max(0, attempt - 1));
    return clampMs(exponential, opts.maxDelayMs);
}
function shouldRetry(classification) {
    return classification.kind === "throttled" || classification.kind === "transient";
}
function renderReplyPayloadsToMessages(replies, options) {
    var _a, _b, _c, _d, _e;
    var out = [];
    var chunkLimit = Math.min(options.textChunkLimit, 4000);
    var chunkText = options.chunkText !== false;
    var chunkMode = (_a = options.chunkMode) !== null && _a !== void 0 ? _a : "length";
    var mediaMode = (_b = options.mediaMode) !== null && _b !== void 0 ? _b : "split";
    var tableMode = (_c = options.tableMode) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getMSTeamsRuntime)().channel.text.resolveMarkdownTableMode({
        cfg: (0, runtime_js_1.getMSTeamsRuntime)().config.loadConfig(),
        channel: "msteams",
    });
    for (var _i = 0, replies_1 = replies; _i < replies_1.length; _i++) {
        var payload = replies_1[_i];
        var mediaList = (_d = payload.mediaUrls) !== null && _d !== void 0 ? _d : (payload.mediaUrl ? [payload.mediaUrl] : []);
        var text = (0, runtime_js_1.getMSTeamsRuntime)().channel.text.convertMarkdownTables((_e = payload.text) !== null && _e !== void 0 ? _e : "", tableMode);
        if (!text && mediaList.length === 0) {
            continue;
        }
        if (mediaList.length === 0) {
            pushTextMessages(out, text, { chunkText: chunkText, chunkLimit: chunkLimit, chunkMode: chunkMode });
            continue;
        }
        if (mediaMode === "inline") {
            // For inline mode, combine text with first media as attachment
            var firstMedia = mediaList[0];
            if (firstMedia) {
                out.push({ text: text || undefined, mediaUrl: firstMedia });
                // Additional media URLs as separate messages
                for (var i = 1; i < mediaList.length; i++) {
                    if (mediaList[i]) {
                        out.push({ mediaUrl: mediaList[i] });
                    }
                }
            }
            else {
                pushTextMessages(out, text, { chunkText: chunkText, chunkLimit: chunkLimit, chunkMode: chunkMode });
            }
            continue;
        }
        // mediaMode === "split"
        pushTextMessages(out, text, { chunkText: chunkText, chunkLimit: chunkLimit, chunkMode: chunkMode });
        for (var _f = 0, mediaList_1 = mediaList; _f < mediaList_1.length; _f++) {
            var mediaUrl = mediaList_1[_f];
            if (!mediaUrl) {
                continue;
            }
            out.push({ mediaUrl: mediaUrl });
        }
    }
    return out;
}
function buildActivity(msg, conversationRef, tokenProvider, sharePointSiteId, mediaMaxBytes) {
    return __awaiter(this, void 0, void 0, function () {
        var activity, contentUrl, contentType, fileName, maxBytes, media, conversationType, isPersonal, isImage, conversationId, consentActivity, chatId, uploaded, driveItem, fileCardAttachment, uploaded, fileLink, base64;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    activity = { type: "message" };
                    if (msg.text) {
                        activity.text = msg.text;
                    }
                    if (!msg.mediaUrl) return [3 /*break*/, 10];
                    contentUrl = msg.mediaUrl;
                    return [4 /*yield*/, (0, media_helpers_js_1.getMimeType)(msg.mediaUrl)];
                case 1:
                    contentType = _j.sent();
                    return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)(msg.mediaUrl)];
                case 2:
                    fileName = _j.sent();
                    if (!(0, media_helpers_js_1.isLocalPath)(msg.mediaUrl)) return [3 /*break*/, 9];
                    maxBytes = mediaMaxBytes !== null && mediaMaxBytes !== void 0 ? mediaMaxBytes : MSTEAMS_MAX_MEDIA_BYTES;
                    return [4 /*yield*/, (0, plugin_sdk_1.loadWebMedia)(msg.mediaUrl, maxBytes)];
                case 3:
                    media = _j.sent();
                    contentType = (_a = media.contentType) !== null && _a !== void 0 ? _a : contentType;
                    fileName = (_b = media.fileName) !== null && _b !== void 0 ? _b : fileName;
                    conversationType = (_d = (_c = conversationRef.conversation) === null || _c === void 0 ? void 0 : _c.conversationType) === null || _d === void 0 ? void 0 : _d.toLowerCase();
                    isPersonal = conversationType === "personal";
                    isImage = (_e = contentType === null || contentType === void 0 ? void 0 : contentType.startsWith("image/")) !== null && _e !== void 0 ? _e : false;
                    if ((0, file_consent_helpers_js_1.requiresFileConsent)({
                        conversationType: conversationType,
                        contentType: contentType,
                        bufferSize: media.buffer.length,
                        thresholdBytes: FILE_CONSENT_THRESHOLD_BYTES,
                    })) {
                        conversationId = (_g = (_f = conversationRef.conversation) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : "unknown";
                        consentActivity = (0, file_consent_helpers_js_1.prepareFileConsentActivity)({
                            media: { buffer: media.buffer, filename: fileName, contentType: contentType },
                            conversationId: conversationId,
                            description: msg.text || undefined,
                        }).activity;
                        // Return the consent activity (caller sends it)
                        return [2 /*return*/, consentActivity];
                    }
                    if (!(!isPersonal && !isImage && tokenProvider && sharePointSiteId)) return [3 /*break*/, 6];
                    chatId = (_h = conversationRef.conversation) === null || _h === void 0 ? void 0 : _h.id;
                    return [4 /*yield*/, (0, graph_upload_js_1.uploadAndShareSharePoint)({
                            buffer: media.buffer,
                            filename: fileName,
                            contentType: contentType,
                            tokenProvider: tokenProvider,
                            siteId: sharePointSiteId,
                            chatId: chatId !== null && chatId !== void 0 ? chatId : undefined,
                            usePerUserSharing: conversationType === "groupchat",
                        })];
                case 4:
                    uploaded = _j.sent();
                    return [4 /*yield*/, (0, graph_upload_js_1.getDriveItemProperties)({
                            siteId: sharePointSiteId,
                            itemId: uploaded.itemId,
                            tokenProvider: tokenProvider,
                        })];
                case 5:
                    driveItem = _j.sent();
                    fileCardAttachment = (0, graph_chat_js_1.buildTeamsFileInfoCard)(driveItem);
                    activity.attachments = [fileCardAttachment];
                    return [2 /*return*/, activity];
                case 6:
                    if (!(!isPersonal && !isImage && tokenProvider)) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, graph_upload_js_1.uploadAndShareOneDrive)({
                            buffer: media.buffer,
                            filename: fileName,
                            contentType: contentType,
                            tokenProvider: tokenProvider,
                        })];
                case 7:
                    uploaded = _j.sent();
                    fileLink = "\uD83D\uDCCE [".concat(uploaded.name, "](").concat(uploaded.shareUrl, ")");
                    activity.text = msg.text ? "".concat(msg.text, "\n\n").concat(fileLink) : fileLink;
                    return [2 /*return*/, activity];
                case 8:
                    base64 = media.buffer.toString("base64");
                    contentUrl = "data:".concat(media.contentType, ";base64,").concat(base64);
                    _j.label = 9;
                case 9:
                    activity.attachments = [
                        {
                            name: fileName,
                            contentType: contentType,
                            contentUrl: contentUrl,
                        },
                    ];
                    _j.label = 10;
                case 10: return [2 /*return*/, activity];
            }
        });
    });
}
function sendMSTeamsMessages(params) {
    return __awaiter(this, void 0, void 0, function () {
        var messages, retryOptions, sendWithRetry, ctx_1, messageIds_1, _loop_1, _i, _a, _b, idx, message, baseRef, proactiveRef, messageIds;
        var _this = this;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    messages = params.messages.filter(function (m) { return (m.text && m.text.trim().length > 0) || m.mediaUrl; });
                    if (messages.length === 0) {
                        return [2 /*return*/, []];
                    }
                    retryOptions = resolveRetryOptions(params.retry);
                    sendWithRetry = function (sendOnce, meta) { return __awaiter(_this, void 0, void 0, function () {
                        var attempt, err_1, classification, canRetry, delayMs, nextAttempt;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!!retryOptions.enabled) return [3 /*break*/, 2];
                                    return [4 /*yield*/, sendOnce()];
                                case 1: return [2 /*return*/, _b.sent()];
                                case 2:
                                    attempt = 1;
                                    _b.label = 3;
                                case 3:
                                    if (!true) return [3 /*break*/, 9];
                                    _b.label = 4;
                                case 4:
                                    _b.trys.push([4, 6, , 8]);
                                    return [4 /*yield*/, sendOnce()];
                                case 5: return [2 /*return*/, _b.sent()];
                                case 6:
                                    err_1 = _b.sent();
                                    classification = (0, errors_js_1.classifyMSTeamsSendError)(err_1);
                                    canRetry = attempt < retryOptions.maxAttempts && shouldRetry(classification);
                                    if (!canRetry) {
                                        throw err_1;
                                    }
                                    delayMs = computeRetryDelayMs(attempt, classification, retryOptions);
                                    nextAttempt = attempt + 1;
                                    (_a = params.onRetry) === null || _a === void 0 ? void 0 : _a.call(params, {
                                        messageIndex: meta.messageIndex,
                                        messageCount: meta.messageCount,
                                        nextAttempt: nextAttempt,
                                        maxAttempts: retryOptions.maxAttempts,
                                        delayMs: delayMs,
                                        classification: classification,
                                    });
                                    return [4 /*yield*/, sleep(delayMs)];
                                case 7:
                                    _b.sent();
                                    attempt = nextAttempt;
                                    return [3 /*break*/, 8];
                                case 8: return [3 /*break*/, 3];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!(params.replyStyle === "thread")) return [3 /*break*/, 5];
                    ctx_1 = params.context;
                    if (!ctx_1) {
                        throw new Error("Missing context for replyStyle=thread");
                    }
                    messageIds_1 = [];
                    _loop_1 = function (idx, message) {
                        var response;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, sendWithRetry(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    _b = (_a = ctx_1).sendActivity;
                                                    return [4 /*yield*/, buildActivity(message, params.conversationRef, params.tokenProvider, params.sharePointSiteId, params.mediaMaxBytes)];
                                                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                                                case 2: return [2 /*return*/, _c.sent()];
                                            }
                                        });
                                    }); }, { messageIndex: idx, messageCount: messages.length })];
                                case 1:
                                    response = _e.sent();
                                    messageIds_1.push((_c = (0, media_helpers_js_1.extractMessageId)(response)) !== null && _c !== void 0 ? _c : "unknown");
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = messages.entries();
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    _b = _a[_i], idx = _b[0], message = _b[1];
                    return [5 /*yield**/, _loop_1(idx, message)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, messageIds_1];
                case 5:
                    baseRef = buildConversationReference(params.conversationRef);
                    proactiveRef = __assign(__assign({}, baseRef), { activityId: undefined });
                    messageIds = [];
                    return [4 /*yield*/, params.adapter.continueConversation(params.appId, proactiveRef, function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                            var _loop_2, _i, _a, _b, idx, message;
                            var _this = this;
                            var _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _loop_2 = function (idx, message) {
                                            var response;
                                            return __generator(this, function (_e) {
                                                switch (_e.label) {
                                                    case 0: return [4 /*yield*/, sendWithRetry(function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var _a, _b;
                                                            return __generator(this, function (_c) {
                                                                switch (_c.label) {
                                                                    case 0:
                                                                        _b = (_a = ctx).sendActivity;
                                                                        return [4 /*yield*/, buildActivity(message, params.conversationRef, params.tokenProvider, params.sharePointSiteId, params.mediaMaxBytes)];
                                                                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                                                                    case 2: return [2 /*return*/, _c.sent()];
                                                                }
                                                            });
                                                        }); }, { messageIndex: idx, messageCount: messages.length })];
                                                    case 1:
                                                        response = _e.sent();
                                                        messageIds.push((_c = (0, media_helpers_js_1.extractMessageId)(response)) !== null && _c !== void 0 ? _c : "unknown");
                                                        return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _i = 0, _a = messages.entries();
                                        _d.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                        _b = _a[_i], idx = _b[0], message = _b[1];
                                        return [5 /*yield**/, _loop_2(idx, message)];
                                    case 2:
                                        _d.sent();
                                        _d.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    _d.sent();
                    return [2 /*return*/, messageIds];
            }
        });
    });
}
