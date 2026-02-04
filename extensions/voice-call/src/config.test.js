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
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
function createBaseConfig(provider) {
    return {
        enabled: true,
        provider: provider,
        fromNumber: "+15550001234",
        inboundPolicy: "disabled",
        allowFrom: [],
        outbound: { defaultMode: "notify", notifyHangupDelaySec: 3 },
        maxDurationSeconds: 300,
        silenceTimeoutMs: 800,
        transcriptTimeoutMs: 180000,
        ringTimeoutMs: 30000,
        maxConcurrentCalls: 1,
        serve: { port: 3334, bind: "127.0.0.1", path: "/voice/webhook" },
        tailscale: { mode: "off", path: "/voice/webhook" },
        tunnel: { provider: "none", allowNgrokFreeTierLoopbackBypass: false },
        streaming: {
            enabled: false,
            sttProvider: "openai-realtime",
            sttModel: "gpt-4o-transcribe",
            silenceDurationMs: 800,
            vadThreshold: 0.5,
            streamPath: "/voice/stream",
        },
        skipSignatureVerification: false,
        stt: { provider: "openai", model: "whisper-1" },
        tts: { provider: "openai", model: "gpt-4o-mini-tts", voice: "coral" },
        responseModel: "openai/gpt-4o-mini",
        responseTimeoutMs: 30000,
    };
}
(0, vitest_1.describe)("validateProviderConfig", function () {
    var originalEnv = __assign({}, process.env);
    (0, vitest_1.beforeEach)(function () {
        // Clear all relevant env vars before each test
        delete process.env.TWILIO_ACCOUNT_SID;
        delete process.env.TWILIO_AUTH_TOKEN;
        delete process.env.TELNYX_API_KEY;
        delete process.env.TELNYX_CONNECTION_ID;
        delete process.env.PLIVO_AUTH_ID;
        delete process.env.PLIVO_AUTH_TOKEN;
    });
    (0, vitest_1.afterEach)(function () {
        // Restore original env
        process.env = __assign({}, originalEnv);
    });
    (0, vitest_1.describe)("twilio provider", function () {
        (0, vitest_1.it)("passes validation when credentials are in config", function () {
            var config = createBaseConfig("twilio");
            config.twilio = { accountSid: "AC123", authToken: "secret" };
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(true);
            (0, vitest_1.expect)(result.errors).toEqual([]);
        });
        (0, vitest_1.it)("passes validation when credentials are in environment variables", function () {
            process.env.TWILIO_ACCOUNT_SID = "AC123";
            process.env.TWILIO_AUTH_TOKEN = "secret";
            var config = createBaseConfig("twilio");
            config = (0, config_js_1.resolveVoiceCallConfig)(config);
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(true);
            (0, vitest_1.expect)(result.errors).toEqual([]);
        });
        (0, vitest_1.it)("passes validation with mixed config and env vars", function () {
            process.env.TWILIO_AUTH_TOKEN = "secret";
            var config = createBaseConfig("twilio");
            config.twilio = { accountSid: "AC123" };
            config = (0, config_js_1.resolveVoiceCallConfig)(config);
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(true);
            (0, vitest_1.expect)(result.errors).toEqual([]);
        });
        (0, vitest_1.it)("fails validation when accountSid is missing everywhere", function () {
            process.env.TWILIO_AUTH_TOKEN = "secret";
            var config = createBaseConfig("twilio");
            config = (0, config_js_1.resolveVoiceCallConfig)(config);
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(false);
            (0, vitest_1.expect)(result.errors).toContain("plugins.entries.voice-call.config.twilio.accountSid is required (or set TWILIO_ACCOUNT_SID env)");
        });
        (0, vitest_1.it)("fails validation when authToken is missing everywhere", function () {
            process.env.TWILIO_ACCOUNT_SID = "AC123";
            var config = createBaseConfig("twilio");
            config = (0, config_js_1.resolveVoiceCallConfig)(config);
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(false);
            (0, vitest_1.expect)(result.errors).toContain("plugins.entries.voice-call.config.twilio.authToken is required (or set TWILIO_AUTH_TOKEN env)");
        });
    });
    (0, vitest_1.describe)("telnyx provider", function () {
        (0, vitest_1.it)("passes validation when credentials are in config", function () {
            var config = createBaseConfig("telnyx");
            config.telnyx = { apiKey: "KEY123", connectionId: "CONN456" };
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(true);
            (0, vitest_1.expect)(result.errors).toEqual([]);
        });
        (0, vitest_1.it)("passes validation when credentials are in environment variables", function () {
            process.env.TELNYX_API_KEY = "KEY123";
            process.env.TELNYX_CONNECTION_ID = "CONN456";
            var config = createBaseConfig("telnyx");
            config = (0, config_js_1.resolveVoiceCallConfig)(config);
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(true);
            (0, vitest_1.expect)(result.errors).toEqual([]);
        });
        (0, vitest_1.it)("fails validation when apiKey is missing everywhere", function () {
            process.env.TELNYX_CONNECTION_ID = "CONN456";
            var config = createBaseConfig("telnyx");
            config = (0, config_js_1.resolveVoiceCallConfig)(config);
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(false);
            (0, vitest_1.expect)(result.errors).toContain("plugins.entries.voice-call.config.telnyx.apiKey is required (or set TELNYX_API_KEY env)");
        });
    });
    (0, vitest_1.describe)("plivo provider", function () {
        (0, vitest_1.it)("passes validation when credentials are in config", function () {
            var config = createBaseConfig("plivo");
            config.plivo = { authId: "MA123", authToken: "secret" };
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(true);
            (0, vitest_1.expect)(result.errors).toEqual([]);
        });
        (0, vitest_1.it)("passes validation when credentials are in environment variables", function () {
            process.env.PLIVO_AUTH_ID = "MA123";
            process.env.PLIVO_AUTH_TOKEN = "secret";
            var config = createBaseConfig("plivo");
            config = (0, config_js_1.resolveVoiceCallConfig)(config);
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(true);
            (0, vitest_1.expect)(result.errors).toEqual([]);
        });
        (0, vitest_1.it)("fails validation when authId is missing everywhere", function () {
            process.env.PLIVO_AUTH_TOKEN = "secret";
            var config = createBaseConfig("plivo");
            config = (0, config_js_1.resolveVoiceCallConfig)(config);
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(false);
            (0, vitest_1.expect)(result.errors).toContain("plugins.entries.voice-call.config.plivo.authId is required (or set PLIVO_AUTH_ID env)");
        });
    });
    (0, vitest_1.describe)("disabled config", function () {
        (0, vitest_1.it)("skips validation when enabled is false", function () {
            var config = createBaseConfig("twilio");
            config.enabled = false;
            var result = (0, config_js_1.validateProviderConfig)(config);
            (0, vitest_1.expect)(result.valid).toBe(true);
            (0, vitest_1.expect)(result.errors).toEqual([]);
        });
    });
});
