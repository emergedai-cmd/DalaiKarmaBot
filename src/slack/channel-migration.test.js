"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var channel_migration_js_1 = require("./channel-migration.js");
(0, vitest_1.describe)("migrateSlackChannelConfig", function () {
    (0, vitest_1.it)("migrates global channel ids", function () {
        var cfg = {
            channels: {
                slack: {
                    channels: {
                        C123: { requireMention: false },
                    },
                },
            },
        };
        var result = (0, channel_migration_js_1.migrateSlackChannelConfig)({
            cfg: cfg,
            accountId: "default",
            oldChannelId: "C123",
            newChannelId: "C999",
        });
        (0, vitest_1.expect)(result.migrated).toBe(true);
        (0, vitest_1.expect)(cfg.channels.slack.channels).toEqual({
            C999: { requireMention: false },
        });
    });
    (0, vitest_1.it)("migrates account-scoped channels", function () {
        var cfg = {
            channels: {
                slack: {
                    accounts: {
                        primary: {
                            channels: {
                                C123: { requireMention: true },
                            },
                        },
                    },
                },
            },
        };
        var result = (0, channel_migration_js_1.migrateSlackChannelConfig)({
            cfg: cfg,
            accountId: "primary",
            oldChannelId: "C123",
            newChannelId: "C999",
        });
        (0, vitest_1.expect)(result.migrated).toBe(true);
        (0, vitest_1.expect)(result.scopes).toEqual(["account"]);
        (0, vitest_1.expect)(cfg.channels.slack.accounts.primary.channels).toEqual({
            C999: { requireMention: true },
        });
    });
    (0, vitest_1.it)("matches account ids case-insensitively", function () {
        var cfg = {
            channels: {
                slack: {
                    accounts: {
                        Primary: {
                            channels: {
                                C123: {},
                            },
                        },
                    },
                },
            },
        };
        var result = (0, channel_migration_js_1.migrateSlackChannelConfig)({
            cfg: cfg,
            accountId: "primary",
            oldChannelId: "C123",
            newChannelId: "C999",
        });
        (0, vitest_1.expect)(result.migrated).toBe(true);
        (0, vitest_1.expect)(cfg.channels.slack.accounts.Primary.channels).toEqual({
            C999: {},
        });
    });
    (0, vitest_1.it)("skips migration when new id already exists", function () {
        var cfg = {
            channels: {
                slack: {
                    channels: {
                        C123: { requireMention: true },
                        C999: { requireMention: false },
                    },
                },
            },
        };
        var result = (0, channel_migration_js_1.migrateSlackChannelConfig)({
            cfg: cfg,
            accountId: "default",
            oldChannelId: "C123",
            newChannelId: "C999",
        });
        (0, vitest_1.expect)(result.migrated).toBe(false);
        (0, vitest_1.expect)(result.skippedExisting).toBe(true);
        (0, vitest_1.expect)(cfg.channels.slack.channels).toEqual({
            C123: { requireMention: true },
            C999: { requireMention: false },
        });
    });
});
