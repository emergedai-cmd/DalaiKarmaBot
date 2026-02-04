"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_writes_js_1 = require("./config-writes.js");
(0, vitest_1.describe)("resolveChannelConfigWrites", function () {
    (0, vitest_1.it)("defaults to allow when unset", function () {
        var cfg = {};
        (0, vitest_1.expect)((0, config_writes_js_1.resolveChannelConfigWrites)({ cfg: cfg, channelId: "slack" })).toBe(true);
    });
    (0, vitest_1.it)("blocks when channel config disables writes", function () {
        var cfg = { channels: { slack: { configWrites: false } } };
        (0, vitest_1.expect)((0, config_writes_js_1.resolveChannelConfigWrites)({ cfg: cfg, channelId: "slack" })).toBe(false);
    });
    (0, vitest_1.it)("account override wins over channel default", function () {
        var cfg = {
            channels: {
                slack: {
                    configWrites: true,
                    accounts: {
                        work: { configWrites: false },
                    },
                },
            },
        };
        (0, vitest_1.expect)((0, config_writes_js_1.resolveChannelConfigWrites)({ cfg: cfg, channelId: "slack", accountId: "work" })).toBe(false);
    });
    (0, vitest_1.it)("matches account ids case-insensitively", function () {
        var cfg = {
            channels: {
                slack: {
                    configWrites: true,
                    accounts: {
                        Work: { configWrites: false },
                    },
                },
            },
        };
        (0, vitest_1.expect)((0, config_writes_js_1.resolveChannelConfigWrites)({ cfg: cfg, channelId: "slack", accountId: "work" })).toBe(false);
    });
});
