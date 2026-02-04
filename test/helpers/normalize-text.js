"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTestText = normalizeTestText;
function stripAnsi(input) {
    var out = "";
    for (var i = 0; i < input.length; i++) {
        var code = input.charCodeAt(i);
        if (code !== 27) {
            out += input[i];
            continue;
        }
        var next = input[i + 1];
        if (next !== "[") {
            continue;
        }
        i += 1;
        while (i + 1 < input.length) {
            i += 1;
            var c = input[i];
            if (!c) {
                break;
            }
            var isLetter = (c >= "A" && c <= "Z") || (c >= "a" && c <= "z") || c === "~";
            if (isLetter) {
                break;
            }
        }
    }
    return out;
}
function normalizeTestText(input) {
    return stripAnsi(input)
        .replaceAll("\r\n", "\n")
        .replaceAll("…", "...")
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?")
        .replace(/[\uD800-\uDFFF]/g, "?");
}
