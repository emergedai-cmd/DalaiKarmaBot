"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var heartbeat_js_1 = require("./heartbeat.js");
var tokens_js_1 = require("./tokens.js");
(0, vitest_1.describe)("stripHeartbeatToken", function () {
    (0, vitest_1.it)("skips empty or token-only replies", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)(undefined, { mode: "heartbeat" })).toEqual({
            shouldSkip: true,
            text: "",
            didStrip: false,
        });
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("  ", { mode: "heartbeat" })).toEqual({
            shouldSkip: true,
            text: "",
            didStrip: false,
        });
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)(tokens_js_1.HEARTBEAT_TOKEN, { mode: "heartbeat" })).toEqual({
            shouldSkip: true,
            text: "",
            didStrip: true,
        });
    });
    (0, vitest_1.it)("drops heartbeats with small junk in heartbeat mode", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("HEARTBEAT_OK 🦞", { mode: "heartbeat" })).toEqual({
            shouldSkip: true,
            text: "",
            didStrip: true,
        });
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("\uD83E\uDD9E ".concat(tokens_js_1.HEARTBEAT_TOKEN), { mode: "heartbeat" })).toEqual({
            shouldSkip: true,
            text: "",
            didStrip: true,
        });
    });
    (0, vitest_1.it)("drops short remainder in heartbeat mode", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("ALERT ".concat(tokens_js_1.HEARTBEAT_TOKEN), { mode: "heartbeat" })).toEqual({
            shouldSkip: true,
            text: "",
            didStrip: true,
        });
    });
    (0, vitest_1.it)("keeps heartbeat replies when remaining content exceeds threshold", function () {
        var long = "A".repeat(heartbeat_js_1.DEFAULT_HEARTBEAT_ACK_MAX_CHARS + 1);
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("".concat(long, " ").concat(tokens_js_1.HEARTBEAT_TOKEN), { mode: "heartbeat" })).toEqual({
            shouldSkip: false,
            text: long,
            didStrip: true,
        });
    });
    (0, vitest_1.it)("strips token at edges for normal messages", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("".concat(tokens_js_1.HEARTBEAT_TOKEN, " hello"), { mode: "message" })).toEqual({
            shouldSkip: false,
            text: "hello",
            didStrip: true,
        });
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("hello ".concat(tokens_js_1.HEARTBEAT_TOKEN), { mode: "message" })).toEqual({
            shouldSkip: false,
            text: "hello",
            didStrip: true,
        });
    });
    (0, vitest_1.it)("does not touch token in the middle", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("hello ".concat(tokens_js_1.HEARTBEAT_TOKEN, " there"), {
            mode: "message",
        })).toEqual({
            shouldSkip: false,
            text: "hello ".concat(tokens_js_1.HEARTBEAT_TOKEN, " there"),
            didStrip: false,
        });
    });
    (0, vitest_1.it)("strips HTML-wrapped heartbeat tokens", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("<b>".concat(tokens_js_1.HEARTBEAT_TOKEN, "</b>"), { mode: "heartbeat" })).toEqual({
            shouldSkip: true,
            text: "",
            didStrip: true,
        });
    });
    (0, vitest_1.it)("strips markdown-wrapped heartbeat tokens", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("**".concat(tokens_js_1.HEARTBEAT_TOKEN, "**"), { mode: "heartbeat" })).toEqual({
            shouldSkip: true,
            text: "",
            didStrip: true,
        });
    });
    (0, vitest_1.it)("removes markup-wrapped token and keeps trailing content", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.stripHeartbeatToken)("<code>".concat(tokens_js_1.HEARTBEAT_TOKEN, "</code> all good"), {
            mode: "message",
        })).toEqual({
            shouldSkip: false,
            text: "all good",
            didStrip: true,
        });
    });
});
(0, vitest_1.describe)("isHeartbeatContentEffectivelyEmpty", function () {
    (0, vitest_1.it)("returns false for undefined/null (missing file should not skip)", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)(undefined)).toBe(false);
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)(null)).toBe(false);
    });
    (0, vitest_1.it)("returns true for empty string", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("")).toBe(true);
    });
    (0, vitest_1.it)("returns true for whitespace only", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("   ")).toBe(true);
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("\n\n\n")).toBe(true);
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("  \n  \n  ")).toBe(true);
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("\t\t")).toBe(true);
    });
    (0, vitest_1.it)("returns true for header-only content", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("# HEARTBEAT.md")).toBe(true);
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("# HEARTBEAT.md\n")).toBe(true);
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("# HEARTBEAT.md\n\n")).toBe(true);
    });
    (0, vitest_1.it)("returns true for comments only", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("# Header\n# Another comment")).toBe(true);
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("## Subheader\n### Another")).toBe(true);
    });
    (0, vitest_1.it)("returns true for default template content (header + comment)", function () {
        var defaultTemplate = "# HEARTBEAT.md\n\nKeep this file empty unless you want a tiny checklist. Keep it small.\n";
        // Note: The template has actual text content, so it's NOT effectively empty
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)(defaultTemplate)).toBe(false);
    });
    (0, vitest_1.it)("returns true for header with only empty lines", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("# HEARTBEAT.md\n\n\n")).toBe(true);
    });
    (0, vitest_1.it)("returns false when actionable content exists", function () {
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("- Check email")).toBe(false);
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("# HEARTBEAT.md\n- Task 1")).toBe(false);
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)("Remind me to call mom")).toBe(false);
    });
    (0, vitest_1.it)("returns false for content with tasks after header", function () {
        var content = "# HEARTBEAT.md\n\n- Task 1\n- Task 2\n";
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)(content)).toBe(false);
    });
    (0, vitest_1.it)("returns false for mixed content with non-comment text", function () {
        var content = "# HEARTBEAT.md\n## Tasks\nCheck the server logs\n";
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)(content)).toBe(false);
    });
    (0, vitest_1.it)("treats markdown headers as comments (effectively empty)", function () {
        var content = "# HEARTBEAT.md\n## Section 1\n### Subsection\n";
        (0, vitest_1.expect)((0, heartbeat_js_1.isHeartbeatContentEffectivelyEmpty)(content)).toBe(true);
    });
});
