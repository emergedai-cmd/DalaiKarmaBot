"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var tools_js_1 = require("./tools.js");
var tempDirs = [];
var EMPTY_PLUGIN_SCHEMA = { type: "object", additionalProperties: false, properties: {} };
function makeTempDir() {
    var dir = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-plugin-tools-".concat((0, node_crypto_1.randomUUID)()));
    node_fs_1.default.mkdirSync(dir, { recursive: true });
    tempDirs.push(dir);
    return dir;
}
function writePlugin(params) {
    var dir = makeTempDir();
    var file = node_path_1.default.join(dir, "".concat(params.id, ".js"));
    node_fs_1.default.writeFileSync(file, params.body, "utf-8");
    node_fs_1.default.writeFileSync(node_path_1.default.join(dir, "openclaw.plugin.json"), JSON.stringify({
        id: params.id,
        configSchema: EMPTY_PLUGIN_SCHEMA,
    }, null, 2), "utf-8");
    return { dir: dir, file: file, id: params.id };
}
(0, vitest_1.afterEach)(function () {
    for (var _i = 0, _a = tempDirs.splice(0); _i < _a.length; _i++) {
        var dir = _a[_i];
        try {
            node_fs_1.default.rmSync(dir, { recursive: true, force: true });
        }
        catch (_b) {
            // ignore cleanup failures
        }
    }
});
(0, vitest_1.describe)("resolvePluginTools optional tools", function () {
    var pluginBody = "\nexport default { register(api) {\n  api.registerTool(\n    {\n      name: \"optional_tool\",\n      description: \"optional tool\",\n      parameters: { type: \"object\", properties: {} },\n      async execute() {\n        return { content: [{ type: \"text\", text: \"ok\" }] };\n      },\n    },\n    { optional: true },\n  );\n} }\n";
    (0, vitest_1.it)("skips optional tools without explicit allowlist", function () {
        var plugin = writePlugin({ id: "optional-demo", body: pluginBody });
        var tools = (0, tools_js_1.resolvePluginTools)({
            context: {
                config: {
                    plugins: {
                        load: { paths: [plugin.file] },
                        allow: [plugin.id],
                    },
                },
                workspaceDir: plugin.dir,
            },
        });
        (0, vitest_1.expect)(tools).toHaveLength(0);
    });
    (0, vitest_1.it)("allows optional tools by name", function () {
        var plugin = writePlugin({ id: "optional-demo", body: pluginBody });
        var tools = (0, tools_js_1.resolvePluginTools)({
            context: {
                config: {
                    plugins: {
                        load: { paths: [plugin.file] },
                        allow: [plugin.id],
                    },
                },
                workspaceDir: plugin.dir,
            },
            toolAllowlist: ["optional_tool"],
        });
        (0, vitest_1.expect)(tools.map(function (tool) { return tool.name; })).toContain("optional_tool");
    });
    (0, vitest_1.it)("allows optional tools via plugin groups", function () {
        var plugin = writePlugin({ id: "optional-demo", body: pluginBody });
        var toolsAll = (0, tools_js_1.resolvePluginTools)({
            context: {
                config: {
                    plugins: {
                        load: { paths: [plugin.file] },
                        allow: [plugin.id],
                    },
                },
                workspaceDir: plugin.dir,
            },
            toolAllowlist: ["group:plugins"],
        });
        (0, vitest_1.expect)(toolsAll.map(function (tool) { return tool.name; })).toContain("optional_tool");
        var toolsPlugin = (0, tools_js_1.resolvePluginTools)({
            context: {
                config: {
                    plugins: {
                        load: { paths: [plugin.file] },
                        allow: [plugin.id],
                    },
                },
                workspaceDir: plugin.dir,
            },
            toolAllowlist: ["optional-demo"],
        });
        (0, vitest_1.expect)(toolsPlugin.map(function (tool) { return tool.name; })).toContain("optional_tool");
    });
    (0, vitest_1.it)("rejects plugin id collisions with core tool names", function () {
        var plugin = writePlugin({ id: "message", body: pluginBody });
        var tools = (0, tools_js_1.resolvePluginTools)({
            context: {
                config: {
                    plugins: {
                        load: { paths: [plugin.file] },
                        allow: [plugin.id],
                    },
                },
                workspaceDir: plugin.dir,
            },
            existingToolNames: new Set(["message"]),
            toolAllowlist: ["message"],
        });
        (0, vitest_1.expect)(tools).toHaveLength(0);
    });
    (0, vitest_1.it)("skips conflicting tool names but keeps other tools", function () {
        var plugin = writePlugin({
            id: "multi",
            body: "\nexport default { register(api) {\n  api.registerTool({\n    name: \"message\",\n    description: \"conflict\",\n    parameters: { type: \"object\", properties: {} },\n    async execute() {\n      return { content: [{ type: \"text\", text: \"nope\" }] };\n    },\n  });\n  api.registerTool({\n    name: \"other_tool\",\n    description: \"ok\",\n    parameters: { type: \"object\", properties: {} },\n    async execute() {\n      return { content: [{ type: \"text\", text: \"ok\" }] };\n    },\n  });\n} }\n",
        });
        var tools = (0, tools_js_1.resolvePluginTools)({
            context: {
                config: {
                    plugins: {
                        load: { paths: [plugin.file] },
                        allow: [plugin.id],
                    },
                },
                workspaceDir: plugin.dir,
            },
            existingToolNames: new Set(["message"]),
        });
        (0, vitest_1.expect)(tools.map(function (tool) { return tool.name; })).toEqual(["other_tool"]);
    });
});
