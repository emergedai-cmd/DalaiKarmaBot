"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var line_directives_js_1 = require("./line-directives.js");
var getLineData = function (result) { var _a, _b; return (_b = (_a = result.channelData) === null || _a === void 0 ? void 0 : _a.line) !== null && _b !== void 0 ? _b : {}; };
(0, vitest_1.describe)("hasLineDirectives", function () {
    (0, vitest_1.it)("detects quick_replies directive", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("Here are options [[quick_replies: A, B, C]]")).toBe(true);
    });
    (0, vitest_1.it)("detects location directive", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("[[location: Place | Address | 35.6 | 139.7]]")).toBe(true);
    });
    (0, vitest_1.it)("detects confirm directive", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("[[confirm: Continue? | Yes | No]]")).toBe(true);
    });
    (0, vitest_1.it)("detects buttons directive", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("[[buttons: Menu | Choose | Opt1:data1, Opt2:data2]]")).toBe(true);
    });
    (0, vitest_1.it)("returns false for regular text", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("Just regular text")).toBe(false);
    });
    (0, vitest_1.it)("returns false for similar but invalid patterns", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("[[not_a_directive: something]]")).toBe(false);
    });
    (0, vitest_1.it)("detects media_player directive", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("[[media_player: Song | Artist | Speaker]]")).toBe(true);
    });
    (0, vitest_1.it)("detects event directive", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("[[event: Meeting | Jan 24 | 2pm]]")).toBe(true);
    });
    (0, vitest_1.it)("detects agenda directive", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("[[agenda: Today | Meeting:9am, Lunch:12pm]]")).toBe(true);
    });
    (0, vitest_1.it)("detects device directive", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("[[device: TV | Room]]")).toBe(true);
    });
    (0, vitest_1.it)("detects appletv_remote directive", function () {
        (0, vitest_1.expect)((0, line_directives_js_1.hasLineDirectives)("[[appletv_remote: Apple TV | Playing]]")).toBe(true);
    });
});
(0, vitest_1.describe)("parseLineDirectives", function () {
    (0, vitest_1.describe)("quick_replies", function () {
        (0, vitest_1.it)("parses quick_replies and removes from text", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "Choose one:\n[[quick_replies: Option A, Option B, Option C]]",
            });
            (0, vitest_1.expect)(getLineData(result).quickReplies).toEqual(["Option A", "Option B", "Option C"]);
            (0, vitest_1.expect)(result.text).toBe("Choose one:");
        });
        (0, vitest_1.it)("handles quick_replies in middle of text", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "Before [[quick_replies: A, B]] After",
            });
            (0, vitest_1.expect)(getLineData(result).quickReplies).toEqual(["A", "B"]);
            (0, vitest_1.expect)(result.text).toBe("Before  After");
        });
        (0, vitest_1.it)("merges with existing quickReplies", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "Text [[quick_replies: C, D]]",
                channelData: { line: { quickReplies: ["A", "B"] } },
            });
            (0, vitest_1.expect)(getLineData(result).quickReplies).toEqual(["A", "B", "C", "D"]);
        });
    });
    (0, vitest_1.describe)("location", function () {
        (0, vitest_1.it)("parses location with all fields", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "Here's the location:\n[[location: Tokyo Station | Tokyo, Japan | 35.6812 | 139.7671]]",
            });
            (0, vitest_1.expect)(getLineData(result).location).toEqual({
                title: "Tokyo Station",
                address: "Tokyo, Japan",
                latitude: 35.6812,
                longitude: 139.7671,
            });
            (0, vitest_1.expect)(result.text).toBe("Here's the location:");
        });
        (0, vitest_1.it)("ignores invalid coordinates", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[location: Place | Address | invalid | 139.7]]",
            });
            (0, vitest_1.expect)(getLineData(result).location).toBeUndefined();
        });
        (0, vitest_1.it)("does not override existing location", function () {
            var existing = { title: "Existing", address: "Addr", latitude: 1, longitude: 2 };
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[location: New | New Addr | 35.6 | 139.7]]",
                channelData: { line: { location: existing } },
            });
            (0, vitest_1.expect)(getLineData(result).location).toEqual(existing);
        });
    });
    (0, vitest_1.describe)("confirm", function () {
        (0, vitest_1.it)("parses simple confirm", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[confirm: Delete this item? | Yes | No]]",
            });
            (0, vitest_1.expect)(getLineData(result).templateMessage).toEqual({
                type: "confirm",
                text: "Delete this item?",
                confirmLabel: "Yes",
                confirmData: "yes",
                cancelLabel: "No",
                cancelData: "no",
                altText: "Delete this item?",
            });
            // Text is undefined when directive consumes entire text
            (0, vitest_1.expect)(result.text).toBeUndefined();
        });
        (0, vitest_1.it)("parses confirm with custom data", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[confirm: Proceed? | OK:action=confirm | Cancel:action=cancel]]",
            });
            (0, vitest_1.expect)(getLineData(result).templateMessage).toEqual({
                type: "confirm",
                text: "Proceed?",
                confirmLabel: "OK",
                confirmData: "action=confirm",
                cancelLabel: "Cancel",
                cancelData: "action=cancel",
                altText: "Proceed?",
            });
        });
    });
    (0, vitest_1.describe)("buttons", function () {
        (0, vitest_1.it)("parses buttons with message actions", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[buttons: Menu | Select an option | Help:/help, Status:/status]]",
            });
            (0, vitest_1.expect)(getLineData(result).templateMessage).toEqual({
                type: "buttons",
                title: "Menu",
                text: "Select an option",
                actions: [
                    { type: "message", label: "Help", data: "/help" },
                    { type: "message", label: "Status", data: "/status" },
                ],
                altText: "Menu: Select an option",
            });
        });
        (0, vitest_1.it)("parses buttons with uri actions", function () {
            var _a;
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[buttons: Links | Visit us | Site:https://example.com]]",
            });
            var templateMessage = getLineData(result).templateMessage;
            (0, vitest_1.expect)(templateMessage === null || templateMessage === void 0 ? void 0 : templateMessage.type).toBe("buttons");
            if ((templateMessage === null || templateMessage === void 0 ? void 0 : templateMessage.type) === "buttons") {
                (0, vitest_1.expect)((_a = templateMessage.actions) === null || _a === void 0 ? void 0 : _a[0]).toEqual({
                    type: "uri",
                    label: "Site",
                    uri: "https://example.com",
                });
            }
        });
        (0, vitest_1.it)("parses buttons with postback actions", function () {
            var _a;
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[buttons: Actions | Choose | Select:action=select&id=1]]",
            });
            var templateMessage = getLineData(result).templateMessage;
            (0, vitest_1.expect)(templateMessage === null || templateMessage === void 0 ? void 0 : templateMessage.type).toBe("buttons");
            if ((templateMessage === null || templateMessage === void 0 ? void 0 : templateMessage.type) === "buttons") {
                (0, vitest_1.expect)((_a = templateMessage.actions) === null || _a === void 0 ? void 0 : _a[0]).toEqual({
                    type: "postback",
                    label: "Select",
                    data: "action=select&id=1",
                });
            }
        });
        (0, vitest_1.it)("limits to 4 actions", function () {
            var _a;
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[buttons: Menu | Text | A:a, B:b, C:c, D:d, E:e, F:f]]",
            });
            var templateMessage = getLineData(result).templateMessage;
            (0, vitest_1.expect)(templateMessage === null || templateMessage === void 0 ? void 0 : templateMessage.type).toBe("buttons");
            if ((templateMessage === null || templateMessage === void 0 ? void 0 : templateMessage.type) === "buttons") {
                (0, vitest_1.expect)((_a = templateMessage.actions) === null || _a === void 0 ? void 0 : _a.length).toBe(4);
            }
        });
    });
    (0, vitest_1.describe)("media_player", function () {
        (0, vitest_1.it)("parses media_player with all fields", function () {
            var _a, _b;
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "Now playing:\n[[media_player: Bohemian Rhapsody | Queen | Speaker | https://example.com/album.jpg | playing]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            (0, vitest_1.expect)(flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.altText).toBe("🎵 Bohemian Rhapsody - Queen");
            var contents = flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.contents;
            (0, vitest_1.expect)((_b = (_a = contents.footer) === null || _a === void 0 ? void 0 : _a.contents) === null || _b === void 0 ? void 0 : _b.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(result.text).toBe("Now playing:");
        });
        (0, vitest_1.it)("parses media_player with minimal fields", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[media_player: Unknown Track]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            (0, vitest_1.expect)(flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.altText).toBe("🎵 Unknown Track");
        });
        (0, vitest_1.it)("handles paused status", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[media_player: Song | Artist | Player | | paused]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            var contents = flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.contents;
            (0, vitest_1.expect)(contents).toBeDefined();
        });
    });
    (0, vitest_1.describe)("event", function () {
        (0, vitest_1.it)("parses event with all fields", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[event: Team Meeting | January 24, 2026 | 2:00 PM - 3:00 PM | Conference Room A | Discuss Q1 roadmap]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            (0, vitest_1.expect)(flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.altText).toBe("📅 Team Meeting - January 24, 2026 2:00 PM - 3:00 PM");
        });
        (0, vitest_1.it)("parses event with minimal fields", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[event: Birthday Party | March 15]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            (0, vitest_1.expect)(flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.altText).toBe("📅 Birthday Party - March 15");
        });
    });
    (0, vitest_1.describe)("agenda", function () {
        (0, vitest_1.it)("parses agenda with multiple events", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[agenda: Today's Schedule | Team Meeting:9:00 AM, Lunch:12:00 PM, Review:3:00 PM]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            (0, vitest_1.expect)(flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.altText).toBe("📋 Today's Schedule (3 events)");
        });
        (0, vitest_1.it)("parses agenda with events without times", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[agenda: Tasks | Buy groceries, Call mom, Workout]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            (0, vitest_1.expect)(flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.altText).toBe("📋 Tasks (3 events)");
        });
    });
    (0, vitest_1.describe)("device", function () {
        (0, vitest_1.it)("parses device with controls", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[device: TV | Streaming Box | Playing | Play/Pause:toggle, Menu:menu]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            (0, vitest_1.expect)(flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.altText).toBe("📱 TV: Playing");
        });
        (0, vitest_1.it)("parses device with minimal fields", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[device: Speaker]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            (0, vitest_1.expect)(flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.altText).toBe("📱 Speaker");
        });
    });
    (0, vitest_1.describe)("appletv_remote", function () {
        (0, vitest_1.it)("parses appletv_remote with status", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[appletv_remote: Apple TV | Playing]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
            (0, vitest_1.expect)(flexMessage === null || flexMessage === void 0 ? void 0 : flexMessage.altText).toContain("Apple TV");
        });
        (0, vitest_1.it)("parses appletv_remote with minimal fields", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "[[appletv_remote: Apple TV]]",
            });
            var flexMessage = getLineData(result).flexMessage;
            (0, vitest_1.expect)(flexMessage).toBeDefined();
        });
    });
    (0, vitest_1.describe)("combined directives", function () {
        (0, vitest_1.it)("handles text with no directives", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "Just plain text here",
            });
            (0, vitest_1.expect)(result.text).toBe("Just plain text here");
            (0, vitest_1.expect)(getLineData(result).quickReplies).toBeUndefined();
            (0, vitest_1.expect)(getLineData(result).location).toBeUndefined();
            (0, vitest_1.expect)(getLineData(result).templateMessage).toBeUndefined();
        });
        (0, vitest_1.it)("preserves other payload fields", function () {
            var result = (0, line_directives_js_1.parseLineDirectives)({
                text: "Hello [[quick_replies: A, B]]",
                mediaUrl: "https://example.com/image.jpg",
                replyToId: "msg123",
            });
            (0, vitest_1.expect)(result.mediaUrl).toBe("https://example.com/image.jpg");
            (0, vitest_1.expect)(result.replyToId).toBe("msg123");
            (0, vitest_1.expect)(getLineData(result).quickReplies).toEqual(["A", "B"]);
        });
    });
});
