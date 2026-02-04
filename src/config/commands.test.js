"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var commands_js_1 = require("./commands.js");
(0, vitest_1.describe)("resolveNativeSkillsEnabled", function () {
    (0, vitest_1.it)("uses provider defaults for auto", function () {
        (0, vitest_1.expect)((0, commands_js_1.resolveNativeSkillsEnabled)({
            providerId: "discord",
            globalSetting: "auto",
        })).toBe(true);
        (0, vitest_1.expect)((0, commands_js_1.resolveNativeSkillsEnabled)({
            providerId: "telegram",
            globalSetting: "auto",
        })).toBe(true);
        (0, vitest_1.expect)((0, commands_js_1.resolveNativeSkillsEnabled)({
            providerId: "slack",
            globalSetting: "auto",
        })).toBe(false);
        (0, vitest_1.expect)((0, commands_js_1.resolveNativeSkillsEnabled)({
            providerId: "whatsapp",
            globalSetting: "auto",
        })).toBe(false);
    });
    (0, vitest_1.it)("honors explicit provider settings", function () {
        (0, vitest_1.expect)((0, commands_js_1.resolveNativeSkillsEnabled)({
            providerId: "slack",
            providerSetting: true,
            globalSetting: "auto",
        })).toBe(true);
        (0, vitest_1.expect)((0, commands_js_1.resolveNativeSkillsEnabled)({
            providerId: "discord",
            providerSetting: false,
            globalSetting: true,
        })).toBe(false);
    });
});
