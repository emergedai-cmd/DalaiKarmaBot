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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCronIsolatedAgentTurn = runCronIsolatedAgentTurn;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var cli_runner_js_1 = require("../../agents/cli-runner.js");
var cli_session_js_1 = require("../../agents/cli-session.js");
var context_js_1 = require("../../agents/context.js");
var date_time_js_1 = require("../../agents/date-time.js");
var defaults_js_1 = require("../../agents/defaults.js");
var model_catalog_js_1 = require("../../agents/model-catalog.js");
var model_fallback_js_1 = require("../../agents/model-fallback.js");
var model_selection_js_1 = require("../../agents/model-selection.js");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var skills_js_1 = require("../../agents/skills.js");
var refresh_js_1 = require("../../agents/skills/refresh.js");
var timeout_js_1 = require("../../agents/timeout.js");
var usage_js_1 = require("../../agents/usage.js");
var workspace_js_1 = require("../../agents/workspace.js");
var thinking_js_1 = require("../../auto-reply/thinking.js");
var outbound_send_deps_js_1 = require("../../cli/outbound-send-deps.js");
var sessions_js_1 = require("../../config/sessions.js");
var agent_events_js_1 = require("../../infra/agent-events.js");
var deliver_js_1 = require("../../infra/outbound/deliver.js");
var skills_remote_js_1 = require("../../infra/skills-remote.js");
var logger_js_1 = require("../../logger.js");
var session_key_js_1 = require("../../routing/session-key.js");
var external_content_js_1 = require("../../security/external-content.js");
var delivery_target_js_1 = require("./delivery-target.js");
var helpers_js_1 = require("./helpers.js");
var session_js_1 = require("./session.js");
function matchesMessagingToolDeliveryTarget(target, delivery) {
    var _a;
    if (!delivery.to || !target.to) {
        return false;
    }
    var channel = delivery.channel.trim().toLowerCase();
    var provider = (_a = target.provider) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
    if (provider && provider !== "message" && provider !== channel) {
        return false;
    }
    if (target.accountId && delivery.accountId && target.accountId !== delivery.accountId) {
        return false;
    }
    return target.to === delivery.to;
}
function runCronIsolatedAgentTurn(params) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultAgentId, requestedAgentId, normalizedRequested, agentConfigOverride, _a, overrideModel, agentOverrideRest, agentId, agentCfg, cfgWithAgentDefaults, baseSessionKey, agentSessionKey, workspaceDirRaw, agentDir, workspace, workspaceDir, resolvedDefault, provider, model, catalog, loadCatalog, isGmailHook, hooksGmailModelRef, status_1, _b, modelOverrideRaw, resolvedOverride, _c, now, cronSession, hooksGmailThinking, thinkOverride, jobThink, thinkLevel, _d, timeoutMs, agentPayload, deliveryMode, hasExplicitTarget, deliveryRequested, bestEffortDeliver, resolvedDelivery, userTimezone, userTimeFormat, formattedTime, timeLine, base, isExternalHook, allowUnsafeExternalContent, shouldWrapExternal, commandBody, suspiciousPatterns, hookType, safeContent, existingSnapshot, skillsSnapshotVersion, needsSkillsSnapshot, skillsSnapshot, runResult, fallbackProvider, fallbackModel, sessionFile_1, resolvedVerboseLevel_1, messageChannel_1, fallbackResult, err_1, payloads, usage, modelUsed, providerUsed, contextTokens, cliSessionId, input, output, promptTokens, firstText, summary, outputText, ackMaxChars, skipHeartbeatDelivery, skipMessagingToolDelivery, reason, err_2;
        var _e, _f, _g;
        var _this = this;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21;
        return __generator(this, function (_22) {
            switch (_22.label) {
                case 0:
                    defaultAgentId = (0, agent_scope_js_1.resolveDefaultAgentId)(params.cfg);
                    requestedAgentId = typeof params.agentId === "string" && params.agentId.trim()
                        ? params.agentId
                        : typeof params.job.agentId === "string" && params.job.agentId.trim()
                            ? params.job.agentId
                            : undefined;
                    normalizedRequested = requestedAgentId ? (0, session_key_js_1.normalizeAgentId)(requestedAgentId) : undefined;
                    agentConfigOverride = normalizedRequested
                        ? (0, agent_scope_js_1.resolveAgentConfig)(params.cfg, normalizedRequested)
                        : undefined;
                    _a = agentConfigOverride !== null && agentConfigOverride !== void 0 ? agentConfigOverride : {}, overrideModel = _a.model, agentOverrideRest = __rest(_a, ["model"]);
                    agentId = agentConfigOverride ? (normalizedRequested !== null && normalizedRequested !== void 0 ? normalizedRequested : defaultAgentId) : defaultAgentId;
                    agentCfg = Object.assign({}, (_h = params.cfg.agents) === null || _h === void 0 ? void 0 : _h.defaults, agentOverrideRest);
                    if (typeof overrideModel === "string") {
                        agentCfg.model = { primary: overrideModel };
                    }
                    else if (overrideModel) {
                        agentCfg.model = overrideModel;
                    }
                    cfgWithAgentDefaults = __assign(__assign({}, params.cfg), { agents: Object.assign({}, params.cfg.agents, { defaults: agentCfg }) });
                    baseSessionKey = (((_j = params.sessionKey) === null || _j === void 0 ? void 0 : _j.trim()) || "cron:".concat(params.job.id)).trim();
                    agentSessionKey = (0, session_key_js_1.buildAgentMainSessionKey)({
                        agentId: agentId,
                        mainKey: baseSessionKey,
                    });
                    workspaceDirRaw = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(params.cfg, agentId);
                    agentDir = (0, agent_scope_js_1.resolveAgentDir)(params.cfg, agentId);
                    return [4 /*yield*/, (0, workspace_js_1.ensureAgentWorkspace)({
                            dir: workspaceDirRaw,
                            ensureBootstrapFiles: !(agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.skipBootstrap),
                        })];
                case 1:
                    workspace = _22.sent();
                    workspaceDir = workspace.dir;
                    resolvedDefault = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: cfgWithAgentDefaults,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    });
                    provider = resolvedDefault.provider;
                    model = resolvedDefault.model;
                    loadCatalog = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!catalog) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfgWithAgentDefaults })];
                                case 1:
                                    catalog = _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/, catalog];
                            }
                        });
                    }); };
                    isGmailHook = baseSessionKey.startsWith("hook:gmail:");
                    hooksGmailModelRef = isGmailHook
                        ? (0, model_selection_js_1.resolveHooksGmailModel)({
                            cfg: params.cfg,
                            defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        })
                        : null;
                    if (!hooksGmailModelRef) return [3 /*break*/, 3];
                    _b = model_selection_js_1.getModelRefStatus;
                    _e = {
                        cfg: params.cfg
                    };
                    return [4 /*yield*/, loadCatalog()];
                case 2:
                    status_1 = _b.apply(void 0, [(_e.catalog = _22.sent(),
                            _e.ref = hooksGmailModelRef,
                            _e.defaultProvider = resolvedDefault.provider,
                            _e.defaultModel = resolvedDefault.model,
                            _e)]);
                    if (status_1.allowed) {
                        provider = hooksGmailModelRef.provider;
                        model = hooksGmailModelRef.model;
                    }
                    _22.label = 3;
                case 3:
                    modelOverrideRaw = params.job.payload.kind === "agentTurn" ? params.job.payload.model : undefined;
                    if (!(modelOverrideRaw !== undefined)) return [3 /*break*/, 5];
                    if (typeof modelOverrideRaw !== "string") {
                        return [2 /*return*/, { status: "error", error: "invalid model: expected string" }];
                    }
                    _c = model_selection_js_1.resolveAllowedModelRef;
                    _f = {
                        cfg: cfgWithAgentDefaults
                    };
                    return [4 /*yield*/, loadCatalog()];
                case 4:
                    resolvedOverride = _c.apply(void 0, [(_f.catalog = _22.sent(),
                            _f.raw = modelOverrideRaw,
                            _f.defaultProvider = resolvedDefault.provider,
                            _f.defaultModel = resolvedDefault.model,
                            _f)]);
                    if ("error" in resolvedOverride) {
                        return [2 /*return*/, { status: "error", error: resolvedOverride.error }];
                    }
                    provider = resolvedOverride.ref.provider;
                    model = resolvedOverride.ref.model;
                    _22.label = 5;
                case 5:
                    now = Date.now();
                    cronSession = (0, session_js_1.resolveCronSession)({
                        cfg: params.cfg,
                        sessionKey: agentSessionKey,
                        agentId: agentId,
                        nowMs: now,
                    });
                    hooksGmailThinking = isGmailHook
                        ? (0, thinking_js_1.normalizeThinkLevel)((_l = (_k = params.cfg.hooks) === null || _k === void 0 ? void 0 : _k.gmail) === null || _l === void 0 ? void 0 : _l.thinking)
                        : undefined;
                    thinkOverride = (0, thinking_js_1.normalizeThinkLevel)(agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.thinkingDefault);
                    jobThink = (0, thinking_js_1.normalizeThinkLevel)((_m = (params.job.payload.kind === "agentTurn" ? params.job.payload.thinking : undefined)) !== null && _m !== void 0 ? _m : undefined);
                    thinkLevel = (_o = jobThink !== null && jobThink !== void 0 ? jobThink : hooksGmailThinking) !== null && _o !== void 0 ? _o : thinkOverride;
                    if (!!thinkLevel) return [3 /*break*/, 7];
                    _d = model_selection_js_1.resolveThinkingDefault;
                    _g = {
                        cfg: cfgWithAgentDefaults,
                        provider: provider,
                        model: model
                    };
                    return [4 /*yield*/, loadCatalog()];
                case 6:
                    thinkLevel = _d.apply(void 0, [(_g.catalog = _22.sent(),
                            _g)]);
                    _22.label = 7;
                case 7:
                    if (thinkLevel === "xhigh" && !(0, thinking_js_1.supportsXHighThinking)(provider, model)) {
                        throw new Error("Thinking level \"xhigh\" is only supported for ".concat((0, thinking_js_1.formatXHighModelHint)(), "."));
                    }
                    timeoutMs = (0, timeout_js_1.resolveAgentTimeoutMs)({
                        cfg: cfgWithAgentDefaults,
                        overrideSeconds: params.job.payload.kind === "agentTurn" ? params.job.payload.timeoutSeconds : undefined,
                    });
                    agentPayload = params.job.payload.kind === "agentTurn" ? params.job.payload : null;
                    deliveryMode = (agentPayload === null || agentPayload === void 0 ? void 0 : agentPayload.deliver) === true ? "explicit" : (agentPayload === null || agentPayload === void 0 ? void 0 : agentPayload.deliver) === false ? "off" : "auto";
                    hasExplicitTarget = Boolean((agentPayload === null || agentPayload === void 0 ? void 0 : agentPayload.to) && agentPayload.to.trim());
                    deliveryRequested = deliveryMode === "explicit" || (deliveryMode === "auto" && hasExplicitTarget);
                    bestEffortDeliver = (agentPayload === null || agentPayload === void 0 ? void 0 : agentPayload.bestEffortDeliver) === true;
                    return [4 /*yield*/, (0, delivery_target_js_1.resolveDeliveryTarget)(cfgWithAgentDefaults, agentId, {
                            channel: (_p = agentPayload === null || agentPayload === void 0 ? void 0 : agentPayload.channel) !== null && _p !== void 0 ? _p : "last",
                            to: agentPayload === null || agentPayload === void 0 ? void 0 : agentPayload.to,
                        })];
                case 8:
                    resolvedDelivery = _22.sent();
                    userTimezone = (0, date_time_js_1.resolveUserTimezone)((_r = (_q = params.cfg.agents) === null || _q === void 0 ? void 0 : _q.defaults) === null || _r === void 0 ? void 0 : _r.userTimezone);
                    userTimeFormat = (0, date_time_js_1.resolveUserTimeFormat)((_t = (_s = params.cfg.agents) === null || _s === void 0 ? void 0 : _s.defaults) === null || _t === void 0 ? void 0 : _t.timeFormat);
                    formattedTime = (_u = (0, date_time_js_1.formatUserTime)(new Date(now), userTimezone, userTimeFormat)) !== null && _u !== void 0 ? _u : new Date(now).toISOString();
                    timeLine = "Current time: ".concat(formattedTime, " (").concat(userTimezone, ")");
                    base = "[cron:".concat(params.job.id, " ").concat(params.job.name, "] ").concat(params.message).trim();
                    isExternalHook = (0, external_content_js_1.isExternalHookSession)(baseSessionKey);
                    allowUnsafeExternalContent = (agentPayload === null || agentPayload === void 0 ? void 0 : agentPayload.allowUnsafeExternalContent) === true ||
                        (isGmailHook && ((_w = (_v = params.cfg.hooks) === null || _v === void 0 ? void 0 : _v.gmail) === null || _w === void 0 ? void 0 : _w.allowUnsafeExternalContent) === true);
                    shouldWrapExternal = isExternalHook && !allowUnsafeExternalContent;
                    if (isExternalHook) {
                        suspiciousPatterns = (0, external_content_js_1.detectSuspiciousPatterns)(params.message);
                        if (suspiciousPatterns.length > 0) {
                            (0, logger_js_1.logWarn)("[security] Suspicious patterns detected in external hook content " +
                                "(session=".concat(baseSessionKey, ", patterns=").concat(suspiciousPatterns.length, "): ").concat(suspiciousPatterns.slice(0, 3).join(", ")));
                        }
                    }
                    if (shouldWrapExternal) {
                        hookType = (0, external_content_js_1.getHookType)(baseSessionKey);
                        safeContent = (0, external_content_js_1.buildSafeExternalPrompt)({
                            content: params.message,
                            source: hookType,
                            jobName: params.job.name,
                            jobId: params.job.id,
                            timestamp: formattedTime,
                        });
                        commandBody = "".concat(safeContent, "\n\n").concat(timeLine).trim();
                    }
                    else {
                        // Internal/trusted source - use original format
                        commandBody = "".concat(base, "\n").concat(timeLine).trim();
                    }
                    existingSnapshot = cronSession.sessionEntry.skillsSnapshot;
                    skillsSnapshotVersion = (0, refresh_js_1.getSkillsSnapshotVersion)(workspaceDir);
                    needsSkillsSnapshot = !existingSnapshot || existingSnapshot.version !== skillsSnapshotVersion;
                    skillsSnapshot = needsSkillsSnapshot
                        ? (0, skills_js_1.buildWorkspaceSkillSnapshot)(workspaceDir, {
                            config: cfgWithAgentDefaults,
                            eligibility: { remote: (0, skills_remote_js_1.getRemoteSkillEligibility)() },
                            snapshotVersion: skillsSnapshotVersion,
                        })
                        : cronSession.sessionEntry.skillsSnapshot;
                    if (!(needsSkillsSnapshot && skillsSnapshot)) return [3 /*break*/, 10];
                    cronSession.sessionEntry = __assign(__assign({}, cronSession.sessionEntry), { updatedAt: Date.now(), skillsSnapshot: skillsSnapshot });
                    cronSession.store[agentSessionKey] = cronSession.sessionEntry;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(cronSession.storePath, function (store) {
                            store[agentSessionKey] = cronSession.sessionEntry;
                        })];
                case 9:
                    _22.sent();
                    _22.label = 10;
                case 10:
                    // Persist systemSent before the run, mirroring the inbound auto-reply behavior.
                    cronSession.sessionEntry.systemSent = true;
                    cronSession.store[agentSessionKey] = cronSession.sessionEntry;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(cronSession.storePath, function (store) {
                            store[agentSessionKey] = cronSession.sessionEntry;
                        })];
                case 11:
                    _22.sent();
                    fallbackProvider = provider;
                    fallbackModel = model;
                    _22.label = 12;
                case 12:
                    _22.trys.push([12, 14, , 15]);
                    sessionFile_1 = (0, sessions_js_1.resolveSessionTranscriptPath)(cronSession.sessionEntry.sessionId, agentId);
                    resolvedVerboseLevel_1 = (_y = (_x = (0, thinking_js_1.normalizeVerboseLevel)(cronSession.sessionEntry.verboseLevel)) !== null && _x !== void 0 ? _x : (0, thinking_js_1.normalizeVerboseLevel)(agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.verboseDefault)) !== null && _y !== void 0 ? _y : "off";
                    (0, agent_events_js_1.registerAgentRunContext)(cronSession.sessionEntry.sessionId, {
                        sessionKey: agentSessionKey,
                        verboseLevel: resolvedVerboseLevel_1,
                    });
                    messageChannel_1 = resolvedDelivery.channel;
                    return [4 /*yield*/, (0, model_fallback_js_1.runWithModelFallback)({
                            cfg: cfgWithAgentDefaults,
                            provider: provider,
                            model: model,
                            agentDir: agentDir,
                            fallbacksOverride: (0, agent_scope_js_1.resolveAgentModelFallbacksOverride)(params.cfg, agentId),
                            run: function (providerOverride, modelOverride) {
                                var _a;
                                if ((0, model_selection_js_1.isCliProvider)(providerOverride, cfgWithAgentDefaults)) {
                                    var cliSessionId = (0, cli_session_js_1.getCliSessionId)(cronSession.sessionEntry, providerOverride);
                                    return (0, cli_runner_js_1.runCliAgent)({
                                        sessionId: cronSession.sessionEntry.sessionId,
                                        sessionKey: agentSessionKey,
                                        sessionFile: sessionFile_1,
                                        workspaceDir: workspaceDir,
                                        config: cfgWithAgentDefaults,
                                        prompt: commandBody,
                                        provider: providerOverride,
                                        model: modelOverride,
                                        thinkLevel: thinkLevel,
                                        timeoutMs: timeoutMs,
                                        runId: cronSession.sessionEntry.sessionId,
                                        cliSessionId: cliSessionId,
                                    });
                                }
                                return (0, pi_embedded_js_1.runEmbeddedPiAgent)({
                                    sessionId: cronSession.sessionEntry.sessionId,
                                    sessionKey: agentSessionKey,
                                    messageChannel: messageChannel_1,
                                    agentAccountId: resolvedDelivery.accountId,
                                    sessionFile: sessionFile_1,
                                    workspaceDir: workspaceDir,
                                    config: cfgWithAgentDefaults,
                                    skillsSnapshot: skillsSnapshot,
                                    prompt: commandBody,
                                    lane: (_a = params.lane) !== null && _a !== void 0 ? _a : "cron",
                                    provider: providerOverride,
                                    model: modelOverride,
                                    thinkLevel: thinkLevel,
                                    verboseLevel: resolvedVerboseLevel_1,
                                    timeoutMs: timeoutMs,
                                    runId: cronSession.sessionEntry.sessionId,
                                });
                            },
                        })];
                case 13:
                    fallbackResult = _22.sent();
                    runResult = fallbackResult.result;
                    fallbackProvider = fallbackResult.provider;
                    fallbackModel = fallbackResult.model;
                    return [3 /*break*/, 15];
                case 14:
                    err_1 = _22.sent();
                    return [2 /*return*/, { status: "error", error: String(err_1) }];
                case 15:
                    payloads = (_z = runResult.payloads) !== null && _z !== void 0 ? _z : [];
                    usage = (_0 = runResult.meta.agentMeta) === null || _0 === void 0 ? void 0 : _0.usage;
                    modelUsed = (_3 = (_2 = (_1 = runResult.meta.agentMeta) === null || _1 === void 0 ? void 0 : _1.model) !== null && _2 !== void 0 ? _2 : fallbackModel) !== null && _3 !== void 0 ? _3 : model;
                    providerUsed = (_6 = (_5 = (_4 = runResult.meta.agentMeta) === null || _4 === void 0 ? void 0 : _4.provider) !== null && _5 !== void 0 ? _5 : fallbackProvider) !== null && _6 !== void 0 ? _6 : provider;
                    contextTokens = (_8 = (_7 = agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.contextTokens) !== null && _7 !== void 0 ? _7 : (0, context_js_1.lookupContextTokens)(modelUsed)) !== null && _8 !== void 0 ? _8 : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
                    cronSession.sessionEntry.modelProvider = providerUsed;
                    cronSession.sessionEntry.model = modelUsed;
                    cronSession.sessionEntry.contextTokens = contextTokens;
                    if ((0, model_selection_js_1.isCliProvider)(providerUsed, cfgWithAgentDefaults)) {
                        cliSessionId = (_10 = (_9 = runResult.meta.agentMeta) === null || _9 === void 0 ? void 0 : _9.sessionId) === null || _10 === void 0 ? void 0 : _10.trim();
                        if (cliSessionId) {
                            (0, cli_session_js_1.setCliSessionId)(cronSession.sessionEntry, providerUsed, cliSessionId);
                        }
                    }
                    if ((0, usage_js_1.hasNonzeroUsage)(usage)) {
                        input = (_11 = usage.input) !== null && _11 !== void 0 ? _11 : 0;
                        output = (_12 = usage.output) !== null && _12 !== void 0 ? _12 : 0;
                        promptTokens = input + ((_13 = usage.cacheRead) !== null && _13 !== void 0 ? _13 : 0) + ((_14 = usage.cacheWrite) !== null && _14 !== void 0 ? _14 : 0);
                        cronSession.sessionEntry.inputTokens = input;
                        cronSession.sessionEntry.outputTokens = output;
                        cronSession.sessionEntry.totalTokens =
                            promptTokens > 0 ? promptTokens : ((_15 = usage.total) !== null && _15 !== void 0 ? _15 : input);
                    }
                    cronSession.store[agentSessionKey] = cronSession.sessionEntry;
                    return [4 /*yield*/, (0, sessions_js_1.updateSessionStore)(cronSession.storePath, function (store) {
                            store[agentSessionKey] = cronSession.sessionEntry;
                        })];
                case 16:
                    _22.sent();
                    firstText = (_17 = (_16 = payloads[0]) === null || _16 === void 0 ? void 0 : _16.text) !== null && _17 !== void 0 ? _17 : "";
                    summary = (_18 = (0, helpers_js_1.pickSummaryFromPayloads)(payloads)) !== null && _18 !== void 0 ? _18 : (0, helpers_js_1.pickSummaryFromOutput)(firstText);
                    outputText = (0, helpers_js_1.pickLastNonEmptyTextFromPayloads)(payloads);
                    ackMaxChars = (0, helpers_js_1.resolveHeartbeatAckMaxChars)(agentCfg);
                    skipHeartbeatDelivery = deliveryRequested && (0, helpers_js_1.isHeartbeatOnlyResponse)(payloads, ackMaxChars);
                    skipMessagingToolDelivery = deliveryRequested &&
                        deliveryMode === "auto" &&
                        runResult.didSendViaMessagingTool === true &&
                        ((_19 = runResult.messagingToolSentTargets) !== null && _19 !== void 0 ? _19 : []).some(function (target) {
                            return matchesMessagingToolDeliveryTarget(target, {
                                channel: resolvedDelivery.channel,
                                to: resolvedDelivery.to,
                                accountId: resolvedDelivery.accountId,
                            });
                        });
                    if (!(deliveryRequested && !skipHeartbeatDelivery && !skipMessagingToolDelivery)) return [3 /*break*/, 20];
                    if (!resolvedDelivery.to) {
                        reason = (_21 = (_20 = resolvedDelivery.error) === null || _20 === void 0 ? void 0 : _20.message) !== null && _21 !== void 0 ? _21 : "Cron delivery requires a recipient (--to).";
                        if (!bestEffortDeliver) {
                            return [2 /*return*/, {
                                    status: "error",
                                    summary: summary,
                                    outputText: outputText,
                                    error: reason,
                                }];
                        }
                        return [2 /*return*/, {
                                status: "skipped",
                                summary: "Delivery skipped (".concat(reason, ")."),
                                outputText: outputText,
                            }];
                    }
                    _22.label = 17;
                case 17:
                    _22.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, (0, deliver_js_1.deliverOutboundPayloads)({
                            cfg: cfgWithAgentDefaults,
                            channel: resolvedDelivery.channel,
                            to: resolvedDelivery.to,
                            accountId: resolvedDelivery.accountId,
                            payloads: payloads,
                            bestEffort: bestEffortDeliver,
                            deps: (0, outbound_send_deps_js_1.createOutboundSendDeps)(params.deps),
                        })];
                case 18:
                    _22.sent();
                    return [3 /*break*/, 20];
                case 19:
                    err_2 = _22.sent();
                    if (!bestEffortDeliver) {
                        return [2 /*return*/, { status: "error", summary: summary, outputText: outputText, error: String(err_2) }];
                    }
                    return [2 /*return*/, { status: "ok", summary: summary, outputText: outputText }];
                case 20: return [2 /*return*/, { status: "ok", summary: summary, outputText: outputText }];
            }
        });
    });
}
