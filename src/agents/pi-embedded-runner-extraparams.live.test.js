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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var pi_ai_1 = require("@mariozechner/pi-ai");
var vitest_1 = require("vitest");
var env_js_1 = require("../infra/env.js");
var pi_embedded_runner_js_1 = require("./pi-embedded-runner.js");
var OPENAI_KEY = (_a = process.env.OPENAI_API_KEY) !== null && _a !== void 0 ? _a : "";
var LIVE = (0, env_js_1.isTruthyEnvValue)(process.env.OPENAI_LIVE_TEST) || (0, env_js_1.isTruthyEnvValue)(process.env.LIVE);
var describeLive = LIVE && OPENAI_KEY ? vitest_1.describe : vitest_1.describe.skip;
describeLive("pi embedded extra params (live)", function () {
    (0, vitest_1.it)("applies config maxTokens to openai streamFn", function () { return __awaiter(void 0, void 0, void 0, function () {
        var model, cfg, agent, stream, stopReason, outputTokens, _a, stream_1, stream_1_1, event_1, e_1_1;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    model = (0, pi_ai_1.getModel)("openai", "gpt-5.2");
                    cfg = {
                        agents: {
                            defaults: {
                                models: {
                                    "openai/gpt-5.2": {
                                        // OpenAI Responses enforces a minimum max_output_tokens of 16.
                                        params: {
                                            maxTokens: 16,
                                        },
                                    },
                                },
                            },
                        },
                    };
                    agent = { streamFn: pi_ai_1.streamSimple };
                    (0, pi_embedded_runner_js_1.applyExtraParamsToAgent)(agent, cfg, "openai", model.id);
                    stream = agent.streamFn(model, {
                        messages: [
                            {
                                role: "user",
                                content: "Write the alphabet letters A through Z as words separated by commas.",
                                timestamp: Date.now(),
                            },
                        ],
                    }, { apiKey: OPENAI_KEY });
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 12]);
                    _a = true, stream_1 = __asyncValues(stream);
                    _e.label = 2;
                case 2: return [4 /*yield*/, stream_1.next()];
                case 3:
                    if (!(stream_1_1 = _e.sent(), _b = stream_1_1.done, !_b)) return [3 /*break*/, 5];
                    _d = stream_1_1.value;
                    _a = false;
                    event_1 = _d;
                    if (event_1.type === "done") {
                        stopReason = event_1.reason;
                        outputTokens = event_1.message.usage.output;
                    }
                    _e.label = 4;
                case 4:
                    _a = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _e.trys.push([7, , 10, 11]);
                    if (!(!_a && !_b && (_c = stream_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _c.call(stream_1)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    (0, vitest_1.expect)(stopReason).toBeDefined();
                    (0, vitest_1.expect)(outputTokens).toBeDefined();
                    // Should respect maxTokens from config (16) — allow a small buffer for provider rounding.
                    (0, vitest_1.expect)(outputTokens !== null && outputTokens !== void 0 ? outputTokens : 0).toBeLessThanOrEqual(20);
                    return [2 /*return*/];
            }
        });
    }); }, 30000);
});
