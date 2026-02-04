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
exports.resolveNextcloudTalkRoomKind = resolveNextcloudTalkRoomKind;
var node_fs_1 = require("node:fs");
var ROOM_CACHE_TTL_MS = 5 * 60 * 1000;
var ROOM_CACHE_ERROR_TTL_MS = 30 * 1000;
var roomCache = new Map();
function resolveRoomCacheKey(params) {
    return "".concat(params.accountId, ":").concat(params.roomToken);
}
function readApiPassword(params) {
    var _a;
    if ((_a = params.apiPassword) === null || _a === void 0 ? void 0 : _a.trim()) {
        return params.apiPassword.trim();
    }
    if (!params.apiPasswordFile) {
        return undefined;
    }
    try {
        var value = (0, node_fs_1.readFileSync)(params.apiPasswordFile, "utf-8").trim();
        return value || undefined;
    }
    catch (_b) {
        return undefined;
    }
}
function coerceRoomType(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string" && value.trim()) {
        var parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
}
function resolveRoomKindFromType(type) {
    if (!type) {
        return undefined;
    }
    if (type === 1 || type === 5 || type === 6) {
        return "direct";
    }
    return "group";
}
function resolveNextcloudTalkRoomKind(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, roomToken, runtime, key, cached, age, apiUser, apiPassword, baseUrl, url, auth, response, payload, type, kind, err_1;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    account = params.account, roomToken = params.roomToken, runtime = params.runtime;
                    key = resolveRoomCacheKey({ accountId: account.accountId, roomToken: roomToken });
                    cached = roomCache.get(key);
                    if (cached) {
                        age = Date.now() - cached.fetchedAt;
                        if (cached.kind && age < ROOM_CACHE_TTL_MS) {
                            return [2 /*return*/, cached.kind];
                        }
                        if (cached.error && age < ROOM_CACHE_ERROR_TTL_MS) {
                            return [2 /*return*/, undefined];
                        }
                    }
                    apiUser = (_a = account.config.apiUser) === null || _a === void 0 ? void 0 : _a.trim();
                    apiPassword = readApiPassword({
                        apiPassword: account.config.apiPassword,
                        apiPasswordFile: account.config.apiPasswordFile,
                    });
                    if (!apiUser || !apiPassword) {
                        return [2 /*return*/, undefined];
                    }
                    baseUrl = (_b = account.baseUrl) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!baseUrl) {
                        return [2 /*return*/, undefined];
                    }
                    url = "".concat(baseUrl, "/ocs/v2.php/apps/spreed/api/v4/room/").concat(roomToken);
                    auth = Buffer.from("".concat(apiUser, ":").concat(apiPassword), "utf-8").toString("base64");
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: "GET",
                            headers: {
                                Authorization: "Basic ".concat(auth),
                                "OCS-APIRequest": "true",
                                Accept: "application/json",
                            },
                        })];
                case 2:
                    response = _g.sent();
                    if (!response.ok) {
                        roomCache.set(key, {
                            fetchedAt: Date.now(),
                            error: "status:".concat(response.status),
                        });
                        (_c = runtime === null || runtime === void 0 ? void 0 : runtime.log) === null || _c === void 0 ? void 0 : _c.call(runtime, "nextcloud-talk: room lookup failed (".concat(response.status, ") token=").concat(roomToken));
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    payload = (_g.sent());
                    type = coerceRoomType((_e = (_d = payload.ocs) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.type);
                    kind = resolveRoomKindFromType(type);
                    roomCache.set(key, { fetchedAt: Date.now(), kind: kind });
                    return [2 /*return*/, kind];
                case 4:
                    err_1 = _g.sent();
                    roomCache.set(key, {
                        fetchedAt: Date.now(),
                        error: err_1 instanceof Error ? err_1.message : String(err_1),
                    });
                    (_f = runtime === null || runtime === void 0 ? void 0 : runtime.error) === null || _f === void 0 ? void 0 : _f.call(runtime, "nextcloud-talk: room lookup error: ".concat(String(err_1)));
                    return [2 /*return*/, undefined];
                case 5: return [2 /*return*/];
            }
        });
    });
}
