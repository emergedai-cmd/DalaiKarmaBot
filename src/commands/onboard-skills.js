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
exports.setupSkills = setupSkills;
var skills_install_js_1 = require("../agents/skills-install.js");
var skills_status_js_1 = require("../agents/skills-status.js");
var command_format_js_1 = require("../cli/command-format.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
function summarizeInstallFailure(message) {
    var cleaned = message.replace(/^Install failed(?:\s*\([^)]*\))?\s*:?\s*/i, "").trim();
    if (!cleaned) {
        return undefined;
    }
    var maxLen = 140;
    return cleaned.length > maxLen ? "".concat(cleaned.slice(0, maxLen - 1), "\u2026") : cleaned;
}
function formatSkillHint(skill) {
    var _a, _b, _c;
    var desc = (_a = skill.description) === null || _a === void 0 ? void 0 : _a.trim();
    var installLabel = (_c = (_b = skill.install[0]) === null || _b === void 0 ? void 0 : _b.label) === null || _c === void 0 ? void 0 : _c.trim();
    var combined = desc && installLabel ? "".concat(desc, " \u2014 ").concat(installLabel) : desc || installLabel;
    if (!combined) {
        return "install";
    }
    var maxLen = 90;
    return combined.length > maxLen ? "".concat(combined.slice(0, maxLen - 1), "\u2026") : combined;
}
function upsertSkillEntry(cfg, skillKey, patch) {
    var _a, _b;
    var entries = __assign({}, (_a = cfg.skills) === null || _a === void 0 ? void 0 : _a.entries);
    var existing = (_b = entries[skillKey]) !== null && _b !== void 0 ? _b : {};
    entries[skillKey] = __assign(__assign({}, existing), patch);
    return __assign(__assign({}, cfg), { skills: __assign(__assign({}, cfg.skills), { entries: entries }) });
}
function setupSkills(cfg, workspaceDir, runtime, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var report, eligible, missing, blocked, needsBrewPrompt, _a, shouldConfigure, showBrewInstall, nodeManager, next, installable, toInstall, selected, _loop_1, _i, selected_1, name_1, _b, missing_1, skill, wantsKey, apiKey, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, { config: cfg });
                    eligible = report.skills.filter(function (s) { return s.eligible; });
                    missing = report.skills.filter(function (s) { return !s.eligible && !s.disabled && !s.blockedByAllowlist; });
                    blocked = report.skills.filter(function (s) { return s.blockedByAllowlist; });
                    _a = process.platform !== "win32" &&
                        report.skills.some(function (skill) { return skill.install.some(function (option) { return option.kind === "brew"; }); });
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBinary)("brew")];
                case 1:
                    _a = !(_f.sent());
                    _f.label = 2;
                case 2:
                    needsBrewPrompt = _a;
                    return [4 /*yield*/, prompter.note([
                            "Eligible: ".concat(eligible.length),
                            "Missing requirements: ".concat(missing.length),
                            "Blocked by allowlist: ".concat(blocked.length),
                        ].join("\n"), "Skills status")];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, prompter.confirm({
                            message: "Configure skills now? (recommended)",
                            initialValue: true,
                        })];
                case 4:
                    shouldConfigure = _f.sent();
                    if (!shouldConfigure) {
                        return [2 /*return*/, cfg];
                    }
                    if (!needsBrewPrompt) return [3 /*break*/, 8];
                    return [4 /*yield*/, prompter.note([
                            "Many skill dependencies are shipped via Homebrew.",
                            "Without brew, you'll need to build from source or download releases manually.",
                        ].join("\n"), "Homebrew recommended")];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, prompter.confirm({
                            message: "Show Homebrew install command?",
                            initialValue: true,
                        })];
                case 6:
                    showBrewInstall = _f.sent();
                    if (!showBrewInstall) return [3 /*break*/, 8];
                    return [4 /*yield*/, prompter.note([
                            "Run:",
                            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
                        ].join("\n"), "Homebrew install")];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8: return [4 /*yield*/, prompter.select({
                        message: "Preferred node manager for skill installs",
                        options: (0, onboard_helpers_js_1.resolveNodeManagerOptions)(),
                    })];
                case 9:
                    nodeManager = (_f.sent());
                    next = __assign(__assign({}, cfg), { skills: __assign(__assign({}, cfg.skills), { install: __assign(__assign({}, (_d = cfg.skills) === null || _d === void 0 ? void 0 : _d.install), { nodeManager: nodeManager }) }) });
                    installable = missing.filter(function (skill) { return skill.install.length > 0 && skill.missing.bins.length > 0; });
                    if (!(installable.length > 0)) return [3 /*break*/, 14];
                    return [4 /*yield*/, prompter.multiselect({
                            message: "Install missing skill dependencies",
                            options: __spreadArray([
                                {
                                    value: "__skip__",
                                    label: "Skip for now",
                                    hint: "Continue without installing dependencies",
                                }
                            ], installable.map(function (skill) {
                                var _a;
                                return ({
                                    value: skill.name,
                                    label: "".concat((_a = skill.emoji) !== null && _a !== void 0 ? _a : "🧩", " ").concat(skill.name),
                                    hint: formatSkillHint(skill),
                                });
                            }), true),
                        })];
                case 10:
                    toInstall = _f.sent();
                    selected = toInstall.filter(function (name) { return name !== "__skip__"; });
                    _loop_1 = function (name_1) {
                        var target, installId, spin, result, code, detail;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    target = installable.find(function (s) { return s.name === name_1; });
                                    if (!target || target.install.length === 0) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    installId = (_e = target.install[0]) === null || _e === void 0 ? void 0 : _e.id;
                                    if (!installId) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    spin = prompter.progress("Installing ".concat(name_1, "\u2026"));
                                    return [4 /*yield*/, (0, skills_install_js_1.installSkill)({
                                            workspaceDir: workspaceDir,
                                            skillName: target.name,
                                            installId: installId,
                                            config: next,
                                        })];
                                case 1:
                                    result = _g.sent();
                                    if (result.ok) {
                                        spin.stop("Installed ".concat(name_1));
                                    }
                                    else {
                                        code = result.code == null ? "" : " (exit ".concat(result.code, ")");
                                        detail = summarizeInstallFailure(result.message);
                                        spin.stop("Install failed: ".concat(name_1).concat(code).concat(detail ? " \u2014 ".concat(detail) : ""));
                                        if (result.stderr) {
                                            runtime.log(result.stderr.trim());
                                        }
                                        else if (result.stdout) {
                                            runtime.log(result.stdout.trim());
                                        }
                                        runtime.log("Tip: run `".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor"), "` to review skills + requirements."));
                                        runtime.log("Docs: https://docs.openclaw.ai/skills");
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, selected_1 = selected;
                    _f.label = 11;
                case 11:
                    if (!(_i < selected_1.length)) return [3 /*break*/, 14];
                    name_1 = selected_1[_i];
                    return [5 /*yield**/, _loop_1(name_1)];
                case 12:
                    _f.sent();
                    _f.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 11];
                case 14:
                    _b = 0, missing_1 = missing;
                    _f.label = 15;
                case 15:
                    if (!(_b < missing_1.length)) return [3 /*break*/, 19];
                    skill = missing_1[_b];
                    if (!skill.primaryEnv || skill.missing.env.length === 0) {
                        return [3 /*break*/, 18];
                    }
                    return [4 /*yield*/, prompter.confirm({
                            message: "Set ".concat(skill.primaryEnv, " for ").concat(skill.name, "?"),
                            initialValue: false,
                        })];
                case 16:
                    wantsKey = _f.sent();
                    if (!wantsKey) {
                        return [3 /*break*/, 18];
                    }
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Enter ".concat(skill.primaryEnv),
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 17:
                    apiKey = _c.apply(void 0, [_f.sent()]);
                    next = upsertSkillEntry(next, skill.skillKey, { apiKey: apiKey.trim() });
                    _f.label = 18;
                case 18:
                    _b++;
                    return [3 /*break*/, 15];
                case 19: return [2 /*return*/, next];
            }
        });
    });
}
