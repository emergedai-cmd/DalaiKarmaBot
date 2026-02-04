"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var hook_runner_global_js_1 = require("../plugins/hook-runner-global.js");
var loader_js_1 = require("../plugins/loader.js");
var session_tool_result_guard_wrapper_js_1 = require("./session-tool-result-guard-wrapper.js");
var EMPTY_PLUGIN_SCHEMA = { type: "object", additionalProperties: false, properties: {} };
function writeTempPlugin(params) {
    var pluginDir = node_path_1.default.join(params.dir, params.id);
    node_fs_1.default.mkdirSync(pluginDir, { recursive: true });
    var file = node_path_1.default.join(pluginDir, "".concat(params.id, ".mjs"));
    node_fs_1.default.writeFileSync(file, params.body, "utf-8");
    node_fs_1.default.writeFileSync(node_path_1.default.join(pluginDir, "openclaw.plugin.json"), JSON.stringify({
        id: params.id,
        configSchema: EMPTY_PLUGIN_SCHEMA,
    }, null, 2), "utf-8");
    return file;
}
(0, vitest_1.afterEach)(function () {
    (0, hook_runner_global_js_1.resetGlobalHookRunner)();
});
(0, vitest_1.describe)("tool_result_persist hook", function () {
    (0, vitest_1.it)("does not modify persisted toolResult messages when no hook is registered", function () {
        var sm = (0, session_tool_result_guard_wrapper_js_1.guardSessionManager)(pi_coding_agent_1.SessionManager.inMemory(), {
            agentId: "main",
            sessionKey: "main",
        });
        sm.appendMessage({
            role: "assistant",
            content: [{ type: "toolCall", id: "call_1", name: "read", arguments: {} }],
        });
        sm.appendMessage({
            role: "toolResult",
            toolCallId: "call_1",
            isError: false,
            content: [{ type: "text", text: "ok" }],
            details: { big: "x".repeat(10000) },
            // oxlint-disable-next-line typescript/no-explicit-any
        });
        var messages = sm
            .getEntries()
            .filter(function (e) { return e.type === "message"; })
            .map(function (e) { return e.message; });
        // oxlint-disable-next-line typescript/no-explicit-any
        var toolResult = messages.find(function (m) { return m.role === "toolResult"; });
        (0, vitest_1.expect)(toolResult).toBeTruthy();
        (0, vitest_1.expect)(toolResult.details).toBeTruthy();
    });
    (0, vitest_1.it)("composes transforms in priority order and allows stripping toolResult.details", function () {
        var tmp = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-toolpersist-"));
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var pluginA = writeTempPlugin({
            dir: tmp,
            id: "persist-a",
            body: "export default { id: \"persist-a\", register(api) {\n  api.on(\"tool_result_persist\", (event, ctx) => {\n    const msg = event.message;\n    // Example: remove large diagnostic payloads before persistence.\n    const { details: _details, ...rest } = msg;\n    return { message: { ...rest, persistOrder: [\"a\"], agentSeen: ctx.agentId ?? null } };\n  }, { priority: 10 });\n} };",
        });
        var pluginB = writeTempPlugin({
            dir: tmp,
            id: "persist-b",
            body: "export default { id: \"persist-b\", register(api) {\n  api.on(\"tool_result_persist\", (event) => {\n    const prior = (event.message && event.message.persistOrder) ? event.message.persistOrder : [];\n    return { message: { ...event.message, persistOrder: [...prior, \"b\"] } };\n  }, { priority: 5 });\n} };",
        });
        (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            workspaceDir: tmp,
            config: {
                plugins: {
                    load: { paths: [pluginA, pluginB] },
                    allow: ["persist-a", "persist-b"],
                },
            },
        });
        var sm = (0, session_tool_result_guard_wrapper_js_1.guardSessionManager)(pi_coding_agent_1.SessionManager.inMemory(), {
            agentId: "main",
            sessionKey: "main",
        });
        // Tool call (so the guard can infer tool name -> id mapping).
        sm.appendMessage({
            role: "assistant",
            content: [{ type: "toolCall", id: "call_1", name: "read", arguments: {} }],
        });
        // Tool result containing a large-ish details payload.
        sm.appendMessage({
            role: "toolResult",
            toolCallId: "call_1",
            isError: false,
            content: [{ type: "text", text: "ok" }],
            details: { big: "x".repeat(10000) },
            // oxlint-disable-next-line typescript/no-explicit-any
        });
        var messages = sm
            .getEntries()
            .filter(function (e) { return e.type === "message"; })
            .map(function (e) { return e.message; });
        // oxlint-disable-next-line typescript/no-explicit-any
        var toolResult = messages.find(function (m) { return m.role === "toolResult"; });
        (0, vitest_1.expect)(toolResult).toBeTruthy();
        // Default behavior: strip details.
        (0, vitest_1.expect)(toolResult.details).toBeUndefined();
        // Hook composition: priority 10 runs before priority 5.
        (0, vitest_1.expect)(toolResult.persistOrder).toEqual(["a", "b"]);
        (0, vitest_1.expect)(toolResult.agentSeen).toBe("main");
    });
});
