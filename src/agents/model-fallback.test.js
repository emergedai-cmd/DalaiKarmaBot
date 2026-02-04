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
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var auth_profiles_js_1 = require("./auth-profiles.js");
var constants_js_1 = require("./auth-profiles/constants.js");
var model_fallback_js_1 = require("./model-fallback.js");
function makeCfg(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ agents: {
            defaults: {
                model: {
                    primary: "openai/gpt-4.1-mini",
                    fallbacks: ["anthropic/claude-haiku-3-5"],
                },
            },
        } }, overrides);
}
(0, vitest_1.describe)("runWithModelFallback", function () {
    (0, vitest_1.it)("does not fall back on non-auth errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi.fn().mockRejectedValueOnce(new Error("bad request")).mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, vitest_1.expect)((0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })).rejects.toThrow("bad request")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back on auth errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(Object.assign(new Error("nope"), { status: 401 }))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back on 402 payment required", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(Object.assign(new Error("payment required"), { status: 402 }))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back on billing errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(new Error("LLM request rejected: Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back on credential validation errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(new Error('No credentials found for profile "anthropic:default".'))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "anthropic",
                            model: "claude-opus-4",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips providers when all profiles are in cooldown", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, provider, profileId, store, cfg, run, result;
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempDir = _d.sent();
                    provider = "cooldown-test-".concat(node_crypto_1.default.randomUUID());
                    profileId = "".concat(provider, ":default");
                    store = {
                        version: constants_js_1.AUTH_STORE_VERSION,
                        profiles: (_a = {},
                            _a[profileId] = {
                                type: "api_key",
                                provider: provider,
                                key: "test-key",
                            },
                            _a),
                        usageStats: (_b = {},
                            _b[profileId] = {
                                cooldownUntil: Date.now() + 60000,
                            },
                            _b),
                    };
                    (0, auth_profiles_js_1.saveAuthProfileStore)(store, tempDir);
                    cfg = makeCfg({
                        agents: {
                            defaults: {
                                model: {
                                    primary: "".concat(provider, "/m1"),
                                    fallbacks: ["fallback/ok-model"],
                                },
                            },
                        },
                    });
                    run = vitest_1.vi.fn().mockImplementation(function (providerId, modelId) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (providerId === "fallback") {
                                return [2 /*return*/, "ok"];
                            }
                            throw new Error("unexpected provider: ".concat(providerId, "/").concat(modelId));
                        });
                    }); });
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: provider,
                            model: "m1",
                            agentDir: tempDir,
                            run: run,
                        })];
                case 3:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run.mock.calls).toEqual([["fallback", "ok-model"]]);
                    (0, vitest_1.expect)((_c = result.attempts[0]) === null || _c === void 0 ? void 0 : _c.reason).toBe("rate_limit");
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 5:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not skip when any profile is available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, provider, profileA, profileB, store, cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"))];
                case 1:
                    tempDir = _c.sent();
                    provider = "cooldown-mixed-".concat(node_crypto_1.default.randomUUID());
                    profileA = "".concat(provider, ":a");
                    profileB = "".concat(provider, ":b");
                    store = {
                        version: constants_js_1.AUTH_STORE_VERSION,
                        profiles: (_a = {},
                            _a[profileA] = {
                                type: "api_key",
                                provider: provider,
                                key: "key-a",
                            },
                            _a[profileB] = {
                                type: "api_key",
                                provider: provider,
                                key: "key-b",
                            },
                            _a),
                        usageStats: (_b = {},
                            _b[profileA] = {
                                cooldownUntil: Date.now() + 60000,
                            },
                            _b),
                    };
                    (0, auth_profiles_js_1.saveAuthProfileStore)(store, tempDir);
                    cfg = makeCfg({
                        agents: {
                            defaults: {
                                model: {
                                    primary: "".concat(provider, "/m1"),
                                    fallbacks: ["fallback/ok-model"],
                                },
                            },
                        },
                    });
                    run = vitest_1.vi.fn().mockImplementation(function (providerId) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (providerId === provider) {
                                return [2 /*return*/, "ok"];
                            }
                            return [2 /*return*/, "unexpected"];
                        });
                    }); });
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: provider,
                            model: "m1",
                            agentDir: tempDir,
                            run: run,
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run.mock.calls).toEqual([[provider, "m1"]]);
                    (0, vitest_1.expect)(result.attempts).toEqual([]);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.rm(tempDir, { recursive: true, force: true })];
                case 5:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not append configured primary when fallbacksOverride is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = makeCfg({
                        agents: {
                            defaults: {
                                model: {
                                    primary: "openai/gpt-4.1-mini",
                                },
                            },
                        },
                    });
                    run = vitest_1.vi
                        .fn()
                        .mockImplementation(function () { return Promise.reject(Object.assign(new Error("nope"), { status: 401 })); });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "anthropic",
                            model: "claude-opus-4-5",
                            fallbacksOverride: ["anthropic/claude-haiku-3-5"],
                            run: run,
                        })).rejects.toThrow("All models failed")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(run.mock.calls).toEqual([
                        ["anthropic", "claude-opus-4-5"],
                        ["anthropic", "claude-haiku-3-5"],
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses fallbacksOverride instead of agents.defaults.model.fallbacks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, calls, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                model: {
                                    fallbacks: ["openai/gpt-5.2"],
                                },
                            },
                        },
                    };
                    calls = [];
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "anthropic",
                            model: "claude-opus-4-5",
                            fallbacksOverride: ["openai/gpt-4.1"],
                            run: function (provider, model) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    calls.push({ provider: provider, model: model });
                                    if (provider === "anthropic") {
                                        throw Object.assign(new Error("nope"), { status: 401 });
                                    }
                                    if (provider === "openai" && model === "gpt-4.1") {
                                        return [2 /*return*/, "ok"];
                                    }
                                    throw new Error("unexpected candidate: ".concat(provider, "/").concat(model));
                                });
                            }); },
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.result).toBe("ok");
                    (0, vitest_1.expect)(calls).toEqual([
                        { provider: "anthropic", model: "claude-opus-4-5" },
                        { provider: "openai", model: "gpt-4.1" },
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats an empty fallbacksOverride as disabling global fallbacks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, calls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                model: {
                                    fallbacks: ["openai/gpt-5.2"],
                                },
                            },
                        },
                    };
                    calls = [];
                    return [4 /*yield*/, (0, vitest_1.expect)((0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "anthropic",
                            model: "claude-opus-4-5",
                            fallbacksOverride: [],
                            run: function (provider, model) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    calls.push({ provider: provider, model: model });
                                    throw new Error("primary failed");
                                });
                            }); },
                        })).rejects.toThrow("primary failed")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(calls).toEqual([{ provider: "anthropic", model: "claude-opus-4-5" }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults provider/model when missing (regression #946)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, calls, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = makeCfg({
                        agents: {
                            defaults: {
                                model: {
                                    primary: "openai/gpt-4.1-mini",
                                    fallbacks: [],
                                },
                            },
                        },
                    });
                    calls = [];
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: undefined,
                            model: undefined,
                            run: function (provider, model) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    calls.push({ provider: provider, model: model });
                                    return [2 /*return*/, "ok"];
                                });
                            }); },
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(calls).toEqual([{ provider: "openai", model: "gpt-4.1-mini" }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back on missing API key errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(new Error("No API key found for profile openai."))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back on lowercase credential errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(new Error("no api key found for profile openai"))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back on timeout abort errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, timeoutCause, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    timeoutCause = Object.assign(new Error("request timed out"), { name: "TimeoutError" });
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(Object.assign(new Error("aborted"), { name: "AbortError", cause: timeoutCause }))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back on abort errors with timeout reasons", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(Object.assign(new Error("aborted"), { name: "AbortError", reason: "deadline exceeded" }))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back when message says aborted but error is a timeout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(Object.assign(new Error("request aborted"), { code: "ETIMEDOUT" }))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back on provider abort errors with request-aborted messages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(Object.assign(new Error("Request was aborted"), { name: "AbortError" }))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_a = run.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]).toBe("anthropic");
                    (0, vitest_1.expect)((_b = run.mock.calls[1]) === null || _b === void 0 ? void 0 : _b[1]).toBe("claude-haiku-3-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not fall back on user aborts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = makeCfg();
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(Object.assign(new Error("aborted"), { name: "AbortError" }))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, vitest_1.expect)((0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openai",
                            model: "gpt-4.1-mini",
                            run: run,
                        })).rejects.toThrow("aborted")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("appends the configured primary as a last fallback", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, run, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = makeCfg({
                        agents: {
                            defaults: {
                                model: {
                                    primary: "openai/gpt-4.1-mini",
                                    fallbacks: [],
                                },
                            },
                        },
                    });
                    run = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(Object.assign(new Error("timeout"), { code: "ETIMEDOUT" }))
                        .mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: "openrouter",
                            model: "meta-llama/llama-3.3-70b:free",
                            run: run,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.result).toBe("ok");
                    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(result.provider).toBe("openai");
                    (0, vitest_1.expect)(result.model).toBe("gpt-4.1-mini");
                    return [2 /*return*/];
            }
        });
    }); });
});
