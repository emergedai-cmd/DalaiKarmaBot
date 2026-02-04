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
var node_http_1 = require("node:http");
var vitest_1 = require("vitest");
var monitor_js_1 = require("./monitor.js");
function withServer(handler, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var server, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = (0, node_http_1.createServer)(handler);
                    return [4 /*yield*/, new Promise(function (resolve) {
                            server.listen(0, "127.0.0.1", function () { return resolve(); });
                        })];
                case 1:
                    _a.sent();
                    address = server.address();
                    if (!address) {
                        throw new Error("missing server address");
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, fn("http://127.0.0.1:".concat(address.port))];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, new Promise(function (resolve) { return server.close(function () { return resolve(); }); })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("handleZaloWebhookRequest", function () {
    (0, vitest_1.it)("returns 400 for non-object payloads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var core, account, unregister;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    core = {};
                    account = {
                        accountId: "default",
                        enabled: true,
                        token: "tok",
                        tokenSource: "config",
                        config: {},
                    };
                    unregister = (0, monitor_js_1.registerZaloWebhookTarget)({
                        token: "tok",
                        account: account,
                        config: {},
                        runtime: {},
                        core: core,
                        secret: "secret",
                        path: "/hook",
                        mediaMaxMb: 5,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, withServer(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                            var handled;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, monitor_js_1.handleZaloWebhookRequest)(req, res)];
                                    case 1:
                                        handled = _a.sent();
                                        if (!handled) {
                                            res.statusCode = 404;
                                            res.end("not found");
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }, function (baseUrl) { return __awaiter(void 0, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch("".concat(baseUrl, "/hook"), {
                                            method: "POST",
                                            headers: {
                                                "x-bot-api-secret-token": "secret",
                                            },
                                            body: "null",
                                        })];
                                    case 1:
                                        response = _a.sent();
                                        (0, vitest_1.expect)(response.status).toBe(400);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    unregister();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
