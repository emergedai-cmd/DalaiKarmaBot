"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nostr_tools_1 = require("nostr-tools");
var vitest_1 = require("vitest");
var nostr_profile_js_1 = require("./nostr-profile.js");
// Test private key (DO NOT use in production - this is a known test key)
var TEST_HEX_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
var TEST_SK = new Uint8Array(TEST_HEX_KEY.match(/.{2}/g).map(function (byte) { return parseInt(byte, 16); }));
var TEST_PUBKEY = (0, nostr_tools_1.getPublicKey)(TEST_SK);
// ============================================================================
// Profile Content Conversion Tests
// ============================================================================
(0, vitest_1.describe)("profileToContent", function () {
    (0, vitest_1.it)("converts full profile to NIP-01 content format", function () {
        var profile = {
            name: "testuser",
            displayName: "Test User",
            about: "A test user for unit testing",
            picture: "https://example.com/avatar.png",
            banner: "https://example.com/banner.png",
            website: "https://example.com",
            nip05: "testuser@example.com",
            lud16: "testuser@walletofsatoshi.com",
        };
        var content = (0, nostr_profile_js_1.profileToContent)(profile);
        (0, vitest_1.expect)(content.name).toBe("testuser");
        (0, vitest_1.expect)(content.display_name).toBe("Test User");
        (0, vitest_1.expect)(content.about).toBe("A test user for unit testing");
        (0, vitest_1.expect)(content.picture).toBe("https://example.com/avatar.png");
        (0, vitest_1.expect)(content.banner).toBe("https://example.com/banner.png");
        (0, vitest_1.expect)(content.website).toBe("https://example.com");
        (0, vitest_1.expect)(content.nip05).toBe("testuser@example.com");
        (0, vitest_1.expect)(content.lud16).toBe("testuser@walletofsatoshi.com");
    });
    (0, vitest_1.it)("omits undefined fields from content", function () {
        var profile = {
            name: "minimaluser",
        };
        var content = (0, nostr_profile_js_1.profileToContent)(profile);
        (0, vitest_1.expect)(content.name).toBe("minimaluser");
        (0, vitest_1.expect)("display_name" in content).toBe(false);
        (0, vitest_1.expect)("about" in content).toBe(false);
        (0, vitest_1.expect)("picture" in content).toBe(false);
    });
    (0, vitest_1.it)("handles empty profile", function () {
        var profile = {};
        var content = (0, nostr_profile_js_1.profileToContent)(profile);
        (0, vitest_1.expect)(Object.keys(content)).toHaveLength(0);
    });
});
(0, vitest_1.describe)("contentToProfile", function () {
    (0, vitest_1.it)("converts NIP-01 content to profile format", function () {
        var content = {
            name: "testuser",
            display_name: "Test User",
            about: "A test user",
            picture: "https://example.com/avatar.png",
            nip05: "test@example.com",
        };
        var profile = (0, nostr_profile_js_1.contentToProfile)(content);
        (0, vitest_1.expect)(profile.name).toBe("testuser");
        (0, vitest_1.expect)(profile.displayName).toBe("Test User");
        (0, vitest_1.expect)(profile.about).toBe("A test user");
        (0, vitest_1.expect)(profile.picture).toBe("https://example.com/avatar.png");
        (0, vitest_1.expect)(profile.nip05).toBe("test@example.com");
    });
    (0, vitest_1.it)("handles empty content", function () {
        var content = {};
        var profile = (0, nostr_profile_js_1.contentToProfile)(content);
        (0, vitest_1.expect)(Object.keys(profile).filter(function (k) { return profile[k] !== undefined; })).toHaveLength(0);
    });
    (0, vitest_1.it)("round-trips profile data", function () {
        var original = {
            name: "roundtrip",
            displayName: "Round Trip Test",
            about: "Testing round-trip conversion",
        };
        var content = (0, nostr_profile_js_1.profileToContent)(original);
        var restored = (0, nostr_profile_js_1.contentToProfile)(content);
        (0, vitest_1.expect)(restored.name).toBe(original.name);
        (0, vitest_1.expect)(restored.displayName).toBe(original.displayName);
        (0, vitest_1.expect)(restored.about).toBe(original.about);
    });
});
// ============================================================================
// Event Creation Tests
// ============================================================================
(0, vitest_1.describe)("createProfileEvent", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.setSystemTime(new Date("2024-01-15T12:00:00Z"));
    });
    (0, vitest_1.it)("creates a valid kind:0 event", function () {
        var profile = {
            name: "testbot",
            about: "A test bot",
        };
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        (0, vitest_1.expect)(event.kind).toBe(0);
        (0, vitest_1.expect)(event.pubkey).toBe(TEST_PUBKEY);
        (0, vitest_1.expect)(event.tags).toEqual([]);
        (0, vitest_1.expect)(event.id).toMatch(/^[0-9a-f]{64}$/);
        (0, vitest_1.expect)(event.sig).toMatch(/^[0-9a-f]{128}$/);
    });
    (0, vitest_1.it)("includes profile content as JSON in event content", function () {
        var profile = {
            name: "jsontest",
            displayName: "JSON Test User",
            about: "Testing JSON serialization",
        };
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        var parsedContent = JSON.parse(event.content);
        (0, vitest_1.expect)(parsedContent.name).toBe("jsontest");
        (0, vitest_1.expect)(parsedContent.display_name).toBe("JSON Test User");
        (0, vitest_1.expect)(parsedContent.about).toBe("Testing JSON serialization");
    });
    (0, vitest_1.it)("produces a verifiable signature", function () {
        var profile = { name: "signaturetest" };
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        (0, vitest_1.expect)((0, nostr_tools_1.verifyEvent)(event)).toBe(true);
    });
    (0, vitest_1.it)("uses current timestamp when no lastPublishedAt provided", function () {
        var profile = { name: "timestamptest" };
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        var expectedTimestamp = Math.floor(Date.now() / 1000);
        (0, vitest_1.expect)(event.created_at).toBe(expectedTimestamp);
    });
    (0, vitest_1.it)("ensures monotonic timestamp when lastPublishedAt is in the future", function () {
        // Current time is 2024-01-15T12:00:00Z = 1705320000
        var futureTimestamp = 1705320000 + 3600; // 1 hour in the future
        var profile = { name: "monotonictest" };
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile, futureTimestamp);
        (0, vitest_1.expect)(event.created_at).toBe(futureTimestamp + 1);
    });
    (0, vitest_1.it)("uses current time when lastPublishedAt is in the past", function () {
        var pastTimestamp = 1705320000 - 3600; // 1 hour in the past
        var profile = { name: "pasttest" };
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile, pastTimestamp);
        var expectedTimestamp = Math.floor(Date.now() / 1000);
        (0, vitest_1.expect)(event.created_at).toBe(expectedTimestamp);
    });
    vitest_1.vi.useRealTimers();
});
// ============================================================================
// Profile Validation Tests
// ============================================================================
(0, vitest_1.describe)("validateProfile", function () {
    (0, vitest_1.it)("validates a correct profile", function () {
        var profile = {
            name: "validuser",
            about: "A valid user",
            picture: "https://example.com/pic.png",
        };
        var result = (0, nostr_profile_js_1.validateProfile)(profile);
        (0, vitest_1.expect)(result.valid).toBe(true);
        (0, vitest_1.expect)(result.profile).toBeDefined();
        (0, vitest_1.expect)(result.errors).toBeUndefined();
    });
    (0, vitest_1.it)("rejects profile with invalid URL", function () {
        var profile = {
            name: "invalidurl",
            picture: "http://insecure.example.com/pic.png", // HTTP not HTTPS
        };
        var result = (0, nostr_profile_js_1.validateProfile)(profile);
        (0, vitest_1.expect)(result.valid).toBe(false);
        (0, vitest_1.expect)(result.errors).toBeDefined();
        (0, vitest_1.expect)(result.errors.some(function (e) { return e.includes("https://"); })).toBe(true);
    });
    (0, vitest_1.it)("rejects profile with javascript: URL", function () {
        var profile = {
            name: "xssattempt",
            picture: "javascript:alert('xss')",
        };
        var result = (0, nostr_profile_js_1.validateProfile)(profile);
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
    (0, vitest_1.it)("rejects profile with data: URL", function () {
        var profile = {
            name: "dataurl",
            picture: "data:image/png;base64,abc123",
        };
        var result = (0, nostr_profile_js_1.validateProfile)(profile);
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
    (0, vitest_1.it)("rejects name exceeding 256 characters", function () {
        var profile = {
            name: "a".repeat(257),
        };
        var result = (0, nostr_profile_js_1.validateProfile)(profile);
        (0, vitest_1.expect)(result.valid).toBe(false);
        (0, vitest_1.expect)(result.errors.some(function (e) { return e.includes("256"); })).toBe(true);
    });
    (0, vitest_1.it)("rejects about exceeding 2000 characters", function () {
        var profile = {
            about: "a".repeat(2001),
        };
        var result = (0, nostr_profile_js_1.validateProfile)(profile);
        (0, vitest_1.expect)(result.valid).toBe(false);
        (0, vitest_1.expect)(result.errors.some(function (e) { return e.includes("2000"); })).toBe(true);
    });
    (0, vitest_1.it)("accepts empty profile", function () {
        var result = (0, nostr_profile_js_1.validateProfile)({});
        (0, vitest_1.expect)(result.valid).toBe(true);
    });
    (0, vitest_1.it)("rejects null input", function () {
        var result = (0, nostr_profile_js_1.validateProfile)(null);
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
    (0, vitest_1.it)("rejects non-object input", function () {
        var result = (0, nostr_profile_js_1.validateProfile)("not an object");
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
});
// ============================================================================
// Sanitization Tests
// ============================================================================
(0, vitest_1.describe)("sanitizeProfileForDisplay", function () {
    (0, vitest_1.it)("escapes HTML in name field", function () {
        var profile = {
            name: "<script>alert('xss')</script>",
        };
        var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
        (0, vitest_1.expect)(sanitized.name).toBe("&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;");
    });
    (0, vitest_1.it)("escapes HTML in about field", function () {
        var profile = {
            about: 'Check out <img src="x" onerror="alert(1)">',
        };
        var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
        (0, vitest_1.expect)(sanitized.about).toBe("Check out &lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;");
    });
    (0, vitest_1.it)("preserves URLs without modification", function () {
        var profile = {
            picture: "https://example.com/pic.png",
            website: "https://example.com",
        };
        var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
        (0, vitest_1.expect)(sanitized.picture).toBe("https://example.com/pic.png");
        (0, vitest_1.expect)(sanitized.website).toBe("https://example.com");
    });
    (0, vitest_1.it)("handles undefined fields", function () {
        var profile = {
            name: "test",
        };
        var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
        (0, vitest_1.expect)(sanitized.name).toBe("test");
        (0, vitest_1.expect)(sanitized.about).toBeUndefined();
        (0, vitest_1.expect)(sanitized.picture).toBeUndefined();
    });
    (0, vitest_1.it)("escapes ampersands", function () {
        var profile = {
            name: "Tom & Jerry",
        };
        var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
        (0, vitest_1.expect)(sanitized.name).toBe("Tom &amp; Jerry");
    });
    (0, vitest_1.it)("escapes quotes", function () {
        var profile = {
            about: 'Say "hello" to everyone',
        };
        var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
        (0, vitest_1.expect)(sanitized.about).toBe("Say &quot;hello&quot; to everyone");
    });
});
// ============================================================================
// Edge Cases
// ============================================================================
(0, vitest_1.describe)("edge cases", function () {
    (0, vitest_1.it)("handles emoji in profile fields", function () {
        var profile = {
            name: "🤖 Bot",
            about: "I am a 🤖 robot! 🎉",
        };
        var content = (0, nostr_profile_js_1.profileToContent)(profile);
        (0, vitest_1.expect)(content.name).toBe("🤖 Bot");
        (0, vitest_1.expect)(content.about).toBe("I am a 🤖 robot! 🎉");
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        var parsed = JSON.parse(event.content);
        (0, vitest_1.expect)(parsed.name).toBe("🤖 Bot");
    });
    (0, vitest_1.it)("handles unicode in profile fields", function () {
        var profile = {
            name: "日本語ユーザー",
            about: "Привет мир! 你好世界!",
        };
        var content = (0, nostr_profile_js_1.profileToContent)(profile);
        (0, vitest_1.expect)(content.name).toBe("日本語ユーザー");
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        (0, vitest_1.expect)((0, nostr_tools_1.verifyEvent)(event)).toBe(true);
    });
    (0, vitest_1.it)("handles newlines in about field", function () {
        var profile = {
            about: "Line 1\nLine 2\nLine 3",
        };
        var content = (0, nostr_profile_js_1.profileToContent)(profile);
        (0, vitest_1.expect)(content.about).toBe("Line 1\nLine 2\nLine 3");
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        var parsed = JSON.parse(event.content);
        (0, vitest_1.expect)(parsed.about).toBe("Line 1\nLine 2\nLine 3");
    });
    (0, vitest_1.it)("handles maximum length fields", function () {
        var profile = {
            name: "a".repeat(256),
            about: "b".repeat(2000),
        };
        var result = (0, nostr_profile_js_1.validateProfile)(profile);
        (0, vitest_1.expect)(result.valid).toBe(true);
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        (0, vitest_1.expect)((0, nostr_tools_1.verifyEvent)(event)).toBe(true);
    });
});
