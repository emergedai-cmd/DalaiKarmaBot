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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDirectoryCli = registerDirectoryCli;
var helpers_js_1 = require("../channels/plugins/helpers.js");
var index_js_1 = require("../channels/plugins/index.js");
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var channel_selection_js_1 = require("../infra/outbound/channel-selection.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
function parseLimit(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        if (value <= 0) {
            return null;
        }
        return Math.floor(value);
    }
    if (typeof value !== "string") {
        return null;
    }
    var raw = value.trim();
    if (!raw) {
        return null;
    }
    var parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}
function buildRows(entries) {
    return entries.map(function (entry) {
        var _a, _b;
        return ({
            ID: entry.id,
            Name: (_b = (_a = entry.name) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "",
        });
    });
}
function registerDirectoryCli(program) {
    var _this = this;
    var directory = program
        .command("directory")
        .description("Directory lookups (self, peers, groups) for channels that support it")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/directory", "docs.openclaw.ai/cli/directory"), "\n");
    })
        .action(function () {
        directory.help({ error: true });
    });
    var withChannel = function (cmd) {
        return cmd
            .option("--channel <name>", "Channel (auto when only one is configured)")
            .option("--account <id>", "Account id (accountId)")
            .option("--json", "Output JSON", false);
    };
    var resolve = function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var cfg, selection, channelId, plugin, accountId;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, channel_selection_js_1.resolveMessageChannelSelection)({
                            cfg: cfg,
                            channel: (_a = opts.channel) !== null && _a !== void 0 ? _a : null,
                        })];
                case 1:
                    selection = _c.sent();
                    channelId = selection.channel;
                    plugin = (0, index_js_1.getChannelPlugin)(channelId);
                    if (!plugin) {
                        throw new Error("Unsupported channel: ".concat(String(channelId)));
                    }
                    accountId = ((_b = opts.account) === null || _b === void 0 ? void 0 : _b.trim()) || (0, helpers_js_1.resolveChannelDefaultAccountId)({ plugin: plugin, cfg: cfg });
                    return [2 /*return*/, { cfg: cfg, channelId: channelId, accountId: accountId, plugin: plugin }];
            }
        });
    }); };
    withChannel(directory.command("self").description("Show the current account user")).action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _a, cfg, channelId, accountId, plugin, fn, result, tableWidth, err_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, resolve({
                            channel: opts.channel,
                            account: opts.account,
                        })];
                case 1:
                    _a = _d.sent(), cfg = _a.cfg, channelId = _a.channelId, accountId = _a.accountId, plugin = _a.plugin;
                    fn = (_b = plugin.directory) === null || _b === void 0 ? void 0 : _b.self;
                    if (!fn) {
                        throw new Error("Channel ".concat(channelId, " does not support directory self"));
                    }
                    return [4 /*yield*/, fn({ cfg: cfg, accountId: accountId, runtime: runtime_js_1.defaultRuntime })];
                case 2:
                    result = _d.sent();
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    if (!result) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Not available."));
                        return [2 /*return*/];
                    }
                    tableWidth = Math.max(60, ((_c = process.stdout.columns) !== null && _c !== void 0 ? _c : 120) - 1);
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("Self"));
                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "ID", header: "ID", minWidth: 16, flex: true },
                            { key: "Name", header: "Name", minWidth: 18, flex: true },
                        ],
                        rows: buildRows([result]),
                    }).trimEnd());
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    var peers = directory.command("peers").description("Peer directory (contacts/users)");
    withChannel(peers.command("list").description("List peers"))
        .option("--query <text>", "Optional search query")
        .option("--limit <n>", "Limit results")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _a, cfg, channelId, accountId, plugin, fn, result, tableWidth, err_2;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, resolve({
                            channel: opts.channel,
                            account: opts.account,
                        })];
                case 1:
                    _a = _e.sent(), cfg = _a.cfg, channelId = _a.channelId, accountId = _a.accountId, plugin = _a.plugin;
                    fn = (_b = plugin.directory) === null || _b === void 0 ? void 0 : _b.listPeers;
                    if (!fn) {
                        throw new Error("Channel ".concat(channelId, " does not support directory peers"));
                    }
                    return [4 /*yield*/, fn({
                            cfg: cfg,
                            accountId: accountId,
                            query: (_c = opts.query) !== null && _c !== void 0 ? _c : null,
                            limit: parseLimit(opts.limit),
                            runtime: runtime_js_1.defaultRuntime,
                        })];
                case 2:
                    result = _e.sent();
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    if (result.length === 0) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("No peers found."));
                        return [2 /*return*/];
                    }
                    tableWidth = Math.max(60, ((_d = process.stdout.columns) !== null && _d !== void 0 ? _d : 120) - 1);
                    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.heading("Peers"), " ").concat(theme_js_1.theme.muted("(".concat(result.length, ")"))));
                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "ID", header: "ID", minWidth: 16, flex: true },
                            { key: "Name", header: "Name", minWidth: 18, flex: true },
                        ],
                        rows: buildRows(result),
                    }).trimEnd());
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _e.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    var groups = directory.command("groups").description("Group directory");
    withChannel(groups.command("list").description("List groups"))
        .option("--query <text>", "Optional search query")
        .option("--limit <n>", "Limit results")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _a, cfg, channelId, accountId, plugin, fn, result, tableWidth, err_3;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, resolve({
                            channel: opts.channel,
                            account: opts.account,
                        })];
                case 1:
                    _a = _e.sent(), cfg = _a.cfg, channelId = _a.channelId, accountId = _a.accountId, plugin = _a.plugin;
                    fn = (_b = plugin.directory) === null || _b === void 0 ? void 0 : _b.listGroups;
                    if (!fn) {
                        throw new Error("Channel ".concat(channelId, " does not support directory groups"));
                    }
                    return [4 /*yield*/, fn({
                            cfg: cfg,
                            accountId: accountId,
                            query: (_c = opts.query) !== null && _c !== void 0 ? _c : null,
                            limit: parseLimit(opts.limit),
                            runtime: runtime_js_1.defaultRuntime,
                        })];
                case 2:
                    result = _e.sent();
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    if (result.length === 0) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("No groups found."));
                        return [2 /*return*/];
                    }
                    tableWidth = Math.max(60, ((_d = process.stdout.columns) !== null && _d !== void 0 ? _d : 120) - 1);
                    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.heading("Groups"), " ").concat(theme_js_1.theme.muted("(".concat(result.length, ")"))));
                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "ID", header: "ID", minWidth: 16, flex: true },
                            { key: "Name", header: "Name", minWidth: 18, flex: true },
                        ],
                        rows: buildRows(result),
                    }).trimEnd());
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _e.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_3)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    withChannel(groups
        .command("members")
        .description("List group members")
        .requiredOption("--group-id <id>", "Group id"))
        .option("--limit <n>", "Limit results")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _a, cfg, channelId, accountId, plugin, fn, groupId, result, tableWidth, err_4;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, resolve({
                            channel: opts.channel,
                            account: opts.account,
                        })];
                case 1:
                    _a = _e.sent(), cfg = _a.cfg, channelId = _a.channelId, accountId = _a.accountId, plugin = _a.plugin;
                    fn = (_b = plugin.directory) === null || _b === void 0 ? void 0 : _b.listGroupMembers;
                    if (!fn) {
                        throw new Error("Channel ".concat(channelId, " does not support group members listing"));
                    }
                    groupId = String((_c = opts.groupId) !== null && _c !== void 0 ? _c : "").trim();
                    if (!groupId) {
                        throw new Error("Missing --group-id");
                    }
                    return [4 /*yield*/, fn({
                            cfg: cfg,
                            accountId: accountId,
                            groupId: groupId,
                            limit: parseLimit(opts.limit),
                            runtime: runtime_js_1.defaultRuntime,
                        })];
                case 2:
                    result = _e.sent();
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    if (result.length === 0) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("No group members found."));
                        return [2 /*return*/];
                    }
                    tableWidth = Math.max(60, ((_d = process.stdout.columns) !== null && _d !== void 0 ? _d : 120) - 1);
                    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.heading("Group Members"), " ").concat(theme_js_1.theme.muted("(".concat(result.length, ")"))));
                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "ID", header: "ID", minWidth: 16, flex: true },
                            { key: "Name", header: "Name", minWidth: 18, flex: true },
                        ],
                        rows: buildRows(result),
                    }).trimEnd());
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _e.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_4)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
