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
var monitor_js_1 = require("./monitor.js");
// Fake bot to capture handler and API calls
var handlers = {};
var api = {
    sendMessage: vitest_1.vi.fn(),
    sendPhoto: vitest_1.vi.fn(),
    sendVideo: vitest_1.vi.fn(),
    sendAudio: vitest_1.vi.fn(),
    sendDocument: vitest_1.vi.fn(),
    setWebhook: vitest_1.vi.fn(),
    deleteWebhook: vitest_1.vi.fn(),
};
var _a = vitest_1.vi.hoisted(function () { return ({
    initSpy: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, undefined];
    }); }); }),
    runSpy: vitest_1.vi.fn(function () { return ({
        task: function () { return Promise.resolve(); },
        stop: vitest_1.vi.fn(),
    }); }),
    loadConfig: vitest_1.vi.fn(function () { return ({
        agents: { defaults: { maxConcurrent: 2 } },
        channels: { telegram: {} },
    }); }),
}); }), initSpy = _a.initSpy, runSpy = _a.runSpy, loadConfig = _a.loadConfig;
var _b = vitest_1.vi.hoisted(function () { return ({
    computeBackoff: vitest_1.vi.fn(function () { return 0; }),
    sleepWithAbort: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, undefined];
    }); }); }),
}); }), computeBackoff = _b.computeBackoff, sleepWithAbort = _b.sleepWithAbort;
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: loadConfig })];
        }
    });
}); });
vitest_1.vi.mock("./bot.js", function () { return ({
    createTelegramBot: function () {
        handlers.message = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var chatId, isGroup, text;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        chatId = ctx.message.chat.id;
                        isGroup = ctx.message.chat.type !== "private";
                        text = (_b = (_a = ctx.message.text) !== null && _a !== void 0 ? _a : ctx.message.caption) !== null && _b !== void 0 ? _b : "";
                        if (isGroup && !text.includes("@mybot")) {
                            return [2 /*return*/];
                        }
                        if (!text.trim()) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, api.sendMessage(chatId, "echo:".concat(text), { parse_mode: "HTML" })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        return {
            on: vitest_1.vi.fn(),
            api: api,
            me: { username: "mybot" },
            init: initSpy,
            stop: vitest_1.vi.fn(),
            start: vitest_1.vi.fn(),
        };
    },
    createTelegramWebhookCallback: vitest_1.vi.fn(),
}); });
// Mock the grammyjs/runner to resolve immediately
vitest_1.vi.mock("@grammyjs/runner", function () { return ({
    run: runSpy,
}); });
vitest_1.vi.mock("../infra/backoff.js", function () { return ({
    computeBackoff: computeBackoff,
    sleepWithAbort: sleepWithAbort,
}); });
vitest_1.vi.mock("../auto-reply/reply.js", function () { return ({
    getReplyFromConfig: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    text: "echo:".concat(ctx.Body),
                })];
        });
    }); },
}); });
(0, vitest_1.describe)("monitorTelegramProvider (grammY)", function () {
    (0, vitest_1.beforeEach)(function () {
        loadConfig.mockReturnValue({
            agents: { defaults: { maxConcurrent: 2 } },
            channels: { telegram: {} },
        });
        initSpy.mockClear();
        runSpy.mockClear();
        computeBackoff.mockClear();
        sleepWithAbort.mockClear();
    });
    (0, vitest_1.it)("processes a DM and sends reply", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    Object.values(api).forEach(function (fn) {
                        var _a;
                        (_a = fn === null || fn === void 0 ? void 0 : fn.mockReset) === null || _a === void 0 ? void 0 : _a.call(fn);
                    });
                    return [4 /*yield*/, (0, monitor_js_1.monitorTelegramProvider)({ token: "tok" })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(handlers.message).toBeDefined();
                    return [4 /*yield*/, ((_a = handlers.message) === null || _a === void 0 ? void 0 : _a.call(handlers, {
                            message: {
                                message_id: 1,
                                chat: { id: 123, type: "private" },
                                text: "hi",
                            },
                            me: { username: "mybot" },
                            getFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); }),
                        }))];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(api.sendMessage).toHaveBeenCalledWith(123, "echo:hi", {
                        parse_mode: "HTML",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses agent maxConcurrent for runner concurrency", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runSpy.mockClear();
                    loadConfig.mockReturnValue({
                        agents: { defaults: { maxConcurrent: 3 } },
                        channels: { telegram: {} },
                    });
                    return [4 /*yield*/, (0, monitor_js_1.monitorTelegramProvider)({ token: "tok" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runSpy).toHaveBeenCalledWith(vitest_1.expect.anything(), vitest_1.expect.objectContaining({
                        sink: { concurrency: 3 },
                        runner: vitest_1.expect.objectContaining({
                            silent: true,
                            maxRetryTime: 5 * 60 * 1000,
                            retryInterval: "exponential",
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires mention in groups by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    Object.values(api).forEach(function (fn) {
                        var _a;
                        (_a = fn === null || fn === void 0 ? void 0 : fn.mockReset) === null || _a === void 0 ? void 0 : _a.call(fn);
                    });
                    return [4 /*yield*/, (0, monitor_js_1.monitorTelegramProvider)({ token: "tok" })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, ((_a = handlers.message) === null || _a === void 0 ? void 0 : _a.call(handlers, {
                            message: {
                                message_id: 2,
                                chat: { id: -99, type: "supergroup", title: "G" },
                                text: "hello all",
                            },
                            me: { username: "mybot" },
                            getFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({})];
                            }); }); }),
                        }))];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(api.sendMessage).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("retries on recoverable network errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var networkError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    networkError = Object.assign(new Error("timeout"), { code: "ETIMEDOUT" });
                    runSpy
                        .mockImplementationOnce(function () { return ({
                        task: function () { return Promise.reject(networkError); },
                        stop: vitest_1.vi.fn(),
                    }); })
                        .mockImplementationOnce(function () { return ({
                        task: function () { return Promise.resolve(); },
                        stop: vitest_1.vi.fn(),
                    }); });
                    return [4 /*yield*/, (0, monitor_js_1.monitorTelegramProvider)({ token: "tok" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(computeBackoff).toHaveBeenCalled();
                    (0, vitest_1.expect)(sleepWithAbort).toHaveBeenCalled();
                    (0, vitest_1.expect)(runSpy).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("surfaces non-recoverable errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runSpy.mockImplementationOnce(function () { return ({
                        task: function () { return Promise.reject(new Error("bad token")); },
                        stop: vitest_1.vi.fn(),
                    }); });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, monitor_js_1.monitorTelegramProvider)({ token: "tok" })).rejects.toThrow("bad token")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
