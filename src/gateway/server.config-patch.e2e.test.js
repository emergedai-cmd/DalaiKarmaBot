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
var config_js_1 = require("../config/config.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var server;
var ws;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var started;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)()];
            case 1:
                started = _a.sent();
                server = started.server;
                ws = started.ws;
                return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ws.close();
                return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("gateway config.patch", function () {
    (0, vitest_1.it)("merges patches without clobbering unrelated config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var setId, setRes, getId, getRes, baseHash, patchId, patchRes, get2Id, get2Res;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    setId = "req-set";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: setId,
                        method: "config.set",
                        params: {
                            raw: JSON.stringify({
                                gateway: { mode: "local" },
                                channels: { telegram: { botToken: "token-1" } },
                            }),
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === setId; })];
                case 1:
                    setRes = _k.sent();
                    (0, vitest_1.expect)(setRes.ok).toBe(true);
                    getId = "req-get";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: getId,
                        method: "config.get",
                        params: {},
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === getId; })];
                case 2:
                    getRes = _k.sent();
                    (0, vitest_1.expect)(getRes.ok).toBe(true);
                    baseHash = (0, config_js_1.resolveConfigSnapshotHash)({
                        hash: (_a = getRes.payload) === null || _a === void 0 ? void 0 : _a.hash,
                        raw: (_b = getRes.payload) === null || _b === void 0 ? void 0 : _b.raw,
                    });
                    (0, vitest_1.expect)(typeof baseHash).toBe("string");
                    patchId = "req-patch";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: patchId,
                        method: "config.patch",
                        params: {
                            raw: JSON.stringify({
                                channels: {
                                    telegram: {
                                        groups: {
                                            "*": { requireMention: false },
                                        },
                                    },
                                },
                            }),
                            baseHash: baseHash,
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === patchId; })];
                case 3:
                    patchRes = _k.sent();
                    (0, vitest_1.expect)(patchRes.ok).toBe(true);
                    get2Id = "req-get-2";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: get2Id,
                        method: "config.get",
                        params: {},
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === get2Id; })];
                case 4:
                    get2Res = _k.sent();
                    (0, vitest_1.expect)(get2Res.ok).toBe(true);
                    (0, vitest_1.expect)((_e = (_d = (_c = get2Res.payload) === null || _c === void 0 ? void 0 : _c.config) === null || _d === void 0 ? void 0 : _d.gateway) === null || _e === void 0 ? void 0 : _e.mode).toBe("local");
                    (0, vitest_1.expect)((_j = (_h = (_g = (_f = get2Res.payload) === null || _f === void 0 ? void 0 : _f.config) === null || _g === void 0 ? void 0 : _g.channels) === null || _h === void 0 ? void 0 : _h.telegram) === null || _j === void 0 ? void 0 : _j.botToken).toBe("token-1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("writes config, stores sentinel, and schedules restart", function () { return __awaiter(void 0, void 0, void 0, function () {
        var setId, setRes, getId, getRes, baseHash, patchId, patchRes, sentinelPath, raw, parsed, _a;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    setId = "req-set-restart";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: setId,
                        method: "config.set",
                        params: {
                            raw: JSON.stringify({
                                gateway: { mode: "local" },
                                channels: { telegram: { botToken: "token-1" } },
                            }),
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === setId; })];
                case 1:
                    setRes = _g.sent();
                    (0, vitest_1.expect)(setRes.ok).toBe(true);
                    getId = "req-get-restart";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: getId,
                        method: "config.get",
                        params: {},
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === getId; })];
                case 2:
                    getRes = _g.sent();
                    (0, vitest_1.expect)(getRes.ok).toBe(true);
                    baseHash = (0, config_js_1.resolveConfigSnapshotHash)({
                        hash: (_b = getRes.payload) === null || _b === void 0 ? void 0 : _b.hash,
                        raw: (_c = getRes.payload) === null || _c === void 0 ? void 0 : _c.raw,
                    });
                    (0, vitest_1.expect)(typeof baseHash).toBe("string");
                    patchId = "req-patch-restart";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: patchId,
                        method: "config.patch",
                        params: {
                            raw: JSON.stringify({
                                channels: {
                                    telegram: {
                                        groups: {
                                            "*": { requireMention: false },
                                        },
                                    },
                                },
                            }),
                            baseHash: baseHash,
                            sessionKey: "agent:main:whatsapp:dm:+15555550123",
                            note: "test patch",
                            restartDelayMs: 0,
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === patchId; })];
                case 3:
                    patchRes = _g.sent();
                    (0, vitest_1.expect)(patchRes.ok).toBe(true);
                    sentinelPath = node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "restart-sentinel.json");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 4:
                    _g.sent();
                    _g.label = 5;
                case 5:
                    _g.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, promises_1.default.readFile(sentinelPath, "utf-8")];
                case 6:
                    raw = _g.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_d = parsed.payload) === null || _d === void 0 ? void 0 : _d.kind).toBe("config-apply");
                    (0, vitest_1.expect)((_f = (_e = parsed.payload) === null || _e === void 0 ? void 0 : _e.stats) === null || _f === void 0 ? void 0 : _f.mode).toBe("config.patch");
                    return [3 /*break*/, 8];
                case 7:
                    _a = _g.sent();
                    (0, vitest_1.expect)(patchRes.ok).toBe(true);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires base hash when config exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var setId, setRes, patchId, patchRes;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setId = "req-set-2";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: setId,
                        method: "config.set",
                        params: {
                            raw: JSON.stringify({
                                gateway: { mode: "local" },
                            }),
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === setId; })];
                case 1:
                    setRes = _b.sent();
                    (0, vitest_1.expect)(setRes.ok).toBe(true);
                    patchId = "req-patch-2";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: patchId,
                        method: "config.patch",
                        params: {
                            raw: JSON.stringify({ gateway: { mode: "remote" } }),
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === patchId; })];
                case 2:
                    patchRes = _b.sent();
                    (0, vitest_1.expect)(patchRes.ok).toBe(false);
                    (0, vitest_1.expect)((_a = patchRes.error) === null || _a === void 0 ? void 0 : _a.message).toContain("base hash");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires base hash for config.set when config exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var setId, setRes, set2Id, set2Res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setId = "req-set-3";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: setId,
                        method: "config.set",
                        params: {
                            raw: JSON.stringify({
                                gateway: { mode: "local" },
                            }),
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === setId; })];
                case 1:
                    setRes = _b.sent();
                    (0, vitest_1.expect)(setRes.ok).toBe(true);
                    set2Id = "req-set-4";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: set2Id,
                        method: "config.set",
                        params: {
                            raw: JSON.stringify({
                                gateway: { mode: "remote" },
                            }),
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === set2Id; })];
                case 2:
                    set2Res = _b.sent();
                    (0, vitest_1.expect)(set2Res.ok).toBe(false);
                    (0, vitest_1.expect)((_a = set2Res.error) === null || _a === void 0 ? void 0 : _a.message).toContain("base hash");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("gateway server sessions", function () {
    (0, vitest_1.it)("filters sessions by agentId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, homeDir, workDir, homeSessions, workSessions;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-agents-"))];
                case 1:
                    dir = _c.sent();
                    test_helpers_js_1.testState.sessionConfig = {
                        store: node_path_1.default.join(dir, "{agentId}", "sessions.json"),
                    };
                    test_helpers_js_1.testState.agentsConfig = {
                        list: [{ id: "home", default: true }, { id: "work" }],
                    };
                    homeDir = node_path_1.default.join(dir, "home");
                    workDir = node_path_1.default.join(dir, "work");
                    return [4 /*yield*/, promises_1.default.mkdir(homeDir, { recursive: true })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(workDir, { recursive: true })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            storePath: node_path_1.default.join(homeDir, "sessions.json"),
                            agentId: "home",
                            entries: {
                                main: {
                                    sessionId: "sess-home-main",
                                    updatedAt: Date.now(),
                                },
                                "discord:group:dev": {
                                    sessionId: "sess-home-group",
                                    updatedAt: Date.now() - 1000,
                                },
                            },
                        })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            storePath: node_path_1.default.join(workDir, "sessions.json"),
                            agentId: "work",
                            entries: {
                                main: {
                                    sessionId: "sess-work-main",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", {
                            includeGlobal: false,
                            includeUnknown: false,
                            agentId: "home",
                        })];
                case 6:
                    homeSessions = _c.sent();
                    (0, vitest_1.expect)(homeSessions.ok).toBe(true);
                    (0, vitest_1.expect)((_a = homeSessions.payload) === null || _a === void 0 ? void 0 : _a.sessions.map(function (s) { return s.key; }).toSorted()).toEqual([
                        "agent:home:discord:group:dev",
                        "agent:home:main",
                    ]);
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.list", {
                            includeGlobal: false,
                            includeUnknown: false,
                            agentId: "work",
                        })];
                case 7:
                    workSessions = _c.sent();
                    (0, vitest_1.expect)(workSessions.ok).toBe(true);
                    (0, vitest_1.expect)((_b = workSessions.payload) === null || _b === void 0 ? void 0 : _b.sessions.map(function (s) { return s.key; })).toEqual(["agent:work:main"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resolves and patches main alias to default agent main key", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, storePath, resolved, patched, stored, _a, _b;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-sessions-"))];
                case 1:
                    dir = _f.sent();
                    storePath = node_path_1.default.join(dir, "sessions.json");
                    test_helpers_js_1.testState.sessionStorePath = storePath;
                    test_helpers_js_1.testState.agentsConfig = { list: [{ id: "ops", default: true }] };
                    test_helpers_js_1.testState.sessionConfig = { mainKey: "work" };
                    return [4 /*yield*/, (0, test_helpers_js_1.writeSessionStore)({
                            storePath: storePath,
                            agentId: "ops",
                            mainKey: "work",
                            entries: {
                                main: {
                                    sessionId: "sess-ops-main",
                                    updatedAt: Date.now(),
                                },
                            },
                        })];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.resolve", {
                            key: "main",
                        })];
                case 3:
                    resolved = _f.sent();
                    (0, vitest_1.expect)(resolved.ok).toBe(true);
                    (0, vitest_1.expect)((_c = resolved.payload) === null || _c === void 0 ? void 0 : _c.key).toBe("agent:ops:work");
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(ws, "sessions.patch", {
                            key: "main",
                            thinkingLevel: "medium",
                        })];
                case 4:
                    patched = _f.sent();
                    (0, vitest_1.expect)(patched.ok).toBe(true);
                    (0, vitest_1.expect)((_d = patched.payload) === null || _d === void 0 ? void 0 : _d.key).toBe("agent:ops:work");
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(storePath, "utf-8")];
                case 5:
                    stored = _b.apply(_a, [_f.sent()]);
                    (0, vitest_1.expect)((_e = stored["agent:ops:work"]) === null || _e === void 0 ? void 0 : _e.thinkingLevel).toBe("medium");
                    (0, vitest_1.expect)(stored.main).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
