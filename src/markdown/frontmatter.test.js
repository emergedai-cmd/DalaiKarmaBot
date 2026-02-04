"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json5_1 = require("json5");
var vitest_1 = require("vitest");
var frontmatter_js_1 = require("./frontmatter.js");
(0, vitest_1.describe)("parseFrontmatterBlock", function () {
    (0, vitest_1.it)("parses YAML block scalars", function () {
        var content = "---\nname: yaml-hook\ndescription: |\n  line one\n  line two\n---\n";
        var result = (0, frontmatter_js_1.parseFrontmatterBlock)(content);
        (0, vitest_1.expect)(result.name).toBe("yaml-hook");
        (0, vitest_1.expect)(result.description).toBe("line one\nline two");
    });
    (0, vitest_1.it)("handles JSON5-style multi-line metadata", function () {
        var _a, _b;
        var content = "---\nname: session-memory\nmetadata:\n  {\n    \"openclaw\":\n      {\n        \"emoji\": \"disk\",\n        \"events\": [\"command:new\"],\n      },\n  }\n---\n";
        var result = (0, frontmatter_js_1.parseFrontmatterBlock)(content);
        (0, vitest_1.expect)(result.metadata).toBeDefined();
        var parsed = json5_1.default.parse((_a = result.metadata) !== null && _a !== void 0 ? _a : "");
        (0, vitest_1.expect)((_b = parsed.openclaw) === null || _b === void 0 ? void 0 : _b.emoji).toBe("disk");
    });
    (0, vitest_1.it)("preserves inline JSON values", function () {
        var content = "---\nname: inline-json\nmetadata: {\"openclaw\": {\"events\": [\"test\"]}}\n---\n";
        var result = (0, frontmatter_js_1.parseFrontmatterBlock)(content);
        (0, vitest_1.expect)(result.metadata).toBe('{"openclaw": {"events": ["test"]}}');
    });
    (0, vitest_1.it)("stringifies YAML objects and arrays", function () {
        var _a, _b, _c;
        var content = "---\nname: yaml-objects\nenabled: true\nretries: 3\ntags:\n  - alpha\n  - beta\nmetadata:\n  openclaw:\n    events:\n      - command:new\n---\n";
        var result = (0, frontmatter_js_1.parseFrontmatterBlock)(content);
        (0, vitest_1.expect)(result.enabled).toBe("true");
        (0, vitest_1.expect)(result.retries).toBe("3");
        (0, vitest_1.expect)(JSON.parse((_a = result.tags) !== null && _a !== void 0 ? _a : "[]")).toEqual(["alpha", "beta"]);
        var parsed = json5_1.default.parse((_b = result.metadata) !== null && _b !== void 0 ? _b : "");
        (0, vitest_1.expect)((_c = parsed.openclaw) === null || _c === void 0 ? void 0 : _c.events).toEqual(["command:new"]);
    });
    (0, vitest_1.it)("returns empty when frontmatter is missing", function () {
        var content = "# No frontmatter";
        (0, vitest_1.expect)((0, frontmatter_js_1.parseFrontmatterBlock)(content)).toEqual({});
    });
});
