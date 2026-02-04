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
exports.resolveGatewayProgramArguments = resolveGatewayProgramArguments;
exports.resolveNodeProgramArguments = resolveNodeProgramArguments;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
function isNodeRuntime(execPath) {
    var base = node_path_1.default.basename(execPath).toLowerCase();
    return base === "node" || base === "node.exe";
}
function isBunRuntime(execPath) {
    var base = node_path_1.default.basename(execPath).toLowerCase();
    return base === "bun" || base === "bun.exe";
}
function resolveCliEntrypointPathForService() {
    return __awaiter(this, void 0, void 0, function () {
        var argv1, normalized, resolvedPath, looksLikeDist, normalizedLooksLikeDist, _a, distCandidates, _i, distCandidates_1, candidate, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    argv1 = process.argv[1];
                    if (!argv1) {
                        throw new Error("Unable to resolve CLI entrypoint path");
                    }
                    normalized = node_path_1.default.resolve(argv1);
                    return [4 /*yield*/, resolveRealpathSafe(normalized)];
                case 1:
                    resolvedPath = _c.sent();
                    looksLikeDist = /[/\\]dist[/\\].+\.(cjs|js|mjs)$/.test(resolvedPath);
                    if (!looksLikeDist) return [3 /*break*/, 7];
                    return [4 /*yield*/, promises_1.default.access(resolvedPath)];
                case 2:
                    _c.sent();
                    normalizedLooksLikeDist = /[/\\]dist[/\\].+\.(cjs|js|mjs)$/.test(normalized);
                    if (!(normalizedLooksLikeDist && normalized !== resolvedPath)) return [3 /*break*/, 6];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.access(normalized)];
                case 4:
                    _c.sent();
                    return [2 /*return*/, normalized];
                case 5:
                    _a = _c.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, resolvedPath];
                case 7:
                    distCandidates = buildDistCandidates(resolvedPath, normalized);
                    _i = 0, distCandidates_1 = distCandidates;
                    _c.label = 8;
                case 8:
                    if (!(_i < distCandidates_1.length)) return [3 /*break*/, 13];
                    candidate = distCandidates_1[_i];
                    _c.label = 9;
                case 9:
                    _c.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, promises_1.default.access(candidate)];
                case 10:
                    _c.sent();
                    return [2 /*return*/, candidate];
                case 11:
                    _b = _c.sent();
                    return [3 /*break*/, 12];
                case 12:
                    _i++;
                    return [3 /*break*/, 8];
                case 13: throw new Error("Cannot find built CLI at ".concat(distCandidates.join(" or "), ". Run \"pnpm build\" first, or use dev mode."));
            }
        });
    });
}
function resolveRealpathSafe(inputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.realpath(inputPath)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, inputPath];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function buildDistCandidates() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    var candidates = [];
    var seen = new Set();
    for (var _a = 0, inputs_1 = inputs; _a < inputs_1.length; _a++) {
        var inputPath = inputs_1[_a];
        if (!inputPath) {
            continue;
        }
        var baseDir = node_path_1.default.dirname(inputPath);
        appendDistCandidates(candidates, seen, node_path_1.default.resolve(baseDir, ".."));
        appendDistCandidates(candidates, seen, baseDir);
        appendNodeModulesBinCandidates(candidates, seen, inputPath);
    }
    return candidates;
}
function appendDistCandidates(candidates, seen, baseDir) {
    var distDir = node_path_1.default.resolve(baseDir, "dist");
    var distEntries = [
        node_path_1.default.join(distDir, "index.js"),
        node_path_1.default.join(distDir, "index.mjs"),
        node_path_1.default.join(distDir, "entry.js"),
        node_path_1.default.join(distDir, "entry.mjs"),
    ];
    for (var _i = 0, distEntries_1 = distEntries; _i < distEntries_1.length; _i++) {
        var entry = distEntries_1[_i];
        if (seen.has(entry)) {
            continue;
        }
        seen.add(entry);
        candidates.push(entry);
    }
}
function appendNodeModulesBinCandidates(candidates, seen, inputPath) {
    var parts = inputPath.split(node_path_1.default.sep);
    var binIndex = parts.lastIndexOf(".bin");
    if (binIndex <= 0) {
        return;
    }
    if (parts[binIndex - 1] !== "node_modules") {
        return;
    }
    var binName = node_path_1.default.basename(inputPath);
    var nodeModulesDir = parts.slice(0, binIndex).join(node_path_1.default.sep);
    var packageRoot = node_path_1.default.join(nodeModulesDir, binName);
    appendDistCandidates(candidates, seen, packageRoot);
}
function resolveRepoRootForDev() {
    var argv1 = process.argv[1];
    if (!argv1) {
        throw new Error("Unable to resolve repo root");
    }
    var normalized = node_path_1.default.resolve(argv1);
    var parts = normalized.split(node_path_1.default.sep);
    var srcIndex = parts.lastIndexOf("src");
    if (srcIndex === -1) {
        throw new Error("Dev mode requires running from repo (src/index.ts)");
    }
    return parts.slice(0, srcIndex).join(node_path_1.default.sep);
}
function resolveBunPath() {
    return __awaiter(this, void 0, void 0, function () {
        var bunPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveBinaryPath("bun")];
                case 1:
                    bunPath = _a.sent();
                    return [2 /*return*/, bunPath];
            }
        });
    });
}
function resolveNodePath() {
    return __awaiter(this, void 0, void 0, function () {
        var nodePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveBinaryPath("node")];
                case 1:
                    nodePath = _a.sent();
                    return [2 /*return*/, nodePath];
            }
        });
    });
}
function resolveBinaryPath(binary) {
    return __awaiter(this, void 0, void 0, function () {
        var execSync, cmd, output, resolved, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("node:child_process"); })];
                case 1:
                    execSync = (_c.sent()).execSync;
                    cmd = process.platform === "win32" ? "where" : "which";
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    output = execSync("".concat(cmd, " ").concat(binary), { encoding: "utf8" }).trim();
                    resolved = (_b = output.split(/\r?\n/)[0]) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!resolved) {
                        throw new Error("empty");
                    }
                    return [4 /*yield*/, promises_1.default.access(resolved)];
                case 3:
                    _c.sent();
                    return [2 /*return*/, resolved];
                case 4:
                    _a = _c.sent();
                    if (binary === "bun") {
                        throw new Error("Bun not found in PATH. Install bun: https://bun.sh");
                    }
                    throw new Error("Node not found in PATH. Install Node 22+.");
                case 5: return [2 /*return*/];
            }
        });
    });
}
function resolveCliProgramArguments(params) {
    return __awaiter(this, void 0, void 0, function () {
        var execPath, runtime, nodePath, _a, _b, cliEntrypointPath, repoRoot_1, devCliPath_1, bunPath_1, _c, bunPath_2, _d, cliEntrypointPath, cliEntrypointPath, error_1, repoRoot, devCliPath, bunPath;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    execPath = process.execPath;
                    runtime = (_e = params.runtime) !== null && _e !== void 0 ? _e : "auto";
                    if (!(runtime === "node")) return [3 /*break*/, 7];
                    if (!((_f = params.nodePath) !== null && _f !== void 0)) return [3 /*break*/, 1];
                    _a = _f;
                    return [3 /*break*/, 5];
                case 1:
                    if (!isNodeRuntime(execPath)) return [3 /*break*/, 2];
                    _b = execPath;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, resolveNodePath()];
                case 3:
                    _b = _g.sent();
                    _g.label = 4;
                case 4:
                    _a = (_b);
                    _g.label = 5;
                case 5:
                    nodePath = _a;
                    return [4 /*yield*/, resolveCliEntrypointPathForService()];
                case 6:
                    cliEntrypointPath = _g.sent();
                    return [2 /*return*/, {
                            programArguments: __spreadArray([nodePath, cliEntrypointPath], params.args, true),
                        }];
                case 7:
                    if (!(runtime === "bun")) return [3 /*break*/, 17];
                    if (!params.dev) return [3 /*break*/, 12];
                    repoRoot_1 = resolveRepoRootForDev();
                    devCliPath_1 = node_path_1.default.join(repoRoot_1, "src", "index.ts");
                    return [4 /*yield*/, promises_1.default.access(devCliPath_1)];
                case 8:
                    _g.sent();
                    if (!isBunRuntime(execPath)) return [3 /*break*/, 9];
                    _c = execPath;
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, resolveBunPath()];
                case 10:
                    _c = _g.sent();
                    _g.label = 11;
                case 11:
                    bunPath_1 = _c;
                    return [2 /*return*/, {
                            programArguments: __spreadArray([bunPath_1, devCliPath_1], params.args, true),
                            workingDirectory: repoRoot_1,
                        }];
                case 12:
                    if (!isBunRuntime(execPath)) return [3 /*break*/, 13];
                    _d = execPath;
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, resolveBunPath()];
                case 14:
                    _d = _g.sent();
                    _g.label = 15;
                case 15:
                    bunPath_2 = _d;
                    return [4 /*yield*/, resolveCliEntrypointPathForService()];
                case 16:
                    cliEntrypointPath = _g.sent();
                    return [2 /*return*/, {
                            programArguments: __spreadArray([bunPath_2, cliEntrypointPath], params.args, true),
                        }];
                case 17:
                    if (!!params.dev) return [3 /*break*/, 21];
                    _g.label = 18;
                case 18:
                    _g.trys.push([18, 20, , 21]);
                    return [4 /*yield*/, resolveCliEntrypointPathForService()];
                case 19:
                    cliEntrypointPath = _g.sent();
                    return [2 /*return*/, {
                            programArguments: __spreadArray([execPath, cliEntrypointPath], params.args, true),
                        }];
                case 20:
                    error_1 = _g.sent();
                    // If running under bun or another runtime that can execute TS directly
                    if (!isNodeRuntime(execPath)) {
                        return [2 /*return*/, { programArguments: __spreadArray([execPath], params.args, true) }];
                    }
                    throw error_1;
                case 21:
                    repoRoot = resolveRepoRootForDev();
                    devCliPath = node_path_1.default.join(repoRoot, "src", "index.ts");
                    return [4 /*yield*/, promises_1.default.access(devCliPath)];
                case 22:
                    _g.sent();
                    // If already running under bun, use current execPath
                    if (isBunRuntime(execPath)) {
                        return [2 /*return*/, {
                                programArguments: __spreadArray([execPath, devCliPath], params.args, true),
                                workingDirectory: repoRoot,
                            }];
                    }
                    return [4 /*yield*/, resolveBunPath()];
                case 23:
                    bunPath = _g.sent();
                    return [2 /*return*/, {
                            programArguments: __spreadArray([bunPath, devCliPath], params.args, true),
                            workingDirectory: repoRoot,
                        }];
            }
        });
    });
}
function resolveGatewayProgramArguments(params) {
    return __awaiter(this, void 0, void 0, function () {
        var gatewayArgs;
        return __generator(this, function (_a) {
            gatewayArgs = ["gateway", "--port", String(params.port)];
            return [2 /*return*/, resolveCliProgramArguments({
                    args: gatewayArgs,
                    dev: params.dev,
                    runtime: params.runtime,
                    nodePath: params.nodePath,
                })];
        });
    });
}
function resolveNodeProgramArguments(params) {
    return __awaiter(this, void 0, void 0, function () {
        var args;
        return __generator(this, function (_a) {
            args = ["node", "run", "--host", params.host, "--port", String(params.port)];
            if (params.tls || params.tlsFingerprint) {
                args.push("--tls");
            }
            if (params.tlsFingerprint) {
                args.push("--tls-fingerprint", params.tlsFingerprint);
            }
            if (params.nodeId) {
                args.push("--node-id", params.nodeId);
            }
            if (params.displayName) {
                args.push("--display-name", params.displayName);
            }
            return [2 /*return*/, resolveCliProgramArguments({
                    args: args,
                    dev: params.dev,
                    runtime: params.runtime,
                    nodePath: params.nodePath,
                })];
        });
    });
}
