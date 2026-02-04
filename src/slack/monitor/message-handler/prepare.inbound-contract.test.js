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
var inbound_contract_js_1 = require("../../../../test/helpers/inbound-contract.js");
var context_js_1 = require("../context.js");
var prepare_js_1 = require("./prepare.js");
(0, vitest_1.describe)("slack prepareSlackMessage inbound contract", function () {
    (0, vitest_1.it)("produces a finalized MsgContext", function () { return __awaiter(void 0, void 0, void 0, function () {
        var slackCtx, account, message, prepared;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    slackCtx = (0, context_js_1.createSlackMonitorContext)({
                        cfg: {
                            channels: { slack: { enabled: true } },
                        },
                        accountId: "default",
                        botToken: "token",
                        app: { client: {} },
                        runtime: {},
                        botUserId: "B1",
                        teamId: "T1",
                        apiAppId: "A1",
                        historyLimit: 0,
                        sessionScope: "per-sender",
                        mainKey: "main",
                        dmEnabled: true,
                        dmPolicy: "open",
                        allowFrom: [],
                        groupDmEnabled: true,
                        groupDmChannels: [],
                        defaultRequireMention: true,
                        groupPolicy: "open",
                        useAccessGroups: false,
                        reactionMode: "off",
                        reactionAllowlist: [],
                        replyToMode: "off",
                        threadHistoryScope: "thread",
                        threadInheritParent: false,
                        slashCommand: {
                            enabled: false,
                            name: "openclaw",
                            sessionPrefix: "slack:slash",
                            ephemeral: true,
                        },
                        textLimit: 4000,
                        ackReactionScope: "group-mentions",
                        mediaMaxBytes: 1024,
                        removeAckAfterReply: false,
                    });
                    // oxlint-disable-next-line typescript/no-explicit-any
                    slackCtx.resolveUserName = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ name: "Alice" })];
                    }); }); };
                    account = {
                        accountId: "default",
                        enabled: true,
                        botTokenSource: "config",
                        appTokenSource: "config",
                        config: {},
                    };
                    message = {
                        channel: "D123",
                        channel_type: "im",
                        user: "U1",
                        text: "hi",
                        ts: "1.000",
                    };
                    return [4 /*yield*/, (0, prepare_js_1.prepareSlackMessage)({
                            ctx: slackCtx,
                            account: account,
                            message: message,
                            opts: { source: "message" },
                        })];
                case 1:
                    prepared = _a.sent();
                    (0, vitest_1.expect)(prepared).toBeTruthy();
                    // oxlint-disable-next-line typescript/no-explicit-any
                    (0, inbound_contract_js_1.expectInboundContextContract)(prepared.ctxPayload);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sets MessageThreadId for top-level messages when replyToMode=all", function () { return __awaiter(void 0, void 0, void 0, function () {
        var slackCtx, account, message, prepared;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    slackCtx = (0, context_js_1.createSlackMonitorContext)({
                        cfg: {
                            channels: { slack: { enabled: true, replyToMode: "all" } },
                        },
                        accountId: "default",
                        botToken: "token",
                        app: { client: {} },
                        runtime: {},
                        botUserId: "B1",
                        teamId: "T1",
                        apiAppId: "A1",
                        historyLimit: 0,
                        sessionScope: "per-sender",
                        mainKey: "main",
                        dmEnabled: true,
                        dmPolicy: "open",
                        allowFrom: [],
                        groupDmEnabled: true,
                        groupDmChannels: [],
                        defaultRequireMention: true,
                        groupPolicy: "open",
                        useAccessGroups: false,
                        reactionMode: "off",
                        reactionAllowlist: [],
                        replyToMode: "all",
                        threadHistoryScope: "thread",
                        threadInheritParent: false,
                        slashCommand: {
                            enabled: false,
                            name: "openclaw",
                            sessionPrefix: "slack:slash",
                            ephemeral: true,
                        },
                        textLimit: 4000,
                        ackReactionScope: "group-mentions",
                        mediaMaxBytes: 1024,
                        removeAckAfterReply: false,
                    });
                    // oxlint-disable-next-line typescript/no-explicit-any
                    slackCtx.resolveUserName = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ name: "Alice" })];
                    }); }); };
                    account = {
                        accountId: "default",
                        enabled: true,
                        botTokenSource: "config",
                        appTokenSource: "config",
                        config: { replyToMode: "all" },
                    };
                    message = {
                        channel: "D123",
                        channel_type: "im",
                        user: "U1",
                        text: "hi",
                        ts: "1.000",
                    };
                    return [4 /*yield*/, (0, prepare_js_1.prepareSlackMessage)({
                            ctx: slackCtx,
                            account: account,
                            message: message,
                            opts: { source: "message" },
                        })];
                case 1:
                    prepared = _a.sent();
                    (0, vitest_1.expect)(prepared).toBeTruthy();
                    (0, vitest_1.expect)(prepared.ctxPayload.MessageThreadId).toBe("1.000");
                    return [2 /*return*/];
            }
        });
    }); });
});
