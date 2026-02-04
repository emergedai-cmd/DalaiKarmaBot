"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var chat_type_js_1 = require("./chat-type.js");
(0, vitest_1.describe)("normalizeChatType", function () {
    (0, vitest_1.it)("normalizes common inputs", function () {
        (0, vitest_1.expect)((0, chat_type_js_1.normalizeChatType)("direct")).toBe("direct");
        (0, vitest_1.expect)((0, chat_type_js_1.normalizeChatType)("dm")).toBe("direct");
        (0, vitest_1.expect)((0, chat_type_js_1.normalizeChatType)("group")).toBe("group");
        (0, vitest_1.expect)((0, chat_type_js_1.normalizeChatType)("channel")).toBe("channel");
    });
    (0, vitest_1.it)("returns undefined for empty/unknown values", function () {
        (0, vitest_1.expect)((0, chat_type_js_1.normalizeChatType)(undefined)).toBeUndefined();
        (0, vitest_1.expect)((0, chat_type_js_1.normalizeChatType)("")).toBeUndefined();
        (0, vitest_1.expect)((0, chat_type_js_1.normalizeChatType)("nope")).toBeUndefined();
        (0, vitest_1.expect)((0, chat_type_js_1.normalizeChatType)("room")).toBeUndefined();
    });
});
