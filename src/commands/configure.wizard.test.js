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
var mocks = vitest_1.vi.hoisted(function () { return ({
    clackIntro: vitest_1.vi.fn(),
    clackOutro: vitest_1.vi.fn(),
    clackSelect: vitest_1.vi.fn(),
    clackText: vitest_1.vi.fn(),
    clackConfirm: vitest_1.vi.fn(),
    readConfigFileSnapshot: vitest_1.vi.fn(),
    writeConfigFile: vitest_1.vi.fn(),
    resolveGatewayPort: vitest_1.vi.fn(),
    ensureControlUiAssetsBuilt: vitest_1.vi.fn(),
    createClackPrompter: vitest_1.vi.fn(),
    note: vitest_1.vi.fn(),
    printWizardHeader: vitest_1.vi.fn(),
    probeGatewayReachable: vitest_1.vi.fn(),
    waitForGatewayReachable: vitest_1.vi.fn(),
    resolveControlUiLinks: vitest_1.vi.fn(),
    summarizeExistingConfig: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("@clack/prompts", function () { return ({
    intro: mocks.clackIntro,
    outro: mocks.clackOutro,
    select: mocks.clackSelect,
    text: mocks.clackText,
    confirm: mocks.clackConfirm,
}); });
vitest_1.vi.mock("../config/config.js", function () { return ({
    CONFIG_PATH: "~/.openclaw/openclaw.json",
    readConfigFileSnapshot: mocks.readConfigFileSnapshot,
    writeConfigFile: mocks.writeConfigFile,
    resolveGatewayPort: mocks.resolveGatewayPort,
}); });
vitest_1.vi.mock("../infra/control-ui-assets.js", function () { return ({
    ensureControlUiAssetsBuilt: mocks.ensureControlUiAssetsBuilt,
}); });
vitest_1.vi.mock("../wizard/clack-prompter.js", function () { return ({
    createClackPrompter: mocks.createClackPrompter,
}); });
vitest_1.vi.mock("../terminal/note.js", function () { return ({
    note: mocks.note,
}); });
vitest_1.vi.mock("./onboard-helpers.js", function () { return ({
    DEFAULT_WORKSPACE: "~/.openclaw/workspace",
    applyWizardMetadata: function (cfg) { return cfg; },
    ensureWorkspaceAndSessions: vitest_1.vi.fn(),
    guardCancel: function (value) { return value; },
    printWizardHeader: mocks.printWizardHeader,
    probeGatewayReachable: mocks.probeGatewayReachable,
    resolveControlUiLinks: mocks.resolveControlUiLinks,
    summarizeExistingConfig: mocks.summarizeExistingConfig,
    waitForGatewayReachable: mocks.waitForGatewayReachable,
}); });
vitest_1.vi.mock("./health.js", function () { return ({
    healthCommand: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./health-format.js", function () { return ({
    formatHealthCheckFailure: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./configure.gateway.js", function () { return ({
    promptGatewayConfig: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./configure.gateway-auth.js", function () { return ({
    promptAuthConfig: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./configure.channels.js", function () { return ({
    removeChannelConfigWizard: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./configure.daemon.js", function () { return ({
    maybeInstallDaemon: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./onboard-remote.js", function () { return ({
    promptRemoteGatewayConfig: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./onboard-skills.js", function () { return ({
    setupSkills: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("./onboard-channels.js", function () { return ({
    setupChannels: vitest_1.vi.fn(),
}); });
var configure_wizard_js_1 = require("./configure.wizard.js");
(0, vitest_1.describe)("runConfigureWizard", function () {
    (0, vitest_1.it)("persists gateway.mode=local when only the run mode is selected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var selectQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mocks.readConfigFileSnapshot.mockResolvedValue({
                        exists: false,
                        valid: true,
                        config: {},
                        issues: [],
                    });
                    mocks.resolveGatewayPort.mockReturnValue(18789);
                    mocks.probeGatewayReachable.mockResolvedValue({ ok: false });
                    mocks.resolveControlUiLinks.mockReturnValue({ wsUrl: "ws://127.0.0.1:18789" });
                    mocks.summarizeExistingConfig.mockReturnValue("");
                    mocks.createClackPrompter.mockReturnValue({});
                    selectQueue = ["local", "__continue"];
                    mocks.clackSelect.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, selectQueue.shift()];
                    }); }); });
                    mocks.clackIntro.mockResolvedValue(undefined);
                    mocks.clackOutro.mockResolvedValue(undefined);
                    mocks.clackText.mockResolvedValue("");
                    mocks.clackConfirm.mockResolvedValue(false);
                    return [4 /*yield*/, (0, configure_wizard_js_1.runConfigureWizard)({ command: "configure" }, {
                            log: vitest_1.vi.fn(),
                            error: vitest_1.vi.fn(),
                            exit: vitest_1.vi.fn(),
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.writeConfigFile).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        gateway: vitest_1.expect.objectContaining({ mode: "local" }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
