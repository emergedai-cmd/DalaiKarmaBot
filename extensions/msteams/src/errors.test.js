"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var errors_js_1 = require("./errors.js");
(0, vitest_1.describe)("msteams errors", function () {
    (0, vitest_1.it)("formats unknown errors", function () {
        (0, vitest_1.expect)((0, errors_js_1.formatUnknownError)("oops")).toBe("oops");
        (0, vitest_1.expect)((0, errors_js_1.formatUnknownError)(null)).toBe("null");
    });
    (0, vitest_1.it)("classifies auth errors", function () {
        (0, vitest_1.expect)((0, errors_js_1.classifyMSTeamsSendError)({ statusCode: 401 }).kind).toBe("auth");
        (0, vitest_1.expect)((0, errors_js_1.classifyMSTeamsSendError)({ statusCode: 403 }).kind).toBe("auth");
    });
    (0, vitest_1.it)("classifies throttling errors and parses retry-after", function () {
        (0, vitest_1.expect)((0, errors_js_1.classifyMSTeamsSendError)({ statusCode: 429, retryAfter: "1.5" })).toMatchObject({
            kind: "throttled",
            statusCode: 429,
            retryAfterMs: 1500,
        });
    });
    (0, vitest_1.it)("classifies transient errors", function () {
        (0, vitest_1.expect)((0, errors_js_1.classifyMSTeamsSendError)({ statusCode: 503 })).toMatchObject({
            kind: "transient",
            statusCode: 503,
        });
    });
    (0, vitest_1.it)("classifies permanent 4xx errors", function () {
        (0, vitest_1.expect)((0, errors_js_1.classifyMSTeamsSendError)({ statusCode: 400 })).toMatchObject({
            kind: "permanent",
            statusCode: 400,
        });
    });
    (0, vitest_1.it)("provides actionable hints for common cases", function () {
        (0, vitest_1.expect)((0, errors_js_1.formatMSTeamsSendErrorHint)({ kind: "auth" })).toContain("msteams");
        (0, vitest_1.expect)((0, errors_js_1.formatMSTeamsSendErrorHint)({ kind: "throttled" })).toContain("throttled");
    });
});
