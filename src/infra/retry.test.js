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
var retry_js_1 = require("./retry.js");
(0, vitest_1.describe)("retryAsync", function () {
    (0, vitest_1.it)("returns on first success", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = vitest_1.vi.fn().mockResolvedValue("ok");
                    return [4 /*yield*/, (0, retry_js_1.retryAsync)(fn, 3, 10)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBe("ok");
                    (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("retries then succeeds", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = vitest_1.vi.fn().mockRejectedValueOnce(new Error("fail1")).mockResolvedValueOnce("ok");
                    return [4 /*yield*/, (0, retry_js_1.retryAsync)(fn, 3, 1)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBe("ok");
                    (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("propagates after exhausting retries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = vitest_1.vi.fn().mockRejectedValue(new Error("boom"));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, retry_js_1.retryAsync)(fn, 2, 1)).rejects.toThrow("boom")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("stops when shouldRetry returns false", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = vitest_1.vi.fn().mockRejectedValue(new Error("boom"));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, retry_js_1.retryAsync)(fn, { attempts: 3, shouldRetry: function () { return false; } })).rejects.toThrow("boom")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("calls onRetry before retrying", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fn, onRetry, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = vitest_1.vi.fn().mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce("ok");
                    onRetry = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, retry_js_1.retryAsync)(fn, {
                            attempts: 2,
                            minDelayMs: 0,
                            maxDelayMs: 0,
                            onRetry: onRetry,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res).toBe("ok");
                    (0, vitest_1.expect)(onRetry).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ attempt: 1, maxAttempts: 2 }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clamps attempts to at least 1", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = vitest_1.vi.fn().mockRejectedValue(new Error("boom"));
                    return [4 /*yield*/, (0, vitest_1.expect)((0, retry_js_1.retryAsync)(fn, { attempts: 0, minDelayMs: 0, maxDelayMs: 0 })).rejects.toThrow("boom")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(fn).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses retryAfterMs when provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fn, delays, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    fn = vitest_1.vi.fn().mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce("ok");
                    delays = [];
                    promise = (0, retry_js_1.retryAsync)(fn, {
                        attempts: 2,
                        minDelayMs: 0,
                        maxDelayMs: 1000,
                        jitter: 0,
                        retryAfterMs: function () { return 500; },
                        onRetry: function (info) { return delays.push(info.delayMs); },
                    });
                    return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(promise).resolves.toBe("ok")];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(delays[0]).toBe(500);
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clamps retryAfterMs to maxDelayMs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fn, delays, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    fn = vitest_1.vi.fn().mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce("ok");
                    delays = [];
                    promise = (0, retry_js_1.retryAsync)(fn, {
                        attempts: 2,
                        minDelayMs: 0,
                        maxDelayMs: 100,
                        jitter: 0,
                        retryAfterMs: function () { return 500; },
                        onRetry: function (info) { return delays.push(info.delayMs); },
                    });
                    return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(promise).resolves.toBe("ok")];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(delays[0]).toBe(100);
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
});
