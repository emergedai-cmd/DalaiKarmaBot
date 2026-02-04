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
var vitest_1 = require("vitest");
var diagnosticMocks = vitest_1.vi.hoisted(function () { return ({
    logLaneEnqueue: vitest_1.vi.fn(),
    logLaneDequeue: vitest_1.vi.fn(),
    diag: {
        debug: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
    },
}); });
vitest_1.vi.mock("../logging/diagnostic.js", function () { return ({
    logLaneEnqueue: diagnosticMocks.logLaneEnqueue,
    logLaneDequeue: diagnosticMocks.logLaneDequeue,
    diagnosticLogger: diagnosticMocks.diag,
}); });
var command_queue_js_1 = require("./command-queue.js");
(0, vitest_1.describe)("command queue", function () {
    (0, vitest_1.beforeEach)(function () {
        diagnosticMocks.logLaneEnqueue.mockClear();
        diagnosticMocks.logLaneDequeue.mockClear();
        diagnosticMocks.diag.debug.mockClear();
        diagnosticMocks.diag.warn.mockClear();
        diagnosticMocks.diag.error.mockClear();
    });
    (0, vitest_1.it)("runs tasks one at a time in order", function () { return __awaiter(void 0, void 0, void 0, function () {
        var active, maxActive, calls, makeTask, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    active = 0;
                    maxActive = 0;
                    calls = [];
                    makeTask = function (id) { return function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    active += 1;
                                    maxActive = Math.max(maxActive, active);
                                    calls.push(id);
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 15); })];
                                case 1:
                                    _a.sent();
                                    active -= 1;
                                    return [2 /*return*/, id];
                            }
                        });
                    }); }; };
                    return [4 /*yield*/, Promise.all([
                            (0, command_queue_js_1.enqueueCommand)(makeTask(1)),
                            (0, command_queue_js_1.enqueueCommand)(makeTask(2)),
                            (0, command_queue_js_1.enqueueCommand)(makeTask(3)),
                        ])];
                case 1:
                    results = _a.sent();
                    (0, vitest_1.expect)(results).toEqual([1, 2, 3]);
                    (0, vitest_1.expect)(calls).toEqual([1, 2, 3]);
                    (0, vitest_1.expect)(maxActive).toBe(1);
                    (0, vitest_1.expect)((0, command_queue_js_1.getQueueSize)()).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs enqueue depth after push", function () { return __awaiter(void 0, void 0, void 0, function () {
        var task;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    task = (0, command_queue_js_1.enqueueCommand)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    (0, vitest_1.expect)(diagnosticMocks.logLaneEnqueue).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)((_a = diagnosticMocks.logLaneEnqueue.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1]).toBe(1);
                    return [4 /*yield*/, task];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("invokes onWait callback when a task waits past the threshold", function () { return __awaiter(void 0, void 0, void 0, function () {
        var waited, queuedAhead, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    waited = null;
                    queuedAhead = null;
                    first = (0, command_queue_js_1.enqueueCommand)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 30); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    second = (0, command_queue_js_1.enqueueCommand)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); }, {
                        warnAfterMs: 5,
                        onWait: function (ms, ahead) {
                            waited = ms;
                            queuedAhead = ahead;
                        },
                    });
                    return [4 /*yield*/, Promise.all([first, second])];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(waited).not.toBeNull();
                    (0, vitest_1.expect)(waited).toBeGreaterThanOrEqual(5);
                    (0, vitest_1.expect)(queuedAhead).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
