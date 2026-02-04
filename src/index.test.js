"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var index_js_1 = require("./index.js");
(0, vitest_1.describe)("normalizeE164", function () {
    (0, vitest_1.it)("strips whatsapp prefix and whitespace", function () {
        (0, vitest_1.expect)((0, index_js_1.normalizeE164)("whatsapp:+1 555 555 0123")).toBe("+15555550123");
    });
    (0, vitest_1.it)("adds plus when missing", function () {
        (0, vitest_1.expect)((0, index_js_1.normalizeE164)("1555123")).toBe("+1555123");
    });
});
(0, vitest_1.describe)("toWhatsappJid", function () {
    (0, vitest_1.it)("converts E164 to jid", function () {
        (0, vitest_1.expect)((0, index_js_1.toWhatsappJid)("+1 555 555 0123")).toBe("15555550123@s.whatsapp.net");
    });
    (0, vitest_1.it)("keeps group JIDs intact", function () {
        (0, vitest_1.expect)((0, index_js_1.toWhatsappJid)("123456789-987654321@g.us")).toBe("123456789-987654321@g.us");
    });
});
(0, vitest_1.describe)("assertWebChannel", function () {
    (0, vitest_1.it)("accepts valid channels", function () {
        (0, vitest_1.expect)(function () { return (0, index_js_1.assertWebChannel)("web"); }).not.toThrow();
    });
    (0, vitest_1.it)("throws on invalid channel", function () {
        (0, vitest_1.expect)(function () { return (0, index_js_1.assertWebChannel)("invalid"); }).toThrow();
    });
});
