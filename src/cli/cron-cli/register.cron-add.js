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
exports.registerCronStatusCommand = registerCronStatusCommand;
exports.registerCronListCommand = registerCronListCommand;
exports.registerCronAddCommand = registerCronAddCommand;
var globals_js_1 = require("../../globals.js");
var session_key_js_1 = require("../../routing/session-key.js");
var runtime_js_1 = require("../../runtime.js");
var gateway_rpc_js_1 = require("../gateway-rpc.js");
var helpers_js_1 = require("../program/helpers.js");
var shared_js_1 = require("./shared.js");
function registerCronStatusCommand(cron) {
    var _this = this;
    (0, gateway_rpc_js_1.addGatewayClientOptions)(cron
        .command("status")
        .description("Show cron scheduler status")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.status", opts, {})];
                case 1:
                    res = _a.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(res, null, 2));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }));
}
function registerCronListCommand(cron) {
    var _this = this;
    (0, gateway_rpc_js_1.addGatewayClientOptions)(cron
        .command("list")
        .description("List cron jobs")
        .option("--all", "Include disabled jobs", false)
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var res, jobs, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.list", opts, {
                            includeDisabled: Boolean(opts.all),
                        })];
                case 1:
                    res = _b.sent();
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(res, null, 2));
                        return [2 /*return*/];
                    }
                    jobs = (_a = res === null || res === void 0 ? void 0 : res.jobs) !== null && _a !== void 0 ? _a : [];
                    (0, shared_js_1.printCronList)(jobs, runtime_js_1.defaultRuntime);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _b.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }));
}
function registerCronAddCommand(cron) {
    var _this = this;
    (0, gateway_rpc_js_1.addGatewayClientOptions)(cron
        .command("add")
        .alias("create")
        .description("Add a cron job")
        .requiredOption("--name <name>", "Job name")
        .option("--description <text>", "Optional description")
        .option("--disabled", "Create job disabled", false)
        .option("--delete-after-run", "Delete one-shot job after it succeeds", false)
        .option("--agent <id>", "Agent id for this job")
        .option("--session <target>", "Session target (main|isolated)", "main")
        .option("--wake <mode>", "Wake mode (now|next-heartbeat)", "next-heartbeat")
        .option("--at <when>", "Run once at time (ISO) or +duration (e.g. 20m)")
        .option("--every <duration>", "Run every duration (e.g. 10m, 1h)")
        .option("--cron <expr>", "Cron expression (5-field)")
        .option("--tz <iana>", "Timezone for cron expressions (IANA)", "")
        .option("--system-event <text>", "System event payload (main session)")
        .option("--message <text>", "Agent message payload")
        .option("--thinking <level>", "Thinking level for agent jobs (off|minimal|low|medium|high)")
        .option("--model <model>", "Model override for agent jobs (provider/model or alias)")
        .option("--timeout-seconds <n>", "Timeout seconds for agent jobs")
        .option("--deliver", "Deliver agent output (required when using last-route delivery without --to)", false)
        .option("--channel <channel>", "Delivery channel (".concat((0, shared_js_1.getCronChannelOptions)(), ")"), "last")
        .option("--to <dest>", "Delivery destination (E.164, Telegram chatId, or Discord channel/user)")
        .option("--best-effort-deliver", "Do not fail the job if delivery fails", false)
        .option("--post-prefix <prefix>", "Prefix for main-session post", "Cron")
        .option("--post-mode <mode>", "What to post back to main for isolated jobs (summary|full)", "summary")
        .option("--post-max-chars <n>", "Max chars when --post-mode=full (default 8000)", "8000")
        .option("--json", "Output JSON", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var schedule, sessionTargetRaw, sessionTarget, wakeModeRaw, wakeMode, agentId, payload, isolation, nameRaw, name_1, description, params, res, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    schedule = (function () {
                        var at = typeof opts.at === "string" ? opts.at : "";
                        var every = typeof opts.every === "string" ? opts.every : "";
                        var cronExpr = typeof opts.cron === "string" ? opts.cron : "";
                        var chosen = [Boolean(at), Boolean(every), Boolean(cronExpr)].filter(Boolean).length;
                        if (chosen !== 1) {
                            throw new Error("Choose exactly one schedule: --at, --every, or --cron");
                        }
                        if (at) {
                            var atMs = (0, shared_js_1.parseAtMs)(at);
                            if (!atMs) {
                                throw new Error("Invalid --at; use ISO time or duration like 20m");
                            }
                            return { kind: "at", atMs: atMs };
                        }
                        if (every) {
                            var everyMs = (0, shared_js_1.parseDurationMs)(every);
                            if (!everyMs) {
                                throw new Error("Invalid --every; use e.g. 10m, 1h, 1d");
                            }
                            return { kind: "every", everyMs: everyMs };
                        }
                        return {
                            kind: "cron",
                            expr: cronExpr,
                            tz: typeof opts.tz === "string" && opts.tz.trim() ? opts.tz.trim() : undefined,
                        };
                    })();
                    sessionTargetRaw = typeof opts.session === "string" ? opts.session : "main";
                    sessionTarget = sessionTargetRaw.trim() || "main";
                    if (sessionTarget !== "main" && sessionTarget !== "isolated") {
                        throw new Error("--session must be main or isolated");
                    }
                    wakeModeRaw = typeof opts.wake === "string" ? opts.wake : "next-heartbeat";
                    wakeMode = wakeModeRaw.trim() || "next-heartbeat";
                    if (wakeMode !== "now" && wakeMode !== "next-heartbeat") {
                        throw new Error("--wake must be now or next-heartbeat");
                    }
                    agentId = typeof opts.agent === "string" && opts.agent.trim()
                        ? (0, session_key_js_1.sanitizeAgentId)(opts.agent.trim())
                        : undefined;
                    payload = (function () {
                        var systemEvent = typeof opts.systemEvent === "string" ? opts.systemEvent.trim() : "";
                        var message = typeof opts.message === "string" ? opts.message.trim() : "";
                        var chosen = [Boolean(systemEvent), Boolean(message)].filter(Boolean).length;
                        if (chosen !== 1) {
                            throw new Error("Choose exactly one payload: --system-event or --message");
                        }
                        if (systemEvent) {
                            return { kind: "systemEvent", text: systemEvent };
                        }
                        var timeoutSeconds = (0, helpers_js_1.parsePositiveIntOrUndefined)(opts.timeoutSeconds);
                        return {
                            kind: "agentTurn",
                            message: message,
                            model: typeof opts.model === "string" && opts.model.trim() ? opts.model.trim() : undefined,
                            thinking: typeof opts.thinking === "string" && opts.thinking.trim()
                                ? opts.thinking.trim()
                                : undefined,
                            timeoutSeconds: timeoutSeconds && Number.isFinite(timeoutSeconds) ? timeoutSeconds : undefined,
                            deliver: opts.deliver ? true : undefined,
                            channel: typeof opts.channel === "string" ? opts.channel : "last",
                            to: typeof opts.to === "string" && opts.to.trim() ? opts.to.trim() : undefined,
                            bestEffortDeliver: opts.bestEffortDeliver ? true : undefined,
                        };
                    })();
                    if (sessionTarget === "main" && payload.kind !== "systemEvent") {
                        throw new Error("Main jobs require --system-event (systemEvent).");
                    }
                    if (sessionTarget === "isolated" && payload.kind !== "agentTurn") {
                        throw new Error("Isolated jobs require --message (agentTurn).");
                    }
                    isolation = sessionTarget === "isolated"
                        ? {
                            postToMainPrefix: typeof opts.postPrefix === "string" && opts.postPrefix.trim()
                                ? opts.postPrefix.trim()
                                : "Cron",
                            postToMainMode: opts.postMode === "full" || opts.postMode === "summary"
                                ? opts.postMode
                                : undefined,
                            postToMainMaxChars: typeof opts.postMaxChars === "string" && /^\d+$/.test(opts.postMaxChars)
                                ? Number.parseInt(opts.postMaxChars, 10)
                                : undefined,
                        }
                        : undefined;
                    nameRaw = typeof opts.name === "string" ? opts.name : "";
                    name_1 = nameRaw.trim();
                    if (!name_1) {
                        throw new Error("--name is required");
                    }
                    description = typeof opts.description === "string" && opts.description.trim()
                        ? opts.description.trim()
                        : undefined;
                    params = {
                        name: name_1,
                        description: description,
                        enabled: !opts.disabled,
                        deleteAfterRun: Boolean(opts.deleteAfterRun),
                        agentId: agentId,
                        schedule: schedule,
                        sessionTarget: sessionTarget,
                        wakeMode: wakeMode,
                        payload: payload,
                        isolation: isolation,
                    };
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)("cron.add", opts, params)];
                case 1:
                    res = _a.sent();
                    runtime_js_1.defaultRuntime.log(JSON.stringify(res, null, 2));
                    return [4 /*yield*/, (0, shared_js_1.warnIfCronSchedulerDisabled)(opts)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_3)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }));
}
