"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var targets_js_1 = require("./targets.js");
(0, vitest_1.describe)("normalizeGoogleChatTarget", function () {
    (0, vitest_1.it)("normalizes provider prefixes", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeGoogleChatTarget)("googlechat:users/123")).toBe("users/123");
        (0, vitest_1.expect)((0, targets_js_1.normalizeGoogleChatTarget)("google-chat:spaces/AAA")).toBe("spaces/AAA");
        (0, vitest_1.expect)((0, targets_js_1.normalizeGoogleChatTarget)("gchat:user:User@Example.com")).toBe("users/user@example.com");
    });
    (0, vitest_1.it)("normalizes email targets to users/<email>", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeGoogleChatTarget)("User@Example.com")).toBe("users/user@example.com");
        (0, vitest_1.expect)((0, targets_js_1.normalizeGoogleChatTarget)("users/User@Example.com")).toBe("users/user@example.com");
    });
    (0, vitest_1.it)("preserves space targets", function () {
        (0, vitest_1.expect)((0, targets_js_1.normalizeGoogleChatTarget)("space:spaces/BBB")).toBe("spaces/BBB");
        (0, vitest_1.expect)((0, targets_js_1.normalizeGoogleChatTarget)("spaces/CCC")).toBe("spaces/CCC");
    });
});
(0, vitest_1.describe)("target helpers", function () {
    (0, vitest_1.it)("detects user and space targets", function () {
        (0, vitest_1.expect)((0, targets_js_1.isGoogleChatUserTarget)("users/abc")).toBe(true);
        (0, vitest_1.expect)((0, targets_js_1.isGoogleChatSpaceTarget)("spaces/abc")).toBe(true);
        (0, vitest_1.expect)((0, targets_js_1.isGoogleChatUserTarget)("spaces/abc")).toBe(false);
    });
});
