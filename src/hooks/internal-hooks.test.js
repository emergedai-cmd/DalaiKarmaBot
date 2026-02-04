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
var vitest_1 = require("vitest");
var internal_hooks_js_1 = require("./internal-hooks.js");
(0, vitest_1.describe)("hooks", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, internal_hooks_js_1.clearInternalHooks)();
    });
    (0, vitest_1.afterEach)(function () {
        (0, internal_hooks_js_1.clearInternalHooks)();
    });
    (0, vitest_1.describe)("registerInternalHook", function () {
        (0, vitest_1.it)("should register a hook handler", function () {
            var handler = vitest_1.vi.fn();
            (0, internal_hooks_js_1.registerInternalHook)("command:new", handler);
            var keys = (0, internal_hooks_js_1.getRegisteredEventKeys)();
            (0, vitest_1.expect)(keys).toContain("command:new");
        });
        (0, vitest_1.it)("should allow multiple handlers for the same event", function () {
            var handler1 = vitest_1.vi.fn();
            var handler2 = vitest_1.vi.fn();
            (0, internal_hooks_js_1.registerInternalHook)("command:new", handler1);
            (0, internal_hooks_js_1.registerInternalHook)("command:new", handler2);
            var keys = (0, internal_hooks_js_1.getRegisteredEventKeys)();
            (0, vitest_1.expect)(keys).toContain("command:new");
        });
    });
    (0, vitest_1.describe)("unregisterInternalHook", function () {
        (0, vitest_1.it)("should unregister a specific handler", function () {
            var handler1 = vitest_1.vi.fn();
            var handler2 = vitest_1.vi.fn();
            (0, internal_hooks_js_1.registerInternalHook)("command:new", handler1);
            (0, internal_hooks_js_1.registerInternalHook)("command:new", handler2);
            (0, internal_hooks_js_1.unregisterInternalHook)("command:new", handler1);
            var event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
            void (0, internal_hooks_js_1.triggerInternalHook)(event);
            (0, vitest_1.expect)(handler1).not.toHaveBeenCalled();
            (0, vitest_1.expect)(handler2).toHaveBeenCalled();
        });
        (0, vitest_1.it)("should clean up empty handler arrays", function () {
            var handler = vitest_1.vi.fn();
            (0, internal_hooks_js_1.registerInternalHook)("command:new", handler);
            (0, internal_hooks_js_1.unregisterInternalHook)("command:new", handler);
            var keys = (0, internal_hooks_js_1.getRegisteredEventKeys)();
            (0, vitest_1.expect)(keys).not.toContain("command:new");
        });
    });
    (0, vitest_1.describe)("triggerInternalHook", function () {
        (0, vitest_1.it)("should trigger handlers for general event type", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handler, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handler = vitest_1.vi.fn();
                        (0, internal_hooks_js_1.registerInternalHook)("command", handler);
                        event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
                        return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(event)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(handler).toHaveBeenCalledWith(event);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should trigger handlers for specific event action", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handler, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handler = vitest_1.vi.fn();
                        (0, internal_hooks_js_1.registerInternalHook)("command:new", handler);
                        event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
                        return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(event)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(handler).toHaveBeenCalledWith(event);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should trigger both general and specific handlers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var generalHandler, specificHandler, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        generalHandler = vitest_1.vi.fn();
                        specificHandler = vitest_1.vi.fn();
                        (0, internal_hooks_js_1.registerInternalHook)("command", generalHandler);
                        (0, internal_hooks_js_1.registerInternalHook)("command:new", specificHandler);
                        event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
                        return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(event)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(generalHandler).toHaveBeenCalledWith(event);
                        (0, vitest_1.expect)(specificHandler).toHaveBeenCalledWith(event);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should handle async handlers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var handler, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handler = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        (0, internal_hooks_js_1.registerInternalHook)("command:new", handler);
                        event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
                        return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(event)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(handler).toHaveBeenCalledWith(event);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should catch and log errors from handlers", function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleError, errorHandler, successHandler, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleError = vitest_1.vi.spyOn(console, "error").mockImplementation(function () { });
                        errorHandler = vitest_1.vi.fn(function () {
                            throw new Error("Handler failed");
                        });
                        successHandler = vitest_1.vi.fn();
                        (0, internal_hooks_js_1.registerInternalHook)("command:new", errorHandler);
                        (0, internal_hooks_js_1.registerInternalHook)("command:new", successHandler);
                        event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
                        return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(event)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(errorHandler).toHaveBeenCalled();
                        (0, vitest_1.expect)(successHandler).toHaveBeenCalled();
                        (0, vitest_1.expect)(consoleError).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Hook error"), vitest_1.expect.stringContaining("Handler failed"));
                        consoleError.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should not throw if no handlers are registered", function () { return __awaiter(void 0, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
                        return [4 /*yield*/, (0, vitest_1.expect)((0, internal_hooks_js_1.triggerInternalHook)(event)).resolves.not.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("createInternalHookEvent", function () {
        (0, vitest_1.it)("should create a properly formatted event", function () {
            var event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session", {
                foo: "bar",
            });
            (0, vitest_1.expect)(event.type).toBe("command");
            (0, vitest_1.expect)(event.action).toBe("new");
            (0, vitest_1.expect)(event.sessionKey).toBe("test-session");
            (0, vitest_1.expect)(event.context).toEqual({ foo: "bar" });
            (0, vitest_1.expect)(event.timestamp).toBeInstanceOf(Date);
        });
        (0, vitest_1.it)("should use empty context if not provided", function () {
            var event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
            (0, vitest_1.expect)(event.context).toEqual({});
        });
    });
    (0, vitest_1.describe)("isAgentBootstrapEvent", function () {
        (0, vitest_1.it)("returns true for agent:bootstrap events with expected context", function () {
            var context = {
                workspaceDir: "/tmp",
                bootstrapFiles: [],
            };
            var event = (0, internal_hooks_js_1.createInternalHookEvent)("agent", "bootstrap", "test-session", context);
            (0, vitest_1.expect)((0, internal_hooks_js_1.isAgentBootstrapEvent)(event)).toBe(true);
        });
        (0, vitest_1.it)("returns false for non-bootstrap events", function () {
            var event = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "test-session");
            (0, vitest_1.expect)((0, internal_hooks_js_1.isAgentBootstrapEvent)(event)).toBe(false);
        });
    });
    (0, vitest_1.describe)("getRegisteredEventKeys", function () {
        (0, vitest_1.it)("should return all registered event keys", function () {
            (0, internal_hooks_js_1.registerInternalHook)("command:new", vitest_1.vi.fn());
            (0, internal_hooks_js_1.registerInternalHook)("command:stop", vitest_1.vi.fn());
            (0, internal_hooks_js_1.registerInternalHook)("session:start", vitest_1.vi.fn());
            var keys = (0, internal_hooks_js_1.getRegisteredEventKeys)();
            (0, vitest_1.expect)(keys).toContain("command:new");
            (0, vitest_1.expect)(keys).toContain("command:stop");
            (0, vitest_1.expect)(keys).toContain("session:start");
        });
        (0, vitest_1.it)("should return empty array when no handlers are registered", function () {
            var keys = (0, internal_hooks_js_1.getRegisteredEventKeys)();
            (0, vitest_1.expect)(keys).toEqual([]);
        });
    });
    (0, vitest_1.describe)("clearInternalHooks", function () {
        (0, vitest_1.it)("should remove all registered handlers", function () {
            (0, internal_hooks_js_1.registerInternalHook)("command:new", vitest_1.vi.fn());
            (0, internal_hooks_js_1.registerInternalHook)("command:stop", vitest_1.vi.fn());
            (0, internal_hooks_js_1.clearInternalHooks)();
            var keys = (0, internal_hooks_js_1.getRegisteredEventKeys)();
            (0, vitest_1.expect)(keys).toEqual([]);
        });
    });
    (0, vitest_1.describe)("integration", function () {
        (0, vitest_1.it)("should handle a complete hook lifecycle", function () { return __awaiter(void 0, void 0, void 0, function () {
            var results, handler, event1, event2, event3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        handler = vitest_1.vi.fn(function (event) {
                            results.push(event);
                        });
                        // Register
                        (0, internal_hooks_js_1.registerInternalHook)("command:new", handler);
                        event1 = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "session-1");
                        return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(event1)];
                    case 1:
                        _a.sent();
                        event2 = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "session-2");
                        return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(event2)];
                    case 2:
                        _a.sent();
                        // Verify
                        (0, vitest_1.expect)(results).toHaveLength(2);
                        (0, vitest_1.expect)(results[0].sessionKey).toBe("session-1");
                        (0, vitest_1.expect)(results[1].sessionKey).toBe("session-2");
                        // Unregister
                        (0, internal_hooks_js_1.unregisterInternalHook)("command:new", handler);
                        event3 = (0, internal_hooks_js_1.createInternalHookEvent)("command", "new", "session-3");
                        return [4 /*yield*/, (0, internal_hooks_js_1.triggerInternalHook)(event3)];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(results).toHaveLength(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
