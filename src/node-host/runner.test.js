"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var runner_js_1 = require("./runner.js");
(0, vitest_1.describe)("buildNodeInvokeResultParams", function () {
    (0, vitest_1.test)("omits optional fields when null/undefined", function () {
        var params = (0, runner_js_1.buildNodeInvokeResultParams)({ id: "invoke-1", nodeId: "node-1", command: "system.run" }, { ok: true, payloadJSON: null, error: null });
        (0, vitest_1.expect)(params).toEqual({ id: "invoke-1", nodeId: "node-1", ok: true });
        (0, vitest_1.expect)("payloadJSON" in params).toBe(false);
        (0, vitest_1.expect)("error" in params).toBe(false);
    });
    (0, vitest_1.test)("includes payloadJSON when provided", function () {
        var params = (0, runner_js_1.buildNodeInvokeResultParams)({ id: "invoke-2", nodeId: "node-2", command: "system.run" }, { ok: true, payloadJSON: '{"ok":true}' });
        (0, vitest_1.expect)(params.payloadJSON).toBe('{"ok":true}');
    });
    (0, vitest_1.test)("includes payload when provided", function () {
        var params = (0, runner_js_1.buildNodeInvokeResultParams)({ id: "invoke-3", nodeId: "node-3", command: "system.run" }, { ok: false, payload: { reason: "bad" } });
        (0, vitest_1.expect)(params.payload).toEqual({ reason: "bad" });
    });
});
