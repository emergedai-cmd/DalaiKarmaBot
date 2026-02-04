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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySessionsPatchToStore = applySessionsPatchToStore;
var node_crypto_1 = require("node:crypto");
var defaults_js_1 = require("../agents/defaults.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var group_activation_js_1 = require("../auto-reply/group-activation.js");
var thinking_js_1 = require("../auto-reply/thinking.js");
var session_key_js_1 = require("../routing/session-key.js");
var level_overrides_js_1 = require("../sessions/level-overrides.js");
var model_overrides_js_1 = require("../sessions/model-overrides.js");
var send_policy_js_1 = require("../sessions/send-policy.js");
var session_label_js_1 = require("../sessions/session-label.js");
var index_js_1 = require("./protocol/index.js");
function invalid(message) {
    return { ok: false, error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, message) };
}
function normalizeExecHost(raw) {
    var normalized = raw.trim().toLowerCase();
    if (normalized === "sandbox" || normalized === "gateway" || normalized === "node") {
        return normalized;
    }
    return undefined;
}
function normalizeExecSecurity(raw) {
    var normalized = raw.trim().toLowerCase();
    if (normalized === "deny" || normalized === "allowlist" || normalized === "full") {
        return normalized;
    }
    return undefined;
}
function normalizeExecAsk(raw) {
    var normalized = raw.trim().toLowerCase();
    if (normalized === "off" || normalized === "on-miss" || normalized === "always") {
        return normalized;
    }
    return undefined;
}
function applySessionsPatchToStore(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, store, storeKey, patch, now, existing, next, raw, trimmed, raw, parsed, _i, _a, _b, key, entry, raw, normalized, resolvedDefault, hintProvider, hintModel, raw, parsed, raw, normalized, raw, normalized, raw, normalized, raw, normalized, raw, normalized, raw, normalized, raw, trimmed, raw, resolvedDefault, trimmed, catalog, resolved, isDefault, resolvedDefault, effectiveProvider, effectiveModel, raw, normalized, raw, normalized;
        var _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    cfg = params.cfg, store = params.store, storeKey = params.storeKey, patch = params.patch;
                    now = Date.now();
                    existing = store[storeKey];
                    next = existing
                        ? __assign(__assign({}, existing), { updatedAt: Math.max((_c = existing.updatedAt) !== null && _c !== void 0 ? _c : 0, now) }) : { sessionId: (0, node_crypto_1.randomUUID)(), updatedAt: now };
                    if ("spawnedBy" in patch) {
                        raw = patch.spawnedBy;
                        if (raw === null) {
                            if (existing === null || existing === void 0 ? void 0 : existing.spawnedBy) {
                                return [2 /*return*/, invalid("spawnedBy cannot be cleared once set")];
                            }
                        }
                        else if (raw !== undefined) {
                            trimmed = String(raw).trim();
                            if (!trimmed) {
                                return [2 /*return*/, invalid("invalid spawnedBy: empty")];
                            }
                            if (!(0, session_key_js_1.isSubagentSessionKey)(storeKey)) {
                                return [2 /*return*/, invalid("spawnedBy is only supported for subagent:* sessions")];
                            }
                            if ((existing === null || existing === void 0 ? void 0 : existing.spawnedBy) && existing.spawnedBy !== trimmed) {
                                return [2 /*return*/, invalid("spawnedBy cannot be changed once set")];
                            }
                            next.spawnedBy = trimmed;
                        }
                    }
                    if ("label" in patch) {
                        raw = patch.label;
                        if (raw === null) {
                            delete next.label;
                        }
                        else if (raw !== undefined) {
                            parsed = (0, session_label_js_1.parseSessionLabel)(raw);
                            if (!parsed.ok) {
                                return [2 /*return*/, invalid(parsed.error)];
                            }
                            for (_i = 0, _a = Object.entries(store); _i < _a.length; _i++) {
                                _b = _a[_i], key = _b[0], entry = _b[1];
                                if (key === storeKey) {
                                    continue;
                                }
                                if ((entry === null || entry === void 0 ? void 0 : entry.label) === parsed.label) {
                                    return [2 /*return*/, invalid("label already in use: ".concat(parsed.label))];
                                }
                            }
                            next.label = parsed.label;
                        }
                    }
                    if ("thinkingLevel" in patch) {
                        raw = patch.thinkingLevel;
                        if (raw === null) {
                            delete next.thinkingLevel;
                        }
                        else if (raw !== undefined) {
                            normalized = (0, thinking_js_1.normalizeThinkLevel)(String(raw));
                            if (!normalized) {
                                resolvedDefault = (0, model_selection_js_1.resolveConfiguredModelRef)({
                                    cfg: cfg,
                                    defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                                    defaultModel: defaults_js_1.DEFAULT_MODEL,
                                });
                                hintProvider = ((_d = existing === null || existing === void 0 ? void 0 : existing.providerOverride) === null || _d === void 0 ? void 0 : _d.trim()) || resolvedDefault.provider;
                                hintModel = ((_e = existing === null || existing === void 0 ? void 0 : existing.modelOverride) === null || _e === void 0 ? void 0 : _e.trim()) || resolvedDefault.model;
                                return [2 /*return*/, invalid("invalid thinkingLevel (use ".concat((0, thinking_js_1.formatThinkingLevels)(hintProvider, hintModel, "|"), ")"))];
                            }
                            if (normalized === "off") {
                                delete next.thinkingLevel;
                            }
                            else {
                                next.thinkingLevel = normalized;
                            }
                        }
                    }
                    if ("verboseLevel" in patch) {
                        raw = patch.verboseLevel;
                        parsed = (0, level_overrides_js_1.parseVerboseOverride)(raw);
                        if (!parsed.ok) {
                            return [2 /*return*/, invalid(parsed.error)];
                        }
                        (0, level_overrides_js_1.applyVerboseOverride)(next, parsed.value);
                    }
                    if ("reasoningLevel" in patch) {
                        raw = patch.reasoningLevel;
                        if (raw === null) {
                            delete next.reasoningLevel;
                        }
                        else if (raw !== undefined) {
                            normalized = (0, thinking_js_1.normalizeReasoningLevel)(String(raw));
                            if (!normalized) {
                                return [2 /*return*/, invalid('invalid reasoningLevel (use "on"|"off"|"stream")')];
                            }
                            if (normalized === "off") {
                                delete next.reasoningLevel;
                            }
                            else {
                                next.reasoningLevel = normalized;
                            }
                        }
                    }
                    if ("responseUsage" in patch) {
                        raw = patch.responseUsage;
                        if (raw === null) {
                            delete next.responseUsage;
                        }
                        else if (raw !== undefined) {
                            normalized = (0, thinking_js_1.normalizeUsageDisplay)(String(raw));
                            if (!normalized) {
                                return [2 /*return*/, invalid('invalid responseUsage (use "off"|"tokens"|"full")')];
                            }
                            if (normalized === "off") {
                                delete next.responseUsage;
                            }
                            else {
                                next.responseUsage = normalized;
                            }
                        }
                    }
                    if ("elevatedLevel" in patch) {
                        raw = patch.elevatedLevel;
                        if (raw === null) {
                            delete next.elevatedLevel;
                        }
                        else if (raw !== undefined) {
                            normalized = (0, thinking_js_1.normalizeElevatedLevel)(String(raw));
                            if (!normalized) {
                                return [2 /*return*/, invalid('invalid elevatedLevel (use "on"|"off"|"ask"|"full")')];
                            }
                            // Persist "off" explicitly so patches can override defaults.
                            next.elevatedLevel = normalized;
                        }
                    }
                    if ("execHost" in patch) {
                        raw = patch.execHost;
                        if (raw === null) {
                            delete next.execHost;
                        }
                        else if (raw !== undefined) {
                            normalized = normalizeExecHost(String(raw));
                            if (!normalized) {
                                return [2 /*return*/, invalid('invalid execHost (use "sandbox"|"gateway"|"node")')];
                            }
                            next.execHost = normalized;
                        }
                    }
                    if ("execSecurity" in patch) {
                        raw = patch.execSecurity;
                        if (raw === null) {
                            delete next.execSecurity;
                        }
                        else if (raw !== undefined) {
                            normalized = normalizeExecSecurity(String(raw));
                            if (!normalized) {
                                return [2 /*return*/, invalid('invalid execSecurity (use "deny"|"allowlist"|"full")')];
                            }
                            next.execSecurity = normalized;
                        }
                    }
                    if ("execAsk" in patch) {
                        raw = patch.execAsk;
                        if (raw === null) {
                            delete next.execAsk;
                        }
                        else if (raw !== undefined) {
                            normalized = normalizeExecAsk(String(raw));
                            if (!normalized) {
                                return [2 /*return*/, invalid('invalid execAsk (use "off"|"on-miss"|"always")')];
                            }
                            next.execAsk = normalized;
                        }
                    }
                    if ("execNode" in patch) {
                        raw = patch.execNode;
                        if (raw === null) {
                            delete next.execNode;
                        }
                        else if (raw !== undefined) {
                            trimmed = String(raw).trim();
                            if (!trimmed) {
                                return [2 /*return*/, invalid("invalid execNode: empty")];
                            }
                            next.execNode = trimmed;
                        }
                    }
                    if (!("model" in patch)) return [3 /*break*/, 3];
                    raw = patch.model;
                    resolvedDefault = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    });
                    if (!(raw === null)) return [3 /*break*/, 1];
                    (0, model_overrides_js_1.applyModelOverrideToSessionEntry)({
                        entry: next,
                        selection: {
                            provider: resolvedDefault.provider,
                            model: resolvedDefault.model,
                            isDefault: true,
                        },
                    });
                    return [3 /*break*/, 3];
                case 1:
                    if (!(raw !== undefined)) return [3 /*break*/, 3];
                    trimmed = String(raw).trim();
                    if (!trimmed) {
                        return [2 /*return*/, invalid("invalid model: empty")];
                    }
                    if (!params.loadGatewayModelCatalog) {
                        return [2 /*return*/, {
                                ok: false,
                                error: (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, "model catalog unavailable"),
                            }];
                    }
                    return [4 /*yield*/, params.loadGatewayModelCatalog()];
                case 2:
                    catalog = _h.sent();
                    resolved = (0, model_selection_js_1.resolveAllowedModelRef)({
                        cfg: cfg,
                        catalog: catalog,
                        raw: trimmed,
                        defaultProvider: resolvedDefault.provider,
                        defaultModel: resolvedDefault.model,
                    });
                    if ("error" in resolved) {
                        return [2 /*return*/, invalid(resolved.error)];
                    }
                    isDefault = resolved.ref.provider === resolvedDefault.provider &&
                        resolved.ref.model === resolvedDefault.model;
                    (0, model_overrides_js_1.applyModelOverrideToSessionEntry)({
                        entry: next,
                        selection: {
                            provider: resolved.ref.provider,
                            model: resolved.ref.model,
                            isDefault: isDefault,
                        },
                    });
                    _h.label = 3;
                case 3:
                    if (next.thinkingLevel === "xhigh") {
                        resolvedDefault = (0, model_selection_js_1.resolveConfiguredModelRef)({
                            cfg: cfg,
                            defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                            defaultModel: defaults_js_1.DEFAULT_MODEL,
                        });
                        effectiveProvider = (_f = next.providerOverride) !== null && _f !== void 0 ? _f : resolvedDefault.provider;
                        effectiveModel = (_g = next.modelOverride) !== null && _g !== void 0 ? _g : resolvedDefault.model;
                        if (!(0, thinking_js_1.supportsXHighThinking)(effectiveProvider, effectiveModel)) {
                            if ("thinkingLevel" in patch) {
                                return [2 /*return*/, invalid("thinkingLevel \"xhigh\" is only supported for ".concat((0, thinking_js_1.formatXHighModelHint)()))];
                            }
                            next.thinkingLevel = "high";
                        }
                    }
                    if ("sendPolicy" in patch) {
                        raw = patch.sendPolicy;
                        if (raw === null) {
                            delete next.sendPolicy;
                        }
                        else if (raw !== undefined) {
                            normalized = (0, send_policy_js_1.normalizeSendPolicy)(String(raw));
                            if (!normalized) {
                                return [2 /*return*/, invalid('invalid sendPolicy (use "allow"|"deny")')];
                            }
                            next.sendPolicy = normalized;
                        }
                    }
                    if ("groupActivation" in patch) {
                        raw = patch.groupActivation;
                        if (raw === null) {
                            delete next.groupActivation;
                        }
                        else if (raw !== undefined) {
                            normalized = (0, group_activation_js_1.normalizeGroupActivation)(String(raw));
                            if (!normalized) {
                                return [2 /*return*/, invalid('invalid groupActivation (use "mention"|"always")')];
                            }
                            next.groupActivation = normalized;
                        }
                    }
                    store[storeKey] = next;
                    return [2 /*return*/, { ok: true, entry: next }];
            }
        });
    });
}
