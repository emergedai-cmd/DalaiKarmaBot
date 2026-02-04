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
exports.resolveChatGuidForTarget = resolveChatGuidForTarget;
exports.sendMessageBlueBubbles = sendMessageBlueBubbles;
var node_crypto_1 = require("node:crypto");
var accounts_js_1 = require("./accounts.js");
var targets_js_1 = require("./targets.js");
var types_js_1 = require("./types.js");
/** Maps short effect names to full Apple effect IDs */
var EFFECT_MAP = {
    // Bubble effects
    slam: "com.apple.MobileSMS.expressivesend.impact",
    loud: "com.apple.MobileSMS.expressivesend.loud",
    gentle: "com.apple.MobileSMS.expressivesend.gentle",
    invisible: "com.apple.MobileSMS.expressivesend.invisibleink",
    "invisible-ink": "com.apple.MobileSMS.expressivesend.invisibleink",
    "invisible ink": "com.apple.MobileSMS.expressivesend.invisibleink",
    invisibleink: "com.apple.MobileSMS.expressivesend.invisibleink",
    // Screen effects
    echo: "com.apple.messages.effect.CKEchoEffect",
    spotlight: "com.apple.messages.effect.CKSpotlightEffect",
    balloons: "com.apple.messages.effect.CKHappyBirthdayEffect",
    confetti: "com.apple.messages.effect.CKConfettiEffect",
    love: "com.apple.messages.effect.CKHeartEffect",
    heart: "com.apple.messages.effect.CKHeartEffect",
    hearts: "com.apple.messages.effect.CKHeartEffect",
    lasers: "com.apple.messages.effect.CKLasersEffect",
    fireworks: "com.apple.messages.effect.CKFireworksEffect",
    celebration: "com.apple.messages.effect.CKSparklesEffect",
};
function resolveEffectId(raw) {
    if (!raw) {
        return undefined;
    }
    var trimmed = raw.trim().toLowerCase();
    if (EFFECT_MAP[trimmed]) {
        return EFFECT_MAP[trimmed];
    }
    var normalized = trimmed.replace(/[\s_]+/g, "-");
    if (EFFECT_MAP[normalized]) {
        return EFFECT_MAP[normalized];
    }
    var compact = trimmed.replace(/[\s_-]+/g, "");
    if (EFFECT_MAP[compact]) {
        return EFFECT_MAP[compact];
    }
    return raw;
}
function resolveSendTarget(raw) {
    var parsed = (0, targets_js_1.parseBlueBubblesTarget)(raw);
    if (parsed.kind === "handle") {
        return {
            kind: "handle",
            address: (0, targets_js_1.normalizeBlueBubblesHandle)(parsed.to),
            service: parsed.service,
        };
    }
    if (parsed.kind === "chat_id") {
        return { kind: "chat_id", chatId: parsed.chatId };
    }
    if (parsed.kind === "chat_guid") {
        return { kind: "chat_guid", chatGuid: parsed.chatGuid };
    }
    return { kind: "chat_identifier", chatIdentifier: parsed.chatIdentifier };
}
function extractMessageId(payload) {
    if (!payload || typeof payload !== "object") {
        return "unknown";
    }
    var record = payload;
    var data = record.data && typeof record.data === "object"
        ? record.data
        : null;
    var candidates = [
        record.messageId,
        record.messageGuid,
        record.message_guid,
        record.guid,
        record.id,
        data === null || data === void 0 ? void 0 : data.messageId,
        data === null || data === void 0 ? void 0 : data.messageGuid,
        data === null || data === void 0 ? void 0 : data.message_guid,
        data === null || data === void 0 ? void 0 : data.message_id,
        data === null || data === void 0 ? void 0 : data.guid,
        data === null || data === void 0 ? void 0 : data.id,
    ];
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        if (typeof candidate === "string" && candidate.trim()) {
            return candidate.trim();
        }
        if (typeof candidate === "number" && Number.isFinite(candidate)) {
            return String(candidate);
        }
    }
    return "unknown";
}
function extractChatGuid(chat) {
    var candidates = [
        chat.chatGuid,
        chat.guid,
        chat.chat_guid,
        chat.identifier,
        chat.chatIdentifier,
        chat.chat_identifier,
    ];
    for (var _i = 0, candidates_2 = candidates; _i < candidates_2.length; _i++) {
        var candidate = candidates_2[_i];
        if (typeof candidate === "string" && candidate.trim()) {
            return candidate.trim();
        }
    }
    return null;
}
function extractChatId(chat) {
    var candidates = [chat.chatId, chat.id, chat.chat_id];
    for (var _i = 0, candidates_3 = candidates; _i < candidates_3.length; _i++) {
        var candidate = candidates_3[_i];
        if (typeof candidate === "number" && Number.isFinite(candidate)) {
            return candidate;
        }
    }
    return null;
}
function extractChatIdentifierFromChatGuid(chatGuid) {
    var _a;
    var parts = chatGuid.split(";");
    if (parts.length < 3) {
        return null;
    }
    var identifier = (_a = parts[2]) === null || _a === void 0 ? void 0 : _a.trim();
    return identifier ? identifier : null;
}
function extractParticipantAddresses(chat) {
    var _a, _b;
    var raw = (_b = (_a = (Array.isArray(chat.participants) ? chat.participants : null)) !== null && _a !== void 0 ? _a : (Array.isArray(chat.handles) ? chat.handles : null)) !== null && _b !== void 0 ? _b : (Array.isArray(chat.participantHandles) ? chat.participantHandles : null);
    if (!raw) {
        return [];
    }
    var out = [];
    for (var _i = 0, raw_1 = raw; _i < raw_1.length; _i++) {
        var entry = raw_1[_i];
        if (typeof entry === "string") {
            out.push(entry);
            continue;
        }
        if (entry && typeof entry === "object") {
            var record = entry;
            var candidate = (typeof record.address === "string" && record.address) ||
                (typeof record.handle === "string" && record.handle) ||
                (typeof record.id === "string" && record.id) ||
                (typeof record.identifier === "string" && record.identifier);
            if (candidate) {
                out.push(candidate);
            }
        }
    }
    return out;
}
function queryChats(params) {
    return __awaiter(this, void 0, void 0, function () {
        var url, res, payload, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: params.baseUrl,
                        path: "/api/v1/chat/query",
                        password: params.password,
                    });
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                limit: params.limit,
                                offset: params.offset,
                                with: ["participants"],
                            }),
                        }, params.timeoutMs)];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, res.json().catch(function () { return null; })];
                case 2:
                    payload = (_a.sent());
                    data = payload && typeof payload.data !== "undefined" ? payload.data : null;
                    return [2 /*return*/, Array.isArray(data) ? data : []];
            }
        });
    });
}
function resolveChatGuidForTarget(params) {
    return __awaiter(this, void 0, void 0, function () {
        var normalizedHandle, targetChatId, targetChatIdentifier, limit, participantMatch, offset, chats, _i, chats_1, chat, chatId, guid, guidIdentifier, identifier, guid, directHandle, isDmChat, participants;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (params.target.kind === "chat_guid") {
                        return [2 /*return*/, params.target.chatGuid];
                    }
                    normalizedHandle = params.target.kind === "handle" ? (0, targets_js_1.normalizeBlueBubblesHandle)(params.target.address) : "";
                    targetChatId = params.target.kind === "chat_id" ? params.target.chatId : null;
                    targetChatIdentifier = params.target.kind === "chat_identifier" ? params.target.chatIdentifier : null;
                    limit = 500;
                    participantMatch = null;
                    offset = 0;
                    _a.label = 1;
                case 1:
                    if (!(offset < 5000)) return [3 /*break*/, 4];
                    return [4 /*yield*/, queryChats({
                            baseUrl: params.baseUrl,
                            password: params.password,
                            timeoutMs: params.timeoutMs,
                            offset: offset,
                            limit: limit,
                        })];
                case 2:
                    chats = _a.sent();
                    if (chats.length === 0) {
                        return [3 /*break*/, 4];
                    }
                    for (_i = 0, chats_1 = chats; _i < chats_1.length; _i++) {
                        chat = chats_1[_i];
                        if (targetChatId != null) {
                            chatId = extractChatId(chat);
                            if (chatId != null && chatId === targetChatId) {
                                return [2 /*return*/, extractChatGuid(chat)];
                            }
                        }
                        if (targetChatIdentifier) {
                            guid = extractChatGuid(chat);
                            if (guid) {
                                // Back-compat: some callers might pass a full chat GUID.
                                if (guid === targetChatIdentifier) {
                                    return [2 /*return*/, guid];
                                }
                                guidIdentifier = extractChatIdentifierFromChatGuid(guid);
                                if (guidIdentifier && guidIdentifier === targetChatIdentifier) {
                                    return [2 /*return*/, guid];
                                }
                            }
                            identifier = typeof chat.identifier === "string"
                                ? chat.identifier
                                : typeof chat.chatIdentifier === "string"
                                    ? chat.chatIdentifier
                                    : typeof chat.chat_identifier === "string"
                                        ? chat.chat_identifier
                                        : "";
                            if (identifier && identifier === targetChatIdentifier) {
                                return [2 /*return*/, guid !== null && guid !== void 0 ? guid : extractChatGuid(chat)];
                            }
                        }
                        if (normalizedHandle) {
                            guid = extractChatGuid(chat);
                            directHandle = guid ? (0, targets_js_1.extractHandleFromChatGuid)(guid) : null;
                            if (directHandle && directHandle === normalizedHandle) {
                                return [2 /*return*/, guid];
                            }
                            if (!participantMatch && guid) {
                                isDmChat = guid.includes(";-;");
                                if (isDmChat) {
                                    participants = extractParticipantAddresses(chat).map(function (entry) {
                                        return (0, targets_js_1.normalizeBlueBubblesHandle)(entry);
                                    });
                                    if (participants.includes(normalizedHandle)) {
                                        participantMatch = guid;
                                    }
                                }
                            }
                        }
                    }
                    _a.label = 3;
                case 3:
                    offset += limit;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, participantMatch];
            }
        });
    });
}
/**
 * Creates a new chat (DM) and optionally sends an initial message.
 * Requires Private API to be enabled in BlueBubbles.
 */
