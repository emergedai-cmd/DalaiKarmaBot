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
exports.loginMiniMaxPortalOAuth = loginMiniMaxPortalOAuth;
var node_crypto_1 = require("node:crypto");
var MINIMAX_OAUTH_CONFIG = {
    cn: {
        baseUrl: "https://api.minimaxi.com",
        clientId: "78257093-7e40-4613-99e0-527b14b39113",
    },
    global: {
        baseUrl: "https://api.minimax.io",
        clientId: "78257093-7e40-4613-99e0-527b14b39113",
    },
};
var MINIMAX_OAUTH_SCOPE = "group_id profile model.completion";
var MINIMAX_OAUTH_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:user_code";
function getOAuthEndpoints(region) {
    var config = MINIMAX_OAUTH_CONFIG[region];
    return {
        codeEndpoint: "".concat(config.baseUrl, "/oauth/code"),
        tokenEndpoint: "".concat(config.baseUrl, "/oauth/token"),
        clientId: config.clientId,
        baseUrl: config.baseUrl,
    };
}
function toFormUrlEncoded(data) {
    return Object.entries(data)
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value));
    })
        .join("&");
}
function generatePkce() {
    var verifier = (0, node_crypto_1.randomBytes)(32).toString("base64url");
    var challenge = (0, node_crypto_1.createHash)("sha256").update(verifier).digest("base64url");
    var state = (0, node_crypto_1.randomBytes)(16).toString("base64url");
    return { verifier: verifier, challenge: challenge, state: state };
}
function requestOAuthCode(params) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoints, response, text, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    endpoints = getOAuthEndpoints(params.region);
                    return [4 /*yield*/, fetch(endpoints.codeEndpoint, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                Accept: "application/json",
                                "x-request-id": (0, node_crypto_1.randomUUID)(),
                            },
                            body: toFormUrlEncoded({
                                response_type: "code",
                                client_id: endpoints.clientId,
                                scope: MINIMAX_OAUTH_SCOPE,
                                code_challenge: params.challenge,
                                code_challenge_method: "S256",
                                state: params.state,
                            }),
                        })];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _b.sent();
                    throw new Error("MiniMax OAuth authorization failed: ".concat(text || response.statusText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    payload = (_b.sent());
                    if (!payload.user_code || !payload.verification_uri) {
                        throw new Error((_a = payload.error) !== null && _a !== void 0 ? _a : "MiniMax OAuth authorization returned an incomplete payload (missing user_code or verification_uri).");
                    }
                    if (payload.state !== params.state) {
                        throw new Error("MiniMax OAuth state mismatch: possible CSRF attack or session corruption.");
                    }
                    return [2 /*return*/, payload];
            }
        });
    });
}
function pollOAuthToken(params) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoints, response, text, payload, tokenPayload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    endpoints = getOAuthEndpoints(params.region);
                    return [4 /*yield*/, fetch(endpoints.tokenEndpoint, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                Accept: "application/json",
                            },
                            body: toFormUrlEncoded({
                                grant_type: MINIMAX_OAUTH_GRANT_TYPE,
                                client_id: endpoints.clientId,
                                user_code: params.userCode,
                                code_verifier: params.verifier,
                            }),
                        })];
                case 1:
                    response = _c.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _c.sent();
                    if (text) {
                        try {
                            payload = JSON.parse(text);
                        }
                        catch (_d) {
                            payload = undefined;
                        }
                    }
                    if (!response.ok) {
                        return [2 /*return*/, {
                                status: "error",
                                message: ((_b = (_a = payload === null || payload === void 0 ? void 0 : payload.base_resp) === null || _a === void 0 ? void 0 : _a.status_msg) !== null && _b !== void 0 ? _b : text) || "MiniMax OAuth failed to parse response.",
                            }];
                    }
                    if (!payload) {
                        return [2 /*return*/, { status: "error", message: "MiniMax OAuth failed to parse response." }];
                    }
                    tokenPayload = payload;
                    if (tokenPayload.status === "error") {
                        return [2 /*return*/, { status: "error", message: "An error occurred. Please try again later" }];
                    }
                    if (tokenPayload.status != "success") {
                        return [2 /*return*/, { status: "pending", message: "current user code is not authorized" }];
                    }
                    if (!tokenPayload.access_token || !tokenPayload.refresh_token || !tokenPayload.expired_in) {
                        return [2 /*return*/, { status: "error", message: "MiniMax OAuth returned incomplete token payload." }];
                    }
                    return [2 /*return*/, {
                            status: "success",
                            token: {
                                access: tokenPayload.access_token,
                                refresh: tokenPayload.refresh_token,
                                expires: tokenPayload.expired_in,
                                resourceUrl: tokenPayload.resource_url,
                                notification_message: tokenPayload.notification_message,
                            },
                        }];
            }
        });
    });
}
function loginMiniMaxPortalOAuth(params) {
    return __awaiter(this, void 0, void 0, function () {
        var region, _a, verifier, challenge, state, oauth, verificationUrl, noteLines, _b, pollIntervalMs, expireTimeMs, result;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    region = (_c = params.region) !== null && _c !== void 0 ? _c : "global";
                    _a = generatePkce(), verifier = _a.verifier, challenge = _a.challenge, state = _a.state;
                    return [4 /*yield*/, requestOAuthCode({ challenge: challenge, state: state, region: region })];
                case 1:
                    oauth = _e.sent();
                    verificationUrl = oauth.verification_uri;
                    noteLines = [
                        "Open ".concat(verificationUrl, " to approve access."),
                        "If prompted, enter the code ".concat(oauth.user_code, "."),
                        "Interval: ".concat((_d = oauth.interval) !== null && _d !== void 0 ? _d : "default (2000ms)", ", Expires at: ").concat(oauth.expired_in, " unix timestamp"),
                    ];
                    return [4 /*yield*/, params.note(noteLines.join("\n"), "MiniMax OAuth")];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, params.openUrl(verificationUrl)];
                case 4:
                    _e.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = _e.sent();
                    return [3 /*break*/, 6];
                case 6:
                    pollIntervalMs = oauth.interval ? oauth.interval : 2000;
                    expireTimeMs = oauth.expired_in;
                    _e.label = 7;
                case 7:
                    if (!(Date.now() < expireTimeMs)) return [3 /*break*/, 10];
                    params.progress.update("Waiting for MiniMax OAuth approval…");
                    return [4 /*yield*/, pollOAuthToken({
                            userCode: oauth.user_code,
                            verifier: verifier,
                            region: region,
                        })];
                case 8:
                    result = _e.sent();
                    // // Debug: print poll result
                    // await params.note(
                    //   `status: ${result.status}` +
                    //     (result.status === "success" ? `\ntoken: ${JSON.stringify(result.token, null, 2)}` : "") +
                    //     (result.status === "error" ? `\nmessage: ${result.message}` : "") +
                    //     (result.status === "pending" && result.message ? `\nmessage: ${result.message}` : ""),
                    //   "MiniMax OAuth Poll Result",
                    // );
                    if (result.status === "success") {
                        return [2 /*return*/, result.token];
                    }
                    if (result.status === "error") {
                        throw new Error("MiniMax OAuth failed: ".concat(result.message));
                    }
                    if (result.status === "pending") {
                        pollIntervalMs = Math.min(pollIntervalMs * 1.5, 10000);
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, pollIntervalMs); })];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 7];
                case 10: throw new Error("MiniMax OAuth timed out waiting for authorization.");
            }
        });
    });
}
