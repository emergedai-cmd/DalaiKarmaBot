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
exports.runOnboardingWizard = runOnboardingWizard;
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var index_js_1 = require("../channels/plugins/index.js");
var command_format_js_1 = require("../cli/command-format.js");
var completion_cli_js_1 = require("../cli/completion-cli.js");
var auth_choice_prompt_js_1 = require("../commands/auth-choice-prompt.js");
var auth_choice_js_1 = require("../commands/auth-choice.js");
var model_picker_js_1 = require("../commands/model-picker.js");
var onboard_channels_js_1 = require("../commands/onboard-channels.js");
var onboard_helpers_js_1 = require("../commands/onboard-helpers.js");
var onboard_hooks_js_1 = require("../commands/onboard-hooks.js");
var onboard_remote_js_1 = require("../commands/onboard-remote.js");
var onboard_skills_js_1 = require("../commands/onboard-skills.js");
var config_js_1 = require("../config/config.js");
var logging_js_1 = require("../config/logging.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
var onboarding_finalize_js_1 = require("./onboarding.finalize.js");
var onboarding_gateway_config_js_1 = require("./onboarding.gateway-config.js");
var prompts_js_1 = require("./prompts.js");
function requireRiskAcknowledgement(params) {
    return __awaiter(this, void 0, void 0, function () {
        var ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (params.opts.acceptRisk === true) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, params.prompter.note([
                            "Security warning — please read.",
                            "",
                            "OpenClaw is a hobby project and still in beta. Expect sharp edges.",
                            "This bot can read files and run actions if tools are enabled.",
                            "A bad prompt can trick it into doing unsafe things.",
                            "",
                            "If you’re not comfortable with basic security and access control, don’t run OpenClaw.",
                            "Ask someone experienced to help before enabling tools or exposing it to the internet.",
                            "",
                            "Recommended baseline:",
                            "- Pairing/allowlists + mention gating.",
                            "- Sandbox + least-privilege tools.",
                            "- Keep secrets out of the agent’s reachable filesystem.",
                            "- Use the strongest available model for any bot with tools or untrusted inboxes.",
                            "",
                            "Run regularly:",
                            "openclaw security audit --deep",
                            "openclaw security audit --fix",
                            "",
                            "Must read: https://docs.openclaw.ai/gateway/security",
                        ].join("\n"), "Security")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, params.prompter.confirm({
                            message: "I understand this is powerful and inherently risky. Continue?",
                            initialValue: false,
                        })];
                case 2:
                    ok = _a.sent();
                    if (!ok) {
                        throw new prompts_js_1.WizardCancelledError("risk not accepted");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function runOnboardingWizard(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime, prompter) {
        var snapshot, baseConfig, quickstartHint, manualHint, explicitFlowRaw, normalizedExplicitFlow, explicitFlow, flow, _a, action, workspaceDefault, resetScope, quickstartGateway, formatBind, formatAuth, formatTailscale, quickstartLines, localPort, localUrl, localProbe, remoteUrl, remoteProbe, _b, mode, _c, _d, nextConfig_1, workspaceInput, _e, _f, workspaceDir, nextConfig, authStore, authChoiceFromPrompt, authChoice, _g, authResult, modelSelection, gateway, settings, quickstartAllowFromChannels, installShell, shell;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_13) {
            switch (_13.label) {
                case 0:
                    (0, onboard_helpers_js_1.printWizardHeader)(runtime);
                    return [4 /*yield*/, prompter.intro("OpenClaw onboarding")];
                case 1:
                    _13.sent();
                    return [4 /*yield*/, requireRiskAcknowledgement({ opts: opts, prompter: prompter })];
                case 2:
                    _13.sent();
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 3:
                    snapshot = _13.sent();
                    baseConfig = snapshot.valid ? snapshot.config : {};
                    if (!(snapshot.exists && !snapshot.valid)) return [3 /*break*/, 8];
                    return [4 /*yield*/, prompter.note((0, onboard_helpers_js_1.summarizeExistingConfig)(baseConfig), "Invalid config")];
                case 4:
                    _13.sent();
                    if (!(snapshot.issues.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, prompter.note(__spreadArray(__spreadArray([], snapshot.issues.map(function (iss) { return "- ".concat(iss.path, ": ").concat(iss.message); }), true), [
                            "",
                            "Docs: https://docs.openclaw.ai/gateway/configuration",
                        ], false).join("\n"), "Config issues")];
                case 5:
                    _13.sent();
                    _13.label = 6;
                case 6: return [4 /*yield*/, prompter.outro("Config invalid. Run `".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor"), "` to repair it, then re-run onboarding."))];
                case 7:
                    _13.sent();
                    runtime.exit(1);
                    return [2 /*return*/];
                case 8:
                    quickstartHint = "Configure details later via ".concat((0, command_format_js_1.formatCliCommand)("openclaw configure"), ".");
                    manualHint = "Configure port, network, Tailscale, and auth options.";
                    explicitFlowRaw = (_h = opts.flow) === null || _h === void 0 ? void 0 : _h.trim();
                    normalizedExplicitFlow = explicitFlowRaw === "manual" ? "advanced" : explicitFlowRaw;
                    if (normalizedExplicitFlow &&
                        normalizedExplicitFlow !== "quickstart" &&
                        normalizedExplicitFlow !== "advanced") {
                        runtime.error("Invalid --flow (use quickstart, manual, or advanced).");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    explicitFlow = normalizedExplicitFlow === "quickstart" || normalizedExplicitFlow === "advanced"
                        ? normalizedExplicitFlow
                        : undefined;
                    if (!(explicitFlow !== null && explicitFlow !== void 0)) return [3 /*break*/, 9];
                    _a = explicitFlow;
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, prompter.select({
                        message: "Onboarding mode",
                        options: [
                            { value: "quickstart", label: "QuickStart", hint: quickstartHint },
                            { value: "advanced", label: "Manual", hint: manualHint },
                        ],
                        initialValue: "quickstart",
                    })];
                case 10:
                    _a = (_13.sent());
                    _13.label = 11;
                case 11:
                    flow = _a;
                    if (!(opts.mode === "remote" && flow === "quickstart")) return [3 /*break*/, 13];
                    return [4 /*yield*/, prompter.note("QuickStart only supports local gateways. Switching to Manual mode.", "QuickStart")];
                case 12:
                    _13.sent();
                    flow = "advanced";
                    _13.label = 13;
                case 13:
                    if (!snapshot.exists) return [3 /*break*/, 18];
                    return [4 /*yield*/, prompter.note((0, onboard_helpers_js_1.summarizeExistingConfig)(baseConfig), "Existing config detected")];
                case 14:
                    _13.sent();
                    return [4 /*yield*/, prompter.select({
                            message: "Config handling",
                            options: [
                                { value: "keep", label: "Use existing values" },
                                { value: "modify", label: "Update values" },
                                { value: "reset", label: "Reset" },
                            ],
                        })];
                case 15:
                    action = _13.sent();
                    if (!(action === "reset")) return [3 /*break*/, 18];
                    workspaceDefault = (_l = (_k = (_j = baseConfig.agents) === null || _j === void 0 ? void 0 : _j.defaults) === null || _k === void 0 ? void 0 : _k.workspace) !== null && _l !== void 0 ? _l : onboard_helpers_js_1.DEFAULT_WORKSPACE;
                    return [4 /*yield*/, prompter.select({
                            message: "Reset scope",
                            options: [
                                { value: "config", label: "Config only" },
                                {
                                    value: "config+creds+sessions",
                                    label: "Config + creds + sessions",
                                },
                                {
                                    value: "full",
                                    label: "Full reset (config + creds + sessions + workspace)",
                                },
                            ],
                        })];
                case 16:
                    resetScope = (_13.sent());
                    return [4 /*yield*/, (0, onboard_helpers_js_1.handleReset)(resetScope, (0, utils_js_1.resolveUserPath)(workspaceDefault), runtime)];
                case 17:
                    _13.sent();
                    baseConfig = {};
                    _13.label = 18;
                case 18:
                    quickstartGateway = (function () {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
                        var hasExisting = typeof ((_a = baseConfig.gateway) === null || _a === void 0 ? void 0 : _a.port) === "number" ||
                            ((_b = baseConfig.gateway) === null || _b === void 0 ? void 0 : _b.bind) !== undefined ||
                            ((_d = (_c = baseConfig.gateway) === null || _c === void 0 ? void 0 : _c.auth) === null || _d === void 0 ? void 0 : _d.mode) !== undefined ||
                            ((_f = (_e = baseConfig.gateway) === null || _e === void 0 ? void 0 : _e.auth) === null || _f === void 0 ? void 0 : _f.token) !== undefined ||
                            ((_h = (_g = baseConfig.gateway) === null || _g === void 0 ? void 0 : _g.auth) === null || _h === void 0 ? void 0 : _h.password) !== undefined ||
                            ((_j = baseConfig.gateway) === null || _j === void 0 ? void 0 : _j.customBindHost) !== undefined ||
                            ((_l = (_k = baseConfig.gateway) === null || _k === void 0 ? void 0 : _k.tailscale) === null || _l === void 0 ? void 0 : _l.mode) !== undefined;
                        var bindRaw = (_m = baseConfig.gateway) === null || _m === void 0 ? void 0 : _m.bind;
                        var bind = bindRaw === "loopback" ||
                            bindRaw === "lan" ||
                            bindRaw === "auto" ||
                            bindRaw === "custom" ||
                            bindRaw === "tailnet"
                            ? bindRaw
                            : "loopback";
                        var authMode = "token";
                        if (((_p = (_o = baseConfig.gateway) === null || _o === void 0 ? void 0 : _o.auth) === null || _p === void 0 ? void 0 : _p.mode) === "token" ||
                            ((_r = (_q = baseConfig.gateway) === null || _q === void 0 ? void 0 : _q.auth) === null || _r === void 0 ? void 0 : _r.mode) === "password") {
                            authMode = baseConfig.gateway.auth.mode;
                        }
                        else if ((_t = (_s = baseConfig.gateway) === null || _s === void 0 ? void 0 : _s.auth) === null || _t === void 0 ? void 0 : _t.token) {
                            authMode = "token";
                        }
                        else if ((_v = (_u = baseConfig.gateway) === null || _u === void 0 ? void 0 : _u.auth) === null || _v === void 0 ? void 0 : _v.password) {
                            authMode = "password";
                        }
                        var tailscaleRaw = (_x = (_w = baseConfig.gateway) === null || _w === void 0 ? void 0 : _w.tailscale) === null || _x === void 0 ? void 0 : _x.mode;
                        var tailscaleMode = tailscaleRaw === "off" || tailscaleRaw === "serve" || tailscaleRaw === "funnel"
                            ? tailscaleRaw
                            : "off";
                        return {
                            hasExisting: hasExisting,
                            port: (0, config_js_1.resolveGatewayPort)(baseConfig),
                            bind: bind,
                            authMode: authMode,
                            tailscaleMode: tailscaleMode,
                            token: (_z = (_y = baseConfig.gateway) === null || _y === void 0 ? void 0 : _y.auth) === null || _z === void 0 ? void 0 : _z.token,
                            password: (_1 = (_0 = baseConfig.gateway) === null || _0 === void 0 ? void 0 : _0.auth) === null || _1 === void 0 ? void 0 : _1.password,
                            customBindHost: (_2 = baseConfig.gateway) === null || _2 === void 0 ? void 0 : _2.customBindHost,
                            tailscaleResetOnExit: (_5 = (_4 = (_3 = baseConfig.gateway) === null || _3 === void 0 ? void 0 : _3.tailscale) === null || _4 === void 0 ? void 0 : _4.resetOnExit) !== null && _5 !== void 0 ? _5 : false,
                        };
                    })();
                    if (!(flow === "quickstart")) return [3 /*break*/, 20];
                    formatBind = function (value) {
                        if (value === "loopback") {
                            return "Loopback (127.0.0.1)";
                        }
                        if (value === "lan") {
                            return "LAN";
                        }
                        if (value === "custom") {
                            return "Custom IP";
                        }
                        if (value === "tailnet") {
                            return "Tailnet (Tailscale IP)";
                        }
                        return "Auto";
                    };
                    formatAuth = function (value) {
                        if (value === "token") {
                            return "Token (default)";
                        }
                        return "Password";
                    };
                    formatTailscale = function (value) {
                        if (value === "off") {
                            return "Off";
                        }
                        if (value === "serve") {
                            return "Serve";
                        }
                        return "Funnel";
                    };
                    quickstartLines = quickstartGateway.hasExisting
                        ? __spreadArray(__spreadArray([
                            "Keeping your current gateway settings:",
                            "Gateway port: ".concat(quickstartGateway.port),
                            "Gateway bind: ".concat(formatBind(quickstartGateway.bind))
                        ], (quickstartGateway.bind === "custom" && quickstartGateway.customBindHost
                            ? ["Gateway custom IP: ".concat(quickstartGateway.customBindHost)]
                            : []), true), [
                            "Gateway auth: ".concat(formatAuth(quickstartGateway.authMode)),
                            "Tailscale exposure: ".concat(formatTailscale(quickstartGateway.tailscaleMode)),
                            "Direct to chat channels.",
                        ], false) : [
                        "Gateway port: ".concat(config_js_1.DEFAULT_GATEWAY_PORT),
                        "Gateway bind: Loopback (127.0.0.1)",
                        "Gateway auth: Token (default)",
                        "Tailscale exposure: Off",
                        "Direct to chat channels.",
                    ];
                    return [4 /*yield*/, prompter.note(quickstartLines.join("\n"), "QuickStart")];
                case 19:
                    _13.sent();
                    _13.label = 20;
                case 20:
                    localPort = (0, config_js_1.resolveGatewayPort)(baseConfig);
                    localUrl = "ws://127.0.0.1:".concat(localPort);
                    return [4 /*yield*/, (0, onboard_helpers_js_1.probeGatewayReachable)({
                            url: localUrl,
                            token: (_p = (_o = (_m = baseConfig.gateway) === null || _m === void 0 ? void 0 : _m.auth) === null || _o === void 0 ? void 0 : _o.token) !== null && _p !== void 0 ? _p : process.env.OPENCLAW_GATEWAY_TOKEN,
                            password: (_s = (_r = (_q = baseConfig.gateway) === null || _q === void 0 ? void 0 : _q.auth) === null || _r === void 0 ? void 0 : _r.password) !== null && _s !== void 0 ? _s : process.env.OPENCLAW_GATEWAY_PASSWORD,
                        })];
                case 21:
                    localProbe = _13.sent();
                    remoteUrl = (_w = (_v = (_u = (_t = baseConfig.gateway) === null || _t === void 0 ? void 0 : _t.remote) === null || _u === void 0 ? void 0 : _u.url) === null || _v === void 0 ? void 0 : _v.trim()) !== null && _w !== void 0 ? _w : "";
                    if (!remoteUrl) return [3 /*break*/, 23];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.probeGatewayReachable)({
                            url: remoteUrl,
                            token: (_y = (_x = baseConfig.gateway) === null || _x === void 0 ? void 0 : _x.remote) === null || _y === void 0 ? void 0 : _y.token,
                        })];
                case 22:
                    _b = _13.sent();
                    return [3 /*break*/, 24];
                case 23:
                    _b = null;
                    _13.label = 24;
                case 24:
                    remoteProbe = _b;
                    if (!((_z = opts.mode) !== null && _z !== void 0)) return [3 /*break*/, 25];
                    _c = _z;
                    return [3 /*break*/, 29];
                case 25:
                    if (!(flow === "quickstart")) return [3 /*break*/, 26];
                    _d = "local";
                    return [3 /*break*/, 28];
                case 26: return [4 /*yield*/, prompter.select({
                        message: "What do you want to set up?",
                        options: [
                            {
                                value: "local",
                                label: "Local gateway (this machine)",
                                hint: localProbe.ok
                                    ? "Gateway reachable (".concat(localUrl, ")")
                                    : "No gateway detected (".concat(localUrl, ")"),
                            },
                            {
                                value: "remote",
                                label: "Remote gateway (info-only)",
                                hint: !remoteUrl
                                    ? "No remote URL configured yet"
                                    : (remoteProbe === null || remoteProbe === void 0 ? void 0 : remoteProbe.ok)
                                        ? "Gateway reachable (".concat(remoteUrl, ")")
                                        : "Configured but unreachable (".concat(remoteUrl, ")"),
                            },
                        ],
                    })];
                case 27:
                    _d = (_13.sent());
                    _13.label = 28;
                case 28:
                    _c = (_d);
                    _13.label = 29;
                case 29:
                    mode = _c;
                    if (!(mode === "remote")) return [3 /*break*/, 33];
                    return [4 /*yield*/, (0, onboard_remote_js_1.promptRemoteGatewayConfig)(baseConfig, prompter)];
                case 30:
                    nextConfig_1 = _13.sent();
                    nextConfig_1 = (0, onboard_helpers_js_1.applyWizardMetadata)(nextConfig_1, { command: "onboard", mode: mode });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig_1)];
                case 31:
                    _13.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    return [4 /*yield*/, prompter.outro("Remote gateway configured.")];
                case 32:
                    _13.sent();
                    return [2 /*return*/];
                case 33:
                    if (!((_0 = opts.workspace) !== null && _0 !== void 0)) return [3 /*break*/, 34];
                    _e = _0;
                    return [3 /*break*/, 38];
                case 34:
                    if (!(flow === "quickstart")) return [3 /*break*/, 35];
                    _f = ((_3 = (_2 = (_1 = baseConfig.agents) === null || _1 === void 0 ? void 0 : _1.defaults) === null || _2 === void 0 ? void 0 : _2.workspace) !== null && _3 !== void 0 ? _3 : onboard_helpers_js_1.DEFAULT_WORKSPACE);
                    return [3 /*break*/, 37];
                case 35: return [4 /*yield*/, prompter.text({
                        message: "Workspace directory",
                        initialValue: (_6 = (_5 = (_4 = baseConfig.agents) === null || _4 === void 0 ? void 0 : _4.defaults) === null || _5 === void 0 ? void 0 : _5.workspace) !== null && _6 !== void 0 ? _6 : onboard_helpers_js_1.DEFAULT_WORKSPACE,
                    })];
                case 36:
                    _f = _13.sent();
                    _13.label = 37;
                case 37:
                    _e = (_f);
                    _13.label = 38;
                case 38:
                    workspaceInput = _e;
                    workspaceDir = (0, utils_js_1.resolveUserPath)(workspaceInput.trim() || onboard_helpers_js_1.DEFAULT_WORKSPACE);
                    nextConfig = __assign(__assign({}, baseConfig), { agents: __assign(__assign({}, baseConfig.agents), { defaults: __assign(__assign({}, (_7 = baseConfig.agents) === null || _7 === void 0 ? void 0 : _7.defaults), { workspace: workspaceDir }) }), gateway: __assign(__assign({}, baseConfig.gateway), { mode: "local" }) });
                    authStore = (0, auth_profiles_js_1.ensureAuthProfileStore)(undefined, {
                        allowKeychainPrompt: false,
                    });
                    authChoiceFromPrompt = opts.authChoice === undefined;
                    if (!((_8 = opts.authChoice) !== null && _8 !== void 0)) return [3 /*break*/, 39];
                    _g = _8;
                    return [3 /*break*/, 41];
                case 39: return [4 /*yield*/, (0, auth_choice_prompt_js_1.promptAuthChoiceGrouped)({
                        prompter: prompter,
                        store: authStore,
                        includeSkip: true,
                    })];
                case 40:
                    _g = (_13.sent());
                    _13.label = 41;
                case 41:
                    authChoice = _g;
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: authChoice,
                            config: nextConfig,
                            prompter: prompter,
                            runtime: runtime,
                            setDefaultModel: true,
                            opts: {
                                tokenProvider: opts.tokenProvider,
                                token: opts.authChoice === "apiKey" && opts.token ? opts.token : undefined,
                            },
                        })];
                case 42:
                    authResult = _13.sent();
                    nextConfig = authResult.config;
                    if (!authChoiceFromPrompt) return [3 /*break*/, 44];
                    return [4 /*yield*/, (0, model_picker_js_1.promptDefaultModel)({
                            config: nextConfig,
                            prompter: prompter,
                            allowKeep: true,
                            ignoreAllowlist: true,
                            preferredProvider: (0, auth_choice_js_1.resolvePreferredProviderForAuthChoice)(authChoice),
                        })];
                case 43:
                    modelSelection = _13.sent();
                    if (modelSelection.model) {
                        nextConfig = (0, model_picker_js_1.applyPrimaryModel)(nextConfig, modelSelection.model);
                    }
                    _13.label = 44;
                case 44: return [4 /*yield*/, (0, auth_choice_js_1.warnIfModelConfigLooksOff)(nextConfig, prompter)];
                case 45:
                    _13.sent();
                    return [4 /*yield*/, (0, onboarding_gateway_config_js_1.configureGatewayForOnboarding)({
                            flow: flow,
                            baseConfig: baseConfig,
                            nextConfig: nextConfig,
                            localPort: localPort,
                            quickstartGateway: quickstartGateway,
                            prompter: prompter,
                            runtime: runtime,
                        })];
                case 46:
                    gateway = _13.sent();
                    nextConfig = gateway.nextConfig;
                    settings = gateway.settings;
                    if (!((_9 = opts.skipChannels) !== null && _9 !== void 0 ? _9 : opts.skipProviders)) return [3 /*break*/, 48];
                    return [4 /*yield*/, prompter.note("Skipping channel setup.", "Channels")];
                case 47:
                    _13.sent();
                    return [3 /*break*/, 50];
                case 48:
                    quickstartAllowFromChannels = flow === "quickstart"
                        ? (0, index_js_1.listChannelPlugins)()
                            .filter(function (plugin) { return plugin.meta.quickstartAllowFrom; })
                            .map(function (plugin) { return plugin.id; })
                        : [];
                    return [4 /*yield*/, (0, onboard_channels_js_1.setupChannels)(nextConfig, runtime, prompter, {
                            allowSignalInstall: true,
                            forceAllowFromChannels: quickstartAllowFromChannels,
                            skipDmPolicyPrompt: flow === "quickstart",
                            skipConfirm: flow === "quickstart",
                            quickstartDefaults: flow === "quickstart",
                        })];
                case 49:
                    nextConfig = _13.sent();
                    _13.label = 50;
                case 50: return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
                case 51:
                    _13.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    return [4 /*yield*/, (0, onboard_helpers_js_1.ensureWorkspaceAndSessions)(workspaceDir, runtime, {
                            skipBootstrap: Boolean((_11 = (_10 = nextConfig.agents) === null || _10 === void 0 ? void 0 : _10.defaults) === null || _11 === void 0 ? void 0 : _11.skipBootstrap),
                        })];
                case 52:
                    _13.sent();
                    if (!opts.skipSkills) return [3 /*break*/, 54];
                    return [4 /*yield*/, prompter.note("Skipping skills setup.", "Skills")];
                case 53:
                    _13.sent();
                    return [3 /*break*/, 56];
                case 54: return [4 /*yield*/, (0, onboard_skills_js_1.setupSkills)(nextConfig, workspaceDir, runtime, prompter)];
                case 55:
                    nextConfig = _13.sent();
                    _13.label = 56;
                case 56: return [4 /*yield*/, (0, onboard_hooks_js_1.setupInternalHooks)(nextConfig, runtime, prompter)];
                case 57:
                    // Setup hooks (session memory on /new)
                    nextConfig = _13.sent();
                    nextConfig = (0, onboard_helpers_js_1.applyWizardMetadata)(nextConfig, { command: "onboard", mode: mode });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
                case 58:
                    _13.sent();
                    return [4 /*yield*/, (0, onboarding_finalize_js_1.finalizeOnboardingWizard)({
                            flow: flow,
                            opts: opts,
                            baseConfig: baseConfig,
                            nextConfig: nextConfig,
                            workspaceDir: workspaceDir,
                            settings: settings,
                            prompter: prompter,
                            runtime: runtime,
                        })];
                case 59:
                    _13.sent();
                    return [4 /*yield*/, prompter.confirm({
                            message: "Install shell completion script?",
                            initialValue: true,
                        })];
                case 60:
                    installShell = _13.sent();
                    if (!installShell) return [3 /*break*/, 62];
                    shell = ((_12 = process.env.SHELL) === null || _12 === void 0 ? void 0 : _12.split("/").pop()) || "zsh";
                    // We pass 'yes=true' to skip any double-confirmation inside the helper,
                    // as the wizard prompt above serves as confirmation.
                    return [4 /*yield*/, (0, completion_cli_js_1.installCompletion)(shell, true)];
                case 61:
                    // We pass 'yes=true' to skip any double-confirmation inside the helper,
                    // as the wizard prompt above serves as confirmation.
                    _13.sent();
                    _13.label = 62;
                case 62: return [2 /*return*/];
            }
        });
    });
}
