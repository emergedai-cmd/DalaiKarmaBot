"use strict";
/**
 * Conformance snapshot for tool policy.
 *
 * Security note:
 * - This is static, build-time information (no runtime I/O, no network exposure).
 * - Intended for CI/tools to detect drift between the implementation policy and
 *   the formal models/extractors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOL_POLICY_CONFORMANCE = void 0;
var tool_policy_js_1 = require("./tool-policy.js");
// Tool name aliases are intentionally not exported from tool-policy today.
// Keep the conformance snapshot focused on exported policy constants.
exports.TOOL_POLICY_CONFORMANCE = {
    toolGroups: tool_policy_js_1.TOOL_GROUPS,
};
