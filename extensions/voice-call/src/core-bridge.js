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
exports.loadCoreAgentDeps = loadCoreAgentDeps;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var coreRootCache = null;
var coreDepsPromise = null;
function findPackageRoot(startDir, name) {
    var dir = startDir;
    for (;;) {
        var pkgPath = node_path_1.default.join(dir, "package.json");
        try {
            if (node_fs_1.default.existsSync(pkgPath)) {
                var raw = node_fs_1.default.readFileSync(pkgPath, "utf8");
                var pkg = JSON.parse(raw);
                if (pkg.name === name) {
                    return dir;
                }
            }
        }
        catch (_a) {
            // ignore parse errors and keep walking
        }
        var parent_1 = node_path_1.default.dirname(dir);
        if (parent_1 === dir) {
            return null;
        }
        dir = parent_1;
    }
}
function resolveOpenClawRoot() {
    var _a;
    if (coreRootCache) {
        return coreRootCache;
    }
    var override = (_a = process.env.OPENCLAW_ROOT) === null || _a === void 0 ? void 0 : _a.trim();
    if (override) {
        coreRootCache = override;
        return override;
    }
    var candidates = new Set();
    if (process.argv[1]) {
        candidates.add(node_path_1.default.dirname(process.argv[1]));
    }
    candidates.add(process.cwd());
    try {
        var urlPath = (0, node_url_1.fileURLToPath)(import.meta.url);
        candidates.add(node_path_1.default.dirname(urlPath));
    }
    catch (_b) {
        // ignore
    }
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var start = candidates_1[_i];
        for (var _c = 0, _d = ["openclaw"]; _c < _d.length; _c++) {
            var name_1 = _d[_c];
            var found = findPackageRoot(start, name_1);
            if (found) {
                coreRootCache = found;
                return found;
            }
        }
    }
    throw new Error("Unable to resolve core root. Set OPENCLAW_ROOT to the package root.");
}
function importCoreModule(relativePath) {
    return __awaiter(this, void 0, void 0, function () {
        var root, distPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    root = resolveOpenClawRoot();
                    distPath = node_path_1.default.join(root, "dist", relativePath);
                    if (!node_fs_1.default.existsSync(distPath)) {
                        throw new Error("Missing core module at ".concat(distPath, ". Run `pnpm build` or install the official package."));
                    }
                    return [4 /*yield*/, Promise.resolve("".concat((0, node_url_1.pathToFileURL)(distPath).href)).then(function (s) { return require(s); })];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
function loadCoreAgentDeps() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (coreDepsPromise) {
                return [2 /*return*/, coreDepsPromise];
            }
            coreDepsPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, agentScope, defaults, identity, modelSelection, piEmbedded, timeout, workspace, sessions;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                importCoreModule("agents/agent-scope.js"),
                                importCoreModule("agents/defaults.js"),
                                importCoreModule("agents/identity.js"),
                                importCoreModule("agents/model-selection.js"),
                                importCoreModule("agents/pi-embedded.js"),
                                importCoreModule("agents/timeout.js"),
                                importCoreModule("agents/workspace.js"),
                                importCoreModule("config/sessions.js"),
                            ])];
                        case 1:
                            _a = _b.sent(), agentScope = _a[0], defaults = _a[1], identity = _a[2], modelSelection = _a[3], piEmbedded = _a[4], timeout = _a[5], workspace = _a[6], sessions = _a[7];
                            return [2 /*return*/, {
                                    resolveAgentDir: agentScope.resolveAgentDir,
                                    resolveAgentWorkspaceDir: agentScope.resolveAgentWorkspaceDir,
                                    resolveAgentIdentity: identity.resolveAgentIdentity,
                                    resolveThinkingDefault: modelSelection.resolveThinkingDefault,
                                    runEmbeddedPiAgent: piEmbedded.runEmbeddedPiAgent,
                                    resolveAgentTimeoutMs: timeout.resolveAgentTimeoutMs,
                                    ensureAgentWorkspace: workspace.ensureAgentWorkspace,
                                    resolveStorePath: sessions.resolveStorePath,
                                    loadSessionStore: sessions.loadSessionStore,
                                    saveSessionStore: sessions.saveSessionStore,
                                    resolveSessionFilePath: sessions.resolveSessionFilePath,
                                    DEFAULT_MODEL: defaults.DEFAULT_MODEL,
                                    DEFAULT_PROVIDER: defaults.DEFAULT_PROVIDER,
                                }];
                    }
                });
            }); })();
            return [2 /*return*/, coreDepsPromise];
        });
    });
}
