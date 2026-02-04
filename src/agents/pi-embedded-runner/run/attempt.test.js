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
var attempt_js_1 = require("./attempt.js");
(0, vitest_1.describe)("injectHistoryImagesIntoMessages", function () {
    var image = { type: "image", data: "abc", mimeType: "image/png" };
    (0, vitest_1.it)("injects history images and converts string content", function () {
        var _a, _b, _c;
        var messages = [
            {
                role: "user",
                content: "See /tmp/photo.png",
            },
        ];
        var didMutate = (0, attempt_js_1.injectHistoryImagesIntoMessages)(messages, new Map([[0, [image]]]));
        (0, vitest_1.expect)(didMutate).toBe(true);
        (0, vitest_1.expect)(Array.isArray((_a = messages[0]) === null || _a === void 0 ? void 0 : _a.content)).toBe(true);
        var content = (_b = messages[0]) === null || _b === void 0 ? void 0 : _b.content;
        (0, vitest_1.expect)(content).toHaveLength(2);
        (0, vitest_1.expect)((_c = content[0]) === null || _c === void 0 ? void 0 : _c.type).toBe("text");
        (0, vitest_1.expect)(content[1]).toMatchObject({ type: "image", data: "abc" });
    });
    (0, vitest_1.it)("avoids duplicating existing image content", function () {
        var messages = [
            {
                role: "user",
                content: [{ type: "text", text: "See /tmp/photo.png" }, __assign({}, image)],
            },
        ];
        var didMutate = (0, attempt_js_1.injectHistoryImagesIntoMessages)(messages, new Map([[0, [image]]]));
        (0, vitest_1.expect)(didMutate).toBe(false);
        var first = messages[0];
        if (!first || !Array.isArray(first.content)) {
            throw new Error("expected array content");
        }
        (0, vitest_1.expect)(first.content).toHaveLength(2);
    });
    (0, vitest_1.it)("ignores non-user messages and out-of-range indices", function () {
        var _a;
        var messages = [
            {
                role: "assistant",
                content: "noop",
            },
        ];
        var didMutate = (0, attempt_js_1.injectHistoryImagesIntoMessages)(messages, new Map([[1, [image]]]));
        (0, vitest_1.expect)(didMutate).toBe(false);
        (0, vitest_1.expect)((_a = messages[0]) === null || _a === void 0 ? void 0 : _a.content).toBe("noop");
    });
});
