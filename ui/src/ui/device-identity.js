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
exports.loadOrCreateDeviceIdentity = loadOrCreateDeviceIdentity;
exports.signDevicePayload = signDevicePayload;
var ed25519_1 = require("@noble/ed25519");
var STORAGE_KEY = "openclaw-device-identity-v1";
function base64UrlEncode(bytes) {
    var binary = "";
    for (var _i = 0, bytes_1 = bytes; _i < bytes_1.length; _i++) {
        var byte = bytes_1[_i];
        binary += String.fromCharCode(byte);
    }
    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}
function base64UrlDecode(input) {
    var normalized = input.replaceAll("-", "+").replaceAll("_", "/");
    var padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    var binary = atob(padded);
    var out = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) {
        out[i] = binary.charCodeAt(i);
    }
    return out;
}
function bytesToHex(bytes) {
    return Array.from(bytes)
        .map(function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
}
function fingerprintPublicKey(publicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto.subtle.digest("SHA-256", publicKey)];
                case 1:
                    hash = _a.sent();
                    return [2 /*return*/, bytesToHex(new Uint8Array(hash))];
            }
        });
    });
}
function generateIdentity() {
    return __awaiter(this, void 0, void 0, function () {
        var privateKey, publicKey, deviceId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privateKey = ed25519_1.utils.randomSecretKey();
                    return [4 /*yield*/, (0, ed25519_1.getPublicKeyAsync)(privateKey)];
                case 1:
                    publicKey = _a.sent();
                    return [4 /*yield*/, fingerprintPublicKey(publicKey)];
                case 2:
                    deviceId = _a.sent();
                    return [2 /*return*/, {
                            deviceId: deviceId,
                            publicKey: base64UrlEncode(publicKey),
                            privateKey: base64UrlEncode(privateKey),
                        }];
            }
        });
    });
}
function loadOrCreateDeviceIdentity() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, derivedId, updated, _a, identity, stored;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    raw = localStorage.getItem(STORAGE_KEY);
                    if (!raw) return [3 /*break*/, 2];
                    parsed = JSON.parse(raw);
                    if (!((parsed === null || parsed === void 0 ? void 0 : parsed.version) === 1 &&
                        typeof parsed.deviceId === "string" &&
                        typeof parsed.publicKey === "string" &&
                        typeof parsed.privateKey === "string")) return [3 /*break*/, 2];
                    return [4 /*yield*/, fingerprintPublicKey(base64UrlDecode(parsed.publicKey))];
                case 1:
                    derivedId = _b.sent();
                    if (derivedId !== parsed.deviceId) {
                        updated = __assign(__assign({}, parsed), { deviceId: derivedId });
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                        return [2 /*return*/, {
                                deviceId: derivedId,
                                publicKey: parsed.publicKey,
                                privateKey: parsed.privateKey,
                            }];
                    }
                    return [2 /*return*/, {
                            deviceId: parsed.deviceId,
                            publicKey: parsed.publicKey,
                            privateKey: parsed.privateKey,
                        }];
                case 2: return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, generateIdentity()];
                case 5:
                    identity = _b.sent();
                    stored = {
                        version: 1,
                        deviceId: identity.deviceId,
                        publicKey: identity.publicKey,
                        privateKey: identity.privateKey,
                        createdAtMs: Date.now(),
                    };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
                    return [2 /*return*/, identity];
            }
        });
    });
}
function signDevicePayload(privateKeyBase64Url, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var key, data, sig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = base64UrlDecode(privateKeyBase64Url);
                    data = new TextEncoder().encode(payload);
                    return [4 /*yield*/, (0, ed25519_1.signAsync)(data, key)];
                case 1:
                    sig = _a.sent();
                    return [2 /*return*/, base64UrlEncode(sig)];
            }
        });
    });
}
