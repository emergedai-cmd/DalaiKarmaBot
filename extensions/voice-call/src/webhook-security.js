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
exports.validateTwilioSignature = validateTwilioSignature;
exports.reconstructWebhookUrl = reconstructWebhookUrl;
exports.verifyTwilioWebhook = verifyTwilioWebhook;
exports.verifyPlivoWebhook = verifyPlivoWebhook;
var node_crypto_1 = require("node:crypto");
/**
 * Validate Twilio webhook signature using HMAC-SHA1.
 *
 * Twilio signs requests by concatenating the URL with sorted POST params,
 * then computing HMAC-SHA1 with the auth token.
 *
 * @see https://www.twilio.com/docs/usage/webhooks/webhooks-security
 */
function validateTwilioSignature(authToken, signature, url, params) {
    if (!signature) {
        return false;
    }
    // Build the string to sign: URL + sorted params (key+value pairs)
    var dataToSign = url;
    // Sort params alphabetically and append key+value
    var sortedParams = Array.from(params.entries()).toSorted(function (a, b) {
        return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    });
    for (var _i = 0, sortedParams_1 = sortedParams; _i < sortedParams_1.length; _i++) {
        var _a = sortedParams_1[_i], key = _a[0], value = _a[1];
        dataToSign += key + value;
    }
    // HMAC-SHA1 with auth token, then base64 encode
    var expectedSignature = node_crypto_1.default
        .createHmac("sha1", authToken)
        .update(dataToSign)
        .digest("base64");
    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(signature, expectedSignature);
}
/**
 * Timing-safe string comparison to prevent timing attacks.
 */
function timingSafeEqual(a, b) {
    if (a.length !== b.length) {
        // Still do comparison to maintain constant time
        var dummy = Buffer.from(a);
        node_crypto_1.default.timingSafeEqual(dummy, dummy);
        return false;
    }
    var bufA = Buffer.from(a);
    var bufB = Buffer.from(b);
    return node_crypto_1.default.timingSafeEqual(bufA, bufB);
}
/**
 * Reconstruct the public webhook URL from request headers.
 *
 * When behind a reverse proxy (Tailscale, nginx, ngrok), the original URL
 * used by Twilio differs from the local request URL. We use standard
 * forwarding headers to reconstruct it.
 *
 * Priority order:
 * 1. X-Forwarded-Proto + X-Forwarded-Host (standard proxy headers)
 * 2. X-Original-Host (nginx)
 * 3. Ngrok-Forwarded-Host (ngrok specific)
 * 4. Host header (direct connection)
 */
function reconstructWebhookUrl(ctx) {
    var headers = ctx.headers;
    var proto = getHeader(headers, "x-forwarded-proto") || "https";
    var forwardedHost = getHeader(headers, "x-forwarded-host") ||
        getHeader(headers, "x-original-host") ||
        getHeader(headers, "ngrok-forwarded-host") ||
        getHeader(headers, "host") ||
        "";
    // Extract path from the context URL (fallback to "/" on parse failure)
    var path = "/";
    try {
        var parsed = new URL(ctx.url);
        path = parsed.pathname + parsed.search;
    }
    catch (_a) {
        // URL parsing failed
    }
    // Remove port from host (ngrok URLs don't have ports)
    var host = forwardedHost.split(":")[0] || forwardedHost;
    return "".concat(proto, "://").concat(host).concat(path);
}
function buildTwilioVerificationUrl(ctx, publicUrl) {
    if (!publicUrl) {
        return reconstructWebhookUrl(ctx);
    }
    try {
        var base = new URL(publicUrl);
        var requestUrl = new URL(ctx.url);
        base.pathname = requestUrl.pathname;
        base.search = requestUrl.search;
        return base.toString();
    }
    catch (_a) {
        return publicUrl;
    }
}
/**
 * Get a header value, handling both string and string[] types.
 */
function getHeader(headers, name) {
    var value = headers[name.toLowerCase()];
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}
function isLoopbackAddress(address) {
    if (!address) {
        return false;
    }
    if (address === "127.0.0.1" || address === "::1") {
        return true;
    }
    if (address.startsWith("::ffff:127.")) {
        return true;
    }
    return false;
}
/**
 * Verify Twilio webhook with full context and detailed result.
 *
 * Handles the special case of ngrok free tier where signature validation
 * may fail due to URL discrepancies (ngrok adds interstitial page handling).
 */
