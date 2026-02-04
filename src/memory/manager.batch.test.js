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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var index_js_1 = require("./index.js");
var embedBatch = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, []];
}); }); });
var embedQuery = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, [0.5, 0.5, 0.5]];
}); }); });
vitest_1.vi.mock("./embeddings.js", function () { return ({
    createEmbeddingProvider: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    requestedProvider: "openai",
                    provider: {
                        id: "openai",
                        model: "text-embedding-3-small",
                        embedQuery: embedQuery,
                        embedBatch: embedBatch,
                    },
                    openAi: {
                        baseUrl: "https://api.openai.com/v1",
                        headers: { Authorization: "Bearer test", "Content-Type": "application/json" },
                        model: "text-embedding-3-small",
                    },
                })];
        });
    }); },
}); });
(0, vitest_1.describe)("memory indexing with OpenAI batches", function () {
    var workspaceDir;
    var indexPath;
    var manager = null;
    var setTimeoutSpy;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var realSetTimeout;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    embedBatch.mockClear();
                    embedQuery.mockClear();
                    embedBatch.mockImplementation(function (texts) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, texts.map(function (_text, index) { return [index + 1, 0, 0]; })];
                    }); }); });
                    realSetTimeout = setTimeout;
                    setTimeoutSpy = vitest_1.vi.spyOn(global, "setTimeout").mockImplementation((function (handler, timeout) {
                        var args = [];
                        for (var _i = 2; _i < arguments.length; _i++) {
                            args[_i - 2] = arguments[_i];
                        }
                        var delay = typeof timeout === "number" ? timeout : 0;
                        if (delay > 0 && delay <= 2000) {
                            return realSetTimeout.apply(void 0, __spreadArray([handler, 0], args, false));
                        }
                        return realSetTimeout.apply(void 0, __spreadArray([handler, delay], args, false));
                    }));
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-mem-batch-"))];
                case 1:
                    workspaceDir = _a.sent();
                    indexPath = node_path_1.default.join(workspaceDir, "index.sqlite");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(workspaceDir, "memory"))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.unstubAllGlobals();
                    setTimeoutSpy.mockRestore();
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
    (0, vitest_1.it)("uses OpenAI batch uploads when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var content, uploadedRequests, fetchMock, cfg, result, labels, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = ["hello", "from", "batch"].join("\n\n");
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "2026-01-07.md"), content)];
                case 1:
                    _a.sent();
                    uploadedRequests = [];
                    fetchMock = vitest_1.vi.fn(function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url, body, _i, _a, _b, key, value, text, lines;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                                    if (!url.endsWith("/files")) return [3 /*break*/, 6];
                                    body = init === null || init === void 0 ? void 0 : init.body;
                                    if (!(body instanceof FormData)) {
                                        throw new Error("expected FormData upload");
                                    }
                                    _i = 0, _a = body.entries();
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                    _b = _a[_i], key = _b[0], value = _b[1];
                                    if (key !== "file") {
                                        return [3 /*break*/, 4];
                                    }
                                    if (!(typeof value === "string")) return [3 /*break*/, 2];
                                    uploadedRequests = value
                                        .split("\n")
                                        .filter(Boolean)
                                        .map(function (line) { return JSON.parse(line); });
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, value.text()];
                                case 3:
                                    text = _c.sent();
                                    uploadedRequests = text
                                        .split("\n")
                                        .filter(Boolean)
                                        .map(function (line) { return JSON.parse(line); });
                                    _c.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 5: return [2 /*return*/, new Response(JSON.stringify({ id: "file_1" }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                                case 6:
                                    if (url.endsWith("/batches")) {
                                        return [2 /*return*/, new Response(JSON.stringify({ id: "batch_1", status: "in_progress" }), {
                                                status: 200,
                                                headers: { "Content-Type": "application/json" },
                                            })];
                                    }
                                    if (url.endsWith("/batches/batch_1")) {
                                        return [2 /*return*/, new Response(JSON.stringify({ id: "batch_1", status: "completed", output_file_id: "file_out" }), { status: 200, headers: { "Content-Type": "application/json" } })];
                                    }
                                    if (url.endsWith("/files/file_out/content")) {
                                        lines = uploadedRequests.map(function (request, index) {
                                            return JSON.stringify({
                                                custom_id: request.custom_id,
                                                response: {
                                                    status_code: 200,
                                                    body: { data: [{ embedding: [index + 1, 0, 0], index: 0 }] },
                                                },
                                            });
                                        });
                                        return [2 /*return*/, new Response(lines.join("\n"), {
                                                status: 200,
                                                headers: { "Content-Type": "application/jsonl" },
                                            })];
                                    }
                                    throw new Error("unexpected fetch ".concat(url));
                            }
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "text-embedding-3-small",
                                    store: { path: indexPath },
                                    sync: { watch: false, onSessionStart: false, onSearch: false },
                                    query: { minScore: 0 },
                                    remote: { batch: { enabled: true, wait: true, pollIntervalMs: 1 } },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    labels = [];
                    return [4 /*yield*/, manager.sync({
                            force: true,
                            progress: function (update) {
                                if (update.label) {
                                    labels.push(update.label);
                                }
                            },
                        })];
                case 3:
                    _a.sent();
                    status = manager.status();
                    (0, vitest_1.expect)(status.chunks).toBeGreaterThan(0);
                    (0, vitest_1.expect)(embedBatch).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(fetchMock).toHaveBeenCalled();
                    (0, vitest_1.expect)(labels.some(function (label) { return label.toLowerCase().includes("batch"); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("retries OpenAI batch create on transient failures", function () { return __awaiter(void 0, void 0, void 0, function () {
        var content, uploadedRequests, batchCreates, fetchMock, cfg, result, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = ["retry", "the", "batch"].join("\n\n");
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "2026-01-08.md"), content)];
                case 1:
                    _a.sent();
                    uploadedRequests = [];
                    batchCreates = 0;
                    fetchMock = vitest_1.vi.fn(function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url, body, _i, _a, _b, key, value, text, lines;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                                    if (!url.endsWith("/files")) return [3 /*break*/, 6];
                                    body = init === null || init === void 0 ? void 0 : init.body;
                                    if (!(body instanceof FormData)) {
                                        throw new Error("expected FormData upload");
                                    }
                                    _i = 0, _a = body.entries();
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                    _b = _a[_i], key = _b[0], value = _b[1];
                                    if (key !== "file") {
                                        return [3 /*break*/, 4];
                                    }
                                    if (!(typeof value === "string")) return [3 /*break*/, 2];
                                    uploadedRequests = value
                                        .split("\n")
                                        .filter(Boolean)
                                        .map(function (line) { return JSON.parse(line); });
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, value.text()];
                                case 3:
                                    text = _c.sent();
                                    uploadedRequests = text
                                        .split("\n")
                                        .filter(Boolean)
                                        .map(function (line) { return JSON.parse(line); });
                                    _c.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 5: return [2 /*return*/, new Response(JSON.stringify({ id: "file_1" }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                                case 6:
                                    if (url.endsWith("/batches")) {
                                        batchCreates += 1;
                                        if (batchCreates === 1) {
                                            return [2 /*return*/, new Response("upstream connect error", { status: 503 })];
                                        }
                                        return [2 /*return*/, new Response(JSON.stringify({ id: "batch_1", status: "in_progress" }), {
                                                status: 200,
                                                headers: { "Content-Type": "application/json" },
                                            })];
                                    }
                                    if (url.endsWith("/batches/batch_1")) {
                                        return [2 /*return*/, new Response(JSON.stringify({ id: "batch_1", status: "completed", output_file_id: "file_out" }), { status: 200, headers: { "Content-Type": "application/json" } })];
                                    }
                                    if (url.endsWith("/files/file_out/content")) {
                                        lines = uploadedRequests.map(function (request, index) {
                                            return JSON.stringify({
                                                custom_id: request.custom_id,
                                                response: {
                                                    status_code: 200,
                                                    body: { data: [{ embedding: [index + 1, 0, 0], index: 0 }] },
                                                },
                                            });
                                        });
                                        return [2 /*return*/, new Response(lines.join("\n"), {
                                                status: 200,
                                                headers: { "Content-Type": "application/jsonl" },
                                            })];
                                    }
                                    throw new Error("unexpected fetch ".concat(url));
                            }
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "text-embedding-3-small",
                                    store: { path: indexPath },
                                    sync: { watch: false, onSessionStart: false, onSearch: false },
                                    query: { minScore: 0 },
                                    remote: { batch: { enabled: true, wait: true, pollIntervalMs: 1 } },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 3:
                    _a.sent();
                    status = manager.status();
                    (0, vitest_1.expect)(status.chunks).toBeGreaterThan(0);
                    (0, vitest_1.expect)(batchCreates).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to non-batch on failure and resets failures after success", function () { return __awaiter(void 0, void 0, void 0, function () {
        var content, uploadedRequests, mode, fetchMock, cfg, result, status;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    content = ["flaky", "batch"].join("\n\n");
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "2026-01-09.md"), content)];
                case 1:
                    _e.sent();
                    uploadedRequests = [];
                    mode = "fail";
                    fetchMock = vitest_1.vi.fn(function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url, body, _i, _a, _b, key, value, text, lines;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                                    if (!url.endsWith("/files")) return [3 /*break*/, 6];
                                    body = init === null || init === void 0 ? void 0 : init.body;
                                    if (!(body instanceof FormData)) {
                                        throw new Error("expected FormData upload");
                                    }
                                    _i = 0, _a = body.entries();
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                    _b = _a[_i], key = _b[0], value = _b[1];
                                    if (key !== "file") {
                                        return [3 /*break*/, 4];
                                    }
                                    if (!(typeof value === "string")) return [3 /*break*/, 2];
                                    uploadedRequests = value
                                        .split("\n")
                                        .filter(Boolean)
                                        .map(function (line) { return JSON.parse(line); });
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, value.text()];
                                case 3:
                                    text = _c.sent();
                                    uploadedRequests = text
                                        .split("\n")
                                        .filter(Boolean)
                                        .map(function (line) { return JSON.parse(line); });
                                    _c.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 5: return [2 /*return*/, new Response(JSON.stringify({ id: "file_1" }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                                case 6:
                                    if (url.endsWith("/batches")) {
                                        if (mode === "fail") {
                                            return [2 /*return*/, new Response("batch failed", { status: 500 })];
                                        }
                                        return [2 /*return*/, new Response(JSON.stringify({ id: "batch_1", status: "in_progress" }), {
                                                status: 200,
                                                headers: { "Content-Type": "application/json" },
                                            })];
                                    }
                                    if (url.endsWith("/batches/batch_1")) {
                                        return [2 /*return*/, new Response(JSON.stringify({ id: "batch_1", status: "completed", output_file_id: "file_out" }), { status: 200, headers: { "Content-Type": "application/json" } })];
                                    }
                                    if (url.endsWith("/files/file_out/content")) {
                                        lines = uploadedRequests.map(function (request, index) {
                                            return JSON.stringify({
                                                custom_id: request.custom_id,
                                                response: {
                                                    status_code: 200,
                                                    body: { data: [{ embedding: [index + 1, 0, 0], index: 0 }] },
                                                },
                                            });
                                        });
                                        return [2 /*return*/, new Response(lines.join("\n"), {
                                                status: 200,
                                                headers: { "Content-Type": "application/jsonl" },
                                            })];
                                    }
                                    throw new Error("unexpected fetch ".concat(url));
                            }
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "text-embedding-3-small",
                                    store: { path: indexPath },
                                    sync: { watch: false, onSessionStart: false, onSearch: false },
                                    query: { minScore: 0 },
                                    remote: { batch: { enabled: true, wait: true, pollIntervalMs: 1 } },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 2:
                    result = _e.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 3:
                    _e.sent();
                    (0, vitest_1.expect)(embedBatch).toHaveBeenCalled();
                    status = manager.status();
                    (0, vitest_1.expect)((_a = status.batch) === null || _a === void 0 ? void 0 : _a.enabled).toBe(true);
                    (0, vitest_1.expect)((_b = status.batch) === null || _b === void 0 ? void 0 : _b.failures).toBe(1);
                    embedBatch.mockClear();
                    mode = "ok";
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "2026-01-09.md"), ["flaky", "batch", "recovery"].join("\n\n"))];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 5:
                    _e.sent();
                    status = manager.status();
                    (0, vitest_1.expect)((_c = status.batch) === null || _c === void 0 ? void 0 : _c.enabled).toBe(true);
                    (0, vitest_1.expect)((_d = status.batch) === null || _d === void 0 ? void 0 : _d.failures).toBe(0);
                    (0, vitest_1.expect)(embedBatch).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("disables batch after repeated failures and skips batch thereafter", function () { return __awaiter(void 0, void 0, void 0, function () {
        var content, uploadedRequests, fetchMock, cfg, result, status, fetchCalls;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    content = ["repeat", "failures"].join("\n\n");
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "2026-01-10.md"), content)];
                case 1:
                    _e.sent();
                    uploadedRequests = [];
                    fetchMock = vitest_1.vi.fn(function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url, body, _i, _a, _b, key, value, text, lines;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
                                    if (!url.endsWith("/files")) return [3 /*break*/, 6];
                                    body = init === null || init === void 0 ? void 0 : init.body;
                                    if (!(body instanceof FormData)) {
                                        throw new Error("expected FormData upload");
                                    }
                                    _i = 0, _a = body.entries();
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                    _b = _a[_i], key = _b[0], value = _b[1];
                                    if (key !== "file") {
                                        return [3 /*break*/, 4];
                                    }
                                    if (!(typeof value === "string")) return [3 /*break*/, 2];
                                    uploadedRequests = value
                                        .split("\n")
                                        .filter(Boolean)
                                        .map(function (line) { return JSON.parse(line); });
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, value.text()];
                                case 3:
                                    text = _c.sent();
                                    uploadedRequests = text
                                        .split("\n")
                                        .filter(Boolean)
                                        .map(function (line) { return JSON.parse(line); });
                                    _c.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 5: return [2 /*return*/, new Response(JSON.stringify({ id: "file_1" }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                                case 6:
                                    if (url.endsWith("/batches")) {
                                        return [2 /*return*/, new Response("batch failed", { status: 500 })];
                                    }
                                    if (url.endsWith("/files/file_out/content")) {
                                        lines = uploadedRequests.map(function (request, index) {
                                            return JSON.stringify({
                                                custom_id: request.custom_id,
                                                response: {
                                                    status_code: 200,
                                                    body: { data: [{ embedding: [index + 1, 0, 0], index: 0 }] },
                                                },
                                            });
                                        });
                                        return [2 /*return*/, new Response(lines.join("\n"), {
                                                status: 200,
                                                headers: { "Content-Type": "application/jsonl" },
                                            })];
                                    }
                                    throw new Error("unexpected fetch ".concat(url));
                            }
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    cfg = {
                        agents: {
                            defaults: {
                                workspace: workspaceDir,
                                memorySearch: {
                                    provider: "openai",
                                    model: "text-embedding-3-small",
                                    store: { path: indexPath },
                                    sync: { watch: false, onSessionStart: false, onSearch: false },
                                    query: { minScore: 0 },
                                    remote: { batch: { enabled: true, wait: true, pollIntervalMs: 1 } },
                                },
                            },
                            list: [{ id: "main", default: true }],
                        },
                    };
                    return [4 /*yield*/, (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: "main" })];
                case 2:
                    result = _e.sent();
                    (0, vitest_1.expect)(result.manager).not.toBeNull();
                    if (!result.manager) {
                        throw new Error("manager missing");
                    }
                    manager = result.manager;
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 3:
                    _e.sent();
                    status = manager.status();
                    (0, vitest_1.expect)((_a = status.batch) === null || _a === void 0 ? void 0 : _a.enabled).toBe(true);
                    (0, vitest_1.expect)((_b = status.batch) === null || _b === void 0 ? void 0 : _b.failures).toBe(1);
                    embedBatch.mockClear();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "2026-01-10.md"), ["repeat", "failures", "again"].join("\n\n"))];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 5:
                    _e.sent();
                    status = manager.status();
                    (0, vitest_1.expect)((_c = status.batch) === null || _c === void 0 ? void 0 : _c.enabled).toBe(false);
                    (0, vitest_1.expect)((_d = status.batch) === null || _d === void 0 ? void 0 : _d.failures).toBeGreaterThanOrEqual(2);
                    fetchCalls = fetchMock.mock.calls.length;
                    embedBatch.mockClear();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, "memory", "2026-01-10.md"), ["repeat", "failures", "fallback"].join("\n\n"))];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, manager.sync({ force: true })];
                case 7:
                    _e.sent();
                    (0, vitest_1.expect)(fetchMock.mock.calls.length).toBe(fetchCalls);
                    (0, vitest_1.expect)(embedBatch).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
