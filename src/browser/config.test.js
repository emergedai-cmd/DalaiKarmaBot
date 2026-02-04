"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
(0, vitest_1.describe)("browser config", function () {
    (0, vitest_1.it)("defaults to enabled with loopback defaults and lobster-orange color", function () {
        var resolved = (0, config_js_1.resolveBrowserConfig)(undefined);
        (0, vitest_1.expect)(resolved.enabled).toBe(true);
        (0, vitest_1.expect)(resolved.controlPort).toBe(18791);
        (0, vitest_1.expect)(resolved.color).toBe("#FF4500");
        (0, vitest_1.expect)((0, config_js_1.shouldStartLocalBrowserServer)(resolved)).toBe(true);
        (0, vitest_1.expect)(resolved.cdpHost).toBe("127.0.0.1");
        (0, vitest_1.expect)(resolved.cdpProtocol).toBe("http");
        var profile = (0, config_js_1.resolveProfile)(resolved, resolved.defaultProfile);
        (0, vitest_1.expect)(profile === null || profile === void 0 ? void 0 : profile.name).toBe("chrome");
        (0, vitest_1.expect)(profile === null || profile === void 0 ? void 0 : profile.driver).toBe("extension");
        (0, vitest_1.expect)(profile === null || profile === void 0 ? void 0 : profile.cdpPort).toBe(18792);
        (0, vitest_1.expect)(profile === null || profile === void 0 ? void 0 : profile.cdpUrl).toBe("http://127.0.0.1:18792");
        var openclaw = (0, config_js_1.resolveProfile)(resolved, "openclaw");
        (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.driver).toBe("openclaw");
        (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.cdpPort).toBe(18800);
        (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.cdpUrl).toBe("http://127.0.0.1:18800");
        (0, vitest_1.expect)(resolved.remoteCdpTimeoutMs).toBe(1500);
        (0, vitest_1.expect)(resolved.remoteCdpHandshakeTimeoutMs).toBe(3000);
    });
    (0, vitest_1.it)("derives default ports from OPENCLAW_GATEWAY_PORT when unset", function () {
        var prev = process.env.OPENCLAW_GATEWAY_PORT;
        process.env.OPENCLAW_GATEWAY_PORT = "19001";
        try {
            var resolved = (0, config_js_1.resolveBrowserConfig)(undefined);
            (0, vitest_1.expect)(resolved.controlPort).toBe(19003);
            var chrome = (0, config_js_1.resolveProfile)(resolved, "chrome");
            (0, vitest_1.expect)(chrome === null || chrome === void 0 ? void 0 : chrome.driver).toBe("extension");
            (0, vitest_1.expect)(chrome === null || chrome === void 0 ? void 0 : chrome.cdpPort).toBe(19004);
            (0, vitest_1.expect)(chrome === null || chrome === void 0 ? void 0 : chrome.cdpUrl).toBe("http://127.0.0.1:19004");
            var openclaw = (0, config_js_1.resolveProfile)(resolved, "openclaw");
            (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.cdpPort).toBe(19012);
            (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.cdpUrl).toBe("http://127.0.0.1:19012");
        }
        finally {
            if (prev === undefined) {
                delete process.env.OPENCLAW_GATEWAY_PORT;
            }
            else {
                process.env.OPENCLAW_GATEWAY_PORT = prev;
            }
        }
    });
    (0, vitest_1.it)("derives default ports from gateway.port when env is unset", function () {
        var prev = process.env.OPENCLAW_GATEWAY_PORT;
        delete process.env.OPENCLAW_GATEWAY_PORT;
        try {
            var resolved = (0, config_js_1.resolveBrowserConfig)(undefined, { gateway: { port: 19011 } });
            (0, vitest_1.expect)(resolved.controlPort).toBe(19013);
            var chrome = (0, config_js_1.resolveProfile)(resolved, "chrome");
            (0, vitest_1.expect)(chrome === null || chrome === void 0 ? void 0 : chrome.driver).toBe("extension");
            (0, vitest_1.expect)(chrome === null || chrome === void 0 ? void 0 : chrome.cdpPort).toBe(19014);
            (0, vitest_1.expect)(chrome === null || chrome === void 0 ? void 0 : chrome.cdpUrl).toBe("http://127.0.0.1:19014");
            var openclaw = (0, config_js_1.resolveProfile)(resolved, "openclaw");
            (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.cdpPort).toBe(19022);
            (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.cdpUrl).toBe("http://127.0.0.1:19022");
        }
        finally {
            if (prev === undefined) {
                delete process.env.OPENCLAW_GATEWAY_PORT;
            }
            else {
                process.env.OPENCLAW_GATEWAY_PORT = prev;
            }
        }
    });
    (0, vitest_1.it)("normalizes hex colors", function () {
        var resolved = (0, config_js_1.resolveBrowserConfig)({
            color: "ff4500",
        });
        (0, vitest_1.expect)(resolved.color).toBe("#FF4500");
    });
    (0, vitest_1.it)("supports custom remote CDP timeouts", function () {
        var resolved = (0, config_js_1.resolveBrowserConfig)({
            remoteCdpTimeoutMs: 2200,
            remoteCdpHandshakeTimeoutMs: 5000,
        });
        (0, vitest_1.expect)(resolved.remoteCdpTimeoutMs).toBe(2200);
        (0, vitest_1.expect)(resolved.remoteCdpHandshakeTimeoutMs).toBe(5000);
    });
    (0, vitest_1.it)("falls back to default color for invalid hex", function () {
        var resolved = (0, config_js_1.resolveBrowserConfig)({
            color: "#GGGGGG",
        });
        (0, vitest_1.expect)(resolved.color).toBe("#FF4500");
    });
    (0, vitest_1.it)("treats non-loopback cdpUrl as remote", function () {
        var resolved = (0, config_js_1.resolveBrowserConfig)({
            cdpUrl: "http://example.com:9222",
        });
        var profile = (0, config_js_1.resolveProfile)(resolved, "openclaw");
        (0, vitest_1.expect)(profile === null || profile === void 0 ? void 0 : profile.cdpIsLoopback).toBe(false);
    });
    (0, vitest_1.it)("supports explicit CDP URLs for the default profile", function () {
        var resolved = (0, config_js_1.resolveBrowserConfig)({
            cdpUrl: "http://example.com:9222",
        });
        var profile = (0, config_js_1.resolveProfile)(resolved, "openclaw");
        (0, vitest_1.expect)(profile === null || profile === void 0 ? void 0 : profile.cdpPort).toBe(9222);
        (0, vitest_1.expect)(profile === null || profile === void 0 ? void 0 : profile.cdpUrl).toBe("http://example.com:9222");
        (0, vitest_1.expect)(profile === null || profile === void 0 ? void 0 : profile.cdpIsLoopback).toBe(false);
    });
    (0, vitest_1.it)("uses profile cdpUrl when provided", function () {
        var resolved = (0, config_js_1.resolveBrowserConfig)({
            profiles: {
                remote: { cdpUrl: "http://10.0.0.42:9222", color: "#0066CC" },
            },
        });
        var remote = (0, config_js_1.resolveProfile)(resolved, "remote");
        (0, vitest_1.expect)(remote === null || remote === void 0 ? void 0 : remote.cdpUrl).toBe("http://10.0.0.42:9222");
        (0, vitest_1.expect)(remote === null || remote === void 0 ? void 0 : remote.cdpHost).toBe("10.0.0.42");
        (0, vitest_1.expect)(remote === null || remote === void 0 ? void 0 : remote.cdpIsLoopback).toBe(false);
    });
    (0, vitest_1.it)("uses base protocol for profiles with only cdpPort", function () {
        var resolved = (0, config_js_1.resolveBrowserConfig)({
            cdpUrl: "https://example.com:9443",
            profiles: {
                work: { cdpPort: 18801, color: "#0066CC" },
            },
        });
        var work = (0, config_js_1.resolveProfile)(resolved, "work");
        (0, vitest_1.expect)(work === null || work === void 0 ? void 0 : work.cdpUrl).toBe("https://example.com:18801");
    });
    (0, vitest_1.it)("rejects unsupported protocols", function () {
        (0, vitest_1.expect)(function () { return (0, config_js_1.resolveBrowserConfig)({ cdpUrl: "ws://127.0.0.1:18791" }); }).toThrow(/must be http/i);
    });
    (0, vitest_1.it)("does not add the built-in chrome extension profile if the derived relay port is already used", function () {
        var resolved = (0, config_js_1.resolveBrowserConfig)({
            profiles: {
                openclaw: { cdpPort: 18792, color: "#FF4500" },
            },
        });
        (0, vitest_1.expect)((0, config_js_1.resolveProfile)(resolved, "chrome")).toBe(null);
        (0, vitest_1.expect)(resolved.defaultProfile).toBe("openclaw");
    });
});
