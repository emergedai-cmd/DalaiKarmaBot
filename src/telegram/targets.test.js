"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var targets_js_1 = require("./targets.js");
(0, vitest_1.describe)("stripTelegramInternalPrefixes", function () {
    (0, vitest_1.it)("strips telegram prefix", function () {
        (0, vitest_1.expect)((0, targets_js_1.stripTelegramInternalPrefixes)("telegram:123")).toBe("123");
    });
    (0, vitest_1.it)("strips telegram+group prefixes", function () {
        (0, vitest_1.expect)((0, targets_js_1.stripTelegramInternalPrefixes)("telegram:group:-100123")).toBe("-100123");
    });
    (0, vitest_1.it)("does not strip group prefix without telegram prefix", function () {
        (0, vitest_1.expect)((0, targets_js_1.stripTelegramInternalPrefixes)("group:-100123")).toBe("group:-100123");
    });
    (0, vitest_1.it)("is idempotent", function () {
        (0, vitest_1.expect)((0, targets_js_1.stripTelegramInternalPrefixes)("@mychannel")).toBe("@mychannel");
    });
});
(0, vitest_1.describe)("parseTelegramTarget", function () {
    (0, vitest_1.it)("parses plain chatId", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseTelegramTarget)("-1001234567890")).toEqual({
            chatId: "-1001234567890",
        });
    });
    (0, vitest_1.it)("parses @username", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseTelegramTarget)("@mychannel")).toEqual({
            chatId: "@mychannel",
        });
    });
    (0, vitest_1.it)("parses chatId:topicId format", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseTelegramTarget)("-1001234567890:123")).toEqual({
            chatId: "-1001234567890",
            messageThreadId: 123,
        });
    });
    (0, vitest_1.it)("parses chatId:topic:topicId format", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseTelegramTarget)("-1001234567890:topic:456")).toEqual({
            chatId: "-1001234567890",
            messageThreadId: 456,
        });
    });
    (0, vitest_1.it)("trims whitespace", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseTelegramTarget)("  -1001234567890:99  ")).toEqual({
            chatId: "-1001234567890",
            messageThreadId: 99,
        });
    });
    (0, vitest_1.it)("does not treat non-numeric suffix as topicId", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseTelegramTarget)("-1001234567890:abc")).toEqual({
            chatId: "-1001234567890:abc",
        });
    });
    (0, vitest_1.it)("strips internal prefixes before parsing", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseTelegramTarget)("telegram:group:-1001234567890:topic:456")).toEqual({
            chatId: "-1001234567890",
            messageThreadId: 456,
        });
    });
});
