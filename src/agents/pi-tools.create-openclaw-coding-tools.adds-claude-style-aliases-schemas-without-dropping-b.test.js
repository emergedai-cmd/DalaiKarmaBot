"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
require("./test-helpers/fast-coding-tools.js");
var pi_tools_js_1 = require("./pi-tools.js");
var defaultTools = (0, pi_tools_js_1.createOpenClawCodingTools)();
(0, vitest_1.describe)("createOpenClawCodingTools", function () {
    (0, vitest_1.it)("preserves action enums in normalized schemas", function () {
        var _a;
        var toolNames = ["browser", "canvas", "nodes", "cron", "gateway", "message"];
        var collectActionValues = function (schema, values) {
            if (!schema || typeof schema !== "object") {
                return;
            }
            var record = schema;
            if (typeof record.const === "string") {
                values.add(record.const);
            }
            if (Array.isArray(record.enum)) {
                for (var _i = 0, _a = record.enum; _i < _a.length; _i++) {
                    var value = _a[_i];
                    if (typeof value === "string") {
                        values.add(value);
                    }
                }
            }
            if (Array.isArray(record.anyOf)) {
                for (var _b = 0, _c = record.anyOf; _b < _c.length; _b++) {
                    var variant = _c[_b];
                    collectActionValues(variant, values);
                }
            }
        };
        var _loop_1 = function (name_1) {
            var tool = defaultTools.find(function (candidate) { return candidate.name === name_1; });
            (0, vitest_1.expect)(tool).toBeDefined();
            var parameters = tool === null || tool === void 0 ? void 0 : tool.parameters;
            var action = (_a = parameters.properties) === null || _a === void 0 ? void 0 : _a.action;
            var values = new Set();
            collectActionValues(action, values);
            var min = name_1 === "gateway"
                ? 1
                : // Most tools expose multiple actions; keep this signal so schemas stay useful to models.
                    2;
            (0, vitest_1.expect)(values.size).toBeGreaterThanOrEqual(min);
        };
        for (var _i = 0, toolNames_1 = toolNames; _i < toolNames_1.length; _i++) {
            var name_1 = toolNames_1[_i];
            _loop_1(name_1);
        }
    });
    (0, vitest_1.it)("includes exec and process tools by default", function () {
        (0, vitest_1.expect)(defaultTools.some(function (tool) { return tool.name === "exec"; })).toBe(true);
        (0, vitest_1.expect)(defaultTools.some(function (tool) { return tool.name === "process"; })).toBe(true);
        (0, vitest_1.expect)(defaultTools.some(function (tool) { return tool.name === "apply_patch"; })).toBe(false);
    });
    (0, vitest_1.it)("gates apply_patch behind tools.exec.applyPatch for OpenAI models", function () {
        var config = {
            tools: {
                exec: {
                    applyPatch: { enabled: true },
                },
            },
        };
        var openAiTools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: config,
            modelProvider: "openai",
            modelId: "gpt-5.2",
        });
        (0, vitest_1.expect)(openAiTools.some(function (tool) { return tool.name === "apply_patch"; })).toBe(true);
        var anthropicTools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: config,
            modelProvider: "anthropic",
            modelId: "claude-opus-4-5",
        });
        (0, vitest_1.expect)(anthropicTools.some(function (tool) { return tool.name === "apply_patch"; })).toBe(false);
    });
    (0, vitest_1.it)("respects apply_patch allowModels", function () {
        var config = {
            tools: {
                exec: {
                    applyPatch: { enabled: true, allowModels: ["gpt-5.2"] },
                },
            },
        };
        var allowed = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: config,
            modelProvider: "openai",
            modelId: "gpt-5.2",
        });
        (0, vitest_1.expect)(allowed.some(function (tool) { return tool.name === "apply_patch"; })).toBe(true);
        var denied = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: config,
            modelProvider: "openai",
            modelId: "gpt-5-mini",
        });
        (0, vitest_1.expect)(denied.some(function (tool) { return tool.name === "apply_patch"; })).toBe(false);
    });
    (0, vitest_1.it)("keeps canonical tool names for Anthropic OAuth (pi-ai remaps on the wire)", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            modelProvider: "anthropic",
            modelAuthMode: "oauth",
        });
        var names = new Set(tools.map(function (tool) { return tool.name; }));
        (0, vitest_1.expect)(names.has("exec")).toBe(true);
        (0, vitest_1.expect)(names.has("read")).toBe(true);
        (0, vitest_1.expect)(names.has("write")).toBe(true);
        (0, vitest_1.expect)(names.has("edit")).toBe(true);
        (0, vitest_1.expect)(names.has("apply_patch")).toBe(false);
    });
    (0, vitest_1.it)("provides top-level object schemas for all tools", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)();
        var offenders = tools
            .map(function (tool) {
            var schema = tool.parameters && typeof tool.parameters === "object"
                ? tool.parameters
                : null;
            return {
                name: tool.name,
                type: schema === null || schema === void 0 ? void 0 : schema.type,
                keys: schema ? Object.keys(schema).toSorted() : null,
            };
        })
            .filter(function (entry) { return entry.type !== "object"; });
        (0, vitest_1.expect)(offenders).toEqual([]);
    });
});
