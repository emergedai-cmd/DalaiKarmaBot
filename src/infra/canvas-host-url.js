"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCanvasHostUrl = resolveCanvasHostUrl;
var isLoopbackHost = function (value) {
    var normalized = value.trim().toLowerCase();
    if (!normalized) {
        return false;
    }
    if (normalized === "localhost") {
        return true;
    }
    if (normalized === "::1") {
        return true;
    }
    if (normalized === "0.0.0.0" || normalized === "::") {
        return true;
    }
    return normalized.startsWith("127.");
};
var normalizeHost = function (value, rejectLoopback) {
    if (!value) {
        return "";
    }
    var trimmed = value.trim();
    if (!trimmed) {
        return "";
    }
    if (rejectLoopback && isLoopbackHost(trimmed)) {
        return "";
    }
    return trimmed;
};
var parseHostHeader = function (value) {
    if (!value) {
        return "";
    }
    try {
        return new URL("http://".concat(String(value).trim())).hostname;
    }
    catch (_a) {
        return "";
    }
};
var parseForwardedProto = function (value) {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
};
function resolveCanvasHostUrl(params) {
    var _a, _b;
    var port = params.canvasPort;
    if (!port) {
        return undefined;
    }
    var scheme = (_a = params.scheme) !== null && _a !== void 0 ? _a : (((_b = parseForwardedProto(params.forwardedProto)) === null || _b === void 0 ? void 0 : _b.trim()) === "https" ? "https" : "http");
    var override = normalizeHost(params.hostOverride, true);
    var requestHost = normalizeHost(parseHostHeader(params.requestHost), !!override);
    var localAddress = normalizeHost(params.localAddress, Boolean(override || requestHost));
    var host = override || requestHost || localAddress;
    if (!host) {
        return undefined;
    }
    var formatted = host.includes(":") ? "[".concat(host, "]") : host;
    return "".concat(scheme, "://").concat(formatted, ":").concat(port);
}
