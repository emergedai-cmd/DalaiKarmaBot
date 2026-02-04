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
var commander_1 = require("commander");
var vitest_1 = require("vitest");
var callGatewayFromCli = vitest_1.vi.fn(function (method, _opts, params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (method.endsWith(".get")) {
            return [2 /*return*/, {
                    path: "/tmp/exec-approvals.json",
                    exists: true,
                    hash: "hash-1",
                    file: { version: 1, agents: {} },
                }];
        }
        return [2 /*return*/, { method: method, params: params }];
    });
}); });
var runtimeLogs = [];
var runtimeErrors = [];
var defaultRuntime = {
    log: function (msg) { return runtimeLogs.push(msg); },
    error: function (msg) { return runtimeErrors.push(msg); },
    exit: function (code) {
        throw new Error("__exit__:".concat(code));
    },
};
var localSnapshot = {
    path: "/tmp/local-exec-approvals.json",
    exists: true,
    raw: "{}",
    hash: "hash-local",
    file: { version: 1, agents: {} },
};
vitest_1.vi.mock("./gateway-rpc.js", function () { return ({
    callGatewayFromCli: function (method, opts, params) {
        return callGatewayFromCli(method, opts, params);
    },
}); });
vitest_1.vi.mock("./nodes-cli/rpc.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./nodes-cli/rpc.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { resolveNodeId: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, "node-1"];
                        }); }); }) })];
        }
    });
}); });
vitest_1.vi.mock("../runtime.js", function () { return ({
    defaultRuntime: defaultRuntime,
}); });
vitest_1.vi.mock("../infra/exec-approvals.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../infra/exec-approvals.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { readExecApprovalsSnapshot: function () { return localSnapshot; }, saveExecApprovals: vitest_1.vi.fn() })];
        }
    });
}); });
(0, vitest_1.describe)("exec approvals CLI", function () {
    (0, vitest_1.it)("loads local approvals by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerExecApprovalsCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./exec-approvals-cli.js"); })];
                case 1:
                    registerExecApprovalsCli = (_a.sent()).registerExecApprovalsCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerExecApprovalsCli(program);
                    return [4 /*yield*/, program.parseAsync(["approvals", "get"], { from: "user" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(callGatewayFromCli).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(runtimeErrors).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("loads gateway approvals when --gateway is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerExecApprovalsCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./exec-approvals-cli.js"); })];
                case 1:
                    registerExecApprovalsCli = (_a.sent()).registerExecApprovalsCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerExecApprovalsCli(program);
                    return [4 /*yield*/, program.parseAsync(["approvals", "get", "--gateway"], { from: "user" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(callGatewayFromCli).toHaveBeenCalledWith("exec.approvals.get", vitest_1.expect.anything(), {});
                    (0, vitest_1.expect)(runtimeErrors).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("loads node approvals when --node is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerExecApprovalsCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./exec-approvals-cli.js"); })];
                case 1:
                    registerExecApprovalsCli = (_a.sent()).registerExecApprovalsCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerExecApprovalsCli(program);
                    return [4 /*yield*/, program.parseAsync(["approvals", "get", "--node", "macbook"], { from: "user" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(callGatewayFromCli).toHaveBeenCalledWith("exec.approvals.node.get", vitest_1.expect.anything(), {
                        nodeId: "node-1",
                    });
                    (0, vitest_1.expect)(runtimeErrors).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults allowlist add to wildcard agent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var execApprovals, saveExecApprovals, registerExecApprovalsCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtimeLogs.length = 0;
                    runtimeErrors.length = 0;
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../infra/exec-approvals.js"); })];
                case 1:
                    execApprovals = _a.sent();
                    saveExecApprovals = vitest_1.vi.mocked(execApprovals.saveExecApprovals);
                    saveExecApprovals.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./exec-approvals-cli.js"); })];
                case 2:
                    registerExecApprovalsCli = (_a.sent()).registerExecApprovalsCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerExecApprovalsCli(program);
                    return [4 /*yield*/, program.parseAsync(["approvals", "allowlist", "add", "/usr/bin/uname"], { from: "user" })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(callGatewayFromCli).not.toHaveBeenCalledWith("exec.approvals.set", vitest_1.expect.anything(), {});
                    (0, vitest_1.expect)(saveExecApprovals).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        agents: vitest_1.expect.objectContaining({
                            "*": vitest_1.expect.anything(),
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
