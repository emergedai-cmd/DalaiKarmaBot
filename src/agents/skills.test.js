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
var skills_js_1 = require("./skills.js");
var tempDirs = [];
var makeWorkspace = function () { return __awaiter(void 0, void 0, void 0, function () {
    var workspaceDir;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
            case 1:
                workspaceDir = _a.sent();
                tempDirs.push(workspaceDir);
                return [2 /*return*/, workspaceDir];
        }
    });
}); };
var writeSkill = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var dir, name, description, metadata, body, frontmatterExtra, frontmatter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dir = params.dir, name = params.name, description = params.description, metadata = params.metadata, body = params.body, frontmatterExtra = params.frontmatterExtra;
                return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
            case 1:
                _a.sent();
                frontmatter = [
                    "name: ".concat(name),
                    "description: ".concat(description),
                    metadata ? "metadata: ".concat(metadata) : "",
                    frontmatterExtra !== null && frontmatterExtra !== void 0 ? frontmatterExtra : "",
                ]
                    .filter(function (line) { return line.trim().length > 0; })
                    .join("\n");
                return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "SKILL.md"), "---\n".concat(frontmatter, "\n---\n\n").concat(body !== null && body !== void 0 ? body : "# ".concat(name, "\n")), "utf-8")];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(tempDirs.splice(0, tempDirs.length).map(function (dir) { return promises_1.default.rm(dir, { recursive: true, force: true }); }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("buildWorkspaceSkillCommandSpecs", function () {
    (0, vitest_1.it)("sanitizes and de-duplicates command names", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, commands, names;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeWorkspace()];
                case 1:
                    workspaceDir = _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "hello-world"),
                            name: "hello-world",
                            description: "Hello world skill",
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "hello_world"),
                            name: "hello_world",
                            description: "Hello underscore skill",
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "help"),
                            name: "help",
                            description: "Help skill",
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "hidden"),
                            name: "hidden-skill",
                            description: "Hidden skill",
                            frontmatterExtra: "user-invocable: false",
                        })];
                case 5:
                    _a.sent();
                    commands = (0, skills_js_1.buildWorkspaceSkillCommandSpecs)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        bundledSkillsDir: node_path_1.default.join(workspaceDir, ".bundled"),
                        reservedNames: new Set(["help"]),
                    });
                    names = commands.map(function (entry) { return entry.name; }).toSorted();
                    (0, vitest_1.expect)(names).toEqual(["hello_world", "hello_world_2", "help_2"]);
                    (0, vitest_1.expect)(commands.find(function (entry) { return entry.skillName === "hidden-skill"; })).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("truncates descriptions longer than 100 characters for Discord compatibility", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, longDescription, commands, longCmd, shortCmd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeWorkspace()];
                case 1:
                    workspaceDir = _a.sent();
                    longDescription = "This is a very long description that exceeds Discord's 100 character limit for slash command descriptions and should be truncated";
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "long-desc"),
                            name: "long-desc",
                            description: longDescription,
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "short-desc"),
                            name: "short-desc",
                            description: "Short description",
                        })];
                case 3:
                    _a.sent();
                    commands = (0, skills_js_1.buildWorkspaceSkillCommandSpecs)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        bundledSkillsDir: node_path_1.default.join(workspaceDir, ".bundled"),
                    });
                    longCmd = commands.find(function (entry) { return entry.skillName === "long-desc"; });
                    shortCmd = commands.find(function (entry) { return entry.skillName === "short-desc"; });
                    (0, vitest_1.expect)(longCmd === null || longCmd === void 0 ? void 0 : longCmd.description.length).toBeLessThanOrEqual(100);
                    (0, vitest_1.expect)(longCmd === null || longCmd === void 0 ? void 0 : longCmd.description.endsWith("…")).toBe(true);
                    (0, vitest_1.expect)(shortCmd === null || shortCmd === void 0 ? void 0 : shortCmd.description).toBe("Short description");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes tool-dispatch metadata from frontmatter", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, commands, cmd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeWorkspace()];
                case 1:
                    workspaceDir = _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "tool-dispatch"),
                            name: "tool-dispatch",
                            description: "Dispatch to a tool",
                            frontmatterExtra: "command-dispatch: tool\ncommand-tool: sessions_send",
                        })];
                case 2:
                    _a.sent();
                    commands = (0, skills_js_1.buildWorkspaceSkillCommandSpecs)(workspaceDir);
                    cmd = commands.find(function (entry) { return entry.skillName === "tool-dispatch"; });
                    (0, vitest_1.expect)(cmd === null || cmd === void 0 ? void 0 : cmd.dispatch).toEqual({ kind: "tool", toolName: "sessions_send", argMode: "raw" });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("buildWorkspaceSkillsPrompt", function () {
    (0, vitest_1.it)("returns empty prompt when skills dirs are missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeWorkspace()];
                case 1:
                    workspaceDir = _a.sent();
                    prompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        bundledSkillsDir: node_path_1.default.join(workspaceDir, ".bundled"),
                    });
                    (0, vitest_1.expect)(prompt).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("loads bundled skills when present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, bundledDir, bundledSkillDir, prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeWorkspace()];
                case 1:
                    workspaceDir = _a.sent();
                    bundledDir = node_path_1.default.join(workspaceDir, ".bundled");
                    bundledSkillDir = node_path_1.default.join(bundledDir, "peekaboo");
                    return [4 /*yield*/, writeSkill({
                            dir: bundledSkillDir,
                            name: "peekaboo",
                            description: "Capture UI",
                            body: "# Peekaboo\n",
                        })];
                case 2:
                    _a.sent();
                    prompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        bundledSkillsDir: bundledDir,
                    });
                    (0, vitest_1.expect)(prompt).toContain("peekaboo");
                    (0, vitest_1.expect)(prompt).toContain("Capture UI");
                    (0, vitest_1.expect)(prompt).toContain(node_path_1.default.join(bundledSkillDir, "SKILL.md"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("loads extra skill folders from config (lowest precedence)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, extraDir, bundledDir, managedDir, prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeWorkspace()];
                case 1:
                    workspaceDir = _a.sent();
                    extraDir = node_path_1.default.join(workspaceDir, ".extra");
                    bundledDir = node_path_1.default.join(workspaceDir, ".bundled");
                    managedDir = node_path_1.default.join(workspaceDir, ".managed");
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(extraDir, "demo-skill"),
                            name: "demo-skill",
                            description: "Extra version",
                            body: "# Extra\n",
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(bundledDir, "demo-skill"),
                            name: "demo-skill",
                            description: "Bundled version",
                            body: "# Bundled\n",
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(managedDir, "demo-skill"),
                            name: "demo-skill",
                            description: "Managed version",
                            body: "# Managed\n",
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "demo-skill"),
                            name: "demo-skill",
                            description: "Workspace version",
                            body: "# Workspace\n",
                        })];
                case 5:
                    _a.sent();
                    prompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        bundledSkillsDir: bundledDir,
                        managedSkillsDir: managedDir,
                        config: { skills: { load: { extraDirs: [extraDir] } } },
                    });
                    (0, vitest_1.expect)(prompt).toContain("Workspace version");
                    (0, vitest_1.expect)(prompt).not.toContain("Managed version");
                    (0, vitest_1.expect)(prompt).not.toContain("Bundled version");
                    (0, vitest_1.expect)(prompt).not.toContain("Extra version");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("loads skills from workspace skills/", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, skillDir, prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeWorkspace()];
                case 1:
                    workspaceDir = _a.sent();
                    skillDir = node_path_1.default.join(workspaceDir, "skills", "demo-skill");
                    return [4 /*yield*/, writeSkill({
                            dir: skillDir,
                            name: "demo-skill",
                            description: "Does demo things",
                            body: "# Demo Skill\n",
                        })];
                case 2:
                    _a.sent();
                    prompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                    });
                    (0, vitest_1.expect)(prompt).toContain("demo-skill");
                    (0, vitest_1.expect)(prompt).toContain("Does demo things");
                    (0, vitest_1.expect)(prompt).toContain(node_path_1.default.join(skillDir, "SKILL.md"));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("applySkillEnvOverrides", function () {
    (0, vitest_1.it)("sets and restores env vars", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, skillDir, entries, originalEnv, restore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeWorkspace()];
                case 1:
                    workspaceDir = _a.sent();
                    skillDir = node_path_1.default.join(workspaceDir, "skills", "env-skill");
                    return [4 /*yield*/, writeSkill({
                            dir: skillDir,
                            name: "env-skill",
                            description: "Needs env",
                            metadata: '{"openclaw":{"requires":{"env":["ENV_KEY"]},"primaryEnv":"ENV_KEY"}}',
                        })];
                case 2:
                    _a.sent();
                    entries = (0, skills_js_1.loadWorkspaceSkillEntries)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                    });
                    originalEnv = process.env.ENV_KEY;
                    delete process.env.ENV_KEY;
                    restore = (0, skills_js_1.applySkillEnvOverrides)({
                        skills: entries,
                        config: { skills: { entries: { "env-skill": { apiKey: "injected" } } } },
                    });
                    try {
                        (0, vitest_1.expect)(process.env.ENV_KEY).toBe("injected");
                    }
                    finally {
                        restore();
                        if (originalEnv === undefined) {
                            (0, vitest_1.expect)(process.env.ENV_KEY).toBeUndefined();
                        }
                        else {
                            (0, vitest_1.expect)(process.env.ENV_KEY).toBe(originalEnv);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("applies env overrides from snapshots", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, skillDir, snapshot, originalEnv, restore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeWorkspace()];
                case 1:
                    workspaceDir = _a.sent();
                    skillDir = node_path_1.default.join(workspaceDir, "skills", "env-skill");
                    return [4 /*yield*/, writeSkill({
                            dir: skillDir,
                            name: "env-skill",
                            description: "Needs env",
                            metadata: '{"openclaw":{"requires":{"env":["ENV_KEY"]},"primaryEnv":"ENV_KEY"}}',
                        })];
                case 2:
                    _a.sent();
                    snapshot = (0, skills_js_1.buildWorkspaceSkillSnapshot)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        config: { skills: { entries: { "env-skill": { apiKey: "snap-key" } } } },
                    });
                    originalEnv = process.env.ENV_KEY;
                    delete process.env.ENV_KEY;
                    restore = (0, skills_js_1.applySkillEnvOverridesFromSnapshot)({
                        snapshot: snapshot,
                        config: { skills: { entries: { "env-skill": { apiKey: "snap-key" } } } },
                    });
                    try {
                        (0, vitest_1.expect)(process.env.ENV_KEY).toBe("snap-key");
                    }
                    finally {
                        restore();
                        if (originalEnv === undefined) {
                            (0, vitest_1.expect)(process.env.ENV_KEY).toBeUndefined();
                        }
                        else {
                            (0, vitest_1.expect)(process.env.ENV_KEY).toBe(originalEnv);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
