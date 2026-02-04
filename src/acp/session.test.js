"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var session_js_1 = require("./session.js");
(0, vitest_1.describe)("acp session manager", function () {
    var store = (0, session_js_1.createInMemorySessionStore)();
    (0, vitest_1.afterEach)(function () {
        store.clearAllSessionsForTest();
    });
    (0, vitest_1.it)("tracks active runs and clears on cancel", function () {
        var _a;
        var session = store.createSession({
            sessionKey: "acp:test",
            cwd: "/tmp",
        });
        var controller = new AbortController();
        store.setActiveRun(session.sessionId, "run-1", controller);
        (0, vitest_1.expect)((_a = store.getSessionByRunId("run-1")) === null || _a === void 0 ? void 0 : _a.sessionId).toBe(session.sessionId);
        var cancelled = store.cancelActiveRun(session.sessionId);
        (0, vitest_1.expect)(cancelled).toBe(true);
        (0, vitest_1.expect)(store.getSessionByRunId("run-1")).toBeUndefined();
    });
});
