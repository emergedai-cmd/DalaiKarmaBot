"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var frontmatter_js_1 = require("./frontmatter.js");
(0, vitest_1.describe)("parseFrontmatter", function () {
    (0, vitest_1.it)("parses single-line key-value pairs", function () {
        var content = "---\nname: test-hook\ndescription: \"A test hook\"\nhomepage: https://example.com\n---\n\n# Test Hook\n";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result.name).toBe("test-hook");
        (0, vitest_1.expect)(result.description).toBe("A test hook");
        (0, vitest_1.expect)(result.homepage).toBe("https://example.com");
    });
    (0, vitest_1.it)("handles missing frontmatter", function () {
        var content = "# Just a markdown file";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result).toEqual({});
    });
    (0, vitest_1.it)("handles unclosed frontmatter", function () {
        var content = "---\nname: broken\n";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result).toEqual({});
    });
    (0, vitest_1.it)("parses multi-line metadata block with indented JSON", function () {
        var content = "---\nname: session-memory\ndescription: \"Save session context\"\nmetadata:\n  {\n    \"openclaw\": {\n      \"emoji\": \"\uD83D\uDCBE\",\n      \"events\": [\"command:new\"]\n    }\n  }\n---\n\n# Session Memory Hook\n";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result.name).toBe("session-memory");
        (0, vitest_1.expect)(result.description).toBe("Save session context");
        (0, vitest_1.expect)(result.metadata).toBeDefined();
        (0, vitest_1.expect)(typeof result.metadata).toBe("string");
        // Verify the metadata is valid JSON
        var parsed = JSON.parse(result.metadata);
        (0, vitest_1.expect)(parsed.openclaw.emoji).toBe("💾");
        (0, vitest_1.expect)(parsed.openclaw.events).toEqual(["command:new"]);
    });
    (0, vitest_1.it)("parses multi-line metadata with complex nested structure", function () {
        var content = "---\nname: command-logger\ndescription: \"Log all command events\"\nmetadata:\n  {\n    \"openclaw\":\n      {\n        \"emoji\": \"\uD83D\uDCDD\",\n        \"events\": [\"command\"],\n        \"requires\": { \"config\": [\"workspace.dir\"] },\n        \"install\": [{ \"id\": \"bundled\", \"kind\": \"bundled\", \"label\": \"Bundled\" }]\n      }\n  }\n---\n";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result.name).toBe("command-logger");
        (0, vitest_1.expect)(result.metadata).toBeDefined();
        var parsed = JSON.parse(result.metadata);
        (0, vitest_1.expect)(parsed.openclaw.emoji).toBe("📝");
        (0, vitest_1.expect)(parsed.openclaw.events).toEqual(["command"]);
        (0, vitest_1.expect)(parsed.openclaw.requires.config).toEqual(["workspace.dir"]);
        (0, vitest_1.expect)(parsed.openclaw.install[0].kind).toBe("bundled");
    });
    (0, vitest_1.it)("handles single-line metadata (inline JSON)", function () {
        var content = "---\nname: simple-hook\nmetadata: {\"openclaw\": {\"events\": [\"test\"]}}\n---\n";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result.name).toBe("simple-hook");
        (0, vitest_1.expect)(result.metadata).toBe('{"openclaw": {"events": ["test"]}}');
    });
    (0, vitest_1.it)("handles mixed single-line and multi-line values", function () {
        var content = "---\nname: mixed-hook\ndescription: \"A hook with mixed values\"\nhomepage: https://example.com\nmetadata:\n  {\n    \"openclaw\": {\n      \"events\": [\"command:new\"]\n    }\n  }\nenabled: true\n---\n";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result.name).toBe("mixed-hook");
        (0, vitest_1.expect)(result.description).toBe("A hook with mixed values");
        (0, vitest_1.expect)(result.homepage).toBe("https://example.com");
        (0, vitest_1.expect)(result.metadata).toBeDefined();
        (0, vitest_1.expect)(result.enabled).toBe("true");
    });
    (0, vitest_1.it)("strips surrounding quotes from values", function () {
        var content = "---\nname: \"quoted-name\"\ndescription: 'single-quoted'\n---\n";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result.name).toBe("quoted-name");
        (0, vitest_1.expect)(result.description).toBe("single-quoted");
    });
    (0, vitest_1.it)("handles CRLF line endings", function () {
        var content = "---\r\nname: test\r\ndescription: crlf\r\n---\r\n";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result.name).toBe("test");
        (0, vitest_1.expect)(result.description).toBe("crlf");
    });
    (0, vitest_1.it)("handles CR line endings", function () {
        var content = "---\rname: test\rdescription: cr\r---\r";
        var result = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(result.name).toBe("test");
        (0, vitest_1.expect)(result.description).toBe("cr");
    });
});
(0, vitest_1.describe)("resolveOpenClawMetadata", function () {
    (0, vitest_1.it)("extracts openclaw metadata from parsed frontmatter", function () {
        var _a, _b;
        var frontmatter = {
            name: "test-hook",
            metadata: JSON.stringify({
                openclaw: {
                    emoji: "🔥",
                    events: ["command:new", "command:reset"],
                    requires: {
                        config: ["workspace.dir"],
                        bins: ["git"],
                    },
                },
            }),
        };
        var result = (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter);
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.emoji).toBe("🔥");
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.events).toEqual(["command:new", "command:reset"]);
        (0, vitest_1.expect)((_a = result === null || result === void 0 ? void 0 : result.requires) === null || _a === void 0 ? void 0 : _a.config).toEqual(["workspace.dir"]);
        (0, vitest_1.expect)((_b = result === null || result === void 0 ? void 0 : result.requires) === null || _b === void 0 ? void 0 : _b.bins).toEqual(["git"]);
    });
    (0, vitest_1.it)("returns undefined when metadata is missing", function () {
        var frontmatter = { name: "no-metadata" };
        var result = (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter);
        (0, vitest_1.expect)(result).toBeUndefined();
    });
    (0, vitest_1.it)("returns undefined when openclaw key is missing", function () {
        var frontmatter = {
            metadata: JSON.stringify({ other: "data" }),
        };
        var result = (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter);
        (0, vitest_1.expect)(result).toBeUndefined();
    });
    (0, vitest_1.it)("returns undefined for invalid JSON", function () {
        var frontmatter = {
            metadata: "not valid json {",
        };
        var result = (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter);
        (0, vitest_1.expect)(result).toBeUndefined();
    });
    (0, vitest_1.it)("handles install specs", function () {
        var _a, _b, _c;
        var frontmatter = {
            metadata: JSON.stringify({
                openclaw: {
                    events: ["command"],
                    install: [
                        { id: "bundled", kind: "bundled", label: "Bundled with OpenClaw" },
                        { id: "npm", kind: "npm", package: "@openclaw/hook" },
                    ],
                },
            }),
        };
        var result = (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.install).toHaveLength(2);
        (0, vitest_1.expect)((_a = result === null || result === void 0 ? void 0 : result.install) === null || _a === void 0 ? void 0 : _a[0].kind).toBe("bundled");
        (0, vitest_1.expect)((_b = result === null || result === void 0 ? void 0 : result.install) === null || _b === void 0 ? void 0 : _b[1].kind).toBe("npm");
        (0, vitest_1.expect)((_c = result === null || result === void 0 ? void 0 : result.install) === null || _c === void 0 ? void 0 : _c[1].package).toBe("@openclaw/hook");
    });
    (0, vitest_1.it)("handles os restrictions", function () {
        var frontmatter = {
            metadata: JSON.stringify({
                openclaw: {
                    events: ["command"],
                    os: ["darwin", "linux"],
                },
            }),
        };
        var result = (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.os).toEqual(["darwin", "linux"]);
    });
    (0, vitest_1.it)("parses real session-memory HOOK.md format", function () {
        var _a, _b;
        // This is the actual format used in the bundled hooks
        var content = "---\nname: session-memory\ndescription: \"Save session context to memory when /new command is issued\"\nhomepage: https://docs.openclaw.ai/hooks#session-memory\nmetadata:\n  {\n    \"openclaw\":\n      {\n        \"emoji\": \"\uD83D\uDCBE\",\n        \"events\": [\"command:new\"],\n        \"requires\": { \"config\": [\"workspace.dir\"] },\n        \"install\": [{ \"id\": \"bundled\", \"kind\": \"bundled\", \"label\": \"Bundled with OpenClaw\" }],\n      },\n  }\n---\n\n# Session Memory Hook\n";
        var frontmatter = (0, frontmatter_js_1.parseFrontmatter)(content);
        (0, vitest_1.expect)(frontmatter.name).toBe("session-memory");
        (0, vitest_1.expect)(frontmatter.metadata).toBeDefined();
        var openclaw = (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter);
        (0, vitest_1.expect)(openclaw).toBeDefined();
        (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.emoji).toBe("💾");
        (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.events).toEqual(["command:new"]);
        (0, vitest_1.expect)((_a = openclaw === null || openclaw === void 0 ? void 0 : openclaw.requires) === null || _a === void 0 ? void 0 : _a.config).toEqual(["workspace.dir"]);
        (0, vitest_1.expect)((_b = openclaw === null || openclaw === void 0 ? void 0 : openclaw.install) === null || _b === void 0 ? void 0 : _b[0].kind).toBe("bundled");
    });
    (0, vitest_1.it)("parses YAML metadata map", function () {
        var content = "---\nname: yaml-metadata\nmetadata:\n  openclaw:\n    emoji: disk\n    events:\n      - command:new\n---\n";
        var frontmatter = (0, frontmatter_js_1.parseFrontmatter)(content);
        var openclaw = (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter);
        (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.emoji).toBe("disk");
        (0, vitest_1.expect)(openclaw === null || openclaw === void 0 ? void 0 : openclaw.events).toEqual(["command:new"]);
    });
});
(0, vitest_1.describe)("resolveHookInvocationPolicy", function () {
    (0, vitest_1.it)("defaults to enabled when missing", function () {
        (0, vitest_1.expect)((0, frontmatter_js_1.resolveHookInvocationPolicy)({}).enabled).toBe(true);
    });
    (0, vitest_1.it)("parses enabled flag", function () {
        (0, vitest_1.expect)((0, frontmatter_js_1.resolveHookInvocationPolicy)({ enabled: "no" }).enabled).toBe(false);
        (0, vitest_1.expect)((0, frontmatter_js_1.resolveHookInvocationPolicy)({ enabled: "on" }).enabled).toBe(true);
    });
});
