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
exports.zaloMessageActions = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var send_js_1 = require("./send.js");
var providerId = "zalo";
function listEnabledAccounts(cfg) {
    return (0, accounts_js_1.listEnabledZaloAccounts)(cfg).filter(function (account) { return account.enabled && account.tokenSource !== "none"; });
}
exports.zaloMessageActions = {
    listActions: function (_a) {
        var cfg = _a.cfg;
        var accounts = listEnabledAccounts(cfg);
        if (accounts.length === 0) {
            return [];
        }
        var actions = new Set(["send"]);
        return Array.from(actions);
    },
    supportsButtons: function () { return false; },
    extractToolSend: function (_a) {
        var args = _a.args;
        var action = typeof args.action === "string" ? args.action.trim() : "";
        if (action !== "sendMessage") {
            return null;
        }
        var to = typeof args.to === "string" ? args.to : undefined;
        if (!to) {
            return null;
        }
        var accountId = typeof args.accountId === "string" ? args.accountId.trim() : undefined;
        return { to: to, accountId: accountId };
    },
    handleAction: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var to, content, mediaUrl, result;
        var _c;
        var action = _b.action, params = _b.params, cfg = _b.cfg, accountId = _b.accountId;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(action === "send")) return [3 /*break*/, 2];
                    to = (0, plugin_sdk_1.readStringParam)(params, "to", { required: true });
                    content = (0, plugin_sdk_1.readStringParam)(params, "message", {
                        required: true,
                        allowEmpty: true,
                    });
                    mediaUrl = (0, plugin_sdk_1.readStringParam)(params, "media", { trim: false });
                    return [4 /*yield*/, (0, send_js_1.sendMessageZalo)(to !== null && to !== void 0 ? to : "", content !== null && content !== void 0 ? content : "", {
                            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            mediaUrl: mediaUrl !== null && mediaUrl !== void 0 ? mediaUrl : undefined,
                            cfg: cfg,
                        })];
                case 1:
                    result = _d.sent();
                    if (!result.ok) {
                        return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({
                                ok: false,
                                error: (_c = result.error) !== null && _c !== void 0 ? _c : "Failed to send Zalo message",
                            })];
                    }
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, to: to, messageId: result.messageId })];
                case 2: throw new Error("Action ".concat(action, " is not supported for provider ").concat(providerId, "."));
            }
        });
    }); },
};
