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
exports.discoverGatewayBeacons = discoverGatewayBeacons;
var exec_js_1 = require("../process/exec.js");
var widearea_dns_js_1 = require("./widearea-dns.js");
var DEFAULT_TIMEOUT_MS = 2000;
var GATEWAY_SERVICE_TYPE = "_openclaw-gw._tcp";
function decodeDnsSdEscapes(value) {
    var _a;
    var decoded = false;
    var bytes = [];
    var pending = "";
    var flush = function () {
        if (!pending) {
            return;
        }
        bytes.push.apply(bytes, Buffer.from(pending, "utf8"));
        pending = "";
    };
    for (var i = 0; i < value.length; i += 1) {
        var ch = (_a = value[i]) !== null && _a !== void 0 ? _a : "";
        if (ch === "\\" && i + 3 < value.length) {
            var escaped = value.slice(i + 1, i + 4);
            if (/^[0-9]{3}$/.test(escaped)) {
                var byte = Number.parseInt(escaped, 10);
                if (!Number.isFinite(byte) || byte < 0 || byte > 255) {
                    pending += ch;
                    continue;
                }
                flush();
                bytes.push(byte);
                decoded = true;
                i += 3;
                continue;
            }
        }
        pending += ch;
    }
    if (!decoded) {
        return value;
    }
    flush();
    return Buffer.from(bytes).toString("utf8");
}
function isTailnetIPv4(address) {
    var parts = address.split(".");
    if (parts.length !== 4) {
        return false;
    }
    var octets = parts.map(function (p) { return Number.parseInt(p, 10); });
    if (octets.some(function (n) { return !Number.isFinite(n) || n < 0 || n > 255; })) {
        return false;
    }
    // Tailscale IPv4 range: 100.64.0.0/10
    var a = octets[0], b = octets[1];
    return a === 100 && b >= 64 && b <= 127;
}
function parseDigShortLines(stdout) {
    return stdout
        .split("\n")
        .map(function (l) { return l.trim(); })
        .filter(Boolean);
}
function parseDigTxt(stdout) {
    // dig +short TXT prints one or more lines of quoted strings:
    // "k=v" "k2=v2"
    var tokens = [];
    for (var _i = 0, _a = stdout.split("\n"); _i < _a.length; _i++) {
        var raw = _a[_i];
        var line = raw.trim();
        if (!line) {
            continue;
        }
        var matches = Array.from(line.matchAll(/"([^"]*)"/g), function (m) { var _a; return (_a = m[1]) !== null && _a !== void 0 ? _a : ""; });
        for (var _b = 0, matches_1 = matches; _b < matches_1.length; _b++) {
            var m = matches_1[_b];
            var unescaped = m.replaceAll("\\\\", "\\").replaceAll('\\"', '"').replaceAll("\\n", "\n");
            tokens.push(unescaped);
        }
    }
    return tokens;
}
function parseDigSrv(stdout) {
    var _a, _b;
    // dig +short SRV: "0 0 18790 host.domain."
    var line = stdout
        .split("\n")
        .map(function (l) { return l.trim(); })
        .find(Boolean);
    if (!line) {
        return null;
    }
    var parts = line.split(/\s+/).filter(Boolean);
    if (parts.length < 4) {
        return null;
    }
    var port = Number.parseInt((_a = parts[2]) !== null && _a !== void 0 ? _a : "", 10);
    var hostRaw = (_b = parts[3]) !== null && _b !== void 0 ? _b : "";
    if (!Number.isFinite(port) || port <= 0) {
        return null;
    }
    var host = hostRaw.replace(/\.$/, "");
    if (!host) {
        return null;
    }
    return { host: host, port: port };
}
function parseTailscaleStatusIPv4s(stdout) {
    var parsed = stdout ? JSON.parse(stdout) : {};
    var out = [];
    var addIps = function (value) {
        if (!value || typeof value !== "object") {
            return;
        }
        var ips = value.TailscaleIPs;
        if (!Array.isArray(ips)) {
            return;
        }
        for (var _i = 0, ips_1 = ips; _i < ips_1.length; _i++) {
            var ip = ips_1[_i];
            if (typeof ip !== "string") {
                continue;
            }
            var trimmed = ip.trim();
            if (trimmed && isTailnetIPv4(trimmed)) {
                out.push(trimmed);
            }
        }
    };
    addIps(parsed.Self);
    var peerObj = parsed.Peer;
    if (peerObj && typeof peerObj === "object") {
        for (var _i = 0, _a = Object.values(peerObj); _i < _a.length; _i++) {
            var peer = _a[_i];
            addIps(peer);
        }
    }
    return __spreadArray([], new Set(out), true);
}
function parseIntOrNull(value) {
    if (!value) {
        return undefined;
    }
    var parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
}
function parseTxtTokens(tokens) {
    var txt = {};
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        var idx = token.indexOf("=");
        if (idx <= 0) {
            continue;
        }
        var key = token.slice(0, idx).trim();
        var value = decodeDnsSdEscapes(token.slice(idx + 1).trim());
        if (!key) {
            continue;
        }
        txt[key] = value;
    }
    return txt;
}
function parseDnsSdBrowse(stdout) {
    var instances = new Set();
    for (var _i = 0, _a = stdout.split("\n"); _i < _a.length; _i++) {
        var raw = _a[_i];
        var line = raw.trim();
        if (!line || !line.includes(GATEWAY_SERVICE_TYPE)) {
            continue;
        }
        if (!line.includes("Add")) {
            continue;
        }
        var match = line.match(/_openclaw-gw\._tcp\.?\s+(.+)$/);
        if (match === null || match === void 0 ? void 0 : match[1]) {
            instances.add(decodeDnsSdEscapes(match[1].trim()));
        }
    }
    return Array.from(instances.values());
}
function parseDnsSdResolve(stdout, instanceName) {
    var decodedInstanceName = decodeDnsSdEscapes(instanceName);
    var beacon = { instanceName: decodedInstanceName };
    var txt = {};
    for (var _i = 0, _a = stdout.split("\n"); _i < _a.length; _i++) {
        var raw = _a[_i];
        var line = raw.trim();
        if (!line) {
            continue;
        }
        if (line.includes("can be reached at")) {
            var match = line.match(/can be reached at\s+([^\s:]+):(\d+)/i);
            if (match === null || match === void 0 ? void 0 : match[1]) {
                beacon.host = match[1].replace(/\.$/, "");
            }
            if (match === null || match === void 0 ? void 0 : match[2]) {
                beacon.port = parseIntOrNull(match[2]);
            }
            continue;
        }
        if (line.startsWith("txt") || line.includes("txtvers=")) {
            var tokens = line.split(/\s+/).filter(Boolean);
            txt = parseTxtTokens(tokens);
        }
    }
    beacon.txt = Object.keys(txt).length ? txt : undefined;
    if (txt.displayName) {
        beacon.displayName = decodeDnsSdEscapes(txt.displayName);
    }
    if (txt.lanHost) {
        beacon.lanHost = txt.lanHost;
    }
    if (txt.tailnetDns) {
        beacon.tailnetDns = txt.tailnetDns;
    }
    if (txt.cliPath) {
        beacon.cliPath = txt.cliPath;
    }
    beacon.gatewayPort = parseIntOrNull(txt.gatewayPort);
    beacon.sshPort = parseIntOrNull(txt.sshPort);
    if (txt.gatewayTls) {
        var raw = txt.gatewayTls.trim().toLowerCase();
        beacon.gatewayTls = raw === "1" || raw === "true" || raw === "yes";
    }
    if (txt.gatewayTlsSha256) {
        beacon.gatewayTlsFingerprintSha256 = txt.gatewayTlsSha256;
    }
    if (txt.role) {
        beacon.role = txt.role;
    }
    if (txt.transport) {
        beacon.transport = txt.transport;
    }
    if (!beacon.displayName) {
        beacon.displayName = decodedInstanceName;
    }
    return beacon;
}
function discoverViaDnsSd(domain, timeoutMs, run) {
    return __awaiter(this, void 0, void 0, function () {
        var browse, instances, results, _i, instances_1, instance, resolved, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, run(["dns-sd", "-B", GATEWAY_SERVICE_TYPE, domain], {
                        timeoutMs: timeoutMs,
                    })];
                case 1:
                    browse = _a.sent();
                    instances = parseDnsSdBrowse(browse.stdout);
                    results = [];
                    _i = 0, instances_1 = instances;
                    _a.label = 2;
                case 2:
                    if (!(_i < instances_1.length)) return [3 /*break*/, 5];
                    instance = instances_1[_i];
                    return [4 /*yield*/, run(["dns-sd", "-L", instance, GATEWAY_SERVICE_TYPE, domain], {
                            timeoutMs: timeoutMs,
                        })];
                case 3:
                    resolved = _a.sent();
                    parsed = parseDnsSdResolve(resolved.stdout, instance);
                    if (parsed) {
                        results.push(__assign(__assign({}, parsed), { domain: domain }));
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, results];
            }
        });
    });
}
function discoverWideAreaViaTailnetDns(domain, timeoutMs, run) {
    return __awaiter(this, void 0, void 0, function () {
        var startedAt, remainingMs, tailscaleCandidates, ips, _i, tailscaleCandidates_1, candidate, res, _a, probeName, concurrency, nextIndex, nameserver, ptrs, worker, nameserverArg, results, _b, ptrs_1, ptr, budget, ptrName, instanceName, srv, srvParsed, txtBudget, txt, txtTokens, txtMap, beacon, raw;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!domain || domain === "local.") {
                        return [2 /*return*/, []];
                    }
                    startedAt = Date.now();
                    remainingMs = function () { return timeoutMs - (Date.now() - startedAt); };
                    tailscaleCandidates = ["tailscale", "/Applications/Tailscale.app/Contents/MacOS/Tailscale"];
                    ips = [];
                    _i = 0, tailscaleCandidates_1 = tailscaleCandidates;
                    _c.label = 1;
                case 1:
                    if (!(_i < tailscaleCandidates_1.length)) return [3 /*break*/, 6];
                    candidate = tailscaleCandidates_1[_i];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, run([candidate, "status", "--json"], {
                            timeoutMs: Math.max(1, Math.min(700, remainingMs())),
                        })];
                case 3:
                    res = _c.sent();
                    ips = parseTailscaleStatusIPv4s(res.stdout);
                    if (ips.length > 0) {
                        return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    _a = _c.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (ips.length === 0) {
                        return [2 /*return*/, []];
                    }
                    if (remainingMs() <= 0) {
                        return [2 /*return*/, []];
                    }
                    // Keep scans bounded: this is a fallback and should not block long.
                    ips = ips.slice(0, 40);
                    probeName = "".concat(GATEWAY_SERVICE_TYPE, ".").concat(domain.replace(/\.$/, ""));
                    concurrency = 6;
                    nextIndex = 0;
                    nameserver = null;
                    ptrs = [];
                    worker = function () { return __awaiter(_this, void 0, void 0, function () {
                        var budget, i, ip, probe, lines, _a;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!(nameserver === null)) return [3 /*break*/, 5];
                                    budget = remainingMs();
                                    if (budget <= 0) {
                                        return [2 /*return*/];
                                    }
                                    i = nextIndex;
                                    nextIndex += 1;
                                    if (i >= ips.length) {
                                        return [2 /*return*/];
                                    }
                                    ip = (_b = ips[i]) !== null && _b !== void 0 ? _b : "";
                                    if (!ip) {
                                        return [3 /*break*/, 0];
                                    }
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, run(["dig", "+short", "+time=1", "+tries=1", "@".concat(ip), probeName, "PTR"], { timeoutMs: Math.max(1, Math.min(250, budget)) })];
                                case 2:
                                    probe = _c.sent();
                                    lines = parseDigShortLines(probe.stdout);
                                    if (lines.length === 0) {
                                        return [3 /*break*/, 0];
                                    }
                                    nameserver = ip;
                                    ptrs = lines;
                                    return [2 /*return*/];
                                case 3:
                                    _a = _c.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [3 /*break*/, 0];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, Promise.all(Array.from({ length: Math.min(concurrency, ips.length) }, function () { return worker(); }))];
                case 7:
                    _c.sent();
                    if (!nameserver || ptrs.length === 0) {
                        return [2 /*return*/, []];
                    }
                    if (remainingMs() <= 0) {
                        return [2 /*return*/, []];
                    }
                    nameserverArg = "@".concat(String(nameserver));
                    results = [];
                    _b = 0, ptrs_1 = ptrs;
                    _c.label = 8;
                case 8:
                    if (!(_b < ptrs_1.length)) return [3 /*break*/, 12];
                    ptr = ptrs_1[_b];
                    budget = remainingMs();
                    if (budget <= 0) {
                        return [3 /*break*/, 12];
                    }
                    ptrName = ptr.trim().replace(/\.$/, "");
                    if (!ptrName) {
                        return [3 /*break*/, 11];
                    }
                    instanceName = ptrName.replace(/\.?_openclaw-gw\._tcp\..*$/, "");
                    return [4 /*yield*/, run(["dig", "+short", "+time=1", "+tries=1", nameserverArg, ptrName, "SRV"], {
                            timeoutMs: Math.max(1, Math.min(350, budget)),
                        }).catch(function () { return null; })];
                case 9:
                    srv = _c.sent();
                    srvParsed = srv ? parseDigSrv(srv.stdout) : null;
                    if (!srvParsed) {
                        return [3 /*break*/, 11];
                    }
                    txtBudget = remainingMs();
                    if (txtBudget <= 0) {
                        results.push({
                            instanceName: instanceName || ptrName,
                            displayName: instanceName || ptrName,
                            domain: domain,
                            host: srvParsed.host,
                            port: srvParsed.port,
                        });
                        return [3 /*break*/, 11];
                    }
                    return [4 /*yield*/, run(["dig", "+short", "+time=1", "+tries=1", nameserverArg, ptrName, "TXT"], {
                            timeoutMs: Math.max(1, Math.min(350, txtBudget)),
                        }).catch(function () { return null; })];
                case 10:
                    txt = _c.sent();
                    txtTokens = txt ? parseDigTxt(txt.stdout) : [];
                    txtMap = txtTokens.length > 0 ? parseTxtTokens(txtTokens) : {};
                    beacon = {
                        instanceName: instanceName || ptrName,
                        displayName: txtMap.displayName || instanceName || ptrName,
                        domain: domain,
                        host: srvParsed.host,
                        port: srvParsed.port,
                        txt: Object.keys(txtMap).length ? txtMap : undefined,
                        gatewayPort: parseIntOrNull(txtMap.gatewayPort),
                        sshPort: parseIntOrNull(txtMap.sshPort),
                        tailnetDns: txtMap.tailnetDns || undefined,
                        cliPath: txtMap.cliPath || undefined,
                    };
                    if (txtMap.gatewayTls) {
                        raw = txtMap.gatewayTls.trim().toLowerCase();
                        beacon.gatewayTls = raw === "1" || raw === "true" || raw === "yes";
                    }
                    if (txtMap.gatewayTlsSha256) {
                        beacon.gatewayTlsFingerprintSha256 = txtMap.gatewayTlsSha256;
                    }
                    if (txtMap.role) {
                        beacon.role = txtMap.role;
                    }
                    if (txtMap.transport) {
                        beacon.transport = txtMap.transport;
                    }
                    results.push(beacon);
                    _c.label = 11;
                case 11:
                    _b++;
                    return [3 /*break*/, 8];
                case 12: return [2 /*return*/, results];
            }
        });
    });
}
function parseAvahiBrowse(stdout) {
    var results = [];
    var current = null;
    for (var _i = 0, _a = stdout.split("\n"); _i < _a.length; _i++) {
        var raw = _a[_i];
        var line = raw.trimEnd();
        if (!line) {
            continue;
        }
        if (line.startsWith("=") && line.includes(GATEWAY_SERVICE_TYPE)) {
            if (current) {
                results.push(current);
            }
            var marker = " ".concat(GATEWAY_SERVICE_TYPE);
            var idx = line.indexOf(marker);
            var left = idx >= 0 ? line.slice(0, idx).trim() : line;
            var parts = left.split(/\s+/);
            var instanceName = parts.length > 3 ? parts.slice(3).join(" ") : left;
            current = {
                instanceName: instanceName,
                displayName: instanceName,
            };
            continue;
        }
        if (!current) {
            continue;
        }
        var trimmed = line.trim();
        if (trimmed.startsWith("hostname =")) {
            var match = trimmed.match(/hostname\s*=\s*\[([^\]]+)\]/);
            if (match === null || match === void 0 ? void 0 : match[1]) {
                current.host = match[1];
            }
            continue;
        }
        if (trimmed.startsWith("port =")) {
            var match = trimmed.match(/port\s*=\s*\[(\d+)\]/);
            if (match === null || match === void 0 ? void 0 : match[1]) {
                current.port = parseIntOrNull(match[1]);
            }
            continue;
        }
        if (trimmed.startsWith("txt =")) {
            var tokens = Array.from(trimmed.matchAll(/"([^"]*)"/g), function (m) { return m[1]; });
            var txt = parseTxtTokens(tokens);
            current.txt = Object.keys(txt).length ? txt : undefined;
            if (txt.displayName) {
                current.displayName = txt.displayName;
            }
            if (txt.lanHost) {
                current.lanHost = txt.lanHost;
            }
            if (txt.tailnetDns) {
                current.tailnetDns = txt.tailnetDns;
            }
            if (txt.cliPath) {
                current.cliPath = txt.cliPath;
            }
            current.gatewayPort = parseIntOrNull(txt.gatewayPort);
            current.sshPort = parseIntOrNull(txt.sshPort);
            if (txt.gatewayTls) {
                var raw_1 = txt.gatewayTls.trim().toLowerCase();
                current.gatewayTls = raw_1 === "1" || raw_1 === "true" || raw_1 === "yes";
            }
            if (txt.gatewayTlsSha256) {
                current.gatewayTlsFingerprintSha256 = txt.gatewayTlsSha256;
            }
            if (txt.role) {
                current.role = txt.role;
            }
            if (txt.transport) {
                current.transport = txt.transport;
            }
        }
    }
    if (current) {
        results.push(current);
    }
    return results;
}
function discoverViaAvahi(domain, timeoutMs, run) {
    return __awaiter(this, void 0, void 0, function () {
        var args, browse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = ["avahi-browse", "-rt", GATEWAY_SERVICE_TYPE];
                    if (domain && domain !== "local.") {
                        // avahi-browse wants a plain domain (no trailing dot)
                        args.push("-d", domain.replace(/\.$/, ""));
                    }
                    return [4 /*yield*/, run(args, { timeoutMs: timeoutMs })];
                case 1:
                    browse = _a.sent();
                    return [2 /*return*/, parseAvahiBrowse(browse.stdout).map(function (beacon) { return (__assign(__assign({}, beacon), { domain: domain })); })];
            }
        });
    });
}
function discoverGatewayBeacons() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var timeoutMs, platform, run, wideAreaDomain, domainsRaw, defaultDomains, domains, perDomain, discovered, wantsWideArea, hasWideArea, fallback, perDomain, _a;
        var _this = this;
        var _b, _c, _d;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    timeoutMs = (_b = opts.timeoutMs) !== null && _b !== void 0 ? _b : DEFAULT_TIMEOUT_MS;
                    platform = (_c = opts.platform) !== null && _c !== void 0 ? _c : process.platform;
                    run = (_d = opts.run) !== null && _d !== void 0 ? _d : exec_js_1.runCommandWithTimeout;
                    wideAreaDomain = (0, widearea_dns_js_1.resolveWideAreaDiscoveryDomain)({ configDomain: opts.wideAreaDomain });
                    domainsRaw = Array.isArray(opts.domains) ? opts.domains : [];
                    defaultDomains = __spreadArray(["local."], (wideAreaDomain ? [wideAreaDomain] : []), true);
                    domains = (domainsRaw.length > 0 ? domainsRaw : defaultDomains)
                        .map(function (d) { return String(d).trim(); })
                        .filter(Boolean)
                        .map(function (d) { return (d.endsWith(".") ? d : "".concat(d, ".")); });
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 8, , 9]);
                    if (!(platform === "darwin")) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.allSettled(domains.map(function (domain) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, discoverViaDnsSd(domain, timeoutMs, run)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 2:
                    perDomain = _e.sent();
                    discovered = perDomain.flatMap(function (r) { return (r.status === "fulfilled" ? r.value : []); });
                    wantsWideArea = wideAreaDomain ? domains.includes(wideAreaDomain) : false;
                    hasWideArea = wideAreaDomain
                        ? discovered.some(function (b) { return b.domain === wideAreaDomain; })
                        : false;
                    if (!(wantsWideArea && !hasWideArea && wideAreaDomain)) return [3 /*break*/, 4];
                    return [4 /*yield*/, discoverWideAreaViaTailnetDns(wideAreaDomain, timeoutMs, run).catch(function () { return []; })];
                case 3:
                    fallback = _e.sent();
                    return [2 /*return*/, __spreadArray(__spreadArray([], discovered, true), fallback, true)];
                case 4: return [2 /*return*/, discovered];
                case 5:
                    if (!(platform === "linux")) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.allSettled(domains.map(function (domain) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, discoverViaAvahi(domain, timeoutMs, run)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 6:
                    perDomain = _e.sent();
                    return [2 /*return*/, perDomain.flatMap(function (r) { return (r.status === "fulfilled" ? r.value : []); })];
                case 7: return [3 /*break*/, 9];
                case 8:
                    _a = _e.sent();
                    return [2 /*return*/, []];
                case 9: return [2 /*return*/, []];
            }
        });
    });
}
