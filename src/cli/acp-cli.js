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
exports.registerAcpCli = registerAcpCli;
var client_js_1 = require("../acp/client.js");
var server_js_1 = require("../acp/server.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
function registerAcpCli(program) {
    var _this = this;
    var acp = program.command("acp").description("Run an ACP bridge backed by the Gateway");
    acp
        .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
        .option("--token <token>", "Gateway token (if required)")
        .option("--password <password>", "Gateway password (if required)")
        .option("--session <key>", "Default session key (e.g. agent:main:main)")
        .option("--session-label <label>", "Default session label to resolve")
        .option("--require-existing", "Fail if the session key/label does not exist", false)
        .option("--reset-session", "Reset the session key before first use", false)
        .option("--no-prefix-cwd", "Do not prefix prompts with the working directory", false)
        .option("--verbose, -v", "Verbose logging to stderr", false)
        .addHelpText("after", function () { return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/acp", "docs.openclaw.ai/cli/acp"), "\n"); })
        .action(function (opts) {
        try {
            (0, server_js_1.serveAcpGateway)({
                gatewayUrl: opts.url,
                gatewayToken: opts.token,
                gatewayPassword: opts.password,
                defaultSessionKey: opts.session,
                defaultSessionLabel: opts.sessionLabel,
                requireExistingSession: Boolean(opts.requireExisting),
                resetSession: Boolean(opts.resetSession),
                prefixCwd: !opts.noPrefixCwd,
                verbose: Boolean(opts.verbose),
            });
        }
        catch (err) {
            runtime_js_1.defaultRuntime.error(String(err));
            runtime_js_1.defaultRuntime.exit(1);
        }
    });
    acp
        .command("client")
        .description("Run an interactive ACP client against the local ACP bridge")
        .option("--cwd <dir>", "Working directory for the ACP session")
        .option("--server <command>", "ACP server command (default: openclaw)")
        .option("--server-args <args...>", "Extra arguments for the ACP server")
        .option("--server-verbose", "Enable verbose logging on the ACP server", false)
        .option("--verbose, -v", "Verbose client logging", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, client_js_1.runAcpClientInteractive)({
                            cwd: opts.cwd,
                            serverCommand: opts.server,
                            serverArgs: opts.serverArgs,
                            serverVerbose: Boolean(opts.serverVerbose),
                            verbose: Boolean(opts.verbose),
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    runtime_js_1.defaultRuntime.error(String(err_1));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
