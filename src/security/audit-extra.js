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
exports.collectAttackSurfaceSummaryFindings = collectAttackSurfaceSummaryFindings;
exports.collectSyncedFolderFindings = collectSyncedFolderFindings;
exports.collectSecretsInConfigFindings = collectSecretsInConfigFindings;
exports.collectHooksHardeningFindings = collectHooksHardeningFindings;
exports.collectModelHygieneFindings = collectModelHygieneFindings;
exports.collectSmallModelRiskFindings = collectSmallModelRiskFindings;
exports.collectPluginsTrustFindings = collectPluginsTrustFindings;
exports.collectIncludeFilePermFindings = collectIncludeFilePermFindings;
exports.collectStateDeepFilesystemFindings = collectStateDeepFilesystemFindings;
exports.collectExposureMatrixFindings = collectExposureMatrixFindings;
exports.readConfigSnapshotForAudit = readConfigSnapshotForAudit;
var json5_1 = require("json5");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var pi_tools_policy_js_1 = require("../agents/pi-tools.policy.js");
var sandbox_js_1 = require("../agents/sandbox.js");
var tool_policy_js_1 = require("../agents/tool-policy.js");
var config_js_1 = require("../browser/config.js");
var command_format_js_1 = require("../cli/command-format.js");
var commands_js_1 = require("../config/commands.js");
var config_js_2 = require("../config/config.js");
var includes_js_1 = require("../config/includes.js");
var paths_js_1 = require("../config/paths.js");
var auth_js_1 = require("../gateway/auth.js");
var session_key_js_1 = require("../routing/session-key.js");
var audit_fs_js_1 = require("./audit-fs.js");
var SMALL_MODEL_PARAM_B_MAX = 300;
function expandTilde(p, env) {
    if (!p.startsWith("~")) {
        return p;
    }
    var home = typeof env.HOME === "string" && env.HOME.trim() ? env.HOME.trim() : null;
    if (!home) {
        return null;
    }
    if (p === "~") {
        return home;
    }
    if (p.startsWith("~/") || p.startsWith("~\\")) {
        return node_path_1.default.join(home, p.slice(2));
    }
    return null;
}
function summarizeGroupPolicy(cfg) {
    var channels = cfg.channels;
    if (!channels || typeof channels !== "object") {
        return { open: 0, allowlist: 0, other: 0 };
    }
    var open = 0;
    var allowlist = 0;
    var other = 0;
    for (var _i = 0, _a = Object.values(channels); _i < _a.length; _i++) {
        var value = _a[_i];
        if (!value || typeof value !== "object") {
            continue;
        }
        var section = value;
        var policy = section.groupPolicy;
        if (policy === "open") {
            open += 1;
        }
        else if (policy === "allowlist") {
            allowlist += 1;
        }
        else {
            other += 1;
        }
    }
    return { open: open, allowlist: allowlist, other: other };
}
function collectAttackSurfaceSummaryFindings(cfg) {
    var _a, _b, _c, _d, _e;
    var group = summarizeGroupPolicy(cfg);
    var elevated = ((_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.elevated) === null || _b === void 0 ? void 0 : _b.enabled) !== false;
    var hooksEnabled = ((_c = cfg.hooks) === null || _c === void 0 ? void 0 : _c.enabled) === true;
    var browserEnabled = (_e = (_d = cfg.browser) === null || _d === void 0 ? void 0 : _d.enabled) !== null && _e !== void 0 ? _e : true;
    var detail = "groups: open=".concat(group.open, ", allowlist=").concat(group.allowlist) +
        "\n" +
        "tools.elevated: ".concat(elevated ? "enabled" : "disabled") +
        "\n" +
        "hooks: ".concat(hooksEnabled ? "enabled" : "disabled") +
        "\n" +
        "browser control: ".concat(browserEnabled ? "enabled" : "disabled");
    return [
        {
            checkId: "summary.attack_surface",
            severity: "info",
            title: "Attack surface summary",
            detail: detail,
        },
    ];
}
function isProbablySyncedPath(p) {
    var s = p.toLowerCase();
    return (s.includes("icloud") ||
        s.includes("dropbox") ||
        s.includes("google drive") ||
        s.includes("googledrive") ||
        s.includes("onedrive"));
}
function collectSyncedFolderFindings(params) {
    var findings = [];
    if (isProbablySyncedPath(params.stateDir) || isProbablySyncedPath(params.configPath)) {
        findings.push({
            checkId: "fs.synced_dir",
            severity: "warn",
            title: "State/config path looks like a synced folder",
            detail: "stateDir=".concat(params.stateDir, ", configPath=").concat(params.configPath, ". Synced folders (iCloud/Dropbox/OneDrive/Google Drive) can leak tokens and transcripts onto other devices."),
            remediation: "Keep OPENCLAW_STATE_DIR on a local-only volume and re-run \"".concat((0, command_format_js_1.formatCliCommand)("openclaw security audit --fix"), "\"."),
        });
    }
    return findings;
}
function looksLikeEnvRef(value) {
    var v = value.trim();
    return v.startsWith("${") && v.endsWith("}");
}
function collectSecretsInConfigFindings(cfg) {
    var _a, _b, _c, _d;
    var findings = [];
    var password = typeof ((_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.password) === "string" ? cfg.gateway.auth.password.trim() : "";
    if (password && !looksLikeEnvRef(password)) {
        findings.push({
            checkId: "config.secrets.gateway_password_in_config",
            severity: "warn",
            title: "Gateway password is stored in config",
            detail: "gateway.auth.password is set in the config file; prefer environment variables for secrets when possible.",
            remediation: "Prefer OPENCLAW_GATEWAY_PASSWORD (env) and remove gateway.auth.password from disk.",
        });
    }
    var hooksToken = typeof ((_c = cfg.hooks) === null || _c === void 0 ? void 0 : _c.token) === "string" ? cfg.hooks.token.trim() : "";
    if (((_d = cfg.hooks) === null || _d === void 0 ? void 0 : _d.enabled) === true && hooksToken && !looksLikeEnvRef(hooksToken)) {
        findings.push({
            checkId: "config.secrets.hooks_token_in_config",
            severity: "info",
            title: "Hooks token is stored in config",
            detail: "hooks.token is set in the config file; keep config perms tight and treat it like an API secret.",
        });
    }
    return findings;
}
function collectHooksHardeningFindings(cfg) {
    var _a, _b, _c, _d, _e, _f, _g;
    var findings = [];
    if (((_a = cfg.hooks) === null || _a === void 0 ? void 0 : _a.enabled) !== true) {
        return findings;
    }
    var token = typeof ((_b = cfg.hooks) === null || _b === void 0 ? void 0 : _b.token) === "string" ? cfg.hooks.token.trim() : "";
    if (token && token.length < 24) {
        findings.push({
            checkId: "hooks.token_too_short",
            severity: "warn",
            title: "Hooks token looks short",
            detail: "hooks.token is ".concat(token.length, " chars; prefer a long random token."),
        });
    }
    var gatewayAuth = (0, auth_js_1.resolveGatewayAuth)({
        authConfig: (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.auth,
        tailscaleMode: (_f = (_e = (_d = cfg.gateway) === null || _d === void 0 ? void 0 : _d.tailscale) === null || _e === void 0 ? void 0 : _e.mode) !== null && _f !== void 0 ? _f : "off",
    });
    var gatewayToken = gatewayAuth.mode === "token" &&
        typeof gatewayAuth.token === "string" &&
        gatewayAuth.token.trim()
        ? gatewayAuth.token.trim()
        : null;
    if (token && gatewayToken && token === gatewayToken) {
        findings.push({
            checkId: "hooks.token_reuse_gateway_token",
            severity: "warn",
            title: "Hooks token reuses the Gateway token",
            detail: "hooks.token matches gateway.auth token; compromise of hooks expands blast radius to the Gateway API.",
            remediation: "Use a separate hooks.token dedicated to hook ingress.",
        });
    }
    var rawPath = typeof ((_g = cfg.hooks) === null || _g === void 0 ? void 0 : _g.path) === "string" ? cfg.hooks.path.trim() : "";
    if (rawPath === "/") {
        findings.push({
            checkId: "hooks.path_root",
            severity: "critical",
            title: "Hooks base path is '/'",
            detail: "hooks.path='/' would shadow other HTTP endpoints and is unsafe.",
            remediation: "Use a dedicated path like '/hooks'.",
        });
    }
    return findings;
}
function addModel(models, raw, source) {
    if (typeof raw !== "string") {
        return;
    }
    var id = raw.trim();
    if (!id) {
        return;
    }
    models.push({ id: id, source: source });
}
function collectModels(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var out = [];
    addModel(out, (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.primary, "agents.defaults.model.primary");
    for (var _i = 0, _s = (_g = (_f = (_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) === null || _e === void 0 ? void 0 : _e.model) === null || _f === void 0 ? void 0 : _f.fallbacks) !== null && _g !== void 0 ? _g : []; _i < _s.length; _i++) {
        var f = _s[_i];
        addModel(out, f, "agents.defaults.model.fallbacks");
    }
    addModel(out, (_k = (_j = (_h = cfg.agents) === null || _h === void 0 ? void 0 : _h.defaults) === null || _j === void 0 ? void 0 : _j.imageModel) === null || _k === void 0 ? void 0 : _k.primary, "agents.defaults.imageModel.primary");
    for (var _t = 0, _u = (_p = (_o = (_m = (_l = cfg.agents) === null || _l === void 0 ? void 0 : _l.defaults) === null || _m === void 0 ? void 0 : _m.imageModel) === null || _o === void 0 ? void 0 : _o.fallbacks) !== null && _p !== void 0 ? _p : []; _t < _u.length; _t++) {
        var f = _u[_t];
        addModel(out, f, "agents.defaults.imageModel.fallbacks");
    }
    var list = Array.isArray((_q = cfg.agents) === null || _q === void 0 ? void 0 : _q.list) ? (_r = cfg.agents) === null || _r === void 0 ? void 0 : _r.list : [];
    for (var _v = 0, _w = list !== null && list !== void 0 ? list : []; _v < _w.length; _v++) {
        var agent = _w[_v];
        if (!agent || typeof agent !== "object") {
            continue;
        }
        var id = typeof agent.id === "string" ? agent.id : "";
        var model = agent.model;
        if (typeof model === "string") {
            addModel(out, model, "agents.list.".concat(id, ".model"));
        }
        else if (model && typeof model === "object") {
            addModel(out, model.primary, "agents.list.".concat(id, ".model.primary"));
            var fallbacks = model.fallbacks;
            if (Array.isArray(fallbacks)) {
                for (var _x = 0, fallbacks_1 = fallbacks; _x < fallbacks_1.length; _x++) {
                    var f = fallbacks_1[_x];
                    addModel(out, f, "agents.list.".concat(id, ".model.fallbacks"));
                }
            }
        }
    }
    return out;
}
var LEGACY_MODEL_PATTERNS = [
    { id: "openai.gpt35", re: /\bgpt-3\.5\b/i, label: "GPT-3.5 family" },
    { id: "anthropic.claude2", re: /\bclaude-(instant|2)\b/i, label: "Claude 2/Instant family" },
    { id: "openai.gpt4_legacy", re: /\bgpt-4-(0314|0613)\b/i, label: "Legacy GPT-4 snapshots" },
];
var WEAK_TIER_MODEL_PATTERNS = [
    { id: "anthropic.haiku", re: /\bhaiku\b/i, label: "Haiku tier (smaller model)" },
];
function inferParamBFromIdOrName(text) {
    var raw = text.toLowerCase();
    var matches = raw.matchAll(/(?:^|[^a-z0-9])[a-z]?(\d+(?:\.\d+)?)b(?:[^a-z0-9]|$)/g);
    var best = null;
    for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
        var match = matches_1[_i];
        var numRaw = match[1];
        if (!numRaw) {
            continue;
        }
        var value = Number(numRaw);
        if (!Number.isFinite(value) || value <= 0) {
            continue;
        }
        if (best === null || value > best) {
            best = value;
        }
    }
    return best;
}
function isGptModel(id) {
    return /\bgpt-/i.test(id);
}
function isGpt5OrHigher(id) {
    return /\bgpt-5(?:\b|[.-])/i.test(id);
}
function isClaudeModel(id) {
    return /\bclaude-/i.test(id);
}
function isClaude45OrHigher(id) {
    // Match claude-*-4-5, claude-*-45, claude-*4.5, or opus-4-5/opus-45 variants
    // Examples that should match:
    //   claude-opus-4-5, claude-opus-45, claude-4.5, venice/claude-opus-45
    return /\bclaude-[^\s/]*?(?:-4-?5\b|4\.5\b)/i.test(id);
}
function collectModelHygieneFindings(cfg) {
    var findings = [];
    var models = collectModels(cfg);
    if (models.length === 0) {
        return findings;
    }
    var weakMatches = new Map();
    var addWeakMatch = function (model, source, reason) {
        var key = "".concat(model, "@@").concat(source);
        var existing = weakMatches.get(key);
        if (!existing) {
            weakMatches.set(key, { model: model, source: source, reasons: [reason] });
            return;
        }
        if (!existing.reasons.includes(reason)) {
            existing.reasons.push(reason);
        }
    };
    for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
        var entry = models_1[_i];
        for (var _a = 0, WEAK_TIER_MODEL_PATTERNS_1 = WEAK_TIER_MODEL_PATTERNS; _a < WEAK_TIER_MODEL_PATTERNS_1.length; _a++) {
            var pat = WEAK_TIER_MODEL_PATTERNS_1[_a];
            if (pat.re.test(entry.id)) {
                addWeakMatch(entry.id, entry.source, pat.label);
                break;
            }
        }
        if (isGptModel(entry.id) && !isGpt5OrHigher(entry.id)) {
            addWeakMatch(entry.id, entry.source, "Below GPT-5 family");
        }
        if (isClaudeModel(entry.id) && !isClaude45OrHigher(entry.id)) {
            addWeakMatch(entry.id, entry.source, "Below Claude 4.5");
        }
    }
    var matches = [];
    for (var _b = 0, models_2 = models; _b < models_2.length; _b++) {
        var entry = models_2[_b];
        for (var _c = 0, LEGACY_MODEL_PATTERNS_1 = LEGACY_MODEL_PATTERNS; _c < LEGACY_MODEL_PATTERNS_1.length; _c++) {
            var pat = LEGACY_MODEL_PATTERNS_1[_c];
            if (pat.re.test(entry.id)) {
                matches.push({ model: entry.id, source: entry.source, reason: pat.label });
                break;
            }
        }
    }
    if (matches.length > 0) {
        var lines = matches
            .slice(0, 12)
            .map(function (m) { return "- ".concat(m.model, " (").concat(m.reason, ") @ ").concat(m.source); })
            .join("\n");
        var more = matches.length > 12 ? "\n\u2026".concat(matches.length - 12, " more") : "";
        findings.push({
            checkId: "models.legacy",
            severity: "warn",
            title: "Some configured models look legacy",
            detail: "Older/legacy models can be less robust against prompt injection and tool misuse.\n" +
                lines +
                more,
            remediation: "Prefer modern, instruction-hardened models for any bot that can run tools.",
        });
    }
    if (weakMatches.size > 0) {
        var lines = Array.from(weakMatches.values())
            .slice(0, 12)
            .map(function (m) { return "- ".concat(m.model, " (").concat(m.reasons.join("; "), ") @ ").concat(m.source); })
            .join("\n");
        var more = weakMatches.size > 12 ? "\n\u2026".concat(weakMatches.size - 12, " more") : "";
        findings.push({
            checkId: "models.weak_tier",
            severity: "warn",
            title: "Some configured models are below recommended tiers",
            detail: "Smaller/older models are generally more susceptible to prompt injection and tool misuse.\n" +
                lines +
                more,
            remediation: "Use the latest, top-tier model for any bot with tools or untrusted inboxes. Avoid Haiku tiers; prefer GPT-5+ and Claude 4.5+.",
        });
    }
    return findings;
}
function extractAgentIdFromSource(source) {
    var _a;
    var match = source.match(/^agents\.list\.([^.]*)\./);
    return (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : null;
}
function pickToolPolicy(config) {
    if (!config) {
        return null;
    }
    var allow = Array.isArray(config.allow) ? config.allow : undefined;
    var deny = Array.isArray(config.deny) ? config.deny : undefined;
    if (!allow && !deny) {
        return null;
    }
    return { allow: allow, deny: deny };
}
function resolveToolPolicies(params) {
    var _a, _b, _c, _d, _e;
    var policies = [];
    var profile = (_b = (_a = params.agentTools) === null || _a === void 0 ? void 0 : _a.profile) !== null && _b !== void 0 ? _b : (_c = params.cfg.tools) === null || _c === void 0 ? void 0 : _c.profile;
    var profilePolicy = (0, tool_policy_js_1.resolveToolProfilePolicy)(profile);
    if (profilePolicy) {
        policies.push(profilePolicy);
    }
    var globalPolicy = pickToolPolicy((_d = params.cfg.tools) !== null && _d !== void 0 ? _d : undefined);
    if (globalPolicy) {
        policies.push(globalPolicy);
    }
    var agentPolicy = pickToolPolicy(params.agentTools);
    if (agentPolicy) {
        policies.push(agentPolicy);
    }
    if (params.sandboxMode === "all") {
        var sandboxPolicy = (0, sandbox_js_1.resolveSandboxToolPolicyForAgent)(params.cfg, (_e = params.agentId) !== null && _e !== void 0 ? _e : undefined);
        policies.push(sandboxPolicy);
    }
    return policies;
}
function hasWebSearchKey(cfg, env) {
    var _a, _b, _c;
    var search = (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.web) === null || _b === void 0 ? void 0 : _b.search;
    return Boolean((search === null || search === void 0 ? void 0 : search.apiKey) ||
        ((_c = search === null || search === void 0 ? void 0 : search.perplexity) === null || _c === void 0 ? void 0 : _c.apiKey) ||
        env.BRAVE_API_KEY ||
        env.PERPLEXITY_API_KEY ||
        env.OPENROUTER_API_KEY);
}
function isWebSearchEnabled(cfg, env) {
    var _a, _b, _c;
    var enabled = (_c = (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.web) === null || _b === void 0 ? void 0 : _b.search) === null || _c === void 0 ? void 0 : _c.enabled;
    if (enabled === false) {
        return false;
    }
    if (enabled === true) {
        return true;
    }
    return hasWebSearchKey(cfg, env);
}
function isWebFetchEnabled(cfg) {
    var _a, _b, _c;
    var enabled = (_c = (_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.web) === null || _b === void 0 ? void 0 : _b.fetch) === null || _c === void 0 ? void 0 : _c.enabled;
    if (enabled === false) {
        return false;
    }
    return true;
}
function isBrowserEnabled(cfg) {
    try {
        return (0, config_js_1.resolveBrowserConfig)(cfg.browser, cfg).enabled;
    }
    catch (_a) {
        return true;
    }
}
function collectSmallModelRiskFindings(params) {
    var _a, _b;
    var findings = [];
    var models = collectModels(params.cfg).filter(function (entry) { return !entry.source.includes("imageModel"); });
    if (models.length === 0) {
        return findings;
    }
    var smallModels = models
        .map(function (entry) {
        var paramB = inferParamBFromIdOrName(entry.id);
        if (!paramB || paramB > SMALL_MODEL_PARAM_B_MAX) {
            return null;
        }
        return __assign(__assign({}, entry), { paramB: paramB });
    })
        .filter(function (entry) { return Boolean(entry); });
    if (smallModels.length === 0) {
        return findings;
    }
    var hasUnsafe = false;
    var modelLines = [];
    var exposureSet = new Set();
    var _loop_1 = function (entry) {
        var agentId = extractAgentIdFromSource(entry.source);
        var sandboxMode = (0, sandbox_js_1.resolveSandboxConfigForAgent)(params.cfg, agentId !== null && agentId !== void 0 ? agentId : undefined).mode;
        var agentTools = agentId && ((_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.list)
            ? (_b = params.cfg.agents.list.find(function (agent) { return (agent === null || agent === void 0 ? void 0 : agent.id) === agentId; })) === null || _b === void 0 ? void 0 : _b.tools
            : undefined;
        var policies = resolveToolPolicies({
            cfg: params.cfg,
            agentTools: agentTools,
            sandboxMode: sandboxMode,
            agentId: agentId,
        });
        var exposed = [];
        if (isWebSearchEnabled(params.cfg, params.env)) {
            if ((0, pi_tools_policy_js_1.isToolAllowedByPolicies)("web_search", policies)) {
                exposed.push("web_search");
            }
        }
        if (isWebFetchEnabled(params.cfg)) {
            if ((0, pi_tools_policy_js_1.isToolAllowedByPolicies)("web_fetch", policies)) {
                exposed.push("web_fetch");
            }
        }
        if (isBrowserEnabled(params.cfg)) {
            if ((0, pi_tools_policy_js_1.isToolAllowedByPolicies)("browser", policies)) {
                exposed.push("browser");
            }
        }
        for (var _c = 0, exposed_1 = exposed; _c < exposed_1.length; _c++) {
            var tool = exposed_1[_c];
            exposureSet.add(tool);
        }
        var sandboxLabel = sandboxMode === "all" ? "sandbox=all" : "sandbox=".concat(sandboxMode);
        var exposureLabel = exposed.length > 0 ? " web=[".concat(exposed.join(", "), "]") : " web=[off]";
        var safe = sandboxMode === "all" && exposed.length === 0;
        if (!safe) {
            hasUnsafe = true;
        }
        var statusLabel = safe ? "ok" : "unsafe";
        modelLines.push("- ".concat(entry.id, " (").concat(entry.paramB, "B) @ ").concat(entry.source, " (").concat(statusLabel, "; ").concat(sandboxLabel, ";").concat(exposureLabel, ")"));
    };
    for (var _i = 0, smallModels_1 = smallModels; _i < smallModels_1.length; _i++) {
        var entry = smallModels_1[_i];
        _loop_1(entry);
    }
    var exposureList = Array.from(exposureSet);
    var exposureDetail = exposureList.length > 0
        ? "Uncontrolled input tools allowed: ".concat(exposureList.join(", "), ".")
        : "No web/browser tools detected for these models.";
    findings.push({
        checkId: "models.small_params",
        severity: hasUnsafe ? "critical" : "info",
        title: "Small models require sandboxing and web tools disabled",
        detail: "Small models (<=".concat(SMALL_MODEL_PARAM_B_MAX, "B params) detected:\n") +
            modelLines.join("\n") +
            "\n" +
            exposureDetail +
            "\n" +
            "Small models are not recommended for untrusted inputs.",
        remediation: 'If you must use small models, enable sandboxing for all sessions (agents.defaults.sandbox.mode="all") and disable web_search/web_fetch/browser (tools.deny=["group:web","browser"]).',
    });
    return findings;
}
function collectPluginsTrustFindings(params) {
    return __awaiter(this, void 0, void 0, function () {
        var findings, extensionsDir, st, entries, pluginDirs, allow, allowConfigured, hasString_1, hasAccountStringKey_1, discordConfigured, telegramConfigured, slackConfigured, skillCommandsLikelyExposed;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        return __generator(this, function (_5) {
            switch (_5.label) {
                case 0:
                    findings = [];
                    extensionsDir = node_path_1.default.join(params.stateDir, "extensions");
                    return [4 /*yield*/, (0, audit_fs_js_1.safeStat)(extensionsDir)];
                case 1:
                    st = _5.sent();
                    if (!st.ok || !st.isDir) {
                        return [2 /*return*/, findings];
                    }
                    return [4 /*yield*/, promises_1.default.readdir(extensionsDir, { withFileTypes: true }).catch(function () { return []; })];
                case 2:
                    entries = _5.sent();
                    pluginDirs = entries
                        .filter(function (e) { return e.isDirectory(); })
                        .map(function (e) { return e.name; })
                        .filter(Boolean);
                    if (pluginDirs.length === 0) {
                        return [2 /*return*/, findings];
                    }
                    allow = (_a = params.cfg.plugins) === null || _a === void 0 ? void 0 : _a.allow;
                    allowConfigured = Array.isArray(allow) && allow.length > 0;
                    if (!allowConfigured) {
                        hasString_1 = function (value) { return typeof value === "string" && value.trim().length > 0; };
                        hasAccountStringKey_1 = function (account, key) {
                            return Boolean(account &&
                                typeof account === "object" &&
                                hasString_1(account[key]));
                        };
                        discordConfigured = hasString_1((_c = (_b = params.cfg.channels) === null || _b === void 0 ? void 0 : _b.discord) === null || _c === void 0 ? void 0 : _c.token) ||
                            Boolean(((_e = (_d = params.cfg.channels) === null || _d === void 0 ? void 0 : _d.discord) === null || _e === void 0 ? void 0 : _e.accounts) &&
                                Object.values(params.cfg.channels.discord.accounts).some(function (a) {
                                    return hasAccountStringKey_1(a, "token");
                                })) ||
                            hasString_1(process.env.DISCORD_BOT_TOKEN);
                        telegramConfigured = hasString_1((_g = (_f = params.cfg.channels) === null || _f === void 0 ? void 0 : _f.telegram) === null || _g === void 0 ? void 0 : _g.botToken) ||
                            hasString_1((_j = (_h = params.cfg.channels) === null || _h === void 0 ? void 0 : _h.telegram) === null || _j === void 0 ? void 0 : _j.tokenFile) ||
                            Boolean(((_l = (_k = params.cfg.channels) === null || _k === void 0 ? void 0 : _k.telegram) === null || _l === void 0 ? void 0 : _l.accounts) &&
                                Object.values(params.cfg.channels.telegram.accounts).some(function (a) { return hasAccountStringKey_1(a, "botToken") || hasAccountStringKey_1(a, "tokenFile"); })) ||
                            hasString_1(process.env.TELEGRAM_BOT_TOKEN);
                        slackConfigured = hasString_1((_o = (_m = params.cfg.channels) === null || _m === void 0 ? void 0 : _m.slack) === null || _o === void 0 ? void 0 : _o.botToken) ||
                            hasString_1((_q = (_p = params.cfg.channels) === null || _p === void 0 ? void 0 : _p.slack) === null || _q === void 0 ? void 0 : _q.appToken) ||
                            Boolean(((_s = (_r = params.cfg.channels) === null || _r === void 0 ? void 0 : _r.slack) === null || _s === void 0 ? void 0 : _s.accounts) &&
                                Object.values(params.cfg.channels.slack.accounts).some(function (a) { return hasAccountStringKey_1(a, "botToken") || hasAccountStringKey_1(a, "appToken"); })) ||
                            hasString_1(process.env.SLACK_BOT_TOKEN) ||
                            hasString_1(process.env.SLACK_APP_TOKEN);
                        skillCommandsLikelyExposed = (discordConfigured &&
                            (0, commands_js_1.resolveNativeSkillsEnabled)({
                                providerId: "discord",
                                providerSetting: (_v = (_u = (_t = params.cfg.channels) === null || _t === void 0 ? void 0 : _t.discord) === null || _u === void 0 ? void 0 : _u.commands) === null || _v === void 0 ? void 0 : _v.nativeSkills,
                                globalSetting: (_w = params.cfg.commands) === null || _w === void 0 ? void 0 : _w.nativeSkills,
                            })) ||
                            (telegramConfigured &&
                                (0, commands_js_1.resolveNativeSkillsEnabled)({
                                    providerId: "telegram",
                                    providerSetting: (_z = (_y = (_x = params.cfg.channels) === null || _x === void 0 ? void 0 : _x.telegram) === null || _y === void 0 ? void 0 : _y.commands) === null || _z === void 0 ? void 0 : _z.nativeSkills,
                                    globalSetting: (_0 = params.cfg.commands) === null || _0 === void 0 ? void 0 : _0.nativeSkills,
                                })) ||
                            (slackConfigured &&
                                (0, commands_js_1.resolveNativeSkillsEnabled)({
                                    providerId: "slack",
                                    providerSetting: (_3 = (_2 = (_1 = params.cfg.channels) === null || _1 === void 0 ? void 0 : _1.slack) === null || _2 === void 0 ? void 0 : _2.commands) === null || _3 === void 0 ? void 0 : _3.nativeSkills,
                                    globalSetting: (_4 = params.cfg.commands) === null || _4 === void 0 ? void 0 : _4.nativeSkills,
                                }));
                        findings.push({
                            checkId: "plugins.extensions_no_allowlist",
                            severity: skillCommandsLikelyExposed ? "critical" : "warn",
                            title: "Extensions exist but plugins.allow is not set",
                            detail: "Found ".concat(pluginDirs.length, " extension(s) under ").concat(extensionsDir, ". Without plugins.allow, any discovered plugin id may load (depending on config and plugin behavior).") +
                                (skillCommandsLikelyExposed
                                    ? "\nNative skill commands are enabled on at least one configured chat surface; treat unpinned/unallowlisted extensions as high risk."
                                    : ""),
                            remediation: "Set plugins.allow to an explicit list of plugin ids you trust.",
                        });
                    }
                    return [2 /*return*/, findings];
            }
        });
    });
}
function resolveIncludePath(baseConfigPath, includePath) {
    return node_path_1.default.normalize(node_path_1.default.isAbsolute(includePath)
        ? includePath
        : node_path_1.default.resolve(node_path_1.default.dirname(baseConfigPath), includePath));
}
function listDirectIncludes(parsed) {
    var out = [];
    var visit = function (value) {
        if (!value) {
            return;
        }
        if (Array.isArray(value)) {
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var item = value_1[_i];
                visit(item);
            }
            return;
        }
        if (typeof value !== "object") {
            return;
        }
        var rec = value;
        var includeVal = rec[includes_js_1.INCLUDE_KEY];
        if (typeof includeVal === "string") {
            out.push(includeVal);
        }
        else if (Array.isArray(includeVal)) {
            for (var _a = 0, includeVal_1 = includeVal; _a < includeVal_1.length; _a++) {
                var item = includeVal_1[_a];
                if (typeof item === "string") {
                    out.push(item);
                }
            }
        }
        for (var _b = 0, _c = Object.values(rec); _b < _c.length; _b++) {
            var v = _c[_b];
            visit(v);
        }
    };
    visit(parsed);
    return out;
}
function collectIncludePathsRecursive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var visited, result, walk;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    visited = new Set();
                    result = [];
                    walk = function (basePath, parsed, depth) { return __awaiter(_this, void 0, void 0, function () {
                        var _loop_2, _i, _a, raw;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (depth > includes_js_1.MAX_INCLUDE_DEPTH) {
                                        return [2 /*return*/];
                                    }
                                    _loop_2 = function (raw) {
                                        var resolved, rawText, nestedParsed;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    resolved = resolveIncludePath(basePath, raw);
                                                    if (visited.has(resolved)) {
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    visited.add(resolved);
                                                    result.push(resolved);
                                                    return [4 /*yield*/, promises_1.default.readFile(resolved, "utf-8").catch(function () { return null; })];
                                                case 1:
                                                    rawText = _c.sent();
                                                    if (!rawText) {
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    nestedParsed = (function () {
                                                        try {
                                                            return json5_1.default.parse(rawText);
                                                        }
                                                        catch (_a) {
                                                            return null;
                                                        }
                                                    })();
                                                    if (!nestedParsed) return [3 /*break*/, 3];
                                                    // eslint-disable-next-line no-await-in-loop
                                                    return [4 /*yield*/, walk(resolved, nestedParsed, depth + 1)];
                                                case 2:
                                                    // eslint-disable-next-line no-await-in-loop
                                                    _c.sent();
                                                    _c.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = listDirectIncludes(parsed);
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                    raw = _a[_i];
                                    return [5 /*yield**/, _loop_2(raw)];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, walk(params.configPath, params.parsed, 0)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function collectIncludeFilePermFindings(params) {
    return __awaiter(this, void 0, void 0, function () {
        var findings, configPath, includePaths, _i, includePaths_1, p, perms;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    findings = [];
                    if (!params.configSnapshot.exists) {
                        return [2 /*return*/, findings];
                    }
                    configPath = params.configSnapshot.path;
                    return [4 /*yield*/, collectIncludePathsRecursive({
                            configPath: configPath,
                            parsed: params.configSnapshot.parsed,
                        })];
                case 1:
                    includePaths = _a.sent();
                    if (includePaths.length === 0) {
                        return [2 /*return*/, findings];
                    }
                    _i = 0, includePaths_1 = includePaths;
                    _a.label = 2;
                case 2:
                    if (!(_i < includePaths_1.length)) return [3 /*break*/, 5];
                    p = includePaths_1[_i];
                    return [4 /*yield*/, (0, audit_fs_js_1.inspectPathPermissions)(p, {
                            env: params.env,
                            platform: params.platform,
                            exec: params.execIcacls,
                        })];
                case 3:
                    perms = _a.sent();
                    if (!perms.ok) {
                        return [3 /*break*/, 4];
                    }
                    if (perms.worldWritable || perms.groupWritable) {
                        findings.push({
                            checkId: "fs.config_include.perms_writable",
                            severity: "critical",
                            title: "Config include file is writable by others",
                            detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(p, perms), "; another user could influence your effective config."),
                            remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                targetPath: p,
                                perms: perms,
                                isDir: false,
                                posixMode: 384,
                                env: params.env,
                            }),
                        });
                    }
                    else if (perms.worldReadable) {
                        findings.push({
                            checkId: "fs.config_include.perms_world_readable",
                            severity: "critical",
                            title: "Config include file is world-readable",
                            detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(p, perms), "; include files can contain tokens and private settings."),
                            remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                targetPath: p,
                                perms: perms,
                                isDir: false,
                                posixMode: 384,
                                env: params.env,
                            }),
                        });
                    }
                    else if (perms.groupReadable) {
                        findings.push({
                            checkId: "fs.config_include.perms_group_readable",
                            severity: "warn",
                            title: "Config include file is group-readable",
                            detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(p, perms), "; include files can contain tokens and private settings."),
                            remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                targetPath: p,
                                perms: perms,
                                isDir: false,
                                posixMode: 384,
                                env: params.env,
                            }),
                        });
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, findings];
            }
        });
    });
}
function collectStateDeepFilesystemFindings(params) {
    return __awaiter(this, void 0, void 0, function () {
        var findings, oauthDir, oauthPerms, agentIds, defaultAgentId, ids, _i, ids_1, agentId, agentDir, authPath, authPerms, storePath, storePerms, logFile, expanded, logPath, logPerms;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    findings = [];
                    oauthDir = (0, paths_js_1.resolveOAuthDir)(params.env, params.stateDir);
                    return [4 /*yield*/, (0, audit_fs_js_1.inspectPathPermissions)(oauthDir, {
                            env: params.env,
                            platform: params.platform,
                            exec: params.execIcacls,
                        })];
                case 1:
                    oauthPerms = _d.sent();
                    if (oauthPerms.ok && oauthPerms.isDir) {
                        if (oauthPerms.worldWritable || oauthPerms.groupWritable) {
                            findings.push({
                                checkId: "fs.credentials_dir.perms_writable",
                                severity: "critical",
                                title: "Credentials dir is writable by others",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(oauthDir, oauthPerms), "; another user could drop/modify credential files."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: oauthDir,
                                    perms: oauthPerms,
                                    isDir: true,
                                    posixMode: 448,
                                    env: params.env,
                                }),
                            });
                        }
                        else if (oauthPerms.groupReadable || oauthPerms.worldReadable) {
                            findings.push({
                                checkId: "fs.credentials_dir.perms_readable",
                                severity: "warn",
                                title: "Credentials dir is readable by others",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(oauthDir, oauthPerms), "; credentials and allowlists can be sensitive."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: oauthDir,
                                    perms: oauthPerms,
                                    isDir: true,
                                    posixMode: 448,
                                    env: params.env,
                                }),
                            });
                        }
                    }
                    agentIds = Array.isArray((_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.list)
                        ? (_b = params.cfg.agents) === null || _b === void 0 ? void 0 : _b.list.map(function (a) { return (a && typeof a === "object" && typeof a.id === "string" ? a.id.trim() : ""); }).filter(Boolean)
                        : [];
                    defaultAgentId = (0, agent_scope_js_1.resolveDefaultAgentId)(params.cfg);
                    ids = Array.from(new Set(__spreadArray([defaultAgentId], agentIds, true))).map(function (id) { return (0, session_key_js_1.normalizeAgentId)(id); });
                    _i = 0, ids_1 = ids;
                    _d.label = 2;
                case 2:
                    if (!(_i < ids_1.length)) return [3 /*break*/, 6];
                    agentId = ids_1[_i];
                    agentDir = node_path_1.default.join(params.stateDir, "agents", agentId, "agent");
                    authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    return [4 /*yield*/, (0, audit_fs_js_1.inspectPathPermissions)(authPath, {
                            env: params.env,
                            platform: params.platform,
                            exec: params.execIcacls,
                        })];
                case 3:
                    authPerms = _d.sent();
                    if (authPerms.ok) {
                        if (authPerms.worldWritable || authPerms.groupWritable) {
                            findings.push({
                                checkId: "fs.auth_profiles.perms_writable",
                                severity: "critical",
                                title: "auth-profiles.json is writable by others",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(authPath, authPerms), "; another user could inject credentials."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: authPath,
                                    perms: authPerms,
                                    isDir: false,
                                    posixMode: 384,
                                    env: params.env,
                                }),
                            });
                        }
                        else if (authPerms.worldReadable || authPerms.groupReadable) {
                            findings.push({
                                checkId: "fs.auth_profiles.perms_readable",
                                severity: "warn",
                                title: "auth-profiles.json is readable by others",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(authPath, authPerms), "; auth-profiles.json contains API keys and OAuth tokens."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: authPath,
                                    perms: authPerms,
                                    isDir: false,
                                    posixMode: 384,
                                    env: params.env,
                                }),
                            });
                        }
                    }
                    storePath = node_path_1.default.join(params.stateDir, "agents", agentId, "sessions", "sessions.json");
                    return [4 /*yield*/, (0, audit_fs_js_1.inspectPathPermissions)(storePath, {
                            env: params.env,
                            platform: params.platform,
                            exec: params.execIcacls,
                        })];
                case 4:
                    storePerms = _d.sent();
                    if (storePerms.ok) {
                        if (storePerms.worldReadable || storePerms.groupReadable) {
                            findings.push({
                                checkId: "fs.sessions_store.perms_readable",
                                severity: "warn",
                                title: "sessions.json is readable by others",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(storePath, storePerms), "; routing and transcript metadata can be sensitive."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: storePath,
                                    perms: storePerms,
                                    isDir: false,
                                    posixMode: 384,
                                    env: params.env,
                                }),
                            });
                        }
                    }
                    _d.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    logFile = typeof ((_c = params.cfg.logging) === null || _c === void 0 ? void 0 : _c.file) === "string" ? params.cfg.logging.file.trim() : "";
                    if (!logFile) return [3 /*break*/, 8];
                    expanded = logFile.startsWith("~") ? expandTilde(logFile, params.env) : logFile;
                    if (!expanded) return [3 /*break*/, 8];
                    logPath = node_path_1.default.resolve(expanded);
                    return [4 /*yield*/, (0, audit_fs_js_1.inspectPathPermissions)(logPath, {
                            env: params.env,
                            platform: params.platform,
                            exec: params.execIcacls,
                        })];
                case 7:
                    logPerms = _d.sent();
                    if (logPerms.ok) {
                        if (logPerms.worldReadable || logPerms.groupReadable) {
                            findings.push({
                                checkId: "fs.log_file.perms_readable",
                                severity: "warn",
                                title: "Log file is readable by others",
                                detail: "".concat((0, audit_fs_js_1.formatPermissionDetail)(logPath, logPerms), "; logs can contain private messages and tool output."),
                                remediation: (0, audit_fs_js_1.formatPermissionRemediation)({
                                    targetPath: logPath,
                                    perms: logPerms,
                                    isDir: false,
                                    posixMode: 384,
                                    env: params.env,
                                }),
                            });
                        }
                    }
                    _d.label = 8;
                case 8: return [2 /*return*/, findings];
            }
        });
    });
}
function listGroupPolicyOpen(cfg) {
    var out = [];
    var channels = cfg.channels;
    if (!channels || typeof channels !== "object") {
        return out;
    }
    for (var _i = 0, _a = Object.entries(channels); _i < _a.length; _i++) {
        var _b = _a[_i], channelId = _b[0], value = _b[1];
        if (!value || typeof value !== "object") {
            continue;
        }
        var section = value;
        if (section.groupPolicy === "open") {
            out.push("channels.".concat(channelId, ".groupPolicy"));
        }
        var accounts = section.accounts;
        if (accounts && typeof accounts === "object") {
            for (var _c = 0, _d = Object.entries(accounts); _c < _d.length; _c++) {
                var _e = _d[_c], accountId = _e[0], accountVal = _e[1];
                if (!accountVal || typeof accountVal !== "object") {
                    continue;
                }
                var acc = accountVal;
                if (acc.groupPolicy === "open") {
                    out.push("channels.".concat(channelId, ".accounts.").concat(accountId, ".groupPolicy"));
                }
            }
        }
    }
    return out;
}
function collectExposureMatrixFindings(cfg) {
    var _a, _b;
    var findings = [];
    var openGroups = listGroupPolicyOpen(cfg);
    if (openGroups.length === 0) {
        return findings;
    }
    var elevatedEnabled = ((_b = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.elevated) === null || _b === void 0 ? void 0 : _b.enabled) !== false;
    if (elevatedEnabled) {
        findings.push({
            checkId: "security.exposure.open_groups_with_elevated",
            severity: "critical",
            title: "Open groupPolicy with elevated tools enabled",
            detail: "Found groupPolicy=\"open\" at:\n".concat(openGroups.map(function (p) { return "- ".concat(p); }).join("\n"), "\n") +
                "With tools.elevated enabled, a prompt injection in those rooms can become a high-impact incident.",
            remediation: "Set groupPolicy=\"allowlist\" and keep elevated allowlists extremely tight.",
        });
    }
    return findings;
}
function readConfigSnapshotForAudit(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, config_js_2.createConfigIO)({
                        env: params.env,
                        configPath: params.configPath,
                    }).readConfigFileSnapshot()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
