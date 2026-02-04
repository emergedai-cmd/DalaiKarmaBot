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
exports.whatsappPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var runtime_js_1 = require("./runtime.js");
var meta = (0, plugin_sdk_1.getChatChannelMeta)("whatsapp");
var escapeRegExp = function (value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
exports.whatsappPlugin = {
    id: "whatsapp",
    meta: __assign(__assign({}, meta), { showConfigured: false, quickstartAllowFrom: true, forceAccountBinding: true, preferSessionLookupForAnnounceTarget: true }),
    onboarding: plugin_sdk_1.whatsappOnboardingAdapter,
    agentTools: function () { return [(0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.createLoginTool()]; },
    pairing: {
        idLabel: "whatsappSenderId",
    },
    capabilities: {
        chatTypes: ["direct", "group"],
        polls: true,
        reactions: true,
        media: true,
    },
    reload: { configPrefixes: ["web"], noopPrefixes: ["channels.whatsapp"] },
    gatewayMethods: ["web.login.start", "web.login.wait"],
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(plugin_sdk_1.WhatsAppConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, plugin_sdk_1.listWhatsAppAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, plugin_sdk_1.resolveWhatsAppAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, plugin_sdk_1.resolveDefaultWhatsAppAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var _b;
            var _c, _d, _e, _f;
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            var accountKey = accountId || plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var accounts = __assign({}, (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.whatsapp) === null || _d === void 0 ? void 0 : _d.accounts);
            var existing = (_e = accounts[accountKey]) !== null && _e !== void 0 ? _e : {};
            return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { whatsapp: __assign(__assign({}, (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.whatsapp), { accounts: __assign(__assign({}, accounts), (_b = {}, _b[accountKey] = __assign(__assign({}, existing), { enabled: enabled }), _b)) }) }) });
        },
        deleteAccount: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg, accountId = _a.accountId;
            var accountKey = accountId || plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var accounts = __assign({}, (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.whatsapp) === null || _c === void 0 ? void 0 : _c.accounts);
            delete accounts[accountKey];
            return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { whatsapp: __assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.whatsapp), { accounts: Object.keys(accounts).length ? accounts : undefined }) }) });
        },
        isEnabled: function (account, cfg) { var _a; return account.enabled && ((_a = cfg.web) === null || _a === void 0 ? void 0 : _a.enabled) !== false; },
        disabledReason: function () { return "disabled"; },
        isConfigured: function (account) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.webAuthExists(account.authDir)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); },
        unconfiguredReason: function () { return "not linked"; },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: Boolean(account.authDir),
            linked: Boolean(account.authDir),
            dmPolicy: account.dmPolicy,
            allowFrom: account.allowFrom,
        }); },
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return (_b = (0, plugin_sdk_1.resolveWhatsAppAccount)({ cfg: cfg, accountId: accountId }).allowFrom) !== null && _b !== void 0 ? _b : [];
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(function (entry) { return Boolean(entry); })
                .map(function (entry) { return (entry === "*" ? entry : (0, plugin_sdk_1.normalizeWhatsAppTarget)(entry)); })
                .filter(function (entry) { return Boolean(entry); });
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.whatsapp) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.whatsapp.accounts.".concat(resolvedAccountId, ".")
                : "channels.whatsapp.";
            return {
                policy: (_f = account.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("whatsapp"),
                normalizeEntry: function (raw) { return (0, plugin_sdk_1.normalizeE164)(raw); },
            };
        },
        collectWarnings: function (_a) {
            var _b, _c, _d, _e, _f;
            var account = _a.account, cfg = _a.cfg;
            var defaultGroupPolicy = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.groupPolicy;
            var groupPolicy = (_e = (_d = account.groupPolicy) !== null && _d !== void 0 ? _d : defaultGroupPolicy) !== null && _e !== void 0 ? _e : "allowlist";
            if (groupPolicy !== "open") {
                return [];
            }
            var groupAllowlistConfigured = Boolean(account.groups) && Object.keys((_f = account.groups) !== null && _f !== void 0 ? _f : {}).length > 0;
            if (groupAllowlistConfigured) {
                return [
                    "- WhatsApp groups: groupPolicy=\"open\" allows any member in allowed groups to trigger (mention-gated). Set channels.whatsapp.groupPolicy=\"allowlist\" + channels.whatsapp.groupAllowFrom to restrict senders.",
                ];
            }
            return [
                "- WhatsApp groups: groupPolicy=\"open\" with no channels.whatsapp.groups allowlist; any group can add + ping (mention-gated). Set channels.whatsapp.groupPolicy=\"allowlist\" + channels.whatsapp.groupAllowFrom or configure channels.whatsapp.groups.",
            ];
        },
    },
    setup: {
        resolveAccountId: function (_a) {
            var accountId = _a.accountId;
            return (0, plugin_sdk_1.normalizeAccountId)(accountId);
        },
        applyAccountName: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, name = _a.name;
            return (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "whatsapp",
                accountId: accountId,
                name: name,
                alwaysUseAccounts: true,
            });
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "whatsapp",
                accountId: accountId,
                name: input.name,
                alwaysUseAccounts: true,
            });
            var next = (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                cfg: namedConfig,
                channelKey: "whatsapp",
                alwaysUseAccounts: true,
            });
            var entry = __assign(__assign(__assign({}, (_e = (_d = (_c = next.channels) === null || _c === void 0 ? void 0 : _c.whatsapp) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[accountId]), (input.authDir ? { authDir: input.authDir } : {})), { enabled: true });
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { whatsapp: __assign(__assign({}, (_f = next.channels) === null || _f === void 0 ? void 0 : _f.whatsapp), { accounts: __assign(__assign({}, (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.whatsapp) === null || _h === void 0 ? void 0 : _h.accounts), (_b = {}, _b[accountId] = entry, _b)) }) }) });
        },
    },
    groups: {
        resolveRequireMention: plugin_sdk_1.resolveWhatsAppGroupRequireMention,
        resolveToolPolicy: plugin_sdk_1.resolveWhatsAppGroupToolPolicy,
        resolveGroupIntroHint: function () {
            return "WhatsApp IDs: SenderId is the participant JID; [message_id: ...] is the message id for reactions (use SenderId as participant).";
        },
    },
    mentions: {
        stripPatterns: function (_a) {
            var _b;
            var ctx = _a.ctx;
            var selfE164 = ((_b = ctx.To) !== null && _b !== void 0 ? _b : "").replace(/^whatsapp:/, "");
            if (!selfE164) {
                return [];
            }
            var escaped = escapeRegExp(selfE164);
            return [escaped, "@".concat(escaped)];
        },
    },
    commands: {
        enforceOwnerForCommands: true,
        skipWhenConfigEmpty: true,
    },
    messaging: {
        normalizeTarget: plugin_sdk_1.normalizeWhatsAppMessagingTarget,
        targetResolver: {
            looksLikeId: plugin_sdk_1.looksLikeWhatsAppTargetId,
            hint: "<E.164|group JID>",
        },
    },
    directory: {
        self: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, _c, e164, jid, id;
            var cfg = _b.cfg, accountId = _b.accountId;
            return __generator(this, function (_d) {
                account = (0, plugin_sdk_1.resolveWhatsAppAccount)({ cfg: cfg, accountId: accountId });
                _c = (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.readWebSelfId(account.authDir), e164 = _c.e164, jid = _c.jid;
                id = e164 !== null && e164 !== void 0 ? e164 : jid;
                if (!id) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, {
                        kind: "user",
                        id: id,
                        name: account.name,
                        raw: { e164: e164, jid: jid },
                    }];
            });
        }); },
        listPeers: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, plugin_sdk_1.listWhatsAppDirectoryPeersFromConfig)(params)];
        }); }); },
        listGroups: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, plugin_sdk_1.listWhatsAppDirectoryGroupsFromConfig)(params)];
        }); }); },
    },
    actions: {
        listActions: function (_a) {
            var _b;
            var cfg = _a.cfg;
            if (!((_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.whatsapp)) {
                return [];
            }
            var gate = (0, plugin_sdk_1.createActionGate)(cfg.channels.whatsapp.actions);
            var actions = new Set();
            if (gate("reactions")) {
                actions.add("react");
            }
            if (gate("polls")) {
                actions.add("poll");
            }
            return Array.from(actions);
        },
        supportsAction: function (_a) {
            var action = _a.action;
            return action === "react";
        },
        handleAction: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var messageId, emoji, remove;
            var _c;
            var action = _b.action, params = _b.params, cfg = _b.cfg, accountId = _b.accountId;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (action !== "react") {
                            throw new Error("Action ".concat(action, " is not supported for provider ").concat(meta.id, "."));
                        }
                        messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", {
                            required: true,
                        });
                        emoji = (0, plugin_sdk_1.readStringParam)(params, "emoji", { allowEmpty: true });
                        remove = typeof params.remove === "boolean" ? params.remove : undefined;
                        return [4 /*yield*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.handleWhatsAppAction({
                                action: "react",
                                chatJid: (_c = (0, plugin_sdk_1.readStringParam)(params, "chatJid")) !== null && _c !== void 0 ? _c : (0, plugin_sdk_1.readStringParam)(params, "to", { required: true }),
                                messageId: messageId,
                                emoji: emoji,
                                remove: remove,
                                participant: (0, plugin_sdk_1.readStringParam)(params, "participant"),
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                                fromMe: typeof params.fromMe === "boolean" ? params.fromMe : undefined,
                            }, cfg)];
                    case 1: return [2 /*return*/, _d.sent()];
                }
            });
        }); },
    },
    outbound: {
        deliveryMode: "gateway",
        chunker: function (text, limit) { return (0, runtime_js_1.getWhatsAppRuntime)().channel.text.chunkText(text, limit); },
        chunkerMode: "text",
        textChunkLimit: 4000,
        pollMaxOptions: 12,
        resolveTarget: function (_a) {
            var _b;
            var to = _a.to, allowFrom = _a.allowFrom, mode = _a.mode;
            var trimmed = (_b = to === null || to === void 0 ? void 0 : to.trim()) !== null && _b !== void 0 ? _b : "";
            var allowListRaw = (allowFrom !== null && allowFrom !== void 0 ? allowFrom : []).map(function (entry) { return String(entry).trim(); }).filter(Boolean);
            var hasWildcard = allowListRaw.includes("*");
            var allowList = allowListRaw
                .filter(function (entry) { return entry !== "*"; })
                .map(function (entry) { return (0, plugin_sdk_1.normalizeWhatsAppTarget)(entry); })
                .filter(function (entry) { return Boolean(entry); });
            if (trimmed) {
                var normalizedTo = (0, plugin_sdk_1.normalizeWhatsAppTarget)(trimmed);
                if (!normalizedTo) {
                    if ((mode === "implicit" || mode === "heartbeat") && allowList.length > 0) {
                        return { ok: true, to: allowList[0] };
                    }
                    return {
                        ok: false,
                        error: (0, plugin_sdk_1.missingTargetError)("WhatsApp", "<E.164|group JID> or channels.whatsapp.allowFrom[0]"),
                    };
                }
                if ((0, plugin_sdk_1.isWhatsAppGroupJid)(normalizedTo)) {
                    return { ok: true, to: normalizedTo };
                }
                if (mode === "implicit" || mode === "heartbeat") {
                    if (hasWildcard || allowList.length === 0) {
                        return { ok: true, to: normalizedTo };
                    }
                    if (allowList.includes(normalizedTo)) {
                        return { ok: true, to: normalizedTo };
                    }
                    return { ok: true, to: allowList[0] };
                }
                return { ok: true, to: normalizedTo };
            }
            if (allowList.length > 0) {
                return { ok: true, to: allowList[0] };
            }
            return {
                ok: false,
                error: (0, plugin_sdk_1.missingTargetError)("WhatsApp", "<E.164|group JID> or channels.whatsapp.allowFrom[0]"),
            };
        },
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, result;
            var _c;
            var to = _b.to, text = _b.text, accountId = _b.accountId, deps = _b.deps, gifPlayback = _b.gifPlayback;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendWhatsApp) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.sendMessageWhatsApp;
                        return [4 /*yield*/, send(to, text, {
                                verbose: false,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                                gifPlayback: gifPlayback,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, __assign({ channel: "whatsapp" }, result)];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, result;
            var _c;
            var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, deps = _b.deps, gifPlayback = _b.gifPlayback;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendWhatsApp) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.sendMessageWhatsApp;
                        return [4 /*yield*/, send(to, text, {
                                verbose: false,
                                mediaUrl: mediaUrl,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                                gifPlayback: gifPlayback,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, __assign({ channel: "whatsapp" }, result)];
                }
            });
        }); },
        sendPoll: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var to = _b.to, poll = _b.poll, accountId = _b.accountId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.sendPollWhatsApp(to, poll, {
                            verbose: (0, runtime_js_1.getWhatsAppRuntime)().logging.shouldLogVerbose(),
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                        })];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); },
    },
    auth: {
        login: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var resolvedAccountId;
            var cfg = _b.cfg, accountId = _b.accountId, runtime = _b.runtime, verbose = _b.verbose;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        resolvedAccountId = (accountId === null || accountId === void 0 ? void 0 : accountId.trim()) || (0, plugin_sdk_1.resolveDefaultWhatsAppAccountId)(cfg);
                        return [4 /*yield*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.loginWeb(Boolean(verbose), undefined, runtime, resolvedAccountId)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    heartbeat: {
        checkReady: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, authExists, listenerActive;
            var _c, _d;
            var cfg = _b.cfg, accountId = _b.accountId, deps = _b.deps;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (((_c = cfg.web) === null || _c === void 0 ? void 0 : _c.enabled) === false) {
                            return [2 /*return*/, { ok: false, reason: "whatsapp-disabled" }];
                        }
                        account = (0, plugin_sdk_1.resolveWhatsAppAccount)({ cfg: cfg, accountId: accountId });
                        return [4 /*yield*/, ((_d = deps === null || deps === void 0 ? void 0 : deps.webAuthExists) !== null && _d !== void 0 ? _d : (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.webAuthExists)(account.authDir)];
                    case 1:
                        authExists = _e.sent();
                        if (!authExists) {
                            return [2 /*return*/, { ok: false, reason: "whatsapp-not-linked" }];
                        }
                        listenerActive = (deps === null || deps === void 0 ? void 0 : deps.hasActiveWebListener)
                            ? deps.hasActiveWebListener()
                            : Boolean((0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.getActiveWebListener());
                        if (!listenerActive) {
                            return [2 /*return*/, { ok: false, reason: "whatsapp-not-running" }];
                        }
                        return [2 /*return*/, { ok: true, reason: "ok" }];
                }
            });
        }); },
        resolveRecipients: function (_a) {
            var cfg = _a.cfg, opts = _a.opts;
            return (0, plugin_sdk_1.resolveWhatsAppHeartbeatRecipients)(cfg, opts);
        },
    },
    status: {
        defaultRuntime: {
            accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID,
            running: false,
            connected: false,
            reconnectAttempts: 0,
            lastConnectedAt: null,
            lastDisconnect: null,
            lastMessageAt: null,
            lastEventAt: null,
            lastError: null,
        },
        collectStatusIssues: plugin_sdk_1.collectWhatsAppStatusIssues,
        buildChannelSummary: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var authDir, linked, _c, _d, authAgeMs, self;
            var _e, _f, _g, _h, _j, _k, _l;
            var account = _b.account, snapshot = _b.snapshot;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        authDir = account.authDir;
                        if (!(typeof snapshot.linked === "boolean")) return [3 /*break*/, 1];
                        _c = snapshot.linked;
                        return [3 /*break*/, 5];
                    case 1:
                        if (!authDir) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.webAuthExists(authDir)];
                    case 2:
                        _d = _m.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _d = false;
                        _m.label = 4;
                    case 4:
                        _c = _d;
                        _m.label = 5;
                    case 5:
                        linked = _c;
                        authAgeMs = linked && authDir ? (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.getWebAuthAgeMs(authDir) : null;
                        self = linked && authDir
                            ? (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.readWebSelfId(authDir)
                            : { e164: null, jid: null };
                        return [2 /*return*/, {
                                configured: linked,
                                linked: linked,
                                authAgeMs: authAgeMs,
                                self: self,
                                running: (_e = snapshot.running) !== null && _e !== void 0 ? _e : false,
                                connected: (_f = snapshot.connected) !== null && _f !== void 0 ? _f : false,
                                lastConnectedAt: (_g = snapshot.lastConnectedAt) !== null && _g !== void 0 ? _g : null,
                                lastDisconnect: (_h = snapshot.lastDisconnect) !== null && _h !== void 0 ? _h : null,
                                reconnectAttempts: snapshot.reconnectAttempts,
                                lastMessageAt: (_j = snapshot.lastMessageAt) !== null && _j !== void 0 ? _j : null,
                                lastEventAt: (_k = snapshot.lastEventAt) !== null && _k !== void 0 ? _k : null,
                                lastError: (_l = snapshot.lastError) !== null && _l !== void 0 ? _l : null,
                            }];
                }
            });
        }); },
        buildAccountSnapshot: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var linked;
            var _c, _d, _e, _f, _g, _h, _j;
            var account = _b.account, runtime = _b.runtime;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.webAuthExists(account.authDir)];
                    case 1:
                        linked = _k.sent();
                        return [2 /*return*/, {
                                accountId: account.accountId,
                                name: account.name,
                                enabled: account.enabled,
                                configured: true,
                                linked: linked,
                                running: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _c !== void 0 ? _c : false,
                                connected: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.connected) !== null && _d !== void 0 ? _d : false,
                                reconnectAttempts: runtime === null || runtime === void 0 ? void 0 : runtime.reconnectAttempts,
                                lastConnectedAt: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastConnectedAt) !== null && _e !== void 0 ? _e : null,
                                lastDisconnect: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastDisconnect) !== null && _f !== void 0 ? _f : null,
                                lastMessageAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastMessageAt) !== null && _g !== void 0 ? _g : null,
                                lastEventAt: (_h = runtime === null || runtime === void 0 ? void 0 : runtime.lastEventAt) !== null && _h !== void 0 ? _h : null,
                                lastError: (_j = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _j !== void 0 ? _j : null,
                                dmPolicy: account.dmPolicy,
                                allowFrom: account.allowFrom,
                            }];
                }
            });
        }); },
        resolveAccountState: function (_a) {
            var configured = _a.configured;
            return (configured ? "linked" : "not linked");
        },
        logSelfId: function (_a) {
            var account = _a.account, runtime = _a.runtime, includeChannelPrefix = _a.includeChannelPrefix;
            (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.logWebSelfId(account.authDir, runtime, includeChannelPrefix);
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, _a, e164, jid, identity;
            var _b;
            return __generator(this, function (_c) {
                account = ctx.account;
                _a = (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.readWebSelfId(account.authDir), e164 = _a.e164, jid = _a.jid;
                identity = e164 ? e164 : jid ? "jid ".concat(jid) : "unknown";
                (_b = ctx.log) === null || _b === void 0 ? void 0 : _b.info("[".concat(account.accountId, "] starting provider (").concat(identity, ")"));
                return [2 /*return*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.monitorWebChannel((0, runtime_js_1.getWhatsAppRuntime)().logging.shouldLogVerbose(), undefined, true, undefined, ctx.runtime, ctx.abortSignal, {
                        statusSink: function (next) { return ctx.setStatus(__assign({ accountId: ctx.accountId }, next)); },
                        accountId: account.accountId,
                    })];
            });
        }); },
        loginWithQrStart: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var accountId = _b.accountId, force = _b.force, timeoutMs = _b.timeoutMs, verbose = _b.verbose;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.startWebLoginWithQr({
                            accountId: accountId,
                            force: force,
                            timeoutMs: timeoutMs,
                            verbose: verbose,
                        })];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); },
        loginWithQrWait: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var accountId = _b.accountId, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.waitForWebLogin({ accountId: accountId, timeoutMs: timeoutMs })];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); },
        logoutAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var cleared;
            var account = _b.account, runtime = _b.runtime;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, runtime_js_1.getWhatsAppRuntime)().channel.whatsapp.logoutWeb({
                            authDir: account.authDir,
                            isLegacyAuthDir: account.isLegacyAuthDir,
                            runtime: runtime,
                        })];
                    case 1:
                        cleared = _c.sent();
                        return [2 /*return*/, { cleared: cleared, loggedOut: cleared }];
                }
            });
        }); },
    },
};
