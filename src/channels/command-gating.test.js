"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var command_gating_js_1 = require("./command-gating.js");
(0, vitest_1.describe)("resolveCommandAuthorizedFromAuthorizers", function () {
    (0, vitest_1.it)("denies when useAccessGroups is enabled and no authorizer is configured", function () {
        (0, vitest_1.expect)((0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
            useAccessGroups: true,
            authorizers: [{ configured: false, allowed: true }],
        })).toBe(false);
    });
    (0, vitest_1.it)("allows when useAccessGroups is enabled and any configured authorizer allows", function () {
        (0, vitest_1.expect)((0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
            useAccessGroups: true,
            authorizers: [
                { configured: true, allowed: false },
                { configured: true, allowed: true },
            ],
        })).toBe(true);
    });
    (0, vitest_1.it)("allows when useAccessGroups is disabled (default)", function () {
        (0, vitest_1.expect)((0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
            useAccessGroups: false,
            authorizers: [{ configured: true, allowed: false }],
        })).toBe(true);
    });
    (0, vitest_1.it)("honors modeWhenAccessGroupsOff=deny", function () {
        (0, vitest_1.expect)((0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
            useAccessGroups: false,
            authorizers: [{ configured: false, allowed: true }],
            modeWhenAccessGroupsOff: "deny",
        })).toBe(false);
    });
    (0, vitest_1.it)("honors modeWhenAccessGroupsOff=configured (allow when none configured)", function () {
        (0, vitest_1.expect)((0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
            useAccessGroups: false,
            authorizers: [{ configured: false, allowed: false }],
            modeWhenAccessGroupsOff: "configured",
        })).toBe(true);
    });
    (0, vitest_1.it)("honors modeWhenAccessGroupsOff=configured (enforce when configured)", function () {
        (0, vitest_1.expect)((0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
            useAccessGroups: false,
            authorizers: [{ configured: true, allowed: false }],
            modeWhenAccessGroupsOff: "configured",
        })).toBe(false);
        (0, vitest_1.expect)((0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
            useAccessGroups: false,
            authorizers: [{ configured: true, allowed: true }],
            modeWhenAccessGroupsOff: "configured",
        })).toBe(true);
    });
});
(0, vitest_1.describe)("resolveControlCommandGate", function () {
    (0, vitest_1.it)("blocks control commands when unauthorized", function () {
        var result = (0, command_gating_js_1.resolveControlCommandGate)({
            useAccessGroups: true,
            authorizers: [{ configured: true, allowed: false }],
            allowTextCommands: true,
            hasControlCommand: true,
        });
        (0, vitest_1.expect)(result.commandAuthorized).toBe(false);
        (0, vitest_1.expect)(result.shouldBlock).toBe(true);
    });
    (0, vitest_1.it)("does not block when control commands are disabled", function () {
        var result = (0, command_gating_js_1.resolveControlCommandGate)({
            useAccessGroups: true,
            authorizers: [{ configured: true, allowed: false }],
            allowTextCommands: false,
            hasControlCommand: true,
        });
        (0, vitest_1.expect)(result.shouldBlock).toBe(false);
    });
});
