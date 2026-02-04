"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var service_env_js_1 = require("./service-env.js");
(0, vitest_1.describe)("getMinimalServicePathParts - Linux user directories", function () {
    (0, vitest_1.it)("includes user bin directories when HOME is set on Linux", function () {
        var result = (0, service_env_js_1.getMinimalServicePathParts)({
            platform: "linux",
            home: "/home/testuser",
        });
        // Should include all common user bin directories
        (0, vitest_1.expect)(result).toContain("/home/testuser/.local/bin");
        (0, vitest_1.expect)(result).toContain("/home/testuser/.npm-global/bin");
        (0, vitest_1.expect)(result).toContain("/home/testuser/bin");
        (0, vitest_1.expect)(result).toContain("/home/testuser/.nvm/current/bin");
        (0, vitest_1.expect)(result).toContain("/home/testuser/.fnm/current/bin");
        (0, vitest_1.expect)(result).toContain("/home/testuser/.volta/bin");
        (0, vitest_1.expect)(result).toContain("/home/testuser/.asdf/shims");
        (0, vitest_1.expect)(result).toContain("/home/testuser/.local/share/pnpm");
        (0, vitest_1.expect)(result).toContain("/home/testuser/.bun/bin");
    });
    (0, vitest_1.it)("excludes user bin directories when HOME is undefined on Linux", function () {
        var result = (0, service_env_js_1.getMinimalServicePathParts)({
            platform: "linux",
            home: undefined,
        });
        // Should only include system directories
        (0, vitest_1.expect)(result).toEqual(["/usr/local/bin", "/usr/bin", "/bin"]);
        // Should not include any user-specific paths
        (0, vitest_1.expect)(result.some(function (p) { return p.includes(".local"); })).toBe(false);
        (0, vitest_1.expect)(result.some(function (p) { return p.includes(".npm-global"); })).toBe(false);
        (0, vitest_1.expect)(result.some(function (p) { return p.includes(".nvm"); })).toBe(false);
    });
    (0, vitest_1.it)("places user directories before system directories on Linux", function () {
        var result = (0, service_env_js_1.getMinimalServicePathParts)({
            platform: "linux",
            home: "/home/testuser",
        });
        var userDirIndex = result.indexOf("/home/testuser/.local/bin");
        var systemDirIndex = result.indexOf("/usr/bin");
        (0, vitest_1.expect)(userDirIndex).toBeGreaterThan(-1);
        (0, vitest_1.expect)(systemDirIndex).toBeGreaterThan(-1);
        (0, vitest_1.expect)(userDirIndex).toBeLessThan(systemDirIndex);
    });
    (0, vitest_1.it)("places extraDirs before user directories on Linux", function () {
        var result = (0, service_env_js_1.getMinimalServicePathParts)({
            platform: "linux",
            home: "/home/testuser",
            extraDirs: ["/custom/bin"],
        });
        var extraDirIndex = result.indexOf("/custom/bin");
        var userDirIndex = result.indexOf("/home/testuser/.local/bin");
        (0, vitest_1.expect)(extraDirIndex).toBeGreaterThan(-1);
        (0, vitest_1.expect)(userDirIndex).toBeGreaterThan(-1);
        (0, vitest_1.expect)(extraDirIndex).toBeLessThan(userDirIndex);
    });
    (0, vitest_1.it)("includes env-configured bin roots when HOME is set on Linux", function () {
        var result = (0, service_env_js_1.getMinimalServicePathPartsFromEnv)({
            platform: "linux",
            env: {
                HOME: "/home/testuser",
                PNPM_HOME: "/opt/pnpm",
                NPM_CONFIG_PREFIX: "/opt/npm",
                BUN_INSTALL: "/opt/bun",
                VOLTA_HOME: "/opt/volta",
                ASDF_DATA_DIR: "/opt/asdf",
                NVM_DIR: "/opt/nvm",
                FNM_DIR: "/opt/fnm",
            },
        });
        (0, vitest_1.expect)(result).toContain("/opt/pnpm");
        (0, vitest_1.expect)(result).toContain("/opt/npm/bin");
        (0, vitest_1.expect)(result).toContain("/opt/bun/bin");
        (0, vitest_1.expect)(result).toContain("/opt/volta/bin");
        (0, vitest_1.expect)(result).toContain("/opt/asdf/shims");
        (0, vitest_1.expect)(result).toContain("/opt/nvm/current/bin");
        (0, vitest_1.expect)(result).toContain("/opt/fnm/current/bin");
    });
    (0, vitest_1.it)("does not include Linux user directories on macOS", function () {
        var result = (0, service_env_js_1.getMinimalServicePathParts)({
            platform: "darwin",
            home: "/Users/testuser",
        });
        // Should not include Linux-specific user dirs even with HOME set
        (0, vitest_1.expect)(result.some(function (p) { return p.includes(".npm-global"); })).toBe(false);
        (0, vitest_1.expect)(result.some(function (p) { return p.includes(".nvm"); })).toBe(false);
        // Should only include macOS system directories
        (0, vitest_1.expect)(result).toContain("/opt/homebrew/bin");
        (0, vitest_1.expect)(result).toContain("/usr/local/bin");
    });
    (0, vitest_1.it)("does not include Linux user directories on Windows", function () {
        var result = (0, service_env_js_1.getMinimalServicePathParts)({
            platform: "win32",
            home: "C:\\Users\\testuser",
        });
        // Windows returns empty array (uses existing PATH)
        (0, vitest_1.expect)(result).toEqual([]);
    });
});
(0, vitest_1.describe)("buildMinimalServicePath", function () {
    var splitPath = function (value, platform) {
        return value.split(platform === "win32" ? node_path_1.default.win32.delimiter : node_path_1.default.posix.delimiter);
    };
    (0, vitest_1.it)("includes Homebrew + system dirs on macOS", function () {
        var result = (0, service_env_js_1.buildMinimalServicePath)({
            platform: "darwin",
        });
        var parts = splitPath(result, "darwin");
        (0, vitest_1.expect)(parts).toContain("/opt/homebrew/bin");
        (0, vitest_1.expect)(parts).toContain("/usr/local/bin");
        (0, vitest_1.expect)(parts).toContain("/usr/bin");
        (0, vitest_1.expect)(parts).toContain("/bin");
    });
    (0, vitest_1.it)("returns PATH as-is on Windows", function () {
        var result = (0, service_env_js_1.buildMinimalServicePath)({
            env: { PATH: "C:\\\\Windows\\\\System32" },
            platform: "win32",
        });
        (0, vitest_1.expect)(result).toBe("C:\\\\Windows\\\\System32");
    });
    (0, vitest_1.it)("includes Linux user directories when HOME is set in env", function () {
        var result = (0, service_env_js_1.buildMinimalServicePath)({
            platform: "linux",
            env: { HOME: "/home/alice" },
        });
        var parts = splitPath(result, "linux");
        // Verify user directories are included
        (0, vitest_1.expect)(parts).toContain("/home/alice/.local/bin");
        (0, vitest_1.expect)(parts).toContain("/home/alice/.npm-global/bin");
        (0, vitest_1.expect)(parts).toContain("/home/alice/.nvm/current/bin");
        // Verify system directories are also included
        (0, vitest_1.expect)(parts).toContain("/usr/local/bin");
        (0, vitest_1.expect)(parts).toContain("/usr/bin");
        (0, vitest_1.expect)(parts).toContain("/bin");
    });
    (0, vitest_1.it)("excludes Linux user directories when HOME is not in env", function () {
        var result = (0, service_env_js_1.buildMinimalServicePath)({
            platform: "linux",
            env: {},
        });
        var parts = splitPath(result, "linux");
        // Should only have system directories
        (0, vitest_1.expect)(parts).toEqual(["/usr/local/bin", "/usr/bin", "/bin"]);
        // No user-specific paths
        (0, vitest_1.expect)(parts.some(function (p) { return p.includes("home"); })).toBe(false);
    });
    (0, vitest_1.it)("ensures user directories come before system directories on Linux", function () {
        var result = (0, service_env_js_1.buildMinimalServicePath)({
            platform: "linux",
            env: { HOME: "/home/bob" },
        });
        var parts = splitPath(result, "linux");
        var firstUserDirIdx = parts.indexOf("/home/bob/.local/bin");
        var firstSystemDirIdx = parts.indexOf("/usr/local/bin");
        (0, vitest_1.expect)(firstUserDirIdx).toBeLessThan(firstSystemDirIdx);
    });
    (0, vitest_1.it)("includes extra directories when provided", function () {
        var result = (0, service_env_js_1.buildMinimalServicePath)({
            platform: "linux",
            extraDirs: ["/custom/tools"],
            env: {},
        });
        (0, vitest_1.expect)(splitPath(result, "linux")).toContain("/custom/tools");
    });
    (0, vitest_1.it)("deduplicates directories", function () {
        var result = (0, service_env_js_1.buildMinimalServicePath)({
            platform: "linux",
            extraDirs: ["/usr/bin"],
            env: {},
        });
        var parts = splitPath(result, "linux");
        var unique = __spreadArray([], new Set(parts), true);
        (0, vitest_1.expect)(parts.length).toBe(unique.length);
    });
});
(0, vitest_1.describe)("buildServiceEnvironment", function () {
    (0, vitest_1.it)("sets minimal PATH and gateway vars", function () {
        var env = (0, service_env_js_1.buildServiceEnvironment)({
            env: { HOME: "/home/user" },
            port: 18789,
            token: "secret",
        });
        (0, vitest_1.expect)(env.HOME).toBe("/home/user");
        if (process.platform === "win32") {
            (0, vitest_1.expect)(env.PATH).toBe("");
        }
        else {
            (0, vitest_1.expect)(env.PATH).toContain("/usr/bin");
        }
        (0, vitest_1.expect)(env.OPENCLAW_GATEWAY_PORT).toBe("18789");
        (0, vitest_1.expect)(env.OPENCLAW_GATEWAY_TOKEN).toBe("secret");
        (0, vitest_1.expect)(env.OPENCLAW_SERVICE_MARKER).toBe("openclaw");
        (0, vitest_1.expect)(env.OPENCLAW_SERVICE_KIND).toBe("gateway");
        (0, vitest_1.expect)(typeof env.OPENCLAW_SERVICE_VERSION).toBe("string");
        (0, vitest_1.expect)(env.OPENCLAW_SYSTEMD_UNIT).toBe("openclaw-gateway.service");
        if (process.platform === "darwin") {
            (0, vitest_1.expect)(env.OPENCLAW_LAUNCHD_LABEL).toBe("ai.openclaw.gateway");
        }
    });
    (0, vitest_1.it)("uses profile-specific unit and label", function () {
        var env = (0, service_env_js_1.buildServiceEnvironment)({
            env: { HOME: "/home/user", OPENCLAW_PROFILE: "work" },
            port: 18789,
        });
        (0, vitest_1.expect)(env.OPENCLAW_SYSTEMD_UNIT).toBe("openclaw-gateway-work.service");
        if (process.platform === "darwin") {
            (0, vitest_1.expect)(env.OPENCLAW_LAUNCHD_LABEL).toBe("ai.openclaw.work");
        }
    });
});
(0, vitest_1.describe)("buildNodeServiceEnvironment", function () {
    (0, vitest_1.it)("passes through HOME for node services", function () {
        var env = (0, service_env_js_1.buildNodeServiceEnvironment)({
            env: { HOME: "/home/user" },
        });
        (0, vitest_1.expect)(env.HOME).toBe("/home/user");
    });
});
