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
exports.resolveMatrixRoomId = void 0;
exports.sendMessageMatrix = sendMessageMatrix;
exports.sendPollMatrix = sendPollMatrix;
exports.sendTypingMatrix = sendTypingMatrix;
exports.sendReadReceiptMatrix = sendReadReceiptMatrix;
exports.reactMatrixMessage = reactMatrixMessage;
var runtime_js_1 = require("../runtime.js");
var poll_types_js_1 = require("./poll-types.js");
var client_js_1 = require("./send/client.js");
var formatting_js_1 = require("./send/formatting.js");
var media_js_1 = require("./send/media.js");
var targets_js_1 = require("./send/targets.js");
var types_js_1 = require("./send/types.js");
var MATRIX_TEXT_LIMIT = 4000;
var getCore = function () { return (0, runtime_js_1.getMatrixRuntime)(); };
var targets_js_2 = require("./send/targets.js");
Object.defineProperty(exports, "resolveMatrixRoomId", { enumerable: true, get: function () { return targets_js_2.resolveMatrixRoomId; } });
function sendMessageMatrix(to_1, message_1) {
    return __awaiter(this, arguments, void 0, function (to, message, opts) {
        var trimmedMessage, _a, client, stopOnDone, roomId_1, cfg, tableMode, convertedMessage, textLimit, chunkLimit, chunkMode, chunks, threadId, relation, sendContent, lastMessageId, maxBytes, media, uploaded, durationMs, baseMsgType, useVoice, msgtype, isImage, imageInfo, _b, firstChunk, rest, body, content, eventId, textChunks, followupRelation, _i, textChunks_1, chunk, text, followup, followupEventId, _c, _d, chunk, text, content, eventId;
        var _this = this;
        var _e, _f;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    trimmedMessage = (_e = message === null || message === void 0 ? void 0 : message.trim()) !== null && _e !== void 0 ? _e : "";
                    if (!trimmedMessage && !opts.mediaUrl) {
                        throw new Error("Matrix send requires text or media");
                    }
                    return [4 /*yield*/, (0, client_js_1.resolveMatrixClient)({
                            client: opts.client,
                            timeoutMs: opts.timeoutMs,
                        })];
                case 1:
                    _a = _g.sent(), client = _a.client, stopOnDone = _a.stopOnDone;
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, , 20, 21]);
                    return [4 /*yield*/, (0, targets_js_1.resolveMatrixRoomId)(client, to)];
                case 3:
                    roomId_1 = _g.sent();
                    cfg = getCore().config.loadConfig();
                    tableMode = getCore().channel.text.resolveMarkdownTableMode({
                        cfg: cfg,
                        channel: "matrix",
                        accountId: opts.accountId,
                    });
                    convertedMessage = getCore().channel.text.convertMarkdownTables(trimmedMessage, tableMode);
                    textLimit = getCore().channel.text.resolveTextChunkLimit(cfg, "matrix");
                    chunkLimit = Math.min(textLimit, MATRIX_TEXT_LIMIT);
                    chunkMode = getCore().channel.text.resolveChunkMode(cfg, "matrix", opts.accountId);
                    chunks = getCore().channel.text.chunkMarkdownTextWithMode(convertedMessage, chunkLimit, chunkMode);
                    threadId = (0, targets_js_1.normalizeThreadId)(opts.threadId);
                    relation = threadId
                        ? (0, formatting_js_1.buildThreadRelation)(threadId, opts.replyToId)
                        : (0, formatting_js_1.buildReplyRelation)(opts.replyToId);
                    sendContent = function (content) { return __awaiter(_this, void 0, void 0, function () {
                        var eventId;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.sendMessage(roomId_1, content)];
                                case 1:
                                    eventId = _a.sent();
                                    return [2 /*return*/, eventId];
                            }
                        });
                    }); };
                    lastMessageId = "";
                    if (!opts.mediaUrl) return [3 /*break*/, 15];
                    maxBytes = (0, client_js_1.resolveMediaMaxBytes)();
                    return [4 /*yield*/, getCore().media.loadWebMedia(opts.mediaUrl, maxBytes)];
                case 4:
                    media = _g.sent();
                    return [4 /*yield*/, (0, media_js_1.uploadMediaMaybeEncrypted)(client, roomId_1, media.buffer, {
                            contentType: media.contentType,
                            filename: media.fileName,
                        })];
                case 5:
                    uploaded = _g.sent();
                    return [4 /*yield*/, (0, media_js_1.resolveMediaDurationMs)({
                            buffer: media.buffer,
                            contentType: media.contentType,
                            fileName: media.fileName,
                            kind: media.kind,
                        })];
                case 6:
                    durationMs = _g.sent();
                    baseMsgType = (0, formatting_js_1.resolveMatrixMsgType)(media.contentType, media.fileName);
                    useVoice = (0, formatting_js_1.resolveMatrixVoiceDecision)({
                        wantsVoice: opts.audioAsVoice === true,
                        contentType: media.contentType,
                        fileName: media.fileName,
                    }).useVoice;
                    msgtype = useVoice ? types_js_1.MsgType.Audio : baseMsgType;
                    isImage = msgtype === types_js_1.MsgType.Image;
                    if (!isImage) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, media_js_1.prepareImageInfo)({ buffer: media.buffer, client: client })];
                case 7:
                    _b = _g.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = undefined;
                    _g.label = 9;
                case 9:
                    imageInfo = _b;
                    firstChunk = chunks[0], rest = chunks.slice(1);
                    body = useVoice ? "Voice message" : ((_f = firstChunk !== null && firstChunk !== void 0 ? firstChunk : media.fileName) !== null && _f !== void 0 ? _f : "(file)");
                    content = (0, media_js_1.buildMediaContent)({
                        msgtype: msgtype,
                        body: body,
                        url: uploaded.url,
                        file: uploaded.file,
                        filename: media.fileName,
                        mimetype: media.contentType,
                        size: media.buffer.byteLength,
                        durationMs: durationMs,
                        relation: relation,
                        isVoice: useVoice,
                        imageInfo: imageInfo,
                    });
                    return [4 /*yield*/, sendContent(content)];
                case 10:
                    eventId = _g.sent();
                    lastMessageId = eventId !== null && eventId !== void 0 ? eventId : lastMessageId;
                    textChunks = useVoice ? chunks : rest;
                    followupRelation = threadId ? relation : undefined;
                    _i = 0, textChunks_1 = textChunks;
                    _g.label = 11;
                case 11:
                    if (!(_i < textChunks_1.length)) return [3 /*break*/, 14];
                    chunk = textChunks_1[_i];
                    text = chunk.trim();
                    if (!text) {
                        return [3 /*break*/, 13];
                    }
                    followup = (0, formatting_js_1.buildTextContent)(text, followupRelation);
                    return [4 /*yield*/, sendContent(followup)];
                case 12:
                    followupEventId = _g.sent();
                    lastMessageId = followupEventId !== null && followupEventId !== void 0 ? followupEventId : lastMessageId;
                    _g.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 11];
                case 14: return [3 /*break*/, 19];
                case 15:
                    _c = 0, _d = chunks.length ? chunks : [""];
                    _g.label = 16;
                case 16:
                    if (!(_c < _d.length)) return [3 /*break*/, 19];
                    chunk = _d[_c];
                    text = chunk.trim();
                    if (!text) {
                        return [3 /*break*/, 18];
                    }
                    content = (0, formatting_js_1.buildTextContent)(text, relation);
                    return [4 /*yield*/, sendContent(content)];
                case 17:
                    eventId = _g.sent();
                    lastMessageId = eventId !== null && eventId !== void 0 ? eventId : lastMessageId;
                    _g.label = 18;
                case 18:
                    _c++;
                    return [3 /*break*/, 16];
                case 19: return [2 /*return*/, {
                        messageId: lastMessageId || "unknown",
                        roomId: roomId_1,
                    }];
                case 20:
                    if (stopOnDone) {
                        client.stop();
                    }
                    return [7 /*endfinally*/];
                case 21: return [2 /*return*/];
            }
        });
    });
}
function sendPollMatrix(to_1, poll_1) {
    return __awaiter(this, arguments, void 0, function (to, poll, opts) {
        var _a, client, stopOnDone, roomId, pollContent, threadId, pollPayload, eventId;
        var _b, _c;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!((_b = poll.question) === null || _b === void 0 ? void 0 : _b.trim())) {
                        throw new Error("Matrix poll requires a question");
                    }
                    if (!((_c = poll.options) === null || _c === void 0 ? void 0 : _c.length)) {
                        throw new Error("Matrix poll requires options");
                    }
                    return [4 /*yield*/, (0, client_js_1.resolveMatrixClient)({
                            client: opts.client,
                            timeoutMs: opts.timeoutMs,
                        })];
                case 1:
                    _a = _d.sent(), client = _a.client, stopOnDone = _a.stopOnDone;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, (0, targets_js_1.resolveMatrixRoomId)(client, to)];
                case 3:
                    roomId = _d.sent();
                    pollContent = (0, poll_types_js_1.buildPollStartContent)(poll);
                    threadId = (0, targets_js_1.normalizeThreadId)(opts.threadId);
                    pollPayload = threadId
                        ? __assign(__assign({}, pollContent), { "m.relates_to": (0, formatting_js_1.buildThreadRelation)(threadId) }) : pollContent;
                    return [4 /*yield*/, client.sendEvent(roomId, poll_types_js_1.M_POLL_START, pollPayload)];
                case 4:
                    eventId = _d.sent();
                    return [2 /*return*/, {
                            eventId: eventId !== null && eventId !== void 0 ? eventId : "unknown",
                            roomId: roomId,
                        }];
                case 5:
                    if (stopOnDone) {
                        client.stop();
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function sendTypingMatrix(roomId, typing, timeoutMs, client) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, resolved, stopOnDone, resolvedTimeoutMs;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, client_js_1.resolveMatrixClient)({
                        client: client,
                        timeoutMs: timeoutMs,
                    })];
                case 1:
                    _a = _b.sent(), resolved = _a.client, stopOnDone = _a.stopOnDone;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 4, 5]);
                    resolvedTimeoutMs = typeof timeoutMs === "number" ? timeoutMs : 30000;
                    return [4 /*yield*/, resolved.setTyping(roomId, typing, resolvedTimeoutMs)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    if (stopOnDone) {
                        resolved.stop();
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function sendReadReceiptMatrix(roomId, eventId, client) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, resolved, stopOnDone, resolvedRoom;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(eventId === null || eventId === void 0 ? void 0 : eventId.trim())) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, client_js_1.resolveMatrixClient)({
                            client: client,
                        })];
                case 1:
                    _a = _b.sent(), resolved = _a.client, stopOnDone = _a.stopOnDone;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, (0, targets_js_1.resolveMatrixRoomId)(resolved, roomId)];
                case 3:
                    resolvedRoom = _b.sent();
                    return [4 /*yield*/, resolved.sendReadReceipt(resolvedRoom, eventId.trim())];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    if (stopOnDone) {
                        resolved.stop();
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function reactMatrixMessage(roomId, messageId, emoji, client) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, resolved, stopOnDone, resolvedRoom, reaction;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!emoji.trim()) {
                        throw new Error("Matrix reaction requires an emoji");
                    }
                    return [4 /*yield*/, (0, client_js_1.resolveMatrixClient)({
                            client: client,
                        })];
                case 1:
                    _a = _b.sent(), resolved = _a.client, stopOnDone = _a.stopOnDone;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, (0, targets_js_1.resolveMatrixRoomId)(resolved, roomId)];
                case 3:
                    resolvedRoom = _b.sent();
                    reaction = {
                        "m.relates_to": {
                            rel_type: types_js_1.RelationType.Annotation,
                            event_id: messageId,
                            key: emoji,
                        },
                    };
                    return [4 /*yield*/, resolved.sendEvent(resolvedRoom, types_js_1.EventType.Reaction, reaction)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    if (stopOnDone) {
                        resolved.stop();
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
