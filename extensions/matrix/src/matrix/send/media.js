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
exports.buildMatrixMediaInfo = buildMatrixMediaInfo;
exports.buildMediaContent = buildMediaContent;
exports.prepareImageInfo = prepareImageInfo;
exports.resolveMediaDurationMs = resolveMediaDurationMs;
exports.uploadMediaMaybeEncrypted = uploadMediaMaybeEncrypted;
var music_metadata_1 = require("music-metadata");
var runtime_js_1 = require("../../runtime.js");
var formatting_js_1 = require("./formatting.js");
var getCore = function () { return (0, runtime_js_1.getMatrixRuntime)(); };
function buildMatrixMediaInfo(params) {
    var base = {};
    if (Number.isFinite(params.size)) {
        base.size = params.size;
    }
    if (params.mimetype) {
        base.mimetype = params.mimetype;
    }
    if (params.imageInfo) {
        var dimensional = __assign(__assign({}, base), params.imageInfo);
        if (typeof params.durationMs === "number") {
            var videoInfo = __assign(__assign({}, dimensional), { duration: params.durationMs });
            return videoInfo;
        }
        return dimensional;
    }
    if (typeof params.durationMs === "number") {
        var timedInfo = __assign(__assign({}, base), { duration: params.durationMs });
        return timedInfo;
    }
    if (Object.keys(base).length === 0) {
        return undefined;
    }
    return base;
}
function buildMediaContent(params) {
    var info = buildMatrixMediaInfo({
        size: params.size,
        mimetype: params.mimetype,
        durationMs: params.durationMs,
        imageInfo: params.imageInfo,
    });
    var base = {
        msgtype: params.msgtype,
        body: params.body,
        filename: params.filename,
        info: info !== null && info !== void 0 ? info : undefined,
    };
    // Encrypted media should only include the "file" payload, not top-level "url".
    if (!params.file && params.url) {
        base.url = params.url;
    }
    // For encrypted files, add the file object
    if (params.file) {
        base.file = params.file;
    }
    if (params.isVoice) {
        base["org.matrix.msc3245.voice"] = {};
        if (typeof params.durationMs === "number") {
            base["org.matrix.msc1767.audio"] = {
                duration: params.durationMs,
            };
        }
    }
    if (params.relation) {
        base["m.relates_to"] = params.relation;
    }
    (0, formatting_js_1.applyMatrixFormatting)(base, params.body);
    return base;
}
var THUMBNAIL_MAX_SIDE = 800;
var THUMBNAIL_QUALITY = 80;
function prepareImageInfo(params) {
    return __awaiter(this, void 0, void 0, function () {
        var meta, imageInfo, maxDim, thumbBuffer, thumbMeta, thumbUri, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getCore()
                        .media.getImageMetadata(params.buffer)
                        .catch(function () { return null; })];
                case 1:
                    meta = _b.sent();
                    if (!meta) {
                        return [2 /*return*/, undefined];
                    }
                    imageInfo = { w: meta.width, h: meta.height };
                    maxDim = Math.max(meta.width, meta.height);
                    if (!(maxDim > THUMBNAIL_MAX_SIDE)) return [3 /*break*/, 7];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, getCore().media.resizeToJpeg({
                            buffer: params.buffer,
                            maxSide: THUMBNAIL_MAX_SIDE,
                            quality: THUMBNAIL_QUALITY,
                            withoutEnlargement: true,
                        })];
                case 3:
                    thumbBuffer = _b.sent();
                    return [4 /*yield*/, getCore()
                            .media.getImageMetadata(thumbBuffer)
                            .catch(function () { return null; })];
                case 4:
                    thumbMeta = _b.sent();
                    return [4 /*yield*/, params.client.uploadContent(thumbBuffer, "image/jpeg", "thumbnail.jpg")];
                case 5:
                    thumbUri = _b.sent();
                    imageInfo.thumbnail_url = thumbUri;
                    if (thumbMeta) {
                        imageInfo.thumbnail_info = {
                            w: thumbMeta.width,
                            h: thumbMeta.height,
                            mimetype: "image/jpeg",
                            size: thumbBuffer.byteLength,
                        };
                    }
                    return [3 /*break*/, 7];
                case 6:
                    _a = _b.sent();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, imageInfo];
            }
        });
    });
}
function resolveMediaDurationMs(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fileInfo, metadata, durationSeconds, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (params.kind !== "audio" && params.kind !== "video") {
                        return [2 /*return*/, undefined];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    fileInfo = params.contentType || params.fileName
                        ? {
                            mimeType: params.contentType,
                            size: params.buffer.byteLength,
                            path: params.fileName,
                        }
                        : undefined;
                    return [4 /*yield*/, (0, music_metadata_1.parseBuffer)(params.buffer, fileInfo, {
                            duration: true,
                            skipCovers: true,
                        })];
                case 2:
                    metadata = _b.sent();
                    durationSeconds = metadata.format.duration;
                    if (typeof durationSeconds === "number" && Number.isFinite(durationSeconds)) {
                        return [2 /*return*/, Math.max(0, Math.round(durationSeconds * 1000))];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, undefined];
            }
        });
    });
}
function uploadFile(client, file, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.uploadContent(file, params.contentType, params.filename)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Upload media with optional encryption for E2EE rooms.
 */
function uploadMediaMaybeEncrypted(client, roomId, buffer, params) {
    return __awaiter(this, void 0, void 0, function () {
        var isEncrypted, _a, encrypted, mxc_1, file, mxc;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = client.crypto;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.crypto.isRoomEncrypted(roomId)];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    isEncrypted = _a;
                    if (!(isEncrypted && client.crypto)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client.crypto.encryptMedia(buffer)];
                case 3:
                    encrypted = _b.sent();
                    return [4 /*yield*/, client.uploadContent(encrypted.buffer, params.contentType, params.filename)];
                case 4:
                    mxc_1 = _b.sent();
                    file = __assign({ url: mxc_1 }, encrypted.file);
                    return [2 /*return*/, {
                            url: mxc_1,
                            file: file,
                        }];
                case 5: return [4 /*yield*/, uploadFile(client, buffer, params)];
                case 6:
                    mxc = _b.sent();
                    return [2 /*return*/, { url: mxc }];
            }
        });
    });
}
