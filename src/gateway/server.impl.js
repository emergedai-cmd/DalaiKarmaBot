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
exports.__resetModelCatalogCacheForTest = void 0;
exports.startGatewayServer = startGatewayServer;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var refresh_js_1 = require("../agents/skills/refresh.js");
var subagent_registry_js_1 = require("../agents/subagent-registry.js");
var index_js_1 = require("../channels/plugins/index.js");
var command_format_js_1 = require("../cli/command-format.js");
var deps_js_1 = require("../cli/deps.js");
var config_js_1 = require("../config/config.js");
var plugin_auto_enable_js_1 = require("../config/plugin-auto-enable.js");
var agent_events_js_1 = require("../infra/agent-events.js");
var diagnostic_events_js_1 = require("../infra/diagnostic-events.js");
var env_js_1 = require("../infra/env.js");
var exec_approval_forwarder_js_1 = require("../infra/exec-approval-forwarder.js");
var heartbeat_events_js_1 = require("../infra/heartbeat-events.js");
var heartbeat_runner_js_1 = require("../infra/heartbeat-runner.js");
var machine_name_js_1 = require("../infra/machine-name.js");
var path_env_js_1 = require("../infra/path-env.js");
var restart_js_1 = require("../infra/restart.js");
var skills_remote_js_1 = require("../infra/skills-remote.js");
var update_startup_js_1 = require("../infra/update-startup.js");
var diagnostic_js_1 = require("../logging/diagnostic.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var onboarding_js_1 = require("../wizard/onboarding.js");
var config_reload_js_1 = require("./config-reload.js");
var exec_approval_manager_js_1 = require("./exec-approval-manager.js");
var node_registry_js_1 = require("./node-registry.js");
var server_channels_js_1 = require("./server-channels.js");
var server_chat_js_1 = require("./server-chat.js");
var server_close_js_1 = require("./server-close.js");
var server_cron_js_1 = require("./server-cron.js");
var server_discovery_runtime_js_1 = require("./server-discovery-runtime.js");
var server_lanes_js_1 = require("./server-lanes.js");
var server_maintenance_js_1 = require("./server-maintenance.js");
var server_methods_list_js_1 = require("./server-methods-list.js");
var server_methods_js_1 = require("./server-methods.js");
var exec_approval_js_1 = require("./server-methods/exec-approval.js");
var nodes_helpers_js_1 = require("./server-methods/nodes.helpers.js");
var server_mobile_nodes_js_1 = require("./server-mobile-nodes.js");
var server_model_catalog_js_1 = require("./server-model-catalog.js");
var server_node_subscriptions_js_1 = require("./server-node-subscriptions.js");
var server_plugins_js_1 = require("./server-plugins.js");
var server_reload_handlers_js_1 = require("./server-reload-handlers.js");
var server_runtime_config_js_1 = require("./server-runtime-config.js");
var server_runtime_state_js_1 = require("./server-runtime-state.js");
var server_session_key_js_1 = require("./server-session-key.js");
var server_startup_log_js_1 = require("./server-startup-log.js");
var server_startup_js_1 = require("./server-startup.js");
var server_tailscale_js_1 = require("./server-tailscale.js");
var server_wizard_sessions_js_1 = require("./server-wizard-sessions.js");
var server_ws_runtime_js_1 = require("./server-ws-runtime.js");
var health_state_js_1 = require("./server/health-state.js");
var tls_js_1 = require("./server/tls.js");
var server_model_catalog_js_2 = require("./server-model-catalog.js");
Object.defineProperty(exports, "__resetModelCatalogCacheForTest", { enumerable: true, get: function () { return server_model_catalog_js_2.__resetModelCatalogCacheForTest; } });
(0, path_env_js_1.ensureOpenClawCliOnPath)();
var log = (0, subsystem_js_1.createSubsystemLogger)("gateway");
var logCanvas = log.child("canvas");
var logDiscovery = log.child("discovery");
var logTailscale = log.child("tailscale");
var logChannels = log.child("channels");
var logBrowser = log.child("browser");
var logHealth = log.child("health");
var logCron = log.child("cron");
var logReload = log.child("reload");
var logHooks = log.child("hooks");
var logPlugins = log.child("plugins");
var logWsControl = log.child("ws");
var canvasRuntime = (0, subsystem_js_1.runtimeForLogger)(logCanvas);
function startGatewayServer() {
    return __awaiter(this, arguments, void 0, function (port, opts) {
        var configSnapshot, _a, migrated, changes, issues, autoEnable, err_1, cfgAtStart, diagnosticsEnabled, defaultAgentId, defaultWorkspaceDir, baseMethods, _b, pluginRegistry, baseGatewayMethods, channelLogs, channelRuntimeEnvs, channelMethods, gatewayMethods, pluginServices, runtimeConfig, bindHost, controlUiEnabled, openAiChatCompletionsEnabled, openResponsesEnabled, openResponsesConfig, controlUiBasePath, resolvedAuth, tailscaleConfig, tailscaleMode, hooksConfig, canvasHostEnabled, wizardRunner, _c, wizardSessions, findRunningWizard, purgeWizardSession, deps, canvasHostServer, gatewayTls, _d, canvasHost, httpServer, httpServers, httpBindHosts, wss, clients, broadcast, agentRunSeq, dedupe, chatRunState, chatRunBuffers, chatDeltaSentAt, addChatRun, removeChatRun, chatAbortControllers, bonjourStop, nodeRegistry, nodePresenceTimers, nodeSubscriptions, nodeSendEvent, nodeSendToSession, nodeSendToAllSubscribed, nodeSubscribe, nodeUnsubscribe, nodeUnsubscribeAll, broadcastVoiceWakeChanged, hasMobileNodeConnected, cronState, cron, cronStorePath, channelManager, getRuntimeSnapshot, startChannels, startChannel, stopChannel, markChannelLoggedOut, machineDisplayName, discovery, skillsRefreshTimer, skillsRefreshDelayMs, skillsChangeUnsub, _e, tickInterval, healthInterval, dedupeCleanup, agentUnsub, heartbeatUnsub, heartbeatRunner, execApprovalManager, execApprovalForwarder, execApprovalHandlers, canvasHostServerPort, tailscaleCleanup, browserControl, _f, applyHotReload, requestGatewayRestart, configReloader, close;
        var _g;
        var _this = this;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        if (port === void 0) { port = 18789; }
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    // Ensure all default port derivations (browser/canvas) see the actual runtime port.
                    process.env.OPENCLAW_GATEWAY_PORT = String(port);
                    (0, env_js_1.logAcceptedEnvOption)({
                        key: "OPENCLAW_RAW_STREAM",
                        description: "raw stream logging enabled",
                    });
                    (0, env_js_1.logAcceptedEnvOption)({
                        key: "OPENCLAW_RAW_STREAM_PATH",
                        description: "raw stream log path override",
                    });
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    configSnapshot = _v.sent();
                    if (!(configSnapshot.legacyIssues.length > 0)) return [3 /*break*/, 3];
                    if (config_js_1.isNixMode) {
                        throw new Error("Legacy config entries detected while running in Nix mode. Update your Nix config to the latest schema and restart.");
                    }
                    _a = (0, config_js_1.migrateLegacyConfig)(configSnapshot.parsed), migrated = _a.config, changes = _a.changes;
                    if (!migrated) {
                        throw new Error("Legacy config entries detected but auto-migration failed. Run \"".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor"), "\" to migrate."));
                    }
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(migrated)];
                case 2:
                    _v.sent();
                    if (changes.length > 0) {
                        log.info("gateway: migrated legacy config entries:\n".concat(changes
                            .map(function (entry) { return "- ".concat(entry); })
                            .join("\n")));
                    }
                    _v.label = 3;
                case 3: return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 4:
                    configSnapshot = _v.sent();
                    if (configSnapshot.exists && !configSnapshot.valid) {
                        issues = configSnapshot.issues.length > 0
                            ? configSnapshot.issues
                                .map(function (issue) { return "".concat(issue.path || "<root>", ": ").concat(issue.message); })
                                .join("\n")
                            : "Unknown validation issue.";
                        throw new Error("Invalid config at ".concat(configSnapshot.path, ".\n").concat(issues, "\nRun \"").concat((0, command_format_js_1.formatCliCommand)("openclaw doctor"), "\" to repair, then retry."));
                    }
                    autoEnable = (0, plugin_auto_enable_js_1.applyPluginAutoEnable)({ config: configSnapshot.config, env: process.env });
                    if (!(autoEnable.changes.length > 0)) return [3 /*break*/, 8];
                    _v.label = 5;
                case 5:
                    _v.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(autoEnable.config)];
                case 6:
                    _v.sent();
                    log.info("gateway: auto-enabled plugins:\n".concat(autoEnable.changes
                        .map(function (entry) { return "- ".concat(entry); })
                        .join("\n")));
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _v.sent();
                    log.warn("gateway: failed to persist plugin auto-enable changes: ".concat(String(err_1)));
                    return [3 /*break*/, 8];
                case 8:
                    cfgAtStart = (0, config_js_1.loadConfig)();
                    diagnosticsEnabled = (0, diagnostic_events_js_1.isDiagnosticsEnabled)(cfgAtStart);
                    if (diagnosticsEnabled) {
                        (0, diagnostic_js_1.startDiagnosticHeartbeat)();
                    }
                    (0, restart_js_1.setGatewaySigusr1RestartPolicy)({ allowExternal: ((_h = cfgAtStart.commands) === null || _h === void 0 ? void 0 : _h.restart) === true });
                    (0, subagent_registry_js_1.initSubagentRegistry)();
                    defaultAgentId = (0, agent_scope_js_1.resolveDefaultAgentId)(cfgAtStart);
                    defaultWorkspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfgAtStart, defaultAgentId);
                    baseMethods = (0, server_methods_list_js_1.listGatewayMethods)();
                    _b = (0, server_plugins_js_1.loadGatewayPlugins)({
                        cfg: cfgAtStart,
                        workspaceDir: defaultWorkspaceDir,
                        log: log,
                        coreGatewayHandlers: server_methods_js_1.coreGatewayHandlers,
                        baseMethods: baseMethods,
                    }), pluginRegistry = _b.pluginRegistry, baseGatewayMethods = _b.gatewayMethods;
                    channelLogs = Object.fromEntries((0, index_js_1.listChannelPlugins)().map(function (plugin) { return [plugin.id, logChannels.child(plugin.id)]; }));
                    channelRuntimeEnvs = Object.fromEntries(Object.entries(channelLogs).map(function (_a) {
                        var id = _a[0], logger = _a[1];
                        return [id, (0, subsystem_js_1.runtimeForLogger)(logger)];
                    }));
                    channelMethods = (0, index_js_1.listChannelPlugins)().flatMap(function (plugin) { var _a; return (_a = plugin.gatewayMethods) !== null && _a !== void 0 ? _a : []; });
                    gatewayMethods = Array.from(new Set(__spreadArray(__spreadArray([], baseGatewayMethods, true), channelMethods, true)));
                    pluginServices = null;
                    return [4 /*yield*/, (0, server_runtime_config_js_1.resolveGatewayRuntimeConfig)({
                            cfg: cfgAtStart,
                            port: port,
                            bind: opts.bind,
                            host: opts.host,
                            controlUiEnabled: opts.controlUiEnabled,
                            openAiChatCompletionsEnabled: opts.openAiChatCompletionsEnabled,
                            openResponsesEnabled: opts.openResponsesEnabled,
                            auth: opts.auth,
                            tailscale: opts.tailscale,
                        })];
                case 9:
                    runtimeConfig = _v.sent();
                    bindHost = runtimeConfig.bindHost, controlUiEnabled = runtimeConfig.controlUiEnabled, openAiChatCompletionsEnabled = runtimeConfig.openAiChatCompletionsEnabled, openResponsesEnabled = runtimeConfig.openResponsesEnabled, openResponsesConfig = runtimeConfig.openResponsesConfig, controlUiBasePath = runtimeConfig.controlUiBasePath, resolvedAuth = runtimeConfig.resolvedAuth, tailscaleConfig = runtimeConfig.tailscaleConfig, tailscaleMode = runtimeConfig.tailscaleMode;
                    hooksConfig = runtimeConfig.hooksConfig;
                    canvasHostEnabled = runtimeConfig.canvasHostEnabled;
                    wizardRunner = (_j = opts.wizardRunner) !== null && _j !== void 0 ? _j : onboarding_js_1.runOnboardingWizard;
                    _c = (0, server_wizard_sessions_js_1.createWizardSessionTracker)(), wizardSessions = _c.wizardSessions, findRunningWizard = _c.findRunningWizard, purgeWizardSession = _c.purgeWizardSession;
                    deps = (0, deps_js_1.createDefaultDeps)();
                    canvasHostServer = null;
                    return [4 /*yield*/, (0, tls_js_1.loadGatewayTlsRuntime)((_k = cfgAtStart.gateway) === null || _k === void 0 ? void 0 : _k.tls, log.child("tls"))];
                case 10:
                    gatewayTls = _v.sent();
                    if (((_m = (_l = cfgAtStart.gateway) === null || _l === void 0 ? void 0 : _l.tls) === null || _m === void 0 ? void 0 : _m.enabled) && !gatewayTls.enabled) {
                        throw new Error((_o = gatewayTls.error) !== null && _o !== void 0 ? _o : "gateway tls: failed to enable");
                    }
                    return [4 /*yield*/, (0, server_runtime_state_js_1.createGatewayRuntimeState)({
                            cfg: cfgAtStart,
                            bindHost: bindHost,
                            port: port,
                            controlUiEnabled: controlUiEnabled,
                            controlUiBasePath: controlUiBasePath,
                            openAiChatCompletionsEnabled: openAiChatCompletionsEnabled,
                            openResponsesEnabled: openResponsesEnabled,
                            openResponsesConfig: openResponsesConfig,
                            resolvedAuth: resolvedAuth,
                            gatewayTls: gatewayTls,
                            hooksConfig: function () { return hooksConfig; },
                            pluginRegistry: pluginRegistry,
                            deps: deps,
                            canvasRuntime: canvasRuntime,
                            canvasHostEnabled: canvasHostEnabled,
                            allowCanvasHostInTests: opts.allowCanvasHostInTests,
                            logCanvas: logCanvas,
                            log: log,
                            logHooks: logHooks,
                            logPlugins: logPlugins,
                        })];
                case 11:
                    _d = _v.sent(), canvasHost = _d.canvasHost, httpServer = _d.httpServer, httpServers = _d.httpServers, httpBindHosts = _d.httpBindHosts, wss = _d.wss, clients = _d.clients, broadcast = _d.broadcast, agentRunSeq = _d.agentRunSeq, dedupe = _d.dedupe, chatRunState = _d.chatRunState, chatRunBuffers = _d.chatRunBuffers, chatDeltaSentAt = _d.chatDeltaSentAt, addChatRun = _d.addChatRun, removeChatRun = _d.removeChatRun, chatAbortControllers = _d.chatAbortControllers;
                    bonjourStop = null;
                    nodeRegistry = new node_registry_js_1.NodeRegistry();
                    nodePresenceTimers = new Map();
                    nodeSubscriptions = (0, server_node_subscriptions_js_1.createNodeSubscriptionManager)();
                    nodeSendEvent = function (opts) {
                        var _a;
                        var payload = (0, nodes_helpers_js_1.safeParseJson)((_a = opts.payloadJSON) !== null && _a !== void 0 ? _a : null);
                        nodeRegistry.sendEvent(opts.nodeId, opts.event, payload);
                    };
                    nodeSendToSession = function (sessionKey, event, payload) {
                        return nodeSubscriptions.sendToSession(sessionKey, event, payload, nodeSendEvent);
                    };
                    nodeSendToAllSubscribed = function (event, payload) {
                        return nodeSubscriptions.sendToAllSubscribed(event, payload, nodeSendEvent);
                    };
                    nodeSubscribe = nodeSubscriptions.subscribe;
                    nodeUnsubscribe = nodeSubscriptions.unsubscribe;
                    nodeUnsubscribeAll = nodeSubscriptions.unsubscribeAll;
                    broadcastVoiceWakeChanged = function (triggers) {
                        broadcast("voicewake.changed", { triggers: triggers }, { dropIfSlow: true });
                    };
                    hasMobileNodeConnected = function () { return (0, server_mobile_nodes_js_1.hasConnectedMobileNode)(nodeRegistry); };
                    (0, server_lanes_js_1.applyGatewayLaneConcurrency)(cfgAtStart);
                    cronState = (0, server_cron_js_1.buildGatewayCronService)({
                        cfg: cfgAtStart,
                        deps: deps,
                        broadcast: broadcast,
                    });
                    cron = cronState.cron, cronStorePath = cronState.storePath;
                    channelManager = (0, server_channels_js_1.createChannelManager)({
                        loadConfig: config_js_1.loadConfig,
                        channelLogs: channelLogs,
                        channelRuntimeEnvs: channelRuntimeEnvs,
                    });
                    getRuntimeSnapshot = channelManager.getRuntimeSnapshot, startChannels = channelManager.startChannels, startChannel = channelManager.startChannel, stopChannel = channelManager.stopChannel, markChannelLoggedOut = channelManager.markChannelLoggedOut;
                    return [4 /*yield*/, (0, machine_name_js_1.getMachineDisplayName)()];
                case 12:
                    machineDisplayName = _v.sent();
                    return [4 /*yield*/, (0, server_discovery_runtime_js_1.startGatewayDiscovery)({
                            machineDisplayName: machineDisplayName,
                            port: port,
                            gatewayTls: gatewayTls.enabled
                                ? { enabled: true, fingerprintSha256: gatewayTls.fingerprintSha256 }
                                : undefined,
                            wideAreaDiscoveryEnabled: ((_q = (_p = cfgAtStart.discovery) === null || _p === void 0 ? void 0 : _p.wideArea) === null || _q === void 0 ? void 0 : _q.enabled) === true,
                            wideAreaDiscoveryDomain: (_s = (_r = cfgAtStart.discovery) === null || _r === void 0 ? void 0 : _r.wideArea) === null || _s === void 0 ? void 0 : _s.domain,
                            tailscaleMode: tailscaleMode,
                            mdnsMode: (_u = (_t = cfgAtStart.discovery) === null || _t === void 0 ? void 0 : _t.mdns) === null || _u === void 0 ? void 0 : _u.mode,
                            logDiscovery: logDiscovery,
                        })];
                case 13:
                    discovery = _v.sent();
                    bonjourStop = discovery.bonjourStop;
                    (0, skills_remote_js_1.setSkillsRemoteRegistry)(nodeRegistry);
                    void (0, skills_remote_js_1.primeRemoteSkillsCache)();
                    skillsRefreshTimer = null;
                    skillsRefreshDelayMs = 30000;
                    skillsChangeUnsub = (0, refresh_js_1.registerSkillsChangeListener)(function (event) {
                        if (event.reason === "remote-node") {
                            return;
                        }
                        if (skillsRefreshTimer) {
                            clearTimeout(skillsRefreshTimer);
                        }
                        skillsRefreshTimer = setTimeout(function () {
                            skillsRefreshTimer = null;
                            var latest = (0, config_js_1.loadConfig)();
                            void (0, skills_remote_js_1.refreshRemoteBinsForConnectedNodes)(latest);
                        }, skillsRefreshDelayMs);
                    });
                    _e = (0, server_maintenance_js_1.startGatewayMaintenanceTimers)({
                        broadcast: broadcast,
                        nodeSendToAllSubscribed: nodeSendToAllSubscribed,
                        getPresenceVersion: health_state_js_1.getPresenceVersion,
                        getHealthVersion: health_state_js_1.getHealthVersion,
                        refreshGatewayHealthSnapshot: health_state_js_1.refreshGatewayHealthSnapshot,
                        logHealth: logHealth,
                        dedupe: dedupe,
                        chatAbortControllers: chatAbortControllers,
                        chatRunState: chatRunState,
                        chatRunBuffers: chatRunBuffers,
                        chatDeltaSentAt: chatDeltaSentAt,
                        removeChatRun: removeChatRun,
                        agentRunSeq: agentRunSeq,
                        nodeSendToSession: nodeSendToSession,
                    }), tickInterval = _e.tickInterval, healthInterval = _e.healthInterval, dedupeCleanup = _e.dedupeCleanup;
                    agentUnsub = (0, agent_events_js_1.onAgentEvent)((0, server_chat_js_1.createAgentEventHandler)({
                        broadcast: broadcast,
                        nodeSendToSession: nodeSendToSession,
                        agentRunSeq: agentRunSeq,
                        chatRunState: chatRunState,
                        resolveSessionKeyForRun: server_session_key_js_1.resolveSessionKeyForRun,
                        clearAgentRunContext: agent_events_js_1.clearAgentRunContext,
                    }));
                    heartbeatUnsub = (0, heartbeat_events_js_1.onHeartbeatEvent)(function (evt) {
                        broadcast("heartbeat", evt, { dropIfSlow: true });
                    });
                    heartbeatRunner = (0, heartbeat_runner_js_1.startHeartbeatRunner)({ cfg: cfgAtStart });
                    void cron.start().catch(function (err) { return logCron.error("failed to start: ".concat(String(err))); });
                    execApprovalManager = new exec_approval_manager_js_1.ExecApprovalManager();
                    execApprovalForwarder = (0, exec_approval_forwarder_js_1.createExecApprovalForwarder)();
                    execApprovalHandlers = (0, exec_approval_js_1.createExecApprovalHandlers)(execApprovalManager, {
                        forwarder: execApprovalForwarder,
                    });
                    canvasHostServerPort = canvasHostServer === null || canvasHostServer === void 0 ? void 0 : canvasHostServer.port;
                    (0, server_ws_runtime_js_1.attachGatewayWsHandlers)({
                        wss: wss,
                        clients: clients,
                        port: port,
                        gatewayHost: bindHost !== null && bindHost !== void 0 ? bindHost : undefined,
                        canvasHostEnabled: Boolean(canvasHost),
                        canvasHostServerPort: canvasHostServerPort,
                        resolvedAuth: resolvedAuth,
                        gatewayMethods: gatewayMethods,
                        events: server_methods_list_js_1.GATEWAY_EVENTS,
                        logGateway: log,
                        logHealth: logHealth,
                        logWsControl: logWsControl,
                        extraHandlers: __assign(__assign({}, pluginRegistry.gatewayHandlers), execApprovalHandlers),
                        broadcast: broadcast,
                        context: {
                            deps: deps,
                            cron: cron,
                            cronStorePath: cronStorePath,
                            loadGatewayModelCatalog: server_model_catalog_js_1.loadGatewayModelCatalog,
                            getHealthCache: health_state_js_1.getHealthCache,
                            refreshHealthSnapshot: health_state_js_1.refreshGatewayHealthSnapshot,
                            logHealth: logHealth,
                            logGateway: log,
                            incrementPresenceVersion: health_state_js_1.incrementPresenceVersion,
                            getHealthVersion: health_state_js_1.getHealthVersion,
                            broadcast: broadcast,
                            nodeSendToSession: nodeSendToSession,
                            nodeSendToAllSubscribed: nodeSendToAllSubscribed,
                            nodeSubscribe: nodeSubscribe,
                            nodeUnsubscribe: nodeUnsubscribe,
                            nodeUnsubscribeAll: nodeUnsubscribeAll,
                            hasConnectedMobileNode: hasMobileNodeConnected,
                            nodeRegistry: nodeRegistry,
                            agentRunSeq: agentRunSeq,
                            chatAbortControllers: chatAbortControllers,
                            chatAbortedRuns: chatRunState.abortedRuns,
                            chatRunBuffers: chatRunState.buffers,
                            chatDeltaSentAt: chatRunState.deltaSentAt,
                            addChatRun: addChatRun,
                            removeChatRun: removeChatRun,
                            dedupe: dedupe,
                            wizardSessions: wizardSessions,
                            findRunningWizard: findRunningWizard,
                            purgeWizardSession: purgeWizardSession,
                            getRuntimeSnapshot: getRuntimeSnapshot,
                            startChannel: startChannel,
                            stopChannel: stopChannel,
                            markChannelLoggedOut: markChannelLoggedOut,
                            wizardRunner: wizardRunner,
                            broadcastVoiceWakeChanged: broadcastVoiceWakeChanged,
                        },
                    });
                    (0, server_startup_log_js_1.logGatewayStartup)({
                        cfg: cfgAtStart,
                        bindHost: bindHost,
                        bindHosts: httpBindHosts,
                        port: port,
                        tlsEnabled: gatewayTls.enabled,
                        log: log,
                        isNixMode: config_js_1.isNixMode,
                    });
                    (0, update_startup_js_1.scheduleGatewayUpdateCheck)({ cfg: cfgAtStart, log: log, isNixMode: config_js_1.isNixMode });
                    return [4 /*yield*/, (0, server_tailscale_js_1.startGatewayTailscaleExposure)({
                            tailscaleMode: tailscaleMode,
                            resetOnExit: tailscaleConfig.resetOnExit,
                            port: port,
                            controlUiBasePath: controlUiBasePath,
                            logTailscale: logTailscale,
                        })];
                case 14:
                    tailscaleCleanup = _v.sent();
                    browserControl = null;
                    return [4 /*yield*/, (0, server_startup_js_1.startGatewaySidecars)({
                            cfg: cfgAtStart,
                            pluginRegistry: pluginRegistry,
                            defaultWorkspaceDir: defaultWorkspaceDir,
                            deps: deps,
                            startChannels: startChannels,
                            log: log,
                            logHooks: logHooks,
                            logChannels: logChannels,
                            logBrowser: logBrowser,
                        })];
                case 15:
                    (_g = _v.sent(), browserControl = _g.browserControl, pluginServices = _g.pluginServices);
                    _f = (0, server_reload_handlers_js_1.createGatewayReloadHandlers)({
                        deps: deps,
                        broadcast: broadcast,
                        getState: function () { return ({
                            hooksConfig: hooksConfig,
                            heartbeatRunner: heartbeatRunner,
                            cronState: cronState,
                            browserControl: browserControl,
                        }); },
                        setState: function (nextState) {
                            hooksConfig = nextState.hooksConfig;
                            heartbeatRunner = nextState.heartbeatRunner;
                            cronState = nextState.cronState;
                            cron = cronState.cron;
                            cronStorePath = cronState.storePath;
                            browserControl = nextState.browserControl;
                        },
                        startChannel: startChannel,
                        stopChannel: stopChannel,
                        logHooks: logHooks,
                        logBrowser: logBrowser,
                        logChannels: logChannels,
                        logCron: logCron,
                        logReload: logReload,
                    }), applyHotReload = _f.applyHotReload, requestGatewayRestart = _f.requestGatewayRestart;
                    configReloader = (0, config_reload_js_1.startGatewayConfigReloader)({
                        initialConfig: cfgAtStart,
                        readSnapshot: config_js_1.readConfigFileSnapshot,
                        onHotReload: applyHotReload,
                        onRestart: requestGatewayRestart,
                        log: {
                            info: function (msg) { return logReload.info(msg); },
                            warn: function (msg) { return logReload.warn(msg); },
                            error: function (msg) { return logReload.error(msg); },
                        },
                        watchPath: config_js_1.CONFIG_PATH,
                    });
                    close = (0, server_close_js_1.createGatewayCloseHandler)({
                        bonjourStop: bonjourStop,
                        tailscaleCleanup: tailscaleCleanup,
                        canvasHost: canvasHost,
                        canvasHostServer: canvasHostServer,
                        stopChannel: stopChannel,
                        pluginServices: pluginServices,
                        cron: cron,
                        heartbeatRunner: heartbeatRunner,
                        nodePresenceTimers: nodePresenceTimers,
                        broadcast: broadcast,
                        tickInterval: tickInterval,
                        healthInterval: healthInterval,
                        dedupeCleanup: dedupeCleanup,
                        agentUnsub: agentUnsub,
                        heartbeatUnsub: heartbeatUnsub,
                        chatRunState: chatRunState,
                        clients: clients,
                        configReloader: configReloader,
                        browserControl: browserControl,
                        wss: wss,
                        httpServer: httpServer,
                        httpServers: httpServers,
                    });
                    return [2 /*return*/, {
                            close: function (opts) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (diagnosticsEnabled) {
                                                (0, diagnostic_js_1.stopDiagnosticHeartbeat)();
                                            }
                                            if (skillsRefreshTimer) {
                                                clearTimeout(skillsRefreshTimer);
                                                skillsRefreshTimer = null;
                                            }
                                            skillsChangeUnsub();
                                            return [4 /*yield*/, close(opts)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        }];
            }
        });
    });
}
