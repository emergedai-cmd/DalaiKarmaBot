"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runtime_overrides_js_1 = require("./runtime-overrides.js");
(0, vitest_1.describe)("runtime overrides", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_overrides_js_1.resetConfigOverrides)();
    });
    (0, vitest_1.it)("sets and applies nested overrides", function () {
        var _a;
        var cfg = {
            messages: { responsePrefix: "[openclaw]" },
        };
        (0, runtime_overrides_js_1.setConfigOverride)("messages.responsePrefix", "[debug]");
        var next = (0, runtime_overrides_js_1.applyConfigOverrides)(cfg);
        (0, vitest_1.expect)((_a = next.messages) === null || _a === void 0 ? void 0 : _a.responsePrefix).toBe("[debug]");
    });
    (0, vitest_1.it)("merges object overrides without clobbering siblings", function () {
        var _a, _b, _c, _d;
        var cfg = {
            channels: { whatsapp: { dmPolicy: "pairing", allowFrom: ["+1"] } },
        };
        (0, runtime_overrides_js_1.setConfigOverride)("channels.whatsapp.dmPolicy", "open");
        var next = (0, runtime_overrides_js_1.applyConfigOverrides)(cfg);
        (0, vitest_1.expect)((_b = (_a = next.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null || _b === void 0 ? void 0 : _b.dmPolicy).toBe("open");
        (0, vitest_1.expect)((_d = (_c = next.channels) === null || _c === void 0 ? void 0 : _c.whatsapp) === null || _d === void 0 ? void 0 : _d.allowFrom).toEqual(["+1"]);
    });
    (0, vitest_1.it)("unsets overrides and prunes empty branches", function () {
        (0, runtime_overrides_js_1.setConfigOverride)("channels.whatsapp.dmPolicy", "open");
        var removed = (0, runtime_overrides_js_1.unsetConfigOverride)("channels.whatsapp.dmPolicy");
        (0, vitest_1.expect)(removed.ok).toBe(true);
        (0, vitest_1.expect)(removed.removed).toBe(true);
        (0, vitest_1.expect)(Object.keys((0, runtime_overrides_js_1.getConfigOverrides)()).length).toBe(0);
    });
    (0, vitest_1.it)("rejects prototype pollution paths", function () {
        var attempts = ["__proto__.polluted", "constructor.polluted", "prototype.polluted"];
        for (var _i = 0, attempts_1 = attempts; _i < attempts_1.length; _i++) {
            var path = attempts_1[_i];
            var result = (0, runtime_overrides_js_1.setConfigOverride)(path, true);
            (0, vitest_1.expect)(result.ok).toBe(false);
            (0, vitest_1.expect)(Object.keys((0, runtime_overrides_js_1.getConfigOverrides)()).length).toBe(0);
        }
    });
});
