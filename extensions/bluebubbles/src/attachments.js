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
exports.downloadBlueBubblesAttachment = downloadBlueBubblesAttachment;
exports.sendBlueBubblesAttachment = sendBlueBubblesAttachment;
var node_crypto_1 = require("node:crypto");
var node_path_1 = require("node:path");
var accounts_js_1 = require("./accounts.js");
var send_js_1 = require("./send.js");
var targets_js_1 = require("./targets.js");
var types_js_1 = require("./types.js");
var DEFAULT_ATTACHMENT_MAX_BYTES = 8 * 1024 * 1024;
var AUDIO_MIME_MP3 = new Set(["audio/mpeg", "audio/mp3"]);
var AUDIO_MIME_CAF = new Set(["audio/x-caf", "audio/caf"]);
function sanitizeFilename(input, fallback) {
    var _a;
    var trimmed = (_a = input === null || input === void 0 ? void 0 : input.trim()) !== null && _a !== void 0 ? _a : "";
    var base = trimmed ? node_path_1.default.basename(trimmed) : "";
    return base || fallback;
}
function ensureExtension(filename, extension, fallbackBase) {
    var currentExt = node_path_1.default.extname(filename);
    if (currentExt.toLowerCase() === extension) {
        return filename;
    }
    var base = currentExt ? filename.slice(0, -currentExt.length) : filename;
    return "".concat(base || fallbackBase).concat(extension);
}
function resolveVoiceInfo(filename, contentType) {
    var normalizedType = contentType === null || contentType === void 0 ? void 0 : contentType.trim().toLowerCase();
    var extension = node_path_1.default.extname(filename).toLowerCase();
    var isMp3 = extension === ".mp3" || (normalizedType ? AUDIO_MIME_MP3.has(normalizedType) : false);
    var isCaf = extension === ".caf" || (normalizedType ? AUDIO_MIME_CAF.has(normalizedType) : false);
    var isAudio = isMp3 || isCaf || Boolean(normalizedType === null || normalizedType === void 0 ? void 0 : normalizedType.startsWith("audio/"));
    return { isAudio: isAudio, isMp3: isMp3, isCaf: isCaf };
}
function resolveAccount(params) {
    var _a, _b, _c, _d, _e;
    var account = (0, accounts_js_1.resolveBlueBubblesAccount)({
        cfg: (_a = params.cfg) !== null && _a !== void 0 ? _a : {},
        accountId: params.accountId,
    });
    var baseUrl = ((_b = params.serverUrl) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = account.config.serverUrl) === null || _c === void 0 ? void 0 : _c.trim());
    var password = ((_d = params.password) === null || _d === void 0 ? void 0 : _d.trim()) || ((_e = account.config.password) === null || _e === void 0 ? void 0 : _e.trim());
    if (!baseUrl) {
        throw new Error("BlueBubbles serverUrl is required");
    }
    if (!password) {
        throw new Error("BlueBubbles password is required");
    }
    return { baseUrl: baseUrl, password: password };
}
function downloadBlueBubblesAttachment(attachment_1) {
    return __awaiter(this, arguments, void 0, function (attachment, opts) {
        var guid, _a, baseUrl, password, url, res, errorText, contentType, buf, _b, maxBytes;
        var _c, _d, _e;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    guid = (_c = attachment.guid) === null || _c === void 0 ? void 0 : _c.trim();
                    if (!guid) {
                        throw new Error("BlueBubbles attachment guid is required");
                    }
                    _a = resolveAccount(opts), baseUrl = _a.baseUrl, password = _a.password;
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/attachment/".concat(encodeURIComponent(guid), "/download"),
                        password: password,
                    });
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, { method: "GET" }, opts.timeoutMs)];
                case 1:
                    res = _f.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    errorText = _f.sent();
                    throw new Error("BlueBubbles attachment download failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3:
                    contentType = (_d = res.headers.get("content-type")) !== null && _d !== void 0 ? _d : undefined;
                    _b = Uint8Array.bind;
                    return [4 /*yield*/, res.arrayBuffer()];
                case 4:
                    buf = new (_b.apply(Uint8Array, [void 0, _f.sent()]))();
                    maxBytes = typeof opts.maxBytes === "number" ? opts.maxBytes : DEFAULT_ATTACHMENT_MAX_BYTES;
                    if (buf.byteLength > maxBytes) {
                        throw new Error("BlueBubbles attachment too large (".concat(buf.byteLength, " bytes)"));
                    }
                    return [2 /*return*/, { buffer: buf, contentType: (_e = contentType !== null && contentType !== void 0 ? contentType : attachment.mimeType) !== null && _e !== void 0 ? _e : undefined }];
            }
        });
    });
}
function resolveSendTarget(raw) {
    var parsed = (0, targets_js_1.parseBlueBubblesTarget)(raw);
    if (parsed.kind === "handle") {
        return {
            kind: "handle",
            address: (0, targets_js_1.normalizeBlueBubblesHandle)(parsed.to),
            service: parsed.service,
        };
    }
    if (parsed.kind === "chat_id") {
        return { kind: "chat_id", chatId: parsed.chatId };
    }
    if (parsed.kind === "chat_guid") {
        return { kind: "chat_guid", chatGuid: parsed.chatGuid };
    }
    return { kind: "chat_identifier", chatIdentifier: parsed.chatIdentifier };
}
function extractMessageId(payload) {
    if (!payload || typeof payload !== "object") {
        return "unknown";
    }
    var record = payload;
    var data = record.data && typeof record.data === "object"
        ? record.data
        : null;
    var candidates = [
        record.messageId,
        record.guid,
        record.id,
        data === null || data === void 0 ? void 0 : data.messageId,
        data === null || data === void 0 ? void 0 : data.guid,
        data === null || data === void 0 ? void 0 : data.id,
    ];
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        if (typeof candidate === "string" && candidate.trim()) {
            return candidate.trim();
        }
        if (typeof candidate === "number" && Number.isFinite(candidate)) {
            return String(candidate);
        }
    }
    return "unknown";
}
/**
 * Send an attachment via BlueBubbles API.
 * Supports sending media files (images, videos, audio, documents) to a chat.
 * When asVoice is true, expects MP3/CAF audio and marks it as an iMessage voice memo.
 */
