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
exports.noteMacLaunchAgentOverrides = noteMacLaunchAgentOverrides;
exports.noteMacLaunchctlGatewayEnvOverrides = noteMacLaunchctlGatewayEnvOverrides;
exports.noteDeprecatedLegacyEnvVars = noteDeprecatedLegacyEnvVars;
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var note_js_1 = require("../terminal/note.js");
var utils_js_1 = require("../utils.js");
var execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
function resolveHomeDir() {
    var _a;
    return (_a = process.env.HOME) !== null && _a !== void 0 ? _a : node_os_1.default.homedir();
}
function noteMacLaunchAgentOverrides() {
    return __awaiter(this, void 0, void 0, function () {
        var home, markerCandidates, markerPath, displayMarkerPath, lines;
        return __generator(this, function (_a) {
            if (process.platform !== "darwin") {
                return [2 /*return*/];
            }
            home = resolveHomeDir();
            markerCandidates = [node_path_1.default.join(home, ".openclaw", "disable-launchagent")];
            markerPath = markerCandidates.find(function (candidate) { return node_fs_1.default.existsSync(candidate); });
            if (!markerPath) {
                return [2 /*return*/];
            }
            displayMarkerPath = (0, utils_js_1.shortenHomePath)(markerPath);
            lines = [
                "- LaunchAgent writes are disabled via ".concat(displayMarkerPath, "."),
                "- To restore default behavior:",
                "  rm ".concat(displayMarkerPath),
            ].filter(function (line) { return Boolean(line); });
            (0, note_js_1.note)(lines.join("\n"), "Gateway (macOS)");
            return [2 /*return*/];
        });
    });
}
function launchctlGetenv(name) {
    return __awaiter(this, void 0, void 0, function () {
        var result, value, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, execFileAsync("/bin/launchctl", ["getenv", name], { encoding: "utf8" })];
                case 1:
                    result = _c.sent();
                    value = String((_b = result.stdout) !== null && _b !== void 0 ? _b : "").trim();
                    return [2 /*return*/, value.length > 0 ? value : undefined];
                case 2:
                    _a = _c.sent();
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function hasConfigGatewayCreds(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var localToken = typeof ((_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token) === "string" ? (_d = (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.auth) === null || _d === void 0 ? void 0 : _d.token.trim() : "";
    var localPassword = typeof ((_f = (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.auth) === null || _f === void 0 ? void 0 : _f.password) === "string" ? (_h = (_g = cfg.gateway) === null || _g === void 0 ? void 0 : _g.auth) === null || _h === void 0 ? void 0 : _h.password.trim() : "";
    var remoteToken = typeof ((_k = (_j = cfg.gateway) === null || _j === void 0 ? void 0 : _j.remote) === null || _k === void 0 ? void 0 : _k.token) === "string" ? (_m = (_l = cfg.gateway) === null || _l === void 0 ? void 0 : _l.remote) === null || _m === void 0 ? void 0 : _m.token.trim() : "";
    var remotePassword = typeof ((_p = (_o = cfg.gateway) === null || _o === void 0 ? void 0 : _o.remote) === null || _p === void 0 ? void 0 : _p.password) === "string" ? (_r = (_q = cfg.gateway) === null || _q === void 0 ? void 0 : _q.remote) === null || _r === void 0 ? void 0 : _r.password.trim() : "";
    return Boolean(localToken || localPassword || remoteToken || remotePassword);
}
function noteMacLaunchctlGatewayEnvOverrides(cfg, deps) {
    return __awaiter(this, void 0, void 0, function () {
        var platform, getenv, deprecatedLaunchctlEntries, _a, _b, _c, _d, _e, lines_1, tokenEntries, _f, passwordEntries, _g, tokenEntry, passwordEntry, envToken, envPassword, envTokenKey, envPasswordKey, lines;
        var _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    platform = (_h = deps === null || deps === void 0 ? void 0 : deps.platform) !== null && _h !== void 0 ? _h : process.platform;
                    if (platform !== "darwin") {
                        return [2 /*return*/];
                    }
                    if (!hasConfigGatewayCreds(cfg)) {
                        return [2 /*return*/];
                    }
                    getenv = (_j = deps === null || deps === void 0 ? void 0 : deps.getenv) !== null && _j !== void 0 ? _j : launchctlGetenv;
                    _a = ["MOLTBOT_GATEWAY_TOKEN"];
                    return [4 /*yield*/, getenv("MOLTBOT_GATEWAY_TOKEN")];
                case 1:
                    _b = [
                        _a.concat([_r.sent()])
                    ];
                    _c = ["MOLTBOT_GATEWAY_PASSWORD"];
                    return [4 /*yield*/, getenv("MOLTBOT_GATEWAY_PASSWORD")];
                case 2:
                    _b = _b.concat([
                        _c.concat([_r.sent()])
                    ]);
                    _d = ["CLAWDBOT_GATEWAY_TOKEN"];
                    return [4 /*yield*/, getenv("CLAWDBOT_GATEWAY_TOKEN")];
                case 3:
                    _b = _b.concat([
                        _d.concat([_r.sent()])
                    ]);
                    _e = ["CLAWDBOT_GATEWAY_PASSWORD"];
                    return [4 /*yield*/, getenv("CLAWDBOT_GATEWAY_PASSWORD")];
                case 4:
                    deprecatedLaunchctlEntries = _b.concat([
                        _e.concat([_r.sent()])
                    ]).filter(function (entry) { var _a; return Boolean((_a = entry[1]) === null || _a === void 0 ? void 0 : _a.trim()); });
                    if (deprecatedLaunchctlEntries.length > 0) {
                        lines_1 = __spreadArray([
                            "- Deprecated launchctl environment variables detected (ignored)."
                        ], deprecatedLaunchctlEntries.map(function (_a) {
                            var key = _a[0];
                            return "- `".concat(key, "` is set; use `OPENCLAW_").concat(key.slice(key.indexOf("_") + 1), "` instead.");
                        }), true);
                        ((_k = deps === null || deps === void 0 ? void 0 : deps.noteFn) !== null && _k !== void 0 ? _k : note_js_1.note)(lines_1.join("\n"), "Gateway (macOS)");
                    }
                    _f = ["OPENCLAW_GATEWAY_TOKEN"];
                    return [4 /*yield*/, getenv("OPENCLAW_GATEWAY_TOKEN")];
                case 5:
                    tokenEntries = [
                        _f.concat([_r.sent()])
                    ];
                    _g = ["OPENCLAW_GATEWAY_PASSWORD"];
                    return [4 /*yield*/, getenv("OPENCLAW_GATEWAY_PASSWORD")];
                case 6:
                    passwordEntries = [
                        _g.concat([_r.sent()])
                    ];
                    tokenEntry = tokenEntries.find(function (_a) {
                        var value = _a[1];
                        return value === null || value === void 0 ? void 0 : value.trim();
                    });
                    passwordEntry = passwordEntries.find(function (_a) {
                        var value = _a[1];
                        return value === null || value === void 0 ? void 0 : value.trim();
                    });
                    envToken = (_m = (_l = tokenEntry === null || tokenEntry === void 0 ? void 0 : tokenEntry[1]) === null || _l === void 0 ? void 0 : _l.trim()) !== null && _m !== void 0 ? _m : "";
                    envPassword = (_p = (_o = passwordEntry === null || passwordEntry === void 0 ? void 0 : passwordEntry[1]) === null || _o === void 0 ? void 0 : _o.trim()) !== null && _p !== void 0 ? _p : "";
                    envTokenKey = tokenEntry === null || tokenEntry === void 0 ? void 0 : tokenEntry[0];
                    envPasswordKey = passwordEntry === null || passwordEntry === void 0 ? void 0 : passwordEntry[0];
                    if (!envToken && !envPassword) {
                        return [2 /*return*/];
                    }
                    lines = [
                        "- launchctl environment overrides detected (can cause confusing unauthorized errors).",
                        envToken && envTokenKey
                            ? "- `".concat(envTokenKey, "` is set; it overrides config tokens.")
                            : undefined,
                        envPassword
                            ? "- `".concat(envPasswordKey !== null && envPasswordKey !== void 0 ? envPasswordKey : "OPENCLAW_GATEWAY_PASSWORD", "` is set; it overrides config passwords.")
                            : undefined,
                        "- Clear overrides and restart the app/gateway:",
                        envTokenKey ? "  launchctl unsetenv ".concat(envTokenKey) : undefined,
                        envPasswordKey ? "  launchctl unsetenv ".concat(envPasswordKey) : undefined,
                    ].filter(function (line) { return Boolean(line); });
                    ((_q = deps === null || deps === void 0 ? void 0 : deps.noteFn) !== null && _q !== void 0 ? _q : note_js_1.note)(lines.join("\n"), "Gateway (macOS)");
                    return [2 /*return*/];
            }
        });
    });
}
function noteDeprecatedLegacyEnvVars(env, deps) {
    var _a;
    if (env === void 0) { env = process.env; }
    var entries = Object.entries(env)
        .filter(function (_a) {
        var key = _a[0], value = _a[1];
        return (key.startsWith("MOLTBOT_") || key.startsWith("CLAWDBOT_")) && (value === null || value === void 0 ? void 0 : value.trim());
    })
        .map(function (_a) {
        var key = _a[0];
        return key;
    });
    if (entries.length === 0) {
        return;
    }
    var lines = __spreadArray([
        "- Deprecated legacy environment variables detected (ignored).",
        "- Use OPENCLAW_* equivalents instead:"
    ], entries.map(function (key) {
        var suffix = key.slice(key.indexOf("_") + 1);
        return "  ".concat(key, " -> OPENCLAW_").concat(suffix);
    }), true);
    ((_a = deps === null || deps === void 0 ? void 0 : deps.noteFn) !== null && _a !== void 0 ? _a : note_js_1.note)(lines.join("\n"), "Environment");
}
