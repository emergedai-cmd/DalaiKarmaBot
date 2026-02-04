"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSanitizedMarkdownHtml = toSanitizedMarkdownHtml;
var dompurify_1 = require("dompurify");
var marked_1 = require("marked");
var format_1 = require("./format");
marked_1.marked.setOptions({
    gfm: true,
    breaks: true,
    mangle: false,
});
var allowedTags = [
    "a",
    "b",
    "blockquote",
    "br",
    "code",
    "del",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "hr",
    "i",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "ul",
];
var allowedAttrs = ["class", "href", "rel", "target", "title", "start"];
var hooksInstalled = false;
var MARKDOWN_CHAR_LIMIT = 140000;
var MARKDOWN_PARSE_LIMIT = 40000;
var MARKDOWN_CACHE_LIMIT = 200;
var MARKDOWN_CACHE_MAX_CHARS = 50000;
var markdownCache = new Map();
function getCachedMarkdown(key) {
    var cached = markdownCache.get(key);
    if (cached === undefined) {
        return null;
    }
    markdownCache.delete(key);
    markdownCache.set(key, cached);
    return cached;
}
function setCachedMarkdown(key, value) {
    markdownCache.set(key, value);
    if (markdownCache.size <= MARKDOWN_CACHE_LIMIT) {
        return;
    }
    var oldest = markdownCache.keys().next().value;
    if (oldest) {
        markdownCache.delete(oldest);
    }
}
function installHooks() {
    if (hooksInstalled) {
        return;
    }
    hooksInstalled = true;
    dompurify_1.default.addHook("afterSanitizeAttributes", function (node) {
        if (!(node instanceof HTMLAnchorElement)) {
            return;
        }
        var href = node.getAttribute("href");
        if (!href) {
            return;
        }
        node.setAttribute("rel", "noreferrer noopener");
        node.setAttribute("target", "_blank");
    });
}
function toSanitizedMarkdownHtml(markdown) {
    var input = markdown.trim();
    if (!input) {
        return "";
    }
    installHooks();
    if (input.length <= MARKDOWN_CACHE_MAX_CHARS) {
        var cached = getCachedMarkdown(input);
        if (cached !== null) {
            return cached;
        }
    }
    var truncated = (0, format_1.truncateText)(input, MARKDOWN_CHAR_LIMIT);
    var suffix = truncated.truncated
        ? "\n\n\u2026 truncated (".concat(truncated.total, " chars, showing first ").concat(truncated.text.length, ").")
        : "";
    if (truncated.text.length > MARKDOWN_PARSE_LIMIT) {
        var escaped = escapeHtml("".concat(truncated.text).concat(suffix));
        var html = "<pre class=\"code-block\">".concat(escaped, "</pre>");
        var sanitized_1 = dompurify_1.default.sanitize(html, {
            ALLOWED_TAGS: allowedTags,
            ALLOWED_ATTR: allowedAttrs,
        });
        if (input.length <= MARKDOWN_CACHE_MAX_CHARS) {
            setCachedMarkdown(input, sanitized_1);
        }
        return sanitized_1;
    }
    var rendered = marked_1.marked.parse("".concat(truncated.text).concat(suffix));
    var sanitized = dompurify_1.default.sanitize(rendered, {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: allowedAttrs,
    });
    if (input.length <= MARKDOWN_CACHE_MAX_CHARS) {
        setCachedMarkdown(input, sanitized);
    }
    return sanitized;
}
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
