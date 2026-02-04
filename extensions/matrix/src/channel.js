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
exports.matrixPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var actions_js_1 = require("./actions.js");
var config_schema_js_1 = require("./config-schema.js");
var directory_live_js_1 = require("./directory-live.js");
var group_mentions_js_1 = require("./group-mentions.js");
var accounts_js_1 = require("./matrix/accounts.js");
var client_js_1 = require("./matrix/client.js");
var allowlist_js_1 = require("./matrix/monitor/allowlist.js");
var probe_js_1 = require("./matrix/probe.js");
var send_js_1 = require("./matrix/send.js");
var onboarding_js_1 = require("./onboarding.js");
var outbound_js_1 = require("./outbound.js");
var resolve_targets_js_1 = require("./resolve-targets.js");
var meta = {
    id: "matrix",
    label: "Matrix",
    selectionLabel: "Matrix (plugin)",
    docsPath: "/channels/matrix",
    docsLabel: "matrix",
    blurb: "open protocol; configure a homeserver + access token.",
    order: 70,
    quickstartAllowFrom: true,
};
function normalizeMatrixMessagingTarget(raw) {
    var normalized = raw.trim();
    if (!normalized) {
        return undefined;
    }
    var lowered = normalized.toLowerCase();
    if (lowered.startsWith("matrix:")) {
        normalized = normalized.slice("matrix:".length).trim();
    }
    var stripped = normalized.replace(/^(room|channel|user):/i, "").trim();
    return stripped || undefined;
}
function buildMatrixConfigUpdate(cfg, input) {
    var _a, _b;
    var existing = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix) !== null && _b !== void 0 ? _b : {};
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { matrix: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, existing), { enabled: true }), (input.homeserver ? { homeserver: input.homeserver } : {})), (input.userId ? { userId: input.userId } : {})), (input.accessToken ? { accessToken: input.accessToken } : {})), (input.password ? { password: input.password } : {})), (input.deviceName ? { deviceName: input.deviceName } : {})), (typeof input.initialSyncLimit === "number"
                ? { initialSyncLimit: input.initialSyncLimit }
                : {})) }) });
}
exports.matrixPlugin = {
    id: "matrix",
    meta: meta,
    onboarding: onboarding_js_1.matrixOnboardingAdapter,
    pairing: {
        idLabel: "matrixUserId",
        normalizeAllowEntry: function (entry) { return entry.replace(/^matrix:/i, ""); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, send_js_1.sendMessageMatrix)("user:".concat(id), plugin_sdk_1.PAIRING_APPROVED_MESSAGE)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "group", "thread"],
        polls: true,
        reactions: true,
        threads: true,
        media: true,
    },
    reload: { configPrefixes: ["channels.matrix"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(config_schema_js_1.MatrixConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, accounts_js_1.listMatrixAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, accounts_js_1.resolveMatrixAccount)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, accounts_js_1.resolveDefaultMatrixAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "matrix",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "matrix",
                accountId: accountId,
                clearBaseFields: [
                    "name",
                    "homeserver",
                    "userId",
                    "accessToken",
                    "password",
                    "deviceName",
                    "initialSyncLimit",
                ],
            });
        },
        isConfigured: function (account) { return account.configured; },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: account.configured,
            baseUrl: account.homeserver,
        }); },
        resolveAllowFrom: function (_a) {
            var _b, _c, _d, _e;
            var cfg = _a.cfg;
            return ((_e = (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.matrix) === null || _c === void 0 ? void 0 : _c.dm) === null || _d === void 0 ? void 0 : _d.allowFrom) !== null && _e !== void 0 ? _e : []).map(function (entry) { return String(entry); });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return (0, allowlist_js_1.normalizeAllowListLower)(allowFrom);
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e;
            var account = _a.account;
            return ({
                policy: (_c = (_b = account.config.dm) === null || _b === void 0 ? void 0 : _b.policy) !== null && _c !== void 0 ? _c : "pairing",
                allowFrom: (_e = (_d = account.config.dm) === null || _d === void 0 ? void 0 : _d.allowFrom) !== null && _e !== void 0 ? _e : [],
                policyPath: "channels.matrix.dm.policy",
                allowFromPath: "channels.matrix.dm.allowFrom",
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("matrix"),
                normalizeEntry: function (raw) {
                    return raw
                        .replace(/^matrix:/i, "")
                        .trim()
                        .toLowerCase();
                },
            });
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
                '- Matrix rooms: groupPolicy="open" allows any room to trigger (mention-gated). Set channels.matrix.groupPolicy="allowlist" + channels.matrix.groups (and optionally channels.matrix.groupAllowFrom) to restrict rooms.',
            ];
        },
    },
    groups: {
        resolveRequireMention: group_mentions_js_1.resolveMatrixGroupRequireMention,
        resolveToolPolicy: group_mentions_js_1.resolveMatrixGroupToolPolicy,
    },
    threading: {
        resolveReplyToMode: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg;
            return (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.matrix) === null || _c === void 0 ? void 0 : _c.replyToMode) !== null && _d !== void 0 ? _d : "off";
        },
        buildToolContext: function (_a) {
            var context = _a.context, hasRepliedRef = _a.hasRepliedRef;
            var currentTarget = context.To;
            return {
                currentChannelId: (currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.trim()) || undefined,
                currentThreadTs: context.MessageThreadId != null ? String(context.MessageThreadId) : context.ReplyToId,
                hasRepliedRef: hasRepliedRef,
            };
        },
    },
    messaging: {
        normalizeTarget: normalizeMatrixMessagingTarget,
        targetResolver: {
            looksLikeId: function (raw) {
                var trimmed = raw.trim();
                if (!trimmed) {
                    return false;
                }
                if (/^(matrix:)?[!#@]/i.test(trimmed)) {
                    return true;
                }
                return trimmed.includes(":");
            },
            hint: "<room|alias|user>",
        },
    },
    directory: {
        self: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); },
        listPeers: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, q, ids, _i, _c, entry, raw, _d, _e, entry, raw, groups, _f, _g, room, _h, _j, entry, raw;
            var _k, _l, _m, _o, _p, _q;
            var cfg = _b.cfg, accountId = _b.accountId, query = _b.query, limit = _b.limit;
            return __generator(this, function (_r) {
                account = (0, accounts_js_1.resolveMatrixAccount)({ cfg: cfg, accountId: accountId });
                q = (query === null || query === void 0 ? void 0 : query.trim().toLowerCase()) || "";
                ids = new Set();
                for (_i = 0, _c = (_l = (_k = account.config.dm) === null || _k === void 0 ? void 0 : _k.allowFrom) !== null && _l !== void 0 ? _l : []; _i < _c.length; _i++) {
                    entry = _c[_i];
                    raw = String(entry).trim();
                    if (!raw || raw === "*") {
                        continue;
                    }
                    ids.add(raw.replace(/^matrix:/i, ""));
                }
                for (_d = 0, _e = (_m = account.config.groupAllowFrom) !== null && _m !== void 0 ? _m : []; _d < _e.length; _d++) {
                    entry = _e[_d];
                    raw = String(entry).trim();
                    if (!raw || raw === "*") {
                        continue;
                    }
                    ids.add(raw.replace(/^matrix:/i, ""));
                }
                groups = (_p = (_o = account.config.groups) !== null && _o !== void 0 ? _o : account.config.rooms) !== null && _p !== void 0 ? _p : {};
                for (_f = 0, _g = Object.values(groups); _f < _g.length; _f++) {
                    room = _g[_f];
                    for (_h = 0, _j = (_q = room.users) !== null && _q !== void 0 ? _q : []; _h < _j.length; _h++) {
                        entry = _j[_h];
                        raw = String(entry).trim();
                        if (!raw || raw === "*") {
                            continue;
                        }
                        ids.add(raw.replace(/^matrix:/i, ""));
                    }
                }
                return [2 /*return*/, Array.from(ids)
                        .map(function (raw) { return raw.trim(); })
                        .filter(Boolean)
                        .map(function (raw) {
                        var lowered = raw.toLowerCase();
                        var cleaned = lowered.startsWith("user:") ? raw.slice("user:".length).trim() : raw;
                        if (cleaned.startsWith("@")) {
                            return "user:".concat(cleaned);
                        }
                        return cleaned;
                    })
                        .filter(function (id) { return (q ? id.toLowerCase().includes(q) : true); })
                        .slice(0, limit && limit > 0 ? limit : undefined)
                        .map(function (id) {
                        var raw = id.startsWith("user:") ? id.slice("user:".length) : id;
                        var incomplete = !raw.startsWith("@") || !raw.includes(":");
                        return __assign({ kind: "user", id: id }, (incomplete ? { name: "incomplete id; expected @user:server" } : {}));
                    })];
            });
        }); },
        listGroups: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, q, groups, ids;
            var _c, _d;
            var cfg = _b.cfg, accountId = _b.accountId, query = _b.query, limit = _b.limit;
            return __generator(this, function (_e) {
                account = (0, accounts_js_1.resolveMatrixAccount)({ cfg: cfg, accountId: accountId });
                q = (query === null || query === void 0 ? void 0 : query.trim().toLowerCase()) || "";
                groups = (_d = (_c = account.config.groups) !== null && _c !== void 0 ? _c : account.config.rooms) !== null && _d !== void 0 ? _d : {};
                ids = Object.keys(groups)
                    .map(function (raw) { return raw.trim(); })
                    .filter(function (raw) { return Boolean(raw) && raw !== "*"; })
                    .map(function (raw) { return raw.replace(/^matrix:/i, ""); })
                    .map(function (raw) {
                    var lowered = raw.toLowerCase();
                    if (lowered.startsWith("room:") || lowered.startsWith("channel:")) {
                        return raw;
                    }
                    if (raw.startsWith("!")) {
                        return "room:".concat(raw);
                    }
                    return raw;
                })
                    .filter(function (id) { return (q ? id.toLowerCase().includes(q) : true); })
                    .slice(0, limit && limit > 0 ? limit : undefined)
                    .map(function (id) { return ({ kind: "group", id: id }); });
                return [2 /*return*/, ids];
            });
        }); },
        listPeersLive: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var cfg = _b.cfg, query = _b.query, limit = _b.limit;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, directory_live_js_1.listMatrixDirectoryPeersLive)({ cfg: cfg, query: query, limit: limit })];
            });
        }); },
        listGroupsLive: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var cfg = _b.cfg, query = _b.query, limit = _b.limit;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, directory_live_js_1.listMatrixDirectoryGroupsLive)({ cfg: cfg, query: query, limit: limit })];
            });
        }); },
    },
    resolver: {
        resolveTargets: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var cfg = _b.cfg, inputs = _b.inputs, kind = _b.kind, runtime = _b.runtime;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, resolve_targets_js_1.resolveMatrixTargets)({ cfg: cfg, inputs: inputs, kind: kind, runtime: runtime })];
            });
        }); },
    },
    actions: actions_js_1.matrixMessageActions,
    setup: {
        resolveAccountId: function (_a) {
            var accountId = _a.accountId;
            return (0, plugin_sdk_1.normalizeAccountId)(accountId);
        },
        applyAccountName: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, name = _a.name;
            return (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "matrix",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var _b, _c, _d, _e;
            var input = _a.input;
            if (input.useEnv) {
                return null;
            }
            if (!((_b = input.homeserver) === null || _b === void 0 ? void 0 : _b.trim())) {
                return "Matrix requires --homeserver";
            }
            var accessToken = (_c = input.accessToken) === null || _c === void 0 ? void 0 : _c.trim();
            var password = (_d = input.password) === null || _d === void 0 ? void 0 : _d.trim();
            var userId = (_e = input.userId) === null || _e === void 0 ? void 0 : _e.trim();
            if (!accessToken && !password) {
                return "Matrix requires --access-token or --password";
            }
            if (!accessToken) {
                if (!userId) {
                    return "Matrix requires --user-id when using --password";
                }
                if (!password) {
                    return "Matrix requires --password when using --user-id";
                }
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "matrix",
                accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID,
                name: input.name,
            });
            if (input.useEnv) {
                return __assign(__assign({}, namedConfig), { channels: __assign(__assign({}, namedConfig.channels), { matrix: __assign(__assign({}, (_b = namedConfig.channels) === null || _b === void 0 ? void 0 : _b.matrix), { enabled: true }) }) });
            }
            return buildMatrixConfigUpdate(namedConfig, {
                homeserver: (_c = input.homeserver) === null || _c === void 0 ? void 0 : _c.trim(),
                userId: (_d = input.userId) === null || _d === void 0 ? void 0 : _d.trim(),
                accessToken: (_e = input.accessToken) === null || _e === void 0 ? void 0 : _e.trim(),
                password: (_f = input.password) === null || _f === void 0 ? void 0 : _f.trim(),
                deviceName: (_g = input.deviceName) === null || _g === void 0 ? void 0 : _g.trim(),
                initialSyncLimit: input.initialSyncLimit,
            });
        },
    },
    outbound: outbound_js_1.matrixOutbound,
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
                        channel: "matrix",
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
            var auth, err_1;
            var timeoutMs = _b.timeoutMs, cfg = _b.cfg;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, client_js_1.resolveMatrixAuth)({ cfg: cfg })];
                    case 1:
                        auth = _c.sent();
                        return [4 /*yield*/, (0, probe_js_1.probeMatrix)({
                                homeserver: auth.homeserver,
                                accessToken: auth.accessToken,
                                userId: auth.userId,
                                timeoutMs: timeoutMs,
                            })];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3:
                        err_1 = _c.sent();
                        return [2 /*return*/, {
                                ok: false,
                                error: err_1 instanceof Error ? err_1.message : String(err_1),
                                elapsedMs: 0,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: account.configured,
                baseUrl: account.homeserver,
                running: (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false,
                lastStartAt: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _c !== void 0 ? _c : null,
                lastStopAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _d !== void 0 ? _d : null,
                lastError: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _e !== void 0 ? _e : null,
                probe: probe,
                lastProbeAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastProbeAt) !== null && _f !== void 0 ? _f : null,
                lastInboundAt: (_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _g !== void 0 ? _g : null,
                lastOutboundAt: (_h = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _h !== void 0 ? _h : null,
            });
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, monitorMatrixProvider;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = ctx.account;
                        ctx.setStatus({
                            accountId: account.accountId,
                            baseUrl: account.homeserver,
                        });
                        (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.info("[".concat(account.accountId, "] starting provider (").concat((_b = account.homeserver) !== null && _b !== void 0 ? _b : "matrix", ")"));
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./matrix/index.js"); })];
                    case 1:
                        monitorMatrixProvider = (_c.sent()).monitorMatrixProvider;
                        return [2 /*return*/, monitorMatrixProvider({
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                                mediaMaxMb: account.config.mediaMaxMb,
                                initialSyncLimit: account.config.initialSyncLimit,
                                replyToMode: account.config.replyToMode,
                                accountId: account.accountId,
                            })];
                }
            });
        }); },
    },
};
