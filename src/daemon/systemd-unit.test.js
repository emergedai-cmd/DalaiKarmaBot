"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var systemd_unit_js_1 = require("./systemd-unit.js");
(0, vitest_1.describe)("parseSystemdExecStart", function () {
    (0, vitest_1.it)("splits on whitespace outside quotes", function () {
        var execStart = "/usr/bin/openclaw gateway start --foo bar";
        (0, vitest_1.expect)((0, systemd_unit_js_1.parseSystemdExecStart)(execStart)).toEqual([
            "/usr/bin/openclaw",
            "gateway",
            "start",
            "--foo",
            "bar",
        ]);
    });
    (0, vitest_1.it)("preserves quoted arguments", function () {
        var execStart = '/usr/bin/openclaw gateway start --name "My Bot"';
        (0, vitest_1.expect)((0, systemd_unit_js_1.parseSystemdExecStart)(execStart)).toEqual([
            "/usr/bin/openclaw",
            "gateway",
            "start",
            "--name",
            "My Bot",
        ]);
    });
    (0, vitest_1.it)("parses path arguments", function () {
        var execStart = "/usr/bin/openclaw gateway start --path /tmp/openclaw";
        (0, vitest_1.expect)((0, systemd_unit_js_1.parseSystemdExecStart)(execStart)).toEqual([
            "/usr/bin/openclaw",
            "gateway",
            "start",
            "--path",
            "/tmp/openclaw",
        ]);
    });
});
