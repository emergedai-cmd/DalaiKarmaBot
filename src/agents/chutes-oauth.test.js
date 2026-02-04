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
var chutes_oauth_js_1 = require("./chutes-oauth.js");
(0, vitest_1.describe)("chutes-oauth", function () {
    (0, vitest_1.it)("exchanges code for tokens and stores username as email", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchFn, now, creds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchFn = function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = String(input);
                            if (url === chutes_oauth_js_1.CHUTES_TOKEN_ENDPOINT) {
                                (0, vitest_1.expect)(init === null || init === void 0 ? void 0 : init.method).toBe("POST");
                                (0, vitest_1.expect)(String((init === null || init === void 0 ? void 0 : init.headers) && init.headers["Content-Type"])).toContain("application/x-www-form-urlencoded");
                                return [2 /*return*/, new Response(JSON.stringify({
                                        access_token: "at_123",
                                        refresh_token: "rt_123",
                                        expires_in: 3600,
                                    }), { status: 200, headers: { "Content-Type": "application/json" } })];
                            }
                            if (url === chutes_oauth_js_1.CHUTES_USERINFO_ENDPOINT) {
                                (0, vitest_1.expect)(String((init === null || init === void 0 ? void 0 : init.headers) && init.headers.Authorization)).toBe("Bearer at_123");
                                return [2 /*return*/, new Response(JSON.stringify({ username: "fred", sub: "sub_1" }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                            }
                            return [2 /*return*/, new Response("not found", { status: 404 })];
                        });
                    }); };
                    now = 1000000;
                    return [4 /*yield*/, (0, chutes_oauth_js_1.exchangeChutesCodeForTokens)({
                            app: {
                                clientId: "cid_test",
                                redirectUri: "http://127.0.0.1:1456/oauth-callback",
                                scopes: ["openid"],
                            },
                            code: "code_123",
                            codeVerifier: "verifier_123",
                            fetchFn: fetchFn,
                            now: now,
                        })];
                case 1:
                    creds = _a.sent();
                    (0, vitest_1.expect)(creds.access).toBe("at_123");
                    (0, vitest_1.expect)(creds.refresh).toBe("rt_123");
                    (0, vitest_1.expect)(creds.email).toBe("fred");
                    (0, vitest_1.expect)(creds.accountId).toBe("sub_1");
                    (0, vitest_1.expect)(creds.clientId).toBe("cid_test");
                    (0, vitest_1.expect)(creds.expires).toBe(now + 3600 * 1000 - 5 * 60 * 1000);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("refreshes tokens using stored client id and falls back to old refresh token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchFn, now, refreshed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchFn = function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url, body;
                        return __generator(this, function (_a) {
                            url = String(input);
                            if (url !== chutes_oauth_js_1.CHUTES_TOKEN_ENDPOINT) {
                                return [2 /*return*/, new Response("not found", { status: 404 })];
                            }
                            (0, vitest_1.expect)(init === null || init === void 0 ? void 0 : init.method).toBe("POST");
                            body = init === null || init === void 0 ? void 0 : init.body;
                            (0, vitest_1.expect)(String(body.get("grant_type"))).toBe("refresh_token");
                            (0, vitest_1.expect)(String(body.get("client_id"))).toBe("cid_test");
                            (0, vitest_1.expect)(String(body.get("refresh_token"))).toBe("rt_old");
                            return [2 /*return*/, new Response(JSON.stringify({
                                    access_token: "at_new",
                                    expires_in: 1800,
                                }), { status: 200, headers: { "Content-Type": "application/json" } })];
                        });
                    }); };
                    now = 2000000;
                    return [4 /*yield*/, (0, chutes_oauth_js_1.refreshChutesTokens)({
                            credential: {
                                access: "at_old",
                                refresh: "rt_old",
                                expires: now - 10000,
                                email: "fred",
                                clientId: "cid_test",
                            },
                            fetchFn: fetchFn,
                            now: now,
                        })];
                case 1:
                    refreshed = _a.sent();
                    (0, vitest_1.expect)(refreshed.access).toBe("at_new");
                    (0, vitest_1.expect)(refreshed.refresh).toBe("rt_old");
                    (0, vitest_1.expect)(refreshed.expires).toBe(now + 1800 * 1000 - 5 * 60 * 1000);
                    return [2 /*return*/];
            }
        });
    }); });
});
