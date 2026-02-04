"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var poll_types_js_1 = require("./poll-types.js");
(0, vitest_1.describe)("parsePollStartContent", function () {
    (0, vitest_1.it)("parses legacy m.poll payloads", function () {
        var summary = (0, poll_types_js_1.parsePollStartContent)({
            "m.poll": {
                question: { "m.text": "Lunch?" },
                kind: "m.poll.disclosed",
                max_selections: 1,
                answers: [
                    { id: "answer1", "m.text": "Yes" },
                    { id: "answer2", "m.text": "No" },
                ],
            },
        });
        (0, vitest_1.expect)(summary === null || summary === void 0 ? void 0 : summary.question).toBe("Lunch?");
        (0, vitest_1.expect)(summary === null || summary === void 0 ? void 0 : summary.answers).toEqual(["Yes", "No"]);
    });
});
