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
exports.describeBinding = describeBinding;
exports.applyAgentBindings = applyAgentBindings;
exports.buildChannelBindings = buildChannelBindings;
exports.parseBindingSpecs = parseBindingSpecs;
var helpers_js_1 = require("../channels/plugins/helpers.js");
var index_js_1 = require("../channels/plugins/index.js");
var session_key_js_1 = require("../routing/session-key.js");
function bindingMatchKey(match) {
    var _a, _b, _c, _d, _e, _f, _g;
    var accountId = ((_a = match.accountId) === null || _a === void 0 ? void 0 : _a.trim()) || session_key_js_1.DEFAULT_ACCOUNT_ID;
    return [
        match.channel,
        accountId,
        (_c = (_b = match.peer) === null || _b === void 0 ? void 0 : _b.kind) !== null && _c !== void 0 ? _c : "",
        (_e = (_d = match.peer) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : "",
        (_f = match.guildId) !== null && _f !== void 0 ? _f : "",
        (_g = match.teamId) !== null && _g !== void 0 ? _g : "",
    ].join("|");
}
function describeBinding(binding) {
    var match = binding.match;
    var parts = [match.channel];
    if (match.accountId) {
        parts.push("accountId=".concat(match.accountId));
    }
    if (match.peer) {
        parts.push("peer=".concat(match.peer.kind, ":").concat(match.peer.id));
    }
    if (match.guildId) {
        parts.push("guild=".concat(match.guildId));
    }
    if (match.teamId) {
        parts.push("team=".concat(match.teamId));
    }
    return parts.join(" ");
}
function applyAgentBindings(cfg, bindings) {
    var _a;
    var existing = (_a = cfg.bindings) !== null && _a !== void 0 ? _a : [];
    var existingMatchMap = new Map();
    for (var _i = 0, existing_1 = existing; _i < existing_1.length; _i++) {
        var binding = existing_1[_i];
        var key = bindingMatchKey(binding.match);
        if (!existingMatchMap.has(key)) {
            existingMatchMap.set(key, (0, session_key_js_1.normalizeAgentId)(binding.agentId));
        }
    }
    var added = [];
    var skipped = [];
    var conflicts = [];
    for (var _b = 0, bindings_1 = bindings; _b < bindings_1.length; _b++) {
        var binding = bindings_1[_b];
        var agentId = (0, session_key_js_1.normalizeAgentId)(binding.agentId);
        var key = bindingMatchKey(binding.match);
        var existingAgentId = existingMatchMap.get(key);
        if (existingAgentId) {
            if (existingAgentId === agentId) {
                skipped.push(binding);
            }
            else {
                conflicts.push({ binding: binding, existingAgentId: existingAgentId });
            }
            continue;
        }
        existingMatchMap.set(key, agentId);
        added.push(__assign(__assign({}, binding), { agentId: agentId }));
    }
    if (added.length === 0) {
        return { config: cfg, added: added, skipped: skipped, conflicts: conflicts };
    }
    return {
        config: __assign(__assign({}, cfg), { bindings: __spreadArray(__spreadArray([], existing, true), added, true) }),
        added: added,
        skipped: skipped,
        conflicts: conflicts,
    };
}
function resolveDefaultAccountId(cfg, provider) {
    var plugin = (0, index_js_1.getChannelPlugin)(provider);
    if (!plugin) {
        return session_key_js_1.DEFAULT_ACCOUNT_ID;
    }
    return (0, helpers_js_1.resolveChannelDefaultAccountId)({ plugin: plugin, cfg: cfg });
}
function buildChannelBindings(params) {
    var _a, _b;
    var bindings = [];
    var agentId = (0, session_key_js_1.normalizeAgentId)(params.agentId);
    for (var _i = 0, _c = params.selection; _i < _c.length; _i++) {
        var channel = _c[_i];
        var match = { channel: channel };
        var accountId = (_b = (_a = params.accountIds) === null || _a === void 0 ? void 0 : _a[channel]) === null || _b === void 0 ? void 0 : _b.trim();
        if (accountId) {
            match.accountId = accountId;
        }
        else {
            var plugin = (0, index_js_1.getChannelPlugin)(channel);
            if (plugin === null || plugin === void 0 ? void 0 : plugin.meta.forceAccountBinding) {
                match.accountId = resolveDefaultAccountId(params.config, channel);
            }
        }
        bindings.push({ agentId: agentId, match: match });
    }
    return bindings;
}
function parseBindingSpecs(params) {
    var _a;
    var bindings = [];
    var errors = [];
    var specs = (_a = params.specs) !== null && _a !== void 0 ? _a : [];
    var agentId = (0, session_key_js_1.normalizeAgentId)(params.agentId);
    for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
        var raw = specs_1[_i];
        var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
        if (!trimmed) {
            continue;
        }
        var _b = trimmed.split(":", 2), channelRaw = _b[0], accountRaw = _b[1];
        var channel = (0, index_js_1.normalizeChannelId)(channelRaw);
        if (!channel) {
            errors.push("Unknown channel \"".concat(channelRaw, "\"."));
            continue;
        }
        var accountId = accountRaw === null || accountRaw === void 0 ? void 0 : accountRaw.trim();
        if (accountRaw !== undefined && !accountId) {
            errors.push("Invalid binding \"".concat(trimmed, "\" (empty account id)."));
            continue;
        }
        if (!accountId) {
            var plugin = (0, index_js_1.getChannelPlugin)(channel);
            if (plugin === null || plugin === void 0 ? void 0 : plugin.meta.forceAccountBinding) {
                accountId = resolveDefaultAccountId(params.config, channel);
            }
        }
        var match = { channel: channel };
        if (accountId) {
            match.accountId = accountId;
        }
        bindings.push({ agentId: agentId, match: match });
    }
    return { bindings: bindings, errors: errors };
}
