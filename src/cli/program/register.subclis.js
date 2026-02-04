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
exports.getSubCliEntries = getSubCliEntries;
exports.registerSubCliByName = registerSubCliByName;
exports.registerSubCliCommands = registerSubCliCommands;
var env_js_1 = require("../../infra/env.js");
var argv_js_1 = require("../argv.js");
var helpers_js_1 = require("./helpers.js");
var shouldRegisterPrimaryOnly = function (argv) {
    if ((0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_DISABLE_LAZY_SUBCOMMANDS)) {
        return false;
    }
    if ((0, argv_js_1.hasHelpOrVersion)(argv)) {
        return false;
    }
    return true;
};
var shouldEagerRegisterSubcommands = function (_argv) {
    return (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_DISABLE_LAZY_SUBCOMMANDS);
};
var loadConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mod;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../config/config.js"); })];
            case 1:
                mod = _a.sent();
                return [2 /*return*/, mod.loadConfig()];
        }
    });
}); };
var entries = [
    {
        name: "init",
        description: "Interactive installer (writes ~/.dalaikarmabot)",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../init-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerInitCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "acp",
        description: "Agent Control Protocol tools",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../acp-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerAcpCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "gateway",
        description: "Gateway control",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../gateway-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerGatewayCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "daemon",
        description: "Gateway service (legacy alias)",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../daemon-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerDaemonCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "logs",
        description: "Gateway logs",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../logs-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerLogsCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "system",
        description: "System events, heartbeat, and presence",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../system-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerSystemCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "models",
        description: "Model configuration",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../models-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerModelsCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "approvals",
        description: "Exec approvals",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../exec-approvals-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerExecApprovalsCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "nodes",
        description: "Node commands",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../nodes-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerNodesCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "devices",
        description: "Device pairing + token management",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../devices-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerDevicesCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "node",
        description: "Node control",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../node-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerNodeCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "sandbox",
        description: "Sandbox tools",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../sandbox-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerSandboxCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "tui",
        description: "Terminal UI",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../tui-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerTuiCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "cron",
        description: "Cron scheduler",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../cron-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerCronCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "dns",
        description: "DNS helpers",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../dns-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerDnsCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "docs",
        description: "Docs helpers",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../docs-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerDocsCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "hooks",
        description: "Hooks tooling",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../hooks-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerHooksCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "webhooks",
        description: "Webhook helpers",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../webhooks-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerWebhooksCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "pairing",
        description: "Pairing helpers",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var registerPluginCliCommands, _a, _b, mod;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../plugins/cli.js"); })];
                    case 1:
                        registerPluginCliCommands = (_c.sent()).registerPluginCliCommands;
                        _a = registerPluginCliCommands;
                        _b = [program];
                        return [4 /*yield*/, loadConfig()];
                    case 2:
                        _a.apply(void 0, _b.concat([_c.sent()]));
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../pairing-cli.js"); })];
                    case 3:
                        mod = _c.sent();
                        mod.registerPairingCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "plugins",
        description: "Plugin management",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod, registerPluginCliCommands, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../plugins-cli.js"); })];
                    case 1:
                        mod = _c.sent();
                        mod.registerPluginsCli(program);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../plugins/cli.js"); })];
                    case 2:
                        registerPluginCliCommands = (_c.sent()).registerPluginCliCommands;
                        _a = registerPluginCliCommands;
                        _b = [program];
                        return [4 /*yield*/, loadConfig()];
                    case 3:
                        _a.apply(void 0, _b.concat([_c.sent()]));
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "channels",
        description: "Channel management",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../channels-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerChannelsCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "directory",
        description: "Directory commands",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../directory-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerDirectoryCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "security",
        description: "Security helpers",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../security-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerSecurityCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "skills",
        description: "Skills management",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../skills-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerSkillsCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "update",
        description: "CLI update helpers",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../update-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerUpdateCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
    {
        name: "completion",
        description: "Generate shell completion script",
        register: function (program) { return __awaiter(void 0, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../completion-cli.js"); })];
                    case 1:
                        mod = _a.sent();
                        mod.registerCompletionCli(program);
                        return [2 /*return*/];
                }
            });
        }); },
    },
];
function getSubCliEntries() {
    return entries;
}
function removeCommand(program, command) {
    var commands = program.commands;
    var index = commands.indexOf(command);
    if (index >= 0) {
        commands.splice(index, 1);
    }
}
function registerSubCliByName(program, name) {
    return __awaiter(this, void 0, void 0, function () {
        var entry, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entry = entries.find(function (candidate) { return candidate.name === name; });
                    if (!entry) {
                        return [2 /*return*/, false];
                    }
                    existing = program.commands.find(function (cmd) { return cmd.name() === entry.name; });
                    if (existing) {
                        removeCommand(program, existing);
                    }
                    return [4 /*yield*/, entry.register(program)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
function registerLazyCommand(program, entry) {
    var _this = this;
    var placeholder = program.command(entry.name).description(entry.description);
    placeholder.allowUnknownOption(true);
    placeholder.allowExcessArguments(true);
    placeholder.action(function () {
        var actionArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actionArgs[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var actionCommand, root, rawArgs, actionArgsList, fallbackArgv, parseArgv;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        removeCommand(program, placeholder);
                        return [4 /*yield*/, entry.register(program)];
                    case 1:
                        _b.sent();
                        actionCommand = actionArgs.at(-1);
                        root = (_a = actionCommand === null || actionCommand === void 0 ? void 0 : actionCommand.parent) !== null && _a !== void 0 ? _a : program;
                        rawArgs = root.rawArgs;
                        actionArgsList = (0, helpers_js_1.resolveActionArgs)(actionCommand);
                        fallbackArgv = (actionCommand === null || actionCommand === void 0 ? void 0 : actionCommand.name())
                            ? __spreadArray([actionCommand.name()], actionArgsList, true) : actionArgsList;
                        parseArgv = (0, argv_js_1.buildParseArgv)({
                            programName: program.name(),
                            rawArgs: rawArgs,
                            fallbackArgv: fallbackArgv,
                        });
                        return [4 /*yield*/, program.parseAsync(parseArgv)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
}
function registerSubCliCommands(program, argv) {
    if (argv === void 0) { argv = process.argv; }
    if (shouldEagerRegisterSubcommands(argv)) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            void entry.register(program);
        }
        return;
    }
    var primary = (0, argv_js_1.getPrimaryCommand)(argv);
    if (primary && shouldRegisterPrimaryOnly(argv)) {
        var entry = entries.find(function (candidate) { return candidate.name === primary; });
        if (entry) {
            registerLazyCommand(program, entry);
            return;
        }
    }
    for (var _a = 0, entries_2 = entries; _a < entries_2.length; _a++) {
        var candidate = entries_2[_a];
        registerLazyCommand(program, candidate);
    }
}
