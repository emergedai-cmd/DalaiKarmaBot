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
exports.mattermostPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var config_schema_js_1 = require("./config-schema.js");
var group_mentions_js_1 = require("./group-mentions.js");
var accounts_js_1 = require("./mattermost/accounts.js");
var client_js_1 = require("./mattermost/client.js");
var monitor_js_1 = require("./mattermost/monitor.js");
var probe_js_1 = require("./mattermost/probe.js");
var send_js_1 = require("./mattermost/send.js");
var normalize_js_1 = require("./normalize.js");
var onboarding_js_1 = require("./onboarding.js");
var runtime_js_1 = require("./runtime.js");
var meta = {
    id: "mattermost",
    label: "Mattermost",
    selectionLabel: "Mattermost (plugin)",
    detailLabel: "Mattermost Bot",
    docsPath: "/channels/mattermost",
    docsLabel: "mattermost",
    blurb: "self-hosted Slack-style chat; install the plugin to enable.",
    systemImage: "bubble.left.and.bubble.right",
    order: 65,
    quickstartAllowFrom: true,
};
function normalizeAllowEntry(entry) {
    return entry
        .trim()
        .replace(/^(mattermost|user):/i, "")
        .replace(/^@/, "")
        .toLowerCase();
}
function formatAllowEntry(entry) {
    var trimmed = entry.trim();
    if (!trimmed) {
        return "";
    }
    if (trimmed.startsWith("@")) {
        var username = trimmed.slice(1).trim();
        return username ? "@".concat(username.toLowerCase()) : "";
    }
    return trimmed.replace(/^(mattermost|user):/i, "").toLowerCase();
}
exports.mattermostPlugin = {
    id: "mattermost",
    meta: __assign({}, meta),
    onboarding: onboarding_js_1.mattermostOnboardingAdapter,
    pairing: {
        idLabel: "mattermostUserId",
        normalizeAllowEntry: function (entry) { return normalizeAllowEntry(entry); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var id = _b.id;
            return __generator(this, function (_c) {
                console.log("[mattermost] User ".concat(id, " approved for pairing"));
                return [2 /*return*/];
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "channel", "group", "thread"],
        threads: true,
        media: true,
    },
    streaming: {
        blockStreamingCoalesceDefaults: { minChars: 1500, idleMs: 1000 },
    },
    reload: { configPrefixes: ["channels.mattermost"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(config_schema_js_1.MattermostConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, accounts_js_1.listMattermostAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, accounts_js_1.resolveMattermostAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, accounts_js_1.resolveDefaultMattermostAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "mattermost",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "mattermost",
                accountId: accountId,
                clearBaseFields: ["botToken", "baseUrl", "name"],
            });
        },
        isConfigured: function (account) { return Boolean(account.botToken && account.baseUrl); },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: Boolean(account.botToken && account.baseUrl),
            botTokenSource: account.botTokenSource,
            baseUrl: account.baseUrl,
        }); },
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, accounts_js_1.resolveMattermostAccount)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom.map(function (entry) { return formatAllowEntry(String(entry)); }).filter(Boolean);
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.mattermost) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.mattermost.accounts.".concat(resolvedAccountId, ".")
                : "channels.mattermost.";
            return {
                policy: (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.config.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("mattermost"),
                normalizeEntry: function (raw) { return normalizeAllowEntry(raw); },
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
            return [
                "- Mattermost channels: groupPolicy=\"open\" allows any member to trigger (mention-gated). Set channels.mattermost.groupPolicy=\"allowlist\" + channels.mattermost.groupAllowFrom to restrict senders.",
            ];
        },
    },
    groups: {
        resolveRequireMention: group_mentions_js_1.resolveMattermostGroupRequireMention,
    },
    messaging: {
        normalizeTarget: normalize_js_1.normalizeMattermostMessagingTarget,
        targetResolver: {
            looksLikeId: normalize_js_1.looksLikeMattermostTargetId,
            hint: "<channelId|user:ID|channel:ID>",
        },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: function (text, limit) { return (0, runtime_js_1.getMattermostRuntime)().channel.text.chunkMarkdownText(text, limit); },
        chunkerMode: "markdown",
        textChunkLimit: 4000,
        resolveTarget: function (_a) {
            var to = _a.to;
            var trimmed = to === null || to === void 0 ? void 0 : to.trim();
            if (!trimmed) {
                return {
                    ok: false,
                    error: new Error("Delivering to Mattermost requires --to <channelId|@username|user:ID|channel:ID>"),
                };
            }
            return { ok: true, to: trimmed };
        },
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var result;
            var to = _b.to, text = _b.text, accountId = _b.accountId, replyToId = _b.replyToId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, send_js_1.sendMessageMattermost)(to, text, {
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            replyToId: replyToId !== null && replyToId !== void 0 ? replyToId : undefined,
                        })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, __assign({ channel: "mattermost" }, result)];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var result;
            var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, replyToId = _b.replyToId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, send_js_1.sendMessageMattermost)(to, text, {
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            mediaUrl: mediaUrl,
                            replyToId: replyToId !== null && replyToId !== void 0 ? replyToId : undefined,
                        })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, __assign({ channel: "mattermost" }, result)];
                }
            });
        }); },
    },
    status: {
        defaultRuntime: {
            accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID,
            running: false,
            connected: false,
            lastConnectedAt: null,
            lastDisconnect: null,
            lastStartAt: null,
            lastStopAt: null,
            lastError: null,
        },
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                botTokenSource: (_c = snapshot.botTokenSource) !== null && _c !== void 0 ? _c : "none",
                running: (_d = snapshot.running) !== null && _d !== void 0 ? _d : false,
                connected: (_e = snapshot.connected) !== null && _e !== void 0 ? _e : false,
                lastStartAt: (_f = snapshot.lastStartAt) !== null && _f !== void 0 ? _f : null,
                lastStopAt: (_g = snapshot.lastStopAt) !== null && _g !== void 0 ? _g : null,
                lastError: (_h = snapshot.lastError) !== null && _h !== void 0 ? _h : null,
                baseUrl: (_j = snapshot.baseUrl) !== null && _j !== void 0 ? _j : null,
                probe: snapshot.probe,
                lastProbeAt: (_k = snapshot.lastProbeAt) !== null && _k !== void 0 ? _k : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var token, baseUrl;
            var _c, _d;
            var account = _b.account, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        token = (_c = account.botToken) === null || _c === void 0 ? void 0 : _c.trim();
                        baseUrl = (_d = account.baseUrl) === null || _d === void 0 ? void 0 : _d.trim();
                        if (!token || !baseUrl) {
                            return [2 /*return*/, { ok: false, error: "bot token or baseUrl missing" }];
                        }
                        return [4 /*yield*/, (0, probe_js_1.probeMattermost)(baseUrl, token, timeoutMs)];
                    case 1: return [2 /*return*/, _e.sent()];
                }
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: Boolean(account.botToken && account.baseUrl),
                botTokenSource: account.botTokenSource,
                baseUrl: account.baseUrl,
                running: (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false,
                connected: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.connected) !== null && _c !== void 0 ? _c : false,
                lastConnectedAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastConnectedAt) !== null && _d !== void 0 ? _d : null,
                lastDisconnect: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastDisconnect) !== null && _e !== void 0 ? _e : null,
                lastStartAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _f !== void 0 ? _f : null,
                lastStopAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _g !== void 0 ? _g : null,
                lastError: (_h = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _h !== void 0 ? _h : null,
                probe: probe,
                lastInboundAt: (_j = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _j !== void 0 ? _j : null,
                lastOutboundAt: (_k = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _k !== void 0 ? _k : null,
            });
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
                channelKey: "mattermost",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var _b;
            var accountId = _a.accountId, input = _a.input;
            if (input.useEnv && accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return "Mattermost env vars can only be used for the default account.";
            }
            var token = (_b = input.botToken) !== null && _b !== void 0 ? _b : input.token;
            var baseUrl = input.httpUrl;
            if (!input.useEnv && (!token || !baseUrl)) {
                return "Mattermost requires --bot-token and --http-url (or --use-env).";
            }
            if (baseUrl && !(0, client_js_1.normalizeMattermostBaseUrl)(baseUrl)) {
                return "Mattermost --http-url must include a valid base URL.";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var token = (_c = input.botToken) !== null && _c !== void 0 ? _c : input.token;
            var baseUrl = (_d = input.httpUrl) === null || _d === void 0 ? void 0 : _d.trim();
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "mattermost",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "mattermost",
                })
                : namedConfig;
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { mattermost: __assign(__assign(__assign({}, (_e = next.channels) === null || _e === void 0 ? void 0 : _e.mattermost), { enabled: true }), (input.useEnv
                            ? {}
                            : __assign(__assign({}, (token ? { botToken: token } : {})), (baseUrl ? { baseUrl: baseUrl } : {})))) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { mattermost: __assign(__assign({}, (_f = next.channels) === null || _f === void 0 ? void 0 : _f.mattermost), { enabled: true, accounts: __assign(__assign({}, (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.mattermost) === null || _h === void 0 ? void 0 : _h.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign(__assign({}, (_l = (_k = (_j = next.channels) === null || _j === void 0 ? void 0 : _j.mattermost) === null || _k === void 0 ? void 0 : _k.accounts) === null || _l === void 0 ? void 0 : _l[accountId]), { enabled: true }), (token ? { botToken: token } : {})), (baseUrl ? { baseUrl: baseUrl } : {})), _b)) }) }) });
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                account = ctx.account;
                ctx.setStatus({
                    accountId: account.accountId,
                    baseUrl: account.baseUrl,
                    botTokenSource: account.botTokenSource,
                });
                (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.info("[".concat(account.accountId, "] starting channel"));
                return [2 /*return*/, (0, monitor_js_1.monitorMattermostProvider)({
                        botToken: (_b = account.botToken) !== null && _b !== void 0 ? _b : undefined,
                        baseUrl: (_c = account.baseUrl) !== null && _c !== void 0 ? _c : undefined,
                        accountId: account.accountId,
                        config: ctx.cfg,
                        runtime: ctx.runtime,
                        abortSignal: ctx.abortSignal,
                        statusSink: function (patch) { return ctx.setStatus(__assign({ accountId: ctx.accountId }, patch)); },
                    })];
            });
        }); },
    },
};
