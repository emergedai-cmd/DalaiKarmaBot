"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var imessage_js_1 = require("./imessage.js");
(0, vitest_1.describe)("imessage target normalization", function () {
    (0, vitest_1.it)("preserves service prefixes for handles", function () {
        (0, vitest_1.expect)((0, imessage_js_1.normalizeIMessageMessagingTarget)("sms:+1 (555) 222-3333")).toBe("sms:+15552223333");
    });
    (0, vitest_1.it)("drops service prefixes for chat targets", function () {
        (0, vitest_1.expect)((0, imessage_js_1.normalizeIMessageMessagingTarget)("sms:chat_id:123")).toBe("chat_id:123");
        (0, vitest_1.expect)((0, imessage_js_1.normalizeIMessageMessagingTarget)("imessage:CHAT_GUID:abc")).toBe("chat_guid:abc");
        (0, vitest_1.expect)((0, imessage_js_1.normalizeIMessageMessagingTarget)("auto:ChatIdentifier:foo")).toBe("chat_identifier:foo");
    });
});
