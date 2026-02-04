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
var commander_1 = require("commander");
var vitest_1 = require("vitest");
var getMemorySearchManager = vitest_1.vi.fn();
var loadConfig = vitest_1.vi.fn(function () { return ({}); });
var resolveDefaultAgentId = vitest_1.vi.fn(function () { return "main"; });
vitest_1.vi.mock("../memory/index.js", function () { return ({
    getMemorySearchManager: getMemorySearchManager,
}); });
vitest_1.vi.mock("../config/config.js", function () { return ({
    loadConfig: loadConfig,
}); });
vitest_1.vi.mock("../agents/agent-scope.js", function () { return ({
    resolveDefaultAgentId: resolveDefaultAgentId,
}); });
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var setVerbose;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.restoreAllMocks();
                getMemorySearchManager.mockReset();
                process.exitCode = undefined;
                return [4 /*yield*/, Promise.resolve().then(function () { return require("../globals.js"); })];
            case 1:
                setVerbose = (_a.sent()).setVerbose;
                setVerbose(false);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("memory cli", function () {
    (0, vitest_1.it)("prints vector status when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, defaultRuntime, close, log, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            probeVectorAvailability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            }); }); }),
                            status: function () { return ({
                                files: 2,
                                chunks: 5,
                                dirty: false,
                                workspaceDir: "/tmp/openclaw",
                                dbPath: "/tmp/memory.sqlite",
                                provider: "openai",
                                model: "text-embedding-3-small",
                                requestedProvider: "openai",
                                cache: { enabled: true, entries: 123, maxEntries: 50000 },
                                fts: { enabled: true, available: true },
                                vector: {
                                    enabled: true,
                                    available: true,
                                    extensionPath: "/opt/sqlite-vec.dylib",
                                    dims: 1024,
                                },
                            }); },
                            close: close,
                        },
                    });
                    log = vitest_1.vi.spyOn(defaultRuntime, "log").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "status"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Vector: ready"));
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Vector dims: 1024"));
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Vector path: /opt/sqlite-vec.dylib"));
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("FTS: ready"));
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Embedding cache: enabled (123 entries)"));
                    (0, vitest_1.expect)(close).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prints vector error when unavailable", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, defaultRuntime, close, log, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            probeVectorAvailability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, false];
                            }); }); }),
                            status: function () { return ({
                                files: 0,
                                chunks: 0,
                                dirty: true,
                                workspaceDir: "/tmp/openclaw",
                                dbPath: "/tmp/memory.sqlite",
                                provider: "openai",
                                model: "text-embedding-3-small",
                                requestedProvider: "openai",
                                vector: {
                                    enabled: true,
                                    available: false,
                                    loadError: "load failed",
                                },
                            }); },
                            close: close,
                        },
                    });
                    log = vitest_1.vi.spyOn(defaultRuntime, "log").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "status", "--agent", "main"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Vector: unavailable"));
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Vector error: load failed"));
                    (0, vitest_1.expect)(close).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prints embeddings status when deep", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, defaultRuntime, close, probeEmbeddingAvailability, log, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    probeEmbeddingAvailability = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true })];
                    }); }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            probeVectorAvailability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            }); }); }),
                            probeEmbeddingAvailability: probeEmbeddingAvailability,
                            status: function () { return ({
                                files: 1,
                                chunks: 1,
                                dirty: false,
                                workspaceDir: "/tmp/openclaw",
                                dbPath: "/tmp/memory.sqlite",
                                provider: "openai",
                                model: "text-embedding-3-small",
                                requestedProvider: "openai",
                                vector: { enabled: true, available: true },
                            }); },
                            close: close,
                        },
                    });
                    log = vitest_1.vi.spyOn(defaultRuntime, "log").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "status", "--deep"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(probeEmbeddingAvailability).toHaveBeenCalled();
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Embeddings: ready"));
                    (0, vitest_1.expect)(close).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("enables verbose logging with --verbose", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, isVerbose, close, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../globals.js"); })];
                case 2:
                    isVerbose = (_a.sent()).isVerbose;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            probeVectorAvailability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            }); }); }),
                            status: function () { return ({
                                files: 0,
                                chunks: 0,
                                dirty: false,
                                workspaceDir: "/tmp/openclaw",
                                dbPath: "/tmp/memory.sqlite",
                                provider: "openai",
                                model: "text-embedding-3-small",
                                requestedProvider: "openai",
                                vector: { enabled: true, available: true },
                            }); },
                            close: close,
                        },
                    });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "status", "--verbose"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(isVerbose()).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs close failure after status", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, defaultRuntime, close, error, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("close boom");
                        });
                    }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            probeVectorAvailability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            }); }); }),
                            status: function () { return ({
                                files: 1,
                                chunks: 1,
                                dirty: false,
                                workspaceDir: "/tmp/openclaw",
                                dbPath: "/tmp/memory.sqlite",
                                provider: "openai",
                                model: "text-embedding-3-small",
                                requestedProvider: "openai",
                            }); },
                            close: close,
                        },
                    });
                    error = vitest_1.vi.spyOn(defaultRuntime, "error").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "status"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(close).toHaveBeenCalled();
                    (0, vitest_1.expect)(error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Memory manager close failed: close boom"));
                    (0, vitest_1.expect)(process.exitCode).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reindexes on status --index", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, defaultRuntime, close, sync, probeEmbeddingAvailability, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    sync = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    probeEmbeddingAvailability = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true })];
                    }); }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            probeVectorAvailability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            }); }); }),
                            probeEmbeddingAvailability: probeEmbeddingAvailability,
                            sync: sync,
                            status: function () { return ({
                                files: 1,
                                chunks: 1,
                                dirty: false,
                                workspaceDir: "/tmp/openclaw",
                                dbPath: "/tmp/memory.sqlite",
                                provider: "openai",
                                model: "text-embedding-3-small",
                                requestedProvider: "openai",
                                vector: { enabled: true, available: true },
                            }); },
                            close: close,
                        },
                    });
                    vitest_1.vi.spyOn(defaultRuntime, "log").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "status", "--index"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(sync).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ reason: "cli", progress: vitest_1.expect.any(Function) }));
                    (0, vitest_1.expect)(probeEmbeddingAvailability).toHaveBeenCalled();
                    (0, vitest_1.expect)(close).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("closes manager after index", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, defaultRuntime, close, sync, log, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    sync = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            sync: sync,
                            close: close,
                        },
                    });
                    log = vitest_1.vi.spyOn(defaultRuntime, "log").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "index"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(sync).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ reason: "cli", force: false, progress: vitest_1.expect.any(Function) }));
                    (0, vitest_1.expect)(close).toHaveBeenCalled();
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith("Memory index updated (main).");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs close failures without failing the command", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, defaultRuntime, close, sync, error, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("close boom");
                        });
                    }); });
                    sync = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            sync: sync,
                            close: close,
                        },
                    });
                    error = vitest_1.vi.spyOn(defaultRuntime, "error").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "index"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(sync).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ reason: "cli", force: false, progress: vitest_1.expect.any(Function) }));
                    (0, vitest_1.expect)(close).toHaveBeenCalled();
                    (0, vitest_1.expect)(error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Memory manager close failed: close boom"));
                    (0, vitest_1.expect)(process.exitCode).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs close failure after search", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, defaultRuntime, close, search, error, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("close boom");
                        });
                    }); });
                    search = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, [
                                    {
                                        path: "memory/2026-01-12.md",
                                        startLine: 1,
                                        endLine: 2,
                                        score: 0.5,
                                        snippet: "Hello",
                                    },
                                ]];
                        });
                    }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            search: search,
                            close: close,
                        },
                    });
                    error = vitest_1.vi.spyOn(defaultRuntime, "error").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "search", "hello"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(search).toHaveBeenCalled();
                    (0, vitest_1.expect)(close).toHaveBeenCalled();
                    (0, vitest_1.expect)(error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Memory manager close failed: close boom"));
                    (0, vitest_1.expect)(process.exitCode).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("closes manager after search error", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerMemoryCli, defaultRuntime, close, search, error, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./memory-cli.js"); })];
                case 1:
                    registerMemoryCli = (_a.sent()).registerMemoryCli;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../runtime.js"); })];
                case 2:
                    defaultRuntime = (_a.sent()).defaultRuntime;
                    close = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    search = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("boom");
                        });
                    }); });
                    getMemorySearchManager.mockResolvedValueOnce({
                        manager: {
                            search: search,
                            close: close,
                        },
                    });
                    error = vitest_1.vi.spyOn(defaultRuntime, "error").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerMemoryCli(program);
                    return [4 /*yield*/, program.parseAsync(["memory", "search", "oops"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(search).toHaveBeenCalled();
                    (0, vitest_1.expect)(close).toHaveBeenCalled();
                    (0, vitest_1.expect)(error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Memory search failed: boom"));
                    (0, vitest_1.expect)(process.exitCode).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
