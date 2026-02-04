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
var skill_commands_js_1 = require("./skill-commands.js");
function writeSkill(params) {
    return __awaiter(this, void 0, void 0, function () {
        var workspaceDir, dirName, name, description, skillDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workspaceDir = params.workspaceDir, dirName = params.dirName, name = params.name, description = params.description;
                    skillDir = node_path_1.default.join(workspaceDir, "skills", dirName);
                    return [4 /*yield*/, promises_1.default.mkdir(skillDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(skillDir, "SKILL.md"), "---\nname: ".concat(name, "\ndescription: ").concat(description, "\n---\n\n# ").concat(name, "\n"), "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("resolveSkillCommandInvocation", function () {
    (0, vitest_1.it)("matches skill commands and parses args", function () {
        var invocation = (0, skill_commands_js_1.resolveSkillCommandInvocation)({
            commandBodyNormalized: "/demo_skill do the thing",
            skillCommands: [{ name: "demo_skill", skillName: "demo-skill", description: "Demo" }],
        });
        (0, vitest_1.expect)(invocation === null || invocation === void 0 ? void 0 : invocation.command.skillName).toBe("demo-skill");
        (0, vitest_1.expect)(invocation === null || invocation === void 0 ? void 0 : invocation.args).toBe("do the thing");
    });
    (0, vitest_1.it)("supports /skill with name argument", function () {
        var invocation = (0, skill_commands_js_1.resolveSkillCommandInvocation)({
            commandBodyNormalized: "/skill demo_skill do the thing",
            skillCommands: [{ name: "demo_skill", skillName: "demo-skill", description: "Demo" }],
        });
        (0, vitest_1.expect)(invocation === null || invocation === void 0 ? void 0 : invocation.command.name).toBe("demo_skill");
        (0, vitest_1.expect)(invocation === null || invocation === void 0 ? void 0 : invocation.args).toBe("do the thing");
    });
    (0, vitest_1.it)("normalizes /skill lookup names", function () {
        var invocation = (0, skill_commands_js_1.resolveSkillCommandInvocation)({
            commandBodyNormalized: "/skill demo-skill",
            skillCommands: [{ name: "demo_skill", skillName: "demo-skill", description: "Demo" }],
        });
        (0, vitest_1.expect)(invocation === null || invocation === void 0 ? void 0 : invocation.command.name).toBe("demo_skill");
        (0, vitest_1.expect)(invocation === null || invocation === void 0 ? void 0 : invocation.args).toBeUndefined();
    });
    (0, vitest_1.it)("returns null for unknown commands", function () {
        var invocation = (0, skill_commands_js_1.resolveSkillCommandInvocation)({
            commandBodyNormalized: "/unknown arg",
            skillCommands: [{ name: "demo_skill", skillName: "demo-skill", description: "Demo" }],
        });
        (0, vitest_1.expect)(invocation).toBeNull();
    });
});
(0, vitest_1.describe)("listSkillCommandsForAgents", function () {
    (0, vitest_1.it)("merges command names across agents and de-duplicates", function () { return __awaiter(void 0, void 0, void 0, function () {
        var baseDir, mainWorkspace, researchWorkspace, commands, names;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-skills-"))];
                case 1:
                    baseDir = _a.sent();
                    mainWorkspace = node_path_1.default.join(baseDir, "main");
                    researchWorkspace = node_path_1.default.join(baseDir, "research");
                    return [4 /*yield*/, writeSkill({
                            workspaceDir: mainWorkspace,
                            dirName: "demo",
                            name: "demo-skill",
                            description: "Demo skill",
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            workspaceDir: researchWorkspace,
                            dirName: "demo2",
                            name: "demo-skill",
                            description: "Demo skill 2",
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, writeSkill({
                            workspaceDir: researchWorkspace,
                            dirName: "extra",
                            name: "extra-skill",
                            description: "Extra skill",
                        })];
                case 4:
                    _a.sent();
                    commands = (0, skill_commands_js_1.listSkillCommandsForAgents)({
                        cfg: {
                            agents: {
                                list: [
                                    { id: "main", workspace: mainWorkspace },
                                    { id: "research", workspace: researchWorkspace },
                                ],
                            },
                        },
                    });
                    names = commands.map(function (entry) { return entry.name; });
                    (0, vitest_1.expect)(names).toContain("demo_skill");
                    (0, vitest_1.expect)(names).toContain("demo_skill_2");
                    (0, vitest_1.expect)(names).toContain("extra_skill");
                    return [2 /*return*/];
            }
        });
    }); });
});
