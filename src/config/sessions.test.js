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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var utils_js_1 = require("../utils.js");
var sessions_js_1 = require("./sessions.js");
(0, vitest_1.describe)("sessions", function () {
    (0, vitest_1.it)("returns normalized per-sender key", function () {
        (0, vitest_1.expect)((0, sessions_js_1.deriveSessionKey)("per-sender", { From: "whatsapp:+1555" })).toBe("+1555");
    });
    (0, vitest_1.it)("falls back to unknown when sender missing", function () {
        (0, vitest_1.expect)((0, sessions_js_1.deriveSessionKey)("per-sender", {})).toBe("unknown");
    });
    (0, vitest_1.it)("global scope returns global", function () {
        (0, vitest_1.expect)((0, sessions_js_1.deriveSessionKey)("global", { From: "+1" })).toBe("global");
    });
    (0, vitest_1.it)("keeps group chats distinct", function () {
        (0, vitest_1.expect)((0, sessions_js_1.deriveSessionKey)("per-sender", { From: "12345-678@g.us" })).toBe("whatsapp:group:12345-678@g.us");
    });
    (0, vitest_1.it)("prefixes group keys with provider when available", function () {
        (0, vitest_1.expect)((0, sessions_js_1.deriveSessionKey)("per-sender", {
            From: "12345-678@g.us",
            ChatType: "group",
            Provider: "whatsapp",
        })).toBe("whatsapp:group:12345-678@g.us");
    });
    (0, vitest_1.it)("keeps explicit provider when provided in group key", function () {
        (0, vitest_1.expect)((0, sessions_js_1.resolveSessionKey)("per-sender", { From: "discord:group:12345", ChatType: "group" }, "main")).toBe("agent:main:discord:group:12345");
    });
    (0, vitest_1.it)("builds discord display name with guild+channel slugs", function () {
        (0, vitest_1.expect)((0, sessions_js_1.buildGroupDisplayName)({
            provider: "discord",
            groupChannel: "#general",
            space: "friends-of-openclaw",
            id: "123",
            key: "discord:group:123",
        })).toBe("discord:friends-of-openclaw#general");
    });
    (0, vitest_1.it)("collapses direct chats to main by default", function () {
        (0, vitest_1.expect)((0, sessions_js_1.resolveSessionKey)("per-sender", { From: "+1555" })).toBe("agent:main:main");
    });
    (0, vitest_1.it)("collapses direct chats to main even when sender missing", function () {
        (0, vitest_1.expect)((0, sessions_js_1.resolveSessionKey)("per-sender", {})).toBe("agent:main:main");
    });
    (0, vitest_1.it)("maps direct chats to main key when provided", function () {
        (0, vitest_1.expect)((0, sessions_js_1.resolveSessionKey)("per-sender", { From: "whatsapp:+1555" }, "main")).toBe("agent:main:main");
    });
    (0, vitest_1.it)("uses custom main key when provided", function () {
        (0, vitest_1.expect)((0, sessions_js_1.resolveSessionKey)("per-sender", { From: "+1555" }, "primary")).toBe("agent:main:primary");
    });
    (0, vitest_1.it)("keeps global scope untouched", function () {
        (0, vitest_1.expect)((0, sessions_js_1.resolveSessionKey)("global", { From: "+1555" })).toBe("global");
    });
    (0, vitest_1.it)("leaves groups untouched even with main key", function () {
        (0, vitest_1.expect)((0, sessions_js_1.resolveSessionKey)("per-sender", { From: "12345-678@g.us" }, "main")).toBe("agent:main:whatsapp:group:12345-678@g.us");
    });
    (0, vitest_1.it)("updateLastRoute persists channel and target", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mainSessionKey, dir, storePath, store;
        var _a;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    mainSessionKey = "agent:main:main";
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _o.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[mainSessionKey] = {
                                sessionId: "sess-1",
                                updatedAt: 123,
                                systemSent: true,
                                thinkingLevel: "low",
                                responseUsage: "on",
                                queueDebounceMs: 1234,
                                reasoningLevel: "on",
                                elevatedLevel: "on",
                                authProfileOverride: "auth-1",
                                compactionCount: 2,
                            },
                            _a), null, 2), "utf-8")];
                case 2:
                    _o.sent();
                    return [4 /*yield*/, (0, sessions_js_1.updateLastRoute)({
                            storePath: storePath,
                            sessionKey: mainSessionKey,
                            deliveryContext: {
                                channel: "telegram",
                                to: "  12345  ",
                            },
                        })];
                case 3:
                    _o.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)((_b = store[mainSessionKey]) === null || _b === void 0 ? void 0 : _b.sessionId).toBe("sess-1");
                    (0, vitest_1.expect)((_c = store[mainSessionKey]) === null || _c === void 0 ? void 0 : _c.updatedAt).toBeGreaterThanOrEqual(123);
                    (0, vitest_1.expect)((_d = store[mainSessionKey]) === null || _d === void 0 ? void 0 : _d.lastChannel).toBe("telegram");
                    (0, vitest_1.expect)((_e = store[mainSessionKey]) === null || _e === void 0 ? void 0 : _e.lastTo).toBe("12345");
                    (0, vitest_1.expect)((_f = store[mainSessionKey]) === null || _f === void 0 ? void 0 : _f.deliveryContext).toEqual({
                        channel: "telegram",
                        to: "12345",
                    });
                    (0, vitest_1.expect)((_g = store[mainSessionKey]) === null || _g === void 0 ? void 0 : _g.responseUsage).toBe("on");
                    (0, vitest_1.expect)((_h = store[mainSessionKey]) === null || _h === void 0 ? void 0 : _h.queueDebounceMs).toBe(1234);
                    (0, vitest_1.expect)((_j = store[mainSessionKey]) === null || _j === void 0 ? void 0 : _j.reasoningLevel).toBe("on");
                    (0, vitest_1.expect)((_k = store[mainSessionKey]) === null || _k === void 0 ? void 0 : _k.elevatedLevel).toBe("on");
                    (0, vitest_1.expect)((_l = store[mainSessionKey]) === null || _l === void 0 ? void 0 : _l.authProfileOverride).toBe("auth-1");
                    (0, vitest_1.expect)((_m = store[mainSessionKey]) === null || _m === void 0 ? void 0 : _m.compactionCount).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateLastRoute prefers explicit deliveryContext", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mainSessionKey, dir, storePath, store;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    mainSessionKey = "agent:main:main";
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _e.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, "{}", "utf-8")];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, sessions_js_1.updateLastRoute)({
                            storePath: storePath,
                            sessionKey: mainSessionKey,
                            channel: "whatsapp",
                            to: "111",
                            accountId: "legacy",
                            deliveryContext: {
                                channel: "telegram",
                                to: "222",
                                accountId: "primary",
                            },
                        })];
                case 3:
                    _e.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)((_a = store[mainSessionKey]) === null || _a === void 0 ? void 0 : _a.lastChannel).toBe("telegram");
                    (0, vitest_1.expect)((_b = store[mainSessionKey]) === null || _b === void 0 ? void 0 : _b.lastTo).toBe("222");
                    (0, vitest_1.expect)((_c = store[mainSessionKey]) === null || _c === void 0 ? void 0 : _c.lastAccountId).toBe("primary");
                    (0, vitest_1.expect)((_d = store[mainSessionKey]) === null || _d === void 0 ? void 0 : _d.deliveryContext).toEqual({
                        channel: "telegram",
                        to: "222",
                        accountId: "primary",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateLastRoute records origin + group metadata when ctx is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionKey, dir, storePath, store;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    sessionKey = "agent:main:whatsapp:group:123@g.us";
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _k.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, "{}", "utf-8")];
                case 2:
                    _k.sent();
                    return [4 /*yield*/, (0, sessions_js_1.updateLastRoute)({
                            storePath: storePath,
                            sessionKey: sessionKey,
                            deliveryContext: {
                                channel: "whatsapp",
                                to: "123@g.us",
                            },
                            ctx: {
                                Provider: "whatsapp",
                                ChatType: "group",
                                GroupSubject: "Family",
                                From: "123@g.us",
                            },
                        })];
                case 3:
                    _k.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)((_a = store[sessionKey]) === null || _a === void 0 ? void 0 : _a.subject).toBe("Family");
                    (0, vitest_1.expect)((_b = store[sessionKey]) === null || _b === void 0 ? void 0 : _b.channel).toBe("whatsapp");
                    (0, vitest_1.expect)((_c = store[sessionKey]) === null || _c === void 0 ? void 0 : _c.groupId).toBe("123@g.us");
                    (0, vitest_1.expect)((_e = (_d = store[sessionKey]) === null || _d === void 0 ? void 0 : _d.origin) === null || _e === void 0 ? void 0 : _e.label).toBe("Family id:123@g.us");
                    (0, vitest_1.expect)((_g = (_f = store[sessionKey]) === null || _f === void 0 ? void 0 : _f.origin) === null || _g === void 0 ? void 0 : _g.provider).toBe("whatsapp");
                    (0, vitest_1.expect)((_j = (_h = store[sessionKey]) === null || _h === void 0 ? void 0 : _h.origin) === null || _j === void 0 ? void 0 : _j.chatType).toBe("group");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateSessionStoreEntry preserves existing fields when patching", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionKey, dir, storePath, store;
        var _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sessionKey = "agent:main:main";
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _d.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[sessionKey] = {
                                sessionId: "sess-1",
                                updatedAt: 100,
                                reasoningLevel: "on",
                            },
                            _a), null, 2), "utf-8")];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStoreEntry)({
                            storePath: storePath,
                            sessionKey: sessionKey,
                            update: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ updatedAt: 200 })];
                            }); }); },
                        })];
                case 3:
                    _d.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)((_b = store[sessionKey]) === null || _b === void 0 ? void 0 : _b.updatedAt).toBeGreaterThanOrEqual(200);
                    (0, vitest_1.expect)((_c = store[sessionKey]) === null || _c === void 0 ? void 0 : _c.reasoningLevel).toBe("on");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateSessionStore preserves concurrent additions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, storePath, store;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _c.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, "{}", "utf-8")];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                                store["agent:main:one"] = { sessionId: "sess-1", updatedAt: 1 };
                            }),
                            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                                store["agent:main:two"] = { sessionId: "sess-2", updatedAt: 2 };
                            }),
                        ])];
                case 3:
                    _c.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)((_a = store["agent:main:one"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("sess-1");
                    (0, vitest_1.expect)((_b = store["agent:main:two"]) === null || _b === void 0 ? void 0 : _b.sessionId).toBe("sess-2");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("recovers from array-backed session stores", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, storePath, store, raw;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _b.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, "[]", "utf-8")];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            store["agent:main:main"] = { sessionId: "sess-1", updatedAt: 1 };
                        })];
                case 3:
                    _b.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)((_a = store["agent:main:main"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("sess-1");
                    return [4 /*yield*/, promises_1.default.readFile(storePath, "utf-8")];
                case 4:
                    raw = _b.sent();
                    (0, vitest_1.expect)(raw.trim().startsWith("{")).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes last route fields on write", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, storePath, store;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _e.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, "{}", "utf-8")];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            store["agent:main:main"] = {
                                sessionId: "sess-normalized",
                                updatedAt: 1,
                                lastChannel: " WhatsApp ",
                                lastTo: " +1555 ",
                                lastAccountId: " acct-1 ",
                            };
                        })];
                case 3:
                    _e.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)((_a = store["agent:main:main"]) === null || _a === void 0 ? void 0 : _a.lastChannel).toBe("whatsapp");
                    (0, vitest_1.expect)((_b = store["agent:main:main"]) === null || _b === void 0 ? void 0 : _b.lastTo).toBe("+1555");
                    (0, vitest_1.expect)((_c = store["agent:main:main"]) === null || _c === void 0 ? void 0 : _c.lastAccountId).toBe("acct-1");
                    (0, vitest_1.expect)((_d = store["agent:main:main"]) === null || _d === void 0 ? void 0 : _d.deliveryContext).toEqual({
                        channel: "whatsapp",
                        to: "+1555",
                        accountId: "acct-1",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updateSessionStore keeps deletions when concurrent writes happen", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, storePath, store;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _c.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify({
                            "agent:main:old": { sessionId: "sess-old", updatedAt: 1 },
                            "agent:main:keep": { sessionId: "sess-keep", updatedAt: 2 },
                        }, null, 2), "utf-8")];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                                delete store["agent:main:old"];
                            }),
                            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                                store["agent:main:new"] = { sessionId: "sess-new", updatedAt: 3 };
                            }),
                        ])];
                case 3:
                    _c.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(store["agent:main:old"]).toBeUndefined();
                    (0, vitest_1.expect)((_a = store["agent:main:keep"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("sess-keep");
                    (0, vitest_1.expect)((_b = store["agent:main:new"]) === null || _b === void 0 ? void 0 : _b.sessionId).toBe("sess-new");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("loadSessionStore auto-migrates legacy provider keys to channel keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mainSessionKey, dir, storePath, store, entry;
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mainSessionKey = "agent:main:main";
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _c.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[mainSessionKey] = {
                                sessionId: "sess-legacy",
                                updatedAt: 123,
                                provider: "slack",
                                lastProvider: "telegram",
                                lastTo: "user:U123",
                            },
                            _a), null, 2), "utf-8")];
                case 2:
                    _c.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    entry = (_b = store[mainSessionKey]) !== null && _b !== void 0 ? _b : {};
                    (0, vitest_1.expect)(entry.channel).toBe("slack");
                    (0, vitest_1.expect)(entry.provider).toBeUndefined();
                    (0, vitest_1.expect)(entry.lastChannel).toBe("telegram");
                    (0, vitest_1.expect)(entry.lastProvider).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("derives session transcripts dir from OPENCLAW_STATE_DIR", function () {
        var dir = (0, sessions_js_1.resolveSessionTranscriptsDir)({ OPENCLAW_STATE_DIR: "/custom/state" }, function () { return "/home/ignored"; });
        (0, vitest_1.expect)(dir).toBe(node_path_1.default.join(node_path_1.default.resolve("/custom/state"), "agents", "main", "sessions"));
    });
    (0, vitest_1.it)("includes topic ids in session transcript filenames", function () {
        var prev = process.env.OPENCLAW_STATE_DIR;
        process.env.OPENCLAW_STATE_DIR = "/custom/state";
        try {
            var sessionFile = (0, sessions_js_1.resolveSessionTranscriptPath)("sess-1", "main", 123);
            (0, vitest_1.expect)(sessionFile).toBe(node_path_1.default.join(node_path_1.default.resolve("/custom/state"), "agents", "main", "sessions", "sess-1-topic-123.jsonl"));
        }
        finally {
            if (prev === undefined) {
                delete process.env.OPENCLAW_STATE_DIR;
            }
            else {
                process.env.OPENCLAW_STATE_DIR = prev;
            }
        }
    });
    (0, vitest_1.it)("uses agent id when resolving session file fallback paths", function () {
        var prev = process.env.OPENCLAW_STATE_DIR;
        process.env.OPENCLAW_STATE_DIR = "/custom/state";
        try {
            var sessionFile = (0, sessions_js_1.resolveSessionFilePath)("sess-2", undefined, {
                agentId: "codex",
            });
            (0, vitest_1.expect)(sessionFile).toBe(node_path_1.default.join(node_path_1.default.resolve("/custom/state"), "agents", "codex", "sessions", "sess-2.jsonl"));
        }
        finally {
            if (prev === undefined) {
                delete process.env.OPENCLAW_STATE_DIR;
            }
            else {
                process.env.OPENCLAW_STATE_DIR = prev;
            }
        }
    });
    (0, vitest_1.it)("updateSessionStoreEntry merges concurrent patches", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mainSessionKey, dir, storePath, store;
        var _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mainSessionKey = "agent:main:main";
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _d.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    return [4 /*yield*/, promises_1.default.writeFile(storePath, JSON.stringify((_a = {},
                            _a[mainSessionKey] = {
                                sessionId: "sess-1",
                                updatedAt: 123,
                                thinkingLevel: "low",
                            },
                            _a), null, 2), "utf-8")];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, sessions_js_1.updateSessionStoreEntry)({
                                storePath: storePath,
                                sessionKey: mainSessionKey,
                                update: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, (0, utils_js_1.sleep)(50)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, { modelOverride: "anthropic/claude-opus-4-5" }];
                                        }
                                    });
                                }); },
                            }),
                            (0, sessions_js_1.updateSessionStoreEntry)({
                                storePath: storePath,
                                sessionKey: mainSessionKey,
                                update: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, (0, utils_js_1.sleep)(10)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, { thinkingLevel: "high" }];
                                        }
                                    });
                                }); },
                            }),
                        ])];
                case 3:
                    _d.sent();
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)((_b = store[mainSessionKey]) === null || _b === void 0 ? void 0 : _b.modelOverride).toBe("anthropic/claude-opus-4-5");
                    (0, vitest_1.expect)((_c = store[mainSessionKey]) === null || _c === void 0 ? void 0 : _c.thinkingLevel).toBe("high");
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.stat("".concat(storePath, ".lock"))).rejects.toThrow()];
                case 4:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
