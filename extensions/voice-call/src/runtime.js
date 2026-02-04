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
exports.createVoiceCallRuntime = createVoiceCallRuntime;
var config_js_1 = require("./config.js");
var manager_js_1 = require("./manager.js");
var mock_js_1 = require("./providers/mock.js");
var plivo_js_1 = require("./providers/plivo.js");
var telnyx_js_1 = require("./providers/telnyx.js");
var twilio_js_1 = require("./providers/twilio.js");
var telephony_tts_js_1 = require("./telephony-tts.js");
var tunnel_js_1 = require("./tunnel.js");
var webhook_js_1 = require("./webhook.js");
function isLoopbackBind(bind) {
    if (!bind) {
        return false;
    }
    return bind === "127.0.0.1" || bind === "::1" || bind === "localhost";
}
function resolveProvider(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var allowNgrokFreeTierLoopbackBypass = ((_a = config.tunnel) === null || _a === void 0 ? void 0 : _a.provider) === "ngrok" &&
        isLoopbackBind((_b = config.serve) === null || _b === void 0 ? void 0 : _b.bind) &&
        (((_c = config.tunnel) === null || _c === void 0 ? void 0 : _c.allowNgrokFreeTierLoopbackBypass) || ((_d = config.tunnel) === null || _d === void 0 ? void 0 : _d.allowNgrokFreeTier) || false);
    switch (config.provider) {
        case "telnyx":
            return new telnyx_js_1.TelnyxProvider({
                apiKey: (_e = config.telnyx) === null || _e === void 0 ? void 0 : _e.apiKey,
                connectionId: (_f = config.telnyx) === null || _f === void 0 ? void 0 : _f.connectionId,
                publicKey: (_g = config.telnyx) === null || _g === void 0 ? void 0 : _g.publicKey,
            });
        case "twilio":
            return new twilio_js_1.TwilioProvider({
                accountSid: (_h = config.twilio) === null || _h === void 0 ? void 0 : _h.accountSid,
                authToken: (_j = config.twilio) === null || _j === void 0 ? void 0 : _j.authToken,
            }, {
                allowNgrokFreeTierLoopbackBypass: allowNgrokFreeTierLoopbackBypass,
                publicUrl: config.publicUrl,
                skipVerification: config.skipSignatureVerification,
                streamPath: ((_k = config.streaming) === null || _k === void 0 ? void 0 : _k.enabled) ? config.streaming.streamPath : undefined,
            });
        case "plivo":
            return new plivo_js_1.PlivoProvider({
                authId: (_l = config.plivo) === null || _l === void 0 ? void 0 : _l.authId,
                authToken: (_m = config.plivo) === null || _m === void 0 ? void 0 : _m.authToken,
            }, {
                publicUrl: config.publicUrl,
                skipVerification: config.skipSignatureVerification,
                ringTimeoutSec: Math.max(1, Math.floor(config.ringTimeoutMs / 1000)),
            });
        case "mock":
            return new mock_js_1.MockProvider();
        default:
            throw new Error("Unsupported voice-call provider: ".concat(String(config.provider)));
    }
}
function createVoiceCallRuntime(params) {
    return __awaiter(this, void 0, void 0, function () {
        var rawConfig, coreConfig, ttsRuntime, logger, log, config, validation, provider, manager, webhookServer, localUrl, publicUrl, tunnelResult, err_1, webhookUrl, twilioProvider, ttsProvider, mediaHandler, stop;
        var _this = this;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    rawConfig = params.config, coreConfig = params.coreConfig, ttsRuntime = params.ttsRuntime, logger = params.logger;
                    log = logger !== null && logger !== void 0 ? logger : {
                        info: console.log,
                        warn: console.warn,
                        error: console.error,
                        debug: console.debug,
                    };
                    config = (0, config_js_1.resolveVoiceCallConfig)(rawConfig);
                    if (!config.enabled) {
                        throw new Error("Voice call disabled. Enable the plugin entry in config.");
                    }
                    validation = (0, config_js_1.validateProviderConfig)(config);
                    if (!validation.valid) {
                        throw new Error("Invalid voice-call config: ".concat(validation.errors.join("; ")));
                    }
                    provider = resolveProvider(config);
                    manager = new manager_js_1.CallManager(config);
                    webhookServer = new webhook_js_1.VoiceCallWebhookServer(config, manager, provider, coreConfig);
                    return [4 /*yield*/, webhookServer.start()];
                case 1:
                    localUrl = _f.sent();
                    publicUrl = (_a = config.publicUrl) !== null && _a !== void 0 ? _a : null;
                    tunnelResult = null;
                    if (!(!publicUrl && ((_b = config.tunnel) === null || _b === void 0 ? void 0 : _b.provider) && config.tunnel.provider !== "none")) return [3 /*break*/, 5];
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, tunnel_js_1.startTunnel)({
                            provider: config.tunnel.provider,
                            port: config.serve.port,
                            path: config.serve.path,
                            ngrokAuthToken: config.tunnel.ngrokAuthToken,
                            ngrokDomain: config.tunnel.ngrokDomain,
                        })];
                case 3:
                    tunnelResult = _f.sent();
                    publicUrl = (_c = tunnelResult === null || tunnelResult === void 0 ? void 0 : tunnelResult.publicUrl) !== null && _c !== void 0 ? _c : null;
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _f.sent();
                    log.error("[voice-call] Tunnel setup failed: ".concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                    return [3 /*break*/, 5];
                case 5:
                    if (!(!publicUrl && ((_d = config.tailscale) === null || _d === void 0 ? void 0 : _d.mode) !== "off")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, webhook_js_1.setupTailscaleExposure)(config)];
                case 6:
                    publicUrl = _f.sent();
                    _f.label = 7;
                case 7:
                    webhookUrl = publicUrl !== null && publicUrl !== void 0 ? publicUrl : localUrl;
                    if (publicUrl && provider.name === "twilio") {
                        provider.setPublicUrl(publicUrl);
                    }
                    if (provider.name === "twilio" && ((_e = config.streaming) === null || _e === void 0 ? void 0 : _e.enabled)) {
                        twilioProvider = provider;
                        if (ttsRuntime === null || ttsRuntime === void 0 ? void 0 : ttsRuntime.textToSpeechTelephony) {
                            try {
                                ttsProvider = (0, telephony_tts_js_1.createTelephonyTtsProvider)({
                                    coreConfig: coreConfig,
                                    ttsOverride: config.tts,
                                    runtime: ttsRuntime,
                                });
                                twilioProvider.setTTSProvider(ttsProvider);
                                log.info("[voice-call] Telephony TTS provider configured");
                            }
                            catch (err) {
                                log.warn("[voice-call] Failed to initialize telephony TTS: ".concat(err instanceof Error ? err.message : String(err)));
                            }
                        }
                        else {
                            log.warn("[voice-call] Telephony TTS unavailable; streaming TTS disabled");
                        }
                        mediaHandler = webhookServer.getMediaStreamHandler();
                        if (mediaHandler) {
                            twilioProvider.setMediaStreamHandler(mediaHandler);
                            log.info("[voice-call] Media stream handler wired to provider");
                        }
                    }
                    manager.initialize(provider, webhookUrl);
                    stop = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!tunnelResult) return [3 /*break*/, 2];
                                    return [4 /*yield*/, tunnelResult.stop()];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [4 /*yield*/, (0, webhook_js_1.cleanupTailscaleExposure)(config)];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, webhookServer.stop()];
                                case 4:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    log.info("[voice-call] Runtime initialized");
                    log.info("[voice-call] Webhook URL: ".concat(webhookUrl));
                    if (publicUrl) {
                        log.info("[voice-call] Public URL: ".concat(publicUrl));
                    }
                    return [2 /*return*/, {
                            config: config,
                            provider: provider,
                            manager: manager,
                            webhookServer: webhookServer,
                            webhookUrl: webhookUrl,
                            publicUrl: publicUrl,
                            stop: stop,
                        }];
            }
        });
    });
}
