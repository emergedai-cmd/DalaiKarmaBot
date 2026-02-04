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
exports.promptAuthChoiceGrouped = promptAuthChoiceGrouped;
var auth_choice_options_js_1 = require("./auth-choice-options.js");
var BACK_VALUE = "__back";
function promptAuthChoiceGrouped(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, groups, skipOption, availableGroups, _loop_1, state_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, auth_choice_options_js_1.buildAuthChoiceGroups)(params), groups = _a.groups, skipOption = _a.skipOption;
                    availableGroups = groups.filter(function (group) { return group.options.length > 0; });
                    _loop_1 = function () {
                        var providerOptions, providerSelection, group, methodSelection;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    providerOptions = __spreadArray(__spreadArray([], availableGroups.map(function (group) { return ({
                                        value: group.value,
                                        label: group.label,
                                        hint: group.hint,
                                    }); }), true), (skipOption ? [skipOption] : []), true);
                                    return [4 /*yield*/, params.prompter.select({
                                            message: "Model/auth provider",
                                            options: providerOptions,
                                        })];
                                case 1:
                                    providerSelection = (_c.sent());
                                    if (providerSelection === "skip") {
                                        return [2 /*return*/, { value: "skip" }];
                                    }
                                    group = availableGroups.find(function (candidate) { return candidate.value === providerSelection; });
                                    if (!(!group || group.options.length === 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, params.prompter.note("No auth methods available for that provider.", "Model/auth choice")];
                                case 2:
                                    _c.sent();
                                    return [2 /*return*/, "continue"];
                                case 3: return [4 /*yield*/, params.prompter.select({
                                        message: "".concat(group.label, " auth method"),
                                        options: __spreadArray(__spreadArray([], group.options, true), [{ value: BACK_VALUE, label: "Back" }], false),
                                    })];
                                case 4:
                                    methodSelection = _c.sent();
                                    if (methodSelection === BACK_VALUE) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [2 /*return*/, { value: methodSelection }];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _b.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
