"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceCallConfigSchema = exports.VoiceCallStreamingConfigSchema = exports.OutboundConfigSchema = exports.CallModeSchema = exports.VoiceCallTunnelConfigSchema = exports.VoiceCallTailscaleConfigSchema = exports.VoiceCallServeConfigSchema = exports.TtsConfigSchema = exports.TtsAutoSchema = exports.TtsModeSchema = exports.TtsProviderSchema = exports.SttConfigSchema = exports.PlivoConfigSchema = exports.TwilioConfigSchema = exports.TelnyxConfigSchema = exports.InboundPolicySchema = exports.E164Schema = void 0;
exports.resolveVoiceCallConfig = resolveVoiceCallConfig;
exports.validateProviderConfig = validateProviderConfig;
var zod_1 = require("zod");
// -----------------------------------------------------------------------------
// Phone Number Validation
// -----------------------------------------------------------------------------
/**
 * E.164 phone number format: +[country code][number]
 * Examples use 555 prefix (reserved for fictional numbers)
 */
exports.E164Schema = zod_1.z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, "Expected E.164 format, e.g. +15550001234");
// -----------------------------------------------------------------------------
// Inbound Policy
// -----------------------------------------------------------------------------
/**
 * Controls how inbound calls are handled:
 * - "disabled": Block all inbound calls (outbound only)
 * - "allowlist": Only accept calls from numbers in allowFrom
 * - "pairing": Unknown callers can request pairing (future)
 * - "open": Accept all inbound calls (dangerous!)
 */
exports.InboundPolicySchema = zod_1.z.enum(["disabled", "allowlist", "pairing", "open"]);
// -----------------------------------------------------------------------------
// Provider-Specific Configuration
// -----------------------------------------------------------------------------
exports.TelnyxConfigSchema = zod_1.z
    .object({
    /** Telnyx API v2 key */
    apiKey: zod_1.z.string().min(1).optional(),
    /** Telnyx connection ID (from Call Control app) */
    connectionId: zod_1.z.string().min(1).optional(),
    /** Public key for webhook signature verification */
    publicKey: zod_1.z.string().min(1).optional(),
})
    .strict();
exports.TwilioConfigSchema = zod_1.z
    .object({
    /** Twilio Account SID */
    accountSid: zod_1.z.string().min(1).optional(),
    /** Twilio Auth Token */
    authToken: zod_1.z.string().min(1).optional(),
})
    .strict();
exports.PlivoConfigSchema = zod_1.z
    .object({
    /** Plivo Auth ID (starts with MA/SA) */
    authId: zod_1.z.string().min(1).optional(),
    /** Plivo Auth Token */
    authToken: zod_1.z.string().min(1).optional(),
})
    .strict();
// -----------------------------------------------------------------------------
// STT/TTS Configuration
// -----------------------------------------------------------------------------
exports.SttConfigSchema = zod_1.z
    .object({
    /** STT provider (currently only OpenAI supported) */
    provider: zod_1.z.literal("openai").default("openai"),
    /** Whisper model to use */
    model: zod_1.z.string().min(1).default("whisper-1"),
})
    .strict()
    .default({ provider: "openai", model: "whisper-1" });
