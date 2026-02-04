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
function writeSkill(params) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, name, description, metadata, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = params.dir, name = params.name, description = params.description, metadata = params.metadata, body = params.body;
                    return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "SKILL.md"), "---\nname: ".concat(name, "\ndescription: ").concat(description).concat(metadata ? "\nmetadata: ".concat(metadata) : "", "\n---\n\n").concat(body !== null && body !== void 0 ? body : "# ".concat(name, "\n"), "\n"), "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("buildWorkspaceSkillsPrompt", function () {
    (0, vitest_1.it)("prefers workspace skills over managed skills", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, managedDir, bundledDir, managedSkillDir, bundledSkillDir, workspaceSkillDir, prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    workspaceDir = _a.sent();
                    managedDir = node_path_1.default.join(workspaceDir, ".managed");
                    bundledDir = node_path_1.default.join(workspaceDir, ".bundled");
                    managedSkillDir = node_path_1.default.join(managedDir, "demo-skill");
                    bundledSkillDir = node_path_1.default.join(bundledDir, "demo-skill");
                    workspaceSkillDir = node_path_1.default.join(workspaceDir, "skills", "demo-skill");
                    return [4 /*yield*/, writeSkill({
                            dir: bundledSkillDir,
                            name: "demo-skill",
                            description: "Bundled version",
                            body: "# Bundled\n",
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: managedSkillDir,
                            name: "demo-skill",
                            description: "Managed version",
                            body: "# Managed\n",
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: workspaceSkillDir,
                            name: "demo-skill",
                            description: "Workspace version",
                            body: "# Workspace\n",
                        })];
                case 4:
                    _a.sent();
                    prompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: managedDir,
                        bundledSkillsDir: bundledDir,
                    });
                    (0, vitest_1.expect)(prompt).toContain("Workspace version");
                    (0, vitest_1.expect)(prompt).toContain(node_path_1.default.join(workspaceSkillDir, "SKILL.md"));
                    (0, vitest_1.expect)(prompt).not.toContain(node_path_1.default.join(managedSkillDir, "SKILL.md"));
                    (0, vitest_1.expect)(prompt).not.toContain(node_path_1.default.join(bundledSkillDir, "SKILL.md"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("gates by bins, config, and always", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, skillsDir, binDir, originalPath, defaultPrompt, fakebinPath, gatedPrompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    workspaceDir = _a.sent();
                    skillsDir = node_path_1.default.join(workspaceDir, "skills");
                    binDir = node_path_1.default.join(workspaceDir, "bin");
                    originalPath = process.env.PATH;
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(skillsDir, "bin-skill"),
                            name: "bin-skill",
                            description: "Needs a bin",
                            metadata: '{"openclaw":{"requires":{"bins":["fakebin"]}}}',
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(skillsDir, "anybin-skill"),
                            name: "anybin-skill",
                            description: "Needs any bin",
                            metadata: '{"openclaw":{"requires":{"anyBins":["missingbin","fakebin"]}}}',
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(skillsDir, "config-skill"),
                            name: "config-skill",
                            description: "Needs config",
                            metadata: '{"openclaw":{"requires":{"config":["browser.enabled"]}}}',
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(skillsDir, "always-skill"),
                            name: "always-skill",
                            description: "Always on",
                            metadata: '{"openclaw":{"always":true,"requires":{"env":["MISSING"]}}}',
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(skillsDir, "env-skill"),
                            name: "env-skill",
                            description: "Needs env",
                            metadata: '{"openclaw":{"requires":{"env":["ENV_KEY"]},"primaryEnv":"ENV_KEY"}}',
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, , 11, 12]);
                    defaultPrompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                    });
                    (0, vitest_1.expect)(defaultPrompt).toContain("always-skill");
                    (0, vitest_1.expect)(defaultPrompt).toContain("config-skill");
                    (0, vitest_1.expect)(defaultPrompt).not.toContain("bin-skill");
                    (0, vitest_1.expect)(defaultPrompt).not.toContain("anybin-skill");
                    (0, vitest_1.expect)(defaultPrompt).not.toContain("env-skill");
                    return [4 /*yield*/, promises_1.default.mkdir(binDir, { recursive: true })];
                case 8:
                    _a.sent();
                    fakebinPath = node_path_1.default.join(binDir, "fakebin");
                    return [4 /*yield*/, promises_1.default.writeFile(fakebinPath, "#!/bin/sh\nexit 0\n", "utf-8")];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.chmod(fakebinPath, 493)];
                case 10:
                    _a.sent();
                    process.env.PATH = "".concat(binDir).concat(node_path_1.default.delimiter).concat(originalPath !== null && originalPath !== void 0 ? originalPath : "");
                    gatedPrompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        config: {
                            browser: { enabled: false },
                            skills: { entries: { "env-skill": { apiKey: "ok" } } },
                        },
                    });
                    (0, vitest_1.expect)(gatedPrompt).toContain("bin-skill");
                    (0, vitest_1.expect)(gatedPrompt).toContain("anybin-skill");
                    (0, vitest_1.expect)(gatedPrompt).toContain("env-skill");
                    (0, vitest_1.expect)(gatedPrompt).toContain("always-skill");
                    (0, vitest_1.expect)(gatedPrompt).not.toContain("config-skill");
                    return [3 /*break*/, 12];
                case 11:
                    process.env.PATH = originalPath;
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses skillKey for config lookups", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, skillDir, prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    workspaceDir = _a.sent();
                    skillDir = node_path_1.default.join(workspaceDir, "skills", "alias-skill");
                    return [4 /*yield*/, writeSkill({
                            dir: skillDir,
                            name: "alias-skill",
                            description: "Uses skillKey",
                            metadata: '{"openclaw":{"skillKey":"alias"}}',
                        })];
                case 2:
                    _a.sent();
                    prompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        config: { skills: { entries: { alias: { enabled: false } } } },
                    });
                    (0, vitest_1.expect)(prompt).not.toContain("alias-skill");
                    return [2 /*return*/];
            }
        });
    }); });
});
