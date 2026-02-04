"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pw_session_js_1 = require("./pw-session.js");
function fakePage() {
    var handlers = new Map();
    var on = vitest_1.vi.fn(function (event, cb) {
        var _a;
        var list = (_a = handlers.get(event)) !== null && _a !== void 0 ? _a : [];
        list.push(cb);
        handlers.set(event, list);
        return undefined;
    });
    var getByRole = vitest_1.vi.fn(function () { return ({ nth: vitest_1.vi.fn(function () { return ({ ok: true }); }) }); });
    var frameLocator = vitest_1.vi.fn(function () { return ({
        getByRole: vitest_1.vi.fn(function () { return ({ nth: vitest_1.vi.fn(function () { return ({ ok: true }); }) }); }),
    }); });
    var locator = vitest_1.vi.fn(function () { return ({ nth: vitest_1.vi.fn(function () { return ({ ok: true }); }) }); });
    var page = {
        on: on,
        getByRole: getByRole,
        frameLocator: frameLocator,
        locator: locator,
    };
    return { page: page, handlers: handlers, mocks: { on: on, getByRole: getByRole, frameLocator: frameLocator, locator: locator } };
}
(0, vitest_1.describe)("pw-session refLocator", function () {
    (0, vitest_1.it)("uses frameLocator for role refs when snapshot was scoped to a frame", function () {
        var _a = fakePage(), page = _a.page, mocks = _a.mocks;
        var state = (0, pw_session_js_1.ensurePageState)(page);
        state.roleRefs = { e1: { role: "button", name: "OK" } };
        state.roleRefsFrameSelector = "iframe#main";
        (0, pw_session_js_1.refLocator)(page, "e1");
        (0, vitest_1.expect)(mocks.frameLocator).toHaveBeenCalledWith("iframe#main");
    });
    (0, vitest_1.it)("uses page getByRole for role refs by default", function () {
        var _a = fakePage(), page = _a.page, mocks = _a.mocks;
        var state = (0, pw_session_js_1.ensurePageState)(page);
        state.roleRefs = { e1: { role: "button", name: "OK" } };
        (0, pw_session_js_1.refLocator)(page, "e1");
        (0, vitest_1.expect)(mocks.getByRole).toHaveBeenCalled();
    });
    (0, vitest_1.it)("uses aria-ref locators when refs mode is aria", function () {
        var _a = fakePage(), page = _a.page, mocks = _a.mocks;
        var state = (0, pw_session_js_1.ensurePageState)(page);
        state.roleRefsMode = "aria";
        (0, pw_session_js_1.refLocator)(page, "e1");
        (0, vitest_1.expect)(mocks.locator).toHaveBeenCalledWith("aria-ref=e1");
    });
});
(0, vitest_1.describe)("pw-session role refs cache", function () {
    (0, vitest_1.it)("restores refs for a different Page instance (same CDP targetId)", function () {
        var cdpUrl = "http://127.0.0.1:9222";
        var targetId = "t1";
        (0, pw_session_js_1.rememberRoleRefsForTarget)({
            cdpUrl: cdpUrl,
            targetId: targetId,
            refs: { e1: { role: "button", name: "OK" } },
            frameSelector: "iframe#main",
        });
        var _a = fakePage(), page = _a.page, mocks = _a.mocks;
        (0, pw_session_js_1.restoreRoleRefsForTarget)({ cdpUrl: cdpUrl, targetId: targetId, page: page });
        (0, pw_session_js_1.refLocator)(page, "e1");
        (0, vitest_1.expect)(mocks.frameLocator).toHaveBeenCalledWith("iframe#main");
    });
});
(0, vitest_1.describe)("pw-session ensurePageState", function () {
    (0, vitest_1.it)("tracks page errors and network requests (best-effort)", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var _k = fakePage(), page = _k.page, handlers = _k.handlers;
        var state = (0, pw_session_js_1.ensurePageState)(page);
        var req = {
            method: function () { return "GET"; },
            url: function () { return "https://example.com/api"; },
            resourceType: function () { return "xhr"; },
            failure: function () { return ({ errorText: "net::ERR_FAILED" }); },
        };
        var resp = {
            request: function () { return req; },
            status: function () { return 500; },
            ok: function () { return false; },
        };
        (_b = (_a = handlers.get("request")) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.call(_a, req);
        (_d = (_c = handlers.get("response")) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.call(_c, resp);
        (_f = (_e = handlers.get("requestfailed")) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.call(_e, req);
        (_h = (_g = handlers.get("pageerror")) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.call(_g, new Error("boom"));
        (0, vitest_1.expect)((_j = state.errors.at(-1)) === null || _j === void 0 ? void 0 : _j.message).toBe("boom");
        (0, vitest_1.expect)(state.requests.at(-1)).toMatchObject({
            method: "GET",
            url: "https://example.com/api",
            resourceType: "xhr",
            status: 500,
            ok: false,
            failureText: "net::ERR_FAILED",
        });
    });
    (0, vitest_1.it)("drops state on page close", function () {
        var _a, _b;
        var _c = fakePage(), page = _c.page, handlers = _c.handlers;
        var state1 = (0, pw_session_js_1.ensurePageState)(page);
        (_b = (_a = handlers.get("close")) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.call(_a);
        var state2 = (0, pw_session_js_1.ensurePageState)(page);
        (0, vitest_1.expect)(state2).not.toBe(state1);
        (0, vitest_1.expect)(state2.console).toEqual([]);
        (0, vitest_1.expect)(state2.errors).toEqual([]);
        (0, vitest_1.expect)(state2.requests).toEqual([]);
    });
});
