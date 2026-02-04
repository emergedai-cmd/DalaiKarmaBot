"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_http_1 = require("node:http");
var plugin_sdk_1 = require("openclaw/plugin-sdk");
// OAuth constants - decoded from pi-ai's base64 encoded values to stay in sync
var decode = function (s) { return Buffer.from(s, "base64").toString(); };
var CLIENT_ID = decode("MTA3MTAwNjA2MDU5MS10bWhzc2luMmgyMWxjcmUyMzV2dG9sb2poNGc0MDNlcC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbQ==");
var CLIENT_SECRET = decode("R09DU1BYLUs1OEZXUjQ4NkxkTEoxbUxCOHNYQzR6NnFEQWY=");
var REDIRECT_URI = "http://localhost:51121/oauth-callback";
var AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
var TOKEN_URL = "https://oauth2.googleapis.com/token";
var DEFAULT_PROJECT_ID = "rising-fact-p41fc";
var DEFAULT_MODEL = "google-antigravity/claude-opus-4-5-thinking";
var SCOPES = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/cclog",
    "https://www.googleapis.com/auth/experimentsandconfigs",
];
var CODE_ASSIST_ENDPOINTS = [
    "https://cloudcode-pa.googleapis.com",
    "https://daily-cloudcode-pa.sandbox.googleapis.com",
];
var RESPONSE_PAGE = "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>OpenClaw Antigravity OAuth</title>\n  </head>\n  <body>\n    <main>\n      <h1>Authentication complete</h1>\n      <p>You can return to the terminal.</p>\n    </main>\n  </body>\n</html>";
function generatePkce() {
    var verifier = (0, node_crypto_1.randomBytes)(32).toString("hex");
    var challenge = (0, node_crypto_1.createHash)("sha256").update(verifier).digest("base64url");
    return { verifier: verifier, challenge: challenge };
}
function isWSL() {
    if (process.platform !== "linux") {
        return false;
    }
    try {
        var release = (0, node_fs_1.readFileSync)("/proc/version", "utf8").toLowerCase();
        return release.includes("microsoft") || release.includes("wsl");
    }
    catch (_a) {
        return false;
    }
}
function isWSL2() {
    if (!isWSL()) {
        return false;
    }
    try {
        var version = (0, node_fs_1.readFileSync)("/proc/version", "utf8").toLowerCase();
        return version.includes("wsl2") || version.includes("microsoft-standard");
    }
    catch (_a) {
        return false;
    }
}
function shouldUseManualOAuthFlow(isRemote) {
    return isRemote || isWSL2();
}
function buildAuthUrl(params) {
    var url = new URL(AUTH_URL);
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", REDIRECT_URI);
    url.searchParams.set("scope", SCOPES.join(" "));
    url.searchParams.set("code_challenge", params.challenge);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("state", params.state);
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
    return url.toString();
}
function parseCallbackInput(input) {
    var trimmed = input.trim();
    if (!trimmed) {
        return { error: "No input provided" };
    }
    try {
        var url = new URL(trimmed);
        var code = url.searchParams.get("code");
        var state = url.searchParams.get("state");
        if (!code) {
            return { error: "Missing 'code' parameter in URL" };
        }
        if (!state) {
            return { error: "Missing 'state' parameter in URL" };
        }
        return { code: code, state: state };
    }
    catch (_a) {
        return { error: "Paste the full redirect URL (not just the code)." };
    }
}
function startCallbackServer(params) {
    return __awaiter(this, void 0, void 0, function () {
        var redirect, port, settled, resolveCallback, rejectCallback, callbackPromise, timeout, server;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    redirect = new URL(REDIRECT_URI);
                    port = redirect.port ? Number(redirect.port) : 51121;
                    settled = false;
                    callbackPromise = new Promise(function (resolve, reject) {
                        resolveCallback = function (url) {
                            if (settled) {
                                return;
                            }
                            settled = true;
                            resolve(url);
                        };
                        rejectCallback = function (err) {
                            if (settled) {
                                return;
                            }
                            settled = true;
                            reject(err);
                        };
                    });
                    timeout = setTimeout(function () {
                        rejectCallback(new Error("Timed out waiting for OAuth callback"));
                    }, params.timeoutMs);
                    (_a = timeout.unref) === null || _a === void 0 ? void 0 : _a.call(timeout);
                    server = (0, node_http_1.createServer)(function (request, response) {
                        if (!request.url) {
                            response.writeHead(400, { "Content-Type": "text/plain" });
                            response.end("Missing URL");
                            return;
                        }
                        var url = new URL(request.url, "".concat(redirect.protocol, "//").concat(redirect.host));
                        if (url.pathname !== redirect.pathname) {
                            response.writeHead(404, { "Content-Type": "text/plain" });
                            response.end("Not found");
                            return;
                        }
                        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                        response.end(RESPONSE_PAGE);
                        resolveCallback(url);
                        setImmediate(function () {
                            server.close();
                        });
                    });
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var onError = function (err) {
                                server.off("error", onError);
                                reject(err);
                            };
                            server.once("error", onError);
                            server.listen(port, "127.0.0.1", function () {
                                server.off("error", onError);
                                resolve();
                            });
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/, {
                            waitForCallback: function () { return callbackPromise; },
                            close: function () {
                                return new Promise(function (resolve) {
                                    server.close(function () { return resolve(); });
                                });
                            },
                        }];
            }
        });
    });
}
function exchangeCode(params) {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, data, access, refresh, expiresIn, expires;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fetch(TOKEN_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            client_id: CLIENT_ID,
                            client_secret: CLIENT_SECRET,
                            code: params.code,
                            grant_type: "authorization_code",
                            redirect_uri: REDIRECT_URI,
                            code_verifier: params.verifier,
                        }),
                    })];
                case 1:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _d.sent();
                    throw new Error("Token exchange failed: ".concat(text));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = (_d.sent());
                    access = (_a = data.access_token) === null || _a === void 0 ? void 0 : _a.trim();
                    refresh = (_b = data.refresh_token) === null || _b === void 0 ? void 0 : _b.trim();
                    expiresIn = (_c = data.expires_in) !== null && _c !== void 0 ? _c : 0;
                    if (!access) {
                        throw new Error("Token exchange returned no access_token");
                    }
                    if (!refresh) {
                        throw new Error("Token exchange returned no refresh_token");
                    }
                    expires = Date.now() + expiresIn * 1000 - 5 * 60 * 1000;
                    return [2 /*return*/, { access: access, refresh: refresh, expires: expires }];
            }
        });
    });
}
function fetchUserEmail(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
                            headers: { Authorization: "Bearer ".concat(accessToken) },
                        })];
                case 1:
                    response = _b.sent();
                    if (!response.ok) {
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_b.sent());
                    return [2 /*return*/, data.email];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchProjectId(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, _i, CODE_ASSIST_ENDPOINTS_1, endpoint, response, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    headers = {
                        Authorization: "Bearer ".concat(accessToken),
                        "Content-Type": "application/json",
                        "User-Agent": "google-api-nodejs-client/9.15.1",
                        "X-Goog-Api-Client": "google-cloud-sdk vscode_cloudshelleditor/0.1",
                        "Client-Metadata": JSON.stringify({
                            ideType: "IDE_UNSPECIFIED",
                            platform: "PLATFORM_UNSPECIFIED",
                            pluginType: "GEMINI",
                        }),
                    };
                    _i = 0, CODE_ASSIST_ENDPOINTS_1 = CODE_ASSIST_ENDPOINTS;
                    _b.label = 1;
                case 1:
                    if (!(_i < CODE_ASSIST_ENDPOINTS_1.length)) return [3 /*break*/, 7];
                    endpoint = CODE_ASSIST_ENDPOINTS_1[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(endpoint, "/v1internal:loadCodeAssist"), {
                            method: "POST",
                            headers: headers,
                            body: JSON.stringify({
                                metadata: {
                                    ideType: "IDE_UNSPECIFIED",
                                    platform: "PLATFORM_UNSPECIFIED",
                                    pluginType: "GEMINI",
                                },
                            }),
                        })];
                case 3:
                    response = _b.sent();
                    if (!response.ok) {
                        return [3 /*break*/, 6];
                    }
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = (_b.sent());
                    if (typeof data.cloudaicompanionProject === "string") {
                        return [2 /*return*/, data.cloudaicompanionProject];
                    }
                    if (data.cloudaicompanionProject &&
                        typeof data.cloudaicompanionProject === "object" &&
                        data.cloudaicompanionProject.id) {
                        return [2 /*return*/, data.cloudaicompanionProject.id];
                    }
                    return [3 /*break*/, 6];
                case 5:
                    _a = _b.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, DEFAULT_PROJECT_ID];
            }
        });
    });
}
function loginAntigravity(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, verifier, challenge, state, authUrl, callbackServer, needsManual, _b, _c, code, returnedState, callback, input, parsed, tokens, email, projectId;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = generatePkce(), verifier = _a.verifier, challenge = _a.challenge;
                    state = (0, node_crypto_1.randomBytes)(16).toString("hex");
                    authUrl = buildAuthUrl({ challenge: challenge, state: state });
                    callbackServer = null;
                    needsManual = shouldUseManualOAuthFlow(params.isRemote);
                    if (!!needsManual) return [3 /*break*/, 4];
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, startCallbackServer({ timeoutMs: 5 * 60 * 1000 })];
                case 2:
                    callbackServer = _f.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _b = _f.sent();
                    callbackServer = null;
                    return [3 /*break*/, 4];
                case 4:
                    if (!!callbackServer) return [3 /*break*/, 6];
                    return [4 /*yield*/, params.note([
                            "Open the URL in your local browser.",
                            "After signing in, copy the full redirect URL and paste it back here.",
                            "",
                            "Auth URL: ".concat(authUrl),
                            "Redirect URI: ".concat(REDIRECT_URI),
                        ].join("\n"), "Google Antigravity OAuth")];
                case 5:
                    _f.sent();
                    // Output raw URL below the box for easy copying (fixes #1772)
                    params.log("");
                    params.log("Copy this URL:");
                    params.log(authUrl);
                    params.log("");
                    _f.label = 6;
                case 6:
                    if (!!needsManual) return [3 /*break*/, 10];
                    params.progress.update("Opening Google sign-in…");
                    _f.label = 7;
                case 7:
                    _f.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, params.openUrl(authUrl)];
                case 8:
                    _f.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _c = _f.sent();
                    return [3 /*break*/, 10];
                case 10:
                    code = "";
                    returnedState = "";
                    if (!callbackServer) return [3 /*break*/, 13];
                    params.progress.update("Waiting for OAuth callback…");
                    return [4 /*yield*/, callbackServer.waitForCallback()];
                case 11:
                    callback = _f.sent();
                    code = (_d = callback.searchParams.get("code")) !== null && _d !== void 0 ? _d : "";
                    returnedState = (_e = callback.searchParams.get("state")) !== null && _e !== void 0 ? _e : "";
                    return [4 /*yield*/, callbackServer.close()];
                case 12:
                    _f.sent();
                    return [3 /*break*/, 15];
                case 13:
                    params.progress.update("Waiting for redirect URL…");
                    return [4 /*yield*/, params.prompt("Paste the redirect URL: ")];
                case 14:
                    input = _f.sent();
                    parsed = parseCallbackInput(input);
                    if ("error" in parsed) {
                        throw new Error(parsed.error);
                    }
                    code = parsed.code;
                    returnedState = parsed.state;
                    _f.label = 15;
                case 15:
                    if (!code) {
                        throw new Error("Missing OAuth code");
                    }
                    if (returnedState !== state) {
                        throw new Error("OAuth state mismatch. Please try again.");
                    }
                    params.progress.update("Exchanging code for tokens…");
                    return [4 /*yield*/, exchangeCode({ code: code, verifier: verifier })];
                case 16:
                    tokens = _f.sent();
                    return [4 /*yield*/, fetchUserEmail(tokens.access)];
                case 17:
                    email = _f.sent();
                    return [4 /*yield*/, fetchProjectId(tokens.access)];
                case 18:
                    projectId = _f.sent();
                    params.progress.stop("Antigravity OAuth complete");
                    return [2 /*return*/, __assign(__assign({}, tokens), { email: email, projectId: projectId })];
            }
        });
    });
}
var antigravityPlugin = {
    id: "google-antigravity-auth",
    name: "Google Antigravity Auth",
    description: "OAuth flow for Google Antigravity (Cloud Code Assist)",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        var _this = this;
        api.registerProvider({
            id: "google-antigravity",
            label: "Google Antigravity",
            docsPath: "/providers/models",
            aliases: ["antigravity"],
            auth: [
                {
                    id: "oauth",
                    label: "Google OAuth",
                    hint: "PKCE + localhost callback",
                    kind: "oauth",
                    run: function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                        var spin, result, profileId, err_1;
                        var _a;
                        var _this = this;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    spin = ctx.prompter.progress("Starting Antigravity OAuth…");
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, loginAntigravity({
                                            isRemote: ctx.isRemote,
                                            openUrl: ctx.openUrl,
                                            prompt: function (message) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        _a = String;
                                                        return [4 /*yield*/, ctx.prompter.text({ message: message })];
                                                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                                                }
                                            }); }); },
                                            note: ctx.prompter.note,
                                            log: function (message) { return ctx.runtime.log(message); },
                                            progress: spin,
                                        })];
                                case 2:
                                    result = _c.sent();
                                    profileId = "google-antigravity:".concat((_b = result.email) !== null && _b !== void 0 ? _b : "default");
                                    return [2 /*return*/, {
                                            profiles: [
                                                {
                                                    profileId: profileId,
                                                    credential: {
                                                        type: "oauth",
                                                        provider: "google-antigravity",
                                                        access: result.access,
                                                        refresh: result.refresh,
                                                        expires: result.expires,
                                                        email: result.email,
                                                        projectId: result.projectId,
                                                    },
                                                },
                                            ],
                                            configPatch: {
                                                agents: {
                                                    defaults: {
                                                        models: (_a = {},
                                                            _a[DEFAULT_MODEL] = {},
                                                            _a),
                                                    },
                                                },
                                            },
                                            defaultModel: DEFAULT_MODEL,
                                            notes: [
                                                "Antigravity uses Google Cloud project quotas.",
                                                "Enable Gemini for Google Cloud on your project if requests fail.",
                                            ],
                                        }];
                                case 3:
                                    err_1 = _c.sent();
                                    spin.stop("Antigravity OAuth failed");
                                    throw err_1;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); },
                },
            ],
        });
    },
};
exports.default = antigravityPlugin;
