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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var schtasks_js_1 = require("./schtasks.js");
(0, vitest_1.describe)("schtasks runtime parsing", function () {
    (0, vitest_1.it)("parses status and last run info", function () {
        var output = [
            "TaskName: \\OpenClaw Gateway",
            "Status: Ready",
            "Last Run Time: 1/8/2026 1:23:45 AM",
            "Last Run Result: 0x0",
        ].join("\r\n");
        (0, vitest_1.expect)((0, schtasks_js_1.parseSchtasksQuery)(output)).toEqual({
            status: "Ready",
            lastRunTime: "1/8/2026 1:23:45 AM",
            lastRunResult: "0x0",
        });
    });
    (0, vitest_1.it)("parses running status", function () {
        var output = [
            "TaskName: \\OpenClaw Gateway",
            "Status: Running",
            "Last Run Time: 1/8/2026 1:23:45 AM",
            "Last Run Result: 0x0",
        ].join("\r\n");
        (0, vitest_1.expect)((0, schtasks_js_1.parseSchtasksQuery)(output)).toEqual({
            status: "Running",
            lastRunTime: "1/8/2026 1:23:45 AM",
            lastRunResult: "0x0",
        });
    });
});
(0, vitest_1.describe)("resolveTaskScriptPath", function () {
    (0, vitest_1.it)("uses default path when OPENCLAW_PROFILE is default", function () {
        var env = { USERPROFILE: "C:\\Users\\test", OPENCLAW_PROFILE: "default" };
        (0, vitest_1.expect)((0, schtasks_js_1.resolveTaskScriptPath)(env)).toBe(node_path_1.default.join("C:\\Users\\test", ".openclaw", "gateway.cmd"));
    });
    (0, vitest_1.it)("uses default path when OPENCLAW_PROFILE is unset", function () {
        var env = { USERPROFILE: "C:\\Users\\test" };
        (0, vitest_1.expect)((0, schtasks_js_1.resolveTaskScriptPath)(env)).toBe(node_path_1.default.join("C:\\Users\\test", ".openclaw", "gateway.cmd"));
    });
    (0, vitest_1.it)("uses profile-specific path when OPENCLAW_PROFILE is set to a custom value", function () {
        var env = { USERPROFILE: "C:\\Users\\test", OPENCLAW_PROFILE: "jbphoenix" };
        (0, vitest_1.expect)((0, schtasks_js_1.resolveTaskScriptPath)(env)).toBe(node_path_1.default.join("C:\\Users\\test", ".openclaw-jbphoenix", "gateway.cmd"));
    });
    (0, vitest_1.it)("prefers OPENCLAW_STATE_DIR over profile-derived defaults", function () {
        var env = {
            USERPROFILE: "C:\\Users\\test",
            OPENCLAW_PROFILE: "rescue",
            OPENCLAW_STATE_DIR: "C:\\State\\openclaw",
        };
        (0, vitest_1.expect)((0, schtasks_js_1.resolveTaskScriptPath)(env)).toBe(node_path_1.default.join("C:\\State\\openclaw", "gateway.cmd"));
    });
    (0, vitest_1.it)("handles case-insensitive 'Default' profile", function () {
        var env = { USERPROFILE: "C:\\Users\\test", OPENCLAW_PROFILE: "Default" };
        (0, vitest_1.expect)((0, schtasks_js_1.resolveTaskScriptPath)(env)).toBe(node_path_1.default.join("C:\\Users\\test", ".openclaw", "gateway.cmd"));
    });
    (0, vitest_1.it)("handles case-insensitive 'DEFAULT' profile", function () {
        var env = { USERPROFILE: "C:\\Users\\test", OPENCLAW_PROFILE: "DEFAULT" };
        (0, vitest_1.expect)((0, schtasks_js_1.resolveTaskScriptPath)(env)).toBe(node_path_1.default.join("C:\\Users\\test", ".openclaw", "gateway.cmd"));
    });
    (0, vitest_1.it)("trims whitespace from OPENCLAW_PROFILE", function () {
        var env = { USERPROFILE: "C:\\Users\\test", OPENCLAW_PROFILE: "  myprofile  " };
        (0, vitest_1.expect)((0, schtasks_js_1.resolveTaskScriptPath)(env)).toBe(node_path_1.default.join("C:\\Users\\test", ".openclaw-myprofile", "gateway.cmd"));
    });
    (0, vitest_1.it)("falls back to HOME when USERPROFILE is not set", function () {
        var env = { HOME: "/home/test", OPENCLAW_PROFILE: "default" };
        (0, vitest_1.expect)((0, schtasks_js_1.resolveTaskScriptPath)(env)).toBe(node_path_1.default.join("/home/test", ".openclaw", "gateway.cmd"));
    });
});
(0, vitest_1.describe)("readScheduledTaskCommand", function () {
    (0, vitest_1.it)("parses basic command script", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, scriptPath, env, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-schtasks-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 8]);
                    scriptPath = node_path_1.default.join(tmpDir, ".openclaw", "gateway.cmd");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(scriptPath), { recursive: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(scriptPath, ["@echo off", "node gateway.js --port 18789"].join("\r\n"), "utf8")];
                case 4:
                    _a.sent();
                    env = { USERPROFILE: tmpDir, OPENCLAW_PROFILE: "default" };
                    return [4 /*yield*/, (0, schtasks_js_1.readScheduledTaskCommand)(env)];
                case 5:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual({
                        programArguments: ["node", "gateway.js", "--port", "18789"],
                    });
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("parses script with working directory", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, scriptPath, env, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-schtasks-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 8]);
                    scriptPath = node_path_1.default.join(tmpDir, ".openclaw", "gateway.cmd");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(scriptPath), { recursive: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(scriptPath, ["@echo off", "cd /d C:\\Projects\\openclaw", "node gateway.js"].join("\r\n"), "utf8")];
                case 4:
                    _a.sent();
                    env = { USERPROFILE: tmpDir, OPENCLAW_PROFILE: "default" };
                    return [4 /*yield*/, (0, schtasks_js_1.readScheduledTaskCommand)(env)];
                case 5:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual({
                        programArguments: ["node", "gateway.js"],
                        workingDirectory: "C:\\Projects\\openclaw",
                    });
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("parses script with environment variables", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, scriptPath, env, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-schtasks-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 8]);
                    scriptPath = node_path_1.default.join(tmpDir, ".openclaw", "gateway.cmd");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(scriptPath), { recursive: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(scriptPath, ["@echo off", "set NODE_ENV=production", "set PORT=18789", "node gateway.js"].join("\r\n"), "utf8")];
                case 4:
                    _a.sent();
                    env = { USERPROFILE: tmpDir, OPENCLAW_PROFILE: "default" };
                    return [4 /*yield*/, (0, schtasks_js_1.readScheduledTaskCommand)(env)];
                case 5:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual({
                        programArguments: ["node", "gateway.js"],
                        environment: {
                            NODE_ENV: "production",
                            PORT: "18789",
                        },
                    });
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("parses script with quoted arguments containing spaces", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, scriptPath, env, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-schtasks-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 8]);
                    scriptPath = node_path_1.default.join(tmpDir, ".openclaw", "gateway.cmd");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(scriptPath), { recursive: true })];
                case 3:
                    _a.sent();
                    // Use forward slashes which work in Windows cmd and avoid escape parsing issues
                    return [4 /*yield*/, promises_1.default.writeFile(scriptPath, ["@echo off", '"C:/Program Files/Node/node.exe" gateway.js'].join("\r\n"), "utf8")];
                case 4:
                    // Use forward slashes which work in Windows cmd and avoid escape parsing issues
                    _a.sent();
                    env = { USERPROFILE: tmpDir, OPENCLAW_PROFILE: "default" };
                    return [4 /*yield*/, (0, schtasks_js_1.readScheduledTaskCommand)(env)];
                case 5:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual({
                        programArguments: ["C:/Program Files/Node/node.exe", "gateway.js"],
                    });
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns null when script does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, env, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-schtasks-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    env = { USERPROFILE: tmpDir, OPENCLAW_PROFILE: "default" };
                    return [4 /*yield*/, (0, schtasks_js_1.readScheduledTaskCommand)(env)];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBeNull();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns null when script has no command", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, scriptPath, env, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-schtasks-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 8]);
                    scriptPath = node_path_1.default.join(tmpDir, ".openclaw", "gateway.cmd");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(scriptPath), { recursive: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(scriptPath, ["@echo off", "rem This is just a comment"].join("\r\n"), "utf8")];
                case 4:
                    _a.sent();
                    env = { USERPROFILE: tmpDir, OPENCLAW_PROFILE: "default" };
                    return [4 /*yield*/, (0, schtasks_js_1.readScheduledTaskCommand)(env)];
                case 5:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBeNull();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("parses full script with all components", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, scriptPath, env, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-schtasks-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 8]);
                    scriptPath = node_path_1.default.join(tmpDir, ".openclaw", "gateway.cmd");
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(scriptPath), { recursive: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(scriptPath, [
                            "@echo off",
                            "rem OpenClaw Gateway",
                            "cd /d C:\\Projects\\openclaw",
                            "set NODE_ENV=production",
                            "set OPENCLAW_PORT=18789",
                            "node gateway.js --verbose",
                        ].join("\r\n"), "utf8")];
                case 4:
                    _a.sent();
                    env = { USERPROFILE: tmpDir, OPENCLAW_PROFILE: "default" };
                    return [4 /*yield*/, (0, schtasks_js_1.readScheduledTaskCommand)(env)];
                case 5:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual({
                        programArguments: ["node", "gateway.js", "--verbose"],
                        workingDirectory: "C:\\Projects\\openclaw",
                        environment: {
                            NODE_ENV: "production",
                            OPENCLAW_PORT: "18789",
                        },
                    });
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
