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
var node_events_1 = require("node:events");
var node_stream_1 = require("node:stream");
var vitest_1 = require("vitest");
var spawn_utils_js_1 = require("./spawn-utils.js");
function createStubChild() {
    var child = new node_events_1.EventEmitter();
    child.stdin = new node_stream_1.PassThrough();
    child.stdout = new node_stream_1.PassThrough();
    child.stderr = new node_stream_1.PassThrough();
    child.pid = 1234;
    child.killed = false;
    child.kill = vitest_1.vi.fn(function () { return true; });
    queueMicrotask(function () {
        child.emit("spawn");
    });
    return child;
}
(0, vitest_1.describe)("spawnWithFallback", function () {
    (0, vitest_1.it)("retries on EBADF using fallback options", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spawnMock, result;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    spawnMock = vitest_1.vi
                        .fn()
                        .mockImplementationOnce(function () {
                        var err = new Error("spawn EBADF");
                        err.code = "EBADF";
                        throw err;
                    })
                        .mockImplementationOnce(function () { return createStubChild(); });
                    return [4 /*yield*/, (0, spawn_utils_js_1.spawnWithFallback)({
                            argv: ["echo", "ok"],
                            options: { stdio: ["pipe", "pipe", "pipe"] },
                            fallbacks: [{ label: "safe-stdin", options: { stdio: ["ignore", "pipe", "pipe"] } }],
                            spawnImpl: spawnMock,
                        })];
                case 1:
                    result = _e.sent();
                    (0, vitest_1.expect)(result.usedFallback).toBe(true);
                    (0, vitest_1.expect)(result.fallbackLabel).toBe("safe-stdin");
                    (0, vitest_1.expect)(spawnMock).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)((_b = (_a = spawnMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[2]) === null || _b === void 0 ? void 0 : _b.stdio).toEqual(["pipe", "pipe", "pipe"]);
                    (0, vitest_1.expect)((_d = (_c = spawnMock.mock.calls[1]) === null || _c === void 0 ? void 0 : _c[2]) === null || _d === void 0 ? void 0 : _d.stdio).toEqual(["ignore", "pipe", "pipe"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not retry on non-EBADF errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spawnMock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spawnMock = vitest_1.vi.fn().mockImplementationOnce(function () {
                        var err = new Error("spawn ENOENT");
                        err.code = "ENOENT";
                        throw err;
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, spawn_utils_js_1.spawnWithFallback)({
                            argv: ["missing"],
                            options: { stdio: ["pipe", "pipe", "pipe"] },
                            fallbacks: [{ label: "safe-stdin", options: { stdio: ["ignore", "pipe", "pipe"] } }],
                            spawnImpl: spawnMock,
                        })).rejects.toThrow(/ENOENT/)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(spawnMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
