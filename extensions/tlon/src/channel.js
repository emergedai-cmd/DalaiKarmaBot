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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tlonPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var config_schema_js_1 = require("./config-schema.js");
var index_js_1 = require("./monitor/index.js");
var onboarding_js_1 = require("./onboarding.js");
var targets_js_1 = require("./targets.js");
var types_js_1 = require("./types.js");
var http_api_js_1 = require("./urbit/http-api.js");
var send_js_1 = require("./urbit/send.js");
var TLON_CHANNEL_ID = "tlon";
function applyTlonSetupConfig(params) {
    var _a;
    var _b, _c, _d, _e;
    var cfg = params.cfg, accountId = params.accountId, input = params.input;
    var useDefault = accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
        cfg: cfg,
        channelKey: "tlon",
        accountId: accountId,
        name: input.name,
    });
    var base = (_c = (_b = namedConfig.channels) === null || _b === void 0 ? void 0 : _b.tlon) !== null && _c !== void 0 ? _c : {};
    var payload = __assign(__assign(__assign(__assign(__assign(__assign({}, (input.ship ? { ship: input.ship } : {})), (input.url ? { url: input.url } : {})), (input.code ? { code: input.code } : {})), (input.groupChannels ? { groupChannels: input.groupChannels } : {})), (input.dmAllowlist ? { dmAllowlist: input.dmAllowlist } : {})), (typeof input.autoDiscoverChannels === "boolean"
        ? { autoDiscoverChannels: input.autoDiscoverChannels }
        : {}));
    if (useDefault) {
        return __assign(__assign({}, namedConfig), { channels: __assign(__assign({}, namedConfig.channels), { tlon: __assign(__assign(__assign({}, base), { enabled: true }), payload) }) });
    }
    return __assign(__assign({}, namedConfig), { channels: __assign(__assign({}, namedConfig.channels), { tlon: __assign(__assign({}, base), { enabled: (_d = base.enabled) !== null && _d !== void 0 ? _d : true, accounts: __assign(__assign({}, base.accounts), (_a = {}, _a[accountId] = __assign(__assign(__assign({}, (_e = base.accounts) === null || _e === void 0 ? void 0 : _e[accountId]), { enabled: true }), payload), _a)) }) }) });
}
var tlonOutbound = {
    deliveryMode: "direct",
    textChunkLimit: 10000,
    resolveTarget: function (_a) {
        var to = _a.to;
        var parsed = (0, targets_js_1.parseTlonTarget)(to !== null && to !== void 0 ? to : "");
        if (!parsed) {
            return {
                ok: false,
                error: new Error("Invalid Tlon target. Use ".concat((0, targets_js_1.formatTargetHint)())),
            };
        }
        if (parsed.kind === "dm") {
            return { ok: true, to: parsed.ship };
        }
        return { ok: true, to: parsed.nest };
    },
    sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var account, parsed, api, fromShip, replyId, _c;
        var cfg = _b.cfg, to = _b.to, text = _b.text, accountId = _b.accountId, replyToId = _b.replyToId, threadId = _b.threadId;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    account = (0, types_js_1.resolveTlonAccount)(cfg, accountId !== null && accountId !== void 0 ? accountId : undefined);
                    if (!account.configured || !account.ship || !account.url || !account.code) {
                        throw new Error("Tlon account not configured");
                    }
                    parsed = (0, targets_js_1.parseTlonTarget)(to);
                    if (!parsed) {
                        throw new Error("Invalid Tlon target. Use ".concat((0, targets_js_1.formatTargetHint)()));
                    }
                    (0, http_api_js_1.ensureUrbitConnectPatched)();
                    return [4 /*yield*/, http_api_js_1.Urbit.authenticate({
                            ship: account.ship.replace(/^~/, ""),
                            url: account.url,
                            code: account.code,
                            verbose: false,
                        })];
                case 1:
                    api = _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 6, 10]);
                    fromShip = (0, targets_js_1.normalizeShip)(account.ship);
                    if (!(parsed.kind === "dm")) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, send_js_1.sendDm)({
                            api: api,
                            fromShip: fromShip,
                            toShip: parsed.ship,
                            text: text,
                        })];
                case 3: return [2 /*return*/, _d.sent()];
                case 4:
                    replyId = (replyToId !== null && replyToId !== void 0 ? replyToId : threadId) ? String(replyToId !== null && replyToId !== void 0 ? replyToId : threadId) : undefined;
                    return [4 /*yield*/, (0, send_js_1.sendGroupMessage)({
                            api: api,
                            fromShip: fromShip,
                            hostShip: parsed.hostShip,
                            channelName: parsed.channelName,
                            text: text,
                            replyToId: replyId,
                        })];
                case 5: return [2 /*return*/, _d.sent()];
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, api.delete()];
                case 7:
                    _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _c = _d.sent();
                    return [3 /*break*/, 9];
                case 9: return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); },
    sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var mergedText;
        var cfg = _b.cfg, to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, replyToId = _b.replyToId, threadId = _b.threadId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mergedText = (0, send_js_1.buildMediaText)(text, mediaUrl);
                    return [4 /*yield*/, tlonOutbound.sendText({
                            cfg: cfg,
                            to: to,
                            text: mergedText,
                            accountId: accountId,
                            replyToId: replyToId,
                            threadId: threadId,
                        })];
                case 1: return [2 /*return*/, _c.sent()];
            }
        });
    }); },
};
exports.tlonPlugin = {
    id: TLON_CHANNEL_ID,
    meta: {
        id: TLON_CHANNEL_ID,
        label: "Tlon",
        selectionLabel: "Tlon (Urbit)",
        docsPath: "/channels/tlon",
        docsLabel: "tlon",
        blurb: "Decentralized messaging on Urbit",
        aliases: ["urbit"],
        order: 90,
    },
    capabilities: {
        chatTypes: ["direct", "group", "thread"],
        media: false,
        reply: true,
        threads: true,
    },
    onboarding: onboarding_js_1.tlonOnboardingAdapter,
    reload: { configPrefixes: ["channels.tlon"] },
    configSchema: config_schema_js_1.tlonChannelConfigSchema,
    config: {
        listAccountIds: function (cfg) { return (0, types_js_1.listTlonAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, types_js_1.resolveTlonAccount)(cfg, accountId !== null && accountId !== void 0 ? accountId : undefined); },
        defaultAccountId: function () { return "default"; },
        setAccountEnabled: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            var useDefault = !accountId || accountId === "default";
            if (useDefault) {
                return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { tlon: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.tlon), { enabled: enabled }) }) });
            }
            return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { tlon: __assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.tlon), { accounts: __assign(__assign({}, (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.tlon) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign({}, (_j = (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.tlon) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: enabled }), _b)) }) }) });
        },
        deleteAccount: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId;
            var useDefault = !accountId || accountId === "default";
            if (useDefault) {
                // @ts-expect-error
                // oxlint-disable-next-line no-unused-vars
                var _h = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.tlon) !== null && _c !== void 0 ? _c : {}, ship = _h.ship, code = _h.code, url = _h.url, name_1 = _h.name, rest = __rest(_h, ["ship", "code", "url", "name"]);
                return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { tlon: rest }) });
            }
            // @ts-expect-error
            // oxlint-disable-next-line no-unused-vars
            var _j = (_f = (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.tlon) === null || _e === void 0 ? void 0 : _e.accounts) !== null && _f !== void 0 ? _f : {}, _k = accountId, removed = _j[_k], remainingAccounts = __rest(_j, [typeof _k === "symbol" ? _k : _k + ""]);
            return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { tlon: __assign(__assign({}, (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.tlon), { accounts: remainingAccounts }) }) });
        },
        isConfigured: function (account) { return account.configured; },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: account.configured,
            ship: account.ship,
            url: account.url,
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
                channelKey: "tlon",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var setupInput = input;
            var resolved = (0, types_js_1.resolveTlonAccount)(cfg, accountId !== null && accountId !== void 0 ? accountId : undefined);
            var ship = ((_b = setupInput.ship) === null || _b === void 0 ? void 0 : _b.trim()) || resolved.ship;
            var url = ((_c = setupInput.url) === null || _c === void 0 ? void 0 : _c.trim()) || resolved.url;
            var code = ((_d = setupInput.code) === null || _d === void 0 ? void 0 : _d.trim()) || resolved.code;
            if (!ship) {
                return "Tlon requires --ship.";
            }
            if (!url) {
                return "Tlon requires --url.";
            }
            if (!code) {
                return "Tlon requires --code.";
            }
            return null;
        },
        applyAccountConfig: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            return applyTlonSetupConfig({
                cfg: cfg,
                accountId: accountId,
                input: input,
            });
        },
    },
    messaging: {
        normalizeTarget: function (target) {
            var parsed = (0, targets_js_1.parseTlonTarget)(target);
            if (!parsed) {
                return target.trim();
            }
            if (parsed.kind === "dm") {
                return parsed.ship;
            }
            return parsed.nest;
        },
        targetResolver: {
            looksLikeId: function (target) { return Boolean((0, targets_js_1.parseTlonTarget)(target)); },
            hint: (0, targets_js_1.formatTargetHint)(),
        },
    },
    outbound: tlonOutbound,
    status: {
        defaultRuntime: {
            accountId: "default",
            running: false,
            lastStartAt: null,
            lastStopAt: null,
            lastError: null,
        },
        collectStatusIssues: function (accounts) {
            return accounts.flatMap(function (account) {
                if (!account.configured) {
                    return [
                        {
                            channel: TLON_CHANNEL_ID,
                            accountId: account.accountId,
                            kind: "config",
                            message: "Account not configured (missing ship, code, or url)",
                        },
                    ];
                }
                return [];
            });
        },
        buildChannelSummary: function (_a) {
            var _b, _c, _d;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                ship: (_c = snapshot.ship) !== null && _c !== void 0 ? _c : null,
                url: (_d = snapshot.url) !== null && _d !== void 0 ? _d : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var api, error_1;
            var _c;
            var account = _b.account;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!account.configured || !account.ship || !account.url || !account.code) {
                            return [2 /*return*/, { ok: false, error: "Not configured" }];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, , 9]);
                        (0, http_api_js_1.ensureUrbitConnectPatched)();
                        return [4 /*yield*/, http_api_js_1.Urbit.authenticate({
                                ship: account.ship.replace(/^~/, ""),
                                url: account.url,
                                code: account.code,
                                verbose: false,
                            })];
                    case 2:
                        api = _d.sent();
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, , 5, 7]);
                        return [4 /*yield*/, api.getOurName()];
                    case 4:
                        _d.sent();
                        return [2 /*return*/, { ok: true }];
                    case 5: return [4 /*yield*/, api.delete()];
                    case 6:
                        _d.sent();
                        return [7 /*endfinally*/];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _d.sent();
                        return [2 /*return*/, { ok: false, error: (_c = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) !== null && _c !== void 0 ? _c : String(error_1) }];
                    case 9: return [2 /*return*/];
                }
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            return ({
                accountId: account.accountId,
                name: account.name,
                enabled: account.enabled,
                configured: account.configured,
                ship: account.ship,
                url: account.url,
                running: (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false,
                lastStartAt: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _c !== void 0 ? _c : null,
                lastStopAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _d !== void 0 ? _d : null,
                lastError: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _e !== void 0 ? _e : null,
                probe: probe,
            });
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account;
            var _a, _b;
            return __generator(this, function (_c) {
                account = ctx.account;
                ctx.setStatus({
                    accountId: account.accountId,
                    ship: account.ship,
                    url: account.url,
                });
                (_a = ctx.log) === null || _a === void 0 ? void 0 : _a.info("[".concat(account.accountId, "] starting Tlon provider for ").concat((_b = account.ship) !== null && _b !== void 0 ? _b : "tlon"));
                return [2 /*return*/, (0, index_js_1.monitorTlonProvider)({
                        runtime: ctx.runtime,
                        abortSignal: ctx.abortSignal,
                        accountId: account.accountId,
                    })];
            });
        }); },
    },
};