function sendBlueBubblesAttachment(params) {
    return __awaiter(this, void 0, void 0, function () {
        var to, caption, replyToMessageGuid, replyToPartIndex, asVoice, _a, opts, buffer, filename, contentType, wantsVoice, fallbackName, _b, baseUrl, password, isAudioMessage, voiceInfo, target, chatGuid, url, boundary, parts, encoder, addField, addFile, trimmedReplyTo, totalLength, body, offset, _i, parts_1, part, res, errorText, responseBody, parsed;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    to = params.to, caption = params.caption, replyToMessageGuid = params.replyToMessageGuid, replyToPartIndex = params.replyToPartIndex, asVoice = params.asVoice, _a = params.opts, opts = _a === void 0 ? {} : _a;
                    buffer = params.buffer, filename = params.filename, contentType = params.contentType;
                    wantsVoice = asVoice === true;
                    fallbackName = wantsVoice ? "Audio Message" : "attachment";
                    filename = sanitizeFilename(filename, fallbackName);
                    contentType = (contentType === null || contentType === void 0 ? void 0 : contentType.trim()) || undefined;
                    _b = resolveAccount(opts), baseUrl = _b.baseUrl, password = _b.password;
                    isAudioMessage = wantsVoice;
                    if (isAudioMessage) {
                        voiceInfo = resolveVoiceInfo(filename, contentType);
                        if (!voiceInfo.isAudio) {
                            throw new Error("BlueBubbles voice messages require audio media (mp3 or caf).");
                        }
                        if (voiceInfo.isMp3) {
                            filename = ensureExtension(filename, ".mp3", fallbackName);
                            contentType = contentType !== null && contentType !== void 0 ? contentType : "audio/mpeg";
                        }
                        else if (voiceInfo.isCaf) {
                            filename = ensureExtension(filename, ".caf", fallbackName);
                            contentType = contentType !== null && contentType !== void 0 ? contentType : "audio/x-caf";
                        }
                        else {
                            throw new Error("BlueBubbles voice messages require mp3 or caf audio (convert before sending).");
                        }
                    }
                    target = resolveSendTarget(to);
                    return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({
                            baseUrl: baseUrl,
                            password: password,
                            timeoutMs: opts.timeoutMs,
                            target: target,
                        })];
                case 1:
                    chatGuid = _d.sent();
                    if (!chatGuid) {
                        throw new Error("BlueBubbles attachment send failed: chatGuid not found for target. Use a chat_guid target or ensure the chat exists.");
                    }
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/message/attachment",
                        password: password,
                    });
                    boundary = "----BlueBubblesFormBoundary".concat(node_crypto_1.default.randomUUID().replace(/-/g, ""));
                    parts = [];
                    encoder = new TextEncoder();
                    addField = function (name, value) {
                        parts.push(encoder.encode("--".concat(boundary, "\r\n")));
                        parts.push(encoder.encode("Content-Disposition: form-data; name=\"".concat(name, "\"\r\n\r\n")));
                        parts.push(encoder.encode("".concat(value, "\r\n")));
                    };
                    addFile = function (name, fileBuffer, fileName, mimeType) {
                        parts.push(encoder.encode("--".concat(boundary, "\r\n")));
                        parts.push(encoder.encode("Content-Disposition: form-data; name=\"".concat(name, "\"; filename=\"").concat(fileName, "\"\r\n")));
                        parts.push(encoder.encode("Content-Type: ".concat(mimeType !== null && mimeType !== void 0 ? mimeType : "application/octet-stream", "\r\n\r\n")));
                        parts.push(fileBuffer);
                        parts.push(encoder.encode("\r\n"));
                    };
                    // Add required fields
                    addFile("attachment", buffer, filename, contentType);
                    addField("chatGuid", chatGuid);
                    addField("name", filename);
                    addField("tempGuid", "temp-".concat(Date.now(), "-").concat(node_crypto_1.default.randomUUID().slice(0, 8)));
                    addField("method", "private-api");
                    // Add isAudioMessage flag for voice memos
                    if (isAudioMessage) {
                        addField("isAudioMessage", "true");
                    }
                    trimmedReplyTo = replyToMessageGuid === null || replyToMessageGuid === void 0 ? void 0 : replyToMessageGuid.trim();
                    if (trimmedReplyTo) {
                        addField("selectedMessageGuid", trimmedReplyTo);
                        addField("partIndex", typeof replyToPartIndex === "number" ? String(replyToPartIndex) : "0");
                    }
                    // Add optional caption
                    if (caption) {
                        addField("message", caption);
                        addField("text", caption);
                        addField("caption", caption);
                    }
                    // Close the multipart body
                    parts.push(encoder.encode("--".concat(boundary, "--\r\n")));
                    totalLength = parts.reduce(function (acc, part) { return acc + part.length; }, 0);
                    body = new Uint8Array(totalLength);
                    offset = 0;
                    for (_i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                        part = parts_1[_i];
                        body.set(part, offset);
                        offset += part.length;
                    }
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "multipart/form-data; boundary=".concat(boundary),
                            },
                            body: body,
                        }, (_c = opts.timeoutMs) !== null && _c !== void 0 ? _c : 60000)];
                case 2:
                    res = _d.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text()];
                case 3:
                    errorText = _d.sent();
                    throw new Error("BlueBubbles attachment send failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 4: return [4 /*yield*/, res.text()];
                case 5:
                    responseBody = _d.sent();
                    if (!responseBody) {
                        return [2 /*return*/, { messageId: "ok" }];
                    }
                    try {
                        parsed = JSON.parse(responseBody);
                        return [2 /*return*/, { messageId: extractMessageId(parsed) }];
                    }
                    catch (_e) {
                        return [2 /*return*/, { messageId: "ok" }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
