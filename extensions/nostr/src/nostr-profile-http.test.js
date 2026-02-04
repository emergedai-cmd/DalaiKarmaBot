"use strict";
/**
 * Tests for Nostr Profile HTTP Handler
 */
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
var node_http_1 = require("node:http");
var node_net_1 = require("node:net");
var vitest_1 = require("vitest");
var nostr_profile_http_js_1 = require("./nostr-profile-http.js");
// Mock the channel exports
vitest_1.vi.mock("./channel.js", function () { return ({
    publishNostrProfile: vitest_1.vi.fn(),
    getNostrProfileState: vitest_1.vi.fn(),
}); });
// Mock the import module
vitest_1.vi.mock("./nostr-profile-import.js", function () { return ({
    importProfileFromRelays: vitest_1.vi.fn(),
    mergeProfiles: vitest_1.vi.fn(function (local, imported) { return (__assign(__assign({}, imported), local)); }),
}); });
var channel_js_1 = require("./channel.js");
var nostr_profile_import_js_1 = require("./nostr-profile-import.js");
// ============================================================================
// Test Helpers
// ============================================================================
function createMockRequest(method, url, body) {
    var socket = new node_net_1.Socket();
    var req = new node_http_1.IncomingMessage(socket);
    req.method = method;
    req.url = url;
    req.headers = { host: "localhost:3000" };
    if (body) {
        var bodyStr_1 = JSON.stringify(body);
        process.nextTick(function () {
            req.emit("data", Buffer.from(bodyStr_1));
            req.emit("end");
        });
    }
    else {
        process.nextTick(function () {
            req.emit("end");
        });
    }
    return req;
}
function createMockResponse() {
    var res = new node_http_1.ServerResponse({});
    var data = "";
    var statusCode = 200;
    res.write = function (chunk) {
        data += String(chunk);
        return true;
    };
    res.end = function (chunk) {
        if (chunk) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            data += String(chunk);
        }
        return this;
    };
    Object.defineProperty(res, "statusCode", {
        get: function () { return statusCode; },
        set: function (code) {
            statusCode = code;
        },
    });
    res._getData = function () { return data; };
    res._getStatusCode = function () { return statusCode; };
    return res;
}
function createMockContext(overrides) {
    return __assign({ getConfigProfile: vitest_1.vi.fn().mockReturnValue(undefined), updateConfigProfile: vitest_1.vi.fn().mockResolvedValue(undefined), getAccountInfo: vitest_1.vi.fn().mockReturnValue({
            pubkey: "abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
            relays: ["wss://relay.damus.io"],
        }), log: {
            info: vitest_1.vi.fn(),
            warn: vitest_1.vi.fn(),
            error: vitest_1.vi.fn(),
        } }, overrides);
}
// ============================================================================
// Tests
// ============================================================================
(0, vitest_1.describe)("nostr-profile-http", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("route matching", function () {
        (0, vitest_1.it)("returns false for non-nostr paths", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext();
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("GET", "/api/channels/telegram/profile");
                        res = createMockResponse();
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("returns false for paths without accountId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext();
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("GET", "/api/channels/nostr/");
                        res = createMockResponse();
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("handles /api/channels/nostr/:accountId/profile", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext();
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("GET", "/api/channels/nostr/default/profile");
                        res = createMockResponse();
                        vitest_1.vi.mocked(channel_js_1.getNostrProfileState).mockResolvedValue(null);
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("GET /api/channels/nostr/:accountId/profile", function () {
        (0, vitest_1.it)("returns profile and publish state", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext({
                            getConfigProfile: vitest_1.vi.fn().mockReturnValue({
                                name: "testuser",
                                displayName: "Test User",
                            }),
                        });
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("GET", "/api/channels/nostr/default/profile");
                        res = createMockResponse();
                        vitest_1.vi.mocked(channel_js_1.getNostrProfileState).mockResolvedValue({
                            lastPublishedAt: 1234567890,
                            lastPublishedEventId: "abc123",
                            lastPublishResults: { "wss://relay.damus.io": "ok" },
                        });
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(res._getStatusCode()).toBe(200);
                        data = JSON.parse(res._getData());
                        (0, vitest_1.expect)(data.ok).toBe(true);
                        (0, vitest_1.expect)(data.profile.name).toBe("testuser");
                        (0, vitest_1.expect)(data.publishState.lastPublishedAt).toBe(1234567890);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("PUT /api/channels/nostr/:accountId/profile", function () {
        (0, vitest_1.it)("validates profile and publishes", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext();
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("PUT", "/api/channels/nostr/default/profile", {
                            name: "satoshi",
                            displayName: "Satoshi Nakamoto",
                            about: "Creator of Bitcoin",
                        });
                        res = createMockResponse();
                        vitest_1.vi.mocked(channel_js_1.publishNostrProfile).mockResolvedValue({
                            eventId: "event123",
                            createdAt: 1234567890,
                            successes: ["wss://relay.damus.io"],
                            failures: [],
                        });
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(res._getStatusCode()).toBe(200);
                        data = JSON.parse(res._getData());
                        (0, vitest_1.expect)(data.ok).toBe(true);
                        (0, vitest_1.expect)(data.eventId).toBe("event123");
                        (0, vitest_1.expect)(data.successes).toContain("wss://relay.damus.io");
                        (0, vitest_1.expect)(data.persisted).toBe(true);
                        (0, vitest_1.expect)(ctx.updateConfigProfile).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("rejects private IP in picture URL (SSRF protection)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext();
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("PUT", "/api/channels/nostr/default/profile", {
                            name: "hacker",
                            picture: "https://127.0.0.1/evil.jpg",
                        });
                        res = createMockResponse();
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(res._getStatusCode()).toBe(400);
                        data = JSON.parse(res._getData());
                        (0, vitest_1.expect)(data.ok).toBe(false);
                        (0, vitest_1.expect)(data.error).toContain("private");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("rejects non-https URLs", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext();
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("PUT", "/api/channels/nostr/default/profile", {
                            name: "test",
                            picture: "http://example.com/pic.jpg",
                        });
                        res = createMockResponse();
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(res._getStatusCode()).toBe(400);
                        data = JSON.parse(res._getData());
                        (0, vitest_1.expect)(data.ok).toBe(false);
                        // The schema validation catches non-https URLs before SSRF check
                        (0, vitest_1.expect)(data.error).toBe("Validation failed");
                        (0, vitest_1.expect)(data.details).toBeDefined();
                        (0, vitest_1.expect)(data.details.some(function (d) { return d.includes("https"); })).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("does not persist if all relays fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext();
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("PUT", "/api/channels/nostr/default/profile", {
                            name: "test",
                        });
                        res = createMockResponse();
                        vitest_1.vi.mocked(channel_js_1.publishNostrProfile).mockResolvedValue({
                            eventId: "event123",
                            createdAt: 1234567890,
                            successes: [],
                            failures: [{ relay: "wss://relay.damus.io", error: "timeout" }],
                        });
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(res._getStatusCode()).toBe(200);
                        data = JSON.parse(res._getData());
                        (0, vitest_1.expect)(data.persisted).toBe(false);
                        (0, vitest_1.expect)(ctx.updateConfigProfile).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("enforces rate limiting", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, i, req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext();
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        vitest_1.vi.mocked(channel_js_1.publishNostrProfile).mockResolvedValue({
                            eventId: "event123",
                            createdAt: 1234567890,
                            successes: ["wss://relay.damus.io"],
                            failures: [],
                        });
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 6)) return [3 /*break*/, 4];
                        req = createMockRequest("PUT", "/api/channels/nostr/rate-test/profile", {
                            name: "user".concat(i),
                        });
                        res = createMockResponse();
                        return [4 /*yield*/, handler(req, res)];
                    case 2:
                        _a.sent();
                        if (i < 5) {
                            (0, vitest_1.expect)(res._getStatusCode()).toBe(200);
                        }
                        else {
                            (0, vitest_1.expect)(res._getStatusCode()).toBe(429);
                            data = JSON.parse(res._getData());
                            (0, vitest_1.expect)(data.error).toContain("Rate limit");
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("POST /api/channels/nostr/:accountId/profile/import", function () {
        (0, vitest_1.it)("imports profile from relays", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext();
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("POST", "/api/channels/nostr/default/profile/import", {});
                        res = createMockResponse();
                        vitest_1.vi.mocked(nostr_profile_import_js_1.importProfileFromRelays).mockResolvedValue({
                            ok: true,
                            profile: {
                                name: "imported",
                                displayName: "Imported User",
                            },
                            event: {
                                id: "evt123",
                                pubkey: "abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
                                created_at: 1234567890,
                            },
                            relaysQueried: ["wss://relay.damus.io"],
                            sourceRelay: "wss://relay.damus.io",
                        });
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(res._getStatusCode()).toBe(200);
                        data = JSON.parse(res._getData());
                        (0, vitest_1.expect)(data.ok).toBe(true);
                        (0, vitest_1.expect)(data.imported.name).toBe("imported");
                        (0, vitest_1.expect)(data.saved).toBe(false); // autoMerge not requested
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("auto-merges when requested", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext({
                            getConfigProfile: vitest_1.vi.fn().mockReturnValue({ about: "local bio" }),
                        });
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("POST", "/api/channels/nostr/default/profile/import", {
                            autoMerge: true,
                        });
                        res = createMockResponse();
                        vitest_1.vi.mocked(nostr_profile_import_js_1.importProfileFromRelays).mockResolvedValue({
                            ok: true,
                            profile: {
                                name: "imported",
                                displayName: "Imported User",
                            },
                            event: {
                                id: "evt123",
                                pubkey: "abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
                                created_at: 1234567890,
                            },
                            relaysQueried: ["wss://relay.damus.io"],
                            sourceRelay: "wss://relay.damus.io",
                        });
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(res._getStatusCode()).toBe(200);
                        data = JSON.parse(res._getData());
                        (0, vitest_1.expect)(data.saved).toBe(true);
                        (0, vitest_1.expect)(ctx.updateConfigProfile).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("returns error when account not found", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ctx, handler, req, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = createMockContext({
                            getAccountInfo: vitest_1.vi.fn().mockReturnValue(null),
                        });
                        handler = (0, nostr_profile_http_js_1.createNostrProfileHttpHandler)(ctx);
                        req = createMockRequest("POST", "/api/channels/nostr/unknown/profile/import", {});
                        res = createMockResponse();
                        return [4 /*yield*/, handler(req, res)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(res._getStatusCode()).toBe(404);
                        data = JSON.parse(res._getData());
                        (0, vitest_1.expect)(data.error).toContain("not found");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
