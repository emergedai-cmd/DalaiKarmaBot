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
exports.resolveMatrixConfig = resolveMatrixConfig;
exports.resolveMatrixAuth = resolveMatrixAuth;
var matrix_bot_sdk_1 = require("@vector-im/matrix-bot-sdk");
var runtime_js_1 = require("../../runtime.js");
var logging_js_1 = require("./logging.js");
function clean(value) {
    var _a;
    return (_a = value === null || value === void 0 ? void 0 : value.trim()) !== null && _a !== void 0 ? _a : "";
}
function resolveMatrixConfig(cfg, env) {
    var _a, _b, _c;
    if (cfg === void 0) { cfg = (0, runtime_js_1.getMatrixRuntime)().config.loadConfig(); }
    if (env === void 0) { env = process.env; }
    var matrix = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.matrix) !== null && _b !== void 0 ? _b : {};
    var homeserver = clean(matrix.homeserver) || clean(env.MATRIX_HOMESERVER);
    var userId = clean(matrix.userId) || clean(env.MATRIX_USER_ID);
    var accessToken = clean(matrix.accessToken) || clean(env.MATRIX_ACCESS_TOKEN) || undefined;
    var password = clean(matrix.password) || clean(env.MATRIX_PASSWORD) || undefined;
    var deviceName = clean(matrix.deviceName) || clean(env.MATRIX_DEVICE_NAME) || undefined;
    var initialSyncLimit = typeof matrix.initialSyncLimit === "number"
        ? Math.max(0, Math.floor(matrix.initialSyncLimit))
        : undefined;
    var encryption = (_c = matrix.encryption) !== null && _c !== void 0 ? _c : false;
    return {
        homeserver: homeserver,
        userId: userId,
        accessToken: accessToken,
        password: password,
        deviceName: deviceName,
        initialSyncLimit: initialSyncLimit,
        encryption: encryption,
    };
}
function resolveMatrixAuth(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, env, resolved, _a, loadMatrixCredentials, saveMatrixCredentials, credentialsMatchConfig, touchMatrixCredentials, cached, cachedCredentials, userId, tempClient, whoami, loginResponse, errorText, login, accessToken, auth;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    cfg = (_b = params === null || params === void 0 ? void 0 : params.cfg) !== null && _b !== void 0 ? _b : (0, runtime_js_1.getMatrixRuntime)().config.loadConfig();
                    env = (_c = params === null || params === void 0 ? void 0 : params.env) !== null && _c !== void 0 ? _c : process.env;
                    resolved = resolveMatrixConfig(cfg, env);
                    if (!resolved.homeserver) {
                        throw new Error("Matrix homeserver is required (matrix.homeserver)");
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../credentials.js"); })];
                case 1:
                    _a = _g.sent(), loadMatrixCredentials = _a.loadMatrixCredentials, saveMatrixCredentials = _a.saveMatrixCredentials, credentialsMatchConfig = _a.credentialsMatchConfig, touchMatrixCredentials = _a.touchMatrixCredentials;
                    cached = loadMatrixCredentials(env);
                    cachedCredentials = cached &&
                        credentialsMatchConfig(cached, {
                            homeserver: resolved.homeserver,
                            userId: resolved.userId || "",
                        })
                        ? cached
                        : null;
                    if (!resolved.accessToken) return [3 /*break*/, 5];
                    userId = resolved.userId;
                    if (!!userId) return [3 /*break*/, 3];
                    // Fetch userId from access token via whoami
                    (0, logging_js_1.ensureMatrixSdkLoggingConfigured)();
                    tempClient = new matrix_bot_sdk_1.MatrixClient(resolved.homeserver, resolved.accessToken);
                    return [4 /*yield*/, tempClient.getUserId()];
                case 2:
                    whoami = _g.sent();
                    userId = whoami;
                    // Save the credentials with the fetched userId
                    saveMatrixCredentials({
                        homeserver: resolved.homeserver,
                        userId: userId,
                        accessToken: resolved.accessToken,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    if (cachedCredentials && cachedCredentials.accessToken === resolved.accessToken) {
                        touchMatrixCredentials(env);
                    }
                    _g.label = 4;
                case 4: return [2 /*return*/, {
                        homeserver: resolved.homeserver,
                        userId: userId,
                        accessToken: resolved.accessToken,
                        deviceName: resolved.deviceName,
                        initialSyncLimit: resolved.initialSyncLimit,
                        encryption: resolved.encryption,
                    }];
                case 5:
                    if (cachedCredentials) {
                        touchMatrixCredentials(env);
                        return [2 /*return*/, {
                                homeserver: cachedCredentials.homeserver,
                                userId: cachedCredentials.userId,
                                accessToken: cachedCredentials.accessToken,
                                deviceName: resolved.deviceName,
                                initialSyncLimit: resolved.initialSyncLimit,
                                encryption: resolved.encryption,
                            }];
                    }
                    if (!resolved.userId) {
                        throw new Error("Matrix userId is required when no access token is configured (matrix.userId)");
                    }
                    if (!resolved.password) {
                        throw new Error("Matrix password is required when no access token is configured (matrix.password)");
                    }
                    return [4 /*yield*/, fetch("".concat(resolved.homeserver, "/_matrix/client/v3/login"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                type: "m.login.password",
                                identifier: { type: "m.id.user", user: resolved.userId },
                                password: resolved.password,
                                initial_device_display_name: (_d = resolved.deviceName) !== null && _d !== void 0 ? _d : "OpenClaw Gateway",
                            }),
                        })];
                case 6:
                    loginResponse = _g.sent();
                    if (!!loginResponse.ok) return [3 /*break*/, 8];
                    return [4 /*yield*/, loginResponse.text()];
                case 7:
                    errorText = _g.sent();
                    throw new Error("Matrix login failed: ".concat(errorText));
                case 8: return [4 /*yield*/, loginResponse.json()];
                case 9:
                    login = (_g.sent());
                    accessToken = (_e = login.access_token) === null || _e === void 0 ? void 0 : _e.trim();
                    if (!accessToken) {
                        throw new Error("Matrix login did not return an access token");
                    }
                    auth = {
                        homeserver: resolved.homeserver,
                        userId: (_f = login.user_id) !== null && _f !== void 0 ? _f : resolved.userId,
                        accessToken: accessToken,
                        deviceName: resolved.deviceName,
                        initialSyncLimit: resolved.initialSyncLimit,
                        encryption: resolved.encryption,
                    };
                    saveMatrixCredentials({
                        homeserver: auth.homeserver,
                        userId: auth.userId,
                        accessToken: auth.accessToken,
                        deviceId: login.device_id,
                    });
                    return [2 /*return*/, auth];
            }
        });
    });
}
