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
exports.maybeRepairGatewayServiceConfig = maybeRepairGatewayServiceConfig;
exports.maybeScanExtraGatewayServices = maybeScanExtraGatewayServices;
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var paths_js_1 = require("../config/paths.js");
var inspect_js_1 = require("../daemon/inspect.js");
var runtime_paths_js_1 = require("../daemon/runtime-paths.js");
var service_audit_js_1 = require("../daemon/service-audit.js");
var service_js_1 = require("../daemon/service.js");
var note_js_1 = require("../terminal/note.js");
var daemon_install_helpers_js_1 = require("./daemon-install-helpers.js");
var daemon_runtime_js_1 = require("./daemon-runtime.js");
var execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
function detectGatewayRuntime(programArguments) {
    var first = programArguments === null || programArguments === void 0 ? void 0 : programArguments[0];
    if (first) {
        var base = node_path_1.default.basename(first).toLowerCase();
        if (base === "bun" || base === "bun.exe") {
            return "bun";
        }
        if (base === "node" || base === "node.exe") {
            return "node";
        }
    }
    return daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME;
}
function findGatewayEntrypoint(programArguments) {
    var _a;
    if (!programArguments || programArguments.length === 0) {
        return null;
    }
    var gatewayIndex = programArguments.indexOf("gateway");
    if (gatewayIndex <= 0) {
        return null;
    }
    return (_a = programArguments[gatewayIndex - 1]) !== null && _a !== void 0 ? _a : null;
}
function normalizeExecutablePath(value) {
    return node_path_1.default.resolve(value);
}
function extractDetailPath(detail, prefix) {
    if (!detail.startsWith(prefix)) {
        return null;
    }
    var value = detail.slice(prefix.length).trim();
    return value.length > 0 ? value : null;
}
function cleanupLegacyLaunchdService(params) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, trashDir, _a, _b, dest, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    domain = typeof process.getuid === "function" ? "gui/".concat(process.getuid()) : "gui/501";
                    return [4 /*yield*/, execFileAsync("launchctl", ["bootout", domain, params.plistPath]).catch(function () { return undefined; })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, execFileAsync("launchctl", ["unload", params.plistPath]).catch(function () { return undefined; })];
                case 2:
                    _d.sent();
                    trashDir = node_path_1.default.join(node_os_1.default.homedir(), ".Trash");
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.mkdir(trashDir, { recursive: true })];
                case 4:
                    _d.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = _d.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, promises_1.default.access(params.plistPath)];
                case 7:
                    _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = _d.sent();
                    return [2 /*return*/, null];
                case 9:
                    dest = node_path_1.default.join(trashDir, "".concat(params.label, "-").concat(Date.now(), ".plist"));
                    _d.label = 10;
                case 10:
                    _d.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, promises_1.default.rename(params.plistPath, dest)];
                case 11:
                    _d.sent();
                    return [2 /*return*/, dest];
                case 12:
                    _c = _d.sent();
                    return [2 /*return*/, null];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function maybeRepairGatewayServiceConfig(cfg, mode, runtime, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var service, command, _a, audit, needsNodeRuntime, systemNodeInfo, _b, systemNodePath, warning, port, runtimeChoice, _c, programArguments, workingDirectory, environment, expectedEntrypoint, currentEntrypoint, aggressiveIssues, needsAggressive, repair, _d, err_1;
        var _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if ((0, paths_js_1.resolveIsNixMode)(process.env)) {
                        (0, note_js_1.note)("Nix mode detected; skip service updates.", "Gateway");
                        return [2 /*return*/];
                    }
                    if (mode === "remote") {
                        (0, note_js_1.note)("Gateway mode is remote; skipped local service audit.", "Gateway");
                        return [2 /*return*/];
                    }
                    service = (0, service_js_1.resolveGatewayService)();
                    command = null;
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.readCommand(process.env)];
                case 2:
                    command = _h.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _h.sent();
                    command = null;
                    return [3 /*break*/, 4];
                case 4:
                    if (!command) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, service_audit_js_1.auditGatewayServiceConfig)({
                            env: process.env,
                            command: command,
                        })];
                case 5:
                    audit = _h.sent();
                    needsNodeRuntime = (0, service_audit_js_1.needsNodeRuntimeMigration)(audit.issues);
                    if (!needsNodeRuntime) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, runtime_paths_js_1.resolveSystemNodeInfo)({ env: process.env })];
                case 6:
                    _b = _h.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _b = null;
                    _h.label = 8;
                case 8:
                    systemNodeInfo = _b;
                    systemNodePath = (systemNodeInfo === null || systemNodeInfo === void 0 ? void 0 : systemNodeInfo.supported) ? systemNodeInfo.path : null;
                    if (needsNodeRuntime && !systemNodePath) {
                        warning = (0, runtime_paths_js_1.renderSystemNodeWarning)(systemNodeInfo);
                        if (warning) {
                            (0, note_js_1.note)(warning, "Gateway runtime");
                        }
                        (0, note_js_1.note)("System Node 22+ not found. Install via Homebrew/apt/choco and rerun doctor to migrate off Bun/version managers.", "Gateway runtime");
                    }
                    port = (0, paths_js_1.resolveGatewayPort)(cfg, process.env);
                    runtimeChoice = detectGatewayRuntime(command.programArguments);
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: process.env,
                            port: port,
                            token: (_g = (_f = (_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.auth) === null || _f === void 0 ? void 0 : _f.token) !== null && _g !== void 0 ? _g : process.env.OPENCLAW_GATEWAY_TOKEN,
                            runtime: needsNodeRuntime && systemNodePath ? "node" : runtimeChoice,
                            nodePath: systemNodePath !== null && systemNodePath !== void 0 ? systemNodePath : undefined,
                            warn: function (message, title) { return (0, note_js_1.note)(message, title); },
                            config: cfg,
                        })];
                case 9:
                    _c = _h.sent(), programArguments = _c.programArguments, workingDirectory = _c.workingDirectory, environment = _c.environment;
                    expectedEntrypoint = findGatewayEntrypoint(programArguments);
                    currentEntrypoint = findGatewayEntrypoint(command.programArguments);
                    if (expectedEntrypoint &&
                        currentEntrypoint &&
                        normalizeExecutablePath(expectedEntrypoint) !== normalizeExecutablePath(currentEntrypoint)) {
                        audit.issues.push({
                            code: service_audit_js_1.SERVICE_AUDIT_CODES.gatewayEntrypointMismatch,
                            message: "Gateway service entrypoint does not match the current install.",
                            detail: "".concat(currentEntrypoint, " -> ").concat(expectedEntrypoint),
                            level: "recommended",
                        });
                    }
                    if (audit.issues.length === 0) {
                        return [2 /*return*/];
                    }
                    (0, note_js_1.note)(audit.issues
                        .map(function (issue) {
                        return issue.detail ? "- ".concat(issue.message, " (").concat(issue.detail, ")") : "- ".concat(issue.message);
                    })
                        .join("\n"), "Gateway service config");
                    aggressiveIssues = audit.issues.filter(function (issue) { return issue.level === "aggressive"; });
                    needsAggressive = aggressiveIssues.length > 0;
                    if (needsAggressive && !prompter.shouldForce) {
                        (0, note_js_1.note)("Custom or unexpected service edits detected. Rerun with --force to overwrite.", "Gateway service config");
                    }
                    if (!needsAggressive) return [3 /*break*/, 11];
                    return [4 /*yield*/, prompter.confirmAggressive({
                            message: "Overwrite gateway service config with current defaults now?",
                            initialValue: Boolean(prompter.shouldForce),
                        })];
                case 10:
                    _d = _h.sent();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, prompter.confirmRepair({
                        message: "Update gateway service config to the recommended defaults now?",
                        initialValue: true,
                    })];
                case 12:
                    _d = _h.sent();
                    _h.label = 13;
                case 13:
                    repair = _d;
                    if (!repair) {
                        return [2 /*return*/];
                    }
                    _h.label = 14;
                case 14:
                    _h.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, service.install({
                            env: process.env,
                            stdout: process.stdout,
                            programArguments: programArguments,
                            workingDirectory: workingDirectory,
                            environment: environment,
                        })];
                case 15:
                    _h.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_1 = _h.sent();
                    runtime.error("Gateway service update failed: ".concat(String(err_1)));
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function maybeScanExtraGatewayServices(options, runtime, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var extraServices, legacyServices, shouldRemove, removed, failed, _i, legacyServices_1, svc, plistPath, dest, cleanupHints;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, inspect_js_1.findExtraGatewayServices)(process.env, {
                        deep: options.deep,
                    })];
                case 1:
                    extraServices = _a.sent();
                    if (extraServices.length === 0) {
                        return [2 /*return*/];
                    }
                    (0, note_js_1.note)(extraServices.map(function (svc) { return "- ".concat(svc.label, " (").concat(svc.scope, ", ").concat(svc.detail, ")"); }).join("\n"), "Other gateway-like services detected");
                    legacyServices = extraServices.filter(function (svc) { return svc.legacy === true; });
                    if (!(legacyServices.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, prompter.confirmSkipInNonInteractive({
                            message: "Remove legacy gateway services (clawdbot/moltbot) now?",
                            initialValue: true,
                        })];
                case 2:
                    shouldRemove = _a.sent();
                    if (!shouldRemove) return [3 /*break*/, 7];
                    removed = [];
                    failed = [];
                    _i = 0, legacyServices_1 = legacyServices;
                    _a.label = 3;
                case 3:
                    if (!(_i < legacyServices_1.length)) return [3 /*break*/, 6];
                    svc = legacyServices_1[_i];
                    if (svc.platform !== "darwin") {
                        failed.push("".concat(svc.label, " (").concat(svc.platform, ")"));
                        return [3 /*break*/, 5];
                    }
                    if (svc.scope !== "user") {
                        failed.push("".concat(svc.label, " (").concat(svc.scope, ")"));
                        return [3 /*break*/, 5];
                    }
                    plistPath = extractDetailPath(svc.detail, "plist:");
                    if (!plistPath) {
                        failed.push("".concat(svc.label, " (missing plist path)"));
                        return [3 /*break*/, 5];
                    }
                    return [4 /*yield*/, cleanupLegacyLaunchdService({
                            label: svc.label,
                            plistPath: plistPath,
                        })];
                case 4:
                    dest = _a.sent();
                    removed.push(dest ? "".concat(svc.label, " -> ").concat(dest) : svc.label);
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    if (removed.length > 0) {
                        (0, note_js_1.note)(removed.map(function (line) { return "- ".concat(line); }).join("\n"), "Legacy gateway removed");
                    }
                    if (failed.length > 0) {
                        (0, note_js_1.note)(failed.map(function (line) { return "- ".concat(line); }).join("\n"), "Legacy gateway cleanup skipped");
                    }
                    if (removed.length > 0) {
                        runtime.log("Legacy gateway services removed. Installing OpenClaw gateway next.");
                    }
                    _a.label = 7;
                case 7:
                    cleanupHints = (0, inspect_js_1.renderGatewayServiceCleanupHints)();
                    if (cleanupHints.length > 0) {
                        (0, note_js_1.note)(cleanupHints.map(function (hint) { return "- ".concat(hint); }).join("\n"), "Cleanup hints");
                    }
                    (0, note_js_1.note)([
                        "Recommendation: run a single gateway per machine for most setups.",
                        "One gateway supports multiple agents.",
                        "If you need multiple gateways (e.g., a rescue bot on the same host), isolate ports + config/state (see docs: /gateway#multiple-gateways-same-host).",
                    ].join("\n"), "Gateway recommendation");
                    return [2 /*return*/];
            }
        });
    });
}
