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
exports.getCronChannelOptions = void 0;
exports.warnIfCronSchedulerDisabled = warnIfCronSchedulerDisabled;
exports.parseDurationMs = parseDurationMs;
exports.parseAtMs = parseAtMs;
exports.printCronList = printCronList;
var index_js_1 = require("../../channels/plugins/index.js");
var parse_js_1 = require("../../cron/parse.js");
var runtime_js_1 = require("../../runtime.js");
var theme_js_1 = require("../../terminal/theme.js");
var gateway_rpc_js_1 = require("../gateway-rpc.js");
var getCronChannelOptions = function () {
    return __spreadArray(["last"], (0, index_js_1.listChannelPlugins)().map(function (plugin) { return plugin.id; }), true).join("|");
};
exports.getCronChannelOptions = getCronChannelOptions;
function warnIfCronSchedulerDisabled(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var res, store, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.status", opts, {})];
                case 1:
                    res = (_b.sent());
                    if ((res === null || res === void 0 ? void 0 : res.enabled) === true) {
                        return [2 /*return*/];
                    }
                    store = typeof (res === null || res === void 0 ? void 0 : res.storePath) === "string" ? res.storePath : "";
                    runtime_js_1.defaultRuntime.error([
                        "warning: cron scheduler is disabled in the Gateway; jobs are saved but will not run automatically.",
                        "Re-enable with `cron.enabled: true` (or remove `cron.enabled: false`) and restart the Gateway.",
                        store ? "store: ".concat(store) : "",
                    ]
                        .filter(Boolean)
                        .join("\n"));
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function parseDurationMs(input) {
    var _a, _b;
    var raw = input.trim();
    if (!raw) {
        return null;
    }
    var match = raw.match(/^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/i);
    if (!match) {
        return null;
    }
    var n = Number.parseFloat((_a = match[1]) !== null && _a !== void 0 ? _a : "");
    if (!Number.isFinite(n) || n <= 0) {
        return null;
    }
    var unit = ((_b = match[2]) !== null && _b !== void 0 ? _b : "").toLowerCase();
    var factor = unit === "ms"
        ? 1
        : unit === "s"
            ? 1000
            : unit === "m"
                ? 60000
                : unit === "h"
                    ? 3600000
                    : 86400000;
    return Math.floor(n * factor);
}
function parseAtMs(input) {
    var raw = input.trim();
    if (!raw) {
        return null;
    }
    var absolute = (0, parse_js_1.parseAbsoluteTimeMs)(raw);
    if (absolute) {
        return absolute;
    }
    var dur = parseDurationMs(raw);
    if (dur) {
        return Date.now() + dur;
    }
    return null;
}
var CRON_ID_PAD = 36;
var CRON_NAME_PAD = 24;
var CRON_SCHEDULE_PAD = 32;
var CRON_NEXT_PAD = 10;
var CRON_LAST_PAD = 10;
var CRON_STATUS_PAD = 9;
var CRON_TARGET_PAD = 9;
var CRON_AGENT_PAD = 10;
var pad = function (value, width) { return value.padEnd(width); };
var truncate = function (value, width) {
    if (value.length <= width) {
        return value;
    }
    if (width <= 3) {
        return value.slice(0, width);
    }
    return "".concat(value.slice(0, width - 3), "...");
};
var formatIsoMinute = function (ms) {
    var d = new Date(ms);
    if (Number.isNaN(d.getTime())) {
        return "-";
    }
    var iso = d.toISOString();
    return "".concat(iso.slice(0, 10), " ").concat(iso.slice(11, 16), "Z");
};
var formatDuration = function (ms) {
    if (ms < 60000) {
        return "".concat(Math.max(1, Math.round(ms / 1000)), "s");
    }
    if (ms < 3600000) {
        return "".concat(Math.round(ms / 60000), "m");
    }
    if (ms < 86400000) {
        return "".concat(Math.round(ms / 3600000), "h");
    }
    return "".concat(Math.round(ms / 86400000), "d");
};
var formatSpan = function (ms) {
    if (ms < 60000) {
        return "<1m";
    }
    if (ms < 3600000) {
        return "".concat(Math.round(ms / 60000), "m");
    }
    if (ms < 86400000) {
        return "".concat(Math.round(ms / 3600000), "h");
    }
    return "".concat(Math.round(ms / 86400000), "d");
};
var formatRelative = function (ms, nowMs) {
    if (!ms) {
        return "-";
    }
    var delta = ms - nowMs;
    var label = formatSpan(Math.abs(delta));
    return delta >= 0 ? "in ".concat(label) : "".concat(label, " ago");
};
var formatSchedule = function (schedule) {
    if (schedule.kind === "at") {
        return "at ".concat(formatIsoMinute(schedule.atMs));
    }
    if (schedule.kind === "every") {
        return "every ".concat(formatDuration(schedule.everyMs));
    }
    return schedule.tz ? "cron ".concat(schedule.expr, " @ ").concat(schedule.tz) : "cron ".concat(schedule.expr);
};
var formatStatus = function (job) {
    var _a;
    if (!job.enabled) {
        return "disabled";
    }
    if (job.state.runningAtMs) {
        return "running";
    }
    return (_a = job.state.lastStatus) !== null && _a !== void 0 ? _a : "idle";
};
function printCronList(jobs, runtime) {
    var _a;
    if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
    if (jobs.length === 0) {
        runtime.log("No cron jobs.");
        return;
    }
    var rich = (0, theme_js_1.isRich)();
    var header = [
        pad("ID", CRON_ID_PAD),
        pad("Name", CRON_NAME_PAD),
        pad("Schedule", CRON_SCHEDULE_PAD),
        pad("Next", CRON_NEXT_PAD),
        pad("Last", CRON_LAST_PAD),
        pad("Status", CRON_STATUS_PAD),
        pad("Target", CRON_TARGET_PAD),
        pad("Agent", CRON_AGENT_PAD),
    ].join(" ");
    runtime.log(rich ? theme_js_1.theme.heading(header) : header);
    var now = Date.now();
    var _loop_1 = function (job) {
        var idLabel = pad(job.id, CRON_ID_PAD);
        var nameLabel = pad(truncate(job.name, CRON_NAME_PAD), CRON_NAME_PAD);
        var scheduleLabel = pad(truncate(formatSchedule(job.schedule), CRON_SCHEDULE_PAD), CRON_SCHEDULE_PAD);
        var nextLabel = pad(job.enabled ? formatRelative(job.state.nextRunAtMs, now) : "-", CRON_NEXT_PAD);
        var lastLabel = pad(formatRelative(job.state.lastRunAtMs, now), CRON_LAST_PAD);
        var statusRaw = formatStatus(job);
        var statusLabel = pad(statusRaw, CRON_STATUS_PAD);
        var targetLabel = pad(job.sessionTarget, CRON_TARGET_PAD);
        var agentLabel = pad(truncate((_a = job.agentId) !== null && _a !== void 0 ? _a : "default", CRON_AGENT_PAD), CRON_AGENT_PAD);
        var coloredStatus = (function () {
            if (statusRaw === "ok") {
                return (0, theme_js_1.colorize)(rich, theme_js_1.theme.success, statusLabel);
            }
            if (statusRaw === "error") {
                return (0, theme_js_1.colorize)(rich, theme_js_1.theme.error, statusLabel);
            }
            if (statusRaw === "running") {
                return (0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, statusLabel);
            }
            if (statusRaw === "skipped") {
                return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, statusLabel);
            }
            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, statusLabel);
        })();
        var coloredTarget = job.sessionTarget === "isolated"
            ? (0, theme_js_1.colorize)(rich, theme_js_1.theme.accentBright, targetLabel)
            : (0, theme_js_1.colorize)(rich, theme_js_1.theme.accent, targetLabel);
        var coloredAgent = job.agentId
            ? (0, theme_js_1.colorize)(rich, theme_js_1.theme.info, agentLabel)
            : (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, agentLabel);
        var line = [
            (0, theme_js_1.colorize)(rich, theme_js_1.theme.accent, idLabel),
            (0, theme_js_1.colorize)(rich, theme_js_1.theme.info, nameLabel),
            (0, theme_js_1.colorize)(rich, theme_js_1.theme.info, scheduleLabel),
            (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, nextLabel),
            (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, lastLabel),
            coloredStatus,
            coloredTarget,
            coloredAgent,
        ].join(" ");
        runtime.log(line.trimEnd());
    };
    for (var _i = 0, jobs_1 = jobs; _i < jobs_1.length; _i++) {
        var job = jobs_1[_i];
        _loop_1(job);
    }
}
