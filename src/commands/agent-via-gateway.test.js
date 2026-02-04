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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: vitest_1.vi.fn(),
    randomIdempotencyKey: function () { return "idem-1"; },
}); });
vitest_1.vi.mock("./agent.js", function () { return ({
    agentCommand: vitest_1.vi.fn(),
}); });
var configModule = require("../config/config.js");
var call_js_1 = require("../gateway/call.js");
var agent_via_gateway_js_1 = require("./agent-via-gateway.js");
var agent_js_1 = require("./agent.js");
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(),
};
var configSpy = vitest_1.vi.spyOn(configModule, "loadConfig");
function mockConfig(storePath, overrides) {
    var _a;
    configSpy.mockReturnValue({
        agents: {
            defaults: __assign({ timeoutSeconds: 600 }, (_a = overrides === null || overrides === void 0 ? void 0 : overrides.agents) === null || _a === void 0 ? void 0 : _a.defaults),
        },
        session: __assign({ store: storePath, mainKey: "main" }, overrides === null || overrides === void 0 ? void 0 : overrides.session),
        gateway: overrides === null || overrides === void 0 ? void 0 : overrides.gateway,
    });
}
(0, vitest_1.beforeEach)(function () {
    vitest_1.vi.clearAllMocks();
});
(0, vitest_1.describe)("agentCliCommand", function () {
    (0, vitest_1.it)("uses gateway by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-cli-"));
                    store = node_path_1.default.join(dir, "sessions.json");
                    mockConfig(store);
                    vitest_1.vi.mocked(call_js_1.callGateway).mockResolvedValue({
                        runId: "idem-1",
                        status: "ok",
                        result: {
                            payloads: [{ text: "hello" }],
                            meta: { stub: true },
                        },
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, agent_via_gateway_js_1.agentCliCommand)({ message: "hi", to: "+1555" }, runtime)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(call_js_1.callGateway).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(agent_js_1.agentCommand).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("hello");
                    return [3 /*break*/, 4];
                case 3:
                    node_fs_1.default.rmSync(dir, { recursive: true, force: true });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to embedded agent when gateway fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-cli-"));
                    store = node_path_1.default.join(dir, "sessions.json");
                    mockConfig(store);
                    vitest_1.vi.mocked(call_js_1.callGateway).mockRejectedValue(new Error("gateway not connected"));
                    vitest_1.vi.mocked(agent_js_1.agentCommand).mockImplementationOnce(function (_opts, rt) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            (_a = rt.log) === null || _a === void 0 ? void 0 : _a.call(rt, "local");
                            return [2 /*return*/, { payloads: [{ text: "local" }], meta: { stub: true } }];
                        });
                    }); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, agent_via_gateway_js_1.agentCliCommand)({ message: "hi", to: "+1555" }, runtime)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(call_js_1.callGateway).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(agent_js_1.agentCommand).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("local");
                    return [3 /*break*/, 4];
                case 3:
                    node_fs_1.default.rmSync(dir, { recursive: true, force: true });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips gateway when --local is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-agent-cli-"));
                    store = node_path_1.default.join(dir, "sessions.json");
                    mockConfig(store);
                    vitest_1.vi.mocked(agent_js_1.agentCommand).mockImplementationOnce(function (_opts, rt) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            (_a = rt.log) === null || _a === void 0 ? void 0 : _a.call(rt, "local");
                            return [2 /*return*/, { payloads: [{ text: "local" }], meta: { stub: true } }];
                        });
                    }); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, agent_via_gateway_js_1.agentCliCommand)({
                            message: "hi",
                            to: "+1555",
                            local: true,
                        }, runtime)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(call_js_1.callGateway).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(agent_js_1.agentCommand).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("local");
                    return [3 /*break*/, 4];
                case 3:
                    node_fs_1.default.rmSync(dir, { recursive: true, force: true });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
