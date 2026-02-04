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
var auth_js_1 = require("./auth.js");
(0, vitest_1.describe)("gateway auth", function () {
    (0, vitest_1.it)("does not throw when req is missing socket", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                        auth: { mode: "token", token: "secret", allowTailscale: false },
                        connectAuth: { token: "secret" },
                        // Regression: avoid crashing on req.socket.remoteAddress when callers pass a non-IncomingMessage.
                        req: {},
                    })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reports missing and mismatched token reasons", function () { return __awaiter(void 0, void 0, void 0, function () {
        var missing, mismatch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                        auth: { mode: "token", token: "secret", allowTailscale: false },
                        connectAuth: null,
                    })];
                case 1:
                    missing = _a.sent();
                    (0, vitest_1.expect)(missing.ok).toBe(false);
                    (0, vitest_1.expect)(missing.reason).toBe("token_missing");
                    return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                            auth: { mode: "token", token: "secret", allowTailscale: false },
                            connectAuth: { token: "wrong" },
                        })];
                case 2:
                    mismatch = _a.sent();
                    (0, vitest_1.expect)(mismatch.ok).toBe(false);
                    (0, vitest_1.expect)(mismatch.reason).toBe("token_mismatch");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reports missing token config reason", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                        auth: { mode: "token", allowTailscale: false },
                        connectAuth: { token: "anything" },
                    })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    (0, vitest_1.expect)(res.reason).toBe("token_missing_config");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reports missing and mismatched password reasons", function () { return __awaiter(void 0, void 0, void 0, function () {
        var missing, mismatch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                        auth: { mode: "password", password: "secret", allowTailscale: false },
                        connectAuth: null,
                    })];
                case 1:
                    missing = _a.sent();
                    (0, vitest_1.expect)(missing.ok).toBe(false);
                    (0, vitest_1.expect)(missing.reason).toBe("password_missing");
                    return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                            auth: { mode: "password", password: "secret", allowTailscale: false },
                            connectAuth: { password: "wrong" },
                        })];
                case 2:
                    mismatch = _a.sent();
                    (0, vitest_1.expect)(mismatch.ok).toBe(false);
                    (0, vitest_1.expect)(mismatch.reason).toBe("password_mismatch");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reports missing password config reason", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                        auth: { mode: "password", allowTailscale: false },
                        connectAuth: { password: "secret" },
                    })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    (0, vitest_1.expect)(res.reason).toBe("password_missing_config");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats local tailscale serve hostnames as direct", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                        auth: { mode: "token", token: "secret", allowTailscale: true },
                        connectAuth: { token: "secret" },
                        req: {
                            socket: { remoteAddress: "127.0.0.1" },
                            headers: { host: "gateway.tailnet-1234.ts.net:443" },
                        },
                    })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(res.method).toBe("token");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows tailscale identity to satisfy token mode auth", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                        auth: { mode: "token", token: "secret", allowTailscale: true },
                        connectAuth: null,
                        tailscaleWhois: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ login: "peter", name: "Peter" })];
                        }); }); },
                        req: {
                            socket: { remoteAddress: "127.0.0.1" },
                            headers: {
                                host: "gateway.local",
                                "x-forwarded-for": "100.64.0.1",
                                "x-forwarded-proto": "https",
                                "x-forwarded-host": "ai-hub.bone-egret.ts.net",
                                "tailscale-user-login": "peter",
                                "tailscale-user-name": "Peter",
                            },
                        },
                    })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    (0, vitest_1.expect)(res.method).toBe("tailscale");
                    (0, vitest_1.expect)(res.user).toBe("peter");
                    return [2 /*return*/];
            }
        });
    }); });
});
