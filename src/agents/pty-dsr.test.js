"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pty_dsr_js_1 = require("./pty-dsr.js");
(0, vitest_1.test)("stripDsrRequests removes cursor queries and counts them", function () {
    var input = "hi\x1b[6nthere\x1b[?6n";
    var _a = (0, pty_dsr_js_1.stripDsrRequests)(input), cleaned = _a.cleaned, requests = _a.requests;
    (0, vitest_1.expect)(cleaned).toBe("hithere");
    (0, vitest_1.expect)(requests).toBe(2);
});
(0, vitest_1.test)("buildCursorPositionResponse returns CPR sequence", function () {
    (0, vitest_1.expect)((0, pty_dsr_js_1.buildCursorPositionResponse)()).toBe("\x1b[1;1R");
    (0, vitest_1.expect)((0, pty_dsr_js_1.buildCursorPositionResponse)(12, 34)).toBe("\x1b[12;34R");
});
