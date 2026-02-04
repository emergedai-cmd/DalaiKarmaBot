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
var model_selection_js_1 = require("../../agents/model-selection.js");
var system_events_js_1 = require("../../infra/system-events.js");
var session_reset_model_js_1 = require("./session-reset-model.js");
var session_updates_js_1 = require("./session-updates.js");
var session_js_1 = require("./session.js");
vitest_1.vi.mock("../../agents/model-catalog.js", function () { return ({
    loadModelCatalog: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, [
                    { provider: "minimax", id: "m2.1", name: "M2.1" },
                    { provider: "openai", id: "gpt-4o-mini", name: "GPT-4o mini" },
                ]];
        });
    }); }),
}); });
(0, vitest_1.describe)("initSessionState reset triggers in WhatsApp groups", function () {
    function createStorePath(prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var root;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), prefix))];
                    case 1:
                        root = _a.sent();
                        return [2 /*return*/, node_path_1.default.join(root, "sessions.json")];
                }
            });
        });
    }
    function seedSessionStore(params) {
        return __awaiter(this, void 0, void 0, function () {
            var saveSessionStore;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../config/sessions.js"); })];
                    case 1:
                        saveSessionStore = (_b.sent()).saveSessionStore;
                        return [4 /*yield*/, saveSessionStore(params.storePath, (_a = {},
                                _a[params.sessionKey] = {
                                    sessionId: params.sessionId,
                                    updatedAt: Date.now(),
                                },
                                _a))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function makeCfg(params) {
        return {
            session: { store: params.storePath, idleMinutes: 999 },
            channels: {
                whatsapp: {
                    allowFrom: params.allowFrom,
                    groupPolicy: "open",
                },
            },
        };
    }
    (0, vitest_1.it)("Reset trigger /new works for authorized sender in WhatsApp group", function () { return __awaiter(void 0, void 0, void 0, function () {
        var storePath, sessionKey, existingSessionId, cfg, groupMessageCtx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createStorePath("openclaw-group-reset-")];
                case 1:
                    storePath = _a.sent();
                    sessionKey = "agent:main:whatsapp:group:120363406150318674@g.us";
                    existingSessionId = "existing-session-123";
                    return [4 /*yield*/, seedSessionStore({
                            storePath: storePath,
                            sessionKey: sessionKey,
                            sessionId: existingSessionId,
                        })];
                case 2:
                    _a.sent();
                    cfg = makeCfg({
                        storePath: storePath,
                        allowFrom: ["+41796666864"],
                    });
                    groupMessageCtx = {
                        Body: "[Chat messages since your last reply - for context]\\n[WhatsApp 120363406150318674@g.us 2026-01-13T07:45Z] Someone: hello\\n\\n[Current message - respond to this]\\n[WhatsApp 120363406150318674@g.us 2026-01-13T07:45Z] Peschi\u00F1o: /new\\n[from: Peschi\u00F1o (+41796666864)]",
                        RawBody: "/new",
                        CommandBody: "/new",
                        From: "120363406150318674@g.us",
                        To: "+41779241027",
                        ChatType: "group",
                        SessionKey: sessionKey,
                        Provider: "whatsapp",
                        Surface: "whatsapp",
                        SenderName: "Peschiño",
                        SenderE164: "+41796666864",
                        SenderId: "41796666864:0@s.whatsapp.net",
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: groupMessageCtx,
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.triggerBodyNormalized).toBe("/new");
                    (0, vitest_1.expect)(result.isNewSession).toBe(true);
                    (0, vitest_1.expect)(result.sessionId).not.toBe(existingSessionId);
                    (0, vitest_1.expect)(result.bodyStripped).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("Reset trigger /new blocked for unauthorized sender in existing session", function () { return __awaiter(void 0, void 0, void 0, function () {
        var storePath, sessionKey, existingSessionId, cfg, groupMessageCtx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createStorePath("openclaw-group-reset-unauth-")];
                case 1:
                    storePath = _a.sent();
                    sessionKey = "agent:main:whatsapp:group:120363406150318674@g.us";
                    existingSessionId = "existing-session-123";
                    return [4 /*yield*/, seedSessionStore({
                            storePath: storePath,
                            sessionKey: sessionKey,
                            sessionId: existingSessionId,
                        })];
                case 2:
                    _a.sent();
                    cfg = makeCfg({
                        storePath: storePath,
                        allowFrom: ["+41796666864"],
                    });
                    groupMessageCtx = {
                        Body: "[Context]\\n[WhatsApp ...] OtherPerson: /new\\n[from: OtherPerson (+1555123456)]",
                        RawBody: "/new",
                        CommandBody: "/new",
                        From: "120363406150318674@g.us",
                        To: "+41779241027",
                        ChatType: "group",
                        SessionKey: sessionKey,
                        Provider: "whatsapp",
                        Surface: "whatsapp",
                        SenderName: "OtherPerson",
                        SenderE164: "+1555123456",
                        SenderId: "1555123456:0@s.whatsapp.net",
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: groupMessageCtx,
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.triggerBodyNormalized).toBe("/new");
                    (0, vitest_1.expect)(result.sessionId).toBe(existingSessionId);
                    (0, vitest_1.expect)(result.isNewSession).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("Reset trigger works when RawBody is clean but Body has wrapped context", function () { return __awaiter(void 0, void 0, void 0, function () {
        var storePath, sessionKey, existingSessionId, cfg, groupMessageCtx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createStorePath("openclaw-group-rawbody-")];
                case 1:
                    storePath = _a.sent();
                    sessionKey = "agent:main:whatsapp:group:g1";
                    existingSessionId = "existing-session-123";
                    return [4 /*yield*/, seedSessionStore({
                            storePath: storePath,
                            sessionKey: sessionKey,
                            sessionId: existingSessionId,
                        })];
                case 2:
                    _a.sent();
                    cfg = makeCfg({
                        storePath: storePath,
                        allowFrom: ["*"],
                    });
                    groupMessageCtx = {
                        Body: "[WhatsApp 120363406150318674@g.us 2026-01-13T07:45Z] Jake: /new\n[from: Jake (+1222)]",
                        RawBody: "/new",
                        CommandBody: "/new",
                        From: "120363406150318674@g.us",
                        To: "+1111",
                        ChatType: "group",
                        SessionKey: sessionKey,
                        Provider: "whatsapp",
                        SenderE164: "+1222",
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: groupMessageCtx,
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.triggerBodyNormalized).toBe("/new");
                    (0, vitest_1.expect)(result.isNewSession).toBe(true);
                    (0, vitest_1.expect)(result.sessionId).not.toBe(existingSessionId);
                    (0, vitest_1.expect)(result.bodyStripped).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("Reset trigger /new works when SenderId is LID but SenderE164 is authorized", function () { return __awaiter(void 0, void 0, void 0, function () {
        var storePath, sessionKey, existingSessionId, cfg, groupMessageCtx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createStorePath("openclaw-group-reset-lid-")];
                case 1:
                    storePath = _a.sent();
                    sessionKey = "agent:main:whatsapp:group:120363406150318674@g.us";
                    existingSessionId = "existing-session-123";
                    return [4 /*yield*/, seedSessionStore({
                            storePath: storePath,
                            sessionKey: sessionKey,
                            sessionId: existingSessionId,
                        })];
                case 2:
                    _a.sent();
                    cfg = makeCfg({
                        storePath: storePath,
                        allowFrom: ["+41796666864"],
                    });
                    groupMessageCtx = {
                        Body: "[WhatsApp 120363406150318674@g.us 2026-01-13T07:45Z] Owner: /new\n[from: Owner (+41796666864)]",
                        RawBody: "/new",
                        CommandBody: "/new",
                        From: "120363406150318674@g.us",
                        To: "+41779241027",
                        ChatType: "group",
                        SessionKey: sessionKey,
                        Provider: "whatsapp",
                        Surface: "whatsapp",
                        SenderName: "Owner",
                        SenderE164: "+41796666864",
                        SenderId: "123@lid",
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: groupMessageCtx,
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.triggerBodyNormalized).toBe("/new");
                    (0, vitest_1.expect)(result.isNewSession).toBe(true);
                    (0, vitest_1.expect)(result.sessionId).not.toBe(existingSessionId);
                    (0, vitest_1.expect)(result.bodyStripped).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("Reset trigger /new blocked when SenderId is LID but SenderE164 is unauthorized", function () { return __awaiter(void 0, void 0, void 0, function () {
        var storePath, sessionKey, existingSessionId, cfg, groupMessageCtx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createStorePath("openclaw-group-reset-lid-unauth-")];
                case 1:
                    storePath = _a.sent();
                    sessionKey = "agent:main:whatsapp:group:120363406150318674@g.us";
                    existingSessionId = "existing-session-123";
                    return [4 /*yield*/, seedSessionStore({
                            storePath: storePath,
                            sessionKey: sessionKey,
                            sessionId: existingSessionId,
                        })];
                case 2:
                    _a.sent();
                    cfg = makeCfg({
                        storePath: storePath,
                        allowFrom: ["+41796666864"],
                    });
                    groupMessageCtx = {
                        Body: "[WhatsApp 120363406150318674@g.us 2026-01-13T07:45Z] Other: /new\n[from: Other (+1555123456)]",
                        RawBody: "/new",
                        CommandBody: "/new",
                        From: "120363406150318674@g.us",
                        To: "+41779241027",
                        ChatType: "group",
                        SessionKey: sessionKey,
                        Provider: "whatsapp",
                        Surface: "whatsapp",
                        SenderName: "Other",
                        SenderE164: "+1555123456",
                        SenderId: "123@lid",
                    };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: groupMessageCtx,
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.triggerBodyNormalized).toBe("/new");
                    (0, vitest_1.expect)(result.sessionId).toBe(existingSessionId);
                    (0, vitest_1.expect)(result.isNewSession).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("applyResetModelOverride", function () {
    (0, vitest_1.it)("selects a model hint and strips it from the body", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, aliasIndex, sessionEntry, sessionStore, sessionCtx, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({ cfg: cfg, defaultProvider: "openai" });
                    sessionEntry = {
                        sessionId: "s1",
                        updatedAt: Date.now(),
                    };
                    sessionStore = { "agent:main:dm:1": sessionEntry };
                    sessionCtx = { BodyStripped: "minimax summarize" };
                    ctx = { ChatType: "direct" };
                    return [4 /*yield*/, (0, session_reset_model_js_1.applyResetModelOverride)({
                            cfg: cfg,
                            resetTriggered: true,
                            bodyStripped: "minimax summarize",
                            sessionCtx: sessionCtx,
                            ctx: ctx,
                            sessionEntry: sessionEntry,
                            sessionStore: sessionStore,
                            sessionKey: "agent:main:dm:1",
                            defaultProvider: "openai",
                            defaultModel: "gpt-4o-mini",
                            aliasIndex: aliasIndex,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sessionEntry.providerOverride).toBe("minimax");
                    (0, vitest_1.expect)(sessionEntry.modelOverride).toBe("m2.1");
                    (0, vitest_1.expect)(sessionCtx.BodyStripped).toBe("summarize");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clears auth profile overrides when reset applies a model", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, aliasIndex, sessionEntry, sessionStore, sessionCtx, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({ cfg: cfg, defaultProvider: "openai" });
                    sessionEntry = {
                        sessionId: "s1",
                        updatedAt: Date.now(),
                        authProfileOverride: "anthropic:default",
                        authProfileOverrideSource: "user",
                        authProfileOverrideCompactionCount: 2,
                    };
                    sessionStore = { "agent:main:dm:1": sessionEntry };
                    sessionCtx = { BodyStripped: "minimax summarize" };
                    ctx = { ChatType: "direct" };
                    return [4 /*yield*/, (0, session_reset_model_js_1.applyResetModelOverride)({
                            cfg: cfg,
                            resetTriggered: true,
                            bodyStripped: "minimax summarize",
                            sessionCtx: sessionCtx,
                            ctx: ctx,
                            sessionEntry: sessionEntry,
                            sessionStore: sessionStore,
                            sessionKey: "agent:main:dm:1",
                            defaultProvider: "openai",
                            defaultModel: "gpt-4o-mini",
                            aliasIndex: aliasIndex,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sessionEntry.authProfileOverride).toBeUndefined();
                    (0, vitest_1.expect)(sessionEntry.authProfileOverrideSource).toBeUndefined();
                    (0, vitest_1.expect)(sessionEntry.authProfileOverrideCompactionCount).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips when resetTriggered is false", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, aliasIndex, sessionEntry, sessionStore, sessionCtx, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({ cfg: cfg, defaultProvider: "openai" });
                    sessionEntry = {
                        sessionId: "s1",
                        updatedAt: Date.now(),
                    };
                    sessionStore = { "agent:main:dm:1": sessionEntry };
                    sessionCtx = { BodyStripped: "minimax summarize" };
                    ctx = { ChatType: "direct" };
                    return [4 /*yield*/, (0, session_reset_model_js_1.applyResetModelOverride)({
                            cfg: cfg,
                            resetTriggered: false,
                            bodyStripped: "minimax summarize",
                            sessionCtx: sessionCtx,
                            ctx: ctx,
                            sessionEntry: sessionEntry,
                            sessionStore: sessionStore,
                            sessionKey: "agent:main:dm:1",
                            defaultProvider: "openai",
                            defaultModel: "gpt-4o-mini",
                            aliasIndex: aliasIndex,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(sessionEntry.providerOverride).toBeUndefined();
                    (0, vitest_1.expect)(sessionEntry.modelOverride).toBeUndefined();
                    (0, vitest_1.expect)(sessionCtx.BodyStripped).toBe("minimax summarize");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("prependSystemEvents", function () {
    (0, vitest_1.it)("adds a local timestamp to queued system events by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalTz, timestamp, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    originalTz = process.env.TZ;
                    process.env.TZ = "America/Los_Angeles";
                    timestamp = new Date("2026-01-12T20:19:17Z");
                    vitest_1.vi.setSystemTime(timestamp);
                    (0, system_events_js_1.enqueueSystemEvent)("Model switched.", { sessionKey: "agent:main:main" });
                    return [4 /*yield*/, (0, session_updates_js_1.prependSystemEvents)({
                            cfg: {},
                            sessionKey: "agent:main:main",
                            isMainSession: false,
                            isNewSession: false,
                            prefixedBodyBase: "User: hi",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toMatch(/System: \[2026-01-12 12:19:17 [^\]]+\] Model switched\./);
                    (0, system_events_js_1.resetSystemEventsForTest)();
                    process.env.TZ = originalTz;
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
});
