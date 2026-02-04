"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var failover_error_js_1 = require("./failover-error.js");
(0, vitest_1.describe)("failover-error", function () {
    (0, vitest_1.it)("infers failover reason from HTTP status", function () {
        (0, vitest_1.expect)((0, failover_error_js_1.resolveFailoverReasonFromError)({ status: 402 })).toBe("billing");
        (0, vitest_1.expect)((0, failover_error_js_1.resolveFailoverReasonFromError)({ statusCode: "429" })).toBe("rate_limit");
        (0, vitest_1.expect)((0, failover_error_js_1.resolveFailoverReasonFromError)({ status: 403 })).toBe("auth");
        (0, vitest_1.expect)((0, failover_error_js_1.resolveFailoverReasonFromError)({ status: 408 })).toBe("timeout");
    });
    (0, vitest_1.it)("infers format errors from error messages", function () {
        (0, vitest_1.expect)((0, failover_error_js_1.resolveFailoverReasonFromError)({
            message: "invalid request format: messages.1.content.1.tool_use.id",
        })).toBe("format");
    });
    (0, vitest_1.it)("infers timeout from common node error codes", function () {
        (0, vitest_1.expect)((0, failover_error_js_1.resolveFailoverReasonFromError)({ code: "ETIMEDOUT" })).toBe("timeout");
        (0, vitest_1.expect)((0, failover_error_js_1.resolveFailoverReasonFromError)({ code: "ECONNRESET" })).toBe("timeout");
    });
    (0, vitest_1.it)("coerces failover-worthy errors into FailoverError with metadata", function () {
        var err = (0, failover_error_js_1.coerceToFailoverError)("credit balance too low", {
            provider: "anthropic",
            model: "claude-opus-4-5",
        });
        (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.name).toBe("FailoverError");
        (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.reason).toBe("billing");
        (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.status).toBe(402);
        (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.provider).toBe("anthropic");
        (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.model).toBe("claude-opus-4-5");
    });
    (0, vitest_1.it)("coerces format errors with a 400 status", function () {
        var err = (0, failover_error_js_1.coerceToFailoverError)("invalid request format", {
            provider: "google",
            model: "cloud-code-assist",
        });
        (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.reason).toBe("format");
        (0, vitest_1.expect)(err === null || err === void 0 ? void 0 : err.status).toBe(400);
    });
    (0, vitest_1.it)("describes non-Error values consistently", function () {
        var described = (0, failover_error_js_1.describeFailoverError)(123);
        (0, vitest_1.expect)(described.message).toBe("123");
        (0, vitest_1.expect)(described.reason).toBeUndefined();
    });
});