exports.TtsProviderSchema = zod_1.z.enum(["openai", "elevenlabs", "edge"]);
exports.TtsModeSchema = zod_1.z.enum(["final", "all"]);
exports.TtsAutoSchema = zod_1.z.enum(["off", "always", "inbound", "tagged"]);
exports.TtsConfigSchema = zod_1.z
    .object({
    auto: exports.TtsAutoSchema.optional(),
    enabled: zod_1.z.boolean().optional(),
    mode: exports.TtsModeSchema.optional(),
    provider: exports.TtsProviderSchema.optional(),
    summaryModel: zod_1.z.string().optional(),
    modelOverrides: zod_1.z
        .object({
        enabled: zod_1.z.boolean().optional(),
        allowText: zod_1.z.boolean().optional(),
        allowProvider: zod_1.z.boolean().optional(),
        allowVoice: zod_1.z.boolean().optional(),
        allowModelId: zod_1.z.boolean().optional(),
        allowVoiceSettings: zod_1.z.boolean().optional(),
        allowNormalization: zod_1.z.boolean().optional(),
        allowSeed: zod_1.z.boolean().optional(),
    })
        .strict()
        .optional(),
    elevenlabs: zod_1.z
        .object({
        apiKey: zod_1.z.string().optional(),
        baseUrl: zod_1.z.string().optional(),
        voiceId: zod_1.z.string().optional(),
        modelId: zod_1.z.string().optional(),
        seed: zod_1.z.number().int().min(0).max(4294967295).optional(),
        applyTextNormalization: zod_1.z.enum(["auto", "on", "off"]).optional(),
        languageCode: zod_1.z.string().optional(),
        voiceSettings: zod_1.z
            .object({
            stability: zod_1.z.number().min(0).max(1).optional(),
            similarityBoost: zod_1.z.number().min(0).max(1).optional(),
            style: zod_1.z.number().min(0).max(1).optional(),
            useSpeakerBoost: zod_1.z.boolean().optional(),
            speed: zod_1.z.number().min(0.5).max(2).optional(),
        })
            .strict()
            .optional(),
    })
        .strict()
        .optional(),
    openai: zod_1.z
        .object({
        apiKey: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        voice: zod_1.z.string().optional(),
    })
        .strict()
        .optional(),
    edge: zod_1.z
        .object({
        enabled: zod_1.z.boolean().optional(),
        voice: zod_1.z.string().optional(),
        lang: zod_1.z.string().optional(),
        outputFormat: zod_1.z.string().optional(),
        pitch: zod_1.z.string().optional(),
        rate: zod_1.z.string().optional(),
        volume: zod_1.z.string().optional(),
        saveSubtitles: zod_1.z.boolean().optional(),
        proxy: zod_1.z.string().optional(),
        timeoutMs: zod_1.z.number().int().min(1000).max(120000).optional(),
    })
        .strict()
        .optional(),
    prefsPath: zod_1.z.string().optional(),
    maxTextLength: zod_1.z.number().int().min(1).optional(),
    timeoutMs: zod_1.z.number().int().min(1000).max(120000).optional(),
})
    .strict()
    .optional();
// -----------------------------------------------------------------------------
// Webhook Server Configuration
// -----------------------------------------------------------------------------
exports.VoiceCallServeConfigSchema = zod_1.z
    .object({
    /** Port to listen on */
    port: zod_1.z.number().int().positive().default(3334),
    /** Bind address */
    bind: zod_1.z.string().default("127.0.0.1"),
    /** Webhook path */
    path: zod_1.z.string().min(1).default("/voice/webhook"),
})
    .strict()
    .default({ port: 3334, bind: "127.0.0.1", path: "/voice/webhook" });
exports.VoiceCallTailscaleConfigSchema = zod_1.z
    .object({
    /**
     * Tailscale exposure mode:
     * - "off": No Tailscale exposure
     * - "serve": Tailscale serve (private to tailnet)
     * - "funnel": Tailscale funnel (public HTTPS)
     */
    mode: zod_1.z.enum(["off", "serve", "funnel"]).default("off"),
    /** Path for Tailscale serve/funnel (should usually match serve.path) */
    path: zod_1.z.string().min(1).default("/voice/webhook"),
})
    .strict()
    .default({ mode: "off", path: "/voice/webhook" });
