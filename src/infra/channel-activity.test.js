"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var channel_activity_js_1 = require("./channel-activity.js");
(0, vitest_1.describe)("channel activity", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, channel_activity_js_1.resetChannelActivityForTest)();
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.setSystemTime(new Date("2026-01-08T00:00:00Z"));
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("records inbound/outbound separately", function () {
        (0, channel_activity_js_1.recordChannelActivity)({ channel: "telegram", direction: "inbound" });
        vitest_1.vi.advanceTimersByTime(1000);
        (0, channel_activity_js_1.recordChannelActivity)({ channel: "telegram", direction: "outbound" });
        var res = (0, channel_activity_js_1.getChannelActivity)({ channel: "telegram" });
        (0, vitest_1.expect)(res.inboundAt).toBe(1767830400000);
        (0, vitest_1.expect)(res.outboundAt).toBe(1767830401000);
    });
    (0, vitest_1.it)("isolates accounts", function () {
        (0, channel_activity_js_1.recordChannelActivity)({
            channel: "whatsapp",
            accountId: "a",
            direction: "inbound",
            at: 1,
        });
        (0, channel_activity_js_1.recordChannelActivity)({
            channel: "whatsapp",
            accountId: "b",
            direction: "inbound",
            at: 2,
        });
        (0, vitest_1.expect)((0, channel_activity_js_1.getChannelActivity)({ channel: "whatsapp", accountId: "a" })).toEqual({
            inboundAt: 1,
            outboundAt: null,
        });
        (0, vitest_1.expect)((0, channel_activity_js_1.getChannelActivity)({ channel: "whatsapp", accountId: "b" })).toEqual({
            inboundAt: 2,
            outboundAt: null,
        });
    });
});
