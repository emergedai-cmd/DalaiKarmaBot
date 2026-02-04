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
exports.registerConfigureCommand = registerConfigureCommand;
var configure_js_1 = require("../../commands/configure.js");
var runtime_js_1 = require("../../runtime.js");
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var cli_utils_js_1 = require("../cli-utils.js");
function registerConfigureCommand(program) {
    var _this = this;
    program
        .command("configure")
        .description("Interactive prompt to set up credentials, devices, and agent defaults")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/configure", "docs.openclaw.ai/cli/configure"), "\n");
    })
        .option("--section <section>", "Configuration sections (repeatable). Options: ".concat(configure_js_1.CONFIGURE_WIZARD_SECTIONS.join(", ")), function (value, previous) { return __spreadArray(__spreadArray([], previous, true), [value], false); }, [])
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, function () { return __awaiter(_this, void 0, void 0, function () {
                        var sections, invalid;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sections = Array.isArray(opts.section)
                                        ? opts.section
                                            .map(function (value) { return (typeof value === "string" ? value.trim() : ""); })
                                            .filter(Boolean)
                                        : [];
                                    if (!(sections.length === 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, configure_js_1.configureCommand)(runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                                case 2:
                                    invalid = sections.filter(function (s) { return !configure_js_1.CONFIGURE_WIZARD_SECTIONS.includes(s); });
                                    if (invalid.length > 0) {
                                        runtime_js_1.defaultRuntime.error("Invalid --section: ".concat(invalid.join(", "), ". Expected one of: ").concat(configure_js_1.CONFIGURE_WIZARD_SECTIONS.join(", "), "."));
                                        runtime_js_1.defaultRuntime.exit(1);
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, (0, configure_js_1.configureCommandWithSections)(sections, runtime_js_1.defaultRuntime)];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
