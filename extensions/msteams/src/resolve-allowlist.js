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
exports.normalizeMSTeamsMessagingTarget = normalizeMSTeamsMessagingTarget;
exports.normalizeMSTeamsUserInput = normalizeMSTeamsUserInput;
exports.parseMSTeamsConversationId = parseMSTeamsConversationId;
exports.parseMSTeamsTeamChannelInput = parseMSTeamsTeamChannelInput;
exports.parseMSTeamsTeamEntry = parseMSTeamsTeamEntry;
exports.resolveMSTeamsChannelAllowlist = resolveMSTeamsChannelAllowlist;
exports.resolveMSTeamsUserAllowlist = resolveMSTeamsUserAllowlist;
var shared_js_1 = require("./attachments/shared.js");
var sdk_js_1 = require("./sdk.js");
var token_js_1 = require("./token.js");
function readAccessToken(value) {
    var _a;
    if (typeof value === "string") {
        return value;
    }
    if (value && typeof value === "object") {
        var token = (_a = value.accessToken) !== null && _a !== void 0 ? _a : value.token;
        return typeof token === "string" ? token : null;
    }
    return null;
}
function stripProviderPrefix(raw) {
    return raw.replace(/^(msteams|teams):/i, "");
}
function normalizeMSTeamsMessagingTarget(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    trimmed = stripProviderPrefix(trimmed).trim();
    if (/^conversation:/i.test(trimmed)) {
        var id = trimmed.slice("conversation:".length).trim();
        return id ? "conversation:".concat(id) : undefined;
    }
    if (/^user:/i.test(trimmed)) {
        var id = trimmed.slice("user:".length).trim();
        return id ? "user:".concat(id) : undefined;
    }
    return trimmed || undefined;
}
function normalizeMSTeamsUserInput(raw) {
    return stripProviderPrefix(raw)
        .replace(/^(user|conversation):/i, "")
        .trim();
}
function parseMSTeamsConversationId(raw) {
    var trimmed = stripProviderPrefix(raw).trim();
    if (!/^conversation:/i.test(trimmed)) {
        return null;
    }
    var id = trimmed.slice("conversation:".length).trim();
    return id;
}
function normalizeMSTeamsTeamKey(raw) {
    var trimmed = stripProviderPrefix(raw)
        .replace(/^team:/i, "")
        .trim();
    return trimmed || undefined;
}
function normalizeMSTeamsChannelKey(raw) {
    var _a;
    var trimmed = (_a = raw === null || raw === void 0 ? void 0 : raw.trim().replace(/^#/, "").trim()) !== null && _a !== void 0 ? _a : "";
    return trimmed || undefined;
}
function parseMSTeamsTeamChannelInput(raw) {
    var _a;
    var trimmed = stripProviderPrefix(raw).trim();
    if (!trimmed) {
        return {};
    }
    var parts = trimmed.split("/");
    var team = normalizeMSTeamsTeamKey((_a = parts[0]) !== null && _a !== void 0 ? _a : "");
    var channel = parts.length > 1 ? normalizeMSTeamsChannelKey(parts.slice(1).join("/")) : undefined;
    return __assign(__assign({}, (team ? { team: team } : {})), (channel ? { channel: channel } : {}));
}
function parseMSTeamsTeamEntry(raw) {
    var _a = parseMSTeamsTeamChannelInput(raw), team = _a.team, channel = _a.channel;
    if (!team) {
        return null;
    }
    return __assign({ teamKey: team }, (channel ? { channelKey: channel } : {}));
}
function normalizeQuery(value) {
    var _a;
    return (_a = value === null || value === void 0 ? void 0 : value.trim()) !== null && _a !== void 0 ? _a : "";
}
function escapeOData(value) {
    return value.replace(/'/g, "''");
}
function fetchGraphJson(params) {
    return __awaiter(this, void 0, void 0, function () {
        var res, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(shared_js_1.GRAPH_ROOT).concat(params.path), {
                        headers: __assign({ Authorization: "Bearer ".concat(params.token) }, params.headers),
                    })];
                case 1:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    text = _a.sent();
                    throw new Error("Graph ".concat(params.path, " failed (").concat(res.status, "): ").concat(text || "unknown error"));
                case 3: return [4 /*yield*/, res.json()];
                case 4: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
function resolveGraphToken(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var creds, _a, sdk, authConfig, tokenProvider, token, accessToken;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    creds = (0, token_js_1.resolveMSTeamsCredentials)((_b = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null || _b === void 0 ? void 0 : _b.msteams);
                    if (!creds) {
                        throw new Error("MS Teams credentials missing");
                    }
                    return [4 /*yield*/, (0, sdk_js_1.loadMSTeamsSdkWithAuth)(creds)];
                case 1:
                    _a = _c.sent(), sdk = _a.sdk, authConfig = _a.authConfig;
                    tokenProvider = new sdk.MsalTokenProvider(authConfig);
                    return [4 /*yield*/, tokenProvider.getAccessToken("https://graph.microsoft.com")];
                case 2:
                    token = _c.sent();
                    accessToken = readAccessToken(token);
                    if (!accessToken) {
                        throw new Error("MS Teams graph token unavailable");
                    }
                    return [2 /*return*/, accessToken];
            }
        });
    });
}
function listTeamsByName(token, query) {
    return __awaiter(this, void 0, void 0, function () {
        var escaped, filter, path, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    escaped = escapeOData(query);
                    filter = "resourceProvisioningOptions/Any(x:x eq 'Team') and startsWith(displayName,'".concat(escaped, "')");
                    path = "/groups?$filter=".concat(encodeURIComponent(filter), "&$select=id,displayName");
                    return [4 /*yield*/, fetchGraphJson({ token: token, path: path })];
                case 1:
                    res = _b.sent();
                    return [2 /*return*/, (_a = res.value) !== null && _a !== void 0 ? _a : []];
            }
        });
    });
}
function listChannelsForTeam(token, teamId) {
    return __awaiter(this, void 0, void 0, function () {
        var path, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    path = "/teams/".concat(encodeURIComponent(teamId), "/channels?$select=id,displayName");
                    return [4 /*yield*/, fetchGraphJson({ token: token, path: path })];
                case 1:
                    res = _b.sent();
                    return [2 /*return*/, (_a = res.value) !== null && _a !== void 0 ? _a : []];
            }
        });
    });
}
function resolveMSTeamsChannelAllowlist(params) {
    return __awaiter(this, void 0, void 0, function () {
        var token, results, _loop_1, _i, _a, input;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, resolveGraphToken(params.cfg)];
                case 1:
                    token = _g.sent();
                    results = [];
                    _loop_1 = function (input) {
                        var _h, team, channel, teams, _j, teamMatch, teamId, teamName, channels, channelMatch;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    _h = parseMSTeamsTeamChannelInput(input), team = _h.team, channel = _h.channel;
                                    if (!team) {
                                        results.push({ input: input, resolved: false });
                                        return [2 /*return*/, "continue"];
                                    }
                                    if (!/^[0-9a-fA-F-]{16,}$/.test(team)) return [3 /*break*/, 1];
                                    _j = [{ id: team, displayName: team }];
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, listTeamsByName(token, team)];
                                case 2:
                                    _j = _k.sent();
                                    _k.label = 3;
                                case 3:
                                    teams = _j;
                                    if (teams.length === 0) {
                                        results.push({ input: input, resolved: false, note: "team not found" });
                                        return [2 /*return*/, "continue"];
                                    }
                                    teamMatch = teams[0];
                                    teamId = (_b = teamMatch.id) === null || _b === void 0 ? void 0 : _b.trim();
                                    teamName = ((_c = teamMatch.displayName) === null || _c === void 0 ? void 0 : _c.trim()) || team;
                                    if (!teamId) {
                                        results.push({ input: input, resolved: false, note: "team id missing" });
                                        return [2 /*return*/, "continue"];
                                    }
                                    if (!channel) {
                                        results.push({
                                            input: input,
                                            resolved: true,
                                            teamId: teamId,
                                            teamName: teamName,
                                            note: teams.length > 1 ? "multiple teams; chose first" : undefined,
                                        });
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, listChannelsForTeam(token, teamId)];
                                case 4:
                                    channels = _k.sent();
                                    channelMatch = (_e = (_d = channels.find(function (item) { return item.id === channel; })) !== null && _d !== void 0 ? _d : channels.find(function (item) { var _a; return ((_a = item.displayName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === channel.toLowerCase(); })) !== null && _e !== void 0 ? _e : channels.find(function (item) { var _a, _b; return (_a = item.displayName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes((_b = channel.toLowerCase()) !== null && _b !== void 0 ? _b : ""); });
                                    if (!(channelMatch === null || channelMatch === void 0 ? void 0 : channelMatch.id)) {
                                        results.push({ input: input, resolved: false, note: "channel not found" });
                                        return [2 /*return*/, "continue"];
                                    }
                                    results.push({
                                        input: input,
                                        resolved: true,
                                        teamId: teamId,
                                        teamName: teamName,
                                        channelId: channelMatch.id,
                                        channelName: (_f = channelMatch.displayName) !== null && _f !== void 0 ? _f : channel,
                                        note: channels.length > 1 ? "multiple channels; chose first" : undefined,
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = params.entries;
                    _g.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    input = _a[_i];
                    return [5 /*yield**/, _loop_1(input)];
                case 3:
                    _g.sent();
                    _g.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, results];
            }
        });
    });
}
function resolveMSTeamsUserAllowlist(params) {
    return __awaiter(this, void 0, void 0, function () {
        var token, results, _i, _a, input, query, users, escaped, filter, path, res, path, res, match;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, resolveGraphToken(params.cfg)];
                case 1:
                    token = _e.sent();
                    results = [];
                    _i = 0, _a = params.entries;
                    _e.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    input = _a[_i];
                    query = normalizeQuery(normalizeMSTeamsUserInput(input));
                    if (!query) {
                        results.push({ input: input, resolved: false });
                        return [3 /*break*/, 7];
                    }
                    if (/^[0-9a-fA-F-]{16,}$/.test(query)) {
                        results.push({ input: input, resolved: true, id: query });
                        return [3 /*break*/, 7];
                    }
                    users = [];
                    if (!query.includes("@")) return [3 /*break*/, 4];
                    escaped = escapeOData(query);
                    filter = "(mail eq '".concat(escaped, "' or userPrincipalName eq '").concat(escaped, "')");
                    path = "/users?$filter=".concat(encodeURIComponent(filter), "&$select=id,displayName,mail,userPrincipalName");
                    return [4 /*yield*/, fetchGraphJson({ token: token, path: path })];
                case 3:
                    res = _e.sent();
                    users = (_b = res.value) !== null && _b !== void 0 ? _b : [];
                    return [3 /*break*/, 6];
                case 4:
                    path = "/users?$search=".concat(encodeURIComponent("\"displayName:".concat(query, "\"")), "&$select=id,displayName,mail,userPrincipalName&$top=10");
                    return [4 /*yield*/, fetchGraphJson({
                            token: token,
                            path: path,
                            headers: { ConsistencyLevel: "eventual" },
                        })];
                case 5:
                    res = _e.sent();
                    users = (_c = res.value) !== null && _c !== void 0 ? _c : [];
                    _e.label = 6;
                case 6:
                    match = users[0];
                    if (!(match === null || match === void 0 ? void 0 : match.id)) {
                        results.push({ input: input, resolved: false });
                        return [3 /*break*/, 7];
                    }
                    results.push({
                        input: input,
                        resolved: true,
                        id: match.id,
                        name: (_d = match.displayName) !== null && _d !== void 0 ? _d : undefined,
                        note: users.length > 1 ? "multiple matches; chose first" : undefined,
                    });
                    _e.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, results];
            }
        });
    });
}
