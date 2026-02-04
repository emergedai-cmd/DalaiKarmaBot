"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeWhatsAppMessagingTarget = normalizeWhatsAppMessagingTarget;
exports.looksLikeWhatsAppTargetId = looksLikeWhatsAppTargetId;
var normalize_js_1 = require("../../../whatsapp/normalize.js");
function normalizeWhatsAppMessagingTarget(raw) {
    var _a;
    var trimmed = raw.trim();
    if (!trimmed) {
        return undefined;
    }
    return (_a = (0, normalize_js_1.normalizeWhatsAppTarget)(trimmed)) !== null && _a !== void 0 ? _a : undefined;
}
function looksLikeWhatsAppTargetId(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return false;
    }
    if (/^whatsapp:/i.test(trimmed)) {
        return true;
    }
    if (trimmed.includes("@")) {
        return true;
    }
    return /^\+?\d{3,}$/.test(trimmed);
}
