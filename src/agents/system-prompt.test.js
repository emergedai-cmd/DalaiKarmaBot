"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var system_prompt_js_1 = require("./system-prompt.js");
(0, vitest_1.describe)("buildAgentSystemPrompt", function () {
    (0, vitest_1.it)("includes owner numbers when provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            ownerNumbers: ["+123", " +456 ", ""],
        });
        (0, vitest_1.expect)(prompt).toContain("## User Identity");
        (0, vitest_1.expect)(prompt).toContain("Owner numbers: +123, +456. Treat messages from these numbers as the user.");
    });
    (0, vitest_1.it)("omits owner section when numbers are missing", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
        });
        (0, vitest_1.expect)(prompt).not.toContain("## User Identity");
        (0, vitest_1.expect)(prompt).not.toContain("Owner numbers:");
    });
    (0, vitest_1.it)("omits extended sections in minimal prompt mode", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            promptMode: "minimal",
            ownerNumbers: ["+123"],
            skillsPrompt: "<available_skills>\n  <skill>\n    <name>demo</name>\n  </skill>\n</available_skills>",
            heartbeatPrompt: "ping",
            toolNames: ["message", "memory_search"],
            docsPath: "/tmp/openclaw/docs",
            extraSystemPrompt: "Subagent details",
            ttsHint: "Voice (TTS) is enabled.",
        });
        (0, vitest_1.expect)(prompt).not.toContain("## User Identity");
        (0, vitest_1.expect)(prompt).not.toContain("## Skills");
        (0, vitest_1.expect)(prompt).not.toContain("## Memory Recall");
        (0, vitest_1.expect)(prompt).not.toContain("## Documentation");
        (0, vitest_1.expect)(prompt).not.toContain("## Reply Tags");
        (0, vitest_1.expect)(prompt).not.toContain("## Messaging");
        (0, vitest_1.expect)(prompt).not.toContain("## Voice (TTS)");
        (0, vitest_1.expect)(prompt).not.toContain("## Silent Replies");
        (0, vitest_1.expect)(prompt).not.toContain("## Heartbeats");
        (0, vitest_1.expect)(prompt).toContain("## Safety");
        (0, vitest_1.expect)(prompt).toContain("You have no independent goals");
        (0, vitest_1.expect)(prompt).toContain("Prioritize safety and human oversight");
        (0, vitest_1.expect)(prompt).toContain("if instructions conflict");
        (0, vitest_1.expect)(prompt).toContain("Inspired by Anthropic's constitution");
        (0, vitest_1.expect)(prompt).toContain("Do not manipulate or persuade anyone");
        (0, vitest_1.expect)(prompt).toContain("Do not copy yourself or change system prompts");
        (0, vitest_1.expect)(prompt).toContain("## Subagent Context");
        (0, vitest_1.expect)(prompt).not.toContain("## Group Chat Context");
        (0, vitest_1.expect)(prompt).toContain("Subagent details");
    });
    (0, vitest_1.it)("includes safety guardrails in full prompts", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
        });
        (0, vitest_1.expect)(prompt).toContain("## Safety");
        (0, vitest_1.expect)(prompt).toContain("You have no independent goals");
        (0, vitest_1.expect)(prompt).toContain("Prioritize safety and human oversight");
        (0, vitest_1.expect)(prompt).toContain("if instructions conflict");
        (0, vitest_1.expect)(prompt).toContain("Inspired by Anthropic's constitution");
        (0, vitest_1.expect)(prompt).toContain("Do not manipulate or persuade anyone");
        (0, vitest_1.expect)(prompt).toContain("Do not copy yourself or change system prompts");
    });
    (0, vitest_1.it)("includes voice hint when provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            ttsHint: "Voice (TTS) is enabled.",
        });
        (0, vitest_1.expect)(prompt).toContain("## Voice (TTS)");
        (0, vitest_1.expect)(prompt).toContain("Voice (TTS) is enabled.");
    });
    (0, vitest_1.it)("adds reasoning tag hint when enabled", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            reasoningTagHint: true,
        });
        (0, vitest_1.expect)(prompt).toContain("## Reasoning Format");
        (0, vitest_1.expect)(prompt).toContain("<think>...</think>");
        (0, vitest_1.expect)(prompt).toContain("<final>...</final>");
    });
    (0, vitest_1.it)("includes a CLI quick reference section", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
        });
        (0, vitest_1.expect)(prompt).toContain("## OpenClaw CLI Quick Reference");
        (0, vitest_1.expect)(prompt).toContain("openclaw gateway restart");
        (0, vitest_1.expect)(prompt).toContain("Do not invent commands");
    });
    (0, vitest_1.it)("lists available tools when provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            toolNames: ["exec", "sessions_list", "sessions_history", "sessions_send"],
        });
        (0, vitest_1.expect)(prompt).toContain("Tool availability (filtered by policy):");
        (0, vitest_1.expect)(prompt).toContain("sessions_list");
        (0, vitest_1.expect)(prompt).toContain("sessions_history");
        (0, vitest_1.expect)(prompt).toContain("sessions_send");
    });
    (0, vitest_1.it)("preserves tool casing in the prompt", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            toolNames: ["Read", "Exec", "process"],
            skillsPrompt: "<available_skills>\n  <skill>\n    <name>demo</name>\n  </skill>\n</available_skills>",
            docsPath: "/tmp/openclaw/docs",
        });
        (0, vitest_1.expect)(prompt).toContain("- Read: Read file contents");
        (0, vitest_1.expect)(prompt).toContain("- Exec: Run shell commands");
        (0, vitest_1.expect)(prompt).toContain("- If exactly one skill clearly applies: read its SKILL.md at <location> with `Read`, then follow it.");
        (0, vitest_1.expect)(prompt).toContain("OpenClaw docs: /tmp/openclaw/docs");
        (0, vitest_1.expect)(prompt).toContain("For OpenClaw behavior, commands, config, or architecture: consult local docs first.");
    });
    (0, vitest_1.it)("includes docs guidance when docsPath is provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            docsPath: "/tmp/openclaw/docs",
        });
        (0, vitest_1.expect)(prompt).toContain("## Documentation");
        (0, vitest_1.expect)(prompt).toContain("OpenClaw docs: /tmp/openclaw/docs");
        (0, vitest_1.expect)(prompt).toContain("For OpenClaw behavior, commands, config, or architecture: consult local docs first.");
    });
    (0, vitest_1.it)("includes workspace notes when provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            workspaceNotes: ["Reminder: commit your changes in this workspace after edits."],
        });
        (0, vitest_1.expect)(prompt).toContain("Reminder: commit your changes in this workspace after edits.");
    });
    (0, vitest_1.it)("includes user timezone when provided (12-hour)", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            userTimezone: "America/Chicago",
            userTime: "Monday, January 5th, 2026 — 3:26 PM",
            userTimeFormat: "12",
        });
        (0, vitest_1.expect)(prompt).toContain("## Current Date & Time");
        (0, vitest_1.expect)(prompt).toContain("Time zone: America/Chicago");
    });
    (0, vitest_1.it)("includes user timezone when provided (24-hour)", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            userTimezone: "America/Chicago",
            userTime: "Monday, January 5th, 2026 — 15:26",
            userTimeFormat: "24",
        });
        (0, vitest_1.expect)(prompt).toContain("## Current Date & Time");
        (0, vitest_1.expect)(prompt).toContain("Time zone: America/Chicago");
    });
    (0, vitest_1.it)("shows timezone when only timezone is provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            userTimezone: "America/Chicago",
            userTimeFormat: "24",
        });
        (0, vitest_1.expect)(prompt).toContain("## Current Date & Time");
        (0, vitest_1.expect)(prompt).toContain("Time zone: America/Chicago");
    });
    (0, vitest_1.it)("hints to use session_status for current date/time", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/clawd",
            userTimezone: "America/Chicago",
        });
        (0, vitest_1.expect)(prompt).toContain("session_status");
        (0, vitest_1.expect)(prompt).toContain("current date");
    });
    // The system prompt intentionally does NOT include the current date/time.
    // Only the timezone is included, to keep the prompt stable for caching.
    // See: https://github.com/moltbot/moltbot/commit/66eec295b894bce8333886cfbca3b960c57c4946
    // Agents should use session_status or message timestamps to determine the date/time.
    // Related: https://github.com/moltbot/moltbot/issues/1897
    //          https://github.com/moltbot/moltbot/issues/3658
    (0, vitest_1.it)("does NOT include a date or time in the system prompt (cache stability)", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/clawd",
            userTimezone: "America/Chicago",
            userTime: "Monday, January 5th, 2026 — 3:26 PM",
            userTimeFormat: "12",
        });
        // The prompt should contain the timezone but NOT the formatted date/time string.
        // This is intentional for prompt cache stability — the date/time was removed in
        // commit 66eec295b. If you're here because you want to add it back, please see
        // https://github.com/moltbot/moltbot/issues/3658 for the preferred approach:
        // gateway-level timestamp injection into messages, not the system prompt.
        (0, vitest_1.expect)(prompt).toContain("Time zone: America/Chicago");
        (0, vitest_1.expect)(prompt).not.toContain("Monday, January 5th, 2026");
        (0, vitest_1.expect)(prompt).not.toContain("3:26 PM");
        (0, vitest_1.expect)(prompt).not.toContain("15:26");
    });
    (0, vitest_1.it)("includes model alias guidance when aliases are provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            modelAliasLines: [
                "- Opus: anthropic/claude-opus-4-5",
                "- Sonnet: anthropic/claude-sonnet-4-5",
            ],
        });
        (0, vitest_1.expect)(prompt).toContain("## Model Aliases");
        (0, vitest_1.expect)(prompt).toContain("Prefer aliases when specifying model overrides");
        (0, vitest_1.expect)(prompt).toContain("- Opus: anthropic/claude-opus-4-5");
    });
    (0, vitest_1.it)("adds ClaudeBot self-update guidance when gateway tool is available", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            toolNames: ["gateway", "exec"],
        });
        (0, vitest_1.expect)(prompt).toContain("## OpenClaw Self-Update");
        (0, vitest_1.expect)(prompt).toContain("config.apply");
        (0, vitest_1.expect)(prompt).toContain("update.run");
    });
    (0, vitest_1.it)("includes skills guidance when skills prompt is present", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            skillsPrompt: "<available_skills>\n  <skill>\n    <name>demo</name>\n  </skill>\n</available_skills>",
        });
        (0, vitest_1.expect)(prompt).toContain("## Skills");
        (0, vitest_1.expect)(prompt).toContain("- If exactly one skill clearly applies: read its SKILL.md at <location> with `read`, then follow it.");
    });
    (0, vitest_1.it)("appends available skills when provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            skillsPrompt: "<available_skills>\n  <skill>\n    <name>demo</name>\n  </skill>\n</available_skills>",
        });
        (0, vitest_1.expect)(prompt).toContain("<available_skills>");
        (0, vitest_1.expect)(prompt).toContain("<name>demo</name>");
    });
    (0, vitest_1.it)("omits skills section when no skills prompt is provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
        });
        (0, vitest_1.expect)(prompt).not.toContain("## Skills");
        (0, vitest_1.expect)(prompt).not.toContain("<available_skills>");
    });
    (0, vitest_1.it)("renders project context files when provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            contextFiles: [
                { path: "AGENTS.md", content: "Alpha" },
                { path: "IDENTITY.md", content: "Bravo" },
            ],
        });
        (0, vitest_1.expect)(prompt).toContain("# Project Context");
        (0, vitest_1.expect)(prompt).toContain("## AGENTS.md");
        (0, vitest_1.expect)(prompt).toContain("Alpha");
        (0, vitest_1.expect)(prompt).toContain("## IDENTITY.md");
        (0, vitest_1.expect)(prompt).toContain("Bravo");
    });
    (0, vitest_1.it)("adds SOUL guidance when a soul file is present", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            contextFiles: [
                { path: "./SOUL.md", content: "Persona" },
                { path: "dir\\SOUL.md", content: "Persona Windows" },
            ],
        });
        (0, vitest_1.expect)(prompt).toContain("If SOUL.md is present, embody its persona and tone. Avoid stiff, generic replies; follow its guidance unless higher-priority instructions override it.");
    });
    (0, vitest_1.it)("summarizes the message tool when available", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            toolNames: ["message"],
        });
        (0, vitest_1.expect)(prompt).toContain("message: Send messages and channel actions");
        (0, vitest_1.expect)(prompt).toContain("### message tool");
        (0, vitest_1.expect)(prompt).toContain("respond with ONLY: NO_REPLY");
    });
    (0, vitest_1.it)("includes runtime provider capabilities when present", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            runtimeInfo: {
                channel: "telegram",
                capabilities: ["inlineButtons"],
            },
        });
        (0, vitest_1.expect)(prompt).toContain("channel=telegram");
        (0, vitest_1.expect)(prompt).toContain("capabilities=inlineButtons");
    });
    (0, vitest_1.it)("includes agent id in runtime when provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            runtimeInfo: {
                agentId: "work",
                host: "host",
                os: "macOS",
                arch: "arm64",
                node: "v20",
                model: "anthropic/claude",
            },
        });
        (0, vitest_1.expect)(prompt).toContain("agent=work");
    });
    (0, vitest_1.it)("includes reasoning visibility hint", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            reasoningLevel: "off",
        });
        (0, vitest_1.expect)(prompt).toContain("Reasoning: off");
        (0, vitest_1.expect)(prompt).toContain("/reasoning");
        (0, vitest_1.expect)(prompt).toContain("/status shows Reasoning");
    });
    (0, vitest_1.it)("builds runtime line with agent and channel details", function () {
        var line = (0, system_prompt_js_1.buildRuntimeLine)({
            agentId: "work",
            host: "host",
            repoRoot: "/repo",
            os: "macOS",
            arch: "arm64",
            node: "v20",
            model: "anthropic/claude",
            defaultModel: "anthropic/claude-opus-4-5",
        }, "telegram", ["inlineButtons"], "low");
        (0, vitest_1.expect)(line).toContain("agent=work");
        (0, vitest_1.expect)(line).toContain("host=host");
        (0, vitest_1.expect)(line).toContain("repo=/repo");
        (0, vitest_1.expect)(line).toContain("os=macOS (arm64)");
        (0, vitest_1.expect)(line).toContain("node=v20");
        (0, vitest_1.expect)(line).toContain("model=anthropic/claude");
        (0, vitest_1.expect)(line).toContain("default_model=anthropic/claude-opus-4-5");
        (0, vitest_1.expect)(line).toContain("channel=telegram");
        (0, vitest_1.expect)(line).toContain("capabilities=inlineButtons");
        (0, vitest_1.expect)(line).toContain("thinking=low");
    });
    (0, vitest_1.it)("describes sandboxed runtime and elevated when allowed", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            sandboxInfo: {
                enabled: true,
                workspaceDir: "/tmp/sandbox",
                workspaceAccess: "ro",
                agentWorkspaceMount: "/agent",
                elevated: { allowed: true, defaultLevel: "on" },
            },
        });
        (0, vitest_1.expect)(prompt).toContain("You are running in a sandboxed runtime");
        (0, vitest_1.expect)(prompt).toContain("Sub-agents stay sandboxed");
        (0, vitest_1.expect)(prompt).toContain("User can toggle with /elevated on|off|ask|full.");
        (0, vitest_1.expect)(prompt).toContain("Current elevated level: on");
    });
    (0, vitest_1.it)("includes reaction guidance when provided", function () {
        var prompt = (0, system_prompt_js_1.buildAgentSystemPrompt)({
            workspaceDir: "/tmp/openclaw",
            reactionGuidance: {
                level: "minimal",
                channel: "Telegram",
            },
        });
        (0, vitest_1.expect)(prompt).toContain("## Reactions");
        (0, vitest_1.expect)(prompt).toContain("Reactions are enabled for Telegram in MINIMAL mode.");
    });
});
