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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var device_pairing_js_1 = require("./device-pairing.js");
(0, vitest_1.describe)("device pairing tokens", function () {
    (0, vitest_1.test)("preserves existing token scopes when rotating without scopes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var baseDir, request, paired;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), "openclaw-device-pairing-"))];
                case 1:
                    baseDir = _e.sent();
                    return [4 /*yield*/, (0, device_pairing_js_1.requestDevicePairing)({
                            deviceId: "device-1",
                            publicKey: "public-key-1",
                            role: "operator",
                            scopes: ["operator.admin"],
                        }, baseDir)];
                case 2:
                    request = _e.sent();
                    return [4 /*yield*/, (0, device_pairing_js_1.approveDevicePairing)(request.request.requestId, baseDir)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, (0, device_pairing_js_1.rotateDeviceToken)({
                            deviceId: "device-1",
                            role: "operator",
                            scopes: ["operator.read"],
                            baseDir: baseDir,
                        })];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, (0, device_pairing_js_1.getPairedDevice)("device-1", baseDir)];
                case 5:
                    paired = _e.sent();
                    (0, vitest_1.expect)((_b = (_a = paired === null || paired === void 0 ? void 0 : paired.tokens) === null || _a === void 0 ? void 0 : _a.operator) === null || _b === void 0 ? void 0 : _b.scopes).toEqual(["operator.read"]);
                    (0, vitest_1.expect)(paired === null || paired === void 0 ? void 0 : paired.scopes).toEqual(["operator.read"]);
                    return [4 /*yield*/, (0, device_pairing_js_1.rotateDeviceToken)({
                            deviceId: "device-1",
                            role: "operator",
                            baseDir: baseDir,
                        })];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, (0, device_pairing_js_1.getPairedDevice)("device-1", baseDir)];
                case 7:
                    paired = _e.sent();
                    (0, vitest_1.expect)((_d = (_c = paired === null || paired === void 0 ? void 0 : paired.tokens) === null || _c === void 0 ? void 0 : _c.operator) === null || _d === void 0 ? void 0 : _d.scopes).toEqual(["operator.read"]);
                    return [2 /*return*/];
            }
        });
    }); });
});
