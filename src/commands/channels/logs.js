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
exports.channelsLogsCommand = channelsLogsCommand;
var promises_1 = require("node:fs/promises");
var index_js_1 = require("../../channels/plugins/index.js");
var logging_js_1 = require("../../logging.js");
var parse_log_line_js_1 = require("../../logging/parse-log-line.js");
var runtime_js_1 = require("../../runtime.js");
var theme_js_1 = require("../../terminal/theme.js");
var DEFAULT_LIMIT = 200;
var MAX_BYTES = 1000000;
var getChannelSet = function () {
    return new Set(__spreadArray(__spreadArray([], (0, index_js_1.listChannelPlugins)().map(function (plugin) { return plugin.id; }), true), ["all"], false));
};
function parseChannelFilter(raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
    if (!trimmed) {
        return "all";
    }
    return getChannelSet().has(trimmed) ? trimmed : "all";
}
function matchesChannel(line, channel) {
    var _a, _b;
    if (channel === "all") {
        return true;
    }
    var needle = "gateway/channels/".concat(channel);
    if ((_a = line.subsystem) === null || _a === void 0 ? void 0 : _a.includes(needle)) {
        return true;
    }
    if ((_b = line.module) === null || _b === void 0 ? void 0 : _b.includes(channel)) {
        return true;
    }
    return false;
}
function readTailLines(file, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var stat, size, start, handle, length_1, buffer, readResult, text, lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.stat(file).catch(function () { return null; })];
                case 1:
                    stat = _a.sent();
                    if (!stat) {
                        return [2 /*return*/, []];
                    }
                    size = stat.size;
                    start = Math.max(0, size - MAX_BYTES);
                    return [4 /*yield*/, promises_1.default.open(file, "r")];
                case 2:
                    handle = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 7]);
                    length_1 = Math.max(0, size - start);
                    if (length_1 === 0) {
                        return [2 /*return*/, []];
                    }
                    buffer = Buffer.alloc(length_1);
                    return [4 /*yield*/, handle.read(buffer, 0, length_1, start)];
                case 4:
                    readResult = _a.sent();
                    text = buffer.toString("utf8", 0, readResult.bytesRead);
                    lines = text.split("\n");
                    if (start > 0) {
                        lines = lines.slice(1);
                    }
                    if (lines.length && lines[lines.length - 1] === "") {
                        lines = lines.slice(0, -1);
                    }
                    if (lines.length > limit) {
                        lines = lines.slice(lines.length - limit);
                    }
                    return [2 /*return*/, lines];
                case 5: return [4 /*yield*/, handle.close()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function channelsLogsCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var channel, limitRaw, limit, file, rawLines, parsed, filtered, lines, _i, lines_1, line, ts, level;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    channel = parseChannelFilter(opts.channel);
                    limitRaw = typeof opts.lines === "string" ? Number(opts.lines) : opts.lines;
                    limit = typeof limitRaw === "number" && Number.isFinite(limitRaw) && limitRaw > 0
                        ? Math.floor(limitRaw)
                        : DEFAULT_LIMIT;
                    file = (0, logging_js_1.getResolvedLoggerSettings)().file;
                    return [4 /*yield*/, readTailLines(file, limit * 4)];
                case 1:
                    rawLines = _a.sent();
                    parsed = rawLines
                        .map(parse_log_line_js_1.parseLogLine)
                        .filter(function (line) { return Boolean(line); });
                    filtered = parsed.filter(function (line) { return matchesChannel(line, channel); });
                    lines = filtered.slice(Math.max(0, filtered.length - limit));
                    if (opts.json) {
                        runtime.log(JSON.stringify({ file: file, channel: channel, lines: lines }, null, 2));
                        return [2 /*return*/];
                    }
                    runtime.log(theme_js_1.theme.info("Log file: ".concat(file)));
                    if (channel !== "all") {
                        runtime.log(theme_js_1.theme.info("Channel: ".concat(channel)));
                    }
                    if (lines.length === 0) {
                        runtime.log(theme_js_1.theme.muted("No matching log lines."));
                        return [2 /*return*/];
                    }
                    for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                        line = lines_1[_i];
                        ts = line.time ? "".concat(line.time, " ") : "";
                        level = line.level ? "".concat(line.level.toLowerCase(), " ") : "";
                        runtime.log("".concat(ts).concat(level).concat(line.message).trim());
                    }
                    return [2 /*return*/];
            }
        });
    });
}
