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
exports.listMSTeamsDirectoryPeersLive = listMSTeamsDirectoryPeersLive;
exports.listMSTeamsDirectoryGroupsLive = listMSTeamsDirectoryGroupsLive;
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
function listMSTeamsDirectoryPeersLive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var query, token, limit, users, escaped, filter, path, res, path, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    query = normalizeQuery(params.query);
                    if (!query) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, resolveGraphToken(params.cfg)];
                case 1:
                    token = _c.sent();
                    limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 20;
                    users = [];
                    if (!query.includes("@")) return [3 /*break*/, 3];
                    escaped = escapeOData(query);
                    filter = "(mail eq '".concat(escaped, "' or userPrincipalName eq '").concat(escaped, "')");
                    path = "/users?$filter=".concat(encodeURIComponent(filter), "&$select=id,displayName,mail,userPrincipalName");
                    return [4 /*yield*/, fetchGraphJson({ token: token, path: path })];
                case 2:
                    res = _c.sent();
                    users = (_a = res.value) !== null && _a !== void 0 ? _a : [];
                    return [3 /*break*/, 5];
                case 3:
                    path = "/users?$search=".concat(encodeURIComponent("\"displayName:".concat(query, "\"")), "&$select=id,displayName,mail,userPrincipalName&$top=").concat(limit);
                    return [4 /*yield*/, fetchGraphJson({
                            token: token,
                            path: path,
                            headers: { ConsistencyLevel: "eventual" },
                        })];
                case 4:
                    res = _c.sent();
                    users = (_b = res.value) !== null && _b !== void 0 ? _b : [];
                    _c.label = 5;
                case 5: return [2 /*return*/, users
                        .map(function (user) {
                        var _a, _b, _c, _d;
                        var id = (_a = user.id) === null || _a === void 0 ? void 0 : _a.trim();
                        if (!id) {
                            return null;
                        }
                        var name = (_b = user.displayName) === null || _b === void 0 ? void 0 : _b.trim();
                        var handle = ((_c = user.userPrincipalName) === null || _c === void 0 ? void 0 : _c.trim()) || ((_d = user.mail) === null || _d === void 0 ? void 0 : _d.trim());
                        return {
                            kind: "user",
                            id: "user:".concat(id),
                            name: name || undefined,
                            handle: handle ? "@".concat(handle) : undefined,
                            raw: user,
                        };
                    })
                        .filter(Boolean)];
            }
        });
    });
}
function listMSTeamsDirectoryGroupsLive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var rawQuery, token, limit, _a, teamQuery, channelQuery, teams, results, _i, teams_1, team, teamId, teamName, channels, _b, channels_1, channel, name_1;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    rawQuery = normalizeQuery(params.query);
                    if (!rawQuery) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, resolveGraphToken(params.cfg)];
                case 1:
                    token = _f.sent();
                    limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 20;
                    _a = rawQuery.includes("/")
                        ? rawQuery
                            .split("/", 2)
                            .map(function (part) { return part.trim(); })
                            .filter(Boolean)
                        : [rawQuery, null], teamQuery = _a[0], channelQuery = _a[1];
                    return [4 /*yield*/, listTeamsByName(token, teamQuery)];
                case 2:
                    teams = _f.sent();
                    results = [];
                    _i = 0, teams_1 = teams;
                    _f.label = 3;
                case 3:
                    if (!(_i < teams_1.length)) return [3 /*break*/, 6];
                    team = teams_1[_i];
                    teamId = (_c = team.id) === null || _c === void 0 ? void 0 : _c.trim();
                    if (!teamId) {
                        return [3 /*break*/, 5];
                    }
                    teamName = ((_d = team.displayName) === null || _d === void 0 ? void 0 : _d.trim()) || teamQuery;
                    if (!channelQuery) {
                        results.push({
                            kind: "group",
                            id: "team:".concat(teamId),
                            name: teamName,
                            handle: teamName ? "#".concat(teamName) : undefined,
                            raw: team,
                        });
                        if (results.length >= limit) {
                            return [2 /*return*/, results];
                        }
                        return [3 /*break*/, 5];
                    }
                    return [4 /*yield*/, listChannelsForTeam(token, teamId)];
                case 4:
                    channels = _f.sent();
                    for (_b = 0, channels_1 = channels; _b < channels_1.length; _b++) {
                        channel = channels_1[_b];
                        name_1 = (_e = channel.displayName) === null || _e === void 0 ? void 0 : _e.trim();
                        if (!name_1) {
                            continue;
                        }
                        if (!name_1.toLowerCase().includes(channelQuery.toLowerCase())) {
                            continue;
                        }
                        results.push({
                            kind: "group",
                            id: "conversation:".concat(channel.id),
                            name: "".concat(teamName, "/").concat(name_1),
                            handle: "#".concat(name_1),
                            raw: channel,
                        });
                        if (results.length >= limit) {
                            return [2 /*return*/, results];
                        }
                    }
                    _f.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, results];
            }
        });
    });
}
