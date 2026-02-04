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
var cli_runner_js_1 = require("./cli-runner.js");
var helpers_js_1 = require("./cli-runner/helpers.js");
var runCommandWithTimeoutMock = vitest_1.vi.fn();
var runExecMock = vitest_1.vi.fn();
vitest_1.vi.mock("../process/exec.js", function () { return ({
    runCommandWithTimeout: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return runCommandWithTimeoutMock.apply(void 0, args);
    },
    runExec: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return runExecMock.apply(void 0, args);
    },
}); });
(0, vitest_1.describe)("runCliAgent resume cleanup", function () {
    (0, vitest_1.beforeEach)(function () {
        runCommandWithTimeoutMock.mockReset();
        runExecMock.mockReset();
    });
    (0, vitest_1.it)("kills stale resume processes for codex sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var pkillCall, pkillArgs;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runExecMock
                        .mockResolvedValueOnce({
                        stdout: "  1 S /bin/launchd\n",
                        stderr: "",
                    }) // cleanupSuspendedCliProcesses (ps)
                        .mockResolvedValueOnce({ stdout: "", stderr: "" }); // cleanupResumeProcesses (pkill)
                    runCommandWithTimeoutMock.mockResolvedValueOnce({
                        stdout: "ok",
                        stderr: "",
                        code: 0,
                        signal: null,
                        killed: false,
                    });
                    return [4 /*yield*/, (0, cli_runner_js_1.runCliAgent)({
                            sessionId: "s1",
                            sessionFile: "/tmp/session.jsonl",
                            workspaceDir: "/tmp",
                            prompt: "hi",
                            provider: "codex-cli",
                            model: "gpt-5.2-codex",
                            timeoutMs: 1000,
                            runId: "run-1",
                            cliSessionId: "thread-123",
                        })];
                case 1:
                    _b.sent();
                    if (process.platform === "win32") {
                        (0, vitest_1.expect)(runExecMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(runExecMock).toHaveBeenCalledTimes(2);
                    pkillCall = (_a = runExecMock.mock.calls[1]) !== null && _a !== void 0 ? _a : [];
                    (0, vitest_1.expect)(pkillCall[0]).toBe("pkill");
                    pkillArgs = pkillCall[1];
                    (0, vitest_1.expect)(pkillArgs[0]).toBe("-f");
                    (0, vitest_1.expect)(pkillArgs[1]).toContain("codex");
                    (0, vitest_1.expect)(pkillArgs[1]).toContain("resume");
                    (0, vitest_1.expect)(pkillArgs[1]).toContain("thread-123");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("cleanupSuspendedCliProcesses", function () {
    (0, vitest_1.beforeEach)(function () {
        runExecMock.mockReset();
    });
    (0, vitest_1.it)("skips when no session tokens are configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, helpers_js_1.cleanupSuspendedCliProcesses)({
                        command: "tool",
                    }, 0)];
                case 1:
                    _a.sent();
                    if (process.platform === "win32") {
                        (0, vitest_1.expect)(runExecMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(runExecMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("matches sessionArg-based commands", function () { return __awaiter(void 0, void 0, void 0, function () {
        var killCall;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runExecMock
                        .mockResolvedValueOnce({
                        stdout: [
                            "  40 T+ claude --session-id thread-1 -p",
                            "  41 S  claude --session-id thread-2 -p",
                        ].join("\n"),
                        stderr: "",
                    })
                        .mockResolvedValueOnce({ stdout: "", stderr: "" });
                    return [4 /*yield*/, (0, helpers_js_1.cleanupSuspendedCliProcesses)({
                            command: "claude",
                            sessionArg: "--session-id",
                        }, 0)];
                case 1:
                    _b.sent();
                    if (process.platform === "win32") {
                        (0, vitest_1.expect)(runExecMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(runExecMock).toHaveBeenCalledTimes(2);
                    killCall = (_a = runExecMock.mock.calls[1]) !== null && _a !== void 0 ? _a : [];
                    (0, vitest_1.expect)(killCall[0]).toBe("kill");
                    (0, vitest_1.expect)(killCall[1]).toEqual(["-9", "40"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("matches resumeArgs with positional session id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var killCall;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runExecMock
                        .mockResolvedValueOnce({
                        stdout: [
                            "  50 T  codex exec resume thread-99 --color never --sandbox read-only",
                            "  51 T  codex exec resume other --color never --sandbox read-only",
                        ].join("\n"),
                        stderr: "",
                    })
                        .mockResolvedValueOnce({ stdout: "", stderr: "" });
                    return [4 /*yield*/, (0, helpers_js_1.cleanupSuspendedCliProcesses)({
                            command: "codex",
                            resumeArgs: ["exec", "resume", "{sessionId}", "--color", "never", "--sandbox", "read-only"],
                        }, 1)];
                case 1:
                    _b.sent();
                    if (process.platform === "win32") {
                        (0, vitest_1.expect)(runExecMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(runExecMock).toHaveBeenCalledTimes(2);
                    killCall = (_a = runExecMock.mock.calls[1]) !== null && _a !== void 0 ? _a : [];
                    (0, vitest_1.expect)(killCall[0]).toBe("kill");
                    (0, vitest_1.expect)(killCall[1]).toEqual(["-9", "50", "51"]);
                    return [2 /*return*/];
            }
        });
    }); });
});
