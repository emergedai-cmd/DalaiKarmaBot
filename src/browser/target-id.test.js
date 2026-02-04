"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var target_id_js_1 = require("./target-id.js");
(0, vitest_1.describe)("browser target id resolution", function () {
    (0, vitest_1.it)("resolves exact ids", function () {
        var res = (0, target_id_js_1.resolveTargetIdFromTabs)("FULL", [{ targetId: "AAA" }, { targetId: "FULL" }]);
        (0, vitest_1.expect)(res).toEqual({ ok: true, targetId: "FULL" });
    });
    (0, vitest_1.it)("resolves unique prefixes (case-insensitive)", function () {
        var res = (0, target_id_js_1.resolveTargetIdFromTabs)("57a01309", [
            { targetId: "57A01309E14B5DEE0FB41F908515A2FC" },
        ]);
        (0, vitest_1.expect)(res).toEqual({
            ok: true,
            targetId: "57A01309E14B5DEE0FB41F908515A2FC",
        });
    });
    (0, vitest_1.it)("fails on ambiguous prefixes", function () {
        var _a;
        var res = (0, target_id_js_1.resolveTargetIdFromTabs)("57A0", [
            { targetId: "57A01309E14B5DEE0FB41F908515A2FC" },
            { targetId: "57A0BEEF000000000000000000000000" },
        ]);
        (0, vitest_1.expect)(res.ok).toBe(false);
        if (!res.ok) {
            (0, vitest_1.expect)(res.reason).toBe("ambiguous");
            (0, vitest_1.expect)((_a = res.matches) === null || _a === void 0 ? void 0 : _a.length).toBe(2);
        }
    });
    (0, vitest_1.it)("fails when no tab matches", function () {
        var res = (0, target_id_js_1.resolveTargetIdFromTabs)("NOPE", [{ targetId: "AAA" }]);
        (0, vitest_1.expect)(res).toEqual({ ok: false, reason: "not_found" });
    });
});
