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
var channel_js_1 = require("../../../extensions/slack/src/channel.js");
var runtime_js_1 = require("../../plugins/runtime.js");
var channel_plugins_js_1 = require("../../test-utils/channel-plugins.js");
var mocks = vitest_1.vi.hoisted(function () { return ({
    executeSendAction: vitest_1.vi.fn(),
    recordSessionMetaFromInbound: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ ok: true })];
    }); }); }),
}); });
vitest_1.vi.mock("./outbound-send-service.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./outbound-send-service.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { executeSendAction: mocks.executeSendAction })];
        }
    });
}); });
vitest_1.vi.mock("../../config/sessions.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../config/sessions.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { recordSessionMetaFromInbound: mocks.recordSessionMetaFromInbound })];
        }
    });
}); });
var message_action_runner_js_1 = require("./message-action-runner.js");
var slackConfig = {
    channels: {
        slack: {
            botToken: "xoxb-test",
            appToken: "xapp-test",
        },
    },
};
(0, vitest_1.describe)("runMessageAction Slack threading", function () {
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var createPluginRuntime, setSlackRuntime, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../plugins/runtime/index.js"); })];
                case 1:
                    createPluginRuntime = (_a.sent()).createPluginRuntime;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../extensions/slack/src/runtime.js"); })];
                case 2:
                    setSlackRuntime = (_a.sent()).setSlackRuntime;
                    runtime = createPluginRuntime();
                    setSlackRuntime(runtime);
                    (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
                        {
                            pluginId: "slack",
                            source: "test",
                            plugin: channel_js_1.slackPlugin,
                        },
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
        mocks.executeSendAction.mockReset();
        mocks.recordSessionMetaFromInbound.mockReset();
    });
    (0, vitest_1.it)("uses toolContext thread when auto-threading is active", function () { return __awaiter(void 0, void 0, void 0, function () {
        var call;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mocks.executeSendAction.mockResolvedValue({
                        handledBy: "plugin",
                        payload: {},
                    });
                    return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                            cfg: slackConfig,
                            action: "send",
                            params: {
                                channel: "slack",
                                target: "channel:C123",
                                message: "hi",
                            },
                            toolContext: {
                                currentChannelId: "C123",
                                currentThreadTs: "111.222",
                                replyToMode: "all",
                            },
                            agentId: "main",
                        })];
                case 1:
                    _d.sent();
                    call = (_a = mocks.executeSendAction.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_c = (_b = call === null || call === void 0 ? void 0 : call.ctx) === null || _b === void 0 ? void 0 : _b.mirror) === null || _c === void 0 ? void 0 : _c.sessionKey).toBe("agent:main:slack:channel:c123:thread:111.222");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("matches auto-threading when channel ids differ in case", function () { return __awaiter(void 0, void 0, void 0, function () {
        var call;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    mocks.executeSendAction.mockResolvedValue({
                        handledBy: "plugin",
                        payload: {},
                    });
                    return [4 /*yield*/, (0, message_action_runner_js_1.runMessageAction)({
                            cfg: slackConfig,
                            action: "send",
                            params: {
                                channel: "slack",
                                target: "channel:c123",
                                message: "hi",
                            },
                            toolContext: {
                                currentChannelId: "C123",
                                currentThreadTs: "333.444",
                                replyToMode: "all",
                            },
                            agentId: "main",
                        })];
                case 1:
                    _d.sent();
                    call = (_a = mocks.executeSendAction.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
                    (0, vitest_1.expect)((_c = (_b = call === null || call === void 0 ? void 0 : call.ctx) === null || _b === void 0 ? void 0 : _b.mirror) === null || _c === void 0 ? void 0 : _c.sessionKey).toBe("agent:main:slack:channel:c123:thread:333.444");
                    return [2 /*return*/];
            }
        });
    }); });
});
