"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var targets_js_1 = require("./targets.js");
(0, vitest_1.describe)("ensureTargetId", function () {
    (0, vitest_1.it)("returns the candidate when it matches", function () {
        (0, vitest_1.expect)((0, targets_js_1.ensureTargetId)({
            candidate: "U123",
            pattern: /^[A-Z0-9]+$/i,
            errorMessage: "bad",
        })).toBe("U123");
    });
    (0, vitest_1.it)("throws with the provided message on mismatch", function () {
        (0, vitest_1.expect)(function () {
            return (0, targets_js_1.ensureTargetId)({
                candidate: "not-ok",
                pattern: /^[A-Z0-9]+$/i,
                errorMessage: "Bad target",
            });
        }).toThrow(/Bad target/);
    });
});
(0, vitest_1.describe)("requireTargetKind", function () {
    (0, vitest_1.it)("returns the target id when the kind matches", function () {
        var target = (0, targets_js_1.buildMessagingTarget)("channel", "C123", "C123");
        (0, vitest_1.expect)((0, targets_js_1.requireTargetKind)({ platform: "Slack", target: target, kind: "channel" })).toBe("C123");
    });
    (0, vitest_1.it)("throws when the kind is missing or mismatched", function () {
        (0, vitest_1.expect)(function () {
            return (0, targets_js_1.requireTargetKind)({ platform: "Slack", target: undefined, kind: "channel" });
        }).toThrow(/Slack channel id is required/);
        var target = (0, targets_js_1.buildMessagingTarget)("user", "U123", "U123");
        (0, vitest_1.expect)(function () { return (0, targets_js_1.requireTargetKind)({ platform: "Slack", target: target, kind: "channel" }); }).toThrow(/Slack channel id is required/);
    });
});
