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
        if (method === "cron.status") {
            return [2 /*return*/, { enabled: true }];
        }
        return [2 /*return*/, { ok: true, params: params }];
    });
}); });
vitest_1.vi.mock("./gateway-rpc.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./gateway-rpc.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { callGatewayFromCli: function (method, opts, params, extra) {
                            return callGatewayFromCli(method, opts, params, extra);
                        } })];
        }
    });
}); });
vitest_1.vi.mock("../runtime.js", function () { return ({
    defaultRuntime: {
        log: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        exit: function (code) {
            throw new Error("__exit__:".concat(code));
        },
    },
}); });
(0, vitest_1.describe)("cron cli", function () {
    (0, vitest_1.it)("trims model and thinking on cron add", { timeout: 60000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, addCall, params;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_c.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync([
                            "cron",
                            "add",
                            "--name",
                            "Daily",
                            "--cron",
                            "* * * * *",
                            "--session",
                            "isolated",
                            "--message",
                            "hello",
                            "--model",
                            "  opus  ",
                            "--thinking",
                            "  low  ",
                        ], { from: "user" })];
                case 2:
                    _c.sent();
                    addCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.add"; });
                    params = addCall === null || addCall === void 0 ? void 0 : addCall[2];
                    (0, vitest_1.expect)((_a = params === null || params === void 0 ? void 0 : params.payload) === null || _a === void 0 ? void 0 : _a.model).toBe("opus");
                    (0, vitest_1.expect)((_b = params === null || params === void 0 ? void 0 : params.payload) === null || _b === void 0 ? void 0 : _b.thinking).toBe("low");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends agent id on cron add", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, addCall, params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_a.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync([
                            "cron",
                            "add",
                            "--name",
                            "Agent pinned",
                            "--cron",
                            "* * * * *",
                            "--session",
                            "isolated",
                            "--message",
                            "hi",
                            "--agent",
                            "ops",
                        ], { from: "user" })];
                case 2:
                    _a.sent();
                    addCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.add"; });
                    params = addCall === null || addCall === void 0 ? void 0 : addCall[2];
                    (0, vitest_1.expect)(params === null || params === void 0 ? void 0 : params.agentId).toBe("ops");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("omits empty model and thinking on cron edit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_e.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync(["cron", "edit", "job-1", "--message", "hello", "--model", "   ", "--thinking", "  "], { from: "user" })];
                case 2:
                    _e.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    (0, vitest_1.expect)((_b = (_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.model).toBeUndefined();
                    (0, vitest_1.expect)((_d = (_c = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.thinking).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("trims model and thinking on cron edit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_e.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync([
                            "cron",
                            "edit",
                            "job-1",
                            "--message",
                            "hello",
                            "--model",
                            "  opus  ",
                            "--thinking",
                            "  high  ",
                        ], { from: "user" })];
                case 2:
                    _e.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    (0, vitest_1.expect)((_b = (_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.model).toBe("opus");
                    (0, vitest_1.expect)((_d = (_c = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.thinking).toBe("high");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets and clears agent id on cron edit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch, clearCall, clearPatch;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_c.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync(["cron", "edit", "job-1", "--agent", " Ops ", "--message", "hello"], {
                            from: "user",
                        })];
                case 2:
                    _c.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    (0, vitest_1.expect)((_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.agentId).toBe("ops");
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, program.parseAsync(["cron", "edit", "job-2", "--clear-agent"], {
                            from: "user",
                        })];
                case 3:
                    _c.sent();
                    clearCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    clearPatch = clearCall === null || clearCall === void 0 ? void 0 : clearCall[2];
                    (0, vitest_1.expect)((_b = clearPatch === null || clearPatch === void 0 ? void 0 : clearPatch.patch) === null || _b === void 0 ? void 0 : _b.agentId).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows model/thinking updates without --message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_g.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync(["cron", "edit", "job-1", "--model", "opus", "--thinking", "low"], {
                            from: "user",
                        })];
                case 2:
                    _g.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    (0, vitest_1.expect)((_b = (_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.kind).toBe("agentTurn");
                    (0, vitest_1.expect)((_d = (_c = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.model).toBe("opus");
                    (0, vitest_1.expect)((_f = (_e = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _e === void 0 ? void 0 : _e.payload) === null || _f === void 0 ? void 0 : _f.thinking).toBe("low");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updates delivery settings without requiring --message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_l.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync(["cron", "edit", "job-1", "--deliver", "--channel", "telegram", "--to", "19098680"], { from: "user" })];
                case 2:
                    _l.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    (0, vitest_1.expect)((_b = (_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.kind).toBe("agentTurn");
                    (0, vitest_1.expect)((_d = (_c = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.deliver).toBe(true);
                    (0, vitest_1.expect)((_f = (_e = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _e === void 0 ? void 0 : _e.payload) === null || _f === void 0 ? void 0 : _f.channel).toBe("telegram");
                    (0, vitest_1.expect)((_h = (_g = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _g === void 0 ? void 0 : _g.payload) === null || _h === void 0 ? void 0 : _h.to).toBe("19098680");
                    (0, vitest_1.expect)((_k = (_j = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _j === void 0 ? void 0 : _j.payload) === null || _k === void 0 ? void 0 : _k.message).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("supports --no-deliver on cron edit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_e.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync(["cron", "edit", "job-1", "--no-deliver"], { from: "user" })];
                case 2:
                    _e.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    (0, vitest_1.expect)((_b = (_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.kind).toBe("agentTurn");
                    (0, vitest_1.expect)((_d = (_c = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.deliver).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not include undefined delivery fields when updating message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_g.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    // Update message without delivery flags - should NOT include undefined delivery fields
                    return [4 /*yield*/, program.parseAsync(["cron", "edit", "job-1", "--message", "Updated message"], {
                            from: "user",
                        })];
                case 2:
                    // Update message without delivery flags - should NOT include undefined delivery fields
                    _g.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    // Should include the new message
                    (0, vitest_1.expect)((_b = (_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.message).toBe("Updated message");
                    // Should NOT include delivery fields at all (to preserve existing values)
                    (0, vitest_1.expect)((_c = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _c === void 0 ? void 0 : _c.payload).not.toHaveProperty("deliver");
                    (0, vitest_1.expect)((_d = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _d === void 0 ? void 0 : _d.payload).not.toHaveProperty("channel");
                    (0, vitest_1.expect)((_e = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _e === void 0 ? void 0 : _e.payload).not.toHaveProperty("to");
                    (0, vitest_1.expect)((_f = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _f === void 0 ? void 0 : _f.payload).not.toHaveProperty("bestEffortDeliver");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes delivery fields when explicitly provided with message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_j.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    // Update message AND delivery - should include both
                    return [4 /*yield*/, program.parseAsync([
                            "cron",
                            "edit",
                            "job-1",
                            "--message",
                            "Updated message",
                            "--deliver",
                            "--channel",
                            "telegram",
                            "--to",
                            "19098680",
                        ], { from: "user" })];
                case 2:
                    // Update message AND delivery - should include both
                    _j.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    // Should include everything
                    (0, vitest_1.expect)((_b = (_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.message).toBe("Updated message");
                    (0, vitest_1.expect)((_d = (_c = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.deliver).toBe(true);
                    (0, vitest_1.expect)((_f = (_e = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _e === void 0 ? void 0 : _e.payload) === null || _f === void 0 ? void 0 : _f.channel).toBe("telegram");
                    (0, vitest_1.expect)((_h = (_g = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _g === void 0 ? void 0 : _g.payload) === null || _h === void 0 ? void 0 : _h.to).toBe("19098680");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes best-effort delivery when provided with message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_e.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync(["cron", "edit", "job-1", "--message", "Updated message", "--best-effort-deliver"], { from: "user" })];
                case 2:
                    _e.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    (0, vitest_1.expect)((_b = (_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.message).toBe("Updated message");
                    (0, vitest_1.expect)((_d = (_c = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.bestEffortDeliver).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes no-best-effort delivery when provided with message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerCronCli, program, updateCall, patch;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    callGatewayFromCli.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cron-cli.js"); })];
                case 1:
                    registerCronCli = (_e.sent()).registerCronCli;
                    program = new commander_1.Command();
                    program.exitOverride();
                    registerCronCli(program);
                    return [4 /*yield*/, program.parseAsync(["cron", "edit", "job-1", "--message", "Updated message", "--no-best-effort-deliver"], { from: "user" })];
                case 2:
                    _e.sent();
                    updateCall = callGatewayFromCli.mock.calls.find(function (call) { return call[0] === "cron.update"; });
                    patch = updateCall === null || updateCall === void 0 ? void 0 : updateCall[2];
                    (0, vitest_1.expect)((_b = (_a = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.message).toBe("Updated message");
                    (0, vitest_1.expect)((_d = (_c = patch === null || patch === void 0 ? void 0 : patch.patch) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.bestEffortDeliver).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
