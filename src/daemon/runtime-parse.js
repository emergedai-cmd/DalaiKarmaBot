"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeyValueOutput = parseKeyValueOutput;
function parseKeyValueOutput(output, separator) {
    var entries = {};
    for (var _i = 0, _a = output.split(/\r?\n/); _i < _a.length; _i++) {
        var rawLine = _a[_i];
        var line = rawLine.trim();
        if (!line) {
            continue;
        }
        var idx = line.indexOf(separator);
        if (idx <= 0) {
            continue;
        }
        var key = line.slice(0, idx).trim().toLowerCase();
        if (!key) {
            continue;
        }
        var value = line.slice(idx + separator.length).trim();
        entries[key] = value;
    }
    return entries;
}
