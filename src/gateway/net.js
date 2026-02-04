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
exports.isLoopbackAddress = isLoopbackAddress;
exports.parseForwardedForClientIp = parseForwardedForClientIp;
exports.isTrustedProxyAddress = isTrustedProxyAddress;
exports.resolveGatewayClientIp = resolveGatewayClientIp;
exports.isLocalGatewayAddress = isLocalGatewayAddress;
exports.resolveGatewayBindHost = resolveGatewayBindHost;
exports.canBindToHost = canBindToHost;
exports.resolveGatewayListenHosts = resolveGatewayListenHosts;
exports.isLoopbackHost = isLoopbackHost;
var node_net_1 = require("node:net");
var tailnet_js_1 = require("../infra/tailnet.js");
function isLoopbackAddress(ip) {
    if (!ip) {
        return false;
    }
    if (ip === "127.0.0.1") {
        return true;
    }
    if (ip.startsWith("127.")) {
        return true;
    }
    if (ip === "::1") {
        return true;
    }
    if (ip.startsWith("::ffff:127.")) {
        return true;
    }
    return false;
}
function normalizeIPv4MappedAddress(ip) {
    if (ip.startsWith("::ffff:")) {
        return ip.slice("::ffff:".length);
    }
    return ip;
}
function normalizeIp(ip) {
    var trimmed = ip === null || ip === void 0 ? void 0 : ip.trim();
    if (!trimmed) {
        return undefined;
    }
    return normalizeIPv4MappedAddress(trimmed.toLowerCase());
}
function stripOptionalPort(ip) {
    if (ip.startsWith("[")) {
        var end = ip.indexOf("]");
        if (end !== -1) {
            return ip.slice(1, end);
        }
    }
    if (node_net_1.default.isIP(ip)) {
        return ip;
    }
    var lastColon = ip.lastIndexOf(":");
    if (lastColon > -1 && ip.includes(".") && ip.indexOf(":") === lastColon) {
        var candidate = ip.slice(0, lastColon);
        if (node_net_1.default.isIP(candidate) === 4) {
            return candidate;
        }
    }
    return ip;
}
function parseForwardedForClientIp(forwardedFor) {
    var _a;
    var raw = (_a = forwardedFor === null || forwardedFor === void 0 ? void 0 : forwardedFor.split(",")[0]) === null || _a === void 0 ? void 0 : _a.trim();
    if (!raw) {
        return undefined;
    }
    return normalizeIp(stripOptionalPort(raw));
}
function parseRealIp(realIp) {
    var raw = realIp === null || realIp === void 0 ? void 0 : realIp.trim();
    if (!raw) {
        return undefined;
    }
    return normalizeIp(stripOptionalPort(raw));
}
function isTrustedProxyAddress(ip, trustedProxies) {
    var normalized = normalizeIp(ip);
    if (!normalized || !trustedProxies || trustedProxies.length === 0) {
        return false;
    }
    return trustedProxies.some(function (proxy) { return normalizeIp(proxy) === normalized; });
}
function resolveGatewayClientIp(params) {
    var _a, _b;
    var remote = normalizeIp(params.remoteAddr);
    if (!remote) {
        return undefined;
    }
    if (!isTrustedProxyAddress(remote, params.trustedProxies)) {
        return remote;
    }
    return (_b = (_a = parseForwardedForClientIp(params.forwardedFor)) !== null && _a !== void 0 ? _a : parseRealIp(params.realIp)) !== null && _b !== void 0 ? _b : remote;
}
function isLocalGatewayAddress(ip) {
    if (isLoopbackAddress(ip)) {
        return true;
    }
    if (!ip) {
        return false;
    }
    var normalized = normalizeIPv4MappedAddress(ip.trim().toLowerCase());
    var tailnetIPv4 = (0, tailnet_js_1.pickPrimaryTailnetIPv4)();
    if (tailnetIPv4 && normalized === tailnetIPv4.toLowerCase()) {
        return true;
    }
    var tailnetIPv6 = (0, tailnet_js_1.pickPrimaryTailnetIPv6)();
    if (tailnetIPv6 && ip.trim().toLowerCase() === tailnetIPv6.toLowerCase()) {
        return true;
    }
    return false;
}
/**
 * Resolves gateway bind host with fallback strategy.
 *
 * Modes:
 * - loopback: 127.0.0.1 (rarely fails, but handled gracefully)
 * - lan: always 0.0.0.0 (no fallback)
 * - tailnet: Tailnet IPv4 if available, else loopback
 * - auto: Loopback if available, else 0.0.0.0
 * - custom: User-specified IP, fallback to 0.0.0.0 if unavailable
 *
 * @returns The bind address to use (never null)
 */
