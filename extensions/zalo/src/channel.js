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
exports.zaloPlugin = exports.zaloDock = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var actions_js_1 = require("./actions.js");
var config_schema_js_1 = require("./config-schema.js");
var onboarding_js_1 = require("./onboarding.js");
var probe_js_1 = require("./probe.js");
var proxy_js_1 = require("./proxy.js");
var send_js_1 = require("./send.js");
var status_issues_js_1 = require("./status-issues.js");
var meta = {
    id: "zalo",
    label: "Zalo",
    selectionLabel: "Zalo (Bot API)",
    docsPath: "/channels/zalo",
    docsLabel: "zalo",
    blurb: "Vietnam-focused messaging platform with Bot API.",
    aliases: ["zl"],
    order: 80,
    quickstartAllowFrom: true,
};
function normalizeZaloMessagingTarget(raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
    if (!trimmed) {
        return undefined;
    }
    return trimmed.replace(/^(zalo|zl):/i, "");
}
exports.zaloDock = {
    id: "zalo",
    capabilities: {
        chatTypes: ["direct"],
        media: true,
        blockStreaming: true,
    },
    outbound: { textChunkLimit: 2000 },
    config: {
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, accounts_js_1.resolveZaloAccount)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return entry.replace(/^(zalo|zl):/i, ""); })
                .map(function (entry) { return entry.toLowerCase(); });
        },
    },
    groups: {
        resolveRequireMention: function () { return true; },
    },
    threading: {
        resolveReplyToMode: function () { return "off"; },
    },
};
exports.zaloPlugin = {
    id: "zalo",
    meta: meta,
    onboarding: onboarding_js_1.zaloOnboardingAdapter,
    capabilities: {
        chatTypes: ["direct"],
        media: true,
        reactions: false,
        threads: false,
        polls: false,
        nativeCommands: false,
        blockStreaming: true,
    },
    reload: { configPrefixes: ["channels.zalo"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(config_schema_js_1.ZaloConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, accounts_js_1.listZaloAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, accounts_js_1.resolveZaloAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, accounts_js_1.resolveDefaultZaloAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "zalo",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "zalo",
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
            return ((_b = (0, accounts_js_1.resolveZaloAccount)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return entry.replace(/^(zalo|zl):/i, ""); })
                .map(function (entry) { return entry.toLowerCase(); });
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.zalo) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.zalo.accounts.".concat(resolvedAccountId, ".")
                : "channels.zalo.";
            return {
                policy: (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.config.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("zalo"),
                normalizeEntry: function (raw) { return raw.replace(/^(zalo|zl):/i, ""); },
            };
        },
    },
    groups: {
        resolveRequireMention: function () { return true; },
    },
    threading: {
        resolveReplyToMode: function () { return "off"; },
    },
    actions: actions_js_1.zaloMessageActions,
    messaging: {
        normalizeTarget: normalizeZaloMessagingTarget,
        targetResolver: {
            looksLikeId: function (raw) {
                var trimmed = raw.trim();
                if (!trimmed) {
                    return false;
                }
                return /^\d{3,}$/.test(trimmed);
            },
            hint: "<chatId>",
        },
    },
    directory: {
        self: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); },
        listPeers: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, q, peers;
            var _c;
            var cfg = _b.cfg, accountId = _b.accountId, query = _b.query, limit = _b.limit;
            return __generator(this, function (_d) {
                account = (0, accounts_js_1.resolveZaloAccount)({ cfg: cfg, accountId: accountId });
                q = (query === null || query === void 0 ? void 0 : query.trim().toLowerCase()) || "";
                peers = Array.from(new Set(((_c = account.config.allowFrom) !== null && _c !== void 0 ? _c : [])
                    .map(function (entry) { return String(entry).trim(); })
                    .filter(function (entry) { return Boolean(entry) && entry !== "*"; })
                    .map(function (entry) { return entry.replace(/^(zalo|zl):/i, ""); })))
                    .filter(function (id) { return (q ? id.toLowerCase().includes(q) : true); })
                    .slice(0, limit && limit > 0 ? limit : undefined)
                    .map(function (id) { return ({ kind: "user", id: id }); });
                return [2 /*return*/, peers];
            });
        }); },
        listGroups: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); }); },
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
                channelKey: "zalo",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var accountId = _a.accountId, input = _a.input;
            if (input.useEnv && accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return "ZALO_BOT_TOKEN can only be used for the default account.";
            }
            if (!input.useEnv && !input.token && !input.tokenFile) {
                return "Zalo requires token or --token-file (or --use-env).";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "zalo",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "zalo",
                })
                : namedConfig;
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { zalo: __assign(__assign(__assign({}, (_c = next.channels) === null || _c === void 0 ? void 0 : _c.zalo), { enabled: true }), (input.useEnv
                            ? {}
                            : input.tokenFile
                                ? { tokenFile: input.tokenFile }
                                : input.token
                                    ? { botToken: input.token }
                                    : {})) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { zalo: __assign(__assign({}, (_d = next.channels) === null || _d === void 0 ? void 0 : _d.zalo), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e.zalo) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign({}, (_j = (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.zalo) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: true }), (input.tokenFile
                            ? { tokenFile: input.tokenFile }
                            : input.token
                                ? { botToken: input.token }
                                : {})), _b)) }) }) });
        },
    },
    pairing: {
        idLabel: "zaloUserId",
        normalizeAllowEntry: function (entry) { return entry.replace(/^(zalo|zl):/i, ""); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account;
            var cfg = _b.cfg, id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = (0, accounts_js_1.resolveZaloAccount)({ cfg: cfg });
                        if (!account.token) {
                            throw new Error("Zalo token not configured");
                        }
                        return [4 /*yield*/, (0, send_js_1.sendMessageZalo)(id, plugin_sdk_1.PAIRING_APPROVED_MESSAGE, { token: account.token })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: function (text, limit) {
            if (!text) {
                return [];
            }
            if (limit <= 0 || text.length <= limit) {
                return [text];
            }
            var chunks = [];
            var remaining = text;
            while (remaining.length > limit) {
                var window_1 = remaining.slice(0, limit);
                var lastNewline = window_1.lastIndexOf("\n");
                var lastSpace = window_1.lastIndexOf(" ");
                var breakIdx = lastNewline > 0 ? lastNewline : lastSpace;
                if (breakIdx <= 0) {
                    breakIdx = limit;
                }
                var rawChunk = remaining.slice(0, breakIdx);
                var chunk = rawChunk.trimEnd();
                if (chunk.length > 0) {
                    chunks.push(chunk);
                }
                var brokeOnSeparator = breakIdx < remaining.length && /\s/.test(remaining[breakIdx]);
                var nextStart = Math.min(remaining.length, breakIdx + (brokeOnSeparator ? 1 : 0));
                remaining = remaining.slice(nextStart).trimStart();
            }
            if (remaining.length) {
                chunks.push(remaining);
            }
            return chunks;
        },
        chunkerMode: "text",
        textChunkLimit: 2000,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var result;
            var _c;
            var to = _b.to, text = _b.text, accountId = _b.accountId, cfg = _b.cfg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, send_js_1.sendMessageZalo)(to, text, {
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            cfg: cfg,
                        })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, {
                                channel: "zalo",
                                ok: result.ok,
                                messageId: (_c = result.messageId) !== null && _c !== void 0 ? _c : "",
                                error: result.error ? new Error(result.error) : undefined,
                            }];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var result;
            var _c;
            var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, cfg = _b.cfg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, send_js_1.sendMessageZalo)(to, text, {
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            mediaUrl: mediaUrl,
                            cfg: cfg,
                        })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, {
                                channel: "zalo",
                                ok: result.ok,
                                messageId: (_c = result.messageId) !== null && _c !== void 0 ? _c : "",
                                error: result.error ? new Error(result.error) : undefined,
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
        collectStatusIssues: status_issues_js_1.collectZaloStatusIssues,
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
                return [2 /*return*/, (0, probe_js_1.probeZalo)(account.token, timeoutMs, (0, proxy_js_1.resolveZaloProxyFetch)(account.config.proxy))];
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j;
            var account = _a.account, runtime = _a.runtime;
            var configured = Boolean((_b = account.token) === null || _b === void 0 ? void 0 : _b.trim());
            return {
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: configured,
                tokenSource: account.tokenSource,
                running: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _c !== void 0 ? _c : false,
                lastStartAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _d !== void 0 ? _d : null,
                lastStopAt: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _e !== void 0 ? _e : null,
                lastError: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _f !== void 0 ? _f : null,
                mode: account.config.webhookUrl ? "webhook" : "polling",
                lastInboundAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _g !== void 0 ? _g : null,
                lastOutboundAt: (_h = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _h !== void 0 ? _h : null,
                dmPolicy: (_j = account.config.dmPolicy) !== null && _j !== void 0 ? _j : "pairing",
            };
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, token, zaloBotLabel, fetcher, probe, name_1, _a, monitorZaloProvider;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        account = ctx.account;
                        token = account.token.trim();
                        zaloBotLabel = "";
                        fetcher = (0, proxy_js_1.resolveZaloProxyFetch)(account.config.proxy);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, probe_js_1.probeZalo)(token, 2500, fetcher)];
                    case 2:
                        probe = _e.sent();
                        name_1 = probe.ok ? (_c = (_b = probe.bot) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.trim() : null;
                        if (name_1) {
                            zaloBotLabel = " (".concat(name_1, ")");
                        }
                        ctx.setStatus({
                            accountId: account.accountId,
                            bot: probe.bot,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _e.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        (_d = ctx.log) === null || _d === void 0 ? void 0 : _d.info("[".concat(account.accountId, "] starting provider").concat(zaloBotLabel));
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                    case 5:
                        monitorZaloProvider = (_e.sent()).monitorZaloProvider;
                        return [2 /*return*/, monitorZaloProvider({
                                token: token,
                                account: account,
                                config: ctx.cfg,
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                                useWebhook: Boolean(account.config.webhookUrl),
                                webhookUrl: account.config.webhookUrl,
                                webhookSecret: account.config.webhookSecret,
                                webhookPath: account.config.webhookPath,
                                fetcher: fetcher,
                                statusSink: function (patch) { return ctx.setStatus(__assign({ accountId: ctx.accountId }, patch)); },
                            })];
                }
            });
        }); },
    },
};
