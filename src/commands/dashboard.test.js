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
var dashboard_js_1 = require("./dashboard.js");
var mocks = vitest_1.vi.hoisted(function () { return ({
    readConfigFileSnapshot: vitest_1.vi.fn(),
    resolveGatewayPort: vitest_1.vi.fn(),
    resolveControlUiLinks: vitest_1.vi.fn(),
    detectBrowserOpenSupport: vitest_1.vi.fn(),
    openUrl: vitest_1.vi.fn(),
    formatControlUiSshHint: vitest_1.vi.fn(),
    copyToClipboard: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../config/config.js", function () { return ({
    readConfigFileSnapshot: mocks.readConfigFileSnapshot,
    resolveGatewayPort: mocks.resolveGatewayPort,
}); });
vitest_1.vi.mock("./onboard-helpers.js", function () { return ({
    resolveControlUiLinks: mocks.resolveControlUiLinks,
    detectBrowserOpenSupport: mocks.detectBrowserOpenSupport,
    openUrl: mocks.openUrl,
    formatControlUiSshHint: mocks.formatControlUiSshHint,
}); });
vitest_1.vi.mock("../infra/clipboard.js", function () { return ({
    copyToClipboard: mocks.copyToClipboard,
}); });
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(),
};
function resetRuntime() {
    runtime.log.mockClear();
    runtime.error.mockClear();
    runtime.exit.mockClear();
}
function mockSnapshot(token) {
    if (token === void 0) { token = "abc"; }
    mocks.readConfigFileSnapshot.mockResolvedValue({
        path: "/tmp/openclaw.json",
        exists: true,
        raw: "{}",
        parsed: {},
        valid: true,
        config: { gateway: { auth: { token: token } } },
        issues: [],
        legacyIssues: [],
    });
    mocks.resolveGatewayPort.mockReturnValue(18789);
    mocks.resolveControlUiLinks.mockReturnValue({
        httpUrl: "http://127.0.0.1:18789/",
        wsUrl: "ws://127.0.0.1:18789",
    });
}
(0, vitest_1.describe)("dashboardCommand", function () {
    (0, vitest_1.beforeEach)(function () {
        resetRuntime();
        mocks.readConfigFileSnapshot.mockReset();
        mocks.resolveGatewayPort.mockReset();
        mocks.resolveControlUiLinks.mockReset();
        mocks.detectBrowserOpenSupport.mockReset();
        mocks.openUrl.mockReset();
        mocks.formatControlUiSshHint.mockReset();
        mocks.copyToClipboard.mockReset();
    });
    (0, vitest_1.it)("opens and copies the dashboard link by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockSnapshot("abc123");
                    mocks.copyToClipboard.mockResolvedValue(true);
                    mocks.detectBrowserOpenSupport.mockResolvedValue({ ok: true });
                    mocks.openUrl.mockResolvedValue(true);
                    return [4 /*yield*/, (0, dashboard_js_1.dashboardCommand)(runtime)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.resolveControlUiLinks).toHaveBeenCalledWith({
                        port: 18789,
                        bind: "loopback",
                        customBindHost: undefined,
                        basePath: undefined,
                    });
                    (0, vitest_1.expect)(mocks.copyToClipboard).toHaveBeenCalledWith("http://127.0.0.1:18789/?token=abc123");
                    (0, vitest_1.expect)(mocks.openUrl).toHaveBeenCalledWith("http://127.0.0.1:18789/?token=abc123");
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("Opened in your browser. Keep that tab to control OpenClaw.");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prints SSH hint when browser cannot open", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockSnapshot("shhhh");
                    mocks.copyToClipboard.mockResolvedValue(false);
                    mocks.detectBrowserOpenSupport.mockResolvedValue({
                        ok: false,
                        reason: "ssh",
                    });
                    mocks.formatControlUiSshHint.mockReturnValue("ssh hint");
                    return [4 /*yield*/, (0, dashboard_js_1.dashboardCommand)(runtime)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.openUrl).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("ssh hint");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects --no-open and skips browser attempts", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockSnapshot();
                    mocks.copyToClipboard.mockResolvedValue(true);
                    return [4 /*yield*/, (0, dashboard_js_1.dashboardCommand)(runtime, { noOpen: true })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mocks.detectBrowserOpenSupport).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(mocks.openUrl).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(runtime.log).toHaveBeenCalledWith("Browser launch disabled (--no-open). Use the URL above.");
                    return [2 /*return*/];
            }
        });
    }); });
});
