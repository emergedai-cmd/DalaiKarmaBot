"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteWorkspaceStatus = noteWorkspaceStatus;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var skills_status_js_1 = require("../agents/skills-status.js");
var loader_js_1 = require("../plugins/loader.js");
var note_js_1 = require("../terminal/note.js");
var doctor_workspace_js_1 = require("./doctor-workspace.js");
function noteWorkspaceStatus(cfg) {
    var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, (0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
    var legacyWorkspace = (0, doctor_workspace_js_1.detectLegacyWorkspaceDirs)({ workspaceDir: workspaceDir });
    if (legacyWorkspace.legacyDirs.length > 0) {
        (0, note_js_1.note)((0, doctor_workspace_js_1.formatLegacyWorkspaceWarning)(legacyWorkspace), "Extra workspace");
    }
    var skillsReport = (0, skills_status_js_1.buildWorkspaceSkillStatus)(workspaceDir, { config: cfg });
    (0, note_js_1.note)([
        "Eligible: ".concat(skillsReport.skills.filter(function (s) { return s.eligible; }).length),
        "Missing requirements: ".concat(skillsReport.skills.filter(function (s) { return !s.eligible && !s.disabled && !s.blockedByAllowlist; })
            .length),
        "Blocked by allowlist: ".concat(skillsReport.skills.filter(function (s) { return s.blockedByAllowlist; }).length),
    ].join("\n"), "Skills status");
    var pluginRegistry = (0, loader_js_1.loadOpenClawPlugins)({
        config: cfg,
        workspaceDir: workspaceDir,
        logger: {
            info: function () { },
            warn: function () { },
            error: function () { },
            debug: function () { },
        },
    });
    if (pluginRegistry.plugins.length > 0) {
        var loaded = pluginRegistry.plugins.filter(function (p) { return p.status === "loaded"; });
        var disabled = pluginRegistry.plugins.filter(function (p) { return p.status === "disabled"; });
        var errored = pluginRegistry.plugins.filter(function (p) { return p.status === "error"; });
        var lines = [
            "Loaded: ".concat(loaded.length),
            "Disabled: ".concat(disabled.length),
            "Errors: ".concat(errored.length),
            errored.length > 0
                ? "- ".concat(errored
                    .slice(0, 10)
                    .map(function (p) { return p.id; })
                    .join("\n- ")).concat(errored.length > 10 ? "\n- ..." : "")
                : null,
        ].filter(function (line) { return Boolean(line); });
        (0, note_js_1.note)(lines.join("\n"), "Plugins");
    }
    if (pluginRegistry.diagnostics.length > 0) {
        var lines = pluginRegistry.diagnostics.map(function (diag) {
            var prefix = diag.level.toUpperCase();
            var plugin = diag.pluginId ? " ".concat(diag.pluginId) : "";
            var source = diag.source ? " (".concat(diag.source, ")") : "";
            return "- ".concat(prefix).concat(plugin, ": ").concat(diag.message).concat(source);
        });
        (0, note_js_1.note)(lines.join("\n"), "Plugin diagnostics");
    }
    return { workspaceDir: workspaceDir };
}
