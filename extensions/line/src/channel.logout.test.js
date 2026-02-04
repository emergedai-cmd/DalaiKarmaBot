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
var channel_js_1 = require("./channel.js");
var runtime_js_1 = require("./runtime.js");
var DEFAULT_ACCOUNT_ID = "default";
function createRuntime() {
    var _this = this;
    var writeConfigFile = vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    var resolveLineAccount = vitest_1.vi.fn(function (_a) {
        var _b, _c, _d, _e;
        var cfg = _a.cfg, accountId = _a.accountId;
        var lineConfig = ((_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.line) !== null && _c !== void 0 ? _c : {});
        var entry = accountId && accountId !== DEFAULT_ACCOUNT_ID
            ? ((_e = (_d = lineConfig.accounts) === null || _d === void 0 ? void 0 : _d[accountId]) !== null && _e !== void 0 ? _e : {})
            : lineConfig;
        var hasToken = 
        // oxlint-disable-next-line typescript/no-explicit-any
        Boolean(entry.channelAccessToken) || Boolean(entry.tokenFile);
        // oxlint-disable-next-line typescript/no-explicit-any
        var hasSecret = Boolean(entry.channelSecret) || Boolean(entry.secretFile);
        return { tokenSource: hasToken && hasSecret ? "config" : "none" };
    });
    var runtime = {
        config: { writeConfigFile: writeConfigFile },
        channel: { line: { resolveLineAccount: resolveLineAccount } },
    };
    return { runtime: runtime, mocks: { writeConfigFile: writeConfigFile, resolveLineAccount: resolveLineAccount } };
}
(0, vitest_1.describe)("linePlugin gateway.logoutAccount", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setLineRuntime)(createRuntime().runtime);
    });
    (0, vitest_1.it)("clears tokenFile/secretFile on default account logout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runtime, mocks, cfg, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createRuntime(), runtime = _a.runtime, mocks = _a.mocks;
                    (0, runtime_js_1.setLineRuntime)(runtime);
                    cfg = {
                        channels: {
                            line: {
                                tokenFile: "/tmp/token",
                                secretFile: "/tmp/secret",
                            },
                        },
                    };
                    return [4 /*yield*/, channel_js_1.linePlugin.gateway.logoutAccount({
                            accountId: DEFAULT_ACCOUNT_ID,
                            cfg: cfg,
                        })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.cleared).toBe(true);
                    (0, vitest_1.expect)(result.loggedOut).toBe(true);
                    (0, vitest_1.expect)(mocks.writeConfigFile).toHaveBeenCalledWith({});
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("clears tokenFile/secretFile on account logout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, runtime, mocks, cfg, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = createRuntime(), runtime = _a.runtime, mocks = _a.mocks;
                    (0, runtime_js_1.setLineRuntime)(runtime);
                    cfg = {
                        channels: {
                            line: {
                                accounts: {
                                    primary: {
                                        tokenFile: "/tmp/token",
                                        secretFile: "/tmp/secret",
                                    },
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, channel_js_1.linePlugin.gateway.logoutAccount({
                            accountId: "primary",
                            cfg: cfg,
                        })];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.cleared).toBe(true);
                    (0, vitest_1.expect)(result.loggedOut).toBe(true);
                    (0, vitest_1.expect)(mocks.writeConfigFile).toHaveBeenCalledWith({});
                    return [2 /*return*/];
            }
        });
    }); });
});
