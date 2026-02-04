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
exports.__testing = void 0;
exports.runBeforeToolCallHook = runBeforeToolCallHook;
exports.wrapToolWithBeforeToolCallHook = wrapToolWithBeforeToolCallHook;
var subsystem_js_1 = require("../logging/subsystem.js");
var hook_runner_global_js_1 = require("../plugins/hook-runner-global.js");
var tool_policy_js_1 = require("./tool-policy.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("agents/tools");
function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function runBeforeToolCallHook(args) {
    return __awaiter(this, void 0, void 0, function () {
        var hookRunner, toolName, params, normalizedParams, hookResult, err_1, toolCallId;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    hookRunner = (0, hook_runner_global_js_1.getGlobalHookRunner)();
                    if (!(hookRunner === null || hookRunner === void 0 ? void 0 : hookRunner.hasHooks("before_tool_call"))) {
                        return [2 /*return*/, { blocked: false, params: args.params }];
                    }
                    toolName = (0, tool_policy_js_1.normalizeToolName)(args.toolName || "tool");
                    params = args.params;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    normalizedParams = isPlainObject(params) ? params : {};
                    return [4 /*yield*/, hookRunner.runBeforeToolCall({
                            toolName: toolName,
                            params: normalizedParams,
                        }, {
                            toolName: toolName,
                            agentId: (_a = args.ctx) === null || _a === void 0 ? void 0 : _a.agentId,
                            sessionKey: (_b = args.ctx) === null || _b === void 0 ? void 0 : _b.sessionKey,
                        })];
                case 2:
                    hookResult = _c.sent();
                    if (hookResult === null || hookResult === void 0 ? void 0 : hookResult.block) {
                        return [2 /*return*/, {
                                blocked: true,
                                reason: hookResult.blockReason || "Tool call blocked by plugin hook",
                            }];
                    }
                    if ((hookResult === null || hookResult === void 0 ? void 0 : hookResult.params) && isPlainObject(hookResult.params)) {
                        if (isPlainObject(params)) {
                            return [2 /*return*/, { blocked: false, params: __assign(__assign({}, params), hookResult.params) }];
                        }
                        return [2 /*return*/, { blocked: false, params: hookResult.params }];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    toolCallId = args.toolCallId ? " toolCallId=".concat(args.toolCallId) : "";
                    log.warn("before_tool_call hook failed: tool=".concat(toolName).concat(toolCallId, " error=").concat(String(err_1)));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, { blocked: false, params: params }];
            }
        });
    });
}
function wrapToolWithBeforeToolCallHook(tool, ctx) {
    var _this = this;
    var execute = tool.execute;
    if (!execute) {
        return tool;
    }
    var toolName = tool.name || "tool";
    return __assign(__assign({}, tool), { execute: function (toolCallId, params, signal, onUpdate) { return __awaiter(_this, void 0, void 0, function () {
            var outcome;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, runBeforeToolCallHook({
                            toolName: toolName,
                            params: params,
                            toolCallId: toolCallId,
                            ctx: ctx,
                        })];
                    case 1:
                        outcome = _a.sent();
                        if (outcome.blocked) {
                            throw new Error(outcome.reason);
                        }
                        return [4 /*yield*/, execute(toolCallId, outcome.params, signal, onUpdate)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); } });
}
exports.__testing = {
    runBeforeToolCallHook: runBeforeToolCallHook,
    isPlainObject: isPlainObject,
};
