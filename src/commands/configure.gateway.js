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
exports.promptGatewayConfig = promptGatewayConfig;
var config_js_1 = require("../config/config.js");
var tailscale_js_1 = require("../infra/tailscale.js");
var note_js_1 = require("../terminal/note.js");
var configure_gateway_auth_js_1 = require("./configure.gateway-auth.js");
var configure_shared_js_1 = require("./configure.shared.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
function promptGatewayConfig(cfg, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var portRaw, _a, port, bind, _b, customBindHost, input, _c, authMode, _d, tailscaleMode, _e, tailscaleBin, tailscaleResetOnExit, _f, _g, gatewayToken, gatewayPassword, next, tokenInput, _h, password, _j, authConfig;
        var _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _a = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.text)({
                            message: "Gateway port",
                            initialValue: String((0, config_js_1.resolveGatewayPort)(cfg)),
                            validate: function (value) { return (Number.isFinite(Number(value)) ? undefined : "Invalid port"); },
                        })];
                case 1:
                    portRaw = _a.apply(void 0, [_m.sent(), runtime]);
                    port = Number.parseInt(String(portRaw), 10);
                    _b = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.select)({
                            message: "Gateway bind mode",
                            options: [
                                {
                                    value: "loopback",
                                    label: "Loopback (Local only)",
                                    hint: "Bind to 127.0.0.1 - secure, local-only access",
                                },
                                {
                                    value: "tailnet",
                                    label: "Tailnet (Tailscale IP)",
                                    hint: "Bind to your Tailscale IP only (100.x.x.x)",
                                },
                                {
                                    value: "auto",
                                    label: "Auto (Loopback → LAN)",
                                    hint: "Prefer loopback; fall back to all interfaces if unavailable",
                                },
                                {
                                    value: "lan",
                                    label: "LAN (All interfaces)",
                                    hint: "Bind to 0.0.0.0 - accessible from anywhere on your network",
                                },
                                {
                                    value: "custom",
                                    label: "Custom IP",
                                    hint: "Specify a specific IP address, with 0.0.0.0 fallback if unavailable",
                                },
                            ],
                        })];
                case 2:
                    bind = _b.apply(void 0, [_m.sent(), runtime]);
                    if (!(bind === "custom")) return [3 /*break*/, 4];
                    _c = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.text)({
                            message: "Custom IP address",
                            placeholder: "192.168.1.100",
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
                case 3:
                    input = _c.apply(void 0, [_m.sent(), runtime]);
                    customBindHost = typeof input === "string" ? input : undefined;
                    _m.label = 4;
                case 4:
                    _d = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.select)({
                            message: "Gateway auth",
                            options: [
                                { value: "token", label: "Token", hint: "Recommended default" },
                                { value: "password", label: "Password" },
                            ],
                            initialValue: "token",
                        })];
                case 5:
                    authMode = _d.apply(void 0, [_m.sent(), runtime]);
                    _e = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.select)({
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
                case 6:
                    tailscaleMode = _e.apply(void 0, [_m.sent(), runtime]);
                    if (!(tailscaleMode !== "off")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, tailscale_js_1.findTailscaleBinary)()];
                case 7:
                    tailscaleBin = _m.sent();
                    if (!tailscaleBin) {
                        (0, note_js_1.note)([
                            "Tailscale binary not found in PATH or /Applications.",
                            "Ensure Tailscale is installed from:",
                            "  https://tailscale.com/download/mac",
                            "",
                            "You can continue setup, but serve/funnel will fail at runtime.",
                        ].join("\n"), "Tailscale Warning");
                    }
                    _m.label = 8;
                case 8:
                    tailscaleResetOnExit = false;
                    if (!(tailscaleMode !== "off")) return [3 /*break*/, 10];
                    (0, note_js_1.note)(["Docs:", "https://docs.openclaw.ai/gateway/tailscale", "https://docs.openclaw.ai/web"].join("\n"), "Tailscale");
                    _f = Boolean;
                    _g = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.confirm)({
                            message: "Reset Tailscale serve/funnel on exit?",
                            initialValue: false,
                        })];
                case 9:
                    tailscaleResetOnExit = _f.apply(void 0, [_g.apply(void 0, [_m.sent(), runtime])]);
                    _m.label = 10;
                case 10:
                    if (tailscaleMode !== "off" && bind !== "loopback") {
                        (0, note_js_1.note)("Tailscale requires bind=loopback. Adjusting bind to loopback.", "Note");
                        bind = "loopback";
                    }
                    if (tailscaleMode === "funnel" && authMode !== "password") {
                        (0, note_js_1.note)("Tailscale funnel requires password auth.", "Note");
                        authMode = "password";
                    }
                    next = cfg;
                    if (!(authMode === "token")) return [3 /*break*/, 12];
                    _h = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.text)({
                            message: "Gateway token (blank to generate)",
                            initialValue: (0, onboard_helpers_js_1.randomToken)(),
                        })];
                case 11:
                    tokenInput = _h.apply(void 0, [_m.sent(), runtime]);
                    gatewayToken = (0, onboard_helpers_js_1.normalizeGatewayTokenInput)(tokenInput) || (0, onboard_helpers_js_1.randomToken)();
                    _m.label = 12;
                case 12:
                    if (!(authMode === "password")) return [3 /*break*/, 14];
                    _j = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.text)({
                            message: "Gateway password",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 13:
                    password = _j.apply(void 0, [_m.sent(), runtime]);
                    gatewayPassword = String(password).trim();
                    _m.label = 14;
                case 14:
                    authConfig = (0, configure_gateway_auth_js_1.buildGatewayAuthConfig)({
                        existing: (_k = next.gateway) === null || _k === void 0 ? void 0 : _k.auth,
                        mode: authMode,
                        token: gatewayToken,
                        password: gatewayPassword,
                    });
                    next = __assign(__assign({}, next), { gateway: __assign(__assign(__assign(__assign({}, next.gateway), { mode: "local", port: port, bind: bind, auth: authConfig }), (customBindHost && { customBindHost: customBindHost })), { tailscale: __assign(__assign({}, (_l = next.gateway) === null || _l === void 0 ? void 0 : _l.tailscale), { mode: tailscaleMode, resetOnExit: tailscaleResetOnExit }) }) });
                    return [2 /*return*/, { config: next, port: port, token: gatewayToken }];
            }
        });
    });
}
