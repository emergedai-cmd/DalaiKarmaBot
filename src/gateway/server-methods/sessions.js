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
exports.sessionsHandlers = void 0;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var abort_js_1 = require("../../auto-reply/reply/abort.js");
var queue_js_1 = require("../../auto-reply/reply/queue.js");
var config_js_1 = require("../../config/config.js");
var sessions_js_1 = require("../../config/sessions.js");
var index_js_1 = require("../protocol/index.js");
var session_utils_js_1 = require("../session-utils.js");
var sessions_patch_js_1 = require("../sessions-patch.js");
var sessions_resolve_js_1 = require("../sessions-resolve.js");
exports.sessionsHandlers = {
    "sessions.list": function (_a) {
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_1.validateSessionsListParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid sessions.list params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSessionsListParams.errors))));
            return;
        }
        var p = params;
        var cfg = (0, config_js_1.loadConfig)();
        var _b = (0, session_utils_js_1.loadCombinedSessionStoreForGateway)(cfg), storePath = _b.storePath, store = _b.store;
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: cfg,
            storePath: storePath,
            store: store,
            opts: p,
        });
        respond(true, result, undefined);
    },
    "sessions.preview": function (_a) {
        var _b, _c;
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_1.validateSessionsPreviewParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid sessions.preview params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSessionsPreviewParams.errors))));
            return;
        }
        var p = params;
        var keysRaw = Array.isArray(p.keys) ? p.keys : [];
        var keys = keysRaw
            .map(function (key) { return String(key !== null && key !== void 0 ? key : "").trim(); })
            .filter(Boolean)
            .slice(0, 64);
        var limit = typeof p.limit === "number" && Number.isFinite(p.limit) ? Math.max(1, p.limit) : 12;
        var maxChars = typeof p.maxChars === "number" && Number.isFinite(p.maxChars)
            ? Math.max(20, p.maxChars)
            : 240;
        if (keys.length === 0) {
            respond(true, { ts: Date.now(), previews: [] }, undefined);
            return;
        }
        var cfg = (0, config_js_1.loadConfig)();
        var storeCache = new Map();
        var previews = [];
        var _loop_1 = function (key) {
            try {
                var target = (0, session_utils_js_1.resolveGatewaySessionStoreTarget)({ cfg: cfg, key: key });
                var store_1 = (_b = storeCache.get(target.storePath)) !== null && _b !== void 0 ? _b : (0, sessions_js_1.loadSessionStore)(target.storePath);
                storeCache.set(target.storePath, store_1);
                var entry = (_c = target.storeKeys.map(function (candidate) { return store_1[candidate]; }).find(Boolean)) !== null && _c !== void 0 ? _c : store_1[target.canonicalKey];
                if (!(entry === null || entry === void 0 ? void 0 : entry.sessionId)) {
                    previews.push({ key: key, status: "missing", items: [] });
                    return "continue";
                }
                var items = (0, session_utils_js_1.readSessionPreviewItemsFromTranscript)(entry.sessionId, target.storePath, entry.sessionFile, target.agentId, limit, maxChars);
                previews.push({
                    key: key,
                    status: items.length > 0 ? "ok" : "empty",
                    items: items,
                });
            }
            catch (_d) {
                previews.push({ key: key, status: "error", items: [] });
            }
        };
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            _loop_1(key);
        }
        respond(true, { ts: Date.now(), previews: previews }, undefined);
    },
    "sessions.resolve": function (_a) {
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_1.validateSessionsResolveParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid sessions.resolve params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSessionsResolveParams.errors))));
            return;
        }
        var p = params;
        var cfg = (0, config_js_1.loadConfig)();
        var resolved = (0, sessions_resolve_js_1.resolveSessionKeyFromResolveParams)({ cfg: cfg, p: p });
        if (!resolved.ok) {
            respond(false, undefined, resolved.error);
            return;
        }
        respond(true, { ok: true, key: resolved.key }, undefined);
    },
    "sessions.patch": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, key, cfg, target, storePath, applied, result;
        var _c;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateSessionsPatchParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid sessions.patch params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSessionsPatchParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    key = String((_c = p.key) !== null && _c !== void 0 ? _c : "").trim();
                    if (!key) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "key required"));
                        return [2 /*return*/];
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    target = (0, session_utils_js_1.resolveGatewaySessionStoreTarget)({ cfg: cfg, key: key });
                    storePath = target.storePath;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) { return __awaiter(void 0, void 0, void 0, function () {
                            var primaryKey, existingKey;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        primaryKey = (_a = target.storeKeys[0]) !== null && _a !== void 0 ? _a : key;
                                        existingKey = target.storeKeys.find(function (candidate) { return store[candidate]; });
                                        if (existingKey && existingKey !== primaryKey && !store[primaryKey]) {
                                            store[primaryKey] = store[existingKey];
                                            delete store[existingKey];
                                        }
                                        return [4 /*yield*/, (0, sessions_patch_js_1.applySessionsPatchToStore)({
                                                cfg: cfg,
                                                store: store,
                                                storeKey: primaryKey,
                                                patch: p,
                                                loadGatewayModelCatalog: context.loadGatewayModelCatalog,
                                            })];
                                    case 1: return [2 /*return*/, _b.sent()];
                                }
                            });
                        }); })];
                case 1:
                    applied = _d.sent();
                    if (!applied.ok) {
                        respond(false, undefined, applied.error);
                        return [2 /*return*/];
                    }
                    result = {
                        ok: true,
                        path: storePath,
                        key: target.canonicalKey,
                        entry: applied.entry,
                    };
                    respond(true, result, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "sessions.reset": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, key, cfg, target, storePath, next;
        var _c;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateSessionsResetParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid sessions.reset params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSessionsResetParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    key = String((_c = p.key) !== null && _c !== void 0 ? _c : "").trim();
                    if (!key) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "key required"));
                        return [2 /*return*/];
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    target = (0, session_utils_js_1.resolveGatewaySessionStoreTarget)({ cfg: cfg, key: key });
                    storePath = target.storePath;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            var _a;
                            var primaryKey = (_a = target.storeKeys[0]) !== null && _a !== void 0 ? _a : key;
                            var existingKey = target.storeKeys.find(function (candidate) { return store[candidate]; });
                            if (existingKey && existingKey !== primaryKey && !store[primaryKey]) {
                                store[primaryKey] = store[existingKey];
                                delete store[existingKey];
                            }
                            var entry = store[primaryKey];
                            var now = Date.now();
                            var nextEntry = {
                                sessionId: (0, node_crypto_1.randomUUID)(),
                                updatedAt: now,
                                systemSent: false,
                                abortedLastRun: false,
                                thinkingLevel: entry === null || entry === void 0 ? void 0 : entry.thinkingLevel,
                                verboseLevel: entry === null || entry === void 0 ? void 0 : entry.verboseLevel,
                                reasoningLevel: entry === null || entry === void 0 ? void 0 : entry.reasoningLevel,
                                responseUsage: entry === null || entry === void 0 ? void 0 : entry.responseUsage,
                                model: entry === null || entry === void 0 ? void 0 : entry.model,
                                contextTokens: entry === null || entry === void 0 ? void 0 : entry.contextTokens,
                                sendPolicy: entry === null || entry === void 0 ? void 0 : entry.sendPolicy,
                                label: entry === null || entry === void 0 ? void 0 : entry.label,
                                origin: (0, sessions_js_1.snapshotSessionOrigin)(entry),
                                lastChannel: entry === null || entry === void 0 ? void 0 : entry.lastChannel,
                                lastTo: entry === null || entry === void 0 ? void 0 : entry.lastTo,
                                skillsSnapshot: entry === null || entry === void 0 ? void 0 : entry.skillsSnapshot,
                                // Reset token counts to 0 on session reset (#1523)
                                inputTokens: 0,
                                outputTokens: 0,
                                totalTokens: 0,
                            };
                            store[primaryKey] = nextEntry;
                            return nextEntry;
                        })];
                case 1:
                    next = _d.sent();
                    respond(true, { ok: true, key: target.canonicalKey, entry: next }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "sessions.delete": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, key, cfg, mainKey, target, deleteTranscript, storePath, entry, sessionId, existed, queueKeys, ended, archived, _i, _c, candidate;
        var _d;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(0, index_js_1.validateSessionsDeleteParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid sessions.delete params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSessionsDeleteParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    key = String((_d = p.key) !== null && _d !== void 0 ? _d : "").trim();
                    if (!key) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "key required"));
                        return [2 /*return*/];
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    mainKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    target = (0, session_utils_js_1.resolveGatewaySessionStoreTarget)({ cfg: cfg, key: key });
                    if (target.canonicalKey === mainKey) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "Cannot delete the main session (".concat(mainKey, ").")));
                        return [2 /*return*/];
                    }
                    deleteTranscript = typeof p.deleteTranscript === "boolean" ? p.deleteTranscript : true;
                    storePath = target.storePath;
                    entry = (0, session_utils_js_1.loadSessionEntry)(key).entry;
                    sessionId = entry === null || entry === void 0 ? void 0 : entry.sessionId;
                    existed = Boolean(entry);
                    queueKeys = new Set(target.storeKeys);
                    queueKeys.add(target.canonicalKey);
                    if (sessionId) {
                        queueKeys.add(sessionId);
                    }
                    (0, queue_js_1.clearSessionQueues)(__spreadArray([], queueKeys, true));
                    (0, abort_js_1.stopSubagentsForRequester)({ cfg: cfg, requesterSessionKey: target.canonicalKey });
                    if (!sessionId) return [3 /*break*/, 2];
                    (0, pi_embedded_js_1.abortEmbeddedPiRun)(sessionId);
                    return [4 /*yield*/, (0, pi_embedded_js_1.waitForEmbeddedPiRunEnd)(sessionId, 15000)];
                case 1:
                    ended = _e.sent();
                    if (!ended) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, "Session ".concat(key, " is still active; try again in a moment.")));
                        return [2 /*return*/];
                    }
                    _e.label = 2;
                case 2: return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                        var _a;
                        var primaryKey = (_a = target.storeKeys[0]) !== null && _a !== void 0 ? _a : key;
                        var existingKey = target.storeKeys.find(function (candidate) { return store[candidate]; });
                        if (existingKey && existingKey !== primaryKey && !store[primaryKey]) {
                            store[primaryKey] = store[existingKey];
                            delete store[existingKey];
                        }
                        if (store[primaryKey]) {
                            delete store[primaryKey];
                        }
                    })];
                case 3:
                    _e.sent();
                    archived = [];
                    if (deleteTranscript && sessionId) {
                        for (_i = 0, _c = (0, session_utils_js_1.resolveSessionTranscriptCandidates)(sessionId, storePath, entry === null || entry === void 0 ? void 0 : entry.sessionFile, target.agentId); _i < _c.length; _i++) {
                            candidate = _c[_i];
                            if (!node_fs_1.default.existsSync(candidate)) {
                                continue;
                            }
                            try {
                                archived.push((0, session_utils_js_1.archiveFileOnDisk)(candidate, "deleted"));
                            }
                            catch (_f) {
                                // Best-effort.
                            }
                        }
                    }
                    respond(true, { ok: true, key: target.canonicalKey, deleted: existed, archived: archived }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "sessions.compact": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, key, maxLines, cfg, target, storePath, compactTarget, entry, sessionId, filePath, raw, lines, archived, keptLines;
        var _c;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateSessionsCompactParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid sessions.compact params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSessionsCompactParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    key = String((_c = p.key) !== null && _c !== void 0 ? _c : "").trim();
                    if (!key) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "key required"));
                        return [2 /*return*/];
                    }
                    maxLines = typeof p.maxLines === "number" && Number.isFinite(p.maxLines)
                        ? Math.max(1, Math.floor(p.maxLines))
                        : 400;
                    cfg = (0, config_js_1.loadConfig)();
                    target = (0, session_utils_js_1.resolveGatewaySessionStoreTarget)({ cfg: cfg, key: key });
                    storePath = target.storePath;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            var _a;
                            var primaryKey = (_a = target.storeKeys[0]) !== null && _a !== void 0 ? _a : key;
                            var existingKey = target.storeKeys.find(function (candidate) { return store[candidate]; });
                            if (existingKey && existingKey !== primaryKey && !store[primaryKey]) {
                                store[primaryKey] = store[existingKey];
                                delete store[existingKey];
                            }
                            return { entry: store[primaryKey], primaryKey: primaryKey };
                        })];
                case 1:
                    compactTarget = _d.sent();
                    entry = compactTarget.entry;
                    sessionId = entry === null || entry === void 0 ? void 0 : entry.sessionId;
                    if (!sessionId) {
                        respond(true, {
                            ok: true,
                            key: target.canonicalKey,
                            compacted: false,
                            reason: "no sessionId",
                        }, undefined);
                        return [2 /*return*/];
                    }
                    filePath = (0, session_utils_js_1.resolveSessionTranscriptCandidates)(sessionId, storePath, entry === null || entry === void 0 ? void 0 : entry.sessionFile, target.agentId).find(function (candidate) { return node_fs_1.default.existsSync(candidate); });
                    if (!filePath) {
                        respond(true, {
                            ok: true,
                            key: target.canonicalKey,
                            compacted: false,
                            reason: "no transcript",
                        }, undefined);
                        return [2 /*return*/];
                    }
                    raw = node_fs_1.default.readFileSync(filePath, "utf-8");
                    lines = raw.split(/\r?\n/).filter(function (l) { return l.trim().length > 0; });
                    if (lines.length <= maxLines) {
                        respond(true, {
                            ok: true,
                            key: target.canonicalKey,
                            compacted: false,
                            kept: lines.length,
                        }, undefined);
                        return [2 /*return*/];
                    }
                    archived = (0, session_utils_js_1.archiveFileOnDisk)(filePath, "bak");
                    keptLines = lines.slice(-maxLines);
                    node_fs_1.default.writeFileSync(filePath, "".concat(keptLines.join("\n"), "\n"), "utf-8");
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            var entryKey = compactTarget.primaryKey;
                            var entryToUpdate = store[entryKey];
                            if (!entryToUpdate) {
                                return;
                            }
                            delete entryToUpdate.inputTokens;
                            delete entryToUpdate.outputTokens;
                            delete entryToUpdate.totalTokens;
                            entryToUpdate.updatedAt = Date.now();
                        })];
                case 2:
                    _d.sent();
                    respond(true, {
                        ok: true,
                        key: target.canonicalKey,
                        compacted: true,
                        archived: archived,
                        kept: keptLines.length,
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
};
