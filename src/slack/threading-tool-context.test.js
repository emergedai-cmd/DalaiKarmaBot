"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var threading_tool_context_js_1 = require("./threading-tool-context.js");
var emptyCfg = {};
(0, vitest_1.describe)("buildSlackThreadingToolContext", function () {
    (0, vitest_1.it)("uses top-level replyToMode by default", function () {
        var cfg = {
            channels: {
                slack: { replyToMode: "first" },
            },
        };
        var result = (0, threading_tool_context_js_1.buildSlackThreadingToolContext)({
            cfg: cfg,
            accountId: null,
            context: { ChatType: "channel" },
        });
        (0, vitest_1.expect)(result.replyToMode).toBe("first");
    });
    (0, vitest_1.it)("uses chat-type replyToMode overrides for direct messages when configured", function () {
        var cfg = {
            channels: {
                slack: {
                    replyToMode: "off",
                    replyToModeByChatType: { direct: "all" },
                },
            },
        };
        var result = (0, threading_tool_context_js_1.buildSlackThreadingToolContext)({
            cfg: cfg,
            accountId: null,
            context: { ChatType: "direct" },
        });
        (0, vitest_1.expect)(result.replyToMode).toBe("all");
    });
    (0, vitest_1.it)("uses top-level replyToMode for channels when no channel override is set", function () {
        var cfg = {
            channels: {
                slack: {
                    replyToMode: "off",
                    replyToModeByChatType: { direct: "all" },
                },
            },
        };
        var result = (0, threading_tool_context_js_1.buildSlackThreadingToolContext)({
            cfg: cfg,
            accountId: null,
            context: { ChatType: "channel" },
        });
        (0, vitest_1.expect)(result.replyToMode).toBe("off");
    });
    (0, vitest_1.it)("falls back to top-level when no chat-type override is set", function () {
        var cfg = {
            channels: {
                slack: {
                    replyToMode: "first",
                },
            },
        };
        var result = (0, threading_tool_context_js_1.buildSlackThreadingToolContext)({
            cfg: cfg,
            accountId: null,
            context: { ChatType: "direct" },
        });
        (0, vitest_1.expect)(result.replyToMode).toBe("first");
    });
    (0, vitest_1.it)("uses legacy dm.replyToMode for direct messages when no chat-type override exists", function () {
        var cfg = {
            channels: {
                slack: {
                    replyToMode: "off",
                    dm: { replyToMode: "all" },
                },
            },
        };
        var result = (0, threading_tool_context_js_1.buildSlackThreadingToolContext)({
            cfg: cfg,
            accountId: null,
            context: { ChatType: "direct" },
        });
        (0, vitest_1.expect)(result.replyToMode).toBe("all");
    });
    (0, vitest_1.it)("uses all mode when ThreadLabel is present", function () {
        var cfg = {
            channels: {
                slack: { replyToMode: "off" },
            },
        };
        var result = (0, threading_tool_context_js_1.buildSlackThreadingToolContext)({
            cfg: cfg,
            accountId: null,
            context: { ChatType: "channel", ThreadLabel: "some-thread" },
        });
        (0, vitest_1.expect)(result.replyToMode).toBe("all");
    });
    (0, vitest_1.it)("defaults to off when no replyToMode is configured", function () {
        var result = (0, threading_tool_context_js_1.buildSlackThreadingToolContext)({
            cfg: emptyCfg,
            accountId: null,
            context: { ChatType: "direct" },
        });
        (0, vitest_1.expect)(result.replyToMode).toBe("off");
    });
});
