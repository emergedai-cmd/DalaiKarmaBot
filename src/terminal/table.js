"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTable = renderTable;
var utils_js_1 = require("../utils.js");
var ansi_js_1 = require("./ansi.js");
function repeat(ch, n) {
    if (n <= 0) {
        return "";
    }
    return ch.repeat(n);
}
function padCell(text, width, align) {
    var w = (0, ansi_js_1.visibleWidth)(text);
    if (w >= width) {
        return text;
    }
    var pad = width - w;
    if (align === "right") {
        return "".concat(repeat(" ", pad)).concat(text);
    }
    if (align === "center") {
        var left = Math.floor(pad / 2);
        var right = pad - left;
        return "".concat(repeat(" ", left)).concat(text).concat(repeat(" ", right));
    }
    return "".concat(text).concat(repeat(" ", pad));
}
function wrapLine(text, width) {
    var _a;
    if (width <= 0) {
        return [text];
    }
    // ANSI-aware wrapping: never split inside ANSI SGR/OSC-8 sequences.
    // We don't attempt to re-open styling per line; terminals keep SGR state
    // across newlines, so as long as we don't corrupt escape sequences we're safe.
    var ESC = "\u001b";
    var tokens = [];
    for (var i = 0; i < text.length;) {
        if (text[i] === ESC) {
            // SGR: ESC [ ... m
            if (text[i + 1] === "[") {
                var j = i + 2;
                while (j < text.length) {
                    var ch_1 = text[j];
                    if (ch_1 === "m") {
                        break;
                    }
                    if (ch_1 && ch_1 >= "0" && ch_1 <= "9") {
                        j += 1;
                        continue;
                    }
                    if (ch_1 === ";") {
                        j += 1;
                        continue;
                    }
                    break;
                }
                if (text[j] === "m") {
                    tokens.push({ kind: "ansi", value: text.slice(i, j + 1) });
                    i = j + 1;
                    continue;
                }
            }
            // OSC-8 link open/close: ESC ] 8 ; ; ... ST (ST = ESC \)
            if (text[i + 1] === "]" && text.slice(i + 2, i + 5) === "8;;") {
                var st = text.indexOf("".concat(ESC, "\\"), i + 5);
                if (st >= 0) {
                    tokens.push({ kind: "ansi", value: text.slice(i, st + 2) });
                    i = st + 2;
                    continue;
                }
            }
        }
        var cp = text.codePointAt(i);
        if (!cp) {
            break;
        }
        var ch = String.fromCodePoint(cp);
        tokens.push({ kind: "char", value: ch });
        i += ch.length;
    }
    var firstCharIndex = tokens.findIndex(function (t) { return t.kind === "char"; });
    if (firstCharIndex < 0) {
        return [text];
    }
    var lastCharIndex = -1;
    for (var i = tokens.length - 1; i >= 0; i -= 1) {
        if (((_a = tokens[i]) === null || _a === void 0 ? void 0 : _a.kind) === "char") {
            lastCharIndex = i;
            break;
        }
    }
    var prefixAnsi = tokens
        .slice(0, firstCharIndex)
        .filter(function (t) { return t.kind === "ansi"; })
        .map(function (t) { return t.value; })
        .join("");
    var suffixAnsi = tokens
        .slice(lastCharIndex + 1)
        .filter(function (t) { return t.kind === "ansi"; })
        .map(function (t) { return t.value; })
        .join("");
    var coreTokens = tokens.slice(firstCharIndex, lastCharIndex + 1);
    var lines = [];
    var isBreakChar = function (ch) {
        return ch === " " || ch === "\t" || ch === "/" || ch === "-" || ch === "_" || ch === ".";
    };
    var isSpaceChar = function (ch) { return ch === " " || ch === "\t"; };
    var skipNextLf = false;
    var buf = [];
    var bufVisible = 0;
    var lastBreakIndex = null;
    var bufToString = function (slice) { return (slice !== null && slice !== void 0 ? slice : buf).map(function (t) { return t.value; }).join(""); };
    var bufVisibleWidth = function (slice) {
        return slice.reduce(function (acc, t) { return acc + (t.kind === "char" ? 1 : 0); }, 0);
    };
    var pushLine = function (value) {
        var cleaned = value.replace(/\s+$/, "");
        if (cleaned.trim().length === 0) {
            return;
        }
        lines.push(cleaned);
    };
    var flushAt = function (breakAt) {
        var _a;
        if (buf.length === 0) {
            return;
        }
        if (breakAt == null || breakAt <= 0) {
            pushLine(bufToString());
            buf.length = 0;
            bufVisible = 0;
            lastBreakIndex = null;
            return;
        }
        var left = buf.slice(0, breakAt);
        var rest = buf.slice(breakAt);
        pushLine(bufToString(left));
        while (rest.length > 0 && ((_a = rest[0]) === null || _a === void 0 ? void 0 : _a.kind) === "char" && isSpaceChar(rest[0].value)) {
            rest.shift();
        }
        buf.length = 0;
        buf.push.apply(buf, rest);
        bufVisible = bufVisibleWidth(buf);
        lastBreakIndex = null;
    };
    for (var _i = 0, coreTokens_1 = coreTokens; _i < coreTokens_1.length; _i++) {
        var token = coreTokens_1[_i];
        if (token.kind === "ansi") {
            buf.push(token);
            continue;
        }
        var ch = token.value;
        if (skipNextLf) {
            skipNextLf = false;
            if (ch === "\n") {
                continue;
            }
        }
        if (ch === "\n" || ch === "\r") {
            flushAt(buf.length);
            if (ch === "\r") {
                skipNextLf = true;
            }
            continue;
        }
        if (bufVisible + 1 > width && bufVisible > 0) {
            flushAt(lastBreakIndex);
        }
        buf.push(token);
        bufVisible += 1;
        if (isBreakChar(ch)) {
            lastBreakIndex = buf.length;
        }
    }
    flushAt(buf.length);
    if (!lines.length) {
        return [""];
    }
    if (!prefixAnsi && !suffixAnsi) {
        return lines;
    }
    return lines.map(function (line) {
        if (!line) {
            return line;
        }
        return "".concat(prefixAnsi).concat(line).concat(suffixAnsi);
    });
}
function normalizeWidth(n) {
    if (n == null) {
        return undefined;
    }
    if (!Number.isFinite(n) || n <= 0) {
        return undefined;
    }
    return Math.floor(n);
}
function renderTable(opts) {
    var _a, _b, _d, _e, _f;
    var rows = opts.rows.map(function (row) {
        var next = {};
        for (var _i = 0, _a = Object.entries(row); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            next[key] = (0, utils_js_1.displayString)(value);
        }
        return next;
    });
    var border = (_a = opts.border) !== null && _a !== void 0 ? _a : "unicode";
    if (border === "none") {
        var columns_1 = opts.columns;
        var header = columns_1.map(function (c) { return c.header; }).join(" | ");
        var lines_1 = __spreadArray([header], rows.map(function (r) { return columns_1.map(function (c) { var _a; return (_a = r[c.key]) !== null && _a !== void 0 ? _a : ""; }).join(" | "); }), true);
        return "".concat(lines_1.join("\n"), "\n");
    }
    var padding = Math.max(0, (_b = opts.padding) !== null && _b !== void 0 ? _b : 1);
    var columns = opts.columns;
    var metrics = columns.map(function (c) {
        var headerW = (0, ansi_js_1.visibleWidth)(c.header);
        var cellW = Math.max.apply(Math, __spreadArray([0], rows.map(function (r) { var _a; return (0, ansi_js_1.visibleWidth)((_a = r[c.key]) !== null && _a !== void 0 ? _a : ""); }), false));
        return { headerW: headerW, cellW: cellW };
    });
    var widths = columns.map(function (c, i) {
        var _a, _b, _d;
        var m = metrics[i];
        var base = Math.max((_a = m === null || m === void 0 ? void 0 : m.headerW) !== null && _a !== void 0 ? _a : 0, (_b = m === null || m === void 0 ? void 0 : m.cellW) !== null && _b !== void 0 ? _b : 0) + padding * 2;
        var capped = c.maxWidth ? Math.min(base, c.maxWidth) : base;
        return Math.max((_d = c.minWidth) !== null && _d !== void 0 ? _d : 3, capped);
    });
    var maxWidth = normalizeWidth(opts.width);
    var sepCount = columns.length + 1;
    var total = widths.reduce(function (a, b) { return a + b; }, 0) + sepCount;
    var preferredMinWidths = columns.map(function (c, i) { var _a, _b, _d; return Math.max((_a = c.minWidth) !== null && _a !== void 0 ? _a : 3, ((_d = (_b = metrics[i]) === null || _b === void 0 ? void 0 : _b.headerW) !== null && _d !== void 0 ? _d : 0) + padding * 2, 3); });
    var absoluteMinWidths = columns.map(function (_c, i) { var _a, _b; return Math.max(((_b = (_a = metrics[i]) === null || _a === void 0 ? void 0 : _a.headerW) !== null && _b !== void 0 ? _b : 0) + padding * 2, 3); });
    if (maxWidth && total > maxWidth) {
        var over_1 = total - maxWidth;
        var flexOrder = columns
            .map(function (_c, i) { var _a; return ({ i: i, w: (_a = widths[i]) !== null && _a !== void 0 ? _a : 0 }); })
            .filter(function (_a) {
            var _b;
            var i = _a.i;
            return Boolean((_b = columns[i]) === null || _b === void 0 ? void 0 : _b.flex);
        })
            .toSorted(function (a, b) { return b.w - a.w; })
            .map(function (x) { return x.i; });
        var nonFlexOrder = columns
            .map(function (_c, i) { var _a; return ({ i: i, w: (_a = widths[i]) !== null && _a !== void 0 ? _a : 0 }); })
            .filter(function (_a) {
            var _b;
            var i = _a.i;
            return !((_b = columns[i]) === null || _b === void 0 ? void 0 : _b.flex);
        })
            .toSorted(function (a, b) { return b.w - a.w; })
            .map(function (x) { return x.i; });
        var shrink = function (order, minWidths) {
            var _a, _b, _d;
            while (over_1 > 0) {
                var progressed = false;
                for (var _i = 0, order_1 = order; _i < order_1.length; _i++) {
                    var i = order_1[_i];
                    if (((_a = widths[i]) !== null && _a !== void 0 ? _a : 0) <= ((_b = minWidths[i]) !== null && _b !== void 0 ? _b : 0)) {
                        continue;
                    }
                    widths[i] = ((_d = widths[i]) !== null && _d !== void 0 ? _d : 0) - 1;
                    over_1 -= 1;
                    progressed = true;
                    if (over_1 <= 0) {
                        break;
                    }
                }
                if (!progressed) {
                    break;
                }
            }
        };
        // Prefer shrinking flex columns; only shrink non-flex if necessary.
        // If required to fit, allow flex columns to shrink below user minWidth
        // down to their absolute minimum (header + padding).
        shrink(flexOrder, preferredMinWidths);
        shrink(flexOrder, absoluteMinWidths);
        shrink(nonFlexOrder, preferredMinWidths);
        shrink(nonFlexOrder, absoluteMinWidths);
    }
    // If we have room and any flex columns, expand them to fill the available width.
    // This keeps tables from looking "clipped" and reduces wrapping in wide terminals.
    if (maxWidth) {
        var sepCount_1 = columns.length + 1;
        var currentTotal = widths.reduce(function (a, b) { return a + b; }, 0) + sepCount_1;
        var extra = maxWidth - currentTotal;
        if (extra > 0) {
            var flexCols = columns
                .map(function (c, i) { return ({ c: c, i: i }); })
                .filter(function (_a) {
                var c = _a.c;
                return Boolean(c.flex);
            })
                .map(function (_a) {
                var i = _a.i;
                return i;
            });
            if (flexCols.length > 0) {
                var caps = columns.map(function (c) {
                    return typeof c.maxWidth === "number" && c.maxWidth > 0
                        ? Math.floor(c.maxWidth)
                        : Number.POSITIVE_INFINITY;
                });
                while (extra > 0) {
                    var progressed = false;
                    for (var _i = 0, flexCols_1 = flexCols; _i < flexCols_1.length; _i++) {
                        var i = flexCols_1[_i];
                        if (((_d = widths[i]) !== null && _d !== void 0 ? _d : 0) >= ((_e = caps[i]) !== null && _e !== void 0 ? _e : Number.POSITIVE_INFINITY)) {
                            continue;
                        }
                        widths[i] = ((_f = widths[i]) !== null && _f !== void 0 ? _f : 0) + 1;
                        extra -= 1;
                        progressed = true;
                        if (extra <= 0) {
                            break;
                        }
                    }
                    if (!progressed) {
                        break;
                    }
                }
            }
        }
    }
    var box = border === "ascii"
        ? {
            tl: "+",
            tr: "+",
            bl: "+",
            br: "+",
            h: "-",
            v: "|",
            t: "+",
            ml: "+",
            m: "+",
            mr: "+",
            b: "+",
        }
        : {
            tl: "┌",
            tr: "┐",
            bl: "└",
            br: "┘",
            h: "─",
            v: "│",
            t: "┬",
            ml: "├",
            m: "┼",
            mr: "┤",
            b: "┴",
        };
    var hLine = function (left, mid, right) {
        return "".concat(left).concat(widths.map(function (w) { return repeat(box.h, w); }).join(mid)).concat(right);
    };
    var contentWidthFor = function (i) { return Math.max(1, widths[i] - padding * 2); };
    var padStr = repeat(" ", padding);
    var renderRow = function (record, isHeader) {
        if (isHeader === void 0) { isHeader = false; }
        var cells = columns.map(function (c) { var _a; return (isHeader ? c.header : ((_a = record[c.key]) !== null && _a !== void 0 ? _a : "")); });
        var wrapped = cells.map(function (cell, i) { return wrapLine(cell, contentWidthFor(i)); });
        var height = Math.max.apply(Math, wrapped.map(function (w) { return w.length; }));
        var out = [];
        var _loop_1 = function (li) {
            var parts = wrapped.map(function (lines, i) {
                var _a, _b, _d;
                var raw = (_a = lines[li]) !== null && _a !== void 0 ? _a : "";
                var aligned = padCell(raw, contentWidthFor(i), (_d = (_b = columns[i]) === null || _b === void 0 ? void 0 : _b.align) !== null && _d !== void 0 ? _d : "left");
                return "".concat(padStr).concat(aligned).concat(padStr);
            });
            out.push("".concat(box.v).concat(parts.join(box.v)).concat(box.v));
        };
        for (var li = 0; li < height; li += 1) {
            _loop_1(li);
        }
        return out;
    };
    var lines = [];
    lines.push(hLine(box.tl, box.t, box.tr));
    lines.push.apply(lines, renderRow({}, true));
    lines.push(hLine(box.ml, box.m, box.mr));
    for (var _g = 0, rows_1 = rows; _g < rows_1.length; _g++) {
        var row = rows_1[_g];
        lines.push.apply(lines, renderRow(row, false));
    }
    lines.push(hLine(box.bl, box.b, box.br));
    return "".concat(lines.join("\n"), "\n");
}
