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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var paths_js_1 = require("../config/paths.js");
var pairing_store_js_1 = require("./pairing-store.js");
function withTempStateDir(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var previous, dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previous = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-pairing-"))];
                case 1:
                    dir = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = dir;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, fn(dir)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (previous === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previous;
                    }
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("pairing store", function () {
    (0, vitest_1.it)("reuses pending code and reports created=false", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStateDir(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var first, second, list;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, pairing_store_js_1.upsertChannelPairingRequest)({
                                        channel: "discord",
                                        id: "u1",
                                    })];
                                case 1:
                                    first = _b.sent();
                                    return [4 /*yield*/, (0, pairing_store_js_1.upsertChannelPairingRequest)({
                                            channel: "discord",
                                            id: "u1",
                                        })];
                                case 2:
                                    second = _b.sent();
                                    (0, vitest_1.expect)(first.created).toBe(true);
                                    (0, vitest_1.expect)(second.created).toBe(false);
                                    (0, vitest_1.expect)(second.code).toBe(first.code);
                                    return [4 /*yield*/, (0, pairing_store_js_1.listChannelPairingRequests)("discord")];
                                case 3:
                                    list = _b.sent();
                                    (0, vitest_1.expect)(list).toHaveLength(1);
                                    (0, vitest_1.expect)((_a = list[0]) === null || _a === void 0 ? void 0 : _a.code).toBe(first.code);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("expires pending requests after TTL", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStateDir(function (stateDir) { return __awaiter(void 0, void 0, void 0, function () {
                        var created, oauthDir, filePath, raw, parsed, expiredAt, requests, list, next;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, pairing_store_js_1.upsertChannelPairingRequest)({
                                        channel: "signal",
                                        id: "+15550001111",
                                    })];
                                case 1:
                                    created = _b.sent();
                                    (0, vitest_1.expect)(created.created).toBe(true);
                                    oauthDir = (0, paths_js_1.resolveOAuthDir)(process.env, stateDir);
                                    filePath = node_path_1.default.join(oauthDir, "signal-pairing.json");
                                    return [4 /*yield*/, promises_1.default.readFile(filePath, "utf8")];
                                case 2:
                                    raw = _b.sent();
                                    parsed = JSON.parse(raw);
                                    expiredAt = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
                                    requests = ((_a = parsed.requests) !== null && _a !== void 0 ? _a : []).map(function (entry) { return (__assign(__assign({}, entry), { createdAt: expiredAt, lastSeenAt: expiredAt })); });
                                    return [4 /*yield*/, promises_1.default.writeFile(filePath, "".concat(JSON.stringify({ version: 1, requests: requests }, null, 2), "\n"), "utf8")];
                                case 3:
                                    _b.sent();
                                    return [4 /*yield*/, (0, pairing_store_js_1.listChannelPairingRequests)("signal")];
                                case 4:
                                    list = _b.sent();
                                    (0, vitest_1.expect)(list).toHaveLength(0);
                                    return [4 /*yield*/, (0, pairing_store_js_1.upsertChannelPairingRequest)({
                                            channel: "signal",
                                            id: "+15550001111",
                                        })];
                                case 5:
                                    next = _b.sent();
                                    (0, vitest_1.expect)(next.created).toBe(true);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("regenerates when a generated code collides", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStateDir(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var spy, first, sequence_1, idx_1, second;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    spy = vitest_1.vi.spyOn(node_crypto_1.default, "randomInt");
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, , 4, 5]);
                                    spy.mockReturnValue(0);
                                    return [4 /*yield*/, (0, pairing_store_js_1.upsertChannelPairingRequest)({
                                            channel: "telegram",
                                            id: "123",
                                        })];
                                case 2:
                                    first = _a.sent();
                                    (0, vitest_1.expect)(first.code).toBe("AAAAAAAA");
                                    sequence_1 = Array(8).fill(0).concat(Array(8).fill(1));
                                    idx_1 = 0;
                                    spy.mockImplementation(function () { var _a; return (_a = sequence_1[idx_1++]) !== null && _a !== void 0 ? _a : 1; });
                                    return [4 /*yield*/, (0, pairing_store_js_1.upsertChannelPairingRequest)({
                                            channel: "telegram",
                                            id: "456",
                                        })];
                                case 3:
                                    second = _a.sent();
                                    (0, vitest_1.expect)(second.code).toBe("BBBBBBBB");
                                    return [3 /*break*/, 5];
                                case 4:
                                    spy.mockRestore();
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("caps pending requests at the default limit", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStateDir(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var ids, _i, ids_1, id, created, blocked, list, listIds;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    ids = ["+15550000001", "+15550000002", "+15550000003"];
                                    _i = 0, ids_1 = ids;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < ids_1.length)) return [3 /*break*/, 4];
                                    id = ids_1[_i];
                                    return [4 /*yield*/, (0, pairing_store_js_1.upsertChannelPairingRequest)({
                                            channel: "whatsapp",
                                            id: id,
                                        })];
                                case 2:
                                    created = _a.sent();
                                    (0, vitest_1.expect)(created.created).toBe(true);
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [4 /*yield*/, (0, pairing_store_js_1.upsertChannelPairingRequest)({
                                        channel: "whatsapp",
                                        id: "+15550000004",
                                    })];
                                case 5:
                                    blocked = _a.sent();
                                    (0, vitest_1.expect)(blocked.created).toBe(false);
                                    return [4 /*yield*/, (0, pairing_store_js_1.listChannelPairingRequests)("whatsapp")];
                                case 6:
                                    list = _a.sent();
                                    listIds = list.map(function (entry) { return entry.id; });
                                    (0, vitest_1.expect)(listIds).toHaveLength(3);
                                    (0, vitest_1.expect)(listIds).toContain("+15550000001");
                                    (0, vitest_1.expect)(listIds).toContain("+15550000002");
                                    (0, vitest_1.expect)(listIds).toContain("+15550000003");
                                    (0, vitest_1.expect)(listIds).not.toContain("+15550000004");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
