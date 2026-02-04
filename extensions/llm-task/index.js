"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
var llm_task_tool_js_1 = require("./src/llm-task-tool.js");
function register(api) {
    api.registerTool((0, llm_task_tool_js_1.createLlmTaskTool)(api), { optional: true });
}
