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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var ws_1 = require("ws");
var defaults_js_1 = require("../agents/defaults.js");
var test_helpers_js_1 = require("./test-helpers.js");
var sessionCleanupMocks = vitest_1.vi.hoisted(function () { return ({
    clearSessionQueues: vitest_1.vi.fn(function () { return ({ followupCleared: 0, laneCleared: 0, keys: [] }); }),
    stopSubagentsForRequester: vitest_1.vi.fn(function () { return ({ stopped: 0 }); }),
}); });
vitest_1.vi.mock("../auto-reply/reply/queue.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../auto-reply/reply/queue.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { clearSessionQueues: sessionCleanupMocks.clearSessionQueues })];
        }
    });
}); });
vitest_1.vi.mock("../auto-reply/reply/abort.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../auto-reply/reply/abort.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { stopSubagentsForRequester: sessionCleanupMocks.stopSubagentsForRequester })];
        }
    });
}); });
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var server;
var port = 0;
var previousToken;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                previousToken = process.env.OPENCLAW_GATEWAY_TOKEN;
                delete process.env.OPENCLAW_GATEWAY_TOKEN;
                return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
            case 1:
                port = _a.sent();
                return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(port)];
            case 2:
                server = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                if (previousToken === undefined) {
                    delete process.env.OPENCLAW_GATEWAY_TOKEN;
                }
                else {
                    process.env.OPENCLAW_GATEWAY_TOKEN = previousToken;
                }
                return [2 /*return*/];
        }
    });
}); });
var openClient = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var ws, hello;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ws = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws, opts)];
            case 2:
                hello = _a.sent();
                return [2 /*return*/, { ws: ws, hello: hello }];
        }
    });
}); };
(0, vitest_1.describe)("gateway server sessions", function () {
    (0, vitest_1.beforeEach)(function () {
        sessionCleanupMocks.clearSessionQueues.mockClear();
        sessionCleanupMocks.stopSubagentsForRequester.mockClear();
    });
    (0, vitest_1.test)("lists and patches session store via sessions.* RPC", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, storePath, now, recent, stale, _a, ws, hello, resolvedByKey, resolvedBySessionId, list1, main, active, limited, patched, sendPolicyPatched, labelPatched, labelPatchedDuplicate, list2, main2, subagent, clearedVerbose, list3, main3, listByLabel, resolvedByLabel, spawnedOnly, spawnedPatched, spawnedPatchedInvalidKey, modelPatched, compacted, compactedLines, filesAfterCompact, deleted, listAfterDelete, filesAfterDelete, reset, badThinking;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
        return __generator(this, function (_9) {
            switch (_9.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _9.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    now = Date.now();
                    recent = now - 30000;
                    stale = now - 15 * 60000;
                    test_helpers_js_1.testState.sessionStorePath = storePath;
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "sess-main.jsonl"), "".concat(Array.from({ length: 10 })
                            .map(function (_, idx) { return JSON.stringify({ role: "user", content: "line ".concat(idx) }); })
                            .join("\n"), "\n"), "utf-8")];
                case 2:
                    _9.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "sess-group.jsonl"), "".concat(JSON.stringify({ role: "user", content: "group line 0" }), "\n"), "utf-8")];
                case 3:
                    _9.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: "sess-main",
                                    updatedAt: recent,
                                    inputTokens: 10,
                                    outputTokens: 20,
                                    thinkingLevel: "low",
                                    verboseLevel: "on",
                                    lastChannel: "whatsapp",
                                    lastTo: "+1555",
                                    lastAccountId: "work",
                                },
                                "discord:group:dev": {
                                    sessionId: "sess-group",
                                    updatedAt: stale,
                                    totalTokens: 50,
                                },
                                "agent:main:subagent:one": {
                                    sessionId: "sess-subagent",
                                    updatedAt: stale,
                                    spawnedBy: "agent:main:main",
                                },
                                global: {
                                    sessionId: "sess-global",
                                    updatedAt: now - 10000,
                                },
                            },
                        })];
                case 4:
                    _9.sent();
                    return [4 /*yield*/, openClient()];
                case 5:
                    _a = _9.sent(), ws = _a.ws, hello = _a.hello;
                    (0, vitest_1.expect)((_b = hello.features) === null || _b === void 0 ? void 0 : _b.methods).toEqual(vitest_1.expect.arrayContaining([
                        "sessions.list",
                        "sessions.preview",
                        "sessions.patch",
                        "sessions.reset",
                        "sessions.delete",
                        "sessions.compact",
                    ]));
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.resolve", {
                            key: "main",
                        })];
                case 6:
                    resolvedByKey = _9.sent();
                    (0, vitest_1.expect)(resolvedByKey.ok).toBe(true);
                    (0, vitest_1.expect)((_c = resolvedByKey.payload) === null || _c === void 0 ? void 0 : _c.key).toBe("agent:main:main");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.resolve", {
                            sessionId: "sess-group",
                        })];
                case 7:
                    resolvedBySessionId = _9.sent();
                    (0, vitest_1.expect)(resolvedBySessionId.ok).toBe(true);
                    (0, vitest_1.expect)((_d = resolvedBySessionId.payload) === null || _d === void 0 ? void 0 : _d.key).toBe("agent:main:discord:group:dev");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", { includeGlobal: false, includeUnknown: false })];
                case 8:
                    list1 = _9.sent();
                    (0, vitest_1.expect)(list1.ok).toBe(true);
                    (0, vitest_1.expect)((_e = list1.payload) === null || _e === void 0 ? void 0 : _e.path).toBe(storePath);
                    (0, vitest_1.expect)((_f = list1.payload) === null || _f === void 0 ? void 0 : _f.sessions.some(function (s) { return s.key === "global"; })).toBe(false);
                    (0, vitest_1.expect)((_h = (_g = list1.payload) === null || _g === void 0 ? void 0 : _g.defaults) === null || _h === void 0 ? void 0 : _h.modelProvider).toBe(defaults_js_1.DEFAULT_PROVIDER);
                    main = (_j = list1.payload) === null || _j === void 0 ? void 0 : _j.sessions.find(function (s) { return s.key === "agent:main:main"; });
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.totalTokens).toBe(30);
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.thinkingLevel).toBe("low");
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.verboseLevel).toBe("on");
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.lastAccountId).toBe("work");
                    (0, vitest_1.expect)(main === null || main === void 0 ? void 0 : main.deliveryContext).toEqual({
                        channel: "whatsapp",
                        to: "+1555",
                        accountId: "work",
                    });
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", {
                            includeGlobal: false,
                            includeUnknown: false,
                            activeMinutes: 5,
                        })];
                case 9:
                    active = _9.sent();
                    (0, vitest_1.expect)(active.ok).toBe(true);
                    (0, vitest_1.expect)((_k = active.payload) === null || _k === void 0 ? void 0 : _k.sessions.map(function (s) { return s.key; })).toEqual(["agent:main:main"]);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", {
                            includeGlobal: true,
                            includeUnknown: false,
                            limit: 1,
                        })];
                case 10:
                    limited = _9.sent();
                    (0, vitest_1.expect)(limited.ok).toBe(true);
                    (0, vitest_1.expect)((_l = limited.payload) === null || _l === void 0 ? void 0 : _l.sessions).toHaveLength(1);
                    (0, vitest_1.expect)((_o = (_m = limited.payload) === null || _m === void 0 ? void 0 : _m.sessions[0]) === null || _o === void 0 ? void 0 : _o.key).toBe("global");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", {
                            key: "agent:main:main",
                            thinkingLevel: "medium",
                            verboseLevel: "off",
                        })];
                case 11:
                    patched = _9.sent();
                    (0, vitest_1.expect)(patched.ok).toBe(true);
                    (0, vitest_1.expect)((_p = patched.payload) === null || _p === void 0 ? void 0 : _p.ok).toBe(true);
                    (0, vitest_1.expect)((_q = patched.payload) === null || _q === void 0 ? void 0 : _q.key).toBe("agent:main:main");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", { key: "agent:main:main", sendPolicy: "deny" })];
                case 12:
                    sendPolicyPatched = _9.sent();
                    (0, vitest_1.expect)(sendPolicyPatched.ok).toBe(true);
                    (0, vitest_1.expect)((_r = sendPolicyPatched.payload) === null || _r === void 0 ? void 0 : _r.entry.sendPolicy).toBe("deny");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", {
                            key: "agent:main:subagent:one",
                            label: "Briefing",
                        })];
                case 13:
                    labelPatched = _9.sent();
                    (0, vitest_1.expect)(labelPatched.ok).toBe(true);
                    (0, vitest_1.expect)((_s = labelPatched.payload) === null || _s === void 0 ? void 0 : _s.entry.label).toBe("Briefing");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", {
                            key: "agent:main:discord:group:dev",
                            label: "Briefing",
                        })];
                case 14:
                    labelPatchedDuplicate = _9.sent();
                    (0, vitest_1.expect)(labelPatchedDuplicate.ok).toBe(false);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", {})];
                case 15:
                    list2 = _9.sent();
                    (0, vitest_1.expect)(list2.ok).toBe(true);
                    main2 = (_t = list2.payload) === null || _t === void 0 ? void 0 : _t.sessions.find(function (s) { return s.key === "agent:main:main"; });
                    (0, vitest_1.expect)(main2 === null || main2 === void 0 ? void 0 : main2.thinkingLevel).toBe("medium");
                    (0, vitest_1.expect)(main2 === null || main2 === void 0 ? void 0 : main2.verboseLevel).toBe("off");
                    (0, vitest_1.expect)(main2 === null || main2 === void 0 ? void 0 : main2.sendPolicy).toBe("deny");
                    subagent = (_u = list2.payload) === null || _u === void 0 ? void 0 : _u.sessions.find(function (s) { return s.key === "agent:main:subagent:one"; });
                    (0, vitest_1.expect)(subagent === null || subagent === void 0 ? void 0 : subagent.label).toBe("Briefing");
                    (0, vitest_1.expect)(subagent === null || subagent === void 0 ? void 0 : subagent.displayName).toBe("Briefing");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", {
                            key: "agent:main:main",
                            verboseLevel: null,
                        })];
                case 16:
                    clearedVerbose = _9.sent();
                    (0, vitest_1.expect)(clearedVerbose.ok).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", {})];
                case 17:
                    list3 = _9.sent();
                    (0, vitest_1.expect)(list3.ok).toBe(true);
                    main3 = (_v = list3.payload) === null || _v === void 0 ? void 0 : _v.sessions.find(function (s) { return s.key === "agent:main:main"; });
                    (0, vitest_1.expect)(main3 === null || main3 === void 0 ? void 0 : main3.verboseLevel).toBeUndefined();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", {
                            includeGlobal: false,
                            includeUnknown: false,
                            label: "Briefing",
                        })];
                case 18:
                    listByLabel = _9.sent();
                    (0, vitest_1.expect)(listByLabel.ok).toBe(true);
                    (0, vitest_1.expect)((_w = listByLabel.payload) === null || _w === void 0 ? void 0 : _w.sessions.map(function (s) { return s.key; })).toEqual(["agent:main:subagent:one"]);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.resolve", {
                            label: "Briefing",
                            agentId: "main",
                        })];
                case 19:
                    resolvedByLabel = _9.sent();
                    (0, vitest_1.expect)(resolvedByLabel.ok).toBe(true);
                    (0, vitest_1.expect)((_x = resolvedByLabel.payload) === null || _x === void 0 ? void 0 : _x.key).toBe("agent:main:subagent:one");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", {
                            includeGlobal: true,
                            includeUnknown: true,
                            spawnedBy: "agent:main:main",
                        })];
                case 20:
                    spawnedOnly = _9.sent();
                    (0, vitest_1.expect)(spawnedOnly.ok).toBe(true);
                    (0, vitest_1.expect)((_y = spawnedOnly.payload) === null || _y === void 0 ? void 0 : _y.sessions.map(function (s) { return s.key; })).toEqual(["agent:main:subagent:one"]);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", {
                            key: "agent:main:subagent:two",
                            spawnedBy: "agent:main:main",
                        })];
                case 21:
                    spawnedPatched = _9.sent();
                    (0, vitest_1.expect)(spawnedPatched.ok).toBe(true);
                    (0, vitest_1.expect)((_z = spawnedPatched.payload) === null || _z === void 0 ? void 0 : _z.entry.spawnedBy).toBe("agent:main:main");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", {
                            key: "agent:main:main",
                            spawnedBy: "agent:main:main",
                        })];
                case 22:
                    spawnedPatchedInvalidKey = _9.sent();
                    (0, vitest_1.expect)(spawnedPatchedInvalidKey.ok).toBe(false);
                    test_helpers_js_1.piSdkMock.enabled = true;
                    test_helpers_js_1.piSdkMock.models = [{ id: "gpt-test-a", name: "A", provider: "openai" }];
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", {
                            key: "agent:main:main",
                            model: "openai/gpt-test-a",
                        })];
                case 23:
                    modelPatched = _9.sent();
                    (0, vitest_1.expect)(modelPatched.ok).toBe(true);
                    (0, vitest_1.expect)((_0 = modelPatched.payload) === null || _0 === void 0 ? void 0 : _0.entry.modelOverride).toBe("gpt-test-a");
                    (0, vitest_1.expect)((_1 = modelPatched.payload) === null || _1 === void 0 ? void 0 : _1.entry.providerOverride).toBe("openai");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.compact", {
                            key: "agent:main:main",
                            maxLines: 3,
                        })];
                case 24:
                    compacted = _9.sent();
                    (0, vitest_1.expect)(compacted.ok).toBe(true);
                    (0, vitest_1.expect)((_2 = compacted.payload) === null || _2 === void 0 ? void 0 : _2.compacted).toBe(true);
                    return [4 /*yield*/, promises_1.default.readFile(node_path_1.default.join(dir, "sess-main.jsonl"), "utf-8")];
                case 25:
                    compactedLines = (_9.sent())
                        .split(/\r?\n/)
                        .filter(function (l) { return l.trim().length > 0; });
                    (0, vitest_1.expect)(compactedLines).toHaveLength(3);
                    return [4 /*yield*/, promises_1.default.readdir(dir)];
                case 26:
                    filesAfterCompact = _9.sent();
                    (0, vitest_1.expect)(filesAfterCompact.some(function (f) { return f.startsWith("sess-main.jsonl.bak."); })).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.delete", {
                            key: "agent:main:discord:group:dev",
                        })];
                case 27:
                    deleted = _9.sent();
                    (0, vitest_1.expect)(deleted.ok).toBe(true);
                    (0, vitest_1.expect)((_3 = deleted.payload) === null || _3 === void 0 ? void 0 : _3.deleted).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", {})];
                case 28:
                    listAfterDelete = _9.sent();
                    (0, vitest_1.expect)(listAfterDelete.ok).toBe(true);
                    (0, vitest_1.expect)((_4 = listAfterDelete.payload) === null || _4 === void 0 ? void 0 : _4.sessions.some(function (s) { return s.key === "agent:main:discord:group:dev"; })).toBe(false);
                    return [4 /*yield*/, promises_1.default.readdir(dir)];
                case 29:
                    filesAfterDelete = _9.sent();
                    (0, vitest_1.expect)(filesAfterDelete.some(function (f) { return f.startsWith("sess-group.jsonl.deleted."); })).toBe(true);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.reset", { key: "agent:main:main" })];
                case 30:
                    reset = _9.sent();
                    (0, vitest_1.expect)(reset.ok).toBe(true);
                    (0, vitest_1.expect)((_5 = reset.payload) === null || _5 === void 0 ? void 0 : _5.key).toBe("agent:main:main");
                    (0, vitest_1.expect)((_6 = reset.payload) === null || _6 === void 0 ? void 0 : _6.entry.sessionId).not.toBe("sess-main");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", {
                            key: "agent:main:main",
                            thinkingLevel: "banana",
                        })];
                case 31:
                    badThinking = _9.sent();
                    (0, vitest_1.expect)(badThinking.ok).toBe(false);
                    (0, vitest_1.expect)((_8 = (_7 = badThinking.error) === null || _7 === void 0 ? void 0 : _7.message) !== null && _8 !== void 0 ? _8 : "").toMatch(/invalid thinkinglevel/i);
                    ws.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("sessions.preview returns transcript previews", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, storePath, sessionId, transcriptPath, lines, ws, preview, entry;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-preview-"))];
                case 1:
                    dir = _c.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    test_helpers_js_1.testState.sessionStorePath = storePath;
                    sessionId = "sess-preview";
                    transcriptPath = node_path_1.default.join(dir, "".concat(sessionId, ".jsonl"));
                    lines = [
                        JSON.stringify({ type: "session", version: 1, id: sessionId }),
                        JSON.stringify({ message: { role: "user", content: "Hello" } }),
                        JSON.stringify({ message: { role: "assistant", content: "Hi" } }),
                        JSON.stringify({
                            message: { role: "assistant", content: [{ type: "toolcall", name: "weather" }] },
                        }),
                        JSON.stringify({ message: { role: "assistant", content: "Forecast ready" } }),
                    ];
                    return [4 /*yield*/, promises_1.default.writeFile(transcriptPath, lines.join("\n"), "utf-8")];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: {
                                    sessionId: sessionId,
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, openClient()];
                case 4:
                    ws = (_c.sent()).ws;
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.preview", { keys: ["main"], limit: 3, maxChars: 120 })];
                case 5:
                    preview = _c.sent();
                    (0, vitest_1.expect)(preview.ok).toBe(true);
                    entry = (_a = preview.payload) === null || _a === void 0 ? void 0 : _a.previews[0];
                    (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.key).toBe("main");
                    (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.status).toBe("ok");
                    (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.items.map(function (item) { return item.role; })).toEqual(["assistant", "tool", "assistant"]);
                    (0, vitest_1.expect)((_b = entry === null || entry === void 0 ? void 0 : entry.items[1]) === null || _b === void 0 ? void 0 : _b.text).toContain("call weather");
                    ws.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("sessions.delete rejects main and aborts active runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, storePath, ws, mainDelete, deleted, clearedKeys;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _c.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    test_helpers_js_1.testState.sessionStorePath = storePath;
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "sess-main.jsonl"), "".concat(JSON.stringify({ role: "user", content: "hello" }), "\n"), "utf-8")];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(dir, "sess-active.jsonl"), "".concat(JSON.stringify({ role: "user", content: "active" }), "\n"), "utf-8")];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            entries: {
                                main: { sessionId: "sess-main", updatedAt: Date.now() },
                                "discord:group:dev": {
                                    sessionId: "sess-active",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 4:
                    _c.sent();
                    test_helpers_js_1.embeddedRunMock.activeIds.add("sess-active");
                    test_helpers_js_1.embeddedRunMock.waitResults.set("sess-active", true);
                    return [4 /*yield*/, openClient()];
                case 5:
                    ws = (_c.sent()).ws;
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.delete", { key: "main" })];
                case 6:
                    mainDelete = _c.sent();
                    (0, vitest_1.expect)(mainDelete.ok).toBe(false);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.delete", {
                            key: "discord:group:dev",
                        })];
                case 7:
                    deleted = _c.sent();
                    (0, vitest_1.expect)(deleted.ok).toBe(true);
                    (0, vitest_1.expect)((_a = deleted.payload) === null || _a === void 0 ? void 0 : _a.deleted).toBe(true);
                    (0, vitest_1.expect)(sessionCleanupMocks.stopSubagentsForRequester).toHaveBeenCalledWith({
                        cfg: vitest_1.expect.any(Object),
                        requesterSessionKey: "agent:main:discord:group:dev",
                    });
                    (0, vitest_1.expect)(sessionCleanupMocks.clearSessionQueues).toHaveBeenCalledTimes(1);
                    clearedKeys = (_b = sessionCleanupMocks.clearSessionQueues.mock.calls[0]) === null || _b === void 0 ? void 0 : _b[0];
                    (0, vitest_1.expect)(clearedKeys).toEqual(vitest_1.expect.arrayContaining(["discord:group:dev", "agent:main:discord:group:dev", "sess-active"]));
                    (0, vitest_1.expect)(test_helpers_js_1.embeddedRunMock.abortCalls).toEqual(["sess-active"]);
                    (0, vitest_1.expect)(test_helpers_js_1.embeddedRunMock.waitCalls).toEqual(["sess-active"]);
                    ws.close();
                    return [2 /*return*/];
            }
        });
    }); });
});
