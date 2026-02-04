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
var agent_events_js_1 = require("../infra/agent-events.js");
var server_constants_js_1 = require("./server-constants.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
function waitFor(condition_1) {
    return __awaiter(this, arguments, void 0, function (condition, timeoutMs) {
        var deadline;
        if (timeoutMs === void 0) { timeoutMs = 1500; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deadline = Date.now() + timeoutMs;
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < deadline)) return [3 /*break*/, 3];
                    if (condition()) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 5); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: throw new Error("timeout waiting for condition");
            }
        });
    });
}
var sendReq = function (ws, id, method, params) {
    ws.send(JSON.stringify({
        type: "req",
        id: id,
        method: method,
        params: params,
    }));
};
(0, vitest_1.describe)("gateway server chat", function () {
    var timeoutMs = 120000;
    (0, vitest_1.test)("handles history, abort, idempotency, and ordering flows", { timeout: timeoutMs }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDirs, _a, server, ws, spy, resetSpy, historyMaxBytes, sessionDir, writeStore, bigText, largeLines, i, cappedRes, cappedMsgs, bytes, routeRes, stored, _b, _c, abortInFlight, callsBefore_1, sendResP_1, abortResP, abortedEventP_1, sendRes_1, abortRes_1, evt, abortedEventP_2, sendResP_2, abortResP, abortRes_2, sendRes_2, evt, callsBeforeStop_1, stopSendResP, stopSendRes, abortedStopEventP, stopResP, stopRes, stopEvt, resolveRun_1, runDone_1, started, inFlightRes, completed, i, again, abortedEventP, startedAbortAll, abortRes, noDeltaP, abortUnknown, agentStartedResolve_1, agentStartedP, sendResP, abortMismatch, abortMismatch2, sendRes, sendCompleteRes, completedRun, i, again, abortCompleteRes, res1, res2, final1P, final1, run1, final2P, final2, run2;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    tempDirs = [];
                    return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)()];
                case 1:
                    _a = _y.sent(), server = _a.server, ws = _a.ws;
                    spy = vitest_1.vi.mocked(test_helpers_js_1.getReplyFromConfig);
                    resetSpy = function () {
                        spy.mockReset();
                        spy.mockResolvedValue(undefined);
                    };
                    _y.label = 2;
                case 2:
                    _y.trys.push([2, , 63, 66]);
                    historyMaxBytes = 192 * 1024;
                    (0, server_constants_js_1.__setMaxChatHistoryMessagesBytesForTest)(historyMaxBytes);
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
                case 3:
                    _y.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gw-"))];
                case 4:
                    sessionDir = _y.sent();
                    tempDirs.push(sessionDir);
                    test_helpers_js_1.testState.sessionStorePath = node_path_1.default.join(sessionDir, "sessions.json");
                    writeStore = function (entries) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({ entries: entries })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, writeStore({ main: { sessionId: "sess-main", updatedAt: Date.now() } })];
                case 5:
                    _y.sent();
                    bigText = "x".repeat(4000);
                    largeLines = [];
                    for (i = 0; i < 60; i += 1) {
                        largeLines.push(JSON.stringify({
                            message: {
                                role: "user",
                                content: [{ type: "text", text: "".concat(i, ":").concat(bigText) }],
                                timestamp: Date.now() + i,
                            },
                        }));
                    }
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(sessionDir, "sess-main.jsonl"), largeLines.join("\n"), "utf-8")];
                case 6:
                    _y.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.history", {
                            sessionKey: "main",
                            limit: 1000,
                        })];
                case 7:
                    cappedRes = _y.sent();
                    (0, vitest_1.expect)(cappedRes.ok).toBe(true);
                    cappedMsgs = (_e = (_d = cappedRes.payload) === null || _d === void 0 ? void 0 : _d.messages) !== null && _e !== void 0 ? _e : [];
                    bytes = Buffer.byteLength(JSON.stringify(cappedMsgs), "utf8");
                    (0, vitest_1.expect)(bytes).toBeLessThanOrEqual(historyMaxBytes);
                    (0, vitest_1.expect)(cappedMsgs.length).toBeLessThan(60);
                    return [4 /*yield*/, writeStore({
                            main: {
                                sessionId: "sess-main",
                                updatedAt: Date.now(),
                                lastChannel: "whatsapp",
                                lastTo: "+1555",
                            },
                        })];
                case 8:
                    _y.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "hello",
                            idempotencyKey: "idem-route",
                        })];
                case 9:
                    routeRes = _y.sent();
                    (0, vitest_1.expect)(routeRes.ok).toBe(true);
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(test_helpers_js_1.testState.sessionStorePath, "utf-8")];
                case 10:
                    stored = _c.apply(_b, [_y.sent()]);
                    (0, vitest_1.expect)((_f = stored["agent:main:main"]) === null || _f === void 0 ? void 0 : _f.lastChannel).toBe("whatsapp");
                    (0, vitest_1.expect)((_g = stored["agent:main:main"]) === null || _g === void 0 ? void 0 : _g.lastTo).toBe("+1555");
                    return [4 /*yield*/, writeStore({ main: { sessionId: "sess-main", updatedAt: Date.now() } })];
                case 11:
                    _y.sent();
                    resetSpy();
                    abortInFlight = void 0;
                    _y.label = 12;
                case 12:
                    _y.trys.push([12, , 17, 19]);
                    callsBefore_1 = spy.mock.calls.length;
                    spy.mockImplementationOnce(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var signal;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    (_a = opts === null || opts === void 0 ? void 0 : opts.onAgentRunStart) === null || _a === void 0 ? void 0 : _a.call(opts, (_b = opts.runId) !== null && _b !== void 0 ? _b : "idem-abort-1");
                                    signal = opts === null || opts === void 0 ? void 0 : opts.abortSignal;
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            if (!signal) {
                                                return resolve();
                                            }
                                            if (signal.aborted) {
                                                return resolve();
                                            }
                                            signal.addEventListener("abort", function () { return resolve(); }, { once: true });
                                        })];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    sendResP_1 = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "send-abort-1"; }, 8000);
                    abortResP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "abort-1"; }, 8000);
                    abortedEventP_1 = (0, test_helpers_js_1.onceMessage)(ws, function (o) { var _a; return o.type === "event" && o.event === "chat" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.state) === "aborted"; }, 8000);
                    abortInFlight = Promise.allSettled([sendResP_1, abortResP, abortedEventP_1]);
                    sendReq(ws, "send-abort-1", "chat.send", {
                        sessionKey: "main",
                        message: "hello",
                        idempotencyKey: "idem-abort-1",
                        timeoutMs: 30000,
                    });
                    return [4 /*yield*/, sendResP_1];
                case 13:
                    sendRes_1 = _y.sent();
                    (0, vitest_1.expect)(sendRes_1.ok).toBe(true);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var deadline = Date.now() + 1000;
                            var tick = function () {
                                if (spy.mock.calls.length > callsBefore_1) {
                                    return resolve();
                                }
                                if (Date.now() > deadline) {
                                    return reject(new Error("timeout waiting for getReplyFromConfig"));
                                }
                                setTimeout(tick, 5);
                            };
                            tick();
                        })];
                case 14:
                    _y.sent();
                    sendReq(ws, "abort-1", "chat.abort", {
                        sessionKey: "main",
                        runId: "idem-abort-1",
                    });
                    return [4 /*yield*/, abortResP];
                case 15:
                    abortRes_1 = _y.sent();
                    (0, vitest_1.expect)(abortRes_1.ok).toBe(true);
                    return [4 /*yield*/, abortedEventP_1];
                case 16:
                    evt = _y.sent();
                    (0, vitest_1.expect)((_h = evt.payload) === null || _h === void 0 ? void 0 : _h.runId).toBe("idem-abort-1");
                    (0, vitest_1.expect)((_j = evt.payload) === null || _j === void 0 ? void 0 : _j.sessionKey).toBe("main");
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, abortInFlight];
                case 18:
                    _y.sent();
                    return [7 /*endfinally*/];
                case 19: return [4 /*yield*/, writeStore({ main: { sessionId: "sess-main", updatedAt: Date.now() } })];
                case 20:
                    _y.sent();
                    test_helpers_js_1.sessionStoreSaveDelayMs.value = 120;
                    resetSpy();
                    _y.label = 21;
                case 21:
                    _y.trys.push([21, , 25, 26]);
                    spy.mockImplementationOnce(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var signal;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    (_a = opts === null || opts === void 0 ? void 0 : opts.onAgentRunStart) === null || _a === void 0 ? void 0 : _a.call(opts, (_b = opts.runId) !== null && _b !== void 0 ? _b : "idem-abort-save-1");
                                    signal = opts === null || opts === void 0 ? void 0 : opts.abortSignal;
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            if (!signal) {
                                                return resolve();
                                            }
                                            if (signal.aborted) {
                                                return resolve();
                                            }
                                            signal.addEventListener("abort", function () { return resolve(); }, { once: true });
                                        })];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    abortedEventP_2 = (0, test_helpers_js_1.onceMessage)(ws, function (o) { var _a; return o.type === "event" && o.event === "chat" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.state) === "aborted"; });
                    sendResP_2 = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "send-abort-save-1"; });
                    sendReq(ws, "send-abort-save-1", "chat.send", {
                        sessionKey: "main",
                        message: "hello",
                        idempotencyKey: "idem-abort-save-1",
                        timeoutMs: 30000,
                    });
                    abortResP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "abort-save-1"; });
                    sendReq(ws, "abort-save-1", "chat.abort", {
                        sessionKey: "main",
                        runId: "idem-abort-save-1",
                    });
                    return [4 /*yield*/, abortResP];
                case 22:
                    abortRes_2 = _y.sent();
                    (0, vitest_1.expect)(abortRes_2.ok).toBe(true);
                    return [4 /*yield*/, sendResP_2];
                case 23:
                    sendRes_2 = _y.sent();
                    (0, vitest_1.expect)(sendRes_2.ok).toBe(true);
                    return [4 /*yield*/, abortedEventP_2];
                case 24:
                    evt = _y.sent();
                    (0, vitest_1.expect)((_k = evt.payload) === null || _k === void 0 ? void 0 : _k.runId).toBe("idem-abort-save-1");
                    (0, vitest_1.expect)((_l = evt.payload) === null || _l === void 0 ? void 0 : _l.sessionKey).toBe("main");
                    return [3 /*break*/, 26];
                case 25:
                    test_helpers_js_1.sessionStoreSaveDelayMs.value = 0;
                    return [7 /*endfinally*/];
                case 26: return [4 /*yield*/, writeStore({ main: { sessionId: "sess-main", updatedAt: Date.now() } })];
                case 27:
                    _y.sent();
                    resetSpy();
                    callsBeforeStop_1 = spy.mock.calls.length;
                    spy.mockImplementationOnce(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var signal;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    (_a = opts === null || opts === void 0 ? void 0 : opts.onAgentRunStart) === null || _a === void 0 ? void 0 : _a.call(opts, (_b = opts.runId) !== null && _b !== void 0 ? _b : "idem-stop-1");
                                    signal = opts === null || opts === void 0 ? void 0 : opts.abortSignal;
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            if (!signal) {
                                                return resolve();
                                            }
                                            if (signal.aborted) {
                                                return resolve();
                                            }
                                            signal.addEventListener("abort", function () { return resolve(); }, { once: true });
                                        })];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    stopSendResP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "send-stop-1"; }, 8000);
                    sendReq(ws, "send-stop-1", "chat.send", {
                        sessionKey: "main",
                        message: "hello",
                        idempotencyKey: "idem-stop-run",
                    });
                    return [4 /*yield*/, stopSendResP];
                case 28:
                    stopSendRes = _y.sent();
                    (0, vitest_1.expect)(stopSendRes.ok).toBe(true);
                    return [4 /*yield*/, waitFor(function () { return spy.mock.calls.length > callsBeforeStop_1; })];
                case 29:
                    _y.sent();
                    abortedStopEventP = (0, test_helpers_js_1.onceMessage)(ws, function (o) {
                        var _a, _b;
                        return o.type === "event" &&
                            o.event === "chat" &&
                            ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.state) === "aborted" &&
                            ((_b = o.payload) === null || _b === void 0 ? void 0 : _b.runId) === "idem-stop-run";
                    }, 8000);
                    stopResP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "send-stop-2"; }, 8000);
                    sendReq(ws, "send-stop-2", "chat.send", {
                        sessionKey: "main",
                        message: "/stop",
                        idempotencyKey: "idem-stop-req",
                    });
                    return [4 /*yield*/, stopResP];
                case 30:
                    stopRes = _y.sent();
                    (0, vitest_1.expect)(stopRes.ok).toBe(true);
                    return [4 /*yield*/, abortedStopEventP];
                case 31:
                    stopEvt = _y.sent();
                    (0, vitest_1.expect)((_m = stopEvt.payload) === null || _m === void 0 ? void 0 : _m.sessionKey).toBe("main");
                    (0, vitest_1.expect)(spy.mock.calls.length).toBe(callsBeforeStop_1 + 1);
                    resetSpy();
                    runDone_1 = new Promise(function (resolve) {
                        resolveRun_1 = resolve;
                    });
                    spy.mockImplementationOnce(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    (_a = opts === null || opts === void 0 ? void 0 : opts.onAgentRunStart) === null || _a === void 0 ? void 0 : _a.call(opts, (_b = opts.runId) !== null && _b !== void 0 ? _b : "idem-status-1");
                                    return [4 /*yield*/, runDone_1];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "hello",
                            idempotencyKey: "idem-status-1",
                        })];
                case 32:
                    started = _y.sent();
                    (0, vitest_1.expect)(started.ok).toBe(true);
                    (0, vitest_1.expect)((_o = started.payload) === null || _o === void 0 ? void 0 : _o.status).toBe("started");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "hello",
                            idempotencyKey: "idem-status-1",
                        })];
                case 33:
                    inFlightRes = _y.sent();
                    (0, vitest_1.expect)(inFlightRes.ok).toBe(true);
                    (0, vitest_1.expect)((_p = inFlightRes.payload) === null || _p === void 0 ? void 0 : _p.status).toBe("in_flight");
                    resolveRun_1 === null || resolveRun_1 === void 0 ? void 0 : resolveRun_1();
                    completed = false;
                    i = 0;
                    _y.label = 34;
                case 34:
                    if (!(i < 20)) return [3 /*break*/, 38];
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "hello",
                            idempotencyKey: "idem-status-1",
                        })];
                case 35:
                    again = _y.sent();
                    if (again.ok && ((_q = again.payload) === null || _q === void 0 ? void 0 : _q.status) === "ok") {
                        completed = true;
                        return [3 /*break*/, 38];
                    }
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 10); })];
                case 36:
                    _y.sent();
                    _y.label = 37;
                case 37:
                    i++;
                    return [3 /*break*/, 34];
                case 38:
                    (0, vitest_1.expect)(completed).toBe(true);
                    resetSpy();
                    spy.mockImplementationOnce(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var signal;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    (_a = opts === null || opts === void 0 ? void 0 : opts.onAgentRunStart) === null || _a === void 0 ? void 0 : _a.call(opts, (_b = opts.runId) !== null && _b !== void 0 ? _b : "idem-abort-all-1");
                                    signal = opts === null || opts === void 0 ? void 0 : opts.abortSignal;
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            if (!signal) {
                                                return resolve();
                                            }
                                            if (signal.aborted) {
                                                return resolve();
                                            }
                                            signal.addEventListener("abort", function () { return resolve(); }, { once: true });
                                        })];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    abortedEventP = (0, test_helpers_js_1.onceMessage)(ws, function (o) {
                        var _a, _b;
                        return o.type === "event" &&
                            o.event === "chat" &&
                            ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.state) === "aborted" &&
                            ((_b = o.payload) === null || _b === void 0 ? void 0 : _b.runId) === "idem-abort-all-1";
                    });
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "hello",
                            idempotencyKey: "idem-abort-all-1",
                        })];
                case 39:
                    startedAbortAll = _y.sent();
                    (0, vitest_1.expect)(startedAbortAll.ok).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.abort", { sessionKey: "main" })];
                case 40:
                    abortRes = _y.sent();
                    (0, vitest_1.expect)(abortRes.ok).toBe(true);
                    (0, vitest_1.expect)((_r = abortRes.payload) === null || _r === void 0 ? void 0 : _r.aborted).toBe(true);
                    (0, vitest_1.expect)((_t = (_s = abortRes.payload) === null || _s === void 0 ? void 0 : _s.runIds) !== null && _t !== void 0 ? _t : []).toContain("idem-abort-all-1");
                    return [4 /*yield*/, abortedEventP];
                case 41:
                    _y.sent();
                    noDeltaP = (0, test_helpers_js_1.onceMessage)(ws, function (o) {
                        var _a, _b, _c;
                        return o.type === "event" &&
                            o.event === "chat" &&
                            (((_a = o.payload) === null || _a === void 0 ? void 0 : _a.state) === "delta" || ((_b = o.payload) === null || _b === void 0 ? void 0 : _b.state) === "final") &&
                            ((_c = o.payload) === null || _c === void 0 ? void 0 : _c.runId) === "idem-abort-all-1";
                    }, 250);
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "idem-abort-all-1",
                        stream: "assistant",
                        data: { text: "should be suppressed" },
                    });
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "idem-abort-all-1",
                        stream: "lifecycle",
                        data: { phase: "end" },
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)(noDeltaP).rejects.toThrow(/timeout/i)];
                case 42:
                    _y.sent();
                    return [4 /*yield*/, writeStore({})];
                case 43:
                    _y.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.abort", { sessionKey: "main", runId: "missing-run" })];
                case 44:
                    abortUnknown = _y.sent();
                    (0, vitest_1.expect)(abortUnknown.ok).toBe(true);
                    (0, vitest_1.expect)((_u = abortUnknown.payload) === null || _u === void 0 ? void 0 : _u.aborted).toBe(false);
                    return [4 /*yield*/, writeStore({ main: { sessionId: "sess-main", updatedAt: Date.now() } })];
                case 45:
                    _y.sent();
                    resetSpy();
                    agentStartedP = new Promise(function (resolve) {
                        agentStartedResolve_1 = resolve;
                    });
                    spy.mockImplementationOnce(function (_ctx, opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var signal;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    agentStartedResolve_1 === null || agentStartedResolve_1 === void 0 ? void 0 : agentStartedResolve_1();
                                    signal = opts === null || opts === void 0 ? void 0 : opts.abortSignal;
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            if (!signal) {
                                                return resolve();
                                            }
                                            if (signal.aborted) {
                                                return resolve();
                                            }
                                            signal.addEventListener("abort", function () { return resolve(); }, { once: true });
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    sendResP = (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "send-mismatch-1"; }, 10000);
                    sendReq(ws, "send-mismatch-1", "chat.send", {
                        sessionKey: "main",
                        message: "hello",
                        idempotencyKey: "idem-mismatch-1",
                        timeoutMs: 30000,
                    });
                    return [4 /*yield*/, agentStartedP];
                case 46:
                    _y.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.abort", {
                            sessionKey: "other",
                            runId: "idem-mismatch-1",
                        })];
                case 47:
                    abortMismatch = _y.sent();
                    (0, vitest_1.expect)(abortMismatch.ok).toBe(false);
                    (0, vitest_1.expect)((_v = abortMismatch.error) === null || _v === void 0 ? void 0 : _v.code).toBe("INVALID_REQUEST");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.abort", {
                            sessionKey: "main",
                            runId: "idem-mismatch-1",
                        })];
                case 48:
                    abortMismatch2 = _y.sent();
                    (0, vitest_1.expect)(abortMismatch2.ok).toBe(true);
                    return [4 /*yield*/, sendResP];
                case 49:
                    sendRes = _y.sent();
                    (0, vitest_1.expect)(sendRes.ok).toBe(true);
                    return [4 /*yield*/, writeStore({ main: { sessionId: "sess-main", updatedAt: Date.now() } })];
                case 50:
                    _y.sent();
                    resetSpy();
                    spy.mockResolvedValueOnce(undefined);
                    sendReq(ws, "send-complete-1", "chat.send", {
                        sessionKey: "main",
                        message: "hello",
                        idempotencyKey: "idem-complete-1",
                        timeoutMs: 30000,
                    });
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === "send-complete-1"; })];
                case 51:
                    sendCompleteRes = _y.sent();
                    (0, vitest_1.expect)(sendCompleteRes.ok).toBe(true);
                    completedRun = false;
                    i = 0;
                    _y.label = 52;
                case 52:
                    if (!(i < 20)) return [3 /*break*/, 56];
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "hello",
                            idempotencyKey: "idem-complete-1",
                            timeoutMs: 30000,
                        })];
                case 53:
                    again = _y.sent();
                    if (again.ok && ((_w = again.payload) === null || _w === void 0 ? void 0 : _w.status) === "ok") {
                        completedRun = true;
                        return [3 /*break*/, 56];
                    }
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 10); })];
                case 54:
                    _y.sent();
                    _y.label = 55;
                case 55:
                    i++;
                    return [3 /*break*/, 52];
                case 56:
                    (0, vitest_1.expect)(completedRun).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.abort", {
                            sessionKey: "main",
                            runId: "idem-complete-1",
                        })];
                case 57:
                    abortCompleteRes = _y.sent();
                    (0, vitest_1.expect)(abortCompleteRes.ok).toBe(true);
                    (0, vitest_1.expect)((_x = abortCompleteRes.payload) === null || _x === void 0 ? void 0 : _x.aborted).toBe(false);
                    return [4 /*yield*/, writeStore({ main: { sessionId: "sess-main", updatedAt: Date.now() } })];
                case 58:
                    _y.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "first",
                            idempotencyKey: "idem-1",
                        })];
                case 59:
                    res1 = _y.sent();
                    (0, vitest_1.expect)(res1.ok).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "chat.send", {
                            sessionKey: "main",
                            message: "second",
                            idempotencyKey: "idem-2",
                        })];
                case 60:
                    res2 = _y.sent();
                    (0, vitest_1.expect)(res2.ok).toBe(true);
                    final1P = (0, test_helpers_js_1.onceMessage)(ws, function (o) { var _a; return o.type === "event" && o.event === "chat" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.state) === "final"; }, 8000);
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "idem-1",
                        stream: "lifecycle",
                        data: { phase: "end" },
                    });
                    return [4 /*yield*/, final1P];
                case 61:
                    final1 = _y.sent();
                    run1 = final1.payload && typeof final1.payload === "object"
                        ? final1.payload.runId
                        : undefined;
                    (0, vitest_1.expect)(run1).toBe("idem-1");
                    final2P = (0, test_helpers_js_1.onceMessage)(ws, function (o) { var _a; return o.type === "event" && o.event === "chat" && ((_a = o.payload) === null || _a === void 0 ? void 0 : _a.state) === "final"; }, 8000);
                    (0, agent_events_js_1.emitAgentEvent)({
                        runId: "idem-2",
                        stream: "lifecycle",
                        data: { phase: "end" },
                    });
                    return [4 /*yield*/, final2P];
                case 62:
                    final2 = _y.sent();
                    run2 = final2.payload && typeof final2.payload === "object"
                        ? final2.payload.runId
                        : undefined;
                    (0, vitest_1.expect)(run2).toBe("idem-2");
                    return [3 /*break*/, 66];
                case 63:
                    (0, server_constants_js_1.__setMaxChatHistoryMessagesBytesForTest)();
                    test_helpers_js_1.testState.sessionStorePath = undefined;
                    test_helpers_js_1.sessionStoreSaveDelayMs.value = 0;
                    ws.close();
                    return [4 /*yield*/, server.close()];
                case 64:
                    _y.sent();
                    return [4 /*yield*/, Promise.all(tempDirs.map(function (dir) { return promises_1.default.rm(dir, { recursive: true, force: true }); }))];
                case 65:
                    _y.sent();
                    return [7 /*endfinally*/];
                case 66: return [2 /*return*/];
            }
        });
    }); });
});
