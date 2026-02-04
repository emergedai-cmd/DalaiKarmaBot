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
exports.mattermostOnboardingAdapter = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./mattermost/accounts.js");
var onboarding_helpers_js_1 = require("./onboarding-helpers.js");
var channel = "mattermost";
function noteMattermostSetup(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "1) Mattermost System Console -> Integrations -> Bot Accounts",
                        "2) Create a bot + copy its token",
                        "3) Use your server base URL (e.g., https://chat.example.com)",
                        "Tip: the bot must be a member of any channel you want it to monitor.",
                        "Docs: https://docs.openclaw.ai/channels/mattermost",
                    ].join("\n"), "Mattermost bot token")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.mattermostOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            configured = (0, accounts_js_1.listMattermostAccountIds)(cfg).some(function (accountId) {
                var account = (0, accounts_js_1.resolveMattermostAccount)({ cfg: cfg, accountId: accountId });
                return Boolean(account.botToken && account.baseUrl);
            });
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["Mattermost: ".concat(configured ? "configured" : "needs token + url")],
                    selectionHint: configured ? "configured" : "needs setup",
                    quickstartScore: configured ? 2 : 1,
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var override, defaultAccountId, accountId, next, resolvedAccount, accountConfigured, allowEnv, canUseEnv, hasConfigValues, botToken, baseUrl, keepEnv, _c, _d, keep, _e, _f, _g, _h;
        var _j;
        var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds;
        return __generator(this, function (_1) {
            switch (_1.label) {
                case 0:
                    override = (_k = accountOverrides.mattermost) === null || _k === void 0 ? void 0 : _k.trim();
                    defaultAccountId = (0, accounts_js_1.resolveDefaultMattermostAccountId)(cfg);
                    accountId = override ? (0, plugin_sdk_1.normalizeAccountId)(override) : defaultAccountId;
                    if (!(shouldPromptAccountIds && !override)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, onboarding_helpers_js_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Mattermost",
                            currentId: accountId,
                            listAccountIds: accounts_js_1.listMattermostAccountIds,
                            defaultAccountId: defaultAccountId,
                        })];
                case 1:
                    accountId = _1.sent();
                    _1.label = 2;
                case 2:
                    next = cfg;
                    resolvedAccount = (0, accounts_js_1.resolveMattermostAccount)({
                        cfg: next,
                        accountId: accountId,
                    });
                    accountConfigured = Boolean(resolvedAccount.botToken && resolvedAccount.baseUrl);
                    allowEnv = accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID;
                    canUseEnv = allowEnv &&
                        Boolean((_l = process.env.MATTERMOST_BOT_TOKEN) === null || _l === void 0 ? void 0 : _l.trim()) &&
                        Boolean((_m = process.env.MATTERMOST_URL) === null || _m === void 0 ? void 0 : _m.trim());
                    hasConfigValues = Boolean(resolvedAccount.config.botToken) || Boolean(resolvedAccount.config.baseUrl);
                    botToken = null;
                    baseUrl = null;
                    if (!!accountConfigured) return [3 /*break*/, 4];
                    return [4 /*yield*/, noteMattermostSetup(prompter)];
                case 3:
                    _1.sent();
                    _1.label = 4;
                case 4:
                    if (!(canUseEnv && !hasConfigValues)) return [3 /*break*/, 10];
                    return [4 /*yield*/, prompter.confirm({
                            message: "MATTERMOST_BOT_TOKEN + MATTERMOST_URL detected. Use env vars?",
                            initialValue: true,
                        })];
                case 5:
                    keepEnv = _1.sent();
                    if (!keepEnv) return [3 /*break*/, 6];
                    next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { mattermost: __assign(__assign({}, (_o = next.channels) === null || _o === void 0 ? void 0 : _o.mattermost), { enabled: true }) }) });
                    return [3 /*break*/, 9];
                case 6:
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Mattermost bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 7:
                    botToken = _c.apply(void 0, [_1.sent()]).trim();
                    _d = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Mattermost base URL",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 8:
                    baseUrl = _d.apply(void 0, [_1.sent()]).trim();
                    _1.label = 9;
                case 9: return [3 /*break*/, 18];
                case 10:
                    if (!accountConfigured) return [3 /*break*/, 15];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Mattermost credentials already configured. Keep them?",
                            initialValue: true,
                        })];
                case 11:
                    keep = _1.sent();
                    if (!!keep) return [3 /*break*/, 14];
                    _e = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Mattermost bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 12:
                    botToken = _e.apply(void 0, [_1.sent()]).trim();
                    _f = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Mattermost base URL",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 13:
                    baseUrl = _f.apply(void 0, [_1.sent()]).trim();
                    _1.label = 14;
                case 14: return [3 /*break*/, 18];
                case 15:
                    _g = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Mattermost bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 16:
                    botToken = _g.apply(void 0, [_1.sent()]).trim();
                    _h = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Mattermost base URL",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 17:
                    baseUrl = _h.apply(void 0, [_1.sent()]).trim();
                    _1.label = 18;
                case 18:
                    if (botToken || baseUrl) {
                        if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { mattermost: __assign(__assign(__assign(__assign({}, (_p = next.channels) === null || _p === void 0 ? void 0 : _p.mattermost), { enabled: true }), (botToken ? { botToken: botToken } : {})), (baseUrl ? { baseUrl: baseUrl } : {})) }) });
                        }
                        else {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { mattermost: __assign(__assign({}, (_q = next.channels) === null || _q === void 0 ? void 0 : _q.mattermost), { enabled: true, accounts: __assign(__assign({}, (_s = (_r = next.channels) === null || _r === void 0 ? void 0 : _r.mattermost) === null || _s === void 0 ? void 0 : _s.accounts), (_j = {}, _j[accountId] = __assign(__assign(__assign(__assign({}, (_v = (_u = (_t = next.channels) === null || _t === void 0 ? void 0 : _t.mattermost) === null || _u === void 0 ? void 0 : _u.accounts) === null || _v === void 0 ? void 0 : _v[accountId]), { enabled: (_0 = (_z = (_y = (_x = (_w = next.channels) === null || _w === void 0 ? void 0 : _w.mattermost) === null || _x === void 0 ? void 0 : _x.accounts) === null || _y === void 0 ? void 0 : _y[accountId]) === null || _z === void 0 ? void 0 : _z.enabled) !== null && _0 !== void 0 ? _0 : true }), (botToken ? { botToken: botToken } : {})), (baseUrl ? { baseUrl: baseUrl } : {})), _j)) }) }) });
                        }
                    }
                    return [2 /*return*/, { cfg: next, accountId: accountId }];
            }
        });
    }); },
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { mattermost: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.mattermost), { enabled: false }) }) }));
    },
};
