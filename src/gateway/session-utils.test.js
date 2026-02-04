"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var session_utils_js_1 = require("./session-utils.js");
(0, vitest_1.describe)("gateway session utils", function () {
    (0, vitest_1.test)("capArrayByJsonBytes trims from the front", function () {
        var res = (0, session_utils_js_1.capArrayByJsonBytes)(["a", "b", "c"], 10);
        (0, vitest_1.expect)(res.items).toEqual(["b", "c"]);
    });
    (0, vitest_1.test)("parseGroupKey handles group keys", function () {
        (0, vitest_1.expect)((0, session_utils_js_1.parseGroupKey)("discord:group:dev")).toEqual({
            channel: "discord",
            kind: "group",
            id: "dev",
        });
        (0, vitest_1.expect)((0, session_utils_js_1.parseGroupKey)("agent:ops:discord:group:dev")).toEqual({
            channel: "discord",
            kind: "group",
            id: "dev",
        });
        (0, vitest_1.expect)((0, session_utils_js_1.parseGroupKey)("foo:bar")).toBeNull();
    });
    (0, vitest_1.test)("classifySessionKey respects chat type + prefixes", function () {
        (0, vitest_1.expect)((0, session_utils_js_1.classifySessionKey)("global")).toBe("global");
        (0, vitest_1.expect)((0, session_utils_js_1.classifySessionKey)("unknown")).toBe("unknown");
        (0, vitest_1.expect)((0, session_utils_js_1.classifySessionKey)("discord:group:dev")).toBe("group");
        (0, vitest_1.expect)((0, session_utils_js_1.classifySessionKey)("main")).toBe("direct");
        var entry = { chatType: "group" };
        (0, vitest_1.expect)((0, session_utils_js_1.classifySessionKey)("main", entry)).toBe("group");
    });
    (0, vitest_1.test)("resolveSessionStoreKey maps main aliases to default agent main", function () {
        var cfg = {
            session: { mainKey: "work" },
            agents: { list: [{ id: "ops", default: true }] },
        };
        (0, vitest_1.expect)((0, session_utils_js_1.resolveSessionStoreKey)({ cfg: cfg, sessionKey: "main" })).toBe("agent:ops:work");
        (0, vitest_1.expect)((0, session_utils_js_1.resolveSessionStoreKey)({ cfg: cfg, sessionKey: "work" })).toBe("agent:ops:work");
        (0, vitest_1.expect)((0, session_utils_js_1.resolveSessionStoreKey)({ cfg: cfg, sessionKey: "agent:ops:main" })).toBe("agent:ops:work");
    });
    (0, vitest_1.test)("resolveSessionStoreKey canonicalizes bare keys to default agent", function () {
        var cfg = {
            session: { mainKey: "main" },
            agents: { list: [{ id: "ops", default: true }] },
        };
        (0, vitest_1.expect)((0, session_utils_js_1.resolveSessionStoreKey)({ cfg: cfg, sessionKey: "discord:group:123" })).toBe("agent:ops:discord:group:123");
        (0, vitest_1.expect)((0, session_utils_js_1.resolveSessionStoreKey)({ cfg: cfg, sessionKey: "agent:alpha:main" })).toBe("agent:alpha:main");
    });
    (0, vitest_1.test)("resolveSessionStoreKey honors global scope", function () {
        var cfg = {
            session: { scope: "global", mainKey: "work" },
            agents: { list: [{ id: "ops", default: true }] },
        };
        (0, vitest_1.expect)((0, session_utils_js_1.resolveSessionStoreKey)({ cfg: cfg, sessionKey: "main" })).toBe("global");
        var target = (0, session_utils_js_1.resolveGatewaySessionStoreTarget)({ cfg: cfg, key: "main" });
        (0, vitest_1.expect)(target.canonicalKey).toBe("global");
        (0, vitest_1.expect)(target.agentId).toBe("ops");
    });
    (0, vitest_1.test)("resolveGatewaySessionStoreTarget uses canonical key for main alias", function () {
        var storeTemplate = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-session-utils", "{agentId}", "sessions.json");
        var cfg = {
            session: { mainKey: "main", store: storeTemplate },
            agents: { list: [{ id: "ops", default: true }] },
        };
        var target = (0, session_utils_js_1.resolveGatewaySessionStoreTarget)({ cfg: cfg, key: "main" });
        (0, vitest_1.expect)(target.canonicalKey).toBe("agent:ops:main");
        (0, vitest_1.expect)(target.storeKeys).toEqual(vitest_1.expect.arrayContaining(["agent:ops:main", "main"]));
        (0, vitest_1.expect)(target.storePath).toBe(node_path_1.default.resolve(storeTemplate.replace("{agentId}", "ops")));
    });
});
(0, vitest_1.describe)("deriveSessionTitle", function () {
    (0, vitest_1.test)("returns undefined for undefined entry", function () {
        (0, vitest_1.expect)((0, session_utils_js_1.deriveSessionTitle)(undefined)).toBeUndefined();
    });
    (0, vitest_1.test)("prefers displayName when set", function () {
        var entry = {
            sessionId: "abc123",
            updatedAt: Date.now(),
            displayName: "My Custom Session",
            subject: "Group Chat",
        };
        (0, vitest_1.expect)((0, session_utils_js_1.deriveSessionTitle)(entry)).toBe("My Custom Session");
    });
    (0, vitest_1.test)("falls back to subject when displayName is missing", function () {
        var entry = {
            sessionId: "abc123",
            updatedAt: Date.now(),
            subject: "Dev Team Chat",
        };
        (0, vitest_1.expect)((0, session_utils_js_1.deriveSessionTitle)(entry)).toBe("Dev Team Chat");
    });
    (0, vitest_1.test)("uses first user message when displayName and subject missing", function () {
        var entry = {
            sessionId: "abc123",
            updatedAt: Date.now(),
        };
        (0, vitest_1.expect)((0, session_utils_js_1.deriveSessionTitle)(entry, "Hello, how are you?")).toBe("Hello, how are you?");
    });
    (0, vitest_1.test)("truncates long first user message to 60 chars with ellipsis", function () {
        var entry = {
            sessionId: "abc123",
            updatedAt: Date.now(),
        };
        var longMsg = "This is a very long message that exceeds sixty characters and should be truncated appropriately";
        var result = (0, session_utils_js_1.deriveSessionTitle)(entry, longMsg);
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result.length).toBeLessThanOrEqual(60);
        (0, vitest_1.expect)(result.endsWith("…")).toBe(true);
    });
    (0, vitest_1.test)("truncates at word boundary when possible", function () {
        var entry = {
            sessionId: "abc123",
            updatedAt: Date.now(),
        };
        var longMsg = "This message has many words and should be truncated at a word boundary nicely";
        var result = (0, session_utils_js_1.deriveSessionTitle)(entry, longMsg);
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result.endsWith("…")).toBe(true);
        (0, vitest_1.expect)(result.includes("  ")).toBe(false);
    });
    (0, vitest_1.test)("falls back to sessionId prefix with date", function () {
        var entry = {
            sessionId: "abcd1234-5678-90ef-ghij-klmnopqrstuv",
            updatedAt: new Date("2024-03-15T10:30:00Z").getTime(),
        };
        var result = (0, session_utils_js_1.deriveSessionTitle)(entry);
        (0, vitest_1.expect)(result).toBe("abcd1234 (2024-03-15)");
    });
    (0, vitest_1.test)("falls back to sessionId prefix without date when updatedAt missing", function () {
        var entry = {
            sessionId: "abcd1234-5678-90ef-ghij-klmnopqrstuv",
            updatedAt: 0,
        };
        var result = (0, session_utils_js_1.deriveSessionTitle)(entry);
        (0, vitest_1.expect)(result).toBe("abcd1234");
    });
    (0, vitest_1.test)("trims whitespace from displayName", function () {
        var entry = {
            sessionId: "abc123",
            updatedAt: Date.now(),
            displayName: "  Padded Name  ",
        };
        (0, vitest_1.expect)((0, session_utils_js_1.deriveSessionTitle)(entry)).toBe("Padded Name");
    });
    (0, vitest_1.test)("ignores empty displayName and falls through", function () {
        var entry = {
            sessionId: "abc123",
            updatedAt: Date.now(),
            displayName: "   ",
            subject: "Actual Subject",
        };
        (0, vitest_1.expect)((0, session_utils_js_1.deriveSessionTitle)(entry)).toBe("Actual Subject");
    });
});
(0, vitest_1.describe)("listSessionsFromStore search", function () {
    var baseCfg = {
        session: { mainKey: "main" },
        agents: { list: [{ id: "main", default: true }] },
    };
    var makeStore = function () { return ({
        "agent:main:work-project": {
            sessionId: "sess-work-1",
            updatedAt: Date.now(),
            displayName: "Work Project Alpha",
            label: "work",
        },
        "agent:main:personal-chat": {
            sessionId: "sess-personal-1",
            updatedAt: Date.now() - 1000,
            displayName: "Personal Chat",
            subject: "Family Reunion Planning",
        },
        "agent:main:discord:group:dev-team": {
            sessionId: "sess-discord-1",
            updatedAt: Date.now() - 2000,
            label: "discord",
            subject: "Dev Team Discussion",
        },
    }); };
    (0, vitest_1.test)("returns all sessions when search is empty", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: { search: "" },
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(3);
    });
    (0, vitest_1.test)("returns all sessions when search is undefined", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: {},
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(3);
    });
    (0, vitest_1.test)("filters by displayName case-insensitively", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: { search: "WORK PROJECT" },
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(1);
        (0, vitest_1.expect)(result.sessions[0].displayName).toBe("Work Project Alpha");
    });
    (0, vitest_1.test)("filters by subject", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: { search: "reunion" },
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(1);
        (0, vitest_1.expect)(result.sessions[0].subject).toBe("Family Reunion Planning");
    });
    (0, vitest_1.test)("filters by label", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: { search: "discord" },
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(1);
        (0, vitest_1.expect)(result.sessions[0].label).toBe("discord");
    });
    (0, vitest_1.test)("filters by sessionId", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: { search: "sess-personal" },
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(1);
        (0, vitest_1.expect)(result.sessions[0].sessionId).toBe("sess-personal-1");
    });
    (0, vitest_1.test)("filters by key", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: { search: "dev-team" },
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(1);
        (0, vitest_1.expect)(result.sessions[0].key).toBe("agent:main:discord:group:dev-team");
    });
    (0, vitest_1.test)("returns empty array when no matches", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: { search: "nonexistent-term" },
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(0);
    });
    (0, vitest_1.test)("matches partial strings", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: { search: "alpha" },
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(1);
        (0, vitest_1.expect)(result.sessions[0].displayName).toBe("Work Project Alpha");
    });
    (0, vitest_1.test)("trims whitespace from search query", function () {
        var store = makeStore();
        var result = (0, session_utils_js_1.listSessionsFromStore)({
            cfg: baseCfg,
            storePath: "/tmp/sessions.json",
            store: store,
            opts: { search: "  personal  " },
        });
        (0, vitest_1.expect)(result.sessions.length).toBe(1);
    });
});
