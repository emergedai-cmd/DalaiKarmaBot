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
exports.applySettings = applySettings;
exports.setLastActiveSessionKey = setLastActiveSessionKey;
exports.applySettingsFromUrl = applySettingsFromUrl;
exports.setTab = setTab;
exports.setTheme = setTheme;
exports.refreshActiveTab = refreshActiveTab;
exports.inferBasePath = inferBasePath;
exports.syncThemeWithSettings = syncThemeWithSettings;
exports.applyResolvedTheme = applyResolvedTheme;
exports.attachThemeListener = attachThemeListener;
exports.detachThemeListener = detachThemeListener;
exports.syncTabWithLocation = syncTabWithLocation;
exports.onPopState = onPopState;
exports.setTabFromRoute = setTabFromRoute;
exports.syncUrlWithTab = syncUrlWithTab;
exports.syncUrlWithSessionKey = syncUrlWithSessionKey;
exports.loadOverview = loadOverview;
exports.loadChannelsTab = loadChannelsTab;
exports.loadCron = loadCron;
var app_chat_1 = require("./app-chat");
var app_polling_1 = require("./app-polling");
var app_scroll_1 = require("./app-scroll");
var channels_1 = require("./controllers/channels");
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
var navigation_1 = require("./navigation");
var storage_1 = require("./storage");
var theme_1 = require("./theme");
var theme_transition_1 = require("./theme-transition");
function applySettings(host, next) {
    var _a;
    var normalized = __assign(__assign({}, next), { lastActiveSessionKey: ((_a = next.lastActiveSessionKey) === null || _a === void 0 ? void 0 : _a.trim()) || next.sessionKey.trim() || "main" });
    host.settings = normalized;
    (0, storage_1.saveSettings)(normalized);
    if (next.theme !== host.theme) {
        host.theme = next.theme;
        applyResolvedTheme(host, (0, theme_1.resolveTheme)(next.theme));
    }
    host.applySessionKey = host.settings.lastActiveSessionKey;
}
function setLastActiveSessionKey(host, next) {
    var trimmed = next.trim();
    if (!trimmed) {
        return;
    }
    if (host.settings.lastActiveSessionKey === trimmed) {
        return;
    }
    applySettings(host, __assign(__assign({}, host.settings), { lastActiveSessionKey: trimmed }));
}
function applySettingsFromUrl(host) {
    if (!window.location.search) {
        return;
    }
    var params = new URLSearchParams(window.location.search);
    var tokenRaw = params.get("token");
    var passwordRaw = params.get("password");
    var sessionRaw = params.get("session");
    var gatewayUrlRaw = params.get("gatewayUrl");
    var shouldCleanUrl = false;
    if (tokenRaw != null) {
        var token = tokenRaw.trim();
        if (token && token !== host.settings.token) {
            applySettings(host, __assign(__assign({}, host.settings), { token: token }));
        }
        params.delete("token");
        shouldCleanUrl = true;
    }
    if (passwordRaw != null) {
        var password = passwordRaw.trim();
        if (password) {
            host.password = password;
        }
        params.delete("password");
        shouldCleanUrl = true;
    }
    if (sessionRaw != null) {
        var session = sessionRaw.trim();
        if (session) {
            host.sessionKey = session;
            applySettings(host, __assign(__assign({}, host.settings), { sessionKey: session, lastActiveSessionKey: session }));
        }
    }
    if (gatewayUrlRaw != null) {
        var gatewayUrl = gatewayUrlRaw.trim();
        if (gatewayUrl && gatewayUrl !== host.settings.gatewayUrl) {
            host.pendingGatewayUrl = gatewayUrl;
        }
        params.delete("gatewayUrl");
        shouldCleanUrl = true;
    }
    if (!shouldCleanUrl) {
        return;
    }
    var url = new URL(window.location.href);
    url.search = params.toString();
    window.history.replaceState({}, "", url.toString());
}
function setTab(host, next) {
    if (host.tab !== next) {
        host.tab = next;
    }
    if (next === "chat") {
        host.chatHasAutoScrolled = false;
    }
    if (next === "logs") {
        (0, app_polling_1.startLogsPolling)(host);
    }
    else {
        (0, app_polling_1.stopLogsPolling)(host);
    }
    if (next === "debug") {
        (0, app_polling_1.startDebugPolling)(host);
    }
    else {
        (0, app_polling_1.stopDebugPolling)(host);
    }
    void refreshActiveTab(host);
    syncUrlWithTab(host, next, false);
}
function setTheme(host, next, context) {
    var applyTheme = function () {
        host.theme = next;
        applySettings(host, __assign(__assign({}, host.settings), { theme: next }));
        applyResolvedTheme(host, (0, theme_1.resolveTheme)(next));
    };
    (0, theme_transition_1.startThemeTransition)({
        nextTheme: next,
        applyTheme: applyTheme,
        context: context,
        currentTheme: host.theme,
    });
}
function refreshActiveTab(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(host.tab === "overview")) return [3 /*break*/, 2];
                    return [4 /*yield*/, loadOverview(host)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!(host.tab === "channels")) return [3 /*break*/, 4];
                    return [4 /*yield*/, loadChannelsTab(host)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(host.tab === "instances")) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, presence_1.loadPresence)(host)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    if (!(host.tab === "sessions")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, sessions_1.loadSessions)(host)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    if (!(host.tab === "cron")) return [3 /*break*/, 10];
                    return [4 /*yield*/, loadCron(host)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    if (!(host.tab === "skills")) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, skills_1.loadSkills)(host)];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    if (!(host.tab === "nodes")) return [3 /*break*/, 17];
                    return [4 /*yield*/, (0, nodes_1.loadNodes)(host)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, (0, devices_1.loadDevices)(host)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, (0, config_1.loadConfig)(host)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, (0, exec_approvals_1.loadExecApprovals)(host)];
                case 16:
                    _a.sent();
                    _a.label = 17;
                case 17:
                    if (!(host.tab === "chat")) return [3 /*break*/, 19];
                    return [4 /*yield*/, (0, app_chat_1.refreshChat)(host)];
                case 18:
                    _a.sent();
                    (0, app_scroll_1.scheduleChatScroll)(host, !host.chatHasAutoScrolled);
                    _a.label = 19;
                case 19:
                    if (!(host.tab === "config")) return [3 /*break*/, 22];
                    return [4 /*yield*/, (0, config_1.loadConfigSchema)(host)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, (0, config_1.loadConfig)(host)];
                case 21:
                    _a.sent();
                    _a.label = 22;
                case 22:
                    if (!(host.tab === "debug")) return [3 /*break*/, 24];
                    return [4 /*yield*/, (0, debug_1.loadDebug)(host)];
                case 23:
                    _a.sent();
                    host.eventLog = host.eventLogBuffer;
                    _a.label = 24;
                case 24:
                    if (!(host.tab === "logs")) return [3 /*break*/, 26];
                    host.logsAtBottom = true;
                    return [4 /*yield*/, (0, logs_1.loadLogs)(host, { reset: true })];
                case 25:
                    _a.sent();
                    (0, app_scroll_1.scheduleLogsScroll)(host, true);
                    _a.label = 26;
                case 26: return [2 /*return*/];
            }
        });
    });
}
function inferBasePath() {
    if (typeof window === "undefined") {
        return "";
    }
    var configured = window.__OPENCLAW_CONTROL_UI_BASE_PATH__;
    if (typeof configured === "string" && configured.trim()) {
        return (0, navigation_1.normalizeBasePath)(configured);
    }
    return (0, navigation_1.inferBasePathFromPathname)(window.location.pathname);
}
function syncThemeWithSettings(host) {
    var _a;
    host.theme = (_a = host.settings.theme) !== null && _a !== void 0 ? _a : "system";
    applyResolvedTheme(host, (0, theme_1.resolveTheme)(host.theme));
}
function applyResolvedTheme(host, resolved) {
    host.themeResolved = resolved;
    if (typeof document === "undefined") {
        return;
    }
    var root = document.documentElement;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
}
function attachThemeListener(host) {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return;
    }
    host.themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
    host.themeMediaHandler = function (event) {
        if (host.theme !== "system") {
            return;
        }
        applyResolvedTheme(host, event.matches ? "dark" : "light");
    };
    if (typeof host.themeMedia.addEventListener === "function") {
        host.themeMedia.addEventListener("change", host.themeMediaHandler);
        return;
    }
    var legacy = host.themeMedia;
    legacy.addListener(host.themeMediaHandler);
}
function detachThemeListener(host) {
    if (!host.themeMedia || !host.themeMediaHandler) {
        return;
    }
    if (typeof host.themeMedia.removeEventListener === "function") {
        host.themeMedia.removeEventListener("change", host.themeMediaHandler);
        return;
    }
    var legacy = host.themeMedia;
    legacy.removeListener(host.themeMediaHandler);
    host.themeMedia = null;
    host.themeMediaHandler = null;
}
function syncTabWithLocation(host, replace) {
    var _a;
    if (typeof window === "undefined") {
        return;
    }
    var resolved = (_a = (0, navigation_1.tabFromPath)(window.location.pathname, host.basePath)) !== null && _a !== void 0 ? _a : "chat";
    setTabFromRoute(host, resolved);
    syncUrlWithTab(host, resolved, replace);
}
function onPopState(host) {
    var _a;
    if (typeof window === "undefined") {
        return;
    }
    var resolved = (0, navigation_1.tabFromPath)(window.location.pathname, host.basePath);
    if (!resolved) {
        return;
    }
    var url = new URL(window.location.href);
    var session = (_a = url.searchParams.get("session")) === null || _a === void 0 ? void 0 : _a.trim();
    if (session) {
        host.sessionKey = session;
        applySettings(host, __assign(__assign({}, host.settings), { sessionKey: session, lastActiveSessionKey: session }));
    }
    setTabFromRoute(host, resolved);
}
function setTabFromRoute(host, next) {
    if (host.tab !== next) {
        host.tab = next;
    }
    if (next === "chat") {
        host.chatHasAutoScrolled = false;
    }
    if (next === "logs") {
        (0, app_polling_1.startLogsPolling)(host);
    }
    else {
        (0, app_polling_1.stopLogsPolling)(host);
    }
    if (next === "debug") {
        (0, app_polling_1.startDebugPolling)(host);
    }
    else {
        (0, app_polling_1.stopDebugPolling)(host);
    }
    if (host.connected) {
        void refreshActiveTab(host);
    }
}
function syncUrlWithTab(host, tab, replace) {
    if (typeof window === "undefined") {
        return;
    }
    var targetPath = (0, navigation_1.normalizePath)((0, navigation_1.pathForTab)(tab, host.basePath));
    var currentPath = (0, navigation_1.normalizePath)(window.location.pathname);
    var url = new URL(window.location.href);
    if (tab === "chat" && host.sessionKey) {
        url.searchParams.set("session", host.sessionKey);
    }
    else {
        url.searchParams.delete("session");
    }
    if (currentPath !== targetPath) {
        url.pathname = targetPath;
    }
    if (replace) {
        window.history.replaceState({}, "", url.toString());
    }
    else {
        window.history.pushState({}, "", url.toString());
    }
}
function syncUrlWithSessionKey(host, sessionKey, replace) {
    if (typeof window === "undefined") {
        return;
    }
    var url = new URL(window.location.href);
    url.searchParams.set("session", sessionKey);
    if (replace) {
        window.history.replaceState({}, "", url.toString());
    }
    else {
        window.history.pushState({}, "", url.toString());
    }
}
function loadOverview(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, channels_1.loadChannels)(host, false),
                        (0, presence_1.loadPresence)(host),
                        (0, sessions_1.loadSessions)(host),
                        (0, cron_1.loadCronStatus)(host),
                        (0, debug_1.loadDebug)(host),
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadChannelsTab(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, channels_1.loadChannels)(host, true),
                        (0, config_1.loadConfigSchema)(host),
                        (0, config_1.loadConfig)(host),
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadCron(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, channels_1.loadChannels)(host, false),
                        (0, cron_1.loadCronStatus)(host),
                        (0, cron_1.loadCronJobs)(host),
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
