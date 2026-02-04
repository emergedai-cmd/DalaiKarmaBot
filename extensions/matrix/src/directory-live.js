"use strict";
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
exports.listMatrixDirectoryPeersLive = listMatrixDirectoryPeersLive;
exports.listMatrixDirectoryGroupsLive = listMatrixDirectoryGroupsLive;
var client_js_1 = require("./matrix/client.js");
function fetchMatrixJson(params) {
    return __awaiter(this, void 0, void 0, function () {
        var res, text;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch("".concat(params.homeserver).concat(params.path), {
                        method: (_a = params.method) !== null && _a !== void 0 ? _a : "GET",
                        headers: {
                            Authorization: "Bearer ".concat(params.accessToken),
                            "Content-Type": "application/json",
                        },
                        body: params.body ? JSON.stringify(params.body) : undefined,
                    })];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text().catch(function () { return ""; })];
                case 2:
                    text = _b.sent();
                    throw new Error("Matrix API ".concat(params.path, " failed (").concat(res.status, "): ").concat(text || "unknown error"));
                case 3: return [4 /*yield*/, res.json()];
                case 4: return [2 /*return*/, (_b.sent())];
            }
        });
    });
}
function normalizeQuery(value) {
    var _a;
    return (_a = value === null || value === void 0 ? void 0 : value.trim().toLowerCase()) !== null && _a !== void 0 ? _a : "";
}
function listMatrixDirectoryPeersLive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var query, auth, res, results;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = normalizeQuery(params.query);
                    if (!query) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, (0, client_js_1.resolveMatrixAuth)({ cfg: params.cfg })];
                case 1:
                    auth = _b.sent();
                    return [4 /*yield*/, fetchMatrixJson({
                            homeserver: auth.homeserver,
                            accessToken: auth.accessToken,
                            path: "/_matrix/client/v3/user_directory/search",
                            method: "POST",
                            body: {
                                search_term: query,
                                limit: typeof params.limit === "number" && params.limit > 0 ? params.limit : 20,
                            },
                        })];
                case 2:
                    res = _b.sent();
                    results = (_a = res.results) !== null && _a !== void 0 ? _a : [];
                    return [2 /*return*/, results
                            .map(function (entry) {
                            var _a, _b;
                            var userId = (_a = entry.user_id) === null || _a === void 0 ? void 0 : _a.trim();
                            if (!userId) {
                                return null;
                            }
                            return {
                                kind: "user",
                                id: userId,
                                name: ((_b = entry.display_name) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                handle: entry.display_name ? "@".concat(entry.display_name.trim()) : undefined,
                                raw: entry,
                            };
                        })
                            .filter(Boolean)];
            }
        });
    });
}
function resolveMatrixRoomAlias(homeserver, accessToken, alias) {
    return __awaiter(this, void 0, void 0, function () {
        var res, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetchMatrixJson({
                            homeserver: homeserver,
                            accessToken: accessToken,
                            path: "/_matrix/client/v3/directory/room/".concat(encodeURIComponent(alias)),
                        })];
                case 1:
                    res = _c.sent();
                    return [2 /*return*/, ((_b = res.room_id) === null || _b === void 0 ? void 0 : _b.trim()) || null];
                case 2:
                    _a = _c.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fetchMatrixRoomName(homeserver, accessToken, roomId) {
    return __awaiter(this, void 0, void 0, function () {
        var res, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetchMatrixJson({
                            homeserver: homeserver,
                            accessToken: accessToken,
                            path: "/_matrix/client/v3/rooms/".concat(encodeURIComponent(roomId), "/state/m.room.name"),
                        })];
                case 1:
                    res = _c.sent();
                    return [2 /*return*/, ((_b = res.name) === null || _b === void 0 ? void 0 : _b.trim()) || null];
                case 2:
                    _a = _c.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function listMatrixDirectoryGroupsLive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var query, auth, limit, roomId, joined, rooms, results, _i, rooms_1, roomId, name_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = normalizeQuery(params.query);
                    if (!query) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, (0, client_js_1.resolveMatrixAuth)({ cfg: params.cfg })];
                case 1:
                    auth = _b.sent();
                    limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 20;
                    if (!query.startsWith("#")) return [3 /*break*/, 3];
                    return [4 /*yield*/, resolveMatrixRoomAlias(auth.homeserver, auth.accessToken, query)];
                case 2:
                    roomId = _b.sent();
                    if (!roomId) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, [
                            {
                                kind: "group",
                                id: roomId,
                                name: query,
                                handle: query,
                            },
                        ]];
                case 3:
                    if (query.startsWith("!")) {
                        return [2 /*return*/, [
                                {
                                    kind: "group",
                                    id: query,
                                    name: query,
                                },
                            ]];
                    }
                    return [4 /*yield*/, fetchMatrixJson({
                            homeserver: auth.homeserver,
                            accessToken: auth.accessToken,
                            path: "/_matrix/client/v3/joined_rooms",
                        })];
                case 4:
                    joined = _b.sent();
                    rooms = (_a = joined.joined_rooms) !== null && _a !== void 0 ? _a : [];
                    results = [];
                    _i = 0, rooms_1 = rooms;
                    _b.label = 5;
                case 5:
                    if (!(_i < rooms_1.length)) return [3 /*break*/, 8];
                    roomId = rooms_1[_i];
                    return [4 /*yield*/, fetchMatrixRoomName(auth.homeserver, auth.accessToken, roomId)];
                case 6:
                    name_1 = _b.sent();
                    if (!name_1) {
                        return [3 /*break*/, 7];
                    }
                    if (!name_1.toLowerCase().includes(query)) {
                        return [3 /*break*/, 7];
                    }
                    results.push({
                        kind: "group",
                        id: roomId,
                        name: name_1,
                        handle: "#".concat(name_1),
                    });
                    if (results.length >= limit) {
                        return [3 /*break*/, 8];
                    }
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, results];
            }
        });
    });
}
