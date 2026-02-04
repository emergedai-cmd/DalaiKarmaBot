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
exports.resolveControlUiRepoRoot = resolveControlUiRepoRoot;
exports.resolveControlUiDistIndexPath = resolveControlUiDistIndexPath;
exports.ensureControlUiAssetsBuilt = ensureControlUiAssetsBuilt;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var exec_js_1 = require("../process/exec.js");
var runtime_js_1 = require("../runtime.js");
var openclaw_root_js_1 = require("./openclaw-root.js");
function resolveControlUiRepoRoot(argv1) {
    if (argv1 === void 0) { argv1 = process.argv[1]; }
    if (!argv1) {
        return null;
    }
    var normalized = node_path_1.default.resolve(argv1);
    var parts = normalized.split(node_path_1.default.sep);
    var srcIndex = parts.lastIndexOf("src");
    if (srcIndex !== -1) {
        var root = parts.slice(0, srcIndex).join(node_path_1.default.sep);
        if (node_fs_1.default.existsSync(node_path_1.default.join(root, "ui", "vite.config.ts"))) {
            return root;
        }
    }
    var dir = node_path_1.default.dirname(normalized);
    for (var i = 0; i < 8; i++) {
        if (node_fs_1.default.existsSync(node_path_1.default.join(dir, "package.json")) &&
            node_fs_1.default.existsSync(node_path_1.default.join(dir, "ui", "vite.config.ts"))) {
            return dir;
        }
        var parent_1 = node_path_1.default.dirname(dir);
        if (parent_1 === dir) {
            break;
        }
        dir = parent_1;
    }
    return null;
}
function resolveControlUiDistIndexPath() {
    return __awaiter(this, arguments, void 0, function (argv1) {
        var normalized, distDir, packageRoot;
        if (argv1 === void 0) { argv1 = process.argv[1]; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!argv1) {
                        return [2 /*return*/, null];
                    }
                    normalized = node_path_1.default.resolve(argv1);
                    distDir = node_path_1.default.dirname(normalized);
                    if (node_path_1.default.basename(distDir) === "dist") {
                        return [2 /*return*/, node_path_1.default.join(distDir, "control-ui", "index.html")];
                    }
                    return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({ argv1: normalized })];
                case 1:
                    packageRoot = _a.sent();
                    if (!packageRoot) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, node_path_1.default.join(packageRoot, "dist", "control-ui", "index.html")];
            }
        });
    });
}
function summarizeCommandOutput(text) {
    var lines = text
        .split(/\r?\n/g)
        .map(function (l) { return l.trim(); })
        .filter(Boolean);
    if (!lines.length) {
        return undefined;
    }
    var last = lines.at(-1);
    if (!last) {
        return undefined;
    }
    return last.length > 240 ? "".concat(last.slice(0, 239), "\u2026") : last;
}
function ensureControlUiAssetsBuilt() {
    return __awaiter(this, arguments, void 0, function (runtime, opts) {
        var indexFromDist, repoRoot, hint, indexPath, uiScript, build;
        var _a, _b;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, resolveControlUiDistIndexPath(process.argv[1])];
                case 1:
                    indexFromDist = _c.sent();
                    if (indexFromDist && node_fs_1.default.existsSync(indexFromDist)) {
                        return [2 /*return*/, { ok: true, built: false }];
                    }
                    repoRoot = resolveControlUiRepoRoot(process.argv[1]);
                    if (!repoRoot) {
                        hint = indexFromDist
                            ? "Missing Control UI assets at ".concat(indexFromDist)
                            : "Missing Control UI assets";
                        return [2 /*return*/, {
                                ok: false,
                                built: false,
                                message: "".concat(hint, ". Build them with `pnpm ui:build` (auto-installs UI deps)."),
                            }];
                    }
                    indexPath = node_path_1.default.join(repoRoot, "dist", "control-ui", "index.html");
                    if (node_fs_1.default.existsSync(indexPath)) {
                        return [2 /*return*/, { ok: true, built: false }];
                    }
                    uiScript = node_path_1.default.join(repoRoot, "scripts", "ui.js");
                    if (!node_fs_1.default.existsSync(uiScript)) {
                        return [2 /*return*/, {
                                ok: false,
                                built: false,
                                message: "Control UI assets missing but ".concat(uiScript, " is unavailable."),
                            }];
                    }
                    runtime.log("Control UI assets missing; building (ui:build, auto-installs UI deps)…");
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)([process.execPath, uiScript, "build"], {
                            cwd: repoRoot,
                            timeoutMs: (_a = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null && _a !== void 0 ? _a : 10 * 60000,
                        })];
                case 2:
                    build = _c.sent();
                    if (build.code !== 0) {
                        return [2 /*return*/, {
                                ok: false,
                                built: false,
                                message: "Control UI build failed: ".concat((_b = summarizeCommandOutput(build.stderr)) !== null && _b !== void 0 ? _b : "exit ".concat(build.code)),
                            }];
                    }
                    if (!node_fs_1.default.existsSync(indexPath)) {
                        return [2 /*return*/, {
                                ok: false,
                                built: true,
                                message: "Control UI build completed but ".concat(indexPath, " is still missing."),
                            }];
                    }
                    return [2 /*return*/, { ok: true, built: true }];
            }
        });
    });
}
