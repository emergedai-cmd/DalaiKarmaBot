"use strict";
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
exports.updateSystemPresence = updateSystemPresence;
exports.upsertPresence = upsertPresence;
exports.listSystemPresence = listSystemPresence;
var node_child_process_1 = require("node:child_process");
var node_os_1 = require("node:os");
var entries = new Map();
var TTL_MS = 5 * 60 * 1000; // 5 minutes
var MAX_ENTRIES = 200;
function normalizePresenceKey(key) {
    if (!key) {
        return undefined;
    }
    var trimmed = key.trim();
    if (!trimmed) {
        return undefined;
    }
    return trimmed.toLowerCase();
}
function resolvePrimaryIPv4() {
    var _a;
    var nets = node_os_1.default.networkInterfaces();
    var prefer = ["en0", "eth0"];
    var pick = function (names) {
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            var list = nets[name_1];
            var entry = list === null || list === void 0 ? void 0 : list.find(function (n) { return n.family === "IPv4" && !n.internal; });
            if (entry === null || entry === void 0 ? void 0 : entry.address) {
                return entry.address;
            }
        }
        for (var _a = 0, _b = Object.values(nets); _a < _b.length; _a++) {
            var list = _b[_a];
            var entry = list === null || list === void 0 ? void 0 : list.find(function (n) { return n.family === "IPv4" && !n.internal; });
            if (entry === null || entry === void 0 ? void 0 : entry.address) {
                return entry.address;
            }
        }
        return undefined;
    };
    return (_a = pick(prefer)) !== null && _a !== void 0 ? _a : node_os_1.default.hostname();
}
function initSelfPresence() {
    var _a, _b, _c;
    var host = node_os_1.default.hostname();
    var ip = (_a = resolvePrimaryIPv4()) !== null && _a !== void 0 ? _a : undefined;
    var version = (_c = (_b = process.env.OPENCLAW_VERSION) !== null && _b !== void 0 ? _b : process.env.npm_package_version) !== null && _c !== void 0 ? _c : "unknown";
    var modelIdentifier = (function () {
        var p = node_os_1.default.platform();
        if (p === "darwin") {
            var res = (0, node_child_process_1.spawnSync)("sysctl", ["-n", "hw.model"], {
                encoding: "utf-8",
            });
            var out = typeof res.stdout === "string" ? res.stdout.trim() : "";
            return out.length > 0 ? out : undefined;
        }
        return node_os_1.default.arch();
    })();
    var macOSVersion = function () {
        var res = (0, node_child_process_1.spawnSync)("sw_vers", ["-productVersion"], {
            encoding: "utf-8",
        });
        var out = typeof res.stdout === "string" ? res.stdout.trim() : "";
        return out.length > 0 ? out : node_os_1.default.release();
    };
    var platform = (function () {
        var p = node_os_1.default.platform();
        var rel = node_os_1.default.release();
        if (p === "darwin") {
            return "macos ".concat(macOSVersion());
        }
        if (p === "win32") {
            return "windows ".concat(rel);
        }
        return "".concat(p, " ").concat(rel);
    })();
    var deviceFamily = (function () {
        var p = node_os_1.default.platform();
        if (p === "darwin") {
            return "Mac";
        }
        if (p === "win32") {
            return "Windows";
        }
        if (p === "linux") {
            return "Linux";
        }
        return p;
    })();
    var text = "Gateway: ".concat(host).concat(ip ? " (".concat(ip, ")") : "", " \u00B7 app ").concat(version, " \u00B7 mode gateway \u00B7 reason self");
    var selfEntry = {
        host: host,
        ip: ip,
        version: version,
        platform: platform,
        deviceFamily: deviceFamily,
        modelIdentifier: modelIdentifier,
        mode: "gateway",
        reason: "self",
        text: text,
        ts: Date.now(),
    };
    var key = host.toLowerCase();
    entries.set(key, selfEntry);
}
function ensureSelfPresence() {
    // If the map was somehow cleared (e.g., hot reload or a new worker spawn that
    // skipped module evaluation), re-seed with a local entry so UIs always show
    // at least the current gateway.
    if (entries.size === 0) {
        initSelfPresence();
    }
}
function touchSelfPresence() {
    var host = node_os_1.default.hostname();
    var key = host.toLowerCase();
    var existing = entries.get(key);
    if (existing) {
        entries.set(key, __assign(__assign({}, existing), { ts: Date.now() }));
    }
    else {
        initSelfPresence();
    }
}
initSelfPresence();
function parsePresence(text) {
    var trimmed = text.trim();
    var pattern = /Node:\s*([^ (]+)\s*\(([^)]+)\)\s*·\s*app\s*([^·]+?)\s*·\s*last input\s*([0-9]+)s ago\s*·\s*mode\s*([^·]+?)\s*·\s*reason\s*(.+)$/i;
    var match = trimmed.match(pattern);
    if (!match) {
        return { text: trimmed, ts: Date.now() };
    }
    var host = match[1], ip = match[2], version = match[3], lastInputStr = match[4], mode = match[5], reasonRaw = match[6];
    var lastInputSeconds = Number.parseInt(lastInputStr, 10);
    var reason = reasonRaw.trim();
    return {
        host: host.trim(),
        ip: ip.trim(),
        version: version.trim(),
        lastInputSeconds: Number.isFinite(lastInputSeconds) ? lastInputSeconds : undefined,
        mode: mode.trim(),
        reason: reason,
        text: trimmed,
        ts: Date.now(),
    };
}
function mergeStringList() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    var out = new Set();
    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
        var list = values_1[_a];
        if (!Array.isArray(list)) {
            continue;
        }
        for (var _b = 0, list_1 = list; _b < list_1.length; _b++) {
            var item = list_1[_b];
            var trimmed = String(item).trim();
            if (trimmed) {
                out.add(trimmed);
            }
        }
    }
    return out.size > 0 ? __spreadArray([], out, true) : undefined;
}
function updateSystemPresence(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    ensureSelfPresence();
    var parsed = parsePresence(payload.text);
    var key = normalizePresenceKey(payload.deviceId) ||
        normalizePresenceKey(payload.instanceId) ||
        normalizePresenceKey(parsed.instanceId) ||
        normalizePresenceKey(parsed.host) ||
        parsed.ip ||
        parsed.text.slice(0, 64) ||
        node_os_1.default.hostname().toLowerCase();
    var hadExisting = entries.has(key);
    var existing = (_a = entries.get(key)) !== null && _a !== void 0 ? _a : {};
    var merged = __assign(__assign(__assign({}, existing), parsed), { host: (_c = (_b = payload.host) !== null && _b !== void 0 ? _b : parsed.host) !== null && _c !== void 0 ? _c : existing.host, ip: (_e = (_d = payload.ip) !== null && _d !== void 0 ? _d : parsed.ip) !== null && _e !== void 0 ? _e : existing.ip, version: (_g = (_f = payload.version) !== null && _f !== void 0 ? _f : parsed.version) !== null && _g !== void 0 ? _g : existing.version, platform: (_h = payload.platform) !== null && _h !== void 0 ? _h : existing.platform, deviceFamily: (_j = payload.deviceFamily) !== null && _j !== void 0 ? _j : existing.deviceFamily, modelIdentifier: (_k = payload.modelIdentifier) !== null && _k !== void 0 ? _k : existing.modelIdentifier, mode: (_m = (_l = payload.mode) !== null && _l !== void 0 ? _l : parsed.mode) !== null && _m !== void 0 ? _m : existing.mode, lastInputSeconds: (_p = (_o = payload.lastInputSeconds) !== null && _o !== void 0 ? _o : parsed.lastInputSeconds) !== null && _p !== void 0 ? _p : existing.lastInputSeconds, reason: (_r = (_q = payload.reason) !== null && _q !== void 0 ? _q : parsed.reason) !== null && _r !== void 0 ? _r : existing.reason, deviceId: (_s = payload.deviceId) !== null && _s !== void 0 ? _s : existing.deviceId, roles: mergeStringList(existing.roles, payload.roles), scopes: mergeStringList(existing.scopes, payload.scopes), instanceId: (_u = (_t = payload.instanceId) !== null && _t !== void 0 ? _t : parsed.instanceId) !== null && _u !== void 0 ? _u : existing.instanceId, text: payload.text || parsed.text || existing.text, ts: Date.now() });
    entries.set(key, merged);
    var trackKeys = ["host", "ip", "version", "mode", "reason"];
    var changes = {};
    var changedKeys = [];
    for (var _i = 0, trackKeys_1 = trackKeys; _i < trackKeys_1.length; _i++) {
        var k = trackKeys_1[_i];
        var prev = existing[k];
        var next = merged[k];
        if (prev !== next) {
            changes[k] = next;
            changedKeys.push(k);
        }
    }
    return {
        key: key,
        previous: hadExisting ? existing : undefined,
        next: merged,
        changes: changes,
        changedKeys: changedKeys,
    };
}
function upsertPresence(key, presence) {
    var _a, _b, _c, _d, _e, _f;
    ensureSelfPresence();
    var normalizedKey = (_a = normalizePresenceKey(key)) !== null && _a !== void 0 ? _a : node_os_1.default.hostname().toLowerCase();
    var existing = (_b = entries.get(normalizedKey)) !== null && _b !== void 0 ? _b : {};
    var roles = mergeStringList(existing.roles, presence.roles);
    var scopes = mergeStringList(existing.scopes, presence.scopes);
    var merged = __assign(__assign(__assign({}, existing), presence), { roles: roles, scopes: scopes, ts: Date.now(), text: presence.text ||
            existing.text ||
            "Node: ".concat((_d = (_c = presence.host) !== null && _c !== void 0 ? _c : existing.host) !== null && _d !== void 0 ? _d : "unknown", " \u00B7 mode ").concat((_f = (_e = presence.mode) !== null && _e !== void 0 ? _e : existing.mode) !== null && _f !== void 0 ? _f : "unknown") });
    entries.set(normalizedKey, merged);
}
function listSystemPresence() {
    ensureSelfPresence();
    // prune expired
    var now = Date.now();
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], k = _a[0], v = _a[1];
        if (now - v.ts > TTL_MS) {
            entries.delete(k);
        }
    }
    // enforce max size (LRU by ts)
    if (entries.size > MAX_ENTRIES) {
        var sorted = __spreadArray([], entries.entries(), true).toSorted(function (a, b) { return a[1].ts - b[1].ts; });
        var toDrop = entries.size - MAX_ENTRIES;
        for (var i = 0; i < toDrop; i++) {
            entries.delete(sorted[i][0]);
        }
    }
    touchSelfPresence();
    return __spreadArray([], entries.values(), true).toSorted(function (a, b) { return b.ts - a.ts; });
}
