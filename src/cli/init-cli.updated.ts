import { Command } from "commander";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";

import { applyPlan } from "./apply-plan.js";
import { buildCleanupPlan, buildInitPlan, getPaths } from "./plan.js";

type PlanItem = { type: string; path: string; description?: string };
import { runDoctor } from "./doctor-cli.js";
import { readCliVersionSafe } from "./version.js";
import { runRun } from "./run-cli.js";

type NextStepsJson = {
  files: { configPath: string };
  env: Record<string, { powershell: string; bash: string }>;
  examples: Record<string, { title: string; command: string }[]>;
  notes: string[];
};

function buildNextSteps(configPath: string): NextStepsJson {
  return {
    files: { configPath },
    env: {
      GROQ_API_KEY: {
        powershell: '$env:GROQ_API_KEY="<your-key>"',
        bash: 'export GROQ_API_KEY="<your-key>"'
      },
      OPENROUTER_API_KEY: {
        powershell: '$env:OPENROUTER_API_KEY="<your-key>"',
        bash: 'export OPENROUTER_API_KEY="<your-key>"'
      },
      DEEPSEEK_API_KEY: {
        powershell: '$env:DEEPSEEK_API_KEY="<your-key>"',
        bash: 'export DEEPSEEK_API_KEY="<your-key>"'
      },
      MISTRAL_API_KEY: {
        powershell: '$env:MISTRAL_API_KEY="<your-key>"',
        bash: 'export MISTRAL_API_KEY="<your-key>"'
      },
      // Optional OpenRouter attribution headers (nice-to-have)
      OPENROUTER_SITE_URL: {
        powershell: '$env:OPENROUTER_SITE_URL="https://your-site.example"',
        bash: 'export OPENROUTER_SITE_URL="https://your-site.example"'
      },
      OPENROUTER_APP_NAME: {
        powershell: '$env:OPENROUTER_APP_NAME="DalaiKarmaBot"',
        bash: 'export OPENROUTER_APP_NAME="DalaiKarmaBot"'
      }
    },
    examples: {
      ollama: [
        {
          title: "Interactive chat (local)",
          command: "dalaikarmabot run --provider ollama --model llama3"
        },
        {
          title: "One-shot prompt (local)",
          command:
            'dalaikarmabot run --provider ollama --model llama3 --prompt "Say hello in two sentences."'
        }
      ],
      groq: [
        {
          title: "One-shot prompt (hosted)",
          command:
            'dalaikarmabot run --provider groq --model llama-3.1-8b-instant --prompt "Give me 3 bullet points about Auckland."'
        }
      ],
      openrouter: [
        {
          title: "One-shot prompt (hosted)",
          command:
            'dalaikarmabot run --provider openrouter --model openai/gpt-4o-mini --prompt "Summarize the plot of Dune in 3 lines."'
        }
      ],
      deepseek: [
        {
          title: "One-shot prompt (free tier)",
          command:
            'dalaikarmabot run --provider deepseek --model deepseek-chat --prompt "Explain recursion like I am 10."'
        }
      ],
      mistral: [
        {
          title: "One-shot prompt (free tier)",
          command:
            'dalaikarmabot run --provider mistral --model mistral-small --prompt "Write a short polite email confirming a meeting."'
        }
      ]
    },
    notes: [
      "Recommended: keep API keys in environment variables (not in config files).",
      "Run `dalaikarmabot doctor` to validate connectivity (doctor does no LLM calls).",
      "Run `dalaikarmabot explain` to see exactly what each command touches."
    ]
  };
}

