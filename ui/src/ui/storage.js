"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSettings = loadSettings;
exports.saveSettings = saveSettings;
var KEY = "openclaw.control.settings.v1";
function loadSettings() {
    var defaultUrl = (function () {
        var proto = location.protocol === "https:" ? "wss" : "ws";
        return "".concat(proto, "://").concat(location.host);
    })();
    var defaults = {
        gatewayUrl: defaultUrl,
        token: "",
        sessionKey: "main",
        lastActiveSessionKey: "main",
        theme: "system",
        chatFocusMode: false,
        chatShowThinking: true,
        splitRatio: 0.6,
        navCollapsed: false,
        navGroupsCollapsed: {},
    };
    try {
        var raw = localStorage.getItem(KEY);
        if (!raw) {
            return defaults;
        }
        var parsed = JSON.parse(raw);
        return {
            gatewayUrl: typeof parsed.gatewayUrl === "string" && parsed.gatewayUrl.trim()
                ? parsed.gatewayUrl.trim()
                : defaults.gatewayUrl,
            token: typeof parsed.token === "string" ? parsed.token : defaults.token,
            sessionKey: typeof parsed.sessionKey === "string" && parsed.sessionKey.trim()
                ? parsed.sessionKey.trim()
                : defaults.sessionKey,
            lastActiveSessionKey: typeof parsed.lastActiveSessionKey === "string" && parsed.lastActiveSessionKey.trim()
                ? parsed.lastActiveSessionKey.trim()
                : (typeof parsed.sessionKey === "string" && parsed.sessionKey.trim()) ||
                    defaults.lastActiveSessionKey,
            theme: parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system"
                ? parsed.theme
                : defaults.theme,
            chatFocusMode: typeof parsed.chatFocusMode === "boolean" ? parsed.chatFocusMode : defaults.chatFocusMode,
            chatShowThinking: typeof parsed.chatShowThinking === "boolean"
                ? parsed.chatShowThinking
                : defaults.chatShowThinking,
            splitRatio: typeof parsed.splitRatio === "number" &&
                parsed.splitRatio >= 0.4 &&
                parsed.splitRatio <= 0.7
                ? parsed.splitRatio
                : defaults.splitRatio,
            navCollapsed: typeof parsed.navCollapsed === "boolean" ? parsed.navCollapsed : defaults.navCollapsed,
            navGroupsCollapsed: typeof parsed.navGroupsCollapsed === "object" && parsed.navGroupsCollapsed !== null
                ? parsed.navGroupsCollapsed
                : defaults.navGroupsCollapsed,
        };
    }
    catch (_a) {
        return defaults;
    }
}
function saveSettings(next) {
    localStorage.setItem(KEY, JSON.stringify(next));
}
