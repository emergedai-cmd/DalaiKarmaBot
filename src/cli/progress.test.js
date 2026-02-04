"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var progress_js_1 = require("./progress.js");
(0, vitest_1.describe)("cli progress", function () {
    (0, vitest_1.it)("logs progress when non-tty and fallback=log", function () {
        var writes = [];
        var stream = {
            isTTY: false,
            write: vitest_1.vi.fn(function (chunk) {
                writes.push(chunk);
            }),
        };
        var progress = (0, progress_js_1.createCliProgress)({
            label: "Indexing memory...",
            total: 10,
            stream: stream,
            fallback: "log",
        });
        progress.setPercent(50);
        progress.done();
        var output = writes.join("");
        (0, vitest_1.expect)(output).toContain("Indexing memory... 0%");
        (0, vitest_1.expect)(output).toContain("Indexing memory... 50%");
    });
    (0, vitest_1.it)("does not log without a tty when fallback is none", function () {
        var write = vitest_1.vi.fn();
        var stream = {
            isTTY: false,
            write: write,
        };
        var progress = (0, progress_js_1.createCliProgress)({
            label: "Nope",
            total: 2,
            stream: stream,
            fallback: "none",
        });
        progress.setPercent(50);
        progress.done();
        (0, vitest_1.expect)(write).not.toHaveBeenCalled();
    });
});
