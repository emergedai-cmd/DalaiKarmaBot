"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGatewayProbeAuth = resolveGatewayProbeAuth;
exports.pickGatewaySelfPresence = pickGatewaySelfPresence;
function resolveGatewayProbeAuth(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var isRemoteMode = ((_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.mode) === "remote";
    var remote = isRemoteMode ? (_b = cfg.gateway) === null || _b === void 0 ? void 0 : _b.remote : undefined;
    var authToken = (_d = (_c = cfg.gateway) === null || _c === void 0 ? void 0 : _c.auth) === null || _d === void 0 ? void 0 : _d.token;
    var authPassword = (_f = (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.auth) === null || _f === void 0 ? void 0 : _f.password;
    var token = isRemoteMode
        ? typeof (remote === null || remote === void 0 ? void 0 : remote.token) === "string" && remote.token.trim().length > 0
            ? remote.token.trim()
            : undefined
        : ((_g = process.env.OPENCLAW_GATEWAY_TOKEN) === null || _g === void 0 ? void 0 : _g.trim()) ||
            (typeof authToken === "string" && authToken.trim().length > 0 ? authToken.trim() : undefined);
    var password = ((_h = process.env.OPENCLAW_GATEWAY_PASSWORD) === null || _h === void 0 ? void 0 : _h.trim()) ||
        (isRemoteMode
            ? typeof (remote === null || remote === void 0 ? void 0 : remote.password) === "string" && remote.password.trim().length > 0
                ? remote.password.trim()
                : undefined
            : typeof authPassword === "string" && authPassword.trim().length > 0
                ? authPassword.trim()
                : undefined);
    return { token: token, password: password };
}
function pickGatewaySelfPresence(presence) {
    var _a;
    if (!Array.isArray(presence)) {
        return null;
    }
    var entries = presence;
    var self = (_a = entries.find(function (e) { return e.mode === "gateway" && e.reason === "self"; })) !== null && _a !== void 0 ? _a : null;
    if (!self) {
        return null;
    }
    return {
        host: typeof self.host === "string" ? self.host : undefined,
        ip: typeof self.ip === "string" ? self.ip : undefined,
        version: typeof self.version === "string" ? self.version : undefined,
        platform: typeof self.platform === "string" ? self.platform : undefined,
    };
}
