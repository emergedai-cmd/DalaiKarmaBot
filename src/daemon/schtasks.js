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
exports.resolveTaskScriptPath = resolveTaskScriptPath;
exports.readScheduledTaskCommand = readScheduledTaskCommand;
exports.parseSchtasksQuery = parseSchtasksQuery;
exports.installScheduledTask = installScheduledTask;
exports.uninstallScheduledTask = uninstallScheduledTask;
exports.stopScheduledTask = stopScheduledTask;
exports.restartScheduledTask = restartScheduledTask;
exports.isScheduledTaskInstalled = isScheduledTaskInstalled;
exports.readScheduledTaskRuntime = readScheduledTaskRuntime;
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var theme_js_1 = require("../terminal/theme.js");
var constants_js_1 = require("./constants.js");
var paths_js_1 = require("./paths.js");
var runtime_parse_js_1 = require("./runtime-parse.js");
var execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
var formatLine = function (label, value) {
    var rich = (0, theme_js_1.isRich)();
    return "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "".concat(label, ":")), " ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.command, value));
};
function resolveTaskName(env) {
    var _a;
    var override = (_a = env.OPENCLAW_WINDOWS_TASK_NAME) === null || _a === void 0 ? void 0 : _a.trim();
    if (override) {
        return override;
    }
    return (0, constants_js_1.resolveGatewayWindowsTaskName)(env.OPENCLAW_PROFILE);
}
function resolveTaskScriptPath(env) {
    var _a, _b;
    var override = (_a = env.OPENCLAW_TASK_SCRIPT) === null || _a === void 0 ? void 0 : _a.trim();
    if (override) {
        return override;
    }
    var scriptName = ((_b = env.OPENCLAW_TASK_SCRIPT_NAME) === null || _b === void 0 ? void 0 : _b.trim()) || "gateway.cmd";
    var stateDir = (0, paths_js_1.resolveGatewayStateDir)(env);
    return node_path_1.default.join(stateDir, scriptName);
}
function quoteCmdArg(value) {
    if (!/[ \t"]/g.test(value)) {
        return value;
    }
    return "\"".concat(value.replace(/"/g, '\\"'), "\"");
}
function resolveTaskUser(env) {
    var username = env.USERNAME || env.USER || env.LOGNAME;
    if (!username) {
        return null;
    }
    if (username.includes("\\")) {
        return username;
    }
    var domain = env.USERDOMAIN;
    if (domain) {
        return "".concat(domain, "\\").concat(username);
    }
    return username;
}
function parseCommandLine(value) {
    var args = [];
    var current = "";
    var inQuotes = false;
    var escapeNext = false;
    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
        var char = value_1[_i];
        if (escapeNext) {
            current += char;
            escapeNext = false;
            continue;
        }
        if (char === "\\") {
            escapeNext = true;
            continue;
        }
        if (char === '"') {
            inQuotes = !inQuotes;
            continue;
        }
        if (!inQuotes && /\s/.test(char)) {
            if (current) {
                args.push(current);
                current = "";
            }
            continue;
        }
        current += char;
    }
    if (current) {
        args.push(current);
    }
    return args;
}
function readScheduledTaskCommand(env) {
    return __awaiter(this, void 0, void 0, function () {
        var scriptPath, content, workingDirectory, commandLine, environment, _i, _a, rawLine, line, assignment, index, key, value, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    scriptPath = resolveTaskScriptPath(env);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readFile(scriptPath, "utf8")];
                case 2:
                    content = _c.sent();
                    workingDirectory = "";
                    commandLine = "";
                    environment = {};
                    for (_i = 0, _a = content.split(/\r?\n/); _i < _a.length; _i++) {
                        rawLine = _a[_i];
                        line = rawLine.trim();
                        if (!line) {
                            continue;
                        }
                        if (line.startsWith("@echo")) {
                            continue;
                        }
                        if (line.toLowerCase().startsWith("rem ")) {
                            continue;
                        }
                        if (line.toLowerCase().startsWith("set ")) {
                            assignment = line.slice(4).trim();
                            index = assignment.indexOf("=");
                            if (index > 0) {
                                key = assignment.slice(0, index).trim();
                                value = assignment.slice(index + 1).trim();
                                if (key) {
                                    environment[key] = value;
                                }
                            }
                            continue;
                        }
                        if (line.toLowerCase().startsWith("cd /d ")) {
                            workingDirectory = line.slice("cd /d ".length).trim().replace(/^"|"$/g, "");
                            continue;
                        }
                        commandLine = line;
                        break;
                    }
                    if (!commandLine) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, __assign(__assign({ programArguments: parseCommandLine(commandLine) }, (workingDirectory ? { workingDirectory: workingDirectory } : {})), (Object.keys(environment).length > 0 ? { environment: environment } : {}))];
                case 3:
                    _b = _c.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function parseSchtasksQuery(output) {
    var entries = (0, runtime_parse_js_1.parseKeyValueOutput)(output, ":");
    var info = {};
    var status = entries.status;
    if (status) {
        info.status = status;
    }
    var lastRunTime = entries["last run time"];
    if (lastRunTime) {
        info.lastRunTime = lastRunTime;
    }
    var lastRunResult = entries["last run result"];
    if (lastRunResult) {
        info.lastRunResult = lastRunResult;
    }
    return info;
}
function buildTaskScript(_a) {
    var description = _a.description, programArguments = _a.programArguments, workingDirectory = _a.workingDirectory, environment = _a.environment;
    var lines = ["@echo off"];
    if (description === null || description === void 0 ? void 0 : description.trim()) {
        lines.push("rem ".concat(description.trim()));
    }
    if (workingDirectory) {
        lines.push("cd /d ".concat(quoteCmdArg(workingDirectory)));
    }
    if (environment) {
        for (var _i = 0, _b = Object.entries(environment); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], value = _c[1];
            if (!value) {
                continue;
            }
            lines.push("set ".concat(key, "=").concat(value));
        }
    }
    var command = programArguments.map(quoteCmdArg).join(" ");
    lines.push(command);
    return "".concat(lines.join("\r\n"), "\r\n");
}
function execSchtasks(args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, stdout, stderr, error_1, e;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, execFileAsync("schtasks", args, {
                            encoding: "utf8",
                            windowsHide: true,
                        })];
                case 1:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    return [2 /*return*/, {
                            stdout: String(stdout !== null && stdout !== void 0 ? stdout : ""),
                            stderr: String(stderr !== null && stderr !== void 0 ? stderr : ""),
                            code: 0,
                        }];
                case 2:
                    error_1 = _b.sent();
                    e = error_1;
                    return [2 /*return*/, {
                            stdout: typeof e.stdout === "string" ? e.stdout : "",
                            stderr: typeof e.stderr === "string" ? e.stderr : typeof e.message === "string" ? e.message : "",
                            code: typeof e.code === "number" ? e.code : 1,
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function assertSchtasksAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        var res, detail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execSchtasks(["/Query"])];
                case 1:
                    res = _a.sent();
                    if (res.code === 0) {
                        return [2 /*return*/];
                    }
                    detail = res.stderr || res.stdout;
                    throw new Error("schtasks unavailable: ".concat(detail || "unknown error").trim());
            }
        });
    });
}
function installScheduledTask(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var scriptPath, taskDescription, script, taskName, quotedScript, baseArgs, taskUser, create, detail, hint;
        var _c;
        var env = _b.env, stdout = _b.stdout, programArguments = _b.programArguments, workingDirectory = _b.workingDirectory, environment = _b.environment, description = _b.description;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, assertSchtasksAvailable()];
                case 1:
                    _d.sent();
                    scriptPath = resolveTaskScriptPath(env);
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(scriptPath), { recursive: true })];
                case 2:
                    _d.sent();
                    taskDescription = description !== null && description !== void 0 ? description : (0, constants_js_1.formatGatewayServiceDescription)({
                        profile: env.OPENCLAW_PROFILE,
                        version: (_c = environment === null || environment === void 0 ? void 0 : environment.OPENCLAW_SERVICE_VERSION) !== null && _c !== void 0 ? _c : env.OPENCLAW_SERVICE_VERSION,
                    });
                    script = buildTaskScript({
                        description: taskDescription,
                        programArguments: programArguments,
                        workingDirectory: workingDirectory,
                        environment: environment,
                    });
                    return [4 /*yield*/, promises_1.default.writeFile(scriptPath, script, "utf8")];
                case 3:
                    _d.sent();
                    taskName = resolveTaskName(env);
                    quotedScript = quoteCmdArg(scriptPath);
                    baseArgs = [
                        "/Create",
                        "/F",
                        "/SC",
                        "ONLOGON",
                        "/RL",
                        "LIMITED",
                        "/TN",
                        taskName,
                        "/TR",
                        quotedScript,
                    ];
                    taskUser = resolveTaskUser(env);
                    return [4 /*yield*/, execSchtasks(taskUser ? __spreadArray(__spreadArray([], baseArgs, true), ["/RU", taskUser, "/NP", "/IT"], false) : baseArgs)];
                case 4:
                    create = _d.sent();
                    if (!(create.code !== 0 && taskUser)) return [3 /*break*/, 6];
                    return [4 /*yield*/, execSchtasks(baseArgs)];
                case 5:
                    create = _d.sent();
                    _d.label = 6;
                case 6:
                    if (create.code !== 0) {
                        detail = create.stderr || create.stdout;
                        hint = /access is denied/i.test(detail)
                            ? " Run PowerShell as Administrator or rerun without installing the daemon."
                            : "";
                        throw new Error("schtasks create failed: ".concat(detail).concat(hint).trim());
                    }
                    return [4 /*yield*/, execSchtasks(["/Run", "/TN", taskName])];
                case 7:
                    _d.sent();
                    // Ensure we don't end up writing to a clack spinner line (wizards show progress without a newline).
                    stdout.write("\n");
                    stdout.write("".concat(formatLine("Installed Scheduled Task", taskName), "\n"));
                    stdout.write("".concat(formatLine("Task script", scriptPath), "\n"));
                    return [2 /*return*/, { scriptPath: scriptPath }];
            }
        });
    });
}
function uninstallScheduledTask(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var taskName, scriptPath, _c;
        var env = _b.env, stdout = _b.stdout;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, assertSchtasksAvailable()];
                case 1:
                    _d.sent();
                    taskName = resolveTaskName(env);
                    return [4 /*yield*/, execSchtasks(["/Delete", "/F", "/TN", taskName])];
                case 2:
                    _d.sent();
                    scriptPath = resolveTaskScriptPath(env);
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.unlink(scriptPath)];
                case 4:
                    _d.sent();
                    stdout.write("".concat(formatLine("Removed task script", scriptPath), "\n"));
                    return [3 /*break*/, 6];
                case 5:
                    _c = _d.sent();
                    stdout.write("Task script not found at ".concat(scriptPath, "\n"));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function isTaskNotRunning(res) {
    var detail = (res.stderr || res.stdout).toLowerCase();
    return detail.includes("not running");
}
function stopScheduledTask(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var taskName, res;
        var stdout = _b.stdout, env = _b.env;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, assertSchtasksAvailable()];
                case 1:
                    _c.sent();
                    taskName = resolveTaskName(env !== null && env !== void 0 ? env : process.env);
                    return [4 /*yield*/, execSchtasks(["/End", "/TN", taskName])];
                case 2:
                    res = _c.sent();
                    if (res.code !== 0 && !isTaskNotRunning(res)) {
                        throw new Error("schtasks end failed: ".concat(res.stderr || res.stdout).trim());
                    }
                    stdout.write("".concat(formatLine("Stopped Scheduled Task", taskName), "\n"));
                    return [2 /*return*/];
            }
        });
    });
}
function restartScheduledTask(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var taskName, res;
        var stdout = _b.stdout, env = _b.env;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, assertSchtasksAvailable()];
                case 1:
                    _c.sent();
                    taskName = resolveTaskName(env !== null && env !== void 0 ? env : process.env);
                    return [4 /*yield*/, execSchtasks(["/End", "/TN", taskName])];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, execSchtasks(["/Run", "/TN", taskName])];
                case 3:
                    res = _c.sent();
                    if (res.code !== 0) {
                        throw new Error("schtasks run failed: ".concat(res.stderr || res.stdout).trim());
                    }
                    stdout.write("".concat(formatLine("Restarted Scheduled Task", taskName), "\n"));
                    return [2 /*return*/];
            }
        });
    });
}
function isScheduledTaskInstalled(args) {
    return __awaiter(this, void 0, void 0, function () {
        var taskName, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, assertSchtasksAvailable()];
                case 1:
                    _b.sent();
                    taskName = resolveTaskName((_a = args.env) !== null && _a !== void 0 ? _a : process.env);
                    return [4 /*yield*/, execSchtasks(["/Query", "/TN", taskName])];
                case 2:
                    res = _b.sent();
                    return [2 /*return*/, res.code === 0];
            }
        });
    });
}
function readScheduledTaskRuntime() {
    return __awaiter(this, arguments, void 0, function (env) {
        var err_1, taskName, res, detail, missing, parsed, statusRaw, status;
        var _a;
        if (env === void 0) { env = process.env; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, assertSchtasksAvailable()];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    return [2 /*return*/, {
                            status: "unknown",
                            detail: String(err_1),
                        }];
                case 3:
                    taskName = resolveTaskName(env);
                    return [4 /*yield*/, execSchtasks(["/Query", "/TN", taskName, "/V", "/FO", "LIST"])];
                case 4:
                    res = _b.sent();
                    if (res.code !== 0) {
                        detail = (res.stderr || res.stdout).trim();
                        missing = detail.toLowerCase().includes("cannot find the file");
                        return [2 /*return*/, {
                                status: missing ? "stopped" : "unknown",
                                detail: detail || undefined,
                                missingUnit: missing,
                            }];
                    }
                    parsed = parseSchtasksQuery(res.stdout || "");
                    statusRaw = (_a = parsed.status) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    status = statusRaw === "running" ? "running" : statusRaw ? "stopped" : "unknown";
                    return [2 /*return*/, {
                            status: status,
                            state: parsed.status,
                            lastRunTime: parsed.lastRunTime,
                            lastRunResult: parsed.lastRunResult,
                        }];
            }
        });
    });
}
