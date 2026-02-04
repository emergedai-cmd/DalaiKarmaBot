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
var vitest_1 = require("vitest");
vitest_1.vi.mock("node:child_process", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("node:child_process")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { execFileSync: vitest_1.vi.fn() })];
        }
    });
}); });
var node_child_process_1 = require("node:child_process");
var ports_js_1 = require("./ports.js");
(0, vitest_1.describe)("gateway --force helpers", function () {
    var originalKill;
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        originalKill = process.kill.bind(process);
    });
    (0, vitest_1.afterEach)(function () {
        process.kill = originalKill;
    });
    (0, vitest_1.it)("parses lsof output into pid/command pairs", function () {
        var sample = ["p123", "cnode", "p456", "cpython", ""].join("\n");
        var parsed = (0, ports_js_1.parseLsofOutput)(sample);
        (0, vitest_1.expect)(parsed).toEqual([
            { pid: 123, command: "node" },
            { pid: 456, command: "python" },
        ]);
    });
    (0, vitest_1.it)("returns empty list when lsof finds nothing", function () {
        node_child_process_1.execFileSync.mockImplementation(function () {
            var err = new Error("no matches");
            // @ts-expect-error partial
            err.status = 1; // lsof uses exit 1 for no matches
            throw err;
        });
        (0, vitest_1.expect)((0, ports_js_1.listPortListeners)(18789)).toEqual([]);
    });
    (0, vitest_1.it)("throws when lsof missing", function () {
        node_child_process_1.execFileSync.mockImplementation(function () {
            var err = new Error("not found");
            // @ts-expect-error partial
            err.code = "ENOENT";
            throw err;
        });
        (0, vitest_1.expect)(function () { return (0, ports_js_1.listPortListeners)(18789); }).toThrow(/lsof not found/);
    });
    (0, vitest_1.it)("kills each listener and returns metadata", function () {
        node_child_process_1.execFileSync.mockReturnValue(["p42", "cnode", "p99", "cssh", ""].join("\n"));
        var killMock = vitest_1.vi.fn();
        // @ts-expect-error override for test
        process.kill = killMock;
        var killed = (0, ports_js_1.forceFreePort)(18789);
        (0, vitest_1.expect)(node_child_process_1.execFileSync).toHaveBeenCalled();
        (0, vitest_1.expect)(killMock).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(killMock).toHaveBeenCalledWith(42, "SIGTERM");
        (0, vitest_1.expect)(killMock).toHaveBeenCalledWith(99, "SIGTERM");
        (0, vitest_1.expect)(killed).toEqual([
            { pid: 42, command: "node" },
            { pid: 99, command: "ssh" },
        ]);
    });
    (0, vitest_1.it)("retries until the port is free", function () { return __awaiter(void 0, void 0, void 0, function () {
        var call, killMock, promise, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    call = 0;
                    node_child_process_1.execFileSync.mockImplementation(function () {
                        call += 1;
                        // 1st call: initial listeners to kill; 2nd call: still listed; 3rd call: gone.
                        if (call === 1) {
                            return ["p42", "cnode", ""].join("\n");
                        }
                        if (call === 2) {
                            return ["p42", "cnode", ""].join("\n");
                        }
                        return "";
                    });
                    killMock = vitest_1.vi.fn();
                    // @ts-expect-error override for test
                    process.kill = killMock;
                    promise = (0, ports_js_1.forceFreePortAndWait)(18789, {
                        timeoutMs: 500,
                        intervalMs: 100,
                        sigtermTimeoutMs: 400,
                    });
                    return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promise];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(killMock).toHaveBeenCalledWith(42, "SIGTERM");
                    (0, vitest_1.expect)(res.killed).toEqual([{ pid: 42, command: "node" }]);
                    (0, vitest_1.expect)(res.escalatedToSigkill).toBe(false);
                    (0, vitest_1.expect)(res.waitedMs).toBeGreaterThan(0);
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("escalates to SIGKILL if SIGTERM doesn't free the port", function () { return __awaiter(void 0, void 0, void 0, function () {
        var call, killMock, promise, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    call = 0;
                    node_child_process_1.execFileSync.mockImplementation(function () {
                        call += 1;
                        // 1st call: initial kill list; then keep showing until after SIGKILL.
                        if (call <= 6) {
                            return ["p42", "cnode", ""].join("\n");
                        }
                        return "";
                    });
                    killMock = vitest_1.vi.fn();
                    // @ts-expect-error override for test
                    process.kill = killMock;
                    promise = (0, ports_js_1.forceFreePortAndWait)(18789, {
                        timeoutMs: 800,
                        intervalMs: 100,
                        sigtermTimeoutMs: 300,
                    });
                    return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promise];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(killMock).toHaveBeenCalledWith(42, "SIGTERM");
                    (0, vitest_1.expect)(killMock).toHaveBeenCalledWith(42, "SIGKILL");
                    (0, vitest_1.expect)(res.escalatedToSigkill).toBe(true);
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
});
