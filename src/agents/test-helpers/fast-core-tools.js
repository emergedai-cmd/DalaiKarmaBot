"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var stubTool = function (name) { return ({
    name: name,
    description: "".concat(name, " stub"),
    parameters: { type: "object", properties: {} },
    execute: vitest_1.vi.fn(),
}); };
vitest_1.vi.mock("../tools/browser-tool.js", function () { return ({
    createBrowserTool: function () { return stubTool("browser"); },
}); });
vitest_1.vi.mock("../tools/canvas-tool.js", function () { return ({
    createCanvasTool: function () { return stubTool("canvas"); },
}); });
vitest_1.vi.mock("../tools/image-tool.js", function () { return ({
    createImageTool: function () { return stubTool("image"); },
}); });
vitest_1.vi.mock("../tools/web-tools.js", function () { return ({
    createWebSearchTool: function () { return null; },
    createWebFetchTool: function () { return null; },
}); });
vitest_1.vi.mock("../../plugins/tools.js", function () { return ({
    resolvePluginTools: function () { return []; },
    getPluginToolMeta: function () { return undefined; },
}); });
