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
exports.formatGatewayChannelsStatusLines = formatGatewayChannelsStatusLines;
exports.channelsStatusCommand = channelsStatusCommand;
var index_js_1 = require("../../channels/plugins/index.js");
var status_js_1 = require("../../channels/plugins/status.js");
var command_format_js_1 = require("../../cli/command-format.js");
var progress_js_1 = require("../../cli/progress.js");
var config_js_1 = require("../../config/config.js");
var call_js_1 = require("../../gateway/call.js");
var channel_summary_js_1 = require("../../infra/channel-summary.js");
var channels_status_issues_js_1 = require("../../infra/channels-status-issues.js");
var runtime_js_1 = require("../../runtime.js");
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var shared_js_1 = require("./shared.js");
function formatGatewayChannelsStatusLines(payload) {
    var lines = [];
    lines.push(theme_js_1.theme.success("Gateway reachable."));
    var accountLines = function (provider, accounts) {
        return accounts.map(function (account) {
            var _a;
            var bits = [];
            if (typeof account.enabled === "boolean") {
                bits.push(account.enabled ? "enabled" : "disabled");
            }
            if (typeof account.configured === "boolean") {
                bits.push(account.configured ? "configured" : "not configured");
            }
            if (typeof account.linked === "boolean") {
                bits.push(account.linked ? "linked" : "not linked");
            }
            if (typeof account.running === "boolean") {
                bits.push(account.running ? "running" : "stopped");
            }
            if (typeof account.connected === "boolean") {
                bits.push(account.connected ? "connected" : "disconnected");
            }
            var inboundAt = typeof account.lastInboundAt === "number" && Number.isFinite(account.lastInboundAt)
                ? account.lastInboundAt
                : null;
            var outboundAt = typeof account.lastOutboundAt === "number" && Number.isFinite(account.lastOutboundAt)
                ? account.lastOutboundAt
                : null;
            if (inboundAt) {
                bits.push("in:".concat((0, channel_summary_js_1.formatAge)(Date.now() - inboundAt)));
            }
            if (outboundAt) {
                bits.push("out:".concat((0, channel_summary_js_1.formatAge)(Date.now() - outboundAt)));
            }
            if (typeof account.mode === "string" && account.mode.length > 0) {
                bits.push("mode:".concat(account.mode));
            }
            var botUsername = (function () {
                var _a, _b, _c;
                var bot = account.bot;
                var probeBot = (_a = account.probe) === null || _a === void 0 ? void 0 : _a.bot;
                var raw = (_c = (_b = bot === null || bot === void 0 ? void 0 : bot.username) !== null && _b !== void 0 ? _b : probeBot === null || probeBot === void 0 ? void 0 : probeBot.username) !== null && _c !== void 0 ? _c : "";
                if (typeof raw !== "string") {
                    return "";
                }
                var trimmed = raw.trim();
                if (!trimmed) {
                    return "";
                }
                return trimmed.startsWith("@") ? trimmed : "@".concat(trimmed);
            })();
            if (botUsername) {
                bits.push("bot:".concat(botUsername));
            }
            if (typeof account.dmPolicy === "string" && account.dmPolicy.length > 0) {
                bits.push("dm:".concat(account.dmPolicy));
            }
            if (Array.isArray(account.allowFrom) && account.allowFrom.length > 0) {
                bits.push("allow:".concat(account.allowFrom.slice(0, 2).join(",")));
            }
            if (typeof account.tokenSource === "string" && account.tokenSource) {
                bits.push("token:".concat(account.tokenSource));
            }
            if (typeof account.botTokenSource === "string" && account.botTokenSource) {
                bits.push("bot:".concat(account.botTokenSource));
            }
            if (typeof account.appTokenSource === "string" && account.appTokenSource) {
                bits.push("app:".concat(account.appTokenSource));
            }
            var application = account.application;
            var messageContent = (_a = application === null || application === void 0 ? void 0 : application.intents) === null || _a === void 0 ? void 0 : _a.messageContent;
            if (typeof messageContent === "string" &&
                messageContent.length > 0 &&
                messageContent !== "enabled") {
                bits.push("intents:content=".concat(messageContent));
            }
            if (account.allowUnmentionedGroups === true) {
                bits.push("groups:unmentioned");
            }
            if (typeof account.baseUrl === "string" && account.baseUrl) {
                bits.push("url:".concat(account.baseUrl));
            }
            var probe = account.probe;
            if (probe && typeof probe.ok === "boolean") {
                bits.push(probe.ok ? "works" : "probe failed");
            }
            var audit = account.audit;
            if (audit && typeof audit.ok === "boolean") {
                bits.push(audit.ok ? "audit ok" : "audit failed");
            }
            if (typeof account.lastError === "string" && account.lastError) {
                bits.push("error:".concat(account.lastError));
            }
            var accountId = typeof account.accountId === "string" ? account.accountId : "default";
            var name = typeof account.name === "string" ? account.name.trim() : "";
            var labelText = (0, shared_js_1.formatChannelAccountLabel)({
                channel: provider,
                accountId: accountId,
                name: name || undefined,
            });
            return "- ".concat(labelText, ": ").concat(bits.join(", "));
        });
    };
    var plugins = (0, index_js_1.listChannelPlugins)();
    var accountsByChannel = payload.channelAccounts;
    var accountPayloads = {};
    for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
        var plugin = plugins_1[_i];
        var raw = accountsByChannel === null || accountsByChannel === void 0 ? void 0 : accountsByChannel[plugin.id];
        if (Array.isArray(raw)) {
            accountPayloads[plugin.id] = raw;
        }
    }
    for (var _a = 0, plugins_2 = plugins; _a < plugins_2.length; _a++) {
        var plugin = plugins_2[_a];
        var accounts = accountPayloads[plugin.id];
        if (accounts && accounts.length > 0) {
            lines.push.apply(lines, accountLines(plugin.id, accounts));
        }
    }
    lines.push("");
    var issues = (0, channels_status_issues_js_1.collectChannelStatusIssues)(payload);
    if (issues.length > 0) {
        lines.push(theme_js_1.theme.warn("Warnings:"));
        for (var _b = 0, issues_1 = issues; _b < issues_1.length; _b++) {
            var issue = issues_1[_b];
            lines.push("- ".concat(issue.channel, " ").concat(issue.accountId, ": ").concat(issue.message).concat(issue.fix ? " (".concat(issue.fix, ")") : ""));
        }
        lines.push("- Run: ".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor")));
        lines.push("");
    }
    lines.push("Tip: ".concat((0, links_js_1.formatDocsLink)("/cli#status", "status --deep"), " adds gateway health probes to status output (requires a reachable gateway)."));
    return lines;
}
function formatConfigChannelsStatusLines(cfg, meta) {
    return __awaiter(this, void 0, void 0, function () {
        var lines, accountLines, plugins, _i, plugins_3, plugin, accountIds, snapshots, _a, accountIds_1, accountId, snapshot;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    lines = [];
                    lines.push(theme_js_1.theme.warn("Gateway not reachable; showing config-only status."));
                    if (meta.path) {
                        lines.push("Config: ".concat(meta.path));
                    }
                    if (meta.mode) {
                        lines.push("Mode: ".concat(meta.mode));
                    }
                    if (meta.path || meta.mode) {
                        lines.push("");
                    }
                    accountLines = function (provider, accounts) {
                        return accounts.map(function (account) {
                            var bits = [];
                            if (typeof account.enabled === "boolean") {
                                bits.push(account.enabled ? "enabled" : "disabled");
                            }
                            if (typeof account.configured === "boolean") {
                                bits.push(account.configured ? "configured" : "not configured");
                            }
                            if (typeof account.linked === "boolean") {
                                bits.push(account.linked ? "linked" : "not linked");
                            }
                            if (typeof account.mode === "string" && account.mode.length > 0) {
                                bits.push("mode:".concat(account.mode));
                            }
                            if (typeof account.tokenSource === "string" && account.tokenSource) {
                                bits.push("token:".concat(account.tokenSource));
                            }
                            if (typeof account.botTokenSource === "string" && account.botTokenSource) {
                                bits.push("bot:".concat(account.botTokenSource));
                            }
                            if (typeof account.appTokenSource === "string" && account.appTokenSource) {
                                bits.push("app:".concat(account.appTokenSource));
                            }
                            if (typeof account.baseUrl === "string" && account.baseUrl) {
                                bits.push("url:".concat(account.baseUrl));
                            }
                            var accountId = typeof account.accountId === "string" ? account.accountId : "default";
                            var name = typeof account.name === "string" ? account.name.trim() : "";
                            var labelText = (0, shared_js_1.formatChannelAccountLabel)({
                                channel: provider,
                                accountId: accountId,
                                name: name || undefined,
                            });
                            return "- ".concat(labelText, ": ").concat(bits.join(", "));
                        });
                    };
                    plugins = (0, index_js_1.listChannelPlugins)();
                    _i = 0, plugins_3 = plugins;
                    _b.label = 1;
                case 1:
                    if (!(_i < plugins_3.length)) return [3 /*break*/, 7];
                    plugin = plugins_3[_i];
                    accountIds = plugin.config.listAccountIds(cfg);
                    if (!accountIds.length) {
                        return [3 /*break*/, 6];
                    }
                    snapshots = [];
                    _a = 0, accountIds_1 = accountIds;
                    _b.label = 2;
                case 2:
                    if (!(_a < accountIds_1.length)) return [3 /*break*/, 5];
                    accountId = accountIds_1[_a];
                    return [4 /*yield*/, (0, status_js_1.buildChannelAccountSnapshot)({
                            plugin: plugin,
                            cfg: cfg,
                            accountId: accountId,
                        })];
                case 3:
                    snapshot = _b.sent();
                    snapshots.push(snapshot);
                    _b.label = 4;
                case 4:
                    _a++;
                    return [3 /*break*/, 2];
                case 5:
                    if (snapshots.length > 0) {
                        lines.push.apply(lines, accountLines(plugin.id, snapshots));
                    }
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    lines.push("");
                    lines.push("Tip: ".concat((0, links_js_1.formatDocsLink)("/cli#status", "status --deep"), " adds gateway health probes to status output (requires a reachable gateway)."));
                    return [2 /*return*/, lines];
            }
        });
    });
}
function channelsStatusCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var timeoutMs, statusLabel, shouldLogStatus, payload, err_1, cfg, snapshot, mode, _a, _b;
        var _this = this;
        var _c, _d;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    timeoutMs = Number((_c = opts.timeout) !== null && _c !== void 0 ? _c : 10000);
                    statusLabel = opts.probe ? "Checking channel status (probe)…" : "Checking channel status…";
                    shouldLogStatus = opts.json !== true && !process.stderr.isTTY;
                    if (shouldLogStatus) {
                        runtime.log(statusLabel);
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 7]);
                    return [4 /*yield*/, (0, progress_js_1.withProgress)({
                            label: statusLabel,
                            indeterminate: true,
                            enabled: opts.json !== true,
                        }, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, call_js_1.callGateway)({
                                            method: "channels.status",
                                            params: { probe: Boolean(opts.probe), timeoutMs: timeoutMs },
                                            timeoutMs: timeoutMs,
                                        })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2:
                    payload = _e.sent();
                    if (opts.json) {
                        runtime.log(JSON.stringify(payload, null, 2));
                        return [2 /*return*/];
                    }
                    runtime.log(formatGatewayChannelsStatusLines(payload).join("\n"));
                    return [3 /*break*/, 7];
                case 3:
                    err_1 = _e.sent();
                    runtime.error("Gateway not reachable: ".concat(String(err_1)));
                    return [4 /*yield*/, (0, shared_js_1.requireValidConfig)(runtime)];
                case 4:
                    cfg = _e.sent();
                    if (!cfg) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 5:
                    snapshot = _e.sent();
                    mode = ((_d = cfg.gateway) === null || _d === void 0 ? void 0 : _d.mode) === "remote" ? "remote" : "local";
                    _b = (_a = runtime).log;
                    return [4 /*yield*/, formatConfigChannelsStatusLines(cfg, {
                            path: snapshot.path,
                            mode: mode,
                        })];
                case 6:
                    _b.apply(_a, [(_e.sent()).join("\n")]);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
