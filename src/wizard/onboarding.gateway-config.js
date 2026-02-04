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
exports.configureGatewayForOnboarding = configureGatewayForOnboarding;
var onboard_helpers_js_1 = require("../commands/onboard-helpers.js");
var tailscale_js_1 = require("../infra/tailscale.js");
function configureGatewayForOnboarding(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var flow, localPort, quickstartGateway, prompter, nextConfig, port, _a, _b, _c, _d, bind, _e, customBindHost, needsPrompt, input, authMode, _f, tailscaleMode, _g, tailscaleBin, tailscaleResetOnExit, _h, gatewayToken, tokenInput, password, _j;
        var _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    flow = opts.flow, localPort = opts.localPort, quickstartGateway = opts.quickstartGateway, prompter = opts.prompter;
                    nextConfig = opts.nextConfig;
                    if (!(flow === "quickstart")) return [3 /*break*/, 1];
                    _a = quickstartGateway.port;
                    return [3 /*break*/, 3];
                case 1:
                    _c = (_b = Number).parseInt;
                    _d = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Gateway port",
                            initialValue: String(localPort),
                            validate: function (value) { return (Number.isFinite(Number(value)) ? undefined : "Invalid port"); },
                        })];
                case 2:
                    _a = _c.apply(_b, [_d.apply(void 0, [_q.sent()]),
                        10]);
                    _q.label = 3;
                case 3:
                    port = _a;
                    if (!(flow === "quickstart")) return [3 /*break*/, 4];
                    _e = quickstartGateway.bind;
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, prompter.select({
                        message: "Gateway bind",
                        options: [
                            { value: "loopback", label: "Loopback (127.0.0.1)" },
                            { value: "lan", label: "LAN (0.0.0.0)" },
                            { value: "tailnet", label: "Tailnet (Tailscale IP)" },
                            { value: "auto", label: "Auto (Loopback → LAN)" },
                            { value: "custom", label: "Custom IP" },
                        ],
                    })];
                case 5:
                    _e = _q.sent();
                    _q.label = 6;
                case 6:
                    bind = _e;
                    customBindHost = quickstartGateway.customBindHost;
                    if (!(bind === "custom")) return [3 /*break*/, 8];
                    needsPrompt = flow !== "quickstart" || !customBindHost;
                    if (!needsPrompt) return [3 /*break*/, 8];
                    return [4 /*yield*/, prompter.text({
                            message: "Custom IP address",
                            placeholder: "192.168.1.100",
                            initialValue: customBindHost !== null && customBindHost !== void 0 ? customBindHost : "",
                            validate: function (value) {
                                if (!value) {
                                    return "IP address is required for custom bind mode";
                                }
                                var trimmed = value.trim();
                                var parts = trimmed.split(".");
                                if (parts.length !== 4) {
                                    return "Invalid IPv4 address (e.g., 192.168.1.100)";
                                }
                                if (parts.every(function (part) {
                                    var n = parseInt(part, 10);
                                    return !Number.isNaN(n) && n >= 0 && n <= 255 && part === String(n);
                                })) {
                                    return undefined;
                                }
                                return "Invalid IPv4 address (each octet must be 0-255)";
                            },
                        })];
                case 7:
                    input = _q.sent();
                    customBindHost = typeof input === "string" ? input.trim() : undefined;
                    _q.label = 8;
                case 8:
                    if (!(flow === "quickstart")) return [3 /*break*/, 9];
                    _f = quickstartGateway.authMode;
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, prompter.select({
                        message: "Gateway auth",
                        options: [
                            {
                                value: "token",
                                label: "Token",
                                hint: "Recommended default (local + remote)",
                            },
                            { value: "password", label: "Password" },
                        ],
                        initialValue: "token",
                    })];
                case 10:
                    _f = (_q.sent());
                    _q.label = 11;
                case 11:
                    authMode = _f;
                    if (!(flow === "quickstart")) return [3 /*break*/, 12];
                    _g = quickstartGateway.tailscaleMode;
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, prompter.select({
                        message: "Tailscale exposure",
                        options: [
                            { value: "off", label: "Off", hint: "No Tailscale exposure" },
                            {
                                value: "serve",
                                label: "Serve",
                                hint: "Private HTTPS for your tailnet (devices on Tailscale)",
                            },
                            {
                                value: "funnel",
                                label: "Funnel",
                                hint: "Public HTTPS via Tailscale Funnel (internet)",
                            },
                        ],
                    })];
                case 13:
                    _g = _q.sent();
                    _q.label = 14;
                case 14:
                    tailscaleMode = _g;
                    if (!(tailscaleMode !== "off")) return [3 /*break*/, 17];
                    return [4 /*yield*/, (0, tailscale_js_1.findTailscaleBinary)()];
                case 15:
                    tailscaleBin = _q.sent();
                    if (!!tailscaleBin) return [3 /*break*/, 17];
                    return [4 /*yield*/, prompter.note([
                            "Tailscale binary not found in PATH or /Applications.",
                            "Ensure Tailscale is installed from:",
                            "  https://tailscale.com/download/mac",
                            "",
                            "You can continue setup, but serve/funnel will fail at runtime.",
                        ].join("\n"), "Tailscale Warning")];
                case 16:
                    _q.sent();
                    _q.label = 17;
                case 17:
                    tailscaleResetOnExit = flow === "quickstart" ? quickstartGateway.tailscaleResetOnExit : false;
                    if (!(tailscaleMode !== "off" && flow !== "quickstart")) return [3 /*break*/, 20];
                    return [4 /*yield*/, prompter.note(["Docs:", "https://docs.openclaw.ai/gateway/tailscale", "https://docs.openclaw.ai/web"].join("\n"), "Tailscale")];
                case 18:
                    _q.sent();
                    _h = Boolean;
                    return [4 /*yield*/, prompter.confirm({
                            message: "Reset Tailscale serve/funnel on exit?",
                            initialValue: false,
                        })];
                case 19:
                    tailscaleResetOnExit = _h.apply(void 0, [_q.sent()]);
                    _q.label = 20;
                case 20:
                    if (!(tailscaleMode !== "off" && bind !== "loopback")) return [3 /*break*/, 22];
                    return [4 /*yield*/, prompter.note("Tailscale requires bind=loopback. Adjusting bind to loopback.", "Note")];
                case 21:
                    _q.sent();
                    bind = "loopback";
                    customBindHost = undefined;
                    _q.label = 22;
                case 22:
                    if (!(tailscaleMode === "funnel" && authMode !== "password")) return [3 /*break*/, 24];
                    return [4 /*yield*/, prompter.note("Tailscale funnel requires password auth.", "Note")];
                case 23:
                    _q.sent();
                    authMode = "password";
                    _q.label = 24;
                case 24:
                    if (!(authMode === "token")) return [3 /*break*/, 27];
                    if (!(flow === "quickstart")) return [3 /*break*/, 25];
                    gatewayToken = (_k = quickstartGateway.token) !== null && _k !== void 0 ? _k : (0, onboard_helpers_js_1.randomToken)();
                    return [3 /*break*/, 27];
                case 25: return [4 /*yield*/, prompter.text({
                        message: "Gateway token (blank to generate)",
                        placeholder: "Needed for multi-machine or non-loopback access",
                        initialValue: (_l = quickstartGateway.token) !== null && _l !== void 0 ? _l : "",
                    })];
                case 26:
                    tokenInput = _q.sent();
                    gatewayToken = (0, onboard_helpers_js_1.normalizeGatewayTokenInput)(tokenInput) || (0, onboard_helpers_js_1.randomToken)();
                    _q.label = 27;
                case 27:
                    if (!(authMode === "password")) return [3 /*break*/, 31];
                    if (!(flow === "quickstart" && quickstartGateway.password)) return [3 /*break*/, 28];
                    _j = quickstartGateway.password;
                    return [3 /*break*/, 30];
                case 28: return [4 /*yield*/, prompter.text({
                        message: "Gateway password",
                        validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                    })];
                case 29:
                    _j = _q.sent();
                    _q.label = 30;
                case 30:
                    password = _j;
                    nextConfig = __assign(__assign({}, nextConfig), { gateway: __assign(__assign({}, nextConfig.gateway), { auth: __assign(__assign({}, (_m = nextConfig.gateway) === null || _m === void 0 ? void 0 : _m.auth), { mode: "password", password: String(password).trim() }) }) });
                    return [3 /*break*/, 32];
                case 31:
                    if (authMode === "token") {
                        nextConfig = __assign(__assign({}, nextConfig), { gateway: __assign(__assign({}, nextConfig.gateway), { auth: __assign(__assign({}, (_o = nextConfig.gateway) === null || _o === void 0 ? void 0 : _o.auth), { mode: "token", token: gatewayToken }) }) });
                    }
                    _q.label = 32;
                case 32:
                    nextConfig = __assign(__assign({}, nextConfig), { gateway: __assign(__assign(__assign(__assign({}, nextConfig.gateway), { port: port, bind: bind }), (bind === "custom" && customBindHost ? { customBindHost: customBindHost } : {})), { tailscale: __assign(__assign({}, (_p = nextConfig.gateway) === null || _p === void 0 ? void 0 : _p.tailscale), { mode: tailscaleMode, resetOnExit: tailscaleResetOnExit }) }) });
                    return [2 /*return*/, {
                            nextConfig: nextConfig,
                            settings: {
                                port: port,
                                bind: bind,
                                customBindHost: bind === "custom" ? customBindHost : undefined,
                                authMode: authMode,
                                gatewayToken: gatewayToken,
                                tailscaleMode: tailscaleMode,
                                tailscaleResetOnExit: tailscaleResetOnExit,
                            },
                        }];
            }
        });
    });
}
