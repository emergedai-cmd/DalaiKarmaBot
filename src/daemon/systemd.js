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
exports.readSystemdUserLingerStatus = exports.enableSystemdUserLinger = void 0;
exports.resolveSystemdUserUnitPath = resolveSystemdUserUnitPath;
exports.readSystemdServiceExecStart = readSystemdServiceExecStart;
exports.parseSystemdShow = parseSystemdShow;
exports.isSystemdUserServiceAvailable = isSystemdUserServiceAvailable;
exports.installSystemdService = installSystemdService;
exports.uninstallSystemdService = uninstallSystemdService;
exports.stopSystemdService = stopSystemdService;
exports.restartSystemdService = restartSystemdService;
exports.isSystemdServiceEnabled = isSystemdServiceEnabled;
exports.readSystemdServiceRuntime = readSystemdServiceRuntime;
exports.findLegacySystemdUnits = findLegacySystemdUnits;
exports.uninstallLegacySystemdUnits = uninstallLegacySystemdUnits;
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var theme_js_1 = require("../terminal/theme.js");
var constants_js_1 = require("./constants.js");
var paths_js_1 = require("./paths.js");
var runtime_parse_js_1 = require("./runtime-parse.js");
var systemd_linger_js_1 = require("./systemd-linger.js");
Object.defineProperty(exports, "enableSystemdUserLinger", { enumerable: true, get: function () { return systemd_linger_js_1.enableSystemdUserLinger; } });
Object.defineProperty(exports, "readSystemdUserLingerStatus", { enumerable: true, get: function () { return systemd_linger_js_1.readSystemdUserLingerStatus; } });
var systemd_unit_js_1 = require("./systemd-unit.js");
var execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
var toPosixPath = function (value) { return value.replace(/\\/g, "/"); };
var formatLine = function (label, value) {
    var rich = (0, theme_js_1.isRich)();
    return "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "".concat(label, ":")), " ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.command, value));
};
function resolveSystemdUnitPathForName(env, name) {
    var home = toPosixPath((0, paths_js_1.resolveHomeDir)(env));
    return node_path_1.default.posix.join(home, ".config", "systemd", "user", "".concat(name, ".service"));
}
function resolveSystemdServiceName(env) {
    var _a;
    var override = (_a = env.OPENCLAW_SYSTEMD_UNIT) === null || _a === void 0 ? void 0 : _a.trim();
    if (override) {
        return override.endsWith(".service") ? override.slice(0, -".service".length) : override;
    }
    return (0, constants_js_1.resolveGatewaySystemdServiceName)(env.OPENCLAW_PROFILE);
}
function resolveSystemdUnitPath(env) {
    return resolveSystemdUnitPathForName(env, resolveSystemdServiceName(env));
}
function resolveSystemdUserUnitPath(env) {
    return resolveSystemdUnitPath(env);
}
// Unit file parsing/rendering: see systemd-unit.ts
function readSystemdServiceExecStart(env) {
    return __awaiter(this, void 0, void 0, function () {
        var unitPath, content, execStart, workingDirectory, environment, _i, _a, rawLine, line, raw, parsed, programArguments, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    unitPath = resolveSystemdUnitPath(env);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readFile(unitPath, "utf8")];
                case 2:
                    content = _c.sent();
                    execStart = "";
                    workingDirectory = "";
                    environment = {};
                    for (_i = 0, _a = content.split("\n"); _i < _a.length; _i++) {
                        rawLine = _a[_i];
                        line = rawLine.trim();
                        if (!line || line.startsWith("#")) {
                            continue;
                        }
                        if (line.startsWith("ExecStart=")) {
                            execStart = line.slice("ExecStart=".length).trim();
                        }
                        else if (line.startsWith("WorkingDirectory=")) {
                            workingDirectory = line.slice("WorkingDirectory=".length).trim();
                        }
                        else if (line.startsWith("Environment=")) {
                            raw = line.slice("Environment=".length).trim();
                            parsed = (0, systemd_unit_js_1.parseSystemdEnvAssignment)(raw);
                            if (parsed) {
                                environment[parsed.key] = parsed.value;
                            }
                        }
                    }
                    if (!execStart) {
                        return [2 /*return*/, null];
                    }
                    programArguments = (0, systemd_unit_js_1.parseSystemdExecStart)(execStart);
                    return [2 /*return*/, __assign(__assign(__assign({ programArguments: programArguments }, (workingDirectory ? { workingDirectory: workingDirectory } : {})), (Object.keys(environment).length > 0 ? { environment: environment } : {})), { sourcePath: unitPath })];
                case 3:
                    _b = _c.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function parseSystemdShow(output) {
    var entries = (0, runtime_parse_js_1.parseKeyValueOutput)(output, "=");
    var info = {};
    var activeState = entries.activestate;
    if (activeState) {
        info.activeState = activeState;
    }
    var subState = entries.substate;
    if (subState) {
        info.subState = subState;
    }
    var mainPidValue = entries.mainpid;
    if (mainPidValue) {
        var pid = Number.parseInt(mainPidValue, 10);
        if (Number.isFinite(pid) && pid > 0) {
            info.mainPid = pid;
        }
    }
    var execMainStatusValue = entries.execmainstatus;
    if (execMainStatusValue) {
        var status_1 = Number.parseInt(execMainStatusValue, 10);
        if (Number.isFinite(status_1)) {
            info.execMainStatus = status_1;
        }
    }
    var execMainCode = entries.execmaincode;
    if (execMainCode) {
        info.execMainCode = execMainCode;
    }
    return info;
}
function execSystemctl(args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, stdout, stderr, error_1, e;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, execFileAsync("systemctl", args, {
                            encoding: "utf8",
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
function isSystemdUserServiceAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        var res, detail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execSystemctl(["--user", "status"])];
                case 1:
                    res = _a.sent();
                    if (res.code === 0) {
                        return [2 /*return*/, true];
                    }
                    detail = "".concat(res.stderr, " ").concat(res.stdout).toLowerCase();
                    if (!detail) {
                        return [2 /*return*/, false];
                    }
                    if (detail.includes("not found")) {
                        return [2 /*return*/, false];
                    }
                    if (detail.includes("failed to connect")) {
                        return [2 /*return*/, false];
                    }
                    if (detail.includes("not been booted")) {
                        return [2 /*return*/, false];
                    }
                    if (detail.includes("no such file or directory")) {
                        return [2 /*return*/, false];
                    }
                    if (detail.includes("not supported")) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
function assertSystemdAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        var res, detail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execSystemctl(["--user", "status"])];
                case 1:
                    res = _a.sent();
                    if (res.code === 0) {
                        return [2 /*return*/];
                    }
                    detail = res.stderr || res.stdout;
                    if (detail.toLowerCase().includes("not found")) {
                        throw new Error("systemctl not available; systemd user services are required on Linux.");
                    }
                    throw new Error("systemctl --user unavailable: ".concat(detail || "unknown error").trim());
            }
        });
    });
}
function installSystemdService(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var unitPath, serviceDescription, unit, serviceName, unitName, reload, enable, restart;
        var _c;
        var env = _b.env, stdout = _b.stdout, programArguments = _b.programArguments, workingDirectory = _b.workingDirectory, environment = _b.environment, description = _b.description;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, assertSystemdAvailable()];
                case 1:
                    _d.sent();
                    unitPath = resolveSystemdUnitPath(env);
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(unitPath), { recursive: true })];
                case 2:
                    _d.sent();
                    serviceDescription = description !== null && description !== void 0 ? description : (0, constants_js_1.formatGatewayServiceDescription)({
                        profile: env.OPENCLAW_PROFILE,
                        version: (_c = environment === null || environment === void 0 ? void 0 : environment.OPENCLAW_SERVICE_VERSION) !== null && _c !== void 0 ? _c : env.OPENCLAW_SERVICE_VERSION,
                    });
                    unit = (0, systemd_unit_js_1.buildSystemdUnit)({
                        description: serviceDescription,
                        programArguments: programArguments,
                        workingDirectory: workingDirectory,
                        environment: environment,
                    });
                    return [4 /*yield*/, promises_1.default.writeFile(unitPath, unit, "utf8")];
                case 3:
                    _d.sent();
                    serviceName = (0, constants_js_1.resolveGatewaySystemdServiceName)(env.OPENCLAW_PROFILE);
                    unitName = "".concat(serviceName, ".service");
                    return [4 /*yield*/, execSystemctl(["--user", "daemon-reload"])];
                case 4:
                    reload = _d.sent();
                    if (reload.code !== 0) {
                        throw new Error("systemctl daemon-reload failed: ".concat(reload.stderr || reload.stdout).trim());
                    }
                    return [4 /*yield*/, execSystemctl(["--user", "enable", unitName])];
                case 5:
                    enable = _d.sent();
                    if (enable.code !== 0) {
                        throw new Error("systemctl enable failed: ".concat(enable.stderr || enable.stdout).trim());
                    }
                    return [4 /*yield*/, execSystemctl(["--user", "restart", unitName])];
                case 6:
                    restart = _d.sent();
                    if (restart.code !== 0) {
                        throw new Error("systemctl restart failed: ".concat(restart.stderr || restart.stdout).trim());
                    }
                    // Ensure we don't end up writing to a clack spinner line (wizards show progress without a newline).
                    stdout.write("\n");
                    stdout.write("".concat(formatLine("Installed systemd service", unitPath), "\n"));
                    return [2 /*return*/, { unitPath: unitPath }];
            }
        });
    });
}
function uninstallSystemdService(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var serviceName, unitName, unitPath, _c;
        var env = _b.env, stdout = _b.stdout;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, assertSystemdAvailable()];
                case 1:
                    _d.sent();
                    serviceName = (0, constants_js_1.resolveGatewaySystemdServiceName)(env.OPENCLAW_PROFILE);
                    unitName = "".concat(serviceName, ".service");
                    return [4 /*yield*/, execSystemctl(["--user", "disable", "--now", unitName])];
                case 2:
                    _d.sent();
                    unitPath = resolveSystemdUnitPath(env);
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.unlink(unitPath)];
                case 4:
                    _d.sent();
                    stdout.write("".concat(formatLine("Removed systemd service", unitPath), "\n"));
                    return [3 /*break*/, 6];
                case 5:
                    _c = _d.sent();
                    stdout.write("Systemd service not found at ".concat(unitPath, "\n"));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function stopSystemdService(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var serviceName, unitName, res;
        var stdout = _b.stdout, env = _b.env;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, assertSystemdAvailable()];
                case 1:
                    _c.sent();
                    serviceName = resolveSystemdServiceName(env !== null && env !== void 0 ? env : {});
                    unitName = "".concat(serviceName, ".service");
                    return [4 /*yield*/, execSystemctl(["--user", "stop", unitName])];
                case 2:
                    res = _c.sent();
                    if (res.code !== 0) {
                        throw new Error("systemctl stop failed: ".concat(res.stderr || res.stdout).trim());
                    }
                    stdout.write("".concat(formatLine("Stopped systemd service", unitName), "\n"));
                    return [2 /*return*/];
            }
        });
    });
}
function restartSystemdService(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var serviceName, unitName, res;
        var stdout = _b.stdout, env = _b.env;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, assertSystemdAvailable()];
                case 1:
                    _c.sent();
                    serviceName = resolveSystemdServiceName(env !== null && env !== void 0 ? env : {});
                    unitName = "".concat(serviceName, ".service");
                    return [4 /*yield*/, execSystemctl(["--user", "restart", unitName])];
                case 2:
                    res = _c.sent();
                    if (res.code !== 0) {
                        throw new Error("systemctl restart failed: ".concat(res.stderr || res.stdout).trim());
                    }
                    stdout.write("".concat(formatLine("Restarted systemd service", unitName), "\n"));
                    return [2 /*return*/];
            }
        });
    });
}
function isSystemdServiceEnabled(args) {
    return __awaiter(this, void 0, void 0, function () {
        var serviceName, unitName, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, assertSystemdAvailable()];
                case 1:
                    _b.sent();
                    serviceName = resolveSystemdServiceName((_a = args.env) !== null && _a !== void 0 ? _a : {});
                    unitName = "".concat(serviceName, ".service");
                    return [4 /*yield*/, execSystemctl(["--user", "is-enabled", unitName])];
                case 2:
                    res = _b.sent();
                    return [2 /*return*/, res.code === 0];
            }
        });
    });
}
function readSystemdServiceRuntime() {
    return __awaiter(this, arguments, void 0, function (env) {
        var err_1, serviceName, unitName, res, detail, missing, parsed, activeState, status;
        var _a;
        if (env === void 0) { env = process.env; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, assertSystemdAvailable()];
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
                    serviceName = resolveSystemdServiceName(env);
                    unitName = "".concat(serviceName, ".service");
                    return [4 /*yield*/, execSystemctl([
                            "--user",
                            "show",
                            unitName,
                            "--no-page",
                            "--property",
                            "ActiveState,SubState,MainPID,ExecMainStatus,ExecMainCode",
                        ])];
                case 4:
                    res = _b.sent();
                    if (res.code !== 0) {
                        detail = (res.stderr || res.stdout).trim();
                        missing = detail.toLowerCase().includes("not found");
                        return [2 /*return*/, {
                                status: missing ? "stopped" : "unknown",
                                detail: detail || undefined,
                                missingUnit: missing,
                            }];
                    }
                    parsed = parseSystemdShow(res.stdout || "");
                    activeState = (_a = parsed.activeState) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    status = activeState === "active" ? "running" : activeState ? "stopped" : "unknown";
                    return [2 /*return*/, {
                            status: status,
                            state: parsed.activeState,
                            subState: parsed.subState,
                            pid: parsed.mainPid,
                            lastExitStatus: parsed.execMainStatus,
                            lastExitReason: parsed.execMainCode,
                        }];
            }
        });
    });
}
function isSystemctlAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        var res, detail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execSystemctl(["--user", "status"])];
                case 1:
                    res = _a.sent();
                    if (res.code === 0) {
                        return [2 /*return*/, true];
                    }
                    detail = (res.stderr || res.stdout).toLowerCase();
                    return [2 /*return*/, !detail.includes("not found")];
            }
        });
    });
}
function findLegacySystemdUnits(env) {
    return __awaiter(this, void 0, void 0, function () {
        var results, systemctlAvailable, _i, LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES_1, name_1, unitPath, exists, _a, enabled, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    return [4 /*yield*/, isSystemctlAvailable()];
                case 1:
                    systemctlAvailable = _b.sent();
                    _i = 0, LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES_1 = constants_js_1.LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES;
                    _b.label = 2;
                case 2:
                    if (!(_i < LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES_1.length)) return [3 /*break*/, 10];
                    name_1 = LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES_1[_i];
                    unitPath = resolveSystemdUnitPathForName(env, name_1);
                    exists = false;
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.access(unitPath)];
                case 4:
                    _b.sent();
                    exists = true;
                    return [3 /*break*/, 6];
                case 5:
                    _a = _b.sent();
                    return [3 /*break*/, 6];
                case 6:
                    enabled = false;
                    if (!systemctlAvailable) return [3 /*break*/, 8];
                    return [4 /*yield*/, execSystemctl(["--user", "is-enabled", "".concat(name_1, ".service")])];
                case 7:
                    res = _b.sent();
                    enabled = res.code === 0;
                    _b.label = 8;
                case 8:
                    if (exists || enabled) {
                        results.push({ name: name_1, unitPath: unitPath, enabled: enabled, exists: exists });
                    }
                    _b.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 2];
                case 10: return [2 /*return*/, results];
            }
        });
    });
}
function uninstallLegacySystemdUnits(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var units, systemctlAvailable, _i, units_1, unit, _c;
        var env = _b.env, stdout = _b.stdout;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, findLegacySystemdUnits(env)];
                case 1:
                    units = _d.sent();
                    if (units.length === 0) {
                        return [2 /*return*/, units];
                    }
                    return [4 /*yield*/, isSystemctlAvailable()];
                case 2:
                    systemctlAvailable = _d.sent();
                    _i = 0, units_1 = units;
                    _d.label = 3;
                case 3:
                    if (!(_i < units_1.length)) return [3 /*break*/, 10];
                    unit = units_1[_i];
                    if (!systemctlAvailable) return [3 /*break*/, 5];
                    return [4 /*yield*/, execSystemctl(["--user", "disable", "--now", "".concat(unit.name, ".service")])];
                case 4:
                    _d.sent();
                    return [3 /*break*/, 6];
                case 5:
                    stdout.write("systemctl unavailable; removed legacy unit file only: ".concat(unit.name, ".service\n"));
                    _d.label = 6;
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, promises_1.default.unlink(unit.unitPath)];
                case 7:
                    _d.sent();
                    stdout.write("".concat(formatLine("Removed legacy systemd service", unit.unitPath), "\n"));
                    return [3 /*break*/, 9];
                case 8:
                    _c = _d.sent();
                    stdout.write("Legacy systemd unit not found at ".concat(unit.unitPath, "\n"));
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10: return [2 /*return*/, units];
            }
        });
    });
}
