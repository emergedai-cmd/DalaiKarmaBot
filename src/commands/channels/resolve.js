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
exports.channelsResolveCommand = channelsResolveCommand;
var index_js_1 = require("../../channels/plugins/index.js");
var config_js_1 = require("../../config/config.js");
var globals_js_1 = require("../../globals.js");
var channel_selection_js_1 = require("../../infra/outbound/channel-selection.js");
function resolvePreferredKind(kind) {
    if (!kind || kind === "auto") {
        return undefined;
    }
    if (kind === "user") {
        return "user";
    }
    return "group";
}
function detectAutoKind(input) {
    var trimmed = input.trim();
    if (!trimmed) {
        return "group";
    }
    if (trimmed.startsWith("@")) {
        return "user";
    }
    if (/^<@!?/.test(trimmed)) {
        return "user";
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "user";
    }
    if (/^(user|discord|slack|matrix|msteams|teams|zalo|zalouser|googlechat|google-chat|gchat):/i.test(trimmed)) {
        return "user";
    }
    return "group";
}
function formatResolveResult(result) {
    if (!result.resolved || !result.id) {
        return "".concat(result.input, " -> unresolved");
    }
    var name = result.name ? " (".concat(result.name, ")") : "";
    var note = result.note ? " [".concat(result.note, "]") : "";
    return "".concat(result.input, " -> ").concat(result.id).concat(name).concat(note);
}
function channelsResolveCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, entries, selection, plugin, preferredKind, results, resolved, byKind, _i, entries_1, entry, kind, resolved, _a, _b, _c, kind, inputs, batch, byInput_1, _d, results_1, result;
        var _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    entries = ((_e = opts.entries) !== null && _e !== void 0 ? _e : []).map(function (entry) { return entry.trim(); }).filter(Boolean);
                    if (entries.length === 0) {
                        throw new Error("At least one entry is required.");
                    }
                    return [4 /*yield*/, (0, channel_selection_js_1.resolveMessageChannelSelection)({
                            cfg: cfg,
                            channel: (_f = opts.channel) !== null && _f !== void 0 ? _f : null,
                        })];
                case 1:
                    selection = _l.sent();
                    plugin = (0, index_js_1.getChannelPlugin)(selection.channel);
                    if (!((_g = plugin === null || plugin === void 0 ? void 0 : plugin.resolver) === null || _g === void 0 ? void 0 : _g.resolveTargets)) {
                        throw new Error("Channel ".concat(selection.channel, " does not support resolve."));
                    }
                    preferredKind = resolvePreferredKind(opts.kind);
                    results = [];
                    if (!preferredKind) return [3 /*break*/, 3];
                    return [4 /*yield*/, plugin.resolver.resolveTargets({
                            cfg: cfg,
                            accountId: (_h = opts.account) !== null && _h !== void 0 ? _h : null,
                            inputs: entries,
                            kind: preferredKind,
                            runtime: runtime,
                        })];
                case 2:
                    resolved = _l.sent();
                    results = resolved.map(function (entry) { return ({
                        input: entry.input,
                        resolved: entry.resolved,
                        id: entry.id,
                        name: entry.name,
                        note: entry.note,
                    }); });
                    return [3 /*break*/, 8];
                case 3:
                    byKind = new Map();
                    for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        entry = entries_1[_i];
                        kind = detectAutoKind(entry);
                        byKind.set(kind, __spreadArray(__spreadArray([], ((_j = byKind.get(kind)) !== null && _j !== void 0 ? _j : []), true), [entry], false));
                    }
                    resolved = [];
                    _a = 0, _b = byKind.entries();
                    _l.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3 /*break*/, 7];
                    _c = _b[_a], kind = _c[0], inputs = _c[1];
                    return [4 /*yield*/, plugin.resolver.resolveTargets({
                            cfg: cfg,
                            accountId: (_k = opts.account) !== null && _k !== void 0 ? _k : null,
                            inputs: inputs,
                            kind: kind,
                            runtime: runtime,
                        })];
                case 5:
                    batch = _l.sent();
                    resolved.push.apply(resolved, batch);
                    _l.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 4];
                case 7:
                    byInput_1 = new Map(resolved.map(function (entry) { return [entry.input, entry]; }));
                    results = entries.map(function (input) {
                        var _a;
                        var entry = byInput_1.get(input);
                        return {
                            input: input,
                            resolved: (_a = entry === null || entry === void 0 ? void 0 : entry.resolved) !== null && _a !== void 0 ? _a : false,
                            id: entry === null || entry === void 0 ? void 0 : entry.id,
                            name: entry === null || entry === void 0 ? void 0 : entry.name,
                            note: entry === null || entry === void 0 ? void 0 : entry.note,
                        };
                    });
                    _l.label = 8;
                case 8:
                    if (opts.json) {
                        runtime.log(JSON.stringify(results, null, 2));
                        return [2 /*return*/];
                    }
                    for (_d = 0, results_1 = results; _d < results_1.length; _d++) {
                        result = results_1[_d];
                        if (result.resolved && result.id) {
                            runtime.log(formatResolveResult(result));
                        }
                        else {
                            runtime.error((0, globals_js_1.danger)("".concat(result.input, " -> unresolved").concat(result.error ? " (".concat(result.error, ")") : result.note ? " (".concat(result.note, ")") : "")));
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
