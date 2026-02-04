#!/usr/bin/env node
// DalaiKarmaBot wrapper around OpenClaw runtime.
// Sets branding env vars while keeping upstream behavior intact.
import process from "node:process";
import os from "node:os";
import path from "node:path";

process.env.DALAIKARMABOT_BRAND = process.env.DALAIKARMABOT_BRAND || "DalaiKarmaBot";
process.env.DALAIKARMABOT_LOG_PREFIX = process.env.DALAIKARMABOT_LOG_PREFIX || "dalaikarmabot";

// Default DalaiKarmaBot state dir (keeps OpenClaw config compatibility while renaming).
// Users can override with OPENCLAW_STATE_DIR / OPENCLAW_CONFIG_PATH.
if (!process.env.OPENCLAW_STATE_DIR && !process.env.CLAWDBOT_STATE_DIR) {
  process.env.OPENCLAW_STATE_DIR = path.join(os.homedir(), ".dalaikarmabot");
}

// Prefer DalaiKarmaBot config in the same state dir unless the user overrides.
if (!process.env.OPENCLAW_CONFIG_PATH && !process.env.CLAWDBOT_CONFIG_PATH) {
  const stateDir = process.env.OPENCLAW_STATE_DIR || path.join(os.homedir(), ".dalaikarmabot");
  process.env.OPENCLAW_CONFIG_PATH = path.join(stateDir, "openclaw.json");
}

// Fall back to upstream env names for compatibility.
process.env.OPENCLAW_BRAND = process.env.OPENCLAW_BRAND || process.env.DALAIKARMABOT_BRAND;

import "./dist/entry.js";
