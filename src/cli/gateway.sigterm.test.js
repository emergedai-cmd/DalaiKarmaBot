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
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var vitest_1 = require("vitest");
var waitForReady = function (proc, chunksOut, chunksErr, timeoutMs) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    var _a;
                    var timer = setTimeout(function () {
                        var stdout = chunksOut.join("");
                        var stderr = chunksErr.join("");
                        cleanup();
                        reject(new Error("timeout waiting for gateway to start\n" +
                            "--- stdout ---\n".concat(stdout, "\n--- stderr ---\n").concat(stderr)));
                    }, timeoutMs);
                    var cleanup = function () {
                        var _a;
                        clearTimeout(timer);
                        proc.off("exit", onExit);
                        proc.off("message", onMessage);
                        (_a = proc.stdout) === null || _a === void 0 ? void 0 : _a.off("data", onStdout);
                    };
                    var onExit = function () {
                        var stdout = chunksOut.join("");
                        var stderr = chunksErr.join("");
                        cleanup();
                        reject(new Error("gateway exited before ready (code=".concat(String(proc.exitCode), " signal=").concat(String(proc.signalCode), ")\n") +
                            "--- stdout ---\n".concat(stdout, "\n--- stderr ---\n").concat(stderr)));
                    };
                    var onMessage = function (msg) {
                        if (msg && typeof msg === "object" && "ready" in msg) {
                            cleanup();
                            resolve();
                        }
                    };
                    var onStdout = function (chunk) {
                        if (String(chunk).includes("READY")) {
                            cleanup();
                            resolve();
                        }
                    };
                    proc.once("exit", onExit);
                    proc.on("message", onMessage);
                    (_a = proc.stdout) === null || _a === void 0 ? void 0 : _a.on("data", onStdout);
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.describe)("gateway SIGTERM", function () {
    var child = null;
    (0, vitest_1.afterEach)(function () {
        if (!child || child.killed) {
            return;
        }
        try {
            child.kill("SIGKILL");
        }
        catch (_a) {
            // ignore
        }
        child = null;
    });
    (0, vitest_1.it)("exits 0 on SIGTERM", { timeout: 180000 }, function () { return __awaiter(void 0, void 0, void 0, function () {
        var stateDir, out, err, nodeBin, env, bootstrapPath, runLoopPath, runtimePath, childArgs, proc, result, stdout, stderr;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    stateDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gateway-test-"));
                    out = [];
                    err = [];
                    nodeBin = process.execPath;
                    env = __assign(__assign({}, process.env), { OPENCLAW_NO_RESPAWN: "1", OPENCLAW_STATE_DIR: stateDir, OPENCLAW_SKIP_CHANNELS: "1", OPENCLAW_SKIP_GMAIL_WATCHER: "1", OPENCLAW_SKIP_CRON: "1", OPENCLAW_SKIP_BROWSER_CONTROL_SERVER: "1", OPENCLAW_SKIP_CANVAS_HOST: "1" });
                    bootstrapPath = node_path_1.default.join(stateDir, "openclaw-entry-bootstrap.mjs");
                    runLoopPath = node_path_1.default.resolve("src/cli/gateway-cli/run-loop.ts");
                    runtimePath = node_path_1.default.resolve("src/runtime.ts");
                    node_fs_1.default.writeFileSync(bootstrapPath, [
                        'import { pathToFileURL } from "node:url";',
                        "const runLoopUrl = ".concat(JSON.stringify((0, node_url_1.pathToFileURL)(runLoopPath).href), ";"),
                        "const runtimeUrl = ".concat(JSON.stringify((0, node_url_1.pathToFileURL)(runtimePath).href), ";"),
                        "const { runGatewayLoop } = await import(runLoopUrl);",
                        "const { defaultRuntime } = await import(runtimeUrl);",
                        "await runGatewayLoop({",
                        "  start: async () => {",
                        '    process.stdout.write("READY\\\\n");',
                        "    if (process.send) process.send({ ready: true });",
                        "    const keepAlive = setInterval(() => {}, 1000);",
                        "    return { close: async () => clearInterval(keepAlive) };",
                        "  },",
                        "  runtime: defaultRuntime,",
                        "});",
                    ].join("\n"), "utf8");
                    childArgs = ["--import", "tsx", bootstrapPath];
                    child = (0, node_child_process_1.spawn)(nodeBin, childArgs, {
                        cwd: process.cwd(),
                        env: env,
                        stdio: ["ignore", "pipe", "pipe", "ipc"],
                    });
                    proc = child;
                    if (!proc) {
                        throw new Error("failed to spawn gateway");
                    }
                    (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.setEncoding("utf8");
                    (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.setEncoding("utf8");
                    (_c = child.stdout) === null || _c === void 0 ? void 0 : _c.on("data", function (d) { return out.push(String(d)); });
                    (_d = child.stderr) === null || _d === void 0 ? void 0 : _d.on("data", function (d) { return err.push(String(d)); });
                    return [4 /*yield*/, waitForReady(proc, out, err, 150000)];
                case 1:
                    _e.sent();
                    proc.kill("SIGTERM");
                    return [4 /*yield*/, new Promise(function (resolve) { return proc.once("exit", function (code, signal) { return resolve({ code: code, signal: signal }); }); })];
                case 2:
                    result = _e.sent();
                    if (result.code !== 0 && !(result.code === null && result.signal === "SIGTERM")) {
                        stdout = out.join("");
                        stderr = err.join("");
                        throw new Error("expected exit code 0, got code=".concat(String(result.code), " signal=").concat(String(result.signal), "\n") +
                            "--- stdout ---\n".concat(stdout, "\n--- stderr ---\n").concat(stderr));
                    }
                    if (result.code === null && result.signal === "SIGTERM") {
                        return [2 /*return*/];
                    }
                    (0, vitest_1.expect)(result.signal).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
