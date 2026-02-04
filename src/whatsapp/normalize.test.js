"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var normalize_js_1 = require("./normalize.js");
(0, vitest_1.describe)("normalizeWhatsAppTarget", function () {
    (0, vitest_1.it)("preserves group JIDs", function () {
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("120363401234567890@g.us")).toBe("120363401234567890@g.us");
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("123456789-987654321@g.us")).toBe("123456789-987654321@g.us");
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("whatsapp:120363401234567890@g.us")).toBe("120363401234567890@g.us");
    });
    (0, vitest_1.it)("normalizes direct JIDs to E.164", function () {
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("1555123@s.whatsapp.net")).toBe("+1555123");
    });
    (0, vitest_1.it)("normalizes user JIDs with device suffix to E.164", function () {
        // This is the bug fix: JIDs like "41796666864:0@s.whatsapp.net" should
        // normalize to "+41796666864", not "+417966668640" (extra digit from ":0")
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("41796666864:0@s.whatsapp.net")).toBe("+41796666864");
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("1234567890:123@s.whatsapp.net")).toBe("+1234567890");
        // Without device suffix still works
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("41796666864@s.whatsapp.net")).toBe("+41796666864");
    });
    (0, vitest_1.it)("normalizes LID JIDs to E.164", function () {
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("123456789@lid")).toBe("+123456789");
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("123456789@LID")).toBe("+123456789");
    });
    (0, vitest_1.it)("rejects invalid targets", function () {
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("wat")).toBeNull();
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("whatsapp:")).toBeNull();
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("@g.us")).toBeNull();
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("whatsapp:group:@g.us")).toBeNull();
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("whatsapp:group:120363401234567890@g.us")).toBeNull();
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("group:123456789-987654321@g.us")).toBeNull();
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)(" WhatsApp:Group:123456789-987654321@G.US ")).toBeNull();
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("abc@s.whatsapp.net")).toBeNull();
    });
    (0, vitest_1.it)("handles repeated prefixes", function () {
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("whatsapp:whatsapp:+1555")).toBe("+1555");
        (0, vitest_1.expect)((0, normalize_js_1.normalizeWhatsAppTarget)("group:group:120@g.us")).toBeNull();
    });
});
(0, vitest_1.describe)("isWhatsAppUserTarget", function () {
    (0, vitest_1.it)("detects user JIDs with various formats", function () {
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppUserTarget)("41796666864:0@s.whatsapp.net")).toBe(true);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppUserTarget)("1234567890@s.whatsapp.net")).toBe(true);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppUserTarget)("123456789@lid")).toBe(true);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppUserTarget)("123456789@LID")).toBe(true);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppUserTarget)("123@lid:0")).toBe(false);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppUserTarget)("abc@s.whatsapp.net")).toBe(false);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppUserTarget)("123456789-987654321@g.us")).toBe(false);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppUserTarget)("+1555123")).toBe(false);
    });
});
(0, vitest_1.describe)("isWhatsAppGroupJid", function () {
    (0, vitest_1.it)("detects group JIDs with or without prefixes", function () {
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppGroupJid)("120363401234567890@g.us")).toBe(true);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppGroupJid)("123456789-987654321@g.us")).toBe(true);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppGroupJid)("whatsapp:120363401234567890@g.us")).toBe(true);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppGroupJid)("whatsapp:group:120363401234567890@g.us")).toBe(false);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppGroupJid)("x@g.us")).toBe(false);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppGroupJid)("@g.us")).toBe(false);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppGroupJid)("120@g.usx")).toBe(false);
        (0, vitest_1.expect)((0, normalize_js_1.isWhatsAppGroupJid)("+1555123")).toBe(false);
    });
});
