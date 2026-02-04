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
exports.registerPairingCli = registerPairingCli;
var index_js_1 = require("../channels/plugins/index.js");
var pairing_js_1 = require("../channels/plugins/pairing.js");
var config_js_1 = require("../config/config.js");
var pairing_labels_js_1 = require("../pairing/pairing-labels.js");
var pairing_store_js_1 = require("../pairing/pairing-store.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
var command_format_js_1 = require("./command-format.js");
/** Parse channel, allowing extension channels not in core registry. */
function parseChannel(raw, channels) {
    var value = (typeof raw === "string"
        ? raw
        : typeof raw === "number" || typeof raw === "boolean"
            ? String(raw)
            : "")
        .trim()
        .toLowerCase();
    if (!value) {
        throw new Error("Channel required");
    }
    var normalized = (0, index_js_1.normalizeChannelId)(value);
    if (normalized) {
        if (!channels.includes(normalized)) {
            throw new Error("Channel ".concat(normalized, " does not support pairing"));
        }
        return normalized;
    }
    // Allow extension channels: validate format but don't require registry
    if (/^[a-z][a-z0-9_-]{0,63}$/.test(value)) {
        return value;
    }
    throw new Error("Invalid channel: ".concat(value));
}
function notifyApproved(channel, id) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    return [4 /*yield*/, (0, pairing_js_1.notifyPairingApproved)({ channelId: channel, id: id, cfg: cfg })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function registerPairingCli(program) {
    var _this = this;
    var channels = (0, pairing_js_1.listPairingChannels)();
    var pairing = program
        .command("pairing")
        .description("Secure DM pairing (approve inbound requests)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/pairing", "docs.openclaw.ai/cli/pairing"), "\n");
    });
    pairing
        .command("list")
        .description("List pending pairing requests")
        .option("--channel <channel>", "Channel (".concat(channels.join(", "), ")"))
        .argument("[channel]", "Channel (".concat(channels.join(", "), ")"))
        .option("--json", "Print JSON", false)
        .action(function (channelArg, opts) { return __awaiter(_this, void 0, void 0, function () {
        var channelRaw, channel, requests, idLabel, tableWidth;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    channelRaw = (_a = opts.channel) !== null && _a !== void 0 ? _a : channelArg;
                    if (!channelRaw) {
                        throw new Error("Channel required. Use --channel <channel> or pass it as the first argument (expected one of: ".concat(channels.join(", "), ")"));
                    }
                    channel = parseChannel(channelRaw, channels);
                    return [4 /*yield*/, (0, pairing_store_js_1.listChannelPairingRequests)(channel)];
                case 1:
                    requests = _c.sent();
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify({ channel: channel, requests: requests }, null, 2));
                        return [2 /*return*/];
                    }
                    if (requests.length === 0) {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("No pending ".concat(channel, " pairing requests.")));
                        return [2 /*return*/];
                    }
                    idLabel = (0, pairing_labels_js_1.resolvePairingIdLabel)(channel);
                    tableWidth = Math.max(60, ((_b = process.stdout.columns) !== null && _b !== void 0 ? _b : 120) - 1);
                    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.heading("Pairing requests"), " ").concat(theme_js_1.theme.muted("(".concat(requests.length, ")"))));
                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "Code", header: "Code", minWidth: 10 },
                            { key: "ID", header: idLabel, minWidth: 12, flex: true },
                            { key: "Meta", header: "Meta", minWidth: 8, flex: true },
                            { key: "Requested", header: "Requested", minWidth: 12 },
                        ],
                        rows: requests.map(function (r) { return ({
                            Code: r.code,
                            ID: r.id,
                            Meta: r.meta ? JSON.stringify(r.meta) : "",
                            Requested: r.createdAt,
                        }); }),
                    }).trimEnd());
                    return [2 /*return*/];
            }
        });
    }); });
    pairing
        .command("approve")
        .description("Approve a pairing code and allow that sender")
        .option("--channel <channel>", "Channel (".concat(channels.join(", "), ")"))
        .argument("<codeOrChannel>", "Pairing code (or channel when using 2 args)")
        .argument("[code]", "Pairing code (when channel is passed as the 1st arg)")
        .option("--notify", "Notify the requester on the same channel", false)
        .action(function (codeOrChannel, code, opts) { return __awaiter(_this, void 0, void 0, function () {
        var channelRaw, resolvedCode, channel, approved;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    channelRaw = (_a = opts.channel) !== null && _a !== void 0 ? _a : codeOrChannel;
                    resolvedCode = opts.channel ? codeOrChannel : code;
                    if (!opts.channel && !code) {
                        throw new Error("Usage: ".concat((0, command_format_js_1.formatCliCommand)("openclaw pairing approve <channel> <code>"), " (or: ").concat((0, command_format_js_1.formatCliCommand)("openclaw pairing approve --channel <channel> <code>"), ")"));
                    }
                    if (opts.channel && code != null) {
                        throw new Error("Too many arguments. Use: ".concat((0, command_format_js_1.formatCliCommand)("openclaw pairing approve --channel <channel> <code>")));
                    }
                    channel = parseChannel(channelRaw, channels);
                    return [4 /*yield*/, (0, pairing_store_js_1.approveChannelPairingCode)({
                            channel: channel,
                            code: String(resolvedCode),
                        })];
                case 1:
                    approved = _b.sent();
                    if (!approved) {
                        throw new Error("No pending pairing request found for code: ".concat(String(resolvedCode)));
                    }
                    runtime_js_1.defaultRuntime.log("".concat(theme_js_1.theme.success("Approved"), " ").concat(theme_js_1.theme.muted(channel), " sender ").concat(theme_js_1.theme.command(approved.id), "."));
                    if (!opts.notify) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, notifyApproved(channel, approved.id).catch(function (err) {
                            runtime_js_1.defaultRuntime.log(theme_js_1.theme.warn("Failed to notify requester: ".concat(String(err))));
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
