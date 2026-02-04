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
exports.VoiceCallWebhookServer = void 0;
exports.getTailscaleSelfInfo = getTailscaleSelfInfo;
exports.getTailscaleDnsName = getTailscaleDnsName;
exports.setupTailscaleExposureRoute = setupTailscaleExposureRoute;
exports.cleanupTailscaleExposureRoute = cleanupTailscaleExposureRoute;
exports.setupTailscaleExposure = setupTailscaleExposure;
exports.cleanupTailscaleExposure = cleanupTailscaleExposure;
var node_child_process_1 = require("node:child_process");
var node_http_1 = require("node:http");
var node_url_1 = require("node:url");
var media_stream_js_1 = require("./media-stream.js");
var stt_openai_realtime_js_1 = require("./providers/stt-openai-realtime.js");
/**
 * HTTP server for receiving voice call webhooks from providers.
 * Supports WebSocket upgrades for media streams when streaming is enabled.
 */
var VoiceCallWebhookServer = /** @class */ (function () {
    function VoiceCallWebhookServer(config, manager, provider, coreConfig) {
        var _a;
        this.server = null;
        /** Media stream handler for bidirectional audio (when streaming enabled) */
        this.mediaStreamHandler = null;
        this.config = config;
        this.manager = manager;
        this.provider = provider;
        this.coreConfig = coreConfig !== null && coreConfig !== void 0 ? coreConfig : null;
        // Initialize media stream handler if streaming is enabled
        if ((_a = config.streaming) === null || _a === void 0 ? void 0 : _a.enabled) {
            this.initializeMediaStreaming();
        }
    }
    /**
     * Get the media stream handler (for wiring to provider).
     */
    VoiceCallWebhookServer.prototype.getMediaStreamHandler = function () {
        return this.mediaStreamHandler;
    };
    /**
     * Initialize media streaming with OpenAI Realtime STT.
     */
    VoiceCallWebhookServer.prototype.initializeMediaStreaming = function () {
        var _this = this;
        var _a, _b, _c, _d;
        var apiKey = ((_a = this.config.streaming) === null || _a === void 0 ? void 0 : _a.openaiApiKey) || process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.warn("[voice-call] Streaming enabled but no OpenAI API key found");
            return;
        }
        var sttProvider = new stt_openai_realtime_js_1.OpenAIRealtimeSTTProvider({
            apiKey: apiKey,
            model: (_b = this.config.streaming) === null || _b === void 0 ? void 0 : _b.sttModel,
            silenceDurationMs: (_c = this.config.streaming) === null || _c === void 0 ? void 0 : _c.silenceDurationMs,
            vadThreshold: (_d = this.config.streaming) === null || _d === void 0 ? void 0 : _d.vadThreshold,
        });
        var streamConfig = {
            sttProvider: sttProvider,
            onTranscript: function (providerCallId, transcript) {
                var _a;
                console.log("[voice-call] Transcript for ".concat(providerCallId, ": ").concat(transcript));
                // Clear TTS queue on barge-in (user started speaking, interrupt current playback)
                if (_this.provider.name === "twilio") {
                    _this.provider.clearTtsQueue(providerCallId);
                }
                // Look up our internal call ID from the provider call ID
                var call = _this.manager.getCallByProviderCallId(providerCallId);
                if (!call) {
                    console.warn("[voice-call] No active call found for provider ID: ".concat(providerCallId));
                    return;
                }
                // Create a speech event and process it through the manager
                var event = {
                    id: "stream-transcript-".concat(Date.now()),
                    type: "call.speech",
                    callId: call.callId,
                    providerCallId: providerCallId,
                    timestamp: Date.now(),
                    transcript: transcript,
                    isFinal: true,
                };
                _this.manager.processEvent(event);
                // Auto-respond in conversation mode (inbound always, outbound if mode is conversation)
                var callMode = (_a = call.metadata) === null || _a === void 0 ? void 0 : _a.mode;
                var shouldRespond = call.direction === "inbound" || callMode === "conversation";
                if (shouldRespond) {
                    _this.handleInboundResponse(call.callId, transcript).catch(function (err) {
                        console.warn("[voice-call] Failed to auto-respond:", err);
                    });
                }
            },
            onSpeechStart: function (providerCallId) {
                if (_this.provider.name === "twilio") {
                    _this.provider.clearTtsQueue(providerCallId);
                }
            },
            onPartialTranscript: function (callId, partial) {
                console.log("[voice-call] Partial for ".concat(callId, ": ").concat(partial));
            },
            onConnect: function (callId, streamSid) {
                console.log("[voice-call] Media stream connected: ".concat(callId, " -> ").concat(streamSid));
                // Register stream with provider for TTS routing
                if (_this.provider.name === "twilio") {
                    _this.provider.registerCallStream(callId, streamSid);
                }
                // Speak initial message if one was provided when call was initiated
                // Use setTimeout to allow stream setup to complete
                setTimeout(function () {
                    _this.manager.speakInitialMessage(callId).catch(function (err) {
                        console.warn("[voice-call] Failed to speak initial message:", err);
                    });
                }, 500);
            },
            onDisconnect: function (callId) {
                console.log("[voice-call] Media stream disconnected: ".concat(callId));
                if (_this.provider.name === "twilio") {
                    _this.provider.unregisterCallStream(callId);
                }
            },
        };
        this.mediaStreamHandler = new media_stream_js_1.MediaStreamHandler(streamConfig);
        console.log("[voice-call] Media streaming initialized");
    };
    /**
     * Start the webhook server.
     */
    VoiceCallWebhookServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, port, bind, webhookPath, streamPath;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                _a = this.config.serve, port = _a.port, bind = _a.bind, webhookPath = _a.path;
                streamPath = ((_b = this.config.streaming) === null || _b === void 0 ? void 0 : _b.streamPath) || "/voice/stream";
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.server = node_http_1.default.createServer(function (req, res) {
                            _this.handleRequest(req, res, webhookPath).catch(function (err) {
                                console.error("[voice-call] Webhook error:", err);
                                res.statusCode = 500;
                                res.end("Internal Server Error");
                            });
                        });
                        // Handle WebSocket upgrades for media streams
                        if (_this.mediaStreamHandler) {
                            _this.server.on("upgrade", function (request, socket, head) {
                                var _a;
                                var url = new node_url_1.URL(request.url || "/", "http://".concat(request.headers.host));
                                if (url.pathname === streamPath) {
                                    console.log("[voice-call] WebSocket upgrade for media stream");
                                    (_a = _this.mediaStreamHandler) === null || _a === void 0 ? void 0 : _a.handleUpgrade(request, socket, head);
                                }
                                else {
                                    socket.destroy();
                                }
                            });
                        }
                        _this.server.on("error", reject);
                        _this.server.listen(port, bind, function () {
                            var url = "http://".concat(bind, ":").concat(port).concat(webhookPath);
                            console.log("[voice-call] Webhook server listening on ".concat(url));
                            if (_this.mediaStreamHandler) {
                                console.log("[voice-call] Media stream WebSocket on ws://".concat(bind, ":").concat(port).concat(streamPath));
                            }
                            resolve(url);
                        });
                    })];
            });
        });
    };
    /**
     * Stop the webhook server.
     */
    VoiceCallWebhookServer.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        if (_this.server) {
                            _this.server.close(function () {
                                _this.server = null;
                                resolve();
                            });
                        }
                        else {
                            resolve();
                        }
                    })];
            });
        });
    };
    /**
     * Handle incoming HTTP request.
     */
    VoiceCallWebhookServer.prototype.handleRequest = function (req, res, webhookPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, ctx, verification, result, _i, _a, event_1, _b, _c, _d, key, value;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        url = new node_url_1.URL(req.url || "/", "http://".concat(req.headers.host));
                        // Check path
                        if (!url.pathname.startsWith(webhookPath)) {
                            res.statusCode = 404;
                            res.end("Not Found");
                            return [2 /*return*/];
                        }
                        // Only accept POST
                        if (req.method !== "POST") {
                            res.statusCode = 405;
                            res.end("Method Not Allowed");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.readBody(req)];
                    case 1:
                        body = _f.sent();
                        ctx = {
                            headers: req.headers,
                            rawBody: body,
                            url: "http://".concat(req.headers.host).concat(req.url),
                            method: "POST",
                            query: Object.fromEntries(url.searchParams),
                            remoteAddress: (_e = req.socket.remoteAddress) !== null && _e !== void 0 ? _e : undefined,
                        };
                        verification = this.provider.verifyWebhook(ctx);
                        if (!verification.ok) {
                            console.warn("[voice-call] Webhook verification failed: ".concat(verification.reason));
                            res.statusCode = 401;
                            res.end("Unauthorized");
                            return [2 /*return*/];
                        }
                        result = this.provider.parseWebhookEvent(ctx);
                        // Process each event
                        for (_i = 0, _a = result.events; _i < _a.length; _i++) {
                            event_1 = _a[_i];
                            try {
                                this.manager.processEvent(event_1);
                            }
                            catch (err) {
                                console.error("[voice-call] Error processing event ".concat(event_1.type, ":"), err);
                            }
                        }
                        // Send response
                        res.statusCode = result.statusCode || 200;
                        if (result.providerResponseHeaders) {
                            for (_b = 0, _c = Object.entries(result.providerResponseHeaders); _b < _c.length; _b++) {
                                _d = _c[_b], key = _d[0], value = _d[1];
                                res.setHeader(key, value);
                            }
                        }
                        res.end(result.providerResponseBody || "OK");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Read request body as string.
     */
    VoiceCallWebhookServer.prototype.readBody = function (req) {
        return new Promise(function (resolve, reject) {
            var chunks = [];
            req.on("data", function (chunk) { return chunks.push(chunk); });
            req.on("end", function () { return resolve(Buffer.concat(chunks).toString("utf-8")); });
            req.on("error", reject);
        });
    };
    /**
     * Handle auto-response for inbound calls using the agent system.
     * Supports tool calling for richer voice interactions.
     */
    VoiceCallWebhookServer.prototype.handleInboundResponse = function (callId, userMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var call, generateVoiceResponse, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("[voice-call] Auto-responding to inbound call ".concat(callId, ": \"").concat(userMessage, "\""));
                        call = this.manager.getCall(callId);
                        if (!call) {
                            console.warn("[voice-call] Call ".concat(callId, " not found for auto-response"));
                            return [2 /*return*/];
                        }
                        if (!this.coreConfig) {
                            console.warn("[voice-call] Core config missing; skipping auto-response");
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./response-generator.js"); })];
                    case 2:
                        generateVoiceResponse = (_a.sent()).generateVoiceResponse;
                        return [4 /*yield*/, generateVoiceResponse({
                                voiceConfig: this.config,
                                coreConfig: this.coreConfig,
                                callId: callId,
                                from: call.from,
                                transcript: call.transcript,
                                userMessage: userMessage,
                            })];
                    case 3:
                        result = _a.sent();
                        if (result.error) {
                            console.error("[voice-call] Response generation error: ".concat(result.error));
                            return [2 /*return*/];
                        }
                        if (!result.text) return [3 /*break*/, 5];
                        console.log("[voice-call] AI response: \"".concat(result.text, "\""));
                        return [4 /*yield*/, this.manager.speak(callId, result.text)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        console.error("[voice-call] Auto-response error:", err_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return VoiceCallWebhookServer;
}());
exports.VoiceCallWebhookServer = VoiceCallWebhookServer;
/**
 * Run a tailscale command with timeout, collecting stdout.
 */
function runTailscaleCommand(args, timeoutMs) {
    if (timeoutMs === void 0) { timeoutMs = 2500; }
    return new Promise(function (resolve) {
        var proc = (0, node_child_process_1.spawn)("tailscale", args, {
            stdio: ["ignore", "pipe", "pipe"],
        });
        var stdout = "";
        proc.stdout.on("data", function (data) {
            stdout += data;
        });
        var timer = setTimeout(function () {
            proc.kill("SIGKILL");
            resolve({ code: -1, stdout: "" });
        }, timeoutMs);
        proc.on("close", function (code) {
            clearTimeout(timer);
            resolve({ code: code !== null && code !== void 0 ? code : -1, stdout: stdout });
        });
    });
}
function getTailscaleSelfInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, code, stdout, status_1;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, runTailscaleCommand(["status", "--json"])];
                case 1:
                    _a = _e.sent(), code = _a.code, stdout = _a.stdout;
                    if (code !== 0) {
                        return [2 /*return*/, null];
                    }
                    try {
                        status_1 = JSON.parse(stdout);
                        return [2 /*return*/, {
                                dnsName: ((_c = (_b = status_1.Self) === null || _b === void 0 ? void 0 : _b.DNSName) === null || _c === void 0 ? void 0 : _c.replace(/\.$/, "")) || null,
                                nodeId: ((_d = status_1.Self) === null || _d === void 0 ? void 0 : _d.ID) || null,
                            }];
                    }
                    catch (_f) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getTailscaleDnsName() {
    return __awaiter(this, void 0, void 0, function () {
        var info;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getTailscaleSelfInfo()];
                case 1:
                    info = _b.sent();
                    return [2 /*return*/, (_a = info === null || info === void 0 ? void 0 : info.dnsName) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
function setupTailscaleExposureRoute(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var dnsName, code, publicUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTailscaleDnsName()];
                case 1:
                    dnsName = _a.sent();
                    if (!dnsName) {
                        console.warn("[voice-call] Could not get Tailscale DNS name");
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, runTailscaleCommand([
                            opts.mode,
                            "--bg",
                            "--yes",
                            "--set-path",
                            opts.path,
                            opts.localUrl,
                        ])];
                case 2:
                    code = (_a.sent()).code;
                    if (code === 0) {
                        publicUrl = "https://".concat(dnsName).concat(opts.path);
                        console.log("[voice-call] Tailscale ".concat(opts.mode, " active: ").concat(publicUrl));
                        return [2 /*return*/, publicUrl];
                    }
                    console.warn("[voice-call] Tailscale ".concat(opts.mode, " failed"));
                    return [2 /*return*/, null];
            }
        });
    });
}
function cleanupTailscaleExposureRoute(opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTailscaleCommand([opts.mode, "off", opts.path])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Setup Tailscale serve/funnel for the webhook server.
 * This is a helper that shells out to `tailscale serve` or `tailscale funnel`.
 */
function setupTailscaleExposure(config) {
    return __awaiter(this, void 0, void 0, function () {
        var mode, localUrl;
        return __generator(this, function (_a) {
            if (config.tailscale.mode === "off") {
                return [2 /*return*/, null];
            }
            mode = config.tailscale.mode === "funnel" ? "funnel" : "serve";
            localUrl = "http://127.0.0.1:".concat(config.serve.port).concat(config.serve.path);
            return [2 /*return*/, setupTailscaleExposureRoute({
                    mode: mode,
                    path: config.tailscale.path,
                    localUrl: localUrl,
                })];
        });
    });
}
/**
 * Cleanup Tailscale serve/funnel.
 */
function cleanupTailscaleExposure(config) {
    return __awaiter(this, void 0, void 0, function () {
        var mode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (config.tailscale.mode === "off") {
                        return [2 /*return*/];
                    }
                    mode = config.tailscale.mode === "funnel" ? "funnel" : "serve";
                    return [4 /*yield*/, cleanupTailscaleExposureRoute({ mode: mode, path: config.tailscale.path })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
