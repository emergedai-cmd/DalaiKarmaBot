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
exports.onboardCommand = onboardCommand;
var command_format_js_1 = require("../cli/command-format.js");
var config_js_1 = require("../config/config.js");
var runtime_guard_js_1 = require("../infra/runtime-guard.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
var onboard_interactive_js_1 = require("./onboard-interactive.js");
var onboard_non_interactive_js_1 = require("./onboard-non-interactive.js");
function onboardCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var authChoice, normalizedAuthChoice, flow, normalizedOpts, snapshot, baseConfig, workspaceDefault;
        var _a, _b, _c, _d;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    (0, runtime_guard_js_1.assertSupportedRuntime)(runtime);
                    authChoice = opts.authChoice === "oauth" ? "setup-token" : opts.authChoice;
                    normalizedAuthChoice = authChoice === "claude-cli"
                        ? "setup-token"
                        : authChoice === "codex-cli"
                            ? "openai-codex"
                            : authChoice;
                    if (opts.nonInteractive && (authChoice === "claude-cli" || authChoice === "codex-cli")) {
                        runtime.error([
                            "Auth choice \"".concat(authChoice, "\" is deprecated."),
                            'Use "--auth-choice token" (Anthropic setup-token) or "--auth-choice openai-codex".',
                        ].join("\n"));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (authChoice === "claude-cli") {
                        runtime.log('Auth choice "claude-cli" is deprecated; using setup-token flow instead.');
                    }
                    if (authChoice === "codex-cli") {
                        runtime.log('Auth choice "codex-cli" is deprecated; using OpenAI Codex OAuth instead.');
                    }
                    flow = opts.flow === "manual" ? "advanced" : opts.flow;
                    normalizedOpts = normalizedAuthChoice === opts.authChoice && flow === opts.flow
                        ? opts
                        : __assign(__assign({}, opts), { authChoice: normalizedAuthChoice, flow: flow });
                    if (normalizedOpts.nonInteractive && normalizedOpts.acceptRisk !== true) {
                        runtime.error([
                            "Non-interactive onboarding requires explicit risk acknowledgement.",
                            "Read: https://docs.openclaw.ai/security",
                            "Re-run with: ".concat((0, command_format_js_1.formatCliCommand)("openclaw onboard --non-interactive --accept-risk ...")),
                        ].join("\n"));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (!normalizedOpts.reset) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 1:
                    snapshot = _e.sent();
                    baseConfig = snapshot.valid ? snapshot.config : {};
                    workspaceDefault = (_d = (_a = normalizedOpts.workspace) !== null && _a !== void 0 ? _a : (_c = (_b = baseConfig.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.workspace) !== null && _d !== void 0 ? _d : onboard_helpers_js_1.DEFAULT_WORKSPACE;
                    return [4 /*yield*/, (0, onboard_helpers_js_1.handleReset)("full", (0, utils_js_1.resolveUserPath)(workspaceDefault), runtime)];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    if (process.platform === "win32") {
                        runtime.log([
                            "Windows detected — OpenClaw runs great on WSL2!",
                            "Native Windows might be trickier.",
                            "Quick setup: wsl --install (one command, one reboot)",
                            "Guide: https://docs.openclaw.ai/windows",
                        ].join("\n"));
                    }
                    if (!normalizedOpts.nonInteractive) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, onboard_non_interactive_js_1.runNonInteractiveOnboarding)(normalizedOpts, runtime)];
                case 4:
                    _e.sent();
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, (0, onboard_interactive_js_1.runInteractiveOnboarding)(normalizedOpts, runtime)];
                case 6:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
