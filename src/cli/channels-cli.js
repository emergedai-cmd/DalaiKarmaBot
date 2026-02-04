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
exports.registerChannelsCli = registerChannelsCli;
var channels_js_1 = require("../commands/channels.js");
var globals_js_1 = require("../globals.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var channel_auth_js_1 = require("./channel-auth.js");
var channel_options_js_1 = require("./channel-options.js");
var cli_utils_js_1 = require("./cli-utils.js");
var command_options_js_1 = require("./command-options.js");
var optionNamesAdd = [
    "channel",
    "account",
    "name",
    "token",
    "tokenFile",
    "botToken",
    "appToken",
    "signalNumber",
    "cliPath",
    "dbPath",
    "service",
    "region",
    "authDir",
    "httpUrl",
    "httpHost",
    "httpPort",
    "webhookPath",
    "webhookUrl",
    "audienceType",
    "audience",
    "useEnv",
    "homeserver",
    "userId",
    "accessToken",
    "password",
    "deviceName",
    "initialSyncLimit",
    "ship",
    "url",
    "code",
    "groupChannels",
    "dmAllowlist",
    "autoDiscoverChannels",
];
var optionNamesRemove = ["channel", "account", "delete"];
function runChannelsCommand(action) {
    return (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, action);
}
function runChannelsCommandWithDanger(action, label) {
    return (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, action, function (err) {
        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("".concat(label, ": ").concat(String(err))));
        runtime_js_1.defaultRuntime.exit(1);
    });
}
function registerChannelsCli(program) {
    var _this = this;
    var channelNames = (0, channel_options_js_1.formatCliChannelOptions)();
    var channels = program
        .command("channels")
        .description("Manage chat channel accounts")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/channels", "docs.openclaw.ai/cli/channels"), "\n");
    });
    channels
        .command("list")
        .description("List configured channels + auth profiles")
        .option("--no-usage", "Skip model provider usage/quota snapshots")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runChannelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, channels_js_1.channelsListCommand)(opts, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    channels
        .command("status")
        .description("Show gateway channel status (use status --deep for local)")
        .option("--probe", "Probe channel credentials", false)
        .option("--timeout <ms>", "Timeout in ms", "10000")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runChannelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, channels_js_1.channelsStatusCommand)(opts, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    channels
        .command("capabilities")
        .description("Show provider capabilities (intents/scopes + supported features)")
        .option("--channel <name>", "Channel (".concat((0, channel_options_js_1.formatCliChannelOptions)(["all"]), ")"))
        .option("--account <id>", "Account id (only with --channel)")
        .option("--target <dest>", "Channel target for permission audit (Discord channel:<id>)")
        .option("--timeout <ms>", "Timeout in ms", "10000")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runChannelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, channels_js_1.channelsCapabilitiesCommand)(opts, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    channels
        .command("resolve")
        .description("Resolve channel/user names to IDs")
        .argument("<entries...>", "Entries to resolve (names or ids)")
        .option("--channel <name>", "Channel (".concat(channelNames, ")"))
        .option("--account <id>", "Account id (accountId)")
        .option("--kind <kind>", "Target kind (auto|user|group)", "auto")
        .option("--json", "Output JSON", false)
        .action(function (entries, opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runChannelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, channels_js_1.channelsResolveCommand)({
                                        channel: opts.channel,
                                        account: opts.account,
                                        kind: opts.kind,
                                        json: Boolean(opts.json),
                                        entries: Array.isArray(entries) ? entries : [String(entries)],
                                    }, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    channels
        .command("logs")
        .description("Show recent channel logs from the gateway log file")
        .option("--channel <name>", "Channel (".concat((0, channel_options_js_1.formatCliChannelOptions)(["all"]), ")"), "all")
        .option("--lines <n>", "Number of lines (default: 200)", "200")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runChannelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, channels_js_1.channelsLogsCommand)(opts, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    channels
        .command("add")
        .description("Add or update a channel account")
        .option("--channel <name>", "Channel (".concat(channelNames, ")"))
        .option("--account <id>", "Account id (default when omitted)")
        .option("--name <name>", "Display name for this account")
        .option("--token <token>", "Bot token (Telegram/Discord)")
        .option("--token-file <path>", "Bot token file (Telegram)")
        .option("--bot-token <token>", "Slack bot token (xoxb-...)")
        .option("--app-token <token>", "Slack app token (xapp-...)")
        .option("--signal-number <e164>", "Signal account number (E.164)")
        .option("--cli-path <path>", "CLI path (signal-cli or imsg)")
        .option("--db-path <path>", "iMessage database path")
        .option("--service <service>", "iMessage service (imessage|sms|auto)")
        .option("--region <region>", "iMessage region (for SMS)")
        .option("--auth-dir <path>", "WhatsApp auth directory override")
        .option("--http-url <url>", "Signal HTTP daemon base URL")
        .option("--http-host <host>", "Signal HTTP host")
        .option("--http-port <port>", "Signal HTTP port")
        .option("--webhook-path <path>", "Webhook path (Google Chat/BlueBubbles)")
        .option("--webhook-url <url>", "Google Chat webhook URL")
        .option("--audience-type <type>", "Google Chat audience type (app-url|project-number)")
        .option("--audience <value>", "Google Chat audience value (app URL or project number)")
        .option("--homeserver <url>", "Matrix homeserver URL")
        .option("--user-id <id>", "Matrix user ID")
        .option("--access-token <token>", "Matrix access token")
        .option("--password <password>", "Matrix password")
        .option("--device-name <name>", "Matrix device name")
        .option("--initial-sync-limit <n>", "Matrix initial sync limit")
        .option("--ship <ship>", "Tlon ship name (~sampel-palnet)")
        .option("--url <url>", "Tlon ship URL")
        .option("--code <code>", "Tlon login code")
        .option("--group-channels <list>", "Tlon group channels (comma-separated)")
        .option("--dm-allowlist <list>", "Tlon DM allowlist (comma-separated ships)")
        .option("--auto-discover-channels", "Tlon auto-discover group channels")
        .option("--no-auto-discover-channels", "Disable Tlon auto-discovery")
        .option("--use-env", "Use env token (default account only)", false)
        .action(function (opts, command) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runChannelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        var hasFlags;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    hasFlags = (0, command_options_js_1.hasExplicitOptions)(command, optionNamesAdd);
                                    return [4 /*yield*/, (0, channels_js_1.channelsAddCommand)(opts, runtime_js_1.defaultRuntime, { hasFlags: hasFlags })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    channels
        .command("remove")
        .description("Disable or delete a channel account")
        .option("--channel <name>", "Channel (".concat(channelNames, ")"))
        .option("--account <id>", "Account id (default when omitted)")
        .option("--delete", "Delete config entries (no prompt)", false)
        .action(function (opts, command) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runChannelsCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                        var hasFlags;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    hasFlags = (0, command_options_js_1.hasExplicitOptions)(command, optionNamesRemove);
                                    return [4 /*yield*/, (0, channels_js_1.channelsRemoveCommand)(opts, runtime_js_1.defaultRuntime, { hasFlags: hasFlags })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    channels
        .command("login")
        .description("Link a channel account (if supported)")
        .option("--channel <channel>", "Channel alias (default: whatsapp)")
        .option("--account <id>", "Account id (accountId)")
        .option("--verbose", "Verbose connection logs", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runChannelsCommandWithDanger(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, channel_auth_js_1.runChannelLogin)({
                                        channel: opts.channel,
                                        account: opts.account,
                                        verbose: Boolean(opts.verbose),
                                    }, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, "Channel login failed")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    channels
        .command("logout")
        .description("Log out of a channel session (if supported)")
        .option("--channel <channel>", "Channel alias (default: whatsapp)")
        .option("--account <id>", "Account id (accountId)")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runChannelsCommandWithDanger(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, channel_auth_js_1.runChannelLogout)({
                                        channel: opts.channel,
                                        account: opts.account,
                                    }, runtime_js_1.defaultRuntime)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, "Channel logout failed")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
