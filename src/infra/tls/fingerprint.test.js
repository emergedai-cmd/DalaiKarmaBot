"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var fingerprint_js_1 = require("./fingerprint.js");
(0, vitest_1.describe)("normalizeFingerprint", function () {
    (0, vitest_1.it)("strips sha256 prefixes and separators", function () {
        (0, vitest_1.expect)((0, fingerprint_js_1.normalizeFingerprint)("sha256:AA:BB:cc")).toBe("aabbcc");
        (0, vitest_1.expect)((0, fingerprint_js_1.normalizeFingerprint)("SHA-256 11-22-33")).toBe("112233");
        (0, vitest_1.expect)((0, fingerprint_js_1.normalizeFingerprint)("aa:bb:cc")).toBe("aabbcc");
    });
});
