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
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var oauth_js_1 = require("./oauth.js");
var PROVIDER_ID = "minimax-portal";
var PROVIDER_LABEL = "MiniMax";
var DEFAULT_MODEL = "MiniMax-M2.1";
var DEFAULT_BASE_URL_CN = "https://api.minimaxi.com/anthropic";
var DEFAULT_BASE_URL_GLOBAL = "https://api.minimax.io/anthropic";
var DEFAULT_CONTEXT_WINDOW = 200000;
var DEFAULT_MAX_TOKENS = 8192;
var OAUTH_PLACEHOLDER = "minimax-oauth";
function getDefaultBaseUrl(region) {
    return region === "cn" ? DEFAULT_BASE_URL_CN : DEFAULT_BASE_URL_GLOBAL;
}
function modelRef(modelId) {
    return "".concat(PROVIDER_ID, "/").concat(modelId);
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
function createOAuthHandler(region) {
    var _this = this;
    var defaultBaseUrl = getDefaultBaseUrl(region);
    var regionLabel = region === "cn" ? "CN" : "Global";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var progress, result, profileId, baseUrl, err_1, errorMsg;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    progress = ctx.prompter.progress("Starting MiniMax OAuth (".concat(regionLabel, ")\u2026"));
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 7]);
                    return [4 /*yield*/, (0, oauth_js_1.loginMiniMaxPortalOAuth)({
                            openUrl: ctx.openUrl,
                            note: ctx.prompter.note,
                            progress: progress,
                            region: region,
                        })];
                case 2:
                    result = _c.sent();
                    progress.stop("MiniMax OAuth complete");
                    if (!result.notification_message) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.prompter.note(result.notification_message, "MiniMax OAuth")];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    profileId = "".concat(PROVIDER_ID, ":default");
                    baseUrl = result.resourceUrl || defaultBaseUrl;
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
                                            api: "anthropic-messages",
                                            models: [
                                                buildModelDefinition({
                                                    id: "MiniMax-M2.1",
                                                    name: "MiniMax M2.1",
                                                    input: ["text"],
                                                }),
                                                buildModelDefinition({
                                                    id: "MiniMax-M2.1-lightning",
                                                    name: "MiniMax M2.1 Lightning",
                                                    input: ["text"],
                                                }),
                                            ],
                                        },
                                        _a),
                                },
                                agents: {
                                    defaults: {
                                        models: (_b = {},
                                            _b[modelRef("MiniMax-M2.1")] = { alias: "minimax-m2.1" },
                                            _b[modelRef("MiniMax-M2.1-lightning")] = { alias: "minimax-m2.1-lightning" },
                                            _b),
                                    },
                                },
                            },
                            defaultModel: modelRef(DEFAULT_MODEL),
                            notes: __spreadArray([
                                "MiniMax OAuth tokens auto-refresh. Re-run login if refresh fails or access is revoked.",
                                "Base URL defaults to ".concat(defaultBaseUrl, ". Override models.providers.").concat(PROVIDER_ID, ".baseUrl if needed.")
                            ], (result.notification_message ? [result.notification_message] : []), true),
                        }];
                case 5:
                    err_1 = _c.sent();
                    errorMsg = err_1 instanceof Error ? err_1.message : String(err_1);
                    progress.stop("MiniMax OAuth failed: ".concat(errorMsg));
                    return [4 /*yield*/, ctx.prompter.note("If OAuth fails, verify your MiniMax account has portal access and try again.", "MiniMax OAuth")];
                case 6:
                    _c.sent();
                    throw err_1;
                case 7: return [2 /*return*/];
            }
        });
    }); };
}
var minimaxPortalPlugin = {
    id: "minimax-portal-auth",
    name: "MiniMax OAuth",
    description: "OAuth flow for MiniMax models",
    configSchema: (0, plugin_sdk_1.emptyPluginConfigSchema)(),
    register: function (api) {
        api.registerProvider({
            id: PROVIDER_ID,
            label: PROVIDER_LABEL,
            docsPath: "/providers/minimax",
            aliases: ["minimax"],
            auth: [
                {
                    id: "oauth",
                    label: "MiniMax OAuth (Global)",
                    hint: "Global endpoint - api.minimax.io",
                    kind: "device_code",
                    run: createOAuthHandler("global"),
                },
                {
                    id: "oauth-cn",
                    label: "MiniMax OAuth (CN)",
                    hint: "CN endpoint - api.minimaxi.com",
                    kind: "device_code",
                    run: createOAuthHandler("cn"),
                },
            ],
        });
    },
};
exports.default = minimaxPortalPlugin;
