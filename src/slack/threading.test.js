"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var threading_js_1 = require("./threading.js");
(0, vitest_1.describe)("resolveSlackThreadTargets", function () {
    (0, vitest_1.it)("threads replies when message is already threaded", function () {
        var _a = (0, threading_js_1.resolveSlackThreadTargets)({
            replyToMode: "off",
            message: {
                type: "message",
                channel: "C1",
                ts: "123",
                thread_ts: "456",
            },
        }), replyThreadTs = _a.replyThreadTs, statusThreadTs = _a.statusThreadTs;
        (0, vitest_1.expect)(replyThreadTs).toBe("456");
        (0, vitest_1.expect)(statusThreadTs).toBe("456");
    });
    (0, vitest_1.it)("threads top-level replies when mode is all", function () {
        var _a = (0, threading_js_1.resolveSlackThreadTargets)({
            replyToMode: "all",
            message: {
                type: "message",
                channel: "C1",
                ts: "123",
            },
        }), replyThreadTs = _a.replyThreadTs, statusThreadTs = _a.statusThreadTs;
        (0, vitest_1.expect)(replyThreadTs).toBe("123");
        (0, vitest_1.expect)(statusThreadTs).toBe("123");
    });
    (0, vitest_1.it)("keeps status threading even when reply threading is off", function () {
        var _a = (0, threading_js_1.resolveSlackThreadTargets)({
            replyToMode: "off",
            message: {
                type: "message",
                channel: "C1",
                ts: "123",
            },
        }), replyThreadTs = _a.replyThreadTs, statusThreadTs = _a.statusThreadTs;
        (0, vitest_1.expect)(replyThreadTs).toBeUndefined();
        (0, vitest_1.expect)(statusThreadTs).toBe("123");
    });
    (0, vitest_1.it)("sets messageThreadId for top-level messages when replyToMode is all", function () {
        var context = (0, threading_js_1.resolveSlackThreadContext)({
            replyToMode: "all",
            message: {
                type: "message",
                channel: "C1",
                ts: "123",
            },
        });
        (0, vitest_1.expect)(context.isThreadReply).toBe(false);
        (0, vitest_1.expect)(context.messageThreadId).toBe("123");
        (0, vitest_1.expect)(context.replyToId).toBe("123");
    });
    (0, vitest_1.it)("prefers thread_ts as messageThreadId for replies", function () {
        var context = (0, threading_js_1.resolveSlackThreadContext)({
            replyToMode: "off",
            message: {
                type: "message",
                channel: "C1",
                ts: "123",
                thread_ts: "456",
            },
        });
        (0, vitest_1.expect)(context.isThreadReply).toBe(true);
        (0, vitest_1.expect)(context.messageThreadId).toBe("456");
        (0, vitest_1.expect)(context.replyToId).toBe("456");
    });
});