function createNewChatWithMessage(params) {
    return __awaiter(this, void 0, void 0, function () {
        var url, payload, res, errorText, body, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: params.baseUrl,
                        path: "/api/v1/chat/new",
                        password: params.password,
                    });
                    payload = {
                        addresses: [params.address],
                        message: params.message,
                    };
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        }, params.timeoutMs)];
                case 1:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text()];
                case 2:
                    errorText = _a.sent();
                    // Check for Private API not enabled error
                    if (res.status === 400 ||
                        res.status === 403 ||
                        errorText.toLowerCase().includes("private api")) {
                        throw new Error("BlueBubbles send failed: Cannot create new chat - Private API must be enabled. Original error: ".concat(errorText || res.status));
                    }
                    throw new Error("BlueBubbles create chat failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 3: return [4 /*yield*/, res.text()];
                case 4:
                    body = _a.sent();
                    if (!body) {
                        return [2 /*return*/, { messageId: "ok" }];
                    }
                    try {
                        parsed = JSON.parse(body);
                        return [2 /*return*/, { messageId: extractMessageId(parsed) }];
                    }
                    catch (_b) {
                        return [2 /*return*/, { messageId: "ok" }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function sendMessageBlueBubbles(to_1, text_1) {
    return __awaiter(this, arguments, void 0, function (to, text, opts) {
        var trimmedText, account, baseUrl, password, target, chatGuid, effectId, needsPrivateApi, payload, url, res, errorText, body, parsed;
        var _a, _b, _c, _d, _e;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    trimmedText = text !== null && text !== void 0 ? text : "";
                    if (!trimmedText.trim()) {
                        throw new Error("BlueBubbles send requires text");
                    }
                    account = (0, accounts_js_1.resolveBlueBubblesAccount)({
                        cfg: (_a = opts.cfg) !== null && _a !== void 0 ? _a : {},
                        accountId: opts.accountId,
                    });
                    baseUrl = ((_b = opts.serverUrl) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = account.config.serverUrl) === null || _c === void 0 ? void 0 : _c.trim());
                    password = ((_d = opts.password) === null || _d === void 0 ? void 0 : _d.trim()) || ((_e = account.config.password) === null || _e === void 0 ? void 0 : _e.trim());
                    if (!baseUrl) {
                        throw new Error("BlueBubbles serverUrl is required");
                    }
                    if (!password) {
                        throw new Error("BlueBubbles password is required");
                    }
                    target = resolveSendTarget(to);
                    return [4 /*yield*/, resolveChatGuidForTarget({
                            baseUrl: baseUrl,
                            password: password,
                            timeoutMs: opts.timeoutMs,
                            target: target,
                        })];
                case 1:
                    chatGuid = _f.sent();
                    if (!chatGuid) {
                        // If target is a phone number/handle and no existing chat found,
                        // auto-create a new DM chat using the /api/v1/chat/new endpoint
                        if (target.kind === "handle") {
                            return [2 /*return*/, createNewChatWithMessage({
                                    baseUrl: baseUrl,
                                    password: password,
                                    address: target.address,
                                    message: trimmedText,
                                    timeoutMs: opts.timeoutMs,
                                })];
                        }
                        throw new Error("BlueBubbles send failed: chatGuid not found for target. Use a chat_guid target or ensure the chat exists.");
                    }
                    effectId = resolveEffectId(opts.effectId);
                    needsPrivateApi = Boolean(opts.replyToMessageGuid || effectId);
                    payload = {
                        chatGuid: chatGuid,
                        tempGuid: node_crypto_1.default.randomUUID(),
                        message: trimmedText,
                    };
                    if (needsPrivateApi) {
                        payload.method = "private-api";
                    }
                    // Add reply threading support
                    if (opts.replyToMessageGuid) {
                        payload.selectedMessageGuid = opts.replyToMessageGuid;
                        payload.partIndex = typeof opts.replyToPartIndex === "number" ? opts.replyToPartIndex : 0;
                    }
                    // Add message effects support
                    if (effectId) {
                        payload.effectId = effectId;
                    }
                    url = (0, types_js_1.buildBlueBubblesApiUrl)({
                        baseUrl: baseUrl,
                        path: "/api/v1/message/text",
                        password: password,
                    });
                    return [4 /*yield*/, (0, types_js_1.blueBubblesFetchWithTimeout)(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        }, opts.timeoutMs)];
                case 2:
                    res = _f.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text()];
                case 3:
                    errorText = _f.sent();
                    throw new Error("BlueBubbles send failed (".concat(res.status, "): ").concat(errorText || "unknown"));
                case 4: return [4 /*yield*/, res.text()];
                case 5:
                    body = _f.sent();
                    if (!body) {
                        return [2 /*return*/, { messageId: "ok" }];
                    }
                    try {
                        parsed = JSON.parse(body);
                        return [2 /*return*/, { messageId: extractMessageId(parsed) }];
                    }
                    catch (_g) {
                        return [2 /*return*/, { messageId: "ok" }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
