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
exports.loadChannels = loadChannels;
exports.startWhatsAppLogin = startWhatsAppLogin;
exports.waitWhatsAppLogin = waitWhatsAppLogin;
exports.logoutWhatsApp = logoutWhatsApp;
function loadChannels(state, probe) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    if (state.channelsLoading) {
                        return [2 /*return*/];
                    }
                    state.channelsLoading = true;
                    state.channelsError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, state.client.request("channels.status", {
                            probe: probe,
                            timeoutMs: 8000,
                        })];
                case 2:
                    res = _a.sent();
                    state.channelsSnapshot = res;
                    state.channelsLastSuccess = Date.now();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    state.channelsError = String(err_1);
                    return [3 /*break*/, 5];
                case 4:
                    state.channelsLoading = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function startWhatsAppLogin(state, force) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!state.client || !state.connected || state.whatsappBusy) {
                        return [2 /*return*/];
                    }
                    state.whatsappBusy = true;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, state.client.request("web.login.start", {
                            force: force,
                            timeoutMs: 30000,
                        })];
                case 2:
                    res = _c.sent();
                    state.whatsappLoginMessage = (_a = res.message) !== null && _a !== void 0 ? _a : null;
                    state.whatsappLoginQrDataUrl = (_b = res.qrDataUrl) !== null && _b !== void 0 ? _b : null;
                    state.whatsappLoginConnected = null;
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _c.sent();
                    state.whatsappLoginMessage = String(err_2);
                    state.whatsappLoginQrDataUrl = null;
                    state.whatsappLoginConnected = null;
                    return [3 /*break*/, 5];
                case 4:
                    state.whatsappBusy = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function waitWhatsAppLogin(state) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!state.client || !state.connected || state.whatsappBusy) {
                        return [2 /*return*/];
                    }
                    state.whatsappBusy = true;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, state.client.request("web.login.wait", {
                            timeoutMs: 120000,
                        })];
                case 2:
                    res = _c.sent();
                    state.whatsappLoginMessage = (_a = res.message) !== null && _a !== void 0 ? _a : null;
                    state.whatsappLoginConnected = (_b = res.connected) !== null && _b !== void 0 ? _b : null;
                    if (res.connected) {
                        state.whatsappLoginQrDataUrl = null;
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_3 = _c.sent();
                    state.whatsappLoginMessage = String(err_3);
                    state.whatsappLoginConnected = null;
                    return [3 /*break*/, 5];
                case 4:
                    state.whatsappBusy = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function logoutWhatsApp(state) {
    return __awaiter(this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected || state.whatsappBusy) {
                        return [2 /*return*/];
                    }
                    state.whatsappBusy = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, state.client.request("channels.logout", { channel: "whatsapp" })];
                case 2:
                    _a.sent();
                    state.whatsappLoginMessage = "Logged out.";
                    state.whatsappLoginQrDataUrl = null;
                    state.whatsappLoginConnected = null;
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _a.sent();
                    state.whatsappLoginMessage = String(err_4);
                    return [3 /*break*/, 5];
                case 4:
                    state.whatsappBusy = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
