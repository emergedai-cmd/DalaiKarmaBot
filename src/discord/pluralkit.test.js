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
var pluralkit_js_1 = require("./pluralkit.js");
var buildResponse = function (params) {
    var body = params.body;
    var textPayload = typeof body === "string" ? body : body == null ? "" : JSON.stringify(body);
    return {
        status: params.status,
        ok: params.status >= 200 && params.status < 300,
        text: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, textPayload];
        }); }); },
        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, body !== null && body !== void 0 ? body : {}];
        }); }); },
    };
};
(0, vitest_1.describe)("fetchPluralKitMessageInfo", function () {
    (0, vitest_1.it)("returns null when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetcher, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetcher = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, pluralkit_js_1.fetchPluralKitMessageInfo)({
                            messageId: "123",
                            config: { enabled: false },
                            fetcher: fetcher,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBeNull();
                    (0, vitest_1.expect)(fetcher).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns null on 404", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetcher, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetcher = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, buildResponse({ status: 404 })];
                    }); }); });
                    return [4 /*yield*/, (0, pluralkit_js_1.fetchPluralKitMessageInfo)({
                            messageId: "missing",
                            config: { enabled: true },
                            fetcher: fetcher,
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns payload and sends token when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var receivedHeaders, fetcher, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fetcher = vitest_1.vi.fn(function (_url, init) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            receivedHeaders = init === null || init === void 0 ? void 0 : init.headers;
                            return [2 /*return*/, buildResponse({
                                    status: 200,
                                    body: {
                                        id: "123",
                                        member: { id: "mem_1", name: "Alex" },
                                        system: { id: "sys_1", name: "System" },
                                    },
                                })];
                        });
                    }); });
                    return [4 /*yield*/, (0, pluralkit_js_1.fetchPluralKitMessageInfo)({
                            messageId: "123",
                            config: { enabled: true, token: "pk_test" },
                            fetcher: fetcher,
                        })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)((_a = result === null || result === void 0 ? void 0 : result.member) === null || _a === void 0 ? void 0 : _a.id).toBe("mem_1");
                    (0, vitest_1.expect)(receivedHeaders === null || receivedHeaders === void 0 ? void 0 : receivedHeaders.Authorization).toBe("pk_test");
                    return [2 /*return*/];
            }
        });
    }); });
});
