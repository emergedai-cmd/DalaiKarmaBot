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
exports.registerLogsCli = registerLogsCli;
var promises_1 = require("node:timers/promises");
var call_js_1 = require("../gateway/call.js");
var parse_log_line_js_1 = require("../logging/parse-log-line.js");
var links_js_1 = require("../terminal/links.js");
var progress_line_js_1 = require("../terminal/progress-line.js");
var stream_writer_js_1 = require("../terminal/stream-writer.js");
var theme_js_1 = require("../terminal/theme.js");
var command_format_js_1 = require("./command-format.js");
var gateway_rpc_js_1 = require("./gateway-rpc.js");
function parsePositiveInt(value, fallback) {
    if (!value) {
        return fallback;
    }
    var parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function fetchLogs(opts, cursor, showProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, maxBytes, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    limit = parsePositiveInt(opts.limit, 200);
                    maxBytes = parsePositiveInt(opts.maxBytes, 250000);
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("logs.tail", opts, { cursor: cursor, limit: limit, maxBytes: maxBytes }, { progress: showProgress })];
                case 1:
                    payload = _a.sent();
                    if (!payload || typeof payload !== "object") {
                        throw new Error("Unexpected logs.tail response");
                    }
                    return [2 /*return*/, payload];
            }
        });
    });
}
function formatLogTimestamp(value, mode) {
    if (mode === void 0) { mode = "plain"; }
    if (!value) {
        return "";
    }
    var parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    if (mode === "pretty") {
        return parsed.toISOString().slice(11, 19);
    }
    return parsed.toISOString();
}
function formatLogLine(raw, opts) {
    var _a, _b, _c;
    var parsed = (0, parse_log_line_js_1.parseLogLine)(raw);
    if (!parsed) {
        return raw;
    }
    var label = (_b = (_a = parsed.subsystem) !== null && _a !== void 0 ? _a : parsed.module) !== null && _b !== void 0 ? _b : "";
    var time = formatLogTimestamp(parsed.time, opts.pretty ? "pretty" : "plain");
    var level = (_c = parsed.level) !== null && _c !== void 0 ? _c : "";
    var levelLabel = level.padEnd(5).trim();
    var message = parsed.message || parsed.raw;
    if (!opts.pretty) {
        return [time, level, label, message].filter(Boolean).join(" ").trim();
    }
    var timeLabel = (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.muted, time);
    var labelValue = (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.accent, label);
    var levelValue = level === "error" || level === "fatal"
        ? (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.error, levelLabel)
        : level === "warn"
            ? (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.warn, levelLabel)
            : level === "debug" || level === "trace"
                ? (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.muted, levelLabel)
                : (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.info, levelLabel);
    var messageValue = level === "error" || level === "fatal"
        ? (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.error, message)
        : level === "warn"
            ? (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.warn, message)
            : level === "debug" || level === "trace"
                ? (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.muted, message)
                : (0, theme_js_1.colorize)(opts.rich, theme_js_1.theme.info, message);
    var head = [timeLabel, levelValue, labelValue].filter(Boolean).join(" ");
    return [head, messageValue].filter(Boolean).join(" ").trim();
}
function createLogWriters() {
    var writer = (0, stream_writer_js_1.createSafeStreamWriter)({
        beforeWrite: function () { return (0, progress_line_js_1.clearActiveProgressLine)(); },
        onBrokenPipe: function (err, stream) {
            var _a;
            var code = (_a = err.code) !== null && _a !== void 0 ? _a : "EPIPE";
            var target = stream === process.stdout ? "stdout" : "stderr";
            var message = "openclaw logs: output ".concat(target, " closed (").concat(code, "). Stopping tail.");
            try {
                (0, progress_line_js_1.clearActiveProgressLine)();
                process.stderr.write("".concat(message, "\n"));
            }
            catch (_b) {
                // ignore secondary failures while reporting the broken pipe
            }
        },
    });
    return {
        logLine: function (text) { return writer.writeLine(process.stdout, text); },
        errorLine: function (text) { return writer.writeLine(process.stderr, text); },
        emitJsonLine: function (payload, toStdErr) {
            if (toStdErr === void 0) { toStdErr = false; }
            return writer.write(toStdErr ? process.stderr : process.stdout, "".concat(JSON.stringify(payload), "\n"));
        },
    };
}
function emitGatewayError(err, opts, mode, rich, emitJsonLine, errorLine) {
    var details = (0, call_js_1.buildGatewayConnectionDetails)({ url: opts.url });
    var message = "Gateway not reachable. Is it running and accessible?";
    var hint = "Hint: run `".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor"), "`.");
    var errorText = err instanceof Error ? err.message : String(err);
    if (mode === "json") {
        if (!emitJsonLine({
            type: "error",
            message: message,
            error: errorText,
            details: details,
            hint: hint,
        }, true)) {
            return;
        }
        return;
    }
    if (!errorLine((0, theme_js_1.colorize)(rich, theme_js_1.theme.error, message))) {
        return;
    }
    if (!errorLine(details.message)) {
        return;
    }
    errorLine((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, hint));
}
function registerLogsCli(program) {
    var _this = this;
    var logs = program
        .command("logs")
        .description("Tail gateway file logs via RPC")
        .option("--limit <n>", "Max lines to return", "200")
        .option("--max-bytes <n>", "Max bytes to read", "250000")
        .option("--follow", "Follow log output", false)
        .option("--interval <ms>", "Polling interval in ms", "1000")
        .option("--json", "Emit JSON log lines", false)
        .option("--plain", "Plain text output (no ANSI styling)", false)
        .option("--no-color", "Disable ANSI colors")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/logs", "docs.openclaw.ai/cli/logs"), "\n");
    });
    (0, gateway_rpc_js_1.addGatewayClientOptions)(logs);
    logs.action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _a, logLine, errorLine, emitJsonLine, interval, cursor, first, jsonMode, pretty, rich, payload, showProgress, err_1, lines, _i, lines_1, line, parsed, prefix, _b, lines_2, line;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = createLogWriters(), logLine = _a.logLine, errorLine = _a.errorLine, emitJsonLine = _a.emitJsonLine;
                    interval = parsePositiveInt(opts.interval, 1000);
                    first = true;
                    jsonMode = Boolean(opts.json);
                    pretty = !jsonMode && Boolean(process.stdout.isTTY) && !opts.plain;
                    rich = (0, theme_js_1.isRich)() && opts.color !== false;
                    _c.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 7];
                    payload = void 0;
                    showProgress = first && !opts.follow;
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetchLogs(opts, cursor, showProgress)];
                case 3:
                    payload = _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    emitGatewayError(err_1, opts, jsonMode ? "json" : "text", rich, emitJsonLine, errorLine);
                    process.exit(1);
                    return [2 /*return*/];
                case 5:
                    lines = Array.isArray(payload.lines) ? payload.lines : [];
                    if (jsonMode) {
                        if (first) {
                            if (!emitJsonLine({
                                type: "meta",
                                file: payload.file,
                                cursor: payload.cursor,
                                size: payload.size,
                            })) {
                                return [2 /*return*/];
                            }
                        }
                        for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                            line = lines_1[_i];
                            parsed = (0, parse_log_line_js_1.parseLogLine)(line);
                            if (parsed) {
                                if (!emitJsonLine(__assign({ type: "log" }, parsed))) {
                                    return [2 /*return*/];
                                }
                            }
                            else {
                                if (!emitJsonLine({ type: "raw", raw: line })) {
                                    return [2 /*return*/];
                                }
                            }
                        }
                        if (payload.truncated) {
                            if (!emitJsonLine({
                                type: "notice",
                                message: "Log tail truncated (increase --max-bytes).",
                            })) {
                                return [2 /*return*/];
                            }
                        }
                        if (payload.reset) {
                            if (!emitJsonLine({
                                type: "notice",
                                message: "Log cursor reset (file rotated).",
                            })) {
                                return [2 /*return*/];
                            }
                        }
                    }
                    else {
                        if (first && payload.file) {
                            prefix = pretty ? (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "Log file:") : "Log file:";
                            if (!logLine("".concat(prefix, " ").concat(payload.file))) {
                                return [2 /*return*/];
                            }
                        }
                        for (_b = 0, lines_2 = lines; _b < lines_2.length; _b++) {
                            line = lines_2[_b];
                            if (!logLine(formatLogLine(line, {
                                pretty: pretty,
                                rich: rich,
                            }))) {
                                return [2 /*return*/];
                            }
                        }
                        if (payload.truncated) {
                            if (!errorLine("Log tail truncated (increase --max-bytes).")) {
                                return [2 /*return*/];
                            }
                        }
                        if (payload.reset) {
                            if (!errorLine("Log cursor reset (file rotated).")) {
                                return [2 /*return*/];
                            }
                        }
                    }
                    cursor =
                        typeof payload.cursor === "number" && Number.isFinite(payload.cursor)
                            ? payload.cursor
                            : cursor;
                    first = false;
                    if (!opts.follow) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, promises_1.setTimeout)(interval)];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    }); });
}
