"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMatrixLocation = resolveMatrixLocation;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var types_js_1 = require("./types.js");
function parseGeoUri(value) {
    var _a, _b;
    var trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    if (!trimmed.toLowerCase().startsWith("geo:")) {
        return null;
    }
    var payload = trimmed.slice(4);
    var _c = payload.split(";"), coordsPart = _c[0], paramParts = _c.slice(1);
    var coords = coordsPart.split(",");
    if (coords.length < 2) {
        return null;
    }
    var latitude = Number.parseFloat((_a = coords[0]) !== null && _a !== void 0 ? _a : "");
    var longitude = Number.parseFloat((_b = coords[1]) !== null && _b !== void 0 ? _b : "");
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
    }
    var params = new Map();
    for (var _i = 0, paramParts_1 = paramParts; _i < paramParts_1.length; _i++) {
        var part = paramParts_1[_i];
        var segment = part.trim();
        if (!segment) {
            continue;
        }
        var eqIndex = segment.indexOf("=");
        var rawKey = eqIndex === -1 ? segment : segment.slice(0, eqIndex);
        var rawValue = eqIndex === -1 ? "" : segment.slice(eqIndex + 1);
        var key = rawKey.trim().toLowerCase();
        if (!key) {
            continue;
        }
        var valuePart = rawValue.trim();
        params.set(key, valuePart ? decodeURIComponent(valuePart) : "");
    }
    var accuracyRaw = params.get("u");
    var accuracy = accuracyRaw ? Number.parseFloat(accuracyRaw) : undefined;
    return {
        latitude: latitude,
        longitude: longitude,
        accuracy: Number.isFinite(accuracy) ? accuracy : undefined,
    };
}
function resolveMatrixLocation(params) {
    var eventType = params.eventType, content = params.content;
    var isLocation = eventType === types_js_1.EventType.Location ||
        (eventType === types_js_1.EventType.RoomMessage && content.msgtype === types_js_1.EventType.Location);
    if (!isLocation) {
        return null;
    }
    var geoUri = typeof content.geo_uri === "string" ? content.geo_uri.trim() : "";
    if (!geoUri) {
        return null;
    }
    var parsed = parseGeoUri(geoUri);
    if (!parsed) {
        return null;
    }
    var caption = typeof content.body === "string" ? content.body.trim() : "";
    var location = {
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        accuracy: parsed.accuracy,
        caption: caption || undefined,
        source: "pin",
        isLive: false,
    };
    return {
        text: (0, plugin_sdk_1.formatLocationText)(location),
        context: (0, plugin_sdk_1.toLocationContext)(location),
    };
}
