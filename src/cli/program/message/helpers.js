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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageCliHelpers = createMessageCliHelpers;
var message_js_1 = require("../../../commands/message.js");
var globals_js_1 = require("../../../globals.js");
var channel_target_js_1 = require("../../../infra/outbound/channel-target.js");
var runtime_js_1 = require("../../../runtime.js");
var cli_utils_js_1 = require("../../cli-utils.js");
var deps_js_1 = require("../../deps.js");
var plugin_registry_js_1 = require("../../plugin-registry.js");
function createMessageCliHelpers(message, messageChannelOptions) {
    var _this = this;
    var withMessageBase = function (command) {
        return command
            .option("--channel <channel>", "Channel: ".concat(messageChannelOptions))
            .option("--account <id>", "Channel account id (accountId)")
            .option("--json", "Output result as JSON", false)
            .option("--dry-run", "Print payload and skip sending", false)
            .option("--verbose", "Verbose logging", false);
    };
    var withMessageTarget = function (command) {
        return command.option("-t, --target <dest>", channel_target_js_1.CHANNEL_TARGET_DESCRIPTION);
    };
    var withRequiredMessageTarget = function (command) {
        return command.requiredOption("-t, --target <dest>", channel_target_js_1.CHANNEL_TARGET_DESCRIPTION);
    };
    var runMessageAction = function (action, opts) { return __awaiter(_this, void 0, void 0, function () {
        var deps;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, globals_js_1.setVerbose)(Boolean(opts.verbose));
                    (0, plugin_registry_js_1.ensurePluginRegistryLoaded)();
                    deps = (0, deps_js_1.createDefaultDeps)();
                    return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, message_js_1.messageCommand)(__assign(__assign({}, (function () {
                                            var account = opts.account, rest = __rest(opts, ["account"]);
                                            return __assign(__assign({}, rest), { accountId: typeof account === "string" ? account : undefined });
                                        })()), { action: action }), deps, runtime_js_1.defaultRuntime)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, function (err) {
                            runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err)));
                            runtime_js_1.defaultRuntime.exit(1);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    // `message` is only used for `message.help({ error: true })`, keep the
    // command-specific helpers grouped here.
    void message;
    return {
        withMessageBase: withMessageBase,
        withMessageTarget: withMessageTarget,
        withRequiredMessageTarget: withRequiredMessageTarget,
        runMessageAction: runMessageAction,
    };
}
