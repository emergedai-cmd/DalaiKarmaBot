"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var rich_menu_js_1 = require("./rich-menu.js");
(0, vitest_1.describe)("messageAction", function () {
    (0, vitest_1.it)("creates a message action", function () {
        var action = (0, rich_menu_js_1.messageAction)("Help", "/help");
        (0, vitest_1.expect)(action.type).toBe("message");
        (0, vitest_1.expect)(action.label).toBe("Help");
        (0, vitest_1.expect)(action.text).toBe("/help");
    });
    (0, vitest_1.it)("uses label as text when text not provided", function () {
        var action = (0, rich_menu_js_1.messageAction)("Click");
        (0, vitest_1.expect)(action.text).toBe("Click");
    });
    (0, vitest_1.it)("truncates label to 20 characters", function () {
        var action = (0, rich_menu_js_1.messageAction)("This is a very long label text");
        (0, vitest_1.expect)(action.label.length).toBe(20);
        (0, vitest_1.expect)(action.label).toBe("This is a very long ");
    });
});
(0, vitest_1.describe)("uriAction", function () {
    (0, vitest_1.it)("creates a URI action", function () {
        var action = (0, rich_menu_js_1.uriAction)("Open", "https://example.com");
        (0, vitest_1.expect)(action.type).toBe("uri");
        (0, vitest_1.expect)(action.label).toBe("Open");
        (0, vitest_1.expect)(action.uri).toBe("https://example.com");
    });
    (0, vitest_1.it)("truncates label to 20 characters", function () {
        var action = (0, rich_menu_js_1.uriAction)("Click here to visit our website", "https://example.com");
        (0, vitest_1.expect)(action.label.length).toBe(20);
    });
});
(0, vitest_1.describe)("postbackAction", function () {
    (0, vitest_1.it)("creates a postback action", function () {
        var action = (0, rich_menu_js_1.postbackAction)("Select", "action=select&item=1", "Selected item 1");
        (0, vitest_1.expect)(action.type).toBe("postback");
        (0, vitest_1.expect)(action.label).toBe("Select");
        (0, vitest_1.expect)(action.data).toBe("action=select&item=1");
        (0, vitest_1.expect)(action.displayText).toBe("Selected item 1");
    });
    (0, vitest_1.it)("truncates data to 300 characters", function () {
        var longData = "x".repeat(400);
        var action = (0, rich_menu_js_1.postbackAction)("Test", longData);
        (0, vitest_1.expect)(action.data.length).toBe(300);
    });
    (0, vitest_1.it)("truncates displayText to 300 characters", function () {
        var _a;
        var longText = "y".repeat(400);
        var action = (0, rich_menu_js_1.postbackAction)("Test", "data", longText);
        (0, vitest_1.expect)((_a = action.displayText) === null || _a === void 0 ? void 0 : _a.length).toBe(300);
    });
    (0, vitest_1.it)("omits displayText when not provided", function () {
        var action = (0, rich_menu_js_1.postbackAction)("Test", "data");
        (0, vitest_1.expect)(action.displayText).toBeUndefined();
    });
});
(0, vitest_1.describe)("datetimePickerAction", function () {
    (0, vitest_1.it)("creates a date picker action", function () {
        var action = (0, rich_menu_js_1.datetimePickerAction)("Pick date", "date_picked", "date");
        (0, vitest_1.expect)(action.type).toBe("datetimepicker");
        (0, vitest_1.expect)(action.label).toBe("Pick date");
        (0, vitest_1.expect)(action.mode).toBe("date");
        (0, vitest_1.expect)(action.data).toBe("date_picked");
    });
    (0, vitest_1.it)("creates a time picker action", function () {
        var action = (0, rich_menu_js_1.datetimePickerAction)("Pick time", "time_picked", "time");
        (0, vitest_1.expect)(action.mode).toBe("time");
    });
    (0, vitest_1.it)("creates a datetime picker action", function () {
        var action = (0, rich_menu_js_1.datetimePickerAction)("Pick datetime", "datetime_picked", "datetime");
        (0, vitest_1.expect)(action.mode).toBe("datetime");
    });
    (0, vitest_1.it)("includes initial/min/max when provided", function () {
        var action = (0, rich_menu_js_1.datetimePickerAction)("Pick", "data", "date", {
            initial: "2024-06-15",
            min: "2024-01-01",
            max: "2024-12-31",
        });
        (0, vitest_1.expect)(action.initial).toBe("2024-06-15");
        (0, vitest_1.expect)(action.min).toBe("2024-01-01");
        (0, vitest_1.expect)(action.max).toBe("2024-12-31");
    });
});
(0, vitest_1.describe)("createGridLayout", function () {
    (0, vitest_1.it)("creates a 2x3 grid layout for tall menu", function () {
        var actions = [
            (0, rich_menu_js_1.messageAction)("A1"),
            (0, rich_menu_js_1.messageAction)("A2"),
            (0, rich_menu_js_1.messageAction)("A3"),
            (0, rich_menu_js_1.messageAction)("A4"),
            (0, rich_menu_js_1.messageAction)("A5"),
            (0, rich_menu_js_1.messageAction)("A6"),
        ];
        var areas = (0, rich_menu_js_1.createGridLayout)(1686, actions);
        (0, vitest_1.expect)(areas.length).toBe(6);
        // Check first row positions
        (0, vitest_1.expect)(areas[0].bounds.x).toBe(0);
        (0, vitest_1.expect)(areas[0].bounds.y).toBe(0);
        (0, vitest_1.expect)(areas[1].bounds.x).toBe(833);
        (0, vitest_1.expect)(areas[1].bounds.y).toBe(0);
        (0, vitest_1.expect)(areas[2].bounds.x).toBe(1666);
        (0, vitest_1.expect)(areas[2].bounds.y).toBe(0);
        // Check second row positions
        (0, vitest_1.expect)(areas[3].bounds.y).toBe(843);
        (0, vitest_1.expect)(areas[4].bounds.y).toBe(843);
        (0, vitest_1.expect)(areas[5].bounds.y).toBe(843);
    });
    (0, vitest_1.it)("creates a 2x3 grid layout for short menu", function () {
        var actions = [
            (0, rich_menu_js_1.messageAction)("A1"),
            (0, rich_menu_js_1.messageAction)("A2"),
            (0, rich_menu_js_1.messageAction)("A3"),
            (0, rich_menu_js_1.messageAction)("A4"),
            (0, rich_menu_js_1.messageAction)("A5"),
            (0, rich_menu_js_1.messageAction)("A6"),
        ];
        var areas = (0, rich_menu_js_1.createGridLayout)(843, actions);
        (0, vitest_1.expect)(areas.length).toBe(6);
        // Row height should be half of 843
        (0, vitest_1.expect)(areas[0].bounds.height).toBe(421);
        (0, vitest_1.expect)(areas[3].bounds.y).toBe(421);
    });
    (0, vitest_1.it)("assigns correct actions to areas", function () {
        var actions = [
            (0, rich_menu_js_1.messageAction)("Help", "/help"),
            (0, rich_menu_js_1.messageAction)("Status", "/status"),
            (0, rich_menu_js_1.messageAction)("Settings", "/settings"),
            (0, rich_menu_js_1.messageAction)("About", "/about"),
            (0, rich_menu_js_1.messageAction)("Feedback", "/feedback"),
            (0, rich_menu_js_1.messageAction)("Contact", "/contact"),
        ];
        var areas = (0, rich_menu_js_1.createGridLayout)(843, actions);
        (0, vitest_1.expect)(areas[0].action.text).toBe("/help");
        (0, vitest_1.expect)(areas[1].action.text).toBe("/status");
        (0, vitest_1.expect)(areas[2].action.text).toBe("/settings");
        (0, vitest_1.expect)(areas[3].action.text).toBe("/about");
        (0, vitest_1.expect)(areas[4].action.text).toBe("/feedback");
        (0, vitest_1.expect)(areas[5].action.text).toBe("/contact");
    });
});
(0, vitest_1.describe)("createDefaultMenuConfig", function () {
    (0, vitest_1.it)("creates a valid default menu configuration", function () {
        var config = (0, rich_menu_js_1.createDefaultMenuConfig)();
        (0, vitest_1.expect)(config.size.width).toBe(2500);
        (0, vitest_1.expect)(config.size.height).toBe(843);
        (0, vitest_1.expect)(config.selected).toBe(false);
        (0, vitest_1.expect)(config.name).toBe("Default Menu");
        (0, vitest_1.expect)(config.chatBarText).toBe("Menu");
        (0, vitest_1.expect)(config.areas.length).toBe(6);
    });
    (0, vitest_1.it)("has valid area bounds", function () {
        var config = (0, rich_menu_js_1.createDefaultMenuConfig)();
        for (var _i = 0, _a = config.areas; _i < _a.length; _i++) {
            var area = _a[_i];
            (0, vitest_1.expect)(area.bounds.x).toBeGreaterThanOrEqual(0);
            (0, vitest_1.expect)(area.bounds.y).toBeGreaterThanOrEqual(0);
            (0, vitest_1.expect)(area.bounds.width).toBeGreaterThan(0);
            (0, vitest_1.expect)(area.bounds.height).toBeGreaterThan(0);
            (0, vitest_1.expect)(area.bounds.x + area.bounds.width).toBeLessThanOrEqual(2500);
            (0, vitest_1.expect)(area.bounds.y + area.bounds.height).toBeLessThanOrEqual(843);
        }
    });
    (0, vitest_1.it)("has message actions for all areas", function () {
        var config = (0, rich_menu_js_1.createDefaultMenuConfig)();
        for (var _i = 0, _a = config.areas; _i < _a.length; _i++) {
            var area = _a[_i];
            (0, vitest_1.expect)(area.action.type).toBe("message");
        }
    });
    (0, vitest_1.it)("has expected default commands", function () {
        var config = (0, rich_menu_js_1.createDefaultMenuConfig)();
        var commands = config.areas.map(function (a) { return a.action.text; });
        (0, vitest_1.expect)(commands).toContain("/help");
        (0, vitest_1.expect)(commands).toContain("/status");
        (0, vitest_1.expect)(commands).toContain("/settings");
    });
});
