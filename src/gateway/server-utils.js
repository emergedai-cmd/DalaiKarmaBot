"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeVoiceWakeTriggers = normalizeVoiceWakeTriggers;
exports.formatError = formatError;
var voicewake_js_1 = require("../infra/voicewake.js");
function normalizeVoiceWakeTriggers(input) {
    var raw = Array.isArray(input) ? input : [];
    var cleaned = raw
        .map(function (v) { return (typeof v === "string" ? v.trim() : ""); })
        .filter(function (v) { return v.length > 0; })
        .slice(0, 32)
        .map(function (v) { return v.slice(0, 64); });
    return cleaned.length > 0 ? cleaned : (0, voicewake_js_1.defaultVoiceWakeTriggers)();
}
function formatError(err) {
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === "string") {
        return err;
    }
    var statusValue = err === null || err === void 0 ? void 0 : err.status;
    var codeValue = err === null || err === void 0 ? void 0 : err.code;
    var hasStatus = statusValue !== undefined;
    var hasCode = codeValue !== undefined;
    if (hasStatus || hasCode) {
        var statusText = typeof statusValue === "string" || typeof statusValue === "number"
            ? String(statusValue)
            : "unknown";
        var codeText = typeof codeValue === "string" || typeof codeValue === "number"
            ? String(codeValue)
            : "unknown";
        return "status=".concat(statusText, " code=").concat(codeText);
    }
    try {
        return JSON.stringify(err, null, 2);
    }
    catch (_a) {
        return String(err);
    }
}
