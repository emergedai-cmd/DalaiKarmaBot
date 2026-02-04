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
var outbound_session_js_1 = require("./outbound-session.js");
var baseConfig = {};
(0, vitest_1.describe)("resolveOutboundSessionRoute", function () {
    (0, vitest_1.it)("builds Slack thread session keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var route;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, outbound_session_js_1.resolveOutboundSessionRoute)({
                        cfg: baseConfig,
                        channel: "slack",
                        agentId: "main",
                        target: "channel:C123",
                        replyToId: "456",
                    })];
                case 1:
                    route = _a.sent();
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.sessionKey).toBe("agent:main:slack:channel:c123:thread:456");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.from).toBe("slack:channel:C123");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.to).toBe("channel:C123");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.threadId).toBe("456");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses Telegram topic ids in group session keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var route;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, outbound_session_js_1.resolveOutboundSessionRoute)({
                        cfg: baseConfig,
                        channel: "telegram",
                        agentId: "main",
                        target: "-100123456:topic:42",
                    })];
                case 1:
                    route = _a.sent();
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.sessionKey).toBe("agent:main:telegram:group:-100123456:topic:42");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.from).toBe("telegram:group:-100123456:topic:42");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.to).toBe("telegram:-100123456");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.threadId).toBe(42);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats Telegram usernames as DMs when unresolved", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, route;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { session: { dmScope: "per-channel-peer" } };
                    return [4 /*yield*/, (0, outbound_session_js_1.resolveOutboundSessionRoute)({
                            cfg: cfg,
                            channel: "telegram",
                            agentId: "main",
                            target: "@alice",
                        })];
                case 1:
                    route = _a.sent();
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.sessionKey).toBe("agent:main:telegram:dm:@alice");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.chatType).toBe("direct");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors dmScope identity links", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, route;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        session: {
                            dmScope: "per-peer",
                            identityLinks: {
                                alice: ["discord:123"],
                            },
                        },
                    };
                    return [4 /*yield*/, (0, outbound_session_js_1.resolveOutboundSessionRoute)({
                            cfg: cfg,
                            channel: "discord",
                            agentId: "main",
                            target: "user:123",
                        })];
                case 1:
                    route = _a.sent();
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.sessionKey).toBe("agent:main:dm:alice");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("strips chat_* prefixes for BlueBubbles group session keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var route;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, outbound_session_js_1.resolveOutboundSessionRoute)({
                        cfg: baseConfig,
                        channel: "bluebubbles",
                        agentId: "main",
                        target: "chat_guid:ABC123",
                    })];
                case 1:
                    route = _a.sent();
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.sessionKey).toBe("agent:main:bluebubbles:group:abc123");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.from).toBe("group:ABC123");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats Zalo Personal DM targets as direct sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, route;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = { session: { dmScope: "per-channel-peer" } };
                    return [4 /*yield*/, (0, outbound_session_js_1.resolveOutboundSessionRoute)({
                            cfg: cfg,
                            channel: "zalouser",
                            agentId: "main",
                            target: "123456",
                        })];
                case 1:
                    route = _a.sent();
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.sessionKey).toBe("agent:main:zalouser:dm:123456");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.chatType).toBe("direct");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses group session keys for Slack mpim allowlist entries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, route;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            slack: {
                                dm: {
                                    groupChannels: ["G123"],
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, (0, outbound_session_js_1.resolveOutboundSessionRoute)({
                            cfg: cfg,
                            channel: "slack",
                            agentId: "main",
                            target: "channel:G123",
                        })];
                case 1:
                    route = _a.sent();
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.sessionKey).toBe("agent:main:slack:group:g123");
                    (0, vitest_1.expect)(route === null || route === void 0 ? void 0 : route.from).toBe("slack:group:G123");
                    return [2 /*return*/];
            }
        });
    }); });
});
