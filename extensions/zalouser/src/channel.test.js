"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var channel_js_1 = require("./channel.js");
(0, vitest_1.describe)("zalouser outbound chunker", function () {
    (0, vitest_1.it)("chunks without empty strings and respects limit", function () {
        var _a;
        var chunker = (_a = channel_js_1.zalouserPlugin.outbound) === null || _a === void 0 ? void 0 : _a.chunker;
        (0, vitest_1.expect)(chunker).toBeTypeOf("function");
        if (!chunker) {
            return;
        }
        var limit = 10;
        var chunks = chunker("hello world\nthis is a test", limit);
        (0, vitest_1.expect)(chunks.length).toBeGreaterThan(1);
        (0, vitest_1.expect)(chunks.every(function (c) { return c.length > 0; })).toBe(true);
        (0, vitest_1.expect)(chunks.every(function (c) { return c.length <= limit; })).toBe(true);
    });
});
