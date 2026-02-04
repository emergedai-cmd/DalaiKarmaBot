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
exports.telegramPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var runtime_js_1 = require("./runtime.js");
var meta = (0, plugin_sdk_1.getChatChannelMeta)("telegram");
var telegramMessageActions = {
    listActions: function (ctx) { return (0, runtime_js_1.getTelegramRuntime)().channel.telegram.messageActions.listActions(ctx); },
    extractToolSend: function (ctx) {
        return (0, runtime_js_1.getTelegramRuntime)().channel.telegram.messageActions.extractToolSend(ctx);
    },
    handleAction: function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, runtime_js_1.getTelegramRuntime)().channel.telegram.messageActions.handleAction(ctx)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); },
};
function parseReplyToMessageId(replyToId) {
    if (!replyToId) {
        return undefined;
    }
    var parsed = Number.parseInt(replyToId, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
}
function parseThreadId(threadId) {
    if (threadId == null) {
        return undefined;
    }
    if (typeof threadId === "number") {
        return Number.isFinite(threadId) ? Math.trunc(threadId) : undefined;
    }
    var trimmed = threadId.trim();
    if (!trimmed) {
        return undefined;
    }
    var parsed = Number.parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
}
exports.telegramPlugin = {
    id: "telegram",
    meta: __assign(__assign({}, meta), { quickstartAllowFrom: true }),
    onboarding: plugin_sdk_1.telegramOnboardingAdapter,
    pairing: {
        idLabel: "telegramUserId",
        normalizeAllowEntry: function (entry) { return entry.replace(/^(telegram|tg):/i, ""); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var token;
            var cfg = _b.cfg, id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        token = (0, runtime_js_1.getTelegramRuntime)().channel.telegram.resolveTelegramToken(cfg).token;
                        if (!token) {
                            throw new Error("telegram token not configured");
                        }
                        return [4 /*yield*/, (0, runtime_js_1.getTelegramRuntime)().channel.telegram.sendMessageTelegram(id, plugin_sdk_1.PAIRING_APPROVED_MESSAGE, {
                                token: token,
                            })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "group", "channel", "thread"],
        reactions: true,
        threads: true,
        media: true,
        nativeCommands: true,
        blockStreaming: true,
    },
    reload: { configPrefixes: ["channels.telegram"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(plugin_sdk_1.TelegramConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, plugin_sdk_1.listTelegramAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, plugin_sdk_1.resolveTelegramAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, plugin_sdk_1.resolveDefaultTelegramAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "telegram",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "telegram",
                accountId: accountId,
                clearBaseFields: ["botToken", "tokenFile", "name"],
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
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, plugin_sdk_1.resolveTelegramAccount)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return entry.replace(/^(telegram|tg):/i, ""); })
                .map(function (entry) { return entry.toLowerCase(); });
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.telegram.accounts.".concat(resolvedAccountId, ".")
                : "channels.telegram.";
            return {
                policy: (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.config.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("telegram"),
                normalizeEntry: function (raw) { return raw.replace(/^(telegram|tg):/i, ""); },
            };
        },
        collectWarnings: function (_a) {
            var _b, _c, _d, _e;
            var account = _a.account, cfg = _a.cfg;
            var defaultGroupPolicy = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.groupPolicy;
            var groupPolicy = (_e = (_d = account.config.groupPolicy) !== null && _d !== void 0 ? _d : defaultGroupPolicy) !== null && _e !== void 0 ? _e : "allowlist";
            if (groupPolicy !== "open") {
                return [];
            }
            var groupAllowlistConfigured = account.config.groups && Object.keys(account.config.groups).length > 0;
            if (groupAllowlistConfigured) {
                return [
                    "- Telegram groups: groupPolicy=\"open\" allows any member in allowed groups to trigger (mention-gated). Set channels.telegram.groupPolicy=\"allowlist\" + channels.telegram.groupAllowFrom to restrict senders.",
                ];
            }
            return [
                "- Telegram groups: groupPolicy=\"open\" with no channels.telegram.groups allowlist; any group can add + ping (mention-gated). Set channels.telegram.groupPolicy=\"allowlist\" + channels.telegram.groupAllowFrom or configure channels.telegram.groups.",
            ];
        },
    },
    groups: {
        resolveRequireMention: plugin_sdk_1.resolveTelegramGroupRequireMention,
        resolveToolPolicy: plugin_sdk_1.resolveTelegramGroupToolPolicy,
    },
    threading: {
        resolveReplyToMode: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg;
            return (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.telegram) === null || _c === void 0 ? void 0 : _c.replyToMode) !== null && _d !== void 0 ? _d : "first";
        },
    },
    messaging: {
        normalizeTarget: plugin_sdk_1.normalizeTelegramMessagingTarget,
        targetResolver: {
            looksLikeId: plugin_sdk_1.looksLikeTelegramTargetId,
            hint: "<chatId>",
        },
    },
    directory: {
        self: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); },
        listPeers: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, plugin_sdk_1.listTelegramDirectoryPeersFromConfig)(params)];
        }); }); },
        listGroups: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, plugin_sdk_1.listTelegramDirectoryGroupsFromConfig)(params)];
        }); }); },
    },
    actions: telegramMessageActions,
    setup: {
        resolveAccountId: function (_a) {
            var accountId = _a.accountId;
            return (0, plugin_sdk_1.normalizeAccountId)(accountId);
        },
        applyAccountName: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, name = _a.name;
            return (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "telegram",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var accountId = _a.accountId, input = _a.input;
            if (input.useEnv && accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return "TELEGRAM_BOT_TOKEN can only be used for the default account.";
            }
            if (!input.useEnv && !input.token && !input.tokenFile) {
                return "Telegram requires token or --token-file (or --use-env).";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "telegram",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "telegram",
                })
                : namedConfig;
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { telegram: __assign(__assign(__assign({}, (_c = next.channels) === null || _c === void 0 ? void 0 : _c.telegram), { enabled: true }), (input.useEnv
                            ? {}
                            : input.tokenFile
                                ? { tokenFile: input.tokenFile }
                                : input.token
                                    ? { botToken: input.token }
                                    : {})) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { telegram: __assign(__assign({}, (_d = next.channels) === null || _d === void 0 ? void 0 : _d.telegram), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e.telegram) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign({}, (_j = (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.telegram) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: true }), (input.tokenFile
                            ? { tokenFile: input.tokenFile }
                            : input.token
                                ? { botToken: input.token }
                                : {})), _b)) }) }) });
        },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: function (text, limit) { return (0, runtime_js_1.getTelegramRuntime)().channel.text.chunkMarkdownText(text, limit); },
        chunkerMode: "markdown",
        textChunkLimit: 4000,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, replyToMessageId, messageThreadId, result;
            var _c;
            var to = _b.to, text = _b.text, accountId = _b.accountId, deps = _b.deps, replyToId = _b.replyToId, threadId = _b.threadId;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendTelegram) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getTelegramRuntime)().channel.telegram.sendMessageTelegram;
                        replyToMessageId = parseReplyToMessageId(replyToId);
                        messageThreadId = parseThreadId(threadId);
                        return [4 /*yield*/, send(to, text, {
                                verbose: false,
                                messageThreadId: messageThreadId,
                                replyToMessageId: replyToMessageId,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, __assign({ channel: "telegram" }, result)];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, replyToMessageId, messageThreadId, result;
            var _c;
            var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, deps = _b.deps, replyToId = _b.replyToId, threadId = _b.threadId;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendTelegram) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getTelegramRuntime)().channel.telegram.sendMessageTelegram;
                        replyToMessageId = parseReplyToMessageId(replyToId);
                        messageThreadId = parseThreadId(threadId);
                        return [4 /*yield*/, send(to, text, {
                                verbose: false,
                                mediaUrl: mediaUrl,
                                messageThreadId: messageThreadId,
                                replyToMessageId: replyToMessageId,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, __assign({ channel: "telegram" }, result)];
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
        collectStatusIssues: plugin_sdk_1.collectTelegramStatusIssues,
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                tokenSource: (_c = snapshot.tokenSource) !== null && _c !== void 0 ? _c : "none",
                running: (_d = snapshot.running) !== null && _d !== void 0 ? _d : false,
                mode: (_e = snapshot.mode) !== null && _e !== void 0 ? _e : null,
                lastStartAt: (_f = snapshot.lastStartAt) !== null && _f !== void 0 ? _f : null,
                lastStopAt: (_g = snapshot.lastStopAt) !== null && _g !== void 0 ? _g : null,
                lastError: (_h = snapshot.lastError) !== null && _h !== void 0 ? _h : null,
                probe: snapshot.probe,
                lastProbeAt: (_j = snapshot.lastProbeAt) !== null && _j !== void 0 ? _j : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account = _b.account, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, runtime_js_1.getTelegramRuntime)().channel.telegram.probeTelegram(account.token, timeoutMs, account.config.proxy)];
            });
        }); },
        auditAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var groups, _c, groupIds, unresolvedGroups, hasWildcardUnmentionedGroups, botId, audit;
            var _d, _e, _f, _g, _h, _j, _k, _l;
            var account = _b.account, timeoutMs = _b.timeoutMs, probe = _b.probe, cfg = _b.cfg;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        groups = (_h = (_g = (_f = (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.telegram) === null || _e === void 0 ? void 0 : _e.accounts) === null || _f === void 0 ? void 0 : _f[account.accountId]) === null || _g === void 0 ? void 0 : _g.groups) !== null && _h !== void 0 ? _h : (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.telegram) === null || _k === void 0 ? void 0 : _k.groups;
                        _c = (0, runtime_js_1.getTelegramRuntime)().channel.telegram.collectUnmentionedGroupIds(groups), groupIds = _c.groupIds, unresolvedGroups = _c.unresolvedGroups, hasWildcardUnmentionedGroups = _c.hasWildcardUnmentionedGroups;
                        if (!groupIds.length && unresolvedGroups === 0 && !hasWildcardUnmentionedGroups) {
                            return [2 /*return*/, undefined];
                        }
                        botId = (probe === null || probe === void 0 ? void 0 : probe.ok) &&
                            ((_l = probe.bot) === null || _l === void 0 ? void 0 : _l.id) != null
                            ? probe.bot.id
                            : null;
                        if (!botId) {
                            return [2 /*return*/, {
                                    ok: unresolvedGroups === 0 && !hasWildcardUnmentionedGroups,
                                    checkedGroups: 0,
                                    unresolvedGroups: unresolvedGroups,
                                    hasWildcardUnmentionedGroups: hasWildcardUnmentionedGroups,
                                    groups: [],
                                    elapsedMs: 0,
                                }];
                        }
                        return [4 /*yield*/, (0, runtime_js_1.getTelegramRuntime)().channel.telegram.auditGroupMembership({
                                token: account.token,
                                botId: botId,
                                groupIds: groupIds,
                                proxyUrl: account.config.proxy,
                                timeoutMs: timeoutMs,
                            })];
                    case 1:
                        audit = _m.sent();
                        return [2 /*return*/, __assign(__assign({}, audit), { unresolvedGroups: unresolvedGroups, hasWildcardUnmentionedGroups: hasWildcardUnmentionedGroups })];
                }
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            var account = _a.account, cfg = _a.cfg, runtime = _a.runtime, probe = _a.probe, audit = _a.audit;
            var configured = Boolean((_b = account.token) === null || _b === void 0 ? void 0 : _b.trim());
            var groups = (_g = (_f = (_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[account.accountId]) === null || _f === void 0 ? void 0 : _f.groups) !== null && _g !== void 0 ? _g : (_j = (_h = cfg.channels) === null || _h === void 0 ? void 0 : _h.telegram) === null || _j === void 0 ? void 0 : _j.groups;
            var allowUnmentionedGroups = Boolean((groups === null || groups === void 0 ? void 0 : groups["*"]) && groups["*"].requireMention === false) ||
                Object.entries(groups !== null && groups !== void 0 ? groups : {}).some(function (_a) {
                    var key = _a[0], value = _a[1];
                    return key !== "*" &&
                        Boolean(value) &&
                        typeof value === "object" &&
                        value.requireMention === false;
                });
            return {
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: configured,
                tokenSource: account.tokenSource,
                running: (_k = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _k !== void 0 ? _k : false,
                lastStartAt: (_l = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _l !== void 0 ? _l : null,
                lastStopAt: (_m = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _m !== void 0 ? _m : null,
                lastError: (_o = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _o !== void 0 ? _o : null,
                mode: (_p = runtime === null || runtime === void 0 ? void 0 : runtime.mode) !== null && _p !== void 0 ? _p : (account.config.webhookUrl ? "webhook" : "polling"),
                probe: probe,
                audit: audit,
                allowUnmentionedGroups: allowUnmentionedGroups,
                lastInboundAt: (_q = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _q !== void 0 ? _q : null,
                lastOutboundAt: (_r = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _r !== void 0 ? _r : null,
            };
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, token, telegramBotLabel, probe, username, err_1;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        account = ctx.account;
                        token = account.token.trim();
                        telegramBotLabel = "";
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, runtime_js_1.getTelegramRuntime)().channel.telegram.probeTelegram(token, 2500, account.config.proxy)];
                    case 2:
                        probe = _f.sent();
                        username = probe.ok ? (_b = (_a = probe.bot) === null || _a === void 0 ? void 0 : _a.username) === null || _b === void 0 ? void 0 : _b.trim() : null;
                        if (username) {
                            telegramBotLabel = " (@".concat(username, ")");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _f.sent();
                        if ((0, runtime_js_1.getTelegramRuntime)().logging.shouldLogVerbose()) {
                            (_d = (_c = ctx.log) === null || _c === void 0 ? void 0 : _c.debug) === null || _d === void 0 ? void 0 : _d.call(_c, "[".concat(account.accountId, "] bot probe failed: ").concat(String(err_1)));
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        (_e = ctx.log) === null || _e === void 0 ? void 0 : _e.info("[".concat(account.accountId, "] starting provider").concat(telegramBotLabel));
                        return [2 /*return*/, (0, runtime_js_1.getTelegramRuntime)().channel.telegram.monitorTelegramProvider({
                                token: token,
                                accountId: account.accountId,
                                config: ctx.cfg,
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                                useWebhook: Boolean(account.config.webhookUrl),
                                webhookUrl: account.config.webhookUrl,
                                webhookSecret: account.config.webhookSecret,
                                webhookPath: account.config.webhookPath,
                            })];
                }
            });
        }); },
        logoutAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var envToken, nextCfg, nextTelegram, cleared, changed, accounts, entry, nextEntry, token, nextChannels, resolved, loggedOut;
            var _c, _d, _e;
            var accountId = _b.accountId, cfg = _b.cfg;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        envToken = (_d = (_c = process.env.TELEGRAM_BOT_TOKEN) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
                        nextCfg = __assign({}, cfg);
                        nextTelegram = ((_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.telegram) ? __assign({}, cfg.channels.telegram) : undefined;
                        cleared = false;
                        changed = false;
                        if (nextTelegram) {
                            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID && nextTelegram.botToken) {
                                delete nextTelegram.botToken;
                                cleared = true;
                                changed = true;
                            }
                            accounts = nextTelegram.accounts && typeof nextTelegram.accounts === "object"
                                ? __assign({}, nextTelegram.accounts) : undefined;
                            if (accounts && accountId in accounts) {
                                entry = accounts[accountId];
                                if (entry && typeof entry === "object") {
                                    nextEntry = __assign({}, entry);
                                    if ("botToken" in nextEntry) {
                                        token = nextEntry.botToken;
                                        if (typeof token === "string" ? token.trim() : token) {
                                            cleared = true;
                                        }
                                        delete nextEntry.botToken;
                                        changed = true;
                                    }
                                    if (Object.keys(nextEntry).length === 0) {
                                        delete accounts[accountId];
                                        changed = true;
                                    }
                                    else {
                                        accounts[accountId] = nextEntry;
                                    }
                                }
                            }
                            if (accounts) {
                                if (Object.keys(accounts).length === 0) {
                                    delete nextTelegram.accounts;
                                    changed = true;
                                }
                                else {
                                    nextTelegram.accounts = accounts;
                                }
                            }
                        }
                        if (changed) {
                            if (nextTelegram && Object.keys(nextTelegram).length > 0) {
                                nextCfg.channels = __assign(__assign({}, nextCfg.channels), { telegram: nextTelegram });
                            }
                            else {
                                nextChannels = __assign({}, nextCfg.channels);
                                delete nextChannels.telegram;
                                if (Object.keys(nextChannels).length > 0) {
                                    nextCfg.channels = nextChannels;
                                }
                                else {
                                    delete nextCfg.channels;
                                }
                            }
                        }
                        resolved = (0, plugin_sdk_1.resolveTelegramAccount)({
                            cfg: changed ? nextCfg : cfg,
                            accountId: accountId,
                        });
                        loggedOut = resolved.tokenSource === "none";
                        if (!changed) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, runtime_js_1.getTelegramRuntime)().config.writeConfigFile(nextCfg)];
                    case 1:
                        _f.sent();
                        _f.label = 2;
                    case 2: return [2 /*return*/, { cleared: cleared, envToken: Boolean(envToken), loggedOut: loggedOut }];
                }
            });
        }); },
    },
};
