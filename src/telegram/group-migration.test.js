"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var group_migration_js_1 = require("./group-migration.js");
(0, vitest_1.describe)("migrateTelegramGroupConfig", function () {
    (0, vitest_1.it)("migrates global group ids", function () {
        var cfg = {
            channels: {
                telegram: {
                    groups: {
                        "-123": { requireMention: false },
                    },
                },
            },
        };
        var result = (0, group_migration_js_1.migrateTelegramGroupConfig)({
            cfg: cfg,
            accountId: "default",
            oldChatId: "-123",
            newChatId: "-100123",
        });
        (0, vitest_1.expect)(result.migrated).toBe(true);
        (0, vitest_1.expect)(cfg.channels.telegram.groups).toEqual({
            "-100123": { requireMention: false },
        });
    });
    (0, vitest_1.it)("migrates account-scoped groups", function () {
        var cfg = {
            channels: {
                telegram: {
                    accounts: {
                        primary: {
                            groups: {
                                "-123": { requireMention: true },
                            },
                        },
                    },
                },
            },
        };
        var result = (0, group_migration_js_1.migrateTelegramGroupConfig)({
            cfg: cfg,
            accountId: "primary",
            oldChatId: "-123",
            newChatId: "-100123",
        });
        (0, vitest_1.expect)(result.migrated).toBe(true);
        (0, vitest_1.expect)(result.scopes).toEqual(["account"]);
        (0, vitest_1.expect)(cfg.channels.telegram.accounts.primary.groups).toEqual({
            "-100123": { requireMention: true },
        });
    });
    (0, vitest_1.it)("matches account ids case-insensitively", function () {
        var cfg = {
            channels: {
                telegram: {
                    accounts: {
                        Primary: {
                            groups: {
                                "-123": {},
                            },
                        },
                    },
                },
            },
        };
        var result = (0, group_migration_js_1.migrateTelegramGroupConfig)({
            cfg: cfg,
            accountId: "primary",
            oldChatId: "-123",
            newChatId: "-100123",
        });
        (0, vitest_1.expect)(result.migrated).toBe(true);
        (0, vitest_1.expect)(cfg.channels.telegram.accounts.Primary.groups).toEqual({
            "-100123": {},
        });
    });
    (0, vitest_1.it)("skips migration when new id already exists", function () {
        var cfg = {
            channels: {
                telegram: {
                    groups: {
                        "-123": { requireMention: true },
                        "-100123": { requireMention: false },
                    },
                },
            },
        };
        var result = (0, group_migration_js_1.migrateTelegramGroupConfig)({
            cfg: cfg,
            accountId: "default",
            oldChatId: "-123",
            newChatId: "-100123",
        });
        (0, vitest_1.expect)(result.migrated).toBe(false);
        (0, vitest_1.expect)(result.skippedExisting).toBe(true);
        (0, vitest_1.expect)(cfg.channels.telegram.groups).toEqual({
            "-123": { requireMention: true },
            "-100123": { requireMention: false },
        });
    });
});
