"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
(0, vitest_1.describe)("Slack token config fields", function () {
    (0, vitest_1.it)("accepts user token config fields", function () {
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                slack: {
                    botToken: "xoxb-any",
                    appToken: "xapp-any",
                    userToken: "xoxp-any",
                    userTokenReadOnly: false,
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
    });
    (0, vitest_1.it)("accepts account-level user token config", function () {
        var res = (0, config_js_1.validateConfigObject)({
            channels: {
                slack: {
                    accounts: {
                        work: {
                            botToken: "xoxb-any",
                            appToken: "xapp-any",
                            userToken: "xoxp-any",
                            userTokenReadOnly: true,
                        },
                    },
                },
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
    });
});
