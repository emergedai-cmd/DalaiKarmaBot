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
exports.normalizeWideAreaDomain = normalizeWideAreaDomain;
exports.resolveWideAreaDiscoveryDomain = resolveWideAreaDiscoveryDomain;
exports.getWideAreaZonePath = getWideAreaZonePath;
exports.renderWideAreaGatewayZoneText = renderWideAreaGatewayZoneText;
exports.writeWideAreaGatewayZone = writeWideAreaGatewayZone;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var utils_js_1 = require("../utils.js");
function normalizeWideAreaDomain(raw) {
    var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
    if (!trimmed) {
        return null;
    }
    return trimmed.endsWith(".") ? trimmed : "".concat(trimmed, ".");
}
function resolveWideAreaDiscoveryDomain(params) {
    var _a, _b, _c;
    var env = (_a = params === null || params === void 0 ? void 0 : params.env) !== null && _a !== void 0 ? _a : process.env;
    var candidate = (_c = (_b = params === null || params === void 0 ? void 0 : params.configDomain) !== null && _b !== void 0 ? _b : env.OPENCLAW_WIDE_AREA_DOMAIN) !== null && _c !== void 0 ? _c : null;
    return normalizeWideAreaDomain(candidate);
}
function zoneFilenameForDomain(domain) {
    return "".concat(domain.replace(/\.$/, ""), ".db");
}
function getWideAreaZonePath(domain) {
    return node_path_1.default.join(utils_js_1.CONFIG_DIR, "dns", zoneFilenameForDomain(domain));
}
function dnsLabel(raw, fallback) {
    var normalized = raw
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    var out = normalized.length > 0 ? normalized : fallback;
    return out.length <= 63 ? out : out.slice(0, 63);
}
function txtQuote(value) {
    var escaped = value.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("\n", "\\n");
    return "\"".concat(escaped, "\"");
}
function formatYyyyMmDd(date) {
    var y = date.getUTCFullYear();
    var m = String(date.getUTCMonth() + 1).padStart(2, "0");
    var d = String(date.getUTCDate()).padStart(2, "0");
    return "".concat(y).concat(m).concat(d);
}
function nextSerial(existingSerial, now) {
    var today = formatYyyyMmDd(now);
    var base = Number.parseInt("".concat(today, "01"), 10);
    if (!existingSerial || !Number.isFinite(existingSerial)) {
        return base;
    }
    var existing = String(existingSerial);
    if (existing.startsWith(today)) {
        return existingSerial + 1;
    }
    return base;
}
function extractSerial(zoneText) {
    var match = zoneText.match(/^\s*@\s+IN\s+SOA\s+\S+\s+\S+\s+(\d+)\s+/m);
    if (!match) {
        return null;
    }
    var parsed = Number.parseInt(match[1], 10);
    return Number.isFinite(parsed) ? parsed : null;
}
function extractContentHash(zoneText) {
    var _a;
    var match = zoneText.match(/^\s*;\s*openclaw-content-hash:\s*(\S+)\s*$/m);
    return (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : null;
}
function computeContentHash(body) {
    // Cheap stable hash; avoids importing crypto (and keeps deterministic across runtimes).
    var h = 2166136261;
    for (var i = 0; i < body.length; i++) {
        h ^= body.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, "0");
}
function renderZone(opts) {
    var _a, _b, _c, _d, _e, _f;
    var hostname = (_a = node_os_1.default.hostname().split(".")[0]) !== null && _a !== void 0 ? _a : "openclaw";
    var hostLabel = dnsLabel((_b = opts.hostLabel) !== null && _b !== void 0 ? _b : hostname, "openclaw");
    var instanceLabel = dnsLabel((_c = opts.instanceLabel) !== null && _c !== void 0 ? _c : "".concat(hostname, "-gateway"), "openclaw-gw");
    var domain = (_d = normalizeWideAreaDomain(opts.domain)) !== null && _d !== void 0 ? _d : "local.";
    var txt = [
        "displayName=".concat(opts.displayName.trim() || hostname),
        "role=gateway",
        "transport=gateway",
        "gatewayPort=".concat(opts.gatewayPort),
    ];
    if (opts.gatewayTlsEnabled) {
        txt.push("gatewayTls=1");
        if (opts.gatewayTlsFingerprintSha256) {
            txt.push("gatewayTlsSha256=".concat(opts.gatewayTlsFingerprintSha256));
        }
    }
    if ((_e = opts.tailnetDns) === null || _e === void 0 ? void 0 : _e.trim()) {
        txt.push("tailnetDns=".concat(opts.tailnetDns.trim()));
    }
    if (typeof opts.sshPort === "number" && opts.sshPort > 0) {
        txt.push("sshPort=".concat(opts.sshPort));
    }
    if ((_f = opts.cliPath) === null || _f === void 0 ? void 0 : _f.trim()) {
        txt.push("cliPath=".concat(opts.cliPath.trim()));
    }
    var records = [];
    records.push("$ORIGIN ".concat(domain));
    records.push("$TTL 60");
    var soaLine = "@ IN SOA ns1 hostmaster ".concat(opts.serial, " 7200 3600 1209600 60");
    records.push(soaLine);
    records.push("@ IN NS ns1");
    records.push("ns1 IN A ".concat(opts.tailnetIPv4));
    records.push("".concat(hostLabel, " IN A ").concat(opts.tailnetIPv4));
    if (opts.tailnetIPv6) {
        records.push("".concat(hostLabel, " IN AAAA ").concat(opts.tailnetIPv6));
    }
    records.push("_openclaw-gw._tcp IN PTR ".concat(instanceLabel, "._openclaw-gw._tcp"));
    records.push("".concat(instanceLabel, "._openclaw-gw._tcp IN SRV 0 0 ").concat(opts.gatewayPort, " ").concat(hostLabel));
    records.push("".concat(instanceLabel, "._openclaw-gw._tcp IN TXT ").concat(txt.map(txtQuote).join(" ")));
    var contentBody = "".concat(records.join("\n"), "\n");
    var hashBody = "".concat(records
        .map(function (line) {
        return line === soaLine ? "@ IN SOA ns1 hostmaster SERIAL 7200 3600 1209600 60" : line;
    })
        .join("\n"), "\n");
    var contentHash = computeContentHash(hashBody);
    return "; openclaw-content-hash: ".concat(contentHash, "\n").concat(contentBody);
}
function renderWideAreaGatewayZoneText(opts) {
    return renderZone(opts);
}
function writeWideAreaGatewayZone(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, zonePath, existing, nextNoSerial, nextHash, existingHash, existingSerial, serial, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    domain = normalizeWideAreaDomain(opts.domain);
                    if (!domain) {
                        throw new Error("wide-area discovery domain is required");
                    }
                    zonePath = getWideAreaZonePath(domain);
                    return [4 /*yield*/, (0, utils_js_1.ensureDir)(node_path_1.default.dirname(zonePath))];
                case 1:
                    _a.sent();
                    existing = (function () {
                        try {
                            return node_fs_1.default.readFileSync(zonePath, "utf-8");
                        }
                        catch (_a) {
                            return null;
                        }
                    })();
                    nextNoSerial = renderWideAreaGatewayZoneText(__assign(__assign({}, opts), { serial: 0 }));
                    nextHash = extractContentHash(nextNoSerial);
                    existingHash = existing ? extractContentHash(existing) : null;
                    if (existing && nextHash && existingHash === nextHash) {
                        return [2 /*return*/, { zonePath: zonePath, changed: false }];
                    }
                    existingSerial = existing ? extractSerial(existing) : null;
                    serial = nextSerial(existingSerial, new Date());
                    next = renderWideAreaGatewayZoneText(__assign(__assign({}, opts), { serial: serial }));
                    node_fs_1.default.writeFileSync(zonePath, next, "utf-8");
                    return [2 /*return*/, { zonePath: zonePath, changed: true }];
            }
        });
    });
}
