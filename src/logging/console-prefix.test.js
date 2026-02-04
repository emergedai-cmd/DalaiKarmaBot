"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var logging_js_1 = require("../logging.js");
(0, vitest_1.describe)("stripRedundantSubsystemPrefixForConsole", function () {
    (0, vitest_1.it)("drops '<subsystem>:' prefix", function () {
        (0, vitest_1.expect)((0, logging_js_1.stripRedundantSubsystemPrefixForConsole)("discord: hello", "discord")).toBe("hello");
    });
    (0, vitest_1.it)("drops '<Subsystem>:' prefix case-insensitively", function () {
        (0, vitest_1.expect)((0, logging_js_1.stripRedundantSubsystemPrefixForConsole)("WhatsApp: hello", "whatsapp")).toBe("hello");
    });
    (0, vitest_1.it)("drops '<subsystem> ' prefix", function () {
        (0, vitest_1.expect)((0, logging_js_1.stripRedundantSubsystemPrefixForConsole)("discord gateway: closed", "discord")).toBe("gateway: closed");
    });
    (0, vitest_1.it)("drops '[subsystem]' prefix", function () {
        (0, vitest_1.expect)((0, logging_js_1.stripRedundantSubsystemPrefixForConsole)("[discord] connection stalled", "discord")).toBe("connection stalled");
    });
    (0, vitest_1.it)("keeps messages that do not start with the subsystem", function () {
        (0, vitest_1.expect)((0, logging_js_1.stripRedundantSubsystemPrefixForConsole)("discordant: hello", "discord")).toBe("discordant: hello");
    });
});
