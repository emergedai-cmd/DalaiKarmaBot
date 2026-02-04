"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sender_identity_js_1 = require("./sender-identity.js");
(0, vitest_1.describe)("validateSenderIdentity", function () {
    (0, vitest_1.it)("allows direct messages without sender fields", function () {
        var ctx = { ChatType: "direct" };
        (0, vitest_1.expect)((0, sender_identity_js_1.validateSenderIdentity)(ctx)).toEqual([]);
    });
    (0, vitest_1.it)("requires some sender identity for non-direct chats", function () {
        var ctx = { ChatType: "group" };
        (0, vitest_1.expect)((0, sender_identity_js_1.validateSenderIdentity)(ctx)).toContain("missing sender identity (SenderId/SenderName/SenderUsername/SenderE164)");
    });
    (0, vitest_1.it)("validates SenderE164 and SenderUsername shape", function () {
        var ctx = {
            ChatType: "group",
            SenderE164: "123",
            SenderUsername: "@ada lovelace",
        };
        (0, vitest_1.expect)((0, sender_identity_js_1.validateSenderIdentity)(ctx)).toEqual([
            "invalid SenderE164: 123",
            'SenderUsername should not include "@": @ada lovelace',
            "SenderUsername should not include whitespace: @ada lovelace",
        ]);
    });
});
