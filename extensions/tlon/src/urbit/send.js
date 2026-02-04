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
exports.sendDm = sendDm;
exports.sendGroupMessage = sendGroupMessage;
exports.buildMediaText = buildMediaText;
var aura_1 = require("@urbit/aura");
function sendDm(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var story, sentAt, idUd, id, delta, action;
        var api = _b.api, fromShip = _b.fromShip, toShip = _b.toShip, text = _b.text;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    story = [{ inline: [text] }];
                    sentAt = Date.now();
                    idUd = (0, aura_1.scot)("ud", aura_1.da.fromUnix(sentAt));
                    id = "".concat(fromShip, "/").concat(idUd);
                    delta = {
                        add: {
                            memo: {
                                content: story,
                                author: fromShip,
                                sent: sentAt,
                            },
                            kind: null,
                            time: null,
                        },
                    };
                    action = {
                        ship: toShip,
                        diff: { id: id, delta: delta },
                    };
                    return [4 /*yield*/, api.poke({
                            app: "chat",
                            mark: "chat-dm-action",
                            json: action,
                        })];
                case 1:
                    _c.sent();
                    return [2 /*return*/, { channel: "tlon", messageId: id }];
            }
        });
    });
}
function sendGroupMessage(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var story, sentAt, formattedReplyId, action;
        var api = _b.api, fromShip = _b.fromShip, hostShip = _b.hostShip, channelName = _b.channelName, text = _b.text, replyToId = _b.replyToId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    story = [{ inline: [text] }];
                    sentAt = Date.now();
                    formattedReplyId = replyToId;
                    if (replyToId && /^\d+$/.test(replyToId)) {
                        try {
                            formattedReplyId = formatUd(BigInt(replyToId));
                        }
                        catch (_d) {
                            // Fall back to raw ID if formatting fails
                        }
                    }
                    action = {
                        channel: {
                            nest: "chat/".concat(hostShip, "/").concat(channelName),
                            action: formattedReplyId
                                ? {
                                    // Thread reply - needs post wrapper around reply action
                                    // ReplyActionAdd takes Memo: {content, author, sent} - no kind/blob/meta
                                    post: {
                                        reply: {
                                            id: formattedReplyId,
                                            action: {
                                                add: {
                                                    content: story,
                                                    author: fromShip,
                                                    sent: sentAt,
                                                },
                                            },
                                        },
                                    },
                                }
                                : {
                                    // Regular post
                                    post: {
                                        add: {
                                            content: story,
                                            author: fromShip,
                                            sent: sentAt,
                                            kind: "/chat",
                                            blob: null,
                                            meta: null,
                                        },
                                    },
                                },
                        },
                    };
                    return [4 /*yield*/, api.poke({
                            app: "channels",
                            mark: "channel-action-1",
                            json: action,
                        })];
                case 1:
                    _c.sent();
                    return [2 /*return*/, { channel: "tlon", messageId: "".concat(fromShip, "/").concat(sentAt) }];
            }
        });
    });
}
function buildMediaText(text, mediaUrl) {
    var _a, _b;
    var cleanText = (_a = text === null || text === void 0 ? void 0 : text.trim()) !== null && _a !== void 0 ? _a : "";
    var cleanUrl = (_b = mediaUrl === null || mediaUrl === void 0 ? void 0 : mediaUrl.trim()) !== null && _b !== void 0 ? _b : "";
    if (cleanText && cleanUrl) {
        return "".concat(cleanText, "\n").concat(cleanUrl);
    }
    if (cleanUrl) {
        return cleanUrl;
    }
    return cleanText;
}
