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
exports.parseMessageWithAttachments = parseMessageWithAttachments;
exports.buildMessageWithAttachments = buildMessageWithAttachments;
var mime_js_1 = require("../media/mime.js");
function normalizeMime(mime) {
    var _a;
    if (!mime) {
        return undefined;
    }
    var cleaned = (_a = mime.split(";")[0]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
    return cleaned || undefined;
}
function sniffMimeFromBase64(base64) {
    return __awaiter(this, void 0, void 0, function () {
        var trimmed, take, sliceLen, head, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmed = base64.trim();
                    if (!trimmed) {
                        return [2 /*return*/, undefined];
                    }
                    take = Math.min(256, trimmed.length);
                    sliceLen = take - (take % 4);
                    if (sliceLen < 8) {
                        return [2 /*return*/, undefined];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    head = Buffer.from(trimmed.slice(0, sliceLen), "base64");
                    return [4 /*yield*/, (0, mime_js_1.detectMime)({ buffer: head })];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function isImageMime(mime) {
    return typeof mime === "string" && mime.startsWith("image/");
}
/**
 * Parse attachments and extract images as structured content blocks.
 * Returns the message text and an array of image content blocks
 * compatible with Claude API's image format.
 */
function parseMessageWithAttachments(message, attachments, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var maxBytes, log, images, _i, _a, _b, idx, att, mime, content, label, sizeBytes, b64, dataUrlMatch, providedMime, sniffedMime, _c;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    maxBytes = (_d = opts === null || opts === void 0 ? void 0 : opts.maxBytes) !== null && _d !== void 0 ? _d : 5000000;
                    log = opts === null || opts === void 0 ? void 0 : opts.log;
                    if (!attachments || attachments.length === 0) {
                        return [2 /*return*/, { message: message, images: [] }];
                    }
                    images = [];
                    _i = 0, _a = attachments.entries();
                    _g.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    _b = _a[_i], idx = _b[0], att = _b[1];
                    if (!att) {
                        return [3 /*break*/, 3];
                    }
                    mime = (_e = att.mimeType) !== null && _e !== void 0 ? _e : "";
                    content = att.content;
                    label = att.fileName || att.type || "attachment-".concat(idx + 1);
                    if (typeof content !== "string") {
                        throw new Error("attachment ".concat(label, ": content must be base64 string"));
                    }
                    sizeBytes = 0;
                    b64 = content.trim();
                    dataUrlMatch = /^data:[^;]+;base64,(.*)$/.exec(b64);
                    if (dataUrlMatch) {
                        b64 = dataUrlMatch[1];
                    }
                    // Basic base64 sanity: length multiple of 4 and charset check.
                    if (b64.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(b64)) {
                        throw new Error("attachment ".concat(label, ": invalid base64 content"));
                    }
                    try {
                        sizeBytes = Buffer.from(b64, "base64").byteLength;
                    }
                    catch (_h) {
                        throw new Error("attachment ".concat(label, ": invalid base64 content"));
                    }
                    if (sizeBytes <= 0 || sizeBytes > maxBytes) {
                        throw new Error("attachment ".concat(label, ": exceeds size limit (").concat(sizeBytes, " > ").concat(maxBytes, " bytes)"));
                    }
                    providedMime = normalizeMime(mime);
                    _c = normalizeMime;
                    return [4 /*yield*/, sniffMimeFromBase64(b64)];
                case 2:
                    sniffedMime = _c.apply(void 0, [_g.sent()]);
                    if (sniffedMime && !isImageMime(sniffedMime)) {
                        log === null || log === void 0 ? void 0 : log.warn("attachment ".concat(label, ": detected non-image (").concat(sniffedMime, "), dropping"));
                        return [3 /*break*/, 3];
                    }
                    if (!sniffedMime && !isImageMime(providedMime)) {
                        log === null || log === void 0 ? void 0 : log.warn("attachment ".concat(label, ": unable to detect image mime type, dropping"));
                        return [3 /*break*/, 3];
                    }
                    if (sniffedMime && providedMime && sniffedMime !== providedMime) {
                        log === null || log === void 0 ? void 0 : log.warn("attachment ".concat(label, ": mime mismatch (").concat(providedMime, " -> ").concat(sniffedMime, "), using sniffed"));
                    }
                    images.push({
                        type: "image",
                        data: b64,
                        mimeType: (_f = sniffedMime !== null && sniffedMime !== void 0 ? sniffedMime : providedMime) !== null && _f !== void 0 ? _f : mime,
                    });
                    _g.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, { message: message, images: images }];
            }
        });
    });
}
/**
 * @deprecated Use parseMessageWithAttachments instead.
 * This function converts images to markdown data URLs which Claude API cannot process as images.
 */
function buildMessageWithAttachments(message, attachments, opts) {
    var _a, _b;
    var maxBytes = (_a = opts === null || opts === void 0 ? void 0 : opts.maxBytes) !== null && _a !== void 0 ? _a : 2000000; // 2 MB
    if (!attachments || attachments.length === 0) {
        return message;
    }
    var blocks = [];
    for (var _i = 0, _c = attachments.entries(); _i < _c.length; _i++) {
        var _d = _c[_i], idx = _d[0], att = _d[1];
        if (!att) {
            continue;
        }
        var mime = (_b = att.mimeType) !== null && _b !== void 0 ? _b : "";
        var content = att.content;
        var label = att.fileName || att.type || "attachment-".concat(idx + 1);
        if (typeof content !== "string") {
            throw new Error("attachment ".concat(label, ": content must be base64 string"));
        }
        if (!mime.startsWith("image/")) {
            throw new Error("attachment ".concat(label, ": only image/* supported"));
        }
        var sizeBytes = 0;
        var b64 = content.trim();
        // Basic base64 sanity: length multiple of 4 and charset check.
        if (b64.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(b64)) {
            throw new Error("attachment ".concat(label, ": invalid base64 content"));
        }
        try {
            sizeBytes = Buffer.from(b64, "base64").byteLength;
        }
        catch (_e) {
            throw new Error("attachment ".concat(label, ": invalid base64 content"));
        }
        if (sizeBytes <= 0 || sizeBytes > maxBytes) {
            throw new Error("attachment ".concat(label, ": exceeds size limit (").concat(sizeBytes, " > ").concat(maxBytes, " bytes)"));
        }
        var safeLabel = label.replace(/\s+/g, "_");
        var dataUrl = "![".concat(safeLabel, "](data:").concat(mime, ";base64,").concat(content, ")");
        blocks.push(dataUrl);
    }
    if (blocks.length === 0) {
        return message;
    }
    var separator = message.trim().length > 0 ? "\n\n" : "";
    return "".concat(message).concat(separator).concat(blocks.join("\n\n"));
}
