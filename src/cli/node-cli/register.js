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
exports.registerNodeCli = registerNodeCli;
var config_js_1 = require("../../node-host/config.js");
var runner_js_1 = require("../../node-host/runner.js");
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var shared_js_1 = require("../daemon-cli/shared.js");
var daemon_js_1 = require("./daemon.js");
function parsePortWithFallback(value, fallback) {
    var parsed = (0, shared_js_1.parsePort)(value);
    return parsed !== null && parsed !== void 0 ? parsed : fallback;
}
function registerNodeCli(program) {
    var _this = this;
    var node = program
        .command("node")
        .description("Run a headless node host (system.run/system.which)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/node", "docs.openclaw.ai/cli/node"), "\n");
    });
    node
        .command("run")
        .description("Run the headless node host (foreground)")
        .option("--host <host>", "Gateway host")
        .option("--port <port>", "Gateway port")
        .option("--tls", "Use TLS for the gateway connection", false)
        .option("--tls-fingerprint <sha256>", "Expected TLS certificate fingerprint (sha256)")
        .option("--node-id <id>", "Override node id (clears pairing token)")
        .option("--display-name <name>", "Override node display name")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var existing, host, port;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, config_js_1.loadNodeHostConfig)()];
                case 1:
                    existing = _e.sent();
                    host = ((_a = opts.host) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = existing === null || existing === void 0 ? void 0 : existing.gateway) === null || _b === void 0 ? void 0 : _b.host) || "127.0.0.1";
                    port = parsePortWithFallback(opts.port, (_d = (_c = existing === null || existing === void 0 ? void 0 : existing.gateway) === null || _c === void 0 ? void 0 : _c.port) !== null && _d !== void 0 ? _d : 18789);
                    return [4 /*yield*/, (0, runner_js_1.runNodeHost)({
                            gatewayHost: host,
                            gatewayPort: port,
                            gatewayTls: Boolean(opts.tls) || Boolean(opts.tlsFingerprint),
                            gatewayTlsFingerprint: opts.tlsFingerprint,
                            nodeId: opts.nodeId,
                            displayName: opts.displayName,
                        })];
                case 2:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    node
        .command("status")
        .description("Show node host status")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_js_1.runNodeDaemonStatus)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    node
        .command("install")
        .description("Install the node host service (launchd/systemd/schtasks)")
        .option("--host <host>", "Gateway host")
        .option("--port <port>", "Gateway port")
        .option("--tls", "Use TLS for the gateway connection", false)
        .option("--tls-fingerprint <sha256>", "Expected TLS certificate fingerprint (sha256)")
        .option("--node-id <id>", "Override node id (clears pairing token)")
        .option("--display-name <name>", "Override node display name")
        .option("--runtime <runtime>", "Service runtime (node|bun). Default: node")
        .option("--force", "Reinstall/overwrite if already installed", false)
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_js_1.runNodeDaemonInstall)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    node
        .command("uninstall")
        .description("Uninstall the node host service (launchd/systemd/schtasks)")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_js_1.runNodeDaemonUninstall)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    node
        .command("stop")
        .description("Stop the node host service (launchd/systemd/schtasks)")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_js_1.runNodeDaemonStop)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    node
        .command("restart")
        .description("Restart the node host service (launchd/systemd/schtasks)")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, daemon_js_1.runNodeDaemonRestart)(opts)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
