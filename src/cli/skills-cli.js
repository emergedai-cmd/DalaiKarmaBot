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
exports.formatSkillsList = formatSkillsList;
exports.formatSkillInfo = formatSkillInfo;
exports.formatSkillsCheck = formatSkillsCheck;
exports.registerSkillsCli = registerSkillsCli;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var skills_status_js_1 = require("../agents/skills-status.js");
var config_js_1 = require("../config/config.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
var utils_js_1 = require("../utils.js");
var command_format_js_1 = require("./command-format.js");
function appendClawHubHint(output, json) {
    if (json) {
        return output;
    }
    return "".concat(output, "\n\nTip: use `npx clawhub` to search, install, and sync skills.");
}
function formatSkillStatus(skill) {
    if (skill.eligible) {
        return theme_js_1.theme.success("✓ ready");
    }
    if (skill.disabled) {
        return theme_js_1.theme.warn("⏸ disabled");
    }
    if (skill.blockedByAllowlist) {
        return theme_js_1.theme.warn("🚫 blocked");
    }
    return theme_js_1.theme.error("✗ missing");
}
function formatSkillName(skill) {
    var _a;
    var emoji = (_a = skill.emoji) !== null && _a !== void 0 ? _a : "📦";
    return "".concat(emoji, " ").concat(theme_js_1.theme.command(skill.name));
}
function formatSkillMissingSummary(skill) {
    var missing = [];
    if (skill.missing.bins.length > 0) {
        missing.push("bins: ".concat(skill.missing.bins.join(", ")));
    }
    if (skill.missing.anyBins.length > 0) {
        missing.push("anyBins: ".concat(skill.missing.anyBins.join(", ")));
    }
    if (skill.missing.env.length > 0) {
        missing.push("env: ".concat(skill.missing.env.join(", ")));
    }
    if (skill.missing.config.length > 0) {
        missing.push("config: ".concat(skill.missing.config.join(", ")));
    }
    if (skill.missing.os.length > 0) {
        missing.push("os: ".concat(skill.missing.os.join(", ")));
    }
    return missing.join("; ");
}
/**
 * Format the skills list output
 */
function formatSkillsList(report, opts) {
    var _a;
    var skills = opts.eligible ? report.skills.filter(function (s) { return s.eligible; }) : report.skills;
    if (opts.json) {
        var jsonReport = {
            workspaceDir: report.workspaceDir,
            managedSkillsDir: report.managedSkillsDir,
            skills: skills.map(function (s) { return ({
                name: s.name,
                description: s.description,
                emoji: s.emoji,
                eligible: s.eligible,
                disabled: s.disabled,
                blockedByAllowlist: s.blockedByAllowlist,
                source: s.source,
                primaryEnv: s.primaryEnv,
                homepage: s.homepage,
                missing: s.missing,
            }); }),
        };
        return JSON.stringify(jsonReport, null, 2);
    }
    if (skills.length === 0) {
        var message = opts.eligible
            ? "No eligible skills found. Run `".concat((0, command_format_js_1.formatCliCommand)("openclaw skills list"), "` to see all skills.")
            : "No skills found.";
        return appendClawHubHint(message, opts.json);
    }
    var eligible = skills.filter(function (s) { return s.eligible; });
    var tableWidth = Math.max(60, ((_a = process.stdout.columns) !== null && _a !== void 0 ? _a : 120) - 1);
    var rows = skills.map(function (skill) {
        var _a;
        var missing = formatSkillMissingSummary(skill);
        return {
            Status: formatSkillStatus(skill),
            Skill: formatSkillName(skill),
            Description: theme_js_1.theme.muted(skill.description),
            Source: (_a = skill.source) !== null && _a !== void 0 ? _a : "",
            Missing: missing ? theme_js_1.theme.warn(missing) : "",
        };
    });
    var columns = [
        { key: "Status", header: "Status", minWidth: 10 },
        { key: "Skill", header: "Skill", minWidth: 18, flex: true },
        { key: "Description", header: "Description", minWidth: 24, flex: true },
        { key: "Source", header: "Source", minWidth: 10 },
    ];
    if (opts.verbose) {
        columns.push({ key: "Missing", header: "Missing", minWidth: 18, flex: true });
    }
    var lines = [];
    lines.push("".concat(theme_js_1.theme.heading("Skills"), " ").concat(theme_js_1.theme.muted("(".concat(eligible.length, "/").concat(skills.length, " ready)"))));
    lines.push((0, table_js_1.renderTable)({
        width: tableWidth,
        columns: columns,
        rows: rows,
    }).trimEnd());
    return appendClawHubHint(lines.join("\n"), opts.json);
}
/**
 * Format detailed info for a single skill
 */
function formatSkillInfo(report, skillName, opts) {
    var _a;
    var skill = report.skills.find(function (s) { return s.name === skillName || s.skillKey === skillName; });
    if (!skill) {
        if (opts.json) {
            return JSON.stringify({ error: "not found", skill: skillName }, null, 2);
        }
        return appendClawHubHint("Skill \"".concat(skillName, "\" not found. Run `").concat((0, command_format_js_1.formatCliCommand)("openclaw skills list"), "` to see available skills."), opts.json);
    }
    if (opts.json) {
        return JSON.stringify(skill, null, 2);
    }
    var lines = [];
    var emoji = (_a = skill.emoji) !== null && _a !== void 0 ? _a : "📦";
    var status = skill.eligible
        ? theme_js_1.theme.success("✓ Ready")
        : skill.disabled
            ? theme_js_1.theme.warn("⏸ Disabled")
            : skill.blockedByAllowlist
                ? theme_js_1.theme.warn("🚫 Blocked by allowlist")
                : theme_js_1.theme.error("✗ Missing requirements");
    lines.push("".concat(emoji, " ").concat(theme_js_1.theme.heading(skill.name), " ").concat(status));
    lines.push("");
    lines.push(skill.description);
    lines.push("");
    // Details
    lines.push(theme_js_1.theme.heading("Details:"));
    lines.push("".concat(theme_js_1.theme.muted("  Source:"), " ").concat(skill.source));
    lines.push("".concat(theme_js_1.theme.muted("  Path:"), " ").concat((0, utils_js_1.shortenHomePath)(skill.filePath)));
    if (skill.homepage) {
        lines.push("".concat(theme_js_1.theme.muted("  Homepage:"), " ").concat(skill.homepage));
    }
    if (skill.primaryEnv) {
        lines.push("".concat(theme_js_1.theme.muted("  Primary env:"), " ").concat(skill.primaryEnv));
    }
    // Requirements
    var hasRequirements = skill.requirements.bins.length > 0 ||
        skill.requirements.anyBins.length > 0 ||
        skill.requirements.env.length > 0 ||
        skill.requirements.config.length > 0 ||
        skill.requirements.os.length > 0;
    if (hasRequirements) {
        lines.push("");
        lines.push(theme_js_1.theme.heading("Requirements:"));
        if (skill.requirements.bins.length > 0) {
            var binsStatus = skill.requirements.bins.map(function (bin) {
                var missing = skill.missing.bins.includes(bin);
                return missing ? theme_js_1.theme.error("\u2717 ".concat(bin)) : theme_js_1.theme.success("\u2713 ".concat(bin));
            });
            lines.push("".concat(theme_js_1.theme.muted("  Binaries:"), " ").concat(binsStatus.join(", ")));
        }
        if (skill.requirements.anyBins.length > 0) {
            var anyBinsMissing_1 = skill.missing.anyBins.length > 0;
            var anyBinsStatus = skill.requirements.anyBins.map(function (bin) {
                var missing = anyBinsMissing_1;
                return missing ? theme_js_1.theme.error("\u2717 ".concat(bin)) : theme_js_1.theme.success("\u2713 ".concat(bin));
            });
            lines.push("".concat(theme_js_1.theme.muted("  Any binaries:"), " ").concat(anyBinsStatus.join(", ")));
        }
        if (skill.requirements.env.length > 0) {
            var envStatus = skill.requirements.env.map(function (env) {
                var missing = skill.missing.env.includes(env);
                return missing ? theme_js_1.theme.error("\u2717 ".concat(env)) : theme_js_1.theme.success("\u2713 ".concat(env));
            });
            lines.push("".concat(theme_js_1.theme.muted("  Environment:"), " ").concat(envStatus.join(", ")));
        }
        if (skill.requirements.config.length > 0) {
            var configStatus = skill.requirements.config.map(function (cfg) {
                var missing = skill.missing.config.includes(cfg);
                return missing ? theme_js_1.theme.error("\u2717 ".concat(cfg)) : theme_js_1.theme.success("\u2713 ".concat(cfg));
            });
            lines.push("".concat(theme_js_1.theme.muted("  Config:"), " ").concat(configStatus.join(", ")));
        }
        if (skill.requirements.os.length > 0) {
            var osStatus = skill.requirements.os.map(function (osName) {
                var missing = skill.missing.os.includes(osName);
                return missing ? theme_js_1.theme.error("\u2717 ".concat(osName)) : theme_js_1.theme.success("\u2713 ".concat(osName));
            });
            lines.push("".concat(theme_js_1.theme.muted("  OS:"), " ").concat(osStatus.join(", ")));
        }
    }
    // Install options
    if (skill.install.length > 0 && !skill.eligible) {
        lines.push("");
        lines.push(theme_js_1.theme.heading("Install options:"));
        for (var _i = 0, _b = skill.install; _i < _b.length; _i++) {
            var inst = _b[_i];
            lines.push("  ".concat(theme_js_1.theme.warn("→"), " ").concat(inst.label));
        }
    }
    return appendClawHubHint(lines.join("\n"), opts.json);
}
/**
 * Format a check/summary of all skills status
 */
function formatSkillsCheck(report, opts) {
    var _a, _b;
    var eligible = report.skills.filter(function (s) { return s.eligible; });
    var disabled = report.skills.filter(function (s) { return s.disabled; });
    var blocked = report.skills.filter(function (s) { return s.blockedByAllowlist && !s.disabled; });
    var missingReqs = report.skills.filter(function (s) { return !s.eligible && !s.disabled && !s.blockedByAllowlist; });
    if (opts.json) {
        return JSON.stringify({
            summary: {
                total: report.skills.length,
                eligible: eligible.length,
                disabled: disabled.length,
                blocked: blocked.length,
                missingRequirements: missingReqs.length,
            },
            eligible: eligible.map(function (s) { return s.name; }),
            disabled: disabled.map(function (s) { return s.name; }),
            blocked: blocked.map(function (s) { return s.name; }),
            missingRequirements: missingReqs.map(function (s) { return ({
                name: s.name,
                missing: s.missing,
                install: s.install,
            }); }),
        }, null, 2);
    }
    var lines = [];
    lines.push(theme_js_1.theme.heading("Skills Status Check"));
    lines.push("");
    lines.push("".concat(theme_js_1.theme.muted("Total:"), " ").concat(report.skills.length));
    lines.push("".concat(theme_js_1.theme.success("✓"), " ").concat(theme_js_1.theme.muted("Eligible:"), " ").concat(eligible.length));
    lines.push("".concat(theme_js_1.theme.warn("⏸"), " ").concat(theme_js_1.theme.muted("Disabled:"), " ").concat(disabled.length));
    lines.push("".concat(theme_js_1.theme.warn("🚫"), " ").concat(theme_js_1.theme.muted("Blocked by allowlist:"), " ").concat(blocked.length));
    lines.push("".concat(theme_js_1.theme.error("✗"), " ").concat(theme_js_1.theme.muted("Missing requirements:"), " ").concat(missingReqs.length));
    if (eligible.length > 0) {
        lines.push("");
        lines.push(theme_js_1.theme.heading("Ready to use:"));
        for (var _i = 0, eligible_1 = eligible; _i < eligible_1.length; _i++) {
            var skill = eligible_1[_i];
            var emoji = (_a = skill.emoji) !== null && _a !== void 0 ? _a : "📦";
            lines.push("  ".concat(emoji, " ").concat(skill.name));
        }
    }
    if (missingReqs.length > 0) {
        lines.push("");
        lines.push(theme_js_1.theme.heading("Missing requirements:"));
        for (var _c = 0, missingReqs_1 = missingReqs; _c < missingReqs_1.length; _c++) {
            var skill = missingReqs_1[_c];
            var emoji = (_b = skill.emoji) !== null && _b !== void 0 ? _b : "📦";
            var missing = [];
            if (skill.missing.bins.length > 0) {
                missing.push("bins: ".concat(skill.missing.bins.join(", ")));
            }
            if (skill.missing.anyBins.length > 0) {
                missing.push("anyBins: ".concat(skill.missing.anyBins.join(", ")));
            }
            if (skill.missing.env.length > 0) {
                missing.push("env: ".concat(skill.missing.env.join(", ")));
            }
            if (skill.missing.config.length > 0) {
                missing.push("config: ".concat(skill.missing.config.join(", ")));
            }
            if (skill.missing.os.length > 0) {
                missing.push("os: ".concat(skill.missing.os.join(", ")));
            }
            lines.push("  ".concat(emoji, " ").concat(skill.name, " ").concat(theme_js_1.theme.muted("(".concat(missing.join("; "), ")"))));
        }
    }
    return appendClawHubHint(lines.join("\n"), opts.json);
}
/**
 * Register the skills CLI commands
 */
function registerSkillsCli(program) {
    var _this = this;
    var skills = program
        .command("skills")
        .description("List and inspect available skills")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/skills", "docs.openclaw.ai/cli/skills"), "\n");
    });
    skills
        .command("list")
        .description("List all available skills")
        .option("--json", "Output as JSON", false)
        .option("--eligible", "Show only eligible (ready to use) skills", false)
        .option("-v, --verbose", "Show more details including missing requirements", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var config, workspaceDir, report;
        return __generator(this, function (_a) {
            try {
                config = (0, config_js_1.loadConfig)();
                workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(config, (0, agent_scope_js_1.resolveDefaultAgentId)(config));
                report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, { config: config });
                runtime_js_1.defaultRuntime.log(formatSkillsList(report, opts));
            }
            catch (err) {
                runtime_js_1.defaultRuntime.error(String(err));
                runtime_js_1.defaultRuntime.exit(1);
            }
            return [2 /*return*/];
        });
    }); });
    skills
        .command("info")
        .description("Show detailed information about a skill")
        .argument("<name>", "Skill name")
        .option("--json", "Output as JSON", false)
        .action(function (name, opts) { return __awaiter(_this, void 0, void 0, function () {
        var config, workspaceDir, report;
        return __generator(this, function (_a) {
            try {
                config = (0, config_js_1.loadConfig)();
                workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(config, (0, agent_scope_js_1.resolveDefaultAgentId)(config));
                report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, { config: config });
                runtime_js_1.defaultRuntime.log(formatSkillInfo(report, name, opts));
            }
            catch (err) {
                runtime_js_1.defaultRuntime.error(String(err));
                runtime_js_1.defaultRuntime.exit(1);
            }
            return [2 /*return*/];
        });
    }); });
    skills
        .command("check")
        .description("Check which skills are ready vs missing requirements")
        .option("--json", "Output as JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var config, workspaceDir, report;
        return __generator(this, function (_a) {
            try {
                config = (0, config_js_1.loadConfig)();
                workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(config, (0, agent_scope_js_1.resolveDefaultAgentId)(config));
                report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, { config: config });
                runtime_js_1.defaultRuntime.log(formatSkillsCheck(report, opts));
            }
            catch (err) {
                runtime_js_1.defaultRuntime.error(String(err));
                runtime_js_1.defaultRuntime.exit(1);
            }
            return [2 /*return*/];
        });
    }); });
    // Default action (no subcommand) - show list
    skills.action(function () { return __awaiter(_this, void 0, void 0, function () {
        var config, workspaceDir, report;
        return __generator(this, function (_a) {
            try {
                config = (0, config_js_1.loadConfig)();
                workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(config, (0, agent_scope_js_1.resolveDefaultAgentId)(config));
                report = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, { config: config });
                runtime_js_1.defaultRuntime.log(formatSkillsList(report, {}));
            }
            catch (err) {
                runtime_js_1.defaultRuntime.error(String(err));
                runtime_js_1.defaultRuntime.exit(1);
            }
            return [2 /*return*/];
        });
    }); });
}
