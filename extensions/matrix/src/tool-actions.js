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
exports.handleMatrixAction = handleMatrixAction;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var actions_js_1 = require("./matrix/actions.js");
var send_js_1 = require("./matrix/send.js");
var messageActions = new Set(["sendMessage", "editMessage", "deleteMessage", "readMessages"]);
var reactionActions = new Set(["react", "reactions"]);
var pinActions = new Set(["pinMessage", "unpinMessage", "listPins"]);
function readRoomId(params, required) {
    var _a, _b;
    if (required === void 0) { required = true; }
    var direct = (_a = (0, plugin_sdk_1.readStringParam)(params, "roomId")) !== null && _a !== void 0 ? _a : (0, plugin_sdk_1.readStringParam)(params, "channelId");
    if (direct) {
        return direct;
    }
    if (!required) {
        return (_b = (0, plugin_sdk_1.readStringParam)(params, "to")) !== null && _b !== void 0 ? _b : "";
    }
    return (0, plugin_sdk_1.readStringParam)(params, "to", { required: true });
}
function handleMatrixAction(params, cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var action, isActionEnabled, roomId, messageId, _a, emoji, remove, isEmpty, result, reactions, _b, to, content, mediaUrl, replyToId, threadId, result, roomId, messageId, content, result, roomId, messageId, reason, roomId, limit, before, after, result, roomId, messageId, result_1, messageId, result_2, result, userId, roomId, result, roomId, result;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    action = (0, plugin_sdk_1.readStringParam)(params, "action", { required: true });
                    isActionEnabled = (0, plugin_sdk_1.createActionGate)((_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.matrix) === null || _d === void 0 ? void 0 : _d.actions);
                    if (!reactionActions.has(action)) return [3 /*break*/, 6];
                    if (!isActionEnabled("reactions")) {
                        throw new Error("Matrix reactions are disabled.");
                    }
                    roomId = readRoomId(params);
                    messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", { required: true });
                    if (!(action === "react")) return [3 /*break*/, 4];
                    _a = (0, plugin_sdk_1.readReactionParams)(params, {
                        removeErrorMessage: "Emoji is required to remove a Matrix reaction.",
                    }), emoji = _a.emoji, remove = _a.remove, isEmpty = _a.isEmpty;
                    if (!(remove || isEmpty)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, actions_js_1.removeMatrixReactions)(roomId, messageId, {
                            emoji: remove ? emoji : undefined,
                        })];
                case 1:
                    result = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, removed: result.removed })];
                case 2: return [4 /*yield*/, (0, send_js_1.reactMatrixMessage)(roomId, messageId, emoji)];
                case 3:
                    _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, added: emoji })];
                case 4: return [4 /*yield*/, (0, actions_js_1.listMatrixReactions)(roomId, messageId)];
                case 5:
                    reactions = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, reactions: reactions })];
                case 6:
                    if (!messageActions.has(action)) return [3 /*break*/, 16];
                    if (!isActionEnabled("messages")) {
                        throw new Error("Matrix messages are disabled.");
                    }
                    _b = action;
                    switch (_b) {
                        case "sendMessage": return [3 /*break*/, 7];
                        case "editMessage": return [3 /*break*/, 9];
                        case "deleteMessage": return [3 /*break*/, 11];
                        case "readMessages": return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 15];
                case 7:
                    to = (0, plugin_sdk_1.readStringParam)(params, "to", { required: true });
                    content = (0, plugin_sdk_1.readStringParam)(params, "content", {
                        required: true,
                        allowEmpty: true,
                    });
                    mediaUrl = (0, plugin_sdk_1.readStringParam)(params, "mediaUrl");
                    replyToId = (_e = (0, plugin_sdk_1.readStringParam)(params, "replyToId")) !== null && _e !== void 0 ? _e : (0, plugin_sdk_1.readStringParam)(params, "replyTo");
                    threadId = (0, plugin_sdk_1.readStringParam)(params, "threadId");
                    return [4 /*yield*/, (0, actions_js_1.sendMatrixMessage)(to, content, {
                            mediaUrl: mediaUrl !== null && mediaUrl !== void 0 ? mediaUrl : undefined,
                            replyToId: replyToId !== null && replyToId !== void 0 ? replyToId : undefined,
                            threadId: threadId !== null && threadId !== void 0 ? threadId : undefined,
                        })];
                case 8:
                    result = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, result: result })];
                case 9:
                    roomId = readRoomId(params);
                    messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", { required: true });
                    content = (0, plugin_sdk_1.readStringParam)(params, "content", { required: true });
                    return [4 /*yield*/, (0, actions_js_1.editMatrixMessage)(roomId, messageId, content)];
                case 10:
                    result = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, result: result })];
                case 11:
                    roomId = readRoomId(params);
                    messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", { required: true });
                    reason = (0, plugin_sdk_1.readStringParam)(params, "reason");
                    return [4 /*yield*/, (0, actions_js_1.deleteMatrixMessage)(roomId, messageId, { reason: reason !== null && reason !== void 0 ? reason : undefined })];
                case 12:
                    _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, deleted: true })];
                case 13:
                    roomId = readRoomId(params);
                    limit = (0, plugin_sdk_1.readNumberParam)(params, "limit", { integer: true });
                    before = (0, plugin_sdk_1.readStringParam)(params, "before");
                    after = (0, plugin_sdk_1.readStringParam)(params, "after");
                    return [4 /*yield*/, (0, actions_js_1.readMatrixMessages)(roomId, {
                            limit: limit !== null && limit !== void 0 ? limit : undefined,
                            before: before !== null && before !== void 0 ? before : undefined,
                            after: after !== null && after !== void 0 ? after : undefined,
                        })];
                case 14:
                    result = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)(__assign({ ok: true }, result))];
                case 15: return [3 /*break*/, 16];
                case 16:
                    if (!pinActions.has(action)) return [3 /*break*/, 22];
                    if (!isActionEnabled("pins")) {
                        throw new Error("Matrix pins are disabled.");
                    }
                    roomId = readRoomId(params);
                    if (!(action === "pinMessage")) return [3 /*break*/, 18];
                    messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", { required: true });
                    return [4 /*yield*/, (0, actions_js_1.pinMatrixMessage)(roomId, messageId)];
                case 17:
                    result_1 = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, pinned: result_1.pinned })];
                case 18:
                    if (!(action === "unpinMessage")) return [3 /*break*/, 20];
                    messageId = (0, plugin_sdk_1.readStringParam)(params, "messageId", { required: true });
                    return [4 /*yield*/, (0, actions_js_1.unpinMatrixMessage)(roomId, messageId)];
                case 19:
                    result_2 = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, pinned: result_2.pinned })];
                case 20: return [4 /*yield*/, (0, actions_js_1.listMatrixPins)(roomId)];
                case 21:
                    result = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, pinned: result.pinned, events: result.events })];
                case 22:
                    if (!(action === "memberInfo")) return [3 /*break*/, 24];
                    if (!isActionEnabled("memberInfo")) {
                        throw new Error("Matrix member info is disabled.");
                    }
                    userId = (0, plugin_sdk_1.readStringParam)(params, "userId", { required: true });
                    roomId = (_f = (0, plugin_sdk_1.readStringParam)(params, "roomId")) !== null && _f !== void 0 ? _f : (0, plugin_sdk_1.readStringParam)(params, "channelId");
                    return [4 /*yield*/, (0, actions_js_1.getMatrixMemberInfo)(userId, {
                            roomId: roomId !== null && roomId !== void 0 ? roomId : undefined,
                        })];
                case 23:
                    result = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, member: result })];
                case 24:
                    if (!(action === "channelInfo")) return [3 /*break*/, 26];
                    if (!isActionEnabled("channelInfo")) {
                        throw new Error("Matrix room info is disabled.");
                    }
                    roomId = readRoomId(params);
                    return [4 /*yield*/, (0, actions_js_1.getMatrixRoomInfo)(roomId)];
                case 25:
                    result = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, room: result })];
                case 26: throw new Error("Unsupported Matrix action: ".concat(action));
            }
        });
    });
}
