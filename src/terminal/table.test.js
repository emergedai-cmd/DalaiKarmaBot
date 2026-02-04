"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var ansi_js_1 = require("./ansi.js");
var table_js_1 = require("./table.js");
(0, vitest_1.describe)("renderTable", function () {
    (0, vitest_1.it)("prefers shrinking flex columns to avoid wrapping non-flex labels", function () {
        var out = (0, table_js_1.renderTable)({
            width: 40,
            columns: [
                { key: "Item", header: "Item", minWidth: 10 },
                { key: "Value", header: "Value", flex: true, minWidth: 24 },
            ],
            rows: [{ Item: "Dashboard", Value: "http://127.0.0.1:18789/" }],
        });
        (0, vitest_1.expect)(out).toContain("Dashboard");
        (0, vitest_1.expect)(out).toMatch(/│ Dashboard\s+│/);
    });
    (0, vitest_1.it)("expands flex columns to fill available width", function () {
        var _a;
        var width = 60;
        var out = (0, table_js_1.renderTable)({
            width: width,
            columns: [
                { key: "Item", header: "Item", minWidth: 10 },
                { key: "Value", header: "Value", flex: true, minWidth: 24 },
            ],
            rows: [{ Item: "OS", Value: "macos 26.2 (arm64)" }],
        });
        var firstLine = (_a = out.trimEnd().split("\n")[0]) !== null && _a !== void 0 ? _a : "";
        (0, vitest_1.expect)((0, ansi_js_1.visibleWidth)(firstLine)).toBe(width);
    });
    (0, vitest_1.it)("wraps ANSI-colored cells without corrupting escape sequences", function () {
        var out = (0, table_js_1.renderTable)({
            width: 36,
            columns: [
                { key: "K", header: "K", minWidth: 3 },
                { key: "V", header: "V", flex: true, minWidth: 10 },
            ],
            rows: [
                {
                    K: "X",
                    V: "\u001B[33m".concat("a".repeat(120), "\u001B[0m"),
                },
            ],
        });
        var ESC = "\u001b";
        for (var i = 0; i < out.length; i += 1) {
            if (out[i] !== ESC) {
                continue;
            }
            // SGR: ESC [ ... m
            if (out[i + 1] === "[") {
                var j = i + 2;
                while (j < out.length) {
                    var ch = out[j];
                    if (ch === "m") {
                        break;
                    }
                    if (ch && ch >= "0" && ch <= "9") {
                        j += 1;
                        continue;
                    }
                    if (ch === ";") {
                        j += 1;
                        continue;
                    }
                    break;
                }
                (0, vitest_1.expect)(out[j]).toBe("m");
                i = j;
                continue;
            }
            // OSC-8: ESC ] 8 ; ; ... ST (ST = ESC \)
            if (out[i + 1] === "]" && out.slice(i + 2, i + 5) === "8;;") {
                var st = out.indexOf("".concat(ESC, "\\"), i + 5);
                (0, vitest_1.expect)(st).toBeGreaterThanOrEqual(0);
                i = st + 1;
                continue;
            }
            throw new Error("Unexpected escape sequence at index ".concat(i));
        }
    });
    (0, vitest_1.it)("resets ANSI styling on wrapped lines", function () {
        var reset = "\x1b[0m";
        var out = (0, table_js_1.renderTable)({
            width: 24,
            columns: [
                { key: "K", header: "K", minWidth: 3 },
                { key: "V", header: "V", flex: true, minWidth: 10 },
            ],
            rows: [
                {
                    K: "X",
                    V: "\u001B[31m".concat("a".repeat(80)).concat(reset),
                },
            ],
        });
        var lines = out.split("\n").filter(function (line) { return line.includes("a"); });
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var resetIndex = line.lastIndexOf(reset);
            var lastSep = line.lastIndexOf("│");
            (0, vitest_1.expect)(resetIndex).toBeGreaterThan(-1);
            (0, vitest_1.expect)(lastSep).toBeGreaterThan(resetIndex);
        }
    });
    (0, vitest_1.it)("respects explicit newlines in cell values", function () {
        var out = (0, table_js_1.renderTable)({
            width: 48,
            columns: [
                { key: "A", header: "A", minWidth: 6 },
                { key: "B", header: "B", minWidth: 10, flex: true },
            ],
            rows: [{ A: "row", B: "line1\nline2" }],
        });
        var lines = out.trimEnd().split("\n");
        var line1Index = lines.findIndex(function (line) { return line.includes("line1"); });
        var line2Index = lines.findIndex(function (line) { return line.includes("line2"); });
        (0, vitest_1.expect)(line1Index).toBeGreaterThan(-1);
        (0, vitest_1.expect)(line2Index).toBe(line1Index + 1);
    });
});
