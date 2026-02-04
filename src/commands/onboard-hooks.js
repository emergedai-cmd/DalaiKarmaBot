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
exports.setupInternalHooks = setupInternalHooks;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var command_format_js_1 = require("../cli/command-format.js");
var hooks_status_js_1 = require("../hooks/hooks-status.js");
function setupInternalHooks(cfg, runtime, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var workspaceDir, report, eligibleHooks, toEnable, selected, entries, _i, selected_1, name_1, next;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "Hooks let you automate actions when agent commands are issued.",
                        "Example: Save session context to memory when you issue /new.",
                        "",
                        "Learn more: https://docs.openclaw.ai/hooks",
                    ].join("\n"), "Hooks")];
                case 1:
                    _c.sent();
                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
                    report = (0, hooks_status_js_1.buildWorkspaceHookStatus)(workspaceDir, { config: cfg });
                    eligibleHooks = report.hooks.filter(function (h) { return h.eligible; });
                    if (!(eligibleHooks.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prompter.note("No eligible hooks found. You can configure hooks later in your config.", "No Hooks Available")];
                case 2:
                    _c.sent();
                    return [2 /*return*/, cfg];
                case 3: return [4 /*yield*/, prompter.multiselect({
                        message: "Enable hooks?",
                        options: __spreadArray([
                            { value: "__skip__", label: "Skip for now" }
                        ], eligibleHooks.map(function (hook) {
                            var _a;
                            return ({
                                value: hook.name,
                                label: "".concat((_a = hook.emoji) !== null && _a !== void 0 ? _a : "🔗", " ").concat(hook.name),
                                hint: hook.description,
                            });
                        }), true),
                    })];
                case 4:
                    toEnable = _c.sent();
                    selected = toEnable.filter(function (name) { return name !== "__skip__"; });
                    if (selected.length === 0) {
                        return [2 /*return*/, cfg];
                    }
                    entries = __assign({}, (_b = (_a = cfg.hooks) === null || _a === void 0 ? void 0 : _a.internal) === null || _b === void 0 ? void 0 : _b.entries);
                    for (_i = 0, selected_1 = selected; _i < selected_1.length; _i++) {
                        name_1 = selected_1[_i];
                        entries[name_1] = { enabled: true };
                    }
                    next = __assign(__assign({}, cfg), { hooks: __assign(__assign({}, cfg.hooks), { internal: {
                                enabled: true,
                                entries: entries,
                            } }) });
                    return [4 /*yield*/, prompter.note([
                            "Enabled ".concat(selected.length, " hook").concat(selected.length > 1 ? "s" : "", ": ").concat(selected.join(", ")),
                            "",
                            "You can manage hooks later with:",
                            "  ".concat((0, command_format_js_1.formatCliCommand)("openclaw hooks list")),
                            "  ".concat((0, command_format_js_1.formatCliCommand)("openclaw hooks enable <name>")),
                            "  ".concat((0, command_format_js_1.formatCliCommand)("openclaw hooks disable <name>")),
                        ].join("\n"), "Hooks Configured")];
                case 5:
                    _c.sent();
                    return [2 /*return*/, next];
            }
        });
    });
}
