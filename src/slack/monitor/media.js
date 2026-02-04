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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithSlackAuth = fetchWithSlackAuth;
exports.resolveSlackMedia = resolveSlackMedia;
exports.resolveSlackThreadStarter = resolveSlackThreadStarter;
var fetch_js_1 = require("../../media/fetch.js");
var store_js_1 = require("../../media/store.js");
function normalizeHostname(hostname) {
    var normalized = hostname.trim().toLowerCase().replace(/\.$/, "");
    if (normalized.startsWith("[") && normalized.endsWith("]")) {
        return normalized.slice(1, -1);
    }
    return normalized;
}
function isSlackHostname(hostname) {
    var normalized = normalizeHostname(hostname);
    if (!normalized) {
        return false;
    }
    // Slack-hosted files typically come from *.slack.com and redirect to Slack CDN domains.
    // Include a small allowlist of known Slack domains to avoid leaking tokens if a file URL
    // is ever spoofed or mishandled.
    var allowedSuffixes = ["slack.com", "slack-edge.com", "slack-files.com"];
    return allowedSuffixes.some(function (suffix) { return normalized === suffix || normalized.endsWith(".".concat(suffix)); });
}
function assertSlackFileUrl(rawUrl) {
    var parsed;
    try {
        parsed = new URL(rawUrl);
    }
    catch (_a) {
        throw new Error("Invalid Slack file URL: ".concat(rawUrl));
    }
    if (parsed.protocol !== "https:") {
        throw new Error("Refusing Slack file URL with non-HTTPS protocol: ".concat(parsed.protocol));
    }
    if (!isSlackHostname(parsed.hostname)) {
        throw new Error("Refusing to send Slack token to non-Slack host \"".concat(parsed.hostname, "\" (url: ").concat(rawUrl, ")"));
    }
    return parsed;
}
function resolveRequestUrl(input) {
    if (typeof input === "string") {
        return input;
    }
    if (input instanceof URL) {
        return input.toString();
    }
    if ("url" in input && typeof input.url === "string") {
        return input.url;
    }
    throw new Error("Unsupported fetch input: expected string, URL, or Request");
}
function createSlackMediaFetch(token) {
    var _this = this;
    var includeAuth = true;
    return function (input, init) { return __awaiter(_this, void 0, void 0, function () {
        var url, _a, initHeaders, _redirect, rest, headers, parsed;
        return __generator(this, function (_b) {
            url = resolveRequestUrl(input);
            _a = init !== null && init !== void 0 ? init : {}, initHeaders = _a.headers, _redirect = _a.redirect, rest = __rest(_a, ["headers", "redirect"]);
            headers = new Headers(initHeaders);
            if (includeAuth) {
                includeAuth = false;
                parsed = assertSlackFileUrl(url);
                headers.set("Authorization", "Bearer ".concat(token));
                return [2 /*return*/, fetch(parsed.href, __assign(__assign({}, rest), { headers: headers, redirect: "manual" }))];
            }
            headers.delete("Authorization");
            return [2 /*return*/, fetch(url, __assign(__assign({}, rest), { headers: headers, redirect: "manual" }))];
        });
    }); };
}
/**
 * Fetches a URL with Authorization header, handling cross-origin redirects.
 * Node.js fetch strips Authorization headers on cross-origin redirects for security.
 * Slack's file URLs redirect to CDN domains with pre-signed URLs that don't need the
 * Authorization header, so we handle the initial auth request manually.
 */
function fetchWithSlackAuth(url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, initialRes, redirectUrl, resolvedUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parsed = assertSlackFileUrl(url);
                    return [4 /*yield*/, fetch(parsed.href, {
                            headers: { Authorization: "Bearer ".concat(token) },
                            redirect: "manual",
                        })];
                case 1:
                    initialRes = _a.sent();
                    // If not a redirect, return the response directly
                    if (initialRes.status < 300 || initialRes.status >= 400) {
                        return [2 /*return*/, initialRes];
                    }
                    redirectUrl = initialRes.headers.get("location");
                    if (!redirectUrl) {
                        return [2 /*return*/, initialRes];
                    }
                    resolvedUrl = new URL(redirectUrl, parsed.href);
                    // Only follow safe protocols (we do NOT include Authorization on redirects).
                    if (resolvedUrl.protocol !== "https:") {
                        return [2 /*return*/, initialRes];
                    }
                    // Follow the redirect without the Authorization header
                    // (Slack's CDN URLs are pre-signed and don't need it)
                    return [2 /*return*/, fetch(resolvedUrl.toString(), { redirect: "follow" })];
            }
        });
    });
}
function resolveSlackMedia(params) {
    return __awaiter(this, void 0, void 0, function () {
        var files, _i, files_1, file, url, fetchImpl, fetched, saved, label, _a;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    files = (_b = params.files) !== null && _b !== void 0 ? _b : [];
                    _i = 0, files_1 = files;
                    _f.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 7];
                    file = files_1[_i];
                    url = (_c = file.url_private_download) !== null && _c !== void 0 ? _c : file.url_private;
                    if (!url) {
                        return [3 /*break*/, 6];
                    }
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 5, , 6]);
                    fetchImpl = createSlackMediaFetch(params.token);
                    return [4 /*yield*/, (0, fetch_js_1.fetchRemoteMedia)({
                            url: url,
                            fetchImpl: fetchImpl,
                            filePathHint: file.name,
                            maxBytes: params.maxBytes,
                        })];
                case 3:
                    fetched = _f.sent();
                    if (fetched.buffer.byteLength > params.maxBytes) {
                        return [3 /*break*/, 6];
                    }
                    return [4 /*yield*/, (0, store_js_1.saveMediaBuffer)(fetched.buffer, (_d = fetched.contentType) !== null && _d !== void 0 ? _d : file.mimetype, "inbound", params.maxBytes)];
                case 4:
                    saved = _f.sent();
                    label = (_e = fetched.fileName) !== null && _e !== void 0 ? _e : file.name;
                    return [2 /*return*/, {
                            path: saved.path,
                            contentType: saved.contentType,
                            placeholder: label ? "[Slack file: ".concat(label, "]") : "[Slack file]",
                        }];
                case 5:
                    _a = _f.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, null];
            }
        });
    });
}
var THREAD_STARTER_CACHE = new Map();
function resolveSlackThreadStarter(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, cached, response, message, text, starter, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cacheKey = "".concat(params.channelId, ":").concat(params.threadTs);
                    cached = THREAD_STARTER_CACHE.get(cacheKey);
                    if (cached) {
                        return [2 /*return*/, cached];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, params.client.conversations.replies({
                            channel: params.channelId,
                            ts: params.threadTs,
                            limit: 1,
                            inclusive: true,
                        })];
                case 2:
                    response = (_d.sent());
                    message = (_b = response === null || response === void 0 ? void 0 : response.messages) === null || _b === void 0 ? void 0 : _b[0];
                    text = ((_c = message === null || message === void 0 ? void 0 : message.text) !== null && _c !== void 0 ? _c : "").trim();
                    if (!message || !text) {
                        return [2 /*return*/, null];
                    }
                    starter = {
                        text: text,
                        userId: message.user,
                        ts: message.ts,
                        files: message.files,
                    };
                    THREAD_STARTER_CACHE.set(cacheKey, starter);
                    return [2 /*return*/, starter];
                case 3:
                    _a = _d.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