function verifyTwilioWebhook(ctx, authToken, options) {
    // Allow skipping verification for development/testing
    if (options === null || options === void 0 ? void 0 : options.skipVerification) {
        return { ok: true, reason: "verification skipped (dev mode)" };
    }
    var signature = getHeader(ctx.headers, "x-twilio-signature");
    if (!signature) {
        return { ok: false, reason: "Missing X-Twilio-Signature header" };
    }
    // Reconstruct the URL Twilio used
    var verificationUrl = buildTwilioVerificationUrl(ctx, options === null || options === void 0 ? void 0 : options.publicUrl);
    // Parse the body as URL-encoded params
    var params = new URLSearchParams(ctx.rawBody);
    // Validate signature
    var isValid = validateTwilioSignature(authToken, signature, verificationUrl, params);
    if (isValid) {
        return { ok: true, verificationUrl: verificationUrl };
    }
    // Check if this is ngrok free tier - the URL might have different format
    var isNgrokFreeTier = verificationUrl.includes(".ngrok-free.app") || verificationUrl.includes(".ngrok.io");
    if (isNgrokFreeTier &&
        (options === null || options === void 0 ? void 0 : options.allowNgrokFreeTierLoopbackBypass) &&
        isLoopbackAddress(ctx.remoteAddress)) {
        console.warn("[voice-call] Twilio signature validation failed (ngrok free tier compatibility, loopback only)");
        return {
            ok: true,
            reason: "ngrok free tier compatibility mode (loopback only)",
            verificationUrl: verificationUrl,
            isNgrokFreeTier: true,
        };
    }
    return {
        ok: false,
        reason: "Invalid signature for URL: ".concat(verificationUrl),
        verificationUrl: verificationUrl,
        isNgrokFreeTier: isNgrokFreeTier,
    };
}
function normalizeSignatureBase64(input) {
    // Canonicalize base64 to match Plivo SDK behavior (decode then re-encode).
    return Buffer.from(input, "base64").toString("base64");
}
function getBaseUrlNoQuery(url) {
    var u = new URL(url);
    return "".concat(u.protocol, "//").concat(u.host).concat(u.pathname);
}
function timingSafeEqualString(a, b) {
    if (a.length !== b.length) {
        var dummy = Buffer.from(a);
        node_crypto_1.default.timingSafeEqual(dummy, dummy);
        return false;
    }
    return node_crypto_1.default.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
function validatePlivoV2Signature(params) {
    var baseUrl = getBaseUrlNoQuery(params.url);
    var digest = node_crypto_1.default
        .createHmac("sha256", params.authToken)
        .update(baseUrl + params.nonce)
        .digest("base64");
    var expected = normalizeSignatureBase64(digest);
    var provided = normalizeSignatureBase64(params.signature);
    return timingSafeEqualString(expected, provided);
}
function toParamMapFromSearchParams(sp) {
    var map = {};
    for (var _i = 0, _a = sp.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (!map[key]) {
            map[key] = [];
        }
        map[key].push(value);
    }
    return map;
}
function sortedQueryString(params) {
    var parts = [];
    for (var _i = 0, _a = Object.keys(params).toSorted(); _i < _a.length; _i++) {
        var key = _a[_i];
        var values = __spreadArray([], params[key], true).toSorted();
        for (var _b = 0, values_1 = values; _b < values_1.length; _b++) {
            var value = values_1[_b];
            parts.push("".concat(key, "=").concat(value));
        }
    }
    return parts.join("&");
}
function sortedParamsString(params) {
    var parts = [];
    for (var _i = 0, _a = Object.keys(params).toSorted(); _i < _a.length; _i++) {
        var key = _a[_i];
        var values = __spreadArray([], params[key], true).toSorted();
        for (var _b = 0, values_2 = values; _b < values_2.length; _b++) {
            var value = values_2[_b];
            parts.push("".concat(key).concat(value));
        }
    }
    return parts.join("");
}
function constructPlivoV3BaseUrl(params) {
    var hasPostParams = Object.keys(params.postParams).length > 0;
    var u = new URL(params.url);
    var baseNoQuery = "".concat(u.protocol, "//").concat(u.host).concat(u.pathname);
    var queryMap = toParamMapFromSearchParams(u.searchParams);
    var queryString = sortedQueryString(queryMap);
    // In the Plivo V3 algorithm, the query portion is always sorted, and if we
    // have POST params we add a '.' separator after the query string.
    var baseUrl = baseNoQuery;
    if (queryString.length > 0 || hasPostParams) {
        baseUrl = "".concat(baseNoQuery, "?").concat(queryString);
    }
    if (queryString.length > 0 && hasPostParams) {
        baseUrl = "".concat(baseUrl, ".");
    }
    if (params.method === "GET") {
        return baseUrl;
    }
    return baseUrl + sortedParamsString(params.postParams);
}
function validatePlivoV3Signature(params) {
    var baseUrl = constructPlivoV3BaseUrl({
        method: params.method,
        url: params.url,
        postParams: params.postParams,
    });
    var hmacBase = "".concat(baseUrl, ".").concat(params.nonce);
    var digest = node_crypto_1.default.createHmac("sha256", params.authToken).update(hmacBase).digest("base64");
    var expected = normalizeSignatureBase64(digest);
    // Header can contain multiple signatures separated by commas.
    var provided = params.signatureHeader
        .split(",")
        .map(function (s) { return s.trim(); })
        .filter(Boolean)
        .map(function (s) { return normalizeSignatureBase64(s); });
    for (var _i = 0, provided_1 = provided; _i < provided_1.length; _i++) {
        var sig = provided_1[_i];
        if (timingSafeEqualString(expected, sig)) {
            return true;
        }
    }
    return false;
}
/**
 * Verify Plivo webhooks using V3 signature if present; fall back to V2.
 *
 * Header names (case-insensitive; Node provides lower-case keys):
 * - V3: X-Plivo-Signature-V3 / X-Plivo-Signature-V3-Nonce
 * - V2: X-Plivo-Signature-V2 / X-Plivo-Signature-V2-Nonce
 */
function verifyPlivoWebhook(ctx, authToken, options) {
    if (options === null || options === void 0 ? void 0 : options.skipVerification) {
        return { ok: true, reason: "verification skipped (dev mode)" };
    }
    var signatureV3 = getHeader(ctx.headers, "x-plivo-signature-v3");
    var nonceV3 = getHeader(ctx.headers, "x-plivo-signature-v3-nonce");
    var signatureV2 = getHeader(ctx.headers, "x-plivo-signature-v2");
    var nonceV2 = getHeader(ctx.headers, "x-plivo-signature-v2-nonce");
    var reconstructed = reconstructWebhookUrl(ctx);
    var verificationUrl = reconstructed;
    if (options === null || options === void 0 ? void 0 : options.publicUrl) {
        try {
            var req = new URL(reconstructed);
            var base = new URL(options.publicUrl);
            base.pathname = req.pathname;
            base.search = req.search;
            verificationUrl = base.toString();
        }
        catch (_a) {
            verificationUrl = reconstructed;
        }
    }
    if (signatureV3 && nonceV3) {
        var method = ctx.method === "GET" || ctx.method === "POST" ? ctx.method : null;
        if (!method) {
            return {
                ok: false,
                version: "v3",
                verificationUrl: verificationUrl,
                reason: "Unsupported HTTP method for Plivo V3 signature: ".concat(ctx.method),
            };
        }
        var postParams = toParamMapFromSearchParams(new URLSearchParams(ctx.rawBody));
        var ok = validatePlivoV3Signature({
            authToken: authToken,
            signatureHeader: signatureV3,
            nonce: nonceV3,
            method: method,
            url: verificationUrl,
            postParams: postParams,
        });
        return ok
            ? { ok: true, version: "v3", verificationUrl: verificationUrl }
            : {
                ok: false,
                version: "v3",
                verificationUrl: verificationUrl,
                reason: "Invalid Plivo V3 signature",
            };
    }
    if (signatureV2 && nonceV2) {
        var ok = validatePlivoV2Signature({
            authToken: authToken,
            signature: signatureV2,
            nonce: nonceV2,
            url: verificationUrl,
        });
        return ok
            ? { ok: true, version: "v2", verificationUrl: verificationUrl }
            : {
                ok: false,
                version: "v2",
                verificationUrl: verificationUrl,
                reason: "Invalid Plivo V2 signature",
            };
    }
    return {
        ok: false,
        reason: "Missing Plivo signature headers (V3 or V2)",
        verificationUrl: verificationUrl,
    };
}
