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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RELAYS = void 0;
exports.validatePrivateKey = validatePrivateKey;
exports.getPublicKeyFromPrivate = getPublicKeyFromPrivate;
exports.startNostrBus = startNostrBus;
exports.isValidPubkey = isValidPubkey;
exports.normalizePubkey = normalizePubkey;
exports.pubkeyToNpub = pubkeyToNpub;
var nostr_tools_1 = require("nostr-tools");
var nip04_1 = require("nostr-tools/nip04");
var metrics_js_1 = require("./metrics.js");
var nostr_profile_js_1 = require("./nostr-profile.js");
var nostr_state_store_js_1 = require("./nostr-state-store.js");
var seen_tracker_js_1 = require("./seen-tracker.js");
exports.DEFAULT_RELAYS = ["wss://relay.damus.io", "wss://nos.lol"];
// ============================================================================
// Constants
// ============================================================================
var STARTUP_LOOKBACK_SEC = 120; // tolerate relay lag / clock skew
var MAX_PERSISTED_EVENT_IDS = 5000;
var STATE_PERSIST_DEBOUNCE_MS = 5000; // Debounce state writes
// Circuit breaker configuration
var CIRCUIT_BREAKER_THRESHOLD = 5; // failures before opening
var CIRCUIT_BREAKER_RESET_MS = 30000; // 30 seconds before half-open
// Health tracker configuration
var HEALTH_WINDOW_MS = 60000; // 1 minute window for health stats
function createCircuitBreaker(relay, metrics, threshold, resetMs) {
    if (threshold === void 0) { threshold = CIRCUIT_BREAKER_THRESHOLD; }
    if (resetMs === void 0) { resetMs = CIRCUIT_BREAKER_RESET_MS; }
    var state = {
        state: "closed",
        failures: 0,
        lastFailure: 0,
        lastSuccess: Date.now(),
    };
    return {
        canAttempt: function () {
            if (state.state === "closed") {
                return true;
            }
            if (state.state === "open") {
                // Check if enough time has passed to try half-open
                if (Date.now() - state.lastFailure >= resetMs) {
                    state.state = "half_open";
                    metrics.emit("relay.circuit_breaker.half_open", 1, { relay: relay });
                    return true;
                }
                return false;
            }
            // half_open: allow one attempt
            return true;
        },
        recordSuccess: function () {
            if (state.state === "half_open") {
                state.state = "closed";
                state.failures = 0;
                metrics.emit("relay.circuit_breaker.close", 1, { relay: relay });
            }
            else if (state.state === "closed") {
                state.failures = 0;
            }
            state.lastSuccess = Date.now();
        },
        recordFailure: function () {
            state.failures++;
            state.lastFailure = Date.now();
            if (state.state === "half_open") {
                state.state = "open";
                metrics.emit("relay.circuit_breaker.open", 1, { relay: relay });
            }
            else if (state.state === "closed" && state.failures >= threshold) {
                state.state = "open";
                metrics.emit("relay.circuit_breaker.open", 1, { relay: relay });
            }
        },
        getState: function () {
            return state.state;
        },
    };
}
function createRelayHealthTracker() {
    var stats = new Map();
    function getOrCreate(relay) {
        var s = stats.get(relay);
        if (!s) {
            s = {
                successCount: 0,
                failureCount: 0,
                latencySum: 0,
                latencyCount: 0,
                lastSuccess: 0,
                lastFailure: 0,
            };
            stats.set(relay, s);
        }
        return s;
    }
    return {
        recordSuccess: function (relay, latencyMs) {
            var s = getOrCreate(relay);
            s.successCount++;
            s.latencySum += latencyMs;
            s.latencyCount++;
            s.lastSuccess = Date.now();
        },
        recordFailure: function (relay) {
            var s = getOrCreate(relay);
            s.failureCount++;
            s.lastFailure = Date.now();
        },
        getScore: function (relay) {
            var s = stats.get(relay);
            if (!s) {
                return 0.5;
            } // Unknown relay gets neutral score
            var total = s.successCount + s.failureCount;
            if (total === 0) {
                return 0.5;
            }
            // Success rate (0-1)
            var successRate = s.successCount / total;
            // Recency bonus (prefer recently successful relays)
            var now = Date.now();
            var recencyBonus = s.lastSuccess > s.lastFailure
                ? Math.max(0, 1 - (now - s.lastSuccess) / HEALTH_WINDOW_MS) * 0.2
                : 0;
            // Latency penalty (lower is better)
            var avgLatency = s.latencyCount > 0 ? s.latencySum / s.latencyCount : 1000;
            var latencyPenalty = Math.min(0.2, avgLatency / 10000);
            return Math.max(0, Math.min(1, successRate + recencyBonus - latencyPenalty));
        },
        getSortedRelays: function (relays) {
            var _this = this;
            return __spreadArray([], relays, true).toSorted(function (a, b) { return _this.getScore(b) - _this.getScore(a); });
        },
    };
}
// ============================================================================
// Key Validation
// ============================================================================
/**
 * Validate and normalize a private key (accepts hex or nsec format)
 */
