"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var unhandled_rejections_js_1 = require("./unhandled-rejections.js");
(0, vitest_1.describe)("isAbortError", function () {
    (0, vitest_1.it)("returns true for error with name AbortError", function () {
        var error = new Error("aborted");
        error.name = "AbortError";
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(error)).toBe(true);
    });
    (0, vitest_1.it)('returns true for error with "This operation was aborted" message', function () {
        var error = new Error("This operation was aborted");
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(error)).toBe(true);
    });
    (0, vitest_1.it)("returns true for undici-style AbortError", function () {
        // Node's undici throws errors with this exact message
        var error = Object.assign(new Error("This operation was aborted"), { name: "AbortError" });
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(error)).toBe(true);
    });
    (0, vitest_1.it)("returns true for object with AbortError name", function () {
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)({ name: "AbortError", message: "test" })).toBe(true);
    });
    (0, vitest_1.it)("returns false for regular errors", function () {
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(new Error("Something went wrong"))).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(new TypeError("Cannot read property"))).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(new RangeError("Invalid array length"))).toBe(false);
    });
    (0, vitest_1.it)("returns false for errors with similar but different messages", function () {
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(new Error("Operation aborted"))).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(new Error("aborted"))).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(new Error("Request was aborted"))).toBe(false);
    });
    (0, vitest_1.it)("returns false for null and undefined", function () {
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(null)).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(undefined)).toBe(false);
    });
    (0, vitest_1.it)("returns false for non-error values", function () {
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)("string error")).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)(42)).toBe(false);
    });
    (0, vitest_1.it)("returns false for plain objects without AbortError name", function () {
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isAbortError)({ message: "plain object" })).toBe(false);
    });
});
(0, vitest_1.describe)("isTransientNetworkError", function () {
    (0, vitest_1.it)("returns true for errors with transient network codes", function () {
        var codes = [
            "ECONNRESET",
            "ECONNREFUSED",
            "ENOTFOUND",
            "ETIMEDOUT",
            "ESOCKETTIMEDOUT",
            "ECONNABORTED",
            "EPIPE",
            "EHOSTUNREACH",
            "ENETUNREACH",
            "EAI_AGAIN",
            "UND_ERR_CONNECT_TIMEOUT",
            "UND_ERR_SOCKET",
            "UND_ERR_HEADERS_TIMEOUT",
            "UND_ERR_BODY_TIMEOUT",
        ];
        for (var _i = 0, codes_1 = codes; _i < codes_1.length; _i++) {
            var code = codes_1[_i];
            var error = Object.assign(new Error("test"), { code: code });
            (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(error), "code: ".concat(code)).toBe(true);
        }
    });
    (0, vitest_1.it)('returns true for TypeError with "fetch failed" message', function () {
        var error = new TypeError("fetch failed");
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(error)).toBe(true);
    });
    (0, vitest_1.it)("returns true for fetch failed with network cause", function () {
        var cause = Object.assign(new Error("getaddrinfo ENOTFOUND"), { code: "ENOTFOUND" });
        var error = Object.assign(new TypeError("fetch failed"), { cause: cause });
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(error)).toBe(true);
    });
    (0, vitest_1.it)("returns true for nested cause chain with network error", function () {
        var innerCause = Object.assign(new Error("connection reset"), { code: "ECONNRESET" });
        var outerCause = Object.assign(new Error("wrapper"), { cause: innerCause });
        var error = Object.assign(new TypeError("fetch failed"), { cause: outerCause });
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(error)).toBe(true);
    });
    (0, vitest_1.it)("returns true for AggregateError containing network errors", function () {
        var networkError = Object.assign(new Error("timeout"), { code: "ETIMEDOUT" });
        var error = new AggregateError([networkError], "Multiple errors");
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(error)).toBe(true);
    });
    (0, vitest_1.it)("returns false for regular errors without network codes", function () {
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(new Error("Something went wrong"))).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(new TypeError("Cannot read property"))).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(new RangeError("Invalid array length"))).toBe(false);
    });
    (0, vitest_1.it)("returns false for errors with non-network codes", function () {
        var error = Object.assign(new Error("test"), { code: "INVALID_CONFIG" });
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(error)).toBe(false);
    });
    (0, vitest_1.it)("returns false for null and undefined", function () {
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(null)).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(undefined)).toBe(false);
    });
    (0, vitest_1.it)("returns false for non-error values", function () {
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)("string error")).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(42)).toBe(false);
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)({ message: "plain object" })).toBe(false);
    });
    (0, vitest_1.it)("returns false for AggregateError with only non-network errors", function () {
        var error = new AggregateError([new Error("regular error")], "Multiple errors");
        (0, vitest_1.expect)((0, unhandled_rejections_js_1.isTransientNetworkError)(error)).toBe(false);
    });
});