function resolveGatewayBindHost(bind, customHost) {
    return __awaiter(this, void 0, void 0, function () {
        var mode, tailnetIP, _a, host, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mode = bind !== null && bind !== void 0 ? bind : "loopback";
                    if (!(mode === "loopback")) return [3 /*break*/, 2];
                    return [4 /*yield*/, canBindToHost("127.0.0.1")];
                case 1:
                    // 127.0.0.1 rarely fails, but handle gracefully
                    if (_c.sent()) {
                        return [2 /*return*/, "127.0.0.1"];
                    }
                    return [2 /*return*/, "0.0.0.0"]; // extreme fallback
                case 2:
                    if (!(mode === "tailnet")) return [3 /*break*/, 6];
                    tailnetIP = (0, tailnet_js_1.pickPrimaryTailnetIPv4)();
                    _a = tailnetIP;
                    if (!_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, canBindToHost(tailnetIP)];
                case 3:
                    _a = (_c.sent());
                    _c.label = 4;
                case 4:
                    if (_a) {
                        return [2 /*return*/, tailnetIP];
                    }
                    return [4 /*yield*/, canBindToHost("127.0.0.1")];
                case 5:
                    if (_c.sent()) {
                        return [2 /*return*/, "127.0.0.1"];
                    }
                    return [2 /*return*/, "0.0.0.0"];
                case 6:
                    if (mode === "lan") {
                        return [2 /*return*/, "0.0.0.0"];
                    }
                    if (!(mode === "custom")) return [3 /*break*/, 9];
                    host = customHost === null || customHost === void 0 ? void 0 : customHost.trim();
                    if (!host) {
                        return [2 /*return*/, "0.0.0.0"];
                    } // invalid config → fall back to all
                    _b = isValidIPv4(host);
                    if (!_b) return [3 /*break*/, 8];
                    return [4 /*yield*/, canBindToHost(host)];
                case 7:
                    _b = (_c.sent());
                    _c.label = 8;
                case 8:
                    if (_b) {
                        return [2 /*return*/, host];
                    }
                    // Custom IP failed → fall back to LAN
                    return [2 /*return*/, "0.0.0.0"];
                case 9:
                    if (!(mode === "auto")) return [3 /*break*/, 11];
                    return [4 /*yield*/, canBindToHost("127.0.0.1")];
                case 10:
                    if (_c.sent()) {
                        return [2 /*return*/, "127.0.0.1"];
                    }
                    return [2 /*return*/, "0.0.0.0"];
                case 11: return [2 /*return*/, "0.0.0.0"];
            }
        });
    });
}
/**
 * Test if we can bind to a specific host address.
 * Creates a temporary server, attempts to bind, then closes it.
 *
 * @param host - The host address to test
 * @returns True if we can successfully bind to this address
 */
function canBindToHost(host) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var testServer = node_net_1.default.createServer();
                    testServer.once("error", function () {
                        resolve(false);
                    });
                    testServer.once("listening", function () {
                        testServer.close();
                        resolve(true);
                    });
                    // Use port 0 to let OS pick an available port for testing
                    testServer.listen(0, host);
                })];
        });
    });
}
function resolveGatewayListenHosts(bindHost, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var canBind;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (bindHost !== "127.0.0.1") {
                        return [2 /*return*/, [bindHost]];
                    }
                    canBind = (_a = opts === null || opts === void 0 ? void 0 : opts.canBindToHost) !== null && _a !== void 0 ? _a : canBindToHost;
                    return [4 /*yield*/, canBind("::1")];
                case 1:
                    if (_b.sent()) {
                        return [2 /*return*/, [bindHost, "::1"]];
                    }
                    return [2 /*return*/, [bindHost]];
            }
        });
    });
}
/**
 * Validate if a string is a valid IPv4 address.
 *
 * @param host - The string to validate
 * @returns True if valid IPv4 format
 */
function isValidIPv4(host) {
    var parts = host.split(".");
    if (parts.length !== 4) {
        return false;
    }
    return parts.every(function (part) {
        var n = parseInt(part, 10);
        return !Number.isNaN(n) && n >= 0 && n <= 255 && part === String(n);
    });
}
function isLoopbackHost(host) {
    return isLoopbackAddress(host);
}
