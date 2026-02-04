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
exports.createSessionActions = createSessionActions;
var session_key_js_1 = require("../routing/session-key.js");
var tui_formatters_js_1 = require("./tui-formatters.js");
function createSessionActions(context) {
    var _this = this;
    var client = context.client, chatLog = context.chatLog, tui = context.tui, opts = context.opts, state = context.state, agentNames = context.agentNames, initialSessionInput = context.initialSessionInput, initialSessionAgentId = context.initialSessionAgentId, resolveSessionKey = context.resolveSessionKey, updateHeader = context.updateHeader, updateFooter = context.updateFooter, updateAutocompleteProvider = context.updateAutocompleteProvider, setActivityStatus = context.setActivityStatus;
    var refreshSessionInfoPromise = null;
    var applyAgentsResult = function (result) {
        var _a, _b, _c, _d, _e, _f, _g;
        state.agentDefaultId = (0, session_key_js_1.normalizeAgentId)(result.defaultId);
        state.sessionMainKey = (0, session_key_js_1.normalizeMainKey)(result.mainKey);
        state.sessionScope = (_a = result.scope) !== null && _a !== void 0 ? _a : state.sessionScope;
        state.agents = result.agents.map(function (agent) {
            var _a;
            return ({
                id: (0, session_key_js_1.normalizeAgentId)(agent.id),
                name: ((_a = agent.name) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
            });
        });
        agentNames.clear();
        for (var _i = 0, _h = state.agents; _i < _h.length; _i++) {
            var agent = _h[_i];
            if (agent.name) {
                agentNames.set(agent.id, agent.name);
            }
        }
        if (!state.initialSessionApplied) {
            if (initialSessionAgentId) {
                if (state.agents.some(function (agent) { return agent.id === initialSessionAgentId; })) {
                    state.currentAgentId = initialSessionAgentId;
                }
            }
            else if (!state.agents.some(function (agent) { return agent.id === state.currentAgentId; })) {
                state.currentAgentId =
                    (_c = (_b = state.agents[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : (0, session_key_js_1.normalizeAgentId)((_d = result.defaultId) !== null && _d !== void 0 ? _d : state.currentAgentId);
            }
            var nextSessionKey = resolveSessionKey(initialSessionInput);
            if (nextSessionKey !== state.currentSessionKey) {
                state.currentSessionKey = nextSessionKey;
            }
            state.initialSessionApplied = true;
        }
        else if (!state.agents.some(function (agent) { return agent.id === state.currentAgentId; })) {
            state.currentAgentId =
                (_f = (_e = state.agents[0]) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : (0, session_key_js_1.normalizeAgentId)((_g = result.defaultId) !== null && _g !== void 0 ? _g : state.currentAgentId);
        }
        updateHeader();
        updateFooter();
    };
    var refreshAgents = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.listAgents()];
                case 1:
                    result = _a.sent();
                    applyAgentsResult(result);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    chatLog.addSystem("agents list failed: ".concat(String(err_1)));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var updateAgentFromSessionKey = function (key) {
        var parsed = (0, session_key_js_1.parseAgentSessionKey)(key);
        if (!parsed) {
            return;
        }
        var next = (0, session_key_js_1.normalizeAgentId)(parsed.agentId);
        if (next !== state.currentAgentId) {
            state.currentAgentId = next;
        }
    };
    var refreshSessionInfo = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (refreshSessionInfoPromise) {
                        return [2 /*return*/, refreshSessionInfoPromise];
                    }
                    refreshSessionInfoPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                        var listAgentId, result, entry, err_2;
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                        return __generator(this, function (_o) {
                            switch (_o.label) {
                                case 0:
                                    _o.trys.push([0, 2, , 3]);
                                    listAgentId = state.currentSessionKey === "global" || state.currentSessionKey === "unknown"
                                        ? undefined
                                        : state.currentAgentId;
                                    return [4 /*yield*/, client.listSessions({
                                            includeGlobal: false,
                                            includeUnknown: false,
                                            agentId: listAgentId,
                                        })];
                                case 1:
                                    result = _o.sent();
                                    entry = result.sessions.find(function (row) {
                                        // Exact match
                                        if (row.key === state.currentSessionKey) {
                                            return true;
                                        }
                                        // Also match canonical keys like "agent:default:main" against "main"
                                        var parsed = (0, session_key_js_1.parseAgentSessionKey)(row.key);
                                        return (parsed === null || parsed === void 0 ? void 0 : parsed.rest) === state.currentSessionKey;
                                    });
                                    state.sessionInfo = {
                                        thinkingLevel: entry === null || entry === void 0 ? void 0 : entry.thinkingLevel,
                                        verboseLevel: entry === null || entry === void 0 ? void 0 : entry.verboseLevel,
                                        reasoningLevel: entry === null || entry === void 0 ? void 0 : entry.reasoningLevel,
                                        model: (_c = (_a = entry === null || entry === void 0 ? void 0 : entry.model) !== null && _a !== void 0 ? _a : (_b = result.defaults) === null || _b === void 0 ? void 0 : _b.model) !== null && _c !== void 0 ? _c : undefined,
                                        modelProvider: (_f = (_d = entry === null || entry === void 0 ? void 0 : entry.modelProvider) !== null && _d !== void 0 ? _d : (_e = result.defaults) === null || _e === void 0 ? void 0 : _e.modelProvider) !== null && _f !== void 0 ? _f : undefined,
                                        contextTokens: (_g = entry === null || entry === void 0 ? void 0 : entry.contextTokens) !== null && _g !== void 0 ? _g : (_h = result.defaults) === null || _h === void 0 ? void 0 : _h.contextTokens,
                                        inputTokens: (_j = entry === null || entry === void 0 ? void 0 : entry.inputTokens) !== null && _j !== void 0 ? _j : null,
                                        outputTokens: (_k = entry === null || entry === void 0 ? void 0 : entry.outputTokens) !== null && _k !== void 0 ? _k : null,
                                        totalTokens: (_l = entry === null || entry === void 0 ? void 0 : entry.totalTokens) !== null && _l !== void 0 ? _l : null,
                                        responseUsage: entry === null || entry === void 0 ? void 0 : entry.responseUsage,
                                        updatedAt: (_m = entry === null || entry === void 0 ? void 0 : entry.updatedAt) !== null && _m !== void 0 ? _m : null,
                                        displayName: entry === null || entry === void 0 ? void 0 : entry.displayName,
                                    };
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_2 = _o.sent();
                                    chatLog.addSystem("sessions list failed: ".concat(String(err_2)));
                                    return [3 /*break*/, 3];
                                case 3:
                                    updateAutocompleteProvider();
                                    updateFooter();
                                    tui.requestRender();
                                    return [2 /*return*/];
                            }
                        });
                    }); })();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, refreshSessionInfoPromise];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    refreshSessionInfoPromise = null;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var loadHistory = function () { return __awaiter(_this, void 0, void 0, function () {
        var history_1, record, _i, _a, entry, message, text, text, text, toolCallId, toolName, component, err_3;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.loadHistory({
                            sessionKey: state.currentSessionKey,
                            limit: (_b = opts.historyLimit) !== null && _b !== void 0 ? _b : 200,
                        })];
                case 1:
                    history_1 = _e.sent();
                    record = history_1;
                    state.currentSessionId = typeof record.sessionId === "string" ? record.sessionId : null;
                    state.sessionInfo.thinkingLevel = (_c = record.thinkingLevel) !== null && _c !== void 0 ? _c : state.sessionInfo.thinkingLevel;
                    chatLog.clearAll();
                    chatLog.addSystem("session ".concat(state.currentSessionKey));
                    for (_i = 0, _a = (_d = record.messages) !== null && _d !== void 0 ? _d : []; _i < _a.length; _i++) {
                        entry = _a[_i];
                        if (!entry || typeof entry !== "object") {
                            continue;
                        }
                        message = entry;
                        if ((0, tui_formatters_js_1.isCommandMessage)(message)) {
                            text = (0, tui_formatters_js_1.extractTextFromMessage)(message);
                            if (text) {
                                chatLog.addSystem(text);
                            }
                            continue;
                        }
                        if (message.role === "user") {
                            text = (0, tui_formatters_js_1.extractTextFromMessage)(message);
                            if (text) {
                                chatLog.addUser(text);
                            }
                            continue;
                        }
                        if (message.role === "assistant") {
                            text = (0, tui_formatters_js_1.extractTextFromMessage)(message, {
                                includeThinking: state.showThinking,
                            });
                            if (text) {
                                chatLog.finalizeAssistant(text);
                            }
                            continue;
                        }
                        if (message.role === "toolResult") {
                            toolCallId = (0, tui_formatters_js_1.asString)(message.toolCallId, "");
                            toolName = (0, tui_formatters_js_1.asString)(message.toolName, "tool");
                            component = chatLog.startTool(toolCallId, toolName, {});
                            component.setResult({
                                content: Array.isArray(message.content)
                                    ? message.content
                                    : [],
                                details: typeof message.details === "object" && message.details
                                    ? message.details
                                    : undefined,
                            }, { isError: Boolean(message.isError) });
                        }
                    }
                    state.historyLoaded = true;
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _e.sent();
                    chatLog.addSystem("history failed: ".concat(String(err_3)));
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, refreshSessionInfo()];
                case 4:
                    _e.sent();
                    tui.requestRender();
                    return [2 /*return*/];
            }
        });
    }); };
    var setSession = function (rawKey) { return __awaiter(_this, void 0, void 0, function () {
        var nextKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nextKey = resolveSessionKey(rawKey);
                    updateAgentFromSessionKey(nextKey);
                    state.currentSessionKey = nextKey;
                    state.activeChatRunId = null;
                    state.currentSessionId = null;
                    state.historyLoaded = false;
                    updateHeader();
                    updateFooter();
                    return [4 /*yield*/, loadHistory()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var abortActive = function () { return __awaiter(_this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.activeChatRunId) {
                        chatLog.addSystem("no active run");
                        tui.requestRender();
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.abortChat({
                            sessionKey: state.currentSessionKey,
                            runId: state.activeChatRunId,
                        })];
                case 2:
                    _a.sent();
                    setActivityStatus("aborted");
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    chatLog.addSystem("abort failed: ".concat(String(err_4)));
                    setActivityStatus("abort failed");
                    return [3 /*break*/, 4];
                case 4:
                    tui.requestRender();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        applyAgentsResult: applyAgentsResult,
        refreshAgents: refreshAgents,
        refreshSessionInfo: refreshSessionInfo,
        loadHistory: loadHistory,
        setSession: setSession,
        abortActive: abortActive,
    };
}
