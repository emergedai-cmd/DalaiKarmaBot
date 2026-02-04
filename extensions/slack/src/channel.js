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
exports.slackPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var runtime_js_1 = require("./runtime.js");
var meta = (0, plugin_sdk_1.getChatChannelMeta)("slack");
// Select the appropriate Slack token for read/write operations.
function getTokenForOperation(account, operation) {
    var _a, _b;
    var userToken = ((_a = account.config.userToken) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
    var botToken = (_b = account.botToken) === null || _b === void 0 ? void 0 : _b.trim();
    var allowUserWrites = account.config.userTokenReadOnly === false;
    if (operation === "read") {
        return userToken !== null && userToken !== void 0 ? userToken : botToken;
    }
    if (!allowUserWrites) {
        return botToken;
    }
    return botToken !== null && botToken !== void 0 ? botToken : userToken;
}
exports.slackPlugin = {
    id: "slack",
    meta: __assign({}, meta),
    onboarding: plugin_sdk_1.slackOnboardingAdapter,
    pairing: {
        idLabel: "slackUserId",
        normalizeAllowEntry: function (entry) { return entry.replace(/^(slack|user):/i, ""); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var cfg, account, token, botToken, tokenOverride;
            var _c;
            var id = _b.id;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        cfg = (0, runtime_js_1.getSlackRuntime)().config.loadConfig();
                        account = (0, plugin_sdk_1.resolveSlackAccount)({
                            cfg: cfg,
                            accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID,
                        });
                        token = getTokenForOperation(account, "write");
                        botToken = (_c = account.botToken) === null || _c === void 0 ? void 0 : _c.trim();
                        tokenOverride = token && token !== botToken ? token : undefined;
                        if (!tokenOverride) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.sendMessageSlack("user:".concat(id), plugin_sdk_1.PAIRING_APPROVED_MESSAGE, {
                                token: tokenOverride,
                            })];
                    case 1:
                        _d.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.sendMessageSlack("user:".concat(id), plugin_sdk_1.PAIRING_APPROVED_MESSAGE)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "channel", "thread"],
        reactions: true,
        threads: true,
        media: true,
        nativeCommands: true,
    },
    streaming: {
        blockStreamingCoalesceDefaults: { minChars: 1500, idleMs: 1000 },
    },
    reload: { configPrefixes: ["channels.slack"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(plugin_sdk_1.SlackConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, plugin_sdk_1.listSlackAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, plugin_sdk_1.resolveSlackAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, plugin_sdk_1.resolveDefaultSlackAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "slack",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "slack",
                accountId: accountId,
                clearBaseFields: ["botToken", "appToken", "name"],
            });
        },
        isConfigured: function (account) { return Boolean(account.botToken && account.appToken); },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: Boolean(account.botToken && account.appToken),
            botTokenSource: account.botTokenSource,
            appTokenSource: account.appTokenSource,
        }); },
        resolveAllowFrom: function (_a) {
            var _b, _c;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_c = (_b = (0, plugin_sdk_1.resolveSlackAccount)({ cfg: cfg, accountId: accountId }).dm) === null || _b === void 0 ? void 0 : _b.allowFrom) !== null && _c !== void 0 ? _c : []).map(function (entry) { return String(entry); });
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
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.slack) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var allowFromPath = useAccountPath
                ? "channels.slack.accounts.".concat(resolvedAccountId, ".dm.")
                : "channels.slack.dm.";
            return {
                policy: (_g = (_f = account.dm) === null || _f === void 0 ? void 0 : _f.policy) !== null && _g !== void 0 ? _g : "pairing",
                allowFrom: (_j = (_h = account.dm) === null || _h === void 0 ? void 0 : _h.allowFrom) !== null && _j !== void 0 ? _j : [],
                allowFromPath: allowFromPath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("slack"),
                normalizeEntry: function (raw) { return raw.replace(/^(slack|user):/i, ""); },
            };
        },
        collectWarnings: function (_a) {
            var _b, _c, _d, _e, _f;
            var account = _a.account, cfg = _a.cfg;
            var warnings = [];
            var defaultGroupPolicy = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.groupPolicy;
            var groupPolicy = (_e = (_d = account.config.groupPolicy) !== null && _d !== void 0 ? _d : defaultGroupPolicy) !== null && _e !== void 0 ? _e : "open";
            var channelAllowlistConfigured = Boolean(account.config.channels) && Object.keys((_f = account.config.channels) !== null && _f !== void 0 ? _f : {}).length > 0;
            if (groupPolicy === "open") {
                if (channelAllowlistConfigured) {
                    warnings.push("- Slack channels: groupPolicy=\"open\" allows any channel not explicitly denied to trigger (mention-gated). Set channels.slack.groupPolicy=\"allowlist\" and configure channels.slack.channels.");
                }
                else {
                    warnings.push("- Slack channels: groupPolicy=\"open\" with no channel allowlist; any channel can trigger (mention-gated). Set channels.slack.groupPolicy=\"allowlist\" and configure channels.slack.channels.");
                }
            }
            return warnings;
        },
    },
    groups: {
        resolveRequireMention: plugin_sdk_1.resolveSlackGroupRequireMention,
        resolveToolPolicy: plugin_sdk_1.resolveSlackGroupToolPolicy,
    },
    threading: {
        resolveReplyToMode: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, chatType = _a.chatType;
            return (0, plugin_sdk_1.resolveSlackReplyToMode)((0, plugin_sdk_1.resolveSlackAccount)({ cfg: cfg, accountId: accountId }), chatType);
        },
        allowTagsWhenOff: true,
        buildToolContext: function (params) { return (0, plugin_sdk_1.buildSlackThreadingToolContext)(params); },
    },
    messaging: {
        normalizeTarget: plugin_sdk_1.normalizeSlackMessagingTarget,
        targetResolver: {
            looksLikeId: plugin_sdk_1.looksLikeSlackTargetId,
            hint: "<channelId|user:ID|channel:ID>",
        },
    },
    directory: {
        self: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); },
        listPeers: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, plugin_sdk_1.listSlackDirectoryPeersFromConfig)(params)];
        }); }); },
        listGroups: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, plugin_sdk_1.listSlackDirectoryGroupsFromConfig)(params)];
        }); }); },
        listPeersLive: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.listDirectoryPeersLive(params)];
        }); }); },
        listGroupsLive: function (params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.listDirectoryGroupsLive(params)];
        }); }); },
    },
    resolver: {
        resolveTargets: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, token, resolved_1, resolved;
            var _c, _d;
            var cfg = _b.cfg, accountId = _b.accountId, inputs = _b.inputs, kind = _b.kind;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        account = (0, plugin_sdk_1.resolveSlackAccount)({ cfg: cfg, accountId: accountId });
                        token = ((_c = account.config.userToken) === null || _c === void 0 ? void 0 : _c.trim()) || ((_d = account.botToken) === null || _d === void 0 ? void 0 : _d.trim());
                        if (!token) {
                            return [2 /*return*/, inputs.map(function (input) { return ({
                                    input: input,
                                    resolved: false,
                                    note: "missing Slack token",
                                }); })];
                        }
                        if (!(kind === "group")) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.resolveChannelAllowlist({
                                token: token,
                                entries: inputs,
                            })];
                    case 1:
                        resolved_1 = _e.sent();
                        return [2 /*return*/, resolved_1.map(function (entry) { return ({
                                input: entry.input,
                                resolved: entry.resolved,
                                id: entry.id,
                                name: entry.name,
                                note: entry.archived ? "archived" : undefined,
                            }); })];
                    case 2: return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.resolveUserAllowlist({
                            token: token,
                            entries: inputs,
                        })];
                    case 3:
                        resolved = _e.sent();
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
    actions: {
        listActions: function (_a) {
            var cfg = _a.cfg;
            var accounts = (0, plugin_sdk_1.listEnabledSlackAccounts)(cfg).filter(function (account) { return account.botTokenSource !== "none"; });
            if (accounts.length === 0) {
                return [];
            }
            var isActionEnabled = function (key, defaultValue) {
                var _a, _b, _c;
                if (defaultValue === void 0) { defaultValue = true; }
                for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
                    var account = accounts_1[_i];
                    var gate = (0, plugin_sdk_1.createActionGate)(((_a = account.actions) !== null && _a !== void 0 ? _a : (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.slack) === null || _c === void 0 ? void 0 : _c.actions));
                    if (gate(key, defaultValue)) {
                        return true;
                    }
                }
                return false;
            };
            var actions = new Set(["send"]);
            if (isActionEnabled("reactions")) {
                actions.add("react");
                actions.add("reactions");
            }
            if (isActionEnabled("messages")) {
                actions.add("read");
                actions.add("edit");
                actions.add("delete");
            }
            if (isActionEnabled("pins")) {
                actions.add("pin");
                actions.add("unpin");
                actions.add("list-pins");
            }
            if (isActionEnabled("memberInfo")) {
                actions.add("member-info");
            }
            if (isActionEnabled("emojiList")) {
                actions.add("emoji-list");
            }
            return Array.from(actions);
        },
        extractToolSend: function (_a) {
            var args = _a.args;
            var action = typeof args.action === "string" ? args.action.trim() : "";
            if (action !== "sendMessage") {
                return null;
            }
            var to = typeof args.to === "string" ? args.to : undefined;
            if (!to) {
                return null;
            }
            var accountId = typeof args.accountId === "string" ? args.accountId.trim() : undefined;
            return { to: to, accountId: accountId };
        },
        handleAction: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var resolveChannelId, to, content, mediaUrl, threadId, replyTo, messageId, emoji, remove, messageId, limit, limit, messageId, content, messageId, messageId, userId;
            var _c;
            var action = _b.action, params = _b.params, cfg = _b.cfg, accountId = _b.accountId, toolContext = _b.toolContext;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        resolveChannelId = function () { var _a; return (_a = (0, plugin_sdk_1.readStringParam)(params, "channelId")) !== null && _a !== void 0 ? _a : (0, plugin_sdk_1.readStringParam)(params, "to", { required: true }); };
                        if (!(action === "send")) return [3 /*break*/, 2];
                        to = (0, plugin_sdk_1.readStringParam)(params, "to", { required: true });
                        content = (0, plugin_sdk_1.readStringParam)(params, "message", {
                            required: true,
                            allowEmpty: true,
                        });
                        mediaUrl = (0, plugin_sdk_1.readStringParam)(params, "media", { trim: false });
                        threadId = (0, plugin_sdk_1.readStringParam)(params, "threadId");
                        replyTo = (0, plugin_sdk_1.readStringParam)(params, "replyTo");
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.handleSlackAction({
                                action: "sendMessage",
                                to: to,
                                content: content,
                                mediaUrl: mediaUrl !== null && mediaUrl !== void 0 ? mediaUrl : undefined,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                                threadTs: (_c = threadId !== null && threadId !== void 0 ? threadId : replyTo) !== null && _c !== void 0 ? _c : undefined,
                            }, cfg, toolContext)];
                    case 1: return [2 /*return*/, _d.sent()];
                    case 2:
                        if (!(action === "react")) return [3 /*break*/, 4];
                        messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", {
                            required: true,
                        });
                        emoji = (0, plugin_sdk_1.readStringParam)(params, "emoji", { allowEmpty: true });
                        remove = typeof params.remove === "boolean" ? params.remove : undefined;
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.handleSlackAction({
                                action: "react",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                emoji: emoji,
                                remove: remove,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 3: return [2 /*return*/, _d.sent()];
                    case 4:
                        if (!(action === "reactions")) return [3 /*break*/, 6];
                        messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", {
                            required: true,
                        });
                        limit = (0, plugin_sdk_1.readNumberParam)(params, "limit", { integer: true });
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.handleSlackAction({
                                action: "reactions",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                limit: limit,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 5: return [2 /*return*/, _d.sent()];
                    case 6:
                        if (!(action === "read")) return [3 /*break*/, 8];
                        limit = (0, plugin_sdk_1.readNumberParam)(params, "limit", { integer: true });
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.handleSlackAction({
                                action: "readMessages",
                                channelId: resolveChannelId(),
                                limit: limit,
                                before: (0, plugin_sdk_1.readStringParam)(params, "before"),
                                after: (0, plugin_sdk_1.readStringParam)(params, "after"),
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 7: return [2 /*return*/, _d.sent()];
                    case 8:
                        if (!(action === "edit")) return [3 /*break*/, 10];
                        messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", {
                            required: true,
                        });
                        content = (0, plugin_sdk_1.readStringParam)(params, "message", { required: true });
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.handleSlackAction({
                                action: "editMessage",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                content: content,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 9: return [2 /*return*/, _d.sent()];
                    case 10:
                        if (!(action === "delete")) return [3 /*break*/, 12];
                        messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", {
                            required: true,
                        });
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.handleSlackAction({
                                action: "deleteMessage",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 11: return [2 /*return*/, _d.sent()];
                    case 12:
                        if (!(action === "pin" || action === "unpin" || action === "list-pins")) return [3 /*break*/, 14];
                        messageId = action === "list-pins"
                            ? undefined
                            : (0, plugin_sdk_1.readStringParam)(params, "messageId", { required: true });
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.handleSlackAction({
                                action: action === "pin" ? "pinMessage" : action === "unpin" ? "unpinMessage" : "listPins",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 13: return [2 /*return*/, _d.sent()];
                    case 14:
                        if (!(action === "member-info")) return [3 /*break*/, 16];
                        userId = (0, plugin_sdk_1.readStringParam)(params, "userId", { required: true });
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.handleSlackAction({ action: "memberInfo", userId: userId, accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, cfg)];
                    case 15: return [2 /*return*/, _d.sent()];
                    case 16:
                        if (!(action === "emoji-list")) return [3 /*break*/, 18];
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.handleSlackAction({ action: "emojiList", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, cfg)];
                    case 17: return [2 /*return*/, _d.sent()];
                    case 18: throw new Error("Action ".concat(action, " is not supported for provider ").concat(meta.id, "."));
                }
            });
        }); },
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
                channelKey: "slack",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var accountId = _a.accountId, input = _a.input;
            if (input.useEnv && accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return "Slack env tokens can only be used for the default account.";
            }
            if (!input.useEnv && (!input.botToken || !input.appToken)) {
                return "Slack requires --bot-token and --app-token (or --use-env).";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "slack",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "slack",
                })
                : namedConfig;
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { slack: __assign(__assign(__assign({}, (_c = next.channels) === null || _c === void 0 ? void 0 : _c.slack), { enabled: true }), (input.useEnv
                            ? {}
                            : __assign(__assign({}, (input.botToken ? { botToken: input.botToken } : {})), (input.appToken ? { appToken: input.appToken } : {})))) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { slack: __assign(__assign({}, (_d = next.channels) === null || _d === void 0 ? void 0 : _d.slack), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e.slack) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign(__assign({}, (_j = (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.slack) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: true }), (input.botToken ? { botToken: input.botToken } : {})), (input.appToken ? { appToken: input.appToken } : {})), _b)) }) }) });
        },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: null,
        textChunkLimit: 4000,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, account, token, botToken, tokenOverride, result;
            var _c, _d;
            var to = _b.to, text = _b.text, accountId = _b.accountId, deps = _b.deps, replyToId = _b.replyToId, cfg = _b.cfg;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendSlack) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getSlackRuntime)().channel.slack.sendMessageSlack;
                        account = (0, plugin_sdk_1.resolveSlackAccount)({ cfg: cfg, accountId: accountId });
                        token = getTokenForOperation(account, "write");
                        botToken = (_d = account.botToken) === null || _d === void 0 ? void 0 : _d.trim();
                        tokenOverride = token && token !== botToken ? token : undefined;
                        return [4 /*yield*/, send(to, text, __assign({ threadTs: replyToId !== null && replyToId !== void 0 ? replyToId : undefined, accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, (tokenOverride ? { token: tokenOverride } : {})))];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, __assign({ channel: "slack" }, result)];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, account, token, botToken, tokenOverride, result;
            var _c, _d;
            var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, deps = _b.deps, replyToId = _b.replyToId, cfg = _b.cfg;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendSlack) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getSlackRuntime)().channel.slack.sendMessageSlack;
                        account = (0, plugin_sdk_1.resolveSlackAccount)({ cfg: cfg, accountId: accountId });
                        token = getTokenForOperation(account, "write");
                        botToken = (_d = account.botToken) === null || _d === void 0 ? void 0 : _d.trim();
                        tokenOverride = token && token !== botToken ? token : undefined;
                        return [4 /*yield*/, send(to, text, __assign({ mediaUrl: mediaUrl, threadTs: replyToId !== null && replyToId !== void 0 ? replyToId : undefined, accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, (tokenOverride ? { token: tokenOverride } : {})))];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, __assign({ channel: "slack" }, result)];
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
            var _b, _c, _d, _e, _f, _g, _h, _j;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                botTokenSource: (_c = snapshot.botTokenSource) !== null && _c !== void 0 ? _c : "none",
                appTokenSource: (_d = snapshot.appTokenSource) !== null && _d !== void 0 ? _d : "none",
                running: (_e = snapshot.running) !== null && _e !== void 0 ? _e : false,
                lastStartAt: (_f = snapshot.lastStartAt) !== null && _f !== void 0 ? _f : null,
                lastStopAt: (_g = snapshot.lastStopAt) !== null && _g !== void 0 ? _g : null,
                lastError: (_h = snapshot.lastError) !== null && _h !== void 0 ? _h : null,
                probe: snapshot.probe,
                lastProbeAt: (_j = snapshot.lastProbeAt) !== null && _j !== void 0 ? _j : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var token;
            var _c;
            var account = _b.account, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        token = (_c = account.botToken) === null || _c === void 0 ? void 0 : _c.trim();
                        if (!token) {
                            return [2 /*return*/, { ok: false, error: "missing token" }];
                        }
                        return [4 /*yield*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.probeSlack(token, timeoutMs)];
                    case 1: return [2 /*return*/, _d.sent()];
                }
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            var configured = Boolean(account.botToken && account.appToken);
            return {
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: configured,
                botTokenSource: account.botTokenSource,
                appTokenSource: account.appTokenSource,
                running: (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false,
                lastStartAt: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _c !== void 0 ? _c : null,
                lastStopAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _d !== void 0 ? _d : null,
                lastError: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _e !== void 0 ? _e : null,
                probe: probe,
                lastInboundAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _f !== void 0 ? _f : null,
                lastOutboundAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _g !== void 0 ? _g : null,
            };
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, botToken, appToken;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                account = ctx.account;
                botToken = (_a = account.botToken) === null || _a === void 0 ? void 0 : _a.trim();
                appToken = (_b = account.appToken) === null || _b === void 0 ? void 0 : _b.trim();
                (_c = ctx.log) === null || _c === void 0 ? void 0 : _c.info("[".concat(account.accountId, "] starting provider"));
                return [2 /*return*/, (0, runtime_js_1.getSlackRuntime)().channel.slack.monitorSlackProvider({
                        botToken: botToken !== null && botToken !== void 0 ? botToken : "",
                        appToken: appToken !== null && appToken !== void 0 ? appToken : "",
                        accountId: account.accountId,
                        config: ctx.cfg,
                        runtime: ctx.runtime,
                        abortSignal: ctx.abortSignal,
                        mediaMaxMb: account.config.mediaMaxMb,
                        slashCommand: account.config.slashCommand,
                    })];
            });
        }); },
    },
};
