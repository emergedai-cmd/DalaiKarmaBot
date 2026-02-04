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
var vitest_1 = require("vitest");
var model_scan_js_1 = require("./model-scan.js");
function createFetchFixture(payload) {
    var _this = this;
    return function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Response(JSON.stringify(payload), {
                    status: 200,
                    headers: { "content-type": "application/json" },
                })];
        });
    }); };
}
(0, vitest_1.describe)("scanOpenRouterModels", function () {
    (0, vitest_1.it)("lists free models without probing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchImpl, results, byPricing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchImpl = createFetchFixture({
                        data: [
                            {
                                id: "acme/free-by-pricing",
                                name: "Free By Pricing",
                                context_length: 16384,
                                max_completion_tokens: 1024,
                                supported_parameters: ["tools", "tool_choice", "temperature"],
                                modality: "text",
                                pricing: { prompt: "0", completion: "0", request: "0", image: "0" },
                                created_at: 1700000000,
                            },
                            {
                                id: "acme/free-by-suffix:free",
                                name: "Free By Suffix",
                                context_length: 8192,
                                supported_parameters: [],
                                modality: "text",
                                pricing: { prompt: "0", completion: "0" },
                            },
                            {
                                id: "acme/paid",
                                name: "Paid",
                                context_length: 4096,
                                supported_parameters: ["tools"],
                                modality: "text",
                                pricing: { prompt: "0.000001", completion: "0.000002" },
                            },
                        ],
                    });
                    return [4 /*yield*/, (0, model_scan_js_1.scanOpenRouterModels)({
                            fetchImpl: fetchImpl,
                            probe: false,
                        })];
                case 1:
                    results = _a.sent();
                    (0, vitest_1.expect)(results.map(function (entry) { return entry.id; })).toEqual([
                        "acme/free-by-pricing",
                        "acme/free-by-suffix:free",
                    ]);
                    byPricing = results[0];
                    (0, vitest_1.expect)(byPricing).toBeTruthy();
                    if (!byPricing) {
                        throw new Error("Expected pricing-based model result.");
                    }
                    (0, vitest_1.expect)(byPricing.supportsToolsMeta).toBe(true);
                    (0, vitest_1.expect)(byPricing.supportedParametersCount).toBe(3);
                    (0, vitest_1.expect)(byPricing.isFree).toBe(true);
                    (0, vitest_1.expect)(byPricing.tool.skipped).toBe(true);
                    (0, vitest_1.expect)(byPricing.image.skipped).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("requires an API key when probing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchImpl, previousKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchImpl = createFetchFixture({ data: [] });
                    previousKey = process.env.OPENROUTER_API_KEY;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    delete process.env.OPENROUTER_API_KEY;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, model_scan_js_1.scanOpenRouterModels)({
                            fetchImpl: fetchImpl,
                            probe: true,
                            apiKey: "",
                        })).rejects.toThrow(/Missing OpenRouter API key/)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    if (previousKey === undefined) {
                        delete process.env.OPENROUTER_API_KEY;
                    }
                    else {
                        process.env.OPENROUTER_API_KEY = previousKey;
                    }
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
