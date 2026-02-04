"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var agent_runner_utils_js_1 = require("./agent-runner-utils.js");
(0, vitest_1.describe)("buildThreadingToolContext", function () {
    var cfg = {};
    (0, vitest_1.it)("uses conversation id for WhatsApp", function () {
        var sessionCtx = {
            Provider: "whatsapp",
            From: "123@g.us",
            To: "+15550001",
        };
        var result = (0, agent_runner_utils_js_1.buildThreadingToolContext)({
            sessionCtx: sessionCtx,
            config: cfg,
            hasRepliedRef: undefined,
        });
        (0, vitest_1.expect)(result.currentChannelId).toBe("123@g.us");
    });
    (0, vitest_1.it)("falls back to To for WhatsApp when From is missing", function () {
        var sessionCtx = {
            Provider: "whatsapp",
            To: "+15550001",
        };
        var result = (0, agent_runner_utils_js_1.buildThreadingToolContext)({
            sessionCtx: sessionCtx,
            config: cfg,
            hasRepliedRef: undefined,
        });
        (0, vitest_1.expect)(result.currentChannelId).toBe("+15550001");
    });
    (0, vitest_1.it)("uses the recipient id for other channels", function () {
        var sessionCtx = {
            Provider: "telegram",
            From: "user:42",
            To: "chat:99",
        };
        var result = (0, agent_runner_utils_js_1.buildThreadingToolContext)({
            sessionCtx: sessionCtx,
            config: cfg,
            hasRepliedRef: undefined,
        });
        (0, vitest_1.expect)(result.currentChannelId).toBe("chat:99");
    });
    (0, vitest_1.it)("uses the sender handle for iMessage direct chats", function () {
        var sessionCtx = {
            Provider: "imessage",
            ChatType: "direct",
            From: "imessage:+15550001",
            To: "chat_id:12",
        };
        var result = (0, agent_runner_utils_js_1.buildThreadingToolContext)({
            sessionCtx: sessionCtx,
            config: cfg,
            hasRepliedRef: undefined,
        });
        (0, vitest_1.expect)(result.currentChannelId).toBe("imessage:+15550001");
    });
    (0, vitest_1.it)("uses chat_id for iMessage groups", function () {
        var sessionCtx = {
            Provider: "imessage",
            ChatType: "group",
            From: "imessage:group:7",
            To: "chat_id:7",
        };
        var result = (0, agent_runner_utils_js_1.buildThreadingToolContext)({
            sessionCtx: sessionCtx,
            config: cfg,
            hasRepliedRef: undefined,
        });
        (0, vitest_1.expect)(result.currentChannelId).toBe("chat_id:7");
    });
    (0, vitest_1.it)("prefers MessageThreadId for Slack tool threading", function () {
        var sessionCtx = {
            Provider: "slack",
            To: "channel:C1",
            MessageThreadId: "123.456",
        };
        var result = (0, agent_runner_utils_js_1.buildThreadingToolContext)({
            sessionCtx: sessionCtx,
            config: { channels: { slack: { replyToMode: "all" } } },
            hasRepliedRef: undefined,
        });
        (0, vitest_1.expect)(result.currentChannelId).toBe("C1");
        (0, vitest_1.expect)(result.currentThreadTs).toBe("123.456");
    });
});
