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
var node_stream_1 = require("node:stream");
var vitest_1 = require("vitest");
var launchd_js_1 = require("./launchd.js");
function withLaunchctlStub(options, run) {
    return __awaiter(this, void 0, void 0, function () {
        var originalPath, originalLogPath, originalListOutput, tmpDir, binDir, homeDir, logPath, stubJsPath, shPath;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    originalPath = process.env.PATH;
                    originalLogPath = process.env.OPENCLAW_TEST_LAUNCHCTL_LOG;
                    originalListOutput = process.env.OPENCLAW_TEST_LAUNCHCTL_LIST_OUTPUT;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-launchctl-test-"))];
                case 1:
                    tmpDir = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 12, 14]);
                    binDir = node_path_1.default.join(tmpDir, "bin");
                    homeDir = node_path_1.default.join(tmpDir, "home");
                    logPath = node_path_1.default.join(tmpDir, "launchctl.log");
                    return [4 /*yield*/, promises_1.default.mkdir(binDir, { recursive: true })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(homeDir, { recursive: true })];
                case 4:
                    _b.sent();
                    stubJsPath = node_path_1.default.join(binDir, "launchctl.js");
                    return [4 /*yield*/, promises_1.default.writeFile(stubJsPath, [
                            'import fs from "node:fs";',
                            "const args = process.argv.slice(2);",
                            "const logPath = process.env.OPENCLAW_TEST_LAUNCHCTL_LOG;",
                            "if (logPath) {",
                            '  fs.appendFileSync(logPath, JSON.stringify(args) + "\\n", "utf8");',
                            "}",
                            'if (args[0] === "list") {',
                            '  const output = process.env.OPENCLAW_TEST_LAUNCHCTL_LIST_OUTPUT || "";',
                            "  process.stdout.write(output);",
                            "}",
                            "process.exit(0);",
                            "",
                        ].join("\n"), "utf8")];
                case 5:
                    _b.sent();
                    if (!(process.platform === "win32")) return [3 /*break*/, 7];
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(binDir, "launchctl.cmd"), "@echo off\r\nnode \"%~dp0\\launchctl.js\" %*\r\n", "utf8")];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 7:
                    shPath = node_path_1.default.join(binDir, "launchctl");
                    return [4 /*yield*/, promises_1.default.writeFile(shPath, "#!/bin/sh\nnode \"$(dirname \"$0\")/launchctl.js\" \"$@\"\n", "utf8")];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.chmod(shPath, 493)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    process.env.OPENCLAW_TEST_LAUNCHCTL_LOG = logPath;
                    process.env.OPENCLAW_TEST_LAUNCHCTL_LIST_OUTPUT = (_a = options.listOutput) !== null && _a !== void 0 ? _a : "";
                    process.env.PATH = "".concat(binDir).concat(node_path_1.default.delimiter).concat(originalPath !== null && originalPath !== void 0 ? originalPath : "");
                    return [4 /*yield*/, run({
                            env: {
                                HOME: homeDir,
                                OPENCLAW_PROFILE: "default",
                            },
                            logPath: logPath,
                        })];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 12:
                    process.env.PATH = originalPath;
                    if (originalLogPath === undefined) {
                        delete process.env.OPENCLAW_TEST_LAUNCHCTL_LOG;
                    }
                    else {
                        process.env.OPENCLAW_TEST_LAUNCHCTL_LOG = originalLogPath;
                    }
                    if (originalListOutput === undefined) {
                        delete process.env.OPENCLAW_TEST_LAUNCHCTL_LIST_OUTPUT;
                    }
                    else {
                        process.env.OPENCLAW_TEST_LAUNCHCTL_LIST_OUTPUT = originalListOutput;
                    }
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 13:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("launchd runtime parsing", function () {
    (0, vitest_1.it)("parses state, pid, and exit status", function () {
        var output = [
            "state = running",
            "pid = 4242",
            "last exit status = 1",
            "last exit reason = exited",
        ].join("\n");
        (0, vitest_1.expect)((0, launchd_js_1.parseLaunchctlPrint)(output)).toEqual({
            state: "running",
            pid: 4242,
            lastExitStatus: 1,
            lastExitReason: "exited",
        });
    });
});
(0, vitest_1.describe)("launchctl list detection", function () {
    (0, vitest_1.it)("detects the resolved label in launchctl list", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLaunchctlStub({ listOutput: "123 0 ai.openclaw.gateway\n" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var listed;
                        var env = _b.env;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, launchd_js_1.isLaunchAgentListed)({ env: env })];
                                case 1:
                                    listed = _c.sent();
                                    (0, vitest_1.expect)(listed).toBe(true);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns false when the label is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLaunchctlStub({ listOutput: "123 0 com.other.service\n" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var listed;
                        var env = _b.env;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, launchd_js_1.isLaunchAgentListed)({ env: env })];
                                case 1:
                                    listed = _c.sent();
                                    (0, vitest_1.expect)(listed).toBe(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("launchd bootstrap repair", function () {
    (0, vitest_1.it)("bootstraps and kickstarts the resolved label", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLaunchctlStub({}, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var repair, calls, domain, label, plistPath;
                        var env = _b.env, logPath = _b.logPath;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, launchd_js_1.repairLaunchAgentBootstrap)({ env: env })];
                                case 1:
                                    repair = _c.sent();
                                    (0, vitest_1.expect)(repair.ok).toBe(true);
                                    return [4 /*yield*/, promises_1.default.readFile(logPath, "utf8")];
                                case 2:
                                    calls = (_c.sent())
                                        .split("\n")
                                        .filter(Boolean)
                                        .map(function (line) { return JSON.parse(line); });
                                    domain = typeof process.getuid === "function" ? "gui/".concat(process.getuid()) : "gui/501";
                                    label = "ai.openclaw.gateway";
                                    plistPath = (0, launchd_js_1.resolveLaunchAgentPlistPath)(env);
                                    (0, vitest_1.expect)(calls).toContainEqual(["bootstrap", domain, plistPath]);
                                    (0, vitest_1.expect)(calls).toContainEqual(["kickstart", "-k", "".concat(domain, "/").concat(label)]);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("launchd install", function () {
    (0, vitest_1.it)("enables service before bootstrap (clears persisted disabled state)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalPath, originalLogPath, tmpDir, binDir, homeDir, logPath, stubJsPath, shPath, env, calls, domain_1, label, plistPath_1, serviceId_1, enableCalls, enableIndex, bootstrapIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    originalPath = process.env.PATH;
                    originalLogPath = process.env.OPENCLAW_TEST_LAUNCHCTL_LOG;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-launchctl-test-"))];
                case 1:
                    tmpDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 13, 15]);
                    binDir = node_path_1.default.join(tmpDir, "bin");
                    homeDir = node_path_1.default.join(tmpDir, "home");
                    logPath = node_path_1.default.join(tmpDir, "launchctl.log");
                    return [4 /*yield*/, promises_1.default.mkdir(binDir, { recursive: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(homeDir, { recursive: true })];
                case 4:
                    _a.sent();
                    stubJsPath = node_path_1.default.join(binDir, "launchctl.js");
                    return [4 /*yield*/, promises_1.default.writeFile(stubJsPath, [
                            'import fs from "node:fs";',
                            "const logPath = process.env.OPENCLAW_TEST_LAUNCHCTL_LOG;",
                            "if (logPath) {",
                            '  fs.appendFileSync(logPath, JSON.stringify(process.argv.slice(2)) + "\\n", "utf8");',
                            "}",
                            "process.exit(0);",
                            "",
                        ].join("\n"), "utf8")];
                case 5:
                    _a.sent();
                    if (!(process.platform === "win32")) return [3 /*break*/, 7];
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(binDir, "launchctl.cmd"), "@echo off\r\nnode \"%~dp0\\launchctl.js\" %*\r\n", "utf8")];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 7:
                    shPath = node_path_1.default.join(binDir, "launchctl");
                    return [4 /*yield*/, promises_1.default.writeFile(shPath, "#!/bin/sh\nnode \"$(dirname \"$0\")/launchctl.js\" \"$@\"\n", "utf8")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.chmod(shPath, 493)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    process.env.OPENCLAW_TEST_LAUNCHCTL_LOG = logPath;
                    process.env.PATH = "".concat(binDir).concat(node_path_1.default.delimiter).concat(originalPath !== null && originalPath !== void 0 ? originalPath : "");
                    env = {
                        HOME: homeDir,
                        OPENCLAW_PROFILE: "default",
                    };
                    return [4 /*yield*/, (0, launchd_js_1.installLaunchAgent)({
                            env: env,
                            stdout: new node_stream_1.PassThrough(),
                            programArguments: ["node", "-e", "process.exit(0)"],
                        })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(logPath, "utf8")];
                case 12:
                    calls = (_a.sent())
                        .split("\n")
                        .filter(Boolean)
                        .map(function (line) { return JSON.parse(line); });
                    domain_1 = typeof process.getuid === "function" ? "gui/".concat(process.getuid()) : "gui/501";
                    label = "ai.openclaw.gateway";
                    plistPath_1 = (0, launchd_js_1.resolveLaunchAgentPlistPath)(env);
                    serviceId_1 = "".concat(domain_1, "/").concat(label);
                    enableCalls = calls.filter(function (c) { return c[0] === "enable" && c[1] === serviceId_1; });
                    (0, vitest_1.expect)(enableCalls).toHaveLength(1);
                    enableIndex = calls.findIndex(function (c) { return c[0] === "enable" && c[1] === serviceId_1; });
                    bootstrapIndex = calls.findIndex(function (c) { return c[0] === "bootstrap" && c[1] === domain_1 && c[2] === plistPath_1; });
                    (0, vitest_1.expect)(enableIndex).toBeGreaterThanOrEqual(0);
                    (0, vitest_1.expect)(bootstrapIndex).toBeGreaterThanOrEqual(0);
                    (0, vitest_1.expect)(enableIndex).toBeLessThan(bootstrapIndex);
                    return [3 /*break*/, 15];
                case 13:
                    process.env.PATH = originalPath;
                    if (originalLogPath === undefined) {
                        delete process.env.OPENCLAW_TEST_LAUNCHCTL_LOG;
                    }
                    else {
                        process.env.OPENCLAW_TEST_LAUNCHCTL_LOG = originalLogPath;
                    }
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 14:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveLaunchAgentPlistPath", function () {
    (0, vitest_1.it)("uses default label when OPENCLAW_PROFILE is default", function () {
        var env = { HOME: "/Users/test", OPENCLAW_PROFILE: "default" };
        (0, vitest_1.expect)((0, launchd_js_1.resolveLaunchAgentPlistPath)(env)).toBe("/Users/test/Library/LaunchAgents/ai.openclaw.gateway.plist");
    });
    (0, vitest_1.it)("uses default label when OPENCLAW_PROFILE is unset", function () {
        var env = { HOME: "/Users/test" };
        (0, vitest_1.expect)((0, launchd_js_1.resolveLaunchAgentPlistPath)(env)).toBe("/Users/test/Library/LaunchAgents/ai.openclaw.gateway.plist");
    });
    (0, vitest_1.it)("uses profile-specific label when OPENCLAW_PROFILE is set to a custom value", function () {
        var env = { HOME: "/Users/test", OPENCLAW_PROFILE: "jbphoenix" };
        (0, vitest_1.expect)((0, launchd_js_1.resolveLaunchAgentPlistPath)(env)).toBe("/Users/test/Library/LaunchAgents/ai.openclaw.jbphoenix.plist");
    });
    (0, vitest_1.it)("prefers OPENCLAW_LAUNCHD_LABEL over OPENCLAW_PROFILE", function () {
        var env = {
            HOME: "/Users/test",
            OPENCLAW_PROFILE: "jbphoenix",
            OPENCLAW_LAUNCHD_LABEL: "com.custom.label",
        };
        (0, vitest_1.expect)((0, launchd_js_1.resolveLaunchAgentPlistPath)(env)).toBe("/Users/test/Library/LaunchAgents/com.custom.label.plist");
    });
    (0, vitest_1.it)("trims whitespace from OPENCLAW_LAUNCHD_LABEL", function () {
        var env = {
            HOME: "/Users/test",
            OPENCLAW_LAUNCHD_LABEL: "  com.custom.label  ",
        };
        (0, vitest_1.expect)((0, launchd_js_1.resolveLaunchAgentPlistPath)(env)).toBe("/Users/test/Library/LaunchAgents/com.custom.label.plist");
    });
    (0, vitest_1.it)("ignores empty OPENCLAW_LAUNCHD_LABEL and falls back to profile", function () {
        var env = {
            HOME: "/Users/test",
            OPENCLAW_PROFILE: "myprofile",
            OPENCLAW_LAUNCHD_LABEL: "   ",
        };
        (0, vitest_1.expect)((0, launchd_js_1.resolveLaunchAgentPlistPath)(env)).toBe("/Users/test/Library/LaunchAgents/ai.openclaw.myprofile.plist");
    });
    (0, vitest_1.it)("handles case-insensitive 'Default' profile", function () {
        var env = { HOME: "/Users/test", OPENCLAW_PROFILE: "Default" };
        (0, vitest_1.expect)((0, launchd_js_1.resolveLaunchAgentPlistPath)(env)).toBe("/Users/test/Library/LaunchAgents/ai.openclaw.gateway.plist");
    });
    (0, vitest_1.it)("handles case-insensitive 'DEFAULT' profile", function () {
        var env = { HOME: "/Users/test", OPENCLAW_PROFILE: "DEFAULT" };
        (0, vitest_1.expect)((0, launchd_js_1.resolveLaunchAgentPlistPath)(env)).toBe("/Users/test/Library/LaunchAgents/ai.openclaw.gateway.plist");
    });
    (0, vitest_1.it)("trims whitespace from OPENCLAW_PROFILE", function () {
        var env = { HOME: "/Users/test", OPENCLAW_PROFILE: "  myprofile  " };
        (0, vitest_1.expect)((0, launchd_js_1.resolveLaunchAgentPlistPath)(env)).toBe("/Users/test/Library/LaunchAgents/ai.openclaw.myprofile.plist");
    });
});
