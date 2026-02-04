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
exports.imessagePlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var runtime_js_1 = require("./runtime.js");
var meta = (0, plugin_sdk_1.getChatChannelMeta)("imessage");
exports.imessagePlugin = {
    id: "imessage",
    meta: __assign(__assign({}, meta), { aliases: ["imsg"], showConfigured: false }),
    onboarding: plugin_sdk_1.imessageOnboardingAdapter,
    pairing: {
        idLabel: "imessageSenderId",
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, runtime_js_1.getIMessageRuntime)().channel.imessage.sendMessageIMessage(id, plugin_sdk_1.PAIRING_APPROVED_MESSAGE)];
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
    },
    reload: { configPrefixes: ["channels.imessage"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(plugin_sdk_1.IMessageConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, plugin_sdk_1.listIMessageAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, plugin_sdk_1.resolveIMessageAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, plugin_sdk_1.resolveDefaultIMessageAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "imessage",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "imessage",
                accountId: accountId,
                clearBaseFields: ["cliPath", "dbPath", "service", "region", "name"],
            });
        },
        isConfigured: function (account) { return account.configured; },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: account.configured,
        }); },
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, plugin_sdk_1.resolveIMessageAccount)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom.map(function (entry) { return String(entry).trim(); }).filter(Boolean);
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.imessage) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.imessage.accounts.".concat(resolvedAccountId, ".")
                : "channels.imessage.";
            return {
                policy: (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.config.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("imessage"),
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
                "- iMessage groups: groupPolicy=\"open\" allows any member to trigger the bot. Set channels.imessage.groupPolicy=\"allowlist\" + channels.imessage.groupAllowFrom to restrict senders.",
            ];
        },
    },
    groups: {
        resolveRequireMention: plugin_sdk_1.resolveIMessageGroupRequireMention,
        resolveToolPolicy: plugin_sdk_1.resolveIMessageGroupToolPolicy,
    },
    messaging: {
        normalizeTarget: plugin_sdk_1.normalizeIMessageMessagingTarget,
        targetResolver: {
            looksLikeId: plugin_sdk_1.looksLikeIMessageTargetId,
            hint: "<handle|chat_id:ID>",
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
                channelKey: "imessage",
                accountId: accountId,
                name: name,
            });
        },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "imessage",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "imessage",
                })
                : namedConfig;
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { imessage: __assign(__assign(__assign(__assign(__assign(__assign({}, (_c = next.channels) === null || _c === void 0 ? void 0 : _c.imessage), { enabled: true }), (input.cliPath ? { cliPath: input.cliPath } : {})), (input.dbPath ? { dbPath: input.dbPath } : {})), (input.service ? { service: input.service } : {})), (input.region ? { region: input.region } : {})) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { imessage: __assign(__assign({}, (_d = next.channels) === null || _d === void 0 ? void 0 : _d.imessage), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e.imessage) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign(__assign(__assign(__assign(__assign({}, (_j = (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.imessage) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: true }), (input.cliPath ? { cliPath: input.cliPath } : {})), (input.dbPath ? { dbPath: input.dbPath } : {})), (input.service ? { service: input.service } : {})), (input.region ? { region: input.region } : {})), _b)) }) }) });
        },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: function (text, limit) { return (0, runtime_js_1.getIMessageRuntime)().channel.text.chunkText(text, limit); },
        chunkerMode: "text",
        textChunkLimit: 4000,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var send, maxBytes, result;
            var _c;
            var cfg = _b.cfg, to = _b.to, text = _b.text, accountId = _b.accountId, deps = _b.deps;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendIMessage) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getIMessageRuntime)().channel.imessage.sendMessageIMessage;
                        maxBytes = (0, plugin_sdk_1.resolveChannelMediaMaxBytes)({
                            cfg: cfg,
                            resolveChannelLimitMb: function (_a) {
                                var _b, _c, _d, _e, _f, _g, _h;
                                var cfg = _a.cfg, accountId = _a.accountId;
                                return (_f = (_e = (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.imessage) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d[accountId]) === null || _e === void 0 ? void 0 : _e.mediaMaxMb) !== null && _f !== void 0 ? _f : (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.imessage) === null || _h === void 0 ? void 0 : _h.mediaMaxMb;
                            },
                            accountId: accountId,
                        });
                        return [4 /*yield*/, send(to, text, {
                                maxBytes: maxBytes,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, __assign({ channel: "imessage" }, result)];
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
                        send = (_c = deps === null || deps === void 0 ? void 0 : deps.sendIMessage) !== null && _c !== void 0 ? _c : (0, runtime_js_1.getIMessageRuntime)().channel.imessage.sendMessageIMessage;
                        maxBytes = (0, plugin_sdk_1.resolveChannelMediaMaxBytes)({
                            cfg: cfg,
                            resolveChannelLimitMb: function (_a) {
                                var _b, _c, _d, _e, _f, _g, _h;
                                var cfg = _a.cfg, accountId = _a.accountId;
                                return (_f = (_e = (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.imessage) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d[accountId]) === null || _e === void 0 ? void 0 : _e.mediaMaxMb) !== null && _f !== void 0 ? _f : (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.imessage) === null || _h === void 0 ? void 0 : _h.mediaMaxMb;
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
                        return [2 /*return*/, __assign({ channel: "imessage" }, result)];
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
            cliPath: null,
            dbPath: null,
        },
        collectStatusIssues: function (accounts) {
            return accounts.flatMap(function (account) {
                var lastError = typeof account.lastError === "string" ? account.lastError.trim() : "";
                if (!lastError) {
                    return [];
                }
                return [
                    {
                        channel: "imessage",
                        accountId: account.accountId,
                        kind: "runtime",
                        message: "Channel error: ".concat(lastError),
                    },
                ];
            });
        },
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                running: (_c = snapshot.running) !== null && _c !== void 0 ? _c : false,
                lastStartAt: (_d = snapshot.lastStartAt) !== null && _d !== void 0 ? _d : null,
                lastStopAt: (_e = snapshot.lastStopAt) !== null && _e !== void 0 ? _e : null,
                lastError: (_f = snapshot.lastError) !== null && _f !== void 0 ? _f : null,
                cliPath: (_g = snapshot.cliPath) !== null && _g !== void 0 ? _g : null,
                dbPath: (_h = snapshot.dbPath) !== null && _h !== void 0 ? _h : null,
                probe: snapshot.probe,
                lastProbeAt: (_j = snapshot.lastProbeAt) !== null && _j !== void 0 ? _j : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var timeoutMs = _b.timeoutMs;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, runtime_js_1.getIMessageRuntime)().channel.imessage.probeIMessage(timeoutMs)];
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: account.configured,
                running: (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false,
                lastStartAt: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _c !== void 0 ? _c : null,
                lastStopAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _d !== void 0 ? _d : null,
                lastError: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _e !== void 0 ? _e : null,
                cliPath: (_g = (_f = runtime === null || runtime === void 0 ? void 0 : runtime.cliPath) !== null && _f !== void 0 ? _f : account.config.cliPath) !== null && _g !== void 0 ? _g : null,
                dbPath: (_j = (_h = runtime === null || runtime === void 0 ? void 0 : runtime.dbPath) !== null && _h !== void 0 ? _h : account.config.dbPath) !== null && _j !== void 0 ? _j : null,
                probe: probe,
                lastInboundAt: (_k = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _k !== void 0 ? _k : null,
                lastOutboundAt: (_l = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _l !== void 0 ? _l : null,
            });
        },
        resolveAccountState: function (_a) {
            var enabled = _a.enabled;
            return (enabled ? "enabled" : "disabled");
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, cliPath, dbPath;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                account = ctx.account;
                cliPath = ((_a = account.config.cliPath) === null || _a === void 0 ? void 0 : _a.trim()) || "imsg";
                dbPath = (_b = account.config.dbPath) === null || _b === void 0 ? void 0 : _b.trim();
                ctx.setStatus({
                    accountId: account.accountId,
                    cliPath: cliPath,
                    dbPath: dbPath !== null && dbPath !== void 0 ? dbPath : null,
                });
                (_c = ctx.log) === null || _c === void 0 ? void 0 : _c.info("[".concat(account.accountId, "] starting provider (").concat(cliPath).concat(dbPath ? " db=".concat(dbPath) : "", ")"));
                return [2 /*return*/, (0, runtime_js_1.getIMessageRuntime)().channel.imessage.monitorIMessageProvider({
                        accountId: account.accountId,
                        config: ctx.cfg,
                        runtime: ctx.runtime,
                        abortSignal: ctx.abortSignal,
                    })];
            });
        }); },
    },
};
