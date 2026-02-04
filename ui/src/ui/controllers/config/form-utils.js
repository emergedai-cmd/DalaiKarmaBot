"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneConfigObject = cloneConfigObject;
exports.serializeConfigForm = serializeConfigForm;
exports.setPathValue = setPathValue;
exports.removePathValue = removePathValue;
function cloneConfigObject(value) {
    if (typeof structuredClone === "function") {
        return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
}
function serializeConfigForm(form) {
    return "".concat(JSON.stringify(form, null, 2).trimEnd(), "\n");
}
function setPathValue(obj, path, value) {
    if (path.length === 0) {
        return;
    }
    var current = obj;
    for (var i = 0; i < path.length - 1; i += 1) {
        var key = path[i];
        var nextKey = path[i + 1];
        if (typeof key === "number") {
            if (!Array.isArray(current)) {
                return;
            }
            if (current[key] == null) {
                current[key] = typeof nextKey === "number" ? [] : {};
            }
            current = current[key];
        }
        else {
            if (typeof current !== "object" || current == null) {
                return;
            }
            var record = current;
            if (record[key] == null) {
                record[key] = typeof nextKey === "number" ? [] : {};
            }
            current = record[key];
        }
    }
    var lastKey = path[path.length - 1];
    if (typeof lastKey === "number") {
        if (Array.isArray(current)) {
            current[lastKey] = value;
        }
        return;
    }
    if (typeof current === "object" && current != null) {
        current[lastKey] = value;
    }
}
function removePathValue(obj, path) {
    if (path.length === 0) {
        return;
    }
    var current = obj;
    for (var i = 0; i < path.length - 1; i += 1) {
        var key = path[i];
        if (typeof key === "number") {
            if (!Array.isArray(current)) {
                return;
            }
            current = current[key];
        }
        else {
            if (typeof current !== "object" || current == null) {
                return;
            }
            current = current[key];
        }
        if (current == null) {
            return;
        }
    }
    var lastKey = path[path.length - 1];
    if (typeof lastKey === "number") {
        if (Array.isArray(current)) {
            current.splice(lastKey, 1);
        }
        return;
    }
    if (typeof current === "object" && current != null) {
        delete current[lastKey];
    }
}
