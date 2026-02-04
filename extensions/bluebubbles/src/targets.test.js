"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var targets_js_1 = require("./targets.js");
(0, vitest_1.describe)("normalizeBlueBubblesMessagingTarget", function () {
    (0, vitest_1.it)("normalizes chat_guid targets", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("chat_guid:ABC-123")).toBe("chat_guid:ABC-123");
    });
    (0, vitest_1.it)("normalizes group numeric targets to chat_id", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("group:123")).toBe("chat_id:123");
    });
    (0, vitest_1.it)("strips provider prefix and normalizes handles", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("bluebubbles:imessage:User@Example.com")).toBe("imessage:user@example.com");
    });
    (0, vitest_1.it)("extracts handle from DM chat_guid for cross-context matching", function () {
        // DM format: service;-;handle
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("chat_guid:iMessage;-;+19257864429")).toBe("+19257864429");
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("chat_guid:SMS;-;+15551234567")).toBe("+15551234567");
        // Email handles
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("chat_guid:iMessage;-;user@example.com")).toBe("user@example.com");
    });
    (0, vitest_1.it)("preserves group chat_guid format", function () {
        // Group format: service;+;groupId
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("chat_guid:iMessage;+;chat123456789")).toBe("chat_guid:iMessage;+;chat123456789");
    });
    (0, vitest_1.it)("normalizes raw chat_guid values", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("iMessage;+;chat660250192681427962")).toBe("chat_guid:iMessage;+;chat660250192681427962");
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("iMessage;-;+19257864429")).toBe("+19257864429");
    });
    (0, vitest_1.it)("normalizes chat<digits> pattern to chat_identifier format", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("chat660250192681427962")).toBe("chat_identifier:chat660250192681427962");
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("chat123")).toBe("chat_identifier:chat123");
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("Chat456789")).toBe("chat_identifier:Chat456789");
    });
    (0, vitest_1.it)("normalizes UUID/hex chat identifiers", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("8b9c1a10536d4d86a336ea03ab7151cc")).toBe("chat_identifier:8b9c1a10536d4d86a336ea03ab7151cc");
        (0, vitest_1.expect)((0, targets_js_1.normalizeBlueBubblesMessagingTarget)("1C2D3E4F-1234-5678-9ABC-DEF012345678")).toBe("chat_identifier:1C2D3E4F-1234-5678-9ABC-DEF012345678");
    });
});
(0, vitest_1.describe)("looksLikeBlueBubblesTargetId", function () {
    (0, vitest_1.it)("accepts chat targets", function () {
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("chat_guid:ABC-123")).toBe(true);
    });
    (0, vitest_1.it)("accepts email handles", function () {
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("user@example.com")).toBe(true);
    });
    (0, vitest_1.it)("accepts phone numbers with punctuation", function () {
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("+1 (555) 123-4567")).toBe(true);
    });
    (0, vitest_1.it)("accepts raw chat_guid values", function () {
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("iMessage;+;chat660250192681427962")).toBe(true);
    });
    (0, vitest_1.it)("accepts chat<digits> pattern as chat_id", function () {
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("chat660250192681427962")).toBe(true);
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("chat123")).toBe(true);
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("Chat456789")).toBe(true);
    });
    (0, vitest_1.it)("accepts UUID/hex chat identifiers", function () {
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("8b9c1a10536d4d86a336ea03ab7151cc")).toBe(true);
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("1C2D3E4F-1234-5678-9ABC-DEF012345678")).toBe(true);
    });
    (0, vitest_1.it)("rejects display names", function () {
        (0, vitest_1.expect)((0, targets_js_1.looksLikeBlueBubblesTargetId)("Jane Doe")).toBe(false);
    });
});
(0, vitest_1.describe)("parseBlueBubblesTarget", function () {
    (0, vitest_1.it)("parses chat<digits> pattern as chat_identifier", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesTarget)("chat660250192681427962")).toEqual({
            kind: "chat_identifier",
            chatIdentifier: "chat660250192681427962",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesTarget)("chat123")).toEqual({
            kind: "chat_identifier",
            chatIdentifier: "chat123",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesTarget)("Chat456789")).toEqual({
            kind: "chat_identifier",
            chatIdentifier: "Chat456789",
        });
    });
    (0, vitest_1.it)("parses UUID/hex chat identifiers as chat_identifier", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesTarget)("8b9c1a10536d4d86a336ea03ab7151cc")).toEqual({
            kind: "chat_identifier",
            chatIdentifier: "8b9c1a10536d4d86a336ea03ab7151cc",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesTarget)("1C2D3E4F-1234-5678-9ABC-DEF012345678")).toEqual({
            kind: "chat_identifier",
            chatIdentifier: "1C2D3E4F-1234-5678-9ABC-DEF012345678",
        });
    });
    (0, vitest_1.it)("parses explicit chat_id: prefix", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesTarget)("chat_id:123")).toEqual({ kind: "chat_id", chatId: 123 });
    });
    (0, vitest_1.it)("parses phone numbers as handles", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesTarget)("+19257864429")).toEqual({
            kind: "handle",
            to: "+19257864429",
            service: "auto",
        });
    });
    (0, vitest_1.it)("parses raw chat_guid format", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesTarget)("iMessage;+;chat660250192681427962")).toEqual({
            kind: "chat_guid",
            chatGuid: "iMessage;+;chat660250192681427962",
        });
    });
});
(0, vitest_1.describe)("parseBlueBubblesAllowTarget", function () {
    (0, vitest_1.it)("parses chat<digits> pattern as chat_identifier", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesAllowTarget)("chat660250192681427962")).toEqual({
            kind: "chat_identifier",
            chatIdentifier: "chat660250192681427962",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesAllowTarget)("chat123")).toEqual({
            kind: "chat_identifier",
            chatIdentifier: "chat123",
        });
    });
    (0, vitest_1.it)("parses UUID/hex chat identifiers as chat_identifier", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesAllowTarget)("8b9c1a10536d4d86a336ea03ab7151cc")).toEqual({
            kind: "chat_identifier",
            chatIdentifier: "8b9c1a10536d4d86a336ea03ab7151cc",
        });
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesAllowTarget)("1C2D3E4F-1234-5678-9ABC-DEF012345678")).toEqual({
            kind: "chat_identifier",
            chatIdentifier: "1C2D3E4F-1234-5678-9ABC-DEF012345678",
        });
    });
    (0, vitest_1.it)("parses explicit chat_id: prefix", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesAllowTarget)("chat_id:456")).toEqual({ kind: "chat_id", chatId: 456 });
    });
    (0, vitest_1.it)("parses phone numbers as handles", function () {
        (0, vitest_1.expect)((0, targets_js_1.parseBlueBubblesAllowTarget)("+19257864429")).toEqual({
            kind: "handle",
            handle: "+19257864429",
        });
    });
});
