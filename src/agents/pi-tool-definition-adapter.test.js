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
var vitest_1 = require("vitest");
var pi_tool_definition_adapter_js_1 = require("./pi-tool-definition-adapter.js");
(0, vitest_1.describe)("pi tool definition adapter", function () {
    (0, vitest_1.it)("wraps tool errors into a tool result", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, defs, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tool = {
                        name: "boom",
                        label: "Boom",
                        description: "throws",
                        parameters: {},
                        execute: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                throw new Error("nope");
                            });
                        }); },
                    };
                    defs = (0, pi_tool_definition_adapter_js_1.toToolDefinitions)([tool]);
                    return [4 /*yield*/, defs[0].execute("call1", {}, undefined, undefined)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "error",
                        tool: "boom",
                    });
                    (0, vitest_1.expect)(result.details).toMatchObject({ error: "nope" });
                    (0, vitest_1.expect)(JSON.stringify(result.details)).not.toContain("\n    at ");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes exec tool aliases in error results", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tool, defs, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tool = {
                        name: "bash",
                        label: "Bash",
                        description: "throws",
                        parameters: {},
                        execute: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                throw new Error("nope");
                            });
                        }); },
                    };
                    defs = (0, pi_tool_definition_adapter_js_1.toToolDefinitions)([tool]);
                    return [4 /*yield*/, defs[0].execute("call2", {}, undefined, undefined)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.details).toMatchObject({
                        status: "error",
                        tool: "exec",
                        error: "nope",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
