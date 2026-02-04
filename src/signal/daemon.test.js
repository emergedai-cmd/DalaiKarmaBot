"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var daemon_js_1 = require("./daemon.js");
(0, vitest_1.describe)("classifySignalCliLogLine", function () {
    (0, vitest_1.it)("treats INFO/DEBUG as log (even if emitted on stderr)", function () {
        (0, vitest_1.expect)((0, daemon_js_1.classifySignalCliLogLine)("INFO  DaemonCommand - Started")).toBe("log");
        (0, vitest_1.expect)((0, daemon_js_1.classifySignalCliLogLine)("DEBUG Something")).toBe("log");
    });
    (0, vitest_1.it)("treats WARN/ERROR as error", function () {
        (0, vitest_1.expect)((0, daemon_js_1.classifySignalCliLogLine)("WARN  Something")).toBe("error");
        (0, vitest_1.expect)((0, daemon_js_1.classifySignalCliLogLine)("WARNING Something")).toBe("error");
        (0, vitest_1.expect)((0, daemon_js_1.classifySignalCliLogLine)("ERROR Something")).toBe("error");
    });
    (0, vitest_1.it)("treats failures without explicit severity as error", function () {
        (0, vitest_1.expect)((0, daemon_js_1.classifySignalCliLogLine)("Failed to initialize HTTP Server - oops")).toBe("error");
        (0, vitest_1.expect)((0, daemon_js_1.classifySignalCliLogLine)('Exception in thread "main"')).toBe("error");
    });
    (0, vitest_1.it)("returns null for empty lines", function () {
        (0, vitest_1.expect)((0, daemon_js_1.classifySignalCliLogLine)("")).toBe(null);
        (0, vitest_1.expect)((0, daemon_js_1.classifySignalCliLogLine)("   ")).toBe(null);
    });
});
