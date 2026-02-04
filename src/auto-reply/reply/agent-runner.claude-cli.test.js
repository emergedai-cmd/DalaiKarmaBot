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
var node_crypto_1 = require("node:crypto");
var vitest_1 = require("vitest");
var agent_events_js_1 = require("../../infra/agent-events.js");
var test_helpers_js_1 = require("./test-helpers.js");
var runEmbeddedPiAgentMock = vitest_1.vi.fn();
var runCliAgentMock = vitest_1.vi.fn();
vitest_1.vi.mock("../../agents/model-fallback.js", function () { return ({
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
vitest_1.vi.mock("../../agents/pi-embedded.js", function () { return ({
    queueEmbeddedPiMessage: vitest_1.vi.fn().mockReturnValue(false),
    runEmbeddedPiAgent: function (params) { return runEmbeddedPiAgentMock(params); },
}); });
vitest_1.vi.mock("../../agents/cli-runner.js", function () { return ({
    runCliAgent: function (params) { return runCliAgentMock(params); },
}); });
vitest_1.vi.mock("./queue.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("./queue.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { enqueueFollowupRun: vitest_1.vi.fn(), scheduleFollowupDrain: vitest_1.vi.fn() })];
        }
    });
}); });
var agent_runner_js_1 = require("./agent-runner.js");
function createRun() {
    var typing = (0, test_helpers_js_1.createMockTypingController)();
    var sessionCtx = {
        Provider: "webchat",
        OriginatingTo: "session:1",
        AccountId: "primary",
        MessageSid: "msg",
    };
    var resolvedQueue = { mode: "interrupt" };
    var followupRun = {
        prompt: "hello",
        summaryLine: "hello",
        enqueuedAt: Date.now(),
        run: {
            sessionId: "session",
            sessionKey: "main",
            messageProvider: "webchat",
            sessionFile: "/tmp/session.jsonl",
            workspaceDir: "/tmp",
            config: {},
            skillsSnapshot: {},
            provider: "claude-cli",
            model: "opus-4.5",
            thinkLevel: "low",
            verboseLevel: "off",
            elevatedLevel: "off",
            bashElevated: {
                enabled: false,
                allowed: false,
                defaultLevel: "off",
            },
            timeoutMs: 1000,
            blockReplyBreak: "message_end",
        },
    };
    return (0, agent_runner_js_1.runReplyAgent)({
        commandBody: "hello",
        followupRun: followupRun,
        queueKey: "main",
        resolvedQueue: resolvedQueue,
        shouldSteer: false,
        shouldFollowup: false,
        isActive: false,
        isStreaming: false,
        typing: typing,
        sessionCtx: sessionCtx,
        defaultModel: "claude-cli/opus-4.5",
        resolvedVerboseLevel: "off",
        isNewSession: false,
        blockStreamingEnabled: false,
        resolvedBlockStreamingBreak: "message_end",
        shouldInjectGroupIntro: false,
        typingMode: "instant",
    });
}
(0, vitest_1.describe)("runReplyAgent claude-cli routing", function () {
    (0, vitest_1.it)("uses claude-cli runner for claude-cli provider", function () { return __awaiter(void 0, void 0, void 0, function () {
        var randomSpy, lifecyclePhases, unsubscribe, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    randomSpy = vitest_1.vi.spyOn(node_crypto_1.default, "randomUUID").mockReturnValue("run-1");
                    lifecyclePhases = [];
                    unsubscribe = (0, agent_events_js_1.onAgentEvent)(function (evt) {
                        var _a;
                        if (evt.runId !== "run-1") {
                            return;
                        }
                        if (evt.stream !== "lifecycle") {
                            return;
                        }
                        var phase = (_a = evt.data) === null || _a === void 0 ? void 0 : _a.phase;
                        if (typeof phase === "string") {
                            lifecyclePhases.push(phase);
                        }
                    });
                    runCliAgentMock.mockResolvedValueOnce({
                        payloads: [{ text: "ok" }],
                        meta: {
                            agentMeta: {
                                provider: "claude-cli",
                                model: "opus-4.5",
                            },
                        },
                    });
                    return [4 /*yield*/, createRun()];
                case 1:
                    result = _a.sent();
                    unsubscribe();
                    randomSpy.mockRestore();
                    (0, vitest_1.expect)(runCliAgentMock).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(runEmbeddedPiAgentMock).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(lifecyclePhases).toEqual(["start", "end"]);
                    (0, vitest_1.expect)(result).toMatchObject({ text: "ok" });
                    return [2 /*return*/];
            }
        });
    }); });
});
