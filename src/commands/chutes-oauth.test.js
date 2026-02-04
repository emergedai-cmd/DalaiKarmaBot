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
var node_net_1 = require("node:net");
var vitest_1 = require("vitest");
var chutes_oauth_js_1 = require("../agents/chutes-oauth.js");
var chutes_oauth_js_2 = require("./chutes-oauth.js");
function getFreePort() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var server = node_net_1.default.createServer();
                        server.once("error", reject);
                        server.listen(0, "127.0.0.1", function () {
                            var address = server.address();
                            if (!address || typeof address === "string") {
                                server.close(function () { return reject(new Error("No TCP address")); });
                                return;
                            }
                            var port = address.port;
                            server.close(function (err) { return (err ? reject(err) : resolve(port)); });
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
(0, vitest_1.describe)("loginChutes", function () {
    (0, vitest_1.it)("captures local redirect and exchanges code for tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
        var port, redirectUri, fetchFn, onPrompt, creds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFreePort()];
                case 1:
                    port = _a.sent();
                    redirectUri = "http://127.0.0.1:".concat(port, "/oauth-callback");
                    fetchFn = function (input, init) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = String(input);
                            if (url === chutes_oauth_js_1.CHUTES_TOKEN_ENDPOINT) {
                                return [2 /*return*/, new Response(JSON.stringify({
                                        access_token: "at_local",
                                        refresh_token: "rt_local",
                                        expires_in: 3600,
                                    }), { status: 200, headers: { "Content-Type": "application/json" } })];
                            }
                            if (url === chutes_oauth_js_1.CHUTES_USERINFO_ENDPOINT) {
                                return [2 /*return*/, new Response(JSON.stringify({ username: "local-user" }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                            }
                            return [2 /*return*/, fetch(input, init)];
                        });
                    }); };
                    onPrompt = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("onPrompt should not be called for local callback");
                        });
                    }); });
                    return [4 /*yield*/, (0, chutes_oauth_js_2.loginChutes)({
                            app: { clientId: "cid_test", redirectUri: redirectUri, scopes: ["openid"] },
                            onAuth: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                                var state;
                                var url = _b.url;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            state = new URL(url).searchParams.get("state");
                                            (0, vitest_1.expect)(state).toBeTruthy();
                                            return [4 /*yield*/, fetch("".concat(redirectUri, "?code=code_local&state=").concat(state))];
                                        case 1:
                                            _c.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            onPrompt: onPrompt,
                            fetchFn: fetchFn,
                        })];
                case 2:
                    creds = _a.sent();
                    (0, vitest_1.expect)(onPrompt).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(creds.access).toBe("at_local");
                    (0, vitest_1.expect)(creds.refresh).toBe("rt_local");
                    (0, vitest_1.expect)(creds.email).toBe("local-user");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("supports manual flow with pasted code", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchFn, creds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchFn = function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = String(input);
                            if (url === chutes_oauth_js_1.CHUTES_TOKEN_ENDPOINT) {
                                return [2 /*return*/, new Response(JSON.stringify({
                                        access_token: "at_manual",
                                        refresh_token: "rt_manual",
                                        expires_in: 3600,
                                    }), { status: 200, headers: { "Content-Type": "application/json" } })];
                            }
                            if (url === chutes_oauth_js_1.CHUTES_USERINFO_ENDPOINT) {
                                return [2 /*return*/, new Response(JSON.stringify({ username: "manual-user" }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                            }
                            return [2 /*return*/, new Response("not found", { status: 404 })];
                        });
                    }); };
                    return [4 /*yield*/, (0, chutes_oauth_js_2.loginChutes)({
                            app: {
                                clientId: "cid_test",
                                redirectUri: "http://127.0.0.1:1456/oauth-callback",
                                scopes: ["openid"],
                            },
                            manual: true,
                            onAuth: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/];
                            }); }); },
                            onPrompt: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, "code_manual"];
                            }); }); },
                            fetchFn: fetchFn,
                        })];
                case 1:
                    creds = _a.sent();
                    (0, vitest_1.expect)(creds.access).toBe("at_manual");
                    (0, vitest_1.expect)(creds.refresh).toBe("rt_manual");
                    (0, vitest_1.expect)(creds.email).toBe("manual-user");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not reuse code_verifier as state", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchFn, createPkce, createState, creds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchFn = function (input) { return __awaiter(void 0, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            url = String(input);
                            if (url === chutes_oauth_js_1.CHUTES_TOKEN_ENDPOINT) {
                                return [2 /*return*/, new Response(JSON.stringify({
                                        access_token: "at_manual",
                                        refresh_token: "rt_manual",
                                        expires_in: 3600,
                                    }), { status: 200, headers: { "Content-Type": "application/json" } })];
                            }
                            if (url === chutes_oauth_js_1.CHUTES_USERINFO_ENDPOINT) {
                                return [2 /*return*/, new Response(JSON.stringify({ username: "manual-user" }), {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                    })];
                            }
                            return [2 /*return*/, new Response("not found", { status: 404 })];
                        });
                    }); };
                    createPkce = function () { return ({
                        verifier: "verifier_123",
                        challenge: "chal_123",
                    }); };
                    createState = function () { return "state_456"; };
                    return [4 /*yield*/, (0, chutes_oauth_js_2.loginChutes)({
                            app: {
                                clientId: "cid_test",
                                redirectUri: "http://127.0.0.1:1456/oauth-callback",
                                scopes: ["openid"],
                            },
                            manual: true,
                            createPkce: createPkce,
                            createState: createState,
                            onAuth: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                                var parsed;
                                var url = _b.url;
                                return __generator(this, function (_c) {
                                    parsed = new URL(url);
                                    (0, vitest_1.expect)(parsed.searchParams.get("state")).toBe("state_456");
                                    (0, vitest_1.expect)(parsed.searchParams.get("state")).not.toBe("verifier_123");
                                    return [2 /*return*/];
                                });
                            }); },
                            onPrompt: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, "code_manual"];
                            }); }); },
                            fetchFn: fetchFn,
                        })];
                case 1:
                    creds = _a.sent();
                    (0, vitest_1.expect)(creds.access).toBe("at_manual");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects pasted redirect URLs missing state", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchFn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchFn = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, new Response("not found", { status: 404 })];
                    }); }); };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, chutes_oauth_js_2.loginChutes)({
                            app: {
                                clientId: "cid_test",
                                redirectUri: "http://127.0.0.1:1456/oauth-callback",
                                scopes: ["openid"],
                            },
                            manual: true,
                            createPkce: function () { return ({ verifier: "verifier_123", challenge: "chal_123" }); },
                            createState: function () { return "state_456"; },
                            onAuth: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/];
                            }); }); },
                            onPrompt: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, "http://127.0.0.1:1456/oauth-callback?code=code_only"];
                            }); }); },
                            fetchFn: fetchFn,
                        })).rejects.toThrow("Missing 'state' parameter")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
