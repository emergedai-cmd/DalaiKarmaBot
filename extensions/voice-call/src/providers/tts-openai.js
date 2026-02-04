"use strict";
/**
 * OpenAI TTS Provider
 *
 * Generates speech audio using OpenAI's text-to-speech API.
 * Handles audio format conversion for telephony (mu-law 8kHz).
 *
 * Best practices from OpenAI docs:
 * - Use gpt-4o-mini-tts for intelligent realtime applications (supports instructions)
 * - Use tts-1 for lower latency, tts-1-hd for higher quality
 * - Use marin or cedar voices for best quality
 * - Use pcm or wav format for fastest response times
 *
 * @see https://platform.openai.com/docs/guides/text-to-speech
 */
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
exports.OpenAITTSProvider = exports.OPENAI_TTS_VOICES = void 0;
exports.mulawToLinear = mulawToLinear;
exports.chunkAudio = chunkAudio;
/**
 * Supported OpenAI TTS voices (all 13 built-in voices).
 * For best quality, use marin or cedar.
 * Note: tts-1 and tts-1-hd support a smaller set.
 */
exports.OPENAI_TTS_VOICES = [
    "alloy",
    "ash",
    "ballad",
    "coral",
    "echo",
    "fable",
    "nova",
    "onyx",
    "sage",
    "shimmer",
    "verse",
    "marin",
    "cedar",
];
/**
 * OpenAI TTS Provider for generating speech audio.
 */
var OpenAITTSProvider = /** @class */ (function () {
    function OpenAITTSProvider(config) {
        if (config === void 0) { config = {}; }
        this.apiKey = config.apiKey || process.env.OPENAI_API_KEY || "";
        // Default to gpt-4o-mini-tts for intelligent realtime applications
        this.model = config.model || "gpt-4o-mini-tts";
        // Default to coral - good balance of quality and natural tone
        this.voice = config.voice || "coral";
        this.speed = config.speed || 1.0;
        this.instructions = config.instructions;
        if (!this.apiKey) {
            throw new Error("OpenAI API key required (set OPENAI_API_KEY or pass apiKey)");
        }
    }
    /**
     * Generate speech audio from text.
     * Returns raw PCM audio data (24kHz, mono, 16-bit).
     */
    OpenAITTSProvider.prototype.synthesize = function (text, instructions) {
        return __awaiter(this, void 0, void 0, function () {
            var body, effectiveInstructions, response, error, arrayBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {
                            model: this.model,
                            input: text,
                            voice: this.voice,
                            response_format: "pcm", // Raw PCM audio (24kHz, mono, 16-bit signed LE)
                            speed: this.speed,
                        };
                        effectiveInstructions = instructions || this.instructions;
                        if (effectiveInstructions && this.model.includes("gpt-4o-mini-tts")) {
                            body.instructions = effectiveInstructions;
                        }
                        return [4 /*yield*/, fetch("https://api.openai.com/v1/audio/speech", {
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
                        return [4 /*yield*/, response.text()];
                    case 2:
                        error = _a.sent();
                        throw new Error("OpenAI TTS failed: ".concat(response.status, " - ").concat(error));
                    case 3: return [4 /*yield*/, response.arrayBuffer()];
                    case 4:
                        arrayBuffer = _a.sent();
                        return [2 /*return*/, Buffer.from(arrayBuffer)];
                }
            });
        });
    };
    /**
     * Generate speech and convert to mu-law format for Twilio.
     * Twilio Media Streams expect 8kHz mono mu-law audio.
     */
    OpenAITTSProvider.prototype.synthesizeForTwilio = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var pcm24k, pcm8k;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.synthesize(text)];
                    case 1:
                        pcm24k = _a.sent();
                        pcm8k = resample24kTo8k(pcm24k);
                        // Encode to mu-law
                        return [2 /*return*/, pcmToMulaw(pcm8k)];
                }
            });
        });
    };
    return OpenAITTSProvider;
}());
exports.OpenAITTSProvider = OpenAITTSProvider;
/**
 * Resample 24kHz PCM to 8kHz using linear interpolation.
 * Input/output: 16-bit signed little-endian mono.
 */
function resample24kTo8k(input) {
    var inputSamples = input.length / 2;
    var outputSamples = Math.floor(inputSamples / 3);
    var output = Buffer.alloc(outputSamples * 2);
    for (var i = 0; i < outputSamples; i++) {
        // Calculate position in input (3:1 ratio)
        var srcPos = i * 3;
        var srcIdx = srcPos * 2;
        if (srcIdx + 3 < input.length) {
            // Linear interpolation between samples
            var s0 = input.readInt16LE(srcIdx);
            var s1 = input.readInt16LE(srcIdx + 2);
            var frac = srcPos % 1 || 0;
            var sample = Math.round(s0 + frac * (s1 - s0));
            output.writeInt16LE(clamp16(sample), i * 2);
        }
        else {
            // Last sample
            output.writeInt16LE(input.readInt16LE(srcIdx), i * 2);
        }
    }
    return output;
}
/**
 * Clamp value to 16-bit signed integer range.
 */
function clamp16(value) {
    return Math.max(-32768, Math.min(32767, value));
}
/**
 * Convert 16-bit PCM to 8-bit mu-law.
 * Standard G.711 mu-law encoding for telephony.
 */
function pcmToMulaw(pcm) {
    var samples = pcm.length / 2;
    var mulaw = Buffer.alloc(samples);
    for (var i = 0; i < samples; i++) {
        var sample = pcm.readInt16LE(i * 2);
        mulaw[i] = linearToMulaw(sample);
    }
    return mulaw;
}
/**
 * Convert a single 16-bit linear sample to 8-bit mu-law.
 * Implements ITU-T G.711 mu-law encoding.
 */
function linearToMulaw(sample) {
    var BIAS = 132;
    var CLIP = 32635;
    // Get sign bit
    var sign = sample < 0 ? 0x80 : 0;
    if (sample < 0) {
        sample = -sample;
    }
    // Clip to prevent overflow
    if (sample > CLIP) {
        sample = CLIP;
    }
    // Add bias and find segment
    sample += BIAS;
    var exponent = 7;
    for (var expMask = 0x4000; (sample & expMask) === 0 && exponent > 0; exponent--, expMask >>= 1) {
        // Find the segment (exponent)
    }
    // Extract mantissa bits
    var mantissa = (sample >> (exponent + 3)) & 0x0f;
    // Combine into mu-law byte (inverted for transmission)
    return ~(sign | (exponent << 4) | mantissa) & 0xff;
}
/**
 * Convert 8-bit mu-law to 16-bit linear PCM.
 * Useful for decoding incoming audio.
 */
function mulawToLinear(mulaw) {
    // mu-law is transmitted inverted
    mulaw = ~mulaw & 0xff;
    var sign = mulaw & 0x80;
    var exponent = (mulaw >> 4) & 0x07;
    var mantissa = mulaw & 0x0f;
    var sample = ((mantissa << 3) + 132) << exponent;
    sample -= 132;
    return sign ? -sample : sample;
}
/**
 * Chunk audio buffer into 20ms frames for streaming.
 * At 8kHz mono, 20ms = 160 samples = 160 bytes (mu-law).
 */
function chunkAudio(audio, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 160; }
    return (function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < audio.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, audio.subarray(i, Math.min(i + chunkSize, audio.length))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += chunkSize;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    })();
}
