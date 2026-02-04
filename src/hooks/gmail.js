"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HOOKS_PATH = exports.DEFAULT_GMAIL_RENEW_MINUTES = exports.DEFAULT_GMAIL_MAX_BYTES = exports.DEFAULT_GMAIL_SERVE_PATH = exports.DEFAULT_GMAIL_SERVE_PORT = exports.DEFAULT_GMAIL_SERVE_BIND = exports.DEFAULT_GMAIL_SUBSCRIPTION = exports.DEFAULT_GMAIL_TOPIC = exports.DEFAULT_GMAIL_LABEL = void 0;
exports.generateHookToken = generateHookToken;
exports.mergeHookPresets = mergeHookPresets;
exports.normalizeHooksPath = normalizeHooksPath;
exports.normalizeServePath = normalizeServePath;
exports.buildDefaultHookUrl = buildDefaultHookUrl;
exports.resolveGmailHookRuntimeConfig = resolveGmailHookRuntimeConfig;
exports.buildGogWatchStartArgs = buildGogWatchStartArgs;
exports.buildGogWatchServeArgs = buildGogWatchServeArgs;
exports.buildTopicPath = buildTopicPath;
exports.parseTopicPath = parseTopicPath;
var node_crypto_1 = require("node:crypto");
var config_js_1 = require("../config/config.js");
exports.DEFAULT_GMAIL_LABEL = "INBOX";
exports.DEFAULT_GMAIL_TOPIC = "gog-gmail-watch";
exports.DEFAULT_GMAIL_SUBSCRIPTION = "gog-gmail-watch-push";
exports.DEFAULT_GMAIL_SERVE_BIND = "127.0.0.1";
exports.DEFAULT_GMAIL_SERVE_PORT = 8788;
exports.DEFAULT_GMAIL_SERVE_PATH = "/gmail-pubsub";
exports.DEFAULT_GMAIL_MAX_BYTES = 20000;
exports.DEFAULT_GMAIL_RENEW_MINUTES = 12 * 60;
exports.DEFAULT_HOOKS_PATH = "/hooks";
function generateHookToken(bytes) {
    if (bytes === void 0) { bytes = 24; }
    return (0, node_crypto_1.randomBytes)(bytes).toString("hex");
}
function mergeHookPresets(existing, preset) {
    var next = new Set((existing !== null && existing !== void 0 ? existing : []).map(function (item) { return item.trim(); }).filter(Boolean));
    next.add(preset);
    return Array.from(next);
}
function normalizeHooksPath(raw) {
    var base = (raw === null || raw === void 0 ? void 0 : raw.trim()) || exports.DEFAULT_HOOKS_PATH;
    if (base === "/") {
        return exports.DEFAULT_HOOKS_PATH;
    }
    var withSlash = base.startsWith("/") ? base : "/".concat(base);
    return withSlash.replace(/\/+$/, "");
}
function normalizeServePath(raw) {
    var base = (raw === null || raw === void 0 ? void 0 : raw.trim()) || exports.DEFAULT_GMAIL_SERVE_PATH;
    // Tailscale funnel/serve strips the set-path prefix before proxying.
    // To accept requests at /<path> externally, gog must listen on "/".
    if (base === "/") {
        return "/";
    }
    var withSlash = base.startsWith("/") ? base : "/".concat(base);
    return withSlash.replace(/\/+$/, "");
}
function buildDefaultHookUrl(hooksPath, port) {
    if (port === void 0) { port = config_js_1.DEFAULT_GATEWAY_PORT; }
    var basePath = normalizeHooksPath(hooksPath);
    var baseUrl = "http://127.0.0.1:".concat(port);
    return joinUrl(baseUrl, "".concat(basePath, "/gmail"));
}
function resolveGmailHookRuntimeConfig(cfg, overrides) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
    var hooks = cfg.hooks;
    var gmail = hooks === null || hooks === void 0 ? void 0 : hooks.gmail;
    var hookToken = (_b = (_a = overrides.hookToken) !== null && _a !== void 0 ? _a : hooks === null || hooks === void 0 ? void 0 : hooks.token) !== null && _b !== void 0 ? _b : "";
    if (!hookToken) {
        return { ok: false, error: "hooks.token missing (needed for gmail hook)" };
    }
    var account = (_d = (_c = overrides.account) !== null && _c !== void 0 ? _c : gmail === null || gmail === void 0 ? void 0 : gmail.account) !== null && _d !== void 0 ? _d : "";
    if (!account) {
        return { ok: false, error: "gmail account required" };
    }
    var topic = (_f = (_e = overrides.topic) !== null && _e !== void 0 ? _e : gmail === null || gmail === void 0 ? void 0 : gmail.topic) !== null && _f !== void 0 ? _f : "";
    if (!topic) {
        return { ok: false, error: "gmail topic required" };
    }
    var subscription = (_h = (_g = overrides.subscription) !== null && _g !== void 0 ? _g : gmail === null || gmail === void 0 ? void 0 : gmail.subscription) !== null && _h !== void 0 ? _h : exports.DEFAULT_GMAIL_SUBSCRIPTION;
    var pushToken = (_k = (_j = overrides.pushToken) !== null && _j !== void 0 ? _j : gmail === null || gmail === void 0 ? void 0 : gmail.pushToken) !== null && _k !== void 0 ? _k : "";
    if (!pushToken) {
        return { ok: false, error: "gmail push token required" };
    }
    var hookUrl = (_m = (_l = overrides.hookUrl) !== null && _l !== void 0 ? _l : gmail === null || gmail === void 0 ? void 0 : gmail.hookUrl) !== null && _m !== void 0 ? _m : buildDefaultHookUrl(hooks === null || hooks === void 0 ? void 0 : hooks.path, (0, config_js_1.resolveGatewayPort)(cfg));
    var includeBody = (_p = (_o = overrides.includeBody) !== null && _o !== void 0 ? _o : gmail === null || gmail === void 0 ? void 0 : gmail.includeBody) !== null && _p !== void 0 ? _p : true;
    var maxBytesRaw = (_q = overrides.maxBytes) !== null && _q !== void 0 ? _q : gmail === null || gmail === void 0 ? void 0 : gmail.maxBytes;
    var maxBytes = typeof maxBytesRaw === "number" && Number.isFinite(maxBytesRaw) && maxBytesRaw > 0
        ? Math.floor(maxBytesRaw)
        : exports.DEFAULT_GMAIL_MAX_BYTES;
    var renewEveryMinutesRaw = (_r = overrides.renewEveryMinutes) !== null && _r !== void 0 ? _r : gmail === null || gmail === void 0 ? void 0 : gmail.renewEveryMinutes;
    var renewEveryMinutes = typeof renewEveryMinutesRaw === "number" &&
        Number.isFinite(renewEveryMinutesRaw) &&
        renewEveryMinutesRaw > 0
        ? Math.floor(renewEveryMinutesRaw)
        : exports.DEFAULT_GMAIL_RENEW_MINUTES;
    var serveBind = (_u = (_s = overrides.serveBind) !== null && _s !== void 0 ? _s : (_t = gmail === null || gmail === void 0 ? void 0 : gmail.serve) === null || _t === void 0 ? void 0 : _t.bind) !== null && _u !== void 0 ? _u : exports.DEFAULT_GMAIL_SERVE_BIND;
    var servePortRaw = (_v = overrides.servePort) !== null && _v !== void 0 ? _v : (_w = gmail === null || gmail === void 0 ? void 0 : gmail.serve) === null || _w === void 0 ? void 0 : _w.port;
    var servePort = typeof servePortRaw === "number" && Number.isFinite(servePortRaw) && servePortRaw > 0
        ? Math.floor(servePortRaw)
        : exports.DEFAULT_GMAIL_SERVE_PORT;
    var servePathRaw = (_x = overrides.servePath) !== null && _x !== void 0 ? _x : (_y = gmail === null || gmail === void 0 ? void 0 : gmail.serve) === null || _y === void 0 ? void 0 : _y.path;
    var normalizedServePathRaw = typeof servePathRaw === "string" && servePathRaw.trim().length > 0
        ? normalizeServePath(servePathRaw)
        : exports.DEFAULT_GMAIL_SERVE_PATH;
    var tailscaleTargetRaw = (_z = overrides.tailscaleTarget) !== null && _z !== void 0 ? _z : (_0 = gmail === null || gmail === void 0 ? void 0 : gmail.tailscale) === null || _0 === void 0 ? void 0 : _0.target;
    var tailscaleMode = (_3 = (_1 = overrides.tailscaleMode) !== null && _1 !== void 0 ? _1 : (_2 = gmail === null || gmail === void 0 ? void 0 : gmail.tailscale) === null || _2 === void 0 ? void 0 : _2.mode) !== null && _3 !== void 0 ? _3 : "off";
    var tailscaleTarget = tailscaleMode !== "off" &&
        typeof tailscaleTargetRaw === "string" &&
        tailscaleTargetRaw.trim().length > 0
        ? tailscaleTargetRaw.trim()
        : undefined;
    // Tailscale strips the public path before proxying, so listen on "/" when on.
    var servePath = normalizeServePath(tailscaleMode !== "off" && !tailscaleTarget ? "/" : normalizedServePathRaw);
    var tailscalePathRaw = (_4 = overrides.tailscalePath) !== null && _4 !== void 0 ? _4 : (_5 = gmail === null || gmail === void 0 ? void 0 : gmail.tailscale) === null || _5 === void 0 ? void 0 : _5.path;
    var tailscalePath = normalizeServePath(tailscaleMode !== "off"
        ? (tailscalePathRaw !== null && tailscalePathRaw !== void 0 ? tailscalePathRaw : normalizedServePathRaw)
        : (tailscalePathRaw !== null && tailscalePathRaw !== void 0 ? tailscalePathRaw : servePath));
    return {
        ok: true,
        value: {
            account: account,
            label: (_7 = (_6 = overrides.label) !== null && _6 !== void 0 ? _6 : gmail === null || gmail === void 0 ? void 0 : gmail.label) !== null && _7 !== void 0 ? _7 : exports.DEFAULT_GMAIL_LABEL,
            topic: topic,
            subscription: subscription,
            pushToken: pushToken,
            hookToken: hookToken,
            hookUrl: hookUrl,
            includeBody: includeBody,
            maxBytes: maxBytes,
            renewEveryMinutes: renewEveryMinutes,
            serve: {
                bind: serveBind,
                port: servePort,
                path: servePath,
            },
            tailscale: {
                mode: tailscaleMode,
                path: tailscalePath,
                target: tailscaleTarget,
            },
        },
    };
}
function buildGogWatchStartArgs(cfg) {
    return [
        "gmail",
        "watch",
        "start",
        "--account",
        cfg.account,
        "--label",
        cfg.label,
        "--topic",
        cfg.topic,
    ];
}
function buildGogWatchServeArgs(cfg) {
    var args = [
        "gmail",
        "watch",
        "serve",
        "--account",
        cfg.account,
        "--bind",
        cfg.serve.bind,
        "--port",
        String(cfg.serve.port),
        "--path",
        cfg.serve.path,
        "--token",
        cfg.pushToken,
        "--hook-url",
        cfg.hookUrl,
        "--hook-token",
        cfg.hookToken,
    ];
    if (cfg.includeBody) {
        args.push("--include-body");
    }
    if (cfg.maxBytes > 0) {
        args.push("--max-bytes", String(cfg.maxBytes));
    }
    return args;
}
function buildTopicPath(projectId, topicName) {
    return "projects/".concat(projectId, "/topics/").concat(topicName);
}
function parseTopicPath(topic) {
    var _a, _b;
    var match = topic.trim().match(/^projects\/([^/]+)\/topics\/([^/]+)$/i);
    if (!match) {
        return null;
    }
    return { projectId: (_a = match[1]) !== null && _a !== void 0 ? _a : "", topicName: (_b = match[2]) !== null && _b !== void 0 ? _b : "" };
}
function joinUrl(base, path) {
    var url = new URL(base);
    var basePath = url.pathname.replace(/\/+$/, "");
    var extra = path.startsWith("/") ? path : "/".concat(path);
    url.pathname = "".concat(basePath).concat(extra);
    return url.toString();
}
