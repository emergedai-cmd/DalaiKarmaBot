"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var parse_js_1 = require("./parse.js");
(0, vitest_1.describe)("splitMediaFromOutput", function () {
    (0, vitest_1.it)("detects audio_as_voice tag and strips it", function () {
        var result = (0, parse_js_1.splitMediaFromOutput)("Hello [[audio_as_voice]] world");
        (0, vitest_1.expect)(result.audioAsVoice).toBe(true);
        (0, vitest_1.expect)(result.text).toBe("Hello world");
    });
    (0, vitest_1.it)("rejects absolute media paths to prevent LFI", function () {
        var result = (0, parse_js_1.splitMediaFromOutput)("MEDIA:/Users/pete/My File.png");
        (0, vitest_1.expect)(result.mediaUrls).toBeUndefined();
        (0, vitest_1.expect)(result.text).toBe("MEDIA:/Users/pete/My File.png");
    });
    (0, vitest_1.it)("rejects quoted absolute media paths to prevent LFI", function () {
        var result = (0, parse_js_1.splitMediaFromOutput)('MEDIA:"/Users/pete/My File.png"');
        (0, vitest_1.expect)(result.mediaUrls).toBeUndefined();
        (0, vitest_1.expect)(result.text).toBe('MEDIA:"/Users/pete/My File.png"');
    });
    (0, vitest_1.it)("rejects tilde media paths to prevent LFI", function () {
        var result = (0, parse_js_1.splitMediaFromOutput)("MEDIA:~/Pictures/My File.png");
        (0, vitest_1.expect)(result.mediaUrls).toBeUndefined();
        (0, vitest_1.expect)(result.text).toBe("MEDIA:~/Pictures/My File.png");
    });
    (0, vitest_1.it)("rejects directory traversal media paths to prevent LFI", function () {
        var result = (0, parse_js_1.splitMediaFromOutput)("MEDIA:../../etc/passwd");
        (0, vitest_1.expect)(result.mediaUrls).toBeUndefined();
        (0, vitest_1.expect)(result.text).toBe("MEDIA:../../etc/passwd");
    });
    (0, vitest_1.it)("captures safe relative media paths", function () {
        var result = (0, parse_js_1.splitMediaFromOutput)("MEDIA:./screenshots/image.png");
        (0, vitest_1.expect)(result.mediaUrls).toEqual(["./screenshots/image.png"]);
        (0, vitest_1.expect)(result.text).toBe("");
    });
    (0, vitest_1.it)("keeps audio_as_voice detection stable across calls", function () {
        var input = "Hello [[audio_as_voice]]";
        var first = (0, parse_js_1.splitMediaFromOutput)(input);
        var second = (0, parse_js_1.splitMediaFromOutput)(input);
        (0, vitest_1.expect)(first.audioAsVoice).toBe(true);
        (0, vitest_1.expect)(second.audioAsVoice).toBe(true);
    });
    (0, vitest_1.it)("keeps MEDIA mentions in prose", function () {
        var input = "The MEDIA: tag fails to deliver";
        var result = (0, parse_js_1.splitMediaFromOutput)(input);
        (0, vitest_1.expect)(result.mediaUrls).toBeUndefined();
        (0, vitest_1.expect)(result.text).toBe(input);
    });
    (0, vitest_1.it)("parses MEDIA tags with leading whitespace", function () {
        var result = (0, parse_js_1.splitMediaFromOutput)("  MEDIA:./screenshot.png");
        (0, vitest_1.expect)(result.mediaUrls).toEqual(["./screenshot.png"]);
        (0, vitest_1.expect)(result.text).toBe("");
    });
});
