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
exports.isVersionManagedNodePath = isVersionManagedNodePath;
exports.isSystemNodePath = isSystemNodePath;
exports.resolveSystemNodePath = resolveSystemNodePath;
exports.resolveSystemNodeInfo = resolveSystemNodeInfo;
exports.renderSystemNodeWarning = renderSystemNodeWarning;
exports.resolvePreferredNodePath = resolvePreferredNodePath;
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var runtime_guard_js_1 = require("../infra/runtime-guard.js");
var VERSION_MANAGER_MARKERS = [
    "/.nvm/",
    "/.fnm/",
    "/.volta/",
    "/.asdf/",
    "/.n/",
    "/.nodenv/",
    "/.nodebrew/",
    "/nvs/",
];
function getPathModule(platform) {
    return platform === "win32" ? node_path_1.default.win32 : node_path_1.default.posix;
}
function normalizeForCompare(input, platform) {
    var pathModule = getPathModule(platform);
    var normalized = pathModule.normalize(input).replaceAll("\\", "/");
    if (platform === "win32") {
        return normalized.toLowerCase();
    }
    return normalized;
}
function buildSystemNodeCandidates(env, platform) {
    var _a, _b;
    if (platform === "darwin") {
        return ["/opt/homebrew/bin/node", "/usr/local/bin/node", "/usr/bin/node"];
    }
    if (platform === "linux") {
        return ["/usr/local/bin/node", "/usr/bin/node"];
    }
    if (platform === "win32") {
        var pathModule = getPathModule(platform);
        var programFiles = (_a = env.ProgramFiles) !== null && _a !== void 0 ? _a : "C:\\Program Files";
        var programFilesX86 = (_b = env["ProgramFiles(x86)"]) !== null && _b !== void 0 ? _b : "C:\\Program Files (x86)";
        return [
            pathModule.join(programFiles, "nodejs", "node.exe"),
            pathModule.join(programFilesX86, "nodejs", "node.exe"),
        ];
    }
    return [];
}
var execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
function resolveNodeVersion(nodePath, execFileImpl) {
    return __awaiter(this, void 0, void 0, function () {
        var stdout, value, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, execFileImpl(nodePath, ["-p", "process.versions.node"], {
                            encoding: "utf8",
                        })];
                case 1:
                    stdout = (_b.sent()).stdout;
                    value = stdout.trim();
                    return [2 /*return*/, value ? value : null];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function isVersionManagedNodePath(nodePath, platform) {
    if (platform === void 0) { platform = process.platform; }
    var normalized = normalizeForCompare(nodePath, platform);
    return VERSION_MANAGER_MARKERS.some(function (marker) { return normalized.includes(marker); });
}
function isSystemNodePath(nodePath, env, platform) {
    if (env === void 0) { env = process.env; }
    if (platform === void 0) { platform = process.platform; }
    var normalized = normalizeForCompare(nodePath, platform);
    return buildSystemNodeCandidates(env, platform).some(function (candidate) {
        var normalizedCandidate = normalizeForCompare(candidate, platform);
        return normalized === normalizedCandidate;
    });
}
function resolveSystemNodePath() {
    return __awaiter(this, arguments, void 0, function (env, platform) {
        var candidates, _i, candidates_1, candidate, _a;
        if (env === void 0) { env = process.env; }
        if (platform === void 0) { platform = process.platform; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    candidates = buildSystemNodeCandidates(env, platform);
                    _i = 0, candidates_1 = candidates;
                    _b.label = 1;
                case 1:
                    if (!(_i < candidates_1.length)) return [3 /*break*/, 6];
                    candidate = candidates_1[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.access(candidate)];
                case 3:
                    _b.sent();
                    return [2 /*return*/, candidate];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, null];
            }
        });
    });
}
function resolveSystemNodeInfo(params) {
    return __awaiter(this, void 0, void 0, function () {
        var env, platform, systemNode, version;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
                    platform = (_b = params.platform) !== null && _b !== void 0 ? _b : process.platform;
                    return [4 /*yield*/, resolveSystemNodePath(env, platform)];
                case 1:
                    systemNode = _d.sent();
                    if (!systemNode) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, resolveNodeVersion(systemNode, (_c = params.execFile) !== null && _c !== void 0 ? _c : execFileAsync)];
                case 2:
                    version = _d.sent();
                    return [2 /*return*/, {
                            path: systemNode,
                            version: version,
                            supported: (0, runtime_guard_js_1.isSupportedNodeVersion)(version),
                        }];
            }
        });
    });
}
function renderSystemNodeWarning(systemNode, selectedNodePath) {
    var _a;
    if (!systemNode || systemNode.supported) {
        return null;
    }
    var versionLabel = (_a = systemNode.version) !== null && _a !== void 0 ? _a : "unknown";
    var selectedLabel = selectedNodePath ? " Using ".concat(selectedNodePath, " for the daemon.") : "";
    return "System Node ".concat(versionLabel, " at ").concat(systemNode.path, " is below the required Node 22+.").concat(selectedLabel, " Install Node 22+ from nodejs.org or Homebrew.");
}
function resolvePreferredNodePath(params) {
    return __awaiter(this, void 0, void 0, function () {
        var systemNode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (params.runtime !== "node") {
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, resolveSystemNodeInfo(params)];
                case 1:
                    systemNode = _a.sent();
                    if (!(systemNode === null || systemNode === void 0 ? void 0 : systemNode.supported)) {
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, systemNode.path];
            }
        });
    });
}
