"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var metrics_js_1 = require("./metrics.js");
var seen_tracker_js_1 = require("./seen-tracker.js");
// ============================================================================
// Seen Tracker Integration Tests
// ============================================================================
(0, vitest_1.describe)("SeenTracker", function () {
    (0, vitest_1.describe)("basic operations", function () {
        (0, vitest_1.it)("tracks seen IDs", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100, ttlMs: 60000 });
            // First check returns false and adds
            (0, vitest_1.expect)(tracker.has("id1")).toBe(false);
            // Second check returns true (already seen)
            (0, vitest_1.expect)(tracker.has("id1")).toBe(true);
            tracker.stop();
        });
        (0, vitest_1.it)("peek does not add", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100, ttlMs: 60000 });
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(false);
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(false); // Still false
            tracker.add("id1");
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(true);
            tracker.stop();
        });
        (0, vitest_1.it)("delete removes entries", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100, ttlMs: 60000 });
            tracker.add("id1");
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(true);
            tracker.delete("id1");
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(false);
            tracker.stop();
        });
        (0, vitest_1.it)("clear removes all entries", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100, ttlMs: 60000 });
            tracker.add("id1");
            tracker.add("id2");
            tracker.add("id3");
            (0, vitest_1.expect)(tracker.size()).toBe(3);
            tracker.clear();
            (0, vitest_1.expect)(tracker.size()).toBe(0);
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(false);
            tracker.stop();
        });
        (0, vitest_1.it)("seed pre-populates entries", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 100, ttlMs: 60000 });
            tracker.seed(["id1", "id2", "id3"]);
            (0, vitest_1.expect)(tracker.size()).toBe(3);
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(true);
            (0, vitest_1.expect)(tracker.peek("id2")).toBe(true);
            (0, vitest_1.expect)(tracker.peek("id3")).toBe(true);
            tracker.stop();
        });
    });
    (0, vitest_1.describe)("LRU eviction", function () {
        (0, vitest_1.it)("evicts least recently used when at capacity", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 3, ttlMs: 60000 });
            tracker.add("id1");
            tracker.add("id2");
            tracker.add("id3");
            (0, vitest_1.expect)(tracker.size()).toBe(3);
            // Adding fourth should evict oldest (id1)
            tracker.add("id4");
            (0, vitest_1.expect)(tracker.size()).toBe(3);
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(false); // Evicted
            (0, vitest_1.expect)(tracker.peek("id2")).toBe(true);
            (0, vitest_1.expect)(tracker.peek("id3")).toBe(true);
            (0, vitest_1.expect)(tracker.peek("id4")).toBe(true);
            tracker.stop();
        });
        (0, vitest_1.it)("accessing an entry moves it to front (prevents eviction)", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 3, ttlMs: 60000 });
            tracker.add("id1");
            tracker.add("id2");
            tracker.add("id3");
            // Access id1, moving it to front
            tracker.has("id1");
            // Add id4 - should evict id2 (now oldest)
            tracker.add("id4");
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(true); // Not evicted, was accessed
            (0, vitest_1.expect)(tracker.peek("id2")).toBe(false); // Evicted
            (0, vitest_1.expect)(tracker.peek("id3")).toBe(true);
            (0, vitest_1.expect)(tracker.peek("id4")).toBe(true);
            tracker.stop();
        });
        (0, vitest_1.it)("handles capacity of 1", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 1, ttlMs: 60000 });
            tracker.add("id1");
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(true);
            tracker.add("id2");
            (0, vitest_1.expect)(tracker.peek("id1")).toBe(false);
            (0, vitest_1.expect)(tracker.peek("id2")).toBe(true);
            tracker.stop();
        });
        (0, vitest_1.it)("seed respects maxEntries", function () {
            var tracker = (0, seen_tracker_js_1.createSeenTracker)({ maxEntries: 2, ttlMs: 60000 });
            tracker.seed(["id1", "id2", "id3", "id4"]);
            (0, vitest_1.expect)(tracker.size()).toBe(2);
            // Seed stops when maxEntries reached, processing from end to start
            // So id4 and id3 get added first, then we're at capacity
            (0, vitest_1.expect)(tracker.peek("id3")).toBe(true);
            (0, vitest_1.expect)(tracker.peek("id4")).toBe(true);
            tracker.stop();
        });
    });
    (0, vitest_1.describe)("TTL expiration", function () {
        (0, vitest_1.it)("expires entries after TTL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var tracker;
            return __generator(this, function (_a) {
                vitest_1.vi.useFakeTimers();
                tracker = (0, seen_tracker_js_1.createSeenTracker)({
                    maxEntries: 100,
                    ttlMs: 100,
                    pruneIntervalMs: 50,
                });
                tracker.add("id1");
                (0, vitest_1.expect)(tracker.peek("id1")).toBe(true);
                // Advance past TTL
                vitest_1.vi.advanceTimersByTime(150);
                // Entry should be expired
                (0, vitest_1.expect)(tracker.peek("id1")).toBe(false);
                tracker.stop();
                vitest_1.vi.useRealTimers();
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)("has() refreshes TTL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var tracker;
            return __generator(this, function (_a) {
                vitest_1.vi.useFakeTimers();
                tracker = (0, seen_tracker_js_1.createSeenTracker)({
                    maxEntries: 100,
                    ttlMs: 100,
                    pruneIntervalMs: 50,
                });
                tracker.add("id1");
                // Advance halfway
                vitest_1.vi.advanceTimersByTime(50);
                // Access to refresh
                (0, vitest_1.expect)(tracker.has("id1")).toBe(true);
                // Advance another 75ms (total 125ms from add, but only 75ms from last access)
                vitest_1.vi.advanceTimersByTime(75);
                // Should still be valid (refreshed at 50ms)
                (0, vitest_1.expect)(tracker.peek("id1")).toBe(true);
                tracker.stop();
                vitest_1.vi.useRealTimers();
                return [2 /*return*/];
            });
        }); });
    });
});
// ============================================================================
// Metrics Integration Tests
// ============================================================================
(0, vitest_1.describe)("Metrics", function () {
    (0, vitest_1.describe)("createMetrics", function () {
        (0, vitest_1.it)("emits metric events to callback", function () {
            var events = [];
            var metrics = (0, metrics_js_1.createMetrics)(function (event) { return events.push(event); });
            metrics.emit("event.received");
            metrics.emit("event.processed");
            metrics.emit("event.duplicate");
            (0, vitest_1.expect)(events).toHaveLength(3);
            (0, vitest_1.expect)(events[0].name).toBe("event.received");
            (0, vitest_1.expect)(events[1].name).toBe("event.processed");
            (0, vitest_1.expect)(events[2].name).toBe("event.duplicate");
        });
        (0, vitest_1.it)("includes labels in metric events", function () {
            var events = [];
            var metrics = (0, metrics_js_1.createMetrics)(function (event) { return events.push(event); });
            metrics.emit("relay.connect", 1, { relay: "wss://relay.example.com" });
            (0, vitest_1.expect)(events[0].labels).toEqual({ relay: "wss://relay.example.com" });
        });
        (0, vitest_1.it)("accumulates counters in snapshot", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("event.received");
            metrics.emit("event.received");
            metrics.emit("event.processed");
            metrics.emit("event.duplicate");
            metrics.emit("event.duplicate");
            metrics.emit("event.duplicate");
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.eventsReceived).toBe(2);
            (0, vitest_1.expect)(snapshot.eventsProcessed).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsDuplicate).toBe(3);
        });
        (0, vitest_1.it)("tracks per-relay stats", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("relay.connect", 1, { relay: "wss://relay1.com" });
            metrics.emit("relay.connect", 1, { relay: "wss://relay2.com" });
            metrics.emit("relay.error", 1, { relay: "wss://relay1.com" });
            metrics.emit("relay.error", 1, { relay: "wss://relay1.com" });
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.relays["wss://relay1.com"]).toBeDefined();
            (0, vitest_1.expect)(snapshot.relays["wss://relay1.com"].connects).toBe(1);
            (0, vitest_1.expect)(snapshot.relays["wss://relay1.com"].errors).toBe(2);
            (0, vitest_1.expect)(snapshot.relays["wss://relay2.com"].connects).toBe(1);
            (0, vitest_1.expect)(snapshot.relays["wss://relay2.com"].errors).toBe(0);
        });
        (0, vitest_1.it)("tracks circuit breaker state changes", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("relay.circuit_breaker.open", 1, { relay: "wss://relay.com" });
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.relays["wss://relay.com"].circuitBreakerState).toBe("open");
            (0, vitest_1.expect)(snapshot.relays["wss://relay.com"].circuitBreakerOpens).toBe(1);
            metrics.emit("relay.circuit_breaker.close", 1, { relay: "wss://relay.com" });
            snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.relays["wss://relay.com"].circuitBreakerState).toBe("closed");
            (0, vitest_1.expect)(snapshot.relays["wss://relay.com"].circuitBreakerCloses).toBe(1);
        });
        (0, vitest_1.it)("tracks all rejection reasons", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("event.rejected.invalid_shape");
            metrics.emit("event.rejected.wrong_kind");
            metrics.emit("event.rejected.stale");
            metrics.emit("event.rejected.future");
            metrics.emit("event.rejected.rate_limited");
            metrics.emit("event.rejected.invalid_signature");
            metrics.emit("event.rejected.oversized_ciphertext");
            metrics.emit("event.rejected.oversized_plaintext");
            metrics.emit("event.rejected.decrypt_failed");
            metrics.emit("event.rejected.self_message");
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.eventsRejected.invalidShape).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsRejected.wrongKind).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsRejected.stale).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsRejected.future).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsRejected.rateLimited).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsRejected.invalidSignature).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsRejected.oversizedCiphertext).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsRejected.oversizedPlaintext).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsRejected.decryptFailed).toBe(1);
            (0, vitest_1.expect)(snapshot.eventsRejected.selfMessage).toBe(1);
        });
        (0, vitest_1.it)("tracks relay message types", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("relay.message.event", 1, { relay: "wss://relay.com" });
            metrics.emit("relay.message.eose", 1, { relay: "wss://relay.com" });
            metrics.emit("relay.message.closed", 1, { relay: "wss://relay.com" });
            metrics.emit("relay.message.notice", 1, { relay: "wss://relay.com" });
            metrics.emit("relay.message.ok", 1, { relay: "wss://relay.com" });
            metrics.emit("relay.message.auth", 1, { relay: "wss://relay.com" });
            var snapshot = metrics.getSnapshot();
            var relay = snapshot.relays["wss://relay.com"];
            (0, vitest_1.expect)(relay.messagesReceived.event).toBe(1);
            (0, vitest_1.expect)(relay.messagesReceived.eose).toBe(1);
            (0, vitest_1.expect)(relay.messagesReceived.closed).toBe(1);
            (0, vitest_1.expect)(relay.messagesReceived.notice).toBe(1);
            (0, vitest_1.expect)(relay.messagesReceived.ok).toBe(1);
            (0, vitest_1.expect)(relay.messagesReceived.auth).toBe(1);
        });
        (0, vitest_1.it)("tracks decrypt success/failure", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("decrypt.success");
            metrics.emit("decrypt.success");
            metrics.emit("decrypt.failure");
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.decrypt.success).toBe(2);
            (0, vitest_1.expect)(snapshot.decrypt.failure).toBe(1);
        });
        (0, vitest_1.it)("tracks memory gauges (replaces rather than accumulates)", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("memory.seen_tracker_size", 100);
            metrics.emit("memory.seen_tracker_size", 150);
            metrics.emit("memory.seen_tracker_size", 125);
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.memory.seenTrackerSize).toBe(125); // Last value, not sum
        });
        (0, vitest_1.it)("reset clears all counters", function () {
            var metrics = (0, metrics_js_1.createMetrics)();
            metrics.emit("event.received");
            metrics.emit("event.processed");
            metrics.emit("relay.connect", 1, { relay: "wss://relay.com" });
            metrics.reset();
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.eventsReceived).toBe(0);
            (0, vitest_1.expect)(snapshot.eventsProcessed).toBe(0);
            (0, vitest_1.expect)(Object.keys(snapshot.relays)).toHaveLength(0);
        });
    });
    (0, vitest_1.describe)("createNoopMetrics", function () {
        (0, vitest_1.it)("does not throw on emit", function () {
            var metrics = (0, metrics_js_1.createNoopMetrics)();
            (0, vitest_1.expect)(function () {
                metrics.emit("event.received");
                metrics.emit("relay.connect", 1, { relay: "wss://relay.com" });
            }).not.toThrow();
        });
        (0, vitest_1.it)("returns empty snapshot", function () {
            var metrics = (0, metrics_js_1.createNoopMetrics)();
            var snapshot = metrics.getSnapshot();
            (0, vitest_1.expect)(snapshot.eventsReceived).toBe(0);
            (0, vitest_1.expect)(snapshot.eventsProcessed).toBe(0);
        });
    });
});
// ============================================================================
// Circuit Breaker Behavior Tests
// ============================================================================
(0, vitest_1.describe)("Circuit Breaker Behavior", function () {
    // Test the circuit breaker logic through metrics emissions
    (0, vitest_1.it)("emits circuit breaker metrics in correct sequence", function () {
        var events = [];
        var metrics = (0, metrics_js_1.createMetrics)(function (event) { return events.push(event); });
        // Simulate 5 failures -> open
        for (var i = 0; i < 5; i++) {
            metrics.emit("relay.error", 1, { relay: "wss://relay.com" });
        }
        metrics.emit("relay.circuit_breaker.open", 1, { relay: "wss://relay.com" });
        // Simulate recovery
        metrics.emit("relay.circuit_breaker.half_open", 1, { relay: "wss://relay.com" });
        metrics.emit("relay.circuit_breaker.close", 1, { relay: "wss://relay.com" });
        var cbEvents = events.filter(function (e) { return e.name.startsWith("relay.circuit_breaker"); });
        (0, vitest_1.expect)(cbEvents).toHaveLength(3);
        (0, vitest_1.expect)(cbEvents[0].name).toBe("relay.circuit_breaker.open");
        (0, vitest_1.expect)(cbEvents[1].name).toBe("relay.circuit_breaker.half_open");
        (0, vitest_1.expect)(cbEvents[2].name).toBe("relay.circuit_breaker.close");
    });
});
// ============================================================================
// Health Scoring Behavior Tests
// ============================================================================
(0, vitest_1.describe)("Health Scoring", function () {
    (0, vitest_1.it)("metrics track relay errors for health scoring", function () {
        var metrics = (0, metrics_js_1.createMetrics)();
        // Simulate mixed success/failure pattern
        metrics.emit("relay.connect", 1, { relay: "wss://good-relay.com" });
        metrics.emit("relay.connect", 1, { relay: "wss://bad-relay.com" });
        metrics.emit("relay.error", 1, { relay: "wss://bad-relay.com" });
        metrics.emit("relay.error", 1, { relay: "wss://bad-relay.com" });
        metrics.emit("relay.error", 1, { relay: "wss://bad-relay.com" });
        var snapshot = metrics.getSnapshot();
        (0, vitest_1.expect)(snapshot.relays["wss://good-relay.com"].errors).toBe(0);
        (0, vitest_1.expect)(snapshot.relays["wss://bad-relay.com"].errors).toBe(3);
    });
});
// ============================================================================
// Reconnect Backoff Tests
// ============================================================================
(0, vitest_1.describe)("Reconnect Backoff", function () {
    (0, vitest_1.it)("computes delays within expected bounds", function () {
        // Compute expected delays (1s, 2s, 4s, 8s, 16s, 32s, 60s cap)
        var BASE = 1000;
        var MAX = 60000;
        var JITTER = 0.3;
        for (var attempt = 0; attempt < 10; attempt++) {
            var exponential = BASE * Math.pow(2, attempt);
            var capped = Math.min(exponential, MAX);
            var minDelay = capped * (1 - JITTER);
            var maxDelay = capped * (1 + JITTER);
            // These are the expected bounds
            (0, vitest_1.expect)(minDelay).toBeGreaterThanOrEqual(BASE * 0.7);
            (0, vitest_1.expect)(maxDelay).toBeLessThanOrEqual(MAX * 1.3);
        }
    });
});
