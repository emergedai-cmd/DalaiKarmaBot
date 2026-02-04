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
exports.sendMessageZalouser = sendMessageZalouser;
exports.sendImageZalouser = sendImageZalouser;
exports.sendLinkZalouser = sendLinkZalouser;
var zca_js_1 = require("./zca.js");
function sendMessageZalouser(threadId_1, text_1) {
    return __awaiter(this, arguments, void 0, function (threadId, text, options) {
        var profile, args, result, err_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profile = options.profile || process.env.ZCA_PROFILE || "default";
                    if (!(threadId === null || threadId === void 0 ? void 0 : threadId.trim())) {
                        return [2 /*return*/, { ok: false, error: "No threadId provided" }];
                    }
                    // Handle media sending
                    if (options.mediaUrl) {
                        return [2 /*return*/, sendMediaZalouser(threadId, options.mediaUrl, __assign(__assign({}, options), { caption: text || options.caption }))];
                    }
                    args = ["msg", "send", threadId.trim(), text.slice(0, 2000)];
                    if (options.isGroup) {
                        args.push("-g");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: profile })];
                case 2:
                    result = _a.sent();
                    if (result.ok) {
                        return [2 /*return*/, { ok: true, messageId: extractMessageId(result.stdout) }];
                    }
                    return [2 /*return*/, { ok: false, error: result.stderr || "Failed to send message" }];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, { ok: false, error: err_1 instanceof Error ? err_1.message : String(err_1) }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function sendMediaZalouser(threadId_1, mediaUrl_1) {
    return __awaiter(this, arguments, void 0, function (threadId, mediaUrl, options) {
        var profile, lowerUrl, command, args, result, err_2;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profile = options.profile || process.env.ZCA_PROFILE || "default";
                    if (!(threadId === null || threadId === void 0 ? void 0 : threadId.trim())) {
                        return [2 /*return*/, { ok: false, error: "No threadId provided" }];
                    }
                    if (!(mediaUrl === null || mediaUrl === void 0 ? void 0 : mediaUrl.trim())) {
                        return [2 /*return*/, { ok: false, error: "No media URL provided" }];
                    }
                    lowerUrl = mediaUrl.toLowerCase();
                    if (lowerUrl.match(/\.(mp4|mov|avi|webm)$/)) {
                        command = "video";
                    }
                    else if (lowerUrl.match(/\.(mp3|wav|ogg|m4a)$/)) {
                        command = "voice";
                    }
                    else {
                        command = "image";
                    }
                    args = ["msg", command, threadId.trim(), "-u", mediaUrl.trim()];
                    if (options.caption) {
                        args.push("-m", options.caption.slice(0, 2000));
                    }
                    if (options.isGroup) {
                        args.push("-g");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: profile })];
                case 2:
                    result = _a.sent();
                    if (result.ok) {
                        return [2 /*return*/, { ok: true, messageId: extractMessageId(result.stdout) }];
                    }
                    return [2 /*return*/, { ok: false, error: result.stderr || "Failed to send ".concat(command) }];
                case 3:
                    err_2 = _a.sent();
                    return [2 /*return*/, { ok: false, error: err_2 instanceof Error ? err_2.message : String(err_2) }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function sendImageZalouser(threadId_1, imageUrl_1) {
    return __awaiter(this, arguments, void 0, function (threadId, imageUrl, options) {
        var profile, args, result, err_3;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profile = options.profile || process.env.ZCA_PROFILE || "default";
                    args = ["msg", "image", threadId.trim(), "-u", imageUrl.trim()];
                    if (options.caption) {
                        args.push("-m", options.caption.slice(0, 2000));
                    }
                    if (options.isGroup) {
                        args.push("-g");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: profile })];
                case 2:
                    result = _a.sent();
                    if (result.ok) {
                        return [2 /*return*/, { ok: true, messageId: extractMessageId(result.stdout) }];
                    }
                    return [2 /*return*/, { ok: false, error: result.stderr || "Failed to send image" }];
                case 3:
                    err_3 = _a.sent();
                    return [2 /*return*/, { ok: false, error: err_3 instanceof Error ? err_3.message : String(err_3) }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function sendLinkZalouser(threadId_1, url_1) {
    return __awaiter(this, arguments, void 0, function (threadId, url, options) {
        var profile, args, result, err_4;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profile = options.profile || process.env.ZCA_PROFILE || "default";
                    args = ["msg", "link", threadId.trim(), url.trim()];
                    if (options.isGroup) {
                        args.push("-g");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: profile })];
                case 2:
                    result = _a.sent();
                    if (result.ok) {
                        return [2 /*return*/, { ok: true, messageId: extractMessageId(result.stdout) }];
                    }
                    return [2 /*return*/, { ok: false, error: result.stderr || "Failed to send link" }];
                case 3:
                    err_4 = _a.sent();
                    return [2 /*return*/, { ok: false, error: err_4 instanceof Error ? err_4.message : String(err_4) }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function extractMessageId(stdout) {
    // Try to extract message ID from output
    var match = stdout.match(/message[_\s]?id[:\s]+(\S+)/i);
    if (match) {
        return match[1];
    }
    // Return first word if it looks like an ID
    var firstWord = stdout.trim().split(/\s+/)[0];
    if (firstWord && /^[a-zA-Z0-9_-]+$/.test(firstWord)) {
        return firstWord;
    }
    return undefined;
}
