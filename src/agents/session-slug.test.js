"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var session_slug_js_1 = require("./session-slug.js");
(0, vitest_1.describe)("session slug", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("generates a two-word slug by default", function () {
        vitest_1.vi.spyOn(Math, "random").mockReturnValue(0);
        var slug = (0, session_slug_js_1.createSessionSlug)();
        (0, vitest_1.expect)(slug).toBe("amber-atlas");
    });
    (0, vitest_1.it)("adds a numeric suffix when the base slug is taken", function () {
        vitest_1.vi.spyOn(Math, "random").mockReturnValue(0);
        var slug = (0, session_slug_js_1.createSessionSlug)(function (id) { return id === "amber-atlas"; });
        (0, vitest_1.expect)(slug).toBe("amber-atlas-2");
    });
    (0, vitest_1.it)("falls back to three words when collisions persist", function () {
        vitest_1.vi.spyOn(Math, "random").mockReturnValue(0);
        var slug = (0, session_slug_js_1.createSessionSlug)(function (id) { return /^amber-atlas(-\d+)?$/.test(id); });
        (0, vitest_1.expect)(slug).toBe("amber-atlas-atlas");
    });
});
