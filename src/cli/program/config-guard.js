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
exports.ensureConfigReady = ensureConfigReady;
var doctor_config_flow_js_1 = require("../../commands/doctor-config-flow.js");
var config_js_1 = require("../../config/config.js");
var theme_js_1 = require("../../terminal/theme.js");
var utils_js_1 = require("../../utils.js");
var command_format_js_1 = require("../command-format.js");
var ALLOWED_INVALID_COMMANDS = new Set(["doctor", "logs", "health", "help", "status"]);
var ALLOWED_INVALID_GATEWAY_SUBCOMMANDS = new Set([
    "status",
    "probe",
    "health",
    "discover",
    "call",
    "install",
    "uninstall",
    "start",
    "stop",
    "restart",
]);
var didRunDoctorConfigFlow = false;
function formatConfigIssues(issues) {
    return issues.map(function (issue) { return "- ".concat(issue.path || "<root>", ": ").concat(issue.message); });
}
function ensureConfigReady(params) {
    return __awaiter(this, void 0, void 0, function () {
        var snapshot, commandName, subcommandName, allowInvalid, issues, legacyIssues, invalid, rich, muted, error, heading, commandText;
        var _this = this;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!!didRunDoctorConfigFlow) return [3 /*break*/, 2];
                    didRunDoctorConfigFlow = true;
                    return [4 /*yield*/, (0, doctor_config_flow_js_1.loadAndMaybeMigrateDoctorConfig)({
                            options: { nonInteractive: true },
                            confirm: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, false];
                            }); }); },
                        })];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2: return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
                case 3:
                    snapshot = _c.sent();
                    commandName = (_a = params.commandPath) === null || _a === void 0 ? void 0 : _a[0];
                    subcommandName = (_b = params.commandPath) === null || _b === void 0 ? void 0 : _b[1];
                    allowInvalid = commandName
                        ? ALLOWED_INVALID_COMMANDS.has(commandName) ||
                            (commandName === "gateway" &&
                                subcommandName &&
                                ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName))
                        : false;
                    issues = snapshot.exists && !snapshot.valid ? formatConfigIssues(snapshot.issues) : [];
                    legacyIssues = snapshot.legacyIssues.length > 0
                        ? snapshot.legacyIssues.map(function (issue) { return "- ".concat(issue.path, ": ").concat(issue.message); })
                        : [];
                    invalid = snapshot.exists && !snapshot.valid;
                    if (!invalid) {
                        return [2 /*return*/];
                    }
                    rich = (0, theme_js_1.isRich)();
                    muted = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, value); };
                    error = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.error, value); };
                    heading = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, value); };
                    commandText = function (value) { return (0, theme_js_1.colorize)(rich, theme_js_1.theme.command, value); };
                    params.runtime.error(heading("Config invalid"));
                    params.runtime.error("".concat(muted("File:"), " ").concat(muted((0, utils_js_1.shortenHomePath)(snapshot.path))));
                    if (issues.length > 0) {
                        params.runtime.error(muted("Problem:"));
                        params.runtime.error(issues.map(function (issue) { return "  ".concat(error(issue)); }).join("\n"));
                    }
                    if (legacyIssues.length > 0) {
                        params.runtime.error(muted("Legacy config keys detected:"));
                        params.runtime.error(legacyIssues.map(function (issue) { return "  ".concat(error(issue)); }).join("\n"));
                    }
                    params.runtime.error("");
                    params.runtime.error("".concat(muted("Run:"), " ").concat(commandText((0, command_format_js_1.formatCliCommand)("openclaw doctor --fix"))));
                    if (!allowInvalid) {
                        params.runtime.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
