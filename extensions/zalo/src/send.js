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
exports.sendMessageZalo = sendMessageZalo;
exports.sendPhotoZalo = sendPhotoZalo;
var accounts_js_1 = require("./accounts.js");
var api_js_1 = require("./api.js");
var proxy_js_1 = require("./proxy.js");
var token_js_1 = require("./token.js");
function resolveSendContext(options) {
    var _a, _b;
    if (options.cfg) {
        var account = (0, accounts_js_1.resolveZaloAccount)({
            cfg: options.cfg,
            accountId: options.accountId,
        });
        var token_1 = options.token || account.token;
        var proxy_1 = (_a = options.proxy) !== null && _a !== void 0 ? _a : account.config.proxy;
        return { token: token_1, fetcher: (0, proxy_js_1.resolveZaloProxyFetch)(proxy_1) };
    }
    var token = (_b = options.token) !== null && _b !== void 0 ? _b : (0, token_js_1.resolveZaloToken)(undefined, options.accountId).token;
    var proxy = options.proxy;
    return { token: token, fetcher: (0, proxy_js_1.resolveZaloProxyFetch)(proxy) };
}
function sendMessageZalo(chatId_1, text_1) {
    return __awaiter(this, arguments, void 0, function (chatId, text, options) {
        var _a, token, fetcher, response, err_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = resolveSendContext(options), token = _a.token, fetcher = _a.fetcher;
                    if (!token) {
                        return [2 /*return*/, { ok: false, error: "No Zalo bot token configured" }];
                    }
                    if (!(chatId === null || chatId === void 0 ? void 0 : chatId.trim())) {
                        return [2 /*return*/, { ok: false, error: "No chat_id provided" }];
                    }
                    if (options.mediaUrl) {
                        return [2 /*return*/, sendPhotoZalo(chatId, options.mediaUrl, __assign(__assign({}, options), { token: token, caption: text || options.caption }))];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, api_js_1.sendMessage)(token, {
                            chat_id: chatId.trim(),
                            text: text.slice(0, 2000),
                        }, fetcher)];
                case 2:
                    response = _b.sent();
                    if (response.ok && response.result) {
                        return [2 /*return*/, { ok: true, messageId: response.result.message_id }];
                    }
                    return [2 /*return*/, { ok: false, error: "Failed to send message" }];
                case 3:
                    err_1 = _b.sent();
                    return [2 /*return*/, { ok: false, error: err_1 instanceof Error ? err_1.message : String(err_1) }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function sendPhotoZalo(chatId_1, photoUrl_1) {
    return __awaiter(this, arguments, void 0, function (chatId, photoUrl, options) {
        var _a, token, fetcher, response, err_2;
        var _b;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = resolveSendContext(options), token = _a.token, fetcher = _a.fetcher;
                    if (!token) {
                        return [2 /*return*/, { ok: false, error: "No Zalo bot token configured" }];
                    }
                    if (!(chatId === null || chatId === void 0 ? void 0 : chatId.trim())) {
                        return [2 /*return*/, { ok: false, error: "No chat_id provided" }];
                    }
                    if (!(photoUrl === null || photoUrl === void 0 ? void 0 : photoUrl.trim())) {
                        return [2 /*return*/, { ok: false, error: "No photo URL provided" }];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, api_js_1.sendPhoto)(token, {
                            chat_id: chatId.trim(),
                            photo: photoUrl.trim(),
                            caption: (_b = options.caption) === null || _b === void 0 ? void 0 : _b.slice(0, 2000),
                        }, fetcher)];
                case 2:
                    response = _c.sent();
                    if (response.ok && response.result) {
                        return [2 /*return*/, { ok: true, messageId: response.result.message_id }];
                    }
                    return [2 /*return*/, { ok: false, error: "Failed to send photo" }];
                case 3:
                    err_2 = _c.sent();
                    return [2 /*return*/, { ok: false, error: err_2 instanceof Error ? err_2.message : String(err_2) }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
