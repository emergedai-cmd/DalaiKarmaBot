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
exports.collectWorkspaceDirs = collectWorkspaceDirs;
exports.isPathWithin = isPathWithin;
exports.removePath = removePath;
exports.listAgentSessionDirs = listAgentSessionDirs;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var workspace_js_1 = require("../agents/workspace.js");
var utils_js_1 = require("../utils.js");
function collectWorkspaceDirs(cfg) {
    var _a, _b, _c;
    var dirs = new Set();
    var defaults = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults;
    if (typeof (defaults === null || defaults === void 0 ? void 0 : defaults.workspace) === "string" && defaults.workspace.trim()) {
        dirs.add((0, utils_js_1.resolveUserPath)(defaults.workspace));
    }
    var list = Array.isArray((_b = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _b === void 0 ? void 0 : _b.list) ? (_c = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _c === void 0 ? void 0 : _c.list : [];
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var agent = list_1[_i];
        var workspace = agent.workspace;
        if (typeof workspace === "string" && workspace.trim()) {
            dirs.add((0, utils_js_1.resolveUserPath)(workspace));
        }
    }
    if (dirs.size === 0) {
        dirs.add((0, workspace_js_1.resolveDefaultAgentWorkspaceDir)());
    }
    return __spreadArray([], dirs, true);
}
function isPathWithin(child, parent) {
    var relative = node_path_1.default.relative(parent, child);
    return relative === "" || (!relative.startsWith("..") && !node_path_1.default.isAbsolute(relative));
}
function isUnsafeRemovalTarget(target) {
    if (!target.trim()) {
        return true;
    }
    var resolved = node_path_1.default.resolve(target);
    var root = node_path_1.default.parse(resolved).root;
    if (resolved === root) {
        return true;
    }
    var home = (0, utils_js_1.resolveHomeDir)();
    if (home && resolved === node_path_1.default.resolve(home)) {
        return true;
    }
    return false;
}
function removePath(target, runtime, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var resolved, label, displayLabel, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(target === null || target === void 0 ? void 0 : target.trim())) {
                        return [2 /*return*/, { ok: false, skipped: true }];
                    }
                    resolved = node_path_1.default.resolve(target);
                    label = (_a = opts === null || opts === void 0 ? void 0 : opts.label) !== null && _a !== void 0 ? _a : resolved;
                    displayLabel = (0, utils_js_1.shortenHomeInString)(label);
                    if (isUnsafeRemovalTarget(resolved)) {
                        runtime.error("Refusing to remove unsafe path: ".concat(displayLabel));
                        return [2 /*return*/, { ok: false }];
                    }
                    if (opts === null || opts === void 0 ? void 0 : opts.dryRun) {
                        runtime.log("[dry-run] remove ".concat(displayLabel));
                        return [2 /*return*/, { ok: true, skipped: true }];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.rm(resolved, { recursive: true, force: true })];
                case 2:
                    _b.sent();
                    runtime.log("Removed ".concat(displayLabel));
                    return [2 /*return*/, { ok: true }];
                case 3:
                    err_1 = _b.sent();
                    runtime.error("Failed to remove ".concat(displayLabel, ": ").concat(String(err_1)));
                    return [2 /*return*/, { ok: false }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function listAgentSessionDirs(stateDir) {
    return __awaiter(this, void 0, void 0, function () {
        var root, entries, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    root = node_path_1.default.join(stateDir, "agents");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readdir(root, { withFileTypes: true })];
                case 2:
                    entries = _b.sent();
                    return [2 /*return*/, entries
                            .filter(function (entry) { return entry.isDirectory(); })
                            .map(function (entry) { return node_path_1.default.join(root, entry.name, "sessions"); })];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
