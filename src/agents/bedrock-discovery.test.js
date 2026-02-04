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
var sendMock = vitest_1.vi.fn();
var clientFactory = function () { return ({ send: sendMock }); };
(0, vitest_1.describe)("bedrock discovery", function () {
    (0, vitest_1.beforeEach)(function () {
        sendMock.mockReset();
    });
    (0, vitest_1.it)("filters to active streaming text models and maps modalities", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, discoverBedrockModels, resetBedrockDiscoveryCacheForTest, models;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bedrock-discovery.js"); })];
                case 1:
                    _a = _b.sent(), discoverBedrockModels = _a.discoverBedrockModels, resetBedrockDiscoveryCacheForTest = _a.resetBedrockDiscoveryCacheForTest;
                    resetBedrockDiscoveryCacheForTest();
                    sendMock.mockResolvedValueOnce({
                        modelSummaries: [
                            {
                                modelId: "anthropic.claude-3-7-sonnet-20250219-v1:0",
                                modelName: "Claude 3.7 Sonnet",
                                providerName: "anthropic",
                                inputModalities: ["TEXT", "IMAGE"],
                                outputModalities: ["TEXT"],
                                responseStreamingSupported: true,
                                modelLifecycle: { status: "ACTIVE" },
                            },
                            {
                                modelId: "anthropic.claude-3-haiku-20240307-v1:0",
                                modelName: "Claude 3 Haiku",
                                providerName: "anthropic",
                                inputModalities: ["TEXT"],
                                outputModalities: ["TEXT"],
                                responseStreamingSupported: false,
                                modelLifecycle: { status: "ACTIVE" },
                            },
                            {
                                modelId: "meta.llama3-8b-instruct-v1:0",
                                modelName: "Llama 3 8B",
                                providerName: "meta",
                                inputModalities: ["TEXT"],
                                outputModalities: ["TEXT"],
                                responseStreamingSupported: true,
                                modelLifecycle: { status: "INACTIVE" },
                            },
                            {
                                modelId: "amazon.titan-embed-text-v1",
                                modelName: "Titan Embed",
                                providerName: "amazon",
                                inputModalities: ["TEXT"],
                                outputModalities: ["EMBEDDING"],
                                responseStreamingSupported: true,
                                modelLifecycle: { status: "ACTIVE" },
                            },
                        ],
                    });
                    return [4 /*yield*/, discoverBedrockModels({ region: "us-east-1", clientFactory: clientFactory })];
                case 2:
                    models = _b.sent();
                    (0, vitest_1.expect)(models).toHaveLength(1);
                    (0, vitest_1.expect)(models[0]).toMatchObject({
                        id: "anthropic.claude-3-7-sonnet-20250219-v1:0",
                        name: "Claude 3.7 Sonnet",
                        reasoning: false,
                        input: ["text", "image"],
                        contextWindow: 32000,
                        maxTokens: 4096,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("applies provider filter", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, discoverBedrockModels, resetBedrockDiscoveryCacheForTest, models;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bedrock-discovery.js"); })];
                case 1:
                    _a = _b.sent(), discoverBedrockModels = _a.discoverBedrockModels, resetBedrockDiscoveryCacheForTest = _a.resetBedrockDiscoveryCacheForTest;
                    resetBedrockDiscoveryCacheForTest();
                    sendMock.mockResolvedValueOnce({
                        modelSummaries: [
                            {
                                modelId: "anthropic.claude-3-7-sonnet-20250219-v1:0",
                                modelName: "Claude 3.7 Sonnet",
                                providerName: "anthropic",
                                inputModalities: ["TEXT"],
                                outputModalities: ["TEXT"],
                                responseStreamingSupported: true,
                                modelLifecycle: { status: "ACTIVE" },
                            },
                        ],
                    });
                    return [4 /*yield*/, discoverBedrockModels({
                            region: "us-east-1",
                            config: { providerFilter: ["amazon"] },
                            clientFactory: clientFactory,
                        })];
                case 2:
                    models = _b.sent();
                    (0, vitest_1.expect)(models).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses configured defaults for context and max tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, discoverBedrockModels, resetBedrockDiscoveryCacheForTest, models;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bedrock-discovery.js"); })];
                case 1:
                    _a = _b.sent(), discoverBedrockModels = _a.discoverBedrockModels, resetBedrockDiscoveryCacheForTest = _a.resetBedrockDiscoveryCacheForTest;
                    resetBedrockDiscoveryCacheForTest();
                    sendMock.mockResolvedValueOnce({
                        modelSummaries: [
                            {
                                modelId: "anthropic.claude-3-7-sonnet-20250219-v1:0",
                                modelName: "Claude 3.7 Sonnet",
                                providerName: "anthropic",
                                inputModalities: ["TEXT"],
                                outputModalities: ["TEXT"],
                                responseStreamingSupported: true,
                                modelLifecycle: { status: "ACTIVE" },
                            },
                        ],
                    });
                    return [4 /*yield*/, discoverBedrockModels({
                            region: "us-east-1",
                            config: { defaultContextWindow: 64000, defaultMaxTokens: 8192 },
                            clientFactory: clientFactory,
                        })];
                case 2:
                    models = _b.sent();
                    (0, vitest_1.expect)(models[0]).toMatchObject({ contextWindow: 64000, maxTokens: 8192 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("caches results when refreshInterval is enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, discoverBedrockModels, resetBedrockDiscoveryCacheForTest;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bedrock-discovery.js"); })];
                case 1:
                    _a = _b.sent(), discoverBedrockModels = _a.discoverBedrockModels, resetBedrockDiscoveryCacheForTest = _a.resetBedrockDiscoveryCacheForTest;
                    resetBedrockDiscoveryCacheForTest();
                    sendMock.mockResolvedValueOnce({
                        modelSummaries: [
                            {
                                modelId: "anthropic.claude-3-7-sonnet-20250219-v1:0",
                                modelName: "Claude 3.7 Sonnet",
                                providerName: "anthropic",
                                inputModalities: ["TEXT"],
                                outputModalities: ["TEXT"],
                                responseStreamingSupported: true,
                                modelLifecycle: { status: "ACTIVE" },
                            },
                        ],
                    });
                    return [4 /*yield*/, discoverBedrockModels({ region: "us-east-1", clientFactory: clientFactory })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, discoverBedrockModels({ region: "us-east-1", clientFactory: clientFactory })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips cache when refreshInterval is 0", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, discoverBedrockModels, resetBedrockDiscoveryCacheForTest;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./bedrock-discovery.js"); })];
                case 1:
                    _a = _b.sent(), discoverBedrockModels = _a.discoverBedrockModels, resetBedrockDiscoveryCacheForTest = _a.resetBedrockDiscoveryCacheForTest;
                    resetBedrockDiscoveryCacheForTest();
                    sendMock
                        .mockResolvedValueOnce({
                        modelSummaries: [
                            {
                                modelId: "anthropic.claude-3-7-sonnet-20250219-v1:0",
                                modelName: "Claude 3.7 Sonnet",
                                providerName: "anthropic",
                                inputModalities: ["TEXT"],
                                outputModalities: ["TEXT"],
                                responseStreamingSupported: true,
                                modelLifecycle: { status: "ACTIVE" },
                            },
                        ],
                    })
                        .mockResolvedValueOnce({
                        modelSummaries: [
                            {
                                modelId: "anthropic.claude-3-7-sonnet-20250219-v1:0",
                                modelName: "Claude 3.7 Sonnet",
                                providerName: "anthropic",
                                inputModalities: ["TEXT"],
                                outputModalities: ["TEXT"],
                                responseStreamingSupported: true,
                                modelLifecycle: { status: "ACTIVE" },
                            },
                        ],
                    });
                    return [4 /*yield*/, discoverBedrockModels({
                            region: "us-east-1",
                            config: { refreshInterval: 0 },
                            clientFactory: clientFactory,
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, discoverBedrockModels({
                            region: "us-east-1",
                            config: { refreshInterval: 0 },
                            clientFactory: clientFactory,
                        })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(sendMock).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
