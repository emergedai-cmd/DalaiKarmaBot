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
exports.registerPreActionHooks = registerPreActionHooks;
var globals_js_1 = require("../../globals.js");
var env_js_1 = require("../../infra/env.js");
var runtime_js_1 = require("../../runtime.js");
var argv_js_1 = require("../argv.js");
var banner_js_1 = require("../banner.js");
var cli_name_js_1 = require("../cli-name.js");
var plugin_registry_js_1 = require("../plugin-registry.js");
var config_guard_js_1 = require("./config-guard.js");
function setProcessTitleForCommand(actionCommand) {
    var current = actionCommand;
    while (current.parent && current.parent.parent) {
        current = current.parent;
    }
    var name = current.name();
    var cliName = (0, cli_name_js_1.resolveCliName)();
    if (!name || name === cliName) {
        return;
    }
    process.title = "".concat(cliName, "-").concat(name);
}
// Commands that need channel plugins loaded
var PLUGIN_REQUIRED_COMMANDS = new Set(["message", "channels", "directory"]);
function registerPreActionHooks(program, programVersion) {
    var _this = this;
    program.hook("preAction", function (_thisCommand, actionCommand) { return __awaiter(_this, void 0, void 0, function () {
        var argv, commandPath, hideBanner, verbose;
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setProcessTitleForCommand(actionCommand);
                    argv = process.argv;
                    if ((0, argv_js_1.hasHelpOrVersion)(argv)) {
                        return [2 /*return*/];
                    }
                    commandPath = (0, argv_js_1.getCommandPath)(argv, 2);
                    hideBanner = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_HIDE_BANNER) ||
                        commandPath[0] === "update" ||
                        commandPath[0] === "completion" ||
                        (commandPath[0] === "plugins" && commandPath[1] === "update");
                    if (!hideBanner) {
                        (0, banner_js_1.emitCliBanner)(programVersion);
                    }
                    verbose = (0, argv_js_1.getVerboseFlag)(argv, { includeDebug: true });
                    (0, globals_js_1.setVerbose)(verbose);
                    if (!verbose) {
                        (_a = (_b = process.env).NODE_NO_WARNINGS) !== null && _a !== void 0 ? _a : (_b.NODE_NO_WARNINGS = "1");
                    }
                    if (commandPath[0] === "doctor" || commandPath[0] === "completion") {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, config_guard_js_1.ensureConfigReady)({ runtime: runtime_js_1.defaultRuntime, commandPath: commandPath })];
                case 1:
                    _c.sent();
                    // Load plugins for commands that need channel access
                    if (PLUGIN_REQUIRED_COMMANDS.has(commandPath[0])) {
                        (0, plugin_registry_js_1.ensurePluginRegistryLoaded)();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
}
