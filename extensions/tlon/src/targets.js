"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeShip = normalizeShip;
exports.parseChannelNest = parseChannelNest;
exports.parseTlonTarget = parseTlonTarget;
exports.formatTargetHint = formatTargetHint;
var SHIP_RE = /^~?[a-z-]+$/i;
var NEST_RE = /^chat\/([^/]+)\/([^/]+)$/i;
function normalizeShip(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return trimmed;
    }
    return trimmed.startsWith("~") ? trimmed : "~".concat(trimmed);
}
function parseChannelNest(raw) {
    var match = NEST_RE.exec(raw.trim());
    if (!match) {
        return null;
    }
    var hostShip = normalizeShip(match[1]);
    var channelName = match[2];
    return { hostShip: hostShip, channelName: channelName };
}
function parseTlonTarget(raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
    if (!trimmed) {
        return null;
    }
    var withoutPrefix = trimmed.replace(/^tlon:/i, "");
    var dmPrefix = withoutPrefix.match(/^dm[/:](.+)$/i);
    if (dmPrefix) {
        return { kind: "dm", ship: normalizeShip(dmPrefix[1]) };
    }
    var groupPrefix = withoutPrefix.match(/^(group|room)[/:](.+)$/i);
    if (groupPrefix) {
        var groupTarget = groupPrefix[2].trim();
        if (groupTarget.startsWith("chat/")) {
            var parsed = parseChannelNest(groupTarget);
            if (!parsed) {
                return null;
            }
            return {
                kind: "group",
                nest: "chat/".concat(parsed.hostShip, "/").concat(parsed.channelName),
                hostShip: parsed.hostShip,
                channelName: parsed.channelName,
            };
        }
        var parts = groupTarget.split("/");
        if (parts.length === 2) {
            var hostShip = normalizeShip(parts[0]);
            var channelName = parts[1];
            return {
                kind: "group",
                nest: "chat/".concat(hostShip, "/").concat(channelName),
                hostShip: hostShip,
                channelName: channelName,
            };
        }
        return null;
    }
    if (withoutPrefix.startsWith("chat/")) {
        var parsed = parseChannelNest(withoutPrefix);
        if (!parsed) {
            return null;
        }
        return {
            kind: "group",
            nest: "chat/".concat(parsed.hostShip, "/").concat(parsed.channelName),
            hostShip: parsed.hostShip,
            channelName: parsed.channelName,
        };
    }
    if (SHIP_RE.test(withoutPrefix)) {
        return { kind: "dm", ship: normalizeShip(withoutPrefix) };
    }
    return null;
}
function formatTargetHint() {
    return "dm/~sampel-palnet | ~sampel-palnet | chat/~host-ship/channel | group:~host-ship/channel";
}
