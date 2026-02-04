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
exports.ttsHandlers = void 0;
var config_js_1 = require("../../config/config.js");
var tts_js_1 = require("../../tts/tts.js");
var index_js_1 = require("../protocol/index.js");
var ws_log_js_1 = require("../ws-log.js");
exports.ttsHandlers = {
    "tts.status": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var cfg, config_1, prefsPath, provider, autoMode, fallbackProviders;
        var _c;
        var respond = _b.respond;
        return __generator(this, function (_d) {
            try {
                cfg = (0, config_js_1.loadConfig)();
                config_1 = (0, tts_js_1.resolveTtsConfig)(cfg);
                prefsPath = (0, tts_js_1.resolveTtsPrefsPath)(config_1);
                provider = (0, tts_js_1.getTtsProvider)(config_1, prefsPath);
                autoMode = (0, tts_js_1.resolveTtsAutoMode)({ config: config_1, prefsPath: prefsPath });
                fallbackProviders = (0, tts_js_1.resolveTtsProviderOrder)(provider)
                    .slice(1)
                    .filter(function (candidate) { return (0, tts_js_1.isTtsProviderConfigured)(config_1, candidate); });
                respond(true, {
                    enabled: (0, tts_js_1.isTtsEnabled)(config_1, prefsPath),
                    auto: autoMode,
                    provider: provider,
                    fallbackProvider: (_c = fallbackProviders[0]) !== null && _c !== void 0 ? _c : null,
                    fallbackProviders: fallbackProviders,
                    prefsPath: prefsPath,
                    hasOpenAIKey: Boolean((0, tts_js_1.resolveTtsApiKey)(config_1, "openai")),
                    hasElevenLabsKey: Boolean((0, tts_js_1.resolveTtsApiKey)(config_1, "elevenlabs")),
                    edgeEnabled: (0, tts_js_1.isTtsProviderConfigured)(config_1, "edge"),
                });
            }
            catch (err) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (0, ws_log_js_1.formatForLog)(err)));
            }
            return [2 /*return*/];
        });
    }); },
    "tts.enable": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var cfg, config, prefsPath;
        var respond = _b.respond;
        return __generator(this, function (_c) {
            try {
                cfg = (0, config_js_1.loadConfig)();
                config = (0, tts_js_1.resolveTtsConfig)(cfg);
                prefsPath = (0, tts_js_1.resolveTtsPrefsPath)(config);
                (0, tts_js_1.setTtsEnabled)(prefsPath, true);
                respond(true, { enabled: true });
            }
            catch (err) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (0, ws_log_js_1.formatForLog)(err)));
            }
            return [2 /*return*/];
        });
    }); },
    "tts.disable": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var cfg, config, prefsPath;
        var respond = _b.respond;
        return __generator(this, function (_c) {
            try {
                cfg = (0, config_js_1.loadConfig)();
                config = (0, tts_js_1.resolveTtsConfig)(cfg);
                prefsPath = (0, tts_js_1.resolveTtsPrefsPath)(config);
                (0, tts_js_1.setTtsEnabled)(prefsPath, false);
                respond(true, { enabled: false });
            }
            catch (err) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (0, ws_log_js_1.formatForLog)(err)));
            }
            return [2 /*return*/];
        });
    }); },
    "tts.convert": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var text, cfg, channel, result, err_1;
        var _c;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    text = typeof params.text === "string" ? params.text.trim() : "";
                    if (!text) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "tts.convert requires text"));
                        return [2 /*return*/];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    cfg = (0, config_js_1.loadConfig)();
                    channel = typeof params.channel === "string" ? params.channel.trim() : undefined;
                    return [4 /*yield*/, (0, tts_js_1.textToSpeech)({ text: text, cfg: cfg, channel: channel })];
                case 2:
                    result = _d.sent();
                    if (result.success && result.audioPath) {
                        respond(true, {
                            audioPath: result.audioPath,
                            provider: result.provider,
                            outputFormat: result.outputFormat,
                            voiceCompatible: result.voiceCompatible,
                        });
                        return [2 /*return*/];
                    }
                    respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (_c = result.error) !== null && _c !== void 0 ? _c : "TTS conversion failed"));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (0, ws_log_js_1.formatForLog)(err_1)));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    "tts.setProvider": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var provider, cfg, config, prefsPath;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_c) {
            provider = typeof params.provider === "string" ? params.provider.trim() : "";
            if (provider !== "openai" && provider !== "elevenlabs" && provider !== "edge") {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "Invalid provider. Use openai, elevenlabs, or edge."));
                return [2 /*return*/];
            }
            try {
                cfg = (0, config_js_1.loadConfig)();
                config = (0, tts_js_1.resolveTtsConfig)(cfg);
                prefsPath = (0, tts_js_1.resolveTtsPrefsPath)(config);
                (0, tts_js_1.setTtsProvider)(prefsPath, provider);
                respond(true, { provider: provider });
            }
            catch (err) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (0, ws_log_js_1.formatForLog)(err)));
            }
            return [2 /*return*/];
        });
    }); },
    "tts.providers": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var cfg, config, prefsPath;
        var respond = _b.respond;
        return __generator(this, function (_c) {
            try {
                cfg = (0, config_js_1.loadConfig)();
                config = (0, tts_js_1.resolveTtsConfig)(cfg);
                prefsPath = (0, tts_js_1.resolveTtsPrefsPath)(config);
                respond(true, {
                    providers: [
                        {
                            id: "openai",
                            name: "OpenAI",
                            configured: Boolean((0, tts_js_1.resolveTtsApiKey)(config, "openai")),
                            models: __spreadArray([], tts_js_1.OPENAI_TTS_MODELS, true),
                            voices: __spreadArray([], tts_js_1.OPENAI_TTS_VOICES, true),
                        },
                        {
                            id: "elevenlabs",
                            name: "ElevenLabs",
                            configured: Boolean((0, tts_js_1.resolveTtsApiKey)(config, "elevenlabs")),
                            models: ["eleven_multilingual_v2", "eleven_turbo_v2_5", "eleven_monolingual_v1"],
                        },
                        {
                            id: "edge",
                            name: "Edge TTS",
                            configured: (0, tts_js_1.isTtsProviderConfigured)(config, "edge"),
                            models: [],
                        },
                    ],
                    active: (0, tts_js_1.getTtsProvider)(config, prefsPath),
                });
            }
            catch (err) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (0, ws_log_js_1.formatForLog)(err)));
            }
            return [2 /*return*/];
        });
    }); },
};
