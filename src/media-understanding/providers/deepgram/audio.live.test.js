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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var env_js_1 = require("../../../infra/env.js");
var audio_js_1 = require("./audio.js");
var DEEPGRAM_KEY = (_a = process.env.DEEPGRAM_API_KEY) !== null && _a !== void 0 ? _a : "";
var DEEPGRAM_MODEL = ((_b = process.env.DEEPGRAM_MODEL) === null || _b === void 0 ? void 0 : _b.trim()) || "nova-3";
var DEEPGRAM_BASE_URL = (_c = process.env.DEEPGRAM_BASE_URL) === null || _c === void 0 ? void 0 : _c.trim();
var SAMPLE_URL = ((_d = process.env.DEEPGRAM_SAMPLE_URL) === null || _d === void 0 ? void 0 : _d.trim()) ||
    "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav";
var LIVE = (0, env_js_1.isTruthyEnvValue)(process.env.DEEPGRAM_LIVE_TEST) ||
    (0, env_js_1.isTruthyEnvValue)(process.env.LIVE) ||
    (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_LIVE_TEST);
var describeLive = LIVE && DEEPGRAM_KEY ? vitest_1.describe : vitest_1.describe.skip;
function fetchSampleBuffer(url, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var controller, timer, res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    controller = new AbortController();
                    timer = setTimeout(function () { return controller.abort(); }, Math.max(1, timeoutMs));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, fetch(url, { signal: controller.signal })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) {
                        throw new Error("Sample download failed (HTTP ".concat(res.status, ")"));
                    }
                    return [4 /*yield*/, res.arrayBuffer()];
                case 3:
                    data = _a.sent();
                    return [2 /*return*/, Buffer.from(data)];
                case 4:
                    clearTimeout(timer);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
describeLive("deepgram live", function () {
    (0, vitest_1.it)("transcribes sample audio", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buffer, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchSampleBuffer(SAMPLE_URL, 15000)];
                case 1:
                    buffer = _a.sent();
                    return [4 /*yield*/, (0, audio_js_1.transcribeDeepgramAudio)({
                            buffer: buffer,
                            fileName: "sample.wav",
                            mime: "audio/wav",
                            apiKey: DEEPGRAM_KEY,
                            model: DEEPGRAM_MODEL,
                            baseUrl: DEEPGRAM_BASE_URL,
                            timeoutMs: 20000,
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.text.trim().length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); }, 30000);
});
