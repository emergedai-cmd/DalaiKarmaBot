"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveUserPath = resolveUserPath;
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
function resolveUserPath(input) {
    var trimmed = input.trim();
    if (!trimmed) {
        return trimmed;
    }
    if (trimmed.startsWith("~")) {
        var expanded = trimmed.replace(/^~(?=$|[\\/])/, node_os_1.default.homedir());
        return node_path_1.default.resolve(expanded);
    }
    return node_path_1.default.resolve(trimmed);
}
