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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureOnboardingPluginInstalled = ensureOnboardingPluginInstalled;
exports.reloadOnboardingPluginRegistry = reloadOnboardingPluginRegistry;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var subsystem_js_1 = require("../../logging/subsystem.js");
var enable_js_1 = require("../../plugins/enable.js");
var install_js_1 = require("../../plugins/install.js");
var installs_js_1 = require("../../plugins/installs.js");
var loader_js_1 = require("../../plugins/loader.js");
function hasGitWorkspace(workspaceDir) {
    var candidates = new Set();
    candidates.add(node_path_1.default.join(process.cwd(), ".git"));
    if (workspaceDir && workspaceDir !== process.cwd()) {
        candidates.add(node_path_1.default.join(workspaceDir, ".git"));
    }
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        if (node_fs_1.default.existsSync(candidate)) {
            return true;
        }
    }
    return false;
}
function resolveLocalPath(entry, workspaceDir, allowLocal) {
    var _a;
    if (!allowLocal) {
        return null;
    }
    var raw = (_a = entry.install.localPath) === null || _a === void 0 ? void 0 : _a.trim();
    if (!raw) {
        return null;
    }
    var candidates = new Set();
    candidates.add(node_path_1.default.resolve(process.cwd(), raw));
    if (workspaceDir && workspaceDir !== process.cwd()) {
        candidates.add(node_path_1.default.resolve(workspaceDir, raw));
    }
    for (var _i = 0, candidates_2 = candidates; _i < candidates_2.length; _i++) {
        var candidate = candidates_2[_i];
        if (node_fs_1.default.existsSync(candidate)) {
            return candidate;
        }
    }
    return null;
}
function addPluginLoadPath(cfg, pluginPath) {
    var _a, _b, _c, _d;
    var existing = (_c = (_b = (_a = cfg.plugins) === null || _a === void 0 ? void 0 : _a.load) === null || _b === void 0 ? void 0 : _b.paths) !== null && _c !== void 0 ? _c : [];
    var merged = Array.from(new Set(__spreadArray(__spreadArray([], existing, true), [pluginPath], false)));
    return __assign(__assign({}, cfg), { plugins: __assign(__assign({}, cfg.plugins), { load: __assign(__assign({}, (_d = cfg.plugins) === null || _d === void 0 ? void 0 : _d.load), { paths: merged }) }) });
}
function promptInstallChoice(params) {
    return __awaiter(this, void 0, void 0, function () {
        var entry, localPath, prompter, defaultChoice, localOptions, options, initialValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entry = params.entry, localPath = params.localPath, prompter = params.prompter, defaultChoice = params.defaultChoice;
                    localOptions = localPath
                        ? [
                            {
                                value: "local",
                                label: "Use local plugin path",
                                hint: localPath,
                            },
                        ]
                        : [];
                    options = __spreadArray(__spreadArray([
                        { value: "npm", label: "Download from npm (".concat(entry.install.npmSpec, ")") }
                    ], localOptions, true), [
                        { value: "skip", label: "Skip for now" },
                    ], false);
                    initialValue = defaultChoice === "local" && !localPath ? "npm" : defaultChoice;
                    return [4 /*yield*/, prompter.select({
                            message: "Install ".concat(entry.meta.label, " plugin?"),
                            options: options,
                            initialValue: initialValue,
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function resolveInstallDefaultChoice(params) {
    var _a;
    var cfg = params.cfg, entry = params.entry, localPath = params.localPath;
    var updateChannel = (_a = cfg.update) === null || _a === void 0 ? void 0 : _a.channel;
    if (updateChannel === "dev") {
        return localPath ? "local" : "npm";
    }
    if (updateChannel === "stable" || updateChannel === "beta") {
        return "npm";
    }
    var entryDefault = entry.install.defaultChoice;
    if (entryDefault === "local") {
        return localPath ? "local" : "npm";
    }
    if (entryDefault === "npm") {
        return "npm";
    }
    return localPath ? "local" : "npm";
}
function ensureOnboardingPluginInstalled(params) {
    return __awaiter(this, void 0, void 0, function () {
        var entry, prompter, runtime, workspaceDir, next, allowLocal, localPath, defaultChoice, choice, result, fallback;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    entry = params.entry, prompter = params.prompter, runtime = params.runtime, workspaceDir = params.workspaceDir;
                    next = params.cfg;
                    allowLocal = hasGitWorkspace(workspaceDir);
                    localPath = resolveLocalPath(entry, workspaceDir, allowLocal);
                    defaultChoice = resolveInstallDefaultChoice({
                        cfg: next,
                        entry: entry,
                        localPath: localPath,
                    });
                    return [4 /*yield*/, promptInstallChoice({
                            entry: entry,
                            localPath: localPath,
                            defaultChoice: defaultChoice,
                            prompter: prompter,
                        })];
                case 1:
                    choice = _b.sent();
                    if (choice === "skip") {
                        return [2 /*return*/, { cfg: next, installed: false }];
                    }
                    if (choice === "local" && localPath) {
                        next = addPluginLoadPath(next, localPath);
                        next = (0, enable_js_1.enablePluginInConfig)(next, entry.id).config;
                        return [2 /*return*/, { cfg: next, installed: true }];
                    }
                    return [4 /*yield*/, (0, install_js_1.installPluginFromNpmSpec)({
                            spec: entry.install.npmSpec,
                            logger: {
                                info: function (msg) { var _a; return (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, msg); },
                                warn: function (msg) { var _a; return (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, msg); },
                            },
                        })];
                case 2:
                    result = _b.sent();
                    if (result.ok) {
                        next = (0, enable_js_1.enablePluginInConfig)(next, result.pluginId).config;
                        next = (0, installs_js_1.recordPluginInstall)(next, {
                            pluginId: result.pluginId,
                            source: "npm",
                            spec: entry.install.npmSpec,
                            installPath: result.targetDir,
                            version: result.version,
                        });
                        return [2 /*return*/, { cfg: next, installed: true }];
                    }
                    return [4 /*yield*/, prompter.note("Failed to install ".concat(entry.install.npmSpec, ": ").concat(result.error), "Plugin install")];
                case 3:
                    _b.sent();
                    if (!localPath) return [3 /*break*/, 5];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Use local plugin path instead? (".concat(localPath, ")"),
                            initialValue: true,
                        })];
                case 4:
                    fallback = _b.sent();
                    if (fallback) {
                        next = addPluginLoadPath(next, localPath);
                        next = (0, enable_js_1.enablePluginInConfig)(next, entry.id).config;
                        return [2 /*return*/, { cfg: next, installed: true }];
                    }
                    _b.label = 5;
                case 5:
                    (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "Plugin install failed: ".concat(result.error));
                    return [2 /*return*/, { cfg: next, installed: false }];
            }
        });
    });
}
function reloadOnboardingPluginRegistry(params) {
    var _a;
    var workspaceDir = (_a = params.workspaceDir) !== null && _a !== void 0 ? _a : (0, agent_scope_js_1.resolveAgentWorkspaceDir)(params.cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(params.cfg));
    var log = (0, subsystem_js_1.createSubsystemLogger)("plugins");
    (0, loader_js_1.loadOpenClawPlugins)({
        config: params.cfg,
        workspaceDir: workspaceDir,
        cache: false,
        logger: {
            info: function (msg) { return log.info(msg); },
            warn: function (msg) { return log.warn(msg); },
            error: function (msg) { return log.error(msg); },
            debug: function (msg) { return log.debug(msg); },
        },
    });
}
