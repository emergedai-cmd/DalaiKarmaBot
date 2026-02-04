"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenClawApp = void 0;
var lit_1 = require("lit");
var decorators_js_1 = require("lit/decorators.js");
var app_channels_1 = require("./app-channels");
var app_chat_1 = require("./app-chat");
var app_defaults_1 = require("./app-defaults");
var app_gateway_1 = require("./app-gateway");
var app_lifecycle_1 = require("./app-lifecycle");
var app_render_1 = require("./app-render");
var app_scroll_1 = require("./app-scroll");
var app_settings_1 = require("./app-settings");
var app_tool_stream_1 = require("./app-tool-stream");
var assistant_identity_1 = require("./assistant-identity");
var assistant_identity_2 = require("./controllers/assistant-identity");
var storage_1 = require("./storage");
var injectedAssistantIdentity = (0, assistant_identity_1.resolveInjectedAssistantIdentity)();
function resolveOnboardingMode() {
    if (!window.location.search) {
        return false;
    }
    var params = new URLSearchParams(window.location.search);
    var raw = params.get("onboarding");
    if (!raw) {
        return false;
    }
    var normalized = raw.trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}
var OpenClawApp = function () {
    var _classDecorators = [(0, decorators_js_1.customElement)("openclaw-app")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = lit_1.LitElement;
    var _settings_decorators;
    var _settings_initializers = [];
    var _settings_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _tab_decorators;
    var _tab_initializers = [];
    var _tab_extraInitializers = [];
    var _onboarding_decorators;
    var _onboarding_initializers = [];
    var _onboarding_extraInitializers = [];
    var _connected_decorators;
    var _connected_initializers = [];
    var _connected_extraInitializers = [];
    var _theme_decorators;
    var _theme_initializers = [];
    var _theme_extraInitializers = [];
    var _themeResolved_decorators;
    var _themeResolved_initializers = [];
    var _themeResolved_extraInitializers = [];
    var _hello_decorators;
    var _hello_initializers = [];
    var _hello_extraInitializers = [];
    var _lastError_decorators;
    var _lastError_initializers = [];
    var _lastError_extraInitializers = [];
    var _eventLog_decorators;
    var _eventLog_initializers = [];
    var _eventLog_extraInitializers = [];
    var _assistantName_decorators;
    var _assistantName_initializers = [];
    var _assistantName_extraInitializers = [];
    var _assistantAvatar_decorators;
    var _assistantAvatar_initializers = [];
    var _assistantAvatar_extraInitializers = [];
    var _assistantAgentId_decorators;
    var _assistantAgentId_initializers = [];
    var _assistantAgentId_extraInitializers = [];
    var _sessionKey_decorators;
    var _sessionKey_initializers = [];
    var _sessionKey_extraInitializers = [];
    var _chatLoading_decorators;
    var _chatLoading_initializers = [];
    var _chatLoading_extraInitializers = [];
    var _chatSending_decorators;
    var _chatSending_initializers = [];
    var _chatSending_extraInitializers = [];
    var _chatMessage_decorators;
    var _chatMessage_initializers = [];
    var _chatMessage_extraInitializers = [];
    var _chatMessages_decorators;
    var _chatMessages_initializers = [];
    var _chatMessages_extraInitializers = [];
    var _chatToolMessages_decorators;
    var _chatToolMessages_initializers = [];
    var _chatToolMessages_extraInitializers = [];
    var _chatStream_decorators;
    var _chatStream_initializers = [];
    var _chatStream_extraInitializers = [];
    var _chatStreamStartedAt_decorators;
    var _chatStreamStartedAt_initializers = [];
    var _chatStreamStartedAt_extraInitializers = [];
    var _chatRunId_decorators;
    var _chatRunId_initializers = [];
    var _chatRunId_extraInitializers = [];
    var _compactionStatus_decorators;
    var _compactionStatus_initializers = [];
    var _compactionStatus_extraInitializers = [];
    var _chatAvatarUrl_decorators;
    var _chatAvatarUrl_initializers = [];
    var _chatAvatarUrl_extraInitializers = [];
    var _chatThinkingLevel_decorators;
    var _chatThinkingLevel_initializers = [];
    var _chatThinkingLevel_extraInitializers = [];
    var _chatQueue_decorators;
    var _chatQueue_initializers = [];
    var _chatQueue_extraInitializers = [];
    var _chatAttachments_decorators;
    var _chatAttachments_initializers = [];
    var _chatAttachments_extraInitializers = [];
    var _sidebarOpen_decorators;
    var _sidebarOpen_initializers = [];
    var _sidebarOpen_extraInitializers = [];
    var _sidebarContent_decorators;
    var _sidebarContent_initializers = [];
    var _sidebarContent_extraInitializers = [];
    var _sidebarError_decorators;
    var _sidebarError_initializers = [];
    var _sidebarError_extraInitializers = [];
    var _splitRatio_decorators;
    var _splitRatio_initializers = [];
    var _splitRatio_extraInitializers = [];
    var _nodesLoading_decorators;
    var _nodesLoading_initializers = [];
    var _nodesLoading_extraInitializers = [];
    var _nodes_decorators;
    var _nodes_initializers = [];
    var _nodes_extraInitializers = [];
    var _devicesLoading_decorators;
    var _devicesLoading_initializers = [];
    var _devicesLoading_extraInitializers = [];
    var _devicesError_decorators;
    var _devicesError_initializers = [];
    var _devicesError_extraInitializers = [];
    var _devicesList_decorators;
    var _devicesList_initializers = [];
    var _devicesList_extraInitializers = [];
    var _execApprovalsLoading_decorators;
    var _execApprovalsLoading_initializers = [];
    var _execApprovalsLoading_extraInitializers = [];
    var _execApprovalsSaving_decorators;
    var _execApprovalsSaving_initializers = [];
    var _execApprovalsSaving_extraInitializers = [];
    var _execApprovalsDirty_decorators;
    var _execApprovalsDirty_initializers = [];
    var _execApprovalsDirty_extraInitializers = [];
    var _execApprovalsSnapshot_decorators;
    var _execApprovalsSnapshot_initializers = [];
    var _execApprovalsSnapshot_extraInitializers = [];
    var _execApprovalsForm_decorators;
    var _execApprovalsForm_initializers = [];
    var _execApprovalsForm_extraInitializers = [];
    var _execApprovalsSelectedAgent_decorators;
    var _execApprovalsSelectedAgent_initializers = [];
    var _execApprovalsSelectedAgent_extraInitializers = [];
    var _execApprovalsTarget_decorators;
    var _execApprovalsTarget_initializers = [];
    var _execApprovalsTarget_extraInitializers = [];
    var _execApprovalsTargetNodeId_decorators;
    var _execApprovalsTargetNodeId_initializers = [];
    var _execApprovalsTargetNodeId_extraInitializers = [];
    var _execApprovalQueue_decorators;
    var _execApprovalQueue_initializers = [];
    var _execApprovalQueue_extraInitializers = [];
    var _execApprovalBusy_decorators;
    var _execApprovalBusy_initializers = [];
    var _execApprovalBusy_extraInitializers = [];
    var _execApprovalError_decorators;
    var _execApprovalError_initializers = [];
    var _execApprovalError_extraInitializers = [];
    var _pendingGatewayUrl_decorators;
    var _pendingGatewayUrl_initializers = [];
    var _pendingGatewayUrl_extraInitializers = [];
    var _configLoading_decorators;
    var _configLoading_initializers = [];
    var _configLoading_extraInitializers = [];
    var _configRaw_decorators;
    var _configRaw_initializers = [];
    var _configRaw_extraInitializers = [];
    var _configRawOriginal_decorators;
    var _configRawOriginal_initializers = [];
    var _configRawOriginal_extraInitializers = [];
    var _configValid_decorators;
    var _configValid_initializers = [];
    var _configValid_extraInitializers = [];
    var _configIssues_decorators;
    var _configIssues_initializers = [];
    var _configIssues_extraInitializers = [];
    var _configSaving_decorators;
    var _configSaving_initializers = [];
    var _configSaving_extraInitializers = [];
    var _configApplying_decorators;
    var _configApplying_initializers = [];
    var _configApplying_extraInitializers = [];
    var _updateRunning_decorators;
    var _updateRunning_initializers = [];
    var _updateRunning_extraInitializers = [];
    var _applySessionKey_decorators;
    var _applySessionKey_initializers = [];
    var _applySessionKey_extraInitializers = [];
    var _configSnapshot_decorators;
    var _configSnapshot_initializers = [];
    var _configSnapshot_extraInitializers = [];
    var _configSchema_decorators;
    var _configSchema_initializers = [];
    var _configSchema_extraInitializers = [];
    var _configSchemaVersion_decorators;
    var _configSchemaVersion_initializers = [];
    var _configSchemaVersion_extraInitializers = [];
    var _configSchemaLoading_decorators;
    var _configSchemaLoading_initializers = [];
    var _configSchemaLoading_extraInitializers = [];
    var _configUiHints_decorators;
    var _configUiHints_initializers = [];
    var _configUiHints_extraInitializers = [];
    var _configForm_decorators;
    var _configForm_initializers = [];
    var _configForm_extraInitializers = [];
    var _configFormOriginal_decorators;
    var _configFormOriginal_initializers = [];
    var _configFormOriginal_extraInitializers = [];
    var _configFormDirty_decorators;
    var _configFormDirty_initializers = [];
    var _configFormDirty_extraInitializers = [];
    var _configFormMode_decorators;
    var _configFormMode_initializers = [];
    var _configFormMode_extraInitializers = [];
    var _configSearchQuery_decorators;
    var _configSearchQuery_initializers = [];
    var _configSearchQuery_extraInitializers = [];
    var _configActiveSection_decorators;
    var _configActiveSection_initializers = [];
    var _configActiveSection_extraInitializers = [];
    var _configActiveSubsection_decorators;
    var _configActiveSubsection_initializers = [];
    var _configActiveSubsection_extraInitializers = [];
    var _channelsLoading_decorators;
    var _channelsLoading_initializers = [];
    var _channelsLoading_extraInitializers = [];
    var _channelsSnapshot_decorators;
    var _channelsSnapshot_initializers = [];
    var _channelsSnapshot_extraInitializers = [];
    var _channelsError_decorators;
    var _channelsError_initializers = [];
    var _channelsError_extraInitializers = [];
    var _channelsLastSuccess_decorators;
    var _channelsLastSuccess_initializers = [];
    var _channelsLastSuccess_extraInitializers = [];
    var _whatsappLoginMessage_decorators;
    var _whatsappLoginMessage_initializers = [];
    var _whatsappLoginMessage_extraInitializers = [];
    var _whatsappLoginQrDataUrl_decorators;
    var _whatsappLoginQrDataUrl_initializers = [];
    var _whatsappLoginQrDataUrl_extraInitializers = [];
    var _whatsappLoginConnected_decorators;
    var _whatsappLoginConnected_initializers = [];
    var _whatsappLoginConnected_extraInitializers = [];
    var _whatsappBusy_decorators;
    var _whatsappBusy_initializers = [];
    var _whatsappBusy_extraInitializers = [];
    var _nostrProfileFormState_decorators;
    var _nostrProfileFormState_initializers = [];
    var _nostrProfileFormState_extraInitializers = [];
    var _nostrProfileAccountId_decorators;
    var _nostrProfileAccountId_initializers = [];
    var _nostrProfileAccountId_extraInitializers = [];
    var _presenceLoading_decorators;
    var _presenceLoading_initializers = [];
    var _presenceLoading_extraInitializers = [];
    var _presenceEntries_decorators;
    var _presenceEntries_initializers = [];
    var _presenceEntries_extraInitializers = [];
    var _presenceError_decorators;
    var _presenceError_initializers = [];
    var _presenceError_extraInitializers = [];
    var _presenceStatus_decorators;
    var _presenceStatus_initializers = [];
    var _presenceStatus_extraInitializers = [];
    var _agentsLoading_decorators;
    var _agentsLoading_initializers = [];
    var _agentsLoading_extraInitializers = [];
    var _agentsList_decorators;
    var _agentsList_initializers = [];
    var _agentsList_extraInitializers = [];
    var _agentsError_decorators;
    var _agentsError_initializers = [];
    var _agentsError_extraInitializers = [];
    var _sessionsLoading_decorators;
    var _sessionsLoading_initializers = [];
    var _sessionsLoading_extraInitializers = [];
    var _sessionsResult_decorators;
    var _sessionsResult_initializers = [];
    var _sessionsResult_extraInitializers = [];
    var _sessionsError_decorators;
    var _sessionsError_initializers = [];
    var _sessionsError_extraInitializers = [];
    var _sessionsFilterActive_decorators;
    var _sessionsFilterActive_initializers = [];
    var _sessionsFilterActive_extraInitializers = [];
    var _sessionsFilterLimit_decorators;
    var _sessionsFilterLimit_initializers = [];
    var _sessionsFilterLimit_extraInitializers = [];
    var _sessionsIncludeGlobal_decorators;
    var _sessionsIncludeGlobal_initializers = [];
    var _sessionsIncludeGlobal_extraInitializers = [];
    var _sessionsIncludeUnknown_decorators;
    var _sessionsIncludeUnknown_initializers = [];
    var _sessionsIncludeUnknown_extraInitializers = [];
    var _cronLoading_decorators;
    var _cronLoading_initializers = [];
    var _cronLoading_extraInitializers = [];
    var _cronJobs_decorators;
    var _cronJobs_initializers = [];
    var _cronJobs_extraInitializers = [];
    var _cronStatus_decorators;
    var _cronStatus_initializers = [];
    var _cronStatus_extraInitializers = [];
    var _cronError_decorators;
    var _cronError_initializers = [];
    var _cronError_extraInitializers = [];
    var _cronForm_decorators;
    var _cronForm_initializers = [];
    var _cronForm_extraInitializers = [];
    var _cronRunsJobId_decorators;
    var _cronRunsJobId_initializers = [];
    var _cronRunsJobId_extraInitializers = [];
    var _cronRuns_decorators;
    var _cronRuns_initializers = [];
    var _cronRuns_extraInitializers = [];
    var _cronBusy_decorators;
    var _cronBusy_initializers = [];
    var _cronBusy_extraInitializers = [];
    var _skillsLoading_decorators;
    var _skillsLoading_initializers = [];
    var _skillsLoading_extraInitializers = [];
    var _skillsReport_decorators;
    var _skillsReport_initializers = [];
    var _skillsReport_extraInitializers = [];
    var _skillsError_decorators;
    var _skillsError_initializers = [];
    var _skillsError_extraInitializers = [];
    var _skillsFilter_decorators;
    var _skillsFilter_initializers = [];
    var _skillsFilter_extraInitializers = [];
    var _skillEdits_decorators;
    var _skillEdits_initializers = [];
    var _skillEdits_extraInitializers = [];
    var _skillsBusyKey_decorators;
    var _skillsBusyKey_initializers = [];
    var _skillsBusyKey_extraInitializers = [];
    var _skillMessages_decorators;
    var _skillMessages_initializers = [];
    var _skillMessages_extraInitializers = [];
    var _debugLoading_decorators;
    var _debugLoading_initializers = [];
    var _debugLoading_extraInitializers = [];
    var _debugStatus_decorators;
    var _debugStatus_initializers = [];
    var _debugStatus_extraInitializers = [];
    var _debugHealth_decorators;
    var _debugHealth_initializers = [];
    var _debugHealth_extraInitializers = [];
    var _debugModels_decorators;
    var _debugModels_initializers = [];
    var _debugModels_extraInitializers = [];
    var _debugHeartbeat_decorators;
    var _debugHeartbeat_initializers = [];
    var _debugHeartbeat_extraInitializers = [];
    var _debugCallMethod_decorators;
    var _debugCallMethod_initializers = [];
    var _debugCallMethod_extraInitializers = [];
    var _debugCallParams_decorators;
    var _debugCallParams_initializers = [];
    var _debugCallParams_extraInitializers = [];
    var _debugCallResult_decorators;
    var _debugCallResult_initializers = [];
    var _debugCallResult_extraInitializers = [];
    var _debugCallError_decorators;
    var _debugCallError_initializers = [];
    var _debugCallError_extraInitializers = [];
    var _logsLoading_decorators;
    var _logsLoading_initializers = [];
    var _logsLoading_extraInitializers = [];
    var _logsError_decorators;
    var _logsError_initializers = [];
    var _logsError_extraInitializers = [];
    var _logsFile_decorators;
    var _logsFile_initializers = [];
    var _logsFile_extraInitializers = [];
    var _logsEntries_decorators;
    var _logsEntries_initializers = [];
    var _logsEntries_extraInitializers = [];
    var _logsFilterText_decorators;
    var _logsFilterText_initializers = [];
    var _logsFilterText_extraInitializers = [];
    var _logsLevelFilters_decorators;
    var _logsLevelFilters_initializers = [];
    var _logsLevelFilters_extraInitializers = [];
    var _logsAutoFollow_decorators;
    var _logsAutoFollow_initializers = [];
    var _logsAutoFollow_extraInitializers = [];
    var _logsTruncated_decorators;
    var _logsTruncated_initializers = [];
    var _logsTruncated_extraInitializers = [];
    var _logsCursor_decorators;
    var _logsCursor_initializers = [];
    var _logsCursor_extraInitializers = [];
    var _logsLastFetchAt_decorators;
    var _logsLastFetchAt_initializers = [];
    var _logsLastFetchAt_extraInitializers = [];
    var _logsLimit_decorators;
    var _logsLimit_initializers = [];
    var _logsLimit_extraInitializers = [];
    var _logsMaxBytes_decorators;
    var _logsMaxBytes_initializers = [];
    var _logsMaxBytes_extraInitializers = [];
    var _logsAtBottom_decorators;
    var _logsAtBottom_initializers = [];
    var _logsAtBottom_extraInitializers = [];
    var _chatNewMessagesBelow_decorators;
    var _chatNewMessagesBelow_initializers = [];
    var _chatNewMessagesBelow_extraInitializers = [];
    var OpenClawApp = _classThis = /** @class */ (function (_super) {
        __extends(OpenClawApp_1, _super);
        function OpenClawApp_1() {
            var _a, _b;
            var _this = _super.apply(this, arguments) || this;
            _this.settings = __runInitializers(_this, _settings_initializers, (0, storage_1.loadSettings)());
            _this.password = (__runInitializers(_this, _settings_extraInitializers), __runInitializers(_this, _password_initializers, ""));
            _this.tab = (__runInitializers(_this, _password_extraInitializers), __runInitializers(_this, _tab_initializers, "chat"));
            _this.onboarding = (__runInitializers(_this, _tab_extraInitializers), __runInitializers(_this, _onboarding_initializers, resolveOnboardingMode()));
            _this.connected = (__runInitializers(_this, _onboarding_extraInitializers), __runInitializers(_this, _connected_initializers, false));
            _this.theme = (__runInitializers(_this, _connected_extraInitializers), __runInitializers(_this, _theme_initializers, (_a = _this.settings.theme) !== null && _a !== void 0 ? _a : "system"));
            _this.themeResolved = (__runInitializers(_this, _theme_extraInitializers), __runInitializers(_this, _themeResolved_initializers, "dark"));
            _this.hello = (__runInitializers(_this, _themeResolved_extraInitializers), __runInitializers(_this, _hello_initializers, null));
            _this.lastError = (__runInitializers(_this, _hello_extraInitializers), __runInitializers(_this, _lastError_initializers, null));
            _this.eventLog = (__runInitializers(_this, _lastError_extraInitializers), __runInitializers(_this, _eventLog_initializers, []));
            _this.eventLogBuffer = (__runInitializers(_this, _eventLog_extraInitializers), []);
            _this.toolStreamSyncTimer = null;
            _this.sidebarCloseTimer = null;
            _this.assistantName = __runInitializers(_this, _assistantName_initializers, injectedAssistantIdentity.name);
            _this.assistantAvatar = (__runInitializers(_this, _assistantName_extraInitializers), __runInitializers(_this, _assistantAvatar_initializers, injectedAssistantIdentity.avatar));
            _this.assistantAgentId = (__runInitializers(_this, _assistantAvatar_extraInitializers), __runInitializers(_this, _assistantAgentId_initializers, (_b = injectedAssistantIdentity.agentId) !== null && _b !== void 0 ? _b : null));
            _this.sessionKey = (__runInitializers(_this, _assistantAgentId_extraInitializers), __runInitializers(_this, _sessionKey_initializers, _this.settings.sessionKey));
            _this.chatLoading = (__runInitializers(_this, _sessionKey_extraInitializers), __runInitializers(_this, _chatLoading_initializers, false));
            _this.chatSending = (__runInitializers(_this, _chatLoading_extraInitializers), __runInitializers(_this, _chatSending_initializers, false));
            _this.chatMessage = (__runInitializers(_this, _chatSending_extraInitializers), __runInitializers(_this, _chatMessage_initializers, ""));
            _this.chatMessages = (__runInitializers(_this, _chatMessage_extraInitializers), __runInitializers(_this, _chatMessages_initializers, []));
            _this.chatToolMessages = (__runInitializers(_this, _chatMessages_extraInitializers), __runInitializers(_this, _chatToolMessages_initializers, []));
            _this.chatStream = (__runInitializers(_this, _chatToolMessages_extraInitializers), __runInitializers(_this, _chatStream_initializers, null));
            _this.chatStreamStartedAt = (__runInitializers(_this, _chatStream_extraInitializers), __runInitializers(_this, _chatStreamStartedAt_initializers, null));
            _this.chatRunId = (__runInitializers(_this, _chatStreamStartedAt_extraInitializers), __runInitializers(_this, _chatRunId_initializers, null));
            _this.compactionStatus = (__runInitializers(_this, _chatRunId_extraInitializers), __runInitializers(_this, _compactionStatus_initializers, null));
            _this.chatAvatarUrl = (__runInitializers(_this, _compactionStatus_extraInitializers), __runInitializers(_this, _chatAvatarUrl_initializers, null));
            _this.chatThinkingLevel = (__runInitializers(_this, _chatAvatarUrl_extraInitializers), __runInitializers(_this, _chatThinkingLevel_initializers, null));
            _this.chatQueue = (__runInitializers(_this, _chatThinkingLevel_extraInitializers), __runInitializers(_this, _chatQueue_initializers, []));
            _this.chatAttachments = (__runInitializers(_this, _chatQueue_extraInitializers), __runInitializers(_this, _chatAttachments_initializers, []));
            // Sidebar state for tool output viewing
            _this.sidebarOpen = (__runInitializers(_this, _chatAttachments_extraInitializers), __runInitializers(_this, _sidebarOpen_initializers, false));
            _this.sidebarContent = (__runInitializers(_this, _sidebarOpen_extraInitializers), __runInitializers(_this, _sidebarContent_initializers, null));
            _this.sidebarError = (__runInitializers(_this, _sidebarContent_extraInitializers), __runInitializers(_this, _sidebarError_initializers, null));
            _this.splitRatio = (__runInitializers(_this, _sidebarError_extraInitializers), __runInitializers(_this, _splitRatio_initializers, _this.settings.splitRatio));
            _this.nodesLoading = (__runInitializers(_this, _splitRatio_extraInitializers), __runInitializers(_this, _nodesLoading_initializers, false));
            _this.nodes = (__runInitializers(_this, _nodesLoading_extraInitializers), __runInitializers(_this, _nodes_initializers, []));
            _this.devicesLoading = (__runInitializers(_this, _nodes_extraInitializers), __runInitializers(_this, _devicesLoading_initializers, false));
            _this.devicesError = (__runInitializers(_this, _devicesLoading_extraInitializers), __runInitializers(_this, _devicesError_initializers, null));
            _this.devicesList = (__runInitializers(_this, _devicesError_extraInitializers), __runInitializers(_this, _devicesList_initializers, null));
            _this.execApprovalsLoading = (__runInitializers(_this, _devicesList_extraInitializers), __runInitializers(_this, _execApprovalsLoading_initializers, false));
            _this.execApprovalsSaving = (__runInitializers(_this, _execApprovalsLoading_extraInitializers), __runInitializers(_this, _execApprovalsSaving_initializers, false));
            _this.execApprovalsDirty = (__runInitializers(_this, _execApprovalsSaving_extraInitializers), __runInitializers(_this, _execApprovalsDirty_initializers, false));
            _this.execApprovalsSnapshot = (__runInitializers(_this, _execApprovalsDirty_extraInitializers), __runInitializers(_this, _execApprovalsSnapshot_initializers, null));
            _this.execApprovalsForm = (__runInitializers(_this, _execApprovalsSnapshot_extraInitializers), __runInitializers(_this, _execApprovalsForm_initializers, null));
            _this.execApprovalsSelectedAgent = (__runInitializers(_this, _execApprovalsForm_extraInitializers), __runInitializers(_this, _execApprovalsSelectedAgent_initializers, null));
            _this.execApprovalsTarget = (__runInitializers(_this, _execApprovalsSelectedAgent_extraInitializers), __runInitializers(_this, _execApprovalsTarget_initializers, "gateway"));
            _this.execApprovalsTargetNodeId = (__runInitializers(_this, _execApprovalsTarget_extraInitializers), __runInitializers(_this, _execApprovalsTargetNodeId_initializers, null));
            _this.execApprovalQueue = (__runInitializers(_this, _execApprovalsTargetNodeId_extraInitializers), __runInitializers(_this, _execApprovalQueue_initializers, []));
            _this.execApprovalBusy = (__runInitializers(_this, _execApprovalQueue_extraInitializers), __runInitializers(_this, _execApprovalBusy_initializers, false));
            _this.execApprovalError = (__runInitializers(_this, _execApprovalBusy_extraInitializers), __runInitializers(_this, _execApprovalError_initializers, null));
            _this.pendingGatewayUrl = (__runInitializers(_this, _execApprovalError_extraInitializers), __runInitializers(_this, _pendingGatewayUrl_initializers, null));
            _this.configLoading = (__runInitializers(_this, _pendingGatewayUrl_extraInitializers), __runInitializers(_this, _configLoading_initializers, false));
            _this.configRaw = (__runInitializers(_this, _configLoading_extraInitializers), __runInitializers(_this, _configRaw_initializers, "{\n}\n"));
            _this.configRawOriginal = (__runInitializers(_this, _configRaw_extraInitializers), __runInitializers(_this, _configRawOriginal_initializers, ""));
            _this.configValid = (__runInitializers(_this, _configRawOriginal_extraInitializers), __runInitializers(_this, _configValid_initializers, null));
            _this.configIssues = (__runInitializers(_this, _configValid_extraInitializers), __runInitializers(_this, _configIssues_initializers, []));
            _this.configSaving = (__runInitializers(_this, _configIssues_extraInitializers), __runInitializers(_this, _configSaving_initializers, false));
            _this.configApplying = (__runInitializers(_this, _configSaving_extraInitializers), __runInitializers(_this, _configApplying_initializers, false));
            _this.updateRunning = (__runInitializers(_this, _configApplying_extraInitializers), __runInitializers(_this, _updateRunning_initializers, false));
            _this.applySessionKey = (__runInitializers(_this, _updateRunning_extraInitializers), __runInitializers(_this, _applySessionKey_initializers, _this.settings.lastActiveSessionKey));
            _this.configSnapshot = (__runInitializers(_this, _applySessionKey_extraInitializers), __runInitializers(_this, _configSnapshot_initializers, null));
            _this.configSchema = (__runInitializers(_this, _configSnapshot_extraInitializers), __runInitializers(_this, _configSchema_initializers, null));
            _this.configSchemaVersion = (__runInitializers(_this, _configSchema_extraInitializers), __runInitializers(_this, _configSchemaVersion_initializers, null));
            _this.configSchemaLoading = (__runInitializers(_this, _configSchemaVersion_extraInitializers), __runInitializers(_this, _configSchemaLoading_initializers, false));
            _this.configUiHints = (__runInitializers(_this, _configSchemaLoading_extraInitializers), __runInitializers(_this, _configUiHints_initializers, {}));
            _this.configForm = (__runInitializers(_this, _configUiHints_extraInitializers), __runInitializers(_this, _configForm_initializers, null));
            _this.configFormOriginal = (__runInitializers(_this, _configForm_extraInitializers), __runInitializers(_this, _configFormOriginal_initializers, null));
            _this.configFormDirty = (__runInitializers(_this, _configFormOriginal_extraInitializers), __runInitializers(_this, _configFormDirty_initializers, false));
            _this.configFormMode = (__runInitializers(_this, _configFormDirty_extraInitializers), __runInitializers(_this, _configFormMode_initializers, "form"));
            _this.configSearchQuery = (__runInitializers(_this, _configFormMode_extraInitializers), __runInitializers(_this, _configSearchQuery_initializers, ""));
            _this.configActiveSection = (__runInitializers(_this, _configSearchQuery_extraInitializers), __runInitializers(_this, _configActiveSection_initializers, null));
            _this.configActiveSubsection = (__runInitializers(_this, _configActiveSection_extraInitializers), __runInitializers(_this, _configActiveSubsection_initializers, null));
            _this.channelsLoading = (__runInitializers(_this, _configActiveSubsection_extraInitializers), __runInitializers(_this, _channelsLoading_initializers, false));
            _this.channelsSnapshot = (__runInitializers(_this, _channelsLoading_extraInitializers), __runInitializers(_this, _channelsSnapshot_initializers, null));
            _this.channelsError = (__runInitializers(_this, _channelsSnapshot_extraInitializers), __runInitializers(_this, _channelsError_initializers, null));
            _this.channelsLastSuccess = (__runInitializers(_this, _channelsError_extraInitializers), __runInitializers(_this, _channelsLastSuccess_initializers, null));
            _this.whatsappLoginMessage = (__runInitializers(_this, _channelsLastSuccess_extraInitializers), __runInitializers(_this, _whatsappLoginMessage_initializers, null));
            _this.whatsappLoginQrDataUrl = (__runInitializers(_this, _whatsappLoginMessage_extraInitializers), __runInitializers(_this, _whatsappLoginQrDataUrl_initializers, null));
            _this.whatsappLoginConnected = (__runInitializers(_this, _whatsappLoginQrDataUrl_extraInitializers), __runInitializers(_this, _whatsappLoginConnected_initializers, null));
            _this.whatsappBusy = (__runInitializers(_this, _whatsappLoginConnected_extraInitializers), __runInitializers(_this, _whatsappBusy_initializers, false));
            _this.nostrProfileFormState = (__runInitializers(_this, _whatsappBusy_extraInitializers), __runInitializers(_this, _nostrProfileFormState_initializers, null));
            _this.nostrProfileAccountId = (__runInitializers(_this, _nostrProfileFormState_extraInitializers), __runInitializers(_this, _nostrProfileAccountId_initializers, null));
            _this.presenceLoading = (__runInitializers(_this, _nostrProfileAccountId_extraInitializers), __runInitializers(_this, _presenceLoading_initializers, false));
            _this.presenceEntries = (__runInitializers(_this, _presenceLoading_extraInitializers), __runInitializers(_this, _presenceEntries_initializers, []));
            _this.presenceError = (__runInitializers(_this, _presenceEntries_extraInitializers), __runInitializers(_this, _presenceError_initializers, null));
            _this.presenceStatus = (__runInitializers(_this, _presenceError_extraInitializers), __runInitializers(_this, _presenceStatus_initializers, null));
            _this.agentsLoading = (__runInitializers(_this, _presenceStatus_extraInitializers), __runInitializers(_this, _agentsLoading_initializers, false));
            _this.agentsList = (__runInitializers(_this, _agentsLoading_extraInitializers), __runInitializers(_this, _agentsList_initializers, null));
            _this.agentsError = (__runInitializers(_this, _agentsList_extraInitializers), __runInitializers(_this, _agentsError_initializers, null));
            _this.sessionsLoading = (__runInitializers(_this, _agentsError_extraInitializers), __runInitializers(_this, _sessionsLoading_initializers, false));
            _this.sessionsResult = (__runInitializers(_this, _sessionsLoading_extraInitializers), __runInitializers(_this, _sessionsResult_initializers, null));
            _this.sessionsError = (__runInitializers(_this, _sessionsResult_extraInitializers), __runInitializers(_this, _sessionsError_initializers, null));
            _this.sessionsFilterActive = (__runInitializers(_this, _sessionsError_extraInitializers), __runInitializers(_this, _sessionsFilterActive_initializers, ""));
            _this.sessionsFilterLimit = (__runInitializers(_this, _sessionsFilterActive_extraInitializers), __runInitializers(_this, _sessionsFilterLimit_initializers, "120"));
            _this.sessionsIncludeGlobal = (__runInitializers(_this, _sessionsFilterLimit_extraInitializers), __runInitializers(_this, _sessionsIncludeGlobal_initializers, true));
            _this.sessionsIncludeUnknown = (__runInitializers(_this, _sessionsIncludeGlobal_extraInitializers), __runInitializers(_this, _sessionsIncludeUnknown_initializers, false));
            _this.cronLoading = (__runInitializers(_this, _sessionsIncludeUnknown_extraInitializers), __runInitializers(_this, _cronLoading_initializers, false));
            _this.cronJobs = (__runInitializers(_this, _cronLoading_extraInitializers), __runInitializers(_this, _cronJobs_initializers, []));
            _this.cronStatus = (__runInitializers(_this, _cronJobs_extraInitializers), __runInitializers(_this, _cronStatus_initializers, null));
            _this.cronError = (__runInitializers(_this, _cronStatus_extraInitializers), __runInitializers(_this, _cronError_initializers, null));
            _this.cronForm = (__runInitializers(_this, _cronError_extraInitializers), __runInitializers(_this, _cronForm_initializers, __assign({}, app_defaults_1.DEFAULT_CRON_FORM)));
            _this.cronRunsJobId = (__runInitializers(_this, _cronForm_extraInitializers), __runInitializers(_this, _cronRunsJobId_initializers, null));
            _this.cronRuns = (__runInitializers(_this, _cronRunsJobId_extraInitializers), __runInitializers(_this, _cronRuns_initializers, []));
            _this.cronBusy = (__runInitializers(_this, _cronRuns_extraInitializers), __runInitializers(_this, _cronBusy_initializers, false));
            _this.skillsLoading = (__runInitializers(_this, _cronBusy_extraInitializers), __runInitializers(_this, _skillsLoading_initializers, false));
            _this.skillsReport = (__runInitializers(_this, _skillsLoading_extraInitializers), __runInitializers(_this, _skillsReport_initializers, null));
            _this.skillsError = (__runInitializers(_this, _skillsReport_extraInitializers), __runInitializers(_this, _skillsError_initializers, null));
            _this.skillsFilter = (__runInitializers(_this, _skillsError_extraInitializers), __runInitializers(_this, _skillsFilter_initializers, ""));
            _this.skillEdits = (__runInitializers(_this, _skillsFilter_extraInitializers), __runInitializers(_this, _skillEdits_initializers, {}));
            _this.skillsBusyKey = (__runInitializers(_this, _skillEdits_extraInitializers), __runInitializers(_this, _skillsBusyKey_initializers, null));
            _this.skillMessages = (__runInitializers(_this, _skillsBusyKey_extraInitializers), __runInitializers(_this, _skillMessages_initializers, {}));
            _this.debugLoading = (__runInitializers(_this, _skillMessages_extraInitializers), __runInitializers(_this, _debugLoading_initializers, false));
            _this.debugStatus = (__runInitializers(_this, _debugLoading_extraInitializers), __runInitializers(_this, _debugStatus_initializers, null));
            _this.debugHealth = (__runInitializers(_this, _debugStatus_extraInitializers), __runInitializers(_this, _debugHealth_initializers, null));
            _this.debugModels = (__runInitializers(_this, _debugHealth_extraInitializers), __runInitializers(_this, _debugModels_initializers, []));
            _this.debugHeartbeat = (__runInitializers(_this, _debugModels_extraInitializers), __runInitializers(_this, _debugHeartbeat_initializers, null));
            _this.debugCallMethod = (__runInitializers(_this, _debugHeartbeat_extraInitializers), __runInitializers(_this, _debugCallMethod_initializers, ""));
            _this.debugCallParams = (__runInitializers(_this, _debugCallMethod_extraInitializers), __runInitializers(_this, _debugCallParams_initializers, "{}"));
            _this.debugCallResult = (__runInitializers(_this, _debugCallParams_extraInitializers), __runInitializers(_this, _debugCallResult_initializers, null));
            _this.debugCallError = (__runInitializers(_this, _debugCallResult_extraInitializers), __runInitializers(_this, _debugCallError_initializers, null));
            _this.logsLoading = (__runInitializers(_this, _debugCallError_extraInitializers), __runInitializers(_this, _logsLoading_initializers, false));
            _this.logsError = (__runInitializers(_this, _logsLoading_extraInitializers), __runInitializers(_this, _logsError_initializers, null));
            _this.logsFile = (__runInitializers(_this, _logsError_extraInitializers), __runInitializers(_this, _logsFile_initializers, null));
            _this.logsEntries = (__runInitializers(_this, _logsFile_extraInitializers), __runInitializers(_this, _logsEntries_initializers, []));
            _this.logsFilterText = (__runInitializers(_this, _logsEntries_extraInitializers), __runInitializers(_this, _logsFilterText_initializers, ""));
            _this.logsLevelFilters = (__runInitializers(_this, _logsFilterText_extraInitializers), __runInitializers(_this, _logsLevelFilters_initializers, __assign({}, app_defaults_1.DEFAULT_LOG_LEVEL_FILTERS)));
            _this.logsAutoFollow = (__runInitializers(_this, _logsLevelFilters_extraInitializers), __runInitializers(_this, _logsAutoFollow_initializers, true));
            _this.logsTruncated = (__runInitializers(_this, _logsAutoFollow_extraInitializers), __runInitializers(_this, _logsTruncated_initializers, false));
            _this.logsCursor = (__runInitializers(_this, _logsTruncated_extraInitializers), __runInitializers(_this, _logsCursor_initializers, null));
            _this.logsLastFetchAt = (__runInitializers(_this, _logsCursor_extraInitializers), __runInitializers(_this, _logsLastFetchAt_initializers, null));
            _this.logsLimit = (__runInitializers(_this, _logsLastFetchAt_extraInitializers), __runInitializers(_this, _logsLimit_initializers, 500));
            _this.logsMaxBytes = (__runInitializers(_this, _logsLimit_extraInitializers), __runInitializers(_this, _logsMaxBytes_initializers, 250000));
            _this.logsAtBottom = (__runInitializers(_this, _logsMaxBytes_extraInitializers), __runInitializers(_this, _logsAtBottom_initializers, true));
            _this.client = (__runInitializers(_this, _logsAtBottom_extraInitializers), null);
            _this.chatScrollFrame = null;
            _this.chatScrollTimeout = null;
            _this.chatHasAutoScrolled = false;
            _this.chatUserNearBottom = true;
            _this.chatNewMessagesBelow = __runInitializers(_this, _chatNewMessagesBelow_initializers, false);
            _this.nodesPollInterval = (__runInitializers(_this, _chatNewMessagesBelow_extraInitializers), null);
            _this.logsPollInterval = null;
            _this.debugPollInterval = null;
            _this.logsScrollFrame = null;
            _this.toolStreamById = new Map();
            _this.toolStreamOrder = [];
            _this.refreshSessionsAfterChat = new Set();
            _this.basePath = "";
            _this.popStateHandler = function () {
                return (0, app_settings_1.onPopState)(_this);
            };
            _this.themeMedia = null;
            _this.themeMediaHandler = null;
            _this.topbarObserver = null;
            return _this;
        }
        OpenClawApp_1.prototype.createRenderRoot = function () {
            return this;
        };
        OpenClawApp_1.prototype.connectedCallback = function () {
            _super.prototype.connectedCallback.call(this);
            (0, app_lifecycle_1.handleConnected)(this);
        };
        OpenClawApp_1.prototype.firstUpdated = function () {
            (0, app_lifecycle_1.handleFirstUpdated)(this);
        };
        OpenClawApp_1.prototype.disconnectedCallback = function () {
            (0, app_lifecycle_1.handleDisconnected)(this);
            _super.prototype.disconnectedCallback.call(this);
        };
        OpenClawApp_1.prototype.updated = function (changed) {
            (0, app_lifecycle_1.handleUpdated)(this, changed);
        };
        OpenClawApp_1.prototype.connect = function () {
            (0, app_gateway_1.connectGateway)(this);
        };
        OpenClawApp_1.prototype.handleChatScroll = function (event) {
            (0, app_scroll_1.handleChatScroll)(this, event);
        };
        OpenClawApp_1.prototype.handleLogsScroll = function (event) {
            (0, app_scroll_1.handleLogsScroll)(this, event);
        };
        OpenClawApp_1.prototype.exportLogs = function (lines, label) {
            (0, app_scroll_1.exportLogs)(lines, label);
        };
        OpenClawApp_1.prototype.resetToolStream = function () {
            (0, app_tool_stream_1.resetToolStream)(this);
        };
        OpenClawApp_1.prototype.resetChatScroll = function () {
            (0, app_scroll_1.resetChatScroll)(this);
        };
        OpenClawApp_1.prototype.scrollToBottom = function () {
            (0, app_scroll_1.resetChatScroll)(this);
            (0, app_scroll_1.scheduleChatScroll)(this, true);
        };
        OpenClawApp_1.prototype.loadAssistantIdentity = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, assistant_identity_2.loadAssistantIdentity)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.applySettings = function (next) {
            (0, app_settings_1.applySettings)(this, next);
        };
        OpenClawApp_1.prototype.setTab = function (next) {
            (0, app_settings_1.setTab)(this, next);
        };
        OpenClawApp_1.prototype.setTheme = function (next, context) {
            (0, app_settings_1.setTheme)(this, next, context);
        };
        OpenClawApp_1.prototype.loadOverview = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_settings_1.loadOverview)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.loadCron = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_settings_1.loadCron)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleAbortChat = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_chat_1.handleAbortChat)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.removeQueuedMessage = function (id) {
            (0, app_chat_1.removeQueuedMessage)(this, id);
        };
        OpenClawApp_1.prototype.handleSendChat = function (messageOverride, opts) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_chat_1.handleSendChat)(this, messageOverride, opts)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleWhatsAppStart = function (force) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_channels_1.handleWhatsAppStart)(this, force)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleWhatsAppWait = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_channels_1.handleWhatsAppWait)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleWhatsAppLogout = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_channels_1.handleWhatsAppLogout)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleChannelConfigSave = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_channels_1.handleChannelConfigSave)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleChannelConfigReload = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_channels_1.handleChannelConfigReload)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleNostrProfileEdit = function (accountId, profile) {
            (0, app_channels_1.handleNostrProfileEdit)(this, accountId, profile);
        };
        OpenClawApp_1.prototype.handleNostrProfileCancel = function () {
            (0, app_channels_1.handleNostrProfileCancel)(this);
        };
        OpenClawApp_1.prototype.handleNostrProfileFieldChange = function (field, value) {
            (0, app_channels_1.handleNostrProfileFieldChange)(this, field, value);
        };
        OpenClawApp_1.prototype.handleNostrProfileSave = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_channels_1.handleNostrProfileSave)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleNostrProfileImport = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, app_channels_1.handleNostrProfileImport)(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleNostrProfileToggleAdvanced = function () {
            (0, app_channels_1.handleNostrProfileToggleAdvanced)(this);
        };
        OpenClawApp_1.prototype.handleExecApprovalDecision = function (decision) {
            return __awaiter(this, void 0, void 0, function () {
                var active, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            active = this.execApprovalQueue[0];
                            if (!active || !this.client || this.execApprovalBusy) {
                                return [2 /*return*/];
                            }
                            this.execApprovalBusy = true;
                            this.execApprovalError = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.client.request("exec.approval.resolve", {
                                    id: active.id,
                                    decision: decision,
                                })];
                        case 2:
                            _a.sent();
                            this.execApprovalQueue = this.execApprovalQueue.filter(function (entry) { return entry.id !== active.id; });
                            return [3 /*break*/, 5];
                        case 3:
                            err_1 = _a.sent();
                            this.execApprovalError = "Exec approval failed: ".concat(String(err_1));
                            return [3 /*break*/, 5];
                        case 4:
                            this.execApprovalBusy = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        OpenClawApp_1.prototype.handleGatewayUrlConfirm = function () {
            var nextGatewayUrl = this.pendingGatewayUrl;
            if (!nextGatewayUrl) {
                return;
            }
            this.pendingGatewayUrl = null;
            (0, app_settings_1.applySettings)(this, __assign(__assign({}, this.settings), { gatewayUrl: nextGatewayUrl }));
            this.connect();
        };
        OpenClawApp_1.prototype.handleGatewayUrlCancel = function () {
            this.pendingGatewayUrl = null;
        };
        // Sidebar handlers for tool output viewing
        OpenClawApp_1.prototype.handleOpenSidebar = function (content) {
            if (this.sidebarCloseTimer != null) {
                window.clearTimeout(this.sidebarCloseTimer);
                this.sidebarCloseTimer = null;
            }
            this.sidebarContent = content;
            this.sidebarError = null;
            this.sidebarOpen = true;
        };
        OpenClawApp_1.prototype.handleCloseSidebar = function () {
            var _this = this;
            this.sidebarOpen = false;
            // Clear content after transition
            if (this.sidebarCloseTimer != null) {
                window.clearTimeout(this.sidebarCloseTimer);
            }
            this.sidebarCloseTimer = window.setTimeout(function () {
                if (_this.sidebarOpen) {
                    return;
                }
                _this.sidebarContent = null;
                _this.sidebarError = null;
                _this.sidebarCloseTimer = null;
            }, 200);
        };
        OpenClawApp_1.prototype.handleSplitRatioChange = function (ratio) {
            var newRatio = Math.max(0.4, Math.min(0.7, ratio));
            this.splitRatio = newRatio;
            this.applySettings(__assign(__assign({}, this.settings), { splitRatio: newRatio }));
        };
        OpenClawApp_1.prototype.render = function () {
            return (0, app_render_1.renderApp)(this);
        };
        return OpenClawApp_1;
    }(_classSuper));
    __setFunctionName(_classThis, "OpenClawApp");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _settings_decorators = [(0, decorators_js_1.state)()];
        _password_decorators = [(0, decorators_js_1.state)()];
        _tab_decorators = [(0, decorators_js_1.state)()];
        _onboarding_decorators = [(0, decorators_js_1.state)()];
        _connected_decorators = [(0, decorators_js_1.state)()];
        _theme_decorators = [(0, decorators_js_1.state)()];
        _themeResolved_decorators = [(0, decorators_js_1.state)()];
        _hello_decorators = [(0, decorators_js_1.state)()];
        _lastError_decorators = [(0, decorators_js_1.state)()];
        _eventLog_decorators = [(0, decorators_js_1.state)()];
        _assistantName_decorators = [(0, decorators_js_1.state)()];
        _assistantAvatar_decorators = [(0, decorators_js_1.state)()];
        _assistantAgentId_decorators = [(0, decorators_js_1.state)()];
        _sessionKey_decorators = [(0, decorators_js_1.state)()];
        _chatLoading_decorators = [(0, decorators_js_1.state)()];
        _chatSending_decorators = [(0, decorators_js_1.state)()];
        _chatMessage_decorators = [(0, decorators_js_1.state)()];
        _chatMessages_decorators = [(0, decorators_js_1.state)()];
        _chatToolMessages_decorators = [(0, decorators_js_1.state)()];
        _chatStream_decorators = [(0, decorators_js_1.state)()];
        _chatStreamStartedAt_decorators = [(0, decorators_js_1.state)()];
        _chatRunId_decorators = [(0, decorators_js_1.state)()];
        _compactionStatus_decorators = [(0, decorators_js_1.state)()];
        _chatAvatarUrl_decorators = [(0, decorators_js_1.state)()];
        _chatThinkingLevel_decorators = [(0, decorators_js_1.state)()];
        _chatQueue_decorators = [(0, decorators_js_1.state)()];
        _chatAttachments_decorators = [(0, decorators_js_1.state)()];
        _sidebarOpen_decorators = [(0, decorators_js_1.state)()];
        _sidebarContent_decorators = [(0, decorators_js_1.state)()];
        _sidebarError_decorators = [(0, decorators_js_1.state)()];
        _splitRatio_decorators = [(0, decorators_js_1.state)()];
        _nodesLoading_decorators = [(0, decorators_js_1.state)()];
        _nodes_decorators = [(0, decorators_js_1.state)()];
        _devicesLoading_decorators = [(0, decorators_js_1.state)()];
        _devicesError_decorators = [(0, decorators_js_1.state)()];
        _devicesList_decorators = [(0, decorators_js_1.state)()];
        _execApprovalsLoading_decorators = [(0, decorators_js_1.state)()];
        _execApprovalsSaving_decorators = [(0, decorators_js_1.state)()];
        _execApprovalsDirty_decorators = [(0, decorators_js_1.state)()];
        _execApprovalsSnapshot_decorators = [(0, decorators_js_1.state)()];
        _execApprovalsForm_decorators = [(0, decorators_js_1.state)()];
        _execApprovalsSelectedAgent_decorators = [(0, decorators_js_1.state)()];
        _execApprovalsTarget_decorators = [(0, decorators_js_1.state)()];
        _execApprovalsTargetNodeId_decorators = [(0, decorators_js_1.state)()];
        _execApprovalQueue_decorators = [(0, decorators_js_1.state)()];
        _execApprovalBusy_decorators = [(0, decorators_js_1.state)()];
        _execApprovalError_decorators = [(0, decorators_js_1.state)()];
        _pendingGatewayUrl_decorators = [(0, decorators_js_1.state)()];
        _configLoading_decorators = [(0, decorators_js_1.state)()];
        _configRaw_decorators = [(0, decorators_js_1.state)()];
        _configRawOriginal_decorators = [(0, decorators_js_1.state)()];
        _configValid_decorators = [(0, decorators_js_1.state)()];
        _configIssues_decorators = [(0, decorators_js_1.state)()];
        _configSaving_decorators = [(0, decorators_js_1.state)()];
        _configApplying_decorators = [(0, decorators_js_1.state)()];
        _updateRunning_decorators = [(0, decorators_js_1.state)()];
        _applySessionKey_decorators = [(0, decorators_js_1.state)()];
        _configSnapshot_decorators = [(0, decorators_js_1.state)()];
        _configSchema_decorators = [(0, decorators_js_1.state)()];
        _configSchemaVersion_decorators = [(0, decorators_js_1.state)()];
        _configSchemaLoading_decorators = [(0, decorators_js_1.state)()];
        _configUiHints_decorators = [(0, decorators_js_1.state)()];
        _configForm_decorators = [(0, decorators_js_1.state)()];
        _configFormOriginal_decorators = [(0, decorators_js_1.state)()];
        _configFormDirty_decorators = [(0, decorators_js_1.state)()];
        _configFormMode_decorators = [(0, decorators_js_1.state)()];
        _configSearchQuery_decorators = [(0, decorators_js_1.state)()];
        _configActiveSection_decorators = [(0, decorators_js_1.state)()];
        _configActiveSubsection_decorators = [(0, decorators_js_1.state)()];
        _channelsLoading_decorators = [(0, decorators_js_1.state)()];
        _channelsSnapshot_decorators = [(0, decorators_js_1.state)()];
        _channelsError_decorators = [(0, decorators_js_1.state)()];
        _channelsLastSuccess_decorators = [(0, decorators_js_1.state)()];
        _whatsappLoginMessage_decorators = [(0, decorators_js_1.state)()];
        _whatsappLoginQrDataUrl_decorators = [(0, decorators_js_1.state)()];
        _whatsappLoginConnected_decorators = [(0, decorators_js_1.state)()];
        _whatsappBusy_decorators = [(0, decorators_js_1.state)()];
        _nostrProfileFormState_decorators = [(0, decorators_js_1.state)()];
        _nostrProfileAccountId_decorators = [(0, decorators_js_1.state)()];
        _presenceLoading_decorators = [(0, decorators_js_1.state)()];
        _presenceEntries_decorators = [(0, decorators_js_1.state)()];
        _presenceError_decorators = [(0, decorators_js_1.state)()];
        _presenceStatus_decorators = [(0, decorators_js_1.state)()];
        _agentsLoading_decorators = [(0, decorators_js_1.state)()];
        _agentsList_decorators = [(0, decorators_js_1.state)()];
        _agentsError_decorators = [(0, decorators_js_1.state)()];
        _sessionsLoading_decorators = [(0, decorators_js_1.state)()];
        _sessionsResult_decorators = [(0, decorators_js_1.state)()];
        _sessionsError_decorators = [(0, decorators_js_1.state)()];
        _sessionsFilterActive_decorators = [(0, decorators_js_1.state)()];
        _sessionsFilterLimit_decorators = [(0, decorators_js_1.state)()];
        _sessionsIncludeGlobal_decorators = [(0, decorators_js_1.state)()];
        _sessionsIncludeUnknown_decorators = [(0, decorators_js_1.state)()];
        _cronLoading_decorators = [(0, decorators_js_1.state)()];
        _cronJobs_decorators = [(0, decorators_js_1.state)()];
        _cronStatus_decorators = [(0, decorators_js_1.state)()];
        _cronError_decorators = [(0, decorators_js_1.state)()];
        _cronForm_decorators = [(0, decorators_js_1.state)()];
        _cronRunsJobId_decorators = [(0, decorators_js_1.state)()];
        _cronRuns_decorators = [(0, decorators_js_1.state)()];
        _cronBusy_decorators = [(0, decorators_js_1.state)()];
        _skillsLoading_decorators = [(0, decorators_js_1.state)()];
        _skillsReport_decorators = [(0, decorators_js_1.state)()];
        _skillsError_decorators = [(0, decorators_js_1.state)()];
        _skillsFilter_decorators = [(0, decorators_js_1.state)()];
        _skillEdits_decorators = [(0, decorators_js_1.state)()];
        _skillsBusyKey_decorators = [(0, decorators_js_1.state)()];
        _skillMessages_decorators = [(0, decorators_js_1.state)()];
        _debugLoading_decorators = [(0, decorators_js_1.state)()];
        _debugStatus_decorators = [(0, decorators_js_1.state)()];
        _debugHealth_decorators = [(0, decorators_js_1.state)()];
        _debugModels_decorators = [(0, decorators_js_1.state)()];
        _debugHeartbeat_decorators = [(0, decorators_js_1.state)()];
        _debugCallMethod_decorators = [(0, decorators_js_1.state)()];
        _debugCallParams_decorators = [(0, decorators_js_1.state)()];
        _debugCallResult_decorators = [(0, decorators_js_1.state)()];
        _debugCallError_decorators = [(0, decorators_js_1.state)()];
        _logsLoading_decorators = [(0, decorators_js_1.state)()];
        _logsError_decorators = [(0, decorators_js_1.state)()];
        _logsFile_decorators = [(0, decorators_js_1.state)()];
        _logsEntries_decorators = [(0, decorators_js_1.state)()];
        _logsFilterText_decorators = [(0, decorators_js_1.state)()];
        _logsLevelFilters_decorators = [(0, decorators_js_1.state)()];
        _logsAutoFollow_decorators = [(0, decorators_js_1.state)()];
        _logsTruncated_decorators = [(0, decorators_js_1.state)()];
        _logsCursor_decorators = [(0, decorators_js_1.state)()];
        _logsLastFetchAt_decorators = [(0, decorators_js_1.state)()];
        _logsLimit_decorators = [(0, decorators_js_1.state)()];
        _logsMaxBytes_decorators = [(0, decorators_js_1.state)()];
        _logsAtBottom_decorators = [(0, decorators_js_1.state)()];
        _chatNewMessagesBelow_decorators = [(0, decorators_js_1.state)()];
        __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: function (obj) { return "settings" in obj; }, get: function (obj) { return obj.settings; }, set: function (obj, value) { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _tab_decorators, { kind: "field", name: "tab", static: false, private: false, access: { has: function (obj) { return "tab" in obj; }, get: function (obj) { return obj.tab; }, set: function (obj, value) { obj.tab = value; } }, metadata: _metadata }, _tab_initializers, _tab_extraInitializers);
        __esDecorate(null, null, _onboarding_decorators, { kind: "field", name: "onboarding", static: false, private: false, access: { has: function (obj) { return "onboarding" in obj; }, get: function (obj) { return obj.onboarding; }, set: function (obj, value) { obj.onboarding = value; } }, metadata: _metadata }, _onboarding_initializers, _onboarding_extraInitializers);
        __esDecorate(null, null, _connected_decorators, { kind: "field", name: "connected", static: false, private: false, access: { has: function (obj) { return "connected" in obj; }, get: function (obj) { return obj.connected; }, set: function (obj, value) { obj.connected = value; } }, metadata: _metadata }, _connected_initializers, _connected_extraInitializers);
        __esDecorate(null, null, _theme_decorators, { kind: "field", name: "theme", static: false, private: false, access: { has: function (obj) { return "theme" in obj; }, get: function (obj) { return obj.theme; }, set: function (obj, value) { obj.theme = value; } }, metadata: _metadata }, _theme_initializers, _theme_extraInitializers);
        __esDecorate(null, null, _themeResolved_decorators, { kind: "field", name: "themeResolved", static: false, private: false, access: { has: function (obj) { return "themeResolved" in obj; }, get: function (obj) { return obj.themeResolved; }, set: function (obj, value) { obj.themeResolved = value; } }, metadata: _metadata }, _themeResolved_initializers, _themeResolved_extraInitializers);
        __esDecorate(null, null, _hello_decorators, { kind: "field", name: "hello", static: false, private: false, access: { has: function (obj) { return "hello" in obj; }, get: function (obj) { return obj.hello; }, set: function (obj, value) { obj.hello = value; } }, metadata: _metadata }, _hello_initializers, _hello_extraInitializers);
        __esDecorate(null, null, _lastError_decorators, { kind: "field", name: "lastError", static: false, private: false, access: { has: function (obj) { return "lastError" in obj; }, get: function (obj) { return obj.lastError; }, set: function (obj, value) { obj.lastError = value; } }, metadata: _metadata }, _lastError_initializers, _lastError_extraInitializers);
        __esDecorate(null, null, _eventLog_decorators, { kind: "field", name: "eventLog", static: false, private: false, access: { has: function (obj) { return "eventLog" in obj; }, get: function (obj) { return obj.eventLog; }, set: function (obj, value) { obj.eventLog = value; } }, metadata: _metadata }, _eventLog_initializers, _eventLog_extraInitializers);
        __esDecorate(null, null, _assistantName_decorators, { kind: "field", name: "assistantName", static: false, private: false, access: { has: function (obj) { return "assistantName" in obj; }, get: function (obj) { return obj.assistantName; }, set: function (obj, value) { obj.assistantName = value; } }, metadata: _metadata }, _assistantName_initializers, _assistantName_extraInitializers);
        __esDecorate(null, null, _assistantAvatar_decorators, { kind: "field", name: "assistantAvatar", static: false, private: false, access: { has: function (obj) { return "assistantAvatar" in obj; }, get: function (obj) { return obj.assistantAvatar; }, set: function (obj, value) { obj.assistantAvatar = value; } }, metadata: _metadata }, _assistantAvatar_initializers, _assistantAvatar_extraInitializers);
        __esDecorate(null, null, _assistantAgentId_decorators, { kind: "field", name: "assistantAgentId", static: false, private: false, access: { has: function (obj) { return "assistantAgentId" in obj; }, get: function (obj) { return obj.assistantAgentId; }, set: function (obj, value) { obj.assistantAgentId = value; } }, metadata: _metadata }, _assistantAgentId_initializers, _assistantAgentId_extraInitializers);
        __esDecorate(null, null, _sessionKey_decorators, { kind: "field", name: "sessionKey", static: false, private: false, access: { has: function (obj) { return "sessionKey" in obj; }, get: function (obj) { return obj.sessionKey; }, set: function (obj, value) { obj.sessionKey = value; } }, metadata: _metadata }, _sessionKey_initializers, _sessionKey_extraInitializers);
        __esDecorate(null, null, _chatLoading_decorators, { kind: "field", name: "chatLoading", static: false, private: false, access: { has: function (obj) { return "chatLoading" in obj; }, get: function (obj) { return obj.chatLoading; }, set: function (obj, value) { obj.chatLoading = value; } }, metadata: _metadata }, _chatLoading_initializers, _chatLoading_extraInitializers);
        __esDecorate(null, null, _chatSending_decorators, { kind: "field", name: "chatSending", static: false, private: false, access: { has: function (obj) { return "chatSending" in obj; }, get: function (obj) { return obj.chatSending; }, set: function (obj, value) { obj.chatSending = value; } }, metadata: _metadata }, _chatSending_initializers, _chatSending_extraInitializers);
        __esDecorate(null, null, _chatMessage_decorators, { kind: "field", name: "chatMessage", static: false, private: false, access: { has: function (obj) { return "chatMessage" in obj; }, get: function (obj) { return obj.chatMessage; }, set: function (obj, value) { obj.chatMessage = value; } }, metadata: _metadata }, _chatMessage_initializers, _chatMessage_extraInitializers);
        __esDecorate(null, null, _chatMessages_decorators, { kind: "field", name: "chatMessages", static: false, private: false, access: { has: function (obj) { return "chatMessages" in obj; }, get: function (obj) { return obj.chatMessages; }, set: function (obj, value) { obj.chatMessages = value; } }, metadata: _metadata }, _chatMessages_initializers, _chatMessages_extraInitializers);
        __esDecorate(null, null, _chatToolMessages_decorators, { kind: "field", name: "chatToolMessages", static: false, private: false, access: { has: function (obj) { return "chatToolMessages" in obj; }, get: function (obj) { return obj.chatToolMessages; }, set: function (obj, value) { obj.chatToolMessages = value; } }, metadata: _metadata }, _chatToolMessages_initializers, _chatToolMessages_extraInitializers);
        __esDecorate(null, null, _chatStream_decorators, { kind: "field", name: "chatStream", static: false, private: false, access: { has: function (obj) { return "chatStream" in obj; }, get: function (obj) { return obj.chatStream; }, set: function (obj, value) { obj.chatStream = value; } }, metadata: _metadata }, _chatStream_initializers, _chatStream_extraInitializers);
        __esDecorate(null, null, _chatStreamStartedAt_decorators, { kind: "field", name: "chatStreamStartedAt", static: false, private: false, access: { has: function (obj) { return "chatStreamStartedAt" in obj; }, get: function (obj) { return obj.chatStreamStartedAt; }, set: function (obj, value) { obj.chatStreamStartedAt = value; } }, metadata: _metadata }, _chatStreamStartedAt_initializers, _chatStreamStartedAt_extraInitializers);
        __esDecorate(null, null, _chatRunId_decorators, { kind: "field", name: "chatRunId", static: false, private: false, access: { has: function (obj) { return "chatRunId" in obj; }, get: function (obj) { return obj.chatRunId; }, set: function (obj, value) { obj.chatRunId = value; } }, metadata: _metadata }, _chatRunId_initializers, _chatRunId_extraInitializers);
        __esDecorate(null, null, _compactionStatus_decorators, { kind: "field", name: "compactionStatus", static: false, private: false, access: { has: function (obj) { return "compactionStatus" in obj; }, get: function (obj) { return obj.compactionStatus; }, set: function (obj, value) { obj.compactionStatus = value; } }, metadata: _metadata }, _compactionStatus_initializers, _compactionStatus_extraInitializers);
        __esDecorate(null, null, _chatAvatarUrl_decorators, { kind: "field", name: "chatAvatarUrl", static: false, private: false, access: { has: function (obj) { return "chatAvatarUrl" in obj; }, get: function (obj) { return obj.chatAvatarUrl; }, set: function (obj, value) { obj.chatAvatarUrl = value; } }, metadata: _metadata }, _chatAvatarUrl_initializers, _chatAvatarUrl_extraInitializers);
        __esDecorate(null, null, _chatThinkingLevel_decorators, { kind: "field", name: "chatThinkingLevel", static: false, private: false, access: { has: function (obj) { return "chatThinkingLevel" in obj; }, get: function (obj) { return obj.chatThinkingLevel; }, set: function (obj, value) { obj.chatThinkingLevel = value; } }, metadata: _metadata }, _chatThinkingLevel_initializers, _chatThinkingLevel_extraInitializers);
        __esDecorate(null, null, _chatQueue_decorators, { kind: "field", name: "chatQueue", static: false, private: false, access: { has: function (obj) { return "chatQueue" in obj; }, get: function (obj) { return obj.chatQueue; }, set: function (obj, value) { obj.chatQueue = value; } }, metadata: _metadata }, _chatQueue_initializers, _chatQueue_extraInitializers);
        __esDecorate(null, null, _chatAttachments_decorators, { kind: "field", name: "chatAttachments", static: false, private: false, access: { has: function (obj) { return "chatAttachments" in obj; }, get: function (obj) { return obj.chatAttachments; }, set: function (obj, value) { obj.chatAttachments = value; } }, metadata: _metadata }, _chatAttachments_initializers, _chatAttachments_extraInitializers);
        __esDecorate(null, null, _sidebarOpen_decorators, { kind: "field", name: "sidebarOpen", static: false, private: false, access: { has: function (obj) { return "sidebarOpen" in obj; }, get: function (obj) { return obj.sidebarOpen; }, set: function (obj, value) { obj.sidebarOpen = value; } }, metadata: _metadata }, _sidebarOpen_initializers, _sidebarOpen_extraInitializers);
        __esDecorate(null, null, _sidebarContent_decorators, { kind: "field", name: "sidebarContent", static: false, private: false, access: { has: function (obj) { return "sidebarContent" in obj; }, get: function (obj) { return obj.sidebarContent; }, set: function (obj, value) { obj.sidebarContent = value; } }, metadata: _metadata }, _sidebarContent_initializers, _sidebarContent_extraInitializers);
        __esDecorate(null, null, _sidebarError_decorators, { kind: "field", name: "sidebarError", static: false, private: false, access: { has: function (obj) { return "sidebarError" in obj; }, get: function (obj) { return obj.sidebarError; }, set: function (obj, value) { obj.sidebarError = value; } }, metadata: _metadata }, _sidebarError_initializers, _sidebarError_extraInitializers);
        __esDecorate(null, null, _splitRatio_decorators, { kind: "field", name: "splitRatio", static: false, private: false, access: { has: function (obj) { return "splitRatio" in obj; }, get: function (obj) { return obj.splitRatio; }, set: function (obj, value) { obj.splitRatio = value; } }, metadata: _metadata }, _splitRatio_initializers, _splitRatio_extraInitializers);
        __esDecorate(null, null, _nodesLoading_decorators, { kind: "field", name: "nodesLoading", static: false, private: false, access: { has: function (obj) { return "nodesLoading" in obj; }, get: function (obj) { return obj.nodesLoading; }, set: function (obj, value) { obj.nodesLoading = value; } }, metadata: _metadata }, _nodesLoading_initializers, _nodesLoading_extraInitializers);
        __esDecorate(null, null, _nodes_decorators, { kind: "field", name: "nodes", static: false, private: false, access: { has: function (obj) { return "nodes" in obj; }, get: function (obj) { return obj.nodes; }, set: function (obj, value) { obj.nodes = value; } }, metadata: _metadata }, _nodes_initializers, _nodes_extraInitializers);
        __esDecorate(null, null, _devicesLoading_decorators, { kind: "field", name: "devicesLoading", static: false, private: false, access: { has: function (obj) { return "devicesLoading" in obj; }, get: function (obj) { return obj.devicesLoading; }, set: function (obj, value) { obj.devicesLoading = value; } }, metadata: _metadata }, _devicesLoading_initializers, _devicesLoading_extraInitializers);
        __esDecorate(null, null, _devicesError_decorators, { kind: "field", name: "devicesError", static: false, private: false, access: { has: function (obj) { return "devicesError" in obj; }, get: function (obj) { return obj.devicesError; }, set: function (obj, value) { obj.devicesError = value; } }, metadata: _metadata }, _devicesError_initializers, _devicesError_extraInitializers);
        __esDecorate(null, null, _devicesList_decorators, { kind: "field", name: "devicesList", static: false, private: false, access: { has: function (obj) { return "devicesList" in obj; }, get: function (obj) { return obj.devicesList; }, set: function (obj, value) { obj.devicesList = value; } }, metadata: _metadata }, _devicesList_initializers, _devicesList_extraInitializers);
        __esDecorate(null, null, _execApprovalsLoading_decorators, { kind: "field", name: "execApprovalsLoading", static: false, private: false, access: { has: function (obj) { return "execApprovalsLoading" in obj; }, get: function (obj) { return obj.execApprovalsLoading; }, set: function (obj, value) { obj.execApprovalsLoading = value; } }, metadata: _metadata }, _execApprovalsLoading_initializers, _execApprovalsLoading_extraInitializers);
        __esDecorate(null, null, _execApprovalsSaving_decorators, { kind: "field", name: "execApprovalsSaving", static: false, private: false, access: { has: function (obj) { return "execApprovalsSaving" in obj; }, get: function (obj) { return obj.execApprovalsSaving; }, set: function (obj, value) { obj.execApprovalsSaving = value; } }, metadata: _metadata }, _execApprovalsSaving_initializers, _execApprovalsSaving_extraInitializers);
        __esDecorate(null, null, _execApprovalsDirty_decorators, { kind: "field", name: "execApprovalsDirty", static: false, private: false, access: { has: function (obj) { return "execApprovalsDirty" in obj; }, get: function (obj) { return obj.execApprovalsDirty; }, set: function (obj, value) { obj.execApprovalsDirty = value; } }, metadata: _metadata }, _execApprovalsDirty_initializers, _execApprovalsDirty_extraInitializers);
        __esDecorate(null, null, _execApprovalsSnapshot_decorators, { kind: "field", name: "execApprovalsSnapshot", static: false, private: false, access: { has: function (obj) { return "execApprovalsSnapshot" in obj; }, get: function (obj) { return obj.execApprovalsSnapshot; }, set: function (obj, value) { obj.execApprovalsSnapshot = value; } }, metadata: _metadata }, _execApprovalsSnapshot_initializers, _execApprovalsSnapshot_extraInitializers);
        __esDecorate(null, null, _execApprovalsForm_decorators, { kind: "field", name: "execApprovalsForm", static: false, private: false, access: { has: function (obj) { return "execApprovalsForm" in obj; }, get: function (obj) { return obj.execApprovalsForm; }, set: function (obj, value) { obj.execApprovalsForm = value; } }, metadata: _metadata }, _execApprovalsForm_initializers, _execApprovalsForm_extraInitializers);
        __esDecorate(null, null, _execApprovalsSelectedAgent_decorators, { kind: "field", name: "execApprovalsSelectedAgent", static: false, private: false, access: { has: function (obj) { return "execApprovalsSelectedAgent" in obj; }, get: function (obj) { return obj.execApprovalsSelectedAgent; }, set: function (obj, value) { obj.execApprovalsSelectedAgent = value; } }, metadata: _metadata }, _execApprovalsSelectedAgent_initializers, _execApprovalsSelectedAgent_extraInitializers);
        __esDecorate(null, null, _execApprovalsTarget_decorators, { kind: "field", name: "execApprovalsTarget", static: false, private: false, access: { has: function (obj) { return "execApprovalsTarget" in obj; }, get: function (obj) { return obj.execApprovalsTarget; }, set: function (obj, value) { obj.execApprovalsTarget = value; } }, metadata: _metadata }, _execApprovalsTarget_initializers, _execApprovalsTarget_extraInitializers);
        __esDecorate(null, null, _execApprovalsTargetNodeId_decorators, { kind: "field", name: "execApprovalsTargetNodeId", static: false, private: false, access: { has: function (obj) { return "execApprovalsTargetNodeId" in obj; }, get: function (obj) { return obj.execApprovalsTargetNodeId; }, set: function (obj, value) { obj.execApprovalsTargetNodeId = value; } }, metadata: _metadata }, _execApprovalsTargetNodeId_initializers, _execApprovalsTargetNodeId_extraInitializers);
        __esDecorate(null, null, _execApprovalQueue_decorators, { kind: "field", name: "execApprovalQueue", static: false, private: false, access: { has: function (obj) { return "execApprovalQueue" in obj; }, get: function (obj) { return obj.execApprovalQueue; }, set: function (obj, value) { obj.execApprovalQueue = value; } }, metadata: _metadata }, _execApprovalQueue_initializers, _execApprovalQueue_extraInitializers);
        __esDecorate(null, null, _execApprovalBusy_decorators, { kind: "field", name: "execApprovalBusy", static: false, private: false, access: { has: function (obj) { return "execApprovalBusy" in obj; }, get: function (obj) { return obj.execApprovalBusy; }, set: function (obj, value) { obj.execApprovalBusy = value; } }, metadata: _metadata }, _execApprovalBusy_initializers, _execApprovalBusy_extraInitializers);
        __esDecorate(null, null, _execApprovalError_decorators, { kind: "field", name: "execApprovalError", static: false, private: false, access: { has: function (obj) { return "execApprovalError" in obj; }, get: function (obj) { return obj.execApprovalError; }, set: function (obj, value) { obj.execApprovalError = value; } }, metadata: _metadata }, _execApprovalError_initializers, _execApprovalError_extraInitializers);
        __esDecorate(null, null, _pendingGatewayUrl_decorators, { kind: "field", name: "pendingGatewayUrl", static: false, private: false, access: { has: function (obj) { return "pendingGatewayUrl" in obj; }, get: function (obj) { return obj.pendingGatewayUrl; }, set: function (obj, value) { obj.pendingGatewayUrl = value; } }, metadata: _metadata }, _pendingGatewayUrl_initializers, _pendingGatewayUrl_extraInitializers);
        __esDecorate(null, null, _configLoading_decorators, { kind: "field", name: "configLoading", static: false, private: false, access: { has: function (obj) { return "configLoading" in obj; }, get: function (obj) { return obj.configLoading; }, set: function (obj, value) { obj.configLoading = value; } }, metadata: _metadata }, _configLoading_initializers, _configLoading_extraInitializers);
        __esDecorate(null, null, _configRaw_decorators, { kind: "field", name: "configRaw", static: false, private: false, access: { has: function (obj) { return "configRaw" in obj; }, get: function (obj) { return obj.configRaw; }, set: function (obj, value) { obj.configRaw = value; } }, metadata: _metadata }, _configRaw_initializers, _configRaw_extraInitializers);
        __esDecorate(null, null, _configRawOriginal_decorators, { kind: "field", name: "configRawOriginal", static: false, private: false, access: { has: function (obj) { return "configRawOriginal" in obj; }, get: function (obj) { return obj.configRawOriginal; }, set: function (obj, value) { obj.configRawOriginal = value; } }, metadata: _metadata }, _configRawOriginal_initializers, _configRawOriginal_extraInitializers);
        __esDecorate(null, null, _configValid_decorators, { kind: "field", name: "configValid", static: false, private: false, access: { has: function (obj) { return "configValid" in obj; }, get: function (obj) { return obj.configValid; }, set: function (obj, value) { obj.configValid = value; } }, metadata: _metadata }, _configValid_initializers, _configValid_extraInitializers);
        __esDecorate(null, null, _configIssues_decorators, { kind: "field", name: "configIssues", static: false, private: false, access: { has: function (obj) { return "configIssues" in obj; }, get: function (obj) { return obj.configIssues; }, set: function (obj, value) { obj.configIssues = value; } }, metadata: _metadata }, _configIssues_initializers, _configIssues_extraInitializers);
        __esDecorate(null, null, _configSaving_decorators, { kind: "field", name: "configSaving", static: false, private: false, access: { has: function (obj) { return "configSaving" in obj; }, get: function (obj) { return obj.configSaving; }, set: function (obj, value) { obj.configSaving = value; } }, metadata: _metadata }, _configSaving_initializers, _configSaving_extraInitializers);
        __esDecorate(null, null, _configApplying_decorators, { kind: "field", name: "configApplying", static: false, private: false, access: { has: function (obj) { return "configApplying" in obj; }, get: function (obj) { return obj.configApplying; }, set: function (obj, value) { obj.configApplying = value; } }, metadata: _metadata }, _configApplying_initializers, _configApplying_extraInitializers);
        __esDecorate(null, null, _updateRunning_decorators, { kind: "field", name: "updateRunning", static: false, private: false, access: { has: function (obj) { return "updateRunning" in obj; }, get: function (obj) { return obj.updateRunning; }, set: function (obj, value) { obj.updateRunning = value; } }, metadata: _metadata }, _updateRunning_initializers, _updateRunning_extraInitializers);
        __esDecorate(null, null, _applySessionKey_decorators, { kind: "field", name: "applySessionKey", static: false, private: false, access: { has: function (obj) { return "applySessionKey" in obj; }, get: function (obj) { return obj.applySessionKey; }, set: function (obj, value) { obj.applySessionKey = value; } }, metadata: _metadata }, _applySessionKey_initializers, _applySessionKey_extraInitializers);
        __esDecorate(null, null, _configSnapshot_decorators, { kind: "field", name: "configSnapshot", static: false, private: false, access: { has: function (obj) { return "configSnapshot" in obj; }, get: function (obj) { return obj.configSnapshot; }, set: function (obj, value) { obj.configSnapshot = value; } }, metadata: _metadata }, _configSnapshot_initializers, _configSnapshot_extraInitializers);
        __esDecorate(null, null, _configSchema_decorators, { kind: "field", name: "configSchema", static: false, private: false, access: { has: function (obj) { return "configSchema" in obj; }, get: function (obj) { return obj.configSchema; }, set: function (obj, value) { obj.configSchema = value; } }, metadata: _metadata }, _configSchema_initializers, _configSchema_extraInitializers);
        __esDecorate(null, null, _configSchemaVersion_decorators, { kind: "field", name: "configSchemaVersion", static: false, private: false, access: { has: function (obj) { return "configSchemaVersion" in obj; }, get: function (obj) { return obj.configSchemaVersion; }, set: function (obj, value) { obj.configSchemaVersion = value; } }, metadata: _metadata }, _configSchemaVersion_initializers, _configSchemaVersion_extraInitializers);
        __esDecorate(null, null, _configSchemaLoading_decorators, { kind: "field", name: "configSchemaLoading", static: false, private: false, access: { has: function (obj) { return "configSchemaLoading" in obj; }, get: function (obj) { return obj.configSchemaLoading; }, set: function (obj, value) { obj.configSchemaLoading = value; } }, metadata: _metadata }, _configSchemaLoading_initializers, _configSchemaLoading_extraInitializers);
        __esDecorate(null, null, _configUiHints_decorators, { kind: "field", name: "configUiHints", static: false, private: false, access: { has: function (obj) { return "configUiHints" in obj; }, get: function (obj) { return obj.configUiHints; }, set: function (obj, value) { obj.configUiHints = value; } }, metadata: _metadata }, _configUiHints_initializers, _configUiHints_extraInitializers);
        __esDecorate(null, null, _configForm_decorators, { kind: "field", name: "configForm", static: false, private: false, access: { has: function (obj) { return "configForm" in obj; }, get: function (obj) { return obj.configForm; }, set: function (obj, value) { obj.configForm = value; } }, metadata: _metadata }, _configForm_initializers, _configForm_extraInitializers);
        __esDecorate(null, null, _configFormOriginal_decorators, { kind: "field", name: "configFormOriginal", static: false, private: false, access: { has: function (obj) { return "configFormOriginal" in obj; }, get: function (obj) { return obj.configFormOriginal; }, set: function (obj, value) { obj.configFormOriginal = value; } }, metadata: _metadata }, _configFormOriginal_initializers, _configFormOriginal_extraInitializers);
        __esDecorate(null, null, _configFormDirty_decorators, { kind: "field", name: "configFormDirty", static: false, private: false, access: { has: function (obj) { return "configFormDirty" in obj; }, get: function (obj) { return obj.configFormDirty; }, set: function (obj, value) { obj.configFormDirty = value; } }, metadata: _metadata }, _configFormDirty_initializers, _configFormDirty_extraInitializers);
        __esDecorate(null, null, _configFormMode_decorators, { kind: "field", name: "configFormMode", static: false, private: false, access: { has: function (obj) { return "configFormMode" in obj; }, get: function (obj) { return obj.configFormMode; }, set: function (obj, value) { obj.configFormMode = value; } }, metadata: _metadata }, _configFormMode_initializers, _configFormMode_extraInitializers);
        __esDecorate(null, null, _configSearchQuery_decorators, { kind: "field", name: "configSearchQuery", static: false, private: false, access: { has: function (obj) { return "configSearchQuery" in obj; }, get: function (obj) { return obj.configSearchQuery; }, set: function (obj, value) { obj.configSearchQuery = value; } }, metadata: _metadata }, _configSearchQuery_initializers, _configSearchQuery_extraInitializers);
        __esDecorate(null, null, _configActiveSection_decorators, { kind: "field", name: "configActiveSection", static: false, private: false, access: { has: function (obj) { return "configActiveSection" in obj; }, get: function (obj) { return obj.configActiveSection; }, set: function (obj, value) { obj.configActiveSection = value; } }, metadata: _metadata }, _configActiveSection_initializers, _configActiveSection_extraInitializers);
        __esDecorate(null, null, _configActiveSubsection_decorators, { kind: "field", name: "configActiveSubsection", static: false, private: false, access: { has: function (obj) { return "configActiveSubsection" in obj; }, get: function (obj) { return obj.configActiveSubsection; }, set: function (obj, value) { obj.configActiveSubsection = value; } }, metadata: _metadata }, _configActiveSubsection_initializers, _configActiveSubsection_extraInitializers);
        __esDecorate(null, null, _channelsLoading_decorators, { kind: "field", name: "channelsLoading", static: false, private: false, access: { has: function (obj) { return "channelsLoading" in obj; }, get: function (obj) { return obj.channelsLoading; }, set: function (obj, value) { obj.channelsLoading = value; } }, metadata: _metadata }, _channelsLoading_initializers, _channelsLoading_extraInitializers);
        __esDecorate(null, null, _channelsSnapshot_decorators, { kind: "field", name: "channelsSnapshot", static: false, private: false, access: { has: function (obj) { return "channelsSnapshot" in obj; }, get: function (obj) { return obj.channelsSnapshot; }, set: function (obj, value) { obj.channelsSnapshot = value; } }, metadata: _metadata }, _channelsSnapshot_initializers, _channelsSnapshot_extraInitializers);
        __esDecorate(null, null, _channelsError_decorators, { kind: "field", name: "channelsError", static: false, private: false, access: { has: function (obj) { return "channelsError" in obj; }, get: function (obj) { return obj.channelsError; }, set: function (obj, value) { obj.channelsError = value; } }, metadata: _metadata }, _channelsError_initializers, _channelsError_extraInitializers);
        __esDecorate(null, null, _channelsLastSuccess_decorators, { kind: "field", name: "channelsLastSuccess", static: false, private: false, access: { has: function (obj) { return "channelsLastSuccess" in obj; }, get: function (obj) { return obj.channelsLastSuccess; }, set: function (obj, value) { obj.channelsLastSuccess = value; } }, metadata: _metadata }, _channelsLastSuccess_initializers, _channelsLastSuccess_extraInitializers);
        __esDecorate(null, null, _whatsappLoginMessage_decorators, { kind: "field", name: "whatsappLoginMessage", static: false, private: false, access: { has: function (obj) { return "whatsappLoginMessage" in obj; }, get: function (obj) { return obj.whatsappLoginMessage; }, set: function (obj, value) { obj.whatsappLoginMessage = value; } }, metadata: _metadata }, _whatsappLoginMessage_initializers, _whatsappLoginMessage_extraInitializers);
        __esDecorate(null, null, _whatsappLoginQrDataUrl_decorators, { kind: "field", name: "whatsappLoginQrDataUrl", static: false, private: false, access: { has: function (obj) { return "whatsappLoginQrDataUrl" in obj; }, get: function (obj) { return obj.whatsappLoginQrDataUrl; }, set: function (obj, value) { obj.whatsappLoginQrDataUrl = value; } }, metadata: _metadata }, _whatsappLoginQrDataUrl_initializers, _whatsappLoginQrDataUrl_extraInitializers);
        __esDecorate(null, null, _whatsappLoginConnected_decorators, { kind: "field", name: "whatsappLoginConnected", static: false, private: false, access: { has: function (obj) { return "whatsappLoginConnected" in obj; }, get: function (obj) { return obj.whatsappLoginConnected; }, set: function (obj, value) { obj.whatsappLoginConnected = value; } }, metadata: _metadata }, _whatsappLoginConnected_initializers, _whatsappLoginConnected_extraInitializers);
        __esDecorate(null, null, _whatsappBusy_decorators, { kind: "field", name: "whatsappBusy", static: false, private: false, access: { has: function (obj) { return "whatsappBusy" in obj; }, get: function (obj) { return obj.whatsappBusy; }, set: function (obj, value) { obj.whatsappBusy = value; } }, metadata: _metadata }, _whatsappBusy_initializers, _whatsappBusy_extraInitializers);
        __esDecorate(null, null, _nostrProfileFormState_decorators, { kind: "field", name: "nostrProfileFormState", static: false, private: false, access: { has: function (obj) { return "nostrProfileFormState" in obj; }, get: function (obj) { return obj.nostrProfileFormState; }, set: function (obj, value) { obj.nostrProfileFormState = value; } }, metadata: _metadata }, _nostrProfileFormState_initializers, _nostrProfileFormState_extraInitializers);
        __esDecorate(null, null, _nostrProfileAccountId_decorators, { kind: "field", name: "nostrProfileAccountId", static: false, private: false, access: { has: function (obj) { return "nostrProfileAccountId" in obj; }, get: function (obj) { return obj.nostrProfileAccountId; }, set: function (obj, value) { obj.nostrProfileAccountId = value; } }, metadata: _metadata }, _nostrProfileAccountId_initializers, _nostrProfileAccountId_extraInitializers);
        __esDecorate(null, null, _presenceLoading_decorators, { kind: "field", name: "presenceLoading", static: false, private: false, access: { has: function (obj) { return "presenceLoading" in obj; }, get: function (obj) { return obj.presenceLoading; }, set: function (obj, value) { obj.presenceLoading = value; } }, metadata: _metadata }, _presenceLoading_initializers, _presenceLoading_extraInitializers);
        __esDecorate(null, null, _presenceEntries_decorators, { kind: "field", name: "presenceEntries", static: false, private: false, access: { has: function (obj) { return "presenceEntries" in obj; }, get: function (obj) { return obj.presenceEntries; }, set: function (obj, value) { obj.presenceEntries = value; } }, metadata: _metadata }, _presenceEntries_initializers, _presenceEntries_extraInitializers);
        __esDecorate(null, null, _presenceError_decorators, { kind: "field", name: "presenceError", static: false, private: false, access: { has: function (obj) { return "presenceError" in obj; }, get: function (obj) { return obj.presenceError; }, set: function (obj, value) { obj.presenceError = value; } }, metadata: _metadata }, _presenceError_initializers, _presenceError_extraInitializers);
        __esDecorate(null, null, _presenceStatus_decorators, { kind: "field", name: "presenceStatus", static: false, private: false, access: { has: function (obj) { return "presenceStatus" in obj; }, get: function (obj) { return obj.presenceStatus; }, set: function (obj, value) { obj.presenceStatus = value; } }, metadata: _metadata }, _presenceStatus_initializers, _presenceStatus_extraInitializers);
        __esDecorate(null, null, _agentsLoading_decorators, { kind: "field", name: "agentsLoading", static: false, private: false, access: { has: function (obj) { return "agentsLoading" in obj; }, get: function (obj) { return obj.agentsLoading; }, set: function (obj, value) { obj.agentsLoading = value; } }, metadata: _metadata }, _agentsLoading_initializers, _agentsLoading_extraInitializers);
        __esDecorate(null, null, _agentsList_decorators, { kind: "field", name: "agentsList", static: false, private: false, access: { has: function (obj) { return "agentsList" in obj; }, get: function (obj) { return obj.agentsList; }, set: function (obj, value) { obj.agentsList = value; } }, metadata: _metadata }, _agentsList_initializers, _agentsList_extraInitializers);
        __esDecorate(null, null, _agentsError_decorators, { kind: "field", name: "agentsError", static: false, private: false, access: { has: function (obj) { return "agentsError" in obj; }, get: function (obj) { return obj.agentsError; }, set: function (obj, value) { obj.agentsError = value; } }, metadata: _metadata }, _agentsError_initializers, _agentsError_extraInitializers);
        __esDecorate(null, null, _sessionsLoading_decorators, { kind: "field", name: "sessionsLoading", static: false, private: false, access: { has: function (obj) { return "sessionsLoading" in obj; }, get: function (obj) { return obj.sessionsLoading; }, set: function (obj, value) { obj.sessionsLoading = value; } }, metadata: _metadata }, _sessionsLoading_initializers, _sessionsLoading_extraInitializers);
        __esDecorate(null, null, _sessionsResult_decorators, { kind: "field", name: "sessionsResult", static: false, private: false, access: { has: function (obj) { return "sessionsResult" in obj; }, get: function (obj) { return obj.sessionsResult; }, set: function (obj, value) { obj.sessionsResult = value; } }, metadata: _metadata }, _sessionsResult_initializers, _sessionsResult_extraInitializers);
        __esDecorate(null, null, _sessionsError_decorators, { kind: "field", name: "sessionsError", static: false, private: false, access: { has: function (obj) { return "sessionsError" in obj; }, get: function (obj) { return obj.sessionsError; }, set: function (obj, value) { obj.sessionsError = value; } }, metadata: _metadata }, _sessionsError_initializers, _sessionsError_extraInitializers);
        __esDecorate(null, null, _sessionsFilterActive_decorators, { kind: "field", name: "sessionsFilterActive", static: false, private: false, access: { has: function (obj) { return "sessionsFilterActive" in obj; }, get: function (obj) { return obj.sessionsFilterActive; }, set: function (obj, value) { obj.sessionsFilterActive = value; } }, metadata: _metadata }, _sessionsFilterActive_initializers, _sessionsFilterActive_extraInitializers);
        __esDecorate(null, null, _sessionsFilterLimit_decorators, { kind: "field", name: "sessionsFilterLimit", static: false, private: false, access: { has: function (obj) { return "sessionsFilterLimit" in obj; }, get: function (obj) { return obj.sessionsFilterLimit; }, set: function (obj, value) { obj.sessionsFilterLimit = value; } }, metadata: _metadata }, _sessionsFilterLimit_initializers, _sessionsFilterLimit_extraInitializers);
        __esDecorate(null, null, _sessionsIncludeGlobal_decorators, { kind: "field", name: "sessionsIncludeGlobal", static: false, private: false, access: { has: function (obj) { return "sessionsIncludeGlobal" in obj; }, get: function (obj) { return obj.sessionsIncludeGlobal; }, set: function (obj, value) { obj.sessionsIncludeGlobal = value; } }, metadata: _metadata }, _sessionsIncludeGlobal_initializers, _sessionsIncludeGlobal_extraInitializers);
        __esDecorate(null, null, _sessionsIncludeUnknown_decorators, { kind: "field", name: "sessionsIncludeUnknown", static: false, private: false, access: { has: function (obj) { return "sessionsIncludeUnknown" in obj; }, get: function (obj) { return obj.sessionsIncludeUnknown; }, set: function (obj, value) { obj.sessionsIncludeUnknown = value; } }, metadata: _metadata }, _sessionsIncludeUnknown_initializers, _sessionsIncludeUnknown_extraInitializers);
        __esDecorate(null, null, _cronLoading_decorators, { kind: "field", name: "cronLoading", static: false, private: false, access: { has: function (obj) { return "cronLoading" in obj; }, get: function (obj) { return obj.cronLoading; }, set: function (obj, value) { obj.cronLoading = value; } }, metadata: _metadata }, _cronLoading_initializers, _cronLoading_extraInitializers);
        __esDecorate(null, null, _cronJobs_decorators, { kind: "field", name: "cronJobs", static: false, private: false, access: { has: function (obj) { return "cronJobs" in obj; }, get: function (obj) { return obj.cronJobs; }, set: function (obj, value) { obj.cronJobs = value; } }, metadata: _metadata }, _cronJobs_initializers, _cronJobs_extraInitializers);
        __esDecorate(null, null, _cronStatus_decorators, { kind: "field", name: "cronStatus", static: false, private: false, access: { has: function (obj) { return "cronStatus" in obj; }, get: function (obj) { return obj.cronStatus; }, set: function (obj, value) { obj.cronStatus = value; } }, metadata: _metadata }, _cronStatus_initializers, _cronStatus_extraInitializers);
        __esDecorate(null, null, _cronError_decorators, { kind: "field", name: "cronError", static: false, private: false, access: { has: function (obj) { return "cronError" in obj; }, get: function (obj) { return obj.cronError; }, set: function (obj, value) { obj.cronError = value; } }, metadata: _metadata }, _cronError_initializers, _cronError_extraInitializers);
        __esDecorate(null, null, _cronForm_decorators, { kind: "field", name: "cronForm", static: false, private: false, access: { has: function (obj) { return "cronForm" in obj; }, get: function (obj) { return obj.cronForm; }, set: function (obj, value) { obj.cronForm = value; } }, metadata: _metadata }, _cronForm_initializers, _cronForm_extraInitializers);
        __esDecorate(null, null, _cronRunsJobId_decorators, { kind: "field", name: "cronRunsJobId", static: false, private: false, access: { has: function (obj) { return "cronRunsJobId" in obj; }, get: function (obj) { return obj.cronRunsJobId; }, set: function (obj, value) { obj.cronRunsJobId = value; } }, metadata: _metadata }, _cronRunsJobId_initializers, _cronRunsJobId_extraInitializers);
        __esDecorate(null, null, _cronRuns_decorators, { kind: "field", name: "cronRuns", static: false, private: false, access: { has: function (obj) { return "cronRuns" in obj; }, get: function (obj) { return obj.cronRuns; }, set: function (obj, value) { obj.cronRuns = value; } }, metadata: _metadata }, _cronRuns_initializers, _cronRuns_extraInitializers);
        __esDecorate(null, null, _cronBusy_decorators, { kind: "field", name: "cronBusy", static: false, private: false, access: { has: function (obj) { return "cronBusy" in obj; }, get: function (obj) { return obj.cronBusy; }, set: function (obj, value) { obj.cronBusy = value; } }, metadata: _metadata }, _cronBusy_initializers, _cronBusy_extraInitializers);
        __esDecorate(null, null, _skillsLoading_decorators, { kind: "field", name: "skillsLoading", static: false, private: false, access: { has: function (obj) { return "skillsLoading" in obj; }, get: function (obj) { return obj.skillsLoading; }, set: function (obj, value) { obj.skillsLoading = value; } }, metadata: _metadata }, _skillsLoading_initializers, _skillsLoading_extraInitializers);
        __esDecorate(null, null, _skillsReport_decorators, { kind: "field", name: "skillsReport", static: false, private: false, access: { has: function (obj) { return "skillsReport" in obj; }, get: function (obj) { return obj.skillsReport; }, set: function (obj, value) { obj.skillsReport = value; } }, metadata: _metadata }, _skillsReport_initializers, _skillsReport_extraInitializers);
        __esDecorate(null, null, _skillsError_decorators, { kind: "field", name: "skillsError", static: false, private: false, access: { has: function (obj) { return "skillsError" in obj; }, get: function (obj) { return obj.skillsError; }, set: function (obj, value) { obj.skillsError = value; } }, metadata: _metadata }, _skillsError_initializers, _skillsError_extraInitializers);
        __esDecorate(null, null, _skillsFilter_decorators, { kind: "field", name: "skillsFilter", static: false, private: false, access: { has: function (obj) { return "skillsFilter" in obj; }, get: function (obj) { return obj.skillsFilter; }, set: function (obj, value) { obj.skillsFilter = value; } }, metadata: _metadata }, _skillsFilter_initializers, _skillsFilter_extraInitializers);
        __esDecorate(null, null, _skillEdits_decorators, { kind: "field", name: "skillEdits", static: false, private: false, access: { has: function (obj) { return "skillEdits" in obj; }, get: function (obj) { return obj.skillEdits; }, set: function (obj, value) { obj.skillEdits = value; } }, metadata: _metadata }, _skillEdits_initializers, _skillEdits_extraInitializers);
        __esDecorate(null, null, _skillsBusyKey_decorators, { kind: "field", name: "skillsBusyKey", static: false, private: false, access: { has: function (obj) { return "skillsBusyKey" in obj; }, get: function (obj) { return obj.skillsBusyKey; }, set: function (obj, value) { obj.skillsBusyKey = value; } }, metadata: _metadata }, _skillsBusyKey_initializers, _skillsBusyKey_extraInitializers);
        __esDecorate(null, null, _skillMessages_decorators, { kind: "field", name: "skillMessages", static: false, private: false, access: { has: function (obj) { return "skillMessages" in obj; }, get: function (obj) { return obj.skillMessages; }, set: function (obj, value) { obj.skillMessages = value; } }, metadata: _metadata }, _skillMessages_initializers, _skillMessages_extraInitializers);
        __esDecorate(null, null, _debugLoading_decorators, { kind: "field", name: "debugLoading", static: false, private: false, access: { has: function (obj) { return "debugLoading" in obj; }, get: function (obj) { return obj.debugLoading; }, set: function (obj, value) { obj.debugLoading = value; } }, metadata: _metadata }, _debugLoading_initializers, _debugLoading_extraInitializers);
        __esDecorate(null, null, _debugStatus_decorators, { kind: "field", name: "debugStatus", static: false, private: false, access: { has: function (obj) { return "debugStatus" in obj; }, get: function (obj) { return obj.debugStatus; }, set: function (obj, value) { obj.debugStatus = value; } }, metadata: _metadata }, _debugStatus_initializers, _debugStatus_extraInitializers);
        __esDecorate(null, null, _debugHealth_decorators, { kind: "field", name: "debugHealth", static: false, private: false, access: { has: function (obj) { return "debugHealth" in obj; }, get: function (obj) { return obj.debugHealth; }, set: function (obj, value) { obj.debugHealth = value; } }, metadata: _metadata }, _debugHealth_initializers, _debugHealth_extraInitializers);
        __esDecorate(null, null, _debugModels_decorators, { kind: "field", name: "debugModels", static: false, private: false, access: { has: function (obj) { return "debugModels" in obj; }, get: function (obj) { return obj.debugModels; }, set: function (obj, value) { obj.debugModels = value; } }, metadata: _metadata }, _debugModels_initializers, _debugModels_extraInitializers);
        __esDecorate(null, null, _debugHeartbeat_decorators, { kind: "field", name: "debugHeartbeat", static: false, private: false, access: { has: function (obj) { return "debugHeartbeat" in obj; }, get: function (obj) { return obj.debugHeartbeat; }, set: function (obj, value) { obj.debugHeartbeat = value; } }, metadata: _metadata }, _debugHeartbeat_initializers, _debugHeartbeat_extraInitializers);
        __esDecorate(null, null, _debugCallMethod_decorators, { kind: "field", name: "debugCallMethod", static: false, private: false, access: { has: function (obj) { return "debugCallMethod" in obj; }, get: function (obj) { return obj.debugCallMethod; }, set: function (obj, value) { obj.debugCallMethod = value; } }, metadata: _metadata }, _debugCallMethod_initializers, _debugCallMethod_extraInitializers);
        __esDecorate(null, null, _debugCallParams_decorators, { kind: "field", name: "debugCallParams", static: false, private: false, access: { has: function (obj) { return "debugCallParams" in obj; }, get: function (obj) { return obj.debugCallParams; }, set: function (obj, value) { obj.debugCallParams = value; } }, metadata: _metadata }, _debugCallParams_initializers, _debugCallParams_extraInitializers);
        __esDecorate(null, null, _debugCallResult_decorators, { kind: "field", name: "debugCallResult", static: false, private: false, access: { has: function (obj) { return "debugCallResult" in obj; }, get: function (obj) { return obj.debugCallResult; }, set: function (obj, value) { obj.debugCallResult = value; } }, metadata: _metadata }, _debugCallResult_initializers, _debugCallResult_extraInitializers);
        __esDecorate(null, null, _debugCallError_decorators, { kind: "field", name: "debugCallError", static: false, private: false, access: { has: function (obj) { return "debugCallError" in obj; }, get: function (obj) { return obj.debugCallError; }, set: function (obj, value) { obj.debugCallError = value; } }, metadata: _metadata }, _debugCallError_initializers, _debugCallError_extraInitializers);
        __esDecorate(null, null, _logsLoading_decorators, { kind: "field", name: "logsLoading", static: false, private: false, access: { has: function (obj) { return "logsLoading" in obj; }, get: function (obj) { return obj.logsLoading; }, set: function (obj, value) { obj.logsLoading = value; } }, metadata: _metadata }, _logsLoading_initializers, _logsLoading_extraInitializers);
        __esDecorate(null, null, _logsError_decorators, { kind: "field", name: "logsError", static: false, private: false, access: { has: function (obj) { return "logsError" in obj; }, get: function (obj) { return obj.logsError; }, set: function (obj, value) { obj.logsError = value; } }, metadata: _metadata }, _logsError_initializers, _logsError_extraInitializers);
        __esDecorate(null, null, _logsFile_decorators, { kind: "field", name: "logsFile", static: false, private: false, access: { has: function (obj) { return "logsFile" in obj; }, get: function (obj) { return obj.logsFile; }, set: function (obj, value) { obj.logsFile = value; } }, metadata: _metadata }, _logsFile_initializers, _logsFile_extraInitializers);
        __esDecorate(null, null, _logsEntries_decorators, { kind: "field", name: "logsEntries", static: false, private: false, access: { has: function (obj) { return "logsEntries" in obj; }, get: function (obj) { return obj.logsEntries; }, set: function (obj, value) { obj.logsEntries = value; } }, metadata: _metadata }, _logsEntries_initializers, _logsEntries_extraInitializers);
        __esDecorate(null, null, _logsFilterText_decorators, { kind: "field", name: "logsFilterText", static: false, private: false, access: { has: function (obj) { return "logsFilterText" in obj; }, get: function (obj) { return obj.logsFilterText; }, set: function (obj, value) { obj.logsFilterText = value; } }, metadata: _metadata }, _logsFilterText_initializers, _logsFilterText_extraInitializers);
        __esDecorate(null, null, _logsLevelFilters_decorators, { kind: "field", name: "logsLevelFilters", static: false, private: false, access: { has: function (obj) { return "logsLevelFilters" in obj; }, get: function (obj) { return obj.logsLevelFilters; }, set: function (obj, value) { obj.logsLevelFilters = value; } }, metadata: _metadata }, _logsLevelFilters_initializers, _logsLevelFilters_extraInitializers);
        __esDecorate(null, null, _logsAutoFollow_decorators, { kind: "field", name: "logsAutoFollow", static: false, private: false, access: { has: function (obj) { return "logsAutoFollow" in obj; }, get: function (obj) { return obj.logsAutoFollow; }, set: function (obj, value) { obj.logsAutoFollow = value; } }, metadata: _metadata }, _logsAutoFollow_initializers, _logsAutoFollow_extraInitializers);
        __esDecorate(null, null, _logsTruncated_decorators, { kind: "field", name: "logsTruncated", static: false, private: false, access: { has: function (obj) { return "logsTruncated" in obj; }, get: function (obj) { return obj.logsTruncated; }, set: function (obj, value) { obj.logsTruncated = value; } }, metadata: _metadata }, _logsTruncated_initializers, _logsTruncated_extraInitializers);
        __esDecorate(null, null, _logsCursor_decorators, { kind: "field", name: "logsCursor", static: false, private: false, access: { has: function (obj) { return "logsCursor" in obj; }, get: function (obj) { return obj.logsCursor; }, set: function (obj, value) { obj.logsCursor = value; } }, metadata: _metadata }, _logsCursor_initializers, _logsCursor_extraInitializers);
        __esDecorate(null, null, _logsLastFetchAt_decorators, { kind: "field", name: "logsLastFetchAt", static: false, private: false, access: { has: function (obj) { return "logsLastFetchAt" in obj; }, get: function (obj) { return obj.logsLastFetchAt; }, set: function (obj, value) { obj.logsLastFetchAt = value; } }, metadata: _metadata }, _logsLastFetchAt_initializers, _logsLastFetchAt_extraInitializers);
        __esDecorate(null, null, _logsLimit_decorators, { kind: "field", name: "logsLimit", static: false, private: false, access: { has: function (obj) { return "logsLimit" in obj; }, get: function (obj) { return obj.logsLimit; }, set: function (obj, value) { obj.logsLimit = value; } }, metadata: _metadata }, _logsLimit_initializers, _logsLimit_extraInitializers);
        __esDecorate(null, null, _logsMaxBytes_decorators, { kind: "field", name: "logsMaxBytes", static: false, private: false, access: { has: function (obj) { return "logsMaxBytes" in obj; }, get: function (obj) { return obj.logsMaxBytes; }, set: function (obj, value) { obj.logsMaxBytes = value; } }, metadata: _metadata }, _logsMaxBytes_initializers, _logsMaxBytes_extraInitializers);
        __esDecorate(null, null, _logsAtBottom_decorators, { kind: "field", name: "logsAtBottom", static: false, private: false, access: { has: function (obj) { return "logsAtBottom" in obj; }, get: function (obj) { return obj.logsAtBottom; }, set: function (obj, value) { obj.logsAtBottom = value; } }, metadata: _metadata }, _logsAtBottom_initializers, _logsAtBottom_extraInitializers);
        __esDecorate(null, null, _chatNewMessagesBelow_decorators, { kind: "field", name: "chatNewMessagesBelow", static: false, private: false, access: { has: function (obj) { return "chatNewMessagesBelow" in obj; }, get: function (obj) { return obj.chatNewMessagesBelow; }, set: function (obj, value) { obj.chatNewMessagesBelow = value; } }, metadata: _metadata }, _chatNewMessagesBelow_initializers, _chatNewMessagesBelow_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OpenClawApp = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OpenClawApp = _classThis;
}();
exports.OpenClawApp = OpenClawApp;
