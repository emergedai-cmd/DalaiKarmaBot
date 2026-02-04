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
exports.resolveNodeCommandAllowlist = resolveNodeCommandAllowlist;
exports.isNodeCommandAllowed = isNodeCommandAllowed;
var CANVAS_COMMANDS = [
    "canvas.present",
    "canvas.hide",
    "canvas.navigate",
    "canvas.eval",
    "canvas.snapshot",
    "canvas.a2ui.push",
    "canvas.a2ui.pushJSONL",
    "canvas.a2ui.reset",
];
var CAMERA_COMMANDS = ["camera.list", "camera.snap", "camera.clip"];
var SCREEN_COMMANDS = ["screen.record"];
var LOCATION_COMMANDS = ["location.get"];
var SMS_COMMANDS = ["sms.send"];
var SYSTEM_COMMANDS = [
    "system.run",
    "system.which",
    "system.notify",
    "system.execApprovals.get",
    "system.execApprovals.set",
    "browser.proxy",
];
var PLATFORM_DEFAULTS = {
    ios: __spreadArray(__spreadArray(__spreadArray(__spreadArray([], CANVAS_COMMANDS, true), CAMERA_COMMANDS, true), SCREEN_COMMANDS, true), LOCATION_COMMANDS, true),
    android: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], CANVAS_COMMANDS, true), CAMERA_COMMANDS, true), SCREEN_COMMANDS, true), LOCATION_COMMANDS, true), SMS_COMMANDS, true),
    macos: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], CANVAS_COMMANDS, true), CAMERA_COMMANDS, true), SCREEN_COMMANDS, true), LOCATION_COMMANDS, true), SYSTEM_COMMANDS, true),
    linux: __spreadArray([], SYSTEM_COMMANDS, true),
    windows: __spreadArray([], SYSTEM_COMMANDS, true),
    unknown: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], CANVAS_COMMANDS, true), CAMERA_COMMANDS, true), SCREEN_COMMANDS, true), LOCATION_COMMANDS, true), SMS_COMMANDS, true), SYSTEM_COMMANDS, true),
};
function normalizePlatformId(platform, deviceFamily) {
    var raw = (platform !== null && platform !== void 0 ? platform : "").trim().toLowerCase();
    if (raw.startsWith("ios")) {
        return "ios";
    }
    if (raw.startsWith("android")) {
        return "android";
    }
    if (raw.startsWith("mac")) {
        return "macos";
    }
    if (raw.startsWith("darwin")) {
        return "macos";
    }
    if (raw.startsWith("win")) {
        return "windows";
    }
    if (raw.startsWith("linux")) {
        return "linux";
    }
    var family = (deviceFamily !== null && deviceFamily !== void 0 ? deviceFamily : "").trim().toLowerCase();
    if (family.includes("iphone") || family.includes("ipad") || family.includes("ios")) {
        return "ios";
    }
    if (family.includes("android")) {
        return "android";
    }
    if (family.includes("mac")) {
        return "macos";
    }
    if (family.includes("windows")) {
        return "windows";
    }
    if (family.includes("linux")) {
        return "linux";
    }
    return "unknown";
}
function resolveNodeCommandAllowlist(cfg, node) {
    var _a, _b, _c, _d, _e, _f, _g;
    var platformId = normalizePlatformId(node === null || node === void 0 ? void 0 : node.platform, node === null || node === void 0 ? void 0 : node.deviceFamily);
    var base = (_a = PLATFORM_DEFAULTS[platformId]) !== null && _a !== void 0 ? _a : PLATFORM_DEFAULTS.unknown;
    var extra = (_d = (_c = (_b = cfg.gateway) === null || _b === void 0 ? void 0 : _b.nodes) === null || _c === void 0 ? void 0 : _c.allowCommands) !== null && _d !== void 0 ? _d : [];
    var deny = new Set((_g = (_f = (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.nodes) === null || _f === void 0 ? void 0 : _f.denyCommands) !== null && _g !== void 0 ? _g : []);
    var allow = new Set(__spreadArray(__spreadArray([], base, true), extra, true).map(function (cmd) { return cmd.trim(); }).filter(Boolean));
    for (var _i = 0, deny_1 = deny; _i < deny_1.length; _i++) {
        var blocked = deny_1[_i];
        var trimmed = blocked.trim();
        if (trimmed) {
            allow.delete(trimmed);
        }
    }
    return allow;
}
function isNodeCommandAllowed(params) {
    var command = params.command.trim();
    if (!command) {
        return { ok: false, reason: "command required" };
    }
    if (!params.allowlist.has(command)) {
        return { ok: false, reason: "command not allowlisted" };
    }
    if (Array.isArray(params.declaredCommands) && params.declaredCommands.length > 0) {
        if (!params.declaredCommands.includes(command)) {
            return { ok: false, reason: "command not declared by node" };
        }
    }
    else {
        return { ok: false, reason: "node did not declare commands" };
    }
    return { ok: true };
}
