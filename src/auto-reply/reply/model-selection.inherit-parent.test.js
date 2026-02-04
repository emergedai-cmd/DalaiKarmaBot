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
var vitest_1 = require("vitest");
var model_selection_js_1 = require("./model-selection.js");
vitest_1.vi.mock("../../agents/model-catalog.js", function () { return ({
    loadModelCatalog: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, [
                    { provider: "openai", id: "gpt-4o-mini", name: "GPT-4o mini" },
                    { provider: "openai", id: "gpt-4o", name: "GPT-4o" },
                    { provider: "anthropic", id: "claude-opus-4-5", name: "Claude Opus 4.5" },
                ]];
        });
    }); }),
}); });
var defaultProvider = "openai";
var defaultModel = "gpt-4o-mini";
var makeEntry = function (overrides) {
    if (overrides === void 0) { overrides = {}; }
    return (__assign({ sessionId: "session-id", updatedAt: Date.now() }, overrides));
};
function resolveState(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, (0, model_selection_js_1.createModelSelectionState)({
                    cfg: params.cfg,
                    agentCfg: (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults,
                    sessionEntry: params.sessionEntry,
                    sessionStore: params.sessionStore,
                    sessionKey: params.sessionKey,
                    parentSessionKey: params.parentSessionKey,
                    defaultProvider: defaultProvider,
                    defaultModel: defaultModel,
                    provider: defaultProvider,
                    model: defaultModel,
                    hasModelDirective: false,
                })];
        });
    });
}
(0, vitest_1.describe)("createModelSelectionState parent inheritance", function () {
    (0, vitest_1.it)("inherits parent override from explicit parentSessionKey", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, parentKey, sessionKey, parentEntry, sessionEntry, sessionStore, state;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {};
                    parentKey = "agent:main:discord:channel:c1";
                    sessionKey = "agent:main:discord:channel:c1:thread:123";
                    parentEntry = makeEntry({
                        providerOverride: "openai",
                        modelOverride: "gpt-4o",
                    });
                    sessionEntry = makeEntry();
                    sessionStore = (_a = {},
                        _a[parentKey] = parentEntry,
                        _a[sessionKey] = sessionEntry,
                        _a);
                    return [4 /*yield*/, resolveState({
                            cfg: cfg,
                            sessionEntry: sessionEntry,
                            sessionStore: sessionStore,
                            sessionKey: sessionKey,
                            parentSessionKey: parentKey,
                        })];
                case 1:
                    state = _b.sent();
                    (0, vitest_1.expect)(state.provider).toBe("openai");
                    (0, vitest_1.expect)(state.model).toBe("gpt-4o");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("derives parent key from topic session suffix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, parentKey, sessionKey, parentEntry, sessionEntry, sessionStore, state;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {};
                    parentKey = "agent:main:telegram:group:123";
                    sessionKey = "agent:main:telegram:group:123:topic:99";
                    parentEntry = makeEntry({
                        providerOverride: "openai",
                        modelOverride: "gpt-4o",
                    });
                    sessionEntry = makeEntry();
                    sessionStore = (_a = {},
                        _a[parentKey] = parentEntry,
                        _a[sessionKey] = sessionEntry,
                        _a);
                    return [4 /*yield*/, resolveState({
                            cfg: cfg,
                            sessionEntry: sessionEntry,
                            sessionStore: sessionStore,
                            sessionKey: sessionKey,
                        })];
                case 1:
                    state = _b.sent();
                    (0, vitest_1.expect)(state.provider).toBe("openai");
                    (0, vitest_1.expect)(state.model).toBe("gpt-4o");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers child override over parent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, parentKey, sessionKey, parentEntry, sessionEntry, sessionStore, state;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {};
                    parentKey = "agent:main:telegram:group:123";
                    sessionKey = "agent:main:telegram:group:123:topic:99";
                    parentEntry = makeEntry({
                        providerOverride: "openai",
                        modelOverride: "gpt-4o",
                    });
                    sessionEntry = makeEntry({
                        providerOverride: "anthropic",
                        modelOverride: "claude-opus-4-5",
                    });
                    sessionStore = (_a = {},
                        _a[parentKey] = parentEntry,
                        _a[sessionKey] = sessionEntry,
                        _a);
                    return [4 /*yield*/, resolveState({
                            cfg: cfg,
                            sessionEntry: sessionEntry,
                            sessionStore: sessionStore,
                            sessionKey: sessionKey,
                        })];
                case 1:
                    state = _b.sent();
                    (0, vitest_1.expect)(state.provider).toBe("anthropic");
                    (0, vitest_1.expect)(state.model).toBe("claude-opus-4-5");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores parent override when disallowed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, parentKey, sessionKey, parentEntry, sessionEntry, sessionStore, state;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {
                        agents: {
                            defaults: {
                                models: {
                                    "openai/gpt-4o-mini": {},
                                },
                            },
                        },
                    };
                    parentKey = "agent:main:slack:channel:c1";
                    sessionKey = "agent:main:slack:channel:c1:thread:123";
                    parentEntry = makeEntry({
                        providerOverride: "anthropic",
                        modelOverride: "claude-opus-4-5",
                    });
                    sessionEntry = makeEntry();
                    sessionStore = (_a = {},
                        _a[parentKey] = parentEntry,
                        _a[sessionKey] = sessionEntry,
                        _a);
                    return [4 /*yield*/, resolveState({
                            cfg: cfg,
                            sessionEntry: sessionEntry,
                            sessionStore: sessionStore,
                            sessionKey: sessionKey,
                        })];
                case 1:
                    state = _b.sent();
                    (0, vitest_1.expect)(state.provider).toBe(defaultProvider);
                    (0, vitest_1.expect)(state.model).toBe(defaultModel);
                    return [2 /*return*/];
            }
        });
    }); });
});
