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
exports.githubCopilotLoginCommand = githubCopilotLoginCommand;
var prompts_1 = require("@clack/prompts");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var shared_js_1 = require("../commands/models/shared.js");
var onboard_auth_js_1 = require("../commands/onboard-auth.js");
var logging_js_1 = require("../config/logging.js");
var prompt_style_js_1 = require("../terminal/prompt-style.js");
var CLIENT_ID = "Iv1.b507a08c87ecfe98";
var DEVICE_CODE_URL = "https://github.com/login/device/code";
var ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
function parseJsonResponse(value) {
    if (!value || typeof value !== "object") {
        throw new Error("Unexpected response from GitHub");
    }
    return value;
}
function requestDeviceCode(params) {
    return __awaiter(this, void 0, void 0, function () {
        var body, res, json, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    body = new URLSearchParams({
                        client_id: CLIENT_ID,
                        scope: params.scope,
                    });
                    return [4 /*yield*/, fetch(DEVICE_CODE_URL, {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: body,
                        })];
                case 1:
                    res = _b.sent();
                    if (!res.ok) {
                        throw new Error("GitHub device code failed: HTTP ".concat(res.status));
                    }
                    _a = parseJsonResponse;
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = _a.apply(void 0, [_b.sent()]);
                    if (!json.device_code || !json.user_code || !json.verification_uri) {
                        throw new Error("GitHub device code response missing fields");
                    }
                    return [2 /*return*/, json];
            }
        });
    });
}
function pollForAccessToken(params) {
    return __awaiter(this, void 0, void 0, function () {
        var bodyBase, res, json, _a, err;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    bodyBase = new URLSearchParams({
                        client_id: CLIENT_ID,
                        device_code: params.deviceCode,
                        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                    });
                    _b.label = 1;
                case 1:
                    if (!(Date.now() < params.expiresAt)) return [3 /*break*/, 8];
                    return [4 /*yield*/, fetch(ACCESS_TOKEN_URL, {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: bodyBase,
                        })];
                case 2:
                    res = _b.sent();
                    if (!res.ok) {
                        throw new Error("GitHub device token failed: HTTP ".concat(res.status));
                    }
                    _a = parseJsonResponse;
                    return [4 /*yield*/, res.json()];
                case 3:
                    json = _a.apply(void 0, [_b.sent()]);
                    if ("access_token" in json && typeof json.access_token === "string") {
                        return [2 /*return*/, json.access_token];
                    }
                    err = "error" in json ? json.error : "unknown";
                    if (!(err === "authorization_pending")) return [3 /*break*/, 5];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, params.intervalMs); })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 5:
                    if (!(err === "slow_down")) return [3 /*break*/, 7];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, params.intervalMs + 2000); })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 7:
                    if (err === "expired_token") {
                        throw new Error("GitHub device code expired; run login again");
                    }
                    if (err === "access_denied") {
                        throw new Error("GitHub login cancelled");
                    }
                    throw new Error("GitHub device flow error: ".concat(err));
                case 8: throw new Error("GitHub device code expired; run login again");
            }
        });
    });
}
function githubCopilotLoginCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var profileId, store, spin, device, expiresAt, intervalMs, polling, accessToken;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!process.stdin.isTTY) {
                        throw new Error("github-copilot login requires an interactive TTY.");
                    }
                    (0, prompts_1.intro)((0, prompt_style_js_1.stylePromptTitle)("GitHub Copilot login"));
                    profileId = ((_a = opts.profileId) === null || _a === void 0 ? void 0 : _a.trim()) || "github-copilot:github";
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(undefined, {
                        allowKeychainPrompt: false,
                    });
                    if (store.profiles[profileId] && !opts.yes) {
                        (0, prompts_1.note)("Auth profile already exists: ".concat(profileId, "\nRe-running will overwrite it."), (0, prompt_style_js_1.stylePromptTitle)("Existing credentials"));
                    }
                    spin = (0, prompts_1.spinner)();
                    spin.start("Requesting device code from GitHub...");
                    return [4 /*yield*/, requestDeviceCode({ scope: "read:user" })];
                case 1:
                    device = _b.sent();
                    spin.stop("Device code ready");
                    (0, prompts_1.note)(["Visit: ".concat(device.verification_uri), "Code: ".concat(device.user_code)].join("\n"), (0, prompt_style_js_1.stylePromptTitle)("Authorize"));
                    expiresAt = Date.now() + device.expires_in * 1000;
                    intervalMs = Math.max(1000, device.interval * 1000);
                    polling = (0, prompts_1.spinner)();
                    polling.start("Waiting for GitHub authorization...");
                    return [4 /*yield*/, pollForAccessToken({
                            deviceCode: device.device_code,
                            intervalMs: intervalMs,
                            expiresAt: expiresAt,
                        })];
                case 2:
                    accessToken = _b.sent();
                    polling.stop("GitHub access token acquired");
                    (0, auth_profiles_js_1.upsertAuthProfile)({
                        profileId: profileId,
                        credential: {
                            type: "token",
                            provider: "github-copilot",
                            token: accessToken,
                            // GitHub device flow token doesn't reliably include expiry here.
                            // Leave expires unset; we'll exchange into Copilot token plus expiry later.
                        },
                    });
                    return [4 /*yield*/, (0, shared_js_1.updateConfig)(function (cfg) {
                            return (0, onboard_auth_js_1.applyAuthProfileConfig)(cfg, {
                                provider: "github-copilot",
                                profileId: profileId,
                                mode: "token",
                            });
                        })];
                case 3:
                    _b.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    runtime.log("Auth profile: ".concat(profileId, " (github-copilot/token)"));
                    (0, prompts_1.outro)("Done");
                    return [2 /*return*/];
            }
        });
    });
}
