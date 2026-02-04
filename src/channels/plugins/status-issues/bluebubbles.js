"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectBlueBubblesStatusIssues = collectBlueBubblesStatusIssues;
var shared_js_1 = require("./shared.js");
function readBlueBubblesAccountStatus(value) {
    if (!(0, shared_js_1.isRecord)(value)) {
        return null;
    }
    return {
        accountId: value.accountId,
        enabled: value.enabled,
        configured: value.configured,
        running: value.running,
        baseUrl: value.baseUrl,
        lastError: value.lastError,
        probe: value.probe,
    };
}
function readBlueBubblesProbeResult(value) {
    var _a;
    if (!(0, shared_js_1.isRecord)(value)) {
        return null;
    }
    return {
        ok: typeof value.ok === "boolean" ? value.ok : undefined,
        status: typeof value.status === "number" ? value.status : null,
        error: (_a = (0, shared_js_1.asString)(value.error)) !== null && _a !== void 0 ? _a : null,
    };
}
function collectBlueBubblesStatusIssues(accounts) {
    var _a;
    var issues = [];
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var entry = accounts_1[_i];
        var account = readBlueBubblesAccountStatus(entry);
        if (!account) {
            continue;
        }
        var accountId = (_a = (0, shared_js_1.asString)(account.accountId)) !== null && _a !== void 0 ? _a : "default";
        var enabled = account.enabled !== false;
        if (!enabled) {
            continue;
        }
        var configured = account.configured === true;
        var running = account.running === true;
        var lastError = (0, shared_js_1.asString)(account.lastError);
        var probe = readBlueBubblesProbeResult(account.probe);
        // Check for unconfigured accounts
        if (!configured) {
            issues.push({
                channel: "bluebubbles",
                accountId: accountId,
                kind: "config",
                message: "Not configured (missing serverUrl or password).",
                fix: "Run: openclaw channels add bluebubbles --http-url <server-url> --password <password>",
            });
            continue;
        }
        // Check for probe failures
        if (probe && probe.ok === false) {
            var errorDetail = probe.error
                ? ": ".concat(probe.error)
                : probe.status
                    ? " (HTTP ".concat(probe.status, ")")
                    : "";
            issues.push({
                channel: "bluebubbles",
                accountId: accountId,
                kind: "runtime",
                message: "BlueBubbles server unreachable".concat(errorDetail),
                fix: "Check that the BlueBubbles server is running and accessible. Verify serverUrl and password in your config.",
            });
        }
        // Check for runtime errors
        if (running && lastError) {
            issues.push({
                channel: "bluebubbles",
                accountId: accountId,
                kind: "runtime",
                message: "Channel error: ".concat(lastError),
                fix: "Check gateway logs for details. If the webhook is failing, verify the webhook URL is configured in BlueBubbles server settings.",
            });
        }
    }
    return issues;
}
