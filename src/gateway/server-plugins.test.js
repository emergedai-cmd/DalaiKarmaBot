"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var server_plugins_js_1 = require("./server-plugins.js");
var loadOpenClawPlugins = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
vitest_1.vi.mock("../plugins/loader.js", function () { return ({
    loadOpenClawPlugins: loadOpenClawPlugins,
}); });
var createRegistry = function (diagnostics) { return ({
    plugins: [],
    tools: [],
    hooks: [],
    typedHooks: [],
    channels: [],
    providers: [],
    gatewayHandlers: {},
    httpHandlers: [],
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    diagnostics: diagnostics,
}); };
(0, vitest_1.describe)("loadGatewayPlugins", function () {
    (0, vitest_1.test)("logs plugin errors with details", function () {
        var diagnostics = [
            {
                level: "error",
                pluginId: "telegram",
                source: "/tmp/telegram/index.ts",
                message: "failed to load plugin: boom",
            },
        ];
        loadOpenClawPlugins.mockReturnValue(createRegistry(diagnostics));
        var log = {
            info: vitest_1.vi.fn(),
            warn: vitest_1.vi.fn(),
            error: vitest_1.vi.fn(),
            debug: vitest_1.vi.fn(),
        };
        (0, server_plugins_js_1.loadGatewayPlugins)({
            cfg: {},
            workspaceDir: "/tmp",
            log: log,
            coreGatewayHandlers: {},
            baseMethods: [],
        });
        (0, vitest_1.expect)(log.error).toHaveBeenCalledWith("[plugins] failed to load plugin: boom (plugin=telegram, source=/tmp/telegram/index.ts)");
        (0, vitest_1.expect)(log.warn).not.toHaveBeenCalled();
    });
});
