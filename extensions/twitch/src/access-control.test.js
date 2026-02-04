"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var access_control_js_1 = require("./access-control.js");
(0, vitest_1.describe)("checkTwitchAccessControl", function () {
    var mockAccount = {
        username: "testbot",
        token: "oauth:test",
    };
    var mockMessage = {
        username: "testuser",
        userId: "123456",
        message: "hello bot",
        channel: "testchannel",
    };
    (0, vitest_1.describe)("when no restrictions are configured", function () {
        (0, vitest_1.it)("allows messages that mention the bot (default requireMention)", function () {
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello" });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: mockAccount,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
    });
    (0, vitest_1.describe)("requireMention default", function () {
        (0, vitest_1.it)("defaults to true when undefined", function () {
            var message = __assign(__assign({}, mockMessage), { message: "hello bot" });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: mockAccount,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(false);
            (0, vitest_1.expect)(result.reason).toContain("does not mention the bot");
        });
        (0, vitest_1.it)("allows mention when requireMention is undefined", function () {
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello" });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: mockAccount,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
    });
    (0, vitest_1.describe)("requireMention", function () {
        (0, vitest_1.it)("allows messages that mention the bot", function () {
            var account = __assign(__assign({}, mockAccount), { requireMention: true });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello" });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
        (0, vitest_1.it)("blocks messages that don't mention the bot", function () {
            var account = __assign(__assign({}, mockAccount), { requireMention: true });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: mockMessage,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(false);
            (0, vitest_1.expect)(result.reason).toContain("does not mention the bot");
        });
        (0, vitest_1.it)("is case-insensitive for bot username", function () {
            var account = __assign(__assign({}, mockAccount), { requireMention: true });
            var message = __assign(__assign({}, mockMessage), { message: "@TestBot hello" });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
    });
    (0, vitest_1.describe)("allowFrom allowlist", function () {
        (0, vitest_1.it)("allows users in the allowlist", function () {
            var account = __assign(__assign({}, mockAccount), { allowFrom: ["123456", "789012"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello" });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
            (0, vitest_1.expect)(result.matchKey).toBe("123456");
            (0, vitest_1.expect)(result.matchSource).toBe("allowlist");
        });
        (0, vitest_1.it)("blocks users not in allowlist when allowFrom is set", function () {
            var account = __assign(__assign({}, mockAccount), { allowFrom: ["789012"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello" });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(false);
            (0, vitest_1.expect)(result.reason).toContain("allowFrom");
        });
        (0, vitest_1.it)("blocks messages without userId", function () {
            var account = __assign(__assign({}, mockAccount), { allowFrom: ["123456"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", userId: undefined });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(false);
            (0, vitest_1.expect)(result.reason).toContain("user ID not available");
        });
        (0, vitest_1.it)("bypasses role checks when user is in allowlist", function () {
            var account = __assign(__assign({}, mockAccount), { allowFrom: ["123456"], allowedRoles: ["owner"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", isOwner: false });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
        (0, vitest_1.it)("blocks user with role when not in allowlist", function () {
            var account = __assign(__assign({}, mockAccount), { allowFrom: ["789012"], allowedRoles: ["moderator"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", userId: "123456", isMod: true });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(false);
            (0, vitest_1.expect)(result.reason).toContain("allowFrom");
        });
        (0, vitest_1.it)("blocks user not in allowlist even when roles configured", function () {
            var account = __assign(__assign({}, mockAccount), { allowFrom: ["789012"], allowedRoles: ["moderator"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", userId: "123456", isMod: false });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(false);
            (0, vitest_1.expect)(result.reason).toContain("allowFrom");
        });
    });
    (0, vitest_1.describe)("allowedRoles", function () {
        (0, vitest_1.it)("allows users with matching role", function () {
            var account = __assign(__assign({}, mockAccount), { allowedRoles: ["moderator"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", isMod: true });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
            (0, vitest_1.expect)(result.matchSource).toBe("role");
        });
        (0, vitest_1.it)("allows users with any of multiple roles", function () {
            var account = __assign(__assign({}, mockAccount), { allowedRoles: ["moderator", "vip", "subscriber"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", isVip: true, isMod: false, isSub: false });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
        (0, vitest_1.it)("blocks users without matching role", function () {
            var account = __assign(__assign({}, mockAccount), { allowedRoles: ["moderator"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", isMod: false });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(false);
            (0, vitest_1.expect)(result.reason).toContain("does not have any of the required roles");
        });
        (0, vitest_1.it)("allows all users when role is 'all'", function () {
            var account = __assign(__assign({}, mockAccount), { allowedRoles: ["all"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello" });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
            (0, vitest_1.expect)(result.matchKey).toBe("all");
        });
        (0, vitest_1.it)("handles moderator role", function () {
            var account = __assign(__assign({}, mockAccount), { allowedRoles: ["moderator"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", isMod: true });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
        (0, vitest_1.it)("handles subscriber role", function () {
            var account = __assign(__assign({}, mockAccount), { allowedRoles: ["subscriber"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", isSub: true });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
        (0, vitest_1.it)("handles owner role", function () {
            var account = __assign(__assign({}, mockAccount), { allowedRoles: ["owner"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", isOwner: true });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
        (0, vitest_1.it)("handles vip role", function () {
            var account = __assign(__assign({}, mockAccount), { allowedRoles: ["vip"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", isVip: true });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
        });
    });
    (0, vitest_1.describe)("combined restrictions", function () {
        (0, vitest_1.it)("checks requireMention before allowlist", function () {
            var account = __assign(__assign({}, mockAccount), { requireMention: true, allowFrom: ["123456"] });
            var message = __assign(__assign({}, mockMessage), { message: "hello" });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(false);
            (0, vitest_1.expect)(result.reason).toContain("does not mention the bot");
        });
        (0, vitest_1.it)("checks allowlist before allowedRoles", function () {
            var account = __assign(__assign({}, mockAccount), { allowFrom: ["123456"], allowedRoles: ["owner"] });
            var message = __assign(__assign({}, mockMessage), { message: "@testbot hello", isOwner: false });
            var result = (0, access_control_js_1.checkTwitchAccessControl)({
                message: message,
                account: account,
                botUsername: "testbot",
            });
            (0, vitest_1.expect)(result.allowed).toBe(true);
            (0, vitest_1.expect)(result.matchSource).toBe("allowlist");
        });
    });
});
(0, vitest_1.describe)("extractMentions", function () {
    (0, vitest_1.it)("extracts single mention", function () {
        var mentions = (0, access_control_js_1.extractMentions)("hello @testbot");
        (0, vitest_1.expect)(mentions).toEqual(["testbot"]);
    });
    (0, vitest_1.it)("extracts multiple mentions", function () {
        var mentions = (0, access_control_js_1.extractMentions)("hello @testbot and @otheruser");
        (0, vitest_1.expect)(mentions).toEqual(["testbot", "otheruser"]);
    });
    (0, vitest_1.it)("returns empty array when no mentions", function () {
        var mentions = (0, access_control_js_1.extractMentions)("hello everyone");
        (0, vitest_1.expect)(mentions).toEqual([]);
    });
    (0, vitest_1.it)("handles mentions at start of message", function () {
        var mentions = (0, access_control_js_1.extractMentions)("@testbot hello");
        (0, vitest_1.expect)(mentions).toEqual(["testbot"]);
    });
    (0, vitest_1.it)("handles mentions at end of message", function () {
        var mentions = (0, access_control_js_1.extractMentions)("hello @testbot");
        (0, vitest_1.expect)(mentions).toEqual(["testbot"]);
    });
    (0, vitest_1.it)("converts mentions to lowercase", function () {
        var mentions = (0, access_control_js_1.extractMentions)("hello @TestBot");
        (0, vitest_1.expect)(mentions).toEqual(["testbot"]);
    });
    (0, vitest_1.it)("extracts alphanumeric usernames", function () {
        var mentions = (0, access_control_js_1.extractMentions)("hello @user123");
        (0, vitest_1.expect)(mentions).toEqual(["user123"]);
    });
    (0, vitest_1.it)("handles underscores in usernames", function () {
        var mentions = (0, access_control_js_1.extractMentions)("hello @test_user");
        (0, vitest_1.expect)(mentions).toEqual(["test_user"]);
    });
    (0, vitest_1.it)("handles empty string", function () {
        var mentions = (0, access_control_js_1.extractMentions)("");
        (0, vitest_1.expect)(mentions).toEqual([]);
    });
});
