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
var utils_js_1 = require("../utils.js");
var claude_cli_runner_js_1 = require("./claude-cli-runner.js");
var runCommandWithTimeoutMock = vitest_1.vi.fn();
function createDeferred() {
    var resolve;
    var reject;
    var promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
    });
    return {
        promise: promise,
        resolve: resolve,
        reject: reject,
    };
}
function waitForCalls(mockFn, count) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 50)) return [3 /*break*/, 4];
                    if (mockFn.mock.calls.length >= count) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: throw new Error("Expected ".concat(count, " calls, got ").concat(mockFn.mock.calls.length));
            }
        });
    });
}
vitest_1.vi.mock("../process/exec.js", function () { return ({
    runCommandWithTimeout: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return runCommandWithTimeoutMock.apply(void 0, args);
    },
}); });
(0, vitest_1.describe)("runClaudeCliAgent", function () {
    (0, vitest_1.beforeEach)(function () {
        runCommandWithTimeoutMock.mockReset();
    });
    (0, vitest_1.it)("starts a new session with --session-id when none is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var argv;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runCommandWithTimeoutMock.mockResolvedValueOnce({
                        stdout: JSON.stringify({ message: "ok", session_id: "sid-1" }),
                        stderr: "",
                        code: 0,
                        signal: null,
                        killed: false,
                    });
                    return [4 /*yield*/, (0, claude_cli_runner_js_1.runClaudeCliAgent)({
                            sessionId: "openclaw-session",
                            sessionFile: "/tmp/session.jsonl",
                            workspaceDir: "/tmp",
                            prompt: "hi",
                            model: "opus",
                            timeoutMs: 1000,
                            runId: "run-1",
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(runCommandWithTimeoutMock).toHaveBeenCalledTimes(1);
                    argv = (_a = runCommandWithTimeoutMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(argv).toContain("claude");
                    (0, vitest_1.expect)(argv).toContain("--session-id");
                    (0, vitest_1.expect)(argv).toContain("hi");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses --resume when a claude session id is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var argv;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runCommandWithTimeoutMock.mockResolvedValueOnce({
                        stdout: JSON.stringify({ message: "ok", session_id: "sid-2" }),
                        stderr: "",
                        code: 0,
                        signal: null,
                        killed: false,
                    });
                    return [4 /*yield*/, (0, claude_cli_runner_js_1.runClaudeCliAgent)({
                            sessionId: "openclaw-session",
                            sessionFile: "/tmp/session.jsonl",
                            workspaceDir: "/tmp",
                            prompt: "hi",
                            model: "opus",
                            timeoutMs: 1000,
                            runId: "run-2",
                            claudeSessionId: "c9d7b831-1c31-4d22-80b9-1e50ca207d4b",
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(runCommandWithTimeoutMock).toHaveBeenCalledTimes(1);
                    argv = (_a = runCommandWithTimeoutMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(argv).toContain("--resume");
                    (0, vitest_1.expect)(argv).toContain("c9d7b831-1c31-4d22-80b9-1e50ca207d4b");
                    (0, vitest_1.expect)(argv).toContain("hi");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("serializes concurrent claude-cli runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var firstDeferred, secondDeferred, firstRun, secondRun;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    firstDeferred = createDeferred();
                    secondDeferred = createDeferred();
                    runCommandWithTimeoutMock
                        .mockImplementationOnce(function () { return firstDeferred.promise; })
                        .mockImplementationOnce(function () { return secondDeferred.promise; });
                    firstRun = (0, claude_cli_runner_js_1.runClaudeCliAgent)({
                        sessionId: "s1",
                        sessionFile: "/tmp/session.jsonl",
                        workspaceDir: "/tmp",
                        prompt: "first",
                        model: "opus",
                        timeoutMs: 1000,
                        runId: "run-1",
                    });
                    secondRun = (0, claude_cli_runner_js_1.runClaudeCliAgent)({
                        sessionId: "s2",
                        sessionFile: "/tmp/session.jsonl",
                        workspaceDir: "/tmp",
                        prompt: "second",
                        model: "opus",
                        timeoutMs: 1000,
                        runId: "run-2",
                    });
                    return [4 /*yield*/, waitForCalls(runCommandWithTimeoutMock, 1)];
                case 1:
                    _a.sent();
                    firstDeferred.resolve({
                        stdout: JSON.stringify({ message: "ok", session_id: "sid-1" }),
                        stderr: "",
                        code: 0,
                        signal: null,
                        killed: false,
                    });
                    return [4 /*yield*/, waitForCalls(runCommandWithTimeoutMock, 2)];
                case 2:
                    _a.sent();
                    secondDeferred.resolve({
                        stdout: JSON.stringify({ message: "ok", session_id: "sid-2" }),
                        stderr: "",
                        code: 0,
                        signal: null,
                        killed: false,
                    });
                    return [4 /*yield*/, Promise.all([firstRun, secondRun])];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
