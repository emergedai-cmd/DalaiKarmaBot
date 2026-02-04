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
exports.clearCredentialsCache = clearCredentialsCache;
exports.extractGeminiCliCredentials = extractGeminiCliCredentials;
exports.loginGeminiCliOAuth = loginGeminiCliOAuth;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_http_1 = require("node:http");
var node_path_1 = require("node:path");
var CLIENT_ID_KEYS = ["OPENCLAW_GEMINI_OAUTH_CLIENT_ID", "GEMINI_CLI_OAUTH_CLIENT_ID"];
var CLIENT_SECRET_KEYS = [
    "OPENCLAW_GEMINI_OAUTH_CLIENT_SECRET",
    "GEMINI_CLI_OAUTH_CLIENT_SECRET",
];
var REDIRECT_URI = "http://localhost:8085/oauth2callback";
var AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
var TOKEN_URL = "https://oauth2.googleapis.com/token";
var USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
var CODE_ASSIST_ENDPOINT = "https://cloudcode-pa.googleapis.com";
var SCOPES = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];
var TIER_FREE = "free-tier";
var TIER_LEGACY = "legacy-tier";
var TIER_STANDARD = "standard-tier";
function resolveEnv(keys) {
    var _a;
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var value = (_a = process.env[key]) === null || _a === void 0 ? void 0 : _a.trim();
        if (value) {
            return value;
        }
    }
    return undefined;
}
var cachedGeminiCliCredentials = null;
/** @internal */
function clearCredentialsCache() {
    cachedGeminiCliCredentials = null;
}
/** Extracts OAuth credentials from the installed Gemini CLI's bundled oauth2.js. */
function extractGeminiCliCredentials() {
    if (cachedGeminiCliCredentials) {
        return cachedGeminiCliCredentials;
    }
    try {
        var geminiPath = findInPath("gemini");
        if (!geminiPath) {
            return null;
        }
        var resolvedPath = (0, node_fs_1.realpathSync)(geminiPath);
        var geminiCliDir = (0, node_path_1.dirname)((0, node_path_1.dirname)(resolvedPath));
        var searchPaths = [
            (0, node_path_1.join)(geminiCliDir, "node_modules", "@google", "gemini-cli-core", "dist", "src", "code_assist", "oauth2.js"),
            (0, node_path_1.join)(geminiCliDir, "node_modules", "@google", "gemini-cli-core", "dist", "code_assist", "oauth2.js"),
        ];
        var content = null;
        for (var _i = 0, searchPaths_1 = searchPaths; _i < searchPaths_1.length; _i++) {
            var p = searchPaths_1[_i];
            if ((0, node_fs_1.existsSync)(p)) {
                content = (0, node_fs_1.readFileSync)(p, "utf8");
                break;
            }
        }
        if (!content) {
            var found = findFile(geminiCliDir, "oauth2.js", 10);
            if (found) {
                content = (0, node_fs_1.readFileSync)(found, "utf8");
            }
        }
        if (!content) {
            return null;
        }
        var idMatch = content.match(/(\d+-[a-z0-9]+\.apps\.googleusercontent\.com)/);
        var secretMatch = content.match(/(GOCSPX-[A-Za-z0-9_-]+)/);
        if (idMatch && secretMatch) {
            cachedGeminiCliCredentials = { clientId: idMatch[1], clientSecret: secretMatch[1] };
            return cachedGeminiCliCredentials;
        }
    }
    catch (_a) {
        // Gemini CLI not installed or extraction failed
    }
    return null;
}
function findInPath(name) {
    var _a;
    var exts = process.platform === "win32" ? [".cmd", ".bat", ".exe", ""] : [""];
    for (var _i = 0, _b = ((_a = process.env.PATH) !== null && _a !== void 0 ? _a : "").split(node_path_1.delimiter); _i < _b.length; _i++) {
        var dir = _b[_i];
        for (var _c = 0, exts_1 = exts; _c < exts_1.length; _c++) {
            var ext = exts_1[_c];
            var p = (0, node_path_1.join)(dir, name + ext);
            if ((0, node_fs_1.existsSync)(p)) {
                return p;
            }
        }
    }
    return null;
}
function findFile(dir, name, depth) {
    if (depth <= 0) {
        return null;
    }
    try {
        for (var _i = 0, _a = (0, node_fs_1.readdirSync)(dir, { withFileTypes: true }); _i < _a.length; _i++) {
            var e = _a[_i];
            var p = (0, node_path_1.join)(dir, e.name);
            if (e.isFile() && e.name === name) {
                return p;
            }
            if (e.isDirectory() && !e.name.startsWith(".")) {
                var found = findFile(p, name, depth - 1);
                if (found) {
                    return found;
                }
            }
        }
    }
    catch (_b) { }
    return null;
}
function resolveOAuthClientConfig() {
    // 1. Check env vars first (user override)
    var envClientId = resolveEnv(CLIENT_ID_KEYS);
    var envClientSecret = resolveEnv(CLIENT_SECRET_KEYS);
    if (envClientId) {
        return { clientId: envClientId, clientSecret: envClientSecret };
    }
    // 2. Try to extract from installed Gemini CLI
    var extracted = extractGeminiCliCredentials();
    if (extracted) {
        return extracted;
    }
    // 3. No credentials available
    throw new Error("Gemini CLI not found. Install it first: brew install gemini-cli (or npm install -g @google/gemini-cli), or set GEMINI_CLI_OAUTH_CLIENT_ID.");
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
function generatePkce() {
    var verifier = (0, node_crypto_1.randomBytes)(32).toString("hex");
    var challenge = (0, node_crypto_1.createHash)("sha256").update(verifier).digest("base64url");
    return { verifier: verifier, challenge: challenge };
}
function buildAuthUrl(challenge, verifier) {
    var clientId = resolveOAuthClientConfig().clientId;
    var params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(" "),
        code_challenge: challenge,
        code_challenge_method: "S256",
        state: verifier,
        access_type: "offline",
        prompt: "consent",
    });
    return "".concat(AUTH_URL, "?").concat(params.toString());
}
function parseCallbackInput(input, expectedState) {
    var _a;
    var trimmed = input.trim();
    if (!trimmed) {
        return { error: "No input provided" };
    }
    try {
        var url = new URL(trimmed);
        var code = url.searchParams.get("code");
        var state = (_a = url.searchParams.get("state")) !== null && _a !== void 0 ? _a : expectedState;
        if (!code) {
            return { error: "Missing 'code' parameter in URL" };
        }
        if (!state) {
            return { error: "Missing 'state' parameter. Paste the full URL." };
        }
        return { code: code, state: state };
    }
    catch (_b) {
        if (!expectedState) {
            return { error: "Paste the full redirect URL, not just the code." };
        }
        return { code: trimmed, state: expectedState };
    }
}
function waitForLocalCallback(params) {
    return __awaiter(this, void 0, void 0, function () {
        var port, hostname, expectedPath;
        return __generator(this, function (_a) {
            port = 8085;
            hostname = "localhost";
            expectedPath = "/oauth2callback";
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var timeout = null;
                    var server = (0, node_http_1.createServer)(function (req, res) {
                        var _a, _b, _c;
                        try {
                            var requestUrl = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", "http://".concat(hostname, ":").concat(port));
                            if (requestUrl.pathname !== expectedPath) {
                                res.statusCode = 404;
                                res.setHeader("Content-Type", "text/plain");
                                res.end("Not found");
                                return;
                            }
                            var error = requestUrl.searchParams.get("error");
                            var code = (_b = requestUrl.searchParams.get("code")) === null || _b === void 0 ? void 0 : _b.trim();
                            var state = (_c = requestUrl.searchParams.get("state")) === null || _c === void 0 ? void 0 : _c.trim();
                            if (error) {
                                res.statusCode = 400;
                                res.setHeader("Content-Type", "text/plain");
                                res.end("Authentication failed: ".concat(error));
                                finish(new Error("OAuth error: ".concat(error)));
                                return;
                            }
                            if (!code || !state) {
                                res.statusCode = 400;
                                res.setHeader("Content-Type", "text/plain");
                                res.end("Missing code or state");
                                finish(new Error("Missing OAuth code or state"));
                                return;
                            }
                            if (state !== params.expectedState) {
                                res.statusCode = 400;
                                res.setHeader("Content-Type", "text/plain");
                                res.end("Invalid state");
                                finish(new Error("OAuth state mismatch"));
                                return;
                            }
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "text/html; charset=utf-8");
                            res.end("<!doctype html><html><head><meta charset='utf-8'/></head>" +
                                "<body><h2>Gemini CLI OAuth complete</h2>" +
                                "<p>You can close this window and return to OpenClaw.</p></body></html>");
                            finish(undefined, { code: code, state: state });
                        }
                        catch (err) {
                            finish(err instanceof Error ? err : new Error("OAuth callback failed"));
                        }
                    });
                    var finish = function (err, result) {
                        if (timeout) {
                            clearTimeout(timeout);
                        }
                        try {
                            server.close();
                        }
                        catch (_a) {
                            // ignore close errors
                        }
                        if (err) {
                            reject(err);
                        }
                        else if (result) {
                            resolve(result);
                        }
                    };
                    server.once("error", function (err) {
                        finish(err instanceof Error ? err : new Error("OAuth callback server error"));
                    });
                    server.listen(port, hostname, function () {
                        var _a;
                        (_a = params.onProgress) === null || _a === void 0 ? void 0 : _a.call(params, "Waiting for OAuth callback on ".concat(REDIRECT_URI, "\u2026"));
                    });
                    timeout = setTimeout(function () {
                        finish(new Error("OAuth callback timeout"));
                    }, params.timeoutMs);
                })];
        });
    });
}
function exchangeCodeForTokens(code, verifier) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, clientId, clientSecret, body, response, errorText, data, email, projectId, expiresAt;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = resolveOAuthClientConfig(), clientId = _a.clientId, clientSecret = _a.clientSecret;
                    body = new URLSearchParams({
                        client_id: clientId,
                        code: code,
                        grant_type: "authorization_code",
                        redirect_uri: REDIRECT_URI,
                        code_verifier: verifier,
                    });
                    if (clientSecret) {
                        body.set("client_secret", clientSecret);
                    }
                    return [4 /*yield*/, fetch(TOKEN_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: body,
                        })];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _b.sent();
                    throw new Error("Token exchange failed: ".concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = (_b.sent());
                    if (!data.refresh_token) {
                        throw new Error("No refresh token received. Please try again.");
                    }
                    return [4 /*yield*/, getUserEmail(data.access_token)];
                case 5:
                    email = _b.sent();
                    return [4 /*yield*/, discoverProject(data.access_token)];
                case 6:
                    projectId = _b.sent();
                    expiresAt = Date.now() + data.expires_in * 1000 - 5 * 60 * 1000;
                    return [2 /*return*/, {
                            refresh: data.refresh_token,
                            access: data.access_token,
                            expires: expiresAt,
                            projectId: projectId,
                            email: email,
                        }];
            }
        });
    });
}
function getUserEmail(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch(USERINFO_URL, {
                            headers: { Authorization: "Bearer ".concat(accessToken) },
                        })];
                case 1:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_b.sent());
                    return [2 /*return*/, data.email];
                case 3: return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, undefined];
            }
        });
    });
}
function discoverProject(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var envProject, headers, loadBody, data, response, errorPayload, err_1, project, tier, tierId, onboardBody, onboardResponse, lro, projectId;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    envProject = process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT_ID;
                    headers = {
                        Authorization: "Bearer ".concat(accessToken),
                        "Content-Type": "application/json",
                        "User-Agent": "google-api-nodejs-client/9.15.1",
                        "X-Goog-Api-Client": "gl-node/openclaw",
                    };
                    loadBody = {
                        cloudaicompanionProject: envProject,
                        metadata: {
                            ideType: "IDE_UNSPECIFIED",
                            platform: "PLATFORM_UNSPECIFIED",
                            pluginType: "GEMINI",
                            duetProject: envProject,
                        },
                    };
                    data = {};
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch("".concat(CODE_ASSIST_ENDPOINT, "/v1internal:loadCodeAssist"), {
                            method: "POST",
                            headers: headers,
                            body: JSON.stringify(loadBody),
                        })];
                case 2:
                    response = _c.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json().catch(function () { return null; })];
                case 3:
                    errorPayload = _c.sent();
                    if (isVpcScAffected(errorPayload)) {
                        data = { currentTier: { id: TIER_STANDARD } };
                    }
                    else {
                        throw new Error("loadCodeAssist failed: ".concat(response.status, " ").concat(response.statusText));
                    }
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    data = (_c.sent());
                    _c.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_1 = _c.sent();
                    if (err_1 instanceof Error) {
                        throw err_1;
                    }
                    throw new Error("loadCodeAssist failed", { cause: err_1 });
                case 8:
                    if (data.currentTier) {
                        project = data.cloudaicompanionProject;
                        if (typeof project === "string" && project) {
                            return [2 /*return*/, project];
                        }
                        if (typeof project === "object" && (project === null || project === void 0 ? void 0 : project.id)) {
                            return [2 /*return*/, project.id];
                        }
                        if (envProject) {
                            return [2 /*return*/, envProject];
                        }
                        throw new Error("This account requires GOOGLE_CLOUD_PROJECT or GOOGLE_CLOUD_PROJECT_ID to be set.");
                    }
                    tier = getDefaultTier(data.allowedTiers);
                    tierId = (tier === null || tier === void 0 ? void 0 : tier.id) || TIER_FREE;
                    if (tierId !== TIER_FREE && !envProject) {
                        throw new Error("This account requires GOOGLE_CLOUD_PROJECT or GOOGLE_CLOUD_PROJECT_ID to be set.");
                    }
                    onboardBody = {
                        tierId: tierId,
                        metadata: {
                            ideType: "IDE_UNSPECIFIED",
                            platform: "PLATFORM_UNSPECIFIED",
                            pluginType: "GEMINI",
                        },
                    };
                    if (tierId !== TIER_FREE && envProject) {
                        onboardBody.cloudaicompanionProject = envProject;
                        onboardBody.metadata.duetProject = envProject;
                    }
                    return [4 /*yield*/, fetch("".concat(CODE_ASSIST_ENDPOINT, "/v1internal:onboardUser"), {
                            method: "POST",
                            headers: headers,
                            body: JSON.stringify(onboardBody),
                        })];
                case 9:
                    onboardResponse = _c.sent();
                    if (!onboardResponse.ok) {
                        throw new Error("onboardUser failed: ".concat(onboardResponse.status, " ").concat(onboardResponse.statusText));
                    }
                    return [4 /*yield*/, onboardResponse.json()];
                case 10:
                    lro = (_c.sent());
                    if (!(!lro.done && lro.name)) return [3 /*break*/, 12];
                    return [4 /*yield*/, pollOperation(lro.name, headers)];
                case 11:
                    lro = _c.sent();
                    _c.label = 12;
                case 12:
                    projectId = (_b = (_a = lro.response) === null || _a === void 0 ? void 0 : _a.cloudaicompanionProject) === null || _b === void 0 ? void 0 : _b.id;
                    if (projectId) {
                        return [2 /*return*/, projectId];
                    }
                    if (envProject) {
                        return [2 /*return*/, envProject];
                    }
                    throw new Error("Could not discover or provision a Google Cloud project. Set GOOGLE_CLOUD_PROJECT or GOOGLE_CLOUD_PROJECT_ID.");
            }
        });
    });
}
function isVpcScAffected(payload) {
    if (!payload || typeof payload !== "object") {
        return false;
    }
    var error = payload.error;
    if (!error || typeof error !== "object") {
        return false;
    }
    var details = error.details;
    if (!Array.isArray(details)) {
        return false;
    }
    return details.some(function (item) {
        return typeof item === "object" &&
            item &&
            item.reason === "SECURITY_POLICY_VIOLATED";
    });
}
function getDefaultTier(allowedTiers) {
    var _a;
    if (!(allowedTiers === null || allowedTiers === void 0 ? void 0 : allowedTiers.length)) {
        return { id: TIER_LEGACY };
    }
    return (_a = allowedTiers.find(function (tier) { return tier.isDefault; })) !== null && _a !== void 0 ? _a : { id: TIER_LEGACY };
}
function pollOperation(operationName, headers) {
    return __awaiter(this, void 0, void 0, function () {
        var attempt, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < 24)) return [3 /*break*/, 6];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetch("".concat(CODE_ASSIST_ENDPOINT, "/v1internal/").concat(operationName), {
                            headers: headers,
                        })];
                case 3:
                    response = _a.sent();
                    if (!response.ok) {
                        return [3 /*break*/, 5];
                    }
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = (_a.sent());
                    if (data.done) {
                        return [2 /*return*/, data];
                    }
                    _a.label = 5;
                case 5:
                    attempt += 1;
                    return [3 /*break*/, 1];
                case 6: throw new Error("Operation polling timeout");
            }
        });
    });
}
function loginGeminiCliOAuth(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var needsManual, _a, verifier, challenge, authUrl, callbackInput, parsed, _b, code, err_2, callbackInput, parsed;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    needsManual = shouldUseManualOAuthFlow(ctx.isRemote);
                    return [4 /*yield*/, ctx.note(needsManual
                            ? [
                                "You are running in a remote/VPS environment.",
                                "A URL will be shown for you to open in your LOCAL browser.",
                                "After signing in, copy the redirect URL and paste it back here.",
                            ].join("\n")
                            : [
                                "Browser will open for Google authentication.",
                                "Sign in with your Google account for Gemini CLI access.",
                                "The callback will be captured automatically on localhost:8085.",
                            ].join("\n"), "Gemini CLI OAuth")];
                case 1:
                    _c.sent();
                    _a = generatePkce(), verifier = _a.verifier, challenge = _a.challenge;
                    authUrl = buildAuthUrl(challenge, verifier);
                    if (!needsManual) return [3 /*break*/, 3];
                    ctx.progress.update("OAuth URL ready");
                    ctx.log("\nOpen this URL in your LOCAL browser:\n\n".concat(authUrl, "\n"));
                    ctx.progress.update("Waiting for you to paste the callback URL...");
                    return [4 /*yield*/, ctx.prompt("Paste the redirect URL here: ")];
                case 2:
                    callbackInput = _c.sent();
                    parsed = parseCallbackInput(callbackInput, verifier);
                    if ("error" in parsed) {
                        throw new Error(parsed.error);
                    }
                    if (parsed.state !== verifier) {
                        throw new Error("OAuth state mismatch - please try again");
                    }
                    ctx.progress.update("Exchanging authorization code for tokens...");
                    return [2 /*return*/, exchangeCodeForTokens(parsed.code, verifier)];
                case 3:
                    ctx.progress.update("Complete sign-in in browser...");
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, ctx.openUrl(authUrl)];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _b = _c.sent();
                    ctx.log("\nOpen this URL in your browser:\n\n".concat(authUrl, "\n"));
                    return [3 /*break*/, 7];
                case 7:
                    _c.trys.push([7, 10, , 13]);
                    return [4 /*yield*/, waitForLocalCallback({
                            expectedState: verifier,
                            timeoutMs: 5 * 60 * 1000,
                            onProgress: function (msg) { return ctx.progress.update(msg); },
                        })];
                case 8:
                    code = (_c.sent()).code;
                    ctx.progress.update("Exchanging authorization code for tokens...");
                    return [4 /*yield*/, exchangeCodeForTokens(code, verifier)];
                case 9: return [2 /*return*/, _c.sent()];
                case 10:
                    err_2 = _c.sent();
                    if (!(err_2 instanceof Error &&
                        (err_2.message.includes("EADDRINUSE") ||
                            err_2.message.includes("port") ||
                            err_2.message.includes("listen")))) return [3 /*break*/, 12];
                    ctx.progress.update("Local callback server failed. Switching to manual mode...");
                    ctx.log("\nOpen this URL in your LOCAL browser:\n\n".concat(authUrl, "\n"));
                    return [4 /*yield*/, ctx.prompt("Paste the redirect URL here: ")];
                case 11:
                    callbackInput = _c.sent();
                    parsed = parseCallbackInput(callbackInput, verifier);
                    if ("error" in parsed) {
                        throw new Error(parsed.error, { cause: err_2 });
                    }
                    if (parsed.state !== verifier) {
                        throw new Error("OAuth state mismatch - please try again", { cause: err_2 });
                    }
                    ctx.progress.update("Exchanging authorization code for tokens...");
                    return [2 /*return*/, exchangeCodeForTokens(parsed.code, verifier)];
                case 12: throw err_2;
                case 13: return [2 /*return*/];
            }
        });
    });
}
