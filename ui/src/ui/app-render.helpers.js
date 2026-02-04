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
exports.renderTab = renderTab;
exports.renderChatControls = renderChatControls;
exports.renderThemeToggle = renderThemeToggle;
var lit_1 = require("lit");
var repeat_js_1 = require("lit/directives/repeat.js");
var app_chat_1 = require("./app-chat");
var app_settings_1 = require("./app-settings");
var chat_1 = require("./controllers/chat");
var icons_1 = require("./icons");
var navigation_1 = require("./navigation");
function renderTab(state, tab) {
    var href = (0, navigation_1.pathForTab)(tab, state.basePath);
    return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <a\n      href=", "\n      class=\"nav-item ", "\"\n      @click=", "\n      title=", "\n    >\n      <span class=\"nav-item__icon\" aria-hidden=\"true\">", "</span>\n      <span class=\"nav-item__text\">", "</span>\n    </a>\n  "], ["\n    <a\n      href=", "\n      class=\"nav-item ", "\"\n      @click=", "\n      title=", "\n    >\n      <span class=\"nav-item__icon\" aria-hidden=\"true\">", "</span>\n      <span class=\"nav-item__text\">", "</span>\n    </a>\n  "])), href, state.tab === tab ? "active" : "", function (event) {
        if (event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey) {
            return;
        }
        event.preventDefault();
        state.setTab(tab);
    }, (0, navigation_1.titleForTab)(tab), icons_1.icons[(0, navigation_1.iconForTab)(tab)], (0, navigation_1.titleForTab)(tab));
}
function renderChatControls(state) {
    var mainSessionKey = resolveMainSessionKey(state.hello, state.sessionsResult);
    var sessionOptions = resolveSessionOptions(state.sessionKey, state.sessionsResult, mainSessionKey);
    var disableThinkingToggle = state.onboarding;
    var disableFocusToggle = state.onboarding;
    var showThinking = state.onboarding ? false : state.settings.chatShowThinking;
    var focusActive = state.onboarding ? true : state.settings.chatFocusMode;
    // Refresh icon
    var refreshIcon = (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <svg\n      width=\"18\"\n      height=\"18\"\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8\"></path>\n      <path d=\"M21 3v5h-5\"></path>\n    </svg>\n  "], ["\n    <svg\n      width=\"18\"\n      height=\"18\"\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8\"></path>\n      <path d=\"M21 3v5h-5\"></path>\n    </svg>\n  "])));
    var focusIcon = (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <svg\n      width=\"18\"\n      height=\"18\"\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M4 7V4h3\"></path>\n      <path d=\"M20 7V4h-3\"></path>\n      <path d=\"M4 17v3h3\"></path>\n      <path d=\"M20 17v3h-3\"></path>\n      <circle cx=\"12\" cy=\"12\" r=\"3\"></circle>\n    </svg>\n  "], ["\n    <svg\n      width=\"18\"\n      height=\"18\"\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-width=\"2\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M4 7V4h3\"></path>\n      <path d=\"M20 7V4h-3\"></path>\n      <path d=\"M4 17v3h3\"></path>\n      <path d=\"M20 17v3h-3\"></path>\n      <circle cx=\"12\" cy=\"12\" r=\"3\"></circle>\n    </svg>\n  "])));
    return (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    <div class=\"chat-controls\">\n      <label class=\"field chat-controls__session\">\n        <select\n          .value=", "\n          ?disabled=", "\n          @change=", "\n        >\n          ", "\n        </select>\n      </label>\n      <button\n        class=\"btn btn--sm btn--icon\"\n        ?disabled=", "\n        @click=", "\n        title=\"Refresh chat data\"\n      >\n        ", "\n      </button>\n      <span class=\"chat-controls__separator\">|</span>\n      <button\n        class=\"btn btn--sm btn--icon ", "\"\n        ?disabled=", "\n        @click=", "\n        aria-pressed=", "\n        title=", "\n      >\n        ", "\n      </button>\n      <button\n        class=\"btn btn--sm btn--icon ", "\"\n        ?disabled=", "\n        @click=", "\n        aria-pressed=", "\n        title=", "\n      >\n        ", "\n      </button>\n    </div>\n  "], ["\n    <div class=\"chat-controls\">\n      <label class=\"field chat-controls__session\">\n        <select\n          .value=", "\n          ?disabled=", "\n          @change=", "\n        >\n          ", "\n        </select>\n      </label>\n      <button\n        class=\"btn btn--sm btn--icon\"\n        ?disabled=", "\n        @click=", "\n        title=\"Refresh chat data\"\n      >\n        ", "\n      </button>\n      <span class=\"chat-controls__separator\">|</span>\n      <button\n        class=\"btn btn--sm btn--icon ", "\"\n        ?disabled=", "\n        @click=", "\n        aria-pressed=", "\n        title=", "\n      >\n        ", "\n      </button>\n      <button\n        class=\"btn btn--sm btn--icon ", "\"\n        ?disabled=", "\n        @click=", "\n        aria-pressed=", "\n        title=", "\n      >\n        ", "\n      </button>\n    </div>\n  "])), state.sessionKey, !state.connected, function (e) {
        var next = e.target.value;
        state.sessionKey = next;
        state.chatMessage = "";
        state.chatStream = null;
        state.chatStreamStartedAt = null;
        state.chatRunId = null;
        state.resetToolStream();
        state.resetChatScroll();
        state.applySettings(__assign(__assign({}, state.settings), { sessionKey: next, lastActiveSessionKey: next }));
        void state.loadAssistantIdentity();
        (0, app_settings_1.syncUrlWithSessionKey)(state, next, true);
        void (0, chat_1.loadChatHistory)(state);
    }, (0, repeat_js_1.repeat)(sessionOptions, function (entry) { return entry.key; }, function (entry) {
        var _a;
        return (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["<option value=", ">\n                ", "\n              </option>"], ["<option value=", ">\n                ", "\n              </option>"])), entry.key, (_a = entry.displayName) !== null && _a !== void 0 ? _a : entry.key);
    }), state.chatLoading || !state.connected, function () {
        state.resetToolStream();
        void (0, app_chat_1.refreshChat)(state);
    }, refreshIcon, showThinking ? "active" : "", disableThinkingToggle, function () {
        if (disableThinkingToggle) {
            return;
        }
        state.applySettings(__assign(__assign({}, state.settings), { chatShowThinking: !state.settings.chatShowThinking }));
    }, showThinking, disableThinkingToggle
        ? "Disabled during onboarding"
        : "Toggle assistant thinking/working output", icons_1.icons.brain, focusActive ? "active" : "", disableFocusToggle, function () {
        if (disableFocusToggle) {
            return;
        }
        state.applySettings(__assign(__assign({}, state.settings), { chatFocusMode: !state.settings.chatFocusMode }));
    }, focusActive, disableFocusToggle
        ? "Disabled during onboarding"
        : "Toggle focus mode (hide sidebar + page header)", focusIcon);
}
function resolveMainSessionKey(hello, sessions) {
    var _a, _b, _c, _d, _e;
    var snapshot = hello === null || hello === void 0 ? void 0 : hello.snapshot;
    var mainSessionKey = (_b = (_a = snapshot === null || snapshot === void 0 ? void 0 : snapshot.sessionDefaults) === null || _a === void 0 ? void 0 : _a.mainSessionKey) === null || _b === void 0 ? void 0 : _b.trim();
    if (mainSessionKey) {
        return mainSessionKey;
    }
    var mainKey = (_d = (_c = snapshot === null || snapshot === void 0 ? void 0 : snapshot.sessionDefaults) === null || _c === void 0 ? void 0 : _c.mainKey) === null || _d === void 0 ? void 0 : _d.trim();
    if (mainKey) {
        return mainKey;
    }
    if ((_e = sessions === null || sessions === void 0 ? void 0 : sessions.sessions) === null || _e === void 0 ? void 0 : _e.some(function (row) { return row.key === "main"; })) {
        return "main";
    }
    return null;
}
function resolveSessionDisplayName(key, row) {
    var _a, _b;
    var label = (_a = row === null || row === void 0 ? void 0 : row.label) === null || _a === void 0 ? void 0 : _a.trim();
    if (label) {
        return "".concat(label, " (").concat(key, ")");
    }
    var displayName = (_b = row === null || row === void 0 ? void 0 : row.displayName) === null || _b === void 0 ? void 0 : _b.trim();
    if (displayName) {
        return displayName;
    }
    return key;
}
function resolveSessionOptions(sessionKey, sessions, mainSessionKey) {
    var _a, _b;
    var seen = new Set();
    var options = [];
    var resolvedMain = mainSessionKey && ((_a = sessions === null || sessions === void 0 ? void 0 : sessions.sessions) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.key === mainSessionKey; }));
    var resolvedCurrent = (_b = sessions === null || sessions === void 0 ? void 0 : sessions.sessions) === null || _b === void 0 ? void 0 : _b.find(function (s) { return s.key === sessionKey; });
    // Add main session key first
    if (mainSessionKey) {
        seen.add(mainSessionKey);
        options.push({
            key: mainSessionKey,
            displayName: resolveSessionDisplayName(mainSessionKey, resolvedMain),
        });
    }
    // Add current session key next
    if (!seen.has(sessionKey)) {
        seen.add(sessionKey);
        options.push({
            key: sessionKey,
            displayName: resolveSessionDisplayName(sessionKey, resolvedCurrent),
        });
    }
    // Add sessions from the result
    if (sessions === null || sessions === void 0 ? void 0 : sessions.sessions) {
        for (var _i = 0, _c = sessions.sessions; _i < _c.length; _i++) {
            var s = _c[_i];
            if (!seen.has(s.key)) {
                seen.add(s.key);
                options.push({
                    key: s.key,
                    displayName: resolveSessionDisplayName(s.key, s),
                });
            }
        }
    }
    return options;
}
var THEME_ORDER = ["system", "light", "dark"];
function renderThemeToggle(state) {
    var index = Math.max(0, THEME_ORDER.indexOf(state.theme));
    var applyTheme = function (next) { return function (event) {
        var element = event.currentTarget;
        var context = { element: element };
        if (event.clientX || event.clientY) {
            context.pointerClientX = event.clientX;
            context.pointerClientY = event.clientY;
        }
        state.setTheme(next, context);
    }; };
    return (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    <div class=\"theme-toggle\" style=\"--theme-index: ", ";\">\n      <div class=\"theme-toggle__track\" role=\"group\" aria-label=\"Theme\">\n        <span class=\"theme-toggle__indicator\"></span>\n        <button\n          class=\"theme-toggle__button ", "\"\n          @click=", "\n          aria-pressed=", "\n          aria-label=\"System theme\"\n          title=\"System\"\n        >\n          ", "\n        </button>\n        <button\n          class=\"theme-toggle__button ", "\"\n          @click=", "\n          aria-pressed=", "\n          aria-label=\"Light theme\"\n          title=\"Light\"\n        >\n          ", "\n        </button>\n        <button\n          class=\"theme-toggle__button ", "\"\n          @click=", "\n          aria-pressed=", "\n          aria-label=\"Dark theme\"\n          title=\"Dark\"\n        >\n          ", "\n        </button>\n      </div>\n    </div>\n  "], ["\n    <div class=\"theme-toggle\" style=\"--theme-index: ", ";\">\n      <div class=\"theme-toggle__track\" role=\"group\" aria-label=\"Theme\">\n        <span class=\"theme-toggle__indicator\"></span>\n        <button\n          class=\"theme-toggle__button ", "\"\n          @click=", "\n          aria-pressed=", "\n          aria-label=\"System theme\"\n          title=\"System\"\n        >\n          ", "\n        </button>\n        <button\n          class=\"theme-toggle__button ", "\"\n          @click=", "\n          aria-pressed=", "\n          aria-label=\"Light theme\"\n          title=\"Light\"\n        >\n          ", "\n        </button>\n        <button\n          class=\"theme-toggle__button ", "\"\n          @click=", "\n          aria-pressed=", "\n          aria-label=\"Dark theme\"\n          title=\"Dark\"\n        >\n          ", "\n        </button>\n      </div>\n    </div>\n  "])), index, state.theme === "system" ? "active" : "", applyTheme("system"), state.theme === "system", renderMonitorIcon(), state.theme === "light" ? "active" : "", applyTheme("light"), state.theme === "light", renderSunIcon(), state.theme === "dark" ? "active" : "", applyTheme("dark"), state.theme === "dark", renderMoonIcon());
}
function renderSunIcon() {
    return (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    <svg class=\"theme-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n      <circle cx=\"12\" cy=\"12\" r=\"4\"></circle>\n      <path d=\"M12 2v2\"></path>\n      <path d=\"M12 20v2\"></path>\n      <path d=\"m4.93 4.93 1.41 1.41\"></path>\n      <path d=\"m17.66 17.66 1.41 1.41\"></path>\n      <path d=\"M2 12h2\"></path>\n      <path d=\"M20 12h2\"></path>\n      <path d=\"m6.34 17.66-1.41 1.41\"></path>\n      <path d=\"m19.07 4.93-1.41 1.41\"></path>\n    </svg>\n  "], ["\n    <svg class=\"theme-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n      <circle cx=\"12\" cy=\"12\" r=\"4\"></circle>\n      <path d=\"M12 2v2\"></path>\n      <path d=\"M12 20v2\"></path>\n      <path d=\"m4.93 4.93 1.41 1.41\"></path>\n      <path d=\"m17.66 17.66 1.41 1.41\"></path>\n      <path d=\"M2 12h2\"></path>\n      <path d=\"M20 12h2\"></path>\n      <path d=\"m6.34 17.66-1.41 1.41\"></path>\n      <path d=\"m19.07 4.93-1.41 1.41\"></path>\n    </svg>\n  "])));
}
function renderMoonIcon() {
    return (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    <svg class=\"theme-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n      <path\n        d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"\n      ></path>\n    </svg>\n  "], ["\n    <svg class=\"theme-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n      <path\n        d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"\n      ></path>\n    </svg>\n  "])));
}
function renderMonitorIcon() {
    return (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    <svg class=\"theme-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n      <rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\"></rect>\n      <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\"></line>\n      <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\"></line>\n    </svg>\n  "], ["\n    <svg class=\"theme-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n      <rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\"></rect>\n      <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\"></line>\n      <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\"></line>\n    </svg>\n  "])));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
