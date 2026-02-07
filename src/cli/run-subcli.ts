import type { Command } from "commander";
import process from "node:process";
import { runRun } from "./run-cli.js";

function toNumberOrUndefined(v: unknown): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function registerRunCli(program: Command) {
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
    .action(async (opts) => {
      const cwd = process.cwd();
      await runRun(cwd, {
        provider: String(opts.provider ?? ""),
        model: String(opts.model ?? ""),
        prompt: typeof opts.prompt === "string" ? opts.prompt : undefined,
        json: Boolean(opts.json),
        quiet: Boolean(opts.quiet),
        n8n: Boolean(opts.n8n),
        temperature: toNumberOrUndefined(opts.temperature),
        maxTokens: toNumberOrUndefined(opts.maxTokens),
        timeoutMs: toNumberOrUndefined(opts.timeoutMs),
      } as any);
    });
}
