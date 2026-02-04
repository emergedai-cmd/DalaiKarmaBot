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
exports.loginQwenPortalOAuth = loginQwenPortalOAuth;
var node_crypto_1 = require("node:crypto");
var QWEN_OAUTH_BASE_URL = "https://chat.qwen.ai";
var QWEN_OAUTH_DEVICE_CODE_ENDPOINT = "".concat(QWEN_OAUTH_BASE_URL, "/api/v1/oauth2/device/code");
var QWEN_OAUTH_TOKEN_ENDPOINT = "".concat(QWEN_OAUTH_BASE_URL, "/api/v1/oauth2/token");
var QWEN_OAUTH_CLIENT_ID = "f0304373b74a44d2b584a3fb70ca9e56";
var QWEN_OAUTH_SCOPE = "openid profile email model.completion";
var QWEN_OAUTH_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code";
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
    return { verifier: verifier, challenge: challenge };
}
function requestDeviceCode(params) {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, payload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(QWEN_OAUTH_DEVICE_CODE_ENDPOINT, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Accept: "application/json",
                            "x-request-id": (0, node_crypto_1.randomUUID)(),
                        },
                        body: toFormUrlEncoded({
                            client_id: QWEN_OAUTH_CLIENT_ID,
                            scope: QWEN_OAUTH_SCOPE,
                            code_challenge: params.challenge,
                            code_challenge_method: "S256",
                        }),
                    })];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _b.sent();
                    throw new Error("Qwen device authorization failed: ".concat(text || response.statusText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    payload = (_b.sent());
                    if (!payload.device_code || !payload.user_code || !payload.verification_uri) {
                        throw new Error((_a = payload.error) !== null && _a !== void 0 ? _a : "Qwen device authorization returned an incomplete payload (missing user_code or verification_uri).");
                    }
                    return [2 /*return*/, payload];
            }
        });
    });
}
function pollDeviceToken(params) {
    return __awaiter(this, void 0, void 0, function () {
        var response, payload, _a, text, tokenPayload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(QWEN_OAUTH_TOKEN_ENDPOINT, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Accept: "application/json",
                        },
                        body: toFormUrlEncoded({
                            grant_type: QWEN_OAUTH_GRANT_TYPE,
                            client_id: QWEN_OAUTH_CLIENT_ID,
                            device_code: params.deviceCode,
                            code_verifier: params.verifier,
                        }),
                    })];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 7];
                    payload = void 0;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, response.json()];
                case 3:
                    payload = (_b.sent());
                    return [3 /*break*/, 6];
                case 4:
                    _a = _b.sent();
                    return [4 /*yield*/, response.text()];
                case 5:
                    text = _b.sent();
                    return [2 /*return*/, { status: "error", message: text || response.statusText }];
                case 6:
                    if ((payload === null || payload === void 0 ? void 0 : payload.error) === "authorization_pending") {
                        return [2 /*return*/, { status: "pending" }];
                    }
                    if ((payload === null || payload === void 0 ? void 0 : payload.error) === "slow_down") {
                        return [2 /*return*/, { status: "pending", slowDown: true }];
                    }
                    return [2 /*return*/, {
                            status: "error",
                            message: (payload === null || payload === void 0 ? void 0 : payload.error_description) || (payload === null || payload === void 0 ? void 0 : payload.error) || response.statusText,
                        }];
                case 7: return [4 /*yield*/, response.json()];
                case 8:
                    tokenPayload = (_b.sent());
                    if (!tokenPayload.access_token || !tokenPayload.refresh_token || !tokenPayload.expires_in) {
                        return [2 /*return*/, { status: "error", message: "Qwen OAuth returned incomplete token payload." }];
                    }
                    return [2 /*return*/, {
                            status: "success",
                            token: {
                                access: tokenPayload.access_token,
                                refresh: tokenPayload.refresh_token,
                                expires: Date.now() + tokenPayload.expires_in * 1000,
                                resourceUrl: tokenPayload.resource_url,
                            },
                        }];
            }
        });
    });
}
function loginQwenPortalOAuth(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, verifier, challenge, device, verificationUrl, _b, start, pollIntervalMs, timeoutMs, result;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = generatePkce(), verifier = _a.verifier, challenge = _a.challenge;
                    return [4 /*yield*/, requestDeviceCode({ challenge: challenge })];
                case 1:
                    device = _c.sent();
                    verificationUrl = device.verification_uri_complete || device.verification_uri;
                    return [4 /*yield*/, params.note([
                            "Open ".concat(verificationUrl, " to approve access."),
                            "If prompted, enter the code ".concat(device.user_code, "."),
                        ].join("\n"), "Qwen OAuth")];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, params.openUrl(verificationUrl)];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = _c.sent();
                    return [3 /*break*/, 6];
                case 6:
                    start = Date.now();
                    pollIntervalMs = device.interval ? device.interval * 1000 : 2000;
                    timeoutMs = device.expires_in * 1000;
                    _c.label = 7;
                case 7:
                    if (!(Date.now() - start < timeoutMs)) return [3 /*break*/, 10];
                    params.progress.update("Waiting for Qwen OAuth approval…");
                    return [4 /*yield*/, pollDeviceToken({
                            deviceCode: device.device_code,
                            verifier: verifier,
                        })];
                case 8:
                    result = _c.sent();
                    if (result.status === "success") {
                        return [2 /*return*/, result.token];
                    }
                    if (result.status === "error") {
                        throw new Error("Qwen OAuth failed: ".concat(result.message));
                    }
                    if (result.status === "pending" && result.slowDown) {
                        pollIntervalMs = Math.min(pollIntervalMs * 1.5, 10000);
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, pollIntervalMs); })];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 10: throw new Error("Qwen OAuth timed out waiting for authorization.");
            }
        });
    });
}
