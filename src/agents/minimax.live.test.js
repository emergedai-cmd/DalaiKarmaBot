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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var pi_ai_1 = require("@mariozechner/pi-ai");
var vitest_1 = require("vitest");
var env_js_1 = require("../infra/env.js");
var MINIMAX_KEY = (_a = process.env.MINIMAX_API_KEY) !== null && _a !== void 0 ? _a : "";
var MINIMAX_BASE_URL = ((_b = process.env.MINIMAX_BASE_URL) === null || _b === void 0 ? void 0 : _b.trim()) || "https://api.minimax.io/anthropic";
var MINIMAX_MODEL = ((_c = process.env.MINIMAX_MODEL) === null || _c === void 0 ? void 0 : _c.trim()) || "MiniMax-M2.1";
var LIVE = (0, env_js_1.isTruthyEnvValue)(process.env.MINIMAX_LIVE_TEST) || (0, env_js_1.isTruthyEnvValue)(process.env.LIVE);
var describeLive = LIVE && MINIMAX_KEY ? vitest_1.describe : vitest_1.describe.skip;
describeLive("minimax live", function () {
    (0, vitest_1.it)("returns assistant text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var model, res, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = {
                        id: MINIMAX_MODEL,
                        name: "MiniMax ".concat(MINIMAX_MODEL),
                        api: "anthropic-messages",
                        provider: "minimax",
                        baseUrl: MINIMAX_BASE_URL,
                        reasoning: false,
                        input: ["text"],
                        // Pricing: placeholder values (per 1M tokens, multiplied by 1000 for display)
                        cost: { input: 15, output: 60, cacheRead: 2, cacheWrite: 10 },
                        contextWindow: 200000,
                        maxTokens: 8192,
                    };
                    return [4 /*yield*/, (0, pi_ai_1.completeSimple)(model, {
                            messages: [
                                {
                                    role: "user",
                                    content: "Reply with the word ok.",
                                    timestamp: Date.now(),
                                },
                            ],
                        }, { apiKey: MINIMAX_KEY, maxTokens: 64 })];
                case 1:
                    res = _a.sent();
                    text = res.content
                        .filter(function (block) { return block.type === "text"; })
                        .map(function (block) { return block.text.trim(); })
                        .join(" ");
                    (0, vitest_1.expect)(text.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
});
