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
exports.resolveNonInteractiveApiKey = resolveNonInteractiveApiKey;
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var model_auth_js_1 = require("../../agents/model-auth.js");
function resolveApiKeyFromProfiles(params) {
    return __awaiter(this, void 0, void 0, function () {
        var store, order, _i, order_1, profileId, cred, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(params.agentDir);
                    order = (0, auth_profiles_js_1.resolveAuthProfileOrder)({
                        cfg: params.cfg,
                        store: store,
                        provider: params.provider,
                    });
                    _i = 0, order_1 = order;
                    _a.label = 1;
                case 1:
                    if (!(_i < order_1.length)) return [3 /*break*/, 4];
                    profileId = order_1[_i];
                    cred = store.profiles[profileId];
                    if ((cred === null || cred === void 0 ? void 0 : cred.type) !== "api_key") {
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, (0, auth_profiles_js_1.resolveApiKeyForProfile)({
                            cfg: params.cfg,
                            store: store,
                            profileId: profileId,
                            agentDir: params.agentDir,
                        })];
                case 2:
                    resolved = _a.sent();
                    if (resolved === null || resolved === void 0 ? void 0 : resolved.apiKey) {
                        return [2 /*return*/, resolved.apiKey];
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}
function resolveNonInteractiveApiKey(params) {
    return __awaiter(this, void 0, void 0, function () {
        var flagKey, envResolved, profileKey, profileHint;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    flagKey = (_a = params.flagValue) === null || _a === void 0 ? void 0 : _a.trim();
                    if (flagKey) {
                        return [2 /*return*/, { key: flagKey, source: "flag" }];
                    }
                    envResolved = (0, model_auth_js_1.resolveEnvApiKey)(params.provider);
                    if (envResolved === null || envResolved === void 0 ? void 0 : envResolved.apiKey) {
                        return [2 /*return*/, { key: envResolved.apiKey, source: "env" }];
                    }
                    if (!((_b = params.allowProfile) !== null && _b !== void 0 ? _b : true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, resolveApiKeyFromProfiles({
                            provider: params.provider,
                            cfg: params.cfg,
                            agentDir: params.agentDir,
                        })];
                case 1:
                    profileKey = _c.sent();
                    if (profileKey) {
                        return [2 /*return*/, { key: profileKey, source: "profile" }];
                    }
                    _c.label = 2;
                case 2:
                    profileHint = params.allowProfile === false ? "" : ", or existing ".concat(params.provider, " API-key profile");
                    params.runtime.error("Missing ".concat(params.flagName, " (or ").concat(params.envVar, " in env").concat(profileHint, ")."));
                    params.runtime.exit(1);
                    return [2 /*return*/, null];
            }
        });
    });
}
