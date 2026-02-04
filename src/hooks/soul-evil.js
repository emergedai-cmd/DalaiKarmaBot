"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SOUL_EVIL_FILENAME = void 0;
exports.resolveSoulEvilConfigFromHook = resolveSoulEvilConfigFromHook;
exports.decideSoulEvil = decideSoulEvil;
exports.applySoulEvilOverride = applySoulEvilOverride;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var date_time_js_1 = require("../agents/date-time.js");
var parse_duration_js_1 = require("../cli/parse-duration.js");
var utils_js_1 = require("../utils.js");
exports.DEFAULT_SOUL_EVIL_FILENAME = "SOUL_EVIL.md";
function resolveSoulEvilConfigFromHook(entry, log) {
    var _a, _b, _c, _d, _e;
    if (!entry) {
        return null;
    }
    var file = typeof entry.file === "string" ? entry.file : undefined;
    if (entry.file !== undefined && !file) {
        (_a = log === null || log === void 0 ? void 0 : log.warn) === null || _a === void 0 ? void 0 : _a.call(log, "soul-evil config: file must be a string");
    }
    var chance;
    if (entry.chance !== undefined) {
        if (typeof entry.chance === "number" && Number.isFinite(entry.chance)) {
            chance = entry.chance;
        }
        else {
            (_b = log === null || log === void 0 ? void 0 : log.warn) === null || _b === void 0 ? void 0 : _b.call(log, "soul-evil config: chance must be a number");
        }
    }
    var purge;
    if (entry.purge && typeof entry.purge === "object") {
        var at = typeof entry.purge.at === "string"
            ? entry.purge.at
            : undefined;
        var duration = typeof entry.purge.duration === "string"
            ? entry.purge.duration
            : undefined;
        if (entry.purge.at !== undefined && !at) {
            (_c = log === null || log === void 0 ? void 0 : log.warn) === null || _c === void 0 ? void 0 : _c.call(log, "soul-evil config: purge.at must be a string");
        }
        if (entry.purge.duration !== undefined && !duration) {
            (_d = log === null || log === void 0 ? void 0 : log.warn) === null || _d === void 0 ? void 0 : _d.call(log, "soul-evil config: purge.duration must be a string");
        }
        purge = { at: at, duration: duration };
    }
    else if (entry.purge !== undefined) {
        (_e = log === null || log === void 0 ? void 0 : log.warn) === null || _e === void 0 ? void 0 : _e.call(log, "soul-evil config: purge must be an object");
    }
    if (!file && chance === undefined && !purge) {
        return null;
    }
    return { file: file, chance: chance, purge: purge };
}
function clampChance(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return 0;
    }
    return Math.min(1, Math.max(0, value));
}
function parsePurgeAt(raw) {
    var _a, _b;
    if (!raw) {
        return null;
    }
    var trimmed = raw.trim();
    var match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(trimmed);
    if (!match) {
        return null;
    }
    var hour = Number.parseInt((_a = match[1]) !== null && _a !== void 0 ? _a : "", 10);
    var minute = Number.parseInt((_b = match[2]) !== null && _b !== void 0 ? _b : "", 10);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
        return null;
    }
    return hour * 60 + minute;
}
function timeOfDayMsInTimezone(date, timeZone) {
    try {
        var parts = new Intl.DateTimeFormat("en-US", {
            timeZone: timeZone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23",
        }).formatToParts(date);
        var map = {};
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            if (part.type !== "literal") {
                map[part.type] = part.value;
            }
        }
        if (!map.hour || !map.minute || !map.second) {
            return null;
        }
        var hour = Number.parseInt(map.hour, 10);
        var minute = Number.parseInt(map.minute, 10);
        var second = Number.parseInt(map.second, 10);
        if (!Number.isFinite(hour) || !Number.isFinite(minute) || !Number.isFinite(second)) {
            return null;
        }
        return (hour * 3600 + minute * 60 + second) * 1000 + date.getMilliseconds();
    }
    catch (_a) {
        return null;
    }
}
function isWithinDailyPurgeWindow(params) {
    if (!params.at || !params.duration) {
        return false;
    }
    var startMinutes = parsePurgeAt(params.at);
    if (startMinutes === null) {
        return false;
    }
    var durationMs;
    try {
        durationMs = (0, parse_duration_js_1.parseDurationMs)(params.duration, { defaultUnit: "m" });
    }
    catch (_a) {
        return false;
    }
    if (!Number.isFinite(durationMs) || durationMs <= 0) {
        return false;
    }
    var dayMs = 24 * 60 * 60 * 1000;
    if (durationMs >= dayMs) {
        return true;
    }
    var nowMs = timeOfDayMsInTimezone(params.now, params.timeZone);
    if (nowMs === null) {
        return false;
    }
    var startMs = startMinutes * 60 * 1000;
    var endMs = startMs + durationMs;
    if (endMs < dayMs) {
        return nowMs >= startMs && nowMs < endMs;
    }
    var wrappedEnd = endMs % dayMs;
    return nowMs >= startMs || nowMs < wrappedEnd;
}
function decideSoulEvil(params) {
    var _a, _b, _c, _d, _e;
    var evil = params.config;
    var fileName = ((_a = evil === null || evil === void 0 ? void 0 : evil.file) === null || _a === void 0 ? void 0 : _a.trim()) || exports.DEFAULT_SOUL_EVIL_FILENAME;
    if (!evil) {
        return { useEvil: false, fileName: fileName };
    }
    var timeZone = (0, date_time_js_1.resolveUserTimezone)(params.userTimezone);
    var now = (_b = params.now) !== null && _b !== void 0 ? _b : new Date();
    var inPurge = isWithinDailyPurgeWindow({
        at: (_c = evil.purge) === null || _c === void 0 ? void 0 : _c.at,
        duration: (_d = evil.purge) === null || _d === void 0 ? void 0 : _d.duration,
        now: now,
        timeZone: timeZone,
    });
    if (inPurge) {
        return { useEvil: true, reason: "purge", fileName: fileName };
    }
    var chance = clampChance(evil.chance);
    if (chance > 0) {
        var random = (_e = params.random) !== null && _e !== void 0 ? _e : Math.random;
        if (random() < chance) {
            return { useEvil: true, reason: "chance", fileName: fileName };
        }
    }
    return { useEvil: false, fileName: fileName };
}
function applySoulEvilOverride(params) {
    return __awaiter(this, void 0, void 0, function () {
        var decision, workspaceDir, evilPath, evilContent, _a, hasSoulEntry, replaced, updated;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    decision = decideSoulEvil({
                        config: params.config,
                        userTimezone: params.userTimezone,
                        now: params.now,
                        random: params.random,
                    });
                    if (!decision.useEvil) {
                        return [2 /*return*/, params.files];
                    }
                    workspaceDir = (0, utils_js_1.resolveUserPath)(params.workspaceDir);
                    evilPath = node_path_1.default.join(workspaceDir, decision.fileName);
                    _p.label = 1;
                case 1:
                    _p.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readFile(evilPath, "utf-8")];
                case 2:
                    evilContent = _p.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _p.sent();
                    (_c = (_b = params.log) === null || _b === void 0 ? void 0 : _b.warn) === null || _c === void 0 ? void 0 : _c.call(_b, "SOUL_EVIL active (".concat((_d = decision.reason) !== null && _d !== void 0 ? _d : "unknown", ") but file missing: ").concat(evilPath));
                    return [2 /*return*/, params.files];
                case 4:
                    if (!evilContent.trim()) {
                        (_f = (_e = params.log) === null || _e === void 0 ? void 0 : _e.warn) === null || _f === void 0 ? void 0 : _f.call(_e, "SOUL_EVIL active (".concat((_g = decision.reason) !== null && _g !== void 0 ? _g : "unknown", ") but file empty: ").concat(evilPath));
                        return [2 /*return*/, params.files];
                    }
                    hasSoulEntry = params.files.some(function (file) { return file.name === "SOUL.md"; });
                    if (!hasSoulEntry) {
                        (_j = (_h = params.log) === null || _h === void 0 ? void 0 : _h.warn) === null || _j === void 0 ? void 0 : _j.call(_h, "SOUL_EVIL active (".concat((_k = decision.reason) !== null && _k !== void 0 ? _k : "unknown", ") but SOUL.md not in bootstrap files"));
                        return [2 /*return*/, params.files];
                    }
                    replaced = false;
                    updated = params.files.map(function (file) {
                        if (file.name !== "SOUL.md") {
                            return file;
                        }
                        replaced = true;
                        return __assign(__assign({}, file), { content: evilContent, missing: false });
                    });
                    if (!replaced) {
                        return [2 /*return*/, params.files];
                    }
                    (_m = (_l = params.log) === null || _l === void 0 ? void 0 : _l.debug) === null || _m === void 0 ? void 0 : _m.call(_l, "SOUL_EVIL active (".concat((_o = decision.reason) !== null && _o !== void 0 ? _o : "unknown", ") using ").concat(decision.fileName));
                    return [2 /*return*/, updated];
            }
        });
    });
}
