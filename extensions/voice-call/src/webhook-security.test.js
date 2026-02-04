"use strict";
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
var node_crypto_1 = require("node:crypto");
var vitest_1 = require("vitest");
var webhook_security_js_1 = require("./webhook-security.js");
function canonicalizeBase64(input) {
    return Buffer.from(input, "base64").toString("base64");
}
function plivoV2Signature(params) {
    var digest = node_crypto_1.default
        .createHmac("sha256", params.authToken)
        .update(params.urlNoQuery + params.nonce)
        .digest("base64");
    return canonicalizeBase64(digest);
}
function plivoV3Signature(params) {
    var _a, _b;
    var u = new URL(params.urlWithQuery);
    var baseNoQuery = "".concat(u.protocol, "//").concat(u.host).concat(u.pathname);
    var queryPairs = [];
    for (var _i = 0, _c = u.searchParams.entries(); _i < _c.length; _i++) {
        var _d = _c[_i], k = _d[0], v = _d[1];
        queryPairs.push([k, v]);
    }
    var queryMap = new Map();
    for (var _e = 0, queryPairs_1 = queryPairs; _e < queryPairs_1.length; _e++) {
        var _f = queryPairs_1[_e], k = _f[0], v = _f[1];
        queryMap.set(k, ((_a = queryMap.get(k)) !== null && _a !== void 0 ? _a : []).concat(v));
    }
    var sortedQuery = Array.from(queryMap.keys())
        .toSorted()
        .flatMap(function (k) { var _a; return __spreadArray([], ((_a = queryMap.get(k)) !== null && _a !== void 0 ? _a : []), true).toSorted().map(function (v) { return "".concat(k, "=").concat(v); }); })
        .join("&");
    var postParams = new URLSearchParams(params.postBody);
    var postMap = new Map();
    for (var _g = 0, _h = postParams.entries(); _g < _h.length; _g++) {
        var _j = _h[_g], k = _j[0], v = _j[1];
        postMap.set(k, ((_b = postMap.get(k)) !== null && _b !== void 0 ? _b : []).concat(v));
    }
    var sortedPost = Array.from(postMap.keys())
        .toSorted()
        .flatMap(function (k) { var _a; return __spreadArray([], ((_a = postMap.get(k)) !== null && _a !== void 0 ? _a : []), true).toSorted().map(function (v) { return "".concat(k).concat(v); }); })
        .join("");
    var hasPost = sortedPost.length > 0;
    var baseUrl = baseNoQuery;
    if (sortedQuery.length > 0 || hasPost) {
        baseUrl = "".concat(baseNoQuery, "?").concat(sortedQuery);
    }
    if (sortedQuery.length > 0 && hasPost) {
        baseUrl = "".concat(baseUrl, ".");
    }
    baseUrl = "".concat(baseUrl).concat(sortedPost);
    var digest = node_crypto_1.default
        .createHmac("sha256", params.authToken)
        .update("".concat(baseUrl, ".").concat(params.nonce))
        .digest("base64");
    return canonicalizeBase64(digest);
}
function twilioSignature(params) {
    var dataToSign = params.url;
    var sortedParams = Array.from(new URLSearchParams(params.postBody).entries()).toSorted(function (a, b) {
        return a[0].localeCompare(b[0]);
    });
    for (var _i = 0, sortedParams_1 = sortedParams; _i < sortedParams_1.length; _i++) {
        var _a = sortedParams_1[_i], key = _a[0], value = _a[1];
        dataToSign += key + value;
    }
    return node_crypto_1.default.createHmac("sha1", params.authToken).update(dataToSign).digest("base64");
}
(0, vitest_1.describe)("verifyPlivoWebhook", function () {
    (0, vitest_1.it)("accepts valid V2 signature", function () {
        var authToken = "test-auth-token";
        var nonce = "nonce-123";
        var ctxUrl = "http://local/voice/webhook?flow=answer&callId=abc";
        var verificationUrl = "https://example.com/voice/webhook";
        var signature = plivoV2Signature({
            authToken: authToken,
            urlNoQuery: verificationUrl,
            nonce: nonce,
        });
        var result = (0, webhook_security_js_1.verifyPlivoWebhook)({
            headers: {
                host: "example.com",
                "x-forwarded-proto": "https",
                "x-plivo-signature-v2": signature,
                "x-plivo-signature-v2-nonce": nonce,
            },
            rawBody: "CallUUID=uuid&CallStatus=in-progress",
            url: ctxUrl,
            method: "POST",
            query: { flow: "answer", callId: "abc" },
        }, authToken);
        (0, vitest_1.expect)(result.ok).toBe(true);
        (0, vitest_1.expect)(result.version).toBe("v2");
    });
    (0, vitest_1.it)("accepts valid V3 signature (including multi-signature header)", function () {
        var authToken = "test-auth-token";
        var nonce = "nonce-456";
        var urlWithQuery = "https://example.com/voice/webhook?flow=answer&callId=abc";
        var postBody = "CallUUID=uuid&CallStatus=in-progress&From=%2B15550000000";
        var good = plivoV3Signature({
            authToken: authToken,
            urlWithQuery: urlWithQuery,
            postBody: postBody,
            nonce: nonce,
        });
        var result = (0, webhook_security_js_1.verifyPlivoWebhook)({
            headers: {
                host: "example.com",
                "x-forwarded-proto": "https",
                "x-plivo-signature-v3": "bad, ".concat(good),
                "x-plivo-signature-v3-nonce": nonce,
            },
            rawBody: postBody,
            url: urlWithQuery,
            method: "POST",
            query: { flow: "answer", callId: "abc" },
        }, authToken);
        (0, vitest_1.expect)(result.ok).toBe(true);
        (0, vitest_1.expect)(result.version).toBe("v3");
    });
    (0, vitest_1.it)("rejects missing signatures", function () {
        var result = (0, webhook_security_js_1.verifyPlivoWebhook)({
            headers: { host: "example.com", "x-forwarded-proto": "https" },
            rawBody: "",
            url: "https://example.com/voice/webhook",
            method: "POST",
        }, "token");
        (0, vitest_1.expect)(result.ok).toBe(false);
        (0, vitest_1.expect)(result.reason).toMatch(/Missing Plivo signature headers/);
    });
});
(0, vitest_1.describe)("verifyTwilioWebhook", function () {
    (0, vitest_1.it)("uses request query when publicUrl omits it", function () {
        var authToken = "test-auth-token";
        var publicUrl = "https://example.com/voice/webhook";
        var urlWithQuery = "".concat(publicUrl, "?callId=abc");
        var postBody = "CallSid=CS123&CallStatus=completed&From=%2B15550000000";
        var signature = twilioSignature({
            authToken: authToken,
            url: urlWithQuery,
            postBody: postBody,
        });
        var result = (0, webhook_security_js_1.verifyTwilioWebhook)({
            headers: {
                host: "example.com",
                "x-forwarded-proto": "https",
                "x-twilio-signature": signature,
            },
            rawBody: postBody,
            url: "http://local/voice/webhook?callId=abc",
            method: "POST",
            query: { callId: "abc" },
        }, authToken, { publicUrl: publicUrl });
        (0, vitest_1.expect)(result.ok).toBe(true);
    });
    (0, vitest_1.it)("rejects invalid signatures even with ngrok free tier enabled", function () {
        var authToken = "test-auth-token";
        var postBody = "CallSid=CS123&CallStatus=completed&From=%2B15550000000";
        var result = (0, webhook_security_js_1.verifyTwilioWebhook)({
            headers: {
                host: "127.0.0.1:3334",
                "x-forwarded-proto": "https",
                "x-forwarded-host": "attacker.ngrok-free.app",
                "x-twilio-signature": "invalid",
            },
            rawBody: postBody,
            url: "http://127.0.0.1:3334/voice/webhook",
            method: "POST",
            remoteAddress: "203.0.113.10",
        }, authToken, { allowNgrokFreeTierLoopbackBypass: true });
        (0, vitest_1.expect)(result.ok).toBe(false);
        (0, vitest_1.expect)(result.isNgrokFreeTier).toBe(true);
        (0, vitest_1.expect)(result.reason).toMatch(/Invalid signature/);
    });
    (0, vitest_1.it)("allows invalid signatures for ngrok free tier only on loopback", function () {
        var authToken = "test-auth-token";
        var postBody = "CallSid=CS123&CallStatus=completed&From=%2B15550000000";
        var result = (0, webhook_security_js_1.verifyTwilioWebhook)({
            headers: {
                host: "127.0.0.1:3334",
                "x-forwarded-proto": "https",
                "x-forwarded-host": "local.ngrok-free.app",
                "x-twilio-signature": "invalid",
            },
            rawBody: postBody,
            url: "http://127.0.0.1:3334/voice/webhook",
            method: "POST",
            remoteAddress: "127.0.0.1",
        }, authToken, { allowNgrokFreeTierLoopbackBypass: true });
        (0, vitest_1.expect)(result.ok).toBe(true);
        (0, vitest_1.expect)(result.isNgrokFreeTier).toBe(true);
        (0, vitest_1.expect)(result.reason).toMatch(/compatibility mode/);
    });
});
