"use strict";
/**
 * Twitch channel plugin for OpenClaw.
 *
 * Main plugin export combining all adapters (outbound, actions, status, gateway).
 * This is the primary entry point for the Twitch channel integration.
 */
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
exports.twitchPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var actions_js_1 = require("./actions.js");
var client_manager_registry_js_1 = require("./client-manager-registry.js");
var config_schema_js_1 = require("./config-schema.js");
var config_js_1 = require("./config.js");
var onboarding_js_1 = require("./onboarding.js");
var outbound_js_1 = require("./outbound.js");
var probe_js_1 = require("./probe.js");
var resolver_js_1 = require("./resolver.js");
var status_js_1 = require("./status.js");
var token_js_1 = require("./token.js");
var twitch_js_1 = require("./utils/twitch.js");
/**
 * Twitch channel plugin.
 *
 * Implements the ChannelPlugin interface to provide Twitch chat integration
 * for OpenClaw. Supports message sending, receiving, access control, and
 * status monitoring.
 */
exports.twitchPlugin = {
    /** Plugin identifier */
    id: "twitch",
    /** Plugin metadata */
    meta: {
        id: "twitch",
        label: "Twitch",
        selectionLabel: "Twitch (Chat)",
        docsPath: "/channels/twitch",
        blurb: "Twitch chat integration",
        aliases: ["twitch-chat"],
    },
    /** Onboarding adapter */
    onboarding: onboarding_js_1.twitchOnboardingAdapter,
    /** Pairing configuration */
    pairing: {
        idLabel: "twitchUserId",
        normalizeAllowEntry: function (entry) { return entry.replace(/^(twitch:)?user:?/i, ""); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var id = _b.id;
            return __generator(this, function (_c) {
                // Note: Twitch doesn't support DMs from bots, so pairing approval is limited
                // We'll log the approval instead
                console.warn("Pairing approved for user ".concat(id, " (notification sent via chat if possible)"));
                return [2 /*return*/];
            });
        }); },
    },
    /** Supported chat capabilities */
    capabilities: {
        chatTypes: ["group"],
    },
    /** Configuration schema for Twitch channel */
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(config_schema_js_1.TwitchConfigSchema),
    /** Account configuration management */
    config: {
        /** List all configured account IDs */
        listAccountIds: function (cfg) { return (0, config_js_1.listAccountIds)(cfg); },
        /** Resolve an account config by ID */
        resolveAccount: function (cfg, accountId) {
            var account = (0, config_js_1.getAccountConfig)(cfg, accountId !== null && accountId !== void 0 ? accountId : config_js_1.DEFAULT_ACCOUNT_ID);
            if (!account) {
                // Return a default/empty account if not configured
                return {
                    username: "",
                    accessToken: "",
                    clientId: "",
                    enabled: false,
                };
            }
            return account;
        },
        /** Get the default account ID */
        defaultAccountId: function () { return config_js_1.DEFAULT_ACCOUNT_ID; },
        /** Check if an account is configured */
        isConfigured: function (_account, cfg) {
            var account = (0, config_js_1.getAccountConfig)(cfg, config_js_1.DEFAULT_ACCOUNT_ID);
            var tokenResolution = (0, token_js_1.resolveTwitchToken)(cfg, { accountId: config_js_1.DEFAULT_ACCOUNT_ID });
            return account ? (0, twitch_js_1.isAccountConfigured)(account, tokenResolution.token) : false;
        },
        /** Check if an account is enabled */
        isEnabled: function (account) { return (account === null || account === void 0 ? void 0 : account.enabled) !== false; },
        /** Describe account status */
        describeAccount: function (account) {
            return {
                accountId: config_js_1.DEFAULT_ACCOUNT_ID,
                enabled: (account === null || account === void 0 ? void 0 : account.enabled) !== false,
                configured: account ? (0, twitch_js_1.isAccountConfigured)(account, account === null || account === void 0 ? void 0 : account.accessToken) : false,
            };
        },
    },
    /** Outbound message adapter */
    outbound: outbound_js_1.twitchOutbound,
    /** Message actions adapter */
    actions: actions_js_1.twitchMessageActions,
    /** Resolver adapter for username -> user ID resolution */
    resolver: {
        resolveTargets: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, log;
            var cfg = _b.cfg, accountId = _b.accountId, inputs = _b.inputs, kind = _b.kind, runtime = _b.runtime;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = (0, config_js_1.getAccountConfig)(cfg, accountId !== null && accountId !== void 0 ? accountId : config_js_1.DEFAULT_ACCOUNT_ID);
                        if (!account) {
                            return [2 /*return*/, inputs.map(function (input) { return ({
                                    input: input,
                                    resolved: false,
                                    note: "account not configured",
                                }); })];
                        }
                        log = {
                            info: function (msg) { return runtime.log(msg); },
                            warn: function (msg) { return runtime.log(msg); },
                            error: function (msg) { return runtime.error(msg); },
                            debug: function (msg) { return runtime.log(msg); },
                        };
                        return [4 /*yield*/, (0, resolver_js_1.resolveTwitchTargets)(inputs, account, kind, log)];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); },
    },
    /** Status monitoring adapter */
    status: {
        /** Default runtime state */
        defaultRuntime: {
            accountId: config_js_1.DEFAULT_ACCOUNT_ID,
            running: false,
            lastStartAt: null,
            lastStopAt: null,
            lastError: null,
        },
        /** Build channel summary from snapshot */
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                running: (_c = snapshot.running) !== null && _c !== void 0 ? _c : false,
                lastStartAt: (_d = snapshot.lastStartAt) !== null && _d !== void 0 ? _d : null,
                lastStopAt: (_e = snapshot.lastStopAt) !== null && _e !== void 0 ? _e : null,
                lastError: (_f = snapshot.lastError) !== null && _f !== void 0 ? _f : null,
                probe: snapshot.probe,
                lastProbeAt: (_g = snapshot.lastProbeAt) !== null && _g !== void 0 ? _g : null,
            });
        },
        /** Probe account connection */
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account = _b.account, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, probe_js_1.probeTwitch)(account, timeoutMs)];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); },
        /** Build account snapshot with current status */
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h;
            var account = _a.account, cfg = _a.cfg, runtime = _a.runtime, probe = _a.probe;
            var twitch = cfg.channels;
            var twitchCfg = twitch === null || twitch === void 0 ? void 0 : twitch.twitch;
            var accountMap = (_b = twitchCfg === null || twitchCfg === void 0 ? void 0 : twitchCfg.accounts) !== null && _b !== void 0 ? _b : {};
            var resolvedAccountId = (_d = (_c = Object.entries(accountMap).find(function (_a) {
                var value = _a[1];
                return value === account;
            })) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : config_js_1.DEFAULT_ACCOUNT_ID;
            var tokenResolution = (0, token_js_1.resolveTwitchToken)(cfg, { accountId: resolvedAccountId });
            return {
                accountId: resolvedAccountId,
                enabled: (account === null || account === void 0 ? void 0 : account.enabled) !== false,
                configured: (0, twitch_js_1.isAccountConfigured)(account, tokenResolution.token),
                running: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _e !== void 0 ? _e : false,
                lastStartAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _f !== void 0 ? _f : null,
                lastStopAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _g !== void 0 ? _g : null,
                lastError: (_h = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _h !== void 0 ? _h : null,
                probe: probe,
            };
        },
        /** Collect status issues for all accounts */
        collectStatusIssues: status_js_1.collectTwitchStatusIssues,
    },
    /** Gateway adapter for connection lifecycle */
    gateway: {
        /** Start an account connection */
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, accountId, monitorTwitchProvider;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = ctx.account;
                        accountId = ctx.accountId;
                        (_a = ctx.setStatus) === null || _a === void 0 ? void 0 : _a.call(ctx, {
                            accountId: accountId,
                            running: true,
                            lastStartAt: Date.now(),
                            lastError: null,
                        });
                        (_b = ctx.log) === null || _b === void 0 ? void 0 : _b.info("Starting Twitch connection for ".concat(account.username));
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                    case 1:
                        monitorTwitchProvider = (_c.sent()).monitorTwitchProvider;
                        return [4 /*yield*/, monitorTwitchProvider({
                                account: account,
                                accountId: accountId,
                                config: ctx.cfg,
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                            })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        /** Stop an account connection */
        stopAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, accountId;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = ctx.account;
                        accountId = ctx.accountId;
                        // Disconnect and remove client manager from registry
                        return [4 /*yield*/, (0, client_manager_registry_js_1.removeClientManager)(accountId)];
                    case 1:
                        // Disconnect and remove client manager from registry
                        _c.sent();
                        (_a = ctx.setStatus) === null || _a === void 0 ? void 0 : _a.call(ctx, {
                            accountId: accountId,
                            running: false,
                            lastStopAt: Date.now(),
                        });
                        (_b = ctx.log) === null || _b === void 0 ? void 0 : _b.info("Stopped Twitch connection for ".concat(account.username));
                        return [2 /*return*/];
                }
            });
        }); },
    },
};
