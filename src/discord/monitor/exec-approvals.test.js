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
var exec_approvals_js_1 = require("./exec-approvals.js");
(0, vitest_1.describe)("buildExecApprovalCustomId", function () {
    (0, vitest_1.it)("encodes approval id and action", function () {
        var customId = (0, exec_approvals_js_1.buildExecApprovalCustomId)("abc-123", "allow-once");
        (0, vitest_1.expect)(customId).toBe("execapproval:id=abc-123;action=allow-once");
    });
    (0, vitest_1.it)("encodes special characters in approval id", function () {
        var customId = (0, exec_approvals_js_1.buildExecApprovalCustomId)("abc=123;test", "deny");
        (0, vitest_1.expect)(customId).toBe("execapproval:id=abc%3D123%3Btest;action=deny");
    });
});
(0, vitest_1.describe)("parseExecApprovalData", function () {
    (0, vitest_1.it)("parses valid data", function () {
        var result = (0, exec_approvals_js_1.parseExecApprovalData)({ id: "abc-123", action: "allow-once" });
        (0, vitest_1.expect)(result).toEqual({ approvalId: "abc-123", action: "allow-once" });
    });
    (0, vitest_1.it)("parses encoded data", function () {
        var result = (0, exec_approvals_js_1.parseExecApprovalData)({
            id: "abc%3D123%3Btest",
            action: "allow-always",
        });
        (0, vitest_1.expect)(result).toEqual({ approvalId: "abc=123;test", action: "allow-always" });
    });
    (0, vitest_1.it)("rejects invalid action", function () {
        var result = (0, exec_approvals_js_1.parseExecApprovalData)({ id: "abc-123", action: "invalid" });
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.it)("rejects missing id", function () {
        var result = (0, exec_approvals_js_1.parseExecApprovalData)({ action: "deny" });
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.it)("rejects missing action", function () {
        var result = (0, exec_approvals_js_1.parseExecApprovalData)({ id: "abc-123" });
        (0, vitest_1.expect)(result).toBeNull();
    });
    (0, vitest_1.it)("rejects null/undefined input", function () {
        // oxlint-disable-next-line typescript/no-explicit-any
        (0, vitest_1.expect)((0, exec_approvals_js_1.parseExecApprovalData)(null)).toBeNull();
        // oxlint-disable-next-line typescript/no-explicit-any
        (0, vitest_1.expect)((0, exec_approvals_js_1.parseExecApprovalData)(undefined)).toBeNull();
    });
    (0, vitest_1.it)("accepts all valid actions", function () {
        var _a, _b, _c;
        (0, vitest_1.expect)((_a = (0, exec_approvals_js_1.parseExecApprovalData)({ id: "x", action: "allow-once" })) === null || _a === void 0 ? void 0 : _a.action).toBe("allow-once");
        (0, vitest_1.expect)((_b = (0, exec_approvals_js_1.parseExecApprovalData)({ id: "x", action: "allow-always" })) === null || _b === void 0 ? void 0 : _b.action).toBe("allow-always");
        (0, vitest_1.expect)((_c = (0, exec_approvals_js_1.parseExecApprovalData)({ id: "x", action: "deny" })) === null || _c === void 0 ? void 0 : _c.action).toBe("deny");
    });
});
(0, vitest_1.describe)("roundtrip encoding", function () {
    (0, vitest_1.it)("encodes and decodes correctly", function () {
        var approvalId = "test-approval-with=special;chars&more";
        var action = "allow-always";
        var customId = (0, exec_approvals_js_1.buildExecApprovalCustomId)(approvalId, action);
        // Parse the key=value pairs from the custom ID
        var parts = customId.split(";");
        var data = {};
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            var match = part.match(/^([^:]+:)?([^=]+)=(.+)$/);
            if (match) {
                data[match[2]] = match[3];
            }
        }
        var result = (0, exec_approvals_js_1.parseExecApprovalData)(data);
        (0, vitest_1.expect)(result).toEqual({ approvalId: approvalId, action: action });
    });
});
(0, vitest_1.describe)("DiscordExecApprovalHandler.shouldHandle", function () {
    function createHandler(config) {
        return new exec_approvals_js_1.DiscordExecApprovalHandler({
            token: "test-token",
            accountId: "default",
            config: config,
            cfg: {},
        });
    }
    function createRequest(overrides) {
        if (overrides === void 0) { overrides = {}; }
        return {
            id: "test-id",
            request: __assign({ command: "echo hello", cwd: "/home/user", host: "gateway", agentId: "test-agent", sessionKey: "agent:test-agent:discord:123" }, overrides),
            createdAtMs: Date.now(),
            expiresAtMs: Date.now() + 60000,
        };
    }
    (0, vitest_1.it)("returns false when disabled", function () {
        var handler = createHandler({ enabled: false, approvers: ["123"] });
        (0, vitest_1.expect)(handler.shouldHandle(createRequest())).toBe(false);
    });
    (0, vitest_1.it)("returns false when no approvers", function () {
        var handler = createHandler({ enabled: true, approvers: [] });
        (0, vitest_1.expect)(handler.shouldHandle(createRequest())).toBe(false);
    });
    (0, vitest_1.it)("returns true with minimal config", function () {
        var handler = createHandler({ enabled: true, approvers: ["123"] });
        (0, vitest_1.expect)(handler.shouldHandle(createRequest())).toBe(true);
    });
    (0, vitest_1.it)("filters by agent ID", function () {
        var handler = createHandler({
            enabled: true,
            approvers: ["123"],
            agentFilter: ["allowed-agent"],
        });
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({ agentId: "allowed-agent" }))).toBe(true);
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({ agentId: "other-agent" }))).toBe(false);
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({ agentId: null }))).toBe(false);
    });
    (0, vitest_1.it)("filters by session key substring", function () {
        var handler = createHandler({
            enabled: true,
            approvers: ["123"],
            sessionFilter: ["discord"],
        });
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({ sessionKey: "agent:test:discord:123" }))).toBe(true);
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({ sessionKey: "agent:test:telegram:123" }))).toBe(false);
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({ sessionKey: null }))).toBe(false);
    });
    (0, vitest_1.it)("filters by session key regex", function () {
        var handler = createHandler({
            enabled: true,
            approvers: ["123"],
            sessionFilter: ["^agent:.*:discord:"],
        });
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({ sessionKey: "agent:test:discord:123" }))).toBe(true);
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({ sessionKey: "other:test:discord:123" }))).toBe(false);
    });
    (0, vitest_1.it)("combines agent and session filters", function () {
        var handler = createHandler({
            enabled: true,
            approvers: ["123"],
            agentFilter: ["my-agent"],
            sessionFilter: ["discord"],
        });
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({
            agentId: "my-agent",
            sessionKey: "agent:my-agent:discord:123",
        }))).toBe(true);
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({
            agentId: "other-agent",
            sessionKey: "agent:other:discord:123",
        }))).toBe(false);
        (0, vitest_1.expect)(handler.shouldHandle(createRequest({
            agentId: "my-agent",
            sessionKey: "agent:my-agent:telegram:123",
        }))).toBe(false);
    });
});
