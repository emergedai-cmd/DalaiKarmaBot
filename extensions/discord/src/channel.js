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
exports.discordPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var runtime_js_1 = require("./runtime.js");
var meta = (0, plugin_sdk_1.getChatChannelMeta)("discord");
var discordMessageActions = {
    listActions: function (ctx) { return (0, runtime_js_1.getDiscordRuntime)().channel.discord.messageActions.listActions(ctx); },
    extractToolSend: function (ctx) { return (0, runtime_js_1.getDiscordRuntime)().channel.discord.messageActions.extractToolSend(ctx); },
    handleAction: function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.messageActions.handleAction(ctx)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); },
};
exports.discordPlugin = {
    id: "discord",
    meta: __assign({}, meta),
    onboarding: plugin_sdk_1.discordOnboardingAdapter,
    pairing: {
        idLabel: "discordUserId",
        normalizeAllowEntry: function (entry) { return entry.replace(/^(discord|user):/i, ""); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.sendMessageDiscord("user:".concat(id), plugin_sdk_1.PAIRING_APPROVED_MESSAGE)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "channel", "thread"],
        polls: true,
        reactions: true,
        threads: true,
        media: true,
        nativeCommands: true,
    },
    streaming: {
        blockStreamingCoalesceDefaults: { minChars: 1500, idleMs: 1000 },
    },
    reload: { configPrefixes: ["channels.discord"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(plugin_sdk_1.DiscordConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, plugin_sdk_1.listDiscordAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, plugin_sdk_1.resolveDiscordAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, plugin_sdk_1.resolveDefaultDiscordAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "discord",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "discord",
                accountId: accountId,
                clearBaseFields: ["token", "name"],
            });
        },
        isConfigured: function (account) { var _a; return Boolean((_a = account.token) === null || _a === void 0 ? void 0 : _a.trim()); },
        describeAccount: function (account) {
            var _a;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: Boolean((_a = account.token) === null || _a === void 0 ? void 0 : _a.trim()),
                tokenSource: account.tokenSource,
            });
        },
        resolveAllowFrom: function (_a) {
            var _b, _c;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_c = (_b = (0, plugin_sdk_1.resolveDiscordAccount)({ cfg: cfg, accountId: accountId }).config.dm) === null || _b === void 0 ? void 0 : _b.allowFrom) !== null && _c !== void 0 ? _c : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return entry.toLowerCase(); });
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.discord) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var allowFromPath = useAccountPath
                ? "channels.discord.accounts.".concat(resolvedAccountId, ".dm.")
                : "channels.discord.dm.";
            return {
                policy: (_g = (_f = account.config.dm) === null || _f === void 0 ? void 0 : _f.policy) !== null && _g !== void 0 ? _g : "pairing",
                allowFrom: (_j = (_h = account.config.dm) === null || _h === void 0 ? void 0 : _h.allowFrom) !== null && _j !== void 0 ? _j : [],
                allowFromPath: allowFromPath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("discord"),
                normalizeEntry: function (raw) { return raw.replace(/^(discord|user):/i, "").replace(/^<@!?(\d+)>$/, "$1"); },
            };
        },
        collectWarnings: function (_a) {
            var _b, _c, _d, _e, _f;
            var account = _a.account, cfg = _a.cfg;
            var warnings = [];
            var defaultGroupPolicy = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.groupPolicy;
            var groupPolicy = (_e = (_d = account.config.groupPolicy) !== null && _d !== void 0 ? _d : defaultGroupPolicy) !== null && _e !== void 0 ? _e : "open";
            var guildEntries = (_f = account.config.guilds) !== null && _f !== void 0 ? _f : {};
            var guildsConfigured = Object.keys(guildEntries).length > 0;
            var channelAllowlistConfigured = guildsConfigured;
            if (groupPolicy === "open") {
                if (channelAllowlistConfigured) {
                    warnings.push("- Discord guilds: groupPolicy=\"open\" allows any channel not explicitly denied to trigger (mention-gated). Set channels.discord.groupPolicy=\"allowlist\" and configure channels.discord.guilds.<id>.channels.");
                }
                else {
                    warnings.push("- Discord guilds: groupPolicy=\"open\" with no guild/channel allowlist; any channel can trigger (mention-gated). Set channels.discord.groupPolicy=\"allowlist\" and configure channels.discord.guilds.<id>.channels.");
                }
            }
            return warnings;
        },
    },
    groups: {
        resolveRequireMention: plugin_sdk_1.resolveDiscordGroupRequireMention,
        resolveToolPolicy: plugin_sdk_1.resolveDiscordGroupToolPolicy,
    },
    mentions: {
        stripPatterns: function () { return ["<@!?\\d+>"]; },
    },
    threading: {
        resolveReplyToMode: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg;
            return (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.discord) === null || _c === void 0 ? void 0 : _c.replyToMode) !== null && _d !== void 0 ? _d : "off";
        },
    },
    messaging: {
        normalizeTarget: plugin_sdk_1.normalizeDiscordMessagingTarget,
        targetResolver: {
            looksLikeId: plugin_sdk_1.looksLikeDiscordTargetId,
            hint: "<channelId|user:ID|channel:ID>",
        },
    },
    directory: {
        self: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); },
        listPeers: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, plugin_sdk_1.listDiscordDirectoryPeersFromConfig)(params)];
        }); }); },
        listGroups: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, plugin_sdk_1.listDiscordDirectoryGroupsFromConfig)(params)];
        }); }); },
        listPeersLive: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.listDirectoryPeersLive(params)];
        }); }); },
        listGroupsLive: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.listDirectoryGroupsLive(params)];
        }); }); },
    },
    resolver: {
        resolveTargets: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, token, resolved_1, resolved;
            var _c;
            var cfg = _b.cfg, accountId = _b.accountId, inputs = _b.inputs, kind = _b.kind;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        account = (0, plugin_sdk_1.resolveDiscordAccount)({ cfg: cfg, accountId: accountId });
                        token = (_c = account.token) === null || _c === void 0 ? void 0 : _c.trim();
                        if (!token) {
                            return [2 /*return*/, inputs.map(function (input) { return ({
                                    input: input,
                                    resolved: false,
                                    note: "missing Discord token",
                                }); })];
                        }
                        if (!(kind === "group")) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.resolveChannelAllowlist({
                                token: token,
                                entries: inputs,
                            })];
                    case 1:
                        resolved_1 = _d.sent();
                        return [2 /*return*/, resolved_1.map(function (entry) {
                                var _a, _b, _c;
                                return ({
                                    input: entry.input,
                                    resolved: entry.resolved,
                                    id: (_a = entry.channelId) !== null && _a !== void 0 ? _a : entry.guildId,
                                    name: (_c = (_b = entry.channelName) !== null && _b !== void 0 ? _b : entry.guildName) !== null && _c !== void 0 ? _c : (entry.guildId && !entry.channelId ? entry.guildId : undefined),
                                    note: entry.note,
                                });
                            })];
                    case 2: return [4 /*yield*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.resolveUserAllowlist({
                            token: token,
                            entries: inputs,
                        })];
                    case 3:
                        resolved = _d.sent();
                        return [2 /*return*/, resolved.map(function (entry) { return ({
                                input: entry.input,
                                resolved: entry.resolved,
                                id: entry.id,
                                name: entry.name,
                                note: entry.note,
                            }); })];
                }
            });
        }); },
    },
    actions: discordMessageActions,
    setup: {
        resolveAccountId: function (_a) {
            var accountId = _a.accountId;
            return (0, plugin_sdk_1.normalizeAccountId)(accountId);
        },
        applyAccountName: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, name = _a.name;
            return (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "discord",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var accountId = _a.accountId, input = _a.input;
            if (input.useEnv && accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return "DISCORD_BOT_TOKEN can only be used for the default account.";
            }
            if (!input.useEnv && !input.token) {
                return "Discord requires token (or --use-env).";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "discord",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "discord",
                })
                : namedConfig;
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { discord: __assign(__assign(__assign({}, (_c = next.channels) === null || _c === void 0 ? void 0 : _c.discord), { enabled: true }), (input.useEnv ? {} : input.token ? { token: input.token } : {})) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { discord: __assign(__assign({}, (_d = next.channels) === null || _d === void 0 ? void 0 : _d.discord), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e.discord) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign({}, (_j = (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.discord) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: true }), (input.token ? { token: input.token } : {})), _b)) }) }) });
        },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: null,
        textChunkLimit: 2000,
        pollMaxOptions: 10,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, result;
            var _c;
            var to = _b.to, text = _b.text, accountId = _b.accountId, deps = _b.deps, replyToId = _b.replyToId;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendDiscord) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getDiscordRuntime)().channel.discord.sendMessageDiscord;
                        return [4 /*yield*/, send(to, text, {
                                verbose: false,
                                replyTo: replyToId !== null && replyToId !== void 0 ? replyToId : undefined,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, __assign({ channel: "discord" }, result)];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, result;
            var _c;
            var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, deps = _b.deps, replyToId = _b.replyToId;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendDiscord) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getDiscordRuntime)().channel.discord.sendMessageDiscord;
                        return [4 /*yield*/, send(to, text, {
                                verbose: false,
                                mediaUrl: mediaUrl,
                                replyTo: replyToId !== null && replyToId !== void 0 ? replyToId : undefined,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, __assign({ channel: "discord" }, result)];
                }
            });
        }); },
        sendPoll: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var to = _b.to, poll = _b.poll, accountId = _b.accountId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.sendPollDiscord(to, poll, {
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                        })];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); },
    },
    status: {
        defaultRuntime: {
            accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID,
            running: false,
            lastStartAt: null,
            lastStopAt: null,
            lastError: null,
        },
        collectStatusIssues: plugin_sdk_1.collectDiscordStatusIssues,
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                tokenSource: (_c = snapshot.tokenSource) !== null && _c !== void 0 ? _c : "none",
                running: (_d = snapshot.running) !== null && _d !== void 0 ? _d : false,
                lastStartAt: (_e = snapshot.lastStartAt) !== null && _e !== void 0 ? _e : null,
                lastStopAt: (_f = snapshot.lastStopAt) !== null && _f !== void 0 ? _f : null,
                lastError: (_g = snapshot.lastError) !== null && _g !== void 0 ? _g : null,
                probe: snapshot.probe,
                lastProbeAt: (_h = snapshot.lastProbeAt) !== null && _h !== void 0 ? _h : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account = _b.account, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.probeDiscord(account.token, timeoutMs, {
                        includeApplication: true,
                    })];
            });
        }); },
        auditAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var _c, channelIds, unresolvedChannels, botToken, audit;
            var _d;
            var account = _b.account, timeoutMs = _b.timeoutMs, cfg = _b.cfg;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _c = (0, plugin_sdk_1.collectDiscordAuditChannelIds)({
                            cfg: cfg,
                            accountId: account.accountId,
                        }), channelIds = _c.channelIds, unresolvedChannels = _c.unresolvedChannels;
                        if (!channelIds.length && unresolvedChannels === 0) {
                            return [2 /*return*/, undefined];
                        }
                        botToken = (_d = account.token) === null || _d === void 0 ? void 0 : _d.trim();
                        if (!botToken) {
                            return [2 /*return*/, {
                                    ok: unresolvedChannels === 0,
                                    checkedChannels: 0,
                                    unresolvedChannels: unresolvedChannels,
                                    channels: [],
                                    elapsedMs: 0,
                                }];
                        }
                        return [4 /*yield*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.auditChannelPermissions({
                                token: botToken,
                                accountId: account.accountId,
                                channelIds: channelIds,
                                timeoutMs: timeoutMs,
                            })];
                    case 1:
                        audit = _e.sent();
                        return [2 /*return*/, __assign(__assign({}, audit), { unresolvedChannels: unresolvedChannels })];
                }
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe, audit = _a.audit;
            var configured = Boolean((_b = account.token) === null || _b === void 0 ? void 0 : _b.trim());
            var app = (_c = runtime === null || runtime === void 0 ? void 0 : runtime.application) !== null && _c !== void 0 ? _c : probe === null || probe === void 0 ? void 0 : probe.application;
            var bot = (_d = runtime === null || runtime === void 0 ? void 0 : runtime.bot) !== null && _d !== void 0 ? _d : probe === null || probe === void 0 ? void 0 : probe.bot;
            return {
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: configured,
                tokenSource: account.tokenSource,
                running: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _e !== void 0 ? _e : false,
                lastStartAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _f !== void 0 ? _f : null,
                lastStopAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _g !== void 0 ? _g : null,
                lastError: (_h = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _h !== void 0 ? _h : null,
                application: app !== null && app !== void 0 ? app : undefined,
                bot: bot !== null && bot !== void 0 ? bot : undefined,
                probe: probe,
                audit: audit,
                lastInboundAt: (_j = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _j !== void 0 ? _j : null,
                lastOutboundAt: (_k = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _k !== void 0 ? _k : null,
            };
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, token, discordBotLabel, probe, username, messageContent, err_1;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        account = ctx.account;
                        token = account.token.trim();
                        discordBotLabel = "";
                        _k.label = 1;
                    case 1:
                        _k.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.probeDiscord(token, 2500, {
                                includeApplication: true,
                            })];
                    case 2:
                        probe = _k.sent();
                        username = probe.ok ? (_b = (_a = probe.bot) === null || _a === void 0 ? void 0 : _a.username) === null || _b === void 0 ? void 0 : _b.trim() : null;
                        if (username) {
                            discordBotLabel = " (@".concat(username, ")");
                        }
                        ctx.setStatus({
                            accountId: account.accountId,
                            bot: probe.bot,
                            application: probe.application,
                        });
                        messageContent = (_d = (_c = probe.application) === null || _c === void 0 ? void 0 : _c.intents) === null || _d === void 0 ? void 0 : _d.messageContent;
                        if (messageContent === "disabled") {
                            (_e = ctx.log) === null || _e === void 0 ? void 0 : _e.warn("[".concat(account.accountId, "] Discord Message Content Intent is disabled; bot may not respond to channel messages. Enable it in Discord Dev Portal (Bot \u2192 Privileged Gateway Intents) or require mentions."));
                        }
                        else if (messageContent === "limited") {
                            (_f = ctx.log) === null || _f === void 0 ? void 0 : _f.info("[".concat(account.accountId, "] Discord Message Content Intent is limited; bots under 100 servers can use it without verification."));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _k.sent();
                        if ((0, runtime_js_1.getDiscordRuntime)().logging.shouldLogVerbose()) {
                            (_h = (_g = ctx.log) === null || _g === void 0 ? void 0 : _g.debug) === null || _h === void 0 ? void 0 : _h.call(_g, "[".concat(account.accountId, "] bot probe failed: ").concat(String(err_1)));
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        (_j = ctx.log) === null || _j === void 0 ? void 0 : _j.info("[".concat(account.accountId, "] starting provider").concat(discordBotLabel));
                        return [2 /*return*/, (0, runtime_js_1.getDiscordRuntime)().channel.discord.monitorDiscordProvider({
                                token: token,
                                accountId: account.accountId,
                                config: ctx.cfg,
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                                mediaMaxMb: account.config.mediaMaxMb,
                                historyLimit: account.config.historyLimit,
                            })];
                }
            });
        }); },
    },
};
