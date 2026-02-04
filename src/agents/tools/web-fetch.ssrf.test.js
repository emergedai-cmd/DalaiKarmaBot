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
var lookupMock = vitest_1.vi.fn();
var resolvePinnedHostname = ssrf.resolvePinnedHostname;
function makeHeaders(map) {
    return {
        get: function (key) { var _a; return (_a = map[key.toLowerCase()]) !== null && _a !== void 0 ? _a : null; },
    };
}
function redirectResponse(location) {
    return {
        ok: false,
        status: 302,
        headers: makeHeaders({ location: location }),
        body: { cancel: vitest_1.vi.fn() },
    };
}
function textResponse(body) {
    var _this = this;
    return {
        ok: true,
        status: 200,
        headers: makeHeaders({ "content-type": "text/plain" }),
        text: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, body];
        }); }); },
    };
}
(0, vitest_1.describe)("web_fetch SSRF protection", function () {
    var priorFetch = global.fetch;
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.spyOn(ssrf, "resolvePinnedHostname").mockImplementation(function (hostname) {
            return resolvePinnedHostname(hostname, lookupMock);
        });
    });
    (0, vitest_1.afterEach)(function () {
        // @ts-expect-error restore
        global.fetch = priorFetch;
        lookupMock.mockReset();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("blocks localhost hostnames before fetch/firecrawl", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchSpy, createWebFetchTool, tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fetchSpy = vitest_1.vi.fn();
                    // @ts-expect-error mock fetch
                    global.fetch = fetchSpy;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./web-tools.js"); })];
                case 1:
                    createWebFetchTool = (_b.sent()).createWebFetchTool;
                    tool = createWebFetchTool({
                        config: {
                            tools: {
                                web: {
                                    fetch: {
                                        cacheTtlMinutes: 0,
                                        firecrawl: { apiKey: "firecrawl-test" },
                                    },
                                },
                            },
                        },
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((_a = tool === null || tool === void 0 ? void 0 : tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, "call", { url: "http://localhost/test" })).rejects.toThrow(/Blocked hostname/i)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(fetchSpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(lookupMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks private IP literals without DNS", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchSpy, createWebFetchTool, tool;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fetchSpy = vitest_1.vi.fn();
                    // @ts-expect-error mock fetch
                    global.fetch = fetchSpy;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./web-tools.js"); })];
                case 1:
                    createWebFetchTool = (_c.sent()).createWebFetchTool;
                    tool = createWebFetchTool({
                        config: {
                            tools: { web: { fetch: { cacheTtlMinutes: 0, firecrawl: { enabled: false } } } },
                        },
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((_a = tool === null || tool === void 0 ? void 0 : tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, "call", { url: "http://127.0.0.1/test" })).rejects.toThrow(/private|internal|blocked/i)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((_b = tool === null || tool === void 0 ? void 0 : tool.execute) === null || _b === void 0 ? void 0 : _b.call(tool, "call", { url: "http://[::ffff:127.0.0.1]/" })).rejects.toThrow(/private|internal|blocked/i)];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(fetchSpy).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(lookupMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks when DNS resolves to private addresses", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchSpy, createWebFetchTool, tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    lookupMock.mockImplementation(function (hostname) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (hostname === "public.test") {
                                return [2 /*return*/, [{ address: "93.184.216.34", family: 4 }]];
                            }
                            return [2 /*return*/, [{ address: "10.0.0.5", family: 4 }]];
                        });
                    }); });
                    fetchSpy = vitest_1.vi.fn();
                    // @ts-expect-error mock fetch
                    global.fetch = fetchSpy;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./web-tools.js"); })];
                case 1:
                    createWebFetchTool = (_b.sent()).createWebFetchTool;
                    tool = createWebFetchTool({
                        config: {
                            tools: { web: { fetch: { cacheTtlMinutes: 0, firecrawl: { enabled: false } } } },
                        },
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((_a = tool === null || tool === void 0 ? void 0 : tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, "call", { url: "https://private.test/resource" })).rejects.toThrow(/private|internal|blocked/i)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(fetchSpy).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks redirects to private hosts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchSpy, createWebFetchTool, tool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    lookupMock.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
                    fetchSpy = vitest_1.vi.fn().mockResolvedValueOnce(redirectResponse("http://127.0.0.1/secret"));
                    // @ts-expect-error mock fetch
                    global.fetch = fetchSpy;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./web-tools.js"); })];
                case 1:
                    createWebFetchTool = (_b.sent()).createWebFetchTool;
                    tool = createWebFetchTool({
                        config: {
                            tools: {
                                web: {
                                    fetch: { cacheTtlMinutes: 0, firecrawl: { apiKey: "firecrawl-test" } },
                                },
                            },
                        },
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((_a = tool === null || tool === void 0 ? void 0 : tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, "call", { url: "https://example.com" })).rejects.toThrow(/private|internal|blocked/i)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(fetchSpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows public hosts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchSpy, createWebFetchTool, tool, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    lookupMock.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
                    fetchSpy = vitest_1.vi.fn().mockResolvedValue(textResponse("ok"));
                    // @ts-expect-error mock fetch
                    global.fetch = fetchSpy;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./web-tools.js"); })];
                case 1:
                    createWebFetchTool = (_b.sent()).createWebFetchTool;
                    tool = createWebFetchTool({
                        config: {
                            tools: { web: { fetch: { cacheTtlMinutes: 0, firecrawl: { enabled: false } } } },
                        },
                    });
                    return [4 /*yield*/, ((_a = tool === null || tool === void 0 ? void 0 : tool.execute) === null || _a === void 0 ? void 0 : _a.call(tool, "call", { url: "https://example.com" }))];
                case 2:
                    result = _b.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.details).toMatchObject({
                        status: 200,
                        extractor: "raw",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
