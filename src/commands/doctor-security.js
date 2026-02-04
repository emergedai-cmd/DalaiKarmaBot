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
exports.noteSecurityWarnings = noteSecurityWarnings;
var helpers_js_1 = require("../channels/plugins/helpers.js");
var index_js_1 = require("../channels/plugins/index.js");
var command_format_js_1 = require("../cli/command-format.js");
var auth_js_1 = require("../gateway/auth.js");
var net_js_1 = require("../gateway/net.js");
var pairing_store_js_1 = require("../pairing/pairing-store.js");
var note_js_1 = require("../terminal/note.js");
function noteSecurityWarnings(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var warnings, auditHint, gatewayBind, customBindHost, bindModes, bindMode, resolvedBindHost, _a, isExposed, resolvedAuth, authToken, authPassword, hasToken, hasPassword, hasSharedSecret, bindDescriptor, authFixLines, warnDmPolicy, _i, _b, plugin, accountIds, defaultAccountId, account, enabled, configured, _c, dmPolicy, extra, lines;
        var _this = this;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    warnings = [];
                    auditHint = "- Run: ".concat((0, command_format_js_1.formatCliCommand)("openclaw security audit --deep"));
                    gatewayBind = ((_e = (_d = cfg.gateway) === null || _d === void 0 ? void 0 : _d.bind) !== null && _e !== void 0 ? _e : "loopback");
                    customBindHost = (_g = (_f = cfg.gateway) === null || _f === void 0 ? void 0 : _f.customBindHost) === null || _g === void 0 ? void 0 : _g.trim();
                    bindModes = ["auto", "lan", "loopback", "custom", "tailnet"];
                    bindMode = bindModes.includes(gatewayBind)
                        ? gatewayBind
                        : undefined;
                    if (!bindMode) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, net_js_1.resolveGatewayBindHost)(bindMode, customBindHost)];
                case 1:
                    _a = _u.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = "0.0.0.0";
                    _u.label = 3;
                case 3:
                    resolvedBindHost = _a;
                    isExposed = !(0, net_js_1.isLoopbackHost)(resolvedBindHost);
                    resolvedAuth = (0, auth_js_1.resolveGatewayAuth)({
                        authConfig: (_h = cfg.gateway) === null || _h === void 0 ? void 0 : _h.auth,
                        env: process.env,
                        tailscaleMode: (_l = (_k = (_j = cfg.gateway) === null || _j === void 0 ? void 0 : _j.tailscale) === null || _k === void 0 ? void 0 : _k.mode) !== null && _l !== void 0 ? _l : "off",
                    });
                    authToken = (_o = (_m = resolvedAuth.token) === null || _m === void 0 ? void 0 : _m.trim()) !== null && _o !== void 0 ? _o : "";
                    authPassword = (_q = (_p = resolvedAuth.password) === null || _p === void 0 ? void 0 : _p.trim()) !== null && _q !== void 0 ? _q : "";
                    hasToken = authToken.length > 0;
                    hasPassword = authPassword.length > 0;
                    hasSharedSecret = (resolvedAuth.mode === "token" && hasToken) ||
                        (resolvedAuth.mode === "password" && hasPassword);
                    bindDescriptor = "\"".concat(gatewayBind, "\" (").concat(resolvedBindHost, ")");
                    if (isExposed) {
                        if (!hasSharedSecret) {
                            authFixLines = resolvedAuth.mode === "password"
                                ? [
                                    "  Fix: ".concat((0, command_format_js_1.formatCliCommand)("openclaw configure"), " to set a password"),
                                    "  Or switch to token: ".concat((0, command_format_js_1.formatCliCommand)("openclaw config set gateway.auth.mode token")),
                                ]
                                : [
                                    "  Fix: ".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix"), " to generate a token"),
                                    "  Or set token directly: ".concat((0, command_format_js_1.formatCliCommand)("openclaw config set gateway.auth.mode token")),
                                ];
                            warnings.push.apply(warnings, __spreadArray(["- CRITICAL: Gateway bound to ".concat(bindDescriptor, " without authentication."), "  Anyone on your network (or internet if port-forwarded) can fully control your agent.", "  Fix: ".concat((0, command_format_js_1.formatCliCommand)("openclaw config set gateway.bind loopback"))], authFixLines, false));
                        }
                        else {
                            // Auth is configured, but still warn about network exposure
                            warnings.push("- WARNING: Gateway bound to ".concat(bindDescriptor, " (network-accessible)."), "  Ensure your auth credentials are strong and not exposed.");
                        }
                    }
                    warnDmPolicy = function (params) { return __awaiter(_this, void 0, void 0, function () {
                        var dmPolicy, policyPath, configAllowFrom, hasWildcard, storeAllowFrom, normalizedCfg, normalizedStore, allowCount, dmScope, isMultiUserDm, allowFromPath;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    dmPolicy = params.dmPolicy;
                                    policyPath = (_a = params.policyPath) !== null && _a !== void 0 ? _a : "".concat(params.allowFromPath, "policy");
                                    configAllowFrom = ((_b = params.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (v) { return String(v).trim(); });
                                    hasWildcard = configAllowFrom.includes("*");
                                    return [4 /*yield*/, (0, pairing_store_js_1.readChannelAllowFromStore)(params.provider).catch(function () { return []; })];
                                case 1:
                                    storeAllowFrom = _e.sent();
                                    normalizedCfg = configAllowFrom
                                        .filter(function (v) { return v !== "*"; })
                                        .map(function (v) { return (params.normalizeEntry ? params.normalizeEntry(v) : v); })
                                        .map(function (v) { return v.trim(); })
                                        .filter(Boolean);
                                    normalizedStore = storeAllowFrom
                                        .map(function (v) { return (params.normalizeEntry ? params.normalizeEntry(v) : v); })
                                        .map(function (v) { return v.trim(); })
                                        .filter(Boolean);
                                    allowCount = Array.from(new Set(__spreadArray(__spreadArray([], normalizedCfg, true), normalizedStore, true))).length;
                                    dmScope = (_d = (_c = cfg.session) === null || _c === void 0 ? void 0 : _c.dmScope) !== null && _d !== void 0 ? _d : "main";
                                    isMultiUserDm = hasWildcard || allowCount > 1;
                                    if (dmPolicy === "open") {
                                        allowFromPath = "".concat(params.allowFromPath, "allowFrom");
                                        warnings.push("- ".concat(params.label, " DMs: OPEN (").concat(policyPath, "=\"open\"). Anyone can DM it."));
                                        if (!hasWildcard) {
                                            warnings.push("- ".concat(params.label, " DMs: config invalid \u2014 \"open\" requires ").concat(allowFromPath, " to include \"*\"."));
                                        }
                                    }
                                    if (dmPolicy === "disabled") {
                                        warnings.push("- ".concat(params.label, " DMs: disabled (").concat(policyPath, "=\"disabled\")."));
                                        return [2 /*return*/];
                                    }
                                    if (dmPolicy !== "open" && allowCount === 0) {
                                        warnings.push("- ".concat(params.label, " DMs: locked (").concat(policyPath, "=\"").concat(dmPolicy, "\") with no allowlist; unknown senders will be blocked / get a pairing code."));
                                        warnings.push("  ".concat(params.approveHint));
                                    }
                                    if (dmScope === "main" && isMultiUserDm) {
                                        warnings.push("- ".concat(params.label, " DMs: multiple senders share the main session; set session.dmScope=\"per-channel-peer\" (or \"per-account-channel-peer\" for multi-account channels) to isolate sessions."));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _i = 0, _b = (0, index_js_1.listChannelPlugins)();
                    _u.label = 4;
                case 4:
                    if (!(_i < _b.length)) return [3 /*break*/, 12];
                    plugin = _b[_i];
                    if (!plugin.security) {
                        return [3 /*break*/, 11];
                    }
                    accountIds = plugin.config.listAccountIds(cfg);
                    defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({
                        plugin: plugin,
                        cfg: cfg,
                        accountIds: accountIds,
                    });
                    account = plugin.config.resolveAccount(cfg, defaultAccountId);
                    enabled = plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : true;
                    if (!enabled) {
                        return [3 /*break*/, 11];
                    }
                    if (!plugin.config.isConfigured) return [3 /*break*/, 6];
                    return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
                case 5:
                    _c = _u.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _c = true;
                    _u.label = 7;
                case 7:
                    configured = _c;
                    if (!configured) {
                        return [3 /*break*/, 11];
                    }
                    dmPolicy = (_s = (_r = plugin.security).resolveDmPolicy) === null || _s === void 0 ? void 0 : _s.call(_r, {
                        cfg: cfg,
                        accountId: defaultAccountId,
                        account: account,
                    });
                    if (!dmPolicy) return [3 /*break*/, 9];
                    return [4 /*yield*/, warnDmPolicy({
                            label: (_t = plugin.meta.label) !== null && _t !== void 0 ? _t : plugin.id,
                            provider: plugin.id,
                            dmPolicy: dmPolicy.policy,
                            allowFrom: dmPolicy.allowFrom,
                            policyPath: dmPolicy.policyPath,
                            allowFromPath: dmPolicy.allowFromPath,
                            approveHint: dmPolicy.approveHint,
                            normalizeEntry: dmPolicy.normalizeEntry,
                        })];
                case 8:
                    _u.sent();
                    _u.label = 9;
                case 9:
                    if (!plugin.security.collectWarnings) return [3 /*break*/, 11];
                    return [4 /*yield*/, plugin.security.collectWarnings({
                            cfg: cfg,
                            accountId: defaultAccountId,
                            account: account,
                        })];
                case 10:
                    extra = _u.sent();
                    if (extra === null || extra === void 0 ? void 0 : extra.length) {
                        warnings.push.apply(warnings, extra);
                    }
                    _u.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 4];
                case 12:
                    lines = warnings.length > 0 ? warnings : ["- No channel security warnings detected."];
                    lines.push(auditHint);
                    (0, note_js_1.note)(lines.join("\n"), "Security");
                    return [2 /*return*/];
            }
        });
    });
}
