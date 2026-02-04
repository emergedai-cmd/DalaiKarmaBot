"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sent_message_cache_js_1 = require("./sent-message-cache.js");
(0, vitest_1.describe)("msteams sent message cache", function () {
    (0, vitest_1.it)("records and resolves sent message ids", function () {
        (0, sent_message_cache_js_1.clearMSTeamsSentMessageCache)();
        (0, sent_message_cache_js_1.recordMSTeamsSentMessage)("conv-1", "msg-1");
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasMSTeamsMessageSent)("conv-1", "msg-1")).toBe(true);
        (0, vitest_1.expect)((0, sent_message_cache_js_1.wasMSTeamsMessageSent)("conv-1", "msg-2")).toBe(false);
    });
});
