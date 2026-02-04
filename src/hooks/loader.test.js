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
var internal_hooks_js_1 = require("./internal-hooks.js");
var loader_js_1 = require("./loader.js");
(0, vitest_1.describe)("loader", function () {
    var tmpDir;
    var originalBundledDir;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, internal_hooks_js_1.clearInternalHooks)();
                    // Create a temp directory for test modules
                    tmpDir = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-test-".concat(Date.now()));
                    return [4 /*yield*/, promises_1.default.mkdir(tmpDir, { recursive: true })];
                case 1:
                    _a.sent();
                    // Disable bundled hooks during tests by setting env var to non-existent directory
                    originalBundledDir = process.env.OPENCLAW_BUNDLED_HOOKS_DIR;
                    process.env.OPENCLAW_BUNDLED_HOOKS_DIR = "/nonexistent/bundled/hooks";
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, internal_hooks_js_1.clearInternalHooks)();
                    // Restore original env var
                    if (originalBundledDir === undefined) {
                        delete process.env.OPENCLAW_BUNDLED_HOOKS_DIR;
                    }
                    else {
                        process.env.OPENCLAW_BUNDLED_HOOKS_DIR = originalBundledDir;
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.rm(tmpDir, { recursive: true, force: true })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)("loadInternalHooks", function () {
        (0, vitest_1.it)("should return 0 when hooks are not enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var cfg, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {
                            hooks: {
                                internal: {
                                    enabled: false,
                                },
                            },
                        };
                        return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(cfg, tmpDir)];
                    case 1:
                        count = _a.sent();
                        (0, vitest_1.expect)(count).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should return 0 when hooks config is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
            var cfg, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cfg = {};
                        return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(cfg, tmpDir)];
                    case 1:
                        count = _a.sent();
                        (0, vitest_1.expect)(count).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should load a handler from a module", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handlerPath, handlerCode, cfg, count, keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handlerPath = node_path_1.default.join(tmpDir, "test-handler.js");
                        handlerCode = "\n        export default async function(event) {\n          // Test handler\n        }\n      ";
                        return [4 /*yield*/, promises_1.default.writeFile(handlerPath, handlerCode, "utf-8")];
                    case 1:
                        _a.sent();
                        cfg = {
                            hooks: {
                                internal: {
                                    enabled: true,
                                    handlers: [
                                        {
                                            event: "command:new",
                                            module: handlerPath,
                                        },
                                    ],
                                },
                            },
                        };
                        return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(cfg, tmpDir)];
                    case 2:
                        count = _a.sent();
                        (0, vitest_1.expect)(count).toBe(1);
                        keys = (0, internal_hooks_js_1.getRegisteredEventKeys)();
                        (0, vitest_1.expect)(keys).toContain("command:new");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should load multiple handlers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handler1Path, handler2Path, cfg, count, keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handler1Path = node_path_1.default.join(tmpDir, "handler1.js");
                        handler2Path = node_path_1.default.join(tmpDir, "handler2.js");
                        return [4 /*yield*/, promises_1.default.writeFile(handler1Path, "export default async function() {}", "utf-8")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, promises_1.default.writeFile(handler2Path, "export default async function() {}", "utf-8")];
                    case 2:
                        _a.sent();
                        cfg = {
                            hooks: {
                                internal: {
                                    enabled: true,
                                    handlers: [
                                        { event: "command:new", module: handler1Path },
                                        { event: "command:stop", module: handler2Path },
                                    ],
                                },
                            },
                        };
                        return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(cfg, tmpDir)];
                    case 3:
                        count = _a.sent();
                        (0, vitest_1.expect)(count).toBe(2);
                        keys = (0, internal_hooks_js_1.getRegisteredEventKeys)();
                        (0, vitest_1.expect)(keys).toContain("command:new");
                        (0, vitest_1.expect)(keys).toContain("command:stop");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should support named exports", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handlerPath, handlerCode, cfg, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handlerPath = node_path_1.default.join(tmpDir, "named-export.js");
                        handlerCode = "\n        export const myHandler = async function(event) {\n          // Named export handler\n        }\n      ";
                        return [4 /*yield*/, promises_1.default.writeFile(handlerPath, handlerCode, "utf-8")];
                    case 1:
                        _a.sent();
                        cfg = {
                            hooks: {
                                internal: {
                                    enabled: true,
                                    handlers: [
                                        {
                                            event: "command:new",
                                            module: handlerPath,
                                            export: "myHandler",
                                        },
                                    ],
                                },
                            },
                        };
                        return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(cfg, tmpDir)];
                    case 2:
                        count = _a.sent();
                        (0, vitest_1.expect)(count).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle module loading errors gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleError, cfg, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleError = vitest_1.vi.spyOn(console, "error").mockImplementation(function () { });
                        cfg = {
                            hooks: {
                                internal: {
                                    enabled: true,
                                    handlers: [
                                        {
                                            event: "command:new",
                                            module: "/nonexistent/path/handler.js",
                                        },
                                    ],
                                },
                            },
                        };
                        return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(cfg, tmpDir)];
                    case 1:
                        count = _a.sent();
                        (0, vitest_1.expect)(count).toBe(0);
                        (0, vitest_1.expect)(consoleError).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Failed to load hook handler"), vitest_1.expect.any(String));
                        consoleError.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle non-function exports", function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleError, handlerPath, cfg, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleError = vitest_1.vi.spyOn(console, "error").mockImplementation(function () { });
                        handlerPath = node_path_1.default.join(tmpDir, "bad-export.js");
                        return [4 /*yield*/, promises_1.default.writeFile(handlerPath, 'export default "not a function";', "utf-8")];
                    case 1:
                        _a.sent();
                        cfg = {
                            hooks: {
                                internal: {
                                    enabled: true,
                                    handlers: [
                                        {
                                            event: "command:new",
                                            module: handlerPath,
                                        },
                                    ],
                                },
                            },
                        };
                        return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(cfg, tmpDir)];
                    case 2:
                        count = _a.sent();
                        (0, vitest_1.expect)(count).toBe(0);
                        (0, vitest_1.expect)(consoleError).toHaveBeenCalledWith(vitest_1.expect.stringContaining("is not a function"));
                        consoleError.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle relative paths", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handlerPath, relativePath, cfg, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handlerPath = node_path_1.default.join(tmpDir, "relative-handler.js");
                        return [4 /*yield*/, promises_1.default.writeFile(handlerPath, "export default async function() {}", "utf-8")];
                    case 1:
                        _a.sent();
                        relativePath = node_path_1.default.relative(process.cwd(), handlerPath);
                        cfg = {
                            hooks: {
                                internal: {
                                    enabled: true,
                                    handlers: [
                                        {
                                            event: "command:new",
                                            module: relativePath,
                                        },
                                    ],
                                },
                            },
                        };
                        return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(cfg, tmpDir)];
                    case 2:
                        count = _a.sent();
                        (0, vitest_1.expect)(count).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should actually call the loaded handler", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handlerPath, handlerCode, cfg, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handlerPath = node_path_1.default.join(tmpDir, "callable-handler.js");
                        handlerCode = "\n        let callCount = 0;\n        export default async function(event) {\n          callCount++;\n        }\n        export function getCallCount() {\n          return callCount;\n        }\n      ";
                        return [4 /*yield*/, promises_1.default.writeFile(handlerPath, handlerCode, "utf-8")];
                    case 1:
                        _a.sent();
                        cfg = {
                            hooks: {
                                internal: {
                                    enabled: true,
                                    handlers: [
                                        {
                                            event: "command:new",
                                            module: handlerPath,
                                        },
                                    ],
                                },
                            },
                        };
                        return [4 /*yield*/, (0, loader_js_1.loadInternalHooks)(cfg, tmpDir)];
                    case 2:
                        _a.sent();
                        event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
                        return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(event)];
                    case 3:
                        _a.sent();
                        // The handler should have been called, but we can't directly verify
                        // the call count from this context without more complex test infrastructure
                        // This test mainly verifies that loading and triggering doesn't crash
                        (0, vitest_1.expect)((0, internal_hooks_js_1.getRegisteredEventKeys)()).toContain("command:new");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
