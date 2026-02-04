"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSyntaxTheme = createSyntaxTheme;
var chalk_1 = require("chalk");
/**
 * Syntax highlighting theme for code blocks.
 * Uses chalk functions to style different token types.
 */
function createSyntaxTheme(fallback) {
    return {
        keyword: chalk_1.default.hex("#C586C0"), // purple - if, const, function, etc.
        built_in: chalk_1.default.hex("#4EC9B0"), // teal - console, Math, etc.
        type: chalk_1.default.hex("#4EC9B0"), // teal - types
        literal: chalk_1.default.hex("#569CD6"), // blue - true, false, null
        number: chalk_1.default.hex("#B5CEA8"), // green - numbers
        string: chalk_1.default.hex("#CE9178"), // orange - strings
        regexp: chalk_1.default.hex("#D16969"), // red - regex
        symbol: chalk_1.default.hex("#B5CEA8"), // green - symbols
        class: chalk_1.default.hex("#4EC9B0"), // teal - class names
        function: chalk_1.default.hex("#DCDCAA"), // yellow - function names
        title: chalk_1.default.hex("#DCDCAA"), // yellow - titles/names
        params: chalk_1.default.hex("#9CDCFE"), // light blue - parameters
        comment: chalk_1.default.hex("#6A9955"), // green - comments
        doctag: chalk_1.default.hex("#608B4E"), // darker green - jsdoc tags
        meta: chalk_1.default.hex("#9CDCFE"), // light blue - meta/preprocessor
        "meta-keyword": chalk_1.default.hex("#C586C0"), // purple
        "meta-string": chalk_1.default.hex("#CE9178"), // orange
        section: chalk_1.default.hex("#DCDCAA"), // yellow - sections
        tag: chalk_1.default.hex("#569CD6"), // blue - HTML/XML tags
        name: chalk_1.default.hex("#9CDCFE"), // light blue - tag names
        attr: chalk_1.default.hex("#9CDCFE"), // light blue - attributes
        attribute: chalk_1.default.hex("#9CDCFE"), // light blue - attributes
        variable: chalk_1.default.hex("#9CDCFE"), // light blue - variables
        bullet: chalk_1.default.hex("#D7BA7D"), // gold - list bullets in markdown
        code: chalk_1.default.hex("#CE9178"), // orange - inline code
        emphasis: chalk_1.default.italic, // italic
        strong: chalk_1.default.bold, // bold
        formula: chalk_1.default.hex("#C586C0"), // purple - math
        link: chalk_1.default.hex("#4EC9B0"), // teal - links
        quote: chalk_1.default.hex("#6A9955"), // green - quotes
        addition: chalk_1.default.hex("#B5CEA8"), // green - diff additions
        deletion: chalk_1.default.hex("#F44747"), // red - diff deletions
        "selector-tag": chalk_1.default.hex("#D7BA7D"), // gold - CSS selectors
        "selector-id": chalk_1.default.hex("#D7BA7D"), // gold
        "selector-class": chalk_1.default.hex("#D7BA7D"), // gold
        "selector-attr": chalk_1.default.hex("#D7BA7D"), // gold
        "selector-pseudo": chalk_1.default.hex("#D7BA7D"), // gold
        "template-tag": chalk_1.default.hex("#C586C0"), // purple
        "template-variable": chalk_1.default.hex("#9CDCFE"), // light blue
        default: fallback, // fallback to code color
    };
}
