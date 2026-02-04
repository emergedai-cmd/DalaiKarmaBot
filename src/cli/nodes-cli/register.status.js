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
exports.registerNodesStatusCommands = registerNodesStatusCommands;
var runtime_js_1 = require("../../runtime.js");
var table_js_1 = require("../../terminal/table.js");
var utils_js_1 = require("../../utils.js");
var parse_duration_js_1 = require("../parse-duration.js");
var cli_utils_js_1 = require("./cli-utils.js");
var format_js_1 = require("./format.js");
var rpc_js_1 = require("./rpc.js");
function formatVersionLabel(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return raw;
    }
    if (trimmed.toLowerCase().startsWith("v")) {
        return trimmed;
    }
    return /^\d/.test(trimmed) ? "v".concat(trimmed) : trimmed;
}
function resolveNodeVersions(node) {
    var _a, _b, _c, _d, _e;
    var core = ((_a = node.coreVersion) === null || _a === void 0 ? void 0 : _a.trim()) || undefined;
    var ui = ((_b = node.uiVersion) === null || _b === void 0 ? void 0 : _b.trim()) || undefined;
    if (core || ui) {
        return { core: core, ui: ui };
    }
    var legacy = (_c = node.version) === null || _c === void 0 ? void 0 : _c.trim();
    if (!legacy) {
        return { core: undefined, ui: undefined };
    }
    var platform = (_e = (_d = node.platform) === null || _d === void 0 ? void 0 : _d.trim().toLowerCase()) !== null && _e !== void 0 ? _e : "";
    var headless = platform === "darwin" || platform === "linux" || platform === "win32" || platform === "windows";
    return headless ? { core: legacy, ui: undefined } : { core: undefined, ui: legacy };
}
function formatNodeVersions(node) {
    var _a = resolveNodeVersions(node), core = _a.core, ui = _a.ui;
    var parts = [];
    if (core) {
        parts.push("core ".concat(formatVersionLabel(core)));
    }
    if (ui) {
        parts.push("ui ".concat(formatVersionLabel(ui)));
    }
    return parts.length > 0 ? parts.join(" · ") : null;
}
function formatPathEnv(raw) {
    if (typeof raw !== "string") {
        return null;
    }
    var trimmed = raw.trim();
    if (!trimmed) {
        return null;
    }
    var parts = trimmed.split(":").filter(Boolean);
    var display = parts.length <= 3 ? trimmed : "".concat(parts.slice(0, 2).join(":"), ":\u2026:").concat(parts.slice(-1)[0]);
    return (0, utils_js_1.shortenHomeInString)(display);
}
function parseSinceMs(raw, label) {
    if (raw === undefined || raw === null) {
        return undefined;
    }
    var value = typeof raw === "string" ? raw.trim() : typeof raw === "number" ? String(raw).trim() : null;
    if (value === null) {
        runtime_js_1.defaultRuntime.error("".concat(label, ": invalid duration value"));
        runtime_js_1.defaultRuntime.exit(1);
        return undefined;
    }
    if (!value) {
        return undefined;
    }
    try {
        return (0, parse_duration_js_1.parseDurationMs)(value);
    }
    catch (err) {
        var message = err instanceof Error ? err.message : String(err);
        runtime_js_1.defaultRuntime.error("".concat(label, ": ").concat(message));
        runtime_js_1.defaultRuntime.exit(1);
        return undefined;
    }
}
function registerNodesStatusCommands(nodes) {
    var _this = this;
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("status")
        .description("List known nodes with connection status and capabilities")
        .option("--connected", "Only show connected nodes")
        .option("--last-connected <duration>", "Only show nodes connected within duration (e.g. 24h)")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("status", function () { return __awaiter(_this, void 0, void 0, function () {
                        var connectedOnly, sinceMs, result, obj, _a, ok, warn, muted, tableWidth, now, nodes, lastConnectedById, _b, _c, _d, filtered, ts, pairedCount, connectedCount, filteredLabel, rows;
                        var _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    connectedOnly = Boolean(opts.connected);
                                    sinceMs = parseSinceMs(opts.lastConnected, "Invalid --last-connected");
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.list", opts, {})];
                                case 1:
                                    result = _f.sent();
                                    obj = typeof result === "object" && result !== null ? result : {};
                                    _a = (0, cli_utils_js_1.getNodesTheme)(), ok = _a.ok, warn = _a.warn, muted = _a.muted;
                                    tableWidth = Math.max(60, ((_e = process.stdout.columns) !== null && _e !== void 0 ? _e : 120) - 1);
                                    now = Date.now();
                                    nodes = (0, format_js_1.parseNodeList)(result);
                                    if (!(sinceMs !== undefined)) return [3 /*break*/, 3];
                                    _c = Map.bind;
                                    _d = format_js_1.parsePairingList;
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.pair.list", opts, {})];
                                case 2:
                                    _b = new (_c.apply(Map, [void 0, _d.apply(void 0, [_f.sent()]).paired.map(function (entry) { return [entry.nodeId, entry]; })]))();
                                    return [3 /*break*/, 4];
                                case 3:
                                    _b = null;
                                    _f.label = 4;
                                case 4:
                                    lastConnectedById = _b;
                                    filtered = nodes.filter(function (n) {
                                        if (connectedOnly && !n.connected) {
                                            return false;
                                        }
                                        if (sinceMs !== undefined) {
                                            var paired = lastConnectedById === null || lastConnectedById === void 0 ? void 0 : lastConnectedById.get(n.nodeId);
                                            var lastConnectedAtMs = typeof (paired === null || paired === void 0 ? void 0 : paired.lastConnectedAtMs) === "number"
                                                ? paired.lastConnectedAtMs
                                                : typeof n.connectedAtMs === "number"
                                                    ? n.connectedAtMs
                                                    : undefined;
                                            if (typeof lastConnectedAtMs !== "number") {
                                                return false;
                                            }
                                            if (now - lastConnectedAtMs > sinceMs) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    });
                                    if (opts.json) {
                                        ts = typeof obj.ts === "number" ? obj.ts : Date.now();
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(__assign(__assign({}, obj), { ts: ts, nodes: filtered }), null, 2));
                                        return [2 /*return*/];
                                    }
                                    pairedCount = filtered.filter(function (n) { return Boolean(n.paired); }).length;
                                    connectedCount = filtered.filter(function (n) { return Boolean(n.connected); }).length;
                                    filteredLabel = filtered.length !== nodes.length ? " (of ".concat(nodes.length, ")") : "";
                                    runtime_js_1.defaultRuntime.log("Known: ".concat(filtered.length).concat(filteredLabel, " \u00B7 Paired: ").concat(pairedCount, " \u00B7 Connected: ").concat(connectedCount));
                                    if (filtered.length === 0) {
                                        return [2 /*return*/];
                                    }
                                    rows = filtered.map(function (n) {
                                        var _a, _b;
                                        var name = ((_a = n.displayName) === null || _a === void 0 ? void 0 : _a.trim()) ? n.displayName.trim() : n.nodeId;
                                        var perms = (0, format_js_1.formatPermissions)(n.permissions);
                                        var versions = formatNodeVersions(n);
                                        var pathEnv = formatPathEnv(n.pathEnv);
                                        var detailParts = [
                                            n.deviceFamily ? "device: ".concat(n.deviceFamily) : null,
                                            n.modelIdentifier ? "hw: ".concat(n.modelIdentifier) : null,
                                            perms ? "perms: ".concat(perms) : null,
                                            versions,
                                            pathEnv ? "path: ".concat(pathEnv) : null,
                                        ].filter(Boolean);
                                        var caps = Array.isArray(n.caps)
                                            ? n.caps.map(String).filter(Boolean).toSorted().join(", ")
                                            : "?";
                                        var paired = n.paired ? ok("paired") : warn("unpaired");
                                        var connected = n.connected ? ok("connected") : muted("disconnected");
                                        var since = typeof n.connectedAtMs === "number"
                                            ? " (".concat((0, format_js_1.formatAge)(Math.max(0, now - n.connectedAtMs)), " ago)")
                                            : "";
                                        return {
                                            Node: name,
                                            ID: n.nodeId,
                                            IP: (_b = n.remoteIp) !== null && _b !== void 0 ? _b : "",
                                            Detail: detailParts.join(" · "),
                                            Status: "".concat(paired, " \u00B7 ").concat(connected).concat(since),
                                            Caps: caps,
                                        };
                                    });
                                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                                        width: tableWidth,
                                        columns: [
                                            { key: "Node", header: "Node", minWidth: 14, flex: true },
                                            { key: "ID", header: "ID", minWidth: 10 },
                                            { key: "IP", header: "IP", minWidth: 10 },
                                            { key: "Detail", header: "Detail", minWidth: 18, flex: true },
                                            { key: "Status", header: "Status", minWidth: 18 },
                                            { key: "Caps", header: "Caps", minWidth: 12, flex: true },
                                        ],
                                        rows: rows,
                                    }).trimEnd());
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("describe")
        .description("Describe a node (capabilities + supported invoke commands)")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("describe", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, result, obj, displayName, connected, paired, caps, commands, perms, family, model, ip, pathEnv, versions, _a, heading, ok, warn, muted, status, tableWidth, rows, _i, commands_1, c;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_b = opts.node) !== null && _b !== void 0 ? _b : ""))];
                                case 1:
                                    nodeId = _d.sent();
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.describe", opts, {
                                            nodeId: nodeId,
                                        })];
                                case 2:
                                    result = _d.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                        return [2 /*return*/];
                                    }
                                    obj = typeof result === "object" && result !== null ? result : {};
                                    displayName = typeof obj.displayName === "string" ? obj.displayName : nodeId;
                                    connected = Boolean(obj.connected);
                                    paired = Boolean(obj.paired);
                                    caps = Array.isArray(obj.caps)
                                        ? obj.caps.map(String).filter(Boolean).toSorted()
                                        : null;
                                    commands = Array.isArray(obj.commands)
                                        ? obj.commands.map(String).filter(Boolean).toSorted()
                                        : [];
                                    perms = (0, format_js_1.formatPermissions)(obj.permissions);
                                    family = typeof obj.deviceFamily === "string" ? obj.deviceFamily : null;
                                    model = typeof obj.modelIdentifier === "string" ? obj.modelIdentifier : null;
                                    ip = typeof obj.remoteIp === "string" ? obj.remoteIp : null;
                                    pathEnv = typeof obj.pathEnv === "string" ? obj.pathEnv : null;
                                    versions = formatNodeVersions(obj);
                                    _a = (0, cli_utils_js_1.getNodesTheme)(), heading = _a.heading, ok = _a.ok, warn = _a.warn, muted = _a.muted;
                                    status = "".concat(paired ? ok("paired") : warn("unpaired"), " \u00B7 ").concat(connected ? ok("connected") : muted("disconnected"));
                                    tableWidth = Math.max(60, ((_c = process.stdout.columns) !== null && _c !== void 0 ? _c : 120) - 1);
                                    rows = [
                                        { Field: "ID", Value: nodeId },
                                        displayName ? { Field: "Name", Value: displayName } : null,
                                        ip ? { Field: "IP", Value: ip } : null,
                                        family ? { Field: "Device", Value: family } : null,
                                        model ? { Field: "Model", Value: model } : null,
                                        perms ? { Field: "Perms", Value: perms } : null,
                                        versions ? { Field: "Version", Value: versions } : null,
                                        pathEnv ? { Field: "PATH", Value: pathEnv } : null,
                                        { Field: "Status", Value: status },
                                        { Field: "Caps", Value: caps ? caps.join(", ") : "?" },
                                    ].filter(Boolean);
                                    runtime_js_1.defaultRuntime.log(heading("Node"));
                                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                                        width: tableWidth,
                                        columns: [
                                            { key: "Field", header: "Field", minWidth: 8 },
                                            { key: "Value", header: "Value", minWidth: 24, flex: true },
                                        ],
                                        rows: rows,
                                    }).trimEnd());
                                    runtime_js_1.defaultRuntime.log("");
                                    runtime_js_1.defaultRuntime.log(heading("Commands"));
                                    if (commands.length === 0) {
                                        runtime_js_1.defaultRuntime.log(muted("- (none reported)"));
                                        return [2 /*return*/];
                                    }
                                    for (_i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
                                        c = commands_1[_i];
                                        runtime_js_1.defaultRuntime.log("- ".concat(c));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("list")
        .description("List pending and paired nodes")
        .option("--connected", "Only show connected nodes")
        .option("--last-connected <duration>", "Only show nodes connected within duration (e.g. 24h)")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("list", function () { return __awaiter(_this, void 0, void 0, function () {
                        var connectedOnly, sinceMs, result, _a, pending, paired, _b, heading, muted, warn, tableWidth, now, hasFilters, pendingRows, connectedById, _c, _d, _e, filteredPaired, filteredLabel, pendingRowsRendered, pairedRows;
                        var _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    connectedOnly = Boolean(opts.connected);
                                    sinceMs = parseSinceMs(opts.lastConnected, "Invalid --last-connected");
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.pair.list", opts, {})];
                                case 1:
                                    result = _g.sent();
                                    _a = (0, format_js_1.parsePairingList)(result), pending = _a.pending, paired = _a.paired;
                                    _b = (0, cli_utils_js_1.getNodesTheme)(), heading = _b.heading, muted = _b.muted, warn = _b.warn;
                                    tableWidth = Math.max(60, ((_f = process.stdout.columns) !== null && _f !== void 0 ? _f : 120) - 1);
                                    now = Date.now();
                                    hasFilters = connectedOnly || sinceMs !== undefined;
                                    pendingRows = hasFilters ? [] : pending;
                                    if (!hasFilters) return [3 /*break*/, 3];
                                    _d = Map.bind;
                                    _e = format_js_1.parseNodeList;
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.list", opts, {})];
                                case 2:
                                    _c = new (_d.apply(Map, [void 0, _e.apply(void 0, [_g.sent()]).map(function (node) { return [
                                            node.nodeId,
                                            node,
                                        ]; })]))();
                                    return [3 /*break*/, 4];
                                case 3:
                                    _c = null;
                                    _g.label = 4;
                                case 4:
                                    connectedById = _c;
                                    filteredPaired = paired.filter(function (node) {
                                        if (connectedOnly) {
                                            var live = connectedById === null || connectedById === void 0 ? void 0 : connectedById.get(node.nodeId);
                                            if (!(live === null || live === void 0 ? void 0 : live.connected)) {
                                                return false;
                                            }
                                        }
                                        if (sinceMs !== undefined) {
                                            var live = connectedById === null || connectedById === void 0 ? void 0 : connectedById.get(node.nodeId);
                                            var lastConnectedAtMs = typeof node.lastConnectedAtMs === "number"
                                                ? node.lastConnectedAtMs
                                                : typeof (live === null || live === void 0 ? void 0 : live.connectedAtMs) === "number"
                                                    ? live.connectedAtMs
                                                    : undefined;
                                            if (typeof lastConnectedAtMs !== "number") {
                                                return false;
                                            }
                                            if (now - lastConnectedAtMs > sinceMs) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    });
                                    filteredLabel = hasFilters && filteredPaired.length !== paired.length ? " (of ".concat(paired.length, ")") : "";
                                    runtime_js_1.defaultRuntime.log("Pending: ".concat(pendingRows.length, " \u00B7 Paired: ").concat(filteredPaired.length).concat(filteredLabel));
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify({ pending: pendingRows, paired: filteredPaired }, null, 2));
                                        return [2 /*return*/];
                                    }
                                    if (pendingRows.length > 0) {
                                        pendingRowsRendered = pendingRows.map(function (r) {
                                            var _a, _b;
                                            return ({
                                                Request: r.requestId,
                                                Node: ((_a = r.displayName) === null || _a === void 0 ? void 0 : _a.trim()) ? r.displayName.trim() : r.nodeId,
                                                IP: (_b = r.remoteIp) !== null && _b !== void 0 ? _b : "",
                                                Requested: typeof r.ts === "number"
                                                    ? "".concat((0, format_js_1.formatAge)(Math.max(0, now - r.ts)), " ago")
                                                    : muted("unknown"),
                                                Repair: r.isRepair ? warn("yes") : "",
                                            });
                                        });
                                        runtime_js_1.defaultRuntime.log("");
                                        runtime_js_1.defaultRuntime.log(heading("Pending"));
                                        runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                                            width: tableWidth,
                                            columns: [
                                                { key: "Request", header: "Request", minWidth: 8 },
                                                { key: "Node", header: "Node", minWidth: 14, flex: true },
                                                { key: "IP", header: "IP", minWidth: 10 },
                                                { key: "Requested", header: "Requested", minWidth: 12 },
                                                { key: "Repair", header: "Repair", minWidth: 6 },
                                            ],
                                            rows: pendingRowsRendered,
                                        }).trimEnd());
                                    }
                                    if (filteredPaired.length > 0) {
                                        pairedRows = filteredPaired.map(function (n) {
                                            var _a, _b;
                                            var live = connectedById === null || connectedById === void 0 ? void 0 : connectedById.get(n.nodeId);
                                            var lastConnectedAtMs = typeof n.lastConnectedAtMs === "number"
                                                ? n.lastConnectedAtMs
                                                : typeof (live === null || live === void 0 ? void 0 : live.connectedAtMs) === "number"
                                                    ? live.connectedAtMs
                                                    : undefined;
                                            return {
                                                Node: ((_a = n.displayName) === null || _a === void 0 ? void 0 : _a.trim()) ? n.displayName.trim() : n.nodeId,
                                                Id: n.nodeId,
                                                IP: (_b = n.remoteIp) !== null && _b !== void 0 ? _b : "",
                                                LastConnect: typeof lastConnectedAtMs === "number"
                                                    ? "".concat((0, format_js_1.formatAge)(Math.max(0, now - lastConnectedAtMs)), " ago")
                                                    : muted("unknown"),
                                            };
                                        });
                                        runtime_js_1.defaultRuntime.log("");
                                        runtime_js_1.defaultRuntime.log(heading("Paired"));
                                        runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                                            width: tableWidth,
                                            columns: [
                                                { key: "Node", header: "Node", minWidth: 14, flex: true },
                                                { key: "Id", header: "ID", minWidth: 10 },
                                                { key: "IP", header: "IP", minWidth: 10 },
                                                { key: "LastConnect", header: "Last Connect", minWidth: 14 },
                                            ],
                                            rows: pairedRows,
                                        }).trimEnd());
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
}
