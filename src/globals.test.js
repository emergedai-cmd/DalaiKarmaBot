"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var globals_js_1 = require("./globals.js");
(0, vitest_1.describe)("globals", function () {
    (0, vitest_1.afterEach)(function () {
        (0, globals_js_1.setVerbose)(false);
        (0, globals_js_1.setYes)(false);
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("toggles verbose flag and logs when enabled", function () {
        var logSpy = vitest_1.vi.spyOn(console, "log").mockImplementation(function () { });
        (0, globals_js_1.setVerbose)(false);
        (0, globals_js_1.logVerbose)("hidden");
        (0, vitest_1.expect)(logSpy).not.toHaveBeenCalled();
        (0, globals_js_1.setVerbose)(true);
        (0, globals_js_1.logVerbose)("shown");
        (0, vitest_1.expect)((0, globals_js_1.isVerbose)()).toBe(true);
        (0, vitest_1.expect)(logSpy).toHaveBeenCalledWith(vitest_1.expect.stringContaining("shown"));
    });
    (0, vitest_1.it)("stores yes flag", function () {
        (0, globals_js_1.setYes)(true);
        (0, vitest_1.expect)((0, globals_js_1.isYes)()).toBe(true);
        (0, globals_js_1.setYes)(false);
        (0, vitest_1.expect)((0, globals_js_1.isYes)()).toBe(false);
    });
});
