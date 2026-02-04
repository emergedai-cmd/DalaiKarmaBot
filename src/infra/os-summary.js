"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOsSummary = resolveOsSummary;
var node_child_process_1 = require("node:child_process");
var node_os_1 = require("node:os");
function safeTrim(value) {
    return typeof value === "string" ? value.trim() : "";
}
function macosVersion() {
    var res = (0, node_child_process_1.spawnSync)("sw_vers", ["-productVersion"], { encoding: "utf-8" });
    var out = safeTrim(res.stdout);
    return out || node_os_1.default.release();
}
function resolveOsSummary() {
    var platform = node_os_1.default.platform();
    var release = node_os_1.default.release();
    var arch = node_os_1.default.arch();
    var label = (function () {
        if (platform === "darwin") {
            return "macos ".concat(macosVersion(), " (").concat(arch, ")");
        }
        if (platform === "win32") {
            return "windows ".concat(release, " (").concat(arch, ")");
        }
        return "".concat(platform, " ").concat(release, " (").concat(arch, ")");
    })();
    return { platform: platform, arch: arch, release: release, label: label };
}
