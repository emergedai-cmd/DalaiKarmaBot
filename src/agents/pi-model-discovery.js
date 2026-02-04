"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRegistry = exports.AuthStorage = void 0;
exports.discoverAuthStorage = discoverAuthStorage;
exports.discoverModels = discoverModels;
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var node_path_1 = require("node:path");
var pi_coding_agent_2 = require("@mariozechner/pi-coding-agent");
Object.defineProperty(exports, "AuthStorage", { enumerable: true, get: function () { return pi_coding_agent_2.AuthStorage; } });
Object.defineProperty(exports, "ModelRegistry", { enumerable: true, get: function () { return pi_coding_agent_2.ModelRegistry; } });
// Compatibility helpers for pi-coding-agent 0.50+ (discover* helpers removed).
function discoverAuthStorage(agentDir) {
    return new pi_coding_agent_1.AuthStorage(node_path_1.default.join(agentDir, "auth.json"));
}
function discoverModels(authStorage, agentDir) {
    return new pi_coding_agent_1.ModelRegistry(authStorage, node_path_1.default.join(agentDir, "models.json"));
}
