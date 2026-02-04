"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var send_policy_js_1 = require("./send-policy.js");
(0, vitest_1.describe)("resolveSendPolicy", function () {
    (0, vitest_1.it)("defaults to allow", function () {
        var cfg = {};
        (0, vitest_1.expect)((0, send_policy_js_1.resolveSendPolicy)({ cfg: cfg })).toBe("allow");
    });
    (0, vitest_1.it)("entry override wins", function () {
        var cfg = {
            session: { sendPolicy: { default: "allow" } },
        };
        var entry = {
            sessionId: "s",
            updatedAt: 0,
            sendPolicy: "deny",
        };
        (0, vitest_1.expect)((0, send_policy_js_1.resolveSendPolicy)({ cfg: cfg, entry: entry })).toBe("deny");
    });
    (0, vitest_1.it)("rule match by channel + chatType", function () {
        var cfg = {
            session: {
                sendPolicy: {
                    default: "allow",
                    rules: [
                        {
                            action: "deny",
                            match: { channel: "discord", chatType: "group" },
                        },
                    ],
                },
            },
        };
        var entry = {
            sessionId: "s",
            updatedAt: 0,
            channel: "discord",
            chatType: "group",
        };
        (0, vitest_1.expect)((0, send_policy_js_1.resolveSendPolicy)({ cfg: cfg, entry: entry, sessionKey: "discord:group:dev" })).toBe("deny");
    });
    (0, vitest_1.it)("rule match by keyPrefix", function () {
        var cfg = {
            session: {
                sendPolicy: {
                    default: "allow",
                    rules: [{ action: "deny", match: { keyPrefix: "cron:" } }],
                },
            },
        };
        (0, vitest_1.expect)((0, send_policy_js_1.resolveSendPolicy)({ cfg: cfg, sessionKey: "cron:job-1" })).toBe("deny");
    });
});
