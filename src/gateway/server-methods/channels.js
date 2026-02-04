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
exports.channelsHandlers = void 0;
exports.logoutChannelAccount = logoutChannelAccount;
var catalog_js_1 = require("../../channels/plugins/catalog.js");
var helpers_js_1 = require("../../channels/plugins/helpers.js");
var index_js_1 = require("../../channels/plugins/index.js");
var status_js_1 = require("../../channels/plugins/status.js");
var config_js_1 = require("../../config/config.js");
var channel_activity_js_1 = require("../../infra/channel-activity.js");
var session_key_js_1 = require("../../routing/session-key.js");
var runtime_js_1 = require("../../runtime.js");
var index_js_2 = require("../protocol/index.js");
var ws_log_js_1 = require("../ws-log.js");
function logoutChannelAccount(params) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedAccountId, account, result, cleared, loggedOut;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    resolvedAccountId = ((_a = params.accountId) === null || _a === void 0 ? void 0 : _a.trim()) ||
                        ((_c = (_b = params.plugin.config).defaultAccountId) === null || _c === void 0 ? void 0 : _c.call(_b, params.cfg)) ||
                        params.plugin.config.listAccountIds(params.cfg)[0] ||
                        session_key_js_1.DEFAULT_ACCOUNT_ID;
                    account = params.plugin.config.resolveAccount(params.cfg, resolvedAccountId);
                    return [4 /*yield*/, params.context.stopChannel(params.channelId, resolvedAccountId)];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, ((_e = (_d = params.plugin.gateway) === null || _d === void 0 ? void 0 : _d.logoutAccount) === null || _e === void 0 ? void 0 : _e.call(_d, {
                            cfg: params.cfg,
                            accountId: resolvedAccountId,
                            account: account,
                            runtime: runtime_js_1.defaultRuntime,
                        }))];
                case 2:
                    result = _f.sent();
                    if (!result) {
                        throw new Error("Channel ".concat(params.channelId, " does not support logout"));
                    }
                    cleared = Boolean(result.cleared);
                    loggedOut = typeof result.loggedOut === "boolean" ? result.loggedOut : cleared;
                    if (loggedOut) {
                        params.context.markChannelLoggedOut(params.channelId, true, resolvedAccountId);
                    }
                    return [2 /*return*/, __assign(__assign({ channel: params.channelId, accountId: resolvedAccountId }, result), { cleared: cleared })];
            }
        });
    });
}
exports.channelsHandlers = {
    "channels.status": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var probe, timeoutMsRaw, timeoutMs, cfg, runtime, plugins, pluginMap, resolveRuntimeSnapshot, isAccountEnabled, buildChannelAccounts, uiCatalog, payload, channelsMap, accountsMap, defaultAccountIdMap, _i, plugins_1, plugin, _c, accounts, defaultAccountId, defaultAccount, resolvedAccounts, fallbackAccount, summary, _d;
        var _e, _f, _g;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!(0, index_js_2.validateChannelsStatusParams)(params)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid channels.status params: ".concat((0, index_js_2.formatValidationErrors)(index_js_2.validateChannelsStatusParams.errors))));
                        return [2 /*return*/];
                    }
                    probe = params.probe === true;
                    timeoutMsRaw = params.timeoutMs;
                    timeoutMs = typeof timeoutMsRaw === "number" ? Math.max(1000, timeoutMsRaw) : 10000;
                    cfg = (0, config_js_1.loadConfig)();
                    runtime = context.getRuntimeSnapshot();
                    plugins = (0, index_js_1.listChannelPlugins)();
                    pluginMap = new Map(plugins.map(function (plugin) { return [plugin.id, plugin]; }));
                    resolveRuntimeSnapshot = function (channelId, accountId, defaultAccountId) {
                        var _a;
                        var accounts = runtime.channelAccounts[channelId];
                        var defaultRuntime = runtime.channels[channelId];
                        var raw = (_a = accounts === null || accounts === void 0 ? void 0 : accounts[accountId]) !== null && _a !== void 0 ? _a : (accountId === defaultAccountId ? defaultRuntime : undefined);
                        if (!raw) {
                            return undefined;
                        }
                        return raw;
                    };
                    isAccountEnabled = function (plugin, account) {
                        return plugin.config.isEnabled
                            ? plugin.config.isEnabled(account, cfg)
                            : !account ||
                                typeof account !== "object" ||
                                account.enabled !== false;
                    };
                    buildChannelAccounts = function (channelId) { return __awaiter(void 0, void 0, void 0, function () {
                        var plugin, accountIds, defaultAccountId, accounts, resolvedAccounts, _i, accountIds_1, accountId, account, enabled, probeResult, lastProbeAt, configured, auditResult, configured, runtimeSnapshot, snapshot, activity, defaultAccount;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    plugin = pluginMap.get(channelId);
                                    if (!plugin) {
                                        return [2 /*return*/, {
                                                accounts: [],
                                                defaultAccountId: session_key_js_1.DEFAULT_ACCOUNT_ID,
                                                defaultAccount: undefined,
                                                resolvedAccounts: {},
                                            }];
                                    }
                                    accountIds = plugin.config.listAccountIds(cfg);
                                    defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({
                                        plugin: plugin,
                                        cfg: cfg,
                                        accountIds: accountIds,
                                    });
                                    accounts = [];
                                    resolvedAccounts = {};
                                    _i = 0, accountIds_1 = accountIds;
                                    _d.label = 1;
                                case 1:
                                    if (!(_i < accountIds_1.length)) return [3 /*break*/, 12];
                                    accountId = accountIds_1[_i];
                                    account = plugin.config.resolveAccount(cfg, accountId);
                                    enabled = isAccountEnabled(plugin, account);
                                    resolvedAccounts[accountId] = account;
                                    probeResult = void 0;
                                    lastProbeAt = null;
                                    if (!(probe && enabled && ((_a = plugin.status) === null || _a === void 0 ? void 0 : _a.probeAccount))) return [3 /*break*/, 5];
                                    configured = true;
                                    if (!plugin.config.isConfigured) return [3 /*break*/, 3];
                                    return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
                                case 2:
                                    configured = _d.sent();
                                    _d.label = 3;
                                case 3:
                                    if (!configured) return [3 /*break*/, 5];
                                    return [4 /*yield*/, plugin.status.probeAccount({
                                            account: account,
                                            timeoutMs: timeoutMs,
                                            cfg: cfg,
                                        })];
                                case 4:
                                    probeResult = _d.sent();
                                    lastProbeAt = Date.now();
                                    _d.label = 5;
                                case 5:
                                    auditResult = void 0;
                                    if (!(probe && enabled && ((_b = plugin.status) === null || _b === void 0 ? void 0 : _b.auditAccount))) return [3 /*break*/, 9];
                                    configured = true;
                                    if (!plugin.config.isConfigured) return [3 /*break*/, 7];
                                    return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
                                case 6:
                                    configured = _d.sent();
                                    _d.label = 7;
                                case 7:
                                    if (!configured) return [3 /*break*/, 9];
                                    return [4 /*yield*/, plugin.status.auditAccount({
                                            account: account,
                                            timeoutMs: timeoutMs,
                                            cfg: cfg,
                                            probe: probeResult,
                                        })];
                                case 8:
                                    auditResult = _d.sent();
                                    _d.label = 9;
                                case 9:
                                    runtimeSnapshot = resolveRuntimeSnapshot(channelId, accountId, defaultAccountId);
                                    return [4 /*yield*/, (0, status_js_1.buildChannelAccountSnapshot)({
                                            plugin: plugin,
                                            cfg: cfg,
                                            accountId: accountId,
                                            runtime: runtimeSnapshot,
                                            probe: probeResult,
                                            audit: auditResult,
                                        })];
                                case 10:
                                    snapshot = _d.sent();
                                    if (lastProbeAt) {
                                        snapshot.lastProbeAt = lastProbeAt;
                                    }
                                    activity = (0, channel_activity_js_1.getChannelActivity)({
                                        channel: channelId,
                                        accountId: accountId,
                                    });
                                    if (snapshot.lastInboundAt == null) {
                                        snapshot.lastInboundAt = activity.inboundAt;
                                    }
                                    if (snapshot.lastOutboundAt == null) {
                                        snapshot.lastOutboundAt = activity.outboundAt;
                                    }
                                    accounts.push(snapshot);
                                    _d.label = 11;
                                case 11:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 12:
                                    defaultAccount = (_c = accounts.find(function (entry) { return entry.accountId === defaultAccountId; })) !== null && _c !== void 0 ? _c : accounts[0];
                                    return [2 /*return*/, { accounts: accounts, defaultAccountId: defaultAccountId, defaultAccount: defaultAccount, resolvedAccounts: resolvedAccounts }];
                            }
                        });
                    }); };
                    uiCatalog = (0, catalog_js_1.buildChannelUiCatalog)(plugins);
                    payload = {
                        ts: Date.now(),
                        channelOrder: uiCatalog.order,
                        channelLabels: uiCatalog.labels,
                        channelDetailLabels: uiCatalog.detailLabels,
                        channelSystemImages: uiCatalog.systemImages,
                        channelMeta: uiCatalog.entries,
                        channels: {},
                        channelAccounts: {},
                        channelDefaultAccountId: {},
                    };
                    channelsMap = payload.channels;
                    accountsMap = payload.channelAccounts;
                    defaultAccountIdMap = payload.channelDefaultAccountId;
                    _i = 0, plugins_1 = plugins;
                    _h.label = 1;
                case 1:
                    if (!(_i < plugins_1.length)) return [3 /*break*/, 7];
                    plugin = plugins_1[_i];
                    return [4 /*yield*/, buildChannelAccounts(plugin.id)];
                case 2:
                    _c = _h.sent(), accounts = _c.accounts, defaultAccountId = _c.defaultAccountId, defaultAccount = _c.defaultAccount, resolvedAccounts = _c.resolvedAccounts;
                    fallbackAccount = (_e = resolvedAccounts[defaultAccountId]) !== null && _e !== void 0 ? _e : plugin.config.resolveAccount(cfg, defaultAccountId);
                    if (!((_f = plugin.status) === null || _f === void 0 ? void 0 : _f.buildChannelSummary)) return [3 /*break*/, 4];
                    return [4 /*yield*/, plugin.status.buildChannelSummary({
                            account: fallbackAccount,
                            cfg: cfg,
                            defaultAccountId: defaultAccountId,
                            snapshot: defaultAccount !== null && defaultAccount !== void 0 ? defaultAccount : {
                                accountId: defaultAccountId,
                            },
                        })];
                case 3:
                    _d = _h.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _d = {
                        configured: (_g = defaultAccount === null || defaultAccount === void 0 ? void 0 : defaultAccount.configured) !== null && _g !== void 0 ? _g : false,
                    };
                    _h.label = 5;
                case 5:
                    summary = _d;
                    channelsMap[plugin.id] = summary;
                    accountsMap[plugin.id] = accounts;
                    defaultAccountIdMap[plugin.id] = defaultAccountId;
                    _h.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    respond(true, payload, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "channels.logout": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var rawChannel, channelId, plugin, accountIdRaw, accountId, snapshot, payload, err_1;
        var _c, _d;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(0, index_js_2.validateChannelsLogoutParams)(params)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid channels.logout params: ".concat((0, index_js_2.formatValidationErrors)(index_js_2.validateChannelsLogoutParams.errors))));
                        return [2 /*return*/];
                    }
                    rawChannel = params.channel;
                    channelId = typeof rawChannel === "string" ? (0, index_js_1.normalizeChannelId)(rawChannel) : null;
                    if (!channelId) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "invalid channels.logout channel"));
                        return [2 /*return*/];
                    }
                    plugin = (0, index_js_1.getChannelPlugin)(channelId);
                    if (!((_c = plugin === null || plugin === void 0 ? void 0 : plugin.gateway) === null || _c === void 0 ? void 0 : _c.logoutAccount)) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "channel ".concat(channelId, " does not support logout")));
                        return [2 /*return*/];
                    }
                    accountIdRaw = params.accountId;
                    accountId = typeof accountIdRaw === "string" ? accountIdRaw.trim() : undefined;
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _e.sent();
                    if (!snapshot.valid) {
                        respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.INVALID_REQUEST, "config invalid; fix it before logging out"));
                        return [2 /*return*/];
                    }
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, logoutChannelAccount({
                            channelId: channelId,
                            accountId: accountId,
                            cfg: (_d = snapshot.config) !== null && _d !== void 0 ? _d : {},
                            context: context,
                            plugin: plugin,
                        })];
                case 3:
                    payload = _e.sent();
                    respond(true, payload, undefined);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _e.sent();
                    respond(false, undefined, (0, index_js_2.errorShape)(index_js_2.ErrorCodes.UNAVAILABLE, (0, ws_log_js_1.formatForLog)(err_1)));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); },
};
