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
var ws_1 = require("ws");
var device_identity_js_1 = require("../infra/device-identity.js");
var message_channel_js_1 = require("../utils/message-channel.js");
vitest_1.vi.mock("../infra/update-runner.js", function () { return ({
    runGatewayUpdate: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    status: "ok",
                    mode: "git",
                    root: "/repo",
                    steps: [],
                    durationMs: 12,
                })];
        });
    }); }),
}); });
var test_helpers_js_1 = require("./test-helpers.js");
(0, test_helpers_js_1.installGatewayTestHooks)({ scope: "suite" });
var server;
var ws;
var port;
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var token, started;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = "test-gateway-token-1234567890";
                return [4 /*yield*/, (0, test_helpers_js_1.startServerWithClient)(token)];
            case 1:
                started = _a.sent();
                server = started.server;
                ws = started.ws;
                port = started.port;
                return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws, { token: token })];
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
(0, vitest_1.describe)("late-arriving invoke results", function () {
    (0, vitest_1.test)("returns success for unknown invoke id (late arrival after timeout)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nodeWs, identity, nodeId, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    nodeWs = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return nodeWs.once("open", resolve); })];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 5, 6]);
                    identity = (0, device_identity_js_1.loadOrCreateDeviceIdentity)();
                    nodeId = identity.deviceId;
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(nodeWs, {
                            role: "node",
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.NODE_HOST,
                                version: "1.0.0",
                                platform: "ios",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.NODE,
                            },
                            commands: ["canvas.snapshot"],
                            token: "test-gateway-token-1234567890",
                        })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(nodeWs, "node.invoke.result", {
                            id: "unknown-invoke-id-12345",
                            nodeId: nodeId,
                            ok: true,
                            payloadJSON: JSON.stringify({ result: "late" }),
                        })];
                case 4:
                    result = _c.sent();
                    // Late-arriving results return success instead of error to reduce log noise
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    (0, vitest_1.expect)((_a = result.payload) === null || _a === void 0 ? void 0 : _a.ok).toBe(true);
                    (0, vitest_1.expect)((_b = result.payload) === null || _b === void 0 ? void 0 : _b.ignored).toBe(true);
                    return [3 /*break*/, 6];
                case 5:
                    nodeWs.close();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("returns success for unknown invoke id with error payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nodeWs, identity, nodeId, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    nodeWs = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                    return [4 /*yield*/, new Promise(function (resolve) { return nodeWs.once("open", resolve); })];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(nodeWs, {
                            role: "node",
                            client: {
                                id: message_channel_js_1.GATEWAY_CLIENT_NAMES.NODE_HOST,
                                version: "1.0.0",
                                platform: "darwin",
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.NODE,
                            },
                            commands: [],
                        })];
                case 3:
                    _c.sent();
                    identity = (0, device_identity_js_1.loadOrCreateDeviceIdentity)();
                    nodeId = identity.deviceId;
                    return [4 /*yield*/, (0, test_helpers_js_1.rpcReq)(nodeWs, "node.invoke.result", {
                            id: "another-unknown-invoke-id",
                            nodeId: nodeId,
                            ok: false,
                            error: { code: "FAILED", message: "test error" },
                        })];
                case 4:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.ok).toBe(true);
                    (0, vitest_1.expect)((_a = result.payload) === null || _a === void 0 ? void 0 : _a.ok).toBe(true);
                    (0, vitest_1.expect)((_b = result.payload) === null || _b === void 0 ? void 0 : _b.ignored).toBe(true);
                    return [3 /*break*/, 6];
                case 5:
                    nodeWs.close();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
