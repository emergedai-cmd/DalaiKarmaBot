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
exports.TelnyxProvider = void 0;
var node_crypto_1 = require("node:crypto");
/**
 * Telnyx Voice API provider implementation.
 *
 * Uses Telnyx Call Control API v2 for managing calls.
 * @see https://developers.telnyx.com/docs/api/v2/call-control
 */
var TelnyxProvider = /** @class */ (function () {
    function TelnyxProvider(config) {
        this.name = "telnyx";
        this.baseUrl = "https://api.telnyx.com/v2";
        if (!config.apiKey) {
            throw new Error("Telnyx API key is required");
        }
        if (!config.connectionId) {
            throw new Error("Telnyx connection ID is required");
        }
        this.apiKey = config.apiKey;
        this.connectionId = config.connectionId;
        this.publicKey = config.publicKey;
    }
    /**
     * Make an authenticated request to the Telnyx API.
     */
    TelnyxProvider.prototype.apiRequest = function (endpoint, body, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, errorText, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer ".concat(this.apiKey),
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(body),
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        if ((options === null || options === void 0 ? void 0 : options.allowNotFound) && response.status === 404) {
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _a.sent();
                        throw new Error("Telnyx API error: ".concat(response.status, " ").concat(errorText));
                    case 3: return [4 /*yield*/, response.text()];
                    case 4:
                        text = _a.sent();
                        return [2 /*return*/, text ? JSON.parse(text) : undefined];
                }
            });
        });
    };
    /**
     * Verify Telnyx webhook signature using Ed25519.
     */
    TelnyxProvider.prototype.verifyWebhook = function (ctx) {
        if (!this.publicKey) {
            // No public key configured, skip verification (not recommended for production)
            return { ok: true };
        }
        var signature = ctx.headers["telnyx-signature-ed25519"];
        var timestamp = ctx.headers["telnyx-timestamp"];
        if (!signature || !timestamp) {
            return { ok: false, reason: "Missing signature or timestamp header" };
        }
        var signatureStr = Array.isArray(signature) ? signature[0] : signature;
        var timestampStr = Array.isArray(timestamp) ? timestamp[0] : timestamp;
        if (!signatureStr || !timestampStr) {
            return { ok: false, reason: "Empty signature or timestamp" };
        }
        try {
            var signedPayload = "".concat(timestampStr, "|").concat(ctx.rawBody);
            var signatureBuffer = Buffer.from(signatureStr, "base64");
            var publicKeyBuffer = Buffer.from(this.publicKey, "base64");
            var isValid = node_crypto_1.default.verify(null, // Ed25519 doesn't use a digest
            Buffer.from(signedPayload), {
                key: publicKeyBuffer,
                format: "der",
                type: "spki",
            }, signatureBuffer);
            if (!isValid) {
                return { ok: false, reason: "Invalid signature" };
            }
            // Check timestamp is within 5 minutes
            var eventTime = parseInt(timestampStr, 10) * 1000;
            var now = Date.now();
            if (Math.abs(now - eventTime) > 5 * 60 * 1000) {
                return { ok: false, reason: "Timestamp too old" };
            }
            return { ok: true };
        }
        catch (err) {
            return {
                ok: false,
                reason: "Verification error: ".concat(err instanceof Error ? err.message : String(err)),
            };
        }
    };
    /**
     * Parse Telnyx webhook event into normalized format.
     */
    TelnyxProvider.prototype.parseWebhookEvent = function (ctx) {
        try {
            var payload = JSON.parse(ctx.rawBody);
            var data = payload.data;
            if (!data || !data.event_type) {
                return { events: [], statusCode: 200 };
            }
            var event_1 = this.normalizeEvent(data);
            return {
                events: event_1 ? [event_1] : [],
                statusCode: 200,
            };
        }
        catch (_a) {
            return { events: [], statusCode: 400 };
        }
    };
    /**
     * Convert Telnyx event to normalized event format.
     */
    TelnyxProvider.prototype.normalizeEvent = function (data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        // Decode client_state from Base64 (we encode it in initiateCall)
        var callId = "";
        if ((_a = data.payload) === null || _a === void 0 ? void 0 : _a.client_state) {
            try {
                callId = Buffer.from(data.payload.client_state, "base64").toString("utf8");
            }
            catch (_l) {
                // Fallback if not valid Base64
                callId = data.payload.client_state;
            }
        }
        if (!callId) {
            callId = ((_b = data.payload) === null || _b === void 0 ? void 0 : _b.call_control_id) || "";
        }
        var baseEvent = {
            id: data.id || node_crypto_1.default.randomUUID(),
            callId: callId,
            providerCallId: (_c = data.payload) === null || _c === void 0 ? void 0 : _c.call_control_id,
            timestamp: Date.now(),
        };
        switch (data.event_type) {
            case "call.initiated":
                return __assign(__assign({}, baseEvent), { type: "call.initiated" });
            case "call.ringing":
                return __assign(__assign({}, baseEvent), { type: "call.ringing" });
            case "call.answered":
                return __assign(__assign({}, baseEvent), { type: "call.answered" });
            case "call.bridged":
                return __assign(__assign({}, baseEvent), { type: "call.active" });
            case "call.speak.started":
                return __assign(__assign({}, baseEvent), { type: "call.speaking", text: ((_d = data.payload) === null || _d === void 0 ? void 0 : _d.text) || "" });
            case "call.transcription":
                return __assign(__assign({}, baseEvent), { type: "call.speech", transcript: ((_e = data.payload) === null || _e === void 0 ? void 0 : _e.transcription) || "", isFinal: (_g = (_f = data.payload) === null || _f === void 0 ? void 0 : _f.is_final) !== null && _g !== void 0 ? _g : true, confidence: (_h = data.payload) === null || _h === void 0 ? void 0 : _h.confidence });
            case "call.hangup":
                return __assign(__assign({}, baseEvent), { type: "call.ended", reason: this.mapHangupCause((_j = data.payload) === null || _j === void 0 ? void 0 : _j.hangup_cause) });
            case "call.dtmf.received":
                return __assign(__assign({}, baseEvent), { type: "call.dtmf", digits: ((_k = data.payload) === null || _k === void 0 ? void 0 : _k.digit) || "" });
            default:
                return null;
        }
    };
    /**
     * Map Telnyx hangup cause to normalized end reason.
     * @see https://developers.telnyx.com/docs/api/v2/call-control/Call-Commands#hangup-causes
     */
    TelnyxProvider.prototype.mapHangupCause = function (cause) {
        switch (cause) {
            case "normal_clearing":
            case "normal_unspecified":
                return "completed";
            case "originator_cancel":
                return "hangup-bot";
            case "call_rejected":
            case "user_busy":
                return "busy";
            case "no_answer":
            case "no_user_response":
                return "no-answer";
            case "destination_out_of_order":
            case "network_out_of_order":
            case "service_unavailable":
            case "recovery_on_timer_expire":
                return "failed";
            case "machine_detected":
            case "fax_detected":
                return "voicemail";
            case "user_hangup":
            case "subscriber_absent":
                return "hangup-user";
            default:
                // Unknown cause - log it for debugging and return completed
                if (cause) {
                    console.warn("[telnyx] Unknown hangup cause: ".concat(cause));
                }
                return "completed";
        }
    };
    /**
     * Initiate an outbound call via Telnyx API.
     */
    TelnyxProvider.prototype.initiateCall = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiRequest("/calls", {
                            connection_id: this.connectionId,
                            to: input.to,
                            from: input.from,
                            webhook_url: input.webhookUrl,
                            webhook_url_method: "POST",
                            client_state: Buffer.from(input.callId).toString("base64"),
                            timeout_secs: 30,
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                providerCallId: result.data.call_control_id,
                                status: "initiated",
                            }];
                }
            });
        });
    };
    /**
     * Hang up a call via Telnyx API.
     */
    TelnyxProvider.prototype.hangupCall = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiRequest("/calls/".concat(input.providerCallId, "/actions/hangup"), { command_id: node_crypto_1.default.randomUUID() }, { allowNotFound: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Play TTS audio via Telnyx speak action.
     */
    TelnyxProvider.prototype.playTts = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiRequest("/calls/".concat(input.providerCallId, "/actions/speak"), {
                            command_id: node_crypto_1.default.randomUUID(),
                            payload: input.text,
                            voice: input.voice || "female",
                            language: input.locale || "en-US",
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Start transcription (STT) via Telnyx.
     */
    TelnyxProvider.prototype.startListening = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiRequest("/calls/".concat(input.providerCallId, "/actions/transcription_start"), {
                            command_id: node_crypto_1.default.randomUUID(),
                            language: input.language || "en",
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Stop transcription via Telnyx.
     */
    TelnyxProvider.prototype.stopListening = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiRequest("/calls/".concat(input.providerCallId, "/actions/transcription_stop"), { command_id: node_crypto_1.default.randomUUID() }, { allowNotFound: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TelnyxProvider;
}());
exports.TelnyxProvider = TelnyxProvider;
