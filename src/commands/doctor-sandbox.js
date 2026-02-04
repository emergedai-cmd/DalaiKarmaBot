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
exports.maybeRepairSandboxImages = maybeRepairSandboxImages;
exports.noteSandboxScopeWarnings = noteSandboxScopeWarnings;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var sandbox_js_1 = require("../agents/sandbox.js");
var exec_js_1 = require("../process/exec.js");
var note_js_1 = require("../terminal/note.js");
function resolveSandboxScript(scriptRel) {
    var candidates = new Set();
    candidates.add(process.cwd());
    var argv1 = process.argv[1];
    if (argv1) {
        var normalized = node_path_1.default.resolve(argv1);
        candidates.add(node_path_1.default.resolve(node_path_1.default.dirname(normalized), ".."));
        candidates.add(node_path_1.default.resolve(node_path_1.default.dirname(normalized)));
    }
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var root = candidates_1[_i];
        var scriptPath = node_path_1.default.join(root, scriptRel);
        if (node_fs_1.default.existsSync(scriptPath)) {
            return { scriptPath: scriptPath, cwd: root };
        }
    }
    return null;
}
function runSandboxScript(scriptRel, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var script, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    script = resolveSandboxScript(scriptRel);
                    if (!script) {
                        (0, note_js_1.note)("Unable to locate ".concat(scriptRel, ". Run it from the repo root."), "Sandbox");
                        return [2 /*return*/, false];
                    }
                    runtime.log("Running ".concat(scriptRel, "..."));
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(["bash", script.scriptPath], {
                            timeoutMs: 20 * 60 * 1000,
                            cwd: script.cwd,
                        })];
                case 1:
                    result = _a.sent();
                    if (result.code !== 0) {
                        runtime.error("Failed running ".concat(scriptRel, ": ").concat(result.stderr.trim() || result.stdout.trim() || "unknown error"));
                        return [2 /*return*/, false];
                    }
                    runtime.log("Completed ".concat(scriptRel, "."));
                    return [2 /*return*/, true];
            }
        });
    });
}
function isDockerAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, exec_js_1.runExec)("docker", ["version", "--format", "{{.Server.Version}}"], {
                            timeoutMs: 5000,
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function dockerImageExists(image) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, stderr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, exec_js_1.runExec)("docker", ["image", "inspect", image], { timeoutMs: 5000 })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    error_1 = _a.sent();
                    stderr = (error_1 === null || error_1 === void 0 ? void 0 : error_1.stderr) ||
                        (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) ||
                        "";
                    if (String(stderr).includes("No such image")) {
                        return [2 /*return*/, false];
                    }
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resolveSandboxDockerImage(cfg) {
    var _a, _b, _c, _d, _e;
    var image = (_e = (_d = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.sandbox) === null || _c === void 0 ? void 0 : _c.docker) === null || _d === void 0 ? void 0 : _d.image) === null || _e === void 0 ? void 0 : _e.trim();
    return image ? image : sandbox_js_1.DEFAULT_SANDBOX_IMAGE;
}
function resolveSandboxBrowserImage(cfg) {
    var _a, _b, _c, _d, _e;
    var image = (_e = (_d = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.sandbox) === null || _c === void 0 ? void 0 : _c.browser) === null || _d === void 0 ? void 0 : _d.image) === null || _e === void 0 ? void 0 : _e.trim();
    return image ? image : sandbox_js_1.DEFAULT_SANDBOX_BROWSER_IMAGE;
}
function updateSandboxDockerImage(cfg, image) {
    var _a, _b, _c, _d, _e, _f;
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults), { sandbox: __assign(__assign({}, (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.sandbox), { docker: __assign(__assign({}, (_f = (_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.sandbox) === null || _f === void 0 ? void 0 : _f.docker), { image: image }) }) }) }) });
}
function updateSandboxBrowserImage(cfg, image) {
    var _a, _b, _c, _d, _e, _f;
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults), { sandbox: __assign(__assign({}, (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.sandbox), { browser: __assign(__assign({}, (_f = (_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.sandbox) === null || _f === void 0 ? void 0 : _f.browser), { image: image }) }) }) }) });
}
function handleMissingSandboxImage(params, runtime, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var exists, buildHint, built, build;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dockerImageExists(params.image)];
                case 1:
                    exists = _a.sent();
                    if (exists) {
                        return [2 /*return*/];
                    }
                    buildHint = params.buildScript
                        ? "Build it with ".concat(params.buildScript, ".")
                        : "Build or pull it first.";
                    (0, note_js_1.note)("Sandbox ".concat(params.kind, " image missing: ").concat(params.image, ". ").concat(buildHint), "Sandbox");
                    built = false;
                    if (!params.buildScript) return [3 /*break*/, 4];
                    return [4 /*yield*/, prompter.confirmSkipInNonInteractive({
                            message: "Build ".concat(params.kind, " sandbox image now?"),
                            initialValue: true,
                        })];
                case 2:
                    build = _a.sent();
                    if (!build) return [3 /*break*/, 4];
                    return [4 /*yield*/, runSandboxScript(params.buildScript, runtime)];
                case 3:
                    built = _a.sent();
                    _a.label = 4;
                case 4:
                    if (built) {
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function maybeRepairSandboxImages(cfg, runtime, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var sandbox, mode, dockerAvailable, next, changes, dockerImage;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    sandbox = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.sandbox;
                    mode = (_c = sandbox === null || sandbox === void 0 ? void 0 : sandbox.mode) !== null && _c !== void 0 ? _c : "off";
                    if (!sandbox || mode === "off") {
                        return [2 /*return*/, cfg];
                    }
                    return [4 /*yield*/, isDockerAvailable()];
                case 1:
                    dockerAvailable = _e.sent();
                    if (!dockerAvailable) {
                        (0, note_js_1.note)("Docker not available; skipping sandbox image checks.", "Sandbox");
                        return [2 /*return*/, cfg];
                    }
                    next = cfg;
                    changes = [];
                    dockerImage = resolveSandboxDockerImage(cfg);
                    return [4 /*yield*/, handleMissingSandboxImage({
                            kind: "base",
                            image: dockerImage,
                            buildScript: dockerImage === sandbox_js_1.DEFAULT_SANDBOX_COMMON_IMAGE
                                ? "scripts/sandbox-common-setup.sh"
                                : dockerImage === sandbox_js_1.DEFAULT_SANDBOX_IMAGE
                                    ? "scripts/sandbox-setup.sh"
                                    : undefined,
                            updateConfig: function (image) {
                                next = updateSandboxDockerImage(next, image);
                                changes.push("Updated agents.defaults.sandbox.docker.image \u2192 ".concat(image));
                            },
                        }, runtime, prompter)];
                case 2:
                    _e.sent();
                    if (!((_d = sandbox.browser) === null || _d === void 0 ? void 0 : _d.enabled)) return [3 /*break*/, 4];
                    return [4 /*yield*/, handleMissingSandboxImage({
                            kind: "browser",
                            image: resolveSandboxBrowserImage(cfg),
                            buildScript: "scripts/sandbox-browser-setup.sh",
                            updateConfig: function (image) {
                                next = updateSandboxBrowserImage(next, image);
                                changes.push("Updated agents.defaults.sandbox.browser.image \u2192 ".concat(image));
                            },
                        }, runtime, prompter)];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4:
                    if (changes.length > 0) {
                        (0, note_js_1.note)(changes.join("\n"), "Doctor changes");
                    }
                    return [2 /*return*/, next];
            }
        });
    });
}
function noteSandboxScopeWarnings(cfg) {
    var _a, _b, _c, _d, _e;
    var globalSandbox = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.sandbox;
    var agents = Array.isArray((_c = cfg.agents) === null || _c === void 0 ? void 0 : _c.list) ? cfg.agents.list : [];
    var warnings = [];
    for (var _i = 0, agents_1 = agents; _i < agents_1.length; _i++) {
        var agent = agents_1[_i];
        var agentId = agent.id;
        var agentSandbox = agent.sandbox;
        if (!agentSandbox) {
            continue;
        }
        var scope = (0, sandbox_js_1.resolveSandboxScope)({
            scope: (_d = agentSandbox.scope) !== null && _d !== void 0 ? _d : globalSandbox === null || globalSandbox === void 0 ? void 0 : globalSandbox.scope,
            perSession: (_e = agentSandbox.perSession) !== null && _e !== void 0 ? _e : globalSandbox === null || globalSandbox === void 0 ? void 0 : globalSandbox.perSession,
        });
        if (scope !== "shared") {
            continue;
        }
        var overrides = [];
        if (agentSandbox.docker && Object.keys(agentSandbox.docker).length > 0) {
            overrides.push("docker");
        }
        if (agentSandbox.browser && Object.keys(agentSandbox.browser).length > 0) {
            overrides.push("browser");
        }
        if (agentSandbox.prune && Object.keys(agentSandbox.prune).length > 0) {
            overrides.push("prune");
        }
        if (overrides.length === 0) {
            continue;
        }
        warnings.push([
            "- agents.list (id \"".concat(agentId, "\") sandbox ").concat(overrides.join("/"), " overrides ignored."),
            "  scope resolves to \"shared\".",
        ].join("\n"));
    }
    if (warnings.length > 0) {
        (0, note_js_1.note)(warnings.join("\n"), "Sandbox");
    }
}
