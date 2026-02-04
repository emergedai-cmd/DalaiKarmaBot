"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMarkdownSidebar = renderMarkdownSidebar;
var lit_1 = require("lit");
var unsafe_html_js_1 = require("lit/directives/unsafe-html.js");
var icons_1 = require("../icons");
var markdown_1 = require("../markdown");
function renderMarkdownSidebar(props) {
    return (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    <div class=\"sidebar-panel\">\n      <div class=\"sidebar-header\">\n        <div class=\"sidebar-title\">Tool Output</div>\n        <button @click=", " class=\"btn\" title=\"Close sidebar\">\n          ", "\n        </button>\n      </div>\n      <div class=\"sidebar-content\">\n        ", "\n      </div>\n    </div>\n  "], ["\n    <div class=\"sidebar-panel\">\n      <div class=\"sidebar-header\">\n        <div class=\"sidebar-title\">Tool Output</div>\n        <button @click=", " class=\"btn\" title=\"Close sidebar\">\n          ", "\n        </button>\n      </div>\n      <div class=\"sidebar-content\">\n        ", "\n      </div>\n    </div>\n  "])), props.onClose, icons_1.icons.x, props.error
        ? (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n              <div class=\"callout danger\">", "</div>\n              <button @click=", " class=\"btn\" style=\"margin-top: 12px;\">\n                View Raw Text\n              </button>\n            "], ["\n              <div class=\"callout danger\">", "</div>\n              <button @click=", " class=\"btn\" style=\"margin-top: 12px;\">\n                View Raw Text\n              </button>\n            "])), props.error, props.onViewRawText) : props.content
        ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<div class=\"sidebar-markdown\">", "</div>"], ["<div class=\"sidebar-markdown\">", "</div>"])), (0, unsafe_html_js_1.unsafeHTML)((0, markdown_1.toSanitizedMarkdownHtml)(props.content))) : (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n                  <div class=\"muted\">No content available</div>\n                "], ["\n                  <div class=\"muted\">No content available</div>\n                "]))));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
