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
var vitest_1 = require("vitest");
// --- Mocks ---
var mocks = vitest_1.vi.hoisted(function () { return ({
    listSandboxContainers: vitest_1.vi.fn(),
    listSandboxBrowsers: vitest_1.vi.fn(),
    removeSandboxContainer: vitest_1.vi.fn(),
    removeSandboxBrowserContainer: vitest_1.vi.fn(),
    clackConfirm: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../agents/sandbox.js", function () { return ({
    listSandboxContainers: mocks.listSandboxContainers,
    listSandboxBrowsers: mocks.listSandboxBrowsers,
    removeSandboxContainer: mocks.removeSandboxContainer,
    removeSandboxBrowserContainer: mocks.removeSandboxBrowserContainer,
}); });
vitest_1.vi.mock("@clack/prompts", function () { return ({
    confirm: mocks.clackConfirm,
}); });
var sandbox_js_1 = require("./sandbox.js");
// --- Test Factories ---
var NOW = Date.now();
function createContainer(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ containerName: "openclaw-sandbox-test", sessionKey: "test-session", image: "openclaw/sandbox:latest", imageMatch: true, running: true, createdAtMs: NOW - 3600000, lastUsedAtMs: NOW - 600000 }, overrides);
}
function createBrowser(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ containerName: "openclaw-browser-test", sessionKey: "test-session", image: "openclaw/browser:latest", imageMatch: true, running: true, createdAtMs: NOW - 3600000, lastUsedAtMs: NOW - 600000, cdpPort: 9222, noVncPort: 5900 }, overrides);
}
// --- Test Helpers ---
function createMockRuntime() {
    return {
        log: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        exit: vitest_1.vi.fn(),
    };
}
function setupDefaultMocks() {
    mocks.listSandboxContainers.mockResolvedValue([]);
    mocks.listSandboxBrowsers.mockResolvedValue([]);
    mocks.removeSandboxContainer.mockResolvedValue(undefined);
    mocks.removeSandboxBrowserContainer.mockResolvedValue(undefined);
    mocks.clackConfirm.mockResolvedValue(true);
}
function expectLogContains(runtime, text) {
    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith(vitest_1.expect.stringContaining(text));
}
function expectErrorContains(runtime, text) {
    (0, vitest_1.expect)(runtime.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining(text));
}
// --- Tests ---
(0, vitest_1.describe)("sandboxListCommand", function () {
    var runtime;
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        setupDefaultMocks();
        runtime = createMockRuntime();
    });
    (0, vitest_1.describe)("human format output", function () {
        (0, vitest_1.it)("should display containers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var container1, container2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container1 = createContainer({ containerName: "container-1" });
                        container2 = createContainer({
                            containerName: "container-2",
                            imageMatch: false,
                        });
                        mocks.listSandboxContainers.mockResolvedValue([container1, container2]);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxListCommand)({ browser: false, json: false }, runtime)];
                    case 1:
                        _a.sent();
                        expectLogContains(runtime, "📦 Sandbox Containers");
                        expectLogContains(runtime, container1.containerName);
                        expectLogContains(runtime, container2.containerName);
                        expectLogContains(runtime, "Total");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should display browsers when --browser flag is set", function () { return __awaiter(void 0, void 0, void 0, function () {
            var browser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        browser = createBrowser({ containerName: "browser-1" });
                        mocks.listSandboxBrowsers.mockResolvedValue([browser]);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxListCommand)({ browser: true, json: false }, runtime)];
                    case 1:
                        _a.sent();
                        expectLogContains(runtime, "🌐 Sandbox Browser Containers");
                        expectLogContains(runtime, browser.containerName);
                        expectLogContains(runtime, String(browser.cdpPort));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should show warning when image mismatches detected", function () { return __awaiter(void 0, void 0, void 0, function () {
            var mismatchContainer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mismatchContainer = createContainer({ imageMatch: false });
                        mocks.listSandboxContainers.mockResolvedValue([mismatchContainer]);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxListCommand)({ browser: false, json: false }, runtime)];
                    case 1:
                        _a.sent();
                        expectLogContains(runtime, "⚠️");
                        expectLogContains(runtime, "image mismatch");
                        expectLogContains(runtime, "sandbox recreate --all");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should display message when no containers found", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, sandbox_js_1.sandboxListCommand)({ browser: false, json: false }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("No sandbox containers found.");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("JSON output", function () {
        (0, vitest_1.it)("should output JSON format", function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, loggedJson, parsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = createContainer();
                        mocks.listSandboxContainers.mockResolvedValue([container]);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxListCommand)({ browser: false, json: true }, runtime)];
                    case 1:
                        _a.sent();
                        loggedJson = runtime.log.mock.calls[0][0];
                        parsed = JSON.parse(loggedJson);
                        (0, vitest_1.expect)(parsed.containers).toHaveLength(1);
                        (0, vitest_1.expect)(parsed.containers[0].containerName).toBe(container.containerName);
                        (0, vitest_1.expect)(parsed.browsers).toHaveLength(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("error handling", function () {
        (0, vitest_1.it)("should handle errors gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mocks.listSandboxContainers.mockRejectedValue(new Error("Docker not available"));
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxListCommand)({ browser: false, json: false }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("No sandbox containers found.");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
(0, vitest_1.describe)("sandboxRecreateCommand", function () {
    var runtime;
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        setupDefaultMocks();
        runtime = createMockRuntime();
    });
    (0, vitest_1.describe)("validation", function () {
        (0, vitest_1.it)("should error if no filter is specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: false, browser: false, force: false }, runtime)];
                    case 1:
                        _a.sent();
                        expectErrorContains(runtime, "Please specify --all, --session <key>, or --agent <id>");
                        (0, vitest_1.expect)(runtime.exit).toHaveBeenCalledWith(1);
                        (0, vitest_1.expect)(mocks.listSandboxContainers).not.toHaveBeenCalled();
                        (0, vitest_1.expect)(mocks.listSandboxBrowsers).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should error if multiple filters specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, session: "test", browser: false, force: false }, runtime)];
                    case 1:
                        _a.sent();
                        expectErrorContains(runtime, "Please specify only one of: --all, --session, --agent");
                        (0, vitest_1.expect)(runtime.exit).toHaveBeenCalledWith(1);
                        (0, vitest_1.expect)(mocks.listSandboxContainers).not.toHaveBeenCalled();
                        (0, vitest_1.expect)(mocks.listSandboxBrowsers).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("filtering", function () {
        (0, vitest_1.it)("should filter by session", function () { return __awaiter(void 0, void 0, void 0, function () {
            var match, noMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        match = createContainer({ sessionKey: "target-session" });
                        noMatch = createContainer({ sessionKey: "other-session" });
                        mocks.listSandboxContainers.mockResolvedValue([match, noMatch]);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ session: "target-session", browser: false, force: true }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).toHaveBeenCalledTimes(1);
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).toHaveBeenCalledWith(match.containerName);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should filter by agent (exact + subkeys)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var agent, agentSub, other;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        agent = createContainer({ sessionKey: "agent:work" });
                        agentSub = createContainer({ sessionKey: "agent:work:subtask" });
                        other = createContainer({ sessionKey: "test-session" });
                        mocks.listSandboxContainers.mockResolvedValue([agent, agentSub, other]);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ agent: "work", browser: false, force: true }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).toHaveBeenCalledTimes(2);
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).toHaveBeenCalledWith(agent.containerName);
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).toHaveBeenCalledWith(agentSub.containerName);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should remove all when --all flag set", function () { return __awaiter(void 0, void 0, void 0, function () {
            var containers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        containers = [createContainer(), createContainer()];
                        mocks.listSandboxContainers.mockResolvedValue(containers);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, browser: false, force: true }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle browsers when --browser flag set", function () { return __awaiter(void 0, void 0, void 0, function () {
            var browsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        browsers = [createBrowser(), createBrowser()];
                        mocks.listSandboxBrowsers.mockResolvedValue(browsers);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, browser: true, force: true }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mocks.removeSandboxBrowserContainer).toHaveBeenCalledTimes(2);
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("confirmation flow", function () {
        (0, vitest_1.it)("should require confirmation without --force", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mocks.listSandboxContainers.mockResolvedValue([createContainer()]);
                        mocks.clackConfirm.mockResolvedValue(true);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, browser: false, force: false }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mocks.clackConfirm).toHaveBeenCalled();
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should cancel when user declines", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mocks.listSandboxContainers.mockResolvedValue([createContainer()]);
                        mocks.clackConfirm.mockResolvedValue(false);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, browser: false, force: false }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("Cancelled.");
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should cancel on clack cancel symbol", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mocks.listSandboxContainers.mockResolvedValue([createContainer()]);
                        mocks.clackConfirm.mockResolvedValue(Symbol.for("clack:cancel"));
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, browser: false, force: false }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("Cancelled.");
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should skip confirmation with --force", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mocks.listSandboxContainers.mockResolvedValue([createContainer()]);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, browser: false, force: true }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mocks.clackConfirm).not.toHaveBeenCalled();
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("execution", function () {
        (0, vitest_1.it)("should show message when no containers match", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, browser: false, force: true }, runtime)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("No containers found matching the criteria.");
                        (0, vitest_1.expect)(mocks.removeSandboxContainer).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle removal errors and exit with code 1", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mocks.listSandboxContainers.mockResolvedValue([
                            createContainer({ containerName: "success" }),
                            createContainer({ containerName: "failure" }),
                        ]);
                        mocks.removeSandboxContainer
                            .mockResolvedValueOnce(undefined)
                            .mockRejectedValueOnce(new Error("Removal failed"));
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, browser: false, force: true }, runtime)];
                    case 1:
                        _a.sent();
                        expectErrorContains(runtime, "Failed to remove");
                        expectLogContains(runtime, "1 removed, 1 failed");
                        (0, vitest_1.expect)(runtime.exit).toHaveBeenCalledWith(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should display success message", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mocks.listSandboxContainers.mockResolvedValue([createContainer()]);
                        return [4 /*yield*/, (0, sandbox_js_1.sandboxRecreateCommand)({ all: true, browser: false, force: true }, runtime)];
                    case 1:
                        _a.sent();
                        expectLogContains(runtime, "✓ Removed");
                        expectLogContains(runtime, "1 removed, 0 failed");
                        expectLogContains(runtime, "automatically recreated");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
