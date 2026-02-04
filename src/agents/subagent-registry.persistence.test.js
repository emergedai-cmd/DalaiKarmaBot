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
var noop = function () { };
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    status: "ok",
                    startedAt: 111,
                    endedAt: 222,
                })];
        });
    }); }),
}); });
vitest_1.vi.mock("../infra/agent-events.js", function () { return ({
    onAgentEvent: vitest_1.vi.fn(function () { return noop; }),
}); });
var announceSpy = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, true];
}); }); });
vitest_1.vi.mock("./subagent-announce.js", function () { return ({
    runSubagentAnnounceFlow: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return announceSpy.apply(void 0, args);
    },
}); });
(0, vitest_1.describe)("subagent registry persistence", function () {
    var previousStateDir = process.env.OPENCLAW_STATE_DIR;
    var tempStateDir = null;
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    announceSpy.mockClear();
                    vitest_1.vi.resetModules();
                    if (!tempStateDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.rm(tempStateDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    tempStateDir = null;
                    _a.label = 2;
                case 2:
                    if (previousStateDir === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previousStateDir;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("persists runs to disk and resumes after restart", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mod1, registryPath, raw, parsed, run, mod2, first;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-subagent-"))];
                case 1:
                    tempStateDir = _g.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-registry.js"); })];
                case 2:
                    mod1 = _g.sent();
                    mod1.registerSubagentRun({
                        runId: "run-1",
                        childSessionKey: "agent:main:subagent:test",
                        requesterSessionKey: "agent:main:main",
                        requesterOrigin: { channel: " whatsapp ", accountId: " acct-main " },
                        requesterDisplayKey: "main",
                        task: "do the thing",
                        cleanup: "keep",
                    });
                    registryPath = node_path_1.default.join(tempStateDir, "subagents", "runs.json");
                    return [4 /*yield*/, promises_1.default.readFile(registryPath, "utf8")];
                case 3:
                    raw = _g.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)(parsed.runs && Object.keys(parsed.runs)).toContain("run-1");
                    run = (_a = parsed.runs) === null || _a === void 0 ? void 0 : _a["run-1"];
                    (0, vitest_1.expect)(run).toBeDefined();
                    if (run) {
                        (0, vitest_1.expect)("requesterAccountId" in run).toBe(false);
                        (0, vitest_1.expect)("requesterChannel" in run).toBe(false);
                    }
                    (0, vitest_1.expect)((_b = run === null || run === void 0 ? void 0 : run.requesterOrigin) === null || _b === void 0 ? void 0 : _b.channel).toBe("whatsapp");
                    (0, vitest_1.expect)((_c = run === null || run === void 0 ? void 0 : run.requesterOrigin) === null || _c === void 0 ? void 0 : _c.accountId).toBe("acct-main");
                    // Simulate a process restart: module re-import should load persisted runs
                    // and trigger the announce flow once the run resolves.
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-registry.js"); })];
                case 4:
                    mod2 = _g.sent();
                    mod2.initSubagentRegistry();
                    // allow queued async wait/cleanup to execute
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 0); })];
                case 5:
                    // allow queued async wait/cleanup to execute
                    _g.sent();
                    (0, vitest_1.expect)(announceSpy).toHaveBeenCalled();
                    first = (_d = announceSpy.mock.calls[0]) === null || _d === void 0 ? void 0 : _d[0];
                    (0, vitest_1.expect)(first.childSessionKey).toBe("agent:main:subagent:test");
                    (0, vitest_1.expect)((_e = first.requesterOrigin) === null || _e === void 0 ? void 0 : _e.channel).toBe("whatsapp");
                    (0, vitest_1.expect)((_f = first.requesterOrigin) === null || _f === void 0 ? void 0 : _f.accountId).toBe("acct-main");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips cleanup when cleanupHandled was persisted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registryPath, persisted, mod, calls, match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-subagent-"))];
                case 1:
                    tempStateDir = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    registryPath = node_path_1.default.join(tempStateDir, "subagents", "runs.json");
                    persisted = {
                        version: 2,
                        runs: {
                            "run-2": {
                                runId: "run-2",
                                childSessionKey: "agent:main:subagent:two",
                                requesterSessionKey: "agent:main:main",
                                requesterDisplayKey: "main",
                                task: "do the other thing",
                                cleanup: "keep",
                                createdAt: 1,
                                startedAt: 1,
                                endedAt: 2,
                                cleanupHandled: true, // Already handled - should be skipped
                            },
                        },
                    };
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(registryPath), { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(registryPath, "".concat(JSON.stringify(persisted), "\n"), "utf8")];
                case 3:
                    _a.sent();
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-registry.js"); })];
                case 4:
                    mod = _a.sent();
                    mod.initSubagentRegistry();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 0); })];
                case 5:
                    _a.sent();
                    calls = announceSpy.mock.calls.map(function (call) { return call[0]; });
                    match = calls.find(function (params) {
                        return params.childSessionKey === "agent:main:subagent:two";
                    });
                    (0, vitest_1.expect)(match).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("maps legacy announce fields into cleanup state", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registryPath, persisted, loadSubagentRegistryFromDisk, runs, entry, after, _a, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-subagent-"))];
                case 1:
                    tempStateDir = _e.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    registryPath = node_path_1.default.join(tempStateDir, "subagents", "runs.json");
                    persisted = {
                        version: 1,
                        runs: {
                            "run-legacy": {
                                runId: "run-legacy",
                                childSessionKey: "agent:main:subagent:legacy",
                                requesterSessionKey: "agent:main:main",
                                requesterDisplayKey: "main",
                                task: "legacy announce",
                                cleanup: "keep",
                                createdAt: 1,
                                startedAt: 1,
                                endedAt: 2,
                                announceCompletedAt: 9,
                                announceHandled: true,
                                requesterChannel: "whatsapp",
                                requesterAccountId: "legacy-account",
                            },
                        },
                    };
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(registryPath), { recursive: true })];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(registryPath, "".concat(JSON.stringify(persisted), "\n"), "utf8")];
                case 3:
                    _e.sent();
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-registry.store.js"); })];
                case 4:
                    loadSubagentRegistryFromDisk = (_e.sent()).loadSubagentRegistryFromDisk;
                    runs = loadSubagentRegistryFromDisk();
                    entry = runs.get("run-legacy");
                    (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.cleanupHandled).toBe(true);
                    (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.cleanupCompletedAt).toBe(9);
                    (0, vitest_1.expect)((_c = entry === null || entry === void 0 ? void 0 : entry.requesterOrigin) === null || _c === void 0 ? void 0 : _c.channel).toBe("whatsapp");
                    (0, vitest_1.expect)((_d = entry === null || entry === void 0 ? void 0 : entry.requesterOrigin) === null || _d === void 0 ? void 0 : _d.accountId).toBe("legacy-account");
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(registryPath, "utf8")];
                case 5:
                    after = _b.apply(_a, [_e.sent()]);
                    (0, vitest_1.expect)(after.version).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("retries cleanup announce after a failed announce", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registryPath, persisted, mod1, afterFirst, _a, _b, mod2, afterSecond, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-subagent-"))];
                case 1:
                    tempStateDir = _e.sent();
                    process.env.OPENCLAW_STATE_DIR = tempStateDir;
                    registryPath = node_path_1.default.join(tempStateDir, "subagents", "runs.json");
                    persisted = {
                        version: 2,
                        runs: {
                            "run-3": {
                                runId: "run-3",
                                childSessionKey: "agent:main:subagent:three",
                                requesterSessionKey: "agent:main:main",
                                requesterDisplayKey: "main",
                                task: "retry announce",
                                cleanup: "keep",
                                createdAt: 1,
                                startedAt: 1,
                                endedAt: 2,
                            },
                        },
                    };
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(registryPath), { recursive: true })];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(registryPath, "".concat(JSON.stringify(persisted), "\n"), "utf8")];
                case 3:
                    _e.sent();
                    announceSpy.mockResolvedValueOnce(false);
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-registry.js"); })];
                case 4:
                    mod1 = _e.sent();
                    mod1.initSubagentRegistry();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 0); })];
                case 5:
                    _e.sent();
                    (0, vitest_1.expect)(announceSpy).toHaveBeenCalledTimes(1);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(registryPath, "utf8")];
                case 6:
                    afterFirst = _b.apply(_a, [_e.sent()]);
                    (0, vitest_1.expect)(afterFirst.runs["run-3"].cleanupHandled).toBe(false);
                    (0, vitest_1.expect)(afterFirst.runs["run-3"].cleanupCompletedAt).toBeUndefined();
                    announceSpy.mockResolvedValueOnce(true);
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./subagent-registry.js"); })];
                case 7:
                    mod2 = _e.sent();
                    mod2.initSubagentRegistry();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 0); })];
                case 8:
                    _e.sent();
                    (0, vitest_1.expect)(announceSpy).toHaveBeenCalledTimes(2);
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(registryPath, "utf8")];
                case 9:
                    afterSecond = _d.apply(_c, [_e.sent()]);
                    (0, vitest_1.expect)(afterSecond.runs["run-3"].cleanupCompletedAt).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
