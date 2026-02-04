"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var event_mapper_js_1 = require("./event-mapper.js");
(0, vitest_1.describe)("acp event mapper", function () {
    (0, vitest_1.it)("extracts text and resource blocks into prompt text", function () {
        var text = (0, event_mapper_js_1.extractTextFromPrompt)([
            { type: "text", text: "Hello" },
            { type: "resource", resource: { text: "File contents" } },
            { type: "resource_link", uri: "https://example.com", title: "Spec" },
            { type: "image", data: "abc", mimeType: "image/png" },
        ]);
        (0, vitest_1.expect)(text).toBe("Hello\nFile contents\n[Resource link (Spec)] https://example.com");
    });
    (0, vitest_1.it)("extracts image blocks into gateway attachments", function () {
        var attachments = (0, event_mapper_js_1.extractAttachmentsFromPrompt)([
            { type: "image", data: "abc", mimeType: "image/png" },
            { type: "image", data: "", mimeType: "image/png" },
            { type: "text", text: "ignored" },
        ]);
        (0, vitest_1.expect)(attachments).toEqual([
            {
                type: "image",
                mimeType: "image/png",
                content: "abc",
            },
        ]);
    });
});
