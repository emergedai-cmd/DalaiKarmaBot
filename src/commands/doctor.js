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
exports.doctorCommand = doctorCommand;
var prompts_1 = require("@clack/prompts");
var node_fs_1 = require("node:fs");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var defaults_js_1 = require("../agents/defaults.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var command_format_js_1 = require("../cli/command-format.js");
var config_js_1 = require("../config/config.js");
var logging_js_1 = require("../config/logging.js");
var service_js_1 = require("../daemon/service.js");
var auth_js_1 = require("../gateway/auth.js");
var call_js_1 = require("../gateway/call.js");
var openclaw_root_js_1 = require("../infra/openclaw-root.js");
var runtime_js_1 = require("../runtime.js");
var note_js_1 = require("../terminal/note.js");
var prompt_style_js_1 = require("../terminal/prompt-style.js");
var utils_js_1 = require("../utils.js");
var doctor_auth_js_1 = require("./doctor-auth.js");
var doctor_config_flow_js_1 = require("./doctor-config-flow.js");
var doctor_gateway_daemon_flow_js_1 = require("./doctor-gateway-daemon-flow.js");
var doctor_gateway_health_js_1 = require("./doctor-gateway-health.js");
var doctor_gateway_services_js_1 = require("./doctor-gateway-services.js");
var doctor_install_js_1 = require("./doctor-install.js");
var doctor_platform_notes_js_1 = require("./doctor-platform-notes.js");
var doctor_prompter_js_1 = require("./doctor-prompter.js");
var doctor_sandbox_js_1 = require("./doctor-sandbox.js");
var doctor_security_js_1 = require("./doctor-security.js");
var doctor_state_integrity_js_1 = require("./doctor-state-integrity.js");
var doctor_state_migrations_js_1 = require("./doctor-state-migrations.js");
var doctor_ui_js_1 = require("./doctor-ui.js");
var doctor_update_js_1 = require("./doctor-update.js");
var doctor_workspace_status_js_1 = require("./doctor-workspace-status.js");
var doctor_workspace_js_1 = require("./doctor-workspace.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
var systemd_linger_js_1 = require("./systemd-linger.js");
var intro = function (message) { var _a; return (0, prompts_1.intro)((_a = (0, prompt_style_js_1.stylePromptTitle)(message)) !== null && _a !== void 0 ? _a : message); };
var outro = function (message) { var _a; return (0, prompts_1.outro)((_a = (0, prompt_style_js_1.stylePromptTitle)(message)) !== null && _a !== void 0 ? _a : message); };
function resolveMode(cfg) {
    var _a;
    return ((_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.mode) === "remote" ? "remote" : "local";
}
function doctorCommand() {
    return __awaiter(this, arguments, void 0, function (runtime, options) {
        var prompter, root, updateResult, configResult, cfg, configPath, lines, gatewayDetails, auth, needsToken, shouldSetToken, _a, _b, nextToken, legacyState, migrate, _c, migrated, hooksModelRef, _d, defaultProvider, defaultModel, catalog, status_1, warnings, service, loaded, _e, healthOk, shouldWriteConfig, backupPath, workspaceDir, finalSnapshot, _i, _f, issue, path;
        var _this = this;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        if (options === void 0) { options = {}; }
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    prompter = (0, doctor_prompter_js_1.createDoctorPrompter)({ runtime: runtime, options: options });
                    (0, onboard_helpers_js_1.printWizardHeader)(runtime);
                    intro("OpenClaw doctor");
                    return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({
                            moduleUrl: import.meta.url,
                            argv1: process.argv[1],
                            cwd: process.cwd(),
                        })];
                case 1:
                    root = _t.sent();
                    return [4 /*yield*/, (0, doctor_update_js_1.maybeOfferUpdateBeforeDoctor)({
                            runtime: runtime,
                            options: options,
                            root: root,
                            confirm: function (p) { return prompter.confirm(p); },
                            outro: outro,
                        })];
                case 2:
                    updateResult = _t.sent();
                    if (updateResult.handled) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, doctor_ui_js_1.maybeRepairUiProtocolFreshness)(runtime, prompter)];
                case 3:
                    _t.sent();
                    (0, doctor_install_js_1.noteSourceInstallIssues)(root);
                    (0, doctor_platform_notes_js_1.noteDeprecatedLegacyEnvVars)();
                    return [4 /*yield*/, (0, doctor_config_flow_js_1.loadAndMaybeMigrateDoctorConfig)({
                            options: options,
                            confirm: function (p) { return prompter.confirm(p); },
                        })];
                case 4:
                    configResult = _t.sent();
                    cfg = configResult.cfg;
                    configPath = (_g = configResult.path) !== null && _g !== void 0 ? _g : config_js_1.CONFIG_PATH;
                    if (!((_h = cfg.gateway) === null || _h === void 0 ? void 0 : _h.mode)) {
                        lines = [
                            "gateway.mode is unset; gateway start will be blocked.",
                            "Fix: run ".concat((0, command_format_js_1.formatCliCommand)("openclaw configure"), " and set Gateway mode (local/remote)."),
                            "Or set directly: ".concat((0, command_format_js_1.formatCliCommand)("openclaw config set gateway.mode local")),
                        ];
                        if (!node_fs_1.default.existsSync(configPath)) {
                            lines.push("Missing config: run ".concat((0, command_format_js_1.formatCliCommand)("openclaw setup"), " first."));
                        }
                        (0, note_js_1.note)(lines.join("\n"), "Gateway");
                    }
                    return [4 /*yield*/, (0, doctor_auth_js_1.maybeRepairAnthropicOAuthProfileId)(cfg, prompter)];
                case 5:
                    cfg = _t.sent();
                    return [4 /*yield*/, (0, doctor_auth_js_1.maybeRemoveDeprecatedCliAuthProfiles)(cfg, prompter)];
                case 6:
                    cfg = _t.sent();
                    return [4 /*yield*/, (0, doctor_auth_js_1.noteAuthProfileHealth)({
                            cfg: cfg,
                            prompter: prompter,
                            allowKeychainPrompt: options.nonInteractive !== true && Boolean(process.stdin.isTTY),
                        })];
                case 7:
                    _t.sent();
                    gatewayDetails = (0, call_js_1.buildGatewayConnectionDetails)({ config: cfg });
                    if (gatewayDetails.remoteFallbackNote) {
                        (0, note_js_1.note)(gatewayDetails.remoteFallbackNote, "Gateway");
                    }
                    if (!(resolveMode(cfg) === "local")) return [3 /*break*/, 13];
                    auth = (0, auth_js_1.resolveGatewayAuth)({
                        authConfig: (_j = cfg.gateway) === null || _j === void 0 ? void 0 : _j.auth,
                        tailscaleMode: (_m = (_l = (_k = cfg.gateway) === null || _k === void 0 ? void 0 : _k.tailscale) === null || _l === void 0 ? void 0 : _l.mode) !== null && _m !== void 0 ? _m : "off",
                    });
                    needsToken = auth.mode !== "password" && (auth.mode !== "token" || !auth.token);
                    if (!needsToken) return [3 /*break*/, 13];
                    (0, note_js_1.note)("Gateway auth is off or missing a token. Token auth is now the recommended default (including loopback).", "Gateway auth");
                    if (!(options.generateGatewayToken === true)) return [3 /*break*/, 8];
                    _a = true;
                    return [3 /*break*/, 12];
                case 8:
                    if (!(options.nonInteractive === true)) return [3 /*break*/, 9];
                    _b = false;
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, prompter.confirmRepair({
                        message: "Generate and configure a gateway token now?",
                        initialValue: true,
                    })];
                case 10:
                    _b = _t.sent();
                    _t.label = 11;
                case 11:
                    _a = _b;
                    _t.label = 12;
                case 12:
                    shouldSetToken = _a;
                    if (shouldSetToken) {
                        nextToken = (0, onboard_helpers_js_1.randomToken)();
                        cfg = __assign(__assign({}, cfg), { gateway: __assign(__assign({}, cfg.gateway), { auth: __assign(__assign({}, (_o = cfg.gateway) === null || _o === void 0 ? void 0 : _o.auth), { mode: "token", token: nextToken }) }) });
                        (0, note_js_1.note)("Gateway token configured.", "Gateway auth");
                    }
                    _t.label = 13;
                case 13: return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({ cfg: cfg })];
                case 14:
                    legacyState = _t.sent();
                    if (!(legacyState.preview.length > 0)) return [3 /*break*/, 19];
                    (0, note_js_1.note)(legacyState.preview.join("\n"), "Legacy state detected");
                    if (!(options.nonInteractive === true)) return [3 /*break*/, 15];
                    _c = true;
                    return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, prompter.confirm({
                        message: "Migrate legacy state (sessions/agent/WhatsApp auth) now?",
                        initialValue: true,
                    })];
                case 16:
                    _c = _t.sent();
                    _t.label = 17;
                case 17:
                    migrate = _c;
                    if (!migrate) return [3 /*break*/, 19];
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({
                            detected: legacyState,
                        })];
                case 18:
                    migrated = _t.sent();
                    if (migrated.changes.length > 0) {
                        (0, note_js_1.note)(migrated.changes.join("\n"), "Doctor changes");
                    }
                    if (migrated.warnings.length > 0) {
                        (0, note_js_1.note)(migrated.warnings.join("\n"), "Doctor warnings");
                    }
                    _t.label = 19;
                case 19: return [4 /*yield*/, (0, doctor_state_integrity_js_1.noteStateIntegrity)(cfg, prompter, (_p = configResult.path) !== null && _p !== void 0 ? _p : config_js_1.CONFIG_PATH)];
                case 20:
                    _t.sent();
                    return [4 /*yield*/, (0, doctor_sandbox_js_1.maybeRepairSandboxImages)(cfg, runtime, prompter)];
                case 21:
                    cfg = _t.sent();
                    (0, doctor_sandbox_js_1.noteSandboxScopeWarnings)(cfg);
                    return [4 /*yield*/, (0, doctor_gateway_services_js_1.maybeScanExtraGatewayServices)(options, runtime, prompter)];
                case 22:
                    _t.sent();
                    return [4 /*yield*/, (0, doctor_gateway_services_js_1.maybeRepairGatewayServiceConfig)(cfg, resolveMode(cfg), runtime, prompter)];
                case 23:
                    _t.sent();
                    return [4 /*yield*/, (0, doctor_platform_notes_js_1.noteMacLaunchAgentOverrides)()];
                case 24:
                    _t.sent();
                    return [4 /*yield*/, (0, doctor_platform_notes_js_1.noteMacLaunchctlGatewayEnvOverrides)(cfg)];
                case 25:
                    _t.sent();
                    return [4 /*yield*/, (0, doctor_security_js_1.noteSecurityWarnings)(cfg)];
                case 26:
                    _t.sent();
                    if (!((_s = (_r = (_q = cfg.hooks) === null || _q === void 0 ? void 0 : _q.gmail) === null || _r === void 0 ? void 0 : _r.model) === null || _s === void 0 ? void 0 : _s.trim())) return [3 /*break*/, 29];
                    hooksModelRef = (0, model_selection_js_1.resolveHooksGmailModel)({
                        cfg: cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                    });
                    if (!!hooksModelRef) return [3 /*break*/, 27];
                    (0, note_js_1.note)("- hooks.gmail.model \"".concat(cfg.hooks.gmail.model, "\" could not be resolved"), "Hooks");
                    return [3 /*break*/, 29];
                case 27:
                    _d = (0, model_selection_js_1.resolveConfiguredModelRef)({
                        cfg: cfg,
                        defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                        defaultModel: defaults_js_1.DEFAULT_MODEL,
                    }), defaultProvider = _d.provider, defaultModel = _d.model;
                    return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
                case 28:
                    catalog = _t.sent();
                    status_1 = (0, model_selection_js_1.getModelRefStatus)({
                        cfg: cfg,
                        catalog: catalog,
                        ref: hooksModelRef,
                        defaultProvider: defaultProvider,
                        defaultModel: defaultModel,
                    });
                    warnings = [];
                    if (!status_1.allowed) {
                        warnings.push("- hooks.gmail.model \"".concat(status_1.key, "\" not in agents.defaults.models allowlist (will use primary instead)"));
                    }
                    if (!status_1.inCatalog) {
                        warnings.push("- hooks.gmail.model \"".concat(status_1.key, "\" not in the model catalog (may fail at runtime)"));
                    }
                    if (warnings.length > 0) {
                        (0, note_js_1.note)(warnings.join("\n"), "Hooks");
                    }
                    _t.label = 29;
                case 29:
                    if (!(options.nonInteractive !== true &&
                        process.platform === "linux" &&
                        resolveMode(cfg) === "local")) return [3 /*break*/, 35];
                    service = (0, service_js_1.resolveGatewayService)();
                    loaded = false;
                    _t.label = 30;
                case 30:
                    _t.trys.push([30, 32, , 33]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 31:
                    loaded = _t.sent();
                    return [3 /*break*/, 33];
                case 32:
                    _e = _t.sent();
                    loaded = false;
                    return [3 /*break*/, 33];
                case 33:
                    if (!loaded) return [3 /*break*/, 35];
                    return [4 /*yield*/, (0, systemd_linger_js_1.ensureSystemdUserLingerInteractive)({
                            runtime: runtime,
                            prompter: {
                                confirm: function (p) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, prompter.confirm(p)];
                                }); }); },
                                note: note_js_1.note,
                            },
                            reason: "Gateway runs as a systemd user service. Without lingering, systemd stops the user session on logout/idle and kills the Gateway.",
                            requireConfirm: true,
                        })];
                case 34:
                    _t.sent();
                    _t.label = 35;
                case 35:
                    (0, doctor_workspace_status_js_1.noteWorkspaceStatus)(cfg);
                    return [4 /*yield*/, (0, doctor_gateway_health_js_1.checkGatewayHealth)({
                            runtime: runtime,
                            cfg: cfg,
                            timeoutMs: options.nonInteractive === true ? 3000 : 10000,
                        })];
                case 36:
                    healthOk = (_t.sent()).healthOk;
                    return [4 /*yield*/, (0, doctor_gateway_daemon_flow_js_1.maybeRepairGatewayDaemon)({
                            cfg: cfg,
                            runtime: runtime,
                            prompter: prompter,
                            options: options,
                            gatewayDetailsMessage: gatewayDetails.message,
                            healthOk: healthOk,
                        })];
                case 37:
                    _t.sent();
                    shouldWriteConfig = prompter.shouldRepair || configResult.shouldWriteConfig;
                    if (!shouldWriteConfig) return [3 /*break*/, 39];
                    cfg = (0, onboard_helpers_js_1.applyWizardMetadata)(cfg, { command: "doctor", mode: resolveMode(cfg) });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(cfg)];
                case 38:
                    _t.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    backupPath = "".concat(config_js_1.CONFIG_PATH, ".bak");
                    if (node_fs_1.default.existsSync(backupPath)) {
                        runtime.log("Backup: ".concat((0, utils_js_1.shortenHomePath)(backupPath)));
                    }
                    return [3 /*break*/, 40];
                case 39:
                    runtime.log("Run \"".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix"), "\" to apply changes."));
                    _t.label = 40;
                case 40:
                    if (!(options.workspaceSuggestions !== false)) return [3 /*break*/, 42];
                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
                    (0, doctor_state_integrity_js_1.noteWorkspaceBackupTip)(workspaceDir);
                    return [4 /*yield*/, (0, doctor_workspace_js_1.shouldSuggestMemorySystem)(workspaceDir)];
                case 41:
                    if (_t.sent()) {
                        (0, note_js_1.note)(doctor_workspace_js_1.MEMORY_SYSTEM_PROMPT, "Workspace");
                    }
                    _t.label = 42;
                case 42: return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 43:
                    finalSnapshot = _t.sent();
                    if (finalSnapshot.exists && !finalSnapshot.valid) {
                        runtime.error("Invalid config:");
                        for (_i = 0, _f = finalSnapshot.issues; _i < _f.length; _i++) {
                            issue = _f[_i];
                            path = issue.path || "<root>";
                            runtime.error("- ".concat(path, ": ").concat(issue.message));
                        }
                    }
                    outro("Doctor complete.");
                    return [2 /*return*/];
            }
        });
    });
}
