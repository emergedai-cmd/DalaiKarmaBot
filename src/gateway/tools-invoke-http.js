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
exports.handleToolsInvokeHttpRequest = handleToolsInvokeHttpRequest;
var openclaw_tools_js_1 = require("../agents/openclaw-tools.js");
var pi_tools_policy_js_1 = require("../agents/pi-tools.policy.js");
var tool_policy_js_1 = require("../agents/tool-policy.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var logger_js_1 = require("../logger.js");
var config_state_js_1 = require("../plugins/config-state.js");
var tools_js_1 = require("../plugins/tools.js");
var session_key_js_1 = require("../routing/session-key.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var auth_js_1 = require("./auth.js");
var http_common_js_1 = require("./http-common.js");
var http_utils_js_1 = require("./http-utils.js");
var DEFAULT_BODY_BYTES = 2 * 1024 * 1024;
var MEMORY_TOOL_NAMES = new Set(["memory_search", "memory_get"]);
function resolveSessionKeyFromBody(body) {
    if (typeof body.sessionKey === "string" && body.sessionKey.trim()) {
        return body.sessionKey.trim();
    }
    return undefined;
}
function resolveMemoryToolDisableReasons(cfg) {
    var _a;
    if (!process.env.VITEST) {
        return [];
    }
    var reasons = [];
    var plugins = cfg.plugins;
    var slotRaw = (_a = plugins === null || plugins === void 0 ? void 0 : plugins.slots) === null || _a === void 0 ? void 0 : _a.memory;
    var slotDisabled = slotRaw === null || (typeof slotRaw === "string" && slotRaw.trim().toLowerCase() === "none");
    var pluginsDisabled = (plugins === null || plugins === void 0 ? void 0 : plugins.enabled) === false;
    var defaultDisabled = (0, config_state_js_1.isTestDefaultMemorySlotDisabled)(cfg);
    if (pluginsDisabled) {
        reasons.push("plugins.enabled=false");
    }
    if (slotDisabled) {
        reasons.push(slotRaw === null ? "plugins.slots.memory=null" : 'plugins.slots.memory="none"');
    }
    if (!pluginsDisabled && !slotDisabled && defaultDisabled) {
        reasons.push("memory plugin disabled by test default");
    }
    return reasons;
}
function mergeActionIntoArgsIfSupported(params) {
    var toolSchema = params.toolSchema, action = params.action, args = params.args;
    if (!action) {
        return args;
    }
    if (args.action !== undefined) {
        return args;
    }
    // TypeBox schemas are plain objects; many tools define an `action` property.
    var schemaObj = toolSchema;
    var hasAction = Boolean(schemaObj &&
        typeof schemaObj === "object" &&
        schemaObj.properties &&
        "action" in schemaObj.properties);
    if (!hasAction) {
        return args;
    }
    return __assign(__assign({}, args), { action: action });
}
function handleToolsInvokeHttpRequest(req, res, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var url, cfg, token, authResult, bodyUnknown, body, toolName, reasons, suffix, action, argsRaw, args, rawSessionKey, sessionKey, messageChannel, accountId, _a, agentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow, profilePolicy, providerProfilePolicy, mergeAlsoAllow, profilePolicyWithAlsoAllow, providerProfilePolicyWithAlsoAllow, groupPolicy, subagentPolicy, allTools, coreToolNames, pluginGroups, resolvePolicy, profilePolicyExpanded, providerProfileExpanded, globalPolicyExpanded, globalProviderExpanded, agentPolicyExpanded, agentProviderExpanded, groupPolicyExpanded, subagentPolicyExpanded, toolsFiltered, providerProfileFiltered, globalFiltered, globalProviderFiltered, agentFiltered, agentProviderFiltered, groupFiltered, subagentFiltered, tool, toolArgs, result, err_1;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    url = new URL((_b = req.url) !== null && _b !== void 0 ? _b : "/", "http://".concat((_c = req.headers.host) !== null && _c !== void 0 ? _c : "localhost"));
                    if (url.pathname !== "/tools/invoke") {
                        return [2 /*return*/, false];
                    }
                    if (req.method !== "POST") {
                        (0, http_common_js_1.sendMethodNotAllowed)(res, "POST");
                        return [2 /*return*/, true];
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    token = (0, http_utils_js_1.getBearerToken)(req);
                    return [4 /*yield*/, (0, auth_js_1.authorizeGatewayConnect)({
                            auth: opts.auth,
                            connectAuth: token ? { token: token, password: token } : null,
                            req: req,
                            trustedProxies: (_d = opts.trustedProxies) !== null && _d !== void 0 ? _d : (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.trustedProxies,
                        })];
                case 1:
                    authResult = _l.sent();
                    if (!authResult.ok) {
                        (0, http_common_js_1.sendUnauthorized)(res);
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, (0, http_common_js_1.readJsonBodyOrError)(req, res, (_f = opts.maxBodyBytes) !== null && _f !== void 0 ? _f : DEFAULT_BODY_BYTES)];
                case 2:
                    bodyUnknown = _l.sent();
                    if (bodyUnknown === undefined) {
                        return [2 /*return*/, true];
                    }
                    body = (bodyUnknown !== null && bodyUnknown !== void 0 ? bodyUnknown : {});
                    toolName = typeof body.tool === "string" ? body.tool.trim() : "";
                    if (!toolName) {
                        (0, http_common_js_1.sendInvalidRequest)(res, "tools.invoke requires body.tool");
                        return [2 /*return*/, true];
                    }
                    if (process.env.VITEST && MEMORY_TOOL_NAMES.has(toolName)) {
                        reasons = resolveMemoryToolDisableReasons(cfg);
                        if (reasons.length > 0) {
                            suffix = reasons.length > 0 ? " (".concat(reasons.join(", "), ")") : "";
                            (0, http_common_js_1.sendJson)(res, 400, {
                                ok: false,
                                error: {
                                    type: "invalid_request",
                                    message: "memory tools are disabled in tests".concat(suffix, ". ") +
                                        'Enable by setting plugins.slots.memory="memory-core" (and ensure plugins.enabled is not false).',
                                },
                            });
                            return [2 /*return*/, true];
                        }
                    }
                    action = typeof body.action === "string" ? body.action.trim() : undefined;
                    argsRaw = body.args;
                    args = argsRaw && typeof argsRaw === "object" && !Array.isArray(argsRaw)
                        ? argsRaw
                        : {};
                    rawSessionKey = resolveSessionKeyFromBody(body);
                    sessionKey = !rawSessionKey || rawSessionKey === "main" ? (0, sessions_js_1.resolveMainSessionKey)(cfg) : rawSessionKey;
                    messageChannel = (0, message_channel_js_1.normalizeMessageChannel)((_g = (0, http_utils_js_1.getHeader)(req, "x-openclaw-message-channel")) !== null && _g !== void 0 ? _g : "");
                    accountId = ((_h = (0, http_utils_js_1.getHeader)(req, "x-openclaw-account-id")) === null || _h === void 0 ? void 0 : _h.trim()) || undefined;
                    _a = (0, pi_tools_policy_js_1.resolveEffectiveToolPolicy)({ config: cfg, sessionKey: sessionKey }), agentId = _a.agentId, globalPolicy = _a.globalPolicy, globalProviderPolicy = _a.globalProviderPolicy, agentPolicy = _a.agentPolicy, agentProviderPolicy = _a.agentProviderPolicy, profile = _a.profile, providerProfile = _a.providerProfile, profileAlsoAllow = _a.profileAlsoAllow, providerProfileAlsoAllow = _a.providerProfileAlsoAllow;
                    profilePolicy = (0, tool_policy_js_1.resolveToolProfilePolicy)(profile);
                    providerProfilePolicy = (0, tool_policy_js_1.resolveToolProfilePolicy)(providerProfile);
                    mergeAlsoAllow = function (policy, alsoAllow) {
                        if (!(policy === null || policy === void 0 ? void 0 : policy.allow) || !Array.isArray(alsoAllow) || alsoAllow.length === 0) {
                            return policy;
                        }
                        return __assign(__assign({}, policy), { allow: Array.from(new Set(__spreadArray(__spreadArray([], policy.allow, true), alsoAllow, true))) });
                    };
                    profilePolicyWithAlsoAllow = mergeAlsoAllow(profilePolicy, profileAlsoAllow);
                    providerProfilePolicyWithAlsoAllow = mergeAlsoAllow(providerProfilePolicy, providerProfileAlsoAllow);
                    groupPolicy = (0, pi_tools_policy_js_1.resolveGroupToolPolicy)({
                        config: cfg,
                        sessionKey: sessionKey,
                        messageProvider: messageChannel !== null && messageChannel !== void 0 ? messageChannel : undefined,
                        accountId: accountId !== null && accountId !== void 0 ? accountId : null,
                    });
                    subagentPolicy = (0, session_key_js_1.isSubagentSessionKey)(sessionKey)
                        ? (0, pi_tools_policy_js_1.resolveSubagentToolPolicy)(cfg)
                        : undefined;
                    allTools = (0, openclaw_tools_js_1.createOpenClawTools)({
                        agentSessionKey: sessionKey,
                        agentChannel: messageChannel !== null && messageChannel !== void 0 ? messageChannel : undefined,
                        agentAccountId: accountId,
                        config: cfg,
                        pluginToolAllowlist: (0, tool_policy_js_1.collectExplicitAllowlist)([
                            profilePolicy,
                            providerProfilePolicy,
                            globalPolicy,
                            globalProviderPolicy,
                            agentPolicy,
                            agentProviderPolicy,
                            groupPolicy,
                            subagentPolicy,
                        ]),
                    });
                    coreToolNames = new Set(allTools
                        // oxlint-disable-next-line typescript/no-explicit-any
                        .filter(function (tool) { return !(0, tools_js_1.getPluginToolMeta)(tool); })
                        .map(function (tool) { return (0, tool_policy_js_1.normalizeToolName)(tool.name); })
                        .filter(Boolean));
                    pluginGroups = (0, tool_policy_js_1.buildPluginToolGroups)({
                        tools: allTools,
                        // oxlint-disable-next-line typescript/no-explicit-any
                        toolMeta: function (tool) { return (0, tools_js_1.getPluginToolMeta)(tool); },
                    });
                    resolvePolicy = function (policy, label) {
                        var resolved = (0, tool_policy_js_1.stripPluginOnlyAllowlist)(policy, pluginGroups, coreToolNames);
                        if (resolved.unknownAllowlist.length > 0) {
                            var entries = resolved.unknownAllowlist.join(", ");
                            var suffix = resolved.strippedAllowlist
                                ? "Ignoring allowlist so core tools remain available. Use tools.alsoAllow for additive plugin tool enablement."
                                : "These entries won't match any tool unless the plugin is enabled.";
                            (0, logger_js_1.logWarn)("tools: ".concat(label, " allowlist contains unknown entries (").concat(entries, "). ").concat(suffix));
                        }
                        return (0, tool_policy_js_1.expandPolicyWithPluginGroups)(resolved.policy, pluginGroups);
                    };
                    profilePolicyExpanded = resolvePolicy(profilePolicyWithAlsoAllow, profile ? "tools.profile (".concat(profile, ")") : "tools.profile");
                    providerProfileExpanded = resolvePolicy(providerProfilePolicyWithAlsoAllow, providerProfile ? "tools.byProvider.profile (".concat(providerProfile, ")") : "tools.byProvider.profile");
                    globalPolicyExpanded = resolvePolicy(globalPolicy, "tools.allow");
                    globalProviderExpanded = resolvePolicy(globalProviderPolicy, "tools.byProvider.allow");
                    agentPolicyExpanded = resolvePolicy(agentPolicy, agentId ? "agents.".concat(agentId, ".tools.allow") : "agent tools.allow");
                    agentProviderExpanded = resolvePolicy(agentProviderPolicy, agentId ? "agents.".concat(agentId, ".tools.byProvider.allow") : "agent tools.byProvider.allow");
                    groupPolicyExpanded = resolvePolicy(groupPolicy, "group tools.allow");
                    subagentPolicyExpanded = (0, tool_policy_js_1.expandPolicyWithPluginGroups)(subagentPolicy, pluginGroups);
                    toolsFiltered = profilePolicyExpanded
                        ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(allTools, profilePolicyExpanded)
                        : allTools;
                    providerProfileFiltered = providerProfileExpanded
                        ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(toolsFiltered, providerProfileExpanded)
                        : toolsFiltered;
                    globalFiltered = globalPolicyExpanded
                        ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(providerProfileFiltered, globalPolicyExpanded)
                        : providerProfileFiltered;
                    globalProviderFiltered = globalProviderExpanded
                        ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(globalFiltered, globalProviderExpanded)
                        : globalFiltered;
                    agentFiltered = agentPolicyExpanded
                        ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(globalProviderFiltered, agentPolicyExpanded)
                        : globalProviderFiltered;
                    agentProviderFiltered = agentProviderExpanded
                        ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(agentFiltered, agentProviderExpanded)
                        : agentFiltered;
                    groupFiltered = groupPolicyExpanded
                        ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(agentProviderFiltered, groupPolicyExpanded)
                        : agentProviderFiltered;
                    subagentFiltered = subagentPolicyExpanded
                        ? (0, pi_tools_policy_js_1.filterToolsByPolicy)(groupFiltered, subagentPolicyExpanded)
                        : groupFiltered;
                    tool = subagentFiltered.find(function (t) { return t.name === toolName; });
                    if (!tool) {
                        (0, http_common_js_1.sendJson)(res, 404, {
                            ok: false,
                            error: { type: "not_found", message: "Tool not available: ".concat(toolName) },
                        });
                        return [2 /*return*/, true];
                    }
                    _l.label = 3;
                case 3:
                    _l.trys.push([3, 5, , 6]);
                    toolArgs = mergeActionIntoArgsIfSupported({
                        // oxlint-disable-next-line typescript/no-explicit-any
                        toolSchema: tool.parameters,
                        action: action,
                        args: args,
                    });
                    return [4 /*yield*/, ((_k = (_j = tool).execute) === null || _k === void 0 ? void 0 : _k.call(_j, "http-".concat(Date.now()), toolArgs))];
                case 4:
                    result = _l.sent();
                    (0, http_common_js_1.sendJson)(res, 200, { ok: true, result: result });
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _l.sent();
                    (0, http_common_js_1.sendJson)(res, 400, {
                        ok: false,
                        error: { type: "tool_error", message: err_1 instanceof Error ? err_1.message : String(err_1) },
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, true];
            }
        });
    });
}
