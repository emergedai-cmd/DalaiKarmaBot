"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSystemdUnavailableDetail = isSystemdUnavailableDetail;
exports.renderSystemdUnavailableHints = renderSystemdUnavailableHints;
var command_format_js_1 = require("../cli/command-format.js");
function isSystemdUnavailableDetail(detail) {
    if (!detail) {
        return false;
    }
    var normalized = detail.toLowerCase();
    return (normalized.includes("systemctl --user unavailable") ||
        normalized.includes("systemctl not available") ||
        normalized.includes("not been booted with systemd") ||
        normalized.includes("failed to connect to bus") ||
        normalized.includes("systemd user services are required"));
}
function renderSystemdUnavailableHints(options) {
    if (options === void 0) { options = {}; }
    if (options.wsl) {
        return [
            "WSL2 needs systemd enabled: edit /etc/wsl.conf with [boot]\\nsystemd=true",
            "Then run: wsl --shutdown (from PowerShell) and reopen your distro.",
            "Verify: systemctl --user status",
        ];
    }
    return [
        "systemd user services are unavailable; install/enable systemd or run the gateway under your supervisor.",
        "If you're in a container, run the gateway in the foreground instead of `".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway"), "`."),
    ];
}
