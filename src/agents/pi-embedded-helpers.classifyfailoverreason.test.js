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
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
var workspace_js_1 = require("./workspace.js");
var _makeFile = function (overrides) { return (__assign({ name: workspace_js_1.DEFAULT_AGENTS_FILENAME, path: "/tmp/AGENTS.md", content: "", missing: false }, overrides)); };
(0, vitest_1.describe)("classifyFailoverReason", function () {
    (0, vitest_1.it)("returns a stable reason", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("invalid api key")).toBe("auth");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("no credentials found")).toBe("auth");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("no api key found")).toBe("auth");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("429 too many requests")).toBe("rate_limit");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("resource has been exhausted")).toBe("rate_limit");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)('{"type":"error","error":{"type":"overloaded_error","message":"Overloaded"}}')).toBe("rate_limit");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("invalid request format")).toBe("format");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("credit balance too low")).toBe("billing");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("deadline exceeded")).toBe("timeout");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("string should match pattern")).toBe("format");
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("bad request")).toBeNull();
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("messages.84.content.1.image.source.base64.data: At least one of the image dimensions exceed max allowed size for many-image requests: 2000 pixels")).toBeNull();
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("image exceeds 5 MB maximum")).toBeNull();
    });
    (0, vitest_1.it)("classifies OpenAI usage limit errors as rate_limit", function () {
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.classifyFailoverReason)("You have hit your ChatGPT usage limit (plus plan)")).toBe("rate_limit");
    });
});
