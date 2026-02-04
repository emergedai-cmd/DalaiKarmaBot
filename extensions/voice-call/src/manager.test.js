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
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
var manager_js_1 = require("./manager.js");
var FakeProvider = /** @class */ (function () {
    function FakeProvider() {
        this.name = "plivo";
        this.playTtsCalls = [];
    }
    FakeProvider.prototype.verifyWebhook = function (_ctx) {
        return { ok: true };
    };
    FakeProvider.prototype.parseWebhookEvent = function (_ctx) {
        return { events: [], statusCode: 200 };
    };
    FakeProvider.prototype.initiateCall = function (_input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { providerCallId: "request-uuid", status: "initiated" }];
            });
        });
    };
    FakeProvider.prototype.hangupCall = function (_input) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    FakeProvider.prototype.playTts = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.playTtsCalls.push(input);
                return [2 /*return*/];
            });
        });
    };
    FakeProvider.prototype.startListening = function (_input) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    FakeProvider.prototype.stopListening = function (_input) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    return FakeProvider;
}());
(0, vitest_1.describe)("CallManager", function () {
    (0, vitest_1.it)("upgrades providerCallId mapping when provider ID changes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var config, storePath, manager, _a, callId, success, error;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    config = config_js_1.VoiceCallConfigSchema.parse({
                        enabled: true,
                        provider: "plivo",
                        fromNumber: "+15550000000",
                    });
                    storePath = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-voice-call-test-".concat(Date.now()));
                    manager = new manager_js_1.CallManager(config, storePath);
                    manager.initialize(new FakeProvider(), "https://example.com/voice/webhook");
                    return [4 /*yield*/, manager.initiateCall("+15550000001")];
                case 1:
                    _a = _f.sent(), callId = _a.callId, success = _a.success, error = _a.error;
                    (0, vitest_1.expect)(success).toBe(true);
                    (0, vitest_1.expect)(error).toBeUndefined();
                    // The provider returned a request UUID as the initial providerCallId.
                    (0, vitest_1.expect)((_b = manager.getCall(callId)) === null || _b === void 0 ? void 0 : _b.providerCallId).toBe("request-uuid");
                    (0, vitest_1.expect)((_c = manager.getCallByProviderCallId("request-uuid")) === null || _c === void 0 ? void 0 : _c.callId).toBe(callId);
                    // Provider later reports the actual call UUID.
                    manager.processEvent({
                        id: "evt-1",
                        type: "call.answered",
                        callId: callId,
                        providerCallId: "call-uuid",
                        timestamp: Date.now(),
                    });
                    (0, vitest_1.expect)((_d = manager.getCall(callId)) === null || _d === void 0 ? void 0 : _d.providerCallId).toBe("call-uuid");
                    (0, vitest_1.expect)((_e = manager.getCallByProviderCallId("call-uuid")) === null || _e === void 0 ? void 0 : _e.callId).toBe(callId);
                    (0, vitest_1.expect)(manager.getCallByProviderCallId("request-uuid")).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("speaks initial message on answered for notify mode (non-Twilio)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var config, storePath, provider, manager, _a, callId, success;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = config_js_1.VoiceCallConfigSchema.parse({
                        enabled: true,
                        provider: "plivo",
                        fromNumber: "+15550000000",
                    });
                    storePath = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-voice-call-test-".concat(Date.now()));
                    provider = new FakeProvider();
                    manager = new manager_js_1.CallManager(config, storePath);
                    manager.initialize(provider, "https://example.com/voice/webhook");
                    return [4 /*yield*/, manager.initiateCall("+15550000002", undefined, {
                            message: "Hello there",
                            mode: "notify",
                        })];
                case 1:
                    _a = _c.sent(), callId = _a.callId, success = _a.success;
                    (0, vitest_1.expect)(success).toBe(true);
                    manager.processEvent({
                        id: "evt-2",
                        type: "call.answered",
                        callId: callId,
                        providerCallId: "call-uuid",
                        timestamp: Date.now(),
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(provider.playTtsCalls).toHaveLength(1);
                    (0, vitest_1.expect)((_b = provider.playTtsCalls[0]) === null || _b === void 0 ? void 0 : _b.text).toBe("Hello there");
                    return [2 /*return*/];
            }
        });
    }); });
});
