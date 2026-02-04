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
exports.fetchBlueBubblesServerInfo = fetchBlueBubblesServerInfo;
exports.getCachedBlueBubblesServerInfo = getCachedBlueBubblesServerInfo;
exports.parseMacOSMajorVersion = parseMacOSMajorVersion;
exports.isMacOS26OrHigher = isMacOS26OrHigher;
exports.clearServerInfoCache = clearServerInfoCache;
exports.probeBlueBubbles = probeBlueBubbles;
var types_js_1 = require("./types.js");
/** Cache server info by account ID to avoid repeated API calls */
var serverInfoCache = new Map();
var CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
function buildCacheKey(accountId) {
    return (accountId === null || accountId === void 0 ? void 0 : accountId.trim()) || "default";
}
/**
 * Fetch server info from BlueBubbles API and cache it.
 * Returns cached result if available and not expired.
 */
function fetchBlueBubblesServerInfo(params) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, password, cacheKey, cached, url, res, payload, data, _a;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    baseUrl = (_b = params.baseUrl) === null || _b === void 0 ? void 0 : _b.trim();
                    password = (_c = params.password) === null || _c === void 0 ? void 0 : _c.trim();
                    if (!baseUrl || !password) {
                        return [2 /*return*/, null];
                    }
                    cacheKey = buildCacheKey(params.accountId);
                    cached = serverInfoCache.get(cacheKey);
                    if (cached && cached.expires > Date.now()) {
                        return [2 /*return*/, cached.info];
                    }
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({ baseUrl: baseUrl, path: "/api/v1/server/info", password: password });
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, { method: "GET" }, (_d = params.timeoutMs) !== null && _d !== void 0 ? _d : 5000)];
                case 2:
                    res = _e.sent();
                    if (!res.ok) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, res.json().catch(function () { return null; })];
                case 3:
                    payload = (_e.sent());
                    data = payload === null || payload === void 0 ? void 0 : payload.data;
                    if (data) {
                        serverInfoCache.set(cacheKey, { info: data, expires: Date.now() + CACHE_TTL_MS });
                    }
                    return [2 /*return*/, data !== null && data !== void 0 ? data : null];
                case 4:
                    _a = _e.sent();
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get cached server info synchronously (for use in listActions).
 * Returns null if not cached or expired.
 */
function getCachedBlueBubblesServerInfo(accountId) {
    var cacheKey = buildCacheKey(accountId);
    var cached = serverInfoCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
        return cached.info;
    }
    return null;
}
/**
 * Parse macOS version string (e.g., "15.0.1" or "26.0") into major version number.
 */
function parseMacOSMajorVersion(version) {
    if (!version) {
        return null;
    }
    var match = /^(\d+)/.exec(version.trim());
    return match ? Number.parseInt(match[1], 10) : null;
}
/**
 * Check if the cached server info indicates macOS 26 or higher.
 * Returns false if no cached info is available (fail open for action listing).
 */
function isMacOS26OrHigher(accountId) {
    var info = getCachedBlueBubblesServerInfo(accountId);
    if (!(info === null || info === void 0 ? void 0 : info.os_version)) {
        return false;
    }
    var major = parseMacOSMajorVersion(info.os_version);
    return major !== null && major >= 26;
}
/** Clear the server info cache (for testing) */
function clearServerInfoCache() {
    serverInfoCache.clear();
}
function probeBlueBubbles(params) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, password, url, res, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    baseUrl = (_a = params.baseUrl) === null || _a === void 0 ? void 0 : _a.trim();
                    password = (_b = params.password) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!baseUrl) {
                        return [2 /*return*/, { ok: false, error: "serverUrl not configured" }];
                    }
                    if (!password) {
                        return [2 /*return*/, { ok: false, error: "password not configured" }];
                    }
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({ baseUrl: baseUrl, path: "/api/v1/ping", password: password });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, { method: "GET" }, params.timeoutMs)];
                case 2:
                    res = _c.sent();
                    if (!res.ok) {
                        return [2 /*return*/, { ok: false, status: res.status, error: "HTTP ".concat(res.status) }];
                    }
                    return [2 /*return*/, { ok: true, status: res.status }];
                case 3:
                    err_1 = _c.sent();
                    return [2 /*return*/, {
                            ok: false,
                            status: null,
                            error: err_1 instanceof Error ? err_1.message : String(err_1),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
