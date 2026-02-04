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
exports.resolveLinuxUserBinDirs = resolveLinuxUserBinDirs;
exports.getMinimalServicePathParts = getMinimalServicePathParts;
exports.getMinimalServicePathPartsFromEnv = getMinimalServicePathPartsFromEnv;
exports.buildMinimalServicePath = buildMinimalServicePath;
exports.buildServiceEnvironment = buildServiceEnvironment;
exports.buildNodeServiceEnvironment = buildNodeServiceEnvironment;
var node_path_1 = require("node:path");
var version_js_1 = require("../version.js");
var constants_js_1 = require("./constants.js");
function resolveSystemPathDirs(platform) {
    if (platform === "darwin") {
        return ["/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin"];
    }
    if (platform === "linux") {
        return ["/usr/local/bin", "/usr/bin", "/bin"];
    }
    return [];
}
/**
 * Resolve common user bin directories for Linux.
 * These are paths where npm global installs and node version managers typically place binaries.
 */
function resolveLinuxUserBinDirs(home, env) {
    if (!home) {
        return [];
    }
    var dirs = [];
    var add = function (dir) {
        if (dir) {
            dirs.push(dir);
        }
    };
    var appendSubdir = function (base, subdir) {
        if (!base) {
            return undefined;
        }
        return base.endsWith("/".concat(subdir)) ? base : node_path_1.default.posix.join(base, subdir);
    };
    // Env-configured bin roots (override defaults when present).
    add(env === null || env === void 0 ? void 0 : env.PNPM_HOME);
    add(appendSubdir(env === null || env === void 0 ? void 0 : env.NPM_CONFIG_PREFIX, "bin"));
    add(appendSubdir(env === null || env === void 0 ? void 0 : env.BUN_INSTALL, "bin"));
    add(appendSubdir(env === null || env === void 0 ? void 0 : env.VOLTA_HOME, "bin"));
    add(appendSubdir(env === null || env === void 0 ? void 0 : env.ASDF_DATA_DIR, "shims"));
    add(appendSubdir(env === null || env === void 0 ? void 0 : env.NVM_DIR, "current/bin"));
    add(appendSubdir(env === null || env === void 0 ? void 0 : env.FNM_DIR, "current/bin"));
    // Common user bin directories
    dirs.push("".concat(home, "/.local/bin")); // XDG standard, pip, etc.
    dirs.push("".concat(home, "/.npm-global/bin")); // npm custom prefix (recommended for non-root)
    dirs.push("".concat(home, "/bin")); // User's personal bin
    // Node version managers
    dirs.push("".concat(home, "/.nvm/current/bin")); // nvm with current symlink
    dirs.push("".concat(home, "/.fnm/current/bin")); // fnm
    dirs.push("".concat(home, "/.volta/bin")); // Volta
    dirs.push("".concat(home, "/.asdf/shims")); // asdf
    dirs.push("".concat(home, "/.local/share/pnpm")); // pnpm global bin
    dirs.push("".concat(home, "/.bun/bin")); // Bun
    return dirs;
}
function getMinimalServicePathParts(options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var platform = (_a = options.platform) !== null && _a !== void 0 ? _a : process.platform;
    if (platform === "win32") {
        return [];
    }
    var parts = [];
    var extraDirs = (_b = options.extraDirs) !== null && _b !== void 0 ? _b : [];
    var systemDirs = resolveSystemPathDirs(platform);
    // Add Linux user bin directories (npm global, nvm, fnm, volta, etc.)
    var linuxUserDirs = platform === "linux" ? resolveLinuxUserBinDirs(options.home, options.env) : [];
    var add = function (dir) {
        if (!dir) {
            return;
        }
        if (!parts.includes(dir)) {
            parts.push(dir);
        }
    };
    for (var _i = 0, extraDirs_1 = extraDirs; _i < extraDirs_1.length; _i++) {
        var dir = extraDirs_1[_i];
        add(dir);
    }
    // User dirs first so user-installed binaries take precedence
    for (var _c = 0, linuxUserDirs_1 = linuxUserDirs; _c < linuxUserDirs_1.length; _c++) {
        var dir = linuxUserDirs_1[_c];
        add(dir);
    }
    for (var _d = 0, systemDirs_1 = systemDirs; _d < systemDirs_1.length; _d++) {
        var dir = systemDirs_1[_d];
        add(dir);
    }
    return parts;
}
function getMinimalServicePathPartsFromEnv(options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var env = (_a = options.env) !== null && _a !== void 0 ? _a : process.env;
    return getMinimalServicePathParts(__assign(__assign({}, options), { home: (_b = options.home) !== null && _b !== void 0 ? _b : env.HOME, env: env }));
}
function buildMinimalServicePath(options) {
    var _a, _b, _c;
    if (options === void 0) { options = {}; }
    var env = (_a = options.env) !== null && _a !== void 0 ? _a : process.env;
    var platform = (_b = options.platform) !== null && _b !== void 0 ? _b : process.platform;
    if (platform === "win32") {
        return (_c = env.PATH) !== null && _c !== void 0 ? _c : "";
    }
    return getMinimalServicePathPartsFromEnv(__assign(__assign({}, options), { env: env })).join(node_path_1.default.posix.delimiter);
}
function buildServiceEnvironment(params) {
    var env = params.env, port = params.port, token = params.token, launchdLabel = params.launchdLabel;
    var profile = env.OPENCLAW_PROFILE;
    var resolvedLaunchdLabel = launchdLabel ||
        (process.platform === "darwin" ? (0, constants_js_1.resolveGatewayLaunchAgentLabel)(profile) : undefined);
    var systemdUnit = "".concat((0, constants_js_1.resolveGatewaySystemdServiceName)(profile), ".service");
    var stateDir = env.OPENCLAW_STATE_DIR;
    var configPath = env.OPENCLAW_CONFIG_PATH;
    return {
        HOME: env.HOME,
        PATH: buildMinimalServicePath({ env: env }),
        OPENCLAW_PROFILE: profile,
        OPENCLAW_STATE_DIR: stateDir,
        OPENCLAW_CONFIG_PATH: configPath,
        OPENCLAW_GATEWAY_PORT: String(port),
        OPENCLAW_GATEWAY_TOKEN: token,
        OPENCLAW_LAUNCHD_LABEL: resolvedLaunchdLabel,
        OPENCLAW_SYSTEMD_UNIT: systemdUnit,
        OPENCLAW_SERVICE_MARKER: constants_js_1.GATEWAY_SERVICE_MARKER,
        OPENCLAW_SERVICE_KIND: constants_js_1.GATEWAY_SERVICE_KIND,
        OPENCLAW_SERVICE_VERSION: version_js_1.VERSION,
    };
}
function buildNodeServiceEnvironment(params) {
    var env = params.env;
    var stateDir = env.OPENCLAW_STATE_DIR;
    var configPath = env.OPENCLAW_CONFIG_PATH;
    return {
        HOME: env.HOME,
        PATH: buildMinimalServicePath({ env: env }),
        OPENCLAW_STATE_DIR: stateDir,
        OPENCLAW_CONFIG_PATH: configPath,
        OPENCLAW_LAUNCHD_LABEL: (0, constants_js_1.resolveNodeLaunchAgentLabel)(),
        OPENCLAW_SYSTEMD_UNIT: (0, constants_js_1.resolveNodeSystemdServiceName)(),
        OPENCLAW_WINDOWS_TASK_NAME: (0, constants_js_1.resolveNodeWindowsTaskName)(),
        OPENCLAW_TASK_SCRIPT_NAME: constants_js_1.NODE_WINDOWS_TASK_SCRIPT_NAME,
        OPENCLAW_LOG_PREFIX: "node",
        OPENCLAW_SERVICE_MARKER: constants_js_1.NODE_SERVICE_MARKER,
        OPENCLAW_SERVICE_KIND: constants_js_1.NODE_SERVICE_KIND,
        OPENCLAW_SERVICE_VERSION: version_js_1.VERSION,
    };
}
