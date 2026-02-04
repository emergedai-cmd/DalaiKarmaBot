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
var mocks = vitest_1.vi.hoisted(function () { return ({
    resolvePreferredNodePath: vitest_1.vi.fn(),
    resolveGatewayProgramArguments: vitest_1.vi.fn(),
    resolveSystemNodeInfo: vitest_1.vi.fn(),
    renderSystemNodeWarning: vitest_1.vi.fn(),
    buildServiceEnvironment: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../daemon/runtime-paths.js", function () { return ({
    resolvePreferredNodePath: mocks.resolvePreferredNodePath,
    resolveSystemNodeInfo: mocks.resolveSystemNodeInfo,
    renderSystemNodeWarning: mocks.renderSystemNodeWarning,
}); });
vitest_1.vi.mock("../daemon/program-args.js", function () { return ({
    resolveGatewayProgramArguments: mocks.resolveGatewayProgramArguments,
}); });
vitest_1.vi.mock("../daemon/service-env.js", function () { return ({
    buildServiceEnvironment: mocks.buildServiceEnvironment,
}); });
var daemon_install_helpers_js_1 = require("./daemon-install-helpers.js");
(0, vitest_1.afterEach)(function () {
    vitest_1.vi.resetAllMocks();
});
(0, vitest_1.describe)("resolveGatewayDevMode", function () {
    (0, vitest_1.it)("detects dev mode for src ts entrypoints", function () {
        (0, vitest_1.expect)((0, daemon_install_helpers_js_1.resolveGatewayDevMode)(["node", "/Users/me/openclaw/src/cli/index.ts"])).toBe(true);
        (0, vitest_1.expect)((0, daemon_install_helpers_js_1.resolveGatewayDevMode)(["node", "C:\\Users\\me\\openclaw\\src\\cli\\index.ts"])).toBe(true);
        (0, vitest_1.expect)((0, daemon_install_helpers_js_1.resolveGatewayDevMode)(["node", "/Users/me/openclaw/dist/cli/index.js"])).toBe(false);
    });
});
(0, vitest_1.describe)("buildGatewayInstallPlan", function () {
    (0, vitest_1.it)("uses provided nodePath and returns plan", function () { return __awaiter(void 0, void 0, void 0, function () {
        var plan;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.resolvePreferredNodePath.mockResolvedValue("/opt/node");
                    mocks.resolveGatewayProgramArguments.mockResolvedValue({
                        programArguments: ["node", "gateway"],
                        workingDirectory: "/Users/me",
                    });
                    mocks.resolveSystemNodeInfo.mockResolvedValue({
                        path: "/opt/node",
                        version: "22.0.0",
                        supported: true,
                    });
                    mocks.renderSystemNodeWarning.mockReturnValue(undefined);
                    mocks.buildServiceEnvironment.mockReturnValue({ OPENCLAW_PORT: "3000" });
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: {},
                            port: 3000,
                            runtime: "node",
                            nodePath: "/custom/node",
                        })];
                case 1:
                    plan = _a.sent();
                    (0, vitest_1.expect)(plan.programArguments).toEqual(["node", "gateway"]);
                    (0, vitest_1.expect)(plan.workingDirectory).toBe("/Users/me");
                    (0, vitest_1.expect)(plan.environment).toEqual({ OPENCLAW_PORT: "3000" });
                    (0, vitest_1.expect)(mocks.resolvePreferredNodePath).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("emits warnings when renderSystemNodeWarning returns one", function () { return __awaiter(void 0, void 0, void 0, function () {
        var warn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    warn = vitest_1.vi.fn();
                    mocks.resolvePreferredNodePath.mockResolvedValue("/opt/node");
                    mocks.resolveGatewayProgramArguments.mockResolvedValue({
                        programArguments: ["node", "gateway"],
                        workingDirectory: undefined,
                    });
                    mocks.resolveSystemNodeInfo.mockResolvedValue({
                        path: "/opt/node",
                        version: "18.0.0",
                        supported: false,
                    });
                    mocks.renderSystemNodeWarning.mockReturnValue("Node too old");
                    mocks.buildServiceEnvironment.mockReturnValue({});
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: {},
                            port: 3000,
                            runtime: "node",
                            warn: warn,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(warn).toHaveBeenCalledWith("Node too old", "Gateway runtime");
                    (0, vitest_1.expect)(mocks.resolvePreferredNodePath).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("merges config env vars into the environment", function () { return __awaiter(void 0, void 0, void 0, function () {
        var plan;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.resolvePreferredNodePath.mockResolvedValue("/opt/node");
                    mocks.resolveGatewayProgramArguments.mockResolvedValue({
                        programArguments: ["node", "gateway"],
                        workingDirectory: "/Users/me",
                    });
                    mocks.resolveSystemNodeInfo.mockResolvedValue({
                        path: "/opt/node",
                        version: "22.0.0",
                        supported: true,
                    });
                    mocks.buildServiceEnvironment.mockReturnValue({
                        OPENCLAW_PORT: "3000",
                        HOME: "/Users/me",
                    });
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: {},
                            port: 3000,
                            runtime: "node",
                            config: {
                                env: {
                                    vars: {
                                        GOOGLE_API_KEY: "test-key",
                                    },
                                    CUSTOM_VAR: "custom-value",
                                },
                            },
                        })];
                case 1:
                    plan = _a.sent();
                    // Config env vars should be present
                    (0, vitest_1.expect)(plan.environment.GOOGLE_API_KEY).toBe("test-key");
                    (0, vitest_1.expect)(plan.environment.CUSTOM_VAR).toBe("custom-value");
                    // Service environment vars should take precedence
                    (0, vitest_1.expect)(plan.environment.OPENCLAW_PORT).toBe("3000");
                    (0, vitest_1.expect)(plan.environment.HOME).toBe("/Users/me");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not include empty config env values", function () { return __awaiter(void 0, void 0, void 0, function () {
        var plan;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.resolvePreferredNodePath.mockResolvedValue("/opt/node");
                    mocks.resolveGatewayProgramArguments.mockResolvedValue({
                        programArguments: ["node", "gateway"],
                        workingDirectory: "/Users/me",
                    });
                    mocks.resolveSystemNodeInfo.mockResolvedValue({
                        path: "/opt/node",
                        version: "22.0.0",
                        supported: true,
                    });
                    mocks.buildServiceEnvironment.mockReturnValue({ OPENCLAW_PORT: "3000" });
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: {},
                            port: 3000,
                            runtime: "node",
                            config: {
                                env: {
                                    vars: {
                                        VALID_KEY: "valid",
                                        EMPTY_KEY: "",
                                    },
                                },
                            },
                        })];
                case 1:
                    plan = _a.sent();
                    (0, vitest_1.expect)(plan.environment.VALID_KEY).toBe("valid");
                    (0, vitest_1.expect)(plan.environment.EMPTY_KEY).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("drops whitespace-only config env values", function () { return __awaiter(void 0, void 0, void 0, function () {
        var plan;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.resolvePreferredNodePath.mockResolvedValue("/opt/node");
                    mocks.resolveGatewayProgramArguments.mockResolvedValue({
                        programArguments: ["node", "gateway"],
                        workingDirectory: "/Users/me",
                    });
                    mocks.resolveSystemNodeInfo.mockResolvedValue({
                        path: "/opt/node",
                        version: "22.0.0",
                        supported: true,
                    });
                    mocks.buildServiceEnvironment.mockReturnValue({});
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: {},
                            port: 3000,
                            runtime: "node",
                            config: {
                                env: {
                                    vars: {
                                        VALID_KEY: "valid",
                                    },
                                    TRIMMED_KEY: "  ",
                                },
                            },
                        })];
                case 1:
                    plan = _a.sent();
                    (0, vitest_1.expect)(plan.environment.VALID_KEY).toBe("valid");
                    (0, vitest_1.expect)(plan.environment.TRIMMED_KEY).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps service env values over config env vars", function () { return __awaiter(void 0, void 0, void 0, function () {
        var plan;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.resolvePreferredNodePath.mockResolvedValue("/opt/node");
                    mocks.resolveGatewayProgramArguments.mockResolvedValue({
                        programArguments: ["node", "gateway"],
                        workingDirectory: "/Users/me",
                    });
                    mocks.resolveSystemNodeInfo.mockResolvedValue({
                        path: "/opt/node",
                        version: "22.0.0",
                        supported: true,
                    });
                    mocks.buildServiceEnvironment.mockReturnValue({
                        HOME: "/Users/service",
                        OPENCLAW_PORT: "3000",
                    });
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: {},
                            port: 3000,
                            runtime: "node",
                            config: {
                                env: {
                                    HOME: "/Users/config",
                                    vars: {
                                        OPENCLAW_PORT: "9999",
                                    },
                                },
                            },
                        })];
                case 1:
                    plan = _a.sent();
                    (0, vitest_1.expect)(plan.environment.HOME).toBe("/Users/service");
                    (0, vitest_1.expect)(plan.environment.OPENCLAW_PORT).toBe("3000");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("gatewayInstallErrorHint", function () {
    (0, vitest_1.it)("returns platform-specific hints", function () {
        (0, vitest_1.expect)((0, daemon_install_helpers_js_1.gatewayInstallErrorHint)("win32")).toContain("Run as administrator");
        (0, vitest_1.expect)((0, daemon_install_helpers_js_1.gatewayInstallErrorHint)("linux")).toMatch(/(?:openclaw|openclaw)( --profile isolated)? gateway install/);
    });
});
