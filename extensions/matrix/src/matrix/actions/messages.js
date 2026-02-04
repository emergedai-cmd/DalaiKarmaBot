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
exports.sendMatrixMessage = sendMatrixMessage;
exports.editMatrixMessage = editMatrixMessage;
exports.deleteMatrixMessage = deleteMatrixMessage;
exports.readMatrixMessages = readMatrixMessages;
var send_js_1 = require("../send.js");
var client_js_1 = require("./client.js");
var summary_js_1 = require("./summary.js");
var types_js_1 = require("./types.js");
function sendMatrixMessage(to_1, content_1) {
    return __awaiter(this, arguments, void 0, function (to, content, opts) {
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, send_js_1.sendMessageMatrix)(to, content, {
                        mediaUrl: opts.mediaUrl,
                        replyToId: opts.replyToId,
                        threadId: opts.threadId,
                        client: opts.client,
                        timeoutMs: opts.timeoutMs,
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function editMatrixMessage(roomId_1, messageId_1, content_1) {
    return __awaiter(this, arguments, void 0, function (roomId, messageId, content, opts) {
        var trimmed, _a, client, stopOnDone, resolvedRoom, newContent, payload, eventId;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmed = content.trim();
                    if (!trimmed) {
                        throw new Error("Matrix edit requires content");
                    }
                    return [4 /*yield*/, (0, client_js_1.resolveActionClient)(opts)];
                case 1:
                    _a = _b.sent(), client = _a.client, stopOnDone = _a.stopOnDone;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, (0, send_js_1.resolveMatrixRoomId)(client, roomId)];
                case 3:
                    resolvedRoom = _b.sent();
                    newContent = {
                        msgtype: types_js_1.MsgType.Text,
                        body: trimmed,
                    };
                    payload = {
                        msgtype: types_js_1.MsgType.Text,
                        body: "* ".concat(trimmed),
                        "m.new_content": newContent,
                        "m.relates_to": {
                            rel_type: types_js_1.RelationType.Replace,
                            event_id: messageId,
                        },
                    };
                    return [4 /*yield*/, client.sendMessage(resolvedRoom, payload)];
                case 4:
                    eventId = _b.sent();
                    return [2 /*return*/, { eventId: eventId !== null && eventId !== void 0 ? eventId : null }];
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
function deleteMatrixMessage(roomId_1, messageId_1) {
    return __awaiter(this, arguments, void 0, function (roomId, messageId, opts) {
        var _a, client, stopOnDone, resolvedRoom;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, client_js_1.resolveActionClient)(opts)];
                case 1:
                    _a = _b.sent(), client = _a.client, stopOnDone = _a.stopOnDone;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, (0, send_js_1.resolveMatrixRoomId)(client, roomId)];
                case 3:
                    resolvedRoom = _b.sent();
                    return [4 /*yield*/, client.redactEvent(resolvedRoom, messageId, opts.reason)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
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
function readMatrixMessages(roomId_1) {
    return __awaiter(this, arguments, void 0, function (roomId, opts) {
        var _a, client, stopOnDone, resolvedRoom, limit, token, dir, res, messages;
        var _b, _c, _d, _e;
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
                        : 20;
                    token = ((_b = opts.before) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = opts.after) === null || _c === void 0 ? void 0 : _c.trim()) || undefined;
                    dir = opts.after ? "f" : "b";
                    return [4 /*yield*/, client.doRequest("GET", "/_matrix/client/v3/rooms/".concat(encodeURIComponent(resolvedRoom), "/messages"), {
                            dir: dir,
                            limit: limit,
                            from: token,
                        })];
                case 4:
                    res = (_f.sent());
                    messages = res.chunk
                        .filter(function (event) { return event.type === types_js_1.EventType.RoomMessage; })
                        .filter(function (event) { var _a; return !((_a = event.unsigned) === null || _a === void 0 ? void 0 : _a.redacted_because); })
                        .map(summary_js_1.summarizeMatrixRawEvent);
                    return [2 /*return*/, {
                            messages: messages,
                            nextBatch: (_d = res.end) !== null && _d !== void 0 ? _d : null,
                            prevBatch: (_e = res.start) !== null && _e !== void 0 ? _e : null,
                        }];
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
