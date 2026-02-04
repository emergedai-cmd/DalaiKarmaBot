"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var index_js_1 = require("./index.js");
var makeError = function (overrides) { return (__assign({ keyword: "type", instancePath: "", schemaPath: "#/", params: {}, message: "validation error" }, overrides)); };
(0, vitest_1.describe)("formatValidationErrors", function () {
    (0, vitest_1.it)("returns unknown validation error when missing errors", function () {
        (0, vitest_1.expect)((0, index_js_1.formatValidationErrors)(undefined)).toBe("unknown validation error");
        (0, vitest_1.expect)((0, index_js_1.formatValidationErrors)(null)).toBe("unknown validation error");
    });
    (0, vitest_1.it)("returns unknown validation error when errors list is empty", function () {
        (0, vitest_1.expect)((0, index_js_1.formatValidationErrors)([])).toBe("unknown validation error");
    });
    (0, vitest_1.it)("formats additionalProperties at root", function () {
        var err = makeError({
            keyword: "additionalProperties",
            params: { additionalProperty: "token" },
        });
        (0, vitest_1.expect)((0, index_js_1.formatValidationErrors)([err])).toBe("at root: unexpected property 'token'");
    });
    (0, vitest_1.it)("formats additionalProperties with instancePath", function () {
        var err = makeError({
            keyword: "additionalProperties",
            instancePath: "/auth",
            params: { additionalProperty: "token" },
        });
        (0, vitest_1.expect)((0, index_js_1.formatValidationErrors)([err])).toBe("at /auth: unexpected property 'token'");
    });
    (0, vitest_1.it)("formats message with path for other errors", function () {
        var err = makeError({
            keyword: "required",
            instancePath: "/auth",
            message: "must have required property 'token'",
        });
        (0, vitest_1.expect)((0, index_js_1.formatValidationErrors)([err])).toBe("at /auth: must have required property 'token'");
    });
    (0, vitest_1.it)("de-dupes repeated entries", function () {
        var err = makeError({
            keyword: "required",
            instancePath: "/auth",
            message: "must have required property 'token'",
        });
        (0, vitest_1.expect)((0, index_js_1.formatValidationErrors)([err, err])).toBe("at /auth: must have required property 'token'");
    });
});
