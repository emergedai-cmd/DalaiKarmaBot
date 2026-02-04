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
exports.tryRouteCli = tryRouteCli;
var env_js_1 = require("../infra/env.js");
var runtime_js_1 = require("../runtime.js");
var version_js_1 = require("../version.js");
var argv_js_1 = require("./argv.js");
var banner_js_1 = require("./banner.js");
var plugin_registry_js_1 = require("./plugin-registry.js");
var command_registry_js_1 = require("./program/command-registry.js");
var config_guard_js_1 = require("./program/config-guard.js");
function prepareRoutedCommand(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, banner_js_1.emitCliBanner)(version_js_1.VERSION, { argv: params.argv });
                    return [4 /*yield*/, (0, config_guard_js_1.ensureConfigReady)({ runtime: runtime_js_1.defaultRuntime, commandPath: params.commandPath })];
                case 1:
                    _a.sent();
                    if (params.loadPlugins) {
                        (0, plugin_registry_js_1.ensurePluginRegistryLoaded)();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function tryRouteCli(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var path, route;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_DISABLE_ROUTE_FIRST)) {
                        return [2 /*return*/, false];
                    }
                    if ((0, argv_js_1.hasHelpOrVersion)(argv)) {
                        return [2 /*return*/, false];
                    }
                    path = (0, argv_js_1.getCommandPath)(argv, 2);
                    if (!path[0]) {
                        return [2 /*return*/, false];
                    }
                    route = (0, command_registry_js_1.findRoutedCommand)(path);
                    if (!route) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, prepareRoutedCommand({ argv: argv, commandPath: path, loadPlugins: route.loadPlugins })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, route.run(argv)];
            }
        });
    });
}
