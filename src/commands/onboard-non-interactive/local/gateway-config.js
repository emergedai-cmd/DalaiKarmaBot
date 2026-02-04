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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyNonInteractiveGatewayConfig = applyNonInteractiveGatewayConfig;
var onboard_helpers_js_1 = require("../../onboard-helpers.js");
function applyNonInteractiveGatewayConfig(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var opts = params.opts, runtime = params.runtime;
    var hasGatewayPort = opts.gatewayPort !== undefined;
    if (hasGatewayPort && (!Number.isFinite(opts.gatewayPort) || ((_a = opts.gatewayPort) !== null && _a !== void 0 ? _a : 0) <= 0)) {
        runtime.error("Invalid --gateway-port");
        runtime.exit(1);
        return null;
    }
    var port = hasGatewayPort ? opts.gatewayPort : params.defaultPort;
    var bind = (_b = opts.gatewayBind) !== null && _b !== void 0 ? _b : "loopback";
    var authModeRaw = (_c = opts.gatewayAuth) !== null && _c !== void 0 ? _c : "token";
    if (authModeRaw !== "token" && authModeRaw !== "password") {
        runtime.error("Invalid --gateway-auth (use token|password).");
        runtime.exit(1);
        return null;
    }
    var authMode = authModeRaw;
    var tailscaleMode = (_d = opts.tailscale) !== null && _d !== void 0 ? _d : "off";
    var tailscaleResetOnExit = Boolean(opts.tailscaleResetOnExit);
    // Tighten config to safe combos:
    // - If Tailscale is on, force loopback bind (the tunnel handles external access).
    // - If using Tailscale Funnel, require password auth.
    if (tailscaleMode !== "off" && bind !== "loopback") {
        bind = "loopback";
    }
    if (tailscaleMode === "funnel" && authMode !== "password") {
        authMode = "password";
    }
    var nextConfig = params.nextConfig;
    var gatewayToken = ((_e = opts.gatewayToken) === null || _e === void 0 ? void 0 : _e.trim()) || undefined;
    if (authMode === "token") {
        if (!gatewayToken) {
            gatewayToken = (0, onboard_helpers_js_1.randomToken)();
        }
        nextConfig = __assign(__assign({}, nextConfig), { gateway: __assign(__assign({}, nextConfig.gateway), { auth: __assign(__assign({}, (_f = nextConfig.gateway) === null || _f === void 0 ? void 0 : _f.auth), { mode: "token", token: gatewayToken }) }) });
    }
    if (authMode === "password") {
        var password = (_g = opts.gatewayPassword) === null || _g === void 0 ? void 0 : _g.trim();
        if (!password) {
            runtime.error("Missing --gateway-password for password auth.");
            runtime.exit(1);
            return null;
        }
        nextConfig = __assign(__assign({}, nextConfig), { gateway: __assign(__assign({}, nextConfig.gateway), { auth: __assign(__assign({}, (_h = nextConfig.gateway) === null || _h === void 0 ? void 0 : _h.auth), { mode: "password", password: password }) }) });
    }
    nextConfig = __assign(__assign({}, nextConfig), { gateway: __assign(__assign({}, nextConfig.gateway), { port: port, bind: bind, tailscale: __assign(__assign({}, (_j = nextConfig.gateway) === null || _j === void 0 ? void 0 : _j.tailscale), { mode: tailscaleMode, resetOnExit: tailscaleResetOnExit }) }) });
    return {
        nextConfig: nextConfig,
        port: port,
        bind: bind,
        authMode: authMode,
        tailscaleMode: tailscaleMode,
        tailscaleResetOnExit: tailscaleResetOnExit,
        gatewayToken: gatewayToken,
    };
}
