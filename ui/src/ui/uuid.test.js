"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var uuid_1 = require("./uuid");
(0, vitest_1.describe)("generateUUID", function () {
    (0, vitest_1.it)("uses crypto.randomUUID when available", function () {
        var id = (0, uuid_1.generateUUID)({
            randomUUID: function () { return "randomuuid"; },
            getRandomValues: function () {
                throw new Error("should not be called");
            },
        });
        (0, vitest_1.expect)(id).toBe("randomuuid");
    });
    (0, vitest_1.it)("falls back to crypto.getRandomValues", function () {
        var id = (0, uuid_1.generateUUID)({
            getRandomValues: function (bytes) {
                for (var i = 0; i < bytes.length; i++) {
                    bytes[i] = i;
                }
                return bytes;
            },
        });
        (0, vitest_1.expect)(id).toBe("00010203-0405-4607-8809-0a0b0c0d0e0f");
    });
    (0, vitest_1.it)("still returns a v4 UUID when crypto is missing", function () {
        var warnSpy = vitest_1.vi.spyOn(console, "warn").mockImplementation(function () { });
        try {
            var id = (0, uuid_1.generateUUID)(null);
            (0, vitest_1.expect)(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
            (0, vitest_1.expect)(warnSpy).toHaveBeenCalled();
        }
        finally {
            warnSpy.mockRestore();
        }
    });
});
