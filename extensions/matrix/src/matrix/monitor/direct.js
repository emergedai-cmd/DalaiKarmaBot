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
exports.createDirectRoomTracker = createDirectRoomTracker;
var DM_CACHE_TTL_MS = 30000;
function createDirectRoomTracker(client, opts) {
    var _this = this;
    var _a;
    if (opts === void 0) { opts = {}; }
    var log = (_a = opts.log) !== null && _a !== void 0 ? _a : (function () { });
    var lastDmUpdateMs = 0;
    var cachedSelfUserId = null;
    var memberCountCache = new Map();
    var ensureSelfUserId = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (cachedSelfUserId) {
                        return [2 /*return*/, cachedSelfUserId];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getUserId()];
                case 2:
                    cachedSelfUserId = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    cachedSelfUserId = null;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, cachedSelfUserId];
            }
        });
    }); };
    var refreshDmCache = function () { return __awaiter(_this, void 0, void 0, function () {
        var now, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = Date.now();
                    if (now - lastDmUpdateMs < DM_CACHE_TTL_MS) {
                        return [2 /*return*/];
                    }
                    lastDmUpdateMs = now;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.dms.update()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    log("matrix: dm cache refresh failed (".concat(String(err_1), ")"));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var resolveMemberCount = function (roomId) { return __awaiter(_this, void 0, void 0, function () {
        var cached, now, members, count, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cached = memberCountCache.get(roomId);
                    now = Date.now();
                    if (cached && now - cached.ts < DM_CACHE_TTL_MS) {
                        return [2 /*return*/, cached.count];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getJoinedRoomMembers(roomId)];
                case 2:
                    members = _a.sent();
                    count = members.length;
                    memberCountCache.set(roomId, { count: count, ts: now });
                    return [2 /*return*/, count];
                case 3:
                    err_2 = _a.sent();
                    log("matrix: dm member count failed room=".concat(roomId, " (").concat(String(err_2), ")"));
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var hasDirectFlag = function (roomId, userId) { return __awaiter(_this, void 0, void 0, function () {
        var target, state, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    target = userId === null || userId === void 0 ? void 0 : userId.trim();
                    if (!target) {
                        return [2 /*return*/, false];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getRoomStateEvent(roomId, "m.room.member", target)];
                case 2:
                    state = _b.sent();
                    return [2 /*return*/, (state === null || state === void 0 ? void 0 : state.is_direct) === true];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return {
        isDirectMessage: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var roomId, senderId, memberCount, selfUserId, _a, directViaState, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        roomId = params.roomId, senderId = params.senderId;
                        return [4 /*yield*/, refreshDmCache()];
                    case 1:
                        _d.sent();
                        if (client.dms.isDm(roomId)) {
                            log("matrix: dm detected via m.direct room=".concat(roomId));
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, resolveMemberCount(roomId)];
                    case 2:
                        memberCount = _d.sent();
                        if (memberCount === 2) {
                            log("matrix: dm detected via member count room=".concat(roomId, " members=").concat(memberCount));
                            return [2 /*return*/, true];
                        }
                        if (!((_c = params.selfUserId) !== null && _c !== void 0)) return [3 /*break*/, 3];
                        _a = _c;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, ensureSelfUserId()];
                    case 4:
                        _a = (_d.sent());
                        _d.label = 5;
                    case 5:
                        selfUserId = _a;
                        return [4 /*yield*/, hasDirectFlag(roomId, senderId)];
                    case 6:
                        _b = (_d.sent());
                        if (_b) return [3 /*break*/, 8];
                        return [4 /*yield*/, hasDirectFlag(roomId, selfUserId !== null && selfUserId !== void 0 ? selfUserId : "")];
                    case 7:
                        _b = (_d.sent());
                        _d.label = 8;
                    case 8:
                        directViaState = _b;
                        if (directViaState) {
                            log("matrix: dm detected via member state room=".concat(roomId));
                            return [2 /*return*/, true];
                        }
                        log("matrix: dm check room=".concat(roomId, " result=group members=").concat(memberCount !== null && memberCount !== void 0 ? memberCount : "unknown"));
                        return [2 /*return*/, false];
                }
            });
        }); },
    };
}
