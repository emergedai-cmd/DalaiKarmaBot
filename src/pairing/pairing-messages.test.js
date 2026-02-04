"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pairing_messages_js_1 = require("./pairing-messages.js");
(0, vitest_1.describe)("buildPairingReply", function () {
    var previousProfile;
    (0, vitest_1.beforeEach)(function () {
        previousProfile = process.env.OPENCLAW_PROFILE;
        process.env.OPENCLAW_PROFILE = "isolated";
    });
    (0, vitest_1.afterEach)(function () {
        if (previousProfile === undefined) {
            delete process.env.OPENCLAW_PROFILE;
            return;
        }
        process.env.OPENCLAW_PROFILE = previousProfile;
    });
    var cases = [
        {
            channel: "discord",
            idLine: "Your Discord user id: 1",
            code: "ABC123",
        },
        {
            channel: "slack",
            idLine: "Your Slack user id: U1",
            code: "DEF456",
        },
        {
            channel: "signal",
            idLine: "Your Signal number: +15550001111",
            code: "GHI789",
        },
        {
            channel: "imessage",
            idLine: "Your iMessage sender id: +15550002222",
            code: "JKL012",
        },
        {
            channel: "whatsapp",
            idLine: "Your WhatsApp phone number: +15550003333",
            code: "MNO345",
        },
    ];
    var _loop_1 = function (testCase) {
        (0, vitest_1.it)("formats pairing reply for ".concat(testCase.channel), function () {
            var text = (0, pairing_messages_js_1.buildPairingReply)(testCase);
            (0, vitest_1.expect)(text).toContain(testCase.idLine);
            (0, vitest_1.expect)(text).toContain("Pairing code: ".concat(testCase.code));
            // CLI commands should respect OPENCLAW_PROFILE when set (most tests run with isolated profile)
            var commandRe = new RegExp("(?:openclaw|openclaw) --profile isolated pairing approve ".concat(testCase.channel, " <code>"));
            (0, vitest_1.expect)(text).toMatch(commandRe);
        });
    };
    for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
        var testCase = cases_1[_i];
        _loop_1(testCase);
    }
});
