"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var location_js_1 = require("./location.js");
(0, vitest_1.describe)("provider location helpers", function () {
    (0, vitest_1.it)("formats pin locations with accuracy", function () {
        var text = (0, location_js_1.formatLocationText)({
            latitude: 48.858844,
            longitude: 2.294351,
            accuracy: 12,
        });
        (0, vitest_1.expect)(text).toBe("📍 48.858844, 2.294351 ±12m");
    });
    (0, vitest_1.it)("formats named places with address and caption", function () {
        var text = (0, location_js_1.formatLocationText)({
            latitude: 40.689247,
            longitude: -74.044502,
            name: "Statue of Liberty",
            address: "Liberty Island, NY",
            accuracy: 8,
            caption: "Bring snacks",
        });
        (0, vitest_1.expect)(text).toBe("📍 Statue of Liberty — Liberty Island, NY (40.689247, -74.044502 ±8m)\nBring snacks");
    });
    (0, vitest_1.it)("formats live locations with live label", function () {
        var text = (0, location_js_1.formatLocationText)({
            latitude: 37.819929,
            longitude: -122.478255,
            accuracy: 20,
            caption: "On the move",
            isLive: true,
            source: "live",
        });
        (0, vitest_1.expect)(text).toBe("🛰 Live location: 37.819929, -122.478255 ±20m\nOn the move");
    });
    (0, vitest_1.it)("builds ctx fields with normalized source", function () {
        var ctx = (0, location_js_1.toLocationContext)({
            latitude: 1,
            longitude: 2,
            name: "Cafe",
            address: "Main St",
        });
        (0, vitest_1.expect)(ctx).toEqual({
            LocationLat: 1,
            LocationLon: 2,
            LocationAccuracy: undefined,
            LocationName: "Cafe",
            LocationAddress: "Main St",
            LocationSource: "place",
            LocationIsLive: false,
        });
    });
});
