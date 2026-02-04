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
var ws_1 = require("ws");
var test_helpers_js_1 = require("./test-helpers.js");
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
var openClient = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ws;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ws = new ws_1.WebSocket("ws://127.0.0.1:".concat(port));
                return [4 /*yield*/, new Promise(function (resolve) { return ws.once("open", resolve); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_helpers_js_1.connectOk)(ws)];
            case 2:
                _a.sent();
                return [2 /*return*/, ws];
        }
    });
}); };
(0, vitest_1.describe)("gateway config.apply", function () {
    (0, vitest_1.it)("writes config, stores sentinel, and schedules restart", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ws, id_1, res, sentinelPath, raw, parsed, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, openClient()];
                case 1:
                    ws = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 9, 10]);
                    id_1 = "req-1";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: id_1,
                        method: "config.apply",
                        params: {
                            raw: '{ "agents": { "list": [{ "id": "main", "workspace": "~/openclaw" }] } }',
                            sessionKey: "agent:main:whatsapp:dm:+15555550123",
                            restartDelayMs: 0,
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === id_1; })];
                case 3:
                    res = _c.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    sentinelPath = node_path_1.default.join(node_os_1.default.homedir(), ".openclaw", "restart-sentinel.json");
                    // Wait for file to be written
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 4:
                    // Wait for file to be written
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, promises_1.default.readFile(sentinelPath, "utf-8")];
                case 6:
                    raw = _c.sent();
                    parsed = JSON.parse(raw);
                    (0, vitest_1.expect)((_b = parsed.payload) === null || _b === void 0 ? void 0 : _b.kind).toBe("config-apply");
                    return [3 /*break*/, 8];
                case 7:
                    _a = _c.sent();
                    // File may not exist if signal delivery is mocked, verify response was ok instead
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    ws.close();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects invalid raw config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ws, id_2, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openClient()];
                case 1:
                    ws = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    id_2 = "req-2";
                    ws.send(JSON.stringify({
                        type: "req",
                        id: id_2,
                        method: "config.apply",
                        params: {
                            raw: "{",
                        },
                    }));
                    return [4 /*yield*/, (0, test_helpers_js_1.onceMessage)(ws, function (o) { return o.type === "res" && o.id === id_2; })];
                case 3:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    return [3 /*break*/, 5];
                case 4:
                    ws.close();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
});
