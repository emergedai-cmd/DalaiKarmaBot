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
exports.createClackPrompter = createClackPrompter;
var prompts_1 = require("@clack/prompts");
var progress_js_1 = require("../cli/progress.js");
var note_js_1 = require("../terminal/note.js");
var prompt_style_js_1 = require("../terminal/prompt-style.js");
var theme_js_1 = require("../terminal/theme.js");
var prompts_js_1 = require("./prompts.js");
function guardCancel(value) {
    var _a;
    if ((0, prompts_1.isCancel)(value)) {
        (0, prompts_1.cancel)((_a = (0, prompt_style_js_1.stylePromptTitle)("Setup cancelled.")) !== null && _a !== void 0 ? _a : "Setup cancelled.");
        throw new prompts_js_1.WizardCancelledError();
    }
    return value;
}
function createClackPrompter() {
    var _this = this;
    return {
        intro: function (title) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                (0, prompts_1.intro)((_a = (0, prompt_style_js_1.stylePromptTitle)(title)) !== null && _a !== void 0 ? _a : title);
                return [2 /*return*/];
            });
        }); },
        outro: function (message) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                (0, prompts_1.outro)((_a = (0, prompt_style_js_1.stylePromptTitle)(message)) !== null && _a !== void 0 ? _a : message);
                return [2 /*return*/];
            });
        }); },
        note: function (message, title) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, note_js_1.note)(message, title);
                return [2 /*return*/];
            });
        }); },
        select: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = guardCancel;
                        return [4 /*yield*/, (0, prompts_1.select)({
                                message: (0, prompt_style_js_1.stylePromptMessage)(params.message),
                                options: params.options.map(function (opt) {
                                    var base = { value: opt.value, label: opt.label };
                                    return opt.hint === undefined ? base : __assign(__assign({}, base), { hint: (0, prompt_style_js_1.stylePromptHint)(opt.hint) });
                                }),
                                initialValue: params.initialValue,
                            })];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        }); },
        multiselect: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = guardCancel;
                        return [4 /*yield*/, (0, prompts_1.multiselect)({
                                message: (0, prompt_style_js_1.stylePromptMessage)(params.message),
                                options: params.options.map(function (opt) {
                                    var base = { value: opt.value, label: opt.label };
                                    return opt.hint === undefined ? base : __assign(__assign({}, base), { hint: (0, prompt_style_js_1.stylePromptHint)(opt.hint) });
                                }),
                                initialValues: params.initialValues,
                            })];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        }); },
        text: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var validate, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validate = params.validate;
                        _a = guardCancel;
                        return [4 /*yield*/, (0, prompts_1.text)({
                                message: (0, prompt_style_js_1.stylePromptMessage)(params.message),
                                initialValue: params.initialValue,
                                placeholder: params.placeholder,
                                validate: validate ? function (value) { return validate(value !== null && value !== void 0 ? value : ""); } : undefined,
                            })];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        }); },
        confirm: function (params) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = guardCancel;
                        return [4 /*yield*/, (0, prompts_1.confirm)({
                                message: (0, prompt_style_js_1.stylePromptMessage)(params.message),
                                initialValue: params.initialValue,
                            })];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        }); },
        progress: function (label) {
            var spin = (0, prompts_1.spinner)();
            spin.start(theme_js_1.theme.accent(label));
            var osc = (0, progress_js_1.createCliProgress)({
                label: label,
                indeterminate: true,
                enabled: true,
                fallback: "none",
            });
            return {
                update: function (message) {
                    spin.message(theme_js_1.theme.accent(message));
                    osc.setLabel(message);
                },
                stop: function (message) {
                    osc.done();
                    spin.stop(message);
                },
            };
        },
    };
}
