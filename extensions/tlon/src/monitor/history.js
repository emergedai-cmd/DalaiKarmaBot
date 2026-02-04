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
exports.cacheMessage = cacheMessage;
exports.fetchChannelHistory = fetchChannelHistory;
exports.getChannelHistory = getChannelHistory;
var utils_js_1 = require("./utils.js");
var messageCache = new Map();
var MAX_CACHED_MESSAGES = 100;
function cacheMessage(channelNest, message) {
    if (!messageCache.has(channelNest)) {
        messageCache.set(channelNest, []);
    }
    var cache = messageCache.get(channelNest);
    if (!cache) {
        return;
    }
    cache.unshift(message);
    if (cache.length > MAX_CACHED_MESSAGES) {
        cache.pop();
    }
}
function fetchChannelHistory(api_1, channelNest_1) {
    return __awaiter(this, arguments, void 0, function (api, channelNest, count, runtime) {
        var scryPath, data, posts, messages, error_1;
        var _a, _b, _c, _d;
        if (count === void 0) { count = 50; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    scryPath = "/channels/v4/".concat(channelNest, "/posts/newest/").concat(count, "/outline.json");
                    (_a = runtime === null || runtime === void 0 ? void 0 : runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] Fetching history: ".concat(scryPath));
                    return [4 /*yield*/, api.scry(scryPath)];
                case 1:
                    data = _e.sent();
                    if (!data) {
                        return [2 /*return*/, []];
                    }
                    posts = [];
                    if (Array.isArray(data)) {
                        posts = data;
                    }
                    else if (data.posts && typeof data.posts === "object") {
                        posts = Object.values(data.posts);
                    }
                    else if (typeof data === "object") {
                        posts = Object.values(data);
                    }
                    messages = posts
                        .map(function (item) {
                        var _a, _b, _c, _d;
                        var essay = item.essay || ((_b = (_a = item["r-post"]) === null || _a === void 0 ? void 0 : _a.set) === null || _b === void 0 ? void 0 : _b.essay);
                        var seal = item.seal || ((_d = (_c = item["r-post"]) === null || _c === void 0 ? void 0 : _c.set) === null || _d === void 0 ? void 0 : _d.seal);
                        return {
                            author: (essay === null || essay === void 0 ? void 0 : essay.author) || "unknown",
                            content: (0, utils_js_1.extractMessageText)((essay === null || essay === void 0 ? void 0 : essay.content) || []),
                            timestamp: (essay === null || essay === void 0 ? void 0 : essay.sent) || Date.now(),
                            id: seal === null || seal === void 0 ? void 0 : seal.id,
                        };
                    })
                        .filter(function (msg) { return msg.content; });
                    (_b = runtime === null || runtime === void 0 ? void 0 : runtime.log) === null || _b === void 0 ? void 0 : _b.call(runtime, "[tlon] Extracted ".concat(messages.length, " messages from history"));
                    return [2 /*return*/, messages];
                case 2:
                    error_1 = _e.sent();
                    (_c = runtime === null || runtime === void 0 ? void 0 : runtime.log) === null || _c === void 0 ? void 0 : _c.call(runtime, "[tlon] Error fetching channel history: ".concat((_d = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) !== null && _d !== void 0 ? _d : String(error_1)));
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getChannelHistory(api_1, channelNest_1) {
    return __awaiter(this, arguments, void 0, function (api, channelNest, count, runtime) {
        var cache;
        var _a, _b, _c;
        if (count === void 0) { count = 50; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cache = (_a = messageCache.get(channelNest)) !== null && _a !== void 0 ? _a : [];
                    if (cache.length >= count) {
                        (_b = runtime === null || runtime === void 0 ? void 0 : runtime.log) === null || _b === void 0 ? void 0 : _b.call(runtime, "[tlon] Using cached messages (".concat(cache.length, " available)"));
                        return [2 /*return*/, cache.slice(0, count)];
                    }
                    (_c = runtime === null || runtime === void 0 ? void 0 : runtime.log) === null || _c === void 0 ? void 0 : _c.call(runtime, "[tlon] Cache has ".concat(cache.length, " messages, need ").concat(count, ", fetching from scry..."));
                    return [4 /*yield*/, fetchChannelHistory(api, channelNest, count, runtime)];
                case 1: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
