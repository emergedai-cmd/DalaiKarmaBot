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
exports.registerGoogleChatWebhookTarget = registerGoogleChatWebhookTarget;
exports.handleGoogleChatWebhookRequest = handleGoogleChatWebhookRequest;
exports.isSenderAllowed = isSenderAllowed;
exports.monitorGoogleChatProvider = monitorGoogleChatProvider;
exports.startGoogleChatMonitor = startGoogleChatMonitor;
exports.resolveGoogleChatWebhookPath = resolveGoogleChatWebhookPath;
exports.computeGoogleChatMediaMaxMb = computeGoogleChatMediaMaxMb;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var api_js_1 = require("./api.js");
var auth_js_1 = require("./auth.js");
var runtime_js_1 = require("./runtime.js");
var webhookTargets = new Map();
function logVerbose(core, runtime, message) {
    var _a;
    if (core.logging.shouldLogVerbose()) {
        (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[googlechat] ".concat(message));
    }
}
function normalizeWebhookPath(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return "/";
    }
    var withSlash = trimmed.startsWith("/") ? trimmed : "/".concat(trimmed);
    if (withSlash.length > 1 && withSlash.endsWith("/")) {
        return withSlash.slice(0, -1);
    }
    return withSlash;
}
function resolveWebhookPath(webhookPath, webhookUrl) {
    var trimmedPath = webhookPath === null || webhookPath === void 0 ? void 0 : webhookPath.trim();
    if (trimmedPath) {
        return normalizeWebhookPath(trimmedPath);
    }
    if (webhookUrl === null || webhookUrl === void 0 ? void 0 : webhookUrl.trim()) {
        try {
            var parsed = new URL(webhookUrl);
            return normalizeWebhookPath(parsed.pathname || "/");
        }
        catch (_a) {
            return null;
        }
    }
    return "/googlechat";
}
function readJsonBody(req, maxBytes) {
    return __awaiter(this, void 0, void 0, function () {
        var chunks, total;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chunks = [];
                    total = 0;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var resolved = false;
                            var doResolve = function (value) {
                                if (resolved) {
                                    return;
                                }
                                resolved = true;
                                req.removeAllListeners();
                                resolve(value);
                            };
                            req.on("data", function (chunk) {
                                total += chunk.length;
                                if (total > maxBytes) {
                                    doResolve({ ok: false, error: "payload too large" });
                                    req.destroy();
                                    return;
                                }
                                chunks.push(chunk);
                            });
                            req.on("end", function () {
                                try {
                                    var raw = Buffer.concat(chunks).toString("utf8");
                                    if (!raw.trim()) {
                                        doResolve({ ok: false, error: "empty payload" });
                                        return;
                                    }
                                    doResolve({ ok: true, value: JSON.parse(raw) });
                                }
                                catch (err) {
                                    doResolve({ ok: false, error: err instanceof Error ? err.message : String(err) });
                                }
                            });
                            req.on("error", function (err) {
                                doResolve({ ok: false, error: err instanceof Error ? err.message : String(err) });
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function registerGoogleChatWebhookTarget(target) {
    var _a;
    var key = normalizeWebhookPath(target.path);
    var normalizedTarget = __assign(__assign({}, target), { path: key });
    var existing = (_a = webhookTargets.get(key)) !== null && _a !== void 0 ? _a : [];
    var next = __spreadArray(__spreadArray([], existing, true), [normalizedTarget], false);
    webhookTargets.set(key, next);
    return function () {
        var _a;
        var updated = ((_a = webhookTargets.get(key)) !== null && _a !== void 0 ? _a : []).filter(function (entry) { return entry !== normalizedTarget; });
        if (updated.length > 0) {
            webhookTargets.set(key, updated);
        }
        else {
            webhookTargets.delete(key);
        }
    };
}
function normalizeAudienceType(value) {
    var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
    if (normalized === "app-url" || normalized === "app_url" || normalized === "app") {
        return "app-url";
    }
    if (normalized === "project-number" ||
        normalized === "project_number" ||
        normalized === "project") {
        return "project-number";
    }
    return undefined;
}
function handleGoogleChatWebhookRequest(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, path, targets, authHeader, bearer, body, raw, rawObj, chat, messagePayload, systemIdToken, event, eventType, authHeaderNow, effectiveBearer, selected, _i, targets_1, target, audienceType, audience, verification;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", "http://localhost");
                    path = normalizeWebhookPath(url.pathname);
                    targets = webhookTargets.get(path);
                    if (!targets || targets.length === 0) {
                        return [2 /*return*/, false];
                    }
                    if (req.method !== "POST") {
                        res.statusCode = 405;
                        res.setHeader("Allow", "POST");
                        res.end("Method Not Allowed");
                        return [2 /*return*/, true];
                    }
                    authHeader = String((_b = req.headers.authorization) !== null && _b !== void 0 ? _b : "");
                    bearer = authHeader.toLowerCase().startsWith("bearer ")
                        ? authHeader.slice("bearer ".length)
                        : "";
                    return [4 /*yield*/, readJsonBody(req, 1024 * 1024)];
                case 1:
                    body = _k.sent();
                    if (!body.ok) {
                        res.statusCode = body.error === "payload too large" ? 413 : 400;
                        res.end((_c = body.error) !== null && _c !== void 0 ? _c : "invalid payload");
                        return [2 /*return*/, true];
                    }
                    raw = body.value;
                    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
                        res.statusCode = 400;
                        res.end("invalid payload");
                        return [2 /*return*/, true];
                    }
                    rawObj = raw;
                    if (((_d = rawObj.commonEventObject) === null || _d === void 0 ? void 0 : _d.hostApp) === "CHAT" && ((_e = rawObj.chat) === null || _e === void 0 ? void 0 : _e.messagePayload)) {
                        chat = rawObj.chat;
                        messagePayload = chat.messagePayload;
                        raw = {
                            type: "MESSAGE",
                            space: messagePayload === null || messagePayload === void 0 ? void 0 : messagePayload.space,
                            message: messagePayload === null || messagePayload === void 0 ? void 0 : messagePayload.message,
                            user: chat.user,
                            eventTime: chat.eventTime,
                        };
                        systemIdToken = (_f = rawObj.authorizationEventObject) === null || _f === void 0 ? void 0 : _f.systemIdToken;
                        if (!bearer && systemIdToken) {
                            Object.assign(req.headers, { authorization: "Bearer ".concat(systemIdToken) });
                        }
                    }
                    event = raw;
                    eventType = (_g = event.type) !== null && _g !== void 0 ? _g : raw.eventType;
                    if (typeof eventType !== "string") {
                        res.statusCode = 400;
                        res.end("invalid payload");
                        return [2 /*return*/, true];
                    }
                    if (!event.space || typeof event.space !== "object" || Array.isArray(event.space)) {
                        res.statusCode = 400;
                        res.end("invalid payload");
                        return [2 /*return*/, true];
                    }
                    if (eventType === "MESSAGE") {
                        if (!event.message || typeof event.message !== "object" || Array.isArray(event.message)) {
                            res.statusCode = 400;
                            res.end("invalid payload");
                            return [2 /*return*/, true];
                        }
                    }
                    authHeaderNow = String((_h = req.headers.authorization) !== null && _h !== void 0 ? _h : "");
                    effectiveBearer = authHeaderNow.toLowerCase().startsWith("bearer ")
                        ? authHeaderNow.slice("bearer ".length)
                        : bearer;
                    _i = 0, targets_1 = targets;
                    _k.label = 2;
                case 2:
                    if (!(_i < targets_1.length)) return [3 /*break*/, 5];
                    target = targets_1[_i];
                    audienceType = target.audienceType;
                    audience = target.audience;
                    return [4 /*yield*/, (0, auth_js_1.verifyGoogleChatRequest)({
                            bearer: effectiveBearer,
                            audienceType: audienceType,
                            audience: audience,
                        })];
                case 3:
                    verification = _k.sent();
                    if (verification.ok) {
                        selected = target;
                        return [3 /*break*/, 5];
                    }
                    _k.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!selected) {
                        res.statusCode = 401;
                        res.end("unauthorized");
                        return [2 /*return*/, true];
                    }
                    (_j = selected.statusSink) === null || _j === void 0 ? void 0 : _j.call(selected, { lastInboundAt: Date.now() });
                    processGoogleChatEvent(event, selected).catch(function (err) {
                        var _a, _b;
                        (_b = selected === null || selected === void 0 ? void 0 : (_a = selected.runtime).error) === null || _b === void 0 ? void 0 : _b.call(_a, "[".concat(selected.account.accountId, "] Google Chat webhook failed: ").concat(String(err)));
                    });
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end("{}");
                    return [2 /*return*/, true];
            }
        });
    });
}
function processGoogleChatEvent(event, target) {
    return __awaiter(this, void 0, void 0, function () {
        var eventType;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    eventType = (_a = event.type) !== null && _a !== void 0 ? _a : event.eventType;
                    if (eventType !== "MESSAGE") {
                        return [2 /*return*/];
                    }
                    if (!event.message || !event.space) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, processMessageWithPipeline({
                            event: event,
                            account: target.account,
                            config: target.config,
                            runtime: target.runtime,
                            core: target.core,
                            statusSink: target.statusSink,
                            mediaMaxMb: target.mediaMaxMb,
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function normalizeUserId(raw) {
    var _a;
    var trimmed = (_a = raw === null || raw === void 0 ? void 0 : raw.trim()) !== null && _a !== void 0 ? _a : "";
    if (!trimmed) {
        return "";
    }
    return trimmed.replace(/^users\//i, "").toLowerCase();
}
function isSenderAllowed(senderId, senderEmail, allowFrom) {
    var _a;
    if (allowFrom.includes("*")) {
        return true;
    }
    var normalizedSenderId = normalizeUserId(senderId);
    var normalizedEmail = (_a = senderEmail === null || senderEmail === void 0 ? void 0 : senderEmail.trim().toLowerCase()) !== null && _a !== void 0 ? _a : "";
    return allowFrom.some(function (entry) {
        var normalized = String(entry).trim().toLowerCase();
        if (!normalized) {
            return false;
        }
        if (normalized === normalizedSenderId) {
            return true;
        }
        if (normalizedEmail && normalized === normalizedEmail) {
            return true;
        }
        if (normalizedEmail && normalized.replace(/^users\//i, "") === normalizedEmail) {
            return true;
        }
        if (normalized.replace(/^users\//i, "") === normalizedSenderId) {
            return true;
        }
        if (normalized.replace(/^(googlechat|google-chat|gchat):/i, "") === normalizedSenderId) {
            return true;
        }
        return false;
    });
}
function resolveGroupConfig(params) {
    var groupId = params.groupId, groupName = params.groupName, groups = params.groups;
    var entries = groups !== null && groups !== void 0 ? groups : {};
    var keys = Object.keys(entries);
    if (keys.length === 0) {
        return { entry: undefined, allowlistConfigured: false };
    }
    var normalizedName = groupName === null || groupName === void 0 ? void 0 : groupName.trim().toLowerCase();
    var candidates = [groupId, groupName !== null && groupName !== void 0 ? groupName : "", normalizedName !== null && normalizedName !== void 0 ? normalizedName : ""].filter(Boolean);
    var entry = candidates.map(function (candidate) { return entries[candidate]; }).find(Boolean);
    if (!entry && normalizedName) {
        entry = entries[normalizedName];
    }
    var fallback = entries["*"];
    return { entry: entry !== null && entry !== void 0 ? entry : fallback, allowlistConfigured: true, fallback: fallback };
}
function extractMentionInfo(annotations, botUser) {
    var mentionAnnotations = annotations.filter(function (entry) { return entry.type === "USER_MENTION"; });
    var hasAnyMention = mentionAnnotations.length > 0;
    var botTargets = new Set(["users/app", botUser === null || botUser === void 0 ? void 0 : botUser.trim()].filter(Boolean));
    var wasMentioned = mentionAnnotations.some(function (entry) {
        var _a, _b;
        var userName = (_b = (_a = entry.userMention) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.name;
        if (!userName) {
            return false;
        }
        if (botTargets.has(userName)) {
            return true;
        }
        return normalizeUserId(userName) === "app";
    });
    return { hasAnyMention: hasAnyMention, wasMentioned: wasMentioned };
}
/**
 * Resolve bot display name with fallback chain:
 * 1. Account config name
 * 2. Agent name from config
 * 3. "OpenClaw" as generic fallback
 */
function resolveBotDisplayName(params) {
    var _a, _b, _c;
    var accountName = params.accountName, agentId = params.agentId, config = params.config;
    if (accountName === null || accountName === void 0 ? void 0 : accountName.trim()) {
        return accountName.trim();
    }
    var agent = (_b = (_a = config.agents) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.find(function (a) { return a.id === agentId; });
    if ((_c = agent === null || agent === void 0 ? void 0 : agent.name) === null || _c === void 0 ? void 0 : _c.trim()) {
        return agent.name.trim();
    }
    return "OpenClaw";
}
function processMessageWithPipeline(params) {
    return __awaiter(this, void 0, void 0, function () {
        var event, account, config, runtime, core, statusSink, mediaMaxMb, space, message, spaceId, spaceType, isGroup, sender, senderId, senderName, senderEmail, allowBots, messageText, attachments, hasMedia, rawBody, defaultGroupPolicy, groupPolicy, groupConfigResolved, groupEntry, groupUsers, effectiveWasMentioned, groupAllowlistConfigured, groupAllowed, ok, dmPolicy, configAllowFrom, shouldComputeAuth, storeAllowFrom, _a, effectiveAllowFrom, commandAllowFrom, useAccessGroups, senderAllowedForCommands, commandAuthorized, requireMention, annotations, mentionInfo, allowTextCommands, mentionGate, allowed, _b, code, created, err_1, route, mediaPath, mediaType, first, attachmentData, fromLabel, storePath, envelopeOptions, previousTimestamp, body, groupSystemPrompt, ctxPayload, typingIndicator, typingMessageName, botName, result, err_2;
        var _this = this;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
        return __generator(this, function (_17) {
            switch (_17.label) {
                case 0:
                    event = params.event, account = params.account, config = params.config, runtime = params.runtime, core = params.core, statusSink = params.statusSink, mediaMaxMb = params.mediaMaxMb;
                    space = event.space;
                    message = event.message;
                    if (!space || !message) {
                        return [2 /*return*/];
                    }
                    spaceId = (_c = space.name) !== null && _c !== void 0 ? _c : "";
                    if (!spaceId) {
                        return [2 /*return*/];
                    }
                    spaceType = ((_d = space.type) !== null && _d !== void 0 ? _d : "").toUpperCase();
                    isGroup = spaceType !== "DM";
                    sender = (_e = message.sender) !== null && _e !== void 0 ? _e : event.user;
                    senderId = (_f = sender === null || sender === void 0 ? void 0 : sender.name) !== null && _f !== void 0 ? _f : "";
                    senderName = (_g = sender === null || sender === void 0 ? void 0 : sender.displayName) !== null && _g !== void 0 ? _g : "";
                    senderEmail = (_h = sender === null || sender === void 0 ? void 0 : sender.email) !== null && _h !== void 0 ? _h : undefined;
                    allowBots = account.config.allowBots === true;
                    if (!allowBots) {
                        if (((_j = sender === null || sender === void 0 ? void 0 : sender.type) === null || _j === void 0 ? void 0 : _j.toUpperCase()) === "BOT") {
                            logVerbose(core, runtime, "skip bot-authored message (".concat(senderId || "unknown", ")"));
                            return [2 /*return*/];
                        }
                        if (senderId === "users/app") {
                            logVerbose(core, runtime, "skip app-authored message");
                            return [2 /*return*/];
                        }
                    }
                    messageText = ((_l = (_k = message.argumentText) !== null && _k !== void 0 ? _k : message.text) !== null && _l !== void 0 ? _l : "").trim();
                    attachments = (_m = message.attachment) !== null && _m !== void 0 ? _m : [];
                    hasMedia = attachments.length > 0;
                    rawBody = messageText || (hasMedia ? "<media:attachment>" : "");
                    if (!rawBody) {
                        return [2 /*return*/];
                    }
                    defaultGroupPolicy = (_p = (_o = config.channels) === null || _o === void 0 ? void 0 : _o.defaults) === null || _p === void 0 ? void 0 : _p.groupPolicy;
                    groupPolicy = (_r = (_q = account.config.groupPolicy) !== null && _q !== void 0 ? _q : defaultGroupPolicy) !== null && _r !== void 0 ? _r : "allowlist";
                    groupConfigResolved = resolveGroupConfig({
                        groupId: spaceId,
                        groupName: (_s = space.displayName) !== null && _s !== void 0 ? _s : null,
                        groups: (_t = account.config.groups) !== null && _t !== void 0 ? _t : undefined,
                    });
                    groupEntry = groupConfigResolved.entry;
                    groupUsers = (_v = (_u = groupEntry === null || groupEntry === void 0 ? void 0 : groupEntry.users) !== null && _u !== void 0 ? _u : account.config.groupAllowFrom) !== null && _v !== void 0 ? _v : [];
                    if (isGroup) {
                        if (groupPolicy === "disabled") {
                            logVerbose(core, runtime, "drop group message (groupPolicy=disabled, space=".concat(spaceId, ")"));
                            return [2 /*return*/];
                        }
                        groupAllowlistConfigured = groupConfigResolved.allowlistConfigured;
                        groupAllowed = Boolean(groupEntry) || Boolean(((_w = account.config.groups) !== null && _w !== void 0 ? _w : {})["*"]);
                        if (groupPolicy === "allowlist") {
                            if (!groupAllowlistConfigured) {
                                logVerbose(core, runtime, "drop group message (groupPolicy=allowlist, no allowlist, space=".concat(spaceId, ")"));
                                return [2 /*return*/];
                            }
                            if (!groupAllowed) {
                                logVerbose(core, runtime, "drop group message (not allowlisted, space=".concat(spaceId, ")"));
                                return [2 /*return*/];
                            }
                        }
                        if ((groupEntry === null || groupEntry === void 0 ? void 0 : groupEntry.enabled) === false || (groupEntry === null || groupEntry === void 0 ? void 0 : groupEntry.allow) === false) {
                            logVerbose(core, runtime, "drop group message (space disabled, space=".concat(spaceId, ")"));
                            return [2 /*return*/];
                        }
                        if (groupUsers.length > 0) {
                            ok = isSenderAllowed(senderId, senderEmail, groupUsers.map(function (v) { return String(v); }));
                            if (!ok) {
                                logVerbose(core, runtime, "drop group message (sender not allowed, ".concat(senderId, ")"));
                                return [2 /*return*/];
                            }
                        }
                    }
                    dmPolicy = (_y = (_x = account.config.dm) === null || _x === void 0 ? void 0 : _x.policy) !== null && _y !== void 0 ? _y : "pairing";
                    configAllowFrom = ((_0 = (_z = account.config.dm) === null || _z === void 0 ? void 0 : _z.allowFrom) !== null && _0 !== void 0 ? _0 : []).map(function (v) { return String(v); });
                    shouldComputeAuth = core.channel.commands.shouldComputeCommandAuthorized(rawBody, config);
                    if (!(!isGroup && (dmPolicy !== "open" || shouldComputeAuth))) return [3 /*break*/, 2];
                    return [4 /*yield*/, core.channel.pairing.readAllowFromStore("googlechat").catch(function () { return []; })];
                case 1:
                    _a = _17.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = [];
                    _17.label = 3;
                case 3:
                    storeAllowFrom = _a;
                    effectiveAllowFrom = __spreadArray(__spreadArray([], configAllowFrom, true), storeAllowFrom, true);
                    commandAllowFrom = isGroup ? groupUsers.map(function (v) { return String(v); }) : effectiveAllowFrom;
                    useAccessGroups = ((_1 = config.commands) === null || _1 === void 0 ? void 0 : _1.useAccessGroups) !== false;
                    senderAllowedForCommands = isSenderAllowed(senderId, senderEmail, commandAllowFrom);
                    commandAuthorized = shouldComputeAuth
                        ? core.channel.commands.resolveCommandAuthorizedFromAuthorizers({
                            useAccessGroups: useAccessGroups,
                            authorizers: [
                                { configured: commandAllowFrom.length > 0, allowed: senderAllowedForCommands },
                            ],
                        })
                        : undefined;
                    if (isGroup) {
                        requireMention = (_3 = (_2 = groupEntry === null || groupEntry === void 0 ? void 0 : groupEntry.requireMention) !== null && _2 !== void 0 ? _2 : account.config.requireMention) !== null && _3 !== void 0 ? _3 : true;
                        annotations = (_4 = message.annotations) !== null && _4 !== void 0 ? _4 : [];
                        mentionInfo = extractMentionInfo(annotations, account.config.botUser);
                        allowTextCommands = core.channel.commands.shouldHandleTextCommands({
                            cfg: config,
                            surface: "googlechat",
                        });
                        mentionGate = (0, plugin_sdk_1.resolveMentionGatingWithBypass)({
                            isGroup: true,
                            requireMention: requireMention,
                            canDetectMention: true,
                            wasMentioned: mentionInfo.wasMentioned,
                            implicitMention: false,
                            hasAnyMention: mentionInfo.hasAnyMention,
                            allowTextCommands: allowTextCommands,
                            hasControlCommand: core.channel.text.hasControlCommand(rawBody, config),
                            commandAuthorized: commandAuthorized === true,
                        });
                        effectiveWasMentioned = mentionGate.effectiveWasMentioned;
                        if (mentionGate.shouldSkip) {
                            logVerbose(core, runtime, "drop group message (mention required, space=".concat(spaceId, ")"));
                            return [2 /*return*/];
                        }
                    }
                    if (!!isGroup) return [3 /*break*/, 11];
                    if (dmPolicy === "disabled" || ((_5 = account.config.dm) === null || _5 === void 0 ? void 0 : _5.enabled) === false) {
                        logVerbose(core, runtime, "Blocked Google Chat DM from ".concat(senderId, " (dmPolicy=disabled)"));
                        return [2 /*return*/];
                    }
                    if (!(dmPolicy !== "open")) return [3 /*break*/, 11];
                    allowed = senderAllowedForCommands;
                    if (!!allowed) return [3 /*break*/, 11];
                    if (!(dmPolicy === "pairing")) return [3 /*break*/, 9];
                    return [4 /*yield*/, core.channel.pairing.upsertPairingRequest({
                            channel: "googlechat",
                            id: senderId,
                            meta: { name: senderName || undefined, email: senderEmail },
                        })];
                case 4:
                    _b = _17.sent(), code = _b.code, created = _b.created;
                    if (!created) return [3 /*break*/, 8];
                    logVerbose(core, runtime, "googlechat pairing request sender=".concat(senderId));
                    _17.label = 5;
                case 5:
                    _17.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, api_js_1.sendGoogleChatMessage)({
                            account: account,
                            space: spaceId,
                            text: core.channel.pairing.buildPairingReply({
                                channel: "googlechat",
                                idLine: "Your Google Chat user id: ".concat(senderId),
                                code: code,
                            }),
                        })];
                case 6:
                    _17.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _17.sent();
                    logVerbose(core, runtime, "pairing reply failed for ".concat(senderId, ": ").concat(String(err_1)));
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    logVerbose(core, runtime, "Blocked unauthorized Google Chat sender ".concat(senderId, " (dmPolicy=").concat(dmPolicy, ")"));
                    _17.label = 10;
                case 10: return [2 /*return*/];
                case 11:
                    if (isGroup &&
                        core.channel.commands.isControlCommandMessage(rawBody, config) &&
                        commandAuthorized !== true) {
                        logVerbose(core, runtime, "googlechat: drop control command from ".concat(senderId));
                        return [2 /*return*/];
                    }
                    route = core.channel.routing.resolveAgentRoute({
                        cfg: config,
                        channel: "googlechat",
                        accountId: account.accountId,
                        peer: {
                            kind: isGroup ? "group" : "dm",
                            id: spaceId,
                        },
                    });
                    if (!(attachments.length > 0)) return [3 /*break*/, 13];
                    first = attachments[0];
                    return [4 /*yield*/, downloadAttachment(first, account, mediaMaxMb, core)];
                case 12:
                    attachmentData = _17.sent();
                    if (attachmentData) {
                        mediaPath = attachmentData.path;
                        mediaType = attachmentData.contentType;
                    }
                    _17.label = 13;
                case 13:
                    fromLabel = isGroup
                        ? space.displayName || "space:".concat(spaceId)
                        : senderName || "user:".concat(senderId);
                    storePath = core.channel.session.resolveStorePath((_6 = config.session) === null || _6 === void 0 ? void 0 : _6.store, {
                        agentId: route.agentId,
                    });
                    envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(config);
                    previousTimestamp = core.channel.session.readSessionUpdatedAt({
                        storePath: storePath,
                        sessionKey: route.sessionKey,
                    });
                    body = core.channel.reply.formatAgentEnvelope({
                        channel: "Google Chat",
                        from: fromLabel,
                        timestamp: event.eventTime ? Date.parse(event.eventTime) : undefined,
                        previousTimestamp: previousTimestamp,
                        envelope: envelopeOptions,
                        body: rawBody,
                    });
                    groupSystemPrompt = ((_8 = (_7 = groupConfigResolved.entry) === null || _7 === void 0 ? void 0 : _7.systemPrompt) === null || _8 === void 0 ? void 0 : _8.trim()) || undefined;
                    ctxPayload = core.channel.reply.finalizeInboundContext({
                        Body: body,
                        RawBody: rawBody,
                        CommandBody: rawBody,
                        From: "googlechat:".concat(senderId),
                        To: "googlechat:".concat(spaceId),
                        SessionKey: route.sessionKey,
                        AccountId: route.accountId,
                        ChatType: isGroup ? "channel" : "direct",
                        ConversationLabel: fromLabel,
                        SenderName: senderName || undefined,
                        SenderId: senderId,
                        SenderUsername: senderEmail,
                        WasMentioned: isGroup ? effectiveWasMentioned : undefined,
                        CommandAuthorized: commandAuthorized,
                        Provider: "googlechat",
                        Surface: "googlechat",
                        MessageSid: message.name,
                        MessageSidFull: message.name,
                        ReplyToId: (_9 = message.thread) === null || _9 === void 0 ? void 0 : _9.name,
                        ReplyToIdFull: (_10 = message.thread) === null || _10 === void 0 ? void 0 : _10.name,
                        MediaPath: mediaPath,
                        MediaType: mediaType,
                        MediaUrl: mediaPath,
                        GroupSpace: isGroup ? ((_11 = space.displayName) !== null && _11 !== void 0 ? _11 : undefined) : undefined,
                        GroupSystemPrompt: isGroup ? groupSystemPrompt : undefined,
                        OriginatingChannel: "googlechat",
                        OriginatingTo: "googlechat:".concat(spaceId),
                    });
                    void core.channel.session
                        .recordSessionMetaFromInbound({
                        storePath: storePath,
                        sessionKey: (_12 = ctxPayload.SessionKey) !== null && _12 !== void 0 ? _12 : route.sessionKey,
                        ctx: ctxPayload,
                    })
                        .catch(function (err) {
                        var _a;
                        (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "googlechat: failed updating session meta: ".concat(String(err)));
                    });
                    typingIndicator = (_13 = account.config.typingIndicator) !== null && _13 !== void 0 ? _13 : "message";
                    if (typingIndicator === "reaction") {
                        (_14 = runtime.error) === null || _14 === void 0 ? void 0 : _14.call(runtime, "[".concat(account.accountId, "] typingIndicator=\"reaction\" requires user OAuth (not supported with service account). Falling back to \"message\" mode."));
                        typingIndicator = "message";
                    }
                    if (!(typingIndicator === "message")) return [3 /*break*/, 17];
                    _17.label = 14;
                case 14:
                    _17.trys.push([14, 16, , 17]);
                    botName = resolveBotDisplayName({
                        accountName: account.config.name,
                        agentId: route.agentId,
                        config: config,
                    });
                    return [4 /*yield*/, (0, api_js_1.sendGoogleChatMessage)({
                            account: account,
                            space: spaceId,
                            text: "_".concat(botName, " is typing..._"),
                            thread: (_15 = message.thread) === null || _15 === void 0 ? void 0 : _15.name,
                        })];
                case 15:
                    result = _17.sent();
                    typingMessageName = result === null || result === void 0 ? void 0 : result.messageName;
                    return [3 /*break*/, 17];
                case 16:
                    err_2 = _17.sent();
                    (_16 = runtime.error) === null || _16 === void 0 ? void 0 : _16.call(runtime, "Failed sending typing message: ".concat(String(err_2)));
                    return [3 /*break*/, 17];
                case 17: return [4 /*yield*/, core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
                        ctx: ctxPayload,
                        cfg: config,
                        dispatcherOptions: {
                            deliver: function (payload) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, deliverGoogleChatReply({
                                                payload: payload,
                                                account: account,
                                                spaceId: spaceId,
                                                runtime: runtime,
                                                core: core,
                                                config: config,
                                                statusSink: statusSink,
                                                typingMessageName: typingMessageName,
                                            })];
                                        case 1:
                                            _a.sent();
                                            // Only use typing message for first delivery
                                            typingMessageName = undefined;
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            onError: function (err, info) {
                                var _a;
                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[".concat(account.accountId, "] Google Chat ").concat(info.kind, " reply failed: ").concat(String(err)));
                            },
                        },
                    })];
                case 18:
                    _17.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function downloadAttachment(attachment, account, mediaMaxMb, core) {
    return __awaiter(this, void 0, void 0, function () {
        var resourceName, maxBytes, downloaded, saved;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    resourceName = (_a = attachment.attachmentDataRef) === null || _a === void 0 ? void 0 : _a.resourceName;
                    if (!resourceName) {
                        return [2 /*return*/, null];
                    }
                    maxBytes = Math.max(1, mediaMaxMb) * 1024 * 1024;
                    return [4 /*yield*/, (0, api_js_1.downloadGoogleChatMedia)({ account: account, resourceName: resourceName, maxBytes: maxBytes })];
                case 1:
                    downloaded = _c.sent();
                    return [4 /*yield*/, core.channel.media.saveMediaBuffer(downloaded.buffer, (_b = downloaded.contentType) !== null && _b !== void 0 ? _b : attachment.contentType, "inbound", maxBytes, attachment.contentName)];
                case 2:
                    saved = _c.sent();
                    return [2 /*return*/, { path: saved.path, contentType: saved.contentType }];
            }
        });
    });
}
function deliverGoogleChatReply(params) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, account, spaceId, runtime, core, config, statusSink, typingMessageName, mediaList, suppressCaption, err_3, fallbackText, updateErr_1, first, _i, mediaList_1, mediaUrl, caption, loaded, upload, err_4, chunkLimit, chunkMode, chunks, i, chunk, err_5;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    payload = params.payload, account = params.account, spaceId = params.spaceId, runtime = params.runtime, core = params.core, config = params.config, statusSink = params.statusSink, typingMessageName = params.typingMessageName;
                    mediaList = ((_a = payload.mediaUrls) === null || _a === void 0 ? void 0 : _a.length)
                        ? payload.mediaUrls
                        : payload.mediaUrl
                            ? [payload.mediaUrl]
                            : [];
                    if (!(mediaList.length > 0)) return [3 /*break*/, 17];
                    suppressCaption = false;
                    if (!typingMessageName) return [3 /*break*/, 8];
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, 3, , 8]);
                    return [4 /*yield*/, (0, api_js_1.deleteGoogleChatMessage)({
                            account: account,
                            messageName: typingMessageName,
                        })];
                case 2:
                    _l.sent();
                    return [3 /*break*/, 8];
                case 3:
                    err_3 = _l.sent();
                    (_b = runtime.error) === null || _b === void 0 ? void 0 : _b.call(runtime, "Google Chat typing cleanup failed: ".concat(String(err_3)));
                    fallbackText = ((_c = payload.text) === null || _c === void 0 ? void 0 : _c.trim())
                        ? payload.text
                        : mediaList.length > 1
                            ? "Sent attachments."
                            : "Sent attachment.";
                    _l.label = 4;
                case 4:
                    _l.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, api_js_1.updateGoogleChatMessage)({
                            account: account,
                            messageName: typingMessageName,
                            text: fallbackText,
                        })];
                case 5:
                    _l.sent();
                    suppressCaption = Boolean((_d = payload.text) === null || _d === void 0 ? void 0 : _d.trim());
                    return [3 /*break*/, 7];
                case 6:
                    updateErr_1 = _l.sent();
                    (_e = runtime.error) === null || _e === void 0 ? void 0 : _e.call(runtime, "Google Chat typing update failed: ".concat(String(updateErr_1)));
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 8];
                case 8:
                    first = true;
                    _i = 0, mediaList_1 = mediaList;
                    _l.label = 9;
                case 9:
                    if (!(_i < mediaList_1.length)) return [3 /*break*/, 16];
                    mediaUrl = mediaList_1[_i];
                    caption = first && !suppressCaption ? payload.text : undefined;
                    first = false;
                    _l.label = 10;
                case 10:
                    _l.trys.push([10, 14, , 15]);
                    return [4 /*yield*/, core.channel.media.fetchRemoteMedia(mediaUrl, {
                            maxBytes: ((_f = account.config.mediaMaxMb) !== null && _f !== void 0 ? _f : 20) * 1024 * 1024,
                        })];
                case 11:
                    loaded = _l.sent();
                    return [4 /*yield*/, uploadAttachmentForReply({
                            account: account,
                            spaceId: spaceId,
                            buffer: loaded.buffer,
                            contentType: loaded.contentType,
                            filename: (_g = loaded.filename) !== null && _g !== void 0 ? _g : "attachment",
                        })];
                case 12:
                    upload = _l.sent();
                    if (!upload.attachmentUploadToken) {
                        throw new Error("missing attachment upload token");
                    }
                    return [4 /*yield*/, (0, api_js_1.sendGoogleChatMessage)({
                            account: account,
                            space: spaceId,
                            text: caption,
                            thread: payload.replyToId,
                            attachments: [
                                { attachmentUploadToken: upload.attachmentUploadToken, contentName: loaded.filename },
                            ],
                        })];
                case 13:
                    _l.sent();
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 15];
                case 14:
                    err_4 = _l.sent();
                    (_h = runtime.error) === null || _h === void 0 ? void 0 : _h.call(runtime, "Google Chat attachment send failed: ".concat(String(err_4)));
                    return [3 /*break*/, 15];
                case 15:
                    _i++;
                    return [3 /*break*/, 9];
                case 16: return [2 /*return*/];
                case 17:
                    if (!payload.text) return [3 /*break*/, 26];
                    chunkLimit = (_j = account.config.textChunkLimit) !== null && _j !== void 0 ? _j : 4000;
                    chunkMode = core.channel.text.resolveChunkMode(config, "googlechat", account.accountId);
                    chunks = core.channel.text.chunkMarkdownTextWithMode(payload.text, chunkLimit, chunkMode);
                    i = 0;
                    _l.label = 18;
                case 18:
                    if (!(i < chunks.length)) return [3 /*break*/, 26];
                    chunk = chunks[i];
                    _l.label = 19;
                case 19:
                    _l.trys.push([19, 24, , 25]);
                    if (!(i === 0 && typingMessageName)) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, api_js_1.updateGoogleChatMessage)({
                            account: account,
                            messageName: typingMessageName,
                            text: chunk,
                        })];
                case 20:
                    _l.sent();
                    return [3 /*break*/, 23];
                case 21: return [4 /*yield*/, (0, api_js_1.sendGoogleChatMessage)({
                        account: account,
                        space: spaceId,
                        text: chunk,
                        thread: payload.replyToId,
                    })];
                case 22:
                    _l.sent();
                    _l.label = 23;
                case 23:
                    statusSink === null || statusSink === void 0 ? void 0 : statusSink({ lastOutboundAt: Date.now() });
                    return [3 /*break*/, 25];
                case 24:
                    err_5 = _l.sent();
                    (_k = runtime.error) === null || _k === void 0 ? void 0 : _k.call(runtime, "Google Chat message send failed: ".concat(String(err_5)));
                    return [3 /*break*/, 25];
                case 25:
                    i++;
                    return [3 /*break*/, 18];
                case 26: return [2 /*return*/];
            }
        });
    });
}
function uploadAttachmentForReply(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, spaceId, buffer, contentType, filename, uploadGoogleChatAttachment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = params.account, spaceId = params.spaceId, buffer = params.buffer, contentType = params.contentType, filename = params.filename;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./api.js"); })];
                case 1:
                    uploadGoogleChatAttachment = (_a.sent()).uploadGoogleChatAttachment;
                    return [4 /*yield*/, uploadGoogleChatAttachment({
                            account: account,
                            space: spaceId,
                            filename: filename,
                            buffer: buffer,
                            contentType: contentType,
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function monitorGoogleChatProvider(options) {
    var _a, _b, _c, _d;
    var core = (0, runtime_js_1.getGoogleChatRuntime)();
    var webhookPath = resolveWebhookPath(options.webhookPath, options.webhookUrl);
    if (!webhookPath) {
        (_b = (_a = options.runtime).error) === null || _b === void 0 ? void 0 : _b.call(_a, "[".concat(options.account.accountId, "] invalid webhook path"));
        return function () { };
    }
    var audienceType = normalizeAudienceType(options.account.config.audienceType);
    var audience = (_c = options.account.config.audience) === null || _c === void 0 ? void 0 : _c.trim();
    var mediaMaxMb = (_d = options.account.config.mediaMaxMb) !== null && _d !== void 0 ? _d : 20;
    var unregister = registerGoogleChatWebhookTarget({
        account: options.account,
        config: options.config,
        runtime: options.runtime,
        core: core,
        path: webhookPath,
        audienceType: audienceType,
        audience: audience,
        statusSink: options.statusSink,
        mediaMaxMb: mediaMaxMb,
    });
    return unregister;
}
function startGoogleChatMonitor(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, monitorGoogleChatProvider(params)];
        });
    });
}
function resolveGoogleChatWebhookPath(params) {
    var _a;
    return ((_a = resolveWebhookPath(params.account.config.webhookPath, params.account.config.webhookUrl)) !== null && _a !== void 0 ? _a : "/googlechat");
}
function computeGoogleChatMediaMaxMb(params) {
    var _a;
    return (_a = params.account.config.mediaMaxMb) !== null && _a !== void 0 ? _a : 20;
}