function validatePrivateKey(key) {
    var trimmed = key.trim();
    // Handle nsec (bech32) format
    if (trimmed.startsWith("nsec1")) {
        var decoded = nostr_tools_1.nip19.decode(trimmed);
        if (decoded.type !== "nsec") {
            throw new Error("Invalid nsec key: wrong type");
        }
        return decoded.data;
    }
    // Handle hex format
    if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) {
        throw new Error("Private key must be 64 hex characters or nsec bech32 format");
    }
    // Convert hex string to Uint8Array
    var bytes = new Uint8Array(32);
    for (var i = 0; i < 32; i++) {
        bytes[i] = parseInt(trimmed.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}
/**
 * Get public key from private key (hex or nsec format)
 */
function getPublicKeyFromPrivate(privateKey) {
    var sk = validatePrivateKey(privateKey);
    return (0, nostr_tools_1.getPublicKey)(sk);
}
// ============================================================================
// Main Bus
// ============================================================================
/**
 * Start the Nostr DM bus - subscribes to NIP-04 encrypted DMs
 */
function startNostrBus(options) {
    return __awaiter(this, void 0, void 0, function () {
        function scheduleStatePersist(eventCreatedAt, eventId) {
            lastProcessedAt = Math.max(lastProcessedAt, eventCreatedAt);
            recentEventIds.push(eventId);
            if (recentEventIds.length > MAX_PERSISTED_EVENT_IDS) {
                recentEventIds = recentEventIds.slice(-MAX_PERSISTED_EVENT_IDS);
            }
            if (pendingWrite) {
                clearTimeout(pendingWrite);
            }
            pendingWrite = setTimeout(function () {
                (0, nostr_state_store_js_1.writeNostrBusState)({
                    accountId: accountId,
                    lastProcessedAt: lastProcessedAt,
                    gatewayStartedAt: gatewayStartedAt,
                    recentEventIds: recentEventIds,
                }).catch(function (err) { return onError === null || onError === void 0 ? void 0 : onError(err, "persist state"); });
            }, STATE_PERSIST_DEBOUNCE_MS);
        }
        // Event handler
        function handleEvent(event) {
            return __awaiter(this, void 0, void 0, function () {
                var targetsUs, _i, _a, t, plaintext, replyTo, err_1;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, 3, 4]);
                            metrics.emit("event.received");
                            // Fast dedupe check (handles relay reconnections)
                            if (seen.peek(event.id) || inflight.has(event.id)) {
                                metrics.emit("event.duplicate");
                                return [2 /*return*/];
                            }
                            inflight.add(event.id);
                            // Self-message loop prevention: skip our own messages
                            if (event.pubkey === pk) {
                                metrics.emit("event.rejected.self_message");
                                return [2 /*return*/];
                            }
                            // Skip events older than our `since` (relay may ignore filter)
                            if (event.created_at < since) {
                                metrics.emit("event.rejected.stale");
                                return [2 /*return*/];
                            }
                            targetsUs = false;
                            for (_i = 0, _a = event.tags; _i < _a.length; _i++) {
                                t = _a[_i];
                                if (t[0] === "p" && t[1] === pk) {
                                    targetsUs = true;
                                    break;
                                }
                            }
                            if (!targetsUs) {
                                metrics.emit("event.rejected.wrong_kind");
                                return [2 /*return*/];
                            }
                            // Verify signature (must pass before we trust the event)
                            if (!(0, nostr_tools_1.verifyEvent)(event)) {
                                metrics.emit("event.rejected.invalid_signature");
                                onError === null || onError === void 0 ? void 0 : onError(new Error("Invalid signature"), "event ".concat(event.id));
                                return [2 /*return*/];
                            }
                            // Mark seen AFTER verify (don't cache invalid IDs)
                            seen.add(event.id);
                            metrics.emit("memory.seen_tracker_size", seen.size());
                            plaintext = void 0;
                            try {
                                plaintext = (0, nip04_1.decrypt)(sk, event.pubkey, event.content);
                                metrics.emit("decrypt.success");
                            }
                            catch (err) {
                                metrics.emit("decrypt.failure");
                                metrics.emit("event.rejected.decrypt_failed");
                                onError === null || onError === void 0 ? void 0 : onError(err, "decrypt from ".concat(event.pubkey));
                                return [2 /*return*/];
                            }
                            replyTo = function (text) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, sendEncryptedDm(pool, sk, event.pubkey, text, relays, metrics, circuitBreakers, healthTracker, onError)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            // Call the message handler
                            return [4 /*yield*/, onMessage(event.pubkey, plaintext, replyTo)];
                        case 1:
                            // Call the message handler
                            _b.sent();
                            // Mark as processed
                            metrics.emit("event.processed");
                            // Persist progress (debounced)
                            scheduleStatePersist(event.created_at, event.id);
                            return [3 /*break*/, 4];
                        case 2:
                            err_1 = _b.sent();
                            onError === null || onError === void 0 ? void 0 : onError(err_1, "event ".concat(event.id));
                            return [3 /*break*/, 4];
                        case 3:
                            inflight.delete(event.id);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        var privateKey, _a, relays, onMessage, onError, onEose, onMetric, _b, maxSeenEntries, _c, seenTtlMs, sk, pk, pool, accountId, gatewayStartedAt, metrics, seen, circuitBreakers, healthTracker, _i, relays_1, relay, state, baseSince, since, pendingWrite, lastProcessedAt, recentEventIds, inflight, sub, sendDm, publishProfile, getProfileState;
        var _this = this;
        var _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    privateKey = options.privateKey, _a = options.relays, relays = _a === void 0 ? exports.DEFAULT_RELAYS : _a, onMessage = options.onMessage, onError = options.onError, onEose = options.onEose, onMetric = options.onMetric, _b = options.maxSeenEntries, maxSeenEntries = _b === void 0 ? 100000 : _b, _c = options.seenTtlMs, seenTtlMs = _c === void 0 ? 60 * 60 * 1000 : _c;
                    sk = validatePrivateKey(privateKey);
                    pk = (0, nostr_tools_1.getPublicKey)(sk);
                    pool = new nostr_tools_1.SimplePool();
                    accountId = (_d = options.accountId) !== null && _d !== void 0 ? _d : pk.slice(0, 16);
                    gatewayStartedAt = Math.floor(Date.now() / 1000);
                    metrics = onMetric ? (0, metrics_js_1.createMetrics)(onMetric) : (0, metrics_js_1.createNoopMetrics)();
                    seen = (0, seen_tracker_js_1.createSeenTracker)({
                        maxEntries: maxSeenEntries,
                        ttlMs: seenTtlMs,
                    });
                    circuitBreakers = new Map();
                    healthTracker = createRelayHealthTracker();
                    for (_i = 0, relays_1 = relays; _i < relays_1.length; _i++) {
                        relay = relays_1[_i];
                        circuitBreakers.set(relay, createCircuitBreaker(relay, metrics));
                    }
                    return [4 /*yield*/, (0, nostr_state_store_js_1.readNostrBusState)({ accountId: accountId })];
                case 1:
                    state = _k.sent();
                    baseSince = (0, nostr_state_store_js_1.computeSinceTimestamp)(state, gatewayStartedAt);
                    since = Math.max(0, baseSince - STARTUP_LOOKBACK_SEC);
                    // Seed in-memory dedupe with recent IDs from disk (prevents restart replay)
                    if ((_e = state === null || state === void 0 ? void 0 : state.recentEventIds) === null || _e === void 0 ? void 0 : _e.length) {
                        seen.seed(state.recentEventIds);
                    }
                    // Persist startup timestamp
                    return [4 /*yield*/, (0, nostr_state_store_js_1.writeNostrBusState)({
                            accountId: accountId,
                            lastProcessedAt: (_f = state === null || state === void 0 ? void 0 : state.lastProcessedAt) !== null && _f !== void 0 ? _f : gatewayStartedAt,
                            gatewayStartedAt: gatewayStartedAt,
                            recentEventIds: (_g = state === null || state === void 0 ? void 0 : state.recentEventIds) !== null && _g !== void 0 ? _g : [],
                        })];
                case 2:
                    // Persist startup timestamp
                    _k.sent();
                    lastProcessedAt = (_h = state === null || state === void 0 ? void 0 : state.lastProcessedAt) !== null && _h !== void 0 ? _h : gatewayStartedAt;
                    recentEventIds = ((_j = state === null || state === void 0 ? void 0 : state.recentEventIds) !== null && _j !== void 0 ? _j : []).slice(-MAX_PERSISTED_EVENT_IDS);
                    inflight = new Set();
                    sub = pool.subscribeMany(relays, [{ kinds: [4], "#p": [pk], since: since }], {
                        onevent: handleEvent,
                        oneose: function () {
                            // EOSE handler - called when all stored events have been received
                            for (var _i = 0, relays_2 = relays; _i < relays_2.length; _i++) {
                                var relay = relays_2[_i];
                                metrics.emit("relay.message.eose", 1, { relay: relay });
                            }
                            onEose === null || onEose === void 0 ? void 0 : onEose(relays.join(", "));
                        },
                        onclose: function (reason) {
                            var _a;
                            // Handle subscription close
                            for (var _i = 0, relays_3 = relays; _i < relays_3.length; _i++) {
                                var relay = relays_3[_i];
                                metrics.emit("relay.message.closed", 1, { relay: relay });
                                (_a = options.onDisconnect) === null || _a === void 0 ? void 0 : _a.call(options, relay);
                            }
                            onError === null || onError === void 0 ? void 0 : onError(new Error("Subscription closed: ".concat(reason.join(", "))), "subscription");
                        },
                    });
                    sendDm = function (toPubkey, text) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sendEncryptedDm(pool, sk, toPubkey, text, relays, metrics, circuitBreakers, healthTracker, onError)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    publishProfile = function (profile) { return __awaiter(_this, void 0, void 0, function () {
                        var profileState, lastPublishedAt, result, publishResults, _i, _a, relay, _b, _c, _d, relay, error;
                        var _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0: return [4 /*yield*/, (0, nostr_state_store_js_1.readNostrProfileState)({ accountId: accountId })];
                                case 1:
                                    profileState = _f.sent();
                                    lastPublishedAt = (_e = profileState === null || profileState === void 0 ? void 0 : profileState.lastPublishedAt) !== null && _e !== void 0 ? _e : undefined;
                                    return [4 /*yield*/, (0, nostr_profile_js_1.publishProfile)(pool, sk, relays, profile, lastPublishedAt)];
                                case 2:
                                    result = _f.sent();
                                    publishResults = {};
                                    for (_i = 0, _a = result.successes; _i < _a.length; _i++) {
                                        relay = _a[_i];
                                        publishResults[relay] = "ok";
                                    }
                                    for (_b = 0, _c = result.failures; _b < _c.length; _b++) {
                                        _d = _c[_b], relay = _d.relay, error = _d.error;
                                        publishResults[relay] = error === "timeout" ? "timeout" : "failed";
                                    }
                                    // Persist the publish state
                                    return [4 /*yield*/, (0, nostr_state_store_js_1.writeNostrProfileState)({
                                            accountId: accountId,
                                            lastPublishedAt: result.createdAt,
                                            lastPublishedEventId: result.eventId,
                                            lastPublishResults: publishResults,
                                        })];
                                case 3:
                                    // Persist the publish state
                                    _f.sent();
                                    return [2 /*return*/, result];
                            }
                        });
                    }); };
                    getProfileState = function () { return __awaiter(_this, void 0, void 0, function () {
                        var state;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, (0, nostr_state_store_js_1.readNostrProfileState)({ accountId: accountId })];
                                case 1:
                                    state = _d.sent();
                                    return [2 /*return*/, {
                                            lastPublishedAt: (_a = state === null || state === void 0 ? void 0 : state.lastPublishedAt) !== null && _a !== void 0 ? _a : null,
                                            lastPublishedEventId: (_b = state === null || state === void 0 ? void 0 : state.lastPublishedEventId) !== null && _b !== void 0 ? _b : null,
                                            lastPublishResults: (_c = state === null || state === void 0 ? void 0 : state.lastPublishResults) !== null && _c !== void 0 ? _c : null,
                                        }];
                            }
                        });
                    }); };
                    return [2 /*return*/, {
                            close: function () {
                                sub.close();
                                seen.stop();
                                // Flush pending state write synchronously on close
                                if (pendingWrite) {
                                    clearTimeout(pendingWrite);
                                    (0, nostr_state_store_js_1.writeNostrBusState)({
                                        accountId: accountId,
                                        lastProcessedAt: lastProcessedAt,
                                        gatewayStartedAt: gatewayStartedAt,
                                        recentEventIds: recentEventIds,
                                    }).catch(function (err) { return onError === null || onError === void 0 ? void 0 : onError(err, "persist state on close"); });
                                }
                            },
                            publicKey: pk,
                            sendDm: sendDm,
                            getMetrics: function () { return metrics.getSnapshot(); },
                            publishProfile: publishProfile,
                            getProfileState: getProfileState,
                        }];
            }
        });
    });
}
// ============================================================================
// Send DM with Circuit Breaker + Health Scoring
// ============================================================================
/**
 * Send an encrypted DM to a pubkey
 */
