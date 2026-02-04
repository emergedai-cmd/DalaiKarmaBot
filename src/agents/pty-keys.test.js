"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pty_keys_js_1 = require("./pty-keys.js");
(0, vitest_1.test)("encodeKeySequence maps common keys and modifiers", function () {
    var enter = (0, pty_keys_js_1.encodeKeySequence)({ keys: ["Enter"] });
    (0, vitest_1.expect)(enter.data).toBe("\r");
    var ctrlC = (0, pty_keys_js_1.encodeKeySequence)({ keys: ["C-c"] });
    (0, vitest_1.expect)(ctrlC.data).toBe("\x03");
    var altX = (0, pty_keys_js_1.encodeKeySequence)({ keys: ["M-x"] });
    (0, vitest_1.expect)(altX.data).toBe("\x1bx");
    var shiftTab = (0, pty_keys_js_1.encodeKeySequence)({ keys: ["S-Tab"] });
    (0, vitest_1.expect)(shiftTab.data).toBe("\x1b[Z");
    var kpEnter = (0, pty_keys_js_1.encodeKeySequence)({ keys: ["KPEnter"] });
    (0, vitest_1.expect)(kpEnter.data).toBe("\x1bOM");
});
(0, vitest_1.test)("encodeKeySequence supports hex + literal with warnings", function () {
    var result = (0, pty_keys_js_1.encodeKeySequence)({
        literal: "hi",
        hex: ["0d", "0x0a", "zz"],
        keys: ["Enter"],
    });
    (0, vitest_1.expect)(result.data).toBe("hi\r\n\r");
    (0, vitest_1.expect)(result.warnings.length).toBe(1);
});
(0, vitest_1.test)("encodePaste wraps bracketed sequences by default", function () {
    var payload = (0, pty_keys_js_1.encodePaste)("line1\nline2\n");
    (0, vitest_1.expect)(payload.startsWith(pty_keys_js_1.BRACKETED_PASTE_START)).toBe(true);
    (0, vitest_1.expect)(payload.endsWith(pty_keys_js_1.BRACKETED_PASTE_END)).toBe(true);
});
