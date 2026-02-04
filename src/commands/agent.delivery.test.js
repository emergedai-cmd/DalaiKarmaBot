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
var mocks = vitest_1.vi.hoisted(function () { return ({
    deliverOutboundPayloads: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }),
    getChannelPlugin: vitest_1.vi.fn(function () { return ({}); }),
    resolveOutboundTarget: vitest_1.vi.fn(function () { return ({ ok: true, to: "+15551234567" }); }),
}); });
vitest_1.vi.mock("../channels/plugins/index.js", function () { return ({
    getChannelPlugin: mocks.getChannelPlugin,
    normalizeChannelId: function (value) { return value; },
}); });
vitest_1.vi.mock("../infra/outbound/deliver.js", function () { return ({
    deliverOutboundPayloads: mocks.deliverOutboundPayloads,
}); });
vitest_1.vi.mock("../infra/outbound/targets.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../infra/outbound/targets.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { resolveOutboundTarget: mocks.resolveOutboundTarget })];
        }
    });
}); });
(0, vitest_1.describe)("deliverAgentCommandResult", function () {
    (0, vitest_1.beforeEach)(function () {
        mocks.deliverOutboundPayloads.mockClear();
        mocks.resolveOutboundTarget.mockClear();
    });
    (0, vitest_1.it)("prefers explicit accountId for outbound delivery", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, deps, runtime, sessionEntry, result, deliverAgentCommandResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    deps = {};
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                    };
                    sessionEntry = {
                        lastAccountId: "default",
                    };
                    result = {
                        payloads: [{ text: "hi" }],
                        meta: {},
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./agent/delivery.js"); })];
                case 1:
                    deliverAgentCommandResult = (_a.sent()).deliverAgentCommandResult;
                    return [4 /*yield*/, deliverAgentCommandResult({
                            cfg: cfg,
                            deps: deps,
                            runtime: runtime,
                            opts: {
                                message: "hello",
                                deliver: true,
                                channel: "whatsapp",
                                accountId: "kev",
                                to: "+15551234567",
                            },
                            sessionEntry: sessionEntry,
                            result: result,
                            payloads: result.payloads,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.deliverOutboundPayloads).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ accountId: "kev" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to session accountId for implicit delivery", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, deps, runtime, sessionEntry, result, deliverAgentCommandResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    deps = {};
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                    };
                    sessionEntry = {
                        lastAccountId: "legacy",
                        lastChannel: "whatsapp",
                    };
                    result = {
                        payloads: [{ text: "hi" }],
                        meta: {},
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./agent/delivery.js"); })];
                case 1:
                    deliverAgentCommandResult = (_a.sent()).deliverAgentCommandResult;
                    return [4 /*yield*/, deliverAgentCommandResult({
                            cfg: cfg,
                            deps: deps,
                            runtime: runtime,
                            opts: {
                                message: "hello",
                                deliver: true,
                                channel: "whatsapp",
                            },
                            sessionEntry: sessionEntry,
                            result: result,
                            payloads: result.payloads,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.deliverOutboundPayloads).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ accountId: "legacy" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not infer accountId for explicit delivery targets", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, deps, runtime, sessionEntry, result, deliverAgentCommandResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    deps = {};
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                    };
                    sessionEntry = {
                        lastAccountId: "legacy",
                    };
                    result = {
                        payloads: [{ text: "hi" }],
                        meta: {},
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./agent/delivery.js"); })];
                case 1:
                    deliverAgentCommandResult = (_a.sent()).deliverAgentCommandResult;
                    return [4 /*yield*/, deliverAgentCommandResult({
                            cfg: cfg,
                            deps: deps,
                            runtime: runtime,
                            opts: {
                                message: "hello",
                                deliver: true,
                                channel: "whatsapp",
                                to: "+15551234567",
                                deliveryTargetMode: "explicit",
                            },
                            sessionEntry: sessionEntry,
                            result: result,
                            payloads: result.payloads,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.resolveOutboundTarget).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ accountId: undefined, mode: "explicit" }));
                    (0, vitest_1.expect)(mocks.deliverOutboundPayloads).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ accountId: undefined }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips session accountId when channel differs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, deps, runtime, sessionEntry, result, deliverAgentCommandResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    deps = {};
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                    };
                    sessionEntry = {
                        lastAccountId: "legacy",
                        lastChannel: "telegram",
                    };
                    result = {
                        payloads: [{ text: "hi" }],
                        meta: {},
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./agent/delivery.js"); })];
                case 1:
                    deliverAgentCommandResult = (_a.sent()).deliverAgentCommandResult;
                    return [4 /*yield*/, deliverAgentCommandResult({
                            cfg: cfg,
                            deps: deps,
                            runtime: runtime,
                            opts: {
                                message: "hello",
                                deliver: true,
                                channel: "whatsapp",
                            },
                            sessionEntry: sessionEntry,
                            result: result,
                            payloads: result.payloads,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.resolveOutboundTarget).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ accountId: undefined, channel: "whatsapp" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses session last channel when none is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, deps, runtime, sessionEntry, result, deliverAgentCommandResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    deps = {};
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                    };
                    sessionEntry = {
                        lastChannel: "telegram",
                        lastTo: "123",
                    };
                    result = {
                        payloads: [{ text: "hi" }],
                        meta: {},
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./agent/delivery.js"); })];
                case 1:
                    deliverAgentCommandResult = (_a.sent()).deliverAgentCommandResult;
                    return [4 /*yield*/, deliverAgentCommandResult({
                            cfg: cfg,
                            deps: deps,
                            runtime: runtime,
                            opts: {
                                message: "hello",
                                deliver: true,
                            },
                            sessionEntry: sessionEntry,
                            result: result,
                            payloads: result.payloads,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.resolveOutboundTarget).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ channel: "telegram", to: "123" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses reply overrides for delivery routing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, deps, runtime, sessionEntry, result, deliverAgentCommandResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {};
                    deps = {};
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                    };
                    sessionEntry = {
                        lastChannel: "telegram",
                        lastTo: "123",
                        lastAccountId: "legacy",
                    };
                    result = {
                        payloads: [{ text: "hi" }],
                        meta: {},
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./agent/delivery.js"); })];
                case 1:
                    deliverAgentCommandResult = (_a.sent()).deliverAgentCommandResult;
                    return [4 /*yield*/, deliverAgentCommandResult({
                            cfg: cfg,
                            deps: deps,
                            runtime: runtime,
                            opts: {
                                message: "hello",
                                deliver: true,
                                to: "+15551234567",
                                replyTo: "#reports",
                                replyChannel: "slack",
                                replyAccountId: "ops",
                            },
                            sessionEntry: sessionEntry,
                            result: result,
                            payloads: result.payloads,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.resolveOutboundTarget).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ channel: "slack", to: "#reports", accountId: "ops" }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefixes nested agent outputs with context", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, deps, runtime, result, deliverAgentCommandResult, line;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {};
                    deps = {};
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                    };
                    result = {
                        payloads: [{ text: "ANNOUNCE_SKIP" }],
                        meta: {},
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./agent/delivery.js"); })];
                case 1:
                    deliverAgentCommandResult = (_b.sent()).deliverAgentCommandResult;
                    return [4 /*yield*/, deliverAgentCommandResult({
                            cfg: cfg,
                            deps: deps,
                            runtime: runtime,
                            opts: {
                                message: "hello",
                                deliver: false,
                                lane: "nested",
                                sessionKey: "agent:main:main",
                                runId: "run-announce",
                                messageChannel: "webchat",
                            },
                            sessionEntry: undefined,
                            result: result,
                            payloads: result.payloads,
                        })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(1);
                    line = String((_a = runtime.log.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]);
                    (0, vitest_1.expect)(line).toContain("[agent:nested]");
                    (0, vitest_1.expect)(line).toContain("session=agent:main:main");
                    (0, vitest_1.expect)(line).toContain("run=run-announce");
                    (0, vitest_1.expect)(line).toContain("channel=webchat");
                    (0, vitest_1.expect)(line).toContain("ANNOUNCE_SKIP");
                    return [2 /*return*/];
            }
        });
    }); });
});
