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
exports.nextcloudTalkOnboardingAdapter = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var channel = "nextcloud-talk";
function setNextcloudTalkDmPolicy(cfg, dmPolicy) {
    var _a, _b;
    var existingConfig = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["nextcloud-talk"];
    var existingAllowFrom = ((_b = existingConfig === null || existingConfig === void 0 ? void 0 : existingConfig.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (x) { return String(x); });
    var allowFrom = dmPolicy === "open" ? (0, plugin_sdk_1.addWildcardAllowFrom)(existingAllowFrom) : existingAllowFrom;
    var newNextcloudTalkConfig = __assign(__assign({}, existingConfig), { dmPolicy: dmPolicy, allowFrom: allowFrom });
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { "nextcloud-talk": newNextcloudTalkConfig }) });
}
function noteNextcloudTalkSecretHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "1) SSH into your Nextcloud server",
                        '2) Run: ./occ talk:bot:install "OpenClaw" "<shared-secret>" "<webhook-url>" --feature reaction',
                        "3) Copy the shared secret you used in the command",
                        "4) Enable the bot in your Nextcloud Talk room settings",
                        "Tip: you can also set NEXTCLOUD_TALK_BOT_SECRET in your env.",
                        "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/nextcloud-talk", "channels/nextcloud-talk")),
                    ].join("\n"), "Nextcloud Talk bot setup")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function noteNextcloudTalkUserIdHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "1) Check the Nextcloud admin panel for user IDs",
                        "2) Or look at the webhook payload logs when someone messages",
                        "3) User IDs are typically lowercase usernames in Nextcloud",
                        "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/nextcloud-talk", "channels/nextcloud-talk")),
                    ].join("\n"), "Nextcloud Talk user id")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function promptNextcloudTalkAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, prompter, accountId, resolved, existingAllowFrom, parseInput, resolvedIds, entry, merged, unique;
        var _a;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    cfg = params.cfg, prompter = params.prompter, accountId = params.accountId;
                    resolved = (0, accounts_js_1.resolveNextcloudTalkAccount)({ cfg: cfg, accountId: accountId });
                    existingAllowFrom = (_b = resolved.config.allowFrom) !== null && _b !== void 0 ? _b : [];
                    return [4 /*yield*/, noteNextcloudTalkUserIdHelp(prompter)];
                case 1:
                    _q.sent();
                    parseInput = function (value) {
                        return value
                            .split(/[\n,;]+/g)
                            .map(function (entry) { return entry.trim().toLowerCase(); })
                            .filter(Boolean);
                    };
                    resolvedIds = [];
                    _q.label = 2;
                case 2:
                    if (!(resolvedIds.length === 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, prompter.text({
                            message: "Nextcloud Talk allowFrom (user id)",
                            placeholder: "username",
                            initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 3:
                    entry = _q.sent();
                    resolvedIds = parseInput(String(entry));
                    if (!(resolvedIds.length === 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, prompter.note("Please enter at least one valid user ID.", "Nextcloud Talk allowlist")];
                case 4:
                    _q.sent();
                    _q.label = 5;
                case 5: return [3 /*break*/, 2];
                case 6:
                    merged = __spreadArray(__spreadArray([], existingAllowFrom.map(function (item) { return String(item).trim().toLowerCase(); }).filter(Boolean), true), resolvedIds, true);
                    unique = __spreadArray([], new Set(merged), true);
                    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                        return [2 /*return*/, __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { "nextcloud-talk": __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c["nextcloud-talk"]), { enabled: true, dmPolicy: "allowlist", allowFrom: unique }) }) })];
                    }
                    return [2 /*return*/, __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { "nextcloud-talk": __assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d["nextcloud-talk"]), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e["nextcloud-talk"]) === null || _f === void 0 ? void 0 : _f.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_j = (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g["nextcloud-talk"]) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: (_p = (_o = (_m = (_l = (_k = cfg.channels) === null || _k === void 0 ? void 0 : _k["nextcloud-talk"]) === null || _l === void 0 ? void 0 : _l.accounts) === null || _m === void 0 ? void 0 : _m[accountId]) === null || _o === void 0 ? void 0 : _o.enabled) !== null && _p !== void 0 ? _p : true, dmPolicy: "allowlist", allowFrom: unique }), _a)) }) }) })];
            }
        });
    });
}
function promptNextcloudTalkAllowFromForAccount(params) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId;
        var _a;
        return __generator(this, function (_b) {
            accountId = params.accountId && (0, plugin_sdk_1.normalizeAccountId)(params.accountId)
                ? ((_a = (0, plugin_sdk_1.normalizeAccountId)(params.accountId)) !== null && _a !== void 0 ? _a : plugin_sdk_1.DEFAULT_ACCOUNT_ID)
                : (0, accounts_js_1.resolveDefaultNextcloudTalkAccountId)(params.cfg);
            return [2 /*return*/, promptNextcloudTalkAllowFrom({
                    cfg: params.cfg,
                    prompter: params.prompter,
                    accountId: accountId,
                })];
        });
    });
}
var dmPolicy = {
    label: "Nextcloud Talk",
    channel: channel,
    policyKey: "channels.nextcloud-talk.dmPolicy",
    allowFromKey: "channels.nextcloud-talk.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c; return (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["nextcloud-talk"]) === null || _b === void 0 ? void 0 : _b.dmPolicy) !== null && _c !== void 0 ? _c : "pairing"; },
    setPolicy: function (cfg, policy) { return setNextcloudTalkDmPolicy(cfg, policy); },
    promptAllowFrom: promptNextcloudTalkAllowFromForAccount,
};
exports.nextcloudTalkOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            configured = (0, accounts_js_1.listNextcloudTalkAccountIds)(cfg).some(function (accountId) {
                var account = (0, accounts_js_1.resolveNextcloudTalkAccount)({ cfg: cfg, accountId: accountId });
                return Boolean(account.secret && account.baseUrl);
            });
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["Nextcloud Talk: ".concat(configured ? "configured" : "needs setup")],
                    selectionHint: configured ? "configured" : "self-hosted chat",
                    quickstartScore: configured ? 1 : 5,
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var nextcloudTalkOverride, defaultAccountId, accountId, next, resolvedAccount, accountConfigured, allowEnv, canUseEnv, hasConfigSecret, baseUrl, _c, secret, keepEnv, _d, keep, _e, _f;
        var _g;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds, forceAllowFrom = _b.forceAllowFrom;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    nextcloudTalkOverride = (_h = accountOverrides["nextcloud-talk"]) === null || _h === void 0 ? void 0 : _h.trim();
                    defaultAccountId = (0, accounts_js_1.resolveDefaultNextcloudTalkAccountId)(cfg);
                    accountId = nextcloudTalkOverride
                        ? (0, plugin_sdk_1.normalizeAccountId)(nextcloudTalkOverride)
                        : defaultAccountId;
                    if (!(shouldPromptAccountIds && !nextcloudTalkOverride)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, plugin_sdk_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Nextcloud Talk",
                            currentId: accountId,
                            listAccountIds: accounts_js_1.listNextcloudTalkAccountIds,
                            defaultAccountId: defaultAccountId,
                        })];
                case 1:
                    accountId = _y.sent();
                    _y.label = 2;
                case 2:
                    next = cfg;
                    resolvedAccount = (0, accounts_js_1.resolveNextcloudTalkAccount)({
                        cfg: next,
                        accountId: accountId,
                    });
                    accountConfigured = Boolean(resolvedAccount.secret && resolvedAccount.baseUrl);
                    allowEnv = accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID;
                    canUseEnv = allowEnv && Boolean((_j = process.env.NEXTCLOUD_TALK_BOT_SECRET) === null || _j === void 0 ? void 0 : _j.trim());
                    hasConfigSecret = Boolean(resolvedAccount.config.botSecret || resolvedAccount.config.botSecretFile);
                    baseUrl = resolvedAccount.baseUrl;
                    if (!!baseUrl) return [3 /*break*/, 4];
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Nextcloud instance URL (e.g., https://cloud.example.com)",
                            validate: function (value) {
                                var v = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!v) {
                                    return "Required";
                                }
                                if (!v.startsWith("http://") && !v.startsWith("https://")) {
                                    return "URL must start with http:// or https://";
                                }
                                return undefined;
                            },
                        })];
                case 3:
                    baseUrl = _c.apply(void 0, [_y.sent()]).trim();
                    _y.label = 4;
                case 4:
                    secret = null;
                    if (!!accountConfigured) return [3 /*break*/, 6];
                    return [4 /*yield*/, noteNextcloudTalkSecretHelp(prompter)];
                case 5:
                    _y.sent();
                    _y.label = 6;
                case 6:
                    if (!(canUseEnv && !resolvedAccount.config.botSecret)) return [3 /*break*/, 11];
                    return [4 /*yield*/, prompter.confirm({
                            message: "NEXTCLOUD_TALK_BOT_SECRET detected. Use env var?",
                            initialValue: true,
                        })];
                case 7:
                    keepEnv = _y.sent();
                    if (!keepEnv) return [3 /*break*/, 8];
                    next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { "nextcloud-talk": __assign(__assign({}, (_k = next.channels) === null || _k === void 0 ? void 0 : _k["nextcloud-talk"]), { enabled: true, baseUrl: baseUrl }) }) });
                    return [3 /*break*/, 10];
                case 8:
                    _d = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Nextcloud Talk bot secret",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 9:
                    secret = _d.apply(void 0, [_y.sent()]).trim();
                    _y.label = 10;
                case 10: return [3 /*break*/, 17];
                case 11:
                    if (!hasConfigSecret) return [3 /*break*/, 15];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Nextcloud Talk secret already configured. Keep it?",
                            initialValue: true,
                        })];
                case 12:
                    keep = _y.sent();
                    if (!!keep) return [3 /*break*/, 14];
                    _e = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Nextcloud Talk bot secret",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 13:
                    secret = _e.apply(void 0, [_y.sent()]).trim();
                    _y.label = 14;
                case 14: return [3 /*break*/, 17];
                case 15:
                    _f = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Nextcloud Talk bot secret",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 16:
                    secret = _f.apply(void 0, [_y.sent()]).trim();
                    _y.label = 17;
                case 17:
                    if (secret || baseUrl !== resolvedAccount.baseUrl) {
                        if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { "nextcloud-talk": __assign(__assign(__assign({}, (_l = next.channels) === null || _l === void 0 ? void 0 : _l["nextcloud-talk"]), { enabled: true, baseUrl: baseUrl }), (secret ? { botSecret: secret } : {})) }) });
                        }
                        else {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { "nextcloud-talk": __assign(__assign({}, (_m = next.channels) === null || _m === void 0 ? void 0 : _m["nextcloud-talk"]), { enabled: true, accounts: __assign(__assign({}, (_p = (_o = next.channels) === null || _o === void 0 ? void 0 : _o["nextcloud-talk"]) === null || _p === void 0 ? void 0 : _p.accounts), (_g = {}, _g[accountId] = __assign(__assign(__assign({}, (_s = (_r = (_q = next.channels) === null || _q === void 0 ? void 0 : _q["nextcloud-talk"]) === null || _r === void 0 ? void 0 : _r.accounts) === null || _s === void 0 ? void 0 : _s[accountId]), { enabled: (_x = (_w = (_v = (_u = (_t = next.channels) === null || _t === void 0 ? void 0 : _t["nextcloud-talk"]) === null || _u === void 0 ? void 0 : _u.accounts) === null || _v === void 0 ? void 0 : _v[accountId]) === null || _w === void 0 ? void 0 : _w.enabled) !== null && _x !== void 0 ? _x : true, baseUrl: baseUrl }), (secret ? { botSecret: secret } : {})), _g)) }) }) });
                        }
                    }
                    if (!forceAllowFrom) return [3 /*break*/, 19];
                    return [4 /*yield*/, promptNextcloudTalkAllowFrom({
                            cfg: next,
                            prompter: prompter,
                            accountId: accountId,
                        })];
                case 18:
                    next = _y.sent();
                    _y.label = 19;
                case 19: return [2 /*return*/, { cfg: next, accountId: accountId }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { "nextcloud-talk": __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["nextcloud-talk"]), { enabled: false }) }) }));
    },
};
