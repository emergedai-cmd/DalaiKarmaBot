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
exports.promptRemoteGatewayConfig = promptRemoteGatewayConfig;
var bonjour_discovery_js_1 = require("../infra/bonjour-discovery.js");
var widearea_dns_js_1 = require("../infra/widearea-dns.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
var DEFAULT_GATEWAY_URL = "ws://127.0.0.1:18789";
function pickHost(beacon) {
    return beacon.tailnetDns || beacon.lanHost || beacon.host;
}
function buildLabel(beacon) {
    var _a, _b, _c;
    var host = pickHost(beacon);
    var port = (_b = (_a = beacon.gatewayPort) !== null && _a !== void 0 ? _a : beacon.port) !== null && _b !== void 0 ? _b : 18789;
    var title = (_c = beacon.displayName) !== null && _c !== void 0 ? _c : beacon.instanceName;
    var hint = host ? "".concat(host, ":").concat(port) : "host unknown";
    return "".concat(title, " (").concat(hint, ")");
}
function ensureWsUrl(value) {
    var trimmed = value.trim();
    if (!trimmed) {
        return DEFAULT_GATEWAY_URL;
    }
    return trimmed;
}
function promptRemoteGatewayConfig(cfg, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var selectedBeacon, suggestedUrl, hasBonjourTool, _a, wantsDiscover, _b, wideAreaDomain, spin, beacons, selection, idx, host, port, mode, urlInput, url, authChoice, token, _c;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    selectedBeacon = null;
                    suggestedUrl = (_f = (_e = (_d = cfg.gateway) === null || _d === void 0 ? void 0 : _d.remote) === null || _e === void 0 ? void 0 : _e.url) !== null && _f !== void 0 ? _f : DEFAULT_GATEWAY_URL;
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBinary)("dns-sd")];
                case 1:
                    _a = (_p.sent());
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBinary)("avahi-browse")];
                case 2:
                    _a = (_p.sent());
                    _p.label = 3;
                case 3:
                    hasBonjourTool = _a;
                    if (!hasBonjourTool) return [3 /*break*/, 5];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Discover gateway on LAN (Bonjour)?",
                            initialValue: true,
                        })];
                case 4:
                    _b = _p.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = false;
                    _p.label = 6;
                case 6:
                    wantsDiscover = _b;
                    if (!!hasBonjourTool) return [3 /*break*/, 8];
                    return [4 /*yield*/, prompter.note([
                            "Bonjour discovery requires dns-sd (macOS) or avahi-browse (Linux).",
                            "Docs: https://docs.openclaw.ai/gateway/discovery",
                        ].join("\n"), "Discovery")];
                case 7:
                    _p.sent();
                    _p.label = 8;
                case 8:
                    if (!wantsDiscover) return [3 /*break*/, 11];
                    wideAreaDomain = (0, widearea_dns_js_1.resolveWideAreaDiscoveryDomain)({
                        configDomain: (_h = (_g = cfg.discovery) === null || _g === void 0 ? void 0 : _g.wideArea) === null || _h === void 0 ? void 0 : _h.domain,
                    });
                    spin = prompter.progress("Searching for gateways…");
                    return [4 /*yield*/, (0, bonjour_discovery_js_1.discoverGatewayBeacons)({ timeoutMs: 2000, wideAreaDomain: wideAreaDomain })];
                case 9:
                    beacons = _p.sent();
                    spin.stop(beacons.length > 0 ? "Found ".concat(beacons.length, " gateway(s)") : "No gateways found");
                    if (!(beacons.length > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, prompter.select({
                            message: "Select gateway",
                            options: __spreadArray(__spreadArray([], beacons.map(function (beacon, index) { return ({
                                value: String(index),
                                label: buildLabel(beacon),
                            }); }), true), [
                                { value: "manual", label: "Enter URL manually" },
                            ], false),
                        })];
                case 10:
                    selection = _p.sent();
                    if (selection !== "manual") {
                        idx = Number.parseInt(String(selection), 10);
                        selectedBeacon = Number.isFinite(idx) ? ((_j = beacons[idx]) !== null && _j !== void 0 ? _j : null) : null;
                    }
                    _p.label = 11;
                case 11:
                    if (!selectedBeacon) return [3 /*break*/, 15];
                    host = pickHost(selectedBeacon);
                    port = (_k = selectedBeacon.gatewayPort) !== null && _k !== void 0 ? _k : 18789;
                    if (!host) return [3 /*break*/, 15];
                    return [4 /*yield*/, prompter.select({
                            message: "Connection method",
                            options: [
                                {
                                    value: "direct",
                                    label: "Direct gateway WS (".concat(host, ":").concat(port, ")"),
                                },
                                { value: "ssh", label: "SSH tunnel (loopback)" },
                            ],
                        })];
                case 12:
                    mode = _p.sent();
                    if (!(mode === "direct")) return [3 /*break*/, 13];
                    suggestedUrl = "ws://".concat(host, ":").concat(port);
                    return [3 /*break*/, 15];
                case 13:
                    suggestedUrl = DEFAULT_GATEWAY_URL;
                    return [4 /*yield*/, prompter.note([
                            "Start a tunnel before using the CLI:",
                            "ssh -N -L 18789:127.0.0.1:18789 <user>@".concat(host).concat(selectedBeacon.sshPort ? " -p ".concat(selectedBeacon.sshPort) : ""),
                            "Docs: https://docs.openclaw.ai/gateway/remote",
                        ].join("\n"), "SSH tunnel")];
                case 14:
                    _p.sent();
                    _p.label = 15;
                case 15: return [4 /*yield*/, prompter.text({
                        message: "Gateway WebSocket URL",
                        initialValue: suggestedUrl,
                        validate: function (value) {
                            return String(value).trim().startsWith("ws://") || String(value).trim().startsWith("wss://")
                                ? undefined
                                : "URL must start with ws:// or wss://";
                        },
                    })];
                case 16:
                    urlInput = _p.sent();
                    url = ensureWsUrl(String(urlInput));
                    return [4 /*yield*/, prompter.select({
                            message: "Gateway auth",
                            options: [
                                { value: "token", label: "Token (recommended)" },
                                { value: "off", label: "No auth" },
                            ],
                        })];
                case 17:
                    authChoice = _p.sent();
                    token = (_o = (_m = (_l = cfg.gateway) === null || _l === void 0 ? void 0 : _l.remote) === null || _m === void 0 ? void 0 : _m.token) !== null && _o !== void 0 ? _o : "";
                    if (!(authChoice === "token")) return [3 /*break*/, 19];
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Gateway token",
                            initialValue: token,
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 18:
                    token = _c.apply(void 0, [_p.sent()]).trim();
                    return [3 /*break*/, 20];
                case 19:
                    token = "";
                    _p.label = 20;
                case 20: return [2 /*return*/, __assign(__assign({}, cfg), { gateway: __assign(__assign({}, cfg.gateway), { mode: "remote", remote: {
                                url: url,
                                token: token || undefined,
                            } }) })];
            }
        });
    });
}
