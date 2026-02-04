import fs from "node:fs/promises";
import { PlanItem } from "./plan.js";

export async function applyPlan(
  plan: PlanItem[],
  opts: {
    dryRun?: boolean;
    verbose?: boolean;
    writeFileContent?: (filePath: string) => Promise<string>;
  }
) {
  for (const item of plan) {
    if (opts.verbose || opts.dryRun) {
      console.log(`${opts.dryRun ? "[dry-run] " : ""}${item.type}: ${item.path} — ${item.description}`);
    }

    if (opts.dryRun) continue;

    if (item.type === "writeFile") {
      const content = opts.writeFileContent ? await opts.writeFileContent(item.path) : "";
      await fs.writeFile(item.path, content, "utf8");
    } else if (item.type === "removePath") {
      await fs.rm(item.path, { recursive: true, force: true });
    }
  }
}
