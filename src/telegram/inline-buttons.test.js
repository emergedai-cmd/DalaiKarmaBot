"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var inline_buttons_js_1 = require("./inline-buttons.js");
(0, vitest_1.describe)("resolveTelegramTargetChatType", function () {
    (0, vitest_1.it)("returns 'direct' for positive numeric IDs", function () {
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("5232990709")).toBe("direct");
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("123456789")).toBe("direct");
    });
    (0, vitest_1.it)("returns 'group' for negative numeric IDs", function () {
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("-123456789")).toBe("group");
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("-1001234567890")).toBe("group");
    });
    (0, vitest_1.it)("handles telegram: prefix from normalizeTelegramMessagingTarget", function () {
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("telegram:5232990709")).toBe("direct");
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("telegram:-123456789")).toBe("group");
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("TELEGRAM:5232990709")).toBe("direct");
    });
    (0, vitest_1.it)("handles tg/group prefixes and topic suffixes", function () {
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("tg:5232990709")).toBe("direct");
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("telegram:group:-1001234567890")).toBe("group");
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("telegram:group:-1001234567890:topic:456")).toBe("group");
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("-1001234567890:456")).toBe("group");
    });
    (0, vitest_1.it)("returns 'unknown' for usernames", function () {
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("@username")).toBe("unknown");
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("telegram:@username")).toBe("unknown");
    });
    (0, vitest_1.it)("returns 'unknown' for empty strings", function () {
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("")).toBe("unknown");
        (0, vitest_1.expect)((0, inline_buttons_js_1.resolveTelegramTargetChatType)("   ")).toBe("unknown");
    });
});
