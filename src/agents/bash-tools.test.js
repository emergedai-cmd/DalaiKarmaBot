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
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var system_events_js_1 = require("../infra/system-events.js");
var utils_js_1 = require("../utils.js");
var bash_process_registry_js_1 = require("./bash-process-registry.js");
var bash_tools_js_1 = require("./bash-tools.js");
var bash_tools_shared_js_1 = require("./bash-tools.shared.js");
var shell_utils_js_1 = require("./shell-utils.js");
var isWin = process.platform === "win32";
var resolveShellFromPath = function (name) {
    var _a;
    var envPath = (_a = process.env.PATH) !== null && _a !== void 0 ? _a : "";
    if (!envPath) {
        return undefined;
    }
    var entries = envPath.split(node_path_1.default.delimiter).filter(Boolean);
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var candidate = node_path_1.default.join(entry, name);
        try {
            node_fs_1.default.accessSync(candidate, node_fs_1.default.constants.X_OK);
            return candidate;
        }
        catch (_b) {
            // ignore missing or non-executable entries
        }
    }
    return undefined;
};
var defaultShell = isWin
    ? undefined
    : process.env.OPENCLAW_TEST_SHELL || resolveShellFromPath("bash") || process.env.SHELL || "sh";
// PowerShell: Start-Sleep for delays, ; for command separation, $null for null device
var shortDelayCmd = isWin ? "Start-Sleep -Milliseconds 50" : "sleep 0.05";
var yieldDelayCmd = isWin ? "Start-Sleep -Milliseconds 200" : "sleep 0.2";
var longDelayCmd = isWin ? "Start-Sleep -Seconds 2" : "sleep 2";
// Both PowerShell and bash use ; for command separation
var joinCommands = function (commands) { return commands.join("; "); };
var echoAfterDelay = function (message) { return joinCommands([shortDelayCmd, "echo ".concat(message)]); };
var echoLines = function (lines) { return joinCommands(lines.map(function (line) { return "echo ".concat(line); })); };
var normalizeText = function (value) {
    return (0, shell_utils_js_1.sanitizeBinaryOutput)(value !== null && value !== void 0 ? value : "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n")
        .map(function (line) { return line.replace(/\s+$/u, ""); })
        .join("\n")
        .trim();
};
function waitForCompletion(sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var status, deadline, poll;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = "running";
                    deadline = Date.now() + (process.platform === "win32" ? 8000 : 2000);
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < deadline && status === "running")) return [3 /*break*/, 5];
                    return [4 /*yield*/, bash_tools_js_1.processTool.execute("call-wait", {
                            action: "poll",
                            sessionId: sessionId,
                        })];
                case 2:
                    poll = _a.sent();
                    status = poll.details.status;
                    if (!(status === "running")) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, utils_js_1.sleep)(20)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 1];
                case 5: return [2 /*return*/, status];
            }
        });
    });
}
(0, vitest_1.beforeEach)(function () {
    (0, bash_process_registry_js_1.resetProcessRegistryForTests)();
    (0, system_events_js_1.resetSystemEventsForTest)();
});
(0, vitest_1.describe)("exec tool backgrounding", function () {
    var originalShell = process.env.SHELL;
    (0, vitest_1.beforeEach)(function () {
        if (!isWin && defaultShell) {
            process.env.SHELL = defaultShell;
        }
    });
    (0, vitest_1.afterEach)(function () {
        if (!isWin) {
            process.env.SHELL = originalShell;
        }
    });
    (0, vitest_1.it)("backgrounds after yield and can be polled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, sessionId, status, output, deadline, poll, textBlock;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bash_tools_js_1.execTool.execute("call1", {
                        command: joinCommands([yieldDelayCmd, "echo done"]),
                        yieldMs: 10,
                    })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.details.status).toBe("running");
                    sessionId = result.details.sessionId;
                    status = "running";
                    output = "";
                    deadline = Date.now() + (process.platform === "win32" ? 8000 : 2000);
                    _b.label = 2;
                case 2:
                    if (!(Date.now() < deadline && status === "running")) return [3 /*break*/, 6];
                    return [4 /*yield*/, bash_tools_js_1.processTool.execute("call2", {
                            action: "poll",
                            sessionId: sessionId,
                        })];
                case 3:
                    poll = _b.sent();
                    status = poll.details.status;
                    textBlock = poll.content.find(function (c) { return c.type === "text"; });
                    output = (_a = textBlock === null || textBlock === void 0 ? void 0 : textBlock.text) !== null && _a !== void 0 ? _a : "";
                    if (!(status === "running")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, utils_js_1.sleep)(20)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 2];
                case 6:
                    (0, vitest_1.expect)(status).toBe("completed");
                    (0, vitest_1.expect)(output).toContain("done");
                    return [2 /*return*/];
            }
        });
    }); }, isWin ? 15000 : 5000);
    (0, vitest_1.it)("supports explicit background", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, sessionId, list, sessions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bash_tools_js_1.execTool.execute("call1", {
                        command: echoAfterDelay("later"),
                        background: true,
                    })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details.status).toBe("running");
                    sessionId = result.details.sessionId;
                    return [4 /*yield*/, bash_tools_js_1.processTool.execute("call2", { action: "list" })];
                case 2:
                    list = _a.sent();
                    sessions = list.details.sessions;
                    (0, vitest_1.expect)(sessions.some(function (s) { return s.sessionId === sessionId; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("derives a session name from the command", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, sessionId, list, sessions, entry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bash_tools_js_1.execTool.execute("call1", {
                        command: "echo hello",
                        background: true,
                    })];
                case 1:
                    result = _a.sent();
                    sessionId = result.details.sessionId;
                    return [4 /*yield*/, (0, utils_js_1.sleep)(25)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, bash_tools_js_1.processTool.execute("call2", { action: "list" })];
                case 3:
                    list = _a.sent();
                    sessions = list.details
                        .sessions;
                    entry = sessions.find(function (s) { return s.sessionId === sessionId; });
                    (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.name).toBe("echo hello");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses default timeout when timeout is omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var customBash, customProcess, result, sessionId, status, deadline, poll;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    customBash = (0, bash_tools_js_1.createExecTool)({ timeoutSec: 1, backgroundMs: 10 });
                    customProcess = (0, bash_tools_js_1.createProcessTool)();
                    return [4 /*yield*/, customBash.execute("call1", {
                            command: longDelayCmd,
                            background: true,
                        })];
                case 1:
                    result = _a.sent();
                    sessionId = result.details.sessionId;
                    status = "running";
                    deadline = Date.now() + 5000;
                    _a.label = 2;
                case 2:
                    if (!(Date.now() < deadline && status === "running")) return [3 /*break*/, 6];
                    return [4 /*yield*/, customProcess.execute("call2", {
                            action: "poll",
                            sessionId: sessionId,
                        })];
                case 3:
                    poll = _a.sent();
                    status = poll.details.status;
                    if (!(status === "running")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, utils_js_1.sleep)(50)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 2];
                case 6:
                    (0, vitest_1.expect)(status).toBe("failed");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects elevated requests when not allowed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var customBash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    customBash = (0, bash_tools_js_1.createExecTool)({
                        elevated: { enabled: true, allowed: false, defaultLevel: "off" },
                        messageProvider: "telegram",
                        sessionKey: "agent:main:main",
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)(customBash.execute("call1", {
                            command: "echo hi",
                            elevated: true,
                        })).rejects.toThrow("Context: provider=telegram session=agent:main:main")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not default to elevated when not allowed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var customBash, result, text;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    customBash = (0, bash_tools_js_1.createExecTool)({
                        elevated: { enabled: true, allowed: false, defaultLevel: "on" },
                        backgroundMs: 1000,
                        timeoutSec: 5,
                    });
                    return [4 /*yield*/, customBash.execute("call1", {
                            command: "echo hi",
                        })];
                case 1:
                    result = _c.sent();
                    text = (_b = (_a = result.content.find(function (c) { return c.type === "text"; })) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
                    (0, vitest_1.expect)(text).toContain("hi");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs line-based slices and defaults to last lines", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, sessionId, status, log, textBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bash_tools_js_1.execTool.execute("call1", {
                        command: echoLines(["one", "two", "three"]),
                        background: true,
                    })];
                case 1:
                    result = _a.sent();
                    sessionId = result.details.sessionId;
                    return [4 /*yield*/, waitForCompletion(sessionId)];
                case 2:
                    status = _a.sent();
                    return [4 /*yield*/, bash_tools_js_1.processTool.execute("call3", {
                            action: "log",
                            sessionId: sessionId,
                            limit: 2,
                        })];
                case 3:
                    log = _a.sent();
                    textBlock = log.content.find(function (c) { return c.type === "text"; });
                    (0, vitest_1.expect)(normalizeText(textBlock === null || textBlock === void 0 ? void 0 : textBlock.text)).toBe("two\nthree");
                    (0, vitest_1.expect)(log.details.totalLines).toBe(3);
                    (0, vitest_1.expect)(status).toBe("completed");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("supports line offsets for log slices", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, sessionId, log, textBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bash_tools_js_1.execTool.execute("call1", {
                        command: echoLines(["alpha", "beta", "gamma"]),
                        background: true,
                    })];
                case 1:
                    result = _a.sent();
                    sessionId = result.details.sessionId;
                    return [4 /*yield*/, waitForCompletion(sessionId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, bash_tools_js_1.processTool.execute("call2", {
                            action: "log",
                            sessionId: sessionId,
                            offset: 1,
                            limit: 1,
                        })];
                case 3:
                    log = _a.sent();
                    textBlock = log.content.find(function (c) { return c.type === "text"; });
                    (0, vitest_1.expect)(normalizeText(textBlock === null || textBlock === void 0 ? void 0 : textBlock.text)).toBe("beta");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("scopes process sessions by scopeKey", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bashA, processA, bashB, processB, resultA, resultB, sessionA, sessionB, listA, sessionsA, pollB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bashA = (0, bash_tools_js_1.createExecTool)({ backgroundMs: 10, scopeKey: "agent:alpha" });
                    processA = (0, bash_tools_js_1.createProcessTool)({ scopeKey: "agent:alpha" });
                    bashB = (0, bash_tools_js_1.createExecTool)({ backgroundMs: 10, scopeKey: "agent:beta" });
                    processB = (0, bash_tools_js_1.createProcessTool)({ scopeKey: "agent:beta" });
                    return [4 /*yield*/, bashA.execute("call1", {
                            command: shortDelayCmd,
                            background: true,
                        })];
                case 1:
                    resultA = _a.sent();
                    return [4 /*yield*/, bashB.execute("call2", {
                            command: shortDelayCmd,
                            background: true,
                        })];
                case 2:
                    resultB = _a.sent();
                    sessionA = resultA.details.sessionId;
                    sessionB = resultB.details.sessionId;
                    return [4 /*yield*/, processA.execute("call3", { action: "list" })];
                case 3:
                    listA = _a.sent();
                    sessionsA = listA.details.sessions;
                    (0, vitest_1.expect)(sessionsA.some(function (s) { return s.sessionId === sessionA; })).toBe(true);
                    (0, vitest_1.expect)(sessionsA.some(function (s) { return s.sessionId === sessionB; })).toBe(false);
                    return [4 /*yield*/, processB.execute("call4", {
                            action: "poll",
                            sessionId: sessionA,
                        })];
                case 4:
                    pollB = _a.sent();
                    (0, vitest_1.expect)(pollB.details.status).toBe("failed");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("exec notifyOnExit", function () {
    (0, vitest_1.it)("enqueues a system event when a backgrounded exec exits", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, result, sessionId, finished, deadline, events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tool = (0, bash_tools_js_1.createExecTool)({
                        allowBackground: true,
                        backgroundMs: 0,
                        notifyOnExit: true,
                        sessionKey: "agent:main:main",
                    });
                    return [4 /*yield*/, tool.execute("call1", {
                            command: echoAfterDelay("notify"),
                            background: true,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details.status).toBe("running");
                    sessionId = result.details.sessionId;
                    finished = (0, bash_process_registry_js_1.getFinishedSession)(sessionId);
                    deadline = Date.now() + (isWin ? 8000 : 2000);
                    _a.label = 2;
                case 2:
                    if (!(!finished && Date.now() < deadline)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, utils_js_1.sleep)(20)];
                case 3:
                    _a.sent();
                    finished = (0, bash_process_registry_js_1.getFinishedSession)(sessionId);
                    return [3 /*break*/, 2];
                case 4:
                    (0, vitest_1.expect)(finished).toBeTruthy();
                    events = (0, system_events_js_1.peekSystemEvents)("agent:main:main");
                    (0, vitest_1.expect)(events.some(function (event) { return event.includes(sessionId.slice(0, 8)); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("exec PATH handling", function () {
    var originalPath = process.env.PATH;
    var originalShell = process.env.SHELL;
    (0, vitest_1.beforeEach)(function () {
        if (!isWin && defaultShell) {
            process.env.SHELL = defaultShell;
        }
    });
    (0, vitest_1.afterEach)(function () {
        process.env.PATH = originalPath;
        if (!isWin) {
            process.env.SHELL = originalShell;
        }
    });
    (0, vitest_1.it)("prepends configured path entries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var basePath, prepend, tool, result, text;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    basePath = isWin ? "C:\\Windows\\System32" : "/usr/bin";
                    prepend = isWin ? ["C:\\custom\\bin", "C:\\oss\\bin"] : ["/custom/bin", "/opt/oss/bin"];
                    process.env.PATH = basePath;
                    tool = (0, bash_tools_js_1.createExecTool)({ pathPrepend: prepend });
                    return [4 /*yield*/, tool.execute("call1", {
                            command: isWin ? "Write-Output $env:PATH" : "echo $PATH",
                        })];
                case 1:
                    result = _b.sent();
                    text = normalizeText((_a = result.content.find(function (c) { return c.type === "text"; })) === null || _a === void 0 ? void 0 : _a.text);
                    (0, vitest_1.expect)(text).toBe(__spreadArray(__spreadArray([], prepend, true), [basePath], false).join(node_path_1.default.delimiter));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("buildDockerExecArgs", function () {
    (0, vitest_1.it)("prepends custom PATH after login shell sourcing to preserve both custom and system tools", function () {
        var args = (0, bash_tools_shared_js_1.buildDockerExecArgs)({
            containerName: "test-container",
            command: "echo hello",
            env: {
                PATH: "/custom/bin:/usr/local/bin:/usr/bin",
                HOME: "/home/user",
            },
            tty: false,
        });
        var commandArg = args[args.length - 1];
        (0, vitest_1.expect)(args).toContain("OPENCLAW_PREPEND_PATH=/custom/bin:/usr/local/bin:/usr/bin");
        (0, vitest_1.expect)(commandArg).toContain('export PATH="${OPENCLAW_PREPEND_PATH}:$PATH"');
        (0, vitest_1.expect)(commandArg).toContain("echo hello");
        (0, vitest_1.expect)(commandArg).toBe('export PATH="${OPENCLAW_PREPEND_PATH}:$PATH"; unset OPENCLAW_PREPEND_PATH; echo hello');
    });
    (0, vitest_1.it)("does not interpolate PATH into the shell command", function () {
        var injectedPath = "$(touch /tmp/openclaw-path-injection)";
        var args = (0, bash_tools_shared_js_1.buildDockerExecArgs)({
            containerName: "test-container",
            command: "echo hello",
            env: {
                PATH: injectedPath,
                HOME: "/home/user",
            },
            tty: false,
        });
        var commandArg = args[args.length - 1];
        (0, vitest_1.expect)(args).toContain("OPENCLAW_PREPEND_PATH=".concat(injectedPath));
        (0, vitest_1.expect)(commandArg).not.toContain(injectedPath);
        (0, vitest_1.expect)(commandArg).toContain("OPENCLAW_PREPEND_PATH");
    });
    (0, vitest_1.it)("does not add PATH export when PATH is not in env", function () {
        var args = (0, bash_tools_shared_js_1.buildDockerExecArgs)({
            containerName: "test-container",
            command: "echo hello",
            env: {
                HOME: "/home/user",
            },
            tty: false,
        });
        var commandArg = args[args.length - 1];
        (0, vitest_1.expect)(commandArg).toBe("echo hello");
        (0, vitest_1.expect)(commandArg).not.toContain("export PATH");
    });
    (0, vitest_1.it)("includes workdir flag when specified", function () {
        var args = (0, bash_tools_shared_js_1.buildDockerExecArgs)({
            containerName: "test-container",
            command: "pwd",
            workdir: "/workspace",
            env: { HOME: "/home/user" },
            tty: false,
        });
        (0, vitest_1.expect)(args).toContain("-w");
        (0, vitest_1.expect)(args).toContain("/workspace");
    });
    (0, vitest_1.it)("uses login shell for consistent environment", function () {
        var args = (0, bash_tools_shared_js_1.buildDockerExecArgs)({
            containerName: "test-container",
            command: "echo test",
            env: { HOME: "/home/user" },
            tty: false,
        });
        (0, vitest_1.expect)(args).toContain("sh");
        (0, vitest_1.expect)(args).toContain("-lc");
    });
    (0, vitest_1.it)("includes tty flag when requested", function () {
        var args = (0, bash_tools_shared_js_1.buildDockerExecArgs)({
            containerName: "test-container",
            command: "bash",
            env: { HOME: "/home/user" },
            tty: true,
        });
        (0, vitest_1.expect)(args).toContain("-t");
    });
});
