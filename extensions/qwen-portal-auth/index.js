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
var oauth_js_1 = require("./oauth.js");
var PROVIDER_ID = "qwen-portal";
var PROVIDER_LABEL = "Qwen";
var DEFAULT_MODEL = "qwen-portal/coder-model";
var DEFAULT_BASE_URL = "https://portal.qwen.ai/v1";
var DEFAULT_CONTEXT_WINDOW = 128000;
var DEFAULT_MAX_TOKENS = 8192;
var OAUTH_PLACEHOLDER = "qwen-oauth";
function normalizeBaseUrl(value) {
    var raw = (value === null || value === void 0 ? void 0 : value.trim()) || DEFAULT_BASE_URL;
    var withProtocol = raw.startsWith("http") ? raw : "https://".concat(raw);
    return withProtocol.endsWith("/v1") ? withProtocol : "".concat(withProtocol.replace(/\/+$/, ""), "/v1");
}
function buildModelDefinition(params) {
    return {
        id: params.id,
        name: params.name,
        reasoning: false,
        input: params.input,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: DEFAULT_CONTEXT_WINDOW,
        maxTokens: DEFAULT_MAX_TOKENS,
    };
}
var qwenPortalPlugin = {
    id: "qwen-portal-auth",
    name: "Qwen OAuth",
    description: "OAuth flow for Qwen (free-tier) models",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        var _this = this;
        api.registerProvider({
            id: PROVIDER_ID,
            label: PROVIDER_LABEL,
            docsPath: "/providers/qwen",
            aliases: ["qwen"],
            auth: [
                {
                    id: "device",
                    label: "Qwen OAuth",
                    hint: "Device code login",
                    kind: "device_code",
                    run: function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                        var progress, result, profileId, baseUrl, err_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    progress = ctx.prompter.progress("Starting Qwen OAuth…");
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 5]);
                                    return [4 /*yield*/, (0, oauth_js_1.loginQwenPortalOAuth)({
                                            openUrl: ctx.openUrl,
                                            note: ctx.prompter.note,
                                            progress: progress,
                                        })];
                                case 2:
                                    result = _b.sent();
                                    progress.stop("Qwen OAuth complete");
                                    profileId = "".concat(PROVIDER_ID, ":default");
                                    baseUrl = normalizeBaseUrl(result.resourceUrl);
                                    return [2 /*return*/, {
                                            profiles: [
                                                {
                                                    profileId: profileId,
                                                    credential: {
                                                        type: "oauth",
                                                        provider: PROVIDER_ID,
                                                        access: result.access,
                                                        refresh: result.refresh,
                                                        expires: result.expires,
                                                    },
                                                },
                                            ],
                                            configPatch: {
                                                models: {
                                                    providers: (_a = {},
                                                        _a[PROVIDER_ID] = {
                                                            baseUrl: baseUrl,
                                                            apiKey: OAUTH_PLACEHOLDER,
                                                            api: "openai-completions",
                                                            models: [
                                                                buildModelDefinition({
                                                                    id: "coder-model",
                                                                    name: "Qwen Coder",
                                                                    input: ["text"],
                                                                }),
                                                                buildModelDefinition({
                                                                    id: "vision-model",
                                                                    name: "Qwen Vision",
                                                                    input: ["text", "image"],
                                                                }),
                                                            ],
                                                        },
                                                        _a),
                                                },
                                                agents: {
                                                    defaults: {
                                                        models: {
                                                            "qwen-portal/coder-model": { alias: "qwen" },
                                                            "qwen-portal/vision-model": {},
                                                        },
                                                    },
                                                },
                                            },
                                            defaultModel: DEFAULT_MODEL,
                                            notes: [
                                                "Qwen OAuth tokens auto-refresh. Re-run login if refresh fails or access is revoked.",
                                                "Base URL defaults to ".concat(DEFAULT_BASE_URL, ". Override models.providers.").concat(PROVIDER_ID, ".baseUrl if needed."),
                                            ],
                                        }];
                                case 3:
                                    err_1 = _b.sent();
                                    progress.stop("Qwen OAuth failed");
                                    return [4 /*yield*/, ctx.prompter.note("If OAuth fails, verify your Qwen account has portal access and try again.", "Qwen OAuth")];
                                case 4:
                                    _b.sent();
                                    throw err_1;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); },
                },
            ],
        });
    },
};
exports.default = qwenPortalPlugin;
