"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGatewayUrlConfirmation = renderGatewayUrlConfirmation;
var lit_1 = require("lit");
function renderGatewayUrlConfirmation(state) {
    var pendingGatewayUrl = state.pendingGatewayUrl;
    if (!pendingGatewayUrl) {
        return lit_1.nothing;
    }
    return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <div class=\"exec-approval-overlay\" role=\"dialog\" aria-modal=\"true\" aria-live=\"polite\">\n      <div class=\"exec-approval-card\">\n        <div class=\"exec-approval-header\">\n          <div>\n            <div class=\"exec-approval-title\">Change Gateway URL</div>\n            <div class=\"exec-approval-sub\">This will reconnect to a different gateway server</div>\n          </div>\n        </div>\n        <div class=\"exec-approval-command mono\">", "</div>\n        <div class=\"callout danger\" style=\"margin-top: 12px;\">\n          Only confirm if you trust this URL. Malicious URLs can compromise your system.\n        </div>\n        <div class=\"exec-approval-actions\">\n          <button\n            class=\"btn primary\"\n            @click=", "\n          >\n            Confirm\n          </button>\n          <button\n            class=\"btn\"\n            @click=", "\n          >\n            Cancel\n          </button>\n        </div>\n      </div>\n    </div>\n  "], ["\n    <div class=\"exec-approval-overlay\" role=\"dialog\" aria-modal=\"true\" aria-live=\"polite\">\n      <div class=\"exec-approval-card\">\n        <div class=\"exec-approval-header\">\n          <div>\n            <div class=\"exec-approval-title\">Change Gateway URL</div>\n            <div class=\"exec-approval-sub\">This will reconnect to a different gateway server</div>\n          </div>\n        </div>\n        <div class=\"exec-approval-command mono\">", "</div>\n        <div class=\"callout danger\" style=\"margin-top: 12px;\">\n          Only confirm if you trust this URL. Malicious URLs can compromise your system.\n        </div>\n        <div class=\"exec-approval-actions\">\n          <button\n            class=\"btn primary\"\n            @click=", "\n          >\n            Confirm\n          </button>\n          <button\n            class=\"btn\"\n            @click=", "\n          >\n            Cancel\n          </button>\n        </div>\n      </div>\n    </div>\n  "])), pendingGatewayUrl, function () { return state.handleGatewayUrlConfirm(); }, function () { return state.handleGatewayUrlCancel(); });
}
var templateObject_1;
