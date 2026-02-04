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
exports.flushChatQueueForEvent = exports.CHAT_SESSIONS_ACTIVE_MINUTES = void 0;
exports.isChatBusy = isChatBusy;
exports.isChatStopCommand = isChatStopCommand;
exports.handleAbortChat = handleAbortChat;
exports.removeQueuedMessage = removeQueuedMessage;
exports.handleSendChat = handleSendChat;
exports.refreshChat = refreshChat;
exports.refreshChatAvatar = refreshChatAvatar;
var session_key_utils_js_1 = require("../../../src/sessions/session-key-utils.js");
var app_scroll_1 = require("./app-scroll");
var app_settings_1 = require("./app-settings");
var app_tool_stream_1 = require("./app-tool-stream");
var chat_1 = require("./controllers/chat");
var sessions_1 = require("./controllers/sessions");
var navigation_1 = require("./navigation");
var uuid_1 = require("./uuid");
exports.CHAT_SESSIONS_ACTIVE_MINUTES = 120;
function isChatBusy(host) {
    return host.chatSending || Boolean(host.chatRunId);
}
function isChatStopCommand(text) {
    var trimmed = text.trim();
    if (!trimmed) {
        return false;
    }
    var normalized = trimmed.toLowerCase();
    if (normalized === "/stop") {
        return true;
    }
    return (normalized === "stop" ||
        normalized === "esc" ||
        normalized === "abort" ||
        normalized === "wait" ||
        normalized === "exit");
}
function isChatResetCommand(text) {
    var trimmed = text.trim();
    if (!trimmed) {
        return false;
    }
    var normalized = trimmed.toLowerCase();
    if (normalized === "/new" || normalized === "/reset") {
        return true;
    }
    return normalized.startsWith("/new ") || normalized.startsWith("/reset ");
}
function handleAbortChat(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!host.connected) {
                        return [2 /*return*/];
                    }
                    host.chatMessage = "";
                    return [4 /*yield*/, (0, chat_1.abortChatRun)(host)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function enqueueChatMessage(host, text, attachments, refreshSessions) {
    var trimmed = text.trim();
    var hasAttachments = Boolean(attachments && attachments.length > 0);
    if (!trimmed && !hasAttachments) {
        return;
    }
    host.chatQueue = __spreadArray(__spreadArray([], host.chatQueue, true), [
        {
            id: (0, uuid_1.generateUUID)(),
            text: trimmed,
            createdAt: Date.now(),
            attachments: hasAttachments ? attachments === null || attachments === void 0 ? void 0 : attachments.map(function (att) { return (__assign({}, att)); }) : undefined,
            refreshSessions: refreshSessions,
        },
    ], false);
}
function sendChatMessageNow(host, message, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var runId, ok;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, app_tool_stream_1.resetToolStream)(host);
                    return [4 /*yield*/, (0, chat_1.sendChatMessage)(host, message, opts === null || opts === void 0 ? void 0 : opts.attachments)];
                case 1:
                    runId = _c.sent();
                    ok = Boolean(runId);
                    if (!ok && (opts === null || opts === void 0 ? void 0 : opts.previousDraft) != null) {
                        host.chatMessage = opts.previousDraft;
                    }
                    if (!ok && (opts === null || opts === void 0 ? void 0 : opts.previousAttachments)) {
                        host.chatAttachments = opts.previousAttachments;
                    }
                    if (ok) {
                        (0, app_settings_1.setLastActiveSessionKey)(host, host.sessionKey);
                    }
                    if (ok && (opts === null || opts === void 0 ? void 0 : opts.restoreDraft) && ((_a = opts.previousDraft) === null || _a === void 0 ? void 0 : _a.trim())) {
                        host.chatMessage = opts.previousDraft;
                    }
                    if (ok && (opts === null || opts === void 0 ? void 0 : opts.restoreAttachments) && ((_b = opts.previousAttachments) === null || _b === void 0 ? void 0 : _b.length)) {
                        host.chatAttachments = opts.previousAttachments;
                    }
                    (0, app_scroll_1.scheduleChatScroll)(host);
                    if (ok && !host.chatRunId) {
                        void flushChatQueue(host);
                    }
                    if (ok && (opts === null || opts === void 0 ? void 0 : opts.refreshSessions) && runId) {
                        host.refreshSessionsAfterChat.add(runId);
                    }
                    return [2 /*return*/, ok];
            }
        });
    });
}
function flushChatQueue(host) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, next, rest, ok;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!host.connected || isChatBusy(host)) {
                        return [2 /*return*/];
                    }
                    _a = host.chatQueue, next = _a[0], rest = _a.slice(1);
                    if (!next) {
                        return [2 /*return*/];
                    }
                    host.chatQueue = rest;
                    return [4 /*yield*/, sendChatMessageNow(host, next.text, {
                            attachments: next.attachments,
                            refreshSessions: next.refreshSessions,
                        })];
                case 1:
                    ok = _b.sent();
                    if (!ok) {
                        host.chatQueue = __spreadArray([next], host.chatQueue, true);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function removeQueuedMessage(host, id) {
    host.chatQueue = host.chatQueue.filter(function (item) { return item.id !== id; });
}
function handleSendChat(host, messageOverride, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var previousDraft, message, attachments, attachmentsToSend, hasAttachments, refreshSessions;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!host.connected) {
                        return [2 /*return*/];
                    }
                    previousDraft = host.chatMessage;
                    message = (messageOverride !== null && messageOverride !== void 0 ? messageOverride : host.chatMessage).trim();
                    attachments = (_a = host.chatAttachments) !== null && _a !== void 0 ? _a : [];
                    attachmentsToSend = messageOverride == null ? attachments : [];
                    hasAttachments = attachmentsToSend.length > 0;
                    // Allow sending with just attachments (no message text required)
                    if (!message && !hasAttachments) {
                        return [2 /*return*/];
                    }
                    if (!isChatStopCommand(message)) return [3 /*break*/, 2];
                    return [4 /*yield*/, handleAbortChat(host)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
                case 2:
                    refreshSessions = isChatResetCommand(message);
                    if (messageOverride == null) {
                        host.chatMessage = "";
                        // Clear attachments when sending
                        host.chatAttachments = [];
                    }
                    if (isChatBusy(host)) {
                        enqueueChatMessage(host, message, attachmentsToSend, refreshSessions);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, sendChatMessageNow(host, message, {
                            previousDraft: messageOverride == null ? previousDraft : undefined,
                            restoreDraft: Boolean(messageOverride && (opts === null || opts === void 0 ? void 0 : opts.restoreDraft)),
                            attachments: hasAttachments ? attachmentsToSend : undefined,
                            previousAttachments: messageOverride == null ? attachments : undefined,
                            restoreAttachments: Boolean(messageOverride && (opts === null || opts === void 0 ? void 0 : opts.restoreDraft)),
                            refreshSessions: refreshSessions,
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function refreshChat(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, chat_1.loadChatHistory)(host),
                        (0, sessions_1.loadSessions)(host, {
                            activeMinutes: exports.CHAT_SESSIONS_ACTIVE_MINUTES,
                        }),
                        refreshChatAvatar(host),
                    ])];
                case 1:
                    _a.sent();
                    (0, app_scroll_1.scheduleChatScroll)(host);
                    return [2 /*return*/];
            }
        });
    });
}
exports.flushChatQueueForEvent = flushChatQueue;
function resolveAgentIdForSession(host) {
    var _a, _b, _c;
    var parsed = (0, session_key_utils_js_1.parseAgentSessionKey)(host.sessionKey);
    if (parsed === null || parsed === void 0 ? void 0 : parsed.agentId) {
        return parsed.agentId;
    }
    var snapshot = (_a = host.hello) === null || _a === void 0 ? void 0 : _a.snapshot;
    var fallback = (_c = (_b = snapshot === null || snapshot === void 0 ? void 0 : snapshot.sessionDefaults) === null || _b === void 0 ? void 0 : _b.defaultAgentId) === null || _c === void 0 ? void 0 : _c.trim();
    return fallback || "main";
}
function buildAvatarMetaUrl(basePath, agentId) {
    var base = (0, navigation_1.normalizeBasePath)(basePath);
    var encoded = encodeURIComponent(agentId);
    return base ? "".concat(base, "/avatar/").concat(encoded, "?meta=1") : "/avatar/".concat(encoded, "?meta=1");
}
function refreshChatAvatar(host) {
    return __awaiter(this, void 0, void 0, function () {
        var agentId, url, res, data, avatarUrl, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!host.connected) {
                        host.chatAvatarUrl = null;
                        return [2 /*return*/];
                    }
                    agentId = resolveAgentIdForSession(host);
                    if (!agentId) {
                        host.chatAvatarUrl = null;
                        return [2 /*return*/];
                    }
                    host.chatAvatarUrl = null;
                    url = buildAvatarMetaUrl(host.basePath, agentId);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, { method: "GET" })];
                case 2:
                    res = _b.sent();
                    if (!res.ok) {
                        host.chatAvatarUrl = null;
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = (_b.sent());
                    avatarUrl = typeof data.avatarUrl === "string" ? data.avatarUrl.trim() : "";
                    host.chatAvatarUrl = avatarUrl || null;
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    host.chatAvatarUrl = null;
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
