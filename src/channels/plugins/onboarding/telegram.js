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
exports.telegramOnboardingAdapter = void 0;
var command_format_js_1 = require("../../../cli/command-format.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var accounts_js_1 = require("../../../telegram/accounts.js");
var links_js_1 = require("../../../terminal/links.js");
var helpers_js_1 = require("./helpers.js");
var channel = "telegram";
function setTelegramDmPolicy(cfg, dmPolicy) {
    var _a, _b, _c;
    var allowFrom = dmPolicy === "open" ? (0, helpers_js_1.addWildcardAllowFrom)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.allowFrom) : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { telegram: __assign(__assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram), { dmPolicy: dmPolicy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) });
}
function noteTelegramTokenHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "1) Open Telegram and chat with @BotFather",
                        "2) Run /newbot (or /mybots)",
                        "3) Copy the token (looks like 123456:ABC...)",
                        "Tip: you can also set TELEGRAM_BOT_TOKEN in your env.",
                        "Docs: ".concat((0, links_js_1.formatDocsLink)("/telegram")),
                        "Website: https://openclaw.ai",
                    ].join("\n"), "Telegram bot token")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function noteTelegramUserIdHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "1) DM your bot, then read from.id in `".concat((0, command_format_js_1.formatCliCommand)("openclaw logs --follow"), "` (safest)"),
                        "2) Or call https://api.telegram.org/bot<bot_token>/getUpdates and read message.from.id",
                        "3) Third-party: DM @userinfobot or @getidsbot",
                        "Docs: ".concat((0, links_js_1.formatDocsLink)("/telegram")),
                        "Website: https://openclaw.ai",
                    ].join("\n"), "Telegram user id")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function promptTelegramAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, prompter, accountId, resolved, existingAllowFrom, token, resolveTelegramUserId, parseInput, resolvedIds, _loop_1, merged, unique;
        var _a;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    cfg = params.cfg, prompter = params.prompter, accountId = params.accountId;
                    resolved = (0, accounts_js_1.resolveTelegramAccount)({ cfg: cfg, accountId: accountId });
                    existingAllowFrom = (_b = resolved.config.allowFrom) !== null && _b !== void 0 ? _b : [];
                    return [4 /*yield*/, noteTelegramUserIdHelp(prompter)];
                case 1:
                    _q.sent();
                    token = resolved.token;
                    if (!!token) return [3 /*break*/, 3];
                    return [4 /*yield*/, prompter.note("Telegram token missing; username lookup is unavailable.", "Telegram")];
                case 2:
                    _q.sent();
                    _q.label = 3;
                case 3:
                    resolveTelegramUserId = function (raw) { return __awaiter(_this, void 0, void 0, function () {
                        var trimmed, stripped, username, url, res, data, id, _a;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    trimmed = raw.trim();
                                    if (!trimmed) {
                                        return [2 /*return*/, null];
                                    }
                                    stripped = trimmed.replace(/^(telegram|tg):/i, "").trim();
                                    if (/^\d+$/.test(stripped)) {
                                        return [2 /*return*/, stripped];
                                    }
                                    if (!token) {
                                        return [2 /*return*/, null];
                                    }
                                    username = stripped.startsWith("@") ? stripped : "@".concat(stripped);
                                    url = "https://api.telegram.org/bot".concat(token, "/getChat?chat_id=").concat(encodeURIComponent(username));
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, fetch(url)];
                                case 2:
                                    res = _c.sent();
                                    if (!res.ok) {
                                        return [2 /*return*/, null];
                                    }
                                    return [4 /*yield*/, res.json().catch(function () { return null; })];
                                case 3:
                                    data = (_c.sent());
                                    id = (data === null || data === void 0 ? void 0 : data.ok) ? (_b = data === null || data === void 0 ? void 0 : data.result) === null || _b === void 0 ? void 0 : _b.id : undefined;
                                    if (typeof id === "number" || typeof id === "string") {
                                        return [2 /*return*/, String(id)];
                                    }
                                    return [2 /*return*/, null];
                                case 4:
                                    _a = _c.sent();
                                    // Network error during username lookup - return null to prompt user for numeric ID
                                    return [2 /*return*/, null];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    parseInput = function (value) {
                        return value
                            .split(/[\n,;]+/g)
                            .map(function (entry) { return entry.trim(); })
                            .filter(Boolean);
                    };
                    resolvedIds = [];
                    _loop_1 = function () {
                        var entry, parts, results, unresolved;
                        return __generator(this, function (_r) {
                            switch (_r.label) {
                                case 0: return [4 /*yield*/, prompter.text({
                                        message: "Telegram allowFrom (username or user id)",
                                        placeholder: "@username",
                                        initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : undefined,
                                        validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                                    })];
                                case 1:
                                    entry = _r.sent();
                                    parts = parseInput(String(entry));
                                    return [4 /*yield*/, Promise.all(parts.map(function (part) { return resolveTelegramUserId(part); }))];
                                case 2:
                                    results = _r.sent();
                                    unresolved = parts.filter(function (_, idx) { return !results[idx]; });
                                    if (!(unresolved.length > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, prompter.note("Could not resolve: ".concat(unresolved.join(", "), ". Use @username or numeric id."), "Telegram allowlist")];
                                case 3:
                                    _r.sent();
                                    return [2 /*return*/, "continue"];
                                case 4:
                                    resolvedIds = results.filter(Boolean);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _q.label = 4;
                case 4:
                    if (!(resolvedIds.length === 0)) return [3 /*break*/, 6];
                    return [5 /*yield**/, _loop_1()];
                case 5:
                    _q.sent();
                    return [3 /*break*/, 4];
                case 6:
                    merged = __spreadArray(__spreadArray([], existingAllowFrom.map(function (item) { return String(item).trim(); }).filter(Boolean), true), resolvedIds, true);
                    unique = __spreadArray([], new Set(merged), true);
                    if (accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
                        return [2 /*return*/, __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { telegram: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.telegram), { enabled: true, dmPolicy: "allowlist", allowFrom: unique }) }) })];
                    }
                    return [2 /*return*/, __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { telegram: __assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.telegram), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.telegram) === null || _f === void 0 ? void 0 : _f.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_j = (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.telegram) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: (_p = (_o = (_m = (_l = (_k = cfg.channels) === null || _k === void 0 ? void 0 : _k.telegram) === null || _l === void 0 ? void 0 : _l.accounts) === null || _m === void 0 ? void 0 : _m[accountId]) === null || _o === void 0 ? void 0 : _o.enabled) !== null && _p !== void 0 ? _p : true, dmPolicy: "allowlist", allowFrom: unique }), _a)) }) }) })];
            }
        });
    });
}
function promptTelegramAllowFromForAccount(params) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId;
        var _a;
        return __generator(this, function (_b) {
            accountId = params.accountId && (0, session_key_js_1.normalizeAccountId)(params.accountId)
                ? ((_a = (0, session_key_js_1.normalizeAccountId)(params.accountId)) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID)
                : (0, accounts_js_1.resolveDefaultTelegramAccountId)(params.cfg);
            return [2 /*return*/, promptTelegramAllowFrom({
                    cfg: params.cfg,
                    prompter: params.prompter,
                    accountId: accountId,
                })];
        });
    });
}
var dmPolicy = {
    label: "Telegram",
    channel: channel,
    policyKey: "channels.telegram.dmPolicy",
    allowFromKey: "channels.telegram.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c; return (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.dmPolicy) !== null && _c !== void 0 ? _c : "pairing"; },
    setPolicy: function (cfg, policy) { return setTelegramDmPolicy(cfg, policy); },
    promptAllowFrom: promptTelegramAllowFromForAccount,
};
exports.telegramOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            configured = (0, accounts_js_1.listTelegramAccountIds)(cfg).some(function (accountId) {
                return Boolean((0, accounts_js_1.resolveTelegramAccount)({ cfg: cfg, accountId: accountId }).token);
            });
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["Telegram: ".concat(configured ? "configured" : "needs token")],
                    selectionHint: configured ? "recommended · configured" : "recommended · newcomer-friendly",
                    quickstartScore: configured ? 1 : 10,
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var telegramOverride, defaultTelegramAccountId, telegramAccountId, next, resolvedAccount, accountConfigured, allowEnv, canUseEnv, hasConfigToken, token, keepEnv, _c, keep, _d, _e;
        var _f;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds, forceAllowFrom = _b.forceAllowFrom;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    telegramOverride = (_g = accountOverrides.telegram) === null || _g === void 0 ? void 0 : _g.trim();
                    defaultTelegramAccountId = (0, accounts_js_1.resolveDefaultTelegramAccountId)(cfg);
                    telegramAccountId = telegramOverride
                        ? (0, session_key_js_1.normalizeAccountId)(telegramOverride)
                        : defaultTelegramAccountId;
                    if (!(shouldPromptAccountIds && !telegramOverride)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, helpers_js_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Telegram",
                            currentId: telegramAccountId,
                            listAccountIds: accounts_js_1.listTelegramAccountIds,
                            defaultAccountId: defaultTelegramAccountId,
                        })];
                case 1:
                    telegramAccountId = _x.sent();
                    _x.label = 2;
                case 2:
                    next = cfg;
                    resolvedAccount = (0, accounts_js_1.resolveTelegramAccount)({
                        cfg: next,
                        accountId: telegramAccountId,
                    });
                    accountConfigured = Boolean(resolvedAccount.token);
                    allowEnv = telegramAccountId === session_key_js_1.DEFAULT_ACCOUNT_ID;
                    canUseEnv = allowEnv && Boolean((_h = process.env.TELEGRAM_BOT_TOKEN) === null || _h === void 0 ? void 0 : _h.trim());
                    hasConfigToken = Boolean(resolvedAccount.config.botToken || resolvedAccount.config.tokenFile);
                    token = null;
                    if (!!accountConfigured) return [3 /*break*/, 4];
                    return [4 /*yield*/, noteTelegramTokenHelp(prompter)];
                case 3:
                    _x.sent();
                    _x.label = 4;
                case 4:
                    if (!(canUseEnv && !resolvedAccount.config.botToken)) return [3 /*break*/, 9];
                    return [4 /*yield*/, prompter.confirm({
                            message: "TELEGRAM_BOT_TOKEN detected. Use env var?",
                            initialValue: true,
                        })];
                case 5:
                    keepEnv = _x.sent();
                    if (!keepEnv) return [3 /*break*/, 6];
                    next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { telegram: __assign(__assign({}, (_j = next.channels) === null || _j === void 0 ? void 0 : _j.telegram), { enabled: true }) }) });
                    return [3 /*break*/, 8];
                case 6:
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Telegram bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 7:
                    token = _c.apply(void 0, [_x.sent()]).trim();
                    _x.label = 8;
                case 8: return [3 /*break*/, 15];
                case 9:
                    if (!hasConfigToken) return [3 /*break*/, 13];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Telegram token already configured. Keep it?",
                            initialValue: true,
                        })];
                case 10:
                    keep = _x.sent();
                    if (!!keep) return [3 /*break*/, 12];
                    _d = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Telegram bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 11:
                    token = _d.apply(void 0, [_x.sent()]).trim();
                    _x.label = 12;
                case 12: return [3 /*break*/, 15];
                case 13:
                    _e = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Telegram bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 14:
                    token = _e.apply(void 0, [_x.sent()]).trim();
                    _x.label = 15;
                case 15:
                    if (token) {
                        if (telegramAccountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { telegram: __assign(__assign({}, (_k = next.channels) === null || _k === void 0 ? void 0 : _k.telegram), { enabled: true, botToken: token }) }) });
                        }
                        else {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { telegram: __assign(__assign({}, (_l = next.channels) === null || _l === void 0 ? void 0 : _l.telegram), { enabled: true, accounts: __assign(__assign({}, (_o = (_m = next.channels) === null || _m === void 0 ? void 0 : _m.telegram) === null || _o === void 0 ? void 0 : _o.accounts), (_f = {}, _f[telegramAccountId] = __assign(__assign({}, (_r = (_q = (_p = next.channels) === null || _p === void 0 ? void 0 : _p.telegram) === null || _q === void 0 ? void 0 : _q.accounts) === null || _r === void 0 ? void 0 : _r[telegramAccountId]), { enabled: (_w = (_v = (_u = (_t = (_s = next.channels) === null || _s === void 0 ? void 0 : _s.telegram) === null || _t === void 0 ? void 0 : _t.accounts) === null || _u === void 0 ? void 0 : _u[telegramAccountId]) === null || _v === void 0 ? void 0 : _v.enabled) !== null && _w !== void 0 ? _w : true, botToken: token }), _f)) }) }) });
                        }
                    }
                    if (!forceAllowFrom) return [3 /*break*/, 17];
                    return [4 /*yield*/, promptTelegramAllowFrom({
                            cfg: next,
                            prompter: prompter,
                            accountId: telegramAccountId,
                        })];
                case 16:
                    next = _x.sent();
                    _x.label = 17;
                case 17: return [2 /*return*/, { cfg: next, accountId: telegramAccountId }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { telegram: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.telegram), { enabled: false }) }) }));
    },
};
