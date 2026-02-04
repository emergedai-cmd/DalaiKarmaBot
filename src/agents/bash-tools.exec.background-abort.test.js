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
var utils_ts_1 = require("../utils.ts");
var bash_process_registry_1 = require("./bash-process-registry");
var bash_tools_exec_1 = require("./bash-tools.exec");
var shell_utils_1 = require("./shell-utils");
(0, vitest_1.afterEach)(function () {
    (0, bash_process_registry_1.resetProcessRegistryForTests)();
});
(0, vitest_1.test)("background exec is not killed when tool signal aborts", function () { return __awaiter(void 0, void 0, void 0, function () {
    var tool, abortController, result, sessionId, running, finished, pid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tool = (0, bash_tools_exec_1.createExecTool)({ allowBackground: true, backgroundMs: 0 });
                abortController = new AbortController();
                return [4 /*yield*/, tool.execute("toolcall", { command: 'node -e "setTimeout(() => {}, 5000)"', background: true }, abortController.signal)];
            case 1:
                result = _a.sent();
                (0, vitest_1.expect)(result.details.status).toBe("running");
                sessionId = result.details.sessionId;
                abortController.abort();
                return [4 /*yield*/, (0, utils_ts_1.sleep)(150)];
            case 2:
                _a.sent();
                running = (0, bash_process_registry_1.getSession)(sessionId);
                finished = (0, bash_process_registry_1.getFinishedSession)(sessionId);
                try {
                    (0, vitest_1.expect)(finished).toBeUndefined();
                    (0, vitest_1.expect)(running === null || running === void 0 ? void 0 : running.exited).toBe(false);
                }
                finally {
                    pid = running === null || running === void 0 ? void 0 : running.pid;
                    if (pid) {
                        (0, shell_utils_1.killProcessTree)(pid);
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.test)("background exec still times out after tool signal abort", function () { return __awaiter(void 0, void 0, void 0, function () {
    var tool, abortController, result, sessionId, finished, deadline, running, pid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tool = (0, bash_tools_exec_1.createExecTool)({ allowBackground: true, backgroundMs: 0 });
                abortController = new AbortController();
                return [4 /*yield*/, tool.execute("toolcall", {
                        command: 'node -e "setTimeout(() => {}, 5000)"',
                        background: true,
                        timeout: 0.2,
                    }, abortController.signal)];
            case 1:
                result = _a.sent();
                (0, vitest_1.expect)(result.details.status).toBe("running");
                sessionId = result.details.sessionId;
                abortController.abort();
                finished = (0, bash_process_registry_1.getFinishedSession)(sessionId);
                deadline = Date.now() + (process.platform === "win32" ? 10000 : 2000);
                _a.label = 2;
            case 2:
                if (!(!finished && Date.now() < deadline)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, utils_ts_1.sleep)(20)];
            case 3:
                _a.sent();
                finished = (0, bash_process_registry_1.getFinishedSession)(sessionId);
                return [3 /*break*/, 2];
            case 4:
                running = (0, bash_process_registry_1.getSession)(sessionId);
                try {
                    (0, vitest_1.expect)(finished).toBeTruthy();
                    (0, vitest_1.expect)(finished === null || finished === void 0 ? void 0 : finished.status).toBe("failed");
                }
                finally {
                    pid = running === null || running === void 0 ? void 0 : running.pid;
                    if (pid) {
                        (0, shell_utils_1.killProcessTree)(pid);
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.test)("yielded background exec is not killed when tool signal aborts", function () { return __awaiter(void 0, void 0, void 0, function () {
    var tool, abortController, result, sessionId, running, finished, pid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tool = (0, bash_tools_exec_1.createExecTool)({ allowBackground: true, backgroundMs: 10 });
                abortController = new AbortController();
                return [4 /*yield*/, tool.execute("toolcall", { command: 'node -e "setTimeout(() => {}, 5000)"', yieldMs: 5 }, abortController.signal)];
            case 1:
                result = _a.sent();
                (0, vitest_1.expect)(result.details.status).toBe("running");
                sessionId = result.details.sessionId;
                abortController.abort();
                return [4 /*yield*/, (0, utils_ts_1.sleep)(150)];
            case 2:
                _a.sent();
                running = (0, bash_process_registry_1.getSession)(sessionId);
                finished = (0, bash_process_registry_1.getFinishedSession)(sessionId);
                try {
                    (0, vitest_1.expect)(finished).toBeUndefined();
                    (0, vitest_1.expect)(running === null || running === void 0 ? void 0 : running.exited).toBe(false);
                }
                finally {
                    pid = running === null || running === void 0 ? void 0 : running.pid;
                    if (pid) {
                        (0, shell_utils_1.killProcessTree)(pid);
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.test)("yielded background exec still times out", function () { return __awaiter(void 0, void 0, void 0, function () {
    var tool, result, sessionId, finished, deadline, running, pid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tool = (0, bash_tools_exec_1.createExecTool)({ allowBackground: true, backgroundMs: 10 });
                return [4 /*yield*/, tool.execute("toolcall", {
                        command: 'node -e "setTimeout(() => {}, 5000)"',
                        yieldMs: 5,
                        timeout: 0.2,
                    })];
            case 1:
                result = _a.sent();
                (0, vitest_1.expect)(result.details.status).toBe("running");
                sessionId = result.details.sessionId;
                finished = (0, bash_process_registry_1.getFinishedSession)(sessionId);
                deadline = Date.now() + (process.platform === "win32" ? 10000 : 2000);
                _a.label = 2;
            case 2:
                if (!(!finished && Date.now() < deadline)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, utils_ts_1.sleep)(20)];
            case 3:
                _a.sent();
                finished = (0, bash_process_registry_1.getFinishedSession)(sessionId);
                return [3 /*break*/, 2];
            case 4:
                running = (0, bash_process_registry_1.getSession)(sessionId);
                try {
                    (0, vitest_1.expect)(finished).toBeTruthy();
                    (0, vitest_1.expect)(finished === null || finished === void 0 ? void 0 : finished.status).toBe("failed");
                }
                finally {
                    pid = running === null || running === void 0 ? void 0 : running.pid;
                    if (pid) {
                        (0, shell_utils_1.killProcessTree)(pid);
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
