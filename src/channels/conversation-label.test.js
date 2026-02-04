"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var conversation_label_js_1 = require("./conversation-label.js");
(0, vitest_1.describe)("resolveConversationLabel", function () {
    (0, vitest_1.it)("prefers ConversationLabel when present", function () {
        var ctx = { ConversationLabel: "Pinned Label", ChatType: "group" };
        (0, vitest_1.expect)((0, conversation_label_js_1.resolveConversationLabel)(ctx)).toBe("Pinned Label");
    });
    (0, vitest_1.it)("uses SenderName for direct chats when available", function () {
        var ctx = { ChatType: "direct", SenderName: "Ada", From: "telegram:99" };
        (0, vitest_1.expect)((0, conversation_label_js_1.resolveConversationLabel)(ctx)).toBe("Ada");
    });
    (0, vitest_1.it)("derives Telegram-like group labels with numeric id suffix", function () {
        var ctx = { ChatType: "group", GroupSubject: "Ops", From: "telegram:group:42" };
        (0, vitest_1.expect)((0, conversation_label_js_1.resolveConversationLabel)(ctx)).toBe("Ops id:42");
    });
    (0, vitest_1.it)("does not append ids for #rooms/channels", function () {
        var ctx = {
            ChatType: "channel",
            GroupSubject: "#general",
            From: "slack:channel:C123",
        };
        (0, vitest_1.expect)((0, conversation_label_js_1.resolveConversationLabel)(ctx)).toBe("#general");
    });
    (0, vitest_1.it)("appends ids for WhatsApp-like group ids when a subject exists", function () {
        var ctx = {
            ChatType: "group",
            GroupSubject: "Family",
            From: "whatsapp:group:123@g.us",
        };
        (0, vitest_1.expect)((0, conversation_label_js_1.resolveConversationLabel)(ctx)).toBe("Family id:123@g.us");
    });
});
