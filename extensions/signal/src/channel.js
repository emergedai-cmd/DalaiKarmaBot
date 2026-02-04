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
exports.signalPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var runtime_js_1 = require("./runtime.js");
var signalMessageActions = {
    listActions: function (ctx) { return (0, runtime_js_1.getSignalRuntime)().channel.signal.messageActions.listActions(ctx); },
    supportsAction: function (ctx) { var _a, _b; return (_b = (_a = (0, runtime_js_1.getSignalRuntime)().channel.signal.messageActions).supportsAction) === null || _b === void 0 ? void 0 : _b.call(_a, ctx); },
    handleAction: function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, runtime_js_1.getSignalRuntime)().channel.signal.messageActions.handleAction(ctx)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); },
};
var meta = (0, plugin_sdk_1.getChatChannelMeta)("signal");
exports.signalPlugin = {
    id: "signal",
    meta: __assign({}, meta),
    onboarding: plugin_sdk_1.signalOnboardingAdapter,
    pairing: {
        idLabel: "signalNumber",
        normalizeAllowEntry: function (entry) { return entry.replace(/^signal:/i, ""); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, runtime_js_1.getSignalRuntime)().channel.signal.sendMessageSignal(id, plugin_sdk_1.PAIRING_APPROVED_MESSAGE)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "group"],
        media: true,
        reactions: true,
    },
    actions: signalMessageActions,
    streaming: {
        blockStreamingCoalesceDefaults: { minChars: 1500, idleMs: 1000 },
    },
    reload: { configPrefixes: ["channels.signal"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(plugin_sdk_1.SignalConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, plugin_sdk_1.listSignalAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, plugin_sdk_1.resolveSignalAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, plugin_sdk_1.resolveDefaultSignalAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "signal",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "signal",
                accountId: accountId,
                clearBaseFields: ["account", "httpUrl", "httpHost", "httpPort", "cliPath", "name"],
            });
        },
        isConfigured: function (account) { return account.configured; },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: account.configured,
            baseUrl: account.baseUrl,
        }); },
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, plugin_sdk_1.resolveSignalAccount)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return (entry === "*" ? "*" : (0, plugin_sdk_1.normalizeE164)(entry.replace(/^signal:/i, ""))); })
                .filter(Boolean);
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.signal) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.signal.accounts.".concat(resolvedAccountId, ".")
                : "channels.signal.";
            return {
                policy: (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.config.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("signal"),
                normalizeEntry: function (raw) { return (0, plugin_sdk_1.normalizeE164)(raw.replace(/^signal:/i, "").trim()); },
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
                "- Signal groups: groupPolicy=\"open\" allows any member to trigger the bot. Set channels.signal.groupPolicy=\"allowlist\" + channels.signal.groupAllowFrom to restrict senders.",
            ];
        },
    },
    messaging: {
        normalizeTarget: plugin_sdk_1.normalizeSignalMessagingTarget,
        targetResolver: {
            looksLikeId: plugin_sdk_1.looksLikeSignalTargetId,
            hint: "<E.164|uuid:ID|group:ID|signal:group:ID|signal:+E.164>",
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
                channelKey: "signal",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var input = _a.input;
            if (!input.signalNumber &&
                !input.httpUrl &&
                !input.httpHost &&
                !input.httpPort &&
                !input.cliPath) {
                return "Signal requires --signal-number or --http-url/--http-host/--http-port/--cli-path.";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "signal",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "signal",
                })
                : namedConfig;
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { signal: __assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (_c = next.channels) === null || _c === void 0 ? void 0 : _c.signal), { enabled: true }), (input.signalNumber ? { account: input.signalNumber } : {})), (input.cliPath ? { cliPath: input.cliPath } : {})), (input.httpUrl ? { httpUrl: input.httpUrl } : {})), (input.httpHost ? { httpHost: input.httpHost } : {})), (input.httpPort ? { httpPort: Number(input.httpPort) } : {})) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { signal: __assign(__assign({}, (_d = next.channels) === null || _d === void 0 ? void 0 : _d.signal), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e.signal) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (_j = (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.signal) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: true }), (input.signalNumber ? { account: input.signalNumber } : {})), (input.cliPath ? { cliPath: input.cliPath } : {})), (input.httpUrl ? { httpUrl: input.httpUrl } : {})), (input.httpHost ? { httpHost: input.httpHost } : {})), (input.httpPort ? { httpPort: Number(input.httpPort) } : {})), _b)) }) }) });
        },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: function (text, limit) { return (0, runtime_js_1.getSignalRuntime)().channel.text.chunkText(text, limit); },
        chunkerMode: "text",
        textChunkLimit: 4000,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, maxBytes, result;
            var _c;
            var cfg = _b.cfg, to = _b.to, text = _b.text, accountId = _b.accountId, deps = _b.deps;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendSignal) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getSignalRuntime)().channel.signal.sendMessageSignal;
                        maxBytes = (0, plugin_sdk_1.resolveChannelMediaMaxBytes)({
                            cfg: cfg,
                            resolveChannelLimitMb: function (_a) {
                                var _b, _c, _d, _e, _f, _g, _h;
                                var cfg = _a.cfg, accountId = _a.accountId;
                                return (_f = (_e = (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.signal) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d[accountId]) === null || _e === void 0 ? void 0 : _e.mediaMaxMb) !== null && _f !== void 0 ? _f : (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.signal) === null || _h === void 0 ? void 0 : _h.mediaMaxMb;
                            },
                            accountId: accountId,
                        });
                        return [4 /*yield*/, send(to, text, {
                                maxBytes: maxBytes,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, __assign({ channel: "signal" }, result)];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, maxBytes, result;
            var _c;
            var cfg = _b.cfg, to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, deps = _b.deps;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendSignal) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getSignalRuntime)().channel.signal.sendMessageSignal;
                        maxBytes = (0, plugin_sdk_1.resolveChannelMediaMaxBytes)({
                            cfg: cfg,
                            resolveChannelLimitMb: function (_a) {
                                var _b, _c, _d, _e, _f, _g, _h;
                                var cfg = _a.cfg, accountId = _a.accountId;
                                return (_f = (_e = (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.signal) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d[accountId]) === null || _e === void 0 ? void 0 : _e.mediaMaxMb) !== null && _f !== void 0 ? _f : (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.signal) === null || _h === void 0 ? void 0 : _h.mediaMaxMb;
                            },
                            accountId: accountId,
                        });
                        return [4 /*yield*/, send(to, text, {
                                mediaUrl: mediaUrl,
                                maxBytes: maxBytes,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, __assign({ channel: "signal" }, result)];
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
            return accounts.flatMap(function (account) {
                var lastError = typeof account.lastError === "string" ? account.lastError.trim() : "";
                if (!lastError) {
                    return [];
                }
                return [
                    {
                        channel: "signal",
                        accountId: account.accountId,
                        kind: "runtime",
                        message: "Channel error: ".concat(lastError),
                    },
                ];
            });
        },
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                baseUrl: (_c = snapshot.baseUrl) !== null && _c !== void 0 ? _c : null,
                running: (_d = snapshot.running) !== null && _d !== void 0 ? _d : false,
                lastStartAt: (_e = snapshot.lastStartAt) !== null && _e !== void 0 ? _e : null,
                lastStopAt: (_f = snapshot.lastStopAt) !== null && _f !== void 0 ? _f : null,
                lastError: (_g = snapshot.lastError) !== null && _g !== void 0 ? _g : null,
                probe: snapshot.probe,
                lastProbeAt: (_h = snapshot.lastProbeAt) !== null && _h !== void 0 ? _h : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var baseUrl;
            var account = _b.account, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        baseUrl = account.baseUrl;
                        return [4 /*yield*/, (0, runtime_js_1.getSignalRuntime)().channel.signal.probeSignal(baseUrl, timeoutMs)];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: account.configured,
                baseUrl: account.baseUrl,
                running: (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false,
                lastStartAt: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _c !== void 0 ? _c : null,
                lastStopAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _d !== void 0 ? _d : null,
                lastError: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _e !== void 0 ? _e : null,
                probe: probe,
                lastInboundAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _f !== void 0 ? _f : null,
                lastOutboundAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _g !== void 0 ? _g : null,
            });
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account;
            var _a;
            return __generator(this, function (_b) {
                account = ctx.account;
                ctx.setStatus({
                    accountId: account.accountId,
                    baseUrl: account.baseUrl,
                });
                (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.info("[".concat(account.accountId, "] starting provider (").concat(account.baseUrl, ")"));
                // Lazy import: the monitor pulls the reply pipeline; avoid ESM init cycles.
                return [2 /*return*/, (0, runtime_js_1.getSignalRuntime)().channel.signal.monitorSignalProvider({
                        accountId: account.accountId,
                        config: ctx.cfg,
                        runtime: ctx.runtime,
                        abortSignal: ctx.abortSignal,
                        mediaMaxMb: account.config.mediaMaxMb,
                    })];
            });
        }); },
    },
};
