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
exports.runAuthProbes = runAuthProbes;
exports.formatProbeLatency = formatProbeLatency;
exports.groupProbeResults = groupProbeResults;
exports.sortProbeResults = sortProbeResults;
exports.describeProbeSummary = describeProbeSummary;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var agent_paths_js_1 = require("../../agents/agent-paths.js");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var failover_error_js_1 = require("../../agents/failover-error.js");
var model_auth_js_1 = require("../../agents/model-auth.js");
var model_catalog_js_1 = require("../../agents/model-catalog.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var workspace_js_1 = require("../../agents/workspace.js");
var paths_js_1 = require("../../config/sessions/paths.js");
var format_js_1 = require("../status-all/format.js");
var shared_js_1 = require("./shared.js");
var PROBE_PROMPT = "Reply with OK. Do not use tools.";
var toStatus = function (reason) {
    if (!reason) {
        return "unknown";
    }
    if (reason === "auth") {
        return "auth";
    }
    if (reason === "rate_limit") {
        return "rate_limit";
    }
    if (reason === "billing") {
        return "billing";
    }
    if (reason === "timeout") {
        return "timeout";
    }
    if (reason === "format") {
        return "format";
    }
    return "unknown";
};
function buildCandidateMap(modelCandidates) {
    var _a;
    var map = new Map();
    for (var _i = 0, modelCandidates_1 = modelCandidates; _i < modelCandidates_1.length; _i++) {
        var raw = modelCandidates_1[_i];
        var parsed = (0, model_selection_js_1.parseModelRef)(String(raw !== null && raw !== void 0 ? raw : ""), shared_js_1.DEFAULT_PROVIDER);
        if (!parsed) {
            continue;
        }
        var list = (_a = map.get(parsed.provider)) !== null && _a !== void 0 ? _a : [];
        if (!list.includes(parsed.model)) {
            list.push(parsed.model);
        }
        map.set(parsed.provider, list);
    }
    return map;
}
function selectProbeModel(params) {
    var provider = params.provider, candidates = params.candidates, catalog = params.catalog;
    var direct = candidates.get(provider);
    if (direct && direct.length > 0) {
        return { provider: provider, model: direct[0] };
    }
    var fromCatalog = catalog.find(function (entry) { return entry.provider === provider; });
    if (fromCatalog) {
        return { provider: fromCatalog.provider, model: fromCatalog.id };
    }
    return null;
}
function buildProbeTargets(params) {
    var _a, _b;
    var cfg = params.cfg, providers = params.providers, modelCandidates = params.modelCandidates, options = params.options;
    var store = (0, auth_profiles_js_1.ensureAuthProfileStore)();
    var providerFilter = (_a = options.provider) === null || _a === void 0 ? void 0 : _a.trim();
    var providerFilterKey = providerFilter ? (0, model_selection_js_1.normalizeProviderId)(providerFilter) : null;
    var profileFilter = new Set(((_b = options.profileIds) !== null && _b !== void 0 ? _b : []).map(function (id) { return id.trim(); }).filter(Boolean));
    return (0, model_catalog_js_1.loadModelCatalog)({ config: cfg }).then(function (catalog) {
        var candidates = buildCandidateMap(modelCandidates);
        var targets = [];
        var results = [];
        var _loop_1 = function (provider) {
            var providerKey = (0, model_selection_js_1.normalizeProviderId)(provider);
            if (providerFilterKey && providerKey !== providerFilterKey) {
                return "continue";
            }
            var model = selectProbeModel({
                provider: providerKey,
                candidates: candidates,
                catalog: catalog,
            });
            var profileIds = (0, auth_profiles_js_1.listProfilesForProvider)(store, providerKey);
            var explicitOrder = (function () {
                var _a;
                var order = store.order;
                if (order) {
                    for (var _i = 0, _b = Object.entries(order); _i < _b.length; _i++) {
                        var _c = _b[_i], key = _c[0], value = _c[1];
                        if ((0, model_selection_js_1.normalizeProviderId)(key) === providerKey) {
                            return value;
                        }
                    }
                }
                var cfgOrder = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.auth) === null || _a === void 0 ? void 0 : _a.order;
                if (cfgOrder) {
                    for (var _d = 0, _e = Object.entries(cfgOrder); _d < _e.length; _d++) {
                        var _f = _e[_d], key = _f[0], value = _f[1];
                        if ((0, model_selection_js_1.normalizeProviderId)(key) === providerKey) {
                            return value;
                        }
                    }
                }
                return undefined;
            })();
            var allowedProfiles = explicitOrder && explicitOrder.length > 0
                ? new Set((0, auth_profiles_js_1.resolveAuthProfileOrder)({ cfg: cfg, store: store, provider: providerKey }))
                : null;
            var filteredProfiles = profileFilter.size
                ? profileIds.filter(function (id) { return profileFilter.has(id); })
                : profileIds;
            if (filteredProfiles.length > 0) {
                for (var _a = 0, filteredProfiles_1 = filteredProfiles; _a < filteredProfiles_1.length; _a++) {
                    var profileId = filteredProfiles_1[_a];
                    var profile = store.profiles[profileId];
                    var mode_1 = profile === null || profile === void 0 ? void 0 : profile.type;
                    var label_1 = (0, auth_profiles_js_1.resolveAuthProfileDisplayLabel)({ cfg: cfg, store: store, profileId: profileId });
                    if (explicitOrder && !explicitOrder.includes(profileId)) {
                        results.push({
                            provider: providerKey,
                            model: model ? "".concat(model.provider, "/").concat(model.model) : undefined,
                            profileId: profileId,
                            label: label_1,
                            source: "profile",
                            mode: mode_1,
                            status: "unknown",
                            error: "Excluded by auth.order for this provider.",
                        });
                        continue;
                    }
                    if (allowedProfiles && !allowedProfiles.has(profileId)) {
                        results.push({
                            provider: providerKey,
                            model: model ? "".concat(model.provider, "/").concat(model.model) : undefined,
                            profileId: profileId,
                            label: label_1,
                            source: "profile",
                            mode: mode_1,
                            status: "unknown",
                            error: "Auth profile credentials are missing or expired.",
                        });
                        continue;
                    }
                    if (!model) {
                        results.push({
                            provider: providerKey,
                            model: undefined,
                            profileId: profileId,
                            label: label_1,
                            source: "profile",
                            mode: mode_1,
                            status: "no_model",
                            error: "No model available for probe",
                        });
                        continue;
                    }
                    targets.push({
                        provider: providerKey,
                        model: model,
                        profileId: profileId,
                        label: label_1,
                        source: "profile",
                        mode: mode_1,
                    });
                }
                return "continue";
            }
            if (profileFilter.size > 0) {
                return "continue";
            }
            var envKey = (0, model_auth_js_1.resolveEnvApiKey)(providerKey);
            var customKey = (0, model_auth_js_1.getCustomProviderApiKey)(cfg, providerKey);
            if (!envKey && !customKey) {
                return "continue";
            }
            var label = envKey ? "env" : "models.json";
            var source = envKey ? "env" : "models.json";
            var mode = (envKey === null || envKey === void 0 ? void 0 : envKey.source.includes("OAUTH_TOKEN")) ? "oauth" : "api_key";
            if (!model) {
                results.push({
                    provider: providerKey,
                    model: undefined,
                    label: label,
                    source: source,
                    mode: mode,
                    status: "no_model",
                    error: "No model available for probe",
                });
                return "continue";
            }
            targets.push({
                provider: providerKey,
                model: model,
                label: label,
                source: source,
                mode: mode,
            });
        };
        for (var _i = 0, providers_1 = providers; _i < providers_1.length; _i++) {
            var provider = providers_1[_i];
            _loop_1(provider);
        }
        return { targets: targets, results: results };
    });
}
function probeTarget(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, agentId, agentDir, workspaceDir, sessionDir, target, timeoutMs, maxTokens, sessionId, sessionFile, start, err_1, described;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = params.cfg, agentId = params.agentId, agentDir = params.agentDir, workspaceDir = params.workspaceDir, sessionDir = params.sessionDir, target = params.target, timeoutMs = params.timeoutMs, maxTokens = params.maxTokens;
                    if (!target.model) {
                        return [2 /*return*/, {
                                provider: target.provider,
                                model: undefined,
                                profileId: target.profileId,
                                label: target.label,
                                source: target.source,
                                mode: target.mode,
                                status: "no_model",
                                error: "No model available for probe",
                            }];
                    }
                    sessionId = "probe-".concat(target.provider, "-").concat(node_crypto_1.default.randomUUID());
                    sessionFile = (0, paths_js_1.resolveSessionTranscriptPath)(sessionId, agentId);
                    return [4 /*yield*/, promises_1.default.mkdir(sessionDir, { recursive: true })];
                case 1:
                    _b.sent();
                    start = Date.now();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, pi_embedded_js_1.runEmbeddedPiAgent)({
                            sessionId: sessionId,
                            sessionFile: sessionFile,
                            workspaceDir: workspaceDir,
                            agentDir: agentDir,
                            config: cfg,
                            prompt: PROBE_PROMPT,
                            provider: target.model.provider,
                            model: target.model.model,
                            authProfileId: target.profileId,
                            authProfileIdSource: target.profileId ? "user" : undefined,
                            timeoutMs: timeoutMs,
                            runId: "probe-".concat(node_crypto_1.default.randomUUID()),
                            lane: "auth-probe:".concat(target.provider, ":").concat((_a = target.profileId) !== null && _a !== void 0 ? _a : target.source),
                            thinkLevel: "off",
                            reasoningLevel: "off",
                            verboseLevel: "off",
                            streamParams: { maxTokens: maxTokens },
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/, {
                            provider: target.provider,
                            model: "".concat(target.model.provider, "/").concat(target.model.model),
                            profileId: target.profileId,
                            label: target.label,
                            source: target.source,
                            mode: target.mode,
                            status: "ok",
                            latencyMs: Date.now() - start,
                        }];
                case 4:
                    err_1 = _b.sent();
                    described = (0, failover_error_js_1.describeFailoverError)(err_1);
                    return [2 /*return*/, {
                            provider: target.provider,
                            model: "".concat(target.model.provider, "/").concat(target.model.model),
                            profileId: target.profileId,
                            label: target.label,
                            source: target.source,
                            mode: target.mode,
                            status: toStatus(described.reason),
                            error: (0, format_js_1.redactSecrets)(described.message),
                            latencyMs: Date.now() - start,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function runTargetsWithConcurrency(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, targets, timeoutMs, maxTokens, onProgress, concurrency, agentId, agentDir, workspaceDir, sessionDir, completed, results, cursor, worker;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = params.cfg, targets = params.targets, timeoutMs = params.timeoutMs, maxTokens = params.maxTokens, onProgress = params.onProgress;
                    concurrency = Math.max(1, Math.min(targets.length || 1, params.concurrency));
                    agentId = (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
                    agentDir = (0, agent_paths_js_1.resolveOpenClawAgentDir)();
                    workspaceDir = (_a = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId)) !== null && _a !== void 0 ? _a : (0, workspace_js_1.resolveDefaultAgentWorkspaceDir)();
                    sessionDir = (0, paths_js_1.resolveSessionTranscriptsDirForAgent)(agentId);
                    return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
                case 1:
                    _b.sent();
                    completed = 0;
                    results = Array.from({ length: targets.length });
                    cursor = 0;
                    worker = function () { return __awaiter(_this, void 0, void 0, function () {
                        var index, target, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!true) return [3 /*break*/, 2];
                                    index = cursor;
                                    cursor += 1;
                                    if (index >= targets.length) {
                                        return [2 /*return*/];
                                    }
                                    target = targets[index];
                                    onProgress === null || onProgress === void 0 ? void 0 : onProgress({
                                        completed: completed,
                                        total: targets.length,
                                        label: "Probing ".concat(target.provider).concat(target.profileId ? " (".concat(target.label, ")") : ""),
                                    });
                                    return [4 /*yield*/, probeTarget({
                                            cfg: cfg,
                                            agentId: agentId,
                                            agentDir: agentDir,
                                            workspaceDir: workspaceDir,
                                            sessionDir: sessionDir,
                                            target: target,
                                            timeoutMs: timeoutMs,
                                            maxTokens: maxTokens,
                                        })];
                                case 1:
                                    result = _a.sent();
                                    results[index] = result;
                                    completed += 1;
                                    onProgress === null || onProgress === void 0 ? void 0 : onProgress({ completed: completed, total: targets.length });
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, Promise.all(Array.from({ length: concurrency }, function () { return worker(); }))];
                case 2:
                    _b.sent();
                    return [2 /*return*/, results.filter(function (entry) { return Boolean(entry); })];
            }
        });
    });
}
function runAuthProbes(params) {
    return __awaiter(this, void 0, void 0, function () {
        var startedAt, plan, totalTargets, results, _a, finishedAt;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    startedAt = Date.now();
                    return [4 /*yield*/, buildProbeTargets({
                            cfg: params.cfg,
                            providers: params.providers,
                            modelCandidates: params.modelCandidates,
                            options: params.options,
                        })];
                case 1:
                    plan = _c.sent();
                    totalTargets = plan.targets.length;
                    (_b = params.onProgress) === null || _b === void 0 ? void 0 : _b.call(params, { completed: 0, total: totalTargets });
                    if (!totalTargets) return [3 /*break*/, 3];
                    return [4 /*yield*/, runTargetsWithConcurrency({
                            cfg: params.cfg,
                            targets: plan.targets,
                            timeoutMs: params.options.timeoutMs,
                            maxTokens: params.options.maxTokens,
                            concurrency: params.options.concurrency,
                            onProgress: params.onProgress,
                        })];
                case 2:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = [];
                    _c.label = 4;
                case 4:
                    results = _a;
                    finishedAt = Date.now();
                    return [2 /*return*/, {
                            startedAt: startedAt,
                            finishedAt: finishedAt,
                            durationMs: finishedAt - startedAt,
                            totalTargets: totalTargets,
                            options: params.options,
                            results: __spreadArray(__spreadArray([], plan.results, true), results, true),
                        }];
            }
        });
    });
}
function formatProbeLatency(latencyMs) {
    if (!latencyMs && latencyMs !== 0) {
        return "-";
    }
    return (0, shared_js_1.formatMs)(latencyMs);
}
function groupProbeResults(results) {
    var _a;
    var map = new Map();
    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
        var result = results_1[_i];
        var list = (_a = map.get(result.provider)) !== null && _a !== void 0 ? _a : [];
        list.push(result);
        map.set(result.provider, list);
    }
    return map;
}
function sortProbeResults(results) {
    return results.slice().toSorted(function (a, b) {
        var provider = a.provider.localeCompare(b.provider);
        if (provider !== 0) {
            return provider;
        }
        var aLabel = a.label || a.profileId || "";
        var bLabel = b.label || b.profileId || "";
        return aLabel.localeCompare(bLabel);
    });
}
function describeProbeSummary(summary) {
    if (summary.totalTargets === 0) {
        return "No probe targets.";
    }
    return "Probed ".concat(summary.totalTargets, " target").concat(summary.totalTargets === 1 ? "" : "s", " in ").concat((0, shared_js_1.formatMs)(summary.durationMs));
}
