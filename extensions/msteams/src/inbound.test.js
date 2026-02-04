"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var inbound_js_1 = require("./inbound.js");
(0, vitest_1.describe)("msteams inbound", function () {
    (0, vitest_1.describe)("stripMSTeamsMentionTags", function () {
        (0, vitest_1.it)("removes <at>...</at> tags and trims", function () {
            (0, vitest_1.expect)((0, inbound_js_1.stripMSTeamsMentionTags)("<at>Bot</at> hi")).toBe("hi");
            (0, vitest_1.expect)((0, inbound_js_1.stripMSTeamsMentionTags)("hi <at>Bot</at>")).toBe("hi");
        });
        (0, vitest_1.it)("removes <at ...> tags with attributes", function () {
            (0, vitest_1.expect)((0, inbound_js_1.stripMSTeamsMentionTags)('<at id="1">Bot</at> hi')).toBe("hi");
            (0, vitest_1.expect)((0, inbound_js_1.stripMSTeamsMentionTags)('hi <at itemid="2">Bot</at>')).toBe("hi");
        });
    });
    (0, vitest_1.describe)("normalizeMSTeamsConversationId", function () {
        (0, vitest_1.it)("strips the ;messageid suffix", function () {
            (0, vitest_1.expect)((0, inbound_js_1.normalizeMSTeamsConversationId)("19:abc@thread.tacv2;messageid=deadbeef")).toBe("19:abc@thread.tacv2");
        });
    });
    (0, vitest_1.describe)("parseMSTeamsActivityTimestamp", function () {
        (0, vitest_1.it)("returns undefined for empty/invalid values", function () {
            (0, vitest_1.expect)((0, inbound_js_1.parseMSTeamsActivityTimestamp)(undefined)).toBeUndefined();
            (0, vitest_1.expect)((0, inbound_js_1.parseMSTeamsActivityTimestamp)("not-a-date")).toBeUndefined();
        });
        (0, vitest_1.it)("parses string timestamps", function () {
            var ts = (0, inbound_js_1.parseMSTeamsActivityTimestamp)("2024-01-01T00:00:00.000Z");
            (0, vitest_1.expect)(ts === null || ts === void 0 ? void 0 : ts.toISOString()).toBe("2024-01-01T00:00:00.000Z");
        });
        (0, vitest_1.it)("passes through Date instances", function () {
            var d = new Date("2024-01-01T00:00:00.000Z");
            (0, vitest_1.expect)((0, inbound_js_1.parseMSTeamsActivityTimestamp)(d)).toBe(d);
        });
    });
    (0, vitest_1.describe)("wasMSTeamsBotMentioned", function () {
        (0, vitest_1.it)("returns true when a mention entity matches recipient.id", function () {
            (0, vitest_1.expect)((0, inbound_js_1.wasMSTeamsBotMentioned)({
                recipient: { id: "bot" },
                entities: [{ type: "mention", mentioned: { id: "bot" } }],
            })).toBe(true);
        });
        (0, vitest_1.it)("returns false when there is no matching mention", function () {
            (0, vitest_1.expect)((0, inbound_js_1.wasMSTeamsBotMentioned)({
                recipient: { id: "bot" },
                entities: [{ type: "mention", mentioned: { id: "other" } }],
            })).toBe(false);
        });
    });
});
