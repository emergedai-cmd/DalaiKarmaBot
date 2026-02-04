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
var vitest_1 = require("vitest");
var reply_chunks_js_1 = require("./reply-chunks.js");
(0, vitest_1.describe)("sendLineReplyChunks", function () {
    (0, vitest_1.it)("uses reply token for all chunks when possible", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replyMessageLine, pushMessageLine, pushTextMessageWithQuickReplies, createTextMessageWithQuickReplies, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    replyMessageLine = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({})];
                    }); }); });
                    pushMessageLine = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({})];
                    }); }); });
                    pushTextMessageWithQuickReplies = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({})];
                    }); }); });
                    createTextMessageWithQuickReplies = vitest_1.vi.fn(function (text, _quickReplies) { return ({
                        type: "text",
                        text: text,
                    }); });
                    return [4 /*yield*/, (0, reply_chunks_js_1.sendLineReplyChunks)({
                            to: "line:group:1",
                            chunks: ["one", "two", "three"],
                            quickReplies: ["A", "B"],
                            replyToken: "token",
                            replyTokenUsed: false,
                            accountId: "default",
                            replyMessageLine: replyMessageLine,
                            pushMessageLine: pushMessageLine,
                            pushTextMessageWithQuickReplies: pushTextMessageWithQuickReplies,
                            createTextMessageWithQuickReplies: createTextMessageWithQuickReplies,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.replyTokenUsed).toBe(true);
                    (0, vitest_1.expect)(replyMessageLine).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(createTextMessageWithQuickReplies).toHaveBeenCalledWith("three", ["A", "B"]);
                    (0, vitest_1.expect)(replyMessageLine).toHaveBeenCalledWith("token", [
                        { type: "text", text: "one" },
                        { type: "text", text: "two" },
                        { type: "text", text: "three" },
                    ], { accountId: "default" });
                    (0, vitest_1.expect)(pushMessageLine).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(pushTextMessageWithQuickReplies).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("attaches quick replies to a single reply chunk", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replyMessageLine, pushMessageLine, pushTextMessageWithQuickReplies, createTextMessageWithQuickReplies, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    replyMessageLine = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({})];
                    }); }); });
                    pushMessageLine = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({})];
                    }); }); });
                    pushTextMessageWithQuickReplies = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({})];
                    }); }); });
                    createTextMessageWithQuickReplies = vitest_1.vi.fn(function (text, _quickReplies) { return ({
                        type: "text",
                        text: text,
                        quickReply: { items: [] },
                    }); });
                    return [4 /*yield*/, (0, reply_chunks_js_1.sendLineReplyChunks)({
                            to: "line:user:1",
                            chunks: ["only"],
                            quickReplies: ["A"],
                            replyToken: "token",
                            replyTokenUsed: false,
                            replyMessageLine: replyMessageLine,
                            pushMessageLine: pushMessageLine,
                            pushTextMessageWithQuickReplies: pushTextMessageWithQuickReplies,
                            createTextMessageWithQuickReplies: createTextMessageWithQuickReplies,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.replyTokenUsed).toBe(true);
                    (0, vitest_1.expect)(createTextMessageWithQuickReplies).toHaveBeenCalledWith("only", ["A"]);
                    (0, vitest_1.expect)(replyMessageLine).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(pushMessageLine).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(pushTextMessageWithQuickReplies).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("replies with up to five chunks before pushing the rest", function () { return __awaiter(void 0, void 0, void 0, function () {
        var replyMessageLine, pushMessageLine, pushTextMessageWithQuickReplies, createTextMessageWithQuickReplies, chunks, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    replyMessageLine = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({})];
                    }); }); });
                    pushMessageLine = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({})];
                    }); }); });
                    pushTextMessageWithQuickReplies = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({})];
                    }); }); });
                    createTextMessageWithQuickReplies = vitest_1.vi.fn(function (text, _quickReplies) { return ({
                        type: "text",
                        text: text,
                    }); });
                    chunks = ["1", "2", "3", "4", "5", "6", "7"];
                    return [4 /*yield*/, (0, reply_chunks_js_1.sendLineReplyChunks)({
                            to: "line:group:1",
                            chunks: chunks,
                            quickReplies: ["A"],
                            replyToken: "token",
                            replyTokenUsed: false,
                            replyMessageLine: replyMessageLine,
                            pushMessageLine: pushMessageLine,
                            pushTextMessageWithQuickReplies: pushTextMessageWithQuickReplies,
                            createTextMessageWithQuickReplies: createTextMessageWithQuickReplies,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.replyTokenUsed).toBe(true);
                    (0, vitest_1.expect)(replyMessageLine).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(replyMessageLine).toHaveBeenCalledWith("token", [
                        { type: "text", text: "1" },
                        { type: "text", text: "2" },
                        { type: "text", text: "3" },
                        { type: "text", text: "4" },
                        { type: "text", text: "5" },
                    ], { accountId: undefined });
                    (0, vitest_1.expect)(pushMessageLine).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(pushMessageLine).toHaveBeenCalledWith("line:group:1", "6", { accountId: undefined });
                    (0, vitest_1.expect)(pushTextMessageWithQuickReplies).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(pushTextMessageWithQuickReplies).toHaveBeenCalledWith("line:group:1", "7", ["A"], {
                        accountId: undefined,
                    });
                    (0, vitest_1.expect)(createTextMessageWithQuickReplies).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
