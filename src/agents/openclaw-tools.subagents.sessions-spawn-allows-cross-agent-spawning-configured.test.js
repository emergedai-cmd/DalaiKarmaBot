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
var callGatewayMock = vitest_1.vi.fn();
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: function (opts) { return callGatewayMock(opts); },
}); });
var configOverride = {
    session: {
        mainKey: "main",
        scope: "per-sender",
    },
};
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: function () { return configOverride; }, resolveGatewayPort: function () { return 18789; } })];
        }
    });
}); });
require("./test-helpers/fast-core-tools.js");
var openclaw_tools_js_1 = require("./openclaw-tools.js");
var subagent_registry_js_1 = require("./subagent-registry.js");
(0, vitest_1.describe)("openclaw-tools: subagents", function () {
    (0, vitest_1.beforeEach)(function () {
        configOverride = {
            session: {
                mainKey: "main",
                scope: "per-sender",
            },
        };
    });
    (0, vitest_1.it)("sessions_spawn allows cross-agent spawning when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var childSessionKey, tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    configOverride = {
                        session: {
                            mainKey: "main",
                            scope: "per-sender",
                        },
                        agents: {
                            list: [
                                {
                                    id: "main",
                                    subagents: {
                                        allowAgents: ["beta"],
                                    },
                                },
                            ],
                        },
                    };
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request, params;
                        return __generator(this, function (_a) {
                            request = opts;
                            if (request.method === "agent") {
                                params = request.params;
                                childSessionKey = params === null || params === void 0 ? void 0 : params.sessionKey;
                                return [2 /*return*/, { runId: "run-1", status: "accepted", acceptedAt: 5000 }];
                            }
                            if (request.method === "agent.wait") {
                                return [2 /*return*/, { status: "timeout" }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "main",
                        agentChannel: "whatsapp",
                    }).find(function (candidate) { return candidate.name === "sessions_spawn"; });
                    if (!tool) {
                        throw new Error("missing sessions_spawn tool");
                    }
                    return [4 /*yield*/, tool.execute("call7", {
                            task: "do thing",
                            agentId: "beta",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "accepted",
                        runId: "run-1",
                    });
                    (0, vitest_1.expect)(childSessionKey === null || childSessionKey === void 0 ? void 0 : childSessionKey.startsWith("agent:beta:subagent:")).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sessions_spawn allows any agent when allowlist is *", function () { return __awaiter(void 0, void 0, void 0, function () {
        var childSessionKey, tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, subagent_registry_js_1.resetSubagentRegistryForTests)();
                    callGatewayMock.mockReset();
                    configOverride = {
                        session: {
                            mainKey: "main",
                            scope: "per-sender",
                        },
                        agents: {
                            list: [
                                {
                                    id: "main",
                                    subagents: {
                                        allowAgents: ["*"],
                                    },
                                },
                            ],
                        },
                    };
                    callGatewayMock.mockImplementation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        var request, params;
                        return __generator(this, function (_a) {
                            request = opts;
                            if (request.method === "agent") {
                                params = request.params;
                                childSessionKey = params === null || params === void 0 ? void 0 : params.sessionKey;
                                return [2 /*return*/, { runId: "run-1", status: "accepted", acceptedAt: 5100 }];
                            }
                            if (request.method === "agent.wait") {
                                return [2 /*return*/, { status: "timeout" }];
                            }
                            return [2 /*return*/, {}];
                        });
                    }); });
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "main",
                        agentChannel: "whatsapp",
                    }).find(function (candidate) { return candidate.name === "sessions_spawn"; });
                    if (!tool) {
                        throw new Error("missing sessions_spawn tool");
                    }
                    return [4 /*yield*/, tool.execute("call8", {
                            task: "do thing",
                            agentId: "beta",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "accepted",
                        runId: "run-1",
                    });
                    (0, vitest_1.expect)(childSessionKey === null || childSessionKey === void 0 ? void 0 : childSessionKey.startsWith("agent:beta:subagent:")).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
