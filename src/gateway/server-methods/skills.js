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
exports.skillsHandlers = void 0;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var skills_install_js_1 = require("../../agents/skills-install.js");
var skills_status_js_1 = require("../../agents/skills-status.js");
var skills_js_1 = require("../../agents/skills.js");
var config_js_1 = require("../../config/config.js");
var skills_remote_js_1 = require("../../infra/skills-remote.js");
var index_js_1 = require("../protocol/index.js");
function listWorkspaceDirs(cfg) {
    var _a;
    var dirs = new Set();
    var list = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list;
    if (Array.isArray(list)) {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var entry = list_1[_i];
            if (entry && typeof entry === "object" && typeof entry.id === "string") {
                dirs.add((0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, entry.id));
            }
        }
    }
    dirs.add((0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(cfg)));
    return __spreadArray([], dirs, true);
}
function collectSkillBins(entries) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var bins = new Set();
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var required = (_c = (_b = (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.requires) === null || _b === void 0 ? void 0 : _b.bins) !== null && _c !== void 0 ? _c : [];
        var anyBins = (_f = (_e = (_d = entry.metadata) === null || _d === void 0 ? void 0 : _d.requires) === null || _e === void 0 ? void 0 : _e.anyBins) !== null && _f !== void 0 ? _f : [];
        var install = (_h = (_g = entry.metadata) === null || _g === void 0 ? void 0 : _g.install) !== null && _h !== void 0 ? _h : [];
        for (var _k = 0, required_1 = required; _k < required_1.length; _k++) {
            var bin = required_1[_k];
            var trimmed = bin.trim();
            if (trimmed) {
                bins.add(trimmed);
            }
        }
        for (var _l = 0, anyBins_1 = anyBins; _l < anyBins_1.length; _l++) {
            var bin = anyBins_1[_l];
            var trimmed = bin.trim();
            if (trimmed) {
                bins.add(trimmed);
            }
        }
        for (var _m = 0, install_1 = install; _m < install_1.length; _m++) {
            var spec = install_1[_m];
            var specBins = (_j = spec === null || spec === void 0 ? void 0 : spec.bins) !== null && _j !== void 0 ? _j : [];
            for (var _o = 0, specBins_1 = specBins; _o < specBins_1.length; _o++) {
                var bin = specBins_1[_o];
                var trimmed = String(bin).trim();
                if (trimmed) {
                    bins.add(trimmed);
                }
            }
        }
    }
    return __spreadArray([], bins, true).toSorted();
}
exports.skillsHandlers = {
    "skills.status": function (_a) {
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_1.validateSkillsStatusParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid skills.status params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSkillsStatusParams.errors))));
            return;
        }
        var cfg = (0, config_js_1.loadConfig)();
        var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
        var report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, {
            config: cfg,
            eligibility: { remote: (0, skills_remote_js_1.getRemoteSkillEligibility)() },
        });
        respond(true, report, undefined);
    },
    "skills.bins": function (_a) {
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_1.validateSkillsBinsParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid skills.bins params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSkillsBinsParams.errors))));
            return;
        }
        var cfg = (0, config_js_1.loadConfig)();
        var workspaceDirs = listWorkspaceDirs(cfg);
        var bins = new Set();
        for (var _i = 0, workspaceDirs_1 = workspaceDirs; _i < workspaceDirs_1.length; _i++) {
            var workspaceDir = workspaceDirs_1[_i];
            var entries = (0, skills_js_1.loadWorkspaceSkillEntries)(workspaceDir, { config: cfg });
            for (var _b = 0, _c = collectSkillBins(entries); _b < _c.length; _b++) {
                var bin = _c[_b];
                bins.add(bin);
            }
        }
        respond(true, { bins: __spreadArray([], bins, true).toSorted() }, undefined);
    },
    "skills.install": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, cfg, workspaceDirRaw, result;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateSkillsInstallParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid skills.install params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSkillsInstallParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    cfg = (0, config_js_1.loadConfig)();
                    workspaceDirRaw = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
                    return [4 /*yield*/, (0, skills_install_js_1.installSkill)({
                            workspaceDir: workspaceDirRaw,
                            skillName: p.name,
                            installId: p.installId,
                            timeoutMs: p.timeoutMs,
                            config: cfg,
                        })];
                case 1:
                    result = _c.sent();
                    respond(result.ok, result, result.ok ? undefined : (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, result.message));
                    return [2 /*return*/];
            }
        });
    }); },
    "skills.update": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, cfg, skills, entries, current, trimmed, nextEnv, _i, _c, _d, key, value, trimmedKey, trimmedVal, nextConfig;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(0, index_js_1.validateSkillsUpdateParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid skills.update params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateSkillsUpdateParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    cfg = (0, config_js_1.loadConfig)();
                    skills = cfg.skills ? __assign({}, cfg.skills) : {};
                    entries = skills.entries ? __assign({}, skills.entries) : {};
                    current = entries[p.skillKey] ? __assign({}, entries[p.skillKey]) : {};
                    if (typeof p.enabled === "boolean") {
                        current.enabled = p.enabled;
                    }
                    if (typeof p.apiKey === "string") {
                        trimmed = p.apiKey.trim();
                        if (trimmed) {
                            current.apiKey = trimmed;
                        }
                        else {
                            delete current.apiKey;
                        }
                    }
                    if (p.env && typeof p.env === "object") {
                        nextEnv = current.env ? __assign({}, current.env) : {};
                        for (_i = 0, _c = Object.entries(p.env); _i < _c.length; _i++) {
                            _d = _c[_i], key = _d[0], value = _d[1];
                            trimmedKey = key.trim();
                            if (!trimmedKey) {
                                continue;
                            }
                            trimmedVal = value.trim();
                            if (!trimmedVal) {
                                delete nextEnv[trimmedKey];
                            }
                            else {
                                nextEnv[trimmedKey] = trimmedVal;
                            }
                        }
                        current.env = nextEnv;
                    }
                    entries[p.skillKey] = current;
                    skills.entries = entries;
                    nextConfig = __assign(__assign({}, cfg), { skills: skills });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
                case 1:
                    _e.sent();
                    respond(true, { ok: true, skillKey: p.skillKey, config: current }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
};