// -----------------------------------------------------------------------------
// Tunnel Configuration (unified ngrok/tailscale)
// -----------------------------------------------------------------------------
exports.VoiceCallTunnelConfigSchema = zod_1.z
    .object({
    /**
     * Tunnel provider:
     * - "none": No tunnel (use publicUrl if set, or manual setup)
     * - "ngrok": Use ngrok for public HTTPS tunnel
     * - "tailscale-serve": Tailscale serve (private to tailnet)
     * - "tailscale-funnel": Tailscale funnel (public HTTPS)
     */
    provider: zod_1.z.enum(["none", "ngrok", "tailscale-serve", "tailscale-funnel"]).default("none"),
    /** ngrok auth token (optional, enables longer sessions and more features) */
    ngrokAuthToken: zod_1.z.string().min(1).optional(),
    /** ngrok custom domain (paid feature, e.g., "myapp.ngrok.io") */
    ngrokDomain: zod_1.z.string().min(1).optional(),
    /**
     * Allow ngrok free tier compatibility mode.
     * When true, signature verification failures on ngrok-free.app URLs
     * will be allowed only for loopback requests (ngrok local agent).
     */
    allowNgrokFreeTierLoopbackBypass: zod_1.z.boolean().default(false),
    /**
     * Legacy ngrok free tier compatibility mode (deprecated).
     * Use allowNgrokFreeTierLoopbackBypass instead.
     */
    allowNgrokFreeTier: zod_1.z.boolean().optional(),
})
    .strict()
    .default({ provider: "none", allowNgrokFreeTierLoopbackBypass: false });
// -----------------------------------------------------------------------------
// Outbound Call Configuration
// -----------------------------------------------------------------------------
/**
 * Call mode determines how outbound calls behave:
 * - "notify": Deliver message and auto-hangup after delay (one-way notification)
 * - "conversation": Stay open for back-and-forth until explicit end or timeout
 */
exports.CallModeSchema = zod_1.z.enum(["notify", "conversation"]);
exports.OutboundConfigSchema = zod_1.z
    .object({
    /** Default call mode for outbound calls */
    defaultMode: exports.CallModeSchema.default("notify"),
    /** Seconds to wait after TTS before auto-hangup in notify mode */
    notifyHangupDelaySec: zod_1.z.number().int().nonnegative().default(3),
})
    .strict()
    .default({ defaultMode: "notify", notifyHangupDelaySec: 3 });
