"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var constants_js_1 = require("./constants.js");
(0, vitest_1.describe)("resolveGatewayLaunchAgentLabel", function () {
    (0, vitest_1.it)("returns default label when no profile is set", function () {
        var result = (0, constants_js_1.resolveGatewayLaunchAgentLabel)();
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_LAUNCH_AGENT_LABEL);
        (0, vitest_1.expect)(result).toBe("ai.openclaw.gateway");
    });
    (0, vitest_1.it)("returns default label when profile is undefined", function () {
        var result = (0, constants_js_1.resolveGatewayLaunchAgentLabel)(undefined);
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_LAUNCH_AGENT_LABEL);
    });
    (0, vitest_1.it)("returns default label when profile is 'default'", function () {
        var result = (0, constants_js_1.resolveGatewayLaunchAgentLabel)("default");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_LAUNCH_AGENT_LABEL);
    });
    (0, vitest_1.it)("returns default label when profile is 'Default' (case-insensitive)", function () {
        var result = (0, constants_js_1.resolveGatewayLaunchAgentLabel)("Default");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_LAUNCH_AGENT_LABEL);
    });
    (0, vitest_1.it)("returns profile-specific label when profile is set", function () {
        var result = (0, constants_js_1.resolveGatewayLaunchAgentLabel)("dev");
        (0, vitest_1.expect)(result).toBe("ai.openclaw.dev");
    });
    (0, vitest_1.it)("returns profile-specific label for custom profile", function () {
        var result = (0, constants_js_1.resolveGatewayLaunchAgentLabel)("work");
        (0, vitest_1.expect)(result).toBe("ai.openclaw.work");
    });
    (0, vitest_1.it)("trims whitespace from profile", function () {
        var result = (0, constants_js_1.resolveGatewayLaunchAgentLabel)("  staging  ");
        (0, vitest_1.expect)(result).toBe("ai.openclaw.staging");
    });
    (0, vitest_1.it)("returns default label for empty string profile", function () {
        var result = (0, constants_js_1.resolveGatewayLaunchAgentLabel)("");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_LAUNCH_AGENT_LABEL);
    });
    (0, vitest_1.it)("returns default label for whitespace-only profile", function () {
        var result = (0, constants_js_1.resolveGatewayLaunchAgentLabel)("   ");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_LAUNCH_AGENT_LABEL);
    });
});
(0, vitest_1.describe)("resolveGatewaySystemdServiceName", function () {
    (0, vitest_1.it)("returns default service name when no profile is set", function () {
        var result = (0, constants_js_1.resolveGatewaySystemdServiceName)();
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_SYSTEMD_SERVICE_NAME);
        (0, vitest_1.expect)(result).toBe("openclaw-gateway");
    });
    (0, vitest_1.it)("returns default service name when profile is undefined", function () {
        var result = (0, constants_js_1.resolveGatewaySystemdServiceName)(undefined);
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_SYSTEMD_SERVICE_NAME);
    });
    (0, vitest_1.it)("returns default service name when profile is 'default'", function () {
        var result = (0, constants_js_1.resolveGatewaySystemdServiceName)("default");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_SYSTEMD_SERVICE_NAME);
    });
    (0, vitest_1.it)("returns default service name when profile is 'DEFAULT' (case-insensitive)", function () {
        var result = (0, constants_js_1.resolveGatewaySystemdServiceName)("DEFAULT");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_SYSTEMD_SERVICE_NAME);
    });
    (0, vitest_1.it)("returns profile-specific service name when profile is set", function () {
        var result = (0, constants_js_1.resolveGatewaySystemdServiceName)("dev");
        (0, vitest_1.expect)(result).toBe("openclaw-gateway-dev");
    });
    (0, vitest_1.it)("returns profile-specific service name for custom profile", function () {
        var result = (0, constants_js_1.resolveGatewaySystemdServiceName)("production");
        (0, vitest_1.expect)(result).toBe("openclaw-gateway-production");
    });
    (0, vitest_1.it)("trims whitespace from profile", function () {
        var result = (0, constants_js_1.resolveGatewaySystemdServiceName)("  test  ");
        (0, vitest_1.expect)(result).toBe("openclaw-gateway-test");
    });
    (0, vitest_1.it)("returns default service name for empty string profile", function () {
        var result = (0, constants_js_1.resolveGatewaySystemdServiceName)("");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_SYSTEMD_SERVICE_NAME);
    });
    (0, vitest_1.it)("returns default service name for whitespace-only profile", function () {
        var result = (0, constants_js_1.resolveGatewaySystemdServiceName)("   ");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_SYSTEMD_SERVICE_NAME);
    });
});
(0, vitest_1.describe)("resolveGatewayWindowsTaskName", function () {
    (0, vitest_1.it)("returns default task name when no profile is set", function () {
        var result = (0, constants_js_1.resolveGatewayWindowsTaskName)();
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_WINDOWS_TASK_NAME);
        (0, vitest_1.expect)(result).toBe("OpenClaw Gateway");
    });
    (0, vitest_1.it)("returns default task name when profile is undefined", function () {
        var result = (0, constants_js_1.resolveGatewayWindowsTaskName)(undefined);
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_WINDOWS_TASK_NAME);
    });
    (0, vitest_1.it)("returns default task name when profile is 'default'", function () {
        var result = (0, constants_js_1.resolveGatewayWindowsTaskName)("default");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_WINDOWS_TASK_NAME);
    });
    (0, vitest_1.it)("returns default task name when profile is 'DeFaUlT' (case-insensitive)", function () {
        var result = (0, constants_js_1.resolveGatewayWindowsTaskName)("DeFaUlT");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_WINDOWS_TASK_NAME);
    });
    (0, vitest_1.it)("returns profile-specific task name when profile is set", function () {
        var result = (0, constants_js_1.resolveGatewayWindowsTaskName)("dev");
        (0, vitest_1.expect)(result).toBe("OpenClaw Gateway (dev)");
    });
    (0, vitest_1.it)("returns profile-specific task name for custom profile", function () {
        var result = (0, constants_js_1.resolveGatewayWindowsTaskName)("work");
        (0, vitest_1.expect)(result).toBe("OpenClaw Gateway (work)");
    });
    (0, vitest_1.it)("trims whitespace from profile", function () {
        var result = (0, constants_js_1.resolveGatewayWindowsTaskName)("  ci  ");
        (0, vitest_1.expect)(result).toBe("OpenClaw Gateway (ci)");
    });
    (0, vitest_1.it)("returns default task name for empty string profile", function () {
        var result = (0, constants_js_1.resolveGatewayWindowsTaskName)("");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_WINDOWS_TASK_NAME);
    });
    (0, vitest_1.it)("returns default task name for whitespace-only profile", function () {
        var result = (0, constants_js_1.resolveGatewayWindowsTaskName)("   ");
        (0, vitest_1.expect)(result).toBe(constants_js_1.GATEWAY_WINDOWS_TASK_NAME);
    });
});
(0, vitest_1.describe)("resolveGatewayProfileSuffix", function () {
    (0, vitest_1.it)("returns empty string when no profile is set", function () {
        (0, vitest_1.expect)((0, constants_js_1.resolveGatewayProfileSuffix)()).toBe("");
    });
    (0, vitest_1.it)("returns empty string for default profiles", function () {
        (0, vitest_1.expect)((0, constants_js_1.resolveGatewayProfileSuffix)("default")).toBe("");
        (0, vitest_1.expect)((0, constants_js_1.resolveGatewayProfileSuffix)(" Default ")).toBe("");
    });
    (0, vitest_1.it)("returns a hyphenated suffix for custom profiles", function () {
        (0, vitest_1.expect)((0, constants_js_1.resolveGatewayProfileSuffix)("dev")).toBe("-dev");
    });
    (0, vitest_1.it)("trims whitespace from profiles", function () {
        (0, vitest_1.expect)((0, constants_js_1.resolveGatewayProfileSuffix)("  staging  ")).toBe("-staging");
    });
});
(0, vitest_1.describe)("formatGatewayServiceDescription", function () {
    (0, vitest_1.it)("returns default description when no profile/version", function () {
        (0, vitest_1.expect)((0, constants_js_1.formatGatewayServiceDescription)()).toBe("OpenClaw Gateway");
    });
    (0, vitest_1.it)("includes profile when set", function () {
        (0, vitest_1.expect)((0, constants_js_1.formatGatewayServiceDescription)({ profile: "work" })).toBe("OpenClaw Gateway (profile: work)");
    });
    (0, vitest_1.it)("includes version when set", function () {
        (0, vitest_1.expect)((0, constants_js_1.formatGatewayServiceDescription)({ version: "2026.1.10" })).toBe("OpenClaw Gateway (v2026.1.10)");
    });
    (0, vitest_1.it)("includes profile and version when set", function () {
        (0, vitest_1.expect)((0, constants_js_1.formatGatewayServiceDescription)({ profile: "dev", version: "1.2.3" })).toBe("OpenClaw Gateway (profile: dev, v1.2.3)");
    });
});
