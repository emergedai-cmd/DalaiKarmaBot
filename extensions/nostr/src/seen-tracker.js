"use strict";
/**
 * LRU-based seen event tracker with TTL support.
 * Prevents unbounded memory growth under high load or abuse.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeenTracker = createSeenTracker;
/**
 * Create a new seen tracker with LRU eviction and TTL expiration.
 */
function createSeenTracker(options) {
    var _a, _b, _c;
    var maxEntries = (_a = options === null || options === void 0 ? void 0 : options.maxEntries) !== null && _a !== void 0 ? _a : 100000;
    var ttlMs = (_b = options === null || options === void 0 ? void 0 : options.ttlMs) !== null && _b !== void 0 ? _b : 60 * 60 * 1000; // 1 hour
    var pruneIntervalMs = (_c = options === null || options === void 0 ? void 0 : options.pruneIntervalMs) !== null && _c !== void 0 ? _c : 10 * 60 * 1000; // 10 minutes
    // Main storage
    var entries = new Map();
    // LRU tracking: head = most recent, tail = least recent
    var head = null;
    var tail = null;
    // Move an entry to the front (most recently used)
    function moveToFront(id) {
        var entry = entries.get(id);
        if (!entry) {
            return;
        }
        // Already at front
        if (head === id) {
            return;
        }
        // Remove from current position
        if (entry.prev) {
            var prevEntry = entries.get(entry.prev);
            if (prevEntry) {
                prevEntry.next = entry.next;
            }
        }
        if (entry.next) {
            var nextEntry = entries.get(entry.next);
            if (nextEntry) {
                nextEntry.prev = entry.prev;
            }
        }
        // Update tail if this was the tail
        if (tail === id) {
            tail = entry.prev;
        }
        // Move to front
        entry.prev = null;
        entry.next = head;
        if (head) {
            var headEntry = entries.get(head);
            if (headEntry) {
                headEntry.prev = id;
            }
        }
        head = id;
        // If no tail, this is also the tail
        if (!tail) {
            tail = id;
        }
    }
    // Remove an entry from the linked list
    function removeFromList(id) {
        var entry = entries.get(id);
        if (!entry) {
            return;
        }
        if (entry.prev) {
            var prevEntry = entries.get(entry.prev);
            if (prevEntry) {
                prevEntry.next = entry.next;
            }
        }
        else {
            head = entry.next;
        }
        if (entry.next) {
            var nextEntry = entries.get(entry.next);
            if (nextEntry) {
                nextEntry.prev = entry.prev;
            }
        }
        else {
            tail = entry.prev;
        }
    }
    // Evict the least recently used entry
    function evictLRU() {
        if (!tail) {
            return;
        }
        var idToEvict = tail;
        removeFromList(idToEvict);
        entries.delete(idToEvict);
    }
    // Prune expired entries
    function pruneExpired() {
        var now = Date.now();
        var toDelete = [];
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var _a = entries_1[_i], id = _a[0], entry = _a[1];
            if (now - entry.seenAt > ttlMs) {
                toDelete.push(id);
            }
        }
        for (var _b = 0, toDelete_1 = toDelete; _b < toDelete_1.length; _b++) {
            var id = toDelete_1[_b];
            removeFromList(id);
            entries.delete(id);
        }
    }
    // Start pruning timer
    var pruneTimer;
    if (pruneIntervalMs > 0) {
        pruneTimer = setInterval(pruneExpired, pruneIntervalMs);
        // Don't keep process alive just for pruning
        if (pruneTimer.unref) {
            pruneTimer.unref();
        }
    }
    function add(id) {
        var now = Date.now();
        // If already exists, update and move to front
        var existing = entries.get(id);
        if (existing) {
            existing.seenAt = now;
            moveToFront(id);
            return;
        }
        // Evict if at capacity
        while (entries.size >= maxEntries) {
            evictLRU();
        }
        // Add new entry at front
        var newEntry = {
            seenAt: now,
            prev: null,
            next: head,
        };
        if (head) {
            var headEntry = entries.get(head);
            if (headEntry) {
                headEntry.prev = id;
            }
        }
        entries.set(id, newEntry);
        head = id;
        if (!tail) {
            tail = id;
        }
    }
    function has(id) {
        var entry = entries.get(id);
        if (!entry) {
            add(id);
            return false;
        }
        // Check if expired
        if (Date.now() - entry.seenAt > ttlMs) {
            removeFromList(id);
            entries.delete(id);
            add(id);
            return false;
        }
        // Mark as recently used
        entry.seenAt = Date.now();
        moveToFront(id);
        return true;
    }
    function peek(id) {
        var entry = entries.get(id);
        if (!entry) {
            return false;
        }
        // Check if expired
        if (Date.now() - entry.seenAt > ttlMs) {
            removeFromList(id);
            entries.delete(id);
            return false;
        }
        return true;
    }
    function deleteEntry(id) {
        if (entries.has(id)) {
            removeFromList(id);
            entries.delete(id);
        }
    }
    function clear() {
        entries.clear();
        head = null;
        tail = null;
    }
    function size() {
        return entries.size;
    }
    function stop() {
        if (pruneTimer) {
            clearInterval(pruneTimer);
            pruneTimer = undefined;
        }
    }
    function seed(ids) {
        var now = Date.now();
        // Seed in reverse order so first IDs end up at front
        for (var i = ids.length - 1; i >= 0; i--) {
            var id = ids[i];
            if (!entries.has(id) && entries.size < maxEntries) {
                var newEntry = {
                    seenAt: now,
                    prev: null,
                    next: head,
                };
                if (head) {
                    var headEntry = entries.get(head);
                    if (headEntry) {
                        headEntry.prev = id;
                    }
                }
                entries.set(id, newEntry);
                head = id;
                if (!tail) {
                    tail = id;
                }
            }
        }
    }
    return {
        has: has,
        add: add,
        peek: peek,
        delete: deleteEntry,
        clear: clear,
        size: size,
        stop: stop,
        seed: seed,
    };
}
