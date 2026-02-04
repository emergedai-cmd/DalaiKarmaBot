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
exports.resolveMatrixRoomConfig = resolveMatrixRoomConfig;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
function resolveMatrixRoomConfig(params) {
    var _a, _b;
    var rooms = (_a = params.rooms) !== null && _a !== void 0 ? _a : {};
    var keys = Object.keys(rooms);
    var allowlistConfigured = keys.length > 0;
    var candidates = plugin_sdk_1.buildChannelKeyCandidates.apply(void 0, __spreadArray(__spreadArray([params.roomId, "room:".concat(params.roomId)], params.aliases, false), [(_b = params.name) !== null && _b !== void 0 ? _b : ""], false));
    var _c = (0, plugin_sdk_1.resolveChannelEntryMatch)({
        entries: rooms,
        keys: candidates,
        wildcardKey: "*",
    }), matched = _c.entry, matchedKey = _c.key, wildcardEntry = _c.wildcardEntry, wildcardKey = _c.wildcardKey;
    var resolved = matched !== null && matched !== void 0 ? matched : wildcardEntry;
    var allowed = resolved ? resolved.enabled !== false && resolved.allow !== false : false;
    var matchKey = matchedKey !== null && matchedKey !== void 0 ? matchedKey : wildcardKey;
    var matchSource = matched ? "direct" : wildcardEntry ? "wildcard" : undefined;
    return {
        allowed: allowed,
        allowlistConfigured: allowlistConfigured,
        config: resolved,
        matchKey: matchKey,
        matchSource: matchSource,
    };
}
