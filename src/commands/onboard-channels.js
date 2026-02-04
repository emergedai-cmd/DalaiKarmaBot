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
exports.noteChannelStatus = noteChannelStatus;
exports.setupChannels = setupChannels;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var catalog_js_1 = require("../channels/plugins/catalog.js");
var helpers_js_1 = require("../channels/plugins/helpers.js");
var index_js_1 = require("../channels/plugins/index.js");
var registry_js_1 = require("../channels/registry.js");
var command_format_js_1 = require("../cli/command-format.js");
var plugin_auto_enable_js_1 = require("../config/plugin-auto-enable.js");
var enable_js_1 = require("../plugins/enable.js");
var session_key_js_1 = require("../routing/session-key.js");
var links_js_1 = require("../terminal/links.js");
var plugin_install_js_1 = require("./onboarding/plugin-install.js");
var registry_js_2 = require("./onboarding/registry.js");
function formatAccountLabel(accountId) {
    return accountId === session_key_js_1.DEFAULT_ACCOUNT_ID ? "default (primary)" : accountId;
}
function promptConfiguredAction(params) {
    return __awaiter(this, void 0, void 0, function () {
        var prompter, label, supportsDisable, supportsDelete, updateOption, disableOption, deleteOption, skipOption, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompter = params.prompter, label = params.label, supportsDisable = params.supportsDisable, supportsDelete = params.supportsDelete;
                    updateOption = {
                        value: "update",
                        label: "Modify settings",
                    };
                    disableOption = {
                        value: "disable",
                        label: "Disable (keeps config)",
                    };
                    deleteOption = {
                        value: "delete",
                        label: "Delete config",
                    };
                    skipOption = {
                        value: "skip",
                        label: "Skip (leave as-is)",
                    };
                    options = __spreadArray(__spreadArray(__spreadArray([
                        updateOption
                    ], (supportsDisable ? [disableOption] : []), true), (supportsDelete ? [deleteOption] : []), true), [
                        skipOption,
                    ], false);
                    return [4 /*yield*/, prompter.select({
                            message: "".concat(label, " already configured. What do you want to do?"),
                            options: options,
                            initialValue: "update",
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function promptRemovalAccountId(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, prompter, label, channel, plugin, accountIds, defaultAccountId, selected;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = params.cfg, prompter = params.prompter, label = params.label, channel = params.channel;
                    plugin = (0, index_js_1.getChannelPlugin)(channel);
                    if (!plugin) {
                        return [2 /*return*/, session_key_js_1.DEFAULT_ACCOUNT_ID];
                    }
                    accountIds = plugin.config.listAccountIds(cfg).filter(Boolean);
                    defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({ plugin: plugin, cfg: cfg, accountIds: accountIds });
                    if (accountIds.length <= 1) {
                        return [2 /*return*/, defaultAccountId];
                    }
                    return [4 /*yield*/, prompter.select({
                            message: "".concat(label, " account"),
                            options: accountIds.map(function (accountId) { return ({
                                value: accountId,
                                label: formatAccountLabel(accountId),
                            }); }),
                            initialValue: defaultAccountId,
                        })];
                case 1:
                    selected = _b.sent();
                    return [2 /*return*/, (_a = (0, session_key_js_1.normalizeAccountId)(selected)) !== null && _a !== void 0 ? _a : defaultAccountId];
            }
        });
    });
}
function collectChannelStatus(params) {
    return __awaiter(this, void 0, void 0, function () {
        var installedPlugins, installedIds, workspaceDir, catalogEntries, statusEntries, statusByChannel, fallbackStatuses, catalogStatuses, combinedStatuses, mergedStatusByChannel, statusLines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    installedPlugins = (0, index_js_1.listChannelPlugins)();
                    installedIds = new Set(installedPlugins.map(function (plugin) { return plugin.id; }));
                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(params.cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(params.cfg));
                    catalogEntries = (0, catalog_js_1.listChannelPluginCatalogEntries)({ workspaceDir: workspaceDir }).filter(function (entry) { return !installedIds.has(entry.id); });
                    return [4 /*yield*/, Promise.all((0, registry_js_2.listChannelOnboardingAdapters)().map(function (adapter) {
                            return adapter.getStatus({
                                cfg: params.cfg,
                                options: params.options,
                                accountOverrides: params.accountOverrides,
                            });
                        }))];
                case 1:
                    statusEntries = _a.sent();
                    statusByChannel = new Map(statusEntries.map(function (entry) { return [entry.channel, entry]; }));
                    fallbackStatuses = (0, registry_js_1.listChatChannels)()
                        .filter(function (meta) { return !statusByChannel.has(meta.id); })
                        .map(function (meta) {
                        var configured = (0, plugin_auto_enable_js_1.isChannelConfigured)(params.cfg, meta.id);
                        var statusLabel = configured ? "configured (plugin disabled)" : "not configured";
                        return {
                            channel: meta.id,
                            configured: configured,
                            statusLines: ["".concat(meta.label, ": ").concat(statusLabel)],
                            selectionHint: configured ? "configured · plugin disabled" : "not configured",
                            quickstartScore: 0,
                        };
                    });
                    catalogStatuses = catalogEntries.map(function (entry) { return ({
                        channel: entry.id,
                        configured: false,
                        statusLines: ["".concat(entry.meta.label, ": install plugin to enable")],
                        selectionHint: "plugin · install",
                        quickstartScore: 0,
                    }); });
                    combinedStatuses = __spreadArray(__spreadArray(__spreadArray([], statusEntries, true), fallbackStatuses, true), catalogStatuses, true);
                    mergedStatusByChannel = new Map(combinedStatuses.map(function (entry) { return [entry.channel, entry]; }));
                    statusLines = combinedStatuses.flatMap(function (entry) { return entry.statusLines; });
                    return [2 /*return*/, {
                            installedPlugins: installedPlugins,
                            catalogEntries: catalogEntries,
                            statusByChannel: mergedStatusByChannel,
                            statusLines: statusLines,
                        }];
            }
        });
    });
}
function noteChannelStatus(params) {
    return __awaiter(this, void 0, void 0, function () {
        var statusLines;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, collectChannelStatus({
                        cfg: params.cfg,
                        options: params.options,
                        accountOverrides: (_a = params.accountOverrides) !== null && _a !== void 0 ? _a : {},
                    })];
                case 1:
                    statusLines = (_b.sent()).statusLines;
                    if (!(statusLines.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, params.prompter.note(statusLines.join("\n"), "Channel status")];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function noteChannelPrimer(prompter, channels) {
    return __awaiter(this, void 0, void 0, function () {
        var channelLines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    channelLines = channels.map(function (channel) {
                        return (0, registry_js_1.formatChannelPrimerLine)({
                            id: channel.id,
                            label: channel.label,
                            selectionLabel: channel.label,
                            docsPath: "/",
                            blurb: channel.blurb,
                        });
                    });
                    return [4 /*yield*/, prompter.note(__spreadArray([
                            "DM security: default is pairing; unknown DMs get a pairing code.",
                            "Approve with: ".concat((0, command_format_js_1.formatCliCommand)("openclaw pairing approve <channel> <code>")),
                            'Public DMs require dmPolicy="open" + allowFrom=["*"].',
                            'Multi-user DMs: set session.dmScope="per-channel-peer" (or "per-account-channel-peer" for multi-account channels) to isolate sessions.',
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/start/pairing", "start/pairing")),
                            ""
                        ], channelLines, true).join("\n"), "How channels work")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function resolveQuickstartDefault(statusByChannel) {
    var best = null;
    for (var _i = 0, statusByChannel_1 = statusByChannel; _i < statusByChannel_1.length; _i++) {
        var _a = statusByChannel_1[_i], channel = _a[0], status_1 = _a[1];
        if (status_1.quickstartScore == null) {
            continue;
        }
        if (!best || status_1.quickstartScore > best.score) {
            best = { channel: channel, score: status_1.quickstartScore };
        }
    }
    return best === null || best === void 0 ? void 0 : best.channel;
}
function maybeConfigureDmPolicies(params) {
    return __awaiter(this, void 0, void 0, function () {
        var selection, prompter, accountIdsByChannel, dmPolicies, wants, cfg, selectPolicy, _i, dmPolicies_1, policy, current, nextPolicy;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selection = params.selection, prompter = params.prompter, accountIdsByChannel = params.accountIdsByChannel;
                    dmPolicies = selection
                        .map(function (channel) { var _a; return (_a = (0, registry_js_2.getChannelOnboardingAdapter)(channel)) === null || _a === void 0 ? void 0 : _a.dmPolicy; })
                        .filter(Boolean);
                    if (dmPolicies.length === 0) {
                        return [2 /*return*/, params.cfg];
                    }
                    return [4 /*yield*/, prompter.confirm({
                            message: "Configure DM access policies now? (default: pairing)",
                            initialValue: false,
                        })];
                case 1:
                    wants = _a.sent();
                    if (!wants) {
                        return [2 /*return*/, params.cfg];
                    }
                    cfg = params.cfg;
                    selectPolicy = function (policy) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prompter.note([
                                        "Default: pairing (unknown DMs get a pairing code).",
                                        "Approve: ".concat((0, command_format_js_1.formatCliCommand)("openclaw pairing approve ".concat(policy.channel, " <code>"))),
                                        "Allowlist DMs: ".concat(policy.policyKey, "=\"allowlist\" + ").concat(policy.allowFromKey, " entries."),
                                        "Public DMs: ".concat(policy.policyKey, "=\"open\" + ").concat(policy.allowFromKey, " includes \"*\"."),
                                        'Multi-user DMs: set session.dmScope="per-channel-peer" (or "per-account-channel-peer" for multi-account channels) to isolate sessions.',
                                        "Docs: ".concat((0, links_js_1.formatDocsLink)("/start/pairing", "start/pairing")),
                                    ].join("\n"), "".concat(policy.label, " DM access"))];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, prompter.select({
                                            message: "".concat(policy.label, " DM policy"),
                                            options: [
                                                { value: "pairing", label: "Pairing (recommended)" },
                                                { value: "allowlist", label: "Allowlist (specific users only)" },
                                                { value: "open", label: "Open (public inbound DMs)" },
                                                { value: "disabled", label: "Disabled (ignore DMs)" },
                                            ],
                                        })];
                                case 2: return [2 /*return*/, (_a.sent())];
                            }
                        });
                    }); };
                    _i = 0, dmPolicies_1 = dmPolicies;
                    _a.label = 2;
                case 2:
                    if (!(_i < dmPolicies_1.length)) return [3 /*break*/, 6];
                    policy = dmPolicies_1[_i];
                    current = policy.getCurrent(cfg);
                    return [4 /*yield*/, selectPolicy(policy)];
                case 3:
                    nextPolicy = _a.sent();
                    if (nextPolicy !== current) {
                        cfg = policy.setPolicy(cfg, nextPolicy);
                    }
                    if (!(nextPolicy === "allowlist" && policy.promptAllowFrom)) return [3 /*break*/, 5];
                    return [4 /*yield*/, policy.promptAllowFrom({
                            cfg: cfg,
                            prompter: prompter,
                            accountId: accountIdsByChannel === null || accountIdsByChannel === void 0 ? void 0 : accountIdsByChannel.get(policy.channel),
                        })];
                case 4:
                    cfg = _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/, cfg];
            }
        });
    });
}
// Channel-specific prompts moved into onboarding adapters.
function setupChannels(cfg, runtime, prompter, options) {
    return __awaiter(this, void 0, void 0, function () {
        var next, forceAllowFromChannels, accountOverrides, _a, installedPlugins, catalogEntries, statusByChannel, statusLines, shouldConfigure, _b, corePrimer, coreIds, primerChannels, quickstartDefault, shouldPromptAccountIds, accountIdsByChannel, recordAccount, selection, addSelection, resolveDisabledHint, buildSelectionOptions, getChannelEntries, refreshStatus, ensureBundledPluginEnabled, configureChannel, handleConfiguredChannel, handleChannelChoice, entries, choice, doneValue, initialValue, entries, choice, selectionNotes, selectionEntries, _i, selectionEntries_1, entry, selectedLines;
        var _this = this;
        var _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    next = cfg;
                    forceAllowFromChannels = new Set((_c = options === null || options === void 0 ? void 0 : options.forceAllowFromChannels) !== null && _c !== void 0 ? _c : []);
                    accountOverrides = __assign({}, options === null || options === void 0 ? void 0 : options.accountIds);
                    if ((_d = options === null || options === void 0 ? void 0 : options.whatsappAccountId) === null || _d === void 0 ? void 0 : _d.trim()) {
                        accountOverrides.whatsapp = options.whatsappAccountId.trim();
                    }
                    return [4 /*yield*/, collectChannelStatus({ cfg: next, options: options, accountOverrides: accountOverrides })];
                case 1:
                    _a = _k.sent(), installedPlugins = _a.installedPlugins, catalogEntries = _a.catalogEntries, statusByChannel = _a.statusByChannel, statusLines = _a.statusLines;
                    if (!(!(options === null || options === void 0 ? void 0 : options.skipStatusNote) && statusLines.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prompter.note(statusLines.join("\n"), "Channel status")];
                case 2:
                    _k.sent();
                    _k.label = 3;
                case 3:
                    if (!(options === null || options === void 0 ? void 0 : options.skipConfirm)) return [3 /*break*/, 4];
                    _b = true;
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, prompter.confirm({
                        message: "Configure chat channels now?",
                        initialValue: true,
                    })];
                case 5:
                    _b = _k.sent();
                    _k.label = 6;
                case 6:
                    shouldConfigure = _b;
                    if (!shouldConfigure) {
                        return [2 /*return*/, cfg];
                    }
                    corePrimer = (0, registry_js_1.listChatChannels)().map(function (meta) { return ({
                        id: meta.id,
                        label: meta.label,
                        blurb: meta.blurb,
                    }); });
                    coreIds = new Set(corePrimer.map(function (entry) { return entry.id; }));
                    primerChannels = __spreadArray(__spreadArray(__spreadArray([], corePrimer, true), installedPlugins
                        .filter(function (plugin) { return !coreIds.has(plugin.id); })
                        .map(function (plugin) { return ({
                        id: plugin.id,
                        label: plugin.meta.label,
                        blurb: plugin.meta.blurb,
                    }); }), true), catalogEntries
                        .filter(function (entry) { return !coreIds.has(entry.id); })
                        .map(function (entry) { return ({
                        id: entry.id,
                        label: entry.meta.label,
                        blurb: entry.meta.blurb,
                    }); }), true);
                    return [4 /*yield*/, noteChannelPrimer(prompter, primerChannels)];
                case 7:
                    _k.sent();
                    quickstartDefault = (_f = (_e = options === null || options === void 0 ? void 0 : options.initialSelection) === null || _e === void 0 ? void 0 : _e[0]) !== null && _f !== void 0 ? _f : resolveQuickstartDefault(statusByChannel);
                    shouldPromptAccountIds = (options === null || options === void 0 ? void 0 : options.promptAccountIds) === true;
                    accountIdsByChannel = new Map();
                    recordAccount = function (channel, accountId) {
                        var _a, _b;
                        (_a = options === null || options === void 0 ? void 0 : options.onAccountId) === null || _a === void 0 ? void 0 : _a.call(options, channel, accountId);
                        var adapter = (0, registry_js_2.getChannelOnboardingAdapter)(channel);
                        (_b = adapter === null || adapter === void 0 ? void 0 : adapter.onAccountRecorded) === null || _b === void 0 ? void 0 : _b.call(adapter, accountId, options);
                        accountIdsByChannel.set(channel, accountId);
                    };
                    selection = [];
                    addSelection = function (channel) {
                        if (!selection.includes(channel)) {
                            selection.push(channel);
                        }
                    };
                    resolveDisabledHint = function (channel) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        var plugin = (0, index_js_1.getChannelPlugin)(channel);
                        if (!plugin) {
                            if (((_c = (_b = (_a = next.plugins) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b[channel]) === null || _c === void 0 ? void 0 : _c.enabled) === false) {
                                return "plugin disabled";
                            }
                            if (((_d = next.plugins) === null || _d === void 0 ? void 0 : _d.enabled) === false) {
                                return "plugins disabled";
                            }
                            return undefined;
                        }
                        var accountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({ plugin: plugin, cfg: next });
                        var account = plugin.config.resolveAccount(next, accountId);
                        var enabled;
                        if (plugin.config.isEnabled) {
                            enabled = plugin.config.isEnabled(account, next);
                        }
                        else if (typeof (account === null || account === void 0 ? void 0 : account.enabled) === "boolean") {
                            enabled = account.enabled;
                        }
                        else if (typeof ((_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e[channel]) === null || _f === void 0 ? void 0 : _f.enabled) === "boolean") {
                            enabled = (_g = next.channels[channel]) === null || _g === void 0 ? void 0 : _g.enabled;
                        }
                        return enabled === false ? "disabled" : undefined;
                    };
                    buildSelectionOptions = function (entries) {
                        return entries.map(function (entry) {
                            var _a;
                            var status = statusByChannel.get(entry.id);
                            var disabledHint = resolveDisabledHint(entry.id);
                            var hint = [status === null || status === void 0 ? void 0 : status.selectionHint, disabledHint].filter(Boolean).join(" · ") || undefined;
                            return __assign({ value: entry.meta.id, label: (_a = entry.meta.selectionLabel) !== null && _a !== void 0 ? _a : entry.meta.label }, (hint ? { hint: hint } : {}));
                        });
                    };
                    getChannelEntries = function () {
                        var core = (0, registry_js_1.listChatChannels)();
                        var installed = (0, index_js_1.listChannelPlugins)();
                        var installedIds = new Set(installed.map(function (plugin) { return plugin.id; }));
                        var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(next, (0, agent_scope_js_1.resolveDefaultAgentId)(next));
                        var catalog = (0, catalog_js_1.listChannelPluginCatalogEntries)({ workspaceDir: workspaceDir }).filter(function (entry) { return !installedIds.has(entry.id); });
                        var metaById = new Map();
                        for (var _i = 0, core_1 = core; _i < core_1.length; _i++) {
                            var meta = core_1[_i];
                            metaById.set(meta.id, meta);
                        }
                        for (var _a = 0, installed_1 = installed; _a < installed_1.length; _a++) {
                            var plugin = installed_1[_a];
                            metaById.set(plugin.id, plugin.meta);
                        }
                        for (var _b = 0, catalog_1 = catalog; _b < catalog_1.length; _b++) {
                            var entry = catalog_1[_b];
                            if (!metaById.has(entry.id)) {
                                metaById.set(entry.id, entry.meta);
                            }
                        }
                        var entries = Array.from(metaById, function (_a) {
                            var id = _a[0], meta = _a[1];
                            return ({
                                id: id,
                                meta: meta,
                            });
                        });
                        return {
                            entries: entries,
                            catalog: catalog,
                            catalogById: new Map(catalog.map(function (entry) { return [entry.id, entry]; })),
                        };
                    };
                    refreshStatus = function (channel) { return __awaiter(_this, void 0, void 0, function () {
                        var adapter, status;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    adapter = (0, registry_js_2.getChannelOnboardingAdapter)(channel);
                                    if (!adapter) {
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, adapter.getStatus({ cfg: next, options: options, accountOverrides: accountOverrides })];
                                case 1:
                                    status = _a.sent();
                                    statusByChannel.set(channel, status);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    ensureBundledPluginEnabled = function (channel) { return __awaiter(_this, void 0, void 0, function () {
                        var result, workspaceDir;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if ((0, index_js_1.getChannelPlugin)(channel)) {
                                        return [2 /*return*/, true];
                                    }
                                    result = (0, enable_js_1.enablePluginInConfig)(next, channel);
                                    next = result.config;
                                    if (!!result.enabled) return [3 /*break*/, 2];
                                    return [4 /*yield*/, prompter.note("Cannot enable ".concat(channel, ": ").concat((_a = result.reason) !== null && _a !== void 0 ? _a : "plugin disabled", "."), "Channel setup")];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/, false];
                                case 2:
                                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(next, (0, agent_scope_js_1.resolveDefaultAgentId)(next));
                                    (0, plugin_install_js_1.reloadOnboardingPluginRegistry)({
                                        cfg: next,
                                        runtime: runtime,
                                        workspaceDir: workspaceDir,
                                    });
                                    if (!!(0, index_js_1.getChannelPlugin)(channel)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, prompter.note("".concat(channel, " plugin not available."), "Channel setup")];
                                case 3:
                                    _b.sent();
                                    return [2 /*return*/, false];
                                case 4: return [4 /*yield*/, refreshStatus(channel)];
                                case 5:
                                    _b.sent();
                                    return [2 /*return*/, true];
                            }
                        });
                    }); };
                    configureChannel = function (channel) { return __awaiter(_this, void 0, void 0, function () {
                        var adapter, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    adapter = (0, registry_js_2.getChannelOnboardingAdapter)(channel);
                                    if (!!adapter) return [3 /*break*/, 2];
                                    return [4 /*yield*/, prompter.note("".concat(channel, " does not support onboarding yet."), "Channel setup")];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                                case 2: return [4 /*yield*/, adapter.configure({
                                        cfg: next,
                                        runtime: runtime,
                                        prompter: prompter,
                                        options: options,
                                        accountOverrides: accountOverrides,
                                        shouldPromptAccountIds: shouldPromptAccountIds,
                                        forceAllowFrom: forceAllowFromChannels.has(channel),
                                    })];
                                case 3:
                                    result = _a.sent();
                                    next = result.cfg;
                                    if (result.accountId) {
                                        recordAccount(channel, result.accountId);
                                    }
                                    addSelection(channel);
                                    return [4 /*yield*/, refreshStatus(channel)];
                                case 4:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    handleConfiguredChannel = function (channel, label) { return __awaiter(_this, void 0, void 0, function () {
                        var plugin, adapter, supportsDisable, supportsDelete, action, shouldPromptAccount, accountId, _a, resolvedAccountId, accountLabel, confirmed;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    plugin = (0, index_js_1.getChannelPlugin)(channel);
                                    adapter = (0, registry_js_2.getChannelOnboardingAdapter)(channel);
                                    supportsDisable = Boolean((options === null || options === void 0 ? void 0 : options.allowDisable) && ((plugin === null || plugin === void 0 ? void 0 : plugin.config.setAccountEnabled) || (adapter === null || adapter === void 0 ? void 0 : adapter.disable)));
                                    supportsDelete = Boolean((options === null || options === void 0 ? void 0 : options.allowDisable) && (plugin === null || plugin === void 0 ? void 0 : plugin.config.deleteAccount));
                                    return [4 /*yield*/, promptConfiguredAction({
                                            prompter: prompter,
                                            label: label,
                                            supportsDisable: supportsDisable,
                                            supportsDelete: supportsDelete,
                                        })];
                                case 1:
                                    action = _c.sent();
                                    if (action === "skip") {
                                        return [2 /*return*/];
                                    }
                                    if (!(action === "update")) return [3 /*break*/, 3];
                                    return [4 /*yield*/, configureChannel(channel)];
                                case 2:
                                    _c.sent();
                                    return [2 /*return*/];
                                case 3:
                                    if (!(options === null || options === void 0 ? void 0 : options.allowDisable)) {
                                        return [2 /*return*/];
                                    }
                                    if (!(action === "delete" && !supportsDelete)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, prompter.note("".concat(label, " does not support deleting config entries."), "Remove channel")];
                                case 4:
                                    _c.sent();
                                    return [2 /*return*/];
                                case 5:
                                    shouldPromptAccount = action === "delete"
                                        ? Boolean(plugin === null || plugin === void 0 ? void 0 : plugin.config.deleteAccount)
                                        : Boolean(plugin === null || plugin === void 0 ? void 0 : plugin.config.setAccountEnabled);
                                    if (!shouldPromptAccount) return [3 /*break*/, 7];
                                    return [4 /*yield*/, promptRemovalAccountId({
                                            cfg: next,
                                            prompter: prompter,
                                            label: label,
                                            channel: channel,
                                        })];
                                case 6:
                                    _a = _c.sent();
                                    return [3 /*break*/, 8];
                                case 7:
                                    _a = session_key_js_1.DEFAULT_ACCOUNT_ID;
                                    _c.label = 8;
                                case 8:
                                    accountId = _a;
                                    resolvedAccountId = (_b = (0, session_key_js_1.normalizeAccountId)(accountId)) !== null && _b !== void 0 ? _b : (plugin ? (0, helpers_js_1.resolveChannelDefaultAccountId)({ plugin: plugin, cfg: next }) : session_key_js_1.DEFAULT_ACCOUNT_ID);
                                    accountLabel = formatAccountLabel(resolvedAccountId);
                                    if (!(action === "delete")) return [3 /*break*/, 11];
                                    return [4 /*yield*/, prompter.confirm({
                                            message: "Delete ".concat(label, " account \"").concat(accountLabel, "\"?"),
                                            initialValue: false,
                                        })];
                                case 9:
                                    confirmed = _c.sent();
                                    if (!confirmed) {
                                        return [2 /*return*/];
                                    }
                                    if (plugin === null || plugin === void 0 ? void 0 : plugin.config.deleteAccount) {
                                        next = plugin.config.deleteAccount({ cfg: next, accountId: resolvedAccountId });
                                    }
                                    return [4 /*yield*/, refreshStatus(channel)];
                                case 10:
                                    _c.sent();
                                    return [2 /*return*/];
                                case 11:
                                    if (plugin === null || plugin === void 0 ? void 0 : plugin.config.setAccountEnabled) {
                                        next = plugin.config.setAccountEnabled({
                                            cfg: next,
                                            accountId: resolvedAccountId,
                                            enabled: false,
                                        });
                                    }
                                    else if (adapter === null || adapter === void 0 ? void 0 : adapter.disable) {
                                        next = adapter.disable(next);
                                    }
                                    return [4 /*yield*/, refreshStatus(channel)];
                                case 12:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    handleChannelChoice = function (channel) { return __awaiter(_this, void 0, void 0, function () {
                        var catalogById, catalogEntry, workspaceDir, result, enabled, plugin, label, status, configured;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    catalogById = getChannelEntries().catalogById;
                                    catalogEntry = catalogById.get(channel);
                                    if (!catalogEntry) return [3 /*break*/, 3];
                                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(next, (0, agent_scope_js_1.resolveDefaultAgentId)(next));
                                    return [4 /*yield*/, (0, plugin_install_js_1.ensureOnboardingPluginInstalled)({
                                            cfg: next,
                                            entry: catalogEntry,
                                            prompter: prompter,
                                            runtime: runtime,
                                            workspaceDir: workspaceDir,
                                        })];
                                case 1:
                                    result = _d.sent();
                                    next = result.cfg;
                                    if (!result.installed) {
                                        return [2 /*return*/];
                                    }
                                    (0, plugin_install_js_1.reloadOnboardingPluginRegistry)({
                                        cfg: next,
                                        runtime: runtime,
                                        workspaceDir: workspaceDir,
                                    });
                                    return [4 /*yield*/, refreshStatus(channel)];
                                case 2:
                                    _d.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, ensureBundledPluginEnabled(channel)];
                                case 4:
                                    enabled = _d.sent();
                                    if (!enabled) {
                                        return [2 /*return*/];
                                    }
                                    _d.label = 5;
                                case 5:
                                    plugin = (0, index_js_1.getChannelPlugin)(channel);
                                    label = (_b = (_a = plugin === null || plugin === void 0 ? void 0 : plugin.meta.label) !== null && _a !== void 0 ? _a : catalogEntry === null || catalogEntry === void 0 ? void 0 : catalogEntry.meta.label) !== null && _b !== void 0 ? _b : channel;
                                    status = statusByChannel.get(channel);
                                    configured = (_c = status === null || status === void 0 ? void 0 : status.configured) !== null && _c !== void 0 ? _c : false;
                                    if (!configured) return [3 /*break*/, 7];
                                    return [4 /*yield*/, handleConfiguredChannel(channel, label)];
                                case 6:
                                    _d.sent();
                                    return [2 /*return*/];
                                case 7: return [4 /*yield*/, configureChannel(channel)];
                                case 8:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!(options === null || options === void 0 ? void 0 : options.quickstartDefaults)) return [3 /*break*/, 11];
                    entries = getChannelEntries().entries;
                    return [4 /*yield*/, prompter.select({
                            message: "Select channel (QuickStart)",
                            options: __spreadArray(__spreadArray([], buildSelectionOptions(entries), true), [
                                {
                                    value: "__skip__",
                                    label: "Skip for now",
                                    hint: "You can add channels later via `".concat((0, command_format_js_1.formatCliCommand)("openclaw channels add"), "`"),
                                },
                            ], false),
                            initialValue: quickstartDefault,
                        })];
                case 8:
                    choice = (_k.sent());
                    if (!(choice !== "__skip__")) return [3 /*break*/, 10];
                    return [4 /*yield*/, handleChannelChoice(choice)];
                case 9:
                    _k.sent();
                    _k.label = 10;
                case 10: return [3 /*break*/, 15];
                case 11:
                    doneValue = "__done__";
                    initialValue = (_h = (_g = options === null || options === void 0 ? void 0 : options.initialSelection) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : quickstartDefault;
                    _k.label = 12;
                case 12:
                    if (!true) return [3 /*break*/, 15];
                    entries = getChannelEntries().entries;
                    return [4 /*yield*/, prompter.select({
                            message: "Select a channel",
                            options: __spreadArray(__spreadArray([], buildSelectionOptions(entries), true), [
                                {
                                    value: doneValue,
                                    label: "Finished",
                                    hint: selection.length > 0 ? "Done" : "Skip for now",
                                },
                            ], false),
                            initialValue: initialValue,
                        })];
                case 13:
                    choice = (_k.sent());
                    if (choice === doneValue) {
                        return [3 /*break*/, 15];
                    }
                    return [4 /*yield*/, handleChannelChoice(choice)];
                case 14:
                    _k.sent();
                    return [3 /*break*/, 12];
                case 15:
                    (_j = options === null || options === void 0 ? void 0 : options.onSelection) === null || _j === void 0 ? void 0 : _j.call(options, selection);
                    selectionNotes = new Map();
                    selectionEntries = getChannelEntries().entries;
                    for (_i = 0, selectionEntries_1 = selectionEntries; _i < selectionEntries_1.length; _i++) {
                        entry = selectionEntries_1[_i];
                        selectionNotes.set(entry.id, (0, registry_js_1.formatChannelSelectionLine)(entry.meta, links_js_1.formatDocsLink));
                    }
                    selectedLines = selection
                        .map(function (channel) { return selectionNotes.get(channel); })
                        .filter(function (line) { return Boolean(line); });
                    if (!(selectedLines.length > 0)) return [3 /*break*/, 17];
                    return [4 /*yield*/, prompter.note(selectedLines.join("\n"), "Selected channels")];
                case 16:
                    _k.sent();
                    _k.label = 17;
                case 17:
                    if (!!(options === null || options === void 0 ? void 0 : options.skipDmPolicyPrompt)) return [3 /*break*/, 19];
                    return [4 /*yield*/, maybeConfigureDmPolicies({
                            cfg: next,
                            selection: selection,
                            prompter: prompter,
                            accountIdsByChannel: accountIdsByChannel,
                        })];
                case 18:
                    next = _k.sent();
                    _k.label = 19;
                case 19: return [2 /*return*/, next];
            }
        });
    });
}
