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
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorMatrixProvider = monitorMatrixProvider;
var node_util_1 = require("node:util");
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var resolve_targets_js_1 = require("../../resolve-targets.js");
var runtime_js_1 = require("../../runtime.js");
var active_client_js_1 = require("../active-client.js");
var client_js_1 = require("../client.js");
var auto_join_js_1 = require("./auto-join.js");
var direct_js_1 = require("./direct.js");
var events_js_1 = require("./events.js");
var handler_js_1 = require("./handler.js");
var room_info_js_1 = require("./room-info.js");
var DEFAULT_MEDIA_MAX_MB = 20;
function monitorMatrixProvider() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var core, cfg, logger, formatRuntimeMessage, runtime, logVerboseMessage, normalizeUserEntry, normalizeRoomEntry, isMatrixUserId, allowlistOnly, allowFrom, roomsConfig, entries, mapping, unresolved, additions, pending, _i, entries_1, entry, resolved, _a, resolved_1, entry, entries, mapping_1, unresolved_1, nextRooms_1, pending_1, _b, entries_2, entry, trimmed, cleaned, resolved, auth, resolvedInitialSyncLimit, authWithLimit, client, mentionRegexes, defaultGroupPolicy, groupPolicyRaw, groupPolicy, replyToMode, threadReplies, dmConfig, dmEnabled, dmPolicyRaw, dmPolicy, textLimit, mediaMaxMb, mediaMaxBytes, startupMs, startupGraceMs, directTracker, warnedEncryptedRooms, warnedCryptoMissingRooms, _c, getRoomInfo, getMemberDisplayName, handleRoomMessage, verificationRequest, err_1;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_17) {
            switch (_17.label) {
                case 0:
                    if ((0, client_js_1.isBunRuntime)()) {
                        throw new Error("Matrix provider requires Node (bun runtime not supported)");
                    }
                    core = (0, runtime_js_1.getMatrixRuntime)();
                    cfg = core.config.loadConfig();
                    if (((_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.matrix) === null || _e === void 0 ? void 0 : _e.enabled) === false) {
                        return [2 /*return*/];
                    }
                    logger = core.logging.getChildLogger({ module: "matrix-auto-reply" });
                    formatRuntimeMessage = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return node_util_1.format.apply(void 0, args);
                    };
                    runtime = (_f = opts.runtime) !== null && _f !== void 0 ? _f : {
                        log: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            logger.info(formatRuntimeMessage.apply(void 0, args));
                        },
                        error: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            logger.error(formatRuntimeMessage.apply(void 0, args));
                        },
                        exit: function (code) {
                            throw new Error("exit ".concat(code));
                        },
                    };
                    logVerboseMessage = function (message) {
                        if (!core.logging.shouldLogVerbose()) {
                            return;
                        }
                        logger.debug(message);
                    };
                    normalizeUserEntry = function (raw) {
                        return raw
                            .replace(/^matrix:/i, "")
                            .replace(/^user:/i, "")
                            .trim();
                    };
                    normalizeRoomEntry = function (raw) {
                        return raw
                            .replace(/^matrix:/i, "")
                            .replace(/^(room|channel):/i, "")
                            .trim();
                    };
                    isMatrixUserId = function (value) { return value.startsWith("@") && value.includes(":"); };
                    allowlistOnly = ((_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.matrix) === null || _h === void 0 ? void 0 : _h.allowlistOnly) === true;
                    allowFrom = (_m = (_l = (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.matrix) === null || _k === void 0 ? void 0 : _k.dm) === null || _l === void 0 ? void 0 : _l.allowFrom) !== null && _m !== void 0 ? _m : [];
                    roomsConfig = (_q = (_p = (_o = cfg.channels) === null || _o === void 0 ? void 0 : _o.matrix) === null || _p === void 0 ? void 0 : _p.groups) !== null && _q !== void 0 ? _q : (_s = (_r = cfg.channels) === null || _r === void 0 ? void 0 : _r.matrix) === null || _s === void 0 ? void 0 : _s.rooms;
                    if (!(allowFrom.length > 0)) return [3 /*break*/, 3];
                    entries = allowFrom
                        .map(function (entry) { return normalizeUserEntry(String(entry)); })
                        .filter(function (entry) { return entry && entry !== "*"; });
                    if (!(entries.length > 0)) return [3 /*break*/, 3];
                    mapping = [];
                    unresolved = [];
                    additions = [];
                    pending = [];
                    for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        entry = entries_1[_i];
                        if (isMatrixUserId(entry)) {
                            additions.push(entry);
                            continue;
                        }
                        pending.push(entry);
                    }
                    if (!(pending.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, resolve_targets_js_1.resolveMatrixTargets)({
                            cfg: cfg,
                            inputs: pending,
                            kind: "user",
                            runtime: runtime,
                        })];
                case 1:
                    resolved = _17.sent();
                    for (_a = 0, resolved_1 = resolved; _a < resolved_1.length; _a++) {
                        entry = resolved_1[_a];
                        if (entry.resolved && entry.id) {
                            additions.push(entry.id);
                            mapping.push("".concat(entry.input, "\u2192").concat(entry.id));
                        }
                        else {
                            unresolved.push(entry.input);
                        }
                    }
                    _17.label = 2;
                case 2:
                    allowFrom = (0, plugin_sdk_1.mergeAllowlist)({ existing: allowFrom, additions: additions });
                    (0, plugin_sdk_1.summarizeMapping)("matrix users", mapping, unresolved, runtime);
                    _17.label = 3;
                case 3:
                    if (!(roomsConfig && Object.keys(roomsConfig).length > 0)) return [3 /*break*/, 6];
                    entries = Object.keys(roomsConfig).filter(function (key) { return key !== "*"; });
                    mapping_1 = [];
                    unresolved_1 = [];
                    nextRooms_1 = __assign({}, roomsConfig);
                    pending_1 = [];
                    for (_b = 0, entries_2 = entries; _b < entries_2.length; _b++) {
                        entry = entries_2[_b];
                        trimmed = entry.trim();
                        if (!trimmed) {
                            continue;
                        }
                        cleaned = normalizeRoomEntry(trimmed);
                        if (cleaned.startsWith("!") && cleaned.includes(":")) {
                            if (!nextRooms_1[cleaned]) {
                                nextRooms_1[cleaned] = roomsConfig[entry];
                            }
                            mapping_1.push("".concat(entry, "\u2192").concat(cleaned));
                            continue;
                        }
                        pending_1.push({ input: entry, query: trimmed });
                    }
                    if (!(pending_1.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, resolve_targets_js_1.resolveMatrixTargets)({
                            cfg: cfg,
                            inputs: pending_1.map(function (entry) { return entry.query; }),
                            kind: "group",
                            runtime: runtime,
                        })];
                case 4:
                    resolved = _17.sent();
                    resolved.forEach(function (entry, index) {
                        var source = pending_1[index];
                        if (!source) {
                            return;
                        }
                        if (entry.resolved && entry.id) {
                            if (!nextRooms_1[entry.id]) {
                                nextRooms_1[entry.id] = roomsConfig[source.input];
                            }
                            mapping_1.push("".concat(source.input, "\u2192").concat(entry.id));
                        }
                        else {
                            unresolved_1.push(source.input);
                        }
                    });
                    _17.label = 5;
                case 5:
                    roomsConfig = nextRooms_1;
                    (0, plugin_sdk_1.summarizeMapping)("matrix rooms", mapping_1, unresolved_1, runtime);
                    _17.label = 6;
                case 6:
                    cfg = __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { matrix: __assign(__assign(__assign({}, (_t = cfg.channels) === null || _t === void 0 ? void 0 : _t.matrix), { dm: __assign(__assign({}, (_v = (_u = cfg.channels) === null || _u === void 0 ? void 0 : _u.matrix) === null || _v === void 0 ? void 0 : _v.dm), { allowFrom: allowFrom }) }), (roomsConfig ? { groups: roomsConfig } : {})) }) });
                    return [4 /*yield*/, (0, client_js_1.resolveMatrixAuth)({ cfg: cfg })];
                case 7:
                    auth = _17.sent();
                    resolvedInitialSyncLimit = typeof opts.initialSyncLimit === "number"
                        ? Math.max(0, Math.floor(opts.initialSyncLimit))
                        : auth.initialSyncLimit;
                    authWithLimit = resolvedInitialSyncLimit === auth.initialSyncLimit
                        ? auth
                        : __assign(__assign({}, auth), { initialSyncLimit: resolvedInitialSyncLimit });
                    return [4 /*yield*/, (0, client_js_1.resolveSharedMatrixClient)({
                            cfg: cfg,
                            auth: authWithLimit,
                            startClient: false,
                            accountId: opts.accountId,
                        })];
                case 8:
                    client = _17.sent();
                    (0, active_client_js_1.setActiveMatrixClient)(client);
                    mentionRegexes = core.channel.mentions.buildMentionRegexes(cfg);
                    defaultGroupPolicy = (_x = (_w = cfg.channels) === null || _w === void 0 ? void 0 : _w.defaults) === null || _x === void 0 ? void 0 : _x.groupPolicy;
                    groupPolicyRaw = (_1 = (_0 = (_z = (_y = cfg.channels) === null || _y === void 0 ? void 0 : _y.matrix) === null || _z === void 0 ? void 0 : _z.groupPolicy) !== null && _0 !== void 0 ? _0 : defaultGroupPolicy) !== null && _1 !== void 0 ? _1 : "allowlist";
                    groupPolicy = allowlistOnly && groupPolicyRaw === "open" ? "allowlist" : groupPolicyRaw;
                    replyToMode = (_5 = (_2 = opts.replyToMode) !== null && _2 !== void 0 ? _2 : (_4 = (_3 = cfg.channels) === null || _3 === void 0 ? void 0 : _3.matrix) === null || _4 === void 0 ? void 0 : _4.replyToMode) !== null && _5 !== void 0 ? _5 : "off";
                    threadReplies = (_8 = (_7 = (_6 = cfg.channels) === null || _6 === void 0 ? void 0 : _6.matrix) === null || _7 === void 0 ? void 0 : _7.threadReplies) !== null && _8 !== void 0 ? _8 : "inbound";
                    dmConfig = (_10 = (_9 = cfg.channels) === null || _9 === void 0 ? void 0 : _9.matrix) === null || _10 === void 0 ? void 0 : _10.dm;
                    dmEnabled = (_11 = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.enabled) !== null && _11 !== void 0 ? _11 : true;
                    dmPolicyRaw = (_12 = dmConfig === null || dmConfig === void 0 ? void 0 : dmConfig.policy) !== null && _12 !== void 0 ? _12 : "pairing";
                    dmPolicy = allowlistOnly && dmPolicyRaw !== "disabled" ? "allowlist" : dmPolicyRaw;
                    textLimit = core.channel.text.resolveTextChunkLimit(cfg, "matrix");
                    mediaMaxMb = (_16 = (_13 = opts.mediaMaxMb) !== null && _13 !== void 0 ? _13 : (_15 = (_14 = cfg.channels) === null || _14 === void 0 ? void 0 : _14.matrix) === null || _15 === void 0 ? void 0 : _15.mediaMaxMb) !== null && _16 !== void 0 ? _16 : DEFAULT_MEDIA_MAX_MB;
                    mediaMaxBytes = Math.max(1, mediaMaxMb) * 1024 * 1024;
                    startupMs = Date.now();
                    startupGraceMs = 0;
                    directTracker = (0, direct_js_1.createDirectRoomTracker)(client, { log: logVerboseMessage });
                    (0, auto_join_js_1.registerMatrixAutoJoin)({ client: client, cfg: cfg, runtime: runtime });
                    warnedEncryptedRooms = new Set();
                    warnedCryptoMissingRooms = new Set();
                    _c = (0, room_info_js_1.createMatrixRoomInfoResolver)(client), getRoomInfo = _c.getRoomInfo, getMemberDisplayName = _c.getMemberDisplayName;
                    handleRoomMessage = (0, handler_js_1.createMatrixRoomMessageHandler)({
                        client: client,
                        core: core,
                        cfg: cfg,
                        runtime: runtime,
                        logger: logger,
                        logVerboseMessage: logVerboseMessage,
                        allowFrom: allowFrom,
                        roomsConfig: roomsConfig,
                        mentionRegexes: mentionRegexes,
                        groupPolicy: groupPolicy,
                        replyToMode: replyToMode,
                        threadReplies: threadReplies,
                        dmEnabled: dmEnabled,
                        dmPolicy: dmPolicy,
                        textLimit: textLimit,
                        mediaMaxBytes: mediaMaxBytes,
                        startupMs: startupMs,
                        startupGraceMs: startupGraceMs,
                        directTracker: directTracker,
                        getRoomInfo: getRoomInfo,
                        getMemberDisplayName: getMemberDisplayName,
                    });
                    (0, events_js_1.registerMatrixMonitorEvents)({
                        client: client,
                        auth: auth,
                        logVerboseMessage: logVerboseMessage,
                        warnedEncryptedRooms: warnedEncryptedRooms,
                        warnedCryptoMissingRooms: warnedCryptoMissingRooms,
                        logger: logger,
                        formatNativeDependencyHint: core.system.formatNativeDependencyHint,
                        onRoomMessage: handleRoomMessage,
                    });
                    logVerboseMessage("matrix: starting client");
                    return [4 /*yield*/, (0, client_js_1.resolveSharedMatrixClient)({
                            cfg: cfg,
                            auth: authWithLimit,
                            accountId: opts.accountId,
                        })];
                case 9:
                    _17.sent();
                    logVerboseMessage("matrix: client started");
                    // @vector-im/matrix-bot-sdk client is already started via resolveSharedMatrixClient
                    logger.info("matrix: logged in as ".concat(auth.userId));
                    if (!(auth.encryption && client.crypto)) return [3 /*break*/, 13];
                    _17.label = 10;
                case 10:
                    _17.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, client.crypto.requestOwnUserVerification()];
                case 11:
                    verificationRequest = _17.sent();
                    if (verificationRequest) {
                        logger.info("matrix: device verification requested - please verify in another client");
                    }
                    return [3 /*break*/, 13];
                case 12:
                    err_1 = _17.sent();
                    logger.debug({ error: String(err_1) }, "Device verification request failed (may already be verified)");
                    return [3 /*break*/, 13];
                case 13: return [4 /*yield*/, new Promise(function (resolve) {
                        var _a, _b;
                        var onAbort = function () {
                            try {
                                logVerboseMessage("matrix: stopping client");
                                (0, client_js_1.stopSharedClient)();
                            }
                            finally {
                                (0, active_client_js_1.setActiveMatrixClient)(null);
                                resolve();
                            }
                        };
                        if ((_a = opts.abortSignal) === null || _a === void 0 ? void 0 : _a.aborted) {
                            onAbort();
                            return;
                        }
                        (_b = opts.abortSignal) === null || _b === void 0 ? void 0 : _b.addEventListener("abort", onAbort, { once: true });
                    })];
                case 14:
                    _17.sent();
                    return [2 /*return*/];
            }
        });
    });
}
