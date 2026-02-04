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
var ssrf = require("../../infra/net/ssrf.js");
// Store original fetch
var originalFetch = globalThis.fetch;
var mockFetch;
(0, vitest_1.describe)("fetchWithSlackAuth", function () {
    (0, vitest_1.beforeEach)(function () {
        // Create a new mock for each test
        mockFetch = vitest_1.vi.fn();
        globalThis.fetch = mockFetch;
    });
    (0, vitest_1.afterEach)(function () {
        // Restore original fetch
        globalThis.fetch = originalFetch;
        vitest_1.vi.resetModules();
    });
    (0, vitest_1.it)("sends Authorization header on initial request with manual redirect", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchWithSlackAuth, mockResponse, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    fetchWithSlackAuth = (_a.sent()).fetchWithSlackAuth;
                    mockResponse = new Response(Buffer.from("image data"), {
                        status: 200,
                        headers: { "content-type": "image/jpeg" },
                    });
                    mockFetch.mockResolvedValueOnce(mockResponse);
                    return [4 /*yield*/, fetchWithSlackAuth("https://files.slack.com/test.jpg", "xoxb-test-token")];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBe(mockResponse);
                    // Verify fetch was called with correct params
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledWith("https://files.slack.com/test.jpg", {
                        headers: { Authorization: "Bearer xoxb-test-token" },
                        redirect: "manual",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects non-Slack hosts to avoid leaking tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchWithSlackAuth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    fetchWithSlackAuth = (_a.sent()).fetchWithSlackAuth;
                    return [4 /*yield*/, (0, vitest_1.expect)(fetchWithSlackAuth("https://example.com/test.jpg", "xoxb-test-token")).rejects.toThrow(/non-Slack host|non-Slack/i)];
                case 2:
                    _a.sent();
                    // Should fail fast without attempting a fetch.
                    (0, vitest_1.expect)(mockFetch).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("follows redirects without Authorization header", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchWithSlackAuth, redirectResponse, fileResponse, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    fetchWithSlackAuth = (_a.sent()).fetchWithSlackAuth;
                    redirectResponse = new Response(null, {
                        status: 302,
                        headers: { location: "https://cdn.slack-edge.com/presigned-url?sig=abc123" },
                    });
                    fileResponse = new Response(Buffer.from("actual image data"), {
                        status: 200,
                        headers: { "content-type": "image/jpeg" },
                    });
                    mockFetch.mockResolvedValueOnce(redirectResponse).mockResolvedValueOnce(fileResponse);
                    return [4 /*yield*/, fetchWithSlackAuth("https://files.slack.com/test.jpg", "xoxb-test-token")];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBe(fileResponse);
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                    // First call should have Authorization header and manual redirect
                    (0, vitest_1.expect)(mockFetch).toHaveBeenNthCalledWith(1, "https://files.slack.com/test.jpg", {
                        headers: { Authorization: "Bearer xoxb-test-token" },
                        redirect: "manual",
                    });
                    // Second call should follow the redirect without Authorization
                    (0, vitest_1.expect)(mockFetch).toHaveBeenNthCalledWith(2, "https://cdn.slack-edge.com/presigned-url?sig=abc123", { redirect: "follow" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles relative redirect URLs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchWithSlackAuth, redirectResponse, fileResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    fetchWithSlackAuth = (_a.sent()).fetchWithSlackAuth;
                    redirectResponse = new Response(null, {
                        status: 302,
                        headers: { location: "/files/redirect-target" },
                    });
                    fileResponse = new Response(Buffer.from("image data"), {
                        status: 200,
                        headers: { "content-type": "image/jpeg" },
                    });
                    mockFetch.mockResolvedValueOnce(redirectResponse).mockResolvedValueOnce(fileResponse);
                    return [4 /*yield*/, fetchWithSlackAuth("https://files.slack.com/original.jpg", "xoxb-test-token")];
                case 2:
                    _a.sent();
                    // Second call should resolve the relative URL against the original
                    (0, vitest_1.expect)(mockFetch).toHaveBeenNthCalledWith(2, "https://files.slack.com/files/redirect-target", {
                        redirect: "follow",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns redirect response when no location header is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchWithSlackAuth, redirectResponse, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    fetchWithSlackAuth = (_a.sent()).fetchWithSlackAuth;
                    redirectResponse = new Response(null, {
                        status: 302,
                        // No location header
                    });
                    mockFetch.mockResolvedValueOnce(redirectResponse);
                    return [4 /*yield*/, fetchWithSlackAuth("https://files.slack.com/test.jpg", "xoxb-test-token")];
                case 2:
                    result = _a.sent();
                    // Should return the redirect response directly
                    (0, vitest_1.expect)(result).toBe(redirectResponse);
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns 4xx/5xx responses directly without following", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchWithSlackAuth, errorResponse, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    fetchWithSlackAuth = (_a.sent()).fetchWithSlackAuth;
                    errorResponse = new Response("Not Found", {
                        status: 404,
                    });
                    mockFetch.mockResolvedValueOnce(errorResponse);
                    return [4 /*yield*/, fetchWithSlackAuth("https://files.slack.com/test.jpg", "xoxb-test-token")];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBe(errorResponse);
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles 301 permanent redirects", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchWithSlackAuth, redirectResponse, fileResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    fetchWithSlackAuth = (_a.sent()).fetchWithSlackAuth;
                    redirectResponse = new Response(null, {
                        status: 301,
                        headers: { location: "https://cdn.slack.com/new-url" },
                    });
                    fileResponse = new Response(Buffer.from("image data"), {
                        status: 200,
                    });
                    mockFetch.mockResolvedValueOnce(redirectResponse).mockResolvedValueOnce(fileResponse);
                    return [4 /*yield*/, fetchWithSlackAuth("https://files.slack.com/test.jpg", "xoxb-test-token")];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(mockFetch).toHaveBeenNthCalledWith(2, "https://cdn.slack.com/new-url", {
                        redirect: "follow",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveSlackMedia", function () {
    (0, vitest_1.beforeEach)(function () {
        mockFetch = vitest_1.vi.fn();
        globalThis.fetch = mockFetch;
        vitest_1.vi.spyOn(ssrf, "resolvePinnedHostname").mockImplementation(function (hostname) { return __awaiter(void 0, void 0, void 0, function () {
            var normalized, addresses;
            return __generator(this, function (_a) {
                normalized = hostname.trim().toLowerCase().replace(/\.$/, "");
                addresses = ["93.184.216.34"];
                return [2 /*return*/, {
                        hostname: normalized,
                        addresses: addresses,
                        lookup: ssrf.createPinnedLookup({ hostname: normalized, addresses: addresses }),
                    }];
            });
        }); });
    });
    (0, vitest_1.afterEach)(function () {
        globalThis.fetch = originalFetch;
        vitest_1.vi.resetModules();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("prefers url_private_download over url_private", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSlackMedia, mockResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Mock the store module
                    vitest_1.vi.doMock("../../media/store.js", function () { return ({
                        saveMediaBuffer: vitest_1.vi.fn().mockResolvedValue({
                            path: "/tmp/test.jpg",
                            contentType: "image/jpeg",
                        }),
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    resolveSlackMedia = (_a.sent()).resolveSlackMedia;
                    mockResponse = new Response(Buffer.from("image data"), {
                        status: 200,
                        headers: { "content-type": "image/jpeg" },
                    });
                    mockFetch.mockResolvedValueOnce(mockResponse);
                    return [4 /*yield*/, resolveSlackMedia({
                            files: [
                                {
                                    url_private: "https://files.slack.com/private.jpg",
                                    url_private_download: "https://files.slack.com/download.jpg",
                                    name: "test.jpg",
                                },
                            ],
                            token: "xoxb-test-token",
                            maxBytes: 1024 * 1024,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledWith("https://files.slack.com/download.jpg", vitest_1.expect.anything());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns null when download fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSlackMedia, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    resolveSlackMedia = (_a.sent()).resolveSlackMedia;
                    // Simulate a network error
                    mockFetch.mockRejectedValueOnce(new Error("Network error"));
                    return [4 /*yield*/, resolveSlackMedia({
                            files: [{ url_private: "https://files.slack.com/test.jpg", name: "test.jpg" }],
                            token: "xoxb-test-token",
                            maxBytes: 1024 * 1024,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns null when no files are provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSlackMedia, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    resolveSlackMedia = (_a.sent()).resolveSlackMedia;
                    return [4 /*yield*/, resolveSlackMedia({
                            files: [],
                            token: "xoxb-test-token",
                            maxBytes: 1024 * 1024,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips files without url_private", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSlackMedia, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    resolveSlackMedia = (_a.sent()).resolveSlackMedia;
                    return [4 /*yield*/, resolveSlackMedia({
                            files: [{ name: "test.jpg" }], // No url_private
                            token: "xoxb-test-token",
                            maxBytes: 1024 * 1024,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBeNull();
                    (0, vitest_1.expect)(mockFetch).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls through to next file when first file returns error", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSlackMedia, errorResponse, successResponse, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Mock the store module
                    vitest_1.vi.doMock("../../media/store.js", function () { return ({
                        saveMediaBuffer: vitest_1.vi.fn().mockResolvedValue({
                            path: "/tmp/test.jpg",
                            contentType: "image/jpeg",
                        }),
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./media.js"); })];
                case 1:
                    resolveSlackMedia = (_a.sent()).resolveSlackMedia;
                    errorResponse = new Response("Not Found", { status: 404 });
                    successResponse = new Response(Buffer.from("image data"), {
                        status: 200,
                        headers: { "content-type": "image/jpeg" },
                    });
                    mockFetch.mockResolvedValueOnce(errorResponse).mockResolvedValueOnce(successResponse);
                    return [4 /*yield*/, resolveSlackMedia({
                            files: [
                                { url_private: "https://files.slack.com/first.jpg", name: "first.jpg" },
                                { url_private: "https://files.slack.com/second.jpg", name: "second.jpg" },
                            ],
                            token: "xoxb-test-token",
                            maxBytes: 1024 * 1024,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).not.toBeNull();
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
