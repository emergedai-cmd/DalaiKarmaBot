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
exports.sendMessageMSTeams = sendMessageMSTeams;
exports.sendPollMSTeams = sendPollMSTeams;
exports.sendAdaptiveCardMSTeams = sendAdaptiveCardMSTeams;
exports.listMSTeamsConversations = listMSTeamsConversations;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var conversation_store_fs_js_1 = require("./conversation-store-fs.js");
var errors_js_1 = require("./errors.js");
var file_consent_helpers_js_1 = require("./file-consent-helpers.js");
var graph_chat_js_1 = require("./graph-chat.js");
var graph_upload_js_1 = require("./graph-upload.js");
var media_helpers_js_1 = require("./media-helpers.js");
var messenger_js_1 = require("./messenger.js");
var polls_js_1 = require("./polls.js");
var runtime_js_1 = require("./runtime.js");
var send_context_js_1 = require("./send-context.js");
/** Threshold for large files that require FileConsentCard flow in personal chats */
var FILE_CONSENT_THRESHOLD_BYTES = 4 * 1024 * 1024; // 4MB
/**
 * MSTeams-specific media size limit (100MB).
 * Higher than the default because OneDrive upload handles large files well.
 */
var MSTEAMS_MAX_MEDIA_BYTES = 100 * 1024 * 1024;
/**
 * Send a message to a Teams conversation or user.
 *
 * Uses the stored ConversationReference from previous interactions.
 * The bot must have received at least one message from the conversation
 * before proactive messaging works.
 *
 * File handling by conversation type:
 * - Personal (1:1) chats: small images (<4MB) use base64, large files and non-images use FileConsentCard
 * - Group chats / channels: files are uploaded to OneDrive and shared via link
 */
