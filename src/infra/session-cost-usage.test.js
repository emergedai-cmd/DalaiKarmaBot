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
var session_cost_usage_js_1 = require("./session-cost-usage.js");
(0, vitest_1.describe)("session cost usage", function () {
    (0, vitest_1.it)("aggregates daily totals with log cost and pricing fallback", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, sessionsDir, sessionFile, now, older, entries, config, originalState, summary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-cost-"))];
                case 1:
                    root = _a.sent();
                    sessionsDir = node_path_1.default.join(root, "agents", "main", "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 2:
                    _a.sent();
                    sessionFile = node_path_1.default.join(sessionsDir, "sess-1.jsonl");
                    now = new Date();
                    older = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000);
                    entries = [
                        {
                            type: "message",
                            timestamp: now.toISOString(),
                            message: {
                                role: "assistant",
                                provider: "openai",
                                model: "gpt-5.2",
                                usage: {
                                    input: 10,
                                    output: 20,
                                    cacheRead: 0,
                                    cacheWrite: 0,
                                    totalTokens: 30,
                                    cost: { total: 0.03 },
                                },
                            },
                        },
                        {
                            type: "message",
                            timestamp: now.toISOString(),
                            message: {
                                role: "assistant",
                                provider: "openai",
                                model: "gpt-5.2",
                                usage: {
                                    input: 10,
                                    output: 10,
                                    cacheRead: 0,
                                    cacheWrite: 0,
                                    totalTokens: 20,
                                },
                            },
                        },
                        {
                            type: "message",
                            timestamp: older.toISOString(),
                            message: {
                                role: "assistant",
                                provider: "openai",
                                model: "gpt-5.2",
                                usage: {
                                    input: 5,
                                    output: 5,
                                    totalTokens: 10,
                                    cost: { total: 0.01 },
                                },
                            },
                        },
                    ];
                    return [4 /*yield*/, promises_1.default.writeFile(sessionFile, entries.map(function (entry) { return JSON.stringify(entry); }).join("\n"), "utf-8")];
                case 3:
                    _a.sent();
                    config = {
                        models: {
                            providers: {
                                openai: {
                                    models: [
                                        {
                                            id: "gpt-5.2",
                                            cost: {
                                                input: 1,
                                                output: 2,
                                                cacheRead: 0,
                                                cacheWrite: 0,
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    };
                    originalState = process.env.OPENCLAW_STATE_DIR;
                    process.env.OPENCLAW_STATE_DIR = root;
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, , 6, 7]);
                    return [4 /*yield*/, (0, session_cost_usage_js_1.loadCostUsageSummary)({ days: 30, config: config })];
                case 5:
                    summary = _a.sent();
                    (0, vitest_1.expect)(summary.daily.length).toBe(1);
                    (0, vitest_1.expect)(summary.totals.totalTokens).toBe(50);
                    (0, vitest_1.expect)(summary.totals.totalCost).toBeCloseTo(0.03003, 5);
                    return [3 /*break*/, 7];
                case 6:
                    if (originalState === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = originalState;
                    }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("summarizes a single session file", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, sessionFile, now, summary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-cost-session-"))];
                case 1:
                    root = _a.sent();
                    sessionFile = node_path_1.default.join(root, "session.jsonl");
                    now = new Date();
                    return [4 /*yield*/, promises_1.default.writeFile(sessionFile, JSON.stringify({
                            type: "message",
                            timestamp: now.toISOString(),
                            message: {
                                role: "assistant",
                                provider: "openai",
                                model: "gpt-5.2",
                                usage: {
                                    input: 10,
                                    output: 20,
                                    totalTokens: 30,
                                    cost: { total: 0.03 },
                                },
                            },
                        }), "utf-8")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, session_cost_usage_js_1.loadSessionCostSummary)({
                            sessionFile: sessionFile,
                        })];
                case 3:
                    summary = _a.sent();
                    (0, vitest_1.expect)(summary === null || summary === void 0 ? void 0 : summary.totalCost).toBeCloseTo(0.03, 5);
                    (0, vitest_1.expect)(summary === null || summary === void 0 ? void 0 : summary.totalTokens).toBe(30);
                    (0, vitest_1.expect)(summary === null || summary === void 0 ? void 0 : summary.lastActivity).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
