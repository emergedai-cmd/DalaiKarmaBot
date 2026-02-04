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
exports.registerCronEditCommand = registerCronEditCommand;
var globals_js_1 = require("../../globals.js");
var session_key_js_1 = require("../../routing/session-key.js");
var runtime_js_1 = require("../../runtime.js");
var gateway_rpc_js_1 = require("../gateway-rpc.js");
var shared_js_1 = require("./shared.js");
var assignIf = function (target, key, value, shouldAssign) {
    if (shouldAssign) {
        target[key] = value;
    }
};
function registerCronEditCommand(cron) {
    var _this = this;
    (0, gateway_rpc_js_1.addGatewayClientOptions)(cron
        .command("edit")
        .description("Edit a cron job (patch fields)")
        .argument("<id>", "Job id")
        .option("--name <name>", "Set name")
        .option("--description <text>", "Set description")
        .option("--enable", "Enable job", false)
        .option("--disable", "Disable job", false)
        .option("--delete-after-run", "Delete one-shot job after it succeeds", false)
        .option("--keep-after-run", "Keep one-shot job after it succeeds", false)
        .option("--session <target>", "Session target (main|isolated)")
        .option("--agent <id>", "Set agent id")
        .option("--clear-agent", "Unset agent and use default", false)
        .option("--wake <mode>", "Wake mode (now|next-heartbeat)")
        .option("--at <when>", "Set one-shot time (ISO) or duration like 20m")
        .option("--every <duration>", "Set interval duration like 10m")
        .option("--cron <expr>", "Set cron expression")
        .option("--tz <iana>", "Timezone for cron expressions (IANA)")
        .option("--system-event <text>", "Set systemEvent payload")
        .option("--message <text>", "Set agentTurn payload message")
        .option("--thinking <level>", "Thinking level for agent jobs")
        .option("--model <model>", "Model override for agent jobs")
        .option("--timeout-seconds <n>", "Timeout seconds for agent jobs")
        .option("--deliver", "Deliver agent output (required when using last-route delivery without --to)")
        .option("--no-deliver", "Disable delivery")
        .option("--channel <channel>", "Delivery channel (".concat((0, shared_js_1.getCronChannelOptions)(), ")"))
        .option("--to <dest>", "Delivery destination (E.164, Telegram chatId, or Discord channel/user)")
        .option("--best-effort-deliver", "Do not fail job if delivery fails")
        .option("--no-best-effort-deliver", "Fail job when delivery fails")
        .option("--post-prefix <prefix>", "Prefix for summary system event")
        .action(function (id, opts) { return __awaiter(_this, void 0, void 0, function () {
        var patch, scheduleChosen, atMs, everyMs, hasSystemEventPatch, model, thinking, timeoutSeconds, hasTimeoutSeconds, hasAgentTurnPatch, payload, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (opts.session === "main" && opts.message) {
                        throw new Error("Main jobs cannot use --message; use --system-event or --session isolated.");
                    }
                    if (opts.session === "isolated" && opts.systemEvent) {
                        throw new Error("Isolated jobs cannot use --system-event; use --message or --session main.");
                    }
                    if (opts.session === "main" && typeof opts.postPrefix === "string") {
                        throw new Error("--post-prefix only applies to isolated jobs.");
                    }
                    patch = {};
                    if (typeof opts.name === "string") {
                        patch.name = opts.name;
                    }
                    if (typeof opts.description === "string") {
                        patch.description = opts.description;
                    }
                    if (opts.enable && opts.disable) {
                        throw new Error("Choose --enable or --disable, not both");
                    }
                    if (opts.enable) {
                        patch.enabled = true;
                    }
                    if (opts.disable) {
                        patch.enabled = false;
                    }
                    if (opts.deleteAfterRun && opts.keepAfterRun) {
                        throw new Error("Choose --delete-after-run or --keep-after-run, not both");
                    }
                    if (opts.deleteAfterRun) {
                        patch.deleteAfterRun = true;
                    }
                    if (opts.keepAfterRun) {
                        patch.deleteAfterRun = false;
                    }
                    if (typeof opts.session === "string") {
                        patch.sessionTarget = opts.session;
                    }
                    if (typeof opts.wake === "string") {
                        patch.wakeMode = opts.wake;
                    }
                    if (opts.agent && opts.clearAgent) {
                        throw new Error("Use --agent or --clear-agent, not both");
                    }
                    if (typeof opts.agent === "string" && opts.agent.trim()) {
                        patch.agentId = (0, session_key_js_1.sanitizeAgentId)(opts.agent.trim());
                    }
                    if (opts.clearAgent) {
                        patch.agentId = null;
                    }
                    scheduleChosen = [opts.at, opts.every, opts.cron].filter(Boolean).length;
                    if (scheduleChosen > 1) {
                        throw new Error("Choose at most one schedule change");
                    }
                    if (opts.at) {
                        atMs = (0, shared_js_1.parseAtMs)(String(opts.at));
                        if (!atMs) {
                            throw new Error("Invalid --at");
                        }
                        patch.schedule = { kind: "at", atMs: atMs };
                    }
                    else if (opts.every) {
                        everyMs = (0, shared_js_1.parseDurationMs)(String(opts.every));
                        if (!everyMs) {
                            throw new Error("Invalid --every");
                        }
                        patch.schedule = { kind: "every", everyMs: everyMs };
                    }
                    else if (opts.cron) {
                        patch.schedule = {
                            kind: "cron",
                            expr: String(opts.cron),
                            tz: typeof opts.tz === "string" && opts.tz.trim() ? opts.tz.trim() : undefined,
                        };
                    }
                    hasSystemEventPatch = typeof opts.systemEvent === "string";
                    model = typeof opts.model === "string" && opts.model.trim() ? opts.model.trim() : undefined;
                    thinking = typeof opts.thinking === "string" && opts.thinking.trim()
                        ? opts.thinking.trim()
                        : undefined;
                    timeoutSeconds = opts.timeoutSeconds
                        ? Number.parseInt(String(opts.timeoutSeconds), 10)
                        : undefined;
                    hasTimeoutSeconds = Boolean(timeoutSeconds && Number.isFinite(timeoutSeconds));
                    hasAgentTurnPatch = typeof opts.message === "string" ||
                        Boolean(model) ||
                        Boolean(thinking) ||
                        hasTimeoutSeconds ||
                        typeof opts.deliver === "boolean" ||
                        typeof opts.channel === "string" ||
                        typeof opts.to === "string" ||
                        typeof opts.bestEffortDeliver === "boolean";
                    if (hasSystemEventPatch && hasAgentTurnPatch) {
                        throw new Error("Choose at most one payload change");
                    }
                    if (hasSystemEventPatch) {
                        patch.payload = {
                            kind: "systemEvent",
                            text: String(opts.systemEvent),
                        };
                    }
                    else if (hasAgentTurnPatch) {
                        payload = { kind: "agentTurn" };
                        assignIf(payload, "message", String(opts.message), typeof opts.message === "string");
                        assignIf(payload, "model", model, Boolean(model));
                        assignIf(payload, "thinking", thinking, Boolean(thinking));
                        assignIf(payload, "timeoutSeconds", timeoutSeconds, hasTimeoutSeconds);
                        assignIf(payload, "deliver", opts.deliver, typeof opts.deliver === "boolean");
                        assignIf(payload, "channel", opts.channel, typeof opts.channel === "string");
                        assignIf(payload, "to", opts.to, typeof opts.to === "string");
                        assignIf(payload, "bestEffortDeliver", opts.bestEffortDeliver, typeof opts.bestEffortDeliver === "boolean");
                        patch.payload = payload;
                    }
                    if (typeof opts.postPrefix === "string") {
                        patch.isolation = {
                            postToMainPrefix: opts.postPrefix.trim() ? opts.postPrefix : "Cron",
                        };
                    }
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.update", opts, {
                            id: id,
                            patch: patch,
                        })];
                case 1:
                    res = _a.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(res, null, 2));
                    return [4 /*yield*/, (0, shared_js_1.warnIfCronSchedulerDisabled)(opts)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }));
}
