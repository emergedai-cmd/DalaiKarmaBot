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
var vitest_1 = require("vitest");
var channel_js_1 = require("../../extensions/signal/src/channel.js");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var configMocks = vitest_1.vi.hoisted(function () { return ({
    readConfigFileSnapshot: vitest_1.vi.fn(),
    writeConfigFile: vitest_1.vi.fn().mockResolvedValue(undefined),
}); });
var authMocks = vitest_1.vi.hoisted(function () { return ({
    loadAuthProfileStore: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { readConfigFileSnapshot: configMocks.readConfigFileSnapshot, writeConfigFile: configMocks.writeConfigFile })];
        }
    });
}); });
vitest_1.vi.mock("../agents/auth-profiles.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadAuthProfileStore: authMocks.loadAuthProfileStore })];
        }
    });
}); });
var channels_js_1 = require("./channels.js");
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(),
};
var _baseSnapshot = {
    path: "/tmp/openclaw.json",
    exists: true,
    raw: "{}",
    parsed: {},
    valid: true,
    config: {},
    issues: [],
    legacyIssues: [],
};
(0, vitest_1.describe)("channels command", function () {
    (0, vitest_1.beforeEach)(function () {
        configMocks.readConfigFileSnapshot.mockReset();
        configMocks.writeConfigFile.mockClear();
        authMocks.loadAuthProfileStore.mockReset();
        runtime.log.mockClear();
        runtime.error.mockClear();
        runtime.exit.mockClear();
        authMocks.loadAuthProfileStore.mockReturnValue({
            version: 1,
            profiles: {},
        });
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([{ pluginId: "signal", source: "test", plugin: channel_js_1.signalPlugin }]));
    });
    (0, vitest_1.afterEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([]));
    });
    (0, vitest_1.it)("surfaces Signal runtime errors in channels status output", function () {
        var lines = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                signal: [
                    {
                        accountId: "default",
                        enabled: true,
                        configured: true,
                        running: false,
                        lastError: "signal-cli unreachable",
                    },
                ],
            },
        });
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Warnings:/);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/signal/i);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Channel error/i);
    });
    (0, vitest_1.it)("surfaces iMessage runtime errors in channels status output", function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            {
                pluginId: "imessage",
                source: "test",
                plugin: (0, channel_plugins_js_1.createIMessageTestPlugin)(),
            },
        ]));
        var lines = (0, channels_js_1.formatGatewayChannelsStatusLines)({
            channelAccounts: {
                imessage: [
                    {
                        accountId: "default",
                        enabled: true,
                        configured: true,
                        running: false,
                        lastError: "imsg permission denied",
                    },
                ],
            },
        });
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Warnings:/);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/imessage/i);
        (0, vitest_1.expect)(lines.join("\n")).toMatch(/Channel error/i);
    });
});
