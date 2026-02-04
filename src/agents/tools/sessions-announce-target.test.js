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
var vitest_1 = require("vitest");
var channel_plugins_js_1 = require("../../test-utils/channel-plugins.js");
var callGatewayMock = vitest_1.vi.fn();
vitest_1.vi.mock("../../gateway/call.js", function () { return ({
    callGateway: function (opts) { return callGatewayMock(opts); },
}); });
var loadResolveAnnounceTarget = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sessions-announce-target.js"); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var installRegistry = function () { return __awaiter(void 0, void 0, void 0, function () {
    var setActivePluginRegistry;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../plugins/runtime.js"); })];
            case 1:
                setActivePluginRegistry = (_a.sent()).setActivePluginRegistry;
                setActivePluginRegistry((0, channel_plugins_js_1.createTestRegistry)([
                    {
                        pluginId: "discord",
                        source: "test",
                        plugin: {
                            id: "discord",
                            meta: {
                                id: "discord",
                                label: "Discord",
                                selectionLabel: "Discord",
                                docsPath: "/channels/discord",
                                blurb: "Discord test stub.",
                            },
                            capabilities: { chatTypes: ["direct", "channel", "thread"] },
                            config: {
                                listAccountIds: function () { return ["default"]; },
                                resolveAccount: function () { return ({}); },
                            },
                        },
                    },
                    {
                        pluginId: "whatsapp",
                        source: "test",
                        plugin: {
                            id: "whatsapp",
                            meta: {
                                id: "whatsapp",
                                label: "WhatsApp",
                                selectionLabel: "WhatsApp",
                                docsPath: "/channels/whatsapp",
                                blurb: "WhatsApp test stub.",
                                preferSessionLookupForAnnounceTarget: true,
                            },
                            capabilities: { chatTypes: ["direct", "group"] },
                            config: {
                                listAccountIds: function () { return ["default"]; },
                                resolveAccount: function () { return ({}); },
                            },
                        },
                    },
                ]));
                return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.describe)("resolveAnnounceTarget", function () {
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callGatewayMock.mockReset();
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, installRegistry()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("derives non-WhatsApp announce targets from the session key", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveAnnounceTarget, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadResolveAnnounceTarget()];
                case 1:
                    resolveAnnounceTarget = (_a.sent()).resolveAnnounceTarget;
                    return [4 /*yield*/, resolveAnnounceTarget({
                            sessionKey: "agent:main:discord:group:dev",
                            displayKey: "agent:main:discord:group:dev",
                        })];
                case 2:
                    target = _a.sent();
                    (0, vitest_1.expect)(target).toEqual({ channel: "discord", to: "channel:dev" });
                    (0, vitest_1.expect)(callGatewayMock).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("hydrates WhatsApp accountId from sessions.list when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveAnnounceTarget, target, first;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loadResolveAnnounceTarget()];
                case 1:
                    resolveAnnounceTarget = (_b.sent()).resolveAnnounceTarget;
                    callGatewayMock.mockResolvedValueOnce({
                        sessions: [
                            {
                                key: "agent:main:whatsapp:group:123@g.us",
                                deliveryContext: {
                                    channel: "whatsapp",
                                    to: "123@g.us",
                                    accountId: "work",
                                },
                            },
                        ],
                    });
                    return [4 /*yield*/, resolveAnnounceTarget({
                            sessionKey: "agent:main:whatsapp:group:123@g.us",
                            displayKey: "agent:main:whatsapp:group:123@g.us",
                        })];
                case 2:
                    target = _b.sent();
                    (0, vitest_1.expect)(target).toEqual({
                        channel: "whatsapp",
                        to: "123@g.us",
                        accountId: "work",
                    });
                    (0, vitest_1.expect)(callGatewayMock).toHaveBeenCalledTimes(1);
                    first = (_a = callGatewayMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)(first).toBeDefined();
                    (0, vitest_1.expect)(first === null || first === void 0 ? void 0 : first.method).toBe("sessions.list");
                    return [2 /*return*/];
            }
        });
    }); });
});
