"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sent_message_cache_js_1 = require("./sent-message-cache.js");
(0, vitest_1.describe)("sent-message-cache", function () {
    (0, vitest_1.afterEach)(function () {
        (0, sent_message_cache_js_1.clearSentMessageCache)();
    });
    (0, vitest_1.it)("records and retrieves sent messages", function () {
        (0, sent_message_cache_js_1.recordSentMessage)(123, 1);
        (0, sent_message_cache_js_1.recordSentMessage)(123, 2);
        (0, sent_message_cache_js_1.recordSentMessage)(456, 10);
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasSentByBot)(123, 1)).toBe(true);
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasSentByBot)(123, 2)).toBe(true);
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasSentByBot)(456, 10)).toBe(true);
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasSentByBot)(123, 3)).toBe(false);
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasSentByBot)(789, 1)).toBe(false);
    });
    (0, vitest_1.it)("handles string chat IDs", function () {
        (0, sent_message_cache_js_1.recordSentMessage)("123", 1);
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasSentByBot)("123", 1)).toBe(true);
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasSentByBot)(123, 1)).toBe(true);
    });
    (0, vitest_1.it)("clears cache", function () {
        (0, sent_message_cache_js_1.recordSentMessage)(123, 1);
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasSentByBot)(123, 1)).toBe(true);
        (0, sent_message_cache_js_1.clearSentMessageCache)();
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasSentByBot)(123, 1)).toBe(false);
    });
});
