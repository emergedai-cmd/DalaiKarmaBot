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
require("./test-helpers/fast-core-tools.js");
var openclaw_tools_js_1 = require("./openclaw-tools.js");
vitest_1.vi.mock("./tools/gateway.js", function () { return ({
    callGatewayTool: vitest_1.vi.fn(function (method) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (method === "config.get") {
                return [2 /*return*/, { hash: "hash-1" }];
            }
            return [2 /*return*/, { ok: true }];
        });
    }); }),
}); });
(0, vitest_1.describe)("gateway tool", function () {
    (0, vitest_1.it)("schedules SIGUSR1 restart", function () { return __awaiter(void 0, void 0, void 0, function () {
        var kill, previousStateDir, previousProfile, stateDir, tool, result, sentinelPath, raw, parsed;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    kill = vitest_1.vi.spyOn(process, "kill").mockImplementation(function () { return true; });
                    previousStateDir = process.env.OPENCLAW_STATE_DIR;
                    previousProfile = process.env.OPENCLAW_PROFILE;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-test-"))];
                case 1:
                    stateDir = _c.sent();
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    process.env.OPENCLAW_PROFILE = "isolated";
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 6, 7]);
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        config: { commands: { restart: true } },
                    }).find(function (candidate) { return candidate.name === "gateway"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing gateway tool");
                    }
                    return [4 /*yield*/, tool.execute("call1", {
                            action: "restart",
                            delayMs: 0,
                        })];
                case 3:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        ok: true,
                        pid: process.pid,
                        signal: "SIGUSR1",
                        delayMs: 0,
                    });
                    sentinelPath = node_path_1.default.join(stateDir, "restart-sentinel.json");
                    return [4 /*yield*/, promises_1.default.readFile(sentinelPath, "utf-8")];
                case 4:
                    raw = _c.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_a = parsed.payload) === null || _a === void 0 ? void 0 : _a.kind).toBe("restart");
                    (0, vitest_1.expect)((_b = parsed.payload) === null || _b === void 0 ? void 0 : _b.doctorHint).toBe("Run: openclaw --profile isolated doctor --non-interactive");
                    (0, vitest_1.expect)(kill).not.toHaveBeenCalled();
                    return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                case 5:
                    _c.sent();
                    (0, vitest_1.expect)(kill).toHaveBeenCalledWith(process.pid, "SIGUSR1");
                    return [3 /*break*/, 7];
                case 6:
                    kill.mockRestore();
                    vitest_1.vi.useRealTimers();
                    if (previousStateDir === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previousStateDir;
                    }
                    if (previousProfile === undefined) {
                        delete process.env.OPENCLAW_PROFILE;
                    }
                    else {
                        process.env.OPENCLAW_PROFILE = previousProfile;
                    }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes config.apply through gateway call", function () { return __awaiter(void 0, void 0, void 0, function () {
        var callGatewayTool, tool, raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./tools/gateway.js"); })];
                case 1:
                    callGatewayTool = (_a.sent()).callGatewayTool;
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "agent:main:whatsapp:dm:+15555550123",
                    }).find(function (candidate) { return candidate.name === "gateway"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing gateway tool");
                    }
                    raw = '{\n  agents: { defaults: { workspace: "~/openclaw" } }\n}\n';
                    return [4 /*yield*/, tool.execute("call2", {
                            action: "config.apply",
                            raw: raw,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(callGatewayTool).toHaveBeenCalledWith("config.get", vitest_1.expect.any(Object), {});
                    (0, vitest_1.expect)(callGatewayTool).toHaveBeenCalledWith("config.apply", vitest_1.expect.any(Object), vitest_1.expect.objectContaining({
                        raw: raw.trim(),
                        baseHash: "hash-1",
                        sessionKey: "agent:main:whatsapp:dm:+15555550123",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes config.patch through gateway call", function () { return __awaiter(void 0, void 0, void 0, function () {
        var callGatewayTool, tool, raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./tools/gateway.js"); })];
                case 1:
                    callGatewayTool = (_a.sent()).callGatewayTool;
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "agent:main:whatsapp:dm:+15555550123",
                    }).find(function (candidate) { return candidate.name === "gateway"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing gateway tool");
                    }
                    raw = '{\n  channels: { telegram: { groups: { "*": { requireMention: false } } } }\n}\n';
                    return [4 /*yield*/, tool.execute("call4", {
                            action: "config.patch",
                            raw: raw,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(callGatewayTool).toHaveBeenCalledWith("config.get", vitest_1.expect.any(Object), {});
                    (0, vitest_1.expect)(callGatewayTool).toHaveBeenCalledWith("config.patch", vitest_1.expect.any(Object), vitest_1.expect.objectContaining({
                        raw: raw.trim(),
                        baseHash: "hash-1",
                        sessionKey: "agent:main:whatsapp:dm:+15555550123",
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes update.run through gateway call", function () { return __awaiter(void 0, void 0, void 0, function () {
        var callGatewayTool, tool, updateCall, opts, params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./tools/gateway.js"); })];
                case 1:
                    callGatewayTool = (_a.sent()).callGatewayTool;
                    tool = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: "agent:main:whatsapp:dm:+15555550123",
                    }).find(function (candidate) { return candidate.name === "gateway"; });
                    (0, vitest_1.expect)(tool).toBeDefined();
                    if (!tool) {
                        throw new Error("missing gateway tool");
                    }
                    return [4 /*yield*/, tool.execute("call3", {
                            action: "update.run",
                            note: "test update",
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(callGatewayTool).toHaveBeenCalledWith("update.run", vitest_1.expect.any(Object), vitest_1.expect.objectContaining({
                        note: "test update",
                        sessionKey: "agent:main:whatsapp:dm:+15555550123",
                    }));
                    updateCall = vitest_1.vi
                        .mocked(callGatewayTool)
                        .mock.calls.find(function (call) { return call[0] === "update.run"; });
                    (0, vitest_1.expect)(updateCall).toBeDefined();
                    if (updateCall) {
                        opts = updateCall[1], params = updateCall[2];
                        (0, vitest_1.expect)(opts).toMatchObject({ timeoutMs: 20 * 60000 });
                        (0, vitest_1.expect)(params).toMatchObject({ timeoutMs: 20 * 60000 });
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
