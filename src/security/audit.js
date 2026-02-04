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
exports.runSecurityAudit = runSecurityAudit;
var config_js_1 = require("../browser/config.js");
var helpers_js_1 = require("../channels/plugins/helpers.js");
var index_js_1 = require("../channels/plugins/index.js");
var command_format_js_1 = require("../cli/command-format.js");
var commands_js_1 = require("../config/commands.js");
var paths_js_1 = require("../config/paths.js");
var auth_js_1 = require("../gateway/auth.js");
var call_js_1 = require("../gateway/call.js");
var probe_js_1 = require("../gateway/probe.js");
var pairing_store_js_1 = require("../pairing/pairing-store.js");
var audit_extra_js_1 = require("./audit-extra.js");
var audit_fs_js_1 = require("./audit-fs.js");
function countBySeverity(findings) {
    var critical = 0;
    var warn = 0;
    var info = 0;
    for (var _i = 0, findings_1 = findings; _i < findings_1.length; _i++) {
        var f = findings_1[_i];
        if (f.severity === "critical") {
            critical += 1;
        }
        else if (f.severity === "warn") {
            warn += 1;
        }
        else {
            info += 1;
        }
    }
    return { critical: critical, warn: warn, info: info };
}
function normalizeAllowFromList(list) {
    if (!Array.isArray(list)) {
        return [];
    }
    return list.map(function (v) { return String(v).trim(); }).filter(Boolean);
}
function classifyChannelWarningSeverity(message) {
    var s = message.toLowerCase();
    if (s.includes("dms: open") ||
        s.includes('grouppolicy="open"') ||
        s.includes('dmpolicy="open"')) {
        return "critical";
    }
    if (s.includes("allows any") || s.includes("anyone can dm") || s.includes("public")) {
        return "critical";
    }
    if (s.includes("locked") || s.includes("disabled")) {
        return "info";
    }
    return "warn";
}
function collectFilesystemFindings(params) {
    return __awaiter(this, void 0, void 0, function () {
        var findings, stateDirPerms, configPerms;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findings = [];
                    return [4 /*yield*/, (0, audit_fs_js_1.inspectPathPermissions)(params.stateDir, {
                            env: params.env,
                            platform: params.platform,
                            exec: params.execIcacls,
                        })];
                case 1:
                    stateDirPerms = _a.sent();
                    if (stateDirPerms.ok) {
                        if (stateDirPerms.isSymlink) {
                            findings.push({
                                checkId: "fs.state_dir.symlink",
                                severity: "warn",
                                title: "State dir is a symlink",
                                detail: "".concat(params.stateDir, " is a symlink; treat this as an extra trust boundary."),
                            });
                        }
                        if (stateDirPerms.worldWritable) {
                            findings.push({
                                checkId: "fs.state_dir.perms_world_writable",
                                severity: "critical",
                                title: "State dir is world-writable",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(params.stateDir, stateDirPerms), "; other users can write into your OpenClaw state."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: params.stateDir,
                                    perms: stateDirPerms,
                                    isDir: true,
                                    posixMode: 448,
                                    env: params.env,
                                }),
                            });
                        }
                        else if (stateDirPerms.groupWritable) {
                            findings.push({
                                checkId: "fs.state_dir.perms_group_writable",
                                severity: "warn",
                                title: "State dir is group-writable",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(params.stateDir, stateDirPerms), "; group users can write into your OpenClaw state."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: params.stateDir,
                                    perms: stateDirPerms,
                                    isDir: true,
                                    posixMode: 448,
                                    env: params.env,
                                }),
                            });
                        }
                        else if (stateDirPerms.groupReadable || stateDirPerms.worldReadable) {
                            findings.push({
                                checkId: "fs.state_dir.perms_readable",
                                severity: "warn",
                                title: "State dir is readable by others",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(params.stateDir, stateDirPerms), "; consider restricting to 700."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: params.stateDir,
                                    perms: stateDirPerms,
                                    isDir: true,
                                    posixMode: 448,
                                    env: params.env,
                                }),
                            });
                        }
                    }
                    return [4 /*yield*/, (0, audit_fs_js_1.inspectPathPermissions)(params.configPath, {
                            env: params.env,
                            platform: params.platform,
                            exec: params.execIcacls,
                        })];
                case 2:
                    configPerms = _a.sent();
                    if (configPerms.ok) {
                        if (configPerms.isSymlink) {
                            findings.push({
                                checkId: "fs.config.symlink",
                                severity: "warn",
                                title: "Config file is a symlink",
                                detail: "".concat(params.configPath, " is a symlink; make sure you trust its target."),
                            });
                        }
                        if (configPerms.worldWritable || configPerms.groupWritable) {
                            findings.push({
                                checkId: "fs.config.perms_writable",
                                severity: "critical",
                                title: "Config file is writable by others",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(params.configPath, configPerms), "; another user could change gateway/auth/tool policies."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: params.configPath,
                                    perms: configPerms,
                                    isDir: false,
                                    posixMode: 384,
                                    env: params.env,
                                }),
                            });
                        }
                        else if (configPerms.worldReadable) {
                            findings.push({
                                checkId: "fs.config.perms_world_readable",
                                severity: "critical",
                                title: "Config file is world-readable",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(params.configPath, configPerms), "; config can contain tokens and private settings."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: params.configPath,
                                    perms: configPerms,
                                    isDir: false,
                                    posixMode: 384,
                                    env: params.env,
                                }),
                            });
                        }
                        else if (configPerms.groupReadable) {
                            findings.push({
                                checkId: "fs.config.perms_group_readable",
                                severity: "warn",
                                title: "Config file is group-readable",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(params.configPath, configPerms), "; config can contain tokens and private settings."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: params.configPath,
                                    perms: configPerms,
                                    isDir: false,
                                    posixMode: 384,
                                    env: params.env,
                                }),
                            });
                        }
                    }
                    return [2 /*return*/, findings];
            }
        });
    });
}
function collectGatewayConfigFindings(cfg, env) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var findings = [];
    var bind = typeof ((_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.bind) === "string" ? cfg.gateway.bind : "loopback";
    var tailscaleMode = (_d = (_c = (_b = cfg.gateway) === null || _b === void 0 ? void 0 : _b.tailscale) === null || _c === void 0 ? void 0 : _c.mode) !== null && _d !== void 0 ? _d : "off";
    var auth = (0, auth_js_1.resolveGatewayAuth)({ authConfig: (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.auth, tailscaleMode: tailscaleMode, env: env });
    var controlUiEnabled = ((_g = (_f = cfg.gateway) === null || _f === void 0 ? void 0 : _f.controlUi) === null || _g === void 0 ? void 0 : _g.enabled) !== false;
    var trustedProxies = Array.isArray((_h = cfg.gateway) === null || _h === void 0 ? void 0 : _h.trustedProxies)
        ? cfg.gateway.trustedProxies
        : [];
    var hasToken = typeof auth.token === "string" && auth.token.trim().length > 0;
    var hasPassword = typeof auth.password === "string" && auth.password.trim().length > 0;
    var hasSharedSecret = (auth.mode === "token" && hasToken) || (auth.mode === "password" && hasPassword);
    var hasTailscaleAuth = auth.allowTailscale && tailscaleMode === "serve";
    var hasGatewayAuth = hasSharedSecret || hasTailscaleAuth;
    if (bind !== "loopback" && !hasSharedSecret) {
        findings.push({
            checkId: "gateway.bind_no_auth",
            severity: "critical",
            title: "Gateway binds beyond loopback without auth",
            detail: "gateway.bind=\"".concat(bind, "\" but no gateway.auth token/password is configured."),
            remediation: "Set gateway.auth (token recommended) or bind to loopback.",
        });
    }
    if (bind === "loopback" && controlUiEnabled && trustedProxies.length === 0) {
        findings.push({
            checkId: "gateway.trusted_proxies_missing",
            severity: "warn",
            title: "Reverse proxy headers are not trusted",
            detail: "gateway.bind is loopback and gateway.trustedProxies is empty. " +
                "If you expose the Control UI through a reverse proxy, configure trusted proxies " +
                "so local-client checks cannot be spoofed.",
            remediation: "Set gateway.trustedProxies to your proxy IPs or keep the Control UI local-only.",
        });
    }
    if (bind === "loopback" && controlUiEnabled && !hasGatewayAuth) {
        findings.push({
            checkId: "gateway.loopback_no_auth",
            severity: "critical",
            title: "Gateway auth missing on loopback",
            detail: "gateway.bind is loopback but no gateway auth secret is configured. " +
                "If the Control UI is exposed through a reverse proxy, unauthenticated access is possible.",
            remediation: "Set gateway.auth (token recommended) or keep the Control UI local-only.",
        });
    }
    if (tailscaleMode === "funnel") {
        findings.push({
            checkId: "gateway.tailscale_funnel",
            severity: "critical",
            title: "Tailscale Funnel exposure enabled",
            detail: "gateway.tailscale.mode=\"funnel\" exposes the Gateway publicly; keep auth strict and treat it as internet-facing.",
            remediation: "Prefer tailscale.mode=\"serve\" (tailnet-only) or set tailscale.mode=\"off\".",
        });
    }
    else if (tailscaleMode === "serve") {
        findings.push({
            checkId: "gateway.tailscale_serve",
            severity: "info",
            title: "Tailscale Serve exposure enabled",
            detail: "gateway.tailscale.mode=\"serve\" exposes the Gateway to your tailnet (loopback behind Tailscale).",
        });
    }
    if (((_k = (_j = cfg.gateway) === null || _j === void 0 ? void 0 : _j.controlUi) === null || _k === void 0 ? void 0 : _k.allowInsecureAuth) === true) {
        findings.push({
            checkId: "gateway.control_ui.insecure_auth",
            severity: "critical",
            title: "Control UI allows insecure HTTP auth",
            detail: "gateway.controlUi.allowInsecureAuth=true allows token-only auth over HTTP and skips device identity.",
            remediation: "Disable it or switch to HTTPS (Tailscale Serve) or localhost.",
        });
    }
    if (((_m = (_l = cfg.gateway) === null || _l === void 0 ? void 0 : _l.controlUi) === null || _m === void 0 ? void 0 : _m.dangerouslyDisableDeviceAuth) === true) {
        findings.push({
            checkId: "gateway.control_ui.device_auth_disabled",
            severity: "critical",
            title: "DANGEROUS: Control UI device auth disabled",
            detail: "gateway.controlUi.dangerouslyDisableDeviceAuth=true disables device identity checks for the Control UI.",
            remediation: "Disable it unless you are in a short-lived break-glass scenario.",
        });
    }
    var token = typeof auth.token === "string" && auth.token.trim().length > 0 ? auth.token.trim() : null;
    if (auth.mode === "token" && token && token.length < 24) {
        findings.push({
            checkId: "gateway.token_too_short",
            severity: "warn",
            title: "Gateway token looks short",
            detail: "gateway auth token is ".concat(token.length, " chars; prefer a long random token."),
        });
    }
    return findings;
}
function collectBrowserControlFindings(cfg) {
    var findings = [];
    var resolved;
    try {
        resolved = (0, config_js_1.resolveBrowserConfig)(cfg.browser, cfg);
    }
    catch (err) {
        findings.push({
            checkId: "browser.control_invalid_config",
            severity: "warn",
            title: "Browser control config looks invalid",
            detail: String(err),
            remediation: "Fix browser.cdpUrl in ".concat((0, paths_js_1.resolveConfigPath)(), " and re-run \"").concat((0, command_format_js_1.formatCliCommand)("openclaw security audit --deep"), "\"."),
        });
        return findings;
    }
    if (!resolved.enabled) {
        return findings;
    }
    for (var _i = 0, _a = Object.keys(resolved.profiles); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        var profile = (0, config_js_1.resolveProfile)(resolved, name_1);
        if (!profile || profile.cdpIsLoopback) {
            continue;
        }
        var url = void 0;
        try {
            url = new URL(profile.cdpUrl);
        }
        catch (_b) {
            continue;
        }
        if (url.protocol === "http:") {
            findings.push({
                checkId: "browser.remote_cdp_http",
                severity: "warn",
                title: "Remote CDP uses HTTP",
                detail: "browser profile \"".concat(name_1, "\" uses http CDP (").concat(profile.cdpUrl, "); this is OK only if it's tailnet-only or behind an encrypted tunnel."),
                remediation: "Prefer HTTPS/TLS or a tailnet-only endpoint for remote CDP.",
            });
        }
    }
    return findings;
}
function collectLoggingFindings(cfg) {
    var _a;
    var redact = (_a = cfg.logging) === null || _a === void 0 ? void 0 : _a.redactSensitive;
    if (redact !== "off") {
        return [];
    }
    return [
        {
            checkId: "logging.redact_off",
            severity: "warn",
            title: "Tool summary redaction is disabled",
            detail: "logging.redactSensitive=\"off\" can leak secrets into logs and status output.",
            remediation: "Set logging.redactSensitive=\"tools\".",
        },
    ];
}
function collectElevatedFindings(cfg) {
    var _a, _b, _c, _d, _e;
    var findings = [];
    var enabled = (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.elevated) === null || _b === void 0 ? void 0 : _b.enabled;
    var allowFrom = (_e = (_d = (_c = cfg.tools) === null || _c === void 0 ? void 0 : _c.elevated) === null || _d === void 0 ? void 0 : _d.allowFrom) !== null && _e !== void 0 ? _e : {};
    var anyAllowFromKeys = Object.keys(allowFrom).length > 0;
    if (enabled === false) {
        return findings;
    }
    if (!anyAllowFromKeys) {
        return findings;
    }
    for (var _i = 0, _f = Object.entries(allowFrom); _i < _f.length; _i++) {
        var _g = _f[_i], provider = _g[0], list = _g[1];
        var normalized = normalizeAllowFromList(list);
        if (normalized.includes("*")) {
            findings.push({
                checkId: "tools.elevated.allowFrom.".concat(provider, ".wildcard"),
                severity: "critical",
                title: "Elevated exec allowlist contains wildcard",
                detail: "tools.elevated.allowFrom.".concat(provider, " includes \"*\" which effectively approves everyone on that channel for elevated mode."),
            });
        }
        else if (normalized.length > 25) {
            findings.push({
                checkId: "tools.elevated.allowFrom.".concat(provider, ".large"),
                severity: "warn",
                title: "Elevated exec allowlist is large",
                detail: "tools.elevated.allowFrom.".concat(provider, " has ").concat(normalized.length, " entries; consider tightening elevated access."),
            });
        }
    }
    return findings;
}
function collectChannelSecurityFindings(params) {
    return __awaiter(this, void 0, void 0, function () {
        var findings, coerceNativeSetting, warnDmPolicy, _i, _a, plugin, accountIds, defaultAccountId, account, enabled, configured, _b, discordCfg, nativeEnabled, nativeSkillsEnabled, slashEnabled, defaultGroupPolicy, groupPolicy, guildEntries, guildsConfigured, hasAnyUserAllowlist, dmAllowFromRaw, dmAllowFrom, storeAllowFrom, ownerAllowFromConfigured, useAccessGroups, slackCfg, nativeEnabled, nativeSkillsEnabled, slashCommandEnabled, useAccessGroups, dmAllowFromRaw, dmAllowFrom, storeAllowFrom, ownerAllowFromConfigured, channels, hasAnyChannelUsersAllowlist, dmPolicy, warnings, _c, _d, message, trimmed, allowTextCommands, telegramCfg, defaultGroupPolicy, groupPolicy, groups, groupsConfigured, groupAccessPossible, storeAllowFrom, storeHasWildcard, groupAllowFrom, groupAllowFromHasWildcard, anyGroupOverride, hasAnySenderAllowlist, providerSetting, skillsEnabled;
        var _this = this;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
        return __generator(this, function (_13) {
            switch (_13.label) {
                case 0:
                    findings = [];
                    coerceNativeSetting = function (value) {
                        if (value === true) {
                            return true;
                        }
                        if (value === false) {
                            return false;
                        }
                        if (value === "auto") {
                            return "auto";
                        }
                        return undefined;
                    };
                    warnDmPolicy = function (input) { return __awaiter(_this, void 0, void 0, function () {
                        var policyPath, configAllowFrom, hasWildcard, dmScope, storeAllowFrom, normalizeEntry, normalizedCfg, normalizedStore, allowCount, isMultiUserDm, allowFromKey;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    policyPath = (_a = input.policyPath) !== null && _a !== void 0 ? _a : "".concat(input.allowFromPath, "policy");
                                    configAllowFrom = normalizeAllowFromList(input.allowFrom);
                                    hasWildcard = configAllowFrom.includes("*");
                                    dmScope = (_c = (_b = params.cfg.session) === null || _b === void 0 ? void 0 : _b.dmScope) !== null && _c !== void 0 ? _c : "main";
                                    return [4 /*yield*/, (0, pairing_store_js_1.readChannelAllowFromStore)(input.provider).catch(function () { return []; })];
                                case 1:
                                    storeAllowFrom = _e.sent();
                                    normalizeEntry = (_d = input.normalizeEntry) !== null && _d !== void 0 ? _d : (function (value) { return value; });
                                    normalizedCfg = configAllowFrom
                                        .filter(function (value) { return value !== "*"; })
                                        .map(function (value) { return normalizeEntry(value); })
                                        .map(function (value) { return value.trim(); })
                                        .filter(Boolean);
                                    normalizedStore = storeAllowFrom
                                        .map(function (value) { return normalizeEntry(value); })
                                        .map(function (value) { return value.trim(); })
                                        .filter(Boolean);
                                    allowCount = Array.from(new Set(__spreadArray(__spreadArray([], normalizedCfg, true), normalizedStore, true))).length;
                                    isMultiUserDm = hasWildcard || allowCount > 1;
                                    if (input.dmPolicy === "open") {
                                        allowFromKey = "".concat(input.allowFromPath, "allowFrom");
                                        findings.push({
                                            checkId: "channels.".concat(input.provider, ".dm.open"),
                                            severity: "critical",
                                            title: "".concat(input.label, " DMs are open"),
                                            detail: "".concat(policyPath, "=\"open\" allows anyone to DM the bot."),
                                            remediation: "Use pairing/allowlist; if you really need open DMs, ensure ".concat(allowFromKey, " includes \"*\"."),
                                        });
                                        if (!hasWildcard) {
                                            findings.push({
                                                checkId: "channels.".concat(input.provider, ".dm.open_invalid"),
                                                severity: "warn",
                                                title: "".concat(input.label, " DM config looks inconsistent"),
                                                detail: "\"open\" requires ".concat(allowFromKey, " to include \"*\"."),
                                            });
                                        }
                                    }
                                    if (input.dmPolicy === "disabled") {
                                        findings.push({
                                            checkId: "channels.".concat(input.provider, ".dm.disabled"),
                                            severity: "info",
                                            title: "".concat(input.label, " DMs are disabled"),
                                            detail: "".concat(policyPath, "=\"disabled\" ignores inbound DMs."),
                                        });
                                        return [2 /*return*/];
                                    }
                                    if (dmScope === "main" && isMultiUserDm) {
                                        findings.push({
                                            checkId: "channels.".concat(input.provider, ".dm.scope_main_multiuser"),
                                            severity: "warn",
                                            title: "".concat(input.label, " DMs share the main session"),
                                            detail: "Multiple DM senders currently share the main session, which can leak context across users.",
                                            remediation: 'Set session.dmScope="per-channel-peer" (or "per-account-channel-peer" for multi-account channels) to isolate DM sessions per sender.',
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _i = 0, _a = params.plugins;
                    _13.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 16];
                    plugin = _a[_i];
                    if (!plugin.security) {
                        return [3 /*break*/, 15];
                    }
                    accountIds = plugin.config.listAccountIds(params.cfg);
                    defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({
                        plugin: plugin,
                        cfg: params.cfg,
                        accountIds: accountIds,
                    });
                    account = plugin.config.resolveAccount(params.cfg, defaultAccountId);
                    enabled = plugin.config.isEnabled ? plugin.config.isEnabled(account, params.cfg) : true;
                    if (!enabled) {
                        return [3 /*break*/, 15];
                    }
                    if (!plugin.config.isConfigured) return [3 /*break*/, 3];
                    return [4 /*yield*/, plugin.config.isConfigured(account, params.cfg)];
                case 2:
                    _b = _13.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _b = true;
                    _13.label = 4;
                case 4:
                    configured = _b;
                    if (!configured) {
                        return [3 /*break*/, 15];
                    }
                    if (!(plugin.id === "discord")) return [3 /*break*/, 6];
                    discordCfg = (_e = account === null || account === void 0 ? void 0 : account.config) !== null && _e !== void 0 ? _e : {};
                    nativeEnabled = (0, commands_js_1.resolveNativeCommandsEnabled)({
                        providerId: "discord",
                        providerSetting: coerceNativeSetting((_f = discordCfg.commands) === null || _f === void 0 ? void 0 : _f.native),
                        globalSetting: (_g = params.cfg.commands) === null || _g === void 0 ? void 0 : _g.native,
                    });
                    nativeSkillsEnabled = (0, commands_js_1.resolveNativeSkillsEnabled)({
                        providerId: "discord",
                        providerSetting: coerceNativeSetting((_h = discordCfg.commands) === null || _h === void 0 ? void 0 : _h.nativeSkills),
                        globalSetting: (_j = params.cfg.commands) === null || _j === void 0 ? void 0 : _j.nativeSkills,
                    });
                    slashEnabled = nativeEnabled || nativeSkillsEnabled;
                    if (!slashEnabled) return [3 /*break*/, 6];
                    defaultGroupPolicy = (_l = (_k = params.cfg.channels) === null || _k === void 0 ? void 0 : _k.defaults) === null || _l === void 0 ? void 0 : _l.groupPolicy;
                    groupPolicy = (_o = (_m = discordCfg.groupPolicy) !== null && _m !== void 0 ? _m : defaultGroupPolicy) !== null && _o !== void 0 ? _o : "allowlist";
                    guildEntries = (_p = discordCfg.guilds) !== null && _p !== void 0 ? _p : {};
                    guildsConfigured = Object.keys(guildEntries).length > 0;
                    hasAnyUserAllowlist = Object.values(guildEntries).some(function (guild) {
                        if (!guild || typeof guild !== "object") {
                            return false;
                        }
                        var g = guild;
                        if (Array.isArray(g.users) && g.users.length > 0) {
                            return true;
                        }
                        var channels = g.channels;
                        if (!channels || typeof channels !== "object") {
                            return false;
                        }
                        return Object.values(channels).some(function (channel) {
                            if (!channel || typeof channel !== "object") {
                                return false;
                            }
                            var c = channel;
                            return Array.isArray(c.users) && c.users.length > 0;
                        });
                    });
                    dmAllowFromRaw = (_q = discordCfg.dm) === null || _q === void 0 ? void 0 : _q.allowFrom;
                    dmAllowFrom = Array.isArray(dmAllowFromRaw) ? dmAllowFromRaw : [];
                    return [4 /*yield*/, (0, pairing_store_js_1.readChannelAllowFromStore)("discord").catch(function () { return []; })];
                case 5:
                    storeAllowFrom = _13.sent();
                    ownerAllowFromConfigured = normalizeAllowFromList(__spreadArray(__spreadArray([], dmAllowFrom, true), storeAllowFrom, true)).length > 0;
                    useAccessGroups = ((_r = params.cfg.commands) === null || _r === void 0 ? void 0 : _r.useAccessGroups) !== false;
                    if (!useAccessGroups &&
                        groupPolicy !== "disabled" &&
                        guildsConfigured &&
                        !hasAnyUserAllowlist) {
                        findings.push({
                            checkId: "channels.discord.commands.native.unrestricted",
                            severity: "critical",
                            title: "Discord slash commands are unrestricted",
                            detail: "commands.useAccessGroups=false disables sender allowlists for Discord slash commands unless a per-guild/channel users allowlist is configured; with no users allowlist, any user in allowed guild channels can invoke /… commands.",
                            remediation: "Set commands.useAccessGroups=true (recommended), or configure channels.discord.guilds.<id>.users (or channels.discord.guilds.<id>.channels.<channel>.users).",
                        });
                    }
                    else if (useAccessGroups &&
                        groupPolicy !== "disabled" &&
                        guildsConfigured &&
                        !ownerAllowFromConfigured &&
                        !hasAnyUserAllowlist) {
                        findings.push({
                            checkId: "channels.discord.commands.native.no_allowlists",
                            severity: "warn",
                            title: "Discord slash commands have no allowlists",
                            detail: "Discord slash commands are enabled, but neither an owner allowFrom list nor any per-guild/channel users allowlist is configured; /… commands will be rejected for everyone.",
                            remediation: "Add your user id to channels.discord.dm.allowFrom (or approve yourself via pairing), or configure channels.discord.guilds.<id>.users.",
                        });
                    }
                    _13.label = 6;
                case 6:
                    if (!(plugin.id === "slack")) return [3 /*break*/, 9];
                    slackCfg = (_s = account === null || account === void 0 ? void 0 : account.config) !== null && _s !== void 0 ? _s : {};
                    nativeEnabled = (0, commands_js_1.resolveNativeCommandsEnabled)({
                        providerId: "slack",
                        providerSetting: coerceNativeSetting((_t = slackCfg.commands) === null || _t === void 0 ? void 0 : _t.native),
                        globalSetting: (_u = params.cfg.commands) === null || _u === void 0 ? void 0 : _u.native,
                    });
                    nativeSkillsEnabled = (0, commands_js_1.resolveNativeSkillsEnabled)({
                        providerId: "slack",
                        providerSetting: coerceNativeSetting((_v = slackCfg.commands) === null || _v === void 0 ? void 0 : _v.nativeSkills),
                        globalSetting: (_w = params.cfg.commands) === null || _w === void 0 ? void 0 : _w.nativeSkills,
                    });
                    slashCommandEnabled = nativeEnabled ||
                        nativeSkillsEnabled ||
                        ((_x = slackCfg.slashCommand) === null || _x === void 0 ? void 0 : _x.enabled) === true;
                    if (!slashCommandEnabled) return [3 /*break*/, 9];
                    useAccessGroups = ((_y = params.cfg.commands) === null || _y === void 0 ? void 0 : _y.useAccessGroups) !== false;
                    if (!!useAccessGroups) return [3 /*break*/, 7];
                    findings.push({
                        checkId: "channels.slack.commands.slash.useAccessGroups_off",
                        severity: "critical",
                        title: "Slack slash commands bypass access groups",
                        detail: "Slack slash/native commands are enabled while commands.useAccessGroups=false; this can allow unrestricted /… command execution from channels/users you didn't explicitly authorize.",
                        remediation: "Set commands.useAccessGroups=true (recommended).",
                    });
                    return [3 /*break*/, 9];
                case 7:
                    dmAllowFromRaw = (_z = account === null || account === void 0 ? void 0 : account.dm) === null || _z === void 0 ? void 0 : _z.allowFrom;
                    dmAllowFrom = Array.isArray(dmAllowFromRaw) ? dmAllowFromRaw : [];
                    return [4 /*yield*/, (0, pairing_store_js_1.readChannelAllowFromStore)("slack").catch(function () { return []; })];
                case 8:
                    storeAllowFrom = _13.sent();
                    ownerAllowFromConfigured = normalizeAllowFromList(__spreadArray(__spreadArray([], dmAllowFrom, true), storeAllowFrom, true)).length > 0;
                    channels = (_0 = slackCfg.channels) !== null && _0 !== void 0 ? _0 : {};
                    hasAnyChannelUsersAllowlist = Object.values(channels).some(function (value) {
                        if (!value || typeof value !== "object") {
                            return false;
                        }
                        var channel = value;
                        return Array.isArray(channel.users) && channel.users.length > 0;
                    });
                    if (!ownerAllowFromConfigured && !hasAnyChannelUsersAllowlist) {
                        findings.push({
                            checkId: "channels.slack.commands.slash.no_allowlists",
                            severity: "warn",
                            title: "Slack slash commands have no allowlists",
                            detail: "Slack slash/native commands are enabled, but neither an owner allowFrom list nor any channels.<id>.users allowlist is configured; /… commands will be rejected for everyone.",
                            remediation: "Approve yourself via pairing (recommended), or set channels.slack.dm.allowFrom and/or channels.slack.channels.<id>.users.",
                        });
                    }
                    _13.label = 9;
                case 9:
                    dmPolicy = (_2 = (_1 = plugin.security).resolveDmPolicy) === null || _2 === void 0 ? void 0 : _2.call(_1, {
                        cfg: params.cfg,
                        accountId: defaultAccountId,
                        account: account,
                    });
                    if (!dmPolicy) return [3 /*break*/, 11];
                    return [4 /*yield*/, warnDmPolicy({
                            label: (_3 = plugin.meta.label) !== null && _3 !== void 0 ? _3 : plugin.id,
                            provider: plugin.id,
                            dmPolicy: dmPolicy.policy,
                            allowFrom: dmPolicy.allowFrom,
                            policyPath: dmPolicy.policyPath,
                            allowFromPath: dmPolicy.allowFromPath,
                            normalizeEntry: dmPolicy.normalizeEntry,
                        })];
                case 10:
                    _13.sent();
                    _13.label = 11;
                case 11:
                    if (!plugin.security.collectWarnings) return [3 /*break*/, 13];
                    return [4 /*yield*/, plugin.security.collectWarnings({
                            cfg: params.cfg,
                            accountId: defaultAccountId,
                            account: account,
                        })];
                case 12:
                    warnings = _13.sent();
                    for (_c = 0, _d = warnings !== null && warnings !== void 0 ? warnings : []; _c < _d.length; _c++) {
                        message = _d[_c];
                        trimmed = String(message).trim();
                        if (!trimmed) {
                            continue;
                        }
                        findings.push({
                            checkId: "channels.".concat(plugin.id, ".warning.").concat(findings.length + 1),
                            severity: classifyChannelWarningSeverity(trimmed),
                            title: "".concat((_4 = plugin.meta.label) !== null && _4 !== void 0 ? _4 : plugin.id, " security warning"),
                            detail: trimmed.replace(/^-\s*/, ""),
                        });
                    }
                    _13.label = 13;
                case 13:
                    if (!(plugin.id === "telegram")) return [3 /*break*/, 15];
                    allowTextCommands = ((_5 = params.cfg.commands) === null || _5 === void 0 ? void 0 : _5.text) !== false;
                    if (!allowTextCommands) {
                        return [3 /*break*/, 15];
                    }
                    telegramCfg = (_6 = account === null || account === void 0 ? void 0 : account.config) !== null && _6 !== void 0 ? _6 : {};
                    defaultGroupPolicy = (_8 = (_7 = params.cfg.channels) === null || _7 === void 0 ? void 0 : _7.defaults) === null || _8 === void 0 ? void 0 : _8.groupPolicy;
                    groupPolicy = (_10 = (_9 = telegramCfg.groupPolicy) !== null && _9 !== void 0 ? _9 : defaultGroupPolicy) !== null && _10 !== void 0 ? _10 : "allowlist";
                    groups = telegramCfg.groups;
                    groupsConfigured = Boolean(groups) && Object.keys(groups !== null && groups !== void 0 ? groups : {}).length > 0;
                    groupAccessPossible = groupPolicy === "open" || (groupPolicy === "allowlist" && groupsConfigured);
                    if (!groupAccessPossible) {
                        return [3 /*break*/, 15];
                    }
                    return [4 /*yield*/, (0, pairing_store_js_1.readChannelAllowFromStore)("telegram").catch(function () { return []; })];
                case 14:
                    storeAllowFrom = _13.sent();
                    storeHasWildcard = storeAllowFrom.some(function (v) { return String(v).trim() === "*"; });
                    groupAllowFrom = Array.isArray(telegramCfg.groupAllowFrom)
                        ? telegramCfg.groupAllowFrom
                        : [];
                    groupAllowFromHasWildcard = groupAllowFrom.some(function (v) { return String(v).trim() === "*"; });
                    anyGroupOverride = Boolean(groups &&
                        Object.values(groups).some(function (value) {
                            if (!value || typeof value !== "object") {
                                return false;
                            }
                            var group = value;
                            var allowFrom = Array.isArray(group.allowFrom) ? group.allowFrom : [];
                            if (allowFrom.length > 0) {
                                return true;
                            }
                            var topics = group.topics;
                            if (!topics || typeof topics !== "object") {
                                return false;
                            }
                            return Object.values(topics).some(function (topicValue) {
                                if (!topicValue || typeof topicValue !== "object") {
                                    return false;
                                }
                                var topic = topicValue;
                                var topicAllow = Array.isArray(topic.allowFrom) ? topic.allowFrom : [];
                                return topicAllow.length > 0;
                            });
                        }));
                    hasAnySenderAllowlist = storeAllowFrom.length > 0 || groupAllowFrom.length > 0 || anyGroupOverride;
                    if (storeHasWildcard || groupAllowFromHasWildcard) {
                        findings.push({
                            checkId: "channels.telegram.groups.allowFrom.wildcard",
                            severity: "critical",
                            title: "Telegram group allowlist contains wildcard",
                            detail: 'Telegram group sender allowlist contains "*", which allows any group member to run /… commands and control directives.',
                            remediation: 'Remove "*" from channels.telegram.groupAllowFrom and pairing store; prefer explicit user ids/usernames.',
                        });
                        return [3 /*break*/, 15];
                    }
                    if (!hasAnySenderAllowlist) {
                        providerSetting = (_11 = telegramCfg.commands) === null || _11 === void 0 ? void 0 : _11.nativeSkills;
                        skillsEnabled = (0, commands_js_1.resolveNativeSkillsEnabled)({
                            providerId: "telegram",
                            providerSetting: providerSetting,
                            globalSetting: (_12 = params.cfg.commands) === null || _12 === void 0 ? void 0 : _12.nativeSkills,
                        });
                        findings.push({
                            checkId: "channels.telegram.groups.allowFrom.missing",
                            severity: "critical",
                            title: "Telegram group commands have no sender allowlist",
                            detail: "Telegram group access is enabled but no sender allowlist is configured; this allows any group member to invoke /\u2026 commands" +
                                (skillsEnabled ? " (including skill commands)." : "."),
                            remediation: "Approve yourself via pairing (recommended), or set channels.telegram.groupAllowFrom (or per-group groups.<id>.allowFrom).",
                        });
                    }
                    _13.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 1];
                case 16: return [2 /*return*/, findings];
            }
        });
    });
}
function maybeProbeGateway(params) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, url, isRemoteMode, remoteUrlRaw, remoteUrlMissing, resolveAuth, auth, res;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    connection = (0, call_js_1.buildGatewayConnectionDetails)({ config: params.cfg });
                    url = connection.url;
                    isRemoteMode = ((_a = params.cfg.gateway) === null || _a === void 0 ? void 0 : _a.mode) === "remote";
                    remoteUrlRaw = typeof ((_c = (_b = params.cfg.gateway) === null || _b === void 0 ? void 0 : _b.remote) === null || _c === void 0 ? void 0 : _c.url) === "string" ? params.cfg.gateway.remote.url.trim() : "";
                    remoteUrlMissing = isRemoteMode && !remoteUrlRaw;
                    resolveAuth = function (mode) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        var authToken = (_b = (_a = params.cfg.gateway) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
                        var authPassword = (_d = (_c = params.cfg.gateway) === null || _c === void 0 ? void 0 : _c.auth) === null || _d === void 0 ? void 0 : _d.password;
                        var remote = (_e = params.cfg.gateway) === null || _e === void 0 ? void 0 : _e.remote;
                        var token = mode === "remote"
                            ? typeof (remote === null || remote === void 0 ? void 0 : remote.token) === "string" && remote.token.trim()
                                ? remote.token.trim()
                                : undefined
                            : ((_f = process.env.OPENCLAW_GATEWAY_TOKEN) === null || _f === void 0 ? void 0 : _f.trim()) ||
                                (typeof authToken === "string" && authToken.trim() ? authToken.trim() : undefined);
                        var password = ((_g = process.env.OPENCLAW_GATEWAY_PASSWORD) === null || _g === void 0 ? void 0 : _g.trim()) ||
                            (mode === "remote"
                                ? typeof (remote === null || remote === void 0 ? void 0 : remote.password) === "string" && remote.password.trim()
                                    ? remote.password.trim()
                                    : undefined
                                : typeof authPassword === "string" && authPassword.trim()
                                    ? authPassword.trim()
                                    : undefined);
                        return { token: token, password: password };
                    };
                    auth = !isRemoteMode || remoteUrlMissing ? resolveAuth("local") : resolveAuth("remote");
                    return [4 /*yield*/, params.probe({ url: url, auth: auth, timeoutMs: params.timeoutMs }).catch(function (err) { return ({
                            ok: false,
                            url: url,
                            connectLatencyMs: null,
                            error: String(err),
                            close: null,
                            health: null,
                            status: null,
                            presence: null,
                            configSnapshot: null,
                        }); })];
                case 1:
                    res = _d.sent();
                    return [2 /*return*/, {
                            gateway: {
                                attempted: true,
                                url: url,
                                ok: res.ok,
                                error: res.ok ? null : res.error,
                                close: res.close ? { code: res.close.code, reason: res.close.reason } : null,
                            },
                        }];
            }
        });
    });
}
function runSecurityAudit(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var findings, cfg, env, platform, execIcacls, stateDir, configPath, configSnapshot, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, plugins, _p, _q, _r, deep, _s, summary;
        var _t, _u, _v, _w, _x, _y, _z, _0, _1;
        return __generator(this, function (_2) {
            switch (_2.label) {
                case 0:
                    findings = [];
                    cfg = opts.config;
                    env = (_t = opts.env) !== null && _t !== void 0 ? _t : process.env;
                    platform = (_u = opts.platform) !== null && _u !== void 0 ? _u : process.platform;
                    execIcacls = opts.execIcacls;
                    stateDir = (_v = opts.stateDir) !== null && _v !== void 0 ? _v : (0, paths_js_1.resolveStateDir)(env);
                    configPath = (_w = opts.configPath) !== null && _w !== void 0 ? _w : (0, paths_js_1.resolveConfigPath)(env, stateDir);
                    findings.push.apply(findings, (0, audit_extra_js_1.collectAttackSurfaceSummaryFindings)(cfg));
                    findings.push.apply(findings, (0, audit_extra_js_1.collectSyncedFolderFindings)({ stateDir: stateDir, configPath: configPath }));
                    findings.push.apply(findings, collectGatewayConfigFindings(cfg, env));
                    findings.push.apply(findings, collectBrowserControlFindings(cfg));
                    findings.push.apply(findings, collectLoggingFindings(cfg));
                    findings.push.apply(findings, collectElevatedFindings(cfg));
                    findings.push.apply(findings, (0, audit_extra_js_1.collectHooksHardeningFindings)(cfg));
                    findings.push.apply(findings, (0, audit_extra_js_1.collectSecretsInConfigFindings)(cfg));
                    findings.push.apply(findings, (0, audit_extra_js_1.collectModelHygieneFindings)(cfg));
                    findings.push.apply(findings, (0, audit_extra_js_1.collectSmallModelRiskFindings)({ cfg: cfg, env: env }));
                    findings.push.apply(findings, (0, audit_extra_js_1.collectExposureMatrixFindings)(cfg));
                    if (!(opts.includeFilesystem !== false)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, audit_extra_js_1.readConfigSnapshotForAudit)({ env: env, configPath: configPath }).catch(function () { return null; })];
                case 1:
                    _a = _2.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = null;
                    _2.label = 3;
                case 3:
                    configSnapshot = _a;
                    if (!(opts.includeFilesystem !== false)) return [3 /*break*/, 9];
                    _c = (_b = findings.push).apply;
                    _d = [findings];
                    return [4 /*yield*/, collectFilesystemFindings({
                            stateDir: stateDir,
                            configPath: configPath,
                            env: env,
                            platform: platform,
                            execIcacls: execIcacls,
                        })];
                case 4:
                    _c.apply(_b, _d.concat([(_2.sent())]));
                    if (!configSnapshot) return [3 /*break*/, 6];
                    _f = (_e = findings.push).apply;
                    _g = [findings];
                    return [4 /*yield*/, (0, audit_extra_js_1.collectIncludeFilePermFindings)({ configSnapshot: configSnapshot, env: env, platform: platform, execIcacls: execIcacls })];
                case 5:
                    _f.apply(_e, _g.concat([(_2.sent())]));
                    _2.label = 6;
                case 6:
                    _j = (_h = findings.push).apply;
                    _k = [findings];
                    return [4 /*yield*/, (0, audit_extra_js_1.collectStateDeepFilesystemFindings)({ cfg: cfg, env: env, stateDir: stateDir, platform: platform, execIcacls: execIcacls })];
                case 7:
                    _j.apply(_h, _k.concat([(_2.sent())]));
                    _m = (_l = findings.push).apply;
                    _o = [findings];
                    return [4 /*yield*/, (0, audit_extra_js_1.collectPluginsTrustFindings)({ cfg: cfg, stateDir: stateDir })];
                case 8:
                    _m.apply(_l, _o.concat([(_2.sent())]));
                    _2.label = 9;
                case 9:
                    if (!(opts.includeChannelSecurity !== false)) return [3 /*break*/, 11];
                    plugins = (_x = opts.plugins) !== null && _x !== void 0 ? _x : (0, index_js_1.listChannelPlugins)();
                    _q = (_p = findings.push).apply;
                    _r = [findings];
                    return [4 /*yield*/, collectChannelSecurityFindings({ cfg: cfg, plugins: plugins })];
                case 10:
                    _q.apply(_p, _r.concat([(_2.sent())]));
                    _2.label = 11;
                case 11:
                    if (!(opts.deep === true)) return [3 /*break*/, 13];
                    return [4 /*yield*/, maybeProbeGateway({
                            cfg: cfg,
                            timeoutMs: Math.max(250, (_y = opts.deepTimeoutMs) !== null && _y !== void 0 ? _y : 5000),
                            probe: (_z = opts.probeGatewayFn) !== null && _z !== void 0 ? _z : probe_js_1.probeGateway,
                        })];
                case 12:
                    _s = _2.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _s = undefined;
                    _2.label = 14;
                case 14:
                    deep = _s;
                    if (((_0 = deep === null || deep === void 0 ? void 0 : deep.gateway) === null || _0 === void 0 ? void 0 : _0.attempted) && !deep.gateway.ok) {
                        findings.push({
                            checkId: "gateway.probe_failed",
                            severity: "warn",
                            title: "Gateway probe failed (deep)",
                            detail: (_1 = deep.gateway.error) !== null && _1 !== void 0 ? _1 : "gateway unreachable",
                            remediation: "Run \"".concat((0, command_format_js_1.formatCliCommand)("openclaw status --all"), "\" to debug connectivity/auth, then re-run \"").concat((0, command_format_js_1.formatCliCommand)("openclaw security audit --deep"), "\"."),
                        });
                    }
                    summary = countBySeverity(findings);
                    return [2 /*return*/, { ts: Date.now(), summary: summary, findings: findings, deep: deep }];
            }
        });
    });
}
