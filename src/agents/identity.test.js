"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var identity_js_1 = require("./identity.js");
(0, vitest_1.describe)("resolveHumanDelayConfig", function () {
    (0, vitest_1.it)("returns undefined when no humanDelay config is set", function () {
        var cfg = {};
        (0, vitest_1.expect)((0, identity_js_1.resolveHumanDelayConfig)(cfg, "main")).toBeUndefined();
    });
    (0, vitest_1.it)("merges defaults with per-agent overrides", function () {
        var cfg = {
            agents: {
                defaults: {
                    humanDelay: { mode: "natural", minMs: 800, maxMs: 1800 },
                },
                list: [{ id: "main", humanDelay: { mode: "custom", minMs: 400 } }],
            },
        };
        (0, vitest_1.expect)((0, identity_js_1.resolveHumanDelayConfig)(cfg, "main")).toEqual({
            mode: "custom",
            minMs: 400,
            maxMs: 1800,
        });
    });
});
