"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
require("./test-helpers/fast-coding-tools.js");
var openclaw_tools_js_1 = require("./openclaw-tools.js");
var pi_tools_js_1 = require("./pi-tools.js");
var pi_tools_read_js_1 = require("./pi-tools.read.js");
var browser_tool_js_1 = require("./tools/browser-tool.js");
var defaultTools = (0, pi_tools_js_1.createOpenClawCodingTools)();
(0, vitest_1.describe)("createOpenClawCodingTools", function () {
    (0, vitest_1.describe)("Claude/Gemini alias support", function () {
        (0, vitest_1.it)("adds Claude-style aliases to schemas without dropping metadata", function () {
            var _a, _b, _c;
            var base = {
                name: "write",
                description: "test",
                parameters: {
                    type: "object",
                    required: ["path", "content"],
                    properties: {
                        path: { type: "string", description: "Path" },
                        content: { type: "string", description: "Body" },
                    },
                },
                execute: vitest_1.vi.fn(),
            };
            var patched = pi_tools_js_1.__testing.patchToolSchemaForClaudeCompatibility(base);
            var params = patched.parameters;
            var props = (_a = params.properties) !== null && _a !== void 0 ? _a : {};
            (0, vitest_1.expect)(props.file_path).toEqual(props.path);
            (0, vitest_1.expect)((_b = params.required) !== null && _b !== void 0 ? _b : []).not.toContain("path");
            (0, vitest_1.expect)((_c = params.required) !== null && _c !== void 0 ? _c : []).not.toContain("file_path");
        });
        (0, vitest_1.it)("normalizes file_path to path and enforces required groups at runtime", function () { return __awaiter(void 0, void 0, void 0, function () {
            var execute, tool, wrapped;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        execute = vitest_1.vi.fn(function (_id, args) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, args];
                        }); }); });
                        tool = {
                            name: "write",
                            description: "test",
                            parameters: {
                                type: "object",
                                required: ["path", "content"],
                                properties: {
                                    path: { type: "string" },
                                    content: { type: "string" },
                                },
                            },
                            execute: execute,
                        };
                        wrapped = pi_tools_js_1.__testing.wrapToolParamNormalization(tool, [{ keys: ["path", "file_path"] }]);
                        return [4 /*yield*/, wrapped.execute("tool-1", { file_path: "foo.txt", content: "x" })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(execute).toHaveBeenCalledWith("tool-1", { path: "foo.txt", content: "x" }, undefined, undefined);
                        return [4 /*yield*/, (0, vitest_1.expect)(wrapped.execute("tool-2", { content: "x" })).rejects.toThrow(/Missing required parameter/)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, vitest_1.expect)(wrapped.execute("tool-3", { file_path: "   ", content: "x" })).rejects.toThrow(/Missing required parameter/)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.it)("keeps browser tool schema OpenAI-compatible without normalization", function () {
        var browser = (0, browser_tool_js_1.createBrowserTool)();
        var schema = browser.parameters;
        (0, vitest_1.expect)(schema.type).toBe("object");
        (0, vitest_1.expect)(schema.anyOf).toBeUndefined();
    });
    (0, vitest_1.it)("mentions Chrome extension relay in browser tool description", function () {
        var browser = (0, browser_tool_js_1.createBrowserTool)();
        (0, vitest_1.expect)(browser.description).toMatch(/Chrome extension/i);
        (0, vitest_1.expect)(browser.description).toMatch(/profile="chrome"/i);
    });
    (0, vitest_1.it)("keeps browser tool schema properties after normalization", function () {
        var _a, _b, _c, _d, _e;
        var browser = defaultTools.find(function (tool) { return tool.name === "browser"; });
        (0, vitest_1.expect)(browser).toBeDefined();
        var parameters = browser === null || browser === void 0 ? void 0 : browser.parameters;
        (0, vitest_1.expect)((_a = parameters.properties) === null || _a === void 0 ? void 0 : _a.action).toBeDefined();
        (0, vitest_1.expect)((_b = parameters.properties) === null || _b === void 0 ? void 0 : _b.target).toBeDefined();
        (0, vitest_1.expect)((_c = parameters.properties) === null || _c === void 0 ? void 0 : _c.targetUrl).toBeDefined();
        (0, vitest_1.expect)((_d = parameters.properties) === null || _d === void 0 ? void 0 : _d.request).toBeDefined();
        (0, vitest_1.expect)((_e = parameters.required) !== null && _e !== void 0 ? _e : []).toContain("action");
    });
    (0, vitest_1.it)("exposes raw for gateway config.apply tool calls", function () {
        var _a, _b;
        var gateway = defaultTools.find(function (tool) { return tool.name === "gateway"; });
        (0, vitest_1.expect)(gateway).toBeDefined();
        var parameters = gateway === null || gateway === void 0 ? void 0 : gateway.parameters;
        (0, vitest_1.expect)(parameters.type).toBe("object");
        (0, vitest_1.expect)((_a = parameters.properties) === null || _a === void 0 ? void 0 : _a.raw).toBeDefined();
        (0, vitest_1.expect)((_b = parameters.required) !== null && _b !== void 0 ? _b : []).not.toContain("raw");
    });
    (0, vitest_1.it)("flattens anyOf-of-literals to enum for provider compatibility", function () {
        var _a, _b;
        var browser = defaultTools.find(function (tool) { return tool.name === "browser"; });
        (0, vitest_1.expect)(browser).toBeDefined();
        var parameters = browser === null || browser === void 0 ? void 0 : browser.parameters;
        var action = (_a = parameters.properties) === null || _a === void 0 ? void 0 : _a.action;
        (0, vitest_1.expect)(action === null || action === void 0 ? void 0 : action.type).toBe("string");
        (0, vitest_1.expect)(action === null || action === void 0 ? void 0 : action.anyOf).toBeUndefined();
        (0, vitest_1.expect)(Array.isArray(action === null || action === void 0 ? void 0 : action.enum)).toBe(true);
        (0, vitest_1.expect)(action === null || action === void 0 ? void 0 : action.enum).toContain("act");
        var snapshotFormat = (_b = parameters.properties) === null || _b === void 0 ? void 0 : _b.snapshotFormat;
        (0, vitest_1.expect)(snapshotFormat === null || snapshotFormat === void 0 ? void 0 : snapshotFormat.type).toBe("string");
        (0, vitest_1.expect)(snapshotFormat === null || snapshotFormat === void 0 ? void 0 : snapshotFormat.anyOf).toBeUndefined();
        (0, vitest_1.expect)(snapshotFormat === null || snapshotFormat === void 0 ? void 0 : snapshotFormat.enum).toEqual(["aria", "ai"]);
    });
    (0, vitest_1.it)("inlines local $ref before removing unsupported keywords", function () {
        var _a;
        var cleaned = pi_tools_js_1.__testing.cleanToolSchemaForGemini({
            type: "object",
            properties: {
                foo: { $ref: "#/$defs/Foo" },
            },
            $defs: {
                Foo: { type: "string", enum: ["a", "b"] },
            },
        });
        (0, vitest_1.expect)(cleaned.$defs).toBeUndefined();
        (0, vitest_1.expect)(cleaned.properties).toBeDefined();
        (0, vitest_1.expect)((_a = cleaned.properties) === null || _a === void 0 ? void 0 : _a.foo).toMatchObject({
            type: "string",
            enum: ["a", "b"],
        });
    });
    (0, vitest_1.it)("cleans tuple items schemas", function () {
        var _a;
        var cleaned = pi_tools_js_1.__testing.cleanToolSchemaForGemini({
            type: "object",
            properties: {
                tuples: {
                    type: "array",
                    items: [
                        { type: "string", format: "uuid" },
                        { type: "number", minimum: 1 },
                    ],
                },
            },
        });
        var tuples = (_a = cleaned.properties) === null || _a === void 0 ? void 0 : _a.tuples;
        var items = Array.isArray(tuples === null || tuples === void 0 ? void 0 : tuples.items) ? tuples === null || tuples === void 0 ? void 0 : tuples.items : [];
        var first = items[0];
        var second = items[1];
        (0, vitest_1.expect)(first === null || first === void 0 ? void 0 : first.format).toBeUndefined();
        (0, vitest_1.expect)(second === null || second === void 0 ? void 0 : second.minimum).toBeUndefined();
    });
    (0, vitest_1.it)("drops null-only union variants without flattening other unions", function () {
        var _a, _b;
        var cleaned = pi_tools_js_1.__testing.cleanToolSchemaForGemini({
            type: "object",
            properties: {
                parentId: { anyOf: [{ type: "string" }, { type: "null" }] },
                count: { oneOf: [{ type: "string" }, { type: "number" }] },
            },
        });
        var parentId = (_a = cleaned.properties) === null || _a === void 0 ? void 0 : _a.parentId;
        var count = (_b = cleaned.properties) === null || _b === void 0 ? void 0 : _b.count;
        (0, vitest_1.expect)(parentId === null || parentId === void 0 ? void 0 : parentId.type).toBe("string");
        (0, vitest_1.expect)(parentId === null || parentId === void 0 ? void 0 : parentId.anyOf).toBeUndefined();
        (0, vitest_1.expect)(count === null || count === void 0 ? void 0 : count.oneOf).toBeDefined();
    });
    (0, vitest_1.it)("avoids anyOf/oneOf/allOf in tool schemas", function () {
        var offenders = [];
        var keywords = new Set(["anyOf", "oneOf", "allOf"]);
        var walk = function (value, path, name) {
            if (!value) {
                return;
            }
            if (Array.isArray(value)) {
                for (var _i = 0, _a = value.entries(); _i < _a.length; _i++) {
                    var _b = _a[_i], index = _b[0], entry = _b[1];
                    walk(entry, "".concat(path, "[").concat(index, "]"), name);
                }
                return;
            }
            if (typeof value !== "object") {
                return;
            }
            var record = value;
            for (var _c = 0, _d = Object.entries(record); _c < _d.length; _c++) {
                var _e = _d[_c], key = _e[0], entry = _e[1];
                var nextPath = path ? "".concat(path, ".").concat(key) : key;
                if (keywords.has(key)) {
                    offenders.push({ name: name, keyword: key, path: nextPath });
                }
                walk(entry, nextPath, name);
            }
        };
        for (var _i = 0, defaultTools_1 = defaultTools; _i < defaultTools_1.length; _i++) {
            var tool = defaultTools_1[_i];
            walk(tool.parameters, "", tool.name);
        }
        (0, vitest_1.expect)(offenders).toEqual([]);
    });
    (0, vitest_1.it)("keeps raw core tool schemas union-free", function () {
        var tools = (0, openclaw_tools_js_1.createOpenClawTools)();
        var coreTools = new Set([
            "browser",
            "canvas",
            "nodes",
            "cron",
            "message",
            "gateway",
            "agents_list",
            "sessions_list",
            "sessions_history",
            "sessions_send",
            "sessions_spawn",
            "session_status",
            "image",
        ]);
        var offenders = [];
        var keywords = new Set(["anyOf", "oneOf", "allOf"]);
        var walk = function (value, path, name) {
            if (!value) {
                return;
            }
            if (Array.isArray(value)) {
                for (var _i = 0, _a = value.entries(); _i < _a.length; _i++) {
                    var _b = _a[_i], index = _b[0], entry = _b[1];
                    walk(entry, "".concat(path, "[").concat(index, "]"), name);
                }
                return;
            }
            if (typeof value !== "object") {
                return;
            }
            var record = value;
            for (var _c = 0, _d = Object.entries(record); _c < _d.length; _c++) {
                var _e = _d[_c], key = _e[0], entry = _e[1];
                var nextPath = path ? "".concat(path, ".").concat(key) : key;
                if (keywords.has(key)) {
                    offenders.push({ name: name, keyword: key, path: nextPath });
                }
                walk(entry, nextPath, name);
            }
        };
        for (var _i = 0, tools_1 = tools; _i < tools_1.length; _i++) {
            var tool = tools_1[_i];
            if (!coreTools.has(tool.name)) {
                continue;
            }
            walk(tool.parameters, "", tool.name);
        }
        (0, vitest_1.expect)(offenders).toEqual([]);
    });
    (0, vitest_1.it)("does not expose provider-specific message tools", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({ messageProvider: "discord" });
        var names = new Set(tools.map(function (tool) { return tool.name; }));
        (0, vitest_1.expect)(names.has("discord")).toBe(false);
        (0, vitest_1.expect)(names.has("slack")).toBe(false);
        (0, vitest_1.expect)(names.has("telegram")).toBe(false);
        (0, vitest_1.expect)(names.has("whatsapp")).toBe(false);
    });
    (0, vitest_1.it)("filters session tools for sub-agent sessions by default", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            sessionKey: "agent:main:subagent:test",
        });
        var names = new Set(tools.map(function (tool) { return tool.name; }));
        (0, vitest_1.expect)(names.has("sessions_list")).toBe(false);
        (0, vitest_1.expect)(names.has("sessions_history")).toBe(false);
        (0, vitest_1.expect)(names.has("sessions_send")).toBe(false);
        (0, vitest_1.expect)(names.has("sessions_spawn")).toBe(false);
        (0, vitest_1.expect)(names.has("read")).toBe(true);
        (0, vitest_1.expect)(names.has("exec")).toBe(true);
        (0, vitest_1.expect)(names.has("process")).toBe(true);
        (0, vitest_1.expect)(names.has("apply_patch")).toBe(false);
    });
    (0, vitest_1.it)("supports allow-only sub-agent tool policy", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            sessionKey: "agent:main:subagent:test",
            // Intentionally partial config; only fields used by pi-tools are provided.
            config: {
                tools: {
                    subagents: {
                        tools: {
                            // Policy matching is case-insensitive
                            allow: ["read"],
                        },
                    },
                },
            },
        });
        (0, vitest_1.expect)(tools.map(function (tool) { return tool.name; })).toEqual(["read"]);
    });
    (0, vitest_1.it)("applies tool profiles before allow/deny policies", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: { tools: { profile: "messaging" } },
        });
        var names = new Set(tools.map(function (tool) { return tool.name; }));
        (0, vitest_1.expect)(names.has("message")).toBe(true);
        (0, vitest_1.expect)(names.has("sessions_send")).toBe(true);
        (0, vitest_1.expect)(names.has("sessions_spawn")).toBe(false);
        (0, vitest_1.expect)(names.has("exec")).toBe(false);
        (0, vitest_1.expect)(names.has("browser")).toBe(false);
    });
    (0, vitest_1.it)("expands group shorthands in global tool policy", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: { tools: { allow: ["group:fs"] } },
        });
        var names = new Set(tools.map(function (tool) { return tool.name; }));
        (0, vitest_1.expect)(names.has("read")).toBe(true);
        (0, vitest_1.expect)(names.has("write")).toBe(true);
        (0, vitest_1.expect)(names.has("edit")).toBe(true);
        (0, vitest_1.expect)(names.has("exec")).toBe(false);
        (0, vitest_1.expect)(names.has("browser")).toBe(false);
    });
    (0, vitest_1.it)("expands group shorthands in global tool deny policy", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            config: { tools: { deny: ["group:fs"] } },
        });
        var names = new Set(tools.map(function (tool) { return tool.name; }));
        (0, vitest_1.expect)(names.has("read")).toBe(false);
        (0, vitest_1.expect)(names.has("write")).toBe(false);
        (0, vitest_1.expect)(names.has("edit")).toBe(false);
        (0, vitest_1.expect)(names.has("exec")).toBe(true);
    });
    (0, vitest_1.it)("lets agent profiles override global profiles", function () {
        var tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
            sessionKey: "agent:work:main",
            config: {
                tools: { profile: "coding" },
                agents: {
                    list: [{ id: "work", tools: { profile: "messaging" } }],
                },
            },
        });
        var names = new Set(tools.map(function (tool) { return tool.name; }));
        (0, vitest_1.expect)(names.has("message")).toBe(true);
        (0, vitest_1.expect)(names.has("exec")).toBe(false);
        (0, vitest_1.expect)(names.has("read")).toBe(false);
    });
    (0, vitest_1.it)("removes unsupported JSON Schema keywords for Cloud Code Assist API compatibility", function () {
        // Helper to recursively check schema for unsupported keywords
        var unsupportedKeywords = new Set([
            "patternProperties",
            "additionalProperties",
            "$schema",
            "$id",
            "$ref",
            "$defs",
            "definitions",
            "examples",
            "minLength",
            "maxLength",
            "minimum",
            "maximum",
            "multipleOf",
            "pattern",
            "format",
            "minItems",
            "maxItems",
            "uniqueItems",
            "minProperties",
            "maxProperties",
        ]);
        var findUnsupportedKeywords = function (schema, path) {
            var found = [];
            if (!schema || typeof schema !== "object") {
                return found;
            }
            if (Array.isArray(schema)) {
                schema.forEach(function (item, i) {
                    found.push.apply(found, findUnsupportedKeywords(item, "".concat(path, "[").concat(i, "]")));
                });
                return found;
            }
            var record = schema;
            var properties = record.properties &&
                typeof record.properties === "object" &&
                !Array.isArray(record.properties)
                ? record.properties
                : undefined;
            if (properties) {
                for (var _i = 0, _a = Object.entries(properties); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    found.push.apply(found, findUnsupportedKeywords(value, "".concat(path, ".properties.").concat(key)));
                }
            }
            for (var _c = 0, _d = Object.entries(record); _c < _d.length; _c++) {
                var _e = _d[_c], key = _e[0], value = _e[1];
                if (key === "properties") {
                    continue;
                }
                if (unsupportedKeywords.has(key)) {
                    found.push("".concat(path, ".").concat(key));
                }
                if (value && typeof value === "object") {
                    found.push.apply(found, findUnsupportedKeywords(value, "".concat(path, ".").concat(key)));
                }
            }
            return found;
        };
        for (var _i = 0, defaultTools_2 = defaultTools; _i < defaultTools_2.length; _i++) {
            var tool = defaultTools_2[_i];
            var violations = findUnsupportedKeywords(tool.parameters, "".concat(tool.name, ".parameters"));
            (0, vitest_1.expect)(violations).toEqual([]);
        }
    });
    (0, vitest_1.it)("applies sandbox path guards to file_path alias", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, outsidePath, readTool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sbx-"))];
                case 1:
                    tmpDir = _a.sent();
                    outsidePath = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-outside.txt");
                    return [4 /*yield*/, promises_1.default.writeFile(outsidePath, "outside", "utf8")];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 8]);
                    readTool = (0, pi_tools_read_js_1.createSandboxedReadTool)(tmpDir);
                    return [4 /*yield*/, (0, vitest_1.expect)(readTool.execute("sandbox-1", { file_path: outsidePath })).rejects.toThrow(/sandbox root/i)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, promises_1.default.rm(outsidePath, { force: true })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