function sendMessageMSTeams(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, to, text, mediaUrl, tableMode, messageText, ctx, adapter, appId, conversationId, ref, log, conversationType, tokenProvider, sharePointSiteId, mediaMaxBytes, media, isLargeFile, isImage, fallbackFileName, fileName, _a, activity_1, uploadId, baseRef, proactiveRef, messageId_1, err_1, classification, hint, status_1, base64, finalMediaUrl, base64, finalMediaUrl, uploaded_1, driveItem, fileCardAttachment, activity_2, baseRef_1, proactiveRef_1, messageId_2, uploaded, fileLink, activity_3, baseRef, proactiveRef, messageId_3, err_2, classification, hint, status_2;
        var _this = this;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    cfg = params.cfg, to = params.to, text = params.text, mediaUrl = params.mediaUrl;
                    tableMode = (0, runtime_js_1.getMSTeamsRuntime)().channel.text.resolveMarkdownTableMode({
                        cfg: cfg,
                        channel: "msteams",
                    });
                    messageText = (0, runtime_js_1.getMSTeamsRuntime)().channel.text.convertMarkdownTables(text !== null && text !== void 0 ? text : "", tableMode);
                    return [4 /*yield*/, (0, send_context_js_1.resolveMSTeamsSendContext)({ cfg: cfg, to: to })];
                case 1:
                    ctx = _f.sent();
                    adapter = ctx.adapter, appId = ctx.appId, conversationId = ctx.conversationId, ref = ctx.ref, log = ctx.log, conversationType = ctx.conversationType, tokenProvider = ctx.tokenProvider, sharePointSiteId = ctx.sharePointSiteId;
                    log.debug("sending proactive message", {
                        conversationId: conversationId,
                        conversationType: conversationType,
                        textLength: messageText.length,
                        hasMedia: Boolean(mediaUrl),
                    });
                    if (!mediaUrl) return [3 /*break*/, 17];
                    mediaMaxBytes = (_b = (0, plugin_sdk_1.resolveChannelMediaMaxBytes)({
                        cfg: cfg,
                        resolveChannelLimitMb: function (_a) {
                            var _b, _c;
                            var cfg = _a.cfg;
                            return (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.msteams) === null || _c === void 0 ? void 0 : _c.mediaMaxMb;
                        },
                    })) !== null && _b !== void 0 ? _b : MSTEAMS_MAX_MEDIA_BYTES;
                    return [4 /*yield*/, (0, plugin_sdk_1.loadWebMedia)(mediaUrl, mediaMaxBytes)];
                case 2:
                    media = _f.sent();
                    isLargeFile = media.buffer.length >= FILE_CONSENT_THRESHOLD_BYTES;
                    isImage = (_d = (_c = media.contentType) === null || _c === void 0 ? void 0 : _c.startsWith("image/")) !== null && _d !== void 0 ? _d : false;
                    return [4 /*yield*/, (0, media_helpers_js_1.extractFilename)(mediaUrl)];
                case 3:
                    fallbackFileName = _f.sent();
                    fileName = (_e = media.fileName) !== null && _e !== void 0 ? _e : fallbackFileName;
                    log.debug("processing media", {
                        fileName: fileName,
                        contentType: media.contentType,
                        size: media.buffer.length,
                        isLargeFile: isLargeFile,
                        isImage: isImage,
                        conversationType: conversationType,
                    });
                    if (!(0, file_consent_helpers_js_1.requiresFileConsent)({
                        conversationType: conversationType,
                        contentType: media.contentType,
                        bufferSize: media.buffer.length,
                        thresholdBytes: FILE_CONSENT_THRESHOLD_BYTES,
                    })) return [3 /*break*/, 8];
                    _a = (0, file_consent_helpers_js_1.prepareFileConsentActivity)({
                        media: { buffer: media.buffer, filename: fileName, contentType: media.contentType },
                        conversationId: conversationId,
                        description: messageText || undefined,
                    }), activity_1 = _a.activity, uploadId = _a.uploadId;
                    log.debug("sending file consent card", { uploadId: uploadId, fileName: fileName, size: media.buffer.length });
                    baseRef = (0, messenger_js_1.buildConversationReference)(ref);
                    proactiveRef = __assign(__assign({}, baseRef), { activityId: undefined });
                    messageId_1 = "unknown";
                    _f.label = 4;
                case 4:
                    _f.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, adapter.continueConversation(appId, proactiveRef, function (turnCtx) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, turnCtx.sendActivity(activity_1)];
                                    case 1:
                                        response = _b.sent();
                                        messageId_1 = (_a = (0, media_helpers_js_1.extractMessageId)(response)) !== null && _a !== void 0 ? _a : "unknown";
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 5:
                    _f.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _f.sent();
                    classification = (0, errors_js_1.classifyMSTeamsSendError)(err_1);
                    hint = (0, errors_js_1.formatMSTeamsSendErrorHint)(classification);
                    status_1 = classification.statusCode ? " (HTTP ".concat(classification.statusCode, ")") : "";
                    throw new Error("msteams consent card send failed".concat(status_1, ": ").concat((0, errors_js_1.formatUnknownError)(err_1)).concat(hint ? " (".concat(hint, ")") : ""), { cause: err_1 });
                case 7:
                    log.info("sent file consent card", { conversationId: conversationId, messageId: messageId_1, uploadId: uploadId });
                    return [2 /*return*/, {
                            messageId: messageId_1,
                            conversationId: conversationId,
                            pendingUploadId: uploadId,
                        }];
                case 8:
                    // Personal chat with small image: use base64 (only works for images)
                    if (conversationType === "personal") {
                        base64 = media.buffer.toString("base64");
                        finalMediaUrl = "data:".concat(media.contentType, ";base64,").concat(base64);
                        return [2 /*return*/, sendTextWithMedia(ctx, messageText, finalMediaUrl)];
                    }
                    if (isImage && !sharePointSiteId) {
                        base64 = media.buffer.toString("base64");
                        finalMediaUrl = "data:".concat(media.contentType, ";base64,").concat(base64);
                        return [2 /*return*/, sendTextWithMedia(ctx, messageText, finalMediaUrl)];
                    }
                    _f.label = 9;
                case 9:
                    _f.trys.push([9, 16, , 17]);
                    if (!sharePointSiteId) return [3 /*break*/, 13];
                    // Use SharePoint upload + Graph API for native file card
                    log.debug("uploading to SharePoint for native file card", {
                        fileName: fileName,
                        conversationType: conversationType,
                        siteId: sharePointSiteId,
                    });
                    return [4 /*yield*/, (0, graph_upload_js_1.uploadAndShareSharePoint)({
                            buffer: media.buffer,
                            filename: fileName,
                            contentType: media.contentType,
                            tokenProvider: tokenProvider,
                            siteId: sharePointSiteId,
                            chatId: conversationId,
                            usePerUserSharing: conversationType === "groupChat",
                        })];
                case 10:
                    uploaded_1 = _f.sent();
                    log.debug("SharePoint upload complete", {
                        itemId: uploaded_1.itemId,
                        shareUrl: uploaded_1.shareUrl,
                    });
                    return [4 /*yield*/, (0, graph_upload_js_1.getDriveItemProperties)({
                            siteId: sharePointSiteId,
                            itemId: uploaded_1.itemId,
                            tokenProvider: tokenProvider,
                        })];
                case 11:
                    driveItem = _f.sent();
                    log.debug("driveItem properties retrieved", {
                        eTag: driveItem.eTag,
                        webDavUrl: driveItem.webDavUrl,
                    });
                    fileCardAttachment = (0, graph_chat_js_1.buildTeamsFileInfoCard)(driveItem);
                    activity_2 = {
                        type: "message",
                        text: messageText || undefined,
                        attachments: [fileCardAttachment],
                    };
                    baseRef_1 = (0, messenger_js_1.buildConversationReference)(ref);
                    proactiveRef_1 = __assign(__assign({}, baseRef_1), { activityId: undefined });
                    messageId_2 = "unknown";
                    return [4 /*yield*/, adapter.continueConversation(appId, proactiveRef_1, function (turnCtx) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, turnCtx.sendActivity(activity_2)];
                                    case 1:
                                        response = _b.sent();
                                        messageId_2 = (_a = (0, media_helpers_js_1.extractMessageId)(response)) !== null && _a !== void 0 ? _a : "unknown";
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 12:
                    _f.sent();
                    log.info("sent native file card", {
                        conversationId: conversationId,
                        messageId: messageId_2,
                        fileName: driveItem.name,
                    });
                    return [2 /*return*/, { messageId: messageId_2, conversationId: conversationId }];
                case 13:
                    // Fallback: no SharePoint site configured, use OneDrive with markdown link
                    log.debug("uploading to OneDrive (no SharePoint site configured)", {
                        fileName: fileName,
                        conversationType: conversationType,
                    });
                    return [4 /*yield*/, (0, graph_upload_js_1.uploadAndShareOneDrive)({
                            buffer: media.buffer,
                            filename: fileName,
                            contentType: media.contentType,
                            tokenProvider: tokenProvider,
                        })];
                case 14:
                    uploaded = _f.sent();
                    log.debug("OneDrive upload complete", {
                        itemId: uploaded.itemId,
                        shareUrl: uploaded.shareUrl,
                    });
                    fileLink = "\uD83D\uDCCE [".concat(uploaded.name, "](").concat(uploaded.shareUrl, ")");
                    activity_3 = {
                        type: "message",
                        text: messageText ? "".concat(messageText, "\n\n").concat(fileLink) : fileLink,
                    };
                    baseRef = (0, messenger_js_1.buildConversationReference)(ref);
                    proactiveRef = __assign(__assign({}, baseRef), { activityId: undefined });
                    messageId_3 = "unknown";
                    return [4 /*yield*/, adapter.continueConversation(appId, proactiveRef, function (turnCtx) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, turnCtx.sendActivity(activity_3)];
                                    case 1:
                                        response = _b.sent();
                                        messageId_3 = (_a = (0, media_helpers_js_1.extractMessageId)(response)) !== null && _a !== void 0 ? _a : "unknown";
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 15:
                    _f.sent();
                    log.info("sent message with OneDrive file link", {
                        conversationId: conversationId,
                        messageId: messageId_3,
                        shareUrl: uploaded.shareUrl,
                    });
                    return [2 /*return*/, { messageId: messageId_3, conversationId: conversationId }];
                case 16:
                    err_2 = _f.sent();
                    classification = (0, errors_js_1.classifyMSTeamsSendError)(err_2);
                    hint = (0, errors_js_1.formatMSTeamsSendErrorHint)(classification);
                    status_2 = classification.statusCode ? " (HTTP ".concat(classification.statusCode, ")") : "";
                    throw new Error("msteams file send failed".concat(status_2, ": ").concat((0, errors_js_1.formatUnknownError)(err_2)).concat(hint ? " (".concat(hint, ")") : ""), { cause: err_2 });
                case 17: 
                // No media: send text only
                return [2 /*return*/, sendTextWithMedia(ctx, messageText, undefined)];
            }
        });
    });
}
/**
 * Send a text message with optional base64 media URL.
 */
