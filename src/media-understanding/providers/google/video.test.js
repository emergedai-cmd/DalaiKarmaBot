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
var vitest_1 = require("vitest");
var ssrf = require("../../../infra/net/ssrf.js");
var video_js_1 = require("./video.js");
var TEST_NET_IP = "203.0.113.10";
var resolveRequestUrl = function (input) {
    if (typeof input === "string") {
        return input;
    }
    if (input instanceof URL) {
        return input.toString();
    }
    return input.url;
};
(0, vitest_1.describe)("describeGeminiVideo", function () {
    var resolvePinnedHostnameSpy;
    (0, vitest_1.beforeEach)(function () {
        resolvePinnedHostnameSpy = vitest_1.vi
            .spyOn(ssrf, "resolvePinnedHostnameWithPolicy")
            .mockImplementation(function (hostname) { return __awaiter(void 0, void 0, void 0, function () {
            var normalized, addresses;
            return __generator(this, function (_a) {
                normalized = hostname.trim().toLowerCase().replace(/\.$/, "");
                addresses = [TEST_NET_IP];
                return [2 /*return*/, {
                        hostname: normalized,
                        addresses: addresses,
                        lookup: ssrf.createPinnedLookup({ hostname: normalized, addresses: addresses }),
                    }];
            });
        }); });
    });
    (0, vitest_1.afterEach)(function () {
        resolvePinnedHostnameSpy === null || resolvePinnedHostnameSpy === void 0 ? void 0 : resolvePinnedHostnameSpy.mockRestore();
        resolvePinnedHostnameSpy = undefined;
    });
    (0, vitest_1.it)("respects case-insensitive x-goog-api-key overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
        var seenKey, fetchFn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seenKey = null;
                    fetchFn = function (_input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var headers;
                        return __generator(this, function (_a) {
                            headers = new Headers(init === null || init === void 0 ? void 0 : init.headers);
                            seenKey = headers.get("x-goog-api-key");
                            return [2 /*return*/, new Response(JSON.stringify({
                                    candidates: [{ content: { parts: [{ text: "video ok" }] } }],
                                }), { status: 200, headers: { "content-type": "application/json" } })];
                        });
                    }); };
                    return [4 /*yield*/, (0, video_js_1.describeGeminiVideo)({
                            buffer: Buffer.from("video"),
                            fileName: "clip.mp4",
                            apiKey: "test-key",
                            timeoutMs: 1000,
                            headers: { "X-Goog-Api-Key": "override" },
                            fetchFn: fetchFn,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(seenKey).toBe("override");
                    (0, vitest_1.expect)(result.text).toBe("video ok");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("builds the expected request payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var seenUrl, seenInit, fetchFn, result, headers, bodyText, body;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    seenUrl = null;
                    fetchFn = function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            seenUrl = resolveRequestUrl(input);
                            seenInit = init;
                            return [2 /*return*/, new Response(JSON.stringify({
                                    candidates: [
                                        {
                                            content: {
                                                parts: [{ text: "first" }, { text: " second " }, { text: "" }],
                                            },
                                        },
                                    ],
                                }), { status: 200, headers: { "content-type": "application/json" } })];
                        });
                    }); };
                    return [4 /*yield*/, (0, video_js_1.describeGeminiVideo)({
                            buffer: Buffer.from("video-bytes"),
                            fileName: "clip.mp4",
                            apiKey: "test-key",
                            timeoutMs: 1500,
                            baseUrl: "https://example.com/v1beta/",
                            model: "gemini-3-pro",
                            headers: { "X-Other": "1" },
                            fetchFn: fetchFn,
                        })];
                case 1:
                    result = _q.sent();
                    (0, vitest_1.expect)(result.model).toBe("gemini-3-pro-preview");
                    (0, vitest_1.expect)(result.text).toBe("first\nsecond");
                    (0, vitest_1.expect)(seenUrl).toBe("https://example.com/v1beta/models/gemini-3-pro-preview:generateContent");
                    (0, vitest_1.expect)(seenInit === null || seenInit === void 0 ? void 0 : seenInit.method).toBe("POST");
                    (0, vitest_1.expect)(seenInit === null || seenInit === void 0 ? void 0 : seenInit.signal).toBeInstanceOf(AbortSignal);
                    headers = new Headers(seenInit === null || seenInit === void 0 ? void 0 : seenInit.headers);
                    (0, vitest_1.expect)(headers.get("x-goog-api-key")).toBe("test-key");
                    (0, vitest_1.expect)(headers.get("content-type")).toBe("application/json");
                    (0, vitest_1.expect)(headers.get("x-other")).toBe("1");
                    bodyText = typeof (seenInit === null || seenInit === void 0 ? void 0 : seenInit.body) === "string"
                        ? seenInit.body
                        : Buffer.isBuffer(seenInit === null || seenInit === void 0 ? void 0 : seenInit.body)
                            ? seenInit.body.toString("utf8")
                            : "";
                    body = JSON.parse(bodyText);
                    (0, vitest_1.expect)((_d = (_c = (_b = (_a = body.contents) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.parts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text).toBe("Describe the video.");
                    (0, vitest_1.expect)((_j = (_h = (_g = (_f = (_e = body.contents) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.parts) === null || _g === void 0 ? void 0 : _g[1]) === null || _h === void 0 ? void 0 : _h.inline_data) === null || _j === void 0 ? void 0 : _j.mime_type).toBe("video/mp4");
                    (0, vitest_1.expect)((_p = (_o = (_m = (_l = (_k = body.contents) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.parts) === null || _m === void 0 ? void 0 : _m[1]) === null || _o === void 0 ? void 0 : _o.inline_data) === null || _p === void 0 ? void 0 : _p.data).toBe(Buffer.from("video-bytes").toString("base64"));
                    return [2 /*return*/];
            }
        });
    }); });
});
