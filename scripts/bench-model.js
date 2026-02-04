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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var pi_ai_1 = require("@mariozechner/pi-ai");
var DEFAULT_PROMPT = "Reply with a single word: ok. No punctuation or extra text.";
var DEFAULT_RUNS = 10;
function parseArg(flag) {
    var idx = process.argv.indexOf(flag);
    if (idx === -1) {
        return undefined;
    }
    return process.argv[idx + 1];
}
function parseRuns(raw) {
    if (!raw) {
        return DEFAULT_RUNS;
    }
    var parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return DEFAULT_RUNS;
    }
    return Math.floor(parsed);
}
function median(values) {
    if (values.length === 0) {
        return 0;
    }
    var sorted = __spreadArray([], values, true).toSorted(function (a, b) { return a - b; });
    var mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }
    return sorted[mid];
}
function runModel(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var results, i, started, res, durationMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < opts.runs)) return [3 /*break*/, 4];
                    started = Date.now();
                    return [4 /*yield*/, (0, pi_ai_1.completeSimple)(opts.model, {
                            messages: [
                                {
                                    role: "user",
                                    content: opts.prompt,
                                    timestamp: Date.now(),
                                },
                            ],
                        }, { apiKey: opts.apiKey, maxTokens: 64 })];
                case 2:
                    res = _a.sent();
                    durationMs = Date.now() - started;
                    results.push({ durationMs: durationMs, usage: res.usage });
                    console.log("".concat(opts.label, " run ").concat(i + 1, "/").concat(opts.runs, ": ").concat(durationMs, "ms"));
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, results];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var runs, prompt, anthropicKey, minimaxKey, minimaxBaseUrl, minimaxModelId, minimaxModel, opusModel, minimaxResults, opusResults, summarize, summary, _i, summary_1, row;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    runs = parseRuns(parseArg("--runs"));
                    prompt = (_a = parseArg("--prompt")) !== null && _a !== void 0 ? _a : DEFAULT_PROMPT;
                    anthropicKey = (_b = process.env.ANTHROPIC_API_KEY) === null || _b === void 0 ? void 0 : _b.trim();
                    minimaxKey = (_c = process.env.MINIMAX_API_KEY) === null || _c === void 0 ? void 0 : _c.trim();
                    if (!anthropicKey) {
                        throw new Error("Missing ANTHROPIC_API_KEY in environment.");
                    }
                    if (!minimaxKey) {
                        throw new Error("Missing MINIMAX_API_KEY in environment.");
                    }
                    minimaxBaseUrl = ((_d = process.env.MINIMAX_BASE_URL) === null || _d === void 0 ? void 0 : _d.trim()) || "https://api.minimax.io/v1";
                    minimaxModelId = ((_e = process.env.MINIMAX_MODEL) === null || _e === void 0 ? void 0 : _e.trim()) || "MiniMax-M2.1";
                    minimaxModel = {
                        id: minimaxModelId,
                        name: "MiniMax ".concat(minimaxModelId),
                        api: "openai-completions",
                        provider: "minimax",
                        baseUrl: minimaxBaseUrl,
                        reasoning: false,
                        input: ["text"],
                        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                        contextWindow: 200000,
                        maxTokens: 8192,
                    };
                    opusModel = (0, pi_ai_1.getModel)("anthropic", "claude-opus-4-5");
                    console.log("Prompt: ".concat(prompt));
                    console.log("Runs: ".concat(runs));
                    console.log("");
                    return [4 /*yield*/, runModel({
                            label: "minimax",
                            model: minimaxModel,
                            apiKey: minimaxKey,
                            runs: runs,
                            prompt: prompt,
                        })];
                case 1:
                    minimaxResults = _f.sent();
                    return [4 /*yield*/, runModel({
                            label: "opus",
                            model: opusModel,
                            apiKey: anthropicKey,
                            runs: runs,
                            prompt: prompt,
                        })];
                case 2:
                    opusResults = _f.sent();
                    summarize = function (label, results) {
                        var durations = results.map(function (r) { return r.durationMs; });
                        var med = median(durations);
                        var min = Math.min.apply(Math, durations);
                        var max = Math.max.apply(Math, durations);
                        return { label: label, med: med, min: min, max: max };
                    };
                    summary = [summarize("minimax", minimaxResults), summarize("opus", opusResults)];
                    console.log("");
                    console.log("Summary (ms):");
                    for (_i = 0, summary_1 = summary; _i < summary_1.length; _i++) {
                        row = summary_1[_i];
                        console.log("".concat(row.label.padEnd(7), " median=").concat(row.med, " min=").concat(row.min, " max=").concat(row.max));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
await main();
