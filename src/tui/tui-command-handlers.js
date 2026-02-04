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
exports.createCommandHandlers = createCommandHandlers;
var thinking_js_1 = require("../auto-reply/thinking.js");
var session_key_js_1 = require("../routing/session-key.js");
var time_format_js_1 = require("../utils/time-format.js");
var commands_js_1 = require("./commands.js");
var selectors_js_1 = require("./components/selectors.js");
var tui_status_summary_js_1 = require("./tui-status-summary.js");
function createCommandHandlers(context) {
    var _this = this;
    var client = context.client, chatLog = context.chatLog, tui = context.tui, opts = context.opts, state = context.state, deliverDefault = context.deliverDefault, openOverlay = context.openOverlay, closeOverlay = context.closeOverlay, refreshSessionInfo = context.refreshSessionInfo, loadHistory = context.loadHistory, setSession = context.setSession, refreshAgents = context.refreshAgents, abortActive = context.abortActive, setActivityStatus = context.setActivityStatus, formatSessionKey = context.formatSessionKey;
    var setAgent = function (id) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state.currentAgentId = (0, session_key_js_1.normalizeAgentId)(id);
                    return [4 /*yield*/, setSession("")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var openModelSelector = function () { return __awaiter(_this, void 0, void 0, function () {
        var models, items, selector, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.listModels()];
                case 1:
                    models = _a.sent();
                    if (models.length === 0) {
                        chatLog.addSystem("no models available");
                        tui.requestRender();
                        return [2 /*return*/];
                    }
                    items = models.map(function (model) { return ({
                        value: "".concat(model.provider, "/").concat(model.id),
                        label: "".concat(model.provider, "/").concat(model.id),
                        description: model.name && model.name !== model.id ? model.name : "",
                    }); });
                    selector = (0, selectors_js_1.createSearchableSelectList)(items, 9);
                    selector.onSelect = function (item) {
                        void (function () { return __awaiter(_this, void 0, void 0, function () {
                            var err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, client.patchSession({
                                                key: state.currentSessionKey,
                                                model: item.value,
                                            })];
                                    case 1:
                                        _a.sent();
                                        chatLog.addSystem("model set to ".concat(item.value));
                                        return [4 /*yield*/, refreshSessionInfo()];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_2 = _a.sent();
                                        chatLog.addSystem("model set failed: ".concat(String(err_2)));
                                        return [3 /*break*/, 4];
                                    case 4:
                                        closeOverlay();
                                        tui.requestRender();
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                    };
                    selector.onCancel = function () {
                        closeOverlay();
                        tui.requestRender();
                    };
                    openOverlay(selector);
                    tui.requestRender();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    chatLog.addSystem("model list failed: ".concat(String(err_1)));
                    tui.requestRender();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var openAgentSelector = function () { return __awaiter(_this, void 0, void 0, function () {
        var items, selector;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, refreshAgents()];
                case 1:
                    _a.sent();
                    if (state.agents.length === 0) {
                        chatLog.addSystem("no agents found");
                        tui.requestRender();
                        return [2 /*return*/];
                    }
                    items = state.agents.map(function (agent) { return ({
                        value: agent.id,
                        label: agent.name ? "".concat(agent.id, " (").concat(agent.name, ")") : agent.id,
                        description: agent.id === state.agentDefaultId ? "default" : "",
                    }); });
                    selector = (0, selectors_js_1.createSearchableSelectList)(items, 9);
                    selector.onSelect = function (item) {
                        void (function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        closeOverlay();
                                        return [4 /*yield*/, setAgent(item.value)];
                                    case 1:
                                        _a.sent();
                                        tui.requestRender();
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                    };
                    selector.onCancel = function () {
                        closeOverlay();
                        tui.requestRender();
                    };
                    openOverlay(selector);
                    tui.requestRender();
                    return [2 /*return*/];
            }
        });
    }); };
    var openSessionSelector = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, items, selector, err_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.listSessions({
                            includeGlobal: false,
                            includeUnknown: false,
                            includeDerivedTitles: true,
                            includeLastMessage: true,
                            agentId: state.currentAgentId,
                        })];
                case 1:
                    result = _a.sent();
                    items = result.sessions.map(function (session) {
                        var _a, _b;
                        var title = (_a = session.derivedTitle) !== null && _a !== void 0 ? _a : session.displayName;
                        var formattedKey = formatSessionKey(session.key);
                        // Avoid redundant "title (key)" when title matches key
                        var label = title && title !== formattedKey ? "".concat(title, " (").concat(formattedKey, ")") : formattedKey;
                        // Build description: time + message preview
                        var timePart = session.updatedAt ? (0, time_format_js_1.formatRelativeTime)(session.updatedAt) : "";
                        var preview = (_b = session.lastMessagePreview) === null || _b === void 0 ? void 0 : _b.replace(/\s+/g, " ").trim();
                        var description = timePart && preview ? "".concat(timePart, " \u00B7 ").concat(preview) : (preview !== null && preview !== void 0 ? preview : timePart);
                        return {
                            value: session.key,
                            label: label,
                            description: description,
                            searchText: [
                                session.displayName,
                                session.label,
                                session.subject,
                                session.sessionId,
                                session.key,
                                session.lastMessagePreview,
                            ]
                                .filter(Boolean)
                                .join(" "),
                        };
                    });
                    selector = (0, selectors_js_1.createFilterableSelectList)(items, 9);
                    selector.onSelect = function (item) {
                        void (function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        closeOverlay();
                                        return [4 /*yield*/, setSession(item.value)];
                                    case 1:
                                        _a.sent();
                                        tui.requestRender();
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                    };
                    selector.onCancel = function () {
                        closeOverlay();
                        tui.requestRender();
                    };
                    openOverlay(selector);
                    tui.requestRender();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    chatLog.addSystem("sessions list failed: ".concat(String(err_3)));
                    tui.requestRender();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var openSettings = function () {
        var items = [
            {
                id: "tools",
                label: "Tool output",
                currentValue: state.toolsExpanded ? "expanded" : "collapsed",
                values: ["collapsed", "expanded"],
            },
            {
                id: "thinking",
                label: "Show thinking",
                currentValue: state.showThinking ? "on" : "off",
                values: ["off", "on"],
            },
        ];
        var settings = (0, selectors_js_1.createSettingsList)(items, function (id, value) {
            if (id === "tools") {
                state.toolsExpanded = value === "expanded";
                chatLog.setToolsExpanded(state.toolsExpanded);
            }
            if (id === "thinking") {
                state.showThinking = value === "on";
                void loadHistory();
            }
            tui.requestRender();
        }, function () {
            closeOverlay();
            tui.requestRender();
        });
        openOverlay(settings);
        tui.requestRender();
    };
    var handleCommand = function (raw) { return __awaiter(_this, void 0, void 0, function () {
        var _a, name, args, _b, status_1, lines, _i, lines_1, line, err_4, err_5, levels, err_6, err_7, err_8, normalized, currentRaw, current, next, err_9, err_10, err_11, err_12;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, commands_js_1.parseCommand)(raw), name = _a.name, args = _a.args;
                    if (!name) {
                        return [2 /*return*/];
                    }
                    _b = name;
                    switch (_b) {
                        case "help": return [3 /*break*/, 1];
                        case "status": return [3 /*break*/, 2];
                        case "agent": return [3 /*break*/, 6];
                        case "agents": return [3 /*break*/, 11];
                        case "session": return [3 /*break*/, 13];
                        case "sessions": return [3 /*break*/, 18];
                        case "model": return [3 /*break*/, 20];
                        case "models": return [3 /*break*/, 27];
                        case "think": return [3 /*break*/, 29];
                        case "verbose": return [3 /*break*/, 35];
                        case "reasoning": return [3 /*break*/, 41];
                        case "usage": return [3 /*break*/, 47];
                        case "elevated": return [3 /*break*/, 53];
                        case "activation": return [3 /*break*/, 59];
                        case "new": return [3 /*break*/, 65];
                        case "reset": return [3 /*break*/, 65];
                        case "abort": return [3 /*break*/, 70];
                        case "settings": return [3 /*break*/, 72];
                        case "exit": return [3 /*break*/, 73];
                        case "quit": return [3 /*break*/, 73];
                    }
                    return [3 /*break*/, 74];
                case 1:
                    chatLog.addSystem((0, commands_js_1.helpText)({
                        provider: state.sessionInfo.modelProvider,
                        model: state.sessionInfo.model,
                    }));
                    return [3 /*break*/, 76];
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, client.getStatus()];
                case 3:
                    status_1 = _c.sent();
                    if (typeof status_1 === "string") {
                        chatLog.addSystem(status_1);
                        return [3 /*break*/, 76];
                    }
                    if (status_1 && typeof status_1 === "object") {
                        lines = (0, tui_status_summary_js_1.formatStatusSummary)(status_1);
                        for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                            line = lines_1[_i];
                            chatLog.addSystem(line);
                        }
                        return [3 /*break*/, 76];
                    }
                    chatLog.addSystem("status: unknown response");
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _c.sent();
                    chatLog.addSystem("status failed: ".concat(String(err_4)));
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 76];
                case 6:
                    if (!!args) return [3 /*break*/, 8];
                    return [4 /*yield*/, openAgentSelector()];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, setAgent(args)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10: return [3 /*break*/, 76];
                case 11: return [4 /*yield*/, openAgentSelector()];
                case 12:
                    _c.sent();
                    return [3 /*break*/, 76];
                case 13:
                    if (!!args) return [3 /*break*/, 15];
                    return [4 /*yield*/, openSessionSelector()];
                case 14:
                    _c.sent();
                    return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, setSession(args)];
                case 16:
                    _c.sent();
                    _c.label = 17;
                case 17: return [3 /*break*/, 76];
                case 18: return [4 /*yield*/, openSessionSelector()];
                case 19:
                    _c.sent();
                    return [3 /*break*/, 76];
                case 20:
                    if (!!args) return [3 /*break*/, 22];
                    return [4 /*yield*/, openModelSelector()];
                case 21:
                    _c.sent();
                    return [3 /*break*/, 26];
                case 22:
                    _c.trys.push([22, 25, , 26]);
                    return [4 /*yield*/, client.patchSession({
                            key: state.currentSessionKey,
                            model: args,
                        })];
                case 23:
                    _c.sent();
                    chatLog.addSystem("model set to ".concat(args));
                    return [4 /*yield*/, refreshSessionInfo()];
                case 24:
                    _c.sent();
                    return [3 /*break*/, 26];
                case 25:
                    err_5 = _c.sent();
                    chatLog.addSystem("model set failed: ".concat(String(err_5)));
                    return [3 /*break*/, 26];
                case 26: return [3 /*break*/, 76];
                case 27: return [4 /*yield*/, openModelSelector()];
                case 28:
                    _c.sent();
                    return [3 /*break*/, 76];
                case 29:
                    if (!args) {
                        levels = (0, thinking_js_1.formatThinkingLevels)(state.sessionInfo.modelProvider, state.sessionInfo.model, "|");
                        chatLog.addSystem("usage: /think <".concat(levels, ">"));
                        return [3 /*break*/, 76];
                    }
                    _c.label = 30;
                case 30:
                    _c.trys.push([30, 33, , 34]);
                    return [4 /*yield*/, client.patchSession({
                            key: state.currentSessionKey,
                            thinkingLevel: args,
                        })];
                case 31:
                    _c.sent();
                    chatLog.addSystem("thinking set to ".concat(args));
                    return [4 /*yield*/, refreshSessionInfo()];
                case 32:
                    _c.sent();
                    return [3 /*break*/, 34];
                case 33:
                    err_6 = _c.sent();
                    chatLog.addSystem("think failed: ".concat(String(err_6)));
                    return [3 /*break*/, 34];
                case 34: return [3 /*break*/, 76];
                case 35:
                    if (!args) {
                        chatLog.addSystem("usage: /verbose <on|off>");
                        return [3 /*break*/, 76];
                    }
                    _c.label = 36;
                case 36:
                    _c.trys.push([36, 39, , 40]);
                    return [4 /*yield*/, client.patchSession({
                            key: state.currentSessionKey,
                            verboseLevel: args,
                        })];
                case 37:
                    _c.sent();
                    chatLog.addSystem("verbose set to ".concat(args));
                    return [4 /*yield*/, refreshSessionInfo()];
                case 38:
                    _c.sent();
                    return [3 /*break*/, 40];
                case 39:
                    err_7 = _c.sent();
                    chatLog.addSystem("verbose failed: ".concat(String(err_7)));
                    return [3 /*break*/, 40];
                case 40: return [3 /*break*/, 76];
                case 41:
                    if (!args) {
                        chatLog.addSystem("usage: /reasoning <on|off>");
                        return [3 /*break*/, 76];
                    }
                    _c.label = 42;
                case 42:
                    _c.trys.push([42, 45, , 46]);
                    return [4 /*yield*/, client.patchSession({
                            key: state.currentSessionKey,
                            reasoningLevel: args,
                        })];
                case 43:
                    _c.sent();
                    chatLog.addSystem("reasoning set to ".concat(args));
                    return [4 /*yield*/, refreshSessionInfo()];
                case 44:
                    _c.sent();
                    return [3 /*break*/, 46];
                case 45:
                    err_8 = _c.sent();
                    chatLog.addSystem("reasoning failed: ".concat(String(err_8)));
                    return [3 /*break*/, 46];
                case 46: return [3 /*break*/, 76];
                case 47:
                    normalized = args ? (0, thinking_js_1.normalizeUsageDisplay)(args) : undefined;
                    if (args && !normalized) {
                        chatLog.addSystem("usage: /usage <off|tokens|full>");
                        return [3 /*break*/, 76];
                    }
                    currentRaw = state.sessionInfo.responseUsage;
                    current = (0, thinking_js_1.resolveResponseUsageMode)(currentRaw);
                    next = normalized !== null && normalized !== void 0 ? normalized : (current === "off" ? "tokens" : current === "tokens" ? "full" : "off");
                    _c.label = 48;
                case 48:
                    _c.trys.push([48, 51, , 52]);
                    return [4 /*yield*/, client.patchSession({
                            key: state.currentSessionKey,
                            responseUsage: next === "off" ? null : next,
                        })];
                case 49:
                    _c.sent();
                    chatLog.addSystem("usage footer: ".concat(next));
                    return [4 /*yield*/, refreshSessionInfo()];
                case 50:
                    _c.sent();
                    return [3 /*break*/, 52];
                case 51:
                    err_9 = _c.sent();
                    chatLog.addSystem("usage failed: ".concat(String(err_9)));
                    return [3 /*break*/, 52];
                case 52: return [3 /*break*/, 76];
                case 53:
                    if (!args) {
                        chatLog.addSystem("usage: /elevated <on|off|ask|full>");
                        return [3 /*break*/, 76];
                    }
                    if (!["on", "off", "ask", "full"].includes(args)) {
                        chatLog.addSystem("usage: /elevated <on|off|ask|full>");
                        return [3 /*break*/, 76];
                    }
                    _c.label = 54;
                case 54:
                    _c.trys.push([54, 57, , 58]);
                    return [4 /*yield*/, client.patchSession({
                            key: state.currentSessionKey,
                            elevatedLevel: args,
                        })];
                case 55:
                    _c.sent();
                    chatLog.addSystem("elevated set to ".concat(args));
                    return [4 /*yield*/, refreshSessionInfo()];
                case 56:
                    _c.sent();
                    return [3 /*break*/, 58];
                case 57:
                    err_10 = _c.sent();
                    chatLog.addSystem("elevated failed: ".concat(String(err_10)));
                    return [3 /*break*/, 58];
                case 58: return [3 /*break*/, 76];
                case 59:
                    if (!args) {
                        chatLog.addSystem("usage: /activation <mention|always>");
                        return [3 /*break*/, 76];
                    }
                    _c.label = 60;
                case 60:
                    _c.trys.push([60, 63, , 64]);
                    return [4 /*yield*/, client.patchSession({
                            key: state.currentSessionKey,
                            groupActivation: args === "always" ? "always" : "mention",
                        })];
                case 61:
                    _c.sent();
                    chatLog.addSystem("activation set to ".concat(args));
                    return [4 /*yield*/, refreshSessionInfo()];
                case 62:
                    _c.sent();
                    return [3 /*break*/, 64];
                case 63:
                    err_11 = _c.sent();
                    chatLog.addSystem("activation failed: ".concat(String(err_11)));
                    return [3 /*break*/, 64];
                case 64: return [3 /*break*/, 76];
                case 65:
                    _c.trys.push([65, 68, , 69]);
                    // Clear token counts immediately to avoid stale display (#1523)
                    state.sessionInfo.inputTokens = null;
                    state.sessionInfo.outputTokens = null;
                    state.sessionInfo.totalTokens = null;
                    tui.requestRender();
                    return [4 /*yield*/, client.resetSession(state.currentSessionKey)];
                case 66:
                    _c.sent();
                    chatLog.addSystem("session ".concat(state.currentSessionKey, " reset"));
                    return [4 /*yield*/, loadHistory()];
                case 67:
                    _c.sent();
                    return [3 /*break*/, 69];
                case 68:
                    err_12 = _c.sent();
                    chatLog.addSystem("reset failed: ".concat(String(err_12)));
                    return [3 /*break*/, 69];
                case 69: return [3 /*break*/, 76];
                case 70: return [4 /*yield*/, abortActive()];
                case 71:
                    _c.sent();
                    return [3 /*break*/, 76];
                case 72:
                    openSettings();
                    return [3 /*break*/, 76];
                case 73:
                    client.stop();
                    tui.stop();
                    process.exit(0);
                    return [3 /*break*/, 76];
                case 74: return [4 /*yield*/, sendMessage(raw)];
                case 75:
                    _c.sent();
                    return [3 /*break*/, 76];
                case 76:
                    tui.requestRender();
                    return [2 /*return*/];
            }
        });
    }); };
    var sendMessage = function (text) { return __awaiter(_this, void 0, void 0, function () {
        var runId, err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    chatLog.addUser(text);
                    tui.requestRender();
                    setActivityStatus("sending");
                    return [4 /*yield*/, client.sendChat({
                            sessionKey: state.currentSessionKey,
                            message: text,
                            thinking: opts.thinking,
                            deliver: deliverDefault,
                            timeoutMs: opts.timeoutMs,
                        })];
                case 1:
                    runId = (_a.sent()).runId;
                    state.activeChatRunId = runId;
                    setActivityStatus("waiting");
                    return [3 /*break*/, 3];
                case 2:
                    err_13 = _a.sent();
                    chatLog.addSystem("send failed: ".concat(String(err_13)));
                    setActivityStatus("error");
                    return [3 /*break*/, 3];
                case 3:
                    tui.requestRender();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        handleCommand: handleCommand,
        sendMessage: sendMessage,
        openModelSelector: openModelSelector,
        openAgentSelector: openAgentSelector,
        openSessionSelector: openSessionSelector,
        openSettings: openSettings,
        setAgent: setAgent,
    };
}
