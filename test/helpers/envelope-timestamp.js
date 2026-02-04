"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEnvelopeTimestamp = formatEnvelopeTimestamp;
exports.formatLocalEnvelopeTimestamp = formatLocalEnvelopeTimestamp;
exports.escapeRegExp = escapeRegExp;
function formatUtcTimestamp(date) {
    var yyyy = String(date.getUTCFullYear()).padStart(4, "0");
    var mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    var dd = String(date.getUTCDate()).padStart(2, "0");
    var hh = String(date.getUTCHours()).padStart(2, "0");
    var min = String(date.getUTCMinutes()).padStart(2, "0");
    return "".concat(yyyy, "-").concat(mm, "-").concat(dd, "T").concat(hh, ":").concat(min, "Z");
}
function formatZonedTimestamp(date, timeZone) {
    var _a, _b;
    var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZoneName: "short",
    }).formatToParts(date);
    var pick = function (type) { var _a; return (_a = parts.find(function (part) { return part.type === type; })) === null || _a === void 0 ? void 0 : _a.value; };
    var yyyy = pick("year");
    var mm = pick("month");
    var dd = pick("day");
    var hh = pick("hour");
    var min = pick("minute");
    var tz = (_b = (_a = __spreadArray([], parts, true).toReversed()
        .find(function (part) { return part.type === "timeZoneName"; })) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.trim();
    if (!yyyy || !mm || !dd || !hh || !min) {
        throw new Error("Missing date parts for envelope timestamp formatting.");
    }
    return "".concat(yyyy, "-").concat(mm, "-").concat(dd, " ").concat(hh, ":").concat(min).concat(tz ? " ".concat(tz) : "");
}
function formatEnvelopeTimestamp(date, zone) {
    if (zone === void 0) { zone = "utc"; }
    var normalized = zone.trim().toLowerCase();
    if (normalized === "utc" || normalized === "gmt") {
        return formatUtcTimestamp(date);
    }
    if (normalized === "local" || normalized === "host") {
        return formatZonedTimestamp(date);
    }
    return formatZonedTimestamp(date, zone);
}
function formatLocalEnvelopeTimestamp(date) {
    return formatEnvelopeTimestamp(date, "local");
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
