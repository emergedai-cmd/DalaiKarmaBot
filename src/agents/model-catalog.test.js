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
var model_catalog_js_1 = require("./model-catalog.js");
vitest_1.vi.mock("./models-config.js", function () { return ({
    ensureOpenClawModelsJson: vitest_1.vi.fn().mockResolvedValue({ agentDir: "/tmp", wrote: false }),
}); });
vitest_1.vi.mock("./agent-paths.js", function () { return ({
    resolveOpenClawAgentDir: function () { return "/tmp/openclaw"; },
}); });
(0, vitest_1.describe)("loadModelCatalog", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, model_catalog_js_1.resetModelCatalogCacheForTest)();
    });
    (0, vitest_1.afterEach)(function () {
        (0, model_catalog_js_1.__setModelCatalogImportForTest)();
        (0, model_catalog_js_1.resetModelCatalogCacheForTest)();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("retries after import failure without poisoning the cache", function () { return __awaiter(void 0, void 0, void 0, function () {
        var warnSpy, call, cfg, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    warnSpy = vitest_1.vi.spyOn(console, "warn").mockImplementation(function () { });
                    call = 0;
                    (0, model_catalog_js_1.__setModelCatalogImportForTest)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            call += 1;
                            if (call === 1) {
                                throw new Error("boom");
                            }
                            return [2 /*return*/, {
                                    AuthStorage: /** @class */ (function () {
                                        function AuthStorage() {
                                        }
                                        return AuthStorage;
                                    }()),
                                    ModelRegistry: /** @class */ (function () {
                                        function ModelRegistry() {
                                        }
                                        ModelRegistry.prototype.getAll = function () {
                                            return [{ id: "gpt-4.1", name: "GPT-4.1", provider: "openai" }];
                                        };
                                        return ModelRegistry;
                                    }()),
                                }];
                        });
                    }); });
                    cfg = {};
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
                case 1:
                    first = _a.sent();
                    (0, vitest_1.expect)(first).toEqual([]);
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
                case 2:
                    second = _a.sent();
                    (0, vitest_1.expect)(second).toEqual([{ id: "gpt-4.1", name: "GPT-4.1", provider: "openai" }]);
                    (0, vitest_1.expect)(call).toBe(2);
                    (0, vitest_1.expect)(warnSpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns partial results on discovery errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var warnSpy, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    warnSpy = vitest_1.vi.spyOn(console, "warn").mockImplementation(function () { });
                    (0, model_catalog_js_1.__setModelCatalogImportForTest)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    AuthStorage: /** @class */ (function () {
                                        function AuthStorage() {
                                        }
                                        return AuthStorage;
                                    }()),
                                    ModelRegistry: /** @class */ (function () {
                                        function ModelRegistry() {
                                        }
                                        ModelRegistry.prototype.getAll = function () {
                                            return [
                                                { id: "gpt-4.1", name: "GPT-4.1", provider: "openai" },
                                                {
                                                    get id() {
                                                        throw new Error("boom");
                                                    },
                                                    provider: "openai",
                                                    name: "bad",
                                                },
                                            ];
                                        };
                                        return ModelRegistry;
                                    }()),
                                })];
                        });
                    }); });
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: {} })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toEqual([{ id: "gpt-4.1", name: "GPT-4.1", provider: "openai" }]);
                    (0, vitest_1.expect)(warnSpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
