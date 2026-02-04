"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCliAgent = exports.runClaudeCliAgent = void 0;
// Backwards-compatible entry point.
// Implementation lives in `src/agents/cli-runner.ts` (so we can reuse the same runner for other CLIs).
var cli_runner_js_1 = require("./cli-runner.js");
Object.defineProperty(exports, "runClaudeCliAgent", { enumerable: true, get: function () { return cli_runner_js_1.runClaudeCliAgent; } });
Object.defineProperty(exports, "runCliAgent", { enumerable: true, get: function () { return cli_runner_js_1.runCliAgent; } });
