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
exports.MEMORY_SYSTEM_PROMPT = void 0;
exports.shouldSuggestMemorySystem = shouldSuggestMemorySystem;
exports.detectLegacyWorkspaceDirs = detectLegacyWorkspaceDirs;
exports.formatLegacyWorkspaceWarning = formatLegacyWorkspaceWarning;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var workspace_js_1 = require("../agents/workspace.js");
var utils_js_1 = require("../utils.js");
exports.MEMORY_SYSTEM_PROMPT = [
    "Memory system not found in workspace.",
    "Paste this into your agent:",
    "",
    "Install the memory system by applying:",
    "https://github.com/openclaw/openclaw/commit/9ffea23f31ca1df5183b25668f8f814bee0fb34e",
    "https://github.com/openclaw/openclaw/commit/7d1fee70e76f2f634f1b41fca927ee663914183a",
].join("\n");
function shouldSuggestMemorySystem(workspaceDir) {
    return __awaiter(this, void 0, void 0, function () {
        var memoryPaths, _i, memoryPaths_1, memoryPath, _a, agentsPath, content, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    memoryPaths = [node_path_1.default.join(workspaceDir, "MEMORY.md"), node_path_1.default.join(workspaceDir, "memory.md")];
                    _i = 0, memoryPaths_1 = memoryPaths;
                    _c.label = 1;
                case 1:
                    if (!(_i < memoryPaths_1.length)) return [3 /*break*/, 6];
                    memoryPath = memoryPaths_1[_i];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, node_fs_1.default.promises.access(memoryPath)];
                case 3:
                    _c.sent();
                    return [2 /*return*/, false];
                case 4:
                    _a = _c.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    agentsPath = node_path_1.default.join(workspaceDir, workspace_js_1.DEFAULT_AGENTS_FILENAME);
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, node_fs_1.default.promises.readFile(agentsPath, "utf-8")];
                case 8:
                    content = _c.sent();
                    if (/memory\.md/i.test(content)) {
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 10];
                case 9:
                    _b = _c.sent();
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/, true];
            }
        });
    });
}
function detectLegacyWorkspaceDirs(params) {
    var activeWorkspace = node_path_1.default.resolve(params.workspaceDir);
    var legacyDirs = [];
    return { activeWorkspace: activeWorkspace, legacyDirs: legacyDirs };
}
function formatLegacyWorkspaceWarning(detection) {
    return __spreadArray(__spreadArray([
        "Extra workspace directories detected (may contain old agent files):"
    ], detection.legacyDirs.map(function (dir) { return "- ".concat((0, utils_js_1.shortenHomePath)(dir)); }), true), [
        "Active workspace: ".concat((0, utils_js_1.shortenHomePath)(detection.activeWorkspace)),
        "If unused, archive or move to Trash.",
    ], false).join("\n");
}
