"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readString = readString;
exports.readBool = readBool;
exports.readNumber = readNumber;
function readString(meta, keys) {
    if (!meta) {
        return undefined;
    }
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var value = meta[key];
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }
    return undefined;
}
function readBool(meta, keys) {
    if (!meta) {
        return undefined;
    }
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        var value = meta[key];
        if (typeof value === "boolean") {
            return value;
        }
    }
    return undefined;
}
function readNumber(meta, keys) {
    if (!meta) {
        return undefined;
    }
    for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
        var key = keys_3[_i];
        var value = meta[key];
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }
    }
    return undefined;
}
