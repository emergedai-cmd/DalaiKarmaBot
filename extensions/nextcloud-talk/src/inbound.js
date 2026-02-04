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
exports.handleNextcloudTalkInbound = handleNextcloudTalkInbound;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var policy_js_1 = require("./policy.js");
var room_info_js_1 = require("./room-info.js");
var runtime_js_1 = require("./runtime.js");
var send_js_1 = require("./send.js");
var CHANNEL_ID = "nextcloud-talk";
function deliverNextcloudTalkReply(params) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, roomToken, accountId, statusSink, text, mediaList, mediaBlock, combined;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    payload = params.payload, roomToken = params.roomToken, accountId = params.accountId, statusSink = params.statusSink;
                    text = (_a = payload.text) !== null && _a !== void 0 ? _a : "";
                    mediaList = ((_b = payload.mediaUrls) === null || _b === void 0 ? void 0 : _b.length)
                        ? payload.mediaUrls
                        : payload.mediaUrl
                            ? [payload.mediaUrl]
                            : [];
                    if (!text.trim() && mediaList.length === 0) {
                        return [2 /*return*/];
                    }
                    mediaBlock = mediaList.length
                        ? mediaList.map(function (url) { return "Attachment: ".concat(url); }).join("\n")
                        : "";
                    combined = text.trim()
                        ? mediaBlock
                            ? "".concat(text.trim(), "\n\n").concat(mediaBlock)
                            : text.trim()
                        : mediaBlock;
                    return [4 /*yield*/, (0, send_js_1.sendMessageNextcloudTalk)(roomToken, combined, {
                            accountId: accountId,
                            replyTo: payload.replyToId,
                        })];
                case 1:
                    _c.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [2 /*return*/];
            }
        });
    });
}
function handleNextcloudTalkInbound(params) {
    return __awaiter(this, void 0, void 0, function () {
        var message, account, config, runtime, statusSink, core, rawBody, roomKind, isGroup, senderId, senderName, roomToken, roomName, dmPolicy, defaultGroupPolicy, groupPolicy, configAllowFrom, configGroupAllowFrom, storeAllowFrom, storeAllowList, roomMatch, roomConfig, roomAllowFrom, baseGroupAllowFrom, effectiveAllowFrom, effectiveGroupAllowFrom, allowTextCommands, useAccessGroups, senderAllowedForCommands, hasControlCommand, commandGate, commandAuthorized, groupAllow, dmAllowed, _a, code, created, err_1, mentionRegexes, wasMentioned, shouldRequireMention, mentionGate, route, fromLabel, storePath, envelopeOptions, previousTimestamp, body, groupSystemPrompt, ctxPayload;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    message = params.message, account = params.account, config = params.config, runtime = params.runtime, statusSink = params.statusSink;
                    core = (0, runtime_js_1.getNextcloudTalkRuntime)();
                    rawBody = (_c = (_b = message.text) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
                    if (!rawBody) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, room_info_js_1.resolveNextcloudTalkRoomKind)({
                            account: account,
                            roomToken: message.roomToken,
                            runtime: runtime,
                        })];
                case 1:
                    roomKind = _v.sent();
                    isGroup = roomKind === "direct" ? false : roomKind === "group" ? true : message.isGroupChat;
                    senderId = message.senderId;
                    senderName = message.senderName;
                    roomToken = message.roomToken;
                    roomName = message.roomName;
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastInboundAt: message.timestamp });
                    dmPolicy = (_d = account.config.dmPolicy) !== null && _d !== void 0 ? _d : "pairing";
                    defaultGroupPolicy = (_f = (_e = config.channels) === null || _e === void 0 ? void 0 : _e.defaults) === null || _f === void 0 ? void 0 : _f.groupPolicy;
                    groupPolicy = (_h = (_g = account.config.groupPolicy) !== null && _g !== void 0 ? _g : defaultGroupPolicy) !== null && _h !== void 0 ? _h : "allowlist";
                    configAllowFrom = (0, policy_js_1.normalizeNextcloudTalkAllowlist)(account.config.allowFrom);
                    configGroupAllowFrom = (0, policy_js_1.normalizeNextcloudTalkAllowlist)(account.config.groupAllowFrom);
                    return [4 /*yield*/, core.channel.pairing.readAllowFromStore(CHANNEL_ID).catch(function () { return []; })];
                case 2:
                    storeAllowFrom = _v.sent();
                    storeAllowList = (0, policy_js_1.normalizeNextcloudTalkAllowlist)(storeAllowFrom);
                    roomMatch = (0, policy_js_1.resolveNextcloudTalkRoomMatch)({
                        rooms: account.config.rooms,
                        roomToken: roomToken,
                        roomName: roomName,
                    });
                    roomConfig = roomMatch.roomConfig;
                    if (isGroup && !roomMatch.allowed) {
                        (_j = runtime.log) === null || _j === void 0 ? void 0 : _j.call(runtime, "nextcloud-talk: drop room ".concat(roomToken, " (not allowlisted)"));
                        return [2 /*return*/];
                    }
                    if ((roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.enabled) === false) {
                        (_k = runtime.log) === null || _k === void 0 ? void 0 : _k.call(runtime, "nextcloud-talk: drop room ".concat(roomToken, " (disabled)"));
                        return [2 /*return*/];
                    }
                    roomAllowFrom = (0, policy_js_1.normalizeNextcloudTalkAllowlist)(roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.allowFrom);
                    baseGroupAllowFrom = configGroupAllowFrom.length > 0 ? configGroupAllowFrom : configAllowFrom;
                    effectiveAllowFrom = __spreadArray(__spreadArray([], configAllowFrom, true), storeAllowList, true).filter(Boolean);
                    effectiveGroupAllowFrom = __spreadArray(__spreadArray([], baseGroupAllowFrom, true), storeAllowList, true).filter(Boolean);
                    allowTextCommands = core.channel.commands.shouldHandleTextCommands({
                        cfg: config,
                        surface: CHANNEL_ID,
                    });
                    useAccessGroups = ((_l = config.commands) === null || _l === void 0 ? void 0 : _l.useAccessGroups) !== false;
                    senderAllowedForCommands = (0, policy_js_1.resolveNextcloudTalkAllowlistMatch)({
                        allowFrom: isGroup ? effectiveGroupAllowFrom : effectiveAllowFrom,
                        senderId: senderId,
                        senderName: senderName,
                    }).allowed;
                    hasControlCommand = core.channel.text.hasControlCommand(rawBody, config);
                    commandGate = (0, plugin_sdk_1.resolveControlCommandGate)({
                        useAccessGroups: useAccessGroups,
                        authorizers: [
                            {
                                configured: (isGroup ? effectiveGroupAllowFrom : effectiveAllowFrom).length > 0,
                                allowed: senderAllowedForCommands,
                            },
                        ],
                        allowTextCommands: allowTextCommands,
                        hasControlCommand: hasControlCommand,
                    });
                    commandAuthorized = commandGate.commandAuthorized;
                    if (!isGroup) return [3 /*break*/, 3];
                    groupAllow = (0, policy_js_1.resolveNextcloudTalkGroupAllow)({
                        groupPolicy: groupPolicy,
                        outerAllowFrom: effectiveGroupAllowFrom,
                        innerAllowFrom: roomAllowFrom,
                        senderId: senderId,
                        senderName: senderName,
                    });
                    if (!groupAllow.allowed) {
                        (_m = runtime.log) === null || _m === void 0 ? void 0 : _m.call(runtime, "nextcloud-talk: drop group sender ".concat(senderId, " (policy=").concat(groupPolicy, ")"));
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 9];
                case 3:
                    if (dmPolicy === "disabled") {
                        (_o = runtime.log) === null || _o === void 0 ? void 0 : _o.call(runtime, "nextcloud-talk: drop DM sender=".concat(senderId, " (dmPolicy=disabled)"));
                        return [2 /*return*/];
                    }
                    if (!(dmPolicy !== "open")) return [3 /*break*/, 9];
                    dmAllowed = (0, policy_js_1.resolveNextcloudTalkAllowlistMatch)({
                        allowFrom: effectiveAllowFrom,
                        senderId: senderId,
                        senderName: senderName,
                    }).allowed;
                    if (!!dmAllowed) return [3 /*break*/, 9];
                    if (!(dmPolicy === "pairing")) return [3 /*break*/, 8];
                    return [4 /*yield*/, core.channel.pairing.upsertPairingRequest({
                            channel: CHANNEL_ID,
                            id: senderId,
                            meta: { name: senderName || undefined },
                        })];
                case 4:
                    _a = _v.sent(), code = _a.code, created = _a.created;
                    if (!created) return [3 /*break*/, 8];
                    _v.label = 5;
                case 5:
                    _v.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, send_js_1.sendMessageNextcloudTalk)(roomToken, core.channel.pairing.buildPairingReply({
                            channel: CHANNEL_ID,
                            idLine: "Your Nextcloud user id: ".concat(senderId),
                            code: code,
                        }), { accountId: account.accountId })];
                case 6:
                    _v.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _v.sent();
                    (_p = runtime.error) === null || _p === void 0 ? void 0 : _p.call(runtime, "nextcloud-talk: pairing reply failed for ".concat(senderId, ": ").concat(String(err_1)));
                    return [3 /*break*/, 8];
                case 8:
                    (_q = runtime.log) === null || _q === void 0 ? void 0 : _q.call(runtime, "nextcloud-talk: drop DM sender ".concat(senderId, " (dmPolicy=").concat(dmPolicy, ")"));
                    return [2 /*return*/];
                case 9:
                    if (isGroup && commandGate.shouldBlock) {
                        (0, plugin_sdk_1.logInboundDrop)({
                            log: function (message) { var _a; return (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, message); },
                            channel: CHANNEL_ID,
                            reason: "control command (unauthorized)",
                            target: senderId,
                        });
                        return [2 /*return*/];
                    }
                    mentionRegexes = core.channel.mentions.buildMentionRegexes(config);
                    wasMentioned = mentionRegexes.length
                        ? core.channel.mentions.matchesMentionPatterns(rawBody, mentionRegexes)
                        : false;
                    shouldRequireMention = isGroup
                        ? (0, policy_js_1.resolveNextcloudTalkRequireMention)({
                            roomConfig: roomConfig,
                            wildcardConfig: roomMatch.wildcardConfig,
                        })
                        : false;
                    mentionGate = (0, policy_js_1.resolveNextcloudTalkMentionGate)({
                        isGroup: isGroup,
                        requireMention: shouldRequireMention,
                        wasMentioned: wasMentioned,
                        allowTextCommands: allowTextCommands,
                        hasControlCommand: hasControlCommand,
                        commandAuthorized: commandAuthorized,
                    });
                    if (isGroup && mentionGate.shouldSkip) {
                        (_r = runtime.log) === null || _r === void 0 ? void 0 : _r.call(runtime, "nextcloud-talk: drop room ".concat(roomToken, " (no mention)"));
                        return [2 /*return*/];
                    }
                    route = core.channel.routing.resolveAgentRoute({
                        cfg: config,
                        channel: CHANNEL_ID,
                        accountId: account.accountId,
                        peer: {
                            kind: isGroup ? "group" : "dm",
                            id: isGroup ? roomToken : senderId,
                        },
                    });
                    fromLabel = isGroup ? "room:".concat(roomName || roomToken) : senderName || "user:".concat(senderId);
                    storePath = core.channel.session.resolveStorePath((_s = config.session) === null || _s === void 0 ? void 0 : _s.store, {
                        agentId: route.agentId,
                    });
                    envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(config);
                    previousTimestamp = core.channel.session.readSessionUpdatedAt({
                        storePath: storePath,
                        sessionKey: route.sessionKey,
                    });
                    body = core.channel.reply.formatAgentEnvelope({
                        channel: "Nextcloud Talk",
                        from: fromLabel,
                        timestamp: message.timestamp,
                        previousTimestamp: previousTimestamp,
                        envelope: envelopeOptions,
                        body: rawBody,
                    });
                    groupSystemPrompt = ((_t = roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.systemPrompt) === null || _t === void 0 ? void 0 : _t.trim()) || undefined;
                    ctxPayload = core.channel.reply.finalizeInboundContext({
                        Body: body,
                        RawBody: rawBody,
                        CommandBody: rawBody,
                        From: isGroup ? "nextcloud-talk:room:".concat(roomToken) : "nextcloud-talk:".concat(senderId),
                        To: "nextcloud-talk:".concat(roomToken),
                        SessionKey: route.sessionKey,
                        AccountId: route.accountId,
                        ChatType: isGroup ? "group" : "direct",
                        ConversationLabel: fromLabel,
                        SenderName: senderName || undefined,
                        SenderId: senderId,
                        GroupSubject: isGroup ? roomName || roomToken : undefined,
                        GroupSystemPrompt: isGroup ? groupSystemPrompt : undefined,
                        Provider: CHANNEL_ID,
                        Surface: CHANNEL_ID,
                        WasMentioned: isGroup ? wasMentioned : undefined,
                        MessageSid: message.messageId,
                        Timestamp: message.timestamp,
                        OriginatingChannel: CHANNEL_ID,
                        OriginatingTo: "nextcloud-talk:".concat(roomToken),
                        CommandAuthorized: commandAuthorized,
                    });
                    return [4 /*yield*/, core.channel.session.recordInboundSession({
                            storePath: storePath,
                            sessionKey: (_u = ctxPayload.SessionKey) !== null && _u !== void 0 ? _u : route.sessionKey,
                            ctx: ctxPayload,
                            onRecordError: function (err) {
                                var _a;
                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "nextcloud-talk: failed updating session meta: ".concat(String(err)));
                            },
                        })];
                case 10:
                    _v.sent();
                    return [4 /*yield*/, core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
                            ctx: ctxPayload,
                            cfg: config,
                            dispatcherOptions: {
                                deliver: function (payload) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, deliverNextcloudTalkReply({
                                                    payload: payload,
                                                    roomToken: roomToken,
                                                    accountId: account.accountId,
                                                    statusSink: statusSink,
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                                onError: function (err, info) {
                                    var _a;
                                    (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "nextcloud-talk ".concat(info.kind, " reply failed: ").concat(String(err)));
                                },
                            },
                            replyOptions: {
                                skillFilter: roomConfig === null || roomConfig === void 0 ? void 0 : roomConfig.skills,
                                disableBlockStreaming: typeof account.config.blockStreaming === "boolean"
                                    ? !account.config.blockStreaming
                                    : undefined,
                            },
                        })];
                case 11:
                    _v.sent();
                    return [2 /*return*/];
            }
        });
    });
}
