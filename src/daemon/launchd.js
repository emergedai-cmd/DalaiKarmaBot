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
exports.resolveLaunchAgentPlistPath = resolveLaunchAgentPlistPath;
exports.resolveGatewayLogPaths = resolveGatewayLogPaths;
exports.readLaunchAgentProgramArguments = readLaunchAgentProgramArguments;
exports.buildLaunchAgentPlist = buildLaunchAgentPlist;
exports.parseLaunchctlPrint = parseLaunchctlPrint;
exports.isLaunchAgentLoaded = isLaunchAgentLoaded;
exports.isLaunchAgentListed = isLaunchAgentListed;
exports.launchAgentPlistExists = launchAgentPlistExists;
exports.readLaunchAgentRuntime = readLaunchAgentRuntime;
exports.repairLaunchAgentBootstrap = repairLaunchAgentBootstrap;
exports.findLegacyLaunchAgents = findLegacyLaunchAgents;
exports.uninstallLegacyLaunchAgents = uninstallLegacyLaunchAgents;
exports.uninstallLaunchAgent = uninstallLaunchAgent;
exports.stopLaunchAgent = stopLaunchAgent;
exports.installLaunchAgent = installLaunchAgent;
exports.restartLaunchAgent = restartLaunchAgent;
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var theme_js_1 = require("../terminal/theme.js");
var constants_js_1 = require("./constants.js");
var launchd_plist_js_1 = require("./launchd-plist.js");
var paths_js_1 = require("./paths.js");
var runtime_parse_js_1 = require("./runtime-parse.js");
var execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
var toPosixPath = function (value) { return value.replace(/\\/g, "/"); };
var formatLine = function (label, value) {
    var rich = (0, theme_js_1.isRich)();
    return "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "".concat(label, ":")), " ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.command, value));
};
function resolveLaunchAgentLabel(args) {
    var _a, _b, _c;
    var envLabel = (_b = (_a = args === null || args === void 0 ? void 0 : args.env) === null || _a === void 0 ? void 0 : _a.OPENCLAW_LAUNCHD_LABEL) === null || _b === void 0 ? void 0 : _b.trim();
    if (envLabel) {
        return envLabel;
    }
    return (0, constants_js_1.resolveGatewayLaunchAgentLabel)((_c = args === null || args === void 0 ? void 0 : args.env) === null || _c === void 0 ? void 0 : _c.OPENCLAW_PROFILE);
}
function resolveLaunchAgentPlistPathForLabel(env, label) {
    var home = toPosixPath((0, paths_js_1.resolveHomeDir)(env));
    return node_path_1.default.posix.join(home, "Library", "LaunchAgents", "".concat(label, ".plist"));
}
function resolveLaunchAgentPlistPath(env) {
    var label = resolveLaunchAgentLabel({ env: env });
    return resolveLaunchAgentPlistPathForLabel(env, label);
}
function resolveGatewayLogPaths(env) {
    var _a;
    var stateDir = (0, paths_js_1.resolveGatewayStateDir)(env);
    var logDir = node_path_1.default.join(stateDir, "logs");
    var prefix = ((_a = env.OPENCLAW_LOG_PREFIX) === null || _a === void 0 ? void 0 : _a.trim()) || "gateway";
    return {
        logDir: logDir,
        stdoutPath: node_path_1.default.join(logDir, "".concat(prefix, ".log")),
        stderrPath: node_path_1.default.join(logDir, "".concat(prefix, ".err.log")),
    };
}
function readLaunchAgentProgramArguments(env) {
    return __awaiter(this, void 0, void 0, function () {
        var plistPath;
        return __generator(this, function (_a) {
            plistPath = resolveLaunchAgentPlistPath(env);
            return [2 /*return*/, (0, launchd_plist_js_1.readLaunchAgentProgramArgumentsFromFile)(plistPath)];
        });
    });
}
function buildLaunchAgentPlist(_a) {
    var _b = _a.label, label = _b === void 0 ? constants_js_1.GATEWAY_LAUNCH_AGENT_LABEL : _b, comment = _a.comment, programArguments = _a.programArguments, workingDirectory = _a.workingDirectory, stdoutPath = _a.stdoutPath, stderrPath = _a.stderrPath, environment = _a.environment;
    return (0, launchd_plist_js_1.buildLaunchAgentPlist)({
        label: label,
        comment: comment,
        programArguments: programArguments,
        workingDirectory: workingDirectory,
        stdoutPath: stdoutPath,
        stderrPath: stderrPath,
        environment: environment,
    });
}
function execLaunchctl(args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, stdout, stderr, error_1, e;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, execFileAsync("launchctl", args, {
                            encoding: "utf8",
                            shell: process.platform === "win32",
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
function resolveGuiDomain() {
    if (typeof process.getuid !== "function") {
        return "gui/501";
    }
    return "gui/".concat(process.getuid());
}
function parseLaunchctlPrint(output) {
    var entries = (0, runtime_parse_js_1.parseKeyValueOutput)(output, "=");
    var info = {};
    var state = entries.state;
    if (state) {
        info.state = state;
    }
    var pidValue = entries.pid;
    if (pidValue) {
        var pid = Number.parseInt(pidValue, 10);
        if (Number.isFinite(pid)) {
            info.pid = pid;
        }
    }
    var exitStatusValue = entries["last exit status"];
    if (exitStatusValue) {
        var status_1 = Number.parseInt(exitStatusValue, 10);
        if (Number.isFinite(status_1)) {
            info.lastExitStatus = status_1;
        }
    }
    var exitReason = entries["last exit reason"];
    if (exitReason) {
        info.lastExitReason = exitReason;
    }
    return info;
}
function isLaunchAgentLoaded(args) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, label, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    domain = resolveGuiDomain();
                    label = resolveLaunchAgentLabel({ env: args.env });
                    return [4 /*yield*/, execLaunchctl(["print", "".concat(domain, "/").concat(label)])];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.code === 0];
            }
        });
    });
}
function isLaunchAgentListed(args) {
    return __awaiter(this, void 0, void 0, function () {
        var label, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    label = resolveLaunchAgentLabel({ env: args.env });
                    return [4 /*yield*/, execLaunchctl(["list"])];
                case 1:
                    res = _a.sent();
                    if (res.code !== 0) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, res.stdout.split(/\r?\n/).some(function (line) { return line.trim().split(/\s+/).at(-1) === label; })];
            }
        });
    });
}
function launchAgentPlistExists(env) {
    return __awaiter(this, void 0, void 0, function () {
        var plistPath, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    plistPath = resolveLaunchAgentPlistPath(env);
                    return [4 /*yield*/, promises_1.default.access(plistPath)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function readLaunchAgentRuntime(env) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, label, res, parsed, plistExists, state, status;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    domain = resolveGuiDomain();
                    label = resolveLaunchAgentLabel({ env: env });
                    return [4 /*yield*/, execLaunchctl(["print", "".concat(domain, "/").concat(label)])];
                case 1:
                    res = _b.sent();
                    if (res.code !== 0) {
                        return [2 /*return*/, {
                                status: "unknown",
                                detail: (res.stderr || res.stdout).trim() || undefined,
                                missingUnit: true,
                            }];
                    }
                    parsed = parseLaunchctlPrint(res.stdout || res.stderr || "");
                    return [4 /*yield*/, launchAgentPlistExists(env)];
                case 2:
                    plistExists = _b.sent();
                    state = (_a = parsed.state) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    status = state === "running" || parsed.pid ? "running" : state ? "stopped" : "unknown";
                    return [2 /*return*/, {
                            status: status,
                            state: parsed.state,
                            pid: parsed.pid,
                            lastExitStatus: parsed.lastExitStatus,
                            lastExitReason: parsed.lastExitReason,
                            cachedLabel: !plistExists,
                        }];
            }
        });
    });
}
function repairLaunchAgentBootstrap(args) {
    return __awaiter(this, void 0, void 0, function () {
        var env, domain, label, plistPath, boot, kick;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    env = (_a = args.env) !== null && _a !== void 0 ? _a : process.env;
                    domain = resolveGuiDomain();
                    label = resolveLaunchAgentLabel({ env: env });
                    plistPath = resolveLaunchAgentPlistPath(env);
                    return [4 /*yield*/, execLaunchctl(["bootstrap", domain, plistPath])];
                case 1:
                    boot = _b.sent();
                    if (boot.code !== 0) {
                        return [2 /*return*/, { ok: false, detail: (boot.stderr || boot.stdout).trim() || undefined }];
                    }
                    return [4 /*yield*/, execLaunchctl(["kickstart", "-k", "".concat(domain, "/").concat(label)])];
                case 2:
                    kick = _b.sent();
                    if (kick.code !== 0) {
                        return [2 /*return*/, { ok: false, detail: (kick.stderr || kick.stdout).trim() || undefined }];
                    }
                    return [2 /*return*/, { ok: true }];
            }
        });
    });
}
function findLegacyLaunchAgents(env) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, results, _i, _a, label, plistPath, res, loaded, exists, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    domain = resolveGuiDomain();
                    results = [];
                    _i = 0, _a = (0, constants_js_1.resolveLegacyGatewayLaunchAgentLabels)(env.OPENCLAW_PROFILE);
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    label = _a[_i];
                    plistPath = resolveLaunchAgentPlistPathForLabel(env, label);
                    return [4 /*yield*/, execLaunchctl(["print", "".concat(domain, "/").concat(label)])];
                case 2:
                    res = _c.sent();
                    loaded = res.code === 0;
                    exists = false;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.access(plistPath)];
                case 4:
                    _c.sent();
                    exists = true;
                    return [3 /*break*/, 6];
                case 5:
                    _b = _c.sent();
                    return [3 /*break*/, 6];
                case 6:
                    if (loaded || exists) {
                        results.push({ label: label, plistPath: plistPath, loaded: loaded, exists: exists });
                    }
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, results];
            }
        });
    });
}
function uninstallLegacyLaunchAgents(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var domain, agents, home, trashDir, _c, _i, agents_1, agent, _d, dest, _e;
        var env = _b.env, stdout = _b.stdout;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    domain = resolveGuiDomain();
                    return [4 /*yield*/, findLegacyLaunchAgents(env)];
                case 1:
                    agents = _f.sent();
                    if (agents.length === 0) {
                        return [2 /*return*/, agents];
                    }
                    home = (0, paths_js_1.resolveHomeDir)(env);
                    trashDir = node_path_1.default.join(home, ".Trash");
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.mkdir(trashDir, { recursive: true })];
                case 3:
                    _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = _f.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _i = 0, agents_1 = agents;
                    _f.label = 6;
                case 6:
                    if (!(_i < agents_1.length)) return [3 /*break*/, 17];
                    agent = agents_1[_i];
                    return [4 /*yield*/, execLaunchctl(["bootout", domain, agent.plistPath])];
                case 7:
                    _f.sent();
                    return [4 /*yield*/, execLaunchctl(["unload", agent.plistPath])];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9:
                    _f.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, promises_1.default.access(agent.plistPath)];
                case 10:
                    _f.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _d = _f.sent();
                    return [3 /*break*/, 16];
                case 12:
                    dest = node_path_1.default.join(trashDir, "".concat(agent.label, ".plist"));
                    _f.label = 13;
                case 13:
                    _f.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, promises_1.default.rename(agent.plistPath, dest)];
                case 14:
                    _f.sent();
                    stdout.write("".concat(formatLine("Moved legacy LaunchAgent to Trash", dest), "\n"));
                    return [3 /*break*/, 16];
                case 15:
                    _e = _f.sent();
                    stdout.write("Legacy LaunchAgent remains at ".concat(agent.plistPath, " (could not move)\n"));
                    return [3 /*break*/, 16];
                case 16:
                    _i++;
                    return [3 /*break*/, 6];
                case 17: return [2 /*return*/, agents];
            }
        });
    });
}
function uninstallLaunchAgent(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var domain, label, plistPath, _c, home, trashDir, dest, _d;
        var env = _b.env, stdout = _b.stdout;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    domain = resolveGuiDomain();
                    label = resolveLaunchAgentLabel({ env: env });
                    plistPath = resolveLaunchAgentPlistPath(env);
                    return [4 /*yield*/, execLaunchctl(["bootout", domain, plistPath])];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, execLaunchctl(["unload", plistPath])];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.access(plistPath)];
                case 4:
                    _e.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _c = _e.sent();
                    stdout.write("LaunchAgent not found at ".concat(plistPath, "\n"));
                    return [2 /*return*/];
                case 6:
                    home = (0, paths_js_1.resolveHomeDir)(env);
                    trashDir = node_path_1.default.join(home, ".Trash");
                    dest = node_path_1.default.join(trashDir, "".concat(label, ".plist"));
                    _e.label = 7;
                case 7:
                    _e.trys.push([7, 10, , 11]);
                    return [4 /*yield*/, promises_1.default.mkdir(trashDir, { recursive: true })];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, promises_1.default.rename(plistPath, dest)];
                case 9:
                    _e.sent();
                    stdout.write("".concat(formatLine("Moved LaunchAgent to Trash", dest), "\n"));
                    return [3 /*break*/, 11];
                case 10:
                    _d = _e.sent();
                    stdout.write("LaunchAgent remains at ".concat(plistPath, " (could not move)\n"));
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function isLaunchctlNotLoaded(res) {
    var detail = (res.stderr || res.stdout).toLowerCase();
    return (detail.includes("no such process") ||
        detail.includes("could not find service") ||
        detail.includes("not found"));
}
function stopLaunchAgent(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var domain, label, res;
        var stdout = _b.stdout, env = _b.env;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    domain = resolveGuiDomain();
                    label = resolveLaunchAgentLabel({ env: env });
                    return [4 /*yield*/, execLaunchctl(["bootout", "".concat(domain, "/").concat(label)])];
                case 1:
                    res = _c.sent();
                    if (res.code !== 0 && !isLaunchctlNotLoaded(res)) {
                        throw new Error("launchctl bootout failed: ".concat(res.stderr || res.stdout).trim());
                    }
                    stdout.write("".concat(formatLine("Stopped LaunchAgent", "".concat(domain, "/").concat(label)), "\n"));
                    return [2 /*return*/];
            }
        });
    });
}
function installLaunchAgent(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, logDir, stdoutPath, stderrPath, domain, label, _i, _d, legacyLabel, legacyPlistPath, _e, plistPath, serviceDescription, plist, boot;
        var _f;
        var env = _b.env, stdout = _b.stdout, programArguments = _b.programArguments, workingDirectory = _b.workingDirectory, environment = _b.environment, description = _b.description;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _c = resolveGatewayLogPaths(env), logDir = _c.logDir, stdoutPath = _c.stdoutPath, stderrPath = _c.stderrPath;
                    return [4 /*yield*/, promises_1.default.mkdir(logDir, { recursive: true })];
                case 1:
                    _g.sent();
                    domain = resolveGuiDomain();
                    label = resolveLaunchAgentLabel({ env: env });
                    _i = 0, _d = (0, constants_js_1.resolveLegacyGatewayLaunchAgentLabels)(env.OPENCLAW_PROFILE);
                    _g.label = 2;
                case 2:
                    if (!(_i < _d.length)) return [3 /*break*/, 9];
                    legacyLabel = _d[_i];
                    legacyPlistPath = resolveLaunchAgentPlistPathForLabel(env, legacyLabel);
                    return [4 /*yield*/, execLaunchctl(["bootout", domain, legacyPlistPath])];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, execLaunchctl(["unload", legacyPlistPath])];
                case 4:
                    _g.sent();
                    _g.label = 5;
                case 5:
                    _g.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, promises_1.default.unlink(legacyPlistPath)];
                case 6:
                    _g.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _e = _g.sent();
                    return [3 /*break*/, 8];
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9:
                    plistPath = resolveLaunchAgentPlistPathForLabel(env, label);
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(plistPath), { recursive: true })];
                case 10:
                    _g.sent();
                    serviceDescription = description !== null && description !== void 0 ? description : (0, constants_js_1.formatGatewayServiceDescription)({
                        profile: env.OPENCLAW_PROFILE,
                        version: (_f = environment === null || environment === void 0 ? void 0 : environment.OPENCLAW_SERVICE_VERSION) !== null && _f !== void 0 ? _f : env.OPENCLAW_SERVICE_VERSION,
                    });
                    plist = buildLaunchAgentPlist({
                        label: label,
                        comment: serviceDescription,
                        programArguments: programArguments,
                        workingDirectory: workingDirectory,
                        stdoutPath: stdoutPath,
                        stderrPath: stderrPath,
                        environment: environment,
                    });
                    return [4 /*yield*/, promises_1.default.writeFile(plistPath, plist, "utf8")];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, execLaunchctl(["bootout", domain, plistPath])];
                case 12:
                    _g.sent();
                    return [4 /*yield*/, execLaunchctl(["unload", plistPath])];
                case 13:
                    _g.sent();
                    // launchd can persist "disabled" state even after bootout + plist removal; clear it before bootstrap.
                    return [4 /*yield*/, execLaunchctl(["enable", "".concat(domain, "/").concat(label)])];
                case 14:
                    // launchd can persist "disabled" state even after bootout + plist removal; clear it before bootstrap.
                    _g.sent();
                    return [4 /*yield*/, execLaunchctl(["bootstrap", domain, plistPath])];
                case 15:
                    boot = _g.sent();
                    if (boot.code !== 0) {
                        throw new Error("launchctl bootstrap failed: ".concat(boot.stderr || boot.stdout).trim());
                    }
                    return [4 /*yield*/, execLaunchctl(["kickstart", "-k", "".concat(domain, "/").concat(label)])];
                case 16:
                    _g.sent();
                    // Ensure we don't end up writing to a clack spinner line (wizards show progress without a newline).
                    stdout.write("\n");
                    stdout.write("".concat(formatLine("Installed LaunchAgent", plistPath), "\n"));
                    stdout.write("".concat(formatLine("Logs", stdoutPath), "\n"));
                    return [2 /*return*/, { plistPath: plistPath }];
            }
        });
    });
}
function restartLaunchAgent(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var domain, label, res;
        var stdout = _b.stdout, env = _b.env;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    domain = resolveGuiDomain();
                    label = resolveLaunchAgentLabel({ env: env });
                    return [4 /*yield*/, execLaunchctl(["kickstart", "-k", "".concat(domain, "/").concat(label)])];
                case 1:
                    res = _c.sent();
                    if (res.code !== 0) {
                        throw new Error("launchctl kickstart failed: ".concat(res.stderr || res.stdout).trim());
                    }
                    stdout.write("".concat(formatLine("Restarted LaunchAgent", "".concat(domain, "/").concat(label)), "\n"));
                    return [2 /*return*/];
            }
        });
    });
}
