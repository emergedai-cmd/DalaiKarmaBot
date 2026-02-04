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
exports.normalizeThreadId = normalizeThreadId;
exports.resolveMatrixRoomId = resolveMatrixRoomId;
var types_js_1 = require("./types.js");
function normalizeTarget(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        throw new Error("Matrix target is required (room:<id> or #alias)");
    }
    return trimmed;
}
function normalizeThreadId(raw) {
    if (raw === undefined || raw === null) {
        return null;
    }
    var trimmed = String(raw).trim();
    return trimmed ? trimmed : null;
}
var directRoomCache = new Map();
function persistDirectRoom(client, userId, roomId) {
    return __awaiter(this, void 0, void 0, function () {
        var directContent, _a, existing, current, next, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    directContent = null;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getAccountData(types_js_1.EventType.Direct)];
                case 2:
                    directContent = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _d.sent();
                    return [3 /*break*/, 4];
                case 4:
                    existing = directContent && !Array.isArray(directContent) ? directContent : {};
                    current = Array.isArray(existing[userId]) ? existing[userId] : [];
                    if (current[0] === roomId) {
                        return [2 /*return*/];
                    }
                    next = __spreadArray([roomId], current.filter(function (id) { return id !== roomId; }), true);
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, client.setAccountData(types_js_1.EventType.Direct, __assign(__assign({}, existing), (_c = {}, _c[userId] = next, _c)))];
                case 6:
                    _d.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _b = _d.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function resolveDirectRoomId(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var trimmed, cached, directContent, list, _a, fallbackRoom, rooms, _i, rooms_1, roomId, members, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    trimmed = userId.trim();
                    if (!trimmed.startsWith("@")) {
                        throw new Error("Matrix user IDs must be fully qualified (got \"".concat(trimmed, "\")"));
                    }
                    cached = directRoomCache.get(trimmed);
                    if (cached) {
                        return [2 /*return*/, cached];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getAccountData(types_js_1.EventType.Direct)];
                case 2:
                    directContent = _d.sent();
                    list = Array.isArray(directContent === null || directContent === void 0 ? void 0 : directContent[trimmed]) ? directContent[trimmed] : [];
                    if (list.length > 0) {
                        directRoomCache.set(trimmed, list[0]);
                        return [2 /*return*/, list[0]];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _d.sent();
                    return [3 /*break*/, 4];
                case 4:
                    fallbackRoom = null;
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 16, , 17]);
                    return [4 /*yield*/, client.getJoinedRooms()];
                case 6:
                    rooms = _d.sent();
                    _i = 0, rooms_1 = rooms;
                    _d.label = 7;
                case 7:
                    if (!(_i < rooms_1.length)) return [3 /*break*/, 15];
                    roomId = rooms_1[_i];
                    members = void 0;
                    _d.label = 8;
                case 8:
                    _d.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, client.getJoinedRoomMembers(roomId)];
                case 9:
                    members = _d.sent();
                    return [3 /*break*/, 11];
                case 10:
                    _b = _d.sent();
                    return [3 /*break*/, 14];
                case 11:
                    if (!members.includes(trimmed)) {
                        return [3 /*break*/, 14];
                    }
                    if (!(members.length === 2)) return [3 /*break*/, 13];
                    directRoomCache.set(trimmed, roomId);
                    return [4 /*yield*/, persistDirectRoom(client, trimmed, roomId)];
                case 12:
                    _d.sent();
                    return [2 /*return*/, roomId];
                case 13:
                    if (!fallbackRoom) {
                        fallbackRoom = roomId;
                    }
                    _d.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 7];
                case 15: return [3 /*break*/, 17];
                case 16:
                    _c = _d.sent();
                    return [3 /*break*/, 17];
                case 17:
                    if (!fallbackRoom) return [3 /*break*/, 19];
                    directRoomCache.set(trimmed, fallbackRoom);
                    return [4 /*yield*/, persistDirectRoom(client, trimmed, fallbackRoom)];
                case 18:
                    _d.sent();
                    return [2 /*return*/, fallbackRoom];
                case 19: throw new Error("No direct room found for ".concat(trimmed, " (m.direct missing)"));
            }
        });
    });
}
function resolveMatrixRoomId(client, raw) {
    return __awaiter(this, void 0, void 0, function () {
        var target, lowered, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    target = normalizeTarget(raw);
                    lowered = target.toLowerCase();
                    if (!lowered.startsWith("matrix:")) return [3 /*break*/, 2];
                    return [4 /*yield*/, resolveMatrixRoomId(client, target.slice("matrix:".length))];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!lowered.startsWith("room:")) return [3 /*break*/, 4];
                    return [4 /*yield*/, resolveMatrixRoomId(client, target.slice("room:".length))];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (!lowered.startsWith("channel:")) return [3 /*break*/, 6];
                    return [4 /*yield*/, resolveMatrixRoomId(client, target.slice("channel:".length))];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    if (!lowered.startsWith("user:")) return [3 /*break*/, 8];
                    return [4 /*yield*/, resolveDirectRoomId(client, target.slice("user:".length))];
                case 7: return [2 /*return*/, _a.sent()];
                case 8:
                    if (!target.startsWith("@")) return [3 /*break*/, 10];
                    return [4 /*yield*/, resolveDirectRoomId(client, target)];
                case 9: return [2 /*return*/, _a.sent()];
                case 10:
                    if (!target.startsWith("#")) return [3 /*break*/, 12];
                    return [4 /*yield*/, client.resolveRoom(target)];
                case 11:
                    resolved = _a.sent();
                    if (!resolved) {
                        throw new Error("Matrix alias ".concat(target, " could not be resolved"));
                    }
                    return [2 /*return*/, resolved];
                case 12: return [2 /*return*/, target];
            }
        });
    });
}