function sendTextWithMedia(ctx, text, mediaUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var adapter, appId, conversationId, ref, log, tokenProvider, sharePointSiteId, mediaMaxBytes, messageIds, err_3, classification, hint, status_3, messageId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    adapter = ctx.adapter, appId = ctx.appId, conversationId = ctx.conversationId, ref = ctx.ref, log = ctx.log, tokenProvider = ctx.tokenProvider, sharePointSiteId = ctx.sharePointSiteId, mediaMaxBytes = ctx.mediaMaxBytes;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, messenger_js_1.sendMSTeamsMessages)({
                            replyStyle: "top-level",
                            adapter: adapter,
                            appId: appId,
                            conversationRef: ref,
                            messages: [{ text: text || undefined, mediaUrl: mediaUrl }],
                            retry: {},
                            onRetry: function (event) {
                                log.debug("retrying send", __assign({ conversationId: conversationId }, event));
                            },
                            tokenProvider: tokenProvider,
                            sharePointSiteId: sharePointSiteId,
                            mediaMaxBytes: mediaMaxBytes,
                        })];
                case 2:
                    messageIds = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _b.sent();
                    classification = (0, errors_js_1.classifyMSTeamsSendError)(err_3);
                    hint = (0, errors_js_1.formatMSTeamsSendErrorHint)(classification);
                    status_3 = classification.statusCode ? " (HTTP ".concat(classification.statusCode, ")") : "";
                    throw new Error("msteams send failed".concat(status_3, ": ").concat((0, errors_js_1.formatUnknownError)(err_3)).concat(hint ? " (".concat(hint, ")") : ""), { cause: err_3 });
                case 4:
                    messageId = (_a = messageIds[0]) !== null && _a !== void 0 ? _a : "unknown";
                    log.info("sent proactive message", { conversationId: conversationId, messageId: messageId });
                    return [2 /*return*/, {
                            messageId: messageId,
                            conversationId: conversationId,
                        }];
            }
        });
    });
}
/**
 * Send a poll (Adaptive Card) to a Teams conversation or user.
 */
