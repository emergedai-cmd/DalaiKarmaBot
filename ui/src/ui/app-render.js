"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderApp = renderApp;
var lit_1 = require("lit");
var session_key_js_1 = require("../../../src/routing/session-key.js");
var app_chat_1 = require("./app-chat");
var app_render_helpers_1 = require("./app-render.helpers");
var channels_1 = require("./controllers/channels");
var chat_1 = require("./controllers/chat");
var config_1 = require("./controllers/config");
var cron_1 = require("./controllers/cron");
var debug_1 = require("./controllers/debug");
var devices_1 = require("./controllers/devices");
var exec_approvals_1 = require("./controllers/exec-approvals");
var logs_1 = require("./controllers/logs");
var nodes_1 = require("./controllers/nodes");
var presence_1 = require("./controllers/presence");
var sessions_1 = require("./controllers/sessions");
var skills_1 = require("./controllers/skills");
var icons_1 = require("./icons");
var navigation_1 = require("./navigation");
var channels_2 = require("./views/channels");
var chat_2 = require("./views/chat");
var config_2 = require("./views/config");
var cron_2 = require("./views/cron");
var debug_2 = require("./views/debug");
var exec_approval_1 = require("./views/exec-approval");
var gateway_url_confirmation_1 = require("./views/gateway-url-confirmation");
var instances_1 = require("./views/instances");
var logs_2 = require("./views/logs");
var nodes_2 = require("./views/nodes");
var overview_1 = require("./views/overview");
var sessions_2 = require("./views/sessions");
var skills_2 = require("./views/skills");
var AVATAR_DATA_RE = /^data:/i;
var AVATAR_HTTP_RE = /^https?:\/\//i;
function resolveAssistantAvatarUrl(state) {
    var _a, _b, _c, _d, _e, _f;
    var list = (_b = (_a = state.agentsList) === null || _a === void 0 ? void 0 : _a.agents) !== null && _b !== void 0 ? _b : [];
    var parsed = (0, session_key_js_1.parseAgentSessionKey)(state.sessionKey);
    var agentId = (_e = (_c = parsed === null || parsed === void 0 ? void 0 : parsed.agentId) !== null && _c !== void 0 ? _c : (_d = state.agentsList) === null || _d === void 0 ? void 0 : _d.defaultId) !== null && _e !== void 0 ? _e : "main";
    var agent = list.find(function (entry) { return entry.id === agentId; });
    var identity = agent === null || agent === void 0 ? void 0 : agent.identity;
    var candidate = (_f = identity === null || identity === void 0 ? void 0 : identity.avatarUrl) !== null && _f !== void 0 ? _f : identity === null || identity === void 0 ? void 0 : identity.avatar;
    if (!candidate) {
        return undefined;
    }
    if (AVATAR_DATA_RE.test(candidate) || AVATAR_HTTP_RE.test(candidate)) {
        return candidate;
    }
    return identity === null || identity === void 0 ? void 0 : identity.avatarUrl;
}
function renderApp(state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var presenceCount = state.presenceEntries.length;
    var sessionsCount = (_b = (_a = state.sessionsResult) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : null;
    var cronNext = (_d = (_c = state.cronStatus) === null || _c === void 0 ? void 0 : _c.nextWakeAtMs) !== null && _d !== void 0 ? _d : null;
    var chatDisabledReason = state.connected ? null : "Disconnected from gateway.";
    var isChat = state.tab === "chat";
    var chatFocus = isChat && (state.settings.chatFocusMode || state.onboarding);
    var showThinking = state.onboarding ? false : state.settings.chatShowThinking;
    var assistantAvatarUrl = resolveAssistantAvatarUrl(state);
    var chatAvatarUrl = (_f = (_e = state.chatAvatarUrl) !== null && _e !== void 0 ? _e : assistantAvatarUrl) !== null && _f !== void 0 ? _f : null;
    return (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <div class=\"shell ", " ", " ", " ", "\">\n      <header class=\"topbar\">\n        <div class=\"topbar-left\">\n          <button\n            class=\"nav-collapse-toggle\"\n            @click=", "\n            title=\"", "\"\n            aria-label=\"", "\"\n          >\n            <span class=\"nav-collapse-toggle__icon\">", "</span>\n          </button>\n          <div class=\"brand\">\n            <div class=\"brand-logo\">\n              <img src=\"/favicon.svg\" alt=\"OpenClaw\" />\n            </div>\n            <div class=\"brand-text\">\n              <div class=\"brand-title\">OPENCLAW</div>\n              <div class=\"brand-sub\">Gateway Dashboard</div>\n            </div>\n          </div>\n        </div>\n        <div class=\"topbar-status\">\n          <div class=\"pill\">\n            <span class=\"statusDot ", "\"></span>\n            <span>Health</span>\n            <span class=\"mono\">", "</span>\n          </div>\n          ", "\n        </div>\n      </header>\n      <aside class=\"nav ", "\">\n        ", "\n        <div class=\"nav-group nav-group--links\">\n          <div class=\"nav-label nav-label--static\">\n            <span class=\"nav-label__text\">Resources</span>\n          </div>\n          <div class=\"nav-group__items\">\n            <a\n              class=\"nav-item nav-item--external\"\n              href=\"https://docs.openclaw.ai\"\n              target=\"_blank\"\n              rel=\"noreferrer\"\n              title=\"Docs (opens in new tab)\"\n            >\n              <span class=\"nav-item__icon\" aria-hidden=\"true\">", "</span>\n              <span class=\"nav-item__text\">Docs</span>\n            </a>\n          </div>\n        </div>\n      </aside>\n      <main class=\"content ", "\">\n        <section class=\"content-header\">\n          <div>\n            <div class=\"page-title\">", "</div>\n            <div class=\"page-sub\">", "</div>\n          </div>\n          <div class=\"page-meta\">\n            ", "\n            ", "\n          </div>\n        </section>\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n      </main>\n      ", "\n      ", "\n    </div>\n  "], ["\n    <div class=\"shell ", " ", " ", " ", "\">\n      <header class=\"topbar\">\n        <div class=\"topbar-left\">\n          <button\n            class=\"nav-collapse-toggle\"\n            @click=", "\n            title=\"", "\"\n            aria-label=\"", "\"\n          >\n            <span class=\"nav-collapse-toggle__icon\">", "</span>\n          </button>\n          <div class=\"brand\">\n            <div class=\"brand-logo\">\n              <img src=\"/favicon.svg\" alt=\"OpenClaw\" />\n            </div>\n            <div class=\"brand-text\">\n              <div class=\"brand-title\">OPENCLAW</div>\n              <div class=\"brand-sub\">Gateway Dashboard</div>\n            </div>\n          </div>\n        </div>\n        <div class=\"topbar-status\">\n          <div class=\"pill\">\n            <span class=\"statusDot ", "\"></span>\n            <span>Health</span>\n            <span class=\"mono\">", "</span>\n          </div>\n          ", "\n        </div>\n      </header>\n      <aside class=\"nav ", "\">\n        ", "\n        <div class=\"nav-group nav-group--links\">\n          <div class=\"nav-label nav-label--static\">\n            <span class=\"nav-label__text\">Resources</span>\n          </div>\n          <div class=\"nav-group__items\">\n            <a\n              class=\"nav-item nav-item--external\"\n              href=\"https://docs.openclaw.ai\"\n              target=\"_blank\"\n              rel=\"noreferrer\"\n              title=\"Docs (opens in new tab)\"\n            >\n              <span class=\"nav-item__icon\" aria-hidden=\"true\">", "</span>\n              <span class=\"nav-item__text\">Docs</span>\n            </a>\n          </div>\n        </div>\n      </aside>\n      <main class=\"content ", "\">\n        <section class=\"content-header\">\n          <div>\n            <div class=\"page-title\">", "</div>\n            <div class=\"page-sub\">", "</div>\n          </div>\n          <div class=\"page-meta\">\n            ", "\n            ", "\n          </div>\n        </section>\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n\n        ", "\n      </main>\n      ", "\n      ", "\n    </div>\n  "])), isChat ? "shell--chat" : "", chatFocus ? "shell--chat-focus" : "", state.settings.navCollapsed ? "shell--nav-collapsed" : "", state.onboarding ? "shell--onboarding" : "", function () {
        return state.applySettings(__assign(__assign({}, state.settings), { navCollapsed: !state.settings.navCollapsed }));
    }, state.settings.navCollapsed ? "Expand sidebar" : "Collapse sidebar", state.settings.navCollapsed ? "Expand sidebar" : "Collapse sidebar", icons_1.icons.menu, state.connected ? "ok" : "", state.connected ? "OK" : "Offline", (0, app_render_helpers_1.renderThemeToggle)(state), state.settings.navCollapsed ? "nav--collapsed" : "", navigation_1.TAB_GROUPS.map(function (group) {
        var _a;
        var isGroupCollapsed = (_a = state.settings.navGroupsCollapsed[group.label]) !== null && _a !== void 0 ? _a : false;
        var hasActiveTab = group.tabs.some(function (tab) { return tab === state.tab; });
        return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            <div class=\"nav-group ", "\">\n              <button\n                class=\"nav-label\"\n                @click=", "\n                aria-expanded=", "\n              >\n                <span class=\"nav-label__text\">", "</span>\n                <span class=\"nav-label__chevron\">", "</span>\n              </button>\n              <div class=\"nav-group__items\">\n                ", "\n              </div>\n            </div>\n          "], ["\n            <div class=\"nav-group ", "\">\n              <button\n                class=\"nav-label\"\n                @click=", "\n                aria-expanded=", "\n              >\n                <span class=\"nav-label__text\">", "</span>\n                <span class=\"nav-label__chevron\">", "</span>\n              </button>\n              <div class=\"nav-group__items\">\n                ", "\n              </div>\n            </div>\n          "])), isGroupCollapsed && !hasActiveTab ? "nav-group--collapsed" : "", function () {
            var next = __assign({}, state.settings.navGroupsCollapsed);
            next[group.label] = !isGroupCollapsed;
            state.applySettings(__assign(__assign({}, state.settings), { navGroupsCollapsed: next }));
        }, !isGroupCollapsed, group.label, isGroupCollapsed ? "+" : "−", group.tabs.map(function (tab) { return (0, app_render_helpers_1.renderTab)(state, tab); }));
    }), icons_1.icons.book, isChat ? "content--chat" : "", (0, navigation_1.titleForTab)(state.tab), (0, navigation_1.subtitleForTab)(state.tab), state.lastError ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<div class=\"pill danger\">", "</div>"], ["<div class=\"pill danger\">", "</div>"])), state.lastError) : lit_1.nothing, isChat ? (0, app_render_helpers_1.renderChatControls)(state) : lit_1.nothing, state.tab === "overview"
        ? (0, overview_1.renderOverview)({
            connected: state.connected,
            hello: state.hello,
            settings: state.settings,
            password: state.password,
            lastError: state.lastError,
            presenceCount: presenceCount,
            sessionsCount: sessionsCount,
            cronEnabled: (_h = (_g = state.cronStatus) === null || _g === void 0 ? void 0 : _g.enabled) !== null && _h !== void 0 ? _h : null,
            cronNext: cronNext,
            lastChannelsRefresh: state.channelsLastSuccess,
            onSettingsChange: function (next) { return state.applySettings(next); },
            onPasswordChange: function (next) { return (state.password = next); },
            onSessionKeyChange: function (next) {
                state.sessionKey = next;
                state.chatMessage = "";
                state.resetToolStream();
                state.applySettings(__assign(__assign({}, state.settings), { sessionKey: next, lastActiveSessionKey: next }));
                void state.loadAssistantIdentity();
            },
            onConnect: function () { return state.connect(); },
            onRefresh: function () { return state.loadOverview(); },
        })
        : lit_1.nothing, state.tab === "channels"
        ? (0, channels_2.renderChannels)({
            connected: state.connected,
            loading: state.channelsLoading,
            snapshot: state.channelsSnapshot,
            lastError: state.channelsError,
            lastSuccessAt: state.channelsLastSuccess,
            whatsappMessage: state.whatsappLoginMessage,
            whatsappQrDataUrl: state.whatsappLoginQrDataUrl,
            whatsappConnected: state.whatsappLoginConnected,
            whatsappBusy: state.whatsappBusy,
            configSchema: state.configSchema,
            configSchemaLoading: state.configSchemaLoading,
            configForm: state.configForm,
            configUiHints: state.configUiHints,
            configSaving: state.configSaving,
            configFormDirty: state.configFormDirty,
            nostrProfileFormState: state.nostrProfileFormState,
            nostrProfileAccountId: state.nostrProfileAccountId,
            onRefresh: function (probe) { return (0, channels_1.loadChannels)(state, probe); },
            onWhatsAppStart: function (force) { return state.handleWhatsAppStart(force); },
            onWhatsAppWait: function () { return state.handleWhatsAppWait(); },
            onWhatsAppLogout: function () { return state.handleWhatsAppLogout(); },
            onConfigPatch: function (path, value) { return (0, config_1.updateConfigFormValue)(state, path, value); },
            onConfigSave: function () { return state.handleChannelConfigSave(); },
            onConfigReload: function () { return state.handleChannelConfigReload(); },
            onNostrProfileEdit: function (accountId, profile) {
                return state.handleNostrProfileEdit(accountId, profile);
            },
            onNostrProfileCancel: function () { return state.handleNostrProfileCancel(); },
            onNostrProfileFieldChange: function (field, value) {
                return state.handleNostrProfileFieldChange(field, value);
            },
            onNostrProfileSave: function () { return state.handleNostrProfileSave(); },
            onNostrProfileImport: function () { return state.handleNostrProfileImport(); },
            onNostrProfileToggleAdvanced: function () { return state.handleNostrProfileToggleAdvanced(); },
        })
        : lit_1.nothing, state.tab === "instances"
        ? (0, instances_1.renderInstances)({
            loading: state.presenceLoading,
            entries: state.presenceEntries,
            lastError: state.presenceError,
            statusMessage: state.presenceStatus,
            onRefresh: function () { return (0, presence_1.loadPresence)(state); },
        })
        : lit_1.nothing, state.tab === "sessions"
        ? (0, sessions_2.renderSessions)({
            loading: state.sessionsLoading,
            result: state.sessionsResult,
            error: state.sessionsError,
            activeMinutes: state.sessionsFilterActive,
            limit: state.sessionsFilterLimit,
            includeGlobal: state.sessionsIncludeGlobal,
            includeUnknown: state.sessionsIncludeUnknown,
            basePath: state.basePath,
            onFiltersChange: function (next) {
                state.sessionsFilterActive = next.activeMinutes;
                state.sessionsFilterLimit = next.limit;
                state.sessionsIncludeGlobal = next.includeGlobal;
                state.sessionsIncludeUnknown = next.includeUnknown;
            },
            onRefresh: function () { return (0, sessions_1.loadSessions)(state); },
            onPatch: function (key, patch) { return (0, sessions_1.patchSession)(state, key, patch); },
            onDelete: function (key) { return (0, sessions_1.deleteSession)(state, key); },
        })
        : lit_1.nothing, state.tab === "cron"
        ? (0, cron_2.renderCron)({
            loading: state.cronLoading,
            status: state.cronStatus,
            jobs: state.cronJobs,
            error: state.cronError,
            busy: state.cronBusy,
            form: state.cronForm,
            channels: ((_k = (_j = state.channelsSnapshot) === null || _j === void 0 ? void 0 : _j.channelMeta) === null || _k === void 0 ? void 0 : _k.length)
                ? state.channelsSnapshot.channelMeta.map(function (entry) { return entry.id; })
                : ((_m = (_l = state.channelsSnapshot) === null || _l === void 0 ? void 0 : _l.channelOrder) !== null && _m !== void 0 ? _m : []),
            channelLabels: (_p = (_o = state.channelsSnapshot) === null || _o === void 0 ? void 0 : _o.channelLabels) !== null && _p !== void 0 ? _p : {},
            channelMeta: (_r = (_q = state.channelsSnapshot) === null || _q === void 0 ? void 0 : _q.channelMeta) !== null && _r !== void 0 ? _r : [],
            runsJobId: state.cronRunsJobId,
            runs: state.cronRuns,
            onFormChange: function (patch) { return (state.cronForm = __assign(__assign({}, state.cronForm), patch)); },
            onRefresh: function () { return state.loadCron(); },
            onAdd: function () { return (0, cron_1.addCronJob)(state); },
            onToggle: function (job, enabled) { return (0, cron_1.toggleCronJob)(state, job, enabled); },
            onRun: function (job) { return (0, cron_1.runCronJob)(state, job); },
            onRemove: function (job) { return (0, cron_1.removeCronJob)(state, job); },
            onLoadRuns: function (jobId) { return (0, cron_1.loadCronRuns)(state, jobId); },
        })
        : lit_1.nothing, state.tab === "skills"
        ? (0, skills_2.renderSkills)({
            loading: state.skillsLoading,
            report: state.skillsReport,
            error: state.skillsError,
            filter: state.skillsFilter,
            edits: state.skillEdits,
            messages: state.skillMessages,
            busyKey: state.skillsBusyKey,
            onFilterChange: function (next) { return (state.skillsFilter = next); },
            onRefresh: function () { return (0, skills_1.loadSkills)(state, { clearMessages: true }); },
            onToggle: function (key, enabled) { return (0, skills_1.updateSkillEnabled)(state, key, enabled); },
            onEdit: function (key, value) { return (0, skills_1.updateSkillEdit)(state, key, value); },
            onSaveKey: function (key) { return (0, skills_1.saveSkillApiKey)(state, key); },
            onInstall: function (skillKey, name, installId) {
                return (0, skills_1.installSkill)(state, skillKey, name, installId);
            },
        })
        : lit_1.nothing, state.tab === "nodes"
        ? (0, nodes_2.renderNodes)({
            loading: state.nodesLoading,
            nodes: state.nodes,
            devicesLoading: state.devicesLoading,
            devicesError: state.devicesError,
            devicesList: state.devicesList,
            configForm: (_s = state.configForm) !== null && _s !== void 0 ? _s : (_t = state.configSnapshot) === null || _t === void 0 ? void 0 : _t.config,
            configLoading: state.configLoading,
            configSaving: state.configSaving,
            configDirty: state.configFormDirty,
            configFormMode: state.configFormMode,
            execApprovalsLoading: state.execApprovalsLoading,
            execApprovalsSaving: state.execApprovalsSaving,
            execApprovalsDirty: state.execApprovalsDirty,
            execApprovalsSnapshot: state.execApprovalsSnapshot,
            execApprovalsForm: state.execApprovalsForm,
            execApprovalsSelectedAgent: state.execApprovalsSelectedAgent,
            execApprovalsTarget: state.execApprovalsTarget,
            execApprovalsTargetNodeId: state.execApprovalsTargetNodeId,
            onRefresh: function () { return (0, nodes_1.loadNodes)(state); },
            onDevicesRefresh: function () { return (0, devices_1.loadDevices)(state); },
            onDeviceApprove: function (requestId) { return (0, devices_1.approveDevicePairing)(state, requestId); },
            onDeviceReject: function (requestId) { return (0, devices_1.rejectDevicePairing)(state, requestId); },
            onDeviceRotate: function (deviceId, role, scopes) {
                return (0, devices_1.rotateDeviceToken)(state, { deviceId: deviceId, role: role, scopes: scopes });
            },
            onDeviceRevoke: function (deviceId, role) { return (0, devices_1.revokeDeviceToken)(state, { deviceId: deviceId, role: role }); },
            onLoadConfig: function () { return (0, config_1.loadConfig)(state); },
            onLoadExecApprovals: function () {
                var target = state.execApprovalsTarget === "node" && state.execApprovalsTargetNodeId
                    ? { kind: "node", nodeId: state.execApprovalsTargetNodeId }
                    : { kind: "gateway" };
                return (0, exec_approvals_1.loadExecApprovals)(state, target);
            },
            onBindDefault: function (nodeId) {
                if (nodeId) {
                    (0, config_1.updateConfigFormValue)(state, ["tools", "exec", "node"], nodeId);
                }
                else {
                    (0, config_1.removeConfigFormValue)(state, ["tools", "exec", "node"]);
                }
            },
            onBindAgent: function (agentIndex, nodeId) {
                var basePath = ["agents", "list", agentIndex, "tools", "exec", "node"];
                if (nodeId) {
                    (0, config_1.updateConfigFormValue)(state, basePath, nodeId);
                }
                else {
                    (0, config_1.removeConfigFormValue)(state, basePath);
                }
            },
            onSaveBindings: function () { return (0, config_1.saveConfig)(state); },
            onExecApprovalsTargetChange: function (kind, nodeId) {
                state.execApprovalsTarget = kind;
                state.execApprovalsTargetNodeId = nodeId;
                state.execApprovalsSnapshot = null;
                state.execApprovalsForm = null;
                state.execApprovalsDirty = false;
                state.execApprovalsSelectedAgent = null;
            },
            onExecApprovalsSelectAgent: function (agentId) {
                state.execApprovalsSelectedAgent = agentId;
            },
            onExecApprovalsPatch: function (path, value) {
                return (0, exec_approvals_1.updateExecApprovalsFormValue)(state, path, value);
            },
            onExecApprovalsRemove: function (path) { return (0, exec_approvals_1.removeExecApprovalsFormValue)(state, path); },
            onSaveExecApprovals: function () {
                var target = state.execApprovalsTarget === "node" && state.execApprovalsTargetNodeId
                    ? { kind: "node", nodeId: state.execApprovalsTargetNodeId }
                    : { kind: "gateway" };
                return (0, exec_approvals_1.saveExecApprovals)(state, target);
            },
        })
        : lit_1.nothing, state.tab === "chat"
        ? (0, chat_2.renderChat)({
            sessionKey: state.sessionKey,
            onSessionKeyChange: function (next) {
                state.sessionKey = next;
                state.chatMessage = "";
                state.chatAttachments = [];
                state.chatStream = null;
                state.chatStreamStartedAt = null;
                state.chatRunId = null;
                state.chatQueue = [];
                state.resetToolStream();
                state.resetChatScroll();
                state.applySettings(__assign(__assign({}, state.settings), { sessionKey: next, lastActiveSessionKey: next }));
                void state.loadAssistantIdentity();
                void (0, chat_1.loadChatHistory)(state);
                void (0, app_chat_1.refreshChatAvatar)(state);
            },
            thinkingLevel: state.chatThinkingLevel,
            showThinking: showThinking,
            loading: state.chatLoading,
            sending: state.chatSending,
            compactionStatus: state.compactionStatus,
            assistantAvatarUrl: chatAvatarUrl,
            messages: state.chatMessages,
            toolMessages: state.chatToolMessages,
            stream: state.chatStream,
            streamStartedAt: state.chatStreamStartedAt,
            draft: state.chatMessage,
            queue: state.chatQueue,
            connected: state.connected,
            canSend: state.connected,
            disabledReason: chatDisabledReason,
            error: state.lastError,
            sessions: state.sessionsResult,
            focusMode: chatFocus,
            onRefresh: function () {
                state.resetToolStream();
                return Promise.all([(0, chat_1.loadChatHistory)(state), (0, app_chat_1.refreshChatAvatar)(state)]);
            },
            onToggleFocusMode: function () {
                if (state.onboarding) {
                    return;
                }
                state.applySettings(__assign(__assign({}, state.settings), { chatFocusMode: !state.settings.chatFocusMode }));
            },
            onChatScroll: function (event) { return state.handleChatScroll(event); },
            onDraftChange: function (next) { return (state.chatMessage = next); },
            attachments: state.chatAttachments,
            onAttachmentsChange: function (next) { return (state.chatAttachments = next); },
            onSend: function () { return state.handleSendChat(); },
            canAbort: Boolean(state.chatRunId),
            onAbort: function () { return void state.handleAbortChat(); },
            onQueueRemove: function (id) { return state.removeQueuedMessage(id); },
            onNewSession: function () { return state.handleSendChat("/new", { restoreDraft: true }); },
            showNewMessages: state.chatNewMessagesBelow,
            onScrollToBottom: function () { return state.scrollToBottom(); },
            // Sidebar props for tool output viewing
            sidebarOpen: state.sidebarOpen,
            sidebarContent: state.sidebarContent,
            sidebarError: state.sidebarError,
            splitRatio: state.splitRatio,
            onOpenSidebar: function (content) { return state.handleOpenSidebar(content); },
            onCloseSidebar: function () { return state.handleCloseSidebar(); },
            onSplitRatioChange: function (ratio) { return state.handleSplitRatioChange(ratio); },
            assistantName: state.assistantName,
            assistantAvatar: state.assistantAvatar,
        })
        : lit_1.nothing, state.tab === "config"
        ? (0, config_2.renderConfig)({
            raw: state.configRaw,
            originalRaw: state.configRawOriginal,
            valid: state.configValid,
            issues: state.configIssues,
            loading: state.configLoading,
            saving: state.configSaving,
            applying: state.configApplying,
            updating: state.updateRunning,
            connected: state.connected,
            schema: state.configSchema,
            schemaLoading: state.configSchemaLoading,
            uiHints: state.configUiHints,
            formMode: state.configFormMode,
            formValue: state.configForm,
            originalValue: state.configFormOriginal,
            searchQuery: state.configSearchQuery,
            activeSection: state.configActiveSection,
            activeSubsection: state.configActiveSubsection,
            onRawChange: function (next) {
                state.configRaw = next;
            },
            onFormModeChange: function (mode) { return (state.configFormMode = mode); },
            onFormPatch: function (path, value) { return (0, config_1.updateConfigFormValue)(state, path, value); },
            onSearchChange: function (query) { return (state.configSearchQuery = query); },
            onSectionChange: function (section) {
                state.configActiveSection = section;
                state.configActiveSubsection = null;
            },
            onSubsectionChange: function (section) { return (state.configActiveSubsection = section); },
            onReload: function () { return (0, config_1.loadConfig)(state); },
            onSave: function () { return (0, config_1.saveConfig)(state); },
            onApply: function () { return (0, config_1.applyConfig)(state); },
            onUpdate: function () { return (0, config_1.runUpdate)(state); },
        })
        : lit_1.nothing, state.tab === "debug"
        ? (0, debug_2.renderDebug)({
            loading: state.debugLoading,
            status: state.debugStatus,
            health: state.debugHealth,
            models: state.debugModels,
            heartbeat: state.debugHeartbeat,
            eventLog: state.eventLog,
            callMethod: state.debugCallMethod,
            callParams: state.debugCallParams,
            callResult: state.debugCallResult,
            callError: state.debugCallError,
            onCallMethodChange: function (next) { return (state.debugCallMethod = next); },
            onCallParamsChange: function (next) { return (state.debugCallParams = next); },
            onRefresh: function () { return (0, debug_1.loadDebug)(state); },
            onCall: function () { return (0, debug_1.callDebugMethod)(state); },
        })
        : lit_1.nothing, state.tab === "logs"
        ? (0, logs_2.renderLogs)({
            loading: state.logsLoading,
            error: state.logsError,
            file: state.logsFile,
            entries: state.logsEntries,
            filterText: state.logsFilterText,
            levelFilters: state.logsLevelFilters,
            autoFollow: state.logsAutoFollow,
            truncated: state.logsTruncated,
            onFilterTextChange: function (next) { return (state.logsFilterText = next); },
            onLevelToggle: function (level, enabled) {
                var _a;
                state.logsLevelFilters = __assign(__assign({}, state.logsLevelFilters), (_a = {}, _a[level] = enabled, _a));
            },
            onToggleAutoFollow: function (next) { return (state.logsAutoFollow = next); },
            onRefresh: function () { return (0, logs_1.loadLogs)(state, { reset: true }); },
            onExport: function (lines, label) { return state.exportLogs(lines, label); },
            onScroll: function (event) { return state.handleLogsScroll(event); },
        })
        : lit_1.nothing, (0, exec_approval_1.renderExecApprovalPrompt)(state), (0, gateway_url_confirmation_1.renderGatewayUrlConfirmation)(state));
}
var templateObject_1, templateObject_2, templateObject_3;
