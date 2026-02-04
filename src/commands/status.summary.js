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
exports.getStatusSummary = getStatusSummary;
var context_js_1 = require("../agents/context.js");
var defaults_js_1 = require("../agents/defaults.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var session_utils_js_1 = require("../gateway/session-utils.js");
var channel_summary_js_1 = require("../infra/channel-summary.js");
var heartbeat_runner_js_1 = require("../infra/heartbeat-runner.js");
var system_events_js_1 = require("../infra/system-events.js");
var session_key_js_1 = require("../routing/session-key.js");
var status_link_channel_js_1 = require("./status.link-channel.js");
var classifyKey = function (key, entry) {
    if (key === "global") {
        return "global";
    }
    if (key === "unknown") {
        return "unknown";
    }
    if ((entry === null || entry === void 0 ? void 0 : entry.chatType) === "group" || (entry === null || entry === void 0 ? void 0 : entry.chatType) === "channel") {
        return "group";
    }
    if (key.includes(":group:") || key.includes(":channel:")) {
        return "group";
    }
    return "direct";
};
var buildFlags = function (entry) {
    if (!entry) {
        return [];
    }
    var flags = [];
    var think = entry === null || entry === void 0 ? void 0 : entry.thinkingLevel;
    if (typeof think === "string" && think.length > 0) {
        flags.push("think:".concat(think));
    }
    var verbose = entry === null || entry === void 0 ? void 0 : entry.verboseLevel;
    if (typeof verbose === "string" && verbose.length > 0) {
        flags.push("verbose:".concat(verbose));
    }
    var reasoning = entry === null || entry === void 0 ? void 0 : entry.reasoningLevel;
    if (typeof reasoning === "string" && reasoning.length > 0) {
        flags.push("reasoning:".concat(reasoning));
    }
    var elevated = entry === null || entry === void 0 ? void 0 : entry.elevatedLevel;
    if (typeof elevated === "string" && elevated.length > 0) {
        flags.push("elevated:".concat(elevated));
    }
    if (entry === null || entry === void 0 ? void 0 : entry.systemSent) {
        flags.push("system");
    }
    if (entry === null || entry === void 0 ? void 0 : entry.abortedLastRun) {
        flags.push("aborted");
    }
    var sessionId = entry === null || entry === void 0 ? void 0 : entry.sessionId;
    if (typeof sessionId === "string" && sessionId.length > 0) {
        flags.push("id:".concat(sessionId));
    }
    return flags;
};
function getStatusSummary() {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, linkContext, agentList, heartbeatAgents, channelSummary, mainSessionKey, queuedSystemEvents, resolved, configModel, configContextTokens, now, storeCache, loadStore, buildSessionRows, paths, byAgent, allSessions, recent, totalSessions;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, status_link_channel_js_1.resolveLinkChannelContext)(cfg)];
                case 1:
                    linkContext = _g.sent();
                    agentList = (0, session_utils_js_1.listAgentsForGateway)(cfg);
                    heartbeatAgents = agentList.agents.map(function (agent) {
                        var summary = (0, heartbeat_runner_js_1.resolveHeartbeatSummaryForAgent)(cfg, agent.id);
                        return {
                            agentId: agent.id,
                            enabled: summary.enabled,
                            every: summary.every,
                            everyMs: summary.everyMs,
                        };
                    });
                    return [4 /*yield*/, (0, channel_summary_js_1.buildChannelSummary)(cfg, {
                            colorize: true,
                            includeAllowFrom: true,
                        })];
                case 2:
                    channelSummary = _g.sent();
                    mainSessionKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                    queuedSystemEvents = (0, system_events_js_1.peekSystemEvents)(mainSessionKey);
                    resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    });
                    configModel = (_a = resolved.model) !== null && _a !== void 0 ? _a : defaults_js_1.DEFAULT_MODEL;
                    configContextTokens = (_e = (_d = (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.contextTokens) !== null && _d !== void 0 ? _d : (0, context_js_1.lookupContextTokens)(configModel)) !== null && _e !== void 0 ? _e : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
                    now = Date.now();
                    storeCache = new Map();
                    loadStore = function (storePath) {
                        var cached = storeCache.get(storePath);
                        if (cached) {
                            return cached;
                        }
                        var store = (0, sessions_js_1.loadSessionStore)(storePath);
                        storeCache.set(storePath, store);
                        return store;
                    };
                    buildSessionRows = function (store, opts) {
                        if (opts === void 0) { opts = {}; }
                        return Object.entries(store)
                            .filter(function (_a) {
                            var key = _a[0];
                            return key !== "global" && key !== "unknown";
                        })
                            .map(function (_a) {
                            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                            var key = _a[0], entry = _a[1];
                            var updatedAt = (_b = entry === null || entry === void 0 ? void 0 : entry.updatedAt) !== null && _b !== void 0 ? _b : null;
                            var age = updatedAt ? now - updatedAt : null;
                            var model = (_d = (_c = entry === null || entry === void 0 ? void 0 : entry.model) !== null && _c !== void 0 ? _c : configModel) !== null && _d !== void 0 ? _d : null;
                            var contextTokens = (_g = (_f = (_e = entry === null || entry === void 0 ? void 0 : entry.contextTokens) !== null && _e !== void 0 ? _e : (0, context_js_1.lookupContextTokens)(model)) !== null && _f !== void 0 ? _f : configContextTokens) !== null && _g !== void 0 ? _g : null;
                            var input = (_h = entry === null || entry === void 0 ? void 0 : entry.inputTokens) !== null && _h !== void 0 ? _h : 0;
                            var output = (_j = entry === null || entry === void 0 ? void 0 : entry.outputTokens) !== null && _j !== void 0 ? _j : 0;
                            var total = (_k = entry === null || entry === void 0 ? void 0 : entry.totalTokens) !== null && _k !== void 0 ? _k : input + output;
                            var remaining = contextTokens != null ? Math.max(0, contextTokens - total) : null;
                            var pct = contextTokens && contextTokens > 0
                                ? Math.min(999, Math.round((total / contextTokens) * 100))
                                : null;
                            var parsedAgentId = (_l = (0, session_key_js_1.parseAgentSessionKey)(key)) === null || _l === void 0 ? void 0 : _l.agentId;
                            var agentId = (_m = opts.agentIdOverride) !== null && _m !== void 0 ? _m : parsedAgentId;
                            return {
                                agentId: agentId,
                                key: key,
                                kind: classifyKey(key, entry),
                                sessionId: entry === null || entry === void 0 ? void 0 : entry.sessionId,
                                updatedAt: updatedAt,
                                age: age,
                                thinkingLevel: entry === null || entry === void 0 ? void 0 : entry.thinkingLevel,
                                verboseLevel: entry === null || entry === void 0 ? void 0 : entry.verboseLevel,
                                reasoningLevel: entry === null || entry === void 0 ? void 0 : entry.reasoningLevel,
                                elevatedLevel: entry === null || entry === void 0 ? void 0 : entry.elevatedLevel,
                                systemSent: entry === null || entry === void 0 ? void 0 : entry.systemSent,
                                abortedLastRun: entry === null || entry === void 0 ? void 0 : entry.abortedLastRun,
                                inputTokens: entry === null || entry === void 0 ? void 0 : entry.inputTokens,
                                outputTokens: entry === null || entry === void 0 ? void 0 : entry.outputTokens,
                                totalTokens: total !== null && total !== void 0 ? total : null,
                                remainingTokens: remaining,
                                percentUsed: pct,
                                model: model,
                                contextTokens: contextTokens,
                                flags: buildFlags(entry),
                            };
                        })
                            .sort(function (a, b) { var _a, _b; return ((_a = b.updatedAt) !== null && _a !== void 0 ? _a : 0) - ((_b = a.updatedAt) !== null && _b !== void 0 ? _b : 0); });
                    };
                    paths = new Set();
                    byAgent = agentList.agents.map(function (agent) {
                        var _a;
                        var storePath = (0, sessions_js_1.resolveStorePath)((_a = cfg.session) === null || _a === void 0 ? void 0 : _a.store, { agentId: agent.id });
                        paths.add(storePath);
                        var store = loadStore(storePath);
                        var sessions = buildSessionRows(store, { agentIdOverride: agent.id });
                        return {
                            agentId: agent.id,
                            path: storePath,
                            count: sessions.length,
                            recent: sessions.slice(0, 10),
                        };
                    });
                    allSessions = Array.from(paths)
                        .flatMap(function (storePath) { return buildSessionRows(loadStore(storePath)); })
                        .toSorted(function (a, b) { var _a, _b; return ((_a = b.updatedAt) !== null && _a !== void 0 ? _a : 0) - ((_b = a.updatedAt) !== null && _b !== void 0 ? _b : 0); });
                    recent = allSessions.slice(0, 10);
                    totalSessions = allSessions.length;
                    return [2 /*return*/, {
                            linkChannel: linkContext
                                ? {
                                    id: linkContext.plugin.id,
                                    label: (_f = linkContext.plugin.meta.label) !== null && _f !== void 0 ? _f : "Channel",
                                    linked: linkContext.linked,
                                    authAgeMs: linkContext.authAgeMs,
                                }
                                : undefined,
                            heartbeat: {
                                defaultAgentId: agentList.defaultId,
                                agents: heartbeatAgents,
                            },
                            channelSummary: channelSummary,
                            queuedSystemEvents: queuedSystemEvents,
                            sessions: {
                                paths: Array.from(paths),
                                count: totalSessions,
                                defaults: {
                                    model: configModel !== null && configModel !== void 0 ? configModel : null,
                                    contextTokens: configContextTokens !== null && configContextTokens !== void 0 ? configContextTokens : null,
                                },
                                recent: recent,
                                byAgent: byAgent,
                            },
                        }];
            }
        });
    });
}
