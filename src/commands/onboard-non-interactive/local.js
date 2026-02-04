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
exports.runNonInteractiveOnboardingLocal = runNonInteractiveOnboardingLocal;
var command_format_js_1 = require("../../cli/command-format.js");
var config_js_1 = require("../../config/config.js");
var logging_js_1 = require("../../config/logging.js");
var daemon_runtime_js_1 = require("../daemon-runtime.js");
var health_js_1 = require("../health.js");
var onboard_helpers_js_1 = require("../onboard-helpers.js");
var auth_choice_js_1 = require("./local/auth-choice.js");
var daemon_install_js_1 = require("./local/daemon-install.js");
var gateway_config_js_1 = require("./local/gateway-config.js");
var output_js_1 = require("./local/output.js");
var skills_config_js_1 = require("./local/skills-config.js");
var workspace_js_1 = require("./local/workspace.js");
function runNonInteractiveOnboardingLocal(params) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, runtime, baseConfig, mode, workspaceDir, nextConfig, authChoice, nextConfigAfterAuth, gatewayBasePort, gatewayResult, daemonRuntimeRaw, links;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    opts = params.opts, runtime = params.runtime, baseConfig = params.baseConfig;
                    mode = "local";
                    workspaceDir = (0, workspace_js_1.resolveNonInteractiveWorkspaceDir)({
                        opts: opts,
                        baseConfig: baseConfig,
                        defaultWorkspaceDir: onboard_helpers_js_1.DEFAULT_WORKSPACE,
                    });
                    nextConfig = __assign(__assign({}, baseConfig), { agents: __assign(__assign({}, baseConfig.agents), { defaults: __assign(__assign({}, (_a = baseConfig.agents) === null || _a === void 0 ? void 0 : _a.defaults), { workspace: workspaceDir }) }), gateway: __assign(__assign({}, baseConfig.gateway), { mode: "local" }) });
                    authChoice = (_b = opts.authChoice) !== null && _b !== void 0 ? _b : "skip";
                    return [4 /*yield*/, (0, auth_choice_js_1.applyNonInteractiveAuthChoice)({
                            nextConfig: nextConfig,
                            authChoice: authChoice,
                            opts: opts,
                            runtime: runtime,
                            baseConfig: baseConfig,
                        })];
                case 1:
                    nextConfigAfterAuth = _g.sent();
                    if (!nextConfigAfterAuth) {
                        return [2 /*return*/];
                    }
                    nextConfig = nextConfigAfterAuth;
                    gatewayBasePort = (0, config_js_1.resolveGatewayPort)(baseConfig);
                    gatewayResult = (0, gateway_config_js_1.applyNonInteractiveGatewayConfig)({
                        nextConfig: nextConfig,
                        opts: opts,
                        runtime: runtime,
                        defaultPort: gatewayBasePort,
                    });
                    if (!gatewayResult) {
                        return [2 /*return*/];
                    }
                    nextConfig = gatewayResult.nextConfig;
                    nextConfig = (0, skills_config_js_1.applyNonInteractiveSkillsConfig)({ nextConfig: nextConfig, opts: opts, runtime: runtime });
                    nextConfig = (0, onboard_helpers_js_1.applyWizardMetadata)(nextConfig, { command: "onboard", mode: mode });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
                case 2:
                    _g.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    return [4 /*yield*/, (0, onboard_helpers_js_1.ensureWorkspaceAndSessions)(workspaceDir, runtime, {
                            skipBootstrap: Boolean((_d = (_c = nextConfig.agents) === null || _c === void 0 ? void 0 : _c.defaults) === null || _d === void 0 ? void 0 : _d.skipBootstrap),
                        })];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, (0, daemon_install_js_1.installGatewayDaemonNonInteractive)({
                            nextConfig: nextConfig,
                            opts: opts,
                            runtime: runtime,
                            port: gatewayResult.port,
                            gatewayToken: gatewayResult.gatewayToken,
                        })];
                case 4:
                    _g.sent();
                    daemonRuntimeRaw = (_e = opts.daemonRuntime) !== null && _e !== void 0 ? _e : daemon_runtime_js_1.DEFAULT_GATEWAY_DAEMON_RUNTIME;
                    if (!!opts.skipHealth) return [3 /*break*/, 7];
                    links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
                        bind: gatewayResult.bind,
                        port: gatewayResult.port,
                        customBindHost: (_f = nextConfig.gateway) === null || _f === void 0 ? void 0 : _f.customBindHost,
                        basePath: undefined,
                    });
                    return [4 /*yield*/, (0, onboard_helpers_js_1.waitForGatewayReachable)({
                            url: links.wsUrl,
                            token: gatewayResult.gatewayToken,
                            deadlineMs: 15000,
                        })];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: false, timeoutMs: 10000 }, runtime)];
                case 6:
                    _g.sent();
                    _g.label = 7;
                case 7:
                    (0, output_js_1.logNonInteractiveOnboardingJson)({
                        opts: opts,
                        runtime: runtime,
                        mode: mode,
                        workspaceDir: workspaceDir,
                        authChoice: authChoice,
                        gateway: {
                            port: gatewayResult.port,
                            bind: gatewayResult.bind,
                            authMode: gatewayResult.authMode,
                            tailscaleMode: gatewayResult.tailscaleMode,
                        },
                        installDaemon: Boolean(opts.installDaemon),
                        daemonRuntime: opts.installDaemon ? daemonRuntimeRaw : undefined,
                        skipSkills: Boolean(opts.skipSkills),
                        skipHealth: Boolean(opts.skipHealth),
                    });
                    if (!opts.json) {
                        runtime.log("Tip: run `".concat((0, command_format_js_1.formatCliCommand)("openclaw configure --section web"), "` to store your Brave API key for web_search. Docs: https://docs.openclaw.ai/tools/web"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
