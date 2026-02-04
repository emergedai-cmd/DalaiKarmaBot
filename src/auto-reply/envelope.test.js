"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var envelope_js_1 = require("./envelope.js");
(0, vitest_1.describe)("formatAgentEnvelope", function () {
    (0, vitest_1.it)("includes channel, from, ip, host, and timestamp", function () {
        var originalTz = process.env.TZ;
        process.env.TZ = "UTC";
        var ts = Date.UTC(2025, 0, 2, 3, 4); // 2025-01-02T03:04:00Z
        var body = (0, envelope_js_1.formatAgentEnvelope)({
            channel: "WebChat",
            from: "user1",
            host: "mac-mini",
            ip: "10.0.0.5",
            timestamp: ts,
            envelope: { timezone: "utc" },
            body: "hello",
        });
        process.env.TZ = originalTz;
        (0, vitest_1.expect)(body).toBe("[WebChat user1 mac-mini 10.0.0.5 2025-01-02T03:04Z] hello");
    });
    (0, vitest_1.it)("formats timestamps in local timezone by default", function () {
        var originalTz = process.env.TZ;
        process.env.TZ = "America/Los_Angeles";
        var ts = Date.UTC(2025, 0, 2, 3, 4); // 2025-01-02T03:04:00Z
        var body = (0, envelope_js_1.formatAgentEnvelope)({
            channel: "WebChat",
            timestamp: ts,
            body: "hello",
        });
        process.env.TZ = originalTz;
        (0, vitest_1.expect)(body).toMatch(/\[WebChat 2025-01-01 19:04 [^\]]+\] hello/);
    });
    (0, vitest_1.it)("formats timestamps in UTC when configured", function () {
        var originalTz = process.env.TZ;
        process.env.TZ = "America/Los_Angeles";
        var ts = Date.UTC(2025, 0, 2, 3, 4); // 2025-01-02T03:04:00Z (19:04 PST)
        var body = (0, envelope_js_1.formatAgentEnvelope)({
            channel: "WebChat",
            timestamp: ts,
            envelope: { timezone: "utc" },
            body: "hello",
        });
        process.env.TZ = originalTz;
        (0, vitest_1.expect)(body).toBe("[WebChat 2025-01-02T03:04Z] hello");
    });
    (0, vitest_1.it)("formats timestamps in user timezone when configured", function () {
        var ts = Date.UTC(2025, 0, 2, 3, 4); // 2025-01-02T03:04:00Z (04:04 CET)
        var body = (0, envelope_js_1.formatAgentEnvelope)({
            channel: "WebChat",
            timestamp: ts,
            envelope: { timezone: "user", userTimezone: "Europe/Vienna" },
            body: "hello",
        });
        (0, vitest_1.expect)(body).toMatch(/\[WebChat 2025-01-02 04:04 [^\]]+\] hello/);
    });
    (0, vitest_1.it)("omits timestamps when configured", function () {
        var ts = Date.UTC(2025, 0, 2, 3, 4);
        var body = (0, envelope_js_1.formatAgentEnvelope)({
            channel: "WebChat",
            timestamp: ts,
            envelope: { includeTimestamp: false },
            body: "hello",
        });
        (0, vitest_1.expect)(body).toBe("[WebChat] hello");
    });
    (0, vitest_1.it)("handles missing optional fields", function () {
        var body = (0, envelope_js_1.formatAgentEnvelope)({ channel: "Telegram", body: "hi" });
        (0, vitest_1.expect)(body).toBe("[Telegram] hi");
    });
});
(0, vitest_1.describe)("formatInboundEnvelope", function () {
    (0, vitest_1.it)("prefixes sender for non-direct chats", function () {
        var body = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "Discord",
            from: "Guild #general",
            body: "hi",
            chatType: "channel",
            senderLabel: "Alice",
        });
        (0, vitest_1.expect)(body).toBe("[Discord Guild #general] Alice: hi");
    });
    (0, vitest_1.it)("uses sender fields when senderLabel is missing", function () {
        var body = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "Signal",
            from: "Signal Group id:123",
            body: "ping",
            chatType: "group",
            sender: { name: "Bob", id: "42" },
        });
        (0, vitest_1.expect)(body).toBe("[Signal Signal Group id:123] Bob (42): ping");
    });
    (0, vitest_1.it)("keeps direct messages unprefixed", function () {
        var body = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "iMessage",
            from: "+1555",
            body: "hello",
            chatType: "direct",
            senderLabel: "Alice",
        });
        (0, vitest_1.expect)(body).toBe("[iMessage +1555] hello");
    });
    (0, vitest_1.it)("includes elapsed time when previousTimestamp is provided", function () {
        var now = Date.now();
        var twoMinutesAgo = now - 2 * 60 * 1000;
        var body = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "Telegram",
            from: "Alice",
            body: "follow-up message",
            timestamp: now,
            previousTimestamp: twoMinutesAgo,
            chatType: "direct",
            envelope: { includeTimestamp: false },
        });
        (0, vitest_1.expect)(body).toContain("Alice +2m");
        (0, vitest_1.expect)(body).toContain("follow-up message");
    });
    (0, vitest_1.it)("omits elapsed time when disabled", function () {
        var now = Date.now();
        var body = (0, envelope_js_1.formatInboundEnvelope)({
            channel: "Telegram",
            from: "Alice",
            body: "follow-up message",
            timestamp: now,
            previousTimestamp: now - 2 * 60 * 1000,
            chatType: "direct",
            envelope: { includeElapsed: false, includeTimestamp: false },
        });
        (0, vitest_1.expect)(body).toBe("[Telegram Alice] follow-up message");
    });
    (0, vitest_1.it)("resolves envelope options from config", function () {
        var options = (0, envelope_js_1.resolveEnvelopeFormatOptions)({
            agents: {
                defaults: {
                    envelopeTimezone: "user",
                    envelopeTimestamp: "off",
                    envelopeElapsed: "off",
                    userTimezone: "Europe/Vienna",
                },
            },
        });
        (0, vitest_1.expect)(options).toEqual({
            timezone: "user",
            includeTimestamp: false,
            includeElapsed: false,
            userTimezone: "Europe/Vienna",
        });
    });
});
