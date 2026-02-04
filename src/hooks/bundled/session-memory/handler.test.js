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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var workspace_js_1 = require("../../../test-helpers/workspace.js");
var hooks_js_1 = require("../../hooks.js");
var handler_js_1 = require("./handler.js");
/**
 * Create a mock session JSONL file with various entry types
 */
function createMockSessionContent(entries) {
    return entries
        .map(function (entry) {
        if ("role" in entry) {
            return JSON.stringify({
                type: "message",
                message: {
                    role: entry.role,
                    content: entry.content,
                },
            });
        }
        // Non-message entry (tool call, system, etc.)
        return JSON.stringify(entry);
    })
        .join("\n");
}
(0, vitest_1.describe)("session-memory hook", function () {
    (0, vitest_1.it)("skips non-command events", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, event, memoryDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_1.makeTempWorkspace)("openclaw-session-memory-")];
                case 1:
                    tempDir = _a.sent();
                    event = (0, hooks_js_1.createHookEvent)("agent", "bootstrap", "agent:main:main", {
                        workspaceDir: tempDir,
                    });
                    return [4 /*yield*/, (0, handler_js_1.default)(event)];
                case 2:
                    _a.sent();
                    memoryDir = node_path_1.default.join(tempDir, "memory");
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.access(memoryDir)).rejects.toThrow()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips commands other than new", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, event, memoryDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_1.makeTempWorkspace)("openclaw-session-memory-")];
                case 1:
                    tempDir = _a.sent();
                    event = (0, hooks_js_1.createHookEvent)("command", "help", "agent:main:main", {
                        workspaceDir: tempDir,
                    });
                    return [4 /*yield*/, (0, handler_js_1.default)(event)];
                case 2:
                    _a.sent();
                    memoryDir = node_path_1.default.join(tempDir, "memory");
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.access(memoryDir)).rejects.toThrow()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("creates memory file with session content on /new command", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, sessionsDir, sessionContent, sessionFile, cfg, event, memoryDir, files, memoryContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_1.makeTempWorkspace)("openclaw-session-memory-")];
                case 1:
                    tempDir = _a.sent();
                    sessionsDir = node_path_1.default.join(tempDir, "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 2:
                    _a.sent();
                    sessionContent = createMockSessionContent([
                        { role: "user", content: "Hello there" },
                        { role: "assistant", content: "Hi! How can I help?" },
                        { role: "user", content: "What is 2+2?" },
                        { role: "assistant", content: "2+2 equals 4" },
                    ]);
                    return [4 /*yield*/, (0, workspace_js_1.writeWorkspaceFile)({
                            dir: sessionsDir,
                            name: "test-session.jsonl",
                            content: sessionContent,
                        })];
                case 3:
                    sessionFile = _a.sent();
                    cfg = {
                        agents: { defaults: { workspace: tempDir } },
                    };
                    event = (0, hooks_js_1.createHookEvent)("command", "new", "agent:main:main", {
                        cfg: cfg,
                        previousSessionEntry: {
                            sessionId: "test-123",
                            sessionFile: sessionFile,
                        },
                    });
                    return [4 /*yield*/, (0, handler_js_1.default)(event)];
                case 4:
                    _a.sent();
                    memoryDir = node_path_1.default.join(tempDir, "memory");
                    return [4 /*yield*/, promises_1.default.readdir(memoryDir)];
                case 5:
                    files = _a.sent();
                    (0, vitest_1.expect)(files.length).toBe(1);
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(memoryDir, files[0]), "utf-8")];
                case 6:
                    memoryContent = _a.sent();
                    (0, vitest_1.expect)(memoryContent).toContain("user: Hello there");
                    (0, vitest_1.expect)(memoryContent).toContain("assistant: Hi! How can I help?");
                    (0, vitest_1.expect)(memoryContent).toContain("user: What is 2+2?");
                    (0, vitest_1.expect)(memoryContent).toContain("assistant: 2+2 equals 4");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("filters out non-message entries (tool calls, system)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, sessionsDir, sessionContent, sessionFile, cfg, event, memoryDir, files, memoryContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_1.makeTempWorkspace)("openclaw-session-memory-")];
                case 1:
                    tempDir = _a.sent();
                    sessionsDir = node_path_1.default.join(tempDir, "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 2:
                    _a.sent();
                    sessionContent = createMockSessionContent([
                        { role: "user", content: "Hello" },
                        { type: "tool_use", tool: "search", input: "test" },
                        { role: "assistant", content: "World" },
                        { type: "tool_result", result: "found it" },
                        { role: "user", content: "Thanks" },
                    ]);
                    return [4 /*yield*/, (0, workspace_js_1.writeWorkspaceFile)({
                            dir: sessionsDir,
                            name: "test-session.jsonl",
                            content: sessionContent,
                        })];
                case 3:
                    sessionFile = _a.sent();
                    cfg = {
                        agents: { defaults: { workspace: tempDir } },
                    };
                    event = (0, hooks_js_1.createHookEvent)("command", "new", "agent:main:main", {
                        cfg: cfg,
                        previousSessionEntry: {
                            sessionId: "test-123",
                            sessionFile: sessionFile,
                        },
                    });
                    return [4 /*yield*/, (0, handler_js_1.default)(event)];
                case 4:
                    _a.sent();
                    memoryDir = node_path_1.default.join(tempDir, "memory");
                    return [4 /*yield*/, promises_1.default.readdir(memoryDir)];
                case 5:
                    files = _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(memoryDir, files[0]), "utf-8")];
                case 6:
                    memoryContent = _a.sent();
                    // Only user/assistant messages should be present
                    (0, vitest_1.expect)(memoryContent).toContain("user: Hello");
                    (0, vitest_1.expect)(memoryContent).toContain("assistant: World");
                    (0, vitest_1.expect)(memoryContent).toContain("user: Thanks");
                    // Tool entries should not appear
                    (0, vitest_1.expect)(memoryContent).not.toContain("tool_use");
                    (0, vitest_1.expect)(memoryContent).not.toContain("tool_result");
                    (0, vitest_1.expect)(memoryContent).not.toContain("search");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("filters out command messages starting with /", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, sessionsDir, sessionContent, sessionFile, cfg, event, memoryDir, files, memoryContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_1.makeTempWorkspace)("openclaw-session-memory-")];
                case 1:
                    tempDir = _a.sent();
                    sessionsDir = node_path_1.default.join(tempDir, "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 2:
                    _a.sent();
                    sessionContent = createMockSessionContent([
                        { role: "user", content: "/help" },
                        { role: "assistant", content: "Here is help info" },
                        { role: "user", content: "Normal message" },
                        { role: "user", content: "/new" },
                    ]);
                    return [4 /*yield*/, (0, workspace_js_1.writeWorkspaceFile)({
                            dir: sessionsDir,
                            name: "test-session.jsonl",
                            content: sessionContent,
                        })];
                case 3:
                    sessionFile = _a.sent();
                    cfg = {
                        agents: { defaults: { workspace: tempDir } },
                    };
                    event = (0, hooks_js_1.createHookEvent)("command", "new", "agent:main:main", {
                        cfg: cfg,
                        previousSessionEntry: {
                            sessionId: "test-123",
                            sessionFile: sessionFile,
                        },
                    });
                    return [4 /*yield*/, (0, handler_js_1.default)(event)];
                case 4:
                    _a.sent();
                    memoryDir = node_path_1.default.join(tempDir, "memory");
                    return [4 /*yield*/, promises_1.default.readdir(memoryDir)];
                case 5:
                    files = _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(memoryDir, files[0]), "utf-8")];
                case 6:
                    memoryContent = _a.sent();
                    // Command messages should be filtered out
                    (0, vitest_1.expect)(memoryContent).not.toContain("/help");
                    (0, vitest_1.expect)(memoryContent).not.toContain("/new");
                    // Normal messages should be present
                    (0, vitest_1.expect)(memoryContent).toContain("assistant: Here is help info");
                    (0, vitest_1.expect)(memoryContent).toContain("user: Normal message");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects custom messages config (limits to N messages)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, sessionsDir, entries, i, sessionContent, sessionFile, cfg, event, memoryDir, files, memoryContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_1.makeTempWorkspace)("openclaw-session-memory-")];
                case 1:
                    tempDir = _a.sent();
                    sessionsDir = node_path_1.default.join(tempDir, "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 2:
                    _a.sent();
                    entries = [];
                    for (i = 1; i <= 10; i++) {
                        entries.push({ role: "user", content: "Message ".concat(i) });
                    }
                    sessionContent = createMockSessionContent(entries);
                    return [4 /*yield*/, (0, workspace_js_1.writeWorkspaceFile)({
                            dir: sessionsDir,
                            name: "test-session.jsonl",
                            content: sessionContent,
                        })];
                case 3:
                    sessionFile = _a.sent();
                    cfg = {
                        agents: { defaults: { workspace: tempDir } },
                        hooks: {
                            internal: {
                                entries: {
                                    "session-memory": { enabled: true, messages: 3 },
                                },
                            },
                        },
                    };
                    event = (0, hooks_js_1.createHookEvent)("command", "new", "agent:main:main", {
                        cfg: cfg,
                        previousSessionEntry: {
                            sessionId: "test-123",
                            sessionFile: sessionFile,
                        },
                    });
                    return [4 /*yield*/, (0, handler_js_1.default)(event)];
                case 4:
                    _a.sent();
                    memoryDir = node_path_1.default.join(tempDir, "memory");
                    return [4 /*yield*/, promises_1.default.readdir(memoryDir)];
                case 5:
                    files = _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(memoryDir, files[0]), "utf-8")];
                case 6:
                    memoryContent = _a.sent();
                    // Only last 3 messages should be present
                    (0, vitest_1.expect)(memoryContent).not.toContain("user: Message 1\n");
                    (0, vitest_1.expect)(memoryContent).not.toContain("user: Message 7\n");
                    (0, vitest_1.expect)(memoryContent).toContain("user: Message 8");
                    (0, vitest_1.expect)(memoryContent).toContain("user: Message 9");
                    (0, vitest_1.expect)(memoryContent).toContain("user: Message 10");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("filters messages before slicing (fix for #2681)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, sessionsDir, entries, sessionContent, sessionFile, cfg, event, memoryDir, files, memoryContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_1.makeTempWorkspace)("openclaw-session-memory-")];
                case 1:
                    tempDir = _a.sent();
                    sessionsDir = node_path_1.default.join(tempDir, "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 2:
                    _a.sent();
                    entries = [
                        { role: "user", content: "First message" },
                        { type: "tool_use", tool: "test1" },
                        { type: "tool_result", result: "result1" },
                        { role: "assistant", content: "Second message" },
                        { type: "tool_use", tool: "test2" },
                        { type: "tool_result", result: "result2" },
                        { role: "user", content: "Third message" },
                        { type: "tool_use", tool: "test3" },
                        { type: "tool_result", result: "result3" },
                        { role: "assistant", content: "Fourth message" },
                    ];
                    sessionContent = createMockSessionContent(entries);
                    return [4 /*yield*/, (0, workspace_js_1.writeWorkspaceFile)({
                            dir: sessionsDir,
                            name: "test-session.jsonl",
                            content: sessionContent,
                        })];
                case 3:
                    sessionFile = _a.sent();
                    cfg = {
                        agents: { defaults: { workspace: tempDir } },
                        hooks: {
                            internal: {
                                entries: {
                                    "session-memory": { enabled: true, messages: 3 },
                                },
                            },
                        },
                    };
                    event = (0, hooks_js_1.createHookEvent)("command", "new", "agent:main:main", {
                        cfg: cfg,
                        previousSessionEntry: {
                            sessionId: "test-123",
                            sessionFile: sessionFile,
                        },
                    });
                    return [4 /*yield*/, (0, handler_js_1.default)(event)];
                case 4:
                    _a.sent();
                    memoryDir = node_path_1.default.join(tempDir, "memory");
                    return [4 /*yield*/, promises_1.default.readdir(memoryDir)];
                case 5:
                    files = _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(memoryDir, files[0]), "utf-8")];
                case 6:
                    memoryContent = _a.sent();
                    // Should have exactly 3 user/assistant messages (the last 3)
                    (0, vitest_1.expect)(memoryContent).not.toContain("First message");
                    (0, vitest_1.expect)(memoryContent).toContain("user: Third message");
                    (0, vitest_1.expect)(memoryContent).toContain("assistant: Second message");
                    (0, vitest_1.expect)(memoryContent).toContain("assistant: Fourth message");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles empty session files gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, sessionsDir, sessionFile, cfg, event, memoryDir, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_1.makeTempWorkspace)("openclaw-session-memory-")];
                case 1:
                    tempDir = _a.sent();
                    sessionsDir = node_path_1.default.join(tempDir, "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, workspace_js_1.writeWorkspaceFile)({
                            dir: sessionsDir,
                            name: "test-session.jsonl",
                            content: "",
                        })];
                case 3:
                    sessionFile = _a.sent();
                    cfg = {
                        agents: { defaults: { workspace: tempDir } },
                    };
                    event = (0, hooks_js_1.createHookEvent)("command", "new", "agent:main:main", {
                        cfg: cfg,
                        previousSessionEntry: {
                            sessionId: "test-123",
                            sessionFile: sessionFile,
                        },
                    });
                    // Should not throw
                    return [4 /*yield*/, (0, handler_js_1.default)(event)];
                case 4:
                    // Should not throw
                    _a.sent();
                    memoryDir = node_path_1.default.join(tempDir, "memory");
                    return [4 /*yield*/, promises_1.default.readdir(memoryDir)];
                case 5:
                    files = _a.sent();
                    (0, vitest_1.expect)(files.length).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles session files with fewer messages than requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, sessionsDir, sessionContent, sessionFile, cfg, event, memoryDir, files, memoryContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, workspace_js_1.makeTempWorkspace)("openclaw-session-memory-")];
                case 1:
                    tempDir = _a.sent();
                    sessionsDir = node_path_1.default.join(tempDir, "sessions");
                    return [4 /*yield*/, promises_1.default.mkdir(sessionsDir, { recursive: true })];
                case 2:
                    _a.sent();
                    sessionContent = createMockSessionContent([
                        { role: "user", content: "Only message 1" },
                        { role: "assistant", content: "Only message 2" },
                    ]);
                    return [4 /*yield*/, (0, workspace_js_1.writeWorkspaceFile)({
                            dir: sessionsDir,
                            name: "test-session.jsonl",
                            content: sessionContent,
                        })];
                case 3:
                    sessionFile = _a.sent();
                    cfg = {
                        agents: { defaults: { workspace: tempDir } },
                    };
                    event = (0, hooks_js_1.createHookEvent)("command", "new", "agent:main:main", {
                        cfg: cfg,
                        previousSessionEntry: {
                            sessionId: "test-123",
                            sessionFile: sessionFile,
                        },
                    });
                    return [4 /*yield*/, (0, handler_js_1.default)(event)];
                case 4:
                    _a.sent();
                    memoryDir = node_path_1.default.join(tempDir, "memory");
                    return [4 /*yield*/, promises_1.default.readdir(memoryDir)];
                case 5:
                    files = _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(memoryDir, files[0]), "utf-8")];
                case 6:
                    memoryContent = _a.sent();
                    // Both messages should be included
                    (0, vitest_1.expect)(memoryContent).toContain("user: Only message 1");
                    (0, vitest_1.expect)(memoryContent).toContain("assistant: Only message 2");
                    return [2 /*return*/];
            }
        });
    }); });
});
