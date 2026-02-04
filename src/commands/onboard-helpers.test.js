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
var onboard_helpers_js_1 = require("./onboard-helpers.js");
var mocks = vitest_1.vi.hoisted(function () { return ({
    runCommandWithTimeout: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    stdout: "",
                    stderr: "",
                    code: 0,
                    signal: null,
                    killed: false,
                })];
        });
    }); }),
    pickPrimaryTailnetIPv4: vitest_1.vi.fn(function () { return undefined; }),
}); });
vitest_1.vi.mock("../process/exec.js", function () { return ({
    runCommandWithTimeout: mocks.runCommandWithTimeout,
}); });
vitest_1.vi.mock("../infra/tailnet.js", function () { return ({
    pickPrimaryTailnetIPv4: mocks.pickPrimaryTailnetIPv4,
}); });
(0, vitest_1.afterEach)(function () {
    vitest_1.vi.unstubAllEnvs();
});
(0, vitest_1.describe)("openUrl", function () {
    (0, vitest_1.it)("quotes URLs on win32 so '&' is not treated as cmd separator", function () { return __awaiter(void 0, void 0, void 0, function () {
        var platformSpy, url, ok, _a, argv, options;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.stubEnv("VITEST", "");
                    vitest_1.vi.stubEnv("NODE_ENV", "");
                    platformSpy = vitest_1.vi.spyOn(process, "platform", "get").mockReturnValue("win32");
                    vitest_1.vi.stubEnv("VITEST", "");
                    vitest_1.vi.stubEnv("NODE_ENV", "development");
                    url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=abc&response_type=code&redirect_uri=http%3A%2F%2Flocalhost";
                    return [4 /*yield*/, (0, onboard_helpers_js_1.openUrl)(url)];
                case 1:
                    ok = _c.sent();
                    (0, vitest_1.expect)(ok).toBe(true);
                    (0, vitest_1.expect)(mocks.runCommandWithTimeout).toHaveBeenCalledTimes(1);
                    _a = (_b = mocks.runCommandWithTimeout.mock.calls[0]) !== null && _b !== void 0 ? _b : [], argv = _a[0], options = _a[1];
                    (0, vitest_1.expect)(argv === null || argv === void 0 ? void 0 : argv.slice(0, 4)).toEqual(["cmd", "/c", "start", '""']);
                    (0, vitest_1.expect)(argv === null || argv === void 0 ? void 0 : argv.at(-1)).toBe("\"".concat(url, "\""));
                    (0, vitest_1.expect)(options).toMatchObject({
                        timeoutMs: 5000,
                        windowsVerbatimArguments: true,
                    });
                    platformSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveBrowserOpenCommand", function () {
    (0, vitest_1.it)("marks win32 commands as quoteUrl=true", function () { return __awaiter(void 0, void 0, void 0, function () {
        var platformSpy, resolved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    platformSpy = vitest_1.vi.spyOn(process, "platform", "get").mockReturnValue("win32");
                    return [4 /*yield*/, (0, onboard_helpers_js_1.resolveBrowserOpenCommand)()];
                case 1:
                    resolved = _a.sent();
                    (0, vitest_1.expect)(resolved.argv).toEqual(["cmd", "/c", "start", ""]);
                    (0, vitest_1.expect)(resolved.quoteUrl).toBe(true);
                    platformSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveControlUiLinks", function () {
    (0, vitest_1.it)("uses customBindHost for custom bind", function () {
        var links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
            port: 18789,
            bind: "custom",
            customBindHost: "192.168.1.100",
        });
        (0, vitest_1.expect)(links.httpUrl).toBe("http://192.168.1.100:18789/");
        (0, vitest_1.expect)(links.wsUrl).toBe("ws://192.168.1.100:18789");
    });
    (0, vitest_1.it)("falls back to loopback for invalid customBindHost", function () {
        var links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
            port: 18789,
            bind: "custom",
            customBindHost: "192.168.001.100",
        });
        (0, vitest_1.expect)(links.httpUrl).toBe("http://127.0.0.1:18789/");
        (0, vitest_1.expect)(links.wsUrl).toBe("ws://127.0.0.1:18789");
    });
    (0, vitest_1.it)("uses tailnet IP for tailnet bind", function () {
        mocks.pickPrimaryTailnetIPv4.mockReturnValueOnce("100.64.0.9");
        var links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
            port: 18789,
            bind: "tailnet",
        });
        (0, vitest_1.expect)(links.httpUrl).toBe("http://100.64.0.9:18789/");
        (0, vitest_1.expect)(links.wsUrl).toBe("ws://100.64.0.9:18789");
    });
    (0, vitest_1.it)("keeps loopback for auto even when tailnet is present", function () {
        mocks.pickPrimaryTailnetIPv4.mockReturnValueOnce("100.64.0.9");
        var links = (0, onboard_helpers_js_1.resolveControlUiLinks)({
            port: 18789,
            bind: "auto",
        });
        (0, vitest_1.expect)(links.httpUrl).toBe("http://127.0.0.1:18789/");
        (0, vitest_1.expect)(links.wsUrl).toBe("ws://127.0.0.1:18789");
    });
});
(0, vitest_1.describe)("normalizeGatewayTokenInput", function () {
    (0, vitest_1.it)("returns empty string for undefined or null", function () {
        (0, vitest_1.expect)((0, onboard_helpers_js_1.normalizeGatewayTokenInput)(undefined)).toBe("");
        (0, vitest_1.expect)((0, onboard_helpers_js_1.normalizeGatewayTokenInput)(null)).toBe("");
    });
    (0, vitest_1.it)("trims string input", function () {
        (0, vitest_1.expect)((0, onboard_helpers_js_1.normalizeGatewayTokenInput)("  token  ")).toBe("token");
    });
    (0, vitest_1.it)("returns empty string for non-string input", function () {
        (0, vitest_1.expect)((0, onboard_helpers_js_1.normalizeGatewayTokenInput)(123)).toBe("");
    });
});
