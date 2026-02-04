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
exports.sendBlueBubblesMedia = sendBlueBubblesMedia;
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var attachments_js_1 = require("./attachments.js");
var monitor_js_1 = require("./monitor.js");
var runtime_js_1 = require("./runtime.js");
var send_js_1 = require("./send.js");
var HTTP_URL_RE = /^https?:\/\//i;
var MB = 1024 * 1024;
function assertMediaWithinLimit(sizeBytes, maxBytes) {
    if (typeof maxBytes !== "number" || maxBytes <= 0) {
        return;
    }
    if (sizeBytes <= maxBytes) {
        return;
    }
    var maxLabel = (maxBytes / MB).toFixed(0);
    var sizeLabel = (sizeBytes / MB).toFixed(2);
    throw new Error("Media exceeds ".concat(maxLabel, "MB limit (got ").concat(sizeLabel, "MB)"));
}
function resolveLocalMediaPath(source) {
    if (!source.startsWith("file://")) {
        return source;
    }
    try {
        return (0, node_url_1.fileURLToPath)(source);
    }
    catch (_a) {
        throw new Error("Invalid file:// URL: ".concat(source));
    }
}
function resolveFilenameFromSource(source) {
    if (!source) {
        return undefined;
    }
    if (source.startsWith("file://")) {
        try {
            return node_path_1.default.basename((0, node_url_1.fileURLToPath)(source)) || undefined;
        }
        catch (_a) {
            return undefined;
        }
    }
    if (HTTP_URL_RE.test(source)) {
        try {
            return node_path_1.default.basename(new URL(source).pathname) || undefined;
        }
        catch (_b) {
            return undefined;
        }
    }
    var base = node_path_1.default.basename(source);
    return base || undefined;
}
function sendBlueBubblesMedia(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, to, mediaUrl, mediaPath, mediaBuffer, contentType, filename, caption, replyToId, accountId, asVoice, core, maxBytes, buffer, resolvedContentType, resolvedFilename, hint, detected, source, fetched, localPath, fs, stats, data, detected, replyToMessageGuid, attachmentResult, trimmedCaption;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = params.cfg, to = params.to, mediaUrl = params.mediaUrl, mediaPath = params.mediaPath, mediaBuffer = params.mediaBuffer, contentType = params.contentType, filename = params.filename, caption = params.caption, replyToId = params.replyToId, accountId = params.accountId, asVoice = params.asVoice;
                    core = (0, runtime_js_1.getBlueBubblesRuntime)();
                    maxBytes = (0, plugin_sdk_1.resolveChannelMediaMaxBytes)({
                        cfg: cfg,
                        resolveChannelLimitMb: function (_a) {
                            var _b, _c, _d, _e, _f, _g, _h;
                            var cfg = _a.cfg, accountId = _a.accountId;
                            return (_f = (_e = (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.bluebubbles) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d[accountId]) === null || _e === void 0 ? void 0 : _e.mediaMaxMb) !== null && _f !== void 0 ? _f : (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.bluebubbles) === null || _h === void 0 ? void 0 : _h.mediaMaxMb;
                        },
                        accountId: accountId,
                    });
                    resolvedContentType = contentType !== null && contentType !== void 0 ? contentType : undefined;
                    resolvedFilename = filename !== null && filename !== void 0 ? filename : undefined;
                    if (!mediaBuffer) return [3 /*break*/, 3];
                    assertMediaWithinLimit(mediaBuffer.byteLength, maxBytes);
                    buffer = mediaBuffer;
                    if (!!resolvedContentType) return [3 /*break*/, 2];
                    hint = mediaPath !== null && mediaPath !== void 0 ? mediaPath : mediaUrl;
                    return [4 /*yield*/, core.media.detectMime({
                            buffer: Buffer.isBuffer(mediaBuffer) ? mediaBuffer : Buffer.from(mediaBuffer),
                            filePath: hint,
                        })];
                case 1:
                    detected = _b.sent();
                    resolvedContentType = detected !== null && detected !== void 0 ? detected : undefined;
                    _b.label = 2;
                case 2:
                    if (!resolvedFilename) {
                        resolvedFilename = resolveFilenameFromSource(mediaPath !== null && mediaPath !== void 0 ? mediaPath : mediaUrl);
                    }
                    return [3 /*break*/, 12];
                case 3:
                    source = mediaPath !== null && mediaPath !== void 0 ? mediaPath : mediaUrl;
                    if (!source) {
                        throw new Error("BlueBubbles media delivery requires mediaUrl, mediaPath, or mediaBuffer.");
                    }
                    if (!HTTP_URL_RE.test(source)) return [3 /*break*/, 5];
                    return [4 /*yield*/, core.channel.media.fetchRemoteMedia({
                            url: source,
                            maxBytes: typeof maxBytes === "number" && maxBytes > 0 ? maxBytes : undefined,
                        })];
                case 4:
                    fetched = _b.sent();
                    buffer = fetched.buffer;
                    resolvedContentType = (_a = resolvedContentType !== null && resolvedContentType !== void 0 ? resolvedContentType : fetched.contentType) !== null && _a !== void 0 ? _a : undefined;
                    resolvedFilename = resolvedFilename !== null && resolvedFilename !== void 0 ? resolvedFilename : fetched.fileName;
                    return [3 /*break*/, 12];
                case 5:
                    localPath = resolveLocalMediaPath(source);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("node:fs/promises"); })];
                case 6:
                    fs = _b.sent();
                    if (!(typeof maxBytes === "number" && maxBytes > 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, fs.stat(localPath)];
                case 7:
                    stats = _b.sent();
                    assertMediaWithinLimit(stats.size, maxBytes);
                    _b.label = 8;
                case 8: return [4 /*yield*/, fs.readFile(localPath)];
                case 9:
                    data = _b.sent();
                    assertMediaWithinLimit(data.byteLength, maxBytes);
                    buffer = new Uint8Array(data);
                    if (!!resolvedContentType) return [3 /*break*/, 11];
                    return [4 /*yield*/, core.media.detectMime({
                            buffer: data,
                            filePath: localPath,
                        })];
                case 10:
                    detected = _b.sent();
                    resolvedContentType = detected !== null && detected !== void 0 ? detected : undefined;
                    _b.label = 11;
                case 11:
                    if (!resolvedFilename) {
                        resolvedFilename = resolveFilenameFromSource(localPath);
                    }
                    _b.label = 12;
                case 12:
                    replyToMessageGuid = (replyToId === null || replyToId === void 0 ? void 0 : replyToId.trim())
                        ? (0, monitor_js_1.resolveBlueBubblesMessageId)(replyToId.trim(), { requireKnownShortId: true })
                        : undefined;
                    return [4 /*yield*/, (0, attachments_js_1.sendBlueBubblesAttachment)({
                            to: to,
                            buffer: buffer,
                            filename: resolvedFilename !== null && resolvedFilename !== void 0 ? resolvedFilename : "attachment",
                            contentType: resolvedContentType !== null && resolvedContentType !== void 0 ? resolvedContentType : undefined,
                            replyToMessageGuid: replyToMessageGuid,
                            asVoice: asVoice,
                            opts: {
                                cfg: cfg,
                                accountId: accountId,
                            },
                        })];
                case 13:
                    attachmentResult = _b.sent();
                    trimmedCaption = caption === null || caption === void 0 ? void 0 : caption.trim();
                    if (!trimmedCaption) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)(to, trimmedCaption, {
                            cfg: cfg,
                            accountId: accountId,
                            replyToMessageGuid: replyToMessageGuid,
                        })];
                case 14:
                    _b.sent();
                    _b.label = 15;
                case 15: return [2 /*return*/, attachmentResult];
            }
        });
    });
}
