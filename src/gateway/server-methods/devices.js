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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceHandlers = void 0;
var device_pairing_js_1 = require("../../infra/device-pairing.js");
var index_js_1 = require("../protocol/index.js");
function redactPairedDevice(device) {
    var tokens = device.tokens, rest = __rest(device, ["tokens"]);
    return __assign(__assign({}, rest), { tokens: (0, device_pairing_js_1.summarizeDeviceTokens)(tokens) });
}
exports.deviceHandlers = {
    "device.pair.list": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var list;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateDevicePairListParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid device.pair.list params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateDevicePairListParams.errors))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, device_pairing_js_1.listDevicePairing)()];
                case 1:
                    list = _c.sent();
                    respond(true, {
                        pending: list.pending,
                        paired: list.paired.map(function (device) { return redactPairedDevice(device); }),
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "device.pair.approve": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var requestId, approved;
        var _c;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateDevicePairApproveParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid device.pair.approve params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateDevicePairApproveParams.errors))));
                        return [2 /*return*/];
                    }
                    requestId = params.requestId;
                    return [4 /*yield*/, (0, device_pairing_js_1.approveDevicePairing)(requestId)];
                case 1:
                    approved = _d.sent();
                    if (!approved) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown requestId"));
                        return [2 /*return*/];
                    }
                    context.logGateway.info("device pairing approved device=".concat(approved.device.deviceId, " role=").concat((_c = approved.device.role) !== null && _c !== void 0 ? _c : "unknown"));
                    context.broadcast("device.pair.resolved", {
                        requestId: requestId,
                        deviceId: approved.device.deviceId,
                        decision: "approved",
                        ts: Date.now(),
                    }, { dropIfSlow: true });
                    respond(true, { requestId: requestId, device: redactPairedDevice(approved.device) }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "device.pair.reject": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var requestId, rejected;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateDevicePairRejectParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid device.pair.reject params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateDevicePairRejectParams.errors))));
                        return [2 /*return*/];
                    }
                    requestId = params.requestId;
                    return [4 /*yield*/, (0, device_pairing_js_1.rejectDevicePairing)(requestId)];
                case 1:
                    rejected = _c.sent();
                    if (!rejected) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown requestId"));
                        return [2 /*return*/];
                    }
                    context.broadcast("device.pair.resolved", {
                        requestId: requestId,
                        deviceId: rejected.deviceId,
                        decision: "rejected",
                        ts: Date.now(),
                    }, { dropIfSlow: true });
                    respond(true, rejected, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "device.token.rotate": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c, deviceId, role, scopes, entry;
        var _d;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(0, index_js_1.validateDeviceTokenRotateParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid device.token.rotate params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateDeviceTokenRotateParams.errors))));
                        return [2 /*return*/];
                    }
                    _c = params, deviceId = _c.deviceId, role = _c.role, scopes = _c.scopes;
                    return [4 /*yield*/, (0, device_pairing_js_1.rotateDeviceToken)({ deviceId: deviceId, role: role, scopes: scopes })];
                case 1:
                    entry = _e.sent();
                    if (!entry) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown deviceId/role"));
                        return [2 /*return*/];
                    }
                    context.logGateway.info("device token rotated device=".concat(deviceId, " role=").concat(entry.role, " scopes=").concat(entry.scopes.join(",")));
                    respond(true, {
                        deviceId: deviceId,
                        role: entry.role,
                        token: entry.token,
                        scopes: entry.scopes,
                        rotatedAtMs: (_d = entry.rotatedAtMs) !== null && _d !== void 0 ? _d : entry.createdAtMs,
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "device.token.revoke": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c, deviceId, role, entry;
        var _d;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(0, index_js_1.validateDeviceTokenRevokeParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid device.token.revoke params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateDeviceTokenRevokeParams.errors))));
                        return [2 /*return*/];
                    }
                    _c = params, deviceId = _c.deviceId, role = _c.role;
                    return [4 /*yield*/, (0, device_pairing_js_1.revokeDeviceToken)({ deviceId: deviceId, role: role })];
                case 1:
                    entry = _e.sent();
                    if (!entry) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown deviceId/role"));
                        return [2 /*return*/];
                    }
                    context.logGateway.info("device token revoked device=".concat(deviceId, " role=").concat(entry.role));
                    respond(true, { deviceId: deviceId, role: entry.role, revokedAtMs: (_d = entry.revokedAtMs) !== null && _d !== void 0 ? _d : Date.now() }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
};
