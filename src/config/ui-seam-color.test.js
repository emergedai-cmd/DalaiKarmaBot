"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
(0, vitest_1.describe)("ui.seamColor", function () {
    (0, vitest_1.it)("accepts hex colors", function () {
        var res = (0, config_js_1.validateConfigObject)({ ui: { seamColor: "#FF4500" } });
        (0, vitest_1.expect)(res.ok).toBe(true);
    });
    (0, vitest_1.it)("rejects non-hex colors", function () {
        var res = (0, config_js_1.validateConfigObject)({ ui: { seamColor: "lobster" } });
        (0, vitest_1.expect)(res.ok).toBe(false);
    });
    (0, vitest_1.it)("rejects invalid hex length", function () {
        var res = (0, config_js_1.validateConfigObject)({ ui: { seamColor: "#FF4500FF" } });
        (0, vitest_1.expect)(res.ok).toBe(false);
    });
});
