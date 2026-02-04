"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var voicewake_js_1 = require("../infra/voicewake.js");
var server_utils_js_1 = require("./server-utils.js");
(0, vitest_1.describe)("normalizeVoiceWakeTriggers", function () {
    (0, vitest_1.test)("returns defaults when input is empty", function () {
        (0, vitest_1.expect)((0, server_utils_js_1.normalizeVoiceWakeTriggers)([])).toEqual((0, voicewake_js_1.defaultVoiceWakeTriggers)());
        (0, vitest_1.expect)((0, server_utils_js_1.normalizeVoiceWakeTriggers)(null)).toEqual((0, voicewake_js_1.defaultVoiceWakeTriggers)());
    });
    (0, vitest_1.test)("trims and limits entries", function () {
        var result = (0, server_utils_js_1.normalizeVoiceWakeTriggers)(["  hello  ", "", "world"]);
        (0, vitest_1.expect)(result).toEqual(["hello", "world"]);
    });
});
(0, vitest_1.describe)("formatError", function () {
    (0, vitest_1.test)("prefers message for Error", function () {
        (0, vitest_1.expect)((0, server_utils_js_1.formatError)(new Error("boom"))).toBe("boom");
    });
    (0, vitest_1.test)("handles status/code", function () {
        (0, vitest_1.expect)((0, server_utils_js_1.formatError)({ status: 500, code: "EPIPE" })).toBe("status=500 code=EPIPE");
        (0, vitest_1.expect)((0, server_utils_js_1.formatError)({ status: 404 })).toBe("status=404 code=unknown");
        (0, vitest_1.expect)((0, server_utils_js_1.formatError)({ code: "ENOENT" })).toBe("status=unknown code=ENOENT");
    });
});
