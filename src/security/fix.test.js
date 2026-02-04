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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var fix_js_1 = require("./fix.js");
var isWindows = process.platform === "win32";
var expectPerms = function (actual, expected) {
    if (isWindows) {
        (0, vitest_1.expect)([expected, 438, 511]).toContain(actual);
        return;
    }
    (0, vitest_1.expect)(actual).toBe(expected);
};
(0, vitest_1.describe)("security fix", function () {
    (0, vitest_1.it)("tightens groupPolicy + filesystem perms", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, stateDir, configPath, credsDir, env, res, stateMode, configMode, parsed, _a, _b, channels;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-fix-"))];
                case 1:
                    tmp = _c.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(stateDir, { recursive: true })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.chmod(stateDir, 493)];
                case 3:
                    _c.sent();
                    configPath = node_path_1.default.join(stateDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "".concat(JSON.stringify({
                            channels: {
                                telegram: { groupPolicy: "open" },
                                whatsapp: { groupPolicy: "open" },
                                discord: { groupPolicy: "open" },
                                signal: { groupPolicy: "open" },
                                imessage: { groupPolicy: "open" },
                            },
                            logging: { redactSensitive: "off" },
                        }, null, 2), "\n"), "utf-8")];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.chmod(configPath, 420)];
                case 5:
                    _c.sent();
                    credsDir = node_path_1.default.join(stateDir, "credentials");
                    return [4 /*yield*/, promises_1.default.mkdir(credsDir, { recursive: true })];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(credsDir, "whatsapp-allowFrom.json"), "".concat(JSON.stringify({ version: 1, allowFrom: [" +15551234567 "] }, null, 2), "\n"), "utf-8")];
                case 7:
                    _c.sent();
                    env = __assign(__assign({}, process.env), { OPENCLAW_STATE_DIR: stateDir, OPENCLAW_CONFIG_PATH: "" });
                    return [4 /*yield*/, (0, fix_js_1.fixSecurityFootguns)({ env: env })];
                case 8:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(res.configWritten).toBe(true);
                    (0, vitest_1.expect)(res.changes).toEqual(vitest_1.expect.arrayContaining([
                        "channels.telegram.groupPolicy=open -> allowlist",
                        "channels.whatsapp.groupPolicy=open -> allowlist",
                        "channels.discord.groupPolicy=open -> allowlist",
                        "channels.signal.groupPolicy=open -> allowlist",
                        "channels.imessage.groupPolicy=open -> allowlist",
                        'logging.redactSensitive=off -> "tools"',
                    ]));
                    return [4 /*yield*/, promises_1.default.stat(stateDir)];
                case 9:
                    stateMode = (_c.sent()).mode & 511;
                    expectPerms(stateMode, 448);
                    return [4 /*yield*/, promises_1.default.stat(configPath)];
                case 10:
                    configMode = (_c.sent()).mode & 511;
                    expectPerms(configMode, 384);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                case 11:
                    parsed = _b.apply(_a, [_c.sent()]);
                    channels = parsed.channels;
                    (0, vitest_1.expect)(channels.telegram.groupPolicy).toBe("allowlist");
                    (0, vitest_1.expect)(channels.whatsapp.groupPolicy).toBe("allowlist");
                    (0, vitest_1.expect)(channels.discord.groupPolicy).toBe("allowlist");
                    (0, vitest_1.expect)(channels.signal.groupPolicy).toBe("allowlist");
                    (0, vitest_1.expect)(channels.imessage.groupPolicy).toBe("allowlist");
                    (0, vitest_1.expect)(channels.whatsapp.groupAllowFrom).toEqual(["+15551234567"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("applies allowlist per-account and seeds WhatsApp groupAllowFrom from store", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, stateDir, configPath, credsDir, env, res, parsed, _a, _b, channels, whatsapp, accounts;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-fix-"))];
                case 1:
                    tmp = _c.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(stateDir, { recursive: true })];
                case 2:
                    _c.sent();
                    configPath = node_path_1.default.join(stateDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "".concat(JSON.stringify({
                            channels: {
                                whatsapp: {
                                    accounts: {
                                        a1: { groupPolicy: "open" },
                                    },
                                },
                            },
                        }, null, 2), "\n"), "utf-8")];
                case 3:
                    _c.sent();
                    credsDir = node_path_1.default.join(stateDir, "credentials");
                    return [4 /*yield*/, promises_1.default.mkdir(credsDir, { recursive: true })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(credsDir, "whatsapp-allowFrom.json"), "".concat(JSON.stringify({ version: 1, allowFrom: ["+15550001111"] }, null, 2), "\n"), "utf-8")];
                case 5:
                    _c.sent();
                    env = __assign(__assign({}, process.env), { OPENCLAW_STATE_DIR: stateDir, OPENCLAW_CONFIG_PATH: "" });
                    return [4 /*yield*/, (0, fix_js_1.fixSecurityFootguns)({ env: env })];
                case 6:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                case 7:
                    parsed = _b.apply(_a, [_c.sent()]);
                    channels = parsed.channels;
                    whatsapp = channels.whatsapp;
                    accounts = whatsapp.accounts;
                    (0, vitest_1.expect)(accounts.a1.groupPolicy).toBe("allowlist");
                    (0, vitest_1.expect)(accounts.a1.groupAllowFrom).toEqual(["+15550001111"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not seed WhatsApp groupAllowFrom if allowFrom is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, stateDir, configPath, credsDir, env, res, parsed, _a, _b, channels;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-fix-"))];
                case 1:
                    tmp = _c.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(stateDir, { recursive: true })];
                case 2:
                    _c.sent();
                    configPath = node_path_1.default.join(stateDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "".concat(JSON.stringify({
                            channels: {
                                whatsapp: { groupPolicy: "open", allowFrom: ["+15552223333"] },
                            },
                        }, null, 2), "\n"), "utf-8")];
                case 3:
                    _c.sent();
                    credsDir = node_path_1.default.join(stateDir, "credentials");
                    return [4 /*yield*/, promises_1.default.mkdir(credsDir, { recursive: true })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(credsDir, "whatsapp-allowFrom.json"), "".concat(JSON.stringify({ version: 1, allowFrom: ["+15550001111"] }, null, 2), "\n"), "utf-8")];
                case 5:
                    _c.sent();
                    env = __assign(__assign({}, process.env), { OPENCLAW_STATE_DIR: stateDir, OPENCLAW_CONFIG_PATH: "" });
                    return [4 /*yield*/, (0, fix_js_1.fixSecurityFootguns)({ env: env })];
                case 6:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                case 7:
                    parsed = _b.apply(_a, [_c.sent()]);
                    channels = parsed.channels;
                    (0, vitest_1.expect)(channels.whatsapp.groupPolicy).toBe("allowlist");
                    (0, vitest_1.expect)(channels.whatsapp.groupAllowFrom).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns ok=false for invalid config but still tightens perms", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, stateDir, configPath, env, res, stateMode, configMode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-fix-"))];
                case 1:
                    tmp = _a.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(stateDir, { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.chmod(stateDir, 493)];
                case 3:
                    _a.sent();
                    configPath = node_path_1.default.join(stateDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "{ this is not json }\n", "utf-8")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.chmod(configPath, 420)];
                case 5:
                    _a.sent();
                    env = __assign(__assign({}, process.env), { OPENCLAW_STATE_DIR: stateDir, OPENCLAW_CONFIG_PATH: "" });
                    return [4 /*yield*/, (0, fix_js_1.fixSecurityFootguns)({ env: env })];
                case 6:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    return [4 /*yield*/, promises_1.default.stat(stateDir)];
                case 7:
                    stateMode = (_a.sent()).mode & 511;
                    expectPerms(stateMode, 448);
                    return [4 /*yield*/, promises_1.default.stat(configPath)];
                case 8:
                    configMode = (_a.sent()).mode & 511;
                    expectPerms(configMode, 384);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("tightens perms for credentials + agent auth/sessions + include files", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, stateDir, includesDir, includePath, configPath, credsDir, allowFromPath, agentDir, authProfilesPath, sessionsDir, sessionsStorePath, env, res, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-fix-"))];
                case 1:
                    tmp = _f.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(stateDir, { recursive: true })];
                case 2:
                    _f.sent();
                    includesDir = node_path_1.default.join(stateDir, "includes");
                    return [4 /*yield*/, promises_1.default.mkdir(includesDir, { recursive: true })];
                case 3:
                    _f.sent();
                    includePath = node_path_1.default.join(includesDir, "extra.json5");
                    return [4 /*yield*/, promises_1.default.writeFile(includePath, "{ logging: { redactSensitive: 'off' } }\n", "utf-8")];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, promises_1.default.chmod(includePath, 420)];
                case 5:
                    _f.sent();
                    configPath = node_path_1.default.join(stateDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "{ \"$include\": \"./includes/extra.json5\", channels: { whatsapp: { groupPolicy: \"open\" } } }\n", "utf-8")];
                case 6:
                    _f.sent();
                    return [4 /*yield*/, promises_1.default.chmod(configPath, 420)];
                case 7:
                    _f.sent();
                    credsDir = node_path_1.default.join(stateDir, "credentials");
                    return [4 /*yield*/, promises_1.default.mkdir(credsDir, { recursive: true })];
                case 8:
                    _f.sent();
                    allowFromPath = node_path_1.default.join(credsDir, "whatsapp-allowFrom.json");
                    return [4 /*yield*/, promises_1.default.writeFile(allowFromPath, "".concat(JSON.stringify({ version: 1, allowFrom: ["+15550002222"] }, null, 2), "\n"), "utf-8")];
                case 9:
                    _f.sent();
                    return [4 /*yield*/, promises_1.default.chmod(allowFromPath, 420)];
                case 10:
                    _f.sent();
                    agentDir = node_path_1.default.join(stateDir, "agents", "main", "agent");
                    return [4 /*yield*/, promises_1.default.mkdir(agentDir, { recursive: true })];
                case 11:
                    _f.sent();
                    authProfilesPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    return [4 /*yield*/, promises_1.default.writeFile(authProfilesPath, "{}\n", "utf-8")];
                case 12:
                    _f.sent();
                    return [4 /*yield*/, promises_1.default.chmod(authProfilesPath, 420)];
                case 13:
                    _f.sent();
                    sessionsDir = node_path_1.default.join(stateDir, "agents", "main", "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 14:
                    _f.sent();
                    sessionsStorePath = node_path_1.default.join(sessionsDir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(sessionsStorePath, "{}\n", "utf-8")];
                case 15:
                    _f.sent();
                    return [4 /*yield*/, promises_1.default.chmod(sessionsStorePath, 420)];
                case 16:
                    _f.sent();
                    env = __assign(__assign({}, process.env), { OPENCLAW_STATE_DIR: stateDir, OPENCLAW_CONFIG_PATH: "" });
                    return [4 /*yield*/, (0, fix_js_1.fixSecurityFootguns)({ env: env })];
                case 17:
                    res = _f.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    _a = expectPerms;
                    return [4 /*yield*/, promises_1.default.stat(credsDir)];
                case 18:
                    _a.apply(void 0, [(_f.sent()).mode & 511, 448]);
                    _b = expectPerms;
                    return [4 /*yield*/, promises_1.default.stat(allowFromPath)];
                case 19:
                    _b.apply(void 0, [(_f.sent()).mode & 511, 384]);
                    _c = expectPerms;
                    return [4 /*yield*/, promises_1.default.stat(authProfilesPath)];
                case 20:
                    _c.apply(void 0, [(_f.sent()).mode & 511, 384]);
                    _d = expectPerms;
                    return [4 /*yield*/, promises_1.default.stat(sessionsStorePath)];
                case 21:
                    _d.apply(void 0, [(_f.sent()).mode & 511, 384]);
                    _e = expectPerms;
                    return [4 /*yield*/, promises_1.default.stat(includePath)];
                case 22:
                    _e.apply(void 0, [(_f.sent()).mode & 511, 384]);
                    return [2 /*return*/];
            }
        });
    }); });
});
