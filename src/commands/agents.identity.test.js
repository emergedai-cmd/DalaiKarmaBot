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
var configMocks = vitest_1.vi.hoisted(function () { return ({
    readConfigFileSnapshot: vitest_1.vi.fn(),
    writeConfigFile: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { readConfigFileSnapshot: configMocks.readConfigFileSnapshot, writeConfigFile: configMocks.writeConfigFile })];
        }
    });
}); });
var agents_js_1 = require("./agents.js");
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(),
};
var baseSnapshot = {
    path: "/tmp/openclaw.json",
    exists: true,
    raw: "{}",
    parsed: {},
    valid: true,
    config: {},
    issues: [],
    legacyIssues: [],
};
(0, vitest_1.describe)("agents set-identity command", function () {
    (0, vitest_1.beforeEach)(function () {
        configMocks.readConfigFileSnapshot.mockReset();
        configMocks.writeConfigFile.mockClear();
        runtime.log.mockClear();
        runtime.error.mockClear();
        runtime.exit.mockClear();
    });
    (0, vitest_1.it)("sets identity from workspace IDENTITY.md", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, workspace, written, main;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-identity-"))];
                case 1:
                    root = _d.sent();
                    workspace = node_path_1.default.join(root, "work");
                    return [4 /*yield*/, promises_1.default.mkdir(workspace, { recursive: true })];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspace, "IDENTITY.md"), [
                            "- Name: OpenClaw",
                            "- Creature: helpful sloth",
                            "- Emoji: :)",
                            "- Avatar: avatars/openclaw.png",
                            "",
                        ].join("\n"), "utf-8")];
                case 3:
                    _d.sent();
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: {
                            agents: {
                                list: [
                                    { id: "main", workspace: workspace },
                                    { id: "ops", workspace: node_path_1.default.join(root, "ops") },
                                ],
                            },
                        } }));
                    return [4 /*yield*/, (0, agents_js_1.agentsSetIdentityCommand)({ workspace: workspace }, runtime)];
                case 4:
                    _d.sent();
                    (0, vitest_1.expect)(configMocks.writeConfigFile).toHaveBeenCalledTimes(1);
                    written = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    main = (_c = (_b = written.agents) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.find(function (entry) { return entry.id === "main"; });
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.identity).toEqual({
                        name: "OpenClaw",
                        theme: "helpful sloth",
                        emoji: ":)",
                        avatar: "avatars/openclaw.png",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("errors when multiple agents match the same workspace", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-identity-"))];
                case 1:
                    root = _a.sent();
                    workspace = node_path_1.default.join(root, "shared");
                    return [4 /*yield*/, promises_1.default.mkdir(workspace, { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspace, "IDENTITY.md"), "- Name: Echo\n", "utf-8")];
                case 3:
                    _a.sent();
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: {
                            agents: {
                                list: [
                                    { id: "main", workspace: workspace },
                                    { id: "ops", workspace: workspace },
                                ],
                            },
                        } }));
                    return [4 /*yield*/, (0, agents_js_1.agentsSetIdentityCommand)({ workspace: workspace }, runtime)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(runtime.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Multiple agents match"));
                    (0, vitest_1.expect)(runtime.exit).toHaveBeenCalledWith(1);
                    (0, vitest_1.expect)(configMocks.writeConfigFile).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("overrides identity file values with explicit flags", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, workspace, written, main;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-identity-"))];
                case 1:
                    root = _d.sent();
                    workspace = node_path_1.default.join(root, "work");
                    return [4 /*yield*/, promises_1.default.mkdir(workspace, { recursive: true })];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspace, "IDENTITY.md"), [
                            "- Name: OpenClaw",
                            "- Theme: space lobster",
                            "- Emoji: :)",
                            "- Avatar: avatars/openclaw.png",
                            "",
                        ].join("\n"), "utf-8")];
                case 3:
                    _d.sent();
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: { agents: { list: [{ id: "main", workspace: workspace }] } } }));
                    return [4 /*yield*/, (0, agents_js_1.agentsSetIdentityCommand)({
                            workspace: workspace,
                            fromIdentity: true,
                            name: "Nova",
                            emoji: "🦞",
                            avatar: "https://example.com/override.png",
                        }, runtime)];
                case 4:
                    _d.sent();
                    written = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    main = (_c = (_b = written.agents) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.find(function (entry) { return entry.id === "main"; });
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.identity).toEqual({
                        name: "Nova",
                        theme: "space lobster",
                        emoji: "🦞",
                        avatar: "https://example.com/override.png",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reads identity from an explicit IDENTITY.md path", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, workspace, identityPath, written, main;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-identity-"))];
                case 1:
                    root = _d.sent();
                    workspace = node_path_1.default.join(root, "work");
                    identityPath = node_path_1.default.join(workspace, "IDENTITY.md");
                    return [4 /*yield*/, promises_1.default.mkdir(workspace, { recursive: true })];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(identityPath, [
                            "- **Name:** C-3PO",
                            "- **Creature:** Flustered Protocol Droid",
                            "- **Emoji:** 🤖",
                            "- **Avatar:** avatars/c3po.png",
                            "",
                        ].join("\n"), "utf-8")];
                case 3:
                    _d.sent();
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: { agents: { list: [{ id: "main" }] } } }));
                    return [4 /*yield*/, (0, agents_js_1.agentsSetIdentityCommand)({ agent: "main", identityFile: identityPath }, runtime)];
                case 4:
                    _d.sent();
                    written = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    main = (_c = (_b = written.agents) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.find(function (entry) { return entry.id === "main"; });
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.identity).toEqual({
                        name: "C-3PO",
                        theme: "Flustered Protocol Droid",
                        emoji: "🤖",
                        avatar: "avatars/c3po.png",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts avatar-only identity from IDENTITY.md", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, workspace, written, main;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-identity-"))];
                case 1:
                    root = _d.sent();
                    workspace = node_path_1.default.join(root, "work");
                    return [4 /*yield*/, promises_1.default.mkdir(workspace, { recursive: true })];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspace, "IDENTITY.md"), "- Avatar: avatars/only.png\n", "utf-8")];
                case 3:
                    _d.sent();
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: { agents: { list: [{ id: "main", workspace: workspace }] } } }));
                    return [4 /*yield*/, (0, agents_js_1.agentsSetIdentityCommand)({ workspace: workspace, fromIdentity: true }, runtime)];
                case 4:
                    _d.sent();
                    written = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    main = (_c = (_b = written.agents) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.find(function (entry) { return entry.id === "main"; });
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.identity).toEqual({
                        avatar: "avatars/only.png",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts avatar-only updates via flags", function () { return __awaiter(void 0, void 0, void 0, function () {
        var written, main;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: { agents: { list: [{ id: "main" }] } } }));
                    return [4 /*yield*/, (0, agents_js_1.agentsSetIdentityCommand)({ agent: "main", avatar: "https://example.com/avatar.png" }, runtime)];
                case 1:
                    _d.sent();
                    written = (_a = configMocks.writeConfigFile.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    main = (_c = (_b = written.agents) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.find(function (entry) { return entry.id === "main"; });
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.identity).toEqual({
                        avatar: "https://example.com/avatar.png",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("errors when identity data is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-identity-"))];
                case 1:
                    root = _a.sent();
                    workspace = node_path_1.default.join(root, "work");
                    return [4 /*yield*/, promises_1.default.mkdir(workspace, { recursive: true })];
                case 2:
                    _a.sent();
                    configMocks.readConfigFileSnapshot.mockResolvedValue(__assign(__assign({}, baseSnapshot), { config: { agents: { list: [{ id: "main", workspace: workspace }] } } }));
                    return [4 /*yield*/, (0, agents_js_1.agentsSetIdentityCommand)({ workspace: workspace, fromIdentity: true }, runtime)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(runtime.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("No identity data found"));
                    (0, vitest_1.expect)(runtime.exit).toHaveBeenCalledWith(1);
                    (0, vitest_1.expect)(configMocks.writeConfigFile).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
