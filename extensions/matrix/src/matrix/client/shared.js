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
exports.resolveSharedMatrixClient = resolveSharedMatrixClient;
exports.waitForMatrixSync = waitForMatrixSync;
exports.stopSharedClient = stopSharedClient;
var matrix_bot_sdk_1 = require("@vector-im/matrix-bot-sdk");
var config_js_1 = require("./config.js");
var create_client_js_1 = require("./create-client.js");
var storage_js_1 = require("./storage.js");
var sharedClientState = null;
var sharedClientPromise = null;
var sharedClientStartPromise = null;
function buildSharedClientKey(auth, accountId) {
    return [
        auth.homeserver,
        auth.userId,
        auth.accessToken,
        auth.encryption ? "e2ee" : "plain",
        accountId !== null && accountId !== void 0 ? accountId : storage_js_1.DEFAULT_ACCOUNT_KEY,
    ].join("|");
}
function createSharedMatrixClient(params) {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, create_client_js_1.createMatrixClient)({
                        homeserver: params.auth.homeserver,
                        userId: params.auth.userId,
                        accessToken: params.auth.accessToken,
                        encryption: params.auth.encryption,
                        localTimeoutMs: params.timeoutMs,
                        accountId: params.accountId,
                    })];
                case 1:
                    client = _a.sent();
                    return [2 /*return*/, {
                            client: client,
                            key: buildSharedClientKey(params.auth, params.accountId),
                            started: false,
                            cryptoReady: false,
                        }];
            }
        });
    });
}
function ensureSharedClientStarted(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (params.state.started) {
                        return [2 /*return*/];
                    }
                    if (!sharedClientStartPromise) return [3 /*break*/, 2];
                    return [4 /*yield*/, sharedClientStartPromise];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2:
                    sharedClientStartPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                        var client, joinedRooms, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    client = params.state.client;
                                    if (!(params.encryption && !params.state.cryptoReady)) return [3 /*break*/, 6];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    return [4 /*yield*/, client.getJoinedRooms()];
                                case 2:
                                    joinedRooms = _a.sent();
                                    if (!client.crypto) return [3 /*break*/, 4];
                                    return [4 /*yield*/, client.crypto.prepare(joinedRooms)];
                                case 3:
                                    _a.sent();
                                    params.state.cryptoReady = true;
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    err_1 = _a.sent();
                                    matrix_bot_sdk_1.LogService.warn("MatrixClientLite", "Failed to prepare crypto:", err_1);
                                    return [3 /*break*/, 6];
                                case 6: return [4 /*yield*/, client.start()];
                                case 7:
                                    _a.sent();
                                    params.state.started = true;
                                    return [2 /*return*/];
                            }
                        });
                    }); })();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    return [4 /*yield*/, sharedClientStartPromise];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    sharedClientStartPromise = null;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function resolveSharedMatrixClient() {
    return __awaiter(this, arguments, void 0, function (params) {
        var auth, _a, key, shouldStart, pending, created;
        var _b;
        if (params === void 0) { params = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!((_b = params.auth) !== null && _b !== void 0)) return [3 /*break*/, 1];
                    _a = _b;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, config_js_1.resolveMatrixAuth)({ cfg: params.cfg, env: params.env })];
                case 2:
                    _a = (_c.sent());
                    _c.label = 3;
                case 3:
                    auth = _a;
                    key = buildSharedClientKey(auth, params.accountId);
                    shouldStart = params.startClient !== false;
                    if (!((sharedClientState === null || sharedClientState === void 0 ? void 0 : sharedClientState.key) === key)) return [3 /*break*/, 6];
                    if (!shouldStart) return [3 /*break*/, 5];
                    return [4 /*yield*/, ensureSharedClientStarted({
                            state: sharedClientState,
                            timeoutMs: params.timeoutMs,
                            initialSyncLimit: auth.initialSyncLimit,
                            encryption: auth.encryption,
                        })];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5: return [2 /*return*/, sharedClientState.client];
                case 6:
                    if (!sharedClientPromise) return [3 /*break*/, 11];
                    return [4 /*yield*/, sharedClientPromise];
                case 7:
                    pending = _c.sent();
                    if (!(pending.key === key)) return [3 /*break*/, 10];
                    if (!shouldStart) return [3 /*break*/, 9];
                    return [4 /*yield*/, ensureSharedClientStarted({
                            state: pending,
                            timeoutMs: params.timeoutMs,
                            initialSyncLimit: auth.initialSyncLimit,
                            encryption: auth.encryption,
                        })];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9: return [2 /*return*/, pending.client];
                case 10:
                    pending.client.stop();
                    sharedClientState = null;
                    sharedClientPromise = null;
                    _c.label = 11;
                case 11:
                    sharedClientPromise = createSharedMatrixClient({
                        auth: auth,
                        timeoutMs: params.timeoutMs,
                        accountId: params.accountId,
                    });
                    _c.label = 12;
                case 12:
                    _c.trys.push([12, , 16, 17]);
                    return [4 /*yield*/, sharedClientPromise];
                case 13:
                    created = _c.sent();
                    sharedClientState = created;
                    if (!shouldStart) return [3 /*break*/, 15];
                    return [4 /*yield*/, ensureSharedClientStarted({
                            state: created,
                            timeoutMs: params.timeoutMs,
                            initialSyncLimit: auth.initialSyncLimit,
                            encryption: auth.encryption,
                        })];
                case 14:
                    _c.sent();
                    _c.label = 15;
                case 15: return [2 /*return*/, created.client];
                case 16:
                    sharedClientPromise = null;
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function waitForMatrixSync(_params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function stopSharedClient() {
    if (sharedClientState) {
        sharedClientState.client.stop();
        sharedClientState = null;
    }
}
