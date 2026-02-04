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
var sessions_js_1 = require("../config/sessions.js");
var system_events_js_1 = require("../infra/system-events.js");
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var resolveMainKey = function () { return (0, sessions_js_1.resolveMainSessionKeyFromConfig)(); };
(0, vitest_1.describe)("gateway server hooks", function () {
    (0, vitest_1.test)("handles auth, wake, and agent flows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, server, resNoAuth, resWake, wakeEvents, resAgent, agentEvents, resAgentModel, call, resQuery, queryEvents, resBadChannel, resHeader, headerEvents, resGet, resBlankText, resBlankMessage, resBadJson;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    test_helpers_js_1.testState.hooksConfig = { enabled: true, token: "hook-secret" };
                    return [4 /*yield*/, (0, test_helpers_js_1.getFreePort)()];
                case 1:
                    port = _d.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.startGatewayServer)(port)];
                case 2:
                    server = _d.sent();
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, , 20, 22]);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/wake"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ text: "Ping" }),
                        })];
                case 4:
                    resNoAuth = _d.sent();
                    (0, vitest_1.expect)(resNoAuth.status).toBe(401);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/wake"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer hook-secret",
                            },
                            body: JSON.stringify({ text: "Ping", mode: "next-heartbeat" }),
                        })];
                case 5:
                    resWake = _d.sent();
                    (0, vitest_1.expect)(resWake.status).toBe(200);
                    return [4 /*yield*/, (0, test_helpers_js_1.waitForSystemEvent)()];
                case 6:
                    wakeEvents = _d.sent();
                    (0, vitest_1.expect)(wakeEvents.some(function (e) { return e.includes("Ping"); })).toBe(true);
                    (0, system_events_js_1.drainSystemEvents)(resolveMainKey());
                    test_helpers_js_1.cronIsolatedRun.mockReset();
                    test_helpers_js_1.cronIsolatedRun.mockResolvedValueOnce({
                        status: "ok",
                        summary: "done",
                    });
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/agent"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer hook-secret",
                            },
                            body: JSON.stringify({ message: "Do it", name: "Email" }),
                        })];
                case 7:
                    resAgent = _d.sent();
                    (0, vitest_1.expect)(resAgent.status).toBe(202);
                    return [4 /*yield*/, (0, test_helpers_js_1.waitForSystemEvent)()];
                case 8:
                    agentEvents = _d.sent();
                    (0, vitest_1.expect)(agentEvents.some(function (e) { return e.includes("Hook Email: done"); })).toBe(true);
                    (0, system_events_js_1.drainSystemEvents)(resolveMainKey());
                    test_helpers_js_1.cronIsolatedRun.mockReset();
                    test_helpers_js_1.cronIsolatedRun.mockResolvedValueOnce({
                        status: "ok",
                        summary: "done",
                    });
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/agent"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer hook-secret",
                            },
                            body: JSON.stringify({
                                message: "Do it",
                                name: "Email",
                                model: "openai/gpt-4.1-mini",
                            }),
                        })];
                case 9:
                    resAgentModel = _d.sent();
                    (0, vitest_1.expect)(resAgentModel.status).toBe(202);
                    return [4 /*yield*/, (0, test_helpers_js_1.waitForSystemEvent)()];
                case 10:
                    _d.sent();
                    call = (_a = test_helpers_js_1.cronIsolatedRun.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_c = (_b = call === null || call === void 0 ? void 0 : call.job) === null || _b === void 0 ? void 0 : _b.payload) === null || _c === void 0 ? void 0 : _c.model).toBe("openai/gpt-4.1-mini");
                    (0, system_events_js_1.drainSystemEvents)(resolveMainKey());
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/wake?token=hook-secret"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ text: "Query auth" }),
                        })];
                case 11:
                    resQuery = _d.sent();
                    (0, vitest_1.expect)(resQuery.status).toBe(200);
                    return [4 /*yield*/, (0, test_helpers_js_1.waitForSystemEvent)()];
                case 12:
                    queryEvents = _d.sent();
                    (0, vitest_1.expect)(queryEvents.some(function (e) { return e.includes("Query auth"); })).toBe(true);
                    (0, system_events_js_1.drainSystemEvents)(resolveMainKey());
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/agent"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer hook-secret",
                            },
                            body: JSON.stringify({ message: "Nope", channel: "sms" }),
                        })];
                case 13:
                    resBadChannel = _d.sent();
                    (0, vitest_1.expect)(resBadChannel.status).toBe(400);
                    (0, vitest_1.expect)((0, system_events_js_1.peekSystemEvents)(resolveMainKey()).length).toBe(0);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/wake"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-openclaw-token": "hook-secret",
                            },
                            body: JSON.stringify({ text: "Header auth" }),
                        })];
                case 14:
                    resHeader = _d.sent();
                    (0, vitest_1.expect)(resHeader.status).toBe(200);
                    return [4 /*yield*/, (0, test_helpers_js_1.waitForSystemEvent)()];
                case 15:
                    headerEvents = _d.sent();
                    (0, vitest_1.expect)(headerEvents.some(function (e) { return e.includes("Header auth"); })).toBe(true);
                    (0, system_events_js_1.drainSystemEvents)(resolveMainKey());
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/wake"), {
                            method: "GET",
                            headers: { Authorization: "Bearer hook-secret" },
                        })];
                case 16:
                    resGet = _d.sent();
                    (0, vitest_1.expect)(resGet.status).toBe(405);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/wake"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer hook-secret",
                            },
                            body: JSON.stringify({ text: " " }),
                        })];
                case 17:
                    resBlankText = _d.sent();
                    (0, vitest_1.expect)(resBlankText.status).toBe(400);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/agent"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer hook-secret",
                            },
                            body: JSON.stringify({ message: " " }),
                        })];
                case 18:
                    resBlankMessage = _d.sent();
                    (0, vitest_1.expect)(resBlankMessage.status).toBe(400);
                    return [4 /*yield*/, fetch("http://127.0.0.1:".concat(port, "/hooks/wake"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer hook-secret",
                            },
                            body: "{",
                        })];
                case 19:
                    resBadJson = _d.sent();
                    (0, vitest_1.expect)(resBadJson.status).toBe(400);
                    return [3 /*break*/, 22];
                case 20: return [4 /*yield*/, server.close()];
                case 21:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 22: return [2 /*return*/];
            }
        });
    }); });
});
