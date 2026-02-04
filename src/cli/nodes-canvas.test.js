"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var nodes_canvas_js_1 = require("./nodes-canvas.js");
(0, vitest_1.describe)("nodes canvas helpers", function () {
    (0, vitest_1.it)("parses canvas.snapshot payload", function () {
        (0, vitest_1.expect)((0, nodes_canvas_js_1.parseCanvasSnapshotPayload)({ format: "png", base64: "aGk=" })).toEqual({
            format: "png",
            base64: "aGk=",
        });
    });
    (0, vitest_1.it)("rejects invalid canvas.snapshot payload", function () {
        (0, vitest_1.expect)(function () { return (0, nodes_canvas_js_1.parseCanvasSnapshotPayload)({ format: "png" }); }).toThrow(/invalid canvas\.snapshot payload/i);
    });
});
