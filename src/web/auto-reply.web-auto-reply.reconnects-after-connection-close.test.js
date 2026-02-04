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
require("./test-helpers.js");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var envelope_timestamp_js_1 = require("../../test/helpers/envelope-timestamp.js");
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(false),
    isEmbeddedPiRunActive: vitest_1.vi.fn().mockReturnValue(false),
    isEmbeddedPiRunStreaming: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: vitest_1.vi.fn(),
    queueEmbeddedPiMessage: vitest_1.vi.fn().mockReturnValue(false),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
}); });
var inbound_dedupe_js_1 = require("../auto-reply/reply/inbound-dedupe.js");
var logging_js_1 = require("../logging.js");
var auto_reply_js_1 = require("./auto-reply.js");
var test_helpers_js_1 = require("./test-helpers.js");
var previousHome;
var tempHome;
var rmDirWithRetries = function (dir) { return __awaiter(void 0, void 0, void 0, function () {
    var attempt, err_1, code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                attempt = 0;
                _a.label = 1;
            case 1:
                if (!(attempt < 10)) return [3 /*break*/, 8];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 7]);
                return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
            case 3:
                _a.sent();
                return [2 /*return*/];
            case 4:
                err_1 = _a.sent();
                code = err_1 && typeof err_1 === "object" && "code" in err_1
                    ? String(err_1.code)
                    : null;
                if (!(code === "ENOTEMPTY" || code === "EBUSY" || code === "EPERM")) return [3 /*break*/, 6];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 25); })];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6: throw err_1;
            case 7:
                attempt += 1;
                return [3 /*break*/, 1];
            case 8: return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, inbound_dedupe_js_1.resetInboundDedupe)();
                previousHome = process.env.HOME;
                return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-web-home-"))];
            case 1:
                tempHome = _a.sent();
                process.env.HOME = tempHome;
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process.env.HOME = previousHome;
                if (!tempHome) return [3 /*break*/, 2];
                return [4 /*yield*/, rmDirWithRetries(tempHome)];
            case 1:
                _a.sent();
                tempHome = undefined;
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
var makeSessionStore = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (entries) {
        var dir, storePath, cleanup;
        if (entries === void 0) { entries = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-session-"))];
                case 1:
                    dir = _a.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify(entries))];
                case 2:
                    _a.sent();
                    cleanup = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var attempt, err_2, code;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    attempt = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(attempt < 10)) return [3 /*break*/, 8];
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 7]);
                                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                                case 4:
                                    err_2 = _a.sent();
                                    code = err_2 && typeof err_2 === "object" && "code" in err_2
                                        ? String(err_2.code)
                                        : null;
                                    if (!(code === "ENOTEMPTY" || code === "EBUSY" || code === "EPERM")) return [3 /*break*/, 6];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 25); })];
                                case 5:
                                    _a.sent();
                                    return [3 /*break*/, 7];
                                case 6: throw err_2;
                                case 7:
                                    attempt += 1;
                                    return [3 /*break*/, 1];
                                case 8: return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                                case 9:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/, {
                            storePath: storePath,
                            cleanup: cleanup,
                        }];
            }
        });
    });
};
(0, vitest_1.describe)("web auto-reply", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        (0, test_helpers_js_1.resetBaileysMocks)();
        (0, test_helpers_js_1.resetLoadConfigMock)();
    });
    (0, vitest_1.afterEach)(function () {
        (0, logging_js_1.resetLogger)();
        (0, logging_js_1.setLoggerOverride)(null);
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("reconnects after a connection close", function () { return __awaiter(void 0, void 0, void 0, function () {
        var closeResolvers, sleep, listenerFactory, runtime, controller, run, waitForSecondCall;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    closeResolvers = [];
                    sleep = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    listenerFactory = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _resolve, onClose;
                        return __generator(this, function (_a) {
                            onClose = new Promise(function (res) {
                                _resolve = res;
                                closeResolvers.push(res);
                            });
                            return [2 /*return*/, { close: vitest_1.vi.fn(), onClose: onClose }];
                        });
                    }); });
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    controller = new AbortController();
                    run = (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, true, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "ok" })];
                    }); }); }, runtime, controller.signal, {
                        heartbeatSeconds: 1,
                        reconnect: { initialMs: 10, maxMs: 10, maxAttempts: 3, factor: 1.1 },
                        sleep: sleep,
                    });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(listenerFactory).toHaveBeenCalledTimes(1);
                    (_a = closeResolvers[0]) === null || _a === void 0 ? void 0 : _a.call(closeResolvers);
                    waitForSecondCall = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var started;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    started = Date.now();
                                    _a.label = 1;
                                case 1:
                                    if (!(listenerFactory.mock.calls.length < 2 && Date.now() - started < 200)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, waitForSecondCall()];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(listenerFactory).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(runtime.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Retry 1"));
                    controller.abort();
                    (_b = closeResolvers[1]) === null || _b === void 0 ? void 0 : _b.call(closeResolvers);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5); })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, run];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("forces reconnect when watchdog closes without onClose", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sleep, closeResolvers, capturedOnMessage, listenerFactory, runtime, controller, run, reply, sendComposing, sendMedia;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    sleep = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    closeResolvers = [];
                    listenerFactory = vitest_1.vi.fn(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var resolveClose, onClose;
                        return __generator(this, function (_a) {
                            capturedOnMessage = opts.onMessage;
                            resolveClose = function () { };
                            onClose = new Promise(function (res) {
                                resolveClose = res;
                                closeResolvers.push(res);
                            });
                            return [2 /*return*/, {
                                    close: vitest_1.vi.fn(),
                                    onClose: onClose,
                                    signalClose: function (reason) { return resolveClose(reason); },
                                }];
                        });
                    }); });
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    controller = new AbortController();
                    run = (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, true, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "ok" })];
                    }); }); }, runtime, controller.signal, {
                        heartbeatSeconds: 1,
                        reconnect: { initialMs: 10, maxMs: 10, maxAttempts: 3, factor: 1.1 },
                        sleep: sleep,
                    });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(listenerFactory).toHaveBeenCalledTimes(1);
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    sendMedia = vitest_1.vi.fn();
                    return [4 /*yield*/, (capturedOnMessage === null || capturedOnMessage === void 0 ? void 0 : capturedOnMessage({
                            body: "hi",
                            from: "+1",
                            to: "+2",
                            id: "m1",
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(31 * 60 * 1000)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, Promise.resolve()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(1)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, Promise.resolve()];
                case 6:
                    _b.sent();
                    (0, vitest_1.expect)(listenerFactory).toHaveBeenCalledTimes(2);
                    controller.abort();
                    (_a = closeResolvers[1]) === null || _a === void 0 ? void 0 : _a.call(closeResolvers, { status: 499, isLoggedOut: false });
                    return [4 /*yield*/, Promise.resolve()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, run];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 15000);
    (0, vitest_1.it)("stops after hitting max reconnect attempts", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var closeResolvers, sleep, listenerFactory, runtime, run;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    closeResolvers = [];
                    sleep = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    listenerFactory = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var onClose;
                        return __generator(this, function (_a) {
                            onClose = new Promise(function (res) { return closeResolvers.push(res); });
                            return [2 /*return*/, { close: vitest_1.vi.fn(), onClose: onClose }];
                        });
                    }); });
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    run = (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, true, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ text: "ok" })];
                    }); }); }, runtime, undefined, {
                        heartbeatSeconds: 1,
                        reconnect: { initialMs: 5, maxMs: 5, maxAttempts: 2, factor: 1.1 },
                        sleep: sleep,
                    });
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(listenerFactory).toHaveBeenCalledTimes(1);
                    (_a = closeResolvers.shift()) === null || _a === void 0 ? void 0 : _a();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 15); })];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(listenerFactory).toHaveBeenCalledTimes(2);
                    (_b = closeResolvers.shift()) === null || _b === void 0 ? void 0 : _b();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 15); })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, run];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)(runtime.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("max attempts reached"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("processes inbound messages without batching and preserves timestamps", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalTz, originalMax, store, sendMedia, reply, sendComposing, resolver, capturedOnMessage_1, listenerFactory, firstArgs, secondArgs, firstTimestamp, secondTimestamp, firstPattern, secondPattern;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    originalTz = process.env.TZ;
                    process.env.TZ = "Europe/Vienna";
                    originalMax = process.getMaxListeners();
                    (_a = process.setMaxListeners) === null || _a === void 0 ? void 0 : _a.call(process, 1); // force low to confirm bump
                    return [4 /*yield*/, makeSessionStore({
                            main: { sessionId: "sid", updatedAt: Date.now() },
                        })];
                case 1:
                    store = _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 6, 8]);
                    sendMedia = vitest_1.vi.fn();
                    reply = vitest_1.vi.fn().mockResolvedValue(undefined);
                    sendComposing = vitest_1.vi.fn();
                    resolver = vitest_1.vi.fn().mockResolvedValue({ text: "ok" });
                    listenerFactory = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            capturedOnMessage_1 = opts.onMessage;
                            return [2 /*return*/, { close: vitest_1.vi.fn() }];
                        });
                    }); };
                    (0, test_helpers_js_1.setLoadConfigMock)(function () { return ({
                        agents: {
                            defaults: {
                                envelopeTimezone: "utc",
                            },
                        },
                        session: { store: store.storePath },
                    }); });
                    return [4 /*yield*/, (0, auto_reply_js_1.monitorWebChannel)(false, listenerFactory, false, resolver)];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(capturedOnMessage_1).toBeDefined();
                    // Two messages from the same sender with fixed timestamps
                    return [4 /*yield*/, (capturedOnMessage_1 === null || capturedOnMessage_1 === void 0 ? void 0 : capturedOnMessage_1({
                            body: "first",
                            from: "+1",
                            to: "+2",
                            id: "m1",
                            timestamp: 1735689600000, // Jan 1 2025 00:00:00 UTC
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 4:
                    // Two messages from the same sender with fixed timestamps
                    _d.sent();
                    return [4 /*yield*/, (capturedOnMessage_1 === null || capturedOnMessage_1 === void 0 ? void 0 : capturedOnMessage_1({
                            body: "second",
                            from: "+1",
                            to: "+2",
                            id: "m2",
                            timestamp: 1735693200000, // Jan 1 2025 01:00:00 UTC
                            sendComposing: sendComposing,
                            reply: reply,
                            sendMedia: sendMedia,
                        }))];
                case 5:
                    _d.sent();
                    (0, vitest_1.expect)(resolver).toHaveBeenCalledTimes(2);
                    firstArgs = resolver.mock.calls[0][0];
                    secondArgs = resolver.mock.calls[1][0];
                    firstTimestamp = (0, envelope_timestamp_js_1.formatEnvelopeTimestamp)(new Date("2025-01-01T00:00:00Z"));
                    secondTimestamp = (0, envelope_timestamp_js_1.formatEnvelopeTimestamp)(new Date("2025-01-01T01:00:00Z"));
                    firstPattern = (0, envelope_timestamp_js_1.escapeRegExp)(firstTimestamp);
                    secondPattern = (0, envelope_timestamp_js_1.escapeRegExp)(secondTimestamp);
                    (0, vitest_1.expect)(firstArgs.Body).toMatch(new RegExp("\\[WhatsApp \\+1 (\\+\\d+[smhd] )?".concat(firstPattern, "\\] \\[openclaw\\] first")));
                    (0, vitest_1.expect)(firstArgs.Body).not.toContain("second");
                    (0, vitest_1.expect)(secondArgs.Body).toMatch(new RegExp("\\[WhatsApp \\+1 (\\+\\d+[smhd] )?".concat(secondPattern, "\\] \\[openclaw\\] second")));
                    (0, vitest_1.expect)(secondArgs.Body).not.toContain("first");
                    // Max listeners bumped to avoid warnings in multi-instance test runs
                    (0, vitest_1.expect)((_b = process.getMaxListeners) === null || _b === void 0 ? void 0 : _b.call(process)).toBeGreaterThanOrEqual(50);
                    return [3 /*break*/, 8];
                case 6:
                    (_c = process.setMaxListeners) === null || _c === void 0 ? void 0 : _c.call(process, originalMax);
                    process.env.TZ = originalTz;
                    return [4 /*yield*/, store.cleanup()];
                case 7:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
