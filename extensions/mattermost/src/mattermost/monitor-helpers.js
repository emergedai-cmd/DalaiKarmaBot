"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractShortModelName = extractShortModelName;
exports.formatInboundFromLabel = formatInboundFromLabel;
exports.createDedupeCache = createDedupeCache;
exports.rawDataToString = rawDataToString;
exports.resolveIdentityName = resolveIdentityName;
exports.resolveThreadSessionKeys = resolveThreadSessionKeys;
var node_buffer_1 = require("node:buffer");
function extractShortModelName(fullModel) {
    var slash = fullModel.lastIndexOf("/");
    var modelPart = slash >= 0 ? fullModel.slice(slash + 1) : fullModel;
    return modelPart.replace(/-\d{8}$/, "").replace(/-latest$/, "");
}
function formatInboundFromLabel(params) {
    var _a, _b, _c;
    if (params.isGroup) {
        var label = ((_a = params.groupLabel) === null || _a === void 0 ? void 0 : _a.trim()) || params.groupFallback || "Group";
        var id = (_b = params.groupId) === null || _b === void 0 ? void 0 : _b.trim();
        return id ? "".concat(label, " id:").concat(id) : label;
    }
    var directLabel = params.directLabel.trim();
    var directId = (_c = params.directId) === null || _c === void 0 ? void 0 : _c.trim();
    if (!directId || directId === directLabel) {
        return directLabel;
    }
    return "".concat(directLabel, " id:").concat(directId);
}
function createDedupeCache(options) {
    var ttlMs = Math.max(0, options.ttlMs);
    var maxSize = Math.max(0, Math.floor(options.maxSize));
    var cache = new Map();
    var touch = function (key, now) {
        cache.delete(key);
        cache.set(key, now);
    };
    var prune = function (now) {
        var cutoff = ttlMs > 0 ? now - ttlMs : undefined;
        if (cutoff !== undefined) {
            for (var _i = 0, cache_1 = cache; _i < cache_1.length; _i++) {
                var _a = cache_1[_i], entryKey = _a[0], entryTs = _a[1];
                if (entryTs < cutoff) {
                    cache.delete(entryKey);
                }
            }
        }
        if (maxSize <= 0) {
            cache.clear();
            return;
        }
        while (cache.size > maxSize) {
            var oldestKey = cache.keys().next().value;
            if (!oldestKey) {
                break;
            }
            cache.delete(oldestKey);
        }
    };
    return {
        check: function (key, now) {
            if (now === void 0) { now = Date.now(); }
            if (!key) {
                return false;
            }
            var existing = cache.get(key);
            if (existing !== undefined && (ttlMs <= 0 || now - existing < ttlMs)) {
                touch(key, now);
                return true;
            }
            touch(key, now);
            prune(now);
            return false;
        },
    };
}
function rawDataToString(data, encoding) {
    if (encoding === void 0) { encoding = "utf8"; }
    if (typeof data === "string") {
        return data;
    }
    if (node_buffer_1.Buffer.isBuffer(data)) {
        return data.toString(encoding);
    }
    if (Array.isArray(data)) {
        return node_buffer_1.Buffer.concat(data).toString(encoding);
    }
    if (data instanceof ArrayBuffer) {
        return node_buffer_1.Buffer.from(data).toString(encoding);
    }
    return node_buffer_1.Buffer.from(String(data)).toString(encoding);
}
function normalizeAgentId(value) {
    var trimmed = (value !== null && value !== void 0 ? value : "").trim();
    if (!trimmed) {
        return "main";
    }
    if (/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(trimmed)) {
        return trimmed;
    }
    return (trimmed
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
        .slice(0, 64) || "main");
}
function listAgents(cfg) {
    var _a;
    var list = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list;
    if (!Array.isArray(list)) {
        return [];
    }
    return list.filter(function (entry) { return Boolean(entry && typeof entry === "object"); });
}
function resolveAgentEntry(cfg, agentId) {
    var id = normalizeAgentId(agentId);
    return listAgents(cfg).find(function (entry) { return normalizeAgentId(entry.id) === id; });
}
function resolveIdentityName(cfg, agentId) {
    var _a, _b;
    var entry = resolveAgentEntry(cfg, agentId);
    return ((_b = (_a = entry === null || entry === void 0 ? void 0 : entry.identity) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.trim()) || undefined;
}
function resolveThreadSessionKeys(params) {
    var _a, _b;
    var threadId = ((_a = params.threadId) !== null && _a !== void 0 ? _a : "").trim();
    if (!threadId) {
        return { sessionKey: params.baseSessionKey, parentSessionKey: undefined };
    }
    var useSuffix = (_b = params.useSuffix) !== null && _b !== void 0 ? _b : true;
    var sessionKey = useSuffix
        ? "".concat(params.baseSessionKey, ":thread:").concat(threadId)
        : params.baseSessionKey;
    return { sessionKey: sessionKey, parentSessionKey: params.parentSessionKey };
}
