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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var pi_tools_js_1 = require("./pi-tools.js");
vitest_1.vi.mock("../infra/exec-approvals.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var mod, approvals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                mod = _a.sent();
                approvals = {
                    path: "/tmp/exec-approvals.json",
                    socketPath: "/tmp/exec-approvals.sock",
                    token: "token",
                    defaults: {
                        security: "allowlist",
                        ask: "off",
                        askFallback: "deny",
                        autoAllowSkills: false,
                    },
                    agent: {
                        security: "allowlist",
                        ask: "off",
                        askFallback: "deny",
                        autoAllowSkills: false,
                    },
                    allowlist: [],
                    file: {
                        version: 1,
                        socket: { path: "/tmp/exec-approvals.sock", token: "token" },
                        defaults: {
                            security: "allowlist",
                            ask: "off",
                            askFallback: "deny",
                            autoAllowSkills: false,
                        },
                        agents: {},
                    },
                };
                return [2 /*return*/, __assign(__assign({}, mod), { resolveExecApprovals: function () { return approvals; } })];
        }
    });
}); });
(0, vitest_1.describe)("createOpenClawCodingTools safeBins", function () {
    (0, vitest_1.it)("threads tools.exec.safeBins into exec allowlist checks", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmpDir, cfg, tools, execTool, marker, result, text;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (process.platform === "win32") {
                        return [2 /*return*/];
                    }
                    tmpDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-safe-bins-"));
                    cfg = {
                        tools: {
                            exec: {
                                host: "gateway",
                                security: "allowlist",
                                ask: "off",
                                safeBins: ["echo"],
                            },
                        },
                    };
                    tools = (0, pi_tools_js_1.createOpenClawCodingTools)({
                        config: cfg,
                        sessionKey: "agent:main:main",
                        workspaceDir: tmpDir,
                        agentDir: node_path_1.default.join(tmpDir, "agent"),
                    });
                    execTool = tools.find(function (tool) { return tool.name === "exec"; });
                    (0, vitest_1.expect)(execTool).toBeDefined();
                    marker = "safe-bins-".concat(Date.now());
                    return [4 /*yield*/, execTool.execute("call1", {
                            command: "echo ".concat(marker),
                            workdir: tmpDir,
                        })];
                case 1:
                    result = _c.sent();
                    text = (_b = (_a = result.content.find(function (content) { return content.type === "text"; })) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
                    (0, vitest_1.expect)(result.details.status).toBe("completed");
                    (0, vitest_1.expect)(text).toContain(marker);
                    return [2 /*return*/];
            }
        });
    }); });
});
