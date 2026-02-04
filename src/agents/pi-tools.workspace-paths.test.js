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
var pi_tools_js_1 = require("./pi-tools.js");
function withTempDir(prefix, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), prefix))];
                case 1:
                    dir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, fn(dir)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getTextContent(result) {
    var _a, _b;
    var textBlock = (_a = result === null || result === void 0 ? void 0 : result.content) === null || _a === void 0 ? void 0 : _a.find(function (block) { return block.type === "text"; });
    return (_b = textBlock === null || textBlock === void 0 ? void 0 : textBlock.text) !== null && _b !== void 0 ? _b : "";
}
(0, vitest_1.describe)("workspace path resolution", function () {
    (0, vitest_1.it)("reads relative paths against workspaceDir even after cwd changes", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempDir("openclaw-ws-", function (workspaceDir) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, withTempDir("openclaw-cwd-", function (otherDir) { return __awaiter(void 0, void 0, void 0, function () {
                                        var prevCwd, testFile, contents, tools, readTool, result;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    prevCwd = process.cwd();
                                                    testFile = "read.txt";
                                                    contents = "workspace read ok";
                                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, testFile), contents, "utf8")];
                                                case 1:
                                                    _a.sent();
                                                    process.chdir(otherDir);
                                                    _a.label = 2;
                                                case 2:
                                                    _a.trys.push([2, , 4, 5]);
                                                    tools = (0, pi_tools_js_1.createOpenClawCodingTools)({ workspaceDir: workspaceDir });
                                                    readTool = tools.find(function (tool) { return tool.name === "read"; });
                                                    (0, vitest_1.expect)(readTool).toBeDefined();
                                                    return [4 /*yield*/, (readTool === null || readTool === void 0 ? void 0 : readTool.execute("ws-read", { path: testFile }))];
                                                case 3:
                                                    result = _a.sent();
                                                    (0, vitest_1.expect)(getTextContent(result)).toContain(contents);
                                                    return [3 /*break*/, 5];
                                                case 4:
                                                    process.chdir(prevCwd);
                                                    return [7 /*endfinally*/];
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                                case 1:
                                    _a.sent();
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
    (0, vitest_1.it)("writes relative paths against workspaceDir even after cwd changes", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempDir("openclaw-ws-", function (workspaceDir) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, withTempDir("openclaw-cwd-", function (otherDir) { return __awaiter(void 0, void 0, void 0, function () {
                                        var prevCwd, testFile, contents, tools, writeTool, written;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    prevCwd = process.cwd();
                                                    testFile = "write.txt";
                                                    contents = "workspace write ok";
                                                    process.chdir(otherDir);
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, , 4, 5]);
                                                    tools = (0, pi_tools_js_1.createOpenClawCodingTools)({ workspaceDir: workspaceDir });
                                                    writeTool = tools.find(function (tool) { return tool.name === "write"; });
                                                    (0, vitest_1.expect)(writeTool).toBeDefined();
                                                    return [4 /*yield*/, (writeTool === null || writeTool === void 0 ? void 0 : writeTool.execute("ws-write", {
                                                            path: testFile,
                                                            content: contents,
                                                        }))];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(workspaceDir, testFile), "utf8")];
                                                case 3:
                                                    written = _a.sent();
                                                    (0, vitest_1.expect)(written).toBe(contents);
                                                    return [3 /*break*/, 5];
                                                case 4:
                                                    process.chdir(prevCwd);
                                                    return [7 /*endfinally*/];
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                                case 1:
                                    _a.sent();
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
    (0, vitest_1.it)("edits relative paths against workspaceDir even after cwd changes", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempDir("openclaw-ws-", function (workspaceDir) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, withTempDir("openclaw-cwd-", function (otherDir) { return __awaiter(void 0, void 0, void 0, function () {
                                        var prevCwd, testFile, tools, editTool, updated;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    prevCwd = process.cwd();
                                                    testFile = "edit.txt";
                                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, testFile), "hello world", "utf8")];
                                                case 1:
                                                    _a.sent();
                                                    process.chdir(otherDir);
                                                    _a.label = 2;
                                                case 2:
                                                    _a.trys.push([2, , 5, 6]);
                                                    tools = (0, pi_tools_js_1.createOpenClawCodingTools)({ workspaceDir: workspaceDir });
                                                    editTool = tools.find(function (tool) { return tool.name === "edit"; });
                                                    (0, vitest_1.expect)(editTool).toBeDefined();
                                                    return [4 /*yield*/, (editTool === null || editTool === void 0 ? void 0 : editTool.execute("ws-edit", {
                                                            path: testFile,
                                                            oldText: "world",
                                                            newText: "openclaw",
                                                        }))];
                                                case 3:
                                                    _a.sent();
                                                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(workspaceDir, testFile), "utf8")];
                                                case 4:
                                                    updated = _a.sent();
                                                    (0, vitest_1.expect)(updated).toBe("hello openclaw");
                                                    return [3 /*break*/, 6];
                                                case 5:
                                                    process.chdir(prevCwd);
                                                    return [7 /*endfinally*/];
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                                case 1:
                                    _a.sent();
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
    (0, vitest_1.it)("defaults exec cwd to workspaceDir when workdir is omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempDir("openclaw-ws-", function (workspaceDir) { return __awaiter(void 0, void 0, void 0, function () {
                        var tools, execTool, result, cwd, _a, resolvedOutput, resolvedWorkspace;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    tools = (0, pi_tools_js_1.createOpenClawCodingTools)({ workspaceDir: workspaceDir });
                                    execTool = tools.find(function (tool) { return tool.name === "exec"; });
                                    (0, vitest_1.expect)(execTool).toBeDefined();
                                    return [4 /*yield*/, (execTool === null || execTool === void 0 ? void 0 : execTool.execute("ws-exec", {
                                            command: "echo ok",
                                        }))];
                                case 1:
                                    result = _b.sent();
                                    cwd = (result === null || result === void 0 ? void 0 : result.details) && typeof result.details === "object" && "cwd" in result.details
                                        ? result.details.cwd
                                        : undefined;
                                    (0, vitest_1.expect)(cwd).toBeTruthy();
                                    return [4 /*yield*/, Promise.all([
                                            promises_1.default.realpath(String(cwd)),
                                            promises_1.default.realpath(workspaceDir),
                                        ])];
                                case 2:
                                    _a = _b.sent(), resolvedOutput = _a[0], resolvedWorkspace = _a[1];
                                    (0, vitest_1.expect)(resolvedOutput).toBe(resolvedWorkspace);
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
    (0, vitest_1.it)("lets exec workdir override the workspace default", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempDir("openclaw-ws-", function (workspaceDir) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, withTempDir("openclaw-override-", function (overrideDir) { return __awaiter(void 0, void 0, void 0, function () {
                                        var tools, execTool, result, cwd, _a, resolvedOutput, resolvedOverride;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    tools = (0, pi_tools_js_1.createOpenClawCodingTools)({ workspaceDir: workspaceDir });
                                                    execTool = tools.find(function (tool) { return tool.name === "exec"; });
                                                    (0, vitest_1.expect)(execTool).toBeDefined();
                                                    return [4 /*yield*/, (execTool === null || execTool === void 0 ? void 0 : execTool.execute("ws-exec-override", {
                                                            command: "echo ok",
                                                            workdir: overrideDir,
                                                        }))];
                                                case 1:
                                                    result = _b.sent();
                                                    cwd = (result === null || result === void 0 ? void 0 : result.details) && typeof result.details === "object" && "cwd" in result.details
                                                        ? result.details.cwd
                                                        : undefined;
                                                    (0, vitest_1.expect)(cwd).toBeTruthy();
                                                    return [4 /*yield*/, Promise.all([
                                                            promises_1.default.realpath(String(cwd)),
                                                            promises_1.default.realpath(overrideDir),
                                                        ])];
                                                case 2:
                                                    _a = _b.sent(), resolvedOutput = _a[0], resolvedOverride = _a[1];
                                                    (0, vitest_1.expect)(resolvedOutput).toBe(resolvedOverride);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                                case 1:
                                    _a.sent();
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
(0, vitest_1.describe)("sandboxed workspace paths", function () {
    (0, vitest_1.it)("uses sandbox workspace for relative read/write/edit", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempDir("openclaw-sandbox-", function (sandboxDir) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, withTempDir("openclaw-workspace-", function (workspaceDir) { return __awaiter(void 0, void 0, void 0, function () {
                                        var sandbox, testFile, tools, readTool, writeTool, editTool, result, written, edited;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    sandbox = {
                                                        enabled: true,
                                                        sessionKey: "sandbox:test",
                                                        workspaceDir: sandboxDir,
                                                        agentWorkspaceDir: workspaceDir,
                                                        workspaceAccess: "rw",
                                                        containerName: "openclaw-sbx-test",
                                                        containerWorkdir: "/workspace",
                                                        docker: {
                                                            image: "openclaw-sandbox:bookworm-slim",
                                                            containerPrefix: "openclaw-sbx-",
                                                            workdir: "/workspace",
                                                            readOnlyRoot: true,
                                                            tmpfs: [],
                                                            network: "none",
                                                            user: "1000:1000",
                                                            capDrop: ["ALL"],
                                                            env: { LANG: "C.UTF-8" },
                                                        },
                                                        tools: { allow: [], deny: [] },
                                                        browserAllowHostControl: false,
                                                    };
                                                    testFile = "sandbox.txt";
                                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(sandboxDir, testFile), "sandbox read", "utf8")];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, testFile), "workspace read", "utf8")];
                                                case 2:
                                                    _a.sent();
                                                    tools = (0, pi_tools_js_1.createOpenClawCodingTools)({ workspaceDir: workspaceDir, sandbox: sandbox });
                                                    readTool = tools.find(function (tool) { return tool.name === "read"; });
                                                    writeTool = tools.find(function (tool) { return tool.name === "write"; });
                                                    editTool = tools.find(function (tool) { return tool.name === "edit"; });
                                                    (0, vitest_1.expect)(readTool).toBeDefined();
                                                    (0, vitest_1.expect)(writeTool).toBeDefined();
                                                    (0, vitest_1.expect)(editTool).toBeDefined();
                                                    return [4 /*yield*/, (readTool === null || readTool === void 0 ? void 0 : readTool.execute("sbx-read", { path: testFile }))];
                                                case 3:
                                                    result = _a.sent();
                                                    (0, vitest_1.expect)(getTextContent(result)).toContain("sandbox read");
                                                    return [4 /*yield*/, (writeTool === null || writeTool === void 0 ? void 0 : writeTool.execute("sbx-write", {
                                                            path: "new.txt",
                                                            content: "sandbox write",
                                                        }))];
                                                case 4:
                                                    _a.sent();
                                                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(sandboxDir, "new.txt"), "utf8")];
                                                case 5:
                                                    written = _a.sent();
                                                    (0, vitest_1.expect)(written).toBe("sandbox write");
                                                    return [4 /*yield*/, (editTool === null || editTool === void 0 ? void 0 : editTool.execute("sbx-edit", {
                                                            path: "new.txt",
                                                            oldText: "write",
                                                            newText: "edit",
                                                        }))];
                                                case 6:
                                                    _a.sent();
                                                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(sandboxDir, "new.txt"), "utf8")];
                                                case 7:
                                                    edited = _a.sent();
                                                    (0, vitest_1.expect)(edited).toBe("sandbox edit");
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                                case 1:
                                    _a.sent();
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
