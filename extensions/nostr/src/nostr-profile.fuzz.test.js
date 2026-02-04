"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var nostr_profile_js_1 = require("./nostr-profile.js");
// Test private key
var TEST_HEX_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
var TEST_SK = new Uint8Array(TEST_HEX_KEY.match(/.{2}/g).map(function (byte) { return parseInt(byte, 16); }));
// ============================================================================
// Unicode Attack Vectors
// ============================================================================
(0, vitest_1.describe)("profile unicode attacks", function () {
    (0, vitest_1.describe)("zero-width characters", function () {
        (0, vitest_1.it)("handles zero-width space in name", function () {
            var _a;
            var profile = {
                name: "test\u200Buser", // Zero-width space
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
            // The character should be preserved (not stripped)
            (0, vitest_1.expect)((_a = result.profile) === null || _a === void 0 ? void 0 : _a.name).toBe("test\u200Buser");
        });
        (0, vitest_1.it)("handles zero-width joiner in name", function () {
            var profile = {
                name: "test\u200Duser", // Zero-width joiner
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("handles zero-width non-joiner in about", function () {
            var profile = {
                about: "test\u200Cabout", // Zero-width non-joiner
            };
            var content = (0, nostr_profile_js_1.profileToContent)(profile);
            (0, vitest_1.expect)(content.about).toBe("test\u200Cabout");
        });
    });
    (0, vitest_1.describe)("RTL override attacks", function () {
        (0, vitest_1.it)("handles RTL override in name", function () {
            var profile = {
                name: "\u202Eevil\u202C", // Right-to-left override + pop direction
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
            // UI should escape or handle this
            var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(result.profile);
            (0, vitest_1.expect)(sanitized.name).toBeDefined();
        });
        (0, vitest_1.it)("handles bidi embedding in about", function () {
            var profile = {
                about: "Normal \u202Breversed\u202C text", // LTR embedding
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
    });
    (0, vitest_1.describe)("homoglyph attacks", function () {
        (0, vitest_1.it)("handles Cyrillic homoglyphs", function () {
            var profile = {
                // Cyrillic 'а' (U+0430) looks like Latin 'a'
                name: "\u0430dmin", // Fake "admin"
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
            // Profile is accepted but apps should be aware
        });
        (0, vitest_1.it)("handles Greek homoglyphs", function () {
            var profile = {
                // Greek 'ο' (U+03BF) looks like Latin 'o'
                name: "b\u03BFt", // Looks like "bot"
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
    });
    (0, vitest_1.describe)("combining characters", function () {
        (0, vitest_1.it)("handles combining diacritics", function () {
            var _a;
            var profile = {
                name: "cafe\u0301", // 'e' + combining acute = 'é'
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
            (0, vitest_1.expect)((_a = result.profile) === null || _a === void 0 ? void 0 : _a.name).toBe("cafe\u0301");
        });
        (0, vitest_1.it)("handles excessive combining characters (Zalgo text)", function () {
            var zalgo = "t̷̢̧̨̡̛̛̛͎̩̝̪̲̲̞̠̹̗̩͓̬̱̪̦͙̬̲̤͙̱̫̝̪̱̫̯̬̭̠̖̲̥̖̫̫̤͇̪̣̫̪̖̱̯̣͎̯̲̱̤̪̣̖̲̪̯͓̖̤̫̫̲̱̲̫̲̖̫̪̯̱̱̪̖̯e̶̡̧̨̧̛̛̛̖̪̯̱̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪s̶̨̧̛̛̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯̖̪̯̖̪̱̪̯t";
            var profile = {
                name: zalgo.slice(0, 256), // Truncate to fit limit
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            // Should be valid but may look weird
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
    });
    (0, vitest_1.describe)("CJK and other scripts", function () {
        (0, vitest_1.it)("handles Chinese characters", function () {
            var profile = {
                name: "中文用户",
                about: "我是一个机器人",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("handles Japanese hiragana and katakana", function () {
            var profile = {
                name: "ボット",
                about: "これはテストです",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("handles Korean characters", function () {
            var profile = {
                name: "한국어사용자",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("handles Arabic text", function () {
            var profile = {
                name: "مستخدم",
                about: "مرحبا بالعالم",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("handles Hebrew text", function () {
            var profile = {
                name: "משתמש",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("handles Thai text", function () {
            var profile = {
                name: "ผู้ใช้",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
    });
    (0, vitest_1.describe)("emoji edge cases", function () {
        (0, vitest_1.it)("handles emoji sequences (ZWJ)", function () {
            var profile = {
                name: "👨‍👩‍👧‍👦", // Family emoji using ZWJ
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("handles flag emojis", function () {
            var profile = {
                name: "🇺🇸🇯🇵🇬🇧",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("handles skin tone modifiers", function () {
            var profile = {
                name: "👋🏻👋🏽👋🏿",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
    });
});
// ============================================================================
// XSS Attack Vectors
// ============================================================================
(0, vitest_1.describe)("profile XSS attacks", function () {
    (0, vitest_1.describe)("script injection", function () {
        (0, vitest_1.it)("escapes script tags", function () {
            var profile = {
                name: '<script>alert("xss")</script>',
            };
            var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
            (0, vitest_1.expect)(sanitized.name).not.toContain("<script>");
            (0, vitest_1.expect)(sanitized.name).toContain("&lt;script&gt;");
        });
        (0, vitest_1.it)("escapes nested script tags", function () {
            var profile = {
                about: '<<script>script>alert("xss")<</script>/script>',
            };
            var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
            (0, vitest_1.expect)(sanitized.about).not.toContain("<script>");
        });
    });
    (0, vitest_1.describe)("event handler injection", function () {
        (0, vitest_1.it)("escapes img onerror", function () {
            var profile = {
                about: '<img src="x" onerror="alert(1)">',
            };
            var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
            (0, vitest_1.expect)(sanitized.about).toContain("&lt;img");
            (0, vitest_1.expect)(sanitized.about).not.toContain('onerror="alert');
        });
        (0, vitest_1.it)("escapes svg onload", function () {
            var profile = {
                about: '<svg onload="alert(1)">',
            };
            var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
            (0, vitest_1.expect)(sanitized.about).toContain("&lt;svg");
        });
        (0, vitest_1.it)("escapes body onload", function () {
            var profile = {
                about: '<body onload="alert(1)">',
            };
            var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
            (0, vitest_1.expect)(sanitized.about).toContain("&lt;body");
        });
    });
    (0, vitest_1.describe)("URL-based attacks", function () {
        (0, vitest_1.it)("rejects javascript: URL in picture", function () {
            var profile = {
                picture: "javascript:alert('xss')",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
        (0, vitest_1.it)("rejects javascript: URL with encoding", function () {
            var profile = {
                picture: "java&#115;cript:alert('xss')",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
        (0, vitest_1.it)("rejects data: URL", function () {
            var profile = {
                picture: "data:text/html,<script>alert('xss')</script>",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
        (0, vitest_1.it)("rejects vbscript: URL", function () {
            var profile = {
                website: "vbscript:msgbox('xss')",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
        (0, vitest_1.it)("rejects file: URL", function () {
            var profile = {
                picture: "file:///etc/passwd",
            };
            var result = (0, nostr_profile_js_1.validateProfile)(profile);
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
    });
    (0, vitest_1.describe)("HTML attribute injection", function () {
        (0, vitest_1.it)("escapes double quotes in fields", function () {
            var profile = {
                name: '" onclick="alert(1)" data-x="',
            };
            var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
            (0, vitest_1.expect)(sanitized.name).toContain("&quot;");
            (0, vitest_1.expect)(sanitized.name).not.toContain('onclick="alert');
        });
        (0, vitest_1.it)("escapes single quotes in fields", function () {
            var profile = {
                name: "' onclick='alert(1)' data-x='",
            };
            var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
            (0, vitest_1.expect)(sanitized.name).toContain("&#039;");
        });
    });
    (0, vitest_1.describe)("CSS injection", function () {
        (0, vitest_1.it)("escapes style tags", function () {
            var profile = {
                about: '<style>body{background:url("javascript:alert(1)")}</style>',
            };
            var sanitized = (0, nostr_profile_js_1.sanitizeProfileForDisplay)(profile);
            (0, vitest_1.expect)(sanitized.about).toContain("&lt;style&gt;");
        });
    });
});
// ============================================================================
// Length Boundary Tests
// ============================================================================
(0, vitest_1.describe)("profile length boundaries", function () {
    (0, vitest_1.describe)("name field (max 256)", function () {
        (0, vitest_1.it)("accepts exactly 256 characters", function () {
            var result = (0, nostr_profile_js_1.validateProfile)({ name: "a".repeat(256) });
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("rejects 257 characters", function () {
            var result = (0, nostr_profile_js_1.validateProfile)({ name: "a".repeat(257) });
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
        (0, vitest_1.it)("accepts empty string", function () {
            var result = (0, nostr_profile_js_1.validateProfile)({ name: "" });
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
    });
    (0, vitest_1.describe)("displayName field (max 256)", function () {
        (0, vitest_1.it)("accepts exactly 256 characters", function () {
            var result = (0, nostr_profile_js_1.validateProfile)({ displayName: "b".repeat(256) });
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("rejects 257 characters", function () {
            var result = (0, nostr_profile_js_1.validateProfile)({ displayName: "b".repeat(257) });
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
    });
    (0, vitest_1.describe)("about field (max 2000)", function () {
        (0, vitest_1.it)("accepts exactly 2000 characters", function () {
            var result = (0, nostr_profile_js_1.validateProfile)({ about: "c".repeat(2000) });
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("rejects 2001 characters", function () {
            var result = (0, nostr_profile_js_1.validateProfile)({ about: "c".repeat(2001) });
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
    });
    (0, vitest_1.describe)("URL fields", function () {
        (0, vitest_1.it)("accepts long valid HTTPS URLs", function () {
            var longPath = "a".repeat(1000);
            var result = (0, nostr_profile_js_1.validateProfile)({
                picture: "https://example.com/".concat(longPath, ".png"),
            });
            (0, vitest_1.expect)(result.valid).toBe(true);
        });
        (0, vitest_1.it)("rejects invalid URL format", function () {
            var result = (0, nostr_profile_js_1.validateProfile)({
                picture: "not-a-url",
            });
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
        (0, vitest_1.it)("rejects URL without protocol", function () {
            var result = (0, nostr_profile_js_1.validateProfile)({
                picture: "example.com/pic.png",
            });
            (0, vitest_1.expect)(result.valid).toBe(false);
        });
    });
});
// ============================================================================
// Type Confusion Tests
// ============================================================================
(0, vitest_1.describe)("profile type confusion", function () {
    (0, vitest_1.it)("rejects number as name", function () {
        var result = (0, nostr_profile_js_1.validateProfile)({ name: 123 });
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
    (0, vitest_1.it)("rejects array as about", function () {
        var result = (0, nostr_profile_js_1.validateProfile)({ about: ["hello"] });
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
    (0, vitest_1.it)("rejects object as picture", function () {
        var result = (0, nostr_profile_js_1.validateProfile)({
            picture: { url: "https://example.com" },
        });
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
    (0, vitest_1.it)("rejects null as name", function () {
        var result = (0, nostr_profile_js_1.validateProfile)({ name: null });
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
    (0, vitest_1.it)("rejects boolean as about", function () {
        var result = (0, nostr_profile_js_1.validateProfile)({ about: true });
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
    (0, vitest_1.it)("rejects function as name", function () {
        var result = (0, nostr_profile_js_1.validateProfile)({ name: (function () { return "test"; }) });
        (0, vitest_1.expect)(result.valid).toBe(false);
    });
    (0, vitest_1.it)("handles prototype pollution attempt", function () {
        var malicious = JSON.parse('{"__proto__": {"polluted": true}}');
        (0, nostr_profile_js_1.validateProfile)(malicious);
        // Should not pollute Object.prototype
        (0, vitest_1.expect)({}.polluted).toBeUndefined();
    });
});
// ============================================================================
// Event Creation Edge Cases
// ============================================================================
(0, vitest_1.describe)("event creation edge cases", function () {
    (0, vitest_1.it)("handles profile with all fields at max length", function () {
        var profile = {
            name: "a".repeat(256),
            displayName: "b".repeat(256),
            about: "c".repeat(2000),
            nip05: "d".repeat(200) + "@example.com",
            lud16: "e".repeat(200) + "@example.com",
        };
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        (0, vitest_1.expect)(event.kind).toBe(0);
        // Content should be parseable JSON
        (0, vitest_1.expect)(function () { return JSON.parse(event.content); }).not.toThrow();
    });
    (0, vitest_1.it)("handles rapid sequential events with monotonic timestamps", function () {
        var profile = { name: "rapid" };
        // Create events in quick succession
        var lastTimestamp = 0;
        for (var i = 0; i < 100; i++) {
            var event_1 = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile, lastTimestamp);
            (0, vitest_1.expect)(event_1.created_at).toBeGreaterThan(lastTimestamp);
            lastTimestamp = event_1.created_at;
        }
    });
    (0, vitest_1.it)("handles JSON special characters in content", function () {
        var profile = {
            name: 'test"user',
            about: "line1\nline2\ttab\\backslash",
        };
        var event = (0, nostr_profile_js_1.createProfileEvent)(TEST_SK, profile);
        var parsed = JSON.parse(event.content);
        (0, vitest_1.expect)(parsed.name).toBe('test"user');
        (0, vitest_1.expect)(parsed.about).toContain("\n");
        (0, vitest_1.expect)(parsed.about).toContain("\t");
        (0, vitest_1.expect)(parsed.about).toContain("\\");
    });
});
