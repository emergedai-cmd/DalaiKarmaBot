"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var ir_js_1 = require("./ir.js");
(0, vitest_1.describe)("markdownToIR tableMode bullets", function () {
    (0, vitest_1.it)("converts simple table to bullets", function () {
        var md = "\n| Name | Value |\n|------|-------|\n| A    | 1     |\n| B    | 2     |\n".trim();
        var ir = (0, ir_js_1.markdownToIR)(md, { tableMode: "bullets" });
        // Should contain bullet points with header:value format
        (0, vitest_1.expect)(ir.text).toContain("• Value: 1");
        (0, vitest_1.expect)(ir.text).toContain("• Value: 2");
        // Should use first column as labels
        (0, vitest_1.expect)(ir.text).toContain("A");
        (0, vitest_1.expect)(ir.text).toContain("B");
    });
    (0, vitest_1.it)("handles table with multiple columns", function () {
        var md = "\n| Feature | SQLite | Postgres |\n|---------|--------|----------|\n| Speed   | Fast   | Medium   |\n| Scale   | Small  | Large    |\n".trim();
        var ir = (0, ir_js_1.markdownToIR)(md, { tableMode: "bullets" });
        // First column becomes row label
        (0, vitest_1.expect)(ir.text).toContain("Speed");
        (0, vitest_1.expect)(ir.text).toContain("Scale");
        // Other columns become bullet points
        (0, vitest_1.expect)(ir.text).toContain("• SQLite: Fast");
        (0, vitest_1.expect)(ir.text).toContain("• Postgres: Medium");
        (0, vitest_1.expect)(ir.text).toContain("• SQLite: Small");
        (0, vitest_1.expect)(ir.text).toContain("• Postgres: Large");
    });
    (0, vitest_1.it)("leaves table syntax untouched by default", function () {
        var md = "\n| A | B |\n|---|---|\n| 1 | 2 |\n".trim();
        var ir = (0, ir_js_1.markdownToIR)(md);
        // No table conversion by default
        (0, vitest_1.expect)(ir.text).toContain("| A | B |");
        (0, vitest_1.expect)(ir.text).toContain("| 1 | 2 |");
        (0, vitest_1.expect)(ir.text).not.toContain("•");
        (0, vitest_1.expect)(ir.styles.some(function (style) { return style.style === "code_block"; })).toBe(false);
    });
    (0, vitest_1.it)("handles empty cells gracefully", function () {
        var md = "\n| Name | Value |\n|------|-------|\n| A    |       |\n| B    | 2     |\n".trim();
        var ir = (0, ir_js_1.markdownToIR)(md, { tableMode: "bullets" });
        // Should handle empty cell without crashing
        (0, vitest_1.expect)(ir.text).toContain("B");
        (0, vitest_1.expect)(ir.text).toContain("• Value: 2");
    });
    (0, vitest_1.it)("bolds row labels in bullets mode", function () {
        var md = "\n| Name | Value |\n|------|-------|\n| Row1 | Data1 |\n".trim();
        var ir = (0, ir_js_1.markdownToIR)(md, { tableMode: "bullets" });
        // Should have bold style for row label
        var hasRowLabelBold = ir.styles.some(function (s) { return s.style === "bold" && ir.text.slice(s.start, s.end) === "Row1"; });
        (0, vitest_1.expect)(hasRowLabelBold).toBe(true);
    });
    (0, vitest_1.it)("renders tables as code blocks in code mode", function () {
        var md = "\n| A | B |\n|---|---|\n| 1 | 2 |\n".trim();
        var ir = (0, ir_js_1.markdownToIR)(md, { tableMode: "code" });
        (0, vitest_1.expect)(ir.text).toContain("| A | B |");
        (0, vitest_1.expect)(ir.text).toContain("| 1 | 2 |");
        (0, vitest_1.expect)(ir.styles.some(function (style) { return style.style === "code_block"; })).toBe(true);
    });
    (0, vitest_1.it)("preserves inline styles and links in bullets mode", function () {
        var md = "\n| Name | Value |\n|------|-------|\n| _Row_ | [Link](https://example.com) |\n".trim();
        var ir = (0, ir_js_1.markdownToIR)(md, { tableMode: "bullets" });
        var hasItalic = ir.styles.some(function (s) { return s.style === "italic" && ir.text.slice(s.start, s.end) === "Row"; });
        (0, vitest_1.expect)(hasItalic).toBe(true);
        (0, vitest_1.expect)(ir.links.some(function (link) { return link.href === "https://example.com"; })).toBe(true);
    });
});
