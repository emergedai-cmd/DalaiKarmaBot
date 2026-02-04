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
exports.createMSTeamsConversationStoreFs = createMSTeamsConversationStoreFs;
var storage_js_1 = require("./storage.js");
var store_fs_js_1 = require("./store-fs.js");
var STORE_FILENAME = "msteams-conversations.json";
var MAX_CONVERSATIONS = 1000;
var CONVERSATION_TTL_MS = 365 * 24 * 60 * 60 * 1000;
function parseTimestamp(value) {
    if (!value) {
        return null;
    }
    var parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) {
        return null;
    }
    return parsed;
}
function pruneToLimit(conversations) {
    var entries = Object.entries(conversations);
    if (entries.length <= MAX_CONVERSATIONS) {
        return conversations;
    }
    entries.sort(function (a, b) {
        var _a, _b;
        var aTs = (_a = parseTimestamp(a[1].lastSeenAt)) !== null && _a !== void 0 ? _a : 0;
        var bTs = (_b = parseTimestamp(b[1].lastSeenAt)) !== null && _b !== void 0 ? _b : 0;
        return aTs - bTs;
    });
    var keep = entries.slice(entries.length - MAX_CONVERSATIONS);
    return Object.fromEntries(keep);
}
function pruneExpired(conversations, nowMs, ttlMs) {
    var removed = false;
    var kept = {};
    for (var _i = 0, _a = Object.entries(conversations); _i < _a.length; _i++) {
        var _b = _a[_i], conversationId = _b[0], reference = _b[1];
        var lastSeenAt = parseTimestamp(reference.lastSeenAt);
        // Preserve legacy entries that have no lastSeenAt until they're seen again.
        if (lastSeenAt != null && nowMs - lastSeenAt > ttlMs) {
            removed = true;
            continue;
        }
        kept[conversationId] = reference;
    }
    return { conversations: kept, removed: removed };
}
function normalizeConversationId(raw) {
    var _a;
    return (_a = raw.split(";")[0]) !== null && _a !== void 0 ? _a : raw;
}
function createMSTeamsConversationStoreFs(params) {
    var _this = this;
    var _a;
    var ttlMs = (_a = params === null || params === void 0 ? void 0 : params.ttlMs) !== null && _a !== void 0 ? _a : CONVERSATION_TTL_MS;
    var filePath = (0, storage_js_1.resolveMSTeamsStorePath)({
        filename: STORE_FILENAME,
        env: params === null || params === void 0 ? void 0 : params.env,
        homedir: params === null || params === void 0 ? void 0 : params.homedir,
        stateDir: params === null || params === void 0 ? void 0 : params.stateDir,
        storePath: params === null || params === void 0 ? void 0 : params.storePath,
    });
    var empty = { version: 1, conversations: {} };
    var readStore = function () { return __awaiter(_this, void 0, void 0, function () {
        var value, nowMs, pruned;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, store_fs_js_1.readJsonFile)(filePath, empty)];
                case 1:
                    value = (_a.sent()).value;
                    if (value.version !== 1 ||
                        !value.conversations ||
                        typeof value.conversations !== "object" ||
                        Array.isArray(value.conversations)) {
                        return [2 /*return*/, empty];
                    }
                    nowMs = Date.now();
                    pruned = pruneExpired(value.conversations, nowMs, ttlMs).conversations;
                    return [2 /*return*/, { version: 1, conversations: pruneToLimit(pruned) }];
            }
        });
    }); };
    var list = function () { return __awaiter(_this, void 0, void 0, function () {
        var store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readStore()];
                case 1:
                    store = _a.sent();
                    return [2 /*return*/, Object.entries(store.conversations).map(function (_a) {
                            var conversationId = _a[0], reference = _a[1];
                            return ({
                                conversationId: conversationId,
                                reference: reference,
                            });
                        })];
            }
        });
    }); };
    var get = function (conversationId) { return __awaiter(_this, void 0, void 0, function () {
        var store;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, readStore()];
                case 1:
                    store = _b.sent();
                    return [2 /*return*/, (_a = store.conversations[normalizeConversationId(conversationId)]) !== null && _a !== void 0 ? _a : null];
            }
        });
    }); };
    var findByUserId = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var target, _i, _a, entry, conversationId, reference;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    target = id.trim();
                    if (!target) {
                        return [2 /*return*/, null];
                    }
                    _i = 0;
                    return [4 /*yield*/, list()];
                case 1:
                    _a = _d.sent();
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    entry = _a[_i];
                    conversationId = entry.conversationId, reference = entry.reference;
                    if (((_b = reference.user) === null || _b === void 0 ? void 0 : _b.aadObjectId) === target) {
                        return [2 /*return*/, { conversationId: conversationId, reference: reference }];
                    }
                    if (((_c = reference.user) === null || _c === void 0 ? void 0 : _c.id) === target) {
                        return [2 /*return*/, { conversationId: conversationId, reference: reference }];
                    }
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, null];
            }
        });
    }); };
    var upsert = function (conversationId, reference) { return __awaiter(_this, void 0, void 0, function () {
        var normalizedId;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    normalizedId = normalizeConversationId(conversationId);
                    return [4 /*yield*/, (0, store_fs_js_1.withFileLock)(filePath, empty, function () { return __awaiter(_this, void 0, void 0, function () {
                            var store, nowMs;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, readStore()];
                                    case 1:
                                        store = _a.sent();
                                        store.conversations[normalizedId] = __assign(__assign({}, reference), { lastSeenAt: new Date().toISOString() });
                                        nowMs = Date.now();
                                        store.conversations = pruneExpired(store.conversations, nowMs, ttlMs).conversations;
                                        store.conversations = pruneToLimit(store.conversations);
                                        return [4 /*yield*/, (0, store_fs_js_1.writeJsonFile)(filePath, store)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var remove = function (conversationId) { return __awaiter(_this, void 0, void 0, function () {
        var normalizedId;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    normalizedId = normalizeConversationId(conversationId);
                    return [4 /*yield*/, (0, store_fs_js_1.withFileLock)(filePath, empty, function () { return __awaiter(_this, void 0, void 0, function () {
                            var store;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, readStore()];
                                    case 1:
                                        store = _a.sent();
                                        if (!(normalizedId in store.conversations)) {
                                            return [2 /*return*/, false];
                                        }
                                        delete store.conversations[normalizedId];
                                        return [4 /*yield*/, (0, store_fs_js_1.writeJsonFile)(filePath, store)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, true];
                                }
                            });
                        }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    return { upsert: upsert, get: get, list: list, remove: remove, findByUserId: findByUserId };
}
