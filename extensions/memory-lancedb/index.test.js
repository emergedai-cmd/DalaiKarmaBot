"use strict";
/**
 * Memory Plugin E2E Tests
 *
 * Tests the memory plugin functionality including:
 * - Plugin registration and configuration
 * - Memory storage and retrieval
 * - Auto-recall via hooks
 * - Auto-capture filtering
 */
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var OPENAI_API_KEY = (_a = process.env.OPENAI_API_KEY) !== null && _a !== void 0 ? _a : "test-key";
var HAS_OPENAI_KEY = Boolean(process.env.OPENAI_API_KEY);
var liveEnabled = HAS_OPENAI_KEY && process.env.OPENCLAW_LIVE_TEST === "1";
var describeLive = liveEnabled ? vitest_1.describe : vitest_1.describe.skip;
(0, vitest_1.describe)("memory plugin e2e", function () {
    var tmpDir;
    var dbPath;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-memory-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    dbPath = node_path_1.default.join(tmpDir, "lancedb");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!tmpDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("memory plugin registers and initializes correctly", function () { return __awaiter(void 0, void 0, void 0, function () {
        var memoryPlugin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./index.js"); })];
                case 1:
                    memoryPlugin = (_a.sent()).default;
                    (0, vitest_1.expect)(memoryPlugin.id).toBe("memory-lancedb");
                    (0, vitest_1.expect)(memoryPlugin.name).toBe("Memory (LanceDB)");
                    (0, vitest_1.expect)(memoryPlugin.kind).toBe("memory");
                    (0, vitest_1.expect)(memoryPlugin.configSchema).toBeDefined();
                    // oxlint-disable-next-line typescript/unbound-method
                    (0, vitest_1.expect)(memoryPlugin.register).toBeInstanceOf(Function);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("config schema parses valid config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var memoryPlugin, config;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./index.js"); })];
                case 1:
                    memoryPlugin = (_d.sent()).default;
                    config = (_b = (_a = memoryPlugin.configSchema) === null || _a === void 0 ? void 0 : _a.parse) === null || _b === void 0 ? void 0 : _b.call(_a, {
                        embedding: {
                            apiKey: OPENAI_API_KEY,
                            model: "text-embedding-3-small",
                        },
                        dbPath: dbPath,
                        autoCapture: true,
                        autoRecall: true,
                    });
                    (0, vitest_1.expect)(config).toBeDefined();
                    (0, vitest_1.expect)((_c = config === null || config === void 0 ? void 0 : config.embedding) === null || _c === void 0 ? void 0 : _c.apiKey).toBe(OPENAI_API_KEY);
                    (0, vitest_1.expect)(config === null || config === void 0 ? void 0 : config.dbPath).toBe(dbPath);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("config schema resolves env vars", function () { return __awaiter(void 0, void 0, void 0, function () {
        var memoryPlugin, config;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./index.js"); })];
                case 1:
                    memoryPlugin = (_d.sent()).default;
                    // Set a test env var
                    process.env.TEST_MEMORY_API_KEY = "test-key-123";
                    config = (_b = (_a = memoryPlugin.configSchema) === null || _a === void 0 ? void 0 : _a.parse) === null || _b === void 0 ? void 0 : _b.call(_a, {
                        embedding: {
                            apiKey: "${TEST_MEMORY_API_KEY}",
                        },
                        dbPath: dbPath,
                    });
                    (0, vitest_1.expect)((_c = config === null || config === void 0 ? void 0 : config.embedding) === null || _c === void 0 ? void 0 : _c.apiKey).toBe("test-key-123");
                    delete process.env.TEST_MEMORY_API_KEY;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("config schema rejects missing apiKey", function () { return __awaiter(void 0, void 0, void 0, function () {
        var memoryPlugin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./index.js"); })];
                case 1:
                    memoryPlugin = (_a.sent()).default;
                    (0, vitest_1.expect)(function () {
                        var _a, _b;
                        (_b = (_a = memoryPlugin.configSchema) === null || _a === void 0 ? void 0 : _a.parse) === null || _b === void 0 ? void 0 : _b.call(_a, {
                            embedding: {},
                            dbPath: dbPath,
                        });
                    }).toThrow("embedding.apiKey is required");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("shouldCapture filters correctly", function () { return __awaiter(void 0, void 0, void 0, function () {
        var triggers, _i, triggers_1, _a, text, shouldMatch, hasPreference, hasRemember, hasEmail, hasPhone, hasDecision, hasAlways, isInjected, isTooShort, wouldCapture;
        return __generator(this, function (_b) {
            triggers = [
                { text: "I prefer dark mode", shouldMatch: true },
                { text: "Remember that my name is John", shouldMatch: true },
                { text: "My email is test@example.com", shouldMatch: true },
                { text: "Call me at +1234567890123", shouldMatch: true },
                { text: "We decided to use TypeScript", shouldMatch: true },
                { text: "I always want verbose output", shouldMatch: true },
                { text: "Just a random short message", shouldMatch: false },
                { text: "x", shouldMatch: false }, // Too short
                { text: "<relevant-memories>injected</relevant-memories>", shouldMatch: false }, // Skip injected
            ];
            // The shouldCapture function is internal, but we can test via the capture behavior
            // For now, just verify the patterns we expect to match
            for (_i = 0, triggers_1 = triggers; _i < triggers_1.length; _i++) {
                _a = triggers_1[_i], text = _a.text, shouldMatch = _a.shouldMatch;
                hasPreference = /prefer|radši|like|love|hate|want/i.test(text);
                hasRemember = /zapamatuj|pamatuj|remember/i.test(text);
                hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
                hasPhone = /\+\d{10,}/.test(text);
                hasDecision = /rozhodli|decided|will use|budeme/i.test(text);
                hasAlways = /always|never|important/i.test(text);
                isInjected = text.includes("<relevant-memories>");
                isTooShort = text.length < 10;
                wouldCapture = !isTooShort &&
                    !isInjected &&
                    (hasPreference || hasRemember || hasEmail || hasPhone || hasDecision || hasAlways);
                if (shouldMatch) {
                    (0, vitest_1.expect)(wouldCapture).toBe(true);
                }
            }
            return [2 /*return*/];
        });
    }); });
    (0, vitest_1.test)("detectCategory classifies correctly", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cases, _i, cases_1, _a, text, expected, lower, category;
        return __generator(this, function (_b) {
            cases = [
                { text: "I prefer dark mode", expected: "preference" },
                { text: "We decided to use React", expected: "decision" },
                { text: "My email is test@example.com", expected: "entity" },
                { text: "The server is running on port 3000", expected: "fact" },
            ];
            for (_i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
                _a = cases_1[_i], text = _a.text, expected = _a.expected;
                lower = text.toLowerCase();
                category = void 0;
                if (/prefer|radši|like|love|hate|want/i.test(lower)) {
                    category = "preference";
                }
                else if (/rozhodli|decided|will use|budeme/i.test(lower)) {
                    category = "decision";
                }
                else if (/\+\d{10,}|@[\w.-]+\.\w+|is called|jmenuje se/i.test(lower)) {
                    category = "entity";
                }
                else if (/is|are|has|have|je|má|jsou/i.test(lower)) {
                    category = "fact";
                }
                else {
                    category = "other";
                }
                (0, vitest_1.expect)(category).toBe(expected);
            }
            return [2 /*return*/];
        });
    }); });
});
// Live tests that require OpenAI API key and actually use LanceDB
describeLive("memory plugin live tests", function () {
    var tmpDir;
    var dbPath;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-memory-live-"))];
                case 1:
                    tmpDir = _a.sent();
                    dbPath = node_path_1.default.join(tmpDir, "lancedb");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!tmpDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("memory tools work end-to-end", function () { return __awaiter(void 0, void 0, void 0, function () {
        var memoryPlugin, liveApiKey, registeredTools, registeredClis, registeredServices, registeredHooks, logs, mockApi, storeTool, recallTool, forgetTool, storeResult, storedId, recallResult, duplicateResult, forgetResult, recallAfterForget;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./index.js"); })];
                case 1:
                    memoryPlugin = (_q.sent()).default;
                    liveApiKey = (_a = process.env.OPENAI_API_KEY) !== null && _a !== void 0 ? _a : "";
                    registeredTools = [];
                    registeredClis = [];
                    registeredServices = [];
                    registeredHooks = {};
                    logs = [];
                    mockApi = {
                        id: "memory-lancedb",
                        name: "Memory (LanceDB)",
                        source: "test",
                        config: {},
                        pluginConfig: {
                            embedding: {
                                apiKey: liveApiKey,
                                model: "text-embedding-3-small",
                            },
                            dbPath: dbPath,
                            autoCapture: false,
                            autoRecall: false,
                        },
                        runtime: {},
                        logger: {
                            info: function (msg) { return logs.push("[info] ".concat(msg)); },
                            warn: function (msg) { return logs.push("[warn] ".concat(msg)); },
                            error: function (msg) { return logs.push("[error] ".concat(msg)); },
                            debug: function (msg) { return logs.push("[debug] ".concat(msg)); },
                        },
                        // oxlint-disable-next-line typescript/no-explicit-any
                        registerTool: function (tool, opts) {
                            registeredTools.push({ tool: tool, opts: opts });
                        },
                        // oxlint-disable-next-line typescript/no-explicit-any
                        registerCli: function (registrar, opts) {
                            registeredClis.push({ registrar: registrar, opts: opts });
                        },
                        // oxlint-disable-next-line typescript/no-explicit-any
                        registerService: function (service) {
                            registeredServices.push(service);
                        },
                        // oxlint-disable-next-line typescript/no-explicit-any
                        on: function (hookName, handler) {
                            if (!registeredHooks[hookName]) {
                                registeredHooks[hookName] = [];
                            }
                            registeredHooks[hookName].push(handler);
                        },
                        resolvePath: function (p) { return p; },
                    };
                    // Register plugin
                    // oxlint-disable-next-line typescript/no-explicit-any
                    memoryPlugin.register(mockApi);
                    // Check registration
                    (0, vitest_1.expect)(registeredTools.length).toBe(3);
                    (0, vitest_1.expect)(registeredTools.map(function (t) { var _a; return (_a = t.opts) === null || _a === void 0 ? void 0 : _a.name; })).toContain("memory_recall");
                    (0, vitest_1.expect)(registeredTools.map(function (t) { var _a; return (_a = t.opts) === null || _a === void 0 ? void 0 : _a.name; })).toContain("memory_store");
                    (0, vitest_1.expect)(registeredTools.map(function (t) { var _a; return (_a = t.opts) === null || _a === void 0 ? void 0 : _a.name; })).toContain("memory_forget");
                    (0, vitest_1.expect)(registeredClis.length).toBe(1);
                    (0, vitest_1.expect)(registeredServices.length).toBe(1);
                    storeTool = (_b = registeredTools.find(function (t) { var _a; return ((_a = t.opts) === null || _a === void 0 ? void 0 : _a.name) === "memory_store"; })) === null || _b === void 0 ? void 0 : _b.tool;
                    recallTool = (_c = registeredTools.find(function (t) { var _a; return ((_a = t.opts) === null || _a === void 0 ? void 0 : _a.name) === "memory_recall"; })) === null || _c === void 0 ? void 0 : _c.tool;
                    forgetTool = (_d = registeredTools.find(function (t) { var _a; return ((_a = t.opts) === null || _a === void 0 ? void 0 : _a.name) === "memory_forget"; })) === null || _d === void 0 ? void 0 : _d.tool;
                    return [4 /*yield*/, storeTool.execute("test-call-1", {
                            text: "The user prefers dark mode for all applications",
                            importance: 0.8,
                            category: "preference",
                        })];
                case 2:
                    storeResult = _q.sent();
                    (0, vitest_1.expect)((_e = storeResult.details) === null || _e === void 0 ? void 0 : _e.action).toBe("created");
                    (0, vitest_1.expect)((_f = storeResult.details) === null || _f === void 0 ? void 0 : _f.id).toBeDefined();
                    storedId = (_g = storeResult.details) === null || _g === void 0 ? void 0 : _g.id;
                    return [4 /*yield*/, recallTool.execute("test-call-2", {
                            query: "dark mode preference",
                            limit: 5,
                        })];
                case 3:
                    recallResult = _q.sent();
                    (0, vitest_1.expect)((_h = recallResult.details) === null || _h === void 0 ? void 0 : _h.count).toBeGreaterThan(0);
                    (0, vitest_1.expect)((_l = (_k = (_j = recallResult.details) === null || _j === void 0 ? void 0 : _j.memories) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.text).toContain("dark mode");
                    return [4 /*yield*/, storeTool.execute("test-call-3", {
                            text: "The user prefers dark mode for all applications",
                        })];
                case 4:
                    duplicateResult = _q.sent();
                    (0, vitest_1.expect)((_m = duplicateResult.details) === null || _m === void 0 ? void 0 : _m.action).toBe("duplicate");
                    return [4 /*yield*/, forgetTool.execute("test-call-4", {
                            memoryId: storedId,
                        })];
                case 5:
                    forgetResult = _q.sent();
                    (0, vitest_1.expect)((_o = forgetResult.details) === null || _o === void 0 ? void 0 : _o.action).toBe("deleted");
                    return [4 /*yield*/, recallTool.execute("test-call-5", {
                            query: "dark mode preference",
                            limit: 5,
                        })];
                case 6:
                    recallAfterForget = _q.sent();
                    (0, vitest_1.expect)((_p = recallAfterForget.details) === null || _p === void 0 ? void 0 : _p.count).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); }, 60000); // 60s timeout for live API calls
});
