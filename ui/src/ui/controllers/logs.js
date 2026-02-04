"use strict";
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
exports.parseLogLine = parseLogLine;
exports.loadLogs = loadLogs;
var LOG_BUFFER_LIMIT = 2000;
var LEVELS = new Set(["trace", "debug", "info", "warn", "error", "fatal"]);
function parseMaybeJsonString(value) {
    if (typeof value !== "string") {
        return null;
    }
    var trimmed = value.trim();
    if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
        return null;
    }
    try {
        var parsed = JSON.parse(trimmed);
        if (!parsed || typeof parsed !== "object") {
            return null;
        }
        return parsed;
    }
    catch (_a) {
        return null;
    }
}
function normalizeLevel(value) {
    if (typeof value !== "string") {
        return null;
    }
    var lowered = value.toLowerCase();
    return LEVELS.has(lowered) ? lowered : null;
}
function parseLogLine(line) {
    var _a;
    if (!line.trim()) {
        return { raw: line, message: line };
    }
    try {
        var obj = JSON.parse(line);
        var meta = obj && typeof obj._meta === "object" && obj._meta !== null
            ? obj._meta
            : null;
        var time = typeof obj.time === "string" ? obj.time : typeof (meta === null || meta === void 0 ? void 0 : meta.date) === "string" ? meta === null || meta === void 0 ? void 0 : meta.date : null;
        var level = normalizeLevel((_a = meta === null || meta === void 0 ? void 0 : meta.logLevelName) !== null && _a !== void 0 ? _a : meta === null || meta === void 0 ? void 0 : meta.level);
        var contextCandidate = typeof obj["0"] === "string" ? obj["0"] : typeof (meta === null || meta === void 0 ? void 0 : meta.name) === "string" ? meta === null || meta === void 0 ? void 0 : meta.name : null;
        var contextObj = parseMaybeJsonString(contextCandidate);
        var subsystem = null;
        if (contextObj) {
            if (typeof contextObj.subsystem === "string") {
                subsystem = contextObj.subsystem;
            }
            else if (typeof contextObj.module === "string") {
                subsystem = contextObj.module;
            }
        }
        if (!subsystem && contextCandidate && contextCandidate.length < 120) {
            subsystem = contextCandidate;
        }
        var message = null;
        if (typeof obj["1"] === "string") {
            message = obj["1"];
        }
        else if (!contextObj && typeof obj["0"] === "string") {
            message = obj["0"];
        }
        else if (typeof obj.message === "string") {
            message = obj.message;
        }
        return {
            raw: line,
            time: time,
            level: level,
            subsystem: subsystem,
            message: message !== null && message !== void 0 ? message : line,
            meta: meta !== null && meta !== void 0 ? meta : undefined,
        };
    }
    catch (_b) {
        return { raw: line, message: line };
    }
}
function loadLogs(state, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var res, payload, lines, entries, shouldReset, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    if (state.logsLoading && !(opts === null || opts === void 0 ? void 0 : opts.quiet)) {
                        return [2 /*return*/];
                    }
                    if (!(opts === null || opts === void 0 ? void 0 : opts.quiet)) {
                        state.logsLoading = true;
                    }
                    state.logsError = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, state.client.request("logs.tail", {
                            cursor: (opts === null || opts === void 0 ? void 0 : opts.reset) ? undefined : ((_a = state.logsCursor) !== null && _a !== void 0 ? _a : undefined),
                            limit: state.logsLimit,
                            maxBytes: state.logsMaxBytes,
                        })];
                case 2:
                    res = _b.sent();
                    payload = res;
                    lines = Array.isArray(payload.lines)
                        ? payload.lines.filter(function (line) { return typeof line === "string"; })
                        : [];
                    entries = lines.map(parseLogLine);
                    shouldReset = Boolean((opts === null || opts === void 0 ? void 0 : opts.reset) || payload.reset || state.logsCursor == null);
                    state.logsEntries = shouldReset
                        ? entries
                        : __spreadArray(__spreadArray([], state.logsEntries, true), entries, true).slice(-LOG_BUFFER_LIMIT);
                    if (typeof payload.cursor === "number") {
                        state.logsCursor = payload.cursor;
                    }
                    if (typeof payload.file === "string") {
                        state.logsFile = payload.file;
                    }
                    state.logsTruncated = Boolean(payload.truncated);
                    state.logsLastFetchAt = Date.now();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _b.sent();
                    state.logsError = String(err_1);
                    return [3 /*break*/, 5];
                case 4:
                    if (!(opts === null || opts === void 0 ? void 0 : opts.quiet)) {
                        state.logsLoading = false;
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
