"use strict";
/**
 * Zalo Bot API client
 * @see https://bot.zaloplatforms.com/docs
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ZaloApiError = void 0;
exports.callZaloApi = callZaloApi;
exports.getMe = getMe;
exports.sendMessage = sendMessage;
exports.sendPhoto = sendPhoto;
exports.getUpdates = getUpdates;
exports.setWebhook = setWebhook;
exports.deleteWebhook = deleteWebhook;
exports.getWebhookInfo = getWebhookInfo;
var ZALO_API_BASE = "https://bot-api.zaloplatforms.com";
var ZaloApiError = /** @class */ (function (_super) {
    __extends(ZaloApiError, _super);
    function ZaloApiError(message, errorCode, description) {
        var _this = _super.call(this, message) || this;
        _this.errorCode = errorCode;
        _this.description = description;
        _this.name = "ZaloApiError";
        return _this;
    }
    Object.defineProperty(ZaloApiError.prototype, "isPollingTimeout", {
        /** True if this is a long-polling timeout (no updates available) */
        get: function () {
            return this.errorCode === 408;
        },
        enumerable: false,
        configurable: true
    });
    return ZaloApiError;
}(Error));
exports.ZaloApiError = ZaloApiError;
/**
 * Call the Zalo Bot API
 */
function callZaloApi(method, token, body, options) {
    return __awaiter(this, void 0, void 0, function () {
        var url, controller, timeoutId, fetcher, response, data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = "".concat(ZALO_API_BASE, "/bot").concat(token, "/").concat(method);
                    controller = new AbortController();
                    timeoutId = (options === null || options === void 0 ? void 0 : options.timeoutMs)
                        ? setTimeout(function () { return controller.abort(); }, options.timeoutMs)
                        : undefined;
                    fetcher = (_a = options === null || options === void 0 ? void 0 : options.fetch) !== null && _a !== void 0 ? _a : fetch;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, fetcher(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: body ? JSON.stringify(body) : undefined,
                            signal: controller.signal,
                        })];
                case 2:
                    response = _c.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = (_c.sent());
                    if (!data.ok) {
                        throw new ZaloApiError((_b = data.description) !== null && _b !== void 0 ? _b : "Zalo API error: ".concat(method), data.error_code, data.description);
                    }
                    return [2 /*return*/, data];
                case 4:
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Validate bot token and get bot info
 */
function getMe(token, timeoutMs, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, callZaloApi("getMe", token, undefined, { timeoutMs: timeoutMs, fetch: fetcher })];
        });
    });
}
/**
 * Send a text message
 */
function sendMessage(token, params, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, callZaloApi("sendMessage", token, params, { fetch: fetcher })];
        });
    });
}
/**
 * Send a photo message
 */
function sendPhoto(token, params, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, callZaloApi("sendPhoto", token, params, { fetch: fetcher })];
        });
    });
}
/**
 * Get updates using long polling (dev/testing only)
 * Note: Zalo returns a single update per call, not an array like Telegram
 */
function getUpdates(token, params, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        var pollTimeoutSec, timeoutMs, body;
        var _a;
        return __generator(this, function (_b) {
            pollTimeoutSec = (_a = params === null || params === void 0 ? void 0 : params.timeout) !== null && _a !== void 0 ? _a : 30;
            timeoutMs = (pollTimeoutSec + 5) * 1000;
            body = { timeout: String(pollTimeoutSec) };
            return [2 /*return*/, callZaloApi("getUpdates", token, body, { timeoutMs: timeoutMs, fetch: fetcher })];
        });
    });
}
/**
 * Set webhook URL for receiving updates
 */
function setWebhook(token, params, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, callZaloApi("setWebhook", token, params, { fetch: fetcher })];
        });
    });
}
/**
 * Delete webhook configuration
 */
function deleteWebhook(token, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, callZaloApi("deleteWebhook", token, undefined, { fetch: fetcher })];
        });
    });
}
/**
 * Get current webhook info
 */
function getWebhookInfo(token, fetcher) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, callZaloApi("getWebhookInfo", token, undefined, { fetch: fetcher })];
        });
    });
}
