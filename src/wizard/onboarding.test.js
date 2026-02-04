"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var workspace_js_1 = require("../agents/workspace.js");
var onboarding_js_1 = require("./onboarding.js");
var setupChannels = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function (cfg) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, cfg];
}); }); }); });
var setupSkills = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function (cfg) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, cfg];
}); }); }); });
var healthCommand = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); }); });
var ensureWorkspaceAndSessions = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); }); });
var writeConfigFile = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); }); });
var readConfigFileSnapshot = vitest_1.vi.hoisted(function () {
    return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ exists: false, valid: true, config: {} })];
    }); }); });
});
var ensureSystemdUserLingerInteractive = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); }); });
var isSystemdUserServiceAvailable = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, true];
}); }); }); });
var ensureControlUiAssetsBuilt = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true })];
}); }); }); });
var runTui = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); }); });
vitest_1.vi.mock("../commands/onboard-channels.js", function () { return ({
    setupChannels: setupChannels,
}); });
vitest_1.vi.mock("../commands/onboard-skills.js", function () { return ({
    setupSkills: setupSkills,
}); });
vitest_1.vi.mock("../commands/health.js", function () { return ({
    healthCommand: healthCommand,
}); });
vitest_1.vi.mock("../config/config.js", function (importActual) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importActual()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { readConfigFileSnapshot: readConfigFileSnapshot, writeConfigFile: writeConfigFile })];
        }
    });
}); });
vitest_1.vi.mock("../commands/onboard-helpers.js", function (importActual) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importActual()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { ensureWorkspaceAndSessions: ensureWorkspaceAndSessions, detectBrowserOpenSupport: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false })];
                        }); }); }), openUrl: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, true];
                        }); }); }), printWizardHeader: vitest_1.vi.fn(), probeGatewayReachable: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true })];
                        }); }); }), resolveControlUiLinks: vitest_1.vi.fn(function () { return ({
                            httpUrl: "http://127.0.0.1:18789",
                            wsUrl: "ws://127.0.0.1:18789",
                        }); }) })];
        }
    });
}); });
vitest_1.vi.mock("../commands/systemd-linger.js", function () { return ({
    ensureSystemdUserLingerInteractive: ensureSystemdUserLingerInteractive,
}); });
vitest_1.vi.mock("../daemon/systemd.js", function () { return ({
    isSystemdUserServiceAvailable: isSystemdUserServiceAvailable,
}); });
vitest_1.vi.mock("../infra/control-ui-assets.js", function () { return ({
    ensureControlUiAssetsBuilt: ensureControlUiAssetsBuilt,
}); });
vitest_1.vi.mock("../tui/tui.js", function () { return ({
    runTui: runTui,
}); });
(0, vitest_1.describe)("runOnboardingWizard", function () {
    (0, vitest_1.it)("exits when config is invalid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var select, prompter, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readConfigFileSnapshot.mockResolvedValueOnce({
                        path: "/tmp/.openclaw/openclaw.json",
                        exists: true,
                        raw: "{}",
                        parsed: {},
                        valid: false,
                        config: {},
                        issues: [{ path: "routing.allowFrom", message: "Legacy key" }],
                        legacyIssues: [{ path: "routing.allowFrom", message: "Legacy key" }],
                    });
                    select = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, "quickstart"];
                    }); }); });
                    prompter = {
                        intro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        outro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        note: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        select: select,
                        multiselect: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, []];
                        }); }); }),
                        text: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, vitest_1.expect)((0, onboarding_js_1.runOnboardingWizard)({
                            acceptRisk: true,
                            flow: "quickstart",
                            authChoice: "skip",
                            installDaemon: false,
                            skipProviders: true,
                            skipSkills: true,
                            skipHealth: true,
                            skipUi: true,
                        }, runtime, prompter)).rejects.toThrow("exit:1")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(select).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(prompter.outro).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips prompts and setup steps when flags are set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var select, multiselect, prompter, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    select = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, "quickstart"];
                    }); }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, []];
                    }); }); });
                    prompter = {
                        intro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        outro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        note: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        select: select,
                        multiselect: multiselect,
                        text: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, onboarding_js_1.runOnboardingWizard)({
                            acceptRisk: true,
                            flow: "quickstart",
                            authChoice: "skip",
                            installDaemon: false,
                            skipProviders: true,
                            skipSkills: true,
                            skipHealth: true,
                            skipUi: true,
                        }, runtime, prompter)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(select).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(setupChannels).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(setupSkills).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(healthCommand).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(runTui).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("launches TUI without auto-delivery when hatching", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, select, prompter, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runTui.mockClear();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-onboard-"))];
                case 1:
                    workspaceDir = _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(workspaceDir, workspace_js_1.DEFAULT_BOOTSTRAP_FILENAME), "{}")];
                case 2:
                    _a.sent();
                    select = vitest_1.vi.fn(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (opts.message === "How do you want to hatch your bot?") {
                                return [2 /*return*/, "tui"];
                            }
                            return [2 /*return*/, "quickstart"];
                        });
                    }); });
                    prompter = {
                        intro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        outro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        note: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        select: select,
                        multiselect: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, []];
                        }); }); }),
                        text: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, onboarding_js_1.runOnboardingWizard)({
                            acceptRisk: true,
                            flow: "quickstart",
                            mode: "local",
                            workspace: workspaceDir,
                            authChoice: "skip",
                            skipProviders: true,
                            skipSkills: true,
                            skipHealth: true,
                            installDaemon: false,
                        }, runtime, prompter)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(runTui).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        deliver: false,
                        message: "Wake up, my friend!",
                    }));
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("offers TUI hatch even without BOOTSTRAP.md", function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspaceDir, select, prompter, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runTui.mockClear();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-onboard-"))];
                case 1:
                    workspaceDir = _a.sent();
                    select = vitest_1.vi.fn(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (opts.message === "How do you want to hatch your bot?") {
                                return [2 /*return*/, "tui"];
                            }
                            return [2 /*return*/, "quickstart"];
                        });
                    }); });
                    prompter = {
                        intro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        outro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        note: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        select: select,
                        multiselect: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, []];
                        }); }); }),
                        text: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, onboarding_js_1.runOnboardingWizard)({
                            acceptRisk: true,
                            flow: "quickstart",
                            mode: "local",
                            workspace: workspaceDir,
                            authChoice: "skip",
                            skipProviders: true,
                            skipSkills: true,
                            skipHealth: true,
                            installDaemon: false,
                        }, runtime, prompter)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(runTui).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        deliver: false,
                        message: undefined,
                    }));
                    return [4 /*yield*/, promises_1.default.rm(workspaceDir, { recursive: true, force: true })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows the web search hint at the end of onboarding", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevBraveKey, note, prompter, runtime, calls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevBraveKey = process.env.BRAVE_API_KEY;
                    delete process.env.BRAVE_API_KEY;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    note = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    prompter = {
                        intro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        outro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        note: note,
                        select: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, "quickstart"];
                        }); }); }),
                        multiselect: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, []];
                        }); }); }),
                        text: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    return [4 /*yield*/, (0, onboarding_js_1.runOnboardingWizard)({
                            acceptRisk: true,
                            flow: "quickstart",
                            authChoice: "skip",
                            installDaemon: false,
                            skipProviders: true,
                            skipSkills: true,
                            skipHealth: true,
                            skipUi: true,
                        }, runtime, prompter)];
                case 2:
                    _a.sent();
                    calls = note.mock.calls;
                    (0, vitest_1.expect)(calls.length).toBeGreaterThan(0);
                    (0, vitest_1.expect)(calls.some(function (call) { return (call === null || call === void 0 ? void 0 : call[1]) === "Web search (optional)"; })).toBe(true);
                    return [3 /*break*/, 4];
                case 3:
                    if (prevBraveKey === undefined) {
                        delete process.env.BRAVE_API_KEY;
                    }
                    else {
                        process.env.BRAVE_API_KEY = prevBraveKey;
                    }
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
