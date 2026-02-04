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
exports.applyAuthChoiceOAuth = applyAuthChoiceOAuth;
var chutes_oauth_js_1 = require("./chutes-oauth.js");
var oauth_env_js_1 = require("./oauth-env.js");
var oauth_flow_js_1 = require("./oauth-flow.js");
var onboard_auth_js_1 = require("./onboard-auth.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
function applyAuthChoiceOAuth(params) {
    return __awaiter(this, void 0, void 0, function () {
        var nextConfig, isRemote, redirectUri, scopes, clientId, _a, _b, clientSecret, spin_1, _c, onAuth, onPrompt, creds, email, profileId, err_1;
        var _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!(params.authChoice === "chutes")) return [3 /*break*/, 10];
                    nextConfig = params.config;
                    isRemote = (0, oauth_env_js_1.isRemoteEnvironment)();
                    redirectUri = ((_d = process.env.CHUTES_OAUTH_REDIRECT_URI) === null || _d === void 0 ? void 0 : _d.trim()) || "http://127.0.0.1:1456/oauth-callback";
                    scopes = ((_e = process.env.CHUTES_OAUTH_SCOPES) === null || _e === void 0 ? void 0 : _e.trim()) || "openid profile chutes:invoke";
                    _a = ((_f = process.env.CHUTES_CLIENT_ID) === null || _f === void 0 ? void 0 : _f.trim());
                    if (_a) return [3 /*break*/, 2];
                    _b = String;
                    return [4 /*yield*/, params.prompter.text({
                            message: "Enter Chutes OAuth client id",
                            placeholder: "cid_xxx",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 1:
                    _a = _b.apply(void 0, [_h.sent()]).trim();
                    _h.label = 2;
                case 2:
                    clientId = _a;
                    clientSecret = ((_g = process.env.CHUTES_CLIENT_SECRET) === null || _g === void 0 ? void 0 : _g.trim()) || undefined;
                    return [4 /*yield*/, params.prompter.note(isRemote
                            ? [
                                "You are running in a remote/VPS environment.",
                                "A URL will be shown for you to open in your LOCAL browser.",
                                "After signing in, paste the redirect URL back here.",
                                "",
                                "Redirect URI: ".concat(redirectUri),
                            ].join("\n")
                            : [
                                "Browser will open for Chutes authentication.",
                                "If the callback doesn't auto-complete, paste the redirect URL.",
                                "",
                                "Redirect URI: ".concat(redirectUri),
                            ].join("\n"), "Chutes OAuth")];
                case 3:
                    _h.sent();
                    spin_1 = params.prompter.progress("Starting OAuth flow…");
                    _h.label = 4;
                case 4:
                    _h.trys.push([4, 7, , 9]);
                    _c = (0, oauth_flow_js_1.createVpsAwareOAuthHandlers)({
                        isRemote: isRemote,
                        prompter: params.prompter,
                        runtime: params.runtime,
                        spin: spin_1,
                        openUrl: onboard_helpers_js_1.openUrl,
                        localBrowserMessage: "Complete sign-in in browser…",
                    }), onAuth = _c.onAuth, onPrompt = _c.onPrompt;
                    return [4 /*yield*/, (0, chutes_oauth_js_1.loginChutes)({
                            app: {
                                clientId: clientId,
                                clientSecret: clientSecret,
                                redirectUri: redirectUri,
                                scopes: scopes.split(/\s+/).filter(Boolean),
                            },
                            manual: isRemote,
                            onAuth: onAuth,
                            onPrompt: onPrompt,
                            onProgress: function (msg) { return spin_1.update(msg); },
                        })];
                case 5:
                    creds = _h.sent();
                    spin_1.stop("Chutes OAuth complete");
                    email = typeof creds.email === "string" && creds.email.trim() ? creds.email.trim() : "default";
                    profileId = "chutes:".concat(email);
                    return [4 /*yield*/, (0, onboard_auth_js_1.writeOAuthCredentials)("chutes", creds, params.agentDir)];
                case 6:
                    _h.sent();
                    nextConfig = (0, onboard_auth_js_1.applyAuthProfileConfig)(nextConfig, {
                        profileId: profileId,
                        provider: "chutes",
                        mode: "oauth",
                    });
                    return [3 /*break*/, 9];
                case 7:
                    err_1 = _h.sent();
                    spin_1.stop("Chutes OAuth failed");
                    params.runtime.error(String(err_1));
                    return [4 /*yield*/, params.prompter.note([
                            "Trouble with OAuth?",
                            "Verify CHUTES_CLIENT_ID (and CHUTES_CLIENT_SECRET if required).",
                            "Verify the OAuth app redirect URI includes: ".concat(redirectUri),
                            "Chutes docs: https://chutes.ai/docs/sign-in-with-chutes/overview",
                        ].join("\n"), "OAuth help")];
                case 8:
                    _h.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, { config: nextConfig }];
                case 10: return [2 /*return*/, null];
            }
        });
    });
}
