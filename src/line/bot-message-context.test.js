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
var bot_message_context_js_1 = require("./bot-message-context.js");
(0, vitest_1.describe)("buildLineMessageContext", function () {
    var tmpDir;
    var storePath;
    var cfg;
    var account = {
        accountId: "default",
        enabled: true,
        channelAccessToken: "token",
        channelSecret: "secret",
        tokenSource: "config",
        config: {},
    };
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-line-context-"))];
                case 1:
                    tmpDir = _a.sent();
                    storePath = node_path_1.default.join(tmpDir, "sessions.json");
                    cfg = { session: { store: storePath } };
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.rm(tmpDir, {
                        recursive: true,
                        force: true,
                        maxRetries: 3,
                        retryDelay: 50,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes group message replies to the group id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var event, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event = {
                        type: "message",
                        message: { id: "1", type: "text", text: "hello" },
                        replyToken: "reply-token",
                        timestamp: Date.now(),
                        source: { type: "group", groupId: "group-1", userId: "user-1" },
                        mode: "active",
                        webhookEventId: "evt-1",
                        deliveryContext: { isRedelivery: false },
                    };
                    return [4 /*yield*/, (0, bot_message_context_js_1.buildLineMessageContext)({
                            event: event,
                            allMedia: [],
                            cfg: cfg,
                            account: account,
                        })];
                case 1:
                    context = _a.sent();
                    (0, vitest_1.expect)(context.ctxPayload.OriginatingTo).toBe("line:group:group-1");
                    (0, vitest_1.expect)(context.ctxPayload.To).toBe("line:group:group-1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes group postback replies to the group id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var event, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event = {
                        type: "postback",
                        postback: { data: "action=select" },
                        replyToken: "reply-token",
                        timestamp: Date.now(),
                        source: { type: "group", groupId: "group-2", userId: "user-2" },
                        mode: "active",
                        webhookEventId: "evt-2",
                        deliveryContext: { isRedelivery: false },
                    };
                    return [4 /*yield*/, (0, bot_message_context_js_1.buildLinePostbackContext)({
                            event: event,
                            cfg: cfg,
                            account: account,
                        })];
                case 1:
                    context = _a.sent();
                    (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.ctxPayload.OriginatingTo).toBe("line:group:group-2");
                    (0, vitest_1.expect)(context === null || context === void 0 ? void 0 : context.ctxPayload.To).toBe("line:group:group-2");
                    return [2 /*return*/];
            }
        });
    }); });
});
