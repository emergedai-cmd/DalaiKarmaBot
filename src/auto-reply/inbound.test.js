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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var inbound_debounce_js_1 = require("./inbound-debounce.js");
var groups_js_1 = require("./reply/groups.js");
var inbound_context_js_1 = require("./reply/inbound-context.js");
var inbound_dedupe_js_1 = require("./reply/inbound-dedupe.js");
var inbound_sender_meta_js_1 = require("./reply/inbound-sender-meta.js");
var inbound_text_js_1 = require("./reply/inbound-text.js");
var mentions_js_1 = require("./reply/mentions.js");
var session_js_1 = require("./reply/session.js");
var templating_js_1 = require("./templating.js");
(0, vitest_1.describe)("applyTemplate", function () {
    (0, vitest_1.it)("renders primitive values", function () {
        var ctx = { MessageSid: "sid", IsNewSession: "no" };
        var overrides = ctx;
        overrides.MessageSid = 42;
        overrides.IsNewSession = true;
        (0, vitest_1.expect)((0, templating_js_1.applyTemplate)("sid={{MessageSid}} new={{IsNewSession}}", ctx)).toBe("sid=42 new=true");
    });
    (0, vitest_1.it)("renders arrays of primitives", function () {
        var ctx = { MediaPaths: ["a"] };
        ctx.MediaPaths = ["a", 2, true, null, { ok: false }];
        (0, vitest_1.expect)((0, templating_js_1.applyTemplate)("paths={{MediaPaths}}", ctx)).toBe("paths=a,2,true");
    });
    (0, vitest_1.it)("drops object values", function () {
        var ctx = { CommandArgs: { raw: "go" } };
        (0, vitest_1.expect)((0, templating_js_1.applyTemplate)("args={{CommandArgs}}", ctx)).toBe("args=");
    });
    (0, vitest_1.it)("renders missing placeholders as empty", function () {
        var ctx = {};
        (0, vitest_1.expect)((0, templating_js_1.applyTemplate)("missing={{Missing}}", ctx)).toBe("missing=");
    });
});
(0, vitest_1.describe)("normalizeInboundTextNewlines", function () {
    (0, vitest_1.it)("keeps real newlines", function () {
        (0, vitest_1.expect)((0, inbound_text_js_1.normalizeInboundTextNewlines)("a\nb")).toBe("a\nb");
    });
    (0, vitest_1.it)("normalizes CRLF/CR to LF", function () {
        (0, vitest_1.expect)((0, inbound_text_js_1.normalizeInboundTextNewlines)("a\r\nb")).toBe("a\nb");
        (0, vitest_1.expect)((0, inbound_text_js_1.normalizeInboundTextNewlines)("a\rb")).toBe("a\nb");
    });
    (0, vitest_1.it)("decodes literal \\n to newlines when no real newlines exist", function () {
        (0, vitest_1.expect)((0, inbound_text_js_1.normalizeInboundTextNewlines)("a\\nb")).toBe("a\nb");
    });
});
(0, vitest_1.describe)("finalizeInboundContext", function () {
    (0, vitest_1.it)("fills BodyForAgent/BodyForCommands and normalizes newlines", function () {
        var ctx = {
            Body: "a\\nb\r\nc",
            RawBody: "raw\\nline",
            ChatType: "channel",
            From: "whatsapp:group:123@g.us",
            GroupSubject: "Test",
        };
        var out = (0, inbound_context_js_1.finalizeInboundContext)(ctx);
        (0, vitest_1.expect)(out.Body).toBe("a\nb\nc");
        (0, vitest_1.expect)(out.RawBody).toBe("raw\nline");
        (0, vitest_1.expect)(out.BodyForAgent).toBe("a\nb\nc");
        (0, vitest_1.expect)(out.BodyForCommands).toBe("raw\nline");
        (0, vitest_1.expect)(out.CommandAuthorized).toBe(false);
        (0, vitest_1.expect)(out.ChatType).toBe("channel");
        (0, vitest_1.expect)(out.ConversationLabel).toContain("Test");
    });
    (0, vitest_1.it)("can force BodyForCommands to follow updated CommandBody", function () {
        var ctx = {
            Body: "base",
            BodyForCommands: "<media:audio>",
            CommandBody: "say hi",
            From: "signal:+15550001111",
            ChatType: "direct",
        };
        (0, inbound_context_js_1.finalizeInboundContext)(ctx, { forceBodyForCommands: true });
        (0, vitest_1.expect)(ctx.BodyForCommands).toBe("say hi");
    });
});
(0, vitest_1.describe)("formatInboundBodyWithSenderMeta", function () {
    (0, vitest_1.it)("does nothing for direct messages", function () {
        var ctx = { ChatType: "direct", SenderName: "Alice", SenderId: "A1" };
        (0, vitest_1.expect)((0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({ ctx: ctx, body: "[X] hi" })).toBe("[X] hi");
    });
    (0, vitest_1.it)("appends a sender meta line for non-direct messages", function () {
        var ctx = { ChatType: "group", SenderName: "Alice", SenderId: "A1" };
        (0, vitest_1.expect)((0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({ ctx: ctx, body: "[X] hi" })).toBe("[X] hi\n[from: Alice (A1)]");
    });
    (0, vitest_1.it)("prefers SenderE164 in the label when present", function () {
        var ctx = {
            ChatType: "group",
            SenderName: "Bob",
            SenderId: "bob@s.whatsapp.net",
            SenderE164: "+222",
        };
        (0, vitest_1.expect)((0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({ ctx: ctx, body: "[X] hi" })).toBe("[X] hi\n[from: Bob (+222)]");
    });
    (0, vitest_1.it)("appends with a real newline even if the body contains literal \\n", function () {
        var ctx = { ChatType: "group", SenderName: "Bob", SenderId: "+222" };
        (0, vitest_1.expect)((0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({ ctx: ctx, body: "[X] one\\n[X] two" })).toBe("[X] one\\n[X] two\n[from: Bob (+222)]");
    });
    (0, vitest_1.it)("does not duplicate a sender meta line when one is already present", function () {
        var ctx = { ChatType: "group", SenderName: "Alice", SenderId: "A1" };
        (0, vitest_1.expect)((0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({ ctx: ctx, body: "[X] hi\n[from: Alice (A1)]" })).toBe("[X] hi\n[from: Alice (A1)]");
    });
    (0, vitest_1.it)("does not append when the body already includes a sender prefix", function () {
        var ctx = { ChatType: "group", SenderName: "Alice", SenderId: "A1" };
        (0, vitest_1.expect)((0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({ ctx: ctx, body: "Alice (A1): hi" })).toBe("Alice (A1): hi");
    });
    (0, vitest_1.it)("does not append when the sender prefix follows an envelope header", function () {
        var ctx = { ChatType: "group", SenderName: "Alice", SenderId: "A1" };
        (0, vitest_1.expect)((0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({ ctx: ctx, body: "[Signal Group] Alice (A1): hi" })).toBe("[Signal Group] Alice (A1): hi");
    });
});
(0, vitest_1.describe)("inbound dedupe", function () {
    (0, vitest_1.it)("builds a stable key when MessageSid is present", function () {
        var ctx = {
            Provider: "telegram",
            OriginatingChannel: "telegram",
            OriginatingTo: "telegram:123",
            MessageSid: "42",
        };
        (0, vitest_1.expect)((0, inbound_dedupe_js_1.buildInboundDedupeKey)(ctx)).toBe("telegram|telegram:123|42");
    });
    (0, vitest_1.it)("skips duplicates with the same key", function () {
        (0, inbound_dedupe_js_1.resetInboundDedupe)();
        var ctx = {
            Provider: "whatsapp",
            OriginatingChannel: "whatsapp",
            OriginatingTo: "whatsapp:+1555",
            MessageSid: "msg-1",
        };
        (0, vitest_1.expect)((0, inbound_dedupe_js_1.shouldSkipDuplicateInbound)(ctx, { now: 100 })).toBe(false);
        (0, vitest_1.expect)((0, inbound_dedupe_js_1.shouldSkipDuplicateInbound)(ctx, { now: 200 })).toBe(true);
    });
    (0, vitest_1.it)("does not dedupe when the peer changes", function () {
        (0, inbound_dedupe_js_1.resetInboundDedupe)();
        var base = {
            Provider: "whatsapp",
            OriginatingChannel: "whatsapp",
            MessageSid: "msg-1",
        };
        (0, vitest_1.expect)((0, inbound_dedupe_js_1.shouldSkipDuplicateInbound)(__assign(__assign({}, base), { OriginatingTo: "whatsapp:+1000" }), { now: 100 })).toBe(false);
        (0, vitest_1.expect)((0, inbound_dedupe_js_1.shouldSkipDuplicateInbound)(__assign(__assign({}, base), { OriginatingTo: "whatsapp:+2000" }), { now: 200 })).toBe(false);
    });
    (0, vitest_1.it)("does not dedupe across session keys", function () {
        (0, inbound_dedupe_js_1.resetInboundDedupe)();
        var base = {
            Provider: "whatsapp",
            OriginatingChannel: "whatsapp",
            OriginatingTo: "whatsapp:+1555",
            MessageSid: "msg-1",
        };
        (0, vitest_1.expect)((0, inbound_dedupe_js_1.shouldSkipDuplicateInbound)(__assign(__assign({}, base), { SessionKey: "agent:alpha:main" }), { now: 100 })).toBe(false);
        (0, vitest_1.expect)((0, inbound_dedupe_js_1.shouldSkipDuplicateInbound)(__assign(__assign({}, base), { SessionKey: "agent:bravo:main" }), { now: 200 })).toBe(false);
        (0, vitest_1.expect)((0, inbound_dedupe_js_1.shouldSkipDuplicateInbound)(__assign(__assign({}, base), { SessionKey: "agent:alpha:main" }), { now: 300 })).toBe(true);
    });
});
(0, vitest_1.describe)("createInboundDebouncer", function () {
    (0, vitest_1.it)("debounces and combines items", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, debouncer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    calls = [];
                    debouncer = (0, inbound_debounce_js_1.createInboundDebouncer)({
                        debounceMs: 10,
                        buildKey: function (item) { return item.key; },
                        onFlush: function (items) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                calls.push(items.map(function (entry) { return entry.id; }));
                                return [2 /*return*/];
                            });
                        }); },
                    });
                    return [4 /*yield*/, debouncer.enqueue({ key: "a", id: "1" })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, debouncer.enqueue({ key: "a", id: "2" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(calls).toEqual([]);
                    return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(10)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(calls).toEqual([["1", "2"]]);
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flushes buffered items before non-debounced item", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, debouncer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    calls = [];
                    debouncer = (0, inbound_debounce_js_1.createInboundDebouncer)({
                        debounceMs: 50,
                        buildKey: function (item) { return item.key; },
                        shouldDebounce: function (item) { return item.debounce; },
                        onFlush: function (items) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                calls.push(items.map(function (entry) { return entry.id; }));
                                return [2 /*return*/];
                            });
                        }); },
                    });
                    return [4 /*yield*/, debouncer.enqueue({ key: "a", id: "1", debounce: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, debouncer.enqueue({ key: "a", id: "2", debounce: false })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(calls).toEqual([["1"], ["2"]]);
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("initSessionState sender meta", function () {
    (0, vitest_1.it)("injects sender meta into BodyStripped for group chats", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sender-meta-"))];
                case 1:
                    root = _a.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = { session: { store: storePath } };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: {
                                Body: "[WhatsApp 123@g.us] ping",
                                ChatType: "group",
                                SenderName: "Bob",
                                SenderE164: "+222",
                                SenderId: "222@s.whatsapp.net",
                                SessionKey: "agent:main:whatsapp:group:123@g.us",
                            },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.sessionCtx.BodyStripped).toBe("[WhatsApp 123@g.us] ping\n[from: Bob (+222)]");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not inject sender meta for direct chats", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, storePath, cfg, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sender-meta-direct-"))];
                case 1:
                    root = _a.sent();
                    storePath = node_path_1.default.join(root, "sessions.json");
                    cfg = { session: { store: storePath } };
                    return [4 /*yield*/, (0, session_js_1.initSessionState)({
                            ctx: {
                                Body: "[WhatsApp +1] ping",
                                ChatType: "direct",
                                SenderName: "Bob",
                                SenderE164: "+222",
                                SessionKey: "agent:main:whatsapp:dm:+222",
                            },
                            cfg: cfg,
                            commandAuthorized: true,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.sessionCtx.BodyStripped).toBe("[WhatsApp +1] ping");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("mention helpers", function () {
    (0, vitest_1.it)("builds regexes and skips invalid patterns", function () {
        var _a;
        var regexes = (0, mentions_js_1.buildMentionRegexes)({
            messages: {
                groupChat: { mentionPatterns: ["\\bopenclaw\\b", "(invalid"] },
            },
        });
        (0, vitest_1.expect)(regexes).toHaveLength(1);
        (0, vitest_1.expect)((_a = regexes[0]) === null || _a === void 0 ? void 0 : _a.test("openclaw")).toBe(true);
    });
    (0, vitest_1.it)("normalizes zero-width characters", function () {
        (0, vitest_1.expect)((0, mentions_js_1.normalizeMentionText)("open\u200bclaw")).toBe("openclaw");
    });
    (0, vitest_1.it)("matches patterns case-insensitively", function () {
        var regexes = (0, mentions_js_1.buildMentionRegexes)({
            messages: { groupChat: { mentionPatterns: ["\\bopenclaw\\b"] } },
        });
        (0, vitest_1.expect)((0, mentions_js_1.matchesMentionPatterns)("OPENCLAW: hi", regexes)).toBe(true);
    });
    (0, vitest_1.it)("uses per-agent mention patterns when configured", function () {
        var regexes = (0, mentions_js_1.buildMentionRegexes)({
            messages: {
                groupChat: { mentionPatterns: ["\\bglobal\\b"] },
            },
            agents: {
                list: [
                    {
                        id: "work",
                        groupChat: { mentionPatterns: ["\\bworkbot\\b"] },
                    },
                ],
            },
        }, "work");
        (0, vitest_1.expect)((0, mentions_js_1.matchesMentionPatterns)("workbot: hi", regexes)).toBe(true);
        (0, vitest_1.expect)((0, mentions_js_1.matchesMentionPatterns)("global: hi", regexes)).toBe(false);
    });
});
(0, vitest_1.describe)("resolveGroupRequireMention", function () {
    (0, vitest_1.it)("respects Discord guild/channel requireMention settings", function () {
        var cfg = {
            channels: {
                discord: {
                    guilds: {
                        "145": {
                            requireMention: false,
                            channels: {
                                general: { allow: true },
                            },
                        },
                    },
                },
            },
        };
        var ctx = {
            Provider: "discord",
            From: "discord:group:123",
            GroupChannel: "#general",
            GroupSpace: "145",
        };
        var groupResolution = {
            channel: "discord",
            id: "123",
            chatType: "group",
        };
        (0, vitest_1.expect)((0, groups_js_1.resolveGroupRequireMention)({ cfg: cfg, ctx: ctx, groupResolution: groupResolution })).toBe(false);
    });
    (0, vitest_1.it)("respects Slack channel requireMention settings", function () {
        var cfg = {
            channels: {
                slack: {
                    channels: {
                        C123: { requireMention: false },
                    },
                },
            },
        };
        var ctx = {
            Provider: "slack",
            From: "slack:channel:C123",
            GroupSubject: "#general",
        };
        var groupResolution = {
            channel: "slack",
            id: "C123",
            chatType: "group",
        };
        (0, vitest_1.expect)((0, groups_js_1.resolveGroupRequireMention)({ cfg: cfg, ctx: ctx, groupResolution: groupResolution })).toBe(false);
    });
});
