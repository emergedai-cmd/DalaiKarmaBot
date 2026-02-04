"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var probe_js_1 = require("./probe.js");
(0, vitest_1.describe)("resolveDiscordPrivilegedIntentsFromFlags", function () {
    (0, vitest_1.it)("reports disabled when no bits set", function () {
        (0, vitest_1.expect)((0, probe_js_1.resolveDiscordPrivilegedIntentsFromFlags)(0)).toEqual({
            presence: "disabled",
            guildMembers: "disabled",
            messageContent: "disabled",
        });
    });
    (0, vitest_1.it)("reports enabled when full intent bits set", function () {
        var flags = (1 << 12) | (1 << 14) | (1 << 18);
        (0, vitest_1.expect)((0, probe_js_1.resolveDiscordPrivilegedIntentsFromFlags)(flags)).toEqual({
            presence: "enabled",
            guildMembers: "enabled",
            messageContent: "enabled",
        });
    });
    (0, vitest_1.it)("reports limited when limited intent bits set", function () {
        var flags = (1 << 13) | (1 << 15) | (1 << 19);
        (0, vitest_1.expect)((0, probe_js_1.resolveDiscordPrivilegedIntentsFromFlags)(flags)).toEqual({
            presence: "limited",
            guildMembers: "limited",
            messageContent: "limited",
        });
    });
    (0, vitest_1.it)("prefers enabled over limited when both set", function () {
        var flags = (1 << 12) | (1 << 13) | (1 << 14) | (1 << 15) | (1 << 18) | (1 << 19);
        (0, vitest_1.expect)((0, probe_js_1.resolveDiscordPrivilegedIntentsFromFlags)(flags)).toEqual({
            presence: "enabled",
            guildMembers: "enabled",
            messageContent: "enabled",
        });
    });
});
