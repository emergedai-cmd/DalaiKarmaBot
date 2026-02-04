"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMatrixGroupRequireMention = resolveMatrixGroupRequireMention;
exports.resolveMatrixGroupToolPolicy = resolveMatrixGroupToolPolicy;
var rooms_js_1 = require("./matrix/monitor/rooms.js");
function resolveMatrixGroupRequireMention(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var rawGroupId = (_b = (_a = params.groupId) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
    var roomId = rawGroupId;
    var lower = roomId.toLowerCase();
    if (lower.startsWith("matrix:")) {
        roomId = roomId.slice("matrix:".length).trim();
    }
    if (roomId.toLowerCase().startsWith("channel:")) {
        roomId = roomId.slice("channel:".length).trim();
    }
    if (roomId.toLowerCase().startsWith("room:")) {
        roomId = roomId.slice("room:".length).trim();
    }
    var groupChannel = (_d = (_c = params.groupChannel) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
    var aliases = groupChannel ? [groupChannel] : [];
    var cfg = params.cfg;
    var resolved = (0, rooms_js_1.resolveMatrixRoomConfig)({
        rooms: (_g = (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.matrix) === null || _f === void 0 ? void 0 : _f.groups) !== null && _g !== void 0 ? _g : (_j = (_h = cfg.channels) === null || _h === void 0 ? void 0 : _h.matrix) === null || _j === void 0 ? void 0 : _j.rooms,
        roomId: roomId,
        aliases: aliases,
        name: groupChannel || undefined,
    }).config;
    if (resolved) {
        if (resolved.autoReply === true) {
            return false;
        }
        if (resolved.autoReply === false) {
            return true;
        }
        if (typeof resolved.requireMention === "boolean") {
            return resolved.requireMention;
        }
    }
    return true;
}
function resolveMatrixGroupToolPolicy(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var rawGroupId = (_b = (_a = params.groupId) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
    var roomId = rawGroupId;
    var lower = roomId.toLowerCase();
    if (lower.startsWith("matrix:")) {
        roomId = roomId.slice("matrix:".length).trim();
    }
    if (roomId.toLowerCase().startsWith("channel:")) {
        roomId = roomId.slice("channel:".length).trim();
    }
    if (roomId.toLowerCase().startsWith("room:")) {
        roomId = roomId.slice("room:".length).trim();
    }
    var groupChannel = (_d = (_c = params.groupChannel) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
    var aliases = groupChannel ? [groupChannel] : [];
    var cfg = params.cfg;
    var resolved = (0, rooms_js_1.resolveMatrixRoomConfig)({
        rooms: (_g = (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.matrix) === null || _f === void 0 ? void 0 : _f.groups) !== null && _g !== void 0 ? _g : (_j = (_h = cfg.channels) === null || _h === void 0 ? void 0 : _h.matrix) === null || _j === void 0 ? void 0 : _j.rooms,
        roomId: roomId,
        aliases: aliases,
        name: groupChannel || undefined,
    }).config;
    return resolved === null || resolved === void 0 ? void 0 : resolved.tools;
}
