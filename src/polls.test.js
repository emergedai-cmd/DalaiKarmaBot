"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var polls_js_1 = require("./polls.js");
(0, vitest_1.describe)("polls", function () {
    (0, vitest_1.it)("normalizes question/options and validates maxSelections", function () {
        (0, vitest_1.expect)((0, polls_js_1.normalizePollInput)({
            question: "  Lunch? ",
            options: [" Pizza ", " ", "Sushi"],
            maxSelections: 2,
        })).toEqual({
            question: "Lunch?",
            options: ["Pizza", "Sushi"],
            maxSelections: 2,
            durationHours: undefined,
        });
    });
    (0, vitest_1.it)("enforces max option count when configured", function () {
        (0, vitest_1.expect)(function () {
            return (0, polls_js_1.normalizePollInput)({ question: "Q", options: ["A", "B", "C"] }, { maxOptions: 2 });
        }).toThrow(/at most 2/);
    });
    (0, vitest_1.it)("clamps poll duration with defaults", function () {
        (0, vitest_1.expect)((0, polls_js_1.normalizePollDurationHours)(undefined, { defaultHours: 24, maxHours: 48 })).toBe(24);
        (0, vitest_1.expect)((0, polls_js_1.normalizePollDurationHours)(999, { defaultHours: 24, maxHours: 48 })).toBe(48);
        (0, vitest_1.expect)((0, polls_js_1.normalizePollDurationHours)(1, { defaultHours: 24, maxHours: 48 })).toBe(1);
    });
});
