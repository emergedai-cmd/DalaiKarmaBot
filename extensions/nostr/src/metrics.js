"use strict";
/**
 * Comprehensive metrics system for Nostr bus observability.
 * Provides clear insight into what's happening with events, relays, and operations.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetrics = createMetrics;
exports.createNoopMetrics = createNoopMetrics;
/**
 * Create a metrics collector instance.
 * Optionally pass an onMetric callback to receive real-time metric events.
 */
function createMetrics(onMetric) {
    // Counters
    var eventsReceived = 0;
    var eventsProcessed = 0;
    var eventsDuplicate = 0;
    var eventsRejected = {
        invalidShape: 0,
        wrongKind: 0,
        stale: 0,
        future: 0,
        rateLimited: 0,
        invalidSignature: 0,
        oversizedCiphertext: 0,
        oversizedPlaintext: 0,
        decryptFailed: 0,
        selfMessage: 0,
    };
    // Per-relay stats
    var relays = new Map();
    // Rate limiting stats
    var rateLimiting = {
        perSenderHits: 0,
        globalHits: 0,
    };
    // Decrypt stats
    var decrypt = {
        success: 0,
        failure: 0,
    };
    // Memory stats (updated via gauge-style metrics)
    var memory = {
        seenTrackerSize: 0,
        rateLimiterEntries: 0,
    };
    function getOrCreateRelay(url) {
        var relay = relays.get(url);
        if (!relay) {
            relay = {
                connects: 0,
                disconnects: 0,
                reconnects: 0,
                errors: 0,
                messagesReceived: {
                    event: 0,
                    eose: 0,
                    closed: 0,
                    notice: 0,
                    ok: 0,
                    auth: 0,
                },
                circuitBreakerState: "closed",
                circuitBreakerOpens: 0,
                circuitBreakerCloses: 0,
            };
            relays.set(url, relay);
        }
        return relay;
    }
    function emit(name, value, labels) {
        if (value === void 0) { value = 1; }
        // Fire callback if provided
        if (onMetric) {
            onMetric({
                name: name,
                value: value,
                timestamp: Date.now(),
                labels: labels,
            });
        }
        // Update internal counters
        var relayUrl = labels === null || labels === void 0 ? void 0 : labels.relay;
        switch (name) {
            // Event metrics
            case "event.received":
                eventsReceived += value;
                break;
            case "event.processed":
                eventsProcessed += value;
                break;
            case "event.duplicate":
                eventsDuplicate += value;
                break;
            case "event.rejected.invalid_shape":
                eventsRejected.invalidShape += value;
                break;
            case "event.rejected.wrong_kind":
                eventsRejected.wrongKind += value;
                break;
            case "event.rejected.stale":
                eventsRejected.stale += value;
                break;
            case "event.rejected.future":
                eventsRejected.future += value;
                break;
            case "event.rejected.rate_limited":
                eventsRejected.rateLimited += value;
                break;
            case "event.rejected.invalid_signature":
                eventsRejected.invalidSignature += value;
                break;
            case "event.rejected.oversized_ciphertext":
                eventsRejected.oversizedCiphertext += value;
                break;
            case "event.rejected.oversized_plaintext":
                eventsRejected.oversizedPlaintext += value;
                break;
            case "event.rejected.decrypt_failed":
                eventsRejected.decryptFailed += value;
                break;
            case "event.rejected.self_message":
                eventsRejected.selfMessage += value;
                break;
            // Relay metrics
            case "relay.connect":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).connects += value;
                }
                break;
            case "relay.disconnect":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).disconnects += value;
                }
                break;
            case "relay.reconnect":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).reconnects += value;
                }
                break;
            case "relay.error":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).errors += value;
                }
                break;
            case "relay.message.event":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).messagesReceived.event += value;
                }
                break;
            case "relay.message.eose":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).messagesReceived.eose += value;
                }
                break;
            case "relay.message.closed":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).messagesReceived.closed += value;
                }
                break;
            case "relay.message.notice":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).messagesReceived.notice += value;
                }
                break;
            case "relay.message.ok":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).messagesReceived.ok += value;
                }
                break;
            case "relay.message.auth":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).messagesReceived.auth += value;
                }
                break;
            case "relay.circuit_breaker.open":
                if (relayUrl) {
                    var r = getOrCreateRelay(relayUrl);
                    r.circuitBreakerState = "open";
                    r.circuitBreakerOpens += value;
                }
                break;
            case "relay.circuit_breaker.close":
                if (relayUrl) {
                    var r = getOrCreateRelay(relayUrl);
                    r.circuitBreakerState = "closed";
                    r.circuitBreakerCloses += value;
                }
                break;
            case "relay.circuit_breaker.half_open":
                if (relayUrl) {
                    getOrCreateRelay(relayUrl).circuitBreakerState = "half_open";
                }
                break;
            // Rate limiting
            case "rate_limit.per_sender":
                rateLimiting.perSenderHits += value;
                break;
            case "rate_limit.global":
                rateLimiting.globalHits += value;
                break;
            // Decrypt
            case "decrypt.success":
                decrypt.success += value;
                break;
            case "decrypt.failure":
                decrypt.failure += value;
                break;
            // Memory (gauge-style - value replaces, not adds)
            case "memory.seen_tracker_size":
                memory.seenTrackerSize = value;
                break;
            case "memory.rate_limiter_entries":
                memory.rateLimiterEntries = value;
                break;
        }
    }
    function getSnapshot() {
        // Convert relay map to object
        var relaysObj = {};
        for (var _i = 0, relays_1 = relays; _i < relays_1.length; _i++) {
            var _a = relays_1[_i], url = _a[0], stats = _a[1];
            relaysObj[url] = __assign(__assign({}, stats), { messagesReceived: __assign({}, stats.messagesReceived) });
        }
        return {
            eventsReceived: eventsReceived,
            eventsProcessed: eventsProcessed,
            eventsDuplicate: eventsDuplicate,
            eventsRejected: __assign({}, eventsRejected),
            relays: relaysObj,
            rateLimiting: __assign({}, rateLimiting),
            decrypt: __assign({}, decrypt),
            memory: __assign({}, memory),
            snapshotAt: Date.now(),
        };
    }
    function reset() {
        eventsReceived = 0;
        eventsProcessed = 0;
        eventsDuplicate = 0;
        Object.assign(eventsRejected, {
            invalidShape: 0,
            wrongKind: 0,
            stale: 0,
            future: 0,
            rateLimited: 0,
            invalidSignature: 0,
            oversizedCiphertext: 0,
            oversizedPlaintext: 0,
            decryptFailed: 0,
            selfMessage: 0,
        });
        relays.clear();
        rateLimiting.perSenderHits = 0;
        rateLimiting.globalHits = 0;
        decrypt.success = 0;
        decrypt.failure = 0;
        memory.seenTrackerSize = 0;
        memory.rateLimiterEntries = 0;
    }
    return { emit: emit, getSnapshot: getSnapshot, reset: reset };
}
/**
 * Create a no-op metrics instance (for when metrics are disabled).
 */
function createNoopMetrics() {
    var emptySnapshot = {
        eventsReceived: 0,
        eventsProcessed: 0,
        eventsDuplicate: 0,
        eventsRejected: {
            invalidShape: 0,
            wrongKind: 0,
            stale: 0,
            future: 0,
            rateLimited: 0,
            invalidSignature: 0,
            oversizedCiphertext: 0,
            oversizedPlaintext: 0,
            decryptFailed: 0,
            selfMessage: 0,
        },
        relays: {},
        rateLimiting: { perSenderHits: 0, globalHits: 0 },
        decrypt: { success: 0, failure: 0 },
        memory: { seenTrackerSize: 0, rateLimiterEntries: 0 },
        snapshotAt: 0,
    };
    return {
        emit: function () { },
        getSnapshot: function () { return (__assign(__assign({}, emptySnapshot), { snapshotAt: Date.now() })); },
        reset: function () { },
    };
}
