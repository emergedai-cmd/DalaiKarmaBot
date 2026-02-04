"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var network_errors_js_1 = require("./network-errors.js");
(0, vitest_1.describe)("isRecoverableTelegramNetworkError", function () {
    (0, vitest_1.it)("detects recoverable error codes", function () {
        var err = Object.assign(new Error("timeout"), { code: "ETIMEDOUT" });
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(err)).toBe(true);
    });
    (0, vitest_1.it)("detects additional recoverable error codes", function () {
        var aborted = Object.assign(new Error("aborted"), { code: "ECONNABORTED" });
        var network = Object.assign(new Error("network"), { code: "ERR_NETWORK" });
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(aborted)).toBe(true);
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(network)).toBe(true);
    });
    (0, vitest_1.it)("detects AbortError names", function () {
        var err = Object.assign(new Error("The operation was aborted"), { name: "AbortError" });
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(err)).toBe(true);
    });
    (0, vitest_1.it)("detects nested causes", function () {
        var cause = Object.assign(new Error("socket hang up"), { code: "ECONNRESET" });
        var err = Object.assign(new TypeError("fetch failed"), { cause: cause });
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(err)).toBe(true);
    });
    (0, vitest_1.it)("detects expanded message patterns", function () {
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(new Error("TypeError: fetch failed"))).toBe(true);
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(new Error("Undici: socket failure"))).toBe(true);
    });
    (0, vitest_1.it)("skips message matches for send context", function () {
        var err = new TypeError("fetch failed");
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(err, { context: "send" })).toBe(false);
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(err, { context: "polling" })).toBe(true);
    });
    (0, vitest_1.it)("returns false for unrelated errors", function () {
        (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(new Error("invalid token"))).toBe(false);
    });
    // Grammy HttpError tests (issue #3815)
    // Grammy wraps fetch errors in .error property, not .cause
    (0, vitest_1.describe)("Grammy HttpError", function () {
        var MockHttpError = /** @class */ (function (_super) {
            __extends(MockHttpError, _super);
            function MockHttpError(message, error) {
                var _this = _super.call(this, message) || this;
                _this.error = error;
                _this.name = "HttpError";
                return _this;
            }
            return MockHttpError;
        }(Error));
        (0, vitest_1.it)("detects network error wrapped in HttpError", function () {
            var fetchError = new TypeError("fetch failed");
            var httpError = new MockHttpError("Network request for 'setMyCommands' failed!", fetchError);
            (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(httpError)).toBe(true);
        });
        (0, vitest_1.it)("detects network error with cause wrapped in HttpError", function () {
            var cause = Object.assign(new Error("socket hang up"), { code: "ECONNRESET" });
            var fetchError = Object.assign(new TypeError("fetch failed"), { cause: cause });
            var httpError = new MockHttpError("Network request for 'getUpdates' failed!", fetchError);
            (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(httpError)).toBe(true);
        });
        (0, vitest_1.it)("returns false for non-network errors wrapped in HttpError", function () {
            var authError = new Error("Unauthorized: bot token is invalid");
            var httpError = new MockHttpError("Bad Request: invalid token", authError);
            (0, vitest_1.expect)((0, network_errors_js_1.isRecoverableTelegramNetworkError)(httpError)).toBe(false);
        });
    });
});
