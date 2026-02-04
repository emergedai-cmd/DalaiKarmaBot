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
var vitest_1 = require("vitest");
var inbound_contract_js_1 = require("../../../test/helpers/inbound-contract.js");
var capturedCtx;
vitest_1.vi.mock("../../auto-reply/dispatch.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual, dispatchInboundMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                dispatchInboundMessage = vitest_1.vi.fn(function (params) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        capturedCtx = params.ctx;
                        return [2 /*return*/, { queuedFinal: false, counts: { tool: 0, block: 0, final: 0 } }];
                    });
                }); });
                return [2 /*return*/, __assign(__assign({}, actual), { dispatchInboundMessage: dispatchInboundMessage, dispatchInboundMessageWithDispatcher: dispatchInboundMessage, dispatchInboundMessageWithBufferedDispatcher: dispatchInboundMessage })];
        }
    });
}); });
var event_handler_js_1 = require("./event-handler.js");
(0, vitest_1.describe)("signal createSignalEventHandler inbound contract", function () {
    (0, vitest_1.it)("passes a finalized MsgContext to dispatchInboundMessage", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handler;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    capturedCtx = undefined;
                    handler = (0, event_handler_js_1.createSignalEventHandler)({
                        // oxlint-disable-next-line typescript/no-explicit-any
                        runtime: { log: function () { }, error: function () { } },
                        // oxlint-disable-next-line typescript/no-explicit-any
                        cfg: { messages: { inbound: { debounceMs: 0 } } },
                        baseUrl: "http://localhost",
                        accountId: "default",
                        historyLimit: 0,
                        groupHistories: new Map(),
                        textLimit: 4000,
                        dmPolicy: "open",
                        allowFrom: ["*"],
                        groupAllowFrom: ["*"],
                        groupPolicy: "open",
                        reactionMode: "off",
                        reactionAllowlist: [],
                        mediaMaxBytes: 1024,
                        ignoreAttachments: true,
                        sendReadReceipts: false,
                        readReceiptsViaDaemon: false,
                        fetchAttachment: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, null];
                        }); }); },
                        deliverReplies: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); },
                        resolveSignalReactionTargets: function () { return []; },
                        // oxlint-disable-next-line typescript/no-explicit-any
                        isSignalReactionMessage: function () { return false; },
                        shouldEmitSignalReactionNotification: function () { return false; },
                        buildSignalReactionSystemEventText: function () { return "reaction"; },
                    });
                    return [4 /*yield*/, handler({
                            event: "receive",
                            data: JSON.stringify({
                                envelope: {
                                    sourceNumber: "+15550001111",
                                    sourceName: "Alice",
                                    timestamp: 1700000000000,
                                    dataMessage: {
                                        message: "hi",
                                        attachments: [],
                                        groupInfo: { groupId: "g1", groupName: "Test Group" },
                                    },
                                },
                            }),
                        })];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(capturedCtx).toBeTruthy();
                    (0, inbound_contract_js_1.expectInboundContextContract)(capturedCtx);
                    // Sender should appear as prefix in group messages (no redundant [from:] suffix)
                    (0, vitest_1.expect)(String((_a = capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.Body) !== null && _a !== void 0 ? _a : "")).toContain("Alice");
                    (0, vitest_1.expect)(String((_b = capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.Body) !== null && _b !== void 0 ? _b : "")).toMatch(/Alice.*:/);
                    (0, vitest_1.expect)(String((_c = capturedCtx === null || capturedCtx === void 0 ? void 0 : capturedCtx.Body) !== null && _c !== void 0 ? _c : "")).not.toContain("[from:");
                    return [2 /*return*/];
            }
        });
    }); });
});
