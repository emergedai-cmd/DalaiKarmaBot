"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var stream_writer_js_1 = require("./stream-writer.js");
(0, vitest_1.describe)("createSafeStreamWriter", function () {
    (0, vitest_1.it)("signals broken pipes and closes the writer", function () {
        var onBrokenPipe = vitest_1.vi.fn();
        var writer = (0, stream_writer_js_1.createSafeStreamWriter)({ onBrokenPipe: onBrokenPipe });
        var stream = {
            write: vitest_1.vi.fn(function () {
                var err = new Error("EPIPE");
                err.code = "EPIPE";
                throw err;
            }),
        };
        (0, vitest_1.expect)(writer.writeLine(stream, "hello")).toBe(false);
        (0, vitest_1.expect)(writer.isClosed()).toBe(true);
        (0, vitest_1.expect)(onBrokenPipe).toHaveBeenCalledTimes(1);
        onBrokenPipe.mockClear();
        (0, vitest_1.expect)(writer.writeLine(stream, "again")).toBe(false);
        (0, vitest_1.expect)(onBrokenPipe).toHaveBeenCalledTimes(0);
    });
    (0, vitest_1.it)("treats broken pipes from beforeWrite as closed", function () {
        var onBrokenPipe = vitest_1.vi.fn();
        var writer = (0, stream_writer_js_1.createSafeStreamWriter)({
            onBrokenPipe: onBrokenPipe,
            beforeWrite: function () {
                var err = new Error("EIO");
                err.code = "EIO";
                throw err;
            },
        });
        var stream = { write: vitest_1.vi.fn(function () { return true; }) };
        (0, vitest_1.expect)(writer.write(stream, "hi")).toBe(false);
        (0, vitest_1.expect)(writer.isClosed()).toBe(true);
        (0, vitest_1.expect)(onBrokenPipe).toHaveBeenCalledTimes(1);
    });
});
