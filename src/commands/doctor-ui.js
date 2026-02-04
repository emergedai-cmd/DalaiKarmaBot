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
exports.maybeRepairUiProtocolFreshness = maybeRepairUiProtocolFreshness;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var openclaw_root_js_1 = require("../infra/openclaw-root.js");
var exec_js_1 = require("../process/exec.js");
var note_js_1 = require("../terminal/note.js");
function maybeRepairUiProtocolFreshness(_runtime, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var root, schemaPath, uiIndexPath, _a, schemaStats, uiStats, uiSourcesPath, uiSourcesExist, shouldRepair, uiScriptPath, buildResult, details, uiMtimeIso, gitLog, shouldRepair, uiSourcesPath, uiSourcesExist, uiScriptPath, buildResult, details, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({
                        moduleUrl: import.meta.url,
                        argv1: process.argv[1],
                        cwd: process.cwd(),
                    })];
                case 1:
                    root = _e.sent();
                    if (!root) {
                        return [2 /*return*/];
                    }
                    schemaPath = node_path_1.default.join(root, "src/gateway/protocol/schema.ts");
                    uiIndexPath = node_path_1.default.join(root, "dist/control-ui/index.html");
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 14, , 15]);
                    return [4 /*yield*/, Promise.all([
                            promises_1.default.stat(schemaPath).catch(function () { return null; }),
                            promises_1.default.stat(uiIndexPath).catch(function () { return null; }),
                        ])];
                case 3:
                    _a = _e.sent(), schemaStats = _a[0], uiStats = _a[1];
                    if (!(schemaStats && !uiStats)) return [3 /*break*/, 8];
                    (0, note_js_1.note)(["- Control UI assets are missing.", "- Run: pnpm ui:build"].join("\n"), "UI");
                    uiSourcesPath = node_path_1.default.join(root, "ui/package.json");
                    return [4 /*yield*/, promises_1.default.stat(uiSourcesPath).catch(function () { return null; })];
                case 4:
                    uiSourcesExist = _e.sent();
                    if (!uiSourcesExist) {
                        (0, note_js_1.note)("Skipping UI build: ui/ sources not present.", "UI");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, prompter.confirmRepair({
                            message: "Build Control UI assets now?",
                            initialValue: true,
                        })];
                case 5:
                    shouldRepair = _e.sent();
                    if (!shouldRepair) return [3 /*break*/, 7];
                    (0, note_js_1.note)("Building Control UI assets... (this may take a moment)", "UI");
                    uiScriptPath = node_path_1.default.join(root, "scripts/ui.js");
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)([process.execPath, uiScriptPath, "build"], {
                            cwd: root,
                            timeoutMs: 120000,
                            env: __assign(__assign({}, process.env), { FORCE_COLOR: "1" }),
                        })];
                case 6:
                    buildResult = _e.sent();
                    if (buildResult.code === 0) {
                        (0, note_js_1.note)("UI build complete.", "UI");
                    }
                    else {
                        details = [
                            "UI build failed (exit ".concat((_c = buildResult.code) !== null && _c !== void 0 ? _c : "unknown", ")."),
                            buildResult.stderr.trim() ? buildResult.stderr.trim() : null,
                        ]
                            .filter(Boolean)
                            .join("\n");
                        (0, note_js_1.note)(details, "UI");
                    }
                    _e.label = 7;
                case 7: return [2 /*return*/];
                case 8:
                    if (!schemaStats || !uiStats) {
                        return [2 /*return*/];
                    }
                    if (!(schemaStats.mtime > uiStats.mtime)) return [3 /*break*/, 13];
                    uiMtimeIso = uiStats.mtime.toISOString();
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)([
                            "git",
                            "-C",
                            root,
                            "log",
                            "--since=".concat(uiMtimeIso),
                            "--format=%h %s",
                            "src/gateway/protocol/schema.ts",
                        ], { timeoutMs: 5000 }).catch(function () { return null; })];
                case 9:
                    gitLog = _e.sent();
                    if (!(gitLog && gitLog.code === 0 && gitLog.stdout.trim())) return [3 /*break*/, 13];
                    (0, note_js_1.note)("UI assets are older than the protocol schema.\nFunctional changes since last build:\n".concat(gitLog.stdout
                        .trim()
                        .split("\n")
                        .map(function (l) { return "- ".concat(l); })
                        .join("\n")), "UI Freshness");
                    return [4 /*yield*/, prompter.confirmAggressive({
                            message: "Rebuild UI now? (Detected protocol mismatch requiring update)",
                            initialValue: true,
                        })];
                case 10:
                    shouldRepair = _e.sent();
                    if (!shouldRepair) return [3 /*break*/, 13];
                    uiSourcesPath = node_path_1.default.join(root, "ui/package.json");
                    return [4 /*yield*/, promises_1.default.stat(uiSourcesPath).catch(function () { return null; })];
                case 11:
                    uiSourcesExist = _e.sent();
                    if (!uiSourcesExist) {
                        (0, note_js_1.note)("Skipping UI rebuild: ui/ sources not present.", "UI");
                        return [2 /*return*/];
                    }
                    (0, note_js_1.note)("Rebuilding stale UI assets... (this may take a moment)", "UI");
                    uiScriptPath = node_path_1.default.join(root, "scripts/ui.js");
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)([process.execPath, uiScriptPath, "build"], {
                            cwd: root,
                            timeoutMs: 120000,
                            env: __assign(__assign({}, process.env), { FORCE_COLOR: "1" }),
                        })];
                case 12:
                    buildResult = _e.sent();
                    if (buildResult.code === 0) {
                        (0, note_js_1.note)("UI rebuild complete.", "UI");
                    }
                    else {
                        details = [
                            "UI rebuild failed (exit ".concat((_d = buildResult.code) !== null && _d !== void 0 ? _d : "unknown", ")."),
                            buildResult.stderr.trim() ? buildResult.stderr.trim() : null,
                        ]
                            .filter(Boolean)
                            .join("\n");
                        (0, note_js_1.note)(details, "UI");
                    }
                    _e.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    _b = _e.sent();
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
