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
exports.resetCommand = resetCommand;
var prompts_1 = require("@clack/prompts");
var command_format_js_1 = require("../cli/command-format.js");
var config_js_1 = require("../config/config.js");
var service_js_1 = require("../daemon/service.js");
var prompt_style_js_1 = require("../terminal/prompt-style.js");
var cleanup_utils_js_1 = require("./cleanup-utils.js");
var selectStyled = function (params) {
    return (0, prompts_1.select)(__assign(__assign({}, params), { message: (0, prompt_style_js_1.stylePromptMessage)(params.message), options: params.options.map(function (opt) {
            return opt.hint === undefined ? opt : __assign(__assign({}, opt), { hint: (0, prompt_style_js_1.stylePromptHint)(opt.hint) });
        }) }));
};
function stopGatewayIfRunning(runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var service, loaded, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (config_js_1.isNixMode) {
                        return [2 /*return*/];
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
                    return [2 /*return*/];
                case 4:
                    if (!loaded) {
                        return [2 /*return*/];
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
                case 8: return [2 /*return*/];
            }
        });
    });
}
function resetCommand(runtime, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var interactive, scope, selection, ok, dryRun, cfg, stateDir, configPath, oauthDir, configInsideState, oauthInsideState, workspaceDirs, sessionDirs, _i, sessionDirs_1, dir, _a, workspaceDirs_1, workspace;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    interactive = !opts.nonInteractive;
                    if (!interactive && !opts.yes) {
                        runtime.error("Non-interactive mode requires --yes.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    scope = opts.scope;
                    if (!!scope) return [3 /*break*/, 2];
                    if (!interactive) {
                        runtime.error("Non-interactive mode requires --scope.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, selectStyled({
                            message: "Reset scope",
                            options: [
                                {
                                    value: "config",
                                    label: "Config only",
                                    hint: "openclaw.json",
                                },
                                {
                                    value: "config+creds+sessions",
                                    label: "Config + credentials + sessions",
                                    hint: "keeps workspace + auth profiles",
                                },
                                {
                                    value: "full",
                                    label: "Full reset",
                                    hint: "state dir + workspace",
                                },
                            ],
                            initialValue: "config+creds+sessions",
                        })];
                case 1:
                    selection = _d.sent();
                    if ((0, prompts_1.isCancel)(selection)) {
                        (0, prompts_1.cancel)((_b = (0, prompt_style_js_1.stylePromptTitle)("Reset cancelled.")) !== null && _b !== void 0 ? _b : "Reset cancelled.");
                        runtime.exit(0);
                        return [2 /*return*/];
                    }
                    scope = selection;
                    _d.label = 2;
                case 2:
                    if (!["config", "config+creds+sessions", "full"].includes(scope)) {
                        runtime.error('Invalid --scope. Expected "config", "config+creds+sessions", or "full".');
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (!(interactive && !opts.yes)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, prompts_1.confirm)({
                            message: (0, prompt_style_js_1.stylePromptMessage)("Proceed with ".concat(scope, " reset?")),
                        })];
                case 3:
                    ok = _d.sent();
                    if ((0, prompts_1.isCancel)(ok) || !ok) {
                        (0, prompts_1.cancel)((_c = (0, prompt_style_js_1.stylePromptTitle)("Reset cancelled.")) !== null && _c !== void 0 ? _c : "Reset cancelled.");
                        runtime.exit(0);
                        return [2 /*return*/];
                    }
                    _d.label = 4;
                case 4:
                    dryRun = Boolean(opts.dryRun);
                    cfg = (0, config_js_1.loadConfig)();
                    stateDir = (0, config_js_1.resolveStateDir)();
                    configPath = (0, config_js_1.resolveConfigPath)();
                    oauthDir = (0, config_js_1.resolveOAuthDir)();
                    configInsideState = (0, cleanup_utils_js_1.isPathWithin)(configPath, stateDir);
                    oauthInsideState = (0, cleanup_utils_js_1.isPathWithin)(oauthDir, stateDir);
                    workspaceDirs = (0, cleanup_utils_js_1.collectWorkspaceDirs)(cfg);
                    if (!(scope !== "config")) return [3 /*break*/, 7];
                    if (!dryRun) return [3 /*break*/, 5];
                    runtime.log("[dry-run] stop gateway service");
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, stopGatewayIfRunning(runtime)];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7:
                    if (!(scope === "config")) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(configPath, runtime, { dryRun: dryRun, label: configPath })];
                case 8:
                    _d.sent();
                    return [2 /*return*/];
                case 9:
                    if (!(scope === "config+creds+sessions")) return [3 /*break*/, 17];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(configPath, runtime, { dryRun: dryRun, label: configPath })];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(oauthDir, runtime, { dryRun: dryRun, label: oauthDir })];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, (0, cleanup_utils_js_1.listAgentSessionDirs)(stateDir)];
                case 12:
                    sessionDirs = _d.sent();
                    _i = 0, sessionDirs_1 = sessionDirs;
                    _d.label = 13;
                case 13:
                    if (!(_i < sessionDirs_1.length)) return [3 /*break*/, 16];
                    dir = sessionDirs_1[_i];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(dir, runtime, { dryRun: dryRun, label: dir })];
                case 14:
                    _d.sent();
                    _d.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 13];
                case 16:
                    runtime.log("Next: ".concat((0, command_format_js_1.formatCliCommand)("openclaw onboard --install-daemon")));
                    return [2 /*return*/];
                case 17:
                    if (!(scope === "full")) return [3 /*break*/, 27];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(stateDir, runtime, { dryRun: dryRun, label: stateDir })];
                case 18:
                    _d.sent();
                    if (!!configInsideState) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(configPath, runtime, { dryRun: dryRun, label: configPath })];
                case 19:
                    _d.sent();
                    _d.label = 20;
                case 20:
                    if (!!oauthInsideState) return [3 /*break*/, 22];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(oauthDir, runtime, { dryRun: dryRun, label: oauthDir })];
                case 21:
                    _d.sent();
                    _d.label = 22;
                case 22:
                    _a = 0, workspaceDirs_1 = workspaceDirs;
                    _d.label = 23;
                case 23:
                    if (!(_a < workspaceDirs_1.length)) return [3 /*break*/, 26];
                    workspace = workspaceDirs_1[_a];
                    return [4 /*yield*/, (0, cleanup_utils_js_1.removePath)(workspace, runtime, { dryRun: dryRun, label: workspace })];
                case 24:
                    _d.sent();
                    _d.label = 25;
                case 25:
                    _a++;
                    return [3 /*break*/, 23];
                case 26:
                    runtime.log("Next: ".concat((0, command_format_js_1.formatCliCommand)("openclaw onboard --install-daemon")));
                    return [2 /*return*/];
                case 27: return [2 /*return*/];
            }
        });
    });
}
