"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pw_role_snapshot_js_1 = require("./pw-role-snapshot.js");
(0, vitest_1.describe)("pw-role-snapshot", function () {
    (0, vitest_1.it)("adds refs for interactive elements", function () {
        var aria = [
            '- heading "Example" [level=1]',
            "- paragraph: hello",
            '- button "Submit"',
            "  - generic",
            '- link "Learn more"',
        ].join("\n");
        var res = (0, pw_role_snapshot_js_1.buildRoleSnapshotFromAriaSnapshot)(aria, { interactive: true });
        (0, vitest_1.expect)(res.snapshot).toContain("[ref=e1]");
        (0, vitest_1.expect)(res.snapshot).toContain("[ref=e2]");
        (0, vitest_1.expect)(res.snapshot).toContain('- button "Submit" [ref=e1]');
        (0, vitest_1.expect)(res.snapshot).toContain('- link "Learn more" [ref=e2]');
        (0, vitest_1.expect)(Object.keys(res.refs)).toEqual(["e1", "e2"]);
        (0, vitest_1.expect)(res.refs.e1).toMatchObject({ role: "button", name: "Submit" });
        (0, vitest_1.expect)(res.refs.e2).toMatchObject({ role: "link", name: "Learn more" });
    });
    (0, vitest_1.it)("uses nth only when duplicates exist", function () {
        var _a, _b, _c;
        var aria = ['- button "OK"', '- button "OK"', '- button "Cancel"'].join("\n");
        var res = (0, pw_role_snapshot_js_1.buildRoleSnapshotFromAriaSnapshot)(aria);
        (0, vitest_1.expect)(res.snapshot).toContain("[ref=e1]");
        (0, vitest_1.expect)(res.snapshot).toContain("[ref=e2] [nth=1]");
        (0, vitest_1.expect)((_a = res.refs.e1) === null || _a === void 0 ? void 0 : _a.nth).toBe(0);
        (0, vitest_1.expect)((_b = res.refs.e2) === null || _b === void 0 ? void 0 : _b.nth).toBe(1);
        (0, vitest_1.expect)((_c = res.refs.e3) === null || _c === void 0 ? void 0 : _c.nth).toBeUndefined();
    });
    (0, vitest_1.it)("respects maxDepth", function () {
        var aria = ['- region "Main"', "  - group", '    - button "Deep"'].join("\n");
        var res = (0, pw_role_snapshot_js_1.buildRoleSnapshotFromAriaSnapshot)(aria, { maxDepth: 1 });
        (0, vitest_1.expect)(res.snapshot).toContain('- region "Main"');
        (0, vitest_1.expect)(res.snapshot).toContain("  - group");
        (0, vitest_1.expect)(res.snapshot).not.toContain("button");
    });
    (0, vitest_1.it)("computes stats", function () {
        var aria = ['- button "OK"', '- button "Cancel"'].join("\n");
        var res = (0, pw_role_snapshot_js_1.buildRoleSnapshotFromAriaSnapshot)(aria);
        var stats = (0, pw_role_snapshot_js_1.getRoleSnapshotStats)(res.snapshot, res.refs);
        (0, vitest_1.expect)(stats.refs).toBe(2);
        (0, vitest_1.expect)(stats.interactive).toBe(2);
        (0, vitest_1.expect)(stats.lines).toBeGreaterThan(0);
        (0, vitest_1.expect)(stats.chars).toBeGreaterThan(0);
    });
    (0, vitest_1.it)("returns a helpful message when no interactive elements exist", function () {
        var aria = ['- heading "Hello"', "- paragraph: world"].join("\n");
        var res = (0, pw_role_snapshot_js_1.buildRoleSnapshotFromAriaSnapshot)(aria, { interactive: true });
        (0, vitest_1.expect)(res.snapshot).toBe("(no interactive elements)");
        (0, vitest_1.expect)(Object.keys(res.refs)).toEqual([]);
    });
    (0, vitest_1.it)("parses role refs", function () {
        (0, vitest_1.expect)((0, pw_role_snapshot_js_1.parseRoleRef)("e12")).toBe("e12");
        (0, vitest_1.expect)((0, pw_role_snapshot_js_1.parseRoleRef)("@e12")).toBe("e12");
        (0, vitest_1.expect)((0, pw_role_snapshot_js_1.parseRoleRef)("ref=e12")).toBe("e12");
        (0, vitest_1.expect)((0, pw_role_snapshot_js_1.parseRoleRef)("12")).toBeNull();
        (0, vitest_1.expect)((0, pw_role_snapshot_js_1.parseRoleRef)("")).toBeNull();
    });
    (0, vitest_1.it)("preserves Playwright aria-ref ids in ai snapshots", function () {
        var ai = [
            "- navigation [ref=e1]:",
            '  - link "Home" [ref=e5]',
            '  - heading "Title" [ref=e6]',
            '  - button "Save" [ref=e7] [cursor=pointer]:',
            "  - paragraph: hello",
        ].join("\n");
        var res = (0, pw_role_snapshot_js_1.buildRoleSnapshotFromAiSnapshot)(ai, { interactive: true });
        (0, vitest_1.expect)(res.snapshot).toContain("[ref=e5]");
        (0, vitest_1.expect)(res.snapshot).toContain('- link "Home"');
        (0, vitest_1.expect)(res.snapshot).toContain('- button "Save"');
        (0, vitest_1.expect)(res.snapshot).not.toContain("navigation");
        (0, vitest_1.expect)(res.snapshot).not.toContain("heading");
        (0, vitest_1.expect)(Object.keys(res.refs).toSorted()).toEqual(["e5", "e7"]);
        (0, vitest_1.expect)(res.refs.e5).toMatchObject({ role: "link", name: "Home" });
        (0, vitest_1.expect)(res.refs.e7).toMatchObject({ role: "button", name: "Save" });
    });
});
