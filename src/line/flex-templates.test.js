"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var flex_templates_js_1 = require("./flex-templates.js");
(0, vitest_1.describe)("createInfoCard", function () {
    (0, vitest_1.it)("creates a bubble with title and body", function () {
        var _a;
        var card = (0, flex_templates_js_1.createInfoCard)("Test Title", "Test body content");
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.size).toBe("mega");
        (0, vitest_1.expect)(card.body).toBeDefined();
        (0, vitest_1.expect)((_a = card.body) === null || _a === void 0 ? void 0 : _a.type).toBe("box");
    });
    (0, vitest_1.it)("includes footer when provided", function () {
        var card = (0, flex_templates_js_1.createInfoCard)("Title", "Body", "Footer text");
        (0, vitest_1.expect)(card.footer).toBeDefined();
        var footer = card.footer;
        (0, vitest_1.expect)(footer.contents[0].text).toBe("Footer text");
    });
    (0, vitest_1.it)("omits footer when not provided", function () {
        var card = (0, flex_templates_js_1.createInfoCard)("Title", "Body");
        (0, vitest_1.expect)(card.footer).toBeUndefined();
    });
});
(0, vitest_1.describe)("createListCard", function () {
    (0, vitest_1.it)("creates a list with title and items", function () {
        var items = [{ title: "Item 1", subtitle: "Description 1" }, { title: "Item 2" }];
        var card = (0, flex_templates_js_1.createListCard)("My List", items);
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("limits items to 8", function () {
        var items = Array.from({ length: 15 }, function (_, i) { return ({ title: "Item ".concat(i) }); });
        var card = (0, flex_templates_js_1.createListCard)("List", items);
        var body = card.body;
        // The list items are in the third content (after title and separator)
        var listBox = body.contents[2];
        (0, vitest_1.expect)(listBox.contents.length).toBe(8);
    });
    (0, vitest_1.it)("includes actions on items when provided", function () {
        var items = [
            {
                title: "Clickable",
                action: { type: "message", label: "Click", text: "clicked" },
            },
        ];
        var card = (0, flex_templates_js_1.createListCard)("List", items);
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
});
(0, vitest_1.describe)("createImageCard", function () {
    (0, vitest_1.it)("creates a card with hero image", function () {
        var card = (0, flex_templates_js_1.createImageCard)("https://example.com/image.jpg", "Image Title");
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.hero).toBeDefined();
        (0, vitest_1.expect)(card.hero.url).toBe("https://example.com/image.jpg");
    });
    (0, vitest_1.it)("includes body text when provided", function () {
        var card = (0, flex_templates_js_1.createImageCard)("https://example.com/img.jpg", "Title", "Body text");
        var body = card.body;
        (0, vitest_1.expect)(body.contents.length).toBe(2);
        (0, vitest_1.expect)(body.contents[1].text).toBe("Body text");
    });
    (0, vitest_1.it)("applies custom aspect ratio", function () {
        var card = (0, flex_templates_js_1.createImageCard)("https://example.com/img.jpg", "Title", undefined, {
            aspectRatio: "16:9",
        });
        (0, vitest_1.expect)(card.hero.aspectRatio).toBe("16:9");
    });
});
(0, vitest_1.describe)("createActionCard", function () {
    (0, vitest_1.it)("creates a card with action buttons", function () {
        var actions = [
            { label: "Action 1", action: { type: "message", label: "Act1", text: "action1" } },
            {
                label: "Action 2",
                action: { type: "uri", label: "Act2", uri: "https://example.com" },
            },
        ];
        var card = (0, flex_templates_js_1.createActionCard)("Title", "Description", actions);
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.footer).toBeDefined();
        var footer = card.footer;
        (0, vitest_1.expect)(footer.contents.length).toBe(2);
    });
    (0, vitest_1.it)("limits actions to 4", function () {
        var actions = Array.from({ length: 6 }, function (_, i) { return ({
            label: "Action ".concat(i),
            action: { type: "message", label: "A".concat(i), text: "action".concat(i) },
        }); });
        var card = (0, flex_templates_js_1.createActionCard)("Title", "Body", actions);
        var footer = card.footer;
        (0, vitest_1.expect)(footer.contents.length).toBe(4);
    });
    (0, vitest_1.it)("includes hero image when provided", function () {
        var card = (0, flex_templates_js_1.createActionCard)("Title", "Body", [], {
            imageUrl: "https://example.com/hero.jpg",
        });
        (0, vitest_1.expect)(card.hero).toBeDefined();
        (0, vitest_1.expect)(card.hero.url).toBe("https://example.com/hero.jpg");
    });
});
(0, vitest_1.describe)("createCarousel", function () {
    (0, vitest_1.it)("creates a carousel from bubbles", function () {
        var bubbles = [(0, flex_templates_js_1.createInfoCard)("Card 1", "Body 1"), (0, flex_templates_js_1.createInfoCard)("Card 2", "Body 2")];
        var carousel = (0, flex_templates_js_1.createCarousel)(bubbles);
        (0, vitest_1.expect)(carousel.type).toBe("carousel");
        (0, vitest_1.expect)(carousel.contents.length).toBe(2);
    });
    (0, vitest_1.it)("limits to 12 bubbles", function () {
        var bubbles = Array.from({ length: 15 }, function (_, i) { return (0, flex_templates_js_1.createInfoCard)("Card ".concat(i), "Body ".concat(i)); });
        var carousel = (0, flex_templates_js_1.createCarousel)(bubbles);
        (0, vitest_1.expect)(carousel.contents.length).toBe(12);
    });
});
(0, vitest_1.describe)("createNotificationBubble", function () {
    (0, vitest_1.it)("creates a simple notification", function () {
        var bubble = (0, flex_templates_js_1.createNotificationBubble)("Hello world");
        (0, vitest_1.expect)(bubble.type).toBe("bubble");
        (0, vitest_1.expect)(bubble.body).toBeDefined();
    });
    (0, vitest_1.it)("applies notification type styling", function () {
        var successBubble = (0, flex_templates_js_1.createNotificationBubble)("Success!", { type: "success" });
        var errorBubble = (0, flex_templates_js_1.createNotificationBubble)("Error!", { type: "error" });
        (0, vitest_1.expect)(successBubble.body).toBeDefined();
        (0, vitest_1.expect)(errorBubble.body).toBeDefined();
    });
    (0, vitest_1.it)("includes title when provided", function () {
        var bubble = (0, flex_templates_js_1.createNotificationBubble)("Details here", {
            title: "Alert Title",
        });
        (0, vitest_1.expect)(bubble.body).toBeDefined();
    });
});
(0, vitest_1.describe)("createReceiptCard", function () {
    (0, vitest_1.it)("creates a receipt with items", function () {
        var card = (0, flex_templates_js_1.createReceiptCard)({
            title: "Order Receipt",
            items: [
                { name: "Item A", value: "$10" },
                { name: "Item B", value: "$20" },
            ],
        });
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes total when provided", function () {
        var card = (0, flex_templates_js_1.createReceiptCard)({
            title: "Receipt",
            items: [{ name: "Item", value: "$10" }],
            total: { label: "Total", value: "$10" },
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes footer when provided", function () {
        var card = (0, flex_templates_js_1.createReceiptCard)({
            title: "Receipt",
            items: [{ name: "Item", value: "$10" }],
            footer: "Thank you!",
        });
        (0, vitest_1.expect)(card.footer).toBeDefined();
    });
});
(0, vitest_1.describe)("createMediaPlayerCard", function () {
    (0, vitest_1.it)("creates a basic player card", function () {
        var card = (0, flex_templates_js_1.createMediaPlayerCard)({
            title: "Bohemian Rhapsody",
            subtitle: "Queen",
        });
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes album art when provided", function () {
        var card = (0, flex_templates_js_1.createMediaPlayerCard)({
            title: "Track Name",
            imageUrl: "https://example.com/album.jpg",
        });
        (0, vitest_1.expect)(card.hero).toBeDefined();
        (0, vitest_1.expect)(card.hero.url).toBe("https://example.com/album.jpg");
    });
    (0, vitest_1.it)("shows playing status", function () {
        var card = (0, flex_templates_js_1.createMediaPlayerCard)({
            title: "Track",
            isPlaying: true,
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes playback controls", function () {
        var card = (0, flex_templates_js_1.createMediaPlayerCard)({
            title: "Track",
            controls: {
                previous: { data: "action=prev" },
                play: { data: "action=play" },
                pause: { data: "action=pause" },
                next: { data: "action=next" },
            },
        });
        (0, vitest_1.expect)(card.footer).toBeDefined();
    });
    (0, vitest_1.it)("includes extra actions", function () {
        var card = (0, flex_templates_js_1.createMediaPlayerCard)({
            title: "Track",
            extraActions: [
                { label: "Add to Playlist", data: "action=add_playlist" },
                { label: "Share", data: "action=share" },
            ],
        });
        (0, vitest_1.expect)(card.footer).toBeDefined();
    });
});
(0, vitest_1.describe)("createDeviceControlCard", function () {
    (0, vitest_1.it)("creates a device card with controls", function () {
        var card = (0, flex_templates_js_1.createDeviceControlCard)({
            deviceName: "Apple TV",
            deviceType: "Streaming Box",
            controls: [
                { label: "Play/Pause", data: "action=playpause" },
                { label: "Menu", data: "action=menu" },
            ],
        });
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.body).toBeDefined();
        (0, vitest_1.expect)(card.footer).toBeDefined();
    });
    (0, vitest_1.it)("shows device status", function () {
        var card = (0, flex_templates_js_1.createDeviceControlCard)({
            deviceName: "Apple TV",
            status: "Playing",
            controls: [{ label: "Pause", data: "action=pause" }],
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes device image", function () {
        var card = (0, flex_templates_js_1.createDeviceControlCard)({
            deviceName: "Device",
            imageUrl: "https://example.com/device.jpg",
            controls: [],
        });
        (0, vitest_1.expect)(card.hero).toBeDefined();
    });
    (0, vitest_1.it)("limits controls to 6", function () {
        var card = (0, flex_templates_js_1.createDeviceControlCard)({
            deviceName: "Device",
            controls: Array.from({ length: 10 }, function (_, i) { return ({
                label: "Control ".concat(i),
                data: "action=".concat(i),
            }); }),
        });
        (0, vitest_1.expect)(card.footer).toBeDefined();
        // Should have max 3 rows of 2 buttons
        var footer = card.footer;
        (0, vitest_1.expect)(footer.contents.length).toBeLessThanOrEqual(3);
    });
});
(0, vitest_1.describe)("createAppleTvRemoteCard", function () {
    (0, vitest_1.it)("creates an Apple TV remote card with controls", function () {
        var card = (0, flex_templates_js_1.createAppleTvRemoteCard)({
            deviceName: "Apple TV",
            status: "Playing",
            actionData: {
                up: "action=up",
                down: "action=down",
                left: "action=left",
                right: "action=right",
                select: "action=select",
                menu: "action=menu",
                home: "action=home",
                play: "action=play",
                pause: "action=pause",
                volumeUp: "action=volume_up",
                volumeDown: "action=volume_down",
                mute: "action=mute",
            },
        });
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
});
(0, vitest_1.describe)("createEventCard", function () {
    (0, vitest_1.it)("creates an event card with required fields", function () {
        var card = (0, flex_templates_js_1.createEventCard)({
            title: "Team Meeting",
            date: "January 24, 2026",
        });
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes time when provided", function () {
        var card = (0, flex_templates_js_1.createEventCard)({
            title: "Meeting",
            date: "Jan 24",
            time: "2:00 PM - 3:00 PM",
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes location when provided", function () {
        var card = (0, flex_templates_js_1.createEventCard)({
            title: "Meeting",
            date: "Jan 24",
            location: "Conference Room A",
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes description when provided", function () {
        var card = (0, flex_templates_js_1.createEventCard)({
            title: "Meeting",
            date: "Jan 24",
            description: "Discuss Q1 roadmap",
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes all optional fields together", function () {
        var card = (0, flex_templates_js_1.createEventCard)({
            title: "Team Offsite",
            date: "February 15, 2026",
            time: "9:00 AM - 5:00 PM",
            location: "Mountain View Office",
            description: "Annual team building event",
        });
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes action when provided", function () {
        var card = (0, flex_templates_js_1.createEventCard)({
            title: "Meeting",
            date: "Jan 24",
            action: { type: "uri", label: "Join", uri: "https://meet.google.com/abc" },
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
        (0, vitest_1.expect)(card.body.action).toBeDefined();
    });
    (0, vitest_1.it)("includes calendar name when provided", function () {
        var card = (0, flex_templates_js_1.createEventCard)({
            title: "Meeting",
            date: "Jan 24",
            calendar: "Work Calendar",
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("uses mega size for better readability", function () {
        var card = (0, flex_templates_js_1.createEventCard)({
            title: "Meeting",
            date: "Jan 24",
        });
        (0, vitest_1.expect)(card.size).toBe("mega");
    });
});
(0, vitest_1.describe)("createAgendaCard", function () {
    (0, vitest_1.it)("creates an agenda card with title and events", function () {
        var card = (0, flex_templates_js_1.createAgendaCard)({
            title: "Today's Schedule",
            events: [
                { title: "Team Meeting", time: "9:00 AM" },
                { title: "Lunch", time: "12:00 PM" },
            ],
        });
        (0, vitest_1.expect)(card.type).toBe("bubble");
        (0, vitest_1.expect)(card.size).toBe("mega");
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("limits events to 8", function () {
        var manyEvents = Array.from({ length: 15 }, function (_, i) { return ({
            title: "Event ".concat(i + 1),
        }); });
        var card = (0, flex_templates_js_1.createAgendaCard)({
            title: "Many Events",
            events: manyEvents,
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
    (0, vitest_1.it)("includes footer when provided", function () {
        var card = (0, flex_templates_js_1.createAgendaCard)({
            title: "Today",
            events: [{ title: "Event" }],
            footer: "Synced from Google Calendar",
        });
        (0, vitest_1.expect)(card.footer).toBeDefined();
    });
    (0, vitest_1.it)("shows event metadata (time, location, calendar)", function () {
        var card = (0, flex_templates_js_1.createAgendaCard)({
            title: "Schedule",
            events: [
                {
                    title: "Meeting",
                    time: "10:00 AM",
                    location: "Room A",
                    calendar: "Work",
                },
            ],
        });
        (0, vitest_1.expect)(card.body).toBeDefined();
    });
});
(0, vitest_1.describe)("toFlexMessage", function () {
    (0, vitest_1.it)("wraps a container in a FlexMessage", function () {
        var bubble = (0, flex_templates_js_1.createInfoCard)("Title", "Body");
        var message = (0, flex_templates_js_1.toFlexMessage)("Alt text", bubble);
        (0, vitest_1.expect)(message.type).toBe("flex");
        (0, vitest_1.expect)(message.altText).toBe("Alt text");
        (0, vitest_1.expect)(message.contents).toBe(bubble);
    });
});
