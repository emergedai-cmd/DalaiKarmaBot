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
exports.loadChatHistory = loadChatHistory;
exports.sendChatMessage = sendChatMessage;
exports.abortChatRun = abortChatRun;
exports.handleChatEvent = handleChatEvent;
var message_extract_1 = require("../chat/message-extract");
var uuid_1 = require("../uuid");
function loadChatHistory(state) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    state.chatLoading = true;
                    state.lastError = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, state.client.request("chat.history", {
                            sessionKey: state.sessionKey,
                            limit: 200,
                        })];
                case 2:
                    res = _b.sent();
                    state.chatMessages = Array.isArray(res.messages) ? res.messages : [];
                    state.chatThinkingLevel = (_a = res.thinkingLevel) !== null && _a !== void 0 ? _a : null;
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _b.sent();
                    state.lastError = String(err_1);
                    return [3 /*break*/, 5];
                case 4:
                    state.chatLoading = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function dataUrlToBase64(dataUrl) {
    var match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
        return null;
    }
    return { mimeType: match[1], content: match[2] };
}
function sendChatMessage(state, message, attachments) {
    return __awaiter(this, void 0, void 0, function () {
        var msg, hasAttachments, now, contentBlocks, _i, attachments_1, att, runId, apiAttachments, err_2, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/, null];
                    }
                    msg = message.trim();
                    hasAttachments = attachments && attachments.length > 0;
                    if (!msg && !hasAttachments) {
                        return [2 /*return*/, null];
                    }
                    now = Date.now();
                    contentBlocks = [];
                    if (msg) {
                        contentBlocks.push({ type: "text", text: msg });
                    }
                    // Add image previews to the message for display
                    if (hasAttachments) {
                        for (_i = 0, attachments_1 = attachments; _i < attachments_1.length; _i++) {
                            att = attachments_1[_i];
                            contentBlocks.push({
                                type: "image",
                                source: { type: "base64", media_type: att.mimeType, data: att.dataUrl },
                            });
                        }
                    }
                    state.chatMessages = __spreadArray(__spreadArray([], state.chatMessages, true), [
                        {
                            role: "user",
                            content: contentBlocks,
                            timestamp: now,
                        },
                    ], false);
                    state.chatSending = true;
                    state.lastError = null;
                    runId = (0, uuid_1.generateUUID)();
                    state.chatRunId = runId;
                    state.chatStream = "";
                    state.chatStreamStartedAt = now;
                    apiAttachments = hasAttachments
                        ? attachments
                            .map(function (att) {
                            var parsed = dataUrlToBase64(att.dataUrl);
                            if (!parsed) {
                                return null;
                            }
                            return {
                                type: "image",
                                mimeType: parsed.mimeType,
                                content: parsed.content,
                            };
                        })
                            .filter(function (a) { return a !== null; })
                        : undefined;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, state.client.request("chat.send", {
                            sessionKey: state.sessionKey,
                            message: msg,
                            deliver: false,
                            idempotencyKey: runId,
                            attachments: apiAttachments,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, runId];
                case 3:
                    err_2 = _a.sent();
                    error = String(err_2);
                    state.chatRunId = null;
                    state.chatStream = null;
                    state.chatStreamStartedAt = null;
                    state.lastError = error;
                    state.chatMessages = __spreadArray(__spreadArray([], state.chatMessages, true), [
                        {
                            role: "assistant",
                            content: [{ type: "text", text: "Error: " + error }],
                            timestamp: Date.now(),
                        },
                    ], false);
                    return [2 /*return*/, null];
                case 4:
                    state.chatSending = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function abortChatRun(state) {
    return __awaiter(this, void 0, void 0, function () {
        var runId, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/, false];
                    }
                    runId = state.chatRunId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, state.client.request("chat.abort", runId ? { sessionKey: state.sessionKey, runId: runId } : { sessionKey: state.sessionKey })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    err_3 = _a.sent();
                    state.lastError = String(err_3);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function handleChatEvent(state, payload) {
    var _a, _b;
    if (!payload) {
        return null;
    }
    if (payload.sessionKey !== state.sessionKey) {
        return null;
    }
    // Final from another run (e.g. sub-agent announce): refresh history to show new message.
    // See https://github.com/openclaw/openclaw/issues/1909
    if (payload.runId && state.chatRunId && payload.runId !== state.chatRunId) {
        if (payload.state === "final") {
            return "final";
        }
        return null;
    }
    if (payload.state === "delta") {
        var next = (0, message_extract_1.extractText)(payload.message);
        if (typeof next === "string") {
            var current = (_a = state.chatStream) !== null && _a !== void 0 ? _a : "";
            if (!current || next.length >= current.length) {
                state.chatStream = next;
            }
        }
    }
    else if (payload.state === "final") {
        state.chatStream = null;
        state.chatRunId = null;
        state.chatStreamStartedAt = null;
    }
    else if (payload.state === "aborted") {
        state.chatStream = null;
        state.chatRunId = null;
        state.chatStreamStartedAt = null;
    }
    else if (payload.state === "error") {
        state.chatStream = null;
        state.chatRunId = null;
        state.chatStreamStartedAt = null;
        state.lastError = (_b = payload.errorMessage) !== null && _b !== void 0 ? _b : "chat error";
    }
    return payload.state;
}
