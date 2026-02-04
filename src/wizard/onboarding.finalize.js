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
exports.finalizeOnboardingWizard = finalizeOnboardingWizard;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var workspace_js_1 = require("../agents/workspace.js");
var command_format_js_1 = require("../cli/command-format.js");
var daemon_install_helpers_js_1 = require("../commands/daemon-install-helpers.js");
var daemon_runtime_js_1 = require("../commands/daemon-runtime.js");
var health_format_js_1 = require("../commands/health-format.js");
var health_js_1 = require("../commands/health.js");
var onboard_helpers_js_1 = require("../commands/onboard-helpers.js");
var service_js_1 = require("../daemon/service.js");
var systemd_js_1 = require("../daemon/systemd.js");
var control_ui_assets_js_1 = require("../infra/control-ui-assets.js");
var tui_js_1 = require("../tui/tui.js");
var utils_js_1 = require("../utils.js");
function finalizeOnboardingWizard(options) {
    return __awaiter(this, void 0, void 0, function () {
        var flow, opts, baseConfig, nextConfig, settings, prompter, runtime, withWizardProgress, systemdAvailable, _a, ensureSystemdUserLingerInteractive, explicitInstallDaemon, installDaemon, daemonRuntime, _b, service_1, loaded, action, _c, _d, progress, installError, _e, programArguments, workingDirectory, environment, err_1, probeLinks, err_2, controlUiEnabled, controlUiAssets, controlUiBasePath, links, tokenParam, authedUrl, gatewayProbe, gatewayStatusLine, bootstrapPath, hasBootstrap, controlUiOpened, controlUiOpenHint, seededInBackground, hatchChoice, browserSupport, shouldOpenControlUi, browserSupport, webSearchKey, webSearchEnv, hasWebSearchKey;
        var _this = this;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        return __generator(this, function (_5) {
            switch (_5.label) {
                case 0:
                    flow = options.flow, opts = options.opts, baseConfig = options.baseConfig, nextConfig = options.nextConfig, settings = options.settings, prompter = options.prompter, runtime = options.runtime;
                    withWizardProgress = function (label, options, work) { return __awaiter(_this, void 0, void 0, function () {
                        var progress;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    progress = prompter.progress(label);
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, , 3, 4]);
                                    return [4 /*yield*/, work(progress)];
                                case 2: return [2 /*return*/, _a.sent()];
                                case 3:
                                    progress.stop(options.doneMessage);
                                    return [7 /*endfinally*/];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!(process.platform === "linux")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, systemd_js_1.isSystemdUserServiceAvailable)()];
                case 1:
                    _a = _5.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = true;
                    _5.label = 3;
                case 3:
                    systemdAvailable = _a;
                    if (!(process.platform === "linux" && !systemdAvailable)) return [3 /*break*/, 5];
                    return [4 /*yield*/, prompter.note("Systemd user services are unavailable. Skipping lingering checks and service install.", "Systemd")];
                case 4:
                    _5.sent();
                    _5.label = 5;
                case 5:
                    if (!(process.platform === "linux" && systemdAvailable)) return [3 /*break*/, 8];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../commands/systemd-linger.js"); })];
                case 6:
                    ensureSystemdUserLingerInteractive = (_5.sent()).ensureSystemdUserLingerInteractive;
                    return [4 /*yield*/, ensureSystemdUserLingerInteractive({
                            runtime: runtime,
                            prompter: {
                                confirm: prompter.confirm,
                                note: prompter.note,
                            },
                            reason: "Linux installs use a systemd user service by default. Without lingering, systemd stops the user session on logout/idle and kills the Gateway.",
                            requireConfirm: false,
                        })];
                case 7:
                    _5.sent();
                    _5.label = 8;
                case 8:
                    explicitInstallDaemon = typeof opts.installDaemon === "boolean" ? opts.installDaemon : undefined;
                    if (!(explicitInstallDaemon !== undefined)) return [3 /*break*/, 9];
                    installDaemon = explicitInstallDaemon;
                    return [3 /*break*/, 13];
                case 9:
                    if (!(process.platform === "linux" && !systemdAvailable)) return [3 /*break*/, 10];
                    installDaemon = false;
                    return [3 /*break*/, 13];
                case 10:
                    if (!(flow === "quickstart")) return [3 /*break*/, 11];
                    installDaemon = true;
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, prompter.confirm({
                        message: "Install Gateway service (recommended)",
                        initialValue: true,
                    })];
                case 12:
                    installDaemon = _5.sent();
                    _5.label = 13;
                case 13:
                    if (!(process.platform === "linux" && !systemdAvailable && installDaemon)) return [3 /*break*/, 15];
                    return [4 /*yield*/, prompter.note("Systemd user services are unavailable; skipping service install. Use your container supervisor or `docker compose up -d`.", "Gateway service")];
                case 14:
                    _5.sent();
                    installDaemon = false;
                    _5.label = 15;
                case 15:
                    if (!installDaemon) return [3 /*break*/, 38];
                    if (!(flow === "quickstart")) return [3 /*break*/, 16];
                    _b = daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME;
                    return [3 /*break*/, 18];
                case 16: return [4 /*yield*/, prompter.select({
                        message: "Gateway service runtime",
                        options: daemon_runtime_js_1.GATEWAY_DAEMON_RUNTIME_OPTIONS,
                        initialValue: (_f = opts.daemonRuntime) !== null && _f !== void 0 ? _f : daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME,
                    })];
                case 17:
                    _b = _5.sent();
                    _5.label = 18;
                case 18:
                    daemonRuntime = _b;
                    if (!(flow === "quickstart")) return [3 /*break*/, 20];
                    return [4 /*yield*/, prompter.note("QuickStart uses Node for the Gateway service (stable + supported).", "Gateway service runtime")];
                case 19:
                    _5.sent();
                    _5.label = 20;
                case 20:
                    service_1 = (0, service_js_1.resolveGatewayService)();
                    return [4 /*yield*/, service_1.isLoaded({ env: process.env })];
                case 21:
                    loaded = _5.sent();
                    if (!loaded) return [3 /*break*/, 26];
                    return [4 /*yield*/, prompter.select({
                            message: "Gateway service already installed",
                            options: [
                                { value: "restart", label: "Restart" },
                                { value: "reinstall", label: "Reinstall" },
                                { value: "skip", label: "Skip" },
                            ],
                        })];
                case 22:
                    action = _5.sent();
                    if (!(action === "restart")) return [3 /*break*/, 24];
                    return [4 /*yield*/, withWizardProgress("Gateway service", { doneMessage: "Gateway service restarted." }, function (progress) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        progress.update("Restarting Gateway service…");
                                        return [4 /*yield*/, service_1.restart({
                                                env: process.env,
                                                stdout: process.stdout,
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 23:
                    _5.sent();
                    return [3 /*break*/, 26];
                case 24:
                    if (!(action === "reinstall")) return [3 /*break*/, 26];
                    return [4 /*yield*/, withWizardProgress("Gateway service", { doneMessage: "Gateway service uninstalled." }, function (progress) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        progress.update("Uninstalling Gateway service…");
                                        return [4 /*yield*/, service_1.uninstall({ env: process.env, stdout: process.stdout })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 25:
                    _5.sent();
                    _5.label = 26;
                case 26:
                    _c = !loaded;
                    if (_c) return [3 /*break*/, 29];
                    _d = loaded;
                    if (!_d) return [3 /*break*/, 28];
                    return [4 /*yield*/, service_1.isLoaded({ env: process.env })];
                case 27:
                    _d = !(_5.sent());
                    _5.label = 28;
                case 28:
                    _c = (_d);
                    _5.label = 29;
                case 29:
                    if (!_c) return [3 /*break*/, 38];
                    progress = prompter.progress("Gateway service");
                    installError = null;
                    _5.label = 30;
                case 30:
                    _5.trys.push([30, 33, 34, 35]);
                    progress.update("Preparing Gateway service…");
                    return [4 /*yield*/, (0, daemon_install_helpers_js_1.buildGatewayInstallPlan)({
                            env: process.env,
                            port: settings.port,
                            token: settings.gatewayToken,
                            runtime: daemonRuntime,
                            warn: function (message, title) { return prompter.note(message, title); },
                            config: nextConfig,
                        })];
                case 31:
                    _e = _5.sent(), programArguments = _e.programArguments, workingDirectory = _e.workingDirectory, environment = _e.environment;
                    progress.update("Installing Gateway service…");
                    return [4 /*yield*/, service_1.install({
                            env: process.env,
                            stdout: process.stdout,
                            programArguments: programArguments,
                            workingDirectory: workingDirectory,
                            environment: environment,
                        })];
                case 32:
                    _5.sent();
                    return [3 /*break*/, 35];
                case 33:
                    err_1 = _5.sent();
                    installError = err_1 instanceof Error ? err_1.message : String(err_1);
                    return [3 /*break*/, 35];
                case 34:
                    progress.stop(installError ? "Gateway service install failed." : "Gateway service installed.");
                    return [7 /*endfinally*/];
                case 35:
                    if (!installError) return [3 /*break*/, 38];
                    return [4 /*yield*/, prompter.note("Gateway service install failed: ".concat(installError), "Gateway")];
                case 36:
                    _5.sent();
                    return [4 /*yield*/, prompter.note((0, daemon_install_helpers_js_1.gatewayInstallErrorHint)(), "Gateway")];
                case 37:
                    _5.sent();
                    _5.label = 38;
                case 38:
                    if (!!opts.skipHealth) return [3 /*break*/, 44];
                    probeLinks = (0, onboard_helpers_js_1.resolveControlUiLinks)({
                        bind: (_h = (_g = nextConfig.gateway) === null || _g === void 0 ? void 0 : _g.bind) !== null && _h !== void 0 ? _h : "loopback",
                        port: settings.port,
                        customBindHost: (_j = nextConfig.gateway) === null || _j === void 0 ? void 0 : _j.customBindHost,
                        basePath: undefined,
                    });
                    // Daemon install/restart can briefly flap the WS; wait a bit so health check doesn't false-fail.
                    return [4 /*yield*/, (0, onboard_helpers_js_1.waitForGatewayReachable)({
                            url: probeLinks.wsUrl,
                            token: settings.gatewayToken,
                            deadlineMs: 15000,
                        })];
                case 39:
                    // Daemon install/restart can briefly flap the WS; wait a bit so health check doesn't false-fail.
                    _5.sent();
                    _5.label = 40;
                case 40:
                    _5.trys.push([40, 42, , 44]);
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: false, timeoutMs: 10000 }, runtime)];
                case 41:
                    _5.sent();
                    return [3 /*break*/, 44];
                case 42:
                    err_2 = _5.sent();
                    runtime.error((0, health_format_js_1.formatHealthCheckFailure)(err_2));
                    return [4 /*yield*/, prompter.note([
                            "Docs:",
                            "https://docs.openclaw.ai/gateway/health",
                            "https://docs.openclaw.ai/gateway/troubleshooting",
                        ].join("\n"), "Health check help")];
                case 43:
                    _5.sent();
                    return [3 /*break*/, 44];
                case 44:
                    controlUiEnabled = (_q = (_m = (_l = (_k = nextConfig.gateway) === null || _k === void 0 ? void 0 : _k.controlUi) === null || _l === void 0 ? void 0 : _l.enabled) !== null && _m !== void 0 ? _m : (_p = (_o = baseConfig.gateway) === null || _o === void 0 ? void 0 : _o.controlUi) === null || _p === void 0 ? void 0 : _p.enabled) !== null && _q !== void 0 ? _q : true;
                    if (!(!opts.skipUi && controlUiEnabled)) return [3 /*break*/, 46];
                    return [4 /*yield*/, (0, control_ui_assets_js_1.ensureControlUiAssetsBuilt)(runtime)];
                case 45:
                    controlUiAssets = _5.sent();
                    if (!controlUiAssets.ok && controlUiAssets.message) {
                        runtime.error(controlUiAssets.message);
                    }
                    _5.label = 46;
                case 46: return [4 /*yield*/, prompter.note([
                        "Add nodes for extra features:",
                        "- macOS app (system + notifications)",
                        "- iOS app (camera/canvas)",
                        "- Android app (camera/canvas)",
                    ].join("\n"), "Optional apps")];
                case 47:
                    _5.sent();
                    controlUiBasePath = (_t = (_s = (_r = nextConfig.gateway) === null || _r === void 0 ? void 0 : _r.controlUi) === null || _s === void 0 ? void 0 : _s.basePath) !== null && _t !== void 0 ? _t : (_v = (_u = baseConfig.gateway) === null || _u === void 0 ? void 0 : _u.controlUi) === null || _v === void 0 ? void 0 : _v.basePath;
                    links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
                        bind: settings.bind,
                        port: settings.port,
                        customBindHost: settings.customBindHost,
                        basePath: controlUiBasePath,
                    });
                    tokenParam = settings.authMode === "token" && settings.gatewayToken
                        ? "?token=".concat(encodeURIComponent(settings.gatewayToken))
                        : "";
                    authedUrl = "".concat(links.httpUrl).concat(tokenParam);
                    return [4 /*yield*/, (0, onboard_helpers_js_1.probeGatewayReachable)({
                            url: links.wsUrl,
                            token: settings.authMode === "token" ? settings.gatewayToken : undefined,
                            password: settings.authMode === "password" ? (_x = (_w = nextConfig.gateway) === null || _w === void 0 ? void 0 : _w.auth) === null || _x === void 0 ? void 0 : _x.password : "",
                        })];
                case 48:
                    gatewayProbe = _5.sent();
                    gatewayStatusLine = gatewayProbe.ok
                        ? "Gateway: reachable"
                        : "Gateway: not detected".concat(gatewayProbe.detail ? " (".concat(gatewayProbe.detail, ")") : "");
                    bootstrapPath = node_path_1.default.join((0, utils_js_1.resolveUserPath)(options.workspaceDir), workspace_js_1.DEFAULT_BOOTSTRAP_FILENAME);
                    return [4 /*yield*/, promises_1.default
                            .access(bootstrapPath)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 49:
                    hasBootstrap = _5.sent();
                    return [4 /*yield*/, prompter.note([
                            "Web UI: ".concat(links.httpUrl),
                            tokenParam ? "Web UI (with token): ".concat(authedUrl) : undefined,
                            "Gateway WS: ".concat(links.wsUrl),
                            gatewayStatusLine,
                            "Docs: https://docs.openclaw.ai/web/control-ui",
                        ]
                            .filter(Boolean)
                            .join("\n"), "Control UI")];
                case 50:
                    _5.sent();
                    controlUiOpened = false;
                    seededInBackground = false;
                    hatchChoice = null;
                    if (!(!opts.skipUi && gatewayProbe.ok)) return [3 /*break*/, 69];
                    if (!hasBootstrap) return [3 /*break*/, 52];
                    return [4 /*yield*/, prompter.note([
                            "This is the defining action that makes your agent you.",
                            "Please take your time.",
                            "The more you tell it, the better the experience will be.",
                            'We will send: "Wake up, my friend!"',
                        ].join("\n"), "Start TUI (best option!)")];
                case 51:
                    _5.sent();
                    _5.label = 52;
                case 52: return [4 /*yield*/, prompter.note([
                        "Gateway token: shared auth for the Gateway + Control UI.",
                        "Stored in: ~/.openclaw/openclaw.json (gateway.auth.token) or OPENCLAW_GATEWAY_TOKEN.",
                        "Web UI stores a copy in this browser's localStorage (openclaw.control.settings.v1).",
                        "Get the tokenized link anytime: ".concat((0, command_format_js_1.formatCliCommand)("openclaw dashboard --no-open")),
                    ].join("\n"), "Token")];
                case 53:
                    _5.sent();
                    return [4 /*yield*/, prompter.select({
                            message: "How do you want to hatch your bot?",
                            options: [
                                { value: "tui", label: "Hatch in TUI (recommended)" },
                                { value: "web", label: "Open the Web UI" },
                                { value: "later", label: "Do this later" },
                            ],
                            initialValue: "tui",
                        })];
                case 54:
                    hatchChoice = _5.sent();
                    if (!(hatchChoice === "tui")) return [3 /*break*/, 60];
                    return [4 /*yield*/, (0, tui_js_1.runTui)({
                            url: links.wsUrl,
                            token: settings.authMode === "token" ? settings.gatewayToken : undefined,
                            password: settings.authMode === "password" ? (_z = (_y = nextConfig.gateway) === null || _y === void 0 ? void 0 : _y.auth) === null || _z === void 0 ? void 0 : _z.password : "",
                            // Safety: onboarding TUI should not auto-deliver to lastProvider/lastTo.
                            deliver: false,
                            message: hasBootstrap ? "Wake up, my friend!" : undefined,
                        })];
                case 55:
                    _5.sent();
                    if (!(settings.authMode === "token" && settings.gatewayToken)) return [3 /*break*/, 57];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.openUrlInBackground)(authedUrl)];
                case 56:
                    seededInBackground = _5.sent();
                    _5.label = 57;
                case 57:
                    if (!seededInBackground) return [3 /*break*/, 59];
                    return [4 /*yield*/, prompter.note("Web UI seeded in the background. Open later with: ".concat((0, command_format_js_1.formatCliCommand)("openclaw dashboard --no-open")), "Web UI")];
                case 58:
                    _5.sent();
                    _5.label = 59;
                case 59: return [3 /*break*/, 68];
                case 60:
                    if (!(hatchChoice === "web")) return [3 /*break*/, 66];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBrowserOpenSupport)()];
                case 61:
                    browserSupport = _5.sent();
                    if (!browserSupport.ok) return [3 /*break*/, 63];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.openUrl)(authedUrl)];
                case 62:
                    controlUiOpened = _5.sent();
                    if (!controlUiOpened) {
                        controlUiOpenHint = (0, onboard_helpers_js_1.formatControlUiSshHint)({
                            port: settings.port,
                            basePath: controlUiBasePath,
                            token: settings.gatewayToken,
                        });
                    }
                    return [3 /*break*/, 64];
                case 63:
                    controlUiOpenHint = (0, onboard_helpers_js_1.formatControlUiSshHint)({
                        port: settings.port,
                        basePath: controlUiBasePath,
                        token: settings.gatewayToken,
                    });
                    _5.label = 64;
                case 64: return [4 /*yield*/, prompter.note([
                        "Dashboard link (with token): ".concat(authedUrl),
                        controlUiOpened
                            ? "Opened in your browser. Keep that tab to control OpenClaw."
                            : "Copy/paste this URL in a browser on this machine to control OpenClaw.",
                        controlUiOpenHint,
                    ]
                        .filter(Boolean)
                        .join("\n"), "Dashboard ready")];
                case 65:
                    _5.sent();
                    return [3 /*break*/, 68];
                case 66: return [4 /*yield*/, prompter.note("When you're ready: ".concat((0, command_format_js_1.formatCliCommand)("openclaw dashboard --no-open")), "Later")];
                case 67:
                    _5.sent();
                    _5.label = 68;
                case 68: return [3 /*break*/, 71];
                case 69:
                    if (!opts.skipUi) return [3 /*break*/, 71];
                    return [4 /*yield*/, prompter.note("Skipping Control UI/TUI prompts.", "Control UI")];
                case 70:
                    _5.sent();
                    _5.label = 71;
                case 71: return [4 /*yield*/, prompter.note([
                        "Back up your agent workspace.",
                        "Docs: https://docs.openclaw.ai/concepts/agent-workspace",
                    ].join("\n"), "Workspace backup")];
                case 72:
                    _5.sent();
                    return [4 /*yield*/, prompter.note("Running agents on your computer is risky — harden your setup: https://docs.openclaw.ai/security", "Security")];
                case 73:
                    _5.sent();
                    shouldOpenControlUi = !opts.skipUi &&
                        settings.authMode === "token" &&
                        Boolean(settings.gatewayToken) &&
                        hatchChoice === null;
                    if (!shouldOpenControlUi) return [3 /*break*/, 79];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBrowserOpenSupport)()];
                case 74:
                    browserSupport = _5.sent();
                    if (!browserSupport.ok) return [3 /*break*/, 76];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.openUrl)(authedUrl)];
                case 75:
                    controlUiOpened = _5.sent();
                    if (!controlUiOpened) {
                        controlUiOpenHint = (0, onboard_helpers_js_1.formatControlUiSshHint)({
                            port: settings.port,
                            basePath: controlUiBasePath,
                            token: settings.gatewayToken,
                        });
                    }
                    return [3 /*break*/, 77];
                case 76:
                    controlUiOpenHint = (0, onboard_helpers_js_1.formatControlUiSshHint)({
                        port: settings.port,
                        basePath: controlUiBasePath,
                        token: settings.gatewayToken,
                    });
                    _5.label = 77;
                case 77: return [4 /*yield*/, prompter.note([
                        "Dashboard link (with token): ".concat(authedUrl),
                        controlUiOpened
                            ? "Opened in your browser. Keep that tab to control OpenClaw."
                            : "Copy/paste this URL in a browser on this machine to control OpenClaw.",
                        controlUiOpenHint,
                    ]
                        .filter(Boolean)
                        .join("\n"), "Dashboard ready")];
                case 78:
                    _5.sent();
                    _5.label = 79;
                case 79:
                    webSearchKey = ((_3 = (_2 = (_1 = (_0 = nextConfig.tools) === null || _0 === void 0 ? void 0 : _0.web) === null || _1 === void 0 ? void 0 : _1.search) === null || _2 === void 0 ? void 0 : _2.apiKey) !== null && _3 !== void 0 ? _3 : "").trim();
                    webSearchEnv = ((_4 = process.env.BRAVE_API_KEY) !== null && _4 !== void 0 ? _4 : "").trim();
                    hasWebSearchKey = Boolean(webSearchKey || webSearchEnv);
                    return [4 /*yield*/, prompter.note(hasWebSearchKey
                            ? [
                                "Web search is enabled, so your agent can look things up online when needed.",
                                "",
                                webSearchKey
                                    ? "API key: stored in config (tools.web.search.apiKey)."
                                    : "API key: provided via BRAVE_API_KEY env var (Gateway environment).",
                                "Docs: https://docs.openclaw.ai/tools/web",
                            ].join("\n")
                            : [
                                "If you want your agent to be able to search the web, you’ll need an API key.",
                                "",
                                "OpenClaw uses Brave Search for the `web_search` tool. Without a Brave Search API key, web search won’t work.",
                                "",
                                "Set it up interactively:",
                                "- Run: ".concat((0, command_format_js_1.formatCliCommand)("openclaw configure --section web")),
                                "- Enable web_search and paste your Brave Search API key",
                                "",
                                "Alternative: set BRAVE_API_KEY in the Gateway environment (no config changes).",
                                "Docs: https://docs.openclaw.ai/tools/web",
                            ].join("\n"), "Web search (optional)")];
                case 80:
                    _5.sent();
                    return [4 /*yield*/, prompter.note('What now: https://openclaw.ai/showcase ("What People Are Building").', "What now")];
                case 81:
                    _5.sent();
                    return [4 /*yield*/, prompter.outro(controlUiOpened
                            ? "Onboarding complete. Dashboard opened with your token; keep that tab to control OpenClaw."
                            : seededInBackground
                                ? "Onboarding complete. Web UI seeded in the background; open it anytime with the tokenized link above."
                                : "Onboarding complete. Use the tokenized dashboard link above to control OpenClaw.")];
                case 82:
                    _5.sent();
                    return [2 /*return*/];
            }
        });
    });
}
