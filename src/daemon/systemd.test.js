"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var systemd_js_1 = require("./systemd.js");
(0, vitest_1.describe)("systemd runtime parsing", function () {
    (0, vitest_1.it)("parses active state details", function () {
        var output = [
            "ActiveState=inactive",
            "SubState=dead",
            "MainPID=0",
            "ExecMainStatus=2",
            "ExecMainCode=exited",
        ].join("\n");
        (0, vitest_1.expect)((0, systemd_js_1.parseSystemdShow)(output)).toEqual({
            activeState: "inactive",
            subState: "dead",
            execMainStatus: 2,
            execMainCode: "exited",
        });
    });
});
(0, vitest_1.describe)("resolveSystemdUserUnitPath", function () {
    (0, vitest_1.it)("uses default service name when OPENCLAW_PROFILE is default", function () {
        var env = { HOME: "/home/test", OPENCLAW_PROFILE: "default" };
        (0, vitest_1.expect)((0, systemd_js_1.resolveSystemdUserUnitPath)(env)).toBe("/home/test/.config/systemd/user/openclaw-gateway.service");
    });
    (0, vitest_1.it)("uses default service name when OPENCLAW_PROFILE is unset", function () {
        var env = { HOME: "/home/test" };
        (0, vitest_1.expect)((0, systemd_js_1.resolveSystemdUserUnitPath)(env)).toBe("/home/test/.config/systemd/user/openclaw-gateway.service");
    });
    (0, vitest_1.it)("uses profile-specific service name when OPENCLAW_PROFILE is set to a custom value", function () {
        var env = { HOME: "/home/test", OPENCLAW_PROFILE: "jbphoenix" };
        (0, vitest_1.expect)((0, systemd_js_1.resolveSystemdUserUnitPath)(env)).toBe("/home/test/.config/systemd/user/openclaw-gateway-jbphoenix.service");
    });
    (0, vitest_1.it)("prefers OPENCLAW_SYSTEMD_UNIT over OPENCLAW_PROFILE", function () {
        var env = {
            HOME: "/home/test",
            OPENCLAW_PROFILE: "jbphoenix",
            OPENCLAW_SYSTEMD_UNIT: "custom-unit",
        };
        (0, vitest_1.expect)((0, systemd_js_1.resolveSystemdUserUnitPath)(env)).toBe("/home/test/.config/systemd/user/custom-unit.service");
    });
    (0, vitest_1.it)("handles OPENCLAW_SYSTEMD_UNIT with .service suffix", function () {
        var env = {
            HOME: "/home/test",
            OPENCLAW_SYSTEMD_UNIT: "custom-unit.service",
        };
        (0, vitest_1.expect)((0, systemd_js_1.resolveSystemdUserUnitPath)(env)).toBe("/home/test/.config/systemd/user/custom-unit.service");
    });
    (0, vitest_1.it)("trims whitespace from OPENCLAW_SYSTEMD_UNIT", function () {
        var env = {
            HOME: "/home/test",
            OPENCLAW_SYSTEMD_UNIT: "  custom-unit  ",
        };
        (0, vitest_1.expect)((0, systemd_js_1.resolveSystemdUserUnitPath)(env)).toBe("/home/test/.config/systemd/user/custom-unit.service");
    });
    (0, vitest_1.it)("handles case-insensitive 'Default' profile", function () {
        var env = { HOME: "/home/test", OPENCLAW_PROFILE: "Default" };
        (0, vitest_1.expect)((0, systemd_js_1.resolveSystemdUserUnitPath)(env)).toBe("/home/test/.config/systemd/user/openclaw-gateway.service");
    });
    (0, vitest_1.it)("handles case-insensitive 'DEFAULT' profile", function () {
        var env = { HOME: "/home/test", OPENCLAW_PROFILE: "DEFAULT" };
        (0, vitest_1.expect)((0, systemd_js_1.resolveSystemdUserUnitPath)(env)).toBe("/home/test/.config/systemd/user/openclaw-gateway.service");
    });
    (0, vitest_1.it)("trims whitespace from OPENCLAW_PROFILE", function () {
        var env = { HOME: "/home/test", OPENCLAW_PROFILE: "  myprofile  " };
        (0, vitest_1.expect)((0, systemd_js_1.resolveSystemdUserUnitPath)(env)).toBe("/home/test/.config/systemd/user/openclaw-gateway-myprofile.service");
    });
});
