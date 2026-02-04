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
exports.promptAccountId = promptAccountId;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
function promptAccountId(params) {
    return __awaiter(this, void 0, void 0, function () {
        var existingIds, initial, choice, entered, normalized;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    existingIds = params.listAccountIds(params.cfg);
                    initial = ((_a = params.currentId) === null || _a === void 0 ? void 0 : _a.trim()) || params.defaultAccountId || plugin_sdk_1.DEFAULT_ACCOUNT_ID;
                    return [4 /*yield*/, params.prompter.select({
                            message: "".concat(params.label, " account"),
                            options: __spreadArray(__spreadArray([], existingIds.map(function (id) { return ({
                                value: id,
                                label: id === plugin_sdk_1.DEFAULT_ACCOUNT_ID ? "default (primary)" : id,
                            }); }), true), [
                                { value: "__new__", label: "Add a new account" },
                            ], false),
                            initialValue: initial,
                        })];
                case 1:
                    choice = _b.sent();
                    if (choice !== "__new__") {
                        return [2 /*return*/, (0, plugin_sdk_1.normalizeAccountId)(choice)];
                    }
                    return [4 /*yield*/, params.prompter.text({
                            message: "New ".concat(params.label, " account id"),
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 2:
                    entered = _b.sent();
                    normalized = (0, plugin_sdk_1.normalizeAccountId)(String(entered));
                    if (!(String(entered).trim() !== normalized)) return [3 /*break*/, 4];
                    return [4 /*yield*/, params.prompter.note("Normalized account id to \"".concat(normalized, "\"."), "".concat(params.label, " account"))];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/, normalized];
            }
        });
    });
}
