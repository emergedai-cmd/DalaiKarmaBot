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
exports.msteamsOnboardingAdapter = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var resolve_allowlist_js_1 = require("./resolve-allowlist.js");
var token_js_1 = require("./token.js");
var channel = "msteams";
function setMSTeamsDmPolicy(cfg, dmPolicy) {
    var _a, _b, _c, _d;
    var allowFrom = dmPolicy === "open"
        ? (_c = (0, plugin_sdk_1.addWildcardAllowFrom)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams) === null || _b === void 0 ? void 0 : _b.allowFrom)) === null || _c === void 0 ? void 0 : _c.map(function (entry) { return String(entry); })
        : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { msteams: __assign(__assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.msteams), { dmPolicy: dmPolicy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) });
}
function setMSTeamsAllowFrom(cfg, allowFrom) {
    var _a;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { msteams: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams), { allowFrom: allowFrom }) }) });
}
function parseAllowFromInput(raw) {
    return raw
        .split(/[\n,;]+/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function looksLikeGuid(value) {
    return /^[0-9a-fA-F-]{16,}$/.test(value);
}
function promptMSTeamsAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, entry, parts, resolved, ids_1, unique_1, unresolved, ids, unique;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    existing = (_c = (_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams) === null || _b === void 0 ? void 0 : _b.allowFrom) !== null && _c !== void 0 ? _c : [];
                    return [4 /*yield*/, params.prompter.note([
                            "Allowlist MS Teams DMs by display name, UPN/email, or user id.",
                            "We resolve names to user IDs via Microsoft Graph when credentials allow.",
                            "Examples:",
                            "- alex@example.com",
                            "- Alex Johnson",
                            "- 00000000-0000-0000-0000-000000000000",
                        ].join("\n"), "MS Teams allowlist")];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, params.prompter.text({
                            message: "MS Teams allowFrom (usernames or ids)",
                            placeholder: "alex@example.com, Alex Johnson",
                            initialValue: existing[0] ? String(existing[0]) : undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 3:
                    entry = _d.sent();
                    parts = parseAllowFromInput(String(entry));
                    if (!(parts.length === 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, params.prompter.note("Enter at least one user.", "MS Teams allowlist")];
                case 4:
                    _d.sent();
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, (0, resolve_allowlist_js_1.resolveMSTeamsUserAllowlist)({
                        cfg: params.cfg,
                        entries: parts,
                    }).catch(function () { return null; })];
                case 6:
                    resolved = _d.sent();
                    if (!!resolved) return [3 /*break*/, 9];
                    ids_1 = parts.filter(function (part) { return looksLikeGuid(part); });
                    if (!(ids_1.length !== parts.length)) return [3 /*break*/, 8];
                    return [4 /*yield*/, params.prompter.note("Graph lookup unavailable. Use user IDs only.", "MS Teams allowlist")];
                case 7:
                    _d.sent();
                    return [3 /*break*/, 2];
                case 8:
                    unique_1 = __spreadArray([], new Set(__spreadArray(__spreadArray([], existing.map(function (v) { return String(v).trim(); }).filter(Boolean), true), ids_1, true)), true);
                    return [2 /*return*/, setMSTeamsAllowFrom(params.cfg, unique_1)];
                case 9:
                    unresolved = resolved.filter(function (item) { return !item.resolved || !item.id; });
                    if (!(unresolved.length > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, params.prompter.note("Could not resolve: ".concat(unresolved.map(function (item) { return item.input; }).join(", ")), "MS Teams allowlist")];
                case 10:
                    _d.sent();
                    return [3 /*break*/, 2];
                case 11:
                    ids = resolved.map(function (item) { return item.id; });
                    unique = __spreadArray([], new Set(__spreadArray(__spreadArray([], existing.map(function (v) { return String(v).trim(); }).filter(Boolean), true), ids, true)), true);
                    return [2 /*return*/, setMSTeamsAllowFrom(params.cfg, unique)];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function noteMSTeamsCredentialHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "1) Azure Bot registration → get App ID + Tenant ID",
                        "2) Add a client secret (App Password)",
                        "3) Set webhook URL + messaging endpoint",
                        "Tip: you can also set MSTEAMS_APP_ID / MSTEAMS_APP_PASSWORD / MSTEAMS_TENANT_ID.",
                        "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/msteams", "msteams")),
                    ].join("\n"), "MS Teams credentials")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setMSTeamsGroupPolicy(cfg, groupPolicy) {
    var _a;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { msteams: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams), { enabled: true, groupPolicy: groupPolicy }) }) });
}
function setMSTeamsTeamsAllowlist(cfg, entries) {
    var _a, _b, _c, _d, _e, _f;
    var baseTeams = (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams) === null || _b === void 0 ? void 0 : _b.teams) !== null && _c !== void 0 ? _c : {};
    var teams = __assign({}, baseTeams);
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var teamKey = entry.teamKey;
        if (!teamKey) {
            continue;
        }
        var existing = (_d = teams[teamKey]) !== null && _d !== void 0 ? _d : {};
        if (entry.channelKey) {
            var channels = __assign({}, existing.channels);
            channels[entry.channelKey] = (_e = channels[entry.channelKey]) !== null && _e !== void 0 ? _e : {};
            teams[teamKey] = __assign(__assign({}, existing), { channels: channels });
        }
        else {
            teams[teamKey] = existing;
        }
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { msteams: __assign(__assign({}, (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.msteams), { enabled: true, teams: teams }) }) });
}
var dmPolicy = {
    label: "MS Teams",
    channel: channel,
    policyKey: "channels.msteams.dmPolicy",
    allowFromKey: "channels.msteams.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c; return (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams) === null || _b === void 0 ? void 0 : _b.dmPolicy) !== null && _c !== void 0 ? _c : "pairing"; },
    setPolicy: function (cfg, policy) { return setMSTeamsDmPolicy(cfg, policy); },
    promptAllowFrom: promptMSTeamsAllowFrom,
};
exports.msteamsOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured;
        var _c;
        var cfg = _b.cfg;
        return __generator(this, function (_d) {
            configured = Boolean((0, token_js_1.resolveMSTeamsCredentials)((_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.msteams));
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["MS Teams: ".concat(configured ? "configured" : "needs app credentials")],
                    selectionHint: configured ? "configured" : "needs app creds",
                    quickstartScore: configured ? 2 : 0,
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var resolved, hasConfigCreds, canUseEnv, next, appId, appPassword, tenantId, keepEnv, _c, _d, _e, keep, _f, _g, _h, _j, _k, _l, currentEntries, accessConfig, entries, resolved_1, resolvedChannels, resolvedTeams, unresolved, summary, err_1;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
        var cfg = _b.cfg, prompter = _b.prompter;
        return __generator(this, function (_11) {
            switch (_11.label) {
                case 0:
                    resolved = (0, token_js_1.resolveMSTeamsCredentials)((_m = cfg.channels) === null || _m === void 0 ? void 0 : _m.msteams);
                    hasConfigCreds = Boolean(((_q = (_p = (_o = cfg.channels) === null || _o === void 0 ? void 0 : _o.msteams) === null || _p === void 0 ? void 0 : _p.appId) === null || _q === void 0 ? void 0 : _q.trim()) &&
                        ((_t = (_s = (_r = cfg.channels) === null || _r === void 0 ? void 0 : _r.msteams) === null || _s === void 0 ? void 0 : _s.appPassword) === null || _t === void 0 ? void 0 : _t.trim()) &&
                        ((_w = (_v = (_u = cfg.channels) === null || _u === void 0 ? void 0 : _u.msteams) === null || _v === void 0 ? void 0 : _v.tenantId) === null || _w === void 0 ? void 0 : _w.trim()));
                    canUseEnv = Boolean(!hasConfigCreds &&
                        ((_x = process.env.MSTEAMS_APP_ID) === null || _x === void 0 ? void 0 : _x.trim()) &&
                        ((_y = process.env.MSTEAMS_APP_PASSWORD) === null || _y === void 0 ? void 0 : _y.trim()) &&
                        ((_z = process.env.MSTEAMS_TENANT_ID) === null || _z === void 0 ? void 0 : _z.trim()));
                    next = cfg;
                    appId = null;
                    appPassword = null;
                    tenantId = null;
                    if (!!resolved) return [3 /*break*/, 2];
                    return [4 /*yield*/, noteMSTeamsCredentialHelp(prompter)];
                case 1:
                    _11.sent();
                    _11.label = 2;
                case 2:
                    if (!canUseEnv) return [3 /*break*/, 9];
                    return [4 /*yield*/, prompter.confirm({
                            message: "MSTEAMS_APP_ID + MSTEAMS_APP_PASSWORD + MSTEAMS_TENANT_ID detected. Use env vars?",
                            initialValue: true,
                        })];
                case 3:
                    keepEnv = _11.sent();
                    if (!keepEnv) return [3 /*break*/, 4];
                    next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { msteams: __assign(__assign({}, (_0 = next.channels) === null || _0 === void 0 ? void 0 : _0.msteams), { enabled: true }) }) });
                    return [3 /*break*/, 8];
                case 4:
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter MS Teams App ID",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 5:
                    appId = _c.apply(void 0, [_11.sent()]).trim();
                    _d = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter MS Teams App Password",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 6:
                    appPassword = _d.apply(void 0, [_11.sent()]).trim();
                    _e = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter MS Teams Tenant ID",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 7:
                    tenantId = _e.apply(void 0, [_11.sent()]).trim();
                    _11.label = 8;
                case 8: return [3 /*break*/, 19];
                case 9:
                    if (!hasConfigCreds) return [3 /*break*/, 15];
                    return [4 /*yield*/, prompter.confirm({
                            message: "MS Teams credentials already configured. Keep them?",
                            initialValue: true,
                        })];
                case 10:
                    keep = _11.sent();
                    if (!!keep) return [3 /*break*/, 14];
                    _f = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter MS Teams App ID",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 11:
                    appId = _f.apply(void 0, [_11.sent()]).trim();
                    _g = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter MS Teams App Password",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 12:
                    appPassword = _g.apply(void 0, [_11.sent()]).trim();
                    _h = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter MS Teams Tenant ID",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 13:
                    tenantId = _h.apply(void 0, [_11.sent()]).trim();
                    _11.label = 14;
                case 14: return [3 /*break*/, 19];
                case 15:
                    _j = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter MS Teams App ID",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 16:
                    appId = _j.apply(void 0, [_11.sent()]).trim();
                    _k = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter MS Teams App Password",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 17:
                    appPassword = _k.apply(void 0, [_11.sent()]).trim();
                    _l = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter MS Teams Tenant ID",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 18:
                    tenantId = _l.apply(void 0, [_11.sent()]).trim();
                    _11.label = 19;
                case 19:
                    if (appId && appPassword && tenantId) {
                        next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { msteams: __assign(__assign({}, (_1 = next.channels) === null || _1 === void 0 ? void 0 : _1.msteams), { enabled: true, appId: appId, appPassword: appPassword, tenantId: tenantId }) }) });
                    }
                    currentEntries = Object.entries((_4 = (_3 = (_2 = next.channels) === null || _2 === void 0 ? void 0 : _2.msteams) === null || _3 === void 0 ? void 0 : _3.teams) !== null && _4 !== void 0 ? _4 : {}).flatMap(function (_a) {
                        var _b;
                        var teamKey = _a[0], value = _a[1];
                        var channels = (_b = value === null || value === void 0 ? void 0 : value.channels) !== null && _b !== void 0 ? _b : {};
                        var channelKeys = Object.keys(channels);
                        if (channelKeys.length === 0) {
                            return [teamKey];
                        }
                        return channelKeys.map(function (channelKey) { return "".concat(teamKey, "/").concat(channelKey); });
                    });
                    return [4 /*yield*/, (0, plugin_sdk_1.promptChannelAccessConfig)({
                            prompter: prompter,
                            label: "MS Teams channels",
                            currentPolicy: (_7 = (_6 = (_5 = next.channels) === null || _5 === void 0 ? void 0 : _5.msteams) === null || _6 === void 0 ? void 0 : _6.groupPolicy) !== null && _7 !== void 0 ? _7 : "allowlist",
                            currentEntries: currentEntries,
                            placeholder: "Team Name/Channel Name, teamId/conversationId",
                            updatePrompt: Boolean((_9 = (_8 = next.channels) === null || _8 === void 0 ? void 0 : _8.msteams) === null || _9 === void 0 ? void 0 : _9.teams),
                        })];
                case 20:
                    accessConfig = _11.sent();
                    if (!accessConfig) return [3 /*break*/, 29];
                    if (!(accessConfig.policy !== "allowlist")) return [3 /*break*/, 21];
                    next = setMSTeamsGroupPolicy(next, accessConfig.policy);
                    return [3 /*break*/, 29];
                case 21:
                    entries = accessConfig.entries
                        .map(function (entry) { return (0, resolve_allowlist_js_1.parseMSTeamsTeamEntry)(entry); })
                        .filter(Boolean);
                    if (!(accessConfig.entries.length > 0 && (0, token_js_1.resolveMSTeamsCredentials)((_10 = next.channels) === null || _10 === void 0 ? void 0 : _10.msteams))) return [3 /*break*/, 28];
                    _11.label = 22;
                case 22:
                    _11.trys.push([22, 26, , 28]);
                    return [4 /*yield*/, (0, resolve_allowlist_js_1.resolveMSTeamsChannelAllowlist)({
                            cfg: next,
                            entries: accessConfig.entries,
                        })];
                case 23:
                    resolved_1 = _11.sent();
                    resolvedChannels = resolved_1.filter(function (entry) { return entry.resolved && entry.teamId && entry.channelId; });
                    resolvedTeams = resolved_1.filter(function (entry) { return entry.resolved && entry.teamId && !entry.channelId; });
                    unresolved = resolved_1
                        .filter(function (entry) { return !entry.resolved; })
                        .map(function (entry) { return entry.input; });
                    entries = __spreadArray(__spreadArray(__spreadArray([], resolvedChannels.map(function (entry) { return ({
                        teamKey: entry.teamId,
                        channelKey: entry.channelId,
                    }); }), true), resolvedTeams.map(function (entry) { return ({
                        teamKey: entry.teamId,
                    }); }), true), unresolved.map(function (entry) { return (0, resolve_allowlist_js_1.parseMSTeamsTeamEntry)(entry); }).filter(Boolean), true);
                    if (!(resolvedChannels.length > 0 || resolvedTeams.length > 0 || unresolved.length > 0)) return [3 /*break*/, 25];
                    summary = [];
                    if (resolvedChannels.length > 0) {
                        summary.push("Resolved channels: ".concat(resolvedChannels
                            .map(function (entry) { return entry.channelId; })
                            .filter(Boolean)
                            .join(", ")));
                    }
                    if (resolvedTeams.length > 0) {
                        summary.push("Resolved teams: ".concat(resolvedTeams
                            .map(function (entry) { return entry.teamId; })
                            .filter(Boolean)
                            .join(", ")));
                    }
                    if (unresolved.length > 0) {
                        summary.push("Unresolved (kept as typed): ".concat(unresolved.join(", ")));
                    }
                    return [4 /*yield*/, prompter.note(summary.join("\n"), "MS Teams channels")];
                case 24:
                    _11.sent();
                    _11.label = 25;
                case 25: return [3 /*break*/, 28];
                case 26:
                    err_1 = _11.sent();
                    return [4 /*yield*/, prompter.note("Channel lookup failed; keeping entries as typed. ".concat(String(err_1)), "MS Teams channels")];
                case 27:
                    _11.sent();
                    return [3 /*break*/, 28];
                case 28:
                    next = setMSTeamsGroupPolicy(next, "allowlist");
                    next = setMSTeamsTeamsAllowlist(next, entries);
                    _11.label = 29;
                case 29: return [2 /*return*/, { cfg: next, accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { msteams: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams), { enabled: false }) }) }));
    },
};
