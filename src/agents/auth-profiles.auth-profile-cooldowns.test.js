"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var auth_profiles_js_1 = require("./auth-profiles.js");
(0, vitest_1.describe)("auth profile cooldowns", function () {
    (0, vitest_1.it)("applies exponential backoff with a 1h cap", function () {
        (0, vitest_1.expect)((0, auth_profiles_js_1.calculateAuthProfileCooldownMs)(1)).toBe(60000);
        (0, vitest_1.expect)((0, auth_profiles_js_1.calculateAuthProfileCooldownMs)(2)).toBe(5 * 60000);
        (0, vitest_1.expect)((0, auth_profiles_js_1.calculateAuthProfileCooldownMs)(3)).toBe(25 * 60000);
        (0, vitest_1.expect)((0, auth_profiles_js_1.calculateAuthProfileCooldownMs)(4)).toBe(60 * 60000);
        (0, vitest_1.expect)((0, auth_profiles_js_1.calculateAuthProfileCooldownMs)(5)).toBe(60 * 60000);
    });
});
