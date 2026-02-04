"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
var lobster_tool_js_1 = require("./src/lobster-tool.js");
function register(api) {
    api.registerTool(function (ctx) {
        if (ctx.sandboxed) {
            return null;
        }
        return (0, lobster_tool_js_1.createLobsterTool)(api);
    }, { optional: true });
}
