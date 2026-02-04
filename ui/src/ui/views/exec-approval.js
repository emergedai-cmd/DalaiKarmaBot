"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderExecApprovalPrompt = renderExecApprovalPrompt;
var lit_1 = require("lit");
function formatRemaining(ms) {
    var remaining = Math.max(0, ms);
    var totalSeconds = Math.floor(remaining / 1000);
    if (totalSeconds < 60) {
        return "".concat(totalSeconds, "s");
    }
    var minutes = Math.floor(totalSeconds / 60);
    if (minutes < 60) {
        return "".concat(minutes, "m");
    }
    var hours = Math.floor(minutes / 60);
    return "".concat(hours, "h");
}
function renderMetaRow(label, value) {
    if (!value) {
        return lit_1.nothing;
    }
    return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div class=\"exec-approval-meta-row\"><span>", "</span><span>", "</span></div>"], ["<div class=\"exec-approval-meta-row\"><span>", "</span><span>", "</span></div>"])), label, value);
}
function renderExecApprovalPrompt(state) {
    var active = state.execApprovalQueue[0];
    if (!active) {
        return lit_1.nothing;
    }
    var request = active.request;
    var remainingMs = active.expiresAtMs - Date.now();
    var remaining = remainingMs > 0 ? "expires in ".concat(formatRemaining(remainingMs)) : "expired";
    var queueCount = state.execApprovalQueue.length;
    return (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    <div class=\"exec-approval-overlay\" role=\"dialog\" aria-live=\"polite\">\n      <div class=\"exec-approval-card\">\n        <div class=\"exec-approval-header\">\n          <div>\n            <div class=\"exec-approval-title\">Exec approval needed</div>\n            <div class=\"exec-approval-sub\">", "</div>\n          </div>\n          ", "\n        </div>\n        <div class=\"exec-approval-command mono\">", "</div>\n        <div class=\"exec-approval-meta\">\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n        </div>\n        ", "\n        <div class=\"exec-approval-actions\">\n          <button\n            class=\"btn primary\"\n            ?disabled=", "\n            @click=", "\n          >\n            Allow once\n          </button>\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            Always allow\n          </button>\n          <button\n            class=\"btn danger\"\n            ?disabled=", "\n            @click=", "\n          >\n            Deny\n          </button>\n        </div>\n      </div>\n    </div>\n  "], ["\n    <div class=\"exec-approval-overlay\" role=\"dialog\" aria-live=\"polite\">\n      <div class=\"exec-approval-card\">\n        <div class=\"exec-approval-header\">\n          <div>\n            <div class=\"exec-approval-title\">Exec approval needed</div>\n            <div class=\"exec-approval-sub\">", "</div>\n          </div>\n          ", "\n        </div>\n        <div class=\"exec-approval-command mono\">", "</div>\n        <div class=\"exec-approval-meta\">\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n        </div>\n        ", "\n        <div class=\"exec-approval-actions\">\n          <button\n            class=\"btn primary\"\n            ?disabled=", "\n            @click=", "\n          >\n            Allow once\n          </button>\n          <button\n            class=\"btn\"\n            ?disabled=", "\n            @click=", "\n          >\n            Always allow\n          </button>\n          <button\n            class=\"btn danger\"\n            ?disabled=", "\n            @click=", "\n          >\n            Deny\n          </button>\n        </div>\n      </div>\n    </div>\n  "])), remaining, queueCount > 1
        ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<div class=\"exec-approval-queue\">", " pending</div>"], ["<div class=\"exec-approval-queue\">", " pending</div>"])), queueCount) : lit_1.nothing, request.command, renderMetaRow("Host", request.host), renderMetaRow("Agent", request.agentId), renderMetaRow("Session", request.sessionKey), renderMetaRow("CWD", request.cwd), renderMetaRow("Resolved", request.resolvedPath), renderMetaRow("Security", request.security), renderMetaRow("Ask", request.ask), state.execApprovalError
        ? (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["<div class=\"exec-approval-error\">", "</div>"], ["<div class=\"exec-approval-error\">", "</div>"])), state.execApprovalError) : lit_1.nothing, state.execApprovalBusy, function () { return state.handleExecApprovalDecision("allow-once"); }, state.execApprovalBusy, function () { return state.handleExecApprovalDecision("allow-always"); }, state.execApprovalBusy, function () { return state.handleExecApprovalDecision("deny"); });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
