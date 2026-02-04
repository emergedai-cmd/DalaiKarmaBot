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
exports.whatsappOutbound = void 0;
var chunk_js_1 = require("../../../auto-reply/chunk.js");
var globals_js_1 = require("../../../globals.js");
var target_errors_js_1 = require("../../../infra/outbound/target-errors.js");
var outbound_js_1 = require("../../../web/outbound.js");
var normalize_js_1 = require("../../../whatsapp/normalize.js");
exports.whatsappOutbound = {
    deliveryMode: "gateway",
    chunker: chunk_js_1.chunkText,
    chunkerMode: "text",
    textChunkLimit: 4000,
    pollMaxOptions: 12,
    resolveTarget: function (_a) {
        var _b;
        var to = _a.to, allowFrom = _a.allowFrom, mode = _a.mode;
        var trimmed = (_b = to === null || to === void 0 ? void 0 : to.trim()) !== null && _b !== void 0 ? _b : "";
        var allowListRaw = (allowFrom !== null && allowFrom !== void 0 ? allowFrom : []).map(function (entry) { return String(entry).trim(); }).filter(Boolean);
        var hasWildcard = allowListRaw.includes("*");
        var allowList = allowListRaw
            .filter(function (entry) { return entry !== "*"; })
            .map(function (entry) { return (0, normalize_js_1.normalizeWhatsAppTarget)(entry); })
            .filter(function (entry) { return Boolean(entry); });
        if (trimmed) {
            var normalizedTo = (0, normalize_js_1.normalizeWhatsAppTarget)(trimmed);
            if (!normalizedTo) {
                if ((mode === "implicit" || mode === "heartbeat") && allowList.length > 0) {
                    return { ok: true, to: allowList[0] };
                }
                return {
                    ok: false,
                    error: (0, target_errors_js_1.missingTargetError)("WhatsApp", "<E.164|group JID> or channels.whatsapp.allowFrom[0]"),
                };
            }
            if ((0, normalize_js_1.isWhatsAppGroupJid)(normalizedTo)) {
                return { ok: true, to: normalizedTo };
            }
            if (mode === "implicit" || mode === "heartbeat") {
                if (hasWildcard || allowList.length === 0) {
                    return { ok: true, to: normalizedTo };
                }
                if (allowList.includes(normalizedTo)) {
                    return { ok: true, to: normalizedTo };
                }
                return { ok: true, to: allowList[0] };
            }
            return { ok: true, to: normalizedTo };
        }
        if (allowList.length > 0) {
            return { ok: true, to: allowList[0] };
        }
        return {
            ok: false,
            error: (0, target_errors_js_1.missingTargetError)("WhatsApp", "<E.164|group JID> or channels.whatsapp.allowFrom[0]"),
        };
    },
    sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var send, _c, result;
        var _d;
        var to = _b.to, text = _b.text, accountId = _b.accountId, deps = _b.deps, gifPlayback = _b.gifPlayback;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!((_d = deps === null || deps === void 0 ? void 0 : deps.sendWhatsApp) !== null && _d !== void 0)) return [3 /*break*/, 1];
                    _c = _d;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../web/outbound.js"); })];
                case 2:
                    _c = (_e.sent()).sendMessageWhatsApp;
                    _e.label = 3;
                case 3:
                    send = _c;
                    return [4 /*yield*/, send(to, text, {
                            verbose: false,
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            gifPlayback: gifPlayback,
                        })];
                case 4:
                    result = _e.sent();
                    return [2 /*return*/, __assign({ channel: "whatsapp" }, result)];
            }
        });
    }); },
    sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var send, _c, result;
        var _d;
        var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, deps = _b.deps, gifPlayback = _b.gifPlayback;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!((_d = deps === null || deps === void 0 ? void 0 : deps.sendWhatsApp) !== null && _d !== void 0)) return [3 /*break*/, 1];
                    _c = _d;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../web/outbound.js"); })];
                case 2:
                    _c = (_e.sent()).sendMessageWhatsApp;
                    _e.label = 3;
                case 3:
                    send = _c;
                    return [4 /*yield*/, send(to, text, {
                            verbose: false,
                            mediaUrl: mediaUrl,
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            gifPlayback: gifPlayback,
                        })];
                case 4:
                    result = _e.sent();
                    return [2 /*return*/, __assign({ channel: "whatsapp" }, result)];
            }
        });
    }); },
    sendPoll: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var to = _b.to, poll = _b.poll, accountId = _b.accountId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, outbound_js_1.sendPollWhatsApp)(to, poll, {
                        verbose: (0, globals_js_1.shouldLogVerbose)(),
                        accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                    })];
                case 1: return [2 /*return*/, _c.sent()];
            }
        });
    }); },
};
