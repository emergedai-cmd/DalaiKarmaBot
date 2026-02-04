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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAcpClient = createAcpClient;
exports.runAcpClientInteractive = runAcpClientInteractive;
var sdk_1 = require("@agentclientprotocol/sdk");
var node_child_process_1 = require("node:child_process");
var readline = require("node:readline");
var node_stream_1 = require("node:stream");
var path_env_js_1 = require("../infra/path-env.js");
function toArgs(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}
function buildServerArgs(opts) {
    var args = __spreadArray(["acp"], toArgs(opts.serverArgs), true);
    if (opts.serverVerbose && !args.includes("--verbose") && !args.includes("-v")) {
        args.push("--verbose");
    }
    return args;
}
function printSessionUpdate(notification) {
    var _a, _b;
    var update = notification.update;
    if (!("sessionUpdate" in update)) {
        return;
    }
    switch (update.sessionUpdate) {
        case "agent_message_chunk": {
            if (((_a = update.content) === null || _a === void 0 ? void 0 : _a.type) === "text") {
                process.stdout.write(update.content.text);
            }
            return;
        }
        case "tool_call": {
            console.log("\n[tool] ".concat(update.title, " (").concat(update.status, ")"));
            return;
        }
        case "tool_call_update": {
            if (update.status) {
                console.log("[tool update] ".concat(update.toolCallId, ": ").concat(update.status));
            }
            return;
        }
        case "available_commands_update": {
            var names = (_b = update.availableCommands) === null || _b === void 0 ? void 0 : _b.map(function (cmd) { return "/".concat(cmd.name); }).join(" ");
            if (names) {
                console.log("\n[commands] ".concat(names));
            }
            return;
        }
        default:
            return;
    }
}
function createAcpClient() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var cwd, verbose, log, serverCommand, serverArgs, agent, input, output, stream, client, session;
        var _this = this;
        var _a, _b;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cwd = (_a = opts.cwd) !== null && _a !== void 0 ? _a : process.cwd();
                    verbose = Boolean(opts.verbose);
                    log = verbose ? function (msg) { return console.error("[acp-client] ".concat(msg)); } : function () { };
                    (0, path_env_js_1.ensureOpenClawCliOnPath)({ cwd: cwd });
                    serverCommand = (_b = opts.serverCommand) !== null && _b !== void 0 ? _b : "openclaw";
                    serverArgs = buildServerArgs(opts);
                    log("spawning: ".concat(serverCommand, " ").concat(serverArgs.join(" ")));
                    agent = (0, node_child_process_1.spawn)(serverCommand, serverArgs, {
                        stdio: ["pipe", "pipe", "inherit"],
                        cwd: cwd,
                    });
                    if (!agent.stdin || !agent.stdout) {
                        throw new Error("Failed to create ACP stdio pipes");
                    }
                    input = node_stream_1.Writable.toWeb(agent.stdin);
                    output = node_stream_1.Readable.toWeb(agent.stdout);
                    stream = (0, sdk_1.ndJsonStream)(input, output);
                    client = new sdk_1.ClientSideConnection(function () { return ({
                        sessionUpdate: function (params) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                printSessionUpdate(params);
                                return [2 /*return*/];
                            });
                        }); },
                        requestPermission: function (params) { return __awaiter(_this, void 0, void 0, function () {
                            var options, allowOnce, fallback;
                            var _a, _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                console.log("\n[permission requested]", (_b = (_a = params.toolCall) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : "tool");
                                options = (_c = params.options) !== null && _c !== void 0 ? _c : [];
                                allowOnce = options.find(function (option) { return option.kind === "allow_once"; });
                                fallback = options[0];
                                return [2 /*return*/, {
                                        outcome: {
                                            outcome: "selected",
                                            optionId: (_e = (_d = allowOnce === null || allowOnce === void 0 ? void 0 : allowOnce.optionId) !== null && _d !== void 0 ? _d : fallback === null || fallback === void 0 ? void 0 : fallback.optionId) !== null && _e !== void 0 ? _e : "allow",
                                        },
                                    }];
                            });
                        }); },
                    }); }, stream);
                    log("initializing");
                    return [4 /*yield*/, client.initialize({
                            protocolVersion: sdk_1.PROTOCOL_VERSION,
                            clientCapabilities: {
                                fs: { readTextFile: true, writeTextFile: true },
                                terminal: true,
                            },
                            clientInfo: { name: "openclaw-acp-client", version: "1.0.0" },
                        })];
                case 1:
                    _c.sent();
                    log("creating session");
                    return [4 /*yield*/, client.newSession({
                            cwd: cwd,
                            mcpServers: [],
                        })];
                case 2:
                    session = _c.sent();
                    return [2 /*return*/, {
                            client: client,
                            agent: agent,
                            sessionId: session.sessionId,
                        }];
            }
        });
    });
}
function runAcpClientInteractive() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var _a, client, agent, sessionId, rl, prompt;
        var _this = this;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, createAcpClient(opts)];
                case 1:
                    _a = _b.sent(), client = _a.client, agent = _a.agent, sessionId = _a.sessionId;
                    rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    });
                    console.log("OpenClaw ACP client");
                    console.log("Session: ".concat(sessionId));
                    console.log('Type a prompt, or "exit" to quit.\n');
                    prompt = function () {
                        rl.question("> ", function (input) { return __awaiter(_this, void 0, void 0, function () {
                            var text, response, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        text = input.trim();
                                        if (!text) {
                                            prompt();
                                            return [2 /*return*/];
                                        }
                                        if (text === "exit" || text === "quit") {
                                            agent.kill();
                                            rl.close();
                                            process.exit(0);
                                        }
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, client.prompt({
                                                sessionId: sessionId,
                                                prompt: [{ type: "text", text: text }],
                                            })];
                                    case 2:
                                        response = _a.sent();
                                        console.log("\n[".concat(response.stopReason, "]\n"));
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_1 = _a.sent();
                                        console.error("\n[error] ".concat(String(err_1), "\n"));
                                        return [3 /*break*/, 4];
                                    case 4:
                                        prompt();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    prompt();
                    agent.on("exit", function (code) {
                        console.log("\nAgent exited with code ".concat(code !== null && code !== void 0 ? code : 0));
                        rl.close();
                        process.exit(code !== null && code !== void 0 ? code : 0);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
