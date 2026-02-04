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
var index_js_1 = require("./index.js");
var shouldFail = false;
vitest_1.vi.mock("chokidar", function () { return ({
    default: {
        watch: vitest_1.vi.fn(function () { return ({
            on: vitest_1.vi.fn(),
            close: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, undefined];
            }); }); }),
        }); }),
    },
}); });
vitest_1.vi.mock("./embeddings.js", function () {
    return {
        createEmbeddingProvider: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        requestedProvider: "openai",
                        provider: {
                            id: "mock",
                            model: "mock-embed",
                            embedQuery: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, [1, 0, 0]];
                            }); }); },
                            embedBatch: function (texts) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (shouldFail) {
                                        throw new Error("embedding failure");
                                    }
                                    return [2 /*return*/, texts.map(function (_, index) { return [index + 1, 0, 0]; })];
                                });
                            }); },
                        },
                    })];
            });
        }); },
    };
});
(0, vitest_1.describe)("memory manager atomic reindex", function () {
    var workspaceDir;
    var indexPath;
    var manager = null;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shouldFail = false;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-mem-"))];
                case 1:
                    workspaceDir = _a.sent();
                    indexPath = node_path_1.default.join(workspaceDir, "index.sqlite");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(workspaceDir, "memory"))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "MEMORY.md"), "Hello memory.")];
                case 3:
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
    (0, vitest_1.it)("keeps the prior index when a full reindex fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, result, before, after;
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
                                    cache: { enabled: false },
                                    sync: { watch: false, onSessionStart: false, onSearch: false },
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
                    return [4 /*yield*/, manager.search("Hello")];
                case 3:
                    before = _a.sent();
                    (0, vitest_1.expect)(before.length).toBeGreaterThan(0);
                    shouldFail = true;
                    return [4 /*yield*/, (0, vitest_1.expect)(manager.sync({ force: true })).rejects.toThrow("embedding failure")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, manager.search("Hello")];
                case 5:
                    after = _a.sent();
                    (0, vitest_1.expect)(after.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
