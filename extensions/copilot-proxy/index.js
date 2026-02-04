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
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var DEFAULT_BASE_URL = "http://localhost:3000/v1";
var DEFAULT_API_KEY = "n/a";
var DEFAULT_CONTEXT_WINDOW = 128000;
var DEFAULT_MAX_TOKENS = 8192;
var DEFAULT_MODEL_IDS = [
    "gpt-5.2",
    "gpt-5.2-codex",
    "gpt-5.1",
    "gpt-5.1-codex",
    "gpt-5.1-codex-max",
    "gpt-5-mini",
    "claude-opus-4.5",
    "claude-sonnet-4.5",
    "claude-haiku-4.5",
    "gemini-3-pro",
    "gemini-3-flash",
    "grok-code-fast-1",
];
function normalizeBaseUrl(value) {
    var trimmed = value.trim();
    if (!trimmed) {
        return DEFAULT_BASE_URL;
    }
    var normalized = trimmed;
    while (normalized.endsWith("/")) {
        normalized = normalized.slice(0, -1);
    }
    if (!normalized.endsWith("/v1")) {
        normalized = "".concat(normalized, "/v1");
    }
    return normalized;
}
function validateBaseUrl(value) {
    var normalized = normalizeBaseUrl(value);
    try {
        new URL(normalized);
    }
    catch (_a) {
        return "Enter a valid URL";
    }
    return undefined;
}
function parseModelIds(input) {
    var parsed = input
        .split(/[\n,]/)
        .map(function (model) { return model.trim(); })
        .filter(Boolean);
    return Array.from(new Set(parsed));
}
function buildModelDefinition(modelId) {
    return {
        id: modelId,
        name: modelId,
        api: "openai-completions",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: DEFAULT_CONTEXT_WINDOW,
        maxTokens: DEFAULT_MAX_TOKENS,
    };
}
var copilotProxyPlugin = {
    id: "copilot-proxy",
    name: "Copilot Proxy",
    description: "Local Copilot Proxy (VS Code LM) provider plugin",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        var _this = this;
        api.registerProvider({
            id: "copilot-proxy",
            label: "Copilot Proxy",
            docsPath: "/providers/models",
            auth: [
                {
                    id: "local",
                    label: "Local proxy",
                    hint: "Configure base URL + models for the Copilot Proxy server",
                    kind: "custom",
                    run: function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                        var baseUrlInput, modelInput, baseUrl, modelIds, defaultModelId, defaultModelRef;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, ctx.prompter.text({
                                        message: "Copilot Proxy base URL",
                                        initialValue: DEFAULT_BASE_URL,
                                        validate: validateBaseUrl,
                                    })];
                                case 1:
                                    baseUrlInput = _b.sent();
                                    return [4 /*yield*/, ctx.prompter.text({
                                            message: "Model IDs (comma-separated)",
                                            initialValue: DEFAULT_MODEL_IDS.join(", "),
                                            validate: function (value) {
                                                return parseModelIds(value).length > 0 ? undefined : "Enter at least one model id";
                                            },
                                        })];
                                case 2:
                                    modelInput = _b.sent();
                                    baseUrl = normalizeBaseUrl(baseUrlInput);
                                    modelIds = parseModelIds(modelInput);
                                    defaultModelId = (_a = modelIds[0]) !== null && _a !== void 0 ? _a : DEFAULT_MODEL_IDS[0];
                                    defaultModelRef = "copilot-proxy/".concat(defaultModelId);
                                    return [2 /*return*/, {
                                            profiles: [
                                                {
                                                    profileId: "copilot-proxy:local",
                                                    credential: {
                                                        type: "token",
                                                        provider: "copilot-proxy",
                                                        token: DEFAULT_API_KEY,
                                                    },
                                                },
                                            ],
                                            configPatch: {
                                                models: {
                                                    providers: {
                                                        "copilot-proxy": {
                                                            baseUrl: baseUrl,
                                                            apiKey: DEFAULT_API_KEY,
                                                            api: "openai-completions",
                                                            authHeader: false,
                                                            models: modelIds.map(function (modelId) { return buildModelDefinition(modelId); }),
                                                        },
                                                    },
                                                },
                                                agents: {
                                                    defaults: {
                                                        models: Object.fromEntries(modelIds.map(function (modelId) { return ["copilot-proxy/".concat(modelId), {}]; })),
                                                    },
                                                },
                                            },
                                            defaultModel: defaultModelRef,
                                            notes: [
                                                "Start the Copilot Proxy VS Code extension before using these models.",
                                                "Copilot Proxy serves /v1/chat/completions; base URL must include /v1.",
                                                "Model availability depends on your Copilot plan; edit models.providers.copilot-proxy if needed.",
                                            ],
                                        }];
                            }
                        });
                    }); },
                },
            ],
        });
    },
};
exports.default = copilotProxyPlugin;
