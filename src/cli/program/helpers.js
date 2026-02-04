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
exports.collectOption = collectOption;
exports.parsePositiveIntOrUndefined = parsePositiveIntOrUndefined;
exports.resolveActionArgs = resolveActionArgs;
function collectOption(value, previous) {
    if (previous === void 0) { previous = []; }
    return __spreadArray(__spreadArray([], previous, true), [value], false);
}
function parsePositiveIntOrUndefined(value) {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            return undefined;
        }
        var parsed = Math.trunc(value);
        return parsed > 0 ? parsed : undefined;
    }
    if (typeof value === "string") {
        var parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed) || parsed <= 0) {
            return undefined;
        }
        return parsed;
    }
    return undefined;
}
function resolveActionArgs(actionCommand) {
    if (!actionCommand) {
        return [];
    }
    var args = actionCommand.args;
    return Array.isArray(args) ? args : [];
}
