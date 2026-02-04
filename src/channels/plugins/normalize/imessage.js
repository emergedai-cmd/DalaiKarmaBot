"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeIMessageMessagingTarget = normalizeIMessageMessagingTarget;
exports.looksLikeIMessageTargetId = looksLikeIMessageTargetId;
var targets_js_1 = require("../../../imessage/targets.js");
// Service prefixes that indicate explicit delivery method; must be preserved during normalization
var SERVICE_PREFIXES = ["imessage:", "sms:", "auto:"];
var CHAT_TARGET_PREFIX_RE = /^(chat_id:|chatid:|chat:|chat_guid:|chatguid:|guid:|chat_identifier:|chatidentifier:|chatident:)/i;
function normalizeIMessageMessagingTarget(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    // Preserve service prefix if present (e.g., "sms:+1555" → "sms:+15551234567")
    var lower = trimmed.toLowerCase();
    for (var _i = 0, SERVICE_PREFIXES_1 = SERVICE_PREFIXES; _i < SERVICE_PREFIXES_1.length; _i++) {
        var prefix = SERVICE_PREFIXES_1[_i];
        if (lower.startsWith(prefix)) {
            var remainder = trimmed.slice(prefix.length).trim();
            var normalizedHandle = (0, targets_js_1.normalizeIMessageHandle)(remainder);
            if (!normalizedHandle) {
                return undefined;
            }
            if (CHAT_TARGET_PREFIX_RE.test(normalizedHandle)) {
                return normalizedHandle;
            }
            return "".concat(prefix).concat(normalizedHandle);
        }
    }
    var normalized = (0, targets_js_1.normalizeIMessageHandle)(trimmed);
    return normalized || undefined;
}
function looksLikeIMessageTargetId(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return false;
    }
    if (/^(imessage:|sms:|auto:)/i.test(trimmed)) {
        return true;
    }
    if (CHAT_TARGET_PREFIX_RE.test(trimmed)) {
        return true;
    }
    if (trimmed.includes("@")) {
        return true;
    }
    return /^\+?\d{3,}$/.test(trimmed);
}