function sendEncryptedDm(pool, sk, toPubkey, text, relays, metrics, circuitBreakers, healthTracker, onError) {
    return __awaiter(this, void 0, void 0, function () {
        var ciphertext, reply, sortedRelays, lastError, _i, sortedRelays_1, relay, cb, startTime, latency, err_2, latency;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ciphertext = (0, nip04_1.encrypt)(sk, toPubkey, text);
                    reply = (0, nostr_tools_1.finalizeEvent)({
                        kind: 4,
                        content: ciphertext,
                        tags: [["p", toPubkey]],
                        created_at: Math.floor(Date.now() / 1000),
                    }, sk);
                    sortedRelays = healthTracker.getSortedRelays(relays);
                    _i = 0, sortedRelays_1 = sortedRelays;
                    _a.label = 1;
                case 1:
                    if (!(_i < sortedRelays_1.length)) return [3 /*break*/, 6];
                    relay = sortedRelays_1[_i];
                    cb = circuitBreakers.get(relay);
                    // Skip if circuit breaker is open
                    if (cb && !cb.canAttempt()) {
                        return [3 /*break*/, 5];
                    }
                    startTime = Date.now();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    // oxlint-disable-next-line typescript/await-thenable typesciript/no-floating-promises
                    return [4 /*yield*/, pool.publish([relay], reply)];
                case 3:
                    // oxlint-disable-next-line typescript/await-thenable typesciript/no-floating-promises
                    _a.sent();
                    latency = Date.now() - startTime;
                    // Record success
                    cb === null || cb === void 0 ? void 0 : cb.recordSuccess();
                    healthTracker.recordSuccess(relay, latency);
                    return [2 /*return*/]; // Success - exit early
                case 4:
                    err_2 = _a.sent();
                    lastError = err_2;
                    latency = Date.now() - startTime;
                    // Record failure
                    cb === null || cb === void 0 ? void 0 : cb.recordFailure();
                    healthTracker.recordFailure(relay);
                    metrics.emit("relay.error", 1, { relay: relay, latency: latency });
                    onError === null || onError === void 0 ? void 0 : onError(lastError, "publish to ".concat(relay));
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: throw new Error("Failed to publish to any relay: ".concat(lastError === null || lastError === void 0 ? void 0 : lastError.message));
            }
        });
    });
}
// ============================================================================
// Pubkey Utilities
// ============================================================================
/**
 * Check if a string looks like a valid Nostr pubkey (hex or npub)
 */
