"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var wait_js_1 = require("./wait.js");
(0, vitest_1.describe)("waitForever", function () {
    (0, vitest_1.it)("creates an unref'ed interval and returns a pending promise", function () {
        var setIntervalSpy = vitest_1.vi.spyOn(global, "setInterval");
        var promise = (0, wait_js_1.waitForever)();
        (0, vitest_1.expect)(setIntervalSpy).toHaveBeenCalledWith(vitest_1.expect.any(Function), 1000000);
        (0, vitest_1.expect)(promise).toBeInstanceOf(Promise);
        setIntervalSpy.mockRestore();
    });
});
