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
exports.getMatrixMemberInfo = getMatrixMemberInfo;
exports.getMatrixRoomInfo = getMatrixRoomInfo;
var send_js_1 = require("../send.js");
var client_js_1 = require("./client.js");
var types_js_1 = require("./types.js");
function getMatrixMemberInfo(userId_1) {
    return __awaiter(this, arguments, void 0, function (userId, opts) {
        var _a, client, stopOnDone, roomId, _b, profile;
        var _c, _d, _e;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, client_js_1.resolveActionClient)(opts)];
                case 1:
                    _a = _f.sent(), client = _a.client, stopOnDone = _a.stopOnDone;
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, , 7, 8]);
                    if (!opts.roomId) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, send_js_1.resolveMatrixRoomId)(client, opts.roomId)];
                case 3:
                    _b = _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _b = undefined;
                    _f.label = 5;
                case 5:
                    roomId = _b;
                    return [4 /*yield*/, client.getUserProfile(userId)];
                case 6:
                    profile = _f.sent();
                    // Note: @vector-im/matrix-bot-sdk doesn't have getRoom().getMember() like matrix-js-sdk
                    // We'd need to fetch room state separately if needed
                    return [2 /*return*/, {
                            userId: userId,
                            profile: {
                                displayName: (_c = profile === null || profile === void 0 ? void 0 : profile.displayname) !== null && _c !== void 0 ? _c : null,
                                avatarUrl: (_d = profile === null || profile === void 0 ? void 0 : profile.avatar_url) !== null && _d !== void 0 ? _d : null,
                            },
                            membership: null, // Would need separate room state query
                            powerLevel: null, // Would need separate power levels state query
                            displayName: (_e = profile === null || profile === void 0 ? void 0 : profile.displayname) !== null && _e !== void 0 ? _e : null,
                            roomId: roomId !== null && roomId !== void 0 ? roomId : null,
                        }];
                case 7:
                    if (stopOnDone) {
                        client.stop();
                    }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function getMatrixRoomInfo(roomId_1) {
    return __awaiter(this, arguments, void 0, function (roomId, opts) {
        var _a, client, stopOnDone, resolvedRoom, name_1, topic, canonicalAlias, memberCount, nameState, _b, topicState, _c, aliasState, _d, members, _e;
        var _f, _g, _h;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, client_js_1.resolveActionClient)(opts)];
                case 1:
                    _a = _j.sent(), client = _a.client, stopOnDone = _a.stopOnDone;
                    _j.label = 2;
                case 2:
                    _j.trys.push([2, , 17, 18]);
                    return [4 /*yield*/, (0, send_js_1.resolveMatrixRoomId)(client, roomId)];
                case 3:
                    resolvedRoom = _j.sent();
                    name_1 = null;
                    topic = null;
                    canonicalAlias = null;
                    memberCount = null;
                    _j.label = 4;
                case 4:
                    _j.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, client.getRoomStateEvent(resolvedRoom, "m.room.name", "")];
                case 5:
                    nameState = _j.sent();
                    name_1 = (_f = nameState === null || nameState === void 0 ? void 0 : nameState.name) !== null && _f !== void 0 ? _f : null;
                    return [3 /*break*/, 7];
                case 6:
                    _b = _j.sent();
                    return [3 /*break*/, 7];
                case 7:
                    _j.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, client.getRoomStateEvent(resolvedRoom, types_js_1.EventType.RoomTopic, "")];
                case 8:
                    topicState = _j.sent();
                    topic = (_g = topicState === null || topicState === void 0 ? void 0 : topicState.topic) !== null && _g !== void 0 ? _g : null;
                    return [3 /*break*/, 10];
                case 9:
                    _c = _j.sent();
                    return [3 /*break*/, 10];
                case 10:
                    _j.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, client.getRoomStateEvent(resolvedRoom, "m.room.canonical_alias", "")];
                case 11:
                    aliasState = _j.sent();
                    canonicalAlias = (_h = aliasState === null || aliasState === void 0 ? void 0 : aliasState.alias) !== null && _h !== void 0 ? _h : null;
                    return [3 /*break*/, 13];
                case 12:
                    _d = _j.sent();
                    return [3 /*break*/, 13];
                case 13:
                    _j.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, client.getJoinedRoomMembers(resolvedRoom)];
                case 14:
                    members = _j.sent();
                    memberCount = members.length;
                    return [3 /*break*/, 16];
                case 15:
                    _e = _j.sent();
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/, {
                        roomId: resolvedRoom,
                        name: name_1,
                        topic: topic,
                        canonicalAlias: canonicalAlias,
                        altAliases: [], // Would need separate query
                        memberCount: memberCount,
                    }];
                case 17:
                    if (stopOnDone) {
                        client.stop();
                    }
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    });
}
