"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDiscordMessagingTarget = normalizeDiscordMessagingTarget;
exports.looksLikeDiscordTargetId = looksLikeDiscordTargetId;
var targets_js_1 = require("../../../discord/targets.js");
function normalizeDiscordMessagingTarget(raw) {
    // Default bare IDs to channels so routing is stable across tool actions.
    var target = (0, targets_js_1.parseDiscordTarget)(raw, { defaultKind: "channel" });
    return target === null || target === void 0 ? void 0 : target.normalized;
}
function looksLikeDiscordTargetId(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return false;
    }
    if (/^<@!?\d+>$/.test(trimmed)) {
        return true;
    }
    if (/^(user|channel|discord):/i.test(trimmed)) {
        return true;
    }
    if (/^\d{6,}$/.test(trimmed)) {
        return true;
    }
    return false;
}
