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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
var runEmbeddedPiAgentMock = vitest_1.vi.fn();
vitest_1.vi.mock("../agents/model-fallback.js", function () { return ({
    runWithModelFallback: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c;
        var provider = _b.provider, model = _b.model, run = _b.run;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _c = {};
                    return [4 /*yield*/, run(provider, model)];
                case 1: return [2 /*return*/, (_c.result = _d.sent(),
                        _c.provider = provider,
                        _c.model = model,
                        _c)];
            }
        });
    }); },
}); });
vitest_1.vi.mock("../agents/pi-embedded.js", function () { return ({
    abortEmbeddedPiRun: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: function (params) { return runEmbeddedPiAgentMock(params); },
    queueEmbeddedPiMessage: vitest_1.vi.fn().mockReturnValue(false),
    resolveEmbeddedSessionLane: function (key) { return "session:".concat(key.trim() || "main"); },
    isEmbeddedPiRunActive: vitest_1.vi.fn().mockReturnValue(false),
    isEmbeddedPiRunStreaming: vitest_1.vi.fn().mockReturnValue(false),
}); });
var webMocks = vitest_1.vi.hoisted(function () { return ({
    webAuthExists: vitest_1.vi.fn().mockResolvedValue(true),
    getWebAuthAgeMs: vitest_1.vi.fn().mockReturnValue(120000),
    readWebSelfId: vitest_1.vi.fn().mockReturnValue({ e164: "+1999" }),
}); });
vitest_1.vi.mock("../web/session.js", function () { return webMocks; });
var reply_js_1 = require("./reply.js");
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(function (home) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                runEmbeddedPiAgentMock.mockClear();
                                return [4 /*yield*/, fn(home)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); }, { prefix: "openclaw-typing-" })];
        });
    });
}
function makeCfg(home) {
    return {
        agents: {
            defaults: {
                model: "anthropic/claude-opus-4-5",
                workspace: (0, node_path_1.join)(home, "openclaw"),
            },
        },
        channels: {
            whatsapp: {
                allowFrom: ["*"],
            },
        },
        session: { store: (0, node_path_1.join)(home, "sessions.json") },
    };
}
(0, vitest_1.afterEach)(function () {
    vitest_1.vi.restoreAllMocks();
});
(0, vitest_1.describe)("getReplyFromConfig typing (heartbeat)", function () {
    (0, vitest_1.it)("starts typing for normal runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var onReplyStart;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    runEmbeddedPiAgentMock.mockResolvedValueOnce({
                                        payloads: [{ text: "ok" }],
                                        meta: {},
                                    });
                                    onReplyStart = vitest_1.vi.fn();
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "hi", From: "+1000", To: "+2000", Provider: "whatsapp" }, { onReplyStart: onReplyStart, isHeartbeat: false }, makeCfg(home))];
                                case 1:
                                    _a.sent();
                                    (0, vitest_1.expect)(onReplyStart).toHaveBeenCalled();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not start typing for heartbeat runs", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var onReplyStart;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    runEmbeddedPiAgentMock.mockResolvedValueOnce({
                                        payloads: [{ text: "ok" }],
                                        meta: {},
                                    });
                                    onReplyStart = vitest_1.vi.fn();
                                    return [4 /*yield*/, (0, reply_js_1.getReplyFromConfig)({ Body: "hi", From: "+1000", To: "+2000", Provider: "whatsapp" }, { onReplyStart: onReplyStart, isHeartbeat: true }, makeCfg(home))];
                                case 1:
                                    _a.sent();
                                    (0, vitest_1.expect)(onReplyStart).not.toHaveBeenCalled();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
