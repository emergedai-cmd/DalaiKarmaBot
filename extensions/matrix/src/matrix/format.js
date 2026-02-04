"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToMatrixHtml = markdownToMatrixHtml;
var markdown_it_1 = require("markdown-it");
var md = new markdown_it_1.default({
    html: false,
    linkify: true,
    breaks: true,
    typographer: false,
});
md.enable("strikethrough");
var escapeHtml = md.utils.escapeHtml;
md.renderer.rules.image = function (tokens, idx) { var _a, _b; return escapeHtml((_b = (_a = tokens[idx]) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : ""); };
md.renderer.rules.html_block = function (tokens, idx) { var _a, _b; return escapeHtml((_b = (_a = tokens[idx]) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : ""); };
md.renderer.rules.html_inline = function (tokens, idx) { var _a, _b; return escapeHtml((_b = (_a = tokens[idx]) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : ""); };
function markdownToMatrixHtml(markdown) {
    var rendered = md.render(markdown !== null && markdown !== void 0 ? markdown : "");
    return rendered.trimEnd();
}
