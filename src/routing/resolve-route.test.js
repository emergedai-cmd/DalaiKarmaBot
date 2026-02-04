"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var resolve_route_js_1 = require("./resolve-route.js");
(0, vitest_1.describe)("resolveAgentRoute", function () {
    (0, vitest_1.test)("defaults to main/default when no bindings exist", function () {
        var cfg = {};
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "whatsapp",
            accountId: null,
            peer: { kind: "dm", id: "+15551234567" },
        });
        (0, vitest_1.expect)(route.agentId).toBe("main");
        (0, vitest_1.expect)(route.accountId).toBe("default");
        (0, vitest_1.expect)(route.sessionKey).toBe("agent:main:main");
        (0, vitest_1.expect)(route.matchedBy).toBe("default");
    });
    (0, vitest_1.test)("dmScope=per-peer isolates DM sessions by sender id", function () {
        var cfg = {
            session: { dmScope: "per-peer" },
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "whatsapp",
            accountId: null,
            peer: { kind: "dm", id: "+15551234567" },
        });
        (0, vitest_1.expect)(route.sessionKey).toBe("agent:main:dm:+15551234567");
    });
    (0, vitest_1.test)("dmScope=per-channel-peer isolates DM sessions per channel and sender", function () {
        var cfg = {
            session: { dmScope: "per-channel-peer" },
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "whatsapp",
            accountId: null,
            peer: { kind: "dm", id: "+15551234567" },
        });
        (0, vitest_1.expect)(route.sessionKey).toBe("agent:main:whatsapp:dm:+15551234567");
    });
    (0, vitest_1.test)("identityLinks collapses per-peer DM sessions across providers", function () {
        var cfg = {
            session: {
                dmScope: "per-peer",
                identityLinks: {
                    alice: ["telegram:111111111", "discord:222222222222222222"],
                },
            },
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "telegram",
            accountId: null,
            peer: { kind: "dm", id: "111111111" },
        });
        (0, vitest_1.expect)(route.sessionKey).toBe("agent:main:dm:alice");
    });
    (0, vitest_1.test)("identityLinks applies to per-channel-peer DM sessions", function () {
        var cfg = {
            session: {
                dmScope: "per-channel-peer",
                identityLinks: {
                    alice: ["telegram:111111111", "discord:222222222222222222"],
                },
            },
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            accountId: null,
            peer: { kind: "dm", id: "222222222222222222" },
        });
        (0, vitest_1.expect)(route.sessionKey).toBe("agent:main:discord:dm:alice");
    });
    (0, vitest_1.test)("peer binding wins over account binding", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "a",
                    match: {
                        channel: "whatsapp",
                        accountId: "biz",
                        peer: { kind: "dm", id: "+1000" },
                    },
                },
                {
                    agentId: "b",
                    match: { channel: "whatsapp", accountId: "biz" },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "whatsapp",
            accountId: "biz",
            peer: { kind: "dm", id: "+1000" },
        });
        (0, vitest_1.expect)(route.agentId).toBe("a");
        (0, vitest_1.expect)(route.sessionKey).toBe("agent:a:main");
        (0, vitest_1.expect)(route.matchedBy).toBe("binding.peer");
    });
    (0, vitest_1.test)("discord channel peer binding wins over guild binding", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "chan",
                    match: {
                        channel: "discord",
                        accountId: "default",
                        peer: { kind: "channel", id: "c1" },
                    },
                },
                {
                    agentId: "guild",
                    match: {
                        channel: "discord",
                        accountId: "default",
                        guildId: "g1",
                    },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            accountId: "default",
            peer: { kind: "channel", id: "c1" },
            guildId: "g1",
        });
        (0, vitest_1.expect)(route.agentId).toBe("chan");
        (0, vitest_1.expect)(route.sessionKey).toBe("agent:chan:discord:channel:c1");
        (0, vitest_1.expect)(route.matchedBy).toBe("binding.peer");
    });
    (0, vitest_1.test)("guild binding wins over account binding when peer not bound", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "guild",
                    match: {
                        channel: "discord",
                        accountId: "default",
                        guildId: "g1",
                    },
                },
                {
                    agentId: "acct",
                    match: { channel: "discord", accountId: "default" },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            accountId: "default",
            peer: { kind: "channel", id: "c1" },
            guildId: "g1",
        });
        (0, vitest_1.expect)(route.agentId).toBe("guild");
        (0, vitest_1.expect)(route.matchedBy).toBe("binding.guild");
    });
    (0, vitest_1.test)("missing accountId in binding matches default account only", function () {
        var cfg = {
            bindings: [{ agentId: "defaultAcct", match: { channel: "whatsapp" } }],
        };
        var defaultRoute = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "whatsapp",
            accountId: undefined,
            peer: { kind: "dm", id: "+1000" },
        });
        (0, vitest_1.expect)(defaultRoute.agentId).toBe("defaultacct");
        (0, vitest_1.expect)(defaultRoute.matchedBy).toBe("binding.account");
        var otherRoute = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "whatsapp",
            accountId: "biz",
            peer: { kind: "dm", id: "+1000" },
        });
        (0, vitest_1.expect)(otherRoute.agentId).toBe("main");
    });
    (0, vitest_1.test)("accountId=* matches any account as a channel fallback", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "any",
                    match: { channel: "whatsapp", accountId: "*" },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "whatsapp",
            accountId: "biz",
            peer: { kind: "dm", id: "+1000" },
        });
        (0, vitest_1.expect)(route.agentId).toBe("any");
        (0, vitest_1.expect)(route.matchedBy).toBe("binding.channel");
    });
    (0, vitest_1.test)("defaultAgentId is used when no binding matches", function () {
        var cfg = {
            agents: {
                list: [{ id: "home", default: true, workspace: "~/openclaw-home" }],
            },
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "whatsapp",
            accountId: "biz",
            peer: { kind: "dm", id: "+1000" },
        });
        (0, vitest_1.expect)(route.agentId).toBe("home");
        (0, vitest_1.expect)(route.sessionKey).toBe("agent:home:main");
    });
});
(0, vitest_1.test)("dmScope=per-account-channel-peer isolates DM sessions per account, channel and sender", function () {
    var cfg = {
        session: { dmScope: "per-account-channel-peer" },
    };
    var route = (0, resolve_route_js_1.resolveAgentRoute)({
        cfg: cfg,
        channel: "telegram",
        accountId: "tasks",
        peer: { kind: "dm", id: "7550356539" },
    });
    (0, vitest_1.expect)(route.sessionKey).toBe("agent:main:telegram:tasks:dm:7550356539");
});
(0, vitest_1.test)("dmScope=per-account-channel-peer uses default accountId when not provided", function () {
    var cfg = {
        session: { dmScope: "per-account-channel-peer" },
    };
    var route = (0, resolve_route_js_1.resolveAgentRoute)({
        cfg: cfg,
        channel: "telegram",
        accountId: null,
        peer: { kind: "dm", id: "7550356539" },
    });
    (0, vitest_1.expect)(route.sessionKey).toBe("agent:main:telegram:default:dm:7550356539");
});
(0, vitest_1.describe)("parentPeer binding inheritance (thread support)", function () {
    (0, vitest_1.test)("thread inherits binding from parent channel when no direct match", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "adecco",
                    match: {
                        channel: "discord",
                        peer: { kind: "channel", id: "parent-channel-123" },
                    },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            peer: { kind: "channel", id: "thread-456" },
            parentPeer: { kind: "channel", id: "parent-channel-123" },
        });
        (0, vitest_1.expect)(route.agentId).toBe("adecco");
        (0, vitest_1.expect)(route.matchedBy).toBe("binding.peer.parent");
    });
    (0, vitest_1.test)("direct peer binding wins over parent peer binding", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "thread-agent",
                    match: {
                        channel: "discord",
                        peer: { kind: "channel", id: "thread-456" },
                    },
                },
                {
                    agentId: "parent-agent",
                    match: {
                        channel: "discord",
                        peer: { kind: "channel", id: "parent-channel-123" },
                    },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            peer: { kind: "channel", id: "thread-456" },
            parentPeer: { kind: "channel", id: "parent-channel-123" },
        });
        (0, vitest_1.expect)(route.agentId).toBe("thread-agent");
        (0, vitest_1.expect)(route.matchedBy).toBe("binding.peer");
    });
    (0, vitest_1.test)("parent peer binding wins over guild binding", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "parent-agent",
                    match: {
                        channel: "discord",
                        peer: { kind: "channel", id: "parent-channel-123" },
                    },
                },
                {
                    agentId: "guild-agent",
                    match: {
                        channel: "discord",
                        guildId: "guild-789",
                    },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            peer: { kind: "channel", id: "thread-456" },
            parentPeer: { kind: "channel", id: "parent-channel-123" },
            guildId: "guild-789",
        });
        (0, vitest_1.expect)(route.agentId).toBe("parent-agent");
        (0, vitest_1.expect)(route.matchedBy).toBe("binding.peer.parent");
    });
    (0, vitest_1.test)("falls back to guild binding when no parent peer match", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "other-parent-agent",
                    match: {
                        channel: "discord",
                        peer: { kind: "channel", id: "other-parent-999" },
                    },
                },
                {
                    agentId: "guild-agent",
                    match: {
                        channel: "discord",
                        guildId: "guild-789",
                    },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            peer: { kind: "channel", id: "thread-456" },
            parentPeer: { kind: "channel", id: "parent-channel-123" },
            guildId: "guild-789",
        });
        (0, vitest_1.expect)(route.agentId).toBe("guild-agent");
        (0, vitest_1.expect)(route.matchedBy).toBe("binding.guild");
    });
    (0, vitest_1.test)("parentPeer with empty id is ignored", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "parent-agent",
                    match: {
                        channel: "discord",
                        peer: { kind: "channel", id: "parent-channel-123" },
                    },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            peer: { kind: "channel", id: "thread-456" },
            parentPeer: { kind: "channel", id: "" },
        });
        (0, vitest_1.expect)(route.agentId).toBe("main");
        (0, vitest_1.expect)(route.matchedBy).toBe("default");
    });
    (0, vitest_1.test)("null parentPeer is handled gracefully", function () {
        var cfg = {
            bindings: [
                {
                    agentId: "parent-agent",
                    match: {
                        channel: "discord",
                        peer: { kind: "channel", id: "parent-channel-123" },
                    },
                },
            ],
        };
        var route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            peer: { kind: "channel", id: "thread-456" },
            parentPeer: null,
        });
        (0, vitest_1.expect)(route.agentId).toBe("main");
        (0, vitest_1.expect)(route.matchedBy).toBe("default");
    });
});
