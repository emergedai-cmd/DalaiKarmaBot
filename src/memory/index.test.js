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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var index_js_1 = require("./index.js");
var embedBatchCalls = 0;
var failEmbeddings = false;
vitest_1.vi.mock("./embeddings.js", function () {
    var embedText = function (text) {
        var lower = text.toLowerCase();
        var alpha = lower.split("alpha").length - 1;
        var beta = lower.split("beta").length - 1;
        return [alpha, beta];
    };
    return {
        createEmbeddingProvider: function (options) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, ({
                        requestedProvider: "openai",
                        provider: {
                            id: "mock",
                            model: (_a = options.model) !== null && _a !== void 0 ? _a : "mock-embed",
                            embedQuery: function (text) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, embedText(text)];
                            }); }); },
                            embedBatch: function (texts) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    embedBatchCalls += 1;
                                    if (failEmbeddings) {
                                        throw new Error("mock embeddings failed");
                                    }
                                    return [2 /*return*/, texts.map(embedText)];
                                });
                            }); },
                        },
                    })];
            });
        }); },
    };
});
(0, vitest_1.describe)("memory index", function () {
    var workspaceDir;
    var indexPath;
    var manager = null;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embedBatchCalls = 0;
                    failEmbeddings = false;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-mem-"))];
                case 1:
                    workspaceDir = _a.sent();
                    indexPath = node_path_1.default.join(workspaceDir, "index.sqlite");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(workspaceDir, "memory"))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "2026-01-12.md"), "# Log\nAlpha memory line.\nZebra memory line.\nAnother line.")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "MEMORY.md"), "Beta knowledge base entry.")];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!manager) return [3 /*break*/, 2];
                    return [4 /*yield*/, manager.close()];
                case 1:
                    _a.sent();
                    manager = null;
                    _a.label = 2;
                case 2: return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("indexes memory files and searches by vector", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result, results, status;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "mock-embed",
                                    store: { path: indexPath },
                                    sync: { watch: false, onSessionStart: false, onSearch: true },
                                    query: { minScore: 0 },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    return [4 /*yield*/, result.manager.sync({ force: true })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, result.manager.search("alpha")];
                case 3:
                    results = _b.sent();
                    (0, vitest_1.expect)(results.length).toBeGreaterThan(0);
                    (0, vitest_1.expect)((_a = results[0]) === null || _a === void 0 ? void 0 : _a.path).toContain("memory/2026-01-12.md");
                    status = result.manager.status();
                    (0, vitest_1.expect)(status.sourceCounts).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            source: "memory",
                            files: status.files,
                            chunks: status.chunks,
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reindexes when the embedding model changes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var base, first, second, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    base = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    store: { path: indexPath },
                                    sync: { watch: false, onSessionStart: false, onSearch: true },
                                    query: { minScore: 0 },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({
                            cfg: __assign(__assign({}, base), { agents: __assign(__assign({}, base.agents), { defaults: __assign(__assign({}, base.agents.defaults), { memorySearch: __assign(__assign({}, base.agents.defaults.memorySearch), { model: "mock-embed-v1" }) }) }) }),
                            agentId: "main",
                        })];
                case 1:
                    first = _a.sent();
                    (0, vitest_1.expect)(first.manager).not.toBeNull();
                    if (!first.manager) {
                        throw new Error("manager missing");
                    }
                    return [4 /*yield*/, first.manager.sync({ force: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, first.manager.close()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({
                            cfg: __assign(__assign({}, base), { agents: __assign(__assign({}, base.agents), { defaults: __assign(__assign({}, base.agents.defaults), { memorySearch: __assign(__assign({}, base.agents.defaults.memorySearch), { model: "mock-embed-v2" }) }) }) }),
                            agentId: "main",
                        })];
                case 4:
                    second = _a.sent();
                    (0, vitest_1.expect)(second.manager).not.toBeNull();
                    if (!second.manager) {
                        throw new Error("manager missing");
                    }
                    manager = second.manager;
                    return [4 /*yield*/, second.manager.sync({ reason: "test" })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, second.manager.search("alpha")];
                case 6:
                    results = _a.sent();
                    (0, vitest_1.expect)(results.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reuses cached embeddings on forced reindex", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result, afterFirst;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "mock-embed",
                                    store: { path: indexPath, vector: { enabled: false } },
                                    sync: { watch: false, onSessionStart: false, onSearch: false },
                                    query: { minScore: 0 },
                                    cache: { enabled: true },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 2:
                    _a.sent();
                    afterFirst = embedBatchCalls;
                    (0, vitest_1.expect)(afterFirst).toBeGreaterThan(0);
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(embedBatchCalls).toBe(afterFirst);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves existing index when forced reindex fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result, before, after, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "mock-embed",
                                    store: { path: indexPath, vector: { enabled: false } },
                                    sync: { watch: false, onSessionStart: false, onSearch: false },
                                    query: { minScore: 0 },
                                    cache: { enabled: false },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 2:
                    _a.sent();
                    before = manager.status();
                    (0, vitest_1.expect)(before.files).toBeGreaterThan(0);
                    failEmbeddings = true;
                    return [4 /*yield*/, (0, vitest_1.expect)(manager.sync({ force: true })).rejects.toThrow(/mock embeddings failed/i)];
                case 3:
                    _a.sent();
                    after = manager.status();
                    (0, vitest_1.expect)(after.files).toBe(before.files);
                    (0, vitest_1.expect)(after.chunks).toBe(before.chunks);
                    return [4 /*yield*/, promises_1.default.readdir(workspaceDir)];
                case 4:
                    files = _a.sent();
                    (0, vitest_1.expect)(files.some(function (name) { return name.includes(".tmp-"); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("finds keyword matches via hybrid search when query embedding is zero", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result, status, results;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "mock-embed",
                                    store: { path: indexPath, vector: { enabled: false } },
                                    sync: { watch: false, onSessionStart: false, onSearch: true },
                                    query: {
                                        minScore: 0,
                                        hybrid: { enabled: true, vectorWeight: 0, textWeight: 1 },
                                    },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    status = manager.status();
                    if (!((_a = status.fts) === null || _a === void 0 ? void 0 : _a.available)) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, manager.search("zebra")];
                case 3:
                    results = _c.sent();
                    (0, vitest_1.expect)(results.length).toBeGreaterThan(0);
                    (0, vitest_1.expect)((_b = results[0]) === null || _b === void 0 ? void 0 : _b.path).toContain("memory/2026-01-12.md");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("hybrid weights can favor vector-only matches over keyword-only matches", function () { return __awaiter(void 0, void 0, void 0, function () {
        var manyAlpha, cfg, result, status, results, paths, vectorOnly, keywordOnly;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    manyAlpha = Array.from({ length: 200 }, function () { return "Alpha"; }).join(" ");
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "vector-only.md"), "Alpha beta. Alpha beta. Alpha beta. Alpha beta.")];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "keyword-only.md"), "".concat(manyAlpha, " beta id123."))];
                case 2:
                    _d.sent();
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "mock-embed",
                                    store: { path: indexPath, vector: { enabled: false } },
                                    sync: { watch: false, onSessionStart: false, onSearch: true },
                                    query: {
                                        minScore: 0,
                                        maxResults: 200,
                                        hybrid: {
                                            enabled: true,
                                            vectorWeight: 0.99,
                                            textWeight: 0.01,
                                            candidateMultiplier: 10,
                                        },
                                    },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 3:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    status = manager.status();
                    if (!((_a = status.fts) === null || _a === void 0 ? void 0 : _a.available)) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, manager.search("alpha beta id123")];
                case 5:
                    results = _d.sent();
                    (0, vitest_1.expect)(results.length).toBeGreaterThan(0);
                    paths = results.map(function (r) { return r.path; });
                    (0, vitest_1.expect)(paths).toContain("memory/vector-only.md");
                    (0, vitest_1.expect)(paths).toContain("memory/keyword-only.md");
                    vectorOnly = results.find(function (r) { return r.path === "memory/vector-only.md"; });
                    keywordOnly = results.find(function (r) { return r.path === "memory/keyword-only.md"; });
                    (0, vitest_1.expect)(((_b = vectorOnly === null || vectorOnly === void 0 ? void 0 : vectorOnly.score) !== null && _b !== void 0 ? _b : 0) > ((_c = keywordOnly === null || keywordOnly === void 0 ? void 0 : keywordOnly.score) !== null && _c !== void 0 ? _c : 0)).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("hybrid weights can favor keyword matches when text weight dominates", function () { return __awaiter(void 0, void 0, void 0, function () {
        var manyAlpha, cfg, result, status, results, paths, vectorOnly, keywordOnly;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    manyAlpha = Array.from({ length: 200 }, function () { return "Alpha"; }).join(" ");
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "vector-only.md"), "Alpha beta. Alpha beta. Alpha beta. Alpha beta.")];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "keyword-only.md"), "".concat(manyAlpha, " beta id123."))];
                case 2:
                    _d.sent();
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "mock-embed",
                                    store: { path: indexPath, vector: { enabled: false } },
                                    sync: { watch: false, onSessionStart: false, onSearch: true },
                                    query: {
                                        minScore: 0,
                                        maxResults: 200,
                                        hybrid: {
                                            enabled: true,
                                            vectorWeight: 0.01,
                                            textWeight: 0.99,
                                            candidateMultiplier: 10,
                                        },
                                    },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 3:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    status = manager.status();
                    if (!((_a = status.fts) === null || _a === void 0 ? void 0 : _a.available)) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, manager.search("alpha beta id123")];
                case 5:
                    results = _d.sent();
                    (0, vitest_1.expect)(results.length).toBeGreaterThan(0);
                    paths = results.map(function (r) { return r.path; });
                    (0, vitest_1.expect)(paths).toContain("memory/vector-only.md");
                    (0, vitest_1.expect)(paths).toContain("memory/keyword-only.md");
                    vectorOnly = results.find(function (r) { return r.path === "memory/vector-only.md"; });
                    keywordOnly = results.find(function (r) { return r.path === "memory/keyword-only.md"; });
                    (0, vitest_1.expect)(((_b = keywordOnly === null || keywordOnly === void 0 ? void 0 : keywordOnly.score) !== null && _b !== void 0 ? _b : 0) > ((_c = vectorOnly === null || vectorOnly === void 0 ? void 0 : vectorOnly.score) !== null && _c !== void 0 ? _c : 0)).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reports vector availability after probe", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result, available, status;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "mock-embed",
                                    store: { path: indexPath },
                                    sync: { watch: false, onSessionStart: false, onSearch: false },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 1:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    return [4 /*yield*/, result.manager.probeVectorAvailability()];
                case 2:
                    available = _d.sent();
                    status = result.manager.status();
                    (0, vitest_1.expect)((_a = status.vector) === null || _a === void 0 ? void 0 : _a.enabled).toBe(true);
                    (0, vitest_1.expect)(typeof ((_b = status.vector) === null || _b === void 0 ? void 0 : _b.available)).toBe("boolean");
                    (0, vitest_1.expect)((_c = status.vector) === null || _c === void 0 ? void 0 : _c.available).toBe(available);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects reading non-memory paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "mock-embed",
                                    store: { path: indexPath },
                                    sync: { watch: false, onSessionStart: false, onSearch: true },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    return [4 /*yield*/, (0, vitest_1.expect)(result.manager.readFile({ relPath: "NOTES.md" })).rejects.toThrow("path required")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows reading from additional memory paths and blocks symlinks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var extraDir, cfg, result, linkPath, symlinkOk, err_1, code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    extraDir = node_path_1.default.join(workspaceDir, "extra");
                    return [4 /*yield*/, promises_1.default.mkdir(extraDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(extraDir, "extra.md"), "Extra content.")];
                case 2:
                    _a.sent();
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "mock-embed",
                                    store: { path: indexPath },
                                    sync: { watch: false, onSessionStart: false, onSearch: true },
                                    extraPaths: [extraDir],
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    return [4 /*yield*/, (0, vitest_1.expect)(result.manager.readFile({ relPath: "extra/extra.md" })).resolves.toEqual({
                            path: "extra/extra.md",
                            text: "Extra content.",
                        })];
                case 4:
                    _a.sent();
                    linkPath = node_path_1.default.join(extraDir, "linked.md");
                    symlinkOk = true;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, promises_1.default.symlink(node_path_1.default.join(extraDir, "extra.md"), linkPath, "file")];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    code = err_1.code;
                    if (code === "EPERM" || code === "EACCES") {
                        symlinkOk = false;
                    }
                    else {
                        throw err_1;
                    }
                    return [3 /*break*/, 8];
                case 8:
                    if (!symlinkOk) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, vitest_1.expect)(result.manager.readFile({ relPath: "extra/linked.md" })).rejects.toThrow("path required")];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    }); });
});
