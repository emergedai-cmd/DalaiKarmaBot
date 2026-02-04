"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickSummaryFromOutput = pickSummaryFromOutput;
exports.pickSummaryFromPayloads = pickSummaryFromPayloads;
exports.pickLastNonEmptyTextFromPayloads = pickLastNonEmptyTextFromPayloads;
exports.isHeartbeatOnlyResponse = isHeartbeatOnlyResponse;
exports.resolveHeartbeatAckMaxChars = resolveHeartbeatAckMaxChars;
var heartbeat_js_1 = require("../../auto-reply/heartbeat.js");
var utils_js_1 = require("../../utils.js");
function pickSummaryFromOutput(text) {
    var clean = (text !== null && text !== void 0 ? text : "").trim();
    if (!clean) {
        return undefined;
    }
    var limit = 2000;
    return clean.length > limit ? "".concat((0, utils_js_1.truncateUtf16Safe)(clean, limit), "\u2026") : clean;
}
function pickSummaryFromPayloads(payloads) {
    var _a;
    for (var i = payloads.length - 1; i >= 0; i--) {
        var summary = pickSummaryFromOutput((_a = payloads[i]) === null || _a === void 0 ? void 0 : _a.text);
        if (summary) {
            return summary;
        }
    }
    return undefined;
}
function pickLastNonEmptyTextFromPayloads(payloads) {
    var _a, _b;
    for (var i = payloads.length - 1; i >= 0; i--) {
        var clean = ((_b = (_a = payloads[i]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "").trim();
        if (clean) {
            return clean;
        }
    }
    return undefined;
}
/**
 * Check if all payloads are just heartbeat ack responses (HEARTBEAT_OK).
 * Returns true if delivery should be skipped because there's no real content.
 */
function isHeartbeatOnlyResponse(payloads, ackMaxChars) {
    if (payloads.length === 0) {
        return true;
    }
    return payloads.every(function (payload) {
        var _a, _b;
        // If there's media, we should deliver regardless of text content.
        var hasMedia = ((_b = (_a = payload.mediaUrls) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0 || Boolean(payload.mediaUrl);
        if (hasMedia) {
            return false;
        }
        // Use heartbeat mode to check if text is just HEARTBEAT_OK or short ack.
        var result = (0, heartbeat_js_1.stripHeartbeatToken)(payload.text, {
            mode: "heartbeat",
            maxAckChars: ackMaxChars,
        });
        return result.shouldSkip;
    });
}
function resolveHeartbeatAckMaxChars(agentCfg) {
    var _a, _b;
    var raw = (_b = (_a = agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.heartbeat) === null || _a === void 0 ? void 0 : _a.ackMaxChars) !== null && _b !== void 0 ? _b : heartbeat_js_1.DEFAULT_HEARTBEAT_ACK_MAX_CHARS;
    return Math.max(0, raw);
}
