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
    (0, vitest_1.it)("syncs merged skills into a target workspace", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceWorkspace, targetWorkspace, extraDir, bundledDir, managedDir, prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    sourceWorkspace = _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 2:
                    targetWorkspace = _a.sent();
                    extraDir = node_path_1.default.join(sourceWorkspace, ".extra");
                    bundledDir = node_path_1.default.join(sourceWorkspace, ".bundled");
                    managedDir = node_path_1.default.join(sourceWorkspace, ".managed");
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(extraDir, "demo-skill"),
                            name: "demo-skill",
                            description: "Extra version",
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(bundledDir, "demo-skill"),
                            name: "demo-skill",
                            description: "Bundled version",
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(managedDir, "demo-skill"),
                            name: "demo-skill",
                            description: "Managed version",
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(sourceWorkspace, "skills", "demo-skill"),
                            name: "demo-skill",
                            description: "Workspace version",
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, skills_js_1.syncSkillsToWorkspace)({
                            sourceWorkspaceDir: sourceWorkspace,
                            targetWorkspaceDir: targetWorkspace,
                            config: { skills: { load: { extraDirs: [extraDir] } } },
                            bundledSkillsDir: bundledDir,
                            managedSkillsDir: managedDir,
                        })];
                case 7:
                    _a.sent();
                    prompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(targetWorkspace, {
                        bundledSkillsDir: node_path_1.default.join(targetWorkspace, ".bundled"),
                        managedSkillsDir: node_path_1.default.join(targetWorkspace, ".managed"),
                    });
                    (0, vitest_1.expect)(prompt).toContain("Workspace version");
                    (0, vitest_1.expect)(prompt).not.toContain("Managed version");
                    (0, vitest_1.expect)(prompt).not.toContain("Bundled version");
                    (0, vitest_1.expect)(prompt).not.toContain("Extra version");
                    (0, vitest_1.expect)(prompt).toContain(node_path_1.default.join(targetWorkspace, "skills", "demo-skill", "SKILL.md"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("filters skills based on env/config gates", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, skillDir, originalEnv, missingPrompt, enabledPrompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    workspaceDir = _a.sent();
                    skillDir = node_path_1.default.join(workspaceDir, "skills", "nano-banana-pro");
                    originalEnv = process.env.GEMINI_API_KEY;
                    delete process.env.GEMINI_API_KEY;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, writeSkill({
                            dir: skillDir,
                            name: "nano-banana-pro",
                            description: "Generates images",
                            metadata: '{"openclaw":{"requires":{"env":["GEMINI_API_KEY"]},"primaryEnv":"GEMINI_API_KEY"}}',
                            body: "# Nano Banana\n",
                        })];
                case 3:
                    _a.sent();
                    missingPrompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        config: { skills: { entries: { "nano-banana-pro": { apiKey: "" } } } },
                    });
                    (0, vitest_1.expect)(missingPrompt).not.toContain("nano-banana-pro");
                    enabledPrompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        config: {
                            skills: { entries: { "nano-banana-pro": { apiKey: "test-key" } } },
                        },
                    });
                    (0, vitest_1.expect)(enabledPrompt).toContain("nano-banana-pro");
                    return [3 /*break*/, 5];
                case 4:
                    if (originalEnv === undefined) {
                        delete process.env.GEMINI_API_KEY;
                    }
                    else {
                        process.env.GEMINI_API_KEY = originalEnv;
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("applies skill filters, including empty lists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, filteredPrompt, emptyPrompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    workspaceDir = _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "alpha"),
                            name: "alpha",
                            description: "Alpha skill",
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "beta"),
                            name: "beta",
                            description: "Beta skill",
                        })];
                case 3:
                    _a.sent();
                    filteredPrompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        skillFilter: ["alpha"],
                    });
                    (0, vitest_1.expect)(filteredPrompt).toContain("alpha");
                    (0, vitest_1.expect)(filteredPrompt).not.toContain("beta");
                    emptyPrompt = (0, skills_js_1.buildWorkspaceSkillsPrompt)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        skillFilter: [],
                    });
                    (0, vitest_1.expect)(emptyPrompt).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
});
