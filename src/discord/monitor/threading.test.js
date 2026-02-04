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
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var threading_js_1 = require("./threading.js");
(0, vitest_1.describe)("resolveDiscordAutoThreadContext", function () {
    (0, vitest_1.it)("returns null when no createdThreadId", function () {
        (0, vitest_1.expect)((0, threading_js_1.resolveDiscordAutoThreadContext)({
            agentId: "agent",
            channel: "discord",
            messageChannelId: "parent",
            createdThreadId: undefined,
        })).toBeNull();
    });
    (0, vitest_1.it)("re-keys session context to the created thread", function () {
        var context = (0, threading_js_1.resolveDiscordAutoThreadContext)({
            agentId: "agent",
            channel: "discord",
            messageChannelId: "parent",
            createdThreadId: "thread",
        });
        (0, vitest_1.expect)(context).not.toBeNull();
        (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.To).toBe("channel:thread");
        (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.From).toBe("discord:channel:thread");
        (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.OriginatingTo).toBe("channel:thread");
        (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.SessionKey).toBe((0, resolve_route_js_1.buildAgentSessionKey)({
            agentId: "agent",
            channel: "discord",
            peer: { kind: "channel", id: "thread" },
        }));
        (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.ParentSessionKey).toBe((0, resolve_route_js_1.buildAgentSessionKey)({
            agentId: "agent",
            channel: "discord",
            peer: { kind: "channel", id: "parent" },
        }));
    });
});
(0, vitest_1.describe)("resolveDiscordReplyDeliveryPlan", function () {
    (0, vitest_1.it)("uses reply references when posting to the original target", function () {
        var plan = (0, threading_js_1.resolveDiscordReplyDeliveryPlan)({
            replyTarget: "channel:parent",
            replyToMode: "all",
            messageId: "m1",
            threadChannel: null,
            createdThreadId: null,
        });
        (0, vitest_1.expect)(plan.deliverTarget).toBe("channel:parent");
        (0, vitest_1.expect)(plan.replyTarget).toBe("channel:parent");
        (0, vitest_1.expect)(plan.replyReference.use()).toBe("m1");
    });
    (0, vitest_1.it)("disables reply references when autoThread creates a new thread", function () {
        var plan = (0, threading_js_1.resolveDiscordReplyDeliveryPlan)({
            replyTarget: "channel:parent",
            replyToMode: "all",
            messageId: "m1",
            threadChannel: null,
            createdThreadId: "thread",
        });
        (0, vitest_1.expect)(plan.deliverTarget).toBe("channel:thread");
        (0, vitest_1.expect)(plan.replyTarget).toBe("channel:thread");
        (0, vitest_1.expect)(plan.replyReference.use()).toBeUndefined();
    });
    (0, vitest_1.it)("always uses existingId when inside a thread", function () {
        var plan = (0, threading_js_1.resolveDiscordReplyDeliveryPlan)({
            replyTarget: "channel:thread",
            replyToMode: "off",
            messageId: "m1",
            threadChannel: { id: "thread" },
            createdThreadId: null,
        });
        (0, vitest_1.expect)(plan.replyReference.use()).toBe("m1");
    });
});
(0, vitest_1.describe)("resolveDiscordAutoThreadReplyPlan", function () {
    (0, vitest_1.it)("switches delivery + session context to the created thread", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, plan;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = {
                        rest: { post: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ id: "thread" })];
                            }); }); } },
                    };
                    return [4 /*yield*/, (0, threading_js_1.resolveDiscordAutoThreadReplyPlan)({
                            client: client,
                            message: {
                                id: "m1",
                                channelId: "parent",
                            },
                            isGuildMessage: true,
                            channelConfig: {
                                autoThread: true,
                            },
                            threadChannel: null,
                            baseText: "hello",
                            combinedBody: "hello",
                            replyToMode: "all",
                            agentId: "agent",
                            channel: "discord",
                        })];
                case 1:
                    plan = _b.sent();
                    (0, vitest_1.expect)(plan.deliverTarget).toBe("channel:thread");
                    (0, vitest_1.expect)(plan.replyReference.use()).toBeUndefined();
                    (0, vitest_1.expect)((_a = plan.autoThreadContext) === null || _a === void 0 ? void 0 : _a.SessionKey).toBe((0, resolve_route_js_1.buildAgentSessionKey)({
                        agentId: "agent",
                        channel: "discord",
                        peer: { kind: "channel", id: "thread" },
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does nothing when autoThread is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, plan;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = { rest: { post: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ id: "thread" })];
                            }); }); } } };
                    return [4 /*yield*/, (0, threading_js_1.resolveDiscordAutoThreadReplyPlan)({
                            client: client,
                            message: {
                                id: "m1",
                                channelId: "parent",
                            },
                            isGuildMessage: true,
                            channelConfig: {
                                autoThread: false,
                            },
                            threadChannel: null,
                            baseText: "hello",
                            combinedBody: "hello",
                            replyToMode: "all",
                            agentId: "agent",
                            channel: "discord",
                        })];
                case 1:
                    plan = _a.sent();
                    (0, vitest_1.expect)(plan.deliverTarget).toBe("channel:parent");
                    (0, vitest_1.expect)(plan.autoThreadContext).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
