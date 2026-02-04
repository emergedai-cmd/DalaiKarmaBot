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
var vitest_1 = require("vitest");
var call_js_1 = require("../../gateway/call.js");
var commands_js_1 = require("./commands.js");
var directive_handling_js_1 = require("./directive-handling.js");
vitest_1.vi.mock("../../gateway/call.js", function () { return ({
    callGateway: vitest_1.vi.fn(),
}); });
function buildParams(commandBody, cfg, ctxOverrides) {
    var _this = this;
    var ctx = __assign({ Body: commandBody, CommandBody: commandBody, CommandSource: "text", CommandAuthorized: true, Provider: "whatsapp", Surface: "whatsapp" }, ctxOverrides);
    var command = (0, commands_js_1.buildCommandContext)({
        ctx: ctx,
        cfg: cfg,
        isGroup: false,
        triggerBodyNormalized: commandBody.trim().toLowerCase(),
        commandAuthorized: true,
    });
    return {
        ctx: ctx,
        cfg: cfg,
        command: command,
        directives: (0, directive_handling_js_1.parseInlineDirectives)(commandBody),
        elevated: { enabled: true, allowed: true, failures: [] },
        sessionKey: "agent:main:main",
        workspaceDir: "/tmp",
        defaultGroupActivation: function () { return "mention"; },
        resolvedVerboseLevel: "off",
        resolvedReasoningLevel: "off",
        resolveDefaultThinkingLevel: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); }); },
        provider: "whatsapp",
        model: "test-model",
        contextTokens: 0,
        isGroup: false,
    };
}
(0, vitest_1.describe)("/approve command", function () {
    (0, vitest_1.it)("rejects invalid usage", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/approve", cfg);
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Usage: /approve");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("submits approval", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, mockCallGateway, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cfg = {
                        commands: { text: true },
                        channels: { whatsapp: { allowFrom: ["*"] } },
                    };
                    params = buildParams("/approve abc allow-once", cfg, { SenderId: "123" });
                    mockCallGateway = vitest_1.vi.mocked(call_js_1.callGateway);
                    mockCallGateway.mockResolvedValueOnce({ ok: true });
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Exec approval allow-once submitted");
                    (0, vitest_1.expect)(mockCallGateway).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        method: "exec.approval.resolve",
                        params: { id: "abc", decision: "allow-once" },
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
