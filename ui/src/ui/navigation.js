"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAB_GROUPS = void 0;
exports.normalizeBasePath = normalizeBasePath;
exports.normalizePath = normalizePath;
exports.pathForTab = pathForTab;
exports.tabFromPath = tabFromPath;
exports.inferBasePathFromPathname = inferBasePathFromPathname;
exports.iconForTab = iconForTab;
exports.titleForTab = titleForTab;
exports.subtitleForTab = subtitleForTab;
exports.TAB_GROUPS = [
    { label: "Chat", tabs: ["chat"] },
    {
        label: "Control",
        tabs: ["overview", "channels", "instances", "sessions", "cron"],
    },
    { label: "Agent", tabs: ["skills", "nodes"] },
    { label: "Settings", tabs: ["config", "debug", "logs"] },
];
var TAB_PATHS = {
    overview: "/overview",
    channels: "/channels",
    instances: "/instances",
    sessions: "/sessions",
    cron: "/cron",
    skills: "/skills",
    nodes: "/nodes",
    chat: "/chat",
    config: "/config",
    debug: "/debug",
    logs: "/logs",
};
var PATH_TO_TAB = new Map(Object.entries(TAB_PATHS).map(function (_a) {
    var tab = _a[0], path = _a[1];
    return [path, tab];
}));
function normalizeBasePath(basePath) {
    if (!basePath) {
        return "";
    }
    var base = basePath.trim();
    if (!base.startsWith("/")) {
        base = "/".concat(base);
    }
    if (base === "/") {
        return "";
    }
    if (base.endsWith("/")) {
        base = base.slice(0, -1);
    }
    return base;
}
function normalizePath(path) {
    if (!path) {
        return "/";
    }
    var normalized = path.trim();
    if (!normalized.startsWith("/")) {
        normalized = "/".concat(normalized);
    }
    if (normalized.length > 1 && normalized.endsWith("/")) {
        normalized = normalized.slice(0, -1);
    }
    return normalized;
}
function pathForTab(tab, basePath) {
    if (basePath === void 0) { basePath = ""; }
    var base = normalizeBasePath(basePath);
    var path = TAB_PATHS[tab];
    return base ? "".concat(base).concat(path) : path;
}
function tabFromPath(pathname, basePath) {
    var _a;
    if (basePath === void 0) { basePath = ""; }
    var base = normalizeBasePath(basePath);
    var path = pathname || "/";
    if (base) {
        if (path === base) {
            path = "/";
        }
        else if (path.startsWith("".concat(base, "/"))) {
            path = path.slice(base.length);
        }
    }
    var normalized = normalizePath(path).toLowerCase();
    if (normalized.endsWith("/index.html")) {
        normalized = "/";
    }
    if (normalized === "/") {
        return "chat";
    }
    return (_a = PATH_TO_TAB.get(normalized)) !== null && _a !== void 0 ? _a : null;
}
function inferBasePathFromPathname(pathname) {
    var normalized = normalizePath(pathname);
    if (normalized.endsWith("/index.html")) {
        normalized = normalizePath(normalized.slice(0, -"/index.html".length));
    }
    if (normalized === "/") {
        return "";
    }
    var segments = normalized.split("/").filter(Boolean);
    if (segments.length === 0) {
        return "";
    }
    for (var i = 0; i < segments.length; i++) {
        var candidate = "/".concat(segments.slice(i).join("/")).toLowerCase();
        if (PATH_TO_TAB.has(candidate)) {
            var prefix = segments.slice(0, i);
            return prefix.length ? "/".concat(prefix.join("/")) : "";
        }
    }
    return "/".concat(segments.join("/"));
}
function iconForTab(tab) {
    switch (tab) {
        case "chat":
            return "messageSquare";
        case "overview":
            return "barChart";
        case "channels":
            return "link";
        case "instances":
            return "radio";
        case "sessions":
            return "fileText";
        case "cron":
            return "loader";
        case "skills":
            return "zap";
        case "nodes":
            return "monitor";
        case "config":
            return "settings";
        case "debug":
            return "bug";
        case "logs":
            return "scrollText";
        default:
            return "folder";
    }
}
function titleForTab(tab) {
    switch (tab) {
        case "overview":
            return "Overview";
        case "channels":
            return "Channels";
        case "instances":
            return "Instances";
        case "sessions":
            return "Sessions";
        case "cron":
            return "Cron Jobs";
        case "skills":
            return "Skills";
        case "nodes":
            return "Nodes";
        case "chat":
            return "Chat";
        case "config":
            return "Config";
        case "debug":
            return "Debug";
        case "logs":
            return "Logs";
        default:
            return "Control";
    }
}
function subtitleForTab(tab) {
    switch (tab) {
        case "overview":
            return "Gateway status, entry points, and a fast health read.";
        case "channels":
            return "Manage channels and settings.";
        case "instances":
            return "Presence beacons from connected clients and nodes.";
        case "sessions":
            return "Inspect active sessions and adjust per-session defaults.";
        case "cron":
            return "Schedule wakeups and recurring agent runs.";
        case "skills":
            return "Manage skill availability and API key injection.";
        case "nodes":
            return "Paired devices, capabilities, and command exposure.";
        case "chat":
            return "Direct gateway chat session for quick interventions.";
        case "config":
            return "Edit ~/.openclaw/openclaw.json safely.";
        case "debug":
            return "Gateway snapshots, events, and manual RPC calls.";
        case "logs":
            return "Live tail of the gateway file logs.";
        default:
            return "";
    }
}
