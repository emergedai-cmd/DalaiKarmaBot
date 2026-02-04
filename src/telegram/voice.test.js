"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var voice_js_1 = require("./voice.js");
(0, vitest_1.describe)("resolveTelegramVoiceSend", function () {
    (0, vitest_1.it)("skips voice when wantsVoice is false", function () {
        var logFallback = vitest_1.vi.fn();
        var result = (0, voice_js_1.resolveTelegramVoiceSend)({
            wantsVoice: false,
            contentType: "audio/ogg",
            fileName: "voice.ogg",
            logFallback: logFallback,
        });
        (0, vitest_1.expect)(result.useVoice).toBe(false);
        (0, vitest_1.expect)(logFallback).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("logs fallback for incompatible media", function () {
        var logFallback = vitest_1.vi.fn();
        var result = (0, voice_js_1.resolveTelegramVoiceSend)({
            wantsVoice: true,
            contentType: "audio/mpeg",
            fileName: "track.mp3",
            logFallback: logFallback,
        });
        (0, vitest_1.expect)(result.useVoice).toBe(false);
        (0, vitest_1.expect)(logFallback).toHaveBeenCalledWith("Telegram voice requested but media is audio/mpeg (track.mp3); sending as audio file instead.");
    });
    (0, vitest_1.it)("keeps voice when compatible", function () {
        var logFallback = vitest_1.vi.fn();
        var result = (0, voice_js_1.resolveTelegramVoiceSend)({
            wantsVoice: true,
            contentType: "audio/ogg",
            fileName: "voice.ogg",
            logFallback: logFallback,
        });
        (0, vitest_1.expect)(result.useVoice).toBe(true);
        (0, vitest_1.expect)(logFallback).not.toHaveBeenCalled();
    });
});
