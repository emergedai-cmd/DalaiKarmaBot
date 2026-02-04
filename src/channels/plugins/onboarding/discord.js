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
exports.discordOnboardingAdapter = void 0;
var accounts_js_1 = require("../../../discord/accounts.js");
var allow_list_js_1 = require("../../../discord/monitor/allow-list.js");
var resolve_channels_js_1 = require("../../../discord/resolve-channels.js");
var resolve_users_js_1 = require("../../../discord/resolve-users.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var links_js_1 = require("../../../terminal/links.js");
var channel_access_js_1 = require("./channel-access.js");
var helpers_js_1 = require("./helpers.js");
var channel = "discord";
function setDiscordDmPolicy(cfg, dmPolicy) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var allowFrom = dmPolicy === "open" ? (0, helpers_js_1.addWildcardAllowFrom)((_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.discord) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.allowFrom) : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { discord: __assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.discord), { dm: __assign(__assign(__assign({}, (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.discord) === null || _f === void 0 ? void 0 : _f.dm), { enabled: (_k = (_j = (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.discord) === null || _h === void 0 ? void 0 : _h.dm) === null || _j === void 0 ? void 0 : _j.enabled) !== null && _k !== void 0 ? _k : true, policy: dmPolicy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) }) });
}
function noteDiscordTokenHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "1) Discord Developer Portal → Applications → New Application",
                        "2) Bot → Add Bot → Reset Token → copy token",
                        "3) OAuth2 → URL Generator → scope 'bot' → invite to your server",
                        "Tip: enable Message Content Intent if you need message text. (Bot → Privileged Gateway Intents → Message Content Intent)",
                        "Docs: ".concat((0, links_js_1.formatDocsLink)("/discord", "discord")),
                    ].join("\n"), "Discord bot token")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setDiscordGroupPolicy(cfg, accountId, groupPolicy) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { discord: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.discord), { enabled: true, groupPolicy: groupPolicy }) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { discord: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.discord), { enabled: true, accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.discord) === null || _e === void 0 ? void 0 : _e.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.discord) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { enabled: (_o = (_m = (_l = (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.discord) === null || _k === void 0 ? void 0 : _k.accounts) === null || _l === void 0 ? void 0 : _l[accountId]) === null || _m === void 0 ? void 0 : _m.enabled) !== null && _o !== void 0 ? _o : true, groupPolicy: groupPolicy }), _a)) }) }) });
}
function setDiscordGuildChannelAllowlist(cfg, accountId, entries) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    var baseGuilds = accountId === session_key_js_1.DEFAULT_ACCOUNT_ID
        ? ((_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.discord) === null || _c === void 0 ? void 0 : _c.guilds) !== null && _d !== void 0 ? _d : {})
        : ((_j = (_h = (_g = (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.discord) === null || _f === void 0 ? void 0 : _f.accounts) === null || _g === void 0 ? void 0 : _g[accountId]) === null || _h === void 0 ? void 0 : _h.guilds) !== null && _j !== void 0 ? _j : {});
    var guilds = __assign({}, baseGuilds);
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var guildKey = entry.guildKey || "*";
        var existing = (_k = guilds[guildKey]) !== null && _k !== void 0 ? _k : {};
        if (entry.channelKey) {
            var channels = __assign({}, existing.channels);
            channels[entry.channelKey] = { allow: true };
            guilds[guildKey] = __assign(__assign({}, existing), { channels: channels });
        }
        else {
            guilds[guildKey] = existing;
        }
    }
    if (accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { discord: __assign(__assign({}, (_l = cfg.channels) === null || _l === void 0 ? void 0 : _l.discord), { enabled: true, guilds: guilds }) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { discord: __assign(__assign({}, (_m = cfg.channels) === null || _m === void 0 ? void 0 : _m.discord), { enabled: true, accounts: __assign(__assign({}, (_p = (_o = cfg.channels) === null || _o === void 0 ? void 0 : _o.discord) === null || _p === void 0 ? void 0 : _p.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_s = (_r = (_q = cfg.channels) === null || _q === void 0 ? void 0 : _q.discord) === null || _r === void 0 ? void 0 : _r.accounts) === null || _s === void 0 ? void 0 : _s[accountId]), { enabled: (_x = (_w = (_v = (_u = (_t = cfg.channels) === null || _t === void 0 ? void 0 : _t.discord) === null || _u === void 0 ? void 0 : _u.accounts) === null || _v === void 0 ? void 0 : _v[accountId]) === null || _w === void 0 ? void 0 : _w.enabled) !== null && _x !== void 0 ? _x : true, guilds: guilds }), _a)) }) }) });
}
function setDiscordAllowFrom(cfg, allowFrom) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { discord: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.discord), { dm: __assign(__assign({}, (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.discord) === null || _c === void 0 ? void 0 : _c.dm), { enabled: (_g = (_f = (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.discord) === null || _e === void 0 ? void 0 : _e.dm) === null || _f === void 0 ? void 0 : _f.enabled) !== null && _g !== void 0 ? _g : true, allowFrom: allowFrom }) }) }) });
}
function parseDiscordAllowFromInput(raw) {
    return raw
        .split(/[\n,;]+/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function promptDiscordAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId, resolved, token, existing, parseInputs, parseId, entry, parts, ids_1, unique_1, results, unresolved, ids, unique;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    accountId = params.accountId && (0, session_key_js_1.normalizeAccountId)(params.accountId)
                        ? ((_a = (0, session_key_js_1.normalizeAccountId)(params.accountId)) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID)
                        : (0, accounts_js_1.resolveDefaultDiscordAccountId)(params.cfg);
                    resolved = (0, accounts_js_1.resolveDiscordAccount)({ cfg: params.cfg, accountId: accountId });
                    token = resolved.token;
                    existing = (_e = (_d = (_c = (_b = params.cfg.channels) === null || _b === void 0 ? void 0 : _b.discord) === null || _c === void 0 ? void 0 : _c.dm) === null || _d === void 0 ? void 0 : _d.allowFrom) !== null && _e !== void 0 ? _e : [];
                    return [4 /*yield*/, params.prompter.note([
                            "Allowlist Discord DMs by username (we resolve to user ids).",
                            "Examples:",
                            "- 123456789012345678",
                            "- @alice",
                            "- alice#1234",
                            "Multiple entries: comma-separated.",
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/discord", "discord")),
                        ].join("\n"), "Discord allowlist")];
                case 1:
                    _f.sent();
                    parseInputs = function (value) { return parseDiscordAllowFromInput(value); };
                    parseId = function (value) {
                        var trimmed = value.trim();
                        if (!trimmed) {
                            return null;
                        }
                        var mention = trimmed.match(/^<@!?(\d+)>$/);
                        if (mention) {
                            return mention[1];
                        }
                        var prefixed = trimmed.replace(/^(user:|discord:)/i, "");
                        if (/^\d+$/.test(prefixed)) {
                            return prefixed;
                        }
                        return null;
                    };
                    _f.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Discord allowFrom (usernames or ids)",
                            placeholder: "@alice, 123456789012345678",
                            initialValue: existing[0] ? String(existing[0]) : undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 3:
                    entry = _f.sent();
                    parts = parseInputs(String(entry));
                    if (!!token) return [3 /*break*/, 6];
                    ids_1 = parts.map(parseId).filter(Boolean);
                    if (!(ids_1.length !== parts.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, params.prompter.note("Bot token missing; use numeric user ids (or mention form) only.", "Discord allowlist")];
                case 4:
                    _f.sent();
                    return [3 /*break*/, 2];
                case 5:
                    unique_1 = __spreadArray([], new Set(__spreadArray(__spreadArray([], existing.map(function (v) { return String(v).trim(); }), true), ids_1, true)), true).filter(Boolean);
                    return [2 /*return*/, setDiscordAllowFrom(params.cfg, unique_1)];
                case 6: return [4 /*yield*/, (0, resolve_users_js_1.resolveDiscordUserAllowlist)({
                        token: token,
                        entries: parts,
                    }).catch(function () { return null; })];
                case 7:
                    results = _f.sent();
                    if (!!results) return [3 /*break*/, 9];
                    return [4 /*yield*/, params.prompter.note("Failed to resolve usernames. Try again.", "Discord allowlist")];
                case 8:
                    _f.sent();
                    return [3 /*break*/, 2];
                case 9:
                    unresolved = results.filter(function (res) { return !res.resolved || !res.id; });
                    if (!(unresolved.length > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, params.prompter.note("Could not resolve: ".concat(unresolved.map(function (res) { return res.input; }).join(", ")), "Discord allowlist")];
                case 10:
                    _f.sent();
                    return [3 /*break*/, 2];
                case 11:
                    ids = results.map(function (res) { return res.id; });
                    unique = __spreadArray([], new Set(__spreadArray(__spreadArray([], existing.map(function (v) { return String(v).trim(); }).filter(Boolean), true), ids, true)), true);
                    return [2 /*return*/, setDiscordAllowFrom(params.cfg, unique)];
                case 12: return [2 /*return*/];
            }
        });
    });
}
var dmPolicy = {
    label: "Discord",
    channel: channel,
    policyKey: "channels.discord.dm.policy",
    allowFromKey: "channels.discord.dm.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.discord) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.policy) !== null && _d !== void 0 ? _d : "pairing"; },
    setPolicy: function (cfg, policy) { return setDiscordDmPolicy(cfg, policy); },
    promptAllowFrom: promptDiscordAllowFrom,
};
exports.discordOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            configured = (0, accounts_js_1.listDiscordAccountIds)(cfg).some(function (accountId) {
                return Boolean((0, accounts_js_1.resolveDiscordAccount)({ cfg: cfg, accountId: accountId }).token);
            });
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["Discord: ".concat(configured ? "configured" : "needs token")],
                    selectionHint: configured ? "configured" : "needs token",
                    quickstartScore: configured ? 2 : 1,
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var discordOverride, defaultDiscordAccountId, discordAccountId, next, resolvedAccount, accountConfigured, allowEnv, canUseEnv, hasConfigToken, token, keepEnv, _c, keep, _d, _e, currentEntries, accessConfig, accountWithTokens, resolved, resolvedChannels, resolvedGuilds, unresolved, summary, err_1, allowlistEntries, _i, resolved_1, entry, guildKey, channelKey;
        var _f;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds;
        return __generator(this, function (_2) {
            switch (_2.label) {
                case 0:
                    discordOverride = (_g = accountOverrides.discord) === null || _g === void 0 ? void 0 : _g.trim();
                    defaultDiscordAccountId = (0, accounts_js_1.resolveDefaultDiscordAccountId)(cfg);
                    discordAccountId = discordOverride
                        ? (0, session_key_js_1.normalizeAccountId)(discordOverride)
                        : defaultDiscordAccountId;
                    if (!(shouldPromptAccountIds && !discordOverride)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, helpers_js_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Discord",
                            currentId: discordAccountId,
                            listAccountIds: accounts_js_1.listDiscordAccountIds,
                            defaultAccountId: defaultDiscordAccountId,
                        })];
                case 1:
                    discordAccountId = _2.sent();
                    _2.label = 2;
                case 2:
                    next = cfg;
                    resolvedAccount = (0, accounts_js_1.resolveDiscordAccount)({
                        cfg: next,
                        accountId: discordAccountId,
                    });
                    accountConfigured = Boolean(resolvedAccount.token);
                    allowEnv = discordAccountId === session_key_js_1.DEFAULT_ACCOUNT_ID;
                    canUseEnv = allowEnv && Boolean((_h = process.env.DISCORD_BOT_TOKEN) === null || _h === void 0 ? void 0 : _h.trim());
                    hasConfigToken = Boolean(resolvedAccount.config.token);
                    token = null;
                    if (!!accountConfigured) return [3 /*break*/, 4];
                    return [4 /*yield*/, noteDiscordTokenHelp(prompter)];
                case 3:
                    _2.sent();
                    _2.label = 4;
                case 4:
                    if (!(canUseEnv && !resolvedAccount.config.token)) return [3 /*break*/, 9];
                    return [4 /*yield*/, prompter.confirm({
                            message: "DISCORD_BOT_TOKEN detected. Use env var?",
                            initialValue: true,
                        })];
                case 5:
                    keepEnv = _2.sent();
                    if (!keepEnv) return [3 /*break*/, 6];
                    next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { discord: __assign(__assign({}, (_j = next.channels) === null || _j === void 0 ? void 0 : _j.discord), { enabled: true }) }) });
                    return [3 /*break*/, 8];
                case 6:
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Discord bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 7:
                    token = _c.apply(void 0, [_2.sent()]).trim();
                    _2.label = 8;
                case 8: return [3 /*break*/, 15];
                case 9:
                    if (!hasConfigToken) return [3 /*break*/, 13];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Discord token already configured. Keep it?",
                            initialValue: true,
                        })];
                case 10:
                    keep = _2.sent();
                    if (!!keep) return [3 /*break*/, 12];
                    _d = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Discord bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 11:
                    token = _d.apply(void 0, [_2.sent()]).trim();
                    _2.label = 12;
                case 12: return [3 /*break*/, 15];
                case 13:
                    _e = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Discord bot token",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 14:
                    token = _e.apply(void 0, [_2.sent()]).trim();
                    _2.label = 15;
                case 15:
                    if (token) {
                        if (discordAccountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { discord: __assign(__assign({}, (_k = next.channels) === null || _k === void 0 ? void 0 : _k.discord), { enabled: true, token: token }) }) });
                        }
                        else {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { discord: __assign(__assign({}, (_l = next.channels) === null || _l === void 0 ? void 0 : _l.discord), { enabled: true, accounts: __assign(__assign({}, (_o = (_m = next.channels) === null || _m === void 0 ? void 0 : _m.discord) === null || _o === void 0 ? void 0 : _o.accounts), (_f = {}, _f[discordAccountId] = __assign(__assign({}, (_r = (_q = (_p = next.channels) === null || _p === void 0 ? void 0 : _p.discord) === null || _q === void 0 ? void 0 : _q.accounts) === null || _r === void 0 ? void 0 : _r[discordAccountId]), { enabled: (_w = (_v = (_u = (_t = (_s = next.channels) === null || _s === void 0 ? void 0 : _s.discord) === null || _t === void 0 ? void 0 : _t.accounts) === null || _u === void 0 ? void 0 : _u[discordAccountId]) === null || _v === void 0 ? void 0 : _v.enabled) !== null && _w !== void 0 ? _w : true, token: token }), _f)) }) }) });
                        }
                    }
                    currentEntries = Object.entries((_x = resolvedAccount.config.guilds) !== null && _x !== void 0 ? _x : {}).flatMap(function (_a) {
                        var _b;
                        var guildKey = _a[0], value = _a[1];
                        var channels = (_b = value === null || value === void 0 ? void 0 : value.channels) !== null && _b !== void 0 ? _b : {};
                        var channelKeys = Object.keys(channels);
                        if (channelKeys.length === 0) {
                            return [guildKey];
                        }
                        return channelKeys.map(function (channelKey) { return "".concat(guildKey, "/").concat(channelKey); });
                    });
                    return [4 /*yield*/, (0, channel_access_js_1.promptChannelAccessConfig)({
                            prompter: prompter,
                            label: "Discord channels",
                            currentPolicy: (_y = resolvedAccount.config.groupPolicy) !== null && _y !== void 0 ? _y : "allowlist",
                            currentEntries: currentEntries,
                            placeholder: "My Server/#general, guildId/channelId, #support",
                            updatePrompt: Boolean(resolvedAccount.config.guilds),
                        })];
                case 16:
                    accessConfig = _2.sent();
                    if (!accessConfig) return [3 /*break*/, 25];
                    if (!(accessConfig.policy !== "allowlist")) return [3 /*break*/, 17];
                    next = setDiscordGroupPolicy(next, discordAccountId, accessConfig.policy);
                    return [3 /*break*/, 25];
                case 17:
                    accountWithTokens = (0, accounts_js_1.resolveDiscordAccount)({
                        cfg: next,
                        accountId: discordAccountId,
                    });
                    resolved = accessConfig.entries.map(function (input) { return ({
                        input: input,
                        resolved: false,
                    }); });
                    if (!(accountWithTokens.token && accessConfig.entries.length > 0)) return [3 /*break*/, 24];
                    _2.label = 18;
                case 18:
                    _2.trys.push([18, 22, , 24]);
                    return [4 /*yield*/, (0, resolve_channels_js_1.resolveDiscordChannelAllowlist)({
                            token: accountWithTokens.token,
                            entries: accessConfig.entries,
                        })];
                case 19:
                    resolved = _2.sent();
                    resolvedChannels = resolved.filter(function (entry) { return entry.resolved && entry.channelId; });
                    resolvedGuilds = resolved.filter(function (entry) { return entry.resolved && entry.guildId && !entry.channelId; });
                    unresolved = resolved
                        .filter(function (entry) { return !entry.resolved; })
                        .map(function (entry) { return entry.input; });
                    if (!(resolvedChannels.length > 0 || resolvedGuilds.length > 0 || unresolved.length > 0)) return [3 /*break*/, 21];
                    summary = [];
                    if (resolvedChannels.length > 0) {
                        summary.push("Resolved channels: ".concat(resolvedChannels
                            .map(function (entry) { return entry.channelId; })
                            .filter(Boolean)
                            .join(", ")));
                    }
                    if (resolvedGuilds.length > 0) {
                        summary.push("Resolved guilds: ".concat(resolvedGuilds
                            .map(function (entry) { return entry.guildId; })
                            .filter(Boolean)
                            .join(", ")));
                    }
                    if (unresolved.length > 0) {
                        summary.push("Unresolved (kept as typed): ".concat(unresolved.join(", ")));
                    }
                    return [4 /*yield*/, prompter.note(summary.join("\n"), "Discord channels")];
                case 20:
                    _2.sent();
                    _2.label = 21;
                case 21: return [3 /*break*/, 24];
                case 22:
                    err_1 = _2.sent();
                    return [4 /*yield*/, prompter.note("Channel lookup failed; keeping entries as typed. ".concat(String(err_1)), "Discord channels")];
                case 23:
                    _2.sent();
                    return [3 /*break*/, 24];
                case 24:
                    allowlistEntries = [];
                    for (_i = 0, resolved_1 = resolved; _i < resolved_1.length; _i++) {
                        entry = resolved_1[_i];
                        guildKey = (_0 = (_z = entry.guildId) !== null && _z !== void 0 ? _z : (entry.guildName ? (0, allow_list_js_1.normalizeDiscordSlug)(entry.guildName) : undefined)) !== null && _0 !== void 0 ? _0 : "*";
                        channelKey = (_1 = entry.channelId) !== null && _1 !== void 0 ? _1 : (entry.channelName ? (0, allow_list_js_1.normalizeDiscordSlug)(entry.channelName) : undefined);
                        if (!channelKey && guildKey === "*") {
                            continue;
                        }
                        allowlistEntries.push(__assign({ guildKey: guildKey }, (channelKey ? { channelKey: channelKey } : {})));
                    }
                    next = setDiscordGroupPolicy(next, discordAccountId, "allowlist");
                    next = setDiscordGuildChannelAllowlist(next, discordAccountId, allowlistEntries);
                    _2.label = 25;
                case 25: return [2 /*return*/, { cfg: next, accountId: discordAccountId }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { discord: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.discord), { enabled: false }) }) }));
    },
};
