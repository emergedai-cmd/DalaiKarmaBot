"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var scope_js_1 = require("./scope.js");
(0, vitest_1.describe)("media understanding scope", function () {
    (0, vitest_1.it)("normalizes chatType", function () {
        (0, vitest_1.expect)((0, scope_js_1.normalizeMediaUnderstandingChatType)("channel")).toBe("channel");
        (0, vitest_1.expect)((0, scope_js_1.normalizeMediaUnderstandingChatType)("dm")).toBe("direct");
        (0, vitest_1.expect)((0, scope_js_1.normalizeMediaUnderstandingChatType)("room")).toBeUndefined();
    });
    (0, vitest_1.it)("matches channel chatType explicitly", function () {
        var scope = {
            rules: [{ action: "deny", match: { chatType: "channel" } }],
        };
        (0, vitest_1.expect)((0, scope_js_1.resolveMediaUnderstandingScope)({ scope: scope, chatType: "channel" })).toBe("deny");
    });
});
