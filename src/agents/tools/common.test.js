"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var common_js_1 = require("./common.js");
(0, vitest_1.describe)("createActionGate", function () {
    (0, vitest_1.it)("defaults to enabled when unset", function () {
        var gate = (0, common_js_1.createActionGate)(undefined);
        (0, vitest_1.expect)(gate("reactions")).toBe(true);
        (0, vitest_1.expect)(gate("messages", false)).toBe(false);
    });
    (0, vitest_1.it)("respects explicit false", function () {
        var gate = (0, common_js_1.createActionGate)({ reactions: false });
        (0, vitest_1.expect)(gate("reactions")).toBe(false);
        (0, vitest_1.expect)(gate("messages")).toBe(true);
    });
});
(0, vitest_1.describe)("readStringOrNumberParam", function () {
    (0, vitest_1.it)("returns numeric strings for numbers", function () {
        var params = { chatId: 123 };
        (0, vitest_1.expect)((0, common_js_1.readStringOrNumberParam)(params, "chatId")).toBe("123");
    });
    (0, vitest_1.it)("trims strings", function () {
        var params = { chatId: "  abc  " };
        (0, vitest_1.expect)((0, common_js_1.readStringOrNumberParam)(params, "chatId")).toBe("abc");
    });
    (0, vitest_1.it)("throws when required and missing", function () {
        (0, vitest_1.expect)(function () { return (0, common_js_1.readStringOrNumberParam)({}, "chatId", { required: true }); }).toThrow(/chatId required/);
    });
});
(0, vitest_1.describe)("readNumberParam", function () {
    (0, vitest_1.it)("parses numeric strings", function () {
        var params = { messageId: "42" };
        (0, vitest_1.expect)((0, common_js_1.readNumberParam)(params, "messageId")).toBe(42);
    });
    (0, vitest_1.it)("truncates when integer is true", function () {
        var params = { messageId: "42.9" };
        (0, vitest_1.expect)((0, common_js_1.readNumberParam)(params, "messageId", { integer: true })).toBe(42);
    });
    (0, vitest_1.it)("throws when required and missing", function () {
        (0, vitest_1.expect)(function () { return (0, common_js_1.readNumberParam)({}, "messageId", { required: true }); }).toThrow(/messageId required/);
    });
});
(0, vitest_1.describe)("readReactionParams", function () {
    (0, vitest_1.it)("allows empty emoji for removal semantics", function () {
        var params = { emoji: "" };
        var result = (0, common_js_1.readReactionParams)(params, {
            removeErrorMessage: "Emoji is required",
        });
        (0, vitest_1.expect)(result.isEmpty).toBe(true);
        (0, vitest_1.expect)(result.remove).toBe(false);
    });
    (0, vitest_1.it)("throws when remove true but emoji empty", function () {
        var params = { emoji: "", remove: true };
        (0, vitest_1.expect)(function () {
            return (0, common_js_1.readReactionParams)(params, {
                removeErrorMessage: "Emoji is required",
            });
        }).toThrow(/Emoji is required/);
    });
    (0, vitest_1.it)("passes through remove flag", function () {
        var params = { emoji: "✅", remove: true };
        var result = (0, common_js_1.readReactionParams)(params, {
            removeErrorMessage: "Emoji is required",
        });
        (0, vitest_1.expect)(result.remove).toBe(true);
        (0, vitest_1.expect)(result.emoji).toBe("✅");
    });
});
