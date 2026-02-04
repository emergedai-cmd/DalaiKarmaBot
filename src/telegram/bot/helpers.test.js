"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var helpers_js_1 = require("./helpers.js");
(0, vitest_1.describe)("resolveTelegramForumThreadId", function () {
    (0, vitest_1.it)("returns undefined for non-forum groups even with messageThreadId", function () {
        // Reply threads in regular groups should not create separate sessions
        (0, vitest_1.expect)((0, helpers_js_1.resolveTelegramForumThreadId)({ isForum: false, messageThreadId: 42 })).toBeUndefined();
    });
    (0, vitest_1.it)("returns undefined for non-forum groups without messageThreadId", function () {
        (0, vitest_1.expect)((0, helpers_js_1.resolveTelegramForumThreadId)({ isForum: false, messageThreadId: undefined })).toBeUndefined();
        (0, vitest_1.expect)((0, helpers_js_1.resolveTelegramForumThreadId)({ isForum: undefined, messageThreadId: 99 })).toBeUndefined();
    });
    (0, vitest_1.it)("returns General topic (1) for forum groups without messageThreadId", function () {
        (0, vitest_1.expect)((0, helpers_js_1.resolveTelegramForumThreadId)({ isForum: true, messageThreadId: undefined })).toBe(1);
        (0, vitest_1.expect)((0, helpers_js_1.resolveTelegramForumThreadId)({ isForum: true, messageThreadId: null })).toBe(1);
    });
    (0, vitest_1.it)("returns the topic id for forum groups with messageThreadId", function () {
        (0, vitest_1.expect)((0, helpers_js_1.resolveTelegramForumThreadId)({ isForum: true, messageThreadId: 99 })).toBe(99);
    });
});
(0, vitest_1.describe)("buildTelegramThreadParams", function () {
    (0, vitest_1.it)("omits General topic thread id for message sends", function () {
        (0, vitest_1.expect)((0, helpers_js_1.buildTelegramThreadParams)({ id: 1, scope: "forum" })).toBeUndefined();
    });
    (0, vitest_1.it)("includes non-General topic thread ids", function () {
        (0, vitest_1.expect)((0, helpers_js_1.buildTelegramThreadParams)({ id: 99, scope: "forum" })).toEqual({
            message_thread_id: 99,
        });
    });
    (0, vitest_1.it)("keeps thread id=1 for dm threads", function () {
        (0, vitest_1.expect)((0, helpers_js_1.buildTelegramThreadParams)({ id: 1, scope: "dm" })).toEqual({
            message_thread_id: 1,
        });
    });
    (0, vitest_1.it)("normalizes thread ids to integers", function () {
        (0, vitest_1.expect)((0, helpers_js_1.buildTelegramThreadParams)({ id: 42.9, scope: "forum" })).toEqual({
            message_thread_id: 42,
        });
    });
});
(0, vitest_1.describe)("buildTypingThreadParams", function () {
    (0, vitest_1.it)("returns undefined when no thread id is provided", function () {
        (0, vitest_1.expect)((0, helpers_js_1.buildTypingThreadParams)(undefined)).toBeUndefined();
    });
    (0, vitest_1.it)("includes General topic thread id for typing indicators", function () {
        (0, vitest_1.expect)((0, helpers_js_1.buildTypingThreadParams)(1)).toEqual({ message_thread_id: 1 });
    });
    (0, vitest_1.it)("normalizes thread ids to integers", function () {
        (0, vitest_1.expect)((0, helpers_js_1.buildTypingThreadParams)(42.9)).toEqual({ message_thread_id: 42 });
    });
});
(0, vitest_1.describe)("normalizeForwardedContext", function () {
    (0, vitest_1.it)("handles forward_origin users", function () {
        var ctx = (0, helpers_js_1.normalizeForwardedContext)({
            forward_origin: {
                type: "user",
                sender_user: { first_name: "Ada", last_name: "Lovelace", username: "ada", id: 42 },
                date: 123,
            },
            // oxlint-disable-next-line typescript/no-explicit-any
        });
        (0, vitest_1.expect)(ctx).not.toBeNull();
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.from).toBe("Ada Lovelace (@ada)");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromType).toBe("user");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromId).toBe("42");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromUsername).toBe("ada");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromTitle).toBe("Ada Lovelace");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.date).toBe(123);
    });
    (0, vitest_1.it)("handles hidden forward_origin names", function () {
        var ctx = (0, helpers_js_1.normalizeForwardedContext)({
            forward_origin: { type: "hidden_user", sender_user_name: "Hidden Name", date: 456 },
            // oxlint-disable-next-line typescript/no-explicit-any
        });
        (0, vitest_1.expect)(ctx).not.toBeNull();
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.from).toBe("Hidden Name");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromType).toBe("hidden_user");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromTitle).toBe("Hidden Name");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.date).toBe(456);
    });
    (0, vitest_1.it)("handles legacy forwards with signatures", function () {
        var ctx = (0, helpers_js_1.normalizeForwardedContext)({
            forward_from_chat: {
                title: "OpenClaw Updates",
                username: "openclaw",
                id: 99,
                type: "channel",
            },
            forward_signature: "Stan",
            forward_date: 789,
            // oxlint-disable-next-line typescript/no-explicit-any
        });
        (0, vitest_1.expect)(ctx).not.toBeNull();
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.from).toBe("OpenClaw Updates (Stan)");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromType).toBe("legacy_channel");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromId).toBe("99");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromUsername).toBe("openclaw");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromTitle).toBe("OpenClaw Updates");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromSignature).toBe("Stan");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.date).toBe(789);
    });
    (0, vitest_1.it)("handles legacy hidden sender names", function () {
        var ctx = (0, helpers_js_1.normalizeForwardedContext)({
            forward_sender_name: "Legacy Hidden",
            forward_date: 111,
            // oxlint-disable-next-line typescript/no-explicit-any
        });
        (0, vitest_1.expect)(ctx).not.toBeNull();
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.from).toBe("Legacy Hidden");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.fromType).toBe("legacy_hidden_user");
        (0, vitest_1.expect)(ctx === null || ctx === void 0 ? void 0 : ctx.date).toBe(111);
    });
});
(0, vitest_1.describe)("expandTextLinks", function () {
    (0, vitest_1.it)("returns text unchanged when no entities are provided", function () {
        (0, vitest_1.expect)((0, helpers_js_1.expandTextLinks)("Hello world")).toBe("Hello world");
        (0, vitest_1.expect)((0, helpers_js_1.expandTextLinks)("Hello world", null)).toBe("Hello world");
        (0, vitest_1.expect)((0, helpers_js_1.expandTextLinks)("Hello world", [])).toBe("Hello world");
    });
    (0, vitest_1.it)("returns text unchanged when there are no text_link entities", function () {
        var entities = [
            { type: "mention", offset: 0, length: 5 },
            { type: "bold", offset: 6, length: 5 },
        ];
        (0, vitest_1.expect)((0, helpers_js_1.expandTextLinks)("@user hello", entities)).toBe("@user hello");
    });
    (0, vitest_1.it)("expands a single text_link entity", function () {
        var text = "Check this link for details";
        var entities = [{ type: "text_link", offset: 11, length: 4, url: "https://example.com" }];
        (0, vitest_1.expect)((0, helpers_js_1.expandTextLinks)(text, entities)).toBe("Check this [link](https://example.com) for details");
    });
    (0, vitest_1.it)("expands multiple text_link entities", function () {
        var text = "Visit Google or GitHub for more";
        var entities = [
            { type: "text_link", offset: 6, length: 6, url: "https://google.com" },
            { type: "text_link", offset: 16, length: 6, url: "https://github.com" },
        ];
        (0, vitest_1.expect)((0, helpers_js_1.expandTextLinks)(text, entities)).toBe("Visit [Google](https://google.com) or [GitHub](https://github.com) for more");
    });
    (0, vitest_1.it)("handles adjacent text_link entities", function () {
        var text = "AB";
        var entities = [
            { type: "text_link", offset: 0, length: 1, url: "https://a.example" },
            { type: "text_link", offset: 1, length: 1, url: "https://b.example" },
        ];
        (0, vitest_1.expect)((0, helpers_js_1.expandTextLinks)(text, entities)).toBe("[A](https://a.example)[B](https://b.example)");
    });
    (0, vitest_1.it)("preserves offsets from the original string", function () {
        var text = " Hello world";
        var entities = [{ type: "text_link", offset: 1, length: 5, url: "https://example.com" }];
        (0, vitest_1.expect)((0, helpers_js_1.expandTextLinks)(text, entities)).toBe(" [Hello](https://example.com) world");
    });
});
