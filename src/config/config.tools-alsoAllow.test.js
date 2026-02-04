"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var validation_js_1 = require("./validation.js");
// NOTE: These tests ensure allow + alsoAllow cannot be set in the same scope.
(0, vitest_1.describe)("config: tools.alsoAllow", function () {
    (0, vitest_1.it)("rejects tools.allow + tools.alsoAllow together", function () {
        var res = (0, validation_js_1.validateConfigObject)({
            tools: {
                allow: ["group:fs"],
                alsoAllow: ["lobster"],
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)(res.issues.some(function (i) { return i.path === "tools"; })).toBe(true);
        }
    });
    (0, vitest_1.it)("rejects agents.list[].tools.allow + alsoAllow together", function () {
        var res = (0, validation_js_1.validateConfigObject)({
            agents: {
                list: [
                    {
                        id: "main",
                        tools: {
                            allow: ["group:fs"],
                            alsoAllow: ["lobster"],
                        },
                    },
                ],
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)(res.issues.some(function (i) { return i.path.includes("agents.list"); })).toBe(true);
        }
    });
    (0, vitest_1.it)("allows profile + alsoAllow", function () {
        var res = (0, validation_js_1.validateConfigObject)({
            tools: {
                profile: "coding",
                alsoAllow: ["lobster"],
            },
        });
        (0, vitest_1.expect)(res.ok).toBe(true);
    });
});
