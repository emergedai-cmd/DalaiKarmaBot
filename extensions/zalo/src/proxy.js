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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveZaloProxyFetch = resolveZaloProxyFetch;
var undici_1 = require("undici");
var proxyCache = new Map();
function resolveZaloProxyFetch(proxyUrl) {
    var trimmed = proxyUrl === null || proxyUrl === void 0 ? void 0 : proxyUrl.trim();
    if (!trimmed) {
        return undefined;
    }
    var cached = proxyCache.get(trimmed);
    if (cached) {
        return cached;
    }
    var agent = new undici_1.ProxyAgent(trimmed);
    var fetcher = function (input, init) {
        return (0, undici_1.fetch)(input, __assign(__assign({}, init), { dispatcher: agent }));
    };
    proxyCache.set(trimmed, fetcher);
    return fetcher;
}
