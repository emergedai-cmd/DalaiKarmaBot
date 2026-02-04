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
exports.monitorMattermostProvider = monitorMattermostProvider;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var ws_1 = require("ws");
var runtime_js_1 = require("../runtime.js");
var accounts_js_1 = require("./accounts.js");
var client_js_1 = require("./client.js");
var monitor_helpers_js_1 = require("./monitor-helpers.js");
var send_js_1 = require("./send.js");
var RECENT_MATTERMOST_MESSAGE_TTL_MS = 5 * 60000;
var RECENT_MATTERMOST_MESSAGE_MAX = 2000;
var CHANNEL_CACHE_TTL_MS = 5 * 60000;
var USER_CACHE_TTL_MS = 10 * 60000;
var DEFAULT_ONCHAR_PREFIXES = [">", "!"];
var recentInboundMessages = (0, monitor_helpers_js_1.createDedupeCache)({
    ttlMs: RECENT_MATTERMOST_MESSAGE_TTL_MS,
    maxSize: RECENT_MATTERMOST_MESSAGE_MAX,
});
function resolveRuntime(opts) {
    var _a;
    return ((_a = opts.runtime) !== null && _a !== void 0 ? _a : {
        log: console.log,
        error: console.error,
        exit: function (code) {
            throw new Error("exit ".concat(code));
        },
    });
}
function normalizeMention(text, mention) {
    if (!mention) {
        return text.trim();
    }
    var escaped = mention.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var re = new RegExp("@".concat(escaped, "\\b"), "gi");
    return text.replace(re, " ").replace(/\s+/g, " ").trim();
}
function resolveOncharPrefixes(prefixes) {
    var _a;
    var cleaned = (_a = prefixes === null || prefixes === void 0 ? void 0 : prefixes.map(function (entry) { return entry.trim(); }).filter(Boolean)) !== null && _a !== void 0 ? _a : DEFAULT_ONCHAR_PREFIXES;
    return cleaned.length > 0 ? cleaned : DEFAULT_ONCHAR_PREFIXES;
}
function stripOncharPrefix(text, prefixes) {
    var trimmed = text.trimStart();
    for (var _i = 0, prefixes_1 = prefixes; _i < prefixes_1.length; _i++) {
        var prefix = prefixes_1[_i];
        if (!prefix) {
            continue;
        }
        if (trimmed.startsWith(prefix)) {
            return {
                triggered: true,
                stripped: trimmed.slice(prefix.length).trimStart(),
            };
        }
    }
    return { triggered: false, stripped: text };
}
function isSystemPost(post) {
    var _a;
    var type = (_a = post.type) === null || _a === void 0 ? void 0 : _a.trim();
    return Boolean(type);
}
function channelKind(channelType) {
    if (!channelType) {
        return "channel";
    }
    var normalized = channelType.trim().toUpperCase();
    if (normalized === "D") {
        return "dm";
    }
    if (normalized === "G") {
        return "group";
    }
    return "channel";
}
function channelChatType(kind) {
    if (kind === "dm") {
        return "direct";
    }
    if (kind === "group") {
        return "group";
    }
    return "channel";
}
function normalizeAllowEntry(entry) {
    var trimmed = entry.trim();
    if (!trimmed) {
        return "";
    }
    if (trimmed === "*") {
        return "*";
    }
    return trimmed
        .replace(/^(mattermost|user):/i, "")
        .replace(/^@/, "")
        .toLowerCase();
}
function normalizeAllowList(entries) {
    var normalized = entries.map(function (entry) { return normalizeAllowEntry(String(entry)); }).filter(Boolean);
    return Array.from(new Set(normalized));
}
function isSenderAllowed(params) {
    var allowFrom = params.allowFrom;
    if (allowFrom.length === 0) {
        return false;
    }
    if (allowFrom.includes("*")) {
        return true;
    }
    var normalizedSenderId = normalizeAllowEntry(params.senderId);
    var normalizedSenderName = params.senderName ? normalizeAllowEntry(params.senderName) : "";
    return allowFrom.some(function (entry) {
        return entry === normalizedSenderId || (normalizedSenderName && entry === normalizedSenderName);
    });
}
function buildMattermostAttachmentPlaceholder(mediaList) {
    if (mediaList.length === 0) {
        return "";
    }
    if (mediaList.length === 1) {
        var kind = mediaList[0].kind === "unknown" ? "document" : mediaList[0].kind;
        return "<media:".concat(kind, ">");
    }
    var allImages = mediaList.every(function (media) { return media.kind === "image"; });
    var label = allImages ? "image" : "file";
    var suffix = mediaList.length === 1 ? label : "".concat(label, "s");
    var tag = allImages ? "<media:image>" : "<media:document>";
    return "".concat(tag, " (").concat(mediaList.length, " ").concat(suffix, ")");
}
function buildMattermostMediaPayload(mediaList) {
    var first = mediaList[0];
    var mediaPaths = mediaList.map(function (media) { return media.path; });
    var mediaTypes = mediaList.map(function (media) { return media.contentType; }).filter(Boolean);
    return {
        MediaPath: first === null || first === void 0 ? void 0 : first.path,
        MediaType: first === null || first === void 0 ? void 0 : first.contentType,
        MediaUrl: first === null || first === void 0 ? void 0 : first.path,
        MediaPaths: mediaPaths.length > 0 ? mediaPaths : undefined,
        MediaUrls: mediaPaths.length > 0 ? mediaPaths : undefined,
        MediaTypes: mediaTypes.length > 0 ? mediaTypes : undefined,
    };
}
function buildMattermostWsUrl(baseUrl) {
    var normalized = (0, client_js_1.normalizeMattermostBaseUrl)(baseUrl);
    if (!normalized) {
        throw new Error("Mattermost baseUrl is required");
    }
    var wsBase = normalized.replace(/^http/i, "ws");
    return "".concat(wsBase, "/api/v4/websocket");
}
function monitorMattermostProvider() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var core, runtime, cfg, account, botToken, baseUrl, client, botUser, botUserId, botUsername, channelCache, userCache, logger, logVerboseMessage, mediaMaxBytes, historyLimit, channelHistories, fetchWithAuth, resolveMattermostMedia, sendTypingIndicator, resolveChannelInfo, resolveUserInfo, handlePost, inboundDebounceMs, debouncer, wsUrl, seq, connectOnce;
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    core = (0, runtime_js_1.getMattermostRuntime)();
                    runtime = resolveRuntime(opts);
                    cfg = (_a = opts.config) !== null && _a !== void 0 ? _a : core.config.loadConfig();
                    account = (0, accounts_js_1.resolveMattermostAccount)({
                        cfg: cfg,
                        accountId: opts.accountId,
                    });
                    botToken = ((_b = opts.botToken) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = account.botToken) === null || _c === void 0 ? void 0 : _c.trim());
                    if (!botToken) {
                        throw new Error("Mattermost bot token missing for account \"".concat(account.accountId, "\" (set channels.mattermost.accounts.").concat(account.accountId, ".botToken or MATTERMOST_BOT_TOKEN for default)."));
                    }
                    baseUrl = (0, client_js_1.normalizeMattermostBaseUrl)((_d = opts.baseUrl) !== null && _d !== void 0 ? _d : account.baseUrl);
                    if (!baseUrl) {
                        throw new Error("Mattermost baseUrl missing for account \"".concat(account.accountId, "\" (set channels.mattermost.accounts.").concat(account.accountId, ".baseUrl or MATTERMOST_URL for default)."));
                    }
                    client = (0, client_js_1.createMattermostClient)({ baseUrl: baseUrl, botToken: botToken });
                    return [4 /*yield*/, (0, client_js_1.fetchMattermostMe)(client)];
                case 1:
                    botUser = _o.sent();
                    botUserId = botUser.id;
                    botUsername = ((_e = botUser.username) === null || _e === void 0 ? void 0 : _e.trim()) || undefined;
                    (_f = runtime.log) === null || _f === void 0 ? void 0 : _f.call(runtime, "mattermost connected as ".concat(botUsername ? "@".concat(botUsername) : botUserId));
                    channelCache = new Map();
                    userCache = new Map();
                    logger = core.logging.getChildLogger({ module: "mattermost" });
                    logVerboseMessage = function (message) {
                        var _a;
                        if (!core.logging.shouldLogVerbose()) {
                            return;
                        }
                        (_a = logger.debug) === null || _a === void 0 ? void 0 : _a.call(logger, message);
                    };
                    mediaMaxBytes = (_g = (0, plugin_sdk_1.resolveChannelMediaMaxBytes)({
                        cfg: cfg,
                        resolveChannelLimitMb: function () { return undefined; },
                        accountId: account.accountId,
                    })) !== null && _g !== void 0 ? _g : 8 * 1024 * 1024;
                    historyLimit = Math.max(0, (_k = (_j = (_h = cfg.messages) === null || _h === void 0 ? void 0 : _h.groupChat) === null || _j === void 0 ? void 0 : _j.historyLimit) !== null && _k !== void 0 ? _k : plugin_sdk_1.DEFAULT_GROUP_HISTORY_LIMIT);
                    channelHistories = new Map();
                    fetchWithAuth = function (input, init) {
                        var headers = new Headers(init === null || init === void 0 ? void 0 : init.headers);
                        headers.set("Authorization", "Bearer ".concat(client.token));
                        return fetch(input, __assign(__assign({}, init), { headers: headers }));
                    };
                    resolveMattermostMedia = function (fileIds) { return __awaiter(_this, void 0, void 0, function () {
                        var ids, out, _i, ids_1, fileId, fetched, saved, contentType, err_1;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    ids = (fileIds !== null && fileIds !== void 0 ? fileIds : []).map(function (id) { return id === null || id === void 0 ? void 0 : id.trim(); }).filter(Boolean);
                                    if (ids.length === 0) {
                                        return [2 /*return*/, []];
                                    }
                                    out = [];
                                    _i = 0, ids_1 = ids;
                                    _e.label = 1;
                                case 1:
                                    if (!(_i < ids_1.length)) return [3 /*break*/, 7];
                                    fileId = ids_1[_i];
                                    _e.label = 2;
                                case 2:
                                    _e.trys.push([2, 5, , 6]);
                                    return [4 /*yield*/, core.channel.media.fetchRemoteMedia({
                                            url: "".concat(client.apiBaseUrl, "/files/").concat(fileId),
                                            fetchImpl: fetchWithAuth,
                                            filePathHint: fileId,
                                            maxBytes: mediaMaxBytes,
                                        })];
                                case 3:
                                    fetched = _e.sent();
                                    return [4 /*yield*/, core.channel.media.saveMediaBuffer(fetched.buffer, (_a = fetched.contentType) !== null && _a !== void 0 ? _a : undefined, "inbound", mediaMaxBytes)];
                                case 4:
                                    saved = _e.sent();
                                    contentType = (_c = (_b = saved.contentType) !== null && _b !== void 0 ? _b : fetched.contentType) !== null && _c !== void 0 ? _c : undefined;
                                    out.push({
                                        path: saved.path,
                                        contentType: contentType,
                                        kind: core.media.mediaKindFromMime(contentType),
                                    });
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_1 = _e.sent();
                                    (_d = logger.debug) === null || _d === void 0 ? void 0 : _d.call(logger, "mattermost: failed to download file ".concat(fileId, ": ").concat(String(err_1)));
                                    return [3 /*break*/, 6];
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 7: return [2 /*return*/, out];
                            }
                        });
                    }); };
                    sendTypingIndicator = function (channelId, parentId) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, client_js_1.sendMattermostTyping)(client, { channelId: channelId, parentId: parentId })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    resolveChannelInfo = function (channelId) { return __awaiter(_this, void 0, void 0, function () {
                        var cached, info, err_2;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    cached = channelCache.get(channelId);
                                    if (cached && cached.expiresAt > Date.now()) {
                                        return [2 /*return*/, cached.value];
                                    }
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, (0, client_js_1.fetchMattermostChannel)(client, channelId)];
                                case 2:
                                    info = _b.sent();
                                    channelCache.set(channelId, {
                                        value: info,
                                        expiresAt: Date.now() + CHANNEL_CACHE_TTL_MS,
                                    });
                                    return [2 /*return*/, info];
                                case 3:
                                    err_2 = _b.sent();
                                    (_a = logger.debug) === null || _a === void 0 ? void 0 : _a.call(logger, "mattermost: channel lookup failed: ".concat(String(err_2)));
                                    channelCache.set(channelId, {
                                        value: null,
                                        expiresAt: Date.now() + CHANNEL_CACHE_TTL_MS,
                                    });
                                    return [2 /*return*/, null];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    resolveUserInfo = function (userId) { return __awaiter(_this, void 0, void 0, function () {
                        var cached, info, err_3;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    cached = userCache.get(userId);
                                    if (cached && cached.expiresAt > Date.now()) {
                                        return [2 /*return*/, cached.value];
                                    }
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, (0, client_js_1.fetchMattermostUser)(client, userId)];
                                case 2:
                                    info = _b.sent();
                                    userCache.set(userId, {
                                        value: info,
                                        expiresAt: Date.now() + USER_CACHE_TTL_MS,
                                    });
                                    return [2 /*return*/, info];
                                case 3:
                                    err_3 = _b.sent();
                                    (_a = logger.debug) === null || _a === void 0 ? void 0 : _a.call(logger, "mattermost: user lookup failed: ".concat(String(err_3)));
                                    userCache.set(userId, {
                                        value: null,
                                        expiresAt: Date.now() + USER_CACHE_TTL_MS,
                                    });
                                    return [2 /*return*/, null];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    handlePost = function (post, payload, messageIds) { return __awaiter(_this, void 0, void 0, function () {
                        var channelId, allMessageIds, dedupeEntries, senderId, channelInfo, channelType, kind, chatType, senderName, _a, rawText, dmPolicy, defaultGroupPolicy, groupPolicy, configAllowFrom, configGroupAllowFrom, storeAllowFrom, _b, effectiveAllowFrom, effectiveGroupAllowFrom, allowTextCommands, hasControlCommand, isControlCommand, useAccessGroups, senderAllowedForCommands, groupAllowedForCommands, commandGate, commandAuthorized, _c, code, created, err_4, teamId, channelName, channelDisplay, roomLabel, route, baseSessionKey, threadRootId, threadKeys, sessionKey, historyKey, mentionRegexes, wasMentioned, pendingBody, pendingSender, recordPendingHistory, oncharEnabled, oncharPrefixes, oncharResult, oncharTriggered, shouldRequireMention, shouldBypassMention, effectiveWasMentioned, canDetectMention, mediaList, mediaPlaceholder, bodySource, baseText, bodyText, fromLabel, preview, inboundLabel, textWithId, body, combinedBody, to, mediaPayload, ctxPayload, sessionCfg, storePath, previewLine, textLimit, tableMode, prefixContext, typingCallbacks, _d, dispatcher, replyOptions, markDispatchIdle;
                        var _this = this;
                        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
                        return __generator(this, function (_18) {
                            switch (_18.label) {
                                case 0:
                                    channelId = (_g = (_e = post.channel_id) !== null && _e !== void 0 ? _e : (_f = payload.data) === null || _f === void 0 ? void 0 : _f.channel_id) !== null && _g !== void 0 ? _g : (_h = payload.broadcast) === null || _h === void 0 ? void 0 : _h.channel_id;
                                    if (!channelId) {
                                        return [2 /*return*/];
                                    }
                                    allMessageIds = (messageIds === null || messageIds === void 0 ? void 0 : messageIds.length) ? messageIds : post.id ? [post.id] : [];
                                    if (allMessageIds.length === 0) {
                                        return [2 /*return*/];
                                    }
                                    dedupeEntries = allMessageIds.map(function (id) {
                                        return recentInboundMessages.check("".concat(account.accountId, ":").concat(id));
                                    });
                                    if (dedupeEntries.length > 0 && dedupeEntries.every(Boolean)) {
                                        return [2 /*return*/];
                                    }
                                    senderId = (_j = post.user_id) !== null && _j !== void 0 ? _j : (_k = payload.broadcast) === null || _k === void 0 ? void 0 : _k.user_id;
                                    if (!senderId) {
                                        return [2 /*return*/];
                                    }
                                    if (senderId === botUserId) {
                                        return [2 /*return*/];
                                    }
                                    if (isSystemPost(post)) {
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, resolveChannelInfo(channelId)];
                                case 1:
                                    channelInfo = _18.sent();
                                    channelType = (_o = (_m = (_l = payload.data) === null || _l === void 0 ? void 0 : _l.channel_type) !== null && _m !== void 0 ? _m : channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type) !== null && _o !== void 0 ? _o : undefined;
                                    kind = channelKind(channelType);
                                    chatType = channelChatType(kind);
                                    _a = ((_q = (_p = payload.data) === null || _p === void 0 ? void 0 : _p.sender_name) === null || _q === void 0 ? void 0 : _q.trim());
                                    if (_a) return [3 /*break*/, 3];
                                    return [4 /*yield*/, resolveUserInfo(senderId)];
                                case 2:
                                    _a = ((_s = (_r = (_18.sent())) === null || _r === void 0 ? void 0 : _r.username) === null || _s === void 0 ? void 0 : _s.trim());
                                    _18.label = 3;
                                case 3:
                                    senderName = _a ||
                                        senderId;
                                    rawText = ((_t = post.message) === null || _t === void 0 ? void 0 : _t.trim()) || "";
                                    dmPolicy = (_u = account.config.dmPolicy) !== null && _u !== void 0 ? _u : "pairing";
                                    defaultGroupPolicy = (_w = (_v = cfg.channels) === null || _v === void 0 ? void 0 : _v.defaults) === null || _w === void 0 ? void 0 : _w.groupPolicy;
                                    groupPolicy = (_y = (_x = account.config.groupPolicy) !== null && _x !== void 0 ? _x : defaultGroupPolicy) !== null && _y !== void 0 ? _y : "allowlist";
                                    configAllowFrom = normalizeAllowList((_z = account.config.allowFrom) !== null && _z !== void 0 ? _z : []);
                                    configGroupAllowFrom = normalizeAllowList((_0 = account.config.groupAllowFrom) !== null && _0 !== void 0 ? _0 : []);
                                    _b = normalizeAllowList;
                                    return [4 /*yield*/, core.channel.pairing.readAllowFromStore("mattermost").catch(function () { return []; })];
                                case 4:
                                    storeAllowFrom = _b.apply(void 0, [_18.sent()]);
                                    effectiveAllowFrom = Array.from(new Set(__spreadArray(__spreadArray([], configAllowFrom, true), storeAllowFrom, true)));
                                    effectiveGroupAllowFrom = Array.from(new Set(__spreadArray(__spreadArray([], (configGroupAllowFrom.length > 0 ? configGroupAllowFrom : configAllowFrom), true), storeAllowFrom, true)));
                                    allowTextCommands = core.channel.commands.shouldHandleTextCommands({
                                        cfg: cfg,
                                        surface: "mattermost",
                                    });
                                    hasControlCommand = core.channel.text.hasControlCommand(rawText, cfg);
                                    isControlCommand = allowTextCommands && hasControlCommand;
                                    useAccessGroups = ((_1 = cfg.commands) === null || _1 === void 0 ? void 0 : _1.useAccessGroups) !== false;
                                    senderAllowedForCommands = isSenderAllowed({
                                        senderId: senderId,
                                        senderName: senderName,
                                        allowFrom: effectiveAllowFrom,
                                    });
                                    groupAllowedForCommands = isSenderAllowed({
                                        senderId: senderId,
                                        senderName: senderName,
                                        allowFrom: effectiveGroupAllowFrom,
                                    });
                                    commandGate = (0, plugin_sdk_1.resolveControlCommandGate)({
                                        useAccessGroups: useAccessGroups,
                                        authorizers: [
                                            { configured: effectiveAllowFrom.length > 0, allowed: senderAllowedForCommands },
                                            {
                                                configured: effectiveGroupAllowFrom.length > 0,
                                                allowed: groupAllowedForCommands,
                                            },
                                        ],
                                        allowTextCommands: allowTextCommands,
                                        hasControlCommand: hasControlCommand,
                                    });
                                    commandAuthorized = kind === "dm"
                                        ? dmPolicy === "open" || senderAllowedForCommands
                                        : commandGate.commandAuthorized;
                                    if (!(kind === "dm")) return [3 /*break*/, 13];
                                    if (dmPolicy === "disabled") {
                                        logVerboseMessage("mattermost: drop dm (dmPolicy=disabled sender=".concat(senderId, ")"));
                                        return [2 /*return*/];
                                    }
                                    if (!(dmPolicy !== "open" && !senderAllowedForCommands)) return [3 /*break*/, 12];
                                    if (!(dmPolicy === "pairing")) return [3 /*break*/, 10];
                                    return [4 /*yield*/, core.channel.pairing.upsertPairingRequest({
                                            channel: "mattermost",
                                            id: senderId,
                                            meta: { name: senderName },
                                        })];
                                case 5:
                                    _c = _18.sent(), code = _c.code, created = _c.created;
                                    logVerboseMessage("mattermost: pairing request sender=".concat(senderId, " created=").concat(created));
                                    if (!created) return [3 /*break*/, 9];
                                    _18.label = 6;
                                case 6:
                                    _18.trys.push([6, 8, , 9]);
                                    return [4 /*yield*/, (0, send_js_1.sendMessageMattermost)("user:".concat(senderId), core.channel.pairing.buildPairingReply({
                                            channel: "mattermost",
                                            idLine: "Your Mattermost user id: ".concat(senderId),
                                            code: code,
                                        }), { accountId: account.accountId })];
                                case 7:
                                    _18.sent();
                                    (_2 = opts.statusSink) === null || _2 === void 0 ? void 0 : _2.call(opts, { lastOutboundAt: Date.now() });
                                    return [3 /*break*/, 9];
                                case 8:
                                    err_4 = _18.sent();
                                    logVerboseMessage("mattermost: pairing reply failed for ".concat(senderId, ": ").concat(String(err_4)));
                                    return [3 /*break*/, 9];
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    logVerboseMessage("mattermost: drop dm sender=".concat(senderId, " (dmPolicy=").concat(dmPolicy, ")"));
                                    _18.label = 11;
                                case 11: return [2 /*return*/];
                                case 12: return [3 /*break*/, 14];
                                case 13:
                                    if (groupPolicy === "disabled") {
                                        logVerboseMessage("mattermost: drop group message (groupPolicy=disabled)");
                                        return [2 /*return*/];
                                    }
                                    if (groupPolicy === "allowlist") {
                                        if (effectiveGroupAllowFrom.length === 0) {
                                            logVerboseMessage("mattermost: drop group message (no group allowlist)");
                                            return [2 /*return*/];
                                        }
                                        if (!groupAllowedForCommands) {
                                            logVerboseMessage("mattermost: drop group sender=".concat(senderId, " (not in groupAllowFrom)"));
                                            return [2 /*return*/];
                                        }
                                    }
                                    _18.label = 14;
                                case 14:
                                    if (kind !== "dm" && commandGate.shouldBlock) {
                                        (0, plugin_sdk_1.logInboundDrop)({
                                            log: logVerboseMessage,
                                            channel: "mattermost",
                                            reason: "control command (unauthorized)",
                                            target: senderId,
                                        });
                                        return [2 /*return*/];
                                    }
                                    teamId = (_5 = (_4 = (_3 = payload.data) === null || _3 === void 0 ? void 0 : _3.team_id) !== null && _4 !== void 0 ? _4 : channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.team_id) !== null && _5 !== void 0 ? _5 : undefined;
                                    channelName = (_8 = (_7 = (_6 = payload.data) === null || _6 === void 0 ? void 0 : _6.channel_name) !== null && _7 !== void 0 ? _7 : channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name) !== null && _8 !== void 0 ? _8 : "";
                                    channelDisplay = (_11 = (_10 = (_9 = payload.data) === null || _9 === void 0 ? void 0 : _9.channel_display_name) !== null && _10 !== void 0 ? _10 : channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.display_name) !== null && _11 !== void 0 ? _11 : channelName;
                                    roomLabel = channelName ? "#".concat(channelName) : channelDisplay || "#".concat(channelId);
                                    route = core.channel.routing.resolveAgentRoute({
                                        cfg: cfg,
                                        channel: "mattermost",
                                        accountId: account.accountId,
                                        teamId: teamId,
                                        peer: {
                                            kind: kind,
                                            id: kind === "dm" ? senderId : channelId,
                                        },
                                    });
                                    baseSessionKey = route.sessionKey;
                                    threadRootId = ((_12 = post.root_id) === null || _12 === void 0 ? void 0 : _12.trim()) || undefined;
                                    threadKeys = (0, monitor_helpers_js_1.resolveThreadSessionKeys)({
                                        baseSessionKey: baseSessionKey,
                                        threadId: threadRootId,
                                        parentSessionKey: threadRootId ? baseSessionKey : undefined,
                                    });
                                    sessionKey = threadKeys.sessionKey;
                                    historyKey = kind === "dm" ? null : sessionKey;
                                    mentionRegexes = core.channel.mentions.buildMentionRegexes(cfg, route.agentId);
                                    wasMentioned = kind !== "dm" &&
                                        ((botUsername ? rawText.toLowerCase().includes("@".concat(botUsername.toLowerCase())) : false) ||
                                            core.channel.mentions.matchesMentionPatterns(rawText, mentionRegexes));
                                    pendingBody = rawText ||
                                        (((_13 = post.file_ids) === null || _13 === void 0 ? void 0 : _13.length)
                                            ? "[Mattermost ".concat(post.file_ids.length === 1 ? "file" : "files", "]")
                                            : "");
                                    pendingSender = senderName;
                                    recordPendingHistory = function () {
                                        var _a;
                                        var trimmed = pendingBody.trim();
                                        (0, plugin_sdk_1.recordPendingHistoryEntryIfEnabled)({
                                            historyMap: channelHistories,
                                            limit: historyLimit,
                                            historyKey: historyKey !== null && historyKey !== void 0 ? historyKey : "",
                                            entry: historyKey && trimmed
                                                ? {
                                                    sender: pendingSender,
                                                    body: trimmed,
                                                    timestamp: typeof post.create_at === "number" ? post.create_at : undefined,
                                                    messageId: (_a = post.id) !== null && _a !== void 0 ? _a : undefined,
                                                }
                                                : null,
                                        });
                                    };
                                    oncharEnabled = account.chatmode === "onchar" && kind !== "dm";
                                    oncharPrefixes = oncharEnabled ? resolveOncharPrefixes(account.oncharPrefixes) : [];
                                    oncharResult = oncharEnabled
                                        ? stripOncharPrefix(rawText, oncharPrefixes)
                                        : { triggered: false, stripped: rawText };
                                    oncharTriggered = oncharResult.triggered;
                                    shouldRequireMention = kind !== "dm" &&
                                        core.channel.groups.resolveRequireMention({
                                            cfg: cfg,
                                            channel: "mattermost",
                                            accountId: account.accountId,
                                            groupId: channelId,
                                        });
                                    shouldBypassMention = isControlCommand && shouldRequireMention && !wasMentioned && commandAuthorized;
                                    effectiveWasMentioned = wasMentioned || shouldBypassMention || oncharTriggered;
                                    canDetectMention = Boolean(botUsername) || mentionRegexes.length > 0;
                                    if (oncharEnabled && !oncharTriggered && !wasMentioned && !isControlCommand) {
                                        recordPendingHistory();
                                        return [2 /*return*/];
                                    }
                                    if (kind !== "dm" && shouldRequireMention && canDetectMention) {
                                        if (!effectiveWasMentioned) {
                                            recordPendingHistory();
                                            return [2 /*return*/];
                                        }
                                    }
                                    return [4 /*yield*/, resolveMattermostMedia(post.file_ids)];
                                case 15:
                                    mediaList = _18.sent();
                                    mediaPlaceholder = buildMattermostAttachmentPlaceholder(mediaList);
                                    bodySource = oncharTriggered ? oncharResult.stripped : rawText;
                                    baseText = [bodySource, mediaPlaceholder].filter(Boolean).join("\n").trim();
                                    bodyText = normalizeMention(baseText, botUsername);
                                    if (!bodyText) {
                                        return [2 /*return*/];
                                    }
                                    core.channel.activity.record({
                                        channel: "mattermost",
                                        accountId: account.accountId,
                                        direction: "inbound",
                                    });
                                    fromLabel = (0, monitor_helpers_js_1.formatInboundFromLabel)({
                                        isGroup: kind !== "dm",
                                        groupLabel: channelDisplay || roomLabel,
                                        groupId: channelId,
                                        groupFallback: roomLabel || "Channel",
                                        directLabel: senderName,
                                        directId: senderId,
                                    });
                                    preview = bodyText.replace(/\s+/g, " ").slice(0, 160);
                                    inboundLabel = kind === "dm"
                                        ? "Mattermost DM from ".concat(senderName)
                                        : "Mattermost message in ".concat(roomLabel, " from ").concat(senderName);
                                    core.system.enqueueSystemEvent("".concat(inboundLabel, ": ").concat(preview), {
                                        sessionKey: sessionKey,
                                        contextKey: "mattermost:message:".concat(channelId, ":").concat((_14 = post.id) !== null && _14 !== void 0 ? _14 : "unknown"),
                                    });
                                    textWithId = "".concat(bodyText, "\n[mattermost message id: ").concat((_15 = post.id) !== null && _15 !== void 0 ? _15 : "unknown", " channel: ").concat(channelId, "]");
                                    body = core.channel.reply.formatInboundEnvelope({
                                        channel: "Mattermost",
                                        from: fromLabel,
                                        timestamp: typeof post.create_at === "number" ? post.create_at : undefined,
                                        body: textWithId,
                                        chatType: chatType,
                                        sender: { name: senderName, id: senderId },
                                    });
                                    combinedBody = body;
                                    if (historyKey) {
                                        combinedBody = (0, plugin_sdk_1.buildPendingHistoryContextFromMap)({
                                            historyMap: channelHistories,
                                            historyKey: historyKey,
                                            limit: historyLimit,
                                            currentMessage: combinedBody,
                                            formatEntry: function (entry) {
                                                return core.channel.reply.formatInboundEnvelope({
                                                    channel: "Mattermost",
                                                    from: fromLabel,
                                                    timestamp: entry.timestamp,
                                                    body: "".concat(entry.body).concat(entry.messageId ? " [id:".concat(entry.messageId, " channel:").concat(channelId, "]") : ""),
                                                    chatType: chatType,
                                                    senderLabel: entry.sender,
                                                });
                                            },
                                        });
                                    }
                                    to = kind === "dm" ? "user:".concat(senderId) : "channel:".concat(channelId);
                                    mediaPayload = buildMattermostMediaPayload(mediaList);
                                    ctxPayload = core.channel.reply.finalizeInboundContext(__assign({ Body: combinedBody, RawBody: bodyText, CommandBody: bodyText, From: kind === "dm"
                                            ? "mattermost:".concat(senderId)
                                            : kind === "group"
                                                ? "mattermost:group:".concat(channelId)
                                                : "mattermost:channel:".concat(channelId), To: to, SessionKey: sessionKey, ParentSessionKey: threadKeys.parentSessionKey, AccountId: route.accountId, ChatType: chatType, ConversationLabel: fromLabel, GroupSubject: kind !== "dm" ? channelDisplay || roomLabel : undefined, GroupChannel: channelName ? "#".concat(channelName) : undefined, GroupSpace: teamId, SenderName: senderName, SenderId: senderId, Provider: "mattermost", Surface: "mattermost", MessageSid: (_16 = post.id) !== null && _16 !== void 0 ? _16 : undefined, MessageSids: allMessageIds.length > 1 ? allMessageIds : undefined, MessageSidFirst: allMessageIds.length > 1 ? allMessageIds[0] : undefined, MessageSidLast: allMessageIds.length > 1 ? allMessageIds[allMessageIds.length - 1] : undefined, ReplyToId: threadRootId, MessageThreadId: threadRootId, Timestamp: typeof post.create_at === "number" ? post.create_at : undefined, WasMentioned: kind !== "dm" ? effectiveWasMentioned : undefined, CommandAuthorized: commandAuthorized, OriginatingChannel: "mattermost", OriginatingTo: to }, mediaPayload));
                                    if (!(kind === "dm")) return [3 /*break*/, 17];
                                    sessionCfg = cfg.session;
                                    storePath = core.channel.session.resolveStorePath(sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.store, {
                                        agentId: route.agentId,
                                    });
                                    return [4 /*yield*/, core.channel.session.updateLastRoute({
                                            storePath: storePath,
                                            sessionKey: route.mainSessionKey,
                                            deliveryContext: {
                                                channel: "mattermost",
                                                to: to,
                                                accountId: route.accountId,
                                            },
                                        })];
                                case 16:
                                    _18.sent();
                                    _18.label = 17;
                                case 17:
                                    previewLine = bodyText.slice(0, 200).replace(/\n/g, "\\n");
                                    logVerboseMessage("mattermost inbound: from=".concat(ctxPayload.From, " len=").concat(bodyText.length, " preview=\"").concat(previewLine, "\""));
                                    textLimit = core.channel.text.resolveTextChunkLimit(cfg, "mattermost", account.accountId, {
                                        fallbackLimit: (_17 = account.textChunkLimit) !== null && _17 !== void 0 ? _17 : 4000,
                                    });
                                    tableMode = core.channel.text.resolveMarkdownTableMode({
                                        cfg: cfg,
                                        channel: "mattermost",
                                        accountId: account.accountId,
                                    });
                                    prefixContext = (0, plugin_sdk_1.createReplyPrefixContext)({ cfg: cfg, agentId: route.agentId });
                                    typingCallbacks = (0, plugin_sdk_1.createTypingCallbacks)({
                                        start: function () { return sendTypingIndicator(channelId, threadRootId); },
                                        onStartError: function (err) {
                                            (0, plugin_sdk_1.logTypingFailure)({
                                                log: function (message) { var _a; return (_a = logger.debug) === null || _a === void 0 ? void 0 : _a.call(logger, message); },
                                                channel: "mattermost",
                                                target: channelId,
                                                error: err,
                                            });
                                        },
                                    });
                                    _d = core.channel.reply.createReplyDispatcherWithTyping({
                                        responsePrefix: prefixContext.responsePrefix,
                                        responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
                                        humanDelay: core.channel.reply.resolveHumanDelayConfig(cfg, route.agentId),
                                        deliver: function (payload) { return __awaiter(_this, void 0, void 0, function () {
                                            var mediaUrls, text, chunkMode, chunks, _i, _a, chunk, first, _b, mediaUrls_1, mediaUrl, caption;
                                            var _c, _d, _e;
                                            return __generator(this, function (_f) {
                                                switch (_f.label) {
                                                    case 0:
                                                        mediaUrls = (_c = payload.mediaUrls) !== null && _c !== void 0 ? _c : (payload.mediaUrl ? [payload.mediaUrl] : []);
                                                        text = core.channel.text.convertMarkdownTables((_d = payload.text) !== null && _d !== void 0 ? _d : "", tableMode);
                                                        if (!(mediaUrls.length === 0)) return [3 /*break*/, 5];
                                                        chunkMode = core.channel.text.resolveChunkMode(cfg, "mattermost", account.accountId);
                                                        chunks = core.channel.text.chunkMarkdownTextWithMode(text, textLimit, chunkMode);
                                                        _i = 0, _a = chunks.length > 0 ? chunks : [text];
                                                        _f.label = 1;
                                                    case 1:
                                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                                        chunk = _a[_i];
                                                        if (!chunk) {
                                                            return [3 /*break*/, 3];
                                                        }
                                                        return [4 /*yield*/, (0, send_js_1.sendMessageMattermost)(to, chunk, {
                                                                accountId: account.accountId,
                                                                replyToId: threadRootId,
                                                            })];
                                                    case 2:
                                                        _f.sent();
                                                        _f.label = 3;
                                                    case 3:
                                                        _i++;
                                                        return [3 /*break*/, 1];
                                                    case 4: return [3 /*break*/, 9];
                                                    case 5:
                                                        first = true;
                                                        _b = 0, mediaUrls_1 = mediaUrls;
                                                        _f.label = 6;
                                                    case 6:
                                                        if (!(_b < mediaUrls_1.length)) return [3 /*break*/, 9];
                                                        mediaUrl = mediaUrls_1[_b];
                                                        caption = first ? text : "";
                                                        first = false;
                                                        return [4 /*yield*/, (0, send_js_1.sendMessageMattermost)(to, caption, {
                                                                accountId: account.accountId,
                                                                mediaUrl: mediaUrl,
                                                                replyToId: threadRootId,
                                                            })];
                                                    case 7:
                                                        _f.sent();
                                                        _f.label = 8;
                                                    case 8:
                                                        _b++;
                                                        return [3 /*break*/, 6];
                                                    case 9:
                                                        (_e = runtime.log) === null || _e === void 0 ? void 0 : _e.call(runtime, "delivered reply to ".concat(to));
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); },
                                        onError: function (err, info) {
                                            var _a;
                                            (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "mattermost ".concat(info.kind, " reply failed: ").concat(String(err)));
                                        },
                                        onReplyStart: typingCallbacks.onReplyStart,
                                    }), dispatcher = _d.dispatcher, replyOptions = _d.replyOptions, markDispatchIdle = _d.markDispatchIdle;
                                    return [4 /*yield*/, core.channel.reply.dispatchReplyFromConfig({
                                            ctx: ctxPayload,
                                            cfg: cfg,
                                            dispatcher: dispatcher,
                                            replyOptions: __assign(__assign({}, replyOptions), { disableBlockStreaming: typeof account.blockStreaming === "boolean" ? !account.blockStreaming : undefined, onModelSelected: prefixContext.onModelSelected }),
                                        })];
                                case 18:
                                    _18.sent();
                                    markDispatchIdle();
                                    if (historyKey) {
                                        (0, plugin_sdk_1.clearHistoryEntriesIfEnabled)({
                                            historyMap: channelHistories,
                                            historyKey: historyKey,
                                            limit: historyLimit,
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    inboundDebounceMs = core.channel.debounce.resolveInboundDebounceMs({
                        cfg: cfg,
                        channel: "mattermost",
                    });
                    debouncer = core.channel.debounce.createInboundDebouncer({
                        debounceMs: inboundDebounceMs,
                        buildKey: function (entry) {
                            var _a, _b, _c, _d, _e;
                            var channelId = (_c = (_a = entry.post.channel_id) !== null && _a !== void 0 ? _a : (_b = entry.payload.data) === null || _b === void 0 ? void 0 : _b.channel_id) !== null && _c !== void 0 ? _c : (_d = entry.payload.broadcast) === null || _d === void 0 ? void 0 : _d.channel_id;
                            if (!channelId) {
                                return null;
                            }
                            var threadId = (_e = entry.post.root_id) === null || _e === void 0 ? void 0 : _e.trim();
                            var threadKey = threadId ? "thread:".concat(threadId) : "channel";
                            return "mattermost:".concat(account.accountId, ":").concat(channelId, ":").concat(threadKey);
                        },
                        shouldDebounce: function (entry) {
                            var _a, _b;
                            if (entry.post.file_ids && entry.post.file_ids.length > 0) {
                                return false;
                            }
                            var text = (_b = (_a = entry.post.message) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
                            if (!text) {
                                return false;
                            }
                            return !core.channel.text.hasControlCommand(text, cfg);
                        },
                        onFlush: function (entries) { return __awaiter(_this, void 0, void 0, function () {
                            var last, combinedText, mergedPost, ids;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        last = entries.at(-1);
                                        if (!last) {
                                            return [2 /*return*/];
                                        }
                                        if (!(entries.length === 1)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, handlePost(last.post, last.payload)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                    case 2:
                                        combinedText = entries
                                            .map(function (entry) { var _a, _b; return (_b = (_a = entry.post.message) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ""; })
                                            .filter(Boolean)
                                            .join("\n");
                                        mergedPost = __assign(__assign({}, last.post), { message: combinedText, file_ids: [] });
                                        ids = entries.map(function (entry) { return entry.post.id; }).filter(Boolean);
                                        return [4 /*yield*/, handlePost(mergedPost, last.payload, ids.length > 0 ? ids : undefined)];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                        onError: function (err) {
                            var _a;
                            (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "mattermost debounce flush failed: ".concat(String(err)));
                        },
                    });
                    wsUrl = buildMattermostWsUrl(baseUrl);
                    seq = 1;
                    connectOnce = function () { return __awaiter(_this, void 0, void 0, function () {
                        var ws, onAbort;
                        var _this = this;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    ws = new ws_1.default(wsUrl);
                                    onAbort = function () { return ws.close(); };
                                    (_a = opts.abortSignal) === null || _a === void 0 ? void 0 : _a.addEventListener("abort", onAbort, { once: true });
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            ws.on("open", function () {
                                                var _a;
                                                (_a = opts.statusSink) === null || _a === void 0 ? void 0 : _a.call(opts, {
                                                    connected: true,
                                                    lastConnectedAt: Date.now(),
                                                    lastError: null,
                                                });
                                                ws.send(JSON.stringify({
                                                    seq: seq++,
                                                    action: "authentication_challenge",
                                                    data: { token: botToken },
                                                }));
                                            });
                                            ws.on("message", function (data) { return __awaiter(_this, void 0, void 0, function () {
                                                var raw, payload, postData, post, err_5;
                                                var _a, _b;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0:
                                                            raw = (0, monitor_helpers_js_1.rawDataToString)(data);
                                                            try {
                                                                payload = JSON.parse(raw);
                                                            }
                                                            catch (_d) {
                                                                return [2 /*return*/];
                                                            }
                                                            if (payload.event !== "posted") {
                                                                return [2 /*return*/];
                                                            }
                                                            postData = (_a = payload.data) === null || _a === void 0 ? void 0 : _a.post;
                                                            if (!postData) {
                                                                return [2 /*return*/];
                                                            }
                                                            post = null;
                                                            if (typeof postData === "string") {
                                                                try {
                                                                    post = JSON.parse(postData);
                                                                }
                                                                catch (_e) {
                                                                    return [2 /*return*/];
                                                                }
                                                            }
                                                            else if (typeof postData === "object") {
                                                                post = postData;
                                                            }
                                                            if (!post) {
                                                                return [2 /*return*/];
                                                            }
                                                            _c.label = 1;
                                                        case 1:
                                                            _c.trys.push([1, 3, , 4]);
                                                            return [4 /*yield*/, debouncer.enqueue({ post: post, payload: payload })];
                                                        case 2:
                                                            _c.sent();
                                                            return [3 /*break*/, 4];
                                                        case 3:
                                                            err_5 = _c.sent();
                                                            (_b = runtime.error) === null || _b === void 0 ? void 0 : _b.call(runtime, "mattermost handler failed: ".concat(String(err_5)));
                                                            return [3 /*break*/, 4];
                                                        case 4: return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                            ws.on("close", function (code, reason) {
                                                var _a, _b;
                                                var message = reason.length > 0 ? reason.toString("utf8") : "";
                                                (_a = opts.statusSink) === null || _a === void 0 ? void 0 : _a.call(opts, {
                                                    connected: false,
                                                    lastDisconnect: {
                                                        at: Date.now(),
                                                        status: code,
                                                        error: message || undefined,
                                                    },
                                                });
                                                (_b = opts.abortSignal) === null || _b === void 0 ? void 0 : _b.removeEventListener("abort", onAbort);
                                                resolve();
                                            });
                                            ws.on("error", function (err) {
                                                var _a, _b;
                                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "mattermost websocket error: ".concat(String(err)));
                                                (_b = opts.statusSink) === null || _b === void 0 ? void 0 : _b.call(opts, {
                                                    lastError: String(err),
                                                });
                                            });
                                        })];
                                case 1: return [2 /*return*/, _b.sent()];
                            }
                        });
                    }); };
                    _o.label = 2;
                case 2:
                    if (!!((_l = opts.abortSignal) === null || _l === void 0 ? void 0 : _l.aborted)) return [3 /*break*/, 5];
                    return [4 /*yield*/, connectOnce()];
                case 3:
                    _o.sent();
                    if ((_m = opts.abortSignal) === null || _m === void 0 ? void 0 : _m.aborted) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 4:
                    _o.sent();
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
