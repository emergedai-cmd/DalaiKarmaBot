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
exports.runConfigureWizard = runConfigureWizard;
var command_format_js_1 = require("../cli/command-format.js");
var config_js_1 = require("../config/config.js");
var logging_js_1 = require("../config/logging.js");
var control_ui_assets_js_1 = require("../infra/control-ui-assets.js");
var runtime_js_1 = require("../runtime.js");
var note_js_1 = require("../terminal/note.js");
var utils_js_1 = require("../utils.js");
var clack_prompter_js_1 = require("../wizard/clack-prompter.js");
var prompts_js_1 = require("../wizard/prompts.js");
var configure_channels_js_1 = require("./configure.channels.js");
var configure_daemon_js_1 = require("./configure.daemon.js");
var configure_gateway_auth_js_1 = require("./configure.gateway-auth.js");
var configure_gateway_js_1 = require("./configure.gateway.js");
var configure_shared_js_1 = require("./configure.shared.js");
var health_format_js_1 = require("./health-format.js");
var health_js_1 = require("./health.js");
var onboard_channels_js_1 = require("./onboard-channels.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
var onboard_remote_js_1 = require("./onboard-remote.js");
var onboard_skills_js_1 = require("./onboard-skills.js");
function promptConfigureSection(runtime, hasSelection) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.select)({
                            message: "Select sections to configure",
                            options: __spreadArray(__spreadArray([], configure_shared_js_1.CONFIGURE_SECTION_OPTIONS, true), [
                                {
                                    value: "__continue",
                                    label: "Continue",
                                    hint: hasSelection ? "Done" : "Skip for now",
                                },
                            ], false),
                            initialValue: (_b = configure_shared_js_1.CONFIGURE_SECTION_OPTIONS[0]) === null || _b === void 0 ? void 0 : _b.value,
                        })];
                case 1: return [2 /*return*/, _a.apply(void 0, [_c.sent(), runtime])];
            }
        });
    });
}
function promptChannelMode(runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.select)({
                            message: "Channels",
                            options: [
                                {
                                    value: "configure",
                                    label: "Configure/link",
                                    hint: "Add/update channels; disable unselected accounts",
                                },
                                {
                                    value: "remove",
                                    label: "Remove channel config",
                                    hint: "Delete channel tokens/settings from openclaw.json",
                                },
                            ],
                            initialValue: "configure",
                        })];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), runtime])];
            }
        });
    });
}
function promptWebToolsConfig(nextConfig, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var existingSearch, existingFetch, hasSearchKey, enableSearch, _a, nextSearch, keyInput, _b, key, enableFetch, _c, nextFetch;
        var _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    existingSearch = (_e = (_d = nextConfig.tools) === null || _d === void 0 ? void 0 : _d.web) === null || _e === void 0 ? void 0 : _e.search;
                    existingFetch = (_g = (_f = nextConfig.tools) === null || _f === void 0 ? void 0 : _f.web) === null || _g === void 0 ? void 0 : _g.fetch;
                    hasSearchKey = Boolean(existingSearch === null || existingSearch === void 0 ? void 0 : existingSearch.apiKey);
                    (0, note_js_1.note)([
                        "Web search lets your agent look things up online using the `web_search` tool.",
                        "It requires a Brave Search API key (you can store it in the config or set BRAVE_API_KEY in the Gateway environment).",
                        "Docs: https://docs.openclaw.ai/tools/web",
                    ].join("\n"), "Web search");
                    _a = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.confirm)({
                            message: "Enable web_search (Brave Search)?",
                            initialValue: (_h = existingSearch === null || existingSearch === void 0 ? void 0 : existingSearch.enabled) !== null && _h !== void 0 ? _h : hasSearchKey,
                        })];
                case 1:
                    enableSearch = _a.apply(void 0, [_l.sent(), runtime]);
                    nextSearch = __assign(__assign({}, existingSearch), { enabled: enableSearch });
                    if (!enableSearch) return [3 /*break*/, 3];
                    _b = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.text)({
                            message: hasSearchKey
                                ? "Brave Search API key (leave blank to keep current or use BRAVE_API_KEY)"
                                : "Brave Search API key (paste it here; leave blank to use BRAVE_API_KEY)",
                            placeholder: hasSearchKey ? "Leave blank to keep current" : "BSA...",
                        })];
                case 2:
                    keyInput = _b.apply(void 0, [_l.sent(), runtime]);
                    key = String(keyInput !== null && keyInput !== void 0 ? keyInput : "").trim();
                    if (key) {
                        nextSearch = __assign(__assign({}, nextSearch), { apiKey: key });
                    }
                    else if (!hasSearchKey) {
                        (0, note_js_1.note)([
                            "No key stored yet, so web_search will stay unavailable.",
                            "Store a key here or set BRAVE_API_KEY in the Gateway environment.",
                            "Docs: https://docs.openclaw.ai/tools/web",
                        ].join("\n"), "Web search");
                    }
                    _l.label = 3;
                case 3:
                    _c = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.confirm)({
                            message: "Enable web_fetch (keyless HTTP fetch)?",
                            initialValue: (_j = existingFetch === null || existingFetch === void 0 ? void 0 : existingFetch.enabled) !== null && _j !== void 0 ? _j : true,
                        })];
                case 4:
                    enableFetch = _c.apply(void 0, [_l.sent(), runtime]);
                    nextFetch = __assign(__assign({}, existingFetch), { enabled: enableFetch });
                    return [2 /*return*/, __assign(__assign({}, nextConfig), { tools: __assign(__assign({}, nextConfig.tools), { web: __assign(__assign({}, (_k = nextConfig.tools) === null || _k === void 0 ? void 0 : _k.web), { search: nextSearch, fetch: nextFetch }) }) })];
            }
        });
    });
}
function runConfigureWizard(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var prompter, snapshot, baseConfig, title, localUrl, localProbe, remoteUrl, remoteProbe, _a, mode_1, _b, remoteConfig, nextConfig_1, didSetGatewayMode, workspaceDir, gatewayPort, gatewayToken, persistConfig, selected, workspaceInput, _c, gateway, channelMode, wsDir, portInput, _d, localLinks, remoteUrl_1, wsUrl, token_1, password, err_1, ranSection, didConfigureGateway, choice, workspaceInput, _e, gateway, channelMode, wsDir, portInput, _f, localLinks, remoteUrl_2, wsUrl, token_2, password, err_2, controlUiAssets, bind, links, newPassword, oldPassword, token, gatewayProbe, gatewayStatusLine, err_3;
        var _this = this;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_49) {
            switch (_49.label) {
                case 0:
                    _49.trys.push([0, 81, , 82]);
                    (0, onboard_helpers_js_1.printWizardHeader)(runtime);
                    (0, configure_shared_js_1.intro)(opts.command === "update" ? "OpenClaw update wizard" : "OpenClaw configure");
                    prompter = (0, clack_prompter_js_1.createClackPrompter)();
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _49.sent();
                    baseConfig = snapshot.valid ? snapshot.config : {};
                    if (snapshot.exists) {
                        title = snapshot.valid ? "Existing config detected" : "Invalid config";
                        (0, note_js_1.note)((0, onboard_helpers_js_1.summarizeExistingConfig)(baseConfig), title);
                        if (!snapshot.valid && snapshot.issues.length > 0) {
                            (0, note_js_1.note)(__spreadArray(__spreadArray([], snapshot.issues.map(function (iss) { return "- ".concat(iss.path, ": ").concat(iss.message); }), true), [
                                "",
                                "Docs: https://docs.openclaw.ai/gateway/configuration",
                            ], false).join("\n"), "Config issues");
                        }
                        if (!snapshot.valid) {
                            (0, configure_shared_js_1.outro)("Config invalid. Run `".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor"), "` to repair it, then re-run configure."));
                            runtime.exit(1);
                            return [2 /*return*/];
                        }
                    }
                    localUrl = "ws://127.0.0.1:18789";
                    return [4 /*yield*/, (0, onboard_helpers_js_1.probeGatewayReachable)({
                            url: localUrl,
                            token: (_j = (_h = (_g = baseConfig.gateway) === null || _g === void 0 ? void 0 : _g.auth) === null || _h === void 0 ? void 0 : _h.token) !== null && _j !== void 0 ? _j : process.env.OPENCLAW_GATEWAY_TOKEN,
                            password: (_m = (_l = (_k = baseConfig.gateway) === null || _k === void 0 ? void 0 : _k.auth) === null || _l === void 0 ? void 0 : _l.password) !== null && _m !== void 0 ? _m : process.env.OPENCLAW_GATEWAY_PASSWORD,
                        })];
                case 2:
                    localProbe = _49.sent();
                    remoteUrl = (_r = (_q = (_p = (_o = baseConfig.gateway) === null || _o === void 0 ? void 0 : _o.remote) === null || _p === void 0 ? void 0 : _p.url) === null || _q === void 0 ? void 0 : _q.trim()) !== null && _r !== void 0 ? _r : "";
                    if (!remoteUrl) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.probeGatewayReachable)({
                            url: remoteUrl,
                            token: (_t = (_s = baseConfig.gateway) === null || _s === void 0 ? void 0 : _s.remote) === null || _t === void 0 ? void 0 : _t.token,
                        })];
                case 3:
                    _a = _49.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = null;
                    _49.label = 5;
                case 5:
                    remoteProbe = _a;
                    _b = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.select)({
                            message: "Where will the Gateway run?",
                            options: [
                                {
                                    value: "local",
                                    label: "Local (this machine)",
                                    hint: localProbe.ok
                                        ? "Gateway reachable (".concat(localUrl, ")")
                                        : "No gateway detected (".concat(localUrl, ")"),
                                },
                                {
                                    value: "remote",
                                    label: "Remote (info-only)",
                                    hint: !remoteUrl
                                        ? "No remote URL configured yet"
                                        : (remoteProbe === null || remoteProbe === void 0 ? void 0 : remoteProbe.ok)
                                            ? "Gateway reachable (".concat(remoteUrl, ")")
                                            : "Configured but unreachable (".concat(remoteUrl, ")"),
                                },
                            ],
                        })];
                case 6:
                    mode_1 = _b.apply(void 0, [_49.sent(), runtime]);
                    if (!(mode_1 === "remote")) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, onboard_remote_js_1.promptRemoteGatewayConfig)(baseConfig, prompter)];
                case 7:
                    remoteConfig = _49.sent();
                    remoteConfig = (0, onboard_helpers_js_1.applyWizardMetadata)(remoteConfig, {
                        command: opts.command,
                        mode: mode_1,
                    });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(remoteConfig)];
                case 8:
                    _49.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    (0, configure_shared_js_1.outro)("Remote gateway configured.");
                    return [2 /*return*/];
                case 9:
                    nextConfig_1 = __assign({}, baseConfig);
                    didSetGatewayMode = false;
                    if (((_u = nextConfig_1.gateway) === null || _u === void 0 ? void 0 : _u.mode) !== "local") {
                        nextConfig_1 = __assign(__assign({}, nextConfig_1), { gateway: __assign(__assign({}, nextConfig_1.gateway), { mode: "local" }) });
                        didSetGatewayMode = true;
                    }
                    workspaceDir = (_0 = (_x = (_w = (_v = nextConfig_1.agents) === null || _v === void 0 ? void 0 : _v.defaults) === null || _w === void 0 ? void 0 : _w.workspace) !== null && _x !== void 0 ? _x : (_z = (_y = baseConfig.agents) === null || _y === void 0 ? void 0 : _y.defaults) === null || _z === void 0 ? void 0 : _z.workspace) !== null && _0 !== void 0 ? _0 : onboard_helpers_js_1.DEFAULT_WORKSPACE;
                    gatewayPort = (0, config_js_1.resolveGatewayPort)(baseConfig);
                    gatewayToken = (_6 = (_3 = (_2 = (_1 = nextConfig_1.gateway) === null || _1 === void 0 ? void 0 : _1.auth) === null || _2 === void 0 ? void 0 : _2.token) !== null && _3 !== void 0 ? _3 : (_5 = (_4 = baseConfig.gateway) === null || _4 === void 0 ? void 0 : _4.auth) === null || _5 === void 0 ? void 0 : _5.token) !== null && _6 !== void 0 ? _6 : process.env.OPENCLAW_GATEWAY_TOKEN;
                    persistConfig = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    nextConfig_1 = (0, onboard_helpers_js_1.applyWizardMetadata)(nextConfig_1, {
                                        command: opts.command,
                                        mode: mode_1,
                                    });
                                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig_1)];
                                case 1:
                                    _a.sent();
                                    (0, logging_js_1.logConfigUpdated)(runtime);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!opts.sections) return [3 /*break*/, 37];
                    selected = opts.sections;
                    if (!selected || selected.length === 0) {
                        (0, configure_shared_js_1.outro)("No changes selected.");
                        return [2 /*return*/];
                    }
                    if (!selected.includes("workspace")) return [3 /*break*/, 12];
                    _c = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.text)({
                            message: "Workspace directory",
                            initialValue: workspaceDir,
                        })];
                case 10:
                    workspaceInput = _c.apply(void 0, [_49.sent(), runtime]);
                    workspaceDir = (0, utils_js_1.resolveUserPath)(String(workspaceInput !== null && workspaceInput !== void 0 ? workspaceInput : "").trim() || onboard_helpers_js_1.DEFAULT_WORKSPACE);
                    nextConfig_1 = __assign(__assign({}, nextConfig_1), { agents: __assign(__assign({}, nextConfig_1.agents), { defaults: __assign(__assign({}, (_7 = nextConfig_1.agents) === null || _7 === void 0 ? void 0 : _7.defaults), { workspace: workspaceDir }) }) });
                    return [4 /*yield*/, (0, onboard_helpers_js_1.ensureWorkspaceAndSessions)(workspaceDir, runtime)];
                case 11:
                    _49.sent();
                    _49.label = 12;
                case 12:
                    if (!selected.includes("model")) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, configure_gateway_auth_js_1.promptAuthConfig)(nextConfig_1, runtime, prompter)];
                case 13:
                    nextConfig_1 = _49.sent();
                    _49.label = 14;
                case 14:
                    if (!selected.includes("web")) return [3 /*break*/, 16];
                    return [4 /*yield*/, promptWebToolsConfig(nextConfig_1, runtime)];
                case 15:
                    nextConfig_1 = _49.sent();
                    _49.label = 16;
                case 16:
                    if (!selected.includes("gateway")) return [3 /*break*/, 18];
                    return [4 /*yield*/, (0, configure_gateway_js_1.promptGatewayConfig)(nextConfig_1, runtime)];
                case 17:
                    gateway = _49.sent();
                    nextConfig_1 = gateway.config;
                    gatewayPort = gateway.port;
                    gatewayToken = gateway.token;
                    _49.label = 18;
                case 18:
                    if (!selected.includes("channels")) return [3 /*break*/, 24];
                    return [4 /*yield*/, (0, onboard_channels_js_1.noteChannelStatus)({ cfg: nextConfig_1, prompter: prompter })];
                case 19:
                    _49.sent();
                    return [4 /*yield*/, promptChannelMode(runtime)];
                case 20:
                    channelMode = _49.sent();
                    if (!(channelMode === "configure")) return [3 /*break*/, 22];
                    return [4 /*yield*/, (0, onboard_channels_js_1.setupChannels)(nextConfig_1, runtime, prompter, {
                            allowDisable: true,
                            allowSignalInstall: true,
                            skipConfirm: true,
                            skipStatusNote: true,
                        })];
                case 21:
                    nextConfig_1 = _49.sent();
                    return [3 /*break*/, 24];
                case 22: return [4 /*yield*/, (0, configure_channels_js_1.removeChannelConfigWizard)(nextConfig_1, runtime)];
                case 23:
                    nextConfig_1 = _49.sent();
                    _49.label = 24;
                case 24:
                    if (!selected.includes("skills")) return [3 /*break*/, 26];
                    wsDir = (0, utils_js_1.resolveUserPath)(workspaceDir);
                    return [4 /*yield*/, (0, onboard_skills_js_1.setupSkills)(nextConfig_1, wsDir, runtime, prompter)];
                case 25:
                    nextConfig_1 = _49.sent();
                    _49.label = 26;
                case 26: return [4 /*yield*/, persistConfig()];
                case 27:
                    _49.sent();
                    if (!selected.includes("daemon")) return [3 /*break*/, 31];
                    if (!!selected.includes("gateway")) return [3 /*break*/, 29];
                    _d = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.text)({
                            message: "Gateway port for service install",
                            initialValue: String(gatewayPort),
                            validate: function (value) { return (Number.isFinite(Number(value)) ? undefined : "Invalid port"); },
                        })];
                case 28:
                    portInput = _d.apply(void 0, [_49.sent(), runtime]);
                    gatewayPort = Number.parseInt(String(portInput), 10);
                    _49.label = 29;
                case 29: return [4 /*yield*/, (0, configure_daemon_js_1.maybeInstallDaemon)({ runtime: runtime, port: gatewayPort, gatewayToken: gatewayToken })];
                case 30:
                    _49.sent();
                    _49.label = 31;
                case 31:
                    if (!selected.includes("health")) return [3 /*break*/, 36];
                    localLinks = (0, onboard_helpers_js_1.resolveControlUiLinks)({
                        bind: (_9 = (_8 = nextConfig_1.gateway) === null || _8 === void 0 ? void 0 : _8.bind) !== null && _9 !== void 0 ? _9 : "loopback",
                        port: gatewayPort,
                        customBindHost: (_10 = nextConfig_1.gateway) === null || _10 === void 0 ? void 0 : _10.customBindHost,
                        basePath: undefined,
                    });
                    remoteUrl_1 = (_13 = (_12 = (_11 = nextConfig_1.gateway) === null || _11 === void 0 ? void 0 : _11.remote) === null || _12 === void 0 ? void 0 : _12.url) === null || _13 === void 0 ? void 0 : _13.trim();
                    wsUrl = ((_14 = nextConfig_1.gateway) === null || _14 === void 0 ? void 0 : _14.mode) === "remote" && remoteUrl_1 ? remoteUrl_1 : localLinks.wsUrl;
                    token_1 = (_17 = (_16 = (_15 = nextConfig_1.gateway) === null || _15 === void 0 ? void 0 : _15.auth) === null || _16 === void 0 ? void 0 : _16.token) !== null && _17 !== void 0 ? _17 : process.env.OPENCLAW_GATEWAY_TOKEN;
                    password = (_20 = (_19 = (_18 = nextConfig_1.gateway) === null || _18 === void 0 ? void 0 : _18.auth) === null || _19 === void 0 ? void 0 : _19.password) !== null && _20 !== void 0 ? _20 : process.env.OPENCLAW_GATEWAY_PASSWORD;
                    return [4 /*yield*/, (0, onboard_helpers_js_1.waitForGatewayReachable)({
                            url: wsUrl,
                            token: token_1,
                            password: password,
                            deadlineMs: 15000,
                        })];
                case 32:
                    _49.sent();
                    _49.label = 33;
                case 33:
                    _49.trys.push([33, 35, , 36]);
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: false, timeoutMs: 10000 }, runtime)];
                case 34:
                    _49.sent();
                    return [3 /*break*/, 36];
                case 35:
                    err_1 = _49.sent();
                    runtime.error((0, health_format_js_1.formatHealthCheckFailure)(err_1));
                    (0, note_js_1.note)([
                        "Docs:",
                        "https://docs.openclaw.ai/gateway/health",
                        "https://docs.openclaw.ai/gateway/troubleshooting",
                    ].join("\n"), "Health check help");
                    return [3 /*break*/, 36];
                case 36: return [3 /*break*/, 76];
                case 37:
                    ranSection = false;
                    didConfigureGateway = false;
                    _49.label = 38;
                case 38:
                    if (!true) return [3 /*break*/, 73];
                    return [4 /*yield*/, promptConfigureSection(runtime, ranSection)];
                case 39:
                    choice = _49.sent();
                    if (choice === "__continue") {
                        return [3 /*break*/, 73];
                    }
                    ranSection = true;
                    if (!(choice === "workspace")) return [3 /*break*/, 43];
                    _e = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.text)({
                            message: "Workspace directory",
                            initialValue: workspaceDir,
                        })];
                case 40:
                    workspaceInput = _e.apply(void 0, [_49.sent(), runtime]);
                    workspaceDir = (0, utils_js_1.resolveUserPath)(String(workspaceInput !== null && workspaceInput !== void 0 ? workspaceInput : "").trim() || onboard_helpers_js_1.DEFAULT_WORKSPACE);
                    nextConfig_1 = __assign(__assign({}, nextConfig_1), { agents: __assign(__assign({}, nextConfig_1.agents), { defaults: __assign(__assign({}, (_21 = nextConfig_1.agents) === null || _21 === void 0 ? void 0 : _21.defaults), { workspace: workspaceDir }) }) });
                    return [4 /*yield*/, (0, onboard_helpers_js_1.ensureWorkspaceAndSessions)(workspaceDir, runtime)];
                case 41:
                    _49.sent();
                    return [4 /*yield*/, persistConfig()];
                case 42:
                    _49.sent();
                    _49.label = 43;
                case 43:
                    if (!(choice === "model")) return [3 /*break*/, 46];
                    return [4 /*yield*/, (0, configure_gateway_auth_js_1.promptAuthConfig)(nextConfig_1, runtime, prompter)];
                case 44:
                    nextConfig_1 = _49.sent();
                    return [4 /*yield*/, persistConfig()];
                case 45:
                    _49.sent();
                    _49.label = 46;
                case 46:
                    if (!(choice === "web")) return [3 /*break*/, 49];
                    return [4 /*yield*/, promptWebToolsConfig(nextConfig_1, runtime)];
                case 47:
                    nextConfig_1 = _49.sent();
                    return [4 /*yield*/, persistConfig()];
                case 48:
                    _49.sent();
                    _49.label = 49;
                case 49:
                    if (!(choice === "gateway")) return [3 /*break*/, 52];
                    return [4 /*yield*/, (0, configure_gateway_js_1.promptGatewayConfig)(nextConfig_1, runtime)];
                case 50:
                    gateway = _49.sent();
                    nextConfig_1 = gateway.config;
                    gatewayPort = gateway.port;
                    gatewayToken = gateway.token;
                    didConfigureGateway = true;
                    return [4 /*yield*/, persistConfig()];
                case 51:
                    _49.sent();
                    _49.label = 52;
                case 52:
                    if (!(choice === "channels")) return [3 /*break*/, 60];
                    return [4 /*yield*/, (0, onboard_channels_js_1.noteChannelStatus)({ cfg: nextConfig_1, prompter: prompter })];
                case 53:
                    _49.sent();
                    return [4 /*yield*/, promptChannelMode(runtime)];
                case 54:
                    channelMode = _49.sent();
                    if (!(channelMode === "configure")) return [3 /*break*/, 56];
                    return [4 /*yield*/, (0, onboard_channels_js_1.setupChannels)(nextConfig_1, runtime, prompter, {
                            allowDisable: true,
                            allowSignalInstall: true,
                            skipConfirm: true,
                            skipStatusNote: true,
                        })];
                case 55:
                    nextConfig_1 = _49.sent();
                    return [3 /*break*/, 58];
                case 56: return [4 /*yield*/, (0, configure_channels_js_1.removeChannelConfigWizard)(nextConfig_1, runtime)];
                case 57:
                    nextConfig_1 = _49.sent();
                    _49.label = 58;
                case 58: return [4 /*yield*/, persistConfig()];
                case 59:
                    _49.sent();
                    _49.label = 60;
                case 60:
                    if (!(choice === "skills")) return [3 /*break*/, 63];
                    wsDir = (0, utils_js_1.resolveUserPath)(workspaceDir);
                    return [4 /*yield*/, (0, onboard_skills_js_1.setupSkills)(nextConfig_1, wsDir, runtime, prompter)];
                case 61:
                    nextConfig_1 = _49.sent();
                    return [4 /*yield*/, persistConfig()];
                case 62:
                    _49.sent();
                    _49.label = 63;
                case 63:
                    if (!(choice === "daemon")) return [3 /*break*/, 67];
                    if (!!didConfigureGateway) return [3 /*break*/, 65];
                    _f = onboard_helpers_js_1.guardCancel;
                    return [4 /*yield*/, (0, configure_shared_js_1.text)({
                            message: "Gateway port for service install",
                            initialValue: String(gatewayPort),
                            validate: function (value) { return (Number.isFinite(Number(value)) ? undefined : "Invalid port"); },
                        })];
                case 64:
                    portInput = _f.apply(void 0, [_49.sent(), runtime]);
                    gatewayPort = Number.parseInt(String(portInput), 10);
                    _49.label = 65;
                case 65: return [4 /*yield*/, (0, configure_daemon_js_1.maybeInstallDaemon)({
                        runtime: runtime,
                        port: gatewayPort,
                        gatewayToken: gatewayToken,
                    })];
                case 66:
                    _49.sent();
                    _49.label = 67;
                case 67:
                    if (!(choice === "health")) return [3 /*break*/, 72];
                    localLinks = (0, onboard_helpers_js_1.resolveControlUiLinks)({
                        bind: (_23 = (_22 = nextConfig_1.gateway) === null || _22 === void 0 ? void 0 : _22.bind) !== null && _23 !== void 0 ? _23 : "loopback",
                        port: gatewayPort,
                        customBindHost: (_24 = nextConfig_1.gateway) === null || _24 === void 0 ? void 0 : _24.customBindHost,
                        basePath: undefined,
                    });
                    remoteUrl_2 = (_27 = (_26 = (_25 = nextConfig_1.gateway) === null || _25 === void 0 ? void 0 : _25.remote) === null || _26 === void 0 ? void 0 : _26.url) === null || _27 === void 0 ? void 0 : _27.trim();
                    wsUrl = ((_28 = nextConfig_1.gateway) === null || _28 === void 0 ? void 0 : _28.mode) === "remote" && remoteUrl_2 ? remoteUrl_2 : localLinks.wsUrl;
                    token_2 = (_31 = (_30 = (_29 = nextConfig_1.gateway) === null || _29 === void 0 ? void 0 : _29.auth) === null || _30 === void 0 ? void 0 : _30.token) !== null && _31 !== void 0 ? _31 : process.env.OPENCLAW_GATEWAY_TOKEN;
                    password = (_34 = (_33 = (_32 = nextConfig_1.gateway) === null || _32 === void 0 ? void 0 : _32.auth) === null || _33 === void 0 ? void 0 : _33.password) !== null && _34 !== void 0 ? _34 : process.env.OPENCLAW_GATEWAY_PASSWORD;
                    return [4 /*yield*/, (0, onboard_helpers_js_1.waitForGatewayReachable)({
                            url: wsUrl,
                            token: token_2,
                            password: password,
                            deadlineMs: 15000,
                        })];
                case 68:
                    _49.sent();
                    _49.label = 69;
                case 69:
                    _49.trys.push([69, 71, , 72]);
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: false, timeoutMs: 10000 }, runtime)];
                case 70:
                    _49.sent();
                    return [3 /*break*/, 72];
                case 71:
                    err_2 = _49.sent();
                    runtime.error((0, health_format_js_1.formatHealthCheckFailure)(err_2));
                    (0, note_js_1.note)([
                        "Docs:",
                        "https://docs.openclaw.ai/gateway/health",
                        "https://docs.openclaw.ai/gateway/troubleshooting",
                    ].join("\n"), "Health check help");
                    return [3 /*break*/, 72];
                case 72: return [3 /*break*/, 38];
                case 73:
                    if (!!ranSection) return [3 /*break*/, 76];
                    if (!didSetGatewayMode) return [3 /*break*/, 75];
                    return [4 /*yield*/, persistConfig()];
                case 74:
                    _49.sent();
                    (0, configure_shared_js_1.outro)("Gateway mode set to local.");
                    return [2 /*return*/];
                case 75:
                    (0, configure_shared_js_1.outro)("No changes selected.");
                    return [2 /*return*/];
                case 76: return [4 /*yield*/, (0, control_ui_assets_js_1.ensureControlUiAssetsBuilt)(runtime)];
                case 77:
                    controlUiAssets = _49.sent();
                    if (!controlUiAssets.ok && controlUiAssets.message) {
                        runtime.error(controlUiAssets.message);
                    }
                    bind = (_36 = (_35 = nextConfig_1.gateway) === null || _35 === void 0 ? void 0 : _35.bind) !== null && _36 !== void 0 ? _36 : "loopback";
                    links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
                        bind: bind,
                        port: gatewayPort,
                        customBindHost: (_37 = nextConfig_1.gateway) === null || _37 === void 0 ? void 0 : _37.customBindHost,
                        basePath: (_39 = (_38 = nextConfig_1.gateway) === null || _38 === void 0 ? void 0 : _38.controlUi) === null || _39 === void 0 ? void 0 : _39.basePath,
                    });
                    newPassword = (_42 = (_41 = (_40 = nextConfig_1.gateway) === null || _40 === void 0 ? void 0 : _40.auth) === null || _41 === void 0 ? void 0 : _41.password) !== null && _42 !== void 0 ? _42 : process.env.OPENCLAW_GATEWAY_PASSWORD;
                    oldPassword = (_45 = (_44 = (_43 = baseConfig.gateway) === null || _43 === void 0 ? void 0 : _43.auth) === null || _44 === void 0 ? void 0 : _44.password) !== null && _45 !== void 0 ? _45 : process.env.OPENCLAW_GATEWAY_PASSWORD;
                    token = (_48 = (_47 = (_46 = nextConfig_1.gateway) === null || _46 === void 0 ? void 0 : _46.auth) === null || _47 === void 0 ? void 0 : _47.token) !== null && _48 !== void 0 ? _48 : process.env.OPENCLAW_GATEWAY_TOKEN;
                    return [4 /*yield*/, (0, onboard_helpers_js_1.probeGatewayReachable)({
                            url: links.wsUrl,
                            token: token,
                            password: newPassword,
                        })];
                case 78:
                    gatewayProbe = _49.sent();
                    if (!(!gatewayProbe.ok && newPassword !== oldPassword && oldPassword)) return [3 /*break*/, 80];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.probeGatewayReachable)({
                            url: links.wsUrl,
                            token: token,
                            password: oldPassword,
                        })];
                case 79:
                    gatewayProbe = _49.sent();
                    _49.label = 80;
                case 80:
                    gatewayStatusLine = gatewayProbe.ok
                        ? "Gateway: reachable"
                        : "Gateway: not detected".concat(gatewayProbe.detail ? " (".concat(gatewayProbe.detail, ")") : "");
                    (0, note_js_1.note)([
                        "Web UI: ".concat(links.httpUrl),
                        "Gateway WS: ".concat(links.wsUrl),
                        gatewayStatusLine,
                        "Docs: https://docs.openclaw.ai/web/control-ui",
                    ].join("\n"), "Control UI");
                    (0, configure_shared_js_1.outro)("Configure complete.");
                    return [3 /*break*/, 82];
                case 81:
                    err_3 = _49.sent();
                    if (err_3 instanceof prompts_js_1.WizardCancelledError) {
                        runtime.exit(0);
                        return [2 /*return*/];
                    }
                    throw err_3;
                case 82: return [2 /*return*/];
            }
        });
    });
}
