"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_js_1 = require("../config/config.js");
var gmail_js_1 = require("./gmail.js");
var baseConfig = {
    hooks: {
        token: "hook-token",
        gmail: {
            account: "openclaw@gmail.com",
            topic: "projects/demo/topics/gog-gmail-watch",
            pushToken: "push-token",
        },
    },
};
(0, vitest_1.describe)("gmail hook config", function () {
    (0, vitest_1.it)("builds default hook url", function () {
        (0, vitest_1.expect)((0, gmail_js_1.buildDefaultHookUrl)("/hooks", config_js_1.DEFAULT_GATEWAY_PORT)).toBe("http://127.0.0.1:".concat(config_js_1.DEFAULT_GATEWAY_PORT, "/hooks/gmail"));
    });
    (0, vitest_1.it)("parses topic path", function () {
        var topic = (0, gmail_js_1.buildTopicPath)("proj", "topic");
        (0, vitest_1.expect)((0, gmail_js_1.parseTopicPath)(topic)).toEqual({
            projectId: "proj",
            topicName: "topic",
        });
    });
    (0, vitest_1.it)("resolves runtime config with defaults", function () {
        var result = (0, gmail_js_1.resolveGmailHookRuntimeConfig)(baseConfig, {});
        (0, vitest_1.expect)(result.ok).toBe(true);
        if (result.ok) {
            (0, vitest_1.expect)(result.value.account).toBe("openclaw@gmail.com");
            (0, vitest_1.expect)(result.value.label).toBe("INBOX");
            (0, vitest_1.expect)(result.value.includeBody).toBe(true);
            (0, vitest_1.expect)(result.value.serve.port).toBe(8788);
            (0, vitest_1.expect)(result.value.hookUrl).toBe("http://127.0.0.1:".concat(config_js_1.DEFAULT_GATEWAY_PORT, "/hooks/gmail"));
        }
    });
    (0, vitest_1.it)("fails without hook token", function () {
        var result = (0, gmail_js_1.resolveGmailHookRuntimeConfig)({
            hooks: {
                gmail: {
                    account: "openclaw@gmail.com",
                    topic: "projects/demo/topics/gog-gmail-watch",
                    pushToken: "push-token",
                },
            },
        }, {});
        (0, vitest_1.expect)(result.ok).toBe(false);
    });
    (0, vitest_1.it)("defaults serve path to / when tailscale is enabled", function () {
        var result = (0, gmail_js_1.resolveGmailHookRuntimeConfig)({
            hooks: {
                token: "hook-token",
                gmail: {
                    account: "openclaw@gmail.com",
                    topic: "projects/demo/topics/gog-gmail-watch",
                    pushToken: "push-token",
                    tailscale: { mode: "funnel" },
                },
            },
        }, {});
        (0, vitest_1.expect)(result.ok).toBe(true);
        if (result.ok) {
            (0, vitest_1.expect)(result.value.serve.path).toBe("/");
            (0, vitest_1.expect)(result.value.tailscale.path).toBe("/gmail-pubsub");
        }
    });
    (0, vitest_1.it)("keeps the default public path when serve path is explicit", function () {
        var result = (0, gmail_js_1.resolveGmailHookRuntimeConfig)({
            hooks: {
                token: "hook-token",
                gmail: {
                    account: "openclaw@gmail.com",
                    topic: "projects/demo/topics/gog-gmail-watch",
                    pushToken: "push-token",
                    serve: { path: "/gmail-pubsub" },
                    tailscale: { mode: "funnel" },
                },
            },
        }, {});
        (0, vitest_1.expect)(result.ok).toBe(true);
        if (result.ok) {
            (0, vitest_1.expect)(result.value.serve.path).toBe("/");
            (0, vitest_1.expect)(result.value.tailscale.path).toBe("/gmail-pubsub");
        }
    });
    (0, vitest_1.it)("keeps custom public path when serve path is set", function () {
        var result = (0, gmail_js_1.resolveGmailHookRuntimeConfig)({
            hooks: {
                token: "hook-token",
                gmail: {
                    account: "openclaw@gmail.com",
                    topic: "projects/demo/topics/gog-gmail-watch",
                    pushToken: "push-token",
                    serve: { path: "/custom" },
                    tailscale: { mode: "funnel" },
                },
            },
        }, {});
        (0, vitest_1.expect)(result.ok).toBe(true);
        if (result.ok) {
            (0, vitest_1.expect)(result.value.serve.path).toBe("/");
            (0, vitest_1.expect)(result.value.tailscale.path).toBe("/custom");
        }
    });
    (0, vitest_1.it)("keeps serve path when tailscale target is set", function () {
        var result = (0, gmail_js_1.resolveGmailHookRuntimeConfig)({
            hooks: {
                token: "hook-token",
                gmail: {
                    account: "openclaw@gmail.com",
                    topic: "projects/demo/topics/gog-gmail-watch",
                    pushToken: "push-token",
                    serve: { path: "/custom" },
                    tailscale: {
                        mode: "funnel",
                        target: "http://127.0.0.1:8788/custom",
                    },
                },
            },
        }, {});
        (0, vitest_1.expect)(result.ok).toBe(true);
        if (result.ok) {
            (0, vitest_1.expect)(result.value.serve.path).toBe("/custom");
            (0, vitest_1.expect)(result.value.tailscale.path).toBe("/custom");
            (0, vitest_1.expect)(result.value.tailscale.target).toBe("http://127.0.0.1:8788/custom");
        }
    });
});
