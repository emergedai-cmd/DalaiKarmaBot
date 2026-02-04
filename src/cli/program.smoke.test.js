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
var vitest_1 = require("vitest");
var messageCommand = vitest_1.vi.fn();
var statusCommand = vitest_1.vi.fn();
var configureCommand = vitest_1.vi.fn();
var configureCommandWithSections = vitest_1.vi.fn();
var setupCommand = vitest_1.vi.fn();
var onboardCommand = vitest_1.vi.fn();
var callGateway = vitest_1.vi.fn();
var runChannelLogin = vitest_1.vi.fn();
var runChannelLogout = vitest_1.vi.fn();
var runTui = vitest_1.vi.fn();
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(function () {
        throw new Error("exit");
    }),
};
vitest_1.vi.mock("../commands/message.js", function () { return ({ messageCommand: messageCommand }); });
vitest_1.vi.mock("../commands/status.js", function () { return ({ statusCommand: statusCommand }); });
vitest_1.vi.mock("../commands/configure.js", function () { return ({
    CONFIGURE_WIZARD_SECTIONS: [
        "workspace",
        "model",
        "web",
        "gateway",
        "daemon",
        "channels",
        "skills",
        "health",
    ],
    configureCommand: configureCommand,
    configureCommandWithSections: configureCommandWithSections,
}); });
vitest_1.vi.mock("../commands/setup.js", function () { return ({ setupCommand: setupCommand }); });
vitest_1.vi.mock("../commands/onboard.js", function () { return ({ onboardCommand: onboardCommand }); });
vitest_1.vi.mock("../runtime.js", function () { return ({ defaultRuntime: runtime }); });
vitest_1.vi.mock("./channel-auth.js", function () { return ({ runChannelLogin: runChannelLogin, runChannelLogout: runChannelLogout }); });
vitest_1.vi.mock("../tui/tui.js", function () { return ({ runTui: runTui }); });
vitest_1.vi.mock("../gateway/call.js", function () { return ({
    callGateway: callGateway,
    randomIdempotencyKey: function () { return "idem-test"; },
    buildGatewayConnectionDetails: function () { return ({
        url: "ws://127.0.0.1:1234",
        urlSource: "test",
        message: "Gateway target: ws://127.0.0.1:1234",
    }); },
}); });
vitest_1.vi.mock("./deps.js", function () { return ({ createDefaultDeps: function () { return ({}); } }); });
var buildProgram = (await Promise.resolve().then(function () { return require("./program.js"); })).buildProgram;
(0, vitest_1.describe)("cli program (smoke)", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        runTui.mockResolvedValue(undefined);
    });
    (0, vitest_1.it)("runs message with required options", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["message", "send", "--target", "+1", "--message", "hi"], {
                            from: "user",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(messageCommand).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs message react with signal author fields", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync([
                            "message",
                            "react",
                            "--channel",
                            "signal",
                            "--target",
                            "signal:group:abc123",
                            "--message-id",
                            "1737630212345",
                            "--emoji",
                            "✅",
                            "--target-author-uuid",
                            "123e4567-e89b-12d3-a456-426614174000",
                        ], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(messageCommand).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs status command", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["status"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(statusCommand).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("registers memory command", function () {
        var program = buildProgram();
        var names = program.commands.map(function (command) { return command.name(); });
        (0, vitest_1.expect)(names).toContain("memory");
    });
    (0, vitest_1.it)("runs tui without overriding timeout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["tui"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runTui).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ timeoutMs: undefined }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs tui with explicit timeout override", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["tui", "--timeout-ms", "45000"], {
                            from: "user",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runTui).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ timeoutMs: 45000 }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns and ignores invalid tui timeout override", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["tui", "--timeout-ms", "nope"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runtime.error).toHaveBeenCalledWith('warning: invalid --timeout-ms "nope"; ignoring');
                    (0, vitest_1.expect)(runTui).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ timeoutMs: undefined }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs config alias as configure", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["config"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(configureCommand).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs setup without wizard flags", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["setup"], { from: "user" })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(setupCommand).toHaveBeenCalled();
                    (0, vitest_1.expect)(onboardCommand).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs setup wizard when wizard flags are present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["setup", "--remote-url", "ws://example"], {
                            from: "user",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onboardCommand).toHaveBeenCalled();
                    (0, vitest_1.expect)(setupCommand).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes auth api keys to onboard", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cases, _i, cases_1, entry, program;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cases = [
                        {
                            authChoice: "opencode-zen",
                            flag: "--opencode-zen-api-key",
                            key: "sk-opencode-zen-test",
                            field: "opencodeZenApiKey",
                        },
                        {
                            authChoice: "openrouter-api-key",
                            flag: "--openrouter-api-key",
                            key: "sk-openrouter-test",
                            field: "openrouterApiKey",
                        },
                        {
                            authChoice: "moonshot-api-key",
                            flag: "--moonshot-api-key",
                            key: "sk-moonshot-test",
                            field: "moonshotApiKey",
                        },
                        {
                            authChoice: "kimi-code-api-key",
                            flag: "--kimi-code-api-key",
                            key: "sk-kimi-code-test",
                            field: "kimiCodeApiKey",
                        },
                        {
                            authChoice: "synthetic-api-key",
                            flag: "--synthetic-api-key",
                            key: "sk-synthetic-test",
                            field: "syntheticApiKey",
                        },
                        {
                            authChoice: "zai-api-key",
                            flag: "--zai-api-key",
                            key: "sk-zai-test",
                            field: "zaiApiKey",
                        },
                    ];
                    _i = 0, cases_1 = cases;
                    _b.label = 1;
                case 1:
                    if (!(_i < cases_1.length)) return [3 /*break*/, 4];
                    entry = cases_1[_i];
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["onboard", "--non-interactive", "--auth-choice", entry.authChoice, entry.flag, entry.key], { from: "user" })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(onboardCommand).toHaveBeenCalledWith(vitest_1.expect.objectContaining((_a = {
                            nonInteractive: true,
                            authChoice: entry.authChoice
                        },
                        _a[entry.field] = entry.key,
                        _a)), runtime);
                    onboardCommand.mockClear();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs channels login", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["channels", "login", "--account", "work"], {
                            from: "user",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runChannelLogin).toHaveBeenCalledWith({ channel: undefined, account: "work", verbose: false }, runtime);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("runs channels logout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = buildProgram();
                    return [4 /*yield*/, program.parseAsync(["channels", "logout", "--account", "work"], {
                            from: "user",
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runChannelLogout).toHaveBeenCalledWith({ channel: undefined, account: "work" }, runtime);
                    return [2 /*return*/];
            }
        });
    }); });
});
