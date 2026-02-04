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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var oauth_js_1 = require("./oauth.js");
var store_js_1 = require("./store.js");
(0, vitest_1.describe)("resolveApiKeyForProfile fallback to main agent", function () {
    var previousStateDir = process.env.OPENCLAW_STATE_DIR;
    var previousAgentDir = process.env.OPENCLAW_AGENT_DIR;
    var previousPiAgentDir = process.env.PI_CODING_AGENT_DIR;
    var tmpDir;
    var mainAgentDir;
    var secondaryAgentDir;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "oauth-fallback-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    mainAgentDir = node_path_1.default.join(tmpDir, "agents", "main", "agent");
                    secondaryAgentDir = node_path_1.default.join(tmpDir, "agents", "kids", "agent");
                    return [4 /*yield*/, promises_1.default.mkdir(mainAgentDir, { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(secondaryAgentDir, { recursive: true })];
                case 3:
                    _a.sent();
                    // Set environment variables so resolveOpenClawAgentDir() returns mainAgentDir
                    process.env.OPENCLAW_STATE_DIR = tmpDir;
                    process.env.OPENCLAW_AGENT_DIR = mainAgentDir;
                    process.env.PI_CODING_AGENT_DIR = mainAgentDir;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.unstubAllGlobals();
                    // Restore original environment
                    if (previousStateDir === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previousStateDir;
                    }
                    if (previousAgentDir === undefined) {
                        delete process.env.OPENCLAW_AGENT_DIR;
                    }
                    else {
                        process.env.OPENCLAW_AGENT_DIR = previousAgentDir;
                    }
                    if (previousPiAgentDir === undefined) {
                        delete process.env.PI_CODING_AGENT_DIR;
                    }
                    else {
                        process.env.PI_CODING_AGENT_DIR = previousPiAgentDir;
                    }
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to main agent credentials when secondary agent token is expired and refresh fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var profileId, now, expiredTime, freshTime, secondaryStore, mainStore, fetchSpy, loadedSecondaryStore, result, updatedSecondaryStore, _a, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    profileId = "anthropic:claude-cli";
                    now = Date.now();
                    expiredTime = now - 60 * 60 * 1000;
                    freshTime = now + 60 * 60 * 1000;
                    secondaryStore = {
                        version: 1,
                        profiles: (_c = {},
                            _c[profileId] = {
                                type: "oauth",
                                provider: "anthropic",
                                access: "expired-access-token",
                                refresh: "expired-refresh-token",
                                expires: expiredTime,
                            },
                            _c),
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(secondaryAgentDir, "auth-profiles.json"), JSON.stringify(secondaryStore))];
                case 1:
                    _e.sent();
                    mainStore = {
                        version: 1,
                        profiles: (_d = {},
                            _d[profileId] = {
                                type: "oauth",
                                provider: "anthropic",
                                access: "fresh-access-token",
                                refresh: "fresh-refresh-token",
                                expires: freshTime,
                            },
                            _d),
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(mainAgentDir, "auth-profiles.json"), JSON.stringify(mainStore))];
                case 2:
                    _e.sent();
                    fetchSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, new Response(JSON.stringify({ error: "invalid_grant" }), {
                                    status: 400,
                                    headers: { "Content-Type": "application/json" },
                                })];
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchSpy);
                    loadedSecondaryStore = (0, store_js_1.ensureAuthProfileStore)(secondaryAgentDir);
                    return [4 /*yield*/, (0, oauth_js_1.resolveApiKeyForProfile)({
                            store: loadedSecondaryStore,
                            profileId: profileId,
                            agentDir: secondaryAgentDir,
                        })];
                case 3:
                    result = _e.sent();
                    (0, vitest_1.expect)(result).not.toBeNull();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.apiKey).toBe("fresh-access-token");
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.provider).toBe("anthropic");
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(secondaryAgentDir, "auth-profiles.json"), "utf8")];
                case 4:
                    updatedSecondaryStore = _b.apply(_a, [_e.sent()]);
                    (0, vitest_1.expect)(updatedSecondaryStore.profiles[profileId]).toMatchObject({
                        access: "fresh-access-token",
                        expires: freshTime,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws error when both secondary and main agent credentials are expired", function () { return __awaiter(void 0, void 0, void 0, function () {
        var profileId, now, expiredTime, expiredStore, fetchSpy, loadedSecondaryStore;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    profileId = "anthropic:claude-cli";
                    now = Date.now();
                    expiredTime = now - 60 * 60 * 1000;
                    expiredStore = {
                        version: 1,
                        profiles: (_a = {},
                            _a[profileId] = {
                                type: "oauth",
                                provider: "anthropic",
                                access: "expired-access-token",
                                refresh: "expired-refresh-token",
                                expires: expiredTime,
                            },
                            _a),
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(secondaryAgentDir, "auth-profiles.json"), JSON.stringify(expiredStore))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(mainAgentDir, "auth-profiles.json"), JSON.stringify(expiredStore))];
                case 2:
                    _b.sent();
                    fetchSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, new Response(JSON.stringify({ error: "invalid_grant" }), {
                                    status: 400,
                                    headers: { "Content-Type": "application/json" },
                                })];
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchSpy);
                    loadedSecondaryStore = (0, store_js_1.ensureAuthProfileStore)(secondaryAgentDir);
                    // Should throw because both agents have expired credentials
                    return [4 /*yield*/, (0, vitest_1.expect)((0, oauth_js_1.resolveApiKeyForProfile)({
                            store: loadedSecondaryStore,
                            profileId: profileId,
                            agentDir: secondaryAgentDir,
                        })).rejects.toThrow(/OAuth token refresh failed/)];
                case 3:
                    // Should throw because both agents have expired credentials
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
