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
exports.isLocalDirectRequest = isLocalDirectRequest;
exports.resolveGatewayAuth = resolveGatewayAuth;
exports.assertGatewayAuthConfigured = assertGatewayAuthConfigured;
exports.authorizeGatewayConnect = authorizeGatewayConnect;
var node_crypto_1 = require("node:crypto");
var tailscale_js_1 = require("../infra/tailscale.js");
var net_js_1 = require("./net.js");
function safeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    return (0, node_crypto_1.timingSafeEqual)(Buffer.from(a), Buffer.from(b));
}
function normalizeLogin(login) {
    return login.trim().toLowerCase();
}
function isLoopbackAddress(ip) {
    if (!ip) {
        return false;
    }
    if (ip === "127.0.0.1") {
        return true;
    }
    if (ip.startsWith("127.")) {
        return true;
    }
    if (ip === "::1") {
        return true;
    }
    if (ip.startsWith("::ffff:127.")) {
        return true;
    }
    return false;
}
function getHostName(hostHeader) {
    var host = (hostHeader !== null && hostHeader !== void 0 ? hostHeader : "").trim().toLowerCase();
    if (!host) {
        return "";
    }
    if (host.startsWith("[")) {
        var end = host.indexOf("]");
        if (end !== -1) {
            return host.slice(1, end);
        }
    }
    var name = host.split(":")[0];
    return name !== null && name !== void 0 ? name : "";
}
function headerValue(value) {
    return Array.isArray(value) ? value[0] : value;
}
function resolveTailscaleClientIp(req) {
    var _a;
    if (!req) {
        return undefined;
    }
    var forwardedFor = headerValue((_a = req.headers) === null || _a === void 0 ? void 0 : _a["x-forwarded-for"]);
    return forwardedFor ? (0, net_js_1.parseForwardedForClientIp)(forwardedFor) : undefined;
}
function resolveRequestClientIp(req, trustedProxies) {
    var _a, _b, _c, _d;
    if (!req) {
        return undefined;
    }
    return (0, net_js_1.resolveGatewayClientIp)({
        remoteAddr: (_b = (_a = req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress) !== null && _b !== void 0 ? _b : "",
        forwardedFor: headerValue((_c = req.headers) === null || _c === void 0 ? void 0 : _c["x-forwarded-for"]),
        realIp: headerValue((_d = req.headers) === null || _d === void 0 ? void 0 : _d["x-real-ip"]),
        trustedProxies: trustedProxies,
    });
}
function isLocalDirectRequest(req, trustedProxies) {
    var _a, _b, _c, _d, _e, _f;
    if (!req) {
        return false;
    }
    var clientIp = (_a = resolveRequestClientIp(req, trustedProxies)) !== null && _a !== void 0 ? _a : "";
    if (!isLoopbackAddress(clientIp)) {
        return false;
    }
    var host = getHostName((_b = req.headers) === null || _b === void 0 ? void 0 : _b.host);
    var hostIsLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";
    var hostIsTailscaleServe = host.endsWith(".ts.net");
    var hasForwarded = Boolean(((_c = req.headers) === null || _c === void 0 ? void 0 : _c["x-forwarded-for"]) ||
        ((_d = req.headers) === null || _d === void 0 ? void 0 : _d["x-real-ip"]) ||
        ((_e = req.headers) === null || _e === void 0 ? void 0 : _e["x-forwarded-host"]));
    var remoteIsTrustedProxy = (0, net_js_1.isTrustedProxyAddress)((_f = req.socket) === null || _f === void 0 ? void 0 : _f.remoteAddress, trustedProxies);
    return (hostIsLocal || hostIsTailscaleServe) && (!hasForwarded || remoteIsTrustedProxy);
}
function getTailscaleUser(req) {
    if (!req) {
        return null;
    }
    var login = req.headers["tailscale-user-login"];
    if (typeof login !== "string" || !login.trim()) {
        return null;
    }
    var nameRaw = req.headers["tailscale-user-name"];
    var profilePic = req.headers["tailscale-user-profile-pic"];
    var name = typeof nameRaw === "string" && nameRaw.trim() ? nameRaw.trim() : login.trim();
    return {
        login: login.trim(),
        name: name,
        profilePic: typeof profilePic === "string" && profilePic.trim() ? profilePic.trim() : undefined,
    };
}
function hasTailscaleProxyHeaders(req) {
    if (!req) {
        return false;
    }
    return Boolean(req.headers["x-forwarded-for"] &&
        req.headers["x-forwarded-proto"] &&
        req.headers["x-forwarded-host"]);
}
function isTailscaleProxyRequest(req) {
    var _a;
    if (!req) {
        return false;
    }
    return isLoopbackAddress((_a = req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress) && hasTailscaleProxyHeaders(req);
}
function resolveVerifiedTailscaleUser(params) {
    return __awaiter(this, void 0, void 0, function () {
        var req, tailscaleWhois, tailscaleUser, clientIp, whois;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    req = params.req, tailscaleWhois = params.tailscaleWhois;
                    tailscaleUser = getTailscaleUser(req);
                    if (!tailscaleUser) {
                        return [2 /*return*/, { ok: false, reason: "tailscale_user_missing" }];
                    }
                    if (!isTailscaleProxyRequest(req)) {
                        return [2 /*return*/, { ok: false, reason: "tailscale_proxy_missing" }];
                    }
                    clientIp = resolveTailscaleClientIp(req);
                    if (!clientIp) {
                        return [2 /*return*/, { ok: false, reason: "tailscale_whois_failed" }];
                    }
                    return [4 /*yield*/, tailscaleWhois(clientIp)];
                case 1:
                    whois = _b.sent();
                    if (!(whois === null || whois === void 0 ? void 0 : whois.login)) {
                        return [2 /*return*/, { ok: false, reason: "tailscale_whois_failed" }];
                    }
                    if (normalizeLogin(whois.login) !== normalizeLogin(tailscaleUser.login)) {
                        return [2 /*return*/, { ok: false, reason: "tailscale_user_mismatch" }];
                    }
                    return [2 /*return*/, {
                            ok: true,
                            user: {
                                login: whois.login,
                                name: (_a = whois.name) !== null && _a !== void 0 ? _a : tailscaleUser.name,
                                profilePic: tailscaleUser.profilePic,
                            },
                        }];
            }
        });
    });
}
function resolveGatewayAuth(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var authConfig = (_a = params.authConfig) !== null && _a !== void 0 ? _a : {};
    var env = (_b = params.env) !== null && _b !== void 0 ? _b : process.env;
    var token = (_e = (_d = (_c = authConfig.token) !== null && _c !== void 0 ? _c : env.OPENCLAW_GATEWAY_TOKEN) !== null && _d !== void 0 ? _d : env.CLAWDBOT_GATEWAY_TOKEN) !== null && _e !== void 0 ? _e : undefined;
    var password = (_h = (_g = (_f = authConfig.password) !== null && _f !== void 0 ? _f : env.OPENCLAW_GATEWAY_PASSWORD) !== null && _g !== void 0 ? _g : env.CLAWDBOT_GATEWAY_PASSWORD) !== null && _h !== void 0 ? _h : undefined;
    var mode = (_j = authConfig.mode) !== null && _j !== void 0 ? _j : (password ? "password" : "token");
    var allowTailscale = (_k = authConfig.allowTailscale) !== null && _k !== void 0 ? _k : (params.tailscaleMode === "serve" && mode !== "password");
    return {
        mode: mode,
        token: token,
        password: password,
        allowTailscale: allowTailscale,
    };
}
function assertGatewayAuthConfigured(auth) {
    if (auth.mode === "token" && !auth.token) {
        if (auth.allowTailscale) {
            return;
        }
        throw new Error("gateway auth mode is token, but no token was configured (set gateway.auth.token or OPENCLAW_GATEWAY_TOKEN)");
    }
    if (auth.mode === "password" && !auth.password) {
        throw new Error("gateway auth mode is password, but no password was configured");
    }
}
function authorizeGatewayConnect(params) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, connectAuth, req, trustedProxies, tailscaleWhois, localDirect, tailscaleCheck, password;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    auth = params.auth, connectAuth = params.connectAuth, req = params.req, trustedProxies = params.trustedProxies;
                    tailscaleWhois = (_a = params.tailscaleWhois) !== null && _a !== void 0 ? _a : tailscale_js_1.readTailscaleWhoisIdentity;
                    localDirect = isLocalDirectRequest(req, trustedProxies);
                    if (!(auth.allowTailscale && !localDirect)) return [3 /*break*/, 2];
                    return [4 /*yield*/, resolveVerifiedTailscaleUser({
                            req: req,
                            tailscaleWhois: tailscaleWhois,
                        })];
                case 1:
                    tailscaleCheck = _b.sent();
                    if (tailscaleCheck.ok) {
                        return [2 /*return*/, {
                                ok: true,
                                method: "tailscale",
                                user: tailscaleCheck.user.login,
                            }];
                    }
                    _b.label = 2;
                case 2:
                    if (auth.mode === "token") {
                        if (!auth.token) {
                            return [2 /*return*/, { ok: false, reason: "token_missing_config" }];
                        }
                        if (!(connectAuth === null || connectAuth === void 0 ? void 0 : connectAuth.token)) {
                            return [2 /*return*/, { ok: false, reason: "token_missing" }];
                        }
                        if (!safeEqual(connectAuth.token, auth.token)) {
                            return [2 /*return*/, { ok: false, reason: "token_mismatch" }];
                        }
                        return [2 /*return*/, { ok: true, method: "token" }];
                    }
                    if (auth.mode === "password") {
                        password = connectAuth === null || connectAuth === void 0 ? void 0 : connectAuth.password;
                        if (!auth.password) {
                            return [2 /*return*/, { ok: false, reason: "password_missing_config" }];
                        }
                        if (!password) {
                            return [2 /*return*/, { ok: false, reason: "password_missing" }];
                        }
                        if (!safeEqual(password, auth.password)) {
                            return [2 /*return*/, { ok: false, reason: "password_mismatch" }];
                        }
                        return [2 /*return*/, { ok: true, method: "password" }];
                    }
                    return [2 /*return*/, { ok: false, reason: "unauthorized" }];
            }
        });
    });
}
