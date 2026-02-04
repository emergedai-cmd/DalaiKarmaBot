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
var provider_usage_fetch_antigravity_js_1 = require("./provider-usage.fetch.antigravity.js");
var makeResponse = function (status, body) {
    var payload = typeof body === "string" ? body : JSON.stringify(body);
    var headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
    return new Response(payload, { status: status, headers: headers });
};
(0, vitest_1.describe)("fetchAntigravityUsage", function () {
    (0, vitest_1.it)("returns 3 windows when both endpoints succeed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot, creditsWindow, proWindow, flashWindow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, {
                                        availablePromptCredits: 750,
                                        planInfo: { monthlyPromptCredits: 1000 },
                                        planType: "Standard",
                                        currentTier: { id: "tier1", name: "Standard Tier" },
                                    })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, {
                                        models: {
                                            "gemini-pro-1.5": {
                                                quotaInfo: {
                                                    remainingFraction: 0.6,
                                                    resetTime: "2026-01-08T00:00:00Z",
                                                    isExhausted: false,
                                                },
                                            },
                                            "gemini-flash-2.0": {
                                                quotaInfo: {
                                                    remainingFraction: 0.8,
                                                    resetTime: "2026-01-08T00:00:00Z",
                                                    isExhausted: false,
                                                },
                                            },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.provider).toBe("google-antigravity");
                    (0, vitest_1.expect)(snapshot.displayName).toBe("Antigravity");
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(3);
                    (0, vitest_1.expect)(snapshot.plan).toBe("Standard Tier");
                    (0, vitest_1.expect)(snapshot.error).toBeUndefined();
                    creditsWindow = snapshot.windows.find(function (w) { return w.label === "Credits"; });
                    (0, vitest_1.expect)(creditsWindow === null || creditsWindow === void 0 ? void 0 : creditsWindow.usedPercent).toBe(25); // (1000 - 750) / 1000 * 100
                    proWindow = snapshot.windows.find(function (w) { return w.label === "gemini-pro-1.5"; });
                    (0, vitest_1.expect)(proWindow === null || proWindow === void 0 ? void 0 : proWindow.usedPercent).toBe(40); // (1 - 0.6) * 100
                    (0, vitest_1.expect)(proWindow === null || proWindow === void 0 ? void 0 : proWindow.resetAt).toBe(new Date("2026-01-08T00:00:00Z").getTime());
                    flashWindow = snapshot.windows.find(function (w) { return w.label === "gemini-flash-2.0"; });
                    (0, vitest_1.expect)(flashWindow === null || flashWindow === void 0 ? void 0 : flashWindow.usedPercent).toBeCloseTo(20, 1); // (1 - 0.8) * 100
                    (0, vitest_1.expect)(flashWindow === null || flashWindow === void 0 ? void 0 : flashWindow.resetAt).toBe(new Date("2026-01-08T00:00:00Z").getTime());
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns Credits only when loadCodeAssist succeeds but fetchAvailableModels fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot, creditsWindow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, {
                                        availablePromptCredits: 250,
                                        planInfo: { monthlyPromptCredits: 1000 },
                                        currentTier: { name: "Free" },
                                    })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(403, { error: { message: "Permission denied" } })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.provider).toBe("google-antigravity");
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(1);
                    (0, vitest_1.expect)(snapshot.plan).toBe("Free");
                    (0, vitest_1.expect)(snapshot.error).toBeUndefined();
                    creditsWindow = snapshot.windows[0];
                    (0, vitest_1.expect)(creditsWindow === null || creditsWindow === void 0 ? void 0 : creditsWindow.label).toBe("Credits");
                    (0, vitest_1.expect)(creditsWindow === null || creditsWindow === void 0 ? void 0 : creditsWindow.usedPercent).toBe(75); // (1000 - 250) / 1000 * 100
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns model IDs when fetchAvailableModels succeeds but loadCodeAssist fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot, proWindow, flashWindow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(500, "Internal server error")];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, {
                                        models: {
                                            "gemini-pro-1.5": {
                                                quotaInfo: { remainingFraction: 0.5, resetTime: "2026-01-08T00:00:00Z" },
                                            },
                                            "gemini-flash-2.0": {
                                                quotaInfo: { remainingFraction: 0.7, resetTime: "2026-01-08T00:00:00Z" },
                                            },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.provider).toBe("google-antigravity");
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(2);
                    (0, vitest_1.expect)(snapshot.error).toBeUndefined();
                    proWindow = snapshot.windows.find(function (w) { return w.label === "gemini-pro-1.5"; });
                    (0, vitest_1.expect)(proWindow === null || proWindow === void 0 ? void 0 : proWindow.usedPercent).toBe(50); // (1 - 0.5) * 100
                    flashWindow = snapshot.windows.find(function (w) { return w.label === "gemini-flash-2.0"; });
                    (0, vitest_1.expect)(flashWindow === null || flashWindow === void 0 ? void 0 : flashWindow.usedPercent).toBeCloseTo(30, 1); // (1 - 0.7) * 100
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses cloudaicompanionProject string as project id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedBody, mockFetch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        var _a;
                        return __generator(this, function (_b) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, {
                                        availablePromptCredits: 900,
                                        planInfo: { monthlyPromptCredits: 1000 },
                                        cloudaicompanionProject: "projects/alpha",
                                    })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                capturedBody = (_a = init === null || init === void 0 ? void 0 : init.body) === null || _a === void 0 ? void 0 : _a.toString();
                                return [2 /*return*/, makeResponse(200, { models: {} })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedBody).toBe(JSON.stringify({ project: "projects/alpha" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses cloudaicompanionProject object id when present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedBody, mockFetch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        var _a;
                        return __generator(this, function (_b) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, {
                                        availablePromptCredits: 900,
                                        planInfo: { monthlyPromptCredits: 1000 },
                                        cloudaicompanionProject: { id: "projects/beta" },
                                    })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                capturedBody = (_a = init === null || init === void 0 ? void 0 : init.body) === null || _a === void 0 ? void 0 : _a.toString();
                                return [2 /*return*/, makeResponse(200, { models: {} })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(capturedBody).toBe(JSON.stringify({ project: "projects/beta" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns error snapshot when both endpoints fail", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(403, { error: { message: "Access denied" } })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(403, "Forbidden")];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.provider).toBe("google-antigravity");
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(0);
                    (0, vitest_1.expect)(snapshot.error).toBe("Access denied");
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns Token expired when fetchAvailableModels returns 401 and no windows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(500, "Boom")];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(401, { error: { message: "Unauthorized" } })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.error).toBe("Token expired");
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("extracts plan info from currentTier.name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, {
                                        availablePromptCredits: 500,
                                        planInfo: { monthlyPromptCredits: 1000 },
                                        planType: "Basic",
                                        currentTier: { id: "tier2", name: "Premium Tier" },
                                    })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(500, "Error")];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.plan).toBe("Premium Tier");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to planType when currentTier.name is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, {
                                        availablePromptCredits: 500,
                                        planInfo: { monthlyPromptCredits: 1000 },
                                        planType: "Basic Plan",
                                    })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(500, "Error")];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.plan).toBe("Basic Plan");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes reset times in model windows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resetTime, mockFetch, snapshot, proWindow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resetTime = "2026-01-10T12:00:00Z";
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(500, "Error")];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, {
                                        models: {
                                            "gemini-pro-experimental": {
                                                quotaInfo: { remainingFraction: 0.3, resetTime: resetTime },
                                            },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    proWindow = snapshot.windows.find(function (w) { return w.label === "gemini-pro-experimental"; });
                    (0, vitest_1.expect)(proWindow === null || proWindow === void 0 ? void 0 : proWindow.resetAt).toBe(new Date(resetTime).getTime());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("parses string numbers correctly", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot, creditsWindow, flashWindow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, {
                                        availablePromptCredits: "600",
                                        planInfo: { monthlyPromptCredits: "1000" },
                                    })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, {
                                        models: {
                                            "gemini-flash-lite": {
                                                quotaInfo: { remainingFraction: "0.9" },
                                            },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(2);
                    creditsWindow = snapshot.windows.find(function (w) { return w.label === "Credits"; });
                    (0, vitest_1.expect)(creditsWindow === null || creditsWindow === void 0 ? void 0 : creditsWindow.usedPercent).toBe(40); // (1000 - 600) / 1000 * 100
                    flashWindow = snapshot.windows.find(function (w) { return w.label === "gemini-flash-lite"; });
                    (0, vitest_1.expect)(flashWindow === null || flashWindow === void 0 ? void 0 : flashWindow.usedPercent).toBeCloseTo(10, 1); // (1 - 0.9) * 100
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips internal models", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, {
                                        availablePromptCredits: 500,
                                        planInfo: { monthlyPromptCredits: 1000 },
                                        cloudaicompanionProject: "projects/internal",
                                    })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, {
                                        models: {
                                            chat_hidden: { quotaInfo: { remainingFraction: 0.1 } },
                                            tab_hidden: { quotaInfo: { remainingFraction: 0.2 } },
                                            "gemini-pro-1.5": { quotaInfo: { remainingFraction: 0.7 } },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.windows.map(function (w) { return w.label; })).toEqual(["Credits", "gemini-pro-1.5"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sorts models by usage and shows individual model IDs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(500, "Error")];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, {
                                        models: {
                                            "gemini-pro-1.0": {
                                                quotaInfo: { remainingFraction: 0.8 },
                                            },
                                            "gemini-pro-1.5": {
                                                quotaInfo: { remainingFraction: 0.3 },
                                            },
                                            "gemini-flash-1.5": {
                                                quotaInfo: { remainingFraction: 0.6 },
                                            },
                                            "gemini-flash-2.0": {
                                                quotaInfo: { remainingFraction: 0.9 },
                                            },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _j.sent();
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(4);
                    // Should be sorted by usage (highest first)
                    (0, vitest_1.expect)((_a = snapshot.windows[0]) === null || _a === void 0 ? void 0 : _a.label).toBe("gemini-pro-1.5");
                    (0, vitest_1.expect)((_b = snapshot.windows[0]) === null || _b === void 0 ? void 0 : _b.usedPercent).toBe(70); // (1 - 0.3) * 100
                    (0, vitest_1.expect)((_c = snapshot.windows[1]) === null || _c === void 0 ? void 0 : _c.label).toBe("gemini-flash-1.5");
                    (0, vitest_1.expect)((_d = snapshot.windows[1]) === null || _d === void 0 ? void 0 : _d.usedPercent).toBe(40); // (1 - 0.6) * 100
                    (0, vitest_1.expect)((_e = snapshot.windows[2]) === null || _e === void 0 ? void 0 : _e.label).toBe("gemini-pro-1.0");
                    (0, vitest_1.expect)((_f = snapshot.windows[2]) === null || _f === void 0 ? void 0 : _f.usedPercent).toBeCloseTo(20, 1); // (1 - 0.8) * 100
                    (0, vitest_1.expect)((_g = snapshot.windows[3]) === null || _g === void 0 ? void 0 : _g.label).toBe("gemini-flash-2.0");
                    (0, vitest_1.expect)((_h = snapshot.windows[3]) === null || _h === void 0 ? void 0 : _h.usedPercent).toBeCloseTo(10, 1); // (1 - 0.9) * 100
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns Token expired error on 401 from loadCodeAssist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(401, { error: { message: "Unauthorized" } })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.error).toBe("Token expired");
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(0);
                    (0, vitest_1.expect)(mockFetch).toHaveBeenCalledTimes(1); // Should stop early on 401
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles empty models array gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot, creditsWindow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, {
                                        availablePromptCredits: 800,
                                        planInfo: { monthlyPromptCredits: 1000 },
                                    })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, { models: {} })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(1);
                    creditsWindow = snapshot.windows[0];
                    (0, vitest_1.expect)(creditsWindow === null || creditsWindow === void 0 ? void 0 : creditsWindow.label).toBe("Credits");
                    (0, vitest_1.expect)(creditsWindow === null || creditsWindow === void 0 ? void 0 : creditsWindow.usedPercent).toBe(20);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles missing credits fields gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot, flashWindow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(200, { planType: "Free" })];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, {
                                        models: {
                                            "gemini-flash-experimental": {
                                                quotaInfo: { remainingFraction: 0.5 },
                                            },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(1);
                    flashWindow = snapshot.windows[0];
                    (0, vitest_1.expect)(flashWindow === null || flashWindow === void 0 ? void 0 : flashWindow.label).toBe("gemini-flash-experimental");
                    (0, vitest_1.expect)(flashWindow === null || flashWindow === void 0 ? void 0 : flashWindow.usedPercent).toBe(50);
                    (0, vitest_1.expect)(snapshot.plan).toBe("Free");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles invalid reset time gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot, proWindow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                return [2 /*return*/, makeResponse(500, "Error")];
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, {
                                        models: {
                                            "gemini-pro-test": {
                                                quotaInfo: { remainingFraction: 0.4, resetTime: "invalid-date" },
                                            },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    proWindow = snapshot.windows.find(function (w) { return w.label === "gemini-pro-test"; });
                    (0, vitest_1.expect)(proWindow === null || proWindow === void 0 ? void 0 : proWindow.usedPercent).toBe(60);
                    (0, vitest_1.expect)(proWindow === null || proWindow === void 0 ? void 0 : proWindow.resetAt).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles network errors with graceful degradation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetch, snapshot, flashWindow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetch = vitest_1.vi.fn(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                            if (url.includes("loadCodeAssist")) {
                                throw new Error("Network failure");
                            }
                            if (url.includes("fetchAvailableModels")) {
                                return [2 /*return*/, makeResponse(200, {
                                        models: {
                                            "gemini-flash-stable": {
                                                quotaInfo: { remainingFraction: 0.85 },
                                            },
                                        },
                                    })];
                            }
                            return [2 /*return*/, makeResponse(404, "not found")];
                        });
                    }); });
                    return [4 /*yield*/, (0, provider_usage_fetch_antigravity_js_1.fetchAntigravityUsage)("token-123", 5000, mockFetch)];
                case 1:
                    snapshot = _a.sent();
                    (0, vitest_1.expect)(snapshot.windows).toHaveLength(1);
                    flashWindow = snapshot.windows[0];
                    (0, vitest_1.expect)(flashWindow === null || flashWindow === void 0 ? void 0 : flashWindow.label).toBe("gemini-flash-stable");
                    (0, vitest_1.expect)(flashWindow === null || flashWindow === void 0 ? void 0 : flashWindow.usedPercent).toBeCloseTo(15, 1);
                    (0, vitest_1.expect)(snapshot.error).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
