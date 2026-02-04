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
var vitest_1 = require("vitest");
var ssrf = require("../../../infra/net/ssrf.js");
var audio_js_1 = require("./audio.js");
var resolvePinnedHostname = ssrf.resolvePinnedHostname;
var resolvePinnedHostnameWithPolicy = ssrf.resolvePinnedHostnameWithPolicy;
var lookupMock = vitest_1.vi.fn();
var resolvePinnedHostnameSpy = null;
var resolvePinnedHostnameWithPolicySpy = null;
var resolveRequestUrl = function (input) {
    if (typeof input === "string") {
        return input;
    }
    if (input instanceof URL) {
        return input.toString();
    }
    return input.url;
};
(0, vitest_1.describe)("transcribeDeepgramAudio", function () {
    (0, vitest_1.beforeEach)(function () {
        lookupMock.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
        resolvePinnedHostnameSpy = vitest_1.vi
            .spyOn(ssrf, "resolvePinnedHostname")
            .mockImplementation(function (hostname) { return resolvePinnedHostname(hostname, lookupMock); });
        resolvePinnedHostnameWithPolicySpy = vitest_1.vi
            .spyOn(ssrf, "resolvePinnedHostnameWithPolicy")
            .mockImplementation(function (hostname, params) {
            return resolvePinnedHostnameWithPolicy(hostname, __assign(__assign({}, params), { lookupFn: lookupMock }));
        });
    });
    (0, vitest_1.afterEach)(function () {
        lookupMock.mockReset();
        resolvePinnedHostnameSpy === null || resolvePinnedHostnameSpy === void 0 ? void 0 : resolvePinnedHostnameSpy.mockRestore();
        resolvePinnedHostnameWithPolicySpy === null || resolvePinnedHostnameWithPolicySpy === void 0 ? void 0 : resolvePinnedHostnameWithPolicySpy.mockRestore();
        resolvePinnedHostnameSpy = null;
        resolvePinnedHostnameWithPolicySpy = null;
    });
    (0, vitest_1.it)("respects lowercase authorization header overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
        var seenAuth, fetchFn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seenAuth = null;
                    fetchFn = function (_input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var headers;
                        return __generator(this, function (_a) {
                            headers = new Headers(init === null || init === void 0 ? void 0 : init.headers);
                            seenAuth = headers.get("authorization");
                            return [2 /*return*/, new Response(JSON.stringify({
                                    results: { channels: [{ alternatives: [{ transcript: "ok" }] }] },
                                }), {
                                    status: 200,
                                    headers: { "content-type": "application/json" },
                                })];
                        });
                    }); };
                    return [4 /*yield*/, (0, audio_js_1.transcribeDeepgramAudio)({
                            buffer: Buffer.from("audio"),
                            fileName: "note.mp3",
                            apiKey: "test-key",
                            timeoutMs: 1000,
                            headers: { authorization: "Token override" },
                            fetchFn: fetchFn,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(seenAuth).toBe("Token override");
                    (0, vitest_1.expect)(result.text).toBe("ok");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("builds the expected request payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var seenUrl, seenInit, fetchFn, result, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seenUrl = null;
                    fetchFn = function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            seenUrl = resolveRequestUrl(input);
                            seenInit = init;
                            return [2 /*return*/, new Response(JSON.stringify({
                                    results: { channels: [{ alternatives: [{ transcript: "hello" }] }] },
                                }), {
                                    status: 200,
                                    headers: { "content-type": "application/json" },
                                })];
                        });
                    }); };
                    return [4 /*yield*/, (0, audio_js_1.transcribeDeepgramAudio)({
                            buffer: Buffer.from("audio-bytes"),
                            fileName: "voice.wav",
                            apiKey: "test-key",
                            timeoutMs: 1234,
                            baseUrl: "https://api.example.com/v1/",
                            model: " ",
                            language: " en ",
                            mime: "audio/wav",
                            headers: { "X-Custom": "1" },
                            query: {
                                punctuate: false,
                                smart_format: true,
                            },
                            fetchFn: fetchFn,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.model).toBe("nova-3");
                    (0, vitest_1.expect)(result.text).toBe("hello");
                    (0, vitest_1.expect)(seenUrl).toBe("https://api.example.com/v1/listen?model=nova-3&language=en&punctuate=false&smart_format=true");
                    (0, vitest_1.expect)(seenInit === null || seenInit === void 0 ? void 0 : seenInit.method).toBe("POST");
                    (0, vitest_1.expect)(seenInit === null || seenInit === void 0 ? void 0 : seenInit.signal).toBeInstanceOf(AbortSignal);
                    headers = new Headers(seenInit === null || seenInit === void 0 ? void 0 : seenInit.headers);
                    (0, vitest_1.expect)(headers.get("authorization")).toBe("Token test-key");
                    (0, vitest_1.expect)(headers.get("x-custom")).toBe("1");
                    (0, vitest_1.expect)(headers.get("content-type")).toBe("audio/wav");
                    (0, vitest_1.expect)(seenInit === null || seenInit === void 0 ? void 0 : seenInit.body).toBeInstanceOf(Uint8Array);
                    return [2 /*return*/];
            }
        });
    }); });
});