function isValidPubkey(input) {
    if (typeof input !== "string") {
        return false;
    }
    var trimmed = input.trim();
    // npub format
    if (trimmed.startsWith("npub1")) {
        try {
            var decoded = nostr_tools_1.nip19.decode(trimmed);
            return decoded.type === "npub";
        }
        catch (_a) {
            return false;
        }
    }
    // Hex format
    return /^[0-9a-fA-F]{64}$/.test(trimmed);
}
/**
 * Normalize a pubkey to hex format (accepts npub or hex)
 */
function normalizePubkey(input) {
    var trimmed = input.trim();
    // npub format - decode to hex
    if (trimmed.startsWith("npub1")) {
        var decoded = nostr_tools_1.nip19.decode(trimmed);
        if (decoded.type !== "npub") {
            throw new Error("Invalid npub key");
        }
        // Convert Uint8Array to hex string
        return Array.from(decoded.data)
            .map(function (b) { return b.toString(16).padStart(2, "0"); })
            .join("");
    }
    // Already hex - validate and return lowercase
    if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) {
        throw new Error("Pubkey must be 64 hex characters or npub format");
    }
    return trimmed.toLowerCase();
}
/**
 * Convert a hex pubkey to npub format
 */
function pubkeyToNpub(hexPubkey) {
    var normalized = normalizePubkey(hexPubkey);
    // npubEncode expects a hex string, not Uint8Array
    return nostr_tools_1.nip19.npubEncode(normalized);
}
