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
var exec_approval_manager_js_1 = require("../exec-approval-manager.js");
var index_js_1 = require("../protocol/index.js");
var exec_approval_js_1 = require("./exec-approval.js");
var noop = function () { };
(0, vitest_1.describe)("exec approval handlers", function () {
    (0, vitest_1.describe)("ExecApprovalRequestParams validation", function () {
        (0, vitest_1.it)("accepts request with resolvedPath omitted", function () {
            var params = {
                command: "echo hi",
                cwd: "/tmp",
                host: "node",
            };
            (0, vitest_1.expect)((0, index_js_1.validateExecApprovalRequestParams)(params)).toBe(true);
        });
        (0, vitest_1.it)("accepts request with resolvedPath as string", function () {
            var params = {
                command: "echo hi",
                cwd: "/tmp",
                host: "node",
                resolvedPath: "/usr/bin/echo",
            };
            (0, vitest_1.expect)((0, index_js_1.validateExecApprovalRequestParams)(params)).toBe(true);
        });
        (0, vitest_1.it)("accepts request with resolvedPath as undefined", function () {
            var params = {
                command: "echo hi",
                cwd: "/tmp",
                host: "node",
                resolvedPath: undefined,
            };
            (0, vitest_1.expect)((0, index_js_1.validateExecApprovalRequestParams)(params)).toBe(true);
        });
        // Fixed: null is now accepted (Type.Union([Type.String(), Type.Null()]))
        // This matches the calling code in bash-tools.exec.ts which passes null.
        (0, vitest_1.it)("accepts request with resolvedPath as null", function () {
            var params = {
                command: "echo hi",
                cwd: "/tmp",
                host: "node",
                resolvedPath: null,
            };
            (0, vitest_1.expect)((0, index_js_1.validateExecApprovalRequestParams)(params)).toBe(true);
        });
    });
    (0, vitest_1.it)("broadcasts request + resolve", function () { return __awaiter(void 0, void 0, void 0, function () {
        var manager, handlers, broadcasts, respond, context, requestPromise, requested, id, resolveRespond;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    manager = new exec_approval_manager_js_1.ExecApprovalManager();
                    handlers = (0, exec_approval_js_1.createExecApprovalHandlers)(manager);
                    broadcasts = [];
                    respond = vitest_1.vi.fn();
                    context = {
                        broadcast: function (event, payload) {
                            broadcasts.push({ event: event, payload: payload });
                        },
                    };
                    requestPromise = handlers["exec.approval.request"]({
                        params: {
                            command: "echo ok",
                            cwd: "/tmp",
                            host: "node",
                            timeoutMs: 2000,
                        },
                        respond: respond,
                        context: context,
                        client: null,
                        req: { id: "req-1", type: "req", method: "exec.approval.request" },
                        isWebchatConnect: noop,
                    });
                    requested = broadcasts.find(function (entry) { return entry.event === "exec.approval.requested"; });
                    (0, vitest_1.expect)(requested).toBeTruthy();
                    id = (_b = (_a = requested === null || requested === void 0 ? void 0 : requested.payload) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
                    (0, vitest_1.expect)(id).not.toBe("");
                    resolveRespond = vitest_1.vi.fn();
                    return [4 /*yield*/, handlers["exec.approval.resolve"]({
                            params: { id: id, decision: "allow-once" },
                            respond: resolveRespond,
                            context: context,
                            client: { connect: { client: { id: "cli", displayName: "CLI" } } },
                            req: { id: "req-2", type: "req", method: "exec.approval.resolve" },
                            isWebchatConnect: noop,
                        })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, requestPromise];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(resolveRespond).toHaveBeenCalledWith(true, { ok: true }, undefined);
                    (0, vitest_1.expect)(respond).toHaveBeenCalledWith(true, vitest_1.expect.objectContaining({ id: id, decision: "allow-once" }), undefined);
                    (0, vitest_1.expect)(broadcasts.some(function (entry) { return entry.event === "exec.approval.resolved"; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts resolve during broadcast", function () { return __awaiter(void 0, void 0, void 0, function () {
        var manager, handlers, respond, resolveRespond, resolveContext, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manager = new exec_approval_manager_js_1.ExecApprovalManager();
                    handlers = (0, exec_approval_js_1.createExecApprovalHandlers)(manager);
                    respond = vitest_1.vi.fn();
                    resolveRespond = vitest_1.vi.fn();
                    resolveContext = {
                        broadcast: function () { },
                    };
                    context = {
                        broadcast: function (event, payload) {
                            var _a;
                            if (event !== "exec.approval.requested") {
                                return;
                            }
                            var id = (_a = payload === null || payload === void 0 ? void 0 : payload.id) !== null && _a !== void 0 ? _a : "";
                            void handlers["exec.approval.resolve"]({
                                params: { id: id, decision: "allow-once" },
                                respond: resolveRespond,
                                context: resolveContext,
                                client: { connect: { client: { id: "cli", displayName: "CLI" } } },
                                req: { id: "req-2", type: "req", method: "exec.approval.resolve" },
                                isWebchatConnect: noop,
                            });
                        },
                    };
                    return [4 /*yield*/, handlers["exec.approval.request"]({
                            params: {
                                command: "echo ok",
                                cwd: "/tmp",
                                host: "node",
                                timeoutMs: 2000,
                            },
                            respond: respond,
                            context: context,
                            client: null,
                            req: { id: "req-1", type: "req", method: "exec.approval.request" },
                            isWebchatConnect: noop,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(resolveRespond).toHaveBeenCalledWith(true, { ok: true }, undefined);
                    (0, vitest_1.expect)(respond).toHaveBeenCalledWith(true, vitest_1.expect.objectContaining({ decision: "allow-once" }), undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts explicit approval ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        var manager, handlers, broadcasts, respond, context, requestPromise, requested, id, resolveRespond;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    manager = new exec_approval_manager_js_1.ExecApprovalManager();
                    handlers = (0, exec_approval_js_1.createExecApprovalHandlers)(manager);
                    broadcasts = [];
                    respond = vitest_1.vi.fn();
                    context = {
                        broadcast: function (event, payload) {
                            broadcasts.push({ event: event, payload: payload });
                        },
                    };
                    requestPromise = handlers["exec.approval.request"]({
                        params: {
                            id: "approval-123",
                            command: "echo ok",
                            cwd: "/tmp",
                            host: "gateway",
                            timeoutMs: 2000,
                        },
                        respond: respond,
                        context: context,
                        client: null,
                        req: { id: "req-1", type: "req", method: "exec.approval.request" },
                        isWebchatConnect: noop,
                    });
                    requested = broadcasts.find(function (entry) { return entry.event === "exec.approval.requested"; });
                    id = (_b = (_a = requested === null || requested === void 0 ? void 0 : requested.payload) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
                    (0, vitest_1.expect)(id).toBe("approval-123");
                    resolveRespond = vitest_1.vi.fn();
                    return [4 /*yield*/, handlers["exec.approval.resolve"]({
                            params: { id: id, decision: "allow-once" },
                            respond: resolveRespond,
                            context: context,
                            client: { connect: { client: { id: "cli", displayName: "CLI" } } },
                            req: { id: "req-2", type: "req", method: "exec.approval.resolve" },
                            isWebchatConnect: noop,
                        })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, requestPromise];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(respond).toHaveBeenCalledWith(true, vitest_1.expect.objectContaining({ id: "approval-123", decision: "allow-once" }), undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects duplicate approval ids", function () { return __awaiter(void 0, void 0, void 0, function () {
        var manager, handlers, respondA, respondB, broadcasts, context, requestPromise, requested, id, resolveRespond;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    manager = new exec_approval_manager_js_1.ExecApprovalManager();
                    handlers = (0, exec_approval_js_1.createExecApprovalHandlers)(manager);
                    respondA = vitest_1.vi.fn();
                    respondB = vitest_1.vi.fn();
                    broadcasts = [];
                    context = {
                        broadcast: function (event, payload) {
                            broadcasts.push({ event: event, payload: payload });
                        },
                    };
                    requestPromise = handlers["exec.approval.request"]({
                        params: {
                            id: "dup-1",
                            command: "echo ok",
                        },
                        respond: respondA,
                        context: context,
                        client: null,
                        req: { id: "req-1", type: "req", method: "exec.approval.request" },
                        isWebchatConnect: noop,
                    });
                    return [4 /*yield*/, handlers["exec.approval.request"]({
                            params: {
                                id: "dup-1",
                                command: "echo again",
                            },
                            respond: respondB,
                            context: context,
                            client: null,
                            req: { id: "req-2", type: "req", method: "exec.approval.request" },
                            isWebchatConnect: noop,
                        })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(respondB).toHaveBeenCalledWith(false, undefined, vitest_1.expect.objectContaining({ message: "approval id already pending" }));
                    requested = broadcasts.find(function (entry) { return entry.event === "exec.approval.requested"; });
                    id = (_b = (_a = requested === null || requested === void 0 ? void 0 : requested.payload) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
                    resolveRespond = vitest_1.vi.fn();
                    return [4 /*yield*/, handlers["exec.approval.resolve"]({
                            params: { id: id, decision: "deny" },
                            respond: resolveRespond,
                            context: context,
                            client: { connect: { client: { id: "cli", displayName: "CLI" } } },
                            req: { id: "req-3", type: "req", method: "exec.approval.resolve" },
                            isWebchatConnect: noop,
                        })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, requestPromise];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
