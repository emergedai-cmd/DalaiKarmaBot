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
exports.DEFAULT_PROVIDER = exports.DEFAULT_MODEL = exports.modelKey = exports.formatMs = exports.formatTokenK = exports.ensureFlagCompatibility = void 0;
exports.updateConfig = updateConfig;
exports.resolveModelTarget = resolveModelTarget;
exports.buildAllowlistSet = buildAllowlistSet;
exports.normalizeAlias = normalizeAlias;
exports.resolveKnownAgentId = resolveKnownAgentId;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var defaults_js_1 = require("../../agents/defaults.js");
Object.defineProperty(exports, "DEFAULT_MODEL", { enumerable: true, get: function () { return defaults_js_1.DEFAULT_MODEL; } });
Object.defineProperty(exports, "DEFAULT_PROVIDER", { enumerable: true, get: function () { return defaults_js_1.DEFAULT_PROVIDER; } });
var model_selection_js_1 = require("../../agents/model-selection.js");
Object.defineProperty(exports, "modelKey", { enumerable: true, get: function () { return model_selection_js_1.modelKey; } });
var command_format_js_1 = require("../../cli/command-format.js");
var config_js_1 = require("../../config/config.js");
var session_key_js_1 = require("../../routing/session-key.js");
var ensureFlagCompatibility = function (opts) {
    if (opts.json && opts.plain) {
        throw new Error("Choose either --json or --plain, not both.");
    }
};
exports.ensureFlagCompatibility = ensureFlagCompatibility;
var formatTokenK = function (value) {
    if (!value || !Number.isFinite(value)) {
        return "-";
    }
    if (value < 1024) {
        return "".concat(Math.round(value));
    }
    return "".concat(Math.round(value / 1024), "k");
};
exports.formatTokenK = formatTokenK;
var formatMs = function (value) {
    if (value === null || value === undefined) {
        return "-";
    }
    if (!Number.isFinite(value)) {
        return "-";
    }
    if (value < 1000) {
        return "".concat(Math.round(value), "ms");
    }
    return "".concat(Math.round(value / 100) / 10, "s");
};
exports.formatMs = formatMs;
function updateConfig(mutator) {
    return __awaiter(this, void 0, void 0, function () {
        var snapshot, issues, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _a.sent();
                    if (!snapshot.valid) {
                        issues = snapshot.issues.map(function (issue) { return "- ".concat(issue.path, ": ").concat(issue.message); }).join("\n");
                        throw new Error("Invalid config at ".concat(snapshot.path, "\n").concat(issues));
                    }
                    next = mutator(snapshot.config);
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, next];
            }
        });
    });
}
function resolveModelTarget(params) {
    var aliasIndex = (0, model_selection_js_1.buildModelAliasIndex)({
        cfg: params.cfg,
        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
    });
    var resolved = (0, model_selection_js_1.resolveModelRefFromString)({
        raw: params.raw,
        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
        aliasIndex: aliasIndex,
    });
    if (!resolved) {
        throw new Error("Invalid model reference: ".concat(params.raw));
    }
    return resolved.ref;
}
function buildAllowlistSet(cfg) {
    var _a, _b, _c;
    var allowed = new Set();
    var models = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.models) !== null && _c !== void 0 ? _c : {};
    for (var _i = 0, _d = Object.keys(models); _i < _d.length; _i++) {
        var raw = _d[_i];
        var parsed = (0, model_selection_js_1.parseModelRef)(String(raw !== null && raw !== void 0 ? raw : ""), defaults_js_1.DEFAULT_PROVIDER);
        if (!parsed) {
            continue;
        }
        allowed.add((0, model_selection_js_1.modelKey)(parsed.provider, parsed.model));
    }
    return allowed;
}
function normalizeAlias(alias) {
    var trimmed = alias.trim();
    if (!trimmed) {
        throw new Error("Alias cannot be empty.");
    }
    if (!/^[A-Za-z0-9_.:-]+$/.test(trimmed)) {
        throw new Error("Alias must use letters, numbers, dots, underscores, colons, or dashes.");
    }
    return trimmed;
}
function resolveKnownAgentId(params) {
    var _a;
    var raw = (_a = params.rawAgentId) === null || _a === void 0 ? void 0 : _a.trim();
    if (!raw) {
        return undefined;
    }
    var agentId = (0, session_key_js_1.normalizeAgentId)(raw);
    var knownAgents = (0, agent_scope_js_1.listAgentIds)(params.cfg);
    if (!knownAgents.includes(agentId)) {
        throw new Error("Unknown agent id \"".concat(raw, "\". Use \"").concat((0, command_format_js_1.formatCliCommand)("openclaw agents list"), "\" to see configured agents."));
    }
    return agentId;
}
/**
 * Model key format: "provider/model"
 *
 * The model key is displayed in `/model status` and used to reference models.
 * When using `/model <key>`, use the exact format shown (e.g., "openrouter/moonshotai/kimi-k2").
 *
 * For providers with hierarchical model IDs (e.g., OpenRouter), the model ID may include
 * sub-providers (e.g., "moonshotai/kimi-k2"), resulting in a key like "openrouter/moonshotai/kimi-k2".
 */
