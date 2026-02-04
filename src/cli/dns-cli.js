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
exports.registerDnsCli = registerDnsCli;
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var config_js_1 = require("../config/config.js");
var tailnet_js_1 = require("../infra/tailnet.js");
var widearea_dns_js_1 = require("../infra/widearea-dns.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
function run(cmd, args, opts) {
    var _a;
    var res = (0, node_child_process_1.spawnSync)(cmd, args, {
        encoding: "utf-8",
        stdio: (opts === null || opts === void 0 ? void 0 : opts.inherit) ? "inherit" : "pipe",
    });
    if (res.error) {
        throw res.error;
    }
    if (!(opts === null || opts === void 0 ? void 0 : opts.allowFailure) && res.status !== 0) {
        var errText = typeof res.stderr === "string" && res.stderr.trim()
            ? res.stderr.trim()
            : "exit ".concat((_a = res.status) !== null && _a !== void 0 ? _a : "unknown");
        throw new Error("".concat(cmd, " ").concat(args.join(" "), " failed: ").concat(errText));
    }
    return typeof res.stdout === "string" ? res.stdout : "";
}
function writeFileSudoIfNeeded(filePath, content) {
    var _a;
    try {
        node_fs_1.default.writeFileSync(filePath, content, "utf-8");
        return;
    }
    catch (err) {
        var code = err.code;
        if (code !== "EACCES" && code !== "EPERM") {
            throw err instanceof Error ? err : new Error(String(err));
        }
    }
    var res = (0, node_child_process_1.spawnSync)("sudo", ["tee", filePath], {
        input: content,
        encoding: "utf-8",
        stdio: ["pipe", "ignore", "inherit"],
    });
    if (res.error) {
        throw res.error;
    }
    if (res.status !== 0) {
        throw new Error("sudo tee ".concat(filePath, " failed: exit ").concat((_a = res.status) !== null && _a !== void 0 ? _a : "unknown"));
    }
}
function mkdirSudoIfNeeded(dirPath) {
    try {
        node_fs_1.default.mkdirSync(dirPath, { recursive: true });
        return;
    }
    catch (err) {
        var code = err.code;
        if (code !== "EACCES" && code !== "EPERM") {
            throw err instanceof Error ? err : new Error(String(err));
        }
    }
    run("sudo", ["mkdir", "-p", dirPath], { inherit: true });
}
function zoneFileNeedsBootstrap(zonePath) {
    if (!node_fs_1.default.existsSync(zonePath)) {
        return true;
    }
    try {
        var content = node_fs_1.default.readFileSync(zonePath, "utf-8");
        return !/\bSOA\b/.test(content) || !/\bNS\b/.test(content);
    }
    catch (_a) {
        return true;
    }
}
function detectBrewPrefix() {
    var out = run("brew", ["--prefix"]);
    var prefix = out.trim();
    if (!prefix) {
        throw new Error("failed to resolve Homebrew prefix");
    }
    return prefix;
}
function ensureImportLine(corefilePath, importGlob) {
    var existing = node_fs_1.default.readFileSync(corefilePath, "utf-8");
    if (existing.includes(importGlob)) {
        return false;
    }
    var next = "".concat(existing.replace(/\s*$/, ""), "\n\nimport ").concat(importGlob, "\n");
    writeFileSudoIfNeeded(corefilePath, next);
    return true;
}
function registerDnsCli(program) {
    var _this = this;
    var dns = program
        .command("dns")
        .description("DNS helpers for wide-area discovery (Tailscale + CoreDNS)")
        .addHelpText("after", function () { return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/dns", "docs.openclaw.ai/cli/dns"), "\n"); });
    dns
        .command("setup")
        .description("Set up CoreDNS to serve your discovery domain for unicast DNS-SD (Wide-Area Bonjour)")
        .option("--domain <domain>", "Wide-area discovery domain (e.g. openclaw.internal)")
        .option("--apply", "Install/update CoreDNS config and (re)start the service (requires sudo)", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var cfg, tailnetIPv4, tailnetIPv6, wideAreaDomain, zonePath, tableWidth, prefix, etcDir, corefilePath, confDir, importGlob, serverPath, bindArgs, server, y, m, d, serial, zoneLines;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    tailnetIPv4 = (0, tailnet_js_1.pickPrimaryTailnetIPv4)();
                    tailnetIPv6 = (0, tailnet_js_1.pickPrimaryTailnetIPv6)();
                    wideAreaDomain = (0, widearea_dns_js_1.resolveWideAreaDiscoveryDomain)({
                        configDomain: (_a = opts.domain) !== null && _a !== void 0 ? _a : (_c = (_b = cfg.discovery) === null || _b === void 0 ? void 0 : _b.wideArea) === null || _c === void 0 ? void 0 : _c.domain,
                    });
                    if (!wideAreaDomain) {
                        throw new Error("No wide-area domain configured. Set discovery.wideArea.domain or pass --domain.");
                    }
                    zonePath = (0, widearea_dns_js_1.getWideAreaZonePath)(wideAreaDomain);
                    tableWidth = Math.max(60, ((_d = process.stdout.columns) !== null && _d !== void 0 ? _d : 120) - 1);
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("DNS setup"));
                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                        width: tableWidth,
                        columns: [
                            { key: "Key", header: "Key", minWidth: 18 },
                            { key: "Value", header: "Value", minWidth: 24, flex: true },
                        ],
                        rows: [
                            { Key: "Domain", Value: wideAreaDomain },
                            { Key: "Zone file", Value: zonePath },
                            {
                                Key: "Tailnet IP",
                                Value: "".concat(tailnetIPv4 !== null && tailnetIPv4 !== void 0 ? tailnetIPv4 : "—").concat(tailnetIPv6 ? " (v6 ".concat(tailnetIPv6, ")") : ""),
                            },
                        ],
                    }).trimEnd());
                    runtime_js_1.defaultRuntime.log("");
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("Recommended ~/.openclaw/openclaw.json:"));
                    runtime_js_1.defaultRuntime.log(JSON.stringify({
                        gateway: { bind: "auto" },
                        discovery: { wideArea: { enabled: true, domain: wideAreaDomain } },
                    }, null, 2));
                    runtime_js_1.defaultRuntime.log("");
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("Tailscale admin (DNS → Nameservers):"));
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("- Add nameserver: ".concat(tailnetIPv4 !== null && tailnetIPv4 !== void 0 ? tailnetIPv4 : "<this machine's tailnet IPv4>")));
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("- Restrict to domain (Split DNS): ".concat(wideAreaDomain.replace(/\.$/, ""))));
                    if (!opts.apply) {
                        runtime_js_1.defaultRuntime.log("");
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Run with --apply to install CoreDNS and configure it."));
                        return [2 /*return*/];
                    }
                    if (process.platform !== "darwin") {
                        throw new Error("dns setup is currently supported on macOS only");
                    }
                    if (!tailnetIPv4 && !tailnetIPv6) {
                        throw new Error("no tailnet IP detected; ensure Tailscale is running on this machine");
                    }
                    prefix = detectBrewPrefix();
                    etcDir = node_path_1.default.join(prefix, "etc", "coredns");
                    corefilePath = node_path_1.default.join(etcDir, "Corefile");
                    confDir = node_path_1.default.join(etcDir, "conf.d");
                    importGlob = node_path_1.default.join(confDir, "*.server");
                    serverPath = node_path_1.default.join(confDir, "".concat(wideAreaDomain.replace(/\.$/, ""), ".server"));
                    run("brew", ["list", "coredns"], { allowFailure: true });
                    run("brew", ["install", "coredns"], {
                        inherit: true,
                        allowFailure: true,
                    });
                    mkdirSudoIfNeeded(confDir);
                    if (!node_fs_1.default.existsSync(corefilePath)) {
                        writeFileSudoIfNeeded(corefilePath, "import ".concat(importGlob, "\n"));
                    }
                    else {
                        ensureImportLine(corefilePath, importGlob);
                    }
                    bindArgs = [tailnetIPv4, tailnetIPv6].filter(function (v) { return Boolean(v === null || v === void 0 ? void 0 : v.trim()); });
                    server = [
                        "".concat(wideAreaDomain.replace(/\.$/, ""), ":53 {"),
                        "  bind ".concat(bindArgs.join(" ")),
                        "  file ".concat(zonePath, " {"),
                        "    reload 10s",
                        "  }",
                        "  errors",
                        "  log",
                        "}",
                        "",
                    ].join("\n");
                    writeFileSudoIfNeeded(serverPath, server);
                    // Ensure the gateway can write its zone file path.
                    return [4 /*yield*/, node_fs_1.default.promises.mkdir(node_path_1.default.dirname(zonePath), { recursive: true })];
                case 1:
                    // Ensure the gateway can write its zone file path.
                    _g.sent();
                    if (zoneFileNeedsBootstrap(zonePath)) {
                        y = new Date().getUTCFullYear();
                        m = String(new Date().getUTCMonth() + 1).padStart(2, "0");
                        d = String(new Date().getUTCDate()).padStart(2, "0");
                        serial = "".concat(y).concat(m).concat(d, "01");
                        zoneLines = [
                            "; created by openclaw dns setup (will be overwritten by the gateway when wide-area discovery is enabled)",
                            "$ORIGIN ".concat(wideAreaDomain),
                            "$TTL 60",
                            "@ IN SOA ns1 hostmaster ".concat(serial, " 7200 3600 1209600 60"),
                            "@ IN NS ns1",
                            tailnetIPv4 ? "ns1 IN A ".concat(tailnetIPv4) : null,
                            tailnetIPv6 ? "ns1 IN AAAA ".concat(tailnetIPv6) : null,
                            "",
                        ].filter(function (line) { return Boolean(line); });
                        node_fs_1.default.writeFileSync(zonePath, zoneLines.join("\n"), "utf-8");
                    }
                    runtime_js_1.defaultRuntime.log("");
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.heading("Starting CoreDNS (sudo)…"));
                    run("sudo", ["brew", "services", "restart", "coredns"], {
                        inherit: true,
                    });
                    if (((_f = (_e = cfg.discovery) === null || _e === void 0 ? void 0 : _e.wideArea) === null || _f === void 0 ? void 0 : _f.enabled) !== true) {
                        runtime_js_1.defaultRuntime.log("");
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Note: enable discovery.wideArea.enabled in ~/.openclaw/openclaw.json on the gateway and restart the gateway so it writes the DNS-SD zone."));
                    }
                    return [2 /*return*/];
            }
        });
    }); });
}