function sendPollMSTeams(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, to, question, options, maxSelections, _a, adapter, appId, conversationId, ref, log, pollCard, activity, baseRef, proactiveRef, messageId, err_4, classification, hint, status_4;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = params.cfg, to = params.to, question = params.question, options = params.options, maxSelections = params.maxSelections;
                    return [4 /*yield*/, (0, send_context_js_1.resolveMSTeamsSendContext)({
                            cfg: cfg,
                            to: to,
                        })];
                case 1:
                    _a = _b.sent(), adapter = _a.adapter, appId = _a.appId, conversationId = _a.conversationId, ref = _a.ref, log = _a.log;
                    pollCard = (0, polls_js_1.buildMSTeamsPollCard)({
                        question: question,
                        options: options,
                        maxSelections: maxSelections,
                    });
                    log.debug("sending poll", {
                        conversationId: conversationId,
                        pollId: pollCard.pollId,
                        optionCount: pollCard.options.length,
                    });
                    activity = {
                        type: "message",
                        attachments: [
                            {
                                contentType: "application/vnd.microsoft.card.adaptive",
                                content: pollCard.card,
                            },
                        ],
                    };
                    baseRef = (0, messenger_js_1.buildConversationReference)(ref);
                    proactiveRef = __assign(__assign({}, baseRef), { activityId: undefined });
                    messageId = "unknown";
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, adapter.continueConversation(appId, proactiveRef, function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, ctx.sendActivity(activity)];
                                    case 1:
                                        response = _b.sent();
                                        messageId = (_a = (0, media_helpers_js_1.extractMessageId)(response)) !== null && _a !== void 0 ? _a : "unknown";
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _b.sent();
                    classification = (0, errors_js_1.classifyMSTeamsSendError)(err_4);
                    hint = (0, errors_js_1.formatMSTeamsSendErrorHint)(classification);
                    status_4 = classification.statusCode ? " (HTTP ".concat(classification.statusCode, ")") : "";
                    throw new Error("msteams poll send failed".concat(status_4, ": ").concat((0, errors_js_1.formatUnknownError)(err_4)).concat(hint ? " (".concat(hint, ")") : ""), { cause: err_4 });
                case 5:
                    log.info("sent poll", { conversationId: conversationId, pollId: pollCard.pollId, messageId: messageId });
                    return [2 /*return*/, {
                            pollId: pollCard.pollId,
                            messageId: messageId,
                            conversationId: conversationId,
                        }];
            }
        });
    });
}
/**
 * Send an arbitrary Adaptive Card to a Teams conversation or user.
 */
