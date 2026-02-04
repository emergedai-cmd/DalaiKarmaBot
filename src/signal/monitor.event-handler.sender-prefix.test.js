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
var dispatchMock = vitest_1.vi.fn();
var readAllowFromMock = vitest_1.vi.fn();
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    readChannelAllowFromStore: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return readAllowFromMock.apply(void 0, args);
    },
    upsertChannelPairingRequest: vitest_1.vi.fn(),
}); });
(0, vitest_1.describe)("signal event handler sender prefix", function () {
    (0, vitest_1.beforeEach)(function () {
        dispatchMock.mockReset().mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var dispatcher = _b.dispatcher, ctx = _b.ctx;
            return __generator(this, function (_c) {
                dispatcher.sendFinalReply({ text: "ok" });
                return [2 /*return*/, { queuedFinal: true, counts: { tool: 0, block: 0, final: 1 }, ctx: ctx }];
            });
        }); });
        readAllowFromMock.mockReset().mockResolvedValue([]);
    });
    (0, vitest_1.it)("prefixes group bodies with sender label", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedBody, dispatchModule, createSignalEventHandler, handler, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    capturedBody = "";
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../auto-reply/dispatch.js"); })];
                case 1:
                    dispatchModule = _a.sent();
                    vitest_1.vi.spyOn(dispatchModule, "dispatchInboundMessage").mockImplementation(function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, dispatchMock.apply(void 0, args)];
                        }); });
                    });
                    dispatchMock.mockImplementationOnce(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var _c;
                        var dispatcher = _b.dispatcher, ctx = _b.ctx;
                        return __generator(this, function (_d) {
                            capturedBody = (_c = ctx.Body) !== null && _c !== void 0 ? _c : "";
                            dispatcher.sendFinalReply({ text: "ok" });
                            return [2 /*return*/, { queuedFinal: true, counts: { tool: 0, block: 0, final: 1 } }];
                        });
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor/event-handler.js"); })];
                case 2:
                    createSignalEventHandler = (_a.sent()).createSignalEventHandler;
                    handler = createSignalEventHandler({
                        runtime: {
                            log: vitest_1.vi.fn(),
                            error: vitest_1.vi.fn(),
                            exit: function (code) {
                                throw new Error("exit ".concat(code));
                            },
                        },
                        cfg: {
                            agents: { defaults: { model: "anthropic/claude-opus-4-5", workspace: "/tmp/openclaw" } },
                            channels: { signal: {} },
                        },
                        baseUrl: "http://localhost",
                        account: "+15550009999",
                        accountId: "default",
                        blockStreaming: false,
                        historyLimit: 0,
                        groupHistories: new Map(),
                        textLimit: 4000,
                        dmPolicy: "open",
                        allowFrom: [],
                        groupAllowFrom: [],
                        groupPolicy: "open",
                        reactionMode: "off",
                        reactionAllowlist: [],
                        mediaMaxBytes: 1000,
                        ignoreAttachments: true,
                        sendReadReceipts: false,
                        readReceiptsViaDaemon: false,
                        fetchAttachment: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, null];
                        }); }); },
                        deliverReplies: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); },
                        resolveSignalReactionTargets: function () { return []; },
                        isSignalReactionMessage: function () { return false; },
                        shouldEmitSignalReactionNotification: function () { return false; },
                        buildSignalReactionSystemEventText: function () { return ""; },
                    });
                    payload = {
                        envelope: {
                            sourceNumber: "+15550002222",
                            sourceName: "Alice",
                            timestamp: 1700000000000,
                            dataMessage: {
                                message: "hello",
                                groupInfo: { groupId: "group-1", groupName: "Test Group" },
                            },
                        },
                    };
                    return [4 /*yield*/, handler({ event: "receive", data: JSON.stringify(payload) })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(dispatchMock).toHaveBeenCalled();
                    (0, vitest_1.expect)(capturedBody).toContain("Alice (+15550002222): hello");
                    return [2 /*return*/];
            }
        });
    }); });
});
