"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var tokens_js_1 = require("../tokens.js");
var normalize_reply_js_1 = require("./normalize-reply.js");
// Keep channelData-only payloads so channel-specific replies survive normalization.
(0, vitest_1.describe)("normalizeReplyPayload", function () {
    (0, vitest_1.it)("keeps channelData-only replies", function () {
        var payload = {
            channelData: {
                line: {
                    flexMessage: { type: "bubble" },
                },
            },
        };
        var normalized = (0, normalize_reply_js_1.normalizeReplyPayload)(payload);
        (0, vitest_1.expect)(normalized).not.toBeNull();
        (0, vitest_1.expect)(normalized === null || normalized === void 0 ? void 0 : normalized.text).toBeUndefined();
        (0, vitest_1.expect)(normalized === null || normalized === void 0 ? void 0 : normalized.channelData).toEqual(payload.channelData);
    });
    (0, vitest_1.it)("records silent skips", function () {
        var reasons = [];
        var normalized = (0, normalize_reply_js_1.normalizeReplyPayload)({ text: tokens_js_1.SILENT_REPLY_TOKEN }, {
            onSkip: function (reason) { return reasons.push(reason); },
        });
        (0, vitest_1.expect)(normalized).toBeNull();
        (0, vitest_1.expect)(reasons).toEqual(["silent"]);
    });
    (0, vitest_1.it)("records empty skips", function () {
        var reasons = [];
        var normalized = (0, normalize_reply_js_1.normalizeReplyPayload)({ text: "   " }, {
            onSkip: function (reason) { return reasons.push(reason); },
        });
        (0, vitest_1.expect)(normalized).toBeNull();
        (0, vitest_1.expect)(reasons).toEqual(["empty"]);
    });
});
