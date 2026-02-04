"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var loader_js_1 = require("./loader.js");
var tempDirs = [];
var prevBundledDir = process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
var EMPTY_PLUGIN_SCHEMA = { type: "object", additionalProperties: false, properties: {} };
function makeTempDir() {
    var dir = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-plugin-".concat((0, node_crypto_1.randomUUID)()));
    node_fs_1.default.mkdirSync(dir, { recursive: true });
    tempDirs.push(dir);
    return dir;
}
function writePlugin(params) {
    var _a, _b;
    var dir = (_a = params.dir) !== null && _a !== void 0 ? _a : makeTempDir();
    var filename = (_b = params.filename) !== null && _b !== void 0 ? _b : "".concat(params.id, ".js");
    var file = node_path_1.default.join(dir, filename);
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
    if (prevBundledDir === undefined) {
        delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
    }
    else {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = prevBundledDir;
    }
});
(0, vitest_1.describe)("loadOpenClawPlugins", function () {
    (0, vitest_1.it)("disables bundled plugins by default", function () {
        var bundledDir = makeTempDir();
        writePlugin({
            id: "bundled",
            body: "export default { id: \"bundled\", register() {} };",
            dir: bundledDir,
            filename: "bundled.ts",
        });
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = bundledDir;
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            config: {
                plugins: {
                    allow: ["bundled"],
                },
            },
        });
        var bundled = registry.plugins.find(function (entry) { return entry.id === "bundled"; });
        (0, vitest_1.expect)(bundled === null || bundled === void 0 ? void 0 : bundled.status).toBe("disabled");
        var enabledRegistry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            config: {
                plugins: {
                    allow: ["bundled"],
                    entries: {
                        bundled: { enabled: true },
                    },
                },
            },
        });
        var enabled = enabledRegistry.plugins.find(function (entry) { return entry.id === "bundled"; });
        (0, vitest_1.expect)(enabled === null || enabled === void 0 ? void 0 : enabled.status).toBe("loaded");
    });
    (0, vitest_1.it)("loads bundled telegram plugin when enabled", function () {
        var bundledDir = makeTempDir();
        writePlugin({
            id: "telegram",
            body: "export default { id: \"telegram\", register(api) {\n  api.registerChannel({\n    plugin: {\n      id: \"telegram\",\n      meta: {\n        id: \"telegram\",\n        label: \"Telegram\",\n        selectionLabel: \"Telegram\",\n        docsPath: \"/channels/telegram\",\n        blurb: \"telegram channel\"\n      },\n      capabilities: { chatTypes: [\"direct\"] },\n      config: {\n        listAccountIds: () => [],\n        resolveAccount: () => ({ accountId: \"default\" })\n      },\n      outbound: { deliveryMode: \"direct\" }\n    }\n  });\n} };",
            dir: bundledDir,
            filename: "telegram.ts",
        });
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = bundledDir;
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            config: {
                plugins: {
                    allow: ["telegram"],
                    entries: {
                        telegram: { enabled: true },
                    },
                },
            },
        });
        var telegram = registry.plugins.find(function (entry) { return entry.id === "telegram"; });
        (0, vitest_1.expect)(telegram === null || telegram === void 0 ? void 0 : telegram.status).toBe("loaded");
        (0, vitest_1.expect)(registry.channels.some(function (entry) { return entry.plugin.id === "telegram"; })).toBe(true);
    });
    (0, vitest_1.it)("enables bundled memory plugin when selected by slot", function () {
        var bundledDir = makeTempDir();
        writePlugin({
            id: "memory-core",
            body: "export default { id: \"memory-core\", kind: \"memory\", register() {} };",
            dir: bundledDir,
            filename: "memory-core.ts",
        });
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = bundledDir;
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            config: {
                plugins: {
                    slots: {
                        memory: "memory-core",
                    },
                },
            },
        });
        var memory = registry.plugins.find(function (entry) { return entry.id === "memory-core"; });
        (0, vitest_1.expect)(memory === null || memory === void 0 ? void 0 : memory.status).toBe("loaded");
    });
    (0, vitest_1.it)("preserves package.json metadata for bundled memory plugins", function () {
        var bundledDir = makeTempDir();
        var pluginDir = node_path_1.default.join(bundledDir, "memory-core");
        node_fs_1.default.mkdirSync(pluginDir, { recursive: true });
        node_fs_1.default.writeFileSync(node_path_1.default.join(pluginDir, "package.json"), JSON.stringify({
            name: "@openclaw/memory-core",
            version: "1.2.3",
            description: "Memory plugin package",
            openclaw: { extensions: ["./index.ts"] },
        }), "utf-8");
        writePlugin({
            id: "memory-core",
            body: "export default { id: \"memory-core\", kind: \"memory\", name: \"Memory (Core)\", register() {} };",
            dir: pluginDir,
            filename: "index.ts",
        });
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = bundledDir;
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            config: {
                plugins: {
                    slots: {
                        memory: "memory-core",
                    },
                },
            },
        });
        var memory = registry.plugins.find(function (entry) { return entry.id === "memory-core"; });
        (0, vitest_1.expect)(memory === null || memory === void 0 ? void 0 : memory.status).toBe("loaded");
        (0, vitest_1.expect)(memory === null || memory === void 0 ? void 0 : memory.origin).toBe("bundled");
        (0, vitest_1.expect)(memory === null || memory === void 0 ? void 0 : memory.name).toBe("Memory (Core)");
        (0, vitest_1.expect)(memory === null || memory === void 0 ? void 0 : memory.version).toBe("1.2.3");
    });
    (0, vitest_1.it)("loads plugins from config paths", function () {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var plugin = writePlugin({
            id: "allowed",
            body: "export default { id: \"allowed\", register(api) { api.registerGatewayMethod(\"allowed.ping\", ({ respond }) => respond(true, { ok: true })); } };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            workspaceDir: plugin.dir,
            config: {
                plugins: {
                    load: { paths: [plugin.file] },
                    allow: ["allowed"],
                },
            },
        });
        var loaded = registry.plugins.find(function (entry) { return entry.id === "allowed"; });
        (0, vitest_1.expect)(loaded === null || loaded === void 0 ? void 0 : loaded.status).toBe("loaded");
        (0, vitest_1.expect)(Object.keys(registry.gatewayHandlers)).toContain("allowed.ping");
    });
    (0, vitest_1.it)("denylist disables plugins even if allowed", function () {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var plugin = writePlugin({
            id: "blocked",
            body: "export default { id: \"blocked\", register() {} };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            workspaceDir: plugin.dir,
            config: {
                plugins: {
                    load: { paths: [plugin.file] },
                    allow: ["blocked"],
                    deny: ["blocked"],
                },
            },
        });
        var blocked = registry.plugins.find(function (entry) { return entry.id === "blocked"; });
        (0, vitest_1.expect)(blocked === null || blocked === void 0 ? void 0 : blocked.status).toBe("disabled");
    });
    (0, vitest_1.it)("fails fast on invalid plugin config", function () {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var plugin = writePlugin({
            id: "configurable",
            body: "export default { id: \"configurable\", register() {} };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            workspaceDir: plugin.dir,
            config: {
                plugins: {
                    load: { paths: [plugin.file] },
                    entries: {
                        configurable: {
                            config: "nope",
                        },
                    },
                },
            },
        });
        var configurable = registry.plugins.find(function (entry) { return entry.id === "configurable"; });
        (0, vitest_1.expect)(configurable === null || configurable === void 0 ? void 0 : configurable.status).toBe("error");
        (0, vitest_1.expect)(registry.diagnostics.some(function (d) { return d.level === "error"; })).toBe(true);
    });
    (0, vitest_1.it)("registers channel plugins", function () {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var plugin = writePlugin({
            id: "channel-demo",
            body: "export default { id: \"channel-demo\", register(api) {\n  api.registerChannel({\n    plugin: {\n      id: \"demo\",\n      meta: {\n        id: \"demo\",\n        label: \"Demo\",\n        selectionLabel: \"Demo\",\n        docsPath: \"/channels/demo\",\n        blurb: \"demo channel\"\n      },\n      capabilities: { chatTypes: [\"direct\"] },\n      config: {\n        listAccountIds: () => [],\n        resolveAccount: () => ({ accountId: \"default\" })\n      },\n      outbound: { deliveryMode: \"direct\" }\n    }\n  });\n} };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            workspaceDir: plugin.dir,
            config: {
                plugins: {
                    load: { paths: [plugin.file] },
                    allow: ["channel-demo"],
                },
            },
        });
        var channel = registry.channels.find(function (entry) { return entry.plugin.id === "demo"; });
        (0, vitest_1.expect)(channel).toBeDefined();
    });
    (0, vitest_1.it)("registers http handlers", function () {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var plugin = writePlugin({
            id: "http-demo",
            body: "export default { id: \"http-demo\", register(api) {\n  api.registerHttpHandler(async () => false);\n} };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            workspaceDir: plugin.dir,
            config: {
                plugins: {
                    load: { paths: [plugin.file] },
                    allow: ["http-demo"],
                },
            },
        });
        var handler = registry.httpHandlers.find(function (entry) { return entry.pluginId === "http-demo"; });
        (0, vitest_1.expect)(handler).toBeDefined();
        var httpPlugin = registry.plugins.find(function (entry) { return entry.id === "http-demo"; });
        (0, vitest_1.expect)(httpPlugin === null || httpPlugin === void 0 ? void 0 : httpPlugin.httpHandlers).toBe(1);
    });
    (0, vitest_1.it)("registers http routes", function () {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var plugin = writePlugin({
            id: "http-route-demo",
            body: "export default { id: \"http-route-demo\", register(api) {\n  api.registerHttpRoute({ path: \"/demo\", handler: async (_req, res) => { res.statusCode = 200; res.end(\"ok\"); } });\n} };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            workspaceDir: plugin.dir,
            config: {
                plugins: {
                    load: { paths: [plugin.file] },
                    allow: ["http-route-demo"],
                },
            },
        });
        var route = registry.httpRoutes.find(function (entry) { return entry.pluginId === "http-route-demo"; });
        (0, vitest_1.expect)(route).toBeDefined();
        (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.path).toBe("/demo");
        var httpPlugin = registry.plugins.find(function (entry) { return entry.id === "http-route-demo"; });
        (0, vitest_1.expect)(httpPlugin === null || httpPlugin === void 0 ? void 0 : httpPlugin.httpHandlers).toBe(1);
    });
    (0, vitest_1.it)("respects explicit disable in config", function () {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var plugin = writePlugin({
            id: "config-disable",
            body: "export default { id: \"config-disable\", register() {} };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            config: {
                plugins: {
                    load: { paths: [plugin.file] },
                    entries: {
                        "config-disable": { enabled: false },
                    },
                },
            },
        });
        var disabled = registry.plugins.find(function (entry) { return entry.id === "config-disable"; });
        (0, vitest_1.expect)(disabled === null || disabled === void 0 ? void 0 : disabled.status).toBe("disabled");
    });
    (0, vitest_1.it)("enforces memory slot selection", function () {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var memoryA = writePlugin({
            id: "memory-a",
            body: "export default { id: \"memory-a\", kind: \"memory\", register() {} };",
        });
        var memoryB = writePlugin({
            id: "memory-b",
            body: "export default { id: \"memory-b\", kind: \"memory\", register() {} };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            config: {
                plugins: {
                    load: { paths: [memoryA.file, memoryB.file] },
                    slots: { memory: "memory-b" },
                },
            },
        });
        var a = registry.plugins.find(function (entry) { return entry.id === "memory-a"; });
        var b = registry.plugins.find(function (entry) { return entry.id === "memory-b"; });
        (0, vitest_1.expect)(b === null || b === void 0 ? void 0 : b.status).toBe("loaded");
        (0, vitest_1.expect)(a === null || a === void 0 ? void 0 : a.status).toBe("disabled");
    });
    (0, vitest_1.it)("disables memory plugins when slot is none", function () {
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = "/nonexistent/bundled/plugins";
        var memory = writePlugin({
            id: "memory-off",
            body: "export default { id: \"memory-off\", kind: \"memory\", register() {} };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            config: {
                plugins: {
                    load: { paths: [memory.file] },
                    slots: { memory: "none" },
                },
            },
        });
        var entry = registry.plugins.find(function (item) { return item.id === "memory-off"; });
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.status).toBe("disabled");
    });
    (0, vitest_1.it)("prefers higher-precedence plugins with the same id", function () {
        var bundledDir = makeTempDir();
        writePlugin({
            id: "shadow",
            body: "export default { id: \"shadow\", register() {} };",
            dir: bundledDir,
            filename: "shadow.js",
        });
        process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = bundledDir;
        var override = writePlugin({
            id: "shadow",
            body: "export default { id: \"shadow\", register() {} };",
        });
        var registry = (0, loader_js_1.loadOpenClawPlugins)({
            cache: false,
            config: {
                plugins: {
                    load: { paths: [override.file] },
                    entries: {
                        shadow: { enabled: true },
                    },
                },
            },
        });
        var entries = registry.plugins.filter(function (entry) { return entry.id === "shadow"; });
        var loaded = entries.find(function (entry) { return entry.status === "loaded"; });
        var overridden = entries.find(function (entry) { return entry.status === "disabled"; });
        (0, vitest_1.expect)(loaded === null || loaded === void 0 ? void 0 : loaded.origin).toBe("config");
        (0, vitest_1.expect)(overridden === null || overridden === void 0 ? void 0 : overridden.origin).toBe("bundled");
    });
});
