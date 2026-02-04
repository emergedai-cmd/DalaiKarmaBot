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
exports.startGatewayDiscovery = startGatewayDiscovery;
var bonjour_js_1 = require("../infra/bonjour.js");
var tailnet_js_1 = require("../infra/tailnet.js");
var widearea_dns_js_1 = require("../infra/widearea-dns.js");
var server_discovery_js_1 = require("./server-discovery.js");
function startGatewayDiscovery(params) {
    return __awaiter(this, void 0, void 0, function () {
        var bonjourStop, mdnsMode, bonjourEnabled, mdnsMinimal, tailscaleEnabled, needsTailnetDns, tailnetDns, _a, sshPortEnv, sshPortParsed, sshPort, cliPath, bonjour, err_1, wideAreaDomain, tailnetIPv4, tailnetIPv6, result, err_2;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    bonjourStop = null;
                    mdnsMode = (_b = params.mdnsMode) !== null && _b !== void 0 ? _b : "minimal";
                    bonjourEnabled = mdnsMode !== "off" &&
                        process.env.OPENCLAW_DISABLE_BONJOUR !== "1" &&
                        process.env.NODE_ENV !== "test" &&
                        !process.env.VITEST;
                    mdnsMinimal = mdnsMode !== "full";
                    tailscaleEnabled = params.tailscaleMode !== "off";
                    needsTailnetDns = bonjourEnabled || params.wideAreaDiscoveryEnabled;
                    if (!needsTailnetDns) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, server_discovery_js_1.resolveTailnetDnsHint)({ enabled: tailscaleEnabled })];
                case 1:
                    _a = _l.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = undefined;
                    _l.label = 3;
                case 3:
                    tailnetDns = _a;
                    sshPortEnv = mdnsMinimal ? undefined : (_c = process.env.OPENCLAW_SSH_PORT) === null || _c === void 0 ? void 0 : _c.trim();
                    sshPortParsed = sshPortEnv ? Number.parseInt(sshPortEnv, 10) : NaN;
                    sshPort = Number.isFinite(sshPortParsed) && sshPortParsed > 0 ? sshPortParsed : undefined;
                    cliPath = mdnsMinimal ? undefined : (0, server_discovery_js_1.resolveBonjourCliPath)();
                    if (!bonjourEnabled) return [3 /*break*/, 7];
                    _l.label = 4;
                case 4:
                    _l.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, bonjour_js_1.startGatewayBonjourAdvertiser)({
                            instanceName: (0, server_discovery_js_1.formatBonjourInstanceName)(params.machineDisplayName),
                            gatewayPort: params.port,
                            gatewayTlsEnabled: (_e = (_d = params.gatewayTls) === null || _d === void 0 ? void 0 : _d.enabled) !== null && _e !== void 0 ? _e : false,
                            gatewayTlsFingerprintSha256: (_f = params.gatewayTls) === null || _f === void 0 ? void 0 : _f.fingerprintSha256,
                            canvasPort: params.canvasPort,
                            sshPort: sshPort,
                            tailnetDns: tailnetDns,
                            cliPath: cliPath,
                            minimal: mdnsMinimal,
                        })];
                case 5:
                    bonjour = _l.sent();
                    bonjourStop = bonjour.stop;
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _l.sent();
                    params.logDiscovery.warn("bonjour advertising failed: ".concat(String(err_1)));
                    return [3 /*break*/, 7];
                case 7:
                    if (!params.wideAreaDiscoveryEnabled) return [3 /*break*/, 11];
                    wideAreaDomain = (0, widearea_dns_js_1.resolveWideAreaDiscoveryDomain)({
                        configDomain: (_g = params.wideAreaDiscoveryDomain) !== null && _g !== void 0 ? _g : undefined,
                    });
                    if (!wideAreaDomain) {
                        params.logDiscovery.warn("discovery.wideArea.enabled is true, but no domain was configured; set discovery.wideArea.domain to enable unicast DNS-SD");
                        return [2 /*return*/, { bonjourStop: bonjourStop }];
                    }
                    tailnetIPv4 = (0, tailnet_js_1.pickPrimaryTailnetIPv4)();
                    if (!!tailnetIPv4) return [3 /*break*/, 8];
                    params.logDiscovery.warn("discovery.wideArea.enabled is true, but no Tailscale IPv4 address was found; skipping unicast DNS-SD zone update");
                    return [3 /*break*/, 11];
                case 8:
                    _l.trys.push([8, 10, , 11]);
                    tailnetIPv6 = (0, tailnet_js_1.pickPrimaryTailnetIPv6)();
                    return [4 /*yield*/, (0, widearea_dns_js_1.writeWideAreaGatewayZone)({
                            domain: wideAreaDomain,
                            gatewayPort: params.port,
                            displayName: (0, server_discovery_js_1.formatBonjourInstanceName)(params.machineDisplayName),
                            tailnetIPv4: tailnetIPv4,
                            tailnetIPv6: tailnetIPv6 !== null && tailnetIPv6 !== void 0 ? tailnetIPv6 : undefined,
                            gatewayTlsEnabled: (_j = (_h = params.gatewayTls) === null || _h === void 0 ? void 0 : _h.enabled) !== null && _j !== void 0 ? _j : false,
                            gatewayTlsFingerprintSha256: (_k = params.gatewayTls) === null || _k === void 0 ? void 0 : _k.fingerprintSha256,
                            tailnetDns: tailnetDns,
                            sshPort: sshPort,
                            cliPath: (0, server_discovery_js_1.resolveBonjourCliPath)(),
                        })];
                case 9:
                    result = _l.sent();
                    params.logDiscovery.info("wide-area DNS-SD ".concat(result.changed ? "updated" : "unchanged", " (").concat(wideAreaDomain, " \u2192 ").concat(result.zonePath, ")"));
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _l.sent();
                    params.logDiscovery.warn("wide-area discovery update failed: ".concat(String(err_2)));
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, { bonjourStop: bonjourStop }];
            }
        });
    });
}
