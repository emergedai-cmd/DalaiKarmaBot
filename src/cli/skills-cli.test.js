"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var vitest_1 = require("vitest");
var skills_status_js_1 = require("../agents/skills-status.js");
var skills_cli_js_1 = require("./skills-cli.js");
function createMockSkill(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ name: "test-skill", description: "A test skill", source: "bundled", filePath: "/path/to/SKILL.md", baseDir: "/path/to", skillKey: "test-skill", emoji: "🧪", homepage: "https://example.com", always: false, disabled: false, blockedByAllowlist: false, eligible: true, requirements: {
            bins: [],
            anyBins: [],
            env: [],
            config: [],
            os: [],
        }, missing: {
            bins: [],
            anyBins: [],
            env: [],
            config: [],
            os: [],
        }, configChecks: [], install: [] }, overrides);
}
function createMockReport(skills) {
    return {
        workspaceDir: "/workspace",
        managedSkillsDir: "/managed",
        skills: skills,
    };
}
(0, vitest_1.describe)("skills-cli", function () {
    (0, vitest_1.describe)("formatSkillsList", function () {
        (0, vitest_1.it)("formats empty skills list", function () {
            var report = createMockReport([]);
            var output = (0, skills_cli_js_1.formatSkillsList)(report, {});
            (0, vitest_1.expect)(output).toContain("No skills found");
            (0, vitest_1.expect)(output).toContain("npx clawhub");
        });
        (0, vitest_1.it)("formats skills list with eligible skill", function () {
            var report = createMockReport([
                createMockSkill({
                    name: "peekaboo",
                    description: "Capture UI screenshots",
                    emoji: "📸",
                    eligible: true,
                }),
            ]);
            var output = (0, skills_cli_js_1.formatSkillsList)(report, {});
            (0, vitest_1.expect)(output).toContain("peekaboo");
            (0, vitest_1.expect)(output).toContain("📸");
            (0, vitest_1.expect)(output).toContain("✓");
        });
        (0, vitest_1.it)("formats skills list with disabled skill", function () {
            var report = createMockReport([
                createMockSkill({
                    name: "disabled-skill",
                    disabled: true,
                    eligible: false,
                }),
            ]);
            var output = (0, skills_cli_js_1.formatSkillsList)(report, {});
            (0, vitest_1.expect)(output).toContain("disabled-skill");
            (0, vitest_1.expect)(output).toContain("disabled");
        });
        (0, vitest_1.it)("formats skills list with missing requirements", function () {
            var report = createMockReport([
                createMockSkill({
                    name: "needs-stuff",
                    eligible: false,
                    missing: {
                        bins: ["ffmpeg"],
                        anyBins: ["rg", "grep"],
                        env: ["API_KEY"],
                        config: [],
                        os: ["darwin"],
                    },
                }),
            ]);
            var output = (0, skills_cli_js_1.formatSkillsList)(report, { verbose: true });
            (0, vitest_1.expect)(output).toContain("needs-stuff");
            (0, vitest_1.expect)(output).toContain("missing");
            (0, vitest_1.expect)(output).toContain("anyBins");
            (0, vitest_1.expect)(output).toContain("os:");
        });
        (0, vitest_1.it)("filters to eligible only with --eligible flag", function () {
            var report = createMockReport([
                createMockSkill({ name: "eligible-one", eligible: true }),
                createMockSkill({
                    name: "not-eligible",
                    eligible: false,
                    disabled: true,
                }),
            ]);
            var output = (0, skills_cli_js_1.formatSkillsList)(report, { eligible: true });
            (0, vitest_1.expect)(output).toContain("eligible-one");
            (0, vitest_1.expect)(output).not.toContain("not-eligible");
        });
        (0, vitest_1.it)("outputs JSON with --json flag", function () {
            var report = createMockReport([createMockSkill({ name: "json-skill" })]);
            var output = (0, skills_cli_js_1.formatSkillsList)(report, { json: true });
            var parsed = JSON.parse(output);
            (0, vitest_1.expect)(parsed.skills).toHaveLength(1);
            (0, vitest_1.expect)(parsed.skills[0].name).toBe("json-skill");
        });
    });
    (0, vitest_1.describe)("formatSkillInfo", function () {
        (0, vitest_1.it)("returns not found message for unknown skill", function () {
            var report = createMockReport([]);
            var output = (0, skills_cli_js_1.formatSkillInfo)(report, "unknown-skill", {});
            (0, vitest_1.expect)(output).toContain("not found");
            (0, vitest_1.expect)(output).toContain("npx clawhub");
        });
        (0, vitest_1.it)("shows detailed info for a skill", function () {
            var report = createMockReport([
                createMockSkill({
                    name: "detailed-skill",
                    description: "A detailed description",
                    homepage: "https://example.com",
                    requirements: {
                        bins: ["node"],
                        anyBins: ["rg", "grep"],
                        env: ["API_KEY"],
                        config: [],
                        os: [],
                    },
                    missing: {
                        bins: [],
                        anyBins: [],
                        env: ["API_KEY"],
                        config: [],
                        os: [],
                    },
                }),
            ]);
            var output = (0, skills_cli_js_1.formatSkillInfo)(report, "detailed-skill", {});
            (0, vitest_1.expect)(output).toContain("detailed-skill");
            (0, vitest_1.expect)(output).toContain("A detailed description");
            (0, vitest_1.expect)(output).toContain("https://example.com");
            (0, vitest_1.expect)(output).toContain("node");
            (0, vitest_1.expect)(output).toContain("Any binaries");
            (0, vitest_1.expect)(output).toContain("API_KEY");
        });
        (0, vitest_1.it)("outputs JSON with --json flag", function () {
            var report = createMockReport([createMockSkill({ name: "info-skill" })]);
            var output = (0, skills_cli_js_1.formatSkillInfo)(report, "info-skill", { json: true });
            var parsed = JSON.parse(output);
            (0, vitest_1.expect)(parsed.name).toBe("info-skill");
        });
    });
    (0, vitest_1.describe)("formatSkillsCheck", function () {
        (0, vitest_1.it)("shows summary of skill status", function () {
            var report = createMockReport([
                createMockSkill({ name: "ready-1", eligible: true }),
                createMockSkill({ name: "ready-2", eligible: true }),
                createMockSkill({
                    name: "not-ready",
                    eligible: false,
                    missing: { bins: ["go"], anyBins: [], env: [], config: [], os: [] },
                }),
                createMockSkill({ name: "disabled", eligible: false, disabled: true }),
            ]);
            var output = (0, skills_cli_js_1.formatSkillsCheck)(report, {});
            (0, vitest_1.expect)(output).toContain("2"); // eligible count
            (0, vitest_1.expect)(output).toContain("ready-1");
            (0, vitest_1.expect)(output).toContain("ready-2");
            (0, vitest_1.expect)(output).toContain("not-ready");
            (0, vitest_1.expect)(output).toContain("go"); // missing binary
            (0, vitest_1.expect)(output).toContain("npx clawhub");
        });
        (0, vitest_1.it)("outputs JSON with --json flag", function () {
            var report = createMockReport([
                createMockSkill({ name: "skill-1", eligible: true }),
                createMockSkill({ name: "skill-2", eligible: false }),
            ]);
            var output = (0, skills_cli_js_1.formatSkillsCheck)(report, { json: true });
            var parsed = JSON.parse(output);
            (0, vitest_1.expect)(parsed.summary.eligible).toBe(1);
            (0, vitest_1.expect)(parsed.summary.total).toBe(2);
        });
    });
    (0, vitest_1.describe)("integration: loads real skills from bundled directory", function () {
        function resolveBundledSkillsDir() {
            var moduleDir = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
            var root = node_path_1.default.resolve(moduleDir, "..", "..");
            var candidate = node_path_1.default.join(root, "skills");
            if (node_fs_1.default.existsSync(candidate)) {
                return candidate;
            }
            return undefined;
        }
        (0, vitest_1.it)("loads bundled skills and formats them", function () {
            var bundledDir = resolveBundledSkillsDir();
            if (!bundledDir) {
                // Skip if skills dir not found (e.g., in CI without skills)
                return;
            }
            var report = (0, skills_status_js_1.buildWorkspaceSkillStatus)("/tmp", {
                managedSkillsDir: "/nonexistent",
            });
            // Should have loaded some skills
            (0, vitest_1.expect)(report.skills.length).toBeGreaterThan(0);
            // Format should work without errors
            var listOutput = (0, skills_cli_js_1.formatSkillsList)(report, {});
            (0, vitest_1.expect)(listOutput).toContain("Skills");
            var checkOutput = (0, skills_cli_js_1.formatSkillsCheck)(report, {});
            (0, vitest_1.expect)(checkOutput).toContain("Total:");
            // JSON output should be valid
            var jsonOutput = (0, skills_cli_js_1.formatSkillsList)(report, { json: true });
            var parsed = JSON.parse(jsonOutput);
            (0, vitest_1.expect)(parsed.skills).toBeInstanceOf(Array);
        });
        (0, vitest_1.it)("formats info for a real bundled skill (peekaboo)", function () {
            var bundledDir = resolveBundledSkillsDir();
            if (!bundledDir) {
                return;
            }
            var report = (0, skills_status_js_1.buildWorkspaceSkillStatus)("/tmp", {
                managedSkillsDir: "/nonexistent",
            });
            // peekaboo is a bundled skill that should always exist
            var peekaboo = report.skills.find(function (s) { return s.name === "peekaboo"; });
            if (!peekaboo) {
                // Skip if peekaboo not found
                return;
            }
            var output = (0, skills_cli_js_1.formatSkillInfo)(report, "peekaboo", {});
            (0, vitest_1.expect)(output).toContain("peekaboo");
            (0, vitest_1.expect)(output).toContain("Details:");
        });
    });
});