// -----------------------------------------------------------------------------
// Streaming Configuration (OpenAI Realtime STT)
// -----------------------------------------------------------------------------
exports.VoiceCallStreamingConfigSchema = zod_1.z
    .object({
    /** Enable real-time audio streaming (requires WebSocket support) */
    enabled: zod_1.z.boolean().default(false),
    /** STT provider for real-time transcription */
    sttProvider: zod_1.z.enum(["openai-realtime"]).default("openai-realtime"),
    /** OpenAI API key for Realtime API (uses OPENAI_API_KEY env if not set) */
    openaiApiKey: zod_1.z.string().min(1).optional(),
    /** OpenAI transcription model (default: gpt-4o-transcribe) */
    sttModel: zod_1.z.string().min(1).default("gpt-4o-transcribe"),
    /** VAD silence duration in ms before considering speech ended */
    silenceDurationMs: zod_1.z.number().int().positive().default(800),
    /** VAD threshold 0-1 (higher = less sensitive) */
    vadThreshold: zod_1.z.number().min(0).max(1).default(0.5),
    /** WebSocket path for media stream connections */
    streamPath: zod_1.z.string().min(1).default("/voice/stream"),
})
    .strict()
    .default({
    enabled: false,
    sttProvider: "openai-realtime",
    sttModel: "gpt-4o-transcribe",
    silenceDurationMs: 800,
    vadThreshold: 0.5,
    streamPath: "/voice/stream",
});
// -----------------------------------------------------------------------------
// Main Voice Call Configuration
// -----------------------------------------------------------------------------
exports.VoiceCallConfigSchema = zod_1.z
    .object({
    /** Enable voice call functionality */
    enabled: zod_1.z.boolean().default(false),
    /** Active provider (telnyx, twilio, plivo, or mock) */
    provider: zod_1.z.enum(["telnyx", "twilio", "plivo", "mock"]).optional(),
    /** Telnyx-specific configuration */
    telnyx: exports.TelnyxConfigSchema.optional(),
    /** Twilio-specific configuration */
    twilio: exports.TwilioConfigSchema.optional(),
    /** Plivo-specific configuration */
    plivo: exports.PlivoConfigSchema.optional(),
    /** Phone number to call from (E.164) */
    fromNumber: exports.E164Schema.optional(),
    /** Default phone number to call (E.164) */
    toNumber: exports.E164Schema.optional(),
    /** Inbound call policy */
    inboundPolicy: exports.InboundPolicySchema.default("disabled"),
    /** Allowlist of phone numbers for inbound calls (E.164) */
    allowFrom: zod_1.z.array(exports.E164Schema).default([]),
    /** Greeting message for inbound calls */
    inboundGreeting: zod_1.z.string().optional(),
    /** Outbound call configuration */
    outbound: exports.OutboundConfigSchema,
    /** Maximum call duration in seconds */
    maxDurationSeconds: zod_1.z.number().int().positive().default(300),
    /** Silence timeout for end-of-speech detection (ms) */
    silenceTimeoutMs: zod_1.z.number().int().positive().default(800),
    /** Timeout for user transcript (ms) */
    transcriptTimeoutMs: zod_1.z.number().int().positive().default(180000),
    /** Ring timeout for outbound calls (ms) */
    ringTimeoutMs: zod_1.z.number().int().positive().default(30000),
    /** Maximum concurrent calls */
    maxConcurrentCalls: zod_1.z.number().int().positive().default(1),
    /** Webhook server configuration */
    serve: exports.VoiceCallServeConfigSchema,
    /** Tailscale exposure configuration (legacy, prefer tunnel config) */
    tailscale: exports.VoiceCallTailscaleConfigSchema,
    /** Tunnel configuration (unified ngrok/tailscale) */
    tunnel: exports.VoiceCallTunnelConfigSchema,
    /** Real-time audio streaming configuration */
    streaming: exports.VoiceCallStreamingConfigSchema,
    /** Public webhook URL override (if set, bypasses tunnel auto-detection) */
    publicUrl: zod_1.z.string().url().optional(),
    /** Skip webhook signature verification (development only, NOT for production) */
    skipSignatureVerification: zod_1.z.boolean().default(false),
    /** STT configuration */
    stt: exports.SttConfigSchema,
    /** TTS override (deep-merges with core messages.tts) */
    tts: exports.TtsConfigSchema,
    /** Store path for call logs */
    store: zod_1.z.string().optional(),
    /** Model for generating voice responses (e.g., "anthropic/claude-sonnet-4", "openai/gpt-4o") */
    responseModel: zod_1.z.string().default("openai/gpt-4o-mini"),
    /** System prompt for voice responses */
    responseSystemPrompt: zod_1.z.string().optional(),
    /** Timeout for response generation in ms (default 30s) */
    responseTimeoutMs: zod_1.z.number().int().positive().default(30000),
})
    .strict();
// -----------------------------------------------------------------------------
// Configuration Helpers
// -----------------------------------------------------------------------------
/**
 * Resolves the configuration by merging environment variables into missing fields.
 * Returns a new configuration object with environment variables applied.
 */
