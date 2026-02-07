"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRunCli = registerRunCli;
var node_process_1 = require("node:process");
var run_cli_js_1 = require("./run-cli.js");
function toNumberOrUndefined(v) {
  if (v === undefined || v === null || v === "") return undefined;
  var n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function registerRunCli(program) {
  program
    .command("run")
    .description("Run DalaiKarmaBot (interactive or one-shot; Groq default)")
    .option("--provider <id>", "Provider (default from config or groq)")
    .option("--model <id>", "Model id (default from config)")
    .option("--prompt <text>", "One-shot prompt (omit for interactive mode)")
    .option("--temperature <number>", "Sampling temperature (0..2)")
    .option("--max-tokens <n>", "Max output tokens (provider-dependent)")
    .option("--timeout-ms <ms>", "HTTP timeout in milliseconds")
    .option("--json", "Emit strict JSON result (no extra stdout)", false)
    .option("--quiet", "Suppress non-essential output (implies no stdout noise)", false)
    .option("--n8n", "Non-interactive JSON handoff for n8n webhooks (requires --prompt)", false)
    .action(function (opts) {
      return (0, run_cli_js_1.runRun)(node_process_1.cwd(), {
        provider: String((opts === null || opts === void 0 ? void 0 : opts.provider) ?? ""),
        model: String((opts === null || opts === void 0 ? void 0 : opts.model) ?? ""),
        prompt: typeof (opts === null || opts === void 0 ? void 0 : opts.prompt) === "string" ? opts.prompt : undefined,
        json: Boolean(opts === null || opts === void 0 ? void 0 : opts.json),
        quiet: Boolean(opts === null || opts === void 0 ? void 0 : opts.quiet),
        n8n: Boolean(opts === null || opts === void 0 ? void 0 : opts.n8n),
        temperature: toNumberOrUndefined(opts === null || opts === void 0 ? void 0 : opts.temperature),
        maxTokens: toNumberOrUndefined(opts === null || opts === void 0 ? void 0 : opts.maxTokens),
        timeoutMs: toNumberOrUndefined(opts === null || opts === void 0 ? void 0 : opts.timeoutMs),
      });
    });
}
