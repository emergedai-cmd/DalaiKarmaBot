"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var mention_gating_js_1 = require("./mention-gating.js");
(0, vitest_1.describe)("resolveMentionGating", function () {
    (0, vitest_1.it)("combines explicit, implicit, and bypass mentions", function () {
        var res = (0, mention_gating_js_1.resolveMentionGating)({
            requireMention: true,
            canDetectMention: true,
            wasMentioned: false,
            implicitMention: true,
            shouldBypassMention: false,
        });
        (0, vitest_1.expect)(res.effectiveWasMentioned).toBe(true);
        (0, vitest_1.expect)(res.shouldSkip).toBe(false);
    });
    (0, vitest_1.it)("skips when mention required and none detected", function () {
        var res = (0, mention_gating_js_1.resolveMentionGating)({
            requireMention: true,
            canDetectMention: true,
            wasMentioned: false,
            implicitMention: false,
            shouldBypassMention: false,
        });
        (0, vitest_1.expect)(res.effectiveWasMentioned).toBe(false);
        (0, vitest_1.expect)(res.shouldSkip).toBe(true);
    });
    (0, vitest_1.it)("does not skip when mention detection is unavailable", function () {
        var res = (0, mention_gating_js_1.resolveMentionGating)({
            requireMention: true,
            canDetectMention: false,
            wasMentioned: false,
        });
        (0, vitest_1.expect)(res.shouldSkip).toBe(false);
    });
});
(0, vitest_1.describe)("resolveMentionGatingWithBypass", function () {
    (0, vitest_1.it)("enables bypass when control commands are authorized", function () {
        var res = (0, mention_gating_js_1.resolveMentionGatingWithBypass)({
            isGroup: true,
            requireMention: true,
            canDetectMention: true,
            wasMentioned: false,
            hasAnyMention: false,
            allowTextCommands: true,
            hasControlCommand: true,
            commandAuthorized: true,
        });
        (0, vitest_1.expect)(res.shouldBypassMention).toBe(true);
        (0, vitest_1.expect)(res.shouldSkip).toBe(false);
    });
    (0, vitest_1.it)("does not bypass when control commands are not authorized", function () {
        var res = (0, mention_gating_js_1.resolveMentionGatingWithBypass)({
            isGroup: true,
            requireMention: true,
            canDetectMention: true,
            wasMentioned: false,
            hasAnyMention: false,
            allowTextCommands: true,
            hasControlCommand: true,
            commandAuthorized: false,
        });
        (0, vitest_1.expect)(res.shouldBypassMention).toBe(false);
        (0, vitest_1.expect)(res.shouldSkip).toBe(true);
    });
});
