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
exports.createMatrixClient = createMatrixClient;
var matrix_bot_sdk_1 = require("@vector-im/matrix-bot-sdk");
var node_fs_1 = require("node:fs");
var logging_js_1 = require("./logging.js");
var storage_js_1 = require("./storage.js");
function sanitizeUserIdList(input, label) {
    if (input == null) {
        return [];
    }
    if (!Array.isArray(input)) {
        matrix_bot_sdk_1.LogService.warn("MatrixClientLite", "Expected ".concat(label, " list to be an array, got ").concat(typeof input));
        return [];
    }
    var filtered = input.filter(function (entry) { return typeof entry === "string" && entry.trim().length > 0; });
    if (filtered.length !== input.length) {
        matrix_bot_sdk_1.LogService.warn("MatrixClientLite", "Dropping ".concat(input.length - filtered.length, " invalid ").concat(label, " entries from sync payload"));
    }
    return filtered;
}
function createMatrixClient(params) {
    return __awaiter(this, void 0, void 0, function () {
        var env, storagePaths, storage, cryptoStorage, StoreType, err_1, client, originalUpdateSyncData_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, logging_js_1.ensureMatrixSdkLoggingConfigured)();
                    env = process.env;
                    storagePaths = (0, storage_js_1.resolveMatrixStoragePaths)({
                        homeserver: params.homeserver,
                        userId: params.userId,
                        accessToken: params.accessToken,
                        accountId: params.accountId,
                        env: env,
                    });
                    (0, storage_js_1.maybeMigrateLegacyStorage)({ storagePaths: storagePaths, env: env });
                    node_fs_1.default.mkdirSync(storagePaths.rootDir, { recursive: true });
                    storage = new matrix_bot_sdk_1.SimpleFsStorageProvider(storagePaths.storagePath);
                    if (!params.encryption) return [3 /*break*/, 4];
                    node_fs_1.default.mkdirSync(storagePaths.cryptoPath, { recursive: true });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@matrix-org/matrix-sdk-crypto-nodejs"); })];
                case 2:
                    StoreType = (_a.sent()).StoreType;
                    cryptoStorage = new matrix_bot_sdk_1.RustSdkCryptoStorageProvider(storagePaths.cryptoPath, 0 /* StoreType.Sqlite */);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    matrix_bot_sdk_1.LogService.warn("MatrixClientLite", "Failed to initialize crypto storage, E2EE disabled:", err_1);
                    return [3 /*break*/, 4];
                case 4:
                    (0, storage_js_1.writeStorageMeta)({
                        storagePaths: storagePaths,
                        homeserver: params.homeserver,
                        userId: params.userId,
                        accountId: params.accountId,
                    });
                    client = new matrix_bot_sdk_1.MatrixClient(params.homeserver, params.accessToken, storage, cryptoStorage);
                    if (client.crypto) {
                        originalUpdateSyncData_1 = client.crypto.updateSyncData.bind(client.crypto);
                        client.crypto.updateSyncData = function (toDeviceMessages, otkCounts, unusedFallbackKeyAlgs, changedDeviceLists, leftDeviceLists) { return __awaiter(_this, void 0, void 0, function () {
                            var safeChanged, safeLeft, err_2, message;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        safeChanged = sanitizeUserIdList(changedDeviceLists, "changed device list");
                                        safeLeft = sanitizeUserIdList(leftDeviceLists, "left device list");
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, originalUpdateSyncData_1(toDeviceMessages, otkCounts, unusedFallbackKeyAlgs, safeChanged, safeLeft)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                    case 3:
                                        err_2 = _a.sent();
                                        message = typeof err_2 === "string" ? err_2 : err_2 instanceof Error ? err_2.message : "";
                                        if (message.includes("Expect value to be String")) {
                                            matrix_bot_sdk_1.LogService.warn("MatrixClientLite", "Ignoring malformed device list entries during crypto sync", message);
                                            return [2 /*return*/];
                                        }
                                        throw err_2;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                    }
                    return [2 /*return*/, client];
            }
        });
    });
}
