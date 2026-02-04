"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tui_waiting_js_1 = require("./tui-waiting.js");
var theme = {
    dim: function (s) { return "<d>".concat(s, "</d>"); },
    bold: function (s) { return "<b>".concat(s, "</b>"); },
    accentSoft: function (s) { return "<a>".concat(s, "</a>"); },
    // oxlint-disable-next-line typescript/no-explicit-any
};
(0, vitest_1.describe)("tui-waiting", function () {
    (0, vitest_1.it)("pickWaitingPhrase rotates every 10 ticks", function () {
        var phrases = ["a", "b", "c"];
        (0, vitest_1.expect)((0, tui_waiting_js_1.pickWaitingPhrase)(0, phrases)).toBe("a");
        (0, vitest_1.expect)((0, tui_waiting_js_1.pickWaitingPhrase)(9, phrases)).toBe("a");
        (0, vitest_1.expect)((0, tui_waiting_js_1.pickWaitingPhrase)(10, phrases)).toBe("b");
        (0, vitest_1.expect)((0, tui_waiting_js_1.pickWaitingPhrase)(20, phrases)).toBe("c");
        (0, vitest_1.expect)((0, tui_waiting_js_1.pickWaitingPhrase)(30, phrases)).toBe("a");
    });
    (0, vitest_1.it)("buildWaitingStatusMessage includes shimmer markup and metadata", function () {
        var msg = (0, tui_waiting_js_1.buildWaitingStatusMessage)({
            theme: theme,
            tick: 1,
            elapsed: "3s",
            connectionStatus: "connected",
            phrases: ["hello"],
        });
        (0, vitest_1.expect)(msg).toContain("connected");
        (0, vitest_1.expect)(msg).toContain("3s");
        // text is wrapped per-char; check it appears in order
        (0, vitest_1.expect)(msg).toContain("h");
        (0, vitest_1.expect)(msg).toContain("e");
        (0, vitest_1.expect)(msg).toContain("l");
        (0, vitest_1.expect)(msg).toContain("o");
        // shimmer should contain both highlighted and dim parts
        (0, vitest_1.expect)(msg).toContain("<b><a>");
        (0, vitest_1.expect)(msg).toContain("<d>");
    });
});
