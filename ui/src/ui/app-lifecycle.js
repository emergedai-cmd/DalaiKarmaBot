"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnected = handleConnected;
exports.handleFirstUpdated = handleFirstUpdated;
exports.handleDisconnected = handleDisconnected;
exports.handleUpdated = handleUpdated;
var app_gateway_1 = require("./app-gateway");
var app_polling_1 = require("./app-polling");
var app_scroll_1 = require("./app-scroll");
var app_settings_1 = require("./app-settings");
function handleConnected(host) {
    host.basePath = (0, app_settings_1.inferBasePath)();
    (0, app_settings_1.applySettingsFromUrl)(host);
    (0, app_settings_1.syncTabWithLocation)(host, true);
    (0, app_settings_1.syncThemeWithSettings)(host);
    (0, app_settings_1.attachThemeListener)(host);
    window.addEventListener("popstate", host.popStateHandler);
    (0, app_gateway_1.connectGateway)(host);
    (0, app_polling_1.startNodesPolling)(host);
    if (host.tab === "logs") {
        (0, app_polling_1.startLogsPolling)(host);
    }
    if (host.tab === "debug") {
        (0, app_polling_1.startDebugPolling)(host);
    }
}
function handleFirstUpdated(host) {
    (0, app_scroll_1.observeTopbar)(host);
}
function handleDisconnected(host) {
    var _a;
    window.removeEventListener("popstate", host.popStateHandler);
    (0, app_polling_1.stopNodesPolling)(host);
    (0, app_polling_1.stopLogsPolling)(host);
    (0, app_polling_1.stopDebugPolling)(host);
    (0, app_settings_1.detachThemeListener)(host);
    (_a = host.topbarObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    host.topbarObserver = null;
}
function handleUpdated(host, changed) {
    if (host.tab === "chat" &&
        (changed.has("chatMessages") ||
            changed.has("chatToolMessages") ||
            changed.has("chatStream") ||
            changed.has("chatLoading") ||
            changed.has("tab"))) {
        var forcedByTab = changed.has("tab");
        var forcedByLoad = changed.has("chatLoading") && changed.get("chatLoading") === true && !host.chatLoading;
        (0, app_scroll_1.scheduleChatScroll)(host, forcedByTab || forcedByLoad || !host.chatHasAutoScrolled);
    }
    if (host.tab === "logs" &&
        (changed.has("logsEntries") || changed.has("logsAutoFollow") || changed.has("tab"))) {
        if (host.logsAutoFollow && host.logsAtBottom) {
            (0, app_scroll_1.scheduleLogsScroll)(host, changed.has("tab") || changed.has("logsAutoFollow"));
        }
    }
}
