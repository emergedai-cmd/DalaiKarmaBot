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
exports.registerGatewayCli = registerGatewayCli;
var gateway_status_js_1 = require("../../commands/gateway-status.js");
var health_js_1 = require("../../commands/health.js");
var config_js_1 = require("../../config/config.js");
var bonjour_discovery_js_1 = require("../../infra/bonjour-discovery.js");
var widearea_dns_js_1 = require("../../infra/widearea-dns.js");
var runtime_js_1 = require("../../runtime.js");
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var usage_format_js_1 = require("../../utils/usage-format.js");
var cli_utils_js_1 = require("../cli-utils.js");
var daemon_cli_js_1 = require("../daemon-cli.js");
var progress_js_1 = require("../progress.js");
var call_js_1 = require("./call.js");
var discover_js_1 = require("./discover.js");
var run_js_1 = require("./run.js");
function styleHealthChannelLine(line, rich) {
    if (!rich) {
        return line;
    }
    var colon = line.indexOf(":");
    if (colon === -1) {
        return line;
    }
    var label = line.slice(0, colon + 1);
    var detail = line.slice(colon + 1).trimStart();
    var normalized = detail.toLowerCase();
    var applyPrefix = function (prefix, color) {
        return "".concat(label, " ").concat(color(detail.slice(0, prefix.length))).concat(detail.slice(prefix.length));
    };
    if (normalized.startsWith("failed")) {
        return applyPrefix("failed", theme_js_1.theme.error);
    }
    if (normalized.startsWith("ok")) {
        return applyPrefix("ok", theme_js_1.theme.success);
    }
    if (normalized.startsWith("linked")) {
        return applyPrefix("linked", theme_js_1.theme.success);
    }
    if (normalized.startsWith("configured")) {
        return applyPrefix("configured", theme_js_1.theme.success);
    }
    if (normalized.startsWith("not linked")) {
        return applyPrefix("not linked", theme_js_1.theme.warn);
    }
    if (normalized.startsWith("not configured")) {
        return applyPrefix("not configured", theme_js_1.theme.muted);
    }
    if (normalized.startsWith("unknown")) {
        return applyPrefix("unknown", theme_js_1.theme.warn);
    }
    return line;
}
function runGatewayCommand(action, label) {
    return (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, action, function (err) {
        var message = String(err);
        runtime_js_1.defaultRuntime.error(label ? "".concat(label, ": ").concat(message) : message);
        runtime_js_1.defaultRuntime.exit(1);
    });
}
function parseDaysOption(raw, fallback) {
    if (fallback === void 0) { fallback = 30; }
    if (typeof raw === "number" && Number.isFinite(raw)) {
        return Math.max(1, Math.floor(raw));
    }
    if (typeof raw === "string" && raw.trim() !== "") {
        var parsed = Number(raw);
        if (Number.isFinite(parsed)) {
            return Math.max(1, Math.floor(parsed));
        }
    }
    return fallback;
}
function renderCostUsageSummary(summary, days, rich) {
    var _a, _b, _c, _d;
    var totalCost = (_a = (0, usage_format_js_1.formatUsd)(summary.totals.totalCost)) !== null && _a !== void 0 ? _a : "$0.00";
    var totalTokens = (_b = (0, usage_format_js_1.formatTokenCount)(summary.totals.totalTokens)) !== null && _b !== void 0 ? _b : "0";
    var lines = [
        (0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Usage cost (".concat(days, " days)")),
        "".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "Total:"), " ").concat(totalCost, " \u00B7 ").concat(totalTokens, " tokens"),
    ];
    if (summary.totals.missingCostEntries > 0) {
        lines.push("".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "Missing entries:"), " ").concat(summary.totals.missingCostEntries));
    }
    var latest = summary.daily.at(-1);
    if (latest) {
        var latestCost = (_c = (0, usage_format_js_1.formatUsd)(latest.totalCost)) !== null && _c !== void 0 ? _c : "$0.00";
        var latestTokens = (_d = (0, usage_format_js_1.formatTokenCount)(latest.totalTokens)) !== null && _d !== void 0 ? _d : "0";
        lines.push("".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "Latest day:"), " ").concat(latest.date, " \u00B7 ").concat(latestCost, " \u00B7 ").concat(latestTokens, " tokens"));
    }
    return lines;
}
function registerGatewayCli(program) {
    var _this = this;
    var gateway = (0, run_js_1.addGatewayRunCommand)(program
        .command("gateway")
        .description("Run the WebSocket Gateway")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/gateway", "docs.openclaw.ai/cli/gateway"), "\n");
    }));
    (0, run_js_1.addGatewayRunCommand)(gateway.command("run").description("Run the WebSocket Gateway (foreground)"));
    gateway
        .command("status")
        .description("Show gateway service status + probe the Gateway")
        .option("--url <url>", "Gateway WebSocket URL (defaults to config/remote/local)")
        .option("--token <token>", "Gateway token (if required)")
        .option("--password <password>", "Gateway password (password auth)")
        .option("--timeout <ms>", "Timeout in ms", "10000")
        .option("--no-probe", "Skip RPC probe")
        .option("--deep", "Scan system-level services", false)
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_cli_js_1.runDaemonStatus)({
                        rpc: opts,
                        probe: Boolean(opts.probe),
                        deep: Boolean(opts.deep),
                        json: Boolean(opts.json),
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    gateway
        .command("install")
        .description("Install the Gateway service (launchd/systemd/schtasks)")
        .option("--port <port>", "Gateway port")
        .option("--runtime <runtime>", "Daemon runtime (node|bun). Default: node")
        .option("--token <token>", "Gateway token (token auth)")
        .option("--force", "Reinstall/overwrite if already installed", false)
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_cli_js_1.runDaemonInstall)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    gateway
        .command("uninstall")
        .description("Uninstall the Gateway service (launchd/systemd/schtasks)")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_cli_js_1.runDaemonUninstall)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    gateway
        .command("start")
        .description("Start the Gateway service (launchd/systemd/schtasks)")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_cli_js_1.runDaemonStart)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    gateway
        .command("stop")
        .description("Stop the Gateway service (launchd/systemd/schtasks)")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_cli_js_1.runDaemonStop)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    gateway
        .command("restart")
        .description("Restart the Gateway service (launchd/systemd/schtasks)")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_cli_js_1.runDaemonRestart)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, call_js_1.gatewayCallOpts)(gateway
        .command("call")
        .description("Call a Gateway method")
        .argument("<method>", "Method name (health/status/system-presence/cron.*)")
        .option("--params <json>", "JSON object string for params", "{}")
        .action(function (method, opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGatewayCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        var params, result, rich;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    params = JSON.parse(String((_a = opts.params) !== null && _a !== void 0 ? _a : "{}"));
                                    return [4 /*yield*/, (0, call_js_1.callGatewayCli)(method, opts, params)];
                                case 1:
                                    result = _b.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                        return [2 /*return*/];
                                    }
                                    rich = (0, theme_js_1.isRich)();
                                    runtime_js_1.defaultRuntime.log("".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Gateway call"), ": ").concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, String(method))));
                                    runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                    return [2 /*return*/];
                            }
                        });
                    }); }, "Gateway call failed")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, call_js_1.gatewayCallOpts)(gateway
        .command("usage-cost")
        .description("Fetch usage cost summary from session logs")
        .option("--days <days>", "Number of days to include", "30")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGatewayCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        var days, result, rich, summary, _i, _a, line;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    days = parseDaysOption(opts.days);
                                    return [4 /*yield*/, (0, call_js_1.callGatewayCli)("usage.cost", opts, { days: days })];
                                case 1:
                                    result = _b.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                        return [2 /*return*/];
                                    }
                                    rich = (0, theme_js_1.isRich)();
                                    summary = result;
                                    for (_i = 0, _a = renderCostUsageSummary(summary, days, rich); _i < _a.length; _i++) {
                                        line = _a[_i];
                                        runtime_js_1.defaultRuntime.log(line);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }, "Gateway usage cost failed")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, call_js_1.gatewayCallOpts)(gateway
        .command("health")
        .description("Fetch Gateway health")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGatewayCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        var result, rich, obj, durationMs, _i, _a, line;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, call_js_1.callGatewayCli)("health", opts)];
                                case 1:
                                    result = _b.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                        return [2 /*return*/];
                                    }
                                    rich = (0, theme_js_1.isRich)();
                                    obj = result && typeof result === "object" ? result : {};
                                    durationMs = typeof obj.durationMs === "number" ? obj.durationMs : null;
                                    runtime_js_1.defaultRuntime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Gateway Health"));
                                    runtime_js_1.defaultRuntime.log("".concat((0, theme_js_1.colorize)(rich, theme_js_1.theme.success, "OK")).concat(durationMs != null ? " (".concat(durationMs, "ms)") : ""));
                                    if (obj.channels && typeof obj.channels === "object") {
                                        for (_i = 0, _a = (0, health_js_1.formatHealthChannelLines)(obj); _i < _a.length; _i++) {
                                            line = _a[_i];
                                            runtime_js_1.defaultRuntime.log(styleHealthChannelLine(line, rich));
                                        }
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
    gateway
        .command("probe")
        .description("Show gateway reachability + discovery + health + status summary (local + remote)")
        .option("--url <url>", "Explicit Gateway WebSocket URL (still probes localhost)")
        .option("--ssh <target>", "SSH target for remote gateway tunnel (user@host or user@host:port)")
        .option("--ssh-identity <path>", "SSH identity file path")
        .option("--ssh-auto", "Try to derive an SSH target from Bonjour discovery", false)
        .option("--token <token>", "Gateway token (applies to all probes)")
        .option("--password <password>", "Gateway password (applies to all probes)")
        .option("--timeout <ms>", "Overall probe budget in ms", "3000")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGatewayCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, gateway_status_js_1.gatewayStatusCommand)(opts, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    gateway
        .command("discover")
        .description("Discover gateways via Bonjour (local + wide-area if configured)")
        .option("--timeout <ms>", "Per-command timeout in ms", "2000")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runGatewayCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        var cfg, wideAreaDomain, timeoutMs, domains, beacons, deduped, enriched, rich, _i, deduped_1, beacon, _a, _b, line;
                        var _this = this;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    cfg = (0, config_js_1.loadConfig)();
                                    wideAreaDomain = (0, widearea_dns_js_1.resolveWideAreaDiscoveryDomain)({
                                        configDomain: (_d = (_c = cfg.discovery) === null || _c === void 0 ? void 0 : _c.wideArea) === null || _d === void 0 ? void 0 : _d.domain,
                                    });
                                    timeoutMs = (0, discover_js_1.parseDiscoverTimeoutMs)(opts.timeout, 2000);
                                    domains = __spreadArray(["local."], (wideAreaDomain ? [wideAreaDomain] : []), true);
                                    return [4 /*yield*/, (0, progress_js_1.withProgress)({
                                            label: "Scanning for gateways…",
                                            indeterminate: true,
                                            enabled: opts.json !== true,
                                            delayMs: 0,
                                        }, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, (0, bonjour_discovery_js_1.discoverGatewayBeacons)({ timeoutMs: timeoutMs, wideAreaDomain: wideAreaDomain })];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        }); }); })];
                                case 1:
                                    beacons = _e.sent();
                                    deduped = (0, discover_js_1.dedupeBeacons)(beacons).toSorted(function (a, b) {
                                        return String(a.displayName || a.instanceName).localeCompare(String(b.displayName || b.instanceName));
                                    });
                                    if (opts.json) {
                                        enriched = deduped.map(function (b) {
                                            var host = (0, discover_js_1.pickBeaconHost)(b);
                                            var port = (0, discover_js_1.pickGatewayPort)(b);
                                            return __assign(__assign({}, b), { wsUrl: host ? "ws://".concat(host, ":").concat(port) : null });
                                        });
                                        runtime_js_1.defaultRuntime.log(JSON.stringify({
                                            timeoutMs: timeoutMs,
                                            domains: domains,
                                            count: enriched.length,
                                            beacons: enriched,
                                        }, null, 2));
                                        return [2 /*return*/];
                                    }
                                    rich = (0, theme_js_1.isRich)();
                                    runtime_js_1.defaultRuntime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, "Gateway Discovery"));
                                    runtime_js_1.defaultRuntime.log((0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, "Found ".concat(deduped.length, " gateway(s) \u00B7 domains: ").concat(domains.join(", "))));
                                    if (deduped.length === 0) {
                                        return [2 /*return*/];
                                    }
                                    for (_i = 0, deduped_1 = deduped; _i < deduped_1.length; _i++) {
                                        beacon = deduped_1[_i];
                                        for (_a = 0, _b = (0, discover_js_1.renderBeaconLines)(beacon, rich); _a < _b.length; _a++) {
                                            line = _b[_a];
                                            runtime_js_1.defaultRuntime.log(line);
                                        }
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }, "gateway discover failed")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
