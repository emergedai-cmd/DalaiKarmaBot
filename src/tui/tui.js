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
exports.resolveFinalAssistantText = void 0;
exports.createEditorSubmitHandler = createEditorSubmitHandler;
exports.runTui = runTui;
var pi_tui_1 = require("@mariozechner/pi-tui");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../config/config.js");
var session_key_js_1 = require("../routing/session-key.js");
var commands_js_1 = require("./commands.js");
var chat_log_js_1 = require("./components/chat-log.js");
var custom_editor_js_1 = require("./components/custom-editor.js");
var gateway_chat_js_1 = require("./gateway-chat.js");
var theme_js_1 = require("./theme/theme.js");
var tui_command_handlers_js_1 = require("./tui-command-handlers.js");
var tui_event_handlers_js_1 = require("./tui-event-handlers.js");
var tui_formatters_js_1 = require("./tui-formatters.js");
var tui_local_shell_js_1 = require("./tui-local-shell.js");
var tui_overlays_js_1 = require("./tui-overlays.js");
var tui_session_actions_js_1 = require("./tui-session-actions.js");
var tui_waiting_js_1 = require("./tui-waiting.js");
var tui_formatters_js_2 = require("./tui-formatters.js");
Object.defineProperty(exports, "resolveFinalAssistantText", { enumerable: true, get: function () { return tui_formatters_js_2.resolveFinalAssistantText; } });
function createEditorSubmitHandler(params) {
    return function (text) {
        var raw = text;
        var value = raw.trim();
        params.editor.setText("");
        // Keep previous behavior: ignore empty/whitespace-only submissions.
        if (!value) {
            return;
        }
        // Bash mode: only if the very first character is '!' and it's not just '!'.
        // IMPORTANT: use the raw (untrimmed) text so leading spaces do NOT trigger.
        // Per requirement: a lone '!' should be treated as a normal message.
        if (raw.startsWith("!") && raw !== "!") {
            params.editor.addToHistory(raw);
            void params.handleBangLine(raw);
            return;
        }
        // Enable built-in editor prompt history navigation (up/down).
        params.editor.addToHistory(value);
        if (value.startsWith("/")) {
            void params.handleCommand(value);
            return;
        }
        void params.sendMessage(value);
    };
}
function runTui(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var config, initialSessionInput, sessionScope, sessionMainKey, agentDefaultId, currentAgentId, agents, agentNames, currentSessionKey, initialSessionApplied, currentSessionId, activeChatRunId, historyLoaded, isConnected, wasDisconnected, toolsExpanded, showThinking, deliverDefault, autoMessage, autoMessageSent, sessionInfo, lastCtrlCAt, activityStatus, connectionStatus, statusTimeout, statusTimer, statusStartedAt, lastActivityStatus, state, client, tui, header, statusContainer, footer, chatLog, editor, root, updateAutocompleteProvider, formatSessionKey, formatAgentLabel, resolveSessionKey, updateHeader, busyStates, statusText, statusLoader, formatElapsed, ensureStatusText, ensureStatusLoader, waitingTick, waitingTimer, waitingPhrase, updateBusyStatusMessage, startStatusTimer, stopStatusTimer, startWaitingTimer, stopWaitingTimer, renderStatus, setConnectionStatus, setActivityStatus, updateFooter, _a, openOverlay, closeOverlay, initialSessionAgentId, sessionActions, refreshAgents, refreshSessionInfo, loadHistory, setSession, abortActive, _b, handleChatEvent, handleAgentEvent, _c, handleCommand, sendMessage, openModelSelector, openAgentSelector, openSessionSelector, runLocalShellLine;
        var _this = this;
        var _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            config = (0, config_js_1.loadConfig)();
            initialSessionInput = ((_d = opts.session) !== null && _d !== void 0 ? _d : "").trim();
            sessionScope = ((_f = (_e = config.session) === null || _e === void 0 ? void 0 : _e.scope) !== null && _f !== void 0 ? _f : "per-sender");
            sessionMainKey = (0, session_key_js_1.normalizeMainKey)((_g = config.session) === null || _g === void 0 ? void 0 : _g.mainKey);
            agentDefaultId = (0, agent_scope_js_1.resolveDefaultAgentId)(config);
            currentAgentId = agentDefaultId;
            agents = [];
            agentNames = new Map();
            currentSessionKey = "";
            initialSessionApplied = false;
            currentSessionId = null;
            activeChatRunId = null;
            historyLoaded = false;
            isConnected = false;
            wasDisconnected = false;
            toolsExpanded = false;
            showThinking = false;
            deliverDefault = (_h = opts.deliver) !== null && _h !== void 0 ? _h : false;
            autoMessage = (_j = opts.message) === null || _j === void 0 ? void 0 : _j.trim();
            autoMessageSent = false;
            sessionInfo = {};
            lastCtrlCAt = 0;
            activityStatus = "idle";
            connectionStatus = "connecting";
            statusTimeout = null;
            statusTimer = null;
            statusStartedAt = null;
            lastActivityStatus = activityStatus;
            state = {
                get agentDefaultId() {
                    return agentDefaultId;
                },
                set agentDefaultId(value) {
                    agentDefaultId = value;
                },
                get sessionMainKey() {
                    return sessionMainKey;
                },
                set sessionMainKey(value) {
                    sessionMainKey = value;
                },
                get sessionScope() {
                    return sessionScope;
                },
                set sessionScope(value) {
                    sessionScope = value;
                },
                get agents() {
                    return agents;
                },
                set agents(value) {
                    agents = value;
                },
                get currentAgentId() {
                    return currentAgentId;
                },
                set currentAgentId(value) {
                    currentAgentId = value;
                },
                get currentSessionKey() {
                    return currentSessionKey;
                },
                set currentSessionKey(value) {
                    currentSessionKey = value;
                },
                get currentSessionId() {
                    return currentSessionId;
                },
                set currentSessionId(value) {
                    currentSessionId = value;
                },
                get activeChatRunId() {
                    return activeChatRunId;
                },
                set activeChatRunId(value) {
                    activeChatRunId = value;
                },
                get historyLoaded() {
                    return historyLoaded;
                },
                set historyLoaded(value) {
                    historyLoaded = value;
                },
                get sessionInfo() {
                    return sessionInfo;
                },
                set sessionInfo(value) {
                    sessionInfo = value;
                },
                get initialSessionApplied() {
                    return initialSessionApplied;
                },
                set initialSessionApplied(value) {
                    initialSessionApplied = value;
                },
                get isConnected() {
                    return isConnected;
                },
                set isConnected(value) {
                    isConnected = value;
                },
                get autoMessageSent() {
                    return autoMessageSent;
                },
                set autoMessageSent(value) {
                    autoMessageSent = value;
                },
                get toolsExpanded() {
                    return toolsExpanded;
                },
                set toolsExpanded(value) {
                    toolsExpanded = value;
                },
                get showThinking() {
                    return showThinking;
                },
                set showThinking(value) {
                    showThinking = value;
                },
                get connectionStatus() {
                    return connectionStatus;
                },
                set connectionStatus(value) {
                    connectionStatus = value;
                },
                get activityStatus() {
                    return activityStatus;
                },
                set activityStatus(value) {
                    activityStatus = value;
                },
                get statusTimeout() {
                    return statusTimeout;
                },
                set statusTimeout(value) {
                    statusTimeout = value;
                },
                get lastCtrlCAt() {
                    return lastCtrlCAt;
                },
                set lastCtrlCAt(value) {
                    lastCtrlCAt = value;
                },
            };
            client = new gateway_chat_js_1.GatewayChatClient({
                url: opts.url,
                token: opts.token,
                password: opts.password,
            });
            tui = new pi_tui_1.TUI(new pi_tui_1.ProcessTerminal());
            header = new pi_tui_1.Text("", 1, 0);
            statusContainer = new pi_tui_1.Container();
            footer = new pi_tui_1.Text("", 1, 0);
            chatLog = new chat_log_js_1.ChatLog();
            editor = new custom_editor_js_1.CustomEditor(tui, theme_js_1.editorTheme);
            root = new pi_tui_1.Container();
            root.addChild(header);
            root.addChild(chatLog);
            root.addChild(statusContainer);
            root.addChild(footer);
            root.addChild(editor);
            updateAutocompleteProvider = function () {
                editor.setAutocompleteProvider(new pi_tui_1.CombinedAutocompleteProvider((0, commands_js_1.getSlashCommands)({
                    cfg: config,
                    provider: sessionInfo.modelProvider,
                    model: sessionInfo.model,
                }), process.cwd()));
            };
            tui.addChild(root);
            tui.setFocus(editor);
            formatSessionKey = function (key) {
                var _a;
                if (key === "global" || key === "unknown") {
                    return key;
                }
                var parsed = (0, session_key_js_1.parseAgentSessionKey)(key);
                return (_a = parsed === null || parsed === void 0 ? void 0 : parsed.rest) !== null && _a !== void 0 ? _a : key;
            };
            formatAgentLabel = function (id) {
                var name = agentNames.get(id);
                return name ? "".concat(id, " (").concat(name, ")") : id;
            };
            resolveSessionKey = function (raw) {
                var trimmed = (raw !== null && raw !== void 0 ? raw : "").trim();
                if (sessionScope === "global") {
                    return "global";
                }
                if (!trimmed) {
                    return (0, session_key_js_1.buildAgentMainSessionKey)({
                        agentId: currentAgentId,
                        mainKey: sessionMainKey,
                    });
                }
                if (trimmed === "global" || trimmed === "unknown") {
                    return trimmed;
                }
                if (trimmed.startsWith("agent:")) {
                    return trimmed;
                }
                return "agent:".concat(currentAgentId, ":").concat(trimmed);
            };
            currentSessionKey = resolveSessionKey(initialSessionInput);
            updateHeader = function () {
                var sessionLabel = formatSessionKey(currentSessionKey);
                var agentLabel = formatAgentLabel(currentAgentId);
                header.setText(theme_js_1.theme.header("openclaw tui - ".concat(client.connection.url, " - agent ").concat(agentLabel, " - session ").concat(sessionLabel)));
            };
            busyStates = new Set(["sending", "waiting", "streaming", "running"]);
            statusText = null;
            statusLoader = null;
            formatElapsed = function (startMs) {
                var totalSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
                if (totalSeconds < 60) {
                    return "".concat(totalSeconds, "s");
                }
                var minutes = Math.floor(totalSeconds / 60);
                var seconds = totalSeconds % 60;
                return "".concat(minutes, "m ").concat(seconds, "s");
            };
            ensureStatusText = function () {
                if (statusText) {
                    return;
                }
                statusContainer.clear();
                statusLoader === null || statusLoader === void 0 ? void 0 : statusLoader.stop();
                statusLoader = null;
                statusText = new pi_tui_1.Text("", 1, 0);
                statusContainer.addChild(statusText);
            };
            ensureStatusLoader = function () {
                if (statusLoader) {
                    return;
                }
                statusContainer.clear();
                statusText = null;
                statusLoader = new pi_tui_1.Loader(tui, function (spinner) { return theme_js_1.theme.accent(spinner); }, function (text) { return theme_js_1.theme.bold(theme_js_1.theme.accentSoft(text)); }, "");
                statusContainer.addChild(statusLoader);
            };
            waitingTick = 0;
            waitingTimer = null;
            waitingPhrase = null;
            updateBusyStatusMessage = function () {
                if (!statusLoader || !statusStartedAt) {
                    return;
                }
                var elapsed = formatElapsed(statusStartedAt);
                if (activityStatus === "waiting") {
                    waitingTick++;
                    statusLoader.setMessage((0, tui_waiting_js_1.buildWaitingStatusMessage)({
                        theme: theme_js_1.theme,
                        tick: waitingTick,
                        elapsed: elapsed,
                        connectionStatus: connectionStatus,
                        phrases: waitingPhrase ? [waitingPhrase] : undefined,
                    }));
                    return;
                }
                statusLoader.setMessage("".concat(activityStatus, " \u2022 ").concat(elapsed, " | ").concat(connectionStatus));
            };
            startStatusTimer = function () {
                if (statusTimer) {
                    return;
                }
                statusTimer = setInterval(function () {
                    if (!busyStates.has(activityStatus)) {
                        return;
                    }
                    updateBusyStatusMessage();
                }, 1000);
            };
            stopStatusTimer = function () {
                if (!statusTimer) {
                    return;
                }
                clearInterval(statusTimer);
                statusTimer = null;
            };
            startWaitingTimer = function () {
                var _a, _b;
                if (waitingTimer) {
                    return;
                }
                // Pick a phrase once per waiting session.
                if (!waitingPhrase) {
                    var idx = Math.floor(Math.random() * tui_waiting_js_1.defaultWaitingPhrases.length);
                    waitingPhrase = (_b = (_a = tui_waiting_js_1.defaultWaitingPhrases[idx]) !== null && _a !== void 0 ? _a : tui_waiting_js_1.defaultWaitingPhrases[0]) !== null && _b !== void 0 ? _b : "waiting";
                }
                waitingTick = 0;
                waitingTimer = setInterval(function () {
                    if (activityStatus !== "waiting") {
                        return;
                    }
                    updateBusyStatusMessage();
                }, 120);
            };
            stopWaitingTimer = function () {
                if (!waitingTimer) {
                    return;
                }
                clearInterval(waitingTimer);
                waitingTimer = null;
                waitingPhrase = null;
            };
            renderStatus = function () {
                var isBusy = busyStates.has(activityStatus);
                if (isBusy) {
                    if (!statusStartedAt || lastActivityStatus !== activityStatus) {
                        statusStartedAt = Date.now();
                    }
                    ensureStatusLoader();
                    if (activityStatus === "waiting") {
                        stopStatusTimer();
                        startWaitingTimer();
                    }
                    else {
                        stopWaitingTimer();
                        startStatusTimer();
                    }
                    updateBusyStatusMessage();
                }
                else {
                    statusStartedAt = null;
                    stopStatusTimer();
                    stopWaitingTimer();
                    statusLoader === null || statusLoader === void 0 ? void 0 : statusLoader.stop();
                    statusLoader = null;
                    ensureStatusText();
                    var text = activityStatus ? "".concat(connectionStatus, " | ").concat(activityStatus) : connectionStatus;
                    statusText === null || statusText === void 0 ? void 0 : statusText.setText(theme_js_1.theme.dim(text));
                }
                lastActivityStatus = activityStatus;
            };
            setConnectionStatus = function (text, ttlMs) {
                connectionStatus = text;
                renderStatus();
                if (statusTimeout) {
                    clearTimeout(statusTimeout);
                }
                if (ttlMs && ttlMs > 0) {
                    statusTimeout = setTimeout(function () {
                        connectionStatus = isConnected ? "connected" : "disconnected";
                        renderStatus();
                    }, ttlMs);
                }
            };
            setActivityStatus = function (text) {
                activityStatus = text;
                renderStatus();
            };
            updateFooter = function () {
                var _a, _b, _c, _d, _e;
                var sessionKeyLabel = formatSessionKey(currentSessionKey);
                var sessionLabel = sessionInfo.displayName
                    ? "".concat(sessionKeyLabel, " (").concat(sessionInfo.displayName, ")")
                    : sessionKeyLabel;
                var agentLabel = formatAgentLabel(currentAgentId);
                var modelLabel = sessionInfo.model
                    ? sessionInfo.modelProvider
                        ? "".concat(sessionInfo.modelProvider, "/").concat(sessionInfo.model)
                        : sessionInfo.model
                    : "unknown";
                var tokens = (0, tui_formatters_js_1.formatTokens)((_a = sessionInfo.totalTokens) !== null && _a !== void 0 ? _a : null, (_b = sessionInfo.contextTokens) !== null && _b !== void 0 ? _b : null);
                var think = (_c = sessionInfo.thinkingLevel) !== null && _c !== void 0 ? _c : "off";
                var verbose = (_d = sessionInfo.verboseLevel) !== null && _d !== void 0 ? _d : "off";
                var reasoning = (_e = sessionInfo.reasoningLevel) !== null && _e !== void 0 ? _e : "off";
                var reasoningLabel = reasoning === "on" ? "reasoning" : reasoning === "stream" ? "reasoning:stream" : null;
                var footerParts = [
                    "agent ".concat(agentLabel),
                    "session ".concat(sessionLabel),
                    modelLabel,
                    think !== "off" ? "think ".concat(think) : null,
                    verbose !== "off" ? "verbose ".concat(verbose) : null,
                    reasoningLabel,
                    tokens,
                ].filter(Boolean);
                footer.setText(theme_js_1.theme.dim(footerParts.join(" | ")));
            };
            _a = (0, tui_overlays_js_1.createOverlayHandlers)(tui, editor), openOverlay = _a.openOverlay, closeOverlay = _a.closeOverlay;
            initialSessionAgentId = (function () {
                if (!initialSessionInput) {
                    return null;
                }
                var parsed = (0, session_key_js_1.parseAgentSessionKey)(initialSessionInput);
                return parsed ? (0, session_key_js_1.normalizeAgentId)(parsed.agentId) : null;
            })();
            sessionActions = (0, tui_session_actions_js_1.createSessionActions)({
                client: client,
                chatLog: chatLog,
                tui: tui,
                opts: opts,
                state: state,
                agentNames: agentNames,
                initialSessionInput: initialSessionInput,
                initialSessionAgentId: initialSessionAgentId,
                resolveSessionKey: resolveSessionKey,
                updateHeader: updateHeader,
                updateFooter: updateFooter,
                updateAutocompleteProvider: updateAutocompleteProvider,
                setActivityStatus: setActivityStatus,
            });
            refreshAgents = sessionActions.refreshAgents, refreshSessionInfo = sessionActions.refreshSessionInfo, loadHistory = sessionActions.loadHistory, setSession = sessionActions.setSession, abortActive = sessionActions.abortActive;
            _b = (0, tui_event_handlers_js_1.createEventHandlers)({
                chatLog: chatLog,
                tui: tui,
                state: state,
                setActivityStatus: setActivityStatus,
                refreshSessionInfo: refreshSessionInfo,
            }), handleChatEvent = _b.handleChatEvent, handleAgentEvent = _b.handleAgentEvent;
            _c = (0, tui_command_handlers_js_1.createCommandHandlers)({
                client: client,
                chatLog: chatLog,
                tui: tui,
                opts: opts,
                state: state,
                deliverDefault: deliverDefault,
                openOverlay: openOverlay,
                closeOverlay: closeOverlay,
                refreshSessionInfo: refreshSessionInfo,
                loadHistory: loadHistory,
                setSession: setSession,
                refreshAgents: refreshAgents,
                abortActive: abortActive,
                setActivityStatus: setActivityStatus,
                formatSessionKey: formatSessionKey,
            }), handleCommand = _c.handleCommand, sendMessage = _c.sendMessage, openModelSelector = _c.openModelSelector, openAgentSelector = _c.openAgentSelector, openSessionSelector = _c.openSessionSelector;
            runLocalShellLine = (0, tui_local_shell_js_1.createLocalShellRunner)({
                chatLog: chatLog,
                tui: tui,
                openOverlay: openOverlay,
                closeOverlay: closeOverlay,
            }).runLocalShellLine;
            updateAutocompleteProvider();
            editor.onSubmit = createEditorSubmitHandler({
                editor: editor,
                handleCommand: handleCommand,
                sendMessage: sendMessage,
                handleBangLine: runLocalShellLine,
            });
            editor.onEscape = function () {
                void abortActive();
            };
            editor.onCtrlC = function () {
                var now = Date.now();
                if (editor.getText().trim().length > 0) {
                    editor.setText("");
                    setActivityStatus("cleared input");
                    tui.requestRender();
                    return;
                }
                if (now - lastCtrlCAt < 1000) {
                    client.stop();
                    tui.stop();
                    process.exit(0);
                }
                lastCtrlCAt = now;
                setActivityStatus("press ctrl+c again to exit");
                tui.requestRender();
            };
            editor.onCtrlD = function () {
                client.stop();
                tui.stop();
                process.exit(0);
            };
            editor.onCtrlO = function () {
                toolsExpanded = !toolsExpanded;
                chatLog.setToolsExpanded(toolsExpanded);
                setActivityStatus(toolsExpanded ? "tools expanded" : "tools collapsed");
                tui.requestRender();
            };
            editor.onCtrlL = function () {
                void openModelSelector();
            };
            editor.onCtrlG = function () {
                void openAgentSelector();
            };
            editor.onCtrlP = function () {
                void openSessionSelector();
            };
            editor.onCtrlT = function () {
                showThinking = !showThinking;
                void loadHistory();
            };
            client.onEvent = function (evt) {
                if (evt.event === "chat") {
                    handleChatEvent(evt.payload);
                }
                if (evt.event === "agent") {
                    handleAgentEvent(evt.payload);
                }
            };
            client.onConnected = function () {
                isConnected = true;
                var reconnected = wasDisconnected;
                wasDisconnected = false;
                setConnectionStatus("connected");
                void (function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, refreshAgents()];
                            case 1:
                                _a.sent();
                                updateHeader();
                                return [4 /*yield*/, loadHistory()];
                            case 2:
                                _a.sent();
                                setConnectionStatus(reconnected ? "gateway reconnected" : "gateway connected", 4000);
                                tui.requestRender();
                                if (!(!autoMessageSent && autoMessage)) return [3 /*break*/, 4];
                                autoMessageSent = true;
                                return [4 /*yield*/, sendMessage(autoMessage)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4:
                                updateFooter();
                                tui.requestRender();
                                return [2 /*return*/];
                        }
                    });
                }); })();
            };
            client.onDisconnected = function (reason) {
                isConnected = false;
                wasDisconnected = true;
                historyLoaded = false;
                var reasonLabel = (reason === null || reason === void 0 ? void 0 : reason.trim()) ? reason.trim() : "closed";
                setConnectionStatus("gateway disconnected: ".concat(reasonLabel), 5000);
                setActivityStatus("idle");
                updateFooter();
                tui.requestRender();
            };
            client.onGap = function (info) {
                setConnectionStatus("event gap: expected ".concat(info.expected, ", got ").concat(info.received), 5000);
                tui.requestRender();
            };
            updateHeader();
            setConnectionStatus("connecting");
            updateFooter();
            tui.start();
            client.start();
            return [2 /*return*/];
        });
    });
}
