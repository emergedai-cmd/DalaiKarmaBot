"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var nodes_screen_js_1 = require("./nodes-screen.js");
(0, vitest_1.describe)("nodes screen helpers", function () {
    (0, vitest_1.it)("parses screen.record payload", function () {
        var payload = (0, nodes_screen_js_1.parseScreenRecordPayload)({
            format: "mp4",
            base64: "Zm9v",
            durationMs: 1000,
            fps: 12,
            screenIndex: 0,
            hasAudio: true,
        });
        (0, vitest_1.expect)(payload.format).toBe("mp4");
        (0, vitest_1.expect)(payload.base64).toBe("Zm9v");
        (0, vitest_1.expect)(payload.durationMs).toBe(1000);
        (0, vitest_1.expect)(payload.fps).toBe(12);
        (0, vitest_1.expect)(payload.screenIndex).toBe(0);
        (0, vitest_1.expect)(payload.hasAudio).toBe(true);
    });
    (0, vitest_1.it)("rejects invalid screen.record payload", function () {
        (0, vitest_1.expect)(function () { return (0, nodes_screen_js_1.parseScreenRecordPayload)({ format: "mp4" }); }).toThrow(/invalid screen\.record payload/i);
    });
    (0, vitest_1.it)("builds screen record temp path", function () {
        var p = (0, nodes_screen_js_1.screenRecordTempPath)({
            ext: "mp4",
            tmpDir: "/tmp",
            id: "id1",
        });
        (0, vitest_1.expect)(p).toBe(node_path_1.default.join("/tmp", "openclaw-screen-record-id1.mp4"));
    });
});
