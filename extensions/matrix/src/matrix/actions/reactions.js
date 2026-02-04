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
exports.listMatrixReactions = listMatrixReactions;
exports.removeMatrixReactions = removeMatrixReactions;
var send_js_1 = require("../send.js");
var client_js_1 = require("./client.js");
var types_js_1 = require("./types.js");
function listMatrixReactions(roomId_1, messageId_1) {
    return __awaiter(this, arguments, void 0, function (roomId, messageId, opts) {
        var _a, client, stopOnDone, resolvedRoom, limit, res, summaries, _i, _b, event_1, content, key, sender, entry;
        var _c, _d, _e;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, client_js_1.resolveActionClient)(opts)];
                case 1:
                    _a = _f.sent(), client = _a.client, stopOnDone = _a.stopOnDone;
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, (0, send_js_1.resolveMatrixRoomId)(client, roomId)];
                case 3:
                    resolvedRoom = _f.sent();
                    limit = typeof opts.limit === "number" && Number.isFinite(opts.limit)
                        ? Math.max(1, Math.floor(opts.limit))
                        : 100;
                    return [4 /*yield*/, client.doRequest("GET", "/_matrix/client/v1/rooms/".concat(encodeURIComponent(resolvedRoom), "/relations/").concat(encodeURIComponent(messageId), "/").concat(types_js_1.RelationType.Annotation, "/").concat(types_js_1.EventType.Reaction), { dir: "b", limit: limit })];
                case 4:
                    res = (_f.sent());
                    summaries = new Map();
                    for (_i = 0, _b = res.chunk; _i < _b.length; _i++) {
                        event_1 = _b[_i];
                        content = event_1.content;
                        key = (_c = content["m.relates_to"]) === null || _c === void 0 ? void 0 : _c.key;
                        if (!key) {
                            continue;
                        }
                        sender = (_d = event_1.sender) !== null && _d !== void 0 ? _d : "";
                        entry = (_e = summaries.get(key)) !== null && _e !== void 0 ? _e : {
                            key: key,
                            count: 0,
                            users: [],
                        };
                        entry.count += 1;
                        if (sender && !entry.users.includes(sender)) {
                            entry.users.push(sender);
                        }
                        summaries.set(key, entry);
                    }
                    return [2 /*return*/, Array.from(summaries.values())];
                case 5:
                    if (stopOnDone) {
                        client.stop();
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function removeMatrixReactions(roomId_1, messageId_1) {
    return __awaiter(this, arguments, void 0, function (roomId, messageId, opts) {
        var _a, client, stopOnDone, resolvedRoom_1, res, userId_1, targetEmoji_1, toRemove;
        var _b;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, client_js_1.resolveActionClient)(opts)];
                case 1:
                    _a = _c.sent(), client = _a.client, stopOnDone = _a.stopOnDone;
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 7, 8]);
                    return [4 /*yield*/, (0, send_js_1.resolveMatrixRoomId)(client, roomId)];
                case 3:
                    resolvedRoom_1 = _c.sent();
                    return [4 /*yield*/, client.doRequest("GET", "/_matrix/client/v1/rooms/".concat(encodeURIComponent(resolvedRoom_1), "/relations/").concat(encodeURIComponent(messageId), "/").concat(types_js_1.RelationType.Annotation, "/").concat(types_js_1.EventType.Reaction), { dir: "b", limit: 200 })];
                case 4:
                    res = (_c.sent());
                    return [4 /*yield*/, client.getUserId()];
                case 5:
                    userId_1 = _c.sent();
                    if (!userId_1) {
                        return [2 /*return*/, { removed: 0 }];
                    }
                    targetEmoji_1 = (_b = opts.emoji) === null || _b === void 0 ? void 0 : _b.trim();
                    toRemove = res.chunk
                        .filter(function (event) { return event.sender === userId_1; })
                        .filter(function (event) {
                        var _a;
                        if (!targetEmoji_1) {
                            return true;
                        }
                        var content = event.content;
                        return ((_a = content["m.relates_to"]) === null || _a === void 0 ? void 0 : _a.key) === targetEmoji_1;
                    })
                        .map(function (event) { return event.event_id; })
                        .filter(function (id) { return Boolean(id); });
                    if (toRemove.length === 0) {
                        return [2 /*return*/, { removed: 0 }];
                    }
                    return [4 /*yield*/, Promise.all(toRemove.map(function (id) { return client.redactEvent(resolvedRoom_1, id); }))];
                case 6:
                    _c.sent();
                    return [2 /*return*/, { removed: toRemove.length }];
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
