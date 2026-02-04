"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var includes_js_1 = require("./includes.js");
var ROOT_DIR = node_path_1.default.parse(process.cwd()).root;
var CONFIG_DIR = node_path_1.default.join(ROOT_DIR, "config");
var ETC_OPENCLAW_DIR = node_path_1.default.join(ROOT_DIR, "etc", "openclaw");
var SHARED_DIR = node_path_1.default.join(ROOT_DIR, "shared");
var DEFAULT_BASE_PATH = node_path_1.default.join(CONFIG_DIR, "openclaw.json");
function configPath() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    return node_path_1.default.join.apply(node_path_1.default, __spreadArray([CONFIG_DIR], parts, false));
}
function etcOpenClawPath() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    return node_path_1.default.join.apply(node_path_1.default, __spreadArray([ETC_OPENCLAW_DIR], parts, false));
}
function sharedPath() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    return node_path_1.default.join.apply(node_path_1.default, __spreadArray([SHARED_DIR], parts, false));
}
function createMockResolver(files) {
    return {
        readFile: function (filePath) {
            if (filePath in files) {
                return JSON.stringify(files[filePath]);
            }
            throw new Error("ENOENT: no such file: ".concat(filePath));
        },
        parseJson: JSON.parse,
    };
}
function resolve(obj, files, basePath) {
    if (files === void 0) { files = {}; }
    if (basePath === void 0) { basePath = DEFAULT_BASE_PATH; }
    return (0, includes_js_1.resolveConfigIncludes)(obj, basePath, createMockResolver(files));
}
(0, vitest_1.describe)("resolveConfigIncludes", function () {
    (0, vitest_1.it)("passes through primitives unchanged", function () {
        (0, vitest_1.expect)(resolve("hello")).toBe("hello");
        (0, vitest_1.expect)(resolve(42)).toBe(42);
        (0, vitest_1.expect)(resolve(true)).toBe(true);
        (0, vitest_1.expect)(resolve(null)).toBe(null);
    });
    (0, vitest_1.it)("passes through arrays with recursion", function () {
        (0, vitest_1.expect)(resolve([1, 2, { a: 1 }])).toEqual([1, 2, { a: 1 }]);
    });
    (0, vitest_1.it)("passes through objects without $include", function () {
        var obj = { foo: "bar", nested: { x: 1 } };
        (0, vitest_1.expect)(resolve(obj)).toEqual(obj);
    });
    (0, vitest_1.it)("resolves single file $include", function () {
        var _a;
        var files = (_a = {}, _a[configPath("agents.json")] = { list: [{ id: "main" }] }, _a);
        var obj = { agents: { $include: "./agents.json" } };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({
            agents: { list: [{ id: "main" }] },
        });
    });
    (0, vitest_1.it)("resolves absolute path $include", function () {
        var _a;
        var absolute = etcOpenClawPath("agents.json");
        var files = (_a = {}, _a[absolute] = { list: [{ id: "main" }] }, _a);
        var obj = { agents: { $include: absolute } };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({
            agents: { list: [{ id: "main" }] },
        });
    });
    (0, vitest_1.it)("resolves array $include with deep merge", function () {
        var _a;
        var files = (_a = {},
            _a[configPath("a.json")] = { "group-a": ["agent1"] },
            _a[configPath("b.json")] = { "group-b": ["agent2"] },
            _a);
        var obj = { broadcast: { $include: ["./a.json", "./b.json"] } };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({
            broadcast: {
                "group-a": ["agent1"],
                "group-b": ["agent2"],
            },
        });
    });
    (0, vitest_1.it)("deep merges overlapping keys in array $include", function () {
        var _a;
        var files = (_a = {},
            _a[configPath("a.json")] = { agents: { defaults: { workspace: "~/a" } } },
            _a[configPath("b.json")] = { agents: { list: [{ id: "main" }] } },
            _a);
        var obj = { $include: ["./a.json", "./b.json"] };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({
            agents: {
                defaults: { workspace: "~/a" },
                list: [{ id: "main" }],
            },
        });
    });
    (0, vitest_1.it)("merges $include with sibling keys", function () {
        var _a;
        var files = (_a = {}, _a[configPath("base.json")] = { a: 1, b: 2 }, _a);
        var obj = { $include: "./base.json", c: 3 };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({ a: 1, b: 2, c: 3 });
    });
    (0, vitest_1.it)("sibling keys override included values", function () {
        var _a;
        var files = (_a = {}, _a[configPath("base.json")] = { a: 1, b: 2 }, _a);
        var obj = { $include: "./base.json", b: 99 };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({ a: 1, b: 99 });
    });
    (0, vitest_1.it)("throws when sibling keys are used with non-object includes", function () {
        var _a;
        var files = (_a = {}, _a[configPath("list.json")] = ["a", "b"], _a);
        var obj = { $include: "./list.json", extra: true };
        (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(includes_js_1.ConfigIncludeError);
        (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(/Sibling keys require included content to be an object/);
    });
    (0, vitest_1.it)("throws when sibling keys are used with primitive includes", function () {
        var _a;
        var files = (_a = {}, _a[configPath("value.json")] = "hello", _a);
        var obj = { $include: "./value.json", extra: true };
        (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(includes_js_1.ConfigIncludeError);
        (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(/Sibling keys require included content to be an object/);
    });
    (0, vitest_1.it)("resolves nested includes", function () {
        var _a;
        var files = (_a = {},
            _a[configPath("level1.json")] = { nested: { $include: "./level2.json" } },
            _a[configPath("level2.json")] = { deep: "value" },
            _a);
        var obj = { $include: "./level1.json" };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({
            nested: { deep: "value" },
        });
    });
    (0, vitest_1.it)("throws ConfigIncludeError for missing file", function () {
        var obj = { $include: "./missing.json" };
        (0, vitest_1.expect)(function () { return resolve(obj); }).toThrow(includes_js_1.ConfigIncludeError);
        (0, vitest_1.expect)(function () { return resolve(obj); }).toThrow(/Failed to read include file/);
    });
    (0, vitest_1.it)("throws ConfigIncludeError for invalid JSON", function () {
        var resolver = {
            readFile: function () { return "{ invalid json }"; },
            parseJson: JSON.parse,
        };
        var obj = { $include: "./bad.json" };
        (0, vitest_1.expect)(function () { return (0, includes_js_1.resolveConfigIncludes)(obj, DEFAULT_BASE_PATH, resolver); }).toThrow(includes_js_1.ConfigIncludeError);
        (0, vitest_1.expect)(function () { return (0, includes_js_1.resolveConfigIncludes)(obj, DEFAULT_BASE_PATH, resolver); }).toThrow(/Failed to parse include file/);
    });
    (0, vitest_1.it)("throws CircularIncludeError for circular includes", function () {
        var aPath = configPath("a.json");
        var bPath = configPath("b.json");
        var resolver = {
            readFile: function (filePath) {
                if (filePath === aPath) {
                    return JSON.stringify({ $include: "./b.json" });
                }
                if (filePath === bPath) {
                    return JSON.stringify({ $include: "./a.json" });
                }
                throw new Error("Unknown file: ".concat(filePath));
            },
            parseJson: JSON.parse,
        };
        var obj = { $include: "./a.json" };
        try {
            (0, includes_js_1.resolveConfigIncludes)(obj, DEFAULT_BASE_PATH, resolver);
            throw new Error("expected circular include error");
        }
        catch (err) {
            (0, vitest_1.expect)(err).toBeInstanceOf(includes_js_1.CircularIncludeError);
            var circular = err;
            (0, vitest_1.expect)(circular.chain).toEqual(vitest_1.expect.arrayContaining([DEFAULT_BASE_PATH, aPath, bPath]));
            (0, vitest_1.expect)(circular.message).toMatch(/Circular include detected/);
            (0, vitest_1.expect)(circular.message).toContain("a.json");
            (0, vitest_1.expect)(circular.message).toContain("b.json");
        }
    });
    (0, vitest_1.it)("throws ConfigIncludeError for invalid $include value type", function () {
        var obj = { $include: 123 };
        (0, vitest_1.expect)(function () { return resolve(obj); }).toThrow(includes_js_1.ConfigIncludeError);
        (0, vitest_1.expect)(function () { return resolve(obj); }).toThrow(/expected string or array/);
    });
    (0, vitest_1.it)("throws ConfigIncludeError for invalid array item type", function () {
        var _a;
        var files = (_a = {}, _a[configPath("valid.json")] = { valid: true }, _a);
        var obj = { $include: ["./valid.json", 123] };
        (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(includes_js_1.ConfigIncludeError);
        (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(/expected string, got number/);
    });
    (0, vitest_1.it)("throws ConfigIncludeError for null/boolean include items", function () {
        var _a;
        var files = (_a = {}, _a[configPath("valid.json")] = { valid: true }, _a);
        var cases = [
            { value: null, expected: "object" },
            { value: false, expected: "boolean" },
        ];
        var _loop_1 = function (item) {
            var obj = { $include: ["./valid.json", item.value] };
            (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(includes_js_1.ConfigIncludeError);
            (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(new RegExp("expected string, got ".concat(item.expected)));
        };
        for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
            var item = cases_1[_i];
            _loop_1(item);
        }
    });
    (0, vitest_1.it)("respects max depth limit", function () {
        var files = {};
        for (var i = 0; i < 15; i++) {
            files[configPath("level".concat(i, ".json"))] = {
                $include: "./level".concat(i + 1, ".json"),
            };
        }
        files[configPath("level15.json")] = { done: true };
        var obj = { $include: "./level0.json" };
        (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(includes_js_1.ConfigIncludeError);
        (0, vitest_1.expect)(function () { return resolve(obj, files); }).toThrow(/Maximum include depth/);
    });
    (0, vitest_1.it)("allows depth 10 but rejects depth 11", function () {
        var okFiles = {};
        for (var i = 0; i < 9; i++) {
            okFiles[configPath("ok".concat(i, ".json"))] = { $include: "./ok".concat(i + 1, ".json") };
        }
        okFiles[configPath("ok9.json")] = { done: true };
        (0, vitest_1.expect)(resolve({ $include: "./ok0.json" }, okFiles)).toEqual({
            done: true,
        });
        var failFiles = {};
        for (var i = 0; i < 10; i++) {
            failFiles[configPath("fail".concat(i, ".json"))] = {
                $include: "./fail".concat(i + 1, ".json"),
            };
        }
        failFiles[configPath("fail10.json")] = { done: true };
        (0, vitest_1.expect)(function () { return resolve({ $include: "./fail0.json" }, failFiles); }).toThrow(includes_js_1.ConfigIncludeError);
        (0, vitest_1.expect)(function () { return resolve({ $include: "./fail0.json" }, failFiles); }).toThrow(/Maximum include depth/);
    });
    (0, vitest_1.it)("handles relative paths correctly", function () {
        var _a;
        var files = (_a = {},
            _a[configPath("clients", "mueller", "agents.json")] = { id: "mueller" },
            _a);
        var obj = { agent: { $include: "./clients/mueller/agents.json" } };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({
            agent: { id: "mueller" },
        });
    });
    (0, vitest_1.it)("applies nested includes before sibling overrides", function () {
        var _a;
        var files = (_a = {},
            _a[configPath("base.json")] = { nested: { $include: "./nested.json" } },
            _a[configPath("nested.json")] = { a: 1, b: 2 },
            _a);
        var obj = { $include: "./base.json", nested: { b: 9 } };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({
            nested: { a: 1, b: 9 },
        });
    });
    (0, vitest_1.it)("resolves parent directory references", function () {
        var _a;
        var files = (_a = {}, _a[sharedPath("common.json")] = { shared: true }, _a);
        var obj = { $include: "../../shared/common.json" };
        (0, vitest_1.expect)(resolve(obj, files, configPath("sub", "openclaw.json"))).toEqual({
            shared: true,
        });
    });
});
(0, vitest_1.describe)("real-world config patterns", function () {
    (0, vitest_1.it)("supports per-client agent includes", function () {
        var _a;
        var files = (_a = {},
            _a[configPath("clients", "mueller.json")] = {
                agents: [
                    {
                        id: "mueller-screenshot",
                        workspace: "~/clients/mueller/screenshot",
                    },
                    {
                        id: "mueller-transcribe",
                        workspace: "~/clients/mueller/transcribe",
                    },
                ],
                broadcast: {
                    "group-mueller": ["mueller-screenshot", "mueller-transcribe"],
                },
            },
            _a[configPath("clients", "schmidt.json")] = {
                agents: [
                    {
                        id: "schmidt-screenshot",
                        workspace: "~/clients/schmidt/screenshot",
                    },
                ],
                broadcast: { "group-schmidt": ["schmidt-screenshot"] },
            },
            _a);
        var obj = {
            gateway: { port: 18789 },
            $include: ["./clients/mueller.json", "./clients/schmidt.json"],
        };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({
            gateway: { port: 18789 },
            agents: [
                { id: "mueller-screenshot", workspace: "~/clients/mueller/screenshot" },
                { id: "mueller-transcribe", workspace: "~/clients/mueller/transcribe" },
                { id: "schmidt-screenshot", workspace: "~/clients/schmidt/screenshot" },
            ],
            broadcast: {
                "group-mueller": ["mueller-screenshot", "mueller-transcribe"],
                "group-schmidt": ["schmidt-screenshot"],
            },
        });
    });
    (0, vitest_1.it)("supports modular config structure", function () {
        var _a;
        var files = (_a = {},
            _a[configPath("gateway.json")] = {
                gateway: { port: 18789, bind: "loopback" },
            },
            _a[configPath("channels", "whatsapp.json")] = {
                channels: { whatsapp: { dmPolicy: "pairing", allowFrom: ["+49123"] } },
            },
            _a[configPath("agents", "defaults.json")] = {
                agents: { defaults: { sandbox: { mode: "all" } } },
            },
            _a);
        var obj = {
            $include: ["./gateway.json", "./channels/whatsapp.json", "./agents/defaults.json"],
        };
        (0, vitest_1.expect)(resolve(obj, files)).toEqual({
            gateway: { port: 18789, bind: "loopback" },
            channels: { whatsapp: { dmPolicy: "pairing", allowFrom: ["+49123"] } },
            agents: { defaults: { sandbox: { mode: "all" } } },
        });
    });
});
