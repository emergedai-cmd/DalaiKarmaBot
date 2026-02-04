"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var targets_js_1 = require("./targets.js");
(0, vitest_1.describe)("imessage targets", function () {
    (0, vitest_1.it)("parses chat_id targets", function () {
        var target = (0, targets_js_1.parseIMessageTarget)("chat_id:123");
        (0, vitest_1.expect)(target).toEqual({ kind: "chat_id", chatId: 123 });
    });
    (0, vitest_1.it)("parses chat targets", function () {
        var target = (0, targets_js_1.parseIMessageTarget)("chat:456");
        (0, vitest_1.expect)(target).toEqual({ kind: "chat_id", chatId: 456 });
    });
    (0, vitest_1.it)("parses sms handles with service", function () {
        var target = (0, targets_js_1.parseIMessageTarget)("sms:+1555");
        (0, vitest_1.expect)(target).toEqual({ kind: "handle", to: "+1555", service: "sms" });
    });
    (0, vitest_1.it)("normalizes handles", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("Name@Example.com")).toBe("name@example.com");
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)(" +1 (555) 222-3333 ")).toBe("+15552223333");
    });
    (0, vitest_1.it)("normalizes chat_id prefixes case-insensitively", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("CHAT_ID:123")).toBe("chat_id:123");
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("Chat_Id:456")).toBe("chat_id:456");
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("chatid:789")).toBe("chat_id:789");
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("CHAT:42")).toBe("chat_id:42");
    });
    (0, vitest_1.it)("normalizes chat_guid prefixes case-insensitively", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("CHAT_GUID:abc-def")).toBe("chat_guid:abc-def");
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("ChatGuid:XYZ")).toBe("chat_guid:XYZ");
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("GUID:test-guid")).toBe("chat_guid:test-guid");
    });
    (0, vitest_1.it)("normalizes chat_identifier prefixes case-insensitively", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("CHAT_IDENTIFIER:iMessage;-;chat123")).toBe("chat_identifier:iMessage;-;chat123");
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("ChatIdentifier:test")).toBe("chat_identifier:test");
        (0, vitest_1.expect)((0, targets_js_1.normalizeIMessageHandle)("CHATIDENT:foo")).toBe("chat_identifier:foo");
    });
    (0, vitest_1.it)("checks allowFrom against chat_id", function () {
        var ok = (0, targets_js_1.isAllowedIMessageSender)({
            allowFrom: ["chat_id:9"],
            sender: "+1555",
            chatId: 9,
        });
        (0, vitest_1.expect)(ok).toBe(true);
    });
    (0, vitest_1.it)("checks allowFrom against handle", function () {
        var ok = (0, targets_js_1.isAllowedIMessageSender)({
            allowFrom: ["user@example.com"],
            sender: "User@Example.com",
        });
        (0, vitest_1.expect)(ok).toBe(true);
    });
    (0, vitest_1.it)("formats chat targets", function () {
        (0, vitest_1.expect)((0, targets_js_1.formatIMessageChatTarget)(42)).toBe("chat_id:42");
        (0, vitest_1.expect)((0, targets_js_1.formatIMessageChatTarget)(undefined)).toBe("");
    });
});
