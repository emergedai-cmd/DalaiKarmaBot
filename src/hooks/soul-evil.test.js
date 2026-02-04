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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var workspace_js_1 = require("../agents/workspace.js");
var workspace_js_2 = require("../test-helpers/workspace.js");
var soul_evil_js_1 = require("./soul-evil.js");
var makeFiles = function (overrides) { return [
    __assign({ name: workspace_js_1.DEFAULT_SOUL_FILENAME, path: "/tmp/SOUL.md", content: "friendly", missing: false }, overrides),
]; };
(0, vitest_1.describe)("decideSoulEvil", function () {
    (0, vitest_1.it)("returns false when no config", function () {
        var result = (0, soul_evil_js_1.decideSoulEvil)({});
        (0, vitest_1.expect)(result.useEvil).toBe(false);
    });
    (0, vitest_1.it)("activates on random chance", function () {
        var result = (0, soul_evil_js_1.decideSoulEvil)({
            config: { chance: 0.5 },
            random: function () { return 0.2; },
        });
        (0, vitest_1.expect)(result.useEvil).toBe(true);
        (0, vitest_1.expect)(result.reason).toBe("chance");
    });
    (0, vitest_1.it)("activates during purge window", function () {
        var result = (0, soul_evil_js_1.decideSoulEvil)({
            config: {
                purge: { at: "00:00", duration: "10m" },
            },
            userTimezone: "UTC",
            now: new Date("2026-01-01T00:05:00Z"),
        });
        (0, vitest_1.expect)(result.useEvil).toBe(true);
        (0, vitest_1.expect)(result.reason).toBe("purge");
    });
    (0, vitest_1.it)("prefers purge window over random chance", function () {
        var result = (0, soul_evil_js_1.decideSoulEvil)({
            config: {
                chance: 0,
                purge: { at: "00:00", duration: "10m" },
            },
            userTimezone: "UTC",
            now: new Date("2026-01-01T00:05:00Z"),
            random: function () { return 0; },
        });
        (0, vitest_1.expect)(result.useEvil).toBe(true);
        (0, vitest_1.expect)(result.reason).toBe("purge");
    });
    (0, vitest_1.it)("skips purge window when outside duration", function () {
        var result = (0, soul_evil_js_1.decideSoulEvil)({
            config: {
                purge: { at: "00:00", duration: "10m" },
            },
            userTimezone: "UTC",
            now: new Date("2026-01-01T00:30:00Z"),
        });
        (0, vitest_1.expect)(result.useEvil).toBe(false);
    });
    (0, vitest_1.it)("honors sub-minute purge durations", function () {
        var config = {
            purge: { at: "00:00", duration: "30s" },
        };
        var active = (0, soul_evil_js_1.decideSoulEvil)({
            config: config,
            userTimezone: "UTC",
            now: new Date("2026-01-01T00:00:20Z"),
        });
        var inactive = (0, soul_evil_js_1.decideSoulEvil)({
            config: config,
            userTimezone: "UTC",
            now: new Date("2026-01-01T00:00:40Z"),
        });
        (0, vitest_1.expect)(active.useEvil).toBe(true);
        (0, vitest_1.expect)(active.reason).toBe("purge");
        (0, vitest_1.expect)(inactive.useEvil).toBe(false);
    });
    (0, vitest_1.it)("handles purge windows that wrap past midnight", function () {
        var result = (0, soul_evil_js_1.decideSoulEvil)({
            config: {
                purge: { at: "23:55", duration: "10m" },
            },
            userTimezone: "UTC",
            now: new Date("2026-01-02T00:02:00Z"),
        });
        (0, vitest_1.expect)(result.useEvil).toBe(true);
        (0, vitest_1.expect)(result.reason).toBe("purge");
    });
    (0, vitest_1.it)("clamps chance above 1", function () {
        var result = (0, soul_evil_js_1.decideSoulEvil)({
            config: { chance: 2 },
            random: function () { return 0.5; },
        });
        (0, vitest_1.expect)(result.useEvil).toBe(true);
        (0, vitest_1.expect)(result.reason).toBe("chance");
    });
});
(0, vitest_1.describe)("applySoulEvilOverride", function () {
    (0, vitest_1.it)("replaces SOUL content when evil is active and file exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, files, updated, soul;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_2.makeTempWorkspace)("openclaw-soul-")];
                case 1:
                    tempDir = _a.sent();
                    return [4 /*yield*/, (0, workspace_js_2.writeWorkspaceFile)({
                            dir: tempDir,
                            name: soul_evil_js_1.DEFAULT_SOUL_EVIL_FILENAME,
                            content: "chaotic",
                        })];
                case 2:
                    _a.sent();
                    files = makeFiles({
                        path: node_path_1.default.join(tempDir, workspace_js_1.DEFAULT_SOUL_FILENAME),
                    });
                    return [4 /*yield*/, (0, soul_evil_js_1.applySoulEvilOverride)({
                            files: files,
                            workspaceDir: tempDir,
                            config: { chance: 1 },
                            userTimezone: "UTC",
                            random: function () { return 0; },
                        })];
                case 3:
                    updated = _a.sent();
                    soul = updated.find(function (file) { return file.name === workspace_js_1.DEFAULT_SOUL_FILENAME; });
                    (0, vitest_1.expect)(soul === null || soul === void 0 ? void 0 : soul.content).toBe("chaotic");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("leaves SOUL content when evil file is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, files, updated, soul;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_2.makeTempWorkspace)("openclaw-soul-")];
                case 1:
                    tempDir = _a.sent();
                    files = makeFiles({
                        path: node_path_1.default.join(tempDir, workspace_js_1.DEFAULT_SOUL_FILENAME),
                    });
                    return [4 /*yield*/, (0, soul_evil_js_1.applySoulEvilOverride)({
                            files: files,
                            workspaceDir: tempDir,
                            config: { chance: 1 },
                            userTimezone: "UTC",
                            random: function () { return 0; },
                        })];
                case 2:
                    updated = _a.sent();
                    soul = updated.find(function (file) { return file.name === workspace_js_1.DEFAULT_SOUL_FILENAME; });
                    (0, vitest_1.expect)(soul === null || soul === void 0 ? void 0 : soul.content).toBe("friendly");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses custom evil filename when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, files, updated, soul;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_2.makeTempWorkspace)("openclaw-soul-")];
                case 1:
                    tempDir = _a.sent();
                    return [4 /*yield*/, (0, workspace_js_2.writeWorkspaceFile)({
                            dir: tempDir,
                            name: "SOUL_EVIL_CUSTOM.md",
                            content: "chaotic",
                        })];
                case 2:
                    _a.sent();
                    files = makeFiles({
                        path: node_path_1.default.join(tempDir, workspace_js_1.DEFAULT_SOUL_FILENAME),
                    });
                    return [4 /*yield*/, (0, soul_evil_js_1.applySoulEvilOverride)({
                            files: files,
                            workspaceDir: tempDir,
                            config: { chance: 1, file: "SOUL_EVIL_CUSTOM.md" },
                            userTimezone: "UTC",
                            random: function () { return 0; },
                        })];
                case 3:
                    updated = _a.sent();
                    soul = updated.find(function (file) { return file.name === workspace_js_1.DEFAULT_SOUL_FILENAME; });
                    (0, vitest_1.expect)(soul === null || soul === void 0 ? void 0 : soul.content).toBe("chaotic");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns and skips when evil file is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, warnings, files, updated, soul;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_2.makeTempWorkspace)("openclaw-soul-")];
                case 1:
                    tempDir = _a.sent();
                    return [4 /*yield*/, (0, workspace_js_2.writeWorkspaceFile)({
                            dir: tempDir,
                            name: soul_evil_js_1.DEFAULT_SOUL_EVIL_FILENAME,
                            content: " ",
                        })];
                case 2:
                    _a.sent();
                    warnings = [];
                    files = makeFiles({
                        path: node_path_1.default.join(tempDir, workspace_js_1.DEFAULT_SOUL_FILENAME),
                    });
                    return [4 /*yield*/, (0, soul_evil_js_1.applySoulEvilOverride)({
                            files: files,
                            workspaceDir: tempDir,
                            config: { chance: 1 },
                            userTimezone: "UTC",
                            random: function () { return 0; },
                            log: { warn: function (message) { return warnings.push(message); } },
                        })];
                case 3:
                    updated = _a.sent();
                    soul = updated.find(function (file) { return file.name === workspace_js_1.DEFAULT_SOUL_FILENAME; });
                    (0, vitest_1.expect)(soul === null || soul === void 0 ? void 0 : soul.content).toBe("friendly");
                    (0, vitest_1.expect)(warnings.some(function (message) { return message.includes("file empty"); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("leaves files untouched when SOUL.md is not in bootstrap files", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, files, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_2.makeTempWorkspace)("openclaw-soul-")];
                case 1:
                    tempDir = _a.sent();
                    return [4 /*yield*/, (0, workspace_js_2.writeWorkspaceFile)({
                            dir: tempDir,
                            name: soul_evil_js_1.DEFAULT_SOUL_EVIL_FILENAME,
                            content: "chaotic",
                        })];
                case 2:
                    _a.sent();
                    files = [
                        {
                            name: "AGENTS.md",
                            path: node_path_1.default.join(tempDir, "AGENTS.md"),
                            content: "agents",
                            missing: false,
                        },
                    ];
                    return [4 /*yield*/, (0, soul_evil_js_1.applySoulEvilOverride)({
                            files: files,
                            workspaceDir: tempDir,
                            config: { chance: 1 },
                            userTimezone: "UTC",
                            random: function () { return 0; },
                        })];
                case 3:
                    updated = _a.sent();
                    (0, vitest_1.expect)(updated).toEqual(files);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveSoulEvilConfigFromHook", function () {
    (0, vitest_1.it)("returns null and warns when config is invalid", function () {
        var warnings = [];
        var result = (0, soul_evil_js_1.resolveSoulEvilConfigFromHook)({ file: 42, chance: "nope", purge: "later" }, { warn: function (message) { return warnings.push(message); } });
        (0, vitest_1.expect)(result).toBeNull();
        (0, vitest_1.expect)(warnings).toEqual([
            "soul-evil config: file must be a string",
            "soul-evil config: chance must be a number",
            "soul-evil config: purge must be an object",
        ]);
    });
});
