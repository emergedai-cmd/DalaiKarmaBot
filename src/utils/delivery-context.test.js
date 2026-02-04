"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var delivery_context_js_1 = require("./delivery-context.js");
(0, vitest_1.describe)("delivery context helpers", function () {
    (0, vitest_1.it)("normalizes channel/to/accountId and drops empty contexts", function () {
        (0, vitest_1.expect)((0, delivery_context_js_1.normalizeDeliveryContext)({
            channel: " whatsapp ",
            to: " +1555 ",
            accountId: " acct-1 ",
        })).toEqual({
            channel: "whatsapp",
            to: "+1555",
            accountId: "acct-1",
        });
        (0, vitest_1.expect)((0, delivery_context_js_1.normalizeDeliveryContext)({ channel: "  " })).toBeUndefined();
    });
    (0, vitest_1.it)("merges primary values over fallback", function () {
        var merged = (0, delivery_context_js_1.mergeDeliveryContext)({ channel: "whatsapp", to: "channel:abc" }, { channel: "slack", to: "channel:def", accountId: "acct" });
        (0, vitest_1.expect)(merged).toEqual({
            channel: "whatsapp",
            to: "channel:abc",
            accountId: "acct",
        });
    });
    (0, vitest_1.it)("builds stable keys only when channel and to are present", function () {
        (0, vitest_1.expect)((0, delivery_context_js_1.deliveryContextKey)({ channel: "whatsapp", to: "+1555" })).toBe("whatsapp|+1555||");
        (0, vitest_1.expect)((0, delivery_context_js_1.deliveryContextKey)({ channel: "whatsapp" })).toBeUndefined();
        (0, vitest_1.expect)((0, delivery_context_js_1.deliveryContextKey)({ channel: "whatsapp", to: "+1555", accountId: "acct-1" })).toBe("whatsapp|+1555|acct-1|");
        (0, vitest_1.expect)((0, delivery_context_js_1.deliveryContextKey)({ channel: "slack", to: "channel:C1", threadId: "123.456" })).toBe("slack|channel:C1||123.456");
    });
    (0, vitest_1.it)("derives delivery context from a session entry", function () {
        (0, vitest_1.expect)((0, delivery_context_js_1.deliveryContextFromSession)({
            channel: "webchat",
            lastChannel: " whatsapp ",
            lastTo: " +1777 ",
            lastAccountId: " acct-9 ",
        })).toEqual({
            channel: "whatsapp",
            to: "+1777",
            accountId: "acct-9",
        });
        (0, vitest_1.expect)((0, delivery_context_js_1.deliveryContextFromSession)({
            channel: "telegram",
            lastTo: " 123 ",
            lastThreadId: " 999 ",
        })).toEqual({
            channel: "telegram",
            to: "123",
            accountId: undefined,
            threadId: "999",
        });
        (0, vitest_1.expect)((0, delivery_context_js_1.deliveryContextFromSession)({
            channel: "telegram",
            lastTo: " -1001 ",
            origin: { threadId: 42 },
        })).toEqual({
            channel: "telegram",
            to: "-1001",
            accountId: undefined,
            threadId: 42,
        });
        (0, vitest_1.expect)((0, delivery_context_js_1.deliveryContextFromSession)({
            channel: "telegram",
            lastTo: " -1001 ",
            deliveryContext: { threadId: " 777 " },
            origin: { threadId: 42 },
        })).toEqual({
            channel: "telegram",
            to: "-1001",
            accountId: undefined,
            threadId: "777",
        });
    });
    (0, vitest_1.it)("normalizes delivery fields and mirrors them on session entries", function () {
        var normalized = (0, delivery_context_js_1.normalizeSessionDeliveryFields)({
            deliveryContext: {
                channel: " Slack ",
                to: " channel:1 ",
                accountId: " acct-2 ",
                threadId: " 444 ",
            },
            lastChannel: " whatsapp ",
            lastTo: " +1555 ",
        });
        (0, vitest_1.expect)(normalized.deliveryContext).toEqual({
            channel: "whatsapp",
            to: "+1555",
            accountId: "acct-2",
            threadId: "444",
        });
        (0, vitest_1.expect)(normalized.lastChannel).toBe("whatsapp");
        (0, vitest_1.expect)(normalized.lastTo).toBe("+1555");
        (0, vitest_1.expect)(normalized.lastAccountId).toBe("acct-2");
        (0, vitest_1.expect)(normalized.lastThreadId).toBe("444");
    });
});
