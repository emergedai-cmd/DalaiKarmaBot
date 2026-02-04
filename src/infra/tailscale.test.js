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
var tailscale = require("./tailscale.js");
var ensureGoInstalled = tailscale.ensureGoInstalled, ensureTailscaledInstalled = tailscale.ensureTailscaledInstalled, getTailnetHostname = tailscale.getTailnetHostname, enableTailscaleServe = tailscale.enableTailscaleServe, disableTailscaleServe = tailscale.disableTailscaleServe, ensureFunnel = tailscale.ensureFunnel;
var tailscaleBin = vitest_1.expect.stringMatching(/tailscale$/i);
(0, vitest_1.describe)("tailscale helpers", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)("parses DNS name from tailscale status", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exec, host;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exec = vitest_1.vi.fn().mockResolvedValue({
                        stdout: JSON.stringify({
                            Self: { DNSName: "host.tailnet.ts.net.", TailscaleIPs: ["100.1.1.1"] },
                        }),
                    });
                    return [4 /*yield*/, getTailnetHostname(exec)];
                case 1:
                    host = _a.sent();
                    (0, vitest_1.expect)(host).toBe("host.tailnet.ts.net");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to IP when DNS missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exec, host;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exec = vitest_1.vi.fn().mockResolvedValue({
                        stdout: JSON.stringify({ Self: { TailscaleIPs: ["100.2.2.2"] } }),
                    });
                    return [4 /*yield*/, getTailnetHostname(exec)];
                case 1:
                    host = _a.sent();
                    (0, vitest_1.expect)(host).toBe("100.2.2.2");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ensureGoInstalled installs when missing and user agrees", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exec, prompt, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exec = vitest_1.vi.fn().mockRejectedValueOnce(new Error("no go")).mockResolvedValue({});
                    prompt = vitest_1.vi.fn().mockResolvedValue(true);
                    runtime = {
                        error: vitest_1.vi.fn(),
                        log: vitest_1.vi.fn(),
                        exit: (function (code) {
                            throw new Error("exit ".concat(code));
                        }),
                    };
                    return [4 /*yield*/, ensureGoInstalled(exec, prompt, runtime)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(exec).toHaveBeenCalledWith("brew", ["install", "go"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ensureTailscaledInstalled installs when missing and user agrees", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exec, prompt, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exec = vitest_1.vi.fn().mockRejectedValueOnce(new Error("missing")).mockResolvedValue({});
                    prompt = vitest_1.vi.fn().mockResolvedValue(true);
                    runtime = {
                        error: vitest_1.vi.fn(),
                        log: vitest_1.vi.fn(),
                        exit: (function (code) {
                            throw new Error("exit ".concat(code));
                        }),
                    };
                    return [4 /*yield*/, ensureTailscaledInstalled(exec, prompt, runtime)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(exec).toHaveBeenCalledWith("brew", ["install", "tailscale"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("enableTailscaleServe attempts normal first, then sudo", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 1. First attempt fails
                    // 2. Second attempt (sudo) succeeds
                    vitest_1.vi.spyOn(tailscale, "getTailscaleBinary").mockResolvedValue("tailscale");
                    exec = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(new Error("permission denied"))
                        .mockResolvedValueOnce({ stdout: "" });
                    return [4 /*yield*/, enableTailscaleServe(3000, exec)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(exec).toHaveBeenNthCalledWith(1, tailscaleBin, vitest_1.expect.arrayContaining(["serve", "--bg", "--yes", "3000"]), vitest_1.expect.any(Object));
                    (0, vitest_1.expect)(exec).toHaveBeenNthCalledWith(2, "sudo", vitest_1.expect.arrayContaining(["-n", tailscaleBin, "serve", "--bg", "--yes", "3000"]), vitest_1.expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("enableTailscaleServe does NOT use sudo if first attempt succeeds", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.spyOn(tailscale, "getTailscaleBinary").mockResolvedValue("tailscale");
                    exec = vitest_1.vi.fn().mockResolvedValue({ stdout: "" });
                    return [4 /*yield*/, enableTailscaleServe(3000, exec)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(exec).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(exec).toHaveBeenCalledWith(tailscaleBin, vitest_1.expect.arrayContaining(["serve", "--bg", "--yes", "3000"]), vitest_1.expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("disableTailscaleServe uses fallback", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.spyOn(tailscale, "getTailscaleBinary").mockResolvedValue("tailscale");
                    exec = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(new Error("permission denied"))
                        .mockResolvedValueOnce({ stdout: "" });
                    return [4 /*yield*/, disableTailscaleServe(exec)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(exec).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(exec).toHaveBeenNthCalledWith(2, "sudo", vitest_1.expect.arrayContaining(["-n", tailscaleBin, "serve", "reset"]), vitest_1.expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ensureFunnel uses fallback for enabling", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exec, runtime, prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Mock exec:
                    // 1. status (success)
                    // 2. enable (fails)
                    // 3. enable sudo (success)
                    vitest_1.vi.spyOn(tailscale, "getTailscaleBinary").mockResolvedValue("tailscale");
                    exec = vitest_1.vi
                        .fn()
                        .mockResolvedValueOnce({ stdout: JSON.stringify({ BackendState: "Running" }) }) // status
                        .mockRejectedValueOnce(new Error("permission denied")) // enable normal
                        .mockResolvedValueOnce({ stdout: "" });
                    runtime = {
                        error: vitest_1.vi.fn(),
                        log: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    prompt = vitest_1.vi.fn();
                    return [4 /*yield*/, ensureFunnel(8080, exec, runtime, prompt)];
                case 1:
                    _a.sent();
                    // 1. status
                    (0, vitest_1.expect)(exec).toHaveBeenNthCalledWith(1, tailscaleBin, vitest_1.expect.arrayContaining(["funnel", "status", "--json"]));
                    // 2. enable normal
                    (0, vitest_1.expect)(exec).toHaveBeenNthCalledWith(2, tailscaleBin, vitest_1.expect.arrayContaining(["funnel", "--yes", "--bg", "8080"]), vitest_1.expect.any(Object));
                    // 3. enable sudo
                    (0, vitest_1.expect)(exec).toHaveBeenNthCalledWith(3, "sudo", vitest_1.expect.arrayContaining(["-n", tailscaleBin, "funnel", "--yes", "--bg", "8080"]), vitest_1.expect.any(Object));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("enableTailscaleServe skips sudo on non-permission errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.spyOn(tailscale, "getTailscaleBinary").mockResolvedValue("tailscale");
                    exec = vitest_1.vi.fn().mockRejectedValueOnce(new Error("boom"));
                    return [4 /*yield*/, (0, vitest_1.expect)(enableTailscaleServe(3000, exec)).rejects.toThrow("boom")];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(exec).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("enableTailscaleServe rethrows original error if sudo fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalError, exec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.spyOn(tailscale, "getTailscaleBinary").mockResolvedValue("tailscale");
                    originalError = Object.assign(new Error("permission denied"), {
                        stderr: "permission denied",
                    });
                    exec = vitest_1.vi
                        .fn()
                        .mockRejectedValueOnce(originalError)
                        .mockRejectedValueOnce(new Error("sudo: a password is required"));
                    return [4 /*yield*/, (0, vitest_1.expect)(enableTailscaleServe(3000, exec)).rejects.toBe(originalError)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(exec).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
