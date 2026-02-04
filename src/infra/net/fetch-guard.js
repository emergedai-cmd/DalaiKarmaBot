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
exports.fetchWithSsrFGuard = fetchWithSsrFGuard;
var ssrf_js_1 = require("./ssrf.js");
var DEFAULT_MAX_REDIRECTS = 3;
function isRedirectStatus(status) {
    return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function buildAbortSignal(params) {
    var timeoutMs = params.timeoutMs, signal = params.signal;
    if (!timeoutMs && !signal) {
        return { signal: undefined, cleanup: function () { } };
    }
    if (!timeoutMs) {
        return { signal: signal, cleanup: function () { } };
    }
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { return controller.abort(); }, timeoutMs);
    var onAbort = function () { return controller.abort(); };
    if (signal) {
        if (signal.aborted) {
            controller.abort();
        }
        else {
            signal.addEventListener("abort", onAbort, { once: true });
        }
    }
    var cleanup = function () {
        clearTimeout(timeoutId);
        if (signal) {
            signal.removeEventListener("abort", onAbort);
        }
    };
    return { signal: controller.signal, cleanup: cleanup };
}
function fetchWithSsrFGuard(params) {
    return __awaiter(this, void 0, void 0, function () {
        var fetcher, maxRedirects, _a, signal, cleanup, released, release, visited, currentUrl, redirectCount, _loop_1, state_1;
        var _this = this;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    fetcher = (_b = params.fetchImpl) !== null && _b !== void 0 ? _b : globalThis.fetch;
                    if (!fetcher) {
                        throw new Error("fetch is not available");
                    }
                    maxRedirects = typeof params.maxRedirects === "number" && Number.isFinite(params.maxRedirects)
                        ? Math.max(0, Math.floor(params.maxRedirects))
                        : DEFAULT_MAX_REDIRECTS;
                    _a = buildAbortSignal({
                        timeoutMs: params.timeoutMs,
                        signal: params.signal,
                    }), signal = _a.signal, cleanup = _a.cleanup;
                    released = false;
                    release = function (dispatcher) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (released) {
                                        return [2 /*return*/];
                                    }
                                    released = true;
                                    cleanup();
                                    return [4 /*yield*/, (0, ssrf_js_1.closeDispatcher)(dispatcher !== null && dispatcher !== void 0 ? dispatcher : undefined)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    visited = new Set();
                    currentUrl = params.url;
                    redirectCount = 0;
                    _loop_1 = function () {
                        var parsedUrl, _h, dispatcher, usePolicy, pinned, _j, init, response, location_1, nextUrl, err_1;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    parsedUrl = void 0;
                                    _k.label = 1;
                                case 1:
                                    _k.trys.push([1, 2, , 4]);
                                    parsedUrl = new URL(currentUrl);
                                    return [3 /*break*/, 4];
                                case 2:
                                    _h = _k.sent();
                                    return [4 /*yield*/, release()];
                                case 3:
                                    _k.sent();
                                    throw new Error("Invalid URL: must be http or https");
                                case 4:
                                    if (!!["http:", "https:"].includes(parsedUrl.protocol)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, release()];
                                case 5:
                                    _k.sent();
                                    throw new Error("Invalid URL: must be http or https");
                                case 6:
                                    dispatcher = null;
                                    _k.label = 7;
                                case 7:
                                    _k.trys.push([7, 21, , 23]);
                                    usePolicy = Boolean(((_c = params.policy) === null || _c === void 0 ? void 0 : _c.allowPrivateNetwork) || ((_e = (_d = params.policy) === null || _d === void 0 ? void 0 : _d.allowedHostnames) === null || _e === void 0 ? void 0 : _e.length));
                                    if (!usePolicy) return [3 /*break*/, 9];
                                    return [4 /*yield*/, (0, ssrf_js_1.resolvePinnedHostnameWithPolicy)(parsedUrl.hostname, {
                                            lookupFn: params.lookupFn,
                                            policy: params.policy,
                                        })];
                                case 8:
                                    _j = _k.sent();
                                    return [3 /*break*/, 11];
                                case 9: return [4 /*yield*/, (0, ssrf_js_1.resolvePinnedHostname)(parsedUrl.hostname, params.lookupFn)];
                                case 10:
                                    _j = _k.sent();
                                    _k.label = 11;
                                case 11:
                                    pinned = _j;
                                    if (params.pinDns !== false) {
                                        dispatcher = (0, ssrf_js_1.createPinnedDispatcher)(pinned);
                                    }
                                    init = __assign(__assign(__assign(__assign({}, (params.init ? __assign({}, params.init) : {})), { redirect: "manual" }), (dispatcher ? { dispatcher: dispatcher } : {})), (signal ? { signal: signal } : {}));
                                    return [4 /*yield*/, fetcher(parsedUrl.toString(), init)];
                                case 12:
                                    response = _k.sent();
                                    if (!isRedirectStatus(response.status)) return [3 /*break*/, 20];
                                    location_1 = response.headers.get("location");
                                    if (!!location_1) return [3 /*break*/, 14];
                                    return [4 /*yield*/, release(dispatcher)];
                                case 13:
                                    _k.sent();
                                    throw new Error("Redirect missing location header (".concat(response.status, ")"));
                                case 14:
                                    redirectCount += 1;
                                    if (!(redirectCount > maxRedirects)) return [3 /*break*/, 16];
                                    return [4 /*yield*/, release(dispatcher)];
                                case 15:
                                    _k.sent();
                                    throw new Error("Too many redirects (limit: ".concat(maxRedirects, ")"));
                                case 16:
                                    nextUrl = new URL(location_1, parsedUrl).toString();
                                    if (!visited.has(nextUrl)) return [3 /*break*/, 18];
                                    return [4 /*yield*/, release(dispatcher)];
                                case 17:
                                    _k.sent();
                                    throw new Error("Redirect loop detected");
                                case 18:
                                    visited.add(nextUrl);
                                    void ((_f = response.body) === null || _f === void 0 ? void 0 : _f.cancel());
                                    return [4 /*yield*/, (0, ssrf_js_1.closeDispatcher)(dispatcher)];
                                case 19:
                                    _k.sent();
                                    currentUrl = nextUrl;
                                    return [2 /*return*/, "continue"];
                                case 20: return [2 /*return*/, { value: {
                                            response: response,
                                            finalUrl: currentUrl,
                                            release: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, release(dispatcher)];
                                            }); }); },
                                        } }];
                                case 21:
                                    err_1 = _k.sent();
                                    return [4 /*yield*/, release(dispatcher)];
                                case 22:
                                    _k.sent();
                                    throw err_1;
                                case 23: return [2 /*return*/];
                            }
                        });
                    };
                    _g.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _g.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
