"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var cdp_helpers_js_1 = require("./cdp.helpers.js");
(0, vitest_1.describe)("cdp.helpers", function () {
    (0, vitest_1.it)("preserves query params when appending CDP paths", function () {
        var url = (0, cdp_helpers_js_1.appendCdpPath)("https://example.com?token=abc", "/json/version");
        (0, vitest_1.expect)(url).toBe("https://example.com/json/version?token=abc");
    });
    (0, vitest_1.it)("appends paths under a base prefix", function () {
        var url = (0, cdp_helpers_js_1.appendCdpPath)("https://example.com/chrome/?token=abc", "json/list");
        (0, vitest_1.expect)(url).toBe("https://example.com/chrome/json/list?token=abc");
    });
    (0, vitest_1.it)("adds basic auth headers when credentials are present", function () {
        var headers = (0, cdp_helpers_js_1.getHeadersWithAuth)("https://user:pass@example.com");
        (0, vitest_1.expect)(headers.Authorization).toBe("Basic ".concat(Buffer.from("user:pass").toString("base64")));
    });
    (0, vitest_1.it)("keeps preexisting authorization headers", function () {
        var headers = (0, cdp_helpers_js_1.getHeadersWithAuth)("https://user:pass@example.com", {
            Authorization: "Bearer token",
        });
        (0, vitest_1.expect)(headers.Authorization).toBe("Bearer token");
    });
});
