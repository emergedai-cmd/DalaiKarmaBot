"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var detect_js_1 = require("./detect.js");
(0, vitest_1.describe)("extractLinksFromMessage", function () {
    (0, vitest_1.it)("extracts bare http/https URLs in order", function () {
        var links = (0, detect_js_1.extractLinksFromMessage)("see https://a.example and http://b.test");
        (0, vitest_1.expect)(links).toEqual(["https://a.example", "http://b.test"]);
    });
    (0, vitest_1.it)("dedupes links and enforces maxLinks", function () {
        var links = (0, detect_js_1.extractLinksFromMessage)("https://a.example https://a.example https://b.test", {
            maxLinks: 1,
        });
        (0, vitest_1.expect)(links).toEqual(["https://a.example"]);
    });
    (0, vitest_1.it)("ignores markdown links", function () {
        var links = (0, detect_js_1.extractLinksFromMessage)("[doc](https://docs.example) https://bare.example");
        (0, vitest_1.expect)(links).toEqual(["https://bare.example"]);
    });
    (0, vitest_1.it)("blocks 127.0.0.1", function () {
        var links = (0, detect_js_1.extractLinksFromMessage)("http://127.0.0.1/test https://ok.test");
        (0, vitest_1.expect)(links).toEqual(["https://ok.test"]);
    });
});
