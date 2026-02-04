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
var vitest_1 = require("vitest");
var bonjour_discovery_js_1 = require("./bonjour-discovery.js");
var WIDE_AREA_DOMAIN = "openclaw.internal.";
(0, vitest_1.describe)("bonjour-discovery", function () {
    (0, vitest_1.it)("discovers beacons on darwin across local + wide-area domains", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, studioInstance, run, beacons, browseCalls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    calls = [];
                    studioInstance = "Peter’s Mac Studio Gateway";
                    run = vitest_1.vi.fn(function (argv, options) { return __awaiter(void 0, void 0, void 0, function () {
                        var domain, instance, host, tailnetDns, displayName, txtParts;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            calls.push({ argv: argv, timeoutMs: options.timeoutMs });
                            domain = (_a = argv[3]) !== null && _a !== void 0 ? _a : "";
                            if (argv[0] === "dns-sd" && argv[1] === "-B") {
                                if (domain === "local.") {
                                    return [2 /*return*/, {
                                            stdout: [
                                                "Add 2 3 local. _openclaw-gw._tcp. Peter\\226\\128\\153s Mac Studio Gateway",
                                                "Add 2 3 local. _openclaw-gw._tcp. Laptop Gateway",
                                                "",
                                            ].join("\n"),
                                            stderr: "",
                                            code: 0,
                                            signal: null,
                                            killed: false,
                                        }];
                                }
                                if (domain === WIDE_AREA_DOMAIN) {
                                    return [2 /*return*/, {
                                            stdout: ["Add 2 3 ".concat(WIDE_AREA_DOMAIN, " _openclaw-gw._tcp. Tailnet Gateway"), ""].join("\n"),
                                            stderr: "",
                                            code: 0,
                                            signal: null,
                                            killed: false,
                                        }];
                                }
                            }
                            if (argv[0] === "dns-sd" && argv[1] === "-L") {
                                instance = (_b = argv[2]) !== null && _b !== void 0 ? _b : "";
                                host = instance === studioInstance
                                    ? "studio.local"
                                    : instance === "Laptop Gateway"
                                        ? "laptop.local"
                                        : "tailnet.local";
                                tailnetDns = instance === "Tailnet Gateway" ? "studio.tailnet.ts.net" : "";
                                displayName = instance === studioInstance
                                    ? "Peter’s\\032Mac\\032Studio"
                                    : instance.replace(" Gateway", "");
                                txtParts = [
                                    "txtvers=1",
                                    "displayName=".concat(displayName),
                                    "lanHost=".concat(host),
                                    "gatewayPort=18789",
                                    "sshPort=22",
                                    tailnetDns ? "tailnetDns=".concat(tailnetDns) : null,
                                ].filter(function (v) { return Boolean(v); });
                                return [2 /*return*/, {
                                        stdout: [
                                            "".concat(instance, "._openclaw-gw._tcp. can be reached at ").concat(host, ":18789"),
                                            txtParts.join(" "),
                                            "",
                                        ].join("\n"),
                                        stderr: "",
                                        code: 0,
                                        signal: null,
                                        killed: false,
                                    }];
                            }
                            throw new Error("unexpected argv: ".concat(argv.join(" ")));
                        });
                    }); });
                    return [4 /*yield*/, (0, bonjour_discovery_js_1.discoverGatewayBeacons)({
                            platform: "darwin",
                            timeoutMs: 1234,
                            wideAreaDomain: WIDE_AREA_DOMAIN,
                            run: run,
                        })];
                case 1:
                    beacons = _a.sent();
                    (0, vitest_1.expect)(beacons).toHaveLength(3);
                    (0, vitest_1.expect)(beacons).toEqual(vitest_1.expect.arrayContaining([
                        vitest_1.expect.objectContaining({
                            instanceName: studioInstance,
                            displayName: "Peter’s Mac Studio",
                        }),
                    ]));
                    (0, vitest_1.expect)(beacons.map(function (b) { return b.domain; })).toEqual(vitest_1.expect.arrayContaining(["local.", WIDE_AREA_DOMAIN]));
                    browseCalls = calls.filter(function (c) { return c.argv[0] === "dns-sd" && c.argv[1] === "-B"; });
                    (0, vitest_1.expect)(browseCalls.map(function (c) { return c.argv[3]; })).toEqual(vitest_1.expect.arrayContaining(["local.", WIDE_AREA_DOMAIN]));
                    (0, vitest_1.expect)(browseCalls.every(function (c) { return c.timeoutMs === 1234; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("decodes dns-sd octal escapes in TXT displayName", function () { return __awaiter(void 0, void 0, void 0, function () {
        var run, beacons;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    run = vitest_1.vi.fn(function (argv, options) { return __awaiter(void 0, void 0, void 0, function () {
                        var domain;
                        var _a;
                        return __generator(this, function (_b) {
                            if (options.timeoutMs < 0) {
                                throw new Error("invalid timeout");
                            }
                            domain = (_a = argv[3]) !== null && _a !== void 0 ? _a : "";
                            if (argv[0] === "dns-sd" && argv[1] === "-B" && domain === "local.") {
                                return [2 /*return*/, {
                                        stdout: ["Add 2 3 local. _openclaw-gw._tcp. Studio Gateway", ""].join("\n"),
                                        stderr: "",
                                        code: 0,
                                        signal: null,
                                        killed: false,
                                    }];
                            }
                            if (argv[0] === "dns-sd" && argv[1] === "-L") {
                                return [2 /*return*/, {
                                        stdout: [
                                            "Studio Gateway._openclaw-gw._tcp. can be reached at studio.local:18789",
                                            "txtvers=1 displayName=Peter\\226\\128\\153s\\032Mac\\032Studio lanHost=studio.local gatewayPort=18789 sshPort=22",
                                            "",
                                        ].join("\n"),
                                        stderr: "",
                                        code: 0,
                                        signal: null,
                                        killed: false,
                                    }];
                            }
                            return [2 /*return*/, {
                                    stdout: "",
                                    stderr: "",
                                    code: 0,
                                    signal: null,
                                    killed: false,
                                }];
                        });
                    }); });
                    return [4 /*yield*/, (0, bonjour_discovery_js_1.discoverGatewayBeacons)({
                            platform: "darwin",
                            timeoutMs: 800,
                            domains: ["local."],
                            run: run,
                        })];
                case 1:
                    beacons = _a.sent();
                    (0, vitest_1.expect)(beacons).toEqual([
                        vitest_1.expect.objectContaining({
                            domain: "local.",
                            instanceName: "Studio Gateway",
                            displayName: "Peter’s Mac Studio",
                            txt: vitest_1.expect.objectContaining({
                                displayName: "Peter’s Mac Studio",
                            }),
                        }),
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to tailnet DNS probing for wide-area when split DNS is not configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, zone, serviceBase, studioService, run, beacons;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    calls = [];
                    zone = WIDE_AREA_DOMAIN.replace(/\.$/, "");
                    serviceBase = "_openclaw-gw._tcp.".concat(zone);
                    studioService = "studio-gateway.".concat(serviceBase);
                    run = vitest_1.vi.fn(function (argv, options) { return __awaiter(void 0, void 0, void 0, function () {
                        var cmd, at, server, qname, qtype;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            calls.push({ argv: argv, timeoutMs: options.timeoutMs });
                            cmd = argv[0];
                            if (cmd === "dns-sd" && argv[1] === "-B") {
                                return [2 /*return*/, {
                                        stdout: "",
                                        stderr: "",
                                        code: 0,
                                        signal: null,
                                        killed: false,
                                    }];
                            }
                            if (cmd === "tailscale" && argv[1] === "status" && argv[2] === "--json") {
                                return [2 /*return*/, {
                                        stdout: JSON.stringify({
                                            Self: { TailscaleIPs: ["100.69.232.64"] },
                                            Peer: {
                                                "peer-1": { TailscaleIPs: ["100.123.224.76"] },
                                            },
                                        }),
                                        stderr: "",
                                        code: 0,
                                        signal: null,
                                        killed: false,
                                    }];
                            }
                            if (cmd === "dig") {
                                at = (_a = argv.find(function (a) { return a.startsWith("@"); })) !== null && _a !== void 0 ? _a : "";
                                server = at.replace(/^@/, "");
                                qname = (_b = argv[argv.length - 2]) !== null && _b !== void 0 ? _b : "";
                                qtype = (_c = argv[argv.length - 1]) !== null && _c !== void 0 ? _c : "";
                                if (server === "100.123.224.76" && qtype === "PTR" && qname === serviceBase) {
                                    return [2 /*return*/, {
                                            stdout: "".concat(studioService, ".\n"),
                                            stderr: "",
                                            code: 0,
                                            signal: null,
                                            killed: false,
                                        }];
                                }
                                if (server === "100.123.224.76" && qtype === "SRV" && qname === studioService) {
                                    return [2 /*return*/, {
                                            stdout: "0 0 18789 studio.".concat(zone, ".\n"),
                                            stderr: "",
                                            code: 0,
                                            signal: null,
                                            killed: false,
                                        }];
                                }
                                if (server === "100.123.224.76" && qtype === "TXT" && qname === studioService) {
                                    return [2 /*return*/, {
                                            stdout: [
                                                "\"displayName=Studio\"",
                                                "\"gatewayPort=18789\"",
                                                "\"transport=gateway\"",
                                                "\"sshPort=22\"",
                                                "\"tailnetDns=peters-mac-studio-1.sheep-coho.ts.net\"",
                                                "\"cliPath=/opt/homebrew/bin/openclaw\"",
                                                "",
                                            ].join(" "),
                                            stderr: "",
                                            code: 0,
                                            signal: null,
                                            killed: false,
                                        }];
                                }
                            }
                            throw new Error("unexpected argv: ".concat(argv.join(" ")));
                        });
                    }); });
                    return [4 /*yield*/, (0, bonjour_discovery_js_1.discoverGatewayBeacons)({
                            platform: "darwin",
                            timeoutMs: 1200,
                            domains: [WIDE_AREA_DOMAIN],
                            wideAreaDomain: WIDE_AREA_DOMAIN,
                            run: run,
                        })];
                case 1:
                    beacons = _a.sent();
                    (0, vitest_1.expect)(beacons).toEqual([
                        vitest_1.expect.objectContaining({
                            domain: WIDE_AREA_DOMAIN,
                            instanceName: "studio-gateway",
                            displayName: "Studio",
                            host: "studio.".concat(zone),
                            port: 18789,
                            tailnetDns: "peters-mac-studio-1.sheep-coho.ts.net",
                            gatewayPort: 18789,
                            sshPort: 22,
                            cliPath: "/opt/homebrew/bin/openclaw",
                        }),
                    ]);
                    (0, vitest_1.expect)(calls.some(function (c) { return c.argv[0] === "tailscale" && c.argv[1] === "status"; })).toBe(true);
                    (0, vitest_1.expect)(calls.some(function (c) { return c.argv[0] === "dig"; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes domains and respects domains override", function () { return __awaiter(void 0, void 0, void 0, function () {
        var calls, run;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    calls = [];
                    run = vitest_1.vi.fn(function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            calls.push(argv);
                            return [2 /*return*/, {
                                    stdout: "",
                                    stderr: "",
                                    code: 0,
                                    signal: null,
                                    killed: false,
                                }];
                        });
                    }); });
                    return [4 /*yield*/, (0, bonjour_discovery_js_1.discoverGatewayBeacons)({
                            platform: "darwin",
                            timeoutMs: 1,
                            domains: ["local", "openclaw.internal"],
                            run: run,
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(calls.filter(function (c) { return c[1] === "-B"; }).map(function (c) { return c[3]; })).toEqual(vitest_1.expect.arrayContaining(["local.", "openclaw.internal."]));
                    calls.length = 0;
                    return [4 /*yield*/, (0, bonjour_discovery_js_1.discoverGatewayBeacons)({
                            platform: "darwin",
                            timeoutMs: 1,
                            domains: ["local."],
                            run: run,
                        })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(calls.filter(function (c) { return c[1] === "-B"; })).toHaveLength(1);
                    (0, vitest_1.expect)((_a = calls.filter(function (c) { return c[1] === "-B"; })[0]) === null || _a === void 0 ? void 0 : _a[3]).toBe("local.");
                    return [2 /*return*/];
            }
        });
    }); });
});