function printNextStepsHuman(steps: NextStepsJson) {
  const h1 = (s: string) => chalk.cyanBright(s);
  const h2 = (s: string) => chalk.whiteBright(s);
  const dim = (s: string) => chalk.gray(s);
  const ok = (s: string) => chalk.green(s);

  console.log(h1("Next steps:"));
  console.log("");

  console.log(h2("1) Set API keys (recommended via environment variables):"));
  console.log("");

  // Only print key env vars by default; keep optional OpenRouter headers visually separated
  const orderedKeys = [
    "GROQ_API_KEY",
    "OPENROUTER_API_KEY",
    "DEEPSEEK_API_KEY",
    "MISTRAL_API_KEY",
    "OPENROUTER_SITE_URL",
    "OPENROUTER_APP_NAME"
  ];

  for (const k of orderedKeys) {
    const v = steps.env[k];
    if (!v) continue;
    const label =
      k === "OPENROUTER_SITE_URL" || k === "OPENROUTER_APP_NAME"
        ? `${chalk.yellow(k)} (optional)`
        : chalk.yellow(k);
    console.log(`   ${label}:`);
    console.log(`     PowerShell:  ${v.powershell}`);
    console.log(`     Bash:        ${v.bash}`);
    console.log("");
  }

  console.log(h2("2) Example commands (copy/paste):"));
  console.log("");

  for (const [provider, list] of Object.entries(steps.examples)) {
    console.log(`   ${chalk.magenta(provider)}:`);
    for (const ex of list) {
      console.log(`     ${dim(ex.title)}`);
      console.log(`     ${ex.command}`);
      console.log("");
    }
  }

  console.log(h2("3) Validate setup:"));
  console.log(`   ${ok("dalaikarmabot doctor")}`);
  console.log("");
  for (const note of steps.notes) console.log(dim(`• ${note}`));
  console.log("");
}

async function applyInitPlanQuietly(plan: PlanItem[], configPath: string, configContent: string, dryRun: boolean) {
  // For --json mode we must avoid printing anything (machine output only).
  if (dryRun) return;
  for (const item of plan) {
    if (item.type === "writeFile") {
      if (item.path === configPath) {
        await fsp.writeFile(item.path, configContent, "utf8");
      }
    } else if (item.type === "removePath") {
      // not used in init plan
    }
  }
}

