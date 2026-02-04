"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var frontmatter_js_1 = require("./skills/frontmatter.js");
(0, vitest_1.describe)("skills/summarize frontmatter", function () {
    (0, vitest_1.it)("mentions podcasts, local files, and transcription use cases", function () {
        var _a;
        var skillPath = node_path_1.default.join(process.cwd(), "skills", "summarize", "SKILL.md");
        var raw = node_fs_1.default.readFileSync(skillPath, "utf-8");
        var frontmatter = (0, frontmatter_js_1.parseFrontmatter)(raw);
        var description = (_a = frontmatter.description) !== null && _a !== void 0 ? _a : "";
        (0, vitest_1.expect)(description.toLowerCase()).toContain("transcrib");
        (0, vitest_1.expect)(description.toLowerCase()).toContain("podcast");
        (0, vitest_1.expect)(description.toLowerCase()).toContain("local files");
        (0, vitest_1.expect)(description).not.toContain("summarize.sh");
    });
});
