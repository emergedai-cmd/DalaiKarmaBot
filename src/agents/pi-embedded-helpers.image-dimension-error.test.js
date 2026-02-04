"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
(0, vitest_1.describe)("image dimension errors", function () {
    (0, vitest_1.it)("parses anthropic image dimension errors", function () {
        var raw = '400 {"type":"error","error":{"type":"invalid_request_error","message":"messages.84.content.1.image.source.base64.data: At least one of the image dimensions exceed max allowed size for many-image requests: 2000 pixels"}}';
        var parsed = (0, pi_embedded_helpers_js_1.parseImageDimensionError)(raw);
        (0, vitest_1.expect)(parsed).not.toBeNull();
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.maxDimensionPx).toBe(2000);
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.messageIndex).toBe(84);
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.contentIndex).toBe(1);
        (0, vitest_1.expect)((0, pi_embedded_helpers_js_1.isImageDimensionErrorMessage)(raw)).toBe(true);
    });
});
