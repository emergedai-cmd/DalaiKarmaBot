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
var api_js_1 = require("./api.js");
function jsonResponse(body, status) {
    if (status === void 0) { status = 200; }
    return new Response(JSON.stringify(body), { status: status });
}
(0, vitest_1.describe)("fetchDiscord", function () {
    (0, vitest_1.it)("formats rate limit payloads without raw JSON", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetcher, error, err_1, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetcher = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, jsonResponse({
                                    message: "You are being rate limited.",
                                    retry_after: 0.631,
                                    global: false,
                                }, 429)];
                        });
                    }); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, api_js_1.fetchDiscord)("/users/@me/guilds", "test", fetcher, {
                            retry: { attempts: 1 },
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    error = err_1;
                    return [3 /*break*/, 4];
                case 4:
                    message = String(error);
                    (0, vitest_1.expect)(message).toContain("Discord API /users/@me/guilds failed (429)");
                    (0, vitest_1.expect)(message).toContain("You are being rate limited.");
                    (0, vitest_1.expect)(message).toContain("retry after 0.6s");
                    (0, vitest_1.expect)(message).not.toContain("{");
                    (0, vitest_1.expect)(message).not.toContain("retry_after");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves non-JSON error text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetcher = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, new Response("Not Found", { status: 404 })];
                    }); }); };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, api_js_1.fetchDiscord)("/users/@me/guilds", "test", fetcher, {
                            retry: { attempts: 1 },
                        })).rejects.toThrow("Discord API /users/@me/guilds failed (404): Not Found")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("retries rate limits before succeeding", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, fetcher, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    calls = 0;
                    fetcher = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls += 1;
                            if (calls === 1) {
                                return [2 /*return*/, jsonResponse({
                                        message: "You are being rate limited.",
                                        retry_after: 0,
                                        global: false,
                                    }, 429)];
                            }
                            return [2 /*return*/, jsonResponse([{ id: "1", name: "Guild" }], 200)];
                        });
                    }); };
                    return [4 /*yield*/, (0, api_js_1.fetchDiscord)("/users/@me/guilds", "test", fetcher, { retry: { attempts: 2, minDelayMs: 0, maxDelayMs: 0 } })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toHaveLength(1);
                    (0, vitest_1.expect)(calls).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
