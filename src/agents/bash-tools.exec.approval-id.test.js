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
vitest_1.vi.mock("./tools/gateway.js", function () { return ({
    callGatewayTool: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./tools/nodes-utils.js", function () { return ({
    listNodes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, [
                    { nodeId: "node-1", commands: ["system.run"], platform: "darwin" },
                ]];
        });
    }); }),
    resolveNodeIdFromList: vitest_1.vi.fn(function (nodes) { var _a; return (_a = nodes[0]) === null || _a === void 0 ? void 0 : _a.nodeId; }),
}); });
(0, vitest_1.describe)("exec approvals", function () {
    var previousHome;
    var previousUserProfile;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previousHome = process.env.HOME;
                    previousUserProfile = process.env.USERPROFILE;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-test-"))];
                case 1:
                    tempDir = _a.sent();
                    process.env.HOME = tempDir;
                    // Windows uses USERPROFILE for os.homedir()
                    process.env.USERPROFILE = tempDir;
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.resetAllMocks();
        if (previousHome === undefined) {
            delete process.env.HOME;
        }
        else {
            process.env.HOME = previousHome;
        }
        if (previousUserProfile === undefined) {
            delete process.env.USERPROFILE;
        }
        else {
            process.env.USERPROFILE = previousUserProfile;
        }
    });
    (0, vitest_1.it)("reuses approval id as the node runId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var callGatewayTool, invokeParams, resolveInvoke, invokeSeen, createExecTool, tool, result, approvalId, runId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./tools/gateway.js"); })];
                case 1:
                    callGatewayTool = (_b.sent()).callGatewayTool;
                    invokeSeen = new Promise(function (resolve) {
                        resolveInvoke = resolve;
                    });
                    vitest_1.vi.mocked(callGatewayTool).mockImplementation(function (method, _opts, params) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (method === "exec.approval.request") {
                                return [2 /*return*/, { decision: "allow-once" }];
                            }
                            if (method === "node.invoke") {
                                invokeParams = params;
                                resolveInvoke === null || resolveInvoke === void 0 ? void 0 : resolveInvoke();
                                return [2 /*return*/, { ok: true }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./bash-tools.exec.js"); })];
                case 2:
                    createExecTool = (_b.sent()).createExecTool;
                    tool = createExecTool({
                        host: "node",
                        ask: "always",
                        approvalRunningNoticeMs: 0,
                    });
                    return [4 /*yield*/, tool.execute("call1", { command: "ls -la" })];
                case 3:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.details.status).toBe("approval-pending");
                    approvalId = result.details.approvalId;
                    return [4 /*yield*/, invokeSeen];
                case 4:
                    _b.sent();
                    runId = (_a = invokeParams === null || invokeParams === void 0 ? void 0 : invokeParams.params) === null || _a === void 0 ? void 0 : _a.runId;
                    (0, vitest_1.expect)(runId).toBe(approvalId);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips approval when node allowlist is satisfied", function () { return __awaiter(void 0, void 0, void 0, function () {
        var callGatewayTool, tempDir, binDir, exeName, exePath, approvalsFile, calls, createExecTool, tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./tools/gateway.js"); })];
                case 1:
                    callGatewayTool = (_a.sent()).callGatewayTool;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-test-bin-"))];
                case 2:
                    tempDir = _a.sent();
                    binDir = node_path_1.default.join(tempDir, "bin");
                    return [4 /*yield*/, promises_1.default.mkdir(binDir, { recursive: true })];
                case 3:
                    _a.sent();
                    exeName = process.platform === "win32" ? "tool.cmd" : "tool";
                    exePath = node_path_1.default.join(binDir, exeName);
                    return [4 /*yield*/, promises_1.default.writeFile(exePath, "")];
                case 4:
                    _a.sent();
                    if (!(process.platform !== "win32")) return [3 /*break*/, 6];
                    return [4 /*yield*/, promises_1.default.chmod(exePath, 493)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    approvalsFile = {
                        version: 1,
                        defaults: { security: "allowlist", ask: "on-miss", askFallback: "deny" },
                        agents: {
                            main: {
                                allowlist: [{ pattern: exePath }],
                            },
                        },
                    };
                    calls = [];
                    vitest_1.vi.mocked(callGatewayTool).mockImplementation(function (method) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(method);
                            if (method === "exec.approvals.node.get") {
                                return [2 /*return*/, { file: approvalsFile }];
                            }
                            if (method === "node.invoke") {
                                return [2 /*return*/, { payload: { success: true, stdout: "ok" } }];
                            }
                            if (method === "exec.approval.request") {
                                return [2 /*return*/, { decision: "allow-once" }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./bash-tools.exec.js"); })];
                case 7:
                    createExecTool = (_a.sent()).createExecTool;
                    tool = createExecTool({
                        host: "node",
                        ask: "on-miss",
                        approvalRunningNoticeMs: 0,
                    });
                    return [4 /*yield*/, tool.execute("call2", {
                            command: "\"".concat(exePath, "\" --help"),
                        })];
                case 8:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details.status).toBe("completed");
                    (0, vitest_1.expect)(calls).toContain("exec.approvals.node.get");
                    (0, vitest_1.expect)(calls).toContain("node.invoke");
                    (0, vitest_1.expect)(calls).not.toContain("exec.approval.request");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors ask=off for elevated gateway exec without prompting", function () { return __awaiter(void 0, void 0, void 0, function () {
        var callGatewayTool, calls, createExecTool, tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./tools/gateway.js"); })];
                case 1:
                    callGatewayTool = (_a.sent()).callGatewayTool;
                    calls = [];
                    vitest_1.vi.mocked(callGatewayTool).mockImplementation(function (method) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(method);
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./bash-tools.exec.js"); })];
                case 2:
                    createExecTool = (_a.sent()).createExecTool;
                    tool = createExecTool({
                        ask: "off",
                        security: "full",
                        approvalRunningNoticeMs: 0,
                        elevated: { enabled: true, allowed: true, defaultLevel: "ask" },
                    });
                    return [4 /*yield*/, tool.execute("call3", { command: "echo ok", elevated: true })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details.status).toBe("completed");
                    (0, vitest_1.expect)(calls).not.toContain("exec.approval.request");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires approval for elevated ask when allowlist misses", function () { return __awaiter(void 0, void 0, void 0, function () {
        var callGatewayTool, calls, resolveApproval, approvalSeen, createExecTool, tool, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./tools/gateway.js"); })];
                case 1:
                    callGatewayTool = (_a.sent()).callGatewayTool;
                    calls = [];
                    approvalSeen = new Promise(function (resolve) {
                        resolveApproval = resolve;
                    });
                    vitest_1.vi.mocked(callGatewayTool).mockImplementation(function (method) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(method);
                            if (method === "exec.approval.request") {
                                resolveApproval === null || resolveApproval === void 0 ? void 0 : resolveApproval();
                                return [2 /*return*/, { decision: "deny" }];
                            }
                            return [2 /*return*/, { ok: true }];
                        });
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./bash-tools.exec.js"); })];
                case 2:
                    createExecTool = (_a.sent()).createExecTool;
                    tool = createExecTool({
                        ask: "on-miss",
                        security: "allowlist",
                        approvalRunningNoticeMs: 0,
                        elevated: { enabled: true, allowed: true, defaultLevel: "ask" },
                    });
                    return [4 /*yield*/, tool.execute("call4", { command: "echo ok", elevated: true })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details.status).toBe("approval-pending");
                    return [4 /*yield*/, approvalSeen];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(calls).toContain("exec.approval.request");
                    return [2 /*return*/];
            }
        });
    }); });
});
