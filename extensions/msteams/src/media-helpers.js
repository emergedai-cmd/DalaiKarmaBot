"use strict";
/**
 * MIME type detection and filename extraction for MSTeams media attachments.
 */
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
exports.getMimeType = getMimeType;
exports.extractFilename = extractFilename;
exports.isLocalPath = isLocalPath;
exports.extractMessageId = extractMessageId;
var node_path_1 = require("node:path");
var plugin_sdk_1 = require("openclaw/plugin-sdk");
/**
 * Detect MIME type from URL extension or data URL.
 * Uses shared MIME detection for consistency with core handling.
 */
function getMimeType(url) {
    return __awaiter(this, void 0, void 0, function () {
        var match, detected;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Handle data URLs: data:image/png;base64,...
                    if (url.startsWith("data:")) {
                        match = url.match(/^data:([^;,]+)/);
                        if (match === null || match === void 0 ? void 0 : match[1]) {
                            return [2 /*return*/, match[1]];
                        }
                    }
                    return [4 /*yield*/, (0, plugin_sdk_1.detectMime)({ filePath: url })];
                case 1:
                    detected = _a.sent();
                    return [2 /*return*/, detected !== null && detected !== void 0 ? detected : "application/octet-stream"];
            }
        });
    });
}
/**
 * Extract filename from URL or local path.
 * For local paths, extracts original filename if stored with embedded name pattern.
 * Falls back to deriving the extension from MIME type when no extension present.
 */
function extractFilename(url) {
    return __awaiter(this, void 0, void 0, function () {
        var mime, ext, prefix, pathname, basename, existingExt, mime, ext, prefix, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!url.startsWith("data:")) return [3 /*break*/, 2];
                    return [4 /*yield*/, getMimeType(url)];
                case 1:
                    mime = _d.sent();
                    ext = (_b = (0, plugin_sdk_1.extensionForMime)(mime)) !== null && _b !== void 0 ? _b : ".bin";
                    prefix = mime.startsWith("image/") ? "image" : "file";
                    return [2 /*return*/, "".concat(prefix).concat(ext)];
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    pathname = new URL(url).pathname;
                    basename = node_path_1.default.basename(pathname);
                    existingExt = (0, plugin_sdk_1.getFileExtension)(pathname);
                    if (basename && existingExt) {
                        return [2 /*return*/, basename];
                    }
                    return [4 /*yield*/, getMimeType(url)];
                case 3:
                    mime = _d.sent();
                    ext = (_c = (0, plugin_sdk_1.extensionForMime)(mime)) !== null && _c !== void 0 ? _c : ".bin";
                    prefix = mime.startsWith("image/") ? "image" : "file";
                    return [2 /*return*/, basename ? "".concat(basename).concat(ext) : "".concat(prefix).concat(ext)];
                case 4:
                    _a = _d.sent();
                    // Local paths - use extractOriginalFilename to extract embedded original name
                    return [2 /*return*/, (0, plugin_sdk_1.extractOriginalFilename)(url)];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if a URL refers to a local file path.
 */
function isLocalPath(url) {
    return url.startsWith("file://") || url.startsWith("/") || url.startsWith("~");
}
/**
 * Extract the message ID from a Bot Framework response.
 */
function extractMessageId(response) {
    if (!response || typeof response !== "object") {
        return null;
    }
    if (!("id" in response)) {
        return null;
    }
    var id = response.id;
    if (typeof id !== "string" || !id) {
        return null;
    }
    return id;
}
