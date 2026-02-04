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
exports.renderGatewayServiceCleanupHints = renderGatewayServiceCleanupHints;
exports.findExtraGatewayServices = findExtraGatewayServices;
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var constants_js_1 = require("./constants.js");
var EXTRA_MARKERS = ["openclaw", "clawdbot", "moltbot"];
var execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
function renderGatewayServiceCleanupHints(env) {
    if (env === void 0) { env = process.env; }
    var profile = env.OPENCLAW_PROFILE;
    switch (process.platform) {
        case "darwin": {
            var label = (0, constants_js_1.resolveGatewayLaunchAgentLabel)(profile);
            return ["launchctl bootout gui/$UID/".concat(label), "rm ~/Library/LaunchAgents/".concat(label, ".plist")];
        }
        case "linux": {
            var unit = (0, constants_js_1.resolveGatewaySystemdServiceName)(profile);
            return [
                "systemctl --user disable --now ".concat(unit, ".service"),
                "rm ~/.config/systemd/user/".concat(unit, ".service"),
            ];
        }
        case "win32": {
            var task = (0, constants_js_1.resolveGatewayWindowsTaskName)(profile);
            return ["schtasks /Delete /TN \"".concat(task, "\" /F")];
        }
        default:
            return [];
    }
}
function resolveHomeDir(env) {
    var _a, _b;
    var home = ((_a = env.HOME) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = env.USERPROFILE) === null || _b === void 0 ? void 0 : _b.trim());
    if (!home) {
        throw new Error("Missing HOME");
    }
    return home;
}
function detectMarker(content) {
    var lower = content.toLowerCase();
    for (var _i = 0, EXTRA_MARKERS_1 = EXTRA_MARKERS; _i < EXTRA_MARKERS_1.length; _i++) {
        var marker = EXTRA_MARKERS_1[_i];
        if (lower.includes(marker)) {
            return marker;
        }
    }
    return null;
}
function hasGatewayServiceMarker(content) {
    var lower = content.toLowerCase();
    var markerKeys = ["openclaw_service_marker"];
    var kindKeys = ["openclaw_service_kind"];
    var markerValues = [constants_js_1.GATEWAY_SERVICE_MARKER.toLowerCase()];
    var hasMarkerKey = markerKeys.some(function (key) { return lower.includes(key); });
    var hasKindKey = kindKeys.some(function (key) { return lower.includes(key); });
    var hasMarkerValue = markerValues.some(function (value) { return lower.includes(value); });
    return (hasMarkerKey &&
        hasKindKey &&
        hasMarkerValue &&
        lower.includes(constants_js_1.GATEWAY_SERVICE_KIND.toLowerCase()));
}
function isOpenClawGatewayLaunchdService(label, contents) {
    if (hasGatewayServiceMarker(contents)) {
        return true;
    }
    var lowerContents = contents.toLowerCase();
    if (!lowerContents.includes("gateway")) {
        return false;
    }
    return label.startsWith("ai.openclaw.");
}
function isOpenClawGatewaySystemdService(name, contents) {
    if (hasGatewayServiceMarker(contents)) {
        return true;
    }
    if (!name.startsWith("openclaw-gateway")) {
        return false;
    }
    return contents.toLowerCase().includes("gateway");
}
function isOpenClawGatewayTaskName(name) {
    var normalized = name.trim().toLowerCase();
    if (!normalized) {
        return false;
    }
    var defaultName = (0, constants_js_1.resolveGatewayWindowsTaskName)().toLowerCase();
    return normalized === defaultName || normalized.startsWith("openclaw gateway");
}
function tryExtractPlistLabel(contents) {
    var _a;
    var match = contents.match(/<key>Label<\/key>\s*<string>([\s\S]*?)<\/string>/i);
    if (!match) {
        return null;
    }
    return ((_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim()) || null;
}
function isIgnoredLaunchdLabel(label) {
    return label === (0, constants_js_1.resolveGatewayLaunchAgentLabel)();
}
function isIgnoredSystemdName(name) {
    return name === (0, constants_js_1.resolveGatewaySystemdServiceName)();
}
function isLegacyLabel(label) {
    var lower = label.toLowerCase();
    return lower.includes("clawdbot") || lower.includes("moltbot");
}
function scanLaunchdDir(params) {
    return __awaiter(this, void 0, void 0, function () {
        var results, entries, _a, _i, entries_1, entry, labelFromName, fullPath, contents, _b, marker, label, legacyLabel;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    results = [];
                    entries = [];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readdir(params.dir)];
                case 2:
                    entries = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _d.sent();
                    return [2 /*return*/, results];
                case 4:
                    _i = 0, entries_1 = entries;
                    _d.label = 5;
                case 5:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 11];
                    entry = entries_1[_i];
                    if (!entry.endsWith(".plist")) {
                        return [3 /*break*/, 10];
                    }
                    labelFromName = entry.replace(/\.plist$/, "");
                    if (isIgnoredLaunchdLabel(labelFromName)) {
                        return [3 /*break*/, 10];
                    }
                    fullPath = node_path_1.default.join(params.dir, entry);
                    contents = "";
                    _d.label = 6;
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, promises_1.default.readFile(fullPath, "utf8")];
                case 7:
                    contents = _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = _d.sent();
                    return [3 /*break*/, 10];
                case 9:
                    marker = detectMarker(contents);
                    label = (_c = tryExtractPlistLabel(contents)) !== null && _c !== void 0 ? _c : labelFromName;
                    if (!marker) {
                        legacyLabel = isLegacyLabel(labelFromName) || isLegacyLabel(label);
                        if (!legacyLabel) {
                            return [3 /*break*/, 10];
                        }
                        results.push({
                            platform: "darwin",
                            label: label,
                            detail: "plist: ".concat(fullPath),
                            scope: params.scope,
                            marker: isLegacyLabel(label) ? "clawdbot" : "moltbot",
                            legacy: true,
                        });
                        return [3 /*break*/, 10];
                    }
                    if (isIgnoredLaunchdLabel(label)) {
                        return [3 /*break*/, 10];
                    }
                    if (marker === "openclaw" && isOpenClawGatewayLaunchdService(label, contents)) {
                        return [3 /*break*/, 10];
                    }
                    results.push({
                        platform: "darwin",
                        label: label,
                        detail: "plist: ".concat(fullPath),
                        scope: params.scope,
                        marker: marker,
                        legacy: marker !== "openclaw" || isLegacyLabel(label),
                    });
                    _d.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 5];
                case 11: return [2 /*return*/, results];
            }
        });
    });
}
function scanSystemdDir(params) {
    return __awaiter(this, void 0, void 0, function () {
        var results, entries, _a, _i, entries_2, entry, name_1, fullPath, contents, _b, marker;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    results = [];
                    entries = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readdir(params.dir)];
                case 2:
                    entries = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    return [2 /*return*/, results];
                case 4:
                    _i = 0, entries_2 = entries;
                    _c.label = 5;
                case 5:
                    if (!(_i < entries_2.length)) return [3 /*break*/, 11];
                    entry = entries_2[_i];
                    if (!entry.endsWith(".service")) {
                        return [3 /*break*/, 10];
                    }
                    name_1 = entry.replace(/\.service$/, "");
                    if (isIgnoredSystemdName(name_1)) {
                        return [3 /*break*/, 10];
                    }
                    fullPath = node_path_1.default.join(params.dir, entry);
                    contents = "";
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, promises_1.default.readFile(fullPath, "utf8")];
                case 7:
                    contents = _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = _c.sent();
                    return [3 /*break*/, 10];
                case 9:
                    marker = detectMarker(contents);
                    if (!marker) {
                        return [3 /*break*/, 10];
                    }
                    if (marker === "openclaw" && isOpenClawGatewaySystemdService(name_1, contents)) {
                        return [3 /*break*/, 10];
                    }
                    results.push({
                        platform: "linux",
                        label: entry,
                        detail: "unit: ".concat(fullPath),
                        scope: params.scope,
                        marker: marker,
                        legacy: marker !== "openclaw",
                    });
                    _c.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 5];
                case 11: return [2 /*return*/, results];
            }
        });
    });
}
function parseSchtasksList(output) {
    var tasks = [];
    var current = null;
    for (var _i = 0, _a = output.split(/\r?\n/); _i < _a.length; _i++) {
        var rawLine = _a[_i];
        var line = rawLine.trim();
        if (!line) {
            if (current) {
                tasks.push(current);
                current = null;
            }
            continue;
        }
        var idx = line.indexOf(":");
        if (idx <= 0) {
            continue;
        }
        var key = line.slice(0, idx).trim().toLowerCase();
        var value = line.slice(idx + 1).trim();
        if (!value) {
            continue;
        }
        if (key === "taskname") {
            if (current) {
                tasks.push(current);
            }
            current = { name: value };
            continue;
        }
        if (!current) {
            continue;
        }
        if (key === "task to run") {
            current.taskToRun = value;
        }
    }
    if (current) {
        tasks.push(current);
    }
    return tasks;
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
function findExtraGatewayServices(env_1) {
    return __awaiter(this, arguments, void 0, function (env, opts) {
        var results, seen, push, home, userDir, _i, _a, svc, _b, _c, svc, _d, _e, svc, _f, home, userDir, _g, _h, svc, _j, _k, dir, _l, _m, svc, _o, res, tasks, _p, tasks_1, task, name_2, lowerName, lowerCommand, marker, _q, EXTRA_MARKERS_2, candidate;
        var _r, _s;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    results = [];
                    seen = new Set();
                    push = function (svc) {
                        var key = "".concat(svc.platform, ":").concat(svc.label, ":").concat(svc.detail, ":").concat(svc.scope);
                        if (seen.has(key)) {
                            return;
                        }
                        seen.add(key);
                        results.push(svc);
                    };
                    if (!(process.platform === "darwin")) return [3 /*break*/, 16];
                    _t.label = 1;
                case 1:
                    _t.trys.push([1, 14, , 15]);
                    home = resolveHomeDir(env);
                    userDir = node_path_1.default.join(home, "Library", "LaunchAgents");
                    _i = 0;
                    return [4 /*yield*/, scanLaunchdDir({
                            dir: userDir,
                            scope: "user",
                        })];
                case 2:
                    _a = _t.sent();
                    _t.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    svc = _a[_i];
                    push(svc);
                    _t.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 3];
                case 5:
                    if (!opts.deep) return [3 /*break*/, 13];
                    _b = 0;
                    return [4 /*yield*/, scanLaunchdDir({
                            dir: node_path_1.default.join(node_path_1.default.sep, "Library", "LaunchAgents"),
                            scope: "system",
                        })];
                case 6:
                    _c = _t.sent();
                    _t.label = 7;
                case 7:
                    if (!(_b < _c.length)) return [3 /*break*/, 9];
                    svc = _c[_b];
                    push(svc);
                    _t.label = 8;
                case 8:
                    _b++;
                    return [3 /*break*/, 7];
                case 9:
                    _d = 0;
                    return [4 /*yield*/, scanLaunchdDir({
                            dir: node_path_1.default.join(node_path_1.default.sep, "Library", "LaunchDaemons"),
                            scope: "system",
                        })];
                case 10:
                    _e = _t.sent();
                    _t.label = 11;
                case 11:
                    if (!(_d < _e.length)) return [3 /*break*/, 13];
                    svc = _e[_d];
                    push(svc);
                    _t.label = 12;
                case 12:
                    _d++;
                    return [3 /*break*/, 11];
                case 13: return [3 /*break*/, 15];
                case 14:
                    _f = _t.sent();
                    return [2 /*return*/, results];
                case 15: return [2 /*return*/, results];
                case 16:
                    if (!(process.platform === "linux")) return [3 /*break*/, 30];
                    _t.label = 17;
                case 17:
                    _t.trys.push([17, 28, , 29]);
                    home = resolveHomeDir(env);
                    userDir = node_path_1.default.join(home, ".config", "systemd", "user");
                    _g = 0;
                    return [4 /*yield*/, scanSystemdDir({
                            dir: userDir,
                            scope: "user",
                        })];
                case 18:
                    _h = _t.sent();
                    _t.label = 19;
                case 19:
                    if (!(_g < _h.length)) return [3 /*break*/, 21];
                    svc = _h[_g];
                    push(svc);
                    _t.label = 20;
                case 20:
                    _g++;
                    return [3 /*break*/, 19];
                case 21:
                    if (!opts.deep) return [3 /*break*/, 27];
                    _j = 0, _k = [
                        "/etc/systemd/system",
                        "/usr/lib/systemd/system",
                        "/lib/systemd/system",
                    ];
                    _t.label = 22;
                case 22:
                    if (!(_j < _k.length)) return [3 /*break*/, 27];
                    dir = _k[_j];
                    _l = 0;
                    return [4 /*yield*/, scanSystemdDir({
                            dir: dir,
                            scope: "system",
                        })];
                case 23:
                    _m = _t.sent();
                    _t.label = 24;
                case 24:
                    if (!(_l < _m.length)) return [3 /*break*/, 26];
                    svc = _m[_l];
                    push(svc);
                    _t.label = 25;
                case 25:
                    _l++;
                    return [3 /*break*/, 24];
                case 26:
                    _j++;
                    return [3 /*break*/, 22];
                case 27: return [3 /*break*/, 29];
                case 28:
                    _o = _t.sent();
                    return [2 /*return*/, results];
                case 29: return [2 /*return*/, results];
                case 30:
                    if (!(process.platform === "win32")) return [3 /*break*/, 32];
                    if (!opts.deep) {
                        return [2 /*return*/, results];
                    }
                    return [4 /*yield*/, execSchtasks(["/Query", "/FO", "LIST", "/V"])];
                case 31:
                    res = _t.sent();
                    if (res.code !== 0) {
                        return [2 /*return*/, results];
                    }
                    tasks = parseSchtasksList(res.stdout);
                    for (_p = 0, tasks_1 = tasks; _p < tasks_1.length; _p++) {
                        task = tasks_1[_p];
                        name_2 = task.name.trim();
                        if (!name_2) {
                            continue;
                        }
                        if (isOpenClawGatewayTaskName(name_2)) {
                            continue;
                        }
                        lowerName = name_2.toLowerCase();
                        lowerCommand = (_s = (_r = task.taskToRun) === null || _r === void 0 ? void 0 : _r.toLowerCase()) !== null && _s !== void 0 ? _s : "";
                        marker = null;
                        for (_q = 0, EXTRA_MARKERS_2 = EXTRA_MARKERS; _q < EXTRA_MARKERS_2.length; _q++) {
                            candidate = EXTRA_MARKERS_2[_q];
                            if (lowerName.includes(candidate) || lowerCommand.includes(candidate)) {
                                marker = candidate;
                                break;
                            }
                        }
                        if (!marker) {
                            continue;
                        }
                        push({
                            platform: "win32",
                            label: name_2,
                            detail: task.taskToRun ? "task: ".concat(name_2, ", run: ").concat(task.taskToRun) : name_2,
                            scope: "system",
                            marker: marker,
                            legacy: marker !== "openclaw",
                        });
                    }
                    return [2 /*return*/, results];
                case 32: return [2 /*return*/, results];
            }
        });
    });
}
