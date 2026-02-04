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
exports.loginChutes = loginChutes;
var node_crypto_1 = require("node:crypto");
var node_http_1 = require("node:http");
var chutes_oauth_js_1 = require("../agents/chutes-oauth.js");
function buildAuthorizeUrl(params) {
    var qs = new URLSearchParams({
        client_id: params.clientId,
        redirect_uri: params.redirectUri,
        response_type: "code",
        scope: params.scopes.join(" "),
        state: params.state,
        code_challenge: params.challenge,
        code_challenge_method: "S256",
    });
    return "".concat(chutes_oauth_js_1.CHUTES_AUTHORIZE_ENDPOINT, "?").concat(qs.toString());
}
function waitForLocalCallback(params) {
    return __awaiter(this, void 0, void 0, function () {
        var redirectUrl, hostname, port, expectedPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    redirectUrl = new URL(params.redirectUri);
                    if (redirectUrl.protocol !== "http:") {
                        throw new Error("Chutes OAuth redirect URI must be http:// (got ".concat(params.redirectUri, ")"));
                    }
                    hostname = redirectUrl.hostname || "127.0.0.1";
                    port = redirectUrl.port ? Number.parseInt(redirectUrl.port, 10) : 80;
                    expectedPath = redirectUrl.pathname || "/";
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var timeout = null;
                            var server = (0, node_http_1.createServer)(function (req, res) {
                                var _a, _b, _c;
                                try {
                                    var requestUrl = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", redirectUrl.origin);
                                    if (requestUrl.pathname !== expectedPath) {
                                        res.statusCode = 404;
                                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                                        res.end("Not found");
                                        return;
                                    }
                                    var code = (_b = requestUrl.searchParams.get("code")) === null || _b === void 0 ? void 0 : _b.trim();
                                    var state = (_c = requestUrl.searchParams.get("state")) === null || _c === void 0 ? void 0 : _c.trim();
                                    if (!code) {
                                        res.statusCode = 400;
                                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                                        res.end("Missing code");
                                        return;
                                    }
                                    if (!state || state !== params.expectedState) {
                                        res.statusCode = 400;
                                        res.setHeader("Content-Type", "text/plain; charset=utf-8");
                                        res.end("Invalid state");
                                        return;
                                    }
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "text/html; charset=utf-8");
                                    res.end([
                                        "<!doctype html>",
                                        "<html><head><meta charset='utf-8' /></head>",
                                        "<body><h2>Chutes OAuth complete</h2>",
                                        "<p>You can close this window and return to OpenClaw.</p></body></html>",
                                    ].join(""));
                                    if (timeout) {
                                        clearTimeout(timeout);
                                    }
                                    server.close();
                                    resolve({ code: code, state: state });
                                }
                                catch (err) {
                                    if (timeout) {
                                        clearTimeout(timeout);
                                    }
                                    server.close();
                                    reject(err);
                                }
                            });
                            server.once("error", function (err) {
                                if (timeout) {
                                    clearTimeout(timeout);
                                }
                                server.close();
                                reject(err);
                            });
                            server.listen(port, hostname, function () {
                                var _a;
                                (_a = params.onProgress) === null || _a === void 0 ? void 0 : _a.call(params, "Waiting for OAuth callback on ".concat(redirectUrl.origin).concat(expectedPath, "\u2026"));
                            });
                            timeout = setTimeout(function () {
                                try {
                                    server.close();
                                }
                                catch (_a) { }
                                reject(new Error("OAuth callback timeout"));
                            }, params.timeoutMs);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function loginChutes(params) {
    return __awaiter(this, void 0, void 0, function () {
        var createPkce, createState, _a, verifier, challenge, state, timeoutMs, url, codeAndState, input, parsed, callback;
        var _this = this;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    createPkce = (_b = params.createPkce) !== null && _b !== void 0 ? _b : chutes_oauth_js_1.generateChutesPkce;
                    createState = (_c = params.createState) !== null && _c !== void 0 ? _c : (function () { return (0, node_crypto_1.randomBytes)(16).toString("hex"); });
                    _a = createPkce(), verifier = _a.verifier, challenge = _a.challenge;
                    state = createState();
                    timeoutMs = (_d = params.timeoutMs) !== null && _d !== void 0 ? _d : 3 * 60 * 1000;
                    url = buildAuthorizeUrl({
                        clientId: params.app.clientId,
                        redirectUri: params.app.redirectUri,
                        scopes: params.app.scopes,
                        state: state,
                        challenge: challenge,
                    });
                    if (!params.manual) return [3 /*break*/, 3];
                    return [4 /*yield*/, params.onAuth({ url: url })];
                case 1:
                    _g.sent();
                    (_e = params.onProgress) === null || _e === void 0 ? void 0 : _e.call(params, "Waiting for redirect URL…");
                    return [4 /*yield*/, params.onPrompt({
                            message: "Paste the redirect URL (or authorization code)",
                            placeholder: "".concat(params.app.redirectUri, "?code=...&state=..."),
                        })];
                case 2:
                    input = _g.sent();
                    parsed = (0, chutes_oauth_js_1.parseOAuthCallbackInput)(String(input), state);
                    if ("error" in parsed) {
                        throw new Error(parsed.error);
                    }
                    if (parsed.state !== state) {
                        throw new Error("Invalid OAuth state");
                    }
                    codeAndState = parsed;
                    return [3 /*break*/, 6];
                case 3:
                    callback = waitForLocalCallback({
                        redirectUri: params.app.redirectUri,
                        expectedState: state,
                        timeoutMs: timeoutMs,
                        onProgress: params.onProgress,
                    }).catch(function () { return __awaiter(_this, void 0, void 0, function () {
                        var input, parsed;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    (_a = params.onProgress) === null || _a === void 0 ? void 0 : _a.call(params, "OAuth callback not detected; paste redirect URL…");
                                    return [4 /*yield*/, params.onPrompt({
                                            message: "Paste the redirect URL (or authorization code)",
                                            placeholder: "".concat(params.app.redirectUri, "?code=...&state=..."),
                                        })];
                                case 1:
                                    input = _b.sent();
                                    parsed = (0, chutes_oauth_js_1.parseOAuthCallbackInput)(String(input), state);
                                    if ("error" in parsed) {
                                        throw new Error(parsed.error);
                                    }
                                    if (parsed.state !== state) {
                                        throw new Error("Invalid OAuth state");
                                    }
                                    return [2 /*return*/, parsed];
                            }
                        });
                    }); });
                    return [4 /*yield*/, params.onAuth({ url: url })];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, callback];
                case 5:
                    codeAndState = _g.sent();
                    _g.label = 6;
                case 6:
                    (_f = params.onProgress) === null || _f === void 0 ? void 0 : _f.call(params, "Exchanging code for tokens…");
                    return [4 /*yield*/, (0, chutes_oauth_js_1.exchangeChutesCodeForTokens)({
                            app: params.app,
                            code: codeAndState.code,
                            codeVerifier: verifier,
                            fetchFn: params.fetchFn,
                        })];
                case 7: return [2 /*return*/, _g.sent()];
            }
        });
    });
}
