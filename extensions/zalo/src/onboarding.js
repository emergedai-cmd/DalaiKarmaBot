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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zaloOnboardingAdapter = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var channel = "zalo";
function setZaloDmPolicy(cfg, dmPolicy) {
    var _a, _b, _c;
    var allowFrom = dmPolicy === "open" ? (0, plugin_sdk_1.addWildcardAllowFrom)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalo) === null || _b === void 0 ? void 0 : _b.allowFrom) : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalo: __assign(__assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.zalo), { dmPolicy: dmPolicy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) });
}
function setZaloUpdateMode(cfg, accountId, mode, webhookUrl, webhookSecret, webhookPath) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var isDefault = accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    if (mode === "polling") {
        if (isDefault) {
            var _l = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalo) !== null && _b !== void 0 ? _b : {}, _url_1 = _l.webhookUrl, _secret_1 = _l.webhookSecret, _path_1 = _l.webhookPath, rest_1 = __rest(_l, ["webhookUrl", "webhookSecret", "webhookPath"]);
            return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalo: rest_1 }) });
        }
        var accounts_1 = __assign({}, (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.zalo) === null || _d === void 0 ? void 0 : _d.accounts);
        var existing = (_e = accounts_1[accountId]) !== null && _e !== void 0 ? _e : {};
        var _url = existing.webhookUrl, _secret = existing.webhookSecret, _path = existing.webhookPath, rest = __rest(existing, ["webhookUrl", "webhookSecret", "webhookPath"]);
        accounts_1[accountId] = rest;
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalo: __assign(__assign({}, (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.zalo), { accounts: accounts_1 }) }) });
    }
    if (isDefault) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalo: __assign(__assign({}, (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.zalo), { webhookUrl: webhookUrl, webhookSecret: webhookSecret, webhookPath: webhookPath }) }) });
    }
    var accounts = __assign({}, (_j = (_h = cfg.channels) === null || _h === void 0 ? void 0 : _h.zalo) === null || _j === void 0 ? void 0 : _j.accounts);
    accounts[accountId] = __assign(__assign({}, accounts[accountId]), { webhookUrl: webhookUrl, webhookSecret: webhookSecret, webhookPath: webhookPath });
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalo: __assign(__assign({}, (_k = cfg.channels) === null || _k === void 0 ? void 0 : _k.zalo), { accounts: accounts }) }) });
}
function noteZaloTokenHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "1) Open Zalo Bot Platform: https://bot.zaloplatforms.com",
                        "2) Create a bot and get the token",
                        "3) Token looks like 12345689:abc-xyz",
                        "Tip: you can also set ZALO_BOT_TOKEN in your env.",
                        "Docs: https://docs.openclaw.ai/channels/zalo",
                    ].join("\n"), "Zalo bot token")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function promptZaloAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, prompter, accountId, resolved, existingAllowFrom, entry, normalized, merged, unique;
        var _a;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    cfg = params.cfg, prompter = params.prompter, accountId = params.accountId;
                    resolved = (0, accounts_js_1.resolveZaloAccount)({ cfg: cfg, accountId: accountId });
                    existingAllowFrom = (_b = resolved.config.allowFrom) !== null && _b !== void 0 ? _b : [];
                    return [4 /*yield*/, prompter.text({
                            message: "Zalo allowFrom (user id)",
                            placeholder: "123456789",
                            initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : undefined,
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!raw) {
                                    return "Required";
                                }
                                if (!/^\d+$/.test(raw)) {
                                    return "Use a numeric Zalo user id";
                                }
                                return undefined;
                            },
                        })];
                case 1:
                    entry = _q.sent();
                    normalized = String(entry).trim();
                    merged = __spreadArray(__spreadArray([], existingAllowFrom.map(function (item) { return String(item).trim(); }).filter(Boolean), true), [
                        normalized,
                    ], false);
                    unique = __spreadArray([], new Set(merged), true);
                    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                        return [2 /*return*/, __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalo: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.zalo), { enabled: true, dmPolicy: "allowlist", allowFrom: unique }) }) })];
                    }
                    return [2 /*return*/, __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalo: __assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.zalo), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.zalo) === null || _f === void 0 ? void 0 : _f.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_j = (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.zalo) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: (_p = (_o = (_m = (_l = (_k = cfg.channels) === null || _k === void 0 ? void 0 : _k.zalo) === null || _l === void 0 ? void 0 : _l.accounts) === null || _m === void 0 ? void 0 : _m[accountId]) === null || _o === void 0 ? void 0 : _o.enabled) !== null && _p !== void 0 ? _p : true, dmPolicy: "allowlist", allowFrom: unique }), _a)) }) }) })];
            }
        });
    });
}
var dmPolicy = {
    label: "Zalo",
    channel: channel,
    policyKey: "channels.zalo.dmPolicy",
    allowFromKey: "channels.zalo.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c; return ((_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalo) === null || _b === void 0 ? void 0 : _b.dmPolicy) !== null && _c !== void 0 ? _c : "pairing"); },
    setPolicy: function (cfg, policy) { return setZaloDmPolicy(cfg, policy); },
    promptAllowFrom: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var id;
        var _c;
        var cfg = _b.cfg, prompter = _b.prompter, accountId = _b.accountId;
        return __generator(this, function (_d) {
            id = accountId && (0, plugin_sdk_1.normalizeAccountId)(accountId)
                ? ((_c = (0, plugin_sdk_1.normalizeAccountId)(accountId)) !== null && _c !== void 0 ? _c : plugin_sdk_1.DEFAULT_ACCOUNT_ID)
                : (0, accounts_js_1.resolveDefaultZaloAccountId)(cfg);
            return [2 /*return*/, promptZaloAllowFrom({
                    cfg: cfg,
                    prompter: prompter,
                    accountId: id,
                })];
        });
    }); },
};
exports.zaloOnboardingAdapter = {
    channel: channel,
    dmPolicy: dmPolicy,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            configured = (0, accounts_js_1.listZaloAccountIds)(cfg).some(function (accountId) {
                return Boolean((0, accounts_js_1.resolveZaloAccount)({ cfg: cfg, accountId: accountId }).token);
            });
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["Zalo: ".concat(configured ? "configured" : "needs token")],
                    selectionHint: configured ? "recommended · configured" : "recommended · newcomer-friendly",
                    quickstartScore: configured ? 1 : 10,
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var zaloOverride, defaultZaloAccountId, zaloAccountId, next, resolvedAccount, accountConfigured, allowEnv, canUseEnv, hasConfigToken, token, keepEnv, _c, keep, _d, _e, wantsWebhook, webhookUrl_1, _f, defaultPath, webhookSecret, _g, webhookPath, _h;
        var _j;
        var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds, forceAllowFrom = _b.forceAllowFrom;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    zaloOverride = (_k = accountOverrides.zalo) === null || _k === void 0 ? void 0 : _k.trim();
                    defaultZaloAccountId = (0, accounts_js_1.resolveDefaultZaloAccountId)(cfg);
                    zaloAccountId = zaloOverride ? (0, plugin_sdk_1.normalizeAccountId)(zaloOverride) : defaultZaloAccountId;
                    if (!(shouldPromptAccountIds && !zaloOverride)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, plugin_sdk_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Zalo",
                            currentId: zaloAccountId,
                            listAccountIds: accounts_js_1.listZaloAccountIds,
                            defaultAccountId: defaultZaloAccountId,
                        })];
                case 1:
                    zaloAccountId = _v.sent();
                    _v.label = 2;
                case 2:
                    next = cfg;
                    resolvedAccount = (0, accounts_js_1.resolveZaloAccount)({ cfg: next, accountId: zaloAccountId });
                    accountConfigured = Boolean(resolvedAccount.token);
                    allowEnv = zaloAccountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID;
                    canUseEnv = allowEnv && Boolean((_l = process.env.ZALO_BOT_TOKEN) === null || _l === void 0 ? void 0 : _l.trim());
                    hasConfigToken = Boolean(resolvedAccount.config.botToken || resolvedAccount.config.tokenFile);
                    token = null;
                    if (!!accountConfigured) return [3 /*break*/, 4];
                    return [4 /*yield*/, noteZaloTokenHelp(prompter)];
                case 3:
                    _v.sent();
                    _v.label = 4;
                case 4:
                    if (!(canUseEnv && !resolvedAccount.config.botToken)) return [3 /*break*/, 9];
                    return [4 /*yield*/, prompter.confirm({
                            message: "ZALO_BOT_TOKEN detected. Use env var?",
                            initialValue: true,
                        })];
                case 5:
                    keepEnv = _v.sent();
                    if (!keepEnv) return [3 /*break*/, 6];
                    next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { zalo: __assign(__assign({}, (_m = next.channels) === null || _m === void 0 ? void 0 : _m.zalo), { enabled: true }) }) });
                    return [3 /*break*/, 8];
                case 6:
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Zalo bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 7:
                    token = _c.apply(void 0, [_v.sent()]).trim();
                    _v.label = 8;
                case 8: return [3 /*break*/, 15];
                case 9:
                    if (!hasConfigToken) return [3 /*break*/, 13];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Zalo token already configured. Keep it?",
                            initialValue: true,
                        })];
                case 10:
                    keep = _v.sent();
                    if (!!keep) return [3 /*break*/, 12];
                    _d = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Zalo bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 11:
                    token = _d.apply(void 0, [_v.sent()]).trim();
                    _v.label = 12;
                case 12: return [3 /*break*/, 15];
                case 13:
                    _e = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Zalo bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 14:
                    token = _e.apply(void 0, [_v.sent()]).trim();
                    _v.label = 15;
                case 15:
                    if (token) {
                        if (zaloAccountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { zalo: __assign(__assign({}, (_o = next.channels) === null || _o === void 0 ? void 0 : _o.zalo), { enabled: true, botToken: token }) }) });
                        }
                        else {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { zalo: __assign(__assign({}, (_p = next.channels) === null || _p === void 0 ? void 0 : _p.zalo), { enabled: true, accounts: __assign(__assign({}, (_r = (_q = next.channels) === null || _q === void 0 ? void 0 : _q.zalo) === null || _r === void 0 ? void 0 : _r.accounts), (_j = {}, _j[zaloAccountId] = __assign(__assign({}, (_u = (_t = (_s = next.channels) === null || _s === void 0 ? void 0 : _s.zalo) === null || _t === void 0 ? void 0 : _t.accounts) === null || _u === void 0 ? void 0 : _u[zaloAccountId]), { enabled: true, botToken: token }), _j)) }) }) });
                        }
                    }
                    return [4 /*yield*/, prompter.confirm({
                            message: "Use webhook mode for Zalo?",
                            initialValue: false,
                        })];
                case 16:
                    wantsWebhook = _v.sent();
                    if (!wantsWebhook) return [3 /*break*/, 20];
                    _f = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Webhook URL (https://...) ",
                            validate: function (value) { var _a; return ((_a = value === null || value === void 0 ? void 0 : value.trim()) === null || _a === void 0 ? void 0 : _a.startsWith("https://")) ? undefined : "HTTPS URL required"; },
                        })];
                case 17:
                    webhookUrl_1 = _f.apply(void 0, [_v.sent()]).trim();
                    defaultPath = (function () {
                        try {
                            return new URL(webhookUrl_1).pathname || "/zalo-webhook";
                        }
                        catch (_a) {
                            return "/zalo-webhook";
                        }
                    })();
                    _g = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Webhook secret (8-256 chars)",
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "");
                                if (raw.length < 8 || raw.length > 256) {
                                    return "8-256 chars";
                                }
                                return undefined;
                            },
                        })];
                case 18:
                    webhookSecret = _g.apply(void 0, [_v.sent()]).trim();
                    _h = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Webhook path (optional)",
                            initialValue: defaultPath,
                        })];
                case 19:
                    webhookPath = _h.apply(void 0, [_v.sent()]).trim();
                    next = setZaloUpdateMode(next, zaloAccountId, "webhook", webhookUrl_1, webhookSecret, webhookPath || undefined);
                    return [3 /*break*/, 21];
                case 20:
                    next = setZaloUpdateMode(next, zaloAccountId, "polling");
                    _v.label = 21;
                case 21:
                    if (!forceAllowFrom) return [3 /*break*/, 23];
                    return [4 /*yield*/, promptZaloAllowFrom({
                            cfg: next,
                            prompter: prompter,
                            accountId: zaloAccountId,
                        })];
                case 22:
                    next = _v.sent();
                    _v.label = 23;
                case 23: return [2 /*return*/, { cfg: next, accountId: zaloAccountId }];
            }
        });
    }); },
};
