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
var utils_1 = require("../utils");
var bash_process_registry_1 = require("./bash-process-registry");
var bash_tools_exec_1 = require("./bash-tools.exec");
var bash_tools_process_1 = require("./bash-tools.process");
(0, vitest_1.afterEach)(function () {
    (0, bash_process_registry_1.resetProcessRegistryForTests)();
});
(0, vitest_1.test)("process send-keys encodes Enter for pty sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
    var execTool, processTool, result, sessionId, deadline, poll, details;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                execTool = (0, bash_tools_exec_1.createExecTool)();
                processTool = (0, bash_tools_process_1.createProcessTool)();
                return [4 /*yield*/, execTool.execute("toolcall", {
                        command: 'node -e "const dataEvent=String.fromCharCode(100,97,116,97);process.stdin.on(dataEvent,d=>{process.stdout.write(d);if(d.includes(10)||d.includes(13))process.exit(0);});"',
                        pty: true,
                        background: true,
                    })];
            case 1:
                result = _b.sent();
                (0, vitest_1.expect)(result.details.status).toBe("running");
                sessionId = result.details.sessionId;
                (0, vitest_1.expect)(sessionId).toBeTruthy();
                return [4 /*yield*/, processTool.execute("toolcall", {
                        action: "send-keys",
                        sessionId: sessionId,
                        keys: ["h", "i", "Enter"],
                    })];
            case 2:
                _b.sent();
                deadline = Date.now() + (process.platform === "win32" ? 4000 : 2000);
                _b.label = 3;
            case 3:
                if (!(Date.now() < deadline)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, utils_1.sleep)(50)];
            case 4:
                _b.sent();
                return [4 /*yield*/, processTool.execute("toolcall", { action: "poll", sessionId: sessionId })];
            case 5:
                poll = _b.sent();
                details = poll.details;
                if (details.status !== "running") {
                    (0, vitest_1.expect)(details.status).toBe("completed");
                    (0, vitest_1.expect)((_a = details.aggregated) !== null && _a !== void 0 ? _a : "").toContain("hi");
                    return [2 /*return*/];
                }
                return [3 /*break*/, 3];
            case 6: throw new Error("PTY session did not exit after send-keys");
        }
    });
}); });
(0, vitest_1.test)("process submit sends Enter for pty sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
    var execTool, processTool, result, sessionId, deadline, poll, details;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                execTool = (0, bash_tools_exec_1.createExecTool)();
                processTool = (0, bash_tools_process_1.createProcessTool)();
                return [4 /*yield*/, execTool.execute("toolcall", {
                        command: 'node -e "const dataEvent=String.fromCharCode(100,97,116,97);const submitted=String.fromCharCode(115,117,98,109,105,116,116,101,100);process.stdin.on(dataEvent,d=>{if(d.includes(10)||d.includes(13)){process.stdout.write(submitted);process.exit(0);}});"',
                        pty: true,
                        background: true,
                    })];
            case 1:
                result = _b.sent();
                (0, vitest_1.expect)(result.details.status).toBe("running");
                sessionId = result.details.sessionId;
                (0, vitest_1.expect)(sessionId).toBeTruthy();
                return [4 /*yield*/, processTool.execute("toolcall", {
                        action: "submit",
                        sessionId: sessionId,
                    })];
            case 2:
                _b.sent();
                deadline = Date.now() + (process.platform === "win32" ? 4000 : 2000);
                _b.label = 3;
            case 3:
                if (!(Date.now() < deadline)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, utils_1.sleep)(50)];
            case 4:
                _b.sent();
                return [4 /*yield*/, processTool.execute("toolcall", { action: "poll", sessionId: sessionId })];
            case 5:
                poll = _b.sent();
                details = poll.details;
                if (details.status !== "running") {
                    (0, vitest_1.expect)(details.status).toBe("completed");
                    (0, vitest_1.expect)((_a = details.aggregated) !== null && _a !== void 0 ? _a : "").toContain("submitted");
                    return [2 /*return*/];
                }
                return [3 /*break*/, 3];
            case 6: throw new Error("PTY session did not exit after submit");
        }
    });
}); });
