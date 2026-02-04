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
var test_utils_js_1 = require("./__tests__/test-utils.js");
var plugins_http_js_1 = require("./plugins-http.js");
var makeResponse = function () {
    var setHeader = vitest_1.vi.fn();
    var end = vitest_1.vi.fn();
    var res = {
        headersSent: false,
        statusCode: 200,
        setHeader: setHeader,
        end: end,
    };
    return { res: res, setHeader: setHeader, end: end };
};
(0, vitest_1.describe)("createGatewayPluginRequestHandler", function () {
    (0, vitest_1.it)("returns false when no handlers are registered", function () { return __awaiter(void 0, void 0, void 0, function () {
        var log, handler, res, handled;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log = { warn: vitest_1.vi.fn() };
                    handler = (0, plugins_http_js_1.createGatewayPluginRequestHandler)({
                        registry: (0, test_utils_js_1.createTestRegistry)(),
                        log: log,
                    });
                    res = makeResponse().res;
                    return [4 /*yield*/, handler({}, res)];
                case 1:
                    handled = _a.sent();
                    (0, vitest_1.expect)(handled).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("continues until a handler reports it handled the request", function () { return __awaiter(void 0, void 0, void 0, function () {
        var first, second, handler, res, handled;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    first = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, false];
                    }); }); });
                    second = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, true];
                    }); }); });
                    handler = (0, plugins_http_js_1.createGatewayPluginRequestHandler)({
                        registry: (0, test_utils_js_1.createTestRegistry)({
                            httpHandlers: [
                                { pluginId: "first", handler: first, source: "first" },
                                { pluginId: "second", handler: second, source: "second" },
                            ],
                        }),
                        log: { warn: vitest_1.vi.fn() },
                    });
                    res = makeResponse().res;
                    return [4 /*yield*/, handler({}, res)];
                case 1:
                    handled = _a.sent();
                    (0, vitest_1.expect)(handled).toBe(true);
                    (0, vitest_1.expect)(first).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(second).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles registered http routes before generic handlers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var routeHandler, fallback, handler, res, handled;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    routeHandler = vitest_1.vi.fn(function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            res.statusCode = 200;
                            return [2 /*return*/];
                        });
                    }); });
                    fallback = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, true];
                    }); }); });
                    handler = (0, plugins_http_js_1.createGatewayPluginRequestHandler)({
                        registry: (0, test_utils_js_1.createTestRegistry)({
                            httpRoutes: [
                                {
                                    pluginId: "route",
                                    path: "/demo",
                                    handler: routeHandler,
                                    source: "route",
                                },
                            ],
                            httpHandlers: [{ pluginId: "fallback", handler: fallback, source: "fallback" }],
                        }),
                        log: { warn: vitest_1.vi.fn() },
                    });
                    res = makeResponse().res;
                    return [4 /*yield*/, handler({ url: "/demo" }, res)];
                case 1:
                    handled = _a.sent();
                    (0, vitest_1.expect)(handled).toBe(true);
                    (0, vitest_1.expect)(routeHandler).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(fallback).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs and responds with 500 when a handler throws", function () { return __awaiter(void 0, void 0, void 0, function () {
        var log, handler, _a, res, setHeader, end, handled;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log = { warn: vitest_1.vi.fn() };
                    handler = (0, plugins_http_js_1.createGatewayPluginRequestHandler)({
                        registry: (0, test_utils_js_1.createTestRegistry)({
                            httpHandlers: [
                                {
                                    pluginId: "boom",
                                    handler: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            throw new Error("boom");
                                        });
                                    }); },
                                    source: "boom",
                                },
                            ],
                        }),
                        log: log,
                    });
                    _a = makeResponse(), res = _a.res, setHeader = _a.setHeader, end = _a.end;
                    return [4 /*yield*/, handler({}, res)];
                case 1:
                    handled = _b.sent();
                    (0, vitest_1.expect)(handled).toBe(true);
                    (0, vitest_1.expect)(log.warn).toHaveBeenCalledWith(vitest_1.expect.stringContaining("boom"));
                    (0, vitest_1.expect)(res.statusCode).toBe(500);
                    (0, vitest_1.expect)(setHeader).toHaveBeenCalledWith("Content-Type", "text/plain; charset=utf-8");
                    (0, vitest_1.expect)(end).toHaveBeenCalledWith("Internal Server Error");
                    return [2 /*return*/];
            }
        });
    }); });
});
