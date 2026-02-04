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
exports.GOOGLE_CHAT_SCOPE = void 0;
exports.getGoogleChatAccessToken = getGoogleChatAccessToken;
exports.verifyGoogleChatRequest = verifyGoogleChatRequest;
var google_auth_library_1 = require("google-auth-library");
var CHAT_SCOPE = "https://www.googleapis.com/auth/chat.bot";
var CHAT_ISSUER = "chat@system.gserviceaccount.com";
// Google Workspace Add-ons use a different service account pattern
var ADDON_ISSUER_PATTERN = /^service-\d+@gcp-sa-gsuiteaddons\.iam\.gserviceaccount\.com$/;
var CHAT_CERTS_URL = "https://www.googleapis.com/service_accounts/v1/metadata/x509/chat@system.gserviceaccount.com";
var authCache = new Map();
var verifyClient = new google_auth_library_1.OAuth2Client();
var cachedCerts = null;
function buildAuthKey(account) {
    if (account.credentialsFile) {
        return "file:".concat(account.credentialsFile);
    }
    if (account.credentials) {
        return "inline:".concat(JSON.stringify(account.credentials));
    }
    return "none";
}
function getAuthInstance(account) {
    var key = buildAuthKey(account);
    var cached = authCache.get(account.accountId);
    if (cached && cached.key === key) {
        return cached.auth;
    }
    if (account.credentialsFile) {
        var auth_1 = new google_auth_library_1.GoogleAuth({ keyFile: account.credentialsFile, scopes: [CHAT_SCOPE] });
        authCache.set(account.accountId, { key: key, auth: auth_1 });
        return auth_1;
    }
    if (account.credentials) {
        var auth_2 = new google_auth_library_1.GoogleAuth({ credentials: account.credentials, scopes: [CHAT_SCOPE] });
        authCache.set(account.accountId, { key: key, auth: auth_2 });
        return auth_2;
    }
    var auth = new google_auth_library_1.GoogleAuth({ scopes: [CHAT_SCOPE] });
    authCache.set(account.accountId, { key: key, auth: auth });
    return auth;
}
function getGoogleChatAccessToken(account) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, client, access, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auth = getAuthInstance(account);
                    return [4 /*yield*/, auth.getClient()];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, client.getAccessToken()];
                case 2:
                    access = _a.sent();
                    token = typeof access === "string" ? access : access === null || access === void 0 ? void 0 : access.token;
                    if (!token) {
                        throw new Error("Missing Google Chat access token");
                    }
                    return [2 /*return*/, token];
            }
        });
    });
}
function fetchChatCerts() {
    return __awaiter(this, void 0, void 0, function () {
        var now, res, certs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = Date.now();
                    if (cachedCerts && now - cachedCerts.fetchedAt < 10 * 60 * 1000) {
                        return [2 /*return*/, cachedCerts.certs];
                    }
                    return [4 /*yield*/, fetch(CHAT_CERTS_URL)];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        throw new Error("Failed to fetch Chat certs (".concat(res.status, ")"));
                    }
                    return [4 /*yield*/, res.json()];
                case 2:
                    certs = (_a.sent());
                    cachedCerts = { fetchedAt: now, certs: certs };
                    return [2 /*return*/, certs];
            }
        });
    });
}
function verifyGoogleChatRequest(params) {
    return __awaiter(this, void 0, void 0, function () {
        var bearer, audience, audienceType, ticket, payload, email, ok, err_1, certs, err_2;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    bearer = (_a = params.bearer) === null || _a === void 0 ? void 0 : _a.trim();
                    if (!bearer) {
                        return [2 /*return*/, { ok: false, reason: "missing token" }];
                    }
                    audience = (_b = params.audience) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!audience) {
                        return [2 /*return*/, { ok: false, reason: "missing audience" }];
                    }
                    audienceType = (_c = params.audienceType) !== null && _c !== void 0 ? _c : null;
                    if (!(audienceType === "app-url")) return [3 /*break*/, 4];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, verifyClient.verifyIdToken({
                            idToken: bearer,
                            audience: audience,
                        })];
                case 2:
                    ticket = _e.sent();
                    payload = ticket.getPayload();
                    email = (_d = payload === null || payload === void 0 ? void 0 : payload.email) !== null && _d !== void 0 ? _d : "";
                    ok = (payload === null || payload === void 0 ? void 0 : payload.email_verified) && (email === CHAT_ISSUER || ADDON_ISSUER_PATTERN.test(email));
                    return [2 /*return*/, ok ? { ok: true } : { ok: false, reason: "invalid issuer: ".concat(email) }];
                case 3:
                    err_1 = _e.sent();
                    return [2 /*return*/, { ok: false, reason: err_1 instanceof Error ? err_1.message : "invalid token" }];
                case 4:
                    if (!(audienceType === "project-number")) return [3 /*break*/, 9];
                    _e.label = 5;
                case 5:
                    _e.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, fetchChatCerts()];
                case 6:
                    certs = _e.sent();
                    return [4 /*yield*/, verifyClient.verifySignedJwtWithCertsAsync(bearer, certs, audience, [CHAT_ISSUER])];
                case 7:
                    _e.sent();
                    return [2 /*return*/, { ok: true }];
                case 8:
                    err_2 = _e.sent();
                    return [2 /*return*/, { ok: false, reason: err_2 instanceof Error ? err_2.message : "invalid token" }];
                case 9: return [2 /*return*/, { ok: false, reason: "unsupported audience type" }];
            }
        });
    });
}
exports.GOOGLE_CHAT_SCOPE = CHAT_SCOPE;
