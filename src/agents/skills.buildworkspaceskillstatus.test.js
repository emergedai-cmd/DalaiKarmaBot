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
var skills_status_js_1 = require("./skills-status.js");
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
(0, vitest_1.describe)("buildWorkspaceSkillStatus", function () {
    (0, vitest_1.it)("reports missing requirements and install options", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, skillDir, report, skill;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    workspaceDir = _b.sent();
                    skillDir = node_path_1.default.join(workspaceDir, "skills", "status-skill");
                    return [4 /*yield*/, writeSkill({
                            dir: skillDir,
                            name: "status-skill",
                            description: "Needs setup",
                            metadata: '{"openclaw":{"requires":{"bins":["fakebin"],"env":["ENV_KEY"],"config":["browser.enabled"]},"install":[{"id":"brew","kind":"brew","formula":"fakebin","bins":["fakebin"],"label":"Install fakebin"}]}}',
                        })];
                case 2:
                    _b.sent();
                    report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                        config: { browser: { enabled: false } },
                    });
                    skill = report.skills.find(function (entry) { return entry.name === "status-skill"; });
                    (0, vitest_1.expect)(skill).toBeDefined();
                    (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.eligible).toBe(false);
                    (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.missing.bins).toContain("fakebin");
                    (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.missing.env).toContain("ENV_KEY");
                    (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.missing.config).toContain("browser.enabled");
                    (0, vitest_1.expect)((_a = skill === null || skill === void 0 ? void 0 : skill.install[0]) === null || _a === void 0 ? void 0 : _a.id).toBe("brew");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects OS-gated skills", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, skillDir, report, skill;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    workspaceDir = _a.sent();
                    skillDir = node_path_1.default.join(workspaceDir, "skills", "os-skill");
                    return [4 /*yield*/, writeSkill({
                            dir: skillDir,
                            name: "os-skill",
                            description: "Darwin only",
                            metadata: '{"openclaw":{"os":["darwin"]}}',
                        })];
                case 2:
                    _a.sent();
                    report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                    });
                    skill = report.skills.find(function (entry) { return entry.name === "os-skill"; });
                    (0, vitest_1.expect)(skill).toBeDefined();
                    if (process.platform === "darwin") {
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.eligible).toBe(true);
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.missing.os).toEqual([]);
                    }
                    else {
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.eligible).toBe(false);
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.missing.os).toEqual(["darwin"]);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("marks bundled skills blocked by allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, bundledDir, bundledSkillDir, originalBundled, report, skill;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    workspaceDir = _a.sent();
                    bundledDir = node_path_1.default.join(workspaceDir, ".bundled");
                    bundledSkillDir = node_path_1.default.join(bundledDir, "peekaboo");
                    originalBundled = process.env.OPENCLAW_BUNDLED_SKILLS_DIR;
                    return [4 /*yield*/, writeSkill({
                            dir: bundledSkillDir,
                            name: "peekaboo",
                            description: "Capture UI",
                            body: "# Peekaboo\n",
                        })];
                case 2:
                    _a.sent();
                    try {
                        process.env.OPENCLAW_BUNDLED_SKILLS_DIR = bundledDir;
                        report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, {
                            managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                            config: { skills: { allowBundled: ["other-skill"] } },
                        });
                        skill = report.skills.find(function (entry) { return entry.name === "peekaboo"; });
                        (0, vitest_1.expect)(skill).toBeDefined();
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.blockedByAllowlist).toBe(true);
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.eligible).toBe(false);
                    }
                    finally {
                        if (originalBundled === undefined) {
                            delete process.env.OPENCLAW_BUNDLED_SKILLS_DIR;
                        }
                        else {
                            process.env.OPENCLAW_BUNDLED_SKILLS_DIR = originalBundled;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("filters install options by OS", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, skillDir, report, skill;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"))];
                case 1:
                    workspaceDir = _a.sent();
                    skillDir = node_path_1.default.join(workspaceDir, "skills", "install-skill");
                    return [4 /*yield*/, writeSkill({
                            dir: skillDir,
                            name: "install-skill",
                            description: "OS-specific installs",
                            metadata: '{"openclaw":{"requires":{"bins":["missing-bin"]},"install":[{"id":"mac","kind":"download","os":["darwin"],"url":"https://example.com/mac.tar.bz2"},{"id":"linux","kind":"download","os":["linux"],"url":"https://example.com/linux.tar.bz2"},{"id":"win","kind":"download","os":["win32"],"url":"https://example.com/win.tar.bz2"}]}}',
                        })];
                case 2:
                    _a.sent();
                    report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, {
                        managedSkillsDir: node_path_1.default.join(workspaceDir, ".managed"),
                    });
                    skill = report.skills.find(function (entry) { return entry.name === "install-skill"; });
                    (0, vitest_1.expect)(skill).toBeDefined();
                    if (process.platform === "darwin") {
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.install.map(function (opt) { return opt.id; })).toEqual(["mac"]);
                    }
                    else if (process.platform === "linux") {
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.install.map(function (opt) { return opt.id; })).toEqual(["linux"]);
                    }
                    else if (process.platform === "win32") {
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.install.map(function (opt) { return opt.id; })).toEqual(["win"]);
                    }
                    else {
                        (0, vitest_1.expect)(skill === null || skill === void 0 ? void 0 : skill.install).toEqual([]);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
