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
exports.probeMSTeams = probeMSTeams;
var errors_js_1 = require("./errors.js");
var sdk_js_1 = require("./sdk.js");
var token_js_1 = require("./token.js");
function readAccessToken(value) {
    var _a;
    if (typeof value === "string") {
        return value;
    }
    if (value && typeof value === "object") {
        var token = (_a = value.accessToken) !== null && _a !== void 0 ? _a : value.token;
        return typeof token === "string" ? token : null;
    }
    return null;
}
function decodeJwtPayload(token) {
    var _a;
    var parts = token.split(".");
    if (parts.length < 2) {
        return null;
    }
    var payload = (_a = parts[1]) !== null && _a !== void 0 ? _a : "";
    var padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
    var normalized = padded.replace(/-/g, "+").replace(/_/g, "/");
    try {
        var decoded = Buffer.from(normalized, "base64").toString("utf8");
        var parsed = JSON.parse(decoded);
        return parsed && typeof parsed === "object" ? parsed : null;
    }
    catch (_b) {
        return null;
    }
}
function readStringArray(value) {
    if (!Array.isArray(value)) {
        return undefined;
    }
    var out = value.map(function (entry) { return String(entry).trim(); }).filter(Boolean);
    return out.length > 0 ? out : undefined;
}
function readScopes(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    var out = value
        .split(/\s+/)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
    return out.length > 0 ? out : undefined;
}
function probeMSTeams(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var creds, _a, sdk, authConfig, tokenProvider, graph, graphToken, accessToken, payload, err_1, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    creds = (0, token_js_1.resolveMSTeamsCredentials)(cfg);
                    if (!creds) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "missing credentials (appId, appPassword, tenantId)",
                            }];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, (0, sdk_js_1.loadMSTeamsSdkWithAuth)(creds)];
                case 2:
                    _a = _b.sent(), sdk = _a.sdk, authConfig = _a.authConfig;
                    tokenProvider = new sdk.MsalTokenProvider(authConfig);
                    return [4 /*yield*/, tokenProvider.getAccessToken("https://api.botframework.com")];
                case 3:
                    _b.sent();
                    graph = void 0;
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, tokenProvider.getAccessToken("https://graph.microsoft.com")];
                case 5:
                    graphToken = _b.sent();
                    accessToken = readAccessToken(graphToken);
                    payload = accessToken ? decodeJwtPayload(accessToken) : null;
                    graph = {
                        ok: true,
                        roles: readStringArray(payload === null || payload === void 0 ? void 0 : payload.roles),
                        scopes: readScopes(payload === null || payload === void 0 ? void 0 : payload.scp),
                    };
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _b.sent();
                    graph = { ok: false, error: (0, errors_js_1.formatUnknownError)(err_1) };
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, __assign({ ok: true, appId: creds.appId }, (graph ? { graph: graph } : {}))];
                case 8:
                    err_2 = _b.sent();
                    return [2 /*return*/, {
                            ok: false,
                            appId: creds.appId,
                            error: (0, errors_js_1.formatUnknownError)(err_2),
                        }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
