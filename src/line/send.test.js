"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var send_js_1 = require("./send.js");
(0, vitest_1.describe)("createFlexMessage", function () {
    (0, vitest_1.it)("creates a flex message with alt text and contents", function () {
        var contents = {
            type: "bubble",
            body: {
                type: "box",
                layout: "vertical",
                contents: [],
            },
        };
        var message = (0, send_js_1.createFlexMessage)("Alt text for flex", contents);
        (0, vitest_1.expect)(message.type).toBe("flex");
        (0, vitest_1.expect)(message.altText).toBe("Alt text for flex");
        (0, vitest_1.expect)(message.contents).toBe(contents);
    });
});
(0, vitest_1.describe)("createQuickReplyItems", function () {
    (0, vitest_1.it)("creates quick reply items from labels", function () {
        var quickReply = (0, send_js_1.createQuickReplyItems)(["Option 1", "Option 2", "Option 3"]);
        (0, vitest_1.expect)(quickReply.items).toHaveLength(3);
        (0, vitest_1.expect)(quickReply.items[0].type).toBe("action");
        (0, vitest_1.expect)(quickReply.items[0].action.label).toBe("Option 1");
        (0, vitest_1.expect)(quickReply.items[0].action.text).toBe("Option 1");
    });
    (0, vitest_1.it)("limits items to 13 (LINE maximum)", function () {
        var labels = Array.from({ length: 20 }, function (_, i) { return "Option ".concat(i + 1); });
        var quickReply = (0, send_js_1.createQuickReplyItems)(labels);
        (0, vitest_1.expect)(quickReply.items).toHaveLength(13);
    });
    (0, vitest_1.it)("truncates labels to 20 characters", function () {
        var quickReply = (0, send_js_1.createQuickReplyItems)([
            "This is a very long option label that exceeds the limit",
        ]);
        (0, vitest_1.expect)(quickReply.items[0].action.label).toBe("This is a very long ");
        // Text is not truncated
        (0, vitest_1.expect)(quickReply.items[0].action.text).toBe("This is a very long option label that exceeds the limit");
    });
    (0, vitest_1.it)("creates message actions for each item", function () {
        var quickReply = (0, send_js_1.createQuickReplyItems)(["A", "B"]);
        (0, vitest_1.expect)(quickReply.items[0].action.type).toBe("message");
        (0, vitest_1.expect)(quickReply.items[1].action.type).toBe("message");
    });
});
(0, vitest_1.describe)("createTextMessageWithQuickReplies", function () {
    (0, vitest_1.it)("creates a text message with quick replies attached", function () {
        var message = (0, send_js_1.createTextMessageWithQuickReplies)("Choose an option:", ["Yes", "No"]);
        (0, vitest_1.expect)(message.type).toBe("text");
        (0, vitest_1.expect)(message.text).toBe("Choose an option:");
        (0, vitest_1.expect)(message.quickReply).toBeDefined();
        (0, vitest_1.expect)(message.quickReply.items).toHaveLength(2);
    });
    (0, vitest_1.it)("preserves text content", function () {
        var longText = "This is a longer message that asks the user to select from multiple options below.";
        var message = (0, send_js_1.createTextMessageWithQuickReplies)(longText, ["A", "B", "C"]);
        (0, vitest_1.expect)(message.text).toBe(longText);
    });
    (0, vitest_1.it)("handles empty quick replies array", function () {
        var message = (0, send_js_1.createTextMessageWithQuickReplies)("No options", []);
        (0, vitest_1.expect)(message.quickReply.items).toHaveLength(0);
    });
    (0, vitest_1.it)("quick replies use label as both label and text", function () {
        var message = (0, send_js_1.createTextMessageWithQuickReplies)("Pick one:", ["Apple", "Banana"]);
        var firstAction = message.quickReply.items[0].action;
        (0, vitest_1.expect)(firstAction.label).toBe("Apple");
        (0, vitest_1.expect)(firstAction.text).toBe("Apple");
    });
});
