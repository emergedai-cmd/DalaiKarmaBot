"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var plivo_js_1 = require("./plivo.js");
(0, vitest_1.describe)("PlivoProvider", function () {
    (0, vitest_1.it)("parses answer callback into call.answered and returns keep-alive XML", function () {
        var _a, _b, _c;
        var provider = new plivo_js_1.PlivoProvider({
            authId: "MA000000000000000000",
            authToken: "test-token",
        });
        var result = provider.parseWebhookEvent({
            headers: { host: "example.com" },
            rawBody: "CallUUID=call-uuid&CallStatus=in-progress&Direction=outbound&From=%2B15550000000&To=%2B15550000001&Event=StartApp",
            url: "https://example.com/voice/webhook?provider=plivo&flow=answer&callId=internal-call-id",
            method: "POST",
            query: { provider: "plivo", flow: "answer", callId: "internal-call-id" },
        });
        (0, vitest_1.expect)(result.events).toHaveLength(1);
        (0, vitest_1.expect)((_a = result.events[0]) === null || _a === void 0 ? void 0 : _a.type).toBe("call.answered");
        (0, vitest_1.expect)((_b = result.events[0]) === null || _b === void 0 ? void 0 : _b.callId).toBe("internal-call-id");
        (0, vitest_1.expect)((_c = result.events[0]) === null || _c === void 0 ? void 0 : _c.providerCallId).toBe("call-uuid");
        (0, vitest_1.expect)(result.providerResponseBody).toContain("<Wait");
        (0, vitest_1.expect)(result.providerResponseBody).toContain('length="300"');
    });
});
