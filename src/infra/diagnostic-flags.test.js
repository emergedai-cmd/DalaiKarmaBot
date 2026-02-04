"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var diagnostic_flags_js_1 = require("./diagnostic-flags.js");
(0, vitest_1.describe)("diagnostic flags", function () {
    (0, vitest_1.it)("merges config + env flags", function () {
        var cfg = {
            diagnostics: { flags: ["telegram.http", "cache.*"] },
        };
        var env = {
            OPENCLAW_DIAGNOSTICS: "foo,bar",
        };
        var flags = (0, diagnostic_flags_js_1.resolveDiagnosticFlags)(cfg, env);
        (0, vitest_1.expect)(flags).toEqual(vitest_1.expect.arrayContaining(["telegram.http", "cache.*", "foo", "bar"]));
        (0, vitest_1.expect)((0, diagnostic_flags_js_1.isDiagnosticFlagEnabled)("telegram.http", cfg, env)).toBe(true);
        (0, vitest_1.expect)((0, diagnostic_flags_js_1.isDiagnosticFlagEnabled)("cache.hit", cfg, env)).toBe(true);
        (0, vitest_1.expect)((0, diagnostic_flags_js_1.isDiagnosticFlagEnabled)("foo", cfg, env)).toBe(true);
    });
    (0, vitest_1.it)("treats env true as wildcard", function () {
        var env = { OPENCLAW_DIAGNOSTICS: "1" };
        (0, vitest_1.expect)((0, diagnostic_flags_js_1.isDiagnosticFlagEnabled)("anything.here", undefined, env)).toBe(true);
    });
    (0, vitest_1.it)("treats env false as disabled", function () {
        var env = { OPENCLAW_DIAGNOSTICS: "0" };
        (0, vitest_1.expect)((0, diagnostic_flags_js_1.isDiagnosticFlagEnabled)("telegram.http", undefined, env)).toBe(false);
    });
});
