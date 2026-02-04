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
var embeddings_gemini_js_1 = require("./embeddings-gemini.js");
vitest_1.vi.mock("../agents/model-auth.js", function () { return ({
    resolveApiKeyForProvider: vitest_1.vi.fn(),
    requireApiKey: function (auth, provider) {
        if (auth === null || auth === void 0 ? void 0 : auth.apiKey) {
            return auth.apiKey;
        }
        throw new Error("No API key resolved for provider \"".concat(provider, "\" (auth mode: ").concat(auth === null || auth === void 0 ? void 0 : auth.mode, ")."));
    },
}); });
var createFetchMock = function () {
    return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    ok: true,
                    status: 200,
                    json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ data: [{ embedding: [1, 2, 3] }] })];
                    }); }); },
                })];
        });
    }); });
};
(0, vitest_1.describe)("embedding provider remote overrides", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.resetAllMocks();
        vitest_1.vi.resetModules();
        vitest_1.vi.unstubAllGlobals();
    });
    (0, vitest_1.it)("uses remote baseUrl/apiKey and merges headers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, createEmbeddingProvider, authModule, cfg, result, _a, url, init, headers;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    fetchMock = createFetchMock();
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_d.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../agents/model-auth.js"); })];
                case 2:
                    authModule = _d.sent();
                    vitest_1.vi.mocked(authModule.resolveApiKeyForProvider).mockResolvedValue({
                        apiKey: "provider-key",
                        mode: "api-key",
                        source: "test",
                    });
                    cfg = {
                        models: {
                            providers: {
                                openai: {
                                    baseUrl: "https://provider.example/v1",
                                    headers: {
                                        "X-Provider": "p",
                                        "X-Shared": "provider",
                                    },
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: cfg,
                            provider: "openai",
                            remote: {
                                baseUrl: "https://remote.example/v1",
                                apiKey: "  remote-key  ",
                                headers: {
                                    "X-Shared": "remote",
                                    "X-Remote": "r",
                                },
                            },
                            model: "text-embedding-3-small",
                            fallback: "openai",
                        })];
                case 3:
                    result = _d.sent();
                    return [4 /*yield*/, result.provider.embedQuery("hello")];
                case 4:
                    _d.sent();
                    (0, vitest_1.expect)(authModule.resolveApiKeyForProvider).not.toHaveBeenCalled();
                    _a = (_b = fetchMock.mock.calls[0]) !== null && _b !== void 0 ? _b : [], url = _a[0], init = _a[1];
                    (0, vitest_1.expect)(url).toBe("https://remote.example/v1/embeddings");
                    headers = ((_c = init === null || init === void 0 ? void 0 : init.headers) !== null && _c !== void 0 ? _c : {});
                    (0, vitest_1.expect)(headers.Authorization).toBe("Bearer remote-key");
                    (0, vitest_1.expect)(headers["Content-Type"]).toBe("application/json");
                    (0, vitest_1.expect)(headers["X-Provider"]).toBe("p");
                    (0, vitest_1.expect)(headers["X-Shared"]).toBe("remote");
                    (0, vitest_1.expect)(headers["X-Remote"]).toBe("r");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to resolved api key when remote apiKey is blank", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, createEmbeddingProvider, authModule, cfg, result, headers;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    fetchMock = createFetchMock();
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_d.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../agents/model-auth.js"); })];
                case 2:
                    authModule = _d.sent();
                    vitest_1.vi.mocked(authModule.resolveApiKeyForProvider).mockResolvedValue({
                        apiKey: "provider-key",
                        mode: "api-key",
                        source: "test",
                    });
                    cfg = {
                        models: {
                            providers: {
                                openai: {
                                    baseUrl: "https://provider.example/v1",
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: cfg,
                            provider: "openai",
                            remote: {
                                baseUrl: "https://remote.example/v1",
                                apiKey: "   ",
                            },
                            model: "text-embedding-3-small",
                            fallback: "openai",
                        })];
                case 3:
                    result = _d.sent();
                    return [4 /*yield*/, result.provider.embedQuery("hello")];
                case 4:
                    _d.sent();
                    (0, vitest_1.expect)(authModule.resolveApiKeyForProvider).toHaveBeenCalledTimes(1);
                    headers = (_c = (_b = (_a = fetchMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.headers) !== null && _c !== void 0 ? _c : {};
                    (0, vitest_1.expect)(headers.Authorization).toBe("Bearer provider-key");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("builds Gemini embeddings requests with api key header", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, createEmbeddingProvider, authModule, cfg, result, _a, url, init, headers;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    ok: true,
                                    status: 200,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, ({ embedding: { values: [1, 2, 3] } })];
                                    }); }); },
                                })];
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_d.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../agents/model-auth.js"); })];
                case 2:
                    authModule = _d.sent();
                    vitest_1.vi.mocked(authModule.resolveApiKeyForProvider).mockResolvedValue({
                        apiKey: "provider-key",
                        mode: "api-key",
                        source: "test",
                    });
                    cfg = {
                        models: {
                            providers: {
                                google: {
                                    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: cfg,
                            provider: "gemini",
                            remote: {
                                apiKey: "gemini-key",
                            },
                            model: "text-embedding-004",
                            fallback: "openai",
                        })];
                case 3:
                    result = _d.sent();
                    return [4 /*yield*/, result.provider.embedQuery("hello")];
                case 4:
                    _d.sent();
                    _a = (_b = fetchMock.mock.calls[0]) !== null && _b !== void 0 ? _b : [], url = _a[0], init = _a[1];
                    (0, vitest_1.expect)(url).toBe("https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent");
                    headers = ((_c = init === null || init === void 0 ? void 0 : init.headers) !== null && _c !== void 0 ? _c : {});
                    (0, vitest_1.expect)(headers["x-goog-api-key"]).toBe("gemini-key");
                    (0, vitest_1.expect)(headers["Content-Type"]).toBe("application/json");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("embedding provider auto selection", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.resetAllMocks();
        vitest_1.vi.resetModules();
        vitest_1.vi.unstubAllGlobals();
    });
    (0, vitest_1.it)("prefers openai when a key resolves", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createEmbeddingProvider, authModule, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_a.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../agents/model-auth.js"); })];
                case 2:
                    authModule = _a.sent();
                    vitest_1.vi.mocked(authModule.resolveApiKeyForProvider).mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var provider = _b.provider;
                        return __generator(this, function (_c) {
                            if (provider === "openai") {
                                return [2 /*return*/, { apiKey: "openai-key", source: "env: OPENAI_API_KEY", mode: "api-key" }];
                            }
                            throw new Error("No API key found for provider \"".concat(provider, "\"."));
                        });
                    }); });
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: {},
                            provider: "auto",
                            model: "",
                            fallback: "none",
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.requestedProvider).toBe("auto");
                    (0, vitest_1.expect)(result.provider.id).toBe("openai");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses gemini when openai is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, createEmbeddingProvider, authModule, result, url;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    ok: true,
                                    status: 200,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, ({ embedding: { values: [1, 2, 3] } })];
                                    }); }); },
                                })];
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_b.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../agents/model-auth.js"); })];
                case 2:
                    authModule = _b.sent();
                    vitest_1.vi.mocked(authModule.resolveApiKeyForProvider).mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var provider = _b.provider;
                        return __generator(this, function (_c) {
                            if (provider === "openai") {
                                throw new Error('No API key found for provider "openai".');
                            }
                            if (provider === "google") {
                                return [2 /*return*/, { apiKey: "gemini-key", source: "env: GEMINI_API_KEY", mode: "api-key" }];
                            }
                            throw new Error("Unexpected provider ".concat(provider));
                        });
                    }); });
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: {},
                            provider: "auto",
                            model: "",
                            fallback: "none",
                        })];
                case 3:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.requestedProvider).toBe("auto");
                    (0, vitest_1.expect)(result.provider.id).toBe("gemini");
                    return [4 /*yield*/, result.provider.embedQuery("hello")];
                case 4:
                    _b.sent();
                    url = ((_a = fetchMock.mock.calls[0]) !== null && _a !== void 0 ? _a : [])[0];
                    (0, vitest_1.expect)(url).toBe("https://generativelanguage.googleapis.com/v1beta/models/".concat(embeddings_gemini_js_1.DEFAULT_GEMINI_EMBEDDING_MODEL, ":embedContent"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps explicit model when openai is selected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, createEmbeddingProvider, authModule, result, _a, url, init, payload;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    fetchMock = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    ok: true,
                                    status: 200,
                                    json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, ({ data: [{ embedding: [1, 2, 3] }] })];
                                    }); }); },
                                })];
                        });
                    }); });
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_d.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../agents/model-auth.js"); })];
                case 2:
                    authModule = _d.sent();
                    vitest_1.vi.mocked(authModule.resolveApiKeyForProvider).mockImplementation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var provider = _b.provider;
                        return __generator(this, function (_c) {
                            if (provider === "openai") {
                                return [2 /*return*/, { apiKey: "openai-key", source: "env: OPENAI_API_KEY", mode: "api-key" }];
                            }
                            throw new Error("Unexpected provider ".concat(provider));
                        });
                    }); });
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: {},
                            provider: "auto",
                            model: "text-embedding-3-small",
                            fallback: "none",
                        })];
                case 3:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.requestedProvider).toBe("auto");
                    (0, vitest_1.expect)(result.provider.id).toBe("openai");
                    return [4 /*yield*/, result.provider.embedQuery("hello")];
                case 4:
                    _d.sent();
                    _a = (_b = fetchMock.mock.calls[0]) !== null && _b !== void 0 ? _b : [], url = _a[0], init = _a[1];
                    (0, vitest_1.expect)(url).toBe("https://api.openai.com/v1/embeddings");
                    payload = JSON.parse(String((_c = init === null || init === void 0 ? void 0 : init.body) !== null && _c !== void 0 ? _c : "{}"));
                    (0, vitest_1.expect)(payload.model).toBe("text-embedding-3-small");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("embedding provider local fallback", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.resetAllMocks();
        vitest_1.vi.resetModules();
        vitest_1.vi.unstubAllGlobals();
        vitest_1.vi.doUnmock("./node-llama.js");
    });
    (0, vitest_1.it)("falls back to openai when node-llama-cpp is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, createEmbeddingProvider, authModule, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.doMock("./node-llama.js", function () { return ({
                        importNodeLlamaCpp: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                throw Object.assign(new Error("Cannot find package 'node-llama-cpp'"), {
                                    code: "ERR_MODULE_NOT_FOUND",
                                });
                            });
                        }); },
                    }); });
                    fetchMock = createFetchMock();
                    vitest_1.vi.stubGlobal("fetch", fetchMock);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_a.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../agents/model-auth.js"); })];
                case 2:
                    authModule = _a.sent();
                    vitest_1.vi.mocked(authModule.resolveApiKeyForProvider).mockResolvedValue({
                        apiKey: "provider-key",
                        mode: "api-key",
                        source: "test",
                    });
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: {},
                            provider: "local",
                            model: "text-embedding-3-small",
                            fallback: "openai",
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.provider.id).toBe("openai");
                    (0, vitest_1.expect)(result.fallbackFrom).toBe("local");
                    (0, vitest_1.expect)(result.fallbackReason).toContain("node-llama-cpp");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws a helpful error when local is requested and fallback is none", function () { return __awaiter(void 0, void 0, void 0, function () {
        var createEmbeddingProvider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.doMock("./node-llama.js", function () { return ({
                        importNodeLlamaCpp: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                throw Object.assign(new Error("Cannot find package 'node-llama-cpp'"), {
                                    code: "ERR_MODULE_NOT_FOUND",
                                });
                            });
                        }); },
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_a.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, (0, vitest_1.expect)(createEmbeddingProvider({
                            config: {},
                            provider: "local",
                            model: "text-embedding-3-small",
                            fallback: "none",
                        })).rejects.toThrow(/optional dependency node-llama-cpp/i)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("local embedding normalization", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.resetAllMocks();
        vitest_1.vi.resetModules();
        vitest_1.vi.unstubAllGlobals();
        vitest_1.vi.doUnmock("./node-llama.js");
    });
    (0, vitest_1.it)("normalizes local embeddings to magnitude ~1.0", function () { return __awaiter(void 0, void 0, void 0, function () {
        var unnormalizedVector, createEmbeddingProvider, result, embedding, magnitude;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    unnormalizedVector = [2.35, 3.45, 0.63, 4.3, 1.2, 5.1, 2.8, 3.9];
                    vitest_1.vi.doMock("./node-llama.js", function () { return ({
                        importNodeLlamaCpp: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        getLlama: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        loadModel: vitest_1.vi.fn().mockResolvedValue({
                                                            createEmbeddingContext: vitest_1.vi.fn().mockResolvedValue({
                                                                getEmbeddingFor: vitest_1.vi.fn().mockResolvedValue({
                                                                    vector: new Float32Array(unnormalizedVector),
                                                                }),
                                                            }),
                                                        }),
                                                    })];
                                            });
                                        }); },
                                        resolveModelFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, "/fake/model.gguf"];
                                        }); }); },
                                        LlamaLogLevel: { error: 0 },
                                    })];
                            });
                        }); },
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_a.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: {},
                            provider: "local",
                            model: "",
                            fallback: "none",
                        })];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, result.provider.embedQuery("test query")];
                case 3:
                    embedding = _a.sent();
                    magnitude = Math.sqrt(embedding.reduce(function (sum, x) { return sum + x * x; }, 0));
                    (0, vitest_1.expect)(magnitude).toBeCloseTo(1.0, 5);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles zero vector without division by zero", function () { return __awaiter(void 0, void 0, void 0, function () {
        var zeroVector, createEmbeddingProvider, result, embedding;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zeroVector = [0, 0, 0, 0];
                    vitest_1.vi.doMock("./node-llama.js", function () { return ({
                        importNodeLlamaCpp: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        getLlama: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        loadModel: vitest_1.vi.fn().mockResolvedValue({
                                                            createEmbeddingContext: vitest_1.vi.fn().mockResolvedValue({
                                                                getEmbeddingFor: vitest_1.vi.fn().mockResolvedValue({
                                                                    vector: new Float32Array(zeroVector),
                                                                }),
                                                            }),
                                                        }),
                                                    })];
                                            });
                                        }); },
                                        resolveModelFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, "/fake/model.gguf"];
                                        }); }); },
                                        LlamaLogLevel: { error: 0 },
                                    })];
                            });
                        }); },
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_a.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: {},
                            provider: "local",
                            model: "",
                            fallback: "none",
                        })];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, result.provider.embedQuery("test")];
                case 3:
                    embedding = _a.sent();
                    (0, vitest_1.expect)(embedding).toEqual([0, 0, 0, 0]);
                    (0, vitest_1.expect)(embedding.every(function (value) { return Number.isFinite(value); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sanitizes non-finite values before normalization", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nonFiniteVector, createEmbeddingProvider, result, embedding;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nonFiniteVector = [1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
                    vitest_1.vi.doMock("./node-llama.js", function () { return ({
                        importNodeLlamaCpp: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        getLlama: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        loadModel: vitest_1.vi.fn().mockResolvedValue({
                                                            createEmbeddingContext: vitest_1.vi.fn().mockResolvedValue({
                                                                getEmbeddingFor: vitest_1.vi.fn().mockResolvedValue({
                                                                    vector: new Float32Array(nonFiniteVector),
                                                                }),
                                                            }),
                                                        }),
                                                    })];
                                            });
                                        }); },
                                        resolveModelFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, "/fake/model.gguf"];
                                        }); }); },
                                        LlamaLogLevel: { error: 0 },
                                    })];
                            });
                        }); },
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_a.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: {},
                            provider: "local",
                            model: "",
                            fallback: "none",
                        })];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, result.provider.embedQuery("test")];
                case 3:
                    embedding = _a.sent();
                    (0, vitest_1.expect)(embedding).toEqual([1, 0, 0, 0]);
                    (0, vitest_1.expect)(embedding.every(function (value) { return Number.isFinite(value); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes batch embeddings to magnitude ~1.0", function () { return __awaiter(void 0, void 0, void 0, function () {
        var unnormalizedVectors, createEmbeddingProvider, result, embeddings, _i, embeddings_1, embedding, magnitude;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    unnormalizedVectors = [
                        [2.35, 3.45, 0.63, 4.3],
                        [10.0, 0.0, 0.0, 0.0],
                        [1.0, 1.0, 1.0, 1.0],
                    ];
                    vitest_1.vi.doMock("./node-llama.js", function () { return ({
                        importNodeLlamaCpp: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ({
                                        getLlama: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, ({
                                                        loadModel: vitest_1.vi.fn().mockResolvedValue({
                                                            createEmbeddingContext: vitest_1.vi.fn().mockResolvedValue({
                                                                getEmbeddingFor: vitest_1.vi
                                                                    .fn()
                                                                    .mockResolvedValueOnce({ vector: new Float32Array(unnormalizedVectors[0]) })
                                                                    .mockResolvedValueOnce({ vector: new Float32Array(unnormalizedVectors[1]) })
                                                                    .mockResolvedValueOnce({ vector: new Float32Array(unnormalizedVectors[2]) }),
                                                            }),
                                                        }),
                                                    })];
                                            });
                                        }); },
                                        resolveModelFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, "/fake/model.gguf"];
                                        }); }); },
                                        LlamaLogLevel: { error: 0 },
                                    })];
                            });
                        }); },
                    }); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./embeddings.js"); })];
                case 1:
                    createEmbeddingProvider = (_a.sent()).createEmbeddingProvider;
                    return [4 /*yield*/, createEmbeddingProvider({
                            config: {},
                            provider: "local",
                            model: "",
                            fallback: "none",
                        })];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, result.provider.embedBatch(["text1", "text2", "text3"])];
                case 3:
                    embeddings = _a.sent();
                    for (_i = 0, embeddings_1 = embeddings; _i < embeddings_1.length; _i++) {
                        embedding = embeddings_1[_i];
                        magnitude = Math.sqrt(embedding.reduce(function (sum, x) { return sum + x * x; }, 0));
                        (0, vitest_1.expect)(magnitude).toBeCloseTo(1.0, 5);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
