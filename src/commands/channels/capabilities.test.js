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
process.env.NO_COLOR = "1";
var vitest_1 = require("vitest");
var index_js_1 = require("../../channels/plugins/index.js");
var scopes_js_1 = require("../../slack/scopes.js");
var capabilities_js_1 = require("./capabilities.js");
var logs = [];
var errors = [];
vitest_1.vi.mock("./shared.js", function () { return ({
    requireValidConfig: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ channels: {} })];
    }); }); }),
    formatChannelAccountLabel: vitest_1.vi.fn(function (_a) {
        var channel = _a.channel, accountId = _a.accountId;
        return "".concat(channel, ":").concat(accountId);
    }),
}); });
vitest_1.vi.mock("../../channels/plugins/index.js", function () { return ({
    listChannelPlugins: vitest_1.vi.fn(),
    getChannelPlugin: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../../slack/scopes.js", function () { return ({
    fetchSlackScopes: vitest_1.vi.fn(),
}); });
var runtime = {
    log: function (value) { return logs.push(value); },
    error: function (value) { return errors.push(value); },
    exit: function (code) {
        throw new Error("exit:".concat(code));
    },
};
function resetOutput() {
    logs.length = 0;
    errors.length = 0;
}
function buildPlugin(params) {
    var _this = this;
    var _a;
    var capabilities = (_a = params.capabilities) !== null && _a !== void 0 ? _a : { chatTypes: ["direct"] };
    return {
        id: params.id,
        meta: {
            id: params.id,
            label: params.id,
            selectionLabel: params.id,
            docsPath: "/channels/test",
            blurb: "test",
        },
        capabilities: capabilities,
        config: {
            listAccountIds: function () { return ["default"]; },
            resolveAccount: function () { var _a; return (_a = params.account) !== null && _a !== void 0 ? _a : { accountId: "default" }; },
            defaultAccountId: function () { return "default"; },
            isConfigured: function () { return true; },
            isEnabled: function () { return true; },
        },
        status: params.probe
            ? {
                probeAccount: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, params.probe];
                }); }); },
            }
            : undefined,
        actions: {
            listActions: function () { return ["poll"]; },
        },
    };
}
(0, vitest_1.describe)("channelsCapabilitiesCommand", function () {
    (0, vitest_1.beforeEach)(function () {
        resetOutput();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("prints Slack bot + user scopes when user token is configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var plugin, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plugin = buildPlugin({
                        id: "slack",
                        account: {
                            accountId: "default",
                            botToken: "xoxb-bot",
                            config: { userToken: "xoxp-user" },
                        },
                        probe: { ok: true, bot: { name: "openclaw" }, team: { name: "team" } },
                    });
                    vitest_1.vi.mocked(index_js_1.listChannelPlugins).mockReturnValue([plugin]);
                    vitest_1.vi.mocked(index_js_1.getChannelPlugin).mockReturnValue(plugin);
                    vitest_1.vi.mocked(scopes_js_1.fetchSlackScopes).mockImplementation(function (token) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (token === "xoxp-user") {
                                return [2 /*return*/, { ok: true, scopes: ["users:read"], source: "auth.scopes" }];
                            }
                            return [2 /*return*/, { ok: true, scopes: ["chat:write"], source: "auth.scopes" }];
                        });
                    }); });
                    return [4 /*yield*/, (0, capabilities_js_1.channelsCapabilitiesCommand)({ channel: "slack" }, runtime)];
                case 1:
                    _a.sent();
                    output = logs.join("\n");
                    (0, vitest_1.expect)(output).toContain("Bot scopes");
                    (0, vitest_1.expect)(output).toContain("User scopes");
                    (0, vitest_1.expect)(output).toContain("chat:write");
                    (0, vitest_1.expect)(output).toContain("users:read");
                    (0, vitest_1.expect)(scopes_js_1.fetchSlackScopes).toHaveBeenCalledWith("xoxb-bot", vitest_1.expect.any(Number));
                    (0, vitest_1.expect)(scopes_js_1.fetchSlackScopes).toHaveBeenCalledWith("xoxp-user", vitest_1.expect.any(Number));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prints Teams Graph permission hints when present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var plugin, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plugin = buildPlugin({
                        id: "msteams",
                        probe: {
                            ok: true,
                            appId: "app-id",
                            graph: {
                                ok: true,
                                roles: ["ChannelMessage.Read.All", "Files.Read.All"],
                            },
                        },
                    });
                    vitest_1.vi.mocked(index_js_1.listChannelPlugins).mockReturnValue([plugin]);
                    vitest_1.vi.mocked(index_js_1.getChannelPlugin).mockReturnValue(plugin);
                    return [4 /*yield*/, (0, capabilities_js_1.channelsCapabilitiesCommand)({ channel: "msteams" }, runtime)];
                case 1:
                    _a.sent();
                    output = logs.join("\n");
                    (0, vitest_1.expect)(output).toContain("ChannelMessage.Read.All (channel history)");
                    (0, vitest_1.expect)(output).toContain("Files.Read.All (files (OneDrive))");
                    return [2 /*return*/];
            }
        });
    }); });
});
