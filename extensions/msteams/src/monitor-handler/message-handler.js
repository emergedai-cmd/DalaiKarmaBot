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
exports.createMSTeamsMessageHandler = createMSTeamsMessageHandler;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var attachments_js_1 = require("../attachments.js");
var errors_js_1 = require("../errors.js");
var inbound_js_1 = require("../inbound.js");
var policy_js_1 = require("../policy.js");
var polls_js_1 = require("../polls.js");
var reply_dispatcher_js_1 = require("../reply-dispatcher.js");
var runtime_js_1 = require("../runtime.js");
var sent_message_cache_js_1 = require("../sent-message-cache.js");
var inbound_media_js_1 = require("./inbound-media.js");
function createMSTeamsMessageHandler(deps) {
    var _this = this;
    var _a, _b, _c, _d, _e;
    var cfg = deps.cfg, runtime = deps.runtime, appId = deps.appId, adapter = deps.adapter, tokenProvider = deps.tokenProvider, textLimit = deps.textLimit, mediaMaxBytes = deps.mediaMaxBytes, conversationStore = deps.conversationStore, pollStore = deps.pollStore, log = deps.log;
    var core = (0, runtime_js_1.getMSTeamsRuntime)();
    var logVerboseMessage = function (message) {
        if (core.logging.shouldLogVerbose()) {
            log.debug(message);
        }
    };
    var msteamsCfg = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams;
    var historyLimit = Math.max(0, (_e = (_b = msteamsCfg === null || msteamsCfg === void 0 ? void 0 : msteamsCfg.historyLimit) !== null && _b !== void 0 ? _b : (_d = (_c = cfg.messages) === null || _c === void 0 ? void 0 : _c.groupChat) === null || _d === void 0 ? void 0 : _d.historyLimit) !== null && _e !== void 0 ? _e : plugin_sdk_1.DEFAULT_GROUP_HISTORY_LIMIT);
    var conversationHistories = new Map();
    var inboundDebounceMs = core.channel.debounce.resolveInboundDebounceMs({
        cfg: cfg,
        channel: "msteams",
    });
    var handleTeamsMessageNow = function (params) { return __awaiter(_this, void 0, void 0, function () {
        var context, activity, rawText, text, attachments, attachmentPlaceholder, rawBody, from, conversation, attachmentTypes, htmlSummary, rawConversationId, conversationId, conversationMessageId, conversationType, isGroupChat, isChannel, isDirectMessage, senderName, senderId, storedAllowFrom, useAccessGroups, dmAllowFrom, effectiveDmAllowFrom, dmPolicy, allowFrom, effectiveAllowFrom, allowMatch, request, defaultGroupPolicy, groupPolicy, groupAllowFrom, effectiveGroupAllowFrom, teamId, teamName, channelName, channelGate, allowMatch, ownerAllowedForCommands, groupAllowedForCommands, hasControlCommandInMessage, commandGate, commandAuthorized, agent, conversationRef, pollVote, poll, err_1, teamsFrom, teamsTo, route, preview, inboundLabel, channelId, teamConfig, channelConfig, _a, requireMention, replyStyle, timestamp, mentionGate, mentioned, mediaList, mediaPayload, envelopeFrom, storePath, envelopeOptions, previousTimestamp, body, combinedBody, isRoomish, historyKey, ctxPayload, sharePointSiteId, _b, dispatcher, replyOptions, markDispatchIdle, _c, queuedFinal, counts, finalCount, err_2, _d;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
        return __generator(this, function (_9) {
            switch (_9.label) {
                case 0:
                    context = params.context;
                    activity = context.activity;
                    rawText = params.rawText;
                    text = params.text;
                    attachments = params.attachments;
                    attachmentPlaceholder = (0, attachments_js_1.buildMSTeamsAttachmentPlaceholder)(attachments);
                    rawBody = text || attachmentPlaceholder;
                    from = activity.from;
                    conversation = activity.conversation;
                    attachmentTypes = attachments
                        .map(function (att) { return (typeof att.contentType === "string" ? att.contentType : undefined); })
                        .filter(Boolean)
                        .slice(0, 3);
                    htmlSummary = (0, attachments_js_1.summarizeMSTeamsHtmlAttachments)(attachments);
                    log.info("received message", {
                        rawText: rawText.slice(0, 50),
                        text: text.slice(0, 50),
                        attachments: attachments.length,
                        attachmentTypes: attachmentTypes,
                        from: from === null || from === void 0 ? void 0 : from.id,
                        conversation: conversation === null || conversation === void 0 ? void 0 : conversation.id,
                    });
                    if (htmlSummary) {
                        log.debug("html attachment summary", htmlSummary);
                    }
                    if (!(from === null || from === void 0 ? void 0 : from.id)) {
                        log.debug("skipping message without from.id");
                        return [2 /*return*/];
                    }
                    rawConversationId = (_e = conversation === null || conversation === void 0 ? void 0 : conversation.id) !== null && _e !== void 0 ? _e : "";
                    conversationId = (0, inbound_js_1.normalizeMSTeamsConversationId)(rawConversationId);
                    conversationMessageId = (0, inbound_js_1.extractMSTeamsConversationMessageId)(rawConversationId);
                    conversationType = (_f = conversation === null || conversation === void 0 ? void 0 : conversation.conversationType) !== null && _f !== void 0 ? _f : "personal";
                    isGroupChat = conversationType === "groupChat" || (conversation === null || conversation === void 0 ? void 0 : conversation.isGroup) === true;
                    isChannel = conversationType === "channel";
                    isDirectMessage = !isGroupChat && !isChannel;
                    senderName = (_g = from.name) !== null && _g !== void 0 ? _g : from.id;
                    senderId = (_h = from.aadObjectId) !== null && _h !== void 0 ? _h : from.id;
                    return [4 /*yield*/, core.channel.pairing
                            .readAllowFromStore("msteams")
                            .catch(function () { return []; })];
                case 1:
                    storedAllowFrom = _9.sent();
                    useAccessGroups = ((_j = cfg.commands) === null || _j === void 0 ? void 0 : _j.useAccessGroups) !== false;
                    dmAllowFrom = (_k = msteamsCfg === null || msteamsCfg === void 0 ? void 0 : msteamsCfg.allowFrom) !== null && _k !== void 0 ? _k : [];
                    effectiveDmAllowFrom = __spreadArray(__spreadArray([], dmAllowFrom.map(function (v) { return String(v); }), true), storedAllowFrom, true);
                    if (!(isDirectMessage && msteamsCfg)) return [3 /*break*/, 4];
                    dmPolicy = (_l = msteamsCfg.dmPolicy) !== null && _l !== void 0 ? _l : "pairing";
                    allowFrom = dmAllowFrom;
                    if (dmPolicy === "disabled") {
                        log.debug("dropping dm (dms disabled)");
                        return [2 /*return*/];
                    }
                    if (!(dmPolicy !== "open")) return [3 /*break*/, 4];
                    effectiveAllowFrom = __spreadArray(__spreadArray([], allowFrom.map(function (v) { return String(v); }), true), storedAllowFrom, true);
                    allowMatch = (0, policy_js_1.resolveMSTeamsAllowlistMatch)({
                        allowFrom: effectiveAllowFrom,
                        senderId: senderId,
                        senderName: senderName,
                    });
                    if (!!allowMatch.allowed) return [3 /*break*/, 4];
                    if (!(dmPolicy === "pairing")) return [3 /*break*/, 3];
                    return [4 /*yield*/, core.channel.pairing.upsertPairingRequest({
                            channel: "msteams",
                            id: senderId,
                            meta: { name: senderName },
                        })];
                case 2:
                    request = _9.sent();
                    if (request) {
                        log.info("msteams pairing request created", {
                            sender: senderId,
                            label: senderName,
                        });
                    }
                    _9.label = 3;
                case 3:
                    log.debug("dropping dm (not allowlisted)", {
                        sender: senderId,
                        label: senderName,
                        allowlistMatch: (0, plugin_sdk_1.formatAllowlistMatchMeta)(allowMatch),
                    });
                    return [2 /*return*/];
                case 4:
                    defaultGroupPolicy = (_o = (_m = cfg.channels) === null || _m === void 0 ? void 0 : _m.defaults) === null || _o === void 0 ? void 0 : _o.groupPolicy;
                    groupPolicy = !isDirectMessage && msteamsCfg
                        ? ((_q = (_p = msteamsCfg.groupPolicy) !== null && _p !== void 0 ? _p : defaultGroupPolicy) !== null && _q !== void 0 ? _q : "allowlist")
                        : "disabled";
                    groupAllowFrom = !isDirectMessage && msteamsCfg
                        ? ((_r = msteamsCfg.groupAllowFrom) !== null && _r !== void 0 ? _r : (msteamsCfg.allowFrom && msteamsCfg.allowFrom.length > 0 ? msteamsCfg.allowFrom : []))
                        : [];
                    effectiveGroupAllowFrom = !isDirectMessage && msteamsCfg
                        ? __spreadArray(__spreadArray([], groupAllowFrom.map(function (v) { return String(v); }), true), storedAllowFrom, true) : [];
                    teamId = (_t = (_s = activity.channelData) === null || _s === void 0 ? void 0 : _s.team) === null || _t === void 0 ? void 0 : _t.id;
                    teamName = (_v = (_u = activity.channelData) === null || _u === void 0 ? void 0 : _u.team) === null || _v === void 0 ? void 0 : _v.name;
                    channelName = (_x = (_w = activity.channelData) === null || _w === void 0 ? void 0 : _w.channel) === null || _x === void 0 ? void 0 : _x.name;
                    channelGate = (0, policy_js_1.resolveMSTeamsRouteConfig)({
                        cfg: msteamsCfg,
                        teamId: teamId,
                        teamName: teamName,
                        conversationId: conversationId,
                        channelName: channelName,
                    });
                    if (!isDirectMessage && msteamsCfg) {
                        if (groupPolicy === "disabled") {
                            log.debug("dropping group message (groupPolicy: disabled)", {
                                conversationId: conversationId,
                            });
                            return [2 /*return*/];
                        }
                        if (groupPolicy === "allowlist") {
                            if (channelGate.allowlistConfigured && !channelGate.allowed) {
                                log.debug("dropping group message (not in team/channel allowlist)", {
                                    conversationId: conversationId,
                                    teamKey: (_y = channelGate.teamKey) !== null && _y !== void 0 ? _y : "none",
                                    channelKey: (_z = channelGate.channelKey) !== null && _z !== void 0 ? _z : "none",
                                    channelMatchKey: (_0 = channelGate.channelMatchKey) !== null && _0 !== void 0 ? _0 : "none",
                                    channelMatchSource: (_1 = channelGate.channelMatchSource) !== null && _1 !== void 0 ? _1 : "none",
                                });
                                return [2 /*return*/];
                            }
                            if (effectiveGroupAllowFrom.length === 0 && !channelGate.allowlistConfigured) {
                                log.debug("dropping group message (groupPolicy: allowlist, no allowlist)", {
                                    conversationId: conversationId,
                                });
                                return [2 /*return*/];
                            }
                            if (effectiveGroupAllowFrom.length > 0) {
                                allowMatch = (0, policy_js_1.resolveMSTeamsAllowlistMatch)({
                                    groupPolicy: groupPolicy,
                                    allowFrom: effectiveGroupAllowFrom,
                                    senderId: senderId,
                                    senderName: senderName,
                                });
                                if (!allowMatch.allowed) {
                                    log.debug("dropping group message (not in groupAllowFrom)", {
                                        sender: senderId,
                                        label: senderName,
                                        allowlistMatch: (0, plugin_sdk_1.formatAllowlistMatchMeta)(allowMatch),
                                    });
                                    return [2 /*return*/];
                                }
                            }
                        }
                    }
                    ownerAllowedForCommands = (0, policy_js_1.isMSTeamsGroupAllowed)({
                        groupPolicy: "allowlist",
                        allowFrom: effectiveDmAllowFrom,
                        senderId: senderId,
                        senderName: senderName,
                    });
                    groupAllowedForCommands = (0, policy_js_1.isMSTeamsGroupAllowed)({
                        groupPolicy: "allowlist",
                        allowFrom: effectiveGroupAllowFrom,
                        senderId: senderId,
                        senderName: senderName,
                    });
                    hasControlCommandInMessage = core.channel.text.hasControlCommand(text, cfg);
                    commandGate = (0, plugin_sdk_1.resolveControlCommandGate)({
                        useAccessGroups: useAccessGroups,
                        authorizers: [
                            { configured: effectiveDmAllowFrom.length > 0, allowed: ownerAllowedForCommands },
                            { configured: effectiveGroupAllowFrom.length > 0, allowed: groupAllowedForCommands },
                        ],
                        allowTextCommands: true,
                        hasControlCommand: hasControlCommandInMessage,
                    });
                    commandAuthorized = commandGate.commandAuthorized;
                    if (commandGate.shouldBlock) {
                        (0, plugin_sdk_1.logInboundDrop)({
                            log: logVerboseMessage,
                            channel: "msteams",
                            reason: "control command (unauthorized)",
                            target: senderId,
                        });
                        return [2 /*return*/];
                    }
                    agent = activity.recipient;
                    conversationRef = {
                        activityId: activity.id,
                        user: { id: from.id, name: from.name, aadObjectId: from.aadObjectId },
                        agent: agent,
                        bot: agent ? { id: agent.id, name: agent.name } : undefined,
                        conversation: {
                            id: conversationId,
                            conversationType: conversationType,
                            tenantId: conversation === null || conversation === void 0 ? void 0 : conversation.tenantId,
                        },
                        teamId: teamId,
                        channelId: activity.channelId,
                        serviceUrl: activity.serviceUrl,
                        locale: activity.locale,
                    };
                    conversationStore.upsert(conversationId, conversationRef).catch(function (err) {
                        log.debug("failed to save conversation reference", {
                            error: (0, errors_js_1.formatUnknownError)(err),
                        });
                    });
                    pollVote = (0, polls_js_1.extractMSTeamsPollVote)(activity);
                    if (!pollVote) return [3 /*break*/, 9];
                    _9.label = 5;
                case 5:
                    _9.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, pollStore.recordVote({
                            pollId: pollVote.pollId,
                            voterId: senderId,
                            selections: pollVote.selections,
                        })];
                case 6:
                    poll = _9.sent();
                    if (!poll) {
                        log.debug("poll vote ignored (poll not found)", {
                            pollId: pollVote.pollId,
                        });
                    }
                    else {
                        log.info("recorded poll vote", {
                            pollId: pollVote.pollId,
                            voter: senderId,
                            selections: pollVote.selections,
                        });
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _9.sent();
                    log.error("failed to record poll vote", {
                        pollId: pollVote.pollId,
                        error: (0, errors_js_1.formatUnknownError)(err_1),
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
                case 9:
                    if (!rawBody) {
                        log.debug("skipping empty message after stripping mentions");
                        return [2 /*return*/];
                    }
                    teamsFrom = isDirectMessage
                        ? "msteams:".concat(senderId)
                        : isChannel
                            ? "msteams:channel:".concat(conversationId)
                            : "msteams:group:".concat(conversationId);
                    teamsTo = isDirectMessage ? "user:".concat(senderId) : "conversation:".concat(conversationId);
                    route = core.channel.routing.resolveAgentRoute({
                        cfg: cfg,
                        channel: "msteams",
                        peer: {
                            kind: isDirectMessage ? "dm" : isChannel ? "channel" : "group",
                            id: isDirectMessage ? senderId : conversationId,
                        },
                    });
                    preview = rawBody.replace(/\s+/g, " ").slice(0, 160);
                    inboundLabel = isDirectMessage
                        ? "Teams DM from ".concat(senderName)
                        : "Teams message in ".concat(conversationType, " from ").concat(senderName);
                    core.system.enqueueSystemEvent("".concat(inboundLabel, ": ").concat(preview), {
                        sessionKey: route.sessionKey,
                        contextKey: "msteams:message:".concat(conversationId, ":").concat((_2 = activity.id) !== null && _2 !== void 0 ? _2 : "unknown"),
                    });
                    channelId = conversationId;
                    teamConfig = channelGate.teamConfig, channelConfig = channelGate.channelConfig;
                    _a = (0, policy_js_1.resolveMSTeamsReplyPolicy)({
                        isDirectMessage: isDirectMessage,
                        globalConfig: msteamsCfg,
                        teamConfig: teamConfig,
                        channelConfig: channelConfig,
                    }), requireMention = _a.requireMention, replyStyle = _a.replyStyle;
                    timestamp = (0, inbound_js_1.parseMSTeamsActivityTimestamp)(activity.timestamp);
                    if (!isDirectMessage) {
                        mentionGate = (0, plugin_sdk_1.resolveMentionGating)({
                            requireMention: Boolean(requireMention),
                            canDetectMention: true,
                            wasMentioned: params.wasMentioned,
                            implicitMention: params.implicitMention,
                            shouldBypassMention: false,
                        });
                        mentioned = mentionGate.effectiveWasMentioned;
                        if (requireMention && mentionGate.shouldSkip) {
                            log.debug("skipping message (mention required)", {
                                teamId: teamId,
                                channelId: channelId,
                                requireMention: requireMention,
                                mentioned: mentioned,
                            });
                            (0, plugin_sdk_1.recordPendingHistoryEntryIfEnabled)({
                                historyMap: conversationHistories,
                                historyKey: conversationId,
                                limit: historyLimit,
                                entry: {
                                    sender: senderName,
                                    body: rawBody,
                                    timestamp: timestamp === null || timestamp === void 0 ? void 0 : timestamp.getTime(),
                                    messageId: (_3 = activity.id) !== null && _3 !== void 0 ? _3 : undefined,
                                },
                            });
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, (0, inbound_media_js_1.resolveMSTeamsInboundMedia)({
                            attachments: attachments,
                            htmlSummary: htmlSummary !== null && htmlSummary !== void 0 ? htmlSummary : undefined,
                            maxBytes: mediaMaxBytes,
                            tokenProvider: tokenProvider,
                            allowHosts: msteamsCfg === null || msteamsCfg === void 0 ? void 0 : msteamsCfg.mediaAllowHosts,
                            authAllowHosts: msteamsCfg === null || msteamsCfg === void 0 ? void 0 : msteamsCfg.mediaAuthAllowHosts,
                            conversationType: conversationType,
                            conversationId: conversationId,
                            conversationMessageId: conversationMessageId !== null && conversationMessageId !== void 0 ? conversationMessageId : undefined,
                            activity: {
                                id: activity.id,
                                replyToId: activity.replyToId,
                                channelData: activity.channelData,
                            },
                            log: log,
                            preserveFilenames: (_4 = cfg.media) === null || _4 === void 0 ? void 0 : _4.preserveFilenames,
                        })];
                case 10:
                    mediaList = _9.sent();
                    mediaPayload = (0, attachments_js_1.buildMSTeamsMediaPayload)(mediaList);
                    envelopeFrom = isDirectMessage ? senderName : conversationType;
                    storePath = core.channel.session.resolveStorePath((_5 = cfg.session) === null || _5 === void 0 ? void 0 : _5.store, {
                        agentId: route.agentId,
                    });
                    envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(cfg);
                    previousTimestamp = core.channel.session.readSessionUpdatedAt({
                        storePath: storePath,
                        sessionKey: route.sessionKey,
                    });
                    body = core.channel.reply.formatAgentEnvelope({
                        channel: "Teams",
                        from: envelopeFrom,
                        timestamp: timestamp,
                        previousTimestamp: previousTimestamp,
                        envelope: envelopeOptions,
                        body: rawBody,
                    });
                    combinedBody = body;
                    isRoomish = !isDirectMessage;
                    historyKey = isRoomish ? conversationId : undefined;
                    if (isRoomish && historyKey) {
                        combinedBody = (0, plugin_sdk_1.buildPendingHistoryContextFromMap)({
                            historyMap: conversationHistories,
                            historyKey: historyKey,
                            limit: historyLimit,
                            currentMessage: combinedBody,
                            formatEntry: function (entry) {
                                return core.channel.reply.formatAgentEnvelope({
                                    channel: "Teams",
                                    from: conversationType,
                                    timestamp: entry.timestamp,
                                    body: "".concat(entry.sender, ": ").concat(entry.body).concat(entry.messageId ? " [id:".concat(entry.messageId, "]") : ""),
                                    envelope: envelopeOptions,
                                });
                            },
                        });
                    }
                    ctxPayload = core.channel.reply.finalizeInboundContext(__assign({ Body: combinedBody, RawBody: rawBody, CommandBody: rawBody, From: teamsFrom, To: teamsTo, SessionKey: route.sessionKey, AccountId: route.accountId, ChatType: isDirectMessage ? "direct" : isChannel ? "channel" : "group", ConversationLabel: envelopeFrom, GroupSubject: !isDirectMessage ? conversationType : undefined, SenderName: senderName, SenderId: senderId, Provider: "msteams", Surface: "msteams", MessageSid: activity.id, Timestamp: (_6 = timestamp === null || timestamp === void 0 ? void 0 : timestamp.getTime()) !== null && _6 !== void 0 ? _6 : Date.now(), WasMentioned: isDirectMessage || params.wasMentioned || params.implicitMention, CommandAuthorized: commandAuthorized, OriginatingChannel: "msteams", OriginatingTo: teamsTo }, mediaPayload));
                    return [4 /*yield*/, core.channel.session.recordInboundSession({
                            storePath: storePath,
                            sessionKey: (_7 = ctxPayload.SessionKey) !== null && _7 !== void 0 ? _7 : route.sessionKey,
                            ctx: ctxPayload,
                            onRecordError: function (err) {
                                logVerboseMessage("msteams: failed updating session meta: ".concat(String(err)));
                            },
                        })];
                case 11:
                    _9.sent();
                    logVerboseMessage("msteams inbound: from=".concat(ctxPayload.From, " preview=\"").concat(preview, "\""));
                    sharePointSiteId = msteamsCfg === null || msteamsCfg === void 0 ? void 0 : msteamsCfg.sharePointSiteId;
                    _b = (0, reply_dispatcher_js_1.createMSTeamsReplyDispatcher)({
                        cfg: cfg,
                        agentId: route.agentId,
                        runtime: runtime,
                        log: log,
                        adapter: adapter,
                        appId: appId,
                        conversationRef: conversationRef,
                        context: context,
                        replyStyle: replyStyle,
                        textLimit: textLimit,
                        onSentMessageIds: function (ids) {
                            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                                var id = ids_1[_i];
                                (0, sent_message_cache_js_1.recordMSTeamsSentMessage)(conversationId, id);
                            }
                        },
                        tokenProvider: tokenProvider,
                        sharePointSiteId: sharePointSiteId,
                    }), dispatcher = _b.dispatcher, replyOptions = _b.replyOptions, markDispatchIdle = _b.markDispatchIdle;
                    log.info("dispatching to agent", { sessionKey: route.sessionKey });
                    _9.label = 12;
                case 12:
                    _9.trys.push([12, 14, , 19]);
                    return [4 /*yield*/, core.channel.reply.dispatchReplyFromConfig({
                            ctx: ctxPayload,
                            cfg: cfg,
                            dispatcher: dispatcher,
                            replyOptions: replyOptions,
                        })];
                case 13:
                    _c = _9.sent(), queuedFinal = _c.queuedFinal, counts = _c.counts;
                    markDispatchIdle();
                    log.info("dispatch complete", { queuedFinal: queuedFinal, counts: counts });
                    if (!queuedFinal) {
                        if (isRoomish && historyKey) {
                            (0, plugin_sdk_1.clearHistoryEntriesIfEnabled)({
                                historyMap: conversationHistories,
                                historyKey: historyKey,
                                limit: historyLimit,
                            });
                        }
                        return [2 /*return*/];
                    }
                    finalCount = counts.final;
                    logVerboseMessage("msteams: delivered ".concat(finalCount, " reply").concat(finalCount === 1 ? "" : "ies", " to ").concat(teamsTo));
                    if (isRoomish && historyKey) {
                        (0, plugin_sdk_1.clearHistoryEntriesIfEnabled)({
                            historyMap: conversationHistories,
                            historyKey: historyKey,
                            limit: historyLimit,
                        });
                    }
                    return [3 /*break*/, 19];
                case 14:
                    err_2 = _9.sent();
                    log.error("dispatch failed", { error: String(err_2) });
                    (_8 = runtime.error) === null || _8 === void 0 ? void 0 : _8.call(runtime, "msteams dispatch failed: ".concat(String(err_2)));
                    _9.label = 15;
                case 15:
                    _9.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, context.sendActivity("\u26A0\uFE0F Agent failed: ".concat(err_2 instanceof Error ? err_2.message : String(err_2)))];
                case 16:
                    _9.sent();
                    return [3 /*break*/, 18];
                case 17:
                    _d = _9.sent();
                    return [3 /*break*/, 18];
                case 18: return [3 /*break*/, 19];
                case 19: return [2 /*return*/];
            }
        });
    }); };
    var inboundDebouncer = core.channel.debounce.createInboundDebouncer({
        debounceMs: inboundDebounceMs,
        buildKey: function (entry) {
            var _a, _b, _c, _d, _e, _f;
            var conversationId = (0, inbound_js_1.normalizeMSTeamsConversationId)((_b = (_a = entry.context.activity.conversation) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "");
            var senderId = (_f = (_d = (_c = entry.context.activity.from) === null || _c === void 0 ? void 0 : _c.aadObjectId) !== null && _d !== void 0 ? _d : (_e = entry.context.activity.from) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : "";
            if (!senderId || !conversationId) {
                return null;
            }
            return "msteams:".concat(appId, ":").concat(conversationId, ":").concat(senderId);
        },
        shouldDebounce: function (entry) {
            if (!entry.text.trim()) {
                return false;
            }
            if (entry.attachments.length > 0) {
                return false;
            }
            return !core.channel.text.hasControlCommand(entry.text, cfg);
        },
        onFlush: function (entries) { return __awaiter(_this, void 0, void 0, function () {
            var last, combinedText, combinedRawText, wasMentioned, implicitMention;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        last = entries.at(-1);
                        if (!last) {
                            return [2 /*return*/];
                        }
                        if (!(entries.length === 1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, handleTeamsMessageNow(last)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        combinedText = entries
                            .map(function (entry) { return entry.text; })
                            .filter(Boolean)
                            .join("\n");
                        if (!combinedText.trim()) {
                            return [2 /*return*/];
                        }
                        combinedRawText = entries
                            .map(function (entry) { return entry.rawText; })
                            .filter(Boolean)
                            .join("\n");
                        wasMentioned = entries.some(function (entry) { return entry.wasMentioned; });
                        implicitMention = entries.some(function (entry) { return entry.implicitMention; });
                        return [4 /*yield*/, handleTeamsMessageNow({
                                context: last.context,
                                rawText: combinedRawText,
                                text: combinedText,
                                attachments: [],
                                wasMentioned: wasMentioned,
                                implicitMention: implicitMention,
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        onError: function (err) {
            var _a;
            (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "msteams debounce flush failed: ".concat(String(err)));
        },
    });
    return function handleTeamsMessage(context) {
        return __awaiter(this, void 0, void 0, function () {
            var activity, rawText, text, attachments, wasMentioned, conversationId, replyToId, implicitMention;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        activity = context.activity;
                        rawText = (_b = (_a = activity.text) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
                        text = (0, inbound_js_1.stripMSTeamsMentionTags)(rawText);
                        attachments = Array.isArray(activity.attachments)
                            ? activity.attachments
                            : [];
                        wasMentioned = (0, inbound_js_1.wasMSTeamsBotMentioned)(activity);
                        conversationId = (0, inbound_js_1.normalizeMSTeamsConversationId)((_d = (_c = activity.conversation) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : "");
                        replyToId = (_e = activity.replyToId) !== null && _e !== void 0 ? _e : undefined;
                        implicitMention = Boolean(conversationId && replyToId && (0, sent_message_cache_js_1.wasMSTeamsMessageSent)(conversationId, replyToId));
                        return [4 /*yield*/, inboundDebouncer.enqueue({
                                context: context,
                                rawText: rawText,
                                text: text,
                                attachments: attachments,
                                wasMentioned: wasMentioned,
                                implicitMention: implicitMention,
                            })];
                    case 1:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
}