function resolveVoiceCallConfig(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var resolved = JSON.parse(JSON.stringify(config));
    // Telnyx
    if (resolved.provider === "telnyx") {
        resolved.telnyx = (_a = resolved.telnyx) !== null && _a !== void 0 ? _a : {};
        resolved.telnyx.apiKey = (_b = resolved.telnyx.apiKey) !== null && _b !== void 0 ? _b : process.env.TELNYX_API_KEY;
        resolved.telnyx.connectionId = (_c = resolved.telnyx.connectionId) !== null && _c !== void 0 ? _c : process.env.TELNYX_CONNECTION_ID;
        resolved.telnyx.publicKey = (_d = resolved.telnyx.publicKey) !== null && _d !== void 0 ? _d : process.env.TELNYX_PUBLIC_KEY;
    }
    // Twilio
    if (resolved.provider === "twilio") {
        resolved.twilio = (_e = resolved.twilio) !== null && _e !== void 0 ? _e : {};
        resolved.twilio.accountSid = (_f = resolved.twilio.accountSid) !== null && _f !== void 0 ? _f : process.env.TWILIO_ACCOUNT_SID;
        resolved.twilio.authToken = (_g = resolved.twilio.authToken) !== null && _g !== void 0 ? _g : process.env.TWILIO_AUTH_TOKEN;
    }
    // Plivo
    if (resolved.provider === "plivo") {
        resolved.plivo = (_h = resolved.plivo) !== null && _h !== void 0 ? _h : {};
        resolved.plivo.authId = (_j = resolved.plivo.authId) !== null && _j !== void 0 ? _j : process.env.PLIVO_AUTH_ID;
        resolved.plivo.authToken = (_k = resolved.plivo.authToken) !== null && _k !== void 0 ? _k : process.env.PLIVO_AUTH_TOKEN;
    }
    // Tunnel Config
    resolved.tunnel = (_l = resolved.tunnel) !== null && _l !== void 0 ? _l : {
        provider: "none",
        allowNgrokFreeTierLoopbackBypass: false,
    };
    resolved.tunnel.allowNgrokFreeTierLoopbackBypass =
        resolved.tunnel.allowNgrokFreeTierLoopbackBypass || resolved.tunnel.allowNgrokFreeTier || false;
    resolved.tunnel.ngrokAuthToken = (_m = resolved.tunnel.ngrokAuthToken) !== null && _m !== void 0 ? _m : process.env.NGROK_AUTHTOKEN;
    resolved.tunnel.ngrokDomain = (_o = resolved.tunnel.ngrokDomain) !== null && _o !== void 0 ? _o : process.env.NGROK_DOMAIN;
    return resolved;
}
/**
 * Validate that the configuration has all required fields for the selected provider.
 */
function validateProviderConfig(config) {
    var _a, _b, _c, _d, _e, _f;
    var errors = [];
    if (!config.enabled) {
        return { valid: true, errors: [] };
    }
    if (!config.provider) {
        errors.push("plugins.entries.voice-call.config.provider is required");
    }
    if (!config.fromNumber && config.provider !== "mock") {
        errors.push("plugins.entries.voice-call.config.fromNumber is required");
    }
    if (config.provider === "telnyx") {
        if (!((_a = config.telnyx) === null || _a === void 0 ? void 0 : _a.apiKey)) {
            errors.push("plugins.entries.voice-call.config.telnyx.apiKey is required (or set TELNYX_API_KEY env)");
        }
        if (!((_b = config.telnyx) === null || _b === void 0 ? void 0 : _b.connectionId)) {
            errors.push("plugins.entries.voice-call.config.telnyx.connectionId is required (or set TELNYX_CONNECTION_ID env)");
        }
    }
    if (config.provider === "twilio") {
        if (!((_c = config.twilio) === null || _c === void 0 ? void 0 : _c.accountSid)) {
            errors.push("plugins.entries.voice-call.config.twilio.accountSid is required (or set TWILIO_ACCOUNT_SID env)");
        }
        if (!((_d = config.twilio) === null || _d === void 0 ? void 0 : _d.authToken)) {
            errors.push("plugins.entries.voice-call.config.twilio.authToken is required (or set TWILIO_AUTH_TOKEN env)");
        }
    }
    if (config.provider === "plivo") {
        if (!((_e = config.plivo) === null || _e === void 0 ? void 0 : _e.authId)) {
            errors.push("plugins.entries.voice-call.config.plivo.authId is required (or set PLIVO_AUTH_ID env)");
        }
        if (!((_f = config.plivo) === null || _f === void 0 ? void 0 : _f.authToken)) {
            errors.push("plugins.entries.voice-call.config.plivo.authToken is required (or set PLIVO_AUTH_TOKEN env)");
        }
    }
    return { valid: errors.length === 0, errors: errors };
}
