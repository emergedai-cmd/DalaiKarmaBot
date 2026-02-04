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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDevicePairing = listDevicePairing;
exports.getPairedDevice = getPairedDevice;
exports.requestDevicePairing = requestDevicePairing;
exports.approveDevicePairing = approveDevicePairing;
exports.rejectDevicePairing = rejectDevicePairing;
exports.updatePairedDeviceMetadata = updatePairedDeviceMetadata;
exports.summarizeDeviceTokens = summarizeDeviceTokens;
exports.verifyDeviceToken = verifyDeviceToken;
exports.ensureDeviceToken = ensureDeviceToken;
exports.rotateDeviceToken = rotateDeviceToken;
exports.revokeDeviceToken = revokeDeviceToken;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var PENDING_TTL_MS = 5 * 60 * 1000;
function resolvePaths(baseDir) {
    var root = baseDir !== null && baseDir !== void 0 ? baseDir : (0, paths_js_1.resolveStateDir)();
    var dir = node_path_1.default.join(root, "devices");
    return {
        dir: dir,
        pendingPath: node_path_1.default.join(dir, "pending.json"),
        pairedPath: node_path_1.default.join(dir, "paired.json"),
    };
}
function readJSON(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(filePath, "utf8")];
                case 1:
                    raw = _b.sent();
                    return [2 /*return*/, JSON.parse(raw)];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function writeJSONAtomic(filePath, value) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, tmp, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    dir = node_path_1.default.dirname(filePath);
                    return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
                case 1:
                    _c.sent();
                    tmp = "".concat(filePath, ".").concat((0, node_crypto_1.randomUUID)(), ".tmp");
                    return [4 /*yield*/, promises_1.default.writeFile(tmp, JSON.stringify(value, null, 2), "utf8")];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.chmod(tmp, 384)];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = _c.sent();
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, promises_1.default.rename(tmp, filePath)];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    _c.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, promises_1.default.chmod(filePath, 384)];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 11];
                case 10:
                    _b = _c.sent();
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function pruneExpiredPending(pendingById, nowMs) {
    for (var _i = 0, _a = Object.entries(pendingById); _i < _a.length; _i++) {
        var _b = _a[_i], id = _b[0], req = _b[1];
        if (nowMs - req.ts > PENDING_TTL_MS) {
            delete pendingById[id];
        }
    }
}
var lock = Promise.resolve();
function withLock(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var prev, release;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prev = lock;
                    lock = new Promise(function (resolve) {
                        release = resolve;
                    });
                    return [4 /*yield*/, prev];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, fn()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    release === null || release === void 0 ? void 0 : release();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function loadState(baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, pendingPath, pairedPath, _b, pending, paired, state;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = resolvePaths(baseDir), pendingPath = _a.pendingPath, pairedPath = _a.pairedPath;
                    return [4 /*yield*/, Promise.all([
                            readJSON(pendingPath),
                            readJSON(pairedPath),
                        ])];
                case 1:
                    _b = _c.sent(), pending = _b[0], paired = _b[1];
                    state = {
                        pendingById: pending !== null && pending !== void 0 ? pending : {},
                        pairedByDeviceId: paired !== null && paired !== void 0 ? paired : {},
                    };
                    pruneExpiredPending(state.pendingById, Date.now());
                    return [2 /*return*/, state];
            }
        });
    });
}
function persistState(state, baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, pendingPath, pairedPath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = resolvePaths(baseDir), pendingPath = _a.pendingPath, pairedPath = _a.pairedPath;
                    return [4 /*yield*/, Promise.all([
                            writeJSONAtomic(pendingPath, state.pendingById),
                            writeJSONAtomic(pairedPath, state.pairedByDeviceId),
                        ])];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function normalizeDeviceId(deviceId) {
    return deviceId.trim();
}
function normalizeRole(role) {
    var trimmed = role === null || role === void 0 ? void 0 : role.trim();
    return trimmed ? trimmed : null;
}
function mergeRoles() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var roles = new Set();
    for (var _a = 0, items_1 = items; _a < items_1.length; _a++) {
        var item = items_1[_a];
        if (!item) {
            continue;
        }
        if (Array.isArray(item)) {
            for (var _b = 0, item_1 = item; _b < item_1.length; _b++) {
                var role = item_1[_b];
                var trimmed = role.trim();
                if (trimmed) {
                    roles.add(trimmed);
                }
            }
        }
        else {
            var trimmed = item.trim();
            if (trimmed) {
                roles.add(trimmed);
            }
        }
    }
    if (roles.size === 0) {
        return undefined;
    }
    return __spreadArray([], roles, true);
}
function mergeScopes() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var scopes = new Set();
    for (var _a = 0, items_2 = items; _a < items_2.length; _a++) {
        var item = items_2[_a];
        if (!item) {
            continue;
        }
        for (var _b = 0, item_2 = item; _b < item_2.length; _b++) {
            var scope = item_2[_b];
            var trimmed = scope.trim();
            if (trimmed) {
                scopes.add(trimmed);
            }
        }
    }
    if (scopes.size === 0) {
        return undefined;
    }
    return __spreadArray([], scopes, true);
}
function normalizeScopes(scopes) {
    if (!Array.isArray(scopes)) {
        return [];
    }
    var out = new Set();
    for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
        var scope = scopes_1[_i];
        var trimmed = scope.trim();
        if (trimmed) {
            out.add(trimmed);
        }
    }
    return __spreadArray([], out, true).toSorted();
}
function scopesAllow(requested, allowed) {
    if (requested.length === 0) {
        return true;
    }
    if (allowed.length === 0) {
        return false;
    }
    var allowedSet = new Set(allowed);
    return requested.every(function (scope) { return allowedSet.has(scope); });
}
function newToken() {
    return (0, node_crypto_1.randomUUID)().replaceAll("-", "");
}
function listDevicePairing(baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var state, pending, paired;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadState(baseDir)];
                case 1:
                    state = _a.sent();
                    pending = Object.values(state.pendingById).toSorted(function (a, b) { return b.ts - a.ts; });
                    paired = Object.values(state.pairedByDeviceId).toSorted(function (a, b) { return b.approvedAtMs - a.approvedAtMs; });
                    return [2 /*return*/, { pending: pending, paired: paired }];
            }
        });
    });
}
function getPairedDevice(deviceId, baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var state;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loadState(baseDir)];
                case 1:
                    state = _b.sent();
                    return [2 /*return*/, (_a = state.pairedByDeviceId[normalizeDeviceId(deviceId)]) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
function requestDevicePairing(req, baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                        var state, deviceId, existing, isRepair, request;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, loadState(baseDir)];
                                case 1:
                                    state = _a.sent();
                                    deviceId = normalizeDeviceId(req.deviceId);
                                    if (!deviceId) {
                                        throw new Error("deviceId required");
                                    }
                                    existing = Object.values(state.pendingById).find(function (p) { return p.deviceId === deviceId; });
                                    if (existing) {
                                        return [2 /*return*/, { status: "pending", request: existing, created: false }];
                                    }
                                    isRepair = Boolean(state.pairedByDeviceId[deviceId]);
                                    request = {
                                        requestId: (0, node_crypto_1.randomUUID)(),
                                        deviceId: deviceId,
                                        publicKey: req.publicKey,
                                        displayName: req.displayName,
                                        platform: req.platform,
                                        clientId: req.clientId,
                                        clientMode: req.clientMode,
                                        role: req.role,
                                        roles: req.role ? [req.role] : undefined,
                                        scopes: req.scopes,
                                        remoteIp: req.remoteIp,
                                        silent: req.silent,
                                        isRepair: isRepair,
                                        ts: Date.now(),
                                    };
                                    state.pendingById[request.requestId] = request;
                                    return [4 /*yield*/, persistState(state, baseDir)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, { status: "pending", request: request, created: true }];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function approveDevicePairing(requestId, baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                        var state, pending, now, existing, roles, scopes, tokens, roleForToken, nextScopes, existingToken, now_1, device;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, loadState(baseDir)];
                                case 1:
                                    state = _c.sent();
                                    pending = state.pendingById[requestId];
                                    if (!pending) {
                                        return [2 /*return*/, null];
                                    }
                                    now = Date.now();
                                    existing = state.pairedByDeviceId[pending.deviceId];
                                    roles = mergeRoles(existing === null || existing === void 0 ? void 0 : existing.roles, existing === null || existing === void 0 ? void 0 : existing.role, pending.roles, pending.role);
                                    scopes = mergeScopes(existing === null || existing === void 0 ? void 0 : existing.scopes, pending.scopes);
                                    tokens = (existing === null || existing === void 0 ? void 0 : existing.tokens) ? __assign({}, existing.tokens) : {};
                                    roleForToken = normalizeRole(pending.role);
                                    if (roleForToken) {
                                        nextScopes = normalizeScopes(pending.scopes);
                                        existingToken = tokens[roleForToken];
                                        now_1 = Date.now();
                                        tokens[roleForToken] = {
                                            token: newToken(),
                                            role: roleForToken,
                                            scopes: nextScopes,
                                            createdAtMs: (_a = existingToken === null || existingToken === void 0 ? void 0 : existingToken.createdAtMs) !== null && _a !== void 0 ? _a : now_1,
                                            rotatedAtMs: existingToken ? now_1 : undefined,
                                            revokedAtMs: undefined,
                                            lastUsedAtMs: existingToken === null || existingToken === void 0 ? void 0 : existingToken.lastUsedAtMs,
                                        };
                                    }
                                    device = {
                                        deviceId: pending.deviceId,
                                        publicKey: pending.publicKey,
                                        displayName: pending.displayName,
                                        platform: pending.platform,
                                        clientId: pending.clientId,
                                        clientMode: pending.clientMode,
                                        role: pending.role,
                                        roles: roles,
                                        scopes: scopes,
                                        remoteIp: pending.remoteIp,
                                        tokens: tokens,
                                        createdAtMs: (_b = existing === null || existing === void 0 ? void 0 : existing.createdAtMs) !== null && _b !== void 0 ? _b : now,
                                        approvedAtMs: now,
                                    };
                                    delete state.pendingById[requestId];
                                    state.pairedByDeviceId[device.deviceId] = device;
                                    return [4 /*yield*/, persistState(state, baseDir)];
                                case 2:
                                    _c.sent();
                                    return [2 /*return*/, { requestId: requestId, device: device }];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function rejectDevicePairing(requestId, baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                        var state, pending;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, loadState(baseDir)];
                                case 1:
                                    state = _a.sent();
                                    pending = state.pendingById[requestId];
                                    if (!pending) {
                                        return [2 /*return*/, null];
                                    }
                                    delete state.pendingById[requestId];
                                    return [4 /*yield*/, persistState(state, baseDir)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, { requestId: requestId, deviceId: pending.deviceId }];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function updatePairedDeviceMetadata(deviceId, patch, baseDir) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                        var state, existing, roles, scopes;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, loadState(baseDir)];
                                case 1:
                                    state = _b.sent();
                                    existing = state.pairedByDeviceId[normalizeDeviceId(deviceId)];
                                    if (!existing) {
                                        return [2 /*return*/];
                                    }
                                    roles = mergeRoles(existing.roles, existing.role, patch.role);
                                    scopes = mergeScopes(existing.scopes, patch.scopes);
                                    state.pairedByDeviceId[deviceId] = __assign(__assign(__assign({}, existing), patch), { deviceId: existing.deviceId, createdAtMs: existing.createdAtMs, approvedAtMs: existing.approvedAtMs, role: (_a = patch.role) !== null && _a !== void 0 ? _a : existing.role, roles: roles, scopes: scopes });
                                    return [4 /*yield*/, persistState(state, baseDir)];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function summarizeDeviceTokens(tokens) {
    if (!tokens) {
        return undefined;
    }
    var summaries = Object.values(tokens)
        .map(function (token) { return ({
        role: token.role,
        scopes: token.scopes,
        createdAtMs: token.createdAtMs,
        rotatedAtMs: token.rotatedAtMs,
        revokedAtMs: token.revokedAtMs,
        lastUsedAtMs: token.lastUsedAtMs,
    }); })
        .toSorted(function (a, b) { return a.role.localeCompare(b.role); });
    return summaries.length > 0 ? summaries : undefined;
}
function verifyDeviceToken(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                        var state, device, role, entry, requestedScopes;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, loadState(params.baseDir)];
                                case 1:
                                    state = _c.sent();
                                    device = state.pairedByDeviceId[normalizeDeviceId(params.deviceId)];
                                    if (!device) {
                                        return [2 /*return*/, { ok: false, reason: "device-not-paired" }];
                                    }
                                    role = normalizeRole(params.role);
                                    if (!role) {
                                        return [2 /*return*/, { ok: false, reason: "role-missing" }];
                                    }
                                    entry = (_a = device.tokens) === null || _a === void 0 ? void 0 : _a[role];
                                    if (!entry) {
                                        return [2 /*return*/, { ok: false, reason: "token-missing" }];
                                    }
                                    if (entry.revokedAtMs) {
                                        return [2 /*return*/, { ok: false, reason: "token-revoked" }];
                                    }
                                    if (entry.token !== params.token) {
                                        return [2 /*return*/, { ok: false, reason: "token-mismatch" }];
                                    }
                                    requestedScopes = normalizeScopes(params.scopes);
                                    if (!scopesAllow(requestedScopes, entry.scopes)) {
                                        return [2 /*return*/, { ok: false, reason: "scope-mismatch" }];
                                    }
                                    entry.lastUsedAtMs = Date.now();
                                    (_b = device.tokens) !== null && _b !== void 0 ? _b : (device.tokens = {});
                                    device.tokens[role] = entry;
                                    state.pairedByDeviceId[device.deviceId] = device;
                                    return [4 /*yield*/, persistState(state, params.baseDir)];
                                case 2:
                                    _c.sent();
                                    return [2 /*return*/, { ok: true }];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function ensureDeviceToken(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                        var state, device, role, requestedScopes, tokens, existing, now, next;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, loadState(params.baseDir)];
                                case 1:
                                    state = _b.sent();
                                    device = state.pairedByDeviceId[normalizeDeviceId(params.deviceId)];
                                    if (!device) {
                                        return [2 /*return*/, null];
                                    }
                                    role = normalizeRole(params.role);
                                    if (!role) {
                                        return [2 /*return*/, null];
                                    }
                                    requestedScopes = normalizeScopes(params.scopes);
                                    tokens = device.tokens ? __assign({}, device.tokens) : {};
                                    existing = tokens[role];
                                    if (existing && !existing.revokedAtMs) {
                                        if (scopesAllow(requestedScopes, existing.scopes)) {
                                            return [2 /*return*/, existing];
                                        }
                                    }
                                    now = Date.now();
                                    next = {
                                        token: newToken(),
                                        role: role,
                                        scopes: requestedScopes,
                                        createdAtMs: (_a = existing === null || existing === void 0 ? void 0 : existing.createdAtMs) !== null && _a !== void 0 ? _a : now,
                                        rotatedAtMs: existing ? now : undefined,
                                        revokedAtMs: undefined,
                                        lastUsedAtMs: existing === null || existing === void 0 ? void 0 : existing.lastUsedAtMs,
                                    };
                                    tokens[role] = next;
                                    device.tokens = tokens;
                                    state.pairedByDeviceId[device.deviceId] = device;
                                    return [4 /*yield*/, persistState(state, params.baseDir)];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/, next];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function rotateDeviceToken(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                        var state, device, role, tokens, existing, requestedScopes, now, next;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, loadState(params.baseDir)];
                                case 1:
                                    state = _d.sent();
                                    device = state.pairedByDeviceId[normalizeDeviceId(params.deviceId)];
                                    if (!device) {
                                        return [2 /*return*/, null];
                                    }
                                    role = normalizeRole(params.role);
                                    if (!role) {
                                        return [2 /*return*/, null];
                                    }
                                    tokens = device.tokens ? __assign({}, device.tokens) : {};
                                    existing = tokens[role];
                                    requestedScopes = normalizeScopes((_b = (_a = params.scopes) !== null && _a !== void 0 ? _a : existing === null || existing === void 0 ? void 0 : existing.scopes) !== null && _b !== void 0 ? _b : device.scopes);
                                    now = Date.now();
                                    next = {
                                        token: newToken(),
                                        role: role,
                                        scopes: requestedScopes,
                                        createdAtMs: (_c = existing === null || existing === void 0 ? void 0 : existing.createdAtMs) !== null && _c !== void 0 ? _c : now,
                                        rotatedAtMs: now,
                                        revokedAtMs: undefined,
                                        lastUsedAtMs: existing === null || existing === void 0 ? void 0 : existing.lastUsedAtMs,
                                    };
                                    tokens[role] = next;
                                    device.tokens = tokens;
                                    if (params.scopes !== undefined) {
                                        device.scopes = requestedScopes;
                                    }
                                    state.pairedByDeviceId[device.deviceId] = device;
                                    return [4 /*yield*/, persistState(state, params.baseDir)];
                                case 2:
                                    _d.sent();
                                    return [2 /*return*/, next];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function revokeDeviceToken(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                        var state, device, role, tokens, entry;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, loadState(params.baseDir)];
                                case 1:
                                    state = _b.sent();
                                    device = state.pairedByDeviceId[normalizeDeviceId(params.deviceId)];
                                    if (!device) {
                                        return [2 /*return*/, null];
                                    }
                                    role = normalizeRole(params.role);
                                    if (!role) {
                                        return [2 /*return*/, null];
                                    }
                                    if (!((_a = device.tokens) === null || _a === void 0 ? void 0 : _a[role])) {
                                        return [2 /*return*/, null];
                                    }
                                    tokens = __assign({}, device.tokens);
                                    entry = __assign(__assign({}, tokens[role]), { revokedAtMs: Date.now() });
                                    tokens[role] = entry;
                                    device.tokens = tokens;
                                    state.pairedByDeviceId[device.deviceId] = device;
                                    return [4 /*yield*/, persistState(state, params.baseDir)];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/, entry];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
