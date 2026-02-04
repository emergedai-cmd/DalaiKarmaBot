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
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var provider_usage_js_1 = require("./provider-usage.js");
(0, vitest_1.describe)("provider usage formatting", function () {
    (0, vitest_1.it)("returns null when no usage is available", function () {
        var summary = { updatedAt: 0, providers: [] };
        (0, vitest_1.expect)((0, provider_usage_js_1.formatUsageSummaryLine)(summary)).toBeNull();
    });
    (0, vitest_1.it)("picks the most-used window for summary line", function () {
        var summary = {
            updatedAt: 0,
            providers: [
                {
                    provider: "anthropic",
                    displayName: "Claude",
                    windows: [
                        { label: "5h", usedPercent: 10 },
                        { label: "Week", usedPercent: 60 },
                    ],
                },
            ],
        };
        var line = (0, provider_usage_js_1.formatUsageSummaryLine)(summary, { now: 0 });
        (0, vitest_1.expect)(line).toContain("Claude");
        (0, vitest_1.expect)(line).toContain("40% left");
        (0, vitest_1.expect)(line).toContain("(Week");
    });
    (0, vitest_1.it)("prints provider errors in report output", function () {
        var summary = {
            updatedAt: 0,
            providers: [
                {
                    provider: "openai-codex",
                    displayName: "Codex",
                    windows: [],
                    error: "Token expired",
                },
            ],
        };
        var lines = (0, provider_usage_js_1.formatUsageReportLines)(summary);
        (0, vitest_1.expect)(lines.join("\n")).toContain("Codex: Token expired");
    });
    (0, vitest_1.it)("includes reset countdowns in report lines", function () {
        var now = Date.UTC(2026, 0, 7, 0, 0, 0);
        var summary = {
            updatedAt: now,
            providers: [
                {
                    provider: "anthropic",
                    displayName: "Claude",
                    windows: [{ label: "5h", usedPercent: 20, resetAt: now + 60000 }],
                },
            ],
        };
        var lines = (0, provider_usage_js_1.formatUsageReportLines)(summary, { now: now });
        (0, vitest_1.expect)(lines.join("\n")).toContain("resets 1m");
    });
});
(0, vitest_1.describe)("provider usage loading", function () {
    (0, vitest_1.it)("loads usage snapshots with injected auth", function () { return __awaiter(void 0, void 0, void 0, function () {
        var makeResponse, mockFetch, summary, claude, minimax, zai;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    makeResponse = function (status, body) {
                        var payload = typeof body === "string" ? body : JSON.stringify(body);
                        var headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
                        return new Response(payload, { status: status, headers: headers });
                    };
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("api.anthropic.com")) {
                                return [2 /*return*/, makeResponse(200, {
                                        five_hour: { utilization: 20, resets_at: "2026-01-07T01:00:00Z" },
                                    })];
                            }
                            if (url.includes("api.z.ai")) {
                                return [2 /*return*/, makeResponse(200, {
                                        success: true,
                                        code: 200,
                                        data: {
                                            planName: "Pro",
                                            limits: [
                                                {
                                                    type: "TOKENS_LIMIT",
                                                    percentage: 25,
                                                    unit: 3,
                                                    number: 6,
                                                    nextResetTime: "2026-01-07T06:00:00Z",
                                                },
                                            ],
                                        },
                                    })];
                            }
                            if (url.includes("api.minimaxi.com/v1/api/openplatform/coding_plan/remains")) {
                                return [2 /*return*/, makeResponse(200, {
                                        base_resp: { status_code: 0, status_msg: "ok" },
                                        data: {
                                            total: 200,
                                            remain: 50,
                                            reset_at: "2026-01-07T05:00:00Z",
                                            plan_name: "Coding Plan",
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)({
                            now: Date.UTC(2026, 0, 7, 0, 0, 0),
                            auth: [
                                { provider: "anthropic", token: "token-1" },
                                { provider: "minimax", token: "token-1b" },
                                { provider: "zai", token: "token-2" },
                            ],
                            fetch: mockFetch,
                        })];
                case 1:
                    summary = _c.sent();
                    (0, vitest_1.expect)(summary.providers).toHaveLength(3);
                    claude = summary.providers.find(function (p) { return p.provider === "anthropic"; });
                    minimax = summary.providers.find(function (p) { return p.provider === "minimax"; });
                    zai = summary.providers.find(function (p) { return p.provider === "zai"; });
                    (0, vitest_1.expect)((_a = claude === null || claude === void 0 ? void 0 : claude.windows[0]) === null || _a === void 0 ? void 0 : _a.label).toBe("5h");
                    (0, vitest_1.expect)((_b = minimax === null || minimax === void 0 ? void 0 : minimax.windows[0]) === null || _b === void 0 ? void 0 : _b.usedPercent).toBe(75);
                    (0, vitest_1.expect)(zai === null || zai === void 0 ? void 0 : zai.plan).toBe("Pro");
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles nested MiniMax usage payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var makeResponse, mockFetch, summary, minimax;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    makeResponse = function (status, body) {
                        var payload = typeof body === "string" ? body : JSON.stringify(body);
                        var headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
                        return new Response(payload, { status: status, headers: headers });
                    };
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("api.minimaxi.com/v1/api/openplatform/coding_plan/remains")) {
                                return [2 /*return*/, makeResponse(200, {
                                        base_resp: { status_code: 0, status_msg: "ok" },
                                        data: {
                                            plan_name: "Coding Plan",
                                            usage: {
                                                prompt_limit: 200,
                                                prompt_remain: 50,
                                                next_reset_time: "2026-01-07T05:00:00Z",
                                            },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)({
                            now: Date.UTC(2026, 0, 7, 0, 0, 0),
                            auth: [{ provider: "minimax", token: "token-1b" }],
                            fetch: mockFetch,
                        })];
                case 1:
                    summary = _b.sent();
                    minimax = summary.providers.find(function (p) { return p.provider === "minimax"; });
                    (0, vitest_1.expect)((_a = minimax === null || minimax === void 0 ? void 0 : minimax.windows[0]) === null || _a === void 0 ? void 0 : _a.usedPercent).toBe(75);
                    (0, vitest_1.expect)(minimax === null || minimax === void 0 ? void 0 : minimax.plan).toBe("Coding Plan");
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers MiniMax count-based usage when percent looks inverted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var makeResponse, mockFetch, summary, minimax;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    makeResponse = function (status, body) {
                        var payload = typeof body === "string" ? body : JSON.stringify(body);
                        var headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
                        return new Response(payload, { status: status, headers: headers });
                    };
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("api.minimaxi.com/v1/api/openplatform/coding_plan/remains")) {
                                return [2 /*return*/, makeResponse(200, {
                                        base_resp: { status_code: 0, status_msg: "ok" },
                                        data: {
                                            prompt_limit: 200,
                                            prompt_remain: 150,
                                            usage_percent: 75,
                                            next_reset_time: "2026-01-07T05:00:00Z",
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)({
                            now: Date.UTC(2026, 0, 7, 0, 0, 0),
                            auth: [{ provider: "minimax", token: "token-1b" }],
                            fetch: mockFetch,
                        })];
                case 1:
                    summary = _b.sent();
                    minimax = summary.providers.find(function (p) { return p.provider === "minimax"; });
                    (0, vitest_1.expect)((_a = minimax === null || minimax === void 0 ? void 0 : minimax.windows[0]) === null || _a === void 0 ? void 0 : _a.usedPercent).toBe(25);
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles MiniMax model_remains usage payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var makeResponse, mockFetch, summary, minimax;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    makeResponse = function (status, body) {
                        var payload = typeof body === "string" ? body : JSON.stringify(body);
                        var headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
                        return new Response(payload, { status: status, headers: headers });
                    };
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("api.minimaxi.com/v1/api/openplatform/coding_plan/remains")) {
                                return [2 /*return*/, makeResponse(200, {
                                        base_resp: { status_code: 0, status_msg: "ok" },
                                        model_remains: [
                                            {
                                                start_time: 1736217600,
                                                end_time: 1736235600,
                                                remains_time: 600,
                                                current_interval_total_count: 120,
                                                current_interval_usage_count: 30,
                                                model_name: "MiniMax-M2.1",
                                            },
                                        ],
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)({
                            now: Date.UTC(2026, 0, 7, 0, 0, 0),
                            auth: [{ provider: "minimax", token: "token-1b" }],
                            fetch: mockFetch,
                        })];
                case 1:
                    summary = _b.sent();
                    minimax = summary.providers.find(function (p) { return p.provider === "minimax"; });
                    (0, vitest_1.expect)((_a = minimax === null || minimax === void 0 ? void 0 : minimax.windows[0]) === null || _a === void 0 ? void 0 : _a.usedPercent).toBe(25);
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("discovers Claude usage from token auth profiles", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, temp_home_js_1.withTempHome)(function (tempHome) { return __awaiter(void 0, void 0, void 0, function () {
                        var agentDir, store, makeResponse, mockFetch, summary, claude;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    agentDir = node_path_1.default.join((_a = process.env.OPENCLAW_STATE_DIR) !== null && _a !== void 0 ? _a : node_path_1.default.join(tempHome, ".openclaw"), "agents", "main", "agent");
                                    node_fs_1.default.mkdirSync(agentDir, { recursive: true, mode: 448 });
                                    node_fs_1.default.writeFileSync(node_path_1.default.join(agentDir, "auth-profiles.json"), "".concat(JSON.stringify({
                                        version: 1,
                                        order: { anthropic: ["anthropic:default"] },
                                        profiles: {
                                            "anthropic:default": {
                                                type: "token",
                                                provider: "anthropic",
                                                token: "token-1",
                                                expires: Date.UTC(2100, 0, 1, 0, 0, 0),
                                            },
                                        },
                                    }, null, 2), "\n"), "utf8");
                                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir, {
                                        allowKeychainPrompt: false,
                                    });
                                    (0, vitest_1.expect)((0, auth_profiles_js_1.listProfilesForProvider)(store, "anthropic")).toContain("anthropic:default");
                                    makeResponse = function (status, body) {
                                        var payload = typeof body === "string" ? body : JSON.stringify(body);
                                        var headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
                                        return new Response(payload, { status: status, headers: headers });
                                    };
                                    mockFetch = vitest_1.vi.fn(function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                                        var url, headers;
                                        var _a;
                                        return __generator(this, function (_b) {
                                            url = typeof input === "string"
                                                ? input
                                                : input instanceof URL
                                                    ? input.toString()
                                                    : input.url;
                                            if (url.includes("api.anthropic.com/api/oauth/usage")) {
                                                headers = ((_a = init === null || init === void 0 ? void 0 : init.headers) !== null && _a !== void 0 ? _a : {});
                                                (0, vitest_1.expect)(headers.Authorization).toBe("Bearer token-1");
                                                return [2 /*return*/, makeResponse(200, {
                                                        five_hour: {
                                                            utilization: 20,
                                                            resets_at: "2026-01-07T01:00:00Z",
                                                        },
                                                    })];
                                            }
                                            return [2 /*return*/, makeResponse(404, "not found")];
                                        });
                                    }); });
                                    return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)({
                                            now: Date.UTC(2026, 0, 7, 0, 0, 0),
                                            providers: ["anthropic"],
                                            agentDir: agentDir,
                                            fetch: mockFetch,
                                        })];
                                case 1:
                                    summary = _c.sent();
                                    (0, vitest_1.expect)(summary.providers).toHaveLength(1);
                                    claude = summary.providers[0];
                                    (0, vitest_1.expect)(claude === null || claude === void 0 ? void 0 : claude.provider).toBe("anthropic");
                                    (0, vitest_1.expect)((_b = claude === null || claude === void 0 ? void 0 : claude.windows[0]) === null || _b === void 0 ? void 0 : _b.label).toBe("5h");
                                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalled();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, {
                        env: {
                            OPENCLAW_STATE_DIR: function (home) { return node_path_1.default.join(home, ".openclaw"); },
                        },
                        prefix: "openclaw-provider-usage-",
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to claude.ai web usage when OAuth scope is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cookieSnapshot, makeResponse_1, mockFetch, summary, claude;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cookieSnapshot = process.env.CLAUDE_AI_SESSION_KEY;
                    process.env.CLAUDE_AI_SESSION_KEY = "sk-ant-web-1";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    makeResponse_1 = function (status, body) {
                        var payload = typeof body === "string" ? body : JSON.stringify(body);
                        var headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
                        return new Response(payload, { status: status, headers: headers });
                    };
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("api.anthropic.com/api/oauth/usage")) {
                                return [2 /*return*/, makeResponse_1(403, {
                                        type: "error",
                                        error: {
                                            type: "permission_error",
                                            message: "OAuth token does not meet scope requirement user:profile",
                                        },
                                    })];
                            }
                            if (url.includes("claude.ai/api/organizations/org-1/usage")) {
                                return [2 /*return*/, makeResponse_1(200, {
                                        five_hour: { utilization: 20, resets_at: "2026-01-07T01:00:00Z" },
                                        seven_day: { utilization: 40, resets_at: "2026-01-08T01:00:00Z" },
                                        seven_day_opus: { utilization: 5 },
                                    })];
                            }
                            if (url.includes("claude.ai/api/organizations")) {
                                return [2 /*return*/, makeResponse_1(200, [{ uuid: "org-1", name: "Test" }])];
                            }
                            return [2 /*return*/, makeResponse_1(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)({
                            now: Date.UTC(2026, 0, 7, 0, 0, 0),
                            auth: [{ provider: "anthropic", token: "sk-ant-oauth-1" }],
                            fetch: mockFetch,
                        })];
                case 2:
                    summary = _a.sent();
                    (0, vitest_1.expect)(summary.providers).toHaveLength(1);
                    claude = summary.providers[0];
                    (0, vitest_1.expect)(claude === null || claude === void 0 ? void 0 : claude.provider).toBe("anthropic");
                    (0, vitest_1.expect)(claude === null || claude === void 0 ? void 0 : claude.windows.some(function (w) { return w.label === "5h"; })).toBe(true);
                    (0, vitest_1.expect)(claude === null || claude === void 0 ? void 0 : claude.windows.some(function (w) { return w.label === "Week"; })).toBe(true);
                    return [3 /*break*/, 4];
                case 3:
                    if (cookieSnapshot === undefined) {
                        delete process.env.CLAUDE_AI_SESSION_KEY;
                    }
                    else {
                        process.env.CLAUDE_AI_SESSION_KEY = cookieSnapshot;
                    }
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
