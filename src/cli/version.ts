import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function readCliVersionSafe(): string {
  try {
    const here = fileURLToPath(import.meta.url);
    const hereDir = path.dirname(here);

    // dist/cli/version.js -> go up 2 levels -> package root -> package.json
    const pkgPath = path.resolve(hereDir, "../../package.json");
    const raw = fs.readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(raw);
    return typeof pkg.version === "string" ? pkg.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}
