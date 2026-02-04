"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var health_format_js_1 = require("./health-format.js");
var ansiEscape = String.fromCharCode(27);
var ansiRegex = new RegExp("".concat(ansiEscape, "\\[[0-9;]*m"), "g");
var stripAnsi = function (input) { return input.replace(ansiRegex, ""); };
(0, vitest_1.describe)("formatHealthCheckFailure", function () {
    (0, vitest_1.it)("keeps non-rich output stable", function () {
        var err = new Error("gateway closed (1006 abnormal closure): no close reason");
        (0, vitest_1.expect)((0, health_format_js_1.formatHealthCheckFailure)(err, { rich: false })).toBe("Health check failed: ".concat(String(err)));
    });
    (0, vitest_1.it)("formats gateway connection details as indented key/value lines", function () {
        var err = new Error([
            "gateway closed (1006 abnormal closure (no close frame)): no close reason",
            "Gateway target: ws://127.0.0.1:19001",
            "Source: local loopback",
            "Config: /Users/steipete/.openclaw-dev/openclaw.json",
            "Bind: loopback",
        ].join("\n"));
        (0, vitest_1.expect)(stripAnsi((0, health_format_js_1.formatHealthCheckFailure)(err, { rich: true }))).toBe([
            "Health check failed: gateway closed (1006 abnormal closure (no close frame)): no close reason",
            "  Gateway target: ws://127.0.0.1:19001",
            "  Source: local loopback",
            "  Config: /Users/steipete/.openclaw-dev/openclaw.json",
            "  Bind: loopback",
        ].join("\n"));
    });
});