function sendAdaptiveCardMSTeams(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, to, card, _a, adapter, appId, conversationId, ref, log, activity, baseRef, proactiveRef, messageId, err_5, classification, hint, status_5;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = params.cfg, to = params.to, card = params.card;
                    return [4 /*yield*/, (0, send_context_js_1.resolveMSTeamsSendContext)({
                            cfg: cfg,
                            to: to,
                        })];
                case 1:
                    _a = _b.sent(), adapter = _a.adapter, appId = _a.appId, conversationId = _a.conversationId, ref = _a.ref, log = _a.log;
                    log.debug("sending adaptive card", {
                        conversationId: conversationId,
                        cardType: card.type,
                        cardVersion: card.version,
                    });
                    activity = {
                        type: "message",
                        attachments: [
                            {
                                contentType: "application/vnd.microsoft.card.adaptive",
                                content: card,
                            },
                        ],
                    };
                    baseRef = (0, messenger_js_1.buildConversationReference)(ref);
                    proactiveRef = __assign(__assign({}, baseRef), { activityId: undefined });
                    messageId = "unknown";
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, adapter.continueConversation(appId, proactiveRef, function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, ctx.sendActivity(activity)];
                                    case 1:
                                        response = _b.sent();
                                        messageId = (_a = (0, media_helpers_js_1.extractMessageId)(response)) !== null && _a !== void 0 ? _a : "unknown";
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_5 = _b.sent();
                    classification = (0, errors_js_1.classifyMSTeamsSendError)(err_5);
                    hint = (0, errors_js_1.formatMSTeamsSendErrorHint)(classification);
                    status_5 = classification.statusCode ? " (HTTP ".concat(classification.statusCode, ")") : "";
                    throw new Error("msteams card send failed".concat(status_5, ": ").concat((0, errors_js_1.formatUnknownError)(err_5)).concat(hint ? " (".concat(hint, ")") : ""), { cause: err_5 });
                case 5:
                    log.info("sent adaptive card", { conversationId: conversationId, messageId: messageId });
                    return [2 /*return*/, {
                            messageId: messageId,
                            conversationId: conversationId,
                        }];
            }
        });
    });
}
/**
 * List all known conversation references (for debugging/CLI).
 */
function listMSTeamsConversations() {
    return __awaiter(this, void 0, void 0, function () {
        var store, all;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store = (0, conversation_store_fs_js_1.createMSTeamsConversationStoreFs)();
                    return [4 /*yield*/, store.list()];
                case 1:
                    all = _a.sent();
                    return [2 /*return*/, all.map(function (_a) {
                            var _b, _c;
                            var conversationId = _a.conversationId, reference = _a.reference;
                            return ({
                                conversationId: conversationId,
                                userName: (_b = reference.user) === null || _b === void 0 ? void 0 : _b.name,
                                conversationType: (_c = reference.conversation) === null || _c === void 0 ? void 0 : _c.conversationType,
                            });
                        })];
            }
        });
    });
}
