"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyNextcloudTalkSignature = verifyNextcloudTalkSignature;
exports.extractNextcloudTalkHeaders = extractNextcloudTalkHeaders;
exports.generateNextcloudTalkSignature = generateNextcloudTalkSignature;
var node_crypto_1 = require("node:crypto");
var SIGNATURE_HEADER = "x-nextcloud-talk-signature";
var RANDOM_HEADER = "x-nextcloud-talk-random";
var BACKEND_HEADER = "x-nextcloud-talk-backend";
/**
 * Verify the HMAC-SHA256 signature of an incoming webhook request.
 * Signature is calculated as: HMAC-SHA256(random + body, secret)
 */
function verifyNextcloudTalkSignature(params) {
    var signature = params.signature, random = params.random, body = params.body, secret = params.secret;
    if (!signature || !random || !secret) {
        return false;
    }
    var expected = (0, node_crypto_1.createHmac)("sha256", secret)
        .update(random + body)
        .digest("hex");
    if (signature.length !== expected.length) {
        return false;
    }
    var result = 0;
    for (var i = 0; i < signature.length; i++) {
        result |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return result === 0;
}
/**
 * Extract webhook headers from an incoming request.
 */
function extractNextcloudTalkHeaders(headers) {
    var getHeader = function (name) {
        var _a;
        var value = (_a = headers[name]) !== null && _a !== void 0 ? _a : headers[name.toLowerCase()];
        return Array.isArray(value) ? value[0] : value;
    };
    var signature = getHeader(SIGNATURE_HEADER);
    var random = getHeader(RANDOM_HEADER);
    var backend = getHeader(BACKEND_HEADER);
    if (!signature || !random || !backend) {
        return null;
    }
    return { signature: signature, random: random, backend: backend };
}
/**
 * Generate signature headers for an outbound request to Nextcloud Talk.
 */
function generateNextcloudTalkSignature(params) {
    var body = params.body, secret = params.secret;
    var random = (0, node_crypto_1.randomBytes)(32).toString("hex");
    var signature = (0, node_crypto_1.createHmac)("sha256", secret)
        .update(random + body)
        .digest("hex");
    return { random: random, signature: signature };
}
