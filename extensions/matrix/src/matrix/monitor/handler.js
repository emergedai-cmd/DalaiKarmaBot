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
exports.createMatrixRoomMessageHandler = createMatrixRoomMessageHandler;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var poll_types_js_1 = require("../poll-types.js");
var send_js_1 = require("../send.js");
var allowlist_js_1 = require("./allowlist.js");
var location_js_1 = require("./location.js");
var media_js_1 = require("./media.js");
var mentions_js_1 = require("./mentions.js");
var replies_js_1 = require("./replies.js");
var rooms_js_1 = require("./rooms.js");
var threads_js_1 = require("./threads.js");
var types_js_1 = require("./types.js");
function createMatrixRoomMessageHandler(params) {
    var _this = this;
    var client = params.client, core = params.core, cfg = params.cfg, runtime = params.runtime, logger = params.logger, logVerboseMessage = params.logVerboseMessage, allowFrom = params.allowFrom, roomsConfig = params.roomsConfig, mentionRegexes = params.mentionRegexes, groupPolicy = params.groupPolicy, replyToMode = params.replyToMode, threadReplies = params.threadReplies, dmEnabled = params.dmEnabled, dmPolicy = params.dmPolicy, textLimit = params.textLimit, mediaMaxBytes = params.mediaMaxBytes, startupMs = params.startupMs, startupGraceMs = params.startupGraceMs, directTracker = params.directTracker, getRoomInfo = params.getRoomInfo, getMemberDisplayName = params.getMemberDisplayName;
    return function (roomId, event) { return __awaiter(_this, void 0, void 0, function () {
        var eventType, isPollEvent, locationContent, isLocationEvent, senderId, selfUserId, eventTs, eventAge, roomInfo, roomName, roomAliases, content, pollStartContent, pollSummary, senderDisplayName, pollText, locationPayload, relates, isDirectMessage_1, isRoom_1, roomConfigInfo, roomConfig, roomMatchMeta, senderName, storeAllowFrom, effectiveAllowFrom, groupAllowFrom, effectiveGroupAllowFrom, groupAllowConfigured, allowMatch, allowMatchMeta, _a, code, created, err_1, roomUsers, userMatch, groupAllowMatch, rawBody, media, contentUrl, contentFile, mediaUrl, contentInfo, contentType, contentSize, err_2, bodyText, _b, wasMentioned_1, hasExplicitMention, allowTextCommands, useAccessGroups, senderAllowedForCommands, senderAllowedForGroup, senderAllowedForRoomUsers, hasControlCommandInMessage, commandGate, commandAuthorized, shouldRequireMention_1, shouldBypassMention_1, canDetectMention_1, messageId_1, replyToEventId, threadRootId, threadTarget_1, route_1, envelopeFrom, textWithId, storePath_1, envelopeOptions, previousTimestamp, body, groupSystemPrompt, ctxPayload_1, preview, ackReaction_1, ackScope_1, shouldAckReaction, replyTarget, didSendReply_1, tableMode_1, prefixContext, typingCallbacks, _c, dispatcher, replyOptions, markDispatchIdle, _d, queuedFinal, counts, finalCount, previewText, err_3;
        var _this = this;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        return __generator(this, function (_7) {
            switch (_7.label) {
                case 0:
                    _7.trys.push([0, 21, , 22]);
                    eventType = event.type;
                    if (eventType === types_js_1.EventType.RoomMessageEncrypted) {
                        // Encrypted messages are decrypted automatically by @vector-im/matrix-bot-sdk with crypto enabled
                        return [2 /*return*/];
                    }
                    isPollEvent = (0, poll_types_js_1.isPollStartType)(eventType);
                    locationContent = event.content;
                    isLocationEvent = eventType === types_js_1.EventType.Location ||
                        (eventType === types_js_1.EventType.RoomMessage && locationContent.msgtype === types_js_1.EventType.Location);
                    if (eventType !== types_js_1.EventType.RoomMessage && !isPollEvent && !isLocationEvent) {
                        return [2 /*return*/];
                    }
                    logVerboseMessage("matrix: room.message recv room=".concat(roomId, " type=").concat(eventType, " id=").concat((_e = event.event_id) !== null && _e !== void 0 ? _e : "unknown"));
                    if ((_f = event.unsigned) === null || _f === void 0 ? void 0 : _f.redacted_because) {
                        return [2 /*return*/];
                    }
                    senderId = event.sender;
                    if (!senderId) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, client.getUserId()];
                case 1:
                    selfUserId = _7.sent();
                    if (senderId === selfUserId) {
                        return [2 /*return*/];
                    }
                    eventTs = event.origin_server_ts;
                    eventAge = (_g = event.unsigned) === null || _g === void 0 ? void 0 : _g.age;
                    if (typeof eventTs === "number" && eventTs < startupMs - startupGraceMs) {
                        return [2 /*return*/];
                    }
                    if (typeof eventTs !== "number" &&
                        typeof eventAge === "number" &&
                        eventAge > startupGraceMs) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getRoomInfo(roomId)];
                case 2:
                    roomInfo = _7.sent();
                    roomName = roomInfo.name;
                    roomAliases = __spreadArray([(_h = roomInfo.canonicalAlias) !== null && _h !== void 0 ? _h : ""], roomInfo.altAliases, true).filter(Boolean);
                    content = event.content;
                    if (!isPollEvent) return [3 /*break*/, 5];
                    pollStartContent = event.content;
                    pollSummary = (0, poll_types_js_1.parsePollStartContent)(pollStartContent);
                    if (!pollSummary) return [3 /*break*/, 4];
                    pollSummary.eventId = (_j = event.event_id) !== null && _j !== void 0 ? _j : "";
                    pollSummary.roomId = roomId;
                    pollSummary.sender = senderId;
                    return [4 /*yield*/, getMemberDisplayName(roomId, senderId)];
                case 3:
                    senderDisplayName = _7.sent();
                    pollSummary.senderName = senderDisplayName;
                    pollText = (0, poll_types_js_1.formatPollAsText)(pollSummary);
                    content = {
                        msgtype: "m.text",
                        body: pollText,
                    };
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/];
                case 5:
                    locationPayload = (0, location_js_1.resolveMatrixLocation)({
                        eventType: eventType,
                        content: content,
                    });
                    relates = content["m.relates_to"];
                    if (relates && "rel_type" in relates) {
                        if (relates.rel_type === types_js_1.RelationType.Replace) {
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, directTracker.isDirectMessage({
                            roomId: roomId,
                            senderId: senderId,
                            selfUserId: selfUserId,
                        })];
                case 6:
                    isDirectMessage_1 = _7.sent();
                    isRoom_1 = !isDirectMessage_1;
                    if (isRoom_1 && groupPolicy === "disabled") {
                        return [2 /*return*/];
                    }
                    roomConfigInfo = isRoom_1
                        ? (0, rooms_js_1.resolveMatrixRoomConfig)({
                            rooms: roomsConfig,
                            roomId: roomId,
                            aliases: roomAliases,
                            name: roomName,
                        })
                        : undefined;
                    roomConfig = roomConfigInfo === null || roomConfigInfo === void 0 ? void 0 : roomConfigInfo.config;
                    roomMatchMeta = roomConfigInfo
                        ? "matchKey=".concat((_k = roomConfigInfo.matchKey) !== null && _k !== void 0 ? _k : "none", " matchSource=").concat((_l = roomConfigInfo.matchSource) !== null && _l !== void 0 ? _l : "none")
                        : "matchKey=none matchSource=none";
                    if (isRoom_1 && roomConfig && !(roomConfigInfo === null || roomConfigInfo === void 0 ? void 0 : roomConfigInfo.allowed)) {
                        logVerboseMessage("matrix: room disabled room=".concat(roomId, " (").concat(roomMatchMeta, ")"));
                        return [2 /*return*/];
                    }
                    if (isRoom_1 && groupPolicy === "allowlist") {
                        if (!(roomConfigInfo === null || roomConfigInfo === void 0 ? void 0 : roomConfigInfo.allowlistConfigured)) {
                            logVerboseMessage("matrix: drop room message (no allowlist, ".concat(roomMatchMeta, ")"));
                            return [2 /*return*/];
                        }
                        if (!roomConfig) {
                            logVerboseMessage("matrix: drop room message (not in allowlist, ".concat(roomMatchMeta, ")"));
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, getMemberDisplayName(roomId, senderId)];
                case 7:
                    senderName = _7.sent();
                    return [4 /*yield*/, core.channel.pairing
                            .readAllowFromStore("matrix")
                            .catch(function () { return []; })];
                case 8:
                    storeAllowFrom = _7.sent();
                    effectiveAllowFrom = (0, allowlist_js_1.normalizeAllowListLower)(__spreadArray(__spreadArray([], allowFrom, true), storeAllowFrom, true));
                    groupAllowFrom = (_p = (_o = (_m = cfg.channels) === null || _m === void 0 ? void 0 : _m.matrix) === null || _o === void 0 ? void 0 : _o.groupAllowFrom) !== null && _p !== void 0 ? _p : [];
                    effectiveGroupAllowFrom = (0, allowlist_js_1.normalizeAllowListLower)(__spreadArray(__spreadArray([], groupAllowFrom, true), storeAllowFrom, true));
                    groupAllowConfigured = effectiveGroupAllowFrom.length > 0;
                    if (!isDirectMessage_1) return [3 /*break*/, 14];
                    if (!dmEnabled || dmPolicy === "disabled") {
                        return [2 /*return*/];
                    }
                    if (!(dmPolicy !== "open")) return [3 /*break*/, 14];
                    allowMatch = (0, allowlist_js_1.resolveMatrixAllowListMatch)({
                        allowList: effectiveAllowFrom,
                        userId: senderId,
                        userName: senderName,
                    });
                    allowMatchMeta = (0, plugin_sdk_1.formatAllowlistMatchMeta)(allowMatch);
                    if (!!allowMatch.allowed) return [3 /*break*/, 14];
                    if (!(dmPolicy === "pairing")) return [3 /*break*/, 13];
                    return [4 /*yield*/, core.channel.pairing.upsertPairingRequest({
                            channel: "matrix",
                            id: senderId,
                            meta: { name: senderName },
                        })];
                case 9:
                    _a = _7.sent(), code = _a.code, created = _a.created;
                    if (!created) return [3 /*break*/, 13];
                    logVerboseMessage("matrix pairing request sender=".concat(senderId, " name=").concat(senderName !== null && senderName !== void 0 ? senderName : "unknown", " (").concat(allowMatchMeta, ")"));
                    _7.label = 10;
                case 10:
                    _7.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, (0, send_js_1.sendMessageMatrix)("room:".concat(roomId), [
                            "OpenClaw: access not configured.",
                            "",
                            "Pairing code: ".concat(code),
                            "",
                            "Ask the bot owner to approve with:",
                            "openclaw pairing approve matrix <code>",
                        ].join("\n"), { client: client })];
                case 11:
                    _7.sent();
                    return [3 /*break*/, 13];
                case 12:
                    err_1 = _7.sent();
                    logVerboseMessage("matrix pairing reply failed for ".concat(senderId, ": ").concat(String(err_1)));
                    return [3 /*break*/, 13];
                case 13:
                    if (dmPolicy !== "pairing") {
                        logVerboseMessage("matrix: blocked dm sender ".concat(senderId, " (dmPolicy=").concat(dmPolicy, ", ").concat(allowMatchMeta, ")"));
                    }
                    return [2 /*return*/];
                case 14:
                    roomUsers = (_q = roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.users) !== null && _q !== void 0 ? _q : [];
                    if (isRoom_1 && roomUsers.length > 0) {
                        userMatch = (0, allowlist_js_1.resolveMatrixAllowListMatch)({
                            allowList: (0, allowlist_js_1.normalizeAllowListLower)(roomUsers),
                            userId: senderId,
                            userName: senderName,
                        });
                        if (!userMatch.allowed) {
                            logVerboseMessage("matrix: blocked sender ".concat(senderId, " (room users allowlist, ").concat(roomMatchMeta, ", ").concat((0, plugin_sdk_1.formatAllowlistMatchMeta)(userMatch), ")"));
                            return [2 /*return*/];
                        }
                    }
                    if (isRoom_1 && groupPolicy === "allowlist" && roomUsers.length === 0 && groupAllowConfigured) {
                        groupAllowMatch = (0, allowlist_js_1.resolveMatrixAllowListMatch)({
                            allowList: effectiveGroupAllowFrom,
                            userId: senderId,
                            userName: senderName,
                        });
                        if (!groupAllowMatch.allowed) {
                            logVerboseMessage("matrix: blocked sender ".concat(senderId, " (groupAllowFrom, ").concat(roomMatchMeta, ", ").concat((0, plugin_sdk_1.formatAllowlistMatchMeta)(groupAllowMatch), ")"));
                            return [2 /*return*/];
                        }
                    }
                    if (isRoom_1) {
                        logVerboseMessage("matrix: allow room ".concat(roomId, " (").concat(roomMatchMeta, ")"));
                    }
                    rawBody = (_r = locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.text) !== null && _r !== void 0 ? _r : (typeof content.body === "string" ? content.body.trim() : "");
                    media = null;
                    contentUrl = "url" in content && typeof content.url === "string" ? content.url : undefined;
                    contentFile = "file" in content && content.file && typeof content.file === "object"
                        ? content.file
                        : undefined;
                    mediaUrl = contentUrl !== null && contentUrl !== void 0 ? contentUrl : contentFile === null || contentFile === void 0 ? void 0 : contentFile.url;
                    if (!rawBody && !mediaUrl) {
                        return [2 /*return*/];
                    }
                    contentInfo = "info" in content && content.info && typeof content.info === "object"
                        ? content.info
                        : undefined;
                    contentType = contentInfo === null || contentInfo === void 0 ? void 0 : contentInfo.mimetype;
                    contentSize = typeof (contentInfo === null || contentInfo === void 0 ? void 0 : contentInfo.size) === "number" ? contentInfo.size : undefined;
                    if (!(mediaUrl === null || mediaUrl === void 0 ? void 0 : mediaUrl.startsWith("mxc://"))) return [3 /*break*/, 18];
                    _7.label = 15;
                case 15:
                    _7.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, (0, media_js_1.downloadMatrixMedia)({
                            client: client,
                            mxcUrl: mediaUrl,
                            contentType: contentType,
                            sizeBytes: contentSize,
                            maxBytes: mediaMaxBytes,
                            file: contentFile,
                        })];
                case 16:
                    media = _7.sent();
                    return [3 /*break*/, 18];
                case 17:
                    err_2 = _7.sent();
                    logVerboseMessage("matrix: media download failed: ".concat(String(err_2)));
                    return [3 /*break*/, 18];
                case 18:
                    bodyText = rawBody || (media === null || media === void 0 ? void 0 : media.placeholder) || "";
                    if (!bodyText) {
                        return [2 /*return*/];
                    }
                    _b = (0, mentions_js_1.resolveMentions)({
                        content: content,
                        userId: selfUserId,
                        text: bodyText,
                        mentionRegexes: mentionRegexes,
                    }), wasMentioned_1 = _b.wasMentioned, hasExplicitMention = _b.hasExplicitMention;
                    allowTextCommands = core.channel.commands.shouldHandleTextCommands({
                        cfg: cfg,
                        surface: "matrix",
                    });
                    useAccessGroups = ((_s = cfg.commands) === null || _s === void 0 ? void 0 : _s.useAccessGroups) !== false;
                    senderAllowedForCommands = (0, allowlist_js_1.resolveMatrixAllowListMatches)({
                        allowList: effectiveAllowFrom,
                        userId: senderId,
                        userName: senderName,
                    });
                    senderAllowedForGroup = groupAllowConfigured
                        ? (0, allowlist_js_1.resolveMatrixAllowListMatches)({
                            allowList: effectiveGroupAllowFrom,
                            userId: senderId,
                            userName: senderName,
                        })
                        : false;
                    senderAllowedForRoomUsers = isRoom_1 && roomUsers.length > 0
                        ? (0, allowlist_js_1.resolveMatrixAllowListMatches)({
                            allowList: (0, allowlist_js_1.normalizeAllowListLower)(roomUsers),
                            userId: senderId,
                            userName: senderName,
                        })
                        : false;
                    hasControlCommandInMessage = core.channel.text.hasControlCommand(bodyText, cfg);
                    commandGate = (0, plugin_sdk_1.resolveControlCommandGate)({
                        useAccessGroups: useAccessGroups,
                        authorizers: [
                            { configured: effectiveAllowFrom.length > 0, allowed: senderAllowedForCommands },
                            { configured: roomUsers.length > 0, allowed: senderAllowedForRoomUsers },
                            { configured: groupAllowConfigured, allowed: senderAllowedForGroup },
                        ],
                        allowTextCommands: allowTextCommands,
                        hasControlCommand: hasControlCommandInMessage,
                    });
                    commandAuthorized = commandGate.commandAuthorized;
                    if (isRoom_1 && commandGate.shouldBlock) {
                        (0, plugin_sdk_1.logInboundDrop)({
                            log: logVerboseMessage,
                            channel: "matrix",
                            reason: "control command (unauthorized)",
                            target: senderId,
                        });
                        return [2 /*return*/];
                    }
                    shouldRequireMention_1 = isRoom_1
                        ? (roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.autoReply) === true
                            ? false
                            : (roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.autoReply) === false
                                ? true
                                : typeof (roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.requireMention) === "boolean"
                                    ? roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.requireMention
                                    : true
                        : false;
                    shouldBypassMention_1 = allowTextCommands &&
                        isRoom_1 &&
                        shouldRequireMention_1 &&
                        !wasMentioned_1 &&
                        !hasExplicitMention &&
                        commandAuthorized &&
                        hasControlCommandInMessage;
                    canDetectMention_1 = mentionRegexes.length > 0 || hasExplicitMention;
                    if (isRoom_1 && shouldRequireMention_1 && !wasMentioned_1 && !shouldBypassMention_1) {
                        logger.info({ roomId: roomId, reason: "no-mention" }, "skipping room message");
                        return [2 /*return*/];
                    }
                    messageId_1 = (_t = event.event_id) !== null && _t !== void 0 ? _t : "";
                    replyToEventId = (_v = (_u = content["m.relates_to"]) === null || _u === void 0 ? void 0 : _u["m.in_reply_to"]) === null || _v === void 0 ? void 0 : _v.event_id;
                    threadRootId = (0, threads_js_1.resolveMatrixThreadRootId)({ event: event, content: content });
                    threadTarget_1 = (0, threads_js_1.resolveMatrixThreadTarget)({
                        threadReplies: threadReplies,
                        messageId: messageId_1,
                        threadRootId: threadRootId,
                        isThreadRoot: false, // @vector-im/matrix-bot-sdk doesn't have this info readily available
                    });
                    route_1 = core.channel.routing.resolveAgentRoute({
                        cfg: cfg,
                        channel: "matrix",
                        peer: {
                            kind: isDirectMessage_1 ? "dm" : "channel",
                            id: isDirectMessage_1 ? senderId : roomId,
                        },
                    });
                    envelopeFrom = isDirectMessage_1 ? senderName : (roomName !== null && roomName !== void 0 ? roomName : roomId);
                    textWithId = "".concat(bodyText, "\n[matrix event id: ").concat(messageId_1, " room: ").concat(roomId, "]");
                    storePath_1 = core.channel.session.resolveStorePath((_w = cfg.session) === null || _w === void 0 ? void 0 : _w.store, {
                        agentId: route_1.agentId,
                    });
                    envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(cfg);
                    previousTimestamp = core.channel.session.readSessionUpdatedAt({
                        storePath: storePath_1,
                        sessionKey: route_1.sessionKey,
                    });
                    body = core.channel.reply.formatAgentEnvelope({
                        channel: "Matrix",
                        from: envelopeFrom,
                        timestamp: eventTs !== null && eventTs !== void 0 ? eventTs : undefined,
                        previousTimestamp: previousTimestamp,
                        envelope: envelopeOptions,
                        body: textWithId,
                    });
                    groupSystemPrompt = ((_x = roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.systemPrompt) === null || _x === void 0 ? void 0 : _x.trim()) || undefined;
                    ctxPayload_1 = core.channel.reply.finalizeInboundContext(__assign(__assign({ Body: body, RawBody: bodyText, CommandBody: bodyText, From: isDirectMessage_1 ? "matrix:".concat(senderId) : "matrix:channel:".concat(roomId), To: "room:".concat(roomId), SessionKey: route_1.sessionKey, AccountId: route_1.accountId, ChatType: isDirectMessage_1 ? "direct" : "channel", ConversationLabel: envelopeFrom, SenderName: senderName, SenderId: senderId, SenderUsername: (_y = senderId.split(":")[0]) === null || _y === void 0 ? void 0 : _y.replace(/^@/, ""), GroupSubject: isRoom_1 ? (roomName !== null && roomName !== void 0 ? roomName : roomId) : undefined, GroupChannel: isRoom_1 ? ((_z = roomInfo.canonicalAlias) !== null && _z !== void 0 ? _z : roomId) : undefined, GroupSystemPrompt: isRoom_1 ? groupSystemPrompt : undefined, Provider: "matrix", Surface: "matrix", WasMentioned: isRoom_1 ? wasMentioned_1 : undefined, MessageSid: messageId_1, ReplyToId: threadTarget_1 ? undefined : (replyToEventId !== null && replyToEventId !== void 0 ? replyToEventId : undefined), MessageThreadId: threadTarget_1, Timestamp: eventTs !== null && eventTs !== void 0 ? eventTs : undefined, MediaPath: media === null || media === void 0 ? void 0 : media.path, MediaType: media === null || media === void 0 ? void 0 : media.contentType, MediaUrl: media === null || media === void 0 ? void 0 : media.path }, locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.context), { CommandAuthorized: commandAuthorized, CommandSource: "text", OriginatingChannel: "matrix", OriginatingTo: "room:".concat(roomId) }));
                    return [4 /*yield*/, core.channel.session.recordInboundSession({
                            storePath: storePath_1,
                            sessionKey: (_0 = ctxPayload_1.SessionKey) !== null && _0 !== void 0 ? _0 : route_1.sessionKey,
                            ctx: ctxPayload_1,
                            updateLastRoute: isDirectMessage_1
                                ? {
                                    sessionKey: route_1.mainSessionKey,
                                    channel: "matrix",
                                    to: "room:".concat(roomId),
                                    accountId: route_1.accountId,
                                }
                                : undefined,
                            onRecordError: function (err) {
                                var _a;
                                logger.warn({
                                    error: String(err),
                                    storePath: storePath_1,
                                    sessionKey: (_a = ctxPayload_1.SessionKey) !== null && _a !== void 0 ? _a : route_1.sessionKey,
                                }, "failed updating session meta");
                            },
                        })];
                case 19:
                    _7.sent();
                    preview = bodyText.slice(0, 200).replace(/\n/g, "\\n");
                    logVerboseMessage("matrix inbound: room=".concat(roomId, " from=").concat(senderId, " preview=\"").concat(preview, "\""));
                    ackReaction_1 = ((_2 = (_1 = cfg.messages) === null || _1 === void 0 ? void 0 : _1.ackReaction) !== null && _2 !== void 0 ? _2 : "").trim();
                    ackScope_1 = (_4 = (_3 = cfg.messages) === null || _3 === void 0 ? void 0 : _3.ackReactionScope) !== null && _4 !== void 0 ? _4 : "group-mentions";
                    shouldAckReaction = function () {
                        return Boolean(ackReaction_1 &&
                            core.channel.reactions.shouldAckReaction({
                                scope: ackScope_1,
                                isDirect: isDirectMessage_1,
                                isGroup: isRoom_1,
                                isMentionableGroup: isRoom_1,
                                requireMention: Boolean(shouldRequireMention_1),
                                canDetectMention: canDetectMention_1,
                                effectiveWasMentioned: wasMentioned_1 || shouldBypassMention_1,
                                shouldBypassMention: shouldBypassMention_1,
                            }));
                    };
                    if (shouldAckReaction() && messageId_1) {
                        (0, send_js_1.reactMatrixMessage)(roomId, messageId_1, ackReaction_1, client).catch(function (err) {
                            logVerboseMessage("matrix react failed for room ".concat(roomId, ": ").concat(String(err)));
                        });
                    }
                    replyTarget = ctxPayload_1.To;
                    if (!replyTarget) {
                        (_5 = runtime.error) === null || _5 === void 0 ? void 0 : _5.call(runtime, "matrix: missing reply target");
                        return [2 /*return*/];
                    }
                    if (messageId_1) {
                        (0, send_js_1.sendReadReceiptMatrix)(roomId, messageId_1, client).catch(function (err) {
                            logVerboseMessage("matrix: read receipt failed room=".concat(roomId, " id=").concat(messageId_1, ": ").concat(String(err)));
                        });
                    }
                    didSendReply_1 = false;
                    tableMode_1 = core.channel.text.resolveMarkdownTableMode({
                        cfg: cfg,
                        channel: "matrix",
                        accountId: route_1.accountId,
                    });
                    prefixContext = (0, plugin_sdk_1.createReplyPrefixContext)({ cfg: cfg, agentId: route_1.agentId });
                    typingCallbacks = (0, plugin_sdk_1.createTypingCallbacks)({
                        start: function () { return (0, send_js_1.sendTypingMatrix)(roomId, true, undefined, client); },
                        stop: function () { return (0, send_js_1.sendTypingMatrix)(roomId, false, undefined, client); },
                        onStartError: function (err) {
                            (0, plugin_sdk_1.logTypingFailure)({
                                log: logVerboseMessage,
                                channel: "matrix",
                                action: "start",
                                target: roomId,
                                error: err,
                            });
                        },
                        onStopError: function (err) {
                            (0, plugin_sdk_1.logTypingFailure)({
                                log: logVerboseMessage,
                                channel: "matrix",
                                action: "stop",
                                target: roomId,
                                error: err,
                            });
                        },
                    });
                    _c = core.channel.reply.createReplyDispatcherWithTyping({
                        responsePrefix: prefixContext.responsePrefix,
                        responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
                        humanDelay: core.channel.reply.resolveHumanDelayConfig(cfg, route_1.agentId),
                        deliver: function (payload) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, replies_js_1.deliverMatrixReplies)({
                                            replies: [payload],
                                            roomId: roomId,
                                            client: client,
                                            runtime: runtime,
                                            textLimit: textLimit,
                                            replyToMode: replyToMode,
                                            threadId: threadTarget_1,
                                            accountId: route_1.accountId,
                                            tableMode: tableMode_1,
                                        })];
                                    case 1:
                                        _a.sent();
                                        didSendReply_1 = true;
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                        onError: function (err, info) {
                            var _a;
                            (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "matrix ".concat(info.kind, " reply failed: ").concat(String(err)));
                        },
                        onReplyStart: typingCallbacks.onReplyStart,
                        onIdle: typingCallbacks.onIdle,
                    }), dispatcher = _c.dispatcher, replyOptions = _c.replyOptions, markDispatchIdle = _c.markDispatchIdle;
                    return [4 /*yield*/, core.channel.reply.dispatchReplyFromConfig({
                            ctx: ctxPayload_1,
                            cfg: cfg,
                            dispatcher: dispatcher,
                            replyOptions: __assign(__assign({}, replyOptions), { skillFilter: roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.skills, onModelSelected: prefixContext.onModelSelected }),
                        })];
                case 20:
                    _d = _7.sent(), queuedFinal = _d.queuedFinal, counts = _d.counts;
                    markDispatchIdle();
                    if (!queuedFinal) {
                        return [2 /*return*/];
                    }
                    didSendReply_1 = true;
                    finalCount = counts.final;
                    logVerboseMessage("matrix: delivered ".concat(finalCount, " reply").concat(finalCount === 1 ? "" : "ies", " to ").concat(replyTarget));
                    if (didSendReply_1) {
                        previewText = bodyText.replace(/\s+/g, " ").slice(0, 160);
                        core.system.enqueueSystemEvent("Matrix message from ".concat(senderName, ": ").concat(previewText), {
                            sessionKey: route_1.sessionKey,
                            contextKey: "matrix:message:".concat(roomId, ":").concat(messageId_1 || "unknown"),
                        });
                    }
                    return [3 /*break*/, 22];
                case 21:
                    err_3 = _7.sent();
                    (_6 = runtime.error) === null || _6 === void 0 ? void 0 : _6.call(runtime, "matrix handler failed: ".concat(String(err_3)));
                    return [3 /*break*/, 22];
                case 22: return [2 /*return*/];
            }
        });
    }); };
}
