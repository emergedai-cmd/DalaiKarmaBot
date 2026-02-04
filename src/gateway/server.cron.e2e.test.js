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
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
function yieldToEventLoop() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Avoid relying on timers (fake timers can leak between tests).
                return [4 /*yield*/, promises_1.default.stat(process.cwd()).catch(function () { })];
                case 1:
                    // Avoid relying on timers (fake timers can leak between tests).
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function rmTempDir(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var i, err_1, code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 100)) return [3 /*break*/, 8];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 7]);
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4:
                    err_1 = _a.sent();
                    code = err_1 === null || err_1 === void 0 ? void 0 : err_1.code;
                    if (!(code === "ENOTEMPTY" || code === "EBUSY" || code === "EPERM" || code === "EACCES")) return [3 /*break*/, 6];
                    return [4 /*yield*/, yieldToEventLoop()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6: throw err_1;
                case 7:
                    i += 1;
                    return [3 /*break*/, 1];
                case 8: return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function waitForNonEmptyFile(pathname_1) {
    return __awaiter(this, arguments, void 0, function (pathname, timeoutMs) {
        var startedAt, raw, elapsedMs;
        if (timeoutMs === void 0) { timeoutMs = 2000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startedAt = process.hrtime.bigint();
                    _a.label = 1;
                case 1: return [4 /*yield*/, promises_1.default.readFile(pathname, "utf-8").catch(function () { return ""; })];
                case 2:
                    raw = _a.sent();
                    if (raw.trim().length > 0) {
                        return [2 /*return*/, raw];
                    }
                    elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
                    if (elapsedMs >= timeoutMs) {
                        throw new Error("timeout waiting for file ".concat(pathname));
                    }
                    return [4 /*yield*/, yieldToEventLoop()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("gateway server cron", function () {
    (0, vitest_1.test)("handles cron CRUD, normalization, and patch semantics", { timeout: 120000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevSkipCron, dir, _a, server, ws, addRes, listRes, jobs, routeAtMs, routeRes, routeJobIdValue, routeJobId, runRes, events, wrappedAtMs, wrappedRes, wrappedPayload, patchRes, patchJobIdValue, patchJobId, atMs, updateRes, updated, mergeRes, mergeJobIdValue, mergeJobId, mergeUpdateRes, merged, rejectRes, rejectJobIdValue, rejectJobId, rejectUpdateRes, jobIdRes, jobIdValue, jobId, jobIdUpdateRes, disableRes, disableJobIdValue, disableJobId, disableUpdateRes, disabled;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    prevSkipCron = process.env.OPENCLAW_SKIP_CRON;
                    process.env.OPENCLAW_SKIP_CRON = "0";
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-cron-"))];
                case 1:
                    dir = _w.sent();
                    test_helpers_js_1.testState.cronStorePath = node_path_1.default.join(dir, "cron", "jobs.json");
                    test_helpers_js_1.testState.sessionConfig = { mainKey: "primary" };
                    test_helpers_js_1.testState.cronEnabled = false;
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(test_helpers_js_1.testState.cronStorePath), { recursive: true })];
                case 2:
                    _w.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(test_helpers_js_1.testState.cronStorePath, JSON.stringify({ version: 1, jobs: [] }))];
                case 3:
                    _w.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)()];
                case 4:
                    _a = _w.sent(), server = _a.server, ws = _a.ws;
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
                case 5:
                    _w.sent();
                    _w.label = 6;
                case 6:
                    _w.trys.push([6, , 23, 26]);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            name: "daily",
                            enabled: true,
                            schedule: { kind: "every", everyMs: 60000 },
                            sessionTarget: "main",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "systemEvent", text: "hello" },
                        })];
                case 7:
                    addRes = _w.sent();
                    (0, vitest_1.expect)(addRes.ok).toBe(true);
                    (0, vitest_1.expect)(typeof ((_b = addRes.payload) === null || _b === void 0 ? void 0 : _b.id)).toBe("string");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.list", {
                            includeDisabled: true,
                        })];
                case 8:
                    listRes = _w.sent();
                    (0, vitest_1.expect)(listRes.ok).toBe(true);
                    jobs = (_c = listRes.payload) === null || _c === void 0 ? void 0 : _c.jobs;
                    (0, vitest_1.expect)(Array.isArray(jobs)).toBe(true);
                    (0, vitest_1.expect)(jobs.length).toBe(1);
                    (0, vitest_1.expect)((_e = (_d = jobs[0]) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : "").toBe("daily");
                    routeAtMs = Date.now() - 1;
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            name: "route test",
                            enabled: true,
                            schedule: { kind: "at", atMs: routeAtMs },
                            sessionTarget: "main",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "systemEvent", text: "cron route check" },
                        })];
                case 9:
                    routeRes = _w.sent();
                    (0, vitest_1.expect)(routeRes.ok).toBe(true);
                    routeJobIdValue = (_f = routeRes.payload) === null || _f === void 0 ? void 0 : _f.id;
                    routeJobId = typeof routeJobIdValue === "string" ? routeJobIdValue : "";
                    (0, vitest_1.expect)(routeJobId.length > 0).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.run", { id: routeJobId, mode: "force" }, 20000)];
                case 10:
                    runRes = _w.sent();
                    (0, vitest_1.expect)(runRes.ok).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.waitForSystemEvent)()];
                case 11:
                    events = _w.sent();
                    (0, vitest_1.expect)(events.some(function (event) { return event.includes("cron route check"); })).toBe(true);
                    wrappedAtMs = Date.now() + 1000;
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            data: {
                                name: "wrapped",
                                schedule: { atMs: wrappedAtMs },
                                payload: { kind: "systemEvent", text: "hello" },
                            },
                        })];
                case 12:
                    wrappedRes = _w.sent();
                    (0, vitest_1.expect)(wrappedRes.ok).toBe(true);
                    wrappedPayload = wrappedRes.payload;
                    (0, vitest_1.expect)(wrappedPayload === null || wrappedPayload === void 0 ? void 0 : wrappedPayload.sessionTarget).toBe("main");
                    (0, vitest_1.expect)(wrappedPayload === null || wrappedPayload === void 0 ? void 0 : wrappedPayload.wakeMode).toBe("next-heartbeat");
                    (0, vitest_1.expect)((_g = wrappedPayload === null || wrappedPayload === void 0 ? void 0 : wrappedPayload.schedule) === null || _g === void 0 ? void 0 : _g.kind).toBe("at");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            name: "patch test",
                            enabled: true,
                            schedule: { kind: "every", everyMs: 60000 },
                            sessionTarget: "main",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "systemEvent", text: "hello" },
                        })];
                case 13:
                    patchRes = _w.sent();
                    (0, vitest_1.expect)(patchRes.ok).toBe(true);
                    patchJobIdValue = (_h = patchRes.payload) === null || _h === void 0 ? void 0 : _h.id;
                    patchJobId = typeof patchJobIdValue === "string" ? patchJobIdValue : "";
                    (0, vitest_1.expect)(patchJobId.length > 0).toBe(true);
                    atMs = Date.now() + 1000;
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.update", {
                            id: patchJobId,
                            patch: {
                                schedule: { atMs: atMs },
                                payload: { kind: "systemEvent", text: "updated" },
                            },
                        })];
                case 14:
                    updateRes = _w.sent();
                    (0, vitest_1.expect)(updateRes.ok).toBe(true);
                    updated = updateRes.payload;
                    (0, vitest_1.expect)((_j = updated === null || updated === void 0 ? void 0 : updated.schedule) === null || _j === void 0 ? void 0 : _j.kind).toBe("at");
                    (0, vitest_1.expect)((_k = updated === null || updated === void 0 ? void 0 : updated.payload) === null || _k === void 0 ? void 0 : _k.kind).toBe("systemEvent");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            name: "patch merge",
                            enabled: true,
                            schedule: { kind: "every", everyMs: 60000 },
                            sessionTarget: "isolated",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "agentTurn", message: "hello", model: "opus" },
                        })];
                case 15:
                    mergeRes = _w.sent();
                    (0, vitest_1.expect)(mergeRes.ok).toBe(true);
                    mergeJobIdValue = (_l = mergeRes.payload) === null || _l === void 0 ? void 0 : _l.id;
                    mergeJobId = typeof mergeJobIdValue === "string" ? mergeJobIdValue : "";
                    (0, vitest_1.expect)(mergeJobId.length > 0).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.update", {
                            id: mergeJobId,
                            patch: {
                                payload: { kind: "agentTurn", deliver: true, channel: "telegram", to: "19098680" },
                            },
                        })];
                case 16:
                    mergeUpdateRes = _w.sent();
                    (0, vitest_1.expect)(mergeUpdateRes.ok).toBe(true);
                    merged = mergeUpdateRes.payload;
                    (0, vitest_1.expect)((_m = merged === null || merged === void 0 ? void 0 : merged.payload) === null || _m === void 0 ? void 0 : _m.kind).toBe("agentTurn");
                    (0, vitest_1.expect)((_o = merged === null || merged === void 0 ? void 0 : merged.payload) === null || _o === void 0 ? void 0 : _o.message).toBe("hello");
                    (0, vitest_1.expect)((_p = merged === null || merged === void 0 ? void 0 : merged.payload) === null || _p === void 0 ? void 0 : _p.model).toBe("opus");
                    (0, vitest_1.expect)((_q = merged === null || merged === void 0 ? void 0 : merged.payload) === null || _q === void 0 ? void 0 : _q.deliver).toBe(true);
                    (0, vitest_1.expect)((_r = merged === null || merged === void 0 ? void 0 : merged.payload) === null || _r === void 0 ? void 0 : _r.channel).toBe("telegram");
                    (0, vitest_1.expect)((_s = merged === null || merged === void 0 ? void 0 : merged.payload) === null || _s === void 0 ? void 0 : _s.to).toBe("19098680");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            name: "patch reject",
                            enabled: true,
                            schedule: { kind: "every", everyMs: 60000 },
                            sessionTarget: "main",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "systemEvent", text: "hello" },
                        })];
                case 17:
                    rejectRes = _w.sent();
                    (0, vitest_1.expect)(rejectRes.ok).toBe(true);
                    rejectJobIdValue = (_t = rejectRes.payload) === null || _t === void 0 ? void 0 : _t.id;
                    rejectJobId = typeof rejectJobIdValue === "string" ? rejectJobIdValue : "";
                    (0, vitest_1.expect)(rejectJobId.length > 0).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.update", {
                            id: rejectJobId,
                            patch: {
                                payload: { kind: "agentTurn", deliver: true },
                            },
                        })];
                case 18:
                    rejectUpdateRes = _w.sent();
                    (0, vitest_1.expect)(rejectUpdateRes.ok).toBe(false);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            name: "jobId test",
                            enabled: true,
                            schedule: { kind: "every", everyMs: 60000 },
                            sessionTarget: "main",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "systemEvent", text: "hello" },
                        })];
                case 19:
                    jobIdRes = _w.sent();
                    (0, vitest_1.expect)(jobIdRes.ok).toBe(true);
                    jobIdValue = (_u = jobIdRes.payload) === null || _u === void 0 ? void 0 : _u.id;
                    jobId = typeof jobIdValue === "string" ? jobIdValue : "";
                    (0, vitest_1.expect)(jobId.length > 0).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.update", {
                            jobId: jobId,
                            patch: {
                                schedule: { atMs: Date.now() + 2000 },
                                payload: { kind: "systemEvent", text: "updated" },
                            },
                        })];
                case 20:
                    jobIdUpdateRes = _w.sent();
                    (0, vitest_1.expect)(jobIdUpdateRes.ok).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            name: "disable test",
                            enabled: true,
                            schedule: { kind: "every", everyMs: 60000 },
                            sessionTarget: "main",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "systemEvent", text: "hello" },
                        })];
                case 21:
                    disableRes = _w.sent();
                    (0, vitest_1.expect)(disableRes.ok).toBe(true);
                    disableJobIdValue = (_v = disableRes.payload) === null || _v === void 0 ? void 0 : _v.id;
                    disableJobId = typeof disableJobIdValue === "string" ? disableJobIdValue : "";
                    (0, vitest_1.expect)(disableJobId.length > 0).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.update", {
                            id: disableJobId,
                            patch: { enabled: false },
                        })];
                case 22:
                    disableUpdateRes = _w.sent();
                    (0, vitest_1.expect)(disableUpdateRes.ok).toBe(true);
                    disabled = disableUpdateRes.payload;
                    (0, vitest_1.expect)(disabled === null || disabled === void 0 ? void 0 : disabled.enabled).toBe(false);
                    return [3 /*break*/, 26];
                case 23:
                    ws.close();
                    return [4 /*yield*/, server.close()];
                case 24:
                    _w.sent();
                    return [4 /*yield*/, rmTempDir(dir)];
                case 25:
                    _w.sent();
                    test_helpers_js_1.testState.cronStorePath = undefined;
                    test_helpers_js_1.testState.sessionConfig = undefined;
                    test_helpers_js_1.testState.cronEnabled = undefined;
                    if (prevSkipCron === undefined) {
                        delete process.env.OPENCLAW_SKIP_CRON;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_CRON = prevSkipCron;
                    }
                    return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("writes cron run history and auto-runs due jobs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevSkipCron, dir, _a, server, ws, atMs, addRes, jobIdValue, jobId, runRes, logPath, raw, line, last, runsRes, entries, statusRes, statusPayload, storePath, autoRes, autoJobIdValue, autoJobId, autoEntries, runs;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    prevSkipCron = process.env.OPENCLAW_SKIP_CRON;
                    process.env.OPENCLAW_SKIP_CRON = "0";
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-cron-log-"))];
                case 1:
                    dir = _j.sent();
                    test_helpers_js_1.testState.cronStorePath = node_path_1.default.join(dir, "cron", "jobs.json");
                    test_helpers_js_1.testState.cronEnabled = undefined;
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(test_helpers_js_1.testState.cronStorePath), { recursive: true })];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(test_helpers_js_1.testState.cronStorePath, JSON.stringify({ version: 1, jobs: [] }))];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)()];
                case 4:
                    _a = _j.sent(), server = _a.server, ws = _a.ws;
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
                case 5:
                    _j.sent();
                    _j.label = 6;
                case 6:
                    _j.trys.push([6, , 15, 18]);
                    atMs = Date.now() - 1;
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            name: "log test",
                            enabled: true,
                            schedule: { kind: "at", atMs: atMs },
                            sessionTarget: "main",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "systemEvent", text: "hello" },
                        })];
                case 7:
                    addRes = _j.sent();
                    (0, vitest_1.expect)(addRes.ok).toBe(true);
                    jobIdValue = (_b = addRes.payload) === null || _b === void 0 ? void 0 : _b.id;
                    jobId = typeof jobIdValue === "string" ? jobIdValue : "";
                    (0, vitest_1.expect)(jobId.length > 0).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.run", { id: jobId, mode: "force" }, 20000)];
                case 8:
                    runRes = _j.sent();
                    (0, vitest_1.expect)(runRes.ok).toBe(true);
                    logPath = node_path_1.default.join(dir, "cron", "runs", "".concat(jobId, ".jsonl"));
                    return [4 /*yield*/, waitForNonEmptyFile(logPath, 5000)];
                case 9:
                    raw = _j.sent();
                    line = raw
                        .split("\n")
                        .map(function (l) { return l.trim(); })
                        .filter(Boolean)
                        .at(-1);
                    last = JSON.parse(line !== null && line !== void 0 ? line : "{}");
                    (0, vitest_1.expect)(last.action).toBe("finished");
                    (0, vitest_1.expect)(last.jobId).toBe(jobId);
                    (0, vitest_1.expect)(last.status).toBe("ok");
                    (0, vitest_1.expect)(last.summary).toBe("hello");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.runs", { id: jobId, limit: 50 })];
                case 10:
                    runsRes = _j.sent();
                    (0, vitest_1.expect)(runsRes.ok).toBe(true);
                    entries = (_c = runsRes.payload) === null || _c === void 0 ? void 0 : _c.entries;
                    (0, vitest_1.expect)(Array.isArray(entries)).toBe(true);
                    (0, vitest_1.expect)((_d = entries.at(-1)) === null || _d === void 0 ? void 0 : _d.jobId).toBe(jobId);
                    (0, vitest_1.expect)((_e = entries.at(-1)) === null || _e === void 0 ? void 0 : _e.summary).toBe("hello");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.status", {})];
                case 11:
                    statusRes = _j.sent();
                    (0, vitest_1.expect)(statusRes.ok).toBe(true);
                    statusPayload = statusRes.payload;
                    (0, vitest_1.expect)(statusPayload === null || statusPayload === void 0 ? void 0 : statusPayload.enabled).toBe(true);
                    storePath = typeof (statusPayload === null || statusPayload === void 0 ? void 0 : statusPayload.storePath) === "string" ? statusPayload.storePath : "";
                    (0, vitest_1.expect)(storePath).toContain("jobs.json");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.add", {
                            name: "auto run test",
                            enabled: true,
                            schedule: { kind: "at", atMs: Date.now() - 10 },
                            sessionTarget: "main",
                            wakeMode: "next-heartbeat",
                            payload: { kind: "systemEvent", text: "auto" },
                        })];
                case 12:
                    autoRes = _j.sent();
                    (0, vitest_1.expect)(autoRes.ok).toBe(true);
                    autoJobIdValue = (_f = autoRes.payload) === null || _f === void 0 ? void 0 : _f.id;
                    autoJobId = typeof autoJobIdValue === "string" ? autoJobIdValue : "";
                    (0, vitest_1.expect)(autoJobId.length > 0).toBe(true);
                    return [4 /*yield*/, waitForNonEmptyFile(node_path_1.default.join(dir, "cron", "runs", "".concat(autoJobId, ".jsonl")), 5000)];
                case 13:
                    _j.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "cron.runs", { id: autoJobId, limit: 10 })];
                case 14:
                    autoEntries = (_j.sent()).payload;
                    (0, vitest_1.expect)(Array.isArray(autoEntries === null || autoEntries === void 0 ? void 0 : autoEntries.entries)).toBe(true);
                    runs = (_g = autoEntries === null || autoEntries === void 0 ? void 0 : autoEntries.entries) !== null && _g !== void 0 ? _g : [];
                    (0, vitest_1.expect)((_h = runs.at(-1)) === null || _h === void 0 ? void 0 : _h.jobId).toBe(autoJobId);
                    return [3 /*break*/, 18];
                case 15:
                    ws.close();
                    return [4 /*yield*/, server.close()];
                case 16:
                    _j.sent();
                    return [4 /*yield*/, rmTempDir(dir)];
                case 17:
                    _j.sent();
                    test_helpers_js_1.testState.cronStorePath = undefined;
                    test_helpers_js_1.testState.cronEnabled = undefined;
                    if (prevSkipCron === undefined) {
                        delete process.env.OPENCLAW_SKIP_CRON;
                    }
                    else {
                        process.env.OPENCLAW_SKIP_CRON = prevSkipCron;
                    }
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    }); }, 45000);
});
