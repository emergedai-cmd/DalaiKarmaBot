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
exports.registerTuiCli = registerTuiCli;
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var tui_js_1 = require("../tui/tui.js");
var parse_timeout_js_1 = require("./parse-timeout.js");
function registerTuiCli(program) {
    var _this = this;
    program
        .command("tui")
        .description("Open a terminal UI connected to the Gateway")
        .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
        .option("--token <token>", "Gateway token (if required)")
        .option("--password <password>", "Gateway password (if required)")
        .option("--session <key>", 'Session key (default: "main", or "global" when scope is global)')
        .option("--deliver", "Deliver assistant replies", false)
        .option("--thinking <level>", "Thinking level override")
        .option("--message <text>", "Send an initial message after connecting")
        .option("--timeout-ms <ms>", "Agent timeout in ms (defaults to agents.defaults.timeoutSeconds)")
        .option("--history-limit <n>", "History entries to load", "200")
        .addHelpText("after", function () { return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/tui", "docs.openclaw.ai/cli/tui"), "\n"); })
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var timeoutMs, historyLimit, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    timeoutMs = (0, parse_timeout_js_1.parseTimeoutMs)(opts.timeoutMs);
                    if (opts.timeoutMs !== undefined && timeoutMs === undefined) {
                        runtime_js_1.defaultRuntime.error("warning: invalid --timeout-ms \"".concat(String(opts.timeoutMs), "\"; ignoring"));
                    }
                    historyLimit = Number.parseInt(String((_a = opts.historyLimit) !== null && _a !== void 0 ? _a : "200"), 10);
                    return [4 /*yield*/, (0, tui_js_1.runTui)({
                            url: opts.url,
                            token: opts.token,
                            password: opts.password,
                            session: opts.session,
                            deliver: Boolean(opts.deliver),
                            thinking: opts.thinking,
                            message: opts.message,
                            timeoutMs: timeoutMs,
                            historyLimit: Number.isNaN(historyLimit) ? undefined : historyLimit,
                        })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    runtime_js_1.defaultRuntime.error(String(err_1));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
