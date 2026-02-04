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
var node_net_1 = require("node:net");
var vitest_1 = require("vitest");
var ports_js_1 = require("./ports.js");
(0, vitest_1.describe)("ports helpers", function () {
    (0, vitest_1.it)("ensurePortAvailable rejects when port busy", function () { return __awaiter(void 0, void 0, void 0, function () {
        var server, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = node_net_1.default.createServer();
                    return [4 /*yield*/, new Promise(function (resolve) { return server.listen(0, resolve); })];
                case 1:
                    _a.sent();
                    port = server.address().port;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, ports_js_1.ensurePortAvailable)(port)).rejects.toBeInstanceOf(ports_js_1.PortInUseError)];
                case 2:
                    _a.sent();
                    server.close();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handlePortError exits nicely on EADDRINUSE", function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runtime = {
                        error: vitest_1.vi.fn(),
                        log: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(),
                    };
                    return [4 /*yield*/, (0, ports_js_1.handlePortError)({ code: "EADDRINUSE" }, 1234, "context", runtime).catch(function () { })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(runtime.error).toHaveBeenCalled();
                    (0, vitest_1.expect)(runtime.exit).toHaveBeenCalledWith(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("classifies ssh and gateway listeners", function () {
        (0, vitest_1.expect)((0, ports_js_1.classifyPortListener)({ commandLine: "ssh -N -L 18789:127.0.0.1:18789 user@host" }, 18789)).toBe("ssh");
        (0, vitest_1.expect)((0, ports_js_1.classifyPortListener)({
            commandLine: "node /Users/me/Projects/openclaw/dist/entry.js gateway",
        }, 18789)).toBe("gateway");
    });
    (0, vitest_1.it)("formats port diagnostics with hints", function () {
        var diagnostics = {
            port: 18789,
            status: "busy",
            listeners: [{ pid: 123, commandLine: "ssh -N -L 18789:127.0.0.1:18789" }],
            hints: (0, ports_js_1.buildPortHints)([{ pid: 123, commandLine: "ssh -N -L 18789:127.0.0.1:18789" }], 18789),
        };
        var lines = (0, ports_js_1.formatPortDiagnostics)(diagnostics);
        (0, vitest_1.expect)(lines[0]).toContain("Port 18789 is already in use");
        (0, vitest_1.expect)(lines.some(function (line) { return line.includes("SSH tunnel"); })).toBe(true);
    });
});
