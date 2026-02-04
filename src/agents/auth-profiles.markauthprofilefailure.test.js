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
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var auth_profiles_js_1 = require("./auth-profiles.js");
(0, vitest_1.describe)("markAuthProfileFailure", function () {
    (0, vitest_1.it)("disables billing failures for ~5 hours by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, authPath, store, startedAt, disabledUntil, remainingMs;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    agentDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"));
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 3, 4]);
                    authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    node_fs_1.default.writeFileSync(authPath, JSON.stringify({
                        version: 1,
                        profiles: {
                            "anthropic:default": {
                                type: "api_key",
                                provider: "anthropic",
                                key: "sk-default",
                            },
                        },
                    }));
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir);
                    startedAt = Date.now();
                    return [4 /*yield*/, (0, auth_profiles_js_1.markAuthProfileFailure)({
                            store: store,
                            profileId: "anthropic:default",
                            reason: "billing",
                            agentDir: agentDir,
                        })];
                case 2:
                    _c.sent();
                    disabledUntil = (_b = (_a = store.usageStats) === null || _a === void 0 ? void 0 : _a["anthropic:default"]) === null || _b === void 0 ? void 0 : _b.disabledUntil;
                    (0, vitest_1.expect)(typeof disabledUntil).toBe("number");
                    remainingMs = disabledUntil - startedAt;
                    (0, vitest_1.expect)(remainingMs).toBeGreaterThan(4.5 * 60 * 60 * 1000);
                    (0, vitest_1.expect)(remainingMs).toBeLessThan(5.5 * 60 * 60 * 1000);
                    return [3 /*break*/, 4];
                case 3:
                    node_fs_1.default.rmSync(agentDir, { recursive: true, force: true });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors per-provider billing backoff overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, authPath, store, startedAt, disabledUntil, remainingMs;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    agentDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"));
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 3, 4]);
                    authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    node_fs_1.default.writeFileSync(authPath, JSON.stringify({
                        version: 1,
                        profiles: {
                            "anthropic:default": {
                                type: "api_key",
                                provider: "anthropic",
                                key: "sk-default",
                            },
                        },
                    }));
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir);
                    startedAt = Date.now();
                    return [4 /*yield*/, (0, auth_profiles_js_1.markAuthProfileFailure)({
                            store: store,
                            profileId: "anthropic:default",
                            reason: "billing",
                            agentDir: agentDir,
                            cfg: {
                                auth: {
                                    cooldowns: {
                                        billingBackoffHoursByProvider: { Anthropic: 1 },
                                        billingMaxHours: 2,
                                    },
                                },
                            },
                        })];
                case 2:
                    _c.sent();
                    disabledUntil = (_b = (_a = store.usageStats) === null || _a === void 0 ? void 0 : _a["anthropic:default"]) === null || _b === void 0 ? void 0 : _b.disabledUntil;
                    (0, vitest_1.expect)(typeof disabledUntil).toBe("number");
                    remainingMs = disabledUntil - startedAt;
                    (0, vitest_1.expect)(remainingMs).toBeGreaterThan(0.8 * 60 * 60 * 1000);
                    (0, vitest_1.expect)(remainingMs).toBeLessThan(1.2 * 60 * 60 * 1000);
                    return [3 /*break*/, 4];
                case 3:
                    node_fs_1.default.rmSync(agentDir, { recursive: true, force: true });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resets backoff counters outside the failure window", function () { return __awaiter(void 0, void 0, void 0, function () {
        var agentDir, authPath, now, store;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    agentDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"));
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, , 3, 4]);
                    authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    now = Date.now();
                    node_fs_1.default.writeFileSync(authPath, JSON.stringify({
                        version: 1,
                        profiles: {
                            "anthropic:default": {
                                type: "api_key",
                                provider: "anthropic",
                                key: "sk-default",
                            },
                        },
                        usageStats: {
                            "anthropic:default": {
                                errorCount: 9,
                                failureCounts: { billing: 3 },
                                lastFailureAt: now - 48 * 60 * 60 * 1000,
                            },
                        },
                    }));
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir);
                    return [4 /*yield*/, (0, auth_profiles_js_1.markAuthProfileFailure)({
                            store: store,
                            profileId: "anthropic:default",
                            reason: "billing",
                            agentDir: agentDir,
                            cfg: {
                                auth: { cooldowns: { failureWindowHours: 24 } },
                            },
                        })];
                case 2:
                    _f.sent();
                    (0, vitest_1.expect)((_b = (_a = store.usageStats) === null || _a === void 0 ? void 0 : _a["anthropic:default"]) === null || _b === void 0 ? void 0 : _b.errorCount).toBe(1);
                    (0, vitest_1.expect)((_e = (_d = (_c = store.usageStats) === null || _c === void 0 ? void 0 : _c["anthropic:default"]) === null || _d === void 0 ? void 0 : _d.failureCounts) === null || _e === void 0 ? void 0 : _e.billing).toBe(1);
                    return [3 /*break*/, 4];
                case 3:
                    node_fs_1.default.rmSync(agentDir, { recursive: true, force: true });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
