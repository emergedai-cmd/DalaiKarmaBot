"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaType = schemaType;
exports.defaultValue = defaultValue;
exports.pathKey = pathKey;
exports.hintForPath = hintForPath;
exports.humanize = humanize;
exports.isSensitivePath = isSensitivePath;
function schemaType(schema) {
    var _a;
    if (!schema) {
        return undefined;
    }
    if (Array.isArray(schema.type)) {
        var filtered = schema.type.filter(function (t) { return t !== "null"; });
        return (_a = filtered[0]) !== null && _a !== void 0 ? _a : schema.type[0];
    }
    return schema.type;
}
function defaultValue(schema) {
    if (!schema) {
        return "";
    }
    if (schema.default !== undefined) {
        return schema.default;
    }
    var type = schemaType(schema);
    switch (type) {
        case "object":
            return {};
        case "array":
            return [];
        case "boolean":
            return false;
        case "number":
        case "integer":
            return 0;
        case "string":
            return "";
        default:
            return "";
    }
}
function pathKey(path) {
    return path.filter(function (segment) { return typeof segment === "string"; }).join(".");
}
function hintForPath(path, hints) {
    var key = pathKey(path);
    var direct = hints[key];
    if (direct) {
        return direct;
    }
    var segments = key.split(".");
    for (var _i = 0, _a = Object.entries(hints); _i < _a.length; _i++) {
        var _b = _a[_i], hintKey = _b[0], hint = _b[1];
        if (!hintKey.includes("*")) {
            continue;
        }
        var hintSegments = hintKey.split(".");
        if (hintSegments.length !== segments.length) {
            continue;
        }
        var match = true;
        for (var i = 0; i < segments.length; i += 1) {
            if (hintSegments[i] !== "*" && hintSegments[i] !== segments[i]) {
                match = false;
                break;
            }
        }
        if (match) {
            return hint;
        }
    }
    return undefined;
}
function humanize(raw) {
    return raw
        .replace(/_/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .replace(/^./, function (m) { return m.toUpperCase(); });
}
function isSensitivePath(path) {
    var key = pathKey(path).toLowerCase();
    return (key.includes("token") ||
        key.includes("password") ||
        key.includes("secret") ||
        key.includes("apikey") ||
        key.endsWith("key"));
}