export async function register(program: Command) {
  // --- init ---
  program
    .command("init")
    .description("Initialize DalaiKarmaBot in the current directory")
    .option("--dry-run", "Show what would be created, but do not write anything")
    .option("--quiet", "Suppress human output (best for CI)")
    .option("--json", "Output machine-readable JSON (implies --quiet)")
    .action(async (opts: { dryRun?: boolean; quiet?: boolean; json?: boolean }) => {
      const cwd = process.cwd();
      const p = getPaths(cwd);

      const jsonMode = !!opts.json;
      const quiet = !!opts.quiet || jsonMode;

      if (fs.existsSync(p.configPath) && !opts.dryRun) {
        if (jsonMode) {
          console.log(
            JSON.stringify(
              {
                ok: false,
                error: "dalaikarmabot.config.json already exists",
                configPath: p.configPath
              },
              null,
              2
            )
          );
          process.exitCode = 1;
          return;
        }
        console.error("❌ dalaikarmabot.config.json already exists.");
        process.exitCode = 1;
        return;
      }

      const cliVersion = readCliVersionSafe();

      const config = {
        name: "dalai-karmabot",
        version: cliVersion,
        createdAt: new Date().toISOString(),
        providers: {
          // Local providers
          ollama: { baseUrl: "http://localhost:11434" },
          lmstudio: { baseUrl: "http://127.0.0.1:1234" },
          n8n: { baseUrl: "" },

          // Hosted providers (keys via env vars by default)
          groq: { baseUrl: "https://api.groq.com/openai/v1" },
          openrouter: { baseUrl: "https://openrouter.ai/api/v1" },
          deepseek: { baseUrl: "https://api.deepseek.com/v1" },
          mistral: { baseUrl: "https://api.mistral.ai/v1" }
        }
      };

      const plan = buildInitPlan(cwd);
      const configContent = JSON.stringify(config, null, 2) + "\n";
      const steps = buildNextSteps(p.configPath);

      if (jsonMode) {
        // Machine output only: no extra logging allowed.
        await applyInitPlanQuietly(plan, p.configPath, configContent, !!opts.dryRun);
        console.log(
          JSON.stringify(
            {
              ok: true,
              dryRun: !!opts.dryRun,
              touched: plan,
              nextSteps: steps
            },
            null,
            2
          )
        );
        return;
      }

      await applyPlan(plan, {
        dryRun: !!opts.dryRun,
        // applyPlan logs on dryRun; keep it quiet if requested
        verbose: !quiet,
        writeFileContent: async (filePath) => {
          if (filePath === p.configPath) return configContent;
          return "";
        }
      });

      if (quiet) return;

      console.log("");
      if (opts.dryRun) {
        console.log(chalk.green("🧪 Dry run complete (no files were created)."));
      } else {
        console.log(chalk.green("✅ DalaiKarmaBot initialized."));
        console.log(chalk.gray("Created:"));
        console.log(chalk.gray("  - dalaikarmabot.config.json"));
      }
      console.log("");

      printNextStepsHuman(steps);
    });

  // --- where ---
  program
    .command("where")
    .description("Print the exact local paths DalaiKarmaBot uses in this directory")
    .action(() => {
      const p = getPaths(process.cwd());
      console.log(JSON.stringify(p, null, 2));
    });

  // --- explain ---
  program
    .command("explain")
    .description("Explain exactly what DalaiKarmaBot commands will touch")
    .action(() => {
      const cwd = process.cwd();
      const initPlan = buildInitPlan(cwd);
      const cleanupPlan = buildCleanupPlan(cwd);

      console.log("INIT would touch:");
      for (const i of initPlan) console.log(`- ${i.type}: ${i.path} (${i.description})`);

      console.log("\nCLEANUP would touch:");
      for (const i of cleanupPlan) console.log(`- ${i.type}: ${i.path} (${i.description})`);

      console.log("\nDOCTOR touches:");
      console.log("- read: dalaikarmabot.config.json");
      console.log("- network: optional HTTP GETs to configured provider baseUrls (no LLM calls)");

      console.log("\nRUN touches:");
      console.log("- read: dalaikarmabot.config.json");
      console.log("- network:");
      console.log("  - ollama: POST <baseUrl>/api/chat");
      console.log("  - groq/openrouter/deepseek/mistral: POST <baseUrl>/chat/completions (OpenAI-compatible)");
      console.log("  (only for the provider you choose)");
    });

  // --- cleanup / self-destruct helper ---
  program
    .command("cleanup")
    .description("Remove files created by DalaiKarmaBot init (paranoia-friendly cleanup)")
    .option("--dry-run", "Show what would be removed, but do not delete anything")
    .option("-y, --yes", "Do not prompt; actually delete")
    .action(async (opts: { dryRun?: boolean; yes?: boolean }) => {
      if (!opts.dryRun && !opts.yes) {
        console.error("Refusing to delete without --yes. Try: dalaikarmabot cleanup --dry-run");
        process.exitCode = 2;
        return;
      }

      const plan = buildCleanupPlan(process.cwd());
      await applyPlan(plan, { dryRun: !!opts.dryRun, verbose: true });

      if (!opts.dryRun) console.log("🧹 Cleanup complete.");
    });

  // --- doctor ---
  program
    .command("doctor")
    .description("Validate config and check connectivity to configured endpoints")
    .option("--timeout <ms>", "Timeout per check in milliseconds", "1500")
    .action(async (opts: { timeout?: string }) => {
      const timeoutMs = Number(opts.timeout);
      await runDoctor(process.cwd(), { timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 1500 });
    });

  // --- run ---
  program
    .command("run")
    .description("Run a minimal chat loop")
    .requiredOption("--provider <name>", "Provider to use (ollama | groq | openrouter | deepseek | mistral)")
    .requiredOption("--model <name>", "Model name (e.g. llama3, llama-3.1-8b-instant, openai/gpt-4o-mini)")
    .option("--prompt <text>", "One-shot prompt (no interactive loop)")
    .option("--timeout <ms>", "Timeout per request in milliseconds", "15000")
    .action(async (opts: { provider: string; model: string; prompt?: string; timeout?: string }) => {
      const timeoutMs = Number(opts.timeout);
      await runRun(process.cwd(), {
        provider: opts.provider,
        model: opts.model,
        prompt: opts.prompt,
        timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 15000
      });
    });
}
