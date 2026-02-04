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
exports.SERVICE_AUDIT_CODES = void 0;
exports.needsNodeRuntimeMigration = needsNodeRuntimeMigration;
exports.auditGatewayServiceConfig = auditGatewayServiceConfig;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var launchd_js_1 = require("./launchd.js");
var runtime_paths_js_1 = require("./runtime-paths.js");
var service_env_js_1 = require("./service-env.js");
var systemd_js_1 = require("./systemd.js");
exports.SERVICE_AUDIT_CODES = {
    gatewayCommandMissing: "gateway-command-missing",
    gatewayEntrypointMismatch: "gateway-entrypoint-mismatch",
    gatewayPathMissing: "gateway-path-missing",
    gatewayPathMissingDirs: "gateway-path-missing-dirs",
    gatewayPathNonMinimal: "gateway-path-nonminimal",
    gatewayRuntimeBun: "gateway-runtime-bun",
    gatewayRuntimeNodeVersionManager: "gateway-runtime-node-version-manager",
    gatewayRuntimeNodeSystemMissing: "gateway-runtime-node-system-missing",
    launchdKeepAlive: "launchd-keep-alive",
    launchdRunAtLoad: "launchd-run-at-load",
    systemdAfterNetworkOnline: "systemd-after-network-online",
    systemdRestartSec: "systemd-restart-sec",
    systemdWantsNetworkOnline: "systemd-wants-network-online",
};
function needsNodeRuntimeMigration(issues) {
    return issues.some(function (issue) {
        return issue.code === exports.SERVICE_AUDIT_CODES.gatewayRuntimeBun ||
            issue.code === exports.SERVICE_AUDIT_CODES.gatewayRuntimeNodeVersionManager;
    });
}
function hasGatewaySubcommand(programArguments) {
    return Boolean(programArguments === null || programArguments === void 0 ? void 0 : programArguments.some(function (arg) { return arg === "gateway"; }));
}
function parseSystemdUnit(content) {
    var after = new Set();
    var wants = new Set();
    var restartSec;
    for (var _i = 0, _a = content.split(/\r?\n/); _i < _a.length; _i++) {
        var rawLine = _a[_i];
        var line = rawLine.trim();
        if (!line) {
            continue;
        }
        if (line.startsWith("#") || line.startsWith(";")) {
            continue;
        }
        if (line.startsWith("[")) {
            continue;
        }
        var idx = line.indexOf("=");
        if (idx <= 0) {
            continue;
        }
        var key = line.slice(0, idx).trim();
        var value = line.slice(idx + 1).trim();
        if (!value) {
            continue;
        }
        if (key === "After") {
            for (var _b = 0, _c = value.split(/\s+/); _b < _c.length; _b++) {
                var entry = _c[_b];
                if (entry) {
                    after.add(entry);
                }
            }
        }
        else if (key === "Wants") {
            for (var _d = 0, _e = value.split(/\s+/); _d < _e.length; _d++) {
                var entry = _e[_d];
                if (entry) {
                    wants.add(entry);
                }
            }
        }
        else if (key === "RestartSec") {
            restartSec = value;
        }
    }
    return { after: after, wants: wants, restartSec: restartSec };
}
function isRestartSecPreferred(value) {
    if (!value) {
        return false;
    }
    var parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        return false;
    }
    return Math.abs(parsed - 5) < 0.01;
}
function auditSystemdUnit(env, issues) {
    return __awaiter(this, void 0, void 0, function () {
        var unitPath, content, _a, parsed;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    unitPath = (0, systemd_js_1.resolveSystemdUserUnitPath)(env);
                    content = "";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readFile(unitPath, "utf8")];
                case 2:
                    content = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 4:
                    parsed = parseSystemdUnit(content);
                    if (!parsed.after.has("network-online.target")) {
                        issues.push({
                            code: exports.SERVICE_AUDIT_CODES.systemdAfterNetworkOnline,
                            message: "Missing systemd After=network-online.target",
                            detail: unitPath,
                            level: "recommended",
                        });
                    }
                    if (!parsed.wants.has("network-online.target")) {
                        issues.push({
                            code: exports.SERVICE_AUDIT_CODES.systemdWantsNetworkOnline,
                            message: "Missing systemd Wants=network-online.target",
                            detail: unitPath,
                            level: "recommended",
                        });
                    }
                    if (!isRestartSecPreferred(parsed.restartSec)) {
                        issues.push({
                            code: exports.SERVICE_AUDIT_CODES.systemdRestartSec,
                            message: "RestartSec does not match the recommended 5s",
                            detail: unitPath,
                            level: "recommended",
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function auditLaunchdPlist(env, issues) {
    return __awaiter(this, void 0, void 0, function () {
        var plistPath, content, _a, hasRunAtLoad, hasKeepAlive;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    plistPath = (0, launchd_js_1.resolveLaunchAgentPlistPath)(env);
                    content = "";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readFile(plistPath, "utf8")];
                case 2:
                    content = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 4:
                    hasRunAtLoad = /<key>RunAtLoad<\/key>\s*<true\s*\/>/i.test(content);
                    hasKeepAlive = /<key>KeepAlive<\/key>\s*<true\s*\/>/i.test(content);
                    if (!hasRunAtLoad) {
                        issues.push({
                            code: exports.SERVICE_AUDIT_CODES.launchdRunAtLoad,
                            message: "LaunchAgent is missing RunAtLoad=true",
                            detail: plistPath,
                            level: "recommended",
                        });
                    }
                    if (!hasKeepAlive) {
                        issues.push({
                            code: exports.SERVICE_AUDIT_CODES.launchdKeepAlive,
                            message: "LaunchAgent is missing KeepAlive=true",
                            detail: plistPath,
                            level: "recommended",
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function auditGatewayCommand(programArguments, issues) {
    if (!programArguments || programArguments.length === 0) {
        return;
    }
    if (!hasGatewaySubcommand(programArguments)) {
        issues.push({
            code: exports.SERVICE_AUDIT_CODES.gatewayCommandMissing,
            message: "Service command does not include the gateway subcommand",
            level: "aggressive",
        });
    }
}
function isNodeRuntime(execPath) {
    var base = node_path_1.default.basename(execPath).toLowerCase();
    return base === "node" || base === "node.exe";
}
function isBunRuntime(execPath) {
    var base = node_path_1.default.basename(execPath).toLowerCase();
    return base === "bun" || base === "bun.exe";
}
function getPathModule(platform) {
    return platform === "win32" ? node_path_1.default.win32 : node_path_1.default.posix;
}
function normalizePathEntry(entry, platform) {
    var pathModule = getPathModule(platform);
    var normalized = pathModule.normalize(entry).replaceAll("\\", "/");
    if (platform === "win32") {
        return normalized.toLowerCase();
    }
    return normalized;
}
function auditGatewayServicePath(command, issues, env, platform) {
    var _a;
    if (platform === "win32") {
        return;
    }
    var servicePath = (_a = command === null || command === void 0 ? void 0 : command.environment) === null || _a === void 0 ? void 0 : _a.PATH;
    if (!servicePath) {
        issues.push({
            code: exports.SERVICE_AUDIT_CODES.gatewayPathMissing,
            message: "Gateway service PATH is not set; the daemon should use a minimal PATH.",
            level: "recommended",
        });
        return;
    }
    var expected = (0, service_env_js_1.getMinimalServicePathPartsFromEnv)({ platform: platform, env: env });
    var parts = servicePath
        .split(getPathModule(platform).delimiter)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
    var normalizedParts = new Set(parts.map(function (entry) { return normalizePathEntry(entry, platform); }));
    var normalizedExpected = new Set(expected.map(function (entry) { return normalizePathEntry(entry, platform); }));
    var missing = expected.filter(function (entry) {
        var normalized = normalizePathEntry(entry, platform);
        return !normalizedParts.has(normalized);
    });
    if (missing.length > 0) {
        issues.push({
            code: exports.SERVICE_AUDIT_CODES.gatewayPathMissingDirs,
            message: "Gateway service PATH missing required dirs: ".concat(missing.join(", ")),
            level: "recommended",
        });
    }
    var nonMinimal = parts.filter(function (entry) {
        var normalized = normalizePathEntry(entry, platform);
        if (normalizedExpected.has(normalized)) {
            return false;
        }
        return (normalized.includes("/.nvm/") ||
            normalized.includes("/.fnm/") ||
            normalized.includes("/.volta/") ||
            normalized.includes("/.asdf/") ||
            normalized.includes("/.n/") ||
            normalized.includes("/.nodenv/") ||
            normalized.includes("/.nodebrew/") ||
            normalized.includes("/nvs/") ||
            normalized.includes("/.local/share/pnpm/") ||
            normalized.includes("/pnpm/") ||
            normalized.endsWith("/pnpm"));
    });
    if (nonMinimal.length > 0) {
        issues.push({
            code: exports.SERVICE_AUDIT_CODES.gatewayPathNonMinimal,
            message: "Gateway service PATH includes version managers or package managers; recommend a minimal PATH.",
            detail: nonMinimal.join(", "),
            level: "recommended",
        });
    }
}
function auditGatewayRuntime(env, command, issues, platform) {
    return __awaiter(this, void 0, void 0, function () {
        var execPath, systemNode;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    execPath = (_a = command === null || command === void 0 ? void 0 : command.programArguments) === null || _a === void 0 ? void 0 : _a[0];
                    if (!execPath) {
                        return [2 /*return*/];
                    }
                    if (isBunRuntime(execPath)) {
                        issues.push({
                            code: exports.SERVICE_AUDIT_CODES.gatewayRuntimeBun,
                            message: "Gateway service uses Bun; Bun is incompatible with WhatsApp + Telegram channels.",
                            detail: execPath,
                            level: "recommended",
                        });
                        return [2 /*return*/];
                    }
                    if (!isNodeRuntime(execPath)) {
                        return [2 /*return*/];
                    }
                    if (!(0, runtime_paths_js_1.isVersionManagedNodePath)(execPath, platform)) return [3 /*break*/, 2];
                    issues.push({
                        code: exports.SERVICE_AUDIT_CODES.gatewayRuntimeNodeVersionManager,
                        message: "Gateway service uses Node from a version manager; it can break after upgrades.",
                        detail: execPath,
                        level: "recommended",
                    });
                    if (!!(0, runtime_paths_js_1.isSystemNodePath)(execPath, env, platform)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, runtime_paths_js_1.resolveSystemNodePath)(env, platform)];
                case 1:
                    systemNode = _b.sent();
                    if (!systemNode) {
                        issues.push({
                            code: exports.SERVICE_AUDIT_CODES.gatewayRuntimeNodeSystemMissing,
                            message: "System Node 22+ not found; install it before migrating away from version managers.",
                            level: "recommended",
                        });
                    }
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function auditGatewayServiceConfig(params) {
    return __awaiter(this, void 0, void 0, function () {
        var issues, platform;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    issues = [];
                    platform = (_a = params.platform) !== null && _a !== void 0 ? _a : process.platform;
                    auditGatewayCommand((_b = params.command) === null || _b === void 0 ? void 0 : _b.programArguments, issues);
                    auditGatewayServicePath(params.command, issues, params.env, platform);
                    return [4 /*yield*/, auditGatewayRuntime(params.env, params.command, issues, platform)];
                case 1:
                    _c.sent();
                    if (!(platform === "linux")) return [3 /*break*/, 3];
                    return [4 /*yield*/, auditSystemdUnit(params.env, issues)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 3:
                    if (!(platform === "darwin")) return [3 /*break*/, 5];
                    return [4 /*yield*/, auditLaunchdPlist(params.env, issues)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5: return [2 /*return*/, { ok: issues.length === 0, issues: issues }];
            }
        });
    });
}
