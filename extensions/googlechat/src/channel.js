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
exports.googlechatPlugin = exports.googlechatDock = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var plugin_sdk_2 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var actions_js_1 = require("./actions.js");
var api_js_1 = require("./api.js");
var monitor_js_1 = require("./monitor.js");
var onboarding_js_1 = require("./onboarding.js");
var runtime_js_1 = require("./runtime.js");
var targets_js_1 = require("./targets.js");
var meta = (0, plugin_sdk_1.getChatChannelMeta)("googlechat");
var formatAllowFromEntry = function (entry) {
    return entry
        .trim()
        .replace(/^(googlechat|google-chat|gchat):/i, "")
        .replace(/^user:/i, "")
        .replace(/^users\//i, "")
        .toLowerCase();
};
exports.googlechatDock = {
    id: "googlechat",
    capabilities: {
        chatTypes: ["direct", "group", "thread"],
        reactions: true,
        media: true,
        threads: true,
        blockStreaming: true,
    },
    outbound: { textChunkLimit: 4000 },
    config: {
        resolveAllowFrom: function (_a) {
            var _b, _c;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_c = (_b = (0, accounts_js_1.resolveGoogleChatAccount)({ cfg: cfg, accountId: accountId }).config.dm) === null || _b === void 0 ? void 0 : _b.allowFrom) !== null && _c !== void 0 ? _c : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry); })
                .filter(Boolean)
                .map(formatAllowFromEntry);
        },
    },
    groups: {
        resolveRequireMention: plugin_sdk_1.resolveGoogleChatGroupRequireMention,
    },
    threading: {
        resolveReplyToMode: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg;
            return (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b["googlechat"]) === null || _c === void 0 ? void 0 : _c.replyToMode) !== null && _d !== void 0 ? _d : "off";
        },
        buildToolContext: function (_a) {
            var _b, _c;
            var context = _a.context, hasRepliedRef = _a.hasRepliedRef;
            var threadId = (_b = context.MessageThreadId) !== null && _b !== void 0 ? _b : context.ReplyToId;
            return {
                currentChannelId: ((_c = context.To) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                currentThreadTs: threadId != null ? String(threadId) : undefined,
                hasRepliedRef: hasRepliedRef,
            };
        },
    },
};
var googlechatActions = {
    listActions: function (ctx) { var _a, _b; return (_b = (_a = actions_js_1.googlechatMessageActions.listActions) === null || _a === void 0 ? void 0 : _a.call(actions_js_1.googlechatMessageActions, ctx)) !== null && _b !== void 0 ? _b : []; },
    extractToolSend: function (ctx) { var _a, _b; return (_b = (_a = actions_js_1.googlechatMessageActions.extractToolSend) === null || _a === void 0 ? void 0 : _a.call(actions_js_1.googlechatMessageActions, ctx)) !== null && _b !== void 0 ? _b : null; },
    handleAction: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!actions_js_1.googlechatMessageActions.handleAction) {
                        throw new Error("Google Chat actions are not available.");
                    }
                    return [4 /*yield*/, actions_js_1.googlechatMessageActions.handleAction(ctx)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
};
exports.googlechatPlugin = {
    id: "googlechat",
    meta: __assign({}, meta),
    onboarding: onboarding_js_1.googlechatOnboardingAdapter,
    pairing: {
        idLabel: "googlechatUserId",
        normalizeAllowEntry: function (entry) { return formatAllowFromEntry(entry); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, user, target, space;
            var _c;
            var cfg = _b.cfg, id = _b.id;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        account = (0, accounts_js_1.resolveGoogleChatAccount)({ cfg: cfg });
                        if (account.credentialSource === "none") {
                            return [2 /*return*/];
                        }
                        user = (_c = (0, targets_js_1.normalizeGoogleChatTarget)(id)) !== null && _c !== void 0 ? _c : id;
                        target = (0, targets_js_1.isGoogleChatUserTarget)(user) ? user : "users/".concat(user);
                        return [4 /*yield*/, (0, targets_js_1.resolveGoogleChatOutboundSpace)({ account: account, target: target })];
                    case 1:
                        space = _d.sent();
                        return [4 /*yield*/, (0, api_js_1.sendGoogleChatMessage)({
                                account: account,
                                space: space,
                                text: plugin_sdk_1.PAIRING_APPROVED_MESSAGE,
                            })];
                    case 2:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "group", "thread"],
        reactions: true,
        threads: true,
        media: true,
        nativeCommands: false,
        blockStreaming: true,
    },
    streaming: {
        blockStreamingCoalesceDefaults: { minChars: 1500, idleMs: 1000 },
    },
    reload: { configPrefixes: ["channels.googlechat"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(plugin_sdk_2.GoogleChatConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, accounts_js_1.listGoogleChatAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, accounts_js_1.resolveGoogleChatAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, accounts_js_1.resolveDefaultGoogleChatAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "googlechat",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "googlechat",
                accountId: accountId,
                clearBaseFields: [
                    "serviceAccount",
                    "serviceAccountFile",
                    "audienceType",
                    "audience",
                    "webhookPath",
                    "webhookUrl",
                    "botUser",
                    "name",
                ],
            });
        },
        isConfigured: function (account) { return account.credentialSource !== "none"; },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: account.credentialSource !== "none",
            credentialSource: account.credentialSource,
        }); },
        resolveAllowFrom: function (_a) {
            var _b, _c;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_c = (_b = (0, accounts_js_1.resolveGoogleChatAccount)({
                cfg: cfg,
                accountId: accountId,
            }).config.dm) === null || _b === void 0 ? void 0 : _b.allowFrom) !== null && _c !== void 0 ? _c : []).map(function (entry) { return String(entry); });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry); })
                .filter(Boolean)
                .map(formatAllowFromEntry);
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c["googlechat"]) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var allowFromPath = useAccountPath
                ? "channels.googlechat.accounts.".concat(resolvedAccountId, ".dm.")
                : "channels.googlechat.dm.";
            return {
                policy: (_g = (_f = account.config.dm) === null || _f === void 0 ? void 0 : _f.policy) !== null && _g !== void 0 ? _g : "pairing",
                allowFrom: (_j = (_h = account.config.dm) === null || _h === void 0 ? void 0 : _h.allowFrom) !== null && _j !== void 0 ? _j : [],
                allowFromPath: allowFromPath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("googlechat"),
                normalizeEntry: function (raw) { return formatAllowFromEntry(raw); },
            };
        },
        collectWarnings: function (_a) {
            var _b, _c, _d, _e, _f;
            var account = _a.account, cfg = _a.cfg;
            var warnings = [];
            var defaultGroupPolicy = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.groupPolicy;
            var groupPolicy = (_e = (_d = account.config.groupPolicy) !== null && _d !== void 0 ? _d : defaultGroupPolicy) !== null && _e !== void 0 ? _e : "allowlist";
            if (groupPolicy === "open") {
                warnings.push("- Google Chat spaces: groupPolicy=\"open\" allows any space to trigger (mention-gated). Set channels.googlechat.groupPolicy=\"allowlist\" and configure channels.googlechat.groups.");
            }
            if (((_f = account.config.dm) === null || _f === void 0 ? void 0 : _f.policy) === "open") {
                warnings.push("- Google Chat DMs are open to anyone. Set channels.googlechat.dm.policy=\"pairing\" or \"allowlist\".");
            }
            return warnings;
        },
    },
    groups: {
        resolveRequireMention: plugin_sdk_1.resolveGoogleChatGroupRequireMention,
    },
    threading: {
        resolveReplyToMode: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg;
            return (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b["googlechat"]) === null || _c === void 0 ? void 0 : _c.replyToMode) !== null && _d !== void 0 ? _d : "off";
        },
    },
    messaging: {
        normalizeTarget: targets_js_1.normalizeGoogleChatTarget,
        targetResolver: {
            looksLikeId: function (raw, normalized) {
                var value = normalized !== null && normalized !== void 0 ? normalized : raw.trim();
                return (0, targets_js_1.isGoogleChatSpaceTarget)(value) || (0, targets_js_1.isGoogleChatUserTarget)(value);
            },
            hint: "<spaces/{space}|users/{user}>",
        },
    },
    directory: {
        self: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); },
        listPeers: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, q, allowFrom, peers;
            var _c, _d;
            var cfg = _b.cfg, accountId = _b.accountId, query = _b.query, limit = _b.limit;
            return __generator(this, function (_e) {
                account = (0, accounts_js_1.resolveGoogleChatAccount)({
                    cfg: cfg,
                    accountId: accountId,
                });
                q = (query === null || query === void 0 ? void 0 : query.trim().toLowerCase()) || "";
                allowFrom = (_d = (_c = account.config.dm) === null || _c === void 0 ? void 0 : _c.allowFrom) !== null && _d !== void 0 ? _d : [];
                peers = Array.from(new Set(allowFrom
                    .map(function (entry) { return String(entry).trim(); })
                    .filter(function (entry) { return Boolean(entry) && entry !== "*"; })
                    .map(function (entry) { var _a; return (_a = (0, targets_js_1.normalizeGoogleChatTarget)(entry)) !== null && _a !== void 0 ? _a : entry; })))
                    .filter(function (id) { return (q ? id.toLowerCase().includes(q) : true); })
                    .slice(0, limit && limit > 0 ? limit : undefined)
                    .map(function (id) { return ({ kind: "user", id: id }); });
                return [2 /*return*/, peers];
            });
        }); },
        listGroups: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, groups, q, entries;
            var _c;
            var cfg = _b.cfg, accountId = _b.accountId, query = _b.query, limit = _b.limit;
            return __generator(this, function (_d) {
                account = (0, accounts_js_1.resolveGoogleChatAccount)({
                    cfg: cfg,
                    accountId: accountId,
                });
                groups = (_c = account.config.groups) !== null && _c !== void 0 ? _c : {};
                q = (query === null || query === void 0 ? void 0 : query.trim().toLowerCase()) || "";
                entries = Object.keys(groups)
                    .filter(function (key) { return key && key !== "*"; })
                    .filter(function (key) { return (q ? key.toLowerCase().includes(q) : true); })
                    .slice(0, limit && limit > 0 ? limit : undefined)
                    .map(function (id) { return ({ kind: "group", id: id }); });
                return [2 /*return*/, entries];
            });
        }); },
    },
    resolver: {
        resolveTargets: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var resolved;
            var inputs = _b.inputs, kind = _b.kind;
            return __generator(this, function (_c) {
                resolved = inputs.map(function (input) {
                    var normalized = (0, targets_js_1.normalizeGoogleChatTarget)(input);
                    if (!normalized) {
                        return { input: input, resolved: false, note: "empty target" };
                    }
                    if (kind === "user" && (0, targets_js_1.isGoogleChatUserTarget)(normalized)) {
                        return { input: input, resolved: true, id: normalized };
                    }
                    if (kind === "group" && (0, targets_js_1.isGoogleChatSpaceTarget)(normalized)) {
                        return { input: input, resolved: true, id: normalized };
                    }
                    return {
                        input: input,
                        resolved: false,
                        note: "use spaces/{space} or users/{user}",
                    };
                });
                return [2 /*return*/, resolved];
            });
        }); },
    },
    actions: googlechatActions,
    setup: {
        resolveAccountId: function (_a) {
            var accountId = _a.accountId;
            return (0, plugin_sdk_1.normalizeAccountId)(accountId);
        },
        applyAccountName: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, name = _a.name;
            return (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "googlechat",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var accountId = _a.accountId, input = _a.input;
            if (input.useEnv && accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return "GOOGLE_CHAT_SERVICE_ACCOUNT env vars can only be used for the default account.";
            }
            if (!input.useEnv && !input.token && !input.tokenFile) {
                return "Google Chat requires --token (service account JSON) or --token-file.";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "googlechat",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "googlechat",
                })
                : namedConfig;
            var patch = input.useEnv
                ? {}
                : input.tokenFile
                    ? { serviceAccountFile: input.tokenFile }
                    : input.token
                        ? { serviceAccount: input.token }
                        : {};
            var audienceType = (_c = input.audienceType) === null || _c === void 0 ? void 0 : _c.trim();
            var audience = (_d = input.audience) === null || _d === void 0 ? void 0 : _d.trim();
            var webhookPath = (_e = input.webhookPath) === null || _e === void 0 ? void 0 : _e.trim();
            var webhookUrl = (_f = input.webhookUrl) === null || _f === void 0 ? void 0 : _f.trim();
            var configPatch = __assign(__assign(__assign(__assign(__assign({}, patch), (audienceType ? { audienceType: audienceType } : {})), (audience ? { audience: audience } : {})), (webhookPath ? { webhookPath: webhookPath } : {})), (webhookUrl ? { webhookUrl: webhookUrl } : {}));
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { googlechat: __assign(__assign(__assign({}, (_g = next.channels) === null || _g === void 0 ? void 0 : _g["googlechat"]), { enabled: true }), configPatch) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { googlechat: __assign(__assign({}, (_h = next.channels) === null || _h === void 0 ? void 0 : _h["googlechat"]), { enabled: true, accounts: __assign(__assign({}, (_k = (_j = next.channels) === null || _j === void 0 ? void 0 : _j["googlechat"]) === null || _k === void 0 ? void 0 : _k.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign({}, (_o = (_m = (_l = next.channels) === null || _l === void 0 ? void 0 : _l["googlechat"]) === null || _m === void 0 ? void 0 : _m.accounts) === null || _o === void 0 ? void 0 : _o[accountId]), { enabled: true }), configPatch), _b)) }) }) });
        },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: function (text, limit) { return (0, runtime_js_1.getGoogleChatRuntime)().channel.text.chunkMarkdownText(text, limit); },
        chunkerMode: "markdown",
        textChunkLimit: 4000,
        resolveTarget: function (_a) {
            var _b;
            var to = _a.to, allowFrom = _a.allowFrom, mode = _a.mode;
            var trimmed = (_b = to === null || to === void 0 ? void 0 : to.trim()) !== null && _b !== void 0 ? _b : "";
            var allowListRaw = (allowFrom !== null && allowFrom !== void 0 ? allowFrom : []).map(function (entry) { return String(entry).trim(); }).filter(Boolean);
            var allowList = allowListRaw
                .filter(function (entry) { return entry !== "*"; })
                .map(function (entry) { return (0, targets_js_1.normalizeGoogleChatTarget)(entry); })
                .filter(function (entry) { return Boolean(entry); });
            if (trimmed) {
                var normalized = (0, targets_js_1.normalizeGoogleChatTarget)(trimmed);
                if (!normalized) {
                    if ((mode === "implicit" || mode === "heartbeat") && allowList.length > 0) {
                        return { ok: true, to: allowList[0] };
                    }
                    return {
                        ok: false,
                        error: (0, plugin_sdk_1.missingTargetError)("Google Chat", "<spaces/{space}|users/{user}> or channels.googlechat.dm.allowFrom[0]"),
                    };
                }
                return { ok: true, to: normalized };
            }
            if (allowList.length > 0) {
                return { ok: true, to: allowList[0] };
            }
            return {
                ok: false,
                error: (0, plugin_sdk_1.missingTargetError)("Google Chat", "<spaces/{space}|users/{user}> or channels.googlechat.dm.allowFrom[0]"),
            };
        },
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, space, thread, result;
            var _c, _d;
            var cfg = _b.cfg, to = _b.to, text = _b.text, accountId = _b.accountId, replyToId = _b.replyToId, threadId = _b.threadId;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        account = (0, accounts_js_1.resolveGoogleChatAccount)({
                            cfg: cfg,
                            accountId: accountId,
                        });
                        return [4 /*yield*/, (0, targets_js_1.resolveGoogleChatOutboundSpace)({ account: account, target: to })];
                    case 1:
                        space = _e.sent();
                        thread = ((_c = threadId !== null && threadId !== void 0 ? threadId : replyToId) !== null && _c !== void 0 ? _c : undefined);
                        return [4 /*yield*/, (0, api_js_1.sendGoogleChatMessage)({
                                account: account,
                                space: space,
                                text: text,
                                thread: thread,
                            })];
                    case 2:
                        result = _e.sent();
                        return [2 /*return*/, {
                                channel: "googlechat",
                                messageId: (_d = result === null || result === void 0 ? void 0 : result.messageName) !== null && _d !== void 0 ? _d : "",
                                chatId: space,
                            }];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, space, thread, runtime, maxBytes, loaded, upload, result;
            var _c, _d, _e, _f;
            var cfg = _b.cfg, to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, replyToId = _b.replyToId, threadId = _b.threadId;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!mediaUrl) {
                            throw new Error("Google Chat mediaUrl is required.");
                        }
                        account = (0, accounts_js_1.resolveGoogleChatAccount)({
                            cfg: cfg,
                            accountId: accountId,
                        });
                        return [4 /*yield*/, (0, targets_js_1.resolveGoogleChatOutboundSpace)({ account: account, target: to })];
                    case 1:
                        space = _g.sent();
                        thread = ((_c = threadId !== null && threadId !== void 0 ? threadId : replyToId) !== null && _c !== void 0 ? _c : undefined);
                        runtime = (0, runtime_js_1.getGoogleChatRuntime)();
                        maxBytes = (0, plugin_sdk_1.resolveChannelMediaMaxBytes)({
                            cfg: cfg,
                            resolveChannelLimitMb: function (_a) {
                                var _b, _c, _d, _e, _f, _g, _h;
                                var cfg = _a.cfg, accountId = _a.accountId;
                                return (_f = (_e = (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b["googlechat"]) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d[accountId]) === null || _e === void 0 ? void 0 : _e.mediaMaxMb) !== null && _f !== void 0 ? _f : (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g["googlechat"]) === null || _h === void 0 ? void 0 : _h.mediaMaxMb;
                            },
                            accountId: accountId,
                        });
                        return [4 /*yield*/, runtime.channel.media.fetchRemoteMedia(mediaUrl, {
                                maxBytes: maxBytes !== null && maxBytes !== void 0 ? maxBytes : ((_d = account.config.mediaMaxMb) !== null && _d !== void 0 ? _d : 20) * 1024 * 1024,
                            })];
                    case 2:
                        loaded = _g.sent();
                        return [4 /*yield*/, (0, api_js_1.uploadGoogleChatAttachment)({
                                account: account,
                                space: space,
                                filename: (_e = loaded.filename) !== null && _e !== void 0 ? _e : "attachment",
                                buffer: loaded.buffer,
                                contentType: loaded.contentType,
                            })];
                    case 3:
                        upload = _g.sent();
                        return [4 /*yield*/, (0, api_js_1.sendGoogleChatMessage)({
                                account: account,
                                space: space,
                                text: text,
                                thread: thread,
                                attachments: upload.attachmentUploadToken
                                    ? [{ attachmentUploadToken: upload.attachmentUploadToken, contentName: loaded.filename }]
                                    : undefined,
                            })];
                    case 4:
                        result = _g.sent();
                        return [2 /*return*/, {
                                channel: "googlechat",
                                messageId: (_f = result === null || result === void 0 ? void 0 : result.messageName) !== null && _f !== void 0 ? _f : "",
                                chatId: space,
                            }];
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
        collectStatusIssues: function (accounts) {
            return accounts.flatMap(function (entry) {
                var _a;
                var accountId = String((_a = entry.accountId) !== null && _a !== void 0 ? _a : plugin_sdk_1.DEFAULT_ACCOUNT_ID);
                var enabled = entry.enabled !== false;
                var configured = entry.configured === true;
                if (!enabled || !configured) {
                    return [];
                }
                var issues = [];
                if (!entry.audience) {
                    issues.push({
                        channel: "googlechat",
                        accountId: accountId,
                        kind: "config",
                        message: "Google Chat audience is missing (set channels.googlechat.audience).",
                        fix: "Set channels.googlechat.audienceType and channels.googlechat.audience.",
                    });
                }
                if (!entry.audienceType) {
                    issues.push({
                        channel: "googlechat",
                        accountId: accountId,
                        kind: "config",
                        message: "Google Chat audienceType is missing (app-url or project-number).",
                        fix: "Set channels.googlechat.audienceType and channels.googlechat.audience.",
                    });
                }
                return issues;
            });
        },
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                credentialSource: (_c = snapshot.credentialSource) !== null && _c !== void 0 ? _c : "none",
                audienceType: (_d = snapshot.audienceType) !== null && _d !== void 0 ? _d : null,
                audience: (_e = snapshot.audience) !== null && _e !== void 0 ? _e : null,
                webhookPath: (_f = snapshot.webhookPath) !== null && _f !== void 0 ? _f : null,
                webhookUrl: (_g = snapshot.webhookUrl) !== null && _g !== void 0 ? _g : null,
                running: (_h = snapshot.running) !== null && _h !== void 0 ? _h : false,
                lastStartAt: (_j = snapshot.lastStartAt) !== null && _j !== void 0 ? _j : null,
                lastStopAt: (_k = snapshot.lastStopAt) !== null && _k !== void 0 ? _k : null,
                lastError: (_l = snapshot.lastError) !== null && _l !== void 0 ? _l : null,
                probe: snapshot.probe,
                lastProbeAt: (_m = snapshot.lastProbeAt) !== null && _m !== void 0 ? _m : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account = _b.account;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, api_js_1.probeGoogleChat)(account)];
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: account.credentialSource !== "none",
                credentialSource: account.credentialSource,
                audienceType: account.config.audienceType,
                audience: account.config.audience,
                webhookPath: account.config.webhookPath,
                webhookUrl: account.config.webhookUrl,
                running: (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false,
                lastStartAt: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _c !== void 0 ? _c : null,
                lastStopAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _d !== void 0 ? _d : null,
                lastError: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _e !== void 0 ? _e : null,
                lastInboundAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _f !== void 0 ? _f : null,
                lastOutboundAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _g !== void 0 ? _g : null,
                dmPolicy: (_j = (_h = account.config.dm) === null || _h === void 0 ? void 0 : _h.policy) !== null && _j !== void 0 ? _j : "pairing",
                probe: probe,
            });
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, unregister;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        account = ctx.account;
                        (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.info("[".concat(account.accountId, "] starting Google Chat webhook"));
                        ctx.setStatus({
                            accountId: account.accountId,
                            running: true,
                            lastStartAt: Date.now(),
                            webhookPath: (0, monitor_js_1.resolveGoogleChatWebhookPath)({ account: account }),
                            audienceType: account.config.audienceType,
                            audience: account.config.audience,
                        });
                        return [4 /*yield*/, (0, monitor_js_1.startGoogleChatMonitor)({
                                account: account,
                                config: ctx.cfg,
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                                webhookPath: account.config.webhookPath,
                                webhookUrl: account.config.webhookUrl,
                                statusSink: function (patch) { return ctx.setStatus(__assign({ accountId: account.accountId }, patch)); },
                            })];
                    case 1:
                        unregister = _b.sent();
                        return [2 /*return*/, function () {
                                unregister === null || unregister === void 0 ? void 0 : unregister();
                                ctx.setStatus({
                                    accountId: account.accountId,
                                    running: false,
                                    lastStopAt: Date.now(),
                                });
                            }];
                }
            });
        }); },
    },
};
