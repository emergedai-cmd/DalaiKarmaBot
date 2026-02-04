"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var template_messages_js_1 = require("./template-messages.js");
(0, vitest_1.describe)("messageAction", function () {
    (0, vitest_1.it)("creates a message action", function () {
        var action = (0, template_messages_js_1.messageAction)("Click me", "clicked");
        (0, vitest_1.expect)(action.type).toBe("message");
        (0, vitest_1.expect)(action.label).toBe("Click me");
        (0, vitest_1.expect)(action.text).toBe("clicked");
    });
    (0, vitest_1.it)("uses label as text when text not provided", function () {
        var action = (0, template_messages_js_1.messageAction)("Click");
        (0, vitest_1.expect)(action.text).toBe("Click");
    });
    (0, vitest_1.it)("truncates label to 20 characters", function () {
        var action = (0, template_messages_js_1.messageAction)("This is a very long label that exceeds the limit");
        (0, vitest_1.expect)(action.label).toBe("This is a very long ");
    });
});
(0, vitest_1.describe)("uriAction", function () {
    (0, vitest_1.it)("creates a URI action", function () {
        var action = (0, template_messages_js_1.uriAction)("Visit", "https://example.com");
        (0, vitest_1.expect)(action.type).toBe("uri");
        (0, vitest_1.expect)(action.label).toBe("Visit");
        (0, vitest_1.expect)(action.uri).toBe("https://example.com");
    });
});
(0, vitest_1.describe)("postbackAction", function () {
    (0, vitest_1.it)("creates a postback action", function () {
        var action = (0, template_messages_js_1.postbackAction)("Select", "action=select&id=1");
        (0, vitest_1.expect)(action.type).toBe("postback");
        (0, vitest_1.expect)(action.label).toBe("Select");
        (0, vitest_1.expect)(action.data).toBe("action=select&id=1");
    });
    (0, vitest_1.it)("includes displayText when provided", function () {
        var action = (0, template_messages_js_1.postbackAction)("Select", "data", "Selected!");
        (0, vitest_1.expect)(action.displayText).toBe("Selected!");
    });
    (0, vitest_1.it)("truncates data to 300 characters", function () {
        var longData = "x".repeat(400);
        var action = (0, template_messages_js_1.postbackAction)("Test", longData);
        (0, vitest_1.expect)(action.data.length).toBe(300);
    });
});
(0, vitest_1.describe)("datetimePickerAction", function () {
    (0, vitest_1.it)("creates a datetime picker action", function () {
        var action = (0, template_messages_js_1.datetimePickerAction)("Pick date", "date_selected", "date");
        (0, vitest_1.expect)(action.type).toBe("datetimepicker");
        (0, vitest_1.expect)(action.label).toBe("Pick date");
        (0, vitest_1.expect)(action.mode).toBe("date");
    });
    (0, vitest_1.it)("includes min/max/initial when provided", function () {
        var action = (0, template_messages_js_1.datetimePickerAction)("Pick", "data", "datetime", {
            initial: "2024-01-01T12:00",
            min: "2024-01-01T00:00",
            max: "2024-12-31T23:59",
        });
        (0, vitest_1.expect)(action.initial).toBe("2024-01-01T12:00");
        (0, vitest_1.expect)(action.min).toBe("2024-01-01T00:00");
        (0, vitest_1.expect)(action.max).toBe("2024-12-31T23:59");
    });
});
(0, vitest_1.describe)("createConfirmTemplate", function () {
    (0, vitest_1.it)("creates a confirm template", function () {
        var confirm = (0, template_messages_js_1.messageAction)("Yes");
        var cancel = (0, template_messages_js_1.messageAction)("No");
        var template = (0, template_messages_js_1.createConfirmTemplate)("Are you sure?", confirm, cancel);
        (0, vitest_1.expect)(template.type).toBe("template");
        (0, vitest_1.expect)(template.template.type).toBe("confirm");
        (0, vitest_1.expect)(template.template.text).toBe("Are you sure?");
    });
    (0, vitest_1.it)("truncates text to 240 characters", function () {
        var longText = "x".repeat(300);
        var template = (0, template_messages_js_1.createConfirmTemplate)(longText, (0, template_messages_js_1.messageAction)("Yes"), (0, template_messages_js_1.messageAction)("No"));
        (0, vitest_1.expect)(template.template.text.length).toBe(240);
    });
    (0, vitest_1.it)("uses custom altText when provided", function () {
        var template = (0, template_messages_js_1.createConfirmTemplate)("Question?", (0, template_messages_js_1.messageAction)("Yes"), (0, template_messages_js_1.messageAction)("No"), "Custom alt");
        (0, vitest_1.expect)(template.altText).toBe("Custom alt");
    });
});
(0, vitest_1.describe)("createButtonTemplate", function () {
    (0, vitest_1.it)("creates a button template", function () {
        var actions = [(0, template_messages_js_1.messageAction)("Button 1"), (0, template_messages_js_1.messageAction)("Button 2")];
        var template = (0, template_messages_js_1.createButtonTemplate)("Title", "Description", actions);
        (0, vitest_1.expect)(template.type).toBe("template");
        (0, vitest_1.expect)(template.template.type).toBe("buttons");
        (0, vitest_1.expect)(template.template.title).toBe("Title");
        (0, vitest_1.expect)(template.template.text).toBe("Description");
    });
    (0, vitest_1.it)("limits actions to 4", function () {
        var actions = Array.from({ length: 6 }, function (_, i) { return (0, template_messages_js_1.messageAction)("Button ".concat(i)); });
        var template = (0, template_messages_js_1.createButtonTemplate)("Title", "Text", actions);
        (0, vitest_1.expect)(template.template.actions.length).toBe(4);
    });
    (0, vitest_1.it)("truncates title to 40 characters", function () {
        var longTitle = "x".repeat(50);
        var template = (0, template_messages_js_1.createButtonTemplate)(longTitle, "Text", [(0, template_messages_js_1.messageAction)("OK")]);
        (0, vitest_1.expect)(template.template.title.length).toBe(40);
    });
    (0, vitest_1.it)("includes thumbnail when provided", function () {
        var template = (0, template_messages_js_1.createButtonTemplate)("Title", "Text", [(0, template_messages_js_1.messageAction)("OK")], {
            thumbnailImageUrl: "https://example.com/thumb.jpg",
        });
        (0, vitest_1.expect)(template.template.thumbnailImageUrl).toBe("https://example.com/thumb.jpg");
    });
    (0, vitest_1.it)("truncates text to 60 chars when no thumbnail is provided", function () {
        var longText = "x".repeat(100);
        var template = (0, template_messages_js_1.createButtonTemplate)("Title", longText, [(0, template_messages_js_1.messageAction)("OK")]);
        (0, vitest_1.expect)(template.template.text.length).toBe(60);
    });
    (0, vitest_1.it)("keeps longer text when thumbnail is provided", function () {
        var longText = "x".repeat(100);
        var template = (0, template_messages_js_1.createButtonTemplate)("Title", longText, [(0, template_messages_js_1.messageAction)("OK")], {
            thumbnailImageUrl: "https://example.com/thumb.jpg",
        });
        (0, vitest_1.expect)(template.template.text.length).toBe(100);
    });
});
(0, vitest_1.describe)("createTemplateCarousel", function () {
    (0, vitest_1.it)("creates a carousel template", function () {
        var columns = [
            (0, template_messages_js_1.createCarouselColumn)({ text: "Column 1", actions: [(0, template_messages_js_1.messageAction)("Select")] }),
            (0, template_messages_js_1.createCarouselColumn)({ text: "Column 2", actions: [(0, template_messages_js_1.messageAction)("Select")] }),
        ];
        var template = (0, template_messages_js_1.createTemplateCarousel)(columns);
        (0, vitest_1.expect)(template.type).toBe("template");
        (0, vitest_1.expect)(template.template.type).toBe("carousel");
        (0, vitest_1.expect)(template.template.columns.length).toBe(2);
    });
    (0, vitest_1.it)("limits columns to 10", function () {
        var columns = Array.from({ length: 15 }, function () {
            return (0, template_messages_js_1.createCarouselColumn)({ text: "Text", actions: [(0, template_messages_js_1.messageAction)("OK")] });
        });
        var template = (0, template_messages_js_1.createTemplateCarousel)(columns);
        (0, vitest_1.expect)(template.template.columns.length).toBe(10);
    });
});
(0, vitest_1.describe)("createCarouselColumn", function () {
    (0, vitest_1.it)("creates a carousel column", function () {
        var column = (0, template_messages_js_1.createCarouselColumn)({
            title: "Item",
            text: "Description",
            actions: [(0, template_messages_js_1.messageAction)("View")],
            thumbnailImageUrl: "https://example.com/img.jpg",
        });
        (0, vitest_1.expect)(column.title).toBe("Item");
        (0, vitest_1.expect)(column.text).toBe("Description");
        (0, vitest_1.expect)(column.thumbnailImageUrl).toBe("https://example.com/img.jpg");
        (0, vitest_1.expect)(column.actions.length).toBe(1);
    });
    (0, vitest_1.it)("limits actions to 3", function () {
        var column = (0, template_messages_js_1.createCarouselColumn)({
            text: "Text",
            actions: [
                (0, template_messages_js_1.messageAction)("A1"),
                (0, template_messages_js_1.messageAction)("A2"),
                (0, template_messages_js_1.messageAction)("A3"),
                (0, template_messages_js_1.messageAction)("A4"),
                (0, template_messages_js_1.messageAction)("A5"),
            ],
        });
        (0, vitest_1.expect)(column.actions.length).toBe(3);
    });
    (0, vitest_1.it)("truncates text to 120 characters", function () {
        var longText = "x".repeat(150);
        var column = (0, template_messages_js_1.createCarouselColumn)({ text: longText, actions: [(0, template_messages_js_1.messageAction)("OK")] });
        (0, vitest_1.expect)(column.text.length).toBe(120);
    });
});
(0, vitest_1.describe)("createImageCarousel", function () {
    (0, vitest_1.it)("creates an image carousel", function () {
        var columns = [
            (0, template_messages_js_1.createImageCarouselColumn)("https://example.com/1.jpg", (0, template_messages_js_1.messageAction)("View 1")),
            (0, template_messages_js_1.createImageCarouselColumn)("https://example.com/2.jpg", (0, template_messages_js_1.messageAction)("View 2")),
        ];
        var template = (0, template_messages_js_1.createImageCarousel)(columns);
        (0, vitest_1.expect)(template.type).toBe("template");
        (0, vitest_1.expect)(template.template.type).toBe("image_carousel");
    });
    (0, vitest_1.it)("limits columns to 10", function () {
        var columns = Array.from({ length: 15 }, function (_, i) {
            return (0, template_messages_js_1.createImageCarouselColumn)("https://example.com/".concat(i, ".jpg"), (0, template_messages_js_1.messageAction)("View"));
        });
        var template = (0, template_messages_js_1.createImageCarousel)(columns);
        (0, vitest_1.expect)(template.template.columns.length).toBe(10);
    });
});
(0, vitest_1.describe)("createImageCarouselColumn", function () {
    (0, vitest_1.it)("creates an image carousel column", function () {
        var action = (0, template_messages_js_1.uriAction)("Visit", "https://example.com");
        var column = (0, template_messages_js_1.createImageCarouselColumn)("https://example.com/img.jpg", action);
        (0, vitest_1.expect)(column.imageUrl).toBe("https://example.com/img.jpg");
        (0, vitest_1.expect)(column.action).toBe(action);
    });
});
(0, vitest_1.describe)("createYesNoConfirm", function () {
    (0, vitest_1.it)("creates a yes/no confirmation with defaults", function () {
        var template = (0, template_messages_js_1.createYesNoConfirm)("Continue?");
        (0, vitest_1.expect)(template.type).toBe("template");
        (0, vitest_1.expect)(template.template.type).toBe("confirm");
        var actions = template.template.actions;
        (0, vitest_1.expect)(actions[0].label).toBe("Yes");
        (0, vitest_1.expect)(actions[1].label).toBe("No");
    });
    (0, vitest_1.it)("allows custom button text", function () {
        var template = (0, template_messages_js_1.createYesNoConfirm)("Delete?", {
            yesText: "Delete",
            noText: "Cancel",
        });
        var actions = template.template.actions;
        (0, vitest_1.expect)(actions[0].label).toBe("Delete");
        (0, vitest_1.expect)(actions[1].label).toBe("Cancel");
    });
    (0, vitest_1.it)("uses postback actions when data provided", function () {
        var template = (0, template_messages_js_1.createYesNoConfirm)("Confirm?", {
            yesData: "action=confirm",
            noData: "action=cancel",
        });
        var actions = template.template.actions;
        (0, vitest_1.expect)(actions[0].type).toBe("postback");
        (0, vitest_1.expect)(actions[1].type).toBe("postback");
    });
});
(0, vitest_1.describe)("createButtonMenu", function () {
    (0, vitest_1.it)("creates a button menu with text buttons", function () {
        var template = (0, template_messages_js_1.createButtonMenu)("Menu", "Choose an option", [
            { label: "Option 1" },
            { label: "Option 2", text: "selected option 2" },
        ]);
        (0, vitest_1.expect)(template.type).toBe("template");
        (0, vitest_1.expect)(template.template.type).toBe("buttons");
        var actions = template.template.actions;
        (0, vitest_1.expect)(actions.length).toBe(2);
        (0, vitest_1.expect)(actions[0].type).toBe("message");
    });
});
(0, vitest_1.describe)("createLinkMenu", function () {
    (0, vitest_1.it)("creates a button menu with URL links", function () {
        var template = (0, template_messages_js_1.createLinkMenu)("Links", "Visit our sites", [
            { label: "Site 1", url: "https://site1.com" },
            { label: "Site 2", url: "https://site2.com" },
        ]);
        (0, vitest_1.expect)(template.type).toBe("template");
        var actions = template.template.actions;
        (0, vitest_1.expect)(actions[0].type).toBe("uri");
        (0, vitest_1.expect)(actions[1].type).toBe("uri");
    });
});
(0, vitest_1.describe)("createProductCarousel", function () {
    (0, vitest_1.it)("creates a product carousel", function () {
        var template = (0, template_messages_js_1.createProductCarousel)([
            { title: "Product 1", description: "Desc 1", price: "$10" },
            { title: "Product 2", description: "Desc 2", imageUrl: "https://example.com/p2.jpg" },
        ]);
        (0, vitest_1.expect)(template.type).toBe("template");
        (0, vitest_1.expect)(template.template.type).toBe("carousel");
        var columns = template.template.columns;
        (0, vitest_1.expect)(columns.length).toBe(2);
    });
    (0, vitest_1.it)("uses URI action when actionUrl provided", function () {
        var template = (0, template_messages_js_1.createProductCarousel)([
            {
                title: "Product",
                description: "Desc",
                actionLabel: "Buy",
                actionUrl: "https://shop.com/buy",
            },
        ]);
        var columns = template.template
            .columns;
        (0, vitest_1.expect)(columns[0].actions[0].type).toBe("uri");
    });
    (0, vitest_1.it)("uses postback action when actionData provided", function () {
        var template = (0, template_messages_js_1.createProductCarousel)([
            {
                title: "Product",
                description: "Desc",
                actionLabel: "Select",
                actionData: "product_id=123",
            },
        ]);
        var columns = template.template
            .columns;
        (0, vitest_1.expect)(columns[0].actions[0].type).toBe("postback");
    });
    (0, vitest_1.it)("limits to 10 products", function () {
        var products = Array.from({ length: 15 }, function (_, i) { return ({
            title: "Product ".concat(i),
            description: "Desc ".concat(i),
        }); });
        var template = (0, template_messages_js_1.createProductCarousel)(products);
        var columns = template.template.columns;
        (0, vitest_1.expect)(columns.length).toBe(10);
    });
});
