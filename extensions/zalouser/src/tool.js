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
exports.ZalouserToolSchema = void 0;
exports.executeZalouserTool = executeZalouserTool;
var typebox_1 = require("@sinclair/typebox");
var zca_js_1 = require("./zca.js");
var ACTIONS = ["send", "image", "link", "friends", "groups", "me", "status"];
function stringEnum(values, options) {
    if (options === void 0) { options = {}; }
    return typebox_1.Type.Unsafe(__assign({ type: "string", enum: __spreadArray([], values, true) }, options));
}
// Tool schema - avoiding Type.Union per tool schema guardrails
exports.ZalouserToolSchema = typebox_1.Type.Object({
    action: stringEnum(ACTIONS, { description: "Action to perform: ".concat(ACTIONS.join(", ")) }),
    threadId: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Thread ID for messaging" })),
    message: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Message text" })),
    isGroup: typebox_1.Type.Optional(typebox_1.Type.Boolean({ description: "Is group chat" })),
    profile: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Profile name" })),
    query: typebox_1.Type.Optional(typebox_1.Type.String({ description: "Search query" })),
    url: typebox_1.Type.Optional(typebox_1.Type.String({ description: "URL for media/link" })),
}, { additionalProperties: false });
function json(payload) {
    return {
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
        details: payload,
    };
}
function executeZalouserTool(_toolCallId, params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, args, result, args, result, args, result, args, result, parsed, result, parsed, result, parsed, result, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 17, , 18]);
                    _a = params.action;
                    switch (_a) {
                        case "send": return [3 /*break*/, 1];
                        case "image": return [3 /*break*/, 3];
                        case "link": return [3 /*break*/, 5];
                        case "friends": return [3 /*break*/, 7];
                        case "groups": return [3 /*break*/, 9];
                        case "me": return [3 /*break*/, 11];
                        case "status": return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 15];
                case 1:
                    if (!params.threadId || !params.message) {
                        throw new Error("threadId and message required for send action");
                    }
                    args = ["msg", "send", params.threadId, params.message];
                    if (params.isGroup) {
                        args.push("-g");
                    }
                    return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: params.profile })];
                case 2:
                    result = _b.sent();
                    if (!result.ok) {
                        throw new Error(result.stderr || "Failed to send message");
                    }
                    return [2 /*return*/, json({ success: true, output: result.stdout })];
                case 3:
                    if (!params.threadId) {
                        throw new Error("threadId required for image action");
                    }
                    if (!params.url) {
                        throw new Error("url required for image action");
                    }
                    args = ["msg", "image", params.threadId, "-u", params.url];
                    if (params.message) {
                        args.push("-m", params.message);
                    }
                    if (params.isGroup) {
                        args.push("-g");
                    }
                    return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: params.profile })];
                case 4:
                    result = _b.sent();
                    if (!result.ok) {
                        throw new Error(result.stderr || "Failed to send image");
                    }
                    return [2 /*return*/, json({ success: true, output: result.stdout })];
                case 5:
                    if (!params.threadId || !params.url) {
                        throw new Error("threadId and url required for link action");
                    }
                    args = ["msg", "link", params.threadId, params.url];
                    if (params.isGroup) {
                        args.push("-g");
                    }
                    return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: params.profile })];
                case 6:
                    result = _b.sent();
                    if (!result.ok) {
                        throw new Error(result.stderr || "Failed to send link");
                    }
                    return [2 /*return*/, json({ success: true, output: result.stdout })];
                case 7:
                    args = params.query ? ["friend", "find", params.query] : ["friend", "list", "-j"];
                    return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: params.profile })];
                case 8:
                    result = _b.sent();
                    if (!result.ok) {
                        throw new Error(result.stderr || "Failed to get friends");
                    }
                    parsed = (0, zca_js_1.parseJsonOutput)(result.stdout);
                    return [2 /*return*/, json(parsed !== null && parsed !== void 0 ? parsed : { raw: result.stdout })];
                case 9: return [4 /*yield*/, (0, zca_js_1.runZca)(["group", "list", "-j"], {
                        profile: params.profile,
                    })];
                case 10:
                    result = _b.sent();
                    if (!result.ok) {
                        throw new Error(result.stderr || "Failed to get groups");
                    }
                    parsed = (0, zca_js_1.parseJsonOutput)(result.stdout);
                    return [2 /*return*/, json(parsed !== null && parsed !== void 0 ? parsed : { raw: result.stdout })];
                case 11: return [4 /*yield*/, (0, zca_js_1.runZca)(["me", "info", "-j"], {
                        profile: params.profile,
                    })];
                case 12:
                    result = _b.sent();
                    if (!result.ok) {
                        throw new Error(result.stderr || "Failed to get profile");
                    }
                    parsed = (0, zca_js_1.parseJsonOutput)(result.stdout);
                    return [2 /*return*/, json(parsed !== null && parsed !== void 0 ? parsed : { raw: result.stdout })];
                case 13: return [4 /*yield*/, (0, zca_js_1.runZca)(["auth", "status"], {
                        profile: params.profile,
                    })];
                case 14:
                    result = _b.sent();
                    return [2 /*return*/, json({
                            authenticated: result.ok,
                            output: result.stdout || result.stderr,
                        })];
                case 15:
                    {
                        params.action;
                        throw new Error("Unknown action: ".concat(String(params.action), ". Valid actions: send, image, link, friends, groups, me, status"));
                    }
                    _b.label = 16;
                case 16: return [3 /*break*/, 18];
                case 17:
                    err_1 = _b.sent();
                    return [2 /*return*/, json({
                            error: err_1 instanceof Error ? err_1.message : String(err_1),
                        })];
                case 18: return [2 /*return*/];
            }
        });
    });
}
