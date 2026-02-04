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
var service_js_1 = require("./service.js");
var noopLogger = {
    debug: vitest_1.vi.fn(),
    info: vitest_1.vi.fn(),
    warn: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
};
function makeStorePath() {
    return __awaiter(this, void 0, void 0, function () {
        var dir;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-cron-"))];
                case 1:
                    dir = _a.sent();
                    return [2 /*return*/, {
                            storePath: node_path_1.default.join(dir, "cron", "jobs.json"),
                            cleanup: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        }];
            }
        });
    });
}
(0, vitest_1.describe)("CronService", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.setSystemTime(new Date("2025-12-13T00:00:00.000Z"));
        noopLogger.debug.mockClear();
        noopLogger.info.mockClear();
        noopLogger.warn.mockClear();
        noopLogger.error.mockClear();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("runs a one-shot main job and disables it after success", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, enqueueSystemEvent, requestHeartbeatNow, cron, atMs, job, jobs, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeStorePath()];
                case 1:
                    store = _a.sent();
                    enqueueSystemEvent = vitest_1.vi.fn();
                    requestHeartbeatNow = vitest_1.vi.fn();
                    cron = new service_js_1.CronService({
                        storePath: store.storePath,
                        cronEnabled: true,
                        log: noopLogger,
                        enqueueSystemEvent: enqueueSystemEvent,
                        requestHeartbeatNow: requestHeartbeatNow,
                        runIsolatedAgentJob: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ status: "ok" })];
                        }); }); }),
                    });
                    return [4 /*yield*/, cron.start()];
                case 2:
                    _a.sent();
                    atMs = Date.parse("2025-12-13T00:00:02.000Z");
                    return [4 /*yield*/, cron.add({
                            name: "one-shot hello",
                            enabled: true,
                            schedule: { kind: "at", atMs: atMs },
                            sessionTarget: "main",
                            wakeMode: "now",
                            payload: { kind: "systemEvent", text: "hello" },
                        })];
                case 3:
                    job = _a.sent();
                    (0, vitest_1.expect)(job.state.nextRunAtMs).toBe(atMs);
                    vitest_1.vi.setSystemTime(new Date("2025-12-13T00:00:02.000Z"));
                    return [4 /*yield*/, vitest_1.vi.runOnlyPendingTimersAsync()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, cron.list({ includeDisabled: true })];
                case 5:
                    jobs = _a.sent();
                    updated = jobs.find(function (j) { return j.id === job.id; });
                    (0, vitest_1.expect)(updated === null || updated === void 0 ? void 0 : updated.enabled).toBe(false);
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("hello", {
                        agentId: undefined,
                    });
                    (0, vitest_1.expect)(requestHeartbeatNow).toHaveBeenCalled();
                    return [4 /*yield*/, cron.list({ includeDisabled: true })];
                case 6:
                    _a.sent();
                    cron.stop();
                    return [4 /*yield*/, store.cleanup()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs a one-shot job and deletes it after success when requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, enqueueSystemEvent, requestHeartbeatNow, cron, atMs, job, jobs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeStorePath()];
                case 1:
                    store = _a.sent();
                    enqueueSystemEvent = vitest_1.vi.fn();
                    requestHeartbeatNow = vitest_1.vi.fn();
                    cron = new service_js_1.CronService({
                        storePath: store.storePath,
                        cronEnabled: true,
                        log: noopLogger,
                        enqueueSystemEvent: enqueueSystemEvent,
                        requestHeartbeatNow: requestHeartbeatNow,
                        runIsolatedAgentJob: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ status: "ok" })];
                        }); }); }),
                    });
                    return [4 /*yield*/, cron.start()];
                case 2:
                    _a.sent();
                    atMs = Date.parse("2025-12-13T00:00:02.000Z");
                    return [4 /*yield*/, cron.add({
                            name: "one-shot delete",
                            enabled: true,
                            deleteAfterRun: true,
                            schedule: { kind: "at", atMs: atMs },
                            sessionTarget: "main",
                            wakeMode: "now",
                            payload: { kind: "systemEvent", text: "hello" },
                        })];
                case 3:
                    job = _a.sent();
                    vitest_1.vi.setSystemTime(new Date("2025-12-13T00:00:02.000Z"));
                    return [4 /*yield*/, vitest_1.vi.runOnlyPendingTimersAsync()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, cron.list({ includeDisabled: true })];
                case 5:
                    jobs = _a.sent();
                    (0, vitest_1.expect)(jobs.find(function (j) { return j.id === job.id; })).toBeUndefined();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("hello", {
                        agentId: undefined,
                    });
                    (0, vitest_1.expect)(requestHeartbeatNow).toHaveBeenCalled();
                    cron.stop();
                    return [4 /*yield*/, store.cleanup()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("wakeMode now waits for heartbeat completion when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, enqueueSystemEvent, requestHeartbeatNow, now, nowMs, resolveHeartbeat, runHeartbeatOnce, cron, job, runPromise, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeStorePath()];
                case 1:
                    store = _a.sent();
                    enqueueSystemEvent = vitest_1.vi.fn();
                    requestHeartbeatNow = vitest_1.vi.fn();
                    now = 0;
                    nowMs = function () {
                        now += 10;
                        return now;
                    };
                    resolveHeartbeat = null;
                    runHeartbeatOnce = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                        resolveHeartbeat = resolve;
                                    })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); });
                    cron = new service_js_1.CronService({
                        storePath: store.storePath,
                        cronEnabled: true,
                        log: noopLogger,
                        nowMs: nowMs,
                        enqueueSystemEvent: enqueueSystemEvent,
                        requestHeartbeatNow: requestHeartbeatNow,
                        runHeartbeatOnce: runHeartbeatOnce,
                        runIsolatedAgentJob: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ status: "ok" })];
                        }); }); }),
                    });
                    return [4 /*yield*/, cron.start()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, cron.add({
                            name: "wakeMode now waits",
                            enabled: true,
                            schedule: { kind: "at", atMs: 1 },
                            sessionTarget: "main",
                            wakeMode: "now",
                            payload: { kind: "systemEvent", text: "hello" },
                        })];
                case 3:
                    job = _a.sent();
                    runPromise = cron.run(job.id, "force");
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < 10)) return [3 /*break*/, 7];
                    if (runHeartbeatOnce.mock.calls.length > 0) {
                        return [3 /*break*/, 7];
                    }
                    // Let the locked() chain progress.
                    return [4 /*yield*/, Promise.resolve()];
                case 5:
                    // Let the locked() chain progress.
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    (0, vitest_1.expect)(runHeartbeatOnce).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(requestHeartbeatNow).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("hello", {
                        agentId: undefined,
                    });
                    (0, vitest_1.expect)(job.state.runningAtMs).toBeTypeOf("number");
                    resolveHeartbeat === null || resolveHeartbeat === void 0 ? void 0 : resolveHeartbeat({ status: "ran", durationMs: 123 });
                    return [4 /*yield*/, runPromise];
                case 8:
                    _a.sent();
                    (0, vitest_1.expect)(job.state.lastStatus).toBe("ok");
                    (0, vitest_1.expect)(job.state.lastDurationMs).toBeGreaterThan(0);
                    cron.stop();
                    return [4 /*yield*/, store.cleanup()];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs an isolated job and posts summary to main", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, enqueueSystemEvent, requestHeartbeatNow, runIsolatedAgentJob, cron, atMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeStorePath()];
                case 1:
                    store = _a.sent();
                    enqueueSystemEvent = vitest_1.vi.fn();
                    requestHeartbeatNow = vitest_1.vi.fn();
                    runIsolatedAgentJob = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    status: "ok",
                                    summary: "done",
                                })];
                        });
                    }); });
                    cron = new service_js_1.CronService({
                        storePath: store.storePath,
                        cronEnabled: true,
                        log: noopLogger,
                        enqueueSystemEvent: enqueueSystemEvent,
                        requestHeartbeatNow: requestHeartbeatNow,
                        runIsolatedAgentJob: runIsolatedAgentJob,
                    });
                    return [4 /*yield*/, cron.start()];
                case 2:
                    _a.sent();
                    atMs = Date.parse("2025-12-13T00:00:01.000Z");
                    return [4 /*yield*/, cron.add({
                            enabled: true,
                            name: "weekly",
                            schedule: { kind: "at", atMs: atMs },
                            sessionTarget: "isolated",
                            wakeMode: "now",
                            payload: { kind: "agentTurn", message: "do it", deliver: false },
                        })];
                case 3:
                    _a.sent();
                    vitest_1.vi.setSystemTime(new Date("2025-12-13T00:00:01.000Z"));
                    return [4 /*yield*/, vitest_1.vi.runOnlyPendingTimersAsync()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, cron.list({ includeDisabled: true })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(runIsolatedAgentJob).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("Cron: done", {
                        agentId: undefined,
                    });
                    (0, vitest_1.expect)(requestHeartbeatNow).toHaveBeenCalled();
                    cron.stop();
                    return [4 /*yield*/, store.cleanup()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates legacy payload.provider to payload.channel on load", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, enqueueSystemEvent, requestHeartbeatNow, rawJob, cron, jobs, job, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeStorePath()];
                case 1:
                    store = _a.sent();
                    enqueueSystemEvent = vitest_1.vi.fn();
                    requestHeartbeatNow = vitest_1.vi.fn();
                    rawJob = {
                        id: "legacy-1",
                        name: "legacy",
                        enabled: true,
                        createdAtMs: Date.now(),
                        updatedAtMs: Date.now(),
                        schedule: { kind: "cron", expr: "* * * * *" },
                        sessionTarget: "isolated",
                        wakeMode: "now",
                        payload: {
                            kind: "agentTurn",
                            message: "hi",
                            deliver: true,
                            provider: " TeLeGrAm ",
                            to: "7200373102",
                        },
                        state: {},
                    };
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(store.storePath), { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(store.storePath, JSON.stringify({ version: 1, jobs: [rawJob] }, null, 2), "utf-8")];
                case 3:
                    _a.sent();
                    cron = new service_js_1.CronService({
                        storePath: store.storePath,
                        cronEnabled: true,
                        log: noopLogger,
                        enqueueSystemEvent: enqueueSystemEvent,
                        requestHeartbeatNow: requestHeartbeatNow,
                        runIsolatedAgentJob: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ status: "ok" })];
                        }); }); }),
                    });
                    return [4 /*yield*/, cron.start()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, cron.list({ includeDisabled: true })];
                case 5:
                    jobs = _a.sent();
                    job = jobs.find(function (j) { return j.id === rawJob.id; });
                    payload = job === null || job === void 0 ? void 0 : job.payload;
                    (0, vitest_1.expect)(payload.channel).toBe("telegram");
                    (0, vitest_1.expect)("provider" in payload).toBe(false);
                    cron.stop();
                    return [4 /*yield*/, store.cleanup()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("canonicalizes payload.channel casing on load", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, enqueueSystemEvent, requestHeartbeatNow, rawJob, cron, jobs, job, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeStorePath()];
                case 1:
                    store = _a.sent();
                    enqueueSystemEvent = vitest_1.vi.fn();
                    requestHeartbeatNow = vitest_1.vi.fn();
                    rawJob = {
                        id: "legacy-2",
                        name: "legacy",
                        enabled: true,
                        createdAtMs: Date.now(),
                        updatedAtMs: Date.now(),
                        schedule: { kind: "cron", expr: "* * * * *" },
                        sessionTarget: "isolated",
                        wakeMode: "now",
                        payload: {
                            kind: "agentTurn",
                            message: "hi",
                            deliver: true,
                            channel: "Telegram",
                            to: "7200373102",
                        },
                        state: {},
                    };
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(store.storePath), { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(store.storePath, JSON.stringify({ version: 1, jobs: [rawJob] }, null, 2), "utf-8")];
                case 3:
                    _a.sent();
                    cron = new service_js_1.CronService({
                        storePath: store.storePath,
                        cronEnabled: true,
                        log: noopLogger,
                        enqueueSystemEvent: enqueueSystemEvent,
                        requestHeartbeatNow: requestHeartbeatNow,
                        runIsolatedAgentJob: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ status: "ok" })];
                        }); }); }),
                    });
                    return [4 /*yield*/, cron.start()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, cron.list({ includeDisabled: true })];
                case 5:
                    jobs = _a.sent();
                    job = jobs.find(function (j) { return j.id === rawJob.id; });
                    payload = job === null || job === void 0 ? void 0 : job.payload;
                    (0, vitest_1.expect)(payload.channel).toBe("telegram");
                    cron.stop();
                    return [4 /*yield*/, store.cleanup()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("posts last output to main even when isolated job errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, enqueueSystemEvent, requestHeartbeatNow, runIsolatedAgentJob, cron, atMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeStorePath()];
                case 1:
                    store = _a.sent();
                    enqueueSystemEvent = vitest_1.vi.fn();
                    requestHeartbeatNow = vitest_1.vi.fn();
                    runIsolatedAgentJob = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    status: "error",
                                    summary: "last output",
                                    error: "boom",
                                })];
                        });
                    }); });
                    cron = new service_js_1.CronService({
                        storePath: store.storePath,
                        cronEnabled: true,
                        log: noopLogger,
                        enqueueSystemEvent: enqueueSystemEvent,
                        requestHeartbeatNow: requestHeartbeatNow,
                        runIsolatedAgentJob: runIsolatedAgentJob,
                    });
                    return [4 /*yield*/, cron.start()];
                case 2:
                    _a.sent();
                    atMs = Date.parse("2025-12-13T00:00:01.000Z");
                    return [4 /*yield*/, cron.add({
                            name: "isolated error test",
                            enabled: true,
                            schedule: { kind: "at", atMs: atMs },
                            sessionTarget: "isolated",
                            wakeMode: "now",
                            payload: { kind: "agentTurn", message: "do it", deliver: false },
                        })];
                case 3:
                    _a.sent();
                    vitest_1.vi.setSystemTime(new Date("2025-12-13T00:00:01.000Z"));
                    return [4 /*yield*/, vitest_1.vi.runOnlyPendingTimersAsync()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, cron.list({ includeDisabled: true })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).toHaveBeenCalledWith("Cron (error): last output", {
                        agentId: undefined,
                    });
                    (0, vitest_1.expect)(requestHeartbeatNow).toHaveBeenCalled();
                    cron.stop();
                    return [4 /*yield*/, store.cleanup()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects unsupported session/payload combinations", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, cron;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeStorePath()];
                case 1:
                    store = _a.sent();
                    cron = new service_js_1.CronService({
                        storePath: store.storePath,
                        cronEnabled: true,
                        log: noopLogger,
                        enqueueSystemEvent: vitest_1.vi.fn(),
                        requestHeartbeatNow: vitest_1.vi.fn(),
                        runIsolatedAgentJob: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ status: "ok" })];
                        }); }); }),
                    });
                    return [4 /*yield*/, cron.start()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(cron.add({
                            name: "bad combo (main/agentTurn)",
                            enabled: true,
                            schedule: { kind: "every", everyMs: 1000 },
                            sessionTarget: "main",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "agentTurn", message: "nope" },
                        })).rejects.toThrow(/main cron jobs require/)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(cron.add({
                            name: "bad combo (isolated/systemEvent)",
                            enabled: true,
                            schedule: { kind: "every", everyMs: 1000 },
                            sessionTarget: "isolated",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "systemEvent", text: "nope" },
                        })).rejects.toThrow(/isolated cron jobs require/)];
                case 4:
                    _a.sent();
                    cron.stop();
                    return [4 /*yield*/, store.cleanup()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips invalid main jobs with agentTurn payloads from disk", function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, enqueueSystemEvent, requestHeartbeatNow, atMs, cron, jobs;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, makeStorePath()];
                case 1:
                    store = _c.sent();
                    enqueueSystemEvent = vitest_1.vi.fn();
                    requestHeartbeatNow = vitest_1.vi.fn();
                    atMs = Date.parse("2025-12-13T00:00:01.000Z");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(store.storePath), { recursive: true })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(store.storePath, JSON.stringify({
                            version: 1,
                            jobs: [
                                {
                                    id: "job-1",
                                    enabled: true,
                                    createdAtMs: Date.parse("2025-12-13T00:00:00.000Z"),
                                    updatedAtMs: Date.parse("2025-12-13T00:00:00.000Z"),
                                    schedule: { kind: "at", atMs: atMs },
                                    sessionTarget: "main",
                                    wakeMode: "now",
                                    payload: { kind: "agentTurn", message: "bad" },
                                    state: {},
                                },
                            ],
                        }))];
                case 3:
                    _c.sent();
                    cron = new service_js_1.CronService({
                        storePath: store.storePath,
                        cronEnabled: true,
                        log: noopLogger,
                        enqueueSystemEvent: enqueueSystemEvent,
                        requestHeartbeatNow: requestHeartbeatNow,
                        runIsolatedAgentJob: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ status: "ok" })];
                        }); }); }),
                    });
                    return [4 /*yield*/, cron.start()];
                case 4:
                    _c.sent();
                    vitest_1.vi.setSystemTime(new Date("2025-12-13T00:00:01.000Z"));
                    return [4 /*yield*/, vitest_1.vi.runOnlyPendingTimersAsync()];
                case 5:
                    _c.sent();
                    (0, vitest_1.expect)(enqueueSystemEvent).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(requestHeartbeatNow).not.toHaveBeenCalled();
                    return [4 /*yield*/, cron.list({ includeDisabled: true })];
                case 6:
                    jobs = _c.sent();
                    (0, vitest_1.expect)((_a = jobs[0]) === null || _a === void 0 ? void 0 : _a.state.lastStatus).toBe("skipped");
                    (0, vitest_1.expect)((_b = jobs[0]) === null || _b === void 0 ? void 0 : _b.state.lastError).toMatch(/main job requires/i);
                    cron.stop();
                    return [4 /*yield*/, store.cleanup()];
                case 7:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
