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
var node_events_1 = require("node:events");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_stream_1 = require("node:stream");
var vitest_1 = require("vitest");
var spawnCalls = [];
vitest_1.vi.mock("node:child_process", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { spawn: function (command, args) {
                            spawnCalls.push({ command: command, args: args });
                            var child = new node_events_1.EventEmitter();
                            child.stdout = new node_stream_1.Readable({ read: function () { } });
                            child.stderr = new node_stream_1.Readable({ read: function () { } });
                            var dockerArgs = command === "docker" ? args : [];
                            var shouldFailContainerInspect = dockerArgs[0] === "inspect" &&
                                dockerArgs[1] === "-f" &&
                                dockerArgs[2] === "{{.State.Running}}";
                            var shouldSucceedImageInspect = dockerArgs[0] === "image" && dockerArgs[1] === "inspect";
                            var code = shouldFailContainerInspect ? 1 : 0;
                            if (shouldSucceedImageInspect) {
                                queueMicrotask(function () { return child.emit("close", 0); });
                            }
                            else {
                                queueMicrotask(function () { return child.emit("close", code); });
                            }
                            return child;
                        } })];
        }
    });
}); });
function writeSkill(params) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, name, description;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = params.dir, name = params.name, description = params.description;
                    return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "SKILL.md"), "---\nname: ".concat(name, "\ndescription: ").concat(description, "\n---\n\n# ").concat(name, "\n"), "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function restoreEnv(snapshot) {
    for (var _i = 0, _a = Object.keys(process.env); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!(key in snapshot)) {
            delete process.env[key];
        }
    }
    for (var _b = 0, _c = Object.entries(snapshot); _b < _c.length; _b++) {
        var _d = _c[_b], key = _d[0], value = _d[1];
        if (value === undefined) {
            delete process.env[key];
        }
        else {
            process.env[key] = value;
        }
    }
}
(0, vitest_1.describe)("sandbox skill mirroring", function () {
    var envSnapshot;
    (0, vitest_1.beforeEach)(function () {
        spawnCalls.length = 0;
        envSnapshot = __assign({}, process.env);
    });
    (0, vitest_1.afterEach)(function () {
        restoreEnv(envSnapshot);
        vitest_1.vi.resetModules();
    });
    var runContext = function (workspaceAccess) { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, bundledDir, resolveSandboxContext, workspaceDir, cfg, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-state-"))];
                case 1:
                    stateDir = _a.sent();
                    bundledDir = node_path_1.default.join(stateDir, "bundled-skills");
                    return [4 /*yield*/, promises_1.default.mkdir(bundledDir, { recursive: true })];
                case 2:
                    _a.sent();
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    process.env.OPENCLAW_BUNDLED_SKILLS_DIR = bundledDir;
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 3:
                    resolveSandboxContext = (_a.sent()).resolveSandboxContext;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-workspace-"))];
                case 4:
                    workspaceDir = _a.sent();
                    return [4 /*yield*/, writeSkill({
                            dir: node_path_1.default.join(workspaceDir, "skills", "demo-skill"),
                            name: "demo-skill",
                            description: "Demo skill",
                        })];
                case 5:
                    _a.sent();
                    cfg = {
                        agents: {
                            defaults: {
                                sandbox: {
                                    mode: "all",
                                    scope: "session",
                                    workspaceAccess: workspaceAccess,
                                    workspaceRoot: node_path_1.default.join(stateDir, "sandboxes"),
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, resolveSandboxContext({
                            config: cfg,
                            sessionKey: "agent:main:main",
                            workspaceDir: workspaceDir,
                        })];
                case 6:
                    context = _a.sent();
                    return [2 /*return*/, { context: context, workspaceDir: workspaceDir }];
            }
        });
    }); };
    (0, vitest_1.it)("copies skills into the sandbox when workspaceAccess is ro", function () { return __awaiter(void 0, void 0, void 0, function () {
        var context, skillPath;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, runContext("ro")];
                case 1:
                    context = (_b.sent()).context;
                    (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.enabled).toBe(true);
                    skillPath = node_path_1.default.join((_a = context === null || context === void 0 ? void 0 : context.workspaceDir) !== null && _a !== void 0 ? _a : "", "skills", "demo-skill", "SKILL.md");
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.readFile(skillPath, "utf-8")).resolves.toContain("demo-skill")];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("copies skills into the sandbox when workspaceAccess is none", function () { return __awaiter(void 0, void 0, void 0, function () {
        var context, skillPath;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, runContext("none")];
                case 1:
                    context = (_b.sent()).context;
                    (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.enabled).toBe(true);
                    skillPath = node_path_1.default.join((_a = context === null || context === void 0 ? void 0 : context.workspaceDir) !== null && _a !== void 0 ? _a : "", "skills", "demo-skill", "SKILL.md");
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.readFile(skillPath, "utf-8")).resolves.toContain("demo-skill")];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
});
