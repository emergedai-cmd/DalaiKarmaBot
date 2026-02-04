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
exports.agentCommand = agentCommand;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var session_override_js_1 = require("../agents/auth-profiles/session-override.js");
var cli_runner_js_1 = require("../agents/cli-runner.js");
var cli_session_js_1 = require("../agents/cli-session.js");
var defaults_js_1 = require("../agents/defaults.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var model_fallback_js_1 = require("../agents/model-fallback.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var pi_embedded_js_1 = require("../agents/pi-embedded.js");
var skills_js_1 = require("../agents/skills.js");
var refresh_js_1 = require("../agents/skills/refresh.js");
var timeout_js_1 = require("../agents/timeout.js");
var workspace_js_1 = require("../agents/workspace.js");
var thinking_js_1 = require("../auto-reply/thinking.js");
var command_format_js_1 = require("../cli/command-format.js");
var deps_js_1 = require("../cli/deps.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var skills_remote_js_1 = require("../infra/skills-remote.js");
var session_key_js_1 = require("../routing/session-key.js");
var runtime_js_1 = require("../runtime.js");
var level_overrides_js_1 = require("../sessions/level-overrides.js");
var model_overrides_js_1 = require("../sessions/model-overrides.js");
var send_policy_js_1 = require("../sessions/send-policy.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var delivery_js_1 = require("./agent/delivery.js");
var run_context_js_1 = require("./agent/run-context.js");
var session_store_js_1 = require("./agent/session-store.js");
var session_js_1 = require("./agent/session.js");
function agentCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime, deps) {
        var body, cfg, agentIdOverrideRaw, agentIdOverride, knownAgents, sessionAgentId_1, agentCfg, sessionAgentId, workspaceDirRaw, agentDir, workspace, workspaceDir, configuredModel, thinkingLevelsHint, thinkOverride, thinkOnce, verboseOverride, timeoutSecondsRaw, timeoutMs, sessionResolution, sessionId, sessionKey, resolvedSessionEntry, sessionStore, storePath, isNewSession, persistedThinking, persistedVerbose, sessionEntry, runId, sendPolicy, resolvedThinkLevel_1, resolvedVerboseLevel_1, needsSkillsSnapshot, skillsSnapshotVersion, skillsSnapshot_1, current, next_1, entry, next_2, agentModelPrimary, cfgForModelSelection, _a, defaultProvider, defaultModel, provider_1, model, hasAllowlist, hasStoredOverride, needsModelCatalog, allowedModelKeys, allowedModelCatalog, modelCatalog, allowed, entry_1, overrideProvider, overrideModel, key, updated, storedProviderOverride, storedModelOverride, candidateProvider, key, authProfileId, entry, store, profile, catalogForThinking, explicitThink, entry_2, sessionFile_1, startedAt, lifecycleEnded_1, result, fallbackProvider, fallbackModel, runContext_1, messageChannel_1, spawnedBy_1, fallbackResult, err_1, payloads;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        if (deps === void 0) { deps = (0, deps_js_1.createDefaultDeps)(); }
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    body = ((_b = opts.message) !== null && _b !== void 0 ? _b : "").trim();
                    if (!body) {
                        throw new Error("Message (--message) is required");
                    }
                    if (!opts.to && !opts.sessionId && !opts.sessionKey && !opts.agentId) {
                        throw new Error("Pass --to <E.164>, --session-id, or --agent to choose a session");
                    }
                    cfg = (0, config_js_1.loadConfig)();
                    agentIdOverrideRaw = (_c = opts.agentId) === null || _c === void 0 ? void 0 : _c.trim();
                    agentIdOverride = agentIdOverrideRaw ? (0, session_key_js_1.normalizeAgentId)(agentIdOverrideRaw) : undefined;
                    if (agentIdOverride) {
                        knownAgents = (0, agent_scope_js_1.listAgentIds)(cfg);
                        if (!knownAgents.includes(agentIdOverride)) {
                            throw new Error("Unknown agent id \"".concat(agentIdOverrideRaw, "\". Use \"").concat((0, command_format_js_1.formatCliCommand)("openclaw agents list"), "\" to see configured agents."));
                        }
                    }
                    if (agentIdOverride && opts.sessionKey) {
                        sessionAgentId_1 = (0, sessions_js_1.resolveAgentIdFromSessionKey)(opts.sessionKey);
                        if (sessionAgentId_1 !== agentIdOverride) {
                            throw new Error("Agent id \"".concat(agentIdOverrideRaw, "\" does not match session key agent \"").concat(sessionAgentId_1, "\"."));
                        }
                    }
                    agentCfg = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults;
                    sessionAgentId = agentIdOverride !== null && agentIdOverride !== void 0 ? agentIdOverride : (0, sessions_js_1.resolveAgentIdFromSessionKey)((_e = opts.sessionKey) === null || _e === void 0 ? void 0 : _e.trim());
                    workspaceDirRaw = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, sessionAgentId);
                    agentDir = (0, agent_scope_js_1.resolveAgentDir)(cfg, sessionAgentId);
                    return [4 /*yield*/, (0, workspace_js_1.ensureAgentWorkspace)({
                            dir: workspaceDirRaw,
                            ensureBootstrapFiles: !(agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.skipBootstrap),
                        })];
                case 1:
                    workspace = _y.sent();
                    workspaceDir = workspace.dir;
                    configuredModel = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    });
                    thinkingLevelsHint = (0, thinking_js_1.formatThinkingLevels)(configuredModel.provider, configuredModel.model);
                    thinkOverride = (0, thinking_js_1.normalizeThinkLevel)(opts.thinking);
                    thinkOnce = (0, thinking_js_1.normalizeThinkLevel)(opts.thinkingOnce);
                    if (opts.thinking && !thinkOverride) {
                        throw new Error("Invalid thinking level. Use one of: ".concat(thinkingLevelsHint, "."));
                    }
                    if (opts.thinkingOnce && !thinkOnce) {
                        throw new Error("Invalid one-shot thinking level. Use one of: ".concat(thinkingLevelsHint, "."));
                    }
                    verboseOverride = (0, thinking_js_1.normalizeVerboseLevel)(opts.verbose);
                    if (opts.verbose && !verboseOverride) {
                        throw new Error('Invalid verbose level. Use "on", "full", or "off".');
                    }
                    timeoutSecondsRaw = opts.timeout !== undefined ? Number.parseInt(String(opts.timeout), 10) : undefined;
                    if (timeoutSecondsRaw !== undefined &&
                        (Number.isNaN(timeoutSecondsRaw) || timeoutSecondsRaw <= 0)) {
                        throw new Error("--timeout must be a positive integer (seconds)");
                    }
                    timeoutMs = (0, timeout_js_1.resolveAgentTimeoutMs)({
                        cfg: cfg,
                        overrideSeconds: timeoutSecondsRaw,
                    });
                    sessionResolution = (0, session_js_1.resolveSession)({
                        cfg: cfg,
                        to: opts.to,
                        sessionId: opts.sessionId,
                        sessionKey: opts.sessionKey,
                        agentId: agentIdOverride,
                    });
                    sessionId = sessionResolution.sessionId, sessionKey = sessionResolution.sessionKey, resolvedSessionEntry = sessionResolution.sessionEntry, sessionStore = sessionResolution.sessionStore, storePath = sessionResolution.storePath, isNewSession = sessionResolution.isNewSession, persistedThinking = sessionResolution.persistedThinking, persistedVerbose = sessionResolution.persistedVerbose;
                    sessionEntry = resolvedSessionEntry;
                    runId = ((_f = opts.runId) === null || _f === void 0 ? void 0 : _f.trim()) || sessionId;
                    _y.label = 2;
                case 2:
                    _y.trys.push([2, , 25, 26]);
                    if (opts.deliver === true) {
                        sendPolicy = (0, send_policy_js_1.resolveSendPolicy)({
                            cfg: cfg,
                            entry: sessionEntry,
                            sessionKey: sessionKey,
                            channel: sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.channel,
                            chatType: sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.chatType,
                        });
                        if (sendPolicy === "deny") {
                            throw new Error("send blocked by session policy");
                        }
                    }
                    resolvedThinkLevel_1 = (_h = (_g = thinkOnce !== null && thinkOnce !== void 0 ? thinkOnce : thinkOverride) !== null && _g !== void 0 ? _g : persistedThinking) !== null && _h !== void 0 ? _h : agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.thinkingDefault;
                    resolvedVerboseLevel_1 = (_j = verboseOverride !== null && verboseOverride !== void 0 ? verboseOverride : persistedVerbose) !== null && _j !== void 0 ? _j : agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.verboseDefault;
                    if (sessionKey) {
                        (0, agent_events_js_1.registerAgentRunContext)(runId, {
                            sessionKey: sessionKey,
                            verboseLevel: resolvedVerboseLevel_1,
                        });
                    }
                    needsSkillsSnapshot = isNewSession || !(sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.skillsSnapshot);
                    skillsSnapshotVersion = (0, refresh_js_1.getSkillsSnapshotVersion)(workspaceDir);
                    skillsSnapshot_1 = needsSkillsSnapshot
                        ? (0, skills_js_1.buildWorkspaceSkillSnapshot)(workspaceDir, {
                            config: cfg,
                            eligibility: { remote: (0, skills_remote_js_1.getRemoteSkillEligibility)() },
                            snapshotVersion: skillsSnapshotVersion,
                        })
                        : sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.skillsSnapshot;
                    if (!(skillsSnapshot_1 && sessionStore && sessionKey && needsSkillsSnapshot)) return [3 /*break*/, 4];
                    current = sessionEntry !== null && sessionEntry !== void 0 ? sessionEntry : {
                        sessionId: sessionId,
                        updatedAt: Date.now(),
                    };
                    next_1 = __assign(__assign({}, current), { sessionId: sessionId, updatedAt: Date.now(), skillsSnapshot: skillsSnapshot_1 });
                    sessionStore[sessionKey] = next_1;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            store[sessionKey] = next_1;
                        })];
                case 3:
                    _y.sent();
                    sessionEntry = next_1;
                    _y.label = 4;
                case 4:
                    if (!(sessionStore && sessionKey)) return [3 /*break*/, 6];
                    entry = (_l = (_k = sessionStore[sessionKey]) !== null && _k !== void 0 ? _k : sessionEntry) !== null && _l !== void 0 ? _l : { sessionId: sessionId, updatedAt: Date.now() };
                    next_2 = __assign(__assign({}, entry), { sessionId: sessionId, updatedAt: Date.now() });
                    if (thinkOverride) {
                        if (thinkOverride === "off") {
                            delete next_2.thinkingLevel;
                        }
                        else {
                            next_2.thinkingLevel = thinkOverride;
                        }
                    }
                    (0, level_overrides_js_1.applyVerboseOverride)(next_2, verboseOverride);
                    sessionStore[sessionKey] = next_2;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            store[sessionKey] = next_2;
                        })];
                case 5:
                    _y.sent();
                    _y.label = 6;
                case 6:
                    agentModelPrimary = (0, agent_scope_js_1.resolveAgentModelPrimary)(cfg, sessionAgentId);
                    cfgForModelSelection = agentModelPrimary
                        ? __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { defaults: __assign(__assign({}, (_m = cfg.agents) === null || _m === void 0 ? void 0 : _m.defaults), { model: __assign(__assign({}, (typeof ((_p = (_o = cfg.agents) === null || _o === void 0 ? void 0 : _o.defaults) === null || _p === void 0 ? void 0 : _p.model) === "object"
                                        ? cfg.agents.defaults.model
                                        : undefined)), { primary: agentModelPrimary }) }) }) }) : cfg;
                    _a = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: cfgForModelSelection,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    }), defaultProvider = _a.provider, defaultModel = _a.model;
                    provider_1 = defaultProvider;
                    model = defaultModel;
                    hasAllowlist = (agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.models) && Object.keys(agentCfg.models).length > 0;
                    hasStoredOverride = Boolean((sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.modelOverride) || (sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.providerOverride));
                    needsModelCatalog = hasAllowlist || hasStoredOverride;
                    allowedModelKeys = new Set();
                    allowedModelCatalog = [];
                    modelCatalog = null;
                    if (!needsModelCatalog) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
                case 7:
                    modelCatalog = _y.sent();
                    allowed = (0, model_selection_js_1.buildAllowedModelSet)({
                        cfg: cfg,
                        catalog: modelCatalog,
                        defaultProvider: defaultProvider,
                        defaultModel: defaultModel,
                    });
                    allowedModelKeys = allowed.allowedKeys;
                    allowedModelCatalog = allowed.allowedCatalog;
                    _y.label = 8;
                case 8:
                    if (!(sessionEntry && sessionStore && sessionKey && hasStoredOverride)) return [3 /*break*/, 10];
                    entry_1 = sessionEntry;
                    overrideProvider = ((_q = sessionEntry.providerOverride) === null || _q === void 0 ? void 0 : _q.trim()) || defaultProvider;
                    overrideModel = (_r = sessionEntry.modelOverride) === null || _r === void 0 ? void 0 : _r.trim();
                    if (!overrideModel) return [3 /*break*/, 10];
                    key = (0, model_selection_js_1.modelKey)(overrideProvider, overrideModel);
                    if (!(!(0, model_selection_js_1.isCliProvider)(overrideProvider, cfg) &&
                        allowedModelKeys.size > 0 &&
                        !allowedModelKeys.has(key))) return [3 /*break*/, 10];
                    updated = (0, model_overrides_js_1.applyModelOverrideToSessionEntry)({
                        entry: entry_1,
                        selection: { provider: defaultProvider, model: defaultModel, isDefault: true },
                    }).updated;
                    if (!updated) return [3 /*break*/, 10];
                    sessionStore[sessionKey] = entry_1;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            store[sessionKey] = entry_1;
                        })];
                case 9:
                    _y.sent();
                    _y.label = 10;
                case 10:
                    storedProviderOverride = (_s = sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.providerOverride) === null || _s === void 0 ? void 0 : _s.trim();
                    storedModelOverride = (_t = sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.modelOverride) === null || _t === void 0 ? void 0 : _t.trim();
                    if (storedModelOverride) {
                        candidateProvider = storedProviderOverride || defaultProvider;
                        key = (0, model_selection_js_1.modelKey)(candidateProvider, storedModelOverride);
                        if ((0, model_selection_js_1.isCliProvider)(candidateProvider, cfg) ||
                            allowedModelKeys.size === 0 ||
                            allowedModelKeys.has(key)) {
                            provider_1 = candidateProvider;
                            model = storedModelOverride;
                        }
                    }
                    if (!sessionEntry) return [3 /*break*/, 12];
                    authProfileId = sessionEntry.authProfileOverride;
                    if (!authProfileId) return [3 /*break*/, 12];
                    entry = sessionEntry;
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)();
                    profile = store.profiles[authProfileId];
                    if (!(!profile || profile.provider !== provider_1)) return [3 /*break*/, 12];
                    if (!(sessionStore && sessionKey)) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, session_override_js_1.clearSessionAuthProfileOverride)({
                            sessionEntry: entry,
                            sessionStore: sessionStore,
                            sessionKey: sessionKey,
                            storePath: storePath,
                        })];
                case 11:
                    _y.sent();
                    _y.label = 12;
                case 12:
                    if (!!resolvedThinkLevel_1) return [3 /*break*/, 15];
                    catalogForThinking = modelCatalog !== null && modelCatalog !== void 0 ? modelCatalog : allowedModelCatalog;
                    if (!(!catalogForThinking || catalogForThinking.length === 0)) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
                case 13:
                    modelCatalog = _y.sent();
                    catalogForThinking = modelCatalog;
                    _y.label = 14;
                case 14:
                    resolvedThinkLevel_1 = (0, model_selection_js_1.resolveThinkingDefault)({
                        cfg: cfg,
                        provider: provider_1,
                        model: model,
                        catalog: catalogForThinking,
                    });
                    _y.label = 15;
                case 15:
                    if (!(resolvedThinkLevel_1 === "xhigh" && !(0, thinking_js_1.supportsXHighThinking)(provider_1, model))) return [3 /*break*/, 17];
                    explicitThink = Boolean(thinkOnce || thinkOverride);
                    if (explicitThink) {
                        throw new Error("Thinking level \"xhigh\" is only supported for ".concat((0, thinking_js_1.formatXHighModelHint)(), "."));
                    }
                    resolvedThinkLevel_1 = "high";
                    if (!(sessionEntry && sessionStore && sessionKey && sessionEntry.thinkingLevel === "xhigh")) return [3 /*break*/, 17];
                    entry_2 = sessionEntry;
                    entry_2.thinkingLevel = "high";
                    entry_2.updatedAt = Date.now();
                    sessionStore[sessionKey] = entry_2;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
                            store[sessionKey] = entry_2;
                        })];
                case 16:
                    _y.sent();
                    _y.label = 17;
                case 17:
                    sessionFile_1 = (0, sessions_js_1.resolveSessionFilePath)(sessionId, sessionEntry, {
                        agentId: sessionAgentId,
                    });
                    startedAt = Date.now();
                    lifecycleEnded_1 = false;
                    result = void 0;
                    fallbackProvider = provider_1;
                    fallbackModel = model;
                    _y.label = 18;
                case 18:
                    _y.trys.push([18, 20, , 21]);
                    runContext_1 = (0, run_context_js_1.resolveAgentRunContext)(opts);
                    messageChannel_1 = (0, message_channel_js_1.resolveMessageChannel)(runContext_1.messageChannel, (_u = opts.replyChannel) !== null && _u !== void 0 ? _u : opts.channel);
                    spawnedBy_1 = (_v = opts.spawnedBy) !== null && _v !== void 0 ? _v : sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.spawnedBy;
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfg,
                            provider: provider_1,
                            model: model,
                            agentDir: agentDir,
                            fallbacksOverride: (0, agent_scope_js_1.resolveAgentModelFallbacksOverride)(cfg, sessionAgentId),
                            run: function (providerOverride, modelOverride) {
                                var _a;
                                if ((0, model_selection_js_1.isCliProvider)(providerOverride, cfg)) {
                                    var cliSessionId = (0, cli_session_js_1.getCliSessionId)(sessionEntry, providerOverride);
                                    return (0, cli_runner_js_1.runCliAgent)({
                                        sessionId: sessionId,
                                        sessionKey: sessionKey,
                                        sessionFile: sessionFile_1,
                                        workspaceDir: workspaceDir,
                                        config: cfg,
                                        prompt: body,
                                        provider: providerOverride,
                                        model: modelOverride,
                                        thinkLevel: resolvedThinkLevel_1,
                                        timeoutMs: timeoutMs,
                                        runId: runId,
                                        extraSystemPrompt: opts.extraSystemPrompt,
                                        cliSessionId: cliSessionId,
                                        images: opts.images,
                                        streamParams: opts.streamParams,
                                    });
                                }
                                var authProfileId = providerOverride === provider_1 ? sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.authProfileOverride : undefined;
                                return (0, pi_embedded_js_1.runEmbeddedPiAgent)({
                                    sessionId: sessionId,
                                    sessionKey: sessionKey,
                                    messageChannel: messageChannel_1,
                                    agentAccountId: runContext_1.accountId,
                                    messageTo: (_a = opts.replyTo) !== null && _a !== void 0 ? _a : opts.to,
                                    messageThreadId: opts.threadId,
                                    groupId: runContext_1.groupId,
                                    groupChannel: runContext_1.groupChannel,
                                    groupSpace: runContext_1.groupSpace,
                                    spawnedBy: spawnedBy_1,
                                    currentChannelId: runContext_1.currentChannelId,
                                    currentThreadTs: runContext_1.currentThreadTs,
                                    replyToMode: runContext_1.replyToMode,
                                    hasRepliedRef: runContext_1.hasRepliedRef,
                                    sessionFile: sessionFile_1,
                                    workspaceDir: workspaceDir,
                                    config: cfg,
                                    skillsSnapshot: skillsSnapshot_1,
                                    prompt: body,
                                    images: opts.images,
                                    clientTools: opts.clientTools,
                                    provider: providerOverride,
                                    model: modelOverride,
                                    authProfileId: authProfileId,
                                    authProfileIdSource: authProfileId
                                        ? sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.authProfileOverrideSource
                                        : undefined,
                                    thinkLevel: resolvedThinkLevel_1,
                                    verboseLevel: resolvedVerboseLevel_1,
                                    timeoutMs: timeoutMs,
                                    runId: runId,
                                    lane: opts.lane,
                                    abortSignal: opts.abortSignal,
                                    extraSystemPrompt: opts.extraSystemPrompt,
                                    streamParams: opts.streamParams,
                                    agentDir: agentDir,
                                    onAgentEvent: function (evt) {
                                        var _a;
                                        // Track lifecycle end for fallback emission below.
                                        if (evt.stream === "lifecycle" &&
                                            typeof ((_a = evt.data) === null || _a === void 0 ? void 0 : _a.phase) === "string" &&
                                            (evt.data.phase === "end" || evt.data.phase === "error")) {
                                            lifecycleEnded_1 = true;
                                        }
                                    },
                                });
                            },
                        })];
                case 19:
                    fallbackResult = _y.sent();
                    result = fallbackResult.result;
                    fallbackProvider = fallbackResult.provider;
                    fallbackModel = fallbackResult.model;
                    if (!lifecycleEnded_1) {
                        (0, agent_events_js_1.emitAgentEvent)({
                            runId: runId,
                            stream: "lifecycle",
                            data: {
                                phase: "end",
                                startedAt: startedAt,
                                endedAt: Date.now(),
                                aborted: (_w = result.meta.aborted) !== null && _w !== void 0 ? _w : false,
                            },
                        });
                    }
                    return [3 /*break*/, 21];
                case 20:
                    err_1 = _y.sent();
                    if (!lifecycleEnded_1) {
                        (0, agent_events_js_1.emitAgentEvent)({
                            runId: runId,
                            stream: "lifecycle",
                            data: {
                                phase: "error",
                                startedAt: startedAt,
                                endedAt: Date.now(),
                                error: String(err_1),
                            },
                        });
                    }
                    throw err_1;
                case 21:
                    if (!(sessionStore && sessionKey)) return [3 /*break*/, 23];
                    return [4 /*yield*/, (0, session_store_js_1.updateSessionStoreAfterAgentRun)({
                            cfg: cfg,
                            contextTokensOverride: agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.contextTokens,
                            sessionId: sessionId,
                            sessionKey: sessionKey,
                            storePath: storePath,
                            sessionStore: sessionStore,
                            defaultProvider: provider_1,
                            defaultModel: model,
                            fallbackProvider: fallbackProvider,
                            fallbackModel: fallbackModel,
                            result: result,
                        })];
                case 22:
                    _y.sent();
                    _y.label = 23;
                case 23:
                    payloads = (_x = result.payloads) !== null && _x !== void 0 ? _x : [];
                    return [4 /*yield*/, (0, delivery_js_1.deliverAgentCommandResult)({
                            cfg: cfg,
                            deps: deps,
                            runtime: runtime,
                            opts: opts,
                            sessionEntry: sessionEntry,
                            result: result,
                            payloads: payloads,
                        })];
                case 24: return [2 /*return*/, _y.sent()];
                case 25:
                    (0, agent_events_js_1.clearAgentRunContext)(runId);
                    return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    });
}
