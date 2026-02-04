"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var twilio_js_1 = require("./twilio.js");
var STREAM_URL = "wss://example.ngrok.app/voice/stream";
function createProvider() {
    return new twilio_js_1.TwilioProvider({ accountSid: "AC123", authToken: "secret" }, { publicUrl: "https://example.ngrok.app", streamPath: "/voice/stream" });
}
function createContext(rawBody, query) {
    return {
        headers: {},
        rawBody: rawBody,
        url: "https://example.ngrok.app/voice/twilio",
        method: "POST",
        query: query,
    };
}
(0, vitest_1.describe)("TwilioProvider", function () {
    (0, vitest_1.it)("returns streaming TwiML for outbound conversation calls before in-progress", function () {
        var provider = createProvider();
        var ctx = createContext("CallStatus=initiated&Direction=outbound-api", {
            callId: "call-1",
        });
        var result = provider.parseWebhookEvent(ctx);
        (0, vitest_1.expect)(result.providerResponseBody).toContain(STREAM_URL);
        (0, vitest_1.expect)(result.providerResponseBody).toContain("<Connect>");
    });
    (0, vitest_1.it)("returns empty TwiML for status callbacks", function () {
        var provider = createProvider();
        var ctx = createContext("CallStatus=ringing&Direction=outbound-api", {
            callId: "call-1",
            type: "status",
        });
        var result = provider.parseWebhookEvent(ctx);
        (0, vitest_1.expect)(result.providerResponseBody).toBe('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
    });
    (0, vitest_1.it)("returns streaming TwiML for inbound calls", function () {
        var provider = createProvider();
        var ctx = createContext("CallStatus=ringing&Direction=inbound");
        var result = provider.parseWebhookEvent(ctx);
        (0, vitest_1.expect)(result.providerResponseBody).toContain(STREAM_URL);
        (0, vitest_1.expect)(result.providerResponseBody).toContain("<Connect>");
    });
});
