"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWebhooksCli = registerWebhooksCli;
var globals_js_1 = require("../globals.js");
var gmail_ops_js_1 = require("../hooks/gmail-ops.js");
var gmail_js_1 = require("../hooks/gmail.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
function registerWebhooksCli(program) {
    var _this = this;
    var webhooks = program
        .command("webhooks")
        .description("Webhook helpers and integrations")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/webhooks", "docs.openclaw.ai/cli/webhooks"), "\n");
    });
    var gmail = webhooks.command("gmail").description("Gmail Pub/Sub hooks (via gogcli)");
    gmail
        .command("setup")
        .description("Configure Gmail watch + Pub/Sub + OpenClaw hooks")
        .requiredOption("--account <email>", "Gmail account to watch")
        .option("--project <id>", "GCP project id (OAuth client owner)")
        .option("--topic <name>", "Pub/Sub topic name", gmail_js_1.DEFAULT_GMAIL_TOPIC)
        .option("--subscription <name>", "Pub/Sub subscription name", gmail_js_1.DEFAULT_GMAIL_SUBSCRIPTION)
        .option("--label <label>", "Gmail label to watch", gmail_js_1.DEFAULT_GMAIL_LABEL)
        .option("--hook-url <url>", "OpenClaw hook URL")
        .option("--hook-token <token>", "OpenClaw hook token")
        .option("--push-token <token>", "Push token for gog watch serve")
        .option("--bind <host>", "gog watch serve bind host", gmail_js_1.DEFAULT_GMAIL_SERVE_BIND)
        .option("--port <port>", "gog watch serve port", String(gmail_js_1.DEFAULT_GMAIL_SERVE_PORT))
        .option("--path <path>", "gog watch serve path", gmail_js_1.DEFAULT_GMAIL_SERVE_PATH)
        .option("--include-body", "Include email body snippets", true)
        .option("--max-bytes <n>", "Max bytes for body snippets", String(gmail_js_1.DEFAULT_GMAIL_MAX_BYTES))
        .option("--renew-minutes <n>", "Renew watch every N minutes", String(gmail_js_1.DEFAULT_GMAIL_RENEW_MINUTES))
        .option("--tailscale <mode>", "Expose push endpoint via tailscale (funnel|serve|off)", "funnel")
        .option("--tailscale-path <path>", "Path for tailscale serve/funnel")
        .option("--tailscale-target <target>", "Tailscale serve/funnel target (port, host:port, or URL)")
        .option("--push-endpoint <url>", "Explicit Pub/Sub push endpoint")
        .option("--json", "Output JSON summary", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var parsed, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parsed = parseGmailSetupOptions(opts);
                    return [4 /*yield*/, (0, gmail_ops_js_1.runGmailSetup)(parsed)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    gmail
        .command("run")
        .description("Run gog watch serve + auto-renew loop")
        .option("--account <email>", "Gmail account to watch")
        .option("--topic <topic>", "Pub/Sub topic path (projects/.../topics/..)")
        .option("--subscription <name>", "Pub/Sub subscription name")
        .option("--label <label>", "Gmail label to watch")
        .option("--hook-url <url>", "OpenClaw hook URL")
        .option("--hook-token <token>", "OpenClaw hook token")
        .option("--push-token <token>", "Push token for gog watch serve")
        .option("--bind <host>", "gog watch serve bind host")
        .option("--port <port>", "gog watch serve port")
        .option("--path <path>", "gog watch serve path")
        .option("--include-body", "Include email body snippets")
        .option("--max-bytes <n>", "Max bytes for body snippets")
        .option("--renew-minutes <n>", "Renew watch every N minutes")
        .option("--tailscale <mode>", "Expose push endpoint via tailscale (funnel|serve|off)")
        .option("--tailscale-path <path>", "Path for tailscale serve/funnel")
        .option("--tailscale-target <target>", "Tailscale serve/funnel target (port, host:port, or URL)")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var parsed, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parsed = parseGmailRunOptions(opts);
                    return [4 /*yield*/, (0, gmail_ops_js_1.runGmailService)(parsed)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
function parseGmailSetupOptions(raw) {
    var accountRaw = raw.account;
    var account = typeof accountRaw === "string" ? accountRaw.trim() : "";
    if (!account) {
        throw new Error("--account is required");
    }
    return {
        account: account,
        project: stringOption(raw.project),
        topic: stringOption(raw.topic),
        subscription: stringOption(raw.subscription),
        label: stringOption(raw.label),
        hookUrl: stringOption(raw.hookUrl),
        hookToken: stringOption(raw.hookToken),
        pushToken: stringOption(raw.pushToken),
        bind: stringOption(raw.bind),
        port: numberOption(raw.port),
        path: stringOption(raw.path),
        includeBody: booleanOption(raw.includeBody),
        maxBytes: numberOption(raw.maxBytes),
        renewEveryMinutes: numberOption(raw.renewMinutes),
        tailscale: stringOption(raw.tailscale),
        tailscalePath: stringOption(raw.tailscalePath),
        tailscaleTarget: stringOption(raw.tailscaleTarget),
        pushEndpoint: stringOption(raw.pushEndpoint),
        json: Boolean(raw.json),
    };
}
function parseGmailRunOptions(raw) {
    return {
        account: stringOption(raw.account),
        topic: stringOption(raw.topic),
        subscription: stringOption(raw.subscription),
        label: stringOption(raw.label),
        hookUrl: stringOption(raw.hookUrl),
        hookToken: stringOption(raw.hookToken),
        pushToken: stringOption(raw.pushToken),
        bind: stringOption(raw.bind),
        port: numberOption(raw.port),
        path: stringOption(raw.path),
        includeBody: booleanOption(raw.includeBody),
        maxBytes: numberOption(raw.maxBytes),
        renewEveryMinutes: numberOption(raw.renewMinutes),
        tailscale: stringOption(raw.tailscale),
        tailscalePath: stringOption(raw.tailscalePath),
        tailscaleTarget: stringOption(raw.tailscaleTarget),
    };
}
function stringOption(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    var trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}
function numberOption(value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    var n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n) || n <= 0) {
        return undefined;
    }
    return Math.floor(n);
}
function booleanOption(value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    return Boolean(value);
}
