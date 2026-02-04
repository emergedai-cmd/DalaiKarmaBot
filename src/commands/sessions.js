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
exports.sessionsCommand = sessionsCommand;
var context_js_1 = require("../agents/context.js");
var defaults_js_1 = require("../agents/defaults.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var globals_js_1 = require("../globals.js");
var theme_js_1 = require("../terminal/theme.js");
var KIND_PAD = 6;
var KEY_PAD = 26;
var AGE_PAD = 9;
var MODEL_PAD = 14;
var TOKENS_PAD = 20;
var formatKTokens = function (value) { return "".concat((value / 1000).toFixed(value >= 10000 ? 0 : 1), "k"); };
var truncateKey = function (key) {
    if (key.length <= KEY_PAD) {
        return key;
    }
    var head = Math.max(4, KEY_PAD - 10);
    return "".concat(key.slice(0, head), "...").concat(key.slice(-6));
};
var colorByPct = function (label, pct, rich) {
    if (!rich || pct === null) {
        return label;
    }
    if (pct >= 95) {
        return theme_js_1.theme.error(label);
    }
    if (pct >= 80) {
        return theme_js_1.theme.warn(label);
    }
    if (pct >= 60) {
        return theme_js_1.theme.success(label);
    }
    return theme_js_1.theme.muted(label);
};
var formatTokensCell = function (total, contextTokens, rich) {
    if (!total) {
        return "-".padEnd(TOKENS_PAD);
    }
    var totalLabel = formatKTokens(total);
    var ctxLabel = contextTokens ? formatKTokens(contextTokens) : "?";
    var pct = contextTokens ? Math.min(999, Math.round((total / contextTokens) * 100)) : null;
    var label = "".concat(totalLabel, "/").concat(ctxLabel, " (").concat(pct !== null && pct !== void 0 ? pct : "?", "%)");
    var padded = label.padEnd(TOKENS_PAD);
    return colorByPct(padded, pct, rich);
};
var formatKindCell = function (kind, rich) {
    var label = kind.padEnd(KIND_PAD);
    if (!rich) {
        return label;
    }
    if (kind === "group") {
        return theme_js_1.theme.accentBright(label);
    }
    if (kind === "global") {
        return theme_js_1.theme.warn(label);
    }
    if (kind === "direct") {
        return theme_js_1.theme.accent(label);
    }
    return theme_js_1.theme.muted(label);
};
var formatAgeCell = function (updatedAt, rich) {
    var ageLabel = updatedAt ? formatAge(Date.now() - updatedAt) : "unknown";
    var padded = ageLabel.padEnd(AGE_PAD);
    return rich ? theme_js_1.theme.muted(padded) : padded;
};
var formatModelCell = function (model, rich) {
    var label = (model !== null && model !== void 0 ? model : "unknown").padEnd(MODEL_PAD);
    return rich ? theme_js_1.theme.info(label) : label;
};
var formatFlagsCell = function (row, rich) {
    var flags = [
        row.thinkingLevel ? "think:".concat(row.thinkingLevel) : null,
        row.verboseLevel ? "verbose:".concat(row.verboseLevel) : null,
        row.reasoningLevel ? "reasoning:".concat(row.reasoningLevel) : null,
        row.elevatedLevel ? "elev:".concat(row.elevatedLevel) : null,
        row.responseUsage ? "usage:".concat(row.responseUsage) : null,
        row.groupActivation ? "activation:".concat(row.groupActivation) : null,
        row.systemSent ? "system" : null,
        row.abortedLastRun ? "aborted" : null,
        row.sessionId ? "id:".concat(row.sessionId) : null,
    ].filter(Boolean);
    var label = flags.join(" ");
    return label.length === 0 ? "" : rich ? theme_js_1.theme.muted(label) : label;
};
var formatAge = function (ms) {
    if (!ms || ms < 0) {
        return "unknown";
    }
    var minutes = Math.round(ms / 60000);
    if (minutes < 1) {
        return "just now";
    }
    if (minutes < 60) {
        return "".concat(minutes, "m ago");
    }
    var hours = Math.round(minutes / 60);
    if (hours < 48) {
        return "".concat(hours, "h ago");
    }
    var days = Math.round(hours / 24);
    return "".concat(days, "d ago");
};
function classifyKey(key, entry) {
    if (key === "global") {
        return "global";
    }
    if (key === "unknown") {
        return "unknown";
    }
    if ((entry === null || entry === void 0 ? void 0 : entry.chatType) === "group" || (entry === null || entry === void 0 ? void 0 : entry.chatType) === "channel") {
        return "group";
    }
    if (key.includes(":group:") || key.includes(":channel:")) {
        return "group";
    }
    return "direct";
}
function toRows(store) {
    return Object.entries(store)
        .map(function (_a) {
        var _b;
        var key = _a[0], entry = _a[1];
        var updatedAt = (_b = entry === null || entry === void 0 ? void 0 : entry.updatedAt) !== null && _b !== void 0 ? _b : null;
        return {
            key: key,
            kind: classifyKey(key, entry),
            updatedAt: updatedAt,
            ageMs: updatedAt ? Date.now() - updatedAt : null,
            sessionId: entry === null || entry === void 0 ? void 0 : entry.sessionId,
            systemSent: entry === null || entry === void 0 ? void 0 : entry.systemSent,
            abortedLastRun: entry === null || entry === void 0 ? void 0 : entry.abortedLastRun,
            thinkingLevel: entry === null || entry === void 0 ? void 0 : entry.thinkingLevel,
            verboseLevel: entry === null || entry === void 0 ? void 0 : entry.verboseLevel,
            reasoningLevel: entry === null || entry === void 0 ? void 0 : entry.reasoningLevel,
            elevatedLevel: entry === null || entry === void 0 ? void 0 : entry.elevatedLevel,
            responseUsage: entry === null || entry === void 0 ? void 0 : entry.responseUsage,
            groupActivation: entry === null || entry === void 0 ? void 0 : entry.groupActivation,
            inputTokens: entry === null || entry === void 0 ? void 0 : entry.inputTokens,
            outputTokens: entry === null || entry === void 0 ? void 0 : entry.outputTokens,
            totalTokens: entry === null || entry === void 0 ? void 0 : entry.totalTokens,
            model: entry === null || entry === void 0 ? void 0 : entry.model,
            contextTokens: entry === null || entry === void 0 ? void 0 : entry.contextTokens,
        };
    })
        .toSorted(function (a, b) { var _a, _b; return ((_a = b.updatedAt) !== null && _a !== void 0 ? _a : 0) - ((_b = a.updatedAt) !== null && _b !== void 0 ? _b : 0); });
}
function sessionsCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, resolved, configContextTokens, configModel, storePath, store, activeMinutes, parsed, rows, rich, header, _i, rows_1, row, model, contextTokens, input, output, total, keyLabel, keyCell, line;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            cfg = (0, config_js_1.loadConfig)();
            resolved = (0, model_selection_js_1.resolveConfiguredModelRef)({
                cfg: cfg,
                defaultProvider: defaults_js_1.DEFAULT_PROVIDER,
                defaultModel: defaults_js_1.DEFAULT_MODEL,
            });
            configContextTokens = (_d = (_c = (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null || _b === void 0 ? void 0 : _b.contextTokens) !== null && _c !== void 0 ? _c : (0, context_js_1.lookupContextTokens)(resolved.model)) !== null && _d !== void 0 ? _d : defaults_js_1.DEFAULT_CONTEXT_TOKENS;
            configModel = (_e = resolved.model) !== null && _e !== void 0 ? _e : defaults_js_1.DEFAULT_MODEL;
            storePath = (0, sessions_js_1.resolveStorePath)((_f = opts.store) !== null && _f !== void 0 ? _f : (_g = cfg.session) === null || _g === void 0 ? void 0 : _g.store);
            store = (0, sessions_js_1.loadSessionStore)(storePath);
            if (opts.active !== undefined) {
                parsed = Number.parseInt(String(opts.active), 10);
                if (Number.isNaN(parsed) || parsed <= 0) {
                    runtime.error("--active must be a positive integer (minutes)");
                    runtime.exit(1);
                    return [2 /*return*/];
                }
                activeMinutes = parsed;
            }
            rows = toRows(store).filter(function (row) {
                if (activeMinutes === undefined) {
                    return true;
                }
                if (!row.updatedAt) {
                    return false;
                }
                return Date.now() - row.updatedAt <= activeMinutes * 60000;
            });
            if (opts.json) {
                runtime.log(JSON.stringify({
                    path: storePath,
                    count: rows.length,
                    activeMinutes: activeMinutes !== null && activeMinutes !== void 0 ? activeMinutes : null,
                    sessions: rows.map(function (r) {
                        var _a, _b, _c, _d, _e;
                        return (__assign(__assign({}, r), { contextTokens: (_c = (_b = (_a = r.contextTokens) !== null && _a !== void 0 ? _a : (0, context_js_1.lookupContextTokens)(r.model)) !== null && _b !== void 0 ? _b : configContextTokens) !== null && _c !== void 0 ? _c : null, model: (_e = (_d = r.model) !== null && _d !== void 0 ? _d : configModel) !== null && _e !== void 0 ? _e : null }));
                    }),
                }, null, 2));
                return [2 /*return*/];
            }
            runtime.log((0, globals_js_1.info)("Session store: ".concat(storePath)));
            runtime.log((0, globals_js_1.info)("Sessions listed: ".concat(rows.length)));
            if (activeMinutes) {
                runtime.log((0, globals_js_1.info)("Filtered to last ".concat(activeMinutes, " minute(s)")));
            }
            if (rows.length === 0) {
                runtime.log("No sessions found.");
                return [2 /*return*/];
            }
            rich = (0, theme_js_1.isRich)();
            header = [
                "Kind".padEnd(KIND_PAD),
                "Key".padEnd(KEY_PAD),
                "Age".padEnd(AGE_PAD),
                "Model".padEnd(MODEL_PAD),
                "Tokens (ctx %)".padEnd(TOKENS_PAD),
                "Flags",
            ].join(" ");
            runtime.log(rich ? theme_js_1.theme.heading(header) : header);
            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                row = rows_1[_i];
                model = (_h = row.model) !== null && _h !== void 0 ? _h : configModel;
                contextTokens = (_k = (_j = row.contextTokens) !== null && _j !== void 0 ? _j : (0, context_js_1.lookupContextTokens)(model)) !== null && _k !== void 0 ? _k : configContextTokens;
                input = (_l = row.inputTokens) !== null && _l !== void 0 ? _l : 0;
                output = (_m = row.outputTokens) !== null && _m !== void 0 ? _m : 0;
                total = (_o = row.totalTokens) !== null && _o !== void 0 ? _o : input + output;
                keyLabel = truncateKey(row.key).padEnd(KEY_PAD);
                keyCell = rich ? theme_js_1.theme.accent(keyLabel) : keyLabel;
                line = [
                    formatKindCell(row.kind, rich),
                    keyCell,
                    formatAgeCell(row.updatedAt, rich),
                    formatModelCell(model, rich),
                    formatTokensCell(total, contextTokens !== null && contextTokens !== void 0 ? contextTokens : null, rich),
                    formatFlagsCell(row, rich),
                ].join(" ");
                runtime.log(line.trimEnd());
            }
            return [2 /*return*/];
        });
    });
}
