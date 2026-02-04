"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var reaction_level_js_1 = require("./reaction-level.js");
(0, vitest_1.describe)("resolveTelegramReactionLevel", function () {
    var prevTelegramToken = process.env.TELEGRAM_BOT_TOKEN;
    (0, vitest_1.beforeAll)(function () {
        process.env.TELEGRAM_BOT_TOKEN = "test-token";
    });
    (0, vitest_1.afterAll)(function () {
        if (prevTelegramToken === undefined) {
            delete process.env.TELEGRAM_BOT_TOKEN;
        }
        else {
            process.env.TELEGRAM_BOT_TOKEN = prevTelegramToken;
        }
    });
    (0, vitest_1.it)("defaults to minimal level when reactionLevel is not set", function () {
        var cfg = {
            channels: { telegram: {} },
        };
        var result = (0, reaction_level_js_1.resolveTelegramReactionLevel)({ cfg: cfg });
        (0, vitest_1.expect)(result.level).toBe("minimal");
        (0, vitest_1.expect)(result.ackEnabled).toBe(false);
        (0, vitest_1.expect)(result.agentReactionsEnabled).toBe(true);
        (0, vitest_1.expect)(result.agentReactionGuidance).toBe("minimal");
    });
    (0, vitest_1.it)("returns off level with no reactions enabled", function () {
        var cfg = {
            channels: { telegram: { reactionLevel: "off" } },
        };
        var result = (0, reaction_level_js_1.resolveTelegramReactionLevel)({ cfg: cfg });
        (0, vitest_1.expect)(result.level).toBe("off");
        (0, vitest_1.expect)(result.ackEnabled).toBe(false);
        (0, vitest_1.expect)(result.agentReactionsEnabled).toBe(false);
        (0, vitest_1.expect)(result.agentReactionGuidance).toBeUndefined();
    });
    (0, vitest_1.it)("returns ack level with only ackEnabled", function () {
        var cfg = {
            channels: { telegram: { reactionLevel: "ack" } },
        };
        var result = (0, reaction_level_js_1.resolveTelegramReactionLevel)({ cfg: cfg });
        (0, vitest_1.expect)(result.level).toBe("ack");
        (0, vitest_1.expect)(result.ackEnabled).toBe(true);
        (0, vitest_1.expect)(result.agentReactionsEnabled).toBe(false);
        (0, vitest_1.expect)(result.agentReactionGuidance).toBeUndefined();
    });
    (0, vitest_1.it)("returns minimal level with agent reactions enabled and minimal guidance", function () {
        var cfg = {
            channels: { telegram: { reactionLevel: "minimal" } },
        };
        var result = (0, reaction_level_js_1.resolveTelegramReactionLevel)({ cfg: cfg });
        (0, vitest_1.expect)(result.level).toBe("minimal");
        (0, vitest_1.expect)(result.ackEnabled).toBe(false);
        (0, vitest_1.expect)(result.agentReactionsEnabled).toBe(true);
        (0, vitest_1.expect)(result.agentReactionGuidance).toBe("minimal");
    });
    (0, vitest_1.it)("returns extensive level with agent reactions enabled and extensive guidance", function () {
        var cfg = {
            channels: { telegram: { reactionLevel: "extensive" } },
        };
        var result = (0, reaction_level_js_1.resolveTelegramReactionLevel)({ cfg: cfg });
        (0, vitest_1.expect)(result.level).toBe("extensive");
        (0, vitest_1.expect)(result.ackEnabled).toBe(false);
        (0, vitest_1.expect)(result.agentReactionsEnabled).toBe(true);
        (0, vitest_1.expect)(result.agentReactionGuidance).toBe("extensive");
    });
    (0, vitest_1.it)("resolves reaction level from a specific account", function () {
        var cfg = {
            channels: {
                telegram: {
                    reactionLevel: "ack",
                    accounts: {
                        work: { botToken: "tok-work", reactionLevel: "extensive" },
                    },
                },
            },
        };
        var result = (0, reaction_level_js_1.resolveTelegramReactionLevel)({ cfg: cfg, accountId: "work" });
        (0, vitest_1.expect)(result.level).toBe("extensive");
        (0, vitest_1.expect)(result.ackEnabled).toBe(false);
        (0, vitest_1.expect)(result.agentReactionsEnabled).toBe(true);
        (0, vitest_1.expect)(result.agentReactionGuidance).toBe("extensive");
    });
    (0, vitest_1.it)("falls back to global level when account has no reactionLevel", function () {
        var cfg = {
            channels: {
                telegram: {
                    reactionLevel: "minimal",
                    accounts: {
                        work: { botToken: "tok-work" },
                    },
                },
            },
        };
        var result = (0, reaction_level_js_1.resolveTelegramReactionLevel)({ cfg: cfg, accountId: "work" });
        (0, vitest_1.expect)(result.level).toBe("minimal");
        (0, vitest_1.expect)(result.agentReactionsEnabled).toBe(true);
        (0, vitest_1.expect)(result.agentReactionGuidance).toBe("minimal");
    });
});
