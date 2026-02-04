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
var node_events_1 = require("node:events");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_stream_1 = require("node:stream");
var vitest_1 = require("vitest");
var spawnCalls = [];
vitest_1.vi.mock("node:child_process", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { spawn: function (command, args) {
                            spawnCalls.push({ command: command, args: args });
                            var child = new node_events_1.EventEmitter();
                            child.stdout = new node_stream_1.Readable({ read: function () { } });
                            child.stderr = new node_stream_1.Readable({ read: function () { } });
                            var dockerArgs = command === "docker" ? args : [];
                            var shouldFailContainerInspect = dockerArgs[0] === "inspect" &&
                                dockerArgs[1] === "-f" &&
                                dockerArgs[2] === "{{.State.Running}}";
                            var shouldSucceedImageInspect = dockerArgs[0] === "image" && dockerArgs[1] === "inspect";
                            var code = shouldFailContainerInspect ? 1 : 0;
                            if (shouldSucceedImageInspect) {
                                queueMicrotask(function () { return child.emit("close", 0); });
                            }
                            else {
                                queueMicrotask(function () { return child.emit("close", code); });
                            }
                            return child;
                        } })];
        }
    });
}); });
vitest_1.vi.mock("../skills.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { syncSkillsToWorkspace: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }) })];
        }
    });
}); });
(0, vitest_1.describe)("Agent-specific sandbox config", function () {
    var previousStateDir;
    var tempStateDir;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spawnCalls.length = 0;
                    previousStateDir = process.env.MOLTBOT_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "moltbot-test-state-"))];
                case 1:
                    tempStateDir = _a.sent();
                    process.env.MOLTBOT_STATE_DIR = tempStateDir;
                    vitest_1.vi.resetModules();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!tempStateDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, promises_1.default.rm(tempStateDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (previousStateDir === undefined) {
                        delete process.env.MOLTBOT_STATE_DIR;
                    }
                    else {
                        process.env.MOLTBOT_STATE_DIR = previousStateDir;
                    }
                    tempStateDir = undefined;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should allow agent-specific docker settings beyond setupCommand", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxContext, cfg, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxContext = (_a.sent()).resolveSandboxContext;
                    cfg = {
                        agents: {
                            defaults: {
                                sandbox: {
                                    mode: "all",
                                    scope: "agent",
                                    docker: {
                                        image: "global-image",
                                        network: "none",
                                    },
                                },
                            },
                            list: [
                                {
                                    id: "work",
                                    workspace: "~/openclaw-work",
                                    sandbox: {
                                        mode: "all",
                                        scope: "agent",
                                        docker: {
                                            image: "work-image",
                                            network: "bridge",
                                        },
                                    },
                                },
                            ],
                        },
                    };
                    return [4 /*yield*/, resolveSandboxContext({
                            config: cfg,
                            sessionKey: "agent:work:main",
                            workspaceDir: "/tmp/test-work",
                        })];
                case 2:
                    context = _a.sent();
                    (0, vitest_1.expect)(context).toBeDefined();
                    (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.docker.image).toBe("work-image");
                    (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.docker.network).toBe("bridge");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should override with agent-specific sandbox mode 'off'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxContext, cfg, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxContext = (_a.sent()).resolveSandboxContext;
                    cfg = {
                        agents: {
                            defaults: {
                                sandbox: {
                                    mode: "all", // Global default
                                    scope: "agent",
                                },
                            },
                            list: [
                                {
                                    id: "main",
                                    workspace: "~/openclaw",
                                    sandbox: {
                                        mode: "off", // Agent override
                                    },
                                },
                            ],
                        },
                    };
                    return [4 /*yield*/, resolveSandboxContext({
                            config: cfg,
                            sessionKey: "agent:main:main",
                            workspaceDir: "/tmp/test",
                        })];
                case 2:
                    context = _a.sent();
                    // Should be null because mode is "off"
                    (0, vitest_1.expect)(context).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should use agent-specific sandbox mode 'all'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxContext, cfg, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxContext = (_a.sent()).resolveSandboxContext;
                    cfg = {
                        agents: {
                            defaults: {
                                sandbox: {
                                    mode: "off", // Global default
                                },
                            },
                            list: [
                                {
                                    id: "family",
                                    workspace: "~/openclaw-family",
                                    sandbox: {
                                        mode: "all", // Agent override
                                        scope: "agent",
                                    },
                                },
                            ],
                        },
                    };
                    return [4 /*yield*/, resolveSandboxContext({
                            config: cfg,
                            sessionKey: "agent:family:whatsapp:group:123",
                            workspaceDir: "/tmp/test-family",
                        })];
                case 2:
                    context = _a.sent();
                    (0, vitest_1.expect)(context).toBeDefined();
                    (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.enabled).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should use agent-specific scope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSandboxContext, cfg, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sandbox.js"); })];
                case 1:
                    resolveSandboxContext = (_a.sent()).resolveSandboxContext;
                    cfg = {
                        agents: {
                            defaults: {
                                sandbox: {
                                    mode: "all",
                                    scope: "session", // Global default
                                },
                            },
                            list: [
                                {
                                    id: "work",
                                    workspace: "~/openclaw-work",
                                    sandbox: {
                                        mode: "all",
                                        scope: "agent", // Agent override
                                    },
                                },
                            ],
                        },
                    };
                    return [4 /*yield*/, resolveSandboxContext({
                            config: cfg,
                            sessionKey: "agent:work:slack:channel:456",
                            workspaceDir: "/tmp/test-work",
                        })];
                case 2:
                    context = _a.sent();
                    (0, vitest_1.expect)(context).toBeDefined();
                    // The container name should use agent scope (agent:work)
                    (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.containerName).toContain("agent-work");
                    return [2 /*return*/];
            }
        });
    }); });
});
