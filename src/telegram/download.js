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
exports.getTelegramFile = getTelegramFile;
exports.downloadTelegramFile = downloadTelegramFile;
var mime_js_1 = require("../media/mime.js");
var store_js_1 = require("../media/store.js");
function getTelegramFile(token_1, fileId_1) {
    return __awaiter(this, arguments, void 0, function (token, fileId, timeoutMs) {
        var res, json;
        var _a;
        if (timeoutMs === void 0) { timeoutMs = 30000; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch("https://api.telegram.org/bot".concat(token, "/getFile?file_id=").concat(encodeURIComponent(fileId)), { signal: AbortSignal.timeout(timeoutMs) })];
                case 1:
                    res = _b.sent();
                    if (!res.ok) {
                        throw new Error("getFile failed: ".concat(res.status, " ").concat(res.statusText));
                    }
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = (_b.sent());
                    if (!json.ok || !((_a = json.result) === null || _a === void 0 ? void 0 : _a.file_path)) {
                        throw new Error("getFile returned no file_path");
                    }
                    return [2 /*return*/, json.result];
            }
        });
    });
}
function downloadTelegramFile(token_1, info_1, maxBytes_1) {
    return __awaiter(this, arguments, void 0, function (token, info, maxBytes, timeoutMs) {
        var url, res, array, _a, _b, mime, saved;
        if (timeoutMs === void 0) { timeoutMs = 60000; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!info.file_path) {
                        throw new Error("file_path missing");
                    }
                    url = "https://api.telegram.org/file/bot".concat(token, "/").concat(info.file_path);
                    return [4 /*yield*/, fetch(url, { signal: AbortSignal.timeout(timeoutMs) })];
                case 1:
                    res = _c.sent();
                    if (!res.ok || !res.body) {
                        throw new Error("Failed to download telegram file: HTTP ".concat(res.status));
                    }
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, res.arrayBuffer()];
                case 2:
                    array = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, (0, mime_js_1.detectMime)({
                            buffer: array,
                            headerMime: res.headers.get("content-type"),
                            filePath: info.file_path,
                        })];
                case 3:
                    mime = _c.sent();
                    return [4 /*yield*/, (0, store_js_1.saveMediaBuffer)(array, mime, "inbound", maxBytes, info.file_path)];
                case 4:
                    saved = _c.sent();
                    // Ensure extension matches mime if possible
                    if (!saved.contentType && mime) {
                        saved.contentType = mime;
                    }
                    return [2 /*return*/, saved];
            }
        });
    });
}
