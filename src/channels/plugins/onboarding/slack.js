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
exports.slackOnboardingAdapter = void 0;
var session_key_js_1 = require("../../../routing/session-key.js");
var accounts_js_1 = require("../../../slack/accounts.js");
var resolve_channels_js_1 = require("../../../slack/resolve-channels.js");
var resolve_users_js_1 = require("../../../slack/resolve-users.js");
var links_js_1 = require("../../../terminal/links.js");
var channel_access_js_1 = require("./channel-access.js");
var helpers_js_1 = require("./helpers.js");
var channel = "slack";
function setSlackDmPolicy(cfg, dmPolicy) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var allowFrom = dmPolicy === "open" ? (0, helpers_js_1.addWildcardAllowFrom)((_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.slack) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.allowFrom) : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { slack: __assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.slack), { dm: __assign(__assign(__assign({}, (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.slack) === null || _f === void 0 ? void 0 : _f.dm), { enabled: (_k = (_j = (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.slack) === null || _h === void 0 ? void 0 : _h.dm) === null || _j === void 0 ? void 0 : _j.enabled) !== null && _k !== void 0 ? _k : true, policy: dmPolicy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) }) });
}
function buildSlackManifest(botName) {
    var safeName = botName.trim() || "OpenClaw";
    var manifest = {
        display_information: {
            name: safeName,
            description: "".concat(safeName, " connector for OpenClaw"),
        },
        features: {
            bot_user: {
                display_name: safeName,
                always_online: false,
            },
            app_home: {
                messages_tab_enabled: true,
                messages_tab_read_only_enabled: false,
            },
            slash_commands: [
                {
                    command: "/openclaw",
                    description: "Send a message to OpenClaw",
                    should_escape: false,
                },
            ],
        },
        oauth_config: {
            scopes: {
                bot: [
                    "chat:write",
                    "channels:history",
                    "channels:read",
                    "groups:history",
                    "im:history",
                    "mpim:history",
                    "users:read",
                    "app_mentions:read",
                    "reactions:read",
                    "reactions:write",
                    "pins:read",
                    "pins:write",
                    "emoji:read",
                    "commands",
                    "files:read",
                    "files:write",
                ],
            },
        },
        settings: {
            socket_mode_enabled: true,
            event_subscriptions: {
                bot_events: [
                    "app_mention",
                    "message.channels",
                    "message.groups",
                    "message.im",
                    "message.mpim",
                    "reaction_added",
                    "reaction_removed",
                    "member_joined_channel",
                    "member_left_channel",
                    "channel_rename",
                    "pin_added",
                    "pin_removed",
                ],
            },
        },
    };
    return JSON.stringify(manifest, null, 2);
}
function noteSlackTokenHelp(prompter, botName) {
    return __awaiter(this, void 0, void 0, function () {
        var manifest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manifest = buildSlackManifest(botName);
                    return [4 /*yield*/, prompter.note([
                            "1) Slack API → Create App → From scratch",
                            "2) Add Socket Mode + enable it to get the app-level token (xapp-...)",
                            "3) OAuth & Permissions → install app to workspace (xoxb- bot token)",
                            "4) Enable Event Subscriptions (socket) for message events",
                            "5) App Home → enable the Messages tab for DMs",
                            "Tip: set SLACK_BOT_TOKEN + SLACK_APP_TOKEN in your env.",
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/slack", "slack")),
                            "",
                            "Manifest (JSON):",
                            manifest,
                        ].join("\n"), "Slack socket mode tokens")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setSlackGroupPolicy(cfg, accountId, groupPolicy) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { slack: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.slack), { enabled: true, groupPolicy: groupPolicy }) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { slack: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.slack), { enabled: true, accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.slack) === null || _e === void 0 ? void 0 : _e.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.slack) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { enabled: (_o = (_m = (_l = (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.slack) === null || _k === void 0 ? void 0 : _k.accounts) === null || _l === void 0 ? void 0 : _l[accountId]) === null || _m === void 0 ? void 0 : _m.enabled) !== null && _o !== void 0 ? _o : true, groupPolicy: groupPolicy }), _a)) }) }) });
}
function setSlackChannelAllowlist(cfg, accountId, channelKeys) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var channels = Object.fromEntries(channelKeys.map(function (key) { return [key, { allow: true }]; }));
    if (accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { slack: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.slack), { enabled: true, channels: channels }) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { slack: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.slack), { enabled: true, accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.slack) === null || _e === void 0 ? void 0 : _e.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.slack) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { enabled: (_o = (_m = (_l = (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.slack) === null || _k === void 0 ? void 0 : _k.accounts) === null || _l === void 0 ? void 0 : _l[accountId]) === null || _m === void 0 ? void 0 : _m.enabled) !== null && _o !== void 0 ? _o : true, channels: channels }), _a)) }) }) });
}
function setSlackAllowFrom(cfg, allowFrom) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { slack: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.slack), { dm: __assign(__assign({}, (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.slack) === null || _c === void 0 ? void 0 : _c.dm), { enabled: (_g = (_f = (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.slack) === null || _e === void 0 ? void 0 : _e.dm) === null || _f === void 0 ? void 0 : _f.enabled) !== null && _g !== void 0 ? _g : true, allowFrom: allowFrom }) }) }) });
}
function parseSlackAllowFromInput(raw) {
    return raw
        .split(/[\n,;]+/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function promptSlackAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId, resolved, token, existing, parseInputs, parseId, entry, parts, ids_1, unique_1, results, unresolved, ids, unique;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    accountId = params.accountId && (0, session_key_js_1.normalizeAccountId)(params.accountId)
                        ? ((_a = (0, session_key_js_1.normalizeAccountId)(params.accountId)) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID)
                        : (0, accounts_js_1.resolveDefaultSlackAccountId)(params.cfg);
                    resolved = (0, accounts_js_1.resolveSlackAccount)({ cfg: params.cfg, accountId: accountId });
                    token = (_c = (_b = resolved.config.userToken) !== null && _b !== void 0 ? _b : resolved.config.botToken) !== null && _c !== void 0 ? _c : "";
                    existing = (_g = (_f = (_e = (_d = params.cfg.channels) === null || _d === void 0 ? void 0 : _d.slack) === null || _e === void 0 ? void 0 : _e.dm) === null || _f === void 0 ? void 0 : _f.allowFrom) !== null && _g !== void 0 ? _g : [];
                    return [4 /*yield*/, params.prompter.note([
                            "Allowlist Slack DMs by username (we resolve to user ids).",
                            "Examples:",
                            "- U12345678",
                            "- @alice",
                            "Multiple entries: comma-separated.",
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/slack", "slack")),
                        ].join("\n"), "Slack allowlist")];
                case 1:
                    _h.sent();
                    parseInputs = function (value) { return parseSlackAllowFromInput(value); };
                    parseId = function (value) {
                        var _a;
                        var trimmed = value.trim();
                        if (!trimmed) {
                            return null;
                        }
                        var mention = trimmed.match(/^<@([A-Z0-9]+)>$/i);
                        if (mention) {
                            return (_a = mention[1]) === null || _a === void 0 ? void 0 : _a.toUpperCase();
                        }
                        var prefixed = trimmed.replace(/^(slack:|user:)/i, "");
                        if (/^[A-Z][A-Z0-9]+$/i.test(prefixed)) {
                            return prefixed.toUpperCase();
                        }
                        return null;
                    };
                    _h.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Slack allowFrom (usernames or ids)",
                            placeholder: "@alice, U12345678",
                            initialValue: existing[0] ? String(existing[0]) : undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 3:
                    entry = _h.sent();
                    parts = parseInputs(String(entry));
                    if (!!token) return [3 /*break*/, 6];
                    ids_1 = parts.map(parseId).filter(Boolean);
                    if (!(ids_1.length !== parts.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, params.prompter.note("Slack token missing; use user ids (or mention form) only.", "Slack allowlist")];
                case 4:
                    _h.sent();
                    return [3 /*break*/, 2];
                case 5:
                    unique_1 = __spreadArray([], new Set(__spreadArray(__spreadArray([], existing.map(function (v) { return String(v).trim(); }), true), ids_1, true)), true).filter(Boolean);
                    return [2 /*return*/, setSlackAllowFrom(params.cfg, unique_1)];
                case 6: return [4 /*yield*/, (0, resolve_users_js_1.resolveSlackUserAllowlist)({
                        token: token,
                        entries: parts,
                    }).catch(function () { return null; })];
                case 7:
                    results = _h.sent();
                    if (!!results) return [3 /*break*/, 9];
                    return [4 /*yield*/, params.prompter.note("Failed to resolve usernames. Try again.", "Slack allowlist")];
                case 8:
                    _h.sent();
                    return [3 /*break*/, 2];
                case 9:
                    unresolved = results.filter(function (res) { return !res.resolved || !res.id; });
                    if (!(unresolved.length > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, params.prompter.note("Could not resolve: ".concat(unresolved.map(function (res) { return res.input; }).join(", ")), "Slack allowlist")];
                case 10:
                    _h.sent();
                    return [3 /*break*/, 2];
                case 11:
                    ids = results.map(function (res) { return res.id; });
                    unique = __spreadArray([], new Set(__spreadArray(__spreadArray([], existing.map(function (v) { return String(v).trim(); }).filter(Boolean), true), ids, true)), true);
                    return [2 /*return*/, setSlackAllowFrom(params.cfg, unique)];
                case 12: return [2 /*return*/];
            }
        });
    });
}
var dmPolicy = {
    label: "Slack",
    channel: channel,
    policyKey: "channels.slack.dm.policy",
    allowFromKey: "channels.slack.dm.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.slack) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.policy) !== null && _d !== void 0 ? _d : "pairing"; },
    setPolicy: function (cfg, policy) { return setSlackDmPolicy(cfg, policy); },
    promptAllowFrom: promptSlackAllowFrom,
};
exports.slackOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            configured = (0, accounts_js_1.listSlackAccountIds)(cfg).some(function (accountId) {
                var account = (0, accounts_js_1.resolveSlackAccount)({ cfg: cfg, accountId: accountId });
                return Boolean(account.botToken && account.appToken);
            });
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["Slack: ".concat(configured ? "configured" : "needs tokens")],
                    selectionHint: configured ? "configured" : "needs tokens",
                    quickstartScore: configured ? 2 : 1,
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var slackOverride, defaultSlackAccountId, slackAccountId, next, resolvedAccount, accountConfigured, allowEnv, canUseEnv, hasConfigTokens, botToken, appToken, slackBotName, _c, keepEnv, _d, _e, keep, _f, _g, _h, _j, accessConfig, keys, accountWithTokens, resolved, resolvedKeys, unresolved, err_1;
        var _k;
        var _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds;
        return __generator(this, function (_4) {
            switch (_4.label) {
                case 0:
                    slackOverride = (_l = accountOverrides.slack) === null || _l === void 0 ? void 0 : _l.trim();
                    defaultSlackAccountId = (0, accounts_js_1.resolveDefaultSlackAccountId)(cfg);
                    slackAccountId = slackOverride ? (0, session_key_js_1.normalizeAccountId)(slackOverride) : defaultSlackAccountId;
                    if (!(shouldPromptAccountIds && !slackOverride)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, helpers_js_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Slack",
                            currentId: slackAccountId,
                            listAccountIds: accounts_js_1.listSlackAccountIds,
                            defaultAccountId: defaultSlackAccountId,
                        })];
                case 1:
                    slackAccountId = _4.sent();
                    _4.label = 2;
                case 2:
                    next = cfg;
                    resolvedAccount = (0, accounts_js_1.resolveSlackAccount)({
                        cfg: next,
                        accountId: slackAccountId,
                    });
                    accountConfigured = Boolean(resolvedAccount.botToken && resolvedAccount.appToken);
                    allowEnv = slackAccountId === session_key_js_1.DEFAULT_ACCOUNT_ID;
                    canUseEnv = allowEnv &&
                        Boolean((_m = process.env.SLACK_BOT_TOKEN) === null || _m === void 0 ? void 0 : _m.trim()) &&
                        Boolean((_o = process.env.SLACK_APP_TOKEN) === null || _o === void 0 ? void 0 : _o.trim());
                    hasConfigTokens = Boolean(resolvedAccount.config.botToken && resolvedAccount.config.appToken);
                    botToken = null;
                    appToken = null;
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Slack bot display name (used for manifest)",
                            initialValue: "OpenClaw",
                        })];
                case 3:
                    slackBotName = _c.apply(void 0, [_4.sent()]).trim();
                    if (!!accountConfigured) return [3 /*break*/, 5];
                    return [4 /*yield*/, noteSlackTokenHelp(prompter, slackBotName)];
                case 4:
                    _4.sent();
                    _4.label = 5;
                case 5:
                    if (!(canUseEnv && (!resolvedAccount.config.botToken || !resolvedAccount.config.appToken))) return [3 /*break*/, 11];
                    return [4 /*yield*/, prompter.confirm({
                            message: "SLACK_BOT_TOKEN + SLACK_APP_TOKEN detected. Use env vars?",
                            initialValue: true,
                        })];
                case 6:
                    keepEnv = _4.sent();
                    if (!keepEnv) return [3 /*break*/, 7];
                    next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { slack: __assign(__assign({}, (_p = next.channels) === null || _p === void 0 ? void 0 : _p.slack), { enabled: true }) }) });
                    return [3 /*break*/, 10];
                case 7:
                    _d = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Slack bot token (xoxb-...)",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 8:
                    botToken = _d.apply(void 0, [_4.sent()]).trim();
                    _e = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Slack app token (xapp-...)",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 9:
                    appToken = _e.apply(void 0, [_4.sent()]).trim();
                    _4.label = 10;
                case 10: return [3 /*break*/, 19];
                case 11:
                    if (!hasConfigTokens) return [3 /*break*/, 16];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Slack tokens already configured. Keep them?",
                            initialValue: true,
                        })];
                case 12:
                    keep = _4.sent();
                    if (!!keep) return [3 /*break*/, 15];
                    _f = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Slack bot token (xoxb-...)",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 13:
                    botToken = _f.apply(void 0, [_4.sent()]).trim();
                    _g = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Slack app token (xapp-...)",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 14:
                    appToken = _g.apply(void 0, [_4.sent()]).trim();
                    _4.label = 15;
                case 15: return [3 /*break*/, 19];
                case 16:
                    _h = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Slack bot token (xoxb-...)",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 17:
                    botToken = _h.apply(void 0, [_4.sent()]).trim();
                    _j = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter Slack app token (xapp-...)",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 18:
                    appToken = _j.apply(void 0, [_4.sent()]).trim();
                    _4.label = 19;
                case 19:
                    if (botToken && appToken) {
                        if (slackAccountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { slack: __assign(__assign({}, (_q = next.channels) === null || _q === void 0 ? void 0 : _q.slack), { enabled: true, botToken: botToken, appToken: appToken }) }) });
                        }
                        else {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { slack: __assign(__assign({}, (_r = next.channels) === null || _r === void 0 ? void 0 : _r.slack), { enabled: true, accounts: __assign(__assign({}, (_t = (_s = next.channels) === null || _s === void 0 ? void 0 : _s.slack) === null || _t === void 0 ? void 0 : _t.accounts), (_k = {}, _k[slackAccountId] = __assign(__assign({}, (_w = (_v = (_u = next.channels) === null || _u === void 0 ? void 0 : _u.slack) === null || _v === void 0 ? void 0 : _v.accounts) === null || _w === void 0 ? void 0 : _w[slackAccountId]), { enabled: (_1 = (_0 = (_z = (_y = (_x = next.channels) === null || _x === void 0 ? void 0 : _x.slack) === null || _y === void 0 ? void 0 : _y.accounts) === null || _z === void 0 ? void 0 : _z[slackAccountId]) === null || _0 === void 0 ? void 0 : _0.enabled) !== null && _1 !== void 0 ? _1 : true, botToken: botToken, appToken: appToken }), _k)) }) }) });
                        }
                    }
                    return [4 /*yield*/, (0, channel_access_js_1.promptChannelAccessConfig)({
                            prompter: prompter,
                            label: "Slack channels",
                            currentPolicy: (_2 = resolvedAccount.config.groupPolicy) !== null && _2 !== void 0 ? _2 : "allowlist",
                            currentEntries: Object.entries((_3 = resolvedAccount.config.channels) !== null && _3 !== void 0 ? _3 : {})
                                .filter(function (_a) {
                                var value = _a[1];
                                return (value === null || value === void 0 ? void 0 : value.allow) !== false && (value === null || value === void 0 ? void 0 : value.enabled) !== false;
                            })
                                .map(function (_a) {
                                var key = _a[0];
                                return key;
                            }),
                            placeholder: "#general, #private, C123",
                            updatePrompt: Boolean(resolvedAccount.config.channels),
                        })];
                case 20:
                    accessConfig = _4.sent();
                    if (!accessConfig) return [3 /*break*/, 29];
                    if (!(accessConfig.policy !== "allowlist")) return [3 /*break*/, 21];
                    next = setSlackGroupPolicy(next, slackAccountId, accessConfig.policy);
                    return [3 /*break*/, 29];
                case 21:
                    keys = accessConfig.entries;
                    accountWithTokens = (0, accounts_js_1.resolveSlackAccount)({
                        cfg: next,
                        accountId: slackAccountId,
                    });
                    if (!(accountWithTokens.botToken && accessConfig.entries.length > 0)) return [3 /*break*/, 28];
                    _4.label = 22;
                case 22:
                    _4.trys.push([22, 26, , 28]);
                    return [4 /*yield*/, (0, resolve_channels_js_1.resolveSlackChannelAllowlist)({
                            token: accountWithTokens.botToken,
                            entries: accessConfig.entries,
                        })];
                case 23:
                    resolved = _4.sent();
                    resolvedKeys = resolved
                        .filter(function (entry) { return entry.resolved && entry.id; })
                        .map(function (entry) { return entry.id; });
                    unresolved = resolved
                        .filter(function (entry) { return !entry.resolved; })
                        .map(function (entry) { return entry.input; });
                    keys = __spreadArray(__spreadArray([], resolvedKeys, true), unresolved.map(function (entry) { return entry.trim(); }).filter(Boolean), true);
                    if (!(resolvedKeys.length > 0 || unresolved.length > 0)) return [3 /*break*/, 25];
                    return [4 /*yield*/, prompter.note([
                            resolvedKeys.length > 0 ? "Resolved: ".concat(resolvedKeys.join(", ")) : undefined,
                            unresolved.length > 0
                                ? "Unresolved (kept as typed): ".concat(unresolved.join(", "))
                                : undefined,
                        ]
                            .filter(Boolean)
                            .join("\n"), "Slack channels")];
                case 24:
                    _4.sent();
                    _4.label = 25;
                case 25: return [3 /*break*/, 28];
                case 26:
                    err_1 = _4.sent();
                    return [4 /*yield*/, prompter.note("Channel lookup failed; keeping entries as typed. ".concat(String(err_1)), "Slack channels")];
                case 27:
                    _4.sent();
                    return [3 /*break*/, 28];
                case 28:
                    next = setSlackGroupPolicy(next, slackAccountId, "allowlist");
                    next = setSlackChannelAllowlist(next, slackAccountId, keys);
                    _4.label = 29;
                case 29: return [2 /*return*/, { cfg: next, accountId: slackAccountId }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { slack: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.slack), { enabled: false }) }) }));
    },
};
