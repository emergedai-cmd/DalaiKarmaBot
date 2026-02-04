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
exports.agentsListCommand = agentsListCommand;
var command_format_js_1 = require("../cli/command-format.js");
var session_key_js_1 = require("../routing/session-key.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
var agents_bindings_js_1 = require("./agents.bindings.js");
var agents_command_shared_js_1 = require("./agents.command-shared.js");
var agents_config_js_1 = require("./agents.config.js");
var agents_providers_js_1 = require("./agents.providers.js");
function formatSummary(summary) {
    var _a, _b, _c;
    var defaultTag = summary.isDefault ? " (default)" : "";
    var header = summary.name && summary.name !== summary.id
        ? "".concat(summary.id).concat(defaultTag, " (").concat(summary.name, ")")
        : "".concat(summary.id).concat(defaultTag);
    var identityParts = [];
    if (summary.identityEmoji) {
        identityParts.push(summary.identityEmoji);
    }
    if (summary.identityName) {
        identityParts.push(summary.identityName);
    }
    var identityLine = identityParts.length > 0 ? identityParts.join(" ") : null;
    var identitySource = summary.identitySource === "identity"
        ? "IDENTITY.md"
        : summary.identitySource === "config"
            ? "config"
            : null;
    var lines = ["- ".concat(header)];
    if (identityLine) {
        lines.push("  Identity: ".concat(identityLine).concat(identitySource ? " (".concat(identitySource, ")") : ""));
    }
    lines.push("  Workspace: ".concat((0, utils_js_1.shortenHomePath)(summary.workspace)));
    lines.push("  Agent dir: ".concat((0, utils_js_1.shortenHomePath)(summary.agentDir)));
    if (summary.model) {
        lines.push("  Model: ".concat(summary.model));
    }
    lines.push("  Routing rules: ".concat(summary.bindings));
    if ((_a = summary.routes) === null || _a === void 0 ? void 0 : _a.length) {
        lines.push("  Routing: ".concat(summary.routes.join(", ")));
    }
    if ((_b = summary.providers) === null || _b === void 0 ? void 0 : _b.length) {
        lines.push("  Providers:");
        for (var _i = 0, _d = summary.providers; _i < _d.length; _i++) {
            var provider = _d[_i];
            lines.push("    - ".concat(provider));
        }
    }
    if ((_c = summary.bindingDetails) === null || _c === void 0 ? void 0 : _c.length) {
        lines.push("  Routing rules:");
        for (var _e = 0, _f = summary.bindingDetails; _e < _f.length; _e++) {
            var binding = _f[_e];
            lines.push("    - ".concat(binding));
        }
    }
    return lines.join("\n");
}
function agentsListCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var cfg, summaries, bindingMap, _i, _a, binding, agentId, list, _b, summaries_1, summary, bindings, providerStatus, _c, summaries_2, summary, bindings, routes, providerLines, lines;
        var _d, _e, _f, _g;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, agents_command_shared_js_1.requireValidConfig)(runtime)];
                case 1:
                    cfg = _h.sent();
                    if (!cfg) {
                        return [2 /*return*/];
                    }
                    summaries = (0, agents_config_js_1.buildAgentSummaries)(cfg);
                    bindingMap = new Map();
                    for (_i = 0, _a = (_d = cfg.bindings) !== null && _d !== void 0 ? _d : []; _i < _a.length; _i++) {
                        binding = _a[_i];
                        agentId = (0, session_key_js_1.normalizeAgentId)(binding.agentId);
                        list = (_e = bindingMap.get(agentId)) !== null && _e !== void 0 ? _e : [];
                        list.push(binding);
                        bindingMap.set(agentId, list);
                    }
                    if (opts.bindings) {
                        for (_b = 0, summaries_1 = summaries; _b < summaries_1.length; _b++) {
                            summary = summaries_1[_b];
                            bindings = (_f = bindingMap.get(summary.id)) !== null && _f !== void 0 ? _f : [];
                            if (bindings.length > 0) {
                                summary.bindingDetails = bindings.map(function (binding) { return (0, agents_bindings_js_1.describeBinding)(binding); });
                            }
                        }
                    }
                    return [4 /*yield*/, (0, agents_providers_js_1.buildProviderStatusIndex)(cfg)];
                case 2:
                    providerStatus = _h.sent();
                    for (_c = 0, summaries_2 = summaries; _c < summaries_2.length; _c++) {
                        summary = summaries_2[_c];
                        bindings = (_g = bindingMap.get(summary.id)) !== null && _g !== void 0 ? _g : [];
                        routes = (0, agents_providers_js_1.summarizeBindings)(cfg, bindings);
                        if (routes.length > 0) {
                            summary.routes = routes;
                        }
                        else if (summary.isDefault) {
                            summary.routes = ["default (no explicit rules)"];
                        }
                        providerLines = (0, agents_providers_js_1.listProvidersForAgent)({
                            summaryIsDefault: summary.isDefault,
                            cfg: cfg,
                            bindings: bindings,
                            providerStatus: providerStatus,
                        });
                        if (providerLines.length > 0) {
                            summary.providers = providerLines;
                        }
                    }
                    if (opts.json) {
                        runtime.log(JSON.stringify(summaries, null, 2));
                        return [2 /*return*/];
                    }
                    lines = __spreadArray(["Agents:"], summaries.map(formatSummary), true);
                    lines.push("Routing rules map channel/account/peer to an agent. Use --bindings for full rules.");
                    lines.push("Channel status reflects local config/creds. For live health: ".concat((0, command_format_js_1.formatCliCommand)("openclaw channels status --probe"), "."));
                    runtime.log(lines.join("\n"));
                    return [2 /*return*/];
            }
        });
    });
}
