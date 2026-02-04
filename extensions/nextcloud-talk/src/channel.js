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
exports.nextcloudTalkPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var config_schema_js_1 = require("./config-schema.js");
var monitor_js_1 = require("./monitor.js");
var normalize_js_1 = require("./normalize.js");
var onboarding_js_1 = require("./onboarding.js");
var policy_js_1 = require("./policy.js");
var runtime_js_1 = require("./runtime.js");
var send_js_1 = require("./send.js");
var meta = {
    id: "nextcloud-talk",
    label: "Nextcloud Talk",
    selectionLabel: "Nextcloud Talk (self-hosted)",
    docsPath: "/channels/nextcloud-talk",
    docsLabel: "nextcloud-talk",
    blurb: "Self-hosted chat via Nextcloud Talk webhook bots.",
    aliases: ["nc-talk", "nc"],
    order: 65,
    quickstartAllowFrom: true,
};
exports.nextcloudTalkPlugin = {
    id: "nextcloud-talk",
    meta: meta,
    onboarding: onboarding_js_1.nextcloudTalkOnboardingAdapter,
    pairing: {
        idLabel: "nextcloudUserId",
        normalizeAllowEntry: function (entry) {
            return entry.replace(/^(nextcloud-talk|nc-talk|nc):/i, "").toLowerCase();
        },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var id = _b.id;
            return __generator(this, function (_c) {
                console.log("[nextcloud-talk] User ".concat(id, " approved for pairing"));
                return [2 /*return*/];
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "group"],
        reactions: true,
        threads: false,
        media: true,
        nativeCommands: false,
        blockStreaming: true,
    },
    reload: { configPrefixes: ["channels.nextcloud-talk"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(config_schema_js_1.NextcloudTalkConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, accounts_js_1.listNextcloudTalkAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) {
            return (0, accounts_js_1.resolveNextcloudTalkAccount)({ cfg: cfg, accountId: accountId });
        },
        defaultAccountId: function (cfg) { return (0, accounts_js_1.resolveDefaultNextcloudTalkAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "nextcloud-talk",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "nextcloud-talk",
                accountId: accountId,
                clearBaseFields: ["botSecret", "botSecretFile", "baseUrl", "name"],
            });
        },
        isConfigured: function (account) { var _a, _b; return Boolean(((_a = account.secret) === null || _a === void 0 ? void 0 : _a.trim()) && ((_b = account.baseUrl) === null || _b === void 0 ? void 0 : _b.trim())); },
        describeAccount: function (account) {
            var _a, _b;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: Boolean(((_a = account.secret) === null || _a === void 0 ? void 0 : _a.trim()) && ((_b = account.baseUrl) === null || _b === void 0 ? void 0 : _b.trim())),
                secretSource: account.secretSource,
                baseUrl: account.baseUrl ? "[set]" : "[missing]",
            });
        },
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, accounts_js_1.resolveNextcloudTalkAccount)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) { return String(entry).toLowerCase(); });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return entry.replace(/^(nextcloud-talk|nc-talk|nc):/i, ""); })
                .map(function (entry) { return entry.toLowerCase(); });
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c["nextcloud-talk"]) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.nextcloud-talk.accounts.".concat(resolvedAccountId, ".")
                : "channels.nextcloud-talk.";
            return {
                policy: (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.config.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("nextcloud-talk"),
                normalizeEntry: function (raw) { return raw.replace(/^(nextcloud-talk|nc-talk|nc):/i, "").toLowerCase(); },
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
            var roomAllowlistConfigured = account.config.rooms && Object.keys(account.config.rooms).length > 0;
            if (roomAllowlistConfigured) {
                return [
                    "- Nextcloud Talk rooms: groupPolicy=\"open\" allows any member in allowed rooms to trigger (mention-gated). Set channels.nextcloud-talk.groupPolicy=\"allowlist\" + channels.nextcloud-talk.groupAllowFrom to restrict senders.",
                ];
            }
            return [
                "- Nextcloud Talk rooms: groupPolicy=\"open\" with no channels.nextcloud-talk.rooms allowlist; any room can add + ping (mention-gated). Set channels.nextcloud-talk.groupPolicy=\"allowlist\" + channels.nextcloud-talk.groupAllowFrom or configure channels.nextcloud-talk.rooms.",
            ];
        },
    },
    groups: {
        resolveRequireMention: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, groupId = _a.groupId;
            var account = (0, accounts_js_1.resolveNextcloudTalkAccount)({ cfg: cfg, accountId: accountId });
            var rooms = account.config.rooms;
            if (!rooms || !groupId) {
                return true;
            }
            var roomConfig = rooms[groupId];
            if ((roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.requireMention) !== undefined) {
                return roomConfig.requireMention;
            }
            var wildcardConfig = rooms["*"];
            if ((wildcardConfig === null || wildcardConfig === void 0 ? void 0 : wildcardConfig.requireMention) !== undefined) {
                return wildcardConfig.requireMention;
            }
            return true;
        },
        resolveToolPolicy: policy_js_1.resolveNextcloudTalkGroupToolPolicy,
    },
    messaging: {
        normalizeTarget: normalize_js_1.normalizeNextcloudTalkMessagingTarget,
        targetResolver: {
            looksLikeId: normalize_js_1.looksLikeNextcloudTalkTargetId,
            hint: "<roomToken>",
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
                channelKey: "nextcloud-talk",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var accountId = _a.accountId, input = _a.input;
            var setupInput = input;
            if (setupInput.useEnv && accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return "NEXTCLOUD_TALK_BOT_SECRET can only be used for the default account.";
            }
            if (!setupInput.useEnv && !setupInput.secret && !setupInput.secretFile) {
                return "Nextcloud Talk requires bot secret or --secret-file (or --use-env).";
            }
            if (!setupInput.baseUrl) {
                return "Nextcloud Talk requires --base-url.";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var setupInput = input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "nextcloud-talk",
                accountId: accountId,
                name: setupInput.name,
            });
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, namedConfig), { channels: __assign(__assign({}, namedConfig.channels), { "nextcloud-talk": __assign(__assign(__assign({}, (_c = namedConfig.channels) === null || _c === void 0 ? void 0 : _c["nextcloud-talk"]), { enabled: true, baseUrl: setupInput.baseUrl }), (setupInput.useEnv
                            ? {}
                            : setupInput.secretFile
                                ? { botSecretFile: setupInput.secretFile }
                                : setupInput.secret
                                    ? { botSecret: setupInput.secret }
                                    : {})) }) });
            }
            return __assign(__assign({}, namedConfig), { channels: __assign(__assign({}, namedConfig.channels), { "nextcloud-talk": __assign(__assign({}, (_d = namedConfig.channels) === null || _d === void 0 ? void 0 : _d["nextcloud-talk"]), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = namedConfig.channels) === null || _e === void 0 ? void 0 : _e["nextcloud-talk"]) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign({}, (_j = (_h = (_g = namedConfig.channels) === null || _g === void 0 ? void 0 : _g["nextcloud-talk"]) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: true, baseUrl: setupInput.baseUrl }), (setupInput.secretFile
                            ? { botSecretFile: setupInput.secretFile }
                            : setupInput.secret
                                ? { botSecret: setupInput.secret }
                                : {})), _b)) }) }) });
        },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: function (text, limit) { return (0, runtime_js_1.getNextcloudTalkRuntime)().channel.text.chunkMarkdownText(text, limit); },
        chunkerMode: "markdown",
        textChunkLimit: 4000,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var result;
            var to = _b.to, text = _b.text, accountId = _b.accountId, replyToId = _b.replyToId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, send_js_1.sendMessageNextcloudTalk)(to, text, {
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            replyTo: replyToId !== null && replyToId !== void 0 ? replyToId : undefined,
                        })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, __assign({ channel: "nextcloud-talk" }, result)];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var messageWithMedia, result;
            var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, replyToId = _b.replyToId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        messageWithMedia = mediaUrl ? "".concat(text, "\n\nAttachment: ").concat(mediaUrl) : text;
                        return [4 /*yield*/, (0, send_js_1.sendMessageNextcloudTalk)(to, messageWithMedia, {
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                                replyTo: replyToId !== null && replyToId !== void 0 ? replyToId : undefined,
                            })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, __assign({ channel: "nextcloud-talk" }, result)];
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
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                secretSource: (_c = snapshot.secretSource) !== null && _c !== void 0 ? _c : "none",
                running: (_d = snapshot.running) !== null && _d !== void 0 ? _d : false,
                mode: "webhook",
                lastStartAt: (_e = snapshot.lastStartAt) !== null && _e !== void 0 ? _e : null,
                lastStopAt: (_f = snapshot.lastStopAt) !== null && _f !== void 0 ? _f : null,
                lastError: (_g = snapshot.lastError) !== null && _g !== void 0 ? _g : null,
            });
        },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j;
            var account = _a.account, runtime = _a.runtime;
            var configured = Boolean(((_b = account.secret) === null || _b === void 0 ? void 0 : _b.trim()) && ((_c = account.baseUrl) === null || _c === void 0 ? void 0 : _c.trim()));
            return {
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: configured,
                secretSource: account.secretSource,
                baseUrl: account.baseUrl ? "[set]" : "[missing]",
                running: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _d !== void 0 ? _d : false,
                lastStartAt: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _e !== void 0 ? _e : null,
                lastStopAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _f !== void 0 ? _f : null,
                lastError: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _g !== void 0 ? _g : null,
                mode: "webhook",
                lastInboundAt: (_h = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _h !== void 0 ? _h : null,
                lastOutboundAt: (_j = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _j !== void 0 ? _j : null,
            };
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, stop;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        account = ctx.account;
                        if (!account.secret || !account.baseUrl) {
                            throw new Error("Nextcloud Talk not configured for account \"".concat(account.accountId, "\" (missing secret or baseUrl)"));
                        }
                        (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.info("[".concat(account.accountId, "] starting Nextcloud Talk webhook server"));
                        return [4 /*yield*/, (0, monitor_js_1.monitorNextcloudTalkProvider)({
                                accountId: account.accountId,
                                config: ctx.cfg,
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                                statusSink: function (patch) { return ctx.setStatus(__assign({ accountId: ctx.accountId }, patch)); },
                            })];
                    case 1:
                        stop = (_b.sent()).stop;
                        return [2 /*return*/, { stop: stop }];
                }
            });
        }); },
        logoutAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var nextCfg, nextSection, cleared, changed, accounts, entry, nextEntry, secret, nextChannels, resolved, loggedOut;
            var _c, _d;
            var accountId = _b.accountId, cfg = _b.cfg;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        nextCfg = __assign({}, cfg);
                        nextSection = ((_c = cfg.channels) === null || _c === void 0 ? void 0 : _c["nextcloud-talk"])
                            ? __assign({}, cfg.channels["nextcloud-talk"]) : undefined;
                        cleared = false;
                        changed = false;
                        if (nextSection) {
                            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID && nextSection.botSecret) {
                                delete nextSection.botSecret;
                                cleared = true;
                                changed = true;
                            }
                            accounts = nextSection.accounts && typeof nextSection.accounts === "object"
                                ? __assign({}, nextSection.accounts) : undefined;
                            if (accounts && accountId in accounts) {
                                entry = accounts[accountId];
                                if (entry && typeof entry === "object") {
                                    nextEntry = __assign({}, entry);
                                    if ("botSecret" in nextEntry) {
                                        secret = nextEntry.botSecret;
                                        if (typeof secret === "string" ? secret.trim() : secret) {
                                            cleared = true;
                                        }
                                        delete nextEntry.botSecret;
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
                                    delete nextSection.accounts;
                                    changed = true;
                                }
                                else {
                                    nextSection.accounts = accounts;
                                }
                            }
                        }
                        if (changed) {
                            if (nextSection && Object.keys(nextSection).length > 0) {
                                nextCfg.channels = __assign(__assign({}, nextCfg.channels), { "nextcloud-talk": nextSection });
                            }
                            else {
                                nextChannels = __assign({}, nextCfg.channels);
                                delete nextChannels["nextcloud-talk"];
                                if (Object.keys(nextChannels).length > 0) {
                                    nextCfg.channels = nextChannels;
                                }
                                else {
                                    delete nextCfg.channels;
                                }
                            }
                        }
                        resolved = (0, accounts_js_1.resolveNextcloudTalkAccount)({
                            cfg: changed ? nextCfg : cfg,
                            accountId: accountId,
                        });
                        loggedOut = resolved.secretSource === "none";
                        if (!changed) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, runtime_js_1.getNextcloudTalkRuntime)().config.writeConfigFile(nextCfg)];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2: return [2 /*return*/, {
                            cleared: cleared,
                            envSecret: Boolean((_d = process.env.NEXTCLOUD_TALK_BOT_SECRET) === null || _d === void 0 ? void 0 : _d.trim()),
                            loggedOut: loggedOut,
                        }];
                }
            });
        }); },
    },
};
