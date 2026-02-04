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
exports.buildStatusAllReportLines = buildStatusAllReportLines;
var table_js_1 = require("../../terminal/table.js");
var theme_js_1 = require("../../terminal/theme.js");
var diagnosis_js_1 = require("./diagnosis.js");
var format_js_1 = require("./format.js");
function buildStatusAllReportLines(params) {
    return __awaiter(this, void 0, void 0, function () {
        var rich, heading, ok, warn, fail, muted, tableWidth, overview, channelRows, channelIssuesByChannel, channelRowsWithIssues, channelsTable, agentRows, agentsTable, lines, _i, _a, detail;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rich = (0, theme_js_1.isRich)();
                    heading = function (text) { return (rich ? theme_js_1.theme.heading(text) : text); };
                    ok = function (text) { return (rich ? theme_js_1.theme.success(text) : text); };
                    warn = function (text) { return (rich ? theme_js_1.theme.warn(text) : text); };
                    fail = function (text) { return (rich ? theme_js_1.theme.error(text) : text); };
                    muted = function (text) { return (rich ? theme_js_1.theme.muted(text) : text); };
                    tableWidth = Math.max(60, ((_b = process.stdout.columns) !== null && _b !== void 0 ? _b : 120) - 1);
                    overview = (0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "Item", header: "Item", minWidth: 10 },
                            { key: "Value", header: "Value", flex: true, minWidth: 24 },
                        ],
                        rows: params.overviewRows,
                    });
                    channelRows = params.channels.rows.map(function (row) { return ({
                        channelId: row.id,
                        Channel: row.label,
                        Enabled: row.enabled ? ok("ON") : muted("OFF"),
                        State: row.state === "ok"
                            ? ok("OK")
                            : row.state === "warn"
                                ? warn("WARN")
                                : row.state === "off"
                                    ? muted("OFF")
                                    : theme_js_1.theme.accentDim("SETUP"),
                        Detail: row.detail,
                    }); });
                    channelIssuesByChannel = (function () {
                        var map = new Map();
                        for (var _i = 0, _a = params.channelIssues; _i < _a.length; _i++) {
                            var issue = _a[_i];
                            var key = issue.channel;
                            var list = map.get(key);
                            if (list) {
                                list.push(issue);
                            }
                            else {
                                map.set(key, [issue]);
                            }
                        }
                        return map;
                    })();
                    channelRowsWithIssues = channelRows.map(function (row) {
                        var _a;
                        var issues = (_a = channelIssuesByChannel.get(row.channelId)) !== null && _a !== void 0 ? _a : [];
                        if (issues.length === 0) {
                            return row;
                        }
                        var issue = issues[0];
                        var suffix = " \u00B7 ".concat(warn("gateway: ".concat(String(issue.message).slice(0, 90))));
                        return __assign(__assign({}, row), { State: warn("WARN"), Detail: "".concat(row.Detail).concat(suffix) });
                    });
                    channelsTable = (0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "Channel", header: "Channel", minWidth: 10 },
                            { key: "Enabled", header: "Enabled", minWidth: 7 },
                            { key: "State", header: "State", minWidth: 8 },
                            { key: "Detail", header: "Detail", flex: true, minWidth: 28 },
                        ],
                        rows: channelRowsWithIssues,
                    });
                    agentRows = params.agentStatus.agents.map(function (a) {
                        var _a;
                        return ({
                            Agent: ((_a = a.name) === null || _a === void 0 ? void 0 : _a.trim()) ? "".concat(a.id, " (").concat(a.name.trim(), ")") : a.id,
                            Bootstrap: a.bootstrapPending === true
                                ? warn("PENDING")
                                : a.bootstrapPending === false
                                    ? ok("OK")
                                    : "unknown",
                            Sessions: String(a.sessionsCount),
                            Active: a.lastActiveAgeMs != null ? (0, format_js_1.formatAge)(a.lastActiveAgeMs) : "unknown",
                            Store: a.sessionsPath,
                        });
                    });
                    agentsTable = (0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "Agent", header: "Agent", minWidth: 12 },
                            { key: "Bootstrap", header: "Bootstrap", minWidth: 10 },
                            { key: "Sessions", header: "Sessions", align: "right", minWidth: 8 },
                            { key: "Active", header: "Active", minWidth: 10 },
                            { key: "Store", header: "Store", flex: true, minWidth: 34 },
                        ],
                        rows: agentRows,
                    });
                    lines = [];
                    lines.push(heading("OpenClaw status --all"));
                    lines.push("");
                    lines.push(heading("Overview"));
                    lines.push(overview.trimEnd());
                    lines.push("");
                    lines.push(heading("Channels"));
                    lines.push(channelsTable.trimEnd());
                    for (_i = 0, _a = params.channels.details; _i < _a.length; _i++) {
                        detail = _a[_i];
                        lines.push("");
                        lines.push(heading(detail.title));
                        lines.push((0, table_js_1.renderTable)({
                            width: tableWidth,
                            columns: detail.columns.map(function (c) { return ({
                                key: c,
                                header: c,
                                flex: c === "Notes",
                                minWidth: c === "Notes" ? 28 : 10,
                            }); }),
                            rows: detail.rows.map(function (r) { return (__assign(__assign({}, r), (r.Status === "OK"
                                ? { Status: ok("OK") }
                                : r.Status === "WARN"
                                    ? { Status: warn("WARN") }
                                    : {}))); }),
                        }).trimEnd());
                    }
                    lines.push("");
                    lines.push(heading("Agents"));
                    lines.push(agentsTable.trimEnd());
                    lines.push("");
                    lines.push(heading("Diagnosis (read-only)"));
                    return [4 /*yield*/, (0, diagnosis_js_1.appendStatusAllDiagnosis)(__assign({ lines: lines, progress: params.progress, muted: muted, ok: ok, warn: warn, fail: fail, connectionDetailsForReport: params.connectionDetailsForReport }, params.diagnosis))];
                case 1:
                    _c.sent();
                    return [2 /*return*/, lines];
            }
        });
    });
}
