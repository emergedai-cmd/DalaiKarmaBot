"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var gmail_watcher_js_1 = require("./gmail-watcher.js");
(0, vitest_1.describe)("gmail watcher", function () {
    (0, vitest_1.it)("detects address already in use errors", function () {
        (0, vitest_1.expect)((0, gmail_watcher_js_1.isAddressInUseError)("listen tcp 127.0.0.1:8788: bind: address already in use")).toBe(true);
        (0, vitest_1.expect)((0, gmail_watcher_js_1.isAddressInUseError)("EADDRINUSE: address already in use")).toBe(true);
        (0, vitest_1.expect)((0, gmail_watcher_js_1.isAddressInUseError)("some other error")).toBe(false);
    });
});
