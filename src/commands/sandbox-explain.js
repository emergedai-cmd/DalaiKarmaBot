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
exports.sandboxExplainCommand = sandboxExplainCommand;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var sandbox_js_1 = require("../agents/sandbox.js");
var registry_js_1 = require("../channels/registry.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var session_key_js_1 = require("../routing/session-key.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var SANDBOX_DOCS_URL = "https://docs.openclaw.ai/sandbox";
function normalizeExplainSessionKey(params) {
    var _a;
    var raw = ((_a = params.session) !== null && _a !== void 0 ? _a : "").trim();
    if (!raw) {
        return (0, sessions_js_1.resolveAgentMainSessionKey)({
            cfg: params.cfg,
            agentId: params.agentId,
        });
    }
    if (raw.includes(":")) {
        return raw;
    }
    if (raw === "global") {
        return "global";
    }
    return (0, session_key_js_1.buildAgentMainSessionKey)({
        agentId: params.agentId,
        mainKey: (0, session_key_js_1.normalizeMainKey)(raw),
    });
}
function inferProviderFromSessionKey(params) {
    var _a, _b, _c;
    var parsed = (0, session_key_js_1.parseAgentSessionKey)(params.sessionKey);
    if (!parsed) {
        return undefined;
    }
    var rest = parsed.rest.trim();
    if (!rest) {
        return undefined;
    }
    var parts = rest.split(":").filter(Boolean);
    if (parts.length === 0) {
        return undefined;
    }
    var configuredMainKey = (0, session_key_js_1.normalizeMainKey)((_a = params.cfg.session) === null || _a === void 0 ? void 0 : _a.mainKey);
    if (parts[0] === configuredMainKey) {
        return undefined;
    }
    var candidate = (_b = parts[0]) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
    if (!candidate) {
        return undefined;
    }
    if (candidate === message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
        return message_channel_js_1.INTERNAL_MESSAGE_CHANNEL;
    }
    return (_c = (0, registry_js_1.normalizeAnyChannelId)(candidate)) !== null && _c !== void 0 ? _c : undefined;
}
function resolveActiveChannel(params) {
    var _a, _b, _c, _d, _e;
    var storePath = (0, sessions_js_1.resolveStorePath)((_a = params.cfg.session) === null || _a === void 0 ? void 0 : _a.store, {
        agentId: params.agentId,
    });
    var store = (0, sessions_js_1.loadSessionStore)(storePath);
    var entry = store[params.sessionKey];
    var candidate = ((_e = (_d = (_c = (_b = entry === null || entry === void 0 ? void 0 : entry.lastChannel) !== null && _b !== void 0 ? _b : entry === null || entry === void 0 ? void 0 : entry.channel) !== null && _c !== void 0 ? _c : entry === null || entry === void 0 ? void 0 : entry.lastProvider) !== null && _d !== void 0 ? _d : entry === null || entry === void 0 ? void 0 : entry.provider) !== null && _e !== void 0 ? _e : "")
        .trim()
        .toLowerCase();
    if (candidate === message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
        return message_channel_js_1.INTERNAL_MESSAGE_CHANNEL;
    }
    var normalized = (0, registry_js_1.normalizeAnyChannelId)(candidate);
    if (normalized) {
        return normalized;
    }
    return inferProviderFromSessionKey({
        cfg: params.cfg,
        sessionKey: params.sessionKey,
    });
}
function sandboxExplainCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, defaultAgentId, resolvedAgentId, sessionKey, sandboxCfg, toolPolicy, mainSessionKey, sessionIsSandboxed, channel, agentConfig, elevatedGlobal, elevatedAgent, elevatedGlobalEnabled, elevatedAgentEnabled, elevatedEnabled, globalAllow, agentAllow, allowTokens, globalAllowTokens, agentAllowTokens, elevatedAllowedByConfig, elevatedAlwaysAllowedByConfig, elevatedFailures, fixIt, payload, rich, heading, key, value, ok, warn, err, bool, lines, _i, _a, key_1;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            cfg = (0, config_js_1.loadConfig)();
            defaultAgentId = (0, session_key_js_1.resolveAgentIdFromSessionKey)((0, sessions_js_1.resolveMainSessionKey)(cfg));
            resolvedAgentId = (0, session_key_js_1.normalizeAgentId)(((_b = opts.agent) === null || _b === void 0 ? void 0 : _b.trim())
                ? opts.agent
                : ((_c = opts.session) === null || _c === void 0 ? void 0 : _c.trim())
                    ? (0, session_key_js_1.resolveAgentIdFromSessionKey)(opts.session)
                    : defaultAgentId);
            sessionKey = normalizeExplainSessionKey({
                cfg: cfg,
                agentId: resolvedAgentId,
                session: opts.session,
            });
            sandboxCfg = (0, sandbox_js_1.resolveSandboxConfigForAgent)(cfg, resolvedAgentId);
            toolPolicy = (0, sandbox_js_1.resolveSandboxToolPolicyForAgent)(cfg, resolvedAgentId);
            mainSessionKey = (0, sessions_js_1.resolveAgentMainSessionKey)({
                cfg: cfg,
                agentId: resolvedAgentId,
            });
            sessionIsSandboxed = sandboxCfg.mode === "all"
                ? true
                : sandboxCfg.mode === "off"
                    ? false
                    : sessionKey.trim() !== mainSessionKey.trim();
            channel = resolveActiveChannel({
                cfg: cfg,
                agentId: resolvedAgentId,
                sessionKey: sessionKey,
            });
            agentConfig = (0, agent_scope_js_1.resolveAgentConfig)(cfg, resolvedAgentId);
            elevatedGlobal = (_d = cfg.tools) === null || _d === void 0 ? void 0 : _d.elevated;
            elevatedAgent = (_e = agentConfig === null || agentConfig === void 0 ? void 0 : agentConfig.tools) === null || _e === void 0 ? void 0 : _e.elevated;
            elevatedGlobalEnabled = (elevatedGlobal === null || elevatedGlobal === void 0 ? void 0 : elevatedGlobal.enabled) !== false;
            elevatedAgentEnabled = (elevatedAgent === null || elevatedAgent === void 0 ? void 0 : elevatedAgent.enabled) !== false;
            elevatedEnabled = elevatedGlobalEnabled && elevatedAgentEnabled;
            globalAllow = channel ? (_f = elevatedGlobal === null || elevatedGlobal === void 0 ? void 0 : elevatedGlobal.allowFrom) === null || _f === void 0 ? void 0 : _f[channel] : undefined;
            agentAllow = channel ? (_g = elevatedAgent === null || elevatedAgent === void 0 ? void 0 : elevatedAgent.allowFrom) === null || _g === void 0 ? void 0 : _g[channel] : undefined;
            allowTokens = function (values) {
                return (values !== null && values !== void 0 ? values : []).map(function (v) { return String(v).trim(); }).filter(Boolean);
            };
            globalAllowTokens = allowTokens(globalAllow);
            agentAllowTokens = allowTokens(agentAllow);
            elevatedAllowedByConfig = elevatedEnabled &&
                Boolean(channel) &&
                globalAllowTokens.length > 0 &&
                ((elevatedAgent === null || elevatedAgent === void 0 ? void 0 : elevatedAgent.allowFrom) ? agentAllowTokens.length > 0 : true);
            elevatedAlwaysAllowedByConfig = elevatedAllowedByConfig &&
                globalAllowTokens.includes("*") &&
                ((elevatedAgent === null || elevatedAgent === void 0 ? void 0 : elevatedAgent.allowFrom) ? agentAllowTokens.includes("*") : true);
            elevatedFailures = [];
            if (!elevatedGlobalEnabled) {
                elevatedFailures.push({ gate: "enabled", key: "tools.elevated.enabled" });
            }
            if (!elevatedAgentEnabled) {
                elevatedFailures.push({
                    gate: "enabled",
                    key: "agents.list[].tools.elevated.enabled",
                });
            }
            if (channel && globalAllowTokens.length === 0) {
                elevatedFailures.push({
                    gate: "allowFrom",
                    key: "tools.elevated.allowFrom.".concat(channel),
                });
            }
            if (channel && (elevatedAgent === null || elevatedAgent === void 0 ? void 0 : elevatedAgent.allowFrom) && agentAllowTokens.length === 0) {
                elevatedFailures.push({
                    gate: "allowFrom",
                    key: "agents.list[].tools.elevated.allowFrom.".concat(channel),
                });
            }
            fixIt = [];
            if (sandboxCfg.mode !== "off") {
                fixIt.push("agents.defaults.sandbox.mode=off");
                fixIt.push("agents.list[].sandbox.mode=off");
            }
            fixIt.push("tools.sandbox.tools.allow");
            fixIt.push("tools.sandbox.tools.deny");
            fixIt.push("agents.list[].tools.sandbox.tools.allow");
            fixIt.push("agents.list[].tools.sandbox.tools.deny");
            fixIt.push("tools.elevated.enabled");
            if (channel) {
                fixIt.push("tools.elevated.allowFrom.".concat(channel));
            }
            payload = {
                docsUrl: SANDBOX_DOCS_URL,
                agentId: resolvedAgentId,
                sessionKey: sessionKey,
                mainSessionKey: mainSessionKey,
                sandbox: {
                    mode: sandboxCfg.mode,
                    scope: sandboxCfg.scope,
                    perSession: sandboxCfg.scope === "session",
                    workspaceAccess: sandboxCfg.workspaceAccess,
                    workspaceRoot: sandboxCfg.workspaceRoot,
                    sessionIsSandboxed: sessionIsSandboxed,
                    tools: {
                        allow: toolPolicy.allow,
                        deny: toolPolicy.deny,
                        sources: toolPolicy.sources,
                    },
                },
                elevated: {
                    enabled: elevatedEnabled,
                    channel: channel,
                    allowedByConfig: elevatedAllowedByConfig,
                    alwaysAllowedByConfig: elevatedAlwaysAllowedByConfig,
                    allowFrom: {
                        global: channel ? globalAllowTokens : undefined,
                        agent: (elevatedAgent === null || elevatedAgent === void 0 ? void 0 : elevatedAgent.allowFrom) && channel ? agentAllowTokens : undefined,
                    },
                    failures: elevatedFailures,
                },
                fixIt: fixIt,
            };
            if (opts.json) {
                runtime.log("".concat(JSON.stringify(payload, null, 2), "\n"));
                return [2 /*return*/];
            }
            rich = (0, theme_js_1.isRich)();
            heading = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, value); };
            key = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, value); };
            value = function (val) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.info, val); };
            ok = function (val) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.success, val); };
            warn = function (val) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, val); };
            err = function (val) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.error, val); };
            bool = function (flag) { return (flag ? ok("true") : err("false")); };
            lines = [];
            lines.push(heading("Effective sandbox:"));
            lines.push("  ".concat(key("agentId:"), " ").concat(value(payload.agentId)));
            lines.push("  ".concat(key("sessionKey:"), " ").concat(value(payload.sessionKey)));
            lines.push("  ".concat(key("mainSessionKey:"), " ").concat(value(payload.mainSessionKey)));
            lines.push("  ".concat(key("runtime:"), " ").concat(payload.sandbox.sessionIsSandboxed ? warn("sandboxed") : ok("direct")));
            lines.push("  ".concat(key("mode:"), " ").concat(value(payload.sandbox.mode), " ").concat(key("scope:"), " ").concat(value(payload.sandbox.scope), " ").concat(key("perSession:"), " ").concat(bool(payload.sandbox.perSession)));
            lines.push("  ".concat(key("workspaceAccess:"), " ").concat(value(payload.sandbox.workspaceAccess), " ").concat(key("workspaceRoot:"), " ").concat(value(payload.sandbox.workspaceRoot)));
            lines.push("");
            lines.push(heading("Sandbox tool policy:"));
            lines.push("  ".concat(key("allow (".concat(payload.sandbox.tools.sources.allow.source, "):")), " ").concat(value(payload.sandbox.tools.allow.join(", ") || "(empty)")));
            lines.push("  ".concat(key("deny  (".concat(payload.sandbox.tools.sources.deny.source, "):")), " ").concat(value(payload.sandbox.tools.deny.join(", ") || "(empty)")));
            lines.push("");
            lines.push(heading("Elevated:"));
            lines.push("  ".concat(key("enabled:"), " ").concat(bool(payload.elevated.enabled)));
            lines.push("  ".concat(key("channel:"), " ").concat(value((_h = payload.elevated.channel) !== null && _h !== void 0 ? _h : "(unknown)")));
            lines.push("  ".concat(key("allowedByConfig:"), " ").concat(bool(payload.elevated.allowedByConfig)));
            if (payload.elevated.failures.length > 0) {
                lines.push("  ".concat(key("failing gates:"), " ").concat(warn(payload.elevated.failures.map(function (f) { return "".concat(f.gate, " (").concat(f.key, ")"); }).join(", "))));
            }
            if (payload.sandbox.mode === "non-main" && payload.sandbox.sessionIsSandboxed) {
                lines.push("");
                lines.push("".concat(warn("Hint:"), " sandbox mode is non-main; use main session key to run direct: ").concat(value(payload.mainSessionKey)));
            }
            lines.push("");
            lines.push(heading("Fix-it:"));
            for (_i = 0, _a = payload.fixIt; _i < _a.length; _i++) {
                key_1 = _a[_i];
                lines.push("  - ".concat(key_1));
            }
            lines.push("");
            lines.push("".concat(key("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/sandbox", "docs.openclaw.ai/sandbox")));
            runtime.log("".concat(lines.join("\n"), "\n"));
            return [2 /*return*/];
        });
    });
}
