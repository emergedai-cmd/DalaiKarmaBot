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
exports.commandRegistry = void 0;
exports.registerProgramCommands = registerProgramCommands;
exports.findRoutedCommand = findRoutedCommand;
var agents_js_1 = require("../../commands/agents.js");
var health_js_1 = require("../../commands/health.js");
var sessions_js_1 = require("../../commands/sessions.js");
var status_js_1 = require("../../commands/status.js");
var runtime_js_1 = require("../../runtime.js");
var argv_js_1 = require("../argv.js");
var browser_cli_js_1 = require("../browser-cli.js");
var config_cli_js_1 = require("../config-cli.js");
var memory_cli_js_1 = require("../memory-cli.js");
var register_agent_js_1 = require("./register.agent.js");
var register_configure_js_1 = require("./register.configure.js");
var register_maintenance_js_1 = require("./register.maintenance.js");
var register_message_js_1 = require("./register.message.js");
var register_onboard_js_1 = require("./register.onboard.js");
var register_setup_js_1 = require("./register.setup.js");
var register_status_health_sessions_js_1 = require("./register.status-health-sessions.js");
var register_subclis_js_1 = require("./register.subclis.js");
var routeHealth = {
    match: function (path) { return path[0] === "health"; },
    loadPlugins: true,
    run: function (argv) { return __awaiter(void 0, void 0, void 0, function () {
        var json, verbose, timeoutMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    json = (0, argv_js_1.hasFlag)(argv, "--json");
                    verbose = (0, argv_js_1.getVerboseFlag)(argv, { includeDebug: true });
                    timeoutMs = (0, argv_js_1.getPositiveIntFlagValue)(argv, "--timeout");
                    if (timeoutMs === null) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, (0, health_js_1.healthCommand)({ json: json, timeoutMs: timeoutMs, verbose: verbose }, runtime_js_1.defaultRuntime)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    }); },
};
var routeStatus = {
    match: function (path) { return path[0] === "status"; },
    loadPlugins: true,
    run: function (argv) { return __awaiter(void 0, void 0, void 0, function () {
        var json, deep, all, usage, verbose, timeoutMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    json = (0, argv_js_1.hasFlag)(argv, "--json");
                    deep = (0, argv_js_1.hasFlag)(argv, "--deep");
                    all = (0, argv_js_1.hasFlag)(argv, "--all");
                    usage = (0, argv_js_1.hasFlag)(argv, "--usage");
                    verbose = (0, argv_js_1.getVerboseFlag)(argv, { includeDebug: true });
                    timeoutMs = (0, argv_js_1.getPositiveIntFlagValue)(argv, "--timeout");
                    if (timeoutMs === null) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, (0, status_js_1.statusCommand)({ json: json, deep: deep, all: all, usage: usage, timeoutMs: timeoutMs, verbose: verbose }, runtime_js_1.defaultRuntime)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    }); },
};
var routeSessions = {
    match: function (path) { return path[0] === "sessions"; },
    run: function (argv) { return __awaiter(void 0, void 0, void 0, function () {
        var json, store, active;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    json = (0, argv_js_1.hasFlag)(argv, "--json");
                    store = (0, argv_js_1.getFlagValue)(argv, "--store");
                    if (store === null) {
                        return [2 /*return*/, false];
                    }
                    active = (0, argv_js_1.getFlagValue)(argv, "--active");
                    if (active === null) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, (0, sessions_js_1.sessionsCommand)({ json: json, store: store, active: active }, runtime_js_1.defaultRuntime)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    }); },
};
var routeAgentsList = {
    match: function (path) { return path[0] === "agents" && path[1] === "list"; },
    run: function (argv) { return __awaiter(void 0, void 0, void 0, function () {
        var json, bindings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    json = (0, argv_js_1.hasFlag)(argv, "--json");
                    bindings = (0, argv_js_1.hasFlag)(argv, "--bindings");
                    return [4 /*yield*/, (0, agents_js_1.agentsListCommand)({ json: json, bindings: bindings }, runtime_js_1.defaultRuntime)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    }); },
};
var routeMemoryStatus = {
    match: function (path) { return path[0] === "memory" && path[1] === "status"; },
    run: function (argv) { return __awaiter(void 0, void 0, void 0, function () {
        var agent, json, deep, index, verbose;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    agent = (0, argv_js_1.getFlagValue)(argv, "--agent");
                    if (agent === null) {
                        return [2 /*return*/, false];
                    }
                    json = (0, argv_js_1.hasFlag)(argv, "--json");
                    deep = (0, argv_js_1.hasFlag)(argv, "--deep");
                    index = (0, argv_js_1.hasFlag)(argv, "--index");
                    verbose = (0, argv_js_1.hasFlag)(argv, "--verbose");
                    return [4 /*yield*/, (0, memory_cli_js_1.runMemoryStatus)({ agent: agent, json: json, deep: deep, index: index, verbose: verbose })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    }); },
};
exports.commandRegistry = [
    {
        id: "setup",
        register: function (_a) {
            var program = _a.program;
            return (0, register_setup_js_1.registerSetupCommand)(program);
        },
    },
    {
        id: "onboard",
        register: function (_a) {
            var program = _a.program;
            return (0, register_onboard_js_1.registerOnboardCommand)(program);
        },
    },
    {
        id: "configure",
        register: function (_a) {
            var program = _a.program;
            return (0, register_configure_js_1.registerConfigureCommand)(program);
        },
    },
    {
        id: "config",
        register: function (_a) {
            var program = _a.program;
            return (0, config_cli_js_1.registerConfigCli)(program);
        },
    },
    {
        id: "maintenance",
        register: function (_a) {
            var program = _a.program;
            return (0, register_maintenance_js_1.registerMaintenanceCommands)(program);
        },
    },
    {
        id: "message",
        register: function (_a) {
            var program = _a.program, ctx = _a.ctx;
            return (0, register_message_js_1.registerMessageCommands)(program, ctx);
        },
    },
    {
        id: "memory",
        register: function (_a) {
            var program = _a.program;
            return (0, memory_cli_js_1.registerMemoryCli)(program);
        },
        routes: [routeMemoryStatus],
    },
    {
        id: "agent",
        register: function (_a) {
            var program = _a.program, ctx = _a.ctx;
            return (0, register_agent_js_1.registerAgentCommands)(program, { agentChannelOptions: ctx.agentChannelOptions });
        },
        routes: [routeAgentsList],
    },
    {
        id: "subclis",
        register: function (_a) {
            var program = _a.program, argv = _a.argv;
            return (0, register_subclis_js_1.registerSubCliCommands)(program, argv);
        },
    },
    {
        id: "status-health-sessions",
        register: function (_a) {
            var program = _a.program;
            return (0, register_status_health_sessions_js_1.registerStatusHealthSessionsCommands)(program);
        },
        routes: [routeHealth, routeStatus, routeSessions],
    },
    {
        id: "browser",
        register: function (_a) {
            var program = _a.program;
            return (0, browser_cli_js_1.registerBrowserCli)(program);
        },
    },
];
function registerProgramCommands(program, ctx, argv) {
    if (argv === void 0) { argv = process.argv; }
    for (var _i = 0, commandRegistry_1 = exports.commandRegistry; _i < commandRegistry_1.length; _i++) {
        var entry = commandRegistry_1[_i];
        entry.register({ program: program, ctx: ctx, argv: argv });
    }
}
function findRoutedCommand(path) {
    for (var _i = 0, commandRegistry_2 = exports.commandRegistry; _i < commandRegistry_2.length; _i++) {
        var entry = commandRegistry_2[_i];
        if (!entry.routes) {
            continue;
        }
        for (var _a = 0, _b = entry.routes; _a < _b.length; _a++) {
            var route = _b[_a];
            if (route.match(path)) {
                return route;
            }
        }
    }
    return null;
}
