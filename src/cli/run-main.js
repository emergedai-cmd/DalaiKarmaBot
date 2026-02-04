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
exports.rewriteUpdateFlagArgv = rewriteUpdateFlagArgv;
exports.runCli = runCli;
exports.isCliMainModule = isCliMainModule;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_process_1 = require("node:process");
var node_url_1 = require("node:url");
var dotenv_js_1 = require("../infra/dotenv.js");
var env_js_1 = require("../infra/env.js");
var errors_js_1 = require("../infra/errors.js");
var is_main_js_1 = require("../infra/is-main.js");
var path_env_js_1 = require("../infra/path-env.js");
var runtime_guard_js_1 = require("../infra/runtime-guard.js");
var unhandled_rejections_js_1 = require("../infra/unhandled-rejections.js");
var logging_js_1 = require("../logging.js");
var argv_js_1 = require("./argv.js");
var route_js_1 = require("./route.js");
function rewriteUpdateFlagArgv(argv) {
    var index = argv.indexOf("--update");
    if (index === -1) {
        return argv;
    }
    var next = __spreadArray([], argv, true);
    next.splice(index, 1, "update");
    return next;
}
function runCli() {
    return __awaiter(this, arguments, void 0, function (argv) {
        var normalizedArgv, buildProgram, program, parseArgv, primary, registerSubCliByName, shouldSkipPluginRegistration, registerPluginCliCommands, loadConfig;
        if (argv === void 0) { argv = node_process_1.default.argv; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    normalizedArgv = stripWindowsNodeExec(argv);
                    (0, dotenv_js_1.loadDotEnv)({ quiet: true });
                    (0, env_js_1.normalizeEnv)();
                    (0, path_env_js_1.ensureOpenClawCliOnPath)();
                    // Enforce the minimum supported runtime before doing any work.
                    (0, runtime_guard_js_1.assertSupportedRuntime)();
                    return [4 /*yield*/, (0, route_js_1.tryRouteCli)(normalizedArgv)];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/];
                    }
                    // Capture all console output into structured logs while keeping stdout/stderr behavior.
                    (0, logging_js_1.enableConsoleCapture)();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./program.js"); })];
                case 2:
                    buildProgram = (_a.sent()).buildProgram;
                    program = buildProgram();
                    // Global error handlers to prevent silent crashes from unhandled rejections/exceptions.
                    // These log the error and exit gracefully instead of crashing without trace.
                    (0, unhandled_rejections_js_1.installUnhandledRejectionHandler)();
                    node_process_1.default.on("uncaughtException", function (error) {
                        console.error("[openclaw] Uncaught exception:", (0, errors_js_1.formatUncaughtError)(error));
                        node_process_1.default.exit(1);
                    });
                    parseArgv = rewriteUpdateFlagArgv(normalizedArgv);
                    primary = (0, argv_js_1.getPrimaryCommand)(parseArgv);
                    if (!primary) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./program/register.subclis.js"); })];
                case 3:
                    registerSubCliByName = (_a.sent()).registerSubCliByName;
                    return [4 /*yield*/, registerSubCliByName(program, primary)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    shouldSkipPluginRegistration = !primary && (0, argv_js_1.hasHelpOrVersion)(parseArgv);
                    if (!!shouldSkipPluginRegistration) return [3 /*break*/, 8];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../plugins/cli.js"); })];
                case 6:
                    registerPluginCliCommands = (_a.sent()).registerPluginCliCommands;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../config/config.js"); })];
                case 7:
                    loadConfig = (_a.sent()).loadConfig;
                    registerPluginCliCommands(program, loadConfig());
                    _a.label = 8;
                case 8: return [4 /*yield*/, program.parseAsync(parseArgv)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function stripWindowsNodeExec(argv) {
    if (node_process_1.default.platform !== "win32") {
        return argv;
    }
    var stripControlChars = function (value) {
        var out = "";
        for (var i = 0; i < value.length; i += 1) {
            var code = value.charCodeAt(i);
            if (code >= 32 && code !== 127) {
                out += value[i];
            }
        }
        return out;
    };
    var normalizeArg = function (value) {
        return stripControlChars(value)
            .replace(/^['"]+|['"]+$/g, "")
            .trim();
    };
    var normalizeCandidate = function (value) {
        return normalizeArg(value).replace(/^\\\\\\?\\/, "");
    };
    var execPath = normalizeCandidate(node_process_1.default.execPath);
    var execPathLower = execPath.toLowerCase();
    var execBase = node_path_1.default.basename(execPath).toLowerCase();
    var isExecPath = function (value) {
        if (!value) {
            return false;
        }
        var normalized = normalizeCandidate(value);
        if (!normalized) {
            return false;
        }
        var lower = normalized.toLowerCase();
        return (lower === execPathLower ||
            node_path_1.default.basename(lower) === execBase ||
            lower.endsWith("\\node.exe") ||
            lower.endsWith("/node.exe") ||
            lower.includes("node.exe") ||
            (node_path_1.default.basename(lower) === "node.exe" && node_fs_1.default.existsSync(normalized)));
    };
    var filtered = argv.filter(function (arg, index) { return index === 0 || !isExecPath(arg); });
    if (filtered.length < 3) {
        return filtered;
    }
    var cleaned = __spreadArray([], filtered, true);
    if (isExecPath(cleaned[1])) {
        cleaned.splice(1, 1);
    }
    if (isExecPath(cleaned[2])) {
        cleaned.splice(2, 1);
    }
    return cleaned;
}
function isCliMainModule() {
    return (0, is_main_js_1.isMainModule)({ currentFile: (0, node_url_1.fileURLToPath)(import.meta.url) });
}
