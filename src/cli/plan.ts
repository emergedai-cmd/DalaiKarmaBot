import path from "node:path";

export type PlanItem =
  | { type: "writeFile"; path: string; description: string }
  | { type: "removePath"; path: string; description: string };

export function getPaths(cwd: string) {
  return {
    cwd,
    configPath: path.join(cwd, "dalaikarmabot.config.json")
  };
}

export function buildInitPlan(cwd: string): PlanItem[] {
  const p = getPaths(cwd);
  return [{ type: "writeFile", path: p.configPath, description: "Write config file" }];
}

export function buildCleanupPlan(cwd: string): PlanItem[] {
  const p = getPaths(cwd);
  return [{ type: "removePath", path: p.configPath, description: "Remove config file" }];
}
