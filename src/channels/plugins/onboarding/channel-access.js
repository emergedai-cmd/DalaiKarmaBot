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
exports.parseAllowlistEntries = parseAllowlistEntries;
exports.formatAllowlistEntries = formatAllowlistEntries;
exports.promptChannelAccessPolicy = promptChannelAccessPolicy;
exports.promptChannelAllowlist = promptChannelAllowlist;
exports.promptChannelAccessConfig = promptChannelAccessConfig;
function parseAllowlistEntries(raw) {
    return String(raw !== null && raw !== void 0 ? raw : "")
        .split(/[,\n]/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function formatAllowlistEntries(entries) {
    return entries
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean)
        .join(", ");
}
function promptChannelAccessPolicy(params) {
    return __awaiter(this, void 0, void 0, function () {
        var options, initialValue;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = [
                        { value: "allowlist", label: "Allowlist (recommended)" },
                    ];
                    if (params.allowOpen !== false) {
                        options.push({ value: "open", label: "Open (allow all channels)" });
                    }
                    if (params.allowDisabled !== false) {
                        options.push({ value: "disabled", label: "Disabled (block all channels)" });
                    }
                    initialValue = (_a = params.currentPolicy) !== null && _a !== void 0 ? _a : "allowlist";
                    return [4 /*yield*/, params.prompter.select({
                            message: "".concat(params.label, " access"),
                            options: options,
                            initialValue: initialValue,
                        })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function promptChannelAllowlist(params) {
    return __awaiter(this, void 0, void 0, function () {
        var initialValue, raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    initialValue = params.currentEntries && params.currentEntries.length > 0
                        ? formatAllowlistEntries(params.currentEntries)
                        : undefined;
                    return [4 /*yield*/, params.prompter.text({
                            message: "".concat(params.label, " allowlist (comma-separated)"),
                            placeholder: params.placeholder,
                            initialValue: initialValue,
                        })];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, parseAllowlistEntries(raw)];
            }
        });
    });
}
function promptChannelAccessConfig(params) {
    return __awaiter(this, void 0, void 0, function () {
        var hasEntries, shouldPrompt, wants, policy, entries;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    hasEntries = ((_a = params.currentEntries) !== null && _a !== void 0 ? _a : []).length > 0;
                    shouldPrompt = (_b = params.defaultPrompt) !== null && _b !== void 0 ? _b : !hasEntries;
                    return [4 /*yield*/, params.prompter.confirm({
                            message: params.updatePrompt
                                ? "Update ".concat(params.label, " access?")
                                : "Configure ".concat(params.label, " access?"),
                            initialValue: shouldPrompt,
                        })];
                case 1:
                    wants = _c.sent();
                    if (!wants) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, promptChannelAccessPolicy({
                            prompter: params.prompter,
                            label: params.label,
                            currentPolicy: params.currentPolicy,
                            allowOpen: params.allowOpen,
                            allowDisabled: params.allowDisabled,
                        })];
                case 2:
                    policy = _c.sent();
                    if (policy !== "allowlist") {
                        return [2 /*return*/, { policy: policy, entries: [] }];
                    }
                    return [4 /*yield*/, promptChannelAllowlist({
                            prompter: params.prompter,
                            label: params.label,
                            currentEntries: params.currentEntries,
                            placeholder: params.placeholder,
                        })];
                case 3:
                    entries = _c.sent();
                    return [2 /*return*/, { policy: policy, entries: entries }];
            }
        });
    });
}
