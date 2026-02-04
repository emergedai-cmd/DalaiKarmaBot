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
exports.resolveGatewayDevMode = resolveGatewayDevMode;
exports.buildGatewayInstallPlan = buildGatewayInstallPlan;
exports.gatewayInstallErrorHint = gatewayInstallErrorHint;
var command_format_js_1 = require("../cli/command-format.js");
var env_vars_js_1 = require("../config/env-vars.js");
var constants_js_1 = require("../daemon/constants.js");
var program_args_js_1 = require("../daemon/program-args.js");
var runtime_paths_js_1 = require("../daemon/runtime-paths.js");
var service_env_js_1 = require("../daemon/service-env.js");
function resolveGatewayDevMode(argv) {
    if (argv === void 0) { argv = process.argv; }
    var entry = argv[1];
    var normalizedEntry = entry === null || entry === void 0 ? void 0 : entry.replaceAll("\\", "/");
    return Boolean((normalizedEntry === null || normalizedEntry === void 0 ? void 0 : normalizedEntry.includes("/src/")) && normalizedEntry.endsWith(".ts"));
}
function buildGatewayInstallPlan(params) {
    return __awaiter(this, void 0, void 0, function () {
        var devMode, nodePath, _a, _b, programArguments, workingDirectory, systemNode, warning, serviceEnvironment, environment;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    devMode = (_c = params.devMode) !== null && _c !== void 0 ? _c : resolveGatewayDevMode();
                    if (!((_d = params.nodePath) !== null && _d !== void 0)) return [3 /*break*/, 1];
                    _a = _d;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, runtime_paths_js_1.resolvePreferredNodePath)({
                        env: params.env,
                        runtime: params.runtime,
                    })];
                case 2:
                    _a = (_f.sent());
                    _f.label = 3;
                case 3:
                    nodePath = _a;
                    return [4 /*yield*/, (0, program_args_js_1.resolveGatewayProgramArguments)({
                            port: params.port,
                            dev: devMode,
                            runtime: params.runtime,
                            nodePath: nodePath,
                        })];
                case 4:
                    _b = _f.sent(), programArguments = _b.programArguments, workingDirectory = _b.workingDirectory;
                    if (!(params.runtime === "node")) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, runtime_paths_js_1.resolveSystemNodeInfo)({ env: params.env })];
                case 5:
                    systemNode = _f.sent();
                    warning = (0, runtime_paths_js_1.renderSystemNodeWarning)(systemNode, programArguments[0]);
                    if (warning) {
                        (_e = params.warn) === null || _e === void 0 ? void 0 : _e.call(params, warning, "Gateway runtime");
                    }
                    _f.label = 6;
                case 6:
                    serviceEnvironment = (0, service_env_js_1.buildServiceEnvironment)({
                        env: params.env,
                        port: params.port,
                        token: params.token,
                        launchdLabel: process.platform === "darwin"
                            ? (0, constants_js_1.resolveGatewayLaunchAgentLabel)(params.env.OPENCLAW_PROFILE)
                            : undefined,
                    });
                    environment = __assign({}, (0, env_vars_js_1.collectConfigEnvVars)(params.config));
                    Object.assign(environment, serviceEnvironment);
                    return [2 /*return*/, { programArguments: programArguments, workingDirectory: workingDirectory, environment: environment }];
            }
        });
    });
}
function gatewayInstallErrorHint(platform) {
    if (platform === void 0) { platform = process.platform; }
    return platform === "win32"
        ? "Tip: rerun from an elevated PowerShell (Start → type PowerShell → right-click → Run as administrator) or skip service install."
        : "Tip: rerun `".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway install"), "` after fixing the error.");
}
