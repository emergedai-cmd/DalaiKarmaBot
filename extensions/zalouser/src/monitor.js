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
exports.monitorZalouserProvider = monitorZalouserProvider;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var runtime_js_1 = require("./runtime.js");
var send_js_1 = require("./send.js");
var zca_js_1 = require("./zca.js");
var ZALOUSER_TEXT_LIMIT = 2000;
function normalizeZalouserEntry(entry) {
    return entry.replace(/^(zalouser|zlu):/i, "").trim();
}
function buildNameIndex(items, nameFn) {
    var _a, _b;
    var index = new Map();
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var name_1 = (_a = nameFn(item)) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
        if (!name_1) {
            continue;
        }
        var list = (_b = index.get(name_1)) !== null && _b !== void 0 ? _b : [];
        list.push(item);
        index.set(name_1, list);
    }
    return index;
}
function logVerbose(core, runtime, message) {
    if (core.logging.shouldLogVerbose()) {
        runtime.log("[zalouser] ".concat(message));
    }
}
function isSenderAllowed(senderId, allowFrom) {
    if (allowFrom.includes("*")) {
        return true;
    }
    var normalizedSenderId = senderId.toLowerCase();
    return allowFrom.some(function (entry) {
        var normalized = entry.toLowerCase().replace(/^(zalouser|zlu):/i, "");
        return normalized === normalizedSenderId;
    });
}
function normalizeGroupSlug(raw) {
    var _a;
    var trimmed = (_a = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase()) !== null && _a !== void 0 ? _a : "";
    if (!trimmed) {
        return "";
    }
    return trimmed
        .replace(/^#/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function isGroupAllowed(params) {
    var _a, _b, _c;
    var groups = (_a = params.groups) !== null && _a !== void 0 ? _a : {};
    var keys = Object.keys(groups);
    if (keys.length === 0) {
        return false;
    }
    var candidates = [
        params.groupId,
        "group:".concat(params.groupId),
        (_b = params.groupName) !== null && _b !== void 0 ? _b : "",
        normalizeGroupSlug((_c = params.groupName) !== null && _c !== void 0 ? _c : ""),
    ].filter(Boolean);
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        var entry = groups[candidate];
        if (!entry) {
            continue;
        }
        return entry.allow !== false && entry.enabled !== false;
    }
    var wildcard = groups["*"];
    if (wildcard) {
        return wildcard.allow !== false && wildcard.enabled !== false;
    }
    return false;
}
function startZcaListener(runtime, profile, onMessage, onError, abortSignal) {
    var _a;
    var buffer = "";
    var _b = (0, zca_js_1.runZcaStreaming)(["listen", "-r", "-k"], {
        profile: profile,
        onData: function (chunk) {
            var _a;
            buffer += chunk;
            var lines = buffer.split("\n");
            buffer = (_a = lines.pop()) !== null && _a !== void 0 ? _a : "";
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                var trimmed = line.trim();
                if (!trimmed) {
                    continue;
                }
                try {
                    var parsed = JSON.parse(trimmed);
                    onMessage(parsed);
                }
                catch (_b) {
                    // ignore non-JSON lines
                }
            }
        },
        onError: onError,
    }), proc = _b.proc, promise = _b.promise;
    (_a = proc.stderr) === null || _a === void 0 ? void 0 : _a.on("data", function (data) {
        var text = data.toString().trim();
        if (text) {
            runtime.error("[zalouser] zca stderr: ".concat(text));
        }
    });
    void promise.then(function (result) {
        if (!result.ok && !abortSignal.aborted) {
            onError(new Error(result.stderr || "zca listen exited with code ".concat(result.exitCode)));
        }
    });
    abortSignal.addEventListener("abort", function () {
        proc.kill("SIGTERM");
    }, { once: true });
    return proc;
}
function processMessage(message, account, config, core, runtime, statusSink) {
    return __awaiter(this, void 0, void 0, function () {
        var threadId, content, timestamp, metadata, isGroup, senderId, senderName, groupName, chatId, defaultGroupPolicy, groupPolicy, groups, allowed, dmPolicy, configAllowFrom, rawBody, shouldComputeAuth, storeAllowFrom, _a, effectiveAllowFrom, useAccessGroups, senderAllowedForCommands, commandAuthorized, allowed, _b, code, created, err_1, peer, route, fromLabel, storePath, envelopeOptions, previousTimestamp, body, ctxPayload;
        var _this = this;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    threadId = message.threadId, content = message.content, timestamp = message.timestamp, metadata = message.metadata;
                    if (!(content === null || content === void 0 ? void 0 : content.trim())) {
                        return [2 /*return*/];
                    }
                    isGroup = (_c = metadata === null || metadata === void 0 ? void 0 : metadata.isGroup) !== null && _c !== void 0 ? _c : false;
                    senderId = (_d = metadata === null || metadata === void 0 ? void 0 : metadata.fromId) !== null && _d !== void 0 ? _d : threadId;
                    senderName = (_e = metadata === null || metadata === void 0 ? void 0 : metadata.senderName) !== null && _e !== void 0 ? _e : "";
                    groupName = (_f = metadata === null || metadata === void 0 ? void 0 : metadata.threadName) !== null && _f !== void 0 ? _f : "";
                    chatId = threadId;
                    defaultGroupPolicy = (_h = (_g = config.channels) === null || _g === void 0 ? void 0 : _g.defaults) === null || _h === void 0 ? void 0 : _h.groupPolicy;
                    groupPolicy = (_k = (_j = account.config.groupPolicy) !== null && _j !== void 0 ? _j : defaultGroupPolicy) !== null && _k !== void 0 ? _k : "open";
                    groups = (_l = account.config.groups) !== null && _l !== void 0 ? _l : {};
                    if (isGroup) {
                        if (groupPolicy === "disabled") {
                            logVerbose(core, runtime, "zalouser: drop group ".concat(chatId, " (groupPolicy=disabled)"));
                            return [2 /*return*/];
                        }
                        if (groupPolicy === "allowlist") {
                            allowed = isGroupAllowed({ groupId: chatId, groupName: groupName, groups: groups });
                            if (!allowed) {
                                logVerbose(core, runtime, "zalouser: drop group ".concat(chatId, " (not allowlisted)"));
                                return [2 /*return*/];
                            }
                        }
                    }
                    dmPolicy = (_m = account.config.dmPolicy) !== null && _m !== void 0 ? _m : "pairing";
                    configAllowFrom = ((_o = account.config.allowFrom) !== null && _o !== void 0 ? _o : []).map(function (v) { return String(v); });
                    rawBody = content.trim();
                    shouldComputeAuth = core.channel.commands.shouldComputeCommandAuthorized(rawBody, config);
                    if (!(!isGroup && (dmPolicy !== "open" || shouldComputeAuth))) return [3 /*break*/, 2];
                    return [4 /*yield*/, core.channel.pairing.readAllowFromStore("zalouser").catch(function () { return []; })];
                case 1:
                    _a = _t.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = [];
                    _t.label = 3;
                case 3:
                    storeAllowFrom = _a;
                    effectiveAllowFrom = __spreadArray(__spreadArray([], configAllowFrom, true), storeAllowFrom, true);
                    useAccessGroups = ((_p = config.commands) === null || _p === void 0 ? void 0 : _p.useAccessGroups) !== false;
                    senderAllowedForCommands = isSenderAllowed(senderId, effectiveAllowFrom);
                    commandAuthorized = shouldComputeAuth
                        ? core.channel.commands.resolveCommandAuthorizedFromAuthorizers({
                            useAccessGroups: useAccessGroups,
                            authorizers: [
                                { configured: effectiveAllowFrom.length > 0, allowed: senderAllowedForCommands },
                            ],
                        })
                        : undefined;
                    if (!!isGroup) return [3 /*break*/, 11];
                    if (dmPolicy === "disabled") {
                        logVerbose(core, runtime, "Blocked zalouser DM from ".concat(senderId, " (dmPolicy=disabled)"));
                        return [2 /*return*/];
                    }
                    if (!(dmPolicy !== "open")) return [3 /*break*/, 11];
                    allowed = senderAllowedForCommands;
                    if (!!allowed) return [3 /*break*/, 11];
                    if (!(dmPolicy === "pairing")) return [3 /*break*/, 9];
                    return [4 /*yield*/, core.channel.pairing.upsertPairingRequest({
                            channel: "zalouser",
                            id: senderId,
                            meta: { name: senderName || undefined },
                        })];
                case 4:
                    _b = _t.sent(), code = _b.code, created = _b.created;
                    if (!created) return [3 /*break*/, 8];
                    logVerbose(core, runtime, "zalouser pairing request sender=".concat(senderId));
                    _t.label = 5;
                case 5:
                    _t.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, send_js_1.sendMessageZalouser)(chatId, core.channel.pairing.buildPairingReply({
                            channel: "zalouser",
                            idLine: "Your Zalo user id: ".concat(senderId),
                            code: code,
                        }), { profile: account.profile })];
                case 6:
                    _t.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _t.sent();
                    logVerbose(core, runtime, "zalouser pairing reply failed for ".concat(senderId, ": ").concat(String(err_1)));
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    logVerbose(core, runtime, "Blocked unauthorized zalouser sender ".concat(senderId, " (dmPolicy=").concat(dmPolicy, ")"));
                    _t.label = 10;
                case 10: return [2 /*return*/];
                case 11:
                    if (isGroup &&
                        core.channel.commands.isControlCommandMessage(rawBody, config) &&
                        commandAuthorized !== true) {
                        logVerbose(core, runtime, "zalouser: drop control command from unauthorized sender ".concat(senderId));
                        return [2 /*return*/];
                    }
                    peer = isGroup
                        ? { kind: "group", id: chatId }
                        : { kind: "group", id: senderId };
                    route = core.channel.routing.resolveAgentRoute({
                        cfg: config,
                        channel: "zalouser",
                        accountId: account.accountId,
                        peer: {
                            // Use "group" kind to avoid dmScope=main collapsing all DMs into the main session.
                            kind: peer.kind,
                            id: peer.id,
                        },
                    });
                    fromLabel = isGroup ? "group:".concat(chatId) : senderName || "user:".concat(senderId);
                    storePath = core.channel.session.resolveStorePath((_q = config.session) === null || _q === void 0 ? void 0 : _q.store, {
                        agentId: route.agentId,
                    });
                    envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(config);
                    previousTimestamp = core.channel.session.readSessionUpdatedAt({
                        storePath: storePath,
                        sessionKey: route.sessionKey,
                    });
                    body = core.channel.reply.formatAgentEnvelope({
                        channel: "Zalo Personal",
                        from: fromLabel,
                        timestamp: timestamp ? timestamp * 1000 : undefined,
                        previousTimestamp: previousTimestamp,
                        envelope: envelopeOptions,
                        body: rawBody,
                    });
                    ctxPayload = core.channel.reply.finalizeInboundContext({
                        Body: body,
                        RawBody: rawBody,
                        CommandBody: rawBody,
                        From: isGroup ? "zalouser:group:".concat(chatId) : "zalouser:".concat(senderId),
                        To: "zalouser:".concat(chatId),
                        SessionKey: route.sessionKey,
                        AccountId: route.accountId,
                        ChatType: isGroup ? "group" : "direct",
                        ConversationLabel: fromLabel,
                        SenderName: senderName || undefined,
                        SenderId: senderId,
                        CommandAuthorized: commandAuthorized,
                        Provider: "zalouser",
                        Surface: "zalouser",
                        MessageSid: (_r = message.msgId) !== null && _r !== void 0 ? _r : "".concat(timestamp),
                        OriginatingChannel: "zalouser",
                        OriginatingTo: "zalouser:".concat(chatId),
                    });
                    return [4 /*yield*/, core.channel.session.recordInboundSession({
                            storePath: storePath,
                            sessionKey: (_s = ctxPayload.SessionKey) !== null && _s !== void 0 ? _s : route.sessionKey,
                            ctx: ctxPayload,
                            onRecordError: function (err) {
                                var _a;
                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "zalouser: failed updating session meta: ".concat(String(err)));
                            },
                        })];
                case 12:
                    _t.sent();
                    return [4 /*yield*/, core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
                            ctx: ctxPayload,
                            cfg: config,
                            dispatcherOptions: {
                                deliver: function (payload) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, deliverZalouserReply({
                                                    payload: payload,
                                                    profile: account.profile,
                                                    chatId: chatId,
                                                    isGroup: isGroup,
                                                    runtime: runtime,
                                                    core: core,
                                                    config: config,
                                                    accountId: account.accountId,
                                                    statusSink: statusSink,
                                                    tableMode: core.channel.text.resolveMarkdownTableMode({
                                                        cfg: config,
                                                        channel: "zalouser",
                                                        accountId: account.accountId,
                                                    }),
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                                onError: function (err, info) {
                                    runtime.error("[".concat(account.accountId, "] Zalouser ").concat(info.kind, " reply failed: ").concat(String(err)));
                                },
                            },
                        })];
                case 13:
                    _t.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deliverZalouserReply(params) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, profile, chatId, isGroup, runtime, core, config, accountId, statusSink, tableMode, text, mediaList, first, _i, mediaList_1, mediaUrl, caption, err_2, chunkMode, chunks, _a, chunks_1, chunk, err_3;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    payload = params.payload, profile = params.profile, chatId = params.chatId, isGroup = params.isGroup, runtime = params.runtime, core = params.core, config = params.config, accountId = params.accountId, statusSink = params.statusSink;
                    tableMode = (_b = params.tableMode) !== null && _b !== void 0 ? _b : "code";
                    text = core.channel.text.convertMarkdownTables((_c = payload.text) !== null && _c !== void 0 ? _c : "", tableMode);
                    mediaList = ((_d = payload.mediaUrls) === null || _d === void 0 ? void 0 : _d.length)
                        ? payload.mediaUrls
                        : payload.mediaUrl
                            ? [payload.mediaUrl]
                            : [];
                    if (!(mediaList.length > 0)) return [3 /*break*/, 7];
                    first = true;
                    _i = 0, mediaList_1 = mediaList;
                    _e.label = 1;
                case 1:
                    if (!(_i < mediaList_1.length)) return [3 /*break*/, 6];
                    mediaUrl = mediaList_1[_i];
                    caption = first ? text : undefined;
                    first = false;
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    logVerbose(core, runtime, "Sending media to ".concat(chatId));
                    return [4 /*yield*/, (0, send_js_1.sendMessageZalouser)(chatId, caption !== null && caption !== void 0 ? caption : "", {
                            profile: profile,
                            mediaUrl: mediaUrl,
                            isGroup: isGroup,
                        })];
                case 3:
                    _e.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _e.sent();
                    runtime.error("Zalouser media send failed: ".concat(String(err_2)));
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
                case 7:
                    if (!text) return [3 /*break*/, 13];
                    chunkMode = core.channel.text.resolveChunkMode(config, "zalouser", accountId);
                    chunks = core.channel.text.chunkMarkdownTextWithMode(text, ZALOUSER_TEXT_LIMIT, chunkMode);
                    logVerbose(core, runtime, "Sending ".concat(chunks.length, " text chunk(s) to ").concat(chatId));
                    _a = 0, chunks_1 = chunks;
                    _e.label = 8;
                case 8:
                    if (!(_a < chunks_1.length)) return [3 /*break*/, 13];
                    chunk = chunks_1[_a];
                    _e.label = 9;
                case 9:
                    _e.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, (0, send_js_1.sendMessageZalouser)(chatId, chunk, { profile: profile, isGroup: isGroup })];
                case 10:
                    _e.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 12];
                case 11:
                    err_3 = _e.sent();
                    runtime.error("Zalouser message send failed: ".concat(String(err_3)));
                    return [3 /*break*/, 12];
                case 12:
                    _a++;
                    return [3 /*break*/, 8];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function monitorZalouserProvider(options) {
    return __awaiter(this, void 0, void 0, function () {
        var account, config, abortSignal, statusSink, runtime, core, stopped, proc, restartTimer, resolveRunning, profile, allowFromEntries, result, friends, byName, additions, mapping, unresolved, _i, allowFromEntries_1, entry, matches, match, id, allowFrom, groupsConfig, groupKeys, result, groups, byName, mapping, unresolved, nextGroups, _a, groupKeys_1, entry, cleaned, matches, match, id, err_4, stop, startListener, runningPromise;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    account = options.account, config = options.config;
                    abortSignal = options.abortSignal, statusSink = options.statusSink, runtime = options.runtime;
                    core = (0, runtime_js_1.getZalouserRuntime)();
                    stopped = false;
                    proc = null;
                    restartTimer = null;
                    resolveRunning = null;
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, 6, , 7]);
                    profile = account.profile;
                    allowFromEntries = ((_b = account.config.allowFrom) !== null && _b !== void 0 ? _b : [])
                        .map(function (entry) { return normalizeZalouserEntry(String(entry)); })
                        .filter(function (entry) { return entry && entry !== "*"; });
                    if (!(allowFromEntries.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, zca_js_1.runZca)(["friend", "list", "-j"], { profile: profile, timeout: 15000 })];
                case 2:
                    result = _l.sent();
                    if (result.ok) {
                        friends = (_c = (0, zca_js_1.parseJsonOutput)(result.stdout)) !== null && _c !== void 0 ? _c : [];
                        byName = buildNameIndex(friends, function (friend) { return friend.displayName; });
                        additions = [];
                        mapping = [];
                        unresolved = [];
                        for (_i = 0, allowFromEntries_1 = allowFromEntries; _i < allowFromEntries_1.length; _i++) {
                            entry = allowFromEntries_1[_i];
                            if (/^\d+$/.test(entry)) {
                                additions.push(entry);
                                continue;
                            }
                            matches = (_d = byName.get(entry.toLowerCase())) !== null && _d !== void 0 ? _d : [];
                            match = matches[0];
                            id = (match === null || match === void 0 ? void 0 : match.userId) ? String(match.userId) : undefined;
                            if (id) {
                                additions.push(id);
                                mapping.push("".concat(entry, "\u2192").concat(id));
                            }
                            else {
                                unresolved.push(entry);
                            }
                        }
                        allowFrom = (0, plugin_sdk_1.mergeAllowlist)({ existing: account.config.allowFrom, additions: additions });
                        account = __assign(__assign({}, account), { config: __assign(__assign({}, account.config), { allowFrom: allowFrom }) });
                        (0, plugin_sdk_1.summarizeMapping)("zalouser users", mapping, unresolved, runtime);
                    }
                    else {
                        (_e = runtime.log) === null || _e === void 0 ? void 0 : _e.call(runtime, "zalouser user resolve failed; using config entries. ".concat(result.stderr));
                    }
                    _l.label = 3;
                case 3:
                    groupsConfig = (_f = account.config.groups) !== null && _f !== void 0 ? _f : {};
                    groupKeys = Object.keys(groupsConfig).filter(function (key) { return key !== "*"; });
                    if (!(groupKeys.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, zca_js_1.runZca)(["group", "list", "-j"], { profile: profile, timeout: 15000 })];
                case 4:
                    result = _l.sent();
                    if (result.ok) {
                        groups = (_g = (0, zca_js_1.parseJsonOutput)(result.stdout)) !== null && _g !== void 0 ? _g : [];
                        byName = buildNameIndex(groups, function (group) { return group.name; });
                        mapping = [];
                        unresolved = [];
                        nextGroups = __assign({}, groupsConfig);
                        for (_a = 0, groupKeys_1 = groupKeys; _a < groupKeys_1.length; _a++) {
                            entry = groupKeys_1[_a];
                            cleaned = normalizeZalouserEntry(entry);
                            if (/^\d+$/.test(cleaned)) {
                                if (!nextGroups[cleaned]) {
                                    nextGroups[cleaned] = groupsConfig[entry];
                                }
                                mapping.push("".concat(entry, "\u2192").concat(cleaned));
                                continue;
                            }
                            matches = (_h = byName.get(cleaned.toLowerCase())) !== null && _h !== void 0 ? _h : [];
                            match = matches[0];
                            id = (match === null || match === void 0 ? void 0 : match.groupId) ? String(match.groupId) : undefined;
                            if (id) {
                                if (!nextGroups[id]) {
                                    nextGroups[id] = groupsConfig[entry];
                                }
                                mapping.push("".concat(entry, "\u2192").concat(id));
                            }
                            else {
                                unresolved.push(entry);
                            }
                        }
                        account = __assign(__assign({}, account), { config: __assign(__assign({}, account.config), { groups: nextGroups }) });
                        (0, plugin_sdk_1.summarizeMapping)("zalouser groups", mapping, unresolved, runtime);
                    }
                    else {
                        (_j = runtime.log) === null || _j === void 0 ? void 0 : _j.call(runtime, "zalouser group resolve failed; using config entries. ".concat(result.stderr));
                    }
                    _l.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_4 = _l.sent();
                    (_k = runtime.log) === null || _k === void 0 ? void 0 : _k.call(runtime, "zalouser resolve failed; using config entries. ".concat(String(err_4)));
                    return [3 /*break*/, 7];
                case 7:
                    stop = function () {
                        stopped = true;
                        if (restartTimer) {
                            clearTimeout(restartTimer);
                            restartTimer = null;
                        }
                        if (proc) {
                            proc.kill("SIGTERM");
                            proc = null;
                        }
                        resolveRunning === null || resolveRunning === void 0 ? void 0 : resolveRunning();
                    };
                    startListener = function () {
                        if (stopped || abortSignal.aborted) {
                            resolveRunning === null || resolveRunning === void 0 ? void 0 : resolveRunning();
                            return;
                        }
                        logVerbose(core, runtime, "[".concat(account.accountId, "] starting zca listener (profile=").concat(account.profile, ")"));
                        proc = startZcaListener(runtime, account.profile, function (msg) {
                            logVerbose(core, runtime, "[".concat(account.accountId, "] inbound message"));
                            statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastInboundAt: Date.now() });
                            processMessage(msg, account, config, core, runtime, statusSink).catch(function (err) {
                                runtime.error("[".concat(account.accountId, "] Failed to process message: ").concat(String(err)));
                            });
                        }, function (err) {
                            runtime.error("[".concat(account.accountId, "] zca listener error: ").concat(String(err)));
                            if (!stopped && !abortSignal.aborted) {
                                logVerbose(core, runtime, "[".concat(account.accountId, "] restarting listener in 5s..."));
                                restartTimer = setTimeout(startListener, 5000);
                            }
                            else {
                                resolveRunning === null || resolveRunning === void 0 ? void 0 : resolveRunning();
                            }
                        }, abortSignal);
                    };
                    runningPromise = new Promise(function (resolve) {
                        resolveRunning = resolve;
                        abortSignal.addEventListener("abort", function () { return resolve(); }, { once: true });
                    });
                    startListener();
                    // Wait for the running promise to resolve (on abort/stop)
                    return [4 /*yield*/, runningPromise];
                case 8:
                    // Wait for the running promise to resolve (on abort/stop)
                    _l.sent();
                    return [2 /*return*/, { stop: stop }];
            }
        });
    });
}
