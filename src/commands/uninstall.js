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
exports.uninstallCommand = uninstallCommand;
var prompts_1 = require("@clack/prompts");
var node_path_1 = require("node:path");
var config_js_1 = require("../config/config.js");
var service_js_1 = require("../daemon/service.js");
var prompt_style_js_1 = require("../terminal/prompt-style.js");
var utils_js_1 = require("../utils.js");
var cleanup_utils_js_1 = require("./cleanup-utils.js");
var multiselectStyled = function (params) {
    return (0, prompts_1.multiselect)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message), options: params.options.map(function (opt) {
            return opt.hint === undefined ? opt : __assign(__assign({}, opt), { hint: (0, prompt_style_js_1.stylePromptHint)(opt.hint) });
        }) }));
};
function buildScopeSelection(opts) {
    var hadExplicit = Boolean(opts.all || opts.service || opts.state || opts.workspace || opts.app);
    var scopes = new Set();
    if (opts.all || opts.service) {
        scopes.add("service");
    }
    if (opts.all || opts.state) {
        scopes.add("state");
    }
    if (opts.all || opts.workspace) {
        scopes.add("workspace");
    }
    if (opts.all || opts.app) {
        scopes.add("app");
    }
    return { scopes: scopes, hadExplicit: hadExplicit };
}
function stopAndUninstallService(runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var service, loaded, err_1, err_2, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (config_js_1.isNixMode) {
                        runtime.error("Nix mode detected; service uninstall is disabled.");
                        return [2 /*return*/, false];
                    }
                    service = (0, service_js_1.resolveGatewayService)();
                    loaded = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.isLoaded({ env: process.env })];
                case 2:
                    loaded = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    runtime.error("Gateway service check failed: ".concat(String(err_1)));
                    return [2 /*return*/, false];
                case 4:
                    if (!loaded) {
                        runtime.log("Gateway service ".concat(service.notLoadedText, "."));
                        return [2 /*return*/, true];
                    }
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, service.stop({ env: process.env, stdout: process.stdout })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    runtime.error("Gateway stop failed: ".concat(String(err_2)));
                    return [3 /*break*/, 8];
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, service.uninstall({ env: process.env, stdout: process.stdout })];
                case 9:
                    _a.sent();
                    return [2 /*return*/, true];
                case 10:
                    err_3 = _a.sent();
                    runtime.error("Gateway uninstall failed: ".concat(String(err_3)));
                    return [2 /*return*/, false];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function removeMacApp(runtime, dryRun) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (process.platform !== "darwin") {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)("/Applications/OpenClaw.app", runtime, {
                            dryRun: dryRun,
                            label: "/Applications/OpenClaw.app",
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function uninstallCommand(runtime, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, scopes, hadExplicit, interactive, selection, _i, selection_1, value, ok, dryRun, cfg, stateDir, configPath, oauthDir, configInsideState, oauthInsideState, workspaceDirs, _b, workspaceDirs_1, workspace, home_1;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = buildScopeSelection(opts), scopes = _a.scopes, hadExplicit = _a.hadExplicit;
                    interactive = !opts.nonInteractive;
                    if (!interactive && !opts.yes) {
                        runtime.error("Non-interactive mode requires --yes.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (!!hadExplicit) return [3 /*break*/, 2];
                    if (!interactive) {
                        runtime.error("Non-interactive mode requires explicit scopes (use --all).");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, multiselectStyled({
                            message: "Uninstall which components?",
                            options: [
                                {
                                    value: "service",
                                    label: "Gateway service",
                                    hint: "launchd / systemd / schtasks",
                                },
                                { value: "state", label: "State + config", hint: "~/.openclaw" },
                                { value: "workspace", label: "Workspace", hint: "agent files" },
                                {
                                    value: "app",
                                    label: "macOS app",
                                    hint: "/Applications/OpenClaw.app",
                                },
                            ],
                            initialValues: ["service", "state", "workspace"],
                        })];
                case 1:
                    selection = _e.sent();
                    if ((0, prompts_1.isCancel)(selection)) {
                        (0, prompts_1.cancel)((_c = (0, prompt_style_js_1.stylePromptTitle)("Uninstall cancelled.")) !== null && _c !== void 0 ? _c : "Uninstall cancelled.");
                        runtime.exit(0);
                        return [2 /*return*/];
                    }
                    for (_i = 0, selection_1 = selection; _i < selection_1.length; _i++) {
                        value = selection_1[_i];
                        scopes.add(value);
                    }
                    _e.label = 2;
                case 2:
                    if (scopes.size === 0) {
                        runtime.log("Nothing selected.");
                        return [2 /*return*/];
                    }
                    if (!(interactive && !opts.yes)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, prompts_1.confirm)({
                            message: (0, prompt_style_js_1.stylePromptMessage)("Proceed with uninstall?"),
                        })];
                case 3:
                    ok = _e.sent();
                    if ((0, prompts_1.isCancel)(ok) || !ok) {
                        (0, prompts_1.cancel)((_d = (0, prompt_style_js_1.stylePromptTitle)("Uninstall cancelled.")) !== null && _d !== void 0 ? _d : "Uninstall cancelled.");
                        runtime.exit(0);
                        return [2 /*return*/];
                    }
                    _e.label = 4;
                case 4:
                    dryRun = Boolean(opts.dryRun);
                    cfg = (0, config_js_1.loadConfig)();
                    stateDir = (0, config_js_1.resolveStateDir)();
                    configPath = (0, config_js_1.resolveConfigPath)();
                    oauthDir = (0, config_js_1.resolveOAuthDir)();
                    configInsideState = (0, cleanup_utils_js_1.isPathWithin)(configPath, stateDir);
                    oauthInsideState = (0, cleanup_utils_js_1.isPathWithin)(oauthDir, stateDir);
                    workspaceDirs = (0, cleanup_utils_js_1.collectWorkspaceDirs)(cfg);
                    if (!scopes.has("service")) return [3 /*break*/, 7];
                    if (!dryRun) return [3 /*break*/, 5];
                    runtime.log("[dry-run] remove gateway service");
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, stopAndUninstallService(runtime)];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    if (!scopes.has("state")) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(stateDir, runtime, { dryRun: dryRun, label: stateDir })];
                case 8:
                    _e.sent();
                    if (!!configInsideState) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(configPath, runtime, { dryRun: dryRun, label: configPath })];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    if (!!oauthInsideState) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(oauthDir, runtime, { dryRun: dryRun, label: oauthDir })];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12:
                    if (!scopes.has("workspace")) return [3 /*break*/, 16];
                    _b = 0, workspaceDirs_1 = workspaceDirs;
                    _e.label = 13;
                case 13:
                    if (!(_b < workspaceDirs_1.length)) return [3 /*break*/, 16];
                    workspace = workspaceDirs_1[_b];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(workspace, runtime, { dryRun: dryRun, label: workspace })];
                case 14:
                    _e.sent();
                    _e.label = 15;
                case 15:
                    _b++;
                    return [3 /*break*/, 13];
                case 16:
                    if (!scopes.has("app")) return [3 /*break*/, 18];
                    return [4 /*yield*/, removeMacApp(runtime, dryRun)];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18:
                    runtime.log("CLI still installed. Remove via npm/pnpm if desired.");
                    if (scopes.has("state") && !scopes.has("workspace")) {
                        home_1 = (0, utils_js_1.resolveHomeDir)();
                        if (home_1 && workspaceDirs.some(function (dir) { return dir.startsWith(node_path_1.default.resolve(home_1)); })) {
                            runtime.log("Tip: workspaces were preserved. Re-run with --workspace to remove them.");
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
