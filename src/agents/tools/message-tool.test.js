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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var runtime_js_1 = require("../../plugins/runtime.js");
var channel_plugins_js_1 = require("../../test-utils/channel-plugins.js");
var message_tool_js_1 = require("./message-tool.js");
var mocks = vitest_1.vi.hoisted(function () { return ({
    runMessageAction: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../../infra/outbound/message-action-runner.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../infra/outbound/message-action-runner.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { runMessageAction: mocks.runMessageAction })];
        }
    });
}); });
(0, vitest_1.describe)("message tool agent routing", function () {
    (0, vitest_1.it)("derives agentId from the session key", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mocks.runMessageAction.mockClear();
                    mocks.runMessageAction.mockResolvedValue({
                        kind: "send",
                        action: "send",
                        channel: "telegram",
                        handledBy: "plugin",
                        payload: {},
                        dryRun: true,
                    });
                    tool = (0, message_tool_js_1.createMessageTool)({
                        agentSessionKey: "agent:alpha:main",
                        config: {},
                    });
                    return [4 /*yield*/, tool.execute("1", {
                            action: "send",
                            target: "telegram:123",
                            message: "hi",
                        })];
                case 1:
                    _b.sent();
                    call = (_a = mocks.runMessageAction.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.agentId).toBe("alpha");
                    (0, vitest_1.expect)(call === null || call === void 0 ? void 0 : call.sessionKey).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("message tool path passthrough", function () {
    (0, vitest_1.it)("does not convert path to media for send", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mocks.runMessageAction.mockClear();
                    mocks.runMessageAction.mockResolvedValue({
                        kind: "send",
                        action: "send",
                        channel: "telegram",
                        to: "telegram:123",
                        handledBy: "plugin",
                        payload: {},
                        dryRun: true,
                    });
                    tool = (0, message_tool_js_1.createMessageTool)({
                        config: {},
                    });
                    return [4 /*yield*/, tool.execute("1", {
                            action: "send",
                            target: "telegram:123",
                            path: "~/Downloads/voice.ogg",
                            message: "",
                        })];
                case 1:
                    _d.sent();
                    call = (_a = mocks.runMessageAction.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_b = call === null || call === void 0 ? void 0 : call.params) === null || _b === void 0 ? void 0 : _b.path).toBe("~/Downloads/voice.ogg");
                    (0, vitest_1.expect)((_c = call === null || call === void 0 ? void 0 : call.params) === null || _c === void 0 ? void 0 : _c.media).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not convert filePath to media for send", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, call;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mocks.runMessageAction.mockClear();
                    mocks.runMessageAction.mockResolvedValue({
                        kind: "send",
                        action: "send",
                        channel: "telegram",
                        to: "telegram:123",
                        handledBy: "plugin",
                        payload: {},
                        dryRun: true,
                    });
                    tool = (0, message_tool_js_1.createMessageTool)({
                        config: {},
                    });
                    return [4 /*yield*/, tool.execute("1", {
                            action: "send",
                            target: "telegram:123",
                            filePath: "./tmp/note.m4a",
                            message: "",
                        })];
                case 1:
                    _d.sent();
                    call = (_a = mocks.runMessageAction.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_b = call === null || call === void 0 ? void 0 : call.params) === null || _b === void 0 ? void 0 : _b.filePath).toBe("./tmp/note.m4a");
                    (0, vitest_1.expect)((_c = call === null || call === void 0 ? void 0 : call.params) === null || _c === void 0 ? void 0 : _c.media).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("message tool description", function () {
    var bluebubblesPlugin = {
        id: "bluebubbles",
        meta: {
            id: "bluebubbles",
            label: "BlueBubbles",
            selectionLabel: "BlueBubbles",
            docsPath: "/channels/bluebubbles",
            blurb: "BlueBubbles test plugin.",
        },
        capabilities: { chatTypes: ["direct", "group"], media: true },
        config: {
            listAccountIds: function () { return ["default"]; },
            resolveAccount: function () { return ({}); },
        },
        messaging: {
            normalizeTarget: function (raw) {
                var _a;
                var trimmed = raw.trim().replace(/^bluebubbles:/i, "");
                var lower = trimmed.toLowerCase();
                if (lower.startsWith("chat_guid:")) {
                    var guid = trimmed.slice("chat_guid:".length);
                    var parts = guid.split(";");
                    if (parts.length === 3 && parts[1] === "-") {
                        return ((_a = parts[2]) === null || _a === void 0 ? void 0 : _a.trim()) || trimmed;
                    }
                    return "chat_guid:".concat(guid);
                }
                return trimmed;
            },
        },
        actions: {
            listActions: function () {
                return ["react", "renameGroup", "addParticipant", "removeParticipant", "leaveGroup"];
            },
        },
    };
    (0, vitest_1.it)("hides BlueBubbles group actions for DM targets", function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([{ pluginId: "bluebubbles", source: "test", plugin: bluebubblesPlugin }]));
        var tool = (0, message_tool_js_1.createMessageTool)({
            config: {},
            currentChannelProvider: "bluebubbles",
            currentChannelId: "bluebubbles:chat_guid:iMessage;-;+15551234567",
        });
        (0, vitest_1.expect)(tool.description).not.toContain("renameGroup");
        (0, vitest_1.expect)(tool.description).not.toContain("addParticipant");
        (0, vitest_1.expect)(tool.description).not.toContain("removeParticipant");
        (0, vitest_1.expect)(tool.description).not.toContain("leaveGroup");
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
    });
});
(0, vitest_1.describe)("message tool sandbox path validation", function () {
    (0, vitest_1.it)("rejects filePath that escapes sandbox root", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sandboxDir, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "msg-sandbox-"))];
                case 1:
                    sandboxDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    tool = (0, message_tool_js_1.createMessageTool)({
                        config: {},
                        sandboxRoot: sandboxDir,
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("1", {
                            action: "send",
                            target: "telegram:123",
                            filePath: "/etc/passwd",
                            message: "",
                        })).rejects.toThrow(/sandbox/i)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.rm(sandboxDir, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects path param with traversal sequence", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sandboxDir, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "msg-sandbox-"))];
                case 1:
                    sandboxDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    tool = (0, message_tool_js_1.createMessageTool)({
                        config: {},
                        sandboxRoot: sandboxDir,
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)(tool.execute("1", {
                            action: "send",
                            target: "telegram:123",
                            path: "../../../etc/shadow",
                            message: "",
                        })).rejects.toThrow(/sandbox/i)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.rm(sandboxDir, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows filePath inside sandbox root", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sandboxDir, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.runMessageAction.mockClear();
                    mocks.runMessageAction.mockResolvedValue({
                        kind: "send",
                        action: "send",
                        channel: "telegram",
                        to: "telegram:123",
                        handledBy: "plugin",
                        payload: {},
                        dryRun: true,
                    });
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "msg-sandbox-"))];
                case 1:
                    sandboxDir = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    tool = (0, message_tool_js_1.createMessageTool)({
                        config: {},
                        sandboxRoot: sandboxDir,
                    });
                    return [4 /*yield*/, tool.execute("1", {
                            action: "send",
                            target: "telegram:123",
                            filePath: "./data/file.txt",
                            message: "",
                        })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.runMessageAction).toHaveBeenCalledTimes(1);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.rm(sandboxDir, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips validation when no sandboxRoot is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.runMessageAction.mockClear();
                    mocks.runMessageAction.mockResolvedValue({
                        kind: "send",
                        action: "send",
                        channel: "telegram",
                        to: "telegram:123",
                        handledBy: "plugin",
                        payload: {},
                        dryRun: true,
                    });
                    tool = (0, message_tool_js_1.createMessageTool)({
                        config: {},
                    });
                    return [4 /*yield*/, tool.execute("1", {
                            action: "send",
                            target: "telegram:123",
                            filePath: "/etc/passwd",
                            message: "",
                        })];
                case 1:
                    _a.sent();
                    // Without sandboxRoot the validation is skipped — unsandboxed sessions work normally.
                    (0, vitest_1.expect)(mocks.runMessageAction).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
