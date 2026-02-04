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
exports.listAgentEntries = listAgentEntries;
exports.findAgentEntryIndex = findAgentEntryIndex;
exports.parseIdentityMarkdown = parseIdentityMarkdown;
exports.loadAgentIdentity = loadAgentIdentity;
exports.buildAgentSummaries = buildAgentSummaries;
exports.applyAgentConfig = applyAgentConfig;
exports.pruneAgentConfig = pruneAgentConfig;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var identity_file_js_1 = require("../agents/identity-file.js");
var session_key_js_1 = require("../routing/session-key.js");
function listAgentEntries(cfg) {
    var _a;
    var list = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list;
    if (!Array.isArray(list)) {
        return [];
    }
    return list.filter(function (entry) { return Boolean(entry && typeof entry === "object"); });
}
function findAgentEntryIndex(list, agentId) {
    var id = (0, session_key_js_1.normalizeAgentId)(agentId);
    return list.findIndex(function (entry) { return (0, session_key_js_1.normalizeAgentId)(entry.id) === id; });
}
function resolveAgentName(cfg, agentId) {
    var _a;
    var entry = listAgentEntries(cfg).find(function (agent) { return (0, session_key_js_1.normalizeAgentId)(agent.id) === (0, session_key_js_1.normalizeAgentId)(agentId); });
    return ((_a = entry === null || entry === void 0 ? void 0 : entry.name) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
}
function resolveAgentModel(cfg, agentId) {
    var _a, _b, _c, _d;
    var entry = listAgentEntries(cfg).find(function (agent) { return (0, session_key_js_1.normalizeAgentId)(agent.id) === (0, session_key_js_1.normalizeAgentId)(agentId); });
    if (entry === null || entry === void 0 ? void 0 : entry.model) {
        if (typeof entry.model === "string" && entry.model.trim()) {
            return entry.model.trim();
        }
        if (typeof entry.model === "object") {
            var primary = (_a = entry.model.primary) === null || _a === void 0 ? void 0 : _a.trim();
            if (primary) {
                return primary;
            }
        }
    }
    var raw = (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.model;
    if (typeof raw === "string") {
        return raw;
    }
    return ((_d = raw === null || raw === void 0 ? void 0 : raw.primary) === null || _d === void 0 ? void 0 : _d.trim()) || undefined;
}
function parseIdentityMarkdown(content) {
    return (0, identity_file_js_1.parseIdentityMarkdown)(content);
}
function loadAgentIdentity(workspace) {
    var parsed = (0, identity_file_js_1.loadAgentIdentityFromWorkspace)(workspace);
    if (!parsed) {
        return null;
    }
    return (0, identity_file_js_1.identityHasValues)(parsed) ? parsed : null;
}
function buildAgentSummaries(cfg) {
    var _a, _b;
    var defaultAgentId = (0, session_key_js_1.normalizeAgentId)((0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
    var configuredAgents = listAgentEntries(cfg);
    var orderedIds = configuredAgents.length > 0
        ? configuredAgents.map(function (agent) { return (0, session_key_js_1.normalizeAgentId)(agent.id); })
        : [defaultAgentId];
    var bindingCounts = new Map();
    for (var _i = 0, _c = (_a = cfg.bindings) !== null && _a !== void 0 ? _a : []; _i < _c.length; _i++) {
        var binding = _c[_i];
        var agentId = (0, session_key_js_1.normalizeAgentId)(binding.agentId);
        bindingCounts.set(agentId, ((_b = bindingCounts.get(agentId)) !== null && _b !== void 0 ? _b : 0) + 1);
    }
    var ordered = orderedIds.filter(function (id, index) { return orderedIds.indexOf(id) === index; });
    return ordered.map(function (id) {
        var _a, _b, _c, _d, _e, _f;
        var workspace = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, id);
        var identity = loadAgentIdentity(workspace);
        var configIdentity = (_a = configuredAgents.find(function (agent) { return (0, session_key_js_1.normalizeAgentId)(agent.id) === id; })) === null || _a === void 0 ? void 0 : _a.identity;
        var identityName = (_b = identity === null || identity === void 0 ? void 0 : identity.name) !== null && _b !== void 0 ? _b : (_c = configIdentity === null || configIdentity === void 0 ? void 0 : configIdentity.name) === null || _c === void 0 ? void 0 : _c.trim();
        var identityEmoji = (_d = identity === null || identity === void 0 ? void 0 : identity.emoji) !== null && _d !== void 0 ? _d : (_e = configIdentity === null || configIdentity === void 0 ? void 0 : configIdentity.emoji) === null || _e === void 0 ? void 0 : _e.trim();
        var identitySource = identity
            ? "identity"
            : configIdentity && (identityName || identityEmoji)
                ? "config"
                : undefined;
        return {
            id: id,
            name: resolveAgentName(cfg, id),
            identityName: identityName,
            identityEmoji: identityEmoji,
            identitySource: identitySource,
            workspace: workspace,
            agentDir: (0, agent_scope_js_1.resolveAgentDir)(cfg, id),
            model: resolveAgentModel(cfg, id),
            bindings: (_f = bindingCounts.get(id)) !== null && _f !== void 0 ? _f : 0,
            isDefault: id === defaultAgentId,
        };
    });
}
function applyAgentConfig(cfg, params) {
    var _a;
    var agentId = (0, session_key_js_1.normalizeAgentId)(params.agentId);
    var name = (_a = params.name) === null || _a === void 0 ? void 0 : _a.trim();
    var list = listAgentEntries(cfg);
    var index = findAgentEntryIndex(list, agentId);
    var base = index >= 0 ? list[index] : { id: agentId };
    var nextEntry = __assign(__assign(__assign(__assign(__assign({}, base), (name ? { name: name } : {})), (params.workspace ? { workspace: params.workspace } : {})), (params.agentDir ? { agentDir: params.agentDir } : {})), (params.model ? { model: params.model } : {}));
    var nextList = __spreadArray([], list, true);
    if (index >= 0) {
        nextList[index] = nextEntry;
    }
    else {
        if (nextList.length === 0 && agentId !== (0, session_key_js_1.normalizeAgentId)((0, agent_scope_js_1.resolveDefaultAgentId)(cfg))) {
            nextList.push({ id: (0, agent_scope_js_1.resolveDefaultAgentId)(cfg) });
        }
        nextList.push(nextEntry);
    }
    return __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { list: nextList }) });
}
function pruneAgentConfig(cfg, agentId) {
    var _a, _b, _c, _d, _e;
    var id = (0, session_key_js_1.normalizeAgentId)(agentId);
    var agents = listAgentEntries(cfg);
    var nextAgentsList = agents.filter(function (entry) { return (0, session_key_js_1.normalizeAgentId)(entry.id) !== id; });
    var nextAgents = nextAgentsList.length > 0 ? nextAgentsList : undefined;
    var bindings = (_a = cfg.bindings) !== null && _a !== void 0 ? _a : [];
    var filteredBindings = bindings.filter(function (binding) { return (0, session_key_js_1.normalizeAgentId)(binding.agentId) !== id; });
    var allow = (_d = (_c = (_b = cfg.tools) === null || _b === void 0 ? void 0 : _b.agentToAgent) === null || _c === void 0 ? void 0 : _c.allow) !== null && _d !== void 0 ? _d : [];
    var filteredAllow = allow.filter(function (entry) { return entry !== id; });
    var nextAgentsConfig = cfg.agents
        ? __assign(__assign({}, cfg.agents), { list: nextAgents }) : nextAgents
        ? { list: nextAgents }
        : undefined;
    var nextTools = ((_e = cfg.tools) === null || _e === void 0 ? void 0 : _e.agentToAgent)
        ? __assign(__assign({}, cfg.tools), { agentToAgent: __assign(__assign({}, cfg.tools.agentToAgent), { allow: filteredAllow.length > 0 ? filteredAllow : undefined }) }) : cfg.tools;
    return {
        config: __assign(__assign({}, cfg), { agents: nextAgentsConfig, bindings: filteredBindings.length > 0 ? filteredBindings : undefined, tools: nextTools }),
        removedBindings: bindings.length - filteredBindings.length,
        removedAllow: allow.length - filteredAllow.length,
    };
}
