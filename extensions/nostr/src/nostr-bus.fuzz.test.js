"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var metrics_js_1 = require("./metrics.js");
var nostr_bus_js_1 = require("./nostr-bus.js");
var seen_tracker_js_1 = require("./seen-tracker.js");
// ============================================================================
// Fuzz Tests for validatePrivateKey
// ============================================================================
(0, vitest_1.describe)("validatePrivateKey fuzz", function () {
    (0, vitest_1.describe)("type confusion", function () {
        (0, vitest_1.it)("rejects null input", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(null); }).toThrow();
        });
        (0, vitest_1.it)("rejects undefined input", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(undefined); }).toThrow();
        });
        (0, vitest_1.it)("rejects number input", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(123); }).toThrow();
        });
        (0, vitest_1.it)("rejects boolean input", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(true); }).toThrow();
        });
        (0, vitest_1.it)("rejects object input", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)({}); }).toThrow();
        });
        (0, vitest_1.it)("rejects array input", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)([]); }).toThrow();
        });
        (0, vitest_1.it)("rejects function input", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)((function () { })); }).toThrow();
        });
    });
    (0, vitest_1.describe)("unicode attacks", function () {
        (0, vitest_1.it)("rejects unicode lookalike characters", function () {
            // Using zero-width characters
            var withZeroWidth = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde\u200Bf";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withZeroWidth); }).toThrow();
        });
        (0, vitest_1.it)("rejects RTL override", function () {
            var withRtl = "\u202E0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withRtl); }).toThrow();
        });
        (0, vitest_1.it)("rejects homoglyph 'a' (Cyrillic а)", function () {
            // Using Cyrillic 'а' (U+0430) instead of Latin 'a'
            var withCyrillicA = "0123456789\u0430bcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withCyrillicA); }).toThrow();
        });
        (0, vitest_1.it)("rejects emoji", function () {
            var withEmoji = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab😀";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withEmoji); }).toThrow();
        });
        (0, vitest_1.it)("rejects combining characters", function () {
            // 'a' followed by combining acute accent
            var withCombining = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde\u0301";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withCombining); }).toThrow();
        });
    });
    (0, vitest_1.describe)("injection attempts", function () {
        (0, vitest_1.it)("rejects null byte injection", function () {
            var withNullByte = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde\x00f";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withNullByte); }).toThrow();
        });
        (0, vitest_1.it)("rejects newline injection", function () {
            var withNewline = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde\nf";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withNewline); }).toThrow();
        });
        (0, vitest_1.it)("rejects carriage return injection", function () {
            var withCR = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde\rf";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withCR); }).toThrow();
        });
        (0, vitest_1.it)("rejects tab injection", function () {
            var withTab = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde\tf";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withTab); }).toThrow();
        });
        (0, vitest_1.it)("rejects form feed injection", function () {
            var withFormFeed = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde\ff";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withFormFeed); }).toThrow();
        });
    });
    (0, vitest_1.describe)("edge cases", function () {
        (0, vitest_1.it)("rejects very long string", function () {
            var veryLong = "a".repeat(10000);
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(veryLong); }).toThrow();
        });
        (0, vitest_1.it)("rejects string of spaces matching length", function () {
            var spaces = " ".repeat(64);
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(spaces); }).toThrow();
        });
        (0, vitest_1.it)("rejects hex with spaces between characters", function () {
            var withSpaces = "01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(withSpaces); }).toThrow();
        });
    });
    (0, vitest_1.describe)("nsec format edge cases", function () {
        (0, vitest_1.it)("rejects nsec with invalid bech32 characters", function () {
            // 'b', 'i', 'o' are not valid bech32 characters
            var invalidBech32 = "nsec1qypqxpq9qtpqscx7peytbfwtdjmcv0mrz5rjpej8vjppfkqfqy8skqfv3l";
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)(invalidBech32); }).toThrow();
        });
        (0, vitest_1.it)("rejects nsec with wrong prefix", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)("nsec0aaaa"); }).toThrow();
        });
        (0, vitest_1.it)("rejects partial nsec", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.validatePrivateKey)("nsec1"); }).toThrow();
        });
    });
});
// ============================================================================
// Fuzz Tests for isValidPubkey
// ============================================================================
(0, vitest_1.describe)("isValidPubkey fuzz", function () {
    (0, vitest_1.describe)("type confusion", function () {
        (0, vitest_1.it)("handles null gracefully", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)(null)).toBe(false);
        });
        (0, vitest_1.it)("handles undefined gracefully", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)(undefined)).toBe(false);
        });
        (0, vitest_1.it)("handles number gracefully", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)(123)).toBe(false);
        });
        (0, vitest_1.it)("handles object gracefully", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)({})).toBe(false);
        });
    });
    (0, vitest_1.describe)("malicious inputs", function () {
        (0, vitest_1.it)("rejects __proto__ key", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)("__proto__")).toBe(false);
        });
        (0, vitest_1.it)("rejects constructor key", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)("constructor")).toBe(false);
        });
        (0, vitest_1.it)("rejects toString key", function () {
            (0, vitest_1.expect)((0, nostr_bus_js_1.isValidPubkey)("toString")).toBe(false);
        });
    });
});
// ============================================================================
// Fuzz Tests for normalizePubkey
// ============================================================================
(0, vitest_1.describe)("normalizePubkey fuzz", function () {
    (0, vitest_1.describe)("prototype pollution attempts", function () {
        (0, vitest_1.it)("throws for __proto__", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.normalizePubkey)("__proto__"); }).toThrow();
        });
        (0, vitest_1.it)("throws for constructor", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.normalizePubkey)("constructor"); }).toThrow();
        });
        (0, vitest_1.it)("throws for prototype", function () {
            (0, vitest_1.expect)(function () { return (0, nostr_bus_js_1.normalizePubkey)("prototype"); }).toThrow();
        });
    });
    (0, vitest_1.describe)("case sensitivity", function () {
        (0, vitest_1.it)("normalizes uppercase to lowercase", function () {
            var upper = "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
            var lower = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)((0, nostr_bus_js_1.normalizePubkey)(upper)).toBe(lower);
        });
        (0, vitest_1.it)("normalizes mixed case to lowercase", function () {
            var mixed = "0123456789AbCdEf0123456789AbCdEf0123456789AbCdEf0123456789AbCdEf";
            var lower = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            (0, vitest_1.expect)((0, nostr_bus_js_1.normalizePubkey)(mixed)).toBe(lower);
        });
    });
});
// ============================================================================
// Fuzz Tests for SeenTracker
// ============================================================================
(0, vitest_1.describe)("SeenTracker fuzz", function () {
    (0, vitest_1.describe)("malformed IDs", function () {
        (0, vitest_1.it)("handles empty string IDs", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100 });
            (0, vitest_1.expect)(function () { return tracker.add(""); }).not.toThrow();
            (0, vitest_1.expect)(tracker.peek("")).toBe(true);
            tracker.stop();
        });
        (0, vitest_1.it)("handles very long IDs", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100 });
            var longId = "a".repeat(100000);
            (0, vitest_1.expect)(function () { return tracker.add(longId); }).not.toThrow();
            (0, vitest_1.expect)(tracker.peek(longId)).toBe(true);
            tracker.stop();
        });
        (0, vitest_1.it)("handles unicode IDs", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100 });
            var unicodeId = "事件ID_🎉_тест";
            (0, vitest_1.expect)(function () { return tracker.add(unicodeId); }).not.toThrow();
            (0, vitest_1.expect)(tracker.peek(unicodeId)).toBe(true);
            tracker.stop();
        });
        (0, vitest_1.it)("handles IDs with null bytes", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100 });
            var idWithNull = "event\x00id";
            (0, vitest_1.expect)(function () { return tracker.add(idWithNull); }).not.toThrow();
            (0, vitest_1.expect)(tracker.peek(idWithNull)).toBe(true);
            tracker.stop();
        });
        (0, vitest_1.it)("handles prototype property names as IDs", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100 });
            // These should not affect the tracker's internal operation
            (0, vitest_1.expect)(function () { return tracker.add("__proto__"); }).not.toThrow();
            (0, vitest_1.expect)(function () { return tracker.add("constructor"); }).not.toThrow();
            (0, vitest_1.expect)(function () { return tracker.add("toString"); }).not.toThrow();
            (0, vitest_1.expect)(function () { return tracker.add("hasOwnProperty"); }).not.toThrow();
            (0, vitest_1.expect)(tracker.peek("__proto__")).toBe(true);
            (0, vitest_1.expect)(tracker.peek("constructor")).toBe(true);
            (0, vitest_1.expect)(tracker.peek("toString")).toBe(true);
            (0, vitest_1.expect)(tracker.peek("hasOwnProperty")).toBe(true);
            tracker.stop();
        });
    });
    (0, vitest_1.describe)("rapid operations", function () {
        (0, vitest_1.it)("handles rapid add/check cycles", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 1000 });
            for (var i = 0; i < 10000; i++) {
                var id = "event-".concat(i);
                tracker.add(id);
                // Recently added should be findable
                if (i < 1000) {
                    tracker.peek(id);
                }
            }
            // Size should be capped at maxEntries
            (0, vitest_1.expect)(tracker.size()).toBeLessThanOrEqual(1000);
            tracker.stop();
        });
        (0, vitest_1.it)("handles concurrent-style operations", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100 });
            // Simulate interleaved operations
            for (var i = 0; i < 100; i++) {
                tracker.add("add-".concat(i));
                tracker.peek("peek-".concat(i));
                tracker.has("has-".concat(i));
                if (i % 10 === 0) {
                    tracker.delete("add-".concat(i - 5));
                }
            }
            (0, vitest_1.expect)(function () { return tracker.size(); }).not.toThrow();
            tracker.stop();
        });
    });
    (0, vitest_1.describe)("seed edge cases", function () {
        (0, vitest_1.it)("handles empty seed array", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100 });
            (0, vitest_1.expect)(function () { return tracker.seed([]); }).not.toThrow();
            (0, vitest_1.expect)(tracker.size()).toBe(0);
            tracker.stop();
        });
        (0, vitest_1.it)("handles seed with duplicate IDs", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100 });
            tracker.seed(["id1", "id1", "id1", "id2", "id2"]);
            (0, vitest_1.expect)(tracker.size()).toBe(2);
            tracker.stop();
        });
        (0, vitest_1.it)("handles seed larger than maxEntries", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 5 });
            var ids = Array.from({ length: 100 }, function (_, i) { return "id-".concat(i); });
            tracker.seed(ids);
            (0, vitest_1.expect)(tracker.size()).toBeLessThanOrEqual(5);
            tracker.stop();
        });
    });
});
// ============================================================================
// Fuzz Tests for Metrics
// ============================================================================
(0, vitest_1.describe)("Metrics fuzz", function () {
    (0, vitest_1.describe)("invalid metric names", function () {
        (0, vitest_1.it)("handles unknown metric names gracefully", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            // Cast to bypass type checking - testing runtime behavior
            (0, vitest_1.expect)(function () {
                metrics.emit("invalid.metric.name");
            }).not.toThrow();
        });
    });
    (0, vitest_1.describe)("invalid label values", function () {
        (0, vitest_1.it)("handles null relay label", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            (0, vitest_1.expect)(function () {
                metrics.emit("relay.connect", 1, { relay: null });
            }).not.toThrow();
        });
        (0, vitest_1.it)("handles undefined relay label", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            (0, vitest_1.expect)(function () {
                metrics.emit("relay.connect", 1, { relay: undefined });
            }).not.toThrow();
        });
        (0, vitest_1.it)("handles very long relay URL", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            var longUrl = "wss://" + "a".repeat(10000) + ".com";
            (0, vitest_1.expect)(function () {
                metrics.emit("relay.connect", 1, { relay: longUrl });
            }).not.toThrow();
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.relays[longUrl]).toBeDefined();
        });
    });
    (0, vitest_1.describe)("extreme values", function () {
        (0, vitest_1.it)("handles NaN value", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            (0, vitest_1.expect)(function () { return metrics.emit("event.received", NaN); }).not.toThrow();
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(isNaN(snapshot.eventsReceived)).toBe(true);
        });
        (0, vitest_1.it)("handles Infinity value", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            (0, vitest_1.expect)(function () { return metrics.emit("event.received", Infinity); }).not.toThrow();
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.eventsReceived).toBe(Infinity);
        });
        (0, vitest_1.it)("handles negative value", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("event.received", -1);
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.eventsReceived).toBe(-1);
        });
        (0, vitest_1.it)("handles very large value", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("event.received", Number.MAX_SAFE_INTEGER);
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.eventsReceived).toBe(Number.MAX_SAFE_INTEGER);
        });
    });
    (0, vitest_1.describe)("rapid emissions", function () {
        (0, vitest_1.it)("handles many rapid emissions", function () {
            var events = [];
            var metrics = (0, metrics_js_1.createMetrics)(function (e) { return events.push(e); });
            for (var i = 0; i < 10000; i++) {
                metrics.emit("event.received");
            }
            (0, vitest_1.expect)(events).toHaveLength(10000);
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.eventsReceived).toBe(10000);
        });
    });
    (0, vitest_1.describe)("reset during operation", function () {
        (0, vitest_1.it)("handles reset mid-operation safely", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("event.received");
            metrics.emit("event.received");
            metrics.reset();
            metrics.emit("event.received");
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.eventsReceived).toBe(1);
        });
    });
});
// ============================================================================
// Event Shape Validation (simulating malformed events)
// ============================================================================
(0, vitest_1.describe)("Event shape validation", function () {
    (0, vitest_1.describe)("malformed event structures", function () {
        // These test what happens if malformed data somehow gets through
        (0, vitest_1.it)("identifies missing required fields", function () {
            var malformedEvents = [
                {}, // empty
                { id: "abc" }, // missing pubkey, created_at, etc.
                { id: null, pubkey: null }, // null values
                { id: 123, pubkey: 456 }, // wrong types
                { tags: "not-an-array" }, // wrong type for tags
                { tags: [[1, 2, 3]] }, // wrong type for tag elements
            ];
            for (var _i = 0, malformedEvents_1 = malformedEvents; _i < malformedEvents_1.length; _i++) {
                var event_1 = malformedEvents_1[_i];
                // These should be caught by shape validation before processing
                var hasId = typeof (event_1 === null || event_1 === void 0 ? void 0 : event_1.id) === "string";
                var hasPubkey = typeof (event_1 === null || event_1 === void 0 ? void 0 : event_1.pubkey) === "string";
                var hasTags = Array.isArray(event_1 === null || event_1 === void 0 ? void 0 : event_1.tags);
                // At least one should be invalid
                (0, vitest_1.expect)(hasId && hasPubkey && hasTags).toBe(false);
            }
        });
    });
    (0, vitest_1.describe)("timestamp edge cases", function () {
        var testTimestamps = [
            { value: NaN, desc: "NaN" },
            { value: Infinity, desc: "Infinity" },
            { value: -Infinity, desc: "-Infinity" },
            { value: -1, desc: "negative" },
            { value: 0, desc: "zero" },
            { value: 253402300800, desc: "year 10000" }, // Far future
            { value: -62135596800, desc: "year 0001" }, // Far past
            { value: 1.5, desc: "float" },
        ];
        var _loop_1 = function (value, desc) {
            (0, vitest_1.it)("handles ".concat(desc, " timestamp"), function () {
                var isValidTimestamp = typeof value === "number" &&
                    !isNaN(value) &&
                    isFinite(value) &&
                    value >= 0 &&
                    Number.isInteger(value);
                // Timestamps should be validated as positive integers
                if (["NaN", "Infinity", "-Infinity", "negative", "float"].includes(desc)) {
                    (0, vitest_1.expect)(isValidTimestamp).toBe(false);
                }
            });
        };
        for (var _i = 0, testTimestamps_1 = testTimestamps; _i < testTimestamps_1.length; _i++) {
            var _a = testTimestamps_1[_i], value = _a.value, desc = _a.desc;
            _loop_1(value, desc);
        }
    });
});
// ============================================================================
// JSON parsing edge cases (simulating relay responses)
// ============================================================================
(0, vitest_1.describe)("JSON parsing edge cases", function () {
    var malformedJsonCases = [
        { input: "", desc: "empty string" },
        { input: "null", desc: "null literal" },
        { input: "undefined", desc: "undefined literal" },
        { input: "{", desc: "incomplete object" },
        { input: "[", desc: "incomplete array" },
        { input: '{"key": undefined}', desc: "undefined value" },
        { input: "{'key': 'value'}", desc: "single quotes" },
        { input: '{"key": NaN}', desc: "NaN value" },
        { input: '{"key": Infinity}', desc: "Infinity value" },
        { input: "\x00", desc: "null byte" },
        { input: "abc", desc: "plain string" },
        { input: "123", desc: "plain number" },
    ];
    var _loop_2 = function (input, desc) {
        (0, vitest_1.it)("handles malformed JSON: ".concat(desc), function () {
            var parsed;
            var parseError = false;
            try {
                parsed = JSON.parse(input);
            }
            catch (_a) {
                parseError = true;
            }
            // Either it throws or produces something that needs validation
            if (!parseError) {
                // If it parsed, we need to validate the structure
                var isValidRelayMessage = Array.isArray(parsed) && parsed.length >= 2 && typeof parsed[0] === "string";
                // Most malformed cases won't produce valid relay messages
                if (["null literal", "plain number", "plain string"].includes(desc)) {
                    (0, vitest_1.expect)(isValidRelayMessage).toBe(false);
                }
            }
        });
    };
    for (var _i = 0, malformedJsonCases_1 = malformedJsonCases; _i < malformedJsonCases_1.length; _i++) {
        var _a = malformedJsonCases_1[_i], input = _a.input, desc = _a.desc;
        _loop_2(input, desc);
    }
});
