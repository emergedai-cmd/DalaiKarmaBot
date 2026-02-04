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
var channel_js_1 = require("../../extensions/discord/src/channel.js");
var channel_js_2 = require("../../extensions/slack/src/channel.js");
var channel_js_3 = require("../../extensions/telegram/src/channel.js");
var audit_js_1 = require("./audit.js");
var isWindows = process.platform === "win32";
(0, vitest_1.describe)("security audit", function () {
    (0, vitest_1.it)("includes an attack surface summary (info)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: { whatsapp: { groupPolicy: "open" }, telegram: { groupPolicy: "allowlist" } },
                        tools: { elevated: { enabled: true, allowFrom: { whatsapp: ["+1"] } } },
                        hooks: { enabled: true },
                        browser: { enabled: true },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "summary.attack_surface", severity: "info" }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags non-loopback bind without auth as critical", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        gateway: {
                            bind: "lan",
                            auth: {},
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            env: {},
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings.some(function (f) { return f.checkId === "gateway.bind_no_auth" && f.severity === "critical"; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns when loopback control UI lacks trusted proxies", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        gateway: {
                            bind: "loopback",
                            controlUi: { enabled: true },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "gateway.trusted_proxies_missing",
                            severity: "warn",
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags loopback control UI without auth as critical", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        gateway: {
                            bind: "loopback",
                            controlUi: { enabled: true },
                            auth: {},
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            env: {},
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "gateway.loopback_no_auth",
                            severity: "critical",
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags logging.redactSensitive=off", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        logging: { redactSensitive: "off" },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "logging.redact_off", severity: "warn" }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats Windows ACL-only perms as secure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, stateDir, configPath, user, execIcacls, res, forbidden, _loop_1, _i, forbidden_1, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-win-"))];
                case 1:
                    tmp = _a.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(stateDir, { recursive: true })];
                case 2:
                    _a.sent();
                    configPath = node_path_1.default.join(stateDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "{}\n", "utf-8")];
                case 3:
                    _a.sent();
                    user = "DESKTOP-TEST\\Tester";
                    execIcacls = function (_cmd, args) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    stdout: "".concat(args[0], " NT AUTHORITY\\SYSTEM:(F)\n ").concat(user, ":(F)\n"),
                                    stderr: "",
                                })];
                        });
                    }); };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: {},
                            includeFilesystem: true,
                            includeChannelSecurity: false,
                            stateDir: stateDir,
                            configPath: configPath,
                            platform: "win32",
                            env: __assign(__assign({}, process.env), { USERNAME: "Tester", USERDOMAIN: "DESKTOP-TEST" }),
                            execIcacls: execIcacls,
                        })];
                case 4:
                    res = _a.sent();
                    forbidden = new Set([
                        "fs.state_dir.perms_world_writable",
                        "fs.state_dir.perms_group_writable",
                        "fs.state_dir.perms_readable",
                        "fs.config.perms_writable",
                        "fs.config.perms_world_readable",
                        "fs.config.perms_group_readable",
                    ]);
                    _loop_1 = function (id) {
                        (0, vitest_1.expect)(res.findings.some(function (f) { return f.checkId === id; })).toBe(false);
                    };
                    for (_i = 0, forbidden_1 = forbidden; _i < forbidden_1.length; _i++) {
                        id = forbidden_1[_i];
                        _loop_1(id);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags Windows ACLs when Users can read the state dir", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, stateDir, configPath, user, execIcacls, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-win-open-"))];
                case 1:
                    tmp = _a.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(stateDir, { recursive: true })];
                case 2:
                    _a.sent();
                    configPath = node_path_1.default.join(stateDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "{}\n", "utf-8")];
                case 3:
                    _a.sent();
                    user = "DESKTOP-TEST\\Tester";
                    execIcacls = function (_cmd, args) { return __awaiter(void 0, void 0, void 0, function () {
                        var target;
                        return __generator(this, function (_a) {
                            target = args[0];
                            if (target === stateDir) {
                                return [2 /*return*/, {
                                        stdout: "".concat(target, " NT AUTHORITY\\SYSTEM:(F)\n BUILTIN\\Users:(RX)\n ").concat(user, ":(F)\n"),
                                        stderr: "",
                                    }];
                            }
                            return [2 /*return*/, {
                                    stdout: "".concat(target, " NT AUTHORITY\\SYSTEM:(F)\n ").concat(user, ":(F)\n"),
                                    stderr: "",
                                }];
                        });
                    }); };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: {},
                            includeFilesystem: true,
                            includeChannelSecurity: false,
                            stateDir: stateDir,
                            configPath: configPath,
                            platform: "win32",
                            env: __assign(__assign({}, process.env), { USERNAME: "Tester", USERDOMAIN: "DESKTOP-TEST" }),
                            execIcacls: execIcacls,
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings.some(function (f) { return f.checkId === "fs.state_dir.perms_readable" && f.severity === "warn"; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns when small models are paired with web/browser tools", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res, finding;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: { defaults: { model: { primary: "ollama/mistral-8b" } } },
                        tools: {
                            web: {
                                search: { enabled: true },
                                fetch: { enabled: true },
                            },
                        },
                        browser: { enabled: true },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    finding = res.findings.find(function (f) { return f.checkId === "models.small_params"; });
                    (0, vitest_1.expect)(finding === null || finding === void 0 ? void 0 : finding.severity).toBe("critical");
                    (0, vitest_1.expect)(finding === null || finding === void 0 ? void 0 : finding.detail).toContain("mistral-8b");
                    (0, vitest_1.expect)(finding === null || finding === void 0 ? void 0 : finding.detail).toContain("web_search");
                    (0, vitest_1.expect)(finding === null || finding === void 0 ? void 0 : finding.detail).toContain("web_fetch");
                    (0, vitest_1.expect)(finding === null || finding === void 0 ? void 0 : finding.detail).toContain("browser");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats small models as safe when sandbox is on and web tools are disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res, finding;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: { defaults: { model: { primary: "ollama/mistral-8b" }, sandbox: { mode: "all" } } },
                        tools: {
                            web: {
                                search: { enabled: false },
                                fetch: { enabled: false },
                            },
                        },
                        browser: { enabled: false },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    finding = res.findings.find(function (f) { return f.checkId === "models.small_params"; });
                    (0, vitest_1.expect)(finding === null || finding === void 0 ? void 0 : finding.severity).toBe("info");
                    (0, vitest_1.expect)(finding === null || finding === void 0 ? void 0 : finding.detail).toContain("mistral-8b");
                    (0, vitest_1.expect)(finding === null || finding === void 0 ? void 0 : finding.detail).toContain("sandbox=all");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags tools.elevated allowFrom wildcard as critical", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        tools: {
                            elevated: {
                                allowFrom: { whatsapp: ["*"] },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "tools.elevated.allowFrom.whatsapp.wildcard",
                            severity: "critical",
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns when remote CDP uses HTTP", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        browser: {
                            profiles: {
                                remote: { cdpUrl: "http://example.com:9222", color: "#0066CC" },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "browser.remote_cdp_http", severity: "warn" }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns when control UI allows insecure auth", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        gateway: {
                            controlUi: { allowInsecureAuth: true },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "gateway.control_ui.insecure_auth",
                            severity: "critical",
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns when control UI device auth is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        gateway: {
                            controlUi: { dangerouslyDisableDeviceAuth: true },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "gateway.control_ui.device_auth_disabled",
                            severity: "critical",
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns when multiple DM senders share the main session", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, plugins, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { session: { dmScope: "main" } };
                    plugins = [
                        {
                            id: "whatsapp",
                            meta: {
                                id: "whatsapp",
                                label: "WhatsApp",
                                selectionLabel: "WhatsApp",
                                docsPath: "/channels/whatsapp",
                                blurb: "Test",
                            },
                            capabilities: { chatTypes: ["direct"] },
                            config: {
                                listAccountIds: function () { return ["default"]; },
                                resolveAccount: function () { return ({}); },
                                isEnabled: function () { return true; },
                                isConfigured: function () { return true; },
                            },
                            security: {
                                resolveDmPolicy: function () { return ({
                                    policy: "allowlist",
                                    allowFrom: ["user-a", "user-b"],
                                    policyPath: "channels.whatsapp.dmPolicy",
                                    allowFromPath: "channels.whatsapp.",
                                    approveHint: "approve",
                                }); },
                            },
                        },
                    ];
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: true,
                            plugins: plugins,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "channels.whatsapp.dm.scope_main_multiuser",
                            severity: "warn",
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags Discord native commands without a guild user allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevStateDir, tmp, cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-discord-"))];
                case 1:
                    tmp = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = tmp;
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tmp, "credentials"), { recursive: true, mode: 448 })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    cfg = {
                        channels: {
                            discord: {
                                enabled: true,
                                token: "t",
                                groupPolicy: "allowlist",
                                guilds: {
                                    "123": {
                                        channels: {
                                            general: { allow: true },
                                        },
                                    },
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: true,
                            plugins: [channel_js_1.discordPlugin],
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "channels.discord.commands.native.no_allowlists",
                            severity: "warn",
                        }),
                    ]));
                    return [3 /*break*/, 6];
                case 5:
                    if (prevStateDir == null) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not flag Discord slash commands when dm.allowFrom includes a Discord snowflake id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevStateDir, tmp, cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-discord-allowfrom-snowflake-"))];
                case 1:
                    tmp = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = tmp;
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tmp, "credentials"), { recursive: true, mode: 448 })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    cfg = {
                        channels: {
                            discord: {
                                enabled: true,
                                token: "t",
                                dm: { allowFrom: ["387380367612706819"] },
                                groupPolicy: "allowlist",
                                guilds: {
                                    "123": {
                                        channels: {
                                            general: { allow: true },
                                        },
                                    },
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: true,
                            plugins: [channel_js_1.discordPlugin],
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).not.toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "channels.discord.commands.native.no_allowlists",
                        }),
                    ]));
                    return [3 /*break*/, 6];
                case 5:
                    if (prevStateDir == null) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags Discord slash commands when access-group enforcement is disabled and no users allowlist exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevStateDir, tmp, cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-discord-open-"))];
                case 1:
                    tmp = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = tmp;
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tmp, "credentials"), { recursive: true, mode: 448 })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    cfg = {
                        commands: { useAccessGroups: false },
                        channels: {
                            discord: {
                                enabled: true,
                                token: "t",
                                groupPolicy: "allowlist",
                                guilds: {
                                    "123": {
                                        channels: {
                                            general: { allow: true },
                                        },
                                    },
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: true,
                            plugins: [channel_js_1.discordPlugin],
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "channels.discord.commands.native.unrestricted",
                            severity: "critical",
                        }),
                    ]));
                    return [3 /*break*/, 6];
                case 5:
                    if (prevStateDir == null) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags Slack slash commands without a channel users allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevStateDir, tmp, cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-slack-"))];
                case 1:
                    tmp = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = tmp;
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tmp, "credentials"), { recursive: true, mode: 448 })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    cfg = {
                        channels: {
                            slack: {
                                enabled: true,
                                botToken: "xoxb-test",
                                appToken: "xapp-test",
                                groupPolicy: "open",
                                slashCommand: { enabled: true },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: true,
                            plugins: [channel_js_2.slackPlugin],
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "channels.slack.commands.slash.no_allowlists",
                            severity: "warn",
                        }),
                    ]));
                    return [3 /*break*/, 6];
                case 5:
                    if (prevStateDir == null) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags Slack slash commands when access-group enforcement is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevStateDir, tmp, cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-slack-open-"))];
                case 1:
                    tmp = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = tmp;
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tmp, "credentials"), { recursive: true, mode: 448 })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    cfg = {
                        commands: { useAccessGroups: false },
                        channels: {
                            slack: {
                                enabled: true,
                                botToken: "xoxb-test",
                                appToken: "xapp-test",
                                groupPolicy: "open",
                                slashCommand: { enabled: true },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: true,
                            plugins: [channel_js_2.slackPlugin],
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "channels.slack.commands.slash.useAccessGroups_off",
                            severity: "critical",
                        }),
                    ]));
                    return [3 /*break*/, 6];
                case 5:
                    if (prevStateDir == null) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags Telegram group commands without a sender allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevStateDir, tmp, cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-telegram-"))];
                case 1:
                    tmp = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = tmp;
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(tmp, "credentials"), { recursive: true, mode: 448 })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    cfg = {
                        channels: {
                            telegram: {
                                enabled: true,
                                botToken: "t",
                                groupPolicy: "allowlist",
                                groups: { "-100123": {} },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: true,
                            plugins: [channel_js_3.telegramPlugin],
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "channels.telegram.groups.allowFrom.missing",
                            severity: "critical",
                        }),
                    ]));
                    return [3 /*break*/, 6];
                case 5:
                    if (prevStateDir == null) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds a warning when deep probe fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { gateway: { mode: "local" } };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            deep: true,
                            deepTimeoutMs: 50,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                            probeGatewayFn: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, ({
                                            ok: false,
                                            url: "ws://127.0.0.1:18789",
                                            connectLatencyMs: null,
                                            error: "connect failed",
                                            close: null,
                                            health: null,
                                            status: null,
                                            presence: null,
                                            configSnapshot: null,
                                        })];
                                });
                            }); },
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "gateway.probe_failed", severity: "warn" }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds a warning when deep probe throws", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = { gateway: { mode: "local" } };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            deep: true,
                            deepTimeoutMs: 50,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                            probeGatewayFn: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    throw new Error("probe boom");
                                });
                            }); },
                        })];
                case 1:
                    res = _c.sent();
                    (0, vitest_1.expect)((_a = res.deep) === null || _a === void 0 ? void 0 : _a.gateway.ok).toBe(false);
                    (0, vitest_1.expect)((_b = res.deep) === null || _b === void 0 ? void 0 : _b.gateway.error).toContain("probe boom");
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "gateway.probe_failed", severity: "warn" }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns on legacy model configuration", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: { defaults: { model: { primary: "openai/gpt-3.5-turbo" } } },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "models.legacy", severity: "warn" }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns on weak model tiers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: { defaults: { model: { primary: "anthropic/claude-haiku-4-5" } } },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "models.weak_tier", severity: "warn" }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not warn on Venice-style opus-45 model names", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res, weakTierFinding;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        agents: { defaults: { model: { primary: "venice/claude-opus-45" } } },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    weakTierFinding = res.findings.find(function (f) { return f.checkId === "models.weak_tier"; });
                    (0, vitest_1.expect)(weakTierFinding).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns when hooks token looks short", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        hooks: { enabled: true, token: "short" },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "hooks.token_too_short", severity: "warn" }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns when hooks token reuses the gateway env token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevToken, cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevToken = process.env.OPENCLAW_GATEWAY_TOKEN;
                    process.env.OPENCLAW_GATEWAY_TOKEN = "shared-gateway-token-1234567890";
                    cfg = {
                        hooks: { enabled: true, token: "shared-gateway-token-1234567890" },
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "hooks.token_reuse_gateway_token", severity: "warn" }),
                    ]));
                    return [3 /*break*/, 4];
                case 3:
                    if (prevToken === undefined) {
                        delete process.env.OPENCLAW_GATEWAY_TOKEN;
                    }
                    else {
                        process.env.OPENCLAW_GATEWAY_TOKEN = prevToken;
                    }
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns when state/config look like a synced folder", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                            stateDir: "/Users/test/Dropbox/.openclaw",
                            configPath: "/Users/test/Dropbox/.openclaw/openclaw.json",
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "fs.synced_dir", severity: "warn" }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags group/world-readable config include files", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, stateDir, includePath, execSync, configPath, cfg, user_1, execIcacls, res, expectedCheckId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-"))];
                case 1:
                    tmp = _a.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(stateDir, { recursive: true, mode: 448 })];
                case 2:
                    _a.sent();
                    includePath = node_path_1.default.join(stateDir, "extra.json5");
                    return [4 /*yield*/, promises_1.default.writeFile(includePath, "{ logging: { redactSensitive: 'off' } }\n", "utf-8")];
                case 3:
                    _a.sent();
                    if (!isWindows) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("node:child_process"); })];
                case 4:
                    execSync = (_a.sent()).execSync;
                    execSync("icacls \"".concat(includePath, "\" /grant Everyone:W"), { stdio: "ignore" });
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, promises_1.default.chmod(includePath, 420)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    configPath = node_path_1.default.join(stateDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "{ \"$include\": \"./extra.json5\" }\n", "utf-8")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.chmod(configPath, 384)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, , 12, 14]);
                    cfg = { logging: { redactSensitive: "off" } };
                    user_1 = "DESKTOP-TEST\\Tester";
                    execIcacls = isWindows
                        ? function (_cmd, args) { return __awaiter(void 0, void 0, void 0, function () {
                            var target;
                            return __generator(this, function (_a) {
                                target = args[0];
                                if (target === includePath) {
                                    return [2 /*return*/, {
                                            stdout: "".concat(target, " NT AUTHORITY\\SYSTEM:(F)\n BUILTIN\\Users:(W)\n ").concat(user_1, ":(F)\n"),
                                            stderr: "",
                                        }];
                                }
                                return [2 /*return*/, {
                                        stdout: "".concat(target, " NT AUTHORITY\\SYSTEM:(F)\n ").concat(user_1, ":(F)\n"),
                                        stderr: "",
                                    }];
                            });
                        }); }
                        : undefined;
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: true,
                            includeChannelSecurity: false,
                            stateDir: stateDir,
                            configPath: configPath,
                            platform: isWindows ? "win32" : undefined,
                            env: isWindows
                                ? __assign(__assign({}, process.env), { USERNAME: "Tester", USERDOMAIN: "DESKTOP-TEST" }) : undefined,
                            execIcacls: execIcacls,
                        })];
                case 11:
                    res = _a.sent();
                    expectedCheckId = isWindows
                        ? "fs.config_include.perms_writable"
                        : "fs.config_include.perms_world_readable";
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: expectedCheckId, severity: "critical" }),
                    ]));
                    return [3 /*break*/, 14];
                case 12: 
                // Clean up temp directory with world-writable file
                return [4 /*yield*/, promises_1.default.rm(tmp, { recursive: true, force: true })];
                case 13:
                    // Clean up temp directory with world-writable file
                    _a.sent();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags extensions without plugins.allow", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevDiscordToken, prevTelegramToken, prevSlackBotToken, prevSlackAppToken, tmp, stateDir, cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevDiscordToken = process.env.DISCORD_BOT_TOKEN;
                    prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
                    prevSlackBotToken = process.env.SLACK_BOT_TOKEN;
                    prevSlackAppToken = process.env.SLACK_APP_TOKEN;
                    delete process.env.DISCORD_BOT_TOKEN;
                    delete process.env.TELEGRAM_BOT_TOKEN;
                    delete process.env.SLACK_BOT_TOKEN;
                    delete process.env.SLACK_APP_TOKEN;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-"))];
                case 1:
                    tmp = _a.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(stateDir, "extensions", "some-plugin"), {
                            recursive: true,
                            mode: 448,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    cfg = {};
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: true,
                            includeChannelSecurity: false,
                            stateDir: stateDir,
                            configPath: node_path_1.default.join(stateDir, "openclaw.json"),
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({ checkId: "plugins.extensions_no_allowlist", severity: "warn" }),
                    ]));
                    return [3 /*break*/, 6];
                case 5:
                    if (prevDiscordToken == null) {
                        delete process.env.DISCORD_BOT_TOKEN;
                    }
                    else {
                        process.env.DISCORD_BOT_TOKEN = prevDiscordToken;
                    }
                    if (prevTelegramToken == null) {
                        delete process.env.TELEGRAM_BOT_TOKEN;
                    }
                    else {
                        process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
                    }
                    if (prevSlackBotToken == null) {
                        delete process.env.SLACK_BOT_TOKEN;
                    }
                    else {
                        process.env.SLACK_BOT_TOKEN = prevSlackBotToken;
                    }
                    if (prevSlackAppToken == null) {
                        delete process.env.SLACK_APP_TOKEN;
                    }
                    else {
                        process.env.SLACK_APP_TOKEN = prevSlackAppToken;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags unallowlisted extensions as critical when native skill commands are exposed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevDiscordToken, tmp, stateDir, cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevDiscordToken = process.env.DISCORD_BOT_TOKEN;
                    delete process.env.DISCORD_BOT_TOKEN;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-security-audit-"))];
                case 1:
                    tmp = _a.sent();
                    stateDir = node_path_1.default.join(tmp, "state");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(stateDir, "extensions", "some-plugin"), {
                            recursive: true,
                            mode: 448,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    cfg = {
                        channels: {
                            discord: { enabled: true, token: "t" },
                        },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: true,
                            includeChannelSecurity: false,
                            stateDir: stateDir,
                            configPath: node_path_1.default.join(stateDir, "openclaw.json"),
                        })];
                case 4:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "plugins.extensions_no_allowlist",
                            severity: "critical",
                        }),
                    ]));
                    return [3 /*break*/, 6];
                case 5:
                    if (prevDiscordToken == null) {
                        delete process.env.DISCORD_BOT_TOKEN;
                    }
                    else {
                        process.env.DISCORD_BOT_TOKEN = prevDiscordToken;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags open groupPolicy when tools.elevated is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        tools: { elevated: { enabled: true, allowFrom: { whatsapp: ["+1"] } } },
                        channels: { whatsapp: { groupPolicy: "open" } },
                    };
                    return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                            config: cfg,
                            includeFilesystem: false,
                            includeChannelSecurity: false,
                        })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.findings).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            checkId: "security.exposure.open_groups_with_elevated",
                            severity: "critical",
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)("maybeProbeGateway auth selection", function () {
        var originalEnvToken = process.env.OPENCLAW_GATEWAY_TOKEN;
        var originalEnvPassword = process.env.OPENCLAW_GATEWAY_PASSWORD;
        (0, vitest_1.beforeEach)(function () {
            delete process.env.OPENCLAW_GATEWAY_TOKEN;
            delete process.env.OPENCLAW_GATEWAY_PASSWORD;
        });
        (0, vitest_1.afterEach)(function () {
            if (originalEnvToken == null) {
                delete process.env.OPENCLAW_GATEWAY_TOKEN;
            }
            else {
                process.env.OPENCLAW_GATEWAY_TOKEN = originalEnvToken;
            }
            if (originalEnvPassword == null) {
                delete process.env.OPENCLAW_GATEWAY_PASSWORD;
            }
            else {
                process.env.OPENCLAW_GATEWAY_PASSWORD = originalEnvPassword;
            }
        });
        (0, vitest_1.it)("uses local auth when gateway.mode is local", function () { return __awaiter(void 0, void 0, void 0, function () {
            var capturedAuth, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            gateway: {
                                mode: "local",
                                auth: { token: "local-token-abc123" },
                            },
                        };
                        return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                                config: cfg,
                                deep: true,
                                deepTimeoutMs: 50,
                                includeFilesystem: false,
                                includeChannelSecurity: false,
                                probeGatewayFn: function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        capturedAuth = opts.auth;
                                        return [2 /*return*/, {
                                                ok: true,
                                                url: opts.url,
                                                connectLatencyMs: 10,
                                                error: null,
                                                close: null,
                                                health: null,
                                                status: null,
                                                presence: null,
                                                configSnapshot: null,
                                            }];
                                    });
                                }); },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(capturedAuth === null || capturedAuth === void 0 ? void 0 : capturedAuth.token).toBe("local-token-abc123");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("prefers env token over local config token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var capturedAuth, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.env.OPENCLAW_GATEWAY_TOKEN = "env-token";
                        cfg = {
                            gateway: {
                                mode: "local",
                                auth: { token: "local-token" },
                            },
                        };
                        return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                                config: cfg,
                                deep: true,
                                deepTimeoutMs: 50,
                                includeFilesystem: false,
                                includeChannelSecurity: false,
                                probeGatewayFn: function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        capturedAuth = opts.auth;
                                        return [2 /*return*/, {
                                                ok: true,
                                                url: opts.url,
                                                connectLatencyMs: 10,
                                                error: null,
                                                close: null,
                                                health: null,
                                                status: null,
                                                presence: null,
                                                configSnapshot: null,
                                            }];
                                    });
                                }); },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(capturedAuth === null || capturedAuth === void 0 ? void 0 : capturedAuth.token).toBe("env-token");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("uses local auth when gateway.mode is undefined (default)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var capturedAuth, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            gateway: {
                                auth: { token: "default-local-token" },
                            },
                        };
                        return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                                config: cfg,
                                deep: true,
                                deepTimeoutMs: 50,
                                includeFilesystem: false,
                                includeChannelSecurity: false,
                                probeGatewayFn: function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        capturedAuth = opts.auth;
                                        return [2 /*return*/, {
                                                ok: true,
                                                url: opts.url,
                                                connectLatencyMs: 10,
                                                error: null,
                                                close: null,
                                                health: null,
                                                status: null,
                                                presence: null,
                                                configSnapshot: null,
                                            }];
                                    });
                                }); },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(capturedAuth === null || capturedAuth === void 0 ? void 0 : capturedAuth.token).toBe("default-local-token");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("uses remote auth when gateway.mode is remote with URL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var capturedAuth, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            gateway: {
                                mode: "remote",
                                auth: { token: "local-token-should-not-use" },
                                remote: {
                                    url: "ws://remote.example.com:18789",
                                    token: "remote-token-xyz789",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                                config: cfg,
                                deep: true,
                                deepTimeoutMs: 50,
                                includeFilesystem: false,
                                includeChannelSecurity: false,
                                probeGatewayFn: function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        capturedAuth = opts.auth;
                                        return [2 /*return*/, {
                                                ok: true,
                                                url: opts.url,
                                                connectLatencyMs: 10,
                                                error: null,
                                                close: null,
                                                health: null,
                                                status: null,
                                                presence: null,
                                                configSnapshot: null,
                                            }];
                                    });
                                }); },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(capturedAuth === null || capturedAuth === void 0 ? void 0 : capturedAuth.token).toBe("remote-token-xyz789");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("ignores env token when gateway.mode is remote", function () { return __awaiter(void 0, void 0, void 0, function () {
            var capturedAuth, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.env.OPENCLAW_GATEWAY_TOKEN = "env-token";
                        cfg = {
                            gateway: {
                                mode: "remote",
                                auth: { token: "local-token-should-not-use" },
                                remote: {
                                    url: "ws://remote.example.com:18789",
                                    token: "remote-token",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                                config: cfg,
                                deep: true,
                                deepTimeoutMs: 50,
                                includeFilesystem: false,
                                includeChannelSecurity: false,
                                probeGatewayFn: function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        capturedAuth = opts.auth;
                                        return [2 /*return*/, {
                                                ok: true,
                                                url: opts.url,
                                                connectLatencyMs: 10,
                                                error: null,
                                                close: null,
                                                health: null,
                                                status: null,
                                                presence: null,
                                                configSnapshot: null,
                                            }];
                                    });
                                }); },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(capturedAuth === null || capturedAuth === void 0 ? void 0 : capturedAuth.token).toBe("remote-token");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("uses remote password when env is unset", function () { return __awaiter(void 0, void 0, void 0, function () {
            var capturedAuth, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            gateway: {
                                mode: "remote",
                                remote: {
                                    url: "ws://remote.example.com:18789",
                                    password: "remote-pass",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                                config: cfg,
                                deep: true,
                                deepTimeoutMs: 50,
                                includeFilesystem: false,
                                includeChannelSecurity: false,
                                probeGatewayFn: function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        capturedAuth = opts.auth;
                                        return [2 /*return*/, {
                                                ok: true,
                                                url: opts.url,
                                                connectLatencyMs: 10,
                                                error: null,
                                                close: null,
                                                health: null,
                                                status: null,
                                                presence: null,
                                                configSnapshot: null,
                                            }];
                                    });
                                }); },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(capturedAuth === null || capturedAuth === void 0 ? void 0 : capturedAuth.password).toBe("remote-pass");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("prefers env password over remote password", function () { return __awaiter(void 0, void 0, void 0, function () {
            var capturedAuth, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.env.OPENCLAW_GATEWAY_PASSWORD = "env-pass";
                        cfg = {
                            gateway: {
                                mode: "remote",
                                remote: {
                                    url: "ws://remote.example.com:18789",
                                    password: "remote-pass",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                                config: cfg,
                                deep: true,
                                deepTimeoutMs: 50,
                                includeFilesystem: false,
                                includeChannelSecurity: false,
                                probeGatewayFn: function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        capturedAuth = opts.auth;
                                        return [2 /*return*/, {
                                                ok: true,
                                                url: opts.url,
                                                connectLatencyMs: 10,
                                                error: null,
                                                close: null,
                                                health: null,
                                                status: null,
                                                presence: null,
                                                configSnapshot: null,
                                            }];
                                    });
                                }); },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(capturedAuth === null || capturedAuth === void 0 ? void 0 : capturedAuth.password).toBe("env-pass");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("falls back to local auth when gateway.mode is remote but URL is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var capturedAuth, cfg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            gateway: {
                                mode: "remote",
                                auth: { token: "fallback-local-token" },
                                remote: {
                                    token: "remote-token-should-not-use",
                                },
                            },
                        };
                        return [4 /*yield*/, (0, audit_js_1.runSecurityAudit)({
                                config: cfg,
                                deep: true,
                                deepTimeoutMs: 50,
                                includeFilesystem: false,
                                includeChannelSecurity: false,
                                probeGatewayFn: function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        capturedAuth = opts.auth;
                                        return [2 /*return*/, {
                                                ok: true,
                                                url: opts.url,
                                                connectLatencyMs: 10,
                                                error: null,
                                                close: null,
                                                health: null,
                                                status: null,
                                                presence: null,
                                                configSnapshot: null,
                                            }];
                                    });
                                }); },
                            })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(capturedAuth === null || capturedAuth === void 0 ? void 0 : capturedAuth.token).toBe("fallback-local-token");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
