"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectWhatsAppStatusIssues = collectWhatsAppStatusIssues;
var command_format_js_1 = require("../../../cli/command-format.js");
var shared_js_1 = require("./shared.js");
function readWhatsAppAccountStatus(value) {
    if (!(0, shared_js_1.isRecord)(value)) {
        return null;
    }
    return {
        accountId: value.accountId,
        enabled: value.enabled,
        linked: value.linked,
        connected: value.connected,
        running: value.running,
        reconnectAttempts: value.reconnectAttempts,
        lastError: value.lastError,
    };
}
function collectWhatsAppStatusIssues(accounts) {
    var _a;
    var issues = [];
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var entry = accounts_1[_i];
        var account = readWhatsAppAccountStatus(entry);
        if (!account) {
            continue;
        }
        var accountId = (_a = (0, shared_js_1.asString)(account.accountId)) !== null && _a !== void 0 ? _a : "default";
        var enabled = account.enabled !== false;
        if (!enabled) {
            continue;
        }
        var linked = account.linked === true;
        var running = account.running === true;
        var connected = account.connected === true;
        var reconnectAttempts = typeof account.reconnectAttempts === "number" ? account.reconnectAttempts : null;
        var lastError = (0, shared_js_1.asString)(account.lastError);
        if (!linked) {
            issues.push({
                channel: "whatsapp",
                accountId: accountId,
                kind: "auth",
                message: "Not linked (no WhatsApp Web session).",
                fix: "Run: ".concat((0, command_format_js_1.formatCliCommand)("openclaw channels login"), " (scan QR on the gateway host)."),
            });
            continue;
        }
        if (running && !connected) {
            issues.push({
                channel: "whatsapp",
                accountId: accountId,
                kind: "runtime",
                message: "Linked but disconnected".concat(reconnectAttempts != null ? " (reconnectAttempts=".concat(reconnectAttempts, ")") : "").concat(lastError ? ": ".concat(lastError) : "."),
                fix: "Run: ".concat((0, command_format_js_1.formatCliCommand)("openclaw doctor"), " (or restart the gateway). If it persists, relink via channels login and check logs."),
            });
        }
    }
    return issues;
}
